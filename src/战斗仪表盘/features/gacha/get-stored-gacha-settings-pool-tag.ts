/**
 * get-stored-gacha-settings-pool-tag.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, normalizeGachaPoolId } from './gacha-helpers';
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_GACHA_SETTINGS_POOL_TAG } from '../../shared/storage-keys';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createGetStoredGachaSettingsPoolTag(deps: any) {
  const getStoredGachaSettingsPoolTag = (rawData: any): GachaPoolTag => {
    const stored = normalizeGachaPoolId(Store.get(STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, GACHA_ALL_POOL_TAG));
    const pools = deps.getVisibleGachaPoolConfigDefinitions(rawData);
    return pools.some((pool: any) => pool.id === stored) ? stored : GACHA_ALL_POOL_TAG;
  };
  return getStoredGachaSettingsPoolTag;
}
