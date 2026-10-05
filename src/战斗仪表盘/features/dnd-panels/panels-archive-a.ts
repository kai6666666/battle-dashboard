// features/dnd-panels/panels-archive-a.ts
// 档案面板 / 导出队伍（b10b · 自 BasedonST `src/ui/modules/UIPanels.js` 拆分移植）
import { DND_CONFIG } from '../dnd-core';

export function createPanelsArchiveAFragment(deps: any): any {
  return {
    renderArchivesPanel($c) {
        const { $ } = deps.utils.getCore();
        const data = deps.dataManager.getAllData();
        if (!data) { $c.html('无数据'); return; }
        
        const $selector = $('<div style="margin-bottom:20px;display:flex;gap:10px;flex-wrap:wrap;"></div>');
        const $viewArea = $('<div style="overflow-x:auto;"></div>');
        
        Object.keys(data).forEach(key => {
            if (key === 'mate') return;
            const sheet = data[key];
            const $btn = $(`<button style="padding:5px 10px;background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);cursor:pointer;">${sheet.name || key}</button>`);
            
            $btn.on('click', () => {
                let html = `<h3 style="color:var(--dnd-text-highlight)">${sheet.name}</h3>`;
                html += `<table class="dnd-table"><thead><tr>`;
                if (sheet.content && sheet.content.length > 0) {
                    sheet.content[0].forEach(h => html += `<th>${h || ''}</th>`);
                    html += `</tr></thead><tbody>`;
                    sheet.content.slice(1).forEach(row => {
                        html += `<tr>`;
                        row.forEach(cell => html += `<td>${cell || ''}</td>`);
                        html += `</tr>`;
                    });
                    html += `</tbody></table>`;
                } else {
                    html += `<p>空表</p>`;
                }
                $viewArea.html(html);
                
                $selector.children().css('border-color', 'var(--dnd-border-subtle)');
                $btn.css('border-color', 'var(--dnd-border-gold)');
            });
            $selector.append($btn);
        });
        
        $c.append($selector).append($viewArea);
    },

    // [新增] 导出队伍数据到文件 (支持角色选择)
    exportPartyToFile() {
        const { $ } = deps.utils.getCore();
        const party = deps.dataManager.getPartyData() || [];
        
        if (party.length === 0) {
            deps.notification.error('无队伍数据可导出');
            return;
        }

        // 构建角色选择模态框内容
        let checkboxHtml = `
            <div style="margin-bottom:15px;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;color:var(--dnd-text-highlight);font-weight:bold;">
                    <input type="checkbox" id="dnd-export-select-all" checked style="width:18px;height:18px;cursor:pointer;">
                    <span>全选/取消全选</span>
                </label>
            </div>
            <div style="max-height:300px;overflow-y:auto;border:1px solid var(--dnd-border-inner);border-radius:4px;padding:10px;">
        `;
        
        party.forEach(char => {
            const charId = char['CHAR_ID'] || char['PC_ID'] || char['姓名'];
            const charName = char['姓名'] || charId;
            const charClass = char['职业'] || '未知职业';
            const charType = char['成员类型'] === '主角' ? `${deps.icons.MASK} 主角` : `${deps.icons.USER} 同伴`;
            
            checkboxHtml += `
                <label style="display:flex;align-items:center;gap:10px;padding:8px;margin-bottom:5px;background:var(--dnd-bg-secondary);border-radius:4px;cursor:pointer;transition:background 0.2s;"
                       onmouseenter="this.style.background='var(--dnd-selected-bg)'"
                       onmouseleave="this.style.background='var(--dnd-bg-secondary)'">
                    <input type="checkbox" class="dnd-export-char-checkbox" value="${charId}" checked style="width:16px;height:16px;cursor:pointer;">
                    <span style="flex:1;">
                        <span style="color:var(--dnd-text-main);font-weight:bold;">${charName}</span>
                        <span style="color:var(--dnd-text-dim);font-size:12px;margin-left:8px;">${charType} · ${charClass}</span>
                    </span>
                </label>
            `;
        });
        
        checkboxHtml += `</div>`;
        
        const modalContent = `
            <div style="margin-bottom:20px;">
                <p style="color:var(--dnd-text-dim);margin-bottom:15px;">选择要导出的角色：</p>
                ${checkboxHtml}
            </div>
            <div style="display:flex;gap:10px;justify-content:flex-end;">
                <button class="dnd-btn dnd-export-cancel-btn" style="background:var(--dnd-bg-tertiary);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);padding:8px 20px;border-radius:4px;cursor:pointer;">取消</button>
                <button class="dnd-btn dnd-export-confirm-btn" style="background:var(--dnd-border-gold);border:none;color:var(--dnd-text-header);padding:8px 20px;border-radius:4px;cursor:pointer;font-weight:bold;">导出</button>
            </div>
        `;
        
        this.showModal('📤 导出队伍', modalContent);
        
        // 绑定全选/取消全选
        const $overlay = $('#dnd-modal-overlay');
        $overlay.find('#dnd-export-select-all').on('change', function() {
            const checked = $(this).prop('checked');
            $overlay.find('.dnd-export-char-checkbox').prop('checked', checked);
        });
        
        // 更新全选状态
        $overlay.find('.dnd-export-char-checkbox').on('change', function() {
            const allChecked = $overlay.find('.dnd-export-char-checkbox:checked').length === $overlay.find('.dnd-export-char-checkbox').length;
            $overlay.find('#dnd-export-select-all').prop('checked', allChecked);
        });
        
        // 取消按钮
        $overlay.find('.dnd-export-cancel-btn').on('click', () => {
            $overlay.removeClass('active');
        });
        
        // 确认导出按钮
        const self = this;
        $overlay.find('.dnd-export-confirm-btn').on('click', function() {
            try {
                const selectedIds = [];
                $overlay.find('.dnd-export-char-checkbox:checked').each(function() {
                    selectedIds.push($(this).val());
                });
                
                if (selectedIds.length === 0) {
                    deps.notification.error('请至少选择一个角色');
                    return;
                }
                
                const data = deps.dataManager.exportPartyData(selectedIds);
                if (!data) {
                    deps.notification.error('导出失败');
                    return;
                }

                $overlay.removeClass('active');
                // [修复] 不再直接触发浏览器下载（部分环境会被沙箱拦截导致"点了没反应"），
                // 改为弹出结果窗口：提供"复制到剪贴板"与"下载文件"两种保存方式
                self.showExportResultDialog(data, selectedIds.length);
            } catch (e) {
                deps.logger.error('Export failed:', e);
                deps.notification.error('导出失败: ' + e.message);
            }
        });
    },

    // [修复] 打开导入窗口：支持"粘贴 JSON"与"从文件选择"两种方式（提高在沙箱/移动端环境下的可用性）
  };
}
