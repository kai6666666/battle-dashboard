// features/dnd-theme/style-presets/steampunk.ts
// 风格包：steampunk（b11a · 自 BasedonST `src/config/StylePresets.js` 拆分移植）
export const steampunk = {
        meta: {
            id: 'steampunk',
            name: '蒸汽纪元',
            icon: '<i class="fa-solid fa-cog"></i>',
            description: '维多利亚时代的机械美学，黄铜与皮革的交响',
            author: 'System'
        },
        colors: {
            '--dnd-bg-main': '#2b2015',
            '--dnd-bg-panel-start': '#3e3020',
            '--dnd-bg-panel-end': '#2b2015',
            '--dnd-text-main': '#e6d0a0',
            '--dnd-text-header': '#ffddaa',
            '--dnd-text-highlight': '#ffffaa',
            '--dnd-text-dim': '#a69070',
            '--dnd-accent': '#cd7f32',
            '--dnd-accent-hover': '#daa060',
            '--dnd-border-gold': '#b8860b',
            '--dnd-border-inner': '#8b4513',
            '--dnd-bg-card-start': '#3a2a1a',
            '--dnd-bg-card-end': '#2a1f15',
            '--dnd-btn-primary': '#8b4513',
            '--dnd-btn-primary-hover': '#a0522d',
            '--dnd-btn-text': '#e6d0a0'
        },
        morphology: {
            border: { style: 'ridge', width: '3px', outerStyle: 'dashed' },
            corners: { style: 'ornate', clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)' },
            card: { shape: 'panel', decoration: 'gears' },
            effects: { texture: 'fabric', innerGlow: 'gold', borderGlow: 'none', overlay: 'vignette' },
            layout: { density: 'normal' },
            decorations: { corners: 'gears', dividers: 'pipes', headers: 'banner' },
            buttons: { style: 'brass', shape: 'rounded' },
            progressBars: { style: 'gauge', animated: true }
        },
        typography: {
            '--dnd-font-serif': '"Georgia", "Times New Roman", serif',
            '--dnd-font-size-header': '1.15rem',
            '--dnd-font-weight-header': '600',
            '--dnd-letter-spacing': '0.04em'
        },
        animations: {
            '--dnd-transition-fast': '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '--dnd-transition-normal': '0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            '--dnd-animation-gear': 'gear-rotate 10s linear infinite'
        },
        interactiveStates: {
            hover: {
                brightness: 1.12,
                scale: 1.02,
                lift: '-4px',
                shadow: '0 10px 30px rgba(139, 69, 19, 0.4), 0 0 15px rgba(184, 134, 11, 0.3)',
                borderColor: '#b8860b',
                glow: 'drop-shadow(0 0 6px rgba(205, 127, 50, 0.5))',
                transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            cardHover: {
                transform: 'translateY(-6px) scale(1.015)',
                shadow: '0 18px 45px rgba(43, 32, 21, 0.6), 0 0 25px rgba(184, 134, 11, 0.25), inset 0 0 20px rgba(205, 127, 50, 0.08)',
                borderColor: '#cd7f32'
            },
            buttonHover: {
                brightness: 1.2,
                transform: 'translateY(-2px) scale(1.03)',
                shadow: '0 6px 18px rgba(139, 69, 19, 0.5), 0 0 10px rgba(184, 134, 11, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
            },
            active: {
                scale: 0.97,
                brightness: 0.9,
                transform: 'translateY(2px) scale(0.97)',
                shadow: 'inset 0 3px 8px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)'
            },
            buttonActive: {
                transform: 'translateY(2px) scale(0.97)',
                shadow: 'inset 0 3px 10px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.2)'
            },
            selected: {
                background: 'linear-gradient(90deg, rgba(184, 134, 11, 0.3), rgba(139, 69, 19, 0.2), transparent)',
                borderColor: '#ffddaa',
                borderWidth: '3px',
                glow: '0 0 15px rgba(184, 134, 11, 0.4)',
                textColor: '#ffffaa'
            },
            navActive: {
                background: 'linear-gradient(90deg, rgba(184, 134, 11, 0.35), rgba(139, 69, 19, 0.2), transparent)',
                border: '3px solid #b8860b',
                indicator: '#cd7f32'
            },
            focus: {
                borderColor: '#cd7f32',
                shadow: '0 0 0 3px rgba(205, 127, 50, 0.3)',
                outline: 'none'
            },
            disabled: {
                opacity: 0.4,
                cursor: 'not-allowed',
                filter: 'grayscale(0.5) sepia(0.3) brightness(0.7)'
            },
            iconHover: {
                glow: 'drop-shadow(0 0 8px rgba(184, 134, 11, 0.8)) drop-shadow(0 0 15px rgba(205, 127, 50, 0.5))',
                scale: 1.15
            },
            inputFocus: {
                border: '#b8860b',
                shadow: '0 0 12px rgba(184, 134, 11, 0.4), inset 0 1px 3px rgba(0,0,0,0.2)'
            }
        },
        overrides: {
            // 导航栏 - 铜管工艺
            '.dnd-nav-sidebar': {
                'background': 'linear-gradient(180deg, #3e3020 0%, #2b2015 100%)',
                'border-right': '4px solid #8b4513',
                'position': 'relative',
                'box-shadow': 'inset -5px 0 15px rgba(0,0,0,0.3)'
            },
            '.dnd-nav-item': {
                'background': 'linear-gradient(90deg, #4a3a2a, #3a2a1a)',
                'border': '2px solid #8b4513',
                'border-radius': '8px 0 0 8px',
                'margin': '8px 0 8px 10px',
                'padding': '12px 15px',
                'position': 'relative',
                'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.1), 2px 2px 5px rgba(0,0,0,0.3)'
            },
            '.dnd-nav-item:hover': {
                'background': 'linear-gradient(90deg, #5a4a3a, #4a3a2a)',
                'border-color': '#b8860b',
                'transform': 'translateX(5px)',
                'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.2), 3px 3px 10px rgba(0,0,0,0.4), 0 0 15px rgba(184, 134, 11, 0.2)'
            },
            '.dnd-nav-item.active': {
                'background': 'linear-gradient(90deg, rgba(184, 134, 11, 0.4), rgba(139, 69, 19, 0.3))',
                'box-shadow': 'inset 0 0 20px rgba(184, 134, 11, 0.2), 0 0 20px rgba(205, 127, 50, 0.3)',
                'border-color': '#cd7f32',
                'transform': 'translateX(8px)'
            },

            // 卡片 - 皮革边框机械面板
            '.dnd-char-card': {
                'box-shadow': '0 0 0 4px #3e3020, 0 0 0 7px #b8860b, 0 0 0 9px #5c3a1a, 0 12px 35px rgba(43, 32, 21, 0.6)',
                'border': '3px solid #8b4513',
                'border-radius': '12px',
                'background': 'linear-gradient(135deg, #3a2a1a 0%, #2f2318 50%, #2a1f15 100%)',
                'position': 'relative',
                'overflow': 'visible'
            },
            '.dnd-card-header': {
                'border-bottom': '4px double #b8860b',
                'background': 'linear-gradient(90deg, rgba(184, 134, 11, 0.2), rgba(139, 69, 19, 0.15), rgba(184, 134, 11, 0.2))',
                'padding': '15px 20px',
                'position': 'relative',
                'border-radius': '9px 9px 0 0'
            },
            '.dnd-card-body': {
                'padding': '20px',
                'background': 'linear-gradient(180deg, rgba(58, 42, 26, 0.5) 0%, rgba(42, 31, 21, 0.8) 100%)',
                'position': 'relative'
            },

            // 进度条 - 压力表仪表盘
            '.dnd-bar-container': {
                'background': 'linear-gradient(180deg, #1a1510, #2a2015, #1a1510)',
                'border': '3px solid #8b4513',
                'border-radius': '10px',
                'height': '24px',
                'position': 'relative',
                'box-shadow': 'inset 0 2px 5px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1)'
            },
            '.dnd-bar-fill': {
                'border-radius': '7px',
                'position': 'relative',
                'overflow': 'hidden'
            },
            '.dnd-bar-hp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #8b4513, #cd7f32, #daa060, #cd7f32, #8b4513)'
            },
            '.dnd-bar-exp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #5c3a1a, #b8860b, #ffddaa, #b8860b, #5c3a1a)'
            },

            // 按钮 - 黄铜铆钉
            '.dnd-btn, .dnd-action-btn': {
                'border': '3px solid #8b4513',
                'border-radius': '8px',
                'background': 'linear-gradient(180deg, #5a4a3a 0%, #4a3a2a 50%, #3a2a1a 100%)',
                'box-shadow': 'inset 0 2px 0 rgba(255,255,255,0.15), inset 0 -2px 5px rgba(0,0,0,0.3), 0 3px 8px rgba(0,0,0,0.4)',
                'position': 'relative',
                'text-shadow': '0 1px 2px rgba(0,0,0,0.5)'
            },
            '.dnd-btn:hover, .dnd-action-btn:hover': {
                'background': 'linear-gradient(180deg, #6a5a4a 0%, #5a4a3a 50%, #4a3a2a 100%)',
                'border-color': '#b8860b',
                'box-shadow': 'inset 0 2px 0 rgba(255,255,255,0.2), 0 5px 15px rgba(184, 134, 11, 0.3), 0 0 20px rgba(205, 127, 50, 0.2)'
            },
            '.dnd-btn:active, .dnd-action-btn:active': {
                'background': 'linear-gradient(180deg, #3a2a1a 0%, #4a3a2a 50%, #5a4a3a 100%)',
                'box-shadow': 'inset 0 3px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)'
            },

            // 属性行 - 刻度读数
            '.dnd-stat-row': {
                'padding': '10px 15px',
                'margin': '4px 0',
                'background': 'linear-gradient(90deg, rgba(139, 69, 19, 0.1), transparent)',
                'border-left': '4px solid #8b4513',
                'position': 'relative',
                'transition': 'all 0.25s ease'
            },
            '.dnd-stat-row:hover': {
                'background': 'linear-gradient(90deg, rgba(184, 134, 11, 0.15), rgba(139, 69, 19, 0.1), transparent)',
                'border-left-color': '#cd7f32',
                'padding-left': '20px'
            },

            // 标题 - 维多利亚雕刻字
            '.dnd-title, .dnd-char-name': {
                'text-shadow': '0 2px 4px rgba(0,0,0,0.5), 0 0 15px rgba(184, 134, 11, 0.4)',
                'letter-spacing': '0.08em',
                'font-weight': '600'
            },

            // 面板 - 黄铜框架
            '.dnd-panel, .dnd-dialog': {
                'background': 'linear-gradient(135deg, #3e3020, #2b2015)',
                'border': '4px solid #8b4513',
                'border-radius': '15px',
                'box-shadow': '0 0 0 2px #5c3a1a, 0 0 0 5px #b8860b, 0 10px 40px rgba(43, 32, 21, 0.7)',
                'position': 'relative'
            },
            '#dnd-mini-hud': {
                'background': 'linear-gradient(135deg, #3a2a1a, #2a1f15)',
                'border': '3px solid #b8860b',
                'border-radius': '12px',
                'box-shadow': '0 0 20px rgba(184, 134, 11, 0.3), inset 0 0 30px rgba(0,0,0,0.3)'
            },

            // 输入框 - 铜边皮革
            '.dnd-input, .dnd-select, .dnd-textarea': {
                'background': 'linear-gradient(180deg, #2a2015, #3a2a1a)',
                'border': '2px solid #8b4513',
                'border-radius': '6px',
                'color': '#e6d0a0',
                'box-shadow': 'inset 0 2px 5px rgba(0,0,0,0.3)'
            },
            '.dnd-input:focus, .dnd-select:focus, .dnd-textarea:focus': {
                'border-color': '#cd7f32',
                'box-shadow': 'inset 0 2px 5px rgba(0,0,0,0.3), 0 0 15px rgba(184, 134, 11, 0.3)'
            },

            // 表格 - 工程图纸
            '.dnd-table th': {
                'background': 'linear-gradient(180deg, #5a4a3a, #4a3a2a)',
                'color': '#ffddaa',
                'border-bottom': '3px solid #b8860b',
                'text-transform': 'uppercase',
                'letter-spacing': '0.08em',
                'font-weight': '600'
            },
            '.dnd-table td': {
                'border-bottom': '1px solid rgba(139, 69, 19, 0.3)',
                'padding': '12px'
            },
            '.dnd-table tr:hover td': {
                'background': 'rgba(184, 134, 11, 0.1)'
            },

            // 徽章 - 铜牌
            '.dnd-badge': {
                'background': 'linear-gradient(135deg, #cd7f32, #b8860b, #8b4513)',
                'border': '2px solid #5c3a1a',
                'border-radius': '5px',
                'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 5px rgba(0,0,0,0.3)',
                'color': '#2b2015',
                'font-weight': '700'
            }
        },
        customCSS: `
            /* 蒸汽朋克动画 */
            @keyframes gear-rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes gear-rotate-reverse {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
            }
            
            @keyframes steam-release {
                0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
                20% { opacity: 0.8; }
                100% { opacity: 0; transform: translateY(-30px) scale(1.5); }
            }
            
            @keyframes pressure-pulse {
                0%, 100% { box-shadow: inset 0 0 10px rgba(205, 127, 50, 0.3); }
                50% { box-shadow: inset 0 0 20px rgba(255, 200, 100, 0.5); }
            }
            
            @keyframes piston-move {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(3px); }
            }
            
            @keyframes dial-flicker {
                0%, 90%, 100% { opacity: 1; }
                92%, 98% { opacity: 0.7; }
            }
            
            /* 卡片齿轮装饰 - 右上角大齿轮 */
            .dnd-char-card::before {
                content: "⚙";
                position: absolute;
                top: -15px;
                right: -15px;
                font-size: 45px;
                color: #b8860b;
                text-shadow:
                    2px 2px 0 #5c3a1a,
                    -1px -1px 0 #cd7f32,
                    0 0 10px rgba(184, 134, 11, 0.5);
                animation: gear-rotate 12s linear infinite;
                z-index: 10;
            }
            
            /* 卡片齿轮装饰 - 左下角小齿轮 */
            .dnd-char-card::after {
                content: "⚙";
                position: absolute;
                bottom: -10px;
                left: -10px;
                font-size: 30px;
                color: #8b4513;
                text-shadow:
                    1px 1px 0 #5c3a1a,
                    0 0 8px rgba(139, 69, 19, 0.5);
                animation: gear-rotate-reverse 8s linear infinite;
                z-index: 10;
            }
            
            /* 卡片头部铆钉装饰 */
            .dnd-card-header::before {
                content: "● ● ●";
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #cd7f32;
                font-size: 8px;
                letter-spacing: 8px;
                text-shadow:
                    0 1px 0 #5c3a1a,
                    0 -1px 0 rgba(255,255,255,0.3);
            }
            
            .dnd-card-header::after {
                content: "● ● ●";
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #cd7f32;
                font-size: 8px;
                letter-spacing: 8px;
                text-shadow:
                    0 1px 0 #5c3a1a,
                    0 -1px 0 rgba(255,255,255,0.3);
            }
            
            /* 进度条 - 压力表效果 */
            .dnd-bar-fill::before {
                content: "";
                position: absolute;
                top: 0; bottom: 0; left: 0; right: 0;
                background: repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 8px,
                    rgba(0,0,0,0.2) 8px,
                    rgba(0,0,0,0.2) 10px
                );
            }
            
            .dnd-bar-fill::after {
                content: "";
                position: absolute;
                top: 2px;
                left: 0;
                right: 0;
                height: 40%;
                background: linear-gradient(180deg, rgba(255,255,255,0.3), transparent);
                border-radius: 5px 5px 0 0;
            }
            
            /* 进度条容器压力表刻度 */
            .dnd-bar-container::before {
                content: "";
                position: absolute;
                top: -8px;
                left: 10%;
                width: 80%;
                height: 5px;
                background: repeating-linear-gradient(
                    90deg,
                    #8b4513,
                    #8b4513 2px,
                    transparent 2px,
                    transparent 10px
                );
            }
            
            .dnd-bar-container::after {
                content: "PSI";
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 8px;
                color: #b8860b;
                font-weight: 700;
                letter-spacing: 1px;
            }
            
            /* 导航项齿轮图标 */
            .dnd-nav-item::before {
                content: "⚙";
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: #8b4513;
                font-size: 14px;
                transition: transform 0.5s ease;
            }
            
            .dnd-nav-item:hover::before,
            .dnd-nav-item.active::before {
                animation: gear-rotate 2s linear infinite;
                color: #cd7f32;
            }
            
            .dnd-nav-item::after {
                content: "";
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%);
                width: 8px;
                height: 8px;
                background: radial-gradient(circle, #cd7f32, #8b4513);
                border-radius: 50%;
                border: 2px solid #5c3a1a;
                box-shadow: inset 0 -1px 2px rgba(0,0,0,0.5);
            }
            
            /* 分隔线 - 铜管 */
            .dnd-divider {
                height: 8px;
                background: linear-gradient(180deg,
                    #5c3a1a 0%,
                    #cd7f32 20%,
                    #ffddaa 50%,
                    #cd7f32 80%,
                    #5c3a1a 100%
                );
                border-radius: 4px;
                position: relative;
                margin: 20px 0;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3);
            }
            
            .dnd-divider::before {
                content: "";
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 16px;
                height: 16px;
                background: radial-gradient(circle at 30% 30%, #cd7f32, #8b4513);
                border-radius: 50%;
                border: 2px solid #5c3a1a;
                box-shadow: inset 0 -2px 4px rgba(0,0,0,0.4);
            }
            
            .dnd-divider::after {
                content: "";
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 16px;
                height: 16px;
                background: radial-gradient(circle at 30% 30%, #cd7f32, #8b4513);
                border-radius: 50%;
                border: 2px solid #5c3a1a;
                box-shadow: inset 0 -2px 4px rgba(0,0,0,0.4);
            }
            
            /* 面板角落齿轮装饰 */
            .dnd-panel::before,
            .dnd-dialog::before {
                content: "⚙";
                position: absolute;
                top: 10px;
                left: 10px;
                font-size: 24px;
                color: #b8860b;
                text-shadow: 1px 1px 0 #5c3a1a;
                animation: gear-rotate 15s linear infinite;
            }
            
            .dnd-panel::after,
            .dnd-dialog::after {
                content: "⚙";
                position: absolute;
                bottom: 10px;
                right: 10px;
                font-size: 20px;
                color: #8b4513;
                text-shadow: 1px 1px 0 #5c3a1a;
                animation: gear-rotate-reverse 10s linear infinite;
            }
            
            /* 滚动条 - 铜管轨道 */
            .dnd-content-area::-webkit-scrollbar {
                width: 14px;
            }
            
            .dnd-content-area::-webkit-scrollbar-track {
                background: linear-gradient(90deg, #2a2015, #3a2a1a, #2a2015);
                border: 2px solid #5c3a1a;
                border-radius: 7px;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #cd7f32, #b8860b, #8b4513, #b8860b, #cd7f32);
                border-radius: 7px;
                border: 2px solid #5c3a1a;
                box-shadow: inset 0 0 5px rgba(255,255,255,0.2);
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #daa060, #cd7f32, #b8860b, #cd7f32, #daa060);
            }
            
            /* 图标容器 - 圆形压力表 */
            .dnd-icon-circle {
                border-radius: 50%;
                border: 4px solid #8b4513;
                background: radial-gradient(circle at 30% 30%, #4a3a2a, #2a1f15);
                box-shadow:
                    0 0 0 2px #b8860b,
                    0 0 15px rgba(184, 134, 11, 0.4),
                    inset 0 0 20px rgba(0,0,0,0.5);
                position: relative;
            }
            
            .dnd-icon-circle::before {
                content: "";
                position: absolute;
                inset: 3px;
                border: 1px solid rgba(184, 134, 11, 0.3);
                border-radius: 50%;
            }
            
            .dnd-icon-circle::after {
                content: "";
                position: absolute;
                top: 5px;
                left: 20%;
                width: 60%;
                height: 30%;
                background: linear-gradient(180deg, rgba(255,255,255,0.2), transparent);
                border-radius: 50%;
            }
            
            /* 头像框 - 八角铜框 */
            .dnd-avatar {
                clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
                border: 4px solid #b8860b;
                box-shadow:
                    0 0 0 3px #5c3a1a,
                    0 0 20px rgba(184, 134, 11, 0.4);
                position: relative;
            }
            
            .dnd-avatar::before {
                content: "";
                position: absolute;
                inset: -8px;
                clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
                background: linear-gradient(135deg, #cd7f32, #8b4513, #b8860b);
                z-index: -1;
            }
            
            /* 卡片悬停蒸汽效果 */
            .dnd-char-card:hover {
                box-shadow:
                    0 0 0 4px #3e3020,
                    0 0 0 7px #cd7f32,
                    0 0 0 9px #5c3a1a,
                    0 15px 45px rgba(43, 32, 21, 0.7),
                    0 0 30px rgba(184, 134, 11, 0.3);
            }
            
            .dnd-char-card:hover::before {
                animation: gear-rotate 4s linear infinite;
                text-shadow:
                    2px 2px 0 #5c3a1a,
                    -1px -1px 0 #cd7f32,
                    0 0 20px rgba(255, 200, 100, 0.8);
            }
            
            /* 工具提示 - 铜牌 */
            .dnd-tooltip {
                background: linear-gradient(135deg, #3e3020, #2b2015);
                border: 3px solid #8b4513;
                border-radius: 8px;
                box-shadow:
                    0 0 0 1px #b8860b,
                    0 5px 20px rgba(0,0,0,0.5);
            }
            
            .dnd-tooltip::before {
                content: "⚙";
                position: absolute;
                top: 5px;
                left: 8px;
                color: #cd7f32;
                font-size: 12px;
            }
            
            /* 皮革纹理叠加 */
            .dnd-char-card > .dnd-card-body::before {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
                pointer-events: none;
            }
            
            /* 不同位置卡片的齿轮变化 */
            .dnd-char-card:nth-child(2n)::before {
                content: "⚙";
                top: -12px;
                right: auto;
                left: -12px;
                animation-direction: reverse;
            }
            
            .dnd-char-card:nth-child(2n)::after {
                bottom: auto;
                top: -8px;
                left: auto;
                right: -8px;
            }
            
            .dnd-char-card:nth-child(3n)::before {
                font-size: 35px;
                animation-duration: 8s;
            }
        `,
        background: {
            type: 'gears',
            colors: ['rgba(184, 134, 11, 0.35)', 'rgba(139, 69, 19, 0.3)', 'rgba(205, 127, 50, 0.25)'],
            count: 8,
            speed: 0.01,
            size: { min: 40, max: 100 },
            animated: true
        }
};
