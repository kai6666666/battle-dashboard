/**
 * wiring / table-state-wiring.ts — 表格状态/渲染工具装配簇（从 index.ts 迁出，x4-m）。
 */
import { createBuildCheckValueText } from '../features/checks/build-check-value-text';
import { createGetCheckSuggestionItemsFromTable } from '../features/checks/get-check-suggestion-items-from-table';
import { createRenderInlineQuickCheckButton } from '../features/checks/render-inline-quick-check-button';
import { createClearPresetAttributesForCharacter } from '../features/dice/clear-preset-attributes';
import { createShowDiceSettingsPanel } from '../features/dice/dice-settings-panel';
import { createFormatSignedModifier } from '../features/dice/format-signed-modifier';
import { createGenerateRPGAttributes } from '../features/dice/generate-rpg-attributes';
import { createGetAttributeEntryForCharacter } from '../features/dice/get-attribute-entry-for-character';
import { createGetAttributePresetMappedTarget } from '../features/dice/get-attribute-preset-mapped-target';
import { createGetAttributeValue } from '../features/dice/get-attribute-value';
import { createGetAttributesForCharacter } from '../features/dice/get-attributes-for-character';
import { createGetDiceQuickSelectCharacterList } from '../features/dice/get-dice-quick-select-character-list';
import { createGetNamedCheckParamText } from '../features/dice/get-named-check-param-text';
import { createGetNormalQuickSelectInputSelector } from '../features/dice/get-normal-quick-select-input-selector';
import { createGetRandomSkillPool } from '../features/dice/get-random-skill-pool';
import { createGetStandardAttrs } from '../features/dice/get-standard-attrs';
import { createIsQuickSelectTargetAvailable } from '../features/dice/is-quick-select-target-available';
import { createIsSameAttributeAlias } from '../features/dice/is-same-attribute-alias';
import { createPushDiceQuickSelectCharacter } from '../features/dice/push-dice-quick-select-character';
import { RANDOM_SKILL_POOL } from '../features/dice/random-skill-pool';
import { createRenderCheckSuggestionOptionButtonHtml } from '../features/dice/render-check-suggestion-option-button-html';
import { createRenderOptionButtonHtml } from '../features/dice/render-option-button-html';
import { createResolveAttributeAliasName } from '../features/dice/resolve-attribute-alias-name';
import { createResolveQuickSelectTarget } from '../features/dice/resolve-quick-select-target';
import { createShowDicePanel } from '../features/dice/show-dice-panel';
import { createWriteAttributesToCharacter } from '../features/dice/write-attributes-to-character';
import { createCanWriteMvuPanel } from '../features/mvu/can-write-mvu-panel';
import { createGetAdvancedPresetMappedTarget } from '../features/presets/get-advanced-preset-mapped-target';
import { createGetRenderPresetBadgeStyle } from '../features/presets/get-render-preset-badge-style';
import { createParseRenderPresetAttributes } from '../features/presets/parse-render-preset-attributes';
import { createAreAllTablesReversed } from '../features/table/are-all-tables-reversed';
import { createCleanupGlobalInteractionFloatingMenus } from '../features/table/cleanup-global-interaction-floating-menus';
import { createClearGlobalInteractionOutsideCapture } from '../features/table/clear-global-interaction-outside-capture';
import { createEnsureCanonicalTableOrder } from '../features/table/ensure-canonical-table-order';
import { createGetActiveTabState } from '../features/table/get-active-tab-state';
import { createGetBadgeStyle } from '../features/table/get-badge-style';
import { createGetCollapsedState } from '../features/table/get-collapsed-state';
import { createGetFullAttributesForCharacter } from '../features/table/get-full-attributes-for-character';
import { createGetHiddenTables } from '../features/table/get-hidden-tables';
import { createGetNormalizedReverseTables } from '../features/table/get-normalized-reverse-tables';
import { createGetOptionItemsFromTable } from '../features/table/get-option-items-from-table';
import { createGetOptionsCollapsedState } from '../features/table/get-options-collapsed-state';
import { createGetReverseTables } from '../features/table/get-reverse-tables';
import { createGetSavedTableOrder } from '../features/table/get-saved-table-order';
import { createGetStableTableSort } from '../features/table/get-stable-table-sort';
import { createGetTableHeights } from '../features/table/get-table-heights';
import { createGetTableStyles } from '../features/table/get-table-styles';
import { createHandleCustomTableNameIconImageDBPagehide } from '../features/table/handle-custom-table-name-icon-image-db-pagehide';
import { createIsTableReversed } from '../features/table/is-table-reversed';
import { createLoadSnapshot } from '../features/table/load-snapshot';
import { createMaybeRefreshReviewBaselineAtFillStart } from '../features/table/maybe-refresh-review-baseline-at-fill-start';
import { createNormalizeTableNameList } from '../features/table/normalize-table-name-list';
import { createRenderDataCardCellContent } from '../features/table/render-data-card-cell-content';
import { createSaveActiveTabState } from '../features/table/save-active-tab-state';
import { createSaveCollapsedState } from '../features/table/save-collapsed-state';
import { createSaveCurrentDatabaseSnapshotAsReviewBaseline } from '../features/table/save-current-database-snapshot-as-review-baseline';
import { createSaveHiddenTables } from '../features/table/save-hidden-tables';
import { createSaveOptionsCollapsedState } from '../features/table/save-options-collapsed-state';
import { createSaveReverseTables } from '../features/table/save-reverse-tables';
import { createSaveSnapshot } from '../features/table/save-snapshot';
import { createSaveTableHeights } from '../features/table/save-table-heights';
import { createSaveTableOrder } from '../features/table/save-table-order';
import { createSaveTableStyles } from '../features/table/save-table-styles';
import { createSetAllTablesReverse } from '../features/table/set-all-tables-reverse';
import { createShouldShowReverseButton } from '../features/table/should-show-reverse-button';
import { createToggleTableReverse } from '../features/table/toggle-table-reverse';
import { createUpdateSingleAttribute } from '../features/table/update-single-attribute';
import { createAddClearButton } from '../features/ui/add-clear-button';
import { createApplyPanelDisplayMaxHeight } from '../features/ui/apply-panel-display-max-height';
import { createApplyStoredPanelHeight } from '../features/ui/apply-stored-panel-height';
import { createClampPanelHeightToDisplay } from '../features/ui/clamp-panel-height-to-display';
import { createClearAllPanelStates } from '../features/ui/clear-all-panel-states';
import { createClearPanelRequestedHeight } from '../features/ui/clear-panel-requested-height';
import { createGetActivePanelHeightKey } from '../features/ui/get-active-panel-height-key';
import { createGetPanelDisplayMaxHeight } from '../features/ui/get-panel-display-max-height';
import { createGetPanelDragStartHeight } from '../features/ui/get-panel-drag-start-height';
import { createGetStoredPanelHeight } from '../features/ui/get-stored-panel-height';
import { createInitCustomDropdown } from '../features/ui/init-custom-dropdown';
import { createNormalizePanelHeightValue } from '../features/ui/normalize-panel-height-value';
import { createResetPanelRequestedHeight } from '../features/ui/reset-panel-requested-height';
import { createSavePanelRequestedHeight } from '../features/ui/save-panel-requested-height';
import { createSetPanelRequestedHeight } from '../features/ui/set-panel-requested-height';
import { createNormalizeAttributeName } from '../shared/normalize-attribute-name';
import { STORAGE_KEY_LAST_PRESET } from '../shared/storage-keys';

export function createTableStateWiring(deps: any) {
  const { AdvancedDicePresetManager, AttributePresetManager, DEFAULT_OUTPUT_TEMPLATE, DashboardDataParser, DiceHistoryStatsDB, MAX_HISTORY, MAX_PANEL_HEIGHT, MIN_PANEL_HEIGHT, MvuModule, PANEL_VIEWPORT_TOP_GUTTER, RenderPresetManager, UpdateController, applyAdvancedPresetOutcomePolicy, bindTutorialButtonsIn, cachedRawData_ACC, characterNamesMatch, checkHistory, contestHistory, countRuntimeDataChanges, emitEvent, errorTableTemplateIssue, escapeHtml, evaluateCondition, evaluateConditionNumber, evaluateFormula, evaluateOutcomes, executeEffects, executeSecondaryEffectsChain, extractNumericValue, findAttributeColumnIndices, findCharacterAttributeRow, findPrimaryAttributeColumns, formatOutputTemplate, generateAttributeValue, getAdvancedPresetDisplayOutcome, getConfig, getCore, getCurrentContextFingerprint, getDashboardModuleConfig, getDashboardNpcListData, getDiceConfig, getResultBadgeClass, getTableData, getTavernHostDocument, getTavernHostWindow, getTutorialButtonHtml, hasSheetKeys, hideDiceResultsInUserMessages, isAttributeQuickSelectTarget, isComplexCondition, isNumericCell, normalizeAttributeQuickSelectConfig, parseAttributeString, parseRelationshipString, pickFallbackAttributeColumn, processJsonData, renderDiceHistoryStatsHtml, replaceUserPlaceholders, resolveCanonicalCharacterName, safeEncodeURIComponent, saveDiceConfig, saveRowInstantly, setTextareaValueAndNotify, setupOverlayClose, showAdvancedPresetManager, showContestPanel, showDiceSystemConfirmDialog, showGlobalDiceHistoryDialog, smartInsertToTextarea, withTableTemplateCheckHint } = deps;
  const handleCustomTableNameIconImageDBPagehide = createHandleCustomTableNameIconImageDBPagehide({

  });

  window.addEventListener('pagehide', handleCustomTableNameIconImageDBPagehide, { once: true });

  const isOptionTableName = tableName => String(tableName || '').includes('选项');
  const isCheckSuggestionTableName = tableName => String(tableName || '').includes('检定建议');

  const getOptionItemsFromTable = createGetOptionItemsFromTable({

  });

  const renderOptionButtonHtml = createRenderOptionButtonHtml({
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const renderCheckSuggestionOptionButtonHtml = createRenderCheckSuggestionOptionButtonHtml({
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const getCheckSuggestionItemsFromTable = createGetCheckSuggestionItemsFromTable({

  });

  const getBadgeStyle = createGetBadgeStyle({

  });

  interface RenderDataCardCellOptions {
    rawHeaderName: string;
    cell: unknown;
    isFieldLocked?: boolean;
    diceIconFontSize?: string;
    numericDiceMarginLeft?: boolean;
  }

  interface RenderDataCardCellResult {
    headerName: string;
    contentHtml: string;
    hideLabel: boolean;
    shouldRender: boolean;
  }

  type RenderRelationshipItem = {
    name: string;
    relation: string;
  };

  const getRenderPresetBadgeStyle = createGetRenderPresetBadgeStyle({

  });

  const parseRenderPresetAttributes = createParseRenderPresetAttributes({
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
  });

  const renderInlineQuickCheckButton = createRenderInlineQuickCheckButton({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    RenderPresetManager: RenderPresetManager,
  });

  const renderDataCardCellContent = createRenderDataCardCellContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    extractNumericValue: (...a: any[]) => extractNumericValue(...a),
    getRenderPresetBadgeStyle: (...a: any[]) => getRenderPresetBadgeStyle(...a),
    isNumericCell: (...a: any[]) => isNumericCell(...a),
    parseRelationshipString: (...a: any[]) => parseRelationshipString(...a),
    parseRenderPresetAttributes: (...a: any[]) => parseRenderPresetAttributes(...a),
    renderInlineQuickCheckButton: (...a: any[]) => renderInlineQuickCheckButton(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    RenderPresetManager: RenderPresetManager,
  });

  // [优化] 统一存储封装 (带静默自动清理)

  const getActiveTabState = createGetActiveTabState({

  });
  const saveActiveTabState = createSaveActiveTabState({
  });

  let cleanupGlobalInteractionOutsideCapture: (() => void) | null = null;

  const clearGlobalInteractionOutsideCapture = createClearGlobalInteractionOutsideCapture({
    getCleanupGlobalInteractionOutsideCapture: () => cleanupGlobalInteractionOutsideCapture,
    setCleanupGlobalInteractionOutsideCapture: (v: any) => { cleanupGlobalInteractionOutsideCapture = v; },
  });

  const cleanupGlobalInteractionFloatingMenus = createCleanupGlobalInteractionFloatingMenus({
    clearGlobalInteractionOutsideCapture: (...a: any[]) => clearGlobalInteractionOutsideCapture(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // [修复] 统一清理所有面板状态，避免状态残留导致内容错乱
  const clearAllPanelStates = createClearAllPanelStates({
    cleanupGlobalInteractionFloatingMenus: (...a: any[]) => cleanupGlobalInteractionFloatingMenus(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
  });

  // [修复] MVU 面板异步回调防竞态：只有当前仍处于 MVU 标签且无更高优先级面板激活时才允许写入
  const canWriteMvuPanel = createCanWriteMvuPanel({
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getMvuModule: () => MvuModule,
  });

  const getSavedTableOrder = createGetSavedTableOrder({

  });
  const saveTableOrder = createSaveTableOrder({
  });
  const getStableTableSort = createGetStableTableSort({
    getSavedTableOrder: (...a: any[]) => getSavedTableOrder(...a),
  });
  const ensureCanonicalTableOrder = createEnsureCanonicalTableOrder({
    getStableTableSort: (...a: any[]) => getStableTableSort(...a),
    getSavedTableOrder: (...a: any[]) => getSavedTableOrder(...a),
    saveTableOrder: (...a: any[]) => saveTableOrder(...a),
  });

  const getCollapsedState = createGetCollapsedState({

  });
  const saveCollapsedState = createSaveCollapsedState({
  });
  // [新增] 选项面板独立折叠状态管理
  const getOptionsCollapsedState = createGetOptionsCollapsedState({

  });
  const saveOptionsCollapsedState = createSaveOptionsCollapsedState({
  });
  // [修改] 读取快照时，严格核对身份证 (Chat ID)
  const loadSnapshot = createLoadSnapshot({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });

  // [修改] 保存快照时，自动注入当前的身份证
  const saveSnapshot = createSaveSnapshot({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });
  const maybeRefreshReviewBaselineAtFillStart = createMaybeRefreshReviewBaselineAtFillStart({
    getTableData: (...a: any[]) => getTableData(...a),
    hasSheetKeys: (...a: any[]) => hasSheetKeys(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    countRuntimeDataChanges: (...a: any[]) => countRuntimeDataChanges(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
  });


  const saveCurrentDatabaseSnapshotAsReviewBaseline = createSaveCurrentDatabaseSnapshotAsReviewBaseline({
    getTableData: (...a: any[]) => getTableData(...a),
    hasSheetKeys: (...a: any[]) => hasSheetKeys(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
  });

  // --- [新增] 移植的辅助函数 ---
  const getTableHeights = createGetTableHeights({

  });
  const saveTableHeights = createSaveTableHeights({
  });
  const normalizePanelHeightValue = createNormalizePanelHeightValue({
    getMAX_PANEL_HEIGHT: () => MAX_PANEL_HEIGHT,
    getMIN_PANEL_HEIGHT: () => MIN_PANEL_HEIGHT,
  });

  const getPanelDisplayMaxHeight = createGetPanelDisplayMaxHeight({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getMAX_PANEL_HEIGHT: () => MAX_PANEL_HEIGHT,
    getPANEL_VIEWPORT_TOP_GUTTER: () => PANEL_VIEWPORT_TOP_GUTTER,
  });

  const applyPanelDisplayMaxHeight = createApplyPanelDisplayMaxHeight({
    getPanelDisplayMaxHeight: (...a: any[]) => getPanelDisplayMaxHeight(...a),
  });

  const clampPanelHeightToDisplay = createClampPanelHeightToDisplay({
    getPanelDisplayMaxHeight: (...a: any[]) => getPanelDisplayMaxHeight(...a),
    getMAX_PANEL_HEIGHT: () => MAX_PANEL_HEIGHT,
    getMIN_PANEL_HEIGHT: () => MIN_PANEL_HEIGHT,
  });

  const getStoredPanelHeight = createGetStoredPanelHeight({
    getTableHeights: (...a: any[]) => getTableHeights(...a),
    normalizePanelHeightValue: (...a: any[]) => normalizePanelHeightValue(...a),
  });

  const clearPanelRequestedHeight = createClearPanelRequestedHeight({
    applyPanelDisplayMaxHeight: (...a: any[]) => applyPanelDisplayMaxHeight(...a),
  });

  const setPanelRequestedHeight = createSetPanelRequestedHeight({
    getPanelDisplayMaxHeight: (...a: any[]) => getPanelDisplayMaxHeight(...a),
    clampPanelHeightToDisplay: (...a: any[]) => clampPanelHeightToDisplay(...a),
    clearPanelRequestedHeight: (...a: any[]) => clearPanelRequestedHeight(...a),
  });

  const applyStoredPanelHeight = createApplyStoredPanelHeight({
    clearPanelRequestedHeight: (...a: any[]) => clearPanelRequestedHeight(...a),
    getStoredPanelHeight: (...a: any[]) => getStoredPanelHeight(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
  });

  const getPanelDragStartHeight = createGetPanelDragStartHeight({
    clampPanelHeightToDisplay: (...a: any[]) => clampPanelHeightToDisplay(...a),
    getMIN_PANEL_HEIGHT: () => MIN_PANEL_HEIGHT,
  });

  const savePanelRequestedHeight = createSavePanelRequestedHeight({
    getTableHeights: (...a: any[]) => getTableHeights(...a),
    normalizePanelHeightValue: (...a: any[]) => normalizePanelHeightValue(...a),
    saveTableHeights: (...a: any[]) => saveTableHeights(...a),
  });

  const resetPanelRequestedHeight = createResetPanelRequestedHeight({
    clearPanelRequestedHeight: (...a: any[]) => clearPanelRequestedHeight(...a),
    getTableHeights: (...a: any[]) => getTableHeights(...a),
    saveTableHeights: (...a: any[]) => saveTableHeights(...a),
  });

  const getActivePanelHeightKey = createGetActivePanelHeightKey({
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
  });

  const getTableStyles = createGetTableStyles({

  });
  const saveTableStyles = createSaveTableStyles({
  });
  const getHiddenTables = createGetHiddenTables({

  });
  const saveHiddenTables = createSaveHiddenTables({
  });
  const getReverseTables = createGetReverseTables({

  });
  const saveReverseTables = createSaveReverseTables({
  });

  const normalizeTableNameList = createNormalizeTableNameList({

  });

  const getNormalizedReverseTables = createGetNormalizedReverseTables({
    getReverseTables: (...a: any[]) => getReverseTables(...a),
    normalizeTableNameList: (...a: any[]) => normalizeTableNameList(...a),
  });

  // 判断表格是否需要显示倒序按钮
  const shouldShowReverseButton = createShouldShowReverseButton({

  });

  // 判断表格当前是否为倒序
  const isTableReversed = createIsTableReversed({
    getNormalizedReverseTables: (...a: any[]) => getNormalizedReverseTables(...a),
  });

  const areAllTablesReversed = createAreAllTablesReversed({
    getNormalizedReverseTables: (...a: any[]) => getNormalizedReverseTables(...a),
    normalizeTableNameList: (...a: any[]) => normalizeTableNameList(...a),
  });

  const setAllTablesReverse = createSetAllTablesReverse({
    getNormalizedReverseTables: (...a: any[]) => getNormalizedReverseTables(...a),
    normalizeTableNameList: (...a: any[]) => normalizeTableNameList(...a),
    saveReverseTables: (...a: any[]) => saveReverseTables(...a),
  });

  // 切换表格倒序状态
  const toggleTableReverse = createToggleTableReverse({
    getNormalizedReverseTables: (...a: any[]) => getNormalizedReverseTables(...a),
    saveReverseTables: (...a: any[]) => saveReverseTables(...a),
  });
  // [新增] 根据角色名获取属性列表
  const getAttributesForCharacter = createGetAttributesForCharacter({
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
  });
  const normalizeAttributeName = createNormalizeAttributeName({

  });

  const resolveAttributeAliasName = createResolveAttributeAliasName({

    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    normalizeAttributeName: (...a: any[]) => normalizeAttributeName(...a),
  });

  const isSameAttributeAlias = createIsSameAttributeAlias({
    normalizeAttributeName: (...a: any[]) => normalizeAttributeName(...a),
  });

  const getAttributeEntryForCharacter = createGetAttributeEntryForCharacter({
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    resolveAttributeAliasName: (...a: any[]) => resolveAttributeAliasName(...a),
  });

  // [新增] 根据角色名和属性名获取属性值
  const getAttributeValue = createGetAttributeValue({
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
  });

  const pushDiceQuickSelectCharacter = createPushDiceQuickSelectCharacter({
    characterNamesMatch: (...a: any[]) => characterNamesMatch(...a),
  });

  const getDiceQuickSelectCharacterList = createGetDiceQuickSelectCharacterList({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getDashboardNpcListData: (...a: any[]) => getDashboardNpcListData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    pushDiceQuickSelectCharacter: (...a: any[]) => pushDiceQuickSelectCharacter(...a),
    DashboardDataParser: DashboardDataParser,
  });

  const getAdvancedPresetMappedTarget = createGetAdvancedPresetMappedTarget({
    isAttributeQuickSelectTarget: (...a: any[]) => isAttributeQuickSelectTarget(...a),
  });

  const getAttributePresetMappedTarget = createGetAttributePresetMappedTarget({
    normalizeAttributeQuickSelectConfig: (...a: any[]) => normalizeAttributeQuickSelectConfig(...a),
    isAttributeQuickSelectTarget: (...a: any[]) => isAttributeQuickSelectTarget(...a),
  });

  const isQuickSelectTargetAvailable = createIsQuickSelectTargetAvailable({

  });

  const resolveQuickSelectTarget = createResolveQuickSelectTarget({
    getAdvancedPresetMappedTarget: (...a: any[]) => getAdvancedPresetMappedTarget(...a),
    getAttributePresetMappedTarget: (...a: any[]) => getAttributePresetMappedTarget(...a),
    isQuickSelectTargetAvailable: (...a: any[]) => isQuickSelectTargetAvailable(...a),
    getAttributePresetManager: () => AttributePresetManager,
  });

  const formatSignedModifier = createFormatSignedModifier({

  });

  const getNamedCheckParamText = createGetNamedCheckParamText({

  });

  const buildCheckValueText = createBuildCheckValueText({
    formatSignedModifier: (...a: any[]) => formatSignedModifier(...a),
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
    resolveQuickSelectTarget: (...a: any[]) => resolveQuickSelectTarget(...a),
  });

  const getNormalQuickSelectInputSelector = createGetNormalQuickSelectInputSelector({

  });
  // [新增] 标准6维属性名
  const STANDARD_ATTRS = ['力量', '敏捷', '体质', '智力', '感知', '魅力'];

  /**
   * 获取当前规则的标准属性名列表
   */
  const getStandardAttrs = createGetStandardAttrs({
    getAttributePresetManager: () => AttributePresetManager,
    getSTANDARD_ATTRS: () => STANDARD_ATTRS,
  });

  /**
   * 获取当前规则的随机属性池（包含基本属性和特殊属性）
   * 默认状态：返回所有规则预设的属性合并（超级大杂烩）
   * 选中特定规则时：返回该规则的基本属性 + 特殊属性
   */
  const getRandomSkillPool = createGetRandomSkillPool({
    AttributePresetManager: AttributePresetManager,
    getRANDOM_SKILL_POOL: () => RANDOM_SKILL_POOL,
  });

  // [新增] 随机技能池（用于属性名随机生成，可自由增减）


  // [新增] 生成 COC/DND 风格的6维属性（支持预设）
  /**
   * 生成角色属性
   * @param isDNDOrPreset 布尔值(旧版兼容) 或 预设对象 或 null(自动获取激活预设)
   * @returns { base: {...}, special: {...} } 或旧格式 {...}（向后兼容）
   */
  const generateRPGAttributes = createGenerateRPGAttributes({
    generateAttributeValue: (...a: any[]) => generateAttributeValue(...a),
    AttributePresetManager: AttributePresetManager,
    STANDARD_ATTRS: STANDARD_ATTRS,
  });

  // [简化] 清空角色的属性（直接清空基础属性列和特有属性列）
  const clearPresetAttributesForCharacter = createClearPresetAttributesForCharacter({
    errorTableTemplateIssue: (...a: any[]) => errorTableTemplateIssue(...a),
    findCharacterAttributeRow: (...a: any[]) => findCharacterAttributeRow(...a),
    findPrimaryAttributeColumns: (...a: any[]) => findPrimaryAttributeColumns(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // [新增] 将属性写入角色表格
  // [修复] 支持分别写入基础属性列和特有属性列
  const writeAttributesToCharacter = createWriteAttributesToCharacter({
    errorTableTemplateIssue: (...a: any[]) => errorTableTemplateIssue(...a),
    findCharacterAttributeRow: (...a: any[]) => findCharacterAttributeRow(...a),
    findPrimaryAttributeColumns: (...a: any[]) => findPrimaryAttributeColumns(...a),
    getStandardAttrs: (...a: any[]) => getStandardAttrs(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    AttributePresetManager: AttributePresetManager,
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // [新增] 更新属性字符串中的单个属性值（用于燃运等功能）
  const updateSingleAttribute = createUpdateSingleAttribute({
    findAttributeColumnIndices: (...a: any[]) => findAttributeColumnIndices(...a),
    findCharacterAttributeRow: (...a: any[]) => findCharacterAttributeRow(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    pickFallbackAttributeColumn: (...a: any[]) => pickFallbackAttributeColumn(...a),
    resolveAttributeAliasName: (...a: any[]) => resolveAttributeAliasName(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // [修复] 获取角色的完整属性列表（包括基础属性和特有属性等所有包含"属性"的列）
  const getFullAttributesForCharacter = createGetFullAttributesForCharacter({
    findAttributeColumnIndices: (...a: any[]) => findAttributeColumnIndices(...a),
    findCharacterAttributeRow: (...a: any[]) => findCharacterAttributeRow(...a),
    findPrimaryAttributeColumns: (...a: any[]) => findPrimaryAttributeColumns(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });
  // [新增] 自定义下拉菜单初始化函数
  const initCustomDropdown = createInitCustomDropdown({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCore: (...a: any[]) => getCore(...a),
  });
  // [新增] 给输入框添加清除按钮
  const addClearButton = createAddClearButton({
    getCore: (...a: any[]) => getCore(...a),
  });
  // [新增] 统一的骰子规则设置面板
  /**
   * @deprecated 请使用 showAdvancedPresetManager() 替代。此函数仅保留函数体以供回退。
   */
  const showDiceSettingsPanel = createShowDiceSettingsPanel({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    hideDiceResultsInUserMessages: hideDiceResultsInUserMessages,
  });
  // [新增] 显示掷骰面板
  const showDicePanel = createShowDicePanel({
    addClearButton: (...a: any[]) => addClearButton(...a),
    applyAdvancedPresetOutcomePolicy: (...a: any[]) => applyAdvancedPresetOutcomePolicy(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildCheckValueText: (...a: any[]) => buildCheckValueText(...a),
    clearPresetAttributesForCharacter: (...a: any[]) => clearPresetAttributesForCharacter(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    evaluateConditionNumber: (...a: any[]) => evaluateConditionNumber(...a),
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
    evaluateOutcomes: (...a: any[]) => evaluateOutcomes(...a),
    executeEffects: (...a: any[]) => executeEffects(...a),
    executeSecondaryEffectsChain: (...a: any[]) => executeSecondaryEffectsChain(...a),
    formatOutputTemplate: (...a: any[]) => formatOutputTemplate(...a),
    generateRPGAttributes: (...a: any[]) => generateRPGAttributes(...a),
    getAdvancedPresetDisplayOutcome: (...a: any[]) => getAdvancedPresetDisplayOutcome(...a),
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getAttributesForCharacter: (...a: any[]) => getAttributesForCharacter(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getDiceQuickSelectCharacterList: (...a: any[]) => getDiceQuickSelectCharacterList(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getNormalQuickSelectInputSelector: (...a: any[]) => getNormalQuickSelectInputSelector(...a),
    getRandomSkillPool: (...a: any[]) => getRandomSkillPool(...a),
    getResultBadgeClass: (...a: any[]) => getResultBadgeClass(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    initCustomDropdown: (...a: any[]) => initCustomDropdown(...a),
    isComplexCondition: (...a: any[]) => isComplexCondition(...a),
    isSameAttributeAlias: (...a: any[]) => isSameAttributeAlias(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    renderDiceHistoryStatsHtml: (...a: any[]) => renderDiceHistoryStatsHtml(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveAttributeAliasName: (...a: any[]) => resolveAttributeAliasName(...a),
    resolveCanonicalCharacterName: (...a: any[]) => resolveCanonicalCharacterName(...a),
    resolveQuickSelectTarget: (...a: any[]) => resolveQuickSelectTarget(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAdvancedPresetManager: (...a: any[]) => showAdvancedPresetManager(...a),
    showContestPanel: (...a: any[]) => showContestPanel(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showGlobalDiceHistoryDialog: (...a: any[]) => showGlobalDiceHistoryDialog(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    updateSingleAttribute: (...a: any[]) => updateSingleAttribute(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    writeAttributesToCharacter: (...a: any[]) => writeAttributesToCharacter(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    DEFAULT_OUTPUT_TEMPLATE: DEFAULT_OUTPUT_TEMPLATE,
    DiceHistoryStatsDB: DiceHistoryStatsDB,
    STORAGE_KEY_LAST_PRESET: STORAGE_KEY_LAST_PRESET,
    UpdateController: UpdateController,
    getCachedRawData: () => cachedRawData_ACC.v,
    getMAX_HISTORY: () => MAX_HISTORY,
    getCheckHistory: () => checkHistory,
    getContestHistory: () => contestHistory,
  });
  const cleanupGlobalInteractionOutsideCapture_ACC = { get v(){ return cleanupGlobalInteractionOutsideCapture; }, set v(x){ cleanupGlobalInteractionOutsideCapture = x; } };
  return { addClearButton, applyStoredPanelHeight, areAllTablesReversed, buildCheckValueText, canWriteMvuPanel, cleanupGlobalInteractionFloatingMenus, clearAllPanelStates, clearGlobalInteractionOutsideCapture, clearPresetAttributesForCharacter, ensureCanonicalTableOrder, generateRPGAttributes, getActivePanelHeightKey, getActiveTabState, getAttributeEntryForCharacter, getAttributeValue, getAttributesForCharacter, getBadgeStyle, getCheckSuggestionItemsFromTable, getCollapsedState, getDiceQuickSelectCharacterList, getFullAttributesForCharacter, getHiddenTables, getNamedCheckParamText, getOptionItemsFromTable, getOptionsCollapsedState, getPanelDragStartHeight, getRandomSkillPool, getSavedTableOrder, getStableTableSort, getStoredPanelHeight, getTableHeights, getTableStyles, initCustomDropdown, isCheckSuggestionTableName, isOptionTableName, isSameAttributeAlias, isTableReversed, loadSnapshot, maybeRefreshReviewBaselineAtFillStart, renderCheckSuggestionOptionButtonHtml, renderDataCardCellContent, renderOptionButtonHtml, resetPanelRequestedHeight, resolveQuickSelectTarget, saveActiveTabState, saveCollapsedState, saveCurrentDatabaseSnapshotAsReviewBaseline, saveHiddenTables, saveOptionsCollapsedState, savePanelRequestedHeight, saveSnapshot, saveTableHeights, saveTableOrder, saveTableStyles, setAllTablesReverse, setPanelRequestedHeight, shouldShowReverseButton, showDicePanel, toggleTableReverse, updateSingleAttribute, writeAttributesToCharacter, cleanupGlobalInteractionOutsideCapture_ACC };
}
