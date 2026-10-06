/**
 * wiring / table-icon-tools-wiring.ts — 表格图标与工具装配簇（从 index.ts 迁出，x4-s）。
 */
import { createApplyAsyncImageUrlToElement } from '../features/avatar/apply-async-image-url-to-element';
import { createResolveUserGraphName } from '../features/avatars/resolve-user-graph-name';
import { createApplyAttributeQuickSelectDefaults } from '../features/dice/apply-attribute-quick-select-defaults';
import { createCloneQuickSelectNameMapping } from '../features/dice/clone-quick-select-name-mapping';
import { createFindAttributeColumnIndices } from '../features/dice/find-attribute-column-indices';
import { createFindCharacterAttributeRow } from '../features/dice/find-character-attribute-row';
import { createGetElementEmoji } from '../features/dice/get-element-emoji';
import { createIsAttributeQuickSelectTarget } from '../features/dice/is-attribute-quick-select-target';
import { createNormalizeAttributeQuickSelectConfig } from '../features/dice/normalize-attribute-quick-select-config';
import { createPickFallbackAttributeColumn } from '../features/dice/pick-fallback-attribute-column';
import { createSaveDiceConfig } from '../features/dice/save-dice-config';
import { createGetGachaItemCustomTableNameIconContext } from '../features/gacha/get-gacha-item-custom-table-name-icon-context';
import { createRenderGachaItemIconContent } from '../features/gacha/render-gacha-item-icon-content';
import { createCreateGlobalInteractionCustomTableNameIconContext } from '../features/interactions/create-global-interaction-custom-table-name-icon-context';
import { createMvuModule } from '../features/mvu/mvu-module';
import { createAttributePresetManager } from '../features/presets/attribute-preset-manager';
import { BUILTIN_ATTRIBUTE_PRESETS } from '../features/presets/builtin-attribute-presets';
import { createCreateCustomTableNameIconContext } from '../features/table/create-custom-table-name-icon-context';
import { createGetEmojiCandidates } from '../features/table/get-emoji-candidates';
import { createGetLocationEmoji } from '../features/table/get-location-emoji';
import { createHydrateCustomTableNameIconsIn } from '../features/table/hydrate-custom-table-name-icons-in';
import { createIsNpcLikeTableName } from '../features/table/is-npc-like-table-name';
import { createIsPlayerTableName } from '../features/table/is-player-table-name';
import { createRenderCustomTableNameIconContent } from '../features/table/render-custom-table-name-icon-content';
import { createResolveBatchLocationEmojis } from '../features/table/resolve-batch-location-emojis';
import { createHideDiceResultsInUserMessages } from '../features/textarea/hide-dice-results';
import { createRefreshDialogueIndentRender } from '../features/ui/refresh-dialogue-indent-render';
import { createRenderAsyncImageIconSlotContent } from '../features/ui/render-async-image-icon-slot-content';
import { createRenderIcon } from '../features/ui/render-icon';
import { createRenderThemeIconContent } from '../features/ui/render-theme-icon-content';
import { createScheduleDialogueIndentRender } from '../features/ui/schedule-dialogue-indent-render';
import { createConvertTavernRegexToRule } from '../shared/convert-tavern-regex-to-rule';
import { STORAGE_KEY_ACTIVE_ATTR_PRESET, STORAGE_KEY_ATTRIBUTE_PRESETS } from '../shared/storage-keys';

import type { AdvancedDicePreset } from '../shared/advanced-preset-types';

export function createTableIconToolsWiring(deps: any) {
  const { AvatarManager, DICE_RESULT_PLACEHOLDER, NameAliasRegistry, RenderPresetManager, USER_NODE_KEY, USER_PLACEHOLDER_KEYS, cachedRawData_ACC, canWriteMvuPanel, characterNamesMatch, clearTextareaDiceCache, compareVersion, createMetaCheckResultRegex, dialogueIndentRenderer, escapeHtml, getActiveTabState, getConfig, getDiceConfig, getGachaRewardParseResult, getGachaRewardTargetOptions, getGachaRewardTargetTableLabel, getPanelDragStartHeight, getPersonaName, getPlayerName, getTableData, getTableHeights, getTutorialButtonHtml, isCustomTableNameIconImageUrlValid, isNumericCell, isRenderableImageUrlValid, isUserCharacterName, isUserPlaceholderKey, normalizeGachaTargetTable, parseJsoncRecord, readTextareaVisibleValue, renderInterface, resetPanelRequestedHeight, resolveCustomTableNameIcon, resolveDashboardCustomTableNameIconContextInfo, resolveGlobalInteractionSectionMeta, saveActiveTabState, savePanelRequestedHeight, saveTableHeights, setPanelRequestedHeight, setTextareaValueAndNotify, setupOverlayClose, showDicePanel, storeTextareaDiceCache, syncTextareaDiceCacheFromVisibleText, updateTemplateForActivePreset } = deps;
  const convertTavernRegexToRule = createConvertTavernRegexToRule({

  });


  // ========================================
  // ValidationRuleManager - 数据验证规则系统
  // ========================================


 // 数据验证模式（只显示验证错误）

  // 规则类型信息（用于 UI 显示和分组）

  // 内置验证规则定义








  const scheduleDialogueIndentRender = createScheduleDialogueIndentRender({
    getDialogueIndentRenderer: () => dialogueIndentRenderer,
  });
  const refreshDialogueIndentRender = createRefreshDialogueIndentRender({
    getDialogueIndentRenderer: () => dialogueIndentRenderer,
  });

  const isPlayerTableName = createIsPlayerTableName({

  });

  const isNpcLikeTableName = createIsNpcLikeTableName({

  });

  const findAttributeColumnIndices = createFindAttributeColumnIndices({

  });

  const pickFallbackAttributeColumn = createPickFallbackAttributeColumn({

  });

  const findPrimaryAttributeColumns = (headers: unknown[]): { baseColIndex: number; specialColIndex: number } => {
    let baseColIndex = -1;
    let specialColIndex = -1;

    headers.forEach((header, idx) => {
      const text = String(header || '');
      if (text.includes('基础属性')) {
        baseColIndex = idx;
      } else if (text.includes('特有属性') || text.includes('特别属性')) {
        specialColIndex = idx;
      }
    });

    if (baseColIndex < 0) {
      const genericCol = findAttributeColumnIndices(headers).find(col => {
        const text = String(headers[col] || '');
        return !text.includes('特有') && !text.includes('特别');
      });
      baseColIndex = genericCol ?? -1;
    }

    return { baseColIndex, specialColIndex };
  };

  const findCharacterAttributeRow = createFindCharacterAttributeRow({
    characterNamesMatch: (...a: any[]) => characterNamesMatch(...a),
    findAttributeColumnIndices: (...a: any[]) => findAttributeColumnIndices(...a),
    isNpcLikeTableName: (...a: any[]) => isNpcLikeTableName(...a),
    isPlayerTableName: (...a: any[]) => isPlayerTableName(...a),
    isUserCharacterName: (...a: any[]) => isUserCharacterName(...a),
  });

  const resolveUserGraphName = createResolveUserGraphName({
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getPersonaName: (...a: any[]) => getPersonaName(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
    isUserCharacterName: (...a: any[]) => isUserCharacterName(...a),
    isUserPlaceholderKey: (...a: any[]) => isUserPlaceholderKey(...a),
    AvatarManager: AvatarManager,
    NameAliasRegistry: NameAliasRegistry,
    USER_NODE_KEY: USER_NODE_KEY,
    USER_PLACEHOLDER_KEYS: USER_PLACEHOLDER_KEYS,
  });

  // 渲染图标：支持 fa:xxx 简写格式和原生emoji
  const renderIcon = createRenderIcon({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const getLocationEmoji = createGetLocationEmoji({

  });

  // 获取地点名的所有候选emoji（用于去重分配）
  const getEmojiCandidates = createGetEmojiCandidates({

  });

  // 批量分配emoji，实现去重（最短名称优先）
  const resolveBatchLocationEmojis = createResolveBatchLocationEmojis({
    getEmojiCandidates: (...a: any[]) => getEmojiCandidates(...a),
  });

  const getElementEmoji = createGetElementEmoji({

  });

  const renderThemeIconContent = createRenderThemeIconContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const createCustomTableNameIconContext = createCreateCustomTableNameIconContext({

  });

  const createGlobalInteractionCustomTableNameIconContext = createCreateGlobalInteractionCustomTableNameIconContext({
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    resolveDashboardCustomTableNameIconContextInfo: (...a: any[]) => resolveDashboardCustomTableNameIconContextInfo(...a),
    resolveGlobalInteractionSectionMeta: (...a: any[]) => resolveGlobalInteractionSectionMeta(...a),
  });

  const renderAsyncImageIconSlotContent = createRenderAsyncImageIconSlotContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const renderCustomTableNameIconContent = createRenderCustomTableNameIconContent({
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
    renderAsyncImageIconSlotContent: (...a: any[]) => renderAsyncImageIconSlotContent(...a),
    resolveCustomTableNameIcon: (...a: any[]) => resolveCustomTableNameIcon(...a),
  });

  const getGachaItemCustomTableNameIconContext = createGetGachaItemCustomTableNameIconContext({
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    getGachaRewardParseResult: (...a: any[]) => getGachaRewardParseResult(...a),
    getGachaRewardTargetOptions: (...a: any[]) => getGachaRewardTargetOptions(...a),
    getGachaRewardTargetTableLabel: (...a: any[]) => getGachaRewardTargetTableLabel(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  const renderGachaItemIconContent = createRenderGachaItemIconContent({
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderThemeIconContent: (...a: any[]) => renderThemeIconContent(...a),
  });

  const applyAsyncImageUrlToElement = createApplyAsyncImageUrlToElement({
    isRenderableImageUrlValid: (...a: any[]) => isRenderableImageUrlValid(...a),
  });

  const hydrateCustomTableNameIconsIn = createHydrateCustomTableNameIconsIn({
    applyAsyncImageUrlToElement: (...a: any[]) => applyAsyncImageUrlToElement(...a),
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
  });

  // ========================================
  // MVU 变量可视化模块 v2.0
  // 独立模块 - 卡片分组式 UI
  // ========================================
  const MvuModule = createMvuModule({
    canWriteMvuPanel: (...a: any[]) => canWriteMvuPanel(...a),
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getTableHeights: (...a: any[]) => getTableHeights(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    isNumericCell: (...a: any[]) => isNumericCell(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    saveTableHeights: (...a: any[]) => saveTableHeights(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDicePanel: (...a: any[]) => showDicePanel(...a),
    RenderPresetManager: RenderPresetManager,
  });
  // MVU 变量可视化模块结束
  const saveDiceConfig = createSaveDiceConfig({
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
  });

  // [新增] 隐藏用户消息中的投骰结果（也处理输入栏）
  const hideDiceResultsInUserMessages = createHideDiceResultsInUserMessages({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    createMetaCheckResultRegex: (...a: any[]) => createMetaCheckResultRegex(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    storeTextareaDiceCache: (...a: any[]) => storeTextareaDiceCache(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });

  // ========================================
  // 高级骰子预设系统
  // ========================================

  // [x4-a] 高级骰子预设系统类型已迁出：见 ./shared/advanced-preset-types.ts
  const isAttributeQuickSelectTarget = createIsAttributeQuickSelectTarget({

  });

  const cloneQuickSelectNameMapping = createCloneQuickSelectNameMapping({

  });

  const normalizeAttributeQuickSelectConfig = createNormalizeAttributeQuickSelectConfig({
    cloneQuickSelectNameMapping: (...a: any[]) => cloneQuickSelectNameMapping(...a),
    isAttributeQuickSelectTarget: (...a: any[]) => isAttributeQuickSelectTarget(...a),
  });

  const applyAttributeQuickSelectDefaults = createApplyAttributeQuickSelectDefaults({
    normalizeAttributeQuickSelectConfig: (...a: any[]) => normalizeAttributeQuickSelectConfig(...a),
  });

  // 内置属性规则预设


  // 属性预设管理器
  const AttributePresetManager = createAttributePresetManager({
    applyAttributeQuickSelectDefaults: (...a: any[]) => applyAttributeQuickSelectDefaults(...a),
    compareVersion: (...a: any[]) => compareVersion(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    updateTemplateForActivePreset: (...a: any[]) => updateTemplateForActivePreset(...a),
    BUILTIN_ATTRIBUTE_PRESETS: BUILTIN_ATTRIBUTE_PRESETS,
    STORAGE_KEY_ACTIVE_ATTR_PRESET: STORAGE_KEY_ACTIVE_ATTR_PRESET,
    STORAGE_KEY_ATTRIBUTE_PRESETS: STORAGE_KEY_ATTRIBUTE_PRESETS,
  });

  // ========================================
  // 高级骰子预设管理器
  // ========================================


  const ADVANCED_PRESET_EXPORT_FORMAT = 'acu_advanced_preset_v1';
  const ADVANCED_PRESET_AGENT_FORMAT = 'acu_advanced_preset_agent_v1';

  interface AdvancedPresetAgentTestCase {
    name?: string;
    context?: Record<string, unknown>;
    expectedOutcomeId?: string;
    expectedOutcomeName?: string;
  }

  interface AdvancedPresetAgentDocument {
    format: typeof ADVANCED_PRESET_AGENT_FORMAT;
    preset: Record<string, unknown>;
    tests?: AdvancedPresetAgentTestCase[];
    notes?: string | string[];
  }

  interface AdvancedPresetValidationIssue {
    path: string;
    message: string;
  }

  interface AdvancedPresetParseResult {
    preset: AdvancedDicePreset;
    tests: AdvancedPresetAgentTestCase[];
    notes: string[];
    sourceFormat: string;
    importedVersion: string;
    needsUpdate: boolean;
    warnings: AdvancedPresetValidationIssue[];
  }
  return { ADVANCED_PRESET_AGENT_FORMAT, ADVANCED_PRESET_EXPORT_FORMAT, AttributePresetManager, MvuModule, convertTavernRegexToRule, createCustomTableNameIconContext, createGlobalInteractionCustomTableNameIconContext, findAttributeColumnIndices, findCharacterAttributeRow, findPrimaryAttributeColumns, getElementEmoji, getGachaItemCustomTableNameIconContext, getLocationEmoji, hideDiceResultsInUserMessages, hydrateCustomTableNameIconsIn, isAttributeQuickSelectTarget, isNpcLikeTableName, isPlayerTableName, normalizeAttributeQuickSelectConfig, pickFallbackAttributeColumn, refreshDialogueIndentRender, renderCustomTableNameIconContent, renderGachaItemIconContent, renderIcon, renderThemeIconContent, resolveBatchLocationEmojis, resolveUserGraphName, saveDiceConfig, scheduleDialogueIndentRender };
}
