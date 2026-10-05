// features/dnd-panels/panels-archive-c.ts
// 导入选项对话框 / FVTT 导入（b10b · 自 BasedonST `src/ui/modules/UIPanels.js` 拆分移植）
import { DND_CONFIG } from '../dnd-core';

export function createPanelsArchiveCFragment(deps: any): any {
  return {
    showImportOptionsDialog(jsonData) {
        const { $ } = deps.utils.getCore();
        const party = jsonData.party || [];
        
        // 构建角色选择区域
        let checkboxHtml = `
            <div style="margin-bottom:10px;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;color:var(--dnd-text-highlight);font-weight:bold;">
                    <input type="checkbox" id="dnd-import-select-all" checked style="width:18px;height:18px;cursor:pointer;">
                    <span>全选/取消全选</span>
                </label>
            </div>
            <div style="max-height:200px;overflow-y:auto;border:1px solid var(--dnd-border-inner);border-radius:4px;padding:10px;margin-bottom:15px;">
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
                    <input type="checkbox" class="dnd-import-char-checkbox" value="${charId}" checked style="width:16px;height:16px;cursor:pointer;">
                    <span style="flex:1;">
                        <span style="color:var(--dnd-text-main);font-weight:bold;">${charName}</span>
                        <span style="color:var(--dnd-text-dim);font-size:12px;margin-left:8px;">${charType} · ${charClass}</span>
                    </span>
                </label>
            `;
        });
        
        checkboxHtml += `</div>`;
        
        // 构建导入模式选择区域
        const modeHtml = `
            <div style="margin-bottom:20px;">
                <p style="color:var(--dnd-text-highlight);font-weight:bold;margin-bottom:10px;">导入模式：</p>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <label style="display:flex;align-items:flex-start;gap:10px;padding:12px;background:var(--dnd-bg-tertiary);border-radius:4px;cursor:pointer;border:2px solid var(--dnd-border-gold);transition:border-color 0.2s;" id="dnd-import-mode-append-label">
                        <input type="radio" name="dnd-import-mode" value="append" checked style="width:18px;height:18px;margin-top:2px;cursor:pointer;">
                        <span>
                            <span style="color:var(--dnd-text-main);font-weight:bold;display:block;">📥 追加角色</span>
                            <span style="color:var(--dnd-text-dim);font-size:12px;">将选中的角色添加到现有队伍中，不会删除现有角色。如果角色ID重复，将更新该角色数据。</span>
                        </span>
                    </label>
                    <label style="display:flex;align-items:flex-start;gap:10px;padding:12px;background:var(--dnd-bg-tertiary);border-radius:4px;cursor:pointer;border:2px solid transparent;transition:border-color 0.2s;" id="dnd-import-mode-replace-label">
                        <input type="radio" name="dnd-import-mode" value="replace" style="width:18px;height:18px;margin-top:2px;cursor:pointer;">
                        <span>
                            <span style="color:var(--dnd-text-main);font-weight:bold;display:block;">${deps.icons.SYNC} 替换队伍</span>
                            <span style="color:var(--dnd-accent-red);font-size:12px;">${deps.icons.WARNING} 警告：这将清空当前所有队伍数据，然后导入选中的角色。</span>
                        </span>
                    </label>
                </div>
            </div>
        `;
        
        const modalContent = `
            <div style="margin-bottom:15px;">
                <p style="color:var(--dnd-text-dim);margin-bottom:10px;">文件包含 ${party.length} 个角色，选择要导入的角色：</p>
                ${checkboxHtml}
            </div>
            ${modeHtml}
            <div style="display:flex;gap:10px;justify-content:flex-end;">
                <button class="dnd-btn dnd-import-cancel-btn" style="background:var(--dnd-bg-tertiary);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);padding:8px 20px;border-radius:4px;cursor:pointer;">取消</button>
                <button class="dnd-btn dnd-import-confirm-btn" style="background:var(--dnd-border-gold);border:none;color:var(--dnd-text-header);padding:8px 20px;border-radius:4px;cursor:pointer;font-weight:bold;">导入</button>
            </div>
        `;
        
        this.showModal('📥 导入队伍', modalContent);
        
        const $overlay = $('#dnd-modal-overlay');
        
        // 绑定全选/取消全选
        $overlay.find('#dnd-import-select-all').on('change', function() {
            const checked = $(this).prop('checked');
            $overlay.find('.dnd-import-char-checkbox').prop('checked', checked);
        });
        
        // 更新全选状态
        $overlay.find('.dnd-import-char-checkbox').on('change', function() {
            const allChecked = $overlay.find('.dnd-import-char-checkbox:checked').length === $overlay.find('.dnd-import-char-checkbox').length;
            $overlay.find('#dnd-import-select-all').prop('checked', allChecked);
        });
        
        // 导入模式切换视觉效果
        $overlay.find('input[name="dnd-import-mode"]').on('change', function() {
            $overlay.find('#dnd-import-mode-append-label, #dnd-import-mode-replace-label').css('border-color', 'transparent');
            $(this).closest('label').css('border-color', 'var(--dnd-border-gold)');
        });
        
        // 取消按钮
        $overlay.find('.dnd-import-cancel-btn').on('click', () => {
            $overlay.removeClass('active');
        });
        
        // 确认导入按钮
        const self = this;
        $overlay.find('.dnd-import-confirm-btn').on('click', async function() {
            try {
                const selectedIds = [];
                $overlay.find('.dnd-import-char-checkbox:checked').each(function() {
                    selectedIds.push($(this).val());
                });
                
                if (selectedIds.length === 0) {
                    deps.notification.error('请至少选择一个角色');
                    return;
                }
                
                const mode = $overlay.find('input[name="dnd-import-mode"]:checked').val();
                
                // 如果是替换模式，显示二次确认（改用应用内对话框，兼容 iframe/沙箱环境）
                if (mode === 'replace') {
                    const confirmReplace = await deps.notification.confirm('⚠ 确定要替换当前队伍吗？\n\n这将删除现有的所有队伍数据（包括角色、技能关联和专长关联），然后导入选中的角色。\n\n此操作不可撤销！', {
                        title: '替换队伍确认',
                        confirmText: '确定替换',
                        cancelText: '取消',
                        type: 'warning'
                    });
                    if (!confirmReplace) return;
                }
                
                const result = await deps.dataManager.importPartyData(jsonData, {
                    mode: mode,
                    selectedCharIds: selectedIds
                });
                
                if (result.success) {
                    $overlay.removeClass('active');
                    deps.notification.success(result.message);
                    // 刷新界面
                    self.renderPanel('party');
                } else {
                    deps.notification.error(result.message);
                }
            } catch (err) {
                deps.logger.error('Import failed:', err);
                deps.notification.error('导入失败: ' + err.message);
            }
        });
    },

    // [新增] 从 FVTT 文件导入
    importFVTTFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const json = JSON.parse(event.target.result);
                    const result = await deps.dataManager.importFVTTData(json);
                    if (result.success) {
                        deps.notification.success(result.message);
                        this.renderPanel('party');
                    } else {
                        deps.notification.error(result.message);
                    }
                } catch (err) {
                    deps.logger.error('FVTT Import error:', err);
                    deps.notification.error('FVTT 文件解析失败');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    },

    // [优化] 渲染快捷物品栏 (只显示装备和消耗品)
  };
}
