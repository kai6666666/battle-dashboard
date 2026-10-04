/**
 * normalize-diff-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiffRow = unknown[];
export function createNormalizeDiffRow(_deps: any) {
  const normalizeDiffRow = (row: unknown): DiffRow => (Array.isArray(row) ? row : []);
  return normalizeDiffRow;
}
