// features/dnd-theme/style-presets/elven-forest.ts
// 风格包：elven-forest（b11a · 自 BasedonST `src/config/StylePresets.js` 拆分移植）
export const elvenForest = {
        meta: {
            id: 'elven-forest',
            name: '精灵之森',
            icon: '🍃',
            description: '清新自然的森林风格，带有木质纹理',
            author: 'System'
        },
        colors: {
            '--dnd-bg-main': '#1a261a',
            '--dnd-bg-panel-start': '#2d402d',
            '--dnd-bg-panel-end': '#1e2b1e',
            '--dnd-text-main': '#e0f2e0',
            '--dnd-text-header': '#aaddaa',
            '--dnd-text-highlight': '#ffffff',
            '--dnd-text-dim': '#8ba38b',
            '--dnd-accent': '#4caf50',
            '--dnd-accent-hover': '#66bb6a',
            '--dnd-border-gold': '#8a9a5b',
            '--dnd-border-inner': '#3e5c3e',
            '--dnd-bg-card-start': 'rgba(45, 64, 45, 0.9)',
            '--dnd-bg-card-end': 'rgba(30, 43, 30, 0.9)',
            '--dnd-btn-primary': '#2e7d32',
            '--dnd-btn-primary-hover': '#388e3c',
            '--dnd-btn-text': '#ffffff'
        },
        morphology: {
            border: { style: 'solid', width: '2px', outerStyle: 'none' },
            corners: { style: 'organic', clipPath: 'none' },
            card: { shape: 'organic', decoration: 'vines' },
            effects: { texture: 'wood', innerGlow: 'subtle', borderGlow: 'none', overlay: 'gradient' },
            layout: { density: 'normal' },
            decorations: { dividers: 'leaves', corners: 'flourish' },
            buttons: { style: 'leaf', shape: 'rounded' },
            progressBars: { style: 'nature', animated: true }
        },
        typography: {
            '--dnd-font-serif': '"Palatino Linotype", "Book Antiqua", Palatino, serif',
            '--dnd-font-size-base': '0.95rem',
            '--dnd-letter-spacing': '0.02em'
        },
        animations: {
            '--dnd-transition-fast': '0.2s ease-out',
            '--dnd-transition-normal': '0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            '--dnd-animation-sway': 'elven-sway 4s ease-in-out infinite'
        },
        interactiveStates: {
            hover: {
                brightness: 1.12,
                scale: 1.02,
                lift: '-4px',
                shadow: '0 10px 30px rgba(76, 175, 80, 0.25), 0 0 15px rgba(139, 195, 74, 0.2)',
                borderColor: '#8a9a5b',
                glow: 'drop-shadow(0 0 6px rgba(76, 175, 80, 0.4))',
                transition: '0.35s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            cardHover: {
                transform: 'translateY(-6px) scale(1.015) rotate(-0.5deg)',
                shadow: '0 18px 40px rgba(30, 43, 30, 0.5), 0 0 25px rgba(76, 175, 80, 0.2)',
                borderColor: '#aaddaa'
            },
            buttonHover: {
                brightness: 1.2,
                transform: 'translateY(-2px) scale(1.03)',
                shadow: '0 6px 20px rgba(76, 175, 80, 0.4), 0 0 10px rgba(139, 195, 74, 0.3)'
            },
            active: {
                scale: 0.97,
                brightness: 0.92,
                transform: 'translateY(1px) scale(0.97)',
                shadow: '0 2px 8px rgba(0,0,0,0.3)'
            },
            buttonActive: {
                transform: 'translateY(2px) scale(0.98)',
                shadow: '0 1px 4px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.2)'
            },
            selected: {
                background: 'linear-gradient(90deg, rgba(76, 175, 80, 0.25), rgba(139, 195, 74, 0.15), transparent)',
                borderColor: '#aaddaa',
                borderWidth: '2px',
                glow: '0 0 15px rgba(76, 175, 80, 0.3)',
                textColor: '#ffffff'
            },
            navActive: {
                background: 'linear-gradient(90deg, rgba(76, 175, 80, 0.3), rgba(139, 195, 74, 0.15), transparent)',
                border: '3px solid #8a9a5b',
                indicator: '#4caf50'
            },
            focus: {
                borderColor: '#4caf50',
                shadow: '0 0 0 3px rgba(76, 175, 80, 0.25)',
                outline: 'none'
            },
            disabled: {
                opacity: 0.45,
                cursor: 'not-allowed',
                filter: 'grayscale(0.6) brightness(0.7)'
            },
            iconHover: {
                glow: 'drop-shadow(0 0 8px rgba(76, 175, 80, 0.7)) drop-shadow(0 0 15px rgba(139, 195, 74, 0.4))',
                scale: 1.15
            },
            inputFocus: {
                border: '#4caf50',
                shadow: '0 0 12px rgba(76, 175, 80, 0.35), inset 0 0 8px rgba(76, 175, 80, 0.1)'
            }
        },
        overrides: {
            /* ====== 卡片 - 树叶/有机形态 ====== */
            '.dnd-char-card': {
                'border-radius': '25px 8px 25px 8px',
                'border': '2px solid #3e5c3e',
                'box-shadow': '0 8px 30px rgba(30, 43, 30, 0.5), inset 0 0 40px rgba(76, 175, 80, 0.08), 0 0 20px rgba(139, 195, 74, 0.1)',
                'background': 'linear-gradient(135deg, rgba(45, 64, 45, 0.95) 0%, rgba(35, 50, 35, 0.97) 50%, rgba(30, 43, 30, 0.98) 100%)'
            },
            '.dnd-card-header': {
                'border-bottom': '2px solid #3e5c3e',
                'background': 'linear-gradient(to right, rgba(76, 175, 80, 0.2), rgba(62, 92, 62, 0.15), rgba(139, 195, 74, 0.15))',
                'border-radius': '23px 6px 0 0',
                'padding': '14px 18px',
                'position': 'relative'
            },
            '.dnd-card-body': {
                'background': 'radial-gradient(ellipse at bottom right, rgba(76, 175, 80, 0.05), transparent 70%)',
                'padding': '16px'
            },
            /* ====== 导航栏 - 树干纹理 ====== */
            '.dnd-nav-sidebar': {
                'background': 'linear-gradient(180deg, #2d402d 0%, #1e2b1e 100%)',
                'border-right': '3px solid #3e5c3e',
                'box-shadow': '3px 0 15px rgba(30, 43, 30, 0.4)'
            },
            '.dnd-nav-item': {
                'border-radius': '0 20px 20px 0',
                'margin': '4px 0',
                'padding': '12px 20px',
                'border-left': '4px solid transparent',
                'background': 'rgba(76, 175, 80, 0.03)',
                'transition': 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
            },
            '.dnd-nav-item:hover': {
                'background': 'linear-gradient(90deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.1), transparent)',
                'border-left-color': '#8bc34a',
                'padding-left': '24px'
            },
            '.dnd-nav-item.active': {
                'background': 'linear-gradient(90deg, rgba(76, 175, 80, 0.3), rgba(139, 195, 74, 0.15), transparent)',
                'border-left-color': '#4caf50',
                'box-shadow': 'inset 4px 0 0 #8bc34a, 0 0 20px rgba(76, 175, 80, 0.25)',
                'border-radius': '0 20px 20px 0'
            },
            /* ====== 进度条 - 藤蔓生长 ====== */
            '.dnd-bar-container': {
                'background': 'linear-gradient(180deg, rgba(30, 43, 30, 0.8), rgba(45, 64, 45, 0.6))',
                'border': '1px solid #3e5c3e',
                'border-radius': '10px',
                'height': '10px',
                'box-shadow': 'inset 0 1px 4px rgba(0,0,0,0.4)'
            },
            '.dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #2e7d32 0%, #4caf50 40%, #8bc34a 70%, #4caf50 100%)',
                'box-shadow': '0 0 10px rgba(76, 175, 80, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                'border-radius': '8px'
            },
            '.dnd-bar-hp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #1b5e20 0%, #2e7d32 40%, #43a047 70%, #2e7d32 100%)'
            },
            '.dnd-bar-exp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #33691e 0%, #558b2f 40%, #7cb342 70%, #558b2f 100%)'
            },
            /* ====== 按钮 - 树叶形态 ====== */
            '.dnd-btn, .dnd-action-btn': {
                'border': '2px solid #3e5c3e',
                'background': 'linear-gradient(135deg, #2d402d 0%, #243424 100%)',
                'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.1), 0 3px 8px rgba(0,0,0,0.3)',
                'border-radius': '20px 8px 20px 8px',
                'font-family': '"Palatino Linotype", serif',
                'position': 'relative',
                'overflow': 'hidden'
            },
            '.dnd-btn:hover, .dnd-action-btn:hover': {
                'background': 'linear-gradient(135deg, #3d503d 0%, #2d402d 100%)',
                'border-color': '#4caf50',
                'box-shadow': '0 0 15px rgba(76, 175, 80, 0.3), 0 5px 12px rgba(0,0,0,0.4)'
            },
            '.dnd-btn:active, .dnd-action-btn:active': {
                'background': 'linear-gradient(135deg, #243424 0%, #1a261a 100%)',
                'box-shadow': 'inset 0 2px 4px rgba(0,0,0,0.3)'
            },
            /* ====== 属性行 - 苔藓纹理 ====== */
            '.dnd-stat-row': {
                'background': 'linear-gradient(90deg, rgba(76, 175, 80, 0.1), rgba(62, 92, 62, 0.15), rgba(76, 175, 80, 0.08))',
                'border': '1px solid rgba(62, 92, 62, 0.3)',
                'border-radius': '12px 4px 12px 4px',
                'padding': '8px 12px',
                'margin': '4px 0'
            },
            '.dnd-stat-row:hover': {
                'background': 'linear-gradient(90deg, rgba(76, 175, 80, 0.18), rgba(62, 92, 62, 0.2), rgba(76, 175, 80, 0.15))'
            },
            /* ====== 标题样式 - 精灵文字 ====== */
            '.dnd-title, .dnd-char-name': {
                'text-shadow': '0 2px 10px rgba(76, 175, 80, 0.4), 0 0 20px rgba(139, 195, 74, 0.2)',
                'font-family': '"Palatino Linotype", "Book Antiqua", serif',
                'letter-spacing': '0.05em'
            },
            /* ====== 面板/弹窗 - 树洞形态 ====== */
            '.dnd-panel, .dnd-dialog': {
                'border': '2px solid #3e5c3e',
                'border-radius': '30px 10px 30px 10px',
                'box-shadow': '0 10px 40px rgba(30, 43, 30, 0.6), inset 0 0 50px rgba(76, 175, 80, 0.05)'
            },
            '#dnd-mini-hud': {
                'border': '2px solid #3e5c3e',
                'border-radius': '20px 6px 20px 6px',
                'background': 'linear-gradient(180deg, rgba(45, 64, 45, 0.98), rgba(30, 43, 30, 0.99))'
            },
            /* ====== 输入框 ====== */
            '.dnd-input, .dnd-select, .dnd-textarea': {
                'background': 'rgba(30, 43, 30, 0.8)',
                'border': '1px solid #3e5c3e',
                'border-radius': '12px 4px 12px 4px',
                'color': '#e0f2e0'
            },
            '.dnd-input:focus, .dnd-select:focus, .dnd-textarea:focus': {
                'border-color': '#4caf50',
                'box-shadow': '0 0 12px rgba(76, 175, 80, 0.4), inset 0 0 6px rgba(76, 175, 80, 0.1)'
            },
            /* ====== 表格 ====== */
            '.dnd-table th': {
                'background': 'linear-gradient(180deg, #2d402d, #243424)',
                'border-bottom': '2px solid #4caf50',
                'color': '#aaddaa'
            },
            '.dnd-table td': {
                'border-bottom': '1px solid rgba(62, 92, 62, 0.3)'
            },
            '.dnd-table tr:hover td': {
                'background': 'rgba(76, 175, 80, 0.1)'
            },
            /* ====== 徽章 ====== */
            '.dnd-badge': {
                'background': 'linear-gradient(135deg, #3e5c3e, #2d402d)',
                'border': '1px solid #4caf50',
                'border-radius': '15px 5px 15px 5px'
            }
        },
        customCSS: `
            /* ====== 精灵之森皮肤 - 自然有机动画与装饰 ====== */
            
            /* 轻柔摇摆动画 */
            @keyframes elven-sway {
                0%, 100% { transform: rotate(0deg) translateY(0); }
                25% { transform: rotate(0.5deg) translateY(-1px); }
                50% { transform: rotate(0deg) translateY(0); }
                75% { transform: rotate(-0.5deg) translateY(-1px); }
            }
            
            /* 叶片飘落动画 */
            @keyframes leaf-fall {
                0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
            }
            
            /* 萤火虫光效 */
            @keyframes firefly-glow {
                0%, 100% { opacity: 0.3; box-shadow: 0 0 5px rgba(200, 230, 100, 0.5); }
                50% { opacity: 1; box-shadow: 0 0 15px rgba(200, 230, 100, 0.8); }
            }
            
            /* 藤蔓生长动画 */
            @keyframes vine-grow {
                0% { width: 0; }
                100% { width: 100%; }
            }
            
            /* 露珠闪烁 */
            @keyframes dewdrop-sparkle {
                0%, 100% { opacity: 0.5; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
            
            /* 卡片 - 森林树叶形态 */
            .dnd-char-card {
                position: relative;
                animation: elven-sway 6s ease-in-out infinite;
            }
            
            /* 外发光边框 - 自然光晕 */
            .dnd-char-card::before {
                content: "";
                position: absolute;
                top: -3px; left: -3px; right: -3px; bottom: -3px;
                background: linear-gradient(135deg, rgba(76, 175, 80, 0.4) 0%, transparent 25%, transparent 75%, rgba(139, 195, 74, 0.3) 100%);
                border-radius: 27px 10px 27px 10px;
                pointer-events: none;
                z-index: -1;
                filter: blur(3px);
            }
            
            /* 木纹/树皮纹理叠加 */
            .dnd-char-card::after {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.08' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wood)' opacity='0.04'/%3E%3C/svg%3E");
                pointer-events: none;
                border-radius: inherit;
                z-index: 0;
            }
            
            /* 卡片头部 - 树枝装饰 */
            .dnd-card-header::before {
                content: "❧";
                position: absolute;
                left: 12px; top: 50%;
                transform: translateY(-50%);
                color: #4caf50;
                font-size: 14px;
                opacity: 0.6;
            }
            
            .dnd-card-header::after {
                content: "❧";
                position: absolute;
                right: 12px; top: 50%;
                transform: translateY(-50%) scaleX(-1);
                color: #8bc34a;
                font-size: 14px;
                opacity: 0.6;
            }
            
            /* 导航项 - 藤蔓延伸效果 */
            .dnd-nav-item::before {
                content: "";
                position: absolute;
                left: 0; top: 50%;
                transform: translateY(-50%);
                width: 0; height: 3px;
                background: linear-gradient(90deg, #4caf50, #8bc34a);
                transition: width 0.3s ease-out;
                border-radius: 0 3px 3px 0;
            }
            
            .dnd-nav-item:hover::before {
                width: 20px;
            }
            
            .dnd-nav-item.active::before {
                width: 30px;
                box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
            }
            
            .dnd-nav-item.active::after {
                content: "🍃";
                position: absolute;
                right: 12px;
                font-size: 12px;
                animation: elven-sway 3s ease-in-out infinite;
            }
            
            /* 按钮 - 叶脉纹理 */
            .dnd-btn::before,
            .dnd-action-btn::before {
                content: "";
                position: absolute;
                top: 50%; left: 10%;
                width: 80%; height: 1px;
                background: linear-gradient(90deg, transparent, rgba(139, 195, 74, 0.3), transparent);
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .dnd-btn:hover::before,
            .dnd-action-btn:hover::before {
                opacity: 1;
            }
            
            /* 进度条 - 生长动画 */
            .dnd-bar-fill {
                position: relative;
                overflow: hidden;
            }
            
            .dnd-bar-fill::before {
                content: "";
                position: absolute;
                top: 0; left: -50%; width: 50%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
                animation: vine-grow 2s ease-in-out infinite;
            }
            
            /* 分隔线 - 藤蔓 */
            .dnd-divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, #3e5c3e, #4caf50, #8bc34a, #4caf50, #3e5c3e, transparent);
                position: relative;
                margin: 12px 0;
            }
            
            .dnd-divider::before {
                content: "✿";
                position: absolute;
                left: 50%; top: 50%;
                transform: translate(-50%, -50%);
                background: #1e2b1e;
                padding: 0 10px;
                color: #4caf50;
                font-size: 12px;
            }
            
            /* 面板角落 - 树叶装饰 */
            .dnd-panel::before,
            .dnd-dialog::before {
                content: "🌿";
                position: absolute;
                top: 8px; left: 10px;
                font-size: 14px;
                opacity: 0.6;
            }
            
            .dnd-panel::after,
            .dnd-dialog::after {
                content: "🌿";
                position: absolute;
                bottom: 8px; right: 10px;
                font-size: 14px;
                opacity: 0.6;
                transform: rotate(180deg);
            }
            
            /* 滚动条 - 树干风格 */
            .dnd-content-area::-webkit-scrollbar {
                width: 10px;
            }
            
            .dnd-content-area::-webkit-scrollbar-track {
                background: rgba(30, 43, 30, 0.5);
                border-left: 1px solid #3e5c3e;
                border-radius: 5px;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #3e5c3e, #4caf50, #3e5c3e);
                border-radius: 5px;
                border: 1px solid #2d402d;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, #4caf50, #8bc34a, #4caf50);
            }
            
            /* 图标容器 - 花朵形 */
            .dnd-icon-circle {
                border-radius: 50%;
                border: 2px solid #4caf50;
                background: radial-gradient(circle at 30% 30%, #3e5c3e, #2d402d);
                box-shadow: 0 0 15px rgba(76, 175, 80, 0.3);
            }
            
            /* 头像框 - 有机不规则形 */
            .dnd-avatar {
                border-radius: 60% 40% 50% 50% / 50% 50% 40% 60%;
                border: 2px solid #4caf50;
                box-shadow: 0 0 15px rgba(76, 175, 80, 0.3), 0 0 30px rgba(139, 195, 74, 0.15);
            }
            
            /* 工具提示 */
            .dnd-tooltip {
                background: linear-gradient(135deg, #2d402d, #1e2b1e);
                border: 1px solid #4caf50;
                border-radius: 15px 5px 15px 5px;
                box-shadow: 0 5px 20px rgba(30, 43, 30, 0.6);
            }
            
            /* 悬浮光效 */
            .dnd-char-card:hover {
                box-shadow: 0 12px 40px rgba(30, 43, 30, 0.6), inset 0 0 50px rgba(76, 175, 80, 0.1), 0 0 30px rgba(139, 195, 74, 0.2);
            }
        `,
        background: {
            type: 'particles',
            colors: ['rgba(76, 175, 80, 0.5)', 'rgba(139, 195, 74, 0.4)', 'rgba(255, 255, 255, 0.4)', 'rgba(200, 230, 200, 0.3)'],
            minSize: 2,
            maxSize: 6,
            count: 25,
            speed: 0.05,
            shape: 'circle',
            glow: true
        }
};
