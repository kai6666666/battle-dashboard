/**
 * is-two-dimensional-array.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsTwoDimensionalArray(_deps: any) {
  const isTwoDimensionalArray = (value: unknown): value is unknown[][] =>
    Array.isArray(value) && value.every(row => Array.isArray(row));

  return isTwoDimensionalArray;
}
