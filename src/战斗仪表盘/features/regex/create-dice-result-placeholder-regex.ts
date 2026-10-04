/**
 * create-dice-result-placeholder-regex.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateDiceResultPlaceholderRegex(_deps: any) {
  const createDiceResultPlaceholderRegex = () => /\[投骰结果已隐藏\]/g;
  return createDiceResultPlaceholderRegex;
}
