/**
 * same-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSameRow(_deps: any) {
  const sameRow = (left: any, right: any): boolean => JSON.stringify(left || []) === JSON.stringify(right || []);
  return sameRow;
}
