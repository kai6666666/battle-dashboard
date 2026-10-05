// features/dnd-hud/hud-explore.ts
// 探索 HUD（+行动选项/队伍栏）（b4 · 自 BasedonST `src/ui/modules/UIHUD.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createHudExploreFragment(deps: any): any {
  return {
    renderExploreHUD($container, showMiniMap) {
        const { $ } = deps.utils.getCore();

        // 0. 渲染探索地图 (根据设置决定是否显示)
        if (showMiniMap) {
            // 使用 100% 宽度，高度设为 240px 以便更好地展示艺术地图
            const $mapContainer = $('<div class="dnd-hud-minimap" id="dnd-hud-minimap-content" style="width:100% !important; height:240px !important; margin-bottom:10px; border:1px solid var(--dnd-border-gold);"></div>');
            $container.append($mapContainer);
            
            // 异步渲染地图
            ((window as any).DND_Dashboard_UI || this).renderMiniMap?.($mapContainer);
        }
        
        // 1. 渲染行动选项 (优先)
        // [修复] 使用独立容器并移除 await，确保渲染顺序正确（地图 -> 选项 -> 任务 -> 其他）
        const $optionsContainer = $('<div></div>');
        $container.append($optionsContainer);
        this.renderActionOptions($optionsContainer);

        // 2. 渲染任务 (精简版)
        const quests = deps.dataManager.getTable('QUEST_Active');
        if (quests && quests.length > 0) {
            // 只显示第一个进行中的任务
            const activeQ = quests.find(q => q['状态'] === '进行中') || quests[0];
            
            // 提取任务类型和时限
            const type = activeQ['类型'] || '';
            const timeLimit = activeQ['时限'] || '';
            
            const qHtml = `
                <div class="dnd-hud-quests dnd-hud-entry" style="animation-delay:0.2s; margin-top:5px;background:var(--dnd-bg-secondary);padding:6px;border-radius:4px;border-left:2px solid var(--dnd-border-gold);cursor:pointer;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
                        <div style="font-weight:bold;color:var(--dnd-text-header);font-size:12px;display:flex;align-items:center;gap:5px;">
                            <span><i class="fa-solid fa-thumbtack dnd-icon-notify"></i> ${activeQ['任务名称']}</span>
                            ${type ? `<span style="font-size:10px;background:var(--dnd-bg-tertiary);padding:0 4px;border-radius:2px;color:var(--dnd-text-dim);">${type}</span>` : ''}
                        </div>
                        ${timeLimit && timeLimit !== '无限制' ? `<div style="font-size:10px;color:var(--dnd-text-highlight);"><i class="fa-solid fa-clock"></i> ${timeLimit}</div>` : ''}
                    </div>
                    <div style="font-size:11px;color:var(--dnd-text-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                        ${activeQ['当前进度'] || activeQ['目标描述'] || '...'}
                    </div>
                </div>
            `;
            const $el = $(qHtml);
            $el.on('click', (e) => ((window as any).DND_Dashboard_UI || this).showQuestTooltip?.(activeQ, e.clientX, e.clientY));
            $container.append($el);
        }
    },

    // [新增] 渲染行动选项
    async renderActionOptions($container) {
        const { $ } = deps.utils.getCore();
        const optionsTable = deps.dataManager.getTable('UI_ActionOptions');
        if (!optionsTable || optionsTable.length === 0) return;
        
        const opts = optionsTable[0]; // 取第一行
        const validOpts = [];
        
        // 检查 A-D 选项
        ['选项A', '选项B', '选项C', '选项D'].forEach(key => {
            if (opts[key] && opts[key].trim()) {
                validOpts.push({ key: key.replace('选项',''), text: opts[key] });
            }
        });
        
        if (validOpts.length === 0) return;
        
        // 读取选项换行设置
        const optionWrap = await deps.dbAdapter.getSetting(DND_CONFIG.STORAGE_KEYS.OPTION_WRAP);
        const enableWrap = optionWrap === true || optionWrap === 'true';
        
        // 根据换行设置决定样式
        const wrapStyle = enableWrap
            ? 'white-space: normal; word-break: break-word; min-height: 40px;'
            : 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
        
        let html = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">`;
        
        validOpts.forEach((opt, idx) => {
            html += `
                <button class="dnd-action-btn dnd-clickable dnd-hud-entry dnd-hover-lift" data-text="${opt.text}" style="animation-delay:${idx * 0.05}s;
                    background: linear-gradient(to bottom, var(--dnd-bg-tertiary), var(--dnd-bg-secondary));
                    border: 1px solid var(--dnd-border-inner);
                    color: var(--dnd-text-main);
                    padding: 8px 5px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    text-align: left;
                    ${wrapStyle}
                    transition: all 0.2s;
                " onmouseover="this.style.borderColor='var(--dnd-text-highlight)';this.style.color='var(--dnd-text-highlight)'"
                onmouseout="this.style.borderColor='var(--dnd-border-inner)';this.style.color='var(--dnd-text-main)'">
                    <span style="color:var(--dnd-border-gold);font-weight:bold;margin-right:4px;">${opt.key}.</span> ${opt.text}
                </button>
            `;
        });
        
        html += `</div>`;
        const $el = $(html);
        
        // 绑定点击事件 (填入聊天框)
        const self = this;
        $el.find('.dnd-action-btn').on('click', function() {
            const text = $(this).data('text');
            ((window as any).DND_Dashboard_UI || self).fillChatInput?.(text);
        });
        
        $container.append($el);
    },

    // [新增] 渲染横向队伍栏 (Refactored to use CSS classes)
    renderPartyBar($container) {
        const { $ } = deps.utils.getCore();
        const party = deps.dataManager.getPartyData();
        if (!party || party.length === 0) return;

        let html = `<div class="dnd-hud-party-bar">`;
        
        party.forEach((char, idx) => {
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
            
            // 解析经验值
            let xpPercent = 0;
            let xpText = '';
            if (char['经验值']) {
                const parts = char['经验值'].toString().split('/');
                if (parts.length === 2) {
                    const curr = parseInt(parts[0]) || 0;
                    const max = parseInt(parts[1]) || 1;
                    xpPercent = Math.min(100, Math.max(0, (curr / max) * 100));
                    xpText = `${curr}/${max}`;
                }
            }

            // 获取等级
            const level = char['等级'] || 1;
            
            const charId = char['PC_ID'] || char['CHAR_ID'] || char['姓名'];
            const avatarIdentity = char;
            const avatarInfo = ((window as any).DND_Dashboard_UI || this).resolveAvatarStorageKeys?.(avatarIdentity, char['姓名']);
            const initial = ((window as any).DND_Dashboard_UI || this).getNameInitial?.(char['姓名']);
            const avatarUid = `party-avatar-${charId}-${idx}`;
            
            // 触发异步头像加载
            setTimeout(() => ((window as any).DND_Dashboard_UI || this).loadAvatarAsync?.(avatarIdentity, avatarUid, char['姓名']), 0);
            
            // [新增] 检查是否为当前操控角色
            const isControlled = (this._controlledCharId === charId);

            // [新增] 检查是否可以升级
            let canLevelUp = false;
            if (char['经验值']) {
                const parts = char['经验值'].toString().split('/');
                if (parts.length === 2) {
                    const curr = parseInt(parts[0]) || 0;
                    const max = parseInt(parts[1]) || 1;
                    if (curr >= max && max > 0) canLevelUp = true;
                }
            }
            
            // [新增] 解析角色状态
            const charStatuses = deps.dataManager.parseCharacterStatus(char);
            let statusHtml = '';
            if (charStatuses && charStatuses.length > 0) {
                statusHtml = `<div class="dnd-party-status-bar">`;
                charStatuses.forEach(status => {
                    statusHtml += `<span class="dnd-party-status-pill ${status.type}" title="${status.label}"><i class="fa-solid ${status.icon}"></i>${status.label}</span>`;
                });
                statusHtml += `</div>`;
            }
                
            html += `
                <div class="party-bar-item dnd-clickable dnd-hud-entry dnd-hover-lift" data-idx="${idx}" style="animation-delay:${idx * 0.05}s;">
                    <div style="position:relative;">
                        <div id="${avatarUid}" class="dnd-avatar-container party-avatar-container" data-char-id="${charId}" data-avatar-key="${avatarInfo.domKey}" title="${char['姓名']}">
                            <span style="color:var(--dnd-text-highlight);font-weight:bold;font-size:16px;">${initial}</span>
                        </div>
                        <div class="party-lvl-badge">Lv.${level}</div>
                        <!-- [新增] 操控切换按钮 -->
                        <div class="party-control-btn ${isControlled ? 'active' : ''}"
                                data-party-ctl="${charId}"
                                title="切换操控此角色">
                            <i class="fa-solid fa-gamepad"></i>
                        </div>
                        <!-- [新增] 升级按钮 -->
                        ${canLevelUp ? `
                        <div class="party-levelup-btn"
                                data-party-lvl="${charId}"
                                title="经验值已满，点击升级！">
                            <i class="fa-solid fa-arrow-up dnd-icon-bounce"></i>
                        </div>` : ''}
                    </div>
                    
                    <!-- HP条 -->
                    <div class="dnd-bar-shimmer" style="width:100%;height:4px;background:var(--dnd-bg-secondary);border-radius:2px;overflow:hidden;margin-top:2px;">
                        <div class="dnd-bar-fill" style="width:${hpPercent}%;height:100%;background:${hpPercent < 30 ? 'var(--dnd-accent-red)' : 'var(--dnd-accent-green)'};transition:width 0.3s;"></div>
                    </div>
                    
                    <!-- XP条 -->
                    ${xpText ? `
                    <div class="dnd-bar-shimmer" style="width:100%;height:2px;background:var(--dnd-bg-input);border-radius:1px;overflow:hidden;margin-top:1px;" title="XP: ${xpText}">
                        <div class="dnd-bar-fill" style="width:${xpPercent}%;height:100%;background:var(--dnd-text-highlight);transition:width 0.3s;"></div>
                    </div>` : ''}
                    
                    <!-- [新增] 状态栏 -->
                    ${statusHtml}
                </div>
            `;
        });
        
        html += `</div>`;
        const $el = $(html);
        
        // 绑定点击事件
        const self = this;
        $el.find('.party-bar-item').on('click', function(e) {
            deps.logger.debug('[PartyBar] Clicked item', $(this).data('idx'));
            e.stopPropagation();
            const idx = $(this).data('idx');
            const char = party[idx];
            if (char) {
                ((window as any).DND_Dashboard_UI || self).showCharacterCard?.(char, e);
            } else {
                deps.logger.error('[PartyBar] Character data not found for index', idx);
            }
        });
        // [b12.6] 操控切换/升级按钮：脚本绑定（替代 inline onclick）
        $el.find('.party-control-btn').off('click.dndCtl').on('click.dndCtl', function(e) {
            e.stopPropagation();
            ((window as any).DND_Dashboard_UI || self).setControlledCharacter?.($(this).attr('data-party-ctl'));
        });
        $el.find('.party-levelup-btn').off('click.dndLvl').on('click.dndLvl', function(e) {
            e.stopPropagation();
            ((window as any).DND_Dashboard_UI || self).startLevelUp?.($(this).attr('data-party-lvl'));
        });

        $container.append($el);
    },

  };
}
