/**
 * has-advanced-preset-field-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHasAdvancedPresetFieldConfig(deps: any) {
  const hasAdvancedPresetFieldConfig = (value: unknown): value is Record<string, unknown> =>
    deps.isAdvancedPresetRecord(value) && Object.keys(value as Record<string, unknown>).length > 0;

  return hasAdvancedPresetFieldConfig;
}
