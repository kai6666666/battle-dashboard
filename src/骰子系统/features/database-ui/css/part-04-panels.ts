import type { DatabaseCssParams } from '../types';

export function buildPart04Panels(p: DatabaseCssParams): string {
  return `        /* ========== Worldbook entry list 世界书条目列表 ========== */
        html body :is(${p.S_POPUP}) .qrf_worldbook_entry_list,
        html body :is(${p.S_POPUP}) [class*="worldbook-entry-list"] {
          background-color: ${p.t.btnBg} !important;
          background: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
          border-radius: 8px !important;
        }

        html body :is(${p.S_POPUP}) .qrf_worldbook_entry_list :is(label, span, div) {
          color: ${p.t.textMain} !important;
        }

        /* ========== Plot prompt segment ========== */
        html body :is(${p.S_POPUP}) :is(textarea.plot-prompt-segment-content, .plot-prompt-segment-content) {
          background-color: ${p.t.inputBg} !important;
          background: ${p.t.inputBg} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
        }

        html body :is(${p.S_POPUP}) .plot-prompt-segment {
          background-color: ${p.t.bgPanel} !important;
          background: ${p.t.bgPanel} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
          border-radius: 8px !important;
        }

        /* ========== 剧情推进区专属修复 ========== */
        html body :is(${p.S_POPUP}) #acu-tab-plot .acu-card > div:first-child {
          display: flex !important;
          align-items: flex-start !important;
          justify-content: space-between !important;
          gap: 14px !important;
          flex-wrap: wrap !important;
        }

        html body :is(${p.S_POPUP}) #acu-tab-plot .acu-card > div:first-child > div:first-child {
          flex: 1 1 360px !important;
          min-width: 0 !important;
        }

        html body :is(${p.S_POPUP}) #acu-tab-plot .acu-card > div:first-child > div:first-child > p.notes {
          display: block !important;
          margin: 6px 0 0 0 !important;
          padding: 0 !important;
          border: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          color: ${p.t.textSub} !important;
          font-size: 13px !important;
          line-height: 1.45 !important;
          word-break: normal !important;
        }

        html body :is(${p.S_POPUP}) #acu-tab-plot .acu-card > div:first-child > div:nth-child(2) {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          flex: 0 0 auto !important;
          white-space: nowrap !important;
        }

        html body :is(${p.S_POPUP}) :is(button[id$="-plot-start-loop-btn"], button[id$="-plot-stop-loop-btn"]) {
          writing-mode: horizontal-tb !important;
          text-orientation: mixed !important;
          white-space: nowrap !important;
          word-break: keep-all !important;
          min-width: 148px !important;
          width: auto !important;
          max-width: 100% !important;
          padding: 12px 22px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
        }

        html body :is(${p.S_POPUP}) :is(button[id$="-plot-start-loop-btn"], button[id$="-plot-stop-loop-btn"]) i {
          flex-shrink: 0 !important;
        }

        /* ========== Toggle switch ========== */
        /* 内部 checkbox 维持隐藏 */
        html body :is(${p.S_POPUP}) .toggle-switch input[type="checkbox"] {
          -webkit-appearance: auto !important;
          appearance: auto !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          width: 0 !important;
          height: 0 !important;
          min-width: 0 !important;
          min-height: 0 !important;
          opacity: 0 !important;
          margin: 0 !important;
        }

        /* 状态文本高亮 */
        html body :is(${p.S_POPUP}) span[style*="lightgreen"] {
          color: ${p.t.accent} !important;
        }

        /* Toggle switch 轨道与滑块 */
        html body :is(${p.S_POPUP}) .toggle-switch .slider {
          background-color: ${p.t.inputBg} !important;
          background: ${p.t.inputBg} !important;
          border: 1.5px solid ${p.t.border} !important;
          border-radius: 20px !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        html body :is(${p.S_POPUP}) .toggle-switch .slider:before {
          background-color: ${p.t.btnActiveText} !important;
          border: 1px solid ${p.t.border} !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        html body :is(${p.S_POPUP}) .toggle-switch input:checked + .slider {
          background-color: ${p.t.btnActiveBg} !important;
          background: ${p.t.btnActiveBg} !important;
          border-color: ${p.t.btnActiveBg} !important;
        }

        html body :is(${p.S_POPUP}) .toggle-switch input:checked + .slider:before {
          background-color: ${p.t.btnActiveText} !important;
          border-color: ${p.t.btnActiveText} !important;
        }

        /* ========== Prompt Segment Toolbar ========== */
        html body :is(${p.S_POPUP}) .prompt-segment {
          background-color: ${p.t.bgPanel} !important;
          border: 1px solid ${p.t.border} !important;
          color: ${p.t.textMain} !important;
          border-radius: 8px !important;
        }

        html body :is(${p.S_POPUP}) .prompt-segment-toolbar {
          background-color: transparent !important;
          color: ${p.t.textMain} !important;
        }

        html body :is(${p.S_POPUP}) .prompt-segment-toolbar :is(.prompt-segment-role, .prompt-segment-main-slot, .prompt-segment-delete-btn) {
          background-color: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
          border-radius: 6px !important;
          transition: all 0.2s ease !important;
        }

        html body :is(${p.S_POPUP}) .prompt-segment-toolbar :is(.prompt-segment-role, .prompt-segment-main-slot, .prompt-segment-delete-btn):hover {
          background-color: ${p.t.btnHover} !important;
        }

        /* ========== Tabs Navigation 标签页导航 ========== */
        html body :is(${p.S_POPUP_MAIN}) .acu-tabs-nav {
          background-color: ${p.t.bgPanel} !important;
          background: ${p.t.bgPanel} !important;
          color: ${p.t.textMain} !important;
          border-bottom: 1px solid ${p.t.border} !important;
          margin: 0 !important;
          position: sticky !important;
          top: 0 !important;
          z-index: 32011 !important;
          isolation: isolate !important;
        }

        html body :is(${p.S_POPUP_MAIN}) .acu-nav-section-title {
          color: ${p.t.textSub} !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          font-weight: 600 !important;
        }

        /* Tab Button (default state) */
        html body :is(${p.S_POPUP_MAIN}) .acu-tab-button {
          background-color: transparent !important;
          background: transparent !important;
          color: ${p.t.textSub} !important;
          border: 1px solid transparent !important;
          border-radius: 8px !important;
          padding: 8px 14px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Tab Button (hover) */
        html body :is(${p.S_POPUP_MAIN}) .acu-tab-button:hover {
          background-color: ${p.t.btnBg} !important;
          background: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          transform: translateY(-1px) !important;
        }

        /* Tab Button (active state) */
        html body :is(${p.S_POPUP_MAIN}) .acu-tab-button.active {
          background-color: ${p.t.btnActiveBg} !important;
          background: ${p.t.btnActiveBg} !important;
          color: ${p.t.btnActiveText} !important;
          border-color: ${p.t.btnActiveBg} !important;
          box-shadow: 0 2px 8px ${p.t.accent}33 !important;
        }

        /* ========== 可视化编辑器 ========== */
        /* Header - 增强渐变效果 */
        #acu-visualizer-content .acu-vis-header {
          background: linear-gradient(135deg, ${p.t.bgNav} 0%, ${p.t.bgPanel} 100%) !important;
          border-bottom: 1px solid ${p.t.border} !important;
          color: ${p.t.textMain} !important;
          position: relative !important;
        }

        /* Header 底部高光 */
        #acu-visualizer-content .acu-vis-header::after {
          content: '' !important;
          position: absolute !important;
          bottom: 0 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 40% !important;
          height: 1px !important;
          background: linear-gradient(90deg, transparent, ${p.t.accent}44, transparent) !important;
        }

        /* Content Area */
        #acu-visualizer-content .acu-vis-content {
          background-color: ${p.t.bgPanel} !important;
          background: ${p.t.bgPanel} !important;
        }

        /* Sidebar - 增强样式 */
        #acu-visualizer-content .acu-vis-sidebar {
          background-color: ${p.t.bgNav} !important;
          background: ${p.t.bgNav} !important;
          border-right: 1px solid ${p.t.border} !important;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05) !important;
        }

        /* Main Section */
        #acu-visualizer-content .acu-vis-main {
          background-color: ${p.t.bgPanel} !important;
          background: ${p.t.bgPanel} !important;
          color: ${p.t.textMain} !important;
        }

        /* Title & Actions */
        #acu-visualizer-content .acu-vis-title {
          color: ${p.t.textMain} !important;
          font-weight: 600 !important;
        }

        #acu-visualizer-content .acu-vis-actions {
          color: ${p.t.textSub} !important;
        }

        /* 可视化编辑器 - 数据卡片 */
        /* Card Grid Layout - 增强间距和动画 */
        #acu-visualizer-content .acu-card-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
          gap: 20px !important;
          padding: 20px !important;
        }

        /* Data Card Container - 现代化卡片设计 */
        #acu-visualizer-content .acu-data-card {
          background-color: ${p.t.bgPanel} !important;
          background: ${p.t.bgPanel} !important;
          border: 1px solid ${p.t.border} !important;
          border-radius: 12px !important;
          overflow: visible !important;
          overflow-y: auto !important;
          max-height: 70vh !important;
          display: flex !important;
          flex-direction: column !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.08),
            0 1px 2px rgba(0, 0, 0, 0.04) !important;
          position: relative !important;
        }

        /* 卡片左侧装饰线 */
        #acu-visualizer-content .acu-data-card::before {
          content: '' !important;
          position: absolute !important;
          top: 12px !important;
          bottom: 12px !important;
          left: 0 !important;
          width: 3px !important;
          background: ${p.t.accent} !important;
          border-radius: 0 3px 3px 0 !important;
          opacity: 0 !important;
          transition: opacity 0.25s ease !important;
        }

        /* 卡片悬停效果 */
        #acu-visualizer-content .acu-data-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 
            0 12px 28px rgba(0, 0, 0, 0.15),
            0 4px 8px rgba(0, 0, 0, 0.08),
            0 0 0 1px ${p.t.accent}22 !important;
          border-color: ${p.t.accent}66 !important;
        }

        /* 悬停时显示装饰线 */
        #acu-visualizer-content .acu-data-card:hover::before {
          opacity: 1 !important;
        }

        /* Add Row Card - 虚线边框样式增强 */
        #acu-visualizer-content #acu-vis-add-row,
        #acu-visualizer-content .acu-data-card#acu-vis-add-row {
          background: ${p.t.bgPanel} !important;
          background-color: ${p.t.bgPanel} !important;
          border: 2px dashed ${p.t.accent}66 !important;
          border-color: ${p.t.accent}66 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          min-height: 48px !important;
          padding: 6px 12px !important;
          cursor: pointer !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* 添加卡片无装饰线 */
        #acu-visualizer-content #acu-vis-add-row::before {
          display: none !important;
        }

        #acu-visualizer-content #acu-vis-add-row i,
        #acu-visualizer-content #acu-vis-add-row i.fa-solid,
        #acu-visualizer-content #acu-vis-add-row i.fa-plus,
        #acu-visualizer-content .acu-data-card#acu-vis-add-row > i,
        #acu-vis-add-row i[style] {
          color: ${p.t.accent} !important;
          font-size: 20px !important;
          line-height: 1 !important;
          transition: all 0.25s ease !important;
        }

        #acu-visualizer-content #acu-vis-add-row div,
        #acu-visualizer-content .acu-data-card#acu-vis-add-row > div,
        #acu-vis-add-row div[style] {
          color: ${p.t.accent} !important;
          font-size: 12px !important;
          line-height: 1.2 !important;
          font-weight: 650 !important;
          transition: all 0.25s ease !important;
        }

        #acu-visualizer-content #acu-vis-add-row:hover {
          background: ${p.t.btnBg} !important;
          background-color: ${p.t.btnBg} !important;
          border-color: ${p.t.accent} !important;
          border-style: solid !important;
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 20px ${p.t.accent}22 !important;
        }

        #acu-visualizer-content #acu-vis-add-row:hover i,
        #acu-visualizer-content #acu-vis-add-row:hover div,
        #acu-vis-add-row:hover i[style],
        #acu-vis-add-row:hover div[style] {
          color: ${p.t.btnActiveBg} !important;
          transform: scale(1.2) !important;
        }

        /* Card Header - 现代化设计 */
        #acu-visualizer-content .acu-card-header {
          background: linear-gradient(135deg, ${p.t.btnActiveBg} 0%, ${p.t.accent} 100%) !important;
          background-color: ${p.t.btnActiveBg} !important;
          color: ${p.t.btnActiveText} !important;
          padding: 14px 18px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          border-bottom: none !important;
          border-radius: 12px 12px 0 0 !important;
          position: relative !important;
        }

        /* Card Header 底部微光 */
        #acu-visualizer-content .acu-card-header::after {
          content: '' !important;
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 1px !important;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
        }

        /* Card Body - 优化内边距和排版 */
        #acu-visualizer-content .acu-card-body {
          background-color: ${p.t.bgPanel} !important;
          background: ${p.t.bgPanel} !important;
          padding: 18px !important;
          flex: 1 !important;
          color: ${p.t.textMain} !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          border-radius: 0 0 12px 12px !important;
        }
        /* 可视化编辑器 - 交互按钮 */
        /* Lock Buttons - 通配符统一处理所有锁定按钮 */
        #acu-visualizer-content [class*="acu-lock"],
        #acu-visualizer-content [class*="acu-vis-lock"] {
          background: ${p.t.btnBg} !important;
          color: ${p.t.textSub} !important;
          border: 1px solid ${p.t.border} !important;
          padding: 4px 6px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          /* 紧凑尺寸 - 防止触摸屏优化导致按钮增大 */
          min-width: unset !important;
          min-height: unset !important;
          width: auto !important;
          height: auto !important;
          font-size: 12px !important;
          line-height: 1 !important;
          border-radius: 4px !important;
          flex-shrink: 0 !important;
        }

        #acu-visualizer-content [class*="acu-lock"]:hover,
        #acu-visualizer-content [class*="acu-vis-lock"]:hover {
          background: ${p.t.btnHover} !important;
          color: ${p.t.textMain} !important;
        }

        /* Delete Buttons (Red warning) */
        #acu-visualizer-content .acu-vis-del-row,
        #acu-visualizer-content .acu-vis-del-table-btn {
          background: ${p.t.btnBg} !important;
          color: ${p.t.textSub} !important;
          border: 1px solid ${p.t.border} !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        #acu-visualizer-content .acu-vis-del-row:hover,
        #acu-visualizer-content .acu-vis-del-table-btn:hover {
          background: #ff4444 !important;
          color: #fff !important;
          border-color: #cc0000 !important;
        }

        /* Add Table Button */
        #acu-visualizer-content .acu-add-table-btn {
          background: ${p.t.accent} !important;
          color: #fff !important;
          border: none !important;
          padding: 10px 16px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        #acu-visualizer-content .acu-add-table-btn:hover {
          background: ${p.t.btnActiveBg} !important;
        }

        /* 可视化编辑器 - 工具栏容器 */
        #acu-visualizer-content .acu-vis-toolbar {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 8px 12px !important;
          background: ${p.t.bgNav} !important;
          border-bottom: 1px solid ${p.t.border} !important;
          flex-shrink: 0 !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
        }

        /* 可视化编辑器 - 模式切换与操作按钮 */
        /* Mode Switch Container */
        #acu-visualizer-content .acu-mode-switch {
          display: flex !important;
          gap: 4px !important;
          padding: 4px !important;
          background: ${p.t.bgPanel} !important;
          border-radius: 6px !important;
          border: 1px solid ${p.t.border} !important;
          flex-shrink: 0 !important;
        }

        /* Mode Button (default) */
        #acu-visualizer-content .acu-mode-btn {
          background: transparent !important;
          color: ${p.t.textSub} !important;
          border: 1px solid transparent !important;
          padding: 6px 10px !important;
          cursor: pointer !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border-radius: 4px !important;
          font-size: 12px !important;
          white-space: nowrap !important;
          min-width: unset !important;
          min-height: unset !important;
        }

        #acu-visualizer-content .acu-mode-btn:hover {
          background: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          transform: translateY(-1px) !important;
        }

        #acu-visualizer-content .acu-mode-btn:active {
          transform: translateY(0) scale(0.98) !important;
        }

        /* Mode Button (active) */
        #acu-visualizer-content .acu-mode-btn.active {
          background: ${p.t.btnActiveBg} !important;
          color: ${p.t.btnActiveText} !important;
          border-color: ${p.t.btnActiveBg} !important;
          box-shadow: 0 2px 8px ${p.t.accent}33 !important;
        }

        /* 操作按钮区域 */
        #acu-visualizer-content .acu-vis-actions {
          display: flex !important;
          gap: 6px !important;
          flex-wrap: wrap !important;
          justify-content: flex-end !important;
          flex-shrink: 1 !important;
          min-width: 0 !important;
        }

        /* Primary Button */
        #acu-visualizer-content .acu-btn-primary {
          background: ${p.t.btnActiveBg} !important;
          color: ${p.t.btnActiveText} !important;
          border: none !important;
          padding: 6px 12px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          white-space: nowrap !important;
          min-width: unset !important;
          min-height: unset !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 2px 6px ${p.t.accent}33 !important;
        }

        #acu-visualizer-content .acu-btn-primary:hover {
          filter: brightness(1.1) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px ${p.t.accent}44 !important;
        }

        #acu-visualizer-content .acu-btn-primary:active {
          transform: translateY(0) scale(0.98) !important;
          box-shadow: 0 1px 4px ${p.t.accent}22 !important;
        }

        /* Secondary Button */
        #acu-visualizer-content .acu-btn-secondary {
          background: ${p.t.btnBg} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
          padding: 6px 12px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          font-size: 12px !important;
          white-space: nowrap !important;
          min-width: unset !important;
          min-height: unset !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        #acu-visualizer-content .acu-btn-secondary:hover {
          background: ${p.t.btnHover} !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        #acu-visualizer-content .acu-btn-secondary:active {
          transform: translateY(0) scale(0.98) !important;
        }
        /* 可视化编辑器 - 字段元素 */
        /* Field Row */
        #acu-visualizer-content .acu-field-row {
          display: flex !important;
          align-items: flex-start !important;
          gap: 12px !important;
          padding: 10px 0 !important;
          border-bottom: 1px solid ${p.t.border} !important;
          transition: background-color 0.2s ease !important;
        }

        #acu-visualizer-content .acu-field-row:last-child {
          border-bottom: none !important;
        }

        /* Field Label - 覆盖inline style的justify-content:space-between，让锁定按钮紧跟文字 */
        #acu-visualizer-content .acu-field-label {
          color: ${p.t.textSub} !important;
          font-weight: 600 !important;
          min-width: 140px !important;
          max-width: 200px !important;
          font-size: 13px !important;
          padding-top: 8px !important;
          user-select: none !important;
          overflow: visible !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          /* 覆盖inline style，让锁定按钮紧跟在列名后面而不是被推到右边 */
          justify-content: flex-start !important;
        }

        /* Field Value Wrapper - 改为横向布局，锁定按钮紧跟在值后面 */
        #acu-visualizer-content .acu-field-value-wrap {
          flex: 1 1 0 !important;
          min-width: 0 !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start !important;
          gap: 8px !important;
          width: 100% !important;
        }

        /* 单元格锁定按钮 - 紧凑样式 */
        #acu-visualizer-content .acu-field-value-wrap > .acu-lock-btn {
          flex-shrink: 0 !important;
          padding: 4px 6px !important;
          font-size: 12px !important;
          border-radius: 4px !important;
          min-width: unset !important;
          min-height: unset !important;
          width: auto !important;
          height: auto !important;
        }

        /* Field Value (editable) */
        #acu-visualizer-content .acu-field-value {
          background-color: ${p.t.inputBg} !important;
          background: ${p.t.inputBg} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          font-size: 14px !important;
          min-height: 38px !important;
          /* 修复：让输入框始终占满一行，文字自动换行 */
          flex: 1 1 0 !important;
          min-width: 0 !important;
          width: 100% !important;
          box-sizing: border-box !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: text !important;
          line-height: 1.5 !important;
          /* 文字换行 */
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
        }

        #acu-visualizer-content .acu-field-value:hover {
          border-color: ${p.t.accent} !important;
          background-color: ${p.t.bgPanel} !important;
          background: ${p.t.bgPanel} !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }

        #acu-visualizer-content .acu-field-value:focus {
          border-color: ${p.t.accent} !important;
          background-color: ${p.t.bgPanel} !important;
          background: ${p.t.bgPanel} !important;
          outline: none !important;
          box-shadow: 0 0 0 3px ${p.t.accent}33 !important;
        }

        /* 可视化编辑器 - 配置面板 */
        /* Panel Container */
        #acu-visualizer-content .acu-config-panel {
          background: ${p.t.bgPanel} !important;
          padding: 20px !important;
          border-radius: 8px !important;
        }

        /* Config Section */
        #acu-visualizer-content .acu-config-section {
          margin-bottom: 24px !important;
        }

        #acu-visualizer-content .acu-config-section h4 {
          color: ${p.t.textMain} !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          margin-bottom: 12px !important;
        }

        /* Form Group */
        #acu-visualizer-content .acu-form-group {
          margin-bottom: 16px !important;
        }

        #acu-visualizer-content .acu-form-group label {
          color: ${p.t.textSub} !important;
          display: block !important;
          margin-bottom: 6px !important;
          font-weight: 500 !important;
        }

        /* Form Inputs */
        #acu-visualizer-content .acu-form-input,
        #acu-visualizer-content .acu-form-textarea {
          background: ${p.t.inputBg} !important;
          color: ${p.t.textMain} !important;
          border: 1px solid ${p.t.border} !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          width: 100% !important;
          font-size: 14px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        #acu-visualizer-content .acu-form-input:hover,
        #acu-visualizer-content .acu-form-textarea:hover {
          border-color: ${p.t.accent}66 !important;
        }

        #acu-visualizer-content .acu-form-input:focus,
        #acu-visualizer-content .acu-form-textarea:focus {
          border-color: ${p.t.accent} !important;
          outline: none !important;
          box-shadow: 0 0 0 3px ${p.t.accent}22 !important;
        }

        #acu-visualizer-content .acu-form-textarea {
          min-height: 80px !important;
          resize: vertical !important;
          line-height: 1.5 !important;
        }

        /* Hint Text */
        #acu-visualizer-content .acu-hint {
          color: ${p.t.textSub} !important;
          font-size: 12px !important;
          opacity: 0.7 !important;
          margin-top: 4px !important;
        }

`;
}
