/**
 * open-legacy-database-visualizer.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 *
 * x9h⑤：优先走新版数据库 V2 面（AutoCardUpdaterV2API.openVisualizer），
 * 再回退旧版 AutoCardUpdaterAPI.openVisualizer 与历史全局函数。
 */
export function createOpenLegacyDatabaseVisualizer(deps: any) {
  const openLegacyDatabaseVisualizer = async (): Promise<boolean> => {
    for (const targetWindow of deps.collectAccessibleRuntimeWindows()) {
      const v2Api = (targetWindow as any).AutoCardUpdaterV2API;
      if (v2Api && typeof v2Api.openVisualizer === 'function') {
        const opened = await deps.runMaybeAsyncDatabaseUiOpener(
          () => v2Api.openVisualizer.call(v2Api),
          '新版数据库可视化表格编辑器',
        );
        if (opened) return true;
      }
      const api = (targetWindow as any).AutoCardUpdaterAPI;
      if (api && typeof api.openVisualizer === 'function') {
        const opened = await deps.runMaybeAsyncDatabaseUiOpener(
          () => api.openVisualizer.call(api),
          '旧版可视化表格编辑器',
        );
        if (opened) return true;
      }
      const legacyGlobal = (targetWindow as any).openNewVisualizer_ACU;
      if (typeof legacyGlobal === 'function') {
        const opened = await deps.runMaybeAsyncDatabaseUiOpener(
          () => legacyGlobal.call(targetWindow),
          '旧版可视化表格编辑器',
        );
        if (opened) return true;
      }
    }
    return false;
  };
  return openLegacyDatabaseVisualizer;
}
