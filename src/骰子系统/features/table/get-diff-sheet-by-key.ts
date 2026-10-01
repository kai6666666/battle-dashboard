/**
 * get-diff-sheet-by-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiffSheet = { content?: unknown[]; [key: string]: any };

export function createGetDiffSheetByKey(deps: any) {
  const getDiffSheetByKey = (data: unknown, sheetId: string): DiffSheet | null => {
    const record = deps.asDiffRecord(data);
    if (!record) return null;
    const sheet = record[sheetId];
    return deps.isDiffSheet(sheet) ? sheet : null;
  };
  return getDiffSheetByKey;
}
