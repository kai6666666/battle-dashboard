/**
 * get-crud-changed-columns.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCrudChangedColumns(_deps: any) {
  const getCrudChangedColumns = (headers: any, currentRow: any, nextRow: any): Set<number> => {
    const changedColumns = new Set<number>();
    if (!Array.isArray(headers)) return changedColumns;
    headers.forEach((header, colIndex) => {
      if (colIndex === 0) return;
      if (!header) return;
      if (String(currentRow?.[colIndex] ?? '') !== String(nextRow?.[colIndex] ?? '')) {
        changedColumns.add(colIndex);
      }
    });
    return changedColumns;
  };
  return getCrudChangedColumns;
}
