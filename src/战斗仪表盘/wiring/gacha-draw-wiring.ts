/**
 * wiring / gacha-draw-wiring.ts — 抽卡主流程/面板装配簇（从 index.ts 迁出，x4-j）。
 */
import { createApplyGachaCustomFieldsToRow } from '../features/gacha/apply-gacha-custom-fields-to-row';
import { createApplyGachaPityAfterDraw } from '../features/gacha/apply-gacha-pity-after-draw';
import { createBuildGachaCustomFieldHeaderMap } from '../features/gacha/build-gacha-custom-field-header-map';
import { createClearGachaFortune } from '../features/gacha/clear-gacha-fortune';
import { createDeleteGachaPoolConfig } from '../features/gacha/delete-gacha-pool-config';
import { createDrawSingleGachaOutcome } from '../features/gacha/draw-single-gacha-outcome';
import { createFindGachaDefinitionByInventoryItem } from '../features/gacha/find-gacha-definition-by-inventory-item';
import { createFindGachaDefinitionByItemId } from '../features/gacha/find-gacha-definition-by-item-id';
import { createFindGachaDefinitionByNameQuality } from '../features/gacha/find-gacha-definition-by-name-quality';
import { createFormatGachaDuration } from '../features/gacha/format-gacha-duration';
import { createFormatGachaItemCreatedAt } from '../features/gacha/format-gacha-item-created-at';
import { createFormatGachaRecentRewardText } from '../features/gacha/format-gacha-recent-reward-text';
import { createFormatGachaRelativeTime } from '../features/gacha/format-gacha-relative-time';
import { createShowGachaConfirmDialog } from '../features/gacha/gacha-confirm-dialog';
import { createShowGachaPickupItemDetail } from '../features/gacha/gacha-pickup-item-detail';
import { createShowGachaPoolNameDialog } from '../features/gacha/gacha-pool-name-dialog';
import { createShowGachaRecentRewardDetail } from '../features/gacha/gacha-recent-reward-detail';
import { createShowGachaSettingsDialog } from '../features/gacha/gacha-settings-dialog';
import { createGetGachaFortuneProgressView } from '../features/gacha/get-gacha-fortune-progress-view';
import { createGetGachaItemCreatedAtMs } from '../features/gacha/get-gacha-item-created-at-ms';
import { createGetGachaItemGrantQuantity } from '../features/gacha/get-gacha-item-grant-quantity';
import { createGetGachaReservedCustomFieldHeaders } from '../features/gacha/get-gacha-reserved-custom-field-headers';
import { createGetGachaSettingsFilterLabel } from '../features/gacha/get-gacha-settings-filter-label';
import { createGetGachaSettingsPoolItems } from '../features/gacha/get-gacha-settings-pool-items';
import { createGetGachaShopProgressContainers } from '../features/gacha/get-gacha-shop-progress-containers';
import { createGetStoredGachaSettingsPoolTag } from '../features/gacha/get-stored-gacha-settings-pool-tag';
import { createGetTotalGachaShards } from '../features/gacha/get-total-gacha-shards';
import { createGrantEquipmentGachaReward } from '../features/gacha/grant-equipment-gacha-reward';
import { createGrantGachaReward } from '../features/gacha/grant-gacha-reward';
import { createGrantInventoryGachaReward } from '../features/gacha/grant-inventory-gacha-reward';
import { createPerformGachaDraw } from '../features/gacha/perform-gacha-draw';
import { createPushRecentGachaReward } from '../features/gacha/push-recent-gacha-reward';
import { createRefreshGachaPoolSelectionUi } from '../features/gacha/refresh-gacha-pool-selection-ui';
import { createRenderGachaFortuneProgressHtml } from '../features/gacha/render-gacha-fortune-progress-html';
import { createRenderGachaPanelHtml } from '../features/gacha/render-gacha-panel-html';
import { createRenderGachaPickupHtml } from '../features/gacha/render-gacha-pickup-html';
import { createRenderGachaPoolSettingsListHtml } from '../features/gacha/render-gacha-pool-settings-list-html';
import { createRenderGachaSettingsFilterMenuHtml } from '../features/gacha/render-gacha-settings-filter-menu-html';
import { createRenderGachaSettingsPoolItemsHtml } from '../features/gacha/render-gacha-settings-pool-items-html';
import { createRenderGachaSettingsPoolTabsHtml } from '../features/gacha/render-gacha-settings-pool-tabs-html';
import { createRenderGachaSettingsPoolViewerHtml } from '../features/gacha/render-gacha-settings-pool-viewer-html';
import { createSaveStoredGachaSettingsPoolTag } from '../features/gacha/save-stored-gacha-settings-pool-tag';
import { createUpdateGachaFortuneProgressDom } from '../features/gacha/update-gacha-fortune-progress-dom';
import { createUpdateGachaPoolTag } from '../features/gacha/update-gacha-pool-tag';
import { createUpdateGachaShopProgressUi } from '../features/gacha/update-gacha-shop-progress-ui';
import { createValidateGachaCustomFieldsForExistingRow } from '../features/gacha/validate-gacha-custom-fields-for-existing-row';
import { createValidateGachaCustomFieldsForTargetTable } from '../features/gacha/validate-gacha-custom-fields-for-target-table';
import { STORAGE_KEY_GACHA_ACTIVE_POOL_TAG, STORAGE_KEY_GACHA_ITEM_SETTINGS, STORAGE_KEY_GACHA_POOL_SETTINGS, STORAGE_KEY_GACHA_SETTINGS_POOL_TAG } from '../shared/storage-keys';

export function createGachaDrawWiring(deps: any) {
  const { DEFAULT_GACHA_SETTINGS_ITEM_FILTERS, GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS, GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS, GACHA_SETTINGS_SORT_OPTIONS, GACHA_SETTINGS_SOURCE_FILTER_OPTIONS, GACHA_SETTINGS_STATUS_FILTER_OPTIONS, addGachaShards, assertCrudEnumConstraints, assertCrudInsertRequiredCells, assertCrudLengthConstraints, assertCrudRequiredColumnsRepresented, assertSaveStoredGachaStateSnapshot, bindTutorialButtonsIn, buildCrudRequiredHeaderSet, buildDefaultGachaPoolDefinition, buildGachaCatalogAgentPrompt, buildGachaCatalogAgentPromptFilename, buildGachaInventoryMetaRecord, canDeleteGachaPoolDefinition, cloneGachaCatalogItems, cloneRuntimeDataValue, collectGachaLocalStorageSnapshot, collectHostAndLocalNodes, compareGachaItemDefinitionsForDisplay, createDefaultGachaState, createSortableList, deleteGachaItemSetting, downloadAiPromptFile, downloadGachaCatalogJson, ensureGachaCatalogLoaded, ensureGachaPoolsForTags, escapeHtml, formatGachaItemCardMeta, formatGachaPoolTags, formatGachaRewardDestinationLabel, gachaCatalogCache_ACC, gachaCatalogLoadTask_ACC, getAllGachaItemDefinitions, getAllGachaPoolConfigDefinitions, getAvailableGachaRewardTargets, getConfig, getConfiguredGachaPoolDefinitions, getCore, getCustomGachaItemDefinitions, getGachaActivePoolTag, getGachaCatalogItemsForExport, getGachaCustomFieldEntries, getGachaCustomFieldsSearchText, getGachaItemCustomTableNameIconContext, getGachaItemDescriptionText, getGachaItemEffectText, getGachaItemTagsText, getGachaMinimumRarity, getGachaPickupItems, getGachaPoolDefinitions, getGachaPoolDisplayName, getGachaRarityRank, getGachaRewardParseResultForItem, getGachaRewardTargetTableLabel, getGachaShardLabel, getGachaState, getGachaTargetColumnEntries, getJsonLikeErrorMessage, getRuntimeErrorMessage, getRuntimeGachaRawData, getStoredGachaActivePoolTag, getStoredGachaItemSettings, getTableData, getTutorialButtonHtml, getVisibleGachaPoolConfigDefinitions, hasGachaCustomFields, hydrateCustomTableNameIconsIn, importGachaCatalogJsonFromFile, isGachaItemEnabled, normalizeGachaTimestamp, parseInventoryItems, persistRawDataWithGacha, pickGachaItemDefinition, pickGachaRarity, refreshGachaShardShop, refreshGachaVisualization, refreshInventoryVisualization, renderGachaCustomFieldsDetailsHtml, renderGachaCustomFieldsPreviewHtml, renderGachaItemIconContent, restoreGachaLocalStorageSnapshot, restoreMutableRuntimeValue, runInSaveQueue, saveGachaPoolSettings, saveStoredGachaActivePoolTag, saveStoredGachaCatalog, saveStoredGachaStateSnapshot, setEquipmentRowBasicFields, setGachaItemOrder, setGachaPoolOrder, setInventoryMetadataForItem, setInventoryRowBasicFields, setupOverlayClose, showDiceSystemConfirmDialog, showGachaCatalogClearDialog, showGachaItemEditorDialog, showGachaSaveError, touchGachaActivity, updateGachaItemSetting, updateGachaPoolConfig, warnTableTemplateIssue, withTableTemplateCheckHint, cachedRawData_ACC, gachaShopRootElement_ACC } = deps;
  const getGachaReservedCustomFieldHeaders = createGetGachaReservedCustomFieldHeaders({
    getGachaTargetColumnEntries: (...a: any[]) => getGachaTargetColumnEntries(...a),
    getGACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS: () => GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS,
    getGACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS: () => GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS,
  });

  const buildGachaCustomFieldHeaderMap = createBuildGachaCustomFieldHeaderMap({

  });

  const applyGachaCustomFieldsToRow = createApplyGachaCustomFieldsToRow({
    buildGachaCustomFieldHeaderMap: (...a: any[]) => buildGachaCustomFieldHeaderMap(...a),
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
    getGachaReservedCustomFieldHeaders: (...a: any[]) => getGachaReservedCustomFieldHeaders(...a),
    hasGachaCustomFields: (...a: any[]) => hasGachaCustomFields(...a),
  });

  const validateGachaCustomFieldsForTargetTable = createValidateGachaCustomFieldsForTargetTable({
    buildCrudRequiredHeaderSet: (...a: any[]) => buildCrudRequiredHeaderSet(...a),
    buildGachaCustomFieldHeaderMap: (...a: any[]) => buildGachaCustomFieldHeaderMap(...a),
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
    getGachaReservedCustomFieldHeaders: (...a: any[]) => getGachaReservedCustomFieldHeaders(...a),
    hasGachaCustomFields: (...a: any[]) => hasGachaCustomFields(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const validateGachaCustomFieldsForExistingRow = createValidateGachaCustomFieldsForExistingRow({
    buildGachaCustomFieldHeaderMap: (...a: any[]) => buildGachaCustomFieldHeaderMap(...a),
    validateGachaCustomFieldsForTargetTable: (...a: any[]) => validateGachaCustomFieldsForTargetTable(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const getGachaItemGrantQuantity = createGetGachaItemGrantQuantity({

  });

  const findGachaDefinitionByItemId = createFindGachaDefinitionByItemId({
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const findGachaDefinitionByNameQuality = createFindGachaDefinitionByNameQuality({
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const findGachaDefinitionByInventoryItem = createFindGachaDefinitionByInventoryItem({
    findGachaDefinitionByNameQuality: (...a: any[]) => findGachaDefinitionByNameQuality(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const grantInventoryGachaReward = createGrantInventoryGachaReward({
    getGachaRewardParseResultForItem: (...a: any[]) => getGachaRewardParseResultForItem(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    addGachaShards: (...a: any[]) => addGachaShards(...a),
    validateGachaCustomFieldsForExistingRow: (...a: any[]) => validateGachaCustomFieldsForExistingRow(...a),
    setInventoryRowBasicFields: (...a: any[]) => setInventoryRowBasicFields(...a),
    applyGachaCustomFieldsToRow: (...a: any[]) => applyGachaCustomFieldsToRow(...a),
    validateGachaCustomFieldsForTargetTable: (...a: any[]) => validateGachaCustomFieldsForTargetTable(...a),
    assertCrudRequiredColumnsRepresented: (...a: any[]) => assertCrudRequiredColumnsRepresented(...a),
    assertCrudInsertRequiredCells: (...a: any[]) => assertCrudInsertRequiredCells(...a),
    assertCrudEnumConstraints: (...a: any[]) => assertCrudEnumConstraints(...a),
    assertCrudLengthConstraints: (...a: any[]) => assertCrudLengthConstraints(...a),
    setInventoryMetadataForItem: (...a: any[]) => setInventoryMetadataForItem(...a),
    buildGachaInventoryMetaRecord: (...a: any[]) => buildGachaInventoryMetaRecord(...a),
  });

  const grantEquipmentGachaReward = createGrantEquipmentGachaReward({
    getGachaRewardParseResultForItem: (...a: any[]) => getGachaRewardParseResultForItem(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    addGachaShards: (...a: any[]) => addGachaShards(...a),
    validateGachaCustomFieldsForExistingRow: (...a: any[]) => validateGachaCustomFieldsForExistingRow(...a),
    setEquipmentRowBasicFields: (...a: any[]) => setEquipmentRowBasicFields(...a),
    applyGachaCustomFieldsToRow: (...a: any[]) => applyGachaCustomFieldsToRow(...a),
    validateGachaCustomFieldsForTargetTable: (...a: any[]) => validateGachaCustomFieldsForTargetTable(...a),
    assertCrudRequiredColumnsRepresented: (...a: any[]) => assertCrudRequiredColumnsRepresented(...a),
    assertCrudInsertRequiredCells: (...a: any[]) => assertCrudInsertRequiredCells(...a),
    assertCrudEnumConstraints: (...a: any[]) => assertCrudEnumConstraints(...a),
    assertCrudLengthConstraints: (...a: any[]) => assertCrudLengthConstraints(...a),
  });

  const grantGachaReward = createGrantGachaReward({
    grantEquipmentGachaReward: (...a: any[]) => grantEquipmentGachaReward(...a),
    grantInventoryGachaReward: (...a: any[]) => grantInventoryGachaReward(...a),
  });

  const applyGachaPityAfterDraw = createApplyGachaPityAfterDraw({
    getGachaRarityRank: (...a: any[]) => getGachaRarityRank(...a),
  });

  const pushRecentGachaReward = createPushRecentGachaReward({

  });

  const drawSingleGachaOutcome = createDrawSingleGachaOutcome({
    getAvailableGachaRewardTargets: (...a: any[]) => getAvailableGachaRewardTargets(...a),
    getGachaMinimumRarity: (...a: any[]) => getGachaMinimumRarity(...a),
    pickGachaRarity: (...a: any[]) => pickGachaRarity(...a),
    pickGachaItemDefinition: (...a: any[]) => pickGachaItemDefinition(...a),
    getGachaItemGrantQuantity: (...a: any[]) => getGachaItemGrantQuantity(...a),
    grantGachaReward: (...a: any[]) => grantGachaReward(...a),
    applyGachaPityAfterDraw: (...a: any[]) => applyGachaPityAfterDraw(...a),
    pushRecentGachaReward: (...a: any[]) => pushRecentGachaReward(...a),
  });

  const formatGachaRecentRewardText = createFormatGachaRecentRewardText({
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
  });

  const renderGachaPickupHtml = createRenderGachaPickupHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatGachaItemCardMeta: (...a: any[]) => formatGachaItemCardMeta(...a),
    getGachaItemCustomTableNameIconContext: (...a: any[]) => getGachaItemCustomTableNameIconContext(...a),
    getGachaItemDescriptionText: (...a: any[]) => getGachaItemDescriptionText(...a),
    getGachaItemEffectText: (...a: any[]) => getGachaItemEffectText(...a),
    getGachaPickupItems: (...a: any[]) => getGachaPickupItems(...a),
    renderGachaCustomFieldsPreviewHtml: (...a: any[]) => renderGachaCustomFieldsPreviewHtml(...a),
    renderGachaItemIconContent: (...a: any[]) => renderGachaItemIconContent(...a),
  });

  const formatGachaDuration = createFormatGachaDuration({

  });

  const formatGachaRelativeTime = createFormatGachaRelativeTime({

  });

  const getGachaFortuneProgressView = createGetGachaFortuneProgressView({
    formatGachaDuration: (...a: any[]) => formatGachaDuration(...a),
    formatGachaRelativeTime: (...a: any[]) => formatGachaRelativeTime(...a),
  });

  const renderGachaFortuneProgressHtml = createRenderGachaFortuneProgressHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGachaFortuneProgressView: (...a: any[]) => getGachaFortuneProgressView(...a),
  });

  const showGachaPickupItemDetail = createShowGachaPickupItemDetail({
    findGachaDefinitionByItemId: (...a: any[]) => findGachaDefinitionByItemId(...a),
    formatGachaItemCardMeta: (...a: any[]) => formatGachaItemCardMeta(...a),
    formatGachaPoolTags: (...a: any[]) => formatGachaPoolTags(...a),
    formatGachaRewardDestinationLabel: (...a: any[]) => formatGachaRewardDestinationLabel(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getGachaItemCustomTableNameIconContext: (...a: any[]) => getGachaItemCustomTableNameIconContext(...a),
    getGachaItemDescriptionText: (...a: any[]) => getGachaItemDescriptionText(...a),
    getGachaItemEffectText: (...a: any[]) => getGachaItemEffectText(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderGachaCustomFieldsDetailsHtml: (...a: any[]) => renderGachaCustomFieldsDetailsHtml(...a),
    renderGachaItemIconContent: (...a: any[]) => renderGachaItemIconContent(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  const showGachaRecentRewardDetail = createShowGachaRecentRewardDetail({
    findGachaDefinitionByNameQuality: (...a: any[]) => findGachaDefinitionByNameQuality(...a),
    showGachaPickupItemDetail: showGachaPickupItemDetail,
  });

  const getTotalGachaShards = createGetTotalGachaShards({

  });

  const renderGachaPanelHtml = createRenderGachaPanelHtml({
    createDefaultGachaState: (...a: any[]) => createDefaultGachaState(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatGachaRecentRewardText: (...a: any[]) => formatGachaRecentRewardText(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getGachaActivePoolTag: (...a: any[]) => getGachaActivePoolTag(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getTotalGachaShards: (...a: any[]) => getTotalGachaShards(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    renderGachaFortuneProgressHtml: (...a: any[]) => renderGachaFortuneProgressHtml(...a),
    renderGachaPickupHtml: (...a: any[]) => renderGachaPickupHtml(...a),
  });

  const getGachaShopProgressContainers = createGetGachaShopProgressContainers({
    collectHostAndLocalNodes: (...a: any[]) => collectHostAndLocalNodes(...a),
    getGachaShopRootElement: () => gachaShopRootElement_ACC.v,
  });

  const updateGachaFortuneProgressDom = createUpdateGachaFortuneProgressDom({
    getGachaFortuneProgressView: (...a: any[]) => getGachaFortuneProgressView(...a),
    getGachaShopProgressContainers: (...a: any[]) => getGachaShopProgressContainers(...a),
  });

  const updateGachaShopProgressUi = createUpdateGachaShopProgressUi({
    getGachaShopProgressContainers: (...a: any[]) => getGachaShopProgressContainers(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    updateGachaFortuneProgressDom: (...a: any[]) => updateGachaFortuneProgressDom(...a),
  });

  const clearGachaFortune = createClearGachaFortune({
    assertSaveStoredGachaStateSnapshot: (...a: any[]) => assertSaveStoredGachaStateSnapshot(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showGachaSaveError: (...a: any[]) => showGachaSaveError(...a),
  });

  const performGachaDraw = createPerformGachaDraw({
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    drawSingleGachaOutcome: (...a: any[]) => drawSingleGachaOutcome(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getAvailableGachaRewardTargets: (...a: any[]) => getAvailableGachaRewardTargets(...a),
    getGachaActivePoolTag: (...a: any[]) => getGachaActivePoolTag(...a),
    getGachaPoolDefinitions: (...a: any[]) => getGachaPoolDefinitions(...a),
    getGachaRewardTargetTableLabel: (...a: any[]) => getGachaRewardTargetTableLabel(...a),
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    persistRawDataWithGacha: (...a: any[]) => persistRawDataWithGacha(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    refreshInventoryVisualization: (...a: any[]) => refreshInventoryVisualization(...a),
    restoreMutableRuntimeValue: (...a: any[]) => restoreMutableRuntimeValue(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showGachaSaveError: (...a: any[]) => showGachaSaveError(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  const refreshGachaPoolSelectionUi = createRefreshGachaPoolSelectionUi({
    getCore: (...a: any[]) => getCore(...a),
    renderGachaPickupHtml: (...a: any[]) => renderGachaPickupHtml(...a),
  });

  const updateGachaPoolTag = createUpdateGachaPoolTag({
    getGachaActivePoolTag: (...a: any[]) => getGachaActivePoolTag(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    refreshGachaPoolSelectionUi: (...a: any[]) => refreshGachaPoolSelectionUi(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    saveStoredGachaActivePoolTag: (...a: any[]) => saveStoredGachaActivePoolTag(...a),
    saveStoredGachaStateSnapshot: (...a: any[]) => saveStoredGachaStateSnapshot(...a),
  });

  const deleteGachaPoolConfig = createDeleteGachaPoolConfig({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    canDeleteGachaPoolDefinition: (...a: any[]) => canDeleteGachaPoolDefinition(...a),
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    collectGachaLocalStorageSnapshot: (...a: any[]) => collectGachaLocalStorageSnapshot(...a),
    deleteGachaItemSetting: (...a: any[]) => deleteGachaItemSetting(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getStoredGachaActivePoolTag: (...a: any[]) => getStoredGachaActivePoolTag(...a),
    restoreGachaLocalStorageSnapshot: (...a: any[]) => restoreGachaLocalStorageSnapshot(...a),
    saveGachaPoolSettings: (...a: any[]) => saveGachaPoolSettings(...a),
    saveStoredGachaActivePoolTag: (...a: any[]) => saveStoredGachaActivePoolTag(...a),
    saveStoredGachaCatalog: (...a: any[]) => saveStoredGachaCatalog(...a),
    saveStoredGachaSettingsPoolTag: (...a: any[]) => saveStoredGachaSettingsPoolTag(...a),
    STORAGE_KEY_GACHA_ACTIVE_POOL_TAG: STORAGE_KEY_GACHA_ACTIVE_POOL_TAG,
    STORAGE_KEY_GACHA_ITEM_SETTINGS: STORAGE_KEY_GACHA_ITEM_SETTINGS,
    STORAGE_KEY_GACHA_POOL_SETTINGS: STORAGE_KEY_GACHA_POOL_SETTINGS,
    STORAGE_KEY_GACHA_SETTINGS_POOL_TAG: STORAGE_KEY_GACHA_SETTINGS_POOL_TAG,
  });

  const getStoredGachaSettingsPoolTag = createGetStoredGachaSettingsPoolTag({
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
  });

  const saveStoredGachaSettingsPoolTag = createSaveStoredGachaSettingsPoolTag({

  });

  const showGachaPoolNameDialog = createShowGachaPoolNameDialog({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const showGachaConfirmDialog = createShowGachaConfirmDialog({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const getGachaSettingsPoolItems = createGetGachaSettingsPoolItems({
    getGachaCatalogItemsForExport: (...a: any[]) => getGachaCatalogItemsForExport(...a),
  });

  const getGachaItemCreatedAtMs = createGetGachaItemCreatedAtMs({
    normalizeGachaTimestamp: (...a: any[]) => normalizeGachaTimestamp(...a),
  });

  const formatGachaItemCreatedAt = createFormatGachaItemCreatedAt({
    getGachaItemCreatedAtMs: (...a: any[]) => getGachaItemCreatedAtMs(...a),
  });

  const renderGachaSettingsPoolTabsHtml = createRenderGachaSettingsPoolTabsHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
  });

  const renderGachaSettingsPoolItemsHtml = createRenderGachaSettingsPoolItemsHtml({
    compareGachaItemDefinitionsForDisplay: (...a: any[]) => compareGachaItemDefinitionsForDisplay(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatGachaItemCreatedAt: (...a: any[]) => formatGachaItemCreatedAt(...a),
    formatGachaPoolTags: (...a: any[]) => formatGachaPoolTags(...a),
    formatGachaRewardDestinationLabel: (...a: any[]) => formatGachaRewardDestinationLabel(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
    getGachaCustomFieldsSearchText: (...a: any[]) => getGachaCustomFieldsSearchText(...a),
    getGachaItemCreatedAtMs: (...a: any[]) => getGachaItemCreatedAtMs(...a),
    getGachaItemCustomTableNameIconContext: (...a: any[]) => getGachaItemCustomTableNameIconContext(...a),
    getGachaItemEffectText: (...a: any[]) => getGachaItemEffectText(...a),
    getGachaItemTagsText: (...a: any[]) => getGachaItemTagsText(...a),
    getGachaRarityRank: (...a: any[]) => getGachaRarityRank(...a),
    getGachaSettingsPoolItems: (...a: any[]) => getGachaSettingsPoolItems(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    renderGachaCustomFieldsPreviewHtml: (...a: any[]) => renderGachaCustomFieldsPreviewHtml(...a),
    renderGachaItemIconContent: (...a: any[]) => renderGachaItemIconContent(...a),
  });

  const getGachaSettingsFilterLabel = createGetGachaSettingsFilterLabel({
    getGACHA_SETTINGS_SORT_OPTIONS: () => GACHA_SETTINGS_SORT_OPTIONS,
    getGACHA_SETTINGS_SOURCE_FILTER_OPTIONS: () => GACHA_SETTINGS_SOURCE_FILTER_OPTIONS,
    getGACHA_SETTINGS_STATUS_FILTER_OPTIONS: () => GACHA_SETTINGS_STATUS_FILTER_OPTIONS,
  });

  const renderGachaSettingsFilterMenuHtml = createRenderGachaSettingsFilterMenuHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),

  });

  const renderGachaPoolSettingsListHtml = createRenderGachaPoolSettingsListHtml({
    canDeleteGachaPoolDefinition: (...a: any[]) => canDeleteGachaPoolDefinition(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getGachaCatalogItemsForExport: (...a: any[]) => getGachaCatalogItemsForExport(...a),
  });

  const renderGachaSettingsPoolViewerHtml = createRenderGachaSettingsPoolViewerHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGachaSettingsPoolItems: (...a: any[]) => getGachaSettingsPoolItems(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
    renderGachaSettingsFilterMenuHtml: (...a: any[]) => renderGachaSettingsFilterMenuHtml(...a),
    renderGachaSettingsPoolItemsHtml: (...a: any[]) => renderGachaSettingsPoolItemsHtml(...a),
    renderGachaSettingsPoolTabsHtml: (...a: any[]) => renderGachaSettingsPoolTabsHtml(...a),
    DEFAULT_GACHA_SETTINGS_ITEM_FILTERS: DEFAULT_GACHA_SETTINGS_ITEM_FILTERS,
    GACHA_SETTINGS_SORT_OPTIONS: GACHA_SETTINGS_SORT_OPTIONS,
    GACHA_SETTINGS_SOURCE_FILTER_OPTIONS: GACHA_SETTINGS_SOURCE_FILTER_OPTIONS,
    GACHA_SETTINGS_STATUS_FILTER_OPTIONS: GACHA_SETTINGS_STATUS_FILTER_OPTIONS,
  });

  const showGachaSettingsDialog = createShowGachaSettingsDialog({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildGachaCatalogAgentPrompt: (...a: any[]) => buildGachaCatalogAgentPrompt(...a),
    buildGachaCatalogAgentPromptFilename: (...a: any[]) => buildGachaCatalogAgentPromptFilename(...a),
    canDeleteGachaPoolDefinition: (...a: any[]) => canDeleteGachaPoolDefinition(...a),
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    collectGachaLocalStorageSnapshot: (...a: any[]) => collectGachaLocalStorageSnapshot(...a),
    deleteGachaItemSetting: (...a: any[]) => deleteGachaItemSetting(...a),
    deleteGachaPoolConfig: (...a: any[]) => deleteGachaPoolConfig(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    downloadGachaCatalogJson: (...a: any[]) => downloadGachaCatalogJson(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    ensureGachaPoolsForTags: (...a: any[]) => ensureGachaPoolsForTags(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getGachaPoolDisplayName: (...a: any[]) => getGachaPoolDisplayName(...a),
    getGachaSettingsFilterLabel: (...a: any[]) => getGachaSettingsFilterLabel(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    getStoredGachaSettingsPoolTag: (...a: any[]) => getStoredGachaSettingsPoolTag(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    importGachaCatalogJsonFromFile: (...a: any[]) => importGachaCatalogJsonFromFile(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    renderGachaPoolSettingsListHtml: (...a: any[]) => renderGachaPoolSettingsListHtml(...a),
    renderGachaSettingsPoolViewerHtml: (...a: any[]) => renderGachaSettingsPoolViewerHtml(...a),
    restoreGachaLocalStorageSnapshot: (...a: any[]) => restoreGachaLocalStorageSnapshot(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    saveStoredGachaCatalog: (...a: any[]) => saveStoredGachaCatalog(...a),
    saveStoredGachaSettingsPoolTag: (...a: any[]) => saveStoredGachaSettingsPoolTag(...a),
    setGachaItemOrder: (...a: any[]) => setGachaItemOrder(...a),
    setGachaPoolOrder: (...a: any[]) => setGachaPoolOrder(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showGachaCatalogClearDialog: (...a: any[]) => showGachaCatalogClearDialog(...a),
    showGachaConfirmDialog: (...a: any[]) => showGachaConfirmDialog(...a),
    showGachaItemEditorDialog: (...a: any[]) => showGachaItemEditorDialog(...a),
    showGachaPickupItemDetail: (...a: any[]) => showGachaPickupItemDetail(...a),
    showGachaPoolNameDialog: (...a: any[]) => showGachaPoolNameDialog(...a),
    updateGachaItemSetting: (...a: any[]) => updateGachaItemSetting(...a),
    updateGachaPoolConfig: (...a: any[]) => updateGachaPoolConfig(...a),
    DEFAULT_GACHA_SETTINGS_ITEM_FILTERS: DEFAULT_GACHA_SETTINGS_ITEM_FILTERS,
    STORAGE_KEY_GACHA_ITEM_SETTINGS: STORAGE_KEY_GACHA_ITEM_SETTINGS,
    createSortableList: createSortableList,
    getCachedRawData: () => cachedRawData_ACC.v,
    getGachaCatalogCache: () => gachaCatalogCache_ACC.v,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache_ACC.v = v; },
    getGachaCatalogLoadTask: () => gachaCatalogLoadTask_ACC.v,
    setGachaCatalogLoadTask: (v: any) => { gachaCatalogLoadTask_ACC.v = v; },
  });
  return { applyGachaCustomFieldsToRow, buildGachaCustomFieldHeaderMap, clearGachaFortune, deleteGachaPoolConfig, findGachaDefinitionByInventoryItem, getGachaFortuneProgressView, getGachaItemGrantQuantity, getGachaReservedCustomFieldHeaders, getGachaShopProgressContainers, grantGachaReward, performGachaDraw, renderGachaPanelHtml, showGachaPickupItemDetail, showGachaPoolNameDialog, showGachaRecentRewardDetail, showGachaSettingsDialog, updateGachaFortuneProgressDom, updateGachaPoolTag, updateGachaShopProgressUi, validateGachaCustomFieldsForTargetTable };
}
