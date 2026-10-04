/**
 * set-diff-data-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiffSheet = { content?: unknown[]; [key: string]: any };
type DiffRow = unknown[];

export function createSetDiffDataRow(_deps: any) {
  const setDiffDataRow = (sheet: DiffSheet | null | undefined, rowIndex: number, row: DiffRow): boolean => {
    if (!Array.isArray(sheet?.content)) return false;
    sheet.content[rowIndex + 1] = [...row];
    return true;
  };
  return setDiffDataRow;
}
