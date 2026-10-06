/**
 * wiring / gacha-inventory-wiring.ts — 抽卡/库存/商店装配簇（从 index.ts 迁出，x4-h）。
 */
import { ACTION_ICON_MAP } from '../features/actions/action-icon-map';
import { createLoadDashboardNpcAvatars } from '../features/dashboard/load-npc-avatars';
import { createGetInventoryCharacters } from '../features/dice/get-inventory-characters';
import { createGetInventoryDetailContext } from '../features/dice/get-inventory-detail-context';
import { createGetInventoryEnumOptions } from '../features/dice/get-inventory-enum-options';
import { createGetInventoryMetadataRoot } from '../features/dice/get-inventory-metadata-root';
import { createRefreshInventoryVisualization } from '../features/dice/refresh-inventory-visualization';
import { createRenderInventoryFilterButtons } from '../features/dice/render-inventory-filter-buttons';
import { createRenderInventoryMetadataHtml } from '../features/dice/render-inventory-metadata-html';
import { createSetInventoryMetadataForItem } from '../features/dice/set-inventory-metadata-for-item';
import { createShowInventoryVisualization } from '../features/dice/show-inventory-visualization';
import { createBindEvents } from '../features/events/bind-events';
import { createBindFavoritesEvents } from '../features/favorites/favorites-events';
import { createRenderFavoritesPanel } from '../features/favorites/render-favorites-panel';
import { createApplyGachaTargetColumnOverrides } from '../features/gacha/apply-gacha-target-column-overrides';
import { createAssertGachaRewardNameColumn } from '../features/gacha/assert-gacha-reward-name-column';
import { createBindGachaShardShopInteractions } from '../features/gacha/bind-gacha-shard-shop-interactions';
import { createBuildGachaSettlementKey } from '../features/gacha/build-gacha-settlement-key';
import { createBuildGachaTableResultFromSheet } from '../features/gacha/build-gacha-table-result-from-sheet';
import { createCloseGachaVisualization } from '../features/gacha/close-gacha-visualization';
import { createCloseInventoryVisualization } from '../features/gacha/close-inventory-visualization';
import { createDismantleEquipmentItem } from '../features/gacha/dismantle-equipment-item';
import { createEnsureGachaHeartbeat } from '../features/gacha/ensure-gacha-heartbeat';
import { createExchangeGachaShardItem } from '../features/gacha/exchange-gacha-shard-item';
import { createFindGachaColumnByKeywords } from '../features/gacha/find-gacha-column-by-keywords';
import { createFindGachaTargetColumnIndex } from '../features/gacha/find-gacha-target-column-index';
import { createFindInventoryItemByRow } from '../features/gacha/find-inventory-item-by-row';
import { createFlushGachaHeartbeatProgress } from '../features/gacha/flush-gacha-heartbeat-progress';
import { createShowGachaShardExchangeConfirm } from '../features/gacha/gacha-shard-exchange-confirm';
import { createShowGachaShardShop } from '../features/gacha/gacha-shard-shop';
import { createShowGachaVisualization } from '../features/gacha/gacha-visualization';
import { createGetEquipmentColumnMap } from '../features/gacha/get-equipment-column-map';
import { createGetEquipmentResult } from '../features/gacha/get-equipment-result';
import { createGetGachaChatMessageText } from '../features/gacha/get-gacha-chat-message-text';
import { createGetGachaRewardTargetModuleKey } from '../features/gacha/get-gacha-reward-target-module-key';
import { createGetGachaRewardTargetModuleName } from '../features/gacha/get-gacha-reward-target-module-name';
import { createGetInventoryActionLabel } from '../features/gacha/get-inventory-action-label';
import { createGetInventoryActionPrompt } from '../features/gacha/get-inventory-action-prompt';
import { createGetInventoryActiveFilterCount } from '../features/gacha/get-inventory-active-filter-count';
import { createGetInventoryColumnMap } from '../features/gacha/get-inventory-column-map';
import { createGetInventoryFieldColumnIndex } from '../features/gacha/get-inventory-field-column-index';
import { createGetInventoryFieldLabel } from '../features/gacha/get-inventory-field-label';
import { createGetInventoryGlobalContext } from '../features/gacha/get-inventory-global-context';
import { createGetInventoryMetadataContextKey } from '../features/gacha/get-inventory-metadata-context-key';
import { createGetInventoryMetadataForItem } from '../features/gacha/get-inventory-metadata-for-item';
import { createGetInventoryMetadataScopeKey } from '../features/gacha/get-inventory-metadata-scope-key';
import { createGetInventoryMetadataStore } from '../features/gacha/get-inventory-metadata-store';
import { createGetInventoryResult } from '../features/gacha/get-inventory-result';
import { createGetLegacyInventoryMetadataRoot } from '../features/gacha/get-legacy-inventory-metadata-root';
import { createGetStoredGachaShardShopRarity } from '../features/gacha/get-stored-gacha-shard-shop-rarity';
import { createIsGachaItemOwned } from '../features/gacha/is-gacha-item-owned';
import { createIsGachaTargetTableAliasMatch } from '../features/gacha/is-gacha-target-table-alias-match';
import { createNormalizeGachaMessageId } from '../features/gacha/normalize-gacha-message-id';
import { createRefreshGachaShardShop } from '../features/gacha/refresh-gacha-shard-shop';
import { createRefreshGachaVisualization } from '../features/gacha/refresh-gacha-visualization';
import { createRenderGachaShardShopHtml } from '../features/gacha/render-shard-shop-html';
import { createReopenInventoryItemDetail } from '../features/gacha/reopen-inventory-item-detail';
import { createResolveGachaTargetTableOverride } from '../features/gacha/resolve-gacha-target-table-override';
import { createSaveInventoryMetadataRecord } from '../features/gacha/save-inventory-metadata-record';
import { createSaveInventoryMetadataRoot } from '../features/gacha/save-inventory-metadata-root';
import { createSaveInventoryMetadataStore } from '../features/gacha/save-inventory-metadata-store';
import { createSaveStoredGachaShardShopRarity } from '../features/gacha/save-stored-gacha-shard-shop-rarity';
import { createSettleGachaFortuneForMessage } from '../features/gacha/settle-gacha-fortune-for-message';
import { createStartGachaShopUiRefresh } from '../features/gacha/start-gacha-shop-ui-refresh';
import { createBindFloatingCollapseDrag } from '../features/layout/bind-floating-collapse-drag';
import { createDismantleInventoryItem } from '../features/table/dismantle-inventory-item';
import { createGetLatestAssistantMessageElement } from '../features/table/get-latest-assistant-message-element';
import { createHandleInventoryAction } from '../features/table/handle-inventory-action';
import { createShowInventoryFieldEditDialog } from '../features/table/inventory-field-edit-dialog';
import { createShowInventoryGiftDialog } from '../features/table/inventory-gift-dialog';
import { createShowInventoryItemDetail } from '../features/table/inventory-item-detail';
import { createShowInventoryMetaEditDialog } from '../features/table/inventory-meta-edit-dialog';
import { createRenderInventoryVisualization } from '../features/table/inventory-visualization';
import { createParseEquipmentItems } from '../features/table/parse-equipment-items';
import { createParseInventoryItems } from '../features/table/parse-inventory-items';
import { createRenderCheckSuggestionTableContent } from '../features/table/render-check-suggestion-table-content';
import { createRenderOptionTableContent } from '../features/table/render-option-table-content';
import { createRenderTableContent } from '../features/table/render-table-content';
import { createResolveExistingTableName } from '../features/table/resolve-existing-table-name';
import { createSaveInventoryFieldValue } from '../features/table/save-inventory-field-value';
import { createSetActiveTableNavButton } from '../features/table/set-active-table-nav-button';
import { createShowInventoryDetailMenu } from '../features/table/show-inventory-detail-menu';
import { createSyncInventoryMetadataForRawData } from '../features/table/sync-inventory-metadata-for-raw-data';
import { createWarnMissingTableTarget } from '../features/table/warn-missing-table-target';
import { createClosePanel } from '../features/ui/close-panel';
import { createEnsurePanelNavigationVisible } from '../features/ui/ensure-panel-navigation-visible';
import { createGetDataAreaForRoot } from '../features/ui/get-data-area-for-root';
import { createGetPanelHostMessage } from '../features/ui/get-panel-host-message';
import { createSaveCurrentTabState } from '../features/ui/save-current-tab-state';
import { createSwitchPanel } from '../features/ui/switch-panel';
import { createSyncHostRegenerateButtonVisibility } from '../features/ui/sync-host-regenerate-button-visibility';
import { STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE } from '../shared/storage-keys';

export function createGachaInventoryWiring(deps: any) {
  const { AvatarManager, BookmarkManager, DashboardDataParser, FLOATING_COLLAPSE_DRAG_THRESHOLD, GACHA_CATALOG_RAW_ROW_INDEX_PROP, GACHA_SHARD_EXCHANGE_COST, GACHA_SHOP_UI_REFRESH_MS, INVENTORY_QUALITY_FILTER_META, INVENTORY_SORT_OPTIONS, INVENTORY_TYPE_FILTER_META, INVENTORY_TYPE_OPTIONS, MvuModule, NameAliasRegistry, ValidationRuleManager, addGachaShards, applyStoredPanelHeight, bindChangesEvents, bindCompositionSafeSearchInput, bindGlobalInteractionEvents, buildCrudColumnAliasMap, buildRelationshipGraphTableFromPreset, canWriteMvuPanel, clampFloatingCollapsePosition, cleanupGlobalInteractionFloatingMenus, clearAllPanelStates, clearGachaFortune, cloneRuntimeDataValue, collectCurrentChatAvatarNodes, compareGachaItemDefinitionsForDisplay, consumePendingHumanInputSnapshot, countUnicodeCharacters, createCustomTableNameIconContext, createDefaultGachaState, ensureGachaCatalogLoaded, escapeHtml, executeTableInteractionAction, extractNumericValue, findGachaDefinitionByInventoryItem, findRowIndexByPrimaryKey, formatCssImageUrl, formatGachaItemCardMeta, formatGachaRewardDestinationLabel, getActiveDashboardRelationshipGraphSources, getActiveTabState, getAllGachaItemDefinitions, getAttributeValue, getCheckSuggestionItemsFromTable, getCollapsedState, getConfig, getConfiguredGachaPoolDefinitions, getCore, getCrudColumnNameForHeader, getCrudSqlTableName, getCurrentContextFingerprint, getDashboardModuleConfig, getDatabaseManualUpdateErrorMessage, getDbChatMessages, getElementEmoji, getFullAttributesForCharacter, getGachaActivePoolTag, getGachaItemCustomTableNameIconContext, getGachaItemDescriptionText, getGachaItemEffectText, getGachaItemGrantQuantity, getGachaPoolDefinitions, getGachaPoolDisplayName, getGachaRarityIconClass, getGachaRewardParseResultForItem, getGachaShardLabel, getGachaShopProgressContainers, getGachaState, getGachaTargetColumnEntries, getIconForTableName, getInteractOptionsForRow, getInventoryFilters, getInventoryFiltersCollapsedState, getInventoryPanelTarget, getOptionItemsFromTable, getOptionsCollapsedState, getPanelDragStartHeight, getSheetKeyByTableName, getTableData, getTableStyles, getTavernHostDocument, getTavernHostWindow, getTutorialButtonHtml, getVisibleGachaPoolConfigDefinitions, grantGachaReward, hasGachaCustomFields, hasGachaRewardTableForItem, hydrateCustomTableNameIconsIn, isCheckSuggestionTableName, isFloatingCollapseActive, isGachaItemEnabled, isGachaRarity, isOptionTableName, isTableReversed, normalizeDiffText, normalizeGachaTargetTable, openDatabaseInterface, openDatabaseVisualizerInterface, performGachaDraw, persistRawDataWithGacha, processJsonData, recordGachaFortuneGain, renderChangesPanel, renderCustomTableNameIconContent, renderDashboard, renderDataCardCellContent, renderGachaCustomFieldsDetailsHtml, renderGachaCustomFieldsPreviewHtml, renderGachaItemIconContent, renderGachaPanelHtml, renderGlobalInteractionsPanel, renderInterface, renderThemeIconContent, replaceUserPlaceholders, resetPanelRequestedHeight, runDatabaseManualUpdate, runInSaveQueue, safeDecodeURIComponent, safeEncodeURIComponent, saveActiveTabState, saveCollapsedState, saveConfig, saveDataToDatabase, saveInventoryFilters, saveInventoryFiltersCollapsedState, saveInventoryPanelTarget, saveOptionsCollapsedState, savePanelRequestedHeight, saveRowInstantly, saveStoredGachaStateSnapshot, saveTableStyles, scheduleFixedWrapperBoundsRefresh, scheduleViewportBoundsRefresh, setPanelRequestedHeight, setupOverlayClose, shouldShowReverseButton, showAvatarManager, showCardEditModal, showCellMenu, showContestPanel, showDashboardPresetManager, showDatabaseManualUpdateFailure, showDicePanel, showDiceSystemInputDialog, showEditDialog, showFavoriteEditModal, showGachaPickupItemDetail, showGachaRecentRewardDetail, showGachaSaveError, showGachaSettingsDialog, showMapVisualization, showRelationshipGraph, showSendToTableModal, showSettingsModal, smartInsertToTextarea, startTutorialFromButton, stripSystemInjectedContent, toggleTableReverse, touchGachaActivity, updateGachaFortuneProgressDom, updateGachaPoolTag, updateGachaShopProgressUi, warnTableTemplateIssue, withTableTemplateCheckHint, cachedRawData_ACC, currentDiffMap_ACC, gachaHeartbeatTimer_ACC, gachaShopRootElement_ACC, gachaShopUiRefreshTimer_ACC, hasUnsavedChanges_ACC, isEditingOrder_ACC, lastHumanInputActivityAt_ACC, suppressNextFloatingCollapseClick_ACC, tablePageStates_ACC, tableScrollStates_ACC, tableSearchStates_ACC, tutorialButtonEventsBound_ACC } = deps;
  const dismantleInventoryItem = createDismantleInventoryItem({
    addGachaShards: (...a: any[]) => addGachaShards(...a),
    findGachaDefinitionByInventoryItem: (...a: any[]) => findGachaDefinitionByInventoryItem(...a),
    getGachaItemGrantQuantity: (...a: any[]) => getGachaItemGrantQuantity(...a),
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    isGachaRarity: (...a: any[]) => isGachaRarity(...a),
    persistRawDataWithGacha: (...a: any[]) => persistRawDataWithGacha(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    refreshInventoryVisualization: (...a: any[]) => refreshInventoryVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showDiceSystemInputDialog: (...a: any[]) => showDiceSystemInputDialog(...a),
    showGachaSaveError: (...a: any[]) => showGachaSaveError(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
  });
  const dismantleEquipmentItem = createDismantleEquipmentItem({
    addGachaShards: (...a: any[]) => addGachaShards(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    isGachaRarity: (...a: any[]) => isGachaRarity(...a),
    parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a),
    persistRawDataWithGacha: (...a: any[]) => persistRawDataWithGacha(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    refreshInventoryVisualization: (...a: any[]) => refreshInventoryVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showGachaSaveError: (...a: any[]) => showGachaSaveError(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
  });

  const normalizeGachaMessageId = createNormalizeGachaMessageId({

  });

  const getGachaChatMessageText = createGetGachaChatMessageText({
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    normalizeGachaMessageId: (...a: any[]) => normalizeGachaMessageId(...a),
  });

  const buildGachaSettlementKey = createBuildGachaSettlementKey({
    countUnicodeCharacters: (...a: any[]) => countUnicodeCharacters(...a),
    stripSystemInjectedContent: (...a: any[]) => stripSystemInjectedContent(...a),
  });

  const settleGachaFortuneForMessage = createSettleGachaFortuneForMessage({
    buildGachaSettlementKey: (...a: any[]) => buildGachaSettlementKey(...a),
    consumePendingHumanInputSnapshot: (...a: any[]) => consumePendingHumanInputSnapshot(...a),
    countUnicodeCharacters: (...a: any[]) => countUnicodeCharacters(...a),
    getGachaChatMessageText: (...a: any[]) => getGachaChatMessageText(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    normalizeGachaMessageId: (...a: any[]) => normalizeGachaMessageId(...a),
    recordGachaFortuneGain: (...a: any[]) => recordGachaFortuneGain(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    saveStoredGachaStateSnapshot: (...a: any[]) => saveStoredGachaStateSnapshot(...a),
    stripSystemInjectedContent: (...a: any[]) => stripSystemInjectedContent(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
  });

  const flushGachaHeartbeatProgress = createFlushGachaHeartbeatProgress({
    getGachaState: (...a: any[]) => getGachaState(...a),
    recordGachaFortuneGain: (...a: any[]) => recordGachaFortuneGain(...a),
    saveStoredGachaStateSnapshot: (...a: any[]) => saveStoredGachaStateSnapshot(...a),
    updateGachaFortuneProgressDom: (...a: any[]) => updateGachaFortuneProgressDom(...a),
    getLastHumanInputActivityAt: () => lastHumanInputActivityAt_ACC.v,
  });

  const ensureGachaHeartbeat = createEnsureGachaHeartbeat({
    flushGachaHeartbeatProgress: (...a: any[]) => flushGachaHeartbeatProgress(...a),
    getGachaHeartbeatTimer: () => gachaHeartbeatTimer_ACC.v,
    setGachaHeartbeatTimer: (v: any) => { gachaHeartbeatTimer_ACC.v = v; },
  });

  const startGachaShopUiRefresh = createStartGachaShopUiRefresh({
    getGachaShopProgressContainers: (...a: any[]) => getGachaShopProgressContainers(...a),
    updateGachaShopProgressUi: (...a: any[]) => updateGachaShopProgressUi(...a),
    getGACHA_SHOP_UI_REFRESH_MS: () => GACHA_SHOP_UI_REFRESH_MS,
    getGachaShopUiRefreshTimer: () => gachaShopUiRefreshTimer_ACC.v,
    setGachaShopUiRefreshTimer: (v: any) => { gachaShopUiRefreshTimer_ACC.v = v; },
  });

  const getInventoryMetadataContextKey = createGetInventoryMetadataContextKey({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });

  const getInventoryMetadataStore = createGetInventoryMetadataStore({

  });

  const saveInventoryMetadataStore = createSaveInventoryMetadataStore({

  });

  const getLegacyInventoryMetadataRoot = createGetLegacyInventoryMetadataRoot({
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
  });

  const saveInventoryMetadataRoot = createSaveInventoryMetadataRoot({
    getInventoryMetadataContextKey: (...a: any[]) => getInventoryMetadataContextKey(...a),
    getInventoryMetadataStore: (...a: any[]) => getInventoryMetadataStore(...a),
    saveInventoryMetadataStore: (...a: any[]) => saveInventoryMetadataStore(...a),
  });

  const getInventoryMetadataRoot = createGetInventoryMetadataRoot({
    getInventoryMetadataContextKey: (...a: any[]) => getInventoryMetadataContextKey(...a),
    getInventoryMetadataStore: (...a: any[]) => getInventoryMetadataStore(...a),
    getLegacyInventoryMetadataRoot: (...a: any[]) => getLegacyInventoryMetadataRoot(...a),
    saveInventoryMetadataStore: (...a: any[]) => saveInventoryMetadataStore(...a),
  });

  const getInventoryMetadataScopeKey = createGetInventoryMetadataScopeKey({

  });

  const getInventoryMetadataForItem = createGetInventoryMetadataForItem({
    getInventoryMetadataRoot: (...a: any[]) => getInventoryMetadataRoot(...a),
    getInventoryMetadataScopeKey: (...a: any[]) => getInventoryMetadataScopeKey(...a),
  });

  const setInventoryMetadataForItem = createSetInventoryMetadataForItem({
    getInventoryMetadataRoot: (...a: any[]) => getInventoryMetadataRoot(...a),
    getInventoryMetadataScopeKey: (...a: any[]) => getInventoryMetadataScopeKey(...a),
    saveInventoryMetadataRoot: (...a: any[]) => saveInventoryMetadataRoot(...a),
  });

  const getInventoryGlobalContext = createGetInventoryGlobalContext({
    processJsonData: (...a: any[]) => processJsonData(...a),
    getDashboardDataParser: () => DashboardDataParser,
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
  });

  const syncInventoryMetadataForRawData = createSyncInventoryMetadataForRawData({
    getInventoryGlobalContext: (...a: any[]) => getInventoryGlobalContext(...a),
    getInventoryMetadataRoot: (...a: any[]) => getInventoryMetadataRoot(...a),
    getInventoryMetadataScopeKey: (...a: any[]) => getInventoryMetadataScopeKey(...a),
    getInventoryResult: (...a: any[]) => getInventoryResult(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    saveInventoryMetadataRoot: (...a: any[]) => saveInventoryMetadataRoot(...a),
  });

  const getGachaRewardTargetModuleKey = createGetGachaRewardTargetModuleKey({

  });

  const getGachaRewardTargetModuleName = createGetGachaRewardTargetModuleName({

  });

  const isGachaTargetTableAliasMatch = createIsGachaTargetTableAliasMatch({
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const getGachaTargetTableMatches = (rawData, targetTable: string): Array<{ key: string; sheet: any }> => {
    const tableName = normalizeGachaTargetTable(targetTable);
    if (!tableName || !rawData || typeof rawData !== 'object') return [];
    return Object.entries(rawData as Record<string, any>)
      .filter(([key, sheet]) => {
        if (!key.startsWith('sheet_')) return false;
        return (
          isGachaTargetTableAliasMatch(sheet?.name, tableName) ||
          isGachaTargetTableAliasMatch(key, tableName) ||
          isGachaTargetTableAliasMatch(key.replace(/^sheet_/, ''), tableName) ||
          isGachaTargetTableAliasMatch(getCrudSqlTableName(sheet), tableName)
        );
      })
      .map(([key, sheet]) => ({ key, sheet }));
  };

  const buildGachaTableResultFromSheet = createBuildGachaTableResultFromSheet({
    GACHA_CATALOG_RAW_ROW_INDEX_PROP: GACHA_CATALOG_RAW_ROW_INDEX_PROP,
  });

  const resolveGachaTargetTableOverride = createResolveGachaTargetTableOverride({
    buildGachaTableResultFromSheet: (...a: any[]) => buildGachaTableResultFromSheet(...a),
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getGachaRewardTargetModuleKey: (...a: any[]) => getGachaRewardTargetModuleKey(...a),
    getGachaRewardTargetModuleName: (...a: any[]) => getGachaRewardTargetModuleName(...a),
    getGachaTargetTableMatches: (...a: any[]) => getGachaTargetTableMatches(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const findGachaTargetColumnIndex = createFindGachaTargetColumnIndex({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
    isGachaTargetTableAliasMatch: (...a: any[]) => isGachaTargetTableAliasMatch(...a),
  });

  const applyGachaTargetColumnOverrides = createApplyGachaTargetColumnOverrides({
    findGachaTargetColumnIndex: (...a: any[]) => findGachaTargetColumnIndex(...a),
    getGachaTargetColumnEntries: (...a: any[]) => getGachaTargetColumnEntries(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const assertGachaRewardNameColumn = createAssertGachaRewardNameColumn({
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const getInventoryResult = createGetInventoryResult({
    processJsonData: (...a: any[]) => processJsonData(...a),
    resolveGachaTargetTableOverride: (...a: any[]) => resolveGachaTargetTableOverride(...a),
    getDashboardDataParser: () => DashboardDataParser,
  });

  const findGachaColumnByKeywords = createFindGachaColumnByKeywords({

  });

  const getInventoryColumnMap = createGetInventoryColumnMap({
    applyGachaTargetColumnOverrides: (...a: any[]) => applyGachaTargetColumnOverrides(...a),
    findGachaColumnByKeywords: (...a: any[]) => findGachaColumnByKeywords(...a),
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    DashboardDataParser: DashboardDataParser,
  });

  const parseInventoryItems = createParseInventoryItems({
    assertGachaRewardNameColumn: (...a: any[]) => assertGachaRewardNameColumn(...a),
    getInventoryColumnMap: (...a: any[]) => getInventoryColumnMap(...a),
    getInventoryResult: (...a: any[]) => getInventoryResult(...a),
    GACHA_CATALOG_RAW_ROW_INDEX_PROP: GACHA_CATALOG_RAW_ROW_INDEX_PROP,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
  });

  const getEquipmentResult = createGetEquipmentResult({
    processJsonData: (...a: any[]) => processJsonData(...a),
    resolveGachaTargetTableOverride: (...a: any[]) => resolveGachaTargetTableOverride(...a),
    getDashboardDataParser: () => DashboardDataParser,
  });

  const getEquipmentColumnMap = createGetEquipmentColumnMap({
    applyGachaTargetColumnOverrides: (...a: any[]) => applyGachaTargetColumnOverrides(...a),
    findGachaColumnByKeywords: (...a: any[]) => findGachaColumnByKeywords(...a),
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    DashboardDataParser: DashboardDataParser,
  });

  const parseEquipmentItems = createParseEquipmentItems({
    assertGachaRewardNameColumn: (...a: any[]) => assertGachaRewardNameColumn(...a),
    getEquipmentColumnMap: (...a: any[]) => getEquipmentColumnMap(...a),
    getEquipmentResult: (...a: any[]) => getEquipmentResult(...a),
    GACHA_CATALOG_RAW_ROW_INDEX_PROP: GACHA_CATALOG_RAW_ROW_INDEX_PROP,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
  });

  const getStoredGachaShardShopRarity = createGetStoredGachaShardShopRarity({

  });

  const saveStoredGachaShardShopRarity = createSaveStoredGachaShardShopRarity({

  });

  const isGachaItemOwned = createIsGachaItemOwned({
    getGachaRewardParseResultForItem: (...a: any[]) => getGachaRewardParseResultForItem(...a),
  });

  const renderGachaShardShopHtml = createRenderGachaShardShopHtml({
    compareGachaItemDefinitionsForDisplay: (...a: any[]) => compareGachaItemDefinitionsForDisplay(...a),
    createDefaultGachaState: (...a: any[]) => createDefaultGachaState(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatGachaItemCardMeta: (...a: any[]) => formatGachaItemCardMeta(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getGachaActivePoolTag: (...a: any[]) => getGachaActivePoolTag(...a),
    getGachaItemCustomTableNameIconContext: (...a: any[]) => getGachaItemCustomTableNameIconContext(...a),
    getGachaItemDescriptionText: (...a: any[]) => getGachaItemDescriptionText(...a),
    getGachaItemEffectText: (...a: any[]) => getGachaItemEffectText(...a),
    getGachaPoolDefinitions: (...a: any[]) => getGachaPoolDefinitions(...a),
    getGachaPoolDisplayName: (...a: any[]) => getGachaPoolDisplayName(...a),
    getGachaRarityIconClass: (...a: any[]) => getGachaRarityIconClass(...a),
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getStoredGachaShardShopRarity: (...a: any[]) => getStoredGachaShardShopRarity(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
    isGachaItemOwned: (...a: any[]) => isGachaItemOwned(...a),
    renderGachaCustomFieldsPreviewHtml: (...a: any[]) => renderGachaCustomFieldsPreviewHtml(...a),
    renderGachaItemIconContent: (...a: any[]) => renderGachaItemIconContent(...a),
    GACHA_SHARD_EXCHANGE_COST: GACHA_SHARD_EXCHANGE_COST,
  });

  const bindGachaShardShopInteractions = createBindGachaShardShopInteractions({
    showGachaPickupItemDetail: (...a: any[]) => showGachaPickupItemDetail(...a),
    showGachaShardExchangeConfirm: (...a: any[]) => showGachaShardExchangeConfirm(...a),
  });

  const refreshGachaShardShop = createRefreshGachaShardShop({
    bindGachaShardShopInteractions: (...a: any[]) => bindGachaShardShopInteractions(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderGachaShardShopHtml: (...a: any[]) => renderGachaShardShopHtml(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  const showGachaShardShop = createShowGachaShardShop({
    bindGachaShardShopInteractions: (...a: any[]) => bindGachaShardShopInteractions(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderGachaShardShopHtml: (...a: any[]) => renderGachaShardShopHtml(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  const exchangeGachaShardItem = createExchangeGachaShardItem({
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    formatGachaRewardDestinationLabel: (...a: any[]) => formatGachaRewardDestinationLabel(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    grantGachaReward: (...a: any[]) => grantGachaReward(...a),
    hasGachaRewardTableForItem: (...a: any[]) => hasGachaRewardTableForItem(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    isGachaItemOwned: (...a: any[]) => isGachaItemOwned(...a),
    persistRawDataWithGacha: (...a: any[]) => persistRawDataWithGacha(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    refreshInventoryVisualization: (...a: any[]) => refreshInventoryVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showGachaSaveError: (...a: any[]) => showGachaSaveError(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
    GACHA_SHARD_EXCHANGE_COST: GACHA_SHARD_EXCHANGE_COST,
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  const showGachaShardExchangeConfirm = createShowGachaShardExchangeConfirm({
    createDefaultGachaState: (...a: any[]) => createDefaultGachaState(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    exchangeGachaShardItem: (...a: any[]) => exchangeGachaShardItem(...a),
    formatGachaRewardDestinationLabel: (...a: any[]) => formatGachaRewardDestinationLabel(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getGachaItemCustomTableNameIconContext: (...a: any[]) => getGachaItemCustomTableNameIconContext(...a),
    getGachaRarityIconClass: (...a: any[]) => getGachaRarityIconClass(...a),
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hasGachaCustomFields: (...a: any[]) => hasGachaCustomFields(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    isGachaItemOwned: (...a: any[]) => isGachaItemOwned(...a),
    renderGachaCustomFieldsDetailsHtml: (...a: any[]) => renderGachaCustomFieldsDetailsHtml(...a),
    renderGachaItemIconContent: (...a: any[]) => renderGachaItemIconContent(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    GACHA_SHARD_EXCHANGE_COST: GACHA_SHARD_EXCHANGE_COST,
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  const getInventoryActionLabel = createGetInventoryActionLabel({

  });

  const getInventoryActionPrompt = createGetInventoryActionPrompt({
    getInventoryActionLabel: (...a: any[]) => getInventoryActionLabel(...a),
  });

  const getInventoryCharacters = createGetInventoryCharacters({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    DashboardDataParser: DashboardDataParser,
  });

  const renderInventoryFilterButtons = createRenderInventoryFilterButtons({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const getInventoryActiveFilterCount = createGetInventoryActiveFilterCount({

  });

  const closeGachaVisualization = createCloseGachaVisualization({
    getGachaShopRootElement: () => gachaShopRootElement_ACC.v,
    setGachaShopRootElement: (v: any) => { gachaShopRootElement_ACC.v = v; },
    getGachaShopUiRefreshTimer: () => gachaShopUiRefreshTimer_ACC.v,
    setGachaShopUiRefreshTimer: (v: any) => { gachaShopUiRefreshTimer_ACC.v = v; },
  });

  const refreshGachaVisualization = createRefreshGachaVisualization({
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getGachaShopProgressContainers: (...a: any[]) => getGachaShopProgressContainers(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderGachaPanelHtml: (...a: any[]) => renderGachaPanelHtml(...a),
    updateGachaShopProgressUi: (...a: any[]) => updateGachaShopProgressUi(...a),
    gachaShopRootElement: gachaShopRootElement_ACC.v,
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  const showGachaVisualization = createShowGachaVisualization({
    closeGachaVisualization: (...a: any[]) => closeGachaVisualization(...a),
    closeInventoryVisualization: (...a: any[]) => closeInventoryVisualization(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderGachaPanelHtml: (...a: any[]) => renderGachaPanelHtml(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    startGachaShopUiRefresh: (...a: any[]) => startGachaShopUiRefresh(...a),
    updateGachaShopProgressUi: (...a: any[]) => updateGachaShopProgressUi(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getGachaShopRootElement: () => gachaShopRootElement_ACC.v,
    setGachaShopRootElement: (v: any) => { gachaShopRootElement_ACC.v = v; },
  });

  const closeInventoryVisualization = createCloseInventoryVisualization({

  });

  const renderInventoryVisualization = createRenderInventoryVisualization({
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    getInventoryActiveFilterCount: (...a: any[]) => getInventoryActiveFilterCount(...a),
    getInventoryFilters: (...a: any[]) => getInventoryFilters(...a),
    getInventoryFiltersCollapsedState: (...a: any[]) => getInventoryFiltersCollapsedState(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderInventoryFilterButtons: (...a: any[]) => renderInventoryFilterButtons(...a),
    renderThemeIconContent: (...a: any[]) => renderThemeIconContent(...a),
    INVENTORY_QUALITY_FILTER_META: INVENTORY_QUALITY_FILTER_META,
    INVENTORY_SORT_OPTIONS: INVENTORY_SORT_OPTIONS,
    INVENTORY_TYPE_FILTER_META: INVENTORY_TYPE_FILTER_META,
    getInventoryPanelTarget: (...a: any[]) => getInventoryPanelTarget(...a),
    parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a),
  });

  const refreshInventoryVisualization = createRefreshInventoryVisualization({
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderInventoryVisualization: (...a: any[]) => renderInventoryVisualization(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  const showInventoryVisualization = createShowInventoryVisualization({
    closeGachaVisualization: (...a: any[]) => closeGachaVisualization(...a),
    closeInventoryVisualization: (...a: any[]) => closeInventoryVisualization(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderInventoryVisualization: (...a: any[]) => renderInventoryVisualization(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getInventoryPanelTarget: (...a: any[]) => getInventoryPanelTarget(...a),
    saveInventoryPanelTarget: (...a: any[]) => saveInventoryPanelTarget(...a),
  });

  const findInventoryItemByRow = createFindInventoryItemByRow({
    getTableData: (...a: any[]) => getTableData(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a),
  });

  const getInventoryDetailContext = createGetInventoryDetailContext({
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a),
  });

  const getInventoryFieldLabel = createGetInventoryFieldLabel({

  });

  const getInventoryFieldColumnIndex = createGetInventoryFieldColumnIndex({
    getInventoryColumnMap: (...a: any[]) => getInventoryColumnMap(...a),
  });

  const getInventoryEnumOptions = createGetInventoryEnumOptions({
    INVENTORY_TYPE_OPTIONS: INVENTORY_TYPE_OPTIONS,
    ValidationRuleManager: ValidationRuleManager,
  });

  const reopenInventoryItemDetail = createReopenInventoryItemDetail({
    showInventoryItemDetail: (...a: any[]) => showInventoryItemDetail(...a),
  });

  const saveInventoryMetadataRecord = createSaveInventoryMetadataRecord({
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    reopenInventoryItemDetail: (...a: any[]) => reopenInventoryItemDetail(...a),
    setInventoryMetadataForItem: (...a: any[]) => setInventoryMetadataForItem(...a),
  });

  const saveInventoryFieldValue = createSaveInventoryFieldValue({
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    getInventoryFieldColumnIndex: (...a: any[]) => getInventoryFieldColumnIndex(...a),
    getInventoryFieldLabel: (...a: any[]) => getInventoryFieldLabel(...a),
    getInventoryMetadataForItem: (...a: any[]) => getInventoryMetadataForItem(...a),
    reopenInventoryItemDetail: (...a: any[]) => reopenInventoryItemDetail(...a),
    saveInventoryMetadataRecord: (...a: any[]) => saveInventoryMetadataRecord(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
  });

  const renderInventoryMetadataHtml = createRenderInventoryMetadataHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const showInventoryFieldEditDialog = createShowInventoryFieldEditDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    getInventoryEnumOptions: (...a: any[]) => getInventoryEnumOptions(...a),
    getInventoryFieldColumnIndex: (...a: any[]) => getInventoryFieldColumnIndex(...a),
    getInventoryFieldLabel: (...a: any[]) => getInventoryFieldLabel(...a),
    getInventoryMetadataForItem: (...a: any[]) => getInventoryMetadataForItem(...a),
    saveInventoryFieldValue: (...a: any[]) => saveInventoryFieldValue(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showEditDialog: (...a: any[]) => showEditDialog(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
  });

  const showInventoryMetaEditDialog = createShowInventoryMetaEditDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    getInventoryMetadataForItem: (...a: any[]) => getInventoryMetadataForItem(...a),
    saveInventoryMetadataRecord: (...a: any[]) => saveInventoryMetadataRecord(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  const showInventoryDetailMenu = createShowInventoryDetailMenu({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    getInventoryFieldLabel: (...a: any[]) => getInventoryFieldLabel(...a),
    reopenInventoryItemDetail: (...a: any[]) => reopenInventoryItemDetail(...a),
    showCardEditModal: (...a: any[]) => showCardEditModal(...a),
    showInventoryFieldEditDialog: (...a: any[]) => showInventoryFieldEditDialog(...a),
    showInventoryMetaEditDialog: (...a: any[]) => showInventoryMetaEditDialog(...a),
  });

  const showInventoryItemDetail = createShowInventoryItemDetail({
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    dismantleInventoryItem: (...a: any[]) => dismantleInventoryItem(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    executeTableInteractionAction: (...a: any[]) => executeTableInteractionAction(...a),
    findInventoryItemByRow: (...a: any[]) => findInventoryItemByRow(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    getInteractOptionsForRow: (...a: any[]) => getInteractOptionsForRow(...a),
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    getInventoryMetadataForItem: (...a: any[]) => getInventoryMetadataForItem(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    handleInventoryAction: (...a: any[]) => handleInventoryAction(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    isGachaRarity: (...a: any[]) => isGachaRarity(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderInventoryMetadataHtml: (...a: any[]) => renderInventoryMetadataHtml(...a),
    renderThemeIconContent: (...a: any[]) => renderThemeIconContent(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showInventoryGiftDialog: (...a: any[]) => showInventoryGiftDialog(...a),
    ACTION_ICON_MAP: ACTION_ICON_MAP,
    getCachedRawData: () => cachedRawData_ACC.v,
    dismantleEquipmentItem: (...a: any[]) => dismantleEquipmentItem(...a),
  });

  const showInventoryGiftDialog = createShowInventoryGiftDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findInventoryItemByRow: (...a: any[]) => findInventoryItemByRow(...a),
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getInventoryCharacters: (...a: any[]) => getInventoryCharacters(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    AvatarManager: AvatarManager,
    smartInsertToTextarea: smartInsertToTextarea,
    getCachedRawData: () => cachedRawData_ACC.v,
  });
  const handleInventoryAction = createHandleInventoryAction({
    closeInventoryVisualization: (...a: any[]) => closeInventoryVisualization(...a),
    findInventoryItemByRow: (...a: any[]) => findInventoryItemByRow(...a),
    getCore: (...a: any[]) => getCore(...a),
    getInventoryActionPrompt: (...a: any[]) => getInventoryActionPrompt(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    resolveExistingTableName: (...a: any[]) => resolveExistingTableName(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
    setActiveTableNavButton: (...a: any[]) => setActiveTableNavButton(...a),
    showInventoryGiftDialog: (...a: any[]) => showInventoryGiftDialog(...a),
    showInventoryItemDetail: (...a: any[]) => showInventoryItemDetail(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    warnMissingTableTarget: (...a: any[]) => warnMissingTableTarget(...a),
    STORAGE_KEY_DASHBOARD_ACTIVE: STORAGE_KEY_DASHBOARD_ACTIVE,
    STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE: STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
  });

  // [修复] 仪表盘NPC头像异步加载（支持IndexedDB本地头像）
  const loadDashboardNpcAvatars = createLoadDashboardNpcAvatars({
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    AvatarManager: AvatarManager,
    NameAliasRegistry: NameAliasRegistry,
  });

  // ========== [新增] 收藏夹面板渲染函数 ==========
  const renderFavoritesPanel = createRenderFavoritesPanel({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    renderDataCardCellContent: (...a: any[]) => renderDataCardCellContent(...a),
  });

  // ========== [新增] 收藏夹面板事件绑定 ==========
  const bindFavoritesEvents = createBindFavoritesEvents({
    closePanel: (...a: any[]) => closePanel(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    renderFavoritesPanel: (...a: any[]) => renderFavoritesPanel(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    showFavoriteEditModal: (...a: any[]) => showFavoriteEditModal(...a),
    showSendToTableModal: (...a: any[]) => showSendToTableModal(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  const renderOptionTableContent = createRenderOptionTableContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getOptionItemsFromTable: (...a: any[]) => getOptionItemsFromTable(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    getTablePageStates: () => tablePageStates_ACC.v,
    getTableSearchStates: () => tableSearchStates_ACC.v,
  });

  const renderCheckSuggestionTableContent = createRenderCheckSuggestionTableContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCheckSuggestionItemsFromTable: (...a: any[]) => getCheckSuggestionItemsFromTable(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    getTablePageStates: () => tablePageStates_ACC.v,
    getTableSearchStates: () => tableSearchStates_ACC.v,
  });

  const renderTableContent = createRenderTableContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findRowIndexByPrimaryKey: (...a: any[]) => findRowIndexByPrimaryKey(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getInteractOptionsForRow: (...a: any[]) => getInteractOptionsForRow(...a),
    getSheetKeyByTableName: (...a: any[]) => getSheetKeyByTableName(...a),
    getTableStyles: (...a: any[]) => getTableStyles(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    isCheckSuggestionTableName: (...a: any[]) => isCheckSuggestionTableName(...a),
    isOptionTableName: (...a: any[]) => isOptionTableName(...a),
    isTableReversed: (...a: any[]) => isTableReversed(...a),
    renderCheckSuggestionTableContent: (...a: any[]) => renderCheckSuggestionTableContent(...a),
    renderOptionTableContent: (...a: any[]) => renderOptionTableContent(...a),
    renderDataCardCellContent: (...a: any[]) => renderDataCardCellContent(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    shouldShowReverseButton: (...a: any[]) => shouldShowReverseButton(...a),
    BookmarkManager: BookmarkManager,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    getTablePageStates: () => tablePageStates_ACC.v,
    getTableSearchStates: () => tableSearchStates_ACC.v,
  });

  // [新增] 通用状态保存函数 (面板滚动 + 卡片内部滚动)
  const saveCurrentTabState = createSaveCurrentTabState({
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableScrollStates: () => tableScrollStates_ACC.v,
  });

  const getDataAreaForRoot = createGetDataAreaForRoot({
    getCore: (...a: any[]) => getCore(...a),
  });

  const getLatestAssistantMessageElement = createGetLatestAssistantMessageElement({
    getCore: (...a: any[]) => getCore(...a),
  });

  const getPanelHostMessage = createGetPanelHostMessage({
    getCore: (...a: any[]) => getCore(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    getLatestAssistantMessageElement: (...a: any[]) => getLatestAssistantMessageElement(...a),
  });

  const syncHostRegenerateButtonVisibility = createSyncHostRegenerateButtonVisibility({
    getCore: (...a: any[]) => getCore(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    getPanelHostMessage: (...a: any[]) => getPanelHostMessage(...a),
  });

  const ensurePanelNavigationVisible = createEnsurePanelNavigationVisible({
    getConfig: (...a: any[]) => getConfig(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    scheduleFixedWrapperBoundsRefresh: (...a: any[]) => scheduleFixedWrapperBoundsRefresh(...a),
    scheduleViewportBoundsRefresh: (...a: any[]) => scheduleViewportBoundsRefresh(...a),
  });

  const closePanel = createClosePanel({
    cleanupGlobalInteractionFloatingMenus: (...a: any[]) => cleanupGlobalInteractionFloatingMenus(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
    saveCurrentTabState: (...a: any[]) => saveCurrentTabState(...a),
    syncHostRegenerateButtonVisibility: (...a: any[]) => syncHostRegenerateButtonVisibility(...a),
  });

  const resolveExistingTableName = createResolveExistingTableName({
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  const warnMissingTableTarget = createWarnMissingTableTarget({
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
  });

  const setActiveTableNavButton = createSetActiveTableNavButton({
    getCore: (...a: any[]) => getCore(...a),
  });

  /**
   * 面板切换工具函数 - 快速更新面板内容（无过渡延迟）
   * 由于CSS已改为 opacity + visibility 过渡，即使快速更新也不会闪烁
   * @param {Function} updateContentFn - 更新面板内容的函数，接收 $panel 参数
   */
  const switchPanel = createSwitchPanel({
    applyStoredPanelHeight: (...a: any[]) => applyStoredPanelHeight(...a),
    ensurePanelNavigationVisible: (...a: any[]) => ensurePanelNavigationVisible(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    syncHostRegenerateButtonVisibility: (...a: any[]) => syncHostRegenerateButtonVisibility(...a),
  });

  const bindFloatingCollapseDrag = createBindFloatingCollapseDrag({
    clampFloatingCollapsePosition: (...a: any[]) => clampFloatingCollapsePosition(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    saveConfig: (...a: any[]) => saveConfig(...a),
    FLOATING_COLLAPSE_DRAG_THRESHOLD: FLOATING_COLLAPSE_DRAG_THRESHOLD,
    getSuppressNextFloatingCollapseClick: () => suppressNextFloatingCollapseClick_ACC.v,
    setSuppressNextFloatingCollapseClick: (v: any) => { suppressNextFloatingCollapseClick_ACC.v = v; },
  });

  const bindEvents = createBindEvents({
    bindCompositionSafeSearchInput: (...a: any[]) => bindCompositionSafeSearchInput(...a),
    bindFloatingCollapseDrag: (...a: any[]) => bindFloatingCollapseDrag(...a),
    bindGlobalInteractionEvents: (...a: any[]) => bindGlobalInteractionEvents(...a),
    buildRelationshipGraphTableFromPreset: (...a: any[]) => buildRelationshipGraphTableFromPreset(...a),
    canWriteMvuPanel: (...a: any[]) => canWriteMvuPanel(...a),
    cleanupGlobalInteractionFloatingMenus: (...a: any[]) => cleanupGlobalInteractionFloatingMenus(...a),
    clearAllPanelStates: (...a: any[]) => clearAllPanelStates(...a),
    clearGachaFortune: (...a: any[]) => clearGachaFortune(...a),
    closeGachaVisualization: (...a: any[]) => closeGachaVisualization(...a),
    closeInventoryVisualization: (...a: any[]) => closeInventoryVisualization(...a),
    closePanel: (...a: any[]) => closePanel(...a),
    collectCurrentChatAvatarNodes: (...a: any[]) => collectCurrentChatAvatarNodes(...a),
    ensurePanelNavigationVisible: (...a: any[]) => ensurePanelNavigationVisible(...a),
    executeTableInteractionAction: (...a: any[]) => executeTableInteractionAction(...a),
    extractNumericValue: (...a: any[]) => extractNumericValue(...a),
    findRowIndexByPrimaryKey: (...a: any[]) => findRowIndexByPrimaryKey(...a),
    getActiveDashboardRelationshipGraphSources: (...a: any[]) => getActiveDashboardRelationshipGraphSources(...a),
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getCollapsedState: (...a: any[]) => getCollapsedState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    getDatabaseManualUpdateErrorMessage: (...a: any[]) => getDatabaseManualUpdateErrorMessage(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getInventoryFilters: (...a: any[]) => getInventoryFilters(...a),
    getOptionsCollapsedState: (...a: any[]) => getOptionsCollapsedState(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getSheetKeyByTableName: (...a: any[]) => getSheetKeyByTableName(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTableStyles: (...a: any[]) => getTableStyles(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    openDatabaseInterface: (...a: any[]) => openDatabaseInterface(...a),
    openDatabaseVisualizerInterface: (...a: any[]) => openDatabaseVisualizerInterface(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshInventoryVisualization: (...a: any[]) => refreshInventoryVisualization(...a),
    renderDataCardCellContent: (...a: any[]) => renderDataCardCellContent(...a),
    renderFavoritesPanel: (...a: any[]) => renderFavoritesPanel(...a),
    renderGlobalInteractionsPanel: (...a: any[]) => renderGlobalInteractionsPanel(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    resolveExistingTableName: (...a: any[]) => resolveExistingTableName(...a),
    runDatabaseManualUpdate: (...a: any[]) => runDatabaseManualUpdate(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
    saveCollapsedState: (...a: any[]) => saveCollapsedState(...a),
    saveCurrentTabState: (...a: any[]) => saveCurrentTabState(...a),
    saveInventoryFilters: (...a: any[]) => saveInventoryFilters(...a),
    saveInventoryFiltersCollapsedState: (...a: any[]) => saveInventoryFiltersCollapsedState(...a),
    saveOptionsCollapsedState: (...a: any[]) => saveOptionsCollapsedState(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    saveStoredGachaShardShopRarity: (...a: any[]) => saveStoredGachaShardShopRarity(...a),
    saveTableStyles: (...a: any[]) => saveTableStyles(...a),
    setActiveTableNavButton: (...a: any[]) => setActiveTableNavButton(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAvatarManager: (...a: any[]) => showAvatarManager(...a),
    showDatabaseManualUpdateFailure: (...a: any[]) => showDatabaseManualUpdateFailure(...a),
    showInventoryDetailMenu: (...a: any[]) => showInventoryDetailMenu(...a),
    showInventoryVisualization: (...a: any[]) => showInventoryVisualization(...a),
    startTutorialFromButton: (...a: any[]) => startTutorialFromButton(...a),
    switchPanel: (...a: any[]) => switchPanel(...a),
    syncHostRegenerateButtonVisibility: (...a: any[]) => syncHostRegenerateButtonVisibility(...a),
    toggleTableReverse: (...a: any[]) => toggleTableReverse(...a),
    updateGachaPoolTag: (...a: any[]) => updateGachaPoolTag(...a),
    warnMissingTableTarget: (...a: any[]) => warnMissingTableTarget(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    bindChangesEvents: (...a: any[]) => bindChangesEvents(...a),
    bindFavoritesEvents: (...a: any[]) => bindFavoritesEvents(...a),
    getInteractOptionsForRow: (...a: any[]) => getInteractOptionsForRow(...a),
    handleInventoryAction: (...a: any[]) => handleInventoryAction(...a),
    loadDashboardNpcAvatars: (...a: any[]) => loadDashboardNpcAvatars(...a),
    performGachaDraw: (...a: any[]) => performGachaDraw(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    renderDashboard: (...a: any[]) => renderDashboard(...a),
    saveDataToDatabase: (...a: any[]) => saveDataToDatabase(...a),
    showCellMenu: (...a: any[]) => showCellMenu(...a),
    showContestPanel: (...a: any[]) => showContestPanel(...a),
    showDashboardPresetManager: (...a: any[]) => showDashboardPresetManager(...a),
    showDicePanel: (...a: any[]) => showDicePanel(...a),
    showGachaPickupItemDetail: (...a: any[]) => showGachaPickupItemDetail(...a),
    showGachaRecentRewardDetail: (...a: any[]) => showGachaRecentRewardDetail(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
    showGachaShardExchangeConfirm: (...a: any[]) => showGachaShardExchangeConfirm(...a),
    showGachaShardShop: (...a: any[]) => showGachaShardShop(...a),
    showGachaVisualization: (...a: any[]) => showGachaVisualization(...a),
    showMapVisualization: (...a: any[]) => showMapVisualization(...a),
    showRelationshipGraph: (...a: any[]) => showRelationshipGraph(...a),
    showSettingsModal: (...a: any[]) => showSettingsModal(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    BookmarkManager: BookmarkManager,
    DashboardDataParser: DashboardDataParser,
    MvuModule: MvuModule,
    STORAGE_KEY_DASHBOARD_ACTIVE: STORAGE_KEY_DASHBOARD_ACTIVE,
    STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE: STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
    getCachedRawData: () => cachedRawData_ACC.v,
    getIsEditingOrder: () => isEditingOrder_ACC.v,
    getTablePageStates: () => tablePageStates_ACC.v,
    getTableScrollStates: () => tableScrollStates_ACC.v,
    getTableSearchStates: () => tableSearchStates_ACC.v,
    getHasUnsavedChanges: () => hasUnsavedChanges_ACC.v,
    setHasUnsavedChanges: (v: any) => { hasUnsavedChanges_ACC.v = v; },
    getSuppressNextFloatingCollapseClick: () => suppressNextFloatingCollapseClick_ACC.v,
    setSuppressNextFloatingCollapseClick: (v: any) => { suppressNextFloatingCollapseClick_ACC.v = v; },
    getTutorialButtonEventsBound: () => tutorialButtonEventsBound_ACC.v,
    setTutorialButtonEventsBound: (v: any) => { tutorialButtonEventsBound_ACC.v = v; },
    dismantleEquipmentItem: (...a: any[]) => dismantleEquipmentItem(...a),
    isGachaRarity: (...a: any[]) => isGachaRarity(...a),
    saveInventoryPanelTarget: (...a: any[]) => saveInventoryPanelTarget(...a),
  });
  return { showInventoryVisualization, bindEvents, bindFavoritesEvents, closeGachaVisualization, closePanel, ensureGachaHeartbeat, ensurePanelNavigationVisible, flushGachaHeartbeatProgress, getDataAreaForRoot, getInventoryGlobalContext, getInventoryMetadataForItem, loadDashboardNpcAvatars, parseEquipmentItems, parseInventoryItems, refreshGachaShardShop, refreshGachaVisualization, refreshInventoryVisualization, renderFavoritesPanel, renderTableContent, resolveExistingTableName, saveCurrentTabState, setActiveTableNavButton, setInventoryMetadataForItem, settleGachaFortuneForMessage, showGachaShardShop, showGachaVisualization, startGachaShopUiRefresh, syncHostRegenerateButtonVisibility, syncInventoryMetadataForRawData, warnMissingTableTarget };
}
