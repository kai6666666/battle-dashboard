/**
 * part-06c-inventory-2.ts — part-06 子分片（从 part-06-inventory 拆分，按序拼接内容不变）。
 */
export const STYLES_PART_06C_INVENTORY_2 = `    .acu-gacha-pickup-detail-overlay {
        z-index: 31365 !important;
    }
    .acu-gacha-custom-field-details,
    .acu-gacha-custom-fields-details {
        width: 100%;
        min-width: 0;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 14px;
        background: color-mix(in srgb, var(--acu-card-bg) 94%, transparent);
    }
    .acu-gacha-custom-field-details summary,
    .acu-gacha-custom-fields-details summary {
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 12px;
        color: var(--acu-text-main);
        cursor: pointer;
        list-style: none;
    }
    .acu-gacha-custom-field-details summary::-webkit-details-marker,
    .acu-gacha-custom-fields-details summary::-webkit-details-marker {
        display: none;
    }
    .acu-gacha-custom-field-details summary::after,
    .acu-gacha-custom-fields-details summary::after {
        content: '\f078';
        flex: 0 0 auto;
        color: var(--acu-text-sub);
        font-family: 'Font Awesome 6 Free';
        font-weight: 900;
        transition: transform .14s ease, color .14s ease;
    }
    .acu-gacha-custom-field-details[open] summary::after,
    .acu-gacha-custom-fields-details[open] summary::after {
        transform: rotate(180deg);
        color: var(--acu-accent);
    }
    .acu-gacha-custom-field-details summary > span,
    .acu-gacha-custom-fields-details summary > span {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        overflow: hidden;
        font-size: 13px;
        font-weight: 850;
    }
    .acu-gacha-custom-field-details summary strong,
    .acu-gacha-custom-fields-details summary strong {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-custom-field-details summary small,
    .acu-gacha-custom-fields-details summary small {
        flex: 0 0 auto;
        color: var(--acu-text-sub);
        font-size: 10px;
        font-weight: 700;
    }
    .acu-gacha-custom-field-detail-list {
        max-height: min(34dvh, 320px);
        overflow: hidden auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0 12px 12px;
    }
    .acu-gacha-custom-field-detail-row {
        min-width: 0;
        display: grid;
        grid-template-columns: minmax(96px, .42fr) minmax(0, 1fr);
        gap: 8px;
        align-items: start;
        padding: 8px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 72%, transparent);
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-btn-bg) 72%, transparent);
    }
    .acu-gacha-custom-field-detail-key,
    .acu-gacha-custom-field-detail-value {
        min-width: 0;
        overflow-wrap: anywhere;
        word-break: break-word;
    }
    .acu-gacha-custom-field-detail-key {
        color: var(--acu-text-sub);
        font-size: 12px;
        font-weight: 800;
        line-height: 1.35;
    }
    .acu-gacha-custom-field-detail-value {
        color: var(--acu-text-main);
        font-size: 13px;
        font-weight: 650;
        line-height: 1.45;
        white-space: pre-wrap;
    }
    .acu-gacha-shard-shop {
        width: min(760px, 94vw);
        max-height: min(86dvh, 760px);
        overflow: hidden;
        gap: 10px;
        padding: 14px;
    }
    .acu-gacha-shard-shop .acu-inventory-detail-header {
        align-items: center;
        gap: 10px;
        padding-bottom: 0;
    }
    .acu-gacha-shard-shop .acu-inventory-detail-head-main {
        gap: 8px;
    }
    .acu-gacha-shard-shop .acu-inventory-detail-icon {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        font-size: 20px;
    }
    .acu-gacha-shard-shop .acu-inventory-detail-title {
        font-size: 18px;
        line-height: 1.1;
    }
    .acu-gacha-shard-shop .acu-preview-close {
        width: 34px;
        height: 34px;
        border-radius: 10px;
    }
    .acu-gacha-shard-items {
        min-height: 0;
        max-height: min(56dvh, 520px);
        flex: 0 1 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        grid-auto-rows: minmax(76px, max-content);
        align-content: start;
        gap: 10px;
        overflow: hidden auto;
        padding-right: 2px;
        scrollbar-width: none;
    }
    .acu-gacha-shard-item-card {
        position: relative;
        min-width: 0;
        display: block;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-card-bg) 92%, #0f1b2b);
        color: var(--acu-text-main);
        overflow: hidden;
        touch-action: manipulation;
        transition: border-color .16s ease, background .16s ease, transform .16s ease, box-shadow .16s ease;
    }
    .acu-gacha-shard-item-card > * {
        position: relative;
        z-index: 1;
    }
    .acu-gacha-shard-item-card:hover {
        border-color: color-mix(in srgb, var(--acu-accent) 34%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-card-bg) 92%, var(--acu-accent));
        transform: translateY(-1px);
        box-shadow: 0 8px 18px color-mix(in srgb, var(--acu-accent) 12%, transparent);
    }
    .acu-gacha-shard-item-card.is-disabled {
        cursor: default;
    }
    .acu-gacha-shard-item-card.is-disabled:hover {
        border-color: color-mix(in srgb, var(--acu-accent) 28%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-card-bg) 94%, var(--acu-accent));
        transform: translateY(-1px);
    }
    .acu-gacha-shard-price,
    .acu-gacha-shard-owned {
        position: absolute;
        right: 10px;
        min-height: 30px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 4px 8px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 24%, var(--acu-border));
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-btn-bg) 78%, transparent);
        color: var(--acu-accent);
        font-size: 12px;
        font-weight: 900;
        line-height: 1;
    }
    .acu-gacha-shard-price {
        top: 10px;
        z-index: 3;
        cursor: pointer;
        overflow: hidden;
        pointer-events: auto;
        transition: border-color .16s ease, background .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-shard-price > * {
        position: relative;
        z-index: 1;
    }
    .acu-gacha-shard-price i {
        font-size: 12px;
    }
    .acu-gacha-shard-item-card.is-available .acu-gacha-shard-price {
        border-color: color-mix(in srgb, var(--acu-btn-active-bg) 42%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-active-bg) 16%, var(--acu-card-bg));
        color: var(--acu-text-main);
    }
    .acu-gacha-shard-item-card.is-available .acu-gacha-shard-price:hover {
        border-color: var(--acu-btn-active-bg);
        background: color-mix(in srgb, var(--acu-btn-active-bg) 24%, var(--acu-card-bg));
        color: var(--acu-accent);
        transform: translateY(-1px);
    }
    .acu-gacha-shard-item-card.is-disabled .acu-gacha-shard-price,
    .acu-gacha-shard-item-card.is-disabled .acu-gacha-shard-price:hover {
        cursor: not-allowed;
        border-color: color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-bg) 62%, transparent);
        color: var(--acu-text-sub);
        transform: none;
    }
    .acu-gacha-shard-owned {
        bottom: 10px;
        color: var(--acu-text-sub);
    }
    .acu-gacha-shard-card-main {
        width: 100%;
        min-height: 76px;
        display: grid;
        grid-template-columns: 56px minmax(0, 1fr);
        gap: 12px;
        align-items: center;
        padding: 12px;
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        text-align: left;
        user-select: none;
    }
    .acu-gacha-shard-shop .acu-gacha-shard-card-main,
    .acu-gacha-shard-card-main:hover {
        background: transparent;
        border-color: transparent;
        color: inherit;
        box-shadow: none;
    }
    .acu-gacha-shard-shop .acu-gacha-shard-card-main:hover,
    .acu-gacha-shard-shop .acu-gacha-shard-card-main:focus {
        background: transparent;
        color: inherit;
        transform: none;
    }
    .acu-gacha-shard-shop .acu-gacha-shard-card-main:focus-visible {
        outline: 2px solid color-mix(in srgb, var(--acu-accent) 54%, transparent);
        outline-offset: -4px;
    }
    .acu-gacha-shard-item-card:hover .acu-gacha-shard-item-head strong {
        color: var(--acu-text-main);
    }
    .acu-gacha-shard-item-card:hover .acu-gacha-shard-item-head span,
    .acu-gacha-shard-item-card:hover .acu-gacha-shard-item-desc {
        color: var(--acu-text-sub);
    }
    .acu-gacha-shard-item-card:hover .acu-gacha-shard-item-icon {
        background: color-mix(in srgb, var(--acu-accent) 18%, transparent);
    }
    .acu-gacha-shard-item-icon {
        width: 56px;
        aspect-ratio: 1 / 1;
        height: auto;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-accent) 14%, transparent);
        font-size: 28px;
    }
    .acu-gacha-shard-item-main {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .acu-gacha-shard-card-main .acu-gacha-custom-field-preview {
        max-height: 38px;
        overflow: hidden;
        padding-right: 58px;
    }
    .acu-gacha-shard-item-head {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding-right: 58px;
    }
    .acu-gacha-shard-item-head strong,
    .acu-gacha-shard-item-head span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-shard-item-head strong {
        color: var(--acu-text-main);
        font-size: 14px;
        font-weight: 900;
    }
    .acu-gacha-shard-item-head span,
    .acu-gacha-shard-item-effect,
    .acu-gacha-shard-item-desc {
        color: var(--acu-text-sub);
        font-size: 11px;
    }
    .acu-gacha-shard-item-effect,
    .acu-gacha-shard-item-desc {
        min-width: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin: 0;
        line-height: 1.45;
        overflow: hidden;
        padding-right: 58px;
    }
    .acu-gacha-shard-confirm-overlay {
        z-index: 31370 !important;
        padding: 18px;
        background: rgba(0, 0, 0, 0.42);
        backdrop-filter: blur(4px);
    }
    .acu-gacha-shard-confirm {
        width: min(360px, 92vw);
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 30%, var(--acu-border));
        border-radius: 16px;
        background:
            linear-gradient(180deg, color-mix(in srgb, var(--acu-card-bg) 96%, white 3%), color-mix(in srgb, var(--acu-bg-panel) 98%, #f1ede3));
        color: var(--acu-text-main);
        box-shadow: 0 18px 44px var(--acu-shadow);
    }
    .acu-gacha-shard-confirm-head {
        display: grid;
        grid-template-columns: 52px minmax(0, 1fr);
        gap: 12px;
        align-items: center;
    }
    .acu-gacha-shard-confirm-icon {
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: color-mix(in srgb, var(--acu-accent) 12%, transparent);
        font-size: 28px;
    }
    .acu-gacha-shard-confirm-text {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .acu-gacha-shard-confirm-text strong {
        min-width: 0;
        overflow: hidden;
        color: var(--acu-text-main);
        font-size: 16px;
        font-weight: 900;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-shard-confirm-text span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--acu-text-sub);
        font-size: 12px;
        font-weight: 800;
    }
    .acu-gacha-shard-confirm-text small {
        color: var(--acu-text-sub);
        font-size: 11px;
        font-weight: 700;
        line-height: 1.35;
    }
    .acu-gacha-shard-confirm-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }
    .acu-gacha-shard-confirm-btn {
        min-height: 40px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 24%, var(--acu-border));
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-btn-bg) 82%, transparent);
        color: var(--acu-text-main);
        cursor: pointer;
        font-size: 13px;
        font-weight: 900;
        transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-shard-confirm-btn:hover {
        border-color: var(--acu-btn-active-bg);
        transform: translateY(-1px);
    }
    .acu-gacha-shard-confirm-btn.primary {
        background: var(--acu-btn-active-bg);
        border-color: var(--acu-btn-active-bg);
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
    }
    .acu-gacha-shard-confirm-btn.secondary:hover {
        background: color-mix(in srgb, var(--acu-accent) 14%, var(--acu-btn-bg));
        color: var(--acu-accent);
    }
    .acu-inventory-toolbar {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 0;
        padding: 5px 7px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 26%, var(--acu-border));
        border-radius: 10px;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.08)),
            color-mix(in srgb, var(--acu-card-bg) 92%, #0f1b2b);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
    }
    .acu-inventory-filter-collapse-btn {
        width: 100%;
        min-height: 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 5px 7px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--acu-text-main);
        cursor: pointer;
        text-align: left;
        transition: background-color .16s ease, color .16s ease;
    }
    .acu-inventory-filter-collapse-btn:hover {
        background: color-mix(in srgb, var(--acu-table-hover) 88%, transparent);
    }
    .acu-inventory-filter-collapse-title {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        color: var(--acu-text-sub);
        font-size: 12px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }
    .acu-inventory-filter-collapse-title > i {
        color: var(--acu-accent);
    }
    .acu-inventory-filter-count {
        min-width: 18px;
        height: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-accent) 24%, transparent);
        color: var(--acu-btn-active-text);
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
    }
    .acu-inventory-filter-collapse-icon {
        color: var(--acu-text-sub);
        font-size: 12px;
        transition: transform 0.24s ease;
    }
    .acu-inventory-filter-collapse-body {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 6px;
        overflow: hidden;
        max-height: 420px;
        opacity: 1;
        transform: translateY(0);
        transition:
            opacity var(--acu-motion-normal) var(--acu-ease-standard),
            transform var(--acu-motion-normal) var(--acu-ease-out);
    }
    .acu-inventory-filter-collapsible.collapsed .acu-inventory-filter-collapse-body {
        max-height: 0;
        opacity: 0;
        margin-top: 0;
        transform: translateY(-2px);
        pointer-events: none;
    }
    .acu-inventory-filter-collapsible.collapsed .acu-inventory-filter-collapse-icon {
        transform: rotate(-90deg);
    }
    .acu-inventory-search {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 0;
    }
    .acu-inventory-search i {
        position: absolute;
        left: 12px;
        color: var(--acu-accent);
        opacity: 0.82;
        pointer-events: none;
    }
    .acu-inventory-search input {
        width: 100%;
        min-height: 42px;
        padding: 10px 12px 10px 36px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 24%, var(--acu-border));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-input-bg, var(--acu-card-bg)) 88%, #08121d) !important;
        background-color: color-mix(in srgb, var(--acu-input-bg, var(--acu-card-bg)) 88%, #08121d) !important;
        color: var(--acu-text-main) !important;
        -webkit-text-fill-color: var(--acu-text-main) !important;
        font-size: var(--acu-font-size, 13px);
        outline: none;
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            inset 0 0 0 1000px color-mix(in srgb, var(--acu-input-bg, var(--acu-card-bg)) 88%, #08121d) !important;
        -webkit-box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            inset 0 0 0 1000px color-mix(in srgb, var(--acu-input-bg, var(--acu-card-bg)) 88%, #08121d) !important;
        appearance: none;
        -webkit-appearance: none;
    }
    .acu-inventory-search input::placeholder {
        color: color-mix(in srgb, var(--acu-text-sub) 88%, transparent) !important;
        -webkit-text-fill-color: color-mix(in srgb, var(--acu-text-sub) 88%, transparent) !important;
        opacity: 1;
    }
    .acu-inventory-search-inline {
        width: min(190px, 38vw);
        flex: 0 1 min(190px, 38vw);
    }
    .acu-inventory-search-inline input {
        min-height: 34px;
        padding-top: 7px;
        padding-bottom: 7px;
        font-size: 12px;
    }
    .acu-inventory-filter-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .acu-inventory-filter-label {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--acu-text-sub);
        font-size: 11px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }
    .acu-inventory-filter-label i {
        color: var(--acu-accent);
    }
    .acu-inventory-filter-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
        gap: 6px;
    }
    .acu-inventory-filter-btn {
        min-height: 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 8px;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.12)),
            color-mix(in srgb, var(--acu-btn-bg) 92%, #0b1624);
        color: var(--acu-text-sub);
        cursor: pointer;
        transition: transform .16s ease, border-color .16s ease, color .16s ease, background-color .16s ease, box-shadow .16s ease;
    }
    .acu-inventory-filter-btn:hover {
        color: var(--acu-text-main);
        border-color: color-mix(in srgb, var(--acu-accent) 64%, var(--acu-border));
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.04)),
            color-mix(in srgb, var(--acu-card-bg) 86%, var(--acu-accent));
        transform: translateY(-1px);
    }
    .acu-inventory-filter-btn.active {
        color: var(--acu-btn-active-text);
        border-color: color-mix(in srgb, var(--acu-accent) 80%, white 8%);
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.08)),
            var(--acu-btn-active-bg);
        box-shadow:
            0 0 0 1px color-mix(in srgb, var(--acu-accent) 24%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
    }
    .acu-inventory-overlay .acu-inventory-filter-btn:hover {
        color: var(--acu-accent);
        border-color: color-mix(in srgb, var(--acu-accent) 64%, var(--acu-border));
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.04)),
            color-mix(in srgb, var(--acu-card-bg) 86%, var(--acu-accent));
    }
    .acu-inventory-overlay .acu-inventory-filter-btn.active,
    .acu-inventory-overlay .acu-inventory-filter-btn.active:hover {
        color: var(--acu-btn-active-text);
        border-color: color-mix(in srgb, var(--acu-accent) 80%, white 8%);
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.08)),
            var(--acu-btn-active-bg);
    }
    .acu-inventory-grid {
        flex: 1;
        overflow: hidden auto;
        min-height: 0;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        column-gap: 8px;
        row-gap: 6px;
        justify-content: start;
        align-content: start;
        min-width: 0;
        padding-right: 2px;
        grid-auto-rows: max-content;
    }
    .acu-inventory-grid.is-empty {
        grid-template-columns: minmax(0, 1fr);
        justify-content: stretch;
    }
    .acu-inventory-card {
        display: flex;
        flex-direction: column;
        min-width: 0;
        border: 0;
        border-radius: 16px;
        background: transparent;
        color: var(--acu-text-main);
        overflow: visible;
        transition: transform .18s ease, opacity .18s ease;
    }
    .acu-inventory-card:hover {
        transform: translateY(-2px);
    }
    .acu-inventory-card.is-depleted {
        opacity: .46;
    }
    .acu-inventory-card.acu-inventory-changed {
        filter: drop-shadow(0 10px 18px color-mix(in srgb, var(--acu-hl-diff) 18%, transparent));
    }
    .acu-inventory-card-main {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 3px;
        align-items: center;
        border: 0;
        background: transparent;
        color: var(--acu-text-main);
        text-align: center;
        padding: 2px 2px 4px;
        cursor: pointer;
        min-width: 0;
        border-radius: 12px;
        transition: background-color .16s ease;
    }
    .acu-inventory-card-main:hover {
        background: color-mix(in srgb, var(--acu-accent) 8%, transparent);
    }
    .acu-inventory-card.acu-inventory-changed .acu-inventory-card-main {
        background: color-mix(in srgb, var(--acu-hl-diff) 10%, transparent);
    }
    .acu-inventory-slot-visual {
        position: relative;
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: min(100%, 76px);
        min-height: 68px;
        border: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
    }
    .acu-inventory-icon {
        width: 60px;
        height: 60px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        line-height: 1;
        filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2));
        overflow: hidden;
        transition: transform .16s ease;
    }
    .acu-inventory-card-main:hover .acu-inventory-icon {
        transform: scale(1.05);
    }
    .acu-inventory-card-text {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        width: 100%;
        align-items: center;
    }
    .acu-inventory-name {
        font-weight: 700;
        color: var(--acu-text-main);
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        min-width: 0;
        line-height: 1.2;
        font-size: 12px;
        max-width: 100%;
    }
    .acu-inventory-meta,
    .acu-inventory-badges,
    .acu-inventory-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        flex-wrap: wrap;
        min-width: 0;
    }
    .acu-inventory-type,
    .acu-inventory-quality,
    .acu-inventory-change-badge,
    .acu-inventory-task-badge,
    .acu-inventory-empty-badge,
    .acu-inventory-presence {
        display: inline-flex;
        align-items: center;
        min-height: 20px;
        padding: 1px 7px;
        border-radius: 999px;
        border: 1px solid var(--acu-border);
        background: var(--acu-badge-bg);
        color: var(--acu-text-main);
        font-size: 10px;
        line-height: 1.4;
        white-space: nowrap;
    }
    .acu-inventory-quality {
        border-color: var(--acu-accent);
        color: var(--acu-accent);
    }
    .acu-inventory-change-badge {
        border-color: var(--acu-hl-diff);
        color: var(--acu-hl-diff);
        background: var(--acu-hl-diff-bg);
        font-weight: 700;
    }
    .acu-inventory-task-badge {
        color: var(--acu-warning-text);
        background: var(--acu-warning-bg);
        border-color: var(--acu-warning-icon);
    }
    .acu-inventory-empty-badge {
        color: var(--acu-text-sub);
    }
    .acu-inventory-count {
        position: absolute;
        right: 6px;
        bottom: 5px;
        min-width: 22px;
        height: 22px;
        padding: 0 5px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: var(--acu-btn-active-bg);
        color: var(--acu-btn-active-text);
        font-weight: 800;
        font-size: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.26);
    }
    .acu-inventory-icon-btn {
        width: 32px;
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-bg) 92%, #101927);
        color: var(--acu-text-main);
        cursor: pointer;
    }
    .acu-inventory-icon-btn:hover {
        border-color: var(--acu-accent);
        color: var(--acu-accent);
    }
    .acu-inventory-empty {
        grid-column: 1 / -1;
        min-height: 160px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        box-sizing: border-box;
        border: 1px dashed color-mix(in srgb, var(--acu-accent) 20%, var(--acu-border));
        border-radius: 12px;
        color: var(--acu-text-sub);
        background: color-mix(in srgb, var(--acu-card-bg) 90%, #101927);
        text-align: center;
        padding: 18px;
    }
    .acu-inventory-empty[hidden] {
        display: none !important;
    }
    .acu-inventory-empty.compact {
        min-height: 88px;
    }
    .acu-inventory-empty i {
        color: var(--acu-accent);
        font-size: 22px;
    }
    .acu-inventory-detail-overlay {
        position: fixed;
        inset: 0;
        z-index: 31250;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        background: color-mix(in srgb, var(--acu-overlay-bg, rgba(0, 0, 0, 0.62)) 74%, transparent);
        backdrop-filter: blur(3px);
    }
    .acu-inventory-detail {
        width: min(560px, 94vw);
        max-height: min(78vh, 720px);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 14px;
        overflow: hidden auto;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 26%, var(--acu-border));
        border-radius: 18px;
        background:
            linear-gradient(180deg, color-mix(in srgb, var(--acu-card-bg) 95%, white 3%), color-mix(in srgb, var(--acu-bg-panel) 98%, #f1ede3));
        color: var(--acu-text-main);
        box-shadow: 0 18px 44px var(--acu-shadow);
        padding: 18px;
    }
    .acu-inventory-detail-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding-bottom: 2px;
    }
    .acu-inventory-detail-head-main {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0;
        flex: 1;
    }
    .acu-inventory-detail-icon {
`;
