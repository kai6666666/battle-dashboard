/**
 * wiring / check-suggestion-wiring.ts — 检查建议/设置弹窗装配簇（从 index.ts 迁出，x4-g）。
 */
import { createAcuDiceAPI } from '../features/api/public-api';
import { createBuildCheckSuggestionPresetSide } from '../features/checks/build-check-suggestion-preset-side';
import { createBuildCheckSuggestionSideParams } from '../features/checks/build-check-suggestion-side-params';
import { createExecuteAdvancedCheckSuggestion } from '../features/checks/execute-advanced-check-suggestion';
import { createExecuteAdvancedContestCheckSuggestion } from '../features/checks/execute-advanced-contest-check-suggestion';
import { createExecuteCheckSuggestionCommand } from '../features/checks/execute-check-suggestion-command';
import { createExecuteContestCheckSuggestion } from '../features/checks/execute-contest-check-suggestion';
import { createExecuteNormalCheckSuggestion } from '../features/checks/execute-normal-check-suggestion';
import { createNormalizeCheckSuggestionCommandInput } from '../features/checks/normalize-check-suggestion-command-input';
import { createNormalizeCheckSuggestionParams } from '../features/checks/normalize-check-suggestion-params';
import { createParseCheckSuggestionCommand } from '../features/checks/parse-check-suggestion-command';
import { createReplaceCheckSuggestionConditionVars } from '../features/checks/replace-check-suggestion-condition-vars';
import { createResolveCheckSuggestionContestWinner } from '../features/checks/resolve-check-suggestion-contest-winner';
import { createResolveCheckSuggestionFieldValue } from '../features/checks/resolve-check-suggestion-field-value';
import { createResolveCheckSuggestionNumberParam } from '../features/checks/resolve-check-suggestion-number-param';
import { createBuildCheckSuggestionInvalidCommandMessage } from '../features/dice/build-check-suggestion-invalid-command-message';
import { createBuildCheckSuggestionMetaBlock } from '../features/dice/build-check-suggestion-meta-block';
import { createEvaluateCheckSuggestionOutcome } from '../features/dice/evaluate-check-suggestion-outcome';
import { createExecuteFixedCheckSuggestion } from '../features/dice/execute-fixed-check-suggestion';
import { createExtractCheckSuggestionDiceFormula } from '../features/dice/extract-check-suggestion-dice-formula';
import { createExtractCheckSuggestionTarget } from '../features/dice/extract-check-suggestion-target';
import { createExtractCheckSuggestionTieRule } from '../features/dice/extract-check-suggestion-tie-rule';
import { createGetCheckSuggestionDiceSides } from '../features/dice/get-check-suggestion-dice-sides';
import { createGetCheckSuggestionMappedTarget } from '../features/dice/get-check-suggestion-mapped-target';
import { createGetCheckSuggestionOutcomeResultType } from '../features/dice/get-check-suggestion-outcome-result-type';
import { createIsCheckSuggestionOutcomeSuccess } from '../features/dice/is-check-suggestion-outcome-success';
import { createNormalizeCheckSuggestionActionText } from '../features/dice/normalize-check-suggestion-action-text';
import { createNormalizeCheckSuggestionDiceFormula } from '../features/dice/normalize-check-suggestion-dice-formula';
import { createNormalizeCheckSuggestionSideShorthand } from '../features/dice/normalize-check-suggestion-side-shorthand';
import { createNormalizeLeadingCheckSuggestionSideShorthand } from '../features/dice/normalize-leading-check-suggestion-side-shorthand';
import { createParseCheckSuggestionModifierValue } from '../features/dice/parse-check-suggestion-modifier-value';
import { createParseCheckSuggestionPrimitiveValue } from '../features/dice/parse-check-suggestion-primitive-value';
import { createParseCheckSuggestionTieRule } from '../features/dice/parse-check-suggestion-tie-rule';
import { createRefreshNameAliasesForCheckSuggestion } from '../features/dice/refresh-name-aliases-for-check-suggestion';
import { createResolveCheckSuggestionCharacterName } from '../features/dice/resolve-check-suggestion-character-name';
import { createResolveCheckSuggestionDefaultValue } from '../features/dice/resolve-check-suggestion-default-value';
import { createShowFavoritesPanel } from '../features/favorites/favorites-panel';
import { createShowFavoriteEditModal } from '../features/favorites/show-favorite-edit-modal';
import { createShowNewFavoriteModal } from '../features/favorites/show-new-favorite-modal';
import { createShowSendToTableModal } from '../features/favorites/show-send-to-table-modal';
import { createShowTagInputModal } from '../features/favorites/show-tag-input-modal';
import { createGetTemplateInspectionSeverityMeta } from '../features/presets/get-template-inspection-severity-meta';
import { createNormalizeTemplateInspectText } from '../features/presets/normalize-template-inspect-text';
import { createTemplateTextIncludesAny } from '../features/presets/template-text-includes-any';
import { BUILTIN_REGEX_RULES } from '../features/regex/builtin-regex-rules';
import { createShowSettingsModal } from '../features/settings/show-settings-modal';
import { createFindTemplateRequirementSheet } from '../features/table/find-template-requirement-sheet';
import { createGetTemplateInspectionSheets } from '../features/table/get-template-inspection-sheets';
import { createInspectTableTemplate } from '../features/table/inspect-table-template';
import { createRepairCurrentTableTemplateFromPreset } from '../features/table/repair-current-table-template-from-preset';
import { createShowTableTemplateRequirementPresetEditor } from '../features/table/show-table-template-requirement-preset-editor';
import { createShowTableTemplateRequirementPresetManager } from '../features/table/show-table-template-requirement-preset-manager';
import { createShowTemplateInspectionModal } from '../features/table/show-template-inspection-modal';
import { createShowTemplateInspectionResultModal } from '../features/table/show-template-inspection-result-modal';
import { TEMPLATE_TABLE_REQUIREMENTS } from '../features/table/template-table-requirements';
import { DATA_VALIDATION_DEPRECATED_META } from '../features/validation/data-validation-deprecated-meta';
import { STORAGE_KEY_REGEX_ACTIVE_PRESET, STORAGE_KEY_REGEX_RULES } from '../shared/storage-keys';
import { RollResult } from '../shared/types';

export function createCheckSuggestionWiring(deps: any) {
  const { AdvancedDicePresetManager, DEFAULT_CONTEST_OUTPUT_TEMPLATE, DEFAULT_OUTPUT_TEMPLATE, FONTS, MAX_HISTORY, NameAliasRegistry, PresetManager, RegexPresetManager, RegexTransformationManager, THEMES, TableTemplateRequirementPresetManager, ValidationRuleManager, acuDiceCharacters, acuDiceCheck, acuDiceContest, acuDiceEvents, acuDiceHistory, acuDicePresets, acuDiceProfiles, acuDiceReady, acuDiceRoll, appendRowInstantly, applyAdvancedPresetOutcomePolicy, areAllTablesReversed, bindFavoritesEvents, bindTutorialButtonsIn, buildCheckValueText, buildNewTableTemplateRequirementPresetJsoncTemplate, buildTableTemplateRequirementPresetAgentPrompt, buildTableTemplateRequirementPresetAgentPromptFilename, cachedRawData_ACC, checkHistory, clearDiceLocalCacheData, clearModalStack, contestHistory, convertTavernRegexToRule, createSortableList, downloadAiPromptFile, downloadJsonFile, emitEvent, ensureCanonicalTableOrder, escapeHtml, evaluateCondition, evaluateConditionNumber, evaluateFormula, evaluateOutcomes, formatOutputTemplate, getAdvancedPresetDisplayOutcome, getAttributeEntryForCharacter, getAttributeValue, getCheckSuggestionPresetById, getConfig, getCore, getCurrentChatAvatarNodes, getHiddenTables, getIconForTableName, getJsonLikeErrorMessage, getNamedCheckParamText, getNavigationFontMetrics, getSavedTableOrder, getStableTableSort, getSuccessLevel, getTableData, getTableTemplateRequirementPresetStats, getTutorialButtonHtml, isRecordValue, isSettingsOpen_ACC, normalizeCollapseStyle, parseJsoncRecord, parseTableTemplateRequirementPresetJson, pickTextFile, popModal, processJsonData, pushModal, refreshDialogueIndentRender, refreshRegexRulesList, renderDeprecatedBadge, renderFavoritesPanel, renderInterface, replaceUserPlaceholders, resolveCanonicalCharacterName, resolveQuickSelectTarget, saveConfig, saveHiddenTables, saveTableOrder, scheduleDialogueIndentRender, setAllTablesReverse, setupOverlayClose, showActionPresetManager, showAddRegexRuleModal, showAddValidationRuleModal, showAttributePresetManager, showAvatarManager, showCustomTableNameIconManager, showDashboardPresetManager, showDebugConsoleModal, showDiceConfigBackupDialog, showDiceSystemConfirmDialog, showDiceSystemInputDialog, showManualUpdateDialog, showPresetConflictDialog, showPresetListDialog, showRenderPresetManager, smartInsertToTextarea, validateJsoncEditorConfig } = deps;
  const extractCheckSuggestionParams = (text: string): { rest: string; rawParams: CheckSuggestionRawParams } => {
    const rawParams: CheckSuggestionRawParams = {};
    const tokens = String(text || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const restTokens: string[] = [];
    tokens.forEach(token => {
      const match = token.match(/^([^=\s]+)=([^\s]+)$/);
      if (!match) {
        restTokens.push(token);
        return;
      }
      rawParams[match[1]] = match[2];
    });
    return {
      rest: restTokens.join(' '),
      rawParams,
    };
  };

  const normalizeCheckSuggestionDiceFormula = createNormalizeCheckSuggestionDiceFormula({

  });

  const extractCheckSuggestionDiceFormula = createExtractCheckSuggestionDiceFormula({

    normalizeCheckSuggestionDiceFormula: (...a: any[]) => normalizeCheckSuggestionDiceFormula(...a),
  });

  const extractCheckSuggestionTarget = createExtractCheckSuggestionTarget({

  });

  const parseCheckSuggestionTieRule = createParseCheckSuggestionTieRule({

  });

  const extractCheckSuggestionTieRule = createExtractCheckSuggestionTieRule({

    parseCheckSuggestionTieRule: (...a: any[]) => parseCheckSuggestionTieRule(...a),
  });

  const parseCheckSuggestionSide = (text: string): { name: string; attribute: string } | null => {
    const parts = text.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return null;
    return {
      name: parts[0],
      attribute: parts.slice(1).join(' '),
    };
  };

  const normalizeCheckSuggestionSideShorthand = createNormalizeCheckSuggestionSideShorthand({

  });

  const normalizeLeadingCheckSuggestionSideShorthand = createNormalizeLeadingCheckSuggestionSideShorthand({
    normalizeCheckSuggestionSideShorthand: (...a: any[]) => normalizeCheckSuggestionSideShorthand(...a),
  });

  const normalizeCheckSuggestionCommandInput = createNormalizeCheckSuggestionCommandInput({
    normalizeLeadingCheckSuggestionSideShorthand: (...a: any[]) => normalizeLeadingCheckSuggestionSideShorthand(...a),
  });

  const buildCheckSuggestionInvalidCommandMessage = createBuildCheckSuggestionInvalidCommandMessage({

  });

  const parseCheckSuggestionCommand = createParseCheckSuggestionCommand({
    extractCheckSuggestionDiceFormula: (...a: any[]) => extractCheckSuggestionDiceFormula(...a),
    extractCheckSuggestionParams: (...a: any[]) => extractCheckSuggestionParams(...a),
    extractCheckSuggestionTarget: (...a: any[]) => extractCheckSuggestionTarget(...a),
    extractCheckSuggestionTieRule: (...a: any[]) => extractCheckSuggestionTieRule(...a),
    normalizeCheckSuggestionCommandInput: (...a: any[]) => normalizeCheckSuggestionCommandInput(...a),
    parseCheckSuggestionSide: (...a: any[]) => parseCheckSuggestionSide(...a),
  });

  const normalizeCheckSuggestionActionText = createNormalizeCheckSuggestionActionText({

  });

  const refreshNameAliasesForCheckSuggestion = createRefreshNameAliasesForCheckSuggestion({
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getNameAliasRegistry: () => NameAliasRegistry,
  });

  const resolveCheckSuggestionCharacterName = createResolveCheckSuggestionCharacterName({
    resolveCanonicalCharacterName: (...a: any[]) => resolveCanonicalCharacterName(...a),
  });

  const getCheckSuggestionDiceSides = createGetCheckSuggestionDiceSides({

  });

  const buildCheckSuggestionMetaBlock = createBuildCheckSuggestionMetaBlock({

  });

  const parseCheckSuggestionPrimitiveValue = createParseCheckSuggestionPrimitiveValue({

  });

  const normalizeCheckSuggestionParams = createNormalizeCheckSuggestionParams({
    parseCheckSuggestionPrimitiveValue: (...a: any[]) => parseCheckSuggestionPrimitiveValue(...a),
  });

  const parseCheckSuggestionModifierValue = createParseCheckSuggestionModifierValue({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });

  const resolveCheckSuggestionDefaultValue = createResolveCheckSuggestionDefaultValue({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });

  const resolveCheckSuggestionNumberParam = createResolveCheckSuggestionNumberParam({
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    parseCheckSuggestionModifierValue: (...a: any[]) => parseCheckSuggestionModifierValue(...a),
  });

  const getCheckSuggestionMappedTarget = createGetCheckSuggestionMappedTarget({
    resolveQuickSelectTarget: (...a: any[]) => resolveQuickSelectTarget(...a),
  });

  const getCheckSuggestionOutcomeResultType = createGetCheckSuggestionOutcomeResultType({

  });

  const isCheckSuggestionOutcomeSuccess = createIsCheckSuggestionOutcomeSuccess({
    getCheckSuggestionOutcomeResultType: (...a: any[]) => getCheckSuggestionOutcomeResultType(...a),
  });

  const resolveCheckSuggestionFieldValue = createResolveCheckSuggestionFieldValue({
    parseCheckSuggestionPrimitiveValue: (...a: any[]) => parseCheckSuggestionPrimitiveValue(...a),
    resolveCheckSuggestionNumberParam: (...a: any[]) => resolveCheckSuggestionNumberParam(...a),
  });

  interface CheckSuggestionPresetSideResult {
    characterName: string;
    attributeName: string;
    attrValue: number;
    attrMod: number;
    dc: number;
    mod: number;
    skillMod: number;
    customValues: Record<string, string | number | boolean>;
    derivedValues: Record<string, number>;
    diceExpression: string;
    rollResult: RollResult;
    rollTotal: number;
    context: Record<string, string | number | boolean | RollResult>;
    outcome: OutcomeLevel;
    conditionExpr: string;
    judgeResultText: string;
    displayValue: string | number;
    outputVars: Record<string, string | number | boolean>;
  }

  const replaceCheckSuggestionConditionVars = createReplaceCheckSuggestionConditionVars({

  });

  const evaluateCheckSuggestionOutcome = createEvaluateCheckSuggestionOutcome({
    applyAdvancedPresetOutcomePolicy: (...a: any[]) => applyAdvancedPresetOutcomePolicy(...a),
    evaluateOutcomes: (...a: any[]) => evaluateOutcomes(...a),
  });

  const buildCheckSuggestionPresetSide = createBuildCheckSuggestionPresetSide({
    evaluateCheckSuggestionOutcome: (...a: any[]) => evaluateCheckSuggestionOutcome(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    evaluateConditionNumber: (...a: any[]) => evaluateConditionNumber(...a),
    getAdvancedPresetDisplayOutcome: (...a: any[]) => getAdvancedPresetDisplayOutcome(...a),
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
    getCheckSuggestionMappedTarget: (...a: any[]) => getCheckSuggestionMappedTarget(...a),
    replaceCheckSuggestionConditionVars: (...a: any[]) => replaceCheckSuggestionConditionVars(...a),
    resolveCheckSuggestionDefaultValue: (...a: any[]) => resolveCheckSuggestionDefaultValue(...a),
    resolveCheckSuggestionFieldValue: (...a: any[]) => resolveCheckSuggestionFieldValue(...a),
    resolveCheckSuggestionNumberParam: (...a: any[]) => resolveCheckSuggestionNumberParam(...a),
  });

  const buildCheckSuggestionSideParams = createBuildCheckSuggestionSideParams({

  });

  const resolveCheckSuggestionContestWinner = createResolveCheckSuggestionContestWinner({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
  });

  const executeAdvancedCheckSuggestion = createExecuteAdvancedCheckSuggestion({
    buildCheckSuggestionPresetSide: (...a: any[]) => buildCheckSuggestionPresetSide(...a),
    buildCheckValueText: (...a: any[]) => buildCheckValueText(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    formatOutputTemplate: (...a: any[]) => formatOutputTemplate(...a),
    getCheckSuggestionPresetById: (...a: any[]) => getCheckSuggestionPresetById(...a),
    getNamedCheckParamText: (...a: any[]) => getNamedCheckParamText(...a),
    isCheckSuggestionOutcomeSuccess: (...a: any[]) => isCheckSuggestionOutcomeSuccess(...a),
    normalizeCheckSuggestionParams: (...a: any[]) => normalizeCheckSuggestionParams(...a),
    refreshNameAliasesForCheckSuggestion: (...a: any[]) => refreshNameAliasesForCheckSuggestion(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveCheckSuggestionCharacterName: (...a: any[]) => resolveCheckSuggestionCharacterName(...a),
    DEFAULT_OUTPUT_TEMPLATE: DEFAULT_OUTPUT_TEMPLATE,
    MAX_HISTORY: MAX_HISTORY,
    checkHistory: checkHistory,
    smartInsertToTextarea: smartInsertToTextarea,
  });

  const executeAdvancedContestCheckSuggestion = createExecuteAdvancedContestCheckSuggestion({
    buildCheckSuggestionPresetSide: (...a: any[]) => buildCheckSuggestionPresetSide(...a),
    buildCheckSuggestionSideParams: (...a: any[]) => buildCheckSuggestionSideParams(...a),
    buildCheckValueText: (...a: any[]) => buildCheckValueText(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    formatOutputTemplate: (...a: any[]) => formatOutputTemplate(...a),
    getCheckSuggestionPresetById: (...a: any[]) => getCheckSuggestionPresetById(...a),
    getNamedCheckParamText: (...a: any[]) => getNamedCheckParamText(...a),
    normalizeCheckSuggestionParams: (...a: any[]) => normalizeCheckSuggestionParams(...a),
    refreshNameAliasesForCheckSuggestion: (...a: any[]) => refreshNameAliasesForCheckSuggestion(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveCheckSuggestionCharacterName: (...a: any[]) => resolveCheckSuggestionCharacterName(...a),
    resolveCheckSuggestionContestWinner: (...a: any[]) => resolveCheckSuggestionContestWinner(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    DEFAULT_CONTEST_OUTPUT_TEMPLATE: DEFAULT_CONTEST_OUTPUT_TEMPLATE,
    getMAX_HISTORY: () => MAX_HISTORY,
    getContestHistory: () => contestHistory,
  });

  const executeFixedCheckSuggestion = createExecuteFixedCheckSuggestion({
    buildCheckSuggestionMetaBlock: (...a: any[]) => buildCheckSuggestionMetaBlock(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
  });

  const executeNormalCheckSuggestion = createExecuteNormalCheckSuggestion({
    buildCheckSuggestionMetaBlock: (...a: any[]) => buildCheckSuggestionMetaBlock(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getCheckSuggestionDiceSides: (...a: any[]) => getCheckSuggestionDiceSides(...a),
    getSuccessLevel: (...a: any[]) => getSuccessLevel(...a),
    refreshNameAliasesForCheckSuggestion: (...a: any[]) => refreshNameAliasesForCheckSuggestion(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveCheckSuggestionCharacterName: (...a: any[]) => resolveCheckSuggestionCharacterName(...a),
    MAX_HISTORY: MAX_HISTORY,
    checkHistory: checkHistory,
    smartInsertToTextarea: smartInsertToTextarea,
  });

  const executeContestCheckSuggestion = createExecuteContestCheckSuggestion({
    buildCheckSuggestionMetaBlock: (...a: any[]) => buildCheckSuggestionMetaBlock(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getCheckSuggestionDiceSides: (...a: any[]) => getCheckSuggestionDiceSides(...a),
    getSuccessLevel: (...a: any[]) => getSuccessLevel(...a),
    refreshNameAliasesForCheckSuggestion: (...a: any[]) => refreshNameAliasesForCheckSuggestion(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveCheckSuggestionCharacterName: (...a: any[]) => resolveCheckSuggestionCharacterName(...a),
    MAX_HISTORY: MAX_HISTORY,
    contestHistory: contestHistory,
    smartInsertToTextarea: smartInsertToTextarea,
  });

  const executeCheckSuggestionCommand = createExecuteCheckSuggestionCommand({
    buildCheckSuggestionInvalidCommandMessage: (...a: any[]) => buildCheckSuggestionInvalidCommandMessage(...a),
    executeAdvancedCheckSuggestion: (...a: any[]) => executeAdvancedCheckSuggestion(...a),
    executeAdvancedContestCheckSuggestion: (...a: any[]) => executeAdvancedContestCheckSuggestion(...a),
    executeContestCheckSuggestion: (...a: any[]) => executeContestCheckSuggestion(...a),
    executeFixedCheckSuggestion: (...a: any[]) => executeFixedCheckSuggestion(...a),
    executeNormalCheckSuggestion: (...a: any[]) => executeNormalCheckSuggestion(...a),
    normalizeCheckSuggestionActionText: (...a: any[]) => normalizeCheckSuggestionActionText(...a),
    parseCheckSuggestionCommand: (...a: any[]) => parseCheckSuggestionCommand(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
  });

  /**
   * AcuDice 公共 API
   * 提供骰子投掷和检定功能给外部插件使用
   */
  const AcuDiceAPI = createAcuDiceAPI({
    acuDiceCharacters: acuDiceCharacters,
    acuDiceCheck: acuDiceCheck,
    acuDiceContest: acuDiceContest,
    acuDiceEvents: acuDiceEvents,
    acuDiceHistory: acuDiceHistory,
    acuDicePresets: acuDicePresets,
    acuDiceReady: acuDiceReady,
    acuDiceRoll: acuDiceRoll,
    acuDiceProfiles: acuDiceProfiles,
  });

  // ========================================
  // ========================================
  // 收藏夹面板 (旧弹窗版本 - 已废弃，保留用于兼容)
  // 新版本使用 renderFavoritesPanel() + bindFavoritesEvents() 面板模式
  // ========================================
  /** @deprecated 使用新的面板模式 renderFavoritesPanel() 替代 */
  const showFavoritesPanel = createShowFavoritesPanel({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showFavoriteEditModal: (...a: any[]) => showFavoriteEditModal(...a),
    showNewFavoriteModal: (...a: any[]) => showNewFavoriteModal(...a),
    showSendToTableModal: (...a: any[]) => showSendToTableModal(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // 收藏卡片编辑弹窗
  const showFavoriteEditModal = createShowFavoriteEditModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // 标签输入弹窗（替代浏览器原生 prompt）
  const showTagInputModal = createShowTagInputModal({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // 新建收藏弹窗（选择模板）
  const showNewFavoriteModal = createShowNewFavoriteModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // 发送到表格弹窗
  const showSendToTableModal = createShowSendToTableModal({
    appendRowInstantly: (...a: any[]) => appendRowInstantly(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  const LATEST_TABLE_TEMPLATE_URL = 'https://discord.com/channels/1134557553011998840/1455849435325010046';



  const normalizeTemplateInspectText = createNormalizeTemplateInspectText({

  });

  const templateTextIncludesAny = createTemplateTextIncludesAny({
    normalizeTemplateInspectText: (...a: any[]) => normalizeTemplateInspectText(...a),
  });

  const getTemplateInspectionSheets = createGetTemplateInspectionSheets({

  });

  const findTemplateRequirementSheet = createFindTemplateRequirementSheet({
    templateTextIncludesAny: (...a: any[]) => templateTextIncludesAny(...a),
  });

  const inspectTableTemplate = createInspectTableTemplate({
    findTemplateRequirementSheet: (...a: any[]) => findTemplateRequirementSheet(...a),
    templateTextIncludesAny: (...a: any[]) => templateTextIncludesAny(...a),
    TEMPLATE_TABLE_REQUIREMENTS: TEMPLATE_TABLE_REQUIREMENTS,
  });

  const getTemplateInspectionSeverityMeta = createGetTemplateInspectionSeverityMeta({

  });

  const repairCurrentTableTemplateFromPreset = createRepairCurrentTableTemplateFromPreset({
    getCore: (...a: any[]) => getCore(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showTemplateInspectionModal: (...a: any[]) => showTemplateInspectionModal(...a),
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
  });

  const showTemplateInspectionResultModal = createShowTemplateInspectionResultModal({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTemplateInspectionSeverityMeta: (...a: any[]) => getTemplateInspectionSeverityMeta(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    repairCurrentTableTemplateFromPreset: (...a: any[]) => repairCurrentTableTemplateFromPreset(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    LATEST_TABLE_TEMPLATE_URL: LATEST_TABLE_TEMPLATE_URL,
  });

  const showTemplateInspectionModal = createShowTemplateInspectionModal({
    getCore: (...a: any[]) => getCore(...a),
    showTemplateInspectionResultModal: (...a: any[]) => showTemplateInspectionResultModal(...a),
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
  });

  const showTableTemplateRequirementPresetEditor = createShowTableTemplateRequirementPresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildNewTableTemplateRequirementPresetJsoncTemplate: (...a: any[]) => buildNewTableTemplateRequirementPresetJsoncTemplate(...a),
    buildTableTemplateRequirementPresetAgentPrompt: (...a: any[]) => buildTableTemplateRequirementPresetAgentPrompt(...a),
    buildTableTemplateRequirementPresetAgentPromptFilename: (...a: any[]) => buildTableTemplateRequirementPresetAgentPromptFilename(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTableTemplateRequirementPresetStats: (...a: any[]) => getTableTemplateRequirementPresetStats(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseTableTemplateRequirementPresetJson: (...a: any[]) => parseTableTemplateRequirementPresetJson(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showTableTemplateRequirementPresetManager: (...a: any[]) => showTableTemplateRequirementPresetManager(...a),
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  const showTableTemplateRequirementPresetManager = createShowTableTemplateRequirementPresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTableTemplateRequirementPresetStats: (...a: any[]) => getTableTemplateRequirementPresetStats(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showTableTemplateRequirementPresetEditor: (...a: any[]) => showTableTemplateRequirementPresetEditor(...a),
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
  });

  const showSettingsModal = createShowSettingsModal({
    areAllTablesReversed: (...a: any[]) => areAllTablesReversed(...a),
    clearDiceLocalCacheData: (...a: any[]) => clearDiceLocalCacheData(...a),
    clearModalStack: (...a: any[]) => clearModalStack(...a),
    convertTavernRegexToRule: (...a: any[]) => convertTavernRegexToRule(...a),
    createSortableList: (...a: any[]) => createSortableList(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCurrentChatAvatarNodes: (...a: any[]) => getCurrentChatAvatarNodes(...a),
    getHiddenTables: (...a: any[]) => getHiddenTables(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getNavigationFontMetrics: (...a: any[]) => getNavigationFontMetrics(...a),
    getSavedTableOrder: (...a: any[]) => getSavedTableOrder(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    refreshDialogueIndentRender: (...a: any[]) => refreshDialogueIndentRender(...a),
    refreshRegexRulesList: (...a: any[]) => refreshRegexRulesList(...a),
    renderDeprecatedBadge: (...a: any[]) => renderDeprecatedBadge(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveConfig: (...a: any[]) => saveConfig(...a),
    saveHiddenTables: (...a: any[]) => saveHiddenTables(...a),
    saveTableOrder: (...a: any[]) => saveTableOrder(...a),
    scheduleDialogueIndentRender: (...a: any[]) => scheduleDialogueIndentRender(...a),
    setAllTablesReverse: (...a: any[]) => setAllTablesReverse(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showActionPresetManager: (...a: any[]) => showActionPresetManager(...a),
    showAddRegexRuleModal: (...a: any[]) => showAddRegexRuleModal(...a),
    showAddValidationRuleModal: (...a: any[]) => showAddValidationRuleModal(...a),
    showAttributePresetManager: (...a: any[]) => showAttributePresetManager(...a),
    showAvatarManager: (...a: any[]) => showAvatarManager(...a),
    showCustomTableNameIconManager: (...a: any[]) => showCustomTableNameIconManager(...a),
    showDashboardPresetManager: (...a: any[]) => showDashboardPresetManager(...a),
    showDebugConsoleModal: (...a: any[]) => showDebugConsoleModal(...a),
    showDiceConfigBackupDialog: (...a: any[]) => showDiceConfigBackupDialog(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showDiceSystemInputDialog: (...a: any[]) => showDiceSystemInputDialog(...a),
    showManualUpdateDialog: (...a: any[]) => showManualUpdateDialog(...a),
    showPresetConflictDialog: (...a: any[]) => showPresetConflictDialog(...a),
    showPresetListDialog: (...a: any[]) => showPresetListDialog(...a),
    showRenderPresetManager: (...a: any[]) => showRenderPresetManager(...a),
    showTableTemplateRequirementPresetManager: (...a: any[]) => showTableTemplateRequirementPresetManager(...a),
    showTemplateInspectionModal: (...a: any[]) => showTemplateInspectionModal(...a),
    BUILTIN_REGEX_RULES: BUILTIN_REGEX_RULES,
    DATA_VALIDATION_DEPRECATED_META: DATA_VALIDATION_DEPRECATED_META,
    FONTS: FONTS,
    PresetManager: PresetManager,
    RegexPresetManager: RegexPresetManager,
    RegexTransformationManager: RegexTransformationManager,
    STORAGE_KEY_REGEX_ACTIVE_PRESET: STORAGE_KEY_REGEX_ACTIVE_PRESET,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
    THEMES: THEMES,
    ValidationRuleManager: ValidationRuleManager,
    getCachedRawData: () => cachedRawData_ACC.v,
    getIsSettingsOpen: () => isSettingsOpen_ACC.v,
    setIsSettingsOpen: (v: any) => { isSettingsOpen_ACC.v = v; },
    getStableTableSort: (...a: any[]) => getStableTableSort(...a),
    ensureCanonicalTableOrder: (...a: any[]) => ensureCanonicalTableOrder(...a),
  });
  return { AcuDiceAPI, executeCheckSuggestionCommand, getTemplateInspectionSheets, normalizeCheckSuggestionDiceFormula, showFavoriteEditModal, showSendToTableModal, showSettingsModal, showTagInputModal, showTemplateInspectionModal, showTableTemplateRequirementPresetManager };
}
