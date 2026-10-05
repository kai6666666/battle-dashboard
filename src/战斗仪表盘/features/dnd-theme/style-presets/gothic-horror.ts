// features/dnd-theme/style-presets/gothic-horror.ts
// 风格包：gothic-horror（b11a · 自 BasedonST `src/config/StylePresets.js` 拆分移植）
export const gothicHorror = {
        meta: {
            id: 'gothic-horror',
            name: '暗黑哥特',
            icon: '🧛',
            description: '深邃压抑的血色风格，适合恐怖战役',
            author: 'System'
        },
        colors: {
            '--dnd-bg-main': '#0a0a0a',
            '--dnd-bg-panel-start': '#1a0505',
            '--dnd-bg-panel-end': '#000000',
            '--dnd-text-main': '#b3b3b3',
            '--dnd-text-header': '#cc0000',
            '--dnd-text-dim': '#666666',
            '--dnd-text-highlight': '#ff3333',
            '--dnd-accent': '#8a0a0a',
            '--dnd-accent-hover': '#aa2020',
            '--dnd-border-gold': '#4d0000',
            '--dnd-border-inner': '#2a0000',
            '--dnd-bg-card-start': '#140a0a',
            '--dnd-bg-card-end': '#0a0505',
            '--dnd-btn-primary': '#3d0000',
            '--dnd-btn-primary-hover': '#5c0000',
            '--dnd-btn-text': '#cccccc'
        },
        morphology: {
            border: { style: 'double', width: '4px', outerStyle: 'none' },
            corners: { style: 'sharp', clipPath: 'none' },
            card: { shape: 'gothic', decoration: 'ornate' },
            effects: { texture: 'fabric', innerGlow: 'none', borderGlow: 'evil', overlay: 'blood-vignette' },
            layout: { density: 'spacious' },
            decorations: { headers: 'banner', corners: 'flourish' },
            buttons: { style: 'gothic', shape: 'pointed' },
            progressBars: { style: 'blood', animated: true }
        },
        typography: {
            '--dnd-font-serif': '"Cinzel", "Times New Roman", serif',
            '--dnd-font-size-header': '1.3rem',
            '--dnd-letter-spacing': '0.05em'
        },
        animations: {
            '--dnd-transition-fast': '0.15s ease-out',
            '--dnd-transition-normal': '0.3s ease-out',
            '--dnd-animation-pulse': 'gothic-pulse 3s ease-in-out infinite'
        },
        interactiveStates: {
            hover: {
                brightness: 1.15,
                scale: 1.02,
                lift: '-4px',
                shadow: '0 12px 35px rgba(138, 10, 10, 0.5), 0 0 20px rgba(138, 10, 10, 0.3)',
                borderColor: '#8a0a0a',
                glow: 'drop-shadow(0 0 8px rgba(138, 10, 10, 0.6))',
                transition: '0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
            },
            cardHover: {
                transform: 'translateY(-8px) scale(1.02) rotateX(2deg)',
                shadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 40px rgba(138, 10, 10, 0.4), inset 0 0 30px rgba(138, 10, 10, 0.1)',
                borderColor: '#cc0000'
            },
            buttonHover: {
                brightness: 1.3,
                transform: 'translateY(-3px) scale(1.03)',
                shadow: '0 8px 25px rgba(138, 10, 10, 0.6), 0 0 15px rgba(255, 0, 0, 0.4)'
            },
            active: {
                scale: 0.95,
                brightness: 0.85,
                transform: 'translateY(2px) scale(0.95)',
                shadow: '0 2px 10px rgba(0,0,0,0.6), inset 0 0 10px rgba(0,0,0,0.3)'
            },
            buttonActive: {
                transform: 'translateY(3px) scale(0.97)',
                shadow: '0 1px 5px rgba(0,0,0,0.5), inset 0 2px 5px rgba(0,0,0,0.3)'
            },
            selected: {
                background: 'linear-gradient(90deg, rgba(138, 10, 10, 0.4), rgba(77, 0, 0, 0.2), transparent)',
                borderColor: '#ff3333',
                borderWidth: '2px',
                glow: '0 0 20px rgba(138, 10, 10, 0.5)',
                textColor: '#ff6666'
            },
            navActive: {
                background: 'linear-gradient(90deg, rgba(138, 10, 10, 0.5), rgba(77, 0, 0, 0.3), transparent)',
                border: '3px solid #8a0a0a',
                indicator: '#cc0000'
            },
            focus: {
                borderColor: '#cc0000',
                shadow: '0 0 0 4px rgba(138, 10, 10, 0.3), 0 0 20px rgba(138, 10, 10, 0.2)',
                outline: 'none'
            },
            disabled: {
                opacity: 0.35,
                cursor: 'not-allowed',
                filter: 'grayscale(0.7) brightness(0.5)'
            },
            iconHover: {
                glow: 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.8)) drop-shadow(0 0 20px rgba(138, 10, 10, 0.5))',
                scale: 1.2
            },
            inputFocus: {
                border: '#8a0a0a',
                shadow: '0 0 15px rgba(138, 10, 10, 0.4), inset 0 0 10px rgba(138, 10, 10, 0.15)'
            }
        },
        overrides: {
            /* ====== 卡片 - 哥特式尖顶拱门形态 ====== */
            '.dnd-char-card': {
                'border': '3px double #4d0000',
                'border-radius': '0',
                'clip-path': 'polygon(0 15px, 15px 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)',
                'box-shadow': '0 10px 40px rgba(0,0,0,0.95), inset 0 0 60px rgba(138, 10, 10, 0.15), 0 0 30px rgba(138, 10, 10, 0.2)',
                'background': 'linear-gradient(180deg, #140a0a 0%, #0a0505 50%, #050202 100%)'
            },
            '.dnd-card-header': {
                'border-bottom': '2px solid #4d0000',
                'background': 'linear-gradient(to right, rgba(138, 10, 10, 0.35), rgba(0,0,0,0.8), rgba(138, 10, 10, 0.35))',
                'padding': '14px 18px',
                'position': 'relative'
            },
            '.dnd-card-body': {
                'background': 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(138, 10, 10, 0.03) 40px, rgba(138, 10, 10, 0.03) 41px)',
                'padding': '16px'
            },
            /* ====== 导航栏 - 血色石柱 ====== */
            '.dnd-nav-sidebar': {
                'background': 'linear-gradient(180deg, #1a0505 0%, #0a0202 100%)',
                'border-right': '3px solid #4d0000',
                'box-shadow': '5px 0 20px rgba(0,0,0,0.8)'
            },
            '.dnd-nav-item': {
                'border-left': '4px solid transparent',
                'margin': '2px 0',
                'padding': '14px 20px',
                'background': 'rgba(138, 10, 10, 0.05)',
                'transition': 'all 0.3s ease-out',
                'clip-path': 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)'
            },
            '.dnd-nav-item:hover': {
                'background': 'linear-gradient(90deg, rgba(138, 10, 10, 0.3), rgba(77, 0, 0, 0.15))',
                'border-left-color': '#8a0a0a',
                'text-shadow': '0 0 8px rgba(255, 0, 0, 0.5)'
            },
            '.dnd-nav-item.active': {
                'background': 'linear-gradient(90deg, rgba(138, 10, 10, 0.5), rgba(77, 0, 0, 0.25), transparent)',
                'box-shadow': 'inset 4px 0 0 #cc0000, 0 0 25px rgba(138, 10, 10, 0.4)',
                'border-left-color': '#ff3333'
            },
            /* ====== 进度条 - 血液流动 ====== */
            '.dnd-bar-container': {
                'background': 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(20,5,5,0.8))',
                'border': '1px solid #4d0000',
                'border-radius': '0',
                'height': '10px',
                'box-shadow': 'inset 0 2px 5px rgba(0,0,0,0.8)'
            },
            '.dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #3d0000 0%, #8a0a0a 40%, #cc0000 60%, #8a0a0a 80%, #3d0000 100%)',
                'box-shadow': '0 0 12px rgba(204, 0, 0, 0.6), inset 0 0 5px rgba(255, 100, 100, 0.3)',
                'border-radius': '0'
            },
            '.dnd-bar-hp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #2a0000 0%, #6a0000 40%, #aa0000 60%, #6a0000 80%, #2a0000 100%)'
            },
            '.dnd-bar-exp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #200020 0%, #400040 40%, #600060 60%, #400040 80%, #200020 100%)'
            },
            /* ====== 按钮 - 哥特式石碑 ====== */
            '.dnd-btn, .dnd-action-btn': {
                'text-transform': 'uppercase',
                'letter-spacing': '0.12em',
                'border': '2px solid #4d0000',
                'background': 'linear-gradient(180deg, #2a0a0a 0%, #1a0505 50%, #0f0303 100%)',
                'box-shadow': 'inset 0 1px 0 rgba(255,100,100,0.1), 0 4px 10px rgba(0,0,0,0.6)',
                'clip-path': 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
                'font-family': '"Cinzel", serif',
                'position': 'relative'
            },
            '.dnd-btn:hover, .dnd-action-btn:hover': {
                'background': 'linear-gradient(180deg, #3d0a0a 0%, #2a0505 50%, #1a0303 100%)',
                'border-color': '#8a0a0a',
                'box-shadow': '0 0 20px rgba(138, 10, 10, 0.5), 0 6px 15px rgba(0,0,0,0.7)'
            },
            '.dnd-btn:active, .dnd-action-btn:active': {
                'background': 'linear-gradient(180deg, #1a0505 0%, #0f0303 100%)',
                'box-shadow': 'inset 0 3px 8px rgba(0,0,0,0.6)'
            },
            /* ====== 属性行 - 墓碑铭文 ====== */
            '.dnd-stat-row': {
                'background': 'linear-gradient(90deg, rgba(77, 0, 0, 0.15), rgba(20, 10, 10, 0.3), rgba(77, 0, 0, 0.15))',
                'border': '1px solid rgba(77, 0, 0, 0.4)',
                'border-top': '1px solid rgba(138, 10, 10, 0.3)',
                'border-radius': '0',
                'padding': '8px 12px',
                'margin': '3px 0'
            },
            '.dnd-stat-row:hover': {
                'background': 'linear-gradient(90deg, rgba(138, 10, 10, 0.25), rgba(20, 10, 10, 0.4), rgba(138, 10, 10, 0.25))'
            },
            /* ====== 标题样式 - 血色铭文 ====== */
            '.dnd-title, .dnd-char-name': {
                'text-shadow': '0 0 10px #ff0000, 0 0 25px rgba(255, 0, 0, 0.6), 0 2px 4px rgba(0,0,0,0.8)',
                'font-family': '"Cinzel", serif',
                'letter-spacing': '0.1em'
            },
            /* ====== 面板/弹窗 - 哥特式窗框 ====== */
            '.dnd-panel, .dnd-dialog': {
                'border': '3px double #4d0000',
                'border-radius': '0',
                'clip-path': 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
                'box-shadow': '0 15px 50px rgba(0,0,0,0.9), inset 0 0 80px rgba(138, 10, 10, 0.1)'
            },
            /* ====== 输入框 ====== */
            '.dnd-input, .dnd-select, .dnd-textarea': {
                'background': 'rgba(10, 5, 5, 0.9)',
                'border': '1px solid #4d0000',
                'border-radius': '0',
                'color': '#b3b3b3'
            },
            '.dnd-input:focus, .dnd-select:focus, .dnd-textarea:focus': {
                'border-color': '#8a0a0a',
                'box-shadow': '0 0 15px rgba(138, 10, 10, 0.4), inset 0 0 8px rgba(138, 10, 10, 0.15)'
            },
            /* ====== 表格 ====== */
            '.dnd-table': {
                'border': '1px solid #4d0000'
            },
            '.dnd-table th': {
                'background': 'linear-gradient(180deg, #2a0505, #1a0303)',
                'border-bottom': '2px solid #8a0a0a',
                'color': '#ff3333',
                'letter-spacing': '0.08em'
            },
            '.dnd-table td': {
                'border-bottom': '1px solid rgba(77, 0, 0, 0.4)'
            },
            '.dnd-table tr:hover td': {
                'background': 'rgba(138, 10, 10, 0.15)'
            },
            /* ====== 徽章 ====== */
            '.dnd-badge': {
                'background': 'linear-gradient(135deg, #4d0000, #2a0000)',
                'border': '1px solid #8a0a0a',
                'border-radius': '0',
                'clip-path': 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)'
            },
            /* ====== 迷你HUD ====== */
            '#dnd-mini-hud': {
                'border': '2px solid #4d0000',
                'border-radius': '0',
                'clip-path': 'polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                'background': 'linear-gradient(180deg, rgba(26, 5, 5, 0.98), rgba(10, 2, 2, 1))'
            }
        },
        customCSS: `
            /* ====== 暗黑哥特皮肤 - 恐怖氛围动画与装饰 ====== */
            
            /* 血红脉动光效 */
            @keyframes gothic-pulse {
                0%, 100% {
                    box-shadow: 0 10px 40px rgba(0,0,0,0.95), inset 0 0 60px rgba(138, 10, 10, 0.15), 0 0 30px rgba(138, 10, 10, 0.2);
                    filter: brightness(1);
                }
                50% {
                    box-shadow: 0 10px 40px rgba(0,0,0,0.95), inset 0 0 80px rgba(138, 10, 10, 0.25), 0 0 50px rgba(138, 10, 10, 0.35);
                    filter: brightness(1.03);
                }
            }
            
            /* 血液滴落动画 */
            @keyframes blood-drip {
                0% { height: 0; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { height: 30px; opacity: 0; }
            }
            
            /* 阴影呼吸效果 */
            @keyframes shadow-breathe {
                0%, 100% { opacity: 0.4; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.02); }
            }
            
            /* 恐怖闪烁 */
            @keyframes horror-flicker {
                0%, 100% { opacity: 1; }
                92% { opacity: 1; }
                93% { opacity: 0.3; }
                94% { opacity: 1; }
                96% { opacity: 0.5; }
                97% { opacity: 1; }
            }
            
            /* 血红边框流动 */
            @keyframes blood-flow {
                0% { background-position: 0% 0%; }
                100% { background-position: 200% 0%; }
            }
            
            /* 卡片 - 哥特式恐怖氛围 */
            .dnd-char-card {
                position: relative;
                animation: gothic-pulse 4s ease-in-out infinite;
            }
            
            /* 血色暗角叠加 */
            .dnd-char-card::before {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.8) 100%);
                pointer-events: none;
                z-index: 1;
            }
            
            /* 装饰性裂痕纹理 */
            .dnd-char-card::after {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background:
                    linear-gradient(45deg, transparent 48%, rgba(77, 0, 0, 0.1) 49%, rgba(77, 0, 0, 0.1) 51%, transparent 52%),
                    linear-gradient(-45deg, transparent 48%, rgba(77, 0, 0, 0.1) 49%, rgba(77, 0, 0, 0.1) 51%, transparent 52%);
                background-size: 40px 40px;
                pointer-events: none;
                z-index: 0;
                opacity: 0.5;
            }
            
            /* 卡片头部 - 尖顶拱门装饰 */
            .dnd-card-header::before {
                content: "†";
                position: absolute;
                left: 12px; top: 50%;
                transform: translateY(-50%);
                color: #8a0a0a;
                font-size: 16px;
                text-shadow: 0 0 10px rgba(138, 10, 10, 0.8);
            }
            
            .dnd-card-header::after {
                content: "†";
                position: absolute;
                right: 12px; top: 50%;
                transform: translateY(-50%);
                color: #8a0a0a;
                font-size: 16px;
                text-shadow: 0 0 10px rgba(138, 10, 10, 0.8);
            }
            
            /* 导航项 - 血迹指示 */
            .dnd-nav-item::before {
                content: "";
                position: absolute;
                left: 0; top: 50%;
                transform: translateY(-50%);
                width: 4px; height: 0;
                background: linear-gradient(to bottom, #cc0000, #8a0a0a);
                transition: height 0.3s ease-out;
                box-shadow: 0 0 10px rgba(204, 0, 0, 0.5);
            }
            
            .dnd-nav-item:hover::before {
                height: 70%;
            }
            
            .dnd-nav-item.active::before {
                height: 100%;
                box-shadow: 0 0 15px rgba(204, 0, 0, 0.8);
            }
            
            .dnd-nav-item.active::after {
                content: "⛧";
                position: absolute;
                right: 12px;
                color: #cc0000;
                font-size: 12px;
                text-shadow: 0 0 8px rgba(204, 0, 0, 0.8);
                animation: horror-flicker 3s infinite;
            }
            
            /* 按钮 - 石碑雕刻效果 */
            .dnd-btn::before,
            .dnd-action-btn::before {
                content: "";
                position: absolute;
                top: 3px; left: 3px; right: 3px; bottom: 3px;
                border: 1px solid rgba(138, 10, 10, 0.2);
                pointer-events: none;
            }
            
            /* 进度条 - 血液流动效果 */
            .dnd-bar-fill {
                position: relative;
                overflow: hidden;
            }
            
            .dnd-bar-fill::before {
                content: "";
                position: absolute;
                top: 0; left: -100%; width: 100%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 100, 100, 0.3), transparent);
                animation: blood-flow 2s ease-in-out infinite;
            }
            
            /* 分隔线 - 铁栅栏 */
            .dnd-divider {
                height: 3px;
                background:
                    linear-gradient(90deg, transparent, #4d0000 20%, #8a0a0a 50%, #4d0000 80%, transparent),
                    repeating-linear-gradient(90deg, transparent, transparent 10px, #2a0000 10px, #2a0000 11px);
                position: relative;
            }
            
            .dnd-divider::before {
                content: "☠";
                position: absolute;
                left: 50%; top: 50%;
                transform: translate(-50%, -50%);
                background: #0a0505;
                padding: 0 12px;
                color: #8a0a0a;
                font-size: 14px;
                text-shadow: 0 0 8px rgba(138, 10, 10, 0.6);
            }
            
            /* 面板角落 - 哥特式装饰 */
            .dnd-panel::before,
            .dnd-dialog::before {
                content: "⚜";
                position: absolute;
                top: 8px; left: 10px;
                color: #4d0000;
                font-size: 16px;
                text-shadow: 0 0 5px rgba(77, 0, 0, 0.5);
            }
            
            .dnd-panel::after,
            .dnd-dialog::after {
                content: "⚜";
                position: absolute;
                bottom: 8px; right: 10px;
                color: #4d0000;
                font-size: 16px;
                text-shadow: 0 0 5px rgba(77, 0, 0, 0.5);
                transform: rotate(180deg);
            }
            
            /* 滚动条 - 血迹风格 */
            .dnd-content-area::-webkit-scrollbar {
                width: 10px;
            }
            
            .dnd-content-area::-webkit-scrollbar-track {
                background: #0a0505;
                border-left: 1px solid #4d0000;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #4d0000, #8a0a0a, #4d0000);
                border: 1px solid #2a0000;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, #8a0a0a, #cc0000, #8a0a0a);
                box-shadow: 0 0 10px rgba(204, 0, 0, 0.5);
            }
            
            /* 图标容器 - 五芒星形 */
            .dnd-icon-circle {
                clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                border: none;
                background: linear-gradient(135deg, #4d0000, #2a0000);
                box-shadow: 0 0 15px rgba(138, 10, 10, 0.5);
            }
            
            /* 头像框 - 棺材形 */
            .dnd-avatar {
                clip-path: polygon(20% 0%, 80% 0%, 100% 15%, 100% 85%, 80% 100%, 20% 100%, 0% 85%, 0% 15%);
                border: 2px solid #4d0000;
                box-shadow: 0 0 20px rgba(138, 10, 10, 0.4);
            }
            
            /* 悬停时的恐怖效果 */
            .dnd-char-card:hover {
                animation: horror-flicker 0.5s ease-in-out;
            }
            
            /* 工具提示 - 墓碑 */
            .dnd-tooltip {
                background: linear-gradient(180deg, #1a0505, #0a0303);
                border: 2px solid #4d0000;
                clip-path: polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
                box-shadow: 0 5px 20px rgba(0,0,0,0.8);
            }
        `,
        background: {
            type: 'particles',
            colors: ['rgba(138, 10, 10, 0.6)', 'rgba(50, 0, 0, 0.8)', 'rgba(20, 0, 0, 0.9)'],
            minSize: 1,
            maxSize: 4,
            count: 30,
            speed: 0.08,
            shape: 'circle',
            glow: true
        }
};
