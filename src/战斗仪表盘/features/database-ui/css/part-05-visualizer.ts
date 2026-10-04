import type { DatabaseCssParams } from '../types';

export function buildPart05Visualizer(p: DatabaseCssParams): string {
  return `        /* ========== 可视化编辑器 - 侧边栏导航 ========== */
        /* 侧边栏容器 */
        #acu-visualizer-content .acu-vis-sidebar {
          background: ${p.t.bgNav} !important;
          border-right: 1px solid ${p.t.border} !important;
          padding: 8px !important;
          overflow-y: auto !important;
        }

        /* 通配符: 侧边栏内所有按钮统一紧凑样式 - 防止触控优化导致按钮放大 */
        #acu-visualizer-content .acu-vis-sidebar button,
        #acu-visualizer-content [class*="acu-table-nav-"] button,
        #acu-visualizer-content [class*="acu-vis-del-"] {
          min-width: unset !important;
          min-height: unset !important;
          width: auto !important;
          height: auto !important;
          padding: 4px 6px !important;
          font-size: 12px !important;
          line-height: 1 !important;
          border-radius: 4px !important;
          background: ${p.t.btnBg} !important;
          color: ${p.t.textSub} !important;
          border: 1px solid ${p.t.border} !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          flex-shrink: 0 !important;
        }

        #acu-visualizer-content .acu-vis-sidebar button:hover,
        #acu-visualizer-content [class*="acu-table-nav-"] button:hover {
          background: ${p.t.btnHover} !important;
          color: ${p.t.textMain} !important;
        }

        /* 删除按钮悬停时变红色警告 */
        #acu-visualizer-content [class*="acu-vis-del-"]:hover {
          background: #ff4444 !important;
          color: #fff !important;
          border-color: #cc0000 !important;
        }

        /* Table Nav Item (default) */
        #acu-visualizer-content .acu-table-nav-item {
          background: transparent !important;
          color: ${p.t.textSub} !important;
          border: 1px solid transparent !important;
          padding: 6px 8px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 6px !important;
          border-radius: 6px !important;
          margin-bottom: 2px !important;
          font-size: 16px !important;
        }

        /* Table Nav Item (hover) */
        #acu-visualizer-content .acu-table-nav-item:hover {
          background: ${p.t.btnHover} !important;
          color: ${p.t.textMain} !important;
        }

        /* Table Nav Item (active) */
        #acu-visualizer-content .acu-table-nav-item.active {
          background: ${p.t.btnActiveBg} !important;
          color: ${p.t.btnActiveText} !important;
          border-color: ${p.t.btnActiveBg} !important;
        }

        /* 表格导航内容区 */
        #acu-visualizer-content .acu-table-nav-content {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          flex: 1 !important;
          min-width: 0 !important;
          overflow: hidden !important;
        }

        /* 表格导航操作按钮区 */
        #acu-visualizer-content .acu-table-nav-actions {
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          flex-shrink: 0 !important;
        }

        /* Table Name */
        #acu-visualizer-content .acu-table-name {
          font-weight: 500 !important;
          flex: 1 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }

        /* Table Index */
        #acu-visualizer-content .acu-table-index {
          font-size: 10px !important;
          color: ${p.t.textSub} !important;
          opacity: 0.7 !important;
        }

        /* 新增表格按钮 */
        #acu-visualizer-content .acu-add-table-btn {
          width: 100% !important;
          margin-top: 8px !important;
          padding: 8px 12px !important;
          background: ${p.t.accent} !important;
          color: ${p.t.btnActiveText} !important;
          border: none !important;
          border-radius: 6px !important;
          font-size: 12px !important;
          cursor: pointer !important;
          min-width: unset !important;
          min-height: unset !important;
        }

        #acu-visualizer-content .acu-add-table-btn:hover {
          filter: brightness(1.1) !important;
        }

        /* 表格导航按钮 - 透明背景（使用更广泛的选择器） */
        .acu-table-order-btn,
        .acu-vis-del-table-btn,
        .acu-vis-sidebar .acu-table-order-btn,
        .acu-vis-sidebar .acu-vis-del-table-btn,
        .acu-table-nav-actions .acu-table-order-btn,
        .acu-table-nav-actions .acu-vis-del-table-btn,
        #acu-visualizer-content .acu-table-order-btn,
        #acu-visualizer-content .acu-vis-del-table-btn {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          color: ${p.t.textSub} !important;
          opacity: 0.7 !important;
        }

        .acu-table-order-btn:hover,
        .acu-vis-del-table-btn:hover,
        .acu-vis-sidebar .acu-table-order-btn:hover,
        .acu-vis-sidebar .acu-vis-del-table-btn:hover,
        .acu-table-nav-actions .acu-table-order-btn:hover,
        .acu-table-nav-actions .acu-vis-del-table-btn:hover,
        #acu-visualizer-content .acu-table-order-btn:hover,
        #acu-visualizer-content .acu-vis-del-table-btn:hover {
          background: ${p.t.btnHover} !important;
          background-color: ${p.t.btnHover} !important;
          color: ${p.t.textMain} !important;
          opacity: 1 !important;
        }

        .acu-table-order-btn:disabled,
        #acu-visualizer-content .acu-table-order-btn:disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }

        /* 可视化编辑器 - 滚动条与响应式 */
        /* Scrollbar Styles */
        #acu-visualizer-content ::-webkit-scrollbar {
          width: 8px !important;
          height: 8px !important;
        }

        #acu-visualizer-content ::-webkit-scrollbar-track {
          background: ${p.t.bgNav} !important;
          border-radius: 4px !important;
        }

        #acu-visualizer-content ::-webkit-scrollbar-thumb {
          background: ${p.t.btnBg} !important;
          border-radius: 4px !important;
          border: 2px solid ${p.t.bgNav} !important;
        }

        #acu-visualizer-content ::-webkit-scrollbar-thumb:hover {
          background: ${p.t.btnHover} !important;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          /* 工具栏响应式 - 垂直堆叠布局 */
          #acu-visualizer-content .acu-vis-toolbar {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 6px !important;
            gap: 4px !important;
          }

          #acu-visualizer-content .acu-mode-switch {
            width: 100% !important;
            justify-content: center !important;
          }

          #acu-visualizer-content .acu-mode-btn {
            flex: 1 !important;
            text-align: center !important;
            padding: 6px 8px !important;
            min-height: 32px !important;
          }

          #acu-visualizer-content .acu-vis-actions {
            width: 100% !important;
            justify-content: center !important;
          }

          #acu-visualizer-content .acu-btn-primary,
          #acu-visualizer-content .acu-btn-secondary {
            flex: 1 !important;
            text-align: center !important;
            padding: 6px 10px !important;
            min-height: 32px !important;
          }

          #acu-visualizer-content .acu-vis-header {
            flex-direction: column !important;
            height: auto !important;
            padding: 10px !important;
          }

          #acu-visualizer-content .acu-vis-sidebar {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid ${p.t.border} !important;
            max-height: 200px !important;
            overflow-y: auto !important;
          }

          #acu-visualizer-content .acu-vis-content {
            flex-direction: column !important;
          }

          #acu-visualizer-content .acu-card-grid {
            grid-template-columns: 1fr !important;
            padding: 12px !important;
            gap: 16px !important;
          }

          /* 移动端卡片简化动画 */
          #acu-visualizer-content .acu-data-card {
            border-radius: 10px !important;
          }

          #acu-visualizer-content .acu-data-card:hover {
            transform: none !important;
          }

          #acu-visualizer-content .acu-data-card::before {
            display: none !important;
          }

          #acu-visualizer-content .acu-card-header {
            padding: 12px 14px !important;
            border-radius: 10px 10px 0 0 !important;
          }

          #acu-visualizer-content .acu-card-body {
            padding: 14px !important;
            border-radius: 0 0 10px 10px !important;
          }

          #acu-visualizer-content .acu-field-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          #acu-visualizer-content .acu-field-label {
            min-width: unset !important;
            width: 100% !important;
            padding-bottom: 4px !important;
          }

          #acu-visualizer-content .acu-vis-actions {
            justify-content: center !important;
            width: 100% !important;
            margin-top: 10px !important;
          }

          /* 移动端通用按钮触控优化 */
          html body .auto-card-updater-popup button,
          html body .auto-card-updater-popup .button {
            min-height: 44px !important;
            padding: 10px 16px !important;
          }

          /* 移动端禁用 transform 动画以提升性能 */
          html body .auto-card-updater-popup button:hover,
          html body .auto-card-updater-popup .button:hover {
            transform: none !important;
          }

          html body .auto-card-updater-popup button:active,
          html body .auto-card-updater-popup .button:active {
            transform: scale(0.98) !important;
          }

          html body :is(${p.S_POPUP}) [id$="-data-isolation-input-area"] > div {
            flex-direction: column !important;
          }

          html body :is(${p.S_POPUP}) button[id$="-data-isolation-save"].primary {
            width: 100% !important;
          }

          html body :is(${p.S_POPUP}) button[id$="-data-isolation-history-toggle"] {
            width: 36px !important;
            min-width: 36px !important;
            height: 36px !important;
            min-height: 36px !important;
          }

          html body :is(${p.S_POPUP}) button[id$="-data-isolation-delete-entries"] {
            width: 100% !important;
            min-width: 0 !important;
          }

          html body :is(${p.S_POPUP}) .acu-template-preset-toolbar .acu-template-preset-left {
            grid-template-columns: 1fr !important;
          }

          html body :is(${p.S_POPUP}) .acu-template-preset-toolbar .acu-template-preset-actions {
            grid-template-columns: 1fr 1fr !important;
          }

          html body :is(${p.S_POPUP}) .acu-mini-btn {
            width: 100% !important;
          }

          html body :is(${p.S_POPUP}) :is(button[id$="-plot-start-loop-btn"], button[id$="-plot-stop-loop-btn"]) {
            width: 100% !important;
          }
        }

        /* 可视化编辑器 - 列编辑器 */
        /* Column List */
        #acu-visualizer-content .acu-col-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          padding: 8px 0 !important;
        }

        /* Column Item */
        #acu-visualizer-content .acu-col-item {
          background: ${p.t.btnBg} !important;
          border: 1px solid ${p.t.border} !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          transition: all 0.2s ease !important;
        }

        #acu-visualizer-content .acu-col-item:hover {
          background: ${p.t.btnHover} !important;
        }

        /* Column Input */
        #acu-visualizer-content .acu-col-input {
          background-color: ${p.t.inputBg} !important;
          background: ${p.t.inputBg} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
          padding: 6px 10px !important;
          border-radius: 4px !important;
          flex: 1 !important;
          font-size: 13px !important;
        }

        #acu-visualizer-content .acu-col-input:focus {
          border-color: ${p.t.accent} !important;
          outline: none !important;
        }

        /* Column Delete Button */
        #acu-visualizer-content .acu-col-btn {
          background: ${p.t.btnBg} !important;
          color: ${p.t.textSub} !important;
          border: 1px solid ${p.t.border} !important;
          padding: 4px 8px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        #acu-visualizer-content .acu-col-btn:hover {
          background: #ff4444 !important;
          color: #fff !important;
          border-color: #cc0000 !important;
        }
`;
}
