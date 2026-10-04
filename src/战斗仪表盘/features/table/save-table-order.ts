/**
 * save-table-order.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_TABLE_ORDER } from '../../shared/storage-keys';
export function createSaveTableOrder(_deps: any) {
  const saveTableOrder = (v: any) => Store.set(STORAGE_KEY_TABLE_ORDER, v);
  return saveTableOrder;
}
