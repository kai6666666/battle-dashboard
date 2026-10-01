/**
 * get-stable-row-key-for-crud.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetStableRowKeyForCrud(_deps: any) {
  const getStableRowKeyForCrud = (row: any) => {
    if (!Array.isArray(row)) return '';
    const primary = String(row[1] ?? '').trim();
    if (primary) return `title:${primary}`;
    return `row:${JSON.stringify(row)}`;
  };
  return getStableRowKeyForCrud;
}
