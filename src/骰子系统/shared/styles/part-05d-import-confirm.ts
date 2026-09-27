/**
 * part-05d-import-confirm.ts — part-05 子分片（从 part-05-validation 拆分，按序拼接内容不变）。
 */
export const STYLES_PART_05D_IMPORT_CONFIRM = `    /* ========== 导入确认弹窗样式 ========== */
    .acu-import-confirm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        z-index: 31300;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        box-sizing: border-box;
    }

    .acu-import-confirm-dialog {
        width: 90%;
        max-width: 420px;
        max-height: calc(100vh - 32px);
        background: var(--acu-bg-panel);
        border: 1px solid var(--acu-border);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        overflow: hidden;
        animation: acu-modal-pop 0.2s ease-out;
        display: flex;
        flex-direction: column;
    }

    .acu-import-confirm-title {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .acu-import-close-btn {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        color: var(--acu-text-sub);
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }

    .acu-import-close-btn:hover {
        background: var(--acu-btn-hover);
        color: var(--acu-text-main);
    }

    .acu-import-warning {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        background: var(--acu-hl-manual-bg, rgba(230, 126, 34, 0.15));
        border-radius: 6px;
        color: var(--acu-hl-manual, #e67e22);
        font-size: 13px;
        margin-bottom: 12px;
    }

    .acu-import-conflict-list {
        max-height: 120px;
        overflow-y: auto;
        padding: 10px 12px;
        background: var(--acu-table-hover);
        border-radius: 6px;
        font-size: 12px;
        color: var(--acu-text-main);
        line-height: 1.6;
        margin-bottom: 12px;
    }

    .acu-import-conflict-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .acu-import-radio {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .acu-import-radio:hover {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
    }

    .acu-import-radio input[type="radio"] {
        accent-color: var(--acu-accent);
    }

    .acu-import-success {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 14px;
        background: var(--acu-success-bg, rgba(39, 174, 96, 0.15));
        border-radius: 6px;
        color: var(--acu-success-text, #27ae60);
        font-size: 13px;
    }

    .acu-gacha-catalog-import-icon {
        background: var(--acu-btn-hover) !important;
        color: var(--acu-accent) !important;
    }

    .acu-import-confirm-footer {
        display: flex;
        gap: 10px;
        padding: 14px 18px;
        border-top: 1px solid var(--acu-border);
        background: var(--acu-table-head);
    }

    .acu-import-confirm-footer.acu-gacha-catalog-clear-footer {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }

    .acu-gacha-catalog-clear-all {
        background: var(--acu-btn-hover) !important;
        border-color: var(--acu-accent) !important;
        color: var(--acu-text-main) !important;
    }

    .acu-import-cancel-btn,
    .acu-import-confirm-btn {
        flex: 1;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .acu-import-cancel-btn {
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-text-sub);
        color: var(--acu-text-main);
    }

    .acu-import-cancel-btn:hover {
        background: var(--acu-btn-hover);
    }

    .acu-import-confirm-btn {
        background: var(--acu-accent);
        border: 1px solid var(--acu-accent);
        color: var(--acu-btn-active-text);
    }

    .acu-import-confirm-btn:hover {
        filter: brightness(1.1);
    }

    /* ========================================
     * Debug Console - 移动端优化 & 美化
     * ======================================== */
    
    /* 主弹窗容器 - 移动端全屏，PC端居中 */
    .acu-debug-console-dialog {
        width: 100% !important;
        max-width: 100vw !important;
        height: 100% !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
        margin: 0 !important;
        background: var(--acu-bg-panel) !important;
        animation: debugSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    
    @media (min-width: 768px) {
        .acu-debug-console-dialog {
            width: 90vw !important;
            max-width: 900px !important;
            height: 85vh !important;
            max-height: 700px !important;
            border-radius: 16px !important;
            animation: debugFadeScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
    }
    
    @keyframes debugSlideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes debugFadeScale {
        from {
            transform: scale(0.95);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    /* Header 样式美化 */
    .acu-debug-console-dialog .acu-settings-header {
        background: linear-gradient(135deg, var(--acu-table-head) 0%, var(--acu-bg-panel) 100%) !important;
        border-bottom: 1px solid var(--acu-border) !important;
        padding: 16px 20px !important;
        position: relative !important;
    }
    
    .acu-debug-console-dialog .acu-settings-title {
        font-size: 16px !important;
        font-weight: 700 !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        color: var(--acu-text-main) !important;
    }
    
    .acu-debug-console-dialog .acu-settings-title i {
        font-size: 18px !important;
        color: var(--acu-accent) !important;
        animation: debugPulse 2s ease-in-out infinite !important;
    }
    
    @keyframes debugPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
    
    /* 工具栏 - 移动端垂直布局 */
    .acu-debug-console-dialog .acu-debug-toolbar {
        padding: 12px 16px !important;
        border-bottom: 1px solid var(--acu-border) !important;
        background: var(--acu-card-bg) !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
    }
    
    @media (min-width: 768px) {
        .acu-debug-console-dialog .acu-debug-toolbar {
            flex-direction: row !important;
            align-items: center !important;
            padding: 14px 20px !important;
        }
    }
    
    /* Console 抓取开关 */
    .acu-debug-console-dialog .acu-debug-capture-row {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        padding: 10px 14px !important;
        background: var(--acu-table-hover) !important;
        border-radius: 10px !important;
        border: 1px solid var(--acu-border) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-capture-label {
        font-size: 13px !important;
        color: var(--acu-text-sub) !important;
        flex: 1 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-capture-status {
        font-size: 12px !important;
        padding: 4px 10px !important;
        border-radius: 20px !important;
        font-weight: 600 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-capture-status.enabled {
        background: var(--acu-success-bg) !important;
        color: var(--acu-success-text) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-capture-status.disabled {
        background: var(--acu-badge-bg) !important;
        color: var(--acu-text-sub) !important;
    }
    
    /* 过滤器按钮组 - 移动端横向滚动 */
    .acu-debug-console-dialog .acu-debug-filter-group {
        display: flex !important;
        gap: 8px !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        padding: 4px 0 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-group::-webkit-scrollbar {
        display: none !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn {
        flex-shrink: 0 !important;
        padding: 8px 14px !important;
        border-radius: 20px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        border: 1px solid var(--acu-border) !important;
        background: var(--acu-btn-bg) !important;
        color: var(--acu-text-sub) !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn:active {
        transform: scale(0.95) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn.active {
        background: var(--acu-accent) !important;
        color: var(--acu-button-text-on-accent, #fff) !important;
        border-color: var(--acu-accent) !important;
        box-shadow: 0 2px 8px rgba(var(--acu-accent-rgb, 59, 130, 246), 0.3) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn .count {
        font-size: 10px !important;
        padding: 2px 6px !important;
        border-radius: 10px !important;
        background: rgba(255, 255, 255, 0.2) !important;
        min-width: 18px !important;
        text-align: center !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn.active .count {
        background: rgba(0, 0, 0, 0.15) !important;
    }
    
    /* 日志类型指示器颜色 */
    .acu-debug-console-dialog .acu-debug-filter-btn[data-filter-type="log"] .indicator { color: var(--acu-text-sub) !important; }
    .acu-debug-console-dialog .acu-debug-filter-btn[data-filter-type="info"] .indicator { color: var(--acu-hl-diff) !important; }
    .acu-debug-console-dialog .acu-debug-filter-btn[data-filter-type="warn"] .indicator { color: var(--acu-warning-text) !important; }
    .acu-debug-console-dialog .acu-debug-filter-btn[data-filter-type="error"] .indicator { color: var(--acu-error-text) !important; }
    
    /* 操作按钮组 */
    .acu-debug-console-dialog .acu-debug-actions {
        display: flex !important;
        gap: 8px !important;
        margin-top: 8px !important;
    }
    
    @media (min-width: 768px) {
        .acu-debug-console-dialog .acu-debug-actions {
            margin-top: 0 !important;
            margin-left: auto !important;
        }
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn {
        flex: 1 !important;
        padding: 10px 12px !important;
        border-radius: 10px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        border: 1px solid var(--acu-border) !important;
        background: var(--acu-btn-bg) !important;
        color: var(--acu-text-main) !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
    }
    
    @media (min-width: 768px) {
        .acu-debug-console-dialog .acu-debug-action-btn {
            flex: none !important;
            padding: 8px 14px !important;
        }
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn:hover {
        background: var(--acu-btn-hover) !important;
        border-color: var(--acu-accent) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn:active {
        transform: scale(0.95) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn.primary {
        background: var(--acu-accent) !important;
        color: var(--acu-button-text-on-accent, #fff) !important;
        border-color: var(--acu-accent) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn.danger {
        color: var(--acu-error-text) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn.danger:hover {
        background: var(--acu-error-bg) !important;
        border-color: var(--acu-error-text) !important;
    }
    
    /* 日志滚动区域 */
    .acu-debug-console-dialog .acu-debug-log-scroll {
        flex: 1 !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        background: var(--acu-card-bg) !important;
        -webkit-overflow-scrolling: touch !important;
    }
    
    /* 日志容器 */
    .acu-debug-console-dialog .acu-debug-log-container {
        padding: 0 !important;
    }
    
    /* 单条日志项 - 移动端优化 */
    .acu-debug-console-dialog .acu-debug-log-item {
        padding: 12px 16px !important;
        border-bottom: 1px solid var(--acu-border) !important;
        font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace !important;
        font-size: 12px !important;
        line-height: 1.6 !important;
        transition: background 0.15s ease !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-item:hover {
        background: var(--acu-table-hover) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-item:active {
        background: var(--acu-btn-hover) !important;
    }
    
    /* 日志头部 - 移动端垂直布局 */
    .acu-debug-console-dialog .acu-debug-log-header {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 8px !important;
        margin-bottom: 6px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-time {
        font-size: 10px !important;
        color: var(--acu-text-sub) !important;
        opacity: 0.8 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type {
        font-size: 10px !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        padding: 2px 8px !important;
        border-radius: 4px !important;
        letter-spacing: 0.5px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type.log {
        background: var(--acu-badge-bg) !important;
        color: var(--acu-text-sub) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type.info {
        background: var(--acu-hl-diff-bg) !important;
        color: var(--acu-hl-diff) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type.warn {
        background: var(--acu-warning-bg) !important;
        color: var(--acu-warning-text) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type.error {
        background: var(--acu-error-bg) !important;
        color: var(--acu-error-text) !important;
    }
    
    /* 日志内容 */
    .acu-debug-console-dialog .acu-debug-log-content {
        color: var(--acu-text-main) !important;
        word-break: break-word !important;
        white-space: pre-wrap !important;
        font-size: 12px !important;
        line-height: 1.5 !important;
    }
    
    /* 堆栈信息 */
    .acu-debug-console-dialog .acu-debug-log-stack {
        margin-top: 8px !important;
        padding: 10px 12px !important;
        background: rgba(0, 0, 0, 0.05) !important;
        border-radius: 8px !important;
        font-size: 11px !important;
        color: var(--acu-text-sub) !important;
        white-space: pre-wrap !important;
        word-break: break-all !important;
        border: 1px solid var(--acu-state-error-border) !important;
    }
    
    /* 空状态 */
    .acu-debug-console-dialog .acu-debug-empty {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 60px 20px !important;
        color: var(--acu-text-sub) !important;
        text-align: center !important;
    }
    
    .acu-debug-console-dialog .acu-debug-empty i {
        font-size: 48px !important;
        margin-bottom: 16px !important;
        opacity: 0.5 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-empty-text {
        font-size: 14px !important;
        margin-bottom: 8px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-empty-hint {
        font-size: 12px !important;
        opacity: 0.7 !important;
    }
    
    /* 底部状态栏 */
    .acu-debug-console-dialog .acu-debug-footer {
        padding: 12px 16px !important;
        border-top: 1px solid var(--acu-border) !important;
        background: var(--acu-table-head) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        font-size: 12px !important;
        color: var(--acu-text-sub) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-stats {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-stat {
        display: flex !important;
        align-items: center !important;
        gap: 4px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-stat-value {
        font-weight: 700 !important;
        color: var(--acu-accent) !important;
    }
    
    /* 关闭按钮优化 */
    .acu-debug-console-dialog .acu-close-btn {
        width: 36px !important;
        height: 36px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: var(--acu-btn-bg) !important;
        border: 1px solid var(--acu-border) !important;
        color: var(--acu-text-sub) !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
    }
    
    .acu-debug-console-dialog .acu-close-btn:hover {
        background: var(--acu-error-bg) !important;
        color: var(--acu-error-text) !important;
        border-color: var(--acu-error-text) !important;
        transform: rotate(90deg) !important;
    }
    
    /* Toggle 开关美化 */
    .acu-debug-console-dialog .acu-toggle {
        position: relative !important;
        display: inline-block !important;
        width: 44px !important;
        height: 24px !important;
        flex-shrink: 0 !important;
    }
    
    .acu-debug-console-dialog .acu-toggle input {
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
    }
    
    .acu-debug-console-dialog .acu-toggle-slider {
        position: absolute !important;
        cursor: pointer !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: var(--acu-btn-bg) !important;
        border: 1px solid var(--acu-border) !important;
        border-radius: 24px !important;
        transition: all 0.3s ease !important;
    }
    
    .acu-debug-console-dialog .acu-toggle-slider::before {
        position: absolute !important;
        content: "" !important;
        height: 18px !important;
        width: 18px !important;
        left: 2px !important;
        bottom: 2px !important;
        background: var(--acu-text-sub) !important;
        border-radius: 50% !important;
        transition:
            transform var(--acu-motion-normal) var(--acu-ease-out),
            background-color var(--acu-motion-normal) var(--acu-ease-standard) !important;
    }
    
    .acu-debug-console-dialog .acu-toggle input:checked + .acu-toggle-slider {
        background: var(--acu-accent) !important;
        border-color: var(--acu-accent) !important;
    }
    
    .acu-debug-console-dialog .acu-toggle input:checked + .acu-toggle-slider::before {
        transform: translateX(20px) !important;
        background: var(--acu-button-text-on-accent, #fff) !important;
    }
`;
