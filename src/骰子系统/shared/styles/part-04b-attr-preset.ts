/**
 * part-04b-attr-preset.ts — part-04 子分片（从 part-04-validation 拆分，按序拼接内容不变）。
 */
export const STYLES_PART_04B_ATTR_PRESET = `            /* ========== 属性预设管理面板样式 ========== */
            .acu-preset-item {
                display: grid;
                grid-template-columns: 32px minmax(0, 1fr) auto 28px;
                column-gap: 12px;
                align-items: center;
                padding: 10px 12px;
                background: var(--acu-card-bg);
                border: 1px solid rgba(var(--acu-accent-rgb, 128, 128, 128), 0.15);
                border-radius: 12px;
                margin-bottom: 10px;
                transition: all 0.14s ease-out;
                position: relative;
            }
            /* 简化布局：仅有 info + actions 两列的面板 */
            #acu-presets-list .acu-preset-item,
            #acu-action-presets-list .acu-preset-item,
            #acu-dashboard-presets-list .acu-preset-item,
            #acu-render-presets-list .acu-preset-item,
            #acu-table-template-requirement-presets-list .acu-preset-item {
                display: flex;
                gap: 12px;
            }
            #acu-presets-list .acu-preset-info,
            #acu-action-presets-list .acu-preset-info,
            #acu-dashboard-presets-list .acu-preset-info,
            #acu-render-presets-list .acu-preset-info,
            #acu-table-template-requirement-presets-list .acu-preset-info {
                flex: 1;
                min-width: 0;
            }
            #acu-dashboard-presets-list .acu-preset-stats,
            #acu-render-presets-list .acu-preset-stats,
            #acu-table-template-requirement-presets-list .acu-preset-stats {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #acu-action-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-dashboard-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-render-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-table-template-requirement-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-action-presets-list .acu-preset-item,
            #acu-dashboard-presets-list .acu-preset-item,
            #acu-render-presets-list .acu-preset-item,
            #acu-table-template-requirement-presets-list .acu-preset-item {
                margin-bottom: 0;
            }
            #acu-action-presets-list .acu-preset-stats,
            #acu-table-template-requirement-presets-list .acu-preset-stats {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-preset-item.acu-preset-hidden {
                opacity: 0.6;
                border-color: var(--acu-border);
            }
            .acu-preset-item:hover {
                background: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.04);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                border-color: var(--acu-accent);
                transform: translateY(-1px);
                z-index: 1;
            }
            .acu-preset-check {
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border-radius: 10px;
                color: var(--acu-accent);
                transition: all 0.14s;
            }
            .acu-preset-check:hover {
                background: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.1);
            }
            .acu-preset-item.acu-preset-hidden .acu-preset-check {
                color: var(--acu-text-sub);
                opacity: 0.5;
            }
            .acu-preset-info {
                min-width: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .acu-preset-name {
                font-size: 14px;
                font-weight: 600;
                color: var(--acu-text-main);
                margin-bottom: 2px;
                letter-spacing: 0.2px;
                line-height: 1.15;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-preset-desc {
                font-size: 11px;
                color: var(--acu-text-sub);
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                opacity: 0.8;
            }
            .acu-preset-stats {
                font-size: 10px;
                color: var(--acu-text-sub);
                opacity: 0.7;
            }
            .acu-preset-actions {
                display: flex;
                gap: 6px;
                flex-shrink: 0;
                align-items: center;
            }
            .acu-preset-btn {
                width: 30px;
                height: 30px;
                border: 1px solid transparent;
                border-radius: 10px;
                background: transparent;
                color: var(--acu-text-sub);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                transition: all 0.14s;
                opacity: 0.7;
            }
            .acu-preset-btn:hover {
                background: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.1);
                color: var(--acu-accent);
                opacity: 1;
            }
            .acu-preset-btn:active {
                transform: translateY(1px);
            }
            .acu-preset-btn:focus-visible {
                outline: 2px solid var(--acu-accent);
                outline-offset: 1px;
            }
            .acu-preset-btn.acu-preset-delete:hover {
                background: rgba(231, 76, 60, 0.15);
                color: #e74c3c;
            }
            .acu-preset-handle {
                width: 28px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: grab;
                color: var(--acu-text-sub);
                opacity: 0.55;
                transition: opacity 0.2s;
            }
            .acu-preset-item:hover .acu-preset-handle {
                opacity: 0.95;
            }
            .acu-preset-handle:active {
                cursor: grabbing;
            }
            /* 预设编辑器输入框样式（防止被主题覆盖） */
            .acu-preset-editor-input,
            .acu-preset-editor-textarea {
                background: var(--acu-input-bg) !important;
                color: var(--acu-text-main) !important;
                border: 1px solid var(--acu-border) !important;
            }
            .acu-preset-editor-input:focus,
            .acu-preset-editor-textarea:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: 0 0 0 2px rgba(var(--acu-accent-rgb, 100, 150, 200), 0.2) !important;
            }
            .acu-preset-editor-textarea {
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
            }
            /* Toggle 开关 */
            .acu-toggle {
                position: relative;
                width: 44px;
                height: 24px;
                flex-shrink: 0;
            }
            .acu-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .acu-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(120, 120, 128, 0.16);
                border: none;
                border-radius: 24px;
                transition: all 0.3s ease;
            }
            .acu-toggle-slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 2px;
                top: 2px;
                background: #fff;
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            }
            .acu-toggle input:checked + .acu-toggle-slider {
                background: var(--acu-accent);
            }
            .acu-toggle input:checked + .acu-toggle-slider:before {
                transform: translateX(20px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            /* Range Slider 滑条样式 */
            .acu-range-slider {
                -webkit-appearance: none;
                appearance: none;
                flex: 1;
                height: 6px;
                border-radius: 3px;
                background: rgba(120, 120, 128, 0.3);
                outline: none;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            .acu-range-slider::-webkit-slider-runnable-track {
                height: 6px;
                border-radius: 3px;
                background: transparent;
            }
            .acu-range-slider::-webkit-slider-thumb {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 18px !important;
                height: 18px !important;
                border-radius: 50% !important;
                background: #fff !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
                cursor: pointer !important;
                margin-top: -6px !important;
                transition: all 0.2s ease;
            }
            .acu-range-slider:hover::-webkit-slider-thumb {
                transform: scale(1.05) !important;
                background: #e8e8e8 !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
            }
            .acu-range-slider:active::-webkit-slider-thumb {
                transform: scale(0.95) !important;
                background: #d0d0d0 !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.15) !important;
            }
            .acu-range-slider::-moz-range-track {
                height: 6px;
                border-radius: 3px;
                background: rgba(120, 120, 128, 0.16);
            }
            .acu-range-slider::-moz-range-thumb {
                width: 18px !important;
                height: 18px !important;
                border-radius: 50% !important;
                background: #fff !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
                cursor: pointer !important;
                transition: all 0.2s ease;
            }
            .acu-range-slider:hover::-moz-range-thumb {
                transform: scale(1.05) !important;
                background: #e8e8e8 !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
            }
            .acu-range-slider:active::-moz-range-thumb {
                transform: scale(0.95) !important;
                background: #d0d0d0 !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.15) !important;
            }
            .acu-range-value {
                min-width: 45px;
                text-align: right;
                font-weight: 600;
                font-size: 13px;
                color: var(--acu-accent, var(--SmartThemeBodyColor, #d4a574));
            }
            /* 疯狂程度按钮组样式 */
            .acu-crazy-btn {
                padding: 4px 12px;
                font-size: 12px;
                border: 1px solid var(--acu-border, rgba(0,0,0,0.1));
                border-radius: 4px;
                background: var(--acu-btn-bg, rgba(0,0,0,0.05));
                color: var(--acu-text, inherit);
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
            }
            .acu-crazy-btn:hover {
                background: var(--acu-btn-hover, rgba(0,0,0,0.1));
            }
            .acu-crazy-btn.active {
                background: var(--acu-accent, #d4a574);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent, #d4a574);
                box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            }
            /* Debug控制台过滤样式 - 增加优先级防止被酒馆样式覆盖 */
            .acu-debug-console-dialog .acu-debug-filter,
            .acu-debug-console-dialog label input.acu-debug-filter {
                cursor: pointer !important;
                width: auto !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                appearance: checkbox !important;
                -webkit-appearance: checkbox !important;
                -moz-appearance: checkbox !important;
            }
            .acu-debug-console-dialog label {
                display: flex !important;
                align-items: center !important;
                gap: 4px !important;
                cursor: pointer !important;
                font-size: 12px !important;
            }
            .acu-setting-action-btn {
                width: 100%;
                padding: 10px 14px;
                margin-bottom: 6px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                font-size: 13px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.15s;
            }
            .acu-settings-compact-action {
                width: 90px;
                padding: 6px 12px;
                margin-bottom: 0;
                font-size: 12px;
            }
            .acu-blacklist-manager-overlay {
                z-index: 31300 !important;
                padding: 20px;
            }
            .acu-blacklist-manager-dialog {
                width: min(600px, 90vw);
                max-width: 600px;
                max-height: min(82vh, 620px);
                padding: 0;
                gap: 0;
            }
            .acu-blacklist-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 14px 16px;
                border-bottom: 1px solid var(--acu-border);
                background: var(--acu-table-head);
                flex-shrink: 0;
            }
            .acu-blacklist-header h3 {
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
                margin: 0;
                color: var(--acu-text-main);
                font-size: 16px;
                line-height: 1.3;
            }
            .acu-blacklist-body {
                display: flex;
                flex: 1;
                flex-direction: column;
                min-height: 0;
                overflow-y: auto;
                padding: 16px;
            }
            .acu-blacklist-field {
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-width: 0;
            }
            .acu-blacklist-hint {
                color: var(--acu-text-sub);
                font-size: 12px;
                line-height: 1.45;
            }
            .acu-blacklist-textarea {
                width: 100%;
                min-height: 124px;
                max-height: 300px;
                resize: vertical;
                font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace;
                line-height: 1.5;
            }
            .acu-blacklist-add-row {
                display: flex;
                align-items: stretch;
                gap: 8px;
                min-width: 0;
            }
            .acu-blacklist-input {
                flex: 1;
                min-width: 0;
            }
            .acu-edit-dialog.acu-blacklist-manager-dialog .acu-blacklist-add-btn {
                flex: 0 0 auto;
                min-width: 88px;
                padding-inline: 14px;
            }
            .acu-edit-dialog.acu-blacklist-manager-dialog .acu-blacklist-actions {
                margin: 16px -16px -16px;
            }
            .acu-edit-dialog.acu-blacklist-manager-dialog .acu-blacklist-actions .acu-dialog-btn {
                min-height: 38px;
            }
            .acu-edit-dialog.acu-dice-settings-dialog {
                width: min(92vw, 600px);
                max-width: 600px;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                padding: 14px;
            }
            .acu-dice-settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid var(--acu-border);
                flex-shrink: 0;
            }
            .acu-dice-settings-header h3 {
                margin: 0;
                font-size: 17px;
                font-weight: 700;
                color: var(--acu-text-main);
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }
            .acu-dice-settings-header h3 i {
                color: var(--acu-accent);
            }
            .acu-dice-settings-actions {
                display: flex;
                align-items: center;
                gap: 4px;
                flex-shrink: 0;
            }
            .acu-dice-settings-body {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                padding: 12px 0 0;
                overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch;
            }
            .acu-dice-settings-section + .acu-dice-settings-section {
                margin-top: 0;
                padding-top: 0;
                border-top: 0;
            }
            .acu-dice-settings-dialog .acu-setting-row {
                gap: 12px;
                min-height: 42px;
                padding: 8px 0;
            }
            .acu-dice-settings-dialog .acu-setting-dependent-row {
                margin-left: 24px;
                min-height: 40px;
            }
            .acu-dice-settings-dialog .acu-setting-info {
                min-width: 0;
            }
            .acu-dice-settings-dialog .acu-setting-label {
                overflow-wrap: anywhere;
            }
            .acu-dice-settings-dialog .acu-dice-settings-action {
                width: 90px;
                flex: 0 0 90px;
                padding: 6px 12px;
                font-size: 12px;
                margin-bottom: 0;
            }
            .acu-dice-settings-dialog .acu-dice-settings-select {
                width: 90px;
                min-width: 90px;
                flex: 0 0 90px;
                text-align: center;
                text-align-last: center;
            }
            .acu-dice-settings-dialog #dice-settings-crazy-mode-row {
                min-height: 42px;
                border-bottom: 1px dashed var(--acu-border);
            }
            @media (max-width: 640px) {
                .acu-edit-dialog.acu-dice-settings-dialog {
                    width: calc(100vw - 20px);
                    max-height: calc(100dvh - 24px);
                    padding: 12px;
                }
                .acu-dice-settings-header h3 {
                    font-size: 16px;
                }
                .acu-dice-settings-dialog .acu-dice-settings-action,
                .acu-dice-settings-dialog .acu-dice-settings-select {
                    width: 86px;
                    min-width: 86px;
                    flex-basis: 86px;
                }
            }
            /* Stepper 步进器 */
            .acu-stepper {
                display: flex;
                align-items: center;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                overflow: hidden;
                background: transparent !important;
                flex-shrink: 0;
            }
            .acu-stepper-btn {
                width: 36px;
                height: 34px;
                border: none !important;
                background: transparent !important;
                background-color: transparent !important;
                color: var(--acu-text-sub);
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s;
                -webkit-appearance: none !important;
                appearance: none !important;
            }
            .acu-stepper-btn:hover {
                background: var(--acu-table-hover) !important;
                color: var(--acu-accent);
            }
            .acu-stepper-btn:active {
                transform: scale(0.95);
                background: var(--acu-accent) !important;
                color: var(--acu-button-text);
            }
            .acu-stepper-value {
                min-width: 60px;
                height: 34px;
                line-height: 34px;
                text-align: center;
                font-size: 13px;
                font-weight: 600;
                color: var(--acu-text-main);
                background: transparent !important;
                border-left: 1px solid var(--acu-border);
                border-right: 1px solid var(--acu-border);
            }
`;
