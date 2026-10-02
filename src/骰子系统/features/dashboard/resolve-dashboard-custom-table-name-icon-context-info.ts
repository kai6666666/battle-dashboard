/**
 * resolve-dashboard-custom-table-name-icon-context-info.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { DashboardCustomTableNameIconContextInfo } from '../../shared/index-local-types';

export function createResolveDashboardCustomTableNameIconContextInfo(deps: any) {
  const resolveDashboardCustomTableNameIconContextInfo = (
    tableName: string,
  ): DashboardCustomTableNameIconContextInfo | null => {
    for (const moduleKey of deps.getDashboardModuleKeysForTableName(tableName)) {
      const contextInfo = deps.getCUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS()[moduleKey];
      if (contextInfo) return contextInfo;
    }
    return null;
  };
  return resolveDashboardCustomTableNameIconContextInfo;
}
