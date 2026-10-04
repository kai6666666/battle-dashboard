/**
 * should-show-reverse-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShouldShowReverseButton(_deps: any) {
  const shouldShowReverseButton = (tableName: any) => {
    return typeof tableName === 'string' && tableName.trim().length > 0;
  };
  return shouldShowReverseButton;
}
