/**
 * is-database-button-disabled.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsDatabaseButtonDisabled(_deps: any) {
  const isDatabaseButtonDisabled = (button: HTMLButtonElement): boolean =>
    button.disabled || button.getAttribute('aria-disabled') === 'true';

  return isDatabaseButtonDisabled;
}
