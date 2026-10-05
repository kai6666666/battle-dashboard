// features/dnd-dice/dice-quickbar-core.ts
// 快捷栏核心（开关 / 渲染）（b9 骰子归一 · 自 BasedonST `src/ui/modules/UIDice.js` 拆分移植并改接 AcuDice）
import { DND_CONFIG } from '../dnd-core';

export function createDiceQuickbarCoreFragment(deps: any): any {
  return {
    quickBarState: false, // hidden
    _quickBarCloseHandler: null,

    toggleQuickBar(forceState = null) {
        const { $ } = deps.utils.getCore();
        
        if (forceState !== null) {
            this.quickBarState = forceState;
        } else {
            this.quickBarState = !this.quickBarState;
        }
        
        const $bar = $('#dnd-quick-bar');
        const $trigger = $('#dnd-quick-trigger');
        
        if (this.quickBarState) {
            $bar.addClass('visible');
            $trigger.text('◀'); // Visible: Show Left Arrow to Collapse
        } else {
            $bar.removeClass('visible');
            $trigger.text('▶'); // Hidden: Show Right Arrow to Expand
        }
    },

    async renderQuickBar(providedSlots = null) {
        const { $ } = deps.utils.getCore();
        const $bar = $('#dnd-quick-bar');
        if (!$bar.length) return;
        
        // 渲染函数
        const render = (currentSlots) => {
            if (!currentSlots) currentSlots = [];
            deps.logger.debug('Rendering quick bar with items:', currentSlots.length);
            
            let html = '';
            currentSlots.forEach((slot, index) => {
                const name = slot.data.name || '???';
                // Change display to show first 4 chars of text name instead of icon
                const shortName = name.substring(0, 4);
                
                html += `
                    <div class="dnd-quick-slot dnd-hover-lift" title="${name}" onclick="window.DND_Dashboard_UI.executeQuickSlot(${index})">
                        ${shortName}
                        <div class="dnd-quick-slot-remove" onclick="event.stopPropagation(); window.DND_Dashboard_UI.removeQuickSlot(${index})"><i class="fa-solid fa-times"></i></div>
                    </div>
                `;
            });
            // 添加按钮 (强制显示)
            html += `
                <div class="dnd-quick-slot add-btn dnd-clickable" title="添加快捷方式" onclick="window.DND_Dashboard_UI.showQuickSlotSelector()">
                    +
                </div>
            `;
            $bar.html(html);
            
            // Trigger is separate
        };
        
        // 如果提供了数据，直接渲染并返回
        if (providedSlots) {
            render(providedSlots);
            return;
        }
        
        // 1. 立即渲染缓存（如果存在）或空状态
        render(this._cachedQuickSlots || []);
        
        // 2. 异步加载数据并更新
        try {
            const saved = await deps.dbAdapter.getSetting(DND_CONFIG.STORAGE_KEYS.QUICK_SLOTS);
            let slots = [];
            if (saved) slots = typeof saved === 'string' ? JSON.parse(saved) : saved;
            
            this._cachedQuickSlots = slots; // Cache it
            render(slots);
        } catch(e) {
            deps.logger.error('Quick slots load error', e);
        }
    },

    //原作者: disocrd类脑 Niccole @niccole0414

  };
}
