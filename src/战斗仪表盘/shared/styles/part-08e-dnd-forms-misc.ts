/**
 * part-08e-dnd-forms-misc.ts — 从 DND `ui/styles.js` 拆分（b3 · 2026-10-05）
 * 来源：DND5E_Dashboard_BasedonST-main @ port-baseline（v2.0.5）
 * 内容保持原样（含缩进与顺序）；dnd- 前缀隔离，与 acu-* 无交集。
 */
export const STYLES_PART_08E_DND_FORMS_MISC = `/* ============================================
           表单组件美化 (Form Elements)
           ============================================ */
        
        /* 输入框 */
        .dnd-input {
            background: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid var(--dnd-border-subtle) !important;
            border-radius: 4px !important;
            color: var(--dnd-text-main) !important;
            padding: 8px 10px !important;
            font-family: var(--dnd-font-sans) !important;
            transition: all var(--dnd-hover-transition, 0.2s) !important;
            outline: var(--dnd-focus-outline, none) !important;
        }
        .dnd-input:focus {
            border-color: var(--dnd-input-focus-border, var(--dnd-border-gold)) !important;
            background: rgba(0, 0, 0, 0.5) !important;
            box-shadow: var(--dnd-input-focus-shadow, 0 0 0 2px rgba(157, 139, 108, 0.2)) !important;
        }
        .dnd-input:disabled {
            opacity: var(--dnd-disabled-opacity, 0.5) !important;
            cursor: var(--dnd-disabled-cursor, not-allowed) !important;
            filter: var(--dnd-disabled-filter, grayscale(0.5)) !important;
        }
        
        /* 下拉选框 */
        .dnd-select {
            appearance: none !important;
            -webkit-appearance: none !important;
            background: rgba(0, 0, 0, 0.3) url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239d8b6c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 10px center !important;
            background-size: 10px !important;
            border: 1px solid var(--dnd-border-subtle) !important;
            border-radius: 4px !important;
            color: var(--dnd-text-main) !important;
            padding: 8px 30px 8px 10px !important;
            cursor: pointer !important;
            font-family: var(--dnd-font-sans) !important;
            transition: all var(--dnd-hover-transition, 0.2s) !important;
        }
        .dnd-select:hover {
            border-color: var(--dnd-text-dim) !important;
        }
        .dnd-select:focus {
            border-color: var(--dnd-focus-border-color, var(--dnd-border-gold)) !important;
            box-shadow: var(--dnd-focus-shadow, 0 0 5px rgba(157, 139, 108, 0.3)) !important;
        }
        .dnd-select:disabled {
            opacity: var(--dnd-disabled-opacity, 0.5) !important;
            cursor: var(--dnd-disabled-cursor, not-allowed) !important;
        }
        
        /* 复选框美化 */
        .dnd-checkbox {
            appearance: none !important;
            -webkit-appearance: none !important;
            width: 16px !important;
            height: 16px !important;
            border: 1px solid var(--dnd-border-subtle) !important;
            border-radius: 3px !important;
            background: rgba(0,0,0,0.3) !important;
            cursor: pointer !important;
            position: relative !important;
            display: inline-block !important;
            vertical-align: middle !important;
            margin-right: 5px !important;
            transition: all var(--dnd-hover-transition, 0.2s) !important;
        }
        .dnd-checkbox:checked {
            background: var(--dnd-selected-border-color, var(--dnd-border-gold)) !important;
            border-color: var(--dnd-selected-border-color, var(--dnd-border-gold)) !important;
        }
        .dnd-checkbox:checked::after {
            content: "✔" !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            color: #000 !important;
            font-size: 10px !important;
            font-weight: bold !important;
        }
        .dnd-checkbox:hover {
            border-color: var(--dnd-hover-border-color, var(--dnd-text-highlight)) !important;
        }
        .dnd-checkbox:disabled {
            opacity: var(--dnd-disabled-opacity, 0.5) !important;
            cursor: var(--dnd-disabled-cursor, not-allowed) !important;
        }

        /* ============================================
           更多差异化动效 (Extra Animations)
           ============================================ */
           
        /* 悬停辉光扫描 */
        .dnd-hover-scan {
            position: relative !important;
            overflow: hidden !important;
        }
        .dnd-hover-scan::before {
            content: "" !important;
            position: absolute !important;
            top: 0; left: -100%;
            width: 50%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent) !important;
            transform: skewX(-25deg) !important;
            transition: left 0.5s !important;
            pointer-events: none !important;
        }
        .dnd-hover-scan:hover::before {
            left: 150% !important;
            transition: left 0.7s ease-in-out !important;
        }
        
        /* 脉冲缩放 (用于强调) */
        @keyframes dnd-pulse-scale {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .dnd-pulse-hover:hover {
            animation: dnd-pulse-scale 1s infinite ease-in-out !important;
        }
        
        /* 边框流光 (Border Flow) */
        @keyframes dnd-border-snake {
            0%, 100% { background-position: 0% 0%; }
            25% { background-position: 100% 0%; }
            50% { background-position: 100% 100%; }
            75% { background-position: 0% 100%; }
        }
        
        /* 幽灵按钮 (Ghost Button) */
        .dnd-btn-ghost {
            background: transparent !important;
            border: 1px dashed var(--dnd-text-dim) !important;
            color: var(--dnd-text-dim) !important;
            padding: 6px 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            font-size: 12px !important;
        }
        .dnd-btn-ghost:hover {
            border-color: var(--dnd-text-highlight) !important;
            color: var(--dnd-text-highlight) !important;
            background: rgba(255, 255, 255, 0.05) !important;
        }
        
        /* ============================================
           浮动球隐藏模式样式
           ============================================ */
        
        /* 强制隐藏浮动球 */
        #dnd-toggle-btn.dnd-force-hidden {
            display: none !important;
        }
        
        /* 隐藏球模式下 Mini HUD 可拖拽 */
        #dnd-mini-hud.dnd-independent-mode {
            cursor: move !important;
        }
        
        #dnd-mini-hud.dnd-independent-mode .dnd-hud-header {
            cursor: move !important;
        }
    `;
