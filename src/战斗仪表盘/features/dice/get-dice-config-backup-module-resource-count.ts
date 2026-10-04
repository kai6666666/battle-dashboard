/**
 * get-dice-config-backup-module-resource-count.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCatalogRecord } from '../../features/gacha/gacha-types';
type DiceConfigBackupModuleId =
  | 'uiLayout'
  | 'diceConfig'
  | 'advancedPresets'
  | 'attributePresets'
  | 'actionGm'
  | 'dashboardPresets'
  | 'renderPresets'
  | 'tableTemplate'
  | 'tableTemplateRequirementPresets'
  | 'validation'
  | 'regex'
  | 'avatarMap'
  | 'customIcons'
  | 'gachaSettings';

interface DiceConfigBackupModulePayload {
  storage: Record<string, unknown>;
  resources?: Record<string, unknown>;
  warnings?: string[];
}

export function createGetDiceConfigBackupModuleResourceCount(deps: any) {
  const getDiceConfigBackupModuleResourceCount = (
    payload?: DiceConfigBackupModulePayload,
    moduleId?: DiceConfigBackupModuleId,
  ): number => {
    const resources = payload?.resources;
    if (!resources) return 0;
    if (moduleId === 'tableTemplate') {
      const tableTemplate = resources[deps.DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY];
      return deps.isDiceConfigBackupRecord(tableTemplate) ? Math.max(1, Object.keys(tableTemplate as Record<string, unknown>).length) : 0;
    }
    if (moduleId === 'gachaSettings') {
      const gachaRecords = resources[deps.DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY];
      if (!Array.isArray(gachaRecords)) return 0;
      const records = gachaRecords
        .map(record =>
          deps.isDiceConfigBackupRecord(record) ? deps.normalizeDiceConfigBackupGachaCatalogResourceRecord(record, []) : null,
        )
        .filter((record): record is GachaCatalogRecord => Boolean(record));
      return deps.getDiceConfigBackupGachaCatalogItemCount(records);
    }
    return 0;
  };
  return getDiceConfigBackupModuleResourceCount;
}
