/**
 * clear-viewport-input-target-listeners.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearViewportInputTargetListeners(deps: any) {
  const clearViewportInputTargetListeners = () => {
    if (deps.getViewportInputResizeObserver()) {
      deps.getViewportInputResizeObserver().disconnect();
      deps.setViewportInputResizeObserver(null);
    }

    if (deps.getViewportBoundsRefreshHandler()) {
      const eventHandler = deps.getViewportBoundsRefreshHandler() as EventListener;
      deps.getViewportInputObservedElements().forEach((el: any) => {
        deps.VIEWPORT_BOTTOM_REFRESH_EVENTS.forEach((eventName: any) => {
          el.removeEventListener(eventName, eventHandler, true);
        });
      });
    }

    deps.setViewportInputObservedElements([]);
  };
  return clearViewportInputTargetListeners;
}
