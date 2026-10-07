/**
 * selector-alternates.ts — [b14.3] 教程选择器别名表。
 *
 * 目的：设置融合后，同一套骰子设置教程步骤需同时服务两个宿主：
 *   - 骰子设置弹窗（原选择器）；
 *   - DND 主面板「仪表盘设置」（本表提供的等价选择器）。
 * 教程系统按序尝试原选择器与别名；两边都找不到可见元素时，该步骤自动跳过（既有机制）。
 */
export const TUTORIAL_SELECTOR_ALTERNATES: Record<string, string[]> = {
  // ---- 设置总览（settings）----
  '.acu-settings-dialog': ['#dnd-settings-panel'],
  '.acu-settings-header': ['#dnd-settings-title-row'],
  '.acu-settings-group[data-group="appearance"] .acu-settings-group-title': ['#dnd-set-block-2 .dnd-set-group-title'],
  '.acu-settings-group[data-group="layout"] .acu-settings-group-title': ['#dnd-set-block-4 .dnd-set-group-title'],
  '.acu-settings-group[data-group="position"] .acu-settings-group-title': ['#dnd-set-block-6 .dnd-set-group-title'],
  '.acu-settings-group[data-group="dicePresets"] .acu-settings-group-title': ['#dnd-set-block-7 .dnd-set-group-title'],
  '.acu-settings-group[data-group="advanced"] .acu-settings-group-title': ['#dnd-set-block-9 .dnd-set-group-title'],
  // ---- 外观样式 ----
  '#settings-row-font-family': ['#dnd-dice-font-family'],
  '#settings-row-font-main': ['#dnd-dice-font-main'],
  '#settings-row-font-option': ['#dnd-dice-font-option'],
  '#settings-row-font-nav': ['#dnd-dice-font-nav'],
  '#settings-row-highlight-new': ['#dnd-dice-highlight-new'],
  // ---- 布局与浏览 ----
  '#settings-row-layout-mode': ['#dnd-dice-layout'],
  '#settings-row-reverse-all': ['#dnd-dice-order'],
  '#settings-row-desktop-nav-aligned': ['#dnd-dice-nav-layout'],
  '#settings-row-card-width': ['#dnd-dice-card-width'],
  '#settings-row-per-page': ['#dnd-dice-per-page'],
  '#settings-row-grid-cols': ['#dnd-dice-grid-cols'],
  '#settings-row-horizontal-scrollbar': ['#dnd-dice-hscroll-row'],
  // ---- 面板与交互 / 选项 ----
  '#settings-row-panel-position': ['#dnd-dice-position'],
  '#settings-row-action-position': ['#dnd-dice-action-pos'],
  '#settings-row-collapse-style': ['#dnd-dice-collapse'],
  '#settings-row-show-options': ['#dnd-dice-option-panel'],
  '#row-auto-send': ['#dnd-dice-option-click'],
  '#settings-row-navigation-manager': ['#dnd-dice-nav-manager-open'],
  // ---- 表格管理 ----
  '.acu-table-manager-hint': ['.dnd-navmgr-hint'],
  '#table-manager-list .acu-table-manager-item:first-child': ['.dnd-navmgr-list .dnd-navmgr-item:first-child'],
  // ---- 战斗仪表盘预设 ----
  '#settings-row-check-preset': ['.dnd-dice-preset-manage[data-kind="check"]'],
  '#settings-row-attribute-preset': ['.dnd-dice-preset-manage[data-kind="attribute"]'],
  '#settings-row-action-preset': ['.dnd-dice-preset-manage[data-kind="action"]'],
  '#settings-row-dashboard-preset': ['.dnd-dice-preset-manage[data-kind="dashboard"]'],
  '#settings-row-render-preset': ['.dnd-dice-preset-manage[data-kind="render"]'],
  '#settings-row-avatar-preset': ['.dnd-dice-preset-manage[data-kind="avatar"]'],
  '#settings-row-custom-table-name-icon-manager': ['.dnd-dice-preset-manage[data-kind="icon"]'],
  '#settings-row-validation-preset': ['.dnd-dice-preset-manage[data-kind="validation"]'],
  '#settings-row-regex-preset': ['.dnd-dice-preset-manage[data-kind="regex"]'],
  // ---- 高级设置 ----
  '#settings-row-template-inspection': ['#dnd-dice-template-inspection'],
  '#settings-row-debug-console': ['#dnd-dice-debug-console'],
  '#settings-row-config-backup': ['#dnd-dice-config-backup'],
  '#settings-row-clear-cache': ['#dnd-clear-local-cache'],
  '#settings-row-db-toast-mute': ['#dnd-dice-db-toast'],
};