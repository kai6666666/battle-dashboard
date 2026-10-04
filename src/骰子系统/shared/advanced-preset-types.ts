// 高级骰子预设系统类型（从 index.ts 迁出，x4-a）
import type { CustomFieldConfig, DerivedVarSpec, DiceExprPatch, OutcomePolicy } from './types';

export interface OutcomeLevel {
    id: string; // 唯一标识
    name: string; // 显示名称 (如 "大成功")
    condition: string; // 判定表达式 (使用 evaluateCondition 评估)
    priority: number; // 优先级 (数字越小越优先)
    contestRank?: number; // 对抗等级 (可选)
    outputText?: string; // 输出文本模板 (可选)
    displayExpr?: string; // 显示用的算式表达式 (可选,不填则用 condition)
    style?: {
      color?: string;
    };
    /** 触发的效果列表 */
    effects?: Effect[];
  }

  /** 对抗规则配置 */
  export interface ContestRule {
    /** 是否禁用对抗检定（如 PbtA 等规则不支持对抗检定） */
    disabled?: boolean;
    mode?: 'rank' | 'value' | 'margin' | 'custom'; // 对抗模式
    tieBreakers?: string[]; // 链式平局处理规则
    tieBreaker?: string; // 旧版单一平局处理(兼容)
    customExpr?: string; // 自定义表达式 (mode='custom' 时使用)
    hideDc?: boolean; // 对抗检定时隐藏DC字段
    hideMod?: boolean; // 对抗检定时隐藏修正值字段
    hideSkillMod?: boolean; // 对抗检定时隐藏技能加值字段
  }

  /** 后果系统：效果定义 */
  export interface Effect {
    /** 唯一标识 */
    id: string;
    /** 目标属性名 */
    target: string;
    /** 操作类型 */
    operation: 'add' | 'subtract' | 'set';
    /** 变更值 (支持骰子表达式) */
    value: string;
    /** 执行条件表达式 (可选) */
    condition?: string;
    /** 属性不存在时的初始值 (可选) */
    initValue?: number;
    /** 最小值限制 (可选) */
    min?: number;
    /** 最大值限制 (可选) */
    max?: number;
    /** 自定义输出文本 (可选) */
    outputText?: string;
    /** 是否需要用户确认后才执行，默认 true (可选) */
    needsConfirm?: boolean;
    /** 确认输入框的标签文本，如 "成功时扣除" (可选) */
    label?: string;
    /** 确认输入框的占位符文本 (可选) */
    inputPlaceholder?: string;
  }

  /** 后果系统：全局配置 */
  export interface EffectsConfig {
    /** 触发模式 (用于识别哪些检定可能触发效果) */
    triggerPatterns: string[];
    /** 允许修改的目标属性 */
    allowedTargets: string[];
    /** 按结果等级分组的效果列表 (可选) */
    outcomes?: {
      [outcomeName: string]: Effect[];
    };
    /** 各结果等级的默认值 (可选) */
    defaultValues?: {
      [outcomeName: string]: string;
    };
  }

  /** 后果系统：资源消耗 (Lucky Burner 等) */
  export interface ResourceBurner {
    /** 唯一标识 */
    id: string;
    /** 资源属性名 */
    resourceName: string;
    /** 显示/可用条件 (表达式，如 "$roll > $attr" 仅失败时显示) */
    condition?: string;
    /** 影响目标: roll=修改投骰结果, mod=修改修正值, dc=修改难度, attribute=修改属性值 */
    target: 'roll' | 'mod' | 'dc' | 'attribute';
    /** 转换比例 (如 1点资源 = 1点投骰结果) */
    ratio: number;
    /** 影响方向 (increase=增加目标值, decrease=减少目标值) */
    direction: 'increase' | 'decrease';
    /** 资源操作方向: subtract=消耗/减少资源(默认), add=增加/累积资源 */
    resourceOperation?: 'subtract' | 'add';
    /** 建议消耗量表达式 (如 "$roll.total - $attr"，计算"刚好通过"需消耗的资源量) */
    suggestedAmount?: string;
    /** 适用范围选择器 (用于过滤哪些检定可以使用此消耗器) */
    selector?: CheckSelector;
    /** UI 显示配置 */
    ui?: {
      icon?: string;
      color?: string;
      tooltip?: string;
    };
  }

  export interface QuickActionBase {
    /** 唯一标识 */
    id: string;
    /** 图标 (fa- 前缀) */
    icon?: string;
    /** 按钮提示 */
    tooltip?: string;
    /** 显示条件（基于当前面板上下文） */
    condition?: string;
  }

  export interface WorkflowQuickAction extends QuickActionBase {
    kind: 'workflow_shortcut';
    config: {
      /** 目标预设ID */
      presetId: string;
      /** 切换时是否沿用当前输入 */
      carryInitiator?: boolean;
      carryAttrName?: boolean;
      carryAttrValue?: boolean;
      carryTarget?: boolean;
      carryModifier?: boolean;
      carrySkillMod?: boolean;
      /** 未沿用属性名时可指定默认属性名 */
      attrName?: string;
      /** 切换后自定义字段默认值 */
      customFieldValues?: Record<string, string | number | boolean>;
    };
  }

  export interface AttrShortcutQuickAction extends QuickActionBase {
    kind: 'attr_shortcut';
    config: {
      /** 切换到目标预设（通常是常规检定预设） */
      presetId: string;
      /** 候选属性名（按顺序匹配角色现有属性） */
      attrAliasCandidates: string[];
      /** 未匹配到时的回退属性名 */
      fallbackAttrName?: string;
      /** 是否沿用当前发起者 */
      carryInitiator?: boolean;
      /** 是否沿用当前属性值 */
      carryAttrValue?: boolean;
      /** 是否沿用目标值 */
      carryTarget?: boolean;
      /** 是否沿用修正值 */
      carryModifier?: boolean;
      /** 是否沿用技能加值 */
      carrySkillMod?: boolean;
    };
  }

  export type PresetQuickAction = WorkflowQuickAction | AttrShortcutQuickAction;

  export interface CurrentAttrAutoUpdate {
    /** 是否启用 */
    enabled?: boolean;
    /** 触发时机 */
    when?: 'success' | 'failure' | 'always';
    /** 属性操作 */
    operation: 'add' | 'subtract' | 'set';
    /** 变化值表达式，支持变量 */
    valueExpr: string;
    /** 属性不存在时初始值 */
    initValue?: number;
    /** 最小值 */
    min?: number;
    /** 最大值 */
    max?: number;
    /** 属性别名候选 */
    aliasCandidates?: string[];
    /** 变化标签（如：成长/增加/减少） */
    changeLabel?: string;
    /** 已填表输出模板（可选）。可用变量：$attr, $attrPlain, $old, $new, $delta, $expr, $rolled, $operation, $changeLabel */
    outputTextTemplate?: string;
  }

  /** 检定范围选择器 (用于 Effects 和 ResourceBurner 的过滤) */
  export interface CheckSelector {
    /** 属性名模式匹配 */
    namePatterns?: {
      /** 包含模式，默认 ['*'] 匹配所有 */
      include?: string[];
      /** 排除模式，优先于 include，默认 [] 无排除 */
      exclude?: string[];
    };
    /** 标签匹配 (用于非名称类例外，如 damage/pushed/luck) */
    tags?: {
      /** 包含标签 */
      include?: string[];
      /** 排除标签 */
      exclude?: string[];
    };
  }

  /** 后果系统：执行结果 */
  export interface EffectResult {
    /** 效果 ID */
    effectId: string;
    /** 是否执行成功 */
    success: boolean;
    /** 变更前的值 */
    oldValue: number;
    /** 变更后的值 */
    newValue: number;
    /** 错误信息 */
    error?: string;
    /** 目标属性名 */
    target?: string;
    /** 效果链层级（1=一级效果） */
    level?: number;
    /** 触发来源（二级效果ID等） */
    triggerSourceId?: string;
    /** 触发阈值（若有） */
    triggerThreshold?: number;
    /** 触发类型（threshold/delta/primary） */
    triggerType?: 'threshold' | 'delta' | 'primary';
    /** 命中序号（all 模式下可用于追踪） */
    triggerMatchIndex?: number;
    /** 命中总数（all 模式下可用于追踪） */
    triggerMatchCount?: number;
    /** 信息输出文本（由 secondaryEffect.outputText 渲染，非数值变更） */
    outputMessage?: string;
    /** 执行来源分支标识（用于UI和提示词追踪） */
    branchLabel?: string;
    /** 计算公式文本（如 4d4 / 1d6 / 3） */
    formulaText?: string;
    /** 公式掷值（有掷骰时） */
    rolledValue?: number;
  }

  /**
   * 计算后的效果 (用于确认弹窗)
   */
  export interface ComputedEffect {
    /** 关联效果ID */
    effectId: string;
    /** 目标属性名 */
    target: string;
    /** 解析后的目标属性名（若有） */
    resolvedTarget?: string;
    /** 计算后的变化值 */
    computedValue: number;
    /** 骰子或数字求值后的绝对值 */
    rolledValue: number;
    /** 原始公式 */
    formula: string;
    /** 展开文本,如 "1d6 → 3" */
    displayText: string;
    /** 执行前数值（若可读取） */
    beforeValue?: number | null;
    /** 执行后数值（若可预测） */
    afterValue?: number | null;
    /** 效果条件原始表达式（为空表示命中分支即执行） */
    conditionExpr?: string;
    /** 效果条件替换变量后的展示文本 */
    resolvedConditionExpr?: string;
    /** 效果条件是否成立 */
    conditionPassed?: boolean;
    /** 效果条件的自然语言说明 */
    conditionSummary?: string;
  }

  export interface EffectConfirmUiConfig {
    /** 确认弹窗标题 */
    title?: string;
    /** 效果列表说明文本 */
    effectListTitle?: string;
    /** 分支说明标题 */
    branchReasonLabel?: string;
  }

  /**
   * 检定历史记录扩展字段
   * 用于在 AcuDice.CheckResult 基础上添加效果确认相关状态
   */
  export interface CheckHistoryExtension {
    /** 效果执行状态 */
    effectStatus?: 'planned' | 'confirmed' | 'committed' | 'failed' | 'cancelled';
    /** 效果执行结果列表 */
    effectResults?: EffectResult[];
    /** 效果执行批次ID */
    effectRunId?: string;
    /** 效果执行错误 */
    effectError?: string;
    /** 效果执行追踪（按层级展开） */
    effectTrace?: string[];
    /** 运行事件序号（单调递增） */
    effectEventSeq?: number;
    /** 是否为孤注一掷（Pushed Roll） */
    isPushed?: boolean;
    /** 历史详情展开ID */
    detailId?: string;
    /** 历史详情行 */
    detailLines?: string[];
    /** 发起者名称 */
    initiatorName?: string;
    /** 检定显示类型 */
    historyType?: 'check' | 'contest';
  }

  export interface EffectRunEventPayload {
    seq: number;
    runId: string;
    status: 'planned' | 'confirmed' | 'committed' | 'failed' | 'cancelled';
    characterName: string;
    attributeName: string;
    historyIndex: number;
    effectResults: EffectResult[];
    effectTrace: string[];
    chainMode?: 'first' | 'all';
    error?: string;
    timestamp: number;
  }

  export interface EffectReplayOperation {
    characterName: string;
    target: string;
    operation: 'add' | 'subtract' | 'set';
    value: number;
    initValue?: number;
    min?: number;
    max?: number;
    aliasCandidates: string[];
    resultRef: EffectResult;
  }

  /**
   * 二级效果定义 (预留架构)
   * 用于定义基于属性变化触发的连锁效果
   */
  export interface SecondaryEffect {
    /** 唯一标识 */
    id: string;
    /** 触发条件 */
    trigger: {
      /** 触发类型: threshold=基于阈值, delta=基于变化量 */
      type: 'threshold' | 'delta';
      /** 目标属性名 */
      attribute: string;
      /** 比较运算符 */
      operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
      /** 比较值，支持表达式如 "{意志}/5" */
      value: string;
    };
    /** 回调函数名或钩子标识 (可选) */
    callback?: string;
    /** 命中后要执行的后续效果（可选） */
    effects?: Effect[];
    /** 触发时输出的提示文本 (可选，支持变量: $delta, $old, $new, $attr, $depth, $tableRoll, $tableResult) */
    outputText?: string;
    /** 随机表: 触发时投骰并从表中查找结果，可通过 $tableRoll/$tableResult 在 outputText 中引用 */
    randomTable?: {
      /** 骰子表达式 (如 '1d10') */
      dice: string;
      /** 结果映射: key=投骰结果, value=对应文本 */
      entries: Record<number, string>;
    };
    /** 命名随机表：可一次投多个骰，变量名为 $<key>Roll / $<key>Result */
    randomTables?: Record<
      string,
      {
        /** 骰子表达式 (如 '1d10') */
        dice: string;
        /** 可选映射，不提供时 $<key>Result 默认等于点数 */
        entries?: Record<number, string>;
      }
    >;
    /** 子检定：用于自动化三级效果（例如 INT 检定） */
    subCheck?: {
      /** 显示标签 */
      label?: string;
      /** 目标属性名（主候选） */
      attribute: string;
      /** 目标属性名候选（用于别名/本地化） */
      attributeCandidates?: string[];
      /** 子检定骰子，默认 1d100 */
      dice?: string;
      /** 比较符，默认 lte（低于等于成功） */
      operator?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
      /** 目标值表达式，默认使用读取到的属性值 */
      targetValue?: string;
      /** 属性缺失时提示文本（支持模板变量） */
      missingAttributeText?: string;
      /** 成功分支 */
      success?: {
        outputText?: string;
        randomTable?: {
          dice: string;
          entries: Record<number, string>;
        };
        randomTables?: Record<
          string,
          {
            dice: string;
            entries?: Record<number, string>;
          }
        >;
        effects?: Effect[];
      };
      /** 失败分支 */
      failure?: {
        outputText?: string;
        randomTable?: {
          dice: string;
          entries: Record<number, string>;
        };
        randomTables?: Record<
          string,
          {
            dice: string;
            entries?: Record<number, string>;
          }
        >;
        effects?: Effect[];
      };
    };
    /** 是否启用，默认 true */
    enabled?: boolean;
    /** 最大触发次数，默认 1 */
    maxTriggerCount?: number;
  }

  /** 表单字段配置 */
  export interface FieldConfig {
    /** 输入框上方的标签文本 */
    label?: string;
    /** 输入框内的 placeholder 文本 */
    placeholder?: string;
    /** 留空时的默认值,支持数字或表达式字符串(必填) */
    defaultValue: number | string;
    /** 是否隐藏整个输入框区域 */
    hidden?: boolean;
  }

  export interface CheckSuggestionGuide {
    /** 覆盖检定建议表中的【检定规则】段 */
    rule?: string;
    /** 覆盖检定建议表中的【DSL 命令】段 */
    dsl?: string;
    /** 覆盖检定建议表中的【格式示例】段 */
    examples?: string;
  }

  export interface CheckSuggestionAliases {
    /** 中文参数名到预设字段 ID 的映射 */
    params?: Record<string, string>;
    /** 参数值别名映射，第一层 key 是归一化后的参数名 */
    values?: Record<string, Record<string, string | number | boolean>>;
  }

  export interface AdvancedDicePreset {
    kind: 'advanced';
    id: string;
    name: string;
    description?: string;
    version: string;
    builtin: boolean;
    visible?: boolean;
    order?: number;
    createdAt?: string;

    // 骰子表达式
    diceExpression: string;

    // 属性/技能名称输入框（第一行右侧）
    attributeName?: FieldConfig;

    // 属性值来源（第二行）
    attribute: FieldConfig & {
      key?: string; // 属性名
      computeModifier?: string; // 从属性值派生调整值，如 floor(($attr - 10) / 2)
    };

    // DC来源
    dc: FieldConfig;

    // 修正值来源
    mod?: FieldConfig;

    // 技能加值（与 attribute/mod 平行，用于 DND5e 等规则）
    skillMod?: FieldConfig;

    /**
     * 属性填入目标映射
     * - key: 目标字段 ID ('attribute' | 'skillMod' | 'mod' | customField.id)
     * - value: 属性名数组（精确匹配）
     * - 未匹配的属性 fallback 到 'attribute'
     */
    attrTargetMapping?: Record<string, string[]>;

    // 自定义字段
    customFields?: CustomFieldConfig[];

    // 派生变量
    derivedVars?: DerivedVarSpec[];

    // 骰子表达式补丁
    dicePatches?: DiceExprPatch[];

    // 多级结果定义
    outcomes: OutcomeLevel[];

    // 对抗规则
    contestRule?: ContestRule;

    // 输出模板
    outputTemplate?: string;

    // 对抗检定专用输出模板（与 outputTemplate 独立）
    contestOutputTemplate?: string;

    // 判定结果检查策略
    outcomePolicy?: OutcomePolicy;

    /** 后果系统配置 */
    effectsConfig?: EffectsConfig;
    /** 后果确认弹窗文案配置 */
    effectConfirmUi?: EffectConfirmUiConfig;
    /** 资源消耗配置 */
    resourceBurners?: ResourceBurner[];
    /** 预设快捷操作区（标题右侧小图标） */
    quickActions?: PresetQuickAction[];
    /** 检定后自动修改“当前属性” */
    currentAttrAutoUpdate?: CurrentAttrAutoUpdate;
    /** 二级/多级效果配置（可选） */
    secondaryEffects?: SecondaryEffect[];
    /** 二级效果链最大深度（可选，默认 3） */
    secondaryMaxDepth?: number;
    /** 二级效果触发策略（first=首命中，all=全部命中） */
    secondaryTriggerMode?: 'first' | 'all';

    /** 检定建议表中 <检定规则> 标签的提示词分段 */
    checkSuggestionGuide?: CheckSuggestionGuide;
    /** 检定建议表 DSL 的参数名和值别名 */
    checkSuggestionAliases?: CheckSuggestionAliases;

    /** 孤注一掷配置 (COC7等规则) */
    pushedRoll?: {
      /** 是否启用 */
      enabled: boolean;
      /** 允许push的outcome ID列表 (匹配到这些outcome才显示push按钮)
       *  未定义时: 回退到 isSuccess === false 的行为（向后兼容） */
      pushableOutcomes?: string[];
      /** 禁止push的outcome ID列表 (优先于pushableOutcomes) */
      blockedOutcomes?: string[];
      /** 排除的属性名模式 (通配符,如 'SAN*','*闪避*') */
      excludePatterns?: string[];
      /** @deprecated 使用 blockedOutcomes: ['crit_failure'] 替代 */
      blockOnCritFailure?: boolean;
      /** push后各outcome的输出标注
       *  key: outcome ID 或 '*'(默认)
       *  value: 标注文本 */
      outcomeLabels?: Record<string, string>;
    };

    // 错误处理
    errorHandling?: {
      undefinedVariable: 'zero' | 'error';
      parseError: 'fail' | 'warn';
    };
  }

  export interface PendingEffectContext {
    runId: string;
    historyIndex: number;
    messageId?: string;
    expiresAt?: number;
    preset: AdvancedDicePreset;
    matchedOutcome: OutcomeLevel;
    context: {
      characterName: string;
      attributeName: string;
      attributeValue: number;
      roll: number;
      modifier: number;
      dc: number;
    };
    effectOverrides?: ComputedEffect[];
    /** 进入当前结果分支的说明文本（用于确认弹窗与注入文本） */
    branchReasonText?: string;
    /** 本次检定写入输入栏的 meta 原文，用于多结果追加时定位效果注入位置 */
    sourceMetaText?: string;
    timestamp: number;
  }

















  // 内置高级骰子预设


  // ========================================
  // 属性规则预设系统
  // ========================================

  export type AttributeQuickSelectTarget = 'attribute' | 'skillMod' | 'mod';
  export type CharacterAttributeSource = 'base' | 'special' | 'generic';

  export interface AttributeQuickSelectConfig {
    /** 基础属性快捷按钮默认填入的检定字段 */
    baseTarget?: AttributeQuickSelectTarget;
    /** 特有属性快捷按钮默认填入的检定字段 */
    specialTarget?: AttributeQuickSelectTarget;
    /** 来源不明确时的默认填入字段 */
    fallbackTarget?: AttributeQuickSelectTarget;
    /** 少数属性名需要单独覆盖时使用，key 为目标字段，value 为属性名列表 */
    nameTargetMapping?: Partial<Record<AttributeQuickSelectTarget, string[]>>;
  }

  export interface NormalizedAttributeQuickSelectConfig {
    baseTarget: AttributeQuickSelectTarget;
    specialTarget: AttributeQuickSelectTarget;
    fallbackTarget: AttributeQuickSelectTarget;
    nameTargetMapping: Partial<Record<AttributeQuickSelectTarget, string[]>>;
  }

  export interface AttributePresetAttributeDef {
    name: string;
    formula: string;
    range: [number, number];
    modifier?: string;
  }

  export interface AttributePresetConfig {
    format?: string;
    version?: string | number;
    id?: string;
    name?: string;
    builtin?: boolean;
    description?: string;
    createdAt?: string;
    baseAttributes?: AttributePresetAttributeDef[];
    specialAttributes?: AttributePresetAttributeDef[];
    quickSelect?: AttributeQuickSelectConfig;
  }

  export interface CharacterAttributeEntry {
    name: string;
    value: number;
    source?: CharacterAttributeSource;
  }

  export interface QuickSelectCheckPresetConfig {
    attrTargetMapping?: Record<string, string[]>;
    skillMod?: {
      hidden?: boolean;
    };
    mod?: {
      hidden?: boolean;
    };
    contestRule?: {
      hideSkillMod?: boolean;
      hideMod?: boolean;
    };
  }
