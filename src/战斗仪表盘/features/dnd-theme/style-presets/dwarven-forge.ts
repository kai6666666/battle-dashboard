// features/dnd-theme/style-presets/dwarven-forge.ts
// 风格包：dwarven-forge（b11a · 自 BasedonST `src/config/StylePresets.js` 拆分移植）
export const dwarvenForge = {
        meta: {
            id: 'dwarven-forge',
            name: '矮人锻炉',
            icon: '⚒️',
            description: '坚固硬朗的金属风格，仿佛刚出炉的兵器',
            author: 'System'
        },
        colors: {
            '--dnd-bg-main': '#1c1c1c',
            '--dnd-bg-panel-start': '#2b2b2b',
            '--dnd-bg-panel-end': '#1f1f1f',
            '--dnd-text-main': '#dcdcdc',
            '--dnd-text-header': '#ffaa00',
            '--dnd-text-highlight': '#ffcc00',
            '--dnd-text-dim': '#909090',
            '--dnd-accent': '#ff9800',
            '--dnd-accent-hover': '#ffb74d',
            '--dnd-border-gold': '#cd7f32',
            '--dnd-border-inner': '#555555',
            '--dnd-bg-card-start': '#333333',
            '--dnd-bg-card-end': '#262626',
            '--dnd-btn-primary': '#e65100',
            '--dnd-btn-primary-hover': '#f57c00',
            '--dnd-btn-text': '#ffffff'
        },
        morphology: {
            border: { style: 'groove', width: '4px', outerStyle: 'none' },
            corners: { style: 'chamfer', clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' },
            card: { shape: 'blocky', decoration: 'rivets' },
            effects: { texture: 'metal', innerGlow: 'none', borderGlow: 'gold', overlay: 'none' },
            layout: { density: 'compact' },
            decorations: { corners: 'bolts', dividers: 'bars' },
            buttons: { style: 'metallic', shape: 'chamfer' },
            progressBars: { style: 'molten', animated: true }
        },
        typography: {
            '--dnd-font-serif': '"Trebuchet MS", Arial, sans-serif',
            '--dnd-font-size-header': '1.1rem',
            '--dnd-font-weight-header': '700',
            '--dnd-letter-spacing': '0.03em'
        },
        animations: {
            '--dnd-transition-fast': '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            '--dnd-transition-normal': '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '--dnd-animation-forge': 'forge-glow 2s ease-in-out infinite'
        },
        interactiveStates: {
            hover: {
                brightness: 1.15,
                scale: 1.01,
                lift: '-2px',
                shadow: '0 6px 20px rgba(255, 152, 0, 0.3), 0 0 10px rgba(205, 127, 50, 0.4)',
                borderColor: '#cd7f32',
                glow: 'drop-shadow(0 0 5px rgba(255, 152, 0, 0.5))',
                transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            cardHover: {
                transform: 'translateY(-4px) scale(1.01)',
                shadow: '0 12px 30px rgba(0,0,0,0.6), 0 0 20px rgba(255, 152, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                borderColor: '#ffaa00'
            },
            buttonHover: {
                brightness: 1.25,
                transform: 'translateY(-2px) scale(1.02)',
                shadow: '0 6px 18px rgba(230, 81, 0, 0.5), 0 0 8px rgba(255, 152, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
            },
            active: {
                scale: 0.98,
                brightness: 0.9,
                transform: 'translateY(2px) scale(0.98)',
                shadow: 'inset 0 3px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)'
            },
            buttonActive: {
                transform: 'translateY(2px) scale(0.97)',
                shadow: 'inset 0 3px 10px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.3)'
            },
            selected: {
                background: 'linear-gradient(90deg, rgba(255, 152, 0, 0.3), rgba(205, 127, 50, 0.2), transparent)',
                borderColor: '#ffcc00',
                borderWidth: '3px',
                glow: '0 0 15px rgba(255, 152, 0, 0.4)',
                textColor: '#ffcc00'
            },
            navActive: {
                background: 'linear-gradient(90deg, rgba(255, 152, 0, 0.35), rgba(205, 127, 50, 0.2), transparent)',
                border: '3px solid #cd7f32',
                indicator: '#ff9800'
            },
            focus: {
                borderColor: '#ff9800',
                shadow: '0 0 0 3px rgba(255, 152, 0, 0.3)',
                outline: 'none'
            },
            disabled: {
                opacity: 0.4,
                cursor: 'not-allowed',
                filter: 'grayscale(0.6) brightness(0.6)'
            },
            iconHover: {
                glow: 'drop-shadow(0 0 6px rgba(255, 170, 0, 0.8)) drop-shadow(0 0 12px rgba(205, 127, 50, 0.5))',
                scale: 1.12
            },
            inputFocus: {
                border: '#cd7f32',
                shadow: '0 0 10px rgba(205, 127, 50, 0.4), inset 0 1px 3px rgba(0,0,0,0.3)'
            }
        },
        overrides: {
            /* ====== 卡片 - 金属铆钉面板 ====== */
            '.dnd-char-card': {
                'box-shadow': 'inset 0 0 10px rgba(0,0,0,0.9), 5px 5px 0px rgba(0,0,0,0.6), 0 0 20px rgba(205, 127, 50, 0.2)',
                'border': '4px solid #555',
                'border-radius': '0',
                'clip-path': 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)',
                'background': 'linear-gradient(135deg, #404040 0%, #2e2e2e 30%, #282828 70%, #222222 100%)'
            },
            '.dnd-card-header': {
                'background': 'linear-gradient(180deg, #454545 0%, #353535 50%, #303030 100%)',
                'border-bottom': '4px solid #cd7f32',
                'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -2px 0 rgba(0,0,0,0.3), 0 2px 5px rgba(0,0,0,0.4)',
                'padding': '14px 18px',
                'position': 'relative'
            },
            '.dnd-card-body': {
                'background': 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 5px)',
                'padding': '16px'
            },
            /* ====== 导航栏 - 铁板结构 ====== */
            '.dnd-nav-sidebar': {
                'background': 'linear-gradient(180deg, #2b2b2b 0%, #1f1f1f 100%)',
                'border-right': '4px solid #555',
                'box-shadow': '4px 0 10px rgba(0,0,0,0.5)'
            },
            '.dnd-nav-item': {
                'clip-path': 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
                'margin': '3px 0',
                'padding': '12px 20px',
                'border-left': '5px solid transparent',
                'background': 'linear-gradient(90deg, rgba(85, 85, 85, 0.3), transparent)',
                'transition': 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            '.dnd-nav-item:hover': {
                'background': 'linear-gradient(90deg, rgba(255, 152, 0, 0.2), rgba(205, 127, 50, 0.1), transparent)',
                'border-left-color': '#cd7f32'
            },
            '.dnd-nav-item.active': {
                'background': 'linear-gradient(90deg, rgba(255, 152, 0, 0.35), rgba(205, 127, 50, 0.2), transparent)',
                'box-shadow': 'inset 5px 0 0 #ff9800, 0 0 15px rgba(255, 152, 0, 0.25)',
                'border-left-color': '#ffaa00'
            },
            /* ====== 进度条 - 熔岩/锻造火焰 ====== */
            '.dnd-bar-container': {
                'background': 'linear-gradient(180deg, #1a1a1a, #252525, #1a1a1a)',
                'border': '2px solid #555',
                'border-radius': '0',
                'height': '14px',
                'box-shadow': 'inset 0 2px 5px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.05)'
            },
            '.dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #8B0000 0%, #bf360c 20%, #e65100 40%, #ff9800 60%, #ffb74d 80%, #ff9800 100%)',
                'background-size': '200% 100%',
                'box-shadow': '0 0 15px rgba(255, 152, 0, 0.6), inset 0 0 8px rgba(255, 200, 100, 0.4)',
                'border-radius': '0'
            },
            '.dnd-bar-hp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #4a0000 0%, #7a0000 30%, #aa2020 60%, #7a0000 100%)'
            },
            '.dnd-bar-exp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #1a237e 0%, #303f9f 30%, #5c6bc0 60%, #303f9f 100%)'
            },
            /* ====== 按钮 - 金属铆钉按钮 ====== */
            '.dnd-btn, .dnd-action-btn': {
                'background': 'linear-gradient(180deg, #505050 0%, #3a3a3a 40%, #2a2a2a 100%)',
                'border': '3px solid #555',
                'border-radius': '0',
                'clip-path': 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3), 0 3px 6px rgba(0,0,0,0.4)',
                'font-family': '"Trebuchet MS", sans-serif',
                'text-transform': 'uppercase',
                'letter-spacing': '0.05em',
                'position': 'relative'
            },
            '.dnd-btn:hover, .dnd-action-btn:hover': {
                'background': 'linear-gradient(180deg, #606060 0%, #4a4a4a 40%, #3a3a3a 100%)',
                'border-color': '#cd7f32',
                'box-shadow': '0 0 15px rgba(255, 152, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 10px rgba(0,0,0,0.5)'
            },
            '.dnd-btn:active, .dnd-action-btn:active': {
                'background': 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%)',
                'box-shadow': 'inset 0 3px 8px rgba(0,0,0,0.6)'
            },
            /* ====== 属性行 - 金属凹槽 ====== */
            '.dnd-stat-row': {
                'background': 'linear-gradient(180deg, rgba(60, 60, 60, 0.5), rgba(40, 40, 40, 0.6))',
                'border': '1px solid #444',
                'border-top-color': '#555',
                'border-radius': '0',
                'padding': '8px 12px',
                'margin': '3px 0',
                'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 2px rgba(0,0,0,0.3)'
            },
            '.dnd-stat-row:hover': {
                'background': 'linear-gradient(180deg, rgba(80, 80, 80, 0.5), rgba(60, 60, 60, 0.6))',
                'border-color': '#cd7f32'
            },
            /* ====== 标题样式 - 熔炉火焰 ====== */
            '.dnd-title, .dnd-char-name': {
                'text-shadow': '0 2px 4px rgba(0,0,0,0.6), 0 0 15px rgba(255, 152, 0, 0.4), 0 0 30px rgba(205, 127, 50, 0.2)',
                'font-family': '"Trebuchet MS", Arial, sans-serif',
                'letter-spacing': '0.08em'
            },
            /* ====== 面板/弹窗 - 金属框架 ====== */
            '.dnd-panel, .dnd-dialog': {
                'border': '4px solid #555',
                'border-radius': '0',
                'clip-path': 'polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
                'box-shadow': '5px 5px 0 rgba(0,0,0,0.5), inset 0 0 50px rgba(0,0,0,0.3)'
            },
            '#dnd-mini-hud': {
                'border': '3px solid #555',
                'border-radius': '0',
                'clip-path': 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
                'background': 'linear-gradient(180deg, #2b2b2b 0%, #1f1f1f 100%)'
            },
            /* ====== 输入框 ====== */
            '.dnd-input, .dnd-select, .dnd-textarea': {
                'background': '#1a1a1a',
                'border': '2px solid #555',
                'border-radius': '0',
                'color': '#dcdcdc',
                'box-shadow': 'inset 0 2px 4px rgba(0,0,0,0.5)'
            },
            '.dnd-input:focus, .dnd-select:focus, .dnd-textarea:focus': {
                'border-color': '#cd7f32',
                'box-shadow': '0 0 10px rgba(205, 127, 50, 0.3), inset 0 2px 4px rgba(0,0,0,0.5)'
            },
            /* ====== 表格 ====== */
            '.dnd-table': {
                'border': '2px solid #555'
            },
            '.dnd-table th': {
                'background': 'linear-gradient(180deg, #404040, #303030)',
                'border-bottom': '3px solid #cd7f32',
                'color': '#ffaa00',
                'text-transform': 'uppercase'
            },
            '.dnd-table td': {
                'border-bottom': '1px solid #444'
            },
            '.dnd-table tr:hover td': {
                'background': 'rgba(255, 152, 0, 0.1)'
            },
            /* ====== 徽章 ====== */
            '.dnd-badge': {
                'background': 'linear-gradient(135deg, #555, #333)',
                'border': '2px solid #cd7f32',
                'border-radius': '0',
                'clip-path': 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
            }
        },
        customCSS: `
            /* ====== 矮人锻炉皮肤 - 工业金属动画与装饰 ====== */
            
            /* 熔炉脉动光效 */
            @keyframes forge-glow {
                0%, 100% {
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.9), 5px 5px 0px rgba(0,0,0,0.6), 0 0 20px rgba(205, 127, 50, 0.2);
                    filter: brightness(1);
                }
                50% {
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.9), 5px 5px 0px rgba(0,0,0,0.6), 0 0 35px rgba(255, 152, 0, 0.4);
                    filter: brightness(1.02);
                }
            }
            
            /* 熔岩流动动画 */
            @keyframes molten-flow {
                0% { background-position: 0% 50%; }
                100% { background-position: 200% 50%; }
            }
            
            /* 火花飞溅 */
            @keyframes spark-fly {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(-30px) scale(0); opacity: 0; }
            }
            
            /* 锤击震动 */
            @keyframes hammer-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }
            
            /* 金属光泽闪动 */
            @keyframes metal-shine {
                0% { left: -100%; }
                50%, 100% { left: 100%; }
            }
            
            /* 卡片 - 金属面板效果 */
            .dnd-char-card {
                position: relative;
                animation: forge-glow 3s ease-in-out infinite;
            }
            
            /* 金属高光线 */
            .dnd-char-card::before {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 3px;
                background: linear-gradient(90deg, transparent 20%, rgba(255, 200, 100, 0.4) 50%, transparent 80%);
                pointer-events: none;
                z-index: 10;
            }
            
            /* 四角铆钉装饰 */
            .dnd-char-card::after {
                content: "";
                position: absolute;
                top: 8px; left: 8px;
                width: 12px; height: 12px;
                background: radial-gradient(circle at 30% 30%, #777 0%, #555 40%, #333 100%);
                border-radius: 50%;
                border: 1px solid #666;
                box-shadow:
                    calc(100% - 28px) 0 0 0 #555,
                    0 calc(100% - 28px) 0 0 #555,
                    calc(100% - 28px) calc(100% - 28px) 0 0 #555,
                    inset 0 -1px 2px rgba(0,0,0,0.5),
                    inset 0 1px 1px rgba(255,255,255,0.2);
                pointer-events: none;
                z-index: 10;
            }
            
            /* 卡片头部 - 铁板标题栏 */
            .dnd-card-header::before {
                content: "⚒";
                position: absolute;
                left: 14px; top: 50%;
                transform: translateY(-50%);
                color: #cd7f32;
                font-size: 14px;
                text-shadow: 0 0 5px rgba(205, 127, 50, 0.5);
            }
            
            .dnd-card-header::after {
                content: "";
                position: absolute;
                right: 14px; top: 50%;
                transform: translateY(-50%);
                width: 30px; height: 6px;
                background: repeating-linear-gradient(90deg, #cd7f32, #cd7f32 4px, transparent 4px, transparent 8px);
            }
            
            /* 导航项 - 金属标签 */
            .dnd-nav-item::before {
                content: "";
                position: absolute;
                left: 0; top: 50%;
                transform: translateY(-50%);
                width: 5px; height: 0;
                background: linear-gradient(to bottom, #ff9800, #cd7f32);
                transition: height 0.2s ease-out;
            }
            
            .dnd-nav-item:hover::before {
                height: 60%;
            }
            
            .dnd-nav-item.active::before {
                height: 80%;
                box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
            }
            
            .dnd-nav-item.active::after {
                content: "▸";
                position: absolute;
                right: 12px;
                color: #ffaa00;
                font-size: 14px;
            }
            
            /* 按钮 - 锻造按压效果 */
            .dnd-btn::before,
            .dnd-action-btn::before {
                content: "";
                position: absolute;
                top: 0; left: -100%;
                width: 50%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                transition: left 0.4s;
            }
            
            .dnd-btn:hover::before,
            .dnd-action-btn:hover::before {
                left: 150%;
            }
            
            /* 进度条 - 熔岩动画 */
            .dnd-bar-fill {
                position: relative;
                overflow: hidden;
                animation: molten-flow 3s linear infinite;
            }
            
            .dnd-bar-fill::before {
                content: "";
                position: absolute;
                top: 0; bottom: 0; left: 0; right: 0;
                background: repeating-linear-gradient(
                    110deg,
                    transparent,
                    transparent 8px,
                    rgba(255,255,255,0.1) 8px,
                    rgba(255,255,255,0.1) 16px
                );
            }
            
            /* 分隔线 - 铁条 */
            .dnd-divider {
                height: 4px;
                background: linear-gradient(180deg, #555 0%, #333 50%, #555 100%);
                border-top: 1px solid #666;
                border-bottom: 1px solid #222;
                position: relative;
            }
            
            .dnd-divider::before {
                content: "⚙";
                position: absolute;
                left: 50%; top: 50%;
                transform: translate(-50%, -50%);
                background: #2b2b2b;
                padding: 0 12px;
                color: #cd7f32;
                font-size: 14px;
            }
            
            /* 面板角落 - 金属铆钉 */
            .dnd-panel::before,
            .dnd-dialog::before {
                content: "";
                position: absolute;
                top: 10px; left: 10px;
                width: 14px; height: 14px;
                background: radial-gradient(circle at 30% 30%, #888, #555, #333);
                border-radius: 50%;
                border: 1px solid #666;
                box-shadow: inset 0 -1px 2px rgba(0,0,0,0.5);
            }
            
            .dnd-panel::after,
            .dnd-dialog::after {
                content: "";
                position: absolute;
                bottom: 10px; right: 10px;
                width: 14px; height: 14px;
                background: radial-gradient(circle at 30% 30%, #888, #555, #333);
                border-radius: 50%;
                border: 1px solid #666;
                box-shadow: inset 0 -1px 2px rgba(0,0,0,0.5);
            }
            
            /* 滚动条 - 金属风格 */
            .dnd-content-area::-webkit-scrollbar {
                width: 12px;
            }
            
            .dnd-content-area::-webkit-scrollbar-track {
                background: #1a1a1a;
                border-left: 1px solid #555;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #555, #444, #555);
                border: 1px solid #666;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, #666, #555, #666);
                border-color: #cd7f32;
            }
            
            /* 图标容器 - 齿轮形 */
            .dnd-icon-circle {
                clip-path: polygon(50% 0%, 63% 5%, 75% 0%, 80% 12%, 100% 20%, 95% 35%, 100% 50%, 95% 65%, 100% 80%, 80% 88%, 75% 100%, 63% 95%, 50% 100%, 37% 95%, 25% 100%, 20% 88%, 0% 80%, 5% 65%, 0% 50%, 5% 35%, 0% 20%, 20% 12%, 25% 0%, 37% 5%);
                border: none;
                background: linear-gradient(135deg, #555, #333);
                box-shadow: 0 0 10px rgba(205, 127, 50, 0.3);
            }
            
            /* 头像框 - 八边形盾牌 */
            .dnd-avatar {
                clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
                border: 3px solid #cd7f32;
                box-shadow: 0 0 15px rgba(205, 127, 50, 0.4);
            }
            
            /* 悬停震动效果 */
            .dnd-char-card:hover {
                animation: hammer-shake 0.3s ease-in-out;
            }
            
            /* 工具提示 */
            .dnd-tooltip {
                background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
                border: 2px solid #555;
                clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
                box-shadow: 3px 3px 0 rgba(0,0,0,0.4);
            }
        `,
        background: {
            type: 'blueprint',
            majorColor: 'rgba(255, 152, 0, 0.12)',
            minorColor: 'rgba(255, 152, 0, 0.06)',
            gridSize: 30,
            animated: true
        }
};
