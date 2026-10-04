/**
 * custom-table-name-icon-denied-modules.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { CustomTableNameIconModuleId } from '../../shared/index-local-types';

export function createCustomTableNameIconDeniedModules(_deps: any) {
  const CUSTOM_TABLE_NAME_ICON_DENIED_MODULES = new Set<CustomTableNameIconModuleId>([
    'avatar-manager',
    'relationship-graph',
    'map-character-node',
    'character-interaction-panel',
    'alias-resolution',
    'user-graph-resolution',
  ]);
  return CUSTOM_TABLE_NAME_ICON_DENIED_MODULES;
}
