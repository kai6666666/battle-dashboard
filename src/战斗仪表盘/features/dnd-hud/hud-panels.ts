// features/dnd-hud/hud-panels.ts
// 底栏（+手动更新）（b4 · 自 BasedonST `src/ui/modules/UIHUD.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createHudPanelsFragment(deps: any): any {
async function invokeManualUpdate(event) {
    const { $, getDB } = deps.utils.getCore();
    const $btn = event ? $(event.currentTarget).closest('.dnd-footer-btn') : $();
    const $icon = $btn.find('.dnd-refresh-icon i');
    const api = typeof getDB === 'function' ? getDB() : null;

    if (!api || typeof api.manualUpdate !== 'function') {
        deps.logger.warn('[UIHUD] 当前数据库插件未提供 manualUpdate 接口');
        deps.notification.error('当前数据库插件未提供手动更新接口，请先更新数据库插件');
        return false;
    }

    try {
        $btn.css({
            pointerEvents: 'none',
            opacity: '0.7'
        });
        $icon.removeClass('fa-sync').addClass('fa-spinner fa-spin');

        const success = await api.manualUpdate();
        if (success === false) {
            throw new Error('数据库插件返回失败');
        }

        const globalUI = window.DND_Dashboard_UI || deps.utils.getCore().window?.DND_Dashboard_UI;
        if (globalUI) {
            if (globalUI.state === 'mini' && typeof globalUI.renderHUD === 'function') {
                setTimeout(() => globalUI.renderHUD(), 50);
            } else if (globalUI.state === 'full' && typeof globalUI.renderPanel === 'function') {
                const activeTarget = $('.dnd-nav-item.active').data('target');
                if (activeTarget) {
                    setTimeout(() => globalUI.renderPanel(activeTarget), 50);
                }
            }
        }

        deps.logger.info('[UIHUD] 已触发数据库手动更新');
        deps.notification.success('已触发数据库手动更新');
        return true;
    } catch (err) {
        const message = err?.message || '未知错误';
        deps.logger.error('[UIHUD] 手动更新失败:', err);
        deps.notification.error(`手动更新失败：${message}`);
        return false;
    } finally {
        $btn.css({
            pointerEvents: '',
            opacity: ''
        });
        $icon.removeClass('fa-spinner fa-spin').addClass('fa-sync');
    }
}



  return {
    renderFooter($container) {
        const { $ } = deps.utils.getCore();
        
        // 获取当前操控角色资源
        const char = this.getControlledCharacter();
        const res = char || {};
        
        // 获取势力数据
        const factions = deps.dataManager.getTable('FACTION_Standing') || [];
        
        // 获取法术书
        const charId = char ? (char['CHAR_ID'] || char['PC_ID'] || char['姓名']) : null;
        const spells = deps.dataManager.getKnownSpells(charId);
        const hasSpells = spells && spells.length > 0;
        
        let html = `<div class="dnd-hud-footer">`;
        
        if (char) {
            html += `<div class="dnd-res-item" title="金币"><span class="dnd-res-icon"><i class="fa-solid fa-coins"></i></span> ${res['金币']||0} gp</div>`;
            
            if (res['生命骰']) {
                html += `<div class="dnd-res-item" title="生命骰"><span class="dnd-res-icon"><i class="fa-solid fa-heart"></i></span> ${res['生命骰']}</div>`;
            }
            
            // 职业资源简报
            if (res['职业资源']) {
                try {
                    const classRes = deps.dataManager.parseValue(res['职业资源'], 'resources');
                    if (classRes) {
                        const firstKey = Object.keys(classRes)[0];
                        if (firstKey) {
                            html += `<div class="dnd-res-item" title="${firstKey}"><span class="dnd-res-icon"><i class="fa-solid fa-bolt"></i></span> ${classRes[firstKey]}</div>`;
                        }
                    }
                } catch(e) {}
            }
        }
        
        // 势力声望快览 (只显示前2个非中立势力)
        if (factions.length > 0) {
            let factionHtml = '';
            let count = 0;
            
            factions.forEach(f => {
                if (count >= 2) return;
                const relation = parseInt(f['关系等级']) || 0;
                if (relation !== 0) {
                    const icon = relation > 0 ? '<i class="fa-solid fa-landmark"></i>' : '<i class="fa-solid fa-skull"></i>';
                    const color = relation > 0 ? 'var(--dnd-accent-green)' : 'var(--dnd-accent-red)';
                    // 增强tooltip显示更多势力信息
                    const tooltipParts = [
                        f['势力名称'],
                        `关系: ${f['关系等级']} (声望:${f['声望值']||0})`,
                        f['势力类型'] ? `类型: ${f['势力类型']}` : null,
                        f['主角头衔'] ? `头衔: ${f['主角头衔']}` : null
                    ].filter(Boolean);
                    const tooltip = tooltipParts.join(' | ');
                    factionHtml += `<span style="color:${color};margin-left:5px;cursor:help;" title="${tooltip}">${icon}</span>`;
                    count++;
                }
            });
            
            if (factionHtml) {
                html += `<div class="dnd-res-item" style="border-left:1px solid rgba(255,255,255,0.1);padding-left:8px;margin-left:5px;">${factionHtml}</div>`;
            }
        }
        
        // 右侧按钮组
        html += `<div style="margin-left:auto;display:flex;gap:10px;">`;
        
        // [修复] 使用 data-action 属性，后续用事件委托绑定
        html += `
            <div class="dnd-res-item dnd-footer-btn dnd-clickable" data-action="inventory" style="cursor:pointer;" title="背包物品">
                <span class="dnd-res-icon" style="font-size:16px;color:var(--dnd-text-main)"><i class="fa-solid fa-suitcase"></i></span>
            </div>
        `;
        
        html += `
            <div class="dnd-res-item dnd-footer-btn dnd-clickable" data-action="equipment" style="cursor:pointer;" title="已装备物品">
                <span class="dnd-res-icon" style="font-size:16px;color:var(--dnd-text-highlight)"><i class="fa-solid fa-shield-halved"></i></span>
            </div>
        `;
        
        if (factions.length > 0) {
            html += `
                <div class="dnd-res-item dnd-footer-btn dnd-clickable" data-action="faction" style="cursor:pointer;" title="势力与声望">
                    <span class="dnd-res-icon" style="font-size:16px;color:var(--dnd-text-highlight)"><i class="fa-solid fa-landmark"></i></span>
                </div>
            `;
        }

        if (hasSpells) {
            html += `
                <div class="dnd-res-item dnd-footer-btn dnd-clickable" data-action="spellbook" style="cursor:pointer;" title="法术书">
                    <span class="dnd-res-icon" style="font-size:16px;color:#aab"><i class="fa-solid fa-book"></i></span>
                </div>
            `;
        }
        
        // NPC列表按钮
        html += `
            <div class="dnd-res-item dnd-footer-btn dnd-clickable" data-action="npclist" style="cursor:pointer;" title="NPC列表">
                <span class="dnd-res-icon" style="font-size:16px;color:var(--dnd-text-main)"><i class="fa-solid fa-users"></i></span>
            </div>
        `;
        
        html += `
            <div class="dnd-res-item dnd-footer-btn dnd-clickable" data-action="dice" style="cursor:pointer;" title="快速投掷">
                <span class="dnd-res-icon" style="font-size:16px;color:var(--dnd-text-highlight)"><i class="fa-solid fa-dice-d20"></i></span>
            </div>
        `;
        
        // [新增] 手动更新数据按钮
        html += `
            <div class="dnd-res-item dnd-footer-btn dnd-clickable" data-action="manual-update" style="cursor:pointer;" title="手动刷新数据">
                <span class="dnd-res-icon dnd-refresh-icon" style="font-size:16px;color:var(--dnd-text-main)"><i class="fa-solid fa-sync"></i></span>
            </div>
        `;

        // [新增] 设置按钮
        html += `
            <div class="dnd-res-item dnd-footer-btn dnd-clickable" data-action="settings" style="cursor:pointer;" title="打开设置">
                <span class="dnd-res-icon" style="font-size:16px;color:var(--dnd-text-dim)"><i class="fa-solid fa-cog"></i></span>
            </div>
        `;
        
        html += `</div></div>`; // End buttons & footer
        
        const $footerEl = $(html);
        
        // [修复] 使用事件委托绑定按钮点击
        const self = this;
        $footerEl.find('.dnd-footer-btn').on('click', function(e) {
            e.stopPropagation();
            const action = $(this).data('action');
            deps.logger.debug('Footer button clicked:', action);
            
            switch(action) {
                case 'inventory': ((window as any).DND_Dashboard_UI || self).showInventoryPanel?.(e); break;
                case 'equipment': ((window as any).DND_Dashboard_UI || self).showEquipmentPanel?.(e); break;
                case 'faction': ((window as any).DND_Dashboard_UI || self).showFactionPanel?.(e); break;
                case 'spellbook': ((window as any).DND_Dashboard_UI || self).showSpellBook?.(e); break;
                case 'npclist': self.showNPCListPanel(e); break;
                case 'dice': ((window as any).DND_Dashboard_UI || self).showQuickDice?.(e); break;
                case 'manual-update': void invokeManualUpdate(e); break;
                case 'settings':
                    // 切换到完整面板并打开设置页
                    $('.dnd-nav-item').removeClass('active');
                    $('.dnd-nav-item[data-target="settings"]').addClass('active');
                    deps.hudCore.setState('full');
                    break;
            }
        });
        
        $container.append($footerEl);
    },

    //原作者: disocrd类脑 Niccole @niccole0414

    // [新增] 手动触发神数据库更新
    async triggerManualUpdate(event) {
        return invokeManualUpdate(event);
    },

    // [新增] 显示NPC列表面板
  };
}
