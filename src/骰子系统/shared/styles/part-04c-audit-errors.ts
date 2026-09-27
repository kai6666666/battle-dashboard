/**
 * part-04c-audit-errors.ts — part-04 子分片（从 part-04-validation 拆分，按序拼接内容不变）。
 */
export const STYLES_PART_04C_AUDIT_ERRORS = `            /* ========== 变更审核面板样式 ========== */
            .acu-changes-content {
                padding: 10px;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                -webkit-overflow-scrolling: touch !important;
                touch-action: pan-y !important;
                overscroll-behavior-y: contain;
            }
            /* ========== 验证错误消息样式 ========== */
            .acu-validation-error-msg {
                font-size: 11px;
                color: var(--acu-text-sub);
                flex: 1;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            /* 数据验证模式提示 - 固定在面板顶部，不参与横向滚动 */
            .acu-validation-mode-hint {
                padding: 8px 12px;
                font-size: 12px;
                color: var(--acu-text-sub);
                background: var(--acu-table-head);
                border-radius: 6px;
                margin: 0 0 10px 0;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            /* 审核面板横向滚动模式 */
            .acu-changes-content.acu-changes-horizontal {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                align-items: flex-start !important;
                gap: 12px;
                overflow-x: auto !important;
                overflow-y: visible !important;
                touch-action: pan-x pan-y !important;
                padding-bottom: 5px;
                -webkit-overflow-scrolling: touch;
                overscroll-behavior-x: contain;
                overscroll-behavior-y: auto;
            }
            .acu-changes-content.acu-changes-horizontal .acu-changes-list {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                gap: 12px;
                align-items: flex-start;
                min-width: max-content;
            }
            .acu-changes-content.acu-changes-horizontal .acu-changes-group {
                flex: 0 0 280px;
                min-width: 280px;
                max-width: 280px;
                max-height: none;
                overflow-y: visible;
                -webkit-overflow-scrolling: auto;
                overscroll-behavior-y: auto;
            }
            @media (min-width: 769px) {
                .acu-changes-content.acu-changes-horizontal .acu-changes-group {
                    flex: 0 0 320px;
                    min-width: 320px;
                    max-width: 320px;
                }
            }
            .acu-changes-list { display: flex; flex-direction: column; gap: 10px; }
            .acu-changes-group { background: var(--acu-card-bg); border: 1px solid var(--acu-border); border-radius: 8px; overflow: hidden; }
            .acu-changes-group-header { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--acu-table-head); font-weight: bold; font-size: 13px; color: var(--acu-text-main); }
            .acu-changes-count { margin-left: auto; background: var(--acu-accent); color: var(--acu-btn-active-text); font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: normal; }
            .acu-changes-group-body { padding: 6px; display: flex; flex-direction: column; gap: 4px; }
            .acu-change-item { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border: 1px solid transparent; border-radius: 6px; font-size: 12px; background: rgba(0,0,0,0.02); flex-wrap: wrap; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-change-item:hover { background: var(--acu-table-hover); }
            .acu-change-badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; flex-shrink: 0; }
            .acu-badge-added { background: var(--acu-success-bg); color: var(--acu-success-text); }
            .acu-badge-deleted { background: var(--acu-hl-manual-bg); color: var(--acu-hl-manual); }
            .acu-badge-modified { background: var(--acu-hl-diff-bg); color: var(--acu-hl-diff); }
            .acu-change-title { color: var(--acu-text-main); font-weight: 500; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .acu-change-field { color: var(--acu-text-sub); font-size: 11px; flex-shrink: 0; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .acu-change-diff { display: flex; align-items: center; gap: 4px; flex: 1; min-width: 0; overflow: hidden; }
            .acu-diff-old { color: var(--acu-hl-manual); text-decoration: line-through; opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
            .acu-diff-arrow { color: var(--acu-text-sub); flex-shrink: 0; }
            .acu-diff-new { color: var(--acu-success-text); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
            /* 变更操作按钮 */
            .acu-change-actions { display: flex; gap: 4px; margin-left: auto; flex-shrink: 0; }
            .acu-change-action-btn { width: 26px; height: 26px; border: 1px solid var(--acu-border); border-radius: 5px; background: var(--acu-btn-bg); color: var(--acu-text-sub); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); padding: 0; }
            .acu-change-action-btn:hover { background: var(--acu-btn-hover); color: var(--acu-text-main); }
            .acu-action-accept:hover { background: var(--acu-success-bg); color: var(--acu-success-text); border-color: var(--acu-success-text); }
            .acu-action-reject:hover, .acu-action-restore:hover { background: var(--acu-hl-manual-bg); color: var(--acu-hl-manual); border-color: var(--acu-hl-manual); }
            .acu-action-edit:hover { background: var(--acu-hl-diff-bg); color: var(--acu-hl-diff); border-color: var(--acu-hl-diff); }
            /* 批量操作按钮 - 增强深色主题下的对比度 */
            .acu-changes-batch-btn { width: 32px; height: 32px; border: 1px solid var(--acu-border); border-radius: 6px; background: var(--acu-btn-bg); color: var(--acu-text-main); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-changes-batch-btn:hover { background: var(--acu-btn-hover); color: var(--acu-text-main); border-color: var(--acu-border); }
            .acu-batch-accept:hover { background: var(--acu-success-bg); color: var(--acu-success-text); border-color: var(--acu-success-text); }
            .acu-batch-reject:hover { background: var(--acu-hl-manual-bg); color: var(--acu-hl-manual); border-color: var(--acu-hl-manual); }
            .acu-simple-mode-toggle.active { background: var(--acu-accent); color: var(--acu-btn-active-text); border-color: var(--acu-accent); }
            .acu-simple-mode-toggle:hover { background: var(--acu-accent); color: var(--acu-btn-active-text); border-color: var(--acu-accent); }
            .acu-changes-group.collapsed .acu-collapse-icon { transform: rotate(0deg); }
            .acu-changes-group:not(.collapsed) .acu-collapse-icon { transform: rotate(0deg); }
            .acu-changes-group-header:hover { background: var(--acu-table-hover); }
            /* 变更对比编辑弹窗样式 */
            .acu-diff-section { margin-bottom: 12px; }
            .acu-diff-label { font-size: 12px; font-weight: bold; color: var(--acu-text-sub); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
            .acu-diff-readonly { padding: 10px 12px; background: var(--acu-table-head); border: 1px solid var(--acu-border); border-radius: 6px; color: var(--acu-text-main); font-size: 13px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; max-height: 150px; overflow-y: auto; opacity: 0.8; }
            .acu-diff-arrow-down { text-align: center; color: var(--acu-text-sub); font-size: 14px; margin: 8px 0; opacity: 0.5; }
            /* 可编辑区域高亮样式 */
            .acu-diff-new-section { padding: 12px; background: var(--acu-input-bg); border: 1px solid var(--acu-accent); border-radius: 6px; box-shadow: var(--acu-focus-ring); }
            .acu-diff-new-section .acu-diff-label { color: var(--acu-accent); font-weight: 600; }
            .acu-diff-new-section textarea,
            .acu-diff-new-section input { background: var(--acu-input-bg) !important; border-color: var(--acu-border) !important; }
            .acu-diff-new-section textarea:focus,
            .acu-diff-new-section input:focus { border-color: var(--acu-accent) !important; box-shadow: var(--acu-focus-ring); }
            /* 单字段编辑弹窗按钮优化 */
            .acu-edit-dialog .acu-dialog-btns {
                display: flex;
                gap: 10px;
                padding: 12px 16px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-table-head);
                margin: 0 -16px -16px -16px;
                border-radius: 0 0 12px 12px;
            }
            .acu-edit-dialog .acu-dialog-btn {
                flex: 1;
                padding: 10px 12px;
                border: 1px solid var(--acu-text-sub);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                white-space: nowrap;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard),
                    border-color var(--acu-motion-fast) var(--acu-ease-standard),
                    box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .acu-edit-dialog .acu-dialog-btn:hover,
            .acu-edit-dialog .acu-dialog-btn:focus-visible {
                background: var(--acu-btn-hover);
                border-color: var(--acu-border);
                box-shadow: var(--acu-focus-ring);
                outline: none;
            }
            .acu-edit-dialog .acu-btn-confirm {
                background: var(--acu-accent);
                border-color: var(--acu-accent);
                color: var(--acu-btn-active-text);
            }
            .acu-edit-dialog .acu-btn-confirm:hover,
            .acu-edit-dialog .acu-btn-confirm:focus-visible {
                background: var(--acu-accent);
                opacity: 0.9;
            }
            .acu-edit-dialog.acu-advanced-preset-manager-dialog {
                width: min(600px, 92vw);
                max-width: 600px;
                max-height: 85vh;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .acu-edit-dialog.acu-dashboard-preset-manager-dialog {
                width: min(640px, 92vw);
                max-width: 640px;
            }
            .acu-advanced-preset-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--acu-border);
                flex-shrink: 0;
            }
            .acu-advanced-preset-header h3 {
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
                color: var(--acu-text-main);
                font-size: 16px;
                line-height: 1.3;
            }
            .acu-advanced-preset-header-actions {
                display: flex;
                align-items: center;
                gap: 4px;
                flex-shrink: 0;
            }
            .acu-advanced-preset-body {
                flex: 1;
                overflow-y: auto;
                padding: 2px 2px 0;
                min-height: 0;
            }
            .acu-advanced-preset-hint {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 8px;
                padding: 0 2px;
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.35;
            }
            #acu-advanced-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-advanced-presets-list .acu-preset-item {
                margin-bottom: 0;
            }
            #acu-advanced-presets-list .acu-preset-info {
                flex: 1;
                min-width: 0;
            }
            #acu-advanced-presets-list .acu-preset-actions {
                gap: 6px;
            }
            #acu-advanced-presets-list .acu-preset-handle {
                touch-action: none;
            }
            .acu-preset-badge {
                display: inline-flex;
                align-items: center;
                margin-left: 6px;
                padding: 1px 5px;
                border: 1px solid var(--acu-border);
                border-radius: 999px;
                color: var(--acu-text-sub);
                font-size: 10px;
                font-weight: 500;
                line-height: 1.2;
                vertical-align: 1px;
            }
            .acu-advanced-preset-footer {
                display: flex;
                gap: 8px;
                padding-top: 12px;
                border-top: 1px solid var(--acu-border);
                flex-shrink: 0;
            }
            .acu-advanced-preset-footer .acu-dialog-btn {
                flex: 0 0 auto;
                min-height: 38px;
                margin: 0;
            }
            .acu-advanced-preset-footer .acu-advanced-preset-footer-main {
                flex: 1 1 180px;
            }
            .acu-advanced-preset-file-input {
                display: none;
            }
            .acu-edit-dialog.acu-advanced-preset-editor-dialog {
                width: min(720px, 95vw);
                max-width: 720px;
                max-height: 85vh;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .acu-edit-dialog.acu-dashboard-preset-editor-dialog {
                width: min(760px, 95vw);
                max-width: 760px;
            }
            .acu-advanced-preset-editor-body {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                padding: 2px 2px 0;
            }
            .acu-advanced-preset-editor-fields {
                display: grid;
                grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
                gap: 12px;
                margin-bottom: 14px;
            }
            .acu-advanced-preset-field {
                min-width: 0;
            }
            .acu-advanced-preset-field label,
            .acu-advanced-preset-json-label {
                display: flex;
                align-items: baseline;
                gap: 6px;
                margin-bottom: 5px;
                color: var(--acu-text-sub);
                font-size: 12px;
                font-weight: 600;
                line-height: 1.35;
            }
            .acu-advanced-preset-json-label span {
                color: var(--acu-text-sub);
                font-size: 10px;
                font-weight: 400;
                opacity: 0.82;
            }
            .acu-advanced-preset-editor-dialog .acu-preset-editor-input {
                width: 100%;
                box-sizing: border-box;
                padding: 8px 10px;
                border-radius: 6px;
                font-size: 13px;
                line-height: 1.4;
            }
            .acu-advanced-preset-json-section {
                margin-bottom: 14px;
            }
            .acu-advanced-preset-json-head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 8px;
            }
            .acu-advanced-preset-json-textarea {
                width: 100%;
                height: 32em;
                min-height: 22em;
                box-sizing: border-box;
                padding: 10px 12px;
                border-radius: 6px;
                font-size: 12px;
                line-height: 1.5;
                resize: vertical;
            }
            .acu-advanced-preset-format-help-summary {
                display: flex;
                align-items: flex-start;
                gap: 6px;
                margin-top: 8px;
                padding: 8px 10px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-table-head);
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.45;
            }
            .acu-advanced-preset-format-help-summary strong {
                flex: 0 0 auto;
                color: var(--acu-text-main);
            }
            .acu-advanced-preset-format-help {
                margin-top: 8px;
                padding: 10px 12px;
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                background: var(--acu-table-head);
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.6;
            }
            .acu-advanced-preset-format-help strong {
                color: var(--acu-text-main);
            }
            .acu-attribute-preset-json-textarea {
                height: 26em;
                min-height: 18em;
            }
            .acu-action-preset-json-textarea {
                height: 24em;
                min-height: 18em;
            }
            .acu-dashboard-preset-json-textarea {
                height: 28em;
                min-height: 20em;
            }
            .acu-advanced-preset-editor-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                padding-top: 12px;
                border-top: 1px solid var(--acu-border);
                flex-shrink: 0;
            }
            .acu-advanced-preset-editor-tools,
            .acu-advanced-preset-editor-actions {
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }
            .acu-advanced-preset-editor-tools {
                flex: 0 1 auto;
            }
            .acu-advanced-preset-editor-actions {
                flex: 1 1 auto;
                justify-content: flex-end;
            }
            .acu-advanced-preset-editor-footer .acu-dialog-btn {
                flex: 0 0 auto;
                min-height: 38px;
                margin: 0;
            }
            .acu-advanced-preset-editor-footer .acu-advanced-preset-tool-btn {
                min-height: 36px;
                padding: 8px 10px;
                font-size: 12px;
            }
            .acu-advanced-preset-editor-footer .acu-advanced-preset-editor-save {
                flex: 0 1 220px;
                min-width: 160px;
                font-weight: 700;
            }
            .acu-template-inspection-card {
                border: 1px solid var(--acu-border);
                background: var(--acu-card-bg);
            }
            .acu-template-inspection-header-actions {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                flex: 0 0 auto;
            }
            .acu-template-inspection-title {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-template-inspection-tutorial-btn,
            .acu-template-inspection-close {
                width: 30px !important;
                height: 30px !important;
                min-width: 30px !important;
                min-height: 30px !important;
                margin: 0 !important;
                padding: 0 !important;
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                border: 1px solid transparent !important;
                border-radius: 6px !important;
                background: transparent !important;
                color: var(--acu-text-sub) !important;
                font-size: 17px;
            }
            .acu-template-inspection-tutorial-btn i,
            .acu-template-inspection-close i {
                color: inherit !important;
            }
            .acu-template-inspection-tutorial-btn:hover,
            .acu-template-inspection-tutorial-btn:focus-visible,
            .acu-template-inspection-close:hover,
            .acu-template-inspection-close:focus-visible {
                background: var(--acu-btn-hover, var(--acu-table-hover)) !important;
                color: var(--acu-accent) !important;
                border-color: var(--acu-border) !important;
                outline: none;
            }
            .acu-template-inspection-summary {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 12px;
                margin-bottom: 14px;
                padding: 0 0 10px;
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-template-inspection-summary-head {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                min-width: 0;
            }
            .acu-template-inspection-summary-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 18px;
                width: 18px;
                height: 18px;
                margin-top: 1px;
                color: var(--acu-template-inspection-summary-color, var(--acu-accent));
                font-size: 12px;
            }
            .acu-template-inspection-summary-copy {
                min-width: 0;
            }
            .acu-template-inspection-summary-title {
                color: var(--acu-text-main);
                font-size: 14px;
                font-weight: 800;
                line-height: 1.3;
            }
            .acu-template-inspection-stats {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end;
                gap: 4px 10px;
                flex: 0 0 auto;
                max-width: 50%;
                padding-top: 1px;
            }
            .acu-template-inspection-stat {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                min-height: 20px;
                padding: 0;
                border: 0;
                border-radius: 0;
                background: transparent;
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.2;
            }
            .acu-template-inspection-stat b {
                color: var(--acu-text-main);
                font-size: 12px;
                font-weight: 800;
            }
            .acu-template-inspection-stat-error {
                color: var(--acu-text-main);
            }
            .acu-template-inspection-stat-error b {
                color: var(--acu-error-text);
            }
            .acu-template-inspection-stat-warning {
                color: var(--acu-text-main);
            }
            .acu-template-inspection-stat-warning b {
                color: var(--acu-warning-text);
            }
            .acu-template-inspection-stat-info {
                color: var(--acu-text-main);
            }
            .acu-template-inspection-stat-info b {
                color: var(--acu-accent);
            }
            .acu-template-inspection-tabs {
                gap: 0 !important;
                padding: 0 !important;
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                background: var(--acu-card-bg);
                overflow-x: hidden !important;
                overflow-y: auto !important;
            }
            .acu-template-inspection-tab {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                min-height: 44px;
                padding: 8px 10px;
                border: 0;
                border-bottom: 1px solid var(--acu-border);
                border-radius: 0;
                background: transparent;
                color: var(--acu-text-main);
                cursor: pointer;
                text-align: left;
                touch-action: manipulation;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .acu-template-inspection-tab:last-child {
                border-bottom: 0;
            }
            .acu-template-inspection-tab:hover,
            .acu-template-inspection-tab:focus {
                background: var(--acu-table-hover);
                outline: none;
            }
            .acu-template-inspection-tab.active {
                background: color-mix(in srgb, var(--acu-template-inspection-color, var(--acu-accent)) 10%, var(--acu-table-head));
            }
            .acu-template-inspection-tab-icon {
                flex: 0 0 14px;
                width: 14px;
                color: var(--acu-template-inspection-color, var(--acu-accent));
                text-align: center;
                font-size: 12px;
            }
            .acu-template-inspection-tab-label {
                flex: 1;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-template-inspection-tab.active .acu-template-inspection-tab-label {
                font-weight: 700;
            }
            .acu-template-inspection-tab-count {
                margin-left: 0 !important;
                flex: 0 0 auto;
            }
            .acu-template-inspection-card-list {
                gap: 8px;
            }
            .acu-template-inspection-panels,
            .acu-template-inspection-panel,
            .acu-template-inspection-card-list,
            .acu-template-inspection-card {
                width: 100%;
                min-width: 0;
                box-sizing: border-box;
            }
            .acu-template-inspection-card .acu-changes-group-header {
                min-height: 42px;
                border-bottom: 1px solid var(--acu-border);
                background: var(--acu-table-head);
            }
            .acu-template-inspection-card .acu-changes-count {
                font-weight: 700;
            }
            .acu-template-inspection-card .acu-changes-group-body {
                padding: 0;
            }
            .acu-template-inspection-card .acu-change-item {
                border: 0;
                border-radius: 0;
                background: transparent;
                padding: 12px 14px;
            }
            .acu-template-inspection-dialog-clean {
                width: min(720px, 96vw) !important;
            }
            .acu-template-inspection-dialog-clean .acu-template-inspection-body {
                flex: 0 0 auto;
                overflow: visible;
                padding: 14px 0 !important;
            }
            .acu-template-inspection-clean-card {
                display: grid;
                grid-template-columns: minmax(0, 1fr);
                gap: 14px;
                padding: 16px;
                border: 1px solid var(--acu-border);
                border-radius: 10px;
                background: var(--acu-card-bg);
            }
            .acu-template-inspection-clean-result {
                display: grid;
                grid-template-columns: 42px minmax(0, 1fr);
                gap: 12px;
                align-items: center;
            }
            .acu-template-inspection-clean-icon {
                width: 42px;
                height: 42px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 999px;
                background: color-mix(in srgb, var(--acu-success-text) 18%, var(--acu-card-bg));
                color: var(--acu-success-text);
                font-size: 20px;
            }
            .acu-template-inspection-clean-copy {
                min-width: 0;
            }
            .acu-template-inspection-clean-title {
                color: var(--acu-text-main);
                font-size: 15px;
                font-weight: 700;
                line-height: 1.35;
            }
            .acu-template-inspection-clean-desc {
                margin-top: 3px;
                color: var(--acu-text-sub);
                font-size: 12px;
                line-height: 1.45;
            }
            .acu-template-inspection-clean-meta {
                display: grid;
                grid-template-columns: minmax(0, 1.5fr) minmax(92px, 0.6fr) minmax(126px, 0.8fr);
                gap: 8px;
            }
            .acu-template-inspection-clean-meta div {
                min-width: 0;
                padding: 8px 10px;
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                background: var(--acu-table-head);
            }
            .acu-template-inspection-clean-meta span {
                display: block;
                color: var(--acu-text-sub);
                font-size: 10px;
                line-height: 1.2;
                margin-bottom: 3px;
            }
            .acu-template-inspection-clean-meta strong {
                display: block;
                overflow: hidden;
                color: var(--acu-text-main);
                font-size: 12px;
                font-weight: 600;
                line-height: 1.35;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-template-inspection-clean-stats {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            .acu-template-inspection-clean-stats span {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border: 1px solid var(--acu-border);
                border-radius: 999px;
                color: var(--acu-text-sub);
                background: var(--acu-table-head);
                font-size: 11px;
                line-height: 1.2;
            }
            .acu-template-inspection-clean-stats b {
                color: var(--acu-text-main);
            }
            .acu-table-template-requirement-manager-dialog .acu-preset-item {
                align-items: center;
                padding: 12px;
                border-radius: 10px;
            }
            .acu-table-template-requirement-manager-dialog .acu-preset-name {
                display: flex;
                align-items: center;
                gap: 6px;
                max-width: 100%;
                margin-bottom: 3px;
            }
            .acu-table-template-requirement-manager-dialog .acu-preset-name .acu-preset-badge {
                margin-left: 0;
                flex-shrink: 0;
            }
            .acu-table-template-requirement-manager-dialog .acu-preset-actions {
                margin-left: auto;
                padding-left: 8px;
            }
            .acu-template-inspection-overlay .acu-template-inspection-layout-empty {
                min-height: 190px !important;
            }
            .acu-template-inspection-overlay .acu-template-inspection-layout-empty .acu-empty-hint {
                min-height: 190px !important;
                padding: 22px 20px !important;
            }
            .acu-template-inspection-overlay .acu-dialog-btn {
                white-space: nowrap;
            }
            .acu-template-inspection-overlay .acu-template-inspection-actions {
                flex-wrap: nowrap;
            }
            .acu-template-inspection-overlay .acu-template-inspection-download {
                flex: 0 1 auto;
                min-width: 0;
                max-width: 220px;
            }
            .acu-template-inspection-overlay .acu-template-inspection-primary-actions {
                flex: 0 0 auto;
                min-width: 0;
            }
            .acu-template-inspection-dialog-clean .acu-template-inspection-actions {
                padding-top: 12px;
                border-top: 1px solid var(--acu-border);
            }
            .acu-template-inspection-overlay .acu-dialog-btn:disabled {
                background: var(--acu-btn-bg);
                border-color: var(--acu-border);
                color: var(--acu-text-sub);
                opacity: 0.5;
                cursor: not-allowed;
                box-shadow: none;
            }
            @media (max-width: 768px) {
                .acu-edit-dialog.acu-advanced-preset-manager-dialog {
                    width: calc(100vw - 20px);
                    max-width: calc(100vw - 20px);
                    max-height: calc(100dvh - 24px);
                    padding: 12px;
                }
                .acu-advanced-preset-header h3 {
                    font-size: 15px;
                }
                #acu-advanced-presets-list .acu-preset-item {
                    grid-template-columns: 30px minmax(0, 1fr) auto;
                    column-gap: 8px;
                    padding: 9px 10px;
                }
                #acu-advanced-presets-list .acu-preset-handle {
                    display: none;
                }
                #acu-advanced-presets-list .acu-preset-actions {
                    gap: 4px;
                }
                #acu-advanced-presets-list .acu-preset-btn {
                    width: 28px;
                    height: 28px;
                    font-size: 12px;
                }
                .acu-table-template-requirement-manager-dialog .acu-preset-item {
                    align-items: stretch;
                    gap: 10px;
                    padding: 10px;
                }
                .acu-table-template-requirement-manager-dialog .acu-preset-actions {
                    gap: 5px;
                    padding-left: 0;
                }
                .acu-table-template-requirement-manager-dialog .acu-preset-btn {
                    width: 30px;
                    height: 30px;
                }
                .acu-advanced-preset-footer {
                    flex-wrap: nowrap;
                    gap: 6px;
                    padding-top: 10px;
                }
                .acu-advanced-preset-footer .acu-dialog-btn {
                    flex: 1 1 0;
                    min-width: 0;
                    min-height: 34px;
                    padding: 7px 6px;
                    font-size: 12px;
                }
                .acu-advanced-preset-footer .acu-advanced-preset-footer-main {
                    flex-basis: 0;
                }
            }
            @media (max-width: 480px) {
                .acu-edit-dialog.acu-advanced-preset-manager-dialog {
                    width: min(370px, calc(100vw - 20px));
                    max-width: min(370px, calc(100vw - 20px));
                }
            }
            @media (max-width: 768px) {
                .acu-edit-dialog.acu-advanced-preset-editor-dialog {
                    width: calc(100vw - 20px);
                    max-width: calc(100vw - 20px);
                    max-height: calc(100dvh - 24px);
                    padding: 12px;
                }
                .acu-advanced-preset-editor-fields {
                    grid-template-columns: minmax(0, 1fr);
                    gap: 10px;
                }
                .acu-advanced-preset-json-head {
                    flex-direction: column;
                    align-items: stretch;
                }
                .acu-advanced-preset-json-label {
                    flex-direction: column;
                    gap: 2px;
                }
                .acu-advanced-preset-json-textarea {
                    height: 24em;
                    min-height: 20em;
                }
                .acu-advanced-preset-format-help-summary {
                    flex-direction: column;
                    gap: 2px;
                }
                .acu-attribute-preset-json-textarea {
                    height: 20em;
                    min-height: 16em;
                }
                .acu-action-preset-json-textarea {
                    height: 20em;
                    min-height: 16em;
                }
                .acu-dashboard-preset-json-textarea {
                    height: 20em;
                    min-height: 16em;
                }
                .acu-advanced-preset-editor-footer {
                    flex-wrap: wrap;
                    align-items: stretch;
                }
                .acu-advanced-preset-editor-tools,
                .acu-advanced-preset-editor-actions {
                    flex: 1 1 100%;
                    width: 100%;
                    justify-content: stretch;
                }
                .acu-advanced-preset-editor-tools .acu-dialog-btn {
                    flex: 1 1 calc(50% - 4px);
                    min-width: 0;
                }
                .acu-advanced-preset-editor-actions .acu-dialog-btn {
                    flex: 1 1 calc(50% - 4px);
                    min-width: 0;
                }
                .acu-advanced-preset-editor-footer .acu-advanced-preset-editor-save {
                    flex: 1 1 calc(50% - 4px);
                }
            }
            @media (max-width: 480px) {
                .acu-edit-dialog.acu-advanced-preset-editor-dialog {
                    width: min(370px, calc(100vw - 20px));
                    max-width: min(370px, calc(100vw - 20px));
                }
            }
            @media (max-width: 768px) {
                .acu-edit-dialog .acu-dialog-btns {
                    flex-wrap: nowrap;
                }
                .acu-edit-dialog .acu-dialog-btn {
                    padding: 10px 8px;
                    font-size: 12px;
                    min-width: 0;
                }
                .acu-edit-dialog .acu-dialog-btn i {
                    font-size: 11px;
                }
            }
            @media (max-width: 768px) {
                .acu-change-item { padding: 8px 6px; }
                .acu-change-diff { flex-basis: 100%; margin-top: 4px; order: 10; }
                .acu-change-actions { order: 5; }
                .acu-diff-old, .acu-diff-new { max-width: 100px; }
                .acu-change-action-btn { width: 28px; height: 28px; }
            }
            @media (max-width: 768px) {
                .acu-template-inspection-overlay .acu-edit-dialog {
                    width: calc(100vw - 20px) !important;
                    max-width: calc(100vw - 20px) !important;
                    max-height: calc(100dvh - 24px) !important;
                    padding: 12px !important;
                }
                .acu-template-inspection-dialog-clean .acu-template-inspection-body {
                    padding: 10px 0 !important;
                }
                .acu-template-inspection-clean-card {
                    gap: 12px;
                    padding: 12px;
                }
                .acu-template-inspection-clean-result {
                    grid-template-columns: 36px minmax(0, 1fr);
                    gap: 10px;
                }
                .acu-template-inspection-clean-icon {
                    width: 36px;
                    height: 36px;
                    font-size: 17px;
                }
                .acu-template-inspection-clean-meta {
                    grid-template-columns: minmax(0, 1fr);
                    gap: 6px;
                }
                .acu-template-inspection-clean-meta div {
                    padding: 7px 9px;
                }
                .acu-template-inspection-overlay .acu-settings-content-scroll {
                    max-height: calc(100dvh - 230px) !important;
                    overflow-y: auto !important;
                    padding: 10px 0 !important;
                }
                .acu-template-inspection-overlay .acu-template-inspection-dialog-clean .acu-template-inspection-body {
                    max-height: none !important;
                    overflow: visible !important;
                }
                .acu-template-inspection-overlay .acu-template-inspection-dialog-clean .acu-template-inspection-actions {
                    gap: 8px !important;
                    padding-top: 10px !important;
                }
                .acu-template-inspection-overlay .acu-template-inspection-dialog-clean .acu-template-inspection-download {
                    flex: 1 1 0;
                    max-width: none;
                }
                .acu-template-inspection-overlay .acu-template-inspection-dialog-clean .acu-template-inspection-primary-actions {
                    flex: 0 0 auto;
                }
                .acu-template-inspection-summary {
                    flex-direction: column;
                    gap: 5px !important;
                    padding: 0 0 8px !important;
                    margin-bottom: 10px !important;
                }
                .acu-template-inspection-summary-head {
                    gap: 7px;
                }
                .acu-template-inspection-summary-icon {
                    flex-basis: 16px;
                    width: 16px;
                    height: 16px;
                    font-size: 11px;
                }
                .acu-template-inspection-summary-title {
                    font-size: 13px;
                }
                .acu-template-inspection-stats {
                    display: flex;
                    gap: 4px 10px;
                    justify-content: flex-start;
                    max-width: none;
                }
                .acu-template-inspection-stat {
                    justify-content: flex-start;
                    min-width: 0;
                    min-height: 18px;
                    padding: 0;
                }
                .acu-template-inspection-layout {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: stretch !important;
                    gap: 10px !important;
                }
                .acu-template-inspection-tabs {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 0 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    min-width: 0 !important;
                    max-height: none !important;
                    overflow: visible !important;
                    padding: 0 !important;
                }
                .acu-template-inspection-layout-empty {
                    min-height: 180px !important;
                }
                .acu-template-inspection-tab {
                    width: 100% !important;
                    min-width: 0 !important;
                    max-width: none !important;
                    padding: 8px 9px !important;
                    min-height: 44px;
                }
                .acu-template-inspection-panels {
                    width: 100% !important;
                    min-width: 0 !important;
                    max-width: 100% !important;
                    max-height: none !important;
                    overflow: visible !important;
                    padding-right: 0 !important;
                }
                .acu-template-inspection-card .acu-changes-group-header {
                    padding: 8px !important;
                    align-items: flex-start !important;
                    gap: 6px !important;
                }
                .acu-template-inspection-card .acu-changes-count {
                    margin-left: 4px !important;
                    flex-shrink: 0;
                }
                .acu-template-inspection-card .acu-change-item {
                    padding: 8px !important;
                    word-break: break-word;
                }
                .acu-template-inspection-overlay .acu-dialog-btns {
                    gap: 8px !important;
                    padding: 10px 12px !important;
                }
                .acu-template-inspection-overlay .acu-dialog-btn {
                    min-width: 0 !important;
                    white-space: nowrap !important;
                }
                .acu-template-inspection-overlay .acu-template-inspection-primary-actions {
                    flex-wrap: nowrap !important;
                    min-width: 0;
                }
            }
            .acu-template-inspection-layout-empty {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                min-height: 190px;
            }
            .acu-template-inspection-layout-empty .acu-template-inspection-tabs {
                display: none !important;
            }
            .acu-template-inspection-layout-empty .acu-template-inspection-panels {
                flex: 1;
                max-height: none !important;
                overflow: visible !important;
                padding-right: 0 !important;
            }
            .acu-template-inspection-layout-empty .acu-empty-hint {
                width: 100%;
                min-height: 190px !important;
                padding: 22px 20px !important;
            }
            .acu-change-field-count { font-size: 11px; color: var(--acu-text-sub); margin-left: 4px; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            /* 多字段整体编辑弹窗样式 */
            .acu-row-edit-field { margin-bottom: 12px; padding: 10px; background: var(--acu-table-head); border-radius: 6px; border: 1px solid transparent; }
            .acu-row-edit-field.acu-field-changed { border-color: var(--acu-accent); background: var(--acu-bg-panel); }
            .acu-row-edit-label { font-size: 12px; font-weight: bold; color: var(--acu-text-sub); margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
            .acu-changed-badge { font-size: 10px; padding: 1px 6px; background: var(--acu-accent); color: var(--acu-btn-active-text); border-radius: 3px; font-weight: normal; }
            .acu-row-edit-old { font-size: 12px; color: var(--acu-text-sub); padding: 6px 8px; background: var(--acu-table-head); border-radius: 4px; margin-bottom: 6px; text-decoration: line-through; opacity: 0.7; white-space: pre-wrap; word-break: break-word; }
            .acu-row-edit-input { width: 100%; min-height: 36px; max-height: 200px; padding: 8px; resize: none; }
            .acu-empty-val { opacity: 0.5; font-style: italic; }
            `;
