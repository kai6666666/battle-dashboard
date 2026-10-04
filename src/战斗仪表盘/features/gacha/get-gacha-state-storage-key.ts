/**
 * get-gacha-state-storage-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetGachaStateStorageKey(deps: any) {
  const getGachaStateStorageKey = (): string => deps.getGachaStore().getStorageKey();
  return getGachaStateStorageKey;
}
