/**
 * normalize-diff-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export const normalizeDiffHeaderImpl = (value: unknown): string => String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

export const normalizeDiffHeader = normalizeDiffHeaderImpl;
export function createNormalizeDiffText(_deps: any) {
  const normalizeDiffText = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .replace(/\s+/g, ' ');

  return normalizeDiffText;
}
