/**
 * part-08d-dnd-animations.ts — 从 DND `ui/styles.js` 拆分（b3 · 2026-10-05）
 * 来源：DND5E_Dashboard_BasedonST-main @ port-baseline（v2.0.5）
 * 内容保持原样（含缩进与顺序）；dnd- 前缀隔离，与 acu-* 无交集。
 */
export const STYLES_PART_08D_DND_ANIMATIONS = `/* ============================================
           🎨 高级动画美化系统 - 炫酷灵动效果
           ============================================ */

        /* === 1. 悬浮球 (Toggle Button) 增强动效 === */
        
        /* 呼吸光环动画 */
        @keyframes dnd-breathe-glow {
            0%, 100% {
                box-shadow: var(--dnd-shadow-md),
                            inset 0 0 10px var(--dnd-bg-tertiary),
                            0 0 20px var(--dnd-selected-glow),
                            0 0 40px var(--dnd-selected-bg);
            }
            50% {
                box-shadow: var(--dnd-shadow-md),
                            inset 0 0 10px var(--dnd-bg-tertiary),
                            0 0 30px var(--dnd-selected-glow),
                            0 0 60px var(--dnd-selected-bg);
            }
        }
        
        /* 环形扫光动画 */
        @keyframes dnd-ring-sweep {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* 悬浮球呼吸光效 - 仅添加动画，不覆盖其他样式 */
        #dnd-toggle-btn:not(.dnd-hidden):not(:hover) {
            animation: dnd-breathe-glow 3s ease-in-out infinite;
        }
        
        /* 悬浮球悬停增强 - 增强原有效果 */
        #dnd-toggle-btn:hover {
            box-shadow: 0 0 20px var(--dnd-selected-glow),
                        0 0 40px var(--dnd-selected-bg),
                        inset 0 0 10px var(--dnd-bg-panel-start) !important;
        }

        /* === 2. HUD 面板增强效果 === */
        
        /* 毛玻璃 + 边框光效 */
        @keyframes dnd-border-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        #dnd-mini-hud {
            backdrop-filter: blur(12px) saturate(150%) !important;
            -webkit-backdrop-filter: blur(12px) saturate(150%) !important;
        }
        
        #dnd-mini-hud::after {
            animation: dnd-icon-pulse-gold 3s ease-in-out infinite !important;
        }
        
        /* HUD 边框动态光效 */
        #dnd-mini-hud.visible {
            position: relative;
        }

        /* === 3. 角色卡片 3D 悬浮效果 === */
        
        .dnd-char-card {
            transform-style: preserve-3d !important;
            perspective: 1000px !important;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        
        .dnd-char-card:hover {
            transform: var(--dnd-card-hover-transform) !important;
            box-shadow: var(--dnd-card-hover-shadow),
                        inset 0 1px 0 var(--dnd-bg-panel-start) !important;
        }
        
        /* 卡片边框发光呼吸 */
        @keyframes dnd-card-glow {
            0%, 100% {
                border-color: var(--dnd-border-inner);
                box-shadow: var(--dnd-shadow-sm);
            }
            50% {
                border-color: var(--dnd-border-gold);
                box-shadow: var(--dnd-selected-glow);
            }
        }
        
        .dnd-char-card.dnd-highlight-card {
            animation: dnd-card-glow 2s ease-in-out infinite !important;
        }

        /* 头像光圈效果 */
        .dnd-avatar-container {
            position: relative !important;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        
        .dnd-avatar-container::after {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border-radius: 50%;
            background: conic-gradient(
                from 0deg,
                transparent,
                var(--dnd-border-gold),
                transparent,
                var(--dnd-text-highlight),
                transparent
            );
            opacity: 0;
            transition: opacity 0.3s;
            z-index: -1;
            animation: dnd-ring-sweep 3s linear infinite;
        }
        
        .dnd-avatar-container:hover::after {
            opacity: 1;
        }
        
        .dnd-avatar-container:hover {
            transform: scale(1.1) !important;
            box-shadow: var(--dnd-selected-glow) !important;
        }

        /* === 4. 骰子按钮 3D 翻转效果 === */
        
        .dnd-dice-btn {
            position: relative !important;
            transform-style: preserve-3d !important;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            overflow: hidden !important;
        }
        
        .dnd-dice-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, var(--dnd-selected-bg) 0%, transparent 70%);
            transition: all 0.4s ease;
            transform: translate(-50%, -50%);
            border-radius: 50%;
        }
        
        .dnd-dice-btn:hover::before {
            width: 150%;
            height: 150%;
        }
        
        .dnd-dice-btn:hover {
            transform: translateY(-3px) rotateX(-10deg) scale(1.08) !important;
            box-shadow: var(--dnd-shadow-md), var(--dnd-selected-glow) !important;
        }
        
        .dnd-dice-btn:active {
            transform: translateY(0) rotateX(0) scale(0.95) !important;
            transition: all 0.1s !important;
        }
        
        /* [b12.12] 投骰结果卡入场（无 fill-mode：动画失败也直接可见） */
        @keyframes dnd-roll-pop-in {
            0% { opacity: 0; transform: translateY(-18px) scale(0.6) rotateX(-25deg); }
            60% { opacity: 1; transform: translateY(4px) scale(1.06) rotateX(5deg); }
            100% { opacity: 1; transform: translateY(0) scale(1) rotateX(0deg); }
        }
        .dnd-roll-pop {
            animation: dnd-roll-pop-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        /* 骰子滚动动画 */
        @keyframes dnd-dice-roll {
            0% { transform: rotateY(0deg) rotateX(0deg); }
            25% { transform: rotateY(90deg) rotateX(90deg); }
            50% { transform: rotateY(180deg) rotateX(180deg); }
            75% { transform: rotateY(270deg) rotateX(90deg); }
            100% { transform: rotateY(360deg) rotateX(0deg); }
        }
        
        .dnd-dice-rolling {
            animation: dnd-dice-roll 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        
        /* 骰子结果特效 - NAT20 发光脉冲 */
        @keyframes dnd-nat20-glow {
            0% {
                text-shadow: 0 0 30px var(--dnd-accent-green),
                             0 0 60px var(--dnd-accent-green);
                transform: scale(1);
            }
            100% {
                text-shadow: 0 0 50px var(--dnd-accent-green),
                             0 0 100px var(--dnd-accent-green),
                             0 0 150px var(--dnd-accent-green);
                transform: scale(1.05);
            }
        }
        
        /* 骰子结果特效 - NAT1 抖动 */
        @keyframes dnd-shake {
            0%, 100% { transform: translateX(0) rotate(0); }
            10% { transform: translateX(-8px) rotate(-5deg); }
            20% { transform: translateX(8px) rotate(5deg); }
            30% { transform: translateX(-6px) rotate(-3deg); }
            40% { transform: translateX(6px) rotate(3deg); }
            50% { transform: translateX(-4px) rotate(-2deg); }
            60% { transform: translateX(4px) rotate(2deg); }
            70% { transform: translateX(-2px) rotate(-1deg); }
            80% { transform: translateX(2px) rotate(1deg); }
            90% { transform: translateX(-1px) rotate(0); }
        }
        
        .dnd-nat20-result {
            background: linear-gradient(135deg, var(--dnd-bg-tertiary), var(--dnd-bg-secondary)) !important;
            border-color: var(--dnd-accent-green) !important;
        }
        
        .dnd-nat1-result {
            background: linear-gradient(135deg, var(--dnd-bg-tertiary), var(--dnd-bg-secondary)) !important;
            border-color: var(--dnd-accent-red) !important;
        }
        
        /* 骰子结果数字弹跳入场 */
        @keyframes dnd-result-bounce {
            0% {
                opacity: 0;
                transform: scale(0.3) translateY(-50px);
            }
            50% {
                opacity: 1;
                transform: scale(1.1) translateY(10px);
            }
            70% {
                transform: scale(0.95) translateY(-5px);
            }
            100% {
                transform: scale(1) translateY(0);
            }
        }
        
        .dnd-dice-result-number {
            animation: dnd-result-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
        }

        /* === 5. 进度条流动光效增强 === */
        
        @keyframes dnd-bar-flow {
            0% {
                background-position: -200% center;
            }
            100% {
                background-position: 200% center;
            }
        }
        
        .dnd-bar-fill,
        .dnd-micro-bar-fill {
            position: relative !important;
            overflow: hidden !important;
        }
        
        .dnd-bar-fill::after,
        .dnd-micro-bar-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.3) 25%,
                rgba(255, 255, 255, 0.5) 50%,
                rgba(255, 255, 255, 0.3) 75%,
                transparent 100%
            );
            background-size: 200% 100%;
            animation: dnd-bar-flow 8s linear infinite;
        }
        
        /* HP 条特效 - 低血量警告闪烁 */
        @keyframes dnd-hp-critical {
            0%, 100% {
                box-shadow: 0 0 5px rgba(231, 76, 60, 0.5);
                opacity: 1;
            }
            50% {
                box-shadow: 0 0 15px rgba(231, 76, 60, 0.8);
                opacity: 0.7;
            }
        }
        
        .dnd-bar-hp.dnd-critical .dnd-bar-fill {
            animation: dnd-hp-critical 1s ease-in-out infinite !important;
        }

        /* === 6. 按钮涟漪效果 === */
        
        @keyframes dnd-ripple {
            0% {
                transform: scale(0);
                opacity: 0.5;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .dnd-btn-ripple {
            position: relative !important;
            overflow: hidden !important;
        }
        
        .dnd-btn-ripple .dnd-ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, var(--dnd-selected-bg) 0%, transparent 70%); /* 更柔和的径向渐变 */
            pointer-events: none;
            animation: dnd-ripple 0.6s ease-out forwards;
            mix-blend-mode: screen; /* 混合模式让光效更亮 */
        }
        
        /* 新增：通用按钮样式 (用于内部组件) */
        .dnd-btn-primary, .dnd-btn-secondary {
            padding: 6px 14px !important;
            border-radius: 4px !important;
            font-size: 13px !important;
            cursor: pointer !important;
            transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            font-family: var(--dnd-font-sans) !important;
            border: 1px solid transparent !important;
            position: relative !important;
            overflow: hidden !important;
        }
        
        .dnd-btn-primary {
            background: linear-gradient(135deg, var(--dnd-border-gold), #7a6b52) !important;
            color: var(--dnd-text-inverse) !important;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
            font-weight: bold !important;
        }
        .dnd-btn-primary:hover {
            filter: brightness(var(--dnd-btn-hover-brightness, 1.15)) !important;
            transform: var(--dnd-btn-hover-transform, translateY(-2px)) !important;
            box-shadow: var(--dnd-btn-hover-shadow, 0 6px 15px rgba(157, 139, 108, 0.4)) !important;
        }
        .dnd-btn-primary:active {
            transform: var(--dnd-btn-active-transform, translateY(0) scale(0.98)) !important;
            box-shadow: var(--dnd-btn-active-shadow, 0 2px 5px rgba(0,0,0,0.3)) !important;
        }
        
        .dnd-btn-secondary {
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid var(--dnd-border-inner) !important;
            color: var(--dnd-text-main) !important;
        }
        .dnd-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: var(--dnd-hover-border-color, var(--dnd-border-gold)) !important;
            color: var(--dnd-selected-text-color, var(--dnd-text-highlight)) !important;
            transform: var(--dnd-btn-hover-transform, translateY(-1px)) !important;
        }

        /* 标签页 Tab 按钮 */
        .dnd-tab-btn {
            padding: 8px 16px !important;
            background: transparent !important;
            border: none !important;
            border-bottom: 2px solid transparent !important;
            color: var(--dnd-text-dim) !important;
            cursor: pointer !important;
            font-family: var(--dnd-font-serif) !important;
            font-size: 14px !important;
            transition: all var(--dnd-hover-transition, 0.3s) !important;
            position: relative !important;
        }
        .dnd-tab-btn:hover {
            color: var(--dnd-text-main) !important;
        }
        .dnd-tab-btn.active {
            color: var(--dnd-selected-text-color, var(--dnd-text-highlight)) !important;
            border-bottom-color: var(--dnd-nav-active-indicator, var(--dnd-border-gold)) !important;
        }
        .dnd-tab-btn.active::after {
            content: "◆" !important;
            position: absolute !important;
            bottom: -6px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            font-size: 10px !important;
            color: var(--dnd-nav-active-indicator, var(--dnd-border-gold)) !important;
            text-shadow: 0 0 5px var(--dnd-nav-active-indicator, var(--dnd-border-gold)) !important;
        }

        /* === 7. 导航项滑动指示器 === */
        
        .dnd-nav-item {
            position: relative !important;
            overflow: hidden !important;
        }
        
        .dnd-nav-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 0;
            background: linear-gradient(90deg,
                rgba(157, 139, 108, 0.3) 0%,
                transparent 100%);
            transition: width 0.3s ease;
        }
        
        .dnd-nav-item:hover::before {
            width: 100%;
        }
        
        .dnd-nav-item.active::before {
            width: 100%;
            background: linear-gradient(90deg,
                rgba(157, 139, 108, 0.4) 0%,
                transparent 100%);
        }
        
        .dnd-nav-item::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg,
                var(--dnd-border-gold),
                transparent);
            transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .dnd-nav-item:hover::after,
        .dnd-nav-item.active::after {
            width: 100%;
        }

        /* === 8. 弹窗入场动画增强 === */
        
        /* 流畅的弹窗入场动画（无果冻弹跳） */
        @keyframes dnd-popup-smooth-in {
            0% {
                opacity: 0;
                transform: scale(0.92) translateY(-8px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        /* 保留原始弹跳动画供其他场景使用 */
        @keyframes dnd-popup-bounce-in {
            0% {
                opacity: 0;
                transform: scale(0.3) translateY(-20px);
            }
            50% {
                transform: scale(1.05) translateY(5px);
            }
            70% {
                transform: scale(0.95) translateY(-2px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        @keyframes dnd-popup-slide-up {
            0% {
                opacity: 0;
                transform: translateY(20px) scale(0.96);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .dnd-detail-popup.visible,
        .dnd-quest-tooltip.visible {
            animation: dnd-popup-smooth-in 0.22s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
        }
        
        .dnd-char-detail-card.visible {
            animation: dnd-popup-slide-up 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
        }

        /* === 9. 迷你角色条悬浮增强 === */
        
        .dnd-mini-char {
            position: relative !important;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        
        .dnd-mini-char::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: transparent;
            transition: all 0.3s ease;
        }
        
        .dnd-mini-char:hover::before {
            background: linear-gradient(180deg,
                transparent,
                var(--dnd-border-gold),
                transparent);
            box-shadow: 0 0 10px rgba(157, 139, 108, 0.5);
        }
        
        .dnd-mini-char:hover {
            transform: translateX(5px) !important;
            background: linear-gradient(90deg,
                rgba(157, 139, 108, 0.25) 0%,
                rgba(157, 139, 108, 0.1) 30%,
                transparent 100%) !important;
        }
        
        .dnd-mini-char.active {
            background: linear-gradient(90deg,
                rgba(255, 219, 133, 0.3) 0%,
                rgba(157, 139, 108, 0.15) 30%,
                transparent 100%) !important;
        }
        
        .dnd-mini-char.active::before {
            background: linear-gradient(180deg,
                rgba(255, 219, 133, 0.3),
                var(--dnd-text-highlight),
                rgba(255, 219, 133, 0.3)) !important;
            box-shadow: 0 0 15px rgba(255, 219, 133, 0.6);
        }

        /* === 10. 快捷栏 3D 效果 === */
        
        .dnd-quick-slot {
            transform-style: preserve-3d !important;
            transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            position: relative !important;
        }
        
        .dnd-quick-slot::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 50%,
                rgba(0, 0, 0, 0.2) 100%);
            opacity: 0;
            transition: opacity 0.3s;
            border-radius: inherit;
        }
        
        .dnd-quick-slot:hover::before {
            opacity: 1;
        }
        
        .dnd-quick-slot:hover {
            transform: translateY(-5px) scale(1.1) rotateX(-5deg) !important;
            box-shadow:
                0 10px 20px rgba(0, 0, 0, 0.4),
                0 0 15px rgba(255, 219, 133, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
        }

        /* === 11. 资源栏动态效果 === */
        
        .dnd-res-item {
            transition: all 0.2s ease !important;
        }
        
        .dnd-res-item:hover {
            transform: scale(1.1) !important;
            color: var(--dnd-text-highlight) !important;
        }
        
        .dnd-res-item:hover .dnd-res-icon {
            opacity: 1 !important;
            filter: drop-shadow(0 0 5px currentColor);
        }

        /* === 12. 粒子/星尘背景效果 (可选开启) === */
        
        @keyframes dnd-float-particle {
            0%, 100% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            90% {
                opacity: 0.8;
            }
            100% {
                transform: translateY(-100px) translateX(20px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .dnd-particles-enabled::before {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--dnd-border-gold);
            border-radius: 50%;
            animation: dnd-float-particle 5s ease-in-out infinite;
            pointer-events: none;
        }

        /* === 13. 状态徽章弹跳效果 === */
        
        @keyframes dnd-badge-bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        .dnd-status-badge {
            animation: dnd-badge-bounce 2s ease-in-out infinite !important;
        }
        
        .dnd-status-badge.urgent {
            animation: dnd-badge-bounce 0.5s ease-in-out infinite !important;
            box-shadow: 0 0 10px rgba(231, 76, 60, 0.5) !important;
        }

        /* === 14. 战斗模式特殊效果 === */
        
        @keyframes dnd-combat-pulse {
            0%, 100% {
                border-color: rgba(138, 44, 44, 0.6);
                box-shadow: 0 0 0 2px rgba(0,0,0,0.5),
                            0 0 0 4px rgba(138, 44, 44, 0.4),
                            0 0 20px rgba(138, 44, 44, 0.2);
            }
            50% {
                border-color: rgba(192, 57, 43, 0.8);
                box-shadow: 0 0 0 2px rgba(0,0,0,0.5),
                            0 0 0 4px rgba(192, 57, 43, 0.6),
                            0 0 30px rgba(192, 57, 43, 0.4);
            }
        }
        
        #dnd-mini-hud.dnd-combat-mode {
            animation: dnd-combat-pulse 2s ease-in-out infinite !important;
        }
        
        #dnd-mini-hud.dnd-combat-mode .dnd-hud-header {
            background: linear-gradient(to right,
                rgba(138, 44, 44, 0.3),
                rgba(92, 75, 53, 0.1),
                transparent) !important;
        }

        /* === 15. 文字渐显效果 === */
        
        @keyframes dnd-text-reveal {
            0% {
                opacity: 0;
                transform: translateY(10px);
                filter: blur(5px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
                filter: blur(0);
            }
        }
        
        .dnd-text-reveal {
            animation: dnd-text-reveal 0.5s ease-out forwards !important;
        }
        
        .dnd-text-reveal-delay-1 { animation-delay: 0.1s !important; }
        .dnd-text-reveal-delay-2 { animation-delay: 0.2s !important; }
        .dnd-text-reveal-delay-3 { animation-delay: 0.3s !important; }

        /* === 16. Logo 容器增强 === */
        
        #dnd-logo-container {
            position: relative !important;
        }
        
        #dnd-logo-container::before {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            background: conic-gradient(
                from 0deg,
                transparent 0deg,
                rgba(255, 219, 133, 0.4) 45deg,
                transparent 90deg,
                transparent 180deg,
                rgba(157, 139, 108, 0.3) 225deg,
                transparent 270deg
            );
            animation: dnd-ring-sweep 6s linear infinite;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        #dnd-logo-container:hover::before {
            opacity: 1;
        }
        
        .dnd-logo-text {
            transition: all 0.3s ease !important;
        }
        
        #dnd-logo-container:hover .dnd-logo-text {
            text-shadow: 0 2px 4px rgba(0,0,0,0.8),
                         0 0 20px rgba(255, 219, 133, 0.5) !important;
            transform: scale(1.1) !important;
        }

        /* === 17. 列表项交错入场 === */
        
        .dnd-stagger-enter > * {
            opacity: 0;
            animation: dnd-slide-up-fade 0.4s ease forwards;
        }
        
        .dnd-stagger-enter > *:nth-child(1) { animation-delay: 0.05s; }
        .dnd-stagger-enter > *:nth-child(2) { animation-delay: 0.1s; }
        .dnd-stagger-enter > *:nth-child(3) { animation-delay: 0.15s; }
        .dnd-stagger-enter > *:nth-child(4) { animation-delay: 0.2s; }
        .dnd-stagger-enter > *:nth-child(5) { animation-delay: 0.25s; }
        .dnd-stagger-enter > *:nth-child(6) { animation-delay: 0.3s; }
        .dnd-stagger-enter > *:nth-child(7) { animation-delay: 0.35s; }
        .dnd-stagger-enter > *:nth-child(8) { animation-delay: 0.4s; }
        .dnd-stagger-enter > *:nth-child(9) { animation-delay: 0.45s; }
        .dnd-stagger-enter > *:nth-child(10) { animation-delay: 0.5s; }

        /* === 18. 闪烁光标效果 === */
        
        @keyframes dnd-cursor-blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        .dnd-typing-cursor::after {
            content: '|';
            animation: dnd-cursor-blink 1s step-end infinite;
            color: var(--dnd-text-highlight);
            margin-left: 2px;
        }

        /* === 19. 悬浮信息卡片 3D 翻转 === */
        
        .dnd-flip-card {
            perspective: 1000px !important;
        }
        
        .dnd-flip-card-inner {
            transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            transform-style: preserve-3d !important;
        }
        
        .dnd-flip-card:hover .dnd-flip-card-inner {
            transform: rotateY(180deg) !important;
        }
        
        .dnd-flip-card-front,
        .dnd-flip-card-back {
            backface-visibility: hidden !important;
        }
        
        .dnd-flip-card-back {
            transform: rotateY(180deg) !important;
        }

        /* === 20. 工具提示增强 === */
        
        [data-tooltip] {
            position: relative !important;
        }
        
        [data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-5px) scale(0.8);
            background: rgba(0, 0, 0, 0.9);
            color: var(--dnd-text-main);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 11px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border: 1px solid var(--dnd-border-inner);
            z-index: 1000;
        }
        
        [data-tooltip]:hover::after {
            opacity: 1;
            transform: translateX(-50%) translateY(-10px) scale(1);
        }

        `;
