// features/dnd-combat/combat-cast.ts
// 施法与瞄准（点击/准备/目标选择）（b7 · 自 BasedonST `src/ui/modules/UICombat.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createCombatCastFragment(deps: any): any {
  return {
    _targetingMode: {
        active: false,
        type: null, // 'move' or 'skill'
        source: null, // character object
        range: 0, // in grid units
        skillName: null,
        callback: null
    },

    // [新增] 行动队列状态
    handleCastClick(name, range, level, type, costType) {
        const global = deps.dataManager.getTable('SYS_GlobalState');
        const isCombat = global && global[0] && global[0]['战斗模式'] === '战斗中';
        
        ((window as any).DND_Dashboard_UI || this).hideDetailPopup?.( );
        
        if (isCombat) {
            // 战斗状态：进入瞄准模式
            this.startTargeting({
                type: type || 'skill',
                rangeText: range,
                skillName: name,
                costType: costType || 'Action', // 默认标准动作
                callback: (res) => this.executeAction(type || 'skill', res, costType || 'Action')
            });
        } else {
            // 非战斗状态：直接输出文本
            let text = '';
            if (type === 'spell') {
                if (level === '0' || level === '戏法' || !level) {
                    text = `我施放了戏法：${name}`;
                } else {
                    text = `我使用 ${level} 环法术位施放了 ${name}`;
                }
            } else {
                text = `我使用了技能：${name}`;
            }
            ((window as any).DND_Dashboard_UI || this).fillChatInput?.( text);
        }
    },

    // [新增] 准备施法 (选择环阶)
    prepareCast(spellName, rangeText, baseLevelStr, costType) {
        // 解析环阶
        let baseLevel = 0;
        if (baseLevelStr && baseLevelStr !== '戏法' && baseLevelStr !== '0') {
            baseLevel = parseInt(baseLevelStr) || 1;
        }
        
        // 如果是戏法，直接调用处理
        if (baseLevel === 0) {
            this.handleCastClick(spellName, rangeText, '0', 'spell');
            return;
        }
        
        // 获取当前角色及其法术位
        const pc = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
        const maxSlot = deps.dataManager.getMaxSpellSlotLevel(pc) || 9;
        const slots = deps.dataManager.parseValue(pc['法术位'], 'resources') || {};
        
        // 如果基础环阶高于最大环阶（例如卷轴施法），则以上限为准，或者至少允许施放基础
        const limit = Math.max(baseLevel, maxSlot);

        // 否则显示环阶选择
        const { $ } = deps.utils.getCore();
        const $popup = $('#dnd-detail-popup-el');
        if ($popup.length) {
            let html = `<div style="font-weight:bold;color:var(--dnd-text-highlight);margin-bottom:10px;text-align:center;">${deps.icons.SPARKLES} 选择施法环阶 (${spellName})</div>`;
            html += `<div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;">`;
            
            for (let i = baseLevel; i <= limit; i++) {
                // 检查是否有可用法术位
                const slotKey = Object.keys(slots).find(k => parseInt(k) === i);
                let available = 0;
                if (slotKey) {
                    const parts = slots[slotKey].toString().split('/');
                    available = parseInt(parts[0]) || 0;
                }
                const isDisabled = available <= 0;
                
                // 使用转义字符处理 spellName 中的潜在特殊字符
                const safeName = spellName.replace(/'/g, "\\'");
                
                // 样式处理
                const style = isDisabled
                    ? "background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-dim);padding:8px;border-radius:4px;cursor:not-allowed;"
                    : "background:var(--dnd-bg-input);border:1px solid var(--dnd-border-inner);color:var(--dnd-text-main);padding:8px;border-radius:4px;cursor:pointer;font-weight:bold;";
                
                const action = isDisabled
                    ? ""
                    : `onclick="window.DND_Dashboard_UI.handleCastClick('${safeName}', '${rangeText}', '${i}', 'spell','${costType || 'Action'}')"`;
                    
                const mouseOver = isDisabled
                    ? ""
                    : `onmouseover="this.style.borderColor='var(--dnd-border-gold)';this.style.color='var(--dnd-text-highlight)';this.style.background='var(--dnd-bg-tertiary)'"`;
                    
                const mouseOut = isDisabled
                    ? ""
                    : `onmouseout="this.style.borderColor='var(--dnd-border-inner)';this.style.color='var(--dnd-text-main)';this.style.background='var(--dnd-bg-input)'"`;

                html += `
                    <button class="dnd-clickable" style="${style}" ${mouseOver} ${mouseOut} ${action}>
                        ${i} 环 ${isDisabled ? '(0)' : `(${available})`}
                    </button>
                `;
            }
            html += `</div>`;
            
            // 替换当前弹窗内容
            const $content = $popup.find('> div:not(:first-child)');
            if ($content.length) {
                $content.html(html);
            } else {
                // Fallback
                $popup.append('<div style="padding-right:20px;">' + html + '</div>');
            }
        }
    },

    // [新增] 开启瞄准模式
    startTargeting(config) {
        deps.logger.debug('[Targeting] Start config:', config);
        const { type, source, rangeText, skillName, costType } = config;

        // --- 新增切换逻辑：如果已经是当前模式，则取消 ---
        if (this._targetingMode.active && this._targetingMode.type === type) {
            deps.logger.info('[Targeting] 再次点击相同模式，执行取消');
            this.endTargeting();
            return;
        }
        // ----------------------------------------------

        //const range = this.parseDistance(rangeText);
        
        // 获取当前操作角色
        const activeChar = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
        const activeId = activeChar ? (activeChar['CHAR_ID'] || activeChar['PC_ID'] || activeChar['姓名']) : 'default';

        let range;
        // 如果是移动模式，直接从临时资源缓存池里读。如果池子里没这个人，就解析传入的文本
        if (type === 'move' && activeId !== 'default' && this._turnResources[activeId]) {
            range = Math.floor(this._turnResources[activeId].movement / 5);
            deps.logger.info(`[Targeting] 移动模式：使用池化资源 ${this._turnResources[activeId].movement}尺 -> ${range}格`);
        } else {
            range = this.parseDistance(rangeText);
        }

        // 检查资源是否足够 (提前检查)
        if (type !== 'move' && costType) {
            const key = costType.toLowerCase();
            if (this._turnResources[key] <= 0) {
                deps.notification.warning(`<i class="fa-solid fa-times-circle"></i> 无法执行：${costType} 资源已耗尽！`);
                return;
            }
        }
        
        this._targetingMode = {
            active: true,
            type: type || 'skill',
            source: source || null, 
            range: range,
            skillName: skillName || '行动',
            costType: costType,
            callback: config.callback
        };
        
        // 刷新地图以显示范围
        ((window as any).DND_Dashboard_UI || this).renderHUD?.( );

    },

    // [新增] 结束瞄准模式
    endTargeting() {
        this._targetingMode = { active: false, type: null, source: null, range: 0 };
        // 清除虚拟位置，以确保下次瞄准从真实位置开始 (或者在 executeAction 中更新)
        
        ((window as any).DND_Dashboard_UI || this).renderHUD?.( );
        ((window as any).DND_Dashboard_UI || this).hideDetailPopup?.( );
    },



    //棋盘坐标转为数字坐标函数

    /**
     * 棋盘坐标 a7 / h13 → "(x,y)" 数字字符串，仅用于页面展示
     * @param {string} coordStr 原始coord，如 "a7"
     * @returns {string}
     */
    chessCoordToNumStr(coordStr) {
        const match = coordStr.match(/^([a-zA-Z]+)(\d+)$/);
        if (!match) return coordStr;

        const [_, letterRaw, yRaw] = match;
        const letter = letterRaw.toLowerCase();
        const y = Number(yRaw);

        let x = 0;
        for(let i = 0; i < letter.length; i++){
            x = x * 26 + (letter.charCodeAt(i) - 'a'.charCodeAt(0) + 1);
        }
        return `(${x},${y})`;
    },





    // 执行最终动作 (加入队列并扣除临时资源)
  };
}
