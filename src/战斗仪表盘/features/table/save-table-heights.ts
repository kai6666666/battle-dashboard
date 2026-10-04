/**
 * save-table-heights.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_TABLE_HEIGHTS } from '../../shared/storage-keys';
export function createSaveTableHeights(_deps: any) {
  const saveTableHeights = (v: any) => Store.set(STORAGE_KEY_TABLE_HEIGHTS, v);
  return saveTableHeights;
}
