// features/dnd-theme/style-presets/kawaii-dreams.ts
// 风格包：kawaii-dreams（b11a · 自 BasedonST `src/config/StylePresets.js` 拆分移植）
export const kawaiiDreams = {
        meta: {
            id: 'kawaii-dreams',
            name: '可爱童话',
            icon: '<i class="fa-solid fa-star"></i>',
            description: '温馨可爱的童话风格，柔和圆润的视觉效果',
            author: 'System'
        },
        colors: {
            '--dnd-bg-main': '#FDF2F8',
            '--dnd-bg-panel-start': '#FDF2F8',
            '--dnd-bg-panel-end': '#FCE7F3',
            '--dnd-text-main': '#9D174D',
            '--dnd-text-header': '#BE185D',
            '--dnd-text-highlight': '#DB2777',
            '--dnd-text-dim': '#9F1239',
            '--dnd-accent': '#F472B6',
            '--dnd-accent-hover': '#F9A8D4',
            '--dnd-border-gold': '#FBCFE8',
            '--dnd-border-inner': '#F9A8D4',
            '--dnd-border-subtle': '#FBCFE8',
            '--dnd-bg-card-start': 'rgba(255, 255, 255, 0.95)',
            '--dnd-bg-card-end': 'rgba(253, 242, 248, 0.98)',
            '--dnd-bg-input': '#FFF7FB',
            '--dnd-bg-secondary': '#FFF7FB',
            '--dnd-bg-tertiary': '#FCE7F3',
            '--dnd-btn-primary': '#F472B6',
            '--dnd-btn-primary-hover': '#F9A8D4',
            '--dnd-btn-text': '#FFFFFF',
            '--dnd-accent-blue': '#EC4899',
            '--dnd-accent-red': '#BE123C',
            '--dnd-accent-green': '#059669',
            '--dnd-selected-glow': '0 0 10px rgba(244, 114, 182, 0.4)',
            // Logo/进度条/HUD 相关浅色变量
            '--dnd-logo-bg-start': '#F9A8D4',
            '--dnd-logo-bg-end': '#F472B6',
            '--dnd-bar-bg': 'rgba(251, 207, 232, 0.6)',
            '--dnd-bar-hp-start': '#DB2777',
            '--dnd-bar-hp-end': '#EC4899',
            '--dnd-bar-exp-start': '#BE185D',
            '--dnd-bar-exp-end': '#DB2777'
        },
        morphology: {
            border: { style: 'solid', width: '2px', outerStyle: 'none' },
            corners: { style: 'rounded', clipPath: 'none' },
            card: { shape: 'bubbly', decoration: 'stars' },
            effects: { texture: 'soft', innerGlow: 'candy', borderGlow: 'pastel', overlay: 'gradient' },
            layout: { density: 'normal' },
            decorations: { corners: 'sparkles', dividers: 'dots', headers: 'ribbon' },
            buttons: { style: 'candy', shape: 'pill' },
            progressBars: { style: 'bubble', animated: true }
        },
        typography: {
            '--dnd-font-serif': '"Nunito", "Comic Sans MS", "Segoe UI", sans-serif',
            '--dnd-font-size-base': '0.95rem',
            '--dnd-font-size-header': '1.1rem',
            '--dnd-font-weight-header': '600',
            '--dnd-letter-spacing': '0.02em'
        },
        animations: {
            '--dnd-transition-fast': '0.2s ease-out',
            '--dnd-transition-normal': '0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '--dnd-animation-float': 'kawaii-float 4s ease-in-out infinite',
            '--dnd-animation-sparkle': 'sparkle 2s ease-in-out infinite'
        },
        interactiveStates: {
            hover: {
                brightness: 1.05,
                scale: 1.03,
                lift: '-5px',
                shadow: '0 12px 35px rgba(244, 114, 182, 0.25), 0 0 20px rgba(251, 207, 232, 0.3)',
                borderColor: '#F472B6',
                glow: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.5))',
                transition: '0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            },
            cardHover: {
                transform: 'translateY(-8px) scale(1.02) rotate(-1deg)',
                shadow: '0 20px 50px rgba(244, 114, 182, 0.2), 0 0 30px rgba(251, 207, 232, 0.3), inset 0 0 25px rgba(255, 255, 255, 0.3)',
                borderColor: '#F472B6'
            },
            buttonHover: {
                brightness: 1.1,
                transform: 'translateY(-3px) scale(1.05)',
                shadow: '0 8px 25px rgba(244, 114, 182, 0.4), 0 0 15px rgba(249, 168, 212, 0.3)'
            },
            active: {
                scale: 0.95,
                brightness: 0.95,
                transform: 'translateY(2px) scale(0.95)',
                shadow: '0 2px 8px rgba(159, 18, 57, 0.15), inset 0 2px 6px rgba(159, 18, 57, 0.1)'
            },
            buttonActive: {
                transform: 'translateY(3px) scale(0.97)',
                shadow: '0 1px 4px rgba(159, 18, 57, 0.15), inset 0 3px 8px rgba(159, 18, 57, 0.1)'
            },
            selected: {
                background: 'linear-gradient(90deg, rgba(244, 114, 182, 0.25), rgba(251, 207, 232, 0.2), transparent)',
                borderColor: '#F472B6',
                borderWidth: '2px',
                glow: '0 0 20px rgba(244, 114, 182, 0.3)',
                textColor: '#BE185D'
            },
            navActive: {
                background: 'linear-gradient(90deg, rgba(244, 114, 182, 0.3), rgba(251, 207, 232, 0.2), transparent)',
                border: '3px solid #F472B6',
                indicator: '#DB2777'
            },
            focus: {
                borderColor: '#F472B6',
                shadow: '0 0 0 4px rgba(244, 114, 182, 0.25)',
                outline: 'none'
            },
            disabled: {
                opacity: 0.5,
                cursor: 'not-allowed',
                filter: 'grayscale(0.3) brightness(0.9)'
            },
            iconHover: {
                glow: 'drop-shadow(0 0 10px rgba(244, 114, 182, 0.7)) drop-shadow(0 0 20px rgba(251, 207, 232, 0.5))',
                scale: 1.2
            },
            inputFocus: {
                border: '#F472B6',
                shadow: '0 0 15px rgba(244, 114, 182, 0.25), inset 0 0 10px rgba(251, 207, 232, 0.15)'
            }
        },
        overrides: {
            /* ====== 卡片 - 气泡形态 ====== */
            '.dnd-char-card': {
                'box-shadow': '0 10px 40px rgba(244, 114, 182, 0.15), inset 0 0 50px rgba(255, 255, 255, 0.3), 0 0 25px rgba(251, 207, 232, 0.2)',
                'border': '2px solid #F9A8D4',
                'border-radius': '24px',
                'background': 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(253, 242, 248, 0.97) 50%, rgba(252, 231, 243, 0.98) 100%)'
            },
            '.dnd-card-header': {
                'border-bottom': '2px solid #F9A8D4',
                'background': 'linear-gradient(to right, rgba(244, 114, 182, 0.2), rgba(251, 207, 232, 0.15), rgba(249, 168, 212, 0.2))',
                'border-radius': '22px 22px 0 0',
                'padding': '14px 18px',
                'position': 'relative'
            },
            '.dnd-card-body': {
                'background': 'radial-gradient(ellipse at bottom right, rgba(244, 114, 182, 0.08), transparent 70%)',
                'padding': '16px'
            },
            /* ====== 导航栏 - 糖果条纹 ====== */
            '.dnd-nav-sidebar': {
                'background': 'linear-gradient(180deg, #FDF2F8 0%, #FCE7F3 100%)',
                'border-right': '3px solid #F9A8D4',
                'box-shadow': '3px 0 20px rgba(244, 114, 182, 0.1)'
            },
            '.dnd-nav-item': {
                'border-radius': '0 16px 16px 0',
                'margin': '4px 0',
                'padding': '12px 20px',
                'border-left': '4px solid transparent',
                'background': 'rgba(244, 114, 182, 0.05)',
                'transition': 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
            },
            '.dnd-nav-item:hover': {
                'background': 'linear-gradient(90deg, rgba(244, 114, 182, 0.15), rgba(251, 207, 232, 0.1), transparent)',
                'border-left-color': '#F472B6',
                'transform': 'translateX(5px)'
            },
            '.dnd-nav-item.active': {
                'background': 'linear-gradient(90deg, rgba(244, 114, 182, 0.25), rgba(251, 207, 232, 0.15), transparent)',
                'box-shadow': 'inset 4px 0 0 #DB2777, 0 0 25px rgba(244, 114, 182, 0.15)',
                'border-left-color': '#DB2777',
                'transform': 'translateX(8px)'
            },
            /* ====== 进度条 - 气泡糖 ====== */
            '.dnd-bar-container': {
                'background': 'linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(253, 242, 248, 0.7))',
                'border': '2px solid #F9A8D4',
                'border-radius': '12px',
                'height': '14px',
                'box-shadow': 'inset 0 2px 6px rgba(244, 114, 182, 0.1)'
            },
            '.dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #EC4899 0%, #F472B6 30%, #F9A8D4 60%, #FBCFE8 100%)',
                'box-shadow': '0 0 15px rgba(244, 114, 182, 0.4), inset 0 2px 0 rgba(255,255,255,0.4)',
                'border-radius': '10px'
            },
            '.dnd-bar-hp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #DB2777 0%, #EC4899 30%, #F472B6 60%, #EC4899 100%)'
            },
            '.dnd-bar-exp .dnd-bar-fill': {
                'background': 'linear-gradient(90deg, #BE185D 0%, #DB2777 30%, #EC4899 60%, #DB2777 100%)'
            },
            /* ====== 按钮 - 糖果按钮 ====== */
            '.dnd-btn, .dnd-action-btn': {
                'border': '2px solid #F472B6',
                'background': 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
                'box-shadow': 'inset 0 2px 0 rgba(255,255,255,0.5), 0 4px 12px rgba(244, 114, 182, 0.2)',
                'border-radius': '20px',
                'font-family': '"Nunito", sans-serif',
                'position': 'relative',
                'overflow': 'hidden',
                'color': '#9D174D'
            },
            '.dnd-btn:hover, .dnd-action-btn:hover': {
                'background': 'linear-gradient(135deg, #FFFFFF 0%, #FDF2F8 100%)',
                'border-color': '#DB2777',
                'box-shadow': '0 0 20px rgba(244, 114, 182, 0.25), 0 6px 18px rgba(244, 114, 182, 0.15)'
            },
            '.dnd-btn:active, .dnd-action-btn:active': {
                'background': 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)',
                'box-shadow': 'inset 0 3px 8px rgba(244, 114, 182, 0.2)'
            },
            /* ====== 属性行 - 点点糖 ====== */
            '.dnd-stat-row': {
                'background': 'linear-gradient(90deg, rgba(244, 114, 182, 0.1), rgba(251, 207, 232, 0.1), rgba(244, 114, 182, 0.05))',
                'border': '1px solid rgba(249, 168, 212, 0.4)',
                'border-radius': '12px',
                'padding': '8px 12px',
                'margin': '4px 0'
            },
            '.dnd-stat-row:hover': {
                'background': 'linear-gradient(90deg, rgba(244, 114, 182, 0.15), rgba(251, 207, 232, 0.12), rgba(244, 114, 182, 0.08))',
                'transform': 'scale(1.01)'
            },
            /* ====== 标题样式 - 可爱字体 ====== */
            '.dnd-title, .dnd-char-name': {
                'text-shadow': '0 2px 12px rgba(244, 114, 182, 0.3), 0 0 25px rgba(251, 207, 232, 0.2)',
                'font-family': '"Nunito", sans-serif',
                'letter-spacing': '0.03em'
            },
            /* ====== 面板/弹窗 - 糖果盒 ====== */
            '.dnd-panel, .dnd-dialog': {
                'border': '2px solid #F9A8D4',
                'border-radius': '28px',
                'box-shadow': '0 12px 50px rgba(244, 114, 182, 0.15), inset 0 0 60px rgba(255, 255, 255, 0.2)'
            },
            '#dnd-mini-hud': {
                'border': '2px solid #F9A8D4',
                'border-radius': '18px',
                'background': 'linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(253, 242, 248, 0.99))'
            },
            /* ====== 输入框 ====== */
            '.dnd-input, .dnd-select, .dnd-textarea': {
                'background': 'rgba(255, 255, 255, 0.9)',
                'border': '2px solid #F9A8D4',
                'border-radius': '12px',
                'color': '#9D174D'
            },
            '.dnd-input:focus, .dnd-select:focus, .dnd-textarea:focus': {
                'border-color': '#F472B6',
                'box-shadow': '0 0 15px rgba(244, 114, 182, 0.2), inset 0 0 8px rgba(251, 207, 232, 0.15)'
            },
            /* ====== 表格 ====== */
            '.dnd-table th': {
                'background': 'linear-gradient(180deg, #FCE7F3, #FBCFE8)',
                'border-bottom': '2px solid #F472B6',
                'color': '#BE185D'
            },
            '.dnd-table td': {
                'border-bottom': '1px solid rgba(249, 168, 212, 0.4)'
            },
            '.dnd-table tr:hover td': {
                'background': 'rgba(244, 114, 182, 0.1)'
            },
            /* ====== 徽章 ====== */
            '.dnd-badge': {
                'background': 'linear-gradient(135deg, #F472B6, #EC4899)',
                'border': '2px solid #FBCFE8',
                'border-radius': '12px',
                'box-shadow': '0 2px 8px rgba(244, 114, 182, 0.25)'
            }
        },
        customCSS: `
            /* ====== 可爱童话皮肤 - 温馨可爱动画与装饰 ====== */
            
            /* 可爱浮动动画 */
            @keyframes kawaii-float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-3px) rotate(0.5deg); }
                50% { transform: translateY(0) rotate(0deg); }
                75% { transform: translateY(-2px) rotate(-0.5deg); }
            }
            
            /* 星星闪烁 */
            @keyframes sparkle {
                0%, 100% { opacity: 0.5; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
            }
            
            /* 气泡弹跳 */
            @keyframes bubble-bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            /* 糖果光泽流动 */
            @keyframes candy-shimmer {
                0% { left: -100%; }
                50%, 100% { left: 100%; }
            }
            
            /* 彩虹渐变 */
            @keyframes rainbow-shift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            /* 卡片 - 气泡形态 */
            .dnd-char-card {
                position: relative;
                animation: kawaii-float 5s ease-in-out infinite;
            }
            
            /* 外发光边框 - 糖果光晕 */
            .dnd-char-card::before {
                content: "";
                position: absolute;
                top: -4px; left: -4px; right: -4px; bottom: -4px;
                background: linear-gradient(135deg, rgba(244, 114, 182, 0.3) 0%, rgba(251, 207, 232, 0.25) 25%, rgba(236, 72, 153, 0.25) 50%, rgba(244, 114, 182, 0.2) 75%, rgba(251, 207, 232, 0.3) 100%);
                border-radius: 27px;
                pointer-events: none;
                z-index: -1;
                filter: blur(4px);
                animation: bubble-bounce 4s ease-in-out infinite;
            }
            
            /* 星星纹理叠加 */
            .dnd-char-card::after {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: radial-gradient(circle at 20% 20%, rgba(219, 39, 119, 0.08) 1px, transparent 1px),
                            radial-gradient(circle at 80% 40%, rgba(244, 114, 182, 0.06) 1px, transparent 1px),
                            radial-gradient(circle at 40% 70%, rgba(219, 39, 119, 0.08) 1px, transparent 1px),
                            radial-gradient(circle at 70% 80%, rgba(244, 114, 182, 0.06) 1px, transparent 1px);
                background-size: 60px 60px;
                pointer-events: none;
                border-radius: inherit;
                z-index: 0;
            }
            
            /* 卡片头部 - 星星装饰 */
            .dnd-card-header::before {
                content: "✦";
                position: absolute;
                left: 12px; top: 50%;
                transform: translateY(-50%);
                color: #DB2777;
                font-size: 14px;
                animation: sparkle 2s ease-in-out infinite;
            }
            
            .dnd-card-header::after {
                content: "✦";
                position: absolute;
                right: 12px; top: 50%;
                transform: translateY(-50%);
                color: #F472B6;
                font-size: 14px;
                animation: sparkle 2s ease-in-out infinite 0.5s;
            }
            
            /* 导航项 - 星星效果 */
            .dnd-nav-item::before {
                content: "";
                position: absolute;
                left: 0; top: 50%;
                transform: translateY(-50%);
                width: 0; height: 4px;
                background: linear-gradient(90deg, #F472B6, #F9A8D4, #EC4899);
                transition: width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                border-radius: 0 4px 4px 0;
            }
            
            .dnd-nav-item:hover::before {
                width: 25px;
            }
            
            .dnd-nav-item.active::before {
                width: 35px;
                box-shadow: 0 0 12px rgba(244, 114, 182, 0.4);
            }
            
            .dnd-nav-item.active::after {
                content: "★";
                position: absolute;
                right: 12px;
                color: #DB2777;
                font-size: 14px;
                animation: sparkle 1.5s ease-in-out infinite;
            }
            
            /* 按钮 - 糖果光泽效果 */
            .dnd-btn::before,
            .dnd-action-btn::before {
                content: "";
                position: absolute;
                top: 0; left: -100%;
                width: 60%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                transition: left 0.6s ease;
            }
            
            .dnd-btn:hover::before,
            .dnd-action-btn:hover::before {
                left: 120%;
            }
            
            /* 进度条 - 气泡流动效果 */
            .dnd-bar-fill {
                position: relative;
                overflow: hidden;
            }
            
            .dnd-bar-fill::before {
                content: "";
                position: absolute;
                top: 0; left: -60%; width: 60%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                animation: candy-shimmer 2s ease-in-out infinite;
            }
            
            /* 进度条气泡装饰 */
            .dnd-bar-container::after {
                content: "";
                position: absolute;
                top: 2px; left: 2px;
                width: 8px; height: 8px;
                background: radial-gradient(circle, rgba(255,255,255,0.5), transparent);
                border-radius: 50%;
                animation: bubble-bounce 2s ease-in-out infinite;
            }
            
            /* 分隔线 - 点点线 */
            .dnd-divider {
                height: 4px;
                background: repeating-linear-gradient(90deg, #F9A8D4, #F9A8D4 8px, transparent 8px, transparent 16px);
                position: relative;
                margin: 15px 0;
                border-radius: 2px;
            }
            
            .dnd-divider::before {
                content: "★";
                position: absolute;
                left: 50%; top: 50%;
                transform: translate(-50%, -50%);
                background: #FDF2F8;
                padding: 0 12px;
                color: #DB2777;
                font-size: 14px;
            }
            
            /* 面板角落 - 星星装饰 */
            .dnd-panel::before,
            .dnd-dialog::before {
                content: "✦";
                position: absolute;
                top: 10px; left: 12px;
                color: #F472B6;
                font-size: 18px;
                animation: sparkle 3s ease-in-out infinite;
            }
            
            .dnd-panel::after,
            .dnd-dialog::after {
                content: "✦";
                position: absolute;
                bottom: 10px; right: 12px;
                color: #F472B6;
                font-size: 18px;
                animation: sparkle 3s ease-in-out infinite 0.75s;
            }
            
            /* 滚动条 - 糖果风格 */
            .dnd-content-area::-webkit-scrollbar {
                width: 12px;
            }
            
            .dnd-content-area::-webkit-scrollbar-track {
                background: rgba(253, 242, 248, 0.8);
                border-left: 2px solid #F9A8D4;
                border-radius: 6px;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #F472B6, #F9A8D4, #F472B6);
                border-radius: 6px;
                border: 2px solid #FDF2F8;
            }
            
            .dnd-content-area::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, #EC4899, #F472B6, #EC4899);
            }
            
            /* 图标容器 - 糖果徽章 */
            .dnd-icon-circle {
                border-radius: 50%;
                border: 3px solid #F9A8D4;
                background: radial-gradient(circle at 30% 30%, #FCE7F3, #FDF2F8);
                box-shadow: 0 0 18px rgba(244, 114, 182, 0.25), inset 0 0 10px rgba(251, 207, 232, 0.2);
            }
            
            /* 头像框 - 圆润气泡形 */
            .dnd-avatar {
                border-radius: 50%;
                border: 3px solid #F9A8D4;
                box-shadow: 0 0 20px rgba(244, 114, 182, 0.25), 0 0 40px rgba(251, 207, 232, 0.15);
            }
            
            /* 工具提示 */
            .dnd-tooltip {
                background: linear-gradient(135deg, #FFFFFF, #FDF2F8);
                border: 2px solid #F9A8D4;
                border-radius: 14px;
                box-shadow: 0 6px 25px rgba(244, 114, 182, 0.15);
                color: #9D174D;
            }
            
            .dnd-tooltip::before {
                content: "✦";
                position: absolute;
                top: 6px; left: 10px;
                color: #DB2777;
                font-size: 12px;
            }
            
            /* 悬浮弹跳效果 */
            .dnd-char-card:hover {
                animation: kawaii-float 2s ease-in-out infinite, bubble-bounce 1s ease-in-out;
            }
            
            /* 可爱的微动效果 */
            .dnd-btn:hover {
                animation: bubble-bounce 0.5s ease-in-out;
            }
        `,
        background: {
            type: 'particles',
            colors: ['rgba(244, 114, 182, 0.6)', 'rgba(251, 207, 232, 0.5)', 'rgba(236, 72, 153, 0.4)', 'rgba(255, 255, 255, 0.7)'],
            minSize: 2,
            maxSize: 8,
            count: 30,
            speed: 0.06,
            shape: 'circle',
            glow: true
        }
};
