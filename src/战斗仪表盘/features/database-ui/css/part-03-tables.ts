import type { DatabaseCssParams } from '../types';

export function buildPart03Tables(p: DatabaseCssParams): string {
  return `        /* ========== 表头样式增强 ========== */
        html body .auto-card-updater-popup :is(th, thead th),
        html body :is(${p.S_POPUP}) table thead th,
        html body :is(${p.S_POPUP}) table th {
          color: ${p.t.btnActiveText} !important;
          background: linear-gradient(135deg, ${p.t.btnActiveBg} 0%, ${p.t.accent} 100%) !important;
          background-color: ${p.t.btnActiveBg} !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          font-size: 12px !important;
          letter-spacing: 0.5px !important;
          padding: 12px 14px !important;
          border: none !important;
          border-bottom: 2px solid ${p.t.accent} !important;
          position: relative !important;
        }

        /* 表头首列圆角 */
        html body .auto-card-updater-popup table thead th:first-child,
        html body :is(${p.S_POPUP}) table thead th:first-child {
          border-top-left-radius: 8px !important;
        }

        /* 表头末列圆角 */
        html body .auto-card-updater-popup table thead th:last-child,
        html body :is(${p.S_POPUP}) table thead th:last-child {
          border-top-right-radius: 8px !important;
        }

        /* ========== Status & Messages Display 状态与消息显示 ========== */
        html body .auto-card-updater-popup span[id$="-status-display"],
        html body .auto-card-updater-popup span[id$="-messages-display"],
        html body .auto-card-updater-popup p.notes,
        html body :is(${p.S_POPUP}) span[id$="-status-display"],
        html body :is(${p.S_POPUP}) span[id$="-messages-display"],
        html body :is(${p.S_POPUP}) p.notes,
        html body span[id$="-card-update-status-display"],
        html body span[id$="-total-messages-display"],
        html body [id$="-status-message"] {
          display: block !important;
          background-color: var(--acu-bg-2) !important;
          color: var(--acu-text-1) !important;
          border: 1px solid var(--acu-border) !important;
          border-radius: 8px !important;
          padding: 10px 14px !important;
          margin: 10px 0 !important;
          font-size: 13px !important;
          line-height: 1.5 !important;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.08) !important;
          word-break: break-all !important;
        }

        html body .auto-card-updater-popup span[id$="-status-display"] b,
        html body :is(${p.S_POPUP}) span[id$="-status-display"] b,
        html body span[id$="-card-update-status-display"] b {
          color: var(--acu-accent) !important;
          font-weight: 600 !important;
        }

        html body .auto-card-updater-popup span[id$="-status-display"] *:not(b):not([style*="color"]),
        html body :is(${p.S_POPUP}) span[id$="-status-display"] *:not(b):not([style*="color"]),
        html body span[id$="-card-update-status-display"] *:not(b):not([style*="color"]) {
          color: inherit !important;
        }

        /* ========== 表格行样式增强 ========== */
        html body .auto-card-updater-popup table tbody tr {
          background-color: ${p.t.bgPanel} !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* 斑马纹效果 */
        html body .auto-card-updater-popup table tbody tr:nth-child(even) {
          background-color: ${p.t.bgNav} !important;
        }

        /* 行悬停效果 */
        html body .auto-card-updater-popup table tbody tr:hover {
          background-color: ${p.t.btnHover} !important;
          box-shadow: inset 3px 0 0 ${p.t.accent} !important;
        }

        /* 单元格样式 */
        html body .auto-card-updater-popup table tbody td {
          color: ${p.t.textMain} !important;
          padding: 10px 14px !important;
          border-bottom: 1px solid ${p.t.border} !important;
          border-left: none !important;
          border-right: none !important;
          border-top: none !important;
          vertical-align: middle !important;
        }

        /* 最后一行无底边框 */
        html body .auto-card-updater-popup table tbody tr:last-child td {
          border-bottom: none !important;
        }

        /* ========== 表格容器美化 ========== */
        html body .auto-card-updater-popup table,
        html body :is(${p.S_POPUP}) table {
          table-layout: fixed !important;
          width: 100% !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          border: 1px solid ${p.t.border} !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
        }

        html body .auto-card-updater-popup table :is(thead, tbody, tr),
        html body :is(${p.S_POPUP}) table :is(thead, tbody, tr) {
          width: 100% !important;
          box-sizing: border-box !important;
        }

        /* 单元格基础样式 */
        html body .auto-card-updater-popup table :is(th, td),
        html body :is(${p.S_POPUP}) table :is(th, td),
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table th,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table td {
          text-align: left !important;
          padding: 10px 14px !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          box-sizing: border-box !important;
        }

        /* 第一列（名称列）左对齐 */
        html body .auto-card-updater-popup table :is(th, td):first-child,
        html body :is(${p.S_POPUP}) table :is(th, td):first-child {
          text-align: left !important;
          width: 25% !important;
        }

        /* 中间列居中对齐 */
        html body .auto-card-updater-popup table :is(th, td):not(:first-child):not(:last-child),
        html body :is(${p.S_POPUP}) table :is(th, td):not(:first-child):not(:last-child) {
          text-align: center !important;
          width: calc((100% - 25%) / 4) !important;
        }

        /* 最后一列（操作列）居中 */
        html body .auto-card-updater-popup table :is(th, td):last-child,
        html body :is(${p.S_POPUP}) table :is(th, td):last-child {
          text-align: center !important;
          width: 25% !important;
        }

        /* ========== Mobile Responsive 移动端适配 ========== */
        @media (max-width: 768px) {
          html body .auto-card-updater-popup table,
          html body :is(${p.S_POPUP}) table {
            font-size: 0.85em !important;
            box-shadow: none !important;
          }

          html body .auto-card-updater-popup table :is(th, td),
          html body :is(${p.S_POPUP}) table :is(th, td) {
            padding: 8px 10px !important;
          }

          /* 移动端表头样式简化 */
          html body .auto-card-updater-popup table thead th,
          html body :is(${p.S_POPUP}) table thead th {
            padding: 10px 8px !important;
            font-size: 11px !important;
          }

          /* 移动端弹窗入场动画优化 */
          html body :is(${p.S_ALL_WINDOWS}) {
            animation: acu-db-popup-enter-mobile 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
        }

        @keyframes acu-db-popup-enter-mobile {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ========== Radio group 单选按钮组 ========== */
        html body :is(${p.S_POPUP}) .qrf_radio_group {
          background-color: ${p.t.btnBg} !important;
          background: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
          border-radius: 8px !important;
          padding: 10px 14px !important;
        }

        html body :is(${p.S_POPUP}) .qrf_radio_group :is(label, span) {
          color: ${p.t.textMain} !important;
        }

        html body :is(${p.S_POPUP}) input[type="radio"] {
          -webkit-appearance: none !important;
          appearance: none !important;
          box-sizing: border-box !important;
          width: 18px !important;
          height: 18px !important;
          min-width: 18px !important;
          min-height: 18px !important;
          padding: 0 !important;
          margin: 0 8px 0 0 !important;
          border-radius: 50% !important;
          border: 1.5px solid ${p.t.border} !important;
          background-color: ${p.t.inputBg} !important;
          box-shadow: none !important;
          position: relative !important;
          cursor: pointer !important;
          flex-shrink: 0 !important;
          vertical-align: middle !important;
          transition: all 0.2s ease !important;
        }

        html body :is(${p.S_POPUP}) input[type="radio"]:hover {
          border-color: ${p.t.accent} !important;
          box-shadow: 0 0 0 3px ${p.t.accent}22 !important;
        }

        html body :is(${p.S_POPUP}) input[type="radio"]:checked {
          border-color: ${p.t.accent} !important;
        }

        html body :is(${p.S_POPUP}) input[type="radio"]:checked::after {
          content: '' !important;
          position: absolute !important;
          width: 10px !important;
          height: 10px !important;
          border-radius: 50% !important;
          background: ${p.t.accent} !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
        }

`;
}
