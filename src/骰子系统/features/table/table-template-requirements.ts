/**
 * table-template-requirements.ts
 * 模板检验/修复主模块（types→types.ts，基础工具→utils.ts）。
 */
export * from './table-template-requirements/types';
export { cloneTemplateValue, parseDdlTableName } from './table-template-requirements/utils';
import {
  DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID,
  TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT,
  TABLE_TEMPLATE_REQUIREMENT_PRESET_VERSION,
} from './table-template-requirements/types';
import {
  SOURCE_TEXT_FIELDS, CONFIG_FIELDS, TEMPLATE_ORDER_FIELD, isRecord, cloneTemplateValue, hasOwn,
  normalizeSeverity, maxSeverity, normalizeTemplateText, normalizeHeaderText, isRowIdHeader, getSourceTextFieldLabel,
  getConfigFieldLabel, formatSheetName, headersEquivalent, toSafeString, getTemplateSheetEntries, getSheetHeaders,
  getSheetContentProblems, ensureSheetContent, getSheetSourceData, getDdlStructureText, parseDdlTableName, countDdlCreateTableStatements,
  hasDdlTrailingCommaBeforeClose, parseDdlColumns, formatDdlColumnDefinition, appendCommaToLastDdlColumnLine, getDdlColumnForHeader, getDdlColumnsForHeader,
  getDdlColumnsForSqlName, hasDdlColumnForHeader, getDuplicateDdlSqlNames, hasDdlSqlNameForRequirementHeader, getDdlColumnBody, getSheetSqlTableName,
  makeInspectionSheet,
  getDdlSeparatorProblems,
} from './table-template-requirements/utils';

export const getTemplateInspectionSheets = (template: unknown): TemplateInspectionSheet[] =>
  getTemplateSheetEntries(template).map(entry => makeInspectionSheet(entry.key, entry.sheet));

import {
  buildBuiltinDiceRequirementLevels, buildBuiltinDiceRequirementTemplate, buildIssue, buildRowShapeMissing, collectMissingObjectPaths, findMatchingSheetEntry, findMatchingSheetMatch, getConfiguredConfigSeverity, getConfiguredDdlSeverity, getConfiguredHeaderSeverity, getConfiguredMateSeverity, getConfiguredSheetSeverity, getConfiguredSourceFieldSeverity, getDdlColumnCompatibilityProblems, getDdlStructureProblems, getDuplicateHeaders, getMissingHeaders, getSheetRowShape, getSourceFieldMissingHeaders, getSourceTextNoiseProblems, getSourceTextTagProblems, getTemplateStructureIssues, padShortRowsToHeaderLength,
} from './table-template-requirements/helpers';

export const createBuiltinTableTemplateRequirementPreset = (templateRaw: string): TableTemplateRequirementPreset => {
  const parsed = JSON.parse(templateRaw);
  const template = isRecord(parsed) ? (parsed as TemplateRecord) : {};
  const requirementTemplate = buildBuiltinDiceRequirementTemplate(template);
  return {
    id: DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID,
    name: '默认表格检验',
    description: '检查当前聊天模板是否满足骰子系统常用表格的基础要求，并按严重、警告、提示分级显示问题。',
    format: TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT,
    version: TABLE_TEMPLATE_REQUIREMENT_PRESET_VERSION,
    builtin: true,
    order: 0,
    requirementLevels: buildBuiltinDiceRequirementLevels(),
    template: requirementTemplate,
  };
};

export const normalizeTableTemplateRequirementPreset = (
  raw: unknown,
  fallbackId = `custom_table_template_requirement_${Date.now()}`,
): TableTemplateRequirementPreset | null => {
  if (!isRecord(raw)) return null;
  const source = isRecord(raw.preset) ? (raw.preset as Record<string, unknown>) : raw;
  const template = isRecord(source.template) ? (source.template as TemplateRecord) : null;
  if (!template) return null;
  const name = toSafeString(source.name) || '未命名模板检验预设';
  return {
    id: toSafeString(source.id) || fallbackId,
    name,
    description: toSafeString(source.description),
    format: TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT,
    version: TABLE_TEMPLATE_REQUIREMENT_PRESET_VERSION,
    builtin: source.builtin === true,
    order: Number.isFinite(Number(source.order)) ? Number(source.order) : 999,
    requirementLevels: isRecord(source.requirementLevels)
      ? cloneTemplateValue(source.requirementLevels as TableTemplateRequirementLevelConfig)
      : undefined,
    template: cloneTemplateValue(template),
  };
};

export const exportTableTemplateRequirementPreset = (preset: TableTemplateRequirementPreset): string => {
  const exported = {
    format: TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT,
    version: TABLE_TEMPLATE_REQUIREMENT_PRESET_VERSION,
    preset: {
      id: preset.id,
      name: preset.name,
      description: preset.description || '',
      requirementLevels: preset.requirementLevels,
      template: preset.template,
    },
  };
  return JSON.stringify(exported, null, 2);
};

export const inspectTableTemplateWithPreset = (
  template: unknown,
  preset: TableTemplateRequirementPreset,
): TemplateInspectionResult => {
  const targetSheets = getTemplateInspectionSheets(template);
  const issues: TemplateInspectionIssue[] = [...getTemplateStructureIssues(template, targetSheets)];

  getTemplateSheetEntries(preset.template).forEach(({ key: requirementKey, sheet: requirementSheet }) => {
    const requirementInspectionSheet = makeInspectionSheet(requirementKey, requirementSheet);
    const matchedEntry = findMatchingSheetEntry(template, requirementKey, requirementSheet);

    if (!matchedEntry) {
      const severity = getConfiguredSheetSeverity(preset, requirementKey, requirementSheet);
      issues.push(
        buildIssue({
          severity,
          groupName: requirementInspectionSheet.name,
          title: `缺少${formatSheetName(requirementInspectionSheet.name)}表`,
          missing: [`需要追加${formatSheetName(requirementInspectionSheet.name)}表`],
          impact: '依赖这张表的仪表盘、检定、地图或骰子商店可能无法读取和保存数据。',
          suggestion: '可以把预设中的表结构追加到当前聊天模板末尾，不会改动已有表。',
          fixable: true,
          fixActions: [`追加${formatSheetName(requirementInspectionSheet.name)}表`],
        }),
      );
      return;
    }

    const matchedSheet = makeInspectionSheet(matchedEntry.key, matchedEntry.sheet);
    const contentProblems = getSheetContentProblems(matchedSheet.raw);
    if (contentProblems.length > 0) {
      issues.push(
        buildIssue({
          severity: 'error',
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}的表格内容结构无效`,
          missing: contentProblems.map(problem => `${formatSheetName(matchedSheet.name)}表的 ${problem}`),
          impact: '表头或数据区不是数组时，自动修复无法判断旧内容应如何映射到新列，直接重建可能丢失用户数据。',
          suggestion: '请先手动把 content 修成二维数组，再使用智能修复补齐缺失列。',
          fixable: false,
          fixActions: [],
        }),
      );
    }
    const missingHeaders = getMissingHeaders(matchedSheet.headers, requirementInspectionSheet.headers);
    if (missingHeaders.length > 0) {
      const missingFirstColumn = missingHeaders.some(header => isRowIdHeader(header));
      const severity = maxSeverity(
        missingHeaders.map(header =>
          isRowIdHeader(header) ? 'warning' : getConfiguredHeaderSeverity(preset, requirementKey, requirementSheet, header),
        ),
      );
      issues.push(
        buildIssue({
          severity,
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}缺少必要列`,
          missing: missingHeaders.map(header => `${formatSheetName(matchedSheet.name)}表缺少“${header}”列`),
          impact: '缺少这些列时，系统可能找不到要读取或保存的数据，仪表盘、检定和自动填表都会不稳定。',
          suggestion: missingFirstColumn
            ? '“行号”必须放在第一列，请手动补好行号首列后再使用智能修复。'
            : '可以把缺少的列追加到表头末尾，并为现有数据行补空值。',
          fixable: !missingFirstColumn,
          fixActions: missingFirstColumn
            ? []
            : missingHeaders.map(header => `在${formatSheetName(matchedSheet.name)}表末尾追加“${header}”列`),
        }),
      );
    }

    const duplicateHeaders = getDuplicateHeaders(matchedSheet.headers);
    if (duplicateHeaders.length > 0) {
      const severity = maxSeverity(
        duplicateHeaders.map(header =>
          requirementInspectionSheet.headers.some(required => headersEquivalent(required, header))
            ? getConfiguredHeaderSeverity(preset, requirementKey, requirementSheet, header)
            : 'warning',
        ),
      );
      issues.push(
        buildIssue({
          severity,
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}存在重复列名`,
          missing: duplicateHeaders.map(header => `${formatSheetName(matchedSheet.name)}表重复出现“${header}”列`),
          impact: '重复列名会让系统按表头定位字段时命中不确定的列，可能导致读取、保存或自动修复写错位置。',
          suggestion: '请保留唯一的业务列名；如果需要额外说明，建议放进表格说明而不是新增同名列。',
          fixable: false,
          fixActions: [],
        }),
      );
    }

    const blankHeaderIndexes = matchedSheet.headers
      .map((header, index) => (normalizeHeaderText(header) ? -1 : index + 1))
      .filter(index => index > 0);
    if (blankHeaderIndexes.length > 0) {
      issues.push(
        buildIssue({
          severity: 'warning',
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}存在空白列名`,
          missing: blankHeaderIndexes.map(index => `${formatSheetName(matchedSheet.name)}表第 ${index} 列为空白列名`),
          impact: '空白列名无法稳定映射到 DDL、表格说明或自动改表字段。',
          suggestion: '请删除空白列，或为它填写明确且唯一的业务列名。',
          fixable: false,
          fixActions: [],
        }),
      );
    }

    const rowShape = getSheetRowShape(matchedSheet.raw);
    const rowShapeMissing = buildRowShapeMissing(rowShape);
    if (rowShapeMissing.length > 0) {
      const onlyShortRows = rowShape.shortRows > 0 && rowShape.longRows === 0 && rowShape.nonArrayRows === 0;
      issues.push(
        buildIssue({
          severity: 'warning',
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}存在行列数不一致`,
          missing: rowShapeMissing,
          impact: '数据行长度和表头不一致时，数据库插件或自动改表逻辑可能把后续单元格映射到错误列。',
          suggestion: onlyShortRows
            ? '可以为较短的数据行补齐空单元格；较长行需要手动确认多出来的内容应归属哪一列。'
            : '请手动确认较长行或非数组行，避免删除或移动真实数据。',
          fixable: onlyShortRows,
          fixActions: onlyShortRows ? [`为${formatSheetName(matchedSheet.name)}表的短数据行补齐空单元格`] : [],
        }),
      );
    }

    const targetSource = matchedSheet.sourceData;
    const requirementSource = requirementInspectionSheet.sourceData;
    const requirementDdl = requirementSource.ddl;
    const targetDdl = targetSource.ddl;
    const rawSourceData = matchedSheet.raw.sourceData;
    const hasInvalidSourceData = hasOwn(matchedSheet.raw, 'sourceData') && !isRecord(rawSourceData);
    if (hasInvalidSourceData) {
      issues.push(
        buildIssue({
          severity: 'error',
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}的模板资源结构无效`,
          missing: [`${formatSheetName(matchedSheet.name)}表的 sourceData 必须是对象`],
          impact: 'sourceData 不是对象时，建表说明和表格规则无法可靠读取；直接自动修复会丢弃原始内容。',
          suggestion: '请先手动把 sourceData 修成对象，或确认旧内容可以废弃后再重新导入标准表格模板。',
          fixable: false,
          fixActions: [],
        }),
      );
    }
    if (!hasInvalidSourceData && requirementDdl) {
      const configuredDdlSeverity = getConfiguredDdlSeverity(preset, requirementKey, requirementSheet);
      if (!targetDdl) {
        issues.push(
          buildIssue({
            severity: configuredDdlSeverity,
            groupName: matchedSheet.name,
            title: `${formatSheetName(matchedSheet.name)}缺少建表说明`,
            missing: [`${formatSheetName(matchedSheet.name)}表缺少建表说明`],
            impact: '缺少建表说明时，系统无法稳定识别每一列的内部名称、别名和取值限制，保存或渲染时可能出错。',
            suggestion: '可以补入模板检验预设里的建表说明；已有表头和已有数据不会被改动。',
            fixable: true,
            fixActions: [`为${formatSheetName(matchedSheet.name)}表补入建表说明`],
          }),
        );
      } else {
        const missingDdlHeaders = requirementInspectionSheet.headers.filter(
          header =>
            !isRowIdHeader(header) &&
            hasDdlColumnForHeader(requirementDdl, header) &&
            !hasDdlColumnForHeader(targetDdl, header) &&
            !hasDdlSqlNameForRequirementHeader(targetDdl, requirementDdl, header),
        );
        if (missingDdlHeaders.length > 0) {
          const canAppendDdl = /\n\s*\)\s*;\s*$/.test(String(targetDdl || '')) && parseDdlColumns(targetDdl).length > 0;
          const severity = maxSeverity([
            configuredDdlSeverity,
            ...missingDdlHeaders.map(header =>
              getConfiguredHeaderSeverity(preset, requirementKey, requirementSheet, header),
            ),
          ]);
          issues.push(
            buildIssue({
              severity: canAppendDdl ? severity : 'error',
              groupName: matchedSheet.name,
              title: `${formatSheetName(matchedSheet.name)}的建表说明缺少新增列`,
              missing: missingDdlHeaders.map(header => `${formatSheetName(matchedSheet.name)}的建表说明缺少“${header}”列`),
              impact: '表头里有这列，但建表说明里没有对应定义时，保存、读取和渲染可能对不上。',
              suggestion: canAppendDdl
                ? '可以把缺少的列定义追加到建表说明末尾。'
                : '当前建表说明格式不完整，系统无法判断安全追加位置，需要手动修好后再补列。',
              fixable: canAppendDdl,
              fixActions: canAppendDdl
                ? missingDdlHeaders.map(header => `在${formatSheetName(matchedSheet.name)}的建表说明中追加“${header}”定义`)
                : [],
            }),
          );
        }
        const ddlStructureProblems = getDdlStructureProblems(targetDdl, requirementDdl);
        if (ddlStructureProblems.length > 0) {
          issues.push(
            buildIssue({
              severity: maxSeverity([
                configuredDdlSeverity,
                getConfiguredSheetSeverity(preset, requirementKey, requirementSheet),
              ]),
              groupName: matchedSheet.name,
              title: `${formatSheetName(matchedSheet.name)}的建表说明格式异常`,
              missing: ddlStructureProblems.map(problem => `${formatSheetName(matchedSheet.name)}${problem}`),
              impact: '建表说明结构异常时，系统可能解析到错误表、错误列，或在数据库插件执行时失败。',
              suggestion: '请手动修正建表说明，确保只有一个完整的 CREATE TABLE，表名和默认模板一致，且闭合括号前没有尾随逗号。',
              fixable: false,
              fixActions: [],
            }),
          );
        }

        const ddlCompatibilityProblems = getDdlColumnCompatibilityProblems(
          targetDdl,
          requirementDdl,
          requirementInspectionSheet.headers,
        );
        if (ddlCompatibilityProblems.length > 0) {
          const severity = maxSeverity([
            configuredDdlSeverity,
            ...requirementInspectionSheet.headers.map(header =>
              getConfiguredHeaderSeverity(preset, requirementKey, requirementSheet, header),
            ),
          ]);
          issues.push(
            buildIssue({
              severity,
              groupName: matchedSheet.name,
              title: `${formatSheetName(matchedSheet.name)}的建表说明与默认列定义不一致`,
              missing: ddlCompatibilityProblems.map(problem => `${formatSheetName(matchedSheet.name)}${problem}`),
              impact: '表头看起来正确但内部 SQL 列名、类型或约束漂移时，保存、渲染和示例 SQL 可能写向错误字段。',
              suggestion: '请按当前默认模板核对这些列的 SQL 名称、类型、NOT NULL、CHECK 和 UNIQUE 等约束；这类语义漂移需要人工确认。',
              fixable: false,
              fixActions: [],
            }),
          );
        }
      }
    }

    if (!hasInvalidSourceData) SOURCE_TEXT_FIELDS.forEach(field => {
      const requirementText = requirementSource[field];
      if (!requirementText) return;
      const fieldLabel = getSourceTextFieldLabel(field);
      const severity = getConfiguredSourceFieldSeverity(preset, requirementKey, requirementSheet, field);
      const targetText = targetSource[field];
      if (hasOwn(targetSource, field) && targetText !== null && targetText !== '' && typeof targetText !== 'string') {
        issues.push(
          buildIssue({
            severity,
            groupName: matchedSheet.name,
            title: `${formatSheetName(matchedSheet.name)}的${fieldLabel}不是文本`,
            missing: [`${formatSheetName(matchedSheet.name)}表的${fieldLabel}必须是文本内容`],
            impact: '非文本说明会被浏览器或数据库插件隐式转成字符串，可能导致列说明、规则标记或 SQL 示例误判。',
            suggestion: '可以从模板检验预设补入标准文本；如需保留旧内容，请先手动改成普通文本。',
            fixable: true,
            fixActions: [`为${formatSheetName(matchedSheet.name)}表补入${fieldLabel}`],
          }),
        );
        return;
      }
      if (!targetText) {
        issues.push(
          buildIssue({
            severity,
            groupName: matchedSheet.name,
            title: `${formatSheetName(matchedSheet.name)}缺少${fieldLabel}`,
            missing: [`${formatSheetName(matchedSheet.name)}表缺少${fieldLabel}`],
            impact: field === 'note' ? '自动填表时缺少这张表的列说明和填写约束。' : '自动改表时缺少对应规则，可能填错列或漏填内容。',
            suggestion: '可以从模板检验预设补入这段说明。',
            fixable: true,
            fixActions: [`为${formatSheetName(matchedSheet.name)}表补入${fieldLabel}`],
          }),
        );
        return;
      }
      const sourceMissingHeaders = getSourceFieldMissingHeaders(
        targetSource,
        requirementSource,
        field,
        requirementInspectionSheet.headers.filter(header => !isRowIdHeader(header)),
      );
      if (sourceMissingHeaders.length > 0) {
        issues.push(
          buildIssue({
            severity,
            groupName: matchedSheet.name,
            title: `${formatSheetName(matchedSheet.name)}的${fieldLabel}缺少新增列说明`,
            missing: sourceMissingHeaders.map(header => `${formatSheetName(matchedSheet.name)}的${fieldLabel}缺少“${header}”说明`),
            impact: field === 'note' ? '自动填表可能不知道新增列的含义、位置或取值限制。' : '自动改表时可能仍按旧列清单处理，导致新增列漏写。',
            suggestion: field === 'deleteNode' ? '只有删除规则会用到新增列时才需要补充；一般可以先手动确认。' : '可以在原说明末尾追加新增列说明和新版写入示例。',
            fixable: field !== 'deleteNode',
            fixActions:
              field === 'deleteNode'
                ? []
                : sourceMissingHeaders.map(header => `在${formatSheetName(matchedSheet.name)}的${fieldLabel}里追加“${header}”说明`),
          }),
        );
      }
      const sourceTagProblems = getSourceTextTagProblems(targetText, requirementText);
      if (sourceTagProblems.length > 0) {
        issues.push(
          buildIssue({
            severity,
            groupName: matchedSheet.name,
            title: `${formatSheetName(matchedSheet.name)}的${fieldLabel}规则标记不完整`,
            missing: sourceTagProblems.map(problem => `${formatSheetName(matchedSheet.name)}的${fieldLabel}${problem}`),
            impact: '规则标记缺失、重复或未闭合时，属性规则和检定规则同步可能只更新一部分文本，导致 AI 使用过期规则。',
            suggestion: '请手动整理规则块，确保每类规则只有一对完整的开始和结束标记。',
            fixable: false,
            fixActions: [],
          }),
        );
      }
      const sourceNoiseProblems = getSourceTextNoiseProblems(targetText);
      if (sourceNoiseProblems.length > 0) {
        issues.push(
          buildIssue({
            severity: 'warning',
            groupName: matchedSheet.name,
            title: `${formatSheetName(matchedSheet.name)}的${fieldLabel}包含异常噪音`,
            missing: sourceNoiseProblems.map(problem => `${formatSheetName(matchedSheet.name)}的${fieldLabel}${problem}`),
            impact: '过长文本或疑似脚本片段会增加提示词注入、渲染转义和人工维护风险。',
            suggestion: '请压缩说明文本，并移除脚本标签、事件属性或 javascript: 链接等内容。',
            fixable: false,
            fixActions: [],
          }),
        );
      }
    });

    CONFIG_FIELDS.forEach(field => {
      const missingPaths = collectMissingObjectPaths(matchedSheet.raw[field], requirementSheet[field], field);
      if (missingPaths.length === 0) return;
      const fieldLabel = getConfigFieldLabel(field);
      issues.push(
        buildIssue({
          severity: getConfiguredConfigSeverity(preset, requirementKey, requirementSheet),
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}缺少${fieldLabel}`,
          missing: [`${formatSheetName(matchedSheet.name)}表的${fieldLabel}不完整`],
          impact: '缺少这类设置时，数据库插件可能无法按默认方式更新、导出或注入模板内容。',
          suggestion: '可以只补齐缺失设置，不覆盖已有设置。',
          fixable: true,
          fixActions: [`补齐${formatSheetName(matchedSheet.name)}表的${fieldLabel}`],
        }),
      );
    });
  });

  const missingMatePaths = collectMissingObjectPaths(
    isRecord(template) ? template.mate : undefined,
    isRecord(preset.template) ? preset.template.mate : undefined,
    'mate',
  );
  if (missingMatePaths.length > 0) {
    issues.push(
      buildIssue({
        severity: getConfiguredMateSeverity(preset),
        groupName: '模板全局配置',
        title: '缺少模板全局设置',
        missing: ['模板全局设置不完整'],
        impact: '模板作用范围、插入位置或默认行为可能不完整。',
        suggestion: '可以只补齐缺失的全局设置，不覆盖已有设置。',
        fixable: true,
        fixActions: ['补齐模板全局设置'],
      }),
    );
  }

  return {
    presetId: preset.id,
    presetName: preset.name,
    sheets: targetSheets,
    issues,
    fixableCount: issues.filter(issue => issue.fixable).length,
    manualCount: issues.filter(issue => !issue.fixable).length,
    checkedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
  };
};

const uniqueSheetKey = (template: TemplateRecord, baseKey: string): string => {
  if (!Object.prototype.hasOwnProperty.call(template, baseKey)) return baseKey;
  for (let index = 2; index < 1000; index += 1) {
    const candidate = `${baseKey}_${index}`;
    if (!Object.prototype.hasOwnProperty.call(template, candidate)) return candidate;
  }
  return `${baseKey}_${Date.now()}`;
};

const getNextOrderNo = (template: TemplateRecord): number => {
  const orders = getTemplateSheetEntries(template)
    .map(entry => Number(entry.sheet[TEMPLATE_ORDER_FIELD]))
    .filter(value => Number.isFinite(value));
  return orders.length > 0 ? Math.max(...orders) + 1 : getTemplateSheetEntries(template).length + 1;
};

const appendMissingHeadersToSheet = (sheet: Record<string, unknown>, missingHeaders: string[]): void => {
  const content = ensureSheetContent(sheet);
  const headerRow = content[0];
  missingHeaders.forEach(header => headerRow.push(header));
  for (let rowIndex = 1; rowIndex < content.length; rowIndex += 1) {
    const row = content[rowIndex];
    if (!Array.isArray(row)) continue;
    missingHeaders.forEach(() => row.push(''));
  }
};

const appendDdlColumns = (ddl: string, definitions: string[]): string | null => {
  const cleaned = definitions.map(definition => formatDdlColumnDefinition(definition, false)).filter(Boolean);
  if (cleaned.length === 0) return ddl;
  const match = ddl.match(/\n\s*\)\s*;\s*(?:\/\*[\s\S]*?\*\/\s*)*$/);
  if (!match || match.index === undefined) return null;
  const before = ddl.slice(0, match.index).replace(/\s+$/, '');
  const after = ddl.slice(match.index);
  const beforeWithSeparator = appendCommaToLastDdlColumnLine(before);
  const addition = cleaned
    .map((definition, index) => `  ${formatDdlColumnDefinition(definition, index < cleaned.length - 1)}`)
    .join('\n');
  return `${beforeWithSeparator}\n${addition}${after}`;
};

const mergeMissingObjectKeys = (target: unknown, requirement: unknown): unknown => {
  if (!isRecord(requirement)) return target;
  const out = isRecord(target) ? (target as Record<string, unknown>) : {};
  Object.keys(requirement).forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(out, key)) {
      out[key] = cloneTemplateValue(requirement[key]);
      return;
    }
    if (isRecord(out[key]) && isRecord(requirement[key])) {
      out[key] = mergeMissingObjectKeys(out[key], requirement[key]);
    }
  });
  return out;
};

const buildHeaderSqlNameMap = (
  headers: string[],
  targetDdl: unknown,
  requirementDdl: unknown,
): Record<string, string> => {
  const map: Record<string, string> = {};
  headers.forEach(header => {
    const targetColumn = getDdlColumnForHeader(targetDdl, header);
    const requirementColumn = getDdlColumnForHeader(requirementDdl, header);
    map[header] = targetColumn?.sqlName || requirementColumn?.sqlName || (isRowIdHeader(header) ? 'row_id' : header);
  });
  return map;
};

const getExampleValueForHeader = (header: string): string => {
  if (isRowIdHeader(header)) return '(SELECT COALESCE(MAX(row_id), 0) + 1 FROM {table})';
  if (normalizeHeaderText(header).includes('数量')) return '1';
  if (normalizeHeaderText(header).includes('年龄')) return '18';
  return `'${header}'`;
};

const buildInsertSqlExample = (tableName: string, headers: string[], sqlNameMap: Record<string, string>): string => {
  const columns = headers.map(header => sqlNameMap[header] || header);
  const values = headers.map(header => getExampleValueForHeader(header).replace('{table}', tableName));
  return `SQL示例（追加列后）: INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`;
};

const buildUpdateSqlExample = (tableName: string, headers: string[], sqlNameMap: Record<string, string>): string => {
  const businessHeaders = headers.filter(header => !isRowIdHeader(header));
  const keyHeader = businessHeaders[0] || headers[0] || 'row_id';
  const updateHeaders = businessHeaders.slice(1);
  const setClause = updateHeaders.map(header => `${sqlNameMap[header] || header} = '${header}'`).join(', ');
  return `SQL示例（追加列后）: UPDATE ${tableName} SET ${setClause || `${sqlNameMap[keyHeader] || keyHeader} = '${keyHeader}'`} WHERE ${sqlNameMap[keyHeader] || keyHeader} = '${keyHeader}';`;
};

const buildNoteColumnAppendix = (
  missingHeaders: string[],
  finalHeaders: string[],
  requirementDdl: unknown,
): string => {
  const lines = missingHeaders.map(header => {
    const column = getDdlColumnForHeader(requirementDdl, header);
    const index = finalHeaders.findIndex(item => headersEquivalent(item, header));
    const definition = column?.definition
      ? column.definition
          .replace(/^\s*[A-Za-z_][A-Za-z0-9_]*\b/, '')
          .replace(/--.*$/, '')
          .trim()
      : '';
    const physical = column?.sqlName ? ` ${column.sqlName}` : '';
    const constraint = definition ? `（${definition}）` : '';
    return `列${index + 1}=${header}${physical}${constraint}`;
  });
  return lines.length > 0 ? `【新增列定义】\n${lines.join('\n')}` : '';
};

const buildSourceFieldAppendix = (
  field: string,
  missingHeaders: string[],
  finalHeaders: string[],
  tableName: string,
  targetDdl: unknown,
  requirementDdl: unknown,
): string => {
  if (field === 'note') return buildNoteColumnAppendix(missingHeaders, finalHeaders, requirementDdl);
  if (field === 'deleteNode') return '';
  const sqlNameMap = buildHeaderSqlNameMap(finalHeaders, targetDdl, requirementDdl);
  const columnSummary = `完整列清单（追加列后）: ${finalHeaders.map((header, index) => `列${index + 1}=${header}`).join('；')}`;
  const sqlExample =
    field === 'updateNode'
      ? buildUpdateSqlExample(tableName, finalHeaders, sqlNameMap)
      : buildInsertSqlExample(tableName, finalHeaders, sqlNameMap);
  return `${columnSummary}\n${sqlExample}`;
};

const appendTextIfMissing = (current: unknown, addition: string): string => {
  const currentText = String(current || '').trim();
  const additionText = String(addition || '').trim();
  if (!additionText) return currentText;
  if (currentText.includes(additionText)) return currentText;
  return currentText ? `${currentText}\n\n${additionText}` : additionText;
};

const formatResidualManualIssue = (issue: TemplateInspectionIssue): string =>
  `${issue.title}${issue.missing.length > 0 ? `：${issue.missing.join('；')}` : ''}`;

const pushUniqueManualIssue = (manualIssues: string[], issue: string): void => {
  if (!manualIssues.some(existing => existing.includes(issue) || issue.includes(existing))) {
    manualIssues.push(issue);
  }
};

const sanitizeAddedSheet = (sheet: Record<string, unknown>): Record<string, unknown> => {
  const cloned = cloneTemplateValue(sheet);
  const content = Array.isArray(cloned.content) ? cloned.content : [];
  const headerRow = Array.isArray(content[0]) ? cloneTemplateValue(content[0]) : ['row_id'];
  cloned.content = [headerRow];
  return cloned;
};

export const buildTableTemplateAppendRepairPlan = (
  template: unknown,
  preset: TableTemplateRequirementPreset,
): TableTemplateRepairPlan => {
  if (!isRecord(template)) {
    return {
      changed: false,
      repairedTemplate: null,
      actions: [],
      manualIssues: ['当前聊天模板不是有效对象，无法智能修复。'],
    };
  }

  const repairedTemplate = cloneTemplateValue(template) as TemplateRecord;
  const actions: string[] = [];
  const manualIssues: string[] = [];

  getTemplateSheetEntries(preset.template).forEach(({ key: requirementKey, sheet: requirementSheet }) => {
    const matchResult = findMatchingSheetMatch(repairedTemplate, requirementKey, requirementSheet);
    if (matchResult.ambiguous) {
      manualIssues.push(
        `${formatSheetName(toSafeString(requirementSheet.name || requirementKey))}匹配到多个候选表：${matchResult.reasons.join('；')}，请手动确认要修复哪一张表。`,
      );
      return;
    }
    let matchedEntry = matchResult.entry;
    const requirementHeaders = getSheetHeaders(requirementSheet);
    const requirementSource = isRecord(requirementSheet.sourceData) ? (requirementSheet.sourceData as Record<string, unknown>) : {};

    if (!matchedEntry) {
      const key = uniqueSheetKey(repairedTemplate, requirementKey);
      const newSheet = sanitizeAddedSheet(requirementSheet);
      newSheet[TEMPLATE_ORDER_FIELD] = getNextOrderNo(repairedTemplate);
      repairedTemplate[key] = newSheet;
      actions.push(`追加${formatSheetName(toSafeString(requirementSheet.name || key))}表`);
      matchedEntry = { key, sheet: newSheet };
    }

    const targetSheet = matchedEntry.sheet;
    const contentProblems = getSheetContentProblems(targetSheet);
    if (contentProblems.length > 0) {
      manualIssues.push(
        `${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的表格内容结构无效：${contentProblems.join('；')}。请先手动修成二维数组，避免自动修复丢失旧内容。`,
      );
      return;
    }

    const rawSourceData = targetSheet.sourceData;
    if (hasOwn(targetSheet, 'sourceData') && !isRecord(rawSourceData)) {
      manualIssues.push(
        `${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的 sourceData 不是对象，无法在不丢弃旧内容的情况下自动修复。`,
      );
      return;
    }

    const sourceData = getSheetSourceData(targetSheet);
    const requirementDdl = requirementSource.ddl;
    const targetDdl = sourceData.ddl;
    const ddlStructureProblems = requirementDdl && targetDdl ? getDdlStructureProblems(targetDdl, requirementDdl) : [];
    if (ddlStructureProblems.length > 0) {
      manualIssues.push(
        `${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的建表说明存在结构异常：${ddlStructureProblems.join('；')}。请先手动修正后再自动修复。`,
      );
      return;
    }

    const targetHeaders = getSheetHeaders(targetSheet);
    const missingHeaders = getMissingHeaders(targetHeaders, requirementHeaders);
    const appendableMissingHeaders = missingHeaders.filter(header => !isRowIdHeader(header));
    if (missingHeaders.some(header => isRowIdHeader(header))) {
      manualIssues.push(`${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}缺少行号首列，需要手动把“行号”放在第一列。`);
    }

    if (appendableMissingHeaders.length > 0) {
      appendMissingHeadersToSheet(targetSheet, appendableMissingHeaders);
      actions.push(`为${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}表追加列：${appendableMissingHeaders.join('、')}`);
    }

    const paddedRows = padShortRowsToHeaderLength(targetSheet);
    if (paddedRows > 0) {
      actions.push(`为${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}表补齐 ${paddedRows} 行短数据行`);
    }
    const rowShape = getSheetRowShape(targetSheet);
    if (rowShape.longRows > 0 || rowShape.nonArrayRows > 0) {
      manualIssues.push(
        `${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}存在数据行结构异常：${buildRowShapeMissing(rowShape).join('；')}。`,
      );
    }

    const finalHeaders = getSheetHeaders(targetSheet);
    const tableName =
      parseDdlTableName(targetDdl) ||
      parseDdlTableName(requirementDdl) ||
      toSafeString(targetSheet.name || requirementSheet.name || matchedEntry.key);

    if (requirementDdl && !sourceData.ddl) {
      sourceData.ddl = cloneTemplateValue(requirementDdl);
      actions.push(`为${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}表补入建表说明`);
    } else if (requirementDdl && sourceData.ddl) {
      const ddlMissingHeaders = requirementHeaders.filter(
        header =>
          !isRowIdHeader(header) &&
          Boolean(getDdlColumnForHeader(requirementDdl, header)) &&
          !hasDdlColumnForHeader(sourceData.ddl, header) &&
          !hasDdlSqlNameForRequirementHeader(sourceData.ddl, requirementDdl, header),
      );
      const ddlIncompatibleHeaders = requirementHeaders.filter(
        header =>
          !isRowIdHeader(header) &&
          Boolean(getDdlColumnForHeader(requirementDdl, header)) &&
          !hasDdlColumnForHeader(sourceData.ddl, header) &&
          hasDdlSqlNameForRequirementHeader(sourceData.ddl, requirementDdl, header),
      );
      if (ddlIncompatibleHeaders.length > 0) {
        manualIssues.push(
          `${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的建表说明中存在同 SQL 列名但注释或定义不兼容的列：${ddlIncompatibleHeaders.join('、')}。请手动确认，避免自动追加重复 SQL 列。`,
        );
      }
      const ddlDefinitions = ddlMissingHeaders
        .map(header => getDdlColumnForHeader(requirementDdl, header)?.definition || '')
        .filter(Boolean);
      if (ddlDefinitions.length > 0) {
        const nextDdl = appendDdlColumns(String(sourceData.ddl), ddlDefinitions);
        if (nextDdl) {
          sourceData.ddl = nextDdl;
          actions.push(`为${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的建表说明追加列：${ddlMissingHeaders.join('、')}`);
        } else {
          manualIssues.push(`${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的建表说明格式不完整，无法自动追加列。`);
        }
      }
    }

    SOURCE_TEXT_FIELDS.forEach(field => {
      const requirementText = requirementSource[field];
      if (!requirementText) return;
      const fieldLabel = getSourceTextFieldLabel(field);
      if (hasOwn(sourceData, field) && sourceData[field] !== null && sourceData[field] !== '' && typeof sourceData[field] !== 'string') {
        sourceData[field] = cloneTemplateValue(requirementText);
        actions.push(`为${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}表修正${fieldLabel}为文本`);
        return;
      }
      if (!sourceData[field]) {
        sourceData[field] = cloneTemplateValue(requirementText);
        actions.push(`为${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}表补入${fieldLabel}`);
        return;
      }
      const sourceMissingHeaders = getSourceFieldMissingHeaders(
        sourceData,
        requirementSource,
        field,
        requirementHeaders.filter(header => !isRowIdHeader(header)),
      );
      if (sourceMissingHeaders.length === 0) return;
      const appendix = buildSourceFieldAppendix(
        field,
        sourceMissingHeaders,
        finalHeaders,
        tableName,
        sourceData.ddl,
        requirementDdl,
      );
      if (!appendix) return;
      sourceData[field] = appendTextIfMissing(sourceData[field], appendix);
      actions.push(`在${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的${fieldLabel}里追加列说明：${sourceMissingHeaders.join('、')}`);
    });

    CONFIG_FIELDS.forEach(field => {
      const missingPaths = collectMissingObjectPaths(targetSheet[field], requirementSheet[field], field);
      if (missingPaths.length === 0) return;
      targetSheet[field] = mergeMissingObjectKeys(targetSheet[field], requirementSheet[field]);
      actions.push(`补齐${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}表的${getConfigFieldLabel(field)}`);
    });
  });

  const missingMatePaths = collectMissingObjectPaths(repairedTemplate.mate, preset.template.mate, 'mate');
  if (missingMatePaths.length > 0) {
    repairedTemplate.mate = mergeMissingObjectKeys(repairedTemplate.mate, preset.template.mate);
    actions.push('补齐模板全局设置');
  }

  inspectTableTemplateWithPreset(repairedTemplate, preset).issues.forEach(issue => {
    pushUniqueManualIssue(manualIssues, `修复后仍需手动处理：${formatResidualManualIssue(issue)}`);
  });

  return {
    changed: actions.length > 0,
    repairedTemplate,
    actions,
    manualIssues,
  };
};
