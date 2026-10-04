/**
 * clone-acu-dice-api-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCloneAcuDiceApiValue(_deps: any) {
  const cloneAcuDiceApiValue = (value: any) => {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  };
  return cloneAcuDiceApiValue;
}
