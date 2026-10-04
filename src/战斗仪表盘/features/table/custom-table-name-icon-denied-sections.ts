/**
 * custom-table-name-icon-denied-sections.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { CustomTableNameIconSection } from '../../shared/index-local-types';

export function createCustomTableNameIconDeniedSections(_deps: any) {
  const CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS = new Set<CustomTableNameIconSection>([
    'character',
    'relationship',
    'alias',
    'user',
  ]);
  return CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS;
}
