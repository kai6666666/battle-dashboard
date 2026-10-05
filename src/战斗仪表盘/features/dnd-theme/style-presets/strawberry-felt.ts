// features/dnd-theme/style-presets/strawberry-felt.ts
// 风格包：strawberry-felt（b11a · 自 BasedonST `src/config/StylePresets.js` 拆分移植）
export const strawberryFelt = {
        meta: {
            id: 'strawberry-felt',
            name: '草莓毛毡',
            icon: '<i class="fa-solid fa-heart"></i>',
            description: '温暖的草莓红毛毡风格，带有手工缝线和软糯质感',
            author: 'System'
        },
        colors: {
            '--dnd-bg-main': '#2a1a1a',
            '--dnd-bg-panel-start': '#3a2828',
            '--dnd-bg-panel-end': '#2a1a1a',
            '--dnd-text-main': '#f5e6e0',
            '--dnd-text-header': '#ffcdd2',
            '--dnd-text-highlight': '#ffb4ab',
            '--dnd-text-dim': '#b08888',
            '--dnd-accent': '#e85a71',
            '--dnd-accent-hover': '#f48fb1',
            '--dnd-border-gold': '#d4a373',
            '--dnd-border-inner': '#8b6f6f',
            '--dnd-bg-card-start': 'rgba(58, 40, 40, 0.95)',
            '--dnd-bg-card-end': 'rgba(42, 26, 26, 0.97)',
            '--dnd-btn-primary': '#c06c6c',
            '--dnd-btn-primary-hover': '#e07a7a',
            '--dnd-btn-text': '#fff0f0'
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
            '--dnd-font-serif': '"Quicksand", "Nunito", "Segoe UI", sans-serif',
            '--dnd-font-size-base': '0.95rem',
            '--dnd-letter-spacing': '0.02em'
        },
        animations: {
            '--dnd-transition-fast': '0.2s ease-out',
            '--dnd-transition-normal': '0.35s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        interactiveStates: {
            hover: { brightness: 1.1, scale: 1.02, lift: '-4px', shadow: '0 10px 30px rgba(232, 90, 113, 0.25)', borderColor: '#d4a373', glow: 'drop-shadow(0 0 6px rgba(232, 90, 113, 0.4))', transition: '0.35s ease-out' },
            cardHover: { transform: 'translateY(-6px) scale(1.015)', shadow: '0 18px 45px rgba(42, 26, 26, 0.55)', borderColor: '#ffb4ab' },
            buttonHover: { brightness: 1.18, transform: 'translateY(-2px) scale(1.03)', shadow: '0 6px 20px rgba(232, 90, 113, 0.4)' },
            active: { scale: 0.97, brightness: 0.92, transform: 'translateY(1px) scale(0.97)', shadow: '0 2px 8px rgba(42, 26, 26, 0.4)' },
            buttonActive: { transform: 'translateY(2px) scale(0.98)', shadow: '0 1px 4px rgba(42, 26, 26, 0.3)' },
            selected: { background: 'linear-gradient(90deg, rgba(232, 90, 113, 0.3), transparent)', borderColor: '#ffb4ab', borderWidth: '2px', glow: '0 0 18px rgba(232, 90, 113, 0.35)', textColor: '#ffb4ab' },
            navActive: { background: 'linear-gradient(90deg, rgba(232, 90, 113, 0.35), transparent)', border: '3px solid #d4a373', indicator: '#e85a71' },
            focus: { borderColor: '#e85a71', shadow: '0 0 0 3px rgba(232, 90, 113, 0.25)', outline: 'none' },
            disabled: { opacity: 0.45, cursor: 'not-allowed', filter: 'grayscale(0.5) brightness(0.7)' },
            iconHover: { glow: 'drop-shadow(0 0 8px rgba(232, 90, 113, 0.7))', scale: 1.15 },
            inputFocus: { border: '#e85a71', shadow: '0 0 12px rgba(232, 90, 113, 0.35)' }
        },
        overrides: {
            '.dnd-char-card': { 'border-radius': '20px', 'border': '2px solid #8b6f6f', 'box-shadow': '0 8px 30px rgba(42, 26, 26, 0.5), inset 0 0 40px rgba(232, 90, 113, 0.08)', 'background': 'linear-gradient(135deg, rgba(58, 40, 40, 0.95), rgba(42, 26, 26, 0.98))' },
            '.dnd-card-header': { 'border-bottom': '2px dashed #8b6f6f', 'background': 'linear-gradient(to right, rgba(232, 90, 113, 0.15), rgba(212, 163, 115, 0.1))', 'border-radius': '18px 18px 0 0', 'padding': '14px 18px', 'position': 'relative' },
            '.dnd-card-body': { 'background': 'radial-gradient(ellipse at bottom right, rgba(232, 90, 113, 0.06), transparent 70%)', 'padding': '16px' },
            '.dnd-nav-sidebar': { 'background': 'linear-gradient(180deg, #3a2828, #2a1a1a)', 'border-right': '2px solid #8b6f6f' },
            '.dnd-nav-item': { 'border-radius': '0 16px 16px 0', 'margin': '4px 0', 'padding': '12px 20px', 'border-left': '4px solid transparent', 'background': 'rgba(232, 90, 113, 0.03)', 'transition': 'all 0.35s ease-out' },
            '.dnd-nav-item:hover': { 'background': 'linear-gradient(90deg, rgba(232, 90, 113, 0.18), transparent)', 'border-left-color': '#d4a373', 'padding-left': '24px' },
            '.dnd-nav-item.active': { 'background': 'linear-gradient(90deg, rgba(232, 90, 113, 0.28), transparent)', 'border-left-color': '#e85a71', 'box-shadow': 'inset 4px 0 0 #ffb4ab' },
            '.dnd-bar-container': { 'background': 'linear-gradient(180deg, rgba(42, 26, 26, 0.8), rgba(58, 40, 40, 0.6))', 'border': '1px solid #8b6f6f', 'border-radius': '12px', 'height': '10px' },
            '.dnd-bar-fill': { 'background': 'linear-gradient(90deg, #c06c6c, #e85a71 40%, #f48fb1 70%, #e85a71)', 'box-shadow': '0 0 10px rgba(232, 90, 113, 0.5)', 'border-radius': '10px' },
            '.dnd-bar-hp .dnd-bar-fill': { 'background': 'linear-gradient(90deg, #a05050, #c06c6c 40%, #e07a7a 70%, #c06c6c)' },
            '.dnd-bar-exp .dnd-bar-fill': { 'background': 'linear-gradient(90deg, #b08060, #d4a373 40%, #e6c9a8 70%, #d4a373)' },
            '.dnd-btn, .dnd-action-btn': { 'border': '2px solid #8b6f6f', 'background': 'linear-gradient(135deg, #4a3535, #3a2828)', 'box-shadow': '0 3px 8px rgba(42, 26, 26, 0.4)', 'border-radius': '16px', 'font-family': '"Quicksand", sans-serif', 'position': 'relative', 'overflow': 'hidden' },
            '.dnd-btn:hover, .dnd-action-btn:hover': { 'background': 'linear-gradient(135deg, #5a4040, #4a3535)', 'border-color': '#d4a373', 'box-shadow': '0 0 15px rgba(232, 90, 113, 0.3)' },
            '.dnd-btn:active, .dnd-action-btn:active': { 'background': 'linear-gradient(135deg, #3a2828, #2a1a1a)', 'box-shadow': 'inset 0 2px 4px rgba(42, 26, 26, 0.4)' },
            '.dnd-stat-row': { 'background': 'linear-gradient(90deg, rgba(232, 90, 113, 0.1), rgba(139, 111, 111, 0.15))', 'border': '1px solid rgba(139, 111, 111, 0.35)', 'border-radius': '10px', 'padding': '8px 12px', 'margin': '4px 0' },
            '.dnd-title, .dnd-char-name': { 'text-shadow': '0 2px 10px rgba(232, 90, 113, 0.35)', 'font-family': '"Quicksand", sans-serif', 'letter-spacing': '0.04em' },
            '.dnd-panel, .dnd-dialog': { 'border': '2px solid #8b6f6f', 'border-radius': '24px', 'box-shadow': '0 12px 45px rgba(42, 26, 26, 0.6)' },
            '#dnd-mini-hud': { 'border': '2px solid #8b6f6f', 'border-radius': '18px', 'background': 'linear-gradient(180deg, rgba(58, 40, 40, 0.98), rgba(42, 26, 26, 0.99))' },
            '.dnd-input, .dnd-select, .dnd-textarea': { 'background': 'rgba(42, 26, 26, 0.8)', 'border': '2px solid #8b6f6f', 'border-radius': '12px', 'color': '#f5e6e0' },
            '.dnd-input:focus, .dnd-select:focus, .dnd-textarea:focus': { 'border-color': '#e85a71', 'box-shadow': '0 0 12px rgba(232, 90, 113, 0.4)' },
            '.dnd-table th': { 'background': 'linear-gradient(180deg, #4a3535, #3a2828)', 'border-bottom': '2px solid #e85a71', 'color': '#ffcdd2' },
            '.dnd-table td': { 'border-bottom': '1px solid rgba(139, 111, 111, 0.35)' },
            '.dnd-table tr:hover td': { 'background': 'rgba(232, 90, 113, 0.1)' },
            '.dnd-badge': { 'background': 'linear-gradient(135deg, #8b6f6f, #6b5050)', 'border': '2px solid #d4a373', 'border-radius': '10px' }
        },
        customCSS: `
            @keyframes felt-pulse {
                0%, 100% { box-shadow: 0 8px 30px rgba(42, 26, 26, 0.5), inset 0 0 40px rgba(232, 90, 113, 0.08); filter: brightness(1); }
                50% { box-shadow: 0 8px 35px rgba(42, 26, 26, 0.55), inset 0 0 50px rgba(232, 90, 113, 0.12); filter: brightness(1.02); }
            }
            @keyframes stitch-glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
            @keyframes soft-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
            .dnd-char-card { position: relative; animation: felt-pulse 5s ease-in-out infinite; }
            .dnd-char-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='felt'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23felt)' opacity='0.06'/%3E%3C/svg%3E"); pointer-events: none; border-radius: inherit; z-index: 0; }
            .dnd-char-card::after { content: ""; position: absolute; top: 8px; left: 8px; right: 8px; bottom: 8px; border: 1px dashed rgba(212, 163, 115, 0.35); border-radius: 14px; pointer-events: none; z-index: 1; animation: stitch-glow 3s ease-in-out infinite; }
            .dnd-card-header::before { content: ""; position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 10px; height: 10px; background: #e85a71; border-radius: 50%; box-shadow: 0 0 8px rgba(232, 90, 113, 0.5); }
            .dnd-card-header::after { content: ""; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 10px; height: 10px; background: #d4a373; border-radius: 50%; opacity: 0.6; }
            .dnd-nav-item::before { content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 0; height: 3px; background: linear-gradient(90deg, #e85a71, #d4a373); transition: width 0.35s ease-out; border-radius: 0 3px 3px 0; }
            .dnd-nav-item:hover::before { width: 20px; }
            .dnd-nav-item.active::before { width: 28px; box-shadow: 0 0 10px rgba(232, 90, 113, 0.4); }
            .dnd-nav-item.active::after { content: ""; position: absolute; right: 12px; width: 8px; height: 8px; background: #e85a71; border-radius: 50%; box-shadow: 0 0 8px rgba(232, 90, 113, 0.5); animation: soft-float 2s ease-in-out infinite; }
            .dnd-btn::before, .dnd-action-btn::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 1px dashed rgba(212, 163, 115, 0.25); border-radius: 14px; pointer-events: none; opacity: 0; transition: opacity 0.3s; }
            .dnd-btn:hover::before, .dnd-action-btn:hover::before { opacity: 1; }
            .dnd-bar-fill::before { content: ""; position: absolute; top: 0; left: -50%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: stitch-glow 2.5s ease-in-out infinite; }
            .dnd-divider { height: 0; border-top: 2px dashed #8b6f6f; position: relative; margin: 12px 0; }
            .dnd-divider::before { content: ""; position: absolute; left: 50%; top: -4px; transform: translateX(-50%); width: 12px; height: 12px; background: #e85a71; border-radius: 50%; box-shadow: 0 0 8px rgba(232, 90, 113, 0.5); }
            .dnd-panel::before, .dnd-dialog::before { content: ""; position: absolute; top: 10px; left: 12px; width: 12px; height: 12px; background: #e85a71; border-radius: 50%; box-shadow: 0 0 8px rgba(232, 90, 113, 0.4); }
            .dnd-panel::after, .dnd-dialog::after { content: ""; position: absolute; bottom: 10px; right: 12px; width: 12px; height: 12px; background: #d4a373; border-radius: 50%; opacity: 0.6; }
            .dnd-icon-circle { border-radius: 50%; border: 2px solid #d4a373; background: radial-gradient(circle at 30% 30%, #4a3535, #2a1a1a); box-shadow: 0 0 15px rgba(232, 90, 113, 0.3); }
            .dnd-avatar { border-radius: 50%; border: 3px solid #d4a373; box-shadow: 0 0 18px rgba(232, 90, 113, 0.3); }
            .dnd-tooltip { background: linear-gradient(135deg, #3a2828, #2a1a1a); border: 2px solid #d4a373; border-radius: 14px; }
            .dnd-char-card:hover { box-shadow: 0 12px 40px rgba(42, 26, 26, 0.6), inset 0 0 50px rgba(232, 90, 113, 0.1), 0 0 30px rgba(212, 163, 115, 0.25); }
        `,
        background: { type: 'particles', colors: ['rgba(232, 90, 113, 0.6)', 'rgba(212, 163, 115, 0.5)', 'rgba(255, 180, 171, 0.4)'], minSize: 2, maxSize: 7, count: 25, speed: 0.04, shape: 'circle', glow: true }
};
