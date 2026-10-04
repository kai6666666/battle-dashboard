/**
 * dashboard-preset-filter-keys.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDashboardPresetFilterKeys(_deps: any) {
  const DASHBOARD_PRESET_FILTER_KEYS: Record<string, readonly string[]> = {
    equip: ['equipped'],
  };
  return DASHBOARD_PRESET_FILTER_KEYS;
}
