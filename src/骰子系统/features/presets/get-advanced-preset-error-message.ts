/**
 * get-advanced-preset-error-message.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetAdvancedPresetErrorMessage(_deps: any) {
  const getAdvancedPresetErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : String(error || '未知错误');

  return getAdvancedPresetErrorMessage;
}
