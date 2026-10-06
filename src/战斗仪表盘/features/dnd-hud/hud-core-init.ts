// features/dnd-hud/hud-core-init.ts
// 初始化（DOM 构建/事件/拖拽）（b4 · 自 BasedonST `src/ui/modules/UICore.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createHudCoreInitFragment(deps: any): any {
  return {
    init() {
        deps.logger.info('[UIRenderer] init() called');
        const { $ } = deps.utils.getCore();
        
        // [修复] 热更新支持：如果有旧的实例，先清除
        // 始终尝试清除，不仅仅是检测到 ID 时，以防万一有残留的监听器或变量
        deps.logger.info('[UIRenderer] Performing cleanup...');
            
        // 1. 清除定时器 (检查 window 对象上的引用)
        if (window.DND_HUD_Interval) {
            clearInterval(window.DND_HUD_Interval);
            window.DND_HUD_Interval = null;
        }

        // 2. 清除全局事件 (使用命名空间)
        try {
            $(window).off('resize.dnd');
            $(document).off('keydown.dndHotkeys');
            $(document).off('dblclick.dndAvatar');
            $(document).off('click.dndPos'); // 清除位置设置弹窗的监听器
        } catch (e) { console.warn('Event cleanup error:', e); }

        this.unregisterHelperButtonEvent();

        // 3. 清除 DOM 元素 (更彻底的清除)
        const selectorsToRemove = [
            '#dnd-dashboard-root',
            '#dnd-mini-hud',
            '#dnd-tooltip',
            '#dnd-toggle-btn',
            '#dnd-notification-container',
            '#dnd-dialog-container',
            '.dnd-generic-popup',
            '#dnd-position-dialog',
            '#dnd-scale-style',
            '#dnd-shake-style',
            '#dnd-quick-bar',
            '#dnd-quick-trigger'
        ];
        
        selectorsToRemove.forEach(sel => {
            const $el = $(sel);
            if ($el.length) {
                // 尝试移除原生监听器 (如果是 toggle btn)
                if (sel === '#dnd-toggle-btn' && $el[0]) {
                    $el[0].onclick = null;
                    // 指针事件通常绑定在 DOM 元素上，移除 DOM 元素即可自动清理，
                    // 但如果绑定在 window 上的 pending 事件 (drag 中) 需要注意
                }
                $el.remove();
            }
        });

        // 额外清除可能存在的重复 ID (防止 zombie 元素)
        if ($('#dnd-toggle-btn').length > 0) {
            console.warn('[UIRenderer] Duplicate toggle button detected, removing all...');
            $('[id="dnd-toggle-btn"]').remove();
        }

        const html = `
            <div id="dnd-dashboard-root">
                <div class="dnd-top-bar">
                    <div class="dnd-title">DND Adventure Log</div>
                    <button class="dnd-close-btn" id="dnd-close"><i class="fa-solid fa-times"></i> 关闭面板</button>
                </div>
                <div class="dnd-main-container">
                    <div class="dnd-nav-sidebar">
                        <div class="dnd-nav-item" data-target="create" style="color:#ffdb85;border-left-color:#ffdb85"><i class="fa-solid fa-plus-circle"></i> 创建角色</div>
                        <div class="dnd-nav-item active" data-target="party"><i class="fa-solid fa-users"></i> 冒险队伍</div>
                        <div class="dnd-nav-item" data-target="npcs"><i class="fa-solid fa-address-book"></i> 人物图鉴</div>
                        <div class="dnd-nav-item" data-target="quests"><i class="fa-solid fa-scroll"></i> 任务日志</div>
                        <div class="dnd-nav-item" data-target="inventory"><i class="fa-solid fa-suitcase"></i> 背包物品</div>
                        <!-- <div class="dnd-nav-item" data-target="combat"><i class="fa-solid fa-swords"></i> 战术地图</div> -->
                        <div class="dnd-nav-item" data-target="world"><i class="fa-solid fa-globe"></i> 世界信息</div>
                        <div class="dnd-nav-item" data-target="logs"><i class="fa-solid fa-book"></i> 历史记录</div>
                        <div class="dnd-nav-item" data-target="archives"><i class="fa-solid fa-database"></i> 数据归档</div>
                        <!-- [b12.9] 骰子面板四大功能入口（主面板导航） -->
                        <div class="dnd-nav-item" data-target="acu-changes"><i class="fa-solid fa-code-compare"></i> 数据审核</div>
                        <div class="dnd-nav-item" data-target="acu-mvu"><i class="fa-solid fa-code-branch"></i> 变量管理</div>
                        <div class="dnd-nav-item" data-target="acu-favorites"><i class="fa-solid fa-star"></i> 收藏夹</div>
                        <div class="dnd-nav-item" data-target="acu-global-interactions"><i class="fa-solid fa-hand-pointer"></i> 交互总览</div>
                        <div class="dnd-nav-item" data-target="settings"><i class="fa-solid fa-cog"></i> 设置</div>
                    </div>
                    <div class="dnd-content-area" id="dnd-content">
                        <!-- 内容动态加载 -->
                    </div>
                </div>
                <div class="dnd-modal-overlay" id="dnd-modal-overlay">
                    <div class="dnd-modal" id="dnd-modal-content"></div>
                </div>
            </div>
            
            <!-- 简略版 HUD -->
            <div id="dnd-mini-hud">
                <div class="dnd-hud-header">
                    <!-- Logo (点击切换/展开) -->
                    <div id="dnd-logo-container" title="DND 仪表盘">
                        <span class="dnd-logo-text">D20</span>
                    </div>
                    
                    <div class="dnd-hud-status" id="dnd-hud-status-text">
                        <!-- 动态加载 -->
                    </div>
                    
                    <div style="display:flex;gap:5px;align-items:center;margin-left:10px;">
                        <button class="dnd-hud-expand-btn" id="dnd-hud-theme" title="切换主题">
                            <i class="fa-solid fa-palette"></i>
                        </button>
                    </div>
                </div>
                <div class="dnd-hud-body" id="dnd-hud-body">
                    <!-- 动态加载 -->
                </div>
            </div>

            <!-- 浮窗 Tooltip -->
            <div id="dnd-tooltip"></div>
            
            <div id="dnd-toggle-btn" title="显示 DND 面板">
                <svg viewBox="0 0 542.969 626.967" width="24" height="24" style="fill:currentColor;">
                    <path d="M271.485,0L0,156.742v313.483l271.485,156.742l271.484-156.742V156.742L271.485,0z M278.328,22.626  l221.618,127.952l-221.618-25.032V22.626z M524.976,167.178l-95.739,224.031L284.191,139.981L524.976,167.178z M418.301,399.638  H124.669l146.816-254.293L418.301,399.638z M264.642,22.626v102.92L43.023,150.578L264.642,22.626z M258.779,139.981L113.732,391.21  L17.993,167.178L258.779,139.981z M16.174,197.747l87.942,205.785l-87.942,49.606V197.747z M23.151,464.915l87.801-49.526  l133.02,177.018L23.151,464.915z M126.518,413.323h289.934L271.485,606.238L126.518,413.323z M298.997,592.407l133.021-177.019  l87.8,49.526L298.997,592.407z M526.795,453.138l-87.941-49.605l87.941-205.784V453.138z M200.249,297.943l0.166-1.121  c1.207-8.13,4.862-15.182,10.867-20.963c6.041-5.818,14.042-8.767,23.779-8.767c10.078,0,18.262,2.926,24.325,8.697  c6.08,5.788,9.164,13.233,9.164,22.127c0,7.859-2.729,14.97-8.108,21.134c-4.985,5.711-16.421,13.673-34.899,24.288h42.746v16.342  h-67.887v-17.453l27.728-18.44c8.271-5.514,13.883-10.438,16.682-14.636c2.751-4.126,4.145-7.929,4.145-11.3  c0-4.076-1.309-7.406-4.003-10.18c-2.682-2.763-6.089-4.106-10.413-4.106c-9.492,0-14.805,5.701-16.246,17.429l-0.172,1.4  L200.249,297.943z M312.995,361.044c8.107,0,14.958-2.273,20.362-6.755c5.35-4.437,9.305-10.174,11.755-17.053  c2.42-6.801,3.647-15.591,3.647-26.126c0-6.352-1.303-13.24-3.875-20.471c-2.604-7.323-6.636-13.135-11.983-17.275  c-5.378-4.162-12.033-6.273-19.776-6.273c-10.774,0-19.481,4.482-25.876,13.322c-6.303,8.716-9.499,20.356-9.499,34.596  c0,13.201,3.051,24.257,9.066,32.858C292.929,356.611,301.737,361.044,312.995,361.044z M313.255,281.484  c6.416,0,10.635,2.945,12.903,9.004c2.384,6.373,3.593,13.202,3.593,20.298c0,8.672-0.495,15.544-1.47,20.426  c-0.944,4.714-2.731,8.414-5.313,10.996c-2.553,2.553-5.836,3.794-10.037,3.794c-6.221,0-10.393-2.767-12.757-8.46  c-2.482-5.969-3.741-14.01-3.741-23.896C296.433,292.305,302.093,281.484,313.255,281.484z"/>
                </svg>
            </div>
        `;
        $('body').append(html);

        // 事件绑定
        // [恢复] 悬浮球支持拖拽 + 点击切换
        const $btn = $('#dnd-toggle-btn');
        
        // [DEBUG] 检查悬浮球元素
        deps.logger.debug('🔧 [DEBUG] 悬浮球初始化检查:');
        deps.logger.debug('  - $btn 元素:', $btn.length > 0 ? '存在' : '不存在');
        deps.logger.debug('  - $btn[0]:', $btn[0]);
        deps.logger.debug('  - $btn 位置:', $btn.css('position'), 'top:', $btn.css('top'), 'left:', $btn.css('left'));
        deps.logger.debug('  - $btn z-index:', $btn.css('z-index'));
        deps.logger.debug('  - $btn display:', $btn.css('display'));
        deps.logger.debug('  - $btn pointer-events:', $btn.css('pointer-events'));

        // 恢复保存的位置（从设置中读取）
        deps.dbAdapter.getSetting(DND_CONFIG.STORAGE_KEYS.TOGGLE_POS).then(savedPos => {
            if (savedPos) {
                try {
                    // 尝试多次解析以防双重编码
                    let pos = savedPos;
                    if (typeof pos === 'string') {
                        try { pos = JSON.parse(pos); } catch(e) {}
                    }
                    if (typeof pos === 'string') {
                        try { pos = JSON.parse(pos); } catch(e) {}
                    }

                    if (pos && pos.left) {
                        // [Fix] Ensure we override CSS !important rules
                        const btn = $btn[0];
                        if (btn) {
                            btn.style.setProperty('left', pos.left, 'important');
                            btn.style.setProperty('top', pos.top, 'important');
                            btn.style.setProperty('right', 'auto', 'important');
                            btn.style.setProperty('bottom', 'auto', 'important');
                            // 初始位置恢复后更新 HUD
                            setTimeout(() => this.updateHUDPosition(), 100);
                        }
                        deps.logger.debug('🔧 [DEBUG] 恢复保存的位置:', pos);
                    } else {
                        deps.logger.warn('🔧 [DEBUG] 位置数据无效:', savedPos);
                    }
                } catch(e) {
                    deps.logger.warn('🔧 [DEBUG] 位置恢复失败:', e);
                }
            }
        });

        // 拖拽状态管理
        let isDragging = false;
        let dragStartX = 0, dragStartY = 0;
        let btnStartX = 0, btnStartY = 0;
        const DRAG_THRESHOLD = 5; // 拖拽阈值（像素）
        // [b10d] 长按/双击支持（打开骰子面板 S1桥）
        let longPressTimer: any = null;
        let longPressFired = false;
        let lastTapTime = 0;

        // [优化] 使用原生 Pointer Events API 实现拖拽
        const handlePointerDown = (e) => {
            const btnDom = $btn[0];
            deps.logger.debug('🖱️ [PointerDown] Triggered', { type: e.type, x: e.screenX, y: e.screenY });

            // 视觉反馈：红色高亮
            btnDom.style.borderColor = '#ff0000';
            btnDom.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.8)';

            if (e.button !== 0 && e.pointerType === 'mouse') return;
            
            // 阻止默认行为
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();
            
            isDragging = false;
            // [b10d] 长按启动：600ms → 打开骰子面板（S1桥）
            longPressFired = false;
            if (longPressTimer) clearTimeout(longPressTimer);
            longPressTimer = setTimeout(() => {
                longPressFired = true;
                try { const w: any = window; if (w.__acuToggleDicePanel) w.__acuToggleDicePanel('expand'); } catch (errLp) {}
            }, 600);
            // [关键修改] 使用 screenX/Y 避免 iframe 坐标系问题
            dragStartX = e.screenX;
            dragStartY = e.screenY;
            
            // 获取当前位置 (相对于视口)
            const rect = btnDom.getBoundingClientRect();
            btnStartX = rect.left;
            btnStartY = rect.top;
            
            if (btnDom.setPointerCapture) {
                try {
                    btnDom.setPointerCapture(e.pointerId);
                    deps.logger.debug('🖱️ [PointerDown] Capture set');
                } catch (err) {
                    deps.logger.warn('setPointerCapture failed:', err);
                }
            }
            
            // 绑定到 window
            const win = btnDom.ownerDocument.defaultView || window;
            win.addEventListener('pointermove', handlePointerMove);
            win.addEventListener('pointerup', handlePointerUp);
            win.addEventListener('pointercancel', handlePointerUp);
            win.addEventListener('blur', handlePointerUp);
        };

        const handlePointerMove = (e) => {
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();

            // [关键修改] 使用 screenX/Y 计算位移
            const dx = e.screenX - dragStartX;
            const dy = e.screenY - dragStartY;
            
            // 始终记录一些移动日志以供调试 (节流)
            if (Math.random() < 0.05) {
                deps.logger.debug(`🖱️ [Move] dx:${dx} dy:${dy} screen:${e.screenX},${e.screenY}`);
            }
            
            if (!isDragging && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
                isDragging = true;
                $btn.addClass('is-dragging');
                deps.logger.debug('🚀 [Drag Start] Threshold passed');
            }

            if (isDragging) {
                // [关键修复] 同时处理两种缩放：
                // 1. 应用内 UI 缩放（CSS zoom，通过 this.currentScale）
                // 2. 浏览器缩放（Ctrl+/-，通过 devicePixelRatio）
                // screenX/Y 是物理像素，getBoundingClientRect() 返回 CSS 像素
                // 需要将物理像素位移转换为 CSS 像素，再除以应用缩放
                const uiScale = this.currentScale || 1;
                const browserZoom = window.devicePixelRatio || 1;
                // 综合缩放因子：浏览器缩放 * 应用缩放
                const totalScale = browserZoom * uiScale;
                
                // 计算新位置：起始视觉坐标 + 补偿后的位移
                let newLeft = btnStartX + dx / totalScale;
                let newTop = btnStartY + dy / totalScale;
                
                const btnDom = $btn[0];
                const win = btnDom.ownerDocument.defaultView || window;
                const winW = win.innerWidth;
                const winH = win.innerHeight;
                // 边界计算使用缩放后的按钮尺寸
                const scaledBtnSize = DND_CONFIG.SIZE.TOGGLE_BTN * uiScale;
                
                // 边界限制（确保按钮不会超出视口）
                newLeft = Math.max(5, Math.min(newLeft, winW - scaledBtnSize - 5));
                newTop = Math.max(5, Math.min(newTop, winH - scaledBtnSize - 5));
                
                // [关键修改] 直接操作 DOM 样式，使用 setProperty 覆盖 !important
                btnDom.style.setProperty('left', newLeft + 'px', 'important');
                btnDom.style.setProperty('top', newTop + 'px', 'important');
                btnDom.style.setProperty('right', 'auto', 'important');
                btnDom.style.setProperty('bottom', 'auto', 'important');
                btnDom.style.setProperty('transition', 'none', 'important');
                
                // 实时更新 HUD 位置
                this.updateHUDPosition();
            }
        };


        const handlePointerUp = (e) => {
            console.log('[DND Debug] 🖱️ PointerUp/Cancel/Blur', e.type);
            
            const btnDom = $btn[0];
            const win = btnDom.ownerDocument.defaultView || window;
            
            btnDom.style.borderColor = ''; 
            btnDom.style.boxShadow = '';
            
            win.removeEventListener('pointermove', handlePointerMove);
            win.removeEventListener('pointerup', handlePointerUp);
            win.removeEventListener('pointercancel', handlePointerUp);
            win.removeEventListener('blur', handlePointerUp);
            // [b10d] 清理长按计时
            if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
            if (e.type !== 'pointerup') longPressFired = false;
            
            if (btnDom.releasePointerCapture) {
                try {
                    btnDom.releasePointerCapture(e.pointerId);
                } catch (err) {}
            }
            
            $btn.css('transition', '');
            
            if (isDragging) {
                const rect = btnDom.getBoundingClientRect();
                deps.utils.safeSave(DND_CONFIG.STORAGE_KEYS.TOGGLE_POS, JSON.stringify({
                    left: rect.left + 'px',
                    top: rect.top + 'px'
                }));
                this.updateHUDPosition();
                setTimeout(() => $btn.removeClass('is-dragging'), 50);
            } else if (e.type === 'pointerup') {
                // [b12.4] 连锁点击抑制：为紧随出现的 Mini HUD 设置 400ms 保护窗
                try { this._suppressHudClickUntil = Date.now() + 400; } catch (eS) {}
                // 仅 pointerup 时触发点击（排除 cancel/blur）
                if (longPressFired) {
                    // [b10d] 长按：已打开骰子面板（不再切换 HUD）
                    longPressFired = false;
                } else {
                    const nowTs = Date.now();
                    if (nowTs - lastTapTime < 300) {
                        // [b10d] 双击：抵消本次 HUD 切换 + 打开骰子面板
                        lastTapTime = 0;
                        try { const w: any = window; if (w.__acuToggleDicePanel) w.__acuToggleDicePanel('expand'); } catch (errDt) {}
                        this.toggleDashboard('floating-button');
                    } else {
                        lastTapTime = nowTs;
                        this.toggleDashboard('floating-button');
                    }
                }
            }
            
            isDragging = false;
        };

        // [核心] 绑定 Pointer Events (使用原生事件以避免 jQuery 兼容性问题)
        const btnDom = $btn[0];
        
        // 强制设置防干扰样式
        btnDom.style.touchAction = 'none';
        btnDom.style.userSelect = 'none';
        btnDom.style.webkitUserSelect = 'none';
        
        btnDom.addEventListener('pointerdown', handlePointerDown);
        
        // 额外防止 touchstart 触发滚动/选择 (兼容性)
        btnDom.addEventListener('touchstart', (e) => {
            e.preventDefault(); 
        }, { passive: false });

        // 移除旧的 onclick 绑定
        btnDom.onclick = null;
        
        // 监听窗口调整
        $(window).off('resize.dnd').on('resize.dnd', () => this.updateHUDPosition());

        // [新增] 定时器强制更新位置 (防止样式被覆盖或初始化失败)
        if (window.DND_HUD_Interval) clearInterval(window.DND_HUD_Interval);
        window.DND_HUD_Interval = setInterval(() => this.updateHUDPosition(), 1000);

        // [DEBUG] 检查是否有元素遮挡悬浮球
        setTimeout(() => {
            const btnRect = $btn[0].getBoundingClientRect();
            const centerX = btnRect.left + btnRect.width / 2;
            const centerY = btnRect.top + btnRect.height / 2;
            const elementAtPoint = document.elementFromPoint(centerX, centerY);
            
            deps.logger.debug('🔧 [DEBUG] 遮挡检测:');
            deps.logger.debug('  - 悬浮球中心:', centerX, centerY);
            deps.logger.debug('  - 该位置顶层元素:', elementAtPoint);
            deps.logger.debug('  - 是否是悬浮球本身:', elementAtPoint === $btn[0] || $.contains($btn[0], elementAtPoint));
            
            if (elementAtPoint && elementAtPoint !== $btn[0] && !$.contains($btn[0], elementAtPoint)) {
                deps.logger.error('🔧 [DEBUG] ❌ 悬浮球被其他元素遮挡:', elementAtPoint);
                deps.logger.error('  - 遮挡元素 ID:', elementAtPoint.id);
                deps.logger.error('  - 遮挡元素 class:', elementAtPoint.className);
                deps.logger.error('  - 遮挡元素 z-index:', window.getComputedStyle(elementAtPoint).zIndex);
            }
        }, 1000);

        $('#dnd-close').on('click', () => this.setState('mini'));
        
        // [b12.4] Logo 点击：进入完整主面板（带 400ms 连锁抑制，防与悬浮球点击叠加）
        $('#dnd-logo-container').on('click', (e) => {
            e.stopPropagation();
            if (Date.now() < (this._suppressHudClickUntil || 0)) return;
            const $logo = $('#dnd-logo-container');
            $logo.css('transform', 'scale(0.9)');
            setTimeout(() => $logo.css('transform', ''), 150);
            this.setState('full');
        });
        
        
        // 主题切换按钮 (升级为皮肤切换)
        $('#dnd-hud-theme').on('click', async function(e) {
            e.stopPropagation();
            try {
                // 使用新的 StyleManager 获取可用皮肤列表
                const styles = deps.styleManager.getAvailableStyles();
                const currentStyle = deps.styleManager.getCurrentStyle();
                
                let currentIdx = styles.findIndex(s => s.id === currentStyle.id);
                if (currentIdx === -1) currentIdx = 0;
                
                const nextIdx = (currentIdx + 1) % styles.length;
                const nextStyle = styles[nextIdx];
                
                deps.logger.debug('Switching style from', currentStyle.id, 'to', nextStyle.id);
                
                // 应用新皮肤
                await deps.styleManager.apply(nextStyle.id);
                
                // 视觉反馈
                $(this).attr('title', nextStyle.name);
                
                // HUD 状态栏显示切换提示
                const $status = $('#dnd-hud-status-text');
                const originalHtml = $status.html();
                $status.html(`<span style="color:var(--dnd-text-highlight);">${nextStyle.icon} 皮肤: ${nextStyle.name}</span>`);
                
                // 简单的按钮动画
                const $btn = $(this);
                $btn.css('transform', 'rotate(360deg)');
                setTimeout(() => {
                    $btn.css('transition', 'none');
                    $btn.css('transform', 'rotate(0deg)');
                    setTimeout(() => $btn.css('transition', ''), 50);
                }, 500);

                setTimeout(() => {
                    if ($status.text().includes(nextStyle.name)) $status.html(originalHtml);
                }, 2000);
            } catch (err) {
                deps.logger.error('Style switch failed:', err);
            }
        });

        // Use arrow function for `this` context binding
        const self = this;
        $('.dnd-nav-item').on('click', function() {
            $('.dnd-nav-item').removeClass('active');
            $(this).addClass('active');
            const target = $(this).data('target');
            // 角色创建现在使用内置面板
            // [b12.1] 全局化：renderPanel 属 dnd-panels 域（经全局注册）
            ((window as any).DND_Dashboard_UI || self).renderPanel?.(target);
        });
        
        $('#dnd-modal-overlay').on('click', function(e) {
            if (e.target.id === 'dnd-modal-overlay') $(this).removeClass('active');
        });

        // 初始状态
        this.setState('collapsed');
        
        // [新增] 读取并应用 UI 缩放设置
        deps.dbAdapter.getSetting(DND_CONFIG.STORAGE_KEYS.UI_SCALE).then(savedScale => {
            // 如果没有保存过，默认为 1.0
            const scale = savedScale || DND_CONFIG.UI_SCALE.DEFAULT;
            this.applyUIScale(scale);
        });

        // [新增] 全局快捷键支持
        $(document).on('keydown.dndHotkeys', (e) => {
            // 忽略输入框内的按键
            if ($(e.target).is('input, textarea, [contenteditable="true"]')) return;
            
            const key = e.key;
            const keyCode = e.keyCode;
            
            // ESC - 关闭面板/弹窗
            if (key === 'Escape' || keyCode === 27) {
                // 优先关闭弹窗
                if ($('#dnd-detail-popup-el').hasClass('visible')) {
                    ((window as any).DND_Dashboard_UI || this).hideDetailPopup?.();
                    e.preventDefault();
                    return;
                }
                // 其次关闭角色详情卡
                if ($('#dnd-char-detail-card-el').hasClass('visible')) {
                    ((window as any).DND_Dashboard_UI || this).hideCharacterCard?.();
                    e.preventDefault();
                    return;
                }
                // 最后关闭主面板/HUD
                if (this.state !== 'collapsed') {
                    this.setState('collapsed');
                    e.preventDefault();
                    return;
                }
            }
            
            // 数字键 1-9 - 快速切换到对应角色 (仅在 mini 状态下生效)
            if (this.state === 'mini' && key >= '1' && key <= '9') {
                const idx = parseInt(key) - 1;
                const party = deps.dataManager.getPartyData();
                if (party && party[idx]) {
                    const { window: coreWin } = deps.utils.getCore();
                    ((window as any).DND_Dashboard_UI || this).showCharacterCard?.(party[idx], { clientX: coreWin.innerWidth / 2, clientY: 100 });
                    e.preventDefault();
                    return;
                }
            }
            
            // Tab - 切换 HUD 显示/隐藏 (按住 Alt 时)
            if (e.altKey && (key === 'Tab' || keyCode === 9)) {
                this.toggleDashboard();
                e.preventDefault();
                return;
            }
            
            // D - 快速投骰子 (按住 Alt 时)
            if (e.altKey && (key === 'd' || key === 'D')) {
                const roll = Math.floor(Math.random() * 20) + 1;
                deps.notification.info(`<i class="fa-solid fa-dice-d20"></i> D20: ${roll}`, '快速投骰');
                e.preventDefault();
                return;
            }
        });
        
        // 全局事件委托：头像双击上传
        $(document).off('dblclick.dndAvatar').on('dblclick.dndAvatar', '.dnd-avatar-container', (e) => {
            e.stopPropagation();
            const $target = $(e.currentTarget);
            const charId = $target.data('char-id');
            const charName = $target.attr('title') || $target.find('span').text() || $target.find('.dnd-avatar-initial').text() || '角色';
            
            if (charId) {
                // 验证是否为主角或队友 (只允许修改己方头像)
                const party = deps.dataManager.getPartyData();
                const matchedPartyMember = party && party.find(p => {
                    // 匹配 ID 或 姓名
                    return (p['PC_ID'] == charId) || 
                        (p['CHAR_ID'] == charId) || 
                        (p['姓名'] == charId) || 
                        (p['姓名'] == charName);
                });

                if (matchedPartyMember) {
                    ((window as any).DND_Dashboard_UI || this).showAvatarUploadDialog?.(matchedPartyMember, matchedPartyMember['姓名'] || charName);
                } else {
                    console.log('[DND Dashboard] 仅限修改主角或队友头像');
                    // 可以选择添加一个视觉反馈，比如 shake 动画
                    const $el = $target;
                    $el.css('animation', 'none');
                    setTimeout(() => $el.css('animation', 'dnd-shake 0.3s'), 10);
                    
                    // 添加 shake 动画样式
                    if (!$('#dnd-shake-style').length) {
                        $('head').append(`<style id="dnd-shake-style">@keyframes dnd-shake { 0% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } 100% { transform: translateX(0); } }</style>`);
                    }
                }
            }
        });

        // [新增] 读取并应用隐藏浮动球设置
        void this.applyFloatingBallVisibility();
        
        // [新增] 在隐藏悬浮球模式下延迟重试 Helper 按钮注册
        setTimeout(() => {
            if (this._hideFloatingBall) {
                this.registerHelperButtonEvent({ scheduleRetry: true });
            }
        }, 1000);
    }
  };
}
