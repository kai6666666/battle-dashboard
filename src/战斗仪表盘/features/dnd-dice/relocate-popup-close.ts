// features/dnd-dice/relocate-popup-close.ts
// [b13.6.7] 将弹窗✕归位到骰子面板按钮区（统一样式与区域）
export function relocatePopupCloseInto(host: any) {
  try {
    if (!host) return;
    var doc = host.ownerDocument || document;
    var popupEl: any = doc.getElementById('dnd-detail-popup-el');
    // 1. 找✕（可能被旧 panel 连带删除——全文档查找）
    var closeBtn: any = null;
    if (popupEl) closeBtn = popupEl.querySelector('.dnd-popup-close-btn');
    if (!closeBtn) closeBtn = doc.querySelector('.dnd-popup-close-btn');
    // [b13.6.9] 清理全 doc 多余✕（最多保留 1 个，防积累导致按钮区移位）
    try {
      var _allClose = doc.querySelectorAll('.dnd-popup-close-btn');
      if (_allClose.length > 1) { closeBtn = _allClose[_allClose.length - 1]; }
      for (var _ci = 0; _ci < _allClose.length; _ci++) {
        if (_allClose[_ci] !== closeBtn && _allClose[_ci].parentNode) { _allClose[_ci].parentNode.removeChild(_allClose[_ci]); }
      }
    } catch (eK) {}
    var actions = host.querySelector('.acu-dice-panel-actions');
    if (!actions) return;
    // 2. 若不存在——新建
    if (!closeBtn) {
      closeBtn = doc.createElement('div');
      closeBtn.className = 'dnd-popup-close-btn';
      closeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
    }
    // 3. 统一为面板按钮风格（亮色圆角方钮）
    closeBtn.setAttribute('style', 'position:static;cursor:pointer;color:var(--dnd-text-highlight);font-size:15px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10);transition:all 0.2s;margin-left:2px;flex:0 0 auto;');
    closeBtn.onmouseover = function () { try { this.style.background = 'var(--dnd-bg-tertiary)'; } catch (e) {} };
    closeBtn.onmouseout = function () { try { this.style.background = 'rgba(255,255,255,0.06)'; } catch (e) {} };
    // 4. 点击关闭弹窗（直接绑定，不依赖 popup 代理）
    closeBtn.onclick = function (ev: any) {
      try { ev.stopPropagation(); ev.preventDefault(); } catch (e0) {}
      try {
        var ui: any = (window as any).DND_Dashboard_UI || {};
        if (typeof ui.hideDetailPopup === 'function') { ui.hideDetailPopup(); }
        else { var pe: any = doc.getElementById('dnd-detail-popup-el'); if (pe && pe.parentNode) pe.parentNode.removeChild(pe); }
      } catch (e1) {}
    };
    // 5. 挪进按钮区
    actions.appendChild(closeBtn);
  } catch (e) { /* 静默 */ }
}

export function scrollIntoPopupView(popupEl: any, targetEl: any) {
  // [b13.6.7] 弹窗内部滚动（避免 scrollIntoView 连带滚动页面造成“固定”异常）
  try {
    if (!popupEl || !targetEl) return;
    var pr = popupEl.getBoundingClientRect();
    var tr = targetEl.getBoundingClientRect();
    var pad = 12;
    if (tr.bottom > pr.bottom - pad) {
      popupEl.scrollTop += (tr.bottom - (pr.bottom - pad));
    } else if (tr.top < pr.top + pad) {
      popupEl.scrollTop -= ((pr.top + pad) - tr.top);
    }
  } catch (e) {}
}
