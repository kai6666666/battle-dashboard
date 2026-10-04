/**
 * wiring / dice-config-backup-restore-wiring.ts — 配置备份恢复链装配簇（从 index.ts 迁出，x4-y）。
 */
import { createGetDiceConfigBackupGachaItemNameKey } from '../features/dice/get-dice-config-backup-gacha-item-name-key';
import { createGetDiceConfigBackupTableTemplateRollbackSnapshot } from '../features/dice/get-dice-config-backup-table-template-rollback-snapshot';
import { createMergeDiceConfigBackupGachaCatalogItems } from '../features/dice/merge-dice-config-backup-gacha-catalog-items';
import { createNormalizeDiceConfigBackupGachaCatalogItems } from '../features/dice/normalize-dice-config-backup-gacha-catalog-items';
import { createNormalizeDiceConfigBackupGachaCatalogResourceRecord } from '../features/dice/normalize-dice-config-backup-gacha-catalog-resource-record';
import { createRestoreDiceConfigBackupGachaCatalogRecords } from '../features/dice/restore-dice-config-backup-gacha-catalog-records';
import { createRestoreDiceConfigBackupGachaCatalogSnapshot } from '../features/dice/restore-dice-config-backup-gacha-catalog-snapshot';
import { createRestoreDiceConfigBackupModuleResources } from '../features/dice/restore-dice-config-backup-module-resources';
import { createRestoreDiceConfigBackupTableTemplate } from '../features/dice/restore-dice-config-backup-table-template';
import { createRestoreDiceConfigBackupTableTemplateRollbackSnapshot } from '../features/dice/restore-dice-config-backup-table-template-rollback-snapshot';
import { createSyncDiceConfigBackupRuntimeAfterRestore } from '../features/dice/sync-dice-config-backup-runtime-after-restore';
import { STORAGE_KEY_REGEX_RULES } from '../shared/storage-keys';

export function createDiceConfigBackupRestoreWiring(deps: any) {
  const { ActionPresetManager, AdvancedDicePresetManager, AttributePresetManager, AvatarManager, DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY, DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY, DashboardPresetManager, GACHA_CATALOG_GLOBAL_SCOPE_KEY, PresetManager, RegexPresetManager, RegexTransformationManager, RenderPresetManager, TableTemplateRequirementPresetManager, ValidationRuleManager, _configCache_ACC, applyConfigStyles, cloneDiceConfigBackupValue, cloneGachaCatalogItems, createEmptyGachaCatalog, dashboardRuntimeConfigCache_ACC, ensureGachaPoolsForTags, gachaCatalogCache_ACC, gachaCatalogLoadTask_ACC, getConfig, getCore, getDiceConfigBackupTableTemplateApi, getRuntimeGachaRawData, isDiceConfigBackupRecord, isGachaItemEnabled, isSettingsOpen_ACC, mergeGachaCatalogRecordsToGlobalScope, migrateGachaCatalogRecordsToGlobalScope, normalizeGachaCatalogRecord, normalizeImportedGachaItem, refreshDicePanelPresets, refreshGachaShardShop, refreshGachaVisualization, renderInterface, showGachaSettingsDialog, validateGachaCatalogImportItemTarget } = deps;
  const normalizeDiceConfigBackupGachaCatalogItems = createNormalizeDiceConfigBackupGachaCatalogItems({
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    normalizeImportedGachaItem: (...a: any[]) => normalizeImportedGachaItem(...a),
    validateGachaCatalogImportItemTarget: (...a: any[]) => validateGachaCatalogImportItemTarget(...a),
  });

  const normalizeDiceConfigBackupGachaCatalogResourceRecord = createNormalizeDiceConfigBackupGachaCatalogResourceRecord({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeDiceConfigBackupGachaCatalogItems: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogItems(...a),
  });

  const getDiceConfigBackupGachaItemNameKey = createGetDiceConfigBackupGachaItemNameKey({

  });

  const mergeDiceConfigBackupGachaCatalogItems = createMergeDiceConfigBackupGachaCatalogItems({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    getDiceConfigBackupGachaItemNameKey: (...a: any[]) => getDiceConfigBackupGachaItemNameKey(...a),
  });

  const getDiceConfigBackupTableTemplateRollbackSnapshot = createGetDiceConfigBackupTableTemplateRollbackSnapshot({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupTableTemplateApi: (...a: any[]) => getDiceConfigBackupTableTemplateApi(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const restoreDiceConfigBackupTableTemplateRollbackSnapshot = createRestoreDiceConfigBackupTableTemplateRollbackSnapshot({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupTableTemplateApi: (...a: any[]) => getDiceConfigBackupTableTemplateApi(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const restoreDiceConfigBackupGachaCatalogRecords = createRestoreDiceConfigBackupGachaCatalogRecords({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    createEmptyGachaCatalog: (...a: any[]) => createEmptyGachaCatalog(...a),
    ensureGachaPoolsForTags: (...a: any[]) => ensureGachaPoolsForTags(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    mergeDiceConfigBackupGachaCatalogItems: (...a: any[]) => mergeDiceConfigBackupGachaCatalogItems(...a),
    mergeGachaCatalogRecordsToGlobalScope: (...a: any[]) => mergeGachaCatalogRecordsToGlobalScope(...a),
    migrateGachaCatalogRecordsToGlobalScope: (...a: any[]) => migrateGachaCatalogRecordsToGlobalScope(...a),
    normalizeDiceConfigBackupGachaCatalogResourceRecord: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogResourceRecord(...a),
    normalizeGachaCatalogRecord: (...a: any[]) => normalizeGachaCatalogRecord(...a),
    GACHA_CATALOG_GLOBAL_SCOPE_KEY: GACHA_CATALOG_GLOBAL_SCOPE_KEY,
    getGachaCatalogCache: () => gachaCatalogCache_ACC.v,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache_ACC.v = v; },
  });

  const restoreDiceConfigBackupTableTemplate = createRestoreDiceConfigBackupTableTemplate({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupTableTemplateApi: (...a: any[]) => getDiceConfigBackupTableTemplateApi(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const restoreDiceConfigBackupModuleResources = createRestoreDiceConfigBackupModuleResources({
    restoreDiceConfigBackupGachaCatalogRecords: (...a: any[]) => restoreDiceConfigBackupGachaCatalogRecords(...a),
    restoreDiceConfigBackupTableTemplate: (...a: any[]) => restoreDiceConfigBackupTableTemplate(...a),
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const restoreDiceConfigBackupGachaCatalogSnapshot = createRestoreDiceConfigBackupGachaCatalogSnapshot({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getGachaCatalogCache: () => gachaCatalogCache_ACC.v,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache_ACC.v = v; },
    getGachaCatalogLoadTask: () => gachaCatalogLoadTask_ACC.v,
    setGachaCatalogLoadTask: (v: any) => { gachaCatalogLoadTask_ACC.v = v; },
  });

  const syncDiceConfigBackupRuntimeAfterRestore = createSyncDiceConfigBackupRuntimeAfterRestore({
    applyConfigStyles: (...a: any[]) => applyConfigStyles(...a),
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    refreshDicePanelPresets: (...a: any[]) => refreshDicePanelPresets(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
    ActionPresetManager: ActionPresetManager,
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    AttributePresetManager: AttributePresetManager,
    AvatarManager: AvatarManager,
    DashboardPresetManager: DashboardPresetManager,
    PresetManager: PresetManager,
    RegexPresetManager: RegexPresetManager,
    RegexTransformationManager: RegexTransformationManager,
    RenderPresetManager: RenderPresetManager,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
    ValidationRuleManager: ValidationRuleManager,
    get_configCache: () => _configCache_ACC.v,
    set_configCache: (v: any) => { _configCache_ACC.v = v; },
    getDashboardRuntimeConfigCache: () => dashboardRuntimeConfigCache_ACC.v,
    setDashboardRuntimeConfigCache: (v: any) => { dashboardRuntimeConfigCache_ACC.v = v; },
    getGachaCatalogCache: () => gachaCatalogCache_ACC.v,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache_ACC.v = v; },
    getGachaCatalogLoadTask: () => gachaCatalogLoadTask_ACC.v,
    setGachaCatalogLoadTask: (v: any) => { gachaCatalogLoadTask_ACC.v = v; },
    getIsSettingsOpen: () => isSettingsOpen_ACC.v,
    setIsSettingsOpen: (v: any) => { isSettingsOpen_ACC.v = v; },
  });
  return { getDiceConfigBackupTableTemplateRollbackSnapshot, normalizeDiceConfigBackupGachaCatalogResourceRecord, restoreDiceConfigBackupGachaCatalogSnapshot, restoreDiceConfigBackupModuleResources, restoreDiceConfigBackupTableTemplateRollbackSnapshot, syncDiceConfigBackupRuntimeAfterRestore };
}
