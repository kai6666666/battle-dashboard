import type { DatabaseCssParams } from '../types';

export function buildPart02Layout(p: DatabaseCssParams): string {
  return `        /* ========== 模板预设工具栏统一样式 ========== */
        html body :is(${p.S_POPUP}) .acu-template-presets {
          border: 1px solid ${p.t.border} !important;
          background: ${p.t.bgPanel} !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08) !important;
        }

        html body :is(${p.S_POPUP}) .acu-template-preset-toolbar {
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
          align-items: stretch !important;
        }

        html body :is(${p.S_POPUP}) .acu-template-preset-toolbar .acu-template-preset-left {
          display: grid !important;
          grid-template-columns: minmax(220px, 1fr) auto auto !important;
          align-items: center !important;
          gap: 10px !important;
          width: 100% !important;
        }

        html body :is(${p.S_POPUP}) .acu-template-preset-toolbar .acu-template-preset-actions {
          display: grid !important;
          grid-template-columns: repeat(4, minmax(108px, 1fr)) !important;
          gap: 10px !important;
          width: 100% !important;
          align-items: stretch !important;
        }

        html body :is(${p.S_POPUP}) .acu-template-preset-toolbar :is(select.text_pole, [id$="-template-preset-select"]) {
          min-height: 44px !important;
        }

        html body :is(${p.S_POPUP}) .acu-mini-btn {
          min-height: 44px !important;
          padding: 10px 14px !important;
          border-radius: 10px !important;
          border: 1px solid ${p.t.border} !important;
          background: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          font-size: 15px !important;
          font-weight: 650 !important;
          letter-spacing: 0.1px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease !important;
        }

        html body :is(${p.S_POPUP}) .acu-mini-btn:hover {
          background: ${p.t.btnHover} !important;
          border-color: ${p.t.accent}66 !important;
          color: ${p.t.textMain} !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12) !important;
        }

        html body :is(${p.S_POPUP}) .acu-mini-btn:active {
          transform: translateY(0) scale(0.98) !important;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1) !important;
        }

        html body :is(${p.S_POPUP}) .acu-mini-btn.primary {
          background: ${p.t.btnActiveBg} !important;
          border-color: ${p.t.btnActiveBg} !important;
          color: ${p.t.btnActiveText} !important;
          box-shadow: 0 8px 20px ${p.t.accent}33 !important;
        }

        html body :is(${p.S_POPUP}) .acu-mini-btn.primary:hover {
          filter: brightness(1.08) !important;
        }

        html body :is(${p.S_POPUP}) button[id$="-template-preset-delete"].acu-mini-btn,
        html body :is(${p.S_POPUP}) .acu-mini-btn.danger {
          border-color: ${p.t.border} !important;
          background: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
        }

        html body :is(${p.S_POPUP}) button[id$="-data-isolation-save"].primary {
          min-height: 44px !important;
          padding: 10px 18px !important;
          white-space: nowrap !important;
          border-radius: 10px !important;
          background: ${p.t.textMain} !important;
          border-color: ${p.t.textMain} !important;
          color: ${p.t.bgPanel} !important;
          font-weight: 700 !important;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18) !important;
        }

        html body :is(${p.S_POPUP}) button[id$="-data-isolation-save"].primary:hover {
          background: ${p.t.accent} !important;
          border-color: ${p.t.accent} !important;
          color: ${p.t.btnActiveText} !important;
        }

        html body :is(${p.S_POPUP}) button[id$="-data-isolation-delete-entries"] {
          min-height: 42px !important;
          min-width: 280px !important;
          padding: 10px 18px !important;
          border-radius: 10px !important;
          border: 1px solid ${p.t.border} !important;
          background: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          font-weight: 650 !important;
          letter-spacing: 0.1px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
        }

        html body :is(${p.S_POPUP}) button[id$="-data-isolation-delete-entries"]:hover {
          background: ${p.t.btnHover} !important;
          border-color: ${p.t.accent}66 !important;
          color: ${p.t.textMain} !important;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12) !important;
          transform: translateY(-1px) !important;
          filter: none !important;
        }

        html body :is(${p.S_POPUP}) button[id$="-data-isolation-delete-entries"]:active {
          transform: translateY(0) scale(0.98) !important;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1) !important;
          filter: none !important;
        }

        /* Textarea resize 手柄样式 */
        html body .auto-card-updater-popup textarea::-webkit-resizer,
        html body :is(${p.S_POPUP}) textarea::-webkit-resizer {
          border-width: 8px !important;
          border-style: solid !important;
          border-color: transparent ${p.t.border} ${p.t.border} transparent !important;
        }

        /* ========== 禁用状态 ========== */
        html body .auto-card-updater-popup :is(input, select, textarea):disabled,
        html body :is(${p.S_POPUP}) :is(input, select, textarea):disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          background-color: ${p.t.bgNav} !important;
        }

        /* ========== Checkbox 强化覆盖 ========== */
        /* Checkbox Container (Group) */
        html body :is(${p.S_POPUP}) .checkbox-group {
          background-color: transparent !important;
          color: ${p.t.textMain} !important;
        }

        /* Checkbox Label */
        html body :is(${p.S_POPUP}) .checkbox-group label {
          color: ${p.t.textMain} !important;
        }

        /* Checkbox Input Element (统一自绘，压制酒馆主题/脚本自绘) */
        html body :is(${p.S_POPUP}) input[type="checkbox"],
        html body :is(${p.S_POPUP}) .checkbox-group input[type="checkbox"] {
          -webkit-appearance: none !important;
          appearance: none !important;
          width: 18px !important;
          height: 18px !important;
          min-width: 18px !important;
          min-height: 18px !important;
          border-radius: 5px !important;
          border: 1.5px solid ${p.t.border} !important;
          background-color: ${p.t.inputBg} !important;
          background-image: none !important;
          background-repeat: no-repeat !important;
          background-position: center !important;
          background-size: 12px 10px !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 2px 8px 2px 0 !important;
          cursor: pointer !important;
          vertical-align: middle !important;
          transition: all 0.2s ease !important;
        }
        html body :is(${p.S_POPUP}) input[type="checkbox"]::before,
        html body :is(${p.S_POPUP}) input[type="checkbox"]::after {
          content: none !important;
          display: none !important;
        }

        /* Checkbox hover effect */
        html body :is(${p.S_POPUP}) input[type="checkbox"]:hover {
          border-color: ${p.t.accent} !important;
          box-shadow: 0 0 0 3px ${p.t.accent}22 !important;
        }

        /* Checked State */
        html body :is(${p.S_POPUP}) input[type="checkbox"]:checked {
          background-color: ${p.t.accent} !important;
          border-color: ${p.t.accent} !important;
          background-image: none !important;
        }

        /* 设置区 checkbox 改为开关形态，降低重复勾选框噪声 */
        html body :is(${p.S_POPUP}) .checkbox-group {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 12px !important;
          padding: 10px 14px !important;
          border: 1px solid ${p.t.border} !important;
          border-radius: 12px !important;
          background: ${p.t.bgPanel} !important;
        }

        html body :is(${p.S_POPUP}) .checkbox-group > label {
          margin: 0 !important;
          flex: 1 1 auto !important;
          order: 1 !important;
          color: ${p.t.textMain} !important;
          font-size: 14px !important;
          font-weight: 650 !important;
          line-height: 1.45 !important;
          cursor: pointer !important;
        }

        html body :is(${p.S_POPUP}) .checkbox-group > input[type="checkbox"] {
          -webkit-appearance: none !important;
          appearance: none !important;
          order: 2 !important;
          margin: 0 0 0 10px !important;
          width: 42px !important;
          min-width: 42px !important;
          height: 24px !important;
          min-height: 24px !important;
          border-radius: 999px !important;
          border: 1.5px solid ${p.t.border} !important;
          background: ${p.t.inputBg} !important;
          background-image: none !important;
          position: relative !important;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08) !important;
        }

        html body :is(${p.S_POPUP}) .checkbox-group > input[type="checkbox"]::before {
          content: '' !important;
          display: block !important;
          position: absolute !important;
          top: 2px !important;
          left: 2px !important;
          width: 18px !important;
          height: 18px !important;
          border-radius: 50% !important;
          background: ${p.t.btnActiveText} !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.22) !important;
          transform: translateX(0) !important;
          transition: transform 0.18s ease, background-color 0.18s ease !important;
        }

        html body :is(${p.S_POPUP}) .checkbox-group > input[type="checkbox"]::after {
          content: none !important;
          display: none !important;
        }

        html body :is(${p.S_POPUP}) .checkbox-group > input[type="checkbox"]:checked {
          background: ${p.t.btnActiveBg} !important;
          border-color: ${p.t.btnActiveBg} !important;
          background-image: none !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
        }

        html body :is(${p.S_POPUP}) .checkbox-group > input[type="checkbox"]:checked::before {
          transform: translateX(18px) !important;
        }

        html body :is(${p.S_POPUP}) .checkbox-group > input[type="checkbox"]:focus-visible {
          outline: none !important;
          box-shadow: 0 0 0 3px ${p.t.accent}33 !important;
        }

        html body :is(${p.S_POPUP}) .checkbox-group > input[type="checkbox"]:disabled {
          opacity: 0.55 !important;
          cursor: not-allowed !important;
        }

        html body :is(${p.S_POPUP}) .checkbox-group:has(> input[type="checkbox"]:checked) {
          border-color: ${p.t.accent}66 !important;
          box-shadow: 0 0 0 1px ${p.t.accent}22 inset !important;
        }

`;
}
