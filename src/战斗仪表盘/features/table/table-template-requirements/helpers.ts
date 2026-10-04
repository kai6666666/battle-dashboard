import type { TableTemplateRequirementLevelConfig, TableTemplateRequirementPreset, TemplateInspectionIssue, TemplateInspectionSeverity, TemplateInspectionSheet, TemplateRecord, TemplateSourceTextField } from './types';
import {
  TEMPLATE_ORDER_FIELD, countDdlCreateTableStatements, formatDdlColumnDefinition, getDdlColumnBody, getDdlColumnForHeader, getDdlColumnsForHeader, getDdlColumnsForSqlName, getDdlSeparatorProblems, getDdlStructureText, getDuplicateDdlSqlNames, getSheetHeaders, getSheetSqlTableName, getTemplateSheetEntries, hasDdlTrailingCommaBeforeClose, headersEquivalent, isRecord, isRowIdHeader, normalizeHeaderText, normalizeSeverity, normalizeTemplateText, parseDdlTableName, toSafeString,
} from './utils';

export const getPresetSheetLevelConfig = (
  preset: TableTemplateRequirementPreset,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
): NonNullable<TableTemplateRequirementLevelConfig['sheets']>[string] | null => {
  const sheetLevels = preset.requirementLevels?.sheets;
  if (!isRecord(sheetLevels)) return null;
  const candidates = [
    requirementKey,
    toSafeString(requirementSheet.name),
    getSheetSqlTableName(requirementSheet),
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (isRecord(sheetLevels[candidate])) return sheetLevels[candidate];
  }
  return null;
};

export const getConfiguredHeaderSeverity = (
  preset: TableTemplateRequirementPreset,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
  header: string,
): TemplateInspectionSeverity => {
  const sheetConfig = getPresetSheetLevelConfig(preset, requirementKey, requirementSheet);
  const headerLevels = isRecord(sheetConfig?.headers) ? sheetConfig.headers : {};
  const direct = headerLevels[header];
  if (direct) return normalizeSeverity(direct, 'error');
  const fuzzy = Object.entries(headerLevels).find(([key]) => headersEquivalent(key, header))?.[1];
  if (fuzzy) return normalizeSeverity(fuzzy, 'error');
  return normalizeSeverity(
    sheetConfig?.header || preset.requirementLevels?.defaults?.header,
    'error',
  );
};

export const getConfiguredSheetSeverity = (
  preset: TableTemplateRequirementPreset,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
): TemplateInspectionSeverity => {
  const sheetConfig = getPresetSheetLevelConfig(preset, requirementKey, requirementSheet);
  return normalizeSeverity(sheetConfig?.sheet || preset.requirementLevels?.defaults?.sheet, 'error');
};

export const getConfiguredDdlSeverity = (
  preset: TableTemplateRequirementPreset,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
): TemplateInspectionSeverity => {
  const sheetConfig = getPresetSheetLevelConfig(preset, requirementKey, requirementSheet);
  return normalizeSeverity(sheetConfig?.ddl || preset.requirementLevels?.defaults?.ddl, 'warning');
};

export const getConfiguredSourceFieldSeverity = (
  preset: TableTemplateRequirementPreset,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
  field: TemplateSourceTextField,
): TemplateInspectionSeverity => {
  const sheetConfig = getPresetSheetLevelConfig(preset, requirementKey, requirementSheet);
  return normalizeSeverity(
    sheetConfig?.sourceData?.[field] || preset.requirementLevels?.defaults?.sourceData?.[field],
    field === 'note' ? 'warning' : 'info',
  );
};

export const getConfiguredConfigSeverity = (
  preset: TableTemplateRequirementPreset,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
): TemplateInspectionSeverity => {
  const sheetConfig = getPresetSheetLevelConfig(preset, requirementKey, requirementSheet);
  return normalizeSeverity(sheetConfig?.config || preset.requirementLevels?.defaults?.config, 'info');
};

export const getConfiguredMateSeverity = (preset: TableTemplateRequirementPreset): TemplateInspectionSeverity =>
  normalizeSeverity(preset.requirementLevels?.defaults?.mate, 'info');

export const findMatchingSheetEntry = (
  targetTemplate: unknown,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
): TemplateSheetEntry | null => findMatchingSheetMatch(targetTemplate, requirementKey, requirementSheet).entry;

export const findMatchingSheetMatch = (
  targetTemplate: unknown,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
): SheetMatchResult => {
  const entries = getTemplateSheetEntries(targetTemplate);
  const exact = entries.find(entry => entry.key === requirementKey);
  if (exact) return { entry: exact, ambiguous: false, reasons: [] };

  const requirementSqlName = getSheetSqlTableName(requirementSheet);
  if (requirementSqlName) {
    const bySqlName = entries.filter(entry => getSheetSqlTableName(entry.sheet) === requirementSqlName);
    if (bySqlName.length === 1) return { entry: bySqlName[0], ambiguous: false, reasons: [] };
    if (bySqlName.length > 1) {
      return {
        entry: null,
        ambiguous: true,
        reasons: [`有 ${bySqlName.length} 张表使用 SQL 表名 ${requirementSqlName}`],
      };
    }
  }

  const requirementName = normalizeTemplateText(requirementSheet.name);
  if (!requirementName) return { entry: null, ambiguous: false, reasons: [] };
  const byName = entries.filter(entry => normalizeTemplateText(entry.sheet.name) === requirementName);
  // [修复] 显示名唯一命中时直接接受：聊天侧表可能被重排内部键或缺少 ddl（SQL 表名解析为空），
  // 旧逻辑会用 SQL 表名从严过滤导致「表明明存在却报缺失」。现在仅在同名多候选时用 SQL 表名优选。
  if (byName.length === 1) return { entry: byName[0], ambiguous: false, reasons: [] };
  if (byName.length > 1) {
    if (requirementSqlName) {
      const sqlEqual = byName.filter(entry => getSheetSqlTableName(entry.sheet) === requirementSqlName);
      if (sqlEqual.length === 1) return { entry: sqlEqual[0], ambiguous: false, reasons: [] };
    }
    return {
      entry: null,
      ambiguous: true,
      reasons: [`有 ${byName.length} 张表使用显示名 ${toSafeString(requirementSheet.name)}`],
    };
  }
  return { entry: null, ambiguous: false, reasons: [] };
};

export const getMissingHeaders = (targetHeaders: string[], requirementHeaders: string[]): string[] =>
  requirementHeaders.filter(header => !targetHeaders.some(targetHeader => headersEquivalent(targetHeader, header)));

export const getDuplicateHeaders = (headers: string[]): string[] => {
  const seen = new Map<string, string>();
  const duplicates = new Map<string, string>();
  headers.forEach(header => {
    const normalized = normalizeHeaderText(header);
    if (!normalized) return;
    if (seen.has(normalized)) {
      duplicates.set(normalized, seen.get(normalized) || header);
      return;
    }
    seen.set(normalized, header);
  });
  return Array.from(duplicates.values());
};

export const getSheetRowShape = (sheet: Record<string, unknown>): SheetRowShape => {
  const content = Array.isArray(sheet.content) ? sheet.content : [];
  const expectedWidth = Array.isArray(content[0]) ? content[0].length : 0;
  const shape: SheetRowShape = { expectedWidth, shortRows: 0, longRows: 0, nonArrayRows: 0 };
  if (expectedWidth === 0) return shape;
  content.slice(1).forEach(row => {
    if (!Array.isArray(row)) {
      shape.nonArrayRows += 1;
      return;
    }
    if (row.length < expectedWidth) shape.shortRows += 1;
    if (row.length > expectedWidth) shape.longRows += 1;
  });
  return shape;
};

export const buildRowShapeMissing = (shape: SheetRowShape): string[] => {
  const missing: string[] = [];
  if (shape.shortRows > 0) missing.push(`${shape.shortRows} 行数据短于表头列数`);
  if (shape.longRows > 0) missing.push(`${shape.longRows} 行数据长于表头列数`);
  if (shape.nonArrayRows > 0) missing.push(`${shape.nonArrayRows} 行数据不是数组`);
  return missing;
};

export const padShortRowsToHeaderLength = (sheet: Record<string, unknown>): number => {
  const content = Array.isArray(sheet.content) ? sheet.content : [];
  const expectedWidth = Array.isArray(content[0]) ? content[0].length : 0;
  if (expectedWidth === 0) return 0;
  let changedRows = 0;
  content.slice(1).forEach(row => {
    if (!Array.isArray(row) || row.length >= expectedWidth) return;
    while (row.length < expectedWidth) row.push('');
    changedRows += 1;
  });
  return changedRows;
};

export const getDdlStructureProblems = (targetDdl: unknown, requirementDdl: unknown): string[] => {
  const problems: string[] = [];
  const targetText = String(targetDdl || '').trim();
  if (!targetText) return problems;

  const createCount = countDdlCreateTableStatements(targetText);
  if (createCount === 0) problems.push('建表说明缺少 CREATE TABLE 语句');
  if (createCount > 1) problems.push(`建表说明包含 ${createCount} 个 CREATE TABLE 语句`);
  if (createCount > 0 && !/\)\s*;\s*$/.test(getDdlStructureText(targetText))) problems.push('建表说明缺少结尾的 );');
  if (hasDdlTrailingCommaBeforeClose(targetText)) problems.push('建表说明在右括号前存在尾随逗号');
  problems.push(...getDdlSeparatorProblems(targetText));
  getDuplicateDdlSqlNames(targetText).forEach(sqlName => {
    problems.push(`建表说明存在重复 SQL 列名 ${sqlName}`);
  });

  const targetTableName = parseDdlTableName(targetText);
  const requirementTableName = parseDdlTableName(requirementDdl);
  if (targetTableName && requirementTableName && targetTableName !== requirementTableName) {
    problems.push(`建表说明表名为 ${targetTableName}，默认要求为 ${requirementTableName}`);
  }

  return problems;
};

export const getDdlColumnCompatibilityProblems = (
  targetDdl: unknown,
  requirementDdl: unknown,
  headers: string[],
): string[] => {
  const problems: string[] = [];
  headers.forEach(header => {
    if (isRowIdHeader(header)) return;
    const requirementColumn = getDdlColumnForHeader(requirementDdl, header);
    if (!requirementColumn) return;
    const targetColumns = getDdlColumnsForHeader(targetDdl, header);
    const sqlNameColumns = getDdlColumnsForSqlName(targetDdl, requirementColumn.sqlName);
    const matchedByHeader = targetColumns.length > 0;
    const candidateColumns = targetColumns.length > 0 ? targetColumns : sqlNameColumns;
    if (candidateColumns.length === 0) return;
    if (candidateColumns.length > 1) {
      problems.push(`“${header}”在建表说明中匹配到 ${candidateColumns.length} 个列定义`);
      return;
    }
    const targetColumn = candidateColumns[0];
    if (
      !matchedByHeader ||
      targetColumn.sqlName !== requirementColumn.sqlName ||
      getDdlColumnBody(targetColumn) !== getDdlColumnBody(requirementColumn)
    ) {
      problems.push(
        `“${header}”当前定义为 ${targetColumn.definition}，默认要求为 ${requirementColumn.definition}`,
      );
    }
  });
  return problems;
};

export const SOURCE_RULE_TAGS = ['属性规则', '检定规则'] as const;
export const SOURCE_TEXT_WARNING_LENGTH = 50000;

export const countTextMatches = (text: string, pattern: RegExp): number => (text.match(pattern) || []).length;

export const getRuleTagOrder = (text: string): string[] =>
  SOURCE_RULE_TAGS.map(tag => ({ tag, index: text.indexOf(`<${tag}>`) }))
    .filter(item => item.index >= 0)
    .sort((left, right) => left.index - right.index)
    .map(item => item.tag);

export const getRuleTagStackProblems = (text: string): string[] => {
  const problems: string[] = [];
  const stack: string[] = [];
  const pattern = /<\/?(属性规则|检定规则)>/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    const token = match[0];
    const tag = match[1];
    if (!token.startsWith('</')) {
      stack.push(tag);
      continue;
    }
    const opened = stack.pop();
    if (opened !== tag) {
      problems.push('规则标记嵌套顺序不正确');
      break;
    }
  }
  return problems;
};

export const getSourceTextTagProblems = (targetText: unknown, requirementText: unknown): string[] => {
  if (typeof targetText !== 'string') return [];
  const requirement = typeof requirementText === 'string' ? requirementText : '';
  const problems: string[] = [];
  SOURCE_RULE_TAGS.forEach(tag => {
    const openPattern = new RegExp(`<${tag}>`, 'g');
    const closePattern = new RegExp(`</${tag}>`, 'g');
    const targetOpenCount = countTextMatches(targetText, openPattern);
    const targetCloseCount = countTextMatches(targetText, closePattern);
    const requirementUsesTag = requirement.includes(`<${tag}>`) || requirement.includes(`</${tag}>`);
    if (requirementUsesTag && (targetOpenCount === 0 || targetCloseCount === 0)) {
      problems.push(`缺少完整的 <${tag}>...</${tag}> 标记`);
      return;
    }
    if (targetOpenCount !== targetCloseCount) problems.push(`<${tag}> 标记未成对闭合`);
    if (targetOpenCount > 1) problems.push(`<${tag}> 标记重复出现`);
  });
  problems.push(...getRuleTagStackProblems(targetText));
  const requirementOrder = getRuleTagOrder(requirement);
  const targetOrder = getRuleTagOrder(targetText);
  if (
    requirementOrder.length > 1 &&
    requirementOrder.every(tag => targetOrder.includes(tag)) &&
    requirementOrder.join('|') !== targetOrder.filter(tag => requirementOrder.includes(tag)).join('|')
  ) {
    problems.push('规则标记顺序与模板检验预设不一致');
  }
  return problems;
};

export const getSourceTextNoiseProblems = (targetText: unknown): string[] => {
  if (typeof targetText !== 'string') return [];
  const problems: string[] = [];
  if (targetText.length > SOURCE_TEXT_WARNING_LENGTH) {
    problems.push(`文本长度超过 ${SOURCE_TEXT_WARNING_LENGTH} 字，建议拆分或压缩`);
  }
  if (
    /<script\b|on[a-z]+\s*=|javascript:/i.test(targetText) ||
    /<\/?(?:a|audio|button|div|embed|form|iframe|img|input|math|object|span|style|svg|video)\b/i.test(targetText)
  ) {
    problems.push('包含疑似可执行 HTML/脚本噪音');
  }
  return problems;
};

export const textMentionsValue = (text: unknown, value: unknown): boolean => {
  const normalizedText = normalizeTemplateText(text);
  const normalizedValue = normalizeTemplateText(value);
  return Boolean(normalizedValue && normalizedText.includes(normalizedValue));
};

export const getSourceFieldMissingHeaders = (
  targetSource: Record<string, unknown>,
  requirementSource: Record<string, unknown>,
  field: string,
  missingHeaders: string[],
): string[] => {
  const requirementText = requirementSource[field];
  if (!requirementText) return [];
  const targetText = targetSource[field];
  if (!targetText) return missingHeaders.filter(header => textMentionsValue(requirementText, header));
  return missingHeaders.filter(header => textMentionsValue(requirementText, header) && !textMentionsValue(targetText, header));
};

export const collectMissingObjectPaths = (target: unknown, requirement: unknown, prefix = ''): string[] => {
  if (!isRecord(requirement)) return [];
  const targetRecord = isRecord(target) ? target : {};
  const paths: string[] = [];
  Object.keys(requirement).forEach(key => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!Object.prototype.hasOwnProperty.call(targetRecord, key)) {
      paths.push(path);
      return;
    }
    if (isRecord(requirement[key]) && isRecord(targetRecord[key])) {
      paths.push(...collectMissingObjectPaths(targetRecord[key], requirement[key], path));
    }
  });
  return paths;
};

export const buildIssue = (issue: TemplateInspectionIssue): TemplateInspectionIssue => issue;

export const collectDuplicateValues = (items: string[]): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  items.forEach(item => {
    const normalized = normalizeTemplateText(item);
    if (!normalized) return;
    if (seen.has(normalized)) duplicates.add(item);
    seen.add(normalized);
  });
  return Array.from(duplicates.values());
};

export const getTemplateStructureIssues = (template: unknown, sheets: TemplateInspectionSheet[]): TemplateInspectionIssue[] => {
  const issues: TemplateInspectionIssue[] = [];
  const duplicateNames = collectDuplicateValues(sheets.map(sheet => sheet.name));
  if (duplicateNames.length > 0) {
    issues.push(
      buildIssue({
        severity: 'warning',
        groupName: '模板全局结构',
        title: '存在重复表格显示名',
        missing: duplicateNames.map(name => `重复表格显示名：${name}`),
        impact: '按显示名 fallback 匹配表格时可能选错表，自动修复也可能补到错误位置。',
        suggestion: '请确保每张表的显示名唯一；如果需要保留旧表，建议改成清晰的归档名称。',
        fixable: false,
        fixActions: [],
      }),
    );
  }

  const duplicateSqlNames = collectDuplicateValues(sheets.map(sheet => sheet.sqlTableName));
  if (duplicateSqlNames.length > 0) {
    issues.push(
      buildIssue({
        severity: 'warning',
        groupName: '模板全局结构',
        title: '存在重复 SQL 表名',
        missing: duplicateSqlNames.map(name => `重复 SQL 表名：${name}`),
        impact: '多张表声明同一个 SQL 表名时，系统无法可靠判断哪张表才是当前聊天真正生效的数据表。',
        suggestion: '请确认重复表是否为旧版本残留；正式使用的表应保持唯一 SQL 表名。',
        fixable: false,
        fixActions: [],
      }),
    );
  }

  const entries = getTemplateSheetEntries(template);
  const orderValues = entries
    .map(entry => Number(entry.sheet[TEMPLATE_ORDER_FIELD]))
    .filter(value => Number.isFinite(value))
    .map(value => String(value));
  const duplicateOrders = collectDuplicateValues(orderValues);
  if (duplicateOrders.length > 0) {
    issues.push(
      buildIssue({
        severity: 'warning',
        groupName: '模板全局结构',
        title: '存在重复表格排序号',
        missing: duplicateOrders.map(order => `重复 orderNo：${order}`),
        impact: '排序号冲突会让 fallback 匹配和界面展示顺序不稳定。',
        suggestion: '请为每张表设置唯一的 orderNo。',
        fixable: false,
        fixActions: [],
      }),
    );
  }

  return issues;
};

type BuiltinRequirementSheetSpec = {
  key: string;
  headers: string[];
  sheetSeverity: TemplateInspectionSeverity;
  defaultHeaderSeverity: TemplateInspectionSeverity;
  headerSeverities?: Record<string, TemplateInspectionSeverity>;
};

export const BUILTIN_DICE_REQUIREMENT_SPECS: BuiltinRequirementSheetSpec[] = [
  {
    key: 'sheet_global_data',
    headers: ['当前详细地点', '当前次要地区', '当前主要地区', '当前时间'],
    sheetSeverity: 'warning',
    defaultHeaderSeverity: 'warning',
    headerSeverities: { 当前主要地区: 'info' },
  },
  {
    key: 'sheet_world_map',
    headers: ['详细地点', '次要地区', '主要地区'],
    sheetSeverity: 'warning',
    defaultHeaderSeverity: 'warning',
    headerSeverities: { 详细地点: 'warning' },
  },
  {
    key: 'sheet_map_elements',
    headers: ['元素名称', '所在地点'],
    sheetSeverity: 'warning',
    defaultHeaderSeverity: 'warning',
    headerSeverities: { 元素名称: 'warning', 所在地点: 'warning' },
  },
  {
    key: 'sheet_protagonist',
    headers: ['姓名', '所在地点', '基础属性', '特有属性'],
    sheetSeverity: 'error',
    defaultHeaderSeverity: 'warning',
    headerSeverities: { 姓名: 'error', 基础属性: 'error', 特有属性: 'warning' },
  },
  {
    key: 'sheet_important_npc',
    headers: ['姓名', '基础属性', '特有属性', '所在地点', '在场状态', '人际关系'],
    sheetSeverity: 'error',
    defaultHeaderSeverity: 'warning',
    headerSeverities: { 姓名: 'error', 基础属性: 'error', 特有属性: 'error', 人际关系: 'warning' },
  },
  {
    key: 'sheet_inventory',
    headers: ['物品名称', '类型', '数量', '品质', '描述'],
    sheetSeverity: 'error',
    defaultHeaderSeverity: 'error',
  },
  {
    key: 'sheet_equipment',
    headers: ['装备名称', '类型', '品质', '状态', '描述'],
    sheetSeverity: 'error',
    defaultHeaderSeverity: 'error',
  },
];

export const buildRequirementNote = (sheetName: string, headers: string[]): string =>
  `【表格模板校验关注列】${sheetName}: ${headers.map((header, index) => `列${index + 1}=${header}`).join('；')}`;

export const filterDdlByHeaders = (ddl: unknown, headers: string[]): string | undefined => {
  const tableName = parseDdlTableName(ddl);
  const definitions = headers
    .map(header => getDdlColumnForHeader(ddl, header)?.definition || '')
    .filter(Boolean);
  if (!tableName || definitions.length === 0) return undefined;
  return `CREATE TABLE ${tableName} (\n${definitions
    .map((definition, index) => `  ${formatDdlColumnDefinition(definition, index < definitions.length - 1)}`)
    .join('\n')}\n);`;
};

export const pickRequirementSheet = (
  sourceSheet: Record<string, unknown>,
  spec: BuiltinRequirementSheetSpec,
): Record<string, unknown> => {
  const sourceHeaders = getSheetHeaders(sourceSheet);
  const headers = sourceHeaders.filter(header => spec.headers.some(required => headersEquivalent(required, header)));

  const sourceData = isRecord(sourceSheet.sourceData) ? (sourceSheet.sourceData as Record<string, unknown>) : {};
  const pickedSourceData: Record<string, unknown> = {
    note: buildRequirementNote(toSafeString(sourceSheet.name || spec.key), headers),
  };
  const ddl = filterDdlByHeaders(sourceData.ddl, headers);
  if (ddl) pickedSourceData.ddl = ddl;

  return {
    name: sourceSheet.name || spec.key,
    [TEMPLATE_ORDER_FIELD]: sourceSheet[TEMPLATE_ORDER_FIELD],
    content: [headers],
    sourceData: pickedSourceData,
  };
};

export const buildBuiltinDiceRequirementTemplate = (template: TemplateRecord): TemplateRecord => {
  const requirementTemplate: TemplateRecord = {};
  BUILTIN_DICE_REQUIREMENT_SPECS.forEach(spec => {
    const sourceSheet = isRecord(template[spec.key]) ? (template[spec.key] as Record<string, unknown>) : null;
    if (!sourceSheet) return;
    requirementTemplate[spec.key] = pickRequirementSheet(sourceSheet, spec);
  });

  return requirementTemplate;
};

export const buildBuiltinDiceRequirementLevels = (): TableTemplateRequirementLevelConfig => ({
  defaults: {
    sheet: 'warning',
    header: 'warning',
    ddl: 'warning',
    sourceData: {
      note: 'info',
    },
    config: 'info',
    mate: 'info',
  },
  sheets: Object.fromEntries(
    BUILTIN_DICE_REQUIREMENT_SPECS.map(spec => [
      spec.key,
      {
        sheet: spec.sheetSeverity,
        header: spec.defaultHeaderSeverity,
        headers: spec.headerSeverities || {},
      },
    ]),
  ),
});
