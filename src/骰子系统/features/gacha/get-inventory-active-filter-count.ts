/**
 * get-inventory-active-filter-count.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type InventoryFilterState = Record<string, any>;

export function createGetInventoryActiveFilterCount(_deps: any) {
  const getInventoryActiveFilterCount = (filters: InventoryFilterState) => {
    let count = 0;
    if (filters.type !== '全部') count += 1;
    if (filters.quality !== '全部') count += 1;
    if (filters.sort !== 'default') count += 1;
    return count;
  };
  return getInventoryActiveFilterCount;
}
