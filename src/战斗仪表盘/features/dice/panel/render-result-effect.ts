// features/dice/panel/render-result-effect.ts
// [b13.6.5] 结果特效卡（自快投面板的 D20 特效移植：D20 图标 + 大数字 + 结果说明）
// 渲染到完整投骰面板的内容区顶部，与面板结合显示。无 jQuery 依赖，采用 ownerDocument 原生 DOM。
export function renderDiceResultEffect(panel: any, opts: any) {
  try {
    if (!panel || !panel.length || !panel[0]) return;
    var root = panel[0];
    var doc = root.ownerDocument || document;
    var bodyEl = root.querySelector('.acu-dice-panel-body') || root;
    // 移除旧卡（幂等）
    try {
      var old = bodyEl.querySelectorAll('.acu-dice-roll-result-card');
      for (var i = old.length - 1; i >= 0; i--) { if (old[i].parentNode) old[i].parentNode.removeChild(old[i]); }
    } catch (e0) {}
    var val = String(opts && opts.value != null ? opts.value : '');
    var label = String((opts && opts.label) || '投掷结果');
    var kind = (opts && opts.kind) || 'normal';
    var icon = '<i class="fa-solid fa-dice-d20"></i>';
    var color = 'var(--dnd-text-highlight, #e8c06a)';
    var glow = '0 0 15px var(--dnd-selected-bg, rgba(232,192,106,.35))';
    var size = '42px';
    var sub = '<div style="font-size:12px;color:var(--dnd-text-dim, #9a8a6a);margin-top:5px;">' + label + '</div>';
    if (kind === 'crit') {
      color = 'var(--dnd-accent-green, #5fd07a)';
      glow = '0 0 24px var(--dnd-accent-green, #5fd07a), 0 0 48px var(--dnd-selected-bg, rgba(232,192,106,.35))';
      size = '56px';
      sub = '<div style="font-size:16px;color:var(--dnd-text-highlight, #e8c06a);margin-top:8px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">大成功 · NATURAL 20</div>';
    } else if (kind === 'fail') {
      color = 'var(--dnd-accent-red, #e05a5a)';
      glow = '0 0 24px var(--dnd-accent-red, #e05a5a), 0 0 48px var(--dnd-selected-bg, rgba(232,192,106,.35))';
      size = '56px';
      sub = '<div style="font-size:16px;color:var(--dnd-accent-red, #e05a5a);margin-top:8px;font-weight:bold;">大失败 · NATURAL 1</div>';
    }
    var card = doc.createElement('div');
    card.className = 'acu-dice-roll-result-card';
    card.setAttribute('style', 'text-align:center;padding:15px;margin-bottom:10px;background:linear-gradient(135deg, var(--dnd-bg-secondary, rgba(255,255,255,.04)), var(--dnd-bg-tertiary, rgba(255,255,255,.02)));border-radius:8px;border:1px solid var(--dnd-border-gold, rgba(232,192,106,.45));');
    card.innerHTML = '<div class="dnd-dice-result-number" style="font-size:' + size + ';color:' + color + ';text-shadow:' + glow + ';animation:dnd-card-in .35s ease;">' + icon + ' ' + val + '</div>' + sub;
    bodyEl.insertBefore(card, bodyEl.firstChild);
  } catch (e) { /* 静默：特效失败不影响主流程 */ }
}
