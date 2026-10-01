/**
 * get-equipment-result.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type GachaRewardParseOptions = Record<string, any>;

export function createGetEquipmentResult(deps: any) {
  const getEquipmentResult = (rawData: any, options: GachaRewardParseOptions = {}) => {
    const targetOverride = deps.resolveGachaTargetTableOverride(rawData, 'equipment', options);
    if (targetOverride) return targetOverride;
    const tables = deps.processJsonData(rawData || {});
    return deps.getDashboardDataParser().findTable(tables, 'equip');
  };
  return getEquipmentResult;
}
