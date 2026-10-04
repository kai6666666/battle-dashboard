/**
 * get-composer-textarea.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type AcuDiceTextareaElement = any;

export function createGetComposerTextarea(deps: any) {
  const getComposerTextarea = (): AcuDiceTextareaElement | null => {
    const { $ } = deps.getCore();
    const $ta = $('#send_textarea');
    return $ta.length ? ($ta[0] as AcuDiceTextareaElement) : null;
  };
  return getComposerTextarea;
}
