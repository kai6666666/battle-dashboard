/**
 * wiring / advanced-preset-wiring.ts — 高级骰子预设/属性预设装配簇（从 index.ts 迁出，x4-d）。
 */
import { createBuildAttributeRulesContent } from '../features/dice/build-attribute-rules-content';
import { createBuildCheckSuggestionGuide } from '../features/dice/build-check-suggestion-guide';
import { createGetAttributeRangeBounds } from '../features/dice/get-attribute-range-bounds';
import { createGetAttributeRulePresetById } from '../features/dice/get-attribute-rule-preset-by-id';
import { createGetCheckSuggestionPresetById } from '../features/dice/get-check-suggestion-preset-by-id';
import { createSyncAttributeRuleTagsInTemplate } from '../features/dice/sync-attribute-rule-tags-in-template';
import { createAdvancedDicePresetManager } from '../features/presets/advanced-dice-preset-manager';
import { createApplyAdvancedPresetOutcomePolicy } from '../features/presets/apply-advanced-preset-outcome-policy';
import { createAssignAdvancedPresetContextNumber } from '../features/presets/assign-advanced-preset-context-number';
import { createBuildActionPresetAgentPrompt } from '../features/presets/build-action-preset-agent-prompt';
import { createBuildAdvancedPresetEvaluationContext } from '../features/presets/build-advanced-preset-evaluation-context';
import { createBuildAutoCheckSuggestionGuide } from '../features/presets/build-auto-check-suggestion-guide';
import { createBuildDashboardPresetAgentPrompt } from '../features/presets/build-dashboard-preset-agent-prompt';
import { createBuildGachaCatalogAgentPrompt } from '../features/presets/build-gacha-catalog-agent-prompt';
import { createBuildRenderPresetAgentPrompt } from '../features/presets/build-render-preset-agent-prompt';
import { createBuildTableTemplateRequirementPresetAgentPrompt } from '../features/presets/build-table-template-requirement-preset-agent-prompt';
import { BUILTIN_ADVANCED_PRESETS } from '../features/presets/builtin-advanced-presets';
import { BUILTIN_ATTRIBUTE_PRESETS } from '../features/presets/builtin-attribute-presets';
import { createBuiltinTableTemplateRequirementPresets } from '../features/presets/builtin-table-template-requirement-presets';
import { createCloneAdvancedPresetFieldWithDefaults } from '../features/presets/clone-advanced-preset-field-with-defaults';
import { createCoerceAdvancedPresetContextNumber } from '../features/presets/coerce-advanced-preset-context-number';
import { createCreateAdvancedPresetRollResult } from '../features/presets/create-advanced-preset-roll-result';
import { createExtractAdvancedPresetJsonCandidates } from '../features/presets/extract-advanced-preset-json-candidates';
import { createGenerateAttributeScale } from '../features/presets/generate-attribute-scale';
import { createGetAdvancedPresetDisplayOutcome } from '../features/presets/get-advanced-preset-display-outcome';
import { createGetAdvancedPresetErrorMessage } from '../features/presets/get-advanced-preset-error-message';
import { createGetRuleTagSnippet } from '../features/presets/get-rule-tag-snippet';
import { createHasAdvancedPresetFieldConfig } from '../features/presets/has-advanced-preset-field-config';
import { createIsAdvancedPresetNumericLike } from '../features/presets/is-advanced-preset-numeric-like';
import { createIsAdvancedPresetRecord } from '../features/presets/is-advanced-preset-record';
import { createNormalizeAdvancedPresetAgentTests } from '../features/presets/normalize-advanced-preset-agent-tests';
import { createNormalizeAdvancedPresetData } from '../features/presets/normalize-advanced-preset-data';
import { createNormalizeAdvancedPresetNotes } from '../features/presets/normalize-advanced-preset-notes';
import { createParseAdvancedPresetJsonCandidate } from '../features/presets/parse-advanced-preset-json-candidate';
import { createParseAdvancedPresetSourceText } from '../features/presets/parse-advanced-preset-source-text';
import { createParseAdvancedPresetText } from '../features/presets/parse-advanced-preset-text';
import { createParseTableTemplateRequirementPresetJson } from '../features/presets/parse-table-template-requirement-preset-json';
import { createPushAdvancedPresetIssue } from '../features/presets/push-advanced-preset-issue';
import { createReadAdvancedPresetContextTags } from '../features/presets/read-advanced-preset-context-tags';
import { createReadAdvancedPresetPolicyNumber } from '../features/presets/read-advanced-preset-policy-number';
import { createReplaceRuleTagInTemplate } from '../features/presets/replace-rule-tag-in-template';
import { createSyncCheckRuleTagsInTemplate } from '../features/presets/sync-check-rule-tags-in-template';
import { createTableTemplateRequirementPresetManager } from '../features/presets/table-template-requirement-preset-manager';
import { createThrowAdvancedPresetValidationIssues } from '../features/presets/throw-advanced-preset-validation-issues';
import { createUnwrapAdvancedPresetDocument } from '../features/presets/unwrap-advanced-preset-document';
import { createUpdateTemplateForActiveCheckPreset } from '../features/presets/update-template-for-active-check-preset';
import { createUpdateTemplateForActivePreset } from '../features/presets/update-template-for-active-preset';
import { createValidateAdvancedPreset } from '../features/presets/validate-advanced-preset';
import { createValidateAdvancedPresetAgentTests } from '../features/presets/validate-advanced-preset-agent-tests';
import { createValidateAdvancedPresetContestRule } from '../features/presets/validate-advanced-preset-contest-rule';
import { createValidateAdvancedPresetCustomFields } from '../features/presets/validate-advanced-preset-custom-fields';
import { createValidateAdvancedPresetDicePatches } from '../features/presets/validate-advanced-preset-dice-patches';
import { createValidateAdvancedPresetFieldConfig } from '../features/presets/validate-advanced-preset-field-config';
import { createValidateAdvancedPresetOutcomePolicy } from '../features/presets/validate-advanced-preset-outcome-policy';
import { createValidateAdvancedPresetOutcomes } from '../features/presets/validate-advanced-preset-outcomes';
import { createValidateAdvancedPresetTemplates } from '../features/presets/validate-advanced-preset-templates';
import { createBuildNewTableTemplateRequirementPresetJsoncTemplate } from '../features/table/build-new-table-template-requirement-preset-jsonc-template';
import { createIsRuleTemplateSheetWithNote } from '../features/table/is-rule-template-sheet-with-note';
import { createReplaceTag } from '../features/table/replace-tag';
import { createBuiltinTableTemplateRequirementPreset, getTemplateInspectionSheets as getRequirementInspectionSheets } from '../features/table/table-template-requirements';
import { PRESET_FORMAT_VERSION } from '../shared/constants';
import { STORAGE_KEY_ACTIVE_ADVANCED_PRESET, STORAGE_KEY_ACTIVE_ATTR_PRESET, STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET, STORAGE_KEY_ADVANCED_PRESETS, STORAGE_KEY_BUILTIN_PRESET_ORDER, STORAGE_KEY_BUILTIN_PRESET_VISIBILITY, STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS } from '../shared/storage-keys';
import defaultTableTemplateRequirementRaw from '../骰子表格SQL_v4.3.json?raw';

export function createAdvancedPresetWiring(deps: any) {
  const { ADVANCED_PRESET_AGENT_FORMAT, ADVANCED_PRESET_EXPORT_FORMAT, AttributePresetManager, compareVersion, evaluateCondition, evaluateOutcomes, generateRPGAttributes, getCore, getDiceConfigBackupPresetRecordId, isDiceConfigBackupRecord, parseJsoncRecord, parseJsoncValue } = deps;
  const isAdvancedPresetRecord = createIsAdvancedPresetRecord({

  });

  const hasAdvancedPresetFieldConfig = createHasAdvancedPresetFieldConfig({
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
  });
  const parseAdvancedPresetJsonCandidate = createParseAdvancedPresetJsonCandidate({
    parseJsoncValue: (...a: any[]) => parseJsoncValue(...a),
  });

  const extractAdvancedPresetJsonCandidates = createExtractAdvancedPresetJsonCandidates({

  });

  const parseAdvancedPresetSourceText = createParseAdvancedPresetSourceText({
    extractAdvancedPresetJsonCandidates: (...a: any[]) => extractAdvancedPresetJsonCandidates(...a),
    parseAdvancedPresetJsonCandidate: (...a: any[]) => parseAdvancedPresetJsonCandidate(...a),
  });

  const normalizeAdvancedPresetNotes = createNormalizeAdvancedPresetNotes({

  });

  const normalizeAdvancedPresetAgentTests = createNormalizeAdvancedPresetAgentTests({
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
  });

  const unwrapAdvancedPresetDocument = createUnwrapAdvancedPresetDocument({
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    normalizeAdvancedPresetNotes: (...a: any[]) => normalizeAdvancedPresetNotes(...a),
    normalizeAdvancedPresetAgentTests: (...a: any[]) => normalizeAdvancedPresetAgentTests(...a),
    getADVANCED_PRESET_AGENT_FORMAT: () => ADVANCED_PRESET_AGENT_FORMAT,
    getADVANCED_PRESET_EXPORT_FORMAT: () => ADVANCED_PRESET_EXPORT_FORMAT,
  });

  const cloneAdvancedPresetFieldWithDefaults = createCloneAdvancedPresetFieldWithDefaults({
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
  });

  const normalizeAdvancedPresetData = createNormalizeAdvancedPresetData({
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    cloneAdvancedPresetFieldWithDefaults: (...a: any[]) => cloneAdvancedPresetFieldWithDefaults(...a),
    compareVersion: (...a: any[]) => compareVersion(...a),
    getPRESET_FORMAT_VERSION: () => PRESET_FORMAT_VERSION,
    hasAdvancedPresetFieldConfig: (...a: any[]) => hasAdvancedPresetFieldConfig(...a),
  });

  const pushAdvancedPresetIssue = createPushAdvancedPresetIssue({

  });

  const validateAdvancedPresetFieldConfig = createValidateAdvancedPresetFieldConfig({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const validateAdvancedPresetCustomFields = createValidateAdvancedPresetCustomFields({
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const validateAdvancedPresetDicePatches = createValidateAdvancedPresetDicePatches({
    buildAdvancedPresetEvaluationContext: (...a: any[]) => buildAdvancedPresetEvaluationContext(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const validateAdvancedPresetContestRule = createValidateAdvancedPresetContestRule({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const coerceAdvancedPresetContextNumber = createCoerceAdvancedPresetContextNumber({

  });

  const createAdvancedPresetRollResult = createCreateAdvancedPresetRollResult({

  });

  const readAdvancedPresetContextTags = createReadAdvancedPresetContextTags({

  });

  const assignAdvancedPresetContextNumber = createAssignAdvancedPresetContextNumber({
    coerceAdvancedPresetContextNumber: (...a: any[]) => coerceAdvancedPresetContextNumber(...a),
  });

  const buildAdvancedPresetEvaluationContext = createBuildAdvancedPresetEvaluationContext({
    assignAdvancedPresetContextNumber: (...a: any[]) => assignAdvancedPresetContextNumber(...a),
    coerceAdvancedPresetContextNumber: (...a: any[]) => coerceAdvancedPresetContextNumber(...a),
    createAdvancedPresetRollResult: (...a: any[]) => createAdvancedPresetRollResult(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    readAdvancedPresetContextTags: (...a: any[]) => readAdvancedPresetContextTags(...a),
  });

  interface AdvancedPresetOutcomePolicyResult {
    outcome: OutcomeLevel;
    requiredOutcome?: OutcomeLevel;
    isUnmet: boolean;
  }

  const readAdvancedPresetPolicyNumber = createReadAdvancedPresetPolicyNumber({

  });

  const applyAdvancedPresetOutcomePolicy = createApplyAdvancedPresetOutcomePolicy({
    readAdvancedPresetPolicyNumber: (...a: any[]) => readAdvancedPresetPolicyNumber(...a),
  });

  const getAdvancedPresetDisplayOutcome = createGetAdvancedPresetDisplayOutcome({

  });

  const validateAdvancedPresetOutcomes = createValidateAdvancedPresetOutcomes({
    buildAdvancedPresetEvaluationContext: (...a: any[]) => buildAdvancedPresetEvaluationContext(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const isAdvancedPresetNumericLike = createIsAdvancedPresetNumericLike({

  });

  const validateAdvancedPresetOutcomePolicy = createValidateAdvancedPresetOutcomePolicy({
    isAdvancedPresetNumericLike: (...a: any[]) => isAdvancedPresetNumericLike(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const validateAdvancedPresetTemplates = createValidateAdvancedPresetTemplates({
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const validateAdvancedPresetAgentTests = createValidateAdvancedPresetAgentTests({
    applyAdvancedPresetOutcomePolicy: (...a: any[]) => applyAdvancedPresetOutcomePolicy(...a),
    buildAdvancedPresetEvaluationContext: (...a: any[]) => buildAdvancedPresetEvaluationContext(...a),
    evaluateOutcomes: (...a: any[]) => evaluateOutcomes(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const throwAdvancedPresetValidationIssues = createThrowAdvancedPresetValidationIssues({

  });

  const validateAdvancedPreset = createValidateAdvancedPreset({
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
    throwAdvancedPresetValidationIssues: (...a: any[]) => throwAdvancedPresetValidationIssues(...a),
    validateAdvancedPresetAgentTests: (...a: any[]) => validateAdvancedPresetAgentTests(...a),
    validateAdvancedPresetContestRule: (...a: any[]) => validateAdvancedPresetContestRule(...a),
    validateAdvancedPresetCustomFields: (...a: any[]) => validateAdvancedPresetCustomFields(...a),
    validateAdvancedPresetDicePatches: (...a: any[]) => validateAdvancedPresetDicePatches(...a),
    validateAdvancedPresetFieldConfig: (...a: any[]) => validateAdvancedPresetFieldConfig(...a),
    validateAdvancedPresetOutcomePolicy: (...a: any[]) => validateAdvancedPresetOutcomePolicy(...a),
    validateAdvancedPresetOutcomes: (...a: any[]) => validateAdvancedPresetOutcomes(...a),
    validateAdvancedPresetTemplates: (...a: any[]) => validateAdvancedPresetTemplates(...a),
  });

  const parseAdvancedPresetText = createParseAdvancedPresetText({
    normalizeAdvancedPresetData: (...a: any[]) => normalizeAdvancedPresetData(...a),
    parseAdvancedPresetSourceText: (...a: any[]) => parseAdvancedPresetSourceText(...a),
    unwrapAdvancedPresetDocument: (...a: any[]) => unwrapAdvancedPresetDocument(...a),
    validateAdvancedPreset: (...a: any[]) => validateAdvancedPreset(...a),
    ADVANCED_PRESET_AGENT_FORMAT: ADVANCED_PRESET_AGENT_FORMAT,
  });

  const getAdvancedPresetErrorMessage = createGetAdvancedPresetErrorMessage({

  });

  const buildDashboardPresetAgentPrompt = createBuildDashboardPresetAgentPrompt({

  });
  const buildActionPresetAgentPrompt = createBuildActionPresetAgentPrompt({});


  const buildRenderPresetAgentPrompt = createBuildRenderPresetAgentPrompt({

  });
  const buildTableTemplateRequirementPresetAgentPrompt = createBuildTableTemplateRequirementPresetAgentPrompt({});


  const buildGachaCatalogAgentPrompt = createBuildGachaCatalogAgentPrompt({

  });

  const BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS = createBuiltinTableTemplateRequirementPresets({
    createBuiltinTableTemplateRequirementPreset: (...a: any[]) => createBuiltinTableTemplateRequirementPreset(...a),
    getDefaultTableTemplateRequirementRaw: () => defaultTableTemplateRequirementRaw,
  });

  const getTableTemplateRequirementPresetStats = (preset): { sheetCount: number; headerCount: number } => {
    const sheets = getRequirementInspectionSheets(preset?.template || {});
    return {
      sheetCount: sheets.length,
      headerCount: sheets.reduce((total, sheet) => total + Math.max(0, sheet.headers.length - 1), 0),
    };
  };

  const parseTableTemplateRequirementPresetJson = createParseTableTemplateRequirementPresetJson({
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
  });

  const buildNewTableTemplateRequirementPresetJsoncTemplate = createBuildNewTableTemplateRequirementPresetJsoncTemplate({

  });

  const TableTemplateRequirementPresetManager = createTableTemplateRequirementPresetManager({
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    parseTableTemplateRequirementPresetJson: (...a: any[]) => parseTableTemplateRequirementPresetJson(...a),
    BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS: BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
    STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET: STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET,
    STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS: STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
  });

  // 高级骰子预设管理器
  const AdvancedDicePresetManager = createAdvancedDicePresetManager({
    compareVersion: (...a: any[]) => compareVersion(...a),
    getAdvancedPresetErrorMessage: (...a: any[]) => getAdvancedPresetErrorMessage(...a),
    parseAdvancedPresetText: (...a: any[]) => parseAdvancedPresetText(...a),
    updateTemplateForActiveCheckPreset: (...a: any[]) => updateTemplateForActiveCheckPreset(...a),
    ADVANCED_PRESET_EXPORT_FORMAT: ADVANCED_PRESET_EXPORT_FORMAT,
    BUILTIN_ADVANCED_PRESETS: BUILTIN_ADVANCED_PRESETS,
    STORAGE_KEY_ACTIVE_ADVANCED_PRESET: STORAGE_KEY_ACTIVE_ADVANCED_PRESET,
    STORAGE_KEY_ADVANCED_PRESETS: STORAGE_KEY_ADVANCED_PRESETS,
    STORAGE_KEY_BUILTIN_PRESET_ORDER: STORAGE_KEY_BUILTIN_PRESET_ORDER,
    STORAGE_KEY_BUILTIN_PRESET_VISIBILITY: STORAGE_KEY_BUILTIN_PRESET_VISIBILITY,
  });

  // ========================================
  // 预设切换时更新表格模板
  // ========================================

  /**
   * 根据数值范围动态生成属性标尺描述（包含基准说明）
   * 将范围按比例划分为6个区间：能力缺失/弱项/平均/精英/极限/破格
   * @param min 范围最小值
   * @param max 范围最大值
   * @returns 完整的属性标尺描述字符串（包含标尺和基准说明）
   */
  const generateAttributeScale = createGenerateAttributeScale({

  });

  // 默认规则的特有属性模板内容（用于恢复）

  // 默认规则的虚拟预设定义（六维属性百分制）

  /**
   * 替换标签内容的通用函数（支持多行内容）
   * @param text 原始文本
   * @param tag 标签名（中文标签如 "属性规则"）
   * @param content 新内容
   */
  const replaceTag = createReplaceTag({

  });

  const getCheckSuggestionPresetById = createGetCheckSuggestionPresetById({
    getAdvancedDicePresetManager: () => AdvancedDicePresetManager,
  });

  const buildAutoCheckSuggestionGuide = createBuildAutoCheckSuggestionGuide({
    AdvancedDicePresetManager: AdvancedDicePresetManager,
  });

  const buildCheckSuggestionGuide = createBuildCheckSuggestionGuide({
    buildAutoCheckSuggestionGuide: (...a: any[]) => buildAutoCheckSuggestionGuide(...a),
  });

  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  const getAttributeRulePresetById = createGetAttributeRulePresetById({
    getAttributePresetManager: () => AttributePresetManager,
  });

  const getAttributeRangeBounds = createGetAttributeRangeBounds({

  });

  const buildAttributeRulesContent = createBuildAttributeRulesContent({

    generateAttributeScale: (...a: any[]) => generateAttributeScale(...a),
    generateRPGAttributes: (...a: any[]) => generateRPGAttributes(...a),
    getAttributeRangeBounds: (...a: any[]) => getAttributeRangeBounds(...a),
    getAttributeRulePresetById: (...a: any[]) => getAttributeRulePresetById(...a),
  });

  const isRuleTemplateSheetWithNote = createIsRuleTemplateSheetWithNote({

  });

  const getRuleTagSnippet = createGetRuleTagSnippet({

  });

  const replaceRuleTagInTemplate = createReplaceRuleTagInTemplate({
    getRuleTagSnippet: (...a: any[]) => getRuleTagSnippet(...a),
    isRuleTemplateSheetWithNote: (...a: any[]) => isRuleTemplateSheetWithNote(...a),
    replaceTag: (...a: any[]) => replaceTag(...a),
  });

  const syncAttributeRuleTagsInTemplate = createSyncAttributeRuleTagsInTemplate({
    buildAttributeRulesContent: (...a: any[]) => buildAttributeRulesContent(...a),
    replaceRuleTagInTemplate: (...a: any[]) => replaceRuleTagInTemplate(...a),
  });

  const syncCheckRuleTagsInTemplate = createSyncCheckRuleTagsInTemplate({
    buildCheckSuggestionGuide: (...a: any[]) => buildCheckSuggestionGuide(...a),
    getCheckSuggestionPresetById: (...a: any[]) => getCheckSuggestionPresetById(...a),
    replaceRuleTagInTemplate: (...a: any[]) => replaceRuleTagInTemplate(...a),
  });

  const updateTemplateForActiveCheckPreset = createUpdateTemplateForActiveCheckPreset({
    buildCheckSuggestionGuide: (...a: any[]) => buildCheckSuggestionGuide(...a),
    getCheckSuggestionPresetById: (...a: any[]) => getCheckSuggestionPresetById(...a),
    getCore: (...a: any[]) => getCore(...a),
    replaceTag: (...a: any[]) => replaceTag(...a),
    syncAttributeRuleTagsInTemplate: (...a: any[]) => syncAttributeRuleTagsInTemplate(...a),
    STORAGE_KEY_ACTIVE_ATTR_PRESET: STORAGE_KEY_ACTIVE_ATTR_PRESET,
  });

  /**
   * 根据激活的属性预设更新表格模板中的示例和范围
   * @param presetId 预设ID，null 表示使用默认逻辑
   */
  const updateTemplateForActivePreset = createUpdateTemplateForActivePreset({
    generateAttributeScale: (...a: any[]) => generateAttributeScale(...a),
    generateRPGAttributes: (...a: any[]) => generateRPGAttributes(...a),
    getCore: (...a: any[]) => getCore(...a),
    replaceTag: (...a: any[]) => replaceTag(...a),
    syncCheckRuleTagsInTemplate: (...a: any[]) => syncCheckRuleTagsInTemplate(...a),
    AttributePresetManager: AttributePresetManager,
    BUILTIN_ATTRIBUTE_PRESETS: BUILTIN_ATTRIBUTE_PRESETS,
    STORAGE_KEY_ACTIVE_ADVANCED_PRESET: STORAGE_KEY_ACTIVE_ADVANCED_PRESET,
  });
  return { AdvancedDicePresetManager, BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS, TableTemplateRequirementPresetManager, applyAdvancedPresetOutcomePolicy, buildActionPresetAgentPrompt, buildDashboardPresetAgentPrompt, buildGachaCatalogAgentPrompt, buildNewTableTemplateRequirementPresetJsoncTemplate, buildRenderPresetAgentPrompt, buildTableTemplateRequirementPresetAgentPrompt, getAdvancedPresetDisplayOutcome, getAdvancedPresetErrorMessage, getCheckSuggestionPresetById, getTableTemplateRequirementPresetStats, parseAdvancedPresetText, parseTableTemplateRequirementPresetJson, updateTemplateForActivePreset };
}
