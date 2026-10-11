// features/dnd-panels/panels-map.ts
// 地图面板（b15.3 · 地图合并批3）：统一地图工作台——
//   世界地图点列表 + 锚切换（写隐藏列）+ 编辑（新增/删除）+ 地图预览 + 骰子地图可视化入口。
export function createPanelsMapFragment(deps: any): any {
  return {
    renderMapPanel($container) {
        const { $ } = deps.utils.getCore();
        const g: any = (window as any).DND_Dashboard_UI || {};
        const ds = g.mapDataSource;
        const locations = (ds && typeof ds.getMapLocations === 'function') ? ds.getMapLocations() : [];

        const esc = (s: any) => String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, String.fromCharCode(38) + 'quot;').replace(/'/g, '&#39;');

        const rowsHtml = locations.length ? locations.map((loc: any) => `
            <div class="dnd-map-loc-item" data-name="${esc(loc.name)}" style="padding:6px 8px;border:1px solid var(--dnd-border-subtle);border-radius:4px;background:var(--dnd-bg-secondary);display:flex;align-items:center;gap:6px;cursor:pointer;">
                <span style="color:${loc.isCurrent ? 'var(--dnd-border-gold)' : 'var(--dnd-text-dim)'};font-size:13px;flex-shrink:0;">${loc.isCurrent ? '★' : '☆'}</span>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:12px;color:var(--dnd-text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(loc.name)}</div>
                    <div style="font-size:10px;color:var(--dnd-text-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(loc.region)}${loc.locationType ? ' · ' + esc(loc.locationType) : ''}${loc.exploreState ? ' · ' + esc(loc.exploreState) : ''}</div>
                </div>
                <button class="dnd-map-loc-del" data-name="${esc(loc.name)}" title="删除该地点" style="flex-shrink:0;background:transparent;border:none;color:var(--dnd-text-dim);cursor:pointer;font-size:11px;padding:2px 4px;">✕</button>
            </div>
        `).join('') : '<div style="color:var(--dnd-text-dim);font-size:11px;padding:10px;text-align:center;">（无地点数据——请先导入模板或新增地点）</div>';

        const html = `
            <div class="dnd-map-panel" style="display:flex;gap:12px;min-height:420px;">
                <div class="dnd-map-sidebar" style="width:270px;flex-shrink:0;display:flex;flex-direction:column;gap:8px;">
                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        <button id="dnd-map-btn-refresh" class="dnd-clickable" style="flex:1;padding:5px 8px;background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);border-radius:4px;cursor:pointer;font-size:11px;"><i class="fa-solid fa-rotate"></i> 刷新底图</button>
                        <button id="dnd-map-btn-dice" class="dnd-clickable" style="flex:1;padding:5px 8px;background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);border-radius:4px;cursor:pointer;font-size:11px;"><i class="fa-solid fa-map"></i> 骰子地图</button>
                    </div>
                    <div style="display:flex;gap:6px;">
                        <button id="dnd-map-btn-add" class="dnd-clickable" style="flex:1;padding:5px 8px;background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-gold);color:var(--dnd-text-highlight);border-radius:4px;cursor:pointer;font-size:11px;"><i class="fa-solid fa-plus"></i> 新增地点</button>
                    </div>
                    <div id="dnd-map-loc-list" style="display:flex;flex-direction:column;gap:6px;overflow-y:auto;max-height:520px;">${rowsHtml}</div>
                    <div id="dnd-map-status" style="font-size:10px;color:var(--dnd-text-dim);min-height:14px;"></div>
                </div>
                <div class="dnd-map-preview" style="flex:1;display:flex;flex-direction:column;gap:6px;">
                    <div style="font-size:11px;color:var(--dnd-text-dim);">地图预览（探索 SVG / 战斗网格 Token）</div>
                    <div id="dnd-map-panel-preview" style="flex:1;min-height:380px;position:relative;border:1px solid var(--dnd-border-subtle);border-radius:6px;overflow:hidden;background:var(--dnd-bg-main);"></div>
                </div>
            </div>
        `;
        $container.html(html);

        const setStatus = (msg: string, ok?: boolean) => {
            $container.find('#dnd-map-status').text(msg).css('color', ok === false ? 'var(--dnd-accent-red)' : 'var(--dnd-text-dim)');
        };

        // ---- 预览渲染：复用 HUD 迷你地图渲染器 ----
        const renderPreview = () => {
            try {
                const $preview = $container.find('#dnd-map-panel-preview');
                if ($preview.length && typeof (g.renderMiniMap) === 'function') {
                    g.renderMiniMap($preview);
                }
            } catch (e) { try { console.warn('[MapPanel] preview fail', e); } catch (e2) {} }
        };
        renderPreview();

        // ---- 锚切换：点击行 ----
        $container.on('click', '.dnd-map-loc-item', async function (e: any) {
            if ($(e.target).closest('.dnd-map-loc-del').length) return;
            const name = String($(this).attr('data-name') || '');
            if (!name) return;
            setStatus('正在切换锚点：' + name + ' ...');
            let ok = false;
            try { if (ds && typeof ds.setCurrentDisplayMap === 'function') ok = await ds.setCurrentDisplayMap(name); } catch (e2) {}
            setStatus(ok ? ('已切换当前显示地图 → ' + name) : '切换失败（请查看控制台）', ok);
            if (ok) {
                $container.find('.dnd-map-loc-item').each(function (this: any) {
                    const isMe = String($(this).attr('data-name') || '') === name;
                    $(this).find('span').first().text(isMe ? '★' : '☆').css('color', isMe ? 'var(--dnd-border-gold)' : 'var(--dnd-text-dim)');
                });
                renderPreview();
            }
        });

        // ---- 删除地点 ----
        $container.on('click', '.dnd-map-loc-del', async function (e: any) {
            e.stopPropagation();
            const name = String($(this).attr('data-name') || '');
            if (!name) return;
            let okc = false;
            try {
                if (deps.notification && typeof deps.notification.confirm === 'function') okc = await deps.notification.confirm('确定删除地点「' + name + '」吗？此操作会删除世界地图点表中的该行。');
            } catch (e2) {}
            if (!okc) setStatus('已取消删除');
            if (!okc) return;
            setStatus('正在删除：' + name + ' ...');
            let ok = false;
            try { if (ds && typeof ds.deleteMapLocation === 'function') ok = await ds.deleteMapLocation(name); } catch (e3) {}
            setStatus(ok ? ('已删除：' + name) : '删除失败（请查看控制台）', ok);
            if (ok && this && this.renderMapPanel) this.renderMapPanel($container);
            else if (ok) { try { ((window as any).DND_Dashboard_UI || g).renderPanel && ((window as any).DND_Dashboard_UI || g).renderPanel('map'); } catch (e4) {} }
        });

        // ---- 新增地点 ----
        $container.on('click', '#dnd-map-btn-add', async () => {
            const ask = async (msg: string): Promise<string | null> => {
                try {
                    if (deps.notification && typeof deps.notification.prompt === 'function') {
                        const r = await deps.notification.prompt(msg);
                        if (r != null && r !== false) return String(r);
                    }
                } catch (e) {}
                try { const w: any = window as any; return (typeof w.prompt === 'function') ? w.prompt(msg) : null; } catch (e2) { return null; }
            };
            const name = await ask('请输入新地点名称（将写入「世界地图点」的详细地点列）：');
            if (!name) return;
            const region = await ask('请输入主要地区（可留空）：');
            setStatus('正在新增地点：' + name + ' ...');
            let ok = false;
            try { if (ds && typeof ds.addMapLocation === 'function') ok = await ds.addMapLocation(name, region || ''); } catch (e3) {}
            setStatus(ok ? ('已新增：' + name) : '新增失败（请查看控制台）', ok);
            if (ok) { try { this.renderMapPanel($container); } catch (e4) { try { ((window as any).DND_Dashboard_UI || g).renderPanel && ((window as any).DND_Dashboard_UI || g).renderPanel('map'); } catch (e5) {} } }
        });

        // ---- 刷新底图 ----
        $container.on('click', '#dnd-map-btn-refresh', async () => {
            setStatus('正在刷新底图（可能消耗 tokens）...');
            try {
                let loc = '';
                try { loc = (ds && typeof ds.getCurrentDisplayLocation === 'function' && ds.getCurrentDisplayLocation()) || (g.getCurrentScene ? g.getCurrentScene() : '') || ''; } catch (e) {}
                if (!loc) { setStatus('未找到当前地点（请先导入模板）', false); return; }
                if (typeof g.regenerateMap === 'function') { await g.regenerateMap(loc, 'manual'); setStatus('刷新指令已发出'); renderPreview(); }
                else setStatus('刷新能力不可用（regenerateMap 未注册）', false);
            } catch (e2) { setStatus('刷新失败：' + (e2 && e2.message), false); }
        });

        // ---- 骰子地图可视化 ----
        $container.on('click', '#dnd-map-btn-dice', () => {
            try {
                if (g && typeof g.openMapForDnd === 'function') { const ok = g.openMapForDnd(); setStatus(ok ? '已打开骰子地图可视化' : '骰子地图打开失败（可能未安装骰子模块）', ok !== false); }
                else setStatus('骰子地图接口不可用', false);
            } catch (e) { setStatus('骰子地图打开异常：' + (e && e.message), false); }
        });
    },
  };
}
