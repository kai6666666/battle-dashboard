// features/dnd-items/items-actions.ts
// 物品操作（快捷动作/执行）（b6 · 自 BasedonST `src/ui/modules/UIItems.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createItemsActionsFragment(deps: any): any {
  return {
    showMiniItemActions(itemOrId, e) {
        // [修复] 支持传递 ID 字符串或对象
        let item = itemOrId;
        const items = deps.dataManager.getTable('ITEM_Inventory');

        if (typeof itemOrId === 'string') {
            item = items ? items.find(i => (i['物品ID'] === itemOrId) || (i['物品名称'] === itemOrId)) : null;
        }
        if (!item) return;

        const itemId = item['物品ID'] || item['物品名称'];
        const isEquipped = item['已装备'] === '是' || item['已装备'] === true || String(item['已装备']).toLowerCase() === 'true';
        
        // 确保获取完整信息 (如果是从对象传递的可能不完整)
        const fullItem = items ? items.find(i => (i['物品ID'] === itemId) || (i['物品名称'] === itemId)) : item;
        
        const actions = [
            { label: isEquipped ? '卸下' : '装备', icon: '<i class="fa-solid fa-shield-halved"></i>', action: 'equip' },
            { label: '使用/消耗', icon: '<i class="fa-solid fa-flask"></i>', action: 'use' },
            { label: '丢弃', icon: '<i class="fa-solid fa-trash"></i>', action: 'drop' }
        ];
        
        let html = `<div style="display:flex;flex-direction:column;gap:5px;">`;
        html += `<div style="font-weight:bold;color:var(--dnd-text-highlight);border-bottom:1px solid var(--dnd-border-subtle);padding-bottom:5px;margin-bottom:5px;">
            ${fullItem['物品名称']}
            ${isEquipped ? '<span style="font-size:10px;background:var(--dnd-accent-green);color:#fff;padding:1px 4px;border-radius:3px;margin-left:5px;">已装备</span>' : ''}
        </div>`;
        
        // 显示简要信息
        html += `<div style="font-size:11px;color:var(--dnd-text-dim);margin-bottom:5px;padding:4px 6px;background:var(--dnd-bg-tertiary);border-radius:3px;">
            <div>类别: ${fullItem['类别'] || '-'} | 数量: ${fullItem['数量'] || 1}</div>
            ${fullItem['价值'] ? `<div>价值: ${fullItem['价值']}</div>` : ''}
        </div>`;

        // Description with collapse/expand
        const desc = fullItem['描述'] || '暂无描述';
        html += `
            <div style="font-size:12px;color:var(--dnd-text-main);line-height:1.5;margin-bottom:8px;padding:5px;background:var(--dnd-bg-secondary);border-radius:4px;border-left:2px solid var(--dnd-border-inner);cursor:pointer;max-height:60px;overflow:hidden;transition:max-height 0.3s ease-out;text-overflow:ellipsis;"
                onclick="this.style.maxHeight = this.style.maxHeight==='60px' ? '500px' : '60px'"
                title="点击展开/收起">
                ${desc}
            </div>
        `;
        
        actions.forEach(act => {
            html += `
                    <div style="cursor:pointer;padding:6px 10px;border-radius:4px;display:flex;align-items:center;gap:8px;font-size:13px;" 
                        onmouseover="this.style.background='var(--dnd-bg-tertiary)'" 
                        onmouseout="this.style.background='transparent'"
                    onclick="window.DND_Dashboard_UI.handleItemAction('${itemId}', '${act.action}', ${fullItem['数量'] || 1})">
                    <span>${act.icon}</span> <span>${act.label}</span>
                </div>
            `;
        });
        html += `</div>`;
        
        // 计算合适的位置，避免弹出屏幕
        const x = e.clientX;
        const y = e.clientY;
        
        this.showItemDetailPopup(html, x, y);
    },

    async handleItemAction(itemId, action, currentQty) {
        this.hideDetailPopup();
        
        if (typeof ItemManager === 'undefined') {
            console.error('ItemManager not loaded');
            return;
        }

        const items = deps.dataManager.getTable('ITEM_Inventory') || [];
        const item = items.find(i => (i['物品ID'] === itemId) || (i['物品名称'] === itemId));
        const itemName = item ? item['物品名称'] : itemId; // 优先使用名称，找不到则回退 ID

        if (action === 'equip') {
            // 获取最新状态
            const items = deps.dataManager.getTable('ITEM_Inventory');
            const item = items.find(i => (i['物品ID'] === itemId) || (i['物品名称'] === itemId));
            if (item) {
                const isEquipped = item['已装备'] === '是' || item['已装备'] === true || String(item['已装备']).toLowerCase() === 'true';
                const actionVerb = isEquipped ? '卸下了' : '装备了';
                
                const global = deps.dataManager.getTable('SYS_GlobalState');
                const isCombat = global && global[0] && global[0]['战斗模式'] === '战斗中';
                const activeChar = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
                const charName = activeChar ? activeChar['姓名'] : '我';
                const charId = activeChar ? (activeChar['CHAR_ID'] || activeChar['PC_ID'] || activeChar['姓名']) : 'default';

                if (isCombat) {
                    this._actionQueue.push({
                        type: 'item',
                        data: { target: null },
                        desc: `${actionVerb} 【${itemName}】`,
                        charName: charName,
                        charId: charId
                    });
                    ((window as any).DND_Dashboard_UI || this).renderHUD?.( );
                    deps.notification.success(`已将${actionVerb}动作加入队列`);
                } else {
                    ((window as any).DND_Dashboard_UI || this).fillChatInput?.( `${charName}${actionVerb}了1个${itemName}（${itemId}）`);
                }
            }
        }
        else if (action === 'use' || action === 'drop') {
            const actionName = action === 'use' ? '使用' : '丢弃';
            const confirmed = await deps.notification.confirm(`确定要在剧情中${actionName} 1 个 ${itemId} 吗？`, {
                title: `${actionName}物品`,
                confirmText: actionName,
                type: action === 'drop' ? 'danger' : 'info'
            });
            
            if (confirmed) {
                // [核心修复]：彻底移除 deps.itemManager.update 删库操作！
                // 完美对齐 UICombat.js 的队列逻辑，使用 this 直接操作
                
                const global = deps.dataManager.getTable('SYS_GlobalState');
                const isCombat = global && global[0] && global[0]['战斗模式'] === '战斗中';
                
                const activeChar = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
                const charName = activeChar ? activeChar['姓名'] : '我';
                const charId = activeChar ? (activeChar['CHAR_ID'] || activeChar['PC_ID'] || activeChar['姓名']) : 'default';

                if (isCombat) {
                    // 战斗中：加入行动队列
                    this._actionQueue.push({
                        type: 'item',
                        data: { target: null },
                        desc: `${actionName}了1个${itemName}（${itemId}）`, // 这里的格式将完美契合 commitActions 的拼接
                        charName: charName,
                        charId: charId
                    });
                    
                    ((window as any).DND_Dashboard_UI || this).renderHUD?.( ); // 刷新右下角的待执行队列显示
                    deps.notification.success(`已将${itemName}物品加入行动队列`);
                } else {
                    // 非战斗中：直接发送提示词
                    ((window as any).DND_Dashboard_UI || this).fillChatInput?.( `${charName}${actionName}了1个${itemName}（${itemId}）`);
                }
            }
        }
    },

    // [修复] 显示背包面板 - 统一使用 showItemDetailPopup (与装备实现保持一致)
  };
}
