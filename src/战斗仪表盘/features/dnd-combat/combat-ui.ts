// features/dnd-combat/combat-ui.ts
// 战斗面板（单位详情/技能列表）（b7 · 自 BasedonST `src/ui/modules/UICombat.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createCombatUiFragment(deps: any): any {
  return {
    showCombatUnitDetail(unit, event) {
        const { $ } = deps.utils.getCore();
        
        // 解析 HP
        const hpStr = unit['HP状态'] || '??/??';
        
        // 样式根据阵营
        const isEnemy = unit['阵营'] === '敌方';
        const color = isEnemy ? 'var(--dnd-accent-red)' : 'var(--dnd-text-highlight)';
        
        const html = `
            <div style="border-bottom:1px solid ${color};padding-bottom:5px;margin-bottom:10px;font-weight:bold;color:${color};font-size:16px;display:flex;justify-content:space-between;">
                <span>${unit['单位名称']}</span>
                <span style="font-size:12px;background:var(--dnd-bg-tertiary);padding:2px 6px;border-radius:4px;color:var(--dnd-text-main);">${unit['阵营']}</span>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;font-size:13px;">
                <div style="background:var(--dnd-bg-secondary);padding:8px;border-radius:4px;">
                    <div style="color:var(--dnd-text-dim);font-size:11px;">HP 状态</div>
                    <div style="font-weight:bold;color:var(--dnd-text-main);">${hpStr}</div>
                </div>
                <div style="background:var(--dnd-bg-secondary);padding:8px;border-radius:4px;">
                    <div style="color:var(--dnd-text-dim);font-size:11px;">先攻 / 位置</div>
                    <div style="font-weight:bold;color:var(--dnd-text-main);">${unit['先攻/位置'] || '-'}</div>
                </div>
            </div>

            <div style="margin-bottom:10px;">
                <div style="color:var(--dnd-text-dim);font-size:12px;margin-bottom:3px;">防御 / 抗性</div>
                <div style="color:var(--dnd-text-main);font-size:13px;background:var(--dnd-bg-input);padding:5px;border-radius:3px;">${unit['防御/抗性'] || '无'}</div>
            </div>
            
            <div style="margin-bottom:10px;">
                <div style="color:var(--dnd-text-dim);font-size:12px;margin-bottom:3px;">附着状态</div>
                <div style="color:var(--dnd-text-header);font-size:13px;background:var(--dnd-bg-input);padding:5px;border-radius:3px;">${unit['附着状态'] || '无'}</div>
            </div>

            <div>
                <div style="color:var(--dnd-text-dim);font-size:12px;margin-bottom:3px;">回合资源</div>
                <div style="color:var(--dnd-text-main);font-size:12px;line-height:1.4;">${unit['回合资源'] || '-'}</div>
            </div>
        `;
        
        ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.( html, event.clientX, event.clientY);
    },

    // [新增] 显示战斗技能列表 (当前操控角色技能)
    showCombatSkillList(event) {
        console.log('[DND Dashboard] showCombatSkillList called');

                // --- 新增：针对第四阶段（瞄准中）的取消逻辑 ---
        if (this._targetingMode && this._targetingMode.active) {
            deps.logger.info('[Skill] 处于瞄准模式，再次点击大按钮执行取消');
            this.endTargeting(); // 调用现成的结束瞄准函数，它会自动清理地图效果和提示文字
            return; // 直接返回，不再执行下面打开列表的逻辑
        }
        
        // 获取当前操控的角色
        const current = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
        
        if (!current) {
            deps.notification.warning('未找到当前操控角色数据。');
            return;
        }
        
        const charId = current['PC_ID'] || current['CHAR_ID'] || current['姓名'];
        // 尝试获取技能 (同时尝试使用 ID 和 姓名 查找，以防匹配失败)
        let skills = deps.dataManager.getCharacterSkills(charId);
        if ((!skills || skills.length === 0) && current['姓名'] && current['姓名'] !== charId) {
            skills = deps.dataManager.getCharacterSkills(current['姓名']);
        }
        
        if (!skills || skills.length === 0) {
            // 尝试显示提示而不是直接退出
            const html = `<div style="padding:15px;text-align:center;">
                <div style="font-weight:bold;color:var(--dnd-text-highlight);margin-bottom:10px;"><i class="fa-solid fa-bolt"></i> ${current['姓名']}</div>
                <div style="color:var(--dnd-text-dim);">该角色暂无已学习的技能或法术。</div>
            </div>`;
            ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.( html, event.clientX, event.clientY);
            return;
        }

        // 简单分类：动作、附赠动作、反应
        const grouped = {
            '动作': [],
            '附赠动作': [],
            '反应': [],
            '其他': []
        };
        
        // 处理所有能力 (技能 + 法术)
        const processAbility = (s) => {
            const isSpell = s['技能类型'] === '法术';
            const name = s['技能名称'];
            const time = (s['施法时间'] || '').toLowerCase();
            
            // 解析动作花费类型
            let costType = 'Action';
            if (time.includes('bonus') || time.includes('附赠')) costType = 'Bonus';
            else if (time.includes('reaction') || time.includes('反应')) costType = 'Reaction';
            else if (time.includes('free') || time.includes('自由')) costType = 'Free';
            
            const item = { ...s, _isSpell: isSpell, _displayName: name, _costType: costType };
            
            if (costType === 'Bonus') grouped['附赠动作'].push(item);
            else if (costType === 'Reaction') grouped['反应'].push(item);
            else grouped['动作'].push(item);
        };

        if (skills) skills.forEach(s => processAbility(s));
        
        let html = `<div style="font-weight:bold;color:var(--dnd-text-highlight);border-bottom:1px solid var(--dnd-border-subtle);padding-bottom:5px;margin-bottom:10px;"><i class="fa-solid fa-bolt"></i> ${current['姓名']} 的技能</div>`;
        html += `<div style="max-height:300px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">`;
        
        let hasSkills = false;
        Object.keys(grouped).forEach(type => {
            if (grouped[type].length === 0) return;
            hasSkills = true;
            
            html += `<div style="font-size:12px;color:var(--dnd-text-dim);border-bottom:1px dashed var(--dnd-border-subtle);margin-top:5px;">${type}</div>`;
            grouped[type].forEach(s => {
                const rawName = s._displayName || '未命名';
                const safeName = rawName.replace(/'/g, "\\'").replace(/"/g, '"');
                const safeRange = (s['射程'] || '接触').replace(/'/g, "\\'");
                const isSpell = s._isSpell;
                const icon = isSpell ? '<i class="fa-solid fa-scroll"></i>' : '<i class="fa-solid fa-gavel"></i>';
                const costType = s._costType;
                
                const actionType = isSpell ? 'spell' : 'skill';
                const lvlVal = s['环阶'];
                const isCantrip = lvlVal === '0' || lvlVal === 0 || lvlVal === '戏法' || !lvlVal;
                
                let onClick = '';
                if (isSpell && !isCantrip) {
                    onClick = `window.DND_Dashboard_UI.prepareCast('${safeName}', '${safeRange}', '${lvlVal}', '${costType}')`;
                } else {
                    onClick = `window.DND_Dashboard_UI.handleCastClick('${safeName}', '${safeRange}', '${lvlVal||''}', '${actionType}', '${costType}')`;
                }
                
                html += `
                    <div class="dnd-clickable" style="padding:6px;background:var(--dnd-bg-input);border-radius:4px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;"
                        onclick="${onClick}">
                        <span style="color:var(--dnd-text-main);">${icon} ${rawName}</span>
                        <span style="font-size:10px;color:var(--dnd-text-dim);">${s['射程']||'-'}</span>
                    </div>
                `;
            });
        });
        
        if (!hasSkills) {
            html += `<div style="color:var(--dnd-text-dim);text-align:center;padding:10px;">无技能显示</div>`;
        }

        html += `</div>`;
        ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.( html, event.clientX, event.clientY);
    }
  };
}
