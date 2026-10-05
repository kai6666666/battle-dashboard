// features/dnd-map/map-ui-regen.ts
// 地图重绘（重新生成/刷新）（b8 · 自 BasedonST `src/ui/modules/UIMap.js` 拆分移植）
import { DND_CONFIG } from '../dnd-core';

export function createMapUiRegenFragment(deps: any): any {
  return {
    async regenerateMap(locationName, mode) {
        const { $ } = deps.utils.getCore();
        const global = deps.dataManager.getTable('SYS_GlobalState');
        const isCombat = global && global[0] && global[0]['战斗模式'] === '战斗中';
        
        let confirmMsg = '确定要重新绘制地图图片吗？结构将保持不变。';
        if (isCombat) confirmMsg = '确定要重新生成战斗场景底图吗？这需要消耗 tokens。';

        const confirmed = await deps.notification.confirm(confirmMsg, {
            title: '重绘地图',
            confirmText: '重绘',
            type: 'warning'
        });
        if (!confirmed) return;

        // Show spinner
        let $container = $('#dnd-hud-minimap-content');
        // If in combat mode, we might want to keep the grid and just show a spinner overlay,
        // but for simplicity, full blocking spinner is fine or finding the inner container.
        
        if (isCombat) {
             // Find specific bg container or overlay
             const $bg = $('.dnd-minimap-inner');
             if ($bg.length) {
                 // Add loading overlay to map only
                 $bg.append(`<div id="dnd-map-loading-overlay" style="position:absolute;top:0;left:0;width:100%;height:100%;background:var(--dnd-bg-secondary);z-index:100;display:flex;align-items:center;justify-content:center;color:var(--dnd-text-main);">
                    <div style="text-align:center;">
                        <div class="dnd-spinner" style="width:24px;height:24px;border:3px solid var(--dnd-border-subtle);border-top:3px solid var(--dnd-border-gold);border-radius:50%;animation:dnd-spin 1s infinite linear;margin:0 auto 5px;"></div>
                        <div style="font-size:10px;">AI 正在构筑战场...</div>
                    </div>
                 </div>`);
             }
        } else {
             $container.html(`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--dnd-text-main);flex-direction:column;gap:5px;">
                <div class="dnd-spinner" style="width:24px;height:24px;border:3px solid var(--dnd-border-subtle);border-top:3px solid var(--dnd-border-gold);border-radius:50%;animation:dnd-spin 1s infinite linear;"></div>
                <div style="font-size:11px;">AI 正在绘图...</div>
            </div>`);
        }

        try {
            const desc = (global && global[0]) ? global[0]['场景描述'] : '';

            if (isCombat) {
                // Battle Map Regen
                const mapData = deps.dataManager.getTable('COMBAT_BattleMap');
                const config = mapData ? mapData.find(m => m['类型'] === 'Config') : null;
                let cols = 20, rows = 20;
                if (config && config['坐标']) {
                    const size = deps.dataManager.parseValue(config['坐标'], 'size');
                    if (size) { cols = size.w || 20; rows = size.h || 20; }
                }
                
                await deps.explorationMapManager.getBattleMap(locationName, desc, cols, rows, true); // true = force regen
                
                // Remove loading overlay
                $('#dnd-map-loading-overlay').remove();
                
            } else {
                // Exploration Map Regen
                // Force regen based on mode (Only support SVG regen now)
                const forceParam = true; // true means regen SVG only
                await deps.explorationMapManager.getMap(locationName, desc, forceParam);
            }
            
            // Refresh HUD to render new map
            ((window as any).DND_Dashboard_UI || this).renderHUD?.( );
        } catch(e) {
            deps.notification.error('生成失败: ' + e.message);
            ((window as any).DND_Dashboard_UI || this).renderHUD?.( ); // Restore UI
        }
    },

    // [新增] 处理地图交互
  };
}
