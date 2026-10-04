/**
 * is-attribute-quick-select-target.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type AttributeQuickSelectTarget = 'attribute' | 'skillMod' | 'mod';

export function createIsAttributeQuickSelectTarget(_deps: any) {
  const isAttributeQuickSelectTarget = (value: unknown): value is AttributeQuickSelectTarget =>
    value === 'attribute' || value === 'skillMod' || value === 'mod';
  return isAttributeQuickSelectTarget;
}
