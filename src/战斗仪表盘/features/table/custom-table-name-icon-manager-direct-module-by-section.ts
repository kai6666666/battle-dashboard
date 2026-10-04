/**
 * custom-table-name-icon-manager-direct-module-by-section.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { CustomTableNameIconSection } from '../../shared/index-local-types';
import type { CustomTableNameIconModuleId } from '../../shared/index-local-types';

export function createCustomTableNameIconManagerDirectModuleBySection(_deps: any) {
  const CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION: Partial<
    Record<CustomTableNameIconSection, CustomTableNameIconModuleId>
  > = {
    item: 'item',
    equipment: 'equipment',
    faction: 'faction',
    shop: 'shop',
  };
  return CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION;
}
