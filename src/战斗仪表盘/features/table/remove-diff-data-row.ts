/**
 * remove-diff-data-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiffSheet = { content?: unknown[]; [key: string]: any };

export function createRemoveDiffDataRow(_deps: any) {
  const removeDiffDataRow = (sheet: DiffSheet | null | undefined, rowIndex: number): boolean => {
    if (!Array.isArray(sheet?.content) || !sheet.content[rowIndex + 1]) return false;
    sheet.content.splice(rowIndex + 1, 1);
    return true;
  };
  return removeDiffDataRow;
}
