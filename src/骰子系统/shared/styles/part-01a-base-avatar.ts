/**
 * part-01a-base-avatar.ts — part-01 子分片（从 part-01-theme 拆分，按序拼接内容不变）。
 */
export const STYLES_PART_01A_BASE_AVATAR = `
    /* ========== 核心隔离层 ========== */
    .acu-wrapper.acu-dice-ui-root,
    .acu-wrapper.acu-dice-ui-root *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-edit-overlay,
    .acu-edit-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-cell-menu,
    .acu-cell-menu *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-dice-panel,
    .acu-dice-panel *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-contest-panel,
    .acu-contest-panel *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-relation-graph-overlay,
    .acu-relation-graph-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-avatar-manager-overlay,
    .acu-avatar-manager-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-preview-overlay,
    .acu-preview-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-gacha-overlay,
    .acu-gacha-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-inventory-overlay,
    .acu-inventory-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-inventory-detail-overlay,
    .acu-inventory-detail-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-import-confirm-overlay,
    .acu-import-confirm-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-config-backup-overlay,
    .acu-config-backup-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-embedded-options-container,
    .acu-embedded-options-container *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-dialogue-indent-root,
    .acu-dialogue-indent-root *:not(i[class*="fa-"]):not(i[class*="ti-"]) {
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
        -webkit-font-smoothing: antialiased;
    }
    /* ========== 基础样式 ========== */
    .acu-wrapper.acu-dice-ui-root,
    .acu-edit-overlay,
    .acu-dice-panel,
    .acu-contest-panel,
    .acu-relation-graph-overlay,
    .acu-avatar-manager-overlay,
    .acu-preview-overlay,
    .acu-gacha-overlay,
    .acu-inventory-overlay,
    .acu-inventory-detail-overlay,
    .acu-import-confirm-overlay,
    .acu-config-backup-overlay,
    .acu-embedded-options-container,
    .acu-dialogue-indent-root,
    .acu-cell-menu {
        font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
        font-size: 13px;
        line-height: 1.5;
        color: var(--acu-text-main);
        --acu-motion-fast: 160ms;
        --acu-motion-normal: 220ms;
        --acu-ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --acu-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
        --acu-focus-ring: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 34%, transparent);
        --acu-disabled-opacity: 0.48;
        --acu-state-warning-border: color-mix(in srgb, var(--acu-warning-icon) 58%, var(--acu-border));
        --acu-state-error-border: color-mix(in srgb, var(--acu-error-text) 58%, var(--acu-border));
        --acu-state-accent-border: color-mix(in srgb, var(--acu-accent) 58%, var(--acu-border));
    }

    .mes.acu-host-regenerate-hidden .swipeRightBlock,
    .mes.acu-host-regenerate-hidden .swipe_right {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }

    /* ========== 正文头像渲染 ========== */
    .acu-dialogue-indent-root {
        width: 100%;
        max-width: 100%;
        color: var(--acu-text-main);
        line-height: 1.68;
        overflow-wrap: anywhere;
        word-break: normal;
    }

    .acu-dialogue-indent-root > :first-child {
        margin-top: 0;
    }

    .acu-dialogue-indent-root > :last-child {
        margin-bottom: 0;
    }

    .acu-dialogue-aside {
        --acu-dialogue-character-color: var(--acu-accent);
        display: grid;
        grid-template-columns: 52px minmax(0, 1fr);
        column-gap: 12px;
        align-items: start;
        max-width: 100%;
        margin: 0.82em 0;
    }

    .acu-dialogue-aside.is-continuation {
        margin-top: -0.16em;
    }

    .acu-dialogue-avatar,
    .acu-dialogue-avatar-spacer {
        width: 48px;
        min-width: 48px;
    }

    .acu-dialogue-avatar {
        aspect-ratio: 1;
        border-radius: 6px;
        background-image: var(--acu-dialogue-avatar-image, none);
        background-size: var(--acu-dialogue-avatar-scale, 150%);
        background-position: var(--acu-dialogue-avatar-x, 50%) var(--acu-dialogue-avatar-y, 50%);
        background-repeat: no-repeat;
        background-color: var(--acu-table-head);
        border: 1px solid color-mix(in srgb, var(--acu-dialogue-character-color) 34%, var(--acu-border));
        box-shadow:
            0 1px 0 color-mix(in srgb, var(--acu-card-bg) 78%, transparent),
            inset 0 0 0 1px color-mix(in srgb, var(--acu-dialogue-character-color) 18%, transparent);
        overflow: hidden;
        position: relative;
    }

    .acu-dialogue-body {
        min-width: 0;
        max-width: 100%;
    }

    .acu-dialogue-speaker {
        margin: 0 0 0.16em;
        color: var(--acu-text-main);
        font-size: 0.94em;
        font-weight: 650;
        line-height: 1.35;
        letter-spacing: 0;
    }

    .acu-dialogue-speaker-initial {
        display: inline-block;
        margin-right: 1px;
        color: var(--acu-dialogue-character-color);
        font-size: 1.28em;
        font-weight: 800;
        line-height: 0.9;
        letter-spacing: 0;
        vertical-align: -0.04em;
    }

    .acu-dialogue-quote {
        min-width: 0;
        padding-left: 12px;
        border-left: 1px solid color-mix(in srgb, var(--acu-dialogue-character-color) 46%, var(--acu-border));
        color: var(--acu-text-main);
        line-height: 1.72;
    }

    .acu-dialogue-aside.is-continuation .acu-dialogue-quote {
        border-left-color: color-mix(in srgb, var(--acu-dialogue-character-color) 24%, var(--acu-border));
    }

    @media (max-width: 600px) {
        .acu-dialogue-indent-root {
            line-height: 1.62;
        }

        .acu-dialogue-aside {
            grid-template-columns: 40px minmax(0, 1fr);
            column-gap: 9px;
            margin: 0.72em 0;
        }

        .acu-dialogue-avatar,
        .acu-dialogue-avatar-spacer {
            width: 38px;
            min-width: 38px;
        }

        .acu-dialogue-quote {
            padding-left: 10px;
            line-height: 1.66;
        }
    }

    /* 投骰面板统一样式 (需要 !important 覆盖 SillyTavern 全局样式和内联样式) */
    .acu-dice-panel,
    .acu-contest-panel,
    .acu-dice-config-dialog {
        background: var(--acu-bg-panel);
        color: var(--acu-text-main);
    }
    .acu-dice-panel input[type="text"],
    .acu-dice-panel input[type="number"],
    .acu-dice-panel input:not([type]),
    .acu-dice-panel select,
    .acu-contest-panel input[type="text"],
    .acu-contest-panel input[type="number"],
    .acu-contest-panel input:not([type]),
    .acu-contest-panel select,
    .acu-dice-config-dialog input[type="text"],
    .acu-dice-config-dialog input[type="number"],
    .acu-dice-config-dialog input:not([type]),
    .acu-dice-config-dialog select {
        width: 100%;
        text-align: center;
        padding: 6px;
        background: var(--acu-input-bg) !important;
        border: 1px solid var(--acu-border) !important;
        border-radius: 4px;
        color: var(--acu-input-text, var(--acu-text-main)) !important;
        font-size: 12px;
        height: 30px;
        line-height: 1;
        box-sizing: border-box;
    }
    /* select 需要额外处理以匹配 input 尺寸 */
    .acu-dice-panel select,
    .acu-contest-panel select,
    .acu-dice-config-dialog select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        padding: 0 6px;
        margin: 0;
        text-align-last: center;
        display: block;
    }
    /* 隐藏number类型输入框的步数器 */
    .acu-dice-panel input[type="number"]::-webkit-inner-spin-button,
    .acu-dice-panel input[type="number"]::-webkit-outer-spin-button,
    .acu-contest-panel input[type="number"]::-webkit-inner-spin-button,
    .acu-contest-panel input[type="number"]::-webkit-outer-spin-button,
    .acu-dice-config-dialog input[type="number"]::-webkit-inner-spin-button,
    .acu-dice-config-dialog input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    .acu-dice-panel input[type="number"],
    .acu-contest-panel input[type="number"],
    .acu-dice-config-dialog input[type="number"] {
        -moz-appearance: textfield;
        text-align: center;
        box-sizing: border-box;
    }
    .acu-dice-panel input::placeholder,
    .acu-contest-panel input::placeholder,
    .acu-dice-config-dialog input::placeholder {
        color: var(--acu-input-placeholder, var(--acu-text-sub)) !important;
        opacity: 0.7;
        text-align: center;
    }
    .acu-dice-panel input:focus,
    .acu-dice-panel select:focus,
    .acu-contest-panel input:focus,
    .acu-contest-panel select:focus,
    .acu-dice-config-dialog input:focus,
    .acu-dice-config-dialog select:focus {
        outline: none;
        border-color: var(--acu-accent) !important;
    }
    .acu-dice-panel select option,
    .acu-contest-panel select option,
    .acu-dice-config-dialog select option {
        background: var(--acu-bg-panel);
        color: var(--acu-text-main);
    }
    /* 搜索框样式 */
    .acu-wrapper.acu-dice-ui-root .acu-search-input {
        background-color: var(--acu-input-bg) !important;
        color: var(--acu-text-main) !important;
        border: 1px solid var(--acu-border);
    }
    .acu-wrapper.acu-dice-ui-root .acu-search-input:focus {
        outline: none;
        border-color: var(--acu-accent);
        box-shadow: none !important;
    }
    .acu-wrapper.acu-dice-ui-root .acu-search-input::placeholder {
        color: var(--acu-text-sub) !important;
        opacity: 0.7;
    }
    /* ========== 通用组件基类 ========== */
    /* 按钮基类 */
    .acu-wrapper.acu-dice-ui-root button,
    .acu-edit-overlay button,
    .acu-dice-panel button,
    .acu-contest-panel button,
    .acu-relation-graph-overlay button,
    .acu-avatar-manager-overlay button,
    .acu-preview-overlay button,
    .acu-embedded-options-container button:not(.acu-opt-btn):not(.acu-check-suggestion-btn) {
        font-family: inherit;
        font-size: inherit;
        line-height: 1.4;
        cursor: pointer;
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-main);
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard),
            transform var(--acu-motion-fast) var(--acu-ease-out);
        outline: none;
    }
    .acu-wrapper.acu-dice-ui-root button:hover,
    .acu-edit-overlay button:hover,
    .acu-dice-panel button:hover,
    .acu-contest-panel button:hover,
    .acu-relation-graph-overlay button:hover,
    .acu-avatar-manager-overlay button:hover,
    .acu-preview-overlay button:hover,
    .acu-embedded-options-container button:not(.acu-opt-btn):not(.acu-check-suggestion-btn):hover {
        background: var(--acu-btn-hover);
    }
    .acu-wrapper.acu-dice-ui-root button:focus,
    .acu-edit-overlay button:focus,
    .acu-dice-panel button:focus,
    .acu-contest-panel button:focus,
    .acu-relation-graph-overlay button:focus,
    .acu-avatar-manager-overlay button:focus,
    .acu-preview-overlay button:focus,
    .acu-embedded-options-container button:not(.acu-opt-btn):not(.acu-check-suggestion-btn):focus {
        outline: none;
        box-shadow: var(--acu-focus-ring);
    }
    .acu-wrapper.acu-dice-ui-root button:disabled,
    .acu-edit-overlay button:disabled,
    .acu-dice-panel button:disabled,
    .acu-contest-panel button:disabled,
    .acu-relation-graph-overlay button:disabled,
    .acu-avatar-manager-overlay button:disabled,
    .acu-preview-overlay button:disabled,
    .acu-embedded-options-container button:not(.acu-opt-btn):not(.acu-check-suggestion-btn):disabled,
    .acu-wrapper.acu-dice-ui-root button.disabled,
    .acu-edit-overlay button.disabled,
    .acu-dice-panel button.disabled,
    .acu-contest-panel button.disabled,
    .acu-relation-graph-overlay button.disabled,
    .acu-avatar-manager-overlay button.disabled,
    .acu-preview-overlay button.disabled,
    .acu-embedded-options-container button:not(.acu-opt-btn):not(.acu-check-suggestion-btn).disabled {
        opacity: var(--acu-disabled-opacity);
        cursor: not-allowed;
        pointer-events: none;
    }

    /* 输入框基类 */
    .acu-wrapper.acu-dice-ui-root input,
    .acu-wrapper.acu-dice-ui-root textarea,
    .acu-wrapper.acu-dice-ui-root select,
    .acu-edit-overlay input,
    .acu-edit-overlay textarea,
    .acu-edit-overlay select,
    .acu-dice-panel input,
    .acu-dice-panel select,
    .acu-contest-panel input,
    .acu-contest-panel select,
    .acu-avatar-manager-overlay input.acu-input {
        font-family: inherit;
        font-size: inherit;
        line-height: 1.4;
        border: 1px solid var(--acu-border);
        border-radius: 4px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-main);
        outline: none;
        transition: border-color 0.2s;
    }
    .acu-wrapper.acu-dice-ui-root input:focus,
    .acu-wrapper.acu-dice-ui-root textarea:focus,
    .acu-wrapper.acu-dice-ui-root select:focus,
    .acu-edit-overlay input:focus,
    .acu-edit-overlay textarea:focus,
    .acu-edit-overlay select:focus,
    .acu-dice-panel input:focus,
    .acu-dice-panel select:focus,
    .acu-contest-panel input:focus,
    .acu-contest-panel select:focus,
    .acu-avatar-manager-overlay input.acu-input:focus {
        border-color: var(--acu-accent);
        box-shadow: none;
        outline: none;
    }
    .acu-wrapper.acu-dice-ui-root input::placeholder,
    .acu-wrapper.acu-dice-ui-root textarea::placeholder,
    .acu-dice-panel input::placeholder,
    .acu-contest-panel input::placeholder,
    .acu-avatar-manager-overlay input.acu-input::placeholder {
        color: var(--acu-text-sub);
        opacity: 0.7;
    }

    .acu-inline-callout {
        padding: 10px 12px;
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        line-height: 1.5;
        font-size: 12px;
    }
    .acu-inline-callout-warning {
        color: var(--acu-warning-text);
        background: var(--acu-warning-bg);
        border-color: var(--acu-state-warning-border);
    }
    .acu-inline-callout i {
        margin-right: 6px;
    }

    /* 确保重要人物表（卡片）和 MVU 面板中的输入框始终有高对比度 */
    .acu-wrapper.acu-dice-ui-root .acu-data-card input,
    .acu-wrapper.acu-dice-ui-root .acu-data-card textarea,
    .acu-preview-overlay .acu-data-card input,
    .acu-preview-overlay .acu-data-card textarea,
    .acu-mvu-panel input,
    .acu-mvu-panel textarea {
        color: var(--SillyTavern-text-color, #e0e0e0) !important;
        background-color: var(--SillyTavern-bar-color, #0b0b0b) !important;
    }
    .acu-wrapper.acu-dice-ui-root .acu-data-card input::placeholder,
    .acu-wrapper.acu-dice-ui-root .acu-data-card textarea::placeholder,
    .acu-preview-overlay .acu-data-card input::placeholder,
    .acu-preview-overlay .acu-data-card textarea::placeholder,
    .acu-mvu-panel input::placeholder,
    .acu-mvu-panel textarea::placeholder {
        color: var(--SillyTavern-text-color, #e0e0e0) !important;
        opacity: 0.7 !important;
    }

    /* 弹窗遮罩层基类 */
    .acu-edit-overlay,
    .acu-relation-graph-overlay,
    .acu-avatar-manager-overlay,
    .acu-preview-overlay,
    .acu-import-confirm-overlay,
    .acu-crop-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        background: rgba(0,0,0,0.6);
        z-index: 31010;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        backdrop-filter: blur(2px);
    }
    /* 骰子面板遮罩层 - 需要在 preview-overlay(31100) 之上，属于编辑层(31200) */
    .acu-dice-overlay,
    .acu-contest-overlay,
    .acu-dice-config-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        background: rgba(0,0,0,0.6);
        z-index: 31200 !important;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        backdrop-filter: blur(2px);
    }

    /* 弹窗容器基类 */
    .acu-edit-dialog,
    .acu-dice-panel,
    .acu-contest-panel,
    .acu-relation-graph-container,
    .acu-avatar-manager,
    .acu-import-confirm-dialog,
    .acu-dice-config-dialog {
        background: var(--acu-bg-panel);
        border: 1px solid var(--acu-border);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

`;
