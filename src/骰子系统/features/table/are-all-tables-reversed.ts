/**
 * are-all-tables-reversed.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAreAllTablesReversed(deps: any) {
  const areAllTablesReversed = (tableNames: any) => {
    const names = deps.normalizeTableNameList(tableNames);
    if (names.length === 0) return false;
    const reverseSet = new Set(deps.getNormalizedReverseTables());
    return names.every((name: any) => reverseSet.has(name));
  };
  return areAllTablesReversed;
}
