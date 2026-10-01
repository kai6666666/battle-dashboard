/**
 * get-diff-sheet-content.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiffRow = unknown[];

export function createGetDiffSheetContent(deps: any) {
  const getDiffSheetContent = (sheet: unknown): DiffRow[] => {
    if (!deps.isDiffSheet(sheet)) return [];
    return (sheet as any).content?.map(deps.normalizeDiffRow) ?? [];
  };
  return getDiffSheetContent;
}
