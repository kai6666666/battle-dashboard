// features/dnd-hud/update-controller.ts
// 防回弹控制器（自 BasedonST `src/features/UpdateController.js` 移植，b4）
// 职责：静默执行（抑制回弹信号）+ 数据库更新事件回调（重渲染面板 / HUD）。
// [D2 决策] 骰子池已移除：checkAndRefill 调用改为可选（diceManager 注入时才执行）。
export function createUpdateController(deps: any): any {
  const UpdateController: any = {
    _suppressNext: false,

    // 执行静默保存（期间拦截回弹信号）
    runSilently: async (action: () => Promise<void> | void) => {
      UpdateController._suppressNext = true;
      try {
        await action();
      } finally {
        // 2 秒后恢复监听，给数据库一点写入时间
        setTimeout(() => {
          UpdateController._suppressNext = false;
          deps.logger?.info?.('[dnd-hud] 恢复数据库监听');
        }, 2000);
      }
    },

    // 数据库更新事件回调
    handleUpdate: () => {
      if (UpdateController._suppressNext) {
        deps.logger?.info?.('[dnd-hud] 拦截了回弹信号');
        return;
      }
      // 渲染全屏面板（如果可见）
      const { $ } = deps.utils.getCore();
      if ($('#dnd-dashboard-root').hasClass('visible')) {
        const $activeItem = $('.dnd-nav-item.active');
        const ui = deps.uiRenderer;
        if ($activeItem.length && ui && typeof ui.renderPanel === 'function') {
          ui.renderPanel($activeItem.data('target'));
        }
      }
      // 始终渲染/更新简略 HUD
      if (deps.uiRenderer && typeof deps.uiRenderer.renderHUD === 'function') {
        deps.uiRenderer.renderHUD();
      }
      // [D2 决策] 骰子池移除——保留可选调用（b9 起由 AcuDice 接管投骰）
      if (deps.diceManager && typeof deps.diceManager.checkAndRefill === 'function') {
        deps.diceManager.checkAndRefill();
      }
    },
  };
  return UpdateController;
}