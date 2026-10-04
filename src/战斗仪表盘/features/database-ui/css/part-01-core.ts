import type { DatabaseCssParams } from '../types';

export function buildPart01Core(p: DatabaseCssParams): string {
  return `        /* Native theme bridge: feed the new God-DB theme variables first. */
        html body :is(${p.S_POPUP_MAIN}),
        html body .acu-window {
          --acu-bg-0: ${p.t.bgPanel} !important;
          --acu-bg-1: ${p.t.bgNav} !important;
          --acu-bg-2: ${p.t.btnBg} !important;
          --acu-border: ${p.t.border} !important;
          --acu-border-2: ${p.t.border} !important;
          --acu-text-1: ${p.t.textMain} !important;
          --acu-text-2: ${p.t.textSub} !important;
          --acu-text-3: ${p.t.textSub} !important;
          --acu-accent: ${p.t.accent} !important;
          --acu-accent-2: ${p.t.btnActiveBg} !important;
          --acu-accent-glow: ${p.t.accent}1a !important;
          --acu-control-bg: ${p.t.inputBg} !important;
          --acu-control-text: ${p.t.textMain} !important;
          --acu-panel-bg: ${p.t.bgPanel} !important;
          --acu-panel-border: ${p.t.border} !important;
          --acu-panel-text: ${p.t.textMain} !important;
          --acu-panel-text-dim: ${p.t.textSub} !important;
          --acu-panel-text-mute: ${p.t.textSub} !important;
          --acu-panel-accent: ${p.t.accent} !important;
          color-scheme: ${p.stepperColorScheme} !important;
        }
        html body #acu-visualizer-content {
          --acu-viz-bg: ${p.t.bgPanel} !important;
          --acu-viz-sidebar-bg: ${p.t.bgNav} !important;
          --acu-viz-card-bg: ${p.t.inputBg} !important;
          --acu-viz-border: ${p.t.border} !important;
          --acu-viz-text: ${p.t.textMain} !important;
          --acu-viz-text-dim: ${p.t.textSub} !important;
          --acu-viz-text-mute: ${p.t.textSub} !important;
          --acu-viz-accent: ${p.t.accent} !important;
          --acu-viz-accent-dim: ${p.t.btnActiveBg} !important;
          --acu-viz-hover: ${p.t.btnHover} !important;
        }
        html body #toast-container .acu-toast.toast {
          --toast-accent: ${p.t.accent} !important;
          --toast-bg: ${p.t.bgPanel} !important;
          --toast-text: ${p.t.textMain} !important;
          --toast-border: ${p.t.border} !important;
        }
        html body .auto-card-updater-popup {
          --acu-bg-0: ${p.t.bgPanel} !important;
          --acu-bg-1: ${p.t.bgNav} !important;
          --acu-bg-2: ${p.t.btnBg} !important;
          --acu-border: ${p.t.border} !important;
          --acu-border-2: ${p.t.border} !important;
          --acu-text-1: ${p.t.textMain} !important;
          --acu-text-2: ${p.t.textSub} !important;
          --acu-text-3: ${p.t.textSub} !important;
          --acu-accent: ${p.t.accent} !important;
          --acu-accent-glow: ${p.t.accent}1a !important;
        }
        /* ========== 按钮系统美化 ========== */
        html body .auto-card-updater-popup button,
        html body .auto-card-updater-popup .button {
          background: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
        }
        
        /* 普通按钮悬停效果 */
        html body .auto-card-updater-popup button:hover,
        html body .auto-card-updater-popup .button:hover {
          background: ${p.t.btnHover} !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        
        /* 普通按钮点击效果 */
        html body .auto-card-updater-popup button:active,
        html body .auto-card-updater-popup .button:active {
          transform: translateY(0) scale(0.98) !important;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1) !important;
          transition-duration: 0.1s !important;
        }
        
        /* Primary 按钮 - 更强的视觉权重 */
        html body .auto-card-updater-popup button.primary,
        html body .auto-card-updater-popup .button.primary {
          background: ${p.t.btnActiveBg} !important;
          color: ${p.t.btnActiveText} !important;
          border-color: ${p.t.btnActiveBg} !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 8px ${p.t.accent}33 !important;
        }
        
        /* Primary 按钮悬停效果 */
        html body .auto-card-updater-popup button.primary:hover,
        html body .auto-card-updater-popup .button.primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px ${p.t.accent}44 !important;
          filter: brightness(1.1) !important;
        }
        
        /* Primary 按钮点击效果 */
        html body .auto-card-updater-popup button.primary:active,
        html body .auto-card-updater-popup .button.primary:active {
          transform: translateY(0) scale(0.98) !important;
          box-shadow: 0 2px 8px ${p.t.accent}22 !important;
          filter: brightness(0.95) !important;
        }
        
        /* 禁用状态按钮 */
        html body .auto-card-updater-popup button:disabled,
        html body .auto-card-updater-popup .button:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          transform: none !important;
          box-shadow: none !important;
        }
        /* button-group 内按钮 - 继承基础样式即可，不需要重复定义 */
        html body :is(${p.S_POPUP}) .button-group.acu-data-mgmt-buttons button,
        html body :is(${p.S_POPUP}) .button-group.acu-data-mgmt-buttons .button {
          background: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
        }
        html body :is(${p.S_POPUP}) .button-group.acu-data-mgmt-buttons button:hover,
        html body :is(${p.S_POPUP}) .button-group.acu-data-mgmt-buttons .button:hover {
          background: ${p.t.btnHover} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup code,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup code {
          background-color: ${p.t.inputBg} !important;
          background: ${p.t.inputBg} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
          border-left: 2px solid ${p.t.accent} !important;
        }
        html body :is(${p.S_POPUP}) table thead th,
        html body :is(${p.S_POPUP}) table th {
          background: ${p.t.btnActiveBg} !important;
          color: ${p.t.btnActiveText} !important;
          border-color: ${p.t.border} !important;
        }

        /* ========== 弹窗容器美化 ========== */
        html body :is(${p.S_ALL_WINDOWS}) {
          border-radius: 16px !important;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px ${p.t.border},
            0 0 40px -10px ${p.t.accent}33 !important;
          animation: acu-db-popup-enter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }

        @keyframes acu-db-popup-enter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* ========== 头部样式 (使用 :is() 简化选择器) ========== */
        html body :is(${p.S_POPUP_MAIN}) {
          padding-top: 0 !important;
        }

        html body :is(${p.S_POPUP_MAIN}) .acu-layout {
          margin-top: 0 !important;
        }

        html body :is(${p.S_ALL_WINDOWS}) .acu-window-header {
          background: linear-gradient(135deg, ${p.t.bgNav} 0%, ${p.t.bgPanel} 100%) !important;
          border-bottom: 1px solid ${p.t.border} !important;
          color: ${p.t.textMain} !important;
          padding: 14px 18px !important;
          position: relative !important;
          margin: 0 !important;
          z-index: 32012 !important;
        }

        /* 头部底部高光线 */
        html body :is(${p.S_ALL_WINDOWS}) .acu-window-header::after {
          content: '' !important;
          position: absolute !important;
          bottom: 0 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 60% !important;
          height: 1px !important;
          background: linear-gradient(90deg, transparent, ${p.t.accent}66, transparent) !important;
        }

        /* 标题文字 */
        html body :is(${p.S_ALL_WINDOWS}) .acu-window-title,
        html body :is(${p.S_ALL_WINDOWS}) .acu-window-title span {
          color: ${p.t.textMain} !important;
          font-weight: 600 !important;
          letter-spacing: 0.3px !important;
        }

        /* 标题图标 */
        html body :is(${p.S_ALL_WINDOWS}) .acu-window-title i {
          color: ${p.t.accent} !important;
          transition: transform 0.3s ease, color 0.2s ease !important;
        }

        /* 标题图标悬停动画 */
        html body :is(${p.S_ALL_WINDOWS}) .acu-window-header:hover .acu-window-title i {
          transform: rotate(15deg) scale(1.1) !important;
        }

        /* 窗口按钮 */
        html body :is(${p.S_ALL_WINDOWS}) .acu-window-btn {
          background: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        html body :is(${p.S_ALL_WINDOWS}) .acu-window-btn:hover {
          background: ${p.t.btnHover} !important;
          color: ${p.t.textMain} !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }

        html body :is(${p.S_ALL_WINDOWS}) .acu-window-btn.close:hover {
          background: ${p.t.btnActiveBg} !important;
          color: ${p.t.btnActiveText} !important;
          box-shadow: 0 2px 12px ${p.t.accent}44 !important;
        }

        html body :is(${p.S_POPUP}) .acu-stepper {
          background-color: ${p.t.inputBg} !important;
          border-color: ${p.t.border} !important;
        }
        html body :is(${p.S_POPUP}) .acu-stepper-btn {
          background-color: ${p.t.btnBg} !important;
          color: ${p.t.textSub} !important;
        }
        html body :is(${p.S_POPUP}) .acu-stepper-btn:hover {
          background-color: ${p.t.btnHover} !important;
          color: ${p.t.accent} !important;
        }
        html body :is(${p.S_POPUP}) .acu-stepper-btn:active {
          background-color: ${p.t.btnActiveBg} !important;
          color: ${p.t.btnActiveText} !important;
        }
        html body :is(${p.S_POPUP}) .acu-stepper-value {
          background-color: ${p.t.inputBg} !important;
          color: ${p.t.textMain} !important;
          border-left: 1px solid ${p.t.border} !important;
          border-right: 1px solid ${p.t.border} !important;
        }
        html body :is(${p.S_POPUP}) input[type="number"] {
          color-scheme: ${p.stepperColorScheme} !important;
        }
        html body :is(${p.S_POPUP}) input[type="number"]::-webkit-inner-spin-button,
        html body :is(${p.S_POPUP}) input[type="number"]::-webkit-outer-spin-button {
          filter: ${p.stepperSpinFilter} !important;
          opacity: ${p.stepperSpinOpacity} !important;
        }
        /* ========== 表单控件美化 ========== */
        html body .auto-card-updater-popup :is(input, select, textarea),
        html body :is(${p.S_POPUP}) :is(input, select, textarea) {
          background-color: ${p.t.inputBg} !important;
          background: ${p.t.inputBg} !important;
          background-image: none !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
          border-color: ${p.t.border} !important;
          box-shadow: none !important;
          text-shadow: none !important;
          border-radius: 6px !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
        }

        /* 输入框聚焦效果 - 增强版 */
        html body .auto-card-updater-popup :is(input, select, textarea):focus,
        html body :is(${p.S_POPUP}) :is(input, select, textarea):focus {
          border-color: ${p.t.accent} !important;
          box-shadow: 0 0 0 3px ${p.t.accent}22, 0 2px 8px rgba(0, 0, 0, 0.08) !important;
          outline: none !important;
        }

        /* 输入框悬停效果 */
        html body .auto-card-updater-popup :is(input, select, textarea):hover:not(:focus),
        html body :is(${p.S_POPUP}) :is(input, select, textarea):hover:not(:focus) {
          border-color: ${p.t.accent}66 !important;
        }

        /* 修复 placeholder 颜色 */
        html body .auto-card-updater-popup :is(input, textarea)::placeholder,
        html body :is(${p.S_POPUP}) :is(input, textarea)::placeholder {
          color: ${p.t.textSub} !important;
          opacity: 0.6 !important;
          transition: opacity 0.2s ease !important;
        }

        /* placeholder 聚焦时淡化 */
        html body .auto-card-updater-popup :is(input, textarea):focus::placeholder,
        html body :is(${p.S_POPUP}) :is(input, textarea):focus::placeholder {
          opacity: 0.4 !important;
        }

        /* ========== Select 下拉框美化 ========== */
        html body .auto-card-updater-popup select,
        html body :is(${p.S_POPUP}) select {
          appearance: none !important;
          -webkit-appearance: none !important;
          padding-right: 36px !important;
          cursor: pointer !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 12px !important;
        }

        /* Select 悬停时箭头颜色变化 */
        html body .auto-card-updater-popup select:hover,
        html body :is(${p.S_POPUP}) select:hover {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${encodeURIComponent(p.t.accent)}' d='M6 8L1 3h10z'/%3E%3C/svg%3E") !important;
        }

        /* ========== Textarea 美化 ========== */
        html body .auto-card-updater-popup textarea,
        html body :is(${p.S_POPUP}) textarea {
          min-height: 80px !important;
          resize: vertical !important;
          line-height: 1.5 !important;
        }

        /* ========== 数据隔离区专用布局修复 ========== */
        html body :is(${p.S_POPUP}) [id$="-data-isolation-input-area"] {
          margin-top: 12px !important;
        }

        html body :is(${p.S_POPUP}) [id$="-data-isolation-input-area"] > div {
          display: flex !important;
          align-items: stretch !important;
          gap: 12px !important;
          margin-top: 8px !important;
        }

        html body :is(${p.S_POPUP}) [id$="-data-isolation-combo"] {
          position: relative !important;
          flex: 1 1 auto !important;
          min-width: 0 !important;
          display: block !important;
        }

        html body :is(${p.S_POPUP}) [id$="-data-isolation-code"] {
          width: 100% !important;
          min-height: 44px !important;
          padding-right: 52px !important;
        }

        html body :is(${p.S_POPUP}) button[id$="-data-isolation-history-toggle"] {
          position: absolute !important;
          right: 8px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: 34px !important;
          min-width: 34px !important;
          height: 34px !important;
          min-height: 34px !important;
          padding: 0 !important;
          border-radius: 8px !important;
          border: 1px solid ${p.t.border} !important;
          background: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          line-height: 1 !important;
          font-size: 13px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: none !important;
          z-index: 2 !important;
        }

        html body :is(${p.S_POPUP}) button[id$="-data-isolation-history-toggle"]:hover {
          background: ${p.t.btnHover} !important;
          color: ${p.t.accent} !important;
          transform: translateY(-50%) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14) !important;
        }

        html body :is(${p.S_POPUP}) [id$="-data-isolation-history-list"] {
          margin: 0 !important;
          padding: 6px !important;
          border-radius: 10px !important;
          border: 1px solid ${p.t.border} !important;
          background: ${p.t.bgPanel} !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18) !important;
          max-height: 240px !important;
          z-index: 32030 !important;
        }

        html body :is(${p.S_POPUP}) [id$="-data-isolation-history-list"] li {
          color: ${p.t.textMain} !important;
          border-radius: 6px !important;
        }

        html body :is(${p.S_POPUP}) [id$="-data-isolation-history-list"] li:hover {
          background: ${p.t.btnHover} !important;
        }

`;
}
