/**
 * wiring / crud-wiring.ts — CRUD/表格读写装配簇（从 index.ts 迁出，x4-c）。
 */
import { createRelocateDbPayloadToAnchor } from '../features/console/relocate-db-payload-to-anchor';
import { createAddCrudColumnAlias } from '../features/table/add-crud-column-alias';
import { createAssertCrudEnumConstraints } from '../features/table/assert-crud-enum-constraints';
import { createAssertCrudJsonFallbackAllowed } from '../features/table/assert-crud-json-fallback-allowed';
import { createAssertCrudLengthConstraints } from '../features/table/assert-crud-length-constraints';
import { createAssertCrudRequiredCellValues } from '../features/table/assert-crud-required-cell-values';
import { createAssertCrudRequiredColumnsRepresented } from '../features/table/assert-crud-required-columns-represented';
import { createAssertRuntimeCrudApi } from '../features/table/assert-runtime-crud-api';
import { createBuildCrudEnumConstraintMap } from '../features/table/build-crud-enum-constraint-map';
import { createBuildCrudLengthConstraintMap } from '../features/table/build-crud-length-constraint-map';
import { createBuildCrudRequiredHeaderSet } from '../features/table/build-crud-required-header-set';
import { createBuildRowDataForCrud } from '../features/table/build-row-data-for-crud';
import { createCrudSqlIdentifierPattern } from '../features/table/crud-sql-identifier-pattern';
import { createDecodeCrudSqlIdentifier } from '../features/table/decode-crud-sql-identifier';
import { createFindLatestDbMessageIndex } from '../features/table/find-latest-db-message-index';
import { createGetCrudCellValueForWrite } from '../features/table/get-crud-cell-value-for-write';
import { createGetCrudChangedColumns } from '../features/table/get-crud-changed-columns';
import { createGetCrudColumnNameForHeader } from '../features/table/get-crud-column-name-for-header';
import { createGetCrudRequiredColumnsByHeaderIndex } from '../features/table/get-crud-required-columns-by-header-index';
import { createGetCrudSheetDdl } from '../features/table/get-crud-sheet-ddl';
import { createGetCrudSqlCommentAliases } from '../features/table/get-crud-sql-comment-aliases';
import { createGetCrudSqlTableName } from '../features/table/get-crud-sql-table-name';
import { createGetCrudTableIdentifier } from '../features/table/get-crud-table-identifier';
import { createGetCrudUnsupportedFallbackConstraintText } from '../features/table/get-crud-unsupported-fallback-constraint-text';
import { createGetDbChatMessages } from '../features/table/get-db-chat-messages';
import { createGetStableRowKeyForCrud } from '../features/table/get-stable-row-key-for-crud';
import { createHasDbPayload } from '../features/table/has-db-payload';
import { createHasSheetKeys } from '../features/table/has-sheet-keys';
import { createIsCrudNullableEnumEmptyValue } from '../features/table/is-crud-nullable-enum-empty-value';
import { createIsCrudRowIdMissing } from '../features/table/is-crud-row-id-missing';
import { createNormalizeCrudHeaderLookupKey } from '../features/table/normalize-crud-header-lookup-key';
import { createNormalizeCrudSqlComment } from '../features/table/normalize-crud-sql-comment';
import { normalizeDiffHeader } from '../features/table/normalize-diff-text';
import { createNormalizeSheetKeys } from '../features/table/normalize-sheet-keys';
import { createParseCrudColumnDefinitionLine } from '../features/table/parse-crud-column-definition-line';
import { createParseIsolatedData } from '../features/table/parse-isolated-data';
import { createResolveIsolationKey } from '../features/table/resolve-isolation-key';
import { createSameHeaders } from '../features/table/same-headers';
import { createSameRow } from '../features/table/same-row';
import { createShouldInferCrudRowIdFromVisibleIndex } from '../features/table/should-infer-crud-row-id-from-visible-index';
import { createStripCrudSqlNonStructuralComments } from '../features/table/strip-crud-sql-non-structural-comments';
import { createParseSqlQuotedValues } from '../shared/parse-sql-quoted-values';
import { createStripCrudSqlBlockComments } from '../shared/strip-crud-sql-block-comments';
import { createStripCrudSqlComments } from '../shared/strip-crud-sql-comments';

export function createCrudWiring(deps: any) {
  const { asDiffRecord, buildCrudColumnAliasMap, countUnicodeCharacters, getCore, hasRuntimeTableReadApi, normalizeDiffText } = deps;
  const getDbChatMessages = createGetDbChatMessages({

  });

  const parseIsolatedData = createParseIsolatedData({

  });

  const hasSheetKeys = createHasSheetKeys({

  });

  const hasDbPayload = createHasDbPayload({
    hasSheetKeys: (...a: any[]) => hasSheetKeys(...a),
    parseIsolatedData: (...a: any[]) => parseIsolatedData(...a),
  });

  const findLatestDbMessageIndex = createFindLatestDbMessageIndex({
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    hasDbPayload: (...a: any[]) => hasDbPayload(...a),
  });

  const resolveIsolationKey = createResolveIsolationKey({

  });

  const relocateDbPayloadToAnchor = createRelocateDbPayloadToAnchor({
    findLatestDbMessageIndex: (...a: any[]) => findLatestDbMessageIndex(...a),
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    hasDbPayload: (...a: any[]) => hasDbPayload(...a),
    parseIsolatedData: (...a: any[]) => parseIsolatedData(...a),
    resolveIsolationKey: (...a: any[]) => resolveIsolationKey(...a),
  });

  const normalizeSheetKeys = createNormalizeSheetKeys({

  });

  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  const assertRuntimeCrudApi = createAssertRuntimeCrudApi({
    getCore: (...a: any[]) => getCore(...a),
    hasRuntimeTableReadApi: (...a: any[]) => hasRuntimeTableReadApi(...a),
  });

  const getSheetRows = sheet => (Array.isArray(sheet?.content) ? sheet.content.slice(1) : []);
  const getSheetHeaders = sheet => (Array.isArray(sheet?.content?.[0]) ? sheet.content[0] : []);
  const sameRow = createSameRow({
  });
  const sameHeaders = createSameHeaders({
    getSheetHeaders: (...a: any[]) => getSheetHeaders(...a),
  });
  const getStableRowKeyForCrud = createGetStableRowKeyForCrud({

  });

  const getCrudSheetDdl = createGetCrudSheetDdl({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
  });

  const stripCrudSqlComments = createStripCrudSqlComments({

  });

  const stripCrudSqlBlockComments = createStripCrudSqlBlockComments({

  });

  const stripCrudSqlNonStructuralComments = createStripCrudSqlNonStructuralComments({
    stripCrudSqlBlockComments: (...a: any[]) => stripCrudSqlBlockComments(...a),
  });

  const CRUD_SQL_IDENTIFIER_PATTERN = createCrudSqlIdentifierPattern({

  });

  const decodeCrudSqlIdentifier = createDecodeCrudSqlIdentifier({

  });

  const normalizeCrudHeaderLookupKey = createNormalizeCrudHeaderLookupKey({
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const normalizeCrudSqlComment = createNormalizeCrudSqlComment({

  });

  const getCrudSqlCommentAliases = createGetCrudSqlCommentAliases({
    normalizeCrudSqlComment: (...a: any[]) => normalizeCrudSqlComment(...a),
  });

  const addCrudColumnAlias = createAddCrudColumnAlias({
    normalizeCrudHeaderLookupKey: (...a: any[]) => normalizeCrudHeaderLookupKey(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const getCrudColumnNameForHeader = createGetCrudColumnNameForHeader({
    normalizeCrudHeaderLookupKey: (...a: any[]) => normalizeCrudHeaderLookupKey(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const parseCrudColumnDefinitionLine = createParseCrudColumnDefinitionLine({

    getCRUD_SQL_IDENTIFIER_PATTERN: () => CRUD_SQL_IDENTIFIER_PATTERN,
    decodeCrudSqlIdentifier: (...a: any[]) => decodeCrudSqlIdentifier(...a),
    normalizeCrudSqlComment: (...a: any[]) => normalizeCrudSqlComment(...a),
  });

  const getCrudSqlTableName = createGetCrudSqlTableName({
    decodeCrudSqlIdentifier: (...a: any[]) => decodeCrudSqlIdentifier(...a),
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
    stripCrudSqlComments: (...a: any[]) => stripCrudSqlComments(...a),
    getCRUD_SQL_IDENTIFIER_PATTERN: () => CRUD_SQL_IDENTIFIER_PATTERN,
  });

  const getCrudTableIdentifier = createGetCrudTableIdentifier({
    getCrudSqlTableName: (...a: any[]) => getCrudSqlTableName(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const parseSqlQuotedValues = createParseSqlQuotedValues({

  });

  type RuntimeCrudEnumConstraint = {
    values: string[];
    nullable: boolean;
  };

  const buildCrudEnumConstraintMap = createBuildCrudEnumConstraintMap({
    decodeCrudSqlIdentifier: (...a: any[]) => decodeCrudSqlIdentifier(...a),
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    parseSqlQuotedValues: (...a: any[]) => parseSqlQuotedValues(...a),
    stripCrudSqlComments: (...a: any[]) => stripCrudSqlComments(...a),
    CRUD_SQL_IDENTIFIER_PATTERN: CRUD_SQL_IDENTIFIER_PATTERN,
  });

  const isCrudNullableEnumEmptyValue = createIsCrudNullableEnumEmptyValue({

  });

  const assertCrudEnumConstraints = createAssertCrudEnumConstraints({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudEnumConstraintMap: (...a: any[]) => buildCrudEnumConstraintMap(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
    isCrudNullableEnumEmptyValue: (...a: any[]) => isCrudNullableEnumEmptyValue(...a),
  });

  const buildCrudLengthConstraintMap = createBuildCrudLengthConstraintMap({
    decodeCrudSqlIdentifier: (...a: any[]) => decodeCrudSqlIdentifier(...a),
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    stripCrudSqlComments: (...a: any[]) => stripCrudSqlComments(...a),
    CRUD_SQL_IDENTIFIER_PATTERN: CRUD_SQL_IDENTIFIER_PATTERN,
  });

  const getCrudUnsupportedFallbackConstraintText = createGetCrudUnsupportedFallbackConstraintText({
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
    stripCrudSqlComments: (...a: any[]) => stripCrudSqlComments(...a),
    CRUD_SQL_IDENTIFIER_PATTERN: CRUD_SQL_IDENTIFIER_PATTERN,
  });

  const assertCrudJsonFallbackAllowed = createAssertCrudJsonFallbackAllowed({
    getCrudUnsupportedFallbackConstraintText: (...a: any[]) => getCrudUnsupportedFallbackConstraintText(...a),
  });

  const assertCrudLengthConstraints = createAssertCrudLengthConstraints({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudLengthConstraintMap: (...a: any[]) => buildCrudLengthConstraintMap(...a),
    countUnicodeCharacters: (...a: any[]) => countUnicodeCharacters(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
  });

  const buildCrudRequiredHeaderSet = createBuildCrudRequiredHeaderSet({
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    parseCrudColumnDefinitionLine: (...a: any[]) => parseCrudColumnDefinitionLine(...a),
    stripCrudSqlNonStructuralComments: (...a: any[]) => stripCrudSqlNonStructuralComments(...a),
  });

  const assertCrudRequiredColumnsRepresented = createAssertCrudRequiredColumnsRepresented({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudRequiredHeaderSet: (...a: any[]) => buildCrudRequiredHeaderSet(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
    normalizeCrudHeaderLookupKey: (...a: any[]) => normalizeCrudHeaderLookupKey(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const getCrudRequiredColumnsByHeaderIndex = createGetCrudRequiredColumnsByHeaderIndex({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudRequiredHeaderSet: (...a: any[]) => buildCrudRequiredHeaderSet(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const assertCrudRequiredCellValues = createAssertCrudRequiredCellValues({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    getCrudRequiredColumnsByHeaderIndex: (...a: any[]) => getCrudRequiredColumnsByHeaderIndex(...a),
  });

  const getCrudCellValueForWrite = createGetCrudCellValueForWrite({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudEnumConstraintMap: (...a: any[]) => buildCrudEnumConstraintMap(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
    isCrudNullableEnumEmptyValue: (...a: any[]) => isCrudNullableEnumEmptyValue(...a),
  });

  const buildRowDataForCrud = createBuildRowDataForCrud({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudEnumConstraintMap: (...a: any[]) => buildCrudEnumConstraintMap(...a),
    getCrudCellValueForWrite: (...a: any[]) => getCrudCellValueForWrite(...a),
  });

  const getCrudChangedColumns = createGetCrudChangedColumns({

  });

  const isCrudRowIdMissing = createIsCrudRowIdMissing({

  });

  const shouldInferCrudRowIdFromVisibleIndex = createShouldInferCrudRowIdFromVisibleIndex({
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    normalizeDiffHeader: (...a: any[]) => normalizeDiffHeader(...a),
  });

  const inferCrudRowIdForUpdateCell = (input: CrudExistingRowPatchInput): { rowId: unknown; source: string } | null => {
    const candidates: Array<{ rowId: unknown; source: string }> = [
      { rowId: input.currentRow?.[0], source: 'currentRow[0]' },
      { rowId: input.nextRow?.[0], source: 'nextRow[0]' },
    ];
    for (const candidate of candidates) {
      if (!isCrudRowIdMissing(candidate.rowId)) return candidate;
    }
    if (shouldInferCrudRowIdFromVisibleIndex(input)) {
      return { rowId: input.rowIndex + 1, source: 'rowIndex+1' };
    }
    return null;
  };
  return { CRUD_SQL_IDENTIFIER_PATTERN, addCrudColumnAlias, assertCrudEnumConstraints, assertCrudJsonFallbackAllowed, assertCrudLengthConstraints, assertCrudRequiredCellValues, assertCrudRequiredColumnsRepresented, assertRuntimeCrudApi, buildCrudEnumConstraintMap, buildCrudRequiredHeaderSet, buildRowDataForCrud, decodeCrudSqlIdentifier, getCrudCellValueForWrite, getCrudChangedColumns, getCrudColumnNameForHeader, getCrudSheetDdl, getCrudSqlCommentAliases, getCrudSqlTableName, getCrudTableIdentifier, getDbChatMessages, getSheetHeaders, getSheetRows, getStableRowKeyForCrud, hasSheetKeys, inferCrudRowIdForUpdateCell, isCrudRowIdMissing, normalizeSheetKeys, parseCrudColumnDefinitionLine, parseIsolatedData, resolveIsolationKey, sameHeaders, sameRow, shouldInferCrudRowIdFromVisibleIndex, stripCrudSqlComments, stripCrudSqlNonStructuralComments };
}
