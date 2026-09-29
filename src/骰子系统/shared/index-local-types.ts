// index.ts 本地类型集中地（x4-b 迁出；后续可按域再细分）

  export type RegexOperation = 'replace' | 'extract' | 'delete' | 'validate';

  /**
   * 正则转换作用域类型
   * - global: 所有表格的所有列
   * - table: 指定表格的所有列
   * - column: 指定表格的指定列
   */
  export type RegexScopeType = 'global' | 'table' | 'column';

  /**
   * 正则转换执行模式
   * - auto: 数据更新时自动执行
   * - manual: 用户手动触发
   * - preview: 预览影响,确认后应用
   */
  export type RegexExecutionMode = 'auto' | 'manual' | 'preview';

  /**
   * 正则标志位选项
   */
  export interface RegexFlags {
    caseInsensitive?: boolean; // i - 忽略大小写
    global?: boolean; // g - 全局匹配
    multiline?: boolean; // m - 多行模式
    unicode?: boolean; // u - Unicode模式
    sticky?: boolean; // y - 粘性匹配
  }

  /**
   * 作用域配置
   */
  export interface RegexScopeConfig {
    type: RegexScopeType;
    tableNames?: string[]; // 作用域为table或column时指定表格名
    columnNames?: string[]; // 作用域为column时指定列名
  }

  /**
   * 安全配置
   */
  export interface RegexSecurityConfig {
    maxMatchTime: number; // 单次匹配最大耗时(毫秒),默认100
    maxMatches: number; // 最大匹配次数,默认1000
    maxInputLength: number; // 最大输入长度,默认10000
  }

  /**
   * 测试用例
   */
  export interface RegexTestCase {
    input: string;
    expected: string;
    description?: string;
  }

  /**
   * 表格正则规则
   */
  export interface RegexTransformationRule {
    id: string; // 唯一标识
    name: string; // 规则名称
    description?: string; // 规则描述
    operation: RegexOperation; // 操作类型
    pattern: string; // 正则表达式字符串
    flags?: RegexFlags; // 正则标志位
    replacement?: string; // 替换内容(仅replace操作)
    scope: RegexScopeConfig; // 作���域配置
    enabled: boolean; // 是否启用
    priority: number; // 优先级(1-100),数值越大优先级越高
    executeMode: RegexExecutionMode; // 执行模式
    testCases?: RegexTestCase[]; // 测试用例
    security?: RegexSecurityConfig; // 安全配置
    createdAt?: number; // 创建时间戳
    updatedAt?: number; // 更新时间戳
  }

  /**
   * 转换结果
   */
  export interface RegexTransformResult {
    success: boolean;
    oldValue: string;
    newValue: string;
    matched: boolean;
    error?: string;
  }

  /**
   * 批量转换结果
   */
  export interface RegexBatchTransformResult {
    tableName: string;
    columnIndex: number;
    rowIndex: number;
    result: RegexTransformResult;
  }

  /**
   * 预览结果
   */
  export interface RegexPreviewResult {
    rule: RegexTransformationRule;
    affectedCells: Array<{
      tableName: string;
      rowIndex: number;
      columnIndex: number;
      columnName: string;
      oldValue: string;
      newValue: string;
    }>;
    totalAffected: number;
  }

  /**
   * 预设配置
   */
  export interface RegexPreset {
    id: string;
    name: string;
    description?: string;
    version: string;
    rules: RegexTransformationRule[];
    createdAt?: number;
    updatedAt?: number;
  }

  // 正则转换系统存储键





  // ========================================
  // 酒馆原生正则格式兼容 (Tavern Regex Import)
  // ========================================

  /**
   * 酒馆原生正则格式
   * @see https://docs.sillytavern.app/usage/core-concepts/regex/
   */
  export interface TavernRegex {
    id?: string;
    scriptName: string;
    findRegex: string;
    replaceString: string;
    trimStrings?: string[];
    placement?: number[];
    disabled?: boolean;
    markdownOnly?: boolean;
    promptOnly?: boolean;
    runOnEdit?: boolean;
    substituteRegex?: number;
    minDepth?: number | null;
    maxDepth?: number | null;
  }
  export interface FavoriteItem {
    id: string;
    header: string[];
    rowData: (string | number)[];
    tags: string[];
    createdAt: number;
    updatedAt: number;
    sourceInfo?: {
      tableUid: string;
      tableName: string;
      chatId: string;
    };
  }


  export type DiceHistoryEventType = 'check' | 'contest';

  export interface DiceHistoryStatRecord {
    id?: number;
    eventType: DiceHistoryEventType;
    timestamp: number;
    chatId: string;
    characterId: string;
    success: boolean;
    attrName: string;
    formula: string;
    total: number;
    target: number;
    outcomeText: string;
  }

  export interface DiceHistoryStatsSummary {
    total: number;
    checks: number;
    contests: number;
    checkSuccess: number;
    checkSuccessRate: number;
  }
  export interface AttributeRuleAttributeConfig {
    name: string;
    formula: string;
    range: [number, number];
    modifier?: string;
  }

  export interface AttributeRulePresetConfig {
    id: string;
    name: string;
    baseAttributes?: AttributeRuleAttributeConfig[];
    specialAttributes?: AttributeRuleAttributeConfig[];
  }

  export interface GeneratedAttributeRules {
    base?: Record<string, number>;
    special?: Record<string, number>;
  }

  export type RuleTemplateSourceData = { note?: unknown };
  export type RuleTemplateSheet = { name?: unknown; sourceData?: RuleTemplateSourceData };
  export type RuleTemplateRecord = Record<string, unknown>;
  export type DashboardColumnConfig = {
    keywords: string[];
    fallbackIndex: number | null;
    isMultiple?: boolean;
  };
  export type DashboardFilterConfig = {
    column: string;
    includes: string[];
    excludeColumn?: string;
    excludes?: string[];
  };
  export type DashboardModuleConfig = {
    tableKeywords: string[];
    columns: Record<string, DashboardColumnConfig>;
    filters?: Record<string, DashboardFilterConfig>;
  };
  export type DashboardConfigMap = Record<string, DashboardModuleConfig>;
  export type DashboardPresetColumnConfig = {
    keywords: string[];
  };
  export type DashboardPresetFilterConfig = {
    column?: string;
    includes?: string[];
    excludeColumn?: string;
    excludes?: string[];
  };
  export type DashboardRelationshipGraphSourceMode = 'fixedTarget' | 'relationList';
  export type DashboardRelationshipGraphSourceConfig = {
    mode: DashboardRelationshipGraphSourceMode;
    tableKeywords: string[];
    nameColumn: string[];
    relationColumn: string[];
    target?: string;
  };
  export type DashboardPresetModuleConfig = {
    tableKeywords?: string[];
    columns?: Record<string, DashboardPresetColumnConfig>;
    filters?: Record<string, DashboardPresetFilterConfig>;
    sources?: DashboardRelationshipGraphSourceConfig[];
  };
  export type DashboardPresetModules = Record<string, DashboardPresetModuleConfig>;
  export type DashboardPreset = {
    format: 'acu_dashboard_preset_v1';
    version: string;
    id: string;
    name: string;
    builtin?: boolean;
    description?: string;
    modules: DashboardPresetModules;
    createdAt?: string;
    updatedAt?: string;
  };
  export interface GlobalInteractionAction {
    label: string;
    icon?: string;
    type?: string;
    template?: string;
    auto_send?: boolean;
  }

  export interface GlobalInteractionRow {
    rowIndex: number;
    title: string;
    iconName: string;
    actions: GlobalInteractionAction[];
    searchText: string;
  }

  export interface GlobalInteractionGroup {
    tableKey: string;
    tableName: string;
    rows: GlobalInteractionRow[];
  }

  export type GlobalInteractionSectionKind =
    | 'character'
    | 'map'
    | 'item'
    | 'equipment'
    | 'task'
    | 'skill'
    | 'faction'
    | 'generic';

  export interface GlobalInteractionSection {
    kind: GlobalInteractionSectionKind;
    title: string;
    icon: string;
    order: number;
    groups: GlobalInteractionGroup[];
  }

  export interface GlobalInteractionSectionMeta {
    kind: GlobalInteractionSectionKind;
    title: string;
    icon: string;
    order: number;
    keywords: string[];
  }

  export interface GlobalInteractionActionRuleGroup {
    table_keywords: string[];
  }
  export type CustomTableNameIconModuleId =
    | 'table-name'
    | 'item'
    | 'equipment'
    | 'faction'
    | 'global-interaction-panel'
    | 'global-interaction-map-marker'
    | 'shop'
    | 'avatar-manager'
    | 'relationship-graph'
    | 'map-character-node'
    | 'character-interaction-panel'
    | 'alias-resolution'
    | 'user-graph-resolution';

  export type CustomTableNameIconSection =
    | 'table'
    | 'map'
    | 'item'
    | 'equipment'
    | 'faction'
    | 'shop'
    | 'task'
    | 'skill'
    | 'generic'
    | 'character'
    | 'relationship'
    | 'alias'
    | 'user';

  export interface CustomTableNameIconContext {
    moduleId: CustomTableNameIconModuleId;
    tableName: string;
    section: CustomTableNameIconSection;
    name: string;
  }

  export type CustomTableNameIconSourceType = 'url' | 'local';

  export type CustomTableNameIconInvalidSourceReason =
    | 'invalid_url'
    | 'invalid_protocol'
    | 'svg_url'
    | 'svg_mime'
    | 'unsupported_mime'
    | 'oversize';
  export interface CustomTableNameIconEntry extends CustomTableNameIconContext {
    sourceType: CustomTableNameIconSourceType;
    imageUrl: string;
    localIconKey: string | null;
    imageMimeType: string | null;
    imageSize: number | null;
    createdAt: number;
    updatedAt: number;
  }

  export interface CustomTableNameIconPackEntryMetadata {
    imageMimeType: string | null;
    imageSize: number | null;
    missingLocalBinary?: boolean;
    originalLocalKey?: string | null;
  }

  export interface CustomTableNameIconPackEntry extends CustomTableNameIconContext {
    sourceType: CustomTableNameIconSourceType;
    url?: string;
    localKey?: string | null;
    metadata: CustomTableNameIconPackEntryMetadata;
  }

  export interface CustomTableNameIconPack {
    schemaVersion: number;
    exportedAt: string;
    entries: CustomTableNameIconPackEntry[];
  }

  export interface CustomTableNameIconPackImportAnalysis {
    entriesToImport: CustomTableNameIconEntry[];
    importedCount: number;
    overwrittenCount: number;
    skippedInvalidUrlCount: number;
    skippedNonWhitelistCount: number;
    skippedInvalidEntryCount: number;
    localMissingCount: number;
  }

  export interface ResolvedCustomTableNameIcon {
    icon: string;
    entry: CustomTableNameIconEntry | null;
    key: string | null;
    sourceType: CustomTableNameIconSourceType | null;
    imageUrl: string | null;
    localIconKey: string | null;
    assetUrl: string | null;
    reason: 'invalid' | 'invalid_source' | 'not_whitelisted' | 'missing' | 'resolved';
  }

  export interface CustomTableNameIconImageRecord {
    key: string;
    blob: Blob;
    size: number;
    type: string;
    updatedAt: number;
  }

  export type DashboardCustomTableNameIconContextInfo = {
    moduleId: CustomTableNameIconModuleId;
    section: CustomTableNameIconSection;
  };
  export type RelationGraphCell = string | number | null | undefined;
  export type RelationGraphRow = RelationGraphCell[];

  export interface RelationGraphTableInput {
    headers?: RelationGraphCell[];
    rows?: RelationGraphRow[];
    key?: string;
  }

  export interface RelationshipGraphSourceTableMatch {
    tableName: string;
    table: RelationGraphTableInput;
  }

  export interface RelationshipGraphBuildOptions {
    tableName?: string;
  }

  export interface RelationshipGraphRenderOptions {
    includePlayerRelations?: boolean;
  }

  export interface RelationGraphNode {
    name: string;
    isPlayer: boolean;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    tableKey: string;
    rowIndex?: number;
    isInScene?: boolean;
    fixed?: boolean;
  }

  export interface RelationGraphEdge {
    source: string;
    target: string;
    labelsFromSource: string[];
    labelsFromTarget: string[];
  }

  export interface ParsedRelationshipItem {
    name: string;
    relation: string;
  }

  export interface RelationGraphColumnMatch {
    index: number;
    isConfigured: boolean;
  }
  export type RuntimeCrudRowData = Record<string, unknown>;

  export type RuntimeCrudCellUpdatePayload = {
    tableName: string;
    rowIndex: number;
    colIdentifier: string | number;
    value: unknown;
    skipNotify?: boolean;
    skipChatSave?: boolean;
  };

  export type RuntimeCrudUpdateRowPayload = {
    tableName: string;
    rowIndex: number;
    data: RuntimeCrudRowData;
    skipNotify?: boolean;
    skipChatSave?: boolean;
  };

  export type RuntimeCrudInsertRowPayload = {
    tableName: string;
    data: RuntimeCrudRowData;
    skipNotify?: boolean;
    skipChatSave?: boolean;
  };

  export type RuntimeCrudDeleteRowPayload = {
    tableName: string;
    rowIndex: number;
    skipNotify?: boolean;
    skipChatSave?: boolean;
  };

  export type RuntimeCrudWriteApi = {
    updateCell: (payload: RuntimeCrudCellUpdatePayload) => Promise<unknown> | unknown;
    updateRow?: (payload: RuntimeCrudUpdateRowPayload) => Promise<unknown> | unknown;
    insertRow: (payload: RuntimeCrudInsertRowPayload) => Promise<unknown> | unknown;
    deleteRow: (payload: RuntimeCrudDeleteRowPayload) => Promise<unknown> | unknown;
    getCurrentData?: () => unknown;
    exportTableAsJson?: () => unknown;
    refreshDataAndWorldbook?: () => Promise<unknown> | unknown;
    triggerUpdate?: () => Promise<unknown> | unknown;
    _notifyTableUpdate?: () => void;
  };
  export type TemplateInspectionSeverity = 'error' | 'warning' | 'info';

  export type TemplateInspectionSheet = {
    key: string;
    name: string;
    headers: string[];
    note: string;
  };

  export type TemplateInspectionIssue = {
    severity: TemplateInspectionSeverity;
    groupName: string;
    title: string;
    missing: string[];
    impact: string;
    suggestion: string;
  };

  export type TemplateInspectionIssueGroup = {
    name: string;
    severity: TemplateInspectionSeverity;
    issues: TemplateInspectionIssue[];
  };

  export type TemplateInspectionResult = {
    sheets: TemplateInspectionSheet[];
    issues: TemplateInspectionIssue[];
    checkedAt: string;
  };

  export type TemplateTableRequirement = {
    title: string;
    severity: TemplateInspectionSeverity;
    tableLabel: string;
    tableMatches: string[];
    requiredColumns?: { label: string; matches: string[] }[];
    requiredNoteTags?: string[];
    impact: string;
    suggestion: string;
  };
// [x4-o] 自 index.ts 迁出（骰子统计作用域）
export type DiceStatsScope = 'chat' | 'character' | 'global';
