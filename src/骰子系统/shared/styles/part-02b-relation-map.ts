/**
 * part-02b-relation-map.ts — part-02 子分片（从 part-02-avatar 拆分，按序拼接内容不变）。
 */
export const STYLES_PART_02B_RELATION_MAP = `            /* ========== 人物关系图样式 ========== */
            .acu-relation-graph-overlay {
                background: rgba(0,0,0,0.8);
                z-index: 31100;
                backdrop-filter: blur(4px);
            }
            .acu-relation-graph-container {
                width: 95%;
                max-width: 900px;
                height: 85vh;
                max-height: 700px;
                box-sizing: border-box;
            }
            .acu-graph-title {
                font-size: 16px;
                font-weight: bold;
                color: var(--acu-accent);
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }
            .acu-graph-heading {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                flex-shrink: 0;
            }
            .acu-graph-heading-text {
                display: none;
            }
            .acu-graph-actions {
                display: flex;
                gap: 8px;
                align-items: center;
                flex-shrink: 0;
            }
            .acu-graph-btn {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .acu-graph-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-graph-canvas-wrapper {
                flex: 1;
                overflow: hidden;
                position: relative;
                min-height: 0;
            }
            .acu-graph-svg {
                width: 100%;
                height: 100%;
                cursor: grab;
            }
            .acu-graph-svg:active { cursor: grabbing; }
            .acu-graph-svg.acu-graph-move-mode {
                cursor: default;
            }
            .acu-graph-edge {
                stroke: var(--acu-border);
                stroke-width: 2;
                opacity: 0.6;
            }
            .acu-graph-edge-label {
                font-size: 11px;
                fill: var(--acu-text-sub);
                text-anchor: middle;
                pointer-events: none;
            }
            .acu-graph-edge-label-html {
                pointer-events: none;
                transition: opacity 0.2s ease, color 0.2s ease;
            }
            .acu-graph-node { cursor: grab; }
            .acu-graph-node:active { cursor: grabbing; }
            .acu-graph-move-mode .acu-graph-node {
                cursor: move;
            }
            .acu-graph-node-dragging .acu-graph-node,
            .acu-graph-node-dragging .acu-graph-node:active {
                cursor: grabbing;
            }
            .acu-graph-move-mode .acu-graph-node .acu-node-bg {
                stroke-dasharray: 4 3;
            }
            .acu-node-bg {
                fill: var(--acu-btn-bg);
                stroke: var(--acu-border);
                stroke-width: 2;
                transition: all 0.2s;
            }
            .acu-node-bg.player {
                fill: var(--acu-accent);
                stroke: var(--acu-btn-active-text);
            }
            .acu-graph-node:hover .acu-node-bg {
                stroke: var(--acu-accent);
                stroke-width: 3;
                filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
            }
            .acu-graph-node:hover .acu-node-avatar {
                box-shadow: 0 0 0 2px var(--acu-accent);
            }
            .acu-graph-svg.highlighting .acu-graph-node {
                opacity: 0.2;
                transition: opacity 0.2s ease;
            }
            .acu-graph-svg.highlighting .acu-graph-edge {
                opacity: 0.1;
                transition: opacity 0.2s ease;
            }
            .acu-graph-svg.highlighting .acu-graph-edge-label {
                opacity: 0.1;
                transition: opacity 0.2s ease;
            }
            .acu-graph-svg.highlighting .acu-graph-edge-label-html {
                opacity: 0.1;
            }
            .acu-graph-svg.highlighting .acu-graph-node.highlighted {
                opacity: 1;
            }
            .acu-graph-svg.highlighting .acu-graph-node.highlighted .acu-node-bg {
                stroke: var(--acu-accent);
                stroke-width: 3;
            }
            .acu-graph-svg.highlighting .acu-graph-node.highlighted .acu-node-avatar {
                box-shadow: 0 0 0 2px var(--acu-accent);
            }
            .acu-graph-svg.highlighting .acu-graph-edge.highlighted {
                opacity: 1;
                stroke: var(--acu-accent);
                stroke-width: 3;
            }
            .acu-graph-svg.highlighting .acu-graph-edge-label.acu-graph-label-highlighted {
                opacity: 1;
                fill: var(--acu-accent);
                font-weight: 700;
            }
            .acu-graph-svg.highlighting .acu-graph-edge-label-html.acu-graph-label-highlighted {
                opacity: 1;
                color: var(--acu-accent) !important;
                font-weight: 700;
                background: transparent !important;
                box-shadow: none !important;
            }
            .acu-node-char {
                font-size: 16px;
                font-weight: bold;
                fill: var(--acu-text-main);
                text-anchor: middle;
                pointer-events: none;
            }
            .acu-node-bg.player + text.acu-node-char,
            .acu-node-bg.player ~ text.acu-node-char {
                fill: var(--acu-btn-active-text);
            }
            .acu-node-label {
                font-size: 12px;
                fill: var(--acu-text-main);
                text-anchor: middle;
                pointer-events: none;
            }
            .acu-node-inscene-indicator {
                fill: var(--acu-accent);
                stroke: var(--acu-bg-panel);
                stroke-width: 2;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
            }
            .acu-node-center-indicator {
                fill: none;
                stroke: var(--acu-accent);
                stroke-width: 2;
                stroke-dasharray: 6 3;
                opacity: 0.7;
                animation: acu-center-spin 8s linear infinite;
                pointer-events: none;
            }
            @keyframes acu-center-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .acu-graph-center-dropdown {
                position: relative;
            }
            .acu-graph-center-trigger {
                display: flex;
                align-items: center;
                gap: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                padding: 4px 10px;
                font-size: 12px;
                cursor: pointer;
                max-width: 130px;
                min-height: 34px;
                box-sizing: border-box;
                transition: all 0.2s;
                white-space: nowrap;
            }
            .acu-graph-center-trigger:hover {
                border-color: var(--acu-accent);
            }
            .acu-graph-center-trigger .acu-center-label {
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100px;
            }
            .acu-graph-center-trigger .fa-caret-down {
                font-size: 10px;
                opacity: 0.6;
                transition: transform 0.2s;
            }
            .acu-graph-center-dropdown.open .acu-graph-center-trigger {
                border-color: var(--acu-accent);
            }
            .acu-graph-center-dropdown.open .fa-caret-down {
                transform: rotate(180deg);
            }
            .acu-graph-center-menu {
                display: none;
                position: absolute;
                top: calc(100% + 4px);
                left: 0;
                min-width: 100%;
                max-height: 200px;
                overflow-y: auto;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                z-index: 10;
            }
            .acu-graph-center-dropdown.open .acu-graph-center-menu {
                display: block;
            }
            .acu-center-option {
                padding: 6px 12px;
                font-size: 12px;
                color: var(--acu-text-main);
                cursor: pointer;
                white-space: nowrap;
                transition: background 0.15s;
            }
            .acu-center-option:hover {
                background: var(--acu-btn-hover);
            }
            .acu-center-option.active {
                color: var(--acu-accent);
                font-weight: bold;
            }
            .acu-graph-legend {
                display: flex;
                gap: 16px;
                justify-content: center;
                padding: 10px;
                border-top: 1px solid var(--acu-border);
                font-size: 12px;
                color: var(--acu-text-sub);
                flex-shrink: 0;
            }
            .acu-graph-view-controls {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;
            }
            .acu-graph-legend span {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .acu-graph-node-size-label {
                font-size: 11px;
                color: var(--acu-text-sub);
                white-space: nowrap;
            }
            .acu-zoom-display {
                background: var(--acu-btn-bg);
                padding: 2px 8px;
                border-radius: 4px;
                font-weight: bold;
                color: var(--acu-accent);
                min-width: 45px;
                text-align: center;
            }
            .acu-node-size-slider-container input[type="range"] {
                -webkit-appearance: none;
                appearance: none;
                height: 10px;
                border-radius: 5px;
                background: var(--acu-btn-bg);
                outline: none;
                cursor: pointer;
            }
            .acu-node-size-slider-container input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--acu-accent);
                cursor: pointer;
                border: 2px solid var(--acu-bg-panel);
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                transition: all 0.2s;
            }
            .acu-node-size-slider-container input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 3px 6px rgba(0,0,0,0.4);
            }
            .acu-node-size-slider-container input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--acu-accent);
                cursor: pointer;
                border: 2px solid var(--acu-bg-panel);
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                transition: all 0.2s;
            }
            .acu-node-size-slider-container input[type="range"]::-moz-range-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 3px 6px rgba(0,0,0,0.4);
            }
            .acu-node-size-slider-container input[type="range"]::-moz-range-track {
                height: 10px;
                border-radius: 5px;
                background: var(--acu-btn-bg);
            }
            @media (max-width: 768px) {
                .acu-relation-graph-container {
                    width: calc(100vw - 20px);
                    height: 80vh;
                    max-height: none;
                    border-radius: 12px;
                }
                .acu-relation-graph-container .acu-panel-header {
                    display: grid;
                    grid-template-columns: minmax(120px, 1fr) auto 34px 34px;
                    grid-template-areas:
                        "graph-heading . graph-help graph-close"
                        "graph-center graph-tools graph-relayout graph-avatar";
                    align-items: center;
                    gap: 8px;
                    padding: 10px;
                }
                .acu-graph-title {
                    display: contents;
                }
                .acu-graph-heading {
                    grid-area: graph-heading;
                    justify-self: start;
                }
                .acu-graph-heading-text {
                    display: inline;
                    font-size: 13px;
                    color: var(--acu-text-main);
                    white-space: nowrap;
                }
                .acu-graph-center-dropdown {
                    grid-area: graph-center;
                    min-width: 0;
                }
                .acu-graph-center-trigger {
                    width: 100%;
                    max-width: none;
                    justify-content: space-between;
                }
                .acu-graph-center-trigger .acu-center-label {
                    max-width: none;
                }
                .acu-graph-filter-controls {
                    grid-area: graph-tools;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-left: 0;
                    min-width: 0;
                    justify-self: start;
                }
                .acu-graph-actions {
                    display: contents;
                }
                .acu-graph-actions .acu-panel-tutorial-btn {
                    grid-area: graph-help;
                }
                .acu-graph-actions #graph-relayout {
                    grid-area: graph-relayout;
                }
                .acu-graph-actions #graph-manage-avatar {
                    grid-area: graph-avatar;
                }
                .acu-graph-actions .acu-graph-close {
                    grid-area: graph-close;
                }
                .acu-graph-legend {
                    gap: 8px;
                    flex-wrap: nowrap;
                    padding: 8px 6px;
                    overflow-x: auto;
                    justify-content: flex-start;
                }
                .acu-graph-view-controls {
                    min-width: max-content;
                }
            }

            /* ========== 地图可视化样式 ========== */
            .acu-map-overlay {
                background: rgba(0,0,0,0.8);
                z-index: 31100;
                backdrop-filter: blur(4px);
            }
            .acu-map-container {
                width: min(500px, calc(100vw - 24px));
                max-width: 500px;
                max-height: 85vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.45);
                box-sizing: border-box;
            }
            .acu-map-container .acu-panel-header {
                display: grid;
                grid-template-columns: auto minmax(0, 1fr) auto;
                align-items: center;
                gap: 8px;
            }
            .acu-map-title {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-accent);
                white-space: nowrap;
                flex-shrink: 0;
                min-width: 0;
            }
            .acu-map-actions {
                display: flex;
                gap: 6px;
                align-items: center;
                flex-shrink: 0;
            }
            .acu-map-actions button {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                border-radius: 6px;
                border: 1px solid var(--acu-border);
                background: var(--acu-btn-bg);
                color: var(--acu-text-sub);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s;
            }
            .acu-map-actions button:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
                border-color: var(--acu-accent);
            }
            .acu-map-back-btn {
                color: var(--acu-text-main);
            }
            .acu-map-body {
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding: 12px;
                overflow: hidden;
            }
            /* 焦点区域 - 3列Grid布局 */
            .acu-map-focus-area {
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                gap: 12px;
                align-items: center;
                border: 1px dashed var(--acu-border);
                border-radius: 12px;
                padding: 16px;
                background: var(--acu-btn-bg);
            }

            /* 侧翼 */
            .acu-map-wing {
                display: flex;
                flex-direction: column;
                gap: 12px;
                min-width: 0;
                align-self: flex-start; /* 侧翼顶部对齐 */
            }
            .acu-map-wing.left { align-items: flex-end; text-align: right; }
            .acu-map-wing.right { align-items: flex-start; text-align: left; }

            .acu-map-mobile-stack {
                display: none;
            }

            /* 头像组 */
            .acu-map-avatar-group {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                align-items: flex-start; /* 顶部对齐 */
                min-height: 70px; /* 确保有最小高度 */
            }
            .acu-map-wing.left .acu-map-avatar-group { justify-content: flex-end; }
            .acu-map-wing.right .acu-map-avatar-group { justify-content: flex-start; }

            /* 头像智能堆叠 */
            .acu-map-wing.left .acu-map-avatar:not(:last-child) { margin-right: -12px; }
            .acu-map-wing.right .acu-map-avatar:not(:first-child) { margin-left: -12px; }
            .acu-map-avatar:hover { transform: scale(1.1); z-index: 10; position: relative; }

            .acu-map-avatar {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                min-width: 56px;
                cursor: pointer;
                transition: transform var(--acu-motion-normal) var(--acu-ease-out);
            }
            .acu-map-avatar-circle {
                width: 46px;
                height: 46px;
                border-radius: 50%;
                border: 2px solid var(--acu-accent);
                background: var(--acu-btn-bg);
                background-size: cover;
                background-position: center;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--acu-text-sub);
                font-weight: bold;
                font-size: 16px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .acu-map-avatar-name {
                font-size: 11px;
                color: var(--acu-text-main);
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }

            /* 元素组 */
            .acu-map-element-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
                max-width: 140px;
            }
            .acu-map-element-chip {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border-radius: 6px;
                border: 1px solid var(--acu-border);
                background: var(--acu-bg-panel);
                font-size: 11px;
                color: var(--acu-text-main);
                cursor: pointer;
                transition: all 0.15s;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-map-element-chip:hover {
                border-color: var(--acu-accent);
                color: var(--acu-accent);
                transform: translateX(2px);
            }

            /* 中央舞台 */
            .acu-map-stage-center {
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 100px;
                z-index: 2;
                cursor: pointer;
            }

            /* 透明背景大号Emoji */
            .acu-map-location-emoji {
                background: transparent;
                border: none;
                width: auto;
                height: auto;
                font-size: 4rem;
                line-height: 1;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                transition: transform var(--acu-motion-normal) var(--acu-ease-out);
            }
            .acu-map-location-emoji:hover { transform: scale(1.1) rotate(5deg); }

            /* FA图标主题色继承 */
            .acu-map-location-emoji .acu-theme-icon,
            .acu-map-chip-emoji .acu-theme-icon,
            .acu-map-thumbnail-emoji .acu-theme-icon {
                color: var(--acu-accent);
                font-size: inherit;
            }

            /* 无emoji时的文字占位 */
            .acu-map-location-text {
                width: 64px;
                height: 64px;
                border-radius: 12px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                font-weight: bold;
                color: var(--acu-text-sub);
            }

            /* 地点名 */
            .acu-map-location-name {
                margin-top: 8px;
                font-weight: 700;
                font-size: 1.1em;
                max-width: 140px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: var(--acu-text-main);
            }

            /* 缩略图样式 */
            .acu-map-thumbnails {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 12px;
                max-height: 50vh;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 12px;
                box-sizing: border-box;
            }
            .acu-map-thumbnail {
                position: relative;
                border: 1px solid var(--acu-border);
                border-radius: 10px;
                padding: 8px;
                background: var(--acu-btn-bg);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                cursor: pointer;
                transition: all 0.15s;
            }
            .acu-map-thumbnail.active {
                border-color: var(--acu-accent);
                box-shadow: 0 0 0 1px var(--acu-accent);
            }
            .acu-map-thumbnail:focus-visible {
                outline: 2px solid var(--acu-focus-ring);
                outline-offset: 2px;
            }
            .acu-map-thumbnail:hover {
                border-color: var(--acu-accent);
                transform: translateY(-2px);
            }
            .acu-map-thumbnail-emoji {
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
            }
            .acu-map-thumbnail-placeholder {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background: var(--acu-bg-panel);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-text-sub);
                border: 1px solid var(--acu-border);
            }
            .acu-map-thumbnail-name { font-size: 11px; color: var(--acu-text-main); }

            /* 角标 */
            .acu-map-thumbnail-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                min-width: 22px;
                height: 22px;
                padding: 0 6px;
                border-radius: 99px;
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                font-size: 0.75rem;
                font-weight: 800;
                font-variant-numeric: tabular-nums;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 3px 6px rgba(0,0,0,0.25);
                border: 3px solid var(--acu-btn-bg);
                z-index: 10;
                transition: transform var(--acu-motion-fast) var(--acu-ease-out);
            }

            .acu-map-thumbnail:hover .acu-map-thumbnail-badge {
                transform: scale(1.1);
            }

            /* 地区标签页 */
            .acu-map-region-tabs {
                display: flex;
                flex-wrap: nowrap;
                gap: 4px;
                width: 100%;
                min-width: 0;
                overflow-x: auto;
                scroll-behavior: smooth;
                scrollbar-width: none;
            }
            .acu-map-region-tabs::-webkit-scrollbar {
                display: none;
            }
            .acu-map-overlay.acu-show-horizontal-scrollbar .acu-map-region-tabs {
                scrollbar-width: thin;
                scrollbar-color: var(--acu-scrollbar-thumb) var(--acu-scrollbar-track);
                padding-bottom: 6px;
            }
            .acu-map-overlay.acu-show-horizontal-scrollbar .acu-map-region-tabs::-webkit-scrollbar:horizontal {
                height: 8px;
                display: block;
            }
            .acu-map-overlay.acu-show-horizontal-scrollbar .acu-map-region-tabs::-webkit-scrollbar-track:horizontal {
                background: var(--acu-scrollbar-track);
                border-radius: 4px;
            }
            .acu-map-overlay.acu-show-horizontal-scrollbar .acu-map-region-tabs::-webkit-scrollbar-thumb:horizontal {
                background: var(--acu-scrollbar-thumb);
                border-radius: 4px;
            }
            .acu-map-region-tab {
                padding: 4px 10px;
                border-radius: 6px;
                border: 1px solid var(--acu-border);
                background: var(--acu-btn-bg);
                color: var(--acu-text-sub);
                font-size: 12px;
                cursor: pointer;
                transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
                min-height: 32px;
                white-space: nowrap;
            }
            .acu-map-region-tab.active,
            .acu-map-region-tab:hover {
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent);
            }

            .acu-map-empty {
                text-align: center;
                color: var(--acu-text-sub);
                font-size: 12px;
                padding: 8px 0;
            }
            .acu-map-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px;
                width: 100%;
            }
            .acu-map-loading-wide {
                grid-column: 1 / -1;
            }
            .acu-map-spinner {
                width: 32px;
                height: 32px;
                border: 3px solid var(--acu-border);
                border-top-color: var(--acu-accent);
                border-radius: 50%;
                animation: acu-map-spin 0.8s linear infinite;
            }
            @keyframes acu-map-spin { to { transform: rotate(360deg); } }
            @media (max-width: 768px) {
                .acu-map-container {
                    width: calc(100vw - 20px);
                    max-height: 92vh;
                }
                .acu-map-container .acu-panel-header {
                    grid-template-columns: auto minmax(0, 1fr) auto;
                    align-items: center;
                    gap: 6px;
                    padding: 10px;
                }
                .acu-map-title {
                    min-width: 0;
                }
                .acu-map-region-tab {
                    padding: 4px 9px;
                }
                .acu-map-actions {
                    justify-content: flex-end;
                }
                .acu-map-focus-area {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 16px 12px;
                    background: var(--acu-btn-bg);
                }
                .acu-map-stage-center {
                    width: 100%;
                    margin-bottom: 4px;
                    flex-direction: row;
                    justify-content: center;
                    gap: 12px;
                }
                .acu-map-location-emoji {
                    font-size: 2.5rem;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .acu-map-location-text {
                    width: 48px;
                    height: 48px;
                    font-size: 20px;
                }
                .acu-map-location-name {
                    margin-top: 0;
                    font-size: 1.25rem;
                    max-width: none;
                    text-align: left;
                    align-self: center;
                }
                .acu-map-wing {
                    display: none;
                }
                .acu-map-mobile-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    width: 100%;
                }
                .acu-map-mobile-avatars,
                .acu-map-mobile-elements {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 8px;
                    max-height: 168px;
                    overflow-y: auto;
                    padding: 2px 4px;
                }
                .acu-map-mobile-avatars:empty,
                .acu-map-mobile-elements:empty {
                    display: none;
                }
                .acu-map-avatar {
                    min-width: auto;
                    width: 52px;
                }
                .acu-map-avatar-circle {
                    width: 42px;
                    height: 42px;
                }
                .acu-map-element-chip {
                    font-size: 12px;
                    padding: 6px 10px;
                    background: var(--acu-bg-panel);
                }
                .acu-map-thumbnails {
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 10px;
                }
            }

`;
