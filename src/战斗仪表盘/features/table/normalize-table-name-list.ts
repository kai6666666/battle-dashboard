/**
 * normalize-table-name-list.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeTableNameList(_deps: any) {
  const normalizeTableNameList = (tableNames: any) => {
    if (!Array.isArray(tableNames)) return [];
    return Array.from(new Set(tableNames.filter(name => typeof name === 'string' && name.trim())));
  };
  return normalizeTableNameList;
}
