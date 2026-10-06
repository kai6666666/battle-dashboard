// features/dnd-ui/index.ts
// dnd-ui 域装配（b3）：UIRenderer 聚合器 + UIUtils（通知系统 / 核心工具 / 特效）。
// 约定：工厂 + DI；外部（app/init.ts）只从这里取实例。
import { createDndNotificationSystem } from './ui-utils-notification';
import { createDndUiUtilsCore } from './ui-utils-core';
import { createDndUiRenderer } from './ui-renderer';
import { ICONS, getWeatherIcon } from './svg-icons';

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
    dynamicBackground: deps.theme?.dynamicBackground,
  });

  const init = (): void => {
    // 全局暴露（兼容生成 HTML 中的 onclick 调用：window.DND_Dashboard_UI.xxx）
    try {
      (window as any).DND_Dashboard_UI = uiRenderer;
      // [b12.6] 同步到宿主顶层窗口（getCore 的 DOM 位于 top；兼容 top document 中的 inline onclick）
      try {
        const coreWin: any = core?.utils?.getCore?.()?.window;
        if (coreWin && coreWin !== (window as any) && !coreWin.DND_Dashboard_UI) {
          coreWin.DND_Dashboard_UI = (window as any).DND_Dashboard_UI;
        }
      } catch (e) {}
      // [b11d] 图标接真：ICONS 注册全局（各域 iconProxy 运行时读取；getWeatherIcon 同步暴露）
      try {
        const g: any = (window as any).DND_Dashboard_UI;
        if (g) { g.ICONS = ICONS; g.getWeatherIcon = getWeatherIcon; }
      } catch (e) {}

      // [b12.8] 骰子弹窗层级守护：确保骰子 overlay 弹窗始终盖过 DND HUD
      // （Mini HUD=2147483640 / 角色卡=2147483643 / 详情弹窗=2147483645 → 骰子弹窗提升至 2147483647）
      try {
        const _zKey = '__dndAcuZGuard';
        const _topWin: any = (() => { try { return core?.utils?.getCore?.()?.window || (window as any); } catch (e) { return window as any; } })();
        if (_topWin && !_topWin[_zKey]) {
          _topWin[_zKey] = true;
          const _Z = '2147483647';
          const _isAcuOverlay = (cls: string) => /(^|\s)acu-[a-z0-9-]*-overlay(\s|$)/.test(cls);
          const _mark = (el: any) => {
            try {
              if (!el || el.nodeType !== 1) return;
              if (_isAcuOverlay(String(el.className || ''))) el.style.setProperty('z-index', _Z, 'important');
              const subs = el.querySelectorAll ? el.querySelectorAll('[class*="acu-"][class*="-overlay"]') : [];
              for (let i = 0; i < subs.length; i++) {
                const k: any = subs[i];
                if (_isAcuOverlay(String(k.className || ''))) k.style.setProperty('z-index', _Z, 'important');
              }
            } catch (e) {}
          };
          const _doc: any = _topWin.document || document;
          try { _doc.querySelectorAll('[class*="acu-"][class*="-overlay"]').forEach((el: any) => _mark(el)); } catch (e) {}
          const _obs = new MutationObserver((muts: any[]) => {
            for (const m of muts) {
              const added = m.addedNodes;
              if (!added) continue;
              for (let i = 0; i < added.length; i++) {
                const n: any = added[i];
                if (n && n.nodeType === 1) _mark(n);
              }
            }
          });
          const _startZ = () => { try { _obs.observe(_doc.documentElement || _doc.body, { childList: true, subtree: true }); } catch (e) {} };
          if (_doc.readyState === 'loading') _doc.addEventListener('DOMContentLoaded', _startZ); else _startZ();
        }
      } catch (e) {}

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