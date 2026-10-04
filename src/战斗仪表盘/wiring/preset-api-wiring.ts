/**
 * wiring / preset-api-wiring.ts — 预设管理/AcuDice API 装配簇（从 index.ts 迁出，x4-o）。
 */
import { createAcuDiceCharactersInstance } from '../features/api/acu-dice-characters-instance';
import { createAcuDiceCheckInstance } from '../features/api/acu-dice-check-instance';
import { createAcuDiceContest } from '../features/api/acu-dice-contest';
import { createAcuDiceEventsInstance } from '../features/api/acu-dice-events-instance';
import { createAcuDiceHistoryInstance } from '../features/api/acu-dice-history-instance';
import { createAcuDicePresetsInstance } from '../features/api/acu-dice-presets-instance';
import { createAcuDiceProfilesInstance } from '../features/api/acu-dice-profiles-instance';
import { createAcuDiceRollInstance } from '../features/api/acu-dice-roll-instance';
import { createDefineAcuDiceOnWindow } from '../features/api/define-acu-dice-on-window';
import { createDispatchReadyEvent } from '../features/api/dispatch-ready-event';
import { createEmitEvent } from '../features/api/emit-event';
import { createNotifyReady } from '../features/api/notify-ready';
import { AcuDiceReadyState } from '../features/api/ready';
import { createShowDebugConsoleModal } from '../features/console/debug-console-dialog';
import { createRefreshDicePanelPresets } from '../features/dice/refresh-dice-panel-presets';
import { createSharedHistoryStore } from '../features/dice/shared-history-store';
import { createShowGlobalDiceHistoryDialog } from '../features/history/dice-history-dialog';
import { createShowActionPresetEditor } from '../features/presets/action-preset-editor-dialog';
import { createShowActionPresetManager } from '../features/presets/action-preset-manager-dialog';
import { createShowAdvancedPresetEditor } from '../features/presets/advanced-preset-editor-dialog';
import { createShowAdvancedPresetManager } from '../features/presets/advanced-preset-manager-dialog';
import { createBuildActionPresetAgentPromptFilename } from '../features/presets/build-action-preset-agent-prompt-filename';
import { createBuildAdvancedPresetAgentPromptFilename } from '../features/presets/build-advanced-preset-agent-prompt-filename';
import { createBuildDashboardPresetAgentPromptFilename } from '../features/presets/build-dashboard-preset-agent-prompt-filename';
import { createBuildGachaCatalogAgentPromptFilename } from '../features/presets/build-gacha-catalog-agent-prompt-filename';
import { createBuildNewActionPresetRulesJsoncTemplate } from '../features/presets/build-new-action-preset-rules-jsonc-template';
import { createBuildNewAdvancedPresetJsoncTemplate } from '../features/presets/build-new-advanced-preset-jsonc-template';
import { createBuildRenderPresetAgentPromptFilename } from '../features/presets/build-render-preset-agent-prompt-filename';
import { createBuildTableTemplateRequirementPresetAgentPromptFilename } from '../features/presets/build-table-template-requirement-preset-agent-prompt-filename';
import { createShowDashboardPresetEditor } from '../features/presets/dashboard-preset-editor-dialog';
import { createShowDashboardPresetManager } from '../features/presets/dashboard-preset-manager-dialog';
import { createShowPresetListDialog } from '../features/presets/preset-list-dialog';
import { createShowRenderPresetEditor } from '../features/presets/render-preset-editor-dialog';
import { createShowRenderPresetManager } from '../features/presets/render-preset-manager-dialog';
import { getAcuDiceProfilePromptKey } from '../features/profiles/profile-packages';
import { createShowAddRegexRuleModal } from '../features/regex/add-regex-rule-dialog';
import { createResolveRootWindow } from '../features/ui/resolve-root-window';
import { createCopyTextWithTavernApi } from '../shared/copy-text-with-tavern-api';
import { createSortableListFactory } from '../shared/ui/sortable-list';

import type { CheckHistoryExtension } from '../shared/advanced-preset-types';
import type { DiceStatsScope } from '../shared/index-local-types';



export function createPresetApiWiring(deps: any) {
  const { ActionPresetManager, AcuDiceAPI, AdvancedDicePresetManager, DASHBOARD_DEFAULT_PRESET_ID, DASHBOARD_PRESET_MODULE_KEYS, DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY, DashboardDataParser, DashboardPresetManager, DiceHistoryStatsDB, NameAliasRegistry, RENDER_DEFAULT_PRESET_ID, RegexTransformationEngine, RegexTransformationManager, RenderPresetManager, applyDiceProfile, bindTutorialButtonsIn, buildActionPresetAgentPrompt, buildAdvancedPresetAgentPrompt, buildDashboardPresetAgentPrompt, buildRenderPresetAgentPrompt, cachedRawData_ACC, clearModalStack, cloneDashboardPresetModules, cloneRenderPresetRules, createDashboardPresetEditorTemplate, createRenderPresetEditorTemplate, detectCharacterDiceProfile, downloadAiPromptFile, downloadJsonFile, escapeHtml, evaluateFormula, exportDiceProfile, getAdvancedPresetErrorMessage, getAttributeValue, getConfig, getCore, getCrazyModeConfig, getDiceConfig, getDiceProfileCharacterContext, getDiceProfilePromptState, getFullAttributesForCharacter, getJsonLikeErrorMessage, getSuccessLevel, getTableData, getTutorialButtonHtml, hideDiceResultsInUserMessages, importDiceProfile, isRecordValue, normalizeCheckSuggestionDiceFormula, parseAdvancedPresetText, parseDashboardPresetJson, parseJsoncRecord, parseJsoncValue, parseRenderPresetJson, pickTextFile, popModal, processJsonData, pushModal, readTextFile, refreshDialogueIndentRender, refreshDiceProfileIndex, refreshRegexRulesList, renderDiceHistoryStatsHtml, renderInterface, resolveCanonicalCharacterName, saveCrazyModeConfig, saveCurrentDiceProfile, saveDiceConfig, settleGachaFortuneForDiceEvent, setupOverlayClose, showAttributePresetManager, showDiceSystemConfirmDialog, toDiceProfileSummary, validateJsoncEditorConfig } = deps;
  const createSortableList = createSortableListFactory({

  });

  // 刷新已打开的检定面板的预设按钮
  const refreshDicePanelPresets = createRefreshDicePanelPresets({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCore: (...a: any[]) => getCore(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
  });

  const showPresetListDialog = createShowPresetListDialog({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getAdvancedPresetErrorMessage: (...a: any[]) => getAdvancedPresetErrorMessage(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    readTextFile: (...a: any[]) => readTextFile(...a),
    refreshDicePanelPresets: (...a: any[]) => refreshDicePanelPresets(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAdvancedPresetEditor: (...a: any[]) => showAdvancedPresetEditor(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    createSortableList: createSortableList,
  });

  const showAdvancedPresetManager = createShowAdvancedPresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    clearModalStack: (...a: any[]) => clearModalStack(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    saveCrazyModeConfig: (...a: any[]) => saveCrazyModeConfig(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAttributePresetManager: (...a: any[]) => showAttributePresetManager(...a),
    showPresetListDialog: (...a: any[]) => showPresetListDialog(...a),
    hideDiceResultsInUserMessages: hideDiceResultsInUserMessages,
  });

  const buildNewAdvancedPresetJsoncTemplate = createBuildNewAdvancedPresetJsoncTemplate({

  });

  const buildAdvancedPresetAgentPromptFilename = createBuildAdvancedPresetAgentPromptFilename({

  });

  const buildDashboardPresetAgentPromptFilename = createBuildDashboardPresetAgentPromptFilename({

  });

  const buildActionPresetAgentPromptFilename = createBuildActionPresetAgentPromptFilename({

  });

  const buildRenderPresetAgentPromptFilename = createBuildRenderPresetAgentPromptFilename({

  });

  const buildTableTemplateRequirementPresetAgentPromptFilename = createBuildTableTemplateRequirementPresetAgentPromptFilename({

  });

  const buildGachaCatalogAgentPromptFilename = createBuildGachaCatalogAgentPromptFilename({

  });

  const showAdvancedPresetEditor = createShowAdvancedPresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildAdvancedPresetAgentPrompt: (...a: any[]) => buildAdvancedPresetAgentPrompt(...a),
    buildAdvancedPresetAgentPromptFilename: (...a: any[]) => buildAdvancedPresetAgentPromptFilename(...a),
    buildNewAdvancedPresetJsoncTemplate: (...a: any[]) => buildNewAdvancedPresetJsoncTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getAdvancedPresetErrorMessage: (...a: any[]) => getAdvancedPresetErrorMessage(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseAdvancedPresetText: (...a: any[]) => parseAdvancedPresetText(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    refreshDicePanelPresets: (...a: any[]) => refreshDicePanelPresets(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  // 交互规则预设管理
  // ========================================
  const showActionPresetManager = createShowActionPresetManager({
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showActionPresetEditor: (...a: any[]) => showActionPresetEditor(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ActionPresetManager: ActionPresetManager,
  });

  const buildNewActionPresetRulesJsoncTemplate = createBuildNewActionPresetRulesJsoncTemplate({

  });

  // 交互规则编辑器（JSON配置风格）
  const showActionPresetEditor = createShowActionPresetEditor({
    buildActionPresetAgentPrompt: (...a: any[]) => buildActionPresetAgentPrompt(...a),
    buildActionPresetAgentPromptFilename: (...a: any[]) => buildActionPresetAgentPromptFilename(...a),
    buildNewActionPresetRulesJsoncTemplate: (...a: any[]) => buildNewActionPresetRulesJsoncTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    parseJsoncValue: (...a: any[]) => parseJsoncValue(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ActionPresetManager: ActionPresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  // 仪表盘预设管理
  // ========================================
  const showDashboardPresetManager = createShowDashboardPresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDashboardPresetEditor: (...a: any[]) => showDashboardPresetEditor(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    DASHBOARD_DEFAULT_PRESET_ID: DASHBOARD_DEFAULT_PRESET_ID,
    DASHBOARD_PRESET_MODULE_KEYS: DASHBOARD_PRESET_MODULE_KEYS,
    DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY: DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY,
    DashboardPresetManager: DashboardPresetManager,
  });

  const showDashboardPresetEditor = createShowDashboardPresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildDashboardPresetAgentPrompt: (...a: any[]) => buildDashboardPresetAgentPrompt(...a),
    buildDashboardPresetAgentPromptFilename: (...a: any[]) => buildDashboardPresetAgentPromptFilename(...a),
    cloneDashboardPresetModules: (...a: any[]) => cloneDashboardPresetModules(...a),
    createDashboardPresetEditorTemplate: (...a: any[]) => createDashboardPresetEditorTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseDashboardPresetJson: (...a: any[]) => parseDashboardPresetJson(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    DashboardPresetManager: DashboardPresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  // 渲染预设管理
  // ========================================
  const showRenderPresetManager = createShowRenderPresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    refreshDialogueIndentRender: (...a: any[]) => refreshDialogueIndentRender(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showRenderPresetEditor: (...a: any[]) => showRenderPresetEditor(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    RENDER_DEFAULT_PRESET_ID: RENDER_DEFAULT_PRESET_ID,
    RenderPresetManager: RenderPresetManager,
  });

  const showRenderPresetEditor = createShowRenderPresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildRenderPresetAgentPrompt: (...a: any[]) => buildRenderPresetAgentPrompt(...a),
    buildRenderPresetAgentPromptFilename: (...a: any[]) => buildRenderPresetAgentPromptFilename(...a),
    cloneRenderPresetRules: (...a: any[]) => cloneRenderPresetRules(...a),
    createRenderPresetEditorTemplate: (...a: any[]) => createRenderPresetEditorTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseRenderPresetJson: (...a: any[]) => parseRenderPresetJson(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    refreshDialogueIndentRender: (...a: any[]) => refreshDialogueIndentRender(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    RenderPresetManager: RenderPresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  const showDebugConsoleModal = createShowDebugConsoleModal({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  // ========================================
  // showAddRegexRuleModal - 新建/编辑表格正则规则弹窗 (Phase 4.2)
  // ========================================
  const showAddRegexRuleModal = createShowAddRegexRuleModal({
    getTableData: (...a: any[]) => getTableData(...a),
    refreshRegexRulesList: (...a: any[]) => refreshRegexRulesList(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    RegexTransformationEngine: RegexTransformationEngine,
    RegexTransformationManager: RegexTransformationManager,
    getCachedRawData: () => cachedRawData_ACC.v,
      getCore: (...a: any[]) => getCore(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
});

  // 暴露到全局
  window.showAddRegexRuleModal = showAddRegexRuleModal;

  // 暴露到全局，供紧急入口按钮调用
  window.showDebugConsoleModal = showDebugConsoleModal;

  // ========================================
  // AcuDice 公共 API - 供其他插件和角色卡调用
  // ========================================

  const ACUDICE_READY_EVENT = 'acudice:ready';

  const resolveRootWindow = createResolveRootWindow({

  });

  const rootWindow = resolveRootWindow();
  const acuDiceReady = new AcuDiceReadyState();
  const acuDicePresets = createAcuDicePresetsInstance({
    getActionPresetManager: () => ActionPresetManager,
  });
  const acuDiceCharacters = createAcuDiceCharactersInstance({
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getDashboardDataParser: () => DashboardDataParser,
  });
  const acuDiceRoll = createAcuDiceRollInstance({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });
  const acuDiceProfiles = createAcuDiceProfilesInstance({
    refreshDiceProfileIndex: (...a: any[]) => refreshDiceProfileIndex(...a),
    saveCurrentDiceProfile: (...a: any[]) => saveCurrentDiceProfile(...a),
    toDiceProfileSummary: (...a: any[]) => toDiceProfileSummary(...a),
    importDiceProfile: (...a: any[]) => importDiceProfile(...a),
    applyDiceProfile: (...a: any[]) => applyDiceProfile(...a),
    exportDiceProfile: (...a: any[]) => exportDiceProfile(...a),
    detectCharacterDiceProfile: (...a: any[]) => detectCharacterDiceProfile(...a),
    getDiceProfileCharacterContext: (...a: any[]) => getDiceProfileCharacterContext(...a),
    getDiceProfilePromptState: (...a: any[]) => getDiceProfilePromptState(...a),
    getAcuDiceProfilePromptKey: (...a: any[]) => getAcuDiceProfilePromptKey(...a),
  });
  const acuDiceCheck = createAcuDiceCheckInstance({
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    getCheckHistory: () => checkHistory,
    getMAX_HISTORY: () => MAX_HISTORY,
  });
  const acuDiceContest = createAcuDiceContest({
    emitEvent: (...a: any[]) => emitEvent(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getSuccessLevel: (...a: any[]) => getSuccessLevel(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    normalizeCheckSuggestionDiceFormula: (...a: any[]) => normalizeCheckSuggestionDiceFormula(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    resolveCanonicalCharacterName: (...a: any[]) => resolveCanonicalCharacterName(...a),
    NameAliasRegistry: NameAliasRegistry,
    getCachedRawData: () => cachedRawData_ACC.v,
    getMAX_HISTORY: () => MAX_HISTORY,
    getContestHistory: () => contestHistory,
  });
  const notifyReady = createNotifyReady({
    acuDiceReady: acuDiceReady,
  });

  const defineAcuDiceOnWindow = createDefineAcuDiceOnWindow({
    getAcuDiceAPI: () => AcuDiceAPI.v,
  });

  const dispatchReadyEvent = createDispatchReadyEvent({
    getACUDICE_READY_EVENT: () => ACUDICE_READY_EVENT,
  });

  // 事件系统
  const acuDiceEvents = createAcuDiceEventsInstance({
    settleGachaFortuneForDiceEvent: (...a: any[]) => settleGachaFortuneForDiceEvent(...a),
    getDiceHistoryStatsDB: () => DiceHistoryStatsDB,
  });
  type CheckHistoryEntry = AcuDice.CheckResultDraft & CheckHistoryExtension & { timestamp: number };
  type ContestHistoryEntry = AcuDice.ContestResult & { timestamp: number; detailId?: string; detailLines?: string[] };
  type AcuDiceSharedHistoryStore = {
    checkHistory: CheckHistoryEntry[];
    contestHistory: ContestHistoryEntry[];
    maxHistory: number;
  };
  type RootWindowWithAcuDiceHistory = Window & {
    __AcuDiceHistoryStore__?: AcuDiceSharedHistoryStore;
  };
  const rootWindowWithHistory = rootWindow as RootWindowWithAcuDiceHistory;
  if (!rootWindowWithHistory.__AcuDiceHistoryStore__) {
    rootWindowWithHistory.__AcuDiceHistoryStore__ = {
      checkHistory: [],
      contestHistory: [],
      maxHistory: 100,
    };
  }
  const sharedHistoryStore = createSharedHistoryStore({
    getRootWindowWithHistory: () => rootWindowWithHistory,
  });
  const checkHistory: CheckHistoryEntry[] = sharedHistoryStore.checkHistory;
  const contestHistory: ContestHistoryEntry[] = sharedHistoryStore.contestHistory;
  const acuDiceHistory = createAcuDiceHistoryInstance({
    checkHistory: (...a: any[]) => checkHistory(...a),
    contestHistory: (...a: any[]) => contestHistory(...a),
  });
  const MAX_HISTORY = sharedHistoryStore.maxHistory;

  const globalExpandedHistoryIds = new Set<string>();
  let globalHistoryFilterStatus = 'all';
  let globalHistoryKeyword = '';
  let globalHistoryStatsScope: DiceStatsScope = 'chat';

  const copyTextWithTavernApi = createCopyTextWithTavernApi({

  });

  const showGlobalDiceHistoryDialog = createShowGlobalDiceHistoryDialog({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    copyTextWithTavernApi: (...a: any[]) => copyTextWithTavernApi(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    renderDiceHistoryStatsHtml: (...a: any[]) => renderDiceHistoryStatsHtml(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    DiceHistoryStatsDB: DiceHistoryStatsDB,
    checkHistory: checkHistory,
    contestHistory: contestHistory,
    globalExpandedHistoryIds: globalExpandedHistoryIds,
    getGlobalHistoryKeyword: () => globalHistoryKeyword,
    setGlobalHistoryKeyword: (v: any) => { globalHistoryKeyword = v; },
    getGlobalHistoryFilterStatus: () => globalHistoryFilterStatus,
    setGlobalHistoryFilterStatus: (v: any) => { globalHistoryFilterStatus = v; },
    getGlobalHistoryStatsScope: () => globalHistoryStatsScope,
    setGlobalHistoryStatsScope: (v: any) => { globalHistoryStatsScope = v; },
  });

  const emitEvent = createEmitEvent({
    acuDiceEvents: acuDiceEvents,
  });

  type CheckSuggestionTieRule = 'initiator_win' | 'initiator_lose' | 'tie';
  type CheckSuggestionCriteria = 'lte' | 'gte';
  type CheckSuggestionRawParams = Record<string, string>;
  type CheckSuggestionParamValue = string | number | boolean;
  type CheckSuggestionParams = Record<string, CheckSuggestionParamValue>;
  type CheckSuggestionParsedCommand =
    | {
        kind: 'check';
        characterName: string;
        attributeName: string;
        diceType: string;
        hasExplicitDice: boolean;
        targetValue: number | null;
        criteria: CheckSuggestionCriteria;
        rawParams: CheckSuggestionRawParams;
      }
    | {
        kind: 'contest';
        leftName: string;
        leftAttribute: string;
        rightName: string;
        rightAttribute: string;
        diceType: string;
        hasExplicitDice: boolean;
        tieRule: CheckSuggestionTieRule;
        hasExplicitTieRule: boolean;
        rawParams: CheckSuggestionRawParams;
      }
    | { kind: 'fixed'; success: boolean }
    | { kind: 'none' }
    | { kind: 'invalid'; reason: string };
  return { MAX_HISTORY, acuDiceCharacters, acuDiceCheck, acuDiceContest, acuDiceEvents, acuDiceHistory, acuDicePresets, acuDiceProfiles, acuDiceReady, acuDiceRoll, buildGachaCatalogAgentPromptFilename, buildTableTemplateRequirementPresetAgentPromptFilename, checkHistory, contestHistory, createSortableList, defineAcuDiceOnWindow, dispatchReadyEvent, emitEvent, notifyReady, refreshDicePanelPresets, rootWindow, showActionPresetManager, showAddRegexRuleModal, showAdvancedPresetManager, showDashboardPresetManager, showDebugConsoleModal, showGlobalDiceHistoryDialog, showPresetListDialog, showRenderPresetManager };
}
