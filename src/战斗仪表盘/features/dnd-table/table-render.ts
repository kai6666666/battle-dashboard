// features/dnd-table/table-render.ts
// 表格渲染（主渲染/卡片渲染）（b10c · 自 BasedonST `src/ui/modules/UITableManager.js` 拆分移植）
// 边界：与骰子侧表格编辑器（B）的关系待 b12 按决策 §6.2-7 收口（本模块届时降级为只读/跳转）。
import { DND_CONFIG } from '../dnd-core';

export function createTableRenderFragment(deps: any): any {
  return {
    async render($container) {
        const { $ } = deps.utils.getCore();
        $container.empty();
        
        // 确保初始化
        this.init();
        
        // 等待配置加载完成（包括 hiddenTables）
        await this.loadConfig();

        // 1. 获取所有表格数据
        const allData = deps.dataManager.getAllData();
        if (!allData) {
            $container.html('<div style="color:#aaa;padding:10px;">无法加载数据</div>');
            return;
        }

        // 过滤出有效的表格，并排除被隐藏的
        const tables = Object.keys(allData).filter(k => {
            if (this.state.hiddenTables && this.state.hiddenTables.includes(k)) return false;
            return k.startsWith('sheet_') || (allData[k].name && allData[k].mate);
        });
        
        if (tables.length === 0) {
            $container.html('<div style="color:#aaa;padding:10px;">没有可见的表格 (请在设置中检查隐藏列表)</div>');
            return;
        }

        // 2. 构建主布局
        const layoutBtnIcon = this.state.fieldLayout === 'double' ? 'fa-table-list' : 'fa-table-columns';
        const layoutBtnActive = this.state.fieldLayout === 'double' ? 'active' : '';
        
        const $layout = $(`
            <div class="dnd-table-manager" style="padding:12px;background:linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%);max-height:450px;display:flex;flex-direction:column;border-radius:8px;">
                <!-- 顶部选择栏 (按钮组) -->
                <div style="margin-bottom:12px;display:flex;gap:6px;align-items:flex-start;">
                    <div id="dnd-tm-table-buttons" style="flex:1;display:flex;flex-wrap:wrap;gap:6px;max-height:100px;overflow-y:auto;padding:2px;">
                        ${tables.map(k => {
                            const name = allData[k].name || k;
                            const isSelected = this.state.currentTableKey === k;
                            const activeClass = isSelected ? 'active' : '';
                            return `<button class="dnd-tm-table-btn ${activeClass}" data-key="${k}" title="${name}">${name}</button>`;
                        }).join('')}
                    </div>
                </div>
                
                <!-- 工具栏：搜索 + 操作按钮 -->
                <div class="dnd-tm-toolbar" id="dnd-tm-toolbar">
                    <div class="dnd-tm-search-wrapper">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" class="dnd-tm-search-input" id="dnd-tm-search" placeholder="搜索记录...">
                        <button class="dnd-tm-search-clear" id="dnd-tm-search-clear">×</button>
                    </div>
                    <span class="dnd-tm-search-count" id="dnd-tm-search-count"></span>
                    <div class="dnd-tm-toolbar-actions">
                        <button class="dnd-tm-layout-btn ${layoutBtnActive}" id="dnd-tm-layout-toggle" title="切换字段布局 (单列/双列)">
                            <i class="fa-solid ${layoutBtnIcon}"></i>
                        </button>
                        <button class="dnd-tm-add-btn" id="dnd-tm-add-record" title="新增记录" disabled>
                            <i class="fa-solid fa-plus"></i> 新增
                        </button>
                    </div>
                </div>
                
                <!-- 卡片容器 -->
                <div id="dnd-tm-cards-container" class="dnd-tm-cards-container">
                    <div class="dnd-tm-empty-state">
                        <i class="fa-solid fa-table"></i>
                        请选择一个表格查看记录
                    </div>
                </div>
            </div>
        `);

        $container.append($layout);

        // 绑定事件
        const self = this;
        
        // 绑定表格按钮点击 - 使用 CSS 类切换
        $layout.find('.dnd-tm-table-btn').on('click', function() {
            const key = $(this).data('key');
            const $this = $(this);
            
            // 添加点击波纹效果
            $this.addClass('clicking');
            setTimeout(() => $this.removeClass('clicking'), 200);
            
            // [修改] 如果点击已选中的表格，则关闭
            if (self.state.currentTableKey === key) {
                self.state.currentTableKey = null;
                $this.removeClass('active');
                // 清空搜索状态
                self.clearSearch();
                // 禁用新增按钮
                $('#dnd-tm-add-record').prop('disabled', true);
                $('#dnd-tm-cards-container').empty().html(`
                    <div class="dnd-tm-empty-state">
                        <i class="fa-solid fa-table"></i>
                        请选择一个表格查看记录
                    </div>
                `);
                return;
            }
            
            // 切换选中
            self.state.currentTableKey = key;
            
            // 清空搜索状态
            self.clearSearch();
            
            // 更新按钮状态 - 使用 CSS 类
            $layout.find('.dnd-tm-table-btn').removeClass('active');
            $this.addClass('active');
            
            // 启用新增按钮
            $('#dnd-tm-add-record').prop('disabled', false);
            
            self.renderCards($('#dnd-tm-cards-container'), key);
        });
        
        // 绑定搜索输入事件 (防抖)
        $layout.find('#dnd-tm-search').on('input', function() {
            const keyword = $(this).val();
            self.state.searchKeyword = keyword;
            
            // 显示/隐藏清除按钮
            $('#dnd-tm-search-clear').toggleClass('visible', keyword.length > 0);
            
            // 防抖搜索
            if (self.state.searchDebounceTimer) {
                clearTimeout(self.state.searchDebounceTimer);
            }
            self.state.searchDebounceTimer = setTimeout(() => {
                self.performSearch(keyword);
            }, 200);
        });
        
        // 绑定清除搜索按钮
        $layout.find('#dnd-tm-search-clear').on('click', function() {
            self.clearSearch();
            if (self.state.currentTableKey) {
                self.renderCards($('#dnd-tm-cards-container'), self.state.currentTableKey);
            }
        });
        
        // 绑定布局切换按钮
        $layout.find('#dnd-tm-layout-toggle').on('click', function() {
            self.toggleFieldLayout();
        });
        
        // 绑定新增记录按钮
        $layout.find('#dnd-tm-add-record').on('click', function() {
            if (self.state.currentTableKey) {
                self.addRecord(self.state.currentTableKey);
            }
        });
        
        // 初始化布局 (如果有缓存)
        this.updateButtonLayout();

        // 如果已有选中表格，自动渲染
        if (this.state.currentTableKey) {
            $('#dnd-tm-add-record').prop('disabled', false);
            this.renderCards($('#dnd-tm-cards-container'), this.state.currentTableKey);
        }
    },

    // 渲染卡片
    renderCards($container, tableKey) {
        const { $ } = deps.utils.getCore();
        $container.empty();

        if (!tableKey) return;

        const allData = deps.dataManager.getAllData();
        const sheet = allData[tableKey];
        if (!sheet || !sheet.content || sheet.content.length < 2) {
            $container.html(`
                <div class="dnd-tm-empty-state">
                    <i class="fa-solid fa-file-excel"></i>
                    表格为空或格式无效
                </div>
            `);
            this.updateSearchCount(0, 0);
            return;
        }

        const headers = sheet.content[0];
        const rows = sheet.content.slice(1);

        if (rows.length === 0) {
            $container.html(`
                <div class="dnd-tm-empty-state">
                    <i class="fa-solid fa-inbox"></i>
                    没有记录
                </div>
            `);
            this.updateSearchCount(0, 0);
            return;
        }

        // 获取过滤后的行索引
        const filteredIndices = this.state.filteredRowIndices;
        const layoutClass = this.state.fieldLayout === 'double' ? 'layout-double' : 'layout-single';
        
        let visibleCount = 0;
        // [修复] 计算总数时包含空行，与渲染逻辑保持一致
        const totalCount = rows.length;

        // 渲染每一行记录为卡片
        rows.forEach((row, rowIndex) => {
            // [修复] 不再跳过空行，让用户能看到新增的空记录并填写内容
            // if (row.every(cell => cell === null || cell === '')) return;
            
            // 如果有搜索过滤，检查是否在过滤结果中
            if (filteredIndices !== null && !filteredIndices.includes(rowIndex)) {
                return;
            }
            
            visibleCount++;

            const cardId = `tm-card-${tableKey}-${rowIndex}`;
            
            // [智能标题] 尝试寻找有意义的标题列
            let title = '未命名记录';
            const titleKeys = ['姓名', '名称', 'name', 'title', 'CHAR_ID', 'ID', 'PC_ID', '物品名称', '技能名称', '任务名称'];
            
            // 1. 优先匹配特定列名
            for (const key of titleKeys) {
                const idx = headers.findIndex(h => h && h.includes && h.includes(key));
                if (idx !== -1 && row[idx]) {
                    title = row[idx];
                    break;
                }
            }
            
            // 2. 如果没找到，使用第一个非空且Header有效的值
            if (title === '未命名记录') {
                for (let i = 0; i < headers.length; i++) {
                    if (headers[i] && headers[i] !== 'null' && row[i]) {
                        title = row[i];
                        break;
                    }
                }
            }

            // 使用 CSS 类构建卡片，添加动画延迟
            const animationDelay = visibleCount * 0.05; // 错开动画
            let cardHtml = `
                <div class="dnd-tm-card" data-row-index="${rowIndex + 1}" style="animation-delay: ${animationDelay}s;">
            `;

            // 标题栏 - 添加删除按钮
            cardHtml += `
                <div class="dnd-tm-card-header">
                    <span class="dnd-tm-card-title" title="${title}">${title}</span>
                    <div class="dnd-tm-card-actions">
                        <button class="dnd-tm-delete-btn" data-row="${rowIndex + 1}" title="删除记录">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        <button class="dnd-tm-save-btn" data-row="${rowIndex + 1}">
                            <i class="fa-solid fa-save"></i> 保存
                        </button>
                    </div>
                </div>
            `;

            // 字段列表 - 应用布局类
            cardHtml += `<div class="dnd-tm-fields ${layoutClass}">`;
            
            let fieldIndex = 0;
            
            headers.forEach((h, colIndex) => {
                // [优化] 跳过无效表头 (null 或 'null' 或 空字符串)
                if (!h || h === 'null' || h.trim() === '') return;

                const val = row[colIndex] !== undefined && row[colIndex] !== null ? row[colIndex] : '';
                const fieldDelay = fieldIndex * 0.03; // 字段错开动画
                fieldIndex++;
                
                cardHtml += `
                    <div class="dnd-tm-field-item" style="animation-delay: ${animationDelay + fieldDelay}s;">
                        <div class="dnd-tm-field-label">${h}</div>
                        <input type="text" class="dnd-tm-input" data-col="${colIndex}" value="${String(val).replace(/"/g, '&quot;')}" />
                    </div>
                `;
            });

            cardHtml += `</div></div>`; // End fields & card
            
            $container.append(cardHtml);
        });

        // 更新搜索计数
        this.updateSearchCount(visibleCount, totalCount);
        
        // 如果搜索无结果，显示提示
        if (visibleCount === 0 && filteredIndices !== null) {
            $container.html(`
                <div class="dnd-tm-empty-state">
                    <i class="fa-solid fa-search"></i>
                    没有找到匹配的记录
                </div>
            `);
        }

        // 绑定卡片内事件
        const self = this;
        
        // 保存按钮
        $container.find('.dnd-tm-save-btn').on('click', function() {
            const $btn = $(this);
            const rowIndex = parseInt($btn.data('row'));
            const $card = $btn.closest('.dnd-tm-card');
            
            // 点击动画
            $card.css('transform', 'scale(0.98)');
            setTimeout(() => $card.css('transform', ''), 150);
            
            // 收集数据
            const newData = {};
            $card.find('.dnd-tm-input').each(function() {
                const colIdx = parseInt($(this).data('col'));
                const val = $(this).val();
                newData[colIdx] = val; // 这里我们直接用列索引存储，方便更新
            });

            self.saveRecord(tableKey, rowIndex, newData, $btn);
        });
        
        // 删除按钮
        $container.find('.dnd-tm-delete-btn').on('click', function() {
            const $btn = $(this);
            const rowIndex = parseInt($btn.data('row'));
            const $card = $btn.closest('.dnd-tm-card');
            
            self.deleteRecord(tableKey, rowIndex, $card);
        });
    },

    // 保存单条记录
  };
}
