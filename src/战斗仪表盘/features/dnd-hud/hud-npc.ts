// features/dnd-hud/hud-npc.ts
// NPC 列表/详情（b4 · 自 BasedonST `src/ui/modules/UIHUD.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createHudNpcFragment(deps: any): any {
  return {
    showNPCListPanel(event) {
        const npcs = deps.dataManager.getTable('NPC_Registry');
        
        if (!npcs || npcs.length === 0) {
            ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.(`<div style="text-align:center;color:#888;">${deps.icons.USERS} 暂无NPC数据</div>`, event.clientX, event.clientY);
            return;
        }
        
        // 获取所有状态类型
        const statuses = [...new Set(npcs.map(n => n['当前状态'] || '未知'))].sort();
        
        let html = `<div style="font-weight:bold;color:var(--dnd-text-main);border-bottom:1px solid var(--dnd-border-gold);padding-bottom:5px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
            <span>${deps.icons.USERS} NPC列表</span>
            <span style="font-size:11px;color:#888;">${npcs.length} 人</span>
        </div>`;
        
        // 搜索和筛选
        html += `
            <div style="display:flex;gap:5px;margin-bottom:10px;">
                <input type="text" id="dnd-npc-search" placeholder="搜索NPC..." style="flex:1;background:#1a1a1c;border:1px solid #444;color:#ccc;padding:4px 8px;border-radius:4px;font-size:12px;" oninput="window.DND_Dashboard_UI.filterNPCList()">
                <select id="dnd-npc-filter" style="background:#1a1a1c;border:1px solid #444;color:#ccc;padding:4px;border-radius:4px;font-size:12px;" onchange="window.DND_Dashboard_UI.filterNPCList()">
                    <option value="">全部状态</option>
                    ${statuses.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
            </div>
        `;
        
        html += `<div style="max-height:400px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;" id="dnd-npc-list">`;
        
        npcs.forEach(npc => {
            const npcId = npc['NPC_ID'] || '';
            const safeId = npcId.replace(/'/g, "\\'");
            const statusColor = npc['当前状态'] === '死亡' ? '#8a2c2c' : (npc['当前状态'] === '在场' ? '#3a6b4a' : '#888');
            
            // 解析HP用于显示
            const hpStr = npc['HP'] || '';
            const hpMatch = hpStr.match(/(\d+)\s*\/\s*(\d+)/);
            const hpCurrent = hpMatch ? parseInt(hpMatch[1]) : 0;
            const hpMax = hpMatch ? parseInt(hpMatch[2]) : 1;
            const hpPercent = Math.min(100, Math.max(0, (hpCurrent / hpMax) * 100));
            const hpColor = hpPercent > 50 ? '#4a7c59' : (hpPercent > 25 ? '#b8860b' : '#8a2c2c');
            
            html += `
                <div class="dnd-npc-list-item" data-name="${npc['姓名'] || ''}" data-status="${npc['当前状态'] || ''}"
                    style="padding:8px 10px;background:rgba(255,255,255,0.03);border:1px solid var(--dnd-border-inner);border-radius:6px;cursor:pointer;"
                    onmouseover="this.style.background='rgba(255,255,255,0.08)';this.style.borderColor='var(--dnd-border-gold)'"
                    onmouseout="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='var(--dnd-border-inner)'"
                    data-npc-id="${safeId}">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                        <span style="font-weight:bold;color:var(--dnd-text-main);">${npc['姓名'] || '未知'}</span>
                        <span style="font-size:11px;">
                            ${npc['等级'] ? `<span style="color:#d4af37;margin-right:6px;">Lv.${npc['等级']}</span>` : ''}
                            <span style="color:${statusColor}">${npc['当前状态'] || ''}</span>
                        </span>
                    </div>
                    <div style="font-size:11px;color:#888;margin-bottom:4px;">${npc['种族/性别/年龄'] || '-'} | ${npc['职业/身份'] || '-'}</div>
                    ${hpStr ? `
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="flex:1;background:#1a1a1a;border-radius:3px;height:4px;overflow:hidden;">
                            <div style="width:${hpPercent}%;height:100%;background:${hpColor};"></div>
                        </div>
                        <span style="font-size:10px;color:#888;">${hpStr}${npc['AC'] ? ` | AC${npc['AC']}` : ''}</span>
                    </div>
                    ` : (npc['AC'] ? `<div style="font-size:10px;color:#888;">AC ${npc['AC']}</div>` : '')}
                </div>
            `;
        });
        
        html += `</div>`;
        
        ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.(html, event.clientX, event.clientY);
        // [b12.6] NPC 项点击：脚本绑定（替代 inline onclick）
        const { $: $$ } = deps.utils.getCore();
        const self2: any = this;
        $$('#dnd-detail-popup-el .dnd-npc-list-item').off('click.dndNpcItem').on('click.dndNpcItem', function(e) {
            e.stopPropagation();
            self2.showNPCDetail?.($$(this).attr('data-npc-id'), e);
        });
    },

    // [新增] 过滤NPC列表
    filterNPCList() {
        const { $ } = deps.utils.getCore();
        const searchText = ($('#dnd-npc-search').val() || '').toLowerCase();
        const statusFilter = $('#dnd-npc-filter').val();
        
        $('#dnd-npc-list .dnd-npc-list-item').each(function() {
            const $item = $(this);
            const name = ($item.data('name') || '').toLowerCase();
            const status = $item.data('status') || '';
            
            const matchSearch = !searchText || name.includes(searchText);
            const matchStatus = !statusFilter || status === statusFilter;
            
            $item.toggle(matchSearch && matchStatus);
        });
    },

    // [新增] 显示NPC详情弹窗
    showNPCDetail(npcId, event) {
        const npcs = deps.dataManager.getTable('NPC_Registry');
        const npc = npcs?.find(n => n['NPC_ID'] === npcId);
        
        if (!npc) {
            console.error('NPC not found:', npcId);
            return;
        }
        
        let html = `<div style="min-width:220px;max-width:350px;">`;
        
        // 头部
        const statusColor = npc['当前状态'] === '死亡' ? '#8a2c2c' : (npc['当前状态'] === '在场' ? '#3a6b4a' : '#888');
        html += `
            <div style="border-bottom:1px solid var(--dnd-border-gold);padding-bottom:8px;margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:16px;font-weight:bold;color:var(--dnd-text-main);">${npc['姓名'] || '未知'}</span>
                    <span style="font-size:12px;">
                        ${npc['等级'] ? `<span style="color:#d4af37;margin-right:6px;">Lv.${npc['等级']}</span>` : ''}
                        <span style="color:${statusColor}">${npc['当前状态'] || ''}</span>
                    </span>
                </div>
                <div style="font-size:12px;color:#888;margin-top:4px;">${npc['种族/性别/年龄'] || '-'} | ${npc['职业/身份'] || '-'}</div>
            </div>
        `;
        
        // 战斗属性区块
        if (npc['等级'] || npc['HP'] || npc['AC']) {
            html += `<div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px;margin-bottom:12px;">`;
            html += `<div style="display:flex;gap:16px;flex-wrap:wrap;">`;
            if (npc['等级']) html += `<div><span style="color:#888;font-size:10px;">等级</span><br><span style="color:#d4af37;font-size:14px;font-weight:bold;">Lv.${npc['等级']}</span></div>`;
            if (npc['HP']) html += `<div><span style="color:#888;font-size:10px;">生命值</span><br><span style="color:#c94c4c;font-size:14px;font-weight:bold;">${npc['HP']}</span></div>`;
            if (npc['AC']) html += `<div><span style="color:#888;font-size:10px;">护甲</span><br><span style="color:#6a9fb5;font-size:14px;font-weight:bold;">AC ${npc['AC']}</span></div>`;
            html += `</div></div>`;
        }
        
        // 位置和关系
        html += `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;font-size:12px;">
                <div><span style="color:#888;">位置:</span> <span style="color:#ccc;">${npc['所在位置'] || '-'}</span></div>
                <div><span style="color:#888;">关系:</span> <span style="color:#ccc;">${npc['与主角关系'] || '-'}</span></div>
            </div>
        `;
        
        // 主要技能
        if (npc['主要技能']) {
            html += `<div style="margin-bottom:10px;"><span style="color:#d4af37;font-size:12px;font-weight:bold;">主要技能</span>`;
            const skills = npc['主要技能'].split(/[,，]/).map(s => s.trim()).filter(s => s);
            html += `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">`;
            skills.forEach(skill => {
                html += `<span style="background:rgba(212,175,55,0.15);color:#d4af37;padding:2px 6px;border-radius:4px;font-size:11px;">${skill}</span>`;
            });
            html += `</div></div>`;
        }
        
        // 随身物品
        if (npc['随身物品']) {
            html += `<div style="margin-bottom:10px;"><span style="color:#8b7355;font-size:12px;font-weight:bold;">随身物品</span>`;
            const items = npc['随身物品'].split(/[,，]/).map(s => s.trim()).filter(s => s);
            html += `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">`;
            items.forEach(item => {
                html += `<span style="background:rgba(139,115,85,0.15);color:#c9a86c;padding:2px 6px;border-radius:4px;font-size:11px;">${item}</span>`;
            });
            html += `</div></div>`;
        }
        
        // 外貌描述
        if (npc['外貌描述']) {
            html += `<div style="margin-bottom:10px;"><span style="color:#888;font-size:12px;font-weight:bold;">外貌</span>
                <div style="color:#aaa;font-size:12px;line-height:1.4;margin-top:4px;max-height:150px;overflow-y:auto;">${npc['外貌描述']}</div>
            </div>`;
        }
        
        // 关键经历
        if (npc['关键经历']) {
            html += `<div style="margin-bottom:10px;"><span style="color:#888;font-size:12px;font-weight:bold;">关键经历</span>
                <div style="color:#aaa;font-size:12px;line-height:1.4;margin-top:4px;max-height:200px;overflow-y:auto;">${npc['关键经历']}</div>
            </div>`;
        }
        
        html += `<div style="margin-top:12px;font-size:10px;color:#555;text-align:right;">ID: ${npc['NPC_ID']}</div>`;
        html += `</div>`;
        
        // 阻止事件冒泡，避免触发父级的点击
        if (event) event.stopPropagation();
        
        ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.(html, event.clientX, event.clientY);
    },

    // [新增] 渲染迷你法术位
  };
}
