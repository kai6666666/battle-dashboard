// features/dnd-dice/dice-quickbar-slots.ts
// 快捷栏槽位（选择器 / 增删 / 执行）（b9 骰子归一 · 自 BasedonST `src/ui/modules/UIDice.js` 拆分移植并改接 AcuDice）
import { DND_CONFIG } from '../dnd-core';

export function createDiceQuickbarSlotsFragment(deps: any): any {
  return {
    showQuickSlotSelector() {
        const { $ } = deps.utils.getCore();
        
        // 获取数据
        const items = deps.dataManager.getTable('ITEM_Inventory') || [];
        // 获取当前操控角色 ID
        const char = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
        const charId = char ? (char['PC_ID'] || char['CHAR_ID'] || char['姓名']) : null;
        
        // [修复] 过滤掉法术，避免在技能栏重复显示
        const allSkills = charId ? deps.dataManager.getCharacterSkills(charId) : [];
        const skills = allSkills.filter(s => s['技能类型'] !== '法术');
        
        const spells = charId ? deps.dataManager.getKnownSpells(charId) : [];
        
        // 辅助转义函数 (解决 HTML 属性中的引号问题)
        const esc = (str) => {
            if (str === null || str === undefined) return '';
            return String(str).replace(/'/g, "\\'").replace(/"/g, '"');
        };
        
        // 构建 HTML
        const html = `
            <div style="font-weight:bold;color:var(--dnd-text-highlight);border-bottom:1px solid var(--dnd-border-subtle);padding-bottom:10px;margin-bottom:15px;text-align:center;">
                添加快捷方式
            </div>
            
            <div style="display:flex;gap:10px;margin-bottom:15px;border-bottom:1px solid var(--dnd-border-subtle);">
                <div class="dnd-tab-btn active" data-tab="items" onclick="window.DND_Dashboard_UI.switchQuickTab('items')" style="padding:8px 15px;cursor:pointer;border-bottom:2px solid var(--dnd-border-gold);">${deps.icons.BACKPACK} 物品</div>
                <div class="dnd-tab-btn" data-tab="skills" onclick="window.DND_Dashboard_UI.switchQuickTab('skills')" style="padding:8px 15px;cursor:pointer;border-bottom:2px solid transparent;color:var(--dnd-text-dim);">${deps.icons.SPARKLES} 技能</div>
                <div class="dnd-tab-btn" data-tab="spells" onclick="window.DND_Dashboard_UI.switchQuickTab('spells')" style="padding:8px 15px;cursor:pointer;border-bottom:2px solid transparent;color:var(--dnd-text-dim);">${deps.icons.SCROLL} 法书</div>
            </div>
            
            <div id="dnd-quick-tab-items" class="dnd-quick-tab-content" style="max-height:300px;overflow-y:auto;display:flex;flex-direction:column;gap:5px;">
                ${items.map(i => {
                    const name = i['物品名称'];
                    const id = i['物品ID'] || name;
                    // 使用 data 属性传递数据，避免 HTML 生成错误
                    return `<div class="dnd-clickable" style="padding:8px;background:var(--dnd-bg-secondary);border-radius:4px;cursor:pointer;"
                            data-type="item" data-name="${esc(name)}" data-id="${esc(id)}" data-icon="backpack" data-level=""
                            onclick="window.DND_Dashboard_UI.handleAddClick(this)">${name}</div>`;
                }).join('') || '<div style="text-align:center;color:var(--dnd-text-dim)">无物品</div>'}
            </div>
            
            <div id="dnd-quick-tab-skills" class="dnd-quick-tab-content" style="max-height:300px;overflow-y:auto;display:none;flex-direction:column;gap:5px;">
                ${skills.map(s => {
                    const name = s['技能名称'];
                    const level = s['环阶'] || s['等级'] || '';
                    const levelLabel = (level && level !== '0' && level !== '戏法') ? `(${level}环)` : '';
                    
                    return `<div class="dnd-clickable" style="padding:8px;background:var(--dnd-bg-secondary);border-radius:4px;cursor:pointer;display:flex;justify-content:space-between;"
                            data-type="skill" data-name="${esc(name)}" data-id="" data-icon="sparkles" data-level="${esc(level)}"
                            onclick="window.DND_Dashboard_UI.handleAddClick(this)">
                            <span>${name}</span> <span style="font-size:11px;color:var(--dnd-text-dim);">${levelLabel}</span>
                            </div>`;
                }).join('') || '<div style="text-align:center;color:var(--dnd-text-dim)">无技能</div>'}
            </div>
            
            <div id="dnd-quick-tab-spells" class="dnd-quick-tab-content" style="max-height:300px;overflow-y:auto;display:none;flex-direction:column;gap:5px;">
                ${spells.map(s => {
                    const name = s['法术名称'];
                    const level = s['环阶'] === '0' || s['环阶'] === 0 ? '戏法' : (s['环阶']+'环');
                    return `<div class="dnd-clickable" style="padding:8px;background:var(--dnd-bg-secondary);border-radius:4px;cursor:pointer;display:flex;justify-content:space-between;"
                            data-type="skill" data-name="${esc(name)}" data-id="" data-icon="scroll" data-level="${esc(s['环阶'])}"
                            onclick="window.DND_Dashboard_UI.handleAddClick(this)">
                            <span>${name}</span><span style="color:var(--dnd-text-dim);font-size:11px;">${level}</span>
                            </div>`;
                }).join('') || '<div style="text-align:center;color:var(--dnd-text-dim)">无法术</div>'}
            </div>
        `;
        
        const { window: coreWin } = deps.utils.getCore();
        const winW = coreWin.innerWidth || $(coreWin).width();
        const winH = coreWin.innerHeight || $(coreWin).height();
        ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.( html, winW/2 - 150, winH/2 - 200);
    },

    switchQuickTab(tabName) {
        const { $ } = deps.utils.getCore();
        $('.dnd-tab-btn').css({borderBottomColor:'transparent', color:'var(--dnd-text-dim)'}).removeClass('active');
        $(`.dnd-tab-btn[data-tab="${tabName}"]`).css({borderBottomColor:'var(--dnd-border-gold)', color:'var(--dnd-text-main)'}).addClass('active');
        
        $('.dnd-quick-tab-content').hide();
        $(`#dnd-quick-tab-${tabName}`).css('display', 'flex');
    },

    // [新增] 处理添加点击 (从 data 属性读取)
    handleAddClick(el) {
        const { $ } = deps.utils.getCore();
        const $el = $(el);
        deps.logger.info('handleAddClick triggered for:', $el.data('name'));
        this.addQuickSlot(
            $el.data('type'),
            $el.data('name'),
            $el.data('id'),
            $el.data('icon'),
            $el.data('level')
        );
    },

    async addQuickSlot(type, name, id, icon, level) {
        name = name || '未命名';
        id = String(id || '');
        icon = icon || 'question';
        level = String(level || '');

        const data = { name, id, icon, level };
        deps.logger.info('[DND Dashboard] Adding quick slot:', type, data);
        
        let slots = [];
        // 优先使用缓存
        if (this._cachedQuickSlots) {
            slots = [...this._cachedQuickSlots];
        } else {
            try {
                const saved = await deps.dbAdapter.getSetting(DND_CONFIG.STORAGE_KEYS.QUICK_SLOTS);
                if (saved) slots = typeof saved === 'string' ? JSON.parse(saved) : saved;
            } catch(e) { deps.logger.error('Load Error:', e); }
        }
        
        slots.push({ type, data });
        
        // 1. 立即更新缓存和UI (乐观更新)
        this._cachedQuickSlots = slots;
        this.renderQuickBar(slots);
        ((window as any).DND_Dashboard_UI || this).hideDetailPopup?.( );
        
        // 2. 后台保存
        deps.utils.safeSave(DND_CONFIG.STORAGE_KEYS.QUICK_SLOTS, JSON.stringify(slots))
            .then(() => deps.logger.info('Quick slots saved async'))
            .catch(err => {
                deps.logger.error('Save failed:', err);
                deps.notification.error('保存失败，请检查数据库连接');
            });

        // 反馈提示
        const { $ } = deps.utils.getCore();
        const $hud = $('#dnd-mini-hud');
        const $toast = $('<div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:var(--dnd-bg-tertiary);color:var(--dnd-text-main);padding:5px 10px;border-radius:4px;font-size:12px;z-index:9999;border:1px solid var(--dnd-border-gold);">已添加</div>');
        $hud.append($toast);
        setTimeout(() => $toast.fadeOut(500, () => $toast.remove()), 1000);
    },

    async removeQuickSlot(index) {
        const confirmed = await deps.notification.confirm('确定要移除此快捷方式吗？', {
            title: '移除快捷方式',
            confirmText: '移除',
            type: 'danger'
        });
        if (!confirmed) return;
        
        let slots = this._cachedQuickSlots || [];
        // 如果缓存为空，尝试读取
        if (slots.length === 0) {
            try {
                const saved = await deps.dbAdapter.getSetting(DND_CONFIG.STORAGE_KEYS.QUICK_SLOTS);
                if (saved) slots = typeof saved === 'string' ? JSON.parse(saved) : saved;
            } catch(e) {}
        }
        
        slots.splice(index, 1);
        
        // 乐观更新
        this._cachedQuickSlots = slots;
        this.renderQuickBar(slots);
        
        // 后台保存
        deps.utils.safeSave(DND_CONFIG.STORAGE_KEYS.QUICK_SLOTS, JSON.stringify(slots));
    },

    executeQuickSlot(index) {
        // 需要重新获取 slot 数据
        deps.dbAdapter.getSetting(DND_CONFIG.STORAGE_KEYS.QUICK_SLOTS).then(saved => {
            if (!saved) return;
            const slots = typeof saved === 'string' ? JSON.parse(saved) : saved;
            const slot = slots[index];
            if (!slot) return;
            
            if (slot.type === 'item') {
                const text = `我使用了 ${slot.data.name}`;
                ((window as any).DND_Dashboard_UI || this).fillChatInput?.( text);
            } else if (slot.type === 'skill' || slot.type === 'spell') {
                const baseLevel = slot.data.level;
                // 检查是否有等级且大于0
                const lvlNum = parseInt(baseLevel);
                const hasLevel = !isNaN(lvlNum) && lvlNum > 0 && baseLevel !== '戏法' && baseLevel !== '0';
                
                if (!hasLevel) {
                    const action = slot.type === 'spell' ? '施放了戏法' : '使用了技能';
                    ((window as any).DND_Dashboard_UI || this).fillChatInput?.( `我${action}：${slot.data.name}`);
                } else {
                    // 升环/等级选择
                    const { $, window: coreWin } = deps.utils.getCore();
                    const winW = coreWin.innerWidth || $(coreWin).width();
                    const winH = coreWin.innerHeight || $(coreWin).height();
                    
                    const isSpell = slot.type === 'spell';
                    const title = isSpell ? `${deps.icons.SPARKLES} 选择施法环阶 (${slot.data.name})` : `${deps.icons.SPARKLES} 选择技能等级 (${slot.data.name})`;
                    
                    let html = `<div style="font-weight:bold;color:var(--dnd-text-highlight);margin-bottom:10px;text-align:center;">${title}</div>`;
                    html += `<div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;">`;
                    
                    // Ensure spell/skill level selection starts from base level
                    const start = lvlNum || 1;
                    
                    // 获取最高法术位 (仅针对法术)
                    let limit = 9;
                    if (isSpell) {
                        const party = deps.dataManager.getPartyData();
                        const pc = party.find(p => p.type === 'PC' || p.isPC) || party[0];
                        const maxSlot = deps.dataManager.getMaxSpellSlotLevel(pc);
                        if (maxSlot > 0) limit = maxSlot;
                        limit = Math.max(start, limit);
                    }

                    for (let i = start; i <= limit; i++) {
                        const chatText = isSpell
                            ? `我使用 ${i} 环法术位施放了 ${slot.data.name}`
                            : `我以 ${i} 级使用了技能：${slot.data.name}`;
                            
                        html += `
                            <button class="dnd-clickable" style="background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-inner);color:var(--dnd-text-main);padding:8px;border-radius:4px;cursor:pointer;font-weight:bold;"
                                onclick="window.DND_Dashboard_UI.fillChatInput('${chatText}'); window.DND_Dashboard_UI.hideDetailPopup();">
                                ${i} ${isSpell ? '环' : '级'}
                            </button>
                        `;
                    }
                    html += `</div>`;
                    
                    ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.( html, winW/2 - 100, winH/2 - 100);
                }
            }
        });
    }
  };
}
