/**
 * table-template-requirements / utils.ts
 * 基础工具与 DDL 工具（从主文件拆出）。
 */
import type { TemplateInspectionSeverity, TemplateInspectionSheet, TemplateSourceTextField } from './types';

export const SOURCE_TEXT_FIELDS: TemplateSourceTextField[] = ['note', 'initNode', 'insertNode', 'updateNode', 'deleteNode'];
export const CONFIG_FIELDS = ['updateConfig', 'exportConfig'] as const;
export const TEMPLATE_ORDER_FIELD = 'orderNo';
export const SOURCE_TEXT_FIELD_LABELS: Record<TemplateSourceTextField, string> = {
  note: '表格说明',
  initNode: '初始化规则',
  insertNode: '新增数据规则',
  updateNode: '更新数据规则',
  deleteNode: '删除数据规则',
};
export const CONFIG_FIELD_LABELS: Record<(typeof CONFIG_FIELDS)[number], string> = {
  updateConfig: '自动更新设置',
  exportConfig: '导出设置',
};
export const SEVERITY_RANK: Record<TemplateInspectionSeverity, number> = {
  info: 0,
  warning: 1,
  error: 2,
};

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const cloneTemplateValue = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const hasOwn = (record: Record<string, unknown>, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(record, key);

export const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const normalizeSeverity = (
  value: unknown,
  fallback: TemplateInspectionSeverity = 'info',
): TemplateInspectionSeverity => {
  if (value === 'error' || value === 'warning' || value === 'info') return value;
  return fallback;
};

export const maxSeverity = (values: TemplateInspectionSeverity[]): TemplateInspectionSeverity => {
  if (values.length === 0) return 'info';
  return values.reduce((highest, value) => (SEVERITY_RANK[value] > SEVERITY_RANK[highest] ? value : highest), 'info');
};

export const normalizeTemplateText = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toLowerCase();

export const normalizeHeaderText = (value: unknown): string => normalizeTemplateText(value).replace(/\s+/g, '');
export const normalizeHeaderLookupText = (value: unknown): string =>
  normalizeHeaderText(value)
    .replace(/（/g, '(')
    .replace(/）/g, ')');

export const isRowIdHeader = (value: unknown): boolean => {
  const normalized = normalizeHeaderText(value);
  return normalized === 'row_id' || normalized === '行号';
};

export const getSourceTextFieldLabel = (field: string): string =>
  Object.prototype.hasOwnProperty.call(SOURCE_TEXT_FIELD_LABELS, field)
    ? SOURCE_TEXT_FIELD_LABELS[field as TemplateSourceTextField]
    : field;

export const getConfigFieldLabel = (field: string): string =>
  Object.prototype.hasOwnProperty.call(CONFIG_FIELD_LABELS, field)
    ? CONFIG_FIELD_LABELS[field as (typeof CONFIG_FIELDS)[number]]
    : field;

export const formatSheetName = (name: string): string => `“${name}”`;

export const normalizeDdlColumnComment = (comment: unknown): string =>
  toSafeString(comment)
    .replace(/[，,].*$/, '')
    .trim();

export const getDdlColumnCommentAliases = (comment: unknown): string[] => {
  const fullComment = normalizeDdlColumnComment(comment);
  if (!fullComment) return [];
  const aliases = [fullComment];
  const looseComment = fullComment.replace(/[（(].*$/, '').trim();
  if (looseComment && looseComment !== fullComment) aliases.push(looseComment);
  return Array.from(new Set(aliases));
};

export const headersEquivalent = (left: unknown, right: unknown): boolean => {
  if (isRowIdHeader(left) && isRowIdHeader(right)) return true;
  return normalizeHeaderLookupText(left) === normalizeHeaderLookupText(right);
};

export const toSafeString = (value: unknown): string => String(value ?? '').trim();

export const getTemplateSheetEntries = (template: unknown): TemplateSheetEntry[] => {
  if (!isRecord(template)) return [];
  return Object.entries(template)
    .filter((entry): entry is [string, Record<string, unknown>] => {
      const [key, value] = entry;
      return key.startsWith('sheet_') && isRecord(value);
    })
    .map(([key, sheet]) => ({ key, sheet }))
    .sort((left, right) => getSheetOrder(left.sheet) - getSheetOrder(right.sheet));
};

export const getSheetOrder = (sheet: Record<string, unknown>): number => {
  const value = Number(sheet[TEMPLATE_ORDER_FIELD]);
  return Number.isFinite(value) ? value : 999999;
};

export const getSheetHeaders = (sheet: Record<string, unknown>): string[] => {
  const content = Array.isArray(sheet.content) ? sheet.content : [];
  const headerRow = Array.isArray(content[0]) ? content[0] : [];
  return headerRow.map(header => toSafeString(header));
};

export const getSheetContentProblems = (sheet: Record<string, unknown>): string[] => {
  if (hasOwn(sheet, 'content') && !Array.isArray(sheet.content)) return ['content 必须是数组'];
  if (Array.isArray(sheet.content) && sheet.content.length > 0 && !Array.isArray(sheet.content[0])) {
    return ['content[0] 表头行必须是数组'];
  }
  return [];
};

export const ensureSheetContent = (sheet: Record<string, unknown>): unknown[][] => {
  if (!Array.isArray(sheet.content)) sheet.content = [['row_id']];
  const content = sheet.content as unknown[][];
  if (!Array.isArray(content[0])) content[0] = ['row_id'];
  return content;
};

export const getSheetSourceData = (sheet: Record<string, unknown>): Record<string, unknown> => {
  if (!isRecord(sheet.sourceData)) sheet.sourceData = {};
  return sheet.sourceData as Record<string, unknown>;
};

export const getDdlStructureText = (ddl: unknown): string =>
  String(ddl || '')
    .replace(/'([^']|'')*'/g, "''")
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/--[^\r\n]*/g, '');

export const stripDdlBlockComments = (ddl: unknown): string => String(ddl || '').replace(/\/\*[\s\S]*?\*\//g, '');

export const parseDdlTableName = (ddl: unknown): string => {
  const match = getDdlStructureText(ddl).match(/\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"[]?([A-Za-z_][A-Za-z0-9_]*)/i);
  return toSafeString(match?.[1]);
};

export const countDdlCreateTableStatements = (ddl: unknown): number =>
  (getDdlStructureText(ddl).match(/\bCREATE\s+TABLE\b/gi) || []).length;

export const hasDdlTrailingCommaBeforeClose = (ddl: unknown): boolean =>
  /,\s*\)\s*;?\s*$/.test(getDdlStructureText(ddl));

export const getDdlSeparatorProblems = (ddl: unknown): string[] => {
  const lines = getDdlStructureText(ddl).split(/\r?\n/);
  const definitions: { lineNumber: number; text: string }[] = [];
  let insideCreateTable = false;

  lines.forEach((line, index) => {
    const text = line.trim();
    if (!insideCreateTable && /\bCREATE\s+TABLE\b/i.test(text)) {
      insideCreateTable = true;
      return;
    }
    if (!insideCreateTable) return;
    if (!text || text.startsWith('/*') || text.endsWith('*/')) return;
    if (/^\)/.test(text)) {
      insideCreateTable = false;
      return;
    }
    definitions.push({ lineNumber: index + 1, text });
  });

  return definitions
    .slice(0, -1)
    .filter(definition => !definition.text.endsWith(','))
    .map(definition => `建表说明第 ${definition.lineNumber} 行定义后缺少逗号`);
};

export const parseDdlColumns = (ddl: unknown): DdlColumnInfo[] => {
  const text = stripDdlBlockComments(ddl);
  if (!text.trim()) return [];
  const lines = text.split(/\r?\n/);
  const columns: DdlColumnInfo[] = [];
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || /^\)?;?$/.test(trimmed)) continue;
    if (/^CREATE\s+TABLE\b/i.test(trimmed)) continue;
    if (/^(CONSTRAINT|PRIMARY|UNIQUE|CHECK|FOREIGN)\b/i.test(trimmed)) continue;
    const match = trimmed.match(/^(?:"((?:[^"]|"")*)"|`((?:[^`]|``)*)`|\[([^\]]+)\]|([A-Za-z_][A-Za-z0-9_]*))(.*)$/);
    if (!match) continue;
    const sqlName = (match[1] || match[2] || match[3] || match[4]).replace(/""/g, '"').replace(/``/g, '`');
    const definition = normalizeDdlColumnDefinition(`${sqlName}${match[5] || ''}`);
    const commentMatch = definition.match(/--\s*(.+?)\s*$/);
    const comment = normalizeDdlColumnComment(commentMatch?.[1]);
    columns.push({ sqlName, comment, definition });
  }
  return columns;
};

export const normalizeDdlColumnDefinition = (definition: string): string =>
  definition.trim().replace(/,\s*$/, '').replace(/,\s*(--\s*.*)$/, ' $1');

export const formatDdlColumnDefinition = (definition: string, needsComma: boolean): string => {
  const cleaned = normalizeDdlColumnDefinition(definition);
  if (!needsComma) return cleaned;
  if (/\s--\s*/.test(cleaned)) return cleaned.replace(/\s+(--\s*.*)$/, ', $1');
  return `${cleaned},`;
};

export const appendCommaToLastDdlColumnLine = (text: string): string => {
  const lines = text.split('\n');
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (!lines[index].trim()) continue;
    lines[index] = formatDdlColumnDefinition(lines[index], true);
    return lines.join('\n');
  }
  return text;
};

export const getDdlColumnForHeader = (ddl: unknown, header: string): DdlColumnInfo | null => {
  const columns = getDdlColumnsForHeader(ddl, header);
  return columns[0] || null;
};

export const getDdlColumnsForHeader = (ddl: unknown, header: string): DdlColumnInfo[] =>
  parseDdlColumns(ddl).filter(
    column =>
      getDdlColumnCommentAliases(column.comment).some(alias => headersEquivalent(alias, header)) ||
      headersEquivalent(column.sqlName, header),
  );

export const getDdlColumnsForSqlName = (ddl: unknown, sqlName: string): DdlColumnInfo[] =>
  parseDdlColumns(ddl).filter(column => column.sqlName === sqlName);

export const hasDdlColumnForHeader = (ddl: unknown, header: string): boolean => Boolean(getDdlColumnForHeader(ddl, header));

export const getDuplicateDdlSqlNames = (ddl: unknown): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  parseDdlColumns(ddl).forEach(column => {
    const normalized = column.sqlName.toLowerCase();
    if (seen.has(normalized)) duplicates.add(column.sqlName);
    seen.add(normalized);
  });
  return Array.from(duplicates.values());
};

export const hasDdlSqlNameForRequirementHeader = (targetDdl: unknown, requirementDdl: unknown, header: string): boolean => {
  const requirementColumn = getDdlColumnForHeader(requirementDdl, header);
  return Boolean(requirementColumn && getDdlColumnsForSqlName(targetDdl, requirementColumn.sqlName).length > 0);
};

export const getDdlColumnBody = (column: DdlColumnInfo): string =>
  column.definition
    .replace(new RegExp(`^\\s*${escapeRegExp(column.sqlName)}\\b`), '')
    .replace(/\s--.*$/, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

export const getSheetSqlTableName = (sheet: Record<string, unknown>): string =>
  parseDdlTableName(isRecord(sheet.sourceData) ? sheet.sourceData.ddl : '');

export const makeInspectionSheet = (key: string, sheet: Record<string, unknown>): TemplateInspectionSheet => ({
  key,
  name: toSafeString(sheet.name || key),
  headers: getSheetHeaders(sheet),
  sqlTableName: getSheetSqlTableName(sheet),
  sourceData: isRecord(sheet.sourceData) ? (sheet.sourceData as Record<string, unknown>) : {},
  raw: sheet,
});
