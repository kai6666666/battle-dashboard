/**
 * get-legacy-inventory-metadata-root.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type InventoryMetadataRoot = Record<string, any>;

export function createGetLegacyInventoryMetadataRoot(deps: any) {
  const getLegacyInventoryMetadataRoot = (rawData: any): InventoryMetadataRoot | null => {
    if (!rawData || typeof rawData !== 'object') return null;
    const mate = (rawData as { mate?: unknown }).mate;
    if (!mate || typeof mate !== 'object') return null;
    const inventoryMeta = (mate as { inventoryMeta?: unknown }).inventoryMeta;
    if (!inventoryMeta || typeof inventoryMeta !== 'object') return null;
    return deps.cloneRuntimeDataValue(inventoryMeta) as InventoryMetadataRoot;
  };
  return getLegacyInventoryMetadataRoot;
}
