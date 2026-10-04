/**
 * get-diff-data-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiffRow = unknown[];
type DiffSheet = { content?: unknown[]; [key: string]: any };

export function createGetDiffDataRow(_deps: any) {
  const getDiffDataRow = (sheet: DiffSheet | null | undefined, rowIndex: number): DiffRow | null => {
    const row = sheet?.content?.[rowIndex + 1];
    return Array.isArray(row) ? row : null;
  };
  return getDiffDataRow;
}
