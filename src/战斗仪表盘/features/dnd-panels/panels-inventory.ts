// features/dnd-panels/panels-inventory.ts
// 背包 / 世界 / 日志面板（b10b · 自 BasedonST `src/ui/modules/UIPanels.js` 拆分移植）
import { DND_CONFIG } from '../dnd-core';

export function createPanelsInventoryFragment(deps: any): any {
  return {
    renderInventoryPanel($c) {
        const items = deps.dataManager.getTable('ITEM_Inventory');
        if(!items || items.length === 0) {
            $c.html('<div style="padding:20px;text-align:center;color:var(--dnd-text-dim)"><i class="fa-solid fa-suitcase"></i> 背包空空如也</div>');
            return;
        }

        // 按类别分组
        const categories = {};
        const equippedItems = [];
        const allCats = new Set();
        
        items.forEach(i => {
            const isEquipped = i['已装备'] === '是' || i['已装备'] === true || String(i['已装备']).toLowerCase() === 'true';
            if (isEquipped) {
                equippedItems.push(i);
            }
            
            const cat = i['类别'] || '杂物';
            allCats.add(cat);
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(i);
        });

        const sortedCats = [...allCats].sort();

        const { $ } = deps.utils.getCore();
        const $container = $('<div style="display:flex;flex-direction:column;gap:20px;"></div>');

        // 获取所有持有者 (Owner)
        const allOwners = new Set();
        items.forEach(i => {
            if (i['所属人']) allOwners.add(i['所属人']);
        });
        const sortedOwners = [...allOwners].sort();

        // 搜索和筛选区域 (Panel)
        const searchHtml = `
            <div style="background:var(--dnd-bg-secondary);padding:10px;border-radius:6px;border:1px solid var(--dnd-border-inner);display:flex;gap:10px;align-items:center;">
                <div style="font-weight:bold;color:var(--dnd-text-highlight);white-space:nowrap;"><i class="fa-solid fa-search"></i> 查找物品</div>
                <input type="text" id="dnd-panel-inv-search" placeholder="物品名称..." style="flex:1;background:var(--dnd-bg-input);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);padding:6px 10px;border-radius:4px;" oninput="window.DND_Dashboard_UI.filterPanelInventory()">
                <select id="dnd-panel-inv-filter" style="background:var(--dnd-bg-input);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);padding:6px;border-radius:4px;" onchange="window.DND_Dashboard_UI.filterPanelInventory()">
                    <option value="">全部分类</option>
                    ${sortedCats.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
                <select id="dnd-panel-inv-owner" style="background:var(--dnd-bg-input);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);padding:6px;border-radius:4px;" onchange="window.DND_Dashboard_UI.filterPanelInventory()">
                    <option value="">全部持有者</option>
                    ${sortedOwners.map(o => `<option value="${o}">${o}</option>`).join('')}
                    <option value="无">无持有者</option>
                </select>
            </div>
        `;
        $container.append(searchHtml);

        // 1. 已装备区域 (仪表盘样式)
        if (equippedItems.length > 0) {
            const $equipSection = $(`
                <div class="dnd-inv-section-equipped" style="background:var(--dnd-bg-secondary);padding:15px;border-radius:6px;border:1px solid var(--dnd-border-gold);">
                    <div style="font-size:16px;font-weight:bold;color:var(--dnd-text-header);margin-bottom:10px;display:flex;align-items:center;gap:10px;">
                        <span><i class="fa-solid fa-shield-halved"></i> 已装备</span>
                        <span style="font-size:12px;background:var(--dnd-accent-green);color:#fff;padding:2px 6px;border-radius:4px;">${equippedItems.length}</span>
                    </div>
                    <div class="dnd-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;"></div>
                </div>
            `);
            
            const $grid = $equipSection.find('.dnd-grid');
            equippedItems.forEach((i, idx) => {
                const card = ((window as any).DND_Dashboard_UI || this).renderItemCard?.( i, true, idx * 0.05);
                // 为卡片添加 data 属性以便筛选
                const $card = $(card);
                $card.attr('data-name', i['物品名称']);
                $card.attr('data-category', i['类别'] || '杂物');
                $card.attr('data-owner', i['所属人'] || '');
                $grid.append($card);
            });
            $container.append($equipSection);
        }

        // 2. 分类列表 (可折叠)
        Object.keys(categories).forEach(cat => {
            const catItems = categories[cat];
            const $catSection = $(`
                <div class="dnd-inv-category" data-category="${cat}" style="background:var(--dnd-bg-panel);border:1px solid var(--dnd-border-inner);border-radius:4px;overflow:hidden;">
                    <div class="dnd-inv-header" style="padding:10px 15px;background:var(--dnd-bg-secondary);cursor:pointer;display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-weight:bold;color:var(--dnd-text-main);">${cat} (${catItems.length})</span>
                        <span class="dnd-collapse-icon" style="color:var(--dnd-text-dim)">▼</span>
                    </div>
                    <div class="dnd-inv-body" style="padding:15px;display:none;">
                        <div class="dnd-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;"></div>
                    </div>
                </div>
            `);

            const $grid = $catSection.find('.dnd-grid');
            catItems.forEach((i, idx) => {
                const card = ((window as any).DND_Dashboard_UI || this).renderItemCard?.( i, false, idx * 0.05);
                const $card = $(card);
                $card.attr('data-name', i['物品名称']);
                $card.attr('data-category', cat);
                $card.attr('data-owner', i['所属人'] || '');
                $grid.append($card);
            });

            // 折叠逻辑
            $catSection.find('.dnd-inv-header').on('click', function() {
                const $body = $(this).next();
                const $icon = $(this).find('.dnd-collapse-icon');
                if ($body.is(':visible')) {
                    $body.slideUp(200);
                    $icon.text('▼');
                } else {
                    $body.slideDown(200);
                    $icon.text('▲');
                }
            });

            $container.append($catSection);
        });

        $c.html($container);
    },

    // [新增] 主面板物品过滤逻辑
    renderWorldPanel($c) {
        const global = deps.dataManager.getTable('SYS_GlobalState');
        if(!global || !global[0]) { $c.html('无世界数据'); return; }
        const g = global[0];
        $c.html(`
            <div style="background:var(--dnd-bg-panel);padding:20px;border:1px solid var(--dnd-border-gold);">
                <h2 style="color:var(--dnd-text-header);margin-top:0;">${g['当前场景']}</h2>
                <p style="color:var(--dnd-text-main);">${g['场景描述']}</p>
                <hr style="border:0;border-bottom:1px solid var(--dnd-border-subtle);margin:15px 0;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div><span style="color:var(--dnd-text-dim)">时间:</span> ${g['游戏时间']}</div>
                <div><span style="color:var(--dnd-text-dim)">天气:</span> ${g['天气状况']}</div>
                <div><span style="color:var(--dnd-text-dim)">战斗模式:</span> ${g['战斗模式']}</div>
                </div>
            </div>
        `);
    },

    renderLogsPanel($c) {
        const logs = deps.dataManager.getTable('LOG_Summary');
        if(!logs) { $c.html('无日志数据'); return; }
        let html = '<div style="display:flex;flex-direction:column;gap:15px;">';
        [...logs].reverse().forEach(l => {
            html += `
            <div style="background:var(--dnd-bg-secondary);padding:15px;border-left:3px solid var(--dnd-border-gold);">
                <div style="display:flex;justify-content:space-between;color:var(--dnd-text-dim);font-size:12px;margin-bottom:5px;">
                    <span>${l['时间跨度']} @ ${l['地点']}</span>
                    <span>${l['编码索引']}</span>
                </div>
                <div style="color:var(--dnd-text-main);line-height:1.5;">${l['纪要']}</div>
            </div>`;
        });
        html += '</div>';
        $c.html(html);
    },

  };
}
