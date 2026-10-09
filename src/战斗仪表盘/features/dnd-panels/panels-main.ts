// features/dnd-panels/panels-main.ts
// 面板主入口 / 快捷清单 / 过滤（b10b · 自 BasedonST `src/ui/modules/UIPanels.js` 拆分移植）
import { DND_CONFIG } from '../dnd-core';
import { applyDndHeaderTidy } from '../dnd-hud/hud-header-tidy';
import { __DND_CSS_V9 } from '../dnd-hud/hud-render';

export function createPanelsMainFragment(deps: any): any {
  return {
    renderPanel(panelName) {
        const { $ } = deps.utils.getCore();
        const $content = $('#dnd-content');
        if (!$content.length) return;
        
        $content.empty();
        
        // 添加面板切换过渡
        $content.removeClass('dnd-panel-transition');
        // 强制重绘以重置动画
        void $content[0].offsetWidth;
        $content.addClass('dnd-panel-transition');

        switch (panelName) {
            case 'create':
                // Use the enhanced version from UICharacter (mix-in style)
                deps.uiCharacter.renderCharacterCreationPanel.call(this, $content);
                break;
            case 'party':
                this.renderPartyPanel($content);
                break;
            case 'quests':
                this.renderQuestsPanel($content);
                break;
            case 'inventory':
                this.renderInventoryPanel($content);
                break;
            case 'combat':
                this.renderCombatPanel($content);
                break;
            case 'world':
                this.renderWorldPanel($content);
                break;
            case 'logs':
                this.renderLogsPanel($content);
                break;
            case 'npcs':
                this.renderNPCPanel($content);
                break;
            case 'archives':
                this.renderArchivesPanel($content);
                break;
            case 'settings':
                ((window as any).DND_Dashboard_UI || this).renderSettingsPanel?.( $content);
                break;
            case 'acu-changes':
            case 'acu-mvu':
            case 'acu-favorites':
            case 'acu-global-interactions': {
                // [b13.4] 骰子视图主面板内嵌渲染（替代弹骰子面板）
                const tabMap: any = { 'acu-changes': 'changes', 'acu-mvu': 'mvu', 'acu-favorites': 'favorites', 'acu-global-interactions': 'global-interactions' };
                const tab = tabMap[panelName];
                $content.html('<div class="dnd-acu-view-inline dnd-acu-main-embed" id="acu-data-area" style="max-height:100%;overflow-y:auto;"><div class="dnd-acu-view-inline-body acu-embed-scope" style="padding:2px 6px 6px;"></div></div>');
                const $emb = $content.find('.dnd-acu-view-inline');
                const $embBody = $content.find('.dnd-acu-view-inline-body');
                const _gEmb: any = (window as any).__acuUI;
                // [b14.10] 同步骰子配置变量到内嵌容器（跟随主面板设置）
                try { if (_gEmb && typeof _gEmb.applyAcuVarsForDnd === 'function') _gEmb.applyAcuVarsForDnd($embBody[0]); } catch (eAV3) {}
                // [b13.4] per-doc 样式注入（主面板视图样式）
                try {
                    const _docE: any = ($content[0] && $content[0].ownerDocument) || document;
                    const _cssE = String((window as any).__dndInlineCssV8 || __DND_CSS_V9 || '');
                    const _ensE = function(_d: any, _css: string) {
                        try {
                            if (!_d || !_css) return;
                            const _hE = _d.head || _d.documentElement;
                            if (!_hE) return;
                            let _eE: any = null;
                            try { _eE = _d.getElementById ? _d.getElementById('dnd-inline-scroll-fix') : null; } catch (aE) {}
                            if (!_eE) { _eE = _d.createElement('style'); _eE.id = 'dnd-inline-scroll-fix'; _hE.appendChild(_eE); }
                            if (_eE.getAttribute('data-v') !== 'v11') { _eE.textContent = _css; _eE.setAttribute('data-v', 'v11'); }
                        } catch (bE) {}
                    };
                    _ensE(_docE, _cssE);
                    if (_docE !== document) _ensE(document, _cssE);
                } catch (cE) {}
                const _doEmbedV = async () => {
                    try {
                        if (tab === 'mvu') {
                            let okM = false;
                            try { if (_gEmb && typeof _gEmb.renderMvuPanelForDnd === 'function') okM = _gEmb.renderMvuPanelForDnd($embBody[0]); } catch (e) {}
                            if (!okM) $embBody.html('<div style="padding:20px;text-align:center;color:var(--dnd-text-dim);font-size:12px;">变量面板暂不可用</div>');
                        } else {
                            let h: any = null;
                            try { if (_gEmb && typeof _gEmb.renderAcuViewHtml === 'function') h = _gEmb.renderAcuViewHtml(tab); } catch (e) {}
                            if (h && typeof h.then === 'function') { try { h = await h; } catch (e) { h = null; } }
                            if (h) $embBody.html(String(h));
                            else $embBody.html('<div style="padding:20px;text-align:center;color:var(--dnd-text-dim);font-size:12px;">暂无法渲染该视图内容</div>');
                        }
                        try { if (_gEmb && typeof _gEmb.bindTutorialButtonsInForDnd === 'function') _gEmb.bindTutorialButtonsInForDnd($embBody[0]); } catch (e) {}
                        try { if (tab === 'favorites' && _gEmb && typeof _gEmb.bindFavoritesEventsForDnd === 'function') _gEmb.bindFavoritesEventsForDnd($embBody[0]); } catch (e) {}
                        try { if (tab === 'changes' && _gEmb && typeof _gEmb.bindChangesEventsForDnd === 'function') _gEmb.bindChangesEventsForDnd(); } catch (e) {}
                        try { if (tab === 'global-interactions' && _gEmb && typeof _gEmb.bindInteractionEventsForDnd === 'function') { setTimeout(function() { try { _gEmb.bindInteractionEventsForDnd($embBody[0]); } catch (e) {} }, 350); } } catch (e) {}
                        // 头部规整（同 Mini HUD：标题保底/搜索框搬行/按钮归一）
                        try { applyDndHeaderTidy($, $emb); } catch (e) {}
                        try { console.info('[DND]主面板内嵌渲染 tab=' + tab + ' len=' + String($embBody.html() || '').length); } catch (e) {}
                    } catch (e) {}
                };
                _doEmbedV();
                break;
            }
            default:
                $content.html('<div style="padding:20px">开发中...</div>');
        }
    },

    renderQuickInventory($container) {
        const { $ } = deps.utils.getCore();
        const items = deps.dataManager.getTable('ITEM_Inventory');
        if (!items) return;
        
        const equipped = [];
        const consumables = [];
        
        items.forEach(i => {
            const isEq = i['已装备'] === '是' || i['已装备'] === true || String(i['已装备']).toLowerCase() === 'true';
            const type = i['类别'] || '';
            
            if (isEq) equipped.push(i);
            else if (type.includes('消耗') || type.includes('药水') || type.includes('卷轴') || type.includes('食物')) {
                consumables.push(i);
            }
        });
        
        if (equipped.length === 0 && consumables.length === 0) return;
        
        let html = `<div style="padding:5px 10px;border-top:1px solid var(--dnd-border-subtle);">`;
        
        // [已删除] 装备图标流 - 已移至底部装备按钮
        
        // 消耗品快捷栏
        if (consumables.length > 0) {
            html += `<div style="display:flex;gap:5px;overflow-x:auto;padding-bottom:2px;">`;
            consumables.forEach((item, idx) => {
                const itemId = item['物品ID'] || item['物品名称'];
                html += `
                    <div class="dnd-quick-item dnd-clickable dnd-hud-entry dnd-hover-lift" data-id="${itemId}" title="[${item['数量']}] ${item['物品名称']}" style="animation-delay:${idx * 0.03}s; padding:2px 6px;background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-subtle);border-radius:10px;font-size:10px;white-space:nowrap;cursor:pointer;flex-shrink:0;">
                        ${item['物品名称']} x${item['数量']}
                    </div>
                `;
            });
            html += `</div>`;
        }
        
        html += `</div>`;
        const $el = $(html);
        
        // 绑定点击事件
        const self = this;
        $el.find('.dnd-quick-item').on('click', function(e) {
            e.stopPropagation();
            const itemId = $(this).data('id');
            const item = items.find(i => (i['物品ID'] === itemId) || (i['物品名称'] === itemId));
            if (item) self.showMiniItemActions(item, e);
        });
        
        $container.append($el);
    },
    filterPanelInventory() {
        const { $ } = deps.utils.getCore();
        const searchText = $('#dnd-panel-inv-search').val().toLowerCase();
        const filterCat = $('#dnd-panel-inv-filter').val();
        const filterOwner = $('#dnd-panel-inv-owner').val();
        
        // 筛选所有卡片
        $('.dnd-item-card').each(function() {
            const $el = $(this);
            const name = ($el.attr('data-name') || '').toLowerCase();
            const category = ($el.attr('data-category') || '');
            const owner = ($el.attr('data-owner') || '');
            
            const matchSearch = !searchText || name.includes(searchText);
            const matchFilter = !filterCat || category === filterCat;
            // 如果选择了 owner，则必须匹配；如果没有选择，则显示所有
            // 如果 owner 是 '无'，则显示没有 owner 的物品
            const matchOwner = !filterOwner || (filterOwner === '无' ? !owner : owner === filterOwner);
            
            if (matchSearch && matchFilter && matchOwner) {
                $el.show();
            } else {
                $el.hide();
            }
        });
        
        // 处理分类容器的显示/隐藏和自动展开
        $('.dnd-inv-category').each(function() {
            const $cat = $(this);
            const catName = $cat.data('category');
            
            // 如果选择了特定分类，直接隐藏不匹配的分类块
            if (filterCat && catName !== filterCat) {
                $cat.hide();
                return;
            }
            
            // 检查该分类下是否有可见物品
            const hasVisibleItems = $cat.find('.dnd-item-card:visible').length > 0;
            
            if (hasVisibleItems) {
                $cat.show();
                // 如果有搜索词，自动展开以便查看结果
                if (searchText) {
                    $cat.find('.dnd-inv-body').slideDown(200);
                    $cat.find('.dnd-collapse-icon').text('▲');
                }
            } else {
                $cat.hide();
            }
        });
    },

  };
}
