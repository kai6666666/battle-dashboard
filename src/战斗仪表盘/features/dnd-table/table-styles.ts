// features/dnd-table/table-styles.ts
// 表格管理器样式（b10c · 自 BasedonST `src/ui/modules/UITableManager.js` 独立提取）
export const TABLE_MANAGER_STYLES = `
<style id="dnd-table-manager-styles">
    /* 表格按钮样式 */
    .dnd-tm-table-btn {
        padding: 6px 12px;
        border: 1px solid #444;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: linear-gradient(135deg, #2a2a2c 0%, #1f1f21 100%);
        color: #ccc;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
        position: relative;
        overflow: hidden;
    }
    
    .dnd-tm-table-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        transition: left 0.4s ease;
    }
    
    .dnd-tm-table-btn:hover {
        background: linear-gradient(135deg, #3a3a3c 0%, #2a2a2c 100%);
        border-color: var(--dnd-border-gold);
        color: #fff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 0 20px rgba(var(--dnd-gold-rgb, 212,175,55), 0.15);
    }
    
    .dnd-tm-table-btn:hover::before {
        left: 100%;
    }
    
    .dnd-tm-table-btn:active {
        transform: translateY(0) scale(0.98);
        transition-duration: 0.1s;
    }
    
    .dnd-tm-table-btn.active {
        background: linear-gradient(135deg, var(--dnd-border-gold) 0%, #a08030 100%);
        color: #000;
        border-color: var(--dnd-border-gold);
        box-shadow: 0 0 15px rgba(var(--dnd-gold-rgb, 212,175,55), 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
        font-weight: 600;
    }
    
    .dnd-tm-table-btn.active:hover {
        background: linear-gradient(135deg, #e0c060 0%, var(--dnd-border-gold) 100%);
    }
    
    /* 卡片容器动画 */
    .dnd-tm-cards-container {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-content: flex-start;
        justify-content: center;
        min-height: 100px;
        padding: 5px;
    }
    
    /* 卡片样式 */
    .dnd-tm-card {
        width: 100%;
        max-width: 320px;
        flex: 1 1 280px;
        background: linear-gradient(145deg, #2a2a2c 0%, #1a1a1c 50%, #151517 100%);
        border: 1px solid rgba(100,100,100,0.3);
        border-radius: 10px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        margin: 2px;
        position: relative;
        overflow: hidden;
        animation: cardSlideIn 0.3s ease-out forwards;
        opacity: 0;
        transform: translateY(10px);
    }
    
    @keyframes cardSlideIn {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .dnd-tm-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--dnd-border-gold), transparent);
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .dnd-tm-card:hover {
        border-color: var(--dnd-border-gold);
        transform: translateY(-4px) scale(1.01);
        box-shadow: 0 8px 30px rgba(0,0,0,0.6), 0 0 25px rgba(var(--dnd-gold-rgb, 212,175,55), 0.1);
    }
    
    .dnd-tm-card:hover::before {
        opacity: 1;
    }
    
    /* 卡片标题 */
    .dnd-tm-card-header {
        font-weight: bold;
        color: var(--dnd-text-highlight);
        border-bottom: 1px solid rgba(100,100,100,0.3);
        padding-bottom: 8px;
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .dnd-tm-card-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 70%;
        font-size: 14px;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }
    
    /* 保存按钮 */
    .dnd-tm-save-btn {
        background: linear-gradient(135deg, var(--dnd-accent-green, #4CAF50) 0%, #388E3C 100%);
        color: #fff;
        border: none;
        border-radius: 5px;
        padding: 4px 10px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .dnd-tm-save-btn:hover {
        background: linear-gradient(135deg, #5CBF60 0%, #4CAF50 100%);
        transform: scale(1.05);
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
    }
    
    .dnd-tm-save-btn:active {
        transform: scale(0.95);
    }
    
    .dnd-tm-save-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
    
    /* 字段容器 */
    .dnd-tm-fields {
        max-height: 220px;
        overflow-y: auto;
        padding-right: 5px;
    }
    
    .dnd-tm-fields::-webkit-scrollbar {
        width: 4px;
    }
    
    .dnd-tm-fields::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.2);
        border-radius: 2px;
    }
    
    .dnd-tm-fields::-webkit-scrollbar-thumb {
        background: rgba(var(--dnd-gold-rgb, 212,175,55), 0.3);
        border-radius: 2px;
    }
    
    /* 字段项 */
    .dnd-tm-field-item {
        margin-bottom: 10px;
        animation: fieldFadeIn 0.2s ease-out forwards;
        opacity: 0;
    }
    
    @keyframes fieldFadeIn {
        to { opacity: 1; }
    }
    
    .dnd-tm-field-label {
        font-size: 11px;
        color: #888;
        margin-bottom: 3px;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .dnd-tm-field-label::before {
        content: '';
        width: 3px;
        height: 10px;
        background: var(--dnd-border-gold);
        border-radius: 1px;
        opacity: 0.6;
    }
    
    /* 输入框 */
    .dnd-tm-input {
        width: 100%;
        background: rgba(0,0,0,0.3);
        border: 1px solid #444;
        border-bottom: 2px solid #555;
        color: var(--dnd-text-main);
        font-size: 13px;
        padding: 6px 8px;
        border-radius: 5px;
        transition: all 0.25s;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
    }
    
    .dnd-tm-input:hover {
        border-color: #666;
        background: rgba(0,0,0,0.35);
    }
    
    .dnd-tm-input:focus {
        outline: none;
        border-color: var(--dnd-text-highlight);
        border-bottom-color: var(--dnd-text-highlight);
        background: rgba(0,0,0,0.4);
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.2), 0 0 10px rgba(var(--dnd-gold-rgb, 212,175,55), 0.1);
    }
    
    /* 空状态提示 */
    .dnd-tm-empty-state {
        color: #666;
        width: 100%;
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
    }
    
    .dnd-tm-empty-state i {
        display: block;
        font-size: 32px;
        margin-bottom: 10px;
        opacity: 0.5;
    }
    
    /* ========== 搜索栏样式 ========== */
    .dnd-tm-toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.25) 100%);
        border-radius: 8px;
        margin-bottom: 12px;
        border: 1px solid rgba(100,100,100,0.2);
    }
    
    .dnd-tm-search-wrapper {
        flex: 1;
        min-width: 150px;
        max-width: 280px;
        display: flex;
        align-items: center;
        background: rgba(0,0,0,0.4);
        border: 1px solid #3a3a3c;
        border-radius: 6px;
        padding: 7px 12px;
        transition: all 0.25s;
    }
    
    .dnd-tm-search-wrapper:focus-within {
        border-color: var(--dnd-border-gold);
        background: rgba(0,0,0,0.5);
        box-shadow: 0 0 10px rgba(var(--dnd-gold-rgb, 212,175,55), 0.2);
    }
    
    .dnd-tm-search-wrapper i {
        color: #777;
        margin-right: 8px;
        font-size: 13px;
    }
    
    .dnd-tm-search-input {
        flex: 1;
        background: transparent !important;
        border: none !important;
        color: var(--dnd-text-main, #ccc) !important;
        outline: none !important;
        font-size: 13px;
        box-shadow: none !important;
    }
    
    .dnd-tm-search-input::placeholder {
        color: #666;
    }
    
    .dnd-tm-search-clear {
        background: transparent;
        border: none;
        color: #666;
        cursor: pointer;
        font-size: 16px;
        padding: 2px 6px;
        transition: all 0.2s;
        display: none;
        border-radius: 3px;
    }
    
    .dnd-tm-search-clear:hover {
        color: #e74c3c;
        background: rgba(231, 76, 60, 0.15);
    }
    
    .dnd-tm-search-clear.visible {
        display: block;
    }
    
    .dnd-tm-search-count {
        color: #888;
        font-size: 11px;
        white-space: nowrap;
        padding: 4px 8px;
        background: rgba(0,0,0,0.2);
        border-radius: 4px;
    }
    
    .dnd-tm-toolbar-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: auto;
    }
    
    /* ========== 布局切换按钮 ========== */
    .dnd-tm-layout-btn {
        background: linear-gradient(135deg, #2a2a2c 0%, #1f1f21 100%);
        border: 1px solid #3a3a3c;
        color: #999;
        padding: 7px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.25s;
        font-size: 13px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .dnd-tm-layout-btn:hover {
        border-color: var(--dnd-border-gold);
        color: var(--dnd-text-highlight);
        transform: translateY(-1px);
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
    }
    
    .dnd-tm-layout-btn.active {
        background: linear-gradient(135deg, rgba(var(--dnd-gold-rgb, 212,175,55), 0.25) 0%, rgba(var(--dnd-gold-rgb, 212,175,55), 0.15) 100%);
        border-color: var(--dnd-border-gold);
        color: var(--dnd-text-highlight);
    }
    
    /* ========== 新增按钮 ========== */
    .dnd-tm-add-btn {
        background: linear-gradient(135deg, var(--dnd-accent-green, #4CAF50) 0%, #388E3C 100%);
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 7px 14px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.25s;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        white-space: nowrap;
    }
    
    .dnd-tm-add-btn:hover {
        background: linear-gradient(135deg, #5CBF60 0%, var(--dnd-accent-green, #4CAF50) 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }
    
    .dnd-tm-add-btn:active {
        transform: translateY(0) scale(0.98);
    }
    
    .dnd-tm-add-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        background: #444;
    }
    
    /* ========== 删除按钮 ========== */
    .dnd-tm-delete-btn {
        background: transparent;
        color: #888;
        border: none;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
        border-radius: 4px;
    }
    
    .dnd-tm-delete-btn:hover {
        background: rgba(231, 76, 60, 0.2);
        color: #e74c3c;
    }
    
    .dnd-tm-card-actions {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    /* ========== 确认对话框 ========== */
    .dnd-tm-dialog-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(0,0,0,0.7) !important;
        z-index: 2147483650 !important;
        animation: dialogFadeIn 0.2s ease-out;
    }
    
    @keyframes dialogFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .dnd-tm-dialog {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        background: linear-gradient(145deg, #2a2a2c 0%, #1a1a1c 100%);
        border: 1px solid #444;
        border-radius: 10px;
        padding: 20px;
        min-width: 280px;
        max-width: 90vw;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        z-index: 2147483651 !important;
        animation: dialogSlideIn 0.2s ease-out;
    }
    
    @keyframes dialogSlideIn {
        from { transform: translate(-50%, -50%) translateY(-20px); opacity: 0; }
        to { transform: translate(-50%, -50%) translateY(0); opacity: 1; }
    }
    
    .dnd-tm-dialog-title {
        font-size: 16px;
        font-weight: bold;
        color: var(--dnd-text-highlight);
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .dnd-tm-dialog-message {
        color: #ccc;
        font-size: 14px;
        margin-bottom: 20px;
        line-height: 1.5;
    }
    
    .dnd-tm-dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
    
    .dnd-tm-dialog-btn {
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
    }
    
    .dnd-tm-dialog-btn.cancel {
        background: #333;
        border: 1px solid #555;
        color: #ccc;
    }
    
    .dnd-tm-dialog-btn.cancel:hover {
        background: #444;
        border-color: #666;
    }
    
    .dnd-tm-dialog-btn.confirm {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        border: none;
        color: #fff;
    }
    
    .dnd-tm-dialog-btn.confirm:hover {
        background: linear-gradient(135deg, #ec7063 0%, #e74c3c 100%);
    }
    
    /* ========== 字段布局模式 ========== */
    .dnd-tm-fields.layout-single .dnd-tm-field-item {
        width: 100%;
    }
    
    .dnd-tm-fields.layout-double {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .dnd-tm-fields.layout-double .dnd-tm-field-item {
        flex: 1 1 calc(50% - 4px);
        min-width: 100px;
        margin-bottom: 0;
    }
    
    /* ========== 搜索高亮 ========== */
    .dnd-tm-highlight {
        background: rgba(var(--dnd-gold-rgb, 212,175,55), 0.3);
        border-radius: 2px;
        padding: 0 2px;
    }
</style>
`;
