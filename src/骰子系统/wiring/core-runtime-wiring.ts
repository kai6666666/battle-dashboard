/**
 * wiring / core-runtime-wiring.ts — 核心运行时/工具装配簇（从 index.ts 迁出，x4-k）。
 */
import { ACTION_ICON_MAP } from '../features/actions/action-icon-map';
import type { CustomTableNameIconContext } from '../shared/index-local-types';
import { createGetActionsForTable } from '../features/actions/get-actions-for-table';
import { createGetGMConfig } from '../features/actions/get-gm-config';
import { createGetCurrentContextFingerprint } from '../features/chat/get-current-context-fingerprint';
import { createCreateDashboardPresetEditorTemplate } from '../features/dashboard/create-dashboard-preset-editor-template';
import { createDashboardDataParser } from '../features/dashboard/dashboard-data-parser';
import { createDashboardModuleSectionKind } from '../features/dashboard/dashboard-module-section-kind';
import { DASHBOARD_TABLE_CONFIG } from '../features/dashboard/dashboard-table-config';
import { createGetActiveDashboardRelationshipGraphSources } from '../features/dashboard/get-active-dashboard-relationship-graph-sources';
import { createGetDashboardModuleConfig } from '../features/dashboard/get-dashboard-module-config';
import { createGetDashboardModuleKeysForTableName } from '../features/dashboard/get-dashboard-module-keys-for-table-name';
import { createGetDashboardRuntimeConfig } from '../features/dashboard/get-dashboard-runtime-config';
import { createNormalizeDashboardPresetModules } from '../features/dashboard/normalize-dashboard-preset-modules';
import { createParseDashboardPresetJson } from '../features/dashboard/parse-dashboard-preset-json';
import { createResolveDashboardCustomTableNameIconContextInfo } from '../features/dashboard/resolve-dashboard-custom-table-name-icon-context-info';
import { createResolveDashboardCustomTableNameIconRowName } from '../features/dashboard/resolve-dashboard-custom-table-name-icon-row-name';
import { createResolveDashboardGlobalInteractionSectionKind } from '../features/dashboard/resolve-dashboard-global-interaction-section-kind';
import { createGetResultBadgeClass } from '../features/dice/get-result-badge-class';
import { createParseAttributeString } from '../features/dice/parse-attribute-string';
import { createBuildGlobalInteractionGroups } from '../features/interactions/build-global-interaction-groups';
import { createCreateGlobalInteractionSections } from '../features/interactions/create-global-interaction-sections';
import { createGlobalInteractionNameHeaders } from '../features/interactions/global-interaction-name-headers';
import { createGlobalInteractionNonNameHeaderKeywords } from '../features/interactions/global-interaction-non-name-header-keywords';
import { createResolveGlobalInteractionRowTitle } from '../features/interactions/resolve-global-interaction-row-title';
import { createResolveGlobalInteractionSectionMeta } from '../features/interactions/resolve-global-interaction-section-meta';
import { createDashboardPresetManager } from '../features/presets/dashboard-preset-manager';
import { createParseJsoncDocument } from '../features/presets/parse-jsonc-document';
import { createValidateJsoncEditorConfig } from '../features/presets/validate-jsonc-editor-config';
import { createCreateRegexRuleSignature } from '../features/regex/create-regex-rule-signature';
import { createActionButtons } from '../features/table/action-buttons';
import { createAcuDatabaseLegacyManualUpdateButtonSelector } from '../features/table/acu-database-legacy-manual-update-button-selector';
import { createAcuDatabaseManualUpdateActionSelector } from '../features/table/acu-database-manual-update-action-selector';
import { createAcuDatabaseManualUpdateApiMethods } from '../features/table/acu-database-manual-update-api-methods';
import { createAcuDatabaseManualUpdateButtonPollMs } from '../features/table/acu-database-manual-update-button-poll-ms';
import { createAcuDatabaseManualUpdateButtonWaitMs } from '../features/table/acu-database-manual-update-button-wait-ms';
import { createAcuDatabaseNewUiApiMethods } from '../features/table/acu-database-new-ui-api-methods';
import { createAnalyzeCustomTableNameIconPackImport } from '../features/table/analyze-custom-table-name-icon-pack-import';
import { createBuildCustomTableNameIconPack } from '../features/table/build-custom-table-name-icon-pack';
import { createBuildCustomTableNameIconPackEntry } from '../features/table/build-custom-table-name-icon-pack-entry';
import { createBuildGlobalInteractionSearchText } from '../features/table/build-global-interaction-search-text';
import { createClearPendingDeletions } from '../features/table/clear-pending-deletions';
import { createClickDatabaseNewUiFormFillNavigation } from '../features/table/click-database-new-ui-form-fill-navigation';
import { createCreateCustomTableNameIconManagerCandidate } from '../features/table/create-custom-table-name-icon-manager-candidate';
import { createCreateSheetDataFingerprint } from '../features/table/create-sheet-data-fingerprint';
import { createShowCustomTableNameIconManager } from '../features/table/custom-icon-manager-dialog';
import { createCustomTableNameIconAllowedLocalMimeTypes } from '../features/table/custom-table-name-icon-allowed-local-mime-types';
import { createCustomTableNameIconAllowedPanelSections } from '../features/table/custom-table-name-icon-allowed-panel-sections';
import { createCustomTableNameIconDashboardModuleContexts } from '../features/table/custom-table-name-icon-dashboard-module-contexts';
import { createCustomTableNameIconDeniedModules } from '../features/table/custom-table-name-icon-denied-modules';
import { createCustomTableNameIconDeniedSections } from '../features/table/custom-table-name-icon-denied-sections';
import { createCustomTableNameIconDeniedTableNames } from '../features/table/custom-table-name-icon-denied-table-names';
import { createCustomTableNameIconManagerDirectModuleBySection } from '../features/table/custom-table-name-icon-manager-direct-module-by-section';
import { createCustomTableNameIconManagerModuleLabels } from '../features/table/custom-table-name-icon-manager-module-labels';
import { createCustomTableNameIconManagerSectionLabels } from '../features/table/custom-table-name-icon-manager-section-labels';
import { createCustomTableNameIconModuleIds } from '../features/table/custom-table-name-icon-module-ids';
import { createCustomTableNameIconSections } from '../features/table/custom-table-name-icon-sections';
import { createDebugGlobalInteraction } from '../features/table/debug-global-interaction';
import { createDedupeInteractionActions } from '../features/table/dedupe-interaction-actions';
import { createDownloadCustomTableNameIconPack } from '../features/table/download-custom-table-name-icon-pack';
import { createExecuteTableInteractionAction } from '../features/table/execute-table-interaction-action';
import { createFindDatabaseNewUiManualUpdateButton } from '../features/table/find-database-new-ui-manual-update-button';
import { createGetCustomTableNameIconContextKey } from '../features/table/get-custom-table-name-icon-context-key';
import { createGetCustomTableNameIconFallbackContexts } from '../features/table/get-custom-table-name-icon-fallback-contexts';
import { createGetCustomTableNameIconImageUrlValidationError } from '../features/table/get-custom-table-name-icon-image-url-validation-error';
import { createGetCustomTableNameIconLocalFileValidationError } from '../features/table/get-custom-table-name-icon-local-file-validation-error';
import { createGetCustomTableNameIconManagerCandidates } from '../features/table/get-custom-table-name-icon-manager-candidates';
import { createGetCustomTableNameIconManagerContextLabel } from '../features/table/get-custom-table-name-icon-manager-context-label';
import { createGetCustomTableNameIconManagerEntryAsset } from '../features/table/get-custom-table-name-icon-manager-entry-asset';
import { createGetCustomTableNameIconManagerInvalidSourceText } from '../features/table/get-custom-table-name-icon-manager-invalid-source-text';
import { createGetCustomTableNameIconManagerLocalKey } from '../features/table/get-custom-table-name-icon-manager-local-key';
import { createGetCustomTableNameIconManagerModuleLabel } from '../features/table/get-custom-table-name-icon-manager-module-label';
import { createGetCustomTableNameIconManagerRawSheets } from '../features/table/get-custom-table-name-icon-manager-raw-sheets';
import { createGetCustomTableNameIconManagerSectionLabel } from '../features/table/get-custom-table-name-icon-manager-section-label';
import { createGetCustomTableNameIconManagerSourceLabel } from '../features/table/get-custom-table-name-icon-manager-source-label';
import { createGetCustomTableNameIconPackImportSummaryText } from '../features/table/get-custom-table-name-icon-pack-import-summary-text';
import { createGetDatabaseManualUpdateErrorMessage } from '../features/table/get-database-manual-update-error-message';
import { createGetGlobalInteractionActionRuleGroups } from '../features/table/get-global-interaction-action-rule-groups';
import { createGetGlobalInteractionRuleKeywords } from '../features/table/get-global-interaction-rule-keywords';
import { createGetIconForTableName } from '../features/table/get-icon-for-table-name';
import { createGetInteractOptionsForRow } from '../features/table/get-interact-options-for-row';
import { createGetMatchedGlobalInteractionRuleKeywords } from '../features/table/get-matched-global-interaction-rule-keywords';
import { createGetPendingDeletions } from '../features/table/get-pending-deletions';
import { createGlobalInteractionDefaultSectionMeta } from '../features/table/global-interaction-default-section-meta';
import { createGlobalInteractionNameHeaderKeywords } from '../features/table/global-interaction-name-header-keywords';
import { createHasDatabaseManualUpdateSurface } from '../features/table/has-database-manual-update-surface';
import { createHasDatabaseNewUiRuntime } from '../features/table/has-database-new-ui-runtime';
import { createIsCustomTableNameIconContextAllowed } from '../features/table/is-custom-table-name-icon-context-allowed';
import { createIsCustomTableNameIconImageUrlValid } from '../features/table/is-custom-table-name-icon-image-url-valid';
import { createIsCustomTableNameIconModuleId } from '../features/table/is-custom-table-name-icon-module-id';
import { createIsCustomTableNameIconSection } from '../features/table/is-custom-table-name-icon-section';
import { createIsCustomTableNameIconSvgMimeType } from '../features/table/is-custom-table-name-icon-svg-mime-type';
import { createIsCustomTableNameIconTableDenied } from '../features/table/is-custom-table-name-icon-table-denied';
import { createIsDatabaseButtonDisabled } from '../features/table/is-database-button-disabled';
import { createIsDatabaseManualUpdateActionButton } from '../features/table/is-database-manual-update-action-button';
import { createIsLikelyGlobalInteractionNameHeader } from '../features/table/is-likely-global-interaction-name-header';
import { createIsPureIndexCell } from '../features/table/is-pure-index-cell';
import { createIsRelationshipCell } from '../features/table/is-relationship-cell';
import { createIsSameSheetData } from '../features/table/is-same-sheet-data';
import { createNormalizeCollapseStyle } from '../features/table/normalize-collapse-style';
import { createNormalizeCustomTableNameIconContext } from '../features/table/normalize-custom-table-name-icon-context';
import { createNormalizeCustomTableNameIconEntry } from '../features/table/normalize-custom-table-name-icon-entry';
import { createNormalizeCustomTableNameIconKeyPart } from '../features/table/normalize-custom-table-name-icon-key-part';
import { createNormalizeCustomTableNameIconPackEntry } from '../features/table/normalize-custom-table-name-icon-pack-entry';
import { createNormalizeCustomTableNameIconPackEntryMetadata } from '../features/table/normalize-custom-table-name-icon-pack-entry-metadata';
import { createNormalizeDatabaseUiText, isDatabaseManualUpdateButtonTextImpl as isDatabaseManualUpdateButtonText } from '../features/table/normalize-database-ui-text';
import { createNormalizeGlobalInteractionCategoryText } from '../features/table/normalize-global-interaction-category-text';
import { createNormalizeGlobalInteractionHeader } from '../features/table/normalize-global-interaction-header';
import { createNormalizeInteractionLabel } from '../features/table/normalize-interaction-label';
import { createOpenDatabaseFormFillPage } from '../features/table/open-database-form-fill-page';
import { createOpenDatabaseInterface } from '../features/table/open-database-interface';
import { createOpenDatabaseNewUiViaApi } from '../features/table/open-database-new-ui-via-api';
import { createOpenDatabaseNewUiViaMenuEntry } from '../features/table/open-database-new-ui-via-menu-entry';
import { createOpenDatabaseVisualizerInterface } from '../features/table/open-database-visualizer-interface';
import { createOpenDatabaseVisualizerNewUiViaApi } from '../features/table/open-database-visualizer-new-ui-via-api';
import { createOpenLegacyDatabaseSettings } from '../features/table/open-legacy-database-settings';
import { createOpenLegacyDatabaseVisualizer } from '../features/table/open-legacy-database-visualizer';
import { createParseRelationshipString } from '../features/table/parse-relationship-string';
import { createReadTextFile } from '../features/table/read-text-file';
import { createResolveCustomTableNameIcon } from '../features/table/resolve-custom-table-name-icon';
import { createResolveCustomTableNameIconAssetUrl } from '../features/table/resolve-custom-table-name-icon-asset-url';
import { createResolveCustomTableNameIconManagerDirectSection } from '../features/table/resolve-custom-table-name-icon-manager-direct-section';
import { createResolveCustomTableNameIconRowName } from '../features/table/resolve-custom-table-name-icon-row-name';
import { createRunDatabaseManualUpdate } from '../features/table/run-database-manual-update';
import { createRunDatabaseManualUpdateViaApi } from '../features/table/run-database-manual-update-via-api';
import { createRunDatabaseManualUpdateViaLegacyButton } from '../features/table/run-database-manual-update-via-legacy-button';
import { createRunDatabaseManualUpdateViaNewUiButton } from '../features/table/run-database-manual-update-via-new-ui-button';
import { createRunMaybeAsyncDatabaseManualUpdate } from '../features/table/run-maybe-async-database-manual-update';
import { createRunMaybeAsyncDatabaseUiOpener } from '../features/table/run-maybe-async-database-ui-opener';
import { createShowDatabaseManualUpdateFailure } from '../features/table/show-database-manual-update-failure';
import { createUpdateSaveButtonState } from '../features/table/update-save-button-state';
import { createWaitForDatabaseManualUpdateSurface } from '../features/table/wait-for-database-manual-update-surface';
import { createWaitForDatabaseNewUiManualUpdateButton } from '../features/table/wait-for-database-new-ui-manual-update-button';
import { createWaitForDatabaseUiTick } from '../features/table/wait-for-database-ui-tick';
import { createCreateAutoRegexTransformKey } from '../features/textarea/create-auto-regex-transform-key';
import { createRememberAutoRegexTransform } from '../features/textarea/remember-auto-regex-transform';
import { createShouldSkipAutoRegexTransform } from '../features/textarea/should-skip-auto-regex-transform';
import { createClearModalStack } from '../features/ui/clear-modal-stack';
import { createCollectAccessibleRuntimeWindows } from '../features/ui/collect-accessible-runtime-windows';
import { createCollectHostAndLocalNodes } from '../features/ui/collect-host-and-local-nodes';
import { createCreateElementFromHtml } from '../features/ui/create-element-from-html';
import { createFontsList } from '../features/ui/fonts-list';
import { createGetAccessibleDocument } from '../features/ui/get-accessible-document';
import { createGetNavigationFontMetrics } from '../features/ui/get-navigation-font-metrics';
import { createGetTavernHostDocument } from '../features/ui/get-tavern-host-document';
import { createIsElementVisibleInLayout } from '../features/ui/is-element-visible-in-layout';
import { createPopModal } from '../features/ui/pop-modal';
import { createPushModal } from '../features/ui/push-modal';
import { createShowDiceSystemConfirmDialog } from '../features/ui/show-dice-system-confirm-dialog';
import { createShowDiceSystemInputDialog } from '../features/ui/show-dice-system-input-dialog';
import { createThemes } from '../features/ui/themes';
import { createUpdateValidationIndicator } from '../features/ui/update-validation-indicator';
import { createUpdateController } from '../features/validation/update-controller';
import { createDownloadAiPromptFile } from '../shared/download-ai-prompt-file';
import { createDownloadJsonFile } from '../shared/download-json-file';
import { createDownloadJsoncFile } from '../shared/download-jsonc-file';
import { createDownloadTextFile } from '../shared/download-text-file';
import { createExtractNumericValue } from '../shared/extract-numeric-value';
import { createGetCore } from '../shared/get-core';
import { createGetJsonLikeErrorMessage } from '../shared/get-json-like-error-message';
import { createGetStringLikeCellText } from '../shared/get-string-like-cell-text';
import { createIsNumericCell } from '../shared/is-numeric-cell';
import { createIsRecord } from '../shared/is-record';
import { createIsTwoDimensionalArray } from '../shared/is-two-dimensional-array';
import { createParseJsoncRecord } from '../shared/parse-jsonc-record';
import { createParseJsoncValue } from '../shared/parse-jsonc-value';
import { createPickTextFile } from '../shared/pick-text-file';
import { createProcessTemplate } from '../shared/process-template';
import { STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_DASHBOARD_PRESETS, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, STORAGE_KEY_SCROLL } from '../shared/storage-keys';
import { createCustomTableNameIconStoreManager } from '../shared/storage/custom-table-name-icon-store-manager';
import { createStripJsoncSyntax } from '../shared/strip-jsonc-syntax';
import { createGetTavernHostWindow } from '../shared/tavern-host';

export function createCoreRuntimeWiring(deps: any) {
  const { ActionPresetManager, DASHBOARD_DEFAULT_PRESET_ID, DASHBOARD_PRESET_ADDITIONAL_COLUMNS, DASHBOARD_PRESET_FILTER_KEYS, DASHBOARD_PRESET_FORMAT, DASHBOARD_PRESET_MODULE_KEYS, DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY, JSONC_FILE_ACCEPT, JSONC_FILE_MIME, JSON_FILE_MIME, MARKDOWN_FILE_MIME, ValidationEngine, ValidationRuleManager, bindEvents, bindGlobalInteractionEvents, bindTutorialButtonsIn, cloneDashboardConfig, cloneDashboardPresetModules, createBuiltinDashboardPreset, escapeHtml, formatCssImageUrl, getConfig, getRemoteImageUrlValidationError, getTableData, getTutorialButtonHtml, hydrateCustomTableNameIconsIn, isNpcLikeTableName, isPlayerTableName, isRecordValue, loadDashboardNpcAvatars, loadSnapshot, normalizeDashboardKeywordArray, normalizeDashboardPresetFilters, normalizeDashboardRelationshipGraphConfig, processJsonData, refreshChangesPanel, renderDashboard, renderGlobalInteractionsPanel, renderInterface, setupOverlayClose, showDicePanel, smartInsertToTextarea, stripJsonComments, dashboardRuntimeConfigCache_ACC } = deps;
  const getJsonLikeErrorMessage = createGetJsonLikeErrorMessage({

  });

  const stripJsoncSyntax = createStripJsoncSyntax({
    stripJsonComments: (...a: any[]) => stripJsonComments(...a),
  });

  const parseJsoncValue = createParseJsoncValue({
    stripJsoncSyntax: (...a: any[]) => stripJsoncSyntax(...a),
  });

  const parseJsoncDocument = createParseJsoncDocument({
    parseJsoncValue: (...a: any[]) => parseJsoncValue(...a),
  });

  const parseJsoncRecord = createParseJsoncRecord({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    parseJsoncDocument: (...a: any[]) => parseJsoncDocument(...a),
  });

  const downloadTextFile = createDownloadTextFile({

  });

  const downloadJsonFile = createDownloadJsonFile({
    downloadTextFile: (...a: any[]) => downloadTextFile(...a),
    getJSON_FILE_MIME: () => JSON_FILE_MIME,
  });

  const downloadJsoncFile = createDownloadJsoncFile({
    downloadTextFile: (...a: any[]) => downloadTextFile(...a),
    getJSONC_FILE_MIME: () => JSONC_FILE_MIME,
  });

  const downloadAiPromptFile = createDownloadAiPromptFile({
    downloadTextFile: (...a: any[]) => downloadTextFile(...a),
    getMARKDOWN_FILE_MIME: () => MARKDOWN_FILE_MIME,
  });

  const readTextFile = createReadTextFile({

  });

  const pickTextFile = createPickTextFile({
    readTextFile: (...a: any[]) => readTextFile(...a),
    JSONC_FILE_ACCEPT: JSONC_FILE_ACCEPT,
  });

  const validateJsoncEditorConfig = createValidateJsoncEditorConfig({
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
  });

  const normalizeDashboardPresetModules = createNormalizeDashboardPresetModules({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeDashboardKeywordArray: (...a: any[]) => normalizeDashboardKeywordArray(...a),
    normalizeDashboardPresetFilters: (...a: any[]) => normalizeDashboardPresetFilters(...a),
    normalizeDashboardRelationshipGraphConfig: (...a: any[]) => normalizeDashboardRelationshipGraphConfig(...a),
    DASHBOARD_PRESET_ADDITIONAL_COLUMNS: DASHBOARD_PRESET_ADDITIONAL_COLUMNS,
    DASHBOARD_PRESET_MODULE_KEYS: DASHBOARD_PRESET_MODULE_KEYS,
    DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY: DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY,
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
  });

  const parseDashboardPresetJson = createParseDashboardPresetJson({

    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    getDASHBOARD_PRESET_FORMAT: () => DASHBOARD_PRESET_FORMAT,
    normalizeDashboardPresetModules: (...a: any[]) => normalizeDashboardPresetModules(...a),
  });

  const createDashboardPresetEditorTemplate = createCreateDashboardPresetEditorTemplate({

  });

  const DashboardPresetManager = createDashboardPresetManager({
    cloneDashboardPresetModules: (...a: any[]) => cloneDashboardPresetModules(...a),
    createBuiltinDashboardPreset: (...a: any[]) => createBuiltinDashboardPreset(...a),
    parseDashboardPresetJson: (...a: any[]) => parseDashboardPresetJson(...a),
    DASHBOARD_DEFAULT_PRESET_ID: DASHBOARD_DEFAULT_PRESET_ID,
    DASHBOARD_PRESET_FORMAT: DASHBOARD_PRESET_FORMAT,
    STORAGE_KEY_ACTIVE_DASHBOARD_PRESET: STORAGE_KEY_ACTIVE_DASHBOARD_PRESET,
    STORAGE_KEY_DASHBOARD_PRESETS: STORAGE_KEY_DASHBOARD_PRESETS,
    setDashboardRuntimeConfigCache: (v: any) => { dashboardRuntimeConfigCache_ACC.v = v; },
  });

  const getActiveDashboardRelationshipGraphSources = createGetActiveDashboardRelationshipGraphSources({
    getDASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY: () => DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY,
    getDashboardPresetManager: () => DashboardPresetManager,
  });

  const getDashboardRuntimeConfig = createGetDashboardRuntimeConfig({
    cloneDashboardConfig: (...a: any[]) => cloneDashboardConfig(...a),
    DASHBOARD_PRESET_ADDITIONAL_COLUMNS: DASHBOARD_PRESET_ADDITIONAL_COLUMNS,
    DASHBOARD_PRESET_FILTER_KEYS: DASHBOARD_PRESET_FILTER_KEYS,
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
    DashboardPresetManager: DashboardPresetManager,
    getDashboardRuntimeConfigCache: () => dashboardRuntimeConfigCache_ACC.v,
    setDashboardRuntimeConfigCache: (v: any) => { dashboardRuntimeConfigCache_ACC.v = v; },
  });

  const getDashboardModuleConfig = createGetDashboardModuleConfig({
    getDashboardRuntimeConfig: (...a: any[]) => getDashboardRuntimeConfig(...a),
  });

  // 仪表盘数据解析器
  const DashboardDataParser = createDashboardDataParser({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
  });
  const getGMConfig = createGetGMConfig({
    ActionPresetManager: ActionPresetManager,
  });

  // 统一的结果标签样式生成函数 - 返回 CSS 类名
  const getResultBadgeClass = createGetResultBadgeClass({

  });

  // [统一] 交互选项的图标映射表，供所有渲染位置共享使用


  /**
   * 获取指定表格的默认交互动作
   *
   * [扩展点] 支持用户自定义规则，优先级：用户自定义规则 > 内置默认规则
   * 将来可通过 config.custom_action_groups 添加用户定义的表格规则
   * 例如用户可以为"神通表"定义固有选项"凝练"、"施展"
   *
   * @param tableName 表格名称（用于匹配动作组）
   * @returns 匹配的动作列表（返回副本，避免变异原配置）
   */
  const getActionsForTable = createGetActionsForTable({
    getGMConfig: (...a: any[]) => getGMConfig(...a),
  });

  /**
   * 获取指定行的完整交互选项列表
   * 合并逻辑：默认动作 + AI生成的自定义动作（去重）
   *
   * @param tableName 表格名称（用于匹配默认动作）
   * @param headers 表头数组
   * @param rowData 行数据数组
   * @returns 完整的动作列表（默认动作在前，自定义动作在后）
   */
  const getInteractOptionsForRow = createGetInteractOptionsForRow({
    getActionsForTable: (...a: any[]) => getActionsForTable(...a),
    getACTION_ICON_MAP: () => ACTION_ICON_MAP,
  });

  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  const GLOBAL_INTERACTION_NAME_HEADERS = createGlobalInteractionNameHeaders({

  });
  const GLOBAL_INTERACTION_NAME_HEADER_KEYWORDS = createGlobalInteractionNameHeaderKeywords({

  });
  const GLOBAL_INTERACTION_NON_NAME_HEADER_KEYWORDS = createGlobalInteractionNonNameHeaderKeywords({

  });
  const GLOBAL_INTERACTION_INDEX_HEADERS = ['序号', '编号', '索引', 'index', 'order', 'id', '#'];
  const GLOBAL_INTERACTION_DEBUG_PREFIX = '[DICE][GlobalInteractionsDebug]';
  const GLOBAL_INTERACTION_DEFAULT_SECTION_META = createGlobalInteractionDefaultSectionMeta({

  });


  const debugGlobalInteraction = createDebugGlobalInteraction({
    getGLOBAL_INTERACTION_DEBUG_PREFIX: () => GLOBAL_INTERACTION_DEBUG_PREFIX,
  });

  const isRecord = createIsRecord({

  });

  const isTwoDimensionalArray = createIsTwoDimensionalArray({

  });
  const normalizeInteractionLabel = createNormalizeInteractionLabel({

  });

  const dedupeInteractionActions = createDedupeInteractionActions({
    normalizeInteractionLabel: (...a: any[]) => normalizeInteractionLabel(...a),
  });

  const getStringLikeCellText = createGetStringLikeCellText({

  });

  const isPureIndexCell = createIsPureIndexCell({
    getStringLikeCellText: (...a: any[]) => getStringLikeCellText(...a),
    getGLOBAL_INTERACTION_INDEX_HEADERS: () => GLOBAL_INTERACTION_INDEX_HEADERS,
  });

  const normalizeGlobalInteractionHeader = createNormalizeGlobalInteractionHeader({

  });

  const isLikelyGlobalInteractionNameHeader = createIsLikelyGlobalInteractionNameHeader({
    normalizeGlobalInteractionHeader: (...a: any[]) => normalizeGlobalInteractionHeader(...a),
    getGLOBAL_INTERACTION_NAME_HEADERS: () => GLOBAL_INTERACTION_NAME_HEADERS,
    getGLOBAL_INTERACTION_NAME_HEADER_KEYWORDS: () => GLOBAL_INTERACTION_NAME_HEADER_KEYWORDS,
    getGLOBAL_INTERACTION_NON_NAME_HEADER_KEYWORDS: () => GLOBAL_INTERACTION_NON_NAME_HEADER_KEYWORDS,
  });

  const resolveGlobalInteractionRowTitle = createResolveGlobalInteractionRowTitle({
    getStringLikeCellText: (...a: any[]) => getStringLikeCellText(...a),
    isLikelyGlobalInteractionNameHeader: (...a: any[]) => isLikelyGlobalInteractionNameHeader(...a),
    isPureIndexCell: (...a: any[]) => isPureIndexCell(...a),
    normalizeGlobalInteractionHeader: (...a: any[]) => normalizeGlobalInteractionHeader(...a),
    GLOBAL_INTERACTION_NAME_HEADERS: GLOBAL_INTERACTION_NAME_HEADERS,
  });

  const buildGlobalInteractionSearchText = createBuildGlobalInteractionSearchText({

  });

  const normalizeGlobalInteractionCategoryText = createNormalizeGlobalInteractionCategoryText({

  });
  const getGlobalInteractionRuleKeywords = createGetGlobalInteractionRuleKeywords({
    isRecord: (...a: any[]) => isRecord(...a),
    getStringLikeCellText: (...a: any[]) => getStringLikeCellText(...a),
  });

  const getGlobalInteractionActionRuleGroups = createGetGlobalInteractionActionRuleGroups({
    getGMConfig: (...a: any[]) => getGMConfig(...a),
    getGlobalInteractionRuleKeywords: (...a: any[]) => getGlobalInteractionRuleKeywords(...a),
  });

  const getMatchedGlobalInteractionRuleKeywords = createGetMatchedGlobalInteractionRuleKeywords({
    getGlobalInteractionActionRuleGroups: (...a: any[]) => getGlobalInteractionActionRuleGroups(...a),
    normalizeGlobalInteractionCategoryText: (...a: any[]) => normalizeGlobalInteractionCategoryText(...a),
  });

  const resolveGlobalInteractionSectionMeta = createResolveGlobalInteractionSectionMeta({
    getMatchedGlobalInteractionRuleKeywords: (...a: any[]) => getMatchedGlobalInteractionRuleKeywords(...a),
    normalizeGlobalInteractionCategoryText: (...a: any[]) => normalizeGlobalInteractionCategoryText(...a),
    resolveDashboardGlobalInteractionSectionKind: (...a: any[]) => resolveDashboardGlobalInteractionSectionKind(...a),
    GLOBAL_INTERACTION_DEFAULT_SECTION_META: GLOBAL_INTERACTION_DEFAULT_SECTION_META,
  });

  const createGlobalInteractionSections = createCreateGlobalInteractionSections({
    resolveGlobalInteractionSectionMeta: (...a: any[]) => resolveGlobalInteractionSectionMeta(...a),
  });

  const buildGlobalInteractionGroups = createBuildGlobalInteractionGroups({
    buildGlobalInteractionSearchText: (...a: any[]) => buildGlobalInteractionSearchText(...a),
    dedupeInteractionActions: (...a: any[]) => dedupeInteractionActions(...a),
    getInteractOptionsForRow: (...a: any[]) => getInteractOptionsForRow(...a),
    isRecord: (...a: any[]) => isRecord(...a),
    isTwoDimensionalArray: (...a: any[]) => isTwoDimensionalArray(...a),
    resolveCustomTableNameIconRowName: (...a: any[]) => resolveCustomTableNameIconRowName(...a),
    resolveGlobalInteractionRowTitle: (...a: any[]) => resolveGlobalInteractionRowTitle(...a),
  });

  const executeTableInteractionAction = createExecuteTableInteractionAction({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    extractNumericValue: (...a: any[]) => extractNumericValue(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    processTemplate: (...a: any[]) => processTemplate(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDicePanel: (...a: any[]) => showDicePanel(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
  });

  const isNumericCell = createIsNumericCell({

  });

  const extractNumericValue = createExtractNumericValue({

  });

  const parseAttributeString = createParseAttributeString({

  });
  // 解析人际关系字符串，推荐使用冒号格式，同时兼容旧式括号格式:
  // 推荐格式: "人名:关系描述;人名:关系描述" 或 "与人名:关系描述;与人名:关系描述"
  // 兼容格式: "人名(关系标签);人名(关系)"
  const parseRelationshipString = createParseRelationshipString({

  });

  // [新增] 检测是否是人际关系格式
  const isRelationshipCell = createIsRelationshipCell({

  });

  const processTemplate = createProcessTemplate({

  });

  // 固定显示的功能按钮
  // 注意：保存按钮已移除，系统现在使用即时保存模式（每次编辑/删除后自动保存）
  const ACTION_BUTTONS = createActionButtons({

  });
  type SpecialNavigationItem = {
    key: string;
    icon: string;
    label: string;
    id: string;
    extraClass: string;
    isActive?: boolean;
    warningIcon?: boolean;
    checkAvailable?: () => boolean;
  };
  type NavigationItem = {
    key: string;
    icon: string;
    label: string;
    isSpecial: boolean;
    id?: string;
    extraClass?: string;
    isActive?: boolean;
    warningIcon?: boolean;
  };

  let isInitialized = false;
  let isSaving = false;
  let saveQueue: Promise<void> = Promise.resolve(); // 保存队列，确保并发保存按顺序执行
  let isEditingOrder = false;
  let isSettingsOpen = false;
  let isGachaItemEditorOpen = false;

  // === 弹窗栈管理 ===
  // 用于追踪弹窗打开顺序，关闭时自动返回上一个弹窗
  type ModalEntry = {
    name: string;
    show: () => void;
  };
  const modalStack: ModalEntry[] = [];

  /**
   * 将弹窗推入栈中
   * @param name 弹窗名称（用于调试）
   * @param show 重新打开该弹窗的函数
   */
  const pushModal = createPushModal({
    getModalStack: () => modalStack,
  });

  /**
   * 从栈中弹出当前弹窗并返回上一个弹窗
   * @returns 是否成功返回上一个弹窗
   */
  const popModal = createPopModal({
    getModalStack: () => modalStack,
  });

  /**
   * 清空弹窗栈（用于关闭所有弹窗或从根弹窗关闭）
   */
  const clearModalStack = createClearModalStack({
    getModalStack: () => modalStack,
  });

  let currentDiffMap = new Set();
  let observer = null;
  let _boundRenderHandler = null;
  let _boundReviewBaselineHandler = null;

  // --- 全局状态变量 ---
  let cachedRawData = null;
  let hasUnsavedChanges = false;
  // [修复] 存储待删除行的索引（按表格分组）
  let pendingDeletions: Record<string, number[]> = {};
  const getPendingDeletions = createGetPendingDeletions({
    getPendingDeletions: () => pendingDeletions,
  });
  const clearPendingDeletions = createClearPendingDeletions({
    getPendingDeletions: () => pendingDeletions,
    setPendingDeletions: (v: any) => { pendingDeletions = v; },
  });
  const createSheetDataFingerprint = createCreateSheetDataFingerprint({

  });

  const isSameSheetData = createIsSameSheetData({
    createSheetDataFingerprint: (...a: any[]) => createSheetDataFingerprint(...a),
  });

  const AUTO_REGEX_TRANSFORM_COOLDOWN_MS = 5000;
  let lastAutoRegexTransformKey = '';
  let lastAutoRegexTransformAt = 0;
  const createRegexRuleSignature = createCreateRegexRuleSignature({

  });
  const createAutoRegexTransformKey = createCreateAutoRegexTransformKey({
    createRegexRuleSignature: (...a: any[]) => createRegexRuleSignature(...a),
    createSheetDataFingerprint: (...a: any[]) => createSheetDataFingerprint(...a),
  });
  const shouldSkipAutoRegexTransform = createShouldSkipAutoRegexTransform({
    getLastAutoRegexTransformAt: () => lastAutoRegexTransformAt,
    getLastAutoRegexTransformKey: () => lastAutoRegexTransformKey,
    getAUTO_REGEX_TRANSFORM_COOLDOWN_MS: () => AUTO_REGEX_TRANSFORM_COOLDOWN_MS,
  });

  const rememberAutoRegexTransform = createRememberAutoRegexTransform({
    getLastAutoRegexTransformKey: () => lastAutoRegexTransformKey,
    setLastAutoRegexTransformKey: (v: any) => { lastAutoRegexTransformKey = v; },
    getLastAutoRegexTransformAt: () => lastAutoRegexTransformAt,
    setLastAutoRegexTransformAt: (v: any) => { lastAutoRegexTransformAt = v; },
  });

  let isAutoTransforming = false; // 防止自动转换循环触发
  let tablePageStates = {};
  let tableSearchStates = {};
  let lastOptionHash = null;
  let optionPanelVisible = false; // [新增] 选项面板可见性控制
  // [修改] 初始化时从硬盘读取记忆

  let tableScrollStates = {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SCROLL);
    if (saved) tableScrollStates = JSON.parse(saved);
  } catch (e) {
    console.warn('[DICE]ACU Error:', e);
  }
  // [优化] 智能更新控制器：后端数据变动时，自动更新快照
  const UpdateController = createUpdateController({
    getTableData: (...a: any[]) => getTableData(...a),
    isSameSheetData: (...a: any[]) => isSameSheetData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    getCachedRawData: () => cachedRawData,
    getValidationEngine: () => ValidationEngine,
    getValidationRuleManager: () => ValidationRuleManager,
    renderInterface: () => renderInterface(),
    updateValidationIndicator: (...a: any[]) => updateValidationIndicator(...a),
    refreshChangesPanel: (...a: any[]) => refreshChangesPanel(...a),
  });
  // 更新导航栏验证指示器
  const updateValidationIndicator = createUpdateValidationIndicator({
    getCore: (...a: any[]) => getCore(...a),
  });

  // --- [重构] 上下文指纹工具 ---
  const getCurrentContextFingerprint = createGetCurrentContextFingerprint({

  });

  // 全局状态追踪 (已清理死代码)


  const COLLAPSE_STYLES = ['bar', 'pill', 'floating'] as const;
  type CollapseStyle = (typeof COLLAPSE_STYLES)[number];

  const normalizeCollapseStyle = createNormalizeCollapseStyle({
    getCOLLAPSE_STYLES: () => COLLAPSE_STYLES,
  });

  const getNavigationFontMetrics = createGetNavigationFontMetrics({

  });

  const FONTS = createFontsList({

  });

  // 主题维护提示：这里控制设置界面的骰子系统主题选项。
  // 新增、改名或改 theme id 时，同步更新 外部参考/数据库主题/acu-db-theme-dice-<theme-id>.json
  // 的文件名、theme.id 和 theme.name，避免数据库本体主题与骰子系统主题脱节。
  const THEMES = createThemes({

  });

  // [优化] 缓存 core 对象 (修复竞态条件 + 增强 ST 穿透查找)
  let _coreCache = null;

  const getAccessibleDocument = createGetAccessibleDocument({

  });

  const HOST_SELECTOR = '#chat, #send_form, #form_sheld, #send_textarea, #chat_input, #send_but';

  const getTavernHostWindow = createGetTavernHostWindow({
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    HOST_SELECTOR: HOST_SELECTOR,
  });

  const getTavernHostDocument = createGetTavernHostDocument({
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
  });

  const createElementFromHtml = createCreateElementFromHtml({

  });

  const collectHostAndLocalNodes = createCollectHostAndLocalNodes({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });

  const getCore = createGetCore({
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    get_coreCache: () => _coreCache,
    set_coreCache: (v: any) => { _coreCache = v; },
  });

  const ACU_DATABASE_NEW_UI_MENU_SELECTOR = '#acu-v2-menu-item';
  const ACU_DATABASE_NEW_UI_API_METHODS = createAcuDatabaseNewUiApiMethods({

  });
  const ACU_DATABASE_MANUAL_UPDATE_API_METHODS = createAcuDatabaseManualUpdateApiMethods({

  });
  const ACU_DATABASE_V2_ROOT_SELECTOR = '#acu-app-v2, .acu-v2-app';
  const ACU_DATABASE_FORM_FILL_NAV_SELECTOR = '[data-page-id="form-fill"]';
  const ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR = '#form-fill-manual-panel';
  const ACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR = createAcuDatabaseManualUpdateActionSelector({

  });
  const ACU_DATABASE_LEGACY_MANUAL_UPDATE_BUTTON_SELECTOR = createAcuDatabaseLegacyManualUpdateButtonSelector({

  });
  const ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS = createAcuDatabaseManualUpdateButtonWaitMs({

  });
  const ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS = createAcuDatabaseManualUpdateButtonPollMs({

  });

  const collectAccessibleRuntimeWindows = createCollectAccessibleRuntimeWindows({
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
  });

  const runMaybeAsyncDatabaseUiOpener = createRunMaybeAsyncDatabaseUiOpener({

  });

  const openDatabaseNewUiViaApi = createOpenDatabaseNewUiViaApi({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    runMaybeAsyncDatabaseUiOpener: (...a: any[]) => runMaybeAsyncDatabaseUiOpener(...a),
    getACU_DATABASE_NEW_UI_API_METHODS: () => ACU_DATABASE_NEW_UI_API_METHODS,
  });

  const openDatabaseNewUiViaMenuEntry = createOpenDatabaseNewUiViaMenuEntry({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    getACU_DATABASE_NEW_UI_MENU_SELECTOR: () => ACU_DATABASE_NEW_UI_MENU_SELECTOR,
  });

  const openLegacyDatabaseSettings = createOpenLegacyDatabaseSettings({
    getCore: (...a: any[]) => getCore(...a),
  });

  const openDatabaseInterface = createOpenDatabaseInterface({
    openDatabaseNewUiViaApi: (...a: any[]) => openDatabaseNewUiViaApi(...a),
    openDatabaseNewUiViaMenuEntry: (...a: any[]) => openDatabaseNewUiViaMenuEntry(...a),
    openLegacyDatabaseSettings: (...a: any[]) => openLegacyDatabaseSettings(...a),
  });

  type DatabaseVisualizerNewUiOpenResult = 'opened' | 'unavailable' | 'failed';

  const openDatabaseVisualizerNewUiViaApi = createOpenDatabaseVisualizerNewUiViaApi({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    runMaybeAsyncDatabaseUiOpener: (...a: any[]) => runMaybeAsyncDatabaseUiOpener(...a),
  });

  const openLegacyDatabaseVisualizer = createOpenLegacyDatabaseVisualizer({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    runMaybeAsyncDatabaseUiOpener: (...a: any[]) => runMaybeAsyncDatabaseUiOpener(...a),
  });

  const openDatabaseVisualizerInterface = createOpenDatabaseVisualizerInterface({
    openDatabaseVisualizerNewUiViaApi: (...a: any[]) => openDatabaseVisualizerNewUiViaApi(...a),
    openLegacyDatabaseVisualizer: (...a: any[]) => openLegacyDatabaseVisualizer(...a),
  });

  type DatabaseManualUpdateResult =
    | { status: 'updated'; source: string }
    | { status: 'unavailable' }
    | { status: 'failed'; error?: unknown; source?: string };

  const waitForDatabaseUiTick = createWaitForDatabaseUiTick({
  });

  const isElementVisibleInLayout = createIsElementVisibleInLayout({

  });

  const normalizeDatabaseUiText = createNormalizeDatabaseUiText({

  });

  const isDatabaseManualUpdateActionButton = createIsDatabaseManualUpdateActionButton({
    isDatabaseManualUpdateButtonText: (...a: any[]) => isDatabaseManualUpdateButtonText(...a),
    normalizeDatabaseUiText: (...a: any[]) => normalizeDatabaseUiText(...a),
    getACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR: () => ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR,
  });

  const isDatabaseButtonDisabled = createIsDatabaseButtonDisabled({

  });
  const hasDatabaseNewUiRuntime = createHasDatabaseNewUiRuntime({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    getACU_DATABASE_V2_ROOT_SELECTOR: () => ACU_DATABASE_V2_ROOT_SELECTOR,
    getACU_DATABASE_NEW_UI_MENU_SELECTOR: () => ACU_DATABASE_NEW_UI_MENU_SELECTOR,
  });

  const findDatabaseNewUiManualUpdateButton = createFindDatabaseNewUiManualUpdateButton({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    isElementVisibleInLayout: (...a: any[]) => isElementVisibleInLayout(...a),
    isDatabaseManualUpdateActionButton: (...a: any[]) => isDatabaseManualUpdateActionButton(...a),
    normalizeDatabaseUiText: (...a: any[]) => normalizeDatabaseUiText(...a),
    isDatabaseButtonDisabled: (...a: any[]) => isDatabaseButtonDisabled(...a),
    getACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR: () => ACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR,
  });

  const waitForDatabaseNewUiManualUpdateButton = createWaitForDatabaseNewUiManualUpdateButton({
    findDatabaseNewUiManualUpdateButton: (...a: any[]) => findDatabaseNewUiManualUpdateButton(...a),
    waitForDatabaseUiTick: (...a: any[]) => waitForDatabaseUiTick(...a),
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS,
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS,
  });

  const hasDatabaseManualUpdateSurface = createHasDatabaseManualUpdateSurface({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    isDatabaseManualUpdateActionButton: (...a: any[]) => isDatabaseManualUpdateActionButton(...a),
    isElementVisibleInLayout: (...a: any[]) => isElementVisibleInLayout(...a),
    getACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR: () => ACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR,
    getACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR: () => ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR,
  });

  const waitForDatabaseManualUpdateSurface = createWaitForDatabaseManualUpdateSurface({
    hasDatabaseManualUpdateSurface: (...a: any[]) => hasDatabaseManualUpdateSurface(...a),
    waitForDatabaseUiTick: (...a: any[]) => waitForDatabaseUiTick(...a),
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS,
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS,
  });

  const clickDatabaseNewUiFormFillNavigation = createClickDatabaseNewUiFormFillNavigation({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    isElementVisibleInLayout: (...a: any[]) => isElementVisibleInLayout(...a),
    getACU_DATABASE_FORM_FILL_NAV_SELECTOR: () => ACU_DATABASE_FORM_FILL_NAV_SELECTOR,
  });

  const openDatabaseFormFillPage = createOpenDatabaseFormFillPage({
    clickDatabaseNewUiFormFillNavigation: (...a: any[]) => clickDatabaseNewUiFormFillNavigation(...a),
    hasDatabaseNewUiRuntime: (...a: any[]) => hasDatabaseNewUiRuntime(...a),
    openDatabaseNewUiViaApi: (...a: any[]) => openDatabaseNewUiViaApi(...a),
    openDatabaseNewUiViaMenuEntry: (...a: any[]) => openDatabaseNewUiViaMenuEntry(...a),
    waitForDatabaseManualUpdateSurface: (...a: any[]) => waitForDatabaseManualUpdateSurface(...a),
    waitForDatabaseUiTick: (...a: any[]) => waitForDatabaseUiTick(...a),
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS,
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS,
  });

  const runDatabaseManualUpdateViaNewUiButton = createRunDatabaseManualUpdateViaNewUiButton({
    openDatabaseFormFillPage: (...a: any[]) => openDatabaseFormFillPage(...a),
    waitForDatabaseNewUiManualUpdateButton: (...a: any[]) => waitForDatabaseNewUiManualUpdateButton(...a),
  });

  const runMaybeAsyncDatabaseManualUpdate = createRunMaybeAsyncDatabaseManualUpdate({

  });

  const runDatabaseManualUpdateViaApi = createRunDatabaseManualUpdateViaApi({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    runMaybeAsyncDatabaseManualUpdate: (...a: any[]) => runMaybeAsyncDatabaseManualUpdate(...a),
    ACU_DATABASE_MANUAL_UPDATE_API_METHODS: ACU_DATABASE_MANUAL_UPDATE_API_METHODS,
  });

  const runDatabaseManualUpdateViaLegacyButton = createRunDatabaseManualUpdateViaLegacyButton({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    getACU_DATABASE_LEGACY_MANUAL_UPDATE_BUTTON_SELECTOR: () => ACU_DATABASE_LEGACY_MANUAL_UPDATE_BUTTON_SELECTOR,
  });

  const runDatabaseManualUpdate = createRunDatabaseManualUpdate({
    hasDatabaseNewUiRuntime: (...a: any[]) => hasDatabaseNewUiRuntime(...a),
    runDatabaseManualUpdateViaApi: (...a: any[]) => runDatabaseManualUpdateViaApi(...a),
    runDatabaseManualUpdateViaLegacyButton: (...a: any[]) => runDatabaseManualUpdateViaLegacyButton(...a),
    runDatabaseManualUpdateViaNewUiButton: (...a: any[]) => runDatabaseManualUpdateViaNewUiButton(...a),
  });

  const getDatabaseManualUpdateErrorMessage = createGetDatabaseManualUpdateErrorMessage({

  });

  const showDatabaseManualUpdateFailure = createShowDatabaseManualUpdateFailure({
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
  });

  const updateSaveButtonState = createUpdateSaveButtonState({
    getCore: (...a: any[]) => getCore(...a),
    getPendingDeletions: (...a: any[]) => getPendingDeletions(...a),
    hasUnsavedChanges: () => hasUnsavedChanges_ACC.v,
  });

  const getIconForTableName = createGetIconForTableName({

  });

  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  const CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION = 1;

  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  const DASHBOARD_MODULE_SECTION_KIND = createDashboardModuleSectionKind({

  });

  const CUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS = createCustomTableNameIconDashboardModuleContexts({

  });

  const getDashboardModuleKeysForTableName = createGetDashboardModuleKeysForTableName({
    getDashboardRuntimeConfig: (...a: any[]) => getDashboardRuntimeConfig(...a),
    normalizeGlobalInteractionCategoryText: (...a: any[]) => normalizeGlobalInteractionCategoryText(...a),
  });

  const resolveDashboardGlobalInteractionSectionKind = createResolveDashboardGlobalInteractionSectionKind({
    getDashboardModuleKeysForTableName: (...a: any[]) => getDashboardModuleKeysForTableName(...a),
    getDASHBOARD_MODULE_SECTION_KIND: () => DASHBOARD_MODULE_SECTION_KIND,
  });

  const resolveDashboardCustomTableNameIconContextInfo = createResolveDashboardCustomTableNameIconContextInfo({
    getDashboardModuleKeysForTableName: (...a: any[]) => getDashboardModuleKeysForTableName(...a),
    getCUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS: () => CUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS,
  });

  const resolveDashboardCustomTableNameIconRowName = createResolveDashboardCustomTableNameIconRowName({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getDashboardModuleKeysForTableName: (...a: any[]) => getDashboardModuleKeysForTableName(...a),
    getStringLikeCellText: (...a: any[]) => getStringLikeCellText(...a),
    getDashboardDataParser: () => DashboardDataParser,
  });

  const resolveCustomTableNameIconRowName = createResolveCustomTableNameIconRowName({
    resolveDashboardCustomTableNameIconRowName: (...a: any[]) => resolveDashboardCustomTableNameIconRowName(...a),
    resolveGlobalInteractionRowTitle: (...a: any[]) => resolveGlobalInteractionRowTitle(...a),
  });

  const CUSTOM_TABLE_NAME_ICON_MODULE_IDS = createCustomTableNameIconModuleIds({

  });
  const CUSTOM_TABLE_NAME_ICON_SECTIONS = createCustomTableNameIconSections({

  });
  const CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS = createCustomTableNameIconAllowedPanelSections({

  });
  const CUSTOM_TABLE_NAME_ICON_DENIED_MODULES = createCustomTableNameIconDeniedModules({

  });
  const CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS = createCustomTableNameIconDeniedSections({

  });
  const CUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES = createCustomTableNameIconDeniedTableNames({

  });

  const isCustomTableNameIconModuleId = createIsCustomTableNameIconModuleId({
    getCUSTOM_TABLE_NAME_ICON_MODULE_IDS: () => CUSTOM_TABLE_NAME_ICON_MODULE_IDS,
  });

  const isCustomTableNameIconSection = createIsCustomTableNameIconSection({
    getCUSTOM_TABLE_NAME_ICON_SECTIONS: () => CUSTOM_TABLE_NAME_ICON_SECTIONS,
  });
  const normalizeCustomTableNameIconKeyPart = createNormalizeCustomTableNameIconKeyPart({

  });

  const isCustomTableNameIconTableDenied = createIsCustomTableNameIconTableDenied({
    isNpcLikeTableName: (...a: any[]) => isNpcLikeTableName(...a),
    isPlayerTableName: (...a: any[]) => isPlayerTableName(...a),
    resolveDashboardGlobalInteractionSectionKind: (...a: any[]) => resolveDashboardGlobalInteractionSectionKind(...a),
    getCUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES: () => CUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES,
  });

  const normalizeCustomTableNameIconContext = createNormalizeCustomTableNameIconContext({
    isCustomTableNameIconModuleId: (...a: any[]) => isCustomTableNameIconModuleId(...a),
    isCustomTableNameIconSection: (...a: any[]) => isCustomTableNameIconSection(...a),
    normalizeCustomTableNameIconKeyPart: (...a: any[]) => normalizeCustomTableNameIconKeyPart(...a),
  });

  const getCustomTableNameIconContextKey = createGetCustomTableNameIconContextKey({
    normalizeCustomTableNameIconKeyPart: (...a: any[]) => normalizeCustomTableNameIconKeyPart(...a),
  });

  const normalizeCustomTableNameIconEntry = createNormalizeCustomTableNameIconEntry({
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
    normalizeCustomTableNameIconContext: (...a: any[]) => normalizeCustomTableNameIconContext(...a),
  });

  const CUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES = createCustomTableNameIconAllowedLocalMimeTypes({

  });
  const CUSTOM_TABLE_NAME_ICON_MAX_LOCAL_FILE_SIZE = 1024 * 1024;

  const isCustomTableNameIconSvgMimeType = createIsCustomTableNameIconSvgMimeType({

  });

  const isCustomTableNameIconImageUrlValid = createIsCustomTableNameIconImageUrlValid({
    getCustomTableNameIconImageUrlValidationError: (...a: any[]) => getCustomTableNameIconImageUrlValidationError(...a),
  });

  const getCustomTableNameIconImageUrlValidationError = createGetCustomTableNameIconImageUrlValidationError({
    getRemoteImageUrlValidationError: (...a: any[]) => getRemoteImageUrlValidationError(...a),
  });

  const getCustomTableNameIconLocalFileValidationError = createGetCustomTableNameIconLocalFileValidationError({
    isCustomTableNameIconSvgMimeType: (...a: any[]) => isCustomTableNameIconSvgMimeType(...a),
    getCUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES: () => CUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES,
    getCUSTOM_TABLE_NAME_ICON_MAX_LOCAL_FILE_SIZE: () => CUSTOM_TABLE_NAME_ICON_MAX_LOCAL_FILE_SIZE,
  });


  const isCustomTableNameIconContextAllowed = createIsCustomTableNameIconContextAllowed({
    isCustomTableNameIconTableDenied: (...a: any[]) => isCustomTableNameIconTableDenied(...a),
    CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS: CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS,
    CUSTOM_TABLE_NAME_ICON_DENIED_MODULES: CUSTOM_TABLE_NAME_ICON_DENIED_MODULES,
    CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS: CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS,
  });

  const getCustomTableNameIconFallbackContexts = createGetCustomTableNameIconFallbackContexts({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
    isCustomTableNameIconContextAllowed: (...a: any[]) => isCustomTableNameIconContextAllowed(...a),
  });

  const CustomTableNameIconStoreManager = createCustomTableNameIconStoreManager({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
    normalizeCustomTableNameIconEntry: (...a: any[]) => normalizeCustomTableNameIconEntry(...a),
    STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS: STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS,
  });

  const resolveCustomTableNameIcon = createResolveCustomTableNameIcon({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
    getCustomTableNameIconFallbackContexts: (...a: any[]) => getCustomTableNameIconFallbackContexts(...a),
    isCustomTableNameIconContextAllowed: (...a: any[]) => isCustomTableNameIconContextAllowed(...a),
    normalizeCustomTableNameIconContext: (...a: any[]) => normalizeCustomTableNameIconContext(...a),
    normalizeCustomTableNameIconKeyPart: (...a: any[]) => normalizeCustomTableNameIconKeyPart(...a),
    CustomTableNameIconStoreManager: CustomTableNameIconStoreManager,
  });

  const resolveCustomTableNameIconAssetUrl = createResolveCustomTableNameIconAssetUrl({
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
    resolveCustomTableNameIcon: (...a: any[]) => resolveCustomTableNameIcon(...a),
  });

  type CustomTableNameIconManagerCandidateSource = 'direct' | 'interaction' | 'saved';

  interface CustomTableNameIconManagerRawSheet {
    key: string;
    name: string;
    content: unknown[][];
  }

  interface CustomTableNameIconManagerCandidate {
    context: CustomTableNameIconContext;
    key: string;
    tableKey: string;
    source: CustomTableNameIconManagerCandidateSource;
    searchText: string;
  }

  const CUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS = createCustomTableNameIconManagerModuleLabels({

  });

  const CUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS = createCustomTableNameIconManagerSectionLabels({

  });

  const CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION = createCustomTableNameIconManagerDirectModuleBySection({

  });

  const getCustomTableNameIconManagerModuleLabel = createGetCustomTableNameIconManagerModuleLabel({
    getCUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS: () => CUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS,
  });

  const getCustomTableNameIconManagerSectionLabel = createGetCustomTableNameIconManagerSectionLabel({
    getCUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS: () => CUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS,
  });

  const getCustomTableNameIconManagerSourceLabel = createGetCustomTableNameIconManagerSourceLabel({

  });

  const getCustomTableNameIconManagerContextLabel = createGetCustomTableNameIconManagerContextLabel({
    getCustomTableNameIconManagerModuleLabel: (...a: any[]) => getCustomTableNameIconManagerModuleLabel(...a),
    getCustomTableNameIconManagerSectionLabel: (...a: any[]) => getCustomTableNameIconManagerSectionLabel(...a),
    normalizeGlobalInteractionCategoryText: (...a: any[]) => normalizeGlobalInteractionCategoryText(...a),
  });

  const getCustomTableNameIconManagerLocalKey = createGetCustomTableNameIconManagerLocalKey({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
  });

  const getCustomTableNameIconManagerRawSheets = createGetCustomTableNameIconManagerRawSheets({
    getTableData: (...a: any[]) => getTableData(...a),
    isRecord: (...a: any[]) => isRecord(...a),
    isTwoDimensionalArray: (...a: any[]) => isTwoDimensionalArray(...a),
  });

  const resolveCustomTableNameIconManagerDirectSection = createResolveCustomTableNameIconManagerDirectSection({
    normalizeGlobalInteractionCategoryText: (...a: any[]) => normalizeGlobalInteractionCategoryText(...a),
    resolveGlobalInteractionSectionMeta: (...a: any[]) => resolveGlobalInteractionSectionMeta(...a),
  });

  const createCustomTableNameIconManagerCandidate = createCreateCustomTableNameIconManagerCandidate({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
    getCustomTableNameIconManagerModuleLabel: (...a: any[]) => getCustomTableNameIconManagerModuleLabel(...a),
    getCustomTableNameIconManagerSectionLabel: (...a: any[]) => getCustomTableNameIconManagerSectionLabel(...a),
    getCustomTableNameIconManagerSourceLabel: (...a: any[]) => getCustomTableNameIconManagerSourceLabel(...a),
    isCustomTableNameIconContextAllowed: (...a: any[]) => isCustomTableNameIconContextAllowed(...a),
    normalizeCustomTableNameIconContext: (...a: any[]) => normalizeCustomTableNameIconContext(...a),
  });

  const getCustomTableNameIconManagerCandidates = createGetCustomTableNameIconManagerCandidates({
    buildGlobalInteractionGroups: (...a: any[]) => buildGlobalInteractionGroups(...a),
    createCustomTableNameIconManagerCandidate: (...a: any[]) => createCustomTableNameIconManagerCandidate(...a),
    getCustomTableNameIconManagerModuleLabel: (...a: any[]) => getCustomTableNameIconManagerModuleLabel(...a),
    getCustomTableNameIconManagerRawSheets: (...a: any[]) => getCustomTableNameIconManagerRawSheets(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    resolveCustomTableNameIconManagerDirectSection: (...a: any[]) => resolveCustomTableNameIconManagerDirectSection(...a),
    resolveCustomTableNameIconRowName: (...a: any[]) => resolveCustomTableNameIconRowName(...a),
    resolveDashboardCustomTableNameIconContextInfo: (...a: any[]) => resolveDashboardCustomTableNameIconContextInfo(...a),
    resolveGlobalInteractionRowTitle: (...a: any[]) => resolveGlobalInteractionRowTitle(...a),
    resolveGlobalInteractionSectionMeta: (...a: any[]) => resolveGlobalInteractionSectionMeta(...a),
    CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION: CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION,
    CustomTableNameIconStoreManager: CustomTableNameIconStoreManager,
  });

  const getCustomTableNameIconManagerInvalidSourceText = createGetCustomTableNameIconManagerInvalidSourceText({

  });

  const getCustomTableNameIconManagerEntryAsset = createGetCustomTableNameIconManagerEntryAsset({

    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
  });

  const normalizeCustomTableNameIconPackEntryMetadata = createNormalizeCustomTableNameIconPackEntryMetadata({

  });

  const normalizeCustomTableNameIconPackEntry = createNormalizeCustomTableNameIconPackEntry({
    normalizeCustomTableNameIconContext: (...a: any[]) => normalizeCustomTableNameIconContext(...a),
    normalizeCustomTableNameIconPackEntryMetadata: (...a: any[]) => normalizeCustomTableNameIconPackEntryMetadata(...a),
  });

  const buildCustomTableNameIconPackEntry = createBuildCustomTableNameIconPackEntry({
    getCustomTableNameIconManagerLocalKey: (...a: any[]) => getCustomTableNameIconManagerLocalKey(...a),
    isCustomTableNameIconContextAllowed: (...a: any[]) => isCustomTableNameIconContextAllowed(...a),
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
  });

  const buildCustomTableNameIconPack = createBuildCustomTableNameIconPack({
    buildCustomTableNameIconPackEntry: (...a: any[]) => buildCustomTableNameIconPackEntry(...a),
    getCUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION: () => CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION,
    getCustomTableNameIconStoreManager: () => CustomTableNameIconStoreManager,
  });

  const downloadCustomTableNameIconPack = createDownloadCustomTableNameIconPack({

  });

  const analyzeCustomTableNameIconPackImport = createAnalyzeCustomTableNameIconPackImport({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
    getCustomTableNameIconImageUrlValidationError: (...a: any[]) => getCustomTableNameIconImageUrlValidationError(...a),
    getCustomTableNameIconManagerLocalKey: (...a: any[]) => getCustomTableNameIconManagerLocalKey(...a),
    isCustomTableNameIconContextAllowed: (...a: any[]) => isCustomTableNameIconContextAllowed(...a),
    normalizeCustomTableNameIconPackEntry: (...a: any[]) => normalizeCustomTableNameIconPackEntry(...a),
    CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION: CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION,
    CustomTableNameIconStoreManager: CustomTableNameIconStoreManager,
  });

  const getCustomTableNameIconPackImportSummaryText = createGetCustomTableNameIconPackImportSummaryText({

  });

  type DiceSystemConfirmTone = 'warning' | 'danger';

  const showDiceSystemConfirmDialog = createShowDiceSystemConfirmDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  const showDiceSystemInputDialog = createShowDiceSystemInputDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  const showCustomTableNameIconManager = createShowCustomTableNameIconManager({
    analyzeCustomTableNameIconPackImport: (...a: any[]) => analyzeCustomTableNameIconPackImport(...a),
    bindEvents: (...a: any[]) => bindEvents(...a),
    bindGlobalInteractionEvents: (...a: any[]) => bindGlobalInteractionEvents(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildCustomTableNameIconPack: (...a: any[]) => buildCustomTableNameIconPack(...a),
    downloadCustomTableNameIconPack: (...a: any[]) => downloadCustomTableNameIconPack(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCustomTableNameIconImageUrlValidationError: (...a: any[]) => getCustomTableNameIconImageUrlValidationError(...a),
    getCustomTableNameIconLocalFileValidationError: (...a: any[]) => getCustomTableNameIconLocalFileValidationError(...a),
    getCustomTableNameIconManagerCandidates: (...a: any[]) => getCustomTableNameIconManagerCandidates(...a),
    getCustomTableNameIconManagerContextLabel: (...a: any[]) => getCustomTableNameIconManagerContextLabel(...a),
    getCustomTableNameIconManagerEntryAsset: (...a: any[]) => getCustomTableNameIconManagerEntryAsset(...a),
    getCustomTableNameIconManagerInvalidSourceText: (...a: any[]) => getCustomTableNameIconManagerInvalidSourceText(...a),
    getCustomTableNameIconManagerLocalKey: (...a: any[]) => getCustomTableNameIconManagerLocalKey(...a),
    getCustomTableNameIconManagerModuleLabel: (...a: any[]) => getCustomTableNameIconManagerModuleLabel(...a),
    getCustomTableNameIconPackImportSummaryText: (...a: any[]) => getCustomTableNameIconPackImportSummaryText(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    renderDashboard: (...a: any[]) => renderDashboard(...a),
    renderGlobalInteractionsPanel: (...a: any[]) => renderGlobalInteractionsPanel(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    CustomTableNameIconStoreManager: CustomTableNameIconStoreManager,
    STORAGE_KEY_DASHBOARD_ACTIVE: STORAGE_KEY_DASHBOARD_ACTIVE,
    STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE: STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
    loadDashboardNpcAvatars: (...a: any[]) => loadDashboardNpcAvatars(...a),
    getCachedRawData: () => cachedRawData,
  });
  const _boundRenderHandler_ACC = { get v(){ return _boundRenderHandler; }, set v(x){ _boundRenderHandler = x; } };
  const _boundReviewBaselineHandler_ACC = { get v(){ return _boundReviewBaselineHandler; }, set v(x){ _boundReviewBaselineHandler = x; } };
  const cachedRawData_ACC = { get v(){ return cachedRawData; }, set v(x){ cachedRawData = x; } };
  const currentDiffMap_ACC = { get v(){ return currentDiffMap; }, set v(x){ currentDiffMap = x; } };
  const hasUnsavedChanges_ACC = { get v(){ return hasUnsavedChanges; }, set v(x){ hasUnsavedChanges = x; } };
  const isAutoTransforming_ACC = { get v(){ return isAutoTransforming; }, set v(x){ isAutoTransforming = x; } };
  const isEditingOrder_ACC = { get v(){ return isEditingOrder; }, set v(x){ isEditingOrder = x; } };
  const isInitialized_ACC = { get v(){ return isInitialized; }, set v(x){ isInitialized = x; } };
  const isSaving_ACC = { get v(){ return isSaving; }, set v(x){ isSaving = x; } };
  const isSettingsOpen_ACC = { get v(){ return isSettingsOpen; }, set v(x){ isSettingsOpen = x; } };
  const lastOptionHash_ACC = { get v(){ return lastOptionHash; }, set v(x){ lastOptionHash = x; } };
  const observer_ACC = { get v(){ return observer; }, set v(x){ observer = x; } };
  const optionPanelVisible_ACC = { get v(){ return optionPanelVisible; }, set v(x){ optionPanelVisible = x; } };
  const saveQueue_ACC = { get v(){ return saveQueue; }, set v(x){ saveQueue = x; } };
  const tablePageStates_ACC = { get v(){ return tablePageStates; }, set v(x){ tablePageStates = x; } };
  const tableScrollStates_ACC = { get v(){ return tableScrollStates; }, set v(x){ tableScrollStates = x; } };
  const tableSearchStates_ACC = { get v(){ return tableSearchStates; }, set v(x){ tableSearchStates = x; } };
  return { ACTION_BUTTONS, DashboardDataParser, DashboardPresetManager, FONTS, THEMES, UpdateController, buildGlobalInteractionGroups, clearModalStack, collectHostAndLocalNodes, createAutoRegexTransformKey, createDashboardPresetEditorTemplate, createElementFromHtml, createGlobalInteractionSections, debugGlobalInteraction, dedupeInteractionActions, downloadAiPromptFile, downloadJsonFile, downloadJsoncFile, executeTableInteractionAction, extractNumericValue, getActiveDashboardRelationshipGraphSources, getCore, getCurrentContextFingerprint, getDashboardModuleConfig, getDatabaseManualUpdateErrorMessage, getIconForTableName, getInteractOptionsForRow, getJsonLikeErrorMessage, getNavigationFontMetrics, getPendingDeletions, getResultBadgeClass, getTavernHostDocument, getTavernHostWindow, isCustomTableNameIconImageUrlValid, isNumericCell, isRecord, isTwoDimensionalArray, normalizeCollapseStyle, normalizeInteractionLabel, openDatabaseInterface, openDatabaseVisualizerInterface, parseAttributeString, parseDashboardPresetJson, parseJsoncDocument, parseJsoncRecord, parseJsoncValue, parseRelationshipString, pickTextFile, popModal, pushModal, readTextFile, rememberAutoRegexTransform, resolveCustomTableNameIcon, resolveDashboardCustomTableNameIconContextInfo, resolveGlobalInteractionSectionMeta, runDatabaseManualUpdate, shouldSkipAutoRegexTransform, showCustomTableNameIconManager, showDatabaseManualUpdateFailure, showDiceSystemConfirmDialog, showDiceSystemInputDialog, updateSaveButtonState, validateJsoncEditorConfig, _boundRenderHandler_ACC, _boundReviewBaselineHandler_ACC, cachedRawData_ACC, currentDiffMap_ACC, hasUnsavedChanges_ACC, isAutoTransforming_ACC, isEditingOrder_ACC, isInitialized_ACC, isSaving_ACC, isSettingsOpen_ACC, lastOptionHash_ACC, observer_ACC, optionPanelVisible_ACC, saveQueue_ACC, tablePageStates_ACC, tableScrollStates_ACC, tableSearchStates_ACC };
}
