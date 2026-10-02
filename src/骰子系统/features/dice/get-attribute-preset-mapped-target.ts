/**
 * get-attribute-preset-mapped-target.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type AttributePresetConfig = Record<string, any>;
type CharacterAttributeSource = string;
type AttributeQuickSelectTarget = string;

export function createGetAttributePresetMappedTarget(deps: any) {
  const getAttributePresetMappedTarget = (
    preset: AttributePresetConfig | null | undefined,
    attrName: string,
    source: CharacterAttributeSource | null | undefined,
  ): AttributeQuickSelectTarget | null => {
    if (!preset?.quickSelect) return null;
    const config = deps.normalizeAttributeQuickSelectConfig(preset.quickSelect);
    for (const [target, names] of Object.entries(config.nameTargetMapping)) {
      if (!deps.isAttributeQuickSelectTarget(target)) continue;
      if (Array.isArray(names) && names.includes(attrName)) return target;
    }
    if (source === 'base') return config.baseTarget;
    if (source === 'special') return config.specialTarget;
    return config.fallbackTarget;
  };
  return getAttributePresetMappedTarget;
}
