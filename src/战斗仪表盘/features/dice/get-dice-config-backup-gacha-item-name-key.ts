/**
 * get-dice-config-backup-gacha-item-name-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetDiceConfigBackupGachaItemNameKey(_deps: any) {
  const getDiceConfigBackupGachaItemNameKey = (item: Pick<GachaItemDefinition, 'name' | 'type' | 'quality'>): string =>
    `${String(item.name || '').trim()}|${String(item.type || '').trim()}|${String(item.quality || '').trim()}`.toLowerCase();
  return getDiceConfigBackupGachaItemNameKey;
}
