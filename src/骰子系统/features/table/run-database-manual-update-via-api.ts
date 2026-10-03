/**
 * run-database-manual-update-via-api.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 *
 * x9h⑤：AutoCardUpdaterV2API 仅提供 open / openVisualizer / refreshVisualizer，
 * manualUpdate 只在旧版 AutoCardUpdaterAPI 面上提供；本模块只探测旧版 API。
 */
type DatabaseManualUpdateResult = Record<string, any>;
export function createRunDatabaseManualUpdateViaApi(deps: any) {
  const runDatabaseManualUpdateViaApi = async (options?: {
    includeLegacyApi?: boolean;
  }): Promise<DatabaseManualUpdateResult> => {
    const includeLegacyApi = options?.includeLegacyApi !== false;
    if (!includeLegacyApi) {
      // 旧版 API 通道被显式跳过：不再探测 V2 面（该面没有 manualUpdate 方法）。
      return { status: 'unavailable', source: 'manualUpdate API（旧版通道已跳过）' };
    }
    let failedResult: DatabaseManualUpdateResult | null = null;
    for (const targetWindow of deps.collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterAPI;
      if (!api || typeof api !== 'object') continue;
      for (const methodName of deps.ACU_DATABASE_MANUAL_UPDATE_API_METHODS) {
        const method = api[methodName];
        if (typeof method !== 'function') continue;
        const result = await deps.runMaybeAsyncDatabaseManualUpdate(
          () => method.call(api),
          `旧版数据库 manualUpdate API.${methodName}`,
        );
        if (result.status === 'updated') return result;
        failedResult = result;
      }
    }
    return failedResult || { status: 'unavailable' };
  };
  return runDatabaseManualUpdateViaApi;
}
