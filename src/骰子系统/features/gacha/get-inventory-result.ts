/**
 * get-inventory-result.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type GachaRewardParseOptions = Record<string, any>;

export function createGetInventoryResult(deps: any) {
  const getInventoryResult = (rawData: any, options: GachaRewardParseOptions = {}) => {
    const targetOverride = deps.resolveGachaTargetTableOverride(rawData, 'inventory', options);
    if (targetOverride) return targetOverride;
    const tables = deps.processJsonData(rawData || {});
    return deps.getDashboardDataParser().findTable(tables, 'bag');
  };
  return getInventoryResult;
}
