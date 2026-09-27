/**
 * part-05c-favorites.ts — part-05 子分片（从 part-05-validation 拆分，按序拼接内容不变）。
 */
export const STYLES_PART_05C_FAVORITES = `            /* ========== 收藏夹面板样式 ========== */
            .acu-favorites-overlay,
            .acu-fav-edit-overlay,
            .acu-fav-new-overlay,
            .acu-fav-send-overlay,
            .acu-fav-tag-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 31300;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(2px);
            }
            .acu-favorites-panel {
                width: 90%;
                max-width: 800px;
                max-height: 85vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .acu-favorites-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-favorites-header h3 {
                margin: 0;
                font-size: 16px;
                color: var(--acu-accent);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .acu-favorites-header-actions {
                display: flex;
                gap: 8px;
            }
            .acu-fav-header-btn {
                padding: 6px 12px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 4px;
                transition: all 0.2s ease;
            }
            .acu-fav-header-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-fav-header-btn.acu-fav-close {
                background: transparent;
                border: none;
                font-size: 16px;
            }
            .acu-favorites-filter {
                display: flex;
                gap: 10px;
                padding: 12px 18px;
                border-bottom: 1px solid var(--acu-border);
                background: var(--acu-bg-main);
            }
            .acu-favorites-filter select,
            .acu-favorites-filter input {
                flex: 1;
                padding: 8px 12px;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                font-size: 13px;
            }
            .acu-favorites-filter select {
                max-width: 200px;
            }
            .acu-favorites-content {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
            }
            .acu-favorites-empty {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px 20px;
                color: var(--acu-text-sub);
                text-align: center;
            }
            .acu-favorites-group {
                margin-bottom: 20px;
            }
            .acu-favorites-group-title {
                font-size: 14px;
                font-weight: 600;
                color: var(--acu-text-main);
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .acu-favorites-group-cards {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 12px;
            }
            .acu-favorites-card {
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                padding: 12px;
                transition: all 0.2s ease;
            }
            .acu-favorites-card:hover {
                border-color: var(--acu-accent);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .acu-favorites-card-header {
                margin-bottom: 8px;
            }
            .acu-favorites-card-preview {
                font-size: 12px;
                color: var(--acu-text-main);
                line-height: 1.5;
            }
            .acu-fav-preview-item {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-fav-preview-item b {
                color: var(--acu-accent);
            }
            .acu-favorites-card-source {
                font-size: 11px;
                color: var(--acu-text-sub);
                margin-top: 4px;
            }
            .acu-favorites-card-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-bottom: 8px;
            }
            .acu-favorites-tag {
                padding: 2px 8px;
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-radius: 10px;
                font-size: 10px;
                font-weight: 500;
            }
            .acu-favorites-card-actions {
                display: flex;
                gap: 6px;
                justify-content: flex-end;
            }
            .acu-fav-btn {
                width: 28px;
                height: 28px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                transition: all 0.2s ease;
            }
            .acu-fav-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-fav-delete:hover {
                color: #e74c3c;
            }
            .acu-fav-send:hover {
                color: #27ae60;
            }

            /* ========== 收藏夹标签过滤可折叠区域 ========== */
            .acu-fav-tag-filter-collapsible {
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-fav-tag-filter-header {
                position: sticky;
                top: 0;
                z-index: 1;
                padding: 6px 12px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                user-select: none;
            }
            .acu-fav-tag-filter-header span {
                font-size: calc(var(--acu-font-size, 13px) * 0.85);
                color: var(--acu-text-sub);
                font-weight: 500;
            }
            .acu-fav-tag-toggle-icon {
                font-size: 10px;
                color: var(--acu-text-sub);
                transition: transform 0.2s;
            }
            .acu-fav-tag-filter-body {
                padding: 8px 12px;
                background: var(--acu-table-head);
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                align-items: center;
            }
            .acu-fav-tag-filter-body.horizontal {
                display: grid;
                grid-auto-flow: column;
                grid-template-rows: repeat(auto-fill, minmax(28px, 1fr));
                gap: 6px;
                overflow-x: auto;
            }
            .acu-fav-tag-filter-collapsible.collapsed .acu-fav-tag-filter-body {
                display: none;
            }
            .acu-fav-tag-filter-collapsible.collapsed .acu-fav-tag-toggle-icon {
                transform: rotate(-90deg);
            }
            .acu-fav-tag-btn {
                padding: 0 10px;
                height: 28px;
                background: transparent;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-sub);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: calc(var(--acu-font-size, 13px) * 0.85);
                transition: all 0.2s ease;
                opacity: 0.5;
                white-space: nowrap;
            }
            .acu-fav-tag-btn:hover {
                opacity: 0.8;
                border-color: var(--acu-accent);
                color: var(--acu-accent);
            }
            .acu-fav-tag-btn.active {
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent);
                opacity: 1;
            }

            /* 编辑弹窗 */
            .acu-fav-edit-modal,
            .acu-fav-new-modal,
            .acu-fav-send-modal,
            .acu-fav-tag-modal {
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .acu-fav-edit-modal-header,
            .acu-fav-new-modal-header,
            .acu-fav-send-modal-header,
            .acu-fav-tag-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-fav-edit-modal-header h4,
            .acu-fav-new-modal-header h4,
            .acu-fav-send-modal-header h4,
            .acu-fav-tag-modal-header h4 {
                margin: 0;
                font-size: 15px;
                color: var(--acu-accent);
            }
            .acu-fav-edit-close,
            .acu-fav-new-close,
            .acu-fav-send-close,
            .acu-fav-tag-close {
                background: transparent !important;
                border: none !important;
                color: var(--acu-text-main) !important;
                cursor: pointer;
                font-size: 16px;
            }
            .acu-fav-edit-close:hover,
            .acu-fav-new-close:hover,
            .acu-fav-send-close:hover,
            .acu-fav-tag-close:hover {
                background: transparent !important;
                color: var(--acu-accent) !important;
            }
            .acu-fav-edit-modal-body,
            .acu-fav-new-modal-body,
            .acu-fav-send-modal-body,
            .acu-fav-tag-modal-body {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
            }
            .acu-fav-edit-tags-section,
            .acu-fav-tag-input-section {
                margin-bottom: 16px;
            }
            .acu-fav-edit-tags-section label,
            .acu-fav-tag-input-section label {
                display: block;
                font-size: 12px;
                color: var(--acu-text-sub);
                margin-bottom: 6px;
            }
            .acu-fav-edit-tags-section input,
            .acu-fav-tag-input-section input {
                width: 100%;
                padding: 8px 12px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                font-size: 13px;
            }
            .acu-fav-edit-rows {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 12px;
            }
            .acu-fav-edit-row {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .acu-fav-edit-header {
                flex: 0 0 120px;
                padding: 8px 10px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-accent);
                font-size: 12px;
                font-weight: 600;
            }
            .acu-fav-edit-value {
                flex: 1;
                padding: 8px 10px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                font-size: 12px;
            }
            .acu-fav-edit-remove {
                width: 28px;
                height: 28px;
                background: transparent !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px;
                color: var(--acu-text-sub) !important;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-fav-edit-remove:hover {
                color: #e74c3c !important;
                border-color: #e74c3c !important;
                background: transparent !important;
            }
            .acu-fav-edit-add-col {
                padding: 8px 12px;
                background: var(--acu-btn-bg);
                border: 1px dashed var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: all 0.2s ease;
            }
            .acu-fav-edit-add-col:hover {
                border-color: var(--acu-accent);
                color: var(--acu-accent);
            }
            .acu-fav-edit-modal-footer,
            .acu-fav-new-modal-footer,
            .acu-fav-send-modal-footer,
            .acu-fav-tag-modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 14px 18px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-bg-main);
            }
            .acu-fav-edit-cancel,
            .acu-fav-new-cancel,
            .acu-fav-send-cancel,
            .acu-fav-tag-cancel {
                padding: 8px 16px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-text-sub);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
            }
            .acu-fav-edit-save,
            .acu-fav-new-create,
            .acu-fav-tag-confirm {
                padding: 8px 16px;
                background: var(--acu-accent);
                border: 1px solid var(--acu-accent);
                border-radius: 6px;
                color: var(--acu-btn-active-text);
                cursor: pointer;
            }
            .acu-fav-edit-save:hover,
            .acu-fav-new-create:hover,
            .acu-fav-tag-confirm:hover {
                opacity: 0.9;
            }

            /* 发送选择弹窗 */
            .acu-fav-send-option {
                padding: 12px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .acu-fav-send-option:hover {
                border-color: var(--acu-accent);
                background: var(--acu-btn-hover);
            }
            .acu-fav-send-option-name {
                font-size: 14px;
                font-weight: 600;
                color: var(--acu-text-main);
                margin-bottom: 4px;
            }
            .acu-fav-send-option-mode {
                font-size: 12px;
            }
            .acu-fav-send-unmatched {
                font-size: 11px;
                color: var(--acu-text-sub);
                margin-top: 4px;
            }

            /* 新建模板选择 */
            .acu-fav-new-modal-body label {
                display: block;
                font-size: 13px;
                color: var(--acu-text-main);
                margin-bottom: 10px;
            }
            .acu-fav-new-modal-body select {
                width: 100%;
                padding: 10px 12px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                font-size: 14px;
            }

            @media (max-width: 768px) {
                .acu-favorites-panel {
                    width: 95%;
                    max-height: 90vh;
                }
                .acu-favorites-group-cards {
                    grid-template-columns: 1fr;
                }
                .acu-favorites-header-actions {
                    flex-wrap: wrap;
                }
                .acu-fav-header-btn span {
                    display: none;
                }
            }

            /* ========== 收藏夹面板样式 (新增) ========== */
            /* [修复] 收藏夹外层容器必须限制高度和溢出，防止卡片超出面板范围 */
            .acu-fav-wrapper {
                display: flex;
                flex-direction: column;
                height: 100%;
                max-height: 100%;
                overflow: hidden;
            }
            .acu-fav-panel-content {
                padding: 12px;
                overflow-y: auto;
                overflow-x: auto;
                flex: 1;
                min-height: 0; /* 关键：允许 flex 子元素收缩 */
                /* 滚动条样式 - Firefox */
                scrollbar-width: thin;
                scrollbar-color: var(--acu-btn-bg) var(--acu-bg-nav);
                overscroll-behavior: contain;
            }
            /* 收藏夹面板滚动条 - Webkit (Chrome/Safari/Edge) */
            .acu-fav-panel-content::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            .acu-fav-panel-content::-webkit-scrollbar-track {
                background: var(--acu-bg-nav);
                border-radius: 4px;
            }
            .acu-fav-panel-content::-webkit-scrollbar-thumb {
                background: var(--acu-btn-bg);
                border-radius: 4px;
                border: 2px solid var(--acu-bg-nav);
            }
            .acu-fav-panel-content::-webkit-scrollbar-thumb:hover {
                background: var(--acu-btn-hover);
            }
            .acu-fav-panel-content::-webkit-scrollbar-corner {
                background: var(--acu-bg-nav);
            }
            /* [已废弃] 工具栏已移至Header，保留样式以防回退 */
            /*
            .acu-fav-toolbar {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
                flex-wrap: wrap;
            }
            */
            .acu-fav-select,
            .acu-fav-input {
                padding: 6px 10px !important;
                background: var(--acu-bg-panel) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
                color: var(--acu-text-main) !important;
                font-size: 12px !important;
                height: auto !important;
                box-shadow: none !important;
            }
            .acu-fav-select {
                min-width: 120px;
            }
            .acu-fav-input {
                flex: 1;
                min-width: 150px;
            }
            .acu-fav-toolbar-btn {
                padding: 6px 10px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                font-size: 12px;
            }
            .acu-fav-toolbar-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-fav-grid {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .acu-fav-group-title {
                font-size: 13px;
                font-weight: 600;
                color: var(--acu-accent);
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .acu-fav-group-cards {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            /* 收藏夹卡片 - 复用 acu-data-card 宽度，保持与普通表格一致 */
            .acu-fav-card {
                flex: 0 0 var(--acu-card-width, 260px);
                width: var(--acu-card-width, 260px);
                cursor: pointer;
            }
            /* [修复] 收藏夹卡片来源标签 - 放在底部与tags一起 */
            .acu-fav-card-source {
                font-size: 11px;
                color: var(--acu-text-sub);
                font-weight: normal;
                background: var(--acu-badge-bg);
                padding: 2px 8px;
                border-radius: 4px;
            }
            .acu-fav-card-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                padding: 6px 12px 8px;
                border-top: 1px dashed var(--acu-border);
            }
            .acu-fav-tag {
                padding: 2px 6px;
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-radius: 8px;
                font-size: 10px;
            }
            /* [已废弃] 操作按钮已改为单击菜单，保留样式以防回退 */
            /*
            .acu-fav-card-actions {
                display: flex;
                justify-content: flex-end;
                gap: 4px;
                padding: 8px 12px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-bg-main);
            }
            .acu-fav-action-btn {
                width: 28px;
                height: 28px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
            }
            .acu-fav-action-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-fav-delete:hover {
                color: #e74c3c;
            }
            */
            .acu-fav-empty {
                text-align: center;
                padding: 40px 20px;
                color: var(--acu-text-sub);
            }
            .acu-fav-empty i {
                font-size: 36px;
                opacity: 0.3;
                margin-bottom: 12px;
            }
            .acu-fav-empty p {
                margin: 4px 0;
            }

            /* 编辑弹窗 - 保留弹窗形式，添加移动端适配 */
            .acu-fav-edit-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 31300;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-fav-edit-modal {
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            @media (max-width: 768px) {
                .acu-fav-edit-modal {
                    position: fixed !important;
                    top: 5% !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: 92vw !important;
                    max-height: 88vh !important;
                }
                .acu-fav-send-modal {
                    width: 92vw !important;
                    max-width: 500px !important;
                }
                .acu-fav-tag-modal {
                    width: 92vw !important;
                    max-width: 500px !important;
                }
                .acu-fav-edit-overlay {
                    align-items: flex-start !important;
                    padding-top: 5vh !important;
                }
                .acu-fav-group-cards {
                    grid-template-columns: 1fr !important;
                }
            }
            /* 编辑弹窗输入框样式覆盖 */
            .acu-fav-edit-modal input,
            .acu-fav-tag-modal input {
                padding: 8px 10px !important;
                background: var(--acu-bg-panel) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
                color: var(--acu-text-main) !important;
                font-size: 12px !important;
                height: auto !important;
                box-shadow: none !important;
            }

    /* Cleaned up Inline Styles */
    #dice-custom-input { width: 60px; }
    
    .acu-mvu-dice-icon {
        cursor: pointer;
        color: var(--acu-accent);
        opacity: 0.6;
        font-size: calc(var(--acu-font-size, 13px) * 0.85);
        flex-shrink: 0;
    }
    
    .acu-mvu-level-toggle {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: calc(var(--acu-font-size, 13px) * 0.85);
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid var(--acu-border);
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            opacity var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
        background: transparent;
        color: var(--acu-text-sub);
        opacity: 0.5;
    }
    .acu-mvu-level-toggle:hover,
    .acu-mvu-level-toggle:focus-visible {
        border-color: var(--acu-border);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-mvu-level-toggle.active {
        background: var(--acu-accent);
        color: var(--acu-btn-active-text);
        border-color: var(--acu-accent);
        opacity: 1;
    }
    
    .acu-mvu-header {
        padding: 6px 8px;
        background: var(--acu-table-head);
        border-bottom: 1px solid var(--acu-border);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
    }
    
    .acu-mvu-body {
        padding: 8px;
        background: var(--acu-table-head);
        border-bottom: 1px solid var(--acu-border);
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
    }
    
    .acu-mvu-item {
        display: flex;
        align-items: center;
        padding: 6px 8px;
        margin-bottom: 4px;
        background: var(--acu-table-hover);
        border-radius: 4px;
        border: 1px solid var(--acu-state-accent-border);
    }
    
    .acu-mvu-path {
        font-size: calc(var(--acu-font-size, 13px) * 0.77);
        color: var(--acu-text-sub);
        margin-bottom: 2px;
    }
    
    .acu-mvu-val {
        font-size: var(--acu-font-size, 13px);
        color: var(--acu-accent);
        font-weight: bold;
        cursor: pointer;
    }
    
    .acu-mvu-list {
        padding: 0 8px;
    }

    .acu-mvu-toggle-icon {
        font-size: 10px;
        color: var(--acu-text-sub);
        transition: transform 0.2s;
    }
    .acu-mvu-header-text {
        font-size: calc(var(--acu-font-size, 13px) * 0.85);
        color: var(--acu-text-sub);
    }
    .acu-mvu-item-content {
        flex: 1;
        min-width: 0;
    }
    .acu-mvu-item-row {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .acu-mvu-attr-name {
        font-size: calc(var(--acu-font-size, 13px) * 0.92);
        color: var(--acu-text-main);
        font-weight: bold;
    }
    .acu-order-first {
        order: -1;
    }
    .acu-text-sub-small {
        font-size: calc(var(--acu-font-size, 13px) * 0.85);
        color: var(--acu-text-sub);
    }
    .acu-ml-6 {
        margin-left: 6px;
    }

    /* Graph & Node Size Controls */
    .acu-graph-filter-btn {
        padding: 4px 6px;
        font-size: 12px;
    }
    .acu-graph-filter-btn.ml-8 {
        margin-left: 8px;
    }
    .acu-node-size-slider-container {
        position: absolute;
        display: none;
        width: 200px;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10;
        background: var(--acu-bg-panel);
        border: 1px solid var(--acu-border);
    }
    .acu-slider-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
    }
    .acu-range-input {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        background: var(--acu-input-bg);
        margin: 0;
    }
    .acu-range-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--acu-accent);
        cursor: pointer;
        margin-top: -4px; /* Adjust for track height if needed, usually 0 or negative for center */
    }
    .acu-range-input::-webkit-slider-runnable-track {
        width: 100%;
        height: 8px;
        cursor: pointer;
        background: var(--acu-input-bg);
        border-radius: 4px;
    }
    .acu-graph-reset-btn {
        width: auto;
        height: auto;
        padding: 4px 10px;
        font-size: 11px;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .acu-node-size-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
    }
    .acu-stepper-container {
        display: flex;
        align-items: center;
    }
    .acu-stepper-value-display {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .acu-zoom-info {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--acu-text-sub);
        font-size: 11px;
    }

    /* 锁定图标 - CSS-only */
    [data-locked="true"]::after {
        content: "\\f023";
        font-family: "Font Awesome 6 Free";
        font-weight: 900;
        font-size: 10px;
        color: var(--acu-accent);
        opacity: 0.7;
        margin-left: 4px;
        pointer-events: none;
        display: inline;
    }

    /* 标题锁图标略大 */
    .acu-editable-title[data-locked="true"]::after {
        font-size: 11px;
        opacity: 0.8;
    }

`;
