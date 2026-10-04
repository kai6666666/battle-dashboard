/**
 * is-same-keyword-set.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsSameKeywordSet(_deps: any) {
  const isSameKeywordSet = (left: string[], right: readonly string[]): boolean => {
    const rightSet = new Set(right);
    return left.length === rightSet.size && left.every(item => rightSet.has(item));
  };
  return isSameKeywordSet;
}
