// features/dnd-ui/index.ts
// dnd-ui 域装配（b3）：UIRenderer 聚合器 + UIUtils（通知系统 / 核心工具 / 特效）。
// 约定：工厂 + DI；外部（app/init.ts）只从这里取实例。
import { createDndNotificationSystem } from './ui-utils-notification';
import { createDndUiUtilsCore } from './ui-utils-core';
import { createDndUiRenderer } from './ui-renderer';

export interface DndUiDeps {
  core: any;
  /** 预留：主题实例（b4+ 的 UI 模块可能需要） */
  theme?: any;
  /** 预留：额外模块（后续批次渐进注册进 UIRenderer） */
  extraModules?: Record<string, any>;
}

export interface DndUi {
  uiRenderer: any;
  notification: any;
  uiUtils: any;
  uiEffects: any;
  init(): void;
}

export function createDndUi(deps: DndUiDeps): DndUi {
  const { core } = deps;

  // dnd-core 的 getCore（iframe 兼容）/ dataManager（资源解析）
  const getCore = () => core.utils.getCore();

  const notification = createDndNotificationSystem({ getCore });
  const { uiUtils, uiEffects } = createDndUiUtilsCore({
    getCore,
    dataManager: core.dataManager,
  });

  const uiRenderer = createDndUiRenderer({
    uiUtils,
    notification,
    uiEffects,
    extraModules: deps.extraModules,
  });

  const init = (): void => {
    // 全局暴露（兼容生成 HTML 中的 onclick 调用：window.DND_Dashboard_UI.xxx）
    try {
      (window as any).DND_Dashboard_UI = uiRenderer;
      core.logger.info('[dnd-ui] 渲染工具就绪：UIRenderer → window.DND_Dashboard_UI');
      core.logger.info('[dnd-ui] 验收：NotificationSystem =', typeof notification?.notify, '｜UIEffects =', typeof uiEffects?.addRippleEffect);
    } catch (e) {
      core.logger.warn('[dnd-ui] 全局暴露失败（忽略）：', e);
    }
  };

  return { uiRenderer, notification, uiUtils, uiEffects, init };
}

export { createDndUiRenderer } from './ui-renderer';
export { createDndNotificationSystem } from './ui-utils-notification';
export { createDndUiUtilsCore } from './ui-utils-core';