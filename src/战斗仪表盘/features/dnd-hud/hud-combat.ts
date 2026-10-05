// features/dnd-hud/hud-combat.ts
// 战斗 HUD（+迷你法术位）（b4 · 自 BasedonST `src/ui/modules/UIHUD.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createHudCombatFragment(deps: any): any {
  return {
    renderCombatHUD($container, showMiniMap) {
        const { $ } = deps.utils.getCore();
        const encounters = deps.dataManager.getTable('COMBAT_Encounter');
        const partyData = deps.dataManager.getPartyData() || [];
        const global = deps.dataManager.getTable('SYS_GlobalState');
        const round = (global && global[0]) ? global[0]['当前回合'] : 0;
        
        // 布局
        let html = `<div class="dnd-hud-combat-layout">`;

        const activeChar = this.getControlledCharacter();
        const activeId = activeChar ? (activeChar['CHAR_ID'] || activeChar['PC_ID'] || activeChar['姓名']) : null;
        if (activeId && !this._turnResources[activeId]) {
            ((window as any).DND_Dashboard_UI || this).resetActionEconomy?.(activeId);
        }
        
        // 左侧：迷你地图（根据设置决定是否显示）
        //const turnRes = this._turnResources || { action: 1, bonus: 1, reaction: 1, movement: 30 };
        const turnRes = (activeId && this._turnResources[activeId]) ? this._turnResources[activeId] : { action: 1, bonus: 1, reaction: 1, movement: 30 };

        html += `
            <div style="display:flex;flex-direction:column;gap:5px;">
                ${showMiniMap ? '<div class="dnd-hud-minimap" id="dnd-hud-minimap-content" style="width:180px;height:180px;"></div>' : ''}
                
                <!-- 动作经济展示 -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;font-size:10px;background:var(--dnd-bg-secondary);padding:4px;border-radius:4px;">
                    <div class="dnd-clickable" onclick="window.DND_Dashboard_UI.adjustTurnResource('action')" title="点击增加动作" style="cursor:pointer;color:${turnRes.action>0?'var(--dnd-accent-green)':'var(--dnd-text-dim)'}"><i class="fa-solid fa-bolt"></i> 动作: ${turnRes.action}</div>
                    <div class="dnd-clickable" onclick="window.DND_Dashboard_UI.adjustTurnResource('bonus')" title="点击增加附赠动作" style="cursor:pointer;color:${turnRes.bonus>0?'var(--dnd-text-highlight)':'var(--dnd-text-dim)'}"><i class="fa-solid fa-plus-circle"></i> 附赠: ${turnRes.bonus}</div>
                    <div class="dnd-clickable" onclick="window.DND_Dashboard_UI.adjustTurnResource('reaction')" title="点击增加反应" style="cursor:pointer;color:${turnRes.reaction>0?'var(--dnd-border-gold)':'var(--dnd-text-dim)'}"><i class="fa-solid fa-rotate"></i> 反应: ${turnRes.reaction}</div>
                    <div class="dnd-clickable" onclick="window.DND_Dashboard_UI.adjustTurnResource('movement')" title="点击增加30尺移动力" style="cursor:pointer;color:${turnRes.movement>0?'var(--dnd-accent-blue)':'var(--dnd-text-dim)'}"><i class="fa-solid fa-shoe-prints"></i> 移动: ${turnRes.movement}</div>
                </div>

                <div style="display:flex;gap:5px;">
                    <button class="dnd-clickable" style="
                        flex: 1;
                        background: linear-gradient(135deg, var(--dnd-bg-secondary), var(--dnd-accent-blue));
                        border: 1px solid var(--dnd-accent-blue);
                        color: var(--dnd-btn-text);
                        padding: 5px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 12px;

                    " onclick="window.DND_Dashboard_UI.startTargeting({
                        type: 'move',
                        rangeText: (this._turnResources && (deps.dataManager.getControlledCharacter() ? (deps.dataManager.getControlledCharacter()['CHAR_ID'] || deps.dataManager.getControlledCharacter()['PC_ID'] || deps.dataManager.getControlledCharacter()['姓名']) : null)) ? (this._turnResources[deps.dataManager.getControlledCharacter()['CHAR_ID'] || deps.dataManager.getControlledCharacter()['PC_ID'] || deps.dataManager.getControlledCharacter()['姓名']]?.movement + '尺') : '30尺',
                        skillName: '移动',
                        callback: (res) => window.DND_Dashboard_UI.executeAction('move', res)
                    })"><i class="fa-solid fa-person-walking"></i> 移动</button>

                    <button class="dnd-clickable" style="
                        flex: 1;
                        background: linear-gradient(135deg, var(--dnd-bg-secondary), var(--dnd-text-highlight));
                        border: 1px solid var(--dnd-text-highlight);
                        color: var(--dnd-btn-text);
                        padding: 5px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 12px;
                    " onclick="window.DND_Dashboard_UI.showCombatSkillList(event)"><i class="fa-solid fa-gavel"></i> 技能</button>
                </div>
            </div>
        `;
        
        // 右侧：战斗列表
        html += `<div class="dnd-hud-party-stats">`;
        html += `<div id="dnd-combat-resource-panel"></div>`;
        
        if (encounters && encounters.length > 0) {
            // 按先攻排序
            const sorted = [...encounters].sort((a, b) => {
                const valA = parseInt(a['先攻/位置']) || 0;
                const valB = parseInt(b['先攻/位置']) || 0;
                return valB - valA;
            });

            sorted.forEach(unit => {
                const isActive = unit['是否为当前行动者'] === '是';
                const buffs = unit['附着状态'] || '';
                const isEnemy = unit['阵营'] === '敌方';
                
                // 解析 HP
                let hpCurrent = 0, hpMax = 1, hpPercent = 100;
                const hpStr = unit['HP状态'] || '0/0';
                const hpParts = hpStr.split('/');
                if (hpParts.length >= 2) {
                    hpCurrent = parseInt(hpParts[0]) || 0;
                    hpMax = parseInt(hpParts[1]) || 1;
                    hpPercent = Math.min(100, Math.max(0, (hpCurrent / hpMax) * 100));
                }
                
                const defInfo = unit['防御/抗性'] || '-';
                const acMatch = defInfo.match(/AC(\d+)/);
                const acVal = acMatch ? acMatch[1] : (defInfo.length < 5 ? defInfo : '??');
                
                const charIdCombat = unit['单位名称'];
                const avatarIdentity = partyData.find(p => p['姓名'] === unit['单位名称']) || { '单位名称': unit['单位名称'] };
                const avatarInfo = ((window as any).DND_Dashboard_UI || this).resolveAvatarStorageKeys?.(avatarIdentity, unit['单位名称']);
                const initialCombat = ((window as any).DND_Dashboard_UI || this).getNameInitial?.(unit['单位名称']);
                const uid = `combat-avatar-${charIdCombat.replace(/[^a-zA-Z0-9]/g, '_')}-${Math.random().toString(36).substr(2,5)}`;
                
                // Trigger async load
                setTimeout(() => ((window as any).DND_Dashboard_UI || this).loadAvatarAsync?.(avatarIdentity, uid, unit['单位名称']), 0);
                
                let nameColor = 'var(--dnd-text-main)';
                if (isEnemy) nameColor = 'var(--dnd-accent-red)';
                if (isActive) nameColor = 'var(--dnd-text-highlight)';
                
                html += `
                    <div class="dnd-mini-char dnd-hud-entry ${isActive ? 'active' : ''}" style="${isEnemy ? 'border-left-color:var(--dnd-accent-red) !important;' : ''}">
                        <div id="${uid}" class="dnd-mini-char-avatar dnd-avatar-container ${isActive ? 'dnd-active-turn' : ''}" data-char-id="${charIdCombat}" data-avatar-key="${avatarInfo.domKey}" style="overflow:hidden;background:linear-gradient(135deg, var(--dnd-bg-tertiary) 0%, var(--dnd-bg-secondary) 100%);position:relative;cursor:pointer;border-color:${isEnemy?'var(--dnd-accent-red)':'var(--dnd-border-gold)'};" title="${unit['单位名称']}">
                            <div class="dnd-avatar-initial" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:${isEnemy?'var(--dnd-accent-red)':'var(--dnd-text-highlight)'};font-weight:bold;font-size:16px;">${initialCombat}</div>
                        </div>
                        <div class="dnd-mini-char-info">
                            <div style="display:flex;justify-content:space-between">
                                <div class="dnd-mini-name" style="color:${nameColor}">${unit['单位名称']} ${isActive ? '<i class="fa-solid fa-bolt"></i>' : ''}</div>
                                <div style="font-size:11px;color:var(--dnd-text-dim)">AC: ${acVal}</div>
                            </div>
                            <div class="dnd-mini-bars">
                                <div class="dnd-micro-bar hp dnd-bar-shimmer" title="${hpStr}"><div class="dnd-micro-bar-fill" style="width:${hpPercent}%;background:${isEnemy?'var(--dnd-accent-red)':'var(--dnd-accent-green)'} !important;"></div></div>
                            </div>
                            ${buffs ? `<div style="font-size:10px;color:var(--dnd-text-dim);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${buffs}</div>` : ''}
                        </div>
                    </div>
                `;
            });
        } else {
            html += `<div style="color:var(--dnd-text-dim);text-align:center;padding:10px;">等待战斗数据...</div>`;
        }
        
        html += `</div></div>`;
        $container.append(html);
        
        // Bind events
        const self = this;
        $container.find('.dnd-mini-char-avatar').on('click', function(e) {
            e.stopPropagation();
            const name = $(this).attr('title');
            const unit = encounters.find(u => u['单位名称'] === name);
            if (unit) {
                self.showCombatUnitDetail(unit, e);
            }
        });

        if (this.renderResourceConsumption) {
            ((window as any).DND_Dashboard_UI || this).renderResourceConsumption?.($('#dnd-combat-resource-panel'));
        }

        // 渲染地图（如果启用）
        if (showMiniMap) {
            ((window as any).DND_Dashboard_UI || this).renderMiniMap?.($('#dnd-hud-minimap-content'));
        }
    },

    renderMiniSpellSlots($container) {
        const { $ } = deps.utils.getCore();
        // 获取当前操控角色
        const char = this.getControlledCharacter();
        
        if (!char) return;
        
        // char 对象已包含合并的资源数据
        const res = char;
        
        if (res && res['法术位']) {
            const slotsHtml = ((window as any).DND_Dashboard_UI || this).formatSpellSlots?.(res['法术位'], true); // 启用 mini 模式
            if (slotsHtml) {
                const $el = $(`
                    <div style="padding:0 10px 5px 10px; border-bottom:1px solid rgba(255,255,255,0.05);">
                        <div style="font-size:10px;color:#888;margin-bottom:2px;">法术位 (${char['姓名']})</div>
                        ${slotsHtml}
                    </div>
                `);
                $container.append($el);
            }
        }
    }
  };
}
