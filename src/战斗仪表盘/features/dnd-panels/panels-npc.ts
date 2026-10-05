// features/dnd-panels/panels-npc.ts
// NPC 面板 / 通用模态框（b10b · 自 BasedonST `src/ui/modules/UIPanels.js` 拆分移植）
import { DND_CONFIG } from '../dnd-core';

export function createPanelsNpcFragment(deps: any): any {
  return {
    renderNPCPanel($c) {
        const { $ } = deps.utils.getCore();
        const npcs = deps.dataManager.getTable('NPC_Registry');
        if (!npcs) { $c.html('无 NPC 数据'); return; }
        
        const $grid = $('<div class="dnd-grid"></div>');
        
        npcs.forEach((npc, index) => {
            const statusColor = npc['当前状态'] === '死亡' ? 'var(--dnd-accent-red)' : (npc['当前状态'] === '在场' ? 'var(--dnd-accent-green)' : 'var(--dnd-text-dim)');
            
            // 解析HP用于显示血条
            const hpStr = npc['HP'] || '';
            const hpMatch = hpStr.match(/(\d+)\s*\/\s*(\d+)/);
            const hpCurrent = hpMatch ? parseInt(hpMatch[1]) : 0;
            const hpMax = hpMatch ? parseInt(hpMatch[2]) : 1;
            const hpPercent = Math.min(100, Math.max(0, (hpCurrent / hpMax) * 100));
            const hpColor = hpPercent > 50 ? 'var(--dnd-accent-green)' : (hpPercent > 25 ? 'var(--dnd-border-gold)' : 'var(--dnd-accent-red)');
            
            const cardHtml = `
                <div class="dnd-char-card dnd-anim-entry dnd-clickable" style="cursor:pointer; animation-delay:${index * 0.05}s">
                    <div class="dnd-card-header">
                        <span class="dnd-char-name">${npc['姓名'] || '未知'}</span>
                        <span style="font-size:11px;">
                            ${npc['等级'] ? `<span style="color:var(--dnd-text-highlight);margin-right:6px;">Lv.${npc['等级']}</span>` : ''}
                            <span style="color:${statusColor}">${npc['当前状态'] || ''}</span>
                        </span>
                    </div>
                    <div class="dnd-card-body">
                        <div style="font-size:12px;color:var(--dnd-text-dim);margin-bottom:8px;">${npc['种族/性别/年龄'] || '-'} | ${npc['职业/身份'] || '-'}</div>
                        
                        ${hpStr ? `
                        <div style="margin-bottom:8px;">
                            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px;">
                                <span style="color:var(--dnd-text-dim);">HP</span>
                                <span style="color:var(--dnd-text-main);">${hpStr}${npc['AC'] ? ` | AC ${npc['AC']}` : ''}</span>
                            </div>
                            <div style="background:var(--dnd-bg-input);border-radius:3px;height:6px;overflow:hidden;">
                                <div style="width:${hpPercent}%;height:100%;background:${hpColor};transition:width 0.3s;"></div>
                            </div>
                        </div>
                        ` : (npc['AC'] ? `<div style="font-size:11px;color:var(--dnd-text-dim);margin-bottom:8px;">AC ${npc['AC']}</div>` : '')}
                        
                        <div class="dnd-stat-row">
                            <span class="dnd-stat-label">位置</span>
                            <span class="dnd-stat-val">${npc['所在位置'] || '-'}</span>
                        </div>
                        <div class="dnd-stat-row">
                            <span class="dnd-stat-label">关系</span>
                            <span class="dnd-stat-val">${npc['与主角关系'] || '-'}</span>
                        </div>
                        <div style="margin-top:10px;font-size:13px;line-height:1.4;color:var(--dnd-text-main);max-height:60px;overflow:hidden;">
                            ${npc['外貌描述'] || ''}
                        </div>
                    </div>
                </div>
            `;
            
            const $card = $(cardHtml);
            $card.on('click', () => {
                let detail = '';
                
                // 战斗属性区块
                if (npc['等级'] || npc['HP'] || npc['AC']) {
                    detail += `<div style="background:var(--dnd-bg-secondary);padding:12px;border-radius:6px;margin-bottom:15px;">`;
                    detail += `<div style="display:flex;gap:20px;flex-wrap:wrap;">`;
                    if (npc['等级']) detail += `<div><span style="color:var(--dnd-text-dim);font-size:11px;">等级</span><br><span style="color:var(--dnd-text-highlight);font-size:16px;font-weight:bold;">Lv.${npc['等级']}</span></div>`;
                    if (npc['HP']) detail += `<div><span style="color:var(--dnd-text-dim);font-size:11px;">生命值</span><br><span style="color:var(--dnd-accent-red);font-size:16px;font-weight:bold;">${npc['HP']}</span></div>`;
                    if (npc['AC']) detail += `<div><span style="color:var(--dnd-text-dim);font-size:11px;">护甲</span><br><span style="color:var(--dnd-text-main);font-size:16px;font-weight:bold;">AC ${npc['AC']}</span></div>`;
                    detail += `</div></div>`;
                }
                
                // 主要技能
                if (npc['主要技能']) {
                    detail += `<div style="margin-bottom:12px;"><strong style="color:var(--dnd-text-highlight);">主要技能:</strong><br>`;
                    const skills = npc['主要技能'].split(/[,，]/).map(s => s.trim()).filter(s => s);
                    detail += `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">`;
                    skills.forEach(skill => {
                        detail += `<span style="background:var(--dnd-bg-tertiary);color:var(--dnd-text-highlight);padding:3px 8px;border-radius:4px;font-size:12px;">${skill}</span>`;
                    });
                    detail += `</div></div>`;
                }
                
                // 随身物品
                if (npc['随身物品']) {
                    detail += `<div style="margin-bottom:12px;"><strong style="color:var(--dnd-text-header);">随身物品:</strong><br>`;
                    const items = npc['随身物品'].split(/[,，]/).map(s => s.trim()).filter(s => s);
                    detail += `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">`;
                    items.forEach(item => {
                        detail += `<span style="background:var(--dnd-bg-tertiary);color:var(--dnd-text-header);padding:3px 8px;border-radius:4px;font-size:12px;">${item}</span>`;
                    });
                    detail += `</div></div>`;
                }
                
                // 关键经历
                detail += `<div style="margin-bottom:10px"><strong>关键经历:</strong><br><span style="color:var(--dnd-text-main);">${npc['关键经历'] || '无'}</span></div>`;
                
                // 外貌描述
                detail += `<div style="margin-bottom:10px"><strong>外貌:</strong><br><span style="color:var(--dnd-text-main);">${npc['外貌描述'] || '无'}</span></div>`;
                
                detail += `<div style="margin-top:20px;font-size:10px;color:var(--dnd-text-dim)">ID: ${npc['NPC_ID']}</div>`;
                this.showModal(npc['姓名'], detail);
            });
            
            $grid.append($card);
        });
        $c.append($grid);
    },

    // 显示模态框（用于全屏面板的NPC详情等）
    showModal(title, content) {
        const { $ } = deps.utils.getCore();
        const $overlay = $('#dnd-modal-overlay');
        const $modal = $('#dnd-modal-content');
        
        $modal.html(`
            <div class="dnd-modal-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border-bottom:1px solid var(--dnd-border-gold);padding-bottom:12px;">
                <h3 style="margin:0;color:var(--dnd-text-highlight);font-size:18px;">${title}</h3>
                <span class="dnd-modal-close" style="cursor:pointer;font-size:20px;color:var(--dnd-text-dim);width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:4px;transition:all 0.2s;"><i class="fa-solid fa-times"></i></span>
            </div>
            <div class="dnd-modal-body" style="max-height:60vh;overflow-y:auto;padding-right:5px;text-align: left;">${content}</div>
        `);
        
        // 绑定关闭按钮事件（使用jQuery事件而不是内联onclick）
        $modal.find('.dnd-modal-close').on('click', function() {
            $overlay.removeClass('active');
        }).on('mouseenter', function() {
            $(this).css({ background: 'var(--dnd-bg-tertiary)', color: 'var(--dnd-text-highlight)' });
        }).on('mouseleave', function() {
            $(this).css({ background: 'transparent', color: 'var(--dnd-text-dim)' });
        });
        
        $overlay.addClass('active');
    },

  };
}
