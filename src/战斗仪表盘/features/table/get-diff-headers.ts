/**
 * get-diff-headers.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiffRow = unknown[];
export function createGetDiffHeaders(deps: any) {
  const getDiffHeaders = (sheet: unknown): DiffRow => deps.getDiffSheetContent(sheet)[0] ?? [];

  return getDiffHeaders;
}
