// features/dnd-table/table-records.ts
// 记录操作（保存/搜索/增删）（b10c · 自 BasedonST `src/ui/modules/UITableManager.js` 拆分移植）
// 边界：与骰子侧表格编辑器（B）的关系待 b12 按决策 §6.2-7 收口（本模块届时降级为只读/跳转）。
import { DND_CONFIG } from '../dnd-core';

export function createTableRecordsFragment(deps: any): any {
  return {
    async saveRecord(tableKey, rowIndex, newDataMap, $btn) {
        if ($btn) $btn.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i>');

        try {
            const allData = deps.dataManager.getAllData();
            const sheet = allData[tableKey];
            
            if (!sheet || !sheet.content) throw new Error('表格数据丢失');

            // 确保行存在
            if (!sheet.content[rowIndex]) {
                throw new Error('记录不存在');
            }

            // 更新数据
            Object.keys(newDataMap).forEach(colIdx => {
                sheet.content[rowIndex][colIdx] = newDataMap[colIdx];
            });

            // 保存到后端
            await deps.saveData(allData);

            if ($btn) {
                $btn.html('<i class="fa-solid fa-check"></i> 已保存');
                setTimeout(() => $btn.html('<i class="fa-solid fa-save"></i> 保存').prop('disabled', false), 1500);
            }
            deps.logger.info(`[TableManager] Updated record in ${tableKey} at row ${rowIndex}`);

        } catch (err) {
            console.error('[TableManager] Save failed:', err);
            if ($btn) {
                $btn.html('<i class="fa-solid fa-triangle-exclamation"></i> 失败');
                setTimeout(() => $btn.html('<i class="fa-solid fa-save"></i> 保存').prop('disabled', false), 2000);
            }
        }
    },

    // ========== 搜索功能 ==========
    
    // 执行搜索
    performSearch(keyword) {
        const { $ } = deps.utils.getCore();
        
        if (!this.state.currentTableKey) return;
        
        const allData = deps.dataManager.getAllData();
        const sheet = allData[this.state.currentTableKey];
        if (!sheet || !sheet.content || sheet.content.length < 2) return;
        
        const rows = sheet.content.slice(1);
        
        if (!keyword || keyword.trim() === '') {
            // 无搜索词时显示全部
            this.state.filteredRowIndices = null;
        } else {
            const lowerKeyword = keyword.toLowerCase();
            this.state.filteredRowIndices = [];
            
            rows.forEach((row, index) => {
                // 检查每个单元格是否包含关键词
                const matches = row.some(cell =>
                    cell && String(cell).toLowerCase().includes(lowerKeyword)
                );
                if (matches) {
                    this.state.filteredRowIndices.push(index);
                }
            });
        }
        
        // 重新渲染卡片
        this.renderCards($('#dnd-tm-cards-container'), this.state.currentTableKey);
    },
    
    // 清除搜索
    clearSearch() {
        const { $ } = deps.utils.getCore();
        this.state.searchKeyword = '';
        this.state.filteredRowIndices = null;
        $('#dnd-tm-search').val('');
        $('#dnd-tm-search-clear').removeClass('visible');
    },
    
    // 更新搜索计数
    updateSearchCount(visible, total) {
        const { $ } = deps.utils.getCore();
        const $count = $('#dnd-tm-search-count');
        
        if (total === 0) {
            $count.text('');
        } else if (this.state.filteredRowIndices !== null) {
            $count.text(`显示 ${visible}/${total} 条`);
        } else {
            $count.text(`共 ${total} 条`);
        }
    },

    // ========== 新增/删除记录 ==========
    
    // 新增记录
    async addRecord(tableKey) {
        const { $ } = deps.utils.getCore();
        const $btn = $('#dnd-tm-add-record');
        
        $btn.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i>');
        
        try {
            const allData = deps.dataManager.getAllData();
            const sheet = allData[tableKey];
            
            if (!sheet || !sheet.content) {
                throw new Error('表格数据丢失');
            }
            
            const headers = sheet.content[0];
            // 创建空白行，保持与表头相同的列数
            const newRow = headers.map(() => '');
            
            // 添加到数据末尾
            sheet.content.push(newRow);
            
            // 保存到后端
            await deps.saveData(allData);
            
            deps.logger.info(`[TableManager] Added new record to ${tableKey}`);
            
            // 清除搜索过滤（以便看到新记录）
            this.clearSearch();
            
            // 刷新卡片视图
            this.renderCards($('#dnd-tm-cards-container'), tableKey);
            
            // 自动滚动到底部
            setTimeout(() => {
                const $container = $('#dnd-tm-cards-container');
                $container.scrollTop($container[0].scrollHeight);
            }, 100);
            
            $btn.html('<i class="fa-solid fa-check"></i> 已添加');
            setTimeout(() => $btn.html('<i class="fa-solid fa-plus"></i> 新增').prop('disabled', false), 1500);
            
        } catch (err) {
            console.error('[TableManager] Add record failed:', err);
            $btn.html('<i class="fa-solid fa-triangle-exclamation"></i> 失败');
            setTimeout(() => $btn.html('<i class="fa-solid fa-plus"></i> 新增').prop('disabled', false), 2000);
        }
    },
    
    // 删除记录
    async deleteRecord(tableKey, rowIndex, $card) {
        const { $ } = deps.utils.getCore();
        
        // 显示确认对话框
        const confirmed = await this.showConfirmDialog(
            '确认删除',
            '确定要删除这条记录吗？此操作不可撤销。'
        );
        
        if (!confirmed) return;
        
        try {
            const allData = deps.dataManager.getAllData();
            const sheet = allData[tableKey];
            
            if (!sheet || !sheet.content || !sheet.content[rowIndex]) {
                throw new Error('记录不存在');
            }
            
            // 删除行（rowIndex 是从 1 开始的，因为 0 是表头）
            sheet.content.splice(rowIndex, 1);
            
            // 保存到后端
            await deps.saveData(allData);
            
            deps.logger.info(`[TableManager] Deleted record from ${tableKey} at row ${rowIndex}`);
            
            // 从 DOM 移除卡片（带动画）
            $card.css({
                'transform': 'scale(0.9)',
                'opacity': '0',
                'transition': 'all 0.3s'
            });
            
            setTimeout(() => {
                $card.remove();
                // 更新搜索计数
                const remaining = $('#dnd-tm-cards-container .dnd-tm-card').length;
                const allData2 = deps.dataManager.getAllData();
                const sheet2 = allData2[tableKey];
                const total = sheet2 && sheet2.content ? sheet2.content.length - 1 : 0;
                this.updateSearchCount(remaining, total);
                
                // 如果没有卡片了，显示空状态
                if (remaining === 0) {
                    $('#dnd-tm-cards-container').html(`
                        <div class="dnd-tm-empty-state">
                            <i class="fa-solid fa-inbox"></i>
                            没有记录
                        </div>
                    `);
                }
            }, 300);
            
        } catch (err) {
            console.error('[TableManager] Delete failed:', err);
            // 可以添加错误提示
        }
    },
    
    // 显示确认对话框
  };
}
