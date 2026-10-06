// features/dnd-hud/hud-render.ts
// Mini HUD 主渲染（+位置/拖拽）（b4 · 自 BasedonST `src/ui/modules/UIHUD.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createHudRenderFragment(deps: any): any {
  return {
    async renderHUD() {
        const { $ } = deps.utils.getCore();
        const $hud = $('#dnd-mini-hud');
        const $body = $('#dnd-hud-body');
        const $status = $('#dnd-hud-status-text');
        
        if (!$hud.length) return;
        
        // 仅在 mini 状态下渲染
        if (this.state !== 'mini') return;

        // 获取迷你地图显示设置（提前获取，传递给子渲染函数）
        const showMiniMapSetting = await deps.dbAdapter.getSetting(DND_CONFIG.STORAGE_KEYS.SHOW_MINI_MAP);
        const showMiniMap = showMiniMapSetting !== false && showMiniMapSetting !== 'false'; // 默认开启

        // 获取全局状态
        const global = deps.dataManager.getTable('SYS_GlobalState');
        const gInfo = (global && global[0]) ? global[0] : { '当前场景': '未知', '游戏时间': '', '天气状况': '', '战斗模式': '' };
        const weather = gInfo['天气状况'] || '';
        
        // 检查战斗状态 - 通过全局状态的"战斗模式"字段判断，只有为"战斗中"才触发战斗HUD
        const isCombat = gInfo['战斗模式'] === '战斗中';
        
        // [新增] 检测战斗状态变化并切换预设
        // [b12.2] 防御：预设切换器不可用时跳过（不阻断 HUD 渲染）
        try { deps.presetSwitcher.checkCombatStateChange(isCombat); } catch (e) {}

        // 提取时间 (仅显示 HH:MM 或原始内容)
        const timeStr = gInfo['游戏时间'] && gInfo['游戏时间'].includes(' ') ? gInfo['游戏时间'].split(' ')[1] : gInfo['游戏时间'];
        // 提取天气图标 (使用 SVG 图标)
        const weatherIcon = weather ? deps.getWeatherIcon(weather) : '';

        // [修复] 恢复头部完整显示逻辑 - 优化布局和图标显示
        const statusIcon = isCombat ? '<i class="fa-solid fa-skull"></i>' : '<i class="fa-solid fa-compass"></i>';
        const statusText = isCombat ? '战斗中' : '探索中';
        const statusColor = isCombat ? 'var(--dnd-accent-red)' : 'var(--dnd-accent-green)';
        
        // 构建信息行 (时间 | 天气 | 状态)
        const infoParts = [];
        if (timeStr) infoParts.push(`<span title="游戏时间"><i class="fa-solid fa-clock"></i> ${timeStr}</span>`);
        if (weather || weatherIcon) infoParts.push(`<span title="${weather}"><i class="fa-solid fa-cloud-moon"></i> ${weather}</span>`);
        infoParts.push(`<span style="color:${statusColor}">${statusIcon} ${statusText}</span>`);
        
        $status.html(`
            <div id="dnd-hud-location" class="dnd-location-text dnd-hud-entry" title="${gInfo['当前场景']}">
                ${gInfo['当前场景']}
            </div>
            <div class="dnd-hud-info-row dnd-hud-entry" style="animation-delay: 0.1s;">
                ${infoParts.join('<span style="color:#444;margin:0 6px;">|</span>')}
            </div>
        `);
        
        // 添加展开按钮 (如果尚未存在)
        if ($('#dnd-hud-toggle-bar').length === 0) {
            const $toggleBar = $(`<div id="dnd-hud-toggle-bar" style="height:12px;background:var(--dnd-bg-tertiary);border-bottom:1px solid var(--dnd-border-inner);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--dnd-text-dim);font-size:8px;transition:all 0.2s;" title="打开表格编辑器（骰子）">▼</div>`);
            
            $toggleBar.hover(
                function() { $(this).css({color: 'var(--dnd-text-highlight)', background: 'var(--dnd-selected-bg)'}); },
                function() { $(this).css({color: 'var(--dnd-text-dim)', background: 'var(--dnd-bg-tertiary)'}); }
            );
            
            const self = this;
            // [b12.15] 表格编辑收口：▼ → 打开骰子侧表格编辑器（B 唯一编辑）
            $toggleBar.on('click', function() {
                try {
                    const acuUI: any = (window as any).__acuUI;
                    if (acuUI && typeof acuUI.openDatabaseVisualizerInterface === 'function') {
                        acuUI.openDatabaseVisualizerInterface();
                    } else {
                        try { deps.notification.warning('表格编辑器不可用：骰子桥未就绪'); } catch (e2) {}
                    }
                } catch (err) { deps.logger.warn('[DND] 打开骰子表格编辑器失败', err); }
            });
            
            // 插入到 Header 和 Body 之间
            $('#dnd-mini-hud .dnd-hud-header').after($toggleBar);
        }

        // 清空主体
        $body.empty();

        // [美化] 添加/移除战斗模式特殊样式类
        if (isCombat) {
            $hud.addClass('dnd-combat-mode');
            this.renderCombatHUD($body, showMiniMap);
        } else {
            $hud.removeClass('dnd-combat-mode');
            this.renderExploreHUD($body, showMiniMap);
        }
        
        // [美化] 为主体内容添加交错入场动画
        $body.addClass('dnd-stagger-enter');

        // [优化] 渲染常驻横向队伍栏 (替代原有的折叠列表)
        this.renderPartyBar($body);

        // [新增] 渲染主角法术位 (迷你版)
        this.renderMiniSpellSlots($body);

        // [优化] 渲染快捷物品栏 (替代原有的下拉列表)
        ((window as any).DND_Dashboard_UI || this).renderQuickInventory?.($body);

        // 渲染常驻资源栏
        this.renderFooter($body);

        // [新增] 渲染行动队列面板 (如果有待执行行动)
        if (this._actionQueue && this._actionQueue.length > 0) {
            const $queuePanel = $(`
                <div style="margin-top:10px;background:var(--dnd-bg-tertiary);border:1px solid var(--dnd-border-gold);border-radius:4px;overflow:hidden;">
                    <div style="background:var(--dnd-bg-secondary);padding:5px 10px;font-weight:bold;color:var(--dnd-text-highlight);display:flex;justify-content:space-between;align-items:center;">
                        <span><i class="fa-solid fa-hourglass-half"></i> 待执行行动 (${this._actionQueue.length})</span>
                        <div style="display:flex;gap:5px;">
                            <button class="dnd-clickable dnd-queue-act" data-dnd-act="commit" style="background:var(--dnd-accent-green);border:none;color:var(--dnd-btn-text);padding:2px 8px;border-radius:3px;cursor:pointer;"><i class="fa-solid fa-check"></i> 执行</button>
                            <button class="dnd-clickable dnd-queue-act" data-dnd-act="clear" style="background:var(--dnd-accent-red);border:none;color:var(--dnd-btn-text);padding:2px 8px;border-radius:3px;cursor:pointer;"><i class="fa-solid fa-times"></i> 清空</button>
                        </div>
                    </div>
                    <div style="padding:5px 10px;font-size:12px;color:var(--dnd-text-dim);">
                        ${this._actionQueue.map((a, i) => `<div style="margin-bottom:2px;">${i+1}. ${a.desc}</div>`).join('')}
                    </div>
                </div>
            `);
            $body.append($queuePanel);
            // [b12.6] 队列按钮：脚本绑定（替代 inline onclick）
            $queuePanel.find('.dnd-queue-act').off('click.dndQueue').on('click.dndQueue', function() {
                const g: any = ((window as any).DND_Dashboard_UI || {});
                const act = $(this).data('dnd-act');
                if (act === 'commit') g.commitActions?.();
                else g.clearActions?.();
            });
        }

        // [新增] 渲染快捷栏 (Quick Bar) - 附着在 HUD 右侧
        if ($('#dnd-quick-bar').length === 0) {
            const $bar = $(`<div id="dnd-quick-bar" class="dnd-quick-bar"></div>`);
            const $trigger = $(`<div id="dnd-quick-trigger" class="dnd-quick-trigger"><i class="fa-solid fa-chevron-right"></i></div>`);
            
            const $hud = $('#dnd-mini-hud');
            $hud.append($bar).append($trigger);
            // [b12.6] 快捷栏触发器：脚本绑定（替代 inline onclick）
            $trigger.off('click.dndQuick').on('click.dndQuick', () => ((window as any).DND_Dashboard_UI || this).toggleQuickBar?.());
        }
        ((window as any).DND_Dashboard_UI || this).renderQuickBar?.();
        
        // 每次渲染后更新位置
        this.updateHUDPosition();
        
        // [新增] 初始化独立拖拽功能（隐藏球模式下使用）
        this.initIndependentDrag();
    },

        // [新增] 更新 HUD 位置使其跟随悬浮球
    updateHUDPosition() {
        const { $, window: coreWin } = deps.utils.getCore(); // 获取正确的 window 对象
        // [修复] 使用 coreWin 获取尺寸，确保与 DOM 元素所在的文档一致 (兼容 iframe)
        const winW = coreWin.innerWidth || $(coreWin).width();
        
        // 移动端：完全交给 CSS 处理 (居中靠上)，JS 不干预
        if (winW <= 768) {
            const $hud = $('#dnd-mini-hud');
            if ($hud.length) {
                $hud[0].style.removeProperty('top');
                $hud[0].style.removeProperty('left');
            }
            return;
        }

        const $btn = $('#dnd-toggle-btn');
        const $hud = $('#dnd-mini-hud');
        
        if (!$hud.length) return;
        
        // [新增] 检查是否隐藏球模式
        const hideFloatingBall = $btn.hasClass('dnd-force-hidden') || 
            (deps.hudCore._hideFloatingBall === true);
        
        if (hideFloatingBall) {
            // 隐藏球模式：使用独立位置
            $hud.addClass('dnd-independent-mode');

            const hudRect = $hud[0].getBoundingClientRect();
            const hudW = hudRect.width || 360;
            const savedPos = deps.hudCore._miniHudPos;

            const top = savedPos?.top || '20px';
            const left = savedPos?.left || `${Math.max(20, winW - hudW - 20)}px`;

            $hud[0].style.setProperty('top', top, 'important');
            $hud[0].style.setProperty('left', left, 'important');
            return;
        }
        
        // 正常模式：跟随浮动球
        $hud.removeClass('dnd-independent-mode');
        
        if (!$btn.length) return;
        
        const btnRect = $btn[0].getBoundingClientRect();
        const hudRect = $hud[0].getBoundingClientRect();
        // [修复] 使用 coreWin 获取尺寸
        const winH = coreWin.innerHeight || $(coreWin).height();
        const margin = 10;
        
        // Log for debugging
        deps.logger.debug('[HUD Pos] Btn:', btnRect.left, btnRect.top, 'HUD:', hudRect.width, hudRect.height, 'Win:', winW, winH);

        // 即使尺寸看起来是0 (可能刚初始化)，也尝试根据默认宽度计算
        const hudW = hudRect.width || 360;
        const hudH = hudRect.height || 400;

        let top, left;
        
        // 垂直定位策略
        if (btnRect.bottom + margin + hudH <= winH - margin) {
            top = btnRect.bottom + margin;
        } else if (btnRect.top - margin - hudH >= margin) {
            top = btnRect.top - margin - hudH;
        } else {
            top = (winH - btnRect.bottom > btnRect.top) ? (btnRect.bottom + margin) : (btnRect.top - margin - hudH);
        }
        
        // 水平定位策略: 默认左对齐按钮
        left = btnRect.left;
        
        // 边界约束
        top = Math.max(margin, Math.min(top, winH - hudH - margin));
        
        // 如果左对齐导致右侧溢出 (left + width > winW)
        if (left + hudW > winW - margin) {
            // 尝试右对齐按钮右侧 (left = btnRight - hudW)
            left = btnRect.right - hudW;
        }
        // 再次检查左边界
        left = Math.max(margin, Math.min(left, winW - hudW - margin));
        
        deps.logger.debug('[HUD Pos] Calculated:', left, top);

        $hud[0].style.setProperty('top', top + 'px', 'important');
        $hud[0].style.setProperty('left', left + 'px', 'important');
    },

    // [新增] 初始化 Mini HUD 独立拖拽功能
    initIndependentDrag() {
        const { $, window: coreWin } = deps.utils.getCore();
        const $hud = $('#dnd-mini-hud');
        const $header = $hud.find('.dnd-hud-header');
        
        if (!$hud.length || !$header.length) return;
        
        // 检查是否已初始化
        if ($hud.data('dnd-independent-drag-init')) return;
        $hud.data('dnd-independent-drag-init', true);
        
        let isDragging = false;
        let dragStartX = 0, dragStartY = 0;
        let hudStartX = 0, hudStartY = 0;
        const DRAG_THRESHOLD = 5;
        
        const handlePointerDown = (e) => {
            // 只在独立模式下响应
            if (!deps.hudCore._hideFloatingBall) return;
            if (e.button !== 0 && e.pointerType === 'mouse') return;
            if ($(e.target).closest('#dnd-logo-container, #dnd-hud-theme, #dnd-hud-toggle-bar, button').length) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            isDragging = false;
            dragStartX = e.screenX;
            dragStartY = e.screenY;
            
            const rect = $hud[0].getBoundingClientRect();
            hudStartX = rect.left;
            hudStartY = rect.top;
            
            if ($hud[0].setPointerCapture) {
                try { $hud[0].setPointerCapture(e.pointerId); } catch(err) {}
            }
            
            const win = $hud[0].ownerDocument.defaultView || window;
            win.addEventListener('pointermove', handlePointerMove);
            win.addEventListener('pointerup', handlePointerUp);
            win.addEventListener('pointercancel', handlePointerUp);
        };
        
        const handlePointerMove = (e) => {
            if (!deps.hudCore._hideFloatingBall) return;
            
            e.preventDefault();
            
            const dx = e.screenX - dragStartX;
            const dy = e.screenY - dragStartY;
            
            if (!isDragging && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
                isDragging = true;
                $hud.addClass('is-dragging');
            }
            
            if (isDragging) {
                const uiScale = deps.hudCore.currentScale || 1;
                const browserZoom = window.devicePixelRatio || 1;
                const totalScale = browserZoom * uiScale;
                
                let newLeft = hudStartX + dx / totalScale;
                let newTop = hudStartY + dy / totalScale;
                
                const win = $hud[0].ownerDocument.defaultView || window;
                const winW = win.innerWidth;
                const winH = win.innerHeight;
                const hudRect = $hud[0].getBoundingClientRect();
                const hudW = hudRect.width || 360;
                const hudH = hudRect.height || 400;
                
                // 边界限制
                newLeft = Math.max(5, Math.min(newLeft, winW - hudW - 5));
                newTop = Math.max(5, Math.min(newTop, winH - hudH - 5));
                
                $hud[0].style.setProperty('left', newLeft + 'px', 'important');
                $hud[0].style.setProperty('top', newTop + 'px', 'important');
            }
        };
        
        const handlePointerUp = (e) => {
            const win = $hud[0].ownerDocument.defaultView || window;
            win.removeEventListener('pointermove', handlePointerMove);
            win.removeEventListener('pointerup', handlePointerUp);
            win.removeEventListener('pointercancel', handlePointerUp);
            
            if ($hud[0].releasePointerCapture) {
                try { $hud[0].releasePointerCapture(e.pointerId); } catch(err) {}
            }
            
            if (isDragging) {
                // 保存位置
                const rect = $hud[0].getBoundingClientRect();
                const nextPos = {
                    left: rect.left + 'px',
                    top: rect.top + 'px'
                };

                deps.hudCore._miniHudPos = nextPos;
                deps.utils.safeSave(DND_CONFIG.STORAGE_KEYS.MINI_HUD_POS, JSON.stringify(nextPos));
                setTimeout(() => $hud.removeClass('is-dragging'), 50);
            }
            
            isDragging = false;
        };
        
        // 在 header 上绑定拖拽事件
        $header[0].addEventListener('pointerdown', handlePointerDown);
        
        deps.logger.info('[UIHUD] Mini HUD 独立拖拽已初始化');
    },

    // [新增] 显示位置设置对话框
    showPositionDialog() {
        const { $, window: coreWin } = deps.utils.getCore();
        $('#dnd-position-dialog').remove();
        
        const $btn = $('#dnd-toggle-btn');
        // [修复] 使用 coreWin
        const winW = coreWin.innerWidth || $(coreWin).width();
        const winH = coreWin.innerHeight || $(coreWin).height();
        const btnSize = 40;
        const margin = 10;
        
        const positions = [
            { pos: 'tl', label: '↖ 左上', left: margin, top: margin },
            { pos: 'tc', label: '↑ 顶部', left: (winW - btnSize) / 2, top: margin },
            { pos: 'tr', label: '↗ 右上', left: winW - btnSize - margin, top: margin },
            { pos: 'ml', label: '← 左侧', left: margin, top: (winH - btnSize) / 2 },
            { pos: 'mc', label: '● 中央', left: (winW - btnSize) / 2, top: (winH - btnSize) / 2 },
            { pos: 'mr', label: '→ 右侧', left: winW - btnSize - margin, top: (winH - btnSize) / 2 },
            { pos: 'bl', label: '↙ 左下', left: margin, top: winH - btnSize - margin },
            { pos: 'bc', label: '↓ 底部', left: (winW - btnSize) / 2, top: winH - btnSize - margin },
            { pos: 'br', label: '↘ 右下', left: winW - btnSize - margin, top: winH - btnSize - margin }
        ];
        
        let btnsHtml = positions.map(p => 
            `<button class="dnd-pos-btn" data-left="${p.left}" data-top="${p.top}" style="padding:8px;background:var(--dnd-bg-tertiary);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);border-radius:4px;cursor:pointer;">${p.label}</button>`
        ).join('');
        
        const html = `
            <div id="dnd-position-dialog" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--dnd-bg-popup);border:1px solid var(--dnd-border-gold);border-radius:8px;padding:15px;z-index:2147483650;box-shadow:var(--dnd-shadow-lg);min-width:280px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:15px;border-bottom:1px solid var(--dnd-border-subtle);padding-bottom:8px;">
                    <span style="color:var(--dnd-text-highlight);font-weight:bold;">${deps.icons.LOCATION} 悬浮球位置</span>
                    <span id="dnd-pos-close" style="cursor:pointer;color:var(--dnd-text-dim);"><i class="fa-solid fa-times"></i></span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;margin-bottom:10px;">${btnsHtml}</div>
                <div style="font-size:11px;color:var(--dnd-text-dim);text-align:center;">单击=切换HUD | 双击/长按=此设置</div>
            </div>
            <div id="dnd-pos-backdrop" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:var(--dnd-bg-main);opacity:0.85;z-index:2147483646;"></div>
        `;
        
        $('body').append(html);
        
        $('#dnd-pos-close, #dnd-pos-backdrop').on('click', () => $('#dnd-position-dialog, #dnd-pos-backdrop').remove());
        
        // [修复] 使用事件委托和更稳健的数据获取
        $(document).off('click.dndPos').on('click.dndPos', '.dnd-pos-btn', function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            // 重新获取按钮元素以防丢失引用
            const $targetBtn = $('#dnd-toggle-btn');
            
            // 使用 attr 确保获取到原始字符串
            const left = $(this).attr('data-left');
            const top = $(this).attr('data-top');
            
            console.log('[DND Dashboard] Setting position to:', left, top);
            
            if ($targetBtn.length && left && top) {
                $targetBtn.css({
                    left: left + 'px',
                    top: top + 'px',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'none' // 清除可能影响位置的 transform
                });
                
                deps.utils.safeSave(DND_CONFIG.STORAGE_KEYS.TOGGLE_POS, JSON.stringify({ left: left + 'px', top: top + 'px' }));
            } else {
                console.error('[DND Dashboard] Position update failed:', { btnLen: $targetBtn.length, left, top });
            }
            
            $('#dnd-position-dialog, #dnd-pos-backdrop').remove();
        });
        
        // 辅助样式效果
        $(document).on('mouseover', '.dnd-pos-btn', function() {
            $(this).css({ 'border-color': 'var(--dnd-border-gold)', 'color': 'var(--dnd-text-highlight)' });
        }).on('mouseout', '.dnd-pos-btn', function() {
            $(this).css({ 'border-color': 'var(--dnd-border-subtle)', 'color': 'var(--dnd-text-main)' });
        });
    },

  };
}
