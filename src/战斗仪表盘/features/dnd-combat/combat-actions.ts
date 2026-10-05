// features/dnd-combat/combat-actions.ts
// 动作执行（队列/提交/清空）（b7 · 自 BasedonST `src/ui/modules/UICombat.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createCombatActionsFragment(deps: any): any {
  return {
    _actionQueue: [],
    _virtualPosPool: {}, // [修改] 记录每个角色移动后的虚拟位置 { charId: {x, y} }


    // [修改] 手动调整动作资源（指向当前角色缓存）
    executeAction(type, data, costType) {
        const { x, y, target, distance } = data;
        const activeChar = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
        const charName = activeChar ? activeChar['姓名'] : '我';
        
        // 获取该角色的资源缓存引用
        const activeId = activeChar ? (activeChar['CHAR_ID'] || activeChar['PC_ID'] || activeChar['姓名']) : 'default';
        const resCache = (activeId && this._turnResources[activeId]) ? this._turnResources[activeId] : null;

        const coord = `${String.fromCharCode(64 + x)}${y}`;
        let desc = '';
        
        // 特殊技能自动化逻辑
        const skillName = (this._targetingMode.skillName || '').toLowerCase();
        let extraDesc = '';
        
        // 疾走 (Dash): 增加缓存中的移动力
        if (skillName.includes('dash') || skillName.includes('疾走') || skillName.includes('冲刺')) {
            const speed = parseInt(activeChar['速度']) || 30;
            if (resCache) resCache.movement += speed;
            extraDesc = ` (疾走: +${speed}尺移动)`;
        }
        
        // 动作如潮: 增加缓存中的动作
        if (skillName.includes('action surge') || skillName.includes('动作如潮')) {
            if (resCache) resCache.action++;
            extraDesc = ` (动作如潮: +1 动作)`;
        }

        // 扣除资源
        if (type === 'move') {
            const cost = (distance || 0) * 5;
            if (resCache && resCache.movement < cost) {
                deps.notification.warning(`移动距离不足！剩余: ${resCache.movement}尺, 需要: ${cost}尺`);
                return;
            }
            if (resCache) resCache.movement -= cost;


            //调用棋盘坐标转为数字坐标
            desc = `移动到了 ${this.chessCoordToNumStr(coord)}`;
            
            // [修改] 更新当前角色的虚拟位置
            this._virtualPosPool[activeId] = { x, y };
        } else {
            let key = (costType || 'Action').toLowerCase();
            if (skillName.includes('action surge') || skillName.includes('动作如潮')) {
                key = 'free';
            }

            if (resCache && resCache[key] !== undefined) {
                if (resCache[key] <= 0) {
                    deps.notification.warning(`没有足够的 ${costType}！`);
                    return;
                }
                resCache[key]--;
            }
            
            const skill = this._targetingMode.skillName;
            if (target) {
                desc = `对 ${target} 施放了 【${skill}】${extraDesc}`;
            } else {
                //调用棋盘坐标转为数字坐标
                desc = `在 ${this.chessCoordToNumStr(coord)} 施放了 【${skill}】${extraDesc}`;
            }
        }
        
        // 加入队列 (增加 charId 和 charName 供 commit 分组使用)
        this._actionQueue.push({ type, data, desc, charName, charId: activeId });
        
        // 刷新界面
        ((window as any).DND_Dashboard_UI || this).renderHUD?.( );
    },

    // [修改] 提交行动队列 (支持多角色分组输出)
    commitActions() {
        if (this._actionQueue.length === 0) return;
        
        // 按角色名分组
        const groups = {};
        this._actionQueue.forEach(item => {
            if (!groups[item.charName]) groups[item.charName] = [];
            groups[item.charName].push(item.desc);
        });

        // 生成最终提示词串
        const messages = Object.entries(groups).map(([name, steps]) => {
            const actionStr = steps.length === 1 ? steps[0] : steps.join('，然后 ');
            return `轮到${name}的回合时，${actionStr}。`;
        });
        
        ((window as any).DND_Dashboard_UI || this).fillChatInput?.( messages.join(' '));
        this.clearActions();
    },

    // [修改] 清空行动队列时，彻底清空整个资源缓存池和位置池
    clearActions() {
        this._actionQueue = [];
        this._virtualPosPool = {}; // 清理所有角色的虚拟位置
        this._turnResources = {}; // 重置所有角色的临时资源
        this._forceReset = true;  // 标记需要重新从表格读取
        this.resetActionEconomy(); 
    },

    // 显示战斗单位详情
  };
}
