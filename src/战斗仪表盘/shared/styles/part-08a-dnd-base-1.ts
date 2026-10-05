/**
 * part-08a-dnd-base-1.ts — 从 DND `ui/styles.js` 拆分（b3 · 2026-10-05）
 * 来源：DND5E_Dashboard_BasedonST-main @ port-baseline（v2.0.5）
 * 内容保持原样（含缩进与顺序）；dnd- 前缀隔离，与 acu-* 无交集。
 */
export const STYLES_PART_08A_DND_BASE_1 = `
        :root {
            /* ====== 颜色变量 ====== */
            --dnd-bg-main: #0f0b0a;
            --dnd-bg-panel-start: #2b1b17;
            --dnd-bg-panel-end: #1a100e;
            --dnd-bg-card-start: #242424;
            --dnd-bg-card-end: #1a1a1c;
            --dnd-bg-panel: linear-gradient(to bottom, var(--dnd-bg-panel-start), var(--dnd-bg-panel-end));
            --dnd-bg-card: linear-gradient(135deg, var(--dnd-bg-card-start) 0%, var(--dnd-bg-card-end) 100%);
            --dnd-bg-hud: linear-gradient(to bottom, var(--dnd-bg-panel-start), var(--dnd-bg-panel-end));
            --dnd-bg-popup: linear-gradient(to bottom, rgba(28, 28, 30, 0.99), rgba(18, 18, 20, 0.99));
            --dnd-bg-item: rgba(255,255,255,0.03);
            --dnd-bg-slot: rgba(0, 0, 0, 0.5);
            --dnd-border-gold: #9d8b6c;
            --dnd-border-inner: #5c4b35;
            --dnd-text-main: #dcd0c0;
            --dnd-text-header: #e6dcca;
            --dnd-text-highlight: #ffdb85;
            --dnd-text-dim: #888;
            --dnd-accent-red: #8a2c2c;
            --dnd-accent-green: #3a6b4a;
            --dnd-accent-blue: #2c4c8a;
            --dnd-shadow: 0 0 10px rgba(0,0,0,0.8);
            
            /* ====== 字体变量 ====== */
            --dnd-font-serif: 'Times New Roman', 'Songti SC', 'SimSun', serif;
            --dnd-font-sans: 'Segoe UI', 'Microsoft YaHei', sans-serif;
            --dnd-font-size-xs: 10px;
            --dnd-font-size-sm: 12px;
            --dnd-font-size-md: 14px;
            --dnd-font-size-lg: 16px;
            --dnd-font-size-xl: 18px;
            
            /* ====== 圆角变量 ====== */
            --dnd-radius-sm: 4px;
            --dnd-radius-md: 6px;
            --dnd-radius-lg: 8px;
            
            /* ====== 间距变量 ====== */
            --dnd-spacing-xs: 4px;
            --dnd-spacing-sm: 8px;
            --dnd-spacing-md: 12px;
            --dnd-spacing-lg: 20px;
            
            /* ====== 阴影变量 ====== */
            --dnd-shadow-sm: 0 2px 5px rgba(0,0,0,0.4);
            --dnd-shadow-md: 0 4px 15px rgba(0,0,0,0.5);
            --dnd-shadow-lg: 0 8px 25px rgba(0,0,0,0.6);
            
            /* ====== 过渡动画变量 ====== */
            --dnd-transition-fast: 0.15s ease;
            --dnd-transition-normal: 0.25s ease;
            --dnd-transition-slow: 0.4s ease;
            
            /* ====== 形态变量 (Morphology) ====== */
            /* 边框形态 */
            --dnd-border-style: solid;
            --dnd-border-width: 1px;
            --dnd-border-double-width: 3px;
            --dnd-border-outer-style: solid;
            
            /* 角部形态: 'rounded' | 'chamfer' | 'notched' | 'angular' */
            --dnd-corner-clip: none;
            --dnd-card-clip-path: none;
            
            /* 卡片形态 */
            --dnd-card-shape: rectangle;
            --dnd-card-aspect-ratio: auto;
            --dnd-card-skew: 0deg;
            --dnd-card-perspective: none;
            --dnd-card-decoration: none;
            
            /* 装饰元素 */
            --dnd-corner-ornament: none;
            --dnd-divider-style: solid;
            --dnd-divider-ornament: none;
            --dnd-header-decoration: none;
            
            /* 特效层 */
            --dnd-effect-overlay: none;
            --dnd-effect-inner-glow: none;
            --dnd-effect-border-glow: none;
            --dnd-effect-emboss: none;
            --dnd-effect-texture: none;
            
            /* 布局密度 */
            --dnd-layout-density: normal;
            --dnd-card-min-width: 280px;
            --dnd-card-max-width: 1fr;
            --dnd-grid-gap: 15px;
            
            /* 图标容器形态 */
            --dnd-icon-shape: circle;
            --dnd-icon-border-style: solid;
            --dnd-avatar-shape: circle;
            
            /* 按钮形态 */
            --dnd-btn-shape: rounded;
            --dnd-btn-style: filled;
            
            /* 进度条形态 */
            --dnd-bar-shape: rounded;
            --dnd-bar-style: gradient;
            --dnd-bar-segments: 0;
            
            /* ====== 功能性颜色变量 ====== */
            /* 进度条颜色 */
            --dnd-bar-hp-start: #8a2c2c;
            --dnd-bar-hp-end: #c0392b;
            --dnd-bar-exp-start: #8e44ad;
            --dnd-bar-exp-end: #9b59b6;
            --dnd-bar-bg: #222;
            
            /* 装饰元素颜色 */
            --dnd-ornament-color: var(--dnd-border-gold);
            --dnd-logo-bg-start: #2a2a2e;
            --dnd-logo-bg-end: #1a1a1c;
            
            /* 次要背景色 */
            --dnd-bg-secondary: #222;
            --dnd-bg-tertiary: #333;
            --dnd-bg-input: #1a1a1c;
            --dnd-border-subtle: #444;
            
            /* 稀有度颜色 */
            --dnd-rarity-common-bg: #555;
            --dnd-rarity-common-text: #ccc;
            --dnd-rarity-uncommon-bg: #1a5c1a;
            --dnd-rarity-uncommon-text: #5f5;
            --dnd-rarity-rare-bg: #1a3a6c;
            --dnd-rarity-rare-text: #5af;
            --dnd-rarity-veryrare-bg: #5c1a5c;
            --dnd-rarity-veryrare-text: #f5f;
            --dnd-rarity-legendary-bg: #6c4a1a;
            --dnd-rarity-legendary-text: #fa5;
            
            /* Toast/通知颜色 */
            --dnd-toast-info: #3498db;
            --dnd-toast-success: #2ecc71;
            --dnd-toast-warning: #f39c12;
            --dnd-toast-error: #e74c3c;
            
            /* 反色文本 (用于亮背景) */
            --dnd-text-inverse: #000;
            --dnd-text-inverse-dark: #2b1b17;
            
            /* ====== 交互状态变量 (Interactive States) ====== */
            /* 悬浮效果 (Hover) */
            --dnd-hover-brightness: 1.1;
            --dnd-hover-scale: 1.02;
            --dnd-hover-lift: -3px;
            --dnd-hover-shadow: 0 8px 25px rgba(0,0,0,0.4);
            --dnd-hover-border-color: var(--dnd-border-gold);
            --dnd-hover-glow: none;
            --dnd-hover-transition: var(--dnd-transition-normal);
            
            /* 卡片悬浮 */
            --dnd-card-hover-transform: translateY(-8px) rotateX(3deg) rotateY(-2deg) scale(1.02);
            --dnd-card-hover-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(157, 139, 108, 0.15);
            --dnd-card-hover-border-color: var(--dnd-border-gold);
            
            /* 按钮悬浮 */
            --dnd-btn-hover-brightness: 1.15;
            --dnd-btn-hover-transform: translateY(-2px);
            --dnd-btn-hover-shadow: 0 4px 12px rgba(0,0,0,0.3);
            
            /* 点击效果 (Active/Pressed) */
            --dnd-active-scale: 0.96;
            --dnd-active-brightness: 0.95;
            --dnd-active-transform: translateY(1px) scale(0.96);
            --dnd-active-shadow: 0 2px 5px rgba(0,0,0,0.3);
            
            /* 按钮点击 */
            --dnd-btn-active-transform: translateY(0) scale(0.98);
            --dnd-btn-active-shadow: 0 1px 3px rgba(0,0,0,0.2);
            
            /* 选中状态 (Selected/Active Class) */
            --dnd-selected-bg: linear-gradient(90deg, rgba(157, 139, 108, 0.2), transparent);
            --dnd-selected-border-color: var(--dnd-text-highlight);
            --dnd-selected-border-width: 2px;
            --dnd-selected-glow: 0 0 10px rgba(157, 139, 108, 0.3);
            --dnd-selected-text-color: var(--dnd-text-highlight);
            
            /* 导航选中 */
            --dnd-nav-active-bg: linear-gradient(90deg, rgba(157, 139, 108, 0.2), transparent);
            --dnd-nav-active-border: 3px solid var(--dnd-text-highlight);
            --dnd-nav-active-indicator: var(--dnd-text-highlight);
            
            /* 聚焦状态 (Focus) */
            --dnd-focus-border-color: var(--dnd-border-gold);
            --dnd-focus-shadow: 0 0 0 3px rgba(157, 139, 108, 0.2);
            --dnd-focus-outline: none;
            
            /* 禁用状态 (Disabled) */
            --dnd-disabled-opacity: 0.5;
            --dnd-disabled-cursor: not-allowed;
            --dnd-disabled-filter: grayscale(0.5);
            
            /* 图标悬浮光晕 */
            --dnd-icon-hover-glow: drop-shadow(0 0 5px currentColor);
            --dnd-icon-hover-scale: 1.1;
            
            /* 输入框聚焦 */
            --dnd-input-focus-border: var(--dnd-border-gold);
            --dnd-input-focus-shadow: 0 0 0 2px rgba(157, 139, 108, 0.15);
        }

        /* 网格布局 */
        .dnd-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
            gap: 15px !important;
            padding: 10px !important;
        }

        /* 卡片通用样式 */
        .dnd-char-card {
            background: var(--dnd-bg-card) !important;
            /* Morphology: Border */
            border: var(--dnd-border-width, 1px) var(--dnd-border-style, solid) var(--dnd-border-inner) !important;
            outline: var(--dnd-border-outer-style, none) !important; /* Outer border simulation */
            border-radius: var(--dnd-radius-md, 6px) !important;
            overflow: hidden !important;
            transition: all var(--dnd-transition-normal, 0.2s) !important;
            /* Combine standard shadow with glow effects */
            box-shadow: var(--dnd-shadow-md, 0 4px 15px rgba(0,0,0,0.3)), var(--dnd-effect-border-glow, none), var(--dnd-effect-inner-glow, none) !important;
            display: flex !important;
            flex-direction: column !important;
            
            /* Morphology: Shape & Transform */
            clip-path: var(--dnd-card-clip-path, none) !important;
            transform: var(--dnd-card-transform, none) !important;
            position: relative !important;
        }
        
        /* Morphology: Texture & Effects Layer */
        .dnd-char-card::before {
            content: "" !important;
            position: absolute !important;
            top: 0; left: 0; right: 0; bottom: 0;
            background: var(--dnd-effect-texture, none) !important;
            opacity: 1 !important;
            pointer-events: none !important;
            z-index: 0 !important;
            mix-blend-mode: overlay !important;
        }
        .dnd-char-card::after {
            content: "" !important;
            position: absolute !important;
            top: 0; left: 0; right: 0; bottom: 0;
            background: var(--dnd-effect-overlay, none) !important;
            opacity: 1 !important;
            pointer-events: none !important;
            z-index: 1 !important;
        }
        
        .dnd-char-card:hover {
            border-color: var(--dnd-card-hover-border-color, var(--dnd-border-gold)) !important;
            /* Preserve transform but allow hover lift if not using complex transform */
            transform: var(--dnd-card-hover-transform, translateY(-4px)) !important;
            box-shadow: var(--dnd-card-hover-shadow, 0 8px 25px rgba(0,0,0,0.5)) !important;
            z-index: 10 !important;
        }

        /* 风格选择卡片 - 支持 Morphology */
        .dnd-style-card {
            padding: 12px !important;
            background: var(--dnd-bg-card) !important;
            /* Morphology Support */
            border: var(--dnd-border-width, 1px) var(--dnd-border-style, solid) var(--dnd-border-subtle) !important;
            border-radius: var(--dnd-radius-md, 6px) !important;
            cursor: pointer !important;
            text-align: center !important;
            transition: all 0.2s !important;
            position: relative !important;
            overflow: hidden !important;
            
            /* Morphology Shape */
            clip-path: var(--dnd-card-clip-path, none) !important;
            transform: var(--dnd-card-transform, none) !important;
        }
        
        /* 纹理叠加 */
        .dnd-style-card::before {
            content: "" !important;
            position: absolute !important;
            top: 0; left: 0; right: 0; bottom: 0;
            background: var(--dnd-effect-texture, none) !important;
            opacity: 0.5 !important;
            pointer-events: none !important;
            z-index: 0 !important;
            mix-blend-mode: overlay !important;
        }
        
        .dnd-style-card.active {
            background: var(--dnd-selected-bg) !important;
            border-color: var(--dnd-border-gold) !important;
        }
        
        .dnd-style-card:hover {
            border-color: var(--dnd-border-gold) !important;
            transform: var(--dnd-card-transform, none) translateY(-2px) !important;
        }

        .dnd-card-header {
            padding: 10px 12px !important;
            background: rgba(255,255,255,0.03) !important;
            border-bottom: 1px var(--dnd-divider-style, solid) var(--dnd-border-inner) !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            position: relative !important;
            z-index: 2 !important; /* Ensure content is above effects */
        }
        .dnd-char-name {
            font-family: var(--dnd-font-serif) !important;
            font-size: 16px !important;
            font-weight: bold !important;
            color: var(--dnd-text-header) !important;
            text-shadow: 0 0 5px rgba(0,0,0,0.5) !important;
        }
        .dnd-char-lvl {
            font-size: 11px !important;
            color: var(--dnd-text-dim) !important;
            margin-top: 2px !important;
        }

        .dnd-card-body {
            padding: 12px !important;
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            color: var(--dnd-text-main) !important;
            font-size: 13px !important;
            position: relative !important;
            z-index: 2 !important; /* Ensure content is above effects */
        }

        /* 属性行 */
        .dnd-stat-row {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 4px 8px !important;
            background: rgba(0,0,0,0.2) !important;
            border-radius: 4px !important;
        }
        .dnd-stat-label { color: var(--dnd-text-dim) !important; font-size: 12px !important; }
        .dnd-stat-val { font-weight: bold !important; color: var(--dnd-text-highlight) !important; }

        /* 进度条 */
        .dnd-bar-container {
            height: 6px !important;
            background: rgba(0,0,0,0.5) !important;
            border-radius: 3px !important;
            overflow: hidden !important;
            margin-top: 2px !important;
        }
        .dnd-bar-fill { height: 100% !important; border-radius: 3px !important; transition: width 0.3s !important; }
        .dnd-bar-hp .dnd-bar-fill { background: linear-gradient(90deg, var(--dnd-bar-hp-start), var(--dnd-bar-hp-end)) !important; }
        .dnd-bar-exp .dnd-bar-fill { background: linear-gradient(90deg, var(--dnd-bar-exp-start), var(--dnd-bar-exp-end)) !important; }

        /* 导航侧边栏 */
        .dnd-nav-sidebar {
            width: 200px !important;
            background: var(--dnd-bg-hud) !important;
            border-right: var(--dnd-border-width, 1px) var(--dnd-divider-style, solid) var(--dnd-border-inner) !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 10px 0 !important;
            flex-shrink: 0 !important;
            position: relative !important;
            
            /* Morphology support */
            background-image: var(--dnd-effect-texture, none) !important;
        }
        
        /* 侧边栏纹理层 */
        .dnd-nav-sidebar::before {
            content: "" !important;
            position: absolute !important;
            top: 0; left: 0; right: 0; bottom: 0 !important;
            background: var(--dnd-effect-overlay, none) !important;
            pointer-events: none !important;
            z-index: 0 !important;
        }
        
        .dnd-nav-item {
            padding: 12px 20px !important;
            cursor: pointer !important;
            color: var(--dnd-text-main) !important;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            border-left: var(--dnd-border-width, 3px) solid transparent !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            font-size: 14px !important;
            position: relative !important;
            z-index: 1 !important;
            overflow: hidden !important;
            
            /* Morphology support */
            border-radius: 0 var(--dnd-radius-md, 6px) var(--dnd-radius-md, 6px) 0 !important;
            margin-bottom: 2px !important;
        }
        
        /* 导航项悬停 - 更加明显的滑动光效 */
        .dnd-nav-item::before {
            content: "" !important;
            position: absolute !important;
            top: 0; left: 0; bottom: 0; right: 0;
            background: linear-gradient(90deg, rgba(157, 139, 108, 0.15), transparent) !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease-out !important;
            z-index: -1 !important;
        }
        .dnd-nav-item:hover::before {
            transform: translateX(0) !important;
        }
        
        .dnd-nav-item:hover {
            color: var(--dnd-selected-text-color, var(--dnd-text-highlight)) !important;
            padding-left: 25px !important; /* 悬停时轻微右移 */
            text-shadow: 0 0 8px rgba(255, 219, 133, 0.4) !important;
        }
        
        .dnd-nav-item.active {
            background: var(--dnd-nav-active-bg, linear-gradient(90deg, rgba(157, 139, 108, 0.2), transparent)) !important;
            border-left-color: var(--dnd-nav-active-indicator, var(--dnd-border-gold)) !important;
            color: var(--dnd-selected-text-color, var(--dnd-text-highlight)) !important;
            text-shadow: 0 0 10px rgba(255, 219, 133, 0.6) !important;
            font-weight: bold !important;
        }
        
        /* 选中状态的光晕 */
        .dnd-nav-item.active::after {
            content: "" !important;
            position: absolute !important;
            left: 0; top: 0; bottom: 0;
            width: 4px;
            background: var(--dnd-nav-active-indicator, var(--dnd-border-gold)) !important;
            box-shadow: var(--dnd-selected-glow, 0 0 15px var(--dnd-border-gold)) !important;
        }

        /* 内容区域 */
        .dnd-content-area {
            flex: 1 !important;
            overflow-y: auto !important;
            padding: 20px !important;
            background: var(--dnd-bg-main) !important;
        }

        /* 滚动条美化 */
        .dnd-detail-body::-webkit-scrollbar,
        .dnd-content-area::-webkit-scrollbar,
        .dnd-hud-party-stats::-webkit-scrollbar,
        .dnd-party-list::-webkit-scrollbar,
        .dnd-hud-minimap::-webkit-scrollbar {
            width: 6px !important;
            height: 6px !important;
        }
        .dnd-detail-body::-webkit-scrollbar-track,
        .dnd-content-area::-webkit-scrollbar-track,
        .dnd-hud-party-stats::-webkit-scrollbar-track,
        .dnd-party-list::-webkit-scrollbar-track,
        .dnd-hud-minimap::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2) !important;
        }
        .dnd-detail-body::-webkit-scrollbar-thumb,
        .dnd-content-area::-webkit-scrollbar-thumb,
        .dnd-hud-party-stats::-webkit-scrollbar-thumb,
        .dnd-party-list::-webkit-scrollbar-thumb,
        .dnd-hud-minimap::-webkit-scrollbar-thumb {
            background: var(--dnd-border-inner) !important;
            border-radius: 3px !important;
        }
        .dnd-detail-body::-webkit-scrollbar-thumb:hover,
        .dnd-content-area::-webkit-scrollbar-thumb:hover,
        .dnd-hud-party-stats::-webkit-scrollbar-thumb:hover,
        .dnd-party-list::-webkit-scrollbar-thumb:hover,
        .dnd-hud-minimap::-webkit-scrollbar-thumb:hover {
            background: var(--dnd-border-gold) !important;
        }

        /* 角色详情卡入场动画 */
        @keyframes dnd-card-in {
            0% {
                opacity: 0;
                transform: scale(0.92) translateY(-15px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        /* [新增] 淡出动画 */
        @keyframes dnd-fade-out {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0.95);
            }
        }
        
        @keyframes dnd-slide-out-left {
            0% {
                opacity: 1;
                transform: translateX(0);
            }
            100% {
                opacity: 0;
                transform: translateX(-30px);
            }
        }

        /* 角色详情卡 - 动态定位版本 (使用 block 布局) */
        .dnd-char-detail-card {
            position: fixed !important;
            /* 不再使用固定的 top/left，由 JS 动态设置 */
            width: 380px !important;
            max-width: 92vw !important;
            max-height: 85vh !important;
            background: var(--dnd-bg-popup) !important;
            border: 1px solid var(--dnd-border-gold) !important;
            border-radius: 8px !important;
            box-shadow: var(--dnd-shadow) !important;
            z-index: 2147483643 !important; /* Raised above Dashboard */
            color: var(--dnd-text-main) !important;
            font-family: var(--dnd-font-sans) !important;
            overflow: hidden !important;
            
            display: none; /* 默认隐藏，使用 display none/block 方式 */
        }
        .dnd-char-detail-card.visible {
            display: block !important;
            animation: dnd-card-in 0.25s ease-out forwards !important;
        }

        .dnd-detail-header {
            padding: 10px 15px !important;
            background: linear-gradient(to right, var(--dnd-bg-card-end), var(--dnd-bg-main)) !important;
            border-bottom: 1px solid var(--dnd-border-inner) !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }
        .dnd-detail-close {
            cursor: pointer !important;
            padding: 5px !important;
            color: var(--dnd-text-dim) !important;
        }
        .dnd-detail-close:hover { color: var(--dnd-text-highlight) !important; }

        .dnd-detail-info {
            flex: 1 !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
        }
        .dnd-detail-name {
            font-size: 18px !important;
            font-weight: bold !important;
            color: var(--dnd-text-highlight) !important;
            font-family: var(--dnd-font-serif) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }
        .dnd-detail-sub {
            font-size: 12px !important;
            color: var(--dnd-text-dim) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }
        .dnd-detail-stats-row {
            display: flex !important;
            justify-content: space-between !important;
            font-size: 13px !important;
            text-align: center !important;
            margin-bottom: 10px !important;
            padding: 0 10px !important;
        }

        .dnd-detail-body {
            padding: 15px !important;
            overflow-y: auto !important;
            flex: 1 !important;
        }
        
        .dnd-attr-grid {
            display: grid !important;
            grid-template-columns: repeat(6, 1fr) !important;
            gap: 5px !important;
            margin: 15px 0 !important;
            background: rgba(0,0,0,0.3) !important;
            padding: 8px !important;
            border-radius: 4px !important;
        }
        .dnd-attr-box {
            text-align: center !important;
        }
        .dnd-attr-val { font-size: 14px !important; font-weight: bold !important; color: var(--dnd-text-header) !important; }
        .dnd-attr-mod { font-size: 10px !important; color: var(--dnd-text-dim) !important; }
        .dnd-attr-lbl { font-size: 9px !important; color: var(--dnd-text-dim) !important; margin-top: 2px !important; }

        .dnd-detail-section { margin-bottom: 15px !important; }
        .dnd-detail-title {
            font-size: 12px !important;
            color: var(--dnd-text-highlight) !important;
            border-bottom: 1px solid var(--dnd-border-inner) !important;
            padding-bottom: 3px !important;
            margin-bottom: 8px !important;
            display: flex !important;
            justify-content: space-between !important;
            cursor: pointer !important;
        }
        
        .dnd-tag-list { display: flex !important; flex-wrap: wrap !important; gap: 5px !important; }
        .dnd-tag {
            background: rgba(255,255,255,0.08) !important;
            padding: 4px 8px !important;
            border-radius: 4px !important;
            font-size: 12px !important;
            cursor: pointer !important;
            border: 1px solid transparent !important;
            transition: all 0.2s !important;
        }
        .dnd-tag:hover, .dnd-tag.active {
            background: rgba(197, 160, 89, 0.2) !important;
            border-color: var(--dnd-border-gold) !important;
            color: var(--dnd-text-highlight) !important;
        }

        /* 入场动画 keyframes */
        @keyframes dnd-fade-scale-in {
            0% {
                opacity: 0;
                transform: scale(0.9) translateY(-10px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        @keyframes dnd-popup-in {
            0% {
                opacity: 0;
                transform: scale(0.85) translateY(-8px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        /* 详情悬浮窗遮罩层 - 用于捕获点击关闭 */
        .dnd-popup-backdrop {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: transparent !important;
            z-index: 2147483644 !important;
            display: none;
        }
        .dnd-popup-backdrop.visible {
            display: block !important;
        }

        /* 详情悬浮窗 */
        .dnd-detail-popup {
            position: fixed !important;
            background: var(--dnd-bg-panel) !important;
            border: 1px solid var(--dnd-border-gold) !important;
            padding: 12px !important;
            z-index: 2147483645 !important; /* Highest priority */
            box-shadow: 0 5px 25px rgba(0,0,0,0.9), var(--dnd-effect-border-glow, none) !important;
            width: auto !important;
            min-width: 200px !important;
            max-width: 90vw !important;
            color: var(--dnd-text-main) !important;
            border-radius: 4px !important;
            font-size: 13px !important;
            display: none; /* 默认隐藏，不使用 !important 以便 JS 控制 */
        }
        .dnd-detail-popup.visible {
            display: block !important;
            animation: dnd-popup-in 0.2s ease-out forwards !important;
        }
        .dnd-detail-popup.dnd-measuring {
            display: block !important;
        }

        /* 全局重置 (针对 HUD 内部) */
        #dnd-dashboard-root *, 
        #dnd-mini-hud *,
        #dnd-tooltip * {
            box-sizing: border-box !important;
        }

        /* 主容器 - 浮动在页面上 */
        #dnd-dashboard-root {
            position: fixed !important;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.85) !important;
            z-index: 2147483642 !important;
            display: none;
            flex-direction: column;
            color: var(--dnd-text-main) !important;
            font-family: var(--dnd-font-sans) !important;
            backdrop-filter: blur(5px);
        }

        #dnd-dashboard-root.visible {
            display: flex !important;
        }
        
        #dnd-dashboard-root .dnd-main-container {
            display: flex !important;
            flex: 1 !important;
            overflow: hidden !important;
            width: 100% !important;
        }

        /* 物品列表面板 */
        .dnd-inventory-panel {
            position: fixed !important;
            background: var(--dnd-bg-panel) !important;
            border: 1px solid var(--dnd-border-gold) !important;
            border-radius: 6px !important;
            padding: 10px !important;
            z-index: 2147483645 !important;
            box-shadow: 0 5px 25px rgba(0,0,0,0.9) !important;
            width: 250px !important;
            max-width: 90vw !important;
            max-height: 60vh !important;
            overflow-y: auto !important;
            display: none;
            flex-direction: column !important;
            gap: 5px !important;
        }
        .dnd-inventory-panel.visible {
            display: flex !important;
            animation: dnd-popup-in 0.2s ease-out forwards !important;
        }
        .dnd-inv-panel-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            border-bottom: 1px solid var(--dnd-border-inner) !important;
            padding-bottom: 5px !important;
            margin-bottom: 5px !important;
            font-weight: bold !important;
            color: var(--dnd-text-header) !important;
        }
        .dnd-inv-list-item {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 6px 8px !important;
            background: var(--dnd-bg-item) !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            transition: background 0.2s !important;
            font-size: 13px !important;
        }
        .dnd-inv-list-item:hover {
            background: rgba(255,255,255,0.1) !important;
            color: var(--dnd-text-highlight) !important;
        }
        .dnd-inv-btn {
            background: rgba(0,0,0,0.3) !important;
            border: 1px solid var(--dnd-border-inner) !important;
            color: var(--dnd-text-main) !important;
            padding: 6px 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            font-size: 12px !important;
            flex: 1 !important;
            justify-content: center !important;
            transition: all 0.2s !important;
        }
        .dnd-inv-btn:hover {
            background: rgba(255,255,255,0.1) !important;
            border-color: var(--dnd-border-gold) !important;
            color: var(--dnd-text-highlight) !important;
        }

        /* 势力声望面板 */
        .dnd-faction-item {
            background: rgba(255,255,255,0.03) !important;
            border-bottom: 1px solid rgba(255,255,255,0.05) !important;
            padding: 10px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 5px !important;
        }
        .dnd-faction-item:last-child { border-bottom: none !important; }
        .dnd-faction-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            font-weight: bold !important;
        }
        .dnd-faction-rep-bar {
            height: 4px !important;
            background: var(--dnd-bar-bg) !important;
            border-radius: 2px !important;
            overflow: hidden !important;
            position: relative !important;
            margin-top: 4px !important;
        }
        .dnd-faction-rep-fill {
            height: 100% !important;
            transition: width 0.3s !important;
        }

        /* 简略版 HUD */
        #dnd-mini-hud {
            position: fixed !important;
            /* 移除 !important 以便 JS 覆盖，设置回退值 */
            top: 60px;
            left: 10px;
            width: 480px !important; /* 桌面端固定宽度 */
            max-width: 90vw !important;
            max-height: 85vh !important;
            display: flex !important;
            flex-direction: column !important;
            
            background: var(--dnd-bg-hud) !important;
            
            /* Morphology: Border */
            border: var(--dnd-border-width, 2px) var(--dnd-border-style, solid) var(--dnd-border-inner) !important;
            border-radius: var(--dnd-radius-lg, 8px) !important;
            box-shadow: 0 0 0 2px rgba(0,0,0,0.5), 0 0 0 4px var(--dnd-border-gold), var(--dnd-shadow), var(--dnd-effect-border-glow, none), var(--dnd-effect-inner-glow, none) !important;
            
            /* Morphology: Shape */
            clip-path: var(--dnd-card-clip-path, none) !important;
            
            overflow: visible !important;
            font-family: var(--dnd-font-sans) !important;
            z-index: 2147483640 !important; /* Lower than Dashboard */
            
            /* 动画初始状态 */
            opacity: 0 !important;
            transform: translateX(-30px) !important;
            pointer-events: none !important;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            
            color: var(--dnd-text-main) !important;
            margin: 0 !important;
        }
        
        /* HUD 纹理层 */
        #dnd-mini-hud > .dnd-hud-body::before {
            content: "" !important;
            position: absolute !important;
            top: 0; left: 0; right: 0; bottom: 0 !important;
            background: var(--dnd-effect-texture, none) !important;
            opacity: 0.5 !important;
            pointer-events: none !important;
            z-index: 0 !important;
            mix-blend-mode: overlay !important;
        }
        #dnd-mini-hud::before {
            content: '❖';
            position: absolute;
            top: 4px;
            left: 4px;
            color: var(--dnd-ornament-color);
            font-size: 14px;
            pointer-events: none;
            z-index: 10;
        }
        #dnd-mini-hud::after {
            content: '❖';
            position: absolute;
            top: 4px;
            right: 4px;
            color: var(--dnd-ornament-color);
            font-size: 14px;
            pointer-events: none;
            z-index: 10;
        }
        #dnd-mini-hud.visible {
            opacity: 1 !important;
            transform: translateX(0) !important;
            pointer-events: auto !important;
        }
        
        /* 任务悬浮详情 */
        .dnd-quest-tooltip {
            position: fixed !important;
            background: var(--dnd-bg-panel) !important;
            border: 1px solid var(--dnd-border-gold) !important;
            padding: 15px !important;
            z-index: 2147483645 !important; /* Highest priority */
            box-shadow: 0 5px 25px rgba(0,0,0,0.9) !important;
            width: 300px !important;
            max-width: 90vw !important;
            display: none !important;
            color: var(--dnd-text-main) !important;
            border-radius: 4px !important;
        }
        .dnd-quest-tooltip.visible { 
            display: block !important; 
            animation: dnd-popup-in 0.2s ease-out forwards !important;
        }

        /* HUD 顶部栏 */
        .dnd-hud-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important; /* 改为居中对齐，更美观 */
            padding: 10px 15px !important; /* 增加内边距 */
            background: linear-gradient(to right, rgba(var(--dnd-border-inner-rgb, 92, 75, 53), 0.1), transparent) !important;
            border-bottom: 1px solid var(--dnd-border-inner) !important;
            font-size: 14px !important;
            color: var(--dnd-text-main) !important;
            line-height: normal !important;
            flex-shrink: 0 !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important; /* 增加阴影 */
        }
        .dnd-hud-status { 
            display: flex !important; 
            flex-direction: column !important; 
            gap: 2px !important; 
            flex: 1 !important; 
            overflow: hidden !important; 
            min-width: 0 !important; 
            margin-left: 12px !important; /* 与 Logo 保持距离 */
        }
        
        /* Logo 容器 */
        #dnd-logo-container {
            width: 42px !important;
            height: 42px !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, var(--dnd-logo-bg-start) 0%, var(--dnd-logo-bg-end) 100%) !important;
            border: 2px solid var(--dnd-border-gold) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 0 10px rgba(var(--dnd-border-gold-rgb, 157, 139, 108), 0.3) !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            flex-shrink: 0 !important;
        }
        #dnd-logo-container:hover {
            transform: scale(1.05) rotate(5deg) !important;
            box-shadow: 0 0 15px rgba(var(--dnd-border-gold-rgb, 157, 139, 108), 0.6) !important;
            border-color: var(--dnd-text-highlight) !important;
        }
        #dnd-logo-container:active {
            transform: scale(0.95) !important;
        }
        .dnd-logo-text {
            font-family: var(--dnd-font-serif) !important;
            font-weight: bold !important;
            font-size: 20px !important;
            color: var(--dnd-text-highlight) !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.8) !important;
        }
        
        /* 位置文本样式优化 */
        .dnd-location-text {
            font-weight: bold !important;
            color: var(--dnd-text-highlight) !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            line-height: 1.4 !important;
            max-height: 1.4em !important;
            transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            word-break: break-word !important;
        }
        .dnd-location-text.dnd-expanded {
            -webkit-line-clamp: unset !important;
            max-height: 10em !important;
        }

        .dnd-hud-info-row {
            display: flex !important;
            align-items: center !important;
            font-size: 12px !important;
            color: var(--dnd-text-main) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            opacity: 0.9 !important;
        }
        
        .dnd-hud-expand-btn {
            background: transparent !important;
            border: 1px solid transparent !important;
            color: var(--dnd-text-highlight) !important;
            cursor: pointer !important;
            font-size: 12px !important;
            display: flex !important;
            align-items: center !important;
            gap: 5px !important;
            padding: 2px 8px !important;
            margin: 0 !important;
            line-height: normal !important;
            text-decoration: none !important;
            box-shadow: none !important;
            height: auto !important;
            width: auto !important;
        }
        .dnd-hud-expand-btn:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: var(--dnd-border-inner) !important;
            text-decoration: none !important;
        }
`;
