// features/dnd-table/table-core.ts
// 表格核心（注入样式/初始化/配置/按钮布局）（b10c · 自 BasedonST `src/ui/modules/UITableManager.js` 拆分移植）
// 边界：与骰子侧表格编辑器（B）的关系待 b12 按决策 §6.2-7 收口（本模块届时降级为只读/跳转）。
import { DND_CONFIG } from '../dnd-core';
import { TABLE_MANAGER_STYLES } from './table-styles';

export function createTableCoreFragment(deps: any): any {
  return {
    state: {
        currentTableKey: null,
        isExpanded: false,
        btnCols: 'auto', // 'auto' | number
        isConfigLoaded: false,
        stylesInjected: false,
        // 新增: 搜索相关状态
        searchKeyword: '',
        filteredRowIndices: null, // null 表示不过滤，数组表示过滤后的索引
        searchDebounceTimer: null,
        // 新增: 布局切换状态
        fieldLayout: 'single' // 'single' | 'double'
    },

    // 注入样式
    injectStyles() {
        const { $ } = deps.utils.getCore();
        if (this.state.stylesInjected) return;
        if ($('#dnd-table-manager-styles').length === 0) {
            $('head').append(TABLE_MANAGER_STYLES);
        }
        this.state.stylesInjected = true;
    },

    // [新增] 初始化监听器
    init() {
        const { $ } = deps.utils.getCore();
        if (this._initialized) return;
        this._initialized = true;
        
        // 注入样式
        this.injectStyles();
        
        // 监听全局设置变更，重置配置加载状态
        $(document).on('dnd:settings-changed', async () => {
            this.state.isConfigLoaded = false;
            // 如果当前可见，立即刷新
            if (this.state.isExpanded && $('#dnd-tm-table-buttons').length) {
                await this.render($('#dnd-table-manager-container'));
            }
        });
    },

    async loadConfig() {
        if (this.state.isConfigLoaded) return;
        const savedCols = await deps.dbAdapter.getSetting('dnd_tm_cols');
        const savedHidden = await deps.dbAdapter.getSetting('dnd_tm_hidden_tables');
        const savedLayout = await deps.dbAdapter.getSetting('dnd_tm_field_layout');
        
        if (savedCols) this.state.btnCols = savedCols === 'auto' ? 'auto' : parseInt(savedCols);
        if (savedHidden) {
            try { this.state.hiddenTables = JSON.parse(savedHidden); } catch(e) { this.state.hiddenTables = []; }
        } else {
            this.state.hiddenTables = [];
        }
        // 加载字段布局偏好
        if (savedLayout && (savedLayout === 'single' || savedLayout === 'double')) {
            this.state.fieldLayout = savedLayout;
        }
        
        this.state.isConfigLoaded = true;
        // 如果已经渲染了按钮，更新布局
        this.updateButtonLayout();
    },

    updateButtonLayout() {
        const { $ } = deps.utils.getCore();
        const $container = $('#dnd-tm-table-buttons');
        if (!$container.length) return;

        const cols = this.state.btnCols;
        if (cols === 'auto') {
            $container.css({
                display: 'flex',
                flexWrap: 'wrap',
                gridTemplateColumns: 'none'
            });
            $container.find('.dnd-tm-table-btn').css({
                flex: '1 1 auto',
                width: 'auto',
                maxWidth: '150px'
            });
        } else {
            const count = parseInt(cols) || 3;
            $container.css({
                display: 'grid',
                gridTemplateColumns: `repeat(${count}, 1fr)`,
                flexWrap: 'nowrap'
            });
            $container.find('.dnd-tm-table-btn').css({
                flex: 'none',
                width: 'auto',
                maxWidth: 'none'
            });
        }
    },

    // 渲染入口
  };
}
