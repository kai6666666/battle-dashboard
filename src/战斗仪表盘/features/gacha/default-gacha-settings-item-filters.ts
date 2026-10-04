/**
 * default-gacha-settings-item-filters.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaSettingsItemFilterState } from './gacha-types';
export function createDefaultGachaSettingsItemFilters(_deps: any) {
  const DEFAULT_GACHA_SETTINGS_ITEM_FILTERS: GachaSettingsItemFilterState = {
    search: '',
    source: 'all',
    status: 'all',
    sort: 'default',
  };
  return DEFAULT_GACHA_SETTINGS_ITEM_FILTERS;
}
