/**
 * custom-table-name-icon-module-ids.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { CustomTableNameIconModuleId } from '../../shared/index-local-types';
export function createCustomTableNameIconModuleIds(_deps: any) {
  const CUSTOM_TABLE_NAME_ICON_MODULE_IDS: readonly CustomTableNameIconModuleId[] = [
    'table-name',
    'item',
    'equipment',
    'faction',
    'global-interaction-panel',
    'global-interaction-map-marker',
    'shop',
    'avatar-manager',
    'relationship-graph',
    'map-character-node',
    'character-interaction-panel',
    'alias-resolution',
    'user-graph-resolution',
  ];
  return CUSTOM_TABLE_NAME_ICON_MODULE_IDS;
}
