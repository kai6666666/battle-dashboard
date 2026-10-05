// features/dnd-map/map-ui-interaction.ts
// 地图交互（网格点击/移动）（b8 · 自 BasedonST `src/ui/modules/UIMap.js` 拆分移植）
import { DND_CONFIG } from '../dnd-core';

export function createMapUiInteractionFragment(deps: any): any {
  return {
    handleMapInteraction(gridX, gridY) {
        const state = this._targetingMode;
        const encounters = deps.dataManager.getTable('COMBAT_Encounter');
        const mapData = deps.dataManager.getTable('COMBAT_BattleMap');
        const activeChar = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
        const activeId = activeChar ? (activeChar['CHAR_ID'] || activeChar['PC_ID'] || activeChar['姓名']) : 'default';

        // --- A. 瞄准模式 ---
        if (state.active) {
            // 1. 计算距离
            let dist = 999;
            let sourcePos = { x: 0, y: 0 };
            

            // 获取源头位置 (优先使用当前角色的虚拟位置池)
            if (activeId && this._virtualPosPool && this._virtualPosPool[activeId]) {
                sourcePos = { ...this._virtualPosPool[activeId] };
            } else if (encounters && activeChar) {
                // [修复] 尝试模糊匹配名称
                let activeUnit = encounters.find(u => u['单位名称'] === activeChar['姓名']);
                if (!activeUnit && activeChar['姓名']) {
                    activeUnit = encounters.find(u => activeChar['姓名'].includes(u['单位名称']) || u['单位名称'].includes(activeChar['姓名']));
                }

                const token = mapData ? mapData.find(m => m['类型'] === 'Token' && m['单位名称'] === (activeUnit ? activeUnit['单位名称'] : '')) : null;
                if (token) {
                    const p = deps.dataManager.parseValue(token['坐标'], 'coord');
                    if (p) sourcePos = { x: p.x || 1, y: p.y || 1 };
                }
            }
            
            // 简单切比雪夫距离 (DND 5e 规则通常也是对角线算1格，或 1-2-1 规则)
            // 这里使用最简单的 max(|dx|, |dy|) 规则 (Default 5e grid rule)
            const dx = Math.abs(gridX - sourcePos.x);
            const dy = Math.abs(gridY - sourcePos.y);
            dist = Math.max(dx, dy);
            
            // 2. 检查距离
            if (dist > state.range) {
                deps.notification.warning(`目标超出范围！(距离: ${dist * 5}尺 / 射程: ${state.range * 5}尺)`);
                return;
            }
            
            // 3. 检查是否有目标单位
            let targetName = null;
            const targetToken = mapData.find(m => m['类型'] === 'Token' && m['坐标'] &&
                deps.dataManager.parseValue(m['坐标'], 'coord').x === gridX &&
                deps.dataManager.parseValue(m['坐标'], 'coord').y === gridY);
                
            if (targetToken) targetName = targetToken['单位名称'];
            
            // 4. 执行回调
            if (state.callback) {
                state.callback({
                    x: gridX,
                    y: gridY,
                    target: targetName,
                    distance: dist
                });
            }
            
            // 5. 退出模式
            ((window as any).DND_Dashboard_UI || this).endTargeting?.( );
            return;
        }
        
        // --- B. 普通模式 (点击空地) ---
        // 显示简易菜单: "移动到这里"
        const menuHtml = `
            <div style="font-weight:bold;color:var(--dnd-text-highlight);border-bottom:1px solid var(--dnd-border-subtle);padding-bottom:5px;margin-bottom:5px;">
                <i class="fa-solid fa-location-dot"></i> 位置: ${String.fromCharCode(64 + gridX)}${gridY}
            </div>
            <div class="dnd-clickable" style="padding:8px;cursor:pointer;border-radius:4px;background:var(--dnd-bg-tertiary);border:1px solid var(--dnd-accent-green);text-align:center;font-weight:bold;color:var(--dnd-text-main);"
                onclick="window.DND_Dashboard_UI.executeAction('move', { x: ${gridX}, y: ${gridY} }); window.DND_Dashboard_UI.hideDetailPopup();">
                👣 移动到此
            </div>
        `;
        // 计算屏幕坐标显示菜单
        const { $ } = deps.utils.getCore();
        const $hud = $('#dnd-mini-hud');
        const hudRect = $hud[0].getBoundingClientRect();
        ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.( menuHtml, hudRect.left + hudRect.width/2, hudRect.top + hudRect.height/2);
    }
  };
}
