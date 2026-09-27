/**
 * part-01b-dice-panel.ts — part-01 子分片（从 part-01-theme 拆分，按序拼接内容不变）。
 */
export const STYLES_PART_01B_DICE_PANEL = `    /* ========== 骰子面板专用样式 ========== */
    /* 骰子面板 - 属于编辑层(31200+)，需要在 preview-overlay(31100) 之上 */
    .acu-dice-panel,
    .acu-contest-panel {
        position: relative;
        z-index: 31201 !important;
        width: 340px;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 32px);
        max-height: calc(100dvh - 32px);
    }
    .acu-dice-panel-header {
        padding: 12px 15px;
        background: var(--acu-table-head);
        border-bottom: 1px solid var(--acu-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .acu-dice-panel-title {
        font-size: 15px;
        font-weight: bold;
        color: var(--acu-accent);
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .acu-dice-panel-actions {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .acu-dice-panel-actions button {
        background: none;
        border: 1px solid transparent;
        border-radius: 6px;
        color: var(--acu-text-sub);
        cursor: pointer;
        font-size: 14px;
        width: 28px;
        height: 28px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-dice-panel-actions button:hover,
    .acu-dice-panel-actions button:focus-visible {
        background: var(--acu-btn-bg);
        color: var(--acu-accent);
        border-color: var(--acu-border);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-panel-body {
        padding: 15px;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
    }
    .acu-dice-presets {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 12px;
        align-items: center;
    }
    /* 预设快捷按钮区 */
    .acu-dice-quick-presets {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 10px;
        align-items: center;
        max-height: 72px; /* 约两行高度: (28px + 8px) * 2 */
        overflow-y: auto;
        overflow-x: hidden;
    }

    .acu-dice-return-btn {
        width: 100%;
        padding: 8px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        color: var(--acu-accent);
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 8px;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-dice-return-btn:hover,
    .acu-dice-return-btn:focus-visible {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-return-btn i {
        font-size: 14px;
    }
    .acu-dice-quick-preset-btn {
        padding: 2px 8px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        color: var(--acu-text-main);
        font-size: 10px;
        cursor: pointer;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
        max-width: 150px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1.4;
        user-select: none;
    }
    .acu-dice-quick-preset-btn:hover:not(.active),
    .acu-dice-quick-preset-btn:focus-visible:not(.active) {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        color: var(--acu-accent);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-quick-preset-btn.active,
    .acu-dice-quick-preset-btn.active:hover {
        background: var(--acu-accent);
        color: var(--acu-button-text-on-accent, #fff);
        border-color: var(--acu-accent);
        font-weight: 500;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--acu-accent) 70%, transparent);
    }
    .acu-dice-quick-preset-btn.active:hover,
    .acu-dice-quick-preset-btn.active:focus-visible {
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-form-row {
        display: grid;
        gap: 6px;
        margin-bottom: 6px;
    }
    .acu-dice-form-row.cols-2 { grid-template-columns: 1fr 1fr; }
    .acu-dice-form-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
    .acu-dice-form-label {
        font-size: 10px;
        color: var(--acu-text-sub);
        margin-bottom: 2px;
        min-height: 18px;
        display: flex;
        align-items: center;
    }
    .acu-dice-form-label.center { justify-content: center; }
    /* Section Title (Party A/B, Quick Select) */
    .acu-dice-section-title {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 6px;
        min-height: 24px;
    }
    .acu-dice-section-title > span {
        font-size: 12px;
        font-weight: bold;
        color: var(--acu-accent);
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
    }
    .acu-dice-preset-quick-actions {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-left: 6px;
    }
    .acu-dice-preset-action-btn {
        width: 20px;
        height: 20px;
        padding: 0;
        border-radius: 4px;
        border: 1px solid var(--acu-border);
        background: var(--acu-btn-bg);
        color: var(--acu-accent);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-dice-preset-action-btn:hover,
    .acu-dice-preset-action-btn:focus-visible {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-preset-action-btn i {
        font-size: 10px;
    }
    .acu-dice-preset-action-btn.disabled {
        opacity: 0.6;
        cursor: default;
    }
    .acu-dice-quick-section {
        margin-bottom: 10px;
    }
    .acu-dice-quick-title {
        font-size: 10px;
        color: var(--acu-text-sub);
        font-weight: bold;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .acu-dice-quick-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        max-height: 60px;
        overflow-y: auto;
    }
    .acu-dice-quick-inline {
        display: flex;
        gap: 4px;
        margin-left: 0;
        margin-top: 4px;
        flex: 1 1 100%;
        align-content: flex-start;
        min-width: 0;
        max-width: 100%;
        max-height: 63px;
        overflow-x: hidden;
        overflow-y: auto;
        white-space: normal;
        align-items: flex-start;
        flex-wrap: wrap;
        -webkit-overflow-scrolling: touch;
    }
    .acu-dice-quick-inline::-webkit-scrollbar { width: 6px; }
    .acu-dice-quick-compact {
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
        margin-bottom: 8px;
        max-height: 63px;
        overflow-y: auto;
        align-content: flex-start;
    }
    .acu-dice-panel .acu-dice-char-btn,
    .acu-contest-panel .acu-dice-char-btn,
    .acu-dice-panel .acu-dice-attr-btn,
    .acu-contest-panel .acu-dice-attr-btn,
    .acu-dice-panel .acu-dice-gen-attr-btn,
    .acu-dice-panel .acu-dice-clear-attr-btn,
    .acu-contest-panel .acu-contest-attr-btn,
    .acu-contest-panel .acu-contest-gen-attr-btn,
    .acu-contest-panel .acu-contest-clear-attr-btn {
        padding: 1px 5px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 4px;
        color: var(--acu-text-main);
        font-size: 11px;
        cursor: pointer;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
        white-space: nowrap;
        flex-shrink: 0;
        line-height: 1.3;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
    }
    /* [修复] 覆盖酒馆全局触控优化样式 - 防止移动端按钮被强制放大 */
    /* 酒馆全局规则: @media (hover: none) and (pointer: coarse) { button { min-width: 44px; min-height: 44px; } } */
    /* 使用通配符一次性禁用所有骰子系统容器内的按钮，避免逐个添加 */
    @media (hover: none) and (pointer: coarse) {
        .acu-wrapper.acu-dice-ui-root button,
        .acu-wrapper.acu-dice-ui-root button[class],
        .acu-edit-overlay button,
        .acu-edit-overlay button[class],
        .acu-dice-panel button,
        .acu-dice-panel button[class],
        .acu-contest-panel button,
        .acu-contest-panel button[class],
        .acu-preview-overlay button,
        .acu-preview-overlay button[class],
        .acu-gacha-overlay button,
        .acu-gacha-overlay button[class],
        .acu-inventory-overlay button,
        .acu-inventory-overlay button[class],
        .acu-inventory-detail-overlay button,
        .acu-inventory-detail-overlay button[class],
        .acu-import-confirm-overlay button,
        .acu-import-confirm-overlay button[class],
        .acu-embedded-options-container button,
        .acu-embedded-options-container button[class] {
            min-width: unset !important;
            min-height: unset !important;
        }
    }
    .acu-dice-panel .acu-dice-char-btn:hover,
    .acu-contest-panel .acu-dice-char-btn:hover,
    .acu-dice-panel .acu-dice-attr-btn:hover,
    .acu-contest-panel .acu-dice-attr-btn:hover,
    .acu-dice-panel .acu-dice-gen-attr-btn:hover,
    .acu-dice-panel .acu-dice-clear-attr-btn:hover,
    .acu-contest-panel .acu-contest-attr-btn:hover,
    .acu-contest-panel .acu-contest-gen-attr-btn:hover,
    .acu-contest-panel .acu-contest-clear-attr-btn:hover,
    .acu-dice-panel .acu-dice-char-btn:focus-visible,
    .acu-contest-panel .acu-dice-char-btn:focus-visible,
    .acu-dice-panel .acu-dice-attr-btn:focus-visible,
    .acu-contest-panel .acu-dice-attr-btn:focus-visible,
    .acu-dice-panel .acu-dice-gen-attr-btn:focus-visible,
    .acu-dice-panel .acu-dice-clear-attr-btn:focus-visible,
    .acu-contest-panel .acu-contest-attr-btn:focus-visible,
    .acu-contest-panel .acu-contest-gen-attr-btn:focus-visible,
    .acu-contest-panel .acu-contest-clear-attr-btn:focus-visible {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-panel .acu-dice-char-btn.active,
    .acu-contest-panel .acu-dice-char-btn.active,
    .acu-dice-panel .acu-dice-attr-btn.active,
    .acu-contest-panel .acu-dice-attr-btn.active {
        background: var(--acu-accent);
        color: var(--acu-button-text-on-accent, #fff);
        border-color: var(--acu-accent);
    }
    .acu-dice-roll-btn {
        width: 100%;
        padding: 12px;
        background: var(--acu-accent);
        border: 1px solid var(--acu-accent);
        border-radius: 8px;
        color: var(--acu-button-text-on-accent, var(--acu-btn-active-text));
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-dice-roll-btn:hover,
    .acu-dice-roll-btn:focus-visible {
        background: var(--acu-btn-active-bg, var(--acu-accent));
        border-color: var(--acu-accent);
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent));
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-random-skill-btn {
        width: 18px;
        height: 18px;
        padding: 0;
        background: transparent;
        border: 1px solid var(--acu-border);
        border-radius: 4px;
        color: var(--acu-accent);
        font-size: 9px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-random-skill-btn:hover,
    .acu-random-skill-btn:focus-visible {
        background: var(--acu-btn-hover);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }

    .acu-dice-history-dialog { max-width: 600px; width: min(94vw, 600px); max-height: 82vh; display: flex; flex-direction: column; padding: 14px; }
    .acu-dice-history-header,
    .acu-history-main,
    .acu-history-title-row,
    .acu-history-meta,
    .acu-history-side,
    .acu-history-footer,
    .acu-history-stats-summary,
    .acu-history-stats-values { display: flex; }
    .acu-dice-history-header { justify-content: space-between; align-items: center; gap: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--acu-border); }
    .acu-dice-history-header h3 { margin: 0; font-size: 19px; color: var(--acu-text-main); font-weight: 700; display: flex; align-items: center; gap: 8px; min-width: 0; }
    .acu-dice-history-header h3 i { color: var(--acu-accent); }
    .acu-dice-history-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
    .acu-dice-history-filters { --acu-history-filter-height: 40px; display: grid; grid-template-columns: minmax(92px, 0.75fr) minmax(104px, 0.85fr) minmax(120px, 1.4fr); gap: 6px; margin-top: 8px; align-items: stretch; }
    .acu-history-stats-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
    .acu-dice-history-filters select,
    .acu-dice-history-filters input { width: 100%; min-width: 0; }
    .acu-dice-history-dialog .acu-dice-history-filters select.acu-dice-select,
    .acu-dice-history-search,
    .acu-dice-history-dialog .acu-dice-history-search input.acu-dice-input { height: var(--acu-history-filter-height) !important; }
    .acu-dice-history-search { position: relative; min-width: 0; }
    .acu-dice-history-search i { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 12px; color: var(--acu-text-sub); pointer-events: none; }
    .acu-dice-history-dialog .acu-dice-history-search input.acu-dice-input { padding-left: 30px !important; }
    .acu-dice-history-stats { margin-top: 6px; padding: 8px; border: 1px solid var(--acu-border); border-radius: 8px; background: var(--acu-card-bg); }
    .acu-history-stats-grid { margin-bottom: 6px; }
    .acu-history-stat-card { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 6px 8px; border: 1px solid var(--acu-border); border-radius: 6px; min-width: 0; }
    .acu-history-stat-card small { display: block; font-size: 11px; line-height: 1.2; color: var(--acu-text-sub); white-space: nowrap; }
    .acu-history-stat-card strong { display: block; font-size: 16px; line-height: 1.1; font-weight: 700; color: var(--acu-text-main); }
    .acu-history-stats-summary { justify-content: space-between; align-items: center; gap: 6px 10px; flex-wrap: wrap; font-size: 12px; line-height: 1.35; }
    .acu-history-stats-summary > span,
    .acu-history-scope-note,
    .acu-history-roll,
    .acu-history-time { color: var(--acu-text-sub); }
    .acu-history-stats-summary > span { flex: 0 0 auto; }
    .acu-history-stats-values { gap: 10px; flex-wrap: wrap; min-width: 0; }
    .acu-history-stats-values span { color: var(--acu-text-main); }
    .acu-history-stats-values b.is-success { color: var(--acu-success-text); }
    .acu-history-scope-note { margin-top: 6px; font-size: 11px; }
    .acu-dice-history-list { margin-top: 8px; overflow-y: auto; flex: 1; min-height: 220px; max-height: 52vh; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; touch-action: pan-y; }
    .acu-history-item { padding: 10px 12px; border: 1px solid var(--acu-border); border-radius: 8px; margin-bottom: 8px; background: var(--acu-bg-panel); }
    .acu-history-main { justify-content: space-between; align-items: flex-start; gap: 8px; }
    .acu-history-primary { min-width: 0; flex: 1; }
    .acu-history-title-row { align-items: center; gap: 6px; min-width: 0; }
    .acu-history-tag,
    .acu-history-status { border: 1px solid var(--acu-border); border-radius: 999px; padding: 1px 7px; font-size: 11px; }
    .acu-history-tag { color: var(--acu-text-sub); flex-shrink: 0; font-size: 10px; }
    .acu-history-title { font-weight: 700; color: var(--acu-text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
    .acu-history-pushed-icon { font-size: 10px; color: var(--acu-text-sub); margin-left: 4px; }
    .acu-history-meta { margin-top: 6px; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12px; }
    .acu-history-result { color: var(--acu-history-result-color, var(--acu-text-main)); font-weight: 700; }
    .acu-history-roll,
    .acu-history-detail { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .acu-history-status { color: var(--acu-history-status-color, var(--acu-text-sub)); border-color: color-mix(in srgb, var(--acu-history-status-color, var(--acu-text-sub)) 40%, transparent); }
    .acu-history-side { align-items: center; gap: 5px; flex-shrink: 0; }
    .acu-history-time { font-size: 12px; }
    .acu-history-icon-btn { border: 1px solid transparent; background: transparent; color: var(--acu-text-sub); border-radius: 6px; cursor: pointer; width: 24px; height: 24px; padding: 0; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard); }
    .acu-history-detail-copy { background: var(--acu-btn-bg); border-color: var(--acu-border); }
    .acu-history-icon-btn:hover,
    .acu-history-icon-btn:focus-visible { background: var(--acu-btn-hover); color: var(--acu-accent); border-color: var(--acu-border); box-shadow: var(--acu-focus-ring); outline: none; }
    .acu-history-detail { margin-top: 8px; padding: 9px 10px; background: color-mix(in srgb, var(--acu-card-bg) 72%, transparent); border: 1px solid var(--acu-border); border-radius: 6px; font-size: 11px; line-height: 1.5; color: var(--acu-text-sub); white-space: pre-wrap; }
    .acu-history-detail strong { display: block; font-weight: 700; color: var(--acu-text-main); margin-bottom: 4px; }
    .acu-history-detail hr { border: 0; border-top: 1px solid var(--acu-border); margin: 7px 0; }
    .acu-history-footer { justify-content: space-between; gap: 8px; padding-top: 10px; border-top: 1px solid var(--acu-border); margin-top: 8px; flex-wrap: wrap; }
    @media (max-width: 640px) {
        .acu-dice-history-dialog {
            width: calc(100vw - 20px);
            max-height: calc(100dvh - 24px);
            padding: 12px;
        }
        .acu-dice-history-header h3 {
            font-size: 16px;
        }
        .acu-dice-history-filters {
            --acu-history-filter-height: 34px;
            grid-template-columns: minmax(78px, 0.75fr) minmax(88px, 0.85fr) minmax(86px, 1fr);
            gap: 6px;
            margin-top: 8px;
        }
        .acu-dice-history-filters select,
        .acu-dice-history-filters input {
            font-size: 12px;
        }
        .acu-dice-history-search i {
            left: 9px;
        }
        .acu-dice-history-dialog .acu-dice-history-search input.acu-dice-input {
            padding-left: 27px !important;
        }
        .acu-history-stat-card {
            padding: 5px 6px;
            gap: 4px;
        }
        .acu-history-stat-card small {
            font-size: 10px;
        }
        .acu-history-stat-card strong {
            font-size: 15px;
        }
        .acu-history-stats-summary {
            align-items: stretch;
            font-size: 11px;
        }
        .acu-history-stats-summary > span {
            width: 100%;
        }
        .acu-history-stats-values {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            width: 100%;
            gap: 4px;
        }
        .acu-history-stats-values span {
            min-width: 0;
            white-space: nowrap;
        }
        .acu-history-main {
            flex-direction: column;
        }
        .acu-history-side {
            width: 100%;
            justify-content: space-between;
        }
        .acu-history-footer {
            justify-content: stretch;
        }
        .acu-history-footer .acu-dialog-btn {
            flex: 1;
        }
    }
    @media (max-width: 360px) {
        .acu-history-stats-values {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    /* 弹窗头部基类 - 统一使用 .acu-panel-header */
    .acu-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 15px;
        background: var(--acu-table-head);
        border-bottom: 1px solid var(--acu-border);
        flex-shrink: 0;
    }

    /* 关闭按钮基类 - 所有关闭按钮统一使用 .acu-close-btn */
    .acu-close-btn {
        background: none !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        color: var(--acu-text-sub);
        cursor: pointer;
        font-size: 16px;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
    }
    .acu-close-btn:hover {
        background: none !important;
        color: var(--acu-accent);
    }

    /* 滚动条默认隐藏仅限骰子前端自身，避免影响数据库本体 */
    .acu-wrapper.acu-dice-ui-root,
    .acu-wrapper.acu-dice-ui-root *,
    .acu-edit-overlay,
    .acu-edit-overlay *,
    .acu-dice-panel,
    .acu-dice-panel *,
    .acu-contest-panel,
    .acu-contest-panel *,
    .acu-preview-overlay,
    .acu-preview-overlay *,
    .acu-gacha-overlay,
    .acu-gacha-overlay *,
    .acu-inventory-overlay,
    .acu-inventory-overlay *,
    .acu-inventory-detail-overlay,
    .acu-inventory-detail-overlay *,
    .acu-import-confirm-overlay,
    .acu-import-confirm-overlay *,
    .acu-embedded-options-container,
    .acu-embedded-options-container * {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .acu-wrapper.acu-dice-ui-root *::-webkit-scrollbar,
    .acu-edit-overlay *::-webkit-scrollbar,
    .acu-dice-panel *::-webkit-scrollbar,
    .acu-contest-panel *::-webkit-scrollbar,
    .acu-preview-overlay *::-webkit-scrollbar,
    .acu-gacha-overlay *::-webkit-scrollbar,
    .acu-inventory-overlay *::-webkit-scrollbar,
    .acu-inventory-detail-overlay *::-webkit-scrollbar,
    .acu-import-confirm-overlay *::-webkit-scrollbar,
    .acu-embedded-options-container *::-webkit-scrollbar {
        display: none !important;
    }

`;
