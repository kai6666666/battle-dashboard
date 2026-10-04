/**
 * run-database-manual-update.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 *
 * x9h⑤：manualUpdate 仅存在于旧版 AutoCardUpdaterAPI 面；优先点击新版填表工作台的
 * 「执行手动填表」按钮（V2 UI 通道），再回退旧版 API 与旧版按钮。
 */
type DatabaseManualUpdateResult = Record<string, any>;
export function createRunDatabaseManualUpdate(deps: any) {
  const runDatabaseManualUpdate = async (): Promise<DatabaseManualUpdateResult> => {
    const newUiButtonResult = await deps.runDatabaseManualUpdateViaNewUiButton();
    if (newUiButtonResult.status !== 'unavailable') return newUiButtonResult;
    const legacyApiResult = await deps.runDatabaseManualUpdateViaApi({ includeLegacyApi: true });
    if (legacyApiResult.status === 'updated') return legacyApiResult;
    const legacyButtonResult = deps.runDatabaseManualUpdateViaLegacyButton();
    if (legacyButtonResult.status === 'updated') return legacyButtonResult;

    if (deps.hasDatabaseNewUiRuntime()) {
      return {
        status: 'failed',
        source: '新版填表工作台',
        error: '已检测到新版数据库 UI，但没有找到可执行的「执行手动填表」按钮。请先打开数据库的「填表工作台」页面并确认已选择表格。',
      };
    }
    return legacyApiResult.status === 'unavailable' ? legacyButtonResult : legacyApiResult;
  };
  return runDatabaseManualUpdate;
}
