// features/dnd-items/items-panels.ts
// 面板（背包/装备/势力/任务提示）（b6 · 自 BasedonST `src/ui/modules/UIItems.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createItemsPanelsFragment(deps: any): any {
  return {
    showInventoryPanel(event) {
        deps.logger.info('showInventoryPanel 被调用', event);
        const items = deps.dataManager.getTable('ITEM_Inventory');
        
        if (!items || items.length === 0) {
            this.showItemDetailPopup(`<div style="text-align:center;color:var(--dnd-text-dim);">${deps.icons.BACKPACK} 背包空空如也</div>`, event.clientX, event.clientY);
            return;
        }
        
        // 过滤未装备物品
        const backpackItems = items.filter(i => {
            const isEq = i['已装备'] === '是' || i['已装备'] === true || String(i['已装备']).toLowerCase() === 'true';
            return !isEq;
        });

        // 获取所有类别
        const categories = [...new Set(backpackItems.map(i => i['类别'] || '杂物'))].sort();
        
        let html = `<div style="font-weight:bold;color:var(--dnd-text-main);border-bottom:1px solid var(--dnd-border-gold);padding-bottom:5px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
            <span>${deps.icons.BACKPACK} 背包物品</span>
            <span style="font-size:11px;color:var(--dnd-text-dim);">${backpackItems.length} 件</span>
        </div>`;

        // 搜索和筛选
        html += `
            <div style="display:flex;gap:5px;margin-bottom:10px;">
                <input type="text" id="dnd-inv-search" placeholder="搜索物品..." style="flex:1;background:var(--dnd-bg-input);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);padding:4px 8px;border-radius:4px;font-size:12px;" oninput="window.DND_Dashboard_UI.filterInventory()">
                <select id="dnd-inv-filter" style="background:var(--dnd-bg-input);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);padding:4px;border-radius:4px;font-size:12px;" onchange="window.DND_Dashboard_UI.filterInventory()">
                    <option value="">全部分类</option>
                    ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
            </div>
        `;

        html += `<div style="max-height:350px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;" id="dnd-inv-list">`;
        
        if (backpackItems.length === 0) {
            html += `<div style="color:var(--dnd-text-dim);text-align:center;padding:10px;">背包中没有未装备的物品</div>`;
        } else {
            backpackItems.forEach(item => {
                const itemId = item['物品ID'] || item['物品名称'];
                const safeId = (itemId || '').replace(/'/g, "\\'");
                const category = item['类别'] || '杂物';
                html += `
                    <div class="dnd-inv-list-item" data-name="${item['物品名称']}" data-category="${category}" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-inner);border-radius:4px;cursor:pointer;font-size:12px;"
                        onmouseover="this.style.background='var(--dnd-bg-tertiary)'"
                        onmouseout="this.style.background='var(--dnd-bg-secondary)'"
                        onclick="window.DND_Dashboard_UI.showMiniItemActions('${safeId}', event)">
                        <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px;display:flex;flex-direction:column;">
                            <span>${item['物品名称']}</span>
                            <span style="font-size:10px;color:var(--dnd-text-dim);">${category} ${item['所属人'] ? ` · <i class="fa-solid fa-user"></i>${item['所属人']}` : ''}</span>
                        </div>
                        <span style="color:var(--dnd-text-dim);flex-shrink:0;">x${item['数量']}</span>
                    </div>
                `;
            });
        }
        html += `</div>`;
        
        this.showItemDetailPopup(html, event.clientX, event.clientY);
    },

    // [新增] 过滤物品列表
    filterInventory() {
        const { $ } = deps.utils.getCore();
        const searchText = $('#dnd-inv-search').val().toLowerCase();
        const filterCat = $('#dnd-inv-filter').val();
        
        $('.dnd-inv-list-item').each(function() {
            const $el = $(this);
            const name = ($el.data('name') || '').toLowerCase();
            const category = ($el.data('category') || '');
            
            const matchSearch = !searchText || name.includes(searchText);
            const matchFilter = !filterCat || category === filterCat;
            
            if (matchSearch && matchFilter) {
                $el.show();
            } else {
                $el.hide();
            }
        });
    },

    // [新增] 显示装备面板
    showEquipmentPanel(event) {
        const items = deps.dataManager.getTable('ITEM_Inventory');
        if (!items) {
            this.showItemDetailPopup(`<div style="text-align:center;color:var(--dnd-text-dim);">${deps.icons.SWORD} 无装备数据</div>`, event.clientX, event.clientY);
            return;
        }
        
        // 过滤已装备物品
        const equippedItems = items.filter(i => {
            const isEq = i['已装备'] === '是' || i['已装备'] === true || String(i['已装备']).toLowerCase() === 'true';
            return isEq;
        });
        
        let html = `<div style="font-weight:bold;color:var(--dnd-text-highlight);border-bottom:1px solid var(--dnd-border-gold);padding-bottom:5px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
            <span>${deps.icons.SWORD} 已装备</span>
            <span style="font-size:11px;color:var(--dnd-text-dim);">${equippedItems.length} 件</span>
        </div>`;
        html += `<div style="max-height:350px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;">`;
        
        if (equippedItems.length === 0) {
            html += `<div style="color:var(--dnd-text-dim);text-align:center;padding:10px;">尚未装备任何物品</div>`;
        } else {
            equippedItems.forEach(item => {
                const itemId = item['物品ID'] || item['物品名称'];
                const safeId = (itemId || '').replace(/'/g, "\\'");
                html += `
                    <div class="dnd-inv-list-item" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:var(--dnd-selected-bg);border:1px solid var(--dnd-border-gold);border-radius:4px;cursor:pointer;font-size:12px;"
                        onmouseover="this.style.background='var(--dnd-bg-tertiary)'"
                        onmouseout="this.style.background='var(--dnd-selected-bg)'"
                        onclick="window.DND_Dashboard_UI.showMiniItemActions('${safeId}', event)">
                        <div style="display:flex;flex-direction:column;overflow:hidden;max-width:180px;">
                            <span style="color:var(--dnd-text-highlight);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><i class="fa-solid fa-shield-halved"></i> ${item['物品名称']}</span>
                            ${item['所属人'] ? `<span style="font-size:10px;color:var(--dnd-accent-blue);"><i class="fa-solid fa-user"></i> ${item['所属人']}</span>` : ''}
                        </div>
                        <span style="color:var(--dnd-text-dim);flex-shrink:0;">${item['类别'] || '-'}</span>
                    </div>
                `;
            });
        }
        html += `</div>`;
        
        this.showItemDetailPopup(html, event.clientX, event.clientY);
    },

    // [新增] 显示势力声望面板
    showFactionPanel(event) {
        const factions = deps.dataManager.getTable('FACTION_Standing');
        if (!factions || factions.length === 0) return;
        
        let html = `
            <div style="font-weight:bold;color:var(--dnd-text-highlight);border-bottom:1px solid var(--dnd-border-subtle);padding-bottom:5px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
                <span>🏛️ 势力与声望</span>
                <span style="font-size:11px;color:var(--dnd-text-dim);">${factions.length} 个势力</span>
            </div>
            <div style="max-height:400px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;">
        `;
        
        factions.forEach(f => {
            const relation = parseInt(f['关系等级']) || 0;
            let icon = '<i class="fa-solid fa-scale-balanced"></i>';
            let color = 'var(--dnd-text-dim)';
            let statusText = '中立';
            let percent = 50; // 中立默认 50%
            
            if (relation > 0) {
                icon = '<i class="fa-solid fa-handshake"></i>';
                color = 'var(--dnd-accent-green)';
                statusText = '友好';
                percent = Math.min(100, 50 + (relation * 5));
            } else if (relation < 0) {
                icon = '<i class="fa-solid fa-skull"></i>';
                color = 'var(--dnd-accent-red)';
                statusText = '敌对';
                percent = Math.max(0, 50 + (relation * 5));
            }
            
            const repVal = f['声望值'] || 0;
            
            // 势力类型图标映射
            const typeIcons = {
                '王国': '<i class="fa-solid fa-crown"></i>',
                '公会': '<i class="fa-solid fa-users"></i>',
                '教团': '<i class="fa-solid fa-cross"></i>',
                '商会': '<i class="fa-solid fa-coins"></i>',
                '秘社': '<i class="fa-solid fa-eye-slash"></i>',
                '部落': '<i class="fa-solid fa-campground"></i>',
                '军团': '<i class="fa-solid fa-shield"></i>',
                '其他': '<i class="fa-solid fa-flag"></i>'
            };
            const factionType = f['势力类型'] || '其他';
            const typeIcon = typeIcons[factionType] || typeIcons['其他'];

            //原作者: disocrd类脑 Niccole @niccole0414
            
            html += `
                <div class="dnd-faction-item" style="padding:10px;background:var(--dnd-bg-card);border:1px solid var(--dnd-border-inner);border-radius:6px;">
                    <!-- 势力标题行 -->
                    <div class="dnd-faction-header" style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:${color};font-size:14px;font-weight:bold;">${icon} ${f['势力名称']}</span>
                        <span style="font-size:11px;background:var(--dnd-bg-tertiary);padding:2px 8px;border-radius:3px;">${statusText} (${relation})</span>
                    </div>
                    
                    <!-- 势力类型和领袖 -->
                    <div style="display:flex;gap:12px;font-size:11px;color:var(--dnd-text-dim);margin-top:6px;flex-wrap:wrap;">
                        <span title="势力类型">${typeIcon} ${factionType}</span>
                        ${f['势力领袖'] ? `<span title="势力领袖"><i class="fa-solid fa-user-tie"></i> ${f['势力领袖']}</span>` : ''}
                        ${f['势力总部'] ? `<span title="势力总部"><i class="fa-solid fa-location-dot"></i> ${f['势力总部']}</span>` : ''}
                    </div>
                    
                    <!-- 势力宗旨 -->
                    ${f['势力宗旨'] ? `
                    <div style="font-size:11px;color:var(--dnd-text-highlight);margin-top:6px;padding:4px 8px;background:var(--dnd-selected-bg);border-left:2px solid var(--dnd-border-gold);border-radius:2px;">
                        <i class="fa-solid fa-scroll"></i> ${f['势力宗旨']}
                    </div>
                    ` : ''}
                    
                    <!-- 势力描述 -->
                    <div style="font-size:11px;color:var(--dnd-text-dim);margin-top:6px;line-height:1.4;">
                        ${f['势力描述'] || '暂无描述'}
                    </div>
                    
                    <!-- 声望条 -->
                    <div style="display:flex;align-items:center;gap:8px;font-size:10px;color:var(--dnd-text-dim);margin-top:8px;">
                        <span>声望: ${repVal}</span>
                        <div class="dnd-faction-rep-bar" style="flex:1;height:6px;background:var(--dnd-bg-tertiary);border-radius:3px;overflow:hidden;">
                            <div class="dnd-faction-rep-fill" style="width:${percent}%;height:100%;background:${color};transition:width 0.3s;"></div>
                        </div>
                    </div>
                    
                    <!-- 主角在势力中的信息 -->
                    ${(f['主角头衔'] || f['特权/通缉']) ? `
                    <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--dnd-border-subtle);">
                        <div style="font-size:10px;color:var(--dnd-text-dim);margin-bottom:4px;"><i class="fa-solid fa-id-card"></i> 主角身份</div>
                        <div style="display:flex;gap:10px;font-size:11px;flex-wrap:wrap;">
                            ${f['主角头衔'] ? `<span style="color:var(--dnd-text-highlight);"><i class="fa-solid fa-medal"></i> ${f['主角头衔']}</span>` : ''}
                            ${f['特权/通缉'] ? `<span style="color:${relation >= 0 ? 'var(--dnd-accent-green)' : 'var(--dnd-accent-red)'};"><i class="fa-solid fa-scroll"></i> ${f['特权/通缉']}</span>` : ''}
                        </div>
                    </div>
                    ` : ''}
                    
                    <!-- 关键事件 -->
                    ${f['关键事件'] ? `
                    <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--dnd-border-subtle);">
                        <div style="font-size:10px;color:var(--dnd-text-dim);margin-bottom:4px;"><i class="fa-solid fa-book"></i> 关键事件</div>
                        <div style="font-size:11px;color:var(--dnd-text-main);line-height:1.4;">${f['关键事件']}</div>
                    </div>
                    ` : ''}
                </div>
            `;
        });
        
        html += `</div>`;
        
        this.showItemDetailPopup(html, event.clientX, event.clientY);
    },

    // [修复] 显示任务详情 - 统一使用 showItemDetailPopup (与装备实现保持一致)
    showQuestTooltip(quest, x, y) {
        deps.logger.info('showQuestTooltip 被调用', quest['任务名称']);
        
        const statusColor = quest['状态'] === '已完成' ? 'var(--dnd-accent-green)' : (quest['状态'] === '已失败' ? 'var(--dnd-accent-red)' : 'var(--dnd-text-highlight)');
        
        const html = `
            <div style="border-bottom:1px solid var(--dnd-border-gold);padding-bottom:5px;margin-bottom:10px;font-weight:bold;color:var(--dnd-text-highlight);font-size:16px;display:flex;justify-content:space-between;align-items:center;">
                <span>${deps.icons.SCROLL} ${quest['任务名称']}</span>
                <span style="font-size:11px;background:${statusColor};color:#fff;padding:2px 6px;border-radius:4px;">${quest['状态'] || '进行中'}</span>
            </div>
            
            <div style="font-size:13px;line-height:1.5;margin-bottom:15px;color:var(--dnd-text-main);">
                ${quest['目标描述'] || '暂无描述'}
            </div>
            
            ${quest['当前进度'] ? `
            <div style="margin-bottom:10px;padding:6px 8px;background:var(--dnd-bg-tertiary);border-left:2px solid var(--dnd-border-gold);border-radius:2px;">
                <div style="font-size:11px;color:var(--dnd-text-dim);margin-bottom:2px;">当前进度</div>
                <div style="font-size:12px;color:var(--dnd-text-main);">${quest['当前进度']}</div>
            </div>` : ''}
            
            <div style="font-size:12px;color:var(--dnd-text-dim);background:var(--dnd-bg-secondary);padding:8px;border-radius:4px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
                    <div><strong>发布者:</strong> ${quest['发布者']||'-'}</div>
                    <div><strong>类型:</strong> ${quest['类型']||'-'}</div>
                    <div><strong>时限:</strong> ${quest['时限']||'无限制'}</div>
                    <div><strong>难度:</strong> ${quest['难度']||'-'}</div>
                </div>
                <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--dnd-border-subtle);color:var(--dnd-text-highlight);">
                    <strong>${deps.icons.TROPHY} 奖励:</strong> ${quest['奖励']||'-'}
                </div>
            </div>
        `;
        
        this.showItemDetailPopup(html, x, y);
    }
  };
}
