// features/dnd-map/map-ui-zoom.ts
// 地图缩放/拖拽（缩放状态 + Pointer 事件）（b8 · 自 BasedonST `src/ui/modules/UIMap.js` 拆分移植）
import { DND_CONFIG } from '../dnd-core';

export function createMapUiZoomFragment(deps: any): any {
  return {
    _mapZoom: {
        scale: 1.0,
        panX: 0,
        panY: 0,
        isPanning: false,
        lastTouchDist: 0
    },

    // [新增] 绑定地图缩放事件 (增强版：支持 Pointer Events 拖拽平移)
    bindMapZoom($container, $innerMap) {
        const { $ } = deps.utils.getCore();
        const self = this; // [修复] 在函数开头定义 self，确保所有内部函数可以访问
        const state = this._mapZoom;
        const containerEl = $container[0]; // 获取原生 DOM 元素
        
        // 设置禁止选择，防止拖拽时选中文字
        $container.css({
            'user-select': 'none',
            'touch-action': 'none' // 关键：禁用浏览器默认触摸行为
        });
        $innerMap.css('user-select', 'none');

        // 读取保存的缩放比例
        deps.dbAdapter.getSetting(DND_CONFIG.STORAGE_KEYS.MAP_ZOOM).then(saved => {
            if (saved) {
                state.scale = parseFloat(saved) || 1.0;
            } else {
                state.scale = 1.0;
            }
            applyTransform();
        });
        
        // 应用变换
        const applyTransform = () => {
            $innerMap.css({
                transform: `scale(${state.scale}) translate(${state.panX}px, ${state.panY}px)`,
                transformOrigin: 'center center',
                transition: state.isPanning ? 'none' : 'transform 0.2s ease-out'
            });
            updateIndicator();
        };
        
        // Expose transform function for external calls
        $container.data('applyTransform', applyTransform);
        
        // 缩放指示器
        if ($container.find('.dnd-map-zoom-indicator').length === 0) {
            $container.append(`<div class="dnd-map-zoom-indicator" style="position:absolute;top:2px;right:4px;font-size:8px;color:var(--dnd-text-dim);background:var(--dnd-bg-secondary);padding:1px 3px;border-radius:2px;pointer-events:none;z-index:31;">100%</div>`);
        }
        const updateIndicator = () => {
            $container.find('.dnd-map-zoom-indicator').text(`${Math.round(state.scale * 100)}%`);
        };

        // --- Pointer Events 交互 (支持鼠标和触摸) ---
        let startX = 0, startY = 0;
        let initialPanX = 0, initialPanY = 0;
        let initialDist = 0;
        let initialScale = 1;
        let pointers = new Map(); // 用于多点触控追踪
        let dragDisabled = false; // [修复] 用于禁用拖拽，让 click 事件正常触发

        const handlePointerDown = (e) => {
            // 忽略右键
            if (e.button === 2) return;
            
            const isMiddleButton = e.button === 1; // 识别中键/滚轮按下
            const isLeftButton = e.button === 0;   // 识别左键按下

            // 检查点击目标
            const clickTarget = document.elementFromPoint(e.clientX, e.clientY);
            const $clickTarget = $(clickTarget);
            const isOnToken = $clickTarget.closest('.dnd-minimap-token').length > 0;
            const isTargeting = self._targetingMode && self._targetingMode.active;
            
            // 逻辑：只有当【左键】点击在【Token上】或【处于瞄准模式】时，才禁用拖拽以执行点击/交互。
            // 如果是中键，或者是非交互区的左键，均会跳过此判断，继续执行下方的平移代码。
            if (isLeftButton && (isOnToken || isTargeting)) {
                dragDisabled = true;
                console.log('[MapZoom] 左键交互优先，禁用平移');
                return; // 不调用 preventDefault，让原生 click/targeting 逻辑触发
            }
            
            dragDisabled = false;
            e.preventDefault();
            e.stopPropagation(); // 阻止冒泡，防止触发上层点击
            
            // 记录 Pointer
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            
            if (containerEl.setPointerCapture) {
                try { containerEl.setPointerCapture(e.pointerId); } catch(err){}
            }

            if (pointers.size === 1) {
                // 单指/鼠标：开始平移
                state.isPanning = true;
                startX = e.clientX;
                startY = e.clientY;
                initialPanX = state.panX;
                initialPanY = state.panY;
                $container.css('cursor', 'grabbing');
            } else if (pointers.size === 2) {
                // 双指：开始缩放
                state.isPanning = false; // 切换到缩放模式
                const pts = Array.from(pointers.values());
                const dx = pts[0].x - pts[1].x;
                const dy = pts[0].y - pts[1].y;
                initialDist = Math.hypot(dx, dy);
                initialScale = state.scale;
            }
        };

        const handlePointerMove = (e) => {
            // [修复] 如果拖拽被禁用，跳过处理
            if (dragDisabled || !pointers.has(e.pointerId)) return;
            
            e.preventDefault();
            // 更新 pointer 位置
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

            if (pointers.size === 1 && state.isPanning) {
                // 平移处理
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                // 跟手移动：位移 / 当前缩放比例
                state.panX = initialPanX + dx / state.scale;
                state.panY = initialPanY + dy / state.scale;
                
                applyTransform();
            } else if (pointers.size === 2) {
                // 缩放处理
                const pts = Array.from(pointers.values());
                const dx = pts[0].x - pts[1].x;
                const dy = pts[0].y - pts[1].y;
                const dist = Math.hypot(dx, dy);
                
                if (initialDist > 0) {
                    const scaleFactor = dist / initialDist;
                    state.scale = Math.max(DND_CONFIG.MAP_ZOOM.MIN, Math.min(DND_CONFIG.MAP_ZOOM.MAX, initialScale * scaleFactor));
                    applyTransform();
                }
            }
        };

        const handlePointerUp = (e) => {
            // [修复] 如果拖拽被禁用，重置状态并跳过
            if (dragDisabled) {
                dragDisabled = false;
                return;
            }
            
            pointers.delete(e.pointerId);
            
            if (containerEl.releasePointerCapture) {
                try { containerEl.releasePointerCapture(e.pointerId); } catch(err){}
            }

            if (pointers.size === 0) {
                state.isPanning = false;
                $container.css('cursor', '');
                // 保存缩放比例
                deps.utils.safeSave(DND_CONFIG.STORAGE_KEYS.MAP_ZOOM, state.scale);
            } else if (pointers.size === 1) {
                // 如果抬起一根手指，剩下的手指重置为平移起始点
                const pt = pointers.values().next().value;
                state.isPanning = true;
                startX = pt.x;
                startY = pt.y;
                initialPanX = state.panX;
                initialPanY = state.panY;
            }
        };

        // 移除旧的 jQuery 事件绑定，改用原生 Pointer Events
        $container.off('mousedown mousemove mouseup touchstart touchmove touchend');
        
        // 绑定原生事件
        containerEl.addEventListener('pointerdown', handlePointerDown);
        containerEl.addEventListener('pointermove', handlePointerMove);
        containerEl.addEventListener('pointerup', handlePointerUp);
        containerEl.addEventListener('pointercancel', handlePointerUp);
        containerEl.addEventListener('pointerleave', handlePointerUp);

        // --- 滚轮缩放 ---
        containerEl.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const delta = e.deltaY > 0 ? -DND_CONFIG.MAP_ZOOM.STEP : DND_CONFIG.MAP_ZOOM.STEP;
            state.scale = Math.max(DND_CONFIG.MAP_ZOOM.MIN, Math.min(DND_CONFIG.MAP_ZOOM.MAX, state.scale + delta));
            
            applyTransform();
            // Debounce save
            if (self._zoomSaveTimer) clearTimeout(self._zoomSaveTimer);
            self._zoomSaveTimer = setTimeout(() => deps.utils.safeSave(DND_CONFIG.STORAGE_KEYS.MAP_ZOOM, state.scale), 500);
        }, { passive: false });
        
        // 双击重置
        let lastTap = 0;
        $container.on('click', (e) => {
            const now = Date.now();
            if (now - lastTap < 300) {
                state.scale = DND_CONFIG.MAP_ZOOM.DEFAULT;
                state.panX = 0;
                state.panY = 0;
                applyTransform();
                deps.utils.safeSave(DND_CONFIG.STORAGE_KEYS.MAP_ZOOM, state.scale);
            }
            lastTap = now;
        });
        
        // 初始化
        applyTransform();
    },

  };
}
