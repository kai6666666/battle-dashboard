// features/dnd-combat/combat-state.ts
// 战斗状态与行动经济（资源跟踪/重置/消耗）（b7 · 自 BasedonST `src/ui/modules/UICombat.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createCombatStateFragment(deps: any): any {
  return {
    _resourceTracker: {
        // Keyed by charId: { spellSlots: {}, classResources: {} }
        snapshots: {}
    },


    _turnResources: {},


    // [新增] 瞄准模式状态
    adjustTurnResource(type) {
        const char = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
        const charId = char ? (char['CHAR_ID'] || char['PC_ID'] || char['姓名']) : null;
        if (!charId || !this._turnResources[charId]) return;

        if (type === 'movement') {
            this._turnResources[charId].movement += 30;
        } else if (this._turnResources[charId][type] !== undefined) {
            this._turnResources[charId][type]++;
        }
        ((window as any).DND_Dashboard_UI || this).renderHUD?.( );
        deps.presetSwitcher.showNotification(true, `已添加资源: ${type}`);
    },

    resetActionEconomy(charId) {
        // 如果未传入 charId，尝试获取当前操控者
        const char = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
        const targetId = charId || (char ? (char['CHAR_ID'] || char['PC_ID'] || char['姓名']) : null);
        
        if (!targetId) return;

        // 如果缓存里已经有这个角色的资源记录且不是强制重置，就不要刷新
        if (this._turnResources[targetId] && !this._forceReset) return;

        // 尝试从属性读取速度
        let speed = 30; // 必须先定义初始值
        if (char && char['速度']) {
            const parsed = parseInt(char['速度']);
            if (!isNaN(parsed)) speed = parsed;
        }

        // 尝试从职业资源中读取自定义覆盖 (如 "每轮动作: 2")
        const res = deps.dataManager.parseValue(char['职业资源'], 'resources') || {};
        const findMax = (keywords, defaultVal) => {
            const key = Object.keys(res).find(k => keywords.some(w => k.toLowerCase().includes(w.toLowerCase())));
            if (key) {
                const parts = res[key].toString().split('/');
                return parseInt(parts[1]) || parseInt(parts[0]) || defaultVal;
            }
            return defaultVal;
        };

        // [核心修改]：只更新当前角色的 ID 槽位，而不是覆盖整个资源对象
        this._turnResources[targetId] = {
            action: findMax(['每轮动作', 'Actions Per Turn'], 1),
            bonus: findMax(['每轮附赠', 'Bonus Per Turn'], 1),
            reaction: findMax(['每轮反应', 'Reactions Per Turn'], 1),
            movement: speed
        };
        
        // 重置完后关闭强制重置标记
        this._forceReset = false;
        
        ((window as any).DND_Dashboard_UI || this).renderHUD?.( );
    },

    initResourceTracker() {
        const char = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
        if (!char) return;
        
        const charId = char['CHAR_ID'] || char['PC_ID'] || char['姓名'];
        
        this._resourceTracker.snapshots[charId] = {
            spellSlots: JSON.parse(JSON.stringify(deps.dataManager.parseValue(char['法术位'], 'resources') || {})),
            classResources: JSON.parse(JSON.stringify(deps.dataManager.parseValue(char['职业资源'], 'resources') || {}))
        };
        deps.logger.info('Resource tracker initialized for', char['姓名']);
    },

    calculateResourceConsumption() {
        const char = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
        if (!char) return null;
        
        const charId = char['CHAR_ID'] || char['PC_ID'] || char['姓名'];
        const snapshot = this._resourceTracker.snapshots[charId];
        
        if (!snapshot) return null;
        
        const currentSlots = deps.dataManager.parseValue(char['法术位'], 'resources') || {};
        const currentRes = deps.dataManager.parseValue(char['职业资源'], 'resources') || {};
        
        const consumption = {
            spellSlots: {},
            classResources: {}
        };
        
        // 计算法术位消耗
        if (snapshot.spellSlots) {
            for (const [level, val] of Object.entries(snapshot.spellSlots)) {
                const startParts = val.toString().split('/');
                const startCurr = parseInt(startParts[0]) || 0;
                
                const currVal = currentSlots[level] || "0/0";
                const currParts = currVal.toString().split('/');
                const currCurr = parseInt(currParts[0]) || 0;
                
                if (startCurr > currCurr) {
                    consumption.spellSlots[level] = startCurr - currCurr;
                }
            }
        }
        
        // 计算职业资源消耗
        if (snapshot.classResources) {
            for (const [name, val] of Object.entries(snapshot.classResources)) {
                let startVal = parseInt(val);
                if (val.toString().includes('/')) {
                    startVal = parseInt(val.toString().split('/')[0]) || 0;
                }
                
                let currRaw = currentRes[name] || 0;
                let currVal = parseInt(currRaw);
                if (currRaw.toString().includes('/')) {
                    currVal = parseInt(currRaw.toString().split('/')[0]) || 0;
                }
                
                if (!isNaN(startVal) && !isNaN(currVal) && startVal > currVal) {
                    consumption.classResources[name] = startVal - currVal;
                }
            }
        }
        
        return consumption;
    },

    renderResourceConsumption($container) {
        const consumption = this.calculateResourceConsumption();
        if (!consumption) {
            $container.html('');
            return;
        }
        
        const hasSlots = Object.keys(consumption.spellSlots).length > 0;
        const hasRes = Object.keys(consumption.classResources).length > 0;
        
        if (!hasSlots && !hasRes) {
            $container.html('');
            return;
        }
        
        let html = `<div class="dnd-resource-consumption" style="margin-top:10px;padding:8px;background:var(--dnd-bg-secondary);border-radius:4px;border:1px dashed var(--dnd-border-subtle);">
            <div style="font-size:11px;color:var(--dnd-text-dim);margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;">
                <span><i class="fa-solid fa-bolt"></i> 本场战斗消耗</span>
                <span class="dnd-clickable" style="cursor:pointer;color:var(--dnd-text-dim);font-size:14px;line-height:1;" title="重置统计" onclick="window.DND_Dashboard_UI.initResourceTracker(); window.DND_Dashboard_UI.renderHUD();"><i class="fa-solid fa-sync"></i></span>
            </div>`;
        
        if (hasSlots) {
            html += `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:4px;">`;
            for (const [level, used] of Object.entries(consumption.spellSlots)) {
                html += `<span style="font-size:10px;color:var(--dnd-accent-red);background:var(--dnd-bg-tertiary);padding:1px 4px;border-radius:2px;">${level}: -${used}</span>`;
            }
            html += `</div>`;
        }
        
        if (hasRes) {
            html += `<div style="display:flex;flex-wrap:wrap;gap:5px;">`;
            for (const [name, used] of Object.entries(consumption.classResources)) {
                html += `<span style="font-size:10px;color:var(--dnd-text-highlight);background:var(--dnd-bg-tertiary);padding:1px 4px;border-radius:2px;">${name}: -${used}</span>`;
            }
            html += `</div>`;
        }
        
        html += `</div>`;
        $container.html(html);
    },

    // [新增] 解析距离文本为格子数 (默认 1格=5尺)
    parseDistance(text) {
        if (!text) return 1; // 默认接触
        const str = String(text).toLowerCase();
        
        // 接触/自身
        if (str.includes('接触') || str.includes('touch') || str.includes('self') || str.includes('自身')) return 1;
        
        // 提取数字
        const match = str.match(/(\d+)/);
        if (match) {
            const val = parseInt(match[1]);
            // 假设单位是尺/ft，转换为格子 (5ft = 1格)
            return Math.max(1, Math.ceil(val / 5));
        }
        return 6; // 默认 30尺
    },

    // [新增] 智能施法处理 (根据战斗状态决定逻辑)
  };
}
