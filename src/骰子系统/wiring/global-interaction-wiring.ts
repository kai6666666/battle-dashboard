/**
 * wiring / global-interaction-wiring.ts — 全局交互面板装配簇（从 index.ts 迁出，x4-w）。
 */
import { createRenderChangesPanel } from '../features/changes/render-changes-panel';
import { createBindGlobalInteractionEvents } from '../features/interactions/bind-global-interaction-events';
import { createHydrateGlobalInteractionAvatars } from '../features/interactions/hydrate-global-interaction-avatars';
import { createRenderGlobalInteractionAvatar } from '../features/interactions/render-global-interaction-avatar';
import { createRenderGlobalInteractionRowCard } from '../features/interactions/render-global-interaction-row-card';
import { createRenderGlobalInteractionsPanel } from '../features/interactions/render-global-interactions-panel';
import { createRenderGlobalInteractionsSection } from '../features/interactions/render-global-interactions-section';
import { createGetGlobalInteractionAvatarLookupNames } from '../features/table/get-global-interaction-avatar-lookup-names';
import { createGetGlobalInteractionCollapsedSections } from '../features/table/get-global-interaction-collapsed-sections';
import { createRenderGlobalInteractionActionButton } from '../features/table/render-global-interaction-action-button';
import { createRenderGlobalInteractionGenericMark } from '../features/table/render-global-interaction-generic-mark';
import { createRenderGlobalInteractionItemMark } from '../features/table/render-global-interaction-item-mark';
import { createRenderGlobalInteractionMapMark } from '../features/table/render-global-interaction-map-mark';
import { createRenderGlobalInteractionsTableGroup } from '../features/table/render-global-interactions-table-group';
import { createBindOptionEvents } from '../features/ui/bind-option-events';
import { createInjectIndependentOptions } from '../features/ui/inject-independent-options';
import { createInsertHtmlToPage } from '../features/ui/insert-html-to-page';
import { DATA_VALIDATION_DEPRECATED_META } from '../features/validation/data-validation-deprecated-meta';
import { STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS, STORAGE_KEY_VALIDATION_MODE } from '../shared/storage-keys';

export function createGlobalInteractionWiring(deps: any) {
  const { AvatarManager, ValidationEngine, asDiffRecord, bindCompositionSafeSearchInput, bindTutorialButtonsIn, buildAvatarBackgroundStyle, buildGlobalInteractionGroups, cachedRawData_ACC, cleanupGlobalInteractionOutsideCapture_ACC, clearComposerIfCurrentText, clearGlobalInteractionOutsideCapture, closePanel, createDiffRowMatcher, createElementFromHtml, createGlobalInteractionCustomTableNameIconContext, createGlobalInteractionSections, debugGlobalInteraction, dedupeInteractionActions, escapeHtml, executeCheckSuggestionCommand, executeTableInteractionAction, findDiffSnapshotEntry, formatCssImageUrl, getConfig, getCore, getDiffRowDisplayTitle, getDiffSheetIdentity, getElementEmoji, getIconForTableName, getInteractOptionsForRow, getLocationEmoji, getPanelDragStartHeight, getResolvedComposerText, getStableTableSort, getTableData, getTavernHostDocument, getTutorialButtonHtml, isRecord, isTwoDimensionalArray, loadSnapshot, normalizeDiffRow, normalizeInteractionLabel, renderCustomTableNameIconContent, renderDeprecatedBadge, renderIcon, renderThemeIconContent, replaceUserPlaceholders, resetPanelRequestedHeight, safeDecodeURIComponent, safeEncodeURIComponent, savePanelRequestedHeight, sendChatTextAndTrigger, setPanelRequestedHeight, showActionPresetManager, smartInsertToTextarea, startTutorialFromButton, takeDiffRowMatch } = deps;
  // [新增] 独立插入选项到最新气泡
  const injectIndependentOptions = createInjectIndependentOptions({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // [修复版] 绑定选项点击事件 (优化：事件委托 + 增强发送逻辑)
  const bindOptionEvents = createBindOptionEvents({
    clearComposerIfCurrentText: (...a: any[]) => clearComposerIfCurrentText(...a),
    executeCheckSuggestionCommand: (...a: any[]) => executeCheckSuggestionCommand(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getResolvedComposerText: (...a: any[]) => getResolvedComposerText(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    sendChatTextAndTrigger: (...a: any[]) => sendChatTextAndTrigger(...a),
    smartInsertToTextarea: smartInsertToTextarea,
  });

  const insertHtmlToPage = createInsertHtmlToPage({
    createElementFromHtml: (...a: any[]) => createElementFromHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });
  // [新增] 渲染变更审核面板
  const renderChangesPanel = createRenderChangesPanel({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    createDiffRowMatcher: (...a: any[]) => createDiffRowMatcher(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getDiffRowDisplayTitle: (...a: any[]) => getDiffRowDisplayTitle(...a),
    getDiffSheetIdentity: (...a: any[]) => getDiffSheetIdentity(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeDiffRow: (...a: any[]) => normalizeDiffRow(...a),
    renderDeprecatedBadge: (...a: any[]) => renderDeprecatedBadge(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    takeDiffRowMatch: (...a: any[]) => takeDiffRowMatch(...a),
    DATA_VALIDATION_DEPRECATED_META: DATA_VALIDATION_DEPRECATED_META,
    STORAGE_KEY_VALIDATION_MODE: STORAGE_KEY_VALIDATION_MODE,
    ValidationEngine: ValidationEngine,
    getStableTableSort: (...a: any[]) => getStableTableSort(...a),
  });

  const renderGlobalInteractionActionButton = createRenderGlobalInteractionActionButton({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
  });

  const getGlobalInteractionAvatarLookupNames = createGetGlobalInteractionAvatarLookupNames({
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
  });

  const renderGlobalInteractionAvatar = createRenderGlobalInteractionAvatar({
    buildAvatarBackgroundStyle: (...a: any[]) => buildAvatarBackgroundStyle(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGlobalInteractionAvatarLookupNames: (...a: any[]) => getGlobalInteractionAvatarLookupNames(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    AvatarManager: AvatarManager,
  });

  const renderGlobalInteractionMapMark = createRenderGlobalInteractionMapMark({
    createGlobalInteractionCustomTableNameIconContext: (...a: any[]) => createGlobalInteractionCustomTableNameIconContext(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getLocationEmoji: (...a: any[]) => getLocationEmoji(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderIcon: (...a: any[]) => renderIcon(...a),
  });

  const renderGlobalInteractionGenericMark = createRenderGlobalInteractionGenericMark({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
  });

  const renderGlobalInteractionItemMark = createRenderGlobalInteractionItemMark({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderThemeIconContent: (...a: any[]) => renderThemeIconContent(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
  });

  const renderGlobalInteractionRowCard = createRenderGlobalInteractionRowCard({
    createGlobalInteractionCustomTableNameIconContext: (...a: any[]) => createGlobalInteractionCustomTableNameIconContext(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    renderGlobalInteractionActionButton: (...a: any[]) => renderGlobalInteractionActionButton(...a),
    renderGlobalInteractionAvatar: (...a: any[]) => renderGlobalInteractionAvatar(...a),
    renderGlobalInteractionGenericMark: (...a: any[]) => renderGlobalInteractionGenericMark(...a),
    renderGlobalInteractionItemMark: (...a: any[]) => renderGlobalInteractionItemMark(...a),
    renderGlobalInteractionMapMark: (...a: any[]) => renderGlobalInteractionMapMark(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
  });

  const getGlobalInteractionCollapsedSections = createGetGlobalInteractionCollapsedSections({

  });

  const renderGlobalInteractionsTableGroup = createRenderGlobalInteractionsTableGroup({
    renderGlobalInteractionRowCard: (...a: any[]) => renderGlobalInteractionRowCard(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
  });

  const renderGlobalInteractionsSection = createRenderGlobalInteractionsSection({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGlobalInteractionCollapsedSections: (...a: any[]) => getGlobalInteractionCollapsedSections(...a),
    renderGlobalInteractionsTableGroup: (...a: any[]) => renderGlobalInteractionsTableGroup(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
  });

  const renderGlobalInteractionsPanel = createRenderGlobalInteractionsPanel({
    buildGlobalInteractionGroups: (...a: any[]) => buildGlobalInteractionGroups(...a),
    createGlobalInteractionSections: (...a: any[]) => createGlobalInteractionSections(...a),
    debugGlobalInteraction: (...a: any[]) => debugGlobalInteraction(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    renderGlobalInteractionsSection: (...a: any[]) => renderGlobalInteractionsSection(...a),
  });

  const hydrateGlobalInteractionAvatars = createHydrateGlobalInteractionAvatars({
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getCore: (...a: any[]) => getCore(...a),
    getGlobalInteractionAvatarLookupNames: (...a: any[]) => getGlobalInteractionAvatarLookupNames(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    AvatarManager: AvatarManager,
  });

  const bindGlobalInteractionEvents = createBindGlobalInteractionEvents({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    clearGlobalInteractionOutsideCapture: (...a: any[]) => clearGlobalInteractionOutsideCapture(...a),
    closePanel: (...a: any[]) => closePanel(...a),
    debugGlobalInteraction: (...a: any[]) => debugGlobalInteraction(...a),
    dedupeInteractionActions: (...a: any[]) => dedupeInteractionActions(...a),
    executeTableInteractionAction: (...a: any[]) => executeTableInteractionAction(...a),
    getCore: (...a: any[]) => getCore(...a),
    getGlobalInteractionCollapsedSections: (...a: any[]) => getGlobalInteractionCollapsedSections(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateGlobalInteractionAvatars: (...a: any[]) => hydrateGlobalInteractionAvatars(...a),
    isRecord: (...a: any[]) => isRecord(...a),
    isTwoDimensionalArray: (...a: any[]) => isTwoDimensionalArray(...a),
    normalizeInteractionLabel: (...a: any[]) => normalizeInteractionLabel(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    startTutorialFromButton: (...a: any[]) => startTutorialFromButton(...a),
    bindCompositionSafeSearchInput: (...a: any[]) => bindCompositionSafeSearchInput(...a),
    getInteractOptionsForRow: (...a: any[]) => getInteractOptionsForRow(...a),
    showActionPresetManager: (...a: any[]) => showActionPresetManager(...a),
    STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS: STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS,
    getCachedRawData: () => cachedRawData_ACC.v,
    getCleanupGlobalInteractionOutsideCapture: () => cleanupGlobalInteractionOutsideCapture_ACC.v,
    setCleanupGlobalInteractionOutsideCapture: (v: any) => { cleanupGlobalInteractionOutsideCapture_ACC.v = v; },
  });
  return { bindGlobalInteractionEvents, bindOptionEvents, injectIndependentOptions, insertHtmlToPage, renderChangesPanel, renderGlobalInteractionsPanel };
}
