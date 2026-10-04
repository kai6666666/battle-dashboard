/**
 * is-gacha-rarity.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_RARITY_ORDER } from '../../entities/gacha-items';
import type { GachaRarity } from '../../entities/gacha-items';
export function createIsGachaRarity(_deps: any) {
  const isGachaRarity = (value: unknown): value is GachaRarity =>
    GACHA_RARITY_ORDER.includes(String(value || '') as GachaRarity);

  return isGachaRarity;
}
