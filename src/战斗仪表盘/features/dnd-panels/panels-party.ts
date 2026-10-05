// features/dnd-panels/panels-party.ts
// 队伍 / 任务 / 战斗面板（b10b · 自 BasedonST `src/ui/modules/UIPanels.js` 拆分移植）
import { DND_CONFIG } from '../dnd-core';

export function createPanelsPartyFragment(deps: any): any {
  return {
    renderPartyPanel($container) {
        const { $ } = deps.utils.getCore();
        const party = deps.dataManager.getPartyData() || [];
        
        // [新增] 队伍工具栏 - 导入/导出按钮
        const $toolbar = $(`
            <div class="dnd-party-toolbar" style="display:flex;gap:10px;margin-bottom:15px;padding:10px;background:var(--dnd-bg-secondary);border-radius:6px;border:1px solid var(--dnd-border-inner);">
                <div style="flex:1;display:flex;align-items:center;gap:10px;">
                    <span style="font-weight:bold;color:var(--dnd-text-highlight);"><i class="fa-solid fa-users"></i> 冒险队伍</span>
                    <span style="font-size:12px;color:var(--dnd-text-dim);">(${party.length} 名成员)</span>
                </div>
                <button class="dnd-btn dnd-clickable dnd-export-party-btn" style="background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-gold);color:var(--dnd-text-main);padding:6px 12px;border-radius:4px;cursor:pointer;display:flex;align-items:center;gap:5px;">
                    <i class="fa-solid fa-download"></i> 导出队伍
                </button>
                <button class="dnd-btn dnd-clickable dnd-import-party-btn" style="background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-inner);color:var(--dnd-text-main);padding:6px 12px;border-radius:4px;cursor:pointer;display:flex;align-items:center;gap:5px;">
                    <i class="fa-solid fa-upload"></i> 导入队伍
                </button>
                <button class="dnd-btn dnd-clickable dnd-import-fvtt-btn" style="background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-inner);color:var(--dnd-text-highlight);padding:6px 12px;border-radius:4px;cursor:pointer;display:flex;align-items:center;gap:5px;">
                    <i class="fa-solid fa-file-import"></i> 导入 FVTT
                </button>
            </div>
        `);

        const self = this;
        // 绑定导出按钮事件
        $toolbar.find('.dnd-export-party-btn').on('click', function() {
            self.exportPartyToFile();
        });

        // 绑定导入按钮事件
        $toolbar.find('.dnd-import-party-btn').on('click', function() {
            self.importPartyFromFile();
        });

        // 绑定 FVTT 导入按钮事件
        $toolbar.find('.dnd-import-fvtt-btn').on('click', function() {
            self.importFVTTFromFile();
        });

        $container.empty();
        $container.append($toolbar);

        if (party.length === 0) {
            $container.append('<div style="padding:20px; text-align:center;">暂无队伍数据，请确保已连接数据库并加载 DND 模板。</div>');
            return;
        }

        const $grid = $('<div class="dnd-grid"></div>');

        party.forEach((char, index) => {
            // 解析 HP
            let hpCurrent = 0, hpMax = 0, hpPercent = 0;
            if (char['HP']) {
                const parts = char['HP'].toString().split('/');
                if (parts.length === 2) {
                    hpCurrent = parseInt(parts[0]) || 0;
                    hpMax = parseInt(parts[1]) || 1;
                    hpPercent = Math.min(100, Math.max(0, (hpCurrent / hpMax) * 100));
                }
            }

            //解析 经验值

            let expCurrent = 0, expMax = 0, expPercent = 0;
            if (char['经验值']) {
                const expParts = char['经验值'].toString().split('/');
                if (expParts.length === 2) {
                    expCurrent = parseInt(expParts[0]) || 0;
                    expMax = parseInt(expParts[1]) || 1;
                    expPercent = Math.min(100, Math.max(0, (expCurrent / expMax) * 100));
                }
            }

            // 解析属性
            let statsHtml = '';
            // 优先尝试通用解析 (支持 JSON 和 STR:10|DEX:12 格式)
            const statsObj = deps.dataManager.parseValue(char['属性值'], 'stats') || {};

            if (Object.keys(statsObj).length > 0) {
                statsHtml = '<div style="display:flex; justify-content:space-between; margin-bottom:10px; background:var(--dnd-bg-secondary); padding:5px; border-radius:4px;">';
                Object.keys(statsObj).forEach(k => {
                    statsHtml += `<div style="text-align:center;"><div style="font-size:10px;color:var(--dnd-text-dim)">${k}</div><div style="font-weight:bold">${statsObj[k]}</div></div>`;
                });
                statsHtml += '</div>';
            }

            const avatarHtml = ((window as any).DND_Dashboard_UI || this).renderAvatar?.( char['姓名'], char, 40);
            
            // 解析熟练技能 (用于悬浮提示)
            let skillTooltip = '点击查看详情';
            try {
                if (char['技能熟练']) {
                    let skills = [];
                    // 处理 JSON 字符串或数组字符串
                    if (typeof char['技能熟练'] === 'string') {
                        if (char['技能熟练'].startsWith('[')) {
                            skills = JSON.parse(char['技能熟练']);
                        } else {
                            skills = char['技能熟练'].split(/[,;，；]/);
                        }
                    } else if (Array.isArray(char['技能熟练'])) {
                        skills = char['技能熟练'];
                    }
                    
                    if (skills && skills.length > 0) {
                        skillTooltip = '熟练技能: ' + skills.map(s => s.trim()).join(', ');
                    }
                }
            } catch(e) {}

            const cardHtml = `
                <div class="dnd-char-card dnd-anim-entry dnd-clickable" style="cursor:pointer; animation-delay: ${index * 0.05}s" title="${skillTooltip}">
                    <div class="dnd-card-header" style="justify-content:flex-start;gap:10px;">
                        ${avatarHtml}
                        <div style="flex:1;overflow:hidden;">
                            <div class="dnd-char-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${char['姓名'] || '未知'}</div>
                            <div class="dnd-char-lvl" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${char['种族/性别/年龄'] || ''} | ${char['职业'] || ''}</div>
                        </div>
                    </div>
                    <div class="dnd-card-body">
                        ${statsHtml}
                        <div class="dnd-stat-row">
                            <span class="dnd-stat-label">AC (护甲)</span>
                            <span class="dnd-stat-val">${char['AC'] || '-'}</span>
                        </div>
                        <div class="dnd-stat-row">
                            <span class="dnd-stat-label">先攻加值</span>
                            <span class="dnd-stat-val">${char['先攻加值'] || '+0'}</span>
                        </div>
                        <div class="dnd-stat-row">
                            <span class="dnd-stat-label">被动感知</span>
                            <span class="dnd-stat-val">${char['被动感知'] || '10'}</span>
                        </div>
                        
                        <div>
                            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px;">
                                <span>HP</span>
                                <span>${hpCurrent} / ${hpMax}</span>
                            </div>
                            <div class="dnd-bar-container dnd-bar-hp">
                                <div class="dnd-bar-fill" style="width: ${hpPercent}%"></div>
                            </div>
                        </div>

                        ${char['经验值'] ? `
                        <div>
                            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px;">
                                <span>XP</span>
                                <span>${char['经验值']}</span>
                            </div>
                            <div class="dnd-bar-container dnd-bar-exp">
                                <div class="dnd-bar-fill" style="width: ${expPercent}%"></div>
                            </div>
                        </div>` : ''}
                        
                        <div style="margin-top:5px;font-size:12px;color:var(--dnd-text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                            ${char['外貌描述'] || '无描述'}
                        </div>
                    </div>
                </div>
            `;
            
            const $card = $(cardHtml);
            $card.on('click', (e) => {
                deps.logger.debug('[PartyPanel] Clicked card for', char['姓名']);
                // 使用统一的角色详情卡片，而不是简陋的 Modal
                // 传递点击事件以便在鼠标位置显示卡片
                self.showCharacterCard(char, e);
            });
            
            $grid.append($card);
        });
        $container.append($grid);
    },

    renderQuestsPanel($container) {
        const { $ } = deps.utils.getCore();
        const quests = deps.dataManager.getTable('QUEST_Active');
        if (!quests) {
            $container.html('暂无任务数据。');
            return;
        }

        const $list = $('<div style="display:flex;flex-direction:column;gap:15px;"></div>');

        quests.forEach((q, index) => {
            const statusColor = q['状态'] === '已完成' ? 'var(--dnd-accent-green)' : (q['状态'] === '已失败' ? 'var(--dnd-accent-red)' : 'var(--dnd-text-highlight)');
            
            const itemHtml = `
                <div class="dnd-anim-entry" style="animation-delay:${index * 0.05}s; background:var(--dnd-bg-panel);border:1px solid var(--dnd-border-inner);padding:15px;border-radius:4px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                        <span style="font-weight:bold;color:var(--dnd-text-header);font-size:18px;">${q['任务名称']}</span>
                        <span style="background:${statusColor};color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;">${q['状态']}</span>
                    </div>
                    <div style="font-size:14px;color:var(--dnd-text-main);margin-bottom:8px;">${q['目标描述'] || ''}</div>
                    <div style="font-size:12px;color:var(--dnd-text-dim);">
                        发布者: ${q['发布者'] || '-'} | 奖励: ${q['奖励'] || '-'}
                    </div>
                </div>
            `;
            $list.append(itemHtml);
        });
        $container.append($list);
    },

    renderCombatPanel($container) {
        const { $ } = deps.utils.getCore();
        const encounters = deps.dataManager.getTable('COMBAT_Encounter');
        const mapData = deps.dataManager.getTable('COMBAT_BattleMap');

        // 布局
        const $layout = $('<div style="display:flex;gap:20px;height:100%;"></div>');
        const $sidebar = $('<div style="width:250px;background:var(--dnd-bg-secondary);padding:10px;overflow-y:auto;"></div>');
        const $mapArea = $('<div class="dnd-map-container"></div>');

        $sidebar.html('<h3 style="color:var(--dnd-text-header);border-bottom:1px solid var(--dnd-border-gold);padding-bottom:5px;">先攻列表</h3>');
        
        if (encounters) {
            const sorted = [...encounters].sort((a, b) => {
                const valA = parseInt(a['先攻/位置']) || 0;
                const valB = parseInt(b['先攻/位置']) || 0;
                return valB - valA;
            });

            sorted.forEach(unit => {
                const isActive = unit['是否为当前行动者'] === '是';
                const hp = unit['HP状态'] || '??/??';
                const activeStyle = isActive ? 'background:var(--dnd-selected-bg);border-left:3px solid var(--dnd-border-gold);' : '';
                
                const rowHtml = `
                    <div style="padding:8px;border-bottom:1px solid var(--dnd-border-subtle);display:flex;justify-content:space-between;${activeStyle}">
                        <div>
                            <div style="font-weight:bold;color:${unit['阵营'] === '敌方' ? 'var(--dnd-accent-red)' : 'var(--dnd-text-main)'}">${unit['单位名称']}</div>
                            <div style="font-size:12px;color:var(--dnd-text-dim);">HP: ${hp}</div>
                        </div>
                        <div style="font-size:16px;font-weight:bold;color:var(--dnd-text-header)">${parseInt(unit['先攻/位置'])||0}</div>
                    </div>
                `;
                $sidebar.append(rowHtml);
            });
        } else {
            $sidebar.append('<div style="color:var(--dnd-text-dim)">非战斗状态</div>');
        }

        if (mapData && mapData.length > 0) {
            const config = mapData.find(m => m['类型'] === 'Config');
            let cols = 20, rows = 20;
            if (config && config['坐标']) {
                // Config 行的坐标字段存的是尺寸: {w:20,h:20} 或 "20,20"
                const size = deps.dataManager.parseValue(config['坐标'], 'size'); // 使用 size 解析器
                if (size) {
                    if (size.w) cols = size.w;
                    if (size.h) rows = size.h;
                }
            }

            // 移除全屏版战斗地图显示，仅保留文字提示或预留空间
                $mapArea.html('<div style="color:var(--dnd-text-dim);padding:20px;text-align:center;">（战斗地图已隐藏，请使用 HUD 查看）</div>');
        } else {
            $mapArea.html('<div style="color:var(--dnd-text-dim)">无地图数据</div>');
        }

        $layout.append($sidebar).append($mapArea);
        $container.append($layout);
    },

  };
}
