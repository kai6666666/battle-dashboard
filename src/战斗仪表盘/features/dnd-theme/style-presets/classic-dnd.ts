// features/dnd-theme/style-presets/classic-dnd.ts
// 风格包：classic-dnd（b11a · 自 BasedonST `src/config/StylePresets.js` 拆分移植）
export const classicDnd = {
        meta: {
            id: 'classic-dnd',
            name: '经典羊皮纸',
            icon: '<i class="fa-solid fa-scroll"></i>',
            description: '传统的D&D风格，仿佛置身于古老的书卷之中',
            author: 'System'
        },
        colors: {
            '--dnd-bg-main': '#1a100e',
            '--dnd-bg-panel': '#2b1b17',
            '--dnd-bg-panel-start': '#2b1b17',
            '--dnd-bg-panel-end': '#1a100e',
            '--dnd-text-main': '#e0cda8',
            '--dnd-text-header': '#d4c4a0',
            '--dnd-text-highlight': '#ffdb85',
            '--dnd-text-dim': '#8a7a6a',
            '--dnd-accent': '#8a2be2',
            '--dnd-accent-hover': '#9b4dca',
            '--dnd-border': '#4a3b2a',
            '--dnd-border-light': '#6a5b4a',
            '--dnd-bg-card': '#242424',
            '--dnd-bg-card-start': '#242424',
            '--dnd-bg-card-end': '#1a1a1c',
            '--dnd-btn-primary': '#4a148c',
            '--dnd-btn-primary-hover': '#6a1b9a',
            '--dnd-btn-text': '#e0cda8',
            '--dnd-border-gold': '#9d8b6c',
            '--dnd-border-inner': '#5c4b35'
        },
        morphology: {
            border: { style: 'solid', width: '2px', outerStyle: 'none' },
            corners: { style: 'rounded', clipPath: 'none' },
            card: { shape: 'normal', decoration: 'ornate' },
            effects: { texture: 'paper', innerGlow: 'subtle', borderGlow: 'gold', overlay: 'vignette' },
            layout: { density: 'normal' },
            decorations: { corners: 'flourish', dividers: 'ornate', headers: 'banner' },
            buttons: { style: 'classic', shape: 'rounded' },
            progressBars: { style: 'parchment', animated: true }
        },
        typography: {
            '--dnd-font-serif': '"Cinzel", "Palatino Linotype", "Book Antiqua", serif',
            '--dnd-font-size-base': '1rem',
            '--dnd-font-size-header': '1.2rem',
            '--dnd-font-weight-header': '600',
            '--dnd-letter-spacing': '0.03em'
        },
        animations: {
            '--dnd-transition-fast': '0.2s ease-out',
            '--dnd-transition-normal': '0.3s ease-out',
            '--dnd-animation-glow': 'parchment-glow 4s ease-in-out infinite'
        },
        interactiveStates: {
            hover: {
                brightness: 1.1,
                scale: 1.02,
                lift: '-4px',
                shadow: '0 10px 30px rgba(0,0,0,0.45), 0 0 15px rgba(157, 139, 108, 0.15)',
                borderColor: '#9d8b6c',
                glow: 'drop-shadow(0 0 5px rgba(157, 139, 108, 0.3))',
                transition: '0.3s ease-out'
            },
            cardHover: {
                transform: 'translateY(-8px) rotateX(3deg) rotateY(-2deg) scale(1.02)',
                shadow: '0 25px 50px rgba(0,0,0,0.55), 0 0 40px rgba(157, 139, 108, 0.2)',
                borderColor: '#b8a07a'
            },
            buttonHover: {
                brightness: 1.18,
                transform: 'translateY(-3px) scale(1.02)',
                shadow: '0 8px 20px rgba(138, 43, 226, 0.4), 0 0 10px rgba(157, 139, 108, 0.3)'
            },
            active: {
                scale: 0.96,
                brightness: 0.92,
                transform: 'translateY(2px) scale(0.96)',
                shadow: '0 2px 8px rgba(0,0,0,0.35), inset 0 1px 3px rgba(0,0,0,0.2)'
            },
            buttonActive: {
                transform: 'translateY(2px) scale(0.97)',
                shadow: '0 1px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.2)'
            },
            selected: {
                background: 'linear-gradient(90deg, rgba(157, 139, 108, 0.25), rgba(138, 43, 226, 0.1), transparent)',
                borderColor: '#ffdb85',
                borderWidth: '2px',
                glow: '0 0 15px rgba(157, 139, 108, 0.35)',
                textColor: '#ffdb85'
            },
            navActive: {
                background: 'linear-gradient(90deg, rgba(157, 139, 108, 0.25), transparent)',
                border: '3px solid #9d8b6c',
                indicator: '#b8a07a'
            },
            focus: {
                borderColor: '#9d8b6c',
                shadow: '0 0 0 4px rgba(157, 139, 108, 0.25)',
                outline: 'none'
            },
            disabled: {
                opacity: 0.45,
                cursor: 'not-allowed',
                filter: 'grayscale(0.6) sepia(0.2) brightness(0.8)'
            },
            iconHover: {
                glow: 'drop-shadow(0 0 6px rgba(138, 43, 226, 0.6)) drop-shadow(0 0 12px rgba(157, 139, 108, 0.4))',
                scale: 1.12
            },
            inputFocus: {
                border: '#9d8b6c',
                shadow: '0 0 10px rgba(157, 139, 108, 0.3), inset 0 0 8px rgba(157, 139, 108, 0.1)'
            }
        },
        overrides: {
            /* ====== 卡片 - 羊皮纸卷轴形态 ====== */
            '.dnd-char-card': {
                'box-shadow': '0 6px 20px rgba(0,0,0,0.45), inset 0 0 40px rgba(0,0,0,0.4), 0 0 20px rgba(157, 139, 108, 0.1)',
                'border': '3px double #5c4b35',
                'border-radius': '3px',
                'background': 'linear-gradient(135deg, #2b2420 0%, #1e1815 50%, #1a1510 100%)'
            },
            '.dnd-card-header': {
                'border-bottom': '2px solid #5c4b35',
                'background': 'linear-gradient(to right, rgba(157, 139, 108, 0.18), rgba(92, 75, 53, 0.1), rgba(157, 139, 108, 0.18))',
                'position': 'relative',
                'padding': '12px 16px'
            },
            '.dnd-card-body': {
                'background': 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(92, 75, 53, 0.08) 24px, rgba(92, 75, 53, 0.08) 25px)',
                'padding': '15px'
            },
            /* ====== 导航栏 - 书签标签形态 ====== */
            '.dnd-nav-sidebar': {
                'background': 'linear-gradient(180deg, #2b1b17 0%, #1a100e 100%)',
                'border-right': '3px double #5c4b35'
            },
            '.dnd-nav-item': {
                'border-radius': '0 8px 8px 0',
                'margin': '4px 0',
                'border-left': '4px solid transparent',
                'transition': 'all 0.3s ease-out'
            },
            '.dnd-nav-item:hover': {
                'background': 'linear-gradient(90deg, rgba(157, 139, 108, 0.15), transparent)',
                'border-left-color': '#9d8b6c',
                'padding-left': '24px'
            },
            '.dnd-nav-item.active': {
                'background': 'linear-gradient(90deg, rgba(157, 139, 108, 0.25), transparent)',
                'box-shadow': 'inset 4px 0 0 #b8a07a, 0 0 15px rgba(157, 139, 108, 0.2)',
                'border-left-color': '#ffdb85'
            },
            /* ====== 进度条 - 墨水羽毛笔样式 ====== */
            '.dnd-bar-container': {
                'background': 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(30,20,15,0.8))',
                'border': '1px solid #5c4b35',
                'border-radius': '2px',
                'height': '10px',
                'box-shadow': 'inset 0 1px 3px rgba(0,0,0,0.5)'
            },
            '.dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #5c4b35 0%, #9d8b6c 50%, #b8a07a 75%, #9d8b6c 100%)',
                'box-shadow': '0 0 8px rgba(157, 139, 108, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                'border-radius': '1px'
            },
            '.dnd-bar-hp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #6a2c2c 0%, #8a3c3c 50%, #a04040 75%, #8a3c3c 100%)'
            },
            '.dnd-bar-exp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #4a3080 0%, #6a40a0 50%, #8050c0 75%, #6a40a0 100%)'
            },
            /* ====== 按钮 - 蜡封/印章形态 ====== */
            '.dnd-btn, .dnd-action-btn': {
                'border': '2px solid #5c4b35',
                'background': 'linear-gradient(145deg, #3a2a20 0%, #2a1a15 50%, #1f1510 100%)',
                'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2), 0 3px 8px rgba(0,0,0,0.4)',
                'border-radius': '4px',
                'text-shadow': '0 1px 2px rgba(0,0,0,0.5)',
                'font-family': '"Cinzel", serif',
                'letter-spacing': '0.05em'
            },
            '.dnd-btn:hover, .dnd-action-btn:hover': {
                'background': 'linear-gradient(145deg, #4a3a30 0%, #3a2a20 50%, #2a1a15 100%)',
                'border-color': '#9d8b6c',
                'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.15), 0 5px 15px rgba(0,0,0,0.5), 0 0 10px rgba(157, 139, 108, 0.2)'
            },
            '.dnd-btn:active, .dnd-action-btn:active': {
                'background': 'linear-gradient(145deg, #2a1a15 0%, #1f1510 100%)',
                'box-shadow': 'inset 0 2px 4px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)'
            },
            /* ====== 属性行 - 羊皮纸条目 ====== */
            '.dnd-stat-row': {
                'background': 'linear-gradient(90deg, rgba(43, 36, 32, 0.6), rgba(30, 24, 21, 0.4))',
                'border': '1px solid rgba(92, 75, 53, 0.3)',
                'border-radius': '3px',
                'padding': '6px 10px',
                'margin': '3px 0'
            },
            '.dnd-stat-row:nth-child(odd)': {
                'background': 'linear-gradient(90deg, rgba(43, 36, 32, 0.4), rgba(30, 24, 21, 0.2))'
            },
            /* ====== 标题样式 ====== */
            '.dnd-title, .dnd-char-name': {
                'text-shadow': '0 2px 6px rgba(0,0,0,0.5), 0 0 20px rgba(157, 139, 108, 0.3)',
                'font-family': '"Cinzel", "Palatino Linotype", serif',
                'letter-spacing': '0.08em'
            },
            /* ====== 面板/弹窗 ====== */
            '.dnd-panel, .dnd-dialog': {
                'border': '3px double #5c4b35',
                'border-radius': '4px',
                'box-shadow': '0 10px 40px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.3)'
            },
            /* ====== 输入框 ====== */
            '.dnd-input, .dnd-select, .dnd-textarea': {
                'background': 'rgba(26, 16, 14, 0.8)',
                'border': '1px solid #5c4b35',
                'border-radius': '3px',
                'color': '#e0cda8'
            },
            '.dnd-input:focus, .dnd-select:focus, .dnd-textarea:focus': {
                'border-color': '#9d8b6c',
                'box-shadow': '0 0 8px rgba(157, 139, 108, 0.3), inset 0 0 5px rgba(157, 139, 108, 0.1)'
            },
            /* ====== 表格 ====== */
            '.dnd-table th': {
                'background': 'linear-gradient(to bottom, #3a2a20, #2a1a15)',
                'border-bottom': '2px solid #5c4b35',
                'color': '#ffdb85'
            },
            '.dnd-table td': {
                'border-bottom': '1px solid rgba(92, 75, 53, 0.3)'
            },
            '.dnd-table tr:hover td': {
                'background': 'rgba(157, 139, 108, 0.1)'
            },
            /* ====== 徽章/标签 ====== */
            '.dnd-badge': {
                'background': 'linear-gradient(135deg, #5c4b35, #3a2a20)',
                'border': '1px solid #9d8b6c',
                'border-radius': '3px',
                'box-shadow': '0 1px 3px rgba(0,0,0,0.3)'
            },
            /* ====== 迷你HUD ====== */
            '#dnd-mini-hud': {
                'border': '2px solid #5c4b35',
                'border-radius': '4px',
                'background': 'linear-gradient(180deg, rgba(43, 27, 23, 0.95), rgba(26, 16, 14, 0.98))'
            }
        },
        customCSS: `
            /* ====== 经典羊皮纸皮肤 - 独特动画与装饰 ====== */
            
            /* 羊皮纸呼吸光效 */
            @keyframes parchment-glow {
                0%, 100% {
                    box-shadow: 0 6px 20px rgba(0,0,0,0.45), inset 0 0 40px rgba(0,0,0,0.4), 0 0 20px rgba(157, 139, 108, 0.1);
                    filter: brightness(1);
                }
                50% {
                    box-shadow: 0 6px 20px rgba(0,0,0,0.45), inset 0 0 40px rgba(0,0,0,0.4), 0 0 35px rgba(157, 139, 108, 0.25);
                    filter: brightness(1.02);
                }
            }
            
            /* 墨水书写动画 */
            @keyframes ink-write {
                0% { width: 0; opacity: 0; }
                10% { opacity: 1; }
                100% { width: 100%; opacity: 1; }
            }
            
            /* 羽毛笔书写线条动画 */
            @keyframes quill-underline {
                0% { transform: scaleX(0); transform-origin: left; }
                100% { transform: scaleX(1); transform-origin: left; }
            }
            
            /* 蜡烛闪烁效果（用于重要元素） */
            @keyframes candle-flicker {
                0%, 100% { opacity: 1; filter: brightness(1); }
                25% { opacity: 0.95; filter: brightness(0.98); }
                50% { opacity: 1; filter: brightness(1.02); }
                75% { opacity: 0.97; filter: brightness(0.99); }
            }
            
            /* 卡片 - 羊皮纸纹理与卷轴边缘 */
            .dnd-char-card {
                position: relative;
                animation: parchment-glow 5s ease-in-out infinite;
            }
            
            /* 羊皮纸纹理层 */
            .dnd-char-card::before {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background:
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.03'/%3E%3C/svg%3E"),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.1) 100%);
                pointer-events: none;
                border-radius: inherit;
                z-index: 0;
            }
            
            /* 内边框装饰线 */
            .dnd-char-card::after {
                content: "";
                position: absolute;
                top: 6px; left: 6px; right: 6px; bottom: 6px;
                border: 1px solid rgba(157, 139, 108, 0.2);
                border-radius: 2px;
                pointer-events: none;
                z-index: 1;
            }
            
            /* 卡片头部 - 华丽横幅装饰 */
            .dnd-card-header::before {
                content: "";
                position: absolute;
                left: 50%;
                bottom: -8px;
                transform: translateX(-50%);
                width: 60px;
                height: 16px;
                background: linear-gradient(to bottom, #5c4b35 0%, #3a2a20 100%);
                clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%);
                z-index: 10;
            }
            
            .dnd-card-header::after {
                content: "❧";
                position: absolute;
                left: 50%;
                bottom: -5px;
                transform: translateX(-50%);
                color: #9d8b6c;
                font-size: 12px;
                z-index: 11;
            }
            
            /* 导航项 - 书签标签效果 */
            .dnd-nav-item::before {
                content: "";
                position: absolute;
                left: 0; top: 0; bottom: 0;
                width: 4px;
                background: linear-gradient(to bottom, transparent, #9d8b6c, transparent);
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .dnd-nav-item:hover::before,
            .dnd-nav-item.active::before {
                opacity: 1;
            }
            
            .dnd-nav-item.active::after {
                content: "◆";
                position: absolute;
                right: 10px;
                color: #ffdb85;
                font-size: 8px;
                animation: candle-flicker 2s infinite;
            }
            
            /* 按钮 - 蜡封印章效果 */
            .dnd-btn::before {
                content: "";
                position: absolute;
                top: 2px; left: 2px; right: 2px; bottom: 2px;
                border: 1px dashed rgba(157, 139, 108, 0.2);
                border-radius: 2px;
                pointer-events: none;
            }
            
            /* 进度条动画 */
            .dnd-bar-fill {
                position: relative;
                overflow: hidden;
            }
            
            .dnd-bar-fill::after {
                content: "";
                position: absolute;
                top: 0; left: -100%; width: 100%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: progress-shine 3s ease-in-out infinite;
            }
            
            @keyframes progress-shine {
                0% { left: -100%; }
                50%, 100% { left: 100%; }
            }
            
            /* 分隔线装饰 */
            .dnd-divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, #5c4b35, #9d8b6c, #5c4b35, transparent);
                position: relative;
                margin: 10px 0;
            }
            
            .dnd-divider::before {
                content: "✦";
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background: #1a1510;
                padding: 0 8px;
                color: #9d8b6c;
                font-size: 10px;
            }
            
            /* 角落装饰花纹 */
            .dnd-panel::before,
            .dnd-dialog::before {
                content: "❦";
                position: absolute;
                top: 5px; left: 8px;
                color: rgba(157, 139, 108, 0.4);
                font-size: 14px;
            }
            
            .dnd-panel::after,
            .dnd-dialog::after {
                content: "❦";
                position: absolute;
                bottom: 5px; right: 8px;
                color: rgba(157, 139, 108, 0.4);
                font-size: 14px;
                transform: rotate(180deg);
            }
            
            /* 滚动条 - 羊皮纸风格 */
            .dnd-content-area::-webkit-scrollbar {
                width: 8px;
            }
            
            .dnd-content-area::-webkit-scrollbar-track {
                background: rgba(26, 16, 14, 0.5);
                border-left: 1px solid #5c4b35;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #5c4b35, #3a2a20);
                border-radius: 2px;
                border: 1px solid #9d8b6c;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, #9d8b6c, #5c4b35);
            }
            
            /* 悬浮提示框 */
            .dnd-tooltip {
                background: linear-gradient(135deg, #2b2420, #1a1510);
                border: 2px solid #5c4b35;
                border-radius: 4px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            }
            
            .dnd-tooltip::before {
                border-color: #5c4b35 transparent transparent transparent;
            }
            
            /* 图标容器 - 古典圆形徽章 */
            .dnd-icon-circle {
                border: 2px solid #5c4b35;
                background: radial-gradient(circle at 30% 30%, #3a2a20, #1a1510);
                box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 2px 5px rgba(0,0,0,0.3);
            }
            
            /* 头像框 - 椭圆肖像画框 */
            .dnd-avatar {
                border: 3px solid #9d8b6c;
                box-shadow: 0 0 0 2px #5c4b35, 0 4px 10px rgba(0,0,0,0.4);
            }
        `,
        background: {
            type: 'particles',
            colors: ['rgba(255, 219, 133, 0.8)', 'rgba(157, 139, 108, 0.6)', 'rgba(255, 255, 255, 0.5)', 'rgba(138, 43, 226, 0.4)'],
            minSize: 1,
            maxSize: 4,
            count: 20,
            speed: 0.03,
            glow: true
        }
};
