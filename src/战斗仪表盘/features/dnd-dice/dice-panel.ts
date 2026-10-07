// features/dnd-dice/dice-panel.ts
// 快速投掷面板（池显示已降级为引擎状态）（b9 骰子归一 · 自 BasedonST `src/ui/modules/UIDice.js` 拆分移植并改接 AcuDice）
import { DND_CONFIG } from '../dnd-core';

export function createDicePanelFragment(deps: any): any {
  return {
    showQuickDice(event) {
        // [b13.6.1] 方案4：底栏🎲 → 小弹窗（showItemDetailPopup）承载「完整投骰面板」（同步版+诊断）
        const { $ } = deps.utils.getCore();
        const self: any = ((window as any).DND_Dashboard_UI || this);
        try { console.info('[DND]快投→完整面板（小弹窗宿主模式）'); } catch (e0) {}
        self.showItemDetailPopup?.('<div id="dnd-dice-host-slot" style="width:100%;min-width:280px;min-height:80px;display:block;"></div>', event ? event.clientX : 200, event ? event.clientY : 200);
        try {
            const host = document.getElementById('dnd-dice-host-slot');
            try { console.info('[DND]宿主插槽 ' + (host ? '已找到' : '未找到')); } catch (e1) {}
            if (host) {
                const acuUI: any = (window as any).__acuUI;
                if (acuUI && typeof acuUI.showDicePanelForDnd === 'function') {
                    acuUI.showDicePanelForDnd({ hostEl: host, onClose: function() { try { self.hideDetailPopup?.(); } catch (e2) {} } });
                    try {
                        const p = host.querySelector('.acu-dice-panel');
                        const r = p ? p.getBoundingClientRect() : null;
                        console.info('[DND]面板渲染后 ' + (r ? ('w' + Math.round(r.width) + ' h' + Math.round(r.height) + ' vis=' + (p ? getComputedStyle(p).display : '?')) : 'panel未找到'));
                    } catch (e3) {}
                } else {
                    deps.notification.warning('完整投骰面板不可用：桥未就绪');
                }
            }
        } catch (err) { deps.logger.warn('[DND] 打开完整投骰面板失败', err); }
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
