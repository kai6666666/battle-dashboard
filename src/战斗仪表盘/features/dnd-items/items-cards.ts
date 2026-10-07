// features/dnd-items/items-cards.ts
// 物品卡 / 详情 / 弹窗（b6 · 自 BasedonST `src/ui/modules/UIItems.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createItemsCardsFragment(deps: any): any {
  return {
    renderItemCard(item, isEquippedHighlight, delay = 0) {
        // 注意：因为 item 对象可能包含特殊字符，传递整个对象给 onclick 会有问题
        // 所以我们只传递 ID，然后在 showItemDetail 中重新查找
        // 或者将对象存储在 DOM data 属性中
        const isEquipped = item['已装备'] === '是' || item['已装备'] === true || String(item['已装备']).toLowerCase() === 'true';
        const bg = isEquippedHighlight ? 'background:var(--dnd-selected-bg);border-color:var(--dnd-border-gold);' : '';
        
        // 使用 data-item-id 存储 ID，避免 onclick 传递复杂对象
        const itemId = item['物品ID'] || item['物品名称'];
        const safeId = (itemId || '').replace(/'/g, "\\'");
        
        // [Feature 4] 更多属性
        const damage = item['伤害'] || item['damage'] || '';
        const properties = item['特性'] || item['properties'] || '';
        const rarity = item['稀有度'] || item['rarity'] || '普通';
        const owner = item['所属人'] || '';

        //change
        const rarityStyles = {
            '普通': { bg: 'rgba(255,255,255,0.1)', color: '#aaa' },
            '优秀': { bg: 'var(--dnd-accent-green)', color: '#fff' },
            '稀有': { bg: 'var(--dnd-accent-blue)', color: '#fff' },
            '史诗': { bg: '#9333ea', color: '#fff' },
            '传说': { bg: 'var(--dnd-border-gold)', color: '#000' },
            '神器': { bg: 'var(--dnd-accent-red)', color: '#fff' }
        };
        const style = rarityStyles[rarity] || { bg: '#444', color: '#ccc' };
        
        // 生成 HTML
        return `
            <div style="background:var(--dnd-bg-secondary);padding:10px;border:1px solid var(--dnd-border-inner);border-radius:4px;position:relative;cursor:pointer;animation-delay:${delay}s;${bg}"
                class="dnd-item-card dnd-anim-entry dnd-clickable"
                onclick="window.DND_Dashboard_UI.showItemDetail('${safeId}', event)">
                <div style="font-weight:bold;color:${isEquipped ? 'var(--dnd-text-highlight)' : 'var(--dnd-text-main)'};margin-bottom:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${item['物品名称']}
                    ${isEquipped ? '<i class="fa-solid fa-shield-halved" style="float:right;font-size:12px;color:var(--dnd-text-highlight)"></i>' : ''}
                </div>
                
                ${damage ? `<div class="dnd-item-damage"><i class="fa-solid fa-gavel"></i> ${damage}</div>` : ''}

                <div style="font-size:12px;color:var(--dnd-text-dim);display:flex;justify-content:space-between;margin-top:4px;">
                    <span>x${item['数量']}</span>
                    <span>${item['价值'] || '-'}</span>
                </div>
                
                ${properties ? `<div class="dnd-item-props">${properties}</div>` : ''}
                
                <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:4px;">
                    <div class="dnd-item-rarity" style="background:${style.bg}; color:${style.color}; padding:1px 6px; border-radius:3px; font-size:10px; font-weight:bold; text-transform:uppercase;">${rarity}</div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;">
                        ${owner ? `<div style="font-size:10px;color:var(--dnd-text-highlight);background:var(--dnd-bg-tertiary);padding:1px 4px;border-radius:2px;margin-bottom:2px;"><i class="fa-solid fa-user"></i> ${owner}</div>` : ''}
                        ${item['重量'] ? `<div style="font-size:11px;color:var(--dnd-text-dim);">${item['重量']} lb</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    showItemDetail(itemId, event) {
        if (event) { event.stopPropagation(); }
        
        const items = deps.dataManager.getTable('ITEM_Inventory');
        if (!items) return;
        
        const item = items.find(i => (i['物品ID'] === itemId) || (i['物品名称'] === itemId));
        if (!item) return;
        
        const isEquipped = item['已装备'] === '是' || item['已装备'] === true || String(item['已装备']).toLowerCase() === 'true';
        
        // [Feature 4] 详细属性
        const detailFields = [
            { key: '所属人', icon: '<i class="fa-solid fa-user"></i>', label: '持有者' },
            { key: '伤害', icon: '<i class="fa-solid fa-gavel"></i>', label: '伤害' },
            { key: '护甲等级', icon: '<i class="fa-solid fa-shield-halved"></i>', label: 'AC' },
            { key: '特性', icon: '<i class="fa-solid fa-bolt"></i>', label: '特性' },
            { key: '稀有度', icon: '<i class="fa-solid fa-gem"></i>', label: '稀有度' },
            { key: '重量', icon: '<i class="fa-solid fa-weight-hanging"></i>', label: '重量' },
            { key: '价值', icon: '<i class="fa-solid fa-coins"></i>', label: '价值' },
            { key: '需求', icon: '<i class="fa-solid fa-list"></i>', label: '需求' },
            { key: '类别', icon: '<i class="fa-solid fa-tag"></i>', label: '类别' },
            { key: '数量', icon: '<i class="fa-solid fa-sort-numeric-down"></i>', label: '数量' }
        ];

        let detailHtml = '';
        detailFields.forEach(field => {
            // 尝试中文key，如果不行尝试英文key (简单映射)
            let val = item[field.key];
            if (!val && field.key === '护甲等级') val = item['AC'];
            
            if (val) {
                detailHtml += `
                    <div class="dnd-item-detail-row">
                        <span class="dnd-item-detail-icon">${field.icon}</span>
                        <span class="dnd-item-detail-label">${field.label}:</span>
                        <span class="dnd-item-detail-value">${val}</span>
                    </div>
                `;
            }
        });

        const html = `
            <div style="color:var(--dnd-text-highlight);font-weight:bold;font-size:16px;border-bottom:1px solid var(--dnd-border-gold);padding-bottom:5px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
                <span>${item['物品名称']}</span>
                ${isEquipped ? '<span style="font-size:12px;background:var(--dnd-accent-green);color:#fff;padding:2px 6px;border-radius:4px;">已装备</span>' : ''}
            </div>
            
            <div style="margin-bottom:15px;background:var(--dnd-bg-secondary);padding:10px;border-radius:4px;font-size:12px;">
                ${detailHtml}
            </div>
            
            <div style="line-height:1.6;color:var(--dnd-text-main);font-size:13px;">
                ${item['描述'] || '暂无描述'}
            </div>
            <div style="margin-top:15px;font-size:10px;color:var(--dnd-text-dim);text-align:right;">ID: ${item['物品ID'] || '-'}</div>
        `;
        
        const { window: coreWin } = deps.utils.getCore();
        this.showItemDetailPopup(html, event ? event.clientX : coreWin.innerWidth/2, event ? event.clientY : coreWin.innerHeight/2);
    },

    showItemDetailPopup(contentHtml, x, y) {
        console.log(`[DND Dashboard] showItemDetailPopup called at ${x},${y}`);
        const { $, window: coreWin } = deps.utils.getCore();
        let $popup = $('#dnd-detail-popup-el');
        let $backdrop = $('#dnd-popup-backdrop-el');
        
        // 创建遮罩层（如果不存在）
        if (!$backdrop.length) {
            $backdrop = $('<div id="dnd-popup-backdrop-el" class="dnd-popup-backdrop"></div>');
            $('body').append($backdrop);
            
            // 点击遮罩层关闭悬浮窗 - 最简单可靠的方式
            const self = this;
            $backdrop.on('click', () => {
                self.hideDetailPopup();
            });
        }
        
        if (!$popup.length) {
            $popup = $('<div id="dnd-detail-popup-el" class="dnd-detail-popup" style="max-height:80vh;overflow-y:auto;"></div>');
            $('body').append($popup);
        }

        // 添加关闭按钮到内容顶部
        const closeBtn = `<div class="dnd-popup-close-btn" style="position:absolute;top:8px;right:8px;cursor:pointer;color:var(--dnd-text-highlight);font-size:17px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10);transition:all 0.2s;" onmouseover="this.style.background='var(--dnd-bg-tertiary)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'"><i class="fa-solid fa-times"></i></div>`;
        $popup.html(closeBtn + '<div style="padding-right:20px;">' + contentHtml + '</div>');
        // [b12.6] 关闭按钮：脚本绑定（替代 inline onclick，兼容宿主环境）
        $popup.off('click.dndPopupClose').on('click.dndPopupClose', '.dnd-popup-close-btn', (e) => {
            e.stopPropagation();
            this.hideDetailPopup();
        });
        
        // 使用 coreWin 获取正确的窗口尺寸（兼容 iframe）
        const winW = coreWin.innerWidth || $(coreWin).width() || window.innerWidth || 800;
        const winH = coreWin.innerHeight || $(coreWin).height() || window.innerHeight || 600;
        const isMobile = winW < 768;
        const padding = 10;
        
        if (isMobile) {
            // 移动端：水平方向由 CSS 控制 (left:10px, right:10px)
            // 只需计算垂直位置
            
            // 先显示以便测量高度
            $popup.css({
                display: 'block',
                visibility: 'hidden',
                opacity: 0,
                top: '-9999px',
                left: '', // 清除，让 CSS 生效
                right: ''
            }).addClass('visible');
            
            const popH = $popup.outerHeight() || 200;
            
            // 垂直方向：优先显示在点击位置下方
            let top = y + 15;
            
            // 如果下方放不下，显示在上方
            if (top + popH > winH - padding) {
                top = y - popH - 10;
            }
            
            // 边界约束
            if (top < padding) top = padding;
            if (top + popH > winH - padding) {
                top = Math.max(padding, winH - popH - padding);
            }
            
            // 应用位置 (水平方向不设置，让 CSS @media 规则生效)
            $popup.css({
                top: top + 'px',
                left: '', // 保持空让 CSS 生效
                right: '', // 保持空让 CSS 生效
                bottom: 'auto',
                visibility: 'visible',
                opacity: 1,
                display: 'block'
            });
        } else {
            // 桌面端：基于鼠标位置智能定位
            // 1. 先设置 display:block 但 opacity:0，以便测量
            $popup.css({
                display: 'block',
                visibility: 'hidden',
                opacity: 0,
                left: '-9999px',
                top: '-9999px'
            }).addClass('visible');
            
            const popW = $popup.outerWidth() || 280;
            const popH = $popup.outerHeight() || 200;
            
            console.log(`[DND Dashboard] Popup measuring: win=${winW}x${winH}, pop=${popW}x${popH}, mouse=${x},${y}`);

            // 2. 计算位置 - 优先显示在鼠标右下
            let left = x + 15;
            let top = y + 15;
            
            // 水平方向检查：如果右侧放不下，尝试放左侧
            if (left + popW > winW - padding) {
                left = x - popW - 15;
            }
            
            // 垂直方向检查：如果下方放不下，尝试放上方
            if (top + popH > winH - padding) {
                top = y - popH - 10;
            }
            
            // 3. 最终边界强制约束
            if (left < padding) left = padding;
            if (top < padding) top = padding;
            if (left + popW > winW - padding) {
                left = Math.max(padding, winW - popW - padding);
            }
            if (top + popH > winH - padding) {
                top = Math.max(padding, winH - popH - padding);
            }
            
            // 4. 应用位置并显示
            $popup.css({
                top: top + 'px',
                left: left + 'px',
                bottom: 'auto',
                right: 'auto',
                visibility: 'visible',
                opacity: 1,
                display: 'block'
            });
        }
        
        // 显示遮罩层
        $backdrop.addClass('visible');
    },

    hideDetailPopup() {
        const { $ } = deps.utils.getCore();
        // 隐藏悬浮窗
        $('#dnd-detail-popup-el').removeClass('visible').css('display', 'none');
        // 隐藏遮罩层
        $('#dnd-popup-backdrop-el').removeClass('visible');
    },

  };
}
