// features/dnd-theme/style-presets/rose-garden.ts
// 风格包：rose-garden（b11a · 自 BasedonST `src/config/StylePresets.js` 拆分移植）
export const roseGarden = {
        meta: {
            id: 'rose-garden',
            name: '玫瑰庭院',
            icon: '<i class="fa-solid fa-heart"></i>',
            description: '优雅成熟的玫瑰粉色风格，深色背景上的浪漫气息',
            author: 'System'
        },
        colors: {
            '--dnd-bg-main': '#1a0f14',
            '--dnd-bg-panel-start': '#2a1520',
            '--dnd-bg-panel-end': '#1a0f14',
            '--dnd-text-main': '#f0e0e6',
            '--dnd-text-header': '#ffb6c1',
            '--dnd-text-highlight': '#ffd1dc',
            '--dnd-text-dim': '#b08090',
            '--dnd-accent': '#e8508f',
            '--dnd-accent-hover': '#ff6b9d',
            '--dnd-border-gold': '#c07080',
            '--dnd-border-inner': '#8a4050',
            '--dnd-bg-card-start': 'rgba(42, 21, 32, 0.95)',
            '--dnd-bg-card-end': 'rgba(26, 15, 20, 0.98)',
            '--dnd-btn-primary': '#b04060',
            '--dnd-btn-primary-hover': '#d05080',
            '--dnd-btn-text': '#f0e0e6'
        },
        morphology: {
            border: { style: 'solid', width: '2px', outerStyle: 'none' },
            corners: { style: 'soft', clipPath: 'none' },
            card: { shape: 'elegant', decoration: 'roses' },
            effects: { texture: 'silk', innerGlow: 'rose', borderGlow: 'subtle', overlay: 'gradient' },
            layout: { density: 'normal' },
            decorations: { corners: 'flourish', dividers: 'ornate', headers: 'banner' },
            buttons: { style: 'elegant', shape: 'rounded' },
            progressBars: { style: 'rose', animated: true }
        },
        typography: {
            '--dnd-font-serif': '"Cinzel", "Palatino Linotype", "Book Antiqua", serif',
            '--dnd-font-size-base': '0.95rem',
            '--dnd-font-size-header': '1.15rem',
            '--dnd-font-weight-header': '600',
            '--dnd-letter-spacing': '0.04em'
        },
        animations: {
            '--dnd-transition-fast': '0.2s ease-out',
            '--dnd-transition-normal': '0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            '--dnd-animation-bloom': 'rose-bloom 4s ease-in-out infinite'
        },
        interactiveStates: {
            hover: {
                brightness: 1.1,
                scale: 1.02,
                lift: '-4px',
                shadow: '0 10px 30px rgba(232, 80, 143, 0.25), 0 0 15px rgba(255, 182, 193, 0.15)',
                borderColor: '#c07080',
                glow: 'drop-shadow(0 0 6px rgba(232, 80, 143, 0.4))',
                transition: '0.3s ease-out'
            },
            cardHover: {
                transform: 'translateY(-6px) scale(1.015)',
                shadow: '0 18px 40px rgba(26, 15, 20, 0.6), 0 0 25px rgba(232, 80, 143, 0.2), inset 0 0 20px rgba(255, 182, 193, 0.05)',
                borderColor: '#e8508f'
            },
            buttonHover: {
                brightness: 1.18,
                transform: 'translateY(-2px) scale(1.03)',
                shadow: '0 6px 20px rgba(176, 64, 96, 0.5), 0 0 12px rgba(232, 80, 143, 0.3)'
            },
            active: {
                scale: 0.97,
                brightness: 0.92,
                transform: 'translateY(1px) scale(0.97)',
                shadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 3px rgba(0,0,0,0.2)'
            },
            buttonActive: {
                transform: 'translateY(2px) scale(0.98)',
                shadow: '0 1px 4px rgba(0,0,0,0.4), inset 0 2px 5px rgba(0,0,0,0.3)'
            },
            selected: {
                background: 'linear-gradient(90deg, rgba(232, 80, 143, 0.25), rgba(192, 112, 128, 0.15), transparent)',
                borderColor: '#ffd1dc',
                borderWidth: '2px',
                glow: '0 0 15px rgba(232, 80, 143, 0.35)',
                textColor: '#ffd1dc'
            },
            navActive: {
                background: 'linear-gradient(90deg, rgba(232, 80, 143, 0.3), rgba(192, 112, 128, 0.2), transparent)',
                border: '3px solid #c07080',
                indicator: '#e8508f'
            },
            focus: {
                borderColor: '#e8508f',
                shadow: '0 0 0 3px rgba(232, 80, 143, 0.3)',
                outline: 'none'
            },
            disabled: {
                opacity: 0.45,
                cursor: 'not-allowed',
                filter: 'grayscale(0.5) brightness(0.7)'
            },
            iconHover: {
                glow: 'drop-shadow(0 0 8px rgba(232, 80, 143, 0.7)) drop-shadow(0 0 15px rgba(255, 182, 193, 0.4))',
                scale: 1.15
            },
            inputFocus: {
                border: '#c07080',
                shadow: '0 0 12px rgba(232, 80, 143, 0.3), inset 0 0 8px rgba(192, 112, 128, 0.1)'
            }
        },
        overrides: {
            /* ====== 卡片 - 玫瑰花瓣形态 ====== */
            '.dnd-char-card': {
                'box-shadow': '0 8px 30px rgba(26, 15, 20, 0.6), inset 0 0 40px rgba(232, 80, 143, 0.08), 0 0 20px rgba(255, 182, 193, 0.1)',
                'border': '2px solid #8a4050',
                'border-radius': '16px',
                'background': 'linear-gradient(135deg, rgba(42, 21, 32, 0.95) 0%, rgba(35, 18, 26, 0.97) 50%, rgba(26, 15, 20, 0.98) 100%)'
            },
            '.dnd-card-header': {
                'border-bottom': '2px solid #8a4050',
                'background': 'linear-gradient(to right, rgba(232, 80, 143, 0.2), rgba(138, 64, 80, 0.15), rgba(255, 182, 193, 0.15))',
                'border-radius': '14px 14px 0 0',
                'padding': '14px 18px',
                'position': 'relative'
            },
            '.dnd-card-body': {
                'background': 'radial-gradient(ellipse at bottom right, rgba(232, 80, 143, 0.05), transparent 70%)',
                'padding': '16px'
            },
            /* ====== 导航栏 - 玫瑰藤蔓 ====== */
            '.dnd-nav-sidebar': {
                'background': 'linear-gradient(180deg, #2a1520 0%, #1a0f14 100%)',
                'border-right': '3px solid #8a4050',
                'box-shadow': '3px 0 15px rgba(26, 15, 20, 0.5)'
            },
            '.dnd-nav-item': {
                'border-radius': '0 12px 12px 0',
                'margin': '4px 0',
                'padding': '12px 20px',
                'border-left': '4px solid transparent',
                'background': 'rgba(232, 80, 143, 0.03)',
                'transition': 'all 0.3s ease-out'
            },
            '.dnd-nav-item:hover': {
                'background': 'linear-gradient(90deg, rgba(232, 80, 143, 0.2), rgba(192, 112, 128, 0.1), transparent)',
                'border-left-color': '#c07080',
                'padding-left': '24px'
            },
            '.dnd-nav-item.active': {
                'background': 'linear-gradient(90deg, rgba(232, 80, 143, 0.3), rgba(192, 112, 128, 0.15), transparent)',
                'box-shadow': 'inset 4px 0 0 #e8508f, 0 0 20px rgba(232, 80, 143, 0.2)',
                'border-left-color': '#e8508f'
            },
            /* ====== 进度条 - 玫瑰花茎 ====== */
            '.dnd-bar-container': {
                'background': 'linear-gradient(180deg, rgba(26, 15, 20, 0.8), rgba(42, 21, 32, 0.6))',
                'border': '1px solid #8a4050',
                'border-radius': '10px',
                'height': '10px',
                'box-shadow': 'inset 0 1px 4px rgba(0,0,0,0.4)'
            },
            '.dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #8a4050 0%, #b04060 40%, #e8508f 70%, #ff6b9d 100%)',
                'box-shadow': '0 0 10px rgba(232, 80, 143, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                'border-radius': '8px'
            },
            '.dnd-bar-hp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #6a3040 0%, #903050 40%, #c04060 70%, #903050 100%)'
            },
            '.dnd-bar-exp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #5a3050 0%, #804070 40%, #b050a0 70%, #804070 100%)'
            },
            /* ====== 按钮 - 玫瑰花蕾 ====== */
            '.dnd-btn, .dnd-action-btn': {
                'border': '2px solid #8a4050',
                'background': 'linear-gradient(135deg, #3a1a24 0%, #2a1520 100%)',
                'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.1), 0 3px 8px rgba(0,0,0,0.4)',
                'border-radius': '12px',
                'font-family': '"Cinzel", serif',
                'position': 'relative',
                'overflow': 'hidden'
            },
            '.dnd-btn:hover, .dnd-action-btn:hover': {
                'background': 'linear-gradient(135deg, #4a2a34 0%, #3a1a24 100%)',
                'border-color': '#c07080',
                'box-shadow': '0 0 15px rgba(232, 80, 143, 0.3), 0 5px 12px rgba(0,0,0,0.4)'
            },
            '.dnd-btn:active, .dnd-action-btn:active': {
                'background': 'linear-gradient(135deg, #2a1520 0%, #1a0f14 100%)',
                'box-shadow': 'inset 0 2px 4px rgba(0,0,0,0.4)'
            },
            /* ====== 属性行 - 玫瑰花瓣纹理 ====== */
            '.dnd-stat-row': {
                'background': 'linear-gradient(90deg, rgba(232, 80, 143, 0.1), rgba(138, 64, 80, 0.1), rgba(232, 80, 143, 0.05))',
                'border': '1px solid rgba(138, 64, 80, 0.3)',
                'border-radius': '8px',
                'padding': '8px 12px',
                'margin': '4px 0'
            },
            '.dnd-stat-row:hover': {
                'background': 'linear-gradient(90deg, rgba(232, 80, 143, 0.15), rgba(138, 64, 80, 0.15), rgba(232, 80, 143, 0.1))'
            },
            /* ====== 标题样式 - 玫瑰铭文 ====== */
            '.dnd-title, .dnd-char-name': {
                'text-shadow': '0 2px 10px rgba(232, 80, 143, 0.4), 0 0 20px rgba(255, 182, 193, 0.2)',
                'font-family': '"Cinzel", "Palatino Linotype", serif',
                'letter-spacing': '0.05em'
            },
            /* ====== 面板/弹窗 - 玫瑰窗格 ====== */
            '.dnd-panel, .dnd-dialog': {
                'border': '2px solid #8a4050',
                'border-radius': '20px',
                'box-shadow': '0 10px 40px rgba(26, 15, 20, 0.6), inset 0 0 50px rgba(232, 80, 143, 0.05)'
            },
            '#dnd-mini-hud': {
                'border': '2px solid #8a4050',
                'border-radius': '14px',
                'background': 'linear-gradient(180deg, rgba(42, 21, 32, 0.98), rgba(26, 15, 20, 0.99))'
            },
            /* ====== 输入框 ====== */
            '.dnd-input, .dnd-select, .dnd-textarea': {
                'background': 'rgba(26, 15, 20, 0.8)',
                'border': '1px solid #8a4050',
                'border-radius': '8px',
                'color': '#f0e0e6'
            },
            '.dnd-input:focus, .dnd-select:focus, .dnd-textarea:focus': {
                'border-color': '#c07080',
                'box-shadow': '0 0 12px rgba(232, 80, 143, 0.3), inset 0 0 6px rgba(192, 112, 128, 0.1)'
            },
            /* ====== 表格 ====== */
            '.dnd-table th': {
                'background': 'linear-gradient(180deg, #3a1a24, #2a1520)',
                'border-bottom': '2px solid #c07080',
                'color': '#ffb6c1'
            },
            '.dnd-table td': {
                'border-bottom': '1px solid rgba(138, 64, 80, 0.3)'
            },
            '.dnd-table tr:hover td': {
                'background': 'rgba(232, 80, 143, 0.1)'
            },
            /* ====== 徽章 ====== */
            '.dnd-badge': {
                'background': 'linear-gradient(135deg, #8a4050, #5a3040)',
                'border': '1px solid #c07080',
                'border-radius': '8px'
            }
        },
        customCSS: `
            /* ====== 玫瑰庭院皮肤 - 浪漫优雅动画与装饰 ====== */
            
            /* 玫瑰绽放光效 */
            @keyframes rose-bloom {
                0%, 100% {
                    box-shadow: 0 8px 30px rgba(26, 15, 20, 0.6), inset 0 0 40px rgba(232, 80, 143, 0.08), 0 0 20px rgba(255, 182, 193, 0.1);
                    filter: brightness(1);
                }
                50% {
                    box-shadow: 0 8px 35px rgba(26, 15, 20, 0.65), inset 0 0 50px rgba(232, 80, 143, 0.12), 0 0 30px rgba(255, 182, 193, 0.18);
                    filter: brightness(1.02);
                }
            }
            
            /* 花瓣飘落动画 */
            @keyframes petal-fall {
                0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
                10% { opacity: 0.8; }
                100% { transform: translateY(100px) rotate(180deg); opacity: 0; }
            }
            
            /* 玫瑰脉动 */
            @keyframes rose-pulse {
                0%, 100% { opacity: 0.6; transform: scale(1); }
                50% { opacity: 0.9; transform: scale(1.05); }
            }
            
            /* 丝绸光泽流动 */
            @keyframes silk-shimmer {
                0% { transform: translateX(-100%); }
                50%, 100% { transform: translateX(100%); }
            }
            
            /* 卡片 - 玫瑰花瓣形态 */
            .dnd-char-card {
                position: relative;
                animation: rose-bloom 5s ease-in-out infinite;
            }
            
            /* 外发光边框 - 玫瑰光晕 */
            .dnd-char-card::before {
                content: "";
                position: absolute;
                top: -3px; left: -3px; right: -3px; bottom: -3px;
                background: linear-gradient(135deg, rgba(232, 80, 143, 0.3) 0%, transparent 25%, transparent 75%, rgba(255, 182, 193, 0.2) 100%);
                border-radius: 18px;
                pointer-events: none;
                z-index: -1;
                filter: blur(3px);
            }
            
            /* 丝绸纹理叠加 */
            .dnd-char-card::after {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='silk'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23silk)' opacity='0.03'/%3E%3C/svg%3E");
                pointer-events: none;
                border-radius: inherit;
                z-index: 0;
            }
            
            /* 卡片头部 - 玫瑰装饰 */
            .dnd-card-header::before {
                content: "❀";
                position: absolute;
                left: 12px; top: 50%;
                transform: translateY(-50%);
                color: #e8508f;
                font-size: 14px;
                opacity: 0.7;
                animation: rose-pulse 3s ease-in-out infinite;
            }
            
            .dnd-card-header::after {
                content: "❀";
                position: absolute;
                right: 12px; top: 50%;
                transform: translateY(-50%) scaleX(-1);
                color: #c07080;
                font-size: 14px;
                opacity: 0.7;
                animation: rose-pulse 3s ease-in-out infinite 0.5s;
            }
            
            /* 导航项 - 玫瑰藤蔓效果 */
            .dnd-nav-item::before {
                content: "";
                position: absolute;
                left: 0; top: 50%;
                transform: translateY(-50%);
                width: 0; height: 3px;
                background: linear-gradient(90deg, #e8508f, #ff6b9d);
                transition: width 0.3s ease-out;
                border-radius: 0 3px 3px 0;
            }
            
            .dnd-nav-item:hover::before {
                width: 20px;
            }
            
            .dnd-nav-item.active::before {
                width: 30px;
                box-shadow: 0 0 10px rgba(232, 80, 143, 0.5);
            }
            
            .dnd-nav-item.active::after {
                content: "❧";
                position: absolute;
                right: 12px;
                color: #e8508f;
                font-size: 12px;
            }
            
            /* 按钮 - 丝绸光泽效果 */
            .dnd-btn::before,
            .dnd-action-btn::before {
                content: "";
                position: absolute;
                top: 0; left: -100%;
                width: 50%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
                transition: left 0.5s ease;
            }
            
            .dnd-btn:hover::before,
            .dnd-action-btn:hover::before {
                left: 100%;
            }
            
            /* 进度条 - 玫瑰流动效果 */
            .dnd-bar-fill {
                position: relative;
                overflow: hidden;
            }
            
            .dnd-bar-fill::before {
                content: "";
                position: absolute;
                top: 0; left: -50%; width: 50%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
                animation: silk-shimmer 2.5s ease-in-out infinite;
            }
            
            /* 分隔线 - 玫瑰藤 */
            .dnd-divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, #8a4050, #c07080, #8a4050, transparent);
                position: relative;
                margin: 12px 0;
            }
            
            .dnd-divider::before {
                content: "✿";
                position: absolute;
                left: 50%; top: 50%;
                transform: translate(-50%, -50%);
                background: #1a0f14;
                padding: 0 10px;
                color: #e8508f;
                font-size: 12px;
            }
            
            /* 面板角落 - 玫瑰花纹装饰 */
            .dnd-panel::before,
            .dnd-dialog::before {
                content: "❧";
                position: absolute;
                top: 8px; left: 10px;
                color: #c07080;
                font-size: 16px;
                opacity: 0.6;
            }
            
            .dnd-panel::after,
            .dnd-dialog::after {
                content: "❧";
                position: absolute;
                bottom: 8px; right: 10px;
                color: #c07080;
                font-size: 16px;
                opacity: 0.6;
                transform: rotate(180deg);
            }
            
            /* 滚动条 - 玫瑰风格 */
            .dnd-content-area::-webkit-scrollbar {
                width: 10px;
            }
            
            .dnd-content-area::-webkit-scrollbar-track {
                background: rgba(26, 15, 20, 0.5);
                border-left: 1px solid #8a4050;
                border-radius: 5px;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #8a4050, #b04060, #8a4050);
                border-radius: 5px;
                border: 1px solid #5a3040;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, #b04060, #e8508f, #b04060);
            }
            
            /* 图标容器 - 玫瑰徽章 */
            .dnd-icon-circle {
                border-radius: 50%;
                border: 2px solid #c07080;
                background: radial-gradient(circle at 30% 30%, #3a1a24, #1a0f14);
                box-shadow: 0 0 15px rgba(232, 80, 143, 0.3);
            }
            
            /* 头像框 - 椭圆玫瑰框 */
            .dnd-avatar {
                border-radius: 60% 40% 50% 50% / 50% 50% 40% 60%;
                border: 2px solid #c07080;
                box-shadow: 0 0 15px rgba(232, 80, 143, 0.3), 0 0 30px rgba(255, 182, 193, 0.15);
            }
            
            /* 工具提示 */
            .dnd-tooltip {
                background: linear-gradient(135deg, #2a1520, #1a0f14);
                border: 1px solid #c07080;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(26, 15, 20, 0.6);
            }
            
            /* 悬浮光效 */
            .dnd-char-card:hover {
                box-shadow: 0 12px 40px rgba(26, 15, 20, 0.7), inset 0 0 50px rgba(232, 80, 143, 0.1), 0 0 30px rgba(255, 182, 193, 0.2);
            }
        `,
        background: {
            type: 'particles',
            colors: ['rgba(232, 80, 143, 0.6)', 'rgba(255, 182, 193, 0.5)', 'rgba(192, 112, 128, 0.4)', 'rgba(255, 255, 255, 0.3)'],
            minSize: 2,
            maxSize: 6,
            count: 25,
            speed: 0.04,
            shape: 'circle',
            glow: true
        }
};
