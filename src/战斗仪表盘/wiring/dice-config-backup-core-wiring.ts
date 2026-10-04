/**
 * wiring / dice-config-backup-core-wiring.ts — 配置备份核心装配簇（从 index.ts 迁出，x4-f）。
 */
import { createApplyDiceConfigBackupActiveValue } from '../features/dice/apply-dice-config-backup-active-value';
import { createApplyDiceConfigBackupRuleOverrides } from '../features/dice/apply-dice-config-backup-rule-overrides';
import { createApplyDiceConfigBackupValue } from '../features/dice/apply-dice-config-backup-value';
import { createBuildDiceConfigBackup } from '../features/dice/build-dice-config-backup';
import { createBuildDiceConfigBackupRuleOverrideMap } from '../features/dice/build-dice-config-backup-rule-override-map';
import { createBuildDiceConfigBackupTableOrder } from '../features/dice/build-dice-config-backup-table-order';
import { createCollectDiceConfigBackupGachaCatalogRecords } from '../features/dice/collect-dice-config-backup-gacha-catalog-records';
import { createCollectDiceConfigBackupGachaCatalogRollbackSnapshot } from '../features/dice/collect-dice-config-backup-gacha-catalog-rollback-snapshot';
import { createCopyDiceConfigBackupExistingFields } from '../features/dice/copy-dice-config-backup-existing-fields';
import { createDiceConfigBackupActiveKeyToPresetKey } from '../features/dice/dice-config-backup-active-key-to-preset-key';
import { DICE_CONFIG_BACKUP_KEY_STRATEGIES } from '../features/dice/dice-config-backup-key-strategies';
import { DICE_CONFIG_BACKUP_MODULES } from '../features/dice/dice-config-backup-modules';
import { createDiceConfigBackupPrivacyRiskText } from '../features/dice/dice-config-backup-privacy-risk-text';
import { createFormatDiceConfigBackupPrivacyDetail } from '../features/dice/format-dice-config-backup-privacy-detail';
import { createFormatDiceConfigBackupSelectedModuleRiskLines } from '../features/dice/format-dice-config-backup-selected-module-risk-lines';
import { createGetDiceConfigBackupBuiltinPresetIds } from '../features/dice/get-dice-config-backup-builtin-preset-ids';
import { createGetDiceConfigBackupGachaCatalogItemCount } from '../features/dice/get-dice-config-backup-gacha-catalog-item-count';
import { createGetDiceConfigBackupKeyStrategy } from '../features/dice/get-dice-config-backup-key-strategy';
import { createGetDiceConfigBackupKnownPresetIds } from '../features/dice/get-dice-config-backup-known-preset-ids';
import { createGetDiceConfigBackupModuleDefinition } from '../features/dice/get-dice-config-backup-module-definition';
import { createGetDiceConfigBackupModuleResourceCount } from '../features/dice/get-dice-config-backup-module-resource-count';
import { createGetDiceConfigBackupModuleResourceShapeWarnings } from '../features/dice/get-dice-config-backup-module-resource-shape-warnings';
import { createGetDiceConfigBackupModuleWarnings } from '../features/dice/get-dice-config-backup-module-warnings';
import { createGetDiceConfigBackupPresetRecordId } from '../features/dice/get-dice-config-backup-preset-record-id';
import { createGetDiceConfigBackupPresetRecordName } from '../features/dice/get-dice-config-backup-preset-record-name';
import { createGetDiceConfigBackupRecordString } from '../features/dice/get-dice-config-backup-record-string';
import { createGetDiceConfigBackupRegexRuleKey } from '../features/dice/get-dice-config-backup-regex-rule-key';
import { createGetDiceConfigBackupRuleRecords } from '../features/dice/get-dice-config-backup-rule-records';
import { createGetDiceConfigBackupSafeCurrentPresets } from '../features/dice/get-dice-config-backup-safe-current-presets';
import { createGetDiceConfigBackupStoredValue } from '../features/dice/get-dice-config-backup-stored-value';
import { createGetDiceConfigBackupTableTemplateApi } from '../features/dice/get-dice-config-backup-table-template-api';
import { createGetDiceConfigBackupValidationRuleKey } from '../features/dice/get-dice-config-backup-validation-rule-key';
import { createGetDiceConfigBackupValueIdentity } from '../features/dice/get-dice-config-backup-value-identity';
import { createGetDiceConfigBackupWarningCount } from '../features/dice/get-dice-config-backup-warning-count';
import { createHasDiceConfigBackupLocalImageReference } from '../features/dice/has-dice-config-backup-local-image-reference';
import { createHasDiceConfigBackupRecoverableStorage } from '../features/dice/has-dice-config-backup-recoverable-storage';
import { createHasDiceConfigBackupTableTemplateResource } from '../features/dice/has-dice-config-backup-table-template-resource';
import { createIsDiceConfigBackupModuleId } from '../features/dice/is-dice-config-backup-module-id';
import { createIsDiceConfigBackupRecord } from '../features/dice/is-dice-config-backup-record';
import { createIsDiceConfigBackupSameValue } from '../features/dice/is-dice-config-backup-same-value';
import { createMergeDiceConfigBackupCustomOnlyPresetArray } from '../features/dice/merge-dice-config-backup-custom-only-preset-array';
import { createMergeDiceConfigBackupCustomRules } from '../features/dice/merge-dice-config-backup-custom-rules';
import { createMergeDiceConfigBackupGachaItemSettings } from '../features/dice/merge-dice-config-backup-gacha-item-settings';
import { createMergeDiceConfigBackupGachaPoolSettings } from '../features/dice/merge-dice-config-backup-gacha-pool-settings';
import { createMergeDiceConfigBackupPresetArray } from '../features/dice/merge-dice-config-backup-preset-array';
import { createMergeDiceConfigBackupPresetArraySafely } from '../features/dice/merge-dice-config-backup-preset-array-safely';
import { createMergeDiceConfigBackupRegexRules } from '../features/dice/merge-dice-config-backup-regex-rules';
import { createMergeDiceConfigBackupSetArray } from '../features/dice/merge-dice-config-backup-set-array';
import { createMergeDiceConfigBackupValidationRules } from '../features/dice/merge-dice-config-backup-validation-rules';
import { createNormalizeDiceConfigBackupGachaCatalogSnapshotRecords } from '../features/dice/normalize-dice-config-backup-gacha-catalog-snapshot-records';
import { createNormalizeDiceConfigBackupGachaItemSettings } from '../features/dice/normalize-dice-config-backup-gacha-item-settings';
import { createNormalizeDiceConfigBackupGachaPoolSettings } from '../features/dice/normalize-dice-config-backup-gacha-pool-settings';
import { createNormalizeDiceConfigBackupSelectedModuleIds } from '../features/dice/normalize-dice-config-backup-selected-module-ids';
import { createParseDiceConfigBackup } from '../features/dice/parse-dice-config-backup';
import { createRemapDiceConfigBackupGachaItemSettings } from '../features/dice/remap-dice-config-backup-gacha-item-settings';
import { createSanitizeDiceConfigBackupCustomOnlyPresetArrayForExport } from '../features/dice/sanitize-dice-config-backup-custom-only-preset-array-for-export';
import { createSanitizeDiceConfigBackupPresetRules } from '../features/dice/sanitize-dice-config-backup-preset-rules';
import { createSanitizeDiceConfigBackupRegexRule } from '../features/dice/sanitize-dice-config-backup-regex-rule';
import { createSanitizeDiceConfigBackupRuleList } from '../features/dice/sanitize-dice-config-backup-rule-list';
import { createSanitizeDiceConfigBackupStoredValue } from '../features/dice/sanitize-dice-config-backup-stored-value';
import { createSanitizeDiceConfigBackupValidationRule } from '../features/dice/sanitize-dice-config-backup-validation-rule';
import { createSetDiceConfigBackupValue } from '../features/dice/set-dice-config-backup-value';
import { createShowDiceConfigBackupPrivacyConfirm } from '../features/dice/show-dice-config-backup-privacy-confirm';
import { BUILTIN_VALIDATION_RULES } from '../features/validation/builtin-validation-rules';
import { STORAGE_KEY_PRESETS, STORAGE_KEY_REGEX_PRESETS, STORAGE_KEY_REGEX_RULES, STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS, STORAGE_KEY_VALIDATION_RULES } from '../shared/storage-keys';
import { TABLE_NAV_SPECIAL_KEYS } from '../shared/table-nav-special-keys';

export function createDiceConfigBackupCoreWiring(deps: any) {
  const { CUSTOM_ROLL_MODE, DASHBOARD_DEFAULT_PRESET_ID, DEPRECATED_BUILTIN_REGEX_RULE_IDS, DICE_CONFIG_BACKUP_FORMAT, DICE_CONFIG_BACKUP_SCHEMA_VERSION, PresetManager, RENDER_DEFAULT_PRESET_ID, RegexPresetManager, buildDefaultGachaPoolDefinition, cloneGachaCatalogItems, getConfig, getCore, getCrazyModeConfig, getDiceConfig, getRuntimeGachaRawData, isBuiltinGachaPoolId, migrateGachaCatalogRecordsToGlobalScope, normalizeDiceConfigBackupGachaCatalogResourceRecord, normalizeGachaCatalogRecord, normalizeGachaItemEnabled, normalizeGachaItemOrder, normalizeGachaPoolDefinition, parseJsoncDocument, showDiceSystemConfirmDialog, TableTemplateRequirementPresetManager, BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS } = deps;
  const DICE_CONFIG_BACKUP_PRIVACY_RISK_TEXT = createDiceConfigBackupPrivacyRiskText({

  });



  const DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY = 'gachaCatalogRecords';
  const DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY = 'tableTemplate';
  const buildDiceConfigBackupTableOrder = createBuildDiceConfigBackupTableOrder({
    TABLE_NAV_SPECIAL_KEYS: TABLE_NAV_SPECIAL_KEYS,
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  interface DiceConfigBackupTableTemplateApi {
    getTableTemplate?: () => unknown;
    importTemplateFromData?: (template: unknown, options?: { scope?: string }) => Promise<unknown> | unknown;
  }

  const DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY = createDiceConfigBackupActiveKeyToPresetKey({

  });

  const isDiceConfigBackupRecord = createIsDiceConfigBackupRecord({

  });
  const cloneDiceConfigBackupValue = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

  const getDiceConfigBackupModuleDefinition = createGetDiceConfigBackupModuleDefinition({
    getDICE_CONFIG_BACKUP_MODULES: () => DICE_CONFIG_BACKUP_MODULES,
  });

  const isDiceConfigBackupModuleId = createIsDiceConfigBackupModuleId({

  });

  const getDiceConfigBackupWarningCount = createGetDiceConfigBackupWarningCount({

  });

  const formatDiceConfigBackupSelectedModuleRiskLines = createFormatDiceConfigBackupSelectedModuleRiskLines({
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
    getDICE_CONFIG_BACKUP_PRIVACY_RISK_TEXT: () => DICE_CONFIG_BACKUP_PRIVACY_RISK_TEXT,
  });

  const formatDiceConfigBackupPrivacyDetail = createFormatDiceConfigBackupPrivacyDetail({
    formatDiceConfigBackupSelectedModuleRiskLines: (...a: any[]) => formatDiceConfigBackupSelectedModuleRiskLines(...a),
  });

  const showDiceConfigBackupPrivacyConfirm = createShowDiceConfigBackupPrivacyConfirm({
    formatDiceConfigBackupPrivacyDetail: (...a: any[]) => formatDiceConfigBackupPrivacyDetail(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
  });

  const normalizeDiceConfigBackupSelectedModuleIds = createNormalizeDiceConfigBackupSelectedModuleIds({
    isDiceConfigBackupModuleId: (...a: any[]) => isDiceConfigBackupModuleId(...a),
  });

  const getDiceConfigBackupKeyStrategy = createGetDiceConfigBackupKeyStrategy({
    getDICE_CONFIG_BACKUP_KEY_STRATEGIES: () => DICE_CONFIG_BACKUP_KEY_STRATEGIES,
  });

  const getDiceConfigBackupRecordString = createGetDiceConfigBackupRecordString({

  });

  const getDiceConfigBackupValidationRuleKey = createGetDiceConfigBackupValidationRuleKey({
    getDiceConfigBackupRecordString: (...a: any[]) => getDiceConfigBackupRecordString(...a),
  });

  const getDiceConfigBackupRegexRuleKey = createGetDiceConfigBackupRegexRuleKey({
    getDiceConfigBackupRecordString: (...a: any[]) => getDiceConfigBackupRecordString(...a),
  });

  const copyDiceConfigBackupExistingFields = createCopyDiceConfigBackupExistingFields({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
  });

  const sanitizeDiceConfigBackupValidationRule = createSanitizeDiceConfigBackupValidationRule({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    copyDiceConfigBackupExistingFields: (...a: any[]) => copyDiceConfigBackupExistingFields(...a),
    getDiceConfigBackupValidationRuleKey: (...a: any[]) => getDiceConfigBackupValidationRuleKey(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const sanitizeDiceConfigBackupRegexRule = createSanitizeDiceConfigBackupRegexRule({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    copyDiceConfigBackupExistingFields: (...a: any[]) => copyDiceConfigBackupExistingFields(...a),
    getDiceConfigBackupRegexRuleKey: (...a: any[]) => getDiceConfigBackupRegexRuleKey(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    getDEPRECATED_BUILTIN_REGEX_RULE_IDS: () => DEPRECATED_BUILTIN_REGEX_RULE_IDS,
  });

  const sanitizeDiceConfigBackupRuleList = createSanitizeDiceConfigBackupRuleList({

  });

  const sanitizeDiceConfigBackupPresetRules = createSanitizeDiceConfigBackupPresetRules({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    sanitizeDiceConfigBackupRuleList: (...a: any[]) => sanitizeDiceConfigBackupRuleList(...a),
  });

  const sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport = createSanitizeDiceConfigBackupCustomOnlyPresetArrayForExport({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupBuiltinPresetIds: (...a: any[]) => getDiceConfigBackupBuiltinPresetIds(...a),
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const sanitizeDiceConfigBackupStoredValue = createSanitizeDiceConfigBackupStoredValue({
    sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport: (...a: any[]) => sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport(...a),
    sanitizeDiceConfigBackupPresetRules: (...a: any[]) => sanitizeDiceConfigBackupPresetRules(...a),
    sanitizeDiceConfigBackupRegexRule: (...a: any[]) => sanitizeDiceConfigBackupRegexRule(...a),
    sanitizeDiceConfigBackupRuleList: (...a: any[]) => sanitizeDiceConfigBackupRuleList(...a),
    sanitizeDiceConfigBackupValidationRule: (...a: any[]) => sanitizeDiceConfigBackupValidationRule(...a),
  });

  const getDiceConfigBackupStoredValue = createGetDiceConfigBackupStoredValue({
    getConfig: (...a: any[]) => getConfig(...a),
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getDiceConfigBackupKeyStrategy: (...a: any[]) => getDiceConfigBackupKeyStrategy(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
  });

  const normalizeDiceConfigBackupGachaCatalogSnapshotRecords = createNormalizeDiceConfigBackupGachaCatalogSnapshotRecords({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    normalizeGachaCatalogRecord: (...a: any[]) => normalizeGachaCatalogRecord(...a),
  });

  const collectDiceConfigBackupGachaCatalogRecords = createCollectDiceConfigBackupGachaCatalogRecords({
    migrateGachaCatalogRecordsToGlobalScope: (...a: any[]) => migrateGachaCatalogRecordsToGlobalScope(...a),
    normalizeDiceConfigBackupGachaCatalogSnapshotRecords: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogSnapshotRecords(...a),
  });

  const collectDiceConfigBackupGachaCatalogRollbackSnapshot = createCollectDiceConfigBackupGachaCatalogRollbackSnapshot({
    normalizeDiceConfigBackupGachaCatalogSnapshotRecords: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogSnapshotRecords(...a),
  });

  const getDiceConfigBackupTableTemplateApi = createGetDiceConfigBackupTableTemplateApi({
    getCore: (...a: any[]) => getCore(...a),
  });

  const collectDiceConfigBackupTableTemplate = (): { template?: unknown; warnings: string[] } => {
    const api = getDiceConfigBackupTableTemplateApi();
    if (!api || typeof api.getTableTemplate !== 'function') {
      return { warnings: ['数据库模板 API 不可用，未备份当前表格模板。'] };
    }

    try {
      const template = api.getTableTemplate();
      if (!isDiceConfigBackupRecord(template)) {
        return { warnings: ['当前聊天没有可备份的数据库表格模板。'] };
      }
      return { template: cloneDiceConfigBackupValue(template), warnings: [] };
    } catch (error) {
      console.warn('[DICE]配置备份读取数据库表格模板失败:', error);
      const message = error instanceof Error ? error.message : String(error);
      return { warnings: [`读取当前数据库表格模板失败：${message}`] };
    }
  };

  const getDiceConfigBackupGachaCatalogItemCount = createGetDiceConfigBackupGachaCatalogItemCount({

  });

  const getDiceConfigBackupModuleResourceCount = createGetDiceConfigBackupModuleResourceCount({
    getDiceConfigBackupGachaCatalogItemCount: (...a: any[]) => getDiceConfigBackupGachaCatalogItemCount(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeDiceConfigBackupGachaCatalogResourceRecord: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogResourceRecord(...a),
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const hasDiceConfigBackupTableTemplateResource = createHasDiceConfigBackupTableTemplateResource({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    getDICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: () => DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const hasDiceConfigBackupRecoverableStorage = createHasDiceConfigBackupRecoverableStorage({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const getDiceConfigBackupModuleResourceShapeWarnings = createGetDiceConfigBackupModuleResourceShapeWarnings({
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeDiceConfigBackupGachaCatalogResourceRecord: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogResourceRecord(...a),
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const hasDiceConfigBackupLocalImageReference = createHasDiceConfigBackupLocalImageReference({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const getDiceConfigBackupModuleWarnings = createGetDiceConfigBackupModuleWarnings({
    hasDiceConfigBackupLocalImageReference: (...a: any[]) => hasDiceConfigBackupLocalImageReference(...a),
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const buildDiceConfigBackup = createBuildDiceConfigBackup({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    collectDiceConfigBackupGachaCatalogRecords: (...a: any[]) => collectDiceConfigBackupGachaCatalogRecords(...a),
    collectDiceConfigBackupTableTemplate: (...a: any[]) => collectDiceConfigBackupTableTemplate(...a),
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
    getDiceConfigBackupModuleWarnings: (...a: any[]) => getDiceConfigBackupModuleWarnings(...a),
    getDiceConfigBackupStoredValue: (...a: any[]) => getDiceConfigBackupStoredValue(...a),
    normalizeDiceConfigBackupSelectedModuleIds: (...a: any[]) => normalizeDiceConfigBackupSelectedModuleIds(...a),
    sanitizeDiceConfigBackupStoredValue: (...a: any[]) => sanitizeDiceConfigBackupStoredValue(...a),
    DICE_CONFIG_BACKUP_FORMAT: DICE_CONFIG_BACKUP_FORMAT,
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_SCHEMA_VERSION: DICE_CONFIG_BACKUP_SCHEMA_VERSION,
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const parseDiceConfigBackup = createParseDiceConfigBackup({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupModuleResourceShapeWarnings: (...a: any[]) => getDiceConfigBackupModuleResourceShapeWarnings(...a),
    isDiceConfigBackupModuleId: (...a: any[]) => isDiceConfigBackupModuleId(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    parseJsoncDocument: (...a: any[]) => parseJsoncDocument(...a),
    DICE_CONFIG_BACKUP_FORMAT: DICE_CONFIG_BACKUP_FORMAT,
    DICE_CONFIG_BACKUP_SCHEMA_VERSION: DICE_CONFIG_BACKUP_SCHEMA_VERSION,
  });

  const getDiceConfigBackupValueIdentity = createGetDiceConfigBackupValueIdentity({

  });

  const isDiceConfigBackupSameValue = createIsDiceConfigBackupSameValue({

  });

  const mergeDiceConfigBackupSetArray = createMergeDiceConfigBackupSetArray({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupValueIdentity: (...a: any[]) => getDiceConfigBackupValueIdentity(...a),
  });

  const getDiceConfigBackupPresetRecordId = createGetDiceConfigBackupPresetRecordId({

  });

  const getDiceConfigBackupPresetRecordName = createGetDiceConfigBackupPresetRecordName({

  });

  const mergeDiceConfigBackupPresetArray = createMergeDiceConfigBackupPresetArray({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupBuiltinPresetIds: (...a: any[]) => getDiceConfigBackupBuiltinPresetIds(...a),
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    getDiceConfigBackupPresetRecordName: (...a: any[]) => getDiceConfigBackupPresetRecordName(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const mergeDiceConfigBackupCustomOnlyPresetArray = createMergeDiceConfigBackupCustomOnlyPresetArray({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupBuiltinPresetIds: (...a: any[]) => getDiceConfigBackupBuiltinPresetIds(...a),
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    getDiceConfigBackupPresetRecordName: (...a: any[]) => getDiceConfigBackupPresetRecordName(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS: STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
  });

  const getDiceConfigBackupRuleRecords = createGetDiceConfigBackupRuleRecords({

  });

  const buildDiceConfigBackupRuleOverrideMap = createBuildDiceConfigBackupRuleOverrideMap({

  });

  const applyDiceConfigBackupRuleOverrides = createApplyDiceConfigBackupRuleOverrides({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    copyDiceConfigBackupExistingFields: (...a: any[]) => copyDiceConfigBackupExistingFields(...a),
  });

  const mergeDiceConfigBackupCustomRules = createMergeDiceConfigBackupCustomRules({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
  });

  const mergeDiceConfigBackupValidationRules = createMergeDiceConfigBackupValidationRules({
    applyDiceConfigBackupRuleOverrides: (...a: any[]) => applyDiceConfigBackupRuleOverrides(...a),
    buildDiceConfigBackupRuleOverrideMap: (...a: any[]) => buildDiceConfigBackupRuleOverrideMap(...a),
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupRuleRecords: (...a: any[]) => getDiceConfigBackupRuleRecords(...a),
    getDiceConfigBackupValidationRuleKey: (...a: any[]) => getDiceConfigBackupValidationRuleKey(...a),
    mergeDiceConfigBackupCustomRules: (...a: any[]) => mergeDiceConfigBackupCustomRules(...a),
    sanitizeDiceConfigBackupValidationRule: (...a: any[]) => sanitizeDiceConfigBackupValidationRule(...a),
  });

  const mergeDiceConfigBackupRegexRules = createMergeDiceConfigBackupRegexRules({
    applyDiceConfigBackupRuleOverrides: (...a: any[]) => applyDiceConfigBackupRuleOverrides(...a),
    buildDiceConfigBackupRuleOverrideMap: (...a: any[]) => buildDiceConfigBackupRuleOverrideMap(...a),
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupRegexRuleKey: (...a: any[]) => getDiceConfigBackupRegexRuleKey(...a),
    getDiceConfigBackupRuleRecords: (...a: any[]) => getDiceConfigBackupRuleRecords(...a),
    mergeDiceConfigBackupCustomRules: (...a: any[]) => mergeDiceConfigBackupCustomRules(...a),
    sanitizeDiceConfigBackupRegexRule: (...a: any[]) => sanitizeDiceConfigBackupRegexRule(...a),
  });

  const getDiceConfigBackupSafeCurrentPresets = createGetDiceConfigBackupSafeCurrentPresets({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getPresetManager: () => PresetManager,
    getRegexPresetManager: () => RegexPresetManager,
  });

  const mergeDiceConfigBackupPresetArraySafely = createMergeDiceConfigBackupPresetArraySafely({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupBuiltinPresetIds: (...a: any[]) => getDiceConfigBackupBuiltinPresetIds(...a),
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    getDiceConfigBackupPresetRecordName: (...a: any[]) => getDiceConfigBackupPresetRecordName(...a),
    getDiceConfigBackupSafeCurrentPresets: (...a: any[]) => getDiceConfigBackupSafeCurrentPresets(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    mergeDiceConfigBackupRegexRules: (...a: any[]) => mergeDiceConfigBackupRegexRules(...a),
    mergeDiceConfigBackupValidationRules: (...a: any[]) => mergeDiceConfigBackupValidationRules(...a),
    STORAGE_KEY_PRESETS: STORAGE_KEY_PRESETS,
  });

  const normalizeDiceConfigBackupGachaPoolSettings = createNormalizeDiceConfigBackupGachaPoolSettings({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeGachaPoolDefinition: (...a: any[]) => normalizeGachaPoolDefinition(...a),
  });

  const mergeDiceConfigBackupGachaPoolSettings = createMergeDiceConfigBackupGachaPoolSettings({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    isBuiltinGachaPoolId: (...a: any[]) => isBuiltinGachaPoolId(...a),
    normalizeDiceConfigBackupGachaPoolSettings: (...a: any[]) => normalizeDiceConfigBackupGachaPoolSettings(...a),
  });

  const normalizeDiceConfigBackupGachaItemSettings = createNormalizeDiceConfigBackupGachaItemSettings({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
  });

  const mergeDiceConfigBackupGachaItemSettings = createMergeDiceConfigBackupGachaItemSettings({
    normalizeDiceConfigBackupGachaItemSettings: (...a: any[]) => normalizeDiceConfigBackupGachaItemSettings(...a),
  });

  const remapDiceConfigBackupGachaItemSettings = createRemapDiceConfigBackupGachaItemSettings({
    normalizeDiceConfigBackupGachaItemSettings: (...a: any[]) => normalizeDiceConfigBackupGachaItemSettings(...a),
  });

  const getDiceConfigBackupBuiltinPresetIds = createGetDiceConfigBackupBuiltinPresetIds({
    getBUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS: () => BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
    getDASHBOARD_DEFAULT_PRESET_ID: () => DASHBOARD_DEFAULT_PRESET_ID,
    getRENDER_DEFAULT_PRESET_ID: () => RENDER_DEFAULT_PRESET_ID,
  });

  const getDiceConfigBackupKnownPresetIds = createGetDiceConfigBackupKnownPresetIds({
    getDiceConfigBackupBuiltinPresetIds: (...a: any[]) => getDiceConfigBackupBuiltinPresetIds(...a),
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const setDiceConfigBackupValue = createSetDiceConfigBackupValue({
    getDiceConfigBackupKeyStrategy: (...a: any[]) => getDiceConfigBackupKeyStrategy(...a),
  });

  const applyDiceConfigBackupValue = createApplyDiceConfigBackupValue({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupKeyStrategy: (...a: any[]) => getDiceConfigBackupKeyStrategy(...a),
    getDiceConfigBackupRuleRecords: (...a: any[]) => getDiceConfigBackupRuleRecords(...a),
    getDiceConfigBackupValidationRuleKey: (...a: any[]) => getDiceConfigBackupValidationRuleKey(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    isDiceConfigBackupSameValue: (...a: any[]) => isDiceConfigBackupSameValue(...a),
    mergeDiceConfigBackupCustomOnlyPresetArray: (...a: any[]) => mergeDiceConfigBackupCustomOnlyPresetArray(...a),
    mergeDiceConfigBackupCustomRules: (...a: any[]) => mergeDiceConfigBackupCustomRules(...a),
    mergeDiceConfigBackupGachaItemSettings: (...a: any[]) => mergeDiceConfigBackupGachaItemSettings(...a),
    mergeDiceConfigBackupGachaPoolSettings: (...a: any[]) => mergeDiceConfigBackupGachaPoolSettings(...a),
    mergeDiceConfigBackupPresetArray: (...a: any[]) => mergeDiceConfigBackupPresetArray(...a),
    mergeDiceConfigBackupPresetArraySafely: (...a: any[]) => mergeDiceConfigBackupPresetArraySafely(...a),
    mergeDiceConfigBackupRegexRules: (...a: any[]) => mergeDiceConfigBackupRegexRules(...a),
    mergeDiceConfigBackupSetArray: (...a: any[]) => mergeDiceConfigBackupSetArray(...a),
    sanitizeDiceConfigBackupStoredValue: (...a: any[]) => sanitizeDiceConfigBackupStoredValue(...a),
    sanitizeDiceConfigBackupValidationRule: (...a: any[]) => sanitizeDiceConfigBackupValidationRule(...a),
    setDiceConfigBackupValue: (...a: any[]) => setDiceConfigBackupValue(...a),
    BUILTIN_VALIDATION_RULES: BUILTIN_VALIDATION_RULES,
    STORAGE_KEY_PRESETS: STORAGE_KEY_PRESETS,
    STORAGE_KEY_REGEX_PRESETS: STORAGE_KEY_REGEX_PRESETS,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
    STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS: STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
    STORAGE_KEY_VALIDATION_RULES: STORAGE_KEY_VALIDATION_RULES,
  });

  const applyDiceConfigBackupActiveValue = createApplyDiceConfigBackupActiveValue({
    applyDiceConfigBackupValue: (...a: any[]) => applyDiceConfigBackupValue(...a),
    getDiceConfigBackupKnownPresetIds: (...a: any[]) => getDiceConfigBackupKnownPresetIds(...a),
    CUSTOM_ROLL_MODE: CUSTOM_ROLL_MODE,
    DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY: DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY,
  });
  return { DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY, DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY, DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY, applyDiceConfigBackupActiveValue, applyDiceConfigBackupValue, buildDiceConfigBackup, buildDiceConfigBackupTableOrder, cloneDiceConfigBackupValue, collectDiceConfigBackupGachaCatalogRollbackSnapshot, getDiceConfigBackupModuleDefinition, getDiceConfigBackupModuleResourceCount, getDiceConfigBackupPresetRecordId, getDiceConfigBackupRecordString, getDiceConfigBackupTableTemplateApi, getDiceConfigBackupWarningCount, hasDiceConfigBackupRecoverableStorage, hasDiceConfigBackupTableTemplateResource, isDiceConfigBackupRecord, normalizeDiceConfigBackupGachaItemSettings, normalizeDiceConfigBackupSelectedModuleIds, parseDiceConfigBackup, remapDiceConfigBackupGachaItemSettings, showDiceConfigBackupPrivacyConfirm };
}
