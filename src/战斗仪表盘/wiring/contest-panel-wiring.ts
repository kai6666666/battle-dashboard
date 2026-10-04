/**
 * wiring / contest-panel-wiring.ts — 对抗检定面板与成功等级装配簇（从 index.ts 迁出，x4-ae）。
 */
import { createGetSuccessLevel } from '../features/dice/get-success-level';
import { createShowContestPanel } from '../features/dice/show-contest-panel';
import { STORAGE_KEY_LAST_PRESET } from '../shared/storage-keys';

export function createContestPanelWiring(deps: any) {
  const { AdvancedDicePresetManager, DEFAULT_CONTEST_OUTPUT_TEMPLATE, MAX_HISTORY, NameAliasRegistry, UpdateController, addClearButton, applyAdvancedPresetOutcomePolicy, bindTutorialButtonsIn, buildCheckValueText, cachedRawData_ACC, clearPresetAttributesForCharacter, contestHistory, emitEvent, escapeHtml, evaluateCondition, evaluateConditionNumber, evaluateFormula, evaluateOutcomes, formatOutputTemplate, generateRPGAttributes, getAdvancedPresetDisplayOutcome, getAttributeEntryForCharacter, getAttributesForCharacter, getConfig, getCore, getDiceConfig, getDiceQuickSelectCharacterList, getFullAttributesForCharacter, getRandomSkillPool, getResultBadgeClass, getTableData, getTutorialButtonHtml, initCustomDropdown, processJsonData, replaceUserPlaceholders, resolveCanonicalCharacterName, resolveQuickSelectTarget, saveDiceConfig, showAdvancedPresetManager, showDicePanel, showGlobalDiceHistoryDialog, smartInsertToTextarea, writeAttributesToCharacter } = deps;
  // 判定成功等级（供对抗检定面板和 API contest() 共用）
  const getSuccessLevel = createGetSuccessLevel({

  });

  // [新增] 显示对抗检定面板
  const showContestPanel = createShowContestPanel({
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
    formatOutputTemplate: (...a: any[]) => formatOutputTemplate(...a),
    generateRPGAttributes: (...a: any[]) => generateRPGAttributes(...a),
    getAdvancedPresetDisplayOutcome: (...a: any[]) => getAdvancedPresetDisplayOutcome(...a),
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
    getAttributesForCharacter: (...a: any[]) => getAttributesForCharacter(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getDiceQuickSelectCharacterList: (...a: any[]) => getDiceQuickSelectCharacterList(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getRandomSkillPool: (...a: any[]) => getRandomSkillPool(...a),
    getResultBadgeClass: (...a: any[]) => getResultBadgeClass(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    initCustomDropdown: (...a: any[]) => initCustomDropdown(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveCanonicalCharacterName: (...a: any[]) => resolveCanonicalCharacterName(...a),
    resolveQuickSelectTarget: (...a: any[]) => resolveQuickSelectTarget(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    showAdvancedPresetManager: (...a: any[]) => showAdvancedPresetManager(...a),
    showDicePanel: (...a: any[]) => showDicePanel(...a),
    showGlobalDiceHistoryDialog: (...a: any[]) => showGlobalDiceHistoryDialog(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    writeAttributesToCharacter: (...a: any[]) => writeAttributesToCharacter(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    DEFAULT_CONTEST_OUTPUT_TEMPLATE: DEFAULT_CONTEST_OUTPUT_TEMPLATE,
    NameAliasRegistry: NameAliasRegistry,
    STORAGE_KEY_LAST_PRESET: STORAGE_KEY_LAST_PRESET,
    UpdateController: UpdateController,
    getCachedRawData: () => cachedRawData_ACC.v,
    getMAX_HISTORY: () => MAX_HISTORY.v,
    getContestHistory: () => contestHistory.v,
  });
  return { getSuccessLevel, showContestPanel };
}
