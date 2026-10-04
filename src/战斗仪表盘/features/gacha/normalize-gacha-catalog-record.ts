/**
 * normalize-gacha-catalog-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_CATALOG_VERSION } from '../../entities/gacha-items';
import type { GachaCatalog } from './gacha-types';
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createNormalizeGachaCatalogRecord(_deps: any) {
  const normalizeGachaCatalogRecord = (catalogRaw: unknown): GachaCatalog | null => {
    if (!catalogRaw || typeof catalogRaw !== 'object') return null;
    const record = catalogRaw as Record<string, unknown>;
    const items = Array.isArray(record.items)
      ? record.items.filter((item): item is GachaItemDefinition => Boolean(item && typeof item === 'object'))
      : [];
    return {
      version: Number(record.version) || GACHA_CATALOG_VERSION,
      items,
      updatedAt: Math.max(0, Number(record.updatedAt) || 0),
    };
  };
  return normalizeGachaCatalogRecord;
}
