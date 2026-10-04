/**
 * wiring / action-engine-wiring.ts — 动作预设与运算引擎装配簇（疯狂模式/表达式/仪表盘配置，从 index.ts 迁出，x4-t）。
 */
import { createCloneDashboardConfig } from '../features/dashboard/clone-dashboard-config';
import { createCloneDashboardPresetModules } from '../features/dashboard/clone-dashboard-preset-modules';
import { createCreateDashboardPresetModulesFromConfig } from '../features/dashboard/create-dashboard-preset-modules-from-config';
import { createDashboardPresetAdditionalColumns } from '../features/dashboard/dashboard-preset-additional-columns';
import { createDashboardPresetFilterKeys } from '../features/dashboard/dashboard-preset-filter-keys';
import { createDashboardRelationshipGraphSourceModes } from '../features/dashboard/dashboard-relationship-graph-source-modes';
import { DASHBOARD_TABLE_CONFIG } from '../features/dashboard/dashboard-table-config';
import { createNormalizeDashboardKeywordArray } from '../features/dashboard/normalize-dashboard-keyword-array';
import { createNormalizeDashboardOptionalStringArray } from '../features/dashboard/normalize-dashboard-optional-string-array';
import { createNormalizeDashboardPresetFilters } from '../features/dashboard/normalize-dashboard-preset-filters';
import { createNormalizeDashboardRelationshipGraphConfig } from '../features/dashboard/normalize-dashboard-relationship-graph-config';
import { createCrazyRollWithPreset } from '../features/dice/crazy-roll-with-preset';
import { createDefaultContestOutputTemplate } from '../features/dice/default-contest-output-template';
import { createDefaultOutputTemplate } from '../features/dice/default-output-template';
import { createEvaluateCondition } from '../features/dice/evaluate-condition';
import { createEvaluateConditionNumber } from '../features/dice/evaluate-condition-number';
import { createEvaluateFormula } from '../features/dice/evaluate-formula';
import { createFormatOutputTemplate } from '../features/dice/format-output-template';
import { createGenerateAttributeValue } from '../features/dice/generate-attribute-value';
import { createGenerateCrazyRoll } from '../features/dice/generate-crazy-roll';
import { createGetCrazyModeConfig } from '../features/dice/get-crazy-mode-config';
import { createIsComplexCondition } from '../features/dice/is-complex-condition';
import { createJudgeCrazyRollResult } from '../features/dice/judge-crazy-roll-result';
import { createSaveCrazyModeConfig } from '../features/dice/save-crazy-mode-config';
import { createSelectCrazyParticipant } from '../features/dice/select-crazy-participant';
import { createSelectCrazyRollType } from '../features/dice/select-crazy-roll-type';
import { createShouldTriggerCrazyMode } from '../features/dice/should-trigger-crazy-mode';
import { createActionPresetManager } from '../features/presets/action-preset-manager';
import { BUILTIN_ACTION_PRESETS } from '../features/presets/builtin-action-presets';
import { createCreateBuiltinDashboardPreset } from '../features/presets/create-builtin-dashboard-preset';
import { createEvaluateOutcomes } from '../features/presets/evaluate-outcomes';
import { createSelectCrazyAttribute } from '../features/presets/select-crazy-attribute';
import { createIsRecordValue } from '../shared/is-record-value';
import { STORAGE_KEY_ACTION_PRESETS, STORAGE_KEY_ACTIVE_ACTION_PRESET } from '../shared/storage-keys';
import { createStripJsonComments } from '../shared/strip-json-comments';
import { createWeightedRandomSelect } from '../shared/weighted-random-select';

import type { DashboardConfigMap } from '../shared/index-local-types';

export function createActionEngineWiring(deps: any) {
  const { AdvancedDicePresetManager, AttributePresetManager, DashboardDataParser, cachedRawData_ACC, getDisplayPlayerName, getFullAttributesForCharacter, getRandomSkillPool, getTableData, parseJsoncRecord, processJsonData } = deps;
  const ActionPresetManager = createActionPresetManager({
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    BUILTIN_ACTION_PRESETS: BUILTIN_ACTION_PRESETS,
    STORAGE_KEY_ACTION_PRESETS: STORAGE_KEY_ACTION_PRESETS,
    STORAGE_KEY_ACTIVE_ACTION_PRESET: STORAGE_KEY_ACTIVE_ACTION_PRESET,
  });

  // ========================================
  // 疯狂模式系统
  // ========================================

  // 获取疯狂模式配置
  const getCrazyModeConfig = createGetCrazyModeConfig({

  });

  // 保存疯狂模式配置
  const saveCrazyModeConfig = createSaveCrazyModeConfig({

  });

  // 判断是否触发疯狂模式
  const shouldTriggerCrazyMode = createShouldTriggerCrazyMode({
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
  });

  // 选择投骰类型
  const selectCrazyRollType = createSelectCrazyRollType({

  });

  // 根据权重随机选择
  const weightedRandomSelect = createWeightedRandomSelect({

  });

  // 选择参与者
  const selectCrazyParticipant = createSelectCrazyParticipant({
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
    getDisplayPlayerName: (...a: any[]) => getDisplayPlayerName(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    weightedRandomSelect: (...a: any[]) => weightedRandomSelect(...a),
    getDashboardDataParser: () => DashboardDataParser.v,
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // 选择检定属性
  const selectCrazyAttribute = createSelectCrazyAttribute({
    getRandomSkillPool: (...a: any[]) => getRandomSkillPool(...a),
    AttributePresetManager: AttributePresetManager,
  });

  // 根据预设执行疯狂模式投骰
  const crazyRollWithPreset = createCrazyRollWithPreset({

  });

  // 判断检定结果 (保留用于无预设时的兼容)
  const judgeCrazyRollResult = createJudgeCrazyRollResult({

  });

  // 生成疯狂骰子结果
  const generateCrazyRoll = createGenerateCrazyRoll({
    crazyRollWithPreset: (...a: any[]) => crazyRollWithPreset(...a),
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
    selectCrazyAttribute: (...a: any[]) => selectCrazyAttribute(...a),
    selectCrazyParticipant: (...a: any[]) => selectCrazyParticipant(...a),
    selectCrazyRollType: (...a: any[]) => selectCrazyRollType(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
  });


  /**
   * 解析并计算公式（支持变量引用）
   * @param formula 公式字符串，如 "力量/2+1d10" 或 "3d6*5"
   * @param context 变量上下文，如 { 力量: 50, 敏捷: 40 }
   * @returns 计算结果（整数）
   */
  const evaluateFormula = createEvaluateFormula({

  });

  /**
   * 评估条件表达式（支持比较运算和逻辑运算）
   * @param {string} formula 表达式字符串
   * @param {Record<string, number>} context 变量上下文
   * @returns {{success: boolean, value?: number | boolean, error?: string}}
   */
  const evaluateCondition = createEvaluateCondition({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });

  const evaluateConditionNumber = createEvaluateConditionNumber({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
  });

  /**
   * 判断条件表达式是否为复杂条件 (包含 && 或 ||)
   * @param expr - 条件表达式字符串
   * @returns 如果包含 && 或 || 返回 true, 否则返回 false
   */
  const isComplexCondition = createIsComplexCondition({

  });

  /**
   * 评估多级结果
   * @param outcomes - outcomes 数组 (会被排序)
   * @param context - 上下文对象 {$roll, $attr, $dc, $mod, ...}
   * @returns 匹配的 outcome (如果所有条件都不满足,返回最低优先级的兜底 outcome)
   */
  const evaluateOutcomes = createEvaluateOutcomes({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
  });

  // 默认输出模板
  const DEFAULT_OUTPUT_TEMPLATE = createDefaultOutputTemplate({

  });

  // 默认对抗检定输出模板
  const DEFAULT_CONTEST_OUTPUT_TEMPLATE = createDefaultContestOutputTemplate({

  });

  /**
   * 格式化输出模板
   * @param template - 模板字符串
   * @param context - 变量上下文
   * @returns 格式化后的文本
   */
  const formatOutputTemplate = createFormatOutputTemplate({

  });

  /**
   * 生成单个属性值，应用范围限制
   * @param formula 公式字符串
   * @param range 可选范围 [min, max]
   * @param context 变量上下文
   * @returns 属性值
   */
  const generateAttributeValue = createGenerateAttributeValue({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });

  // ========================================
  // 仪表盘统一配置中心
  // ========================================
  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  const DASHBOARD_PRESET_FORMAT = 'acu_dashboard_preset_v1';
  const DASHBOARD_DEFAULT_PRESET_ID = '__builtin_dashboard_default__';
  const DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY = 'relationshipGraph';
  const DASHBOARD_PRESET_MODULE_KEYS = ['global', 'player', 'location', 'npc', 'quest', 'bag', 'equip'] as const;
  const DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES = createDashboardRelationshipGraphSourceModes({

  });
  const DASHBOARD_PRESET_FILTER_KEYS = createDashboardPresetFilterKeys({

  });
  const DASHBOARD_PRESET_ADDITIONAL_COLUMNS = createDashboardPresetAdditionalColumns({

  });



  let dashboardRuntimeConfigCache: DashboardConfigMap | null = null;

  const cloneDashboardConfig = createCloneDashboardConfig({

  });

  const createDashboardPresetModulesFromConfig = createCreateDashboardPresetModulesFromConfig({
    DASHBOARD_PRESET_FILTER_KEYS: DASHBOARD_PRESET_FILTER_KEYS,
    DASHBOARD_PRESET_MODULE_KEYS: DASHBOARD_PRESET_MODULE_KEYS,
  });

  const cloneDashboardPresetModules = createCloneDashboardPresetModules({

  });

  const createBuiltinDashboardPreset = createCreateBuiltinDashboardPreset({
    createDashboardPresetModulesFromConfig: (...a: any[]) => createDashboardPresetModulesFromConfig(...a),
    getDASHBOARD_DEFAULT_PRESET_ID: () => DASHBOARD_DEFAULT_PRESET_ID,
    getDASHBOARD_PRESET_FORMAT: () => DASHBOARD_PRESET_FORMAT,
  });

  const isRecordValue = createIsRecordValue({

  });

  const normalizeDashboardKeywordArray = createNormalizeDashboardKeywordArray({

  });

  const normalizeDashboardOptionalStringArray = createNormalizeDashboardOptionalStringArray({

  });

  const normalizeDashboardPresetFilters = createNormalizeDashboardPresetFilters({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeDashboardOptionalStringArray: (...a: any[]) => normalizeDashboardOptionalStringArray(...a),
    DASHBOARD_PRESET_FILTER_KEYS: DASHBOARD_PRESET_FILTER_KEYS,
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
  });

  const normalizeDashboardRelationshipGraphConfig = createNormalizeDashboardRelationshipGraphConfig({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeDashboardKeywordArray: (...a: any[]) => normalizeDashboardKeywordArray(...a),
    DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES: DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES,
  });

  const stripJsonComments = createStripJsonComments({

  });

  const JSONC_FILE_ACCEPT = '.json,.jsonc,application/json,application/jsonc';
  const JSON_FILE_MIME = 'application/json;charset=utf-8';
  const JSONC_FILE_MIME = 'application/jsonc;charset=utf-8';
  const MARKDOWN_FILE_MIME = 'text/markdown;charset=utf-8';

  interface TextFileSelection {
    file: File;
    text: string;
  }

  interface DownloadTextFileOptions {
    content: string;
    filename: string;
    mimeType: string;
  }

  interface JsoncEditorValidationOptions<T> {
    text: string;
    emptyMessage?: string;
    parse: (text: string) => T;
    successMessage: (parsed: T) => string;
    errorMessage?: (error: unknown) => string;
    logLabel: string;
  }

  interface JsoncDocumentParseOptions<T> {
    text: string;
    emptyMessage?: string;
    invalidJsonMessage?: string;
    validate: (value: unknown) => T;
  }
  const dashboardRuntimeConfigCache_ACC = { get v(){ return dashboardRuntimeConfigCache; }, set v(x){ dashboardRuntimeConfigCache = x; } };
  return { ActionPresetManager, DASHBOARD_DEFAULT_PRESET_ID, DASHBOARD_PRESET_ADDITIONAL_COLUMNS, DASHBOARD_PRESET_FILTER_KEYS, DASHBOARD_PRESET_FORMAT, DASHBOARD_PRESET_MODULE_KEYS, DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY, DEFAULT_CONTEST_OUTPUT_TEMPLATE, DEFAULT_OUTPUT_TEMPLATE, JSONC_FILE_ACCEPT, JSONC_FILE_MIME, JSON_FILE_MIME, MARKDOWN_FILE_MIME, cloneDashboardConfig, cloneDashboardPresetModules, createBuiltinDashboardPreset, evaluateCondition, evaluateConditionNumber, evaluateFormula, evaluateOutcomes, formatOutputTemplate, generateAttributeValue, generateCrazyRoll, getCrazyModeConfig, isComplexCondition, isRecordValue, normalizeDashboardKeywordArray, normalizeDashboardPresetFilters, normalizeDashboardRelationshipGraphConfig, saveCrazyModeConfig, shouldTriggerCrazyMode, stripJsonComments, dashboardRuntimeConfigCache_ACC };
}
