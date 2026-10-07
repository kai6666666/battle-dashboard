// features/dnd-hud/hud-render.ts
// Mini HUD 主渲染（+位置/拖拽）（b4 · 自 BasedonST `src/ui/modules/UIHUD.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';
import { applyDndHeaderTidy } from './hud-header-tidy';

// [b13.2.32] DND 内联样式表（per-doc 注入用）
export const __DND_CSS_V9 = '.dnd-acu-view-inline .acu-fav-wrapper{max-height:none !important;height:auto !important;overflow:visible !important;}' + '.dnd-acu-view-inline .acu-fav-panel-content,.dnd-acu-view-inline .acu-changes-content{max-height:52vh !important;height:auto !important;overflow-y:auto !important;overflow-x:hidden !important;-webkit-overflow-scrolling:touch !important;touch-action:pan-y !important;}' + '.dnd-acu-table-view .acu-search-wrapper,.dnd-acu-view-inline .acu-search-wrapper{order:9999 !important;flex:0 1 auto !important;width:44% !important;max-width:44% !important;min-width:110px !important;margin-left:auto !important;margin-top:4px !important;box-sizing:border-box !important;}' + '.dnd-acu-table-view .acu-header-actions,.dnd-acu-view-inline .acu-header-actions{flex-wrap:wrap !important;row-gap:6px !important;justify-content:flex-end !important;max-width:100% !important;min-width:0 !important;}' + '.dnd-acu-table-view .acu-panel-header,.dnd-acu-view-inline .acu-panel-header{max-width:100% !important;box-sizing:border-box !important;}' + '.dnd-acu-table-view .acu-search-wrapper .acu-search-input,.dnd-acu-view-inline .acu-search-wrapper .acu-search-input{max-width:100% !important;box-sizing:border-box !important;}' + '.dnd-acu-table-view .acu-panel-control-set,.dnd-acu-view-inline .acu-panel-control-set{display:flex !important;align-items:center !important;gap:4px !important;}' + '.dnd-acu-view-inline{-webkit-overflow-scrolling:touch !important;touch-action:pan-y !important;}' + '.dnd-acu-table-view .acu-height-drag-handle,.dnd-acu-view-inline .acu-height-drag-handle{touch-action:none !important;user-select:none !important;-webkit-user-select:none !important;}' + '.dnd-btn-dozed{pointer-events:none !important;opacity:.3 !important;}' + '.dnd-acu-view-inline .acu-fav-panel-content{-webkit-overflow-scrolling:touch !important;touch-action:pan-y !important;}' + '.dnd-acu-table-view .acu-card-body.view-grid,.dnd-acu-view-inline .acu-card-body.view-grid{display:grid !important;grid-template-columns:1fr 1fr !important;gap:8px !important;padding:10px !important;}' + '.dnd-acu-table-view .acu-card-body.view-grid .acu-card-row,.dnd-acu-view-inline .acu-card-body.view-grid .acu-card-row{display:flex;height:auto !important;min-height:fit-content;border:1px solid var(--acu-border);border-radius:6px;padding:5px 7px;flex-direction:column !important;align-items:flex-start !important;background:rgba(0,0,0,.02);box-sizing:border-box;}' + '.dnd-acu-table-view .acu-card-body.view-grid .acu-card-row.acu-grid-span-full,.dnd-acu-view-inline .acu-card-body.view-grid .acu-card-row.acu-grid-span-full{grid-column:1/-1;}' + '.dnd-acu-table-view .acu-card-body.view-grid .acu-card-label,.dnd-acu-view-inline .acu-card-body.view-grid .acu-card-label{width:100% !important;font-size:.85em;opacity:.8;margin-bottom:2px;}' + '.dnd-acu-table-view .acu-card-body.view-grid .acu-card-value,.dnd-acu-view-inline .acu-card-body.view-grid .acu-card-value{width:100% !important;}';

export function createHudRenderFragment(deps: any): any {
  return {
    async renderHUD() {
        const { $ } = deps.utils.getCore();
        const $hud = $('#dnd-mini-hud');
        const $body = $('#dnd-hud-body');
        const $status = $('#dnd-hud-status-text');
        
        if (!$hud.length) return;
        
        // [b13.2.7] 版本标识（诊断用）+ 提前安装层级守护（不依赖打开表格）
        try { console.info('[DND]融合版构建 v0.0.96-b13.5 | z-guard=' + (!!(window as any).__dndAcuZGuardX)); } catch (e) {}
        try {
            if (!(window as any).__dndAcuZGuardX) {
                (window as any).__dndAcuZGuardX = true;
                const boostEl = (el: any) => {
                    try {
                        const c = String(el.className || '');
                        if (c.indexOf('dnd-z-lowered') >= 0) return; // [b13.2.14] 弹窗期间被主动降级的元素不再提升
                        if (c.indexOf('acu-menu-backdrop') >= 0) el.style.setProperty('z-index', '2147483646', 'important');
                        else if (c.indexOf('overlay') >= 0 || c.indexOf('acu-cell-menu') >= 0) el.style.setProperty('z-index', '2147483647', 'important');
                        // [b13.2.15→b13.2.17] 移到父节点末尾（一次性+标记，防 MutationObserver 循环）
                        try { const _p = el.parentNode; if (_p && _p.appendChild && !el.getAttribute('data-dnd-tail-done')) { el.setAttribute('data-dnd-tail-done', '1'); if (_p.lastElementChild !== el) _p.appendChild(el); } } catch (e) {}
                    } catch (e) {}
                };
                const sweep = () => {
                    try {
                        const doc: any = document;
                        // [b13.2.15] 多文档扫描（脚本 doc + parent 链）：编辑弹窗可能在 coreWin 等其他文档
                        const _docsZ: any[] = [];
                        try { _docsZ.push(document); } catch (e) {}
                        try {
                            let _wz: any = window; let _ggz = 0;
                            while (_wz && _wz.parent && _wz.parent !== _wz && _ggz++ < 6) { _wz = _wz.parent; try { if (_wz.document) _docsZ.push(_wz.document); } catch (e) {} }
                        } catch (e) {}
                        for (let _dz = 0; _dz < _docsZ.length; _dz++) {
                            const _dzz: any = _docsZ[_dz];
                            try {
                                const _list = _dzz.querySelectorAll('[class*="overlay"][class*="acu-"], .acu-cell-menu, .acu-menu-backdrop');
                                for (let i = 0; i < _list.length; i++) boostEl(_list[i]);
                                const _bds = _dzz.querySelectorAll('.acu-menu-backdrop');
                                if (_bds.length > 0 && _dzz.querySelectorAll('.acu-cell-menu').length === 0) {
                                    for (let i = 0; i < _bds.length; i++) { try { _bds[i].remove(); } catch (e) {} }
                                }
                            } catch (e) {}
                        }
                        const tst = doc.querySelectorAll('#toast-container, .toast');
                        for (let i = 0; i < tst.length; i++) { try { tst[i].style.setProperty('z-index', '2147483647', 'important'); } catch (e) {} }
                    } catch (e) {}
                };
                const obs = new MutationObserver((muts: any[]) => {
                    let hit = false;
                    for (let mi = 0; mi < muts.length && !hit; mi++) {
                        const added = muts[mi].addedNodes;
                        if (!added) continue;
                        for (let i = 0; i < added.length; i++) {
                            const n: any = added[i];
                            if (!n || n.nodeType !== 1) continue;
                            try { const _c = String(n.className || ''); if (_c.indexOf('acu-') >= 0 || _c.indexOf('toast') >= 0) { hit = true; break; } } catch (e) {}
                        }
                    }
                    if (hit && !(window as any).__dndSweepT) { (window as any).__dndSweepT = setTimeout(function() { (window as any).__dndSweepT = null; sweep(); }, 120); }
                });
                try { obs.observe(document.documentElement || document.body, { childList: true, subtree: true }); } catch (e) {}
                sweep();
            }
        } catch (e) {}
        
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
            const $toggleBar = $(`<div id="dnd-hud-toggle-bar" style="height:12px;background:var(--dnd-bg-tertiary);border-bottom:1px solid var(--dnd-border-inner);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--dnd-text-dim);font-size:8px;transition:all 0.2s;" title="打开表格管理（骰子面板）">▼</div>`);
            
            $toggleBar.hover(
                function() { $(this).css({color: 'var(--dnd-text-highlight)', background: 'var(--dnd-selected-bg)'}); },
                function() { $(this).css({color: 'var(--dnd-text-dim)', background: 'var(--dnd-bg-tertiary)'}); }
            );
            
            const self = this;
            // [b12.17] 表格管理镜像：▼ 展开 → 内嵌骰子导航盘镜像（表格入口总览）
            $toggleBar.on('click', async function() {
                const $hudBody = $('#dnd-hud-body');
                let $tm = $('#dnd-table-manager-container');
                if ($tm.length === 0) {
                    $tm = $('<div id="dnd-table-manager-container" style="display:none;border-bottom:1px solid var(--dnd-border-gold);"></div>');
                    $tm.insertBefore($hudBody);
                }
                if ($tm.is(':visible')) {
                    $tm.slideUp(200);
                    $(this).text('▼').attr('title', '展开表格管理');
                } else {
                    $tm.slideDown(200);
                    $(this).text('▲').attr('title', '收起表格管理');
                    try { await (self as any).renderTableNavMirror($tm); } catch (e) {}
                }
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

    // [b12.17] 表格管理镜像：内嵌骰子导航盘（表格入口总览）——点击经骰子面板中转
    async renderTableNavMirror($container) {
        const { $ } = deps.utils.getCore();
        const g: any = (window as any).__acuUI;
        // [b13.2.3] 强力层级守护（冗余保障）：骰子弹层（overlay/菜单）自动提升 + backdrop 逃逸清理
        try {
            if (!(window as any).__dndAcuZGuardX) {
                (window as any).__dndAcuZGuardX = true;
                const boostEl = (el: any) => {
                    try {
                        const c = String(el.className || '');
                        if (c.indexOf('dnd-z-lowered') >= 0) return; // [b13.2.14] 弹窗期间被主动降级的元素不再提升
                        if (c.indexOf('acu-menu-backdrop') >= 0) el.style.setProperty('z-index', '2147483646', 'important');
                        else if (c.indexOf('overlay') >= 0 || c.indexOf('acu-cell-menu') >= 0) el.style.setProperty('z-index', '2147483647', 'important');
                        // [b13.2.15→b13.2.17] 移到父节点末尾（一次性+标记，防 MutationObserver 循环）
                        try { const _p = el.parentNode; if (_p && _p.appendChild && !el.getAttribute('data-dnd-tail-done')) { el.setAttribute('data-dnd-tail-done', '1'); if (_p.lastElementChild !== el) _p.appendChild(el); } } catch (e) {}
                    } catch (e) {}
                };
                const sweep = () => {
                    try {
                        const doc: any = document;
                        // [b13.2.15] 多文档扫描（脚本 doc + parent 链）：编辑弹窗可能在 coreWin 等其他文档
                        const _docsZ: any[] = [];
                        try { _docsZ.push(document); } catch (e) {}
                        try {
                            let _wz: any = window; let _ggz = 0;
                            while (_wz && _wz.parent && _wz.parent !== _wz && _ggz++ < 6) { _wz = _wz.parent; try { if (_wz.document) _docsZ.push(_wz.document); } catch (e) {} }
                        } catch (e) {}
                        for (let _dz = 0; _dz < _docsZ.length; _dz++) {
                            const _dzz: any = _docsZ[_dz];
                            try {
                                const _list = _dzz.querySelectorAll('[class*="overlay"][class*="acu-"], .acu-cell-menu, .acu-menu-backdrop');
                                for (let i = 0; i < _list.length; i++) boostEl(_list[i]);
                                const _bds = _dzz.querySelectorAll('.acu-menu-backdrop');
                                if (_bds.length > 0 && _dzz.querySelectorAll('.acu-cell-menu').length === 0) {
                                    for (let i = 0; i < _bds.length; i++) { try { _bds[i].remove(); } catch (e) {} }
                                }
                            } catch (e) {}
                        }
                        // toast 层级保障（toastr 提示防被盖）
                        const tst = doc.querySelectorAll('#toast-container, .toast');
                        for (let i = 0; i < tst.length; i++) { try { tst[i].style.setProperty('z-index', '2147483647', 'important'); } catch (e) {} }
                    } catch (e) {}
                };
                const obs = new MutationObserver((muts: any[]) => {
                    let hit = false;
                    for (let mi = 0; mi < muts.length && !hit; mi++) {
                        const added = muts[mi].addedNodes;
                        if (!added) continue;
                        for (let i = 0; i < added.length; i++) {
                            const n: any = added[i];
                            if (!n || n.nodeType !== 1) continue;
                            try { const _c = String(n.className || ''); if (_c.indexOf('acu-') >= 0 || _c.indexOf('toast') >= 0) { hit = true; break; } } catch (e) {}
                        }
                    }
                    if (hit && !(window as any).__dndSweepT) { (window as any).__dndSweepT = setTimeout(function() { (window as any).__dndSweepT = null; sweep(); }, 120); }
                });
                try { obs.observe(document.documentElement || document.body, { childList: true, subtree: true }); } catch (e) {}
            }
        } catch (e) {}
        $container.empty();
        // [b13.3] 全局写操作监听：菜单项/弹窗按钮点击 → 延迟刷新 DND 表
        try {
            if (!(window as any).__dndWriteWatch) {
                (window as any).__dndWriteWatch = true;
                $(document).on('click.dndWriteWatch', '.acu-cell-menu-item, .acu-dialog-btn, .acu-btn-confirm, #dlg-save, .acu-settings-content .acu-dialog-btn', function() {
                    // [b13.3] 写操作三档延迟刷新（防异步写库竞态：450/1300/2400ms）
                    [450, 1300, 2400].forEach(function(_dlyW) {
                        setTimeout(function() { try { if ((window as any).__dndTableRefresh) (window as any).__dndTableRefresh(); } catch (e) {} }, _dlyW);
                    });
                });
                $(document).on('click.dndWriteWatch2', '.acu-menu-backdrop', function() {
                    setTimeout(function() { try { if ((window as any).__dndTableRefresh) (window as any).__dndTableRefresh(); } catch (e) {} }, 300);
                });
            }
        } catch (e) {}
        let items: any[] = [];
        try { if (g && typeof g.getTableNavItems === 'function') items = g.getTableNavItems() || []; } catch (e) {}
        const specials = [
            { tab: 'dashboard', icon: 'fa-chart-pie', label: '仪表盘' },
            { tab: 'changes', icon: 'fa-code-compare', label: '审核' },
            { tab: 'mvu', icon: 'fa-code-branch', label: '变量' },
            { tab: 'favorites', icon: 'fa-star', label: '收藏夹' },
            { tab: 'global-interactions', icon: 'fa-hand-pointer', label: '交互总览' },
        ];
        const btnStyle = 'display:flex;align-items:center;gap:5px;padding:7px 6px;background:linear-gradient(to bottom, var(--dnd-bg-tertiary), var(--dnd-bg-secondary));border:1px solid var(--dnd-border-inner);border-radius:5px;color:var(--dnd-text-main);font-size:12px;cursor:pointer;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:all 0.2s;';
        let html = `<div class="dnd-tnav-list" style="padding:10px;max-height:380px;overflow-y:auto;">`;
        html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">`;
        specials.forEach(s2 => { html += `<button class="dnd-tnav-btn dnd-clickable" data-tab="${s2.tab}" style="${btnStyle}"><i class="fa-solid ${s2.icon}" style="color:var(--dnd-text-highlight);"></i>${s2.label}</button>`; });
        html += `</div>`;
        html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">`;
        items.forEach(it => {
            const iconHtml = (it.icon && String(it.icon).indexOf('fa') === 0) ? `<i class="fa-solid ${String(it.icon)}" style="color:var(--dnd-text-dim);"></i>` : '';
            html += `<button class="dnd-tnav-btn dnd-clickable" data-table="${String(it.key).replace(/"/g, '')}" style="${btnStyle}">${iconHtml}${String(it.name || '')}</button>`;
        });
        html += `</div></div>`;
        const $el = $(html);
        // [b12.18] 点击项 → 打开对应内容弹窗（不打开骰子面板）
        $el.find('.dnd-tnav-btn').on('click', async function() {
            const tab = $(this).attr('data-tab');
            try { console.info('[DND]列表项点击 tab=' + String(tab || '(none)') + ' table=' + String($(this).attr('data-table') || '(none)')); } catch (eC) {}
            const table = $(this).attr('data-table');
            const label = $(this).text();
            try {
                if (table) {
                    // [b13.1] 内嵌完整表格视图（不弹窗、不打开骰子面板）
                    try { if (g && typeof g.ensureAcuCachedData === 'function') g.ensureAcuCachedData(); } catch (e) {}
                    const $list = $container.find('.dnd-tnav-list');
                    $container.find('.dnd-acu-table-view').remove();
                    $container.find('.dnd-acu-view-inline').remove(); // [b13.2.19] 清理特殊入口内嵌视图
                    let tableHtml = '';
                    try { if (g && typeof g.renderTableHostForDnd === 'function') tableHtml = g.renderTableHostForDnd(table); } catch (e) {}
                    if (!tableHtml) tableHtml = '<div style="padding:20px;text-align:center;color:var(--dnd-text-dim);font-size:12px;">无法读取该表数据（可能尚未加载）</div>';
                    const themeCls = (g && typeof g.getAcuThemeClass === 'function') ? String(g.getAcuThemeClass()) : 'acu-theme-dark';
                    const $view = $(`<div class="dnd-acu-table-view" style="max-height:58vh;overflow-y:auto;border-top:1px solid var(--dnd-border-inner);"><div class="dnd-acu-table-host ${themeCls}" style="padding:2px 6px 6px;"></div></div>`);
                    // [b13.2.21] 注入骰子绑定所需容器身份（仅 id；不加 acu-data-display 类以免 absolute 定位塌陷）
                    try {
                        try { const _oldIds = document.querySelectorAll('#acu-data-area'); for (let _oi = 0; _oi < _oldIds.length; _oi++) { try { _oldIds[_oi].removeAttribute('id'); } catch (e) {} } } catch (e) {}
                        $view.find('.dnd-acu-table-host').attr('id', 'acu-data-area').addClass('visible');
                    } catch (e) {}
                    $view.find('.dnd-acu-table-host').html(tableHtml);
                    try { console.info('[DND]表格视图已渲染 table=' + table + ' len=' + String(tableHtml || '').length); } catch (eC2) {}
                    $list.hide();
                    $container.append($view);
                    // [b13.2.38] 头部排序规整：↕✕ → 第一排末；搜索框 → 半宽靠右第二排
                    try {
                        var _tidyT = function() { try { applyDndHeaderTidy($, $view); } catch (eTD1) {} };_tidyT();
                        setTimeout(_tidyT, 300);
                        setTimeout(_tidyT, 800);
                    } catch (eT0) {}
                    // [b13.2.34] 悬浮球休眠（视图打开期间防误触）
                    try { const _fbT1: any = document.getElementById('dnd-toggle-btn'); if (_fbT1) _fbT1.classList.add('dnd-btn-dozed'); } catch (e1z) {}
                    // [b13.2.32] per-doc 样式注入（表格视图所在文档）+ 触摸高度拖动
                    try {
                        const _cssA9 = String(((window as any).__dndInlineCssV8) || __DND_CSS_V9 || '');
                        const _docB9: any = ($view[0] && $view[0].ownerDocument) || document;
                        const _ensure9 = function(_d: any, _css: string) {
                            try {
                                if (!_d || !_css) return;
                                const _head9 = _d.head || _d.documentElement;
                                if (!_head9) return;
                                let _el9: any = null;
                                try { _el9 = _d.getElementById ? _d.getElementById('dnd-inline-scroll-fix') : null; } catch (a9) {}
                                if (!_el9) { _el9 = _d.createElement('style'); _el9.id = 'dnd-inline-scroll-fix'; _head9.appendChild(_el9); }
                                if (_el9.getAttribute('data-v') !== 'v11') { _el9.textContent = _css; _el9.setAttribute('data-v', 'v11'); }
                            } catch (b9) {}
                        };
                        _ensure9(_docB9, _cssA9);
                        if (_docB9 !== document) _ensure9(document, _cssA9);
                    } catch (c9) {}
                    try {
                        const _root9: any = document.createElement('div'); // 占位
                    } catch (c9b) {}
                    try {
                        // 触摸高度拖动（capture，拦截滚动）
                        $view[0].addEventListener('touchstart', function(ev: any) {
                            try {
                                if (!ev.touches || !ev.touches.length) return;
                                const t9: any = ev.target;
                                if (!t9 || !t9.closest || !t9.closest('.acu-height-drag-handle')) return;
                                if (ev.cancelable) ev.preventDefault();
                                // [b13.2.35] 触摸双击恢复
                                try {
                                    const _nowT9 = Date.now();
                                    if ($view[0]._lastTapT && (_nowT9 - $view[0]._lastTapT) < 340) {
                                        $view[0]._lastTapT = 0;
                                        $view[0].style.removeProperty('height');
                                        $view[0].style.setProperty('max-height', '58vh', 'important');
                                        console.info('[DND]表格高度双击恢复(touch)');
                                        return;
                                    }
                                    $view[0]._lastTapT = _nowT9;
                                } catch (eDbl9) {}
                                try { console.info('[DND]表格高度拖动开始(touch)'); } catch (t9e) {}
                                let lastY9 = ev.touches[0].clientY;
                                const _docT9: any = ($view[0] && $view[0].ownerDocument) || document;
                                const mv9 = function(me: any) {
                                    try {
                                        if (!me.touches || !me.touches.length) return;
                                        if (me.cancelable) me.preventDefault();
                                        const curY9 = me.touches[0].clientY;
                                        const stepY9 = curY9 - lastY9;
                                        lastY9 = curY9;
                                        try { if (!(mv9 as any)._lg2) { (mv9 as any)._lg2 = 1; console.info('[DND]表格高度 move首帧 step=' + Math.round(stepY9)); } } catch (eLg9) {}
                                        const curH9 = $view[0].getBoundingClientRect().height || 400;
                                        const nh9 = Math.max(120, Math.min(Math.max(window.innerHeight || 0, 700) * 0.85, curH9 - stepY9));
                                        try { const _n9 = ((mv9 as any)._lg3 = ((mv9 as any)._lg3 || 0) + 1); if (_n9 <= 12) console.info('[DND]表格move#' + _n9 + ' curH=' + Math.round(curH9) + ' step=' + Math.round(stepY9) + ' nh=' + Math.round(nh9)); } catch (eLg39) {}
                                        $view[0].style.setProperty('max-height', nh9 + 'px', 'important');
                                        $view[0].style.setProperty('height', nh9 + 'px', 'important');
                                    } catch (m9) {}
                                };
                                const en9 = function() {
                                    try { console.info('[DND]表格高度 up(touch) h=' + String($view[0].style.height || '?')); } catch (e9) {}
                                    try { _docT9.removeEventListener('touchmove', mv9, true); _docT9.removeEventListener('touchend', en9, true); } catch (e9b) {}
                                };
                                _docT9.addEventListener('touchmove', mv9, { passive: false, capture: true });
                                _docT9.addEventListener('touchend', en9, { passive: false, capture: true });
                            } catch (tz9) {}
                        }, { passive: false, capture: true });
                        // [b13.2.33] 双击恢复默认高度（58vh）
                        $view[0].addEventListener('dblclick', function() {
                            try { $view[0].style.removeProperty('height'); $view[0].style.setProperty('max-height', '58vh', 'important'); console.info('[DND]表格高度双击恢复'); } catch (eD9) {}
                        }, true);
                    } catch (d9) {}
                    const refresh = () => {
                        let h = '';
                        try { if (g && typeof g.renderTableHostForDnd === 'function') h = g.renderTableHostForDnd(table); } catch (e) {}
                        if (h) $view.find('.dnd-acu-table-host').html(h);
                        try { applyDndHeaderTidy($, $view); } catch (eRX2) {}
                        try { console.info('[DND]表格刷新 len=' + String(h || '').length + ' | pageBtns=' + $view.find('.acu-page-btn').length); } catch (e) {}
                    };
                    // [b13.3] 注册全局刷新回调（供写操作后自动刷新）
                    try { (window as any).__dndTableRefresh = function() { try { refresh(); } catch (e) {} }; } catch (e) {}
                    // 搜索（防抖 300ms）
                    let searchTimer: any = null;
                    $view.on('input', '.acu-search-input', function() {
                        const val = String($(this).val() || '');
                        if (searchTimer) clearTimeout(searchTimer);
                        searchTimer = setTimeout(() => {
                            try { if (g && typeof g.dndTableOp === 'function') g.dndTableOp('search', table, val); } catch (e) {}
                            refresh();
                            const el: any = $view.find('.acu-search-input')[0];
                            if (el) { try { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } catch (e2) {} }
                        }, 300);
                    });
                    // 分页
                    // [b13.2.26] 分页改用捕获阶段（防被其他 handler 拦截导致事件到不了）
                    try {
                        $view[0].addEventListener('click', function(ev: any) {
                            try {
                                const t2: any = ev.target;
                                if (!t2 || !t2.closest) return;
                                const elBtn: any = t2.closest('.acu-page-btn');
                                if (!elBtn) return;
                                ev.stopPropagation();
                                const $btn = $(elBtn);
                                try { console.info('[DND]分页点击(捕获) disabled=' + $btn.hasClass('disabled') + ' active=' + $btn.hasClass('active') + ' page=' + String($btn.attr('data-page')) + ' table=' + table); } catch (e2) {}
                                if ($btn.hasClass('disabled') || $btn.hasClass('active')) return;
                                const p = parseInt(String($btn.attr('data-page') || '1'), 10) || 1;
                                try { if (g && typeof g.dndTableOp === 'function') g.dndTableOp('page', table, p); } catch (e) {}
                                refresh();
                            } catch (e) {}
                        }, true);
                    } catch (e) {}
                    // 倒序
                    $view.on('click', '.acu-reverse-btn', function(e: any) {
                        e.stopPropagation();
                        try { console.info('[DND]表格倒序点击 table=' + table); } catch (e2) {}
                        try { if (g && typeof g.dndTableOp === 'function') g.dndTableOp('reverse', table); } catch (e) {}
                        refresh();
                    });
                    // [b13.2a] 单元格菜单（点击单元格/标题 → 编辑/删除/插入/复制/收藏 全功能菜单）
                    $view.on('click', '.acu-cell', function(e) {
                        if ($(e.target).closest('.acu-bookmark-icon, .acu-action-item, .acu-inline-dice-btn').length) return;
                        e.stopPropagation();
                        try { if (g && typeof g.showCellMenuForDnd === 'function') g.showCellMenuForDnd(e.clientX, e.clientY, this); } catch (e2) {}
                    });
                    // [b13.2a] 书签（拦截并走 DND 刷新，避免双触发）
                    $view.on('click', '.acu-bookmark-icon', function(e) {
                        e.stopPropagation(); e.preventDefault();
                        const $icon = $(this);
                        const tName = $icon.data('table');
                        const rKey = $icon.data('row-key');
                        if (!tName || !rKey) return;
                        try { if (g && typeof g.toggleBookmarkForDnd === 'function') g.toggleBookmarkForDnd(String(tName), String(rKey)); } catch (e2) {}
                        refresh();
                    });
                    // [b13.2a] 交互动作按钮（执行交互并刷新）
                    $view.on('click', '.acu-action-item', function(e) {
                        e.stopPropagation(); e.preventDefault();
                        try { if (g && typeof g.runCardActionForDnd === 'function') g.runCardActionForDnd(this); } catch (e2) {}
                        refresh();
                    });
                    // [b13.3] 专属按钮：关系图 / 地图 / 库存 / 视图切换
                    $view.on('click', '#acu-btn-relation-graph', function(e) {
                        e.stopPropagation(); e.preventDefault();
                        const tName = String($(this).attr('data-table') || table);
                        try { if (g && typeof g.openRelationGraphForDnd === 'function') g.openRelationGraphForDnd(tName); } catch (e2) {}
                    });
                    $view.on('click', '.acu-table-map-btn', function(e) {
                        e.stopPropagation(); e.preventDefault();
                        try { if (g && typeof g.openMapForDnd === 'function') g.openMapForDnd(); } catch (e2) {}
                    });
                    $view.on('click', '.acu-table-inventory-btn', function(e) {
                        e.stopPropagation(); e.preventDefault();
                        const target = String($(this).attr('data-inventory-target') || 'inventory');
                        try { if (g && typeof g.openInventoryForDnd === 'function') g.openInventoryForDnd(target); } catch (e2) {}
                    });
                    $view.on('click', '#acu-btn-switch-style', function(e) {
                        e.stopPropagation(); e.preventDefault();
                        const tName = String($(this).attr('data-table') || table);
                        try { if (g && typeof g.toggleTableStyleForDnd === 'function') g.toggleTableStyleForDnd(tName); } catch (e2) {}
                        refresh();
                        setTimeout(function() { try { const b: any = $view.find('.acu-card-body').get(0); const _w: any = (b && b.ownerDocument && b.ownerDocument.defaultView) || window; const _stx: any = document.getElementById('dnd-inline-scroll-fix'); console.info('[DND]布局切换诊断 body=' + (b ? String(b.className).slice(0, 60) : 'none') + ' display=' + (b ? _w.getComputedStyle(b).display : '?') + ' cols=' + (b ? _w.getComputedStyle(b).gridTemplateColumns : '?') + ' viewCls=' + String($view.attr('class') || '') + ' inDom=' + (b ? (b.ownerDocument === document) : '?') + ' styleEl=' + (_stx ? 'yes:' + String((_stx.sheet && _stx.sheet.cssRules) ? _stx.sheet.cssRules.length : 0) : 'no')); } catch (e2) {} }, 350);
                    });
                    // [b13.2.27→b13.2.28] 表格高度拖动（原生捕获阶段，防被其他 handler 拦截）
                    try {
                        $view[0].addEventListener('pointerdown', function(ev: any) {
                            try {
                                const t2: any = ev.target;
                                if (!t2 || !t2.closest) return;
                                const hEl: any = t2.closest('.acu-height-drag-handle');
                                if (!hEl) return;
                                try { console.info('[DND]表格高度拖动开始'); } catch (e2) {}
                                ev.preventDefault();
                                ev.stopPropagation();
                                try { hEl.setPointerCapture(ev.pointerId); } catch (e2) {}
                                try { hEl.style.touchAction = 'none'; } catch (e2) {}
                                const startY = ev.clientY;
                                const startH = $view[0].getBoundingClientRect().height || 400;
                                const move = function(mv: any) {
                                    try {
                                        const dh = (mv.clientY - startY);
                                        let nh = Math.max(160, Math.min(Math.max(window.innerHeight || 0, 700) * 0.85, startH - dh));
                                        try { if (!(move as any)._lg) { (move as any)._lg = 1; console.info('[DND]表格高度 move dy=' + Math.round(dh) + ' nh=' + Math.round(nh)); } } catch (e2) {}
                                        $view[0].style.setProperty('max-height', nh + 'px', 'important');
                                        $view[0].style.setProperty('height', nh + 'px', 'important');
                                    } catch (e) {}
                                };
                                const _doc2: any = ($view[0] && $view[0].ownerDocument) || document;
                                const up = function() {
                                    try { console.info('[DND]表格高度 up h=' + String($view[0].style.height || '?')); } catch (e2) {}
                                    try { document.removeEventListener('pointermove', move, true); document.removeEventListener('pointerup', up, true); } catch (e) {}
                                    try { _doc2.removeEventListener('pointermove', move, true); _doc2.removeEventListener('pointerup', up, true); } catch (e) {}
                                };
                                try { document.addEventListener('pointermove', move, true); document.addEventListener('pointerup', up, true); } catch (e) {}
                                try { if (_doc2 !== document) { _doc2.addEventListener('pointermove', move, true); _doc2.addEventListener('pointerup', up, true); } } catch (e) {}
                            } catch (e) {}
                        }, true);
                        $view.on('dblclick.dndHeight', '.acu-height-drag-handle', function() {
                            try { $view[0].style.removeProperty('height'); $view[0].style.setProperty('max-height', '58vh', 'important'); } catch (e) {}
                        });
                    } catch (e) {}
                    // [b13.2.27] 库存可视化按钮
                    try {
                        $view.on('click.dndInv', '.acu-table-inventory-btn', function(ev: any) {
                            ev.stopPropagation();
                            try { if (g && typeof g.showInventoryVisualization === 'function') g.showInventoryVisualization(); } catch (e) {}
                        });
                    } catch (e) {}
                    // 关闭按钮 → 返回列表
                    $view.on('click', '.acu-close-btn', function(e) { e.stopPropagation(); $view.remove(); $list.show(); try { const _fbT2: any = document.getElementById('dnd-toggle-btn'); if (_fbT2) _fbT2.classList.remove('dnd-btn-dozed'); } catch (e2z) {} });
                    // [b13.2.24] 表格教程按钮绑定（原骰子面板教程按钮在 DND 表格视图里补绑）
                    try { if (g && typeof g.bindTutorialButtonsInForDnd === 'function') g.bindTutorialButtonsInForDnd($view[0]); } catch (e3) {}
                    // [b13.2.25] 表格教程点击诊断
                    try { $view.on('click.dndTutDiag', '.acu-panel-tutorial-btn', function() { try { console.info('[DND]表格教程点击 scope=' + String($(this).attr('data-tutorial-scope'))); } catch (e4) {} }); } catch (e3) {}
                    // [b13.2.21] 阻止本次点击继续冒泡
                    try { if (e && e.stopPropagation) e.stopPropagation(); } catch (e2) {}
                    return;
                }
                if (tab) {
                    // [b13.2.19] 特殊入口 → 内嵌视图（与表格一致；不再使用弹窗）
                    try { if (g && typeof g.ensureAcuCachedData === 'function') g.ensureAcuCachedData(); } catch (e) {}
                    const $list = $container.find('.dnd-tnav-list');
                    $container.find('.dnd-acu-view-inline').remove();
                    $container.find('.dnd-acu-table-view').remove();
                    const themeCls3 = (g && typeof g.getAcuThemeClass === 'function') ? String(g.getAcuThemeClass()) : 'acu-theme-dark';
                    const $view = $(`<div class="dnd-acu-view-inline" style="max-height:58vh;overflow-y:auto;border-top:1px solid var(--dnd-border-inner);"><div class="dnd-acu-view-inline-body ${themeCls3}" style="padding:2px 6px 6px;"></div></div>`);
                    const $bodyEl3 = $view.find('.dnd-acu-view-inline-body');
                    // [b13.2.20] 注入骰子绑定所需容器身份（#acu-data-area + .acu-data-display）
                    try {
                        try { const _oldIds = document.querySelectorAll('#acu-data-area'); for (let _oi = 0; _oi < _oldIds.length; _oi++) { try { _oldIds[_oi].removeAttribute('id'); } catch (e) {} } } catch (e) {}
                        $bodyEl3.attr('id', 'acu-data-area');
                        $bodyEl3.addClass('visible');
                        // [b13.2.21] 不加 acu-data-display 类（其 CSS 为 absolute 向上弹出定位，会导致内嵌布局塌陷）
                    } catch (e) {}
                    // [b13.2.20] 内嵌滚动修正：解除骰子内容高度限制，滚动交给外层容器
                    try {
                        if (!(window as any).__dndInlineScrollFix_v8) {
                            (window as any).__dndInlineScrollFix_v8 = true;
                            try { const _oldSt = document.getElementById('dnd-inline-scroll-fix'); if (_oldSt && _oldSt.parentNode) _oldSt.parentNode.removeChild(_oldSt); } catch (e2) {}
                            const _st = document.createElement('style');
                            _st.id = 'dnd-inline-scroll-fix';
                            _st.textContent = __DND_CSS_V9;
                            try { (window as any).__dndInlineCssV8 = String(_st.textContent || ''); } catch (e2c) {};
                            // [b13.2.32] per-doc 注入：同时注入脚本文档与视图所在文档（修复 iframe 场景）
                            try {
                                const _docA: any = ($view[0] && $view[0].ownerDocument) || document;
                                const _cssTxt = String(_st.textContent || '');
                                const _ensure = function(_d: any) {
                                    try {
                                        if (!_d) return;
                                        const _head = _d.head || _d.documentElement;
                                        if (!_head) return;
                                        let _el: any = null;
                                        try { _el = _d.getElementById ? _d.getElementById('dnd-inline-scroll-fix') : null; } catch (e3a) {}
                                        if (!_el) { try { _el = _d.createElement('style'); _el.id = 'dnd-inline-scroll-fix'; _head.appendChild(_el); } catch (e3b) { return; } }
                                        if (_el.getAttribute && _el.getAttribute('data-v') !== 'v11') { _el.textContent = _cssTxt; try { _el.setAttribute('data-v', 'v11'); } catch (e3c) {} }
                                    } catch (e3) {}
                                };
                                _ensure(_docA);
                                if (_docA !== document) _ensure(document);
                            } catch (e) {}
                        }
                    } catch (e) {}
                    // 渲染内容（沿用弹窗时代的渲染与绑定链路）
                    if (tab === 'mvu') {
                        let okMvu = false;
                        try { if (g && typeof g.renderMvuPanelForDnd === 'function') okMvu = g.renderMvuPanelForDnd($bodyEl3[0]); } catch (e) {}
                        if (!okMvu) { $bodyEl3.html('<div style="padding:20px;text-align:center;color:var(--dnd-text-dim);font-size:12px;">变量面板暂不可用</div>'); }
                    } else {
                        let h3: any = null;
                        try { if (g && typeof g.renderAcuViewHtml === 'function') h3 = g.renderAcuViewHtml(tab); } catch (e) {}
                        if (h3 && typeof h3.then === 'function') { try { h3 = await h3; } catch (e) { h3 = null; } }
                        if (h3) {
                            $bodyEl3.html(String(h3));
                            try { if (tab === 'changes') { const _s3 = String(h3); console.info('[DND]changes首次渲染 mode=' + (_s3.indexOf('acu-simple-mode-toggle active') >= 0 ? 'validation' : 'full') + ' len=' + _s3.length); } } catch (e3) {}
                            try { if (tab === 'favorites' && g && typeof g.bindFavoritesEventsForDnd === 'function') g.bindFavoritesEventsForDnd($bodyEl3[0]); } catch (e) {}
                            // [b13.2.25] changes 的绑定移至 append 后（游离 DOM 时全局选择器找不到按钮，导致首次点击无 handler）
                        } else { $bodyEl3.html('<div style="padding:20px;text-align:center;color:var(--dnd-text-dim);font-size:12px;">暂无法渲染该视图内容</div>'); }
                    }
                    try { if (g && typeof g.bindTutorialButtonsInForDnd === 'function') g.bindTutorialButtonsInForDnd($bodyEl3[0]); } catch (e) {}
                    $list.hide();
                    $container.append($view);
                    // [b13.2.37] 头部排序规整（收藏夹：高度/关闭 → 搜索框前）
                    try {
                        var _tidyI = function() { try { applyDndHeaderTidy($, $view); } catch (eTD2) {} };_tidyI();
                        setTimeout(_tidyI, 300);
                        setTimeout(_tidyI, 800);
                        setTimeout(_tidyI, 1500);
                        setTimeout(_tidyI, 2500);
                    } catch (eI0) {}
                    // [b13.2.34] 悬浮球休眠
                    try { const _fbT3: any = document.getElementById('dnd-toggle-btn'); if (_fbT3) _fbT3.classList.add('dnd-btn-dozed'); } catch (e3z) {}
                    // [b13.2.32] per-doc 样式注入 + 触摸高度拖动（内嵌视图）
                    try {
                        const _cssB = String((window as any).__dndInlineCssV8 || __DND_CSS_V9 || '');
                        const _docB2: any = ($view[0] && $view[0].ownerDocument) || document;
                        const _ensB = function(_d: any, _css: string) {
                            try {
                                if (!_d || !_css) return;
                                const _hB = _d.head || _d.documentElement;
                                if (!_hB) return;
                                let _eB: any = null;
                                try { _eB = _d.getElementById ? _d.getElementById('dnd-inline-scroll-fix') : null; } catch (aB) {}
                                if (!_eB) { _eB = _d.createElement('style'); _eB.id = 'dnd-inline-scroll-fix'; _hB.appendChild(_eB); }
                                if (_eB.getAttribute('data-v') !== 'v11') { _eB.textContent = _css; _eB.setAttribute('data-v', 'v11'); }
                            } catch (bB) {}
                        };
                        _ensB(_docB2, _cssB);
                        if (_docB2 !== document) _ensB(document, _cssB);
                    } catch (cB) {}
                    try {
                        $view[0].addEventListener('touchstart', function(ev: any) {
                            try {
                                if (!ev.touches || !ev.touches.length) return;
                                const tB: any = ev.target;
                                if (!tB || !tB.closest || !tB.closest('.acu-height-drag-handle')) return;
                                if (ev.cancelable) ev.preventDefault();
                                // [b13.2.35] 触摸双击恢复（dblclick 在触摸设备不可靠）
                                try {
                                    const _nowT = Date.now();
                                    if ($view[0]._lastTapT && (_nowT - $view[0]._lastTapT) < 340) {
                                        $view[0]._lastTapT = 0;
                                        $view[0].style.removeProperty('height');
                                        $view[0].style.setProperty('max-height', '58vh', 'important');
                                        console.info('[DND]内嵌高度双击恢复(touch) tab=' + tab);
                                        return;
                                    }
                                    $view[0]._lastTapT = _nowT;
                                } catch (eDbl) {}
                                try { console.info('[DND]内嵌高度拖动开始(touch) tab=' + tab); } catch (tBe) {}
                                let lastYB = ev.touches[0].clientY;
                                const _docTB: any = ($view[0] && $view[0].ownerDocument) || document;
                                const mvB = function(me: any) {
                                    try {
                                        if (!me.touches || !me.touches.length) return;
                                        if (me.cancelable) me.preventDefault();
                                        const curY = me.touches[0].clientY;
                                        const stepY = curY - lastYB;
                                        lastYB = curY;
                                        try { if (!(mvB as any)._lg2) { (mvB as any)._lg2 = 1; console.info('[DND]内嵌高度 move首帧 step=' + Math.round(stepY)); } } catch (eLg) {}
                                        const curH = $view[0].getBoundingClientRect().height || 400;
                                        const nhB = Math.max(120, Math.min(Math.max(window.innerHeight || 0, 700) * 0.85, curH - stepY));
                                        try { const _n = ((mvB as any)._lg3 = ((mvB as any)._lg3 || 0) + 1); if (_n <= 12) console.info('[DND]内嵌move#' + _n + ' curH=' + Math.round(curH) + ' step=' + Math.round(stepY) + ' nh=' + Math.round(nhB)); } catch (eLg3) {}
                                        $view[0].style.setProperty('max-height', nhB + 'px', 'important');
                                        $view[0].style.setProperty('height', nhB + 'px', 'important');
                                    } catch (mB) {}
                                };
                                const enB = function() {
                                    try { console.info('[DND]内嵌高度 up(touch) h=' + String($view[0].style.height || '?')); } catch (eB) {}
                                    try { _docTB.removeEventListener('touchmove', mvB, true); _docTB.removeEventListener('touchend', enB, true); } catch (eBb) {}
                                };
                                _docTB.addEventListener('touchmove', mvB, { passive: false, capture: true });
                                _docTB.addEventListener('touchend', enB, { passive: false, capture: true });
                            } catch (tzB) {}
                        }, { passive: false, capture: true });
                        // [b13.2.33] 双击恢复默认高度（58vh）
                        $view[0].addEventListener('dblclick', function() {
                            try { $view[0].style.removeProperty('height'); $view[0].style.setProperty('max-height', '58vh', 'important'); console.info('[DND]内嵌高度双击恢复 tab=' + tab); } catch (eD) {}
                        }, true);
                    } catch (dB) {}
                    // [b13.2.21] 延迟绑定交互事件（避免注册的 document 级监听被本次点击冒泡触发）
                    try {
                        if (tab === 'global-interactions' && g && typeof g.bindInteractionEventsForDnd === 'function') {
                            (function($be: any) { setTimeout(function() { try { g.bindInteractionEventsForDnd($be); } catch (e) {} }, 350); })($bodyEl3[0]);
                        }
                    } catch (e) {}
                    // [b13.2.25] append 后绑定 changes（此时按钮已在 DOM，全局选择器可命中）
                    try { if (tab === 'changes' && g && typeof g.bindChangesEventsForDnd === 'function') g.bindChangesEventsForDnd(); } catch (e) {}
                    // [b13.2.25] 阻止触摸事件冒泡到外层（防酒馆 swipe 拦截导致内嵌滚动失效）
                    try {
                        $view[0].addEventListener('touchstart', function(ev: any) { try { ev.stopPropagation(); } catch (e) {} }, false);
                        $view[0].addEventListener('touchmove', function(ev: any) { try { ev.stopPropagation(); } catch (e) {} }, false);
                        $view[0].addEventListener('touchend', function(ev: any) { try { ev.stopPropagation(); } catch (e) {} }, false);
                    } catch (e) {}
                    // [b13.2.21] 诊断日志
                    try { console.info('[DND]内嵌视图已展开 tab=' + tab + ' | bodyLen=' + String($bodyEl3.html() || '').length + ' | listVisible=' + $list.is(':visible')); } catch (e) {}
                    // [b13.2.26] 滚动诊断：外层容器是否可滚
                    try { setTimeout(function() { try { console.info('[DND]滚动诊断 tab=' + tab + ' scrollH=' + $view[0].scrollHeight + ' clientH=' + $view[0].clientHeight + ' canScroll=' + ($view[0].scrollHeight > $view[0].clientHeight)); } catch (e) {} }, 600); } catch (e) {}
                    // [b13.2.21] 阻止本次点击继续冒泡（防止刚绑定的 document 级监听被本次事件触发）
                    try { if (e && e.stopPropagation) e.stopPropagation(); } catch (e2) {}
                    // 关闭按钮（.acu-close-btn）→ 关闭内嵌、返回列表
                    try {
                        $view[0].addEventListener('click', function(ev: any) {
                            try {
                                const t = ev.target;
                                if (t && t.closest && t.closest('.acu-close-btn')) {
                                    ev.stopPropagation();
                                    ev.preventDefault();
                                    $view.remove();
                                    $list.show();
                                    try { const _fbT4: any = document.getElementById('dnd-toggle-btn'); if (_fbT4) _fbT4.classList.remove('dnd-btn-dozed'); } catch (e4z) {}
                                }
                            } catch (e) {}
                        }, true);
                    } catch (e) {}
                    // [b13.2.18] 模式切换类按钮的本地重渲染（沿用）
                    try {
                        const _rerenderLocal3 = function() {
                            [200, 600].forEach(function(_delayR3) {
                            setTimeout(function() {
                                try {
                                    if (tab === 'mvu') {
                                        try { if (g && typeof g.renderMvuPanelForDnd === 'function') g.renderMvuPanelForDnd($bodyEl3[0]); } catch (e) {}
                                    } else {
                                        const _do3 = async function() {
                                            try {
                                                let _h3: any = null;
                                                try { if (g && typeof g.renderAcuViewHtml === 'function') _h3 = g.renderAcuViewHtml(tab); } catch (e) {}
                                                if (_h3 && typeof _h3.then === 'function') { try { _h3 = await _h3; } catch (e) { _h3 = null; } }
                                                if (_h3) {
                                                    $bodyEl3.html(String(_h3));
                                                    try { if (tab === 'changes') { const _s3 = String(_h3); console.info('[DND]changes重渲染 mode=' + (_s3.indexOf('acu-simple-mode-toggle active') >= 0 ? 'validation' : 'full') + ' len=' + _s3.length); } } catch (e3) {}
                                                    try { if (tab === 'favorites' && g && typeof g.bindFavoritesEventsForDnd === 'function') g.bindFavoritesEventsForDnd($bodyEl3[0]); } catch (e) {}
                                                    try { if (tab === 'changes' && g && typeof g.bindChangesEventsForDnd === 'function') g.bindChangesEventsForDnd(); } catch (e) {}
                                                    try { if (tab === 'global-interactions' && g && typeof g.bindInteractionEventsForDnd === 'function') { (function($be: any) { setTimeout(function() { try { g.bindInteractionEventsForDnd($be); } catch (e) {} }, 350); })($bodyEl3[0]); } } catch (e) {}
                                                    try { if (g && typeof g.bindTutorialButtonsInForDnd === 'function') g.bindTutorialButtonsInForDnd($bodyEl3[0]); } catch (e) {}
                                                }
                                            } catch (e) {}
                                        };
                                        _do3();
                                    }
                                } catch (e) {}
                            }, _delayR3);
                            });
                        };
                        $view.on('click.dndAcuRerender', '.acu-simple-mode-toggle', _rerenderLocal3);
                        $view.on('click.dndAcuRerender', '.mvu-btn-numeric-mode', _rerenderLocal3);
                        // [b13.2.22] 内层双层绑定：即使子级 handler stopPropagation，同元素上的委托仍会触发
                        $bodyEl3.on('click.dndAcuRerender2', '.acu-simple-mode-toggle', _rerenderLocal3);
                        $bodyEl3.on('click.dndAcuRerender2', '.mvu-btn-numeric-mode', _rerenderLocal3);
                    } catch (e) {}
                    // [b13.2.16→b13.2.19] 编辑弹窗保顶（宿主文档级观察，保留）
                    try {
                        const _hostDoc3: any = (($view[0] && $view[0].ownerDocument) || document);
                        const _boost3 = (el3x: any) => {
                            try {
                                const c3x = String(el3x.className || '');
                                if (c3x.indexOf('dnd-z-lowered') >= 0) return;
                                if (c3x.indexOf('acu-edit-overlay') >= 0 || c3x.indexOf('acu-dialog') >= 0 || (c3x.indexOf('tutorial') >= 0 && c3x.indexOf('overlay') >= 0 && c3x.indexOf('-btn') < 0) || (c3x.indexOf('overlay') >= 0 && c3x.indexOf('acu-') >= 0 && c3x.indexOf('-btn') < 0)) {
                                    el3x.style.setProperty('z-index', '2147483647', 'important');
                                    if (!el3x.getAttribute('data-dnd-tail-done')) {
                                        el3x.setAttribute('data-dnd-tail-done', '1');
                                        try { const p3x = el3x.parentNode; if (p3x && p3x.appendChild && p3x.lastElementChild !== el3x) p3x.appendChild(el3x); } catch (e) {}
                                    }
                                }
                            } catch (e) {}
                        };
                        try {
                            const l3x = _hostDoc3.querySelectorAll('.acu-edit-overlay:not([data-dnd-tail-done]):not([class*="-btn"]), .acu-dialog:not([data-dnd-tail-done]):not([class*="-btn"]), [class*="tutorial"][class*="overlay"]:not([data-dnd-tail-done]):not([class*="-btn"]), [class*="overlay"][class*="acu-"]:not([data-dnd-tail-done]):not([class*="-btn"])');
                            for (let i3x = 0; i3x < l3x.length; i3x++) _boost3(l3x[i3x]);
                        } catch (e) {}
                        try {
                            if (!(window as any).__dndAcuEditGuard) {
                                (window as any).__dndAcuEditGuard = true;
                                const _obs3x = new MutationObserver((ms3x: any[]) => {
                                    for (let mi3x = 0; mi3x < ms3x.length; mi3x++) {
                                        const a3x = ms3x[mi3x].addedNodes;
                                        if (!a3x) continue;
                                        for (let ai3x = 0; ai3x < a3x.length; ai3x++) {
                                            const n3x: any = a3x[ai3x];
                                            if (!n3x || n3x.nodeType !== 1) continue;
                                            const c3y = String(n3x.className || '');
                                            if (c3y.indexOf('acu-edit-overlay') >= 0 || c3y.indexOf('acu-dialog') >= 0 || (c3y.indexOf('tutorial') >= 0 && c3y.indexOf('overlay') >= 0 && c3y.indexOf('-btn') < 0) || (c3y.indexOf('overlay') >= 0 && c3y.indexOf('acu-') >= 0 && c3y.indexOf('-btn') < 0)) _boost3(n3x);
                                        }
                                    }
                                });
                                try { _obs3x.observe(_hostDoc3.documentElement || _hostDoc3.body, { childList: true, subtree: true }); } catch (e) {}
                            }
                        } catch (e) {}
                    } catch (e) {}
                    return;
                }
            } catch (e) { deps.logger.warn('[DND] 内容弹窗失败', e); }
        });
        $container.append($el);
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
