// features/dnd-character/character-card.ts
// 角色卡（展示/技能专精点击）（b5 · 自 BasedonST `src/ui/modules/UICharacter.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createCharacterCardFragment(deps: any): any {
  return {
    _lastClickPos: { x: 0, y: 0 },
    
    showCharacterCard(char, clickEvent) {
        deps.logger.info('[UIRenderer] showCharacterCard called for:', char ? char['姓名'] : 'Unknown');
        const { $ } = deps.utils.getCore();
        let $card = $('#dnd-char-detail-card-el');
        
        // 记录点击位置（如果有事件对象）
        if (clickEvent && clickEvent.clientX !== undefined) {
            this._lastClickPos = { x: clickEvent.clientX, y: clickEvent.clientY };
        }
        
        // 如果卡片不存在则创建
        if (!$card.length) {
            $card = $('<div id="dnd-char-detail-card-el" class="dnd-char-detail-card"></div>');
            $('body').append($card);
        }
        
        // 每次显示卡片时重新绑定关闭事件（使用命名空间避免重复）
        $(document).off('click.dndCharCard');
        
        const self = this;
        // 使用 setTimeout 避免当前点击立即触发关闭
        setTimeout(() => {
            $(document).on('click.dndCharCard', (e) => {
                const $target = $(e.target);
                
                // 如果点击的是卡片内部，不关闭
                if ($target.closest('#dnd-char-detail-card-el').length) return;
                
                // 如果点击的是悬浮窗内部，不关闭
                if ($target.closest('#dnd-detail-popup-el').length) return;
                
                // 如果点击的是技能/专长标签（会打开悬浮窗），不关闭卡片
                if ($target.closest('.dnd-skill-trigger, .dnd-feat-trigger').length) return;
                
                // 如果点击的是触发打开卡片的元素（头像等），让那边的 toggle 逻辑处理
                if ($target.closest('.dnd-mini-char-avatar, .dnd-mini-char, .party-list-avatar, .party-quick-avatar, .dnd-char-card, .party-bar-item, #dnd-logo-container').length) return;
                
                // 其他情况关闭卡片和悬浮窗
                if ($card.hasClass('visible')) {
                    self.hideCharacterCard();
                    ((window as any).DND_Dashboard_UI || self).hideDetailPopup?.();
                    $(document).off('click.dndCharCard');
                }
            });
        }, 150);

        // 如果已经显示且是同一个角色，则关闭
        if ($card.hasClass('visible') && $card.data('charId') === (char['PC_ID'] || char['CHAR_ID'])) {
            this.hideCharacterCard();
            ((window as any).DND_Dashboard_UI || this).hideDetailPopup?.( );
            return;
        }

        const charId = char['PC_ID'] || char['CHAR_ID'];
        $card.data('charId', charId);

        // 解析属性
        const stats = deps.dataManager.parseValue(char['属性值'], 'stats') || {};

        // 计算属性调整值 (Value - 10) / 2 向下取整
        const getMod = (val) => {
            const mod = Math.floor((val - 10) / 2);
            return mod >= 0 ? `+${mod}` : mod;
        };

        // 解析 HP
        let hpCurrent = 0, hpMax = 0, hpPercent = 0;
        if (char['HP']) {
            const parts = char['HP'].split('/');
            if (parts.length === 2) {
                hpCurrent = parseInt(parts[0]) || 0;
                hpMax = parseInt(parts[1]) || 1;
                hpPercent = Math.min(100, Math.max(0, (hpCurrent / hpMax) * 100));
            }
        }

        // 获取技能和专长
        const skills = charId ? deps.dataManager.getCharacterSkills(charId) : [];
        const feats = charId ? deps.dataManager.getCharacterFeats(charId) : [];
        
        // 获取资源
        const resTable = deps.dataManager.getTable('CHARACTER_Resources');
        let res = {};
        if (resTable) {
            res = resTable.find(r => (r['char_id'] || r['CHAR_ID'] || r['角色ID']) === charId) || {};
        }
        
        // 构建 HTML
        const avatarIdentity = char;
        const detailAvatarHtml = this.renderAvatar(char['姓名'], avatarIdentity, 48);
        
        // [新增] 只有当是主角或队友时，才显示上传按钮
        const party = deps.dataManager.getPartyData();
        const isPartyMember = party && party.some(p => (p['PC_ID'] == charId) || (p['CHAR_ID'] == charId) || (p['姓名'] == charId) || (p['姓名'] == char['姓名']));
        
        let html = `
            <div class="dnd-detail-header">
                <div style="display:flex;align-items:center;gap:15px;flex:1;overflow:hidden;">
                    <div style="position:relative;cursor:${isPartyMember ? 'pointer' : 'default'};" class="dnd-avatar-wrapper" title="${isPartyMember ? '点击修改头像' : ''}">
                        ${detailAvatarHtml}
                        ${isPartyMember ? `<div style="position:absolute;bottom:-2px;right:-2px;background:#333;border:1px solid var(--dnd-border-gold);border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--dnd-text-highlight);">📷</div>` : ''}
                    </div>
                    <div class="dnd-detail-info">
                        <div class="dnd-detail-name">${char['姓名']}</div>
                        <div class="dnd-detail-sub">${char['种族/性别/年龄'] || '未知'} | ${char['职业'] || '无职业'}</div>
                    </div>
                </div>
                <div class="dnd-detail-close" id="dnd-card-close"><i class="fa-solid fa-times"></i></div>
            </div>
            
            <div class="dnd-detail-body">
                <div style="margin-bottom:15px;">
                    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;color:#ccc;">
                        <span>HP (生命值)</span>
                        <span style="color:${hpPercent < 30 ? '#e74c3c' : 'inherit'}">${hpCurrent} / ${hpMax}</span>
                    </div>
                    <div class="dnd-bar-container dnd-bar-hp">
                        <div class="dnd-bar-fill" style="width: ${hpPercent}%"></div>
                    </div>
                </div>
                
                <div class="dnd-detail-stats-row">
                    <div class="dnd-detail-stat-item"><span style="color:#888">AC</span> <strong style="color:var(--dnd-text-highlight);font-size:15px;">${char['AC']||'-'}</strong></div>
                    <div class="dnd-detail-stat-item"><span style="color:#888">先攻</span> <strong>${char['先攻加值']||'+0'}</strong></div>
                    <div class="dnd-detail-stat-item"><span style="color:#888">感知</span> <strong>${char['被动感知']||'10'}</strong></div>
                    <div class="dnd-detail-stat-item"><span style="color:#888">速度</span> <strong>${char['速度']||'-'}</strong></div>
                </div>

                <div class="dnd-attr-grid">
                    ${['STR','DEX','CON','INT','WIS','CHA'].map(attr => `
                        <div class="dnd-attr-box">
                            <div class="dnd-attr-val">${stats[attr]||10}</div>
                            <div class="dnd-attr-mod">${getMod(stats[attr]||10)}</div>
                            <div class="dnd-attr-lbl">${attr}</div>
                        </div>
                    `).join('')}
                </div>

                ${(res['法术位'] || res['职业资源']) ? `
                <div class="dnd-detail-section">
                    <div class="dnd-detail-title">资源</div>
                    <div style="font-size:12px;color:var(--dnd-text-main)">
                        ${res['法术位'] ? `<div style="margin-bottom:4px;">${((window as any).DND_Dashboard_UI || this).formatSpellSlots?.( res['法术位'])}</div>` : ''}
                        ${res['职业资源'] ? `<div>${((window as any).DND_Dashboard_UI || this).formatClassRes?.( res['职业资源'])}</div>` : ''}
                        <div style="margin-top:4px;color:#aaa">
                            ${res['生命骰'] ? `HD: ${res['生命骰']} ` : ''}
                            ${res['金币'] ? `GP: ${res['金币']}` : ''}
                        </div>
                    </div>
                </div>` : ''}

                ${skills.length > 0 ? `
                <div class="dnd-detail-section">
                    <div class="dnd-detail-title">技能 & 法术 (${skills.length})</div>
                    <div class="dnd-tag-list">
                        ${skills.map((s, i) => {
                            return `<div class="dnd-tag dnd-skill-trigger" onclick="window.DND_Dashboard_UI.handleSkillClick(${i}, event)">${s['技能名称']}</div>`;
                        }).join('')}
                    </div>
                </div>` : ''}

                ${feats.length > 0 ? `
                <div class="dnd-detail-section">
                    <div class="dnd-detail-title">专长 (${feats.length})</div>
                    <div class="dnd-tag-list">
                        ${feats.map((f, i) => {
                            return `<div class="dnd-tag dnd-feat-trigger" onclick="window.DND_Dashboard_UI.handleFeatClick(${i}, event)">${f['专长名称']}</div>`;
                        }).join('')}
                    </div>
                </div>` : ''}

                <div class="dnd-detail-section">
                    <div class="dnd-detail-title" id="dnd-bio-toggle">背景故事 <span style="float:right">▼</span></div>
                    <div id="dnd-bio-content" style="display:none;font-size:12px;color:#ccc;line-height:1.5;margin-top:5px;">
                        ${char['背景故事'] || '暂无背景故事'}
                    </div>
                </div>
            </div>
        `;
        
        $card.html(html);

        // 绑定事件
        $card.find('#dnd-card-close').on('click', () => {
            this.hideCharacterCard();
            ((window as any).DND_Dashboard_UI || this).hideDetailPopup?.( );
        });
        
        $card.find('#dnd-bio-toggle').on('click', function() {
            const $content = $('#dnd-bio-content');
            if ($content.is(':visible')) {
                $content.hide();
                $(this).find('span').text('▼');
            } else {
                $content.show();
                $(this).find('span').text('▲');
            }
        });

        if (isPartyMember) {
            $card.find('.dnd-avatar-wrapper').on('click', (e) => {
                e.stopPropagation();
                this.showAvatarUploadDialog(avatarIdentity, char['姓名']);
            });
        }

        // ========== 智能定位逻辑 ==========
        const { window: coreWin } = deps.utils.getCore();
        const $w = $(coreWin);
        const winW = $w.width();
        const winH = $w.height();
        const isMobile = winW < 768;
        
        if (isMobile) {
            $card.css({
                top: '10px',
                left: '50%',
                right: 'auto',
                bottom: 'auto'
            }).addClass('visible');
        } else {
            $card.removeClass('visible').css({
                display: 'flex',
                visibility: 'hidden',
                top: '-9999px',
                left: '-9999px'
            });
            
            requestAnimationFrame(() => {
                const cardW = $card.outerWidth() || 380;
                const cardH = $card.outerHeight() || 500;
                const padding = 15;
                
                const clickX = this._lastClickPos.x || winW / 2;
                const clickY = this._lastClickPos.y || 100;
                
                let left, top;
                
                if (clickX + cardW + padding < winW) {
                    left = clickX + padding;
                } else if (clickX - cardW - padding > 0) {
                    left = clickX - cardW - padding;
                } else {
                    left = Math.max(padding, (winW - cardW) / 2);
                }
                
                top = clickY - 50; 
                
                if (top < padding) {
                    top = padding;
                }
                
                if (top + cardH > winH - padding) {
                    top = Math.max(padding, winH - cardH - padding);
                }
                
                left = Math.max(padding, Math.min(left, winW - cardW - padding));
                top = Math.max(padding, Math.min(top, winH - cardH - padding));
                
                $card.css({
                    top: top + 'px',
                    left: left + 'px',
                    right: 'auto',
                    bottom: 'auto',
                    display: '', 
                    visibility: '' 
                }).addClass('visible');
            });
        }
    },

    hideCharacterCard() {
        $('#dnd-char-detail-card-el').removeClass('visible');
    },

    handleSkillClick(idx, event) {
        console.log('[DND Dashboard] handleSkillClick', idx);
        if (event) { event.stopPropagation(); event.preventDefault(); }
        
        const { $ } = deps.utils.getCore();
        const $card = $('#dnd-char-detail-card-el');
        const charId = $card.data('charId');
        
        if (!charId) { console.error('No charId found'); return; }
        
        const skills = deps.dataManager.getCharacterSkills(charId);
        const skill = skills[idx];
        
        if (!skill) { console.error('Skill not found', idx); return; }
        
        const safeName = (skill['技能名称']||'').replace(/'/g, "\\'");
        const safeRange = (skill['射程']||'接触').replace(/'/g, "\\'");
        const html = `
            <div style="color:var(--dnd-text-highlight);font-weight:bold;border-bottom:1px solid #444;margin-bottom:5px;padding-bottom:3px;display:flex;justify-content:space-between;align-items:center;">
                <span>${skill['技能名称']} <span style="font-size:10px;color:#888;font-weight:normal">(${skill['环阶']||'-'} · ${skill['学派']||'-'})</span></span>
                <button class="dnd-clickable" style="background:var(--dnd-accent-green);border:none;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;cursor:pointer;"
                    onclick="window.DND_Dashboard_UI.handleCastClick('${safeName}', '${safeRange}', '${skill['环阶']||''}', 'skill')">
                    ${deps.icons.SPARKLES} 施放
                </button>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:11px;color:#aaa;margin-bottom:8px;">
                <div>时间: ${skill['施法时间']||'-'}</div>
                <div>射程: ${skill['射程']||'-'}</div>
                <div>成分: ${skill['成分']||'-'}</div>
                <div>持续: ${skill['持续时间']||'-'}</div>
            </div>
            <div style="line-height:1.4;color:#ccc;">${skill['效果描述']||'无描述'}</div>
        `;
        
        ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.( html, event.clientX, event.clientY);
    },
    
    handleFeatClick(idx, event) {
        console.log('[DND Dashboard] handleFeatClick', idx);
        if (event) { event.stopPropagation(); event.preventDefault(); }
        
        const { $ } = deps.utils.getCore();
        const $card = $('#dnd-char-detail-card-el');
        const charId = $card.data('charId');
        
        if (!charId) { console.error('No charId found'); return; }
        
        const feats = deps.dataManager.getCharacterFeats(charId);
        const feat = feats[idx];
        
        if (!feat) { console.error('Feat not found', idx); return; }
        
        const html = `
            <div style="color:var(--dnd-text-highlight);font-weight:bold;border-bottom:1px solid #444;margin-bottom:5px;padding-bottom:3px;">
                ${feat['专长名称']} <span style="font-size:10px;color:#888;font-weight:normal">(${feat['类别']||'-'})</span>
            </div>
            <div style="font-size:11px;color:#aaa;margin-bottom:5px;">前置: ${feat['前置条件']||'无'}</div>
            <div style="line-height:1.4;color:#ccc;">${feat['效果描述']||'无描述'}</div>
        `;
        
        ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.( html, event.clientX, event.clientY);
    },

    // ==========================================
    // 角色创建面板 (AI 多轮对话引导)
    // ==========================================
    
    // [新增] 保存角色创建状态
  };
}
