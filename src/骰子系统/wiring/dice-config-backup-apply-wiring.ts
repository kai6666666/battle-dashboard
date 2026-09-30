/**
 * wiring / dice-config-backup-apply-wiring.ts — 配置备份应用装配簇（从 index.ts 迁出，x4-af）。
 */
import { createApplyDiceConfigBackup } from '../features/dice/apply-dice-config-backup';
import { STORAGE_KEY_GACHA_ITEM_SETTINGS, STORAGE_KEY_GACHA_POOL_SETTINGS, STORAGE_KEY_REGEX_RULES, STORAGE_KEY_TABLE_ORDER } from '../shared/storage-keys';

export function createDiceConfigBackupApplyWiring(deps: any) {
  const { DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY, DICE_CONFIG_BACKUP_FORMAT, DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY, DICE_CONFIG_BACKUP_SCHEMA_VERSION, applyDiceConfigBackupActiveValue, applyDiceConfigBackupValue, buildDiceConfigBackupTableOrder, cachedRawData_ACC, collectDiceConfigBackupGachaCatalogRollbackSnapshot, getDiceConfigBackupModuleDefinition, getDiceConfigBackupTableTemplateRollbackSnapshot, getRuntimeGachaRawData, getTableData, hasDiceConfigBackupTableTemplateResource, normalizeDiceConfigBackupGachaItemSettings, normalizeDiceConfigBackupSelectedModuleIds, remapDiceConfigBackupGachaItemSettings, restoreDiceConfigBackupGachaCatalogSnapshot, restoreDiceConfigBackupModuleResources, restoreDiceConfigBackupTableTemplateRollbackSnapshot, saveTableOrder, syncDiceConfigBackupRuntimeAfterRestore } = deps;
  const applyDiceConfigBackup = createApplyDiceConfigBackup({
    applyDiceConfigBackupActiveValue: (...a: any[]) => applyDiceConfigBackupActiveValue(...a),
    applyDiceConfigBackupValue: (...a: any[]) => applyDiceConfigBackupValue(...a),
    collectDiceConfigBackupGachaCatalogRollbackSnapshot: (...a: any[]) => collectDiceConfigBackupGachaCatalogRollbackSnapshot(...a),
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
    getDiceConfigBackupTableTemplateRollbackSnapshot: (...a: any[]) => getDiceConfigBackupTableTemplateRollbackSnapshot(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hasDiceConfigBackupTableTemplateResource: (...a: any[]) => hasDiceConfigBackupTableTemplateResource(...a),
    normalizeDiceConfigBackupGachaItemSettings: (...a: any[]) => normalizeDiceConfigBackupGachaItemSettings(...a),
    normalizeDiceConfigBackupSelectedModuleIds: (...a: any[]) => normalizeDiceConfigBackupSelectedModuleIds(...a),
    remapDiceConfigBackupGachaItemSettings: (...a: any[]) => remapDiceConfigBackupGachaItemSettings(...a),
    restoreDiceConfigBackupGachaCatalogSnapshot: (...a: any[]) => restoreDiceConfigBackupGachaCatalogSnapshot(...a),
    restoreDiceConfigBackupModuleResources: (...a: any[]) => restoreDiceConfigBackupModuleResources(...a),
    restoreDiceConfigBackupTableTemplateRollbackSnapshot: (...a: any[]) => restoreDiceConfigBackupTableTemplateRollbackSnapshot(...a),
    syncDiceConfigBackupRuntimeAfterRestore: (...a: any[]) => syncDiceConfigBackupRuntimeAfterRestore(...a),
    DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY: DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY,
    DICE_CONFIG_BACKUP_FORMAT: DICE_CONFIG_BACKUP_FORMAT,
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_SCHEMA_VERSION: DICE_CONFIG_BACKUP_SCHEMA_VERSION,
    STORAGE_KEY_GACHA_ITEM_SETTINGS: STORAGE_KEY_GACHA_ITEM_SETTINGS,
    STORAGE_KEY_GACHA_POOL_SETTINGS: STORAGE_KEY_GACHA_POOL_SETTINGS,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
    getCachedRawData: () => cachedRawData_ACC.v,
    setCachedRawData: (v: any) => { cachedRawData_ACC.v = v; },
    buildDiceConfigBackupTableOrder: (...a: any[]) => buildDiceConfigBackupTableOrder(...a),
    saveTableOrder: (...a: any[]) => saveTableOrder(...a),
    STORAGE_KEY_TABLE_ORDER: STORAGE_KEY_TABLE_ORDER,
  });
  return { applyDiceConfigBackup };
}
