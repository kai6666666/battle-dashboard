// features/dnd-theme/style-presets/lovecraftian.ts
// 风格包：lovecraftian（b11a · 自 BasedonST `src/config/StylePresets.js` 拆分移植）
export const lovecraftian = {
        meta: {
            id: 'lovecraftian',
            name: '旧日支配者',
            icon: '🐙',
            description: '混沌扭曲的克苏鲁风格，挑战你的理智',
            author: 'System'
        },
        colors: {
            '--dnd-bg-main': '#051010',
            '--dnd-bg-panel-start': '#0a1a15',
            '--dnd-bg-panel-end': '#050a0a',
            '--dnd-text-main': '#a0c0a0',
            '--dnd-text-header': '#d0a0d0',
            '--dnd-text-highlight': '#00ffaa',
            '--dnd-text-dim': '#507060',
            '--dnd-accent': '#800080',
            '--dnd-accent-hover': '#a020a0',
            '--dnd-border-gold': '#306040',
            '--dnd-border-inner': '#204030',
            '--dnd-bg-card-start': 'rgba(10, 26, 21, 0.9)',
            '--dnd-bg-card-end': 'rgba(5, 16, 16, 0.95)',
            '--dnd-btn-primary': '#402060',
            '--dnd-btn-primary-hover': '#603080',
            '--dnd-btn-text': '#a0c0a0'
        },
        morphology: {
            border: { style: 'solid', width: '1px', outerStyle: 'none' },
            corners: { style: 'irregular', clipPath: 'polygon(0% 0%, 100% 2%, 98% 100%, 2% 98%)' },
            card: { shape: 'distorted', decoration: 'runes' },
            effects: { texture: 'scales', innerGlow: 'medium', borderGlow: 'subtle', overlay: 'noise' },
            layout: { density: 'normal' },
            decorations: { icons: 'tentacles', corners: 'tentacle' },
            buttons: { style: 'eldritch', shape: 'irregular' },
            progressBars: { style: 'sanity', animated: true }
        },
        typography: {
            '--dnd-font-serif': '"Courier New", monospace',
            '--dnd-font-size-base': '0.95rem',
            '--dnd-letter-spacing': '0.03em'
        },
        animations: {
            '--dnd-transition-fast': '0.2s cubic-bezier(0.4, 0, 0.6, 1)',
            '--dnd-transition-normal': '0.4s cubic-bezier(0.4, 0, 0.6, 1)',
            '--dnd-animation-madness': 'eldritch-pulse 4s ease-in-out infinite',
            '--dnd-animation-distort': 'subtle-distort 8s ease-in-out infinite'
        },
        interactiveStates: {
            hover: {
                brightness: 1.15,
                scale: 1.02,
                lift: '-3px',
                shadow: '0 8px 25px rgba(0, 255, 170, 0.2), 0 0 15px rgba(128, 0, 128, 0.3)',
                borderColor: '#00ffaa',
                glow: 'drop-shadow(0 0 8px rgba(0, 255, 170, 0.4)) drop-shadow(0 0 15px rgba(128, 0, 128, 0.3))',
                transition: '0.3s cubic-bezier(0.4, 0, 0.6, 1)'
            },
            cardHover: {
                transform: 'translateY(-5px) rotate(0.8deg) scale(1.01)',
                shadow: '0 15px 40px rgba(5, 16, 16, 0.8), 0 0 30px rgba(0, 255, 170, 0.15), 0 0 50px rgba(128, 0, 128, 0.1)',
                borderColor: '#00ffaa'
            },
            buttonHover: {
                brightness: 1.25,
                transform: 'translateY(-2px) scale(1.02) skewX(-1deg)',
                shadow: '0 6px 20px rgba(128, 0, 128, 0.5), 0 0 12px rgba(0, 255, 170, 0.3)'
            },
            active: {
                scale: 0.96,
                brightness: 0.85,
                transform: 'translateY(2px) scale(0.96) rotate(-0.5deg)',
                shadow: '0 2px 8px rgba(0,0,0,0.6), inset 0 0 15px rgba(0, 255, 170, 0.1)'
            },
            buttonActive: {
                transform: 'translateY(2px) scale(0.97) skewX(1deg)',
                shadow: '0 1px 4px rgba(0,0,0,0.5), inset 0 2px 6px rgba(0,0,0,0.4)'
            },
            selected: {
                background: 'linear-gradient(90deg, rgba(0, 255, 170, 0.2), rgba(128, 0, 128, 0.15), transparent)',
                borderColor: '#00ffaa',
                borderWidth: '2px',
                glow: '0 0 20px rgba(0, 255, 170, 0.3), 0 0 40px rgba(128, 0, 128, 0.15)',
                textColor: '#00ffaa'
            },
            navActive: {
                background: 'linear-gradient(90deg, rgba(0, 255, 170, 0.25), rgba(128, 0, 128, 0.15), transparent)',
                border: '2px solid #306040',
                indicator: '#00ffaa'
            },
            focus: {
                borderColor: '#800080',
                shadow: '0 0 0 3px rgba(128, 0, 128, 0.3), 0 0 15px rgba(0, 255, 170, 0.2)',
                outline: 'none'
            },
            disabled: {
                opacity: 0.3,
                cursor: 'not-allowed',
                filter: 'grayscale(0.7) brightness(0.5) hue-rotate(30deg)'
            },
            iconHover: {
                glow: 'drop-shadow(0 0 10px rgba(0, 255, 170, 0.8)) drop-shadow(0 0 20px rgba(128, 0, 128, 0.5))',
                scale: 1.15
            },
            inputFocus: {
                border: '#306040',
                shadow: '0 0 15px rgba(0, 255, 170, 0.3), inset 0 0 10px rgba(128, 0, 128, 0.15)'
            }
        },
        overrides: {
            // 导航栏 - 扭曲的深渊入口
            '.dnd-nav-sidebar': {
                'background': 'linear-gradient(180deg, rgba(10, 26, 21, 0.98) 0%, rgba(5, 16, 16, 0.95) 100%)',
                'border-right': '2px solid #306040',
                'position': 'relative',
                'overflow': 'visible'
            },
            '.dnd-nav-item': {
                'background': 'linear-gradient(90deg, rgba(48, 96, 64, 0.3), transparent)',
                'border': '1px solid rgba(48, 96, 64, 0.5)',
                'border-radius': '0',
                'margin': '8px 10px',
                'padding': '12px 15px',
                'position': 'relative',
                'transition': 'all 0.4s cubic-bezier(0.4, 0, 0.6, 1)',
                'clip-path': 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%)'
            },
            '.dnd-nav-item:hover': {
                'background': 'linear-gradient(90deg, rgba(0, 255, 170, 0.15), rgba(128, 0, 128, 0.1), transparent)',
                'transform': 'skewX(-2deg) translateX(5px)',
                'border-color': '#00ffaa',
                'box-shadow': '0 0 20px rgba(0, 255, 170, 0.3)'
            },
            '.dnd-nav-item.active': {
                'background': 'linear-gradient(90deg, rgba(0, 255, 170, 0.25), rgba(128, 0, 128, 0.15), transparent)',
                'box-shadow': 'inset 0 0 20px rgba(0, 255, 170, 0.2), 0 0 25px rgba(128, 0, 128, 0.3)',
                'transform': 'skewX(-3deg) translateX(8px)',
                'border-color': '#00ffaa'
            },

            // 卡片 - 远古石板
            '.dnd-char-card': {
                'transform': 'rotate(0.5deg)',
                'border-radius': '0',
                'border': '2px solid #306040',
                'box-shadow': '0 10px 30px rgba(5, 16, 16, 0.8), inset 0 0 40px rgba(0, 255, 170, 0.05)',
                'position': 'relative',
                'clip-path': 'polygon(0% 2%, 3% 0%, 97% 0%, 100% 3%, 100% 97%, 98% 100%, 2% 100%, 0% 98%)',
                'overflow': 'visible'
            },
            '.dnd-char-card:nth-child(even)': {
                'transform': 'rotate(-0.5deg)'
            },
            '.dnd-card-header': {
                'border-bottom': '2px solid #306040',
                'background': 'linear-gradient(to right, rgba(128, 0, 128, 0.15), rgba(10, 26, 21, 0.9), rgba(0, 255, 170, 0.08))',
                'padding': '15px 20px',
                'position': 'relative'
            },
            '.dnd-card-body': {
                'padding': '20px',
                'background': 'linear-gradient(180deg, rgba(10, 26, 21, 0.6) 0%, rgba(5, 16, 16, 0.8) 100%)',
                'position': 'relative'
            },

            // 进度条 - 理智值/腐化度
            '.dnd-bar-container': {
                'background': 'linear-gradient(90deg, #0a1a15, #051010, #0a1a15)',
                'border': '1px solid #306040',
                'border-radius': '0',
                'height': '20px',
                'position': 'relative',
                'clip-path': 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)'
            },
            '.dnd-bar-fill': {
                'border-radius': '0',
                'position': 'relative',
                'overflow': 'hidden'
            },
            '.dnd-bar-hp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #402060, #800080, #00ffaa, #800080)'
            },
            '.dnd-bar-exp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #204030, #306040, #00ffaa)'
            },

            // 按钮 - 邪恶符文
            '.dnd-btn, .dnd-action-btn': {
                'border': '2px solid #306040',
                'border-radius': '0',
                'transform': 'skewX(-3deg)',
                'background': 'linear-gradient(135deg, rgba(64, 32, 96, 0.8), rgba(32, 64, 48, 0.8))',
                'position': 'relative',
                'overflow': 'hidden',
                'text-shadow': '0 0 5px rgba(0, 255, 170, 0.5)',
                'clip-path': 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)'
            },
            '.dnd-btn:hover, .dnd-action-btn:hover': {
                'border-color': '#00ffaa',
                'box-shadow': '0 0 25px rgba(0, 255, 170, 0.4), inset 0 0 15px rgba(128, 0, 128, 0.3)',
                'transform': 'skewX(-3deg) translateY(-2px)'
            },
            '.dnd-btn:active, .dnd-action-btn:active': {
                'transform': 'skewX(-3deg) scale(0.97)',
                'box-shadow': 'inset 0 0 20px rgba(0, 255, 170, 0.2)'
            },

            // 属性行 - 刻印文字
            '.dnd-stat-row': {
                'padding': '10px 15px',
                'margin': '4px 0',
                'background': 'linear-gradient(90deg, rgba(48, 96, 64, 0.1), transparent)',
                'border-left': '3px solid transparent',
                'position': 'relative',
                'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.6, 1)'
            },
            '.dnd-stat-row:hover': {
                'background': 'linear-gradient(90deg, rgba(0, 255, 170, 0.1), rgba(128, 0, 128, 0.05), transparent)',
                'border-left-color': '#00ffaa',
                'transform': 'skewX(-1deg)'
            },

            // 标题 - 远古语言
            '.dnd-title, .dnd-char-name': {
                'text-shadow': '0 0 15px rgba(208, 160, 208, 0.6), 0 0 30px rgba(128, 0, 128, 0.4)',
                'letter-spacing': '0.15em',
                'font-style': 'italic'
            },

            // 面板 - 深渊之门
            '.dnd-panel, .dnd-dialog': {
                'background': 'linear-gradient(135deg, rgba(10, 26, 21, 0.98), rgba(5, 16, 16, 0.95))',
                'border': '2px solid #306040',
                'border-radius': '0',
                'box-shadow': '0 0 40px rgba(5, 16, 16, 0.9), inset 0 0 60px rgba(128, 0, 128, 0.05)',
                'position': 'relative',
                'clip-path': 'polygon(0% 3%, 3% 0%, 97% 0%, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0% 97%)'
            },
            '#dnd-mini-hud': {
                'background': 'rgba(5, 16, 16, 0.95)',
                'border': '2px solid #306040',
                'box-shadow': '0 0 30px rgba(0, 255, 170, 0.2), inset 0 0 20px rgba(128, 0, 128, 0.1)'
            },

            // 输入框 - 黑暗卷轴
            '.dnd-input, .dnd-select, .dnd-textarea': {
                'background': 'rgba(5, 10, 10, 0.9)',
                'border': '1px solid #306040',
                'border-radius': '0',
                'color': '#a0c0a0',
                'font-family': '"Courier New", monospace'
            },
            '.dnd-input:focus, .dnd-select:focus, .dnd-textarea:focus': {
                'border-color': '#00ffaa',
                'box-shadow': '0 0 15px rgba(0, 255, 170, 0.3), inset 0 0 10px rgba(128, 0, 128, 0.15)'
            },

            // 表格 - 禁忌典籍
            '.dnd-table th': {
                'background': 'linear-gradient(90deg, rgba(64, 32, 96, 0.6), rgba(32, 64, 48, 0.6))',
                'color': '#d0a0d0',
                'border-bottom': '2px solid #306040',
                'text-transform': 'uppercase',
                'letter-spacing': '0.1em'
            },
            '.dnd-table td': {
                'border-bottom': '1px solid rgba(48, 96, 64, 0.3)',
                'padding': '12px'
            },
            '.dnd-table tr:hover td': {
                'background': 'rgba(0, 255, 170, 0.05)'
            },

            // 徽章 - 诅咒印记
            '.dnd-badge': {
                'background': 'linear-gradient(135deg, #402060, #204030)',
                'border': '1px solid #00ffaa',
                'border-radius': '0',
                'clip-path': 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0% 50%)',
                'text-shadow': '0 0 5px rgba(0, 255, 170, 0.8)'
            }
        },
        customCSS: `
            /* 克苏鲁动画 */
            @keyframes eldritch-pulse {
                0%, 100% {
                    box-shadow: 0 10px 30px rgba(5, 16, 16, 0.8), inset 0 0 40px rgba(0, 255, 170, 0.05);
                    filter: hue-rotate(0deg);
                }
                25% {
                    box-shadow: 0 10px 35px rgba(5, 16, 16, 0.85), inset 0 0 50px rgba(128, 0, 128, 0.1);
                    filter: hue-rotate(8deg);
                }
                50% {
                    box-shadow: 0 10px 40px rgba(5, 16, 16, 0.8), inset 0 0 60px rgba(0, 255, 170, 0.08);
                    filter: hue-rotate(-5deg);
                }
                75% {
                    box-shadow: 0 10px 35px rgba(5, 16, 16, 0.85), inset 0 0 50px rgba(128, 0, 128, 0.08);
                    filter: hue-rotate(5deg);
                }
            }
            
            @keyframes subtle-distort {
                0%, 100% { transform: rotate(0.5deg) skewX(0deg); }
                20% { transform: rotate(0.8deg) skewX(0.5deg); }
                40% { transform: rotate(0.2deg) skewX(-0.3deg); }
                60% { transform: rotate(0.7deg) skewX(0.4deg); }
                80% { transform: rotate(0.4deg) skewX(-0.2deg); }
            }
            
            @keyframes tentacle-writhe {
                0%, 100% {
                    transform: rotate(0deg) scale(1);
                    opacity: 0.6;
                }
                25% {
                    transform: rotate(5deg) scale(1.05);
                    opacity: 0.8;
                }
                50% {
                    transform: rotate(-3deg) scale(0.95);
                    opacity: 0.5;
                }
                75% {
                    transform: rotate(4deg) scale(1.02);
                    opacity: 0.7;
                }
            }
            
            @keyframes madness-flicker {
                0%, 95%, 100% { opacity: 1; filter: none; }
                96% { opacity: 0.8; filter: hue-rotate(30deg) saturate(1.5); }
                97% { opacity: 1; filter: none; }
                98% { opacity: 0.6; filter: hue-rotate(-20deg) brightness(1.2); }
                99% { opacity: 0.9; filter: hue-rotate(10deg); }
            }
            
            @keyframes sanity-drain {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            @keyframes void-gaze {
                0%, 100% {
                    box-shadow: 0 0 30px rgba(0, 255, 170, 0.2);
                    border-color: #306040;
                }
                50% {
                    box-shadow: 0 0 50px rgba(128, 0, 128, 0.4);
                    border-color: #800080;
                }
            }
            
            /* 卡片噪点纹理 */
            .dnd-char-card::before {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
                pointer-events: none;
                z-index: 1;
            }
            
            /* 卡片触手装饰 */
            .dnd-char-card::after {
                content: "𐌎";
                position: absolute;
                top: -15px;
                right: -15px;
                font-size: 40px;
                color: rgba(0, 255, 170, 0.3);
                text-shadow: 0 0 20px rgba(128, 0, 128, 0.5);
                animation: tentacle-writhe 6s ease-in-out infinite;
                z-index: 10;
            }
            
            /* 卡片头部符文 */
            .dnd-card-header::before {
                content: "⍟ ⎊ ⍟";
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: rgba(0, 255, 170, 0.4);
                font-size: 12px;
                letter-spacing: 5px;
                animation: madness-flicker 10s ease-in-out infinite;
            }
            
            .dnd-card-header::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, #00ffaa, #800080, #00ffaa, transparent);
            }
            
            /* 进度条 - 理智流失效果 */
            .dnd-bar-fill::before {
                content: "";
                position: absolute;
                top: 0; bottom: 0; left: 0; right: 0;
                background: linear-gradient(90deg,
                    transparent,
                    rgba(128, 0, 128, 0.3),
                    transparent,
                    rgba(0, 255, 170, 0.2),
                    transparent
                );
                background-size: 200% 100%;
                animation: sanity-drain 4s ease-in-out infinite;
            }
            
            .dnd-bar-fill::after {
                content: "";
                position: absolute;
                top: 0; bottom: 0;
                right: 0;
                width: 20px;
                background: linear-gradient(90deg, transparent, rgba(0, 255, 170, 0.8));
                filter: blur(3px);
            }
            
            /* 导航项触手装饰 */
            .dnd-nav-item::before {
                content: "⌬";
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: rgba(0, 255, 170, 0.5);
                font-size: 14px;
            }
            
            .dnd-nav-item::after {
                content: "";
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                width: 3px;
                background: linear-gradient(180deg, transparent, #800080, #00ffaa, #800080, transparent);
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .dnd-nav-item:hover::after,
            .dnd-nav-item.active::after {
                opacity: 1;
            }
            
            /* 分隔线 - 虚空裂缝 */
            .dnd-divider {
                height: 3px;
                background: linear-gradient(90deg,
                    transparent,
                    #306040,
                    #00ffaa,
                    #800080,
                    #00ffaa,
                    #306040,
                    transparent
                );
                position: relative;
                margin: 20px 0;
            }
            
            .dnd-divider::before {
                content: "◈";
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background: #051010;
                padding: 0 15px;
                color: #00ffaa;
                font-size: 16px;
                text-shadow: 0 0 10px rgba(128, 0, 128, 0.8);
            }
            
            /* 面板角落触手 */
            .dnd-panel::before,
            .dnd-dialog::before {
                content: "⎔";
                position: absolute;
                top: 10px;
                left: 10px;
                font-size: 24px;
                color: rgba(0, 255, 170, 0.4);
                animation: tentacle-writhe 8s ease-in-out infinite;
            }
            
            .dnd-panel::after,
            .dnd-dialog::after {
                content: "⎔";
                position: absolute;
                bottom: 10px;
                right: 10px;
                font-size: 24px;
                color: rgba(128, 0, 128, 0.4);
                transform: rotate(180deg);
                animation: tentacle-writhe 8s ease-in-out infinite reverse;
            }
            
            /* 滚动条 - 深渊通道 */
            .dnd-content-area::-webkit-scrollbar {
                width: 12px;
            }
            
            .dnd-content-area::-webkit-scrollbar-track {
                background: #051010;
                border-left: 1px solid #306040;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #306040, #204030, #306040);
                border: 1px solid #306040;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #00ffaa, #306040, #800080, #306040, #00ffaa);
            }
            
            /* 图标容器 - 邪眼 */
            .dnd-icon-circle {
                border-radius: 50%;
                border: 2px solid #306040;
                background: radial-gradient(circle at 30% 30%, #0a1a15, #051010);
                box-shadow: 0 0 20px rgba(0, 255, 170, 0.3), inset 0 0 15px rgba(128, 0, 128, 0.2);
                position: relative;
                animation: void-gaze 5s ease-in-out infinite;
            }
            
            .dnd-icon-circle::before {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40%;
                height: 40%;
                background: radial-gradient(circle, #00ffaa, transparent);
                border-radius: 50%;
                opacity: 0.6;
            }
            
            /* 头像框 - 深渊凝视 */
            .dnd-avatar {
                border-radius: 0;
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                border: 3px solid #306040;
                box-shadow: 0 0 30px rgba(0, 255, 170, 0.3), 0 0 60px rgba(128, 0, 128, 0.2);
                position: relative;
            }
            
            .dnd-avatar::before {
                content: "";
                position: absolute;
                inset: -5px;
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                background: linear-gradient(45deg, #00ffaa, transparent, #800080, transparent);
                z-index: -1;
                animation: void-gaze 4s ease-in-out infinite;
            }
            
            /* 悬停 - 疯狂侵蚀 */
            .dnd-char-card:hover {
                animation: eldritch-pulse 2s ease-in-out infinite, subtle-distort 4s ease-in-out infinite;
            }
            
            .dnd-char-card:hover::after {
                animation: tentacle-writhe 2s ease-in-out infinite;
                color: rgba(0, 255, 170, 0.6);
            }
            
            /* 工具提示 - 禁忌知识 */
            .dnd-tooltip {
                background: rgba(5, 16, 16, 0.98);
                border: 1px solid #306040;
                clip-path: polygon(0% 5%, 5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%);
                box-shadow: 0 0 30px rgba(0, 255, 170, 0.3), 0 0 50px rgba(128, 0, 128, 0.2);
            }
            
            .dnd-tooltip::before {
                content: "⍟";
                position: absolute;
                top: 5px;
                left: 10px;
                color: #00ffaa;
                font-size: 12px;
            }
            
            /* 随机扭曲效果 */
            .dnd-char-card:nth-child(3n)::after {
                content: "☠";
                color: rgba(128, 0, 128, 0.4);
            }
            
            .dnd-char-card:nth-child(3n+1)::after {
                content: "⛧";
                color: rgba(0, 255, 170, 0.4);
            }
            
            .dnd-char-card:nth-child(3n+2)::after {
                content: "⌘";
                color: rgba(208, 160, 208, 0.4);
            }
        `,
        background: {
            type: 'runes',
            colors: ['rgba(0, 255, 170, 0.25)', 'rgba(128, 0, 128, 0.2)', 'rgba(208, 160, 208, 0.15)'],
            count: 15,
            speed: 0.03,
            glow: true,
            animated: true
        }
};
