/**
 * part-09-settings-fusion.ts — [b14] 设置融合系列样式（新增块，不属原 BasedonST 拆分包）。
 *
 * 内容分两节：
 *   1) DND 主面板的融合控件样式（segmented / stepper，供迁入的骰子设置项使用）；
 *   2) 主题收编对齐层：骰子可见界面（.acu-theme-*）核心 --acu-* 变量对齐 DND（--dnd-*）。
 *      说明：以 :root 前缀提高优先级，覆盖各 acu 主题基座变量；fallback 保留默认暗色值，
 *      非 DND 环境下变量缺失时仍可降级显示。
 */
export const STYLES_PART_09_SETTINGS_FUSION = `
/* ===== [b14] 设置融合：DND 主面板控件样式（segmented / stepper） ===== */
.dnd-set-sub-title { font-weight: bold; color: var(--dnd-text-header); font-size: 14px; margin-bottom: 10px; }
.dnd-set-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.dnd-set-row-label { color: var(--dnd-text-main); font-size: 13px; }
.dnd-set-row-label.dnd-dim { color: var(--dnd-text-dim); font-size: 12px; }
.dnd-set-seg { display: inline-flex; align-items: center; gap: 2px; background: var(--dnd-bg-input); border: 1px solid var(--dnd-border-subtle); border-radius: 6px; padding: 2px; flex-shrink: 0; }
.dnd-set-seg-btn { padding: 4px 12px; border-radius: 4px; border: 1px solid transparent; background: transparent; color: var(--dnd-text-dim); font-size: 12px; line-height: 1.4; cursor: pointer; transition: all .2s; }
.dnd-set-seg-btn:hover { color: var(--dnd-text-main); }
.dnd-set-seg-btn.active { background: var(--dnd-selected-bg); border-color: var(--dnd-border-gold); color: var(--dnd-text-highlight); }
.dnd-set-stepper { display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0; }
.dnd-set-stepper-btn { width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; background: var(--dnd-bg-input); border: 1px solid var(--dnd-border-subtle); color: var(--dnd-text-main); border-radius: 4px; cursor: pointer; font-size: 13px; line-height: 1; transition: all .2s; }
.dnd-set-stepper-btn:hover { border-color: var(--dnd-border-gold); color: var(--dnd-text-highlight); }
.dnd-set-stepper-value { min-width: 48px; text-align: center; color: var(--dnd-text-highlight); font-size: 13px; }

/* ===== [b14] 主题收编：骰子可见界面核心变量对齐 DND（--acu-* -> --dnd-*） ===== */
:root [class*="acu-theme-"]:not(.acu-theme-icon) {
  --acu-bg-nav: var(--dnd-bg-hud, #201612);
  --acu-bg-panel: var(--dnd-bg-popup, #1c1512);
  --acu-bg-main: var(--dnd-bg-main, #0f0b0a);
  --acu-border: var(--dnd-border-inner, #5c4b35);
  --acu-text-main: var(--dnd-text-main, #dcd0c0);
  --acu-text-sub: var(--dnd-text-dim, #888);
  --acu-btn-bg: rgba(157,139,108,0.16);
  --acu-btn-hover: rgba(157,139,108,0.28);
  --acu-btn-active-bg: var(--dnd-border-gold, #9d8b6c);
  --acu-btn-active-text: #1c1c1e;
  --acu-button-text: var(--dnd-text-main, #dcd0c0);
  --acu-button-text-on-accent: #1c1c1e;
  --acu-accent: var(--dnd-text-highlight, #ffdb85);
  --acu-card-bg: var(--dnd-bg-card, #242424);
  --acu-badge-bg: rgba(157,139,108,0.16);
  --acu-menu-bg: var(--dnd-bg-popup, #1c1512);
  --acu-menu-text: var(--dnd-text-main, #dcd0c0);
  --acu-input-bg: var(--dnd-bg-input, #1a1a1c);
  --acu-input-text: var(--dnd-text-main, #dcd0c0);
  --acu-input-placeholder: var(--dnd-text-dim, #888);
  --acu-table-head: rgba(157,139,108,0.1);
  --acu-table-hover: rgba(157,139,108,0.08);
  --acu-opt-bg: rgba(157,139,108,0.06);
  --acu-opt-hover: rgba(157,139,108,0.15);
  --acu-shadow: var(--dnd-shadow, 0 0 10px rgba(0,0,0,0.8));
}
`;
