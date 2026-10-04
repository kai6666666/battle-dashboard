/**
 * find-inventory-item-by-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindInventoryItemByRow(deps: any) {
  const findInventoryItemByRow = (rowIndex: any, target = 'inventory') => {
    const rawData = deps.getCachedRawData() || deps.getTableData();
    const parsed = target === 'equipment' ? deps.parseEquipmentItems(rawData) : deps.parseInventoryItems(rawData);
    return parsed.items.find((item: any) => item.rowIndex === rowIndex) || null;
  };
  return findInventoryItemByRow;
}
