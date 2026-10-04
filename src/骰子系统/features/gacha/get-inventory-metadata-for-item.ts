/**
 * get-inventory-metadata-for-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type InventoryParsedItem = Record<string, any>;
type InventoryMetadataRecord = Record<string, any>;

export function createGetInventoryMetadataForItem(deps: any) {
  const getInventoryMetadataForItem = (
    rawData: any,
    item: Pick<InventoryParsedItem, 'tableKey' | 'tableName' | 'name'>,
  ): InventoryMetadataRecord | null => {
    const root = deps.getInventoryMetadataRoot(rawData, false);
    const scopeKey = deps.getInventoryMetadataScopeKey(item.tableKey, item.tableName);
    const scope = root[scopeKey];
    if (!scope || typeof scope !== 'object') return null;
    const record = scope[item.name];
    if (!record || typeof record !== 'object') return null;
    return {
      acquiredAt: String(record.acquiredAt || '').trim(),
      acquiredAtLocation: String(record.acquiredAtLocation || '').trim(),
    };
  };
  return getInventoryMetadataForItem;
}
