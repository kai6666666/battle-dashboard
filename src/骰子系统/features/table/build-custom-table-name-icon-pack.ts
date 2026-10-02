/**
 * build-custom-table-name-icon-pack.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
    `custom-table-name-icon-pack-${new Date().toISOString().slice(0, 10)}.json`;
import type { CustomTableNameIconPack, CustomTableNameIconPackEntry } from '../../shared/index-local-types';
export function createBuildCustomTableNameIconPack(deps: any) {
  const buildCustomTableNameIconPack = (): CustomTableNameIconPack => ({
    schemaVersion: deps.getCUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION(),
    exportedAt: new Date().toISOString(),
    entries: deps.getCustomTableNameIconStoreManager().getAll()
      .map(deps.buildCustomTableNameIconPackEntry)
      .filter((entry: any): entry is CustomTableNameIconPackEntry => Boolean(entry)),
  });

    `custom-table-name-icon-pack-${new Date().toISOString().slice(0, 10)}.json`;
  return buildCustomTableNameIconPack;
}
