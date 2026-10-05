// features/dnd-theme/style-presets/cyber-neon.ts
// 风格包：cyber-neon（b11a · 自 BasedonST `src/config/StylePresets.js` 拆分移植）
export const cyberNeon = {
        meta: {
            id: 'cyber-neon',
            name: '赛博霓虹',
            icon: '🌃',
            description: '高对比度的未来科技风格，充满霓虹光影',
            author: 'System'
        },
        colors: {
            '--dnd-bg-main': '#050510',
            '--dnd-bg-panel-start': '#0a0a1a',
            '--dnd-bg-panel-end': '#050510',
            '--dnd-text-main': '#00f3ff',
            '--dnd-text-header': '#ff00ff',
            '--dnd-text-dim': '#007a80',
            '--dnd-text-highlight': '#ffff00',
            '--dnd-accent': '#ff00ff',
            '--dnd-accent-hover': '#ff66ff',
            '--dnd-border-gold': '#00f3ff',
            '--dnd-border-inner': '#ff00ff',
            '--dnd-bg-card-start': 'rgba(10, 10, 26, 0.95)',
            '--dnd-bg-card-end': 'rgba(5, 5, 16, 0.95)',
            '--dnd-btn-primary': 'rgba(255, 0, 255, 0.25)',
            '--dnd-btn-primary-hover': 'rgba(255, 0, 255, 0.45)',
            '--dnd-btn-text': '#00f3ff'
        },
        morphology: {
            border: { style: 'solid', width: '2px', outerStyle: 'none' },
            corners: { style: 'cut', clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' },
            card: { shape: 'sharp', decoration: 'tech' },
            effects: { texture: 'circuit', innerGlow: 'neon', borderGlow: 'neon', overlay: 'scanlines' },
            layout: { density: 'compact', cardMinWidth: '300px' },
            decorations: { corners: 'tech-bracket', dividers: 'glitch', headers: 'hologram' },
            buttons: { style: 'cyber', shape: 'cut' },
            progressBars: { style: 'neon', animated: true, glitch: true }
        },
        typography: {
            '--dnd-font-serif': '"Orbitron", "Roboto Mono", "Consolas", monospace',
            '--dnd-font-size-base': '0.9rem',
            '--dnd-font-size-header': '1.1rem',
            '--dnd-font-weight-header': '700',
            '--dnd-letter-spacing': '0.1em',
            '--dnd-text-transform': 'uppercase'
        },
        animations: {
            '--dnd-transition-fast': '0.1s cubic-bezier(0.4, 0, 0.2, 1)',
            '--dnd-transition-normal': '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '--dnd-animation-neon': 'neon-flicker 3s ease-in-out infinite',
            '--dnd-animation-glitch': 'cyber-glitch 0.3s ease-in-out',
            '--dnd-animation-scan': 'scanline 8s linear infinite'
        },
        interactiveStates: {
            hover: {
                brightness: 1.25,
                scale: 1.03,
                lift: '-5px',
                shadow: '0 12px 35px rgba(0, 243, 255, 0.35), 0 0 20px rgba(255, 0, 255, 0.2)',
                borderColor: '#00f3ff',
                glow: 'drop-shadow(0 0 12px #00f3ff) drop-shadow(0 0 25px rgba(255, 0, 255, 0.4))',
                transition: '0.15s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            cardHover: {
                transform: 'translateY(-8px) scale(1.02) perspective(1000px) rotateX(2deg)',
                shadow: '0 0 40px rgba(0, 243, 255, 0.5), 0 0 80px rgba(255, 0, 255, 0.25), inset 0 0 30px rgba(0, 243, 255, 0.08)',
                borderColor: '#ff00ff'
            },
            buttonHover: {
                brightness: 1.35,
                transform: 'translateY(-4px) scale(1.03)',
                shadow: '0 0 25px rgba(255, 0, 255, 0.6), inset 0 0 15px rgba(0, 243, 255, 0.35), 0 8px 20px rgba(0,0,0,0.4)'
            },
            active: {
                scale: 0.94,
                brightness: 0.85,
                transform: 'scale(0.94)',
                shadow: '0 0 15px rgba(0, 243, 255, 0.6), inset 0 0 10px rgba(255, 0, 255, 0.2)'
            },
            buttonActive: {
                transform: 'translateY(3px) scale(0.97)',
                shadow: '0 0 8px rgba(0, 243, 255, 0.4), inset 0 2px 8px rgba(0,0,0,0.4)'
            },
            selected: {
                background: 'linear-gradient(90deg, rgba(255, 0, 255, 0.35), rgba(0, 243, 255, 0.15), transparent)',
                borderColor: '#00f3ff',
                borderWidth: '2px',
                glow: '0 0 20px rgba(0, 243, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.2)',
                textColor: '#ffff00'
            },
            navActive: {
                background: 'linear-gradient(90deg, rgba(0, 243, 255, 0.25), rgba(255, 0, 255, 0.1), transparent)',
                border: '2px solid #ff00ff',
                indicator: '#00f3ff'
            },
            focus: {
                borderColor: '#ff00ff',
                shadow: '0 0 0 4px rgba(255, 0, 255, 0.35), 0 0 20px rgba(0, 243, 255, 0.3)',
                outline: 'none'
            },
            disabled: {
                opacity: 0.35,
                cursor: 'not-allowed',
                filter: 'grayscale(0.85) brightness(0.5)'
            },
            iconHover: {
                glow: 'drop-shadow(0 0 10px #00f3ff) drop-shadow(0 0 20px #ff00ff) drop-shadow(0 0 30px rgba(255, 255, 0, 0.3))',
                scale: 1.18
            },
            inputFocus: {
                border: '#00f3ff',
                shadow: '0 0 15px rgba(0, 243, 255, 0.5), inset 0 0 8px rgba(0, 243, 255, 0.15), 0 0 30px rgba(255, 0, 255, 0.15)'
            }
        },
        overrides: {
            /* ====== 卡片 - 六边形切角科技面板 ====== */
            '.dnd-char-card': {
                'box-shadow': '0 0 25px rgba(0, 243, 255, 0.3), inset 0 0 30px rgba(0, 243, 255, 0.1), 0 0 80px rgba(255, 0, 255, 0.15)',
                'border': '2px solid #00f3ff',
                'border-radius': '0',
                'clip-path': 'polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)',
                'background': 'linear-gradient(135deg, rgba(10, 10, 30, 0.95) 0%, rgba(5, 5, 20, 0.98) 100%)'
            },
            '.dnd-card-header': {
                'border-bottom': '2px solid #ff00ff',
                'background': 'linear-gradient(90deg, rgba(255, 0, 255, 0.2), rgba(0,0,0,0.5), rgba(0, 243, 255, 0.15))',
                'text-transform': 'uppercase',
                'letter-spacing': '0.2em',
                'padding': '14px 18px',
                'position': 'relative'
            },
            '.dnd-card-body': {
                'background': 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0, 243, 255, 0.02) 30px, rgba(0, 243, 255, 0.02) 31px)',
                'padding': '16px'
            },
            /* ====== 导航栏 - 霓虹数据终端 ====== */
            '.dnd-nav-sidebar': {
                'background': 'linear-gradient(180deg, rgba(10, 10, 26, 0.98), rgba(5, 5, 16, 1))',
                'border-right': '3px solid #ff00ff',
                'box-shadow': '5px 0 30px rgba(255, 0, 255, 0.2)'
            },
            '.dnd-nav-item': {
                'clip-path': 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)',
                'margin': '4px 0',
                'padding': '12px 20px',
                'border-left': '3px solid transparent',
                'background': 'rgba(0, 243, 255, 0.05)',
                'transition': 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            '.dnd-nav-item:hover': {
                'background': 'linear-gradient(90deg, rgba(0, 243, 255, 0.2), rgba(255, 0, 255, 0.1))',
                'border-left-color': '#00f3ff',
                'text-shadow': '0 0 10px #00f3ff'
            },
            '.dnd-nav-item.active': {
                'background': 'linear-gradient(90deg, rgba(255, 0, 255, 0.4), rgba(0, 243, 255, 0.15), transparent)',
                'box-shadow': 'inset 4px 0 0 #00f3ff, 0 0 25px rgba(0, 243, 255, 0.3), 0 0 40px rgba(255, 0, 255, 0.15)',
                'border-left-color': '#ffff00'
            },
            /* ====== 进度条 - 数据流光带 ====== */
            '.dnd-bar-container': {
                'background': 'rgba(0, 0, 0, 0.8)',
                'border': '1px solid rgba(0, 243, 255, 0.5)',
                'border-radius': '0',
                'height': '12px',
                'clip-path': 'polygon(5px 0, calc(100% - 5px) 0, 100% 50%, calc(100% - 5px) 100%, 5px 100%, 0 50%)',
                'box-shadow': 'inset 0 0 10px rgba(0, 0, 0, 0.8)'
            },
            '.dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #ff00ff, #00f3ff, #ffff00, #00f3ff, #ff00ff)',
                'background-size': '300% 100%',
                'box-shadow': '0 0 15px rgba(0, 243, 255, 0.7), 0 0 30px rgba(255, 0, 255, 0.4)',
                'border-radius': '0',
                'animation': 'neon-progress 3s linear infinite'
            },
            '.dnd-bar-hp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #ff0040, #ff00ff, #ff0080, #ff00ff, #ff0040)',
                'background-size': '300% 100%'
            },
            '.dnd-bar-exp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #8000ff, #00f3ff, #ff00ff, #00f3ff, #8000ff)',
                'background-size': '300% 100%'
            },
            /* ====== 按钮 - 全息触控按钮 ====== */
            '.dnd-btn, .dnd-action-btn': {
                'text-transform': 'uppercase',
                'letter-spacing': '3px',
                'clip-path': 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
                'border': '2px solid #ff00ff',
                'background': 'linear-gradient(135deg, rgba(255, 0, 255, 0.15), rgba(0, 243, 255, 0.08))',
                'box-shadow': '0 0 15px rgba(255, 0, 255, 0.3), inset 0 0 20px rgba(0, 243, 255, 0.1)',
                'font-family': '"Orbitron", monospace',
                'position': 'relative',
                'overflow': 'hidden'
            },
            '.dnd-btn:hover, .dnd-action-btn:hover': {
                'background': 'linear-gradient(135deg, rgba(0, 243, 255, 0.25), rgba(255, 0, 255, 0.15))',
                'border-color': '#00f3ff',
                'box-shadow': '0 0 30px rgba(0, 243, 255, 0.5), 0 0 60px rgba(255, 0, 255, 0.3), inset 0 0 25px rgba(0, 243, 255, 0.15)'
            },
            '.dnd-btn:active, .dnd-action-btn:active': {
                'background': 'linear-gradient(135deg, rgba(255, 255, 0, 0.2), rgba(255, 0, 255, 0.1))',
                'box-shadow': 'inset 0 0 30px rgba(0, 243, 255, 0.3)'
            },
            /* ====== 属性行 - 数据终端条目 ====== */
            '.dnd-stat-row': {
                'background': 'linear-gradient(90deg, rgba(0, 243, 255, 0.08), rgba(255, 0, 255, 0.05), transparent)',
                'border': '1px solid rgba(0, 243, 255, 0.2)',
                'border-left': '3px solid #ff00ff',
                'border-radius': '0',
                'clip-path': 'polygon(0 0, 100% 0, calc(100% - 5px) 100%, 0 100%)',
                'padding': '8px 12px',
                'margin': '4px 0'
            },
            '.dnd-stat-row:hover': {
                'background': 'linear-gradient(90deg, rgba(0, 243, 255, 0.15), rgba(255, 0, 255, 0.1), transparent)',
                'border-left-color': '#00f3ff'
            },
            /* ====== 标题样式 ====== */
            '.dnd-title, .dnd-char-name': {
                'text-shadow': '0 0 10px #00f3ff, 0 0 20px #ff00ff, 0 0 40px rgba(255, 255, 0, 0.6), 0 2px 0 #000',
                'text-transform': 'uppercase',
                'letter-spacing': '0.25em',
                'font-family': '"Orbitron", monospace'
            },
            /* ====== 面板 - 全息投影面板 ====== */
            '.dnd-panel': {
                'border': '2px solid #00f3ff',
                'border-radius': '0',
                'clip-path': 'polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
                'box-shadow': '0 0 40px rgba(0, 243, 255, 0.3), 0 0 80px rgba(255, 0, 255, 0.15), inset 0 0 50px rgba(0, 243, 255, 0.05)'
            },
            /* ====== 对话框 - 不使用 clip-path 裁切 ====== */
            '.dnd-dialog': {
                'border': '2px solid #00f3ff',
                'border-radius': '8px',
                'box-shadow': '0 0 40px rgba(0, 243, 255, 0.3), 0 0 80px rgba(255, 0, 255, 0.15), inset 0 0 50px rgba(0, 243, 255, 0.05)'
            },
            /* ====== 输入框 - 终端输入 ====== */
            '.dnd-input, .dnd-select, .dnd-textarea': {
                'background': 'rgba(0, 0, 0, 0.8)',
                'border': '1px solid #ff00ff',
                'border-radius': '0',
                'color': '#00f3ff',
                'font-family': '"Roboto Mono", monospace',
                'clip-path': 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
            },
            '.dnd-input:focus, .dnd-select:focus, .dnd-textarea:focus': {
                'border-color': '#00f3ff',
                'box-shadow': '0 0 20px rgba(0, 243, 255, 0.5), inset 0 0 10px rgba(0, 243, 255, 0.1)'
            },
            /* ====== 表格 - 数据矩阵 ====== */
            '.dnd-table': {
                'border': '1px solid rgba(0, 243, 255, 0.3)'
            },
            '.dnd-table th': {
                'background': 'linear-gradient(180deg, rgba(255, 0, 255, 0.2), rgba(0, 0, 0, 0.8))',
                'border-bottom': '2px solid #00f3ff',
                'color': '#ffff00',
                'text-transform': 'uppercase',
                'letter-spacing': '0.1em'
            },
            '.dnd-table td': {
                'border-bottom': '1px solid rgba(0, 243, 255, 0.2)',
                'border-right': '1px solid rgba(255, 0, 255, 0.1)'
            },
            '.dnd-table tr:hover td': {
                'background': 'rgba(0, 243, 255, 0.1)',
                'text-shadow': '0 0 5px #00f3ff'
            },
            /* ====== 徽章/标签 ====== */
            '.dnd-badge': {
                'background': 'linear-gradient(135deg, rgba(255, 0, 255, 0.3), rgba(0, 243, 255, 0.2))',
                'border': '1px solid #00f3ff',
                'border-radius': '0',
                'clip-path': 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
                'box-shadow': '0 0 10px rgba(0, 243, 255, 0.4)'
            },
            /* ====== 迷你HUD ====== */
            '#dnd-mini-hud': {
                'border': '2px solid #ff00ff',
                'border-radius': '0',
                'clip-path': 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)',
                'background': 'linear-gradient(180deg, rgba(10, 10, 26, 0.98), rgba(5, 5, 16, 1))',
                'box-shadow': '0 0 30px rgba(255, 0, 255, 0.3)'
            },
            /* ====== 图标 ====== */
            '.dnd-icon': {
                'filter': 'drop-shadow(0 0 5px #00f3ff)'
            }
        },
        customCSS: `
            /* ====== 赛博霓虹皮肤 - 全息科技动画与特效 ====== */
            
            /* 霓虹闪烁动画 */
            @keyframes neon-flicker {
                0%, 18%, 22%, 25%, 53%, 57%, 100% {
                    box-shadow: 0 0 25px rgba(0, 243, 255, 0.3), inset 0 0 30px rgba(0, 243, 255, 0.1), 0 0 80px rgba(255, 0, 255, 0.15);
                    filter: brightness(1);
                }
                20%, 24%, 55% {
                    box-shadow: 0 0 8px rgba(0, 243, 255, 0.15), inset 0 0 15px rgba(0, 243, 255, 0.05), 0 0 30px rgba(255, 0, 255, 0.08);
                    filter: brightness(0.9);
                }
            }
            
            /* 故障效果动画 */
            @keyframes cyber-glitch {
                0%, 100% { transform: translate(0) skewX(0); filter: hue-rotate(0deg); }
                10% { transform: translate(-3px, 2px) skewX(-2deg); filter: hue-rotate(90deg); }
                20% { transform: translate(3px, -2px) skewX(2deg); filter: hue-rotate(-90deg); }
                30% { transform: translate(-2px, -1px); filter: hue-rotate(180deg); }
                40% { transform: translate(2px, 1px); filter: hue-rotate(0deg); }
                50% { transform: translate(-1px, 2px) skewX(-1deg); }
                60% { transform: translate(1px, -2px) skewX(1deg); }
            }
            
            /* 扫描线动画 */
            @keyframes scanline-sweep {
                0% { top: -10%; }
                100% { top: 110%; }
            }
            
            /* 霓虹进度条动画 */
            @keyframes neon-progress {
                0% { background-position: 0% 50%; }
                100% { background-position: 300% 50%; }
            }
            
            /* 数据流动画 */
            @keyframes data-flow {
                0% { background-position: 0 0; }
                100% { background-position: 50px 50px; }
            }
            
            /* 全息闪烁 */
            @keyframes hologram-flicker {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.95; }
                52% { opacity: 0.85; }
                54% { opacity: 1; }
            }
            
            /* 边框流光 */
            @keyframes border-flow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            /* 卡片 - 赛博朋克科技面板 */
            .dnd-char-card {
                position: relative;
                animation: neon-flicker 4s ease-in-out infinite;
            }
            
            /* 扫描线叠加层 */
            .dnd-char-card::before {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background:
                    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 243, 255, 0.03) 2px, rgba(0, 243, 255, 0.03) 4px),
                    repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255, 0, 255, 0.02) 50px, rgba(255, 0, 255, 0.02) 51px);
                pointer-events: none;
                z-index: 2;
            }
            
            /* 外发光边框 */
            .dnd-char-card::after {
                content: "";
                position: absolute;
                top: -4px; left: -4px; right: -4px; bottom: -4px;
                background: linear-gradient(45deg, #00f3ff, #ff00ff, #ffff00, #00f3ff);
                background-size: 400% 400%;
                z-index: -1;
                opacity: 0.6;
                filter: blur(12px);
                animation: border-flow 5s ease infinite;
            }
            
            /* 动态扫描线 */
            .dnd-char-card > .dnd-card-body::after {
                content: "";
                position: absolute;
                left: 0; right: 0;
                height: 3px;
                background: linear-gradient(90deg, transparent, #00f3ff, transparent);
                opacity: 0.5;
                animation: scanline-sweep 3s linear infinite;
                pointer-events: none;
            }
            
            /* 卡片头部 - 全息标题栏 */
            .dnd-card-header::before {
                content: "◢";
                position: absolute;
                left: 8px; top: 50%;
                transform: translateY(-50%);
                color: #00f3ff;
                font-size: 12px;
                text-shadow: 0 0 10px #00f3ff;
                animation: hologram-flicker 2s infinite;
            }
            
            .dnd-card-header::after {
                content: "◣";
                position: absolute;
                right: 8px; top: 50%;
                transform: translateY(-50%);
                color: #ff00ff;
                font-size: 12px;
                text-shadow: 0 0 10px #ff00ff;
                animation: hologram-flicker 2s infinite 0.5s;
            }
            
            /* 导航项 - 霓虹指示灯效果 */
            .dnd-nav-item::before {
                content: "";
                position: absolute;
                left: 0; top: 50%;
                transform: translateY(-50%);
                width: 4px; height: 0;
                background: linear-gradient(to bottom, #00f3ff, #ff00ff);
                box-shadow: 0 0 10px #00f3ff;
                transition: height 0.2s ease-out;
            }
            
            .dnd-nav-item:hover::before {
                height: 80%;
            }
            
            .dnd-nav-item.active::before {
                height: 100%;
                box-shadow: 0 0 20px #00f3ff, 0 0 40px #ff00ff;
            }
            
            .dnd-nav-item.active::after {
                content: "▶";
                position: absolute;
                right: 12px;
                color: #ffff00;
                font-size: 10px;
                text-shadow: 0 0 10px #ffff00;
                animation: hologram-flicker 1.5s infinite;
            }
            
            /* 按钮 - 全息触控反馈 */
            .dnd-btn::before,
            .dnd-action-btn::before {
                content: "";
                position: absolute;
                top: 0; left: -100%;
                width: 100%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.4), transparent);
                transition: left 0.4s ease;
            }
            
            .dnd-btn:hover::before,
            .dnd-action-btn:hover::before {
                left: 100%;
            }
            
            .dnd-btn::after,
            .dnd-action-btn::after {
                content: "";
                position: absolute;
                bottom: 2px; left: 10%; right: 10%;
                height: 1px;
                background: linear-gradient(90deg, transparent, #00f3ff, transparent);
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .dnd-btn:hover::after,
            .dnd-action-btn:hover::after {
                opacity: 1;
            }
            
            /* 进度条 - 数据流动效果 */
            .dnd-bar-fill::before {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 5px,
                    rgba(255,255,255,0.1) 5px,
                    rgba(255,255,255,0.1) 10px
                );
                animation: data-flow 1s linear infinite;
            }
            
            /* 分隔线 - 霓虹线 */
            .dnd-divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, #ff00ff, #00f3ff, #ff00ff, transparent);
                box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
                position: relative;
            }
            
            .dnd-divider::before {
                content: "◇";
                position: absolute;
                left: 50%; top: 50%;
                transform: translate(-50%, -50%);
                background: #050510;
                padding: 0 10px;
                color: #00f3ff;
                font-size: 10px;
                text-shadow: 0 0 10px #00f3ff;
            }
            
            /* 面板角落装饰 */
            .dnd-panel::before,
            .dnd-dialog::before {
                content: "「";
                position: absolute;
                top: 5px; left: 8px;
                color: #00f3ff;
                font-size: 18px;
                text-shadow: 0 0 10px #00f3ff;
            }
            
            .dnd-panel::after,
            .dnd-dialog::after {
                content: "」";
                position: absolute;
                bottom: 5px; right: 8px;
                color: #ff00ff;
                font-size: 18px;
                text-shadow: 0 0 10px #ff00ff;
            }
            
            /* 滚动条 - 霓虹风格 */
            .dnd-content-area::-webkit-scrollbar {
                width: 8px;
            }
            
            .dnd-content-area::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.8);
                border-left: 1px solid #ff00ff;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #ff00ff, #00f3ff);
                box-shadow: 0 0 10px #00f3ff;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, #00f3ff, #ffff00);
                box-shadow: 0 0 15px #ffff00;
            }
            
            /* 图标容器 - 六边形 */
            .dnd-icon-circle {
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                border: none;
                background: linear-gradient(135deg, rgba(0, 243, 255, 0.2), rgba(255, 0, 255, 0.2));
                box-shadow: 0 0 15px rgba(0, 243, 255, 0.5);
            }
            
            /* 头像框 - 菱形 */
            .dnd-avatar {
                clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
                border: 2px solid #00f3ff;
                box-shadow: 0 0 20px rgba(0, 243, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3);
            }
            
            /* 故障效果触发 */
            .dnd-char-card:hover {
                animation: cyber-glitch 0.3s ease-in-out;
            }
            
            /* 工具提示 */
            .dnd-tooltip {
                background: rgba(5, 5, 16, 0.98);
                border: 1px solid #00f3ff;
                clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
                box-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
            }
        `,
        background: {
            type: 'radar',
            gridColor: 'rgba(0, 243, 255, 0.18)',
            sweepColor: 'rgba(0, 243, 255, 0.35)',
            accentColor: 'rgba(255, 0, 255, 0.2)',
            speed: 0.025,
            gridSize: 40,
            animated: true
        }
};
