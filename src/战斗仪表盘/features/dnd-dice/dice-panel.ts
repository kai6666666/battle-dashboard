// features/dnd-dice/dice-panel.ts
// 快速投掷面板（池显示已降级为引擎状态）（b9 骰子归一 · 自 BasedonST `src/ui/modules/UIDice.js` 拆分移植并改接 AcuDice）
import { DND_CONFIG } from '../dnd-core';
import { relocatePopupCloseInto, scrollIntoPopupView } from './relocate-popup-close';

export function createDicePanelFragment(deps: any): any {
  return {
    showQuickDice(event) {
        // [b13.6.1] 方案4：底栏🎲 → 小弹窗（showItemDetailPopup）承载「完整投骰面板」（同步版+诊断）
        const { $ } = deps.utils.getCore();
        const self: any = ((window as any).DND_Dashboard_UI || this);
        try { console.info('[DND]快投→完整面板（小弹窗宿主模式）'); } catch (e0) {}
        self.showItemDetailPopup?.('<div id="dnd-dice-host-slot" style="width:100%;min-width:280px;min-height:80px;display:block;"></div>', event ? event.clientX : 200, event ? event.clientY : 200);
        try {
            // [b13.6.2] 多路查找宿主：document / jQuery / popup 内查询
            let host: any = document.getElementById('dnd-dice-host-slot');
            let route = host ? 'document' : '';
            if (!host) {
                try { const $h = $ ? $('#dnd-dice-host-slot') : null; if ($h && $h.length) { host = $h[0]; route = 'jQuery'; } } catch (e4) {}
            }
            if (!host) {
                try {
                    const $p = $ ? $('#dnd-detail-popup-el') : null;
                    if ($p && $p.length) {
                        const inner = $p[0].querySelector('#dnd-dice-host-slot');
                        if (inner) { host = inner; route = 'popup-inner'; }
                    }
                } catch (e5) {}
            }
            try {
                const $p2 = $ ? $('#dnd-detail-popup-el') : null;
                const dump = $p2 && $p2.length ? String($p2[0].innerHTML || '').slice(0, 220) : '(popup不存在)';
                console.info('[DND]宿主插槽 ' + (host ? ('已找到 via ' + route) : ('未找到 || popupLen=' + ($p2 ? $p2.length : 'null') + ' popupHTML=' + dump)));
            } catch (e1) {}
            if (host) {
                const acuUI: any = (window as any).__acuUI;
                if (acuUI && typeof acuUI.showDicePanelForDnd === 'function') {
                    acuUI.showDicePanelForDnd({ hostEl: host, onClose: function() { try { self.hideDetailPopup?.(); } catch (e2) {} } });
                    try {
                        const p = host.querySelector('.acu-dice-panel');
                        const r = p ? p.getBoundingClientRect() : null;
                        console.info('[DND]面板渲染后 ' + (r ? ('w' + Math.round(r.width) + ' h' + Math.round(r.height) + ' vis=' + (p ? getComputedStyle(p).display : '?')) : 'panel未找到'));
                    } catch (e3) {}
                    // [b13.6.7] 弹窗✕归位到面板按钮区（统一样式与区域）
                    try { relocatePopupCloseInto(host); } catch (eRC) {}
                    // [b13.6.8] 弹窗滚动加固（防“不可滑动”与“固定”异常）
                    try {
                        var _popSC: any = document.getElementById('dnd-detail-popup-el');
                        if (!_popSC) { try { var _$psc = $ ? $('#dnd-detail-popup-el') : null; if (_$psc && _$psc.length) _popSC = _$psc[0]; } catch (eSC0) {} }
                        if (_popSC) {
                            _popSC.style.setProperty('overflow-y', 'auto', 'important');
                            _popSC.style.setProperty('touch-action', 'pan-y', 'important');
                            _popSC.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
                            // [b13.6.9] 子容器 touch 放行（防面板内部拦滑）
                            try { var _pnlSC: any = _popSC.querySelector('.acu-dice-panel, .acu-contest-panel'); if (_pnlSC) { _pnlSC.style.setProperty('touch-action', 'pan-y', 'important'); _pnlSC.style.setProperty('overflow-y', 'visible', 'important'); } } catch (eSC2) {}
                            console.info('[DND]ZCHK popup z=' + getComputedStyle(_popSC).zIndex + ' oh=' + _popSC.offsetHeight + ' sh=' + _popSC.scrollHeight);
                        }
                    } catch (eSC) {}
                    // [b13.6.3] 面板注入后重新定位弹窗（避免太靠下）
                    try {
                        var popEl: any = document.getElementById('dnd-detail-popup-el');
                        if (!popEl) { try { const $pp = $ ? $('#dnd-detail-popup-el') : null; if ($pp && $pp.length) popEl = $pp[0]; } catch (eP0) {} }
                        if (popEl) {
                            const winH = window.innerHeight || 800;
                            const ph = popEl.offsetHeight || 0;
                            let ptop = Math.max(10, Math.round((winH - ph) / 2));
                            if (ph > winH - 20) ptop = 10;
                            popEl.style.setProperty('top', ptop + 'px', 'important');
                            popEl.style.setProperty('bottom', 'auto', 'important');
                            console.info('[DND]弹窗重定位 top=' + ptop + ' ph=' + ph + ' winH=' + winH);
                        }
                    } catch (e6) {}
                    // [b13.6.7] 面板注入后窗口内部滚动兜底（防“固定”异常）
                    try { setTimeout(function () { try { var _peS: any = document.getElementById('dnd-detail-popup-el'); if (!_peS) { try { var _$ps = $ ? $('#dnd-detail-popup-el') : null; if (_$ps && _$ps.length) _peS = _$ps[0]; } catch (eSN) {} } var _rcS = host.querySelector('.acu-dice-roll-result-card'); if (_peS && _rcS) scrollIntoPopupView(_peS, _rcS); } catch (eSS) {} }, 220); } catch (eSSb) {}
                    // [b13.6.4] 监听面板高度变化（投骰后结果卡注入）——保持弹窗底部不出屏
                    try {
                        const popupRef = () => {
                            var pe: any = document.getElementById('dnd-detail-popup-el');
                            if (!pe) { try { const $p3 = $ ? $('#dnd-detail-popup-el') : null; if ($p3 && $p3.length) pe = $p3[0]; } catch (eR0) {} }
                            return pe;
                        };
                        const repositionPopup = () => {
                            try {
                                const pe = popupRef();
                                if (!pe) return;
                                const winH2 = window.innerHeight || 800;
                                let top2 = parseFloat(pe.style.top) || 0;
                                const rect2 = pe.getBoundingClientRect();
                                if (rect2.bottom > winH2 - 10) {
                                    top2 -= (rect2.bottom - (winH2 - 10));
                                }
                                if (top2 < 10) top2 = 10;
                                pe.style.setProperty('top', Math.round(top2) + 'px', 'important');
                            } catch (eR) {}
                        };
                        if (typeof (window as any).ResizeObserver === 'function') {
                            const ro = new (window as any).ResizeObserver(function () { repositionPopup(); });
                            ro.observe(host);
                            try { (host as any).__dndPopupRO = ro; } catch (eR2) {}
                        }
                        // 双保险：延迟一次 + 再延迟一次（覆盖动画帧）
                        setTimeout(repositionPopup, 120);
                        setTimeout(repositionPopup, 400);
                    } catch (eRO) {}
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
