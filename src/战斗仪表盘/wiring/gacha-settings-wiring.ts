/**
 * wiring / gacha-settings-wiring.ts — 抽卡设置/配置装配簇（从 index.ts 迁出，x4-i）。
 */
import { createAddGachaShards } from '../features/gacha/add-gacha-shards';
import type { GachaItemDefinition, GachaPoolTag, GachaRewardTarget, GachaRewardTargetColumns } from '../entities/gacha-items';
import { createAnalyzeGachaCatalogImport } from '../features/gacha/analyze-gacha-catalog-import';
import { createApplyGachaCatalogImport } from '../features/gacha/apply-gacha-catalog-import';
import { createAssertSaveStoredGachaStateSnapshot } from '../features/gacha/assert-save-stored-gacha-state-snapshot';
import { createBuildDefaultGachaPoolDefinition } from '../features/gacha/build-default-gacha-pool-definition';
import { createBuildGachaCatalogTemplateJsonc } from '../features/gacha/build-gacha-catalog-template-jsonc';
import { createBuildGachaDiceEventSettlementKey } from '../features/gacha/build-gacha-dice-event-settlement-key';
import { createBuildGachaInventoryMetaRecord } from '../features/gacha/build-gacha-inventory-meta-record';
import { createBuildStableGachaCustomItemId } from '../features/gacha/build-stable-gacha-custom-item-id';
import { createCanDeleteGachaPoolDefinition } from '../features/gacha/can-delete-gacha-pool-definition';
import { createClearGlobalGachaCatalog } from '../features/gacha/clear-global-gacha-catalog';
import { createCloneGachaCatalogItems } from '../features/gacha/clone-gacha-catalog-items';
import { createCloneGachaPoolDefinitions } from '../features/gacha/clone-gacha-pool-definitions';
import { createCollectGachaLocalStorageSnapshot } from '../features/gacha/collect-gacha-local-storage-snapshot';
import { createCollectGachaPoolTagsFromItems } from '../features/gacha/collect-gacha-pool-tags-from-items';
import { createCompareGachaItemDefinitionsForDisplay } from '../features/gacha/compare-gacha-item-definitions-for-display';
import { createCreateDefaultGachaState } from '../features/gacha/create-default-gacha-state';
import { createCreateEmptyGachaCatalog } from '../features/gacha/create-empty-gacha-catalog';
import { createCreateUniqueGachaItemId } from '../features/gacha/create-unique-gacha-item-id';
import { createDefaultGachaSettingsItemFilters } from '../features/gacha/default-gacha-settings-item-filters';
import { createDeleteGachaItemSetting } from '../features/gacha/delete-gacha-item-setting';
import { createDownloadGachaCatalogJson } from '../features/gacha/download-gacha-catalog-json';
import { createEnsureGachaCatalogLoaded } from '../features/gacha/ensure-gacha-catalog-loaded';
import { createEnsureGachaPoolsForTags } from '../features/gacha/ensure-gacha-pools-for-tags';
import { createExportGachaCatalogJson } from '../features/gacha/export-gacha-catalog-json';
import { createFormatGachaCatalogImportErrors } from '../features/gacha/format-gacha-catalog-import-errors';
import { createFormatGachaCatalogImportStatsText } from '../features/gacha/format-gacha-catalog-import-stats-text';
import { createFormatGachaItemCardMeta } from '../features/gacha/format-gacha-item-card-meta';
import { createFormatGachaPoolTags } from '../features/gacha/format-gacha-pool-tags';
import { createFormatGachaRewardDestinationLabel } from '../features/gacha/format-gacha-reward-destination-label';
import { createShowGachaCatalogClearDialog } from '../features/gacha/gacha-catalog-clear-dialog';
import { createShowGachaCatalogImportConfirm } from '../features/gacha/gacha-catalog-import-confirm';
import { createGachaCommonWrittenTargetColumnKeys } from '../features/gacha/gacha-common-written-target-column-keys';
import { createGachaCustomFieldReservedKeys } from '../features/gacha/gacha-custom-field-reserved-keys';
import { createGachaEquipmentWrittenTargetColumnKeys } from '../features/gacha/gacha-equipment-written-target-column-keys';
import { GACHA_REWARD_FIELD_LIMITS } from '../features/gacha/gacha-helpers';
import { createShowGachaSaveError } from '../features/gacha/gacha-save-error';
import { createGachaSettingsSortOptions } from '../features/gacha/gacha-settings-sort-options';
import { createGachaSettingsSourceFilterOptions } from '../features/gacha/gacha-settings-source-filter-options';
import { createGachaSettingsStatusFilterOptions } from '../features/gacha/gacha-settings-status-filter-options';
import { createGachaStateCoreInstance } from '../features/gacha/gacha-state-core-instance';
import { createGachaStoreInstance } from '../features/gacha/gacha-store-instance';
import { createGachaTargetColumnKeys } from '../features/gacha/gacha-target-column-keys';
import { createGachaTargetColumnLabels } from '../features/gacha/gacha-target-column-labels';
import { GachaCatalogCache, GachaCatalogLoadTask } from '../features/gacha/gacha-types';
import { createGetActiveGachaPoolTags } from '../features/gacha/get-active-gacha-pool-tags';
import { createGetAllGachaItemDefinitions } from '../features/gacha/get-all-gacha-item-definitions';
import { createGetAllGachaPoolConfigDefinitions } from '../features/gacha/get-all-gacha-pool-config-definitions';
import { createGetAvailableGachaRewardTargets } from '../features/gacha/get-available-gacha-reward-targets';
import { createGetConfiguredGachaPoolDefinitions } from '../features/gacha/get-configured-gacha-pool-definitions';
import { createGetCustomGachaItemDefinitions } from '../features/gacha/get-custom-gacha-item-definitions';
import { createGetGachaActivePoolTag } from '../features/gacha/get-gacha-active-pool-tag';
import { createGetGachaAllExpandablePoolTags } from '../features/gacha/get-gacha-all-expandable-pool-tags';
import { createGetGachaCatalogImportFailureMessage } from '../features/gacha/get-gacha-catalog-import-failure-message';
import { createGetGachaCatalogItemMergeTimestamp } from '../features/gacha/get-gacha-catalog-item-merge-timestamp';
import { createGetGachaCatalogItemsForExport } from '../features/gacha/get-gacha-catalog-items-for-export';
import { createGetGachaCatalogRecordMergeTimestamp } from '../features/gacha/get-gacha-catalog-record-merge-timestamp';
import { createGetGachaCatalogScopeKey } from '../features/gacha/get-gacha-catalog-scope-key';
import { createGetGachaChatIdSeed } from '../features/gacha/get-gacha-chat-id-seed';
import { createGetGachaCustomFieldEntries } from '../features/gacha/get-gacha-custom-field-entries';
import { createGetGachaCustomFieldsSearchText } from '../features/gacha/get-gacha-custom-fields-search-text';
import { createGetGachaDiceEventDetail } from '../features/gacha/get-gacha-dice-event-detail';
import { createGetGachaItemDefinitionFingerprint } from '../features/gacha/get-gacha-item-definition-fingerprint';
import { createGetGachaItemDescriptionText } from '../features/gacha/get-gacha-item-description-text';
import { createGetGachaItemEffectText } from '../features/gacha/get-gacha-item-effect-text';
import { createGetGachaItemTagsText } from '../features/gacha/get-gacha-item-tags-text';
import { createGetGachaLocalDateKey } from '../features/gacha/get-gacha-local-date-key';
import { createGetGachaMinimumRarity } from '../features/gacha/get-gacha-minimum-rarity';
import { createGetGachaNamedCustomField } from '../features/gacha/get-gacha-named-custom-field';
import { createGetGachaPickupItems } from '../features/gacha/get-gacha-pickup-items';
import { createGetGachaPickupRotationKey } from '../features/gacha/get-gacha-pickup-rotation-key';
import { createGetGachaPoolDefinitions } from '../features/gacha/get-gacha-pool-definitions';
import { createGetGachaPoolDefinitionsWithVirtualTags } from '../features/gacha/get-gacha-pool-definitions-with-virtual-tags';
import { createGetGachaPoolDisplayName } from '../features/gacha/get-gacha-pool-display-name';
import { createGetGachaRarityIconClass } from '../features/gacha/get-gacha-rarity-icon-class';
import { createGetGachaRarityRank } from '../features/gacha/get-gacha-rarity-rank';
import { createGetGachaRewardParseResult } from '../features/gacha/get-gacha-reward-parse-result';
import { createGetGachaRewardParseResultForItem } from '../features/gacha/get-gacha-reward-parse-result-for-item';
import { createGetGachaRewardTargetOptions } from '../features/gacha/get-gacha-reward-target-options';
import { createGetGachaRewardTargetTableLabel } from '../features/gacha/get-gacha-reward-target-table-label';
import { createGetGachaShardLabel } from '../features/gacha/get-gacha-shard-label';
import { createGetGachaState } from '../features/gacha/get-gacha-state';
import { createGetGachaStateMigrationKey } from '../features/gacha/get-gacha-state-migration-key';
import { createGetGachaStateStorageKey } from '../features/gacha/get-gacha-state-storage-key';
import { createGetGachaTargetColumnEntries } from '../features/gacha/get-gacha-target-column-entries';
import { createGetInventoryDefaultMetaRecord } from '../features/gacha/get-inventory-default-meta-record';
import { createGetInventoryFilters } from '../features/gacha/get-inventory-filters';
import { createGetInventoryFiltersCollapsedState } from '../features/gacha/get-inventory-filters-collapsed-state';
import { createGetLegacyGachaStateFromRawData } from '../features/gacha/get-legacy-gacha-state-from-raw-data';
import { createGetRuntimeGachaRawData } from '../features/gacha/get-runtime-gacha-raw-data';
import { createGetStoredGachaActivePoolTag } from '../features/gacha/get-stored-gacha-active-pool-tag';
import { createGetStoredGachaCatalog } from '../features/gacha/get-stored-gacha-catalog';
import { createGetStoredGachaItemSettings } from '../features/gacha/get-stored-gacha-item-settings';
import { createGetStoredGachaPoolSettings } from '../features/gacha/get-stored-gacha-pool-settings';
import { createGetStoredGachaStateSnapshot } from '../features/gacha/get-stored-gacha-state-snapshot';
import { createGetVisibleGachaPoolConfigDefinitions } from '../features/gacha/get-visible-gacha-pool-config-definitions';
import { createHasGachaCustomFields } from '../features/gacha/has-gacha-custom-fields';
import { createHasGachaRewardTable } from '../features/gacha/has-gacha-reward-table';
import { createHasGachaRewardTableForItem } from '../features/gacha/has-gacha-reward-table-for-item';
import { createHasMigratedLegacyGachaState } from '../features/gacha/has-migrated-legacy-gacha-state';
import { createHashGachaCatalogSeed } from '../features/gacha/hash-gacha-catalog-seed';
import { createHashGachaSeed } from '../features/gacha/hash-gacha-seed';
import { createImportGachaCatalogJsonFromFile } from '../features/gacha/import-gacha-catalog-json-from-file';
import { createInferEquipmentTableTypeForGachaItem } from '../features/gacha/infer-equipment-table-type';
import { createInventoryQualityFilterMeta } from '../features/gacha/inventory-quality-filter-meta';
import { createInventoryTypeFilterMeta } from '../features/gacha/inventory-type-filter-meta';
import { createIsBuiltinGachaPoolId } from '../features/gacha/is-builtin-gacha-pool-id';
import { createIsGachaFieldAlias } from '../features/gacha/is-gacha-field-alias';
import { createIsGachaItemEnabled } from '../features/gacha/is-gacha-item-enabled';
import { createIsGachaPickupItem } from '../features/gacha/is-gacha-pickup-item';
import { createIsGachaPoolEnabled } from '../features/gacha/is-gacha-pool-enabled';
import { createIsGachaRarity } from '../features/gacha/is-gacha-rarity';
import { createMarkLegacyGachaStateMigrated } from '../features/gacha/mark-legacy-gacha-state-migrated';
import { createMergeGachaCatalogRecordsToGlobalScope } from '../features/gacha/merge-gacha-catalog-records';
import { createMergeImportedGachaPools } from '../features/gacha/merge-imported-gacha-pools';
import { createMigrateGachaCatalogRecordsToGlobalScope } from '../features/gacha/migrate-gacha-catalog-records-to-global-scope';
import { createNormalizeGachaCatalogRecord } from '../features/gacha/normalize-gacha-catalog-record';
import { createNormalizeGachaCustomFields } from '../features/gacha/normalize-gacha-custom-fields';
import { createNormalizeGachaFieldAlias } from '../features/gacha/normalize-gacha-field-alias';
import { createNormalizeGachaItemEnabled } from '../features/gacha/normalize-gacha-item-enabled';
import { createNormalizeGachaItemOrder } from '../features/gacha/normalize-gacha-item-order';
import { createNormalizeGachaPoolDefinition } from '../features/gacha/normalize-gacha-pool-definition';
import { createNormalizeGachaRewardTarget } from '../features/gacha/normalize-gacha-reward-target';
import { createNormalizeGachaStateRecord } from '../features/gacha/normalize-gacha-state-record';
import { createNormalizeGachaTargetColumns } from '../features/gacha/normalize-gacha-target-columns';
import { createNormalizeGachaTargetTable } from '../features/gacha/normalize-gacha-target-table';
import { createNormalizeGachaTimestamp } from '../features/gacha/normalize-gacha-timestamp';
import { createNormalizeImportedGachaItem } from '../features/gacha/normalize-imported-gacha-item';
import { createNormalizeImportedGachaPoolTags } from '../features/gacha/normalize-imported-gacha-pool-tags';
import { createNormalizeImportedGachaPools } from '../features/gacha/normalize-imported-gacha-pools';
import { createNormalizeRecentGachaRewards } from '../features/gacha/normalize-recent-gacha-rewards';
import { createNormalizeScopedGachaCatalogRecord } from '../features/gacha/normalize-scoped-gacha-catalog-record';
import { createNormalizeShardWallet } from '../features/gacha/normalize-shard-wallet';
import { createPersistRawDataWithGacha } from '../features/gacha/persist-raw-data-with-gacha';
import { createPickGachaItemDefinition } from '../features/gacha/pick-gacha-item-definition';
import { createPickGachaRarity } from '../features/gacha/pick-gacha-rarity';
import { createPickWeightedValue } from '../features/gacha/pick-weighted-value';
import { createRecordGachaFortuneGain } from '../features/gacha/record-gacha-fortune-gain';
import { createRenderGachaCustomFieldsDetailsHtml } from '../features/gacha/render-gacha-custom-fields-details-html';
import { createRenderGachaCustomFieldsPreviewHtml } from '../features/gacha/render-gacha-custom-fields-preview-html';
import { createResolveEquipmentTableTypeForGachaItem } from '../features/gacha/resolve-equipment-table-type-for-gacha-item';
import { createRestoreGachaLocalStorageSnapshot } from '../features/gacha/restore-gacha-local-storage-snapshot';
import { createSaveGachaItemSettingsRecord } from '../features/gacha/save-gacha-item-settings-record';
import { createSaveGachaPoolSettings } from '../features/gacha/save-gacha-pool-settings';
import { createSaveInventoryFilters } from '../features/gacha/save-inventory-filters';
import { createSaveInventoryFiltersCollapsedState } from '../features/gacha/save-inventory-filters-collapsed-state';
import { createSaveStoredGachaActivePoolTag } from '../features/gacha/save-stored-gacha-active-pool-tag';
import { createSaveStoredGachaCatalog } from '../features/gacha/save-stored-gacha-catalog';
import { createSaveStoredGachaStateSnapshot } from '../features/gacha/save-stored-gacha-state-snapshot';
import { createSerializeGachaCatalogItemForExport } from '../features/gacha/serialize-gacha-catalog-item-for-export';
import { buildGachaExportNamePartImpl as buildGachaExportNamePart, createSerializeGachaPoolDefinitionForExport } from '../features/gacha/serialize-gacha-pool-definition-for-export';
import { createSetEquipmentRowBasicFields } from '../features/gacha/set-equipment-row-basic-fields';
import { createSetGachaItemOrder } from '../features/gacha/set-gacha-item-order';
import { createSetGachaPoolOrder } from '../features/gacha/set-gacha-pool-order';
import { createSetInventoryRowBasicFields } from '../features/gacha/set-inventory-row-basic-fields';
import { createSettleGachaFortuneForDiceEvent } from '../features/gacha/settle-gacha-fortune-for-dice-event';
import { createSortGachaPoolDefinitions } from '../features/gacha/sort-gacha-pool-definitions';
import { createTouchGachaActivity } from '../features/gacha/touch-gacha-activity';
import { createTruncateGachaText } from '../features/gacha/truncate-gacha-text';
import { createUpdateGachaItemSetting } from '../features/gacha/update-gacha-item-setting';
import { createUpdateGachaPoolConfig } from '../features/gacha/update-gacha-pool-config';
import { createValidateGachaCatalogImportItemTarget } from '../features/gacha/validate-gacha-catalog-import-item-target';
import { createWithGachaItemSettings } from '../features/gacha/with-gacha-item-settings';
import { createBuildAdvancedPresetAgentPrompt } from '../features/presets/build-advanced-preset-agent-prompt';
import { createBuildCrudColumnAliasMap } from '../features/table/build-crud-column-alias-map';
import { createGetInventoryPanelTarget } from '../features/table/get-inventory-panel-target';
import { createSaveInventoryPanelTarget } from '../features/table/save-inventory-panel-target';
import { createGetObjectRecord } from '../shared/get-object-record';
import { STORAGE_KEY_GACHA_ITEM_SETTINGS, STORAGE_KEY_GACHA_POOL_SETTINGS } from '../shared/storage-keys';
import { createBindCompositionSafeSearchInput } from '../shared/ui/bind-composition-safe-search-input';

export function createGachaSettingsWiring(deps: any) {
  const { GACHA_CATALOG_GLOBAL_SCOPE_KEY, GACHA_TEST_DEFAULT_FORTUNE, INVENTORY_QUALITY_OPTIONS, INVENTORY_SORT_OPTIONS, INVENTORY_TYPE_OPTIONS, addCrudColumnAlias, applyGachaCustomFieldsToRow, assertCrudEnumConstraints, assertCrudInsertRequiredCells, assertCrudLengthConstraints, assertCrudRequiredColumnsRepresented, buildCrudEnumConstraintMap, cloneDiceConfigBackupValue, downloadJsonFile, downloadJsoncFile, escapeHtml, getConfig, getCore, getCrudColumnNameForHeader, getCrudSheetDdl, getCrudSqlCommentAliases, getCurrentContextFingerprint, getDbChatMessages, getInventoryGlobalContext, getInventoryMetadataForItem, getJsonLikeErrorMessage, getRuntimeErrorMessage, getTableData, hasSheetKeys, parseCrudColumnDefinitionLine, parseEquipmentItems, parseInventoryItems, parseJsoncValue, performSaveDataOnly, pickTextFile, refreshGachaShardShop, refreshGachaVisualization, runInSaveQueue, setupOverlayClose, showGachaSettingsDialog, stripCrudSqlNonStructuralComments, validateGachaCustomFieldsForTargetTable, cachedRawData_ACC, lastHumanInputActivityAt_ACC } = deps;
  const DEFAULT_GACHA_SETTINGS_ITEM_FILTERS = createDefaultGachaSettingsItemFilters({

  });
  const GACHA_SETTINGS_SOURCE_FILTER_OPTIONS = createGachaSettingsSourceFilterOptions({

  });
  const GACHA_SETTINGS_STATUS_FILTER_OPTIONS = createGachaSettingsStatusFilterOptions({

  });
  const GACHA_SETTINGS_SORT_OPTIONS = createGachaSettingsSortOptions({

  });
  const INVENTORY_TYPE_FILTER_META = createInventoryTypeFilterMeta({

  });
  const INVENTORY_QUALITY_FILTER_META = createInventoryQualityFilterMeta({

  });

  const getInventoryFilters = createGetInventoryFilters({
    getINVENTORY_TYPE_OPTIONS: () => INVENTORY_TYPE_OPTIONS,
    getINVENTORY_QUALITY_OPTIONS: () => INVENTORY_QUALITY_OPTIONS,
    getINVENTORY_SORT_OPTIONS: () => INVENTORY_SORT_OPTIONS,
    getInventoryPanelTarget: (...a: any[]) => getInventoryPanelTarget(...a),
  });

  const saveInventoryFilters = createSaveInventoryFilters({
    getInventoryFilters: (...a: any[]) => getInventoryFilters(...a),
    getInventoryPanelTarget: (...a: any[]) => getInventoryPanelTarget(...a),
  });

  const getInventoryFiltersCollapsedState = createGetInventoryFiltersCollapsedState({

  });
  const getInventoryPanelTarget = createGetInventoryPanelTarget({
  });
  const saveInventoryPanelTarget = createSaveInventoryPanelTarget({
  });
  const saveInventoryFiltersCollapsedState = createSaveInventoryFiltersCollapsedState({

  });

  const bindCompositionSafeSearchInput = createBindCompositionSafeSearchInput({

  });


  const isBuiltinGachaPoolId = createIsBuiltinGachaPoolId({

  });

  const canDeleteGachaPoolDefinition = createCanDeleteGachaPoolDefinition({

  });

  const cloneGachaPoolDefinitions = createCloneGachaPoolDefinitions({

  });

  const buildDefaultGachaPoolDefinition = createBuildDefaultGachaPoolDefinition({

  });

  const normalizeGachaPoolDefinition = createNormalizeGachaPoolDefinition({
    isBuiltinGachaPoolId: (...a: any[]) => isBuiltinGachaPoolId(...a),
  });

  const getStoredGachaPoolSettings = createGetStoredGachaPoolSettings({
    normalizeGachaPoolDefinition: (...a: any[]) => normalizeGachaPoolDefinition(...a),
  });

  const saveGachaPoolSettings = createSaveGachaPoolSettings({
    cloneGachaPoolDefinitions: (...a: any[]) => cloneGachaPoolDefinitions(...a),
  });

  const sortGachaPoolDefinitions = createSortGachaPoolDefinitions({

  });

  const getConfiguredGachaPoolDefinitions = createGetConfiguredGachaPoolDefinitions({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    getStoredGachaPoolSettings: (...a: any[]) => getStoredGachaPoolSettings(...a),
    sortGachaPoolDefinitions: (...a: any[]) => sortGachaPoolDefinitions(...a),
  });

  const getRuntimeGachaRawData = createGetRuntimeGachaRawData({
    getTableData: (...a: any[]) => getTableData(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });
  const getGachaCatalogScopeKey = createGetGachaCatalogScopeKey({
    getGACHA_CATALOG_GLOBAL_SCOPE_KEY: () => GACHA_CATALOG_GLOBAL_SCOPE_KEY,
  });

  const buildCrudColumnAliasMap = createBuildCrudColumnAliasMap({
    addCrudColumnAlias: (...a: any[]) => addCrudColumnAlias(...a),
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    getCrudSqlCommentAliases: (...a: any[]) => getCrudSqlCommentAliases(...a),
    parseCrudColumnDefinitionLine: (...a: any[]) => parseCrudColumnDefinitionLine(...a),
    stripCrudSqlNonStructuralComments: (...a: any[]) => stripCrudSqlNonStructuralComments(...a),
  });
  const buildAdvancedPresetAgentPrompt = createBuildAdvancedPresetAgentPrompt({

  });
  const collectGachaPoolTagsFromItems = createCollectGachaPoolTagsFromItems({
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const ensureGachaPoolsForTags = createEnsureGachaPoolsForTags({
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    getGachaPoolDefinitionsWithVirtualTags: (...a: any[]) => getGachaPoolDefinitionsWithVirtualTags(...a),
    saveGachaPoolSettings: (...a: any[]) => saveGachaPoolSettings(...a),
  });

  const getGachaPoolDefinitionsWithVirtualTags = createGetGachaPoolDefinitionsWithVirtualTags({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    cloneGachaPoolDefinitions: (...a: any[]) => cloneGachaPoolDefinitions(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    sortGachaPoolDefinitions: (...a: any[]) => sortGachaPoolDefinitions(...a),
  });

  const getAllGachaPoolConfigDefinitions = createGetAllGachaPoolConfigDefinitions({
    collectGachaPoolTagsFromItems: (...a: any[]) => collectGachaPoolTagsFromItems(...a),
    getGachaPoolDefinitionsWithVirtualTags: (...a: any[]) => getGachaPoolDefinitionsWithVirtualTags(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const isGachaPoolEnabled = createIsGachaPoolEnabled({

  });

  const getVisibleGachaPoolConfigDefinitions = createGetVisibleGachaPoolConfigDefinitions({
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    isGachaPoolEnabled: (...a: any[]) => isGachaPoolEnabled(...a),
  });

  const getGachaAllExpandablePoolTags = createGetGachaAllExpandablePoolTags({
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    isGachaPoolEnabled: (...a: any[]) => isGachaPoolEnabled(...a),
  });

  const getGachaPoolDisplayName = createGetGachaPoolDisplayName({
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const formatGachaPoolTags = createFormatGachaPoolTags({
    getGachaPoolDisplayName: (...a: any[]) => getGachaPoolDisplayName(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const updateGachaPoolConfig = createUpdateGachaPoolConfig({
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    saveGachaPoolSettings: (...a: any[]) => saveGachaPoolSettings(...a),
  });

  const setGachaPoolOrder = createSetGachaPoolOrder({
    updateGachaPoolConfig: (...a: any[]) => updateGachaPoolConfig(...a),
  });
  const normalizeGachaItemEnabled = createNormalizeGachaItemEnabled({

  });

  const normalizeGachaItemOrder = createNormalizeGachaItemOrder({

  });

  const normalizeGachaRewardTarget = createNormalizeGachaRewardTarget({

  });

  const getGachaRewardFieldLimits = (target: GachaRewardTarget): { name: number; description: number } =>
    GACHA_REWARD_FIELD_LIMITS[normalizeGachaRewardTarget(target)];

  const truncateGachaText = createTruncateGachaText({

  });

  const normalizeGachaTargetTable = createNormalizeGachaTargetTable({
    truncateGachaText: (...a: any[]) => truncateGachaText(...a),
    getGACHA_TARGET_TABLE_MAX_LENGTH: () => GACHA_TARGET_TABLE_MAX_LENGTH,
  });

  const normalizeGachaTargetColumns = createNormalizeGachaTargetColumns({
    truncateGachaText: (...a: any[]) => truncateGachaText(...a),
    getGACHA_TARGET_COLUMN_KEYS: () => GACHA_TARGET_COLUMN_KEYS,
    getGACHA_TARGET_COLUMN_VALUE_MAX_LENGTH: () => GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH,
  });

  const getGachaTargetColumnEntries = createGetGachaTargetColumnEntries({
    getGACHA_TARGET_COLUMN_KEYS: () => GACHA_TARGET_COLUMN_KEYS,
  });

  const GACHA_CUSTOM_FIELD_MAX_COUNT = 20;
  const GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH = 30;
  const GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH = 500;
  const GACHA_TARGET_TABLE_MAX_LENGTH = 60;
  const GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH = 30;
  const GACHA_TARGET_COLUMN_KEYS = createGachaTargetColumnKeys({

  });
  const GACHA_TARGET_COLUMN_LABELS = createGachaTargetColumnLabels({

  });
  const GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS = createGachaCommonWrittenTargetColumnKeys({

  });
  const GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS = createGachaEquipmentWrittenTargetColumnKeys({
    getGACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS: () => GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS,
  });
  const GACHA_CUSTOM_FIELD_RESERVED_KEYS = createGachaCustomFieldReservedKeys({

  });

  const normalizeGachaCustomFields = createNormalizeGachaCustomFields({
    truncateGachaText: (...a: any[]) => truncateGachaText(...a),
    getGACHA_CUSTOM_FIELD_KEY_MAX_LENGTH: () => GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH,
    getGACHA_CUSTOM_FIELD_MAX_COUNT: () => GACHA_CUSTOM_FIELD_MAX_COUNT,
    getGACHA_CUSTOM_FIELD_RESERVED_KEYS: () => GACHA_CUSTOM_FIELD_RESERVED_KEYS,
    getGACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH: () => GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH,
  });

  const hasGachaCustomFields = createHasGachaCustomFields({

  });

  const getGachaCustomFieldEntries = createGetGachaCustomFieldEntries({

  });

  const GACHA_TAG_FIELD_ALIASES = ['标签', '标记', '词条'] as const;
  const GACHA_EFFECT_FIELD_ALIASES = ['效果', '作用', '能力', '特效'] as const;
  const normalizeGachaFieldAlias = createNormalizeGachaFieldAlias({

  });
  const isGachaFieldAlias = createIsGachaFieldAlias({
    normalizeGachaFieldAlias: (...a: any[]) => normalizeGachaFieldAlias(...a),
  });

  const getGachaNamedCustomField = createGetGachaNamedCustomField({
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
    normalizeGachaFieldAlias: (...a: any[]) => normalizeGachaFieldAlias(...a),
  });

  const getGachaItemTagsText = createGetGachaItemTagsText({
    getGachaNamedCustomField: (...a: any[]) => getGachaNamedCustomField(...a),
  });

  const getGachaItemEffectText = createGetGachaItemEffectText({
    getGachaNamedCustomField: (...a: any[]) => getGachaNamedCustomField(...a),
  });

  const getGachaItemDescriptionText = createGetGachaItemDescriptionText({

  });

  const formatGachaItemCardMeta = createFormatGachaItemCardMeta({

    getGachaItemTagsText: (...a: any[]) => getGachaItemTagsText(...a),
  });

  const getGachaCustomFieldsSearchText = createGetGachaCustomFieldsSearchText({
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
  });

  type GachaCustomFieldsPreviewRenderOptions = {
    limit?: number;
    showOverflowCount?: boolean;
    valueOnly?: boolean;
  };

  type GachaCustomFieldsDetailsRenderOptions = {
    openThreshold?: number;
    title?: string;
  };

  const renderGachaCustomFieldsPreviewHtml = createRenderGachaCustomFieldsPreviewHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
  });

  const renderGachaCustomFieldsDetailsHtml = createRenderGachaCustomFieldsDetailsHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
  });

  const getStoredGachaItemSettings = createGetStoredGachaItemSettings({
    normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
  });

  const saveGachaItemSettingsRecord = createSaveGachaItemSettingsRecord({

  });

  const withGachaItemSettings = createWithGachaItemSettings({
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
  });

  const isGachaItemEnabled = createIsGachaItemEnabled({
    normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a),
  });

  const updateGachaItemSetting = createUpdateGachaItemSetting({
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
    saveGachaItemSettingsRecord: (...a: any[]) => saveGachaItemSettingsRecord(...a),
  });

  const setGachaItemOrder = createSetGachaItemOrder({
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
    updateGachaItemSetting: (...a: any[]) => updateGachaItemSetting(...a),
  });

  const deleteGachaItemSetting = createDeleteGachaItemSetting({
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    saveGachaItemSettingsRecord: (...a: any[]) => saveGachaItemSettingsRecord(...a),
  });

  const gachaStateCore = createGachaStateCoreInstance({
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    getGACHA_TEST_DEFAULT_FORTUNE: () => GACHA_TEST_DEFAULT_FORTUNE,
  });
  const createDefaultGachaState = createCreateDefaultGachaState({
    getGachaStateCore: () => gachaStateCore,
  });
  const normalizeShardWallet = createNormalizeShardWallet({
    getGachaStateCore: () => gachaStateCore,
  });

  const normalizeRecentGachaRewards = createNormalizeRecentGachaRewards({
    getGachaStateCore: () => gachaStateCore,
  });

  const gachaStore = createGachaStoreInstance({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });
  const getGachaStateStorageKey = createGetGachaStateStorageKey({
    getGachaStore: () => gachaStore,
  });
  const getGachaStateMigrationKey = createGetGachaStateMigrationKey({
    getGachaStore: () => gachaStore,
  });

  const hasMigratedLegacyGachaState = createHasMigratedLegacyGachaState({
    getGachaStore: () => gachaStore,
  });
  const markLegacyGachaStateMigrated = createMarkLegacyGachaStateMigrated({
    getGachaStore: () => gachaStore,
  });

  const getStoredGachaStateSnapshot = createGetStoredGachaStateSnapshot({
    getGachaStore: () => gachaStore,
  });
  const saveStoredGachaStateSnapshot = createSaveStoredGachaStateSnapshot({
    getGachaStore: () => gachaStore,
  });
  const assertSaveStoredGachaStateSnapshot = createAssertSaveStoredGachaStateSnapshot({
    getGachaStore: () => gachaStore,
  });

  const normalizeGachaStateRecord = createNormalizeGachaStateRecord({
    getGachaStateCore: () => gachaStateCore,
  });

  let gachaCatalogCache: GachaCatalogCache | null = null;
  let gachaCatalogLoadTask: GachaCatalogLoadTask | null = null;

  const cloneGachaCatalogItems = createCloneGachaCatalogItems({

  });

  const createEmptyGachaCatalog = createCreateEmptyGachaCatalog({

  });


  const normalizeGachaCatalogRecord = createNormalizeGachaCatalogRecord({

  });

  const normalizeScopedGachaCatalogRecord = createNormalizeScopedGachaCatalogRecord({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    normalizeGachaCatalogRecord: (...a: any[]) => normalizeGachaCatalogRecord(...a),
  });

  const getGachaCatalogItemMergeTimestamp = createGetGachaCatalogItemMergeTimestamp({

  });

  const getGachaCatalogRecordMergeTimestamp = createGetGachaCatalogRecordMergeTimestamp({
    getGachaCatalogItemMergeTimestamp: (...a: any[]) => getGachaCatalogItemMergeTimestamp(...a),
  });

  const mergeGachaCatalogRecordsToGlobalScope = createMergeGachaCatalogRecordsToGlobalScope({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getGachaCatalogItemMergeTimestamp: (...a: any[]) => getGachaCatalogItemMergeTimestamp(...a),
    getGachaCatalogRecordMergeTimestamp: (...a: any[]) => getGachaCatalogRecordMergeTimestamp(...a),
    normalizeScopedGachaCatalogRecord: (...a: any[]) => normalizeScopedGachaCatalogRecord(...a),
    GACHA_CATALOG_GLOBAL_SCOPE_KEY: GACHA_CATALOG_GLOBAL_SCOPE_KEY,
  });

  const migrateGachaCatalogRecordsToGlobalScope = createMigrateGachaCatalogRecordsToGlobalScope({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    createEmptyGachaCatalog: (...a: any[]) => createEmptyGachaCatalog(...a),
    mergeGachaCatalogRecordsToGlobalScope: (...a: any[]) => mergeGachaCatalogRecordsToGlobalScope(...a),
    normalizeScopedGachaCatalogRecord: (...a: any[]) => normalizeScopedGachaCatalogRecord(...a),
    GACHA_CATALOG_GLOBAL_SCOPE_KEY: GACHA_CATALOG_GLOBAL_SCOPE_KEY,
  });

  const getGachaItemDefinitionFingerprint = createGetGachaItemDefinitionFingerprint({

  });

  const getStoredGachaCatalog = createGetStoredGachaCatalog({
    createEmptyGachaCatalog: (...a: any[]) => createEmptyGachaCatalog(...a),
    getGachaCatalogScopeKey: (...a: any[]) => getGachaCatalogScopeKey(...a),
    getGachaCatalogCache: () => gachaCatalogCache,
  });

  const saveStoredGachaCatalog = createSaveStoredGachaCatalog({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    getGachaCatalogScopeKey: (...a: any[]) => getGachaCatalogScopeKey(...a),
    getGachaCatalogCache: () => gachaCatalogCache,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache = v; },
  });

  const ensureGachaCatalogLoaded = createEnsureGachaCatalogLoaded({
    getGachaCatalogScopeKey: (...a: any[]) => getGachaCatalogScopeKey(...a),
    migrateGachaCatalogRecordsToGlobalScope: (...a: any[]) => migrateGachaCatalogRecordsToGlobalScope(...a),
    getGachaCatalogCache: () => gachaCatalogCache,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache = v; },
    getGachaCatalogLoadTask: () => gachaCatalogLoadTask,
    setGachaCatalogLoadTask: (v: any) => { gachaCatalogLoadTask = v; },
  });

  const getCustomGachaItemDefinitions = createGetCustomGachaItemDefinitions({
    getStoredGachaCatalog: (...a: any[]) => getStoredGachaCatalog(...a),
  });

  const getAllGachaItemDefinitions = createGetAllGachaItemDefinitions({
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    withGachaItemSettings: (...a: any[]) => withGachaItemSettings(...a),
  });

  const hashGachaCatalogSeed = createHashGachaCatalogSeed({

  });

  const buildStableGachaCustomItemId = createBuildStableGachaCustomItemId({
    hashGachaCatalogSeed: (...a: any[]) => hashGachaCatalogSeed(...a),
  });

  const EQUIPMENT_TABLE_TYPE_VALUES = ['武器', '防具', '饰品'] as const;
  type EquipmentTableType = (typeof EQUIPMENT_TABLE_TYPE_VALUES)[number];
  const inferEquipmentTableTypeForGachaItem = createInferEquipmentTableTypeForGachaItem({
    EQUIPMENT_TABLE_TYPE_VALUES: EQUIPMENT_TABLE_TYPE_VALUES,
  });

  const createUniqueGachaItemId = createCreateUniqueGachaItemId({

  });

  const normalizeGachaTimestamp = createNormalizeGachaTimestamp({

  });

  const normalizeImportedGachaPoolTags = createNormalizeImportedGachaPoolTags({
    getGachaAllExpandablePoolTags: (...a: any[]) => getGachaAllExpandablePoolTags(...a),
  });

  const normalizeImportedGachaItem = createNormalizeImportedGachaItem({
    buildStableGachaCustomItemId: (...a: any[]) => buildStableGachaCustomItemId(...a),
    inferEquipmentTableTypeForGachaItem: (...a: any[]) => inferEquipmentTableTypeForGachaItem(...a),
    isGachaFieldAlias: (...a: any[]) => isGachaFieldAlias(...a),
    normalizeGachaCustomFields: (...a: any[]) => normalizeGachaCustomFields(...a),
    normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
    normalizeGachaTargetColumns: (...a: any[]) => normalizeGachaTargetColumns(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
    normalizeGachaTimestamp: (...a: any[]) => normalizeGachaTimestamp(...a),
    normalizeImportedGachaPoolTags: (...a: any[]) => normalizeImportedGachaPoolTags(...a),
    GACHA_EFFECT_FIELD_ALIASES: GACHA_EFFECT_FIELD_ALIASES,
    GACHA_TAG_FIELD_ALIASES: GACHA_TAG_FIELD_ALIASES,
  });

  const normalizeImportedGachaPools = createNormalizeImportedGachaPools({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    isBuiltinGachaPoolId: (...a: any[]) => isBuiltinGachaPoolId(...a),
    normalizeGachaPoolDefinition: (...a: any[]) => normalizeGachaPoolDefinition(...a),
  });

  const analyzeGachaCatalogImport = createAnalyzeGachaCatalogImport({
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    normalizeImportedGachaItem: (...a: any[]) => normalizeImportedGachaItem(...a),
    normalizeImportedGachaPools: (...a: any[]) => normalizeImportedGachaPools(...a),
    parseJsoncValue: (...a: any[]) => parseJsoncValue(...a),
  });

  const formatGachaCatalogImportErrors = createFormatGachaCatalogImportErrors({

  });

  const getGachaCatalogImportFailureMessage = createGetGachaCatalogImportFailureMessage({
    formatGachaCatalogImportErrors: (...a: any[]) => formatGachaCatalogImportErrors(...a),
  });

  const validateGachaCatalogImportItemTarget = createValidateGachaCatalogImportItemTarget({
    applyGachaCustomFieldsToRow: (...a: any[]) => applyGachaCustomFieldsToRow(...a),
    assertCrudEnumConstraints: (...a: any[]) => assertCrudEnumConstraints(...a),
    assertCrudInsertRequiredCells: (...a: any[]) => assertCrudInsertRequiredCells(...a),
    assertCrudLengthConstraints: (...a: any[]) => assertCrudLengthConstraints(...a),
    assertCrudRequiredColumnsRepresented: (...a: any[]) => assertCrudRequiredColumnsRepresented(...a),
    getGachaRewardParseResultForItem: (...a: any[]) => getGachaRewardParseResultForItem(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    setEquipmentRowBasicFields: (...a: any[]) => setEquipmentRowBasicFields(...a),
    setInventoryRowBasicFields: (...a: any[]) => setInventoryRowBasicFields(...a),
    validateGachaCustomFieldsForTargetTable: (...a: any[]) => validateGachaCustomFieldsForTargetTable(...a),
  });

  const mergeImportedGachaPools = createMergeImportedGachaPools({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    saveGachaPoolSettings: (...a: any[]) => saveGachaPoolSettings(...a),
  });

  const collectGachaLocalStorageSnapshot = createCollectGachaLocalStorageSnapshot({

  });

  const restoreGachaLocalStorageSnapshot = createRestoreGachaLocalStorageSnapshot({

  });

  const applyGachaCatalogImport = createApplyGachaCatalogImport({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    collectGachaLocalStorageSnapshot: (...a: any[]) => collectGachaLocalStorageSnapshot(...a),
    createUniqueGachaItemId: (...a: any[]) => createUniqueGachaItemId(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    ensureGachaPoolsForTags: (...a: any[]) => ensureGachaPoolsForTags(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    mergeImportedGachaPools: (...a: any[]) => mergeImportedGachaPools(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
    restoreGachaLocalStorageSnapshot: (...a: any[]) => restoreGachaLocalStorageSnapshot(...a),
    saveGachaItemSettingsRecord: (...a: any[]) => saveGachaItemSettingsRecord(...a),
    saveStoredGachaCatalog: (...a: any[]) => saveStoredGachaCatalog(...a),
    validateGachaCatalogImportItemTarget: (...a: any[]) => validateGachaCatalogImportItemTarget(...a),
    STORAGE_KEY_GACHA_ITEM_SETTINGS: STORAGE_KEY_GACHA_ITEM_SETTINGS,
    STORAGE_KEY_GACHA_POOL_SETTINGS: STORAGE_KEY_GACHA_POOL_SETTINGS,
  });

  const clearGlobalGachaCatalog = createClearGlobalGachaCatalog({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    collectGachaLocalStorageSnapshot: (...a: any[]) => collectGachaLocalStorageSnapshot(...a),
    deleteGachaItemSetting: (...a: any[]) => deleteGachaItemSetting(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    restoreGachaLocalStorageSnapshot: (...a: any[]) => restoreGachaLocalStorageSnapshot(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    saveStoredGachaCatalog: (...a: any[]) => saveStoredGachaCatalog(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
  });

  const showGachaCatalogClearDialog = createShowGachaCatalogClearDialog({
    clearGlobalGachaCatalog: (...a: any[]) => clearGlobalGachaCatalog(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const buildGachaCatalogTemplateJsonc = createBuildGachaCatalogTemplateJsonc({

  });

  const serializeGachaCatalogItemForExport = createSerializeGachaCatalogItemForExport({
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    normalizeGachaCustomFields: (...a: any[]) => normalizeGachaCustomFields(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
    normalizeGachaTargetColumns: (...a: any[]) => normalizeGachaTargetColumns(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
  });

  const serializeGachaPoolDefinitionForExport = createSerializeGachaPoolDefinitionForExport({

  });

  const getGachaCatalogItemsForExport = createGetGachaCatalogItemsForExport({
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getGachaAllExpandablePoolTags: (...a: any[]) => getGachaAllExpandablePoolTags(...a),
  });

  const exportGachaCatalogJson = createExportGachaCatalogJson({
    buildGachaCatalogTemplateJsonc: (...a: any[]) => buildGachaCatalogTemplateJsonc(...a),
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getGachaCatalogItemsForExport: (...a: any[]) => getGachaCatalogItemsForExport(...a),
    serializeGachaCatalogItemForExport: (...a: any[]) => serializeGachaCatalogItemForExport(...a),
    serializeGachaPoolDefinitionForExport: (...a: any[]) => serializeGachaPoolDefinitionForExport(...a),
  });

  const downloadGachaCatalogJson = createDownloadGachaCatalogJson({
    buildGachaExportNamePart: (...a: any[]) => buildGachaExportNamePart(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    downloadJsoncFile: (...a: any[]) => downloadJsoncFile(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    exportGachaCatalogJson: (...a: any[]) => exportGachaCatalogJson(...a),
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getGachaCatalogItemsForExport: (...a: any[]) => getGachaCatalogItemsForExport(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const formatGachaCatalogImportStatsText = createFormatGachaCatalogImportStatsText({

  });

  const showGachaCatalogImportConfirm = createShowGachaCatalogImportConfirm({
    analyzeGachaCatalogImport: (...a: any[]) => analyzeGachaCatalogImport(...a),
    applyGachaCatalogImport: (...a: any[]) => applyGachaCatalogImport(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatGachaCatalogImportStatsText: (...a: any[]) => formatGachaCatalogImportStatsText(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getGachaCatalogImportFailureMessage: (...a: any[]) => getGachaCatalogImportFailureMessage(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
  });

  const importGachaCatalogJsonFromFile = createImportGachaCatalogJsonFromFile({
    analyzeGachaCatalogImport: (...a: any[]) => analyzeGachaCatalogImport(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getGachaCatalogImportFailureMessage: (...a: any[]) => getGachaCatalogImportFailureMessage(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    showGachaCatalogImportConfirm: (...a: any[]) => showGachaCatalogImportConfirm(...a),
  });

  const getLegacyGachaStateFromRawData = createGetLegacyGachaStateFromRawData({
    normalizeGachaStateRecord: (...a: any[]) => normalizeGachaStateRecord(...a),
  });

  const getGachaState = createGetGachaState({
    createDefaultGachaState: (...a: any[]) => createDefaultGachaState(...a),
    getLegacyGachaStateFromRawData: (...a: any[]) => getLegacyGachaStateFromRawData(...a),
    getStoredGachaStateSnapshot: (...a: any[]) => getStoredGachaStateSnapshot(...a),
    hasMigratedLegacyGachaState: (...a: any[]) => hasMigratedLegacyGachaState(...a),
    markLegacyGachaStateMigrated: (...a: any[]) => markLegacyGachaStateMigrated(...a),
    normalizeGachaStateRecord: (...a: any[]) => normalizeGachaStateRecord(...a),
    saveStoredGachaStateSnapshot: (...a: any[]) => saveStoredGachaStateSnapshot(...a),
  });

  const touchGachaActivity = createTouchGachaActivity({
    getGachaState: (...a: any[]) => getGachaState(...a),
    getLastHumanInputActivityAt: () => lastHumanInputActivityAt_ACC.v,
  });

  const recordGachaFortuneGain = createRecordGachaFortuneGain({

  });

  const getObjectRecord = createGetObjectRecord({

  });

  const buildGachaDiceEventSettlementKey = createBuildGachaDiceEventSettlementKey({
    getObjectRecord: (...a: any[]) => getObjectRecord(...a),
  });

  const getGachaDiceEventDetail = createGetGachaDiceEventDetail({
    getObjectRecord: (...a: any[]) => getObjectRecord(...a),
  });

  const settleGachaFortuneForDiceEvent = createSettleGachaFortuneForDiceEvent({
    buildGachaDiceEventSettlementKey: (...a: any[]) => buildGachaDiceEventSettlementKey(...a),
    getGachaDiceEventDetail: (...a: any[]) => getGachaDiceEventDetail(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    recordGachaFortuneGain: (...a: any[]) => recordGachaFortuneGain(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    saveStoredGachaStateSnapshot: (...a: any[]) => saveStoredGachaStateSnapshot(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
  });

  const persistRawDataWithGacha = createPersistRawDataWithGacha({
    assertSaveStoredGachaStateSnapshot: (...a: any[]) => assertSaveStoredGachaStateSnapshot(...a),
    hasSheetKeys: (...a: any[]) => hasSheetKeys(...a),
    performSaveDataOnly: (...a: any[]) => performSaveDataOnly(...a),
  });

  const showGachaSaveError = createShowGachaSaveError({
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
  });

  const getGachaRarityRank = createGetGachaRarityRank({

  });

  const isGachaRarity = createIsGachaRarity({

  });
  const getGachaShardLabel = createGetGachaShardLabel({

  });

  const getGachaRarityIconClass = createGetGachaRarityIconClass({
    getINVENTORY_QUALITY_FILTER_META: () => INVENTORY_QUALITY_FILTER_META,
  });

  const compareGachaItemDefinitionsForDisplay = createCompareGachaItemDefinitionsForDisplay({
    getGachaRarityRank: (...a: any[]) => getGachaRarityRank(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
  });

  const addGachaShards = createAddGachaShards({

  });

  const getGachaRewardTargetTableLabel = createGetGachaRewardTargetTableLabel({

  });

  const formatGachaRewardDestinationLabel = createFormatGachaRewardDestinationLabel({
    getGachaRewardParseResult: (...a: any[]) => getGachaRewardParseResult(...a),
    getGachaRewardTargetOptions: (...a: any[]) => getGachaRewardTargetOptions(...a),
    getGachaRewardTargetTableLabel: (...a: any[]) => getGachaRewardTargetTableLabel(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
  });

  const getGachaRewardTargetOptions = createGetGachaRewardTargetOptions({
    normalizeGachaTargetColumns: (...a: any[]) => normalizeGachaTargetColumns(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
  });

  const getGachaRewardParseResult = createGetGachaRewardParseResult({
    parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
  });

  const getGachaRewardParseResultForItem = createGetGachaRewardParseResultForItem({
    getGachaRewardParseResult: (...a: any[]) => getGachaRewardParseResult(...a),
    getGachaRewardTargetOptions: (...a: any[]) => getGachaRewardTargetOptions(...a),
  });

  const hasGachaRewardTable = createHasGachaRewardTable({
    getGachaRewardParseResult: (...a: any[]) => getGachaRewardParseResult(...a),
  });

  const hasGachaRewardTableForItem = createHasGachaRewardTableForItem({
    getGachaRewardParseResultForItem: (...a: any[]) => getGachaRewardParseResultForItem(...a),
  });

  const getAvailableGachaRewardTargets = createGetAvailableGachaRewardTargets({
    hasGachaRewardTable: (...a: any[]) => hasGachaRewardTable(...a),
  });

  const getGachaMinimumRarity = createGetGachaMinimumRarity({

  });

  const pickWeightedValue = createPickWeightedValue({

  });

  const getActiveGachaPoolTags = createGetActiveGachaPoolTags({
    getGachaAllExpandablePoolTags: (...a: any[]) => getGachaAllExpandablePoolTags(...a),
  });

  let gachaPoolDefinitionsCache: {
    poolTag: GachaPoolTag;
    rawData: unknown;
    activeTagsKey: string;
    items: GachaItemDefinition[];
  } | null = null;

  const getGachaPoolDefinitions = createGetGachaPoolDefinitions({
    compareGachaItemDefinitionsForDisplay: (...a: any[]) => compareGachaItemDefinitionsForDisplay(...a),
    getActiveGachaPoolTags: (...a: any[]) => getActiveGachaPoolTags(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    getGachaPoolDefinitionsCache: () => gachaPoolDefinitionsCache,
    setGachaPoolDefinitionsCache: (v: any) => { gachaPoolDefinitionsCache = v; },
  });

  const getStoredGachaActivePoolTag = createGetStoredGachaActivePoolTag({
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
  });

  const saveStoredGachaActivePoolTag = createSaveStoredGachaActivePoolTag({

  });

  const getGachaActivePoolTag = createGetGachaActivePoolTag({
    getStoredGachaActivePoolTag: (...a: any[]) => getStoredGachaActivePoolTag(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
  });

  const getGachaChatIdSeed = createGetGachaChatIdSeed({

  });

  const getGachaLocalDateKey = createGetGachaLocalDateKey({

  });

  const hashGachaSeed = createHashGachaSeed({

  });

  let gachaPickupRotationKeyCache: { chatLength: number; dateKey: string; key: string } | null = null;

  const getGachaPickupRotationKey = createGetGachaPickupRotationKey({
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    getGachaChatIdSeed: (...a: any[]) => getGachaChatIdSeed(...a),
    getGachaLocalDateKey: (...a: any[]) => getGachaLocalDateKey(...a),
    getGachaPickupRotationKeyCache: () => gachaPickupRotationKeyCache,
    setGachaPickupRotationKeyCache: (v: any) => { gachaPickupRotationKeyCache = v; },
  });

  let gachaPickupItemsCache: { key: string; items: GachaItemDefinition[] } | null = null;

  const getGachaPickupItems = createGetGachaPickupItems({
    getGachaPickupRotationKey: (...a: any[]) => getGachaPickupRotationKey(...a),
    getGachaPoolDefinitions: (...a: any[]) => getGachaPoolDefinitions(...a),
    getGachaRarityRank: (...a: any[]) => getGachaRarityRank(...a),
    hashGachaSeed: (...a: any[]) => hashGachaSeed(...a),
    getGachaPickupItemsCache: () => gachaPickupItemsCache,
    setGachaPickupItemsCache: (v: any) => { gachaPickupItemsCache = v; },
  });

  const isGachaPickupItem = createIsGachaPickupItem({
    getGachaPickupItems: (...a: any[]) => getGachaPickupItems(...a),
  });

  const pickGachaRarity = createPickGachaRarity({
    getGachaPoolDefinitions: (...a: any[]) => getGachaPoolDefinitions(...a),
    getGachaRarityRank: (...a: any[]) => getGachaRarityRank(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    pickWeightedValue: (...a: any[]) => pickWeightedValue(...a),
  });

  const pickGachaItemDefinition = createPickGachaItemDefinition({
    getGachaPoolDefinitions: (...a: any[]) => getGachaPoolDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    isGachaPickupItem: (...a: any[]) => isGachaPickupItem(...a),
    pickWeightedValue: (...a: any[]) => pickWeightedValue(...a),
  });

  const getInventoryDefaultMetaRecord = createGetInventoryDefaultMetaRecord({
    getInventoryGlobalContext: (...a: any[]) => getInventoryGlobalContext(...a),
  });

  const buildGachaInventoryMetaRecord = createBuildGachaInventoryMetaRecord({
    getInventoryDefaultMetaRecord: (...a: any[]) => getInventoryDefaultMetaRecord(...a),
    getInventoryMetadataForItem: (...a: any[]) => getInventoryMetadataForItem(...a),
  });

  const setInventoryRowBasicFields = createSetInventoryRowBasicFields({
    getGachaItemDescriptionText: (...a: any[]) => getGachaItemDescriptionText(...a),
    getGachaItemEffectText: (...a: any[]) => getGachaItemEffectText(...a),
    getGachaItemTagsText: (...a: any[]) => getGachaItemTagsText(...a),
  });

  const resolveEquipmentTableTypeForGachaItem = createResolveEquipmentTableTypeForGachaItem({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudEnumConstraintMap: (...a: any[]) => buildCrudEnumConstraintMap(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
    inferEquipmentTableTypeForGachaItem: (...a: any[]) => inferEquipmentTableTypeForGachaItem(...a),
  });

  const setEquipmentRowBasicFields = createSetEquipmentRowBasicFields({
    getGachaItemDescriptionText: (...a: any[]) => getGachaItemDescriptionText(...a),
    getGachaItemEffectText: (...a: any[]) => getGachaItemEffectText(...a),
    getGachaItemTagsText: (...a: any[]) => getGachaItemTagsText(...a),
    resolveEquipmentTableTypeForGachaItem: (...a: any[]) => resolveEquipmentTableTypeForGachaItem(...a),
  });

  type GachaCustomFieldApplyOptions = {
    target: GachaRewardTarget;
    targetColumns?: GachaRewardTargetColumns;
    preserveNonEmptyExisting?: boolean;
  };

  type GachaCustomFieldValidationOptions = {
    target: GachaRewardTarget;
    tableName: string;
    headers: unknown[];
    sheet: unknown;
    item: Pick<GachaItemDefinition, 'name' | 'customFields' | 'targetColumns'>;
    throwOnMissing?: boolean;
  };

  type GachaExistingCustomFieldValidationOptions = GachaCustomFieldValidationOptions & {
    row: unknown[];
  };

  type GachaCustomFieldValidationResult = {
    missingHeaders: string[];
    availableHeaders: string[];
    message: string;
  };
  const gachaCatalogCache_ACC = { get v(){ return gachaCatalogCache; }, set v(x){ gachaCatalogCache = x; } };
  const gachaCatalogLoadTask_ACC = { get v(){ return gachaCatalogLoadTask; }, set v(x){ gachaCatalogLoadTask = x; } };
  return { DEFAULT_GACHA_SETTINGS_ITEM_FILTERS, GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS, GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH, GACHA_CUSTOM_FIELD_MAX_COUNT, GACHA_CUSTOM_FIELD_RESERVED_KEYS, GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH, GACHA_EFFECT_FIELD_ALIASES, GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS, GACHA_SETTINGS_SORT_OPTIONS, GACHA_SETTINGS_SOURCE_FILTER_OPTIONS, GACHA_SETTINGS_STATUS_FILTER_OPTIONS, GACHA_TAG_FIELD_ALIASES, GACHA_TARGET_COLUMN_KEYS, GACHA_TARGET_COLUMN_LABELS, GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH, GACHA_TARGET_TABLE_MAX_LENGTH, INVENTORY_QUALITY_FILTER_META, INVENTORY_TYPE_FILTER_META, addGachaShards, analyzeGachaCatalogImport, applyGachaCatalogImport, assertSaveStoredGachaStateSnapshot, bindCompositionSafeSearchInput, buildAdvancedPresetAgentPrompt, buildCrudColumnAliasMap, buildDefaultGachaPoolDefinition, buildGachaInventoryMetaRecord, buildStableGachaCustomItemId, canDeleteGachaPoolDefinition, cloneGachaCatalogItems, collectGachaLocalStorageSnapshot, compareGachaItemDefinitionsForDisplay, createDefaultGachaState, createEmptyGachaCatalog, createUniqueGachaItemId, deleteGachaItemSetting, downloadGachaCatalogJson, ensureGachaCatalogLoaded, ensureGachaPoolsForTags, exportGachaCatalogJson, formatGachaCatalogImportStatsText, formatGachaItemCardMeta, formatGachaPoolTags, formatGachaRewardDestinationLabel, getActiveGachaPoolTags, getAllGachaItemDefinitions, getAllGachaPoolConfigDefinitions, getAvailableGachaRewardTargets, getConfiguredGachaPoolDefinitions, getCustomGachaItemDefinitions, getGachaActivePoolTag, getGachaCatalogImportFailureMessage, getGachaCatalogItemsForExport, getGachaCustomFieldEntries, getGachaCustomFieldsSearchText, getGachaItemDefinitionFingerprint, getGachaItemDescriptionText, getGachaItemEffectText, getGachaItemTagsText, getGachaMinimumRarity, getGachaNamedCustomField, getGachaPickupItems, getGachaPoolDefinitions, getGachaPoolDisplayName, getGachaRarityIconClass, getGachaRarityRank, getGachaRewardFieldLimits, getGachaRewardParseResult, getGachaRewardParseResultForItem, getGachaRewardTargetOptions, getGachaRewardTargetTableLabel, getGachaShardLabel, getGachaState, getGachaTargetColumnEntries, getInventoryFilters, getInventoryFiltersCollapsedState, getInventoryPanelTarget, getRuntimeGachaRawData, getStoredGachaActivePoolTag, getStoredGachaItemSettings, getVisibleGachaPoolConfigDefinitions, hasGachaCustomFields, hasGachaRewardTableForItem, importGachaCatalogJsonFromFile, inferEquipmentTableTypeForGachaItem, isBuiltinGachaPoolId, isGachaFieldAlias, isGachaItemEnabled, isGachaRarity, mergeGachaCatalogRecordsToGlobalScope, migrateGachaCatalogRecordsToGlobalScope, normalizeGachaCatalogRecord, normalizeGachaCustomFields, normalizeGachaItemEnabled, normalizeGachaItemOrder, normalizeGachaPoolDefinition, normalizeGachaRewardTarget, normalizeGachaTargetColumns, normalizeGachaTargetTable, normalizeGachaTimestamp, normalizeImportedGachaItem, persistRawDataWithGacha, pickGachaItemDefinition, pickGachaRarity, recordGachaFortuneGain, renderGachaCustomFieldsDetailsHtml, renderGachaCustomFieldsPreviewHtml, restoreGachaLocalStorageSnapshot, saveGachaPoolSettings, saveInventoryFilters, saveInventoryFiltersCollapsedState, saveInventoryPanelTarget, saveStoredGachaActivePoolTag, saveStoredGachaCatalog, saveStoredGachaStateSnapshot, serializeGachaCatalogItemForExport, setEquipmentRowBasicFields, setGachaItemOrder, setGachaPoolOrder, setInventoryRowBasicFields, settleGachaFortuneForDiceEvent, showGachaCatalogClearDialog, showGachaSaveError, touchGachaActivity, truncateGachaText, updateGachaItemSetting, updateGachaPoolConfig, validateGachaCatalogImportItemTarget, gachaCatalogCache_ACC, gachaCatalogLoadTask_ACC };
}
