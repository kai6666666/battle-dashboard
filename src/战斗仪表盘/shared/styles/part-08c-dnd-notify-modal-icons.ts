/**
 * part-08c-dnd-notify-modal-icons.ts — 从 DND `ui/styles.js` 拆分（b3 · 2026-10-05）
 * 来源：DND5E_Dashboard_BasedonST-main @ port-baseline（v2.0.5）
 * 内容保持原样（含缩进与顺序）；dnd- 前缀隔离，与 acu-* 无交集。
 */
export const STYLES_PART_08C_DND_NOTIFY_MODAL_ICONS = `/* ============================================
           自定义通知系统样式
           ============================================ */
        
        /* 通知容器 */
        #dnd-notification-container {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
            pointer-events: none !important;
            max-width: 400px !important;
        }

        /* Toast 通知样式 */
        .dnd-toast {
            display: flex !important;
            align-items: flex-start !important;
            gap: 12px !important;
            padding: 14px 16px !important;
            background: var(--dnd-bg-popup) !important;
            border: 1px solid var(--dnd-border-inner) !important;
            border-radius: 8px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4) !important;
            color: var(--dnd-text-main) !important;
            font-family: var(--dnd-font-sans) !important;
            font-size: 14px !important;
            pointer-events: auto !important;
            transform: translateX(120%) !important;
            opacity: 0 !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            backdrop-filter: blur(10px) !important;
        }
        .dnd-toast-visible {
            transform: translateX(0) !important;
            opacity: 1 !important;
        }
        .dnd-toast-exit {
            transform: translateX(120%) !important;
            opacity: 0 !important;
        }

        /* Toast 类型边框颜色 */
        .dnd-toast-info { border-left: 4px solid var(--dnd-toast-info) !important; }
        .dnd-toast-success { border-left: 4px solid var(--dnd-toast-success) !important; }
        .dnd-toast-warning { border-left: 4px solid var(--dnd-toast-warning) !important; }
        .dnd-toast-error { border-left: 4px solid var(--dnd-toast-error) !important; }

        .dnd-toast-icon {
            font-size: 20px !important;
            flex-shrink: 0 !important;
            line-height: 1 !important;
        }

        .dnd-toast-content {
            flex: 1 !important;
            min-width: 0 !important;
        }

        .dnd-toast-title {
            font-weight: bold !important;
            color: var(--dnd-text-header) !important;
            margin-bottom: 4px !important;
        }

        .dnd-toast-message {
            color: var(--dnd-text-main) !important;
            line-height: 1.4 !important;
            word-break: break-word !important;
        }

        .dnd-toast-close {
            background: transparent !important;
            border: none !important;
            color: var(--dnd-text-dim) !important;
            font-size: 18px !important;
            cursor: pointer !important;
            padding: 0 !important;
            line-height: 1 !important;
            opacity: 0.6 !important;
            transition: opacity 0.2s !important;
        }
        .dnd-toast-close:hover {
            opacity: 1 !important;
            color: var(--dnd-text-highlight) !important;
        }

        /* 对话框容器 */
        #dnd-dialog-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 2147483646 !important;
            pointer-events: none !important;
        }

        /* 对话框背景遮罩 - Flex 居中容器 */
        .dnd-dialog-backdrop {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.7) !important;
            backdrop-filter: blur(3px) !important;
            opacity: 0 !important;
            transition: opacity 0.2s ease !important;
            pointer-events: auto !important;
            /* Flex 居中 - 最暴力的居中方式 */
            display: none !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 20px !important;
            box-sizing: border-box !important;
        }
        .dnd-dialog-backdrop-visible {
            opacity: 1 !important;
            display: flex !important;
        }

        /* 对话框主体 - 由 backdrop flex 容器居中，不再依赖 fixed/top/transform */
        .dnd-dialog {
            position: relative !important;
            min-width: 280px !important;
            max-width: min(90vw, 450px) !important;
            max-height: 80vh !important;
            background: var(--dnd-bg-popup) !important;
            /* Morphology: Border */
            border: var(--dnd-border-width, 1px) var(--dnd-border-style, solid) var(--dnd-border-gold) !important;
            /* Morphology: Radius */
            border-radius: var(--dnd-radius-lg, 10px) !important;
            box-shadow: var(--dnd-shadow-lg), var(--dnd-selected-glow), var(--dnd-effect-border-glow, none) !important;
            color: var(--dnd-text-main) !important;
            font-family: var(--dnd-font-sans) !important;
            opacity: 0 !important;
            transform: scale(0.9) !important;
            transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            pointer-events: auto !important;
            
            /* 三段式 Flex 布局 - 确保内容正确滚动 */
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
            /* 禁止主题的 clip-path 裁切对话框 */
            clip-path: none !important;
        }
        
        /* 对话框纹理层 */
        .dnd-dialog::before {
            content: "" !important;
            position: absolute !important;
            top: 0; left: 0; right: 0; bottom: 0 !important;
            background: var(--dnd-effect-texture, none) !important;
            opacity: 0.3 !important;
            pointer-events: none !important;
            z-index: 0 !important;
            mix-blend-mode: overlay !important;
        }
        /* 可见状态 */
        .dnd-dialog-visible {
            opacity: 1 !important;
            transform: scale(1) !important;
        }

        /* 对话框类型 */
        .dnd-dialog-warning .dnd-dialog-header {
            border-bottom-color: var(--dnd-toast-warning) !important;
        }
        .dnd-dialog-danger .dnd-dialog-header {
            border-bottom-color: var(--dnd-toast-error) !important;
        }
        .dnd-dialog-danger .dnd-dialog-btn-confirm {
            background: linear-gradient(135deg, var(--dnd-toast-error), var(--dnd-accent-red)) !important;
        }

        /* 对话框头部 */
        .dnd-dialog-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 16px 20px !important;
            background: var(--dnd-bg-secondary) !important;
            border-bottom: 1px solid var(--dnd-border-gold) !important;
            /* 三段式布局：头部固定高度，不参与滚动 */
            flex-shrink: 0 !important;
            min-height: 0 !important;
        }

        .dnd-dialog-title {
            font-size: 16px !important;
            font-weight: bold !important;
            color: var(--dnd-text-highlight) !important;
            font-family: var(--dnd-font-serif) !important;
        }

        .dnd-dialog-close {
            background: transparent !important;
            border: none !important;
            color: var(--dnd-text-dim) !important;
            font-size: 24px !important;
            cursor: pointer !important;
            padding: 0 !important;
            line-height: 1 !important;
            transition: color 0.2s !important;
        }
        .dnd-dialog-close:hover {
            color: var(--dnd-text-highlight) !important;
        }

        /* 对话框内容 */
        .dnd-dialog-body {
            padding: 20px !important;
            /* 三段式布局：body 占据剩余空间，内容超出时滚动 */
            flex: 1 !important;
            min-height: 0 !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
        }

        .dnd-dialog-message {
            font-size: 14px !important;
            line-height: 1.6 !important;
            color: var(--dnd-text-main) !important;
            margin: 0 0 15px 0 !important;
            /* 使 TemplateSync 的 \\n\\n 换行符可读 */
            white-space: pre-line !important;
            word-break: break-word !important;
        }

        /* 对话框输入框 */
        .dnd-dialog-input {
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 10px 14px !important;
            background: var(--dnd-bg-input) !important;
            border: 1px solid var(--dnd-border-inner) !important;
            border-radius: 6px !important;
            color: var(--dnd-text-main) !important;
            font-size: 14px !important;
            font-family: var(--dnd-font-sans) !important;
            outline: none !important;
            transition: border-color 0.2s, box-shadow 0.2s !important;
        }
        .dnd-dialog-input:focus {
            border-color: var(--dnd-border-gold) !important;
            box-shadow: var(--dnd-focus-shadow) !important;
        }
        .dnd-dialog-input::placeholder {
            color: var(--dnd-text-dim) !important;
        }

        /* 对话框底部 */
        .dnd-dialog-footer {
            display: flex !important;
            justify-content: flex-end !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
            padding: 16px 20px !important;
            background: var(--dnd-bg-secondary) !important;
            border-top: 1px solid var(--dnd-border-subtle) !important;
            /* 三段式布局：底部固定高度，不参与滚动 */
            flex-shrink: 0 !important;
            min-height: 0 !important;
        }

        /* 对话框按钮 */
        .dnd-dialog-btn {
            padding: 10px 20px !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            border: none !important;
        }

        .dnd-dialog-btn-cancel {
            background: var(--dnd-bg-tertiary) !important;
            color: var(--dnd-text-main) !important;
            border: 1px solid var(--dnd-border-subtle) !important;
        }
        .dnd-dialog-btn-cancel:hover {
            background: var(--dnd-selected-bg) !important;
            border-color: var(--dnd-border-gold) !important;
        }

        .dnd-dialog-btn-confirm {
            background: var(--dnd-btn-primary) !important;
            color: var(--dnd-btn-text) !important;
        }
        .dnd-dialog-btn-confirm:hover {
            filter: brightness(1.1) !important;
            transform: translateY(-1px) !important;
            box-shadow: var(--dnd-hover-shadow) !important;
        }
        .dnd-dialog-btn-confirm:active {
            transform: translateY(0) !important;
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            #dnd-notification-container {
                left: 10px !important;
                right: 10px !important;
                max-width: none !important;
            }
            
            .dnd-toast {
                transform: translateY(-100%) !important;
            }
            .dnd-toast-visible {
                transform: translateY(0) !important;
            }
            .dnd-toast-exit {
                transform: translateY(-100%) !important;
            }
            
            /* 对话框移动端适配：由 backdrop flex 居中，此处仅设置尺寸约束 */
            .dnd-dialog {
                min-width: 0 !important;
                width: calc(100vw - 40px) !important;
                max-width: 400px !important;
                max-height: calc(100vh - 40px) !important;
                max-height: calc(100dvh - 40px) !important; /* 动态视口高度，更适合移动端 */
            }
            
            /* 移动端对话框按钮可堆叠 */
            .dnd-dialog-footer {
                flex-direction: column !important;
            }
            
            .dnd-dialog-btn {
                width: 100% !important;
            }
        }

        /* ============================================
           NPC详情模态框 (Modal Overlay)
           ============================================ */
        
        /* 模态框遮罩层 */
        .dnd-modal-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.85) !important;
            backdrop-filter: blur(5px) !important;
            z-index: 2147483646 !important;
            display: none !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 20px !important;
        }
        .dnd-modal-overlay.active {
            display: flex !important;
        }
        
        /* 模态框主体 */
        .dnd-modal {
            background: var(--dnd-bg-popup) !important;
            /* Morphology: Border */
            border: var(--dnd-border-width, 1px) var(--dnd-border-style, solid) var(--dnd-border-gold) !important;
            /* Morphology: Radius */
            border-radius: var(--dnd-radius-lg, 10px) !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(157, 139, 108, 0.1), var(--dnd-effect-border-glow, none) !important;
            color: var(--dnd-text-main) !important;
            font-family: var(--dnd-font-sans) !important;
            width: 420px !important;
            max-width: 90vw !important;
            max-height: 80vh !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            animation: dnd-modal-in 0.25s ease-out !important;
            position: relative !important;
            
            /* Morphology: Shape */
            clip-path: var(--dnd-card-clip-path, none) !important;
        }
        
        /* 模态框纹理层 */
        .dnd-modal::before {
            content: "" !important;
            position: absolute !important;
            top: 0; left: 0; right: 0; bottom: 0 !important;
            background: var(--dnd-effect-texture, none) !important;
            opacity: 0.3 !important;
            pointer-events: none !important;
            z-index: 0 !important;
            mix-blend-mode: overlay !important;
        }
        
        @keyframes dnd-modal-in {
            0% {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        /* 模态框头部 */
        .dnd-modal-header {
            padding: 16px 20px !important;
            background: rgba(0, 0, 0, 0.3) !important;
            border-bottom: 1px solid var(--dnd-border-gold) !important;
            flex-shrink: 0 !important;
        }
        
        /* 模态框关闭按钮 */
        .dnd-modal-close {
            cursor: pointer !important;
            font-size: 20px !important;
            color: var(--dnd-text-dim) !important;
            width: 28px !important;
            height: 28px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 4px !important;
            transition: all 0.2s !important;
            flex-shrink: 0 !important;
        }
        .dnd-modal-close:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            color: var(--dnd-text-highlight) !important;
        }
        
        /* 模态框内容区 */
        .dnd-modal-body {
            padding: 20px !important;
            overflow-y: auto !important;
            flex: 1 !important;
        }
        
        /* 移动端适配 */
        @media (max-width: 768px) {
            .dnd-modal {
                width: calc(100vw - 40px) !important;
                max-height: 85vh !important;
            }
        }

        /* ============================================
           SVG Icon Enhancements (FontAwesome)
           ============================================ */
        .svg-inline--fa {
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            display: inline-block !important;
            vertical-align: -0.125em !important; /* Fix alignment */
        }
        
        /* 悬停光晕效果 */
        .dnd-clickable:hover .svg-inline--fa,
        .dnd-btn:hover .svg-inline--fa,
        .dnd-nav-item:hover .svg-inline--fa,
        .dnd-footer-btn:hover .svg-inline--fa,
        .dnd-icon-hover:hover {
            filter: drop-shadow(0 0 5px currentColor) !important;
            transform: scale(1.2) !important;
        }
        
        /* 特定颜色的图标光晕增强 */
        .dnd-text-highlight .svg-inline--fa {
            filter: drop-shadow(0 0 2px var(--dnd-text-highlight));
        }

        /* 状态提示特效 */
        @keyframes dnd-icon-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
        .dnd-icon-bounce {
            animation: dnd-icon-bounce 1s infinite ease-in-out !important;
            color: var(--dnd-text-highlight) !important;
        }

        @keyframes dnd-icon-pulse-gold {
            0% { filter: drop-shadow(0 0 0 transparent); }
            50% { filter: drop-shadow(0 0 8px var(--dnd-text-highlight)); }
            100% { filter: drop-shadow(0 0 0 transparent); }
        }
        .dnd-icon-notify {
            animation: dnd-icon-pulse-gold 2s infinite !important;
            color: var(--dnd-text-highlight) !important;
        }

        /* 悬停浮起效果 (Moved to end for precedence) */
        .dnd-hover-lift {
            transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
                        box-shadow 0.4s,
                        filter 0.4s,
                        background 0.4s,
                        border-color 0.4s,
                        color 0.4s !important;
        }
        .dnd-hover-lift:hover {
            transform: translateY(-3px) scale(1.02) !important;
            box-shadow: var(--dnd-shadow-md) !important;
            filter: brightness(1.1) !important;
            z-index: 10 !important;
        }

        `;
