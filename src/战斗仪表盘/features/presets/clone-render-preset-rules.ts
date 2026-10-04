/**
 * clone-render-preset-rules.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type RenderPresetRules = Record<string, any>;

export function createCloneRenderPresetRules(_deps: any) {
  const cloneRenderPresetRules = (rules: RenderPresetRules): RenderPresetRules =>
    JSON.parse(JSON.stringify(rules)) as RenderPresetRules;
  return cloneRenderPresetRules;
}
