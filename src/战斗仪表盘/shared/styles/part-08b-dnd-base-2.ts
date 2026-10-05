/**
 * part-08b-dnd-base-2.ts — 从 DND `ui/styles.js` 拆分（b3 · 2026-10-05）
 * 来源：DND5E_Dashboard_BasedonST-main @ port-baseline（v2.0.5）
 * 内容保持原样（含缩进与顺序）；dnd- 前缀隔离，与 acu-* 无交集。
 */
export const STYLES_PART_08B_DND_BASE_2 = `
        /* HUD 内容区 */
        .dnd-hud-body { 
            padding: 10px 10px 0 10px !important; 
            overflow-y: auto !important; /* 内容超长时滚动 */
            flex: 1 !important;          /* 占据剩余空间 */
        }
        
        /* HUD 底部常驻资源栏 */
        .dnd-hud-footer {
            padding: 8px 10px !important;
            background: var(--dnd-bg-secondary) !important;
            border-top: 1px solid var(--dnd-border-subtle) !important;
            font-size: 11px !important;
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
            justify-content: space-between !important;
            align-items: center !important;
        }
        .dnd-res-item { display: flex !important; align-items: center !important; gap: 4px !important; }
        .dnd-res-icon { opacity: 0.7 !important; }
        
        /* 队伍折叠面板 */
        .dnd-hud-party-collapse {
            background: var(--dnd-bg-tertiary) !important;
            border-top: 1px solid var(--dnd-border-subtle) !important;
        }
        .dnd-party-header {
            padding: 5px 10px !important;
            cursor: pointer !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            font-size: 11px !important;
            color: var(--dnd-text-dim) !important;
        }
        .dnd-party-header:hover { background: rgba(255,255,255,0.05) !important; color: var(--dnd-text-main) !important; }
        
        .dnd-party-list {
            padding: 5px 10px 10px 10px !important;
            display: none; /* 默认折叠 */
        }
        .dnd-party-list.expanded { display: block !important; }
        
        .dnd-party-detail-row {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            padding: 4px 0 !important;
            border-bottom: 1px dashed rgba(255,255,255,0.05) !important;
            font-size: 11px !important;
        }
        .dnd-party-detail-row:last-child { border-bottom: none !important; }

        /* 战斗模式布局 */
        .dnd-hud-combat-layout { display: flex !important; width: 100% !important; gap: 15px !important; }
        .dnd-hud-minimap {
            width: 180px !important;
            height: 180px !important;
            background: var(--dnd-bg-main) !important;
            border: 1px solid var(--dnd-border-gold) !important;
            border-radius: 6px !important;
            position: relative !important;
            flex-shrink: 0 !important;
            overflow: hidden !important;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.5) !important;
        }
        
        /* [新增] 地图内部容器样式 */
        .dnd-minimap-inner {
            /* [修复] 减少内阴影强度，使战斗地图不再过暗 */
            box-shadow: inset 0 0 20px rgba(0,0,0,0.4);
            transition: transform 0.2s ease-out;
        }
        /* [修复] 网格使用更低的透明度和更明亮的边框色，呈现透明线条效果 */
        .dnd-minimap-grid {
            opacity: 0.6;
            pointer-events: none;
        }

        /* [修改] 战斗列表限制高度与地图一致，允许滚动 */
        .dnd-hud-party-stats {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 5px !important;
            overflow-y: auto !important;
            min-width: 200px !important;
            max-height: 240px !important; /* 限制高度与地图组件近似 */
        }

        /* 迷你地图 Token 增强 */
        .dnd-minimap-token {
            position: absolute;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
            /* 平滑移动过渡 */
            transition: left 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                        top 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                        width 0.3s, height 0.3s,
                        transform 0.2s;
            box-shadow: 0 3px 6px rgba(0,0,0,0.5);
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
            font-family: sans-serif !important;
        }
        .dnd-minimap-token:hover {
            transform: scale(1.2);
            z-index: 20;
            box-shadow: 0 6px 12px rgba(0,0,0,0.8);
        }
        
        /* 当前行动者光环特效 */
        .dnd-minimap-token.active::after {
            content: '';
            position: absolute;
            top: -6px; left: -6px; right: -6px; bottom: -6px;
            border: 1px dashed var(--dnd-border-gold);
            border-radius: 50%;
            animation: dnd-spin-slow 10s linear infinite;
            pointer-events: none;
        }
        .dnd-minimap-token.active::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(255, 219, 133, 0.6);
            animation: dnd-pulse-opacity 2s infinite;
            pointer-events: none;
        }
        
        @keyframes dnd-spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes dnd-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes dnd-pulse-opacity {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
        }

        /* 点击波纹 */
        @keyframes dnd-map-ripple {
            0% { transform: scale(0); opacity: 0.8; border-width: 4px; }
            100% { transform: scale(2.5); opacity: 0; border-width: 0; }
        }
        .dnd-map-ripple {
            position: absolute;
            border-radius: 50%;
            border: 2px solid var(--dnd-text-highlight);
            background: transparent;
            pointer-events: none;
            z-index: 50;
            animation: dnd-map-ripple 0.6s ease-out forwards;
            transform-origin: center center;
        }
        
        /* 探索模式布局 */
        .dnd-hud-explore-layout { display: flex !important; flex-direction: column !important; width: 100% !important; gap: 10px !important; }
        .dnd-hud-quests {
            background: linear-gradient(to right, var(--dnd-bg-tertiary), transparent) !important;
            padding: 8px !important;
            border-radius: 4px !important;
            border-left: 2px solid var(--dnd-border-gold) !important;
        }
        .dnd-hud-quest-item {
            display: flex !important; justify-content: space-between !important; font-size: 13px !important;
            padding: 4px 0 !important; border-bottom: 1px dashed var(--dnd-border-inner) !important;
            cursor: pointer !important;
        }
        .dnd-hud-quest-item:hover { color: var(--dnd-text-highlight) !important; background: var(--dnd-selected-bg) !important; }

        /* 行动按钮样式覆盖 */
        .dnd-action-btn {
            background: linear-gradient(to right, var(--dnd-bg-tertiary), var(--dnd-bg-secondary)) !important;
            border: 1px solid var(--dnd-border-inner) !important;
            color: var(--dnd-text-header) !important;
            border-left: 3px solid var(--dnd-border-gold) !important;
            border-radius: 4px !important;
            transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            font-family: var(--dnd-font-serif) !important;
            position: relative !important;
            overflow: hidden !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
        }
        
        /* 按钮光泽扫过效果 */
        .dnd-action-btn::before {
            content: "" !important;
            position: absolute !important;
            top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent) !important;
            transition: left 0.5s !important;
        }
        .dnd-action-btn:hover::before {
            left: 100% !important;
        }

        .dnd-action-btn:hover {
            background: linear-gradient(to right, var(--dnd-selected-bg), var(--dnd-bg-tertiary)) !important;
            border-color: var(--dnd-text-highlight) !important;
            transform: translateX(4px) scale(1.02) !important;
            box-shadow: 0 4px 12px var(--dnd-border-inner), 0 0 10px var(--dnd-accent) !important;
            text-shadow: 0 0 5px var(--dnd-accent-hover) !important;
        }
        
        .dnd-action-btn:active {
            transform: translateX(2px) scale(0.98) !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.4) !important;
        }
        
        .dnd-hud-party-row { display: flex !important; gap: 10px !important; overflow-x: auto !important; padding-bottom: 5px !important; }
        
        /* 迷你角色条 */
        .dnd-mini-char {
            display: flex !important; align-items: center !important; gap: 10px !important;
            background: linear-gradient(to right, var(--dnd-bg-tertiary), transparent) !important;
            padding: 5px 10px !important; border-radius: 4px !important;
            border-left: 3px solid transparent !important;
            cursor: pointer !important;
            transition: background 0.2s !important;
            margin-bottom: 5px !important;
            border: 1px solid transparent !important;
        }
        .dnd-mini-char:hover {
            background: linear-gradient(to right, var(--dnd-selected-bg), transparent) !important;
            border-color: var(--dnd-border-gold) !important;
        }
        .dnd-mini-char.active {
            border-left-color: var(--dnd-text-highlight) !important;
            background: linear-gradient(to right, var(--dnd-selected-bg), transparent) !important;
        }
        
        .dnd-mini-char-avatar {
            width: 36px !important; height: 36px !important; border-radius: 50% !important; background: var(--dnd-bg-secondary) !important;
            border: 2px solid var(--dnd-border-gold) !important; display: flex !important; align-items: center !important; justify-content: center !important;
            font-size: 14px !important; color: var(--dnd-text-highlight) !important;
            flex-shrink: 0 !important;
            box-shadow: 0 0 5px rgba(0,0,0,0.5) !important;
        }

        .dnd-mini-char-info { flex: 1 !important; min-width: 120px !important; }
        .dnd-mini-name { font-size: 13px !important; font-weight: bold !important; color: var(--dnd-text-main) !important; }
        .dnd-mini-sub { font-size: 11px !important; color: var(--dnd-text-dim) !important; display: flex !important; gap: 8px !important; }

        .dnd-mini-bars { width: 80px !important; display: flex !important; flex-direction: column !important; gap: 3px !important; flex-shrink: 0 !important; }
        .dnd-micro-bar { height: 4px !important; background: var(--dnd-bar-bg) !important; border-radius: 2px !important; overflow: hidden !important; position: relative !important; }
        .dnd-micro-bar-fill { height: 100% !important; transition: width 0.3s !important; }
        .dnd-micro-bar.hp .dnd-micro-bar-fill { background: var(--dnd-accent-red) !important; }
        
        /* 顶部栏 */
        .dnd-top-bar {
            height: 60px !important;
            background: var(--dnd-bg-hud) !important;
            border-bottom: 2px solid var(--dnd-border-gold) !important;
            display: flex !important;
            align-items: center !important;
            padding: 0 20px !important;
            justify-content: space-between !important;
            box-shadow: var(--dnd-shadow-md) !important;
        }
        .dnd-title {
            font-family: var(--dnd-font-serif) !important;
            font-size: 24px !important;
            color: var(--dnd-text-highlight) !important;
            text-transform: uppercase !important;
            letter-spacing: 2px !important;
            text-shadow: 0 0 5px var(--dnd-text-highlight) !important;
        }
        .dnd-close-btn {
            background: transparent !important;
            border: 1px solid var(--dnd-border-gold) !important;
            color: var(--dnd-text-main) !important;
            padding: 5px 15px !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            font-family: var(--dnd-font-serif) !important;
        }
        .dnd-close-btn:hover {
            background: var(--dnd-border-gold) !important;
            color: var(--dnd-text-inverse) !important;
        }

            /* 悬浮按钮 - 左上角 + 动画 */
                #dnd-toggle-btn {
                    position: fixed !important;
                    top: 10px !important;
                    left: 10px !important;
                    bottom: auto !important; right: auto !important;
                    
                    width: 42px !important;
                    height: 42px !important;
                    background: var(--dnd-bg-hud) !important;
                    border: 2px solid var(--dnd-border-gold) !important;
                    border-radius: 50% !important;
                    color: var(--dnd-border-gold) !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    cursor: pointer !important;
                    z-index: 2147483641 !important;
                    box-shadow: var(--dnd-shadow-lg), inset 0 0 10px var(--dnd-bg-tertiary) !important;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                    font-size: 22px !important;
                    
                    opacity: 1 !important;
                    transform: scale(1) !important;
                    pointer-events: auto !important;
                    touch-action: none !important; /* 禁止浏览器默认触摸行为，确保拖拽流畅 */
                    user-select: none !important; /* 禁止文字选择 */
                    -webkit-user-select: none !important;
                }
            #dnd-toggle-btn:hover {
                background: var(--dnd-border-gold) !important;
                color: var(--dnd-text-inverse-dark) !important;
                transform: scale(1.1) rotate(90deg) !important;
                box-shadow: var(--dnd-selected-glow) !important;
            }
        #dnd-toggle-btn.dnd-hidden {
            opacity: 0 !important;
            transform: scale(0) !important;
            pointer-events: none !important;
        }
        #dnd-toggle-btn.dnd-force-hidden {
            opacity: 0 !important;
            transform: scale(0) !important;
            pointer-events: none !important;
        }
        #dnd-mini-hud.dnd-independent-mode {
            right: auto !important;
            bottom: auto !important;
        }
        #dnd-mini-hud.dnd-independent-mode .dnd-hud-header {
            cursor: move !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            touch-action: none !important;
        }
        #dnd-mini-hud.dnd-independent-mode #dnd-logo-container,
        #dnd-mini-hud.dnd-independent-mode .dnd-hud-expand-btn,
        #dnd-mini-hud.dnd-independent-mode #dnd-hud-toggle-bar {
            cursor: pointer !important;
        }

        /* 移动端角色卡片入场动画 */
        @keyframes dnd-card-in-mobile {
            0% {
                opacity: 0;
                transform: translateX(-50%) scale(0.92) translateY(-15px);
            }
            100% {
                opacity: 1;
                transform: translateX(-50%) scale(1) translateY(0);
            }
        }

        /* === 新增互动动效 === */
        
        /* 1. 列表项级联入场 */
        @keyframes dnd-slide-up-fade {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .dnd-anim-entry {
            opacity: 0; /* 初始隐藏，等待动画 */
            animation: dnd-slide-up-fade 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards !important;
        }
        /* 确保入场动画完成后卡片保持可见，不受主题动画影响 */
        .dnd-anim-entry.dnd-anim-done,
        .dnd-char-card.dnd-anim-done,
        .dnd-char-card.dnd-anim-done:hover {
            opacity: 1 !important;
        }
        /* 确保所有主题的卡片在 hover 时保持可见 */
        .dnd-char-card:hover {
            opacity: 1 !important;
        }

        /* HUD 专用微动效 */
        @keyframes dnd-hud-pop-in {
            0% { opacity: 0; transform: scale(0.95) translateY(5px); }
            60% { transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .dnd-hud-entry {
            opacity: 0;
            animation: dnd-hud-pop-in 0.3s ease-out forwards;
        }
        
        /* 呼吸光环 (用于当前行动者) */
        @keyframes dnd-pulse-border {
            0% { box-shadow: 0 0 0 0 var(--dnd-selected-glow); border-color: var(--dnd-border-gold); }
            70% { box-shadow: 0 0 0 6px transparent; border-color: var(--dnd-text-highlight); }
            100% { box-shadow: 0 0 0 0 transparent; border-color: var(--dnd-border-gold); }
        }
        .dnd-active-turn {
            animation: dnd-pulse-border 2s infinite !important;
        }
        

        /* 状态条流光效果 */
        @keyframes dnd-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        .dnd-bar-shimmer .dnd-micro-bar-fill, 
        .dnd-bar-shimmer .dnd-bar-fill {
            position: relative;
            overflow: hidden;
        }
        .dnd-bar-shimmer .dnd-micro-bar-fill::after,
        .dnd-bar-shimmer .dnd-bar-fill::after {
            content: "";
            position: absolute;
            top: 0; left: 0; width: 200%; height: 100%;
            background: linear-gradient(90deg, transparent 0%, var(--dnd-selected-bg) 50%, transparent 100%);
            animation: dnd-shimmer 10s infinite linear;
            transform: skewX(-20deg);
        }

        /* 2. 点击波纹/回弹反馈 */
        @keyframes dnd-pop-click {
            0% { transform: scale(1); }
            40% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }
        .dnd-clicking {
            animation: dnd-pop-click 0.2s ease-out !important;
        }
        
        /* 通用可点击元素效果 (CSS active 态) */
        .dnd-clickable {
            transition: transform var(--dnd-hover-transition, 0.15s ease), background 0.2s, box-shadow 0.2s, border-color 0.2s !important;
            cursor: pointer !important;
        }
        .dnd-clickable:active {
            transform: var(--dnd-active-transform, scale(0.96)) !important;
        }
        .dnd-clickable:hover {
            filter: brightness(var(--dnd-hover-brightness, 1.1));
        }

        /* 3. 面板切换过渡 */
        @keyframes dnd-panel-in {
            0% { opacity: 0; transform: translateX(10px); }
            100% { opacity: 1; transform: translateX(0); }
        }
        .dnd-panel-transition {
            animation: dnd-panel-in 0.3s ease-out;
        }

        /* 移动端/窄屏适配 */
        @media (max-width: 768px) {
            .dnd-char-detail-card {
                width: 94vw !important;
                max-height: calc(100vh - 20px) !important;
                /* 移动端固定定位：顶部10px，水平居中 */
                top: 10px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                right: auto !important;
                bottom: auto !important;
            }
            .dnd-char-detail-card.visible {
                animation: dnd-card-in-mobile 0.25s ease-out forwards !important;
            }
            
            /* 移动端悬浮详情窗 */
            .dnd-detail-popup {
                width: calc(100vw - 20px) !important;
                max-width: none !important;
                left: 10px !important;
                right: 10px !important;
                max-height: 80vh !important;
            }
            .dnd-attr-grid {
                grid-template-columns: repeat(3, 1fr) !important;
            }
            .dnd-detail-body {
                padding: 10px !important;
                font-size: 12px !important;
            }
            .dnd-detail-header {
                padding: 8px 12px !important;
            }
            
            #dnd-dashboard-root .dnd-main-container {
                flex-direction: column !important;
            }
            .dnd-nav-sidebar {
                width: 100% !important;
                flex-direction: row !important;
                overflow-x: auto !important;
                padding: 5px !important;
                border-right: none !important;
                border-bottom: 1px solid var(--dnd-border-inner) !important;
                flex-shrink: 0 !important;
            }
            .dnd-nav-item {
                padding: 8px 12px !important;
                font-size: 14px !important;
                border-left: none !important;
                border-bottom: 3px solid transparent !important;
                white-space: nowrap !important;
                flex-shrink: 0 !important;
            }
            .dnd-nav-item.active {
                border-bottom-color: var(--dnd-border-gold) !important;
                background: var(--dnd-selected-bg) !important;
            }
            .dnd-content-area {
                padding: 15px !important;
            }
            
            #dnd-mini-hud {
                /* 移动端强制居中靠上 */
                top: 10px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                width: 95vw !important;
                min-width: 0 !important;
            }
            #dnd-mini-hud.visible {
                transform: translateX(-50%) !important;
            }
        }

        /* 宽屏优化 */
        @media (min-width: 769px) {
            .dnd-attr-grid {
                grid-template-columns: repeat(6, 1fr) !important;
            }
            /* 确保侧边栏固定宽度 */
            .dnd-nav-sidebar {
                min-width: 200px !important;
                max-width: 200px !important;
            }
            /* 确保内容区域填充剩余空间 */
            .dnd-content-area {
                flex: 1 !important;
                min-width: 0 !important; /* 防止内容溢出 */
            }
        }

        /* Quick Access Bar - Attached to MiniHUD Right Border */
        .dnd-quick-trigger {
            position: absolute !important;
            left: 100%; /* Right of HUD */
            top: 60px;
            width: 16px;
            height: 40px;
            background: var(--dnd-bg-panel);
            border: 1px solid var(--dnd-border-gold);
            border-left: none;
            border-radius: 0 8px 8px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 2147483639;
            font-size: 10px;
            color: var(--dnd-border-gold);
        }
        .dnd-quick-trigger:hover {
            background: var(--dnd-border-gold);
            color: var(--dnd-text-inverse);
        }

        .dnd-quick-bar {
            position: absolute !important;
            top: 0;
            left: 100%; /* Right border of HUD */
            width: 50px;
            height: auto;
            max-height: 100%;
            background: var(--dnd-bg-panel);
            border: 1px solid var(--dnd-border-gold);
            border-left: none;
            border-radius: 0 8px 8px 0;
            display: flex;
            flex-direction: column;
            padding: 5px;
            gap: 5px;
            overflow-y: auto;
            overflow-x: hidden;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transform-origin: left center;
            transform: scaleX(0); /* Start hidden */
            opacity: 0;
            z-index: 2147483638;
        }
        
        .dnd-quick-bar.visible {
            transform: scaleX(1);
            opacity: 1;
        }

        /* Mobile Quick Bar Adjustment: Overlay from Right */
        @media (max-width: 768px) {
            .dnd-quick-bar {
                left: auto !important;
                right: 0 !important;
                transform-origin: right center !important;
                border-left: 1px solid var(--dnd-border-gold) !important;
                border-right: none !important;
                border-radius: 8px 0 0 8px !important;
                z-index: 2147483642 !important;
            }
            
            .dnd-quick-trigger {
                left: auto !important;
                right: 0 !important;
                border-left: 1px solid var(--dnd-border-gold) !important;
                border-right: none !important;
                border-radius: 4px 0 0 4px !important;
                transition: right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                z-index: 2147483643 !important;
                /* Flip arrow direction on mobile */
                transform: rotate(180deg) !important;
            }
            
            .dnd-quick-bar.visible + .dnd-quick-trigger {
                right: 50px !important;
            }
        }

        /* HUD Party Bar */
        .dnd-hud-party-bar {
            display: flex !important;
            gap: 15px !important;
            overflow-x: auto !important;
            padding: 12px 10px !important;
            border-top: 1px solid var(--dnd-border-subtle) !important;
            background: var(--dnd-bg-secondary) !important;
        }
        .party-bar-item {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 4px !important;
            cursor: pointer !important;
            min-width: 48px !important;
            position: relative !important;
        }
        .party-avatar-container {
            width: 40px !important;
            height: 40px !important;
            border: 1px solid var(--dnd-border-gold) !important;
            border-radius: 50% !important;
            overflow: hidden !important;
            background: linear-gradient(135deg, var(--dnd-logo-bg-start) 0%, var(--dnd-logo-bg-end) 100%) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
        .party-lvl-badge {
            position: absolute !important;
            bottom: -2px !important;
            right: -4px !important;
            background: var(--dnd-bg-tertiary) !important;
            border: 1px solid var(--dnd-border-gold) !important;
            color: var(--dnd-text-main) !important;
            font-size: 9px !important;
            padding: 0 3px !important;
            border-radius: 3px !important;
            font-weight: bold !important;
        }
        
        .party-control-btn {
            position: absolute;
            top: -5px;
            left: -5px;
            width: 18px;
            height: 18px;
            background: var(--dnd-bg-tertiary);
            border: 1px solid var(--dnd-border-subtle);
            border-radius: 50%;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 10;
        }
        .party-bar-item:hover .party-control-btn {
            opacity: 1;
        }
        .party-control-btn.active {
            opacity: 1;
            border-color: var(--dnd-border-gold);
            background: var(--dnd-selected-bg);
        }

        /* Status Pills for Party Bar */
        .dnd-party-status-bar {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 2px !important;
            justify-content: center !important;
            margin-top: 2px !important;
            max-width: 60px !important;
        }
        .dnd-party-status-pill {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 1px 4px !important;
            border-radius: 3px !important;
            font-size: 8px !important;
            font-weight: bold !important;
            gap: 2px !important;
            white-space: nowrap !important;
        }
        .dnd-party-status-pill.buff {
            background: rgba(58, 107, 74, 0.4) !important;
            border: 1px solid var(--dnd-accent-green) !important;
            color: #7fff7f !important;
        }
        .dnd-party-status-pill.debuff {
            background: rgba(138, 44, 44, 0.4) !important;
            border: 1px solid var(--dnd-accent-red) !important;
            color: #ff7f7f !important;
        }
        .dnd-party-status-pill i {
            font-size: 7px !important;
        }

        .dnd-item-damage {
            color: var(--dnd-accent-red);
            font-weight: bold;
            font-size: 12px;
        }
        .dnd-item-props {
            color: var(--dnd-text-dim);
            font-size: 11px;
            font-style: italic;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .dnd-item-rarity {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 3px;
            display: inline-block;
            margin-top: 2px;
        }
        .rarity-普通, .rarity-common { background: var(--dnd-rarity-common-bg); color: var(--dnd-rarity-common-text); }
        .rarity-非凡, .rarity-uncommon { background: var(--dnd-rarity-uncommon-bg); color: var(--dnd-rarity-uncommon-text); }
        .rarity-稀有, .rarity-rare { background: var(--dnd-rarity-rare-bg); color: var(--dnd-rarity-rare-text); }
        .rarity-极稀有, .rarity-veryrare { background: var(--dnd-rarity-veryrare-bg); color: var(--dnd-rarity-veryrare-text); }
        .rarity-传说, .rarity-legendary { background: var(--dnd-rarity-legendary-bg); color: var(--dnd-rarity-legendary-text); }

        .dnd-item-detail-row {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 0;
            border-bottom: 1px dashed rgba(255,255,255,0.1);
        }
        .dnd-item-detail-icon { width: 20px; text-align: center; }
        .dnd-item-detail-label { color: var(--dnd-text-dim); min-width: 60px; }
        .dnd-item-detail-value { color: var(--dnd-text-main); flex: 1; }
        
        .party-control-btn {
            position: absolute;
            top: -5px;
            left: -5px;
            width: 18px;
            height: 18px;
            background: var(--dnd-bg-tertiary);
            border: 1px solid var(--dnd-border-subtle);
            border-radius: 50%;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 10;
        }
        .party-bar-item:hover .party-control-btn {
            opacity: 1;
        }
        .party-control-btn.active {
            opacity: 1;
            border-color: var(--dnd-border-gold);
            background: var(--dnd-selected-bg);
        }

        /* Dice Grid */
        .dnd-dice-grid {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: var(--dnd-spacing-sm, 6px) !important;
        }
        .dnd-dice-btn {
            background: var(--dnd-bg-tertiary) !important;
            /* Morphology: Border */
            border: var(--dnd-border-width, 1px) var(--dnd-border-style, solid) var(--dnd-border-subtle) !important;
            color: var(--dnd-text-main) !important;
            padding: 10px 5px !important;
            /* Morphology: Radius */
            border-radius: var(--dnd-radius-sm, 4px) !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            font-size: 13px !important;
            font-weight: bold !important;
            text-align: center !important;
            position: relative !important;
            overflow: hidden !important;
            
            /* Morphology: Shape */
            clip-path: var(--dnd-card-clip-path, none) !important;
        }
        
        /* 骰子按钮纹理 */
        .dnd-dice-btn::after {
            content: "" !important;
            position: absolute !important;
            top: 0; left: 0; right: 0; bottom: 0 !important;
            background: var(--dnd-effect-texture, none) !important;
            opacity: 0.3 !important;
            pointer-events: none !important;
            mix-blend-mode: overlay !important;
        }
        
        .dnd-dice-btn:hover {
            border-color: var(--dnd-text-highlight) !important;
            color: var(--dnd-text-highlight) !important;
            transform: scale(1.05) !important;
        }

        .dnd-quick-slot {
            width: 48px;
            height: 48px;
            background: var(--dnd-bg-tertiary);
            /* Morphology: Border */
            border: var(--dnd-border-width, 1px) var(--dnd-border-style, solid) var(--dnd-border-inner);
            /* Morphology: Radius */
            border-radius: var(--dnd-radius-sm, 4px);
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            font-size: 12px;
            font-weight: bold;
            color: var(--dnd-text-main);
            transition: all 0.2s;
            overflow: hidden;
            white-space: nowrap;
            text-align: center;
            
            /* Morphology: Shape */
            clip-path: var(--dnd-card-clip-path, none);
        }
        
        /* 快捷槽纹理 */
        .dnd-quick-slot::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: var(--dnd-effect-texture, none);
            opacity: 0.3;
            pointer-events: none;
            mix-blend-mode: overlay;
            z-index: 0;
        }
        
        .dnd-quick-slot:hover {
            border-color: var(--dnd-text-highlight);
            background: var(--dnd-selected-bg);
        }
        .dnd-quick-slot.add-btn {
            border: 1px dashed var(--dnd-border-inner) !important;
            color: var(--dnd-text-dim) !important;
            font-weight: bold;
            font-size: 24px;
        }
        .dnd-quick-slot.add-btn:hover {
            border-color: var(--dnd-text-highlight) !important;
            color: var(--dnd-text-highlight) !important;
        }
        
        .dnd-quick-slot-remove {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 16px;
            height: 16px;
            background: var(--dnd-accent-red);
            border-radius: 50%;
            font-size: 10px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .dnd-quick-slot:hover .dnd-quick-slot-remove {
            opacity: 1;
        }

        /* Custom Dice Area */
        .dnd-dice-custom-area {
            margin-top: 10px !important;
            padding-top: 10px !important;
            border-top: 1px dashed var(--dnd-border-subtle) !important;
        }
        .dnd-dice-input-row {
            display: flex !important;
            gap: 5px !important;
        }
        .dnd-dice-input {
            flex: 1 !important;
            background: var(--dnd-bg-input) !important;
            border: 1px solid var(--dnd-border-subtle) !important;
            color: var(--dnd-text-main) !important;
            padding: 6px 10px !important;
            border-radius: 4px !important;
            font-size: 12px !important;
        }
        .dnd-dice-submit-btn {
            background: var(--dnd-border-gold) !important;
            border: none !important;
            color: var(--dnd-text-inverse) !important;
            padding: 6px 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-weight: bold !important;
        }
        .dnd-dice-submit-btn:hover {
            filter: brightness(1.1) !important;
        }

        /* Markdown Styles */
        .dnd-md-h1 { font-size: 1.5em !important; font-weight: bold !important; color: var(--dnd-text-highlight) !important; margin: 0.5em 0 !important; }
        .dnd-md-h2 { font-size: 1.3em !important; font-weight: bold !important; color: var(--dnd-text-header) !important; margin: 0.4em 0 !important; }
        .dnd-md-h3 { font-size: 1.1em !important; font-weight: bold !important; color: var(--dnd-text-main) !important; margin: 0.3em 0 !important; }
        .dnd-md-pre { background: rgba(0,0,0,0.3) !important; padding: 10px !important; border-radius: 4px !important; overflow-x: auto !important; font-family: monospace !important; margin: 5px 0 !important; }
        .dnd-md-code { background: rgba(255,255,255,0.1) !important; padding: 2px 4px !important; border-radius: 3px !important; font-family: monospace !important; }
        .dnd-md-li { margin-left: 20px !important; list-style-type: disc !important; display: list-item !important; }

        `;
