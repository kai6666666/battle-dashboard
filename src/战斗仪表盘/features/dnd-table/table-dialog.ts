// features/dnd-table/table-dialog.ts
// 对话框 / 布局切换（b10c · 自 BasedonST `src/ui/modules/UITableManager.js` 拆分移植）
// 边界：与骰子侧表格编辑器（B）的关系待 b12 按决策 §6.2-7 收口（本模块届时降级为只读/跳转）。
import { DND_CONFIG } from '../dnd-core';

export function createTableDialogFragment(deps: any): any {
  return {
    showConfirmDialog(title, message) {
        const { $ } = deps.utils.getCore();
        
        return new Promise(resolve => {
            // 尝试从多个来源获取视口尺寸
            const w = window.parent || window;
            let viewportWidth = w.innerWidth || w.document?.documentElement?.clientWidth || document.documentElement.clientWidth || screen.width;
            let viewportHeight = w.innerHeight || w.document?.documentElement?.clientHeight || document.documentElement.clientHeight || screen.height;
            
            // 如果还是 0，尝试从 top window 获取
            if (!viewportWidth || !viewportHeight) {
                try {
                    const topWin = window.top;
                    viewportWidth = topWin.innerWidth || 800;
                    viewportHeight = topWin.innerHeight || 600;
                } catch (e) {
                    viewportWidth = 800;
                    viewportHeight = 600;
                }
            }
            
            // 计算屏幕中心的绝对像素位置
            const centerY = Math.round(viewportHeight / 2);
            const centerX = Math.round(viewportWidth / 2);
            
            // 使用绝对像素定位
            const dialogHtml = `
                <div id="dnd-tm-confirm-dialog" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:2147483650;"></div>
                <div id="dnd-tm-confirm-dialog-box" style="position:fixed;top:${centerY}px;left:${centerX}px;transform:translate(-50%,-50%);background:linear-gradient(145deg,#2a2a2c 0%,#1a1a1c 100%);border:1px solid #444;border-radius:10px;padding:20px;min-width:280px;max-width:90vw;box-shadow:0 10px 40px rgba(0,0,0,0.5);z-index:2147483651;">
                    <div class="dnd-tm-dialog-title">
                        <i class="fa-solid fa-triangle-exclamation" style="color:#e74c3c;"></i>
                        ${title}
                    </div>
                    <div class="dnd-tm-dialog-message">${message}</div>
                    <div class="dnd-tm-dialog-actions">
                        <button class="dnd-tm-dialog-btn cancel">取消</button>
                        <button class="dnd-tm-dialog-btn confirm">确认删除</button>
                    </div>
                </div>
            `;
            
            $('body').append(dialogHtml);
            
            const cleanup = () => {
                $('#dnd-tm-confirm-dialog').remove();
                $('#dnd-tm-confirm-dialog-box').remove();
            };
            
            $('#dnd-tm-confirm-dialog-box .cancel').on('click', () => {
                cleanup();
                resolve(false);
            });
            
            $('#dnd-tm-confirm-dialog-box .confirm').on('click', () => {
                cleanup();
                resolve(true);
            });
            
            // 点击遮罩关闭
            $('#dnd-tm-confirm-dialog').on('click', function() {
                cleanup();
                resolve(false);
            });
        });
    },

    // ========== 布局切换 ==========
    
    // 切换字段布局
    toggleFieldLayout() {
        const { $ } = deps.utils.getCore();
        
        // 切换状态
        this.state.fieldLayout = this.state.fieldLayout === 'single' ? 'double' : 'single';
        
        // 更新所有字段容器的类
        const layoutClass = this.state.fieldLayout === 'double' ? 'layout-double' : 'layout-single';
        $('.dnd-tm-fields').removeClass('layout-single layout-double').addClass(layoutClass);
        
        // 更新按钮图标和状态
        const $btn = $('#dnd-tm-layout-toggle');
        const icon = this.state.fieldLayout === 'double' ? 'fa-table-list' : 'fa-table-columns';
        $btn.find('i').removeClass().addClass(`fa-solid ${icon}`);
        $btn.toggleClass('active', this.state.fieldLayout === 'double');
        
        // 保存用户偏好
        deps.dbAdapter.setSetting('dnd_tm_field_layout', this.state.fieldLayout);
    }
  };
}
