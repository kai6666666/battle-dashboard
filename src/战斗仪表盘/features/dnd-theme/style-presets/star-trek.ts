// features/dnd-theme/style-presets/star-trek.ts
// 风格包：star-trek（b11a · 自 BasedonST `src/config/StylePresets.js` 拆分移植）
export const starTrek = {
        meta: {
            id: 'star-trek',
            name: '星际联邦',
            icon: '<i class="fa-solid fa-rocket"></i>',
            description: '极简干净的科幻风格，类似于LCARS界面',
            author: 'System'
        },
        colors: {
            '--dnd-bg-main': '#000000',
            '--dnd-bg-panel-start': '#000000',
            '--dnd-bg-panel-end': '#0a0a0a',
            '--dnd-text-main': '#ffcc00',
            '--dnd-text-header': '#ff9900',
            '--dnd-text-highlight': '#ffffff',
            '--dnd-text-dim': '#99ccff',
            '--dnd-accent': '#ff9900',
            '--dnd-accent-hover': '#ffbb33',
            '--dnd-border-gold': '#ff9900',
            '--dnd-border-inner': '#000000',
            '--dnd-bg-card-start': '#000000',
            '--dnd-bg-card-end': '#050505',
            '--dnd-btn-primary': '#cc0000',
            '--dnd-btn-primary-hover': '#ff3333',
            '--dnd-btn-text': '#000000'
        },
        morphology: {
            border: { style: 'none', width: '0', outerStyle: 'none' },
            corners: { style: 'rounded-large', clipPath: 'none' },
            card: { shape: 'pill', decoration: 'lcars' },
            effects: { texture: 'stars', innerGlow: 'none', borderGlow: 'none', overlay: 'none' },
            layout: { density: 'spacious', cardMinWidth: '320px' },
            decorations: { headers: 'bar', dividers: 'solid' },
            buttons: { style: 'lcars', shape: 'pill' },
            progressBars: { style: 'lcars', animated: true }
        },
        typography: {
            '--dnd-font-serif': '"Helvetica Neue", Arial, sans-serif',
            '--dnd-font-size-base': '0.95rem',
            '--dnd-font-weight-header': '600',
            '--dnd-letter-spacing': '0.05em',
            '--dnd-text-transform': 'uppercase'
        },
        animations: {
            '--dnd-transition-fast': '0.1s ease-out',
            '--dnd-transition-normal': '0.2s ease-out',
            '--dnd-animation-blink': 'lcars-blink 1.5s ease-in-out infinite'
        },
        interactiveStates: {
            hover: {
                brightness: 1.2,
                scale: 1.01,
                lift: '-2px',
                shadow: '0 4px 15px rgba(255, 153, 0, 0.3)',
                borderColor: '#ff9900',
                glow: 'drop-shadow(0 0 8px rgba(255, 153, 0, 0.5))',
                transition: '0.15s ease-out'
            },
            cardHover: {
                transform: 'translateY(-3px) scale(1.01)',
                shadow: '0 8px 25px rgba(0,0,0,0.5), 0 0 20px rgba(255, 153, 0, 0.2)',
                borderColor: '#ffcc00'
            },
            buttonHover: {
                brightness: 1.3,
                transform: 'translateY(-1px) scale(1.02)',
                shadow: '0 4px 12px rgba(204, 0, 0, 0.4), 0 0 10px rgba(255, 51, 51, 0.3)'
            },
            active: {
                scale: 0.98,
                brightness: 0.85,
                transform: 'translateY(1px) scale(0.98)',
                shadow: '0 1px 5px rgba(0,0,0,0.4)'
            },
            buttonActive: {
                transform: 'translateY(1px) scale(0.97)',
                shadow: '0 1px 3px rgba(0,0,0,0.4)'
            },
            selected: {
                background: '#ff9900',
                borderColor: '#ffcc00',
                borderWidth: '2px',
                glow: '0 0 10px rgba(255, 153, 0, 0.4)',
                textColor: '#000000'
            },
            navActive: {
                background: '#ff9900',
                border: 'none',
                indicator: '#ffcc00'
            },
            focus: {
                borderColor: '#ffcc00',
                shadow: '0 0 0 3px rgba(255, 204, 0, 0.3)',
                outline: 'none'
            },
            disabled: {
                opacity: 0.35,
                cursor: 'not-allowed',
                filter: 'grayscale(0.8) brightness(0.5)'
            },
            iconHover: {
                glow: 'drop-shadow(0 0 8px rgba(255, 204, 0, 0.8))',
                scale: 1.1
            },
            inputFocus: {
                border: '#ff9900',
                shadow: '0 0 10px rgba(255, 153, 0, 0.3)'
            }
        },
        overrides: {
            // 导航栏 - LCARS药丸形侧边栏
            '.dnd-nav-sidebar': {
                'border-right': 'none',
                'padding': '15px 0 15px 20px',
                'background': 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,10,20,0.9) 100%)',
                'position': 'relative'
            },
            '.dnd-nav-item': {
                'background': '#99ccff',
                'color': '#000',
                'margin-bottom': '6px',
                'border-radius': '25px 0 0 25px',
                'justify-content': 'flex-end',
                'padding': '12px 20px 12px 30px',
                'font-weight': '700',
                'text-transform': 'uppercase',
                'letter-spacing': '0.08em',
                'font-size': '0.85rem',
                'position': 'relative',
                'transition': 'all 0.15s ease-out',
                'clip-path': 'polygon(0% 0%, 100% 0%, 100% 100%, 15px 100%, 0% calc(100% - 15px))'
            },
            '.dnd-nav-item:hover': {
                'background': '#cc9933',
                'transform': 'translateX(5px)',
                'box-shadow': '0 0 15px rgba(255, 153, 0, 0.4)'
            },
            '.dnd-nav-item.active': {
                'background': '#ff9900',
                'color': '#000',
                'transform': 'translateX(10px)',
                'box-shadow': '0 0 20px rgba(255, 153, 0, 0.6), inset 0 0 10px rgba(255,255,255,0.2)',
                'z-index': '10'
            },

            // 卡片 - LCARS面板框架
            '.dnd-char-card': {
                'border': 'none',
                'border-radius': '30px',
                'background': '#000',
                'box-shadow': '0 0 30px rgba(153, 204, 255, 0.15)',
                'position': 'relative',
                'margin-left': '35px',
                'overflow': 'visible'
            },
            '.dnd-card-header': {
                'border-bottom': 'none',
                'background': 'linear-gradient(90deg, #ff9900 0%, #ff9900 calc(100% - 80px), transparent calc(100% - 80px))',
                'text-transform': 'uppercase',
                'letter-spacing': '0.12em',
                'color': '#000',
                'font-weight': '700',
                'padding': '12px 90px 12px 25px',
                'border-radius': '30px 30px 0 0',
                'position': 'relative',
                'clip-path': 'polygon(0 0, 100% 0, 100% 100%, 60px 100%, 0 calc(100% - 10px))'
            },
            '.dnd-card-body': {
                'padding': '20px 20px 20px 25px',
                'border-left': '25px solid #99ccff',
                'border-bottom': '15px solid #cc6699',
                'border-radius': '0 0 20px 0',
                'position': 'relative'
            },

            // 进度条 - LCARS条形
            '.dnd-bar-container': {
                'background': '#1a1a2e',
                'border-radius': '12px',
                'height': '22px',
                'border': 'none',
                'position': 'relative',
                'overflow': 'hidden'
            },
            '.dnd-bar-fill': {
                'border-radius': '12px',
                'transition': 'width 0.4s ease-out',
                'position': 'relative'
            },
            '.dnd-bar-hp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #cc0000 0%, #ff3333 50%, #ff6666 100%)'
            },
            '.dnd-bar-exp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #ff9900 0%, #ffcc00 50%, #ffee88 100%)'
            },

            // 按钮 - LCARS药丸按钮
            '.dnd-btn, .dnd-action-btn': {
                'border-radius': '20px',
                'text-transform': 'uppercase',
                'letter-spacing': '0.08em',
                'font-weight': '700',
                'padding': '10px 25px',
                'border': 'none',
                'position': 'relative',
                'overflow': 'hidden',
                'clip-path': 'polygon(15px 0, 100% 0, 100% 100%, 0 100%, 0 15px)'
            },
            '.dnd-btn:hover, .dnd-action-btn:hover': {
                'filter': 'brightness(1.3)',
                'box-shadow': '0 0 20px rgba(255, 153, 0, 0.5)'
            },
            '.dnd-btn:active, .dnd-action-btn:active': {
                'transform': 'scale(0.97)',
                'filter': 'brightness(0.9)'
            },

            // 属性行 - 扫描线样式
            '.dnd-stat-row': {
                'padding': '10px 15px',
                'margin': '4px 0',
                'background': 'linear-gradient(90deg, rgba(153, 204, 255, 0.1) 0%, transparent 100%)',
                'border-left': '4px solid #99ccff',
                'position': 'relative',
                'transition': 'all 0.2s ease'
            },
            '.dnd-stat-row:hover': {
                'background': 'linear-gradient(90deg, rgba(255, 153, 0, 0.15) 0%, transparent 100%)',
                'border-left-color': '#ff9900'
            },

            // 标题 - 星际风格
            '.dnd-title, .dnd-char-name': {
                'text-transform': 'uppercase',
                'letter-spacing': '0.2em',
                'font-weight': '300',
                'text-shadow': '0 0 10px rgba(255, 204, 0, 0.5)'
            },

            // 面板 - LCARS框架
            '.dnd-panel, .dnd-dialog': {
                'background': '#000',
                'border': 'none',
                'border-radius': '25px',
                'position': 'relative',
                'overflow': 'visible',
                'box-shadow': '0 0 30px rgba(153, 204, 255, 0.2)'
            },
            '#dnd-mini-hud': {
                'background': 'rgba(0, 0, 0, 0.95)',
                'border': '3px solid #99ccff',
                'border-radius': '20px',
                'box-shadow': '0 0 20px rgba(153, 204, 255, 0.3)'
            },

            // 输入框 - 极简科幻
            '.dnd-input, .dnd-select, .dnd-textarea': {
                'background': 'rgba(20, 20, 40, 0.9)',
                'border': '2px solid #336699',
                'border-radius': '10px',
                'color': '#99ccff',
                'font-family': '"Helvetica Neue", Arial, sans-serif'
            },
            '.dnd-input:focus, .dnd-select:focus, .dnd-textarea:focus': {
                'border-color': '#ff9900',
                'box-shadow': '0 0 15px rgba(255, 153, 0, 0.3)'
            },

            // 表格 - 数据显示
            '.dnd-table th': {
                'background': 'linear-gradient(90deg, #99ccff 0%, #6699cc 100%)',
                'color': '#000',
                'text-transform': 'uppercase',
                'letter-spacing': '0.1em',
                'font-weight': '700',
                'border-radius': '0'
            },
            '.dnd-table td': {
                'border-bottom': '1px solid rgba(153, 204, 255, 0.2)',
                'padding': '12px'
            },
            '.dnd-table tr:hover td': {
                'background': 'rgba(255, 153, 0, 0.1)'
            },

            // 徽章
            '.dnd-badge': {
                'background': 'linear-gradient(135deg, #cc0000, #ff3333)',
                'border-radius': '15px',
                'text-transform': 'uppercase',
                'font-weight': '700',
                'letter-spacing': '0.05em'
            }
        },
        customCSS: `
            /* LCARS动画 */
            @keyframes lcars-blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }
            
            @keyframes lcars-scan {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
            }
            
            @keyframes lcars-pulse {
                0%, 100% { box-shadow: 0 0 10px rgba(255, 153, 0, 0.3); }
                50% { box-shadow: 0 0 25px rgba(255, 153, 0, 0.6); }
            }
            
            @keyframes warp-stars {
                0% { transform: translateZ(0) scale(1); opacity: 1; }
                100% { transform: translateZ(200px) scale(0); opacity: 0; }
            }
            
            /* 卡片左侧LCARS条带 */
            .dnd-char-card::before {
                content: "";
                position: absolute;
                top: 0;
                left: -35px;
                width: 30px;
                height: 100%;
                background: linear-gradient(
                    to bottom,
                    #99ccff 0%,
                    #99ccff 25%,
                    #ff9900 25%,
                    #ff9900 50%,
                    #cc6699 50%,
                    #cc6699 75%,
                    #9966cc 75%,
                    #9966cc 100%
                );
                border-radius: 15px 0 0 15px;
            }
            
            /* 卡片头部装饰块 */
            .dnd-card-header::before {
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                width: 70px;
                height: 100%;
                background: linear-gradient(to bottom, #cc6699 0%, #cc6699 50%, #9966cc 50%, #9966cc 100%);
                border-radius: 0 30px 0 0;
            }
            
            .dnd-card-header::after {
                content: "●●●";
                position: absolute;
                top: 50%;
                right: 80px;
                transform: translateY(-50%);
                color: #99ccff;
                font-size: 10px;
                letter-spacing: 3px;
                animation: lcars-blink 2s ease-in-out infinite;
            }
            
            /* 进度条扫描效果 */
            .dnd-bar-fill::after {
                content: "";
                position: absolute;
                top: 0; bottom: 0;
                left: 0;
                width: 50%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                animation: lcars-scan 2s ease-in-out infinite;
            }
            
            /* 导航项装饰 */
            .dnd-nav-item::before {
                content: "";
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 12px;
                height: 12px;
                background: #000;
                border-radius: 50%;
            }
            
            .dnd-nav-item::after {
                content: "";
                position: absolute;
                right: -5px;
                top: 0;
                height: 100%;
                width: 5px;
                background: inherit;
            }
            
            /* LCARS分隔线 */
            .dnd-divider {
                height: 3px;
                background: linear-gradient(90deg, #99ccff 0%, #99ccff 20%, transparent 20%, transparent 80%, #ff9900 80%, #ff9900 100%);
                position: relative;
                margin: 15px 0;
            }
            
            .dnd-divider::before {
                content: "";
                position: absolute;
                left: 20%;
                top: -5px;
                width: 60%;
                height: 13px;
                background: linear-gradient(90deg, #1a1a2e, #0a0a1e, #1a1a2e);
                border: 1px solid #336699;
                border-radius: 6px;
            }
            
            /* 面板角落装饰 */
            .dnd-panel::before,
            .dnd-dialog::before {
                content: "";
                position: absolute;
                top: 0; left: 0;
                width: 80px;
                height: 25px;
                background: #99ccff;
                border-radius: 25px 0 15px 0;
                z-index: 1;
            }
            
            .dnd-panel::after,
            .dnd-dialog::after {
                content: "";
                position: absolute;
                bottom: 0; right: 0;
                width: 60px;
                height: 20px;
                background: #cc6699;
                border-radius: 15px 0 25px 0;
            }
            
            /* 滚动条 - LCARS风格 */
            .dnd-content-area::-webkit-scrollbar {
                width: 15px;
            }
            
            .dnd-content-area::-webkit-scrollbar-track {
                background: #0a0a1e;
                border-left: 2px solid #336699;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #99ccff, #6699cc);
                border-radius: 10px;
                border: 2px solid #0a0a1e;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, #ff9900, #cc7700);
            }
            
            /* 图标容器 - 圆形徽章 */
            .dnd-icon-circle {
                border-radius: 50%;
                border: 3px solid #99ccff;
                background: linear-gradient(135deg, #1a1a3e, #0a0a2e);
                box-shadow: 0 0 15px rgba(153, 204, 255, 0.4);
                position: relative;
            }
            
            .dnd-icon-circle::after {
                content: "";
                position: absolute;
                inset: 3px;
                border: 1px solid rgba(153, 204, 255, 0.3);
                border-radius: 50%;
            }
            
            /* 头像框 - 星际联邦徽章 */
            .dnd-avatar {
                border-radius: 50%;
                border: 4px solid #ff9900;
                box-shadow:
                    0 0 0 3px #000,
                    0 0 0 6px #99ccff,
                    0 0 20px rgba(255, 153, 0, 0.5);
                position: relative;
            }
            
            .dnd-avatar::before {
                content: "";
                position: absolute;
                inset: -15px;
                border: 2px solid rgba(153, 204, 255, 0.3);
                border-radius: 50%;
                animation: lcars-pulse 3s ease-in-out infinite;
            }
            
            /* 状态指示灯 */
            .dnd-status-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                animation: lcars-blink 1.5s ease-in-out infinite;
            }
            
            .dnd-status-indicator.active {
                background: #00ff00;
                box-shadow: 0 0 10px #00ff00;
            }
            
            .dnd-status-indicator.warning {
                background: #ff9900;
                box-shadow: 0 0 10px #ff9900;
            }
            
            .dnd-status-indicator.danger {
                background: #cc0000;
                box-shadow: 0 0 10px #cc0000;
            }
            
            /* 工具提示 */
            .dnd-tooltip {
                background: rgba(10, 10, 30, 0.95);
                border: 2px solid #99ccff;
                border-radius: 15px;
                box-shadow: 0 0 20px rgba(153, 204, 255, 0.3);
                padding: 10px 20px;
            }
            
            .dnd-tooltip::before {
                content: "";
                position: absolute;
                top: 0; left: 0;
                width: 40px;
                height: 8px;
                background: #ff9900;
                border-radius: 15px 0 8px 0;
            }
            
            /* 数据标签 */
            .dnd-stat-label {
                color: #99ccff;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                font-size: 0.8em;
            }
            
            .dnd-stat-value {
                color: #ffcc00;
                font-weight: 700;
                text-shadow: 0 0 5px rgba(255, 204, 0, 0.5);
            }
            
            /* 卡片悬停效果 */
            .dnd-char-card:hover {
                box-shadow: 0 0 40px rgba(255, 153, 0, 0.3);
            }
            
            .dnd-char-card:hover::before {
                filter: brightness(1.2);
            }
        `,
        background: {
            type: 'starfield',
            colors: ['rgba(255, 255, 255, 0.9)', 'rgba(153, 204, 255, 0.8)', 'rgba(255, 204, 0, 0.7)'],
            density: 150,
            speed: 0.02,
            twinkle: true
        }
};
