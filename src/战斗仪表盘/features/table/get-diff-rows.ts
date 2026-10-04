/**
 * get-diff-rows.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiffRow = unknown[];
export function createGetDiffRows(deps: any) {
  const getDiffRows = (sheet: unknown): DiffRow[] => deps.getDiffSheetContent(sheet).slice(1);
  return getDiffRows;
}
