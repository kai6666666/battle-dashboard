/**
 * get-inventory-default-meta-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type InventoryMetadataRecord = Record<string, any>;

export function createGetInventoryDefaultMetaRecord(deps: any) {
  const getInventoryDefaultMetaRecord = (rawData: any): InventoryMetadataRecord => {
    const globalContext = deps.getInventoryGlobalContext(rawData);
    const fallbackTime = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    return {
      acquiredAt: String(globalContext.currentTime || fallbackTime).trim(),
      acquiredAtLocation: String(globalContext.currentDetailLocation || '').trim() || '未知',
    };
  };
  return getInventoryDefaultMetaRecord;
}
