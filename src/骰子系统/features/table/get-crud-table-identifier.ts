/**
 * get-crud-table-identifier.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCrudTableIdentifier(deps: any) {
  const getCrudTableIdentifier = (sheet: unknown, fallbackName: string): string =>
    deps.getCrudSqlTableName(sheet) || deps.normalizeDiffText(fallbackName);

  return getCrudTableIdentifier;
}
