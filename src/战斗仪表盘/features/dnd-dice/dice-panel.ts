// features/dnd-dice/dice-panel.ts
// 快速投掷面板（池显示已降级为引擎状态）（b9 骰子归一 · 自 BasedonST `src/ui/modules/UIDice.js` 拆分移植并改接 AcuDice）
import { DND_CONFIG } from '../dnd-core';

export function createDicePanelFragment(deps: any): any {
  return {
    showQuickDice(event) {
        // [b9 骰子归一] 骰子池已退役：投骰统一走 AcuDice 引擎（window.AcuDice.roll）
        
        let html = `
            <div style="font-weight:bold;color:var(--dnd-text-highlight);border-bottom:1px solid var(--dnd-border-subtle);padding-bottom:5px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
                <span>${deps.icons.DICE} 快速投掷</span>
                    <span style="font-size:11px;color:var(--dnd-accent-green);background:var(--dnd-bg-tertiary);padding:2px 6px;border-radius:3px;">引擎: AcuDice</span>
            </div>
            
            <!-- [b9 骰子归一] 引擎状态（原骰子池区块已退役） -->
            <div style="background:var(--dnd-bg-tertiary);padding:8px;border-radius:4px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:11px;color:var(--dnd-text-dim);">投骰引擎：AcuDice（统一）</span>
                <span onclick="window.DND_Dashboard_UI.refreshDicePool()" style="cursor:pointer;color:var(--dnd-text-highlight);font-size:11px;">${deps.icons.SYNC} 状态</span>
            </div>
            
            <!-- 快速投掷按钮 -->
            <div class="dnd-dice-grid">
                ${[4,6,8,10,12,20].map(d => `
                    <button class="dnd-dice-btn" data-sides="${d}" onclick="window.DND_Dashboard_UI.rollDice(${d}, event)">
                        D${d}
                    </button>
                `).join('')}
            </div>
            
            <!-- D100 单独一行 -->
            <div style="margin-top:8px;">
                <button class="dnd-dice-btn" data-sides="100" style="
                    width:100%;
                    background:var(--dnd-bg-secondary);
                    border:1px solid var(--dnd-border-gold);
                    color:var(--dnd-text-highlight);
                    padding:8px;
                    border-radius:4px;
                    cursor:pointer;
                    transition:all 0.2s;
                    font-size:12px;
                " onmouseover="this.style.background='var(--dnd-bg-tertiary)'" 
                onmouseout="this.style.background='var(--dnd-bg-secondary)'"
                onclick="window.DND_Dashboard_UI.rollDice(100, event)">
                    ${deps.icons.TARGET} D100 (百分骰)
                </button>
            </div>
            
            <!-- 自定义投掷 -->
            <div class="dnd-dice-custom-area">
                <div style="font-size:11px;color:var(--dnd-text-dim);margin-bottom:5px;">自定义投掷</div>
                <div class="dnd-dice-input-row">
                    <input type="text" id="dnd-custom-dice" placeholder="2d6+3" class="dnd-dice-input">
                    <button onclick="window.DND_Dashboard_UI.rollCustomDice()" class="dnd-dice-submit-btn">投掷</button>
                </div>
            </div>
        `;
        ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.( html, event.clientX, event.clientY);
    },

    // 获取骰子池数据
    getDicePoolData() {
        // [b9 骰子归一] 骰子池已退役（投骰走 AcuDice）；保留空接口防外部调用。
        return [];
    },

    async refreshDicePool() {
        // [b9 骰子归一] 骰子池已退役：改为引擎状态提示。
        try { deps.notification.info('骰子池已退役：投骰已统一走 AcuDice 引擎'); } catch (e) {}
    },

    // 投掷骰子并显示结果
  };
}
