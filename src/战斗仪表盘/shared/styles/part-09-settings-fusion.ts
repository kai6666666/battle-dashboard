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
.dnd-set-action-btn { display: inline-flex; align-items: center; gap: 6px; background: rgba(157,139,108,0.16); border: 1px solid var(--dnd-border-gold, #9d8b6c); color: var(--dnd-text-highlight, #ffdb85); padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all .2s; flex-shrink: 0; }
.dnd-set-action-btn:hover { background: rgba(157,139,108,0.28); }

/* ===== [b14.3] 面板外壳：折叠标题 / 标题三件套 / 教程按钮 ===== */
.dnd-set-group-title { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.dnd-set-group-title .dnd-set-group-chevron { font-size: 12px; color: var(--dnd-text-dim, #888); transition: transform .18s ease; flex-shrink: 0; }
.dnd-set-group.collapsed .dnd-set-group-title .dnd-set-group-chevron { transform: rotate(-90deg); }
.dnd-version-badge { font-size: 11px; color: var(--dnd-text-dim, #888); border: 1px solid var(--dnd-border-subtle, #444); border-radius: 4px; padding: 2px 6px; white-space: nowrap; }
.dnd-title-icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: transparent; border: 1px solid var(--dnd-border-subtle, #444); color: var(--dnd-text-main, #dcd0c0); border-radius: 4px; cursor: pointer; transition: all .2s; padding: 0; }
.dnd-title-icon-btn:hover { border-color: var(--dnd-border-gold, #9d8b6c); color: var(--dnd-text-highlight, #ffdb85); }
.dnd-block-help { width: 28px; height: 28px; min-width: 28px; display: inline-flex; align-items: center; justify-content: center; padding: 0; margin-left: auto; border: 1px solid transparent; border-radius: 6px; background: transparent; color: var(--dnd-text-dim, #888); font-size: 13px; cursor: pointer; transition: all .18s; }
.dnd-block-help:hover { color: var(--dnd-text-highlight, #ffdb85); background: rgba(157,139,108,0.16); }
.dnd-title-help-btn { width: 28px; height: 28px; min-width: 28px; display: inline-flex; align-items: center; justify-content: center; padding: 0; border: 1px solid transparent; border-radius: 6px; background: transparent; color: var(--dnd-text-dim, #888); font-size: 15px; cursor: pointer; transition: all .18s; }
.dnd-title-help-btn:hover { color: var(--dnd-text-highlight, #ffdb85); background: rgba(157,139,108,0.16); }

/* ===== [b14②] 导航盘管理弹窗（DND 化包装） ===== */
.dnd-navmgr-overlay { position: fixed; inset: 0; z-index: 2147483646; display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; }
.dnd-navmgr-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.62); }
.dnd-navmgr-dialog { position: relative; z-index: 1; width: min(560px, calc(100vw - 32px)); max-height: min(72vh, 640px); display: flex; flex-direction: column; overflow: hidden; background: var(--dnd-bg-popup, #1c1512); color: var(--dnd-text-main, #dcd0c0); border: 1px solid var(--dnd-border-inner, #5c4b35); border-radius: 10px; box-shadow: var(--dnd-shadow, 0 0 10px rgba(0,0,0,0.8)); }
.dnd-navmgr-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--dnd-border-inner, #5c4b35); }
.dnd-navmgr-title { font-weight: bold; color: var(--dnd-text-header, #e6dcca); font-size: 14px; }
.dnd-navmgr-close { background: transparent; border: 1px solid transparent; color: var(--dnd-text-dim, #888); width: 28px; height: 28px; border-radius: 4px; cursor: pointer; transition: all .2s; }
.dnd-navmgr-close:hover { border-color: var(--dnd-border-gold, #9d8b6c); color: var(--dnd-text-highlight, #ffdb85); }
.dnd-navmgr-body { padding: 12px 14px; overflow-y: auto; -webkit-overflow-scrolling: touch; overscroll-behavior-y: contain; }
.dnd-navmgr-hint { font-size: 11px; color: var(--dnd-text-dim, #888); margin-bottom: 8px; }
.dnd-navmgr-list { display: flex; flex-direction: column; gap: 4px; max-height: 52vh; overflow-y: auto; padding: 2px; }
.dnd-navmgr-item { display: flex; align-items: center; gap: 8px; padding: 7px 9px; border: 1px solid var(--dnd-border-subtle, #444); border-radius: 5px; background: var(--dnd-bg-input, #1a1a1c); }
.dnd-navmgr-item.is-special { border-color: var(--dnd-border-gold, #9d8b6c); }
.dnd-navmgr-item.is-hidden { opacity: .45; }
.dnd-navmgr-item.is-hidden .dnd-navmgr-name { text-decoration: line-through; }
.dnd-navmgr-eye { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; color: var(--dnd-text-main, #dcd0c0); cursor: pointer; border-radius: 4px; }
.dnd-navmgr-eye:hover { color: var(--dnd-text-highlight, #ffdb85); }
.dnd-navmgr-icon { width: 20px; text-align: center; color: var(--dnd-text-dim, #888); }
.dnd-navmgr-name { flex: 1; font-size: 13px; color: var(--dnd-text-main, #dcd0c0); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dnd-navmgr-handle { width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; color: var(--dnd-text-dim, #888); cursor: grab; touch-action: none; }
.dnd-navmgr-handle:active { cursor: grabbing; }
.dnd-navmgr-empty { padding: 16px; text-align: center; color: var(--dnd-text-dim, #888); font-size: 12px; }
.dnd-navmgr-item.acu-drag-ghost { z-index: 2147483647; }

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
