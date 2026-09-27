/**
 * part-02a-dice-ui.ts — part-02 子分片（从 part-02-avatar 拆分，按序拼接内容不变）。
 */
export const STYLES_PART_02A_DICE_UI = `/* === 移动端投骰面板适配 === */
            @media (max-width: 768px) {
                .acu-dice-panel, .acu-contest-panel {
                    position: relative !important;
                    top: auto !important;
                    left: auto !important;
                    transform: none !important;
                    width: 92vw !important;
                    max-width: 400px !important;
                    max-height: calc(100vh - 32px) !important;
                    max-height: calc(100dvh - 32px) !important;
                }
                .acu-dice-overlay, .acu-contest-overlay {
                    align-items: center !important;
                    padding: 16px !important;
                }
            }
                /* === 仪表盘新增样式：可展开地点列表 === */
                .acu-dash-body {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr 1fr;
                    gap: 12px;
                    margin: 6px 0;
                }

                .acu-dashboard-section {
                    background: var(--acu-card-bg);
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid var(--acu-border);
                    min-width: 0;
                }

                .acu-dash-section-heading {
                    margin: 0 0 8px 0;
                    font-size: 14px;
                    color: var(--acu-accent);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 6px;
                    min-width: 0;
                    line-height: 1.3;
                }

                .acu-dash-section-heading > span:first-child {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .acu-dash-subheading {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin: 6px 0 4px 0;
                    font-size: 12px;
                    line-height: 1.3;
                    color: var(--acu-accent);
                }

                .acu-dash-status-badge {
                    max-width: 80px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    padding: 2px 8px;
                    border: 1px solid var(--acu-border);
                    border-radius: 999px;
                    background: var(--acu-badge-bg);
                    color: var(--acu-text-main);
                    font-size: 11px;
                    font-weight: 500;
                }

                .acu-dash-section-actions {
                    display: inline-flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 6px;
                    flex-shrink: 0;
                }

                .acu-dash-resource-list,
                .acu-dash-location-list,
                .acu-dash-role-list,
                .acu-dash-items-list,
                .acu-dash-equipment-list,
                .acu-dash-quest-list {
                    scrollbar-width: thin;
                    scrollbar-color: var(--acu-scrollbar-thumb) transparent;
                }

                .acu-dash-resource-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2px 6px;
                    max-height: 44px;
                    overflow-y: auto;
                    margin-bottom: 4px;
                    padding-bottom: 4px;
                    border-bottom: 1px solid var(--acu-border);
                }

                .acu-dash-location-list,
                .acu-dash-role-list,
                .acu-dash-items-list,
                .acu-dash-equipment-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2px 6px;
                    align-content: start;
                    overflow-x: hidden;
                    overflow-y: auto;
                }

                .acu-dash-location-list { max-height: 110px; margin-bottom: 10px; }
                .acu-dash-role-list { max-height: 150px; }
                .acu-dash-items-list { max-height: 90px; margin-bottom: 10px; }
                .acu-dash-equipment-list { max-height: 80px; margin-bottom: 10px; }
                .acu-dash-quest-list { max-height: 60px; overflow-y: auto; }

                .acu-dash-metric-row,
                .acu-dash-attr-row,
                .acu-dash-person-row,
                .acu-dash-item-row,
                .acu-dash-equipment-row,
                .acu-task-item {
                    min-width: 0;
                }

                .acu-dash-metric-row,
                .acu-dash-attr-row,
                .acu-dash-item-row,
                .acu-dash-row-main {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 6px;
                }

                .acu-dash-metric-row,
                .acu-dash-attr-row {
                    padding: 2px 3px;
                }

                .acu-dash-attr-list {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2px 4px;
                    max-height: 104px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    padding-bottom: 2px;
                }

                .acu-dash-attr-row {
                    border-bottom: 1px dashed var(--acu-border);
                }

                .acu-dash-metric-label {
                    min-width: 0;
                    color: var(--acu-text-sub);
                    font-size: 10px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .acu-dash-metric-value-group,
                .acu-dash-row-actions {
                    display: inline-flex;
                    align-items: center;
                    gap: 2px;
                    flex-shrink: 0;
                }

                .acu-dash-metric-value {
                    color: var(--acu-accent);
                    font-size: 11px;
                    font-weight: 700;
                }

                .acu-dash-attr-value {
                    color: var(--acu-text-main);
                    font-size: 11px;
                    font-weight: 700;
                }

                .acu-dash-row-separated {
                    border-bottom: 1px dashed var(--acu-border);
                }

                .acu-dash-person-row {
                    padding: 6px 4px;
                }

                .acu-dash-name-with-avatar,
                .acu-dash-item-name,
                .acu-dash-equipment-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    min-width: 0;
                    color: var(--acu-text-main);
                    font-size: 12px;
                }

                .acu-dash-item-name,
                .acu-dash-equipment-row span {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .acu-dash-item-row {
                    padding: 5px 4px;
                    font-size: 11px;
                }

                .acu-dash-equipment-row {
                    padding: 4px;
                    font-size: 11px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .acu-dash-muted {
                    opacity: 0.6;
                }

                .acu-task-main {
                    font-weight: 600;
                }

                .acu-location-group {
                    margin-bottom: 8px;
                    border-radius: 6px;
                    overflow: hidden;
                    background: var(--acu-card-bg);
                    border: 1px solid transparent;
                    transition: border-color var(--acu-motion-fast) var(--acu-ease-standard), background-color var(--acu-motion-fast) var(--acu-ease-standard);
                }

                .acu-location-group.expanded {
                    border-color: var(--acu-accent);
                }

                .acu-location-header {
                    padding: 8px 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--acu-table-head);
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard);
                    user-select: none;
                }

                .acu-location-header:hover {
                    background: var(--acu-table-hover);
                }

                .acu-expand-icon {
                    font-size: 10px;
                    transition: transform 0.2s;
                    color: var(--acu-text-sub);
                }

                .acu-location-group.expanded .acu-expand-icon {
                    transform: rotate(90deg);
                    color: var(--acu-accent);
                }

                .acu-region-name {
                    flex: 1;
                    font-weight: bold;
                    font-size: 13px;
                    color: var(--acu-text-main);
                }

                .acu-location-count {
                    font-size: 11px;
                    color: var(--acu-text-sub);
                }

                .acu-location-list {
                    max-height: 0;
                    overflow: hidden;
                    opacity: 0;
                    transition: opacity var(--acu-motion-normal) var(--acu-ease-standard);
                }

                .acu-location-group.expanded .acu-location-list {
                    max-height: 500px;
                    opacity: 1;
                }

                .acu-location-item {
                    padding: 6px 10px 6px 26px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    border-bottom: 1px dashed rgba(0,0,0,0.05);
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard);
                }

                /* 仪表盘地点名称单行省略样式 */
                .acu-dash-locations .acu-location-item {
                    padding: 4px 8px !important;
                    min-width: 0; /* 允许flex子元素收缩 */
                    overflow: hidden; /* 防止内容溢出 */
                    align-items: center;
                    color: var(--acu-text-main);
                }

                .acu-dash-locations .acu-location-item > span:first-child {
                    display: flex !important;
                    align-items: center;
                    gap: 6px;
                    flex: 1;
                    min-width: 0; /* 允许flex子元素收缩 */
                    overflow: hidden;
                }

                .acu-dash-locations .acu-location-item > span:first-child i {
                    flex-shrink: 0; /* 图标不收缩 */
                    font-size: 9px;
                    opacity: 0.4;
                    color: var(--acu-text-sub);
                }

                .acu-dash-locations .acu-location-item > i {
                    margin-left: auto;
                    width: 14px;
                    text-align: center;
                    font-size: 10px;
                    opacity: 0.4;
                    color: var(--acu-text-sub);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                }

                .acu-dash-locations .acu-location-item > span:first-child > span {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex: 1;
                    min-width: 0; /* 允许flex子元素收缩 */
                }

                .acu-location-item:last-child {
                    border-bottom: none;
                }

                .acu-location-item:hover {
                    background: var(--acu-table-hover);
                }

                .acu-location-item.current {
                    background: var(--acu-hl-diff-bg);
                }

                .acu-location-item i {
                    font-size: 10px;
                    opacity: 0.6;
                }

                .acu-current-badge {
                    margin-left: auto;
                    font-size: 10px;
                    padding: 2px 6px;
                    background: var(--acu-btn-active-bg);
                    color: var(--acu-btn-active-text);
                    border-radius: 3px;
                    font-weight: bold;
                }
                /* === 仪表盘核心样式（补充） === */
                .acu-dash-context {
                    background: linear-gradient(135deg, var(--acu-table-head), var(--acu-bg-panel));
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    border: 1px solid var(--acu-border);
                }

                .acu-dash-location {
                    font-size: 18px;
                    font-weight: bold;
                    color: var(--acu-accent);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .acu-dash-location-desc {
                    font-size: 13px;
                    color: var(--acu-text-sub);
                    margin-top: 6px;
                    line-height: 1.5;
                }

                .acu-player-status {
                    font-size: 13px;
                    color: var(--acu-text-main);
                }

                .acu-task-item {
                    padding: 4px 3px;
                    margin-bottom: 0;
                    background: transparent;
                    border: 0;
                    border-bottom: 1px dashed var(--acu-border);
                    border-radius: 0;
                }
                .acu-task-item:last-child {
                    border-bottom: 0;
                }
                .acu-task-item.acu-dash-clickable:hover,
                .acu-task-item.acu-dash-clickable:active {
                    background: transparent;
                }
                .acu-task-item.acu-dash-clickable:hover .acu-task-name {
                    color: var(--acu-accent);
                }

                .acu-task-name {
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 11px;
                    font-weight: 500;
                    color: var(--acu-text-main);
                }

                .acu-empty-hint {
                    font-size: 11px;
                    color: var(--acu-text-sub);
                    text-align: center;
                    padding: 15px;
                    opacity: 0.7;
                    grid-column: 1 / -1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                /* 仪表盘中有固定高度容器的空状态居中 */
                .acu-player-status .acu-empty-hint,
                .acu-dash-locations > div .acu-empty-hint {
                    height: 100%;
                    min-height: inherit;
                }
                /* 审核面板空状态居中 */
                .acu-changes-content .acu-empty-hint {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                }

                .acu-dashboard-content {
                    padding: 8px 15px;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    -webkit-overflow-scrolling: touch !important;
                    touch-action: pan-y !important;
                    overscroll-behavior-y: contain;
                    max-height: calc(80vh - 60px);
                }

                .acu-wrapper.acu-dice-ui-root .acu-data-display.acu-manual-mode .acu-dashboard-content {
                    max-height: none !important;
                }

                /* === 仪表盘交互按钮优化 === */
                h3.acu-dash-table-link,
                h4.acu-dash-table-link {
                    cursor: pointer;
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard);
                    padding: 2px 4px;
                    margin: -2px -4px;
                    border-radius: 4px;
                }
                h3.acu-dash-table-link:hover,
                h4.acu-dash-table-link:hover {
                    color: var(--acu-accent);
                    background: var(--acu-table-hover);
                }

                /* 仪表盘操作图标 - 统一放大+增加点击热区 */
                .acu-dash-dice-btn,
                .acu-dash-goto-btn,
                .acu-dash-use-item-btn,
                .acu-dash-use-skill-btn,
                .acu-dash-track-task-btn,
                .acu-dash-msg-btn,
                .acu-dash-contest-btn,
                .acu-dash-dice-free,
                .acu-dash-map-btn,
                .acu-dash-gacha-btn,
                .acu-dash-inventory-btn,
                .acu-dash-relation-graph-btn,
                .acu-dash-avatar-manager-btn {
                    cursor: pointer;
                    color: var(--acu-text-sub);
                    opacity: 0.5;
                    font-size: 14px !important;
                    padding: 6px;
                    margin: -4px;
                    border-radius: 4px;
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), opacity var(--acu-motion-fast) var(--acu-ease-standard);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 28px;
                    min-height: 28px;
                }
                .acu-dash-dice-btn:hover,
                .acu-dash-goto-btn:hover,
                .acu-dash-use-item-btn:hover,
                .acu-dash-use-skill-btn:hover,
                .acu-dash-track-task-btn:hover,
                .acu-dash-msg-btn:hover,
                .acu-dash-contest-btn:hover,
                .acu-dash-dice-free:hover,
                .acu-dash-map-btn:hover,
                .acu-dash-gacha-btn:hover,
                .acu-dash-inventory-btn:hover,
                .acu-dash-relation-graph-btn:hover,
                .acu-dash-avatar-manager-btn:hover {
                    opacity: 1;
                    color: var(--acu-accent);
                    background: var(--acu-table-hover);
                }

                /* 仪表盘可点击项 - 增强反馈 */
                .acu-dash-clickable {
                    cursor: pointer;
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard);
                    border-radius: 4px;
                }
                .acu-dash-clickable:hover {
                    background: var(--acu-table-hover);
                }
                .acu-dash-clickable:active {
                    background: var(--acu-table-hover);
                }

                @media (max-width: 768px) {
                    .acu-dash-body:not(.acu-dash-horizontal) {
                        grid-template-columns: 1fr;
                        max-height: none;
                        overflow: visible;
                    }

                    .acu-dashboard-content {
                        max-height: calc(50vh - 40px) !important;
                        padding: 8px 10px !important;
                        padding-bottom: 8px !important;
                    }

                    .acu-dash-body.acu-dash-horizontal {
                        gap: 10px;
                        padding-bottom: 6px;
                    }

                    .acu-dash-player,
                    .acu-dash-locations,
                    .acu-dash-intel {
                        padding: 10px;
                    }

                    /* 移动端进一步放大操作按钮 */
                    .acu-dash-dice-btn,
                    .acu-dash-goto-btn,
                    .acu-dash-use-item-btn,
                    .acu-dash-use-skill-btn,
                    .acu-dash-track-task-btn,
                    .acu-dash-msg-btn,
                    .acu-dash-contest-btn,
                    .acu-dash-dice-free,
                    .acu-dash-map-btn,
                    .acu-dash-gacha-btn,
                    .acu-dash-inventory-btn,
                    .acu-dash-relation-graph-btn,
                    .acu-dash-avatar-manager-btn {
                        font-size: 16px !important;
                        padding: 8px;
                        min-width: 36px;
                        min-height: 36px;
                    }
                }
            /* === 仪表盘预览卡片样式 === */
            .acu-preview-overlay {
                z-index: 31100 !important;
                backdrop-filter: blur(3px);
                animation: acuFadeIn 0.2s ease;
            }

                .acu-preview-overlay .acu-data-card {
                    width: 90vw;
                    max-width: 400px;
                    flex: none;
                }
                @media (min-width: 768px) {
                    .acu-preview-overlay .acu-data-card {
                        max-width: 550px;
                    }
                }

            .acu-preview-close:hover {
                background: var(--acu-error-bg, rgba(231, 76, 60, 0.1));
                color: var(--acu-error-text, #e74c3c);
            }

            .acu-dash-clickable {
                cursor: pointer;
                transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard);
            }

            .acu-dash-clickable:hover {
                background: var(--acu-table-hover);
            }
            .acu-current-location span {
                color: inherit;
                font-weight: inherit;
            }
            .acu-current-location i {
                color: inherit;
            }
            .acu-current-location > span:first-child > span {
                font-weight: 600;
            }
            /* === 自定义下拉菜单样式 === */
            .acu-dropdown-wrapper { position: relative; width: 100%; }
            .acu-dropdown-list {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                max-height: 150px;
                overflow-y: auto;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 31105;
                display: none;
            }
            .acu-dropdown-list.visible { display: block; }
            .acu-dropdown-item {
                padding: 6px 10px;
                font-size: 12px;
                cursor: pointer;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                background: transparent;
                color: var(--acu-text-main);
                transition: background 0.1s;
            }
            .acu-dropdown-item:hover {
                background: var(--acu-table-head);
            }
            .acu-dropdown-empty {
                padding: 8px 10px;
                font-size: 12px;
                text-align: center;
                color: var(--acu-text-sub);
                opacity: 0.7;
            }
            /* === 输入框清除按钮样式 === */
            .acu-input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
            .acu-input-wrapper input { padding-right: 24px !important; }
            .acu-clear-btn { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: transparent !important; border: none !important; font-size: 12px; cursor: pointer; padding: 4px; line-height: 1; opacity: 0.5; transition: opacity 0.2s, color 0.2s; z-index: 5; color: var(--acu-text-sub); }
            .acu-clear-btn:hover { background: transparent !important; border: none !important; opacity: 1 !important; color: var(--acu-accent) !important; }

            /* === 结果徽章样式 === */
            .acu-result-badge {
                padding: 3px 8px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: bold;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                border: 1px solid transparent;
            }
            .acu-result-badge-crit-success { background-color: var(--acu-success-bg); color: var(--acu-text-main); border-color: var(--acu-accent); }
            .acu-result-badge-extreme-success { background-color: var(--acu-hl-diff-bg); color: var(--acu-text-main); border-color: var(--acu-hl-diff); }
            .acu-result-badge-success { background-color: var(--acu-success-bg); color: var(--acu-text-main); border-color: var(--acu-success-text); }
            .acu-result-badge-warning { background-color: var(--acu-warning-bg); color: var(--acu-text-main); border-color: var(--acu-warning-text); }
            .acu-result-badge-failure { background-color: var(--acu-error-bg); color: var(--acu-text-main); border-color: var(--acu-error-text); }
            .acu-result-badge-crit-failure { background-color: var(--acu-error-bg); color: var(--acu-text-main); border-color: var(--acu-error-text); }


            /* === 骰子结果显示区域 === */
            .acu-dice-result-display {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                gap: 8px;
            }
            .acu-dice-result-value {
                font-size: 22px;
                font-weight: bold;
                color: var(--acu-text-main);
            }
            .acu-dice-result-target {
                font-size: 11px;
                color: var(--acu-text-sub);
                opacity: 0.9;
            }
            .acu-dice-retry-btn {
                background: transparent !important;
                border: none !important;
                color: var(--acu-text-main);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .acu-dice-retry-btn:hover {
                opacity: 1;
                color: var(--acu-accent);
            }

            /* === 资源消耗器按钮 (燃运等) === */
            .acu-dice-burners {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                margin-left: 4px;
            }
            .acu-dice-burner-btn {
                background: transparent !important;
                border: none !important;
                color: var(--acu-text-main);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .acu-dice-burner-btn:hover {
                opacity: 1;
                color: var(--acu-accent);
            }
            .acu-dice-burner-btn i {
                font-size: 14px;
            }

            /* === 对战结果显示区域 === */
            .acu-contest-result-display {
                display: none;
                margin-bottom: 10px;
            }
            .acu-contest-result-container {
                display: flex;
                flex-direction: column;
                gap: 8px;
                cursor: pointer;
            }
            .acu-contest-result-row {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                padding: 12px 16px;
                background: var(--acu-light-bg);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                transition: all 0.2s;
            }
            .acu-contest-result-row:hover {
                background: var(--acu-btn-hover);
                border-color: var(--acu-accent);
            }
            .acu-contest-result-winner-row {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 10px 16px;
                background: var(--acu-light-bg);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                transition: all 0.2s;
            }
            .acu-contest-result-winner-row:hover {
                background: var(--acu-btn-hover);
                border-color: var(--acu-accent);
            }
            .acu-contest-reroll-icon {
                font-size: 14px;
                color: var(--acu-text-sub);
                transition: all 0.2s;
            }
            .acu-contest-result-winner-row:hover .acu-contest-reroll-icon {
                color: var(--acu-accent);
                transform: rotate(90deg);
            }
            .acu-contest-result-inner {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                flex: 1;
            }
            .acu-contest-result-side {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .acu-contest-result-side.right {
                flex-direction: row-reverse;
            }
            .acu-contest-vs {
                font-size: 12px;
                font-weight: bold;
                color: var(--acu-text-sub);
                padding: 0 4px;
            }
            .acu-contest-result-name {
                font-size: 10px;
                color: var(--acu-text-main);
                opacity: 0.9;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 4em;
                text-align: center;
            }
            .acu-contest-result-value {
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-text-main);
            }
            .acu-contest-winner-text {
                font-size: 14px;
                font-weight: bold;
            }
            .acu-contest-winner-success { color: var(--acu-success-text); }
            .acu-contest-winner-warning { color: var(--acu-warning-text); }
            .acu-contest-winner-failure { color: var(--acu-failure-text); }

            /* === 关系图滑块容器 === */
            .acu-node-size-slider-container {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
            }
            .acu-node-size-slider-container .acu-slider-label {
                font-size: 11px;
                color: var(--acu-text-sub);
                white-space: nowrap;
            }
            .acu-node-size-slider-container .acu-slider-value {
                font-size: 11px;
                color: var(--acu-accent);
                font-weight: bold;
                min-width: 35px;
                text-align: right;
            }
            .acu-node-size-slider-container input[type="range"] {
                background: var(--acu-btn-bg);
            }

            /* === 关系图过滤按钮 === */
            .acu-graph-filter-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .acu-graph-filter-btn {
                transition: all 0.15s;
            }
            .acu-graph-filter-btn.active {
                background: var(--acu-accent) !important;
                color: var(--acu-button-text-on-accent, #fff) !important;
                border-color: var(--acu-accent) !important;
            }

            /* === 关系图箭头标记 - 使用 CSS 变量 === */
            .acu-graph-svg #arrowhead-end polygon,
            .acu-graph-svg #arrowhead-start polygon {
                fill: var(--acu-text-sub);
            }
            .acu-graph-svg #arrowhead-end-hl polygon,
            .acu-graph-svg #arrowhead-start-hl polygon {
                fill: var(--acu-accent);
            }

            /* === 导入提示样式 === */
            .acu-import-empty {
                text-align: center;
                padding: 20px;
                color: var(--acu-text-sub);
            }
            .acu-import-warning {
                font-size: 12px;
                font-weight: bold;
                color: var(--acu-text-main);
                margin-bottom: 4px;
            }
            .acu-import-warning i {
                color: var(--acu-warning-icon, #f39c12);
            }
            .acu-import-success {
                text-align: center;
                padding: 10px;
                color: var(--acu-success-text);
            }

`;
