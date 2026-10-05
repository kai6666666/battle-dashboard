// features/dnd-theme/style-presets/peach-craft.ts
// 风格包：peach-craft（b11a · 自 BasedonST `src/config/StylePresets.js` 拆分移植）
export const peachCraft = {
        meta: {
            id: 'peach-craft',
            name: '桃粉手作',
            icon: '<i class="fa-solid fa-gem"></i>',
            description: '棉麻布艺风格的蜜桃粉主题，带有编织纹理和温暖质感',
            author: 'System'
        },
        colors: {
            '--dnd-bg-main': '#2d1f1a',
            '--dnd-bg-panel-start': '#3d2a22',
            '--dnd-bg-panel-end': '#2d1f1a',
            '--dnd-text-main': '#fff0e6',
            '--dnd-text-header': '#ffe4d6',
            '--dnd-text-highlight': '#ffab91',
            '--dnd-text-dim': '#b89a8a',
            '--dnd-accent': '#ff8a65',
            '--dnd-accent-hover': '#ffab91',
            '--dnd-border-gold': '#d7a87a',
            '--dnd-border-inner': '#8a7060',
            '--dnd-bg-card-start': 'rgba(61, 42, 34, 0.95)',
            '--dnd-bg-card-end': 'rgba(45, 31, 26, 0.97)',
            '--dnd-btn-primary': '#d4836a',
            '--dnd-btn-primary-hover': '#e89b82',
            '--dnd-btn-text': '#fff8f0'
        },
        morphology: {
            border: { style: 'solid', width: '2px', outerStyle: 'none' },
            corners: { style: 'rounded', clipPath: 'none' },
            card: { shape: 'rectangle', decoration: 'simple' },
            effects: { texture: 'fabric', innerGlow: 'subtle', borderGlow: 'subtle', overlay: 'gradient' },
            layout: { density: 'spacious' },
            decorations: { dividers: 'dashed', corners: 'none' },
            buttons: { style: 'filled', shape: 'pill' },
            progressBars: { shape: 'rounded', style: 'solid' }
        },
        typography: {
            '--dnd-font-serif': '"Nunito Sans", "Segoe UI", sans-serif',
            '--dnd-font-size-base': '0.95rem',
            '--dnd-letter-spacing': '0.02em'
        },
        animations: {
            '--dnd-transition-fast': '0.2s ease-out',
            '--dnd-transition-normal': '0.35s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        interactiveStates: {
            hover: { brightness: 1.1, scale: 1.02, lift: '-4px', shadow: '0 10px 30px rgba(255, 138, 101, 0.25)', borderColor: '#d7a87a', glow: 'drop-shadow(0 0 6px rgba(255, 138, 101, 0.4))', transition: '0.35s ease-out' },
            cardHover: { transform: 'translateY(-6px) scale(1.015)', shadow: '0 18px 45px rgba(45, 31, 26, 0.55)', borderColor: '#ffab91' },
            buttonHover: { brightness: 1.18, transform: 'translateY(-2px) scale(1.03)', shadow: '0 6px 20px rgba(255, 138, 101, 0.4)' },
            active: { scale: 0.97, brightness: 0.92, transform: 'translateY(1px) scale(0.97)', shadow: '0 2px 8px rgba(45, 31, 26, 0.4)' },
            buttonActive: { transform: 'translateY(2px) scale(0.98)', shadow: '0 1px 4px rgba(45, 31, 26, 0.3)' },
            selected: { background: 'linear-gradient(90deg, rgba(255, 138, 101, 0.3), transparent)', borderColor: '#ffab91', borderWidth: '2px', glow: '0 0 18px rgba(255, 138, 101, 0.35)', textColor: '#ffab91' },
            navActive: { background: 'linear-gradient(90deg, rgba(255, 138, 101, 0.35), transparent)', border: '3px solid #d7a87a', indicator: '#ff8a65' },
            focus: { borderColor: '#ff8a65', shadow: '0 0 0 3px rgba(255, 138, 101, 0.25)', outline: 'none' },
            disabled: { opacity: 0.45, cursor: 'not-allowed', filter: 'grayscale(0.5) brightness(0.7)' },
            iconHover: { glow: 'drop-shadow(0 0 8px rgba(255, 138, 101, 0.7))', scale: 1.15 },
            inputFocus: { border: '#ff8a65', shadow: '0 0 12px rgba(255, 138, 101, 0.35)' }
        },
        overrides: {
            '.dnd-char-card': { 'border-radius': '18px', 'border': '2px solid #8a7060', 'box-shadow': '0 8px 30px rgba(45, 31, 26, 0.5), inset 0 0 40px rgba(255, 138, 101, 0.08)', 'background': 'linear-gradient(135deg, rgba(61, 42, 34, 0.95), rgba(45, 31, 26, 0.98))' },
            '.dnd-card-header': { 'border-bottom': '2px solid #8a7060', 'background': 'linear-gradient(to right, rgba(255, 138, 101, 0.12), rgba(215, 168, 122, 0.1))', 'border-radius': '16px 16px 0 0', 'padding': '14px 18px', 'position': 'relative' },
            '.dnd-card-body': { 'background': 'radial-gradient(ellipse at bottom right, rgba(255, 138, 101, 0.06), transparent 70%)', 'padding': '16px' },
            '.dnd-nav-sidebar': { 'background': 'linear-gradient(180deg, #3d2a22, #2d1f1a)', 'border-right': '2px solid #8a7060' },
            '.dnd-nav-item': { 'border-radius': '0 14px 14px 0', 'margin': '4px 0', 'padding': '12px 20px', 'border-left': '4px solid transparent', 'background': 'rgba(255, 138, 101, 0.03)', 'transition': 'all 0.35s ease-out' },
            '.dnd-nav-item:hover': { 'background': 'linear-gradient(90deg, rgba(255, 138, 101, 0.15), transparent)', 'border-left-color': '#d7a87a', 'padding-left': '24px' },
            '.dnd-nav-item.active': { 'background': 'linear-gradient(90deg, rgba(255, 138, 101, 0.25), transparent)', 'border-left-color': '#ff8a65', 'box-shadow': 'inset 4px 0 0 #ffab91' },
            '.dnd-bar-container': { 'background': 'linear-gradient(180deg, rgba(45, 31, 26, 0.8), rgba(61, 42, 34, 0.6))', 'border': '1px solid #8a7060', 'border-radius': '10px', 'height': '10px' },
            '.dnd-bar-fill': { 'background': 'linear-gradient(90deg, #d4836a, #ff8a65 40%, #ffab91 70%, #ff8a65)', 'box-shadow': '0 0 10px rgba(255, 138, 101, 0.5)', 'border-radius': '8px' },
            '.dnd-bar-hp .dnd-bar-fill': { 'background': 'linear-gradient(90deg, #b06050, #d4836a 40%, #e89b82 70%, #d4836a)' },
            '.dnd-bar-exp .dnd-bar-fill': { 'background': 'linear-gradient(90deg, #a07050, #d7a87a 40%, #e8c8a8 70%, #d7a87a)' },
            '.dnd-btn, .dnd-action-btn': { 'border': '2px solid #8a7060', 'background': 'linear-gradient(135deg, #4a3530, #3d2a22)', 'box-shadow': '0 3px 8px rgba(45, 31, 26, 0.4)', 'border-radius': '14px', 'font-family': '"Nunito Sans", sans-serif', 'position': 'relative', 'overflow': 'hidden' },
            '.dnd-btn:hover, .dnd-action-btn:hover': { 'background': 'linear-gradient(135deg, #5a4538, #4a3530)', 'border-color': '#d7a87a', 'box-shadow': '0 0 15px rgba(255, 138, 101, 0.3)' },
            '.dnd-btn:active, .dnd-action-btn:active': { 'background': 'linear-gradient(135deg, #3d2a22, #2d1f1a)', 'box-shadow': 'inset 0 2px 4px rgba(45, 31, 26, 0.4)' },
            '.dnd-stat-row': { 'background': 'linear-gradient(90deg, rgba(255, 138, 101, 0.1), rgba(138, 112, 96, 0.15))', 'border': '1px solid rgba(138, 112, 96, 0.35)', 'border-radius': '10px', 'padding': '8px 12px', 'margin': '4px 0' },
            '.dnd-title, .dnd-char-name': { 'text-shadow': '0 2px 10px rgba(255, 138, 101, 0.35)', 'font-family': '"Nunito Sans", sans-serif', 'letter-spacing': '0.04em' },
            '.dnd-panel, .dnd-dialog': { 'border': '2px solid #8a7060', 'border-radius': '22px', 'box-shadow': '0 12px 45px rgba(45, 31, 26, 0.6)' },
            '#dnd-mini-hud': { 'border': '2px solid #8a7060', 'border-radius': '16px', 'background': 'linear-gradient(180deg, rgba(61, 42, 34, 0.98), rgba(45, 31, 26, 0.99))' },
            '.dnd-input, .dnd-select, .dnd-textarea': { 'background': 'rgba(45, 31, 26, 0.8)', 'border': '2px solid #8a7060', 'border-radius': '10px', 'color': '#fff0e6' },
            '.dnd-input:focus, .dnd-select:focus, .dnd-textarea:focus': { 'border-color': '#ff8a65', 'box-shadow': '0 0 12px rgba(255, 138, 101, 0.4)' },
            '.dnd-table th': { 'background': 'linear-gradient(180deg, #4a3530, #3d2a22)', 'border-bottom': '2px solid #ff8a65', 'color': '#ffe4d6' },
            '.dnd-table td': { 'border-bottom': '1px solid rgba(138, 112, 96, 0.35)' },
            '.dnd-table tr:hover td': { 'background': 'rgba(255, 138, 101, 0.1)' },
            '.dnd-badge': { 'background': 'linear-gradient(135deg, #8a7060, #6a5545)', 'border': '2px solid #d7a87a', 'border-radius': '10px' }
        },
        customCSS: `
            @keyframes linen-wave {
                0%, 100% { box-shadow: 0 8px 30px rgba(45, 31, 26, 0.5), inset 0 0 40px rgba(255, 138, 101, 0.08); filter: brightness(1); }
                50% { box-shadow: 0 8px 35px rgba(45, 31, 26, 0.55), inset 0 0 50px rgba(255, 138, 101, 0.1); filter: brightness(1.02); }
            }
            @keyframes weave-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
            @keyframes soft-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
            .dnd-char-card { position: relative; animation: linen-wave 5s ease-in-out infinite; }
            .dnd-char-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(215, 168, 122, 0.03) 2px, rgba(215, 168, 122, 0.03) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(215, 168, 122, 0.03) 2px, rgba(215, 168, 122, 0.03) 4px); pointer-events: none; border-radius: inherit; z-index: 0; }
            .dnd-char-card::after { content: ""; position: absolute; top: 6px; left: 6px; right: 6px; bottom: 6px; border: 1px solid rgba(215, 168, 122, 0.2); border-radius: 14px; pointer-events: none; z-index: 1; }
            .dnd-card-header::before { content: ""; position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 12px; height: 14px; background: #ff8a65; border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%; box-shadow: 0 0 8px rgba(255, 138, 101, 0.5); }
            .dnd-card-header::after { content: ""; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 12px; height: 14px; background: #d7a87a; border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%; opacity: 0.6; }
            .dnd-nav-item::before { content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 0; height: 3px; background: repeating-linear-gradient(90deg, #ff8a65, #ff8a65 4px, #d7a87a 4px, #d7a87a 8px); transition: width 0.35s ease-out; border-radius: 0 3px 3px 0; }
            .dnd-nav-item:hover::before { width: 22px; }
            .dnd-nav-item.active::before { width: 30px; box-shadow: 0 0 10px rgba(255, 138, 101, 0.4); }
            .dnd-nav-item.active::after { content: ""; position: absolute; right: 12px; width: 10px; height: 12px; background: #ff8a65; border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%; box-shadow: 0 0 8px rgba(255, 138, 101, 0.5); animation: soft-bob 2s ease-in-out infinite; }
            .dnd-btn::before, .dnd-action-btn::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(215, 168, 122, 0.1) 2px, rgba(215, 168, 122, 0.1) 4px); border-radius: 12px; pointer-events: none; opacity: 0; transition: opacity 0.3s; }
            .dnd-btn:hover::before, .dnd-action-btn:hover::before { opacity: 1; }
            .dnd-bar-fill::before { content: ""; position: absolute; top: 0; left: -50%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: weave-shimmer 3s ease-in-out infinite; }
            .dnd-divider { height: 3px; background: repeating-linear-gradient(90deg, #8a7060, #8a7060 6px, transparent 6px, transparent 12px); position: relative; margin: 12px 0; }
            .dnd-divider::before { content: ""; position: absolute; left: 50%; top: -4px; transform: translateX(-50%); width: 14px; height: 14px; background: #ff8a65; border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%; box-shadow: 0 0 8px rgba(255, 138, 101, 0.5); }
            .dnd-panel::before, .dnd-dialog::before { content: ""; position: absolute; top: 10px; left: 12px; width: 14px; height: 16px; background: #ff8a65; border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%; box-shadow: 0 0 8px rgba(255, 138, 101, 0.4); }
            .dnd-panel::after, .dnd-dialog::after { content: ""; position: absolute; bottom: 10px; right: 12px; width: 14px; height: 16px; background: #d7a87a; border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%; opacity: 0.6; }
            .dnd-icon-circle { border-radius: 50%; border: 2px solid #d7a87a; background: radial-gradient(circle at 30% 30%, #4a3530, #2d1f1a); box-shadow: 0 0 15px rgba(255, 138, 101, 0.3); }
            .dnd-avatar { border-radius: 50%; border: 3px solid #d7a87a; box-shadow: 0 0 18px rgba(255, 138, 101, 0.3); }
            .dnd-tooltip { background: linear-gradient(135deg, #3d2a22, #2d1f1a); border: 2px solid #d7a87a; border-radius: 14px; }
        `,
        background: { type: 'particles', colors: ['rgba(255, 138, 101, 0.6)', 'rgba(215, 168, 122, 0.5)', 'rgba(255, 171, 145, 0.4)'], minSize: 2, maxSize: 7, count: 25, speed: 0.04, shape: 'circle', glow: true }
};
