/**
 * get-gacha-reward-parse-result.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTarget } from '../../entities/gacha-items';
type GachaRewardParseOptions = Record<string, any>;
type GachaRewardParseResult = Record<string, any>;

export function createGetGachaRewardParseResult(deps: any) {
  const getGachaRewardParseResult = (
    rawData: any,
    target: GachaRewardTarget,
    options: GachaRewardParseOptions = {},
  ): GachaRewardParseResult => (target === 'equipment' ? deps.parseEquipmentItems(rawData, options) : deps.parseInventoryItems(rawData, options));
  return getGachaRewardParseResult;
}
