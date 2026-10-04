/**
 * normalize-global-interaction-category-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeGlobalInteractionCategoryText(_deps: any) {
  const normalizeGlobalInteractionCategoryText = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase();

  return normalizeGlobalInteractionCategoryText;
}
