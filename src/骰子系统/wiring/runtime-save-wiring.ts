/**
 * wiring / runtime-save-wiring.ts — 运行时数据读写/保存装配簇（从 index.ts 迁出，x4-l）。
 */
import type { TutorialModule } from '../features/tutorial/types';
import type { RuntimeCrudWriteApi } from '../shared/index-local-types';
import { createGenerateDiffMap } from '../features/changes/generate-diff-map';
import { createProcessJsonData } from '../features/dice/process-json-data';
import { createPrepareInventoryTutorial } from '../features/gacha/prepare-inventory-tutorial';
import { createRefreshRegexRulesList } from '../features/regex/refresh-regex-rules-list';
import { createAppendRowInstantly } from '../features/table/append-row-instantly';
import { createApplyExistingRowCellPatchesViaCrud } from '../features/table/apply-existing-row-cell-patches-via-crud';
import { createApplyJsonCellFallbackForCrud } from '../features/table/apply-json-cell-fallback-for-crud';
import { createApplyRuntimeDataViaCrud } from '../features/table/apply-runtime-data-via-crud';
import { createAsDiffRecord } from '../features/table/as-diff-record';
import { createAssertAppendOnlyRows } from '../features/table/assert-append-only-rows';
import { createAssertCrudInsertRequiredCells } from '../features/table/assert-crud-insert-required-cells';
import { createConsumeCrudWriteOptions } from '../features/table/consume-crud-write-options';
import { createCountRuntimeDataChanges } from '../features/table/count-runtime-data-changes';
import { createCreateDiffRowMatcher } from '../features/table/create-diff-row-matcher';
import { createDeleteRowInstantly } from '../features/table/delete-row-instantly';
import { createDiffIdHeaderKeywords } from '../features/table/diff-id-header-keywords';
import { createFindDeletionIndicesForCrud } from '../features/table/find-deletion-indices-for-crud';
import { createFindDiffSnapshotEntry } from '../features/table/find-diff-snapshot-entry';
import { createFindRuntimeSheetEntryForCrud } from '../features/table/find-runtime-sheet-entry-for-crud';
import { createFindRuntimeSheetEntryForMutation } from '../features/table/find-runtime-sheet-entry-for-mutation';
import { createGetDiffDataRow } from '../features/table/get-diff-data-row';
import { createGetDiffHeaders } from '../features/table/get-diff-headers';
import { createGetDiffPreferredColumns } from '../features/table/get-diff-preferred-columns';
import { createGetDiffRowDisplayTitle } from '../features/table/get-diff-row-display-title';
import { createGetDiffRowIdentityKeys } from '../features/table/get-diff-row-identity-keys';
import { createGetDiffRows } from '../features/table/get-diff-rows';
import { createGetDiffSheetByKey } from '../features/table/get-diff-sheet-by-key';
import { createGetDiffSheetContent } from '../features/table/get-diff-sheet-content';
import { createGetRuntimeErrorLogPayload } from '../features/table/get-runtime-error-log-payload';
import { createGetRuntimeErrorMessage } from '../features/table/get-runtime-error-message';
import { createGetTableData } from '../features/table/get-table-data';
import { createHasRuntimeTableReadApi } from '../features/table/has-runtime-table-read-api';
import { createIsDiffSheet } from '../features/table/is-diff-sheet';
import { createNormalizeDiffRow } from '../features/table/normalize-diff-row';
import { createNormalizeDiffText, normalizeDiffHeaderImpl as normalizeDiffHeader } from '../features/table/normalize-diff-text';
import { createPatchCrudRowIdIfMissing } from '../features/table/patch-crud-row-id-if-missing';
import { createPatchCrudSheetCellInMessage } from '../features/table/patch-crud-sheet-cell-in-message';
import { createPatchCrudSheetCellInRecord } from '../features/table/patch-crud-sheet-cell-in-record';
import { createPatchCrudSheetInMessage } from '../features/table/patch-crud-sheet-in-message';
import { createPatchCrudSheetInRecord } from '../features/table/patch-crud-sheet-in-record';
import { createPatchLatestChatSheetCellWithoutTracking } from '../features/table/patch-latest-chat-sheet-cell-without-tracking';
import { createPatchLatestChatSheetWithoutTracking } from '../features/table/patch-latest-chat-sheet-without-tracking';
import { createPerformSaveDataOnly } from '../features/table/perform-save-data-only';
import { createPrepareCrudRowIdForUpdateCell } from '../features/table/prepare-crud-row-id-for-update-cell';
import { createReadRuntimeTableData } from '../features/table/read-runtime-table-data';
import { createReadRuntimeTableDataReference } from '../features/table/read-runtime-table-data-reference';
import { createRemoveDiffDataRow } from '../features/table/remove-diff-data-row';
import { createResolveRuntimeMutationSource } from '../features/table/resolve-runtime-mutation-source';
import { createRestoreCrudRowIdPreparation } from '../features/table/restore-crud-row-id-preparation';
import { createRestoreMutableRuntimeValue } from '../features/table/restore-mutable-runtime-value';
import { createRunInSaveQueue } from '../features/table/run-in-save-queue';
import { createSanitizeRuntimeTableData } from '../features/table/sanitize-runtime-table-data';
import { createSaveDataOnly } from '../features/table/save-data-only';
import { createSaveDataToDatabase } from '../features/table/save-data-to-database';
import { createSaveRowInstantly } from '../features/table/save-row-instantly';
import { createSaveSheetsViaJsonFloorWithoutTracking } from '../features/table/save-sheets-via-json-floor-without-tracking';
import { createSetDiffDataCell } from '../features/table/set-diff-data-cell';
import { createSetDiffDataRow } from '../features/table/set-diff-data-row';
import { createApplySheetDataViaCrud } from '../features/table/sheet-data-crud';
import { createTakeDiffRowMatch } from '../features/table/take-diff-row-match';
import { createUpdateRuntimeDataCacheAfterCrud } from '../features/table/update-runtime-data-cache-after-crud';
import { createBindTutorialButtonsIn } from '../features/tutorial/bind-tutorial-buttons-in';
import { createGetTutorialButtonHtml } from '../features/tutorial/get-tutorial-button-html';
import { createGetTutorialModule } from '../features/tutorial/get-tutorial-module';
import { createIsTutorialScope } from '../features/tutorial/is-tutorial-scope';
import { createPrepareAvatarManagerTutorial } from '../features/tutorial/prepare-avatar-manager-tutorial';
import { createPrepareMvuTutorial } from '../features/tutorial/prepare-mvu-tutorial';
import { createPrepareSettingsGroupTutorial } from '../features/tutorial/prepare-settings-group-tutorial';
import { createSettingsGroupTutorialMap } from '../features/tutorial/settings-group-tutorial-map';
import { createStartTutorialFromButton } from '../features/tutorial/start-tutorial-from-button';
import { createApplyConfigStyles } from '../features/ui/apply-config-styles';
import { createShowAddValidationRuleModal } from '../features/validation/add-validation-rule-dialog';
import { createShowSmartFixModal } from '../features/validation/smart-fix-dialog';
import { createAddStyles } from '../shared/add-styles';
import { createCloneRuntimeDataValue } from '../shared/clone-runtime-data-value';
import { MAIN_STYLES } from '../shared/styles';
import { createCrudWiring } from '../wiring/crud-wiring';

export function createRuntimeSaveWiring(deps: any) {
  const { FONTS, GACHA_CATALOG_RAW_ROW_INDEX_PROP, RegexTransformationManager, ValidationRuleManager, buildCrudColumnAliasMap, cachedRawData_ACC, collectHostAndLocalNodes, countUnicodeCharacters, currentDiffMap_ACC, errorTableTemplateIssue, escapeHtml, getConfig, getCore, getNavigationFontMetrics, getPendingDeletions, getTavernHostDocument, getTavernHostWindow, hasUnsavedChanges_ACC, isSaving_ACC, loadSnapshot, renderInterface, saveQueue_ACC, saveSnapshot, setupOverlayClose, showDiceSystemConfirmDialog, showTableRuleFixModal, syncInventoryMetadataForRawData } = deps;
  let tutorialModule: TutorialModule | null = null;
  const getTutorialModule = createGetTutorialModule({
    getConfig: (...a: any[]) => getConfig(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getTutorialModule: () => tutorialModule,
    setTutorialModule: (v: any) => { tutorialModule = v; },
  });

  const getTutorialButtonHtml = createGetTutorialButtonHtml({

    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });
  const isTutorialScope = createIsTutorialScope({

  });

  let tutorialButtonEventsBound = false;

  const prepareAvatarManagerTutorial = createPrepareAvatarManagerTutorial({
    getCore: (...a: any[]) => getCore(...a),
  });

  const prepareMvuTutorial = createPrepareMvuTutorial({
    getCore: (...a: any[]) => getCore(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
  });

  const prepareInventoryTutorial = createPrepareInventoryTutorial({
    getCore: (...a: any[]) => getCore(...a),
  });

  const SETTINGS_GROUP_TUTORIAL_MAP = createSettingsGroupTutorialMap({

  });

  const prepareSettingsGroupTutorial = createPrepareSettingsGroupTutorial({
    getCore: (...a: any[]) => getCore(...a),
    SETTINGS_GROUP_TUTORIAL_MAP: SETTINGS_GROUP_TUTORIAL_MAP,
  });

  const startTutorialFromButton = createStartTutorialFromButton({
    getCore: (...a: any[]) => getCore(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getTutorialModule: (...a: any[]) => getTutorialModule(...a),
    isTutorialScope: (...a: any[]) => isTutorialScope(...a),
    prepareAvatarManagerTutorial: (...a: any[]) => prepareAvatarManagerTutorial(...a),
    prepareInventoryTutorial: (...a: any[]) => prepareInventoryTutorial(...a),
    prepareMvuTutorial: (...a: any[]) => prepareMvuTutorial(...a),
    prepareSettingsGroupTutorial: (...a: any[]) => prepareSettingsGroupTutorial(...a),
  });

  const bindTutorialButtonsIn = createBindTutorialButtonsIn({
    startTutorialFromButton: (...a: any[]) => startTutorialFromButton(...a),
  });

  type DiffSheet = {
    name?: unknown;
    uid?: unknown;
    content?: unknown[];
    sourceData?: Record<string, unknown>;
  };

  type DiffRow = unknown[];

  type DiffRowMatch = {
    index: number;
    row: DiffRow;
  };

  type DiffRowMatcher = {
    byKey: Map<string, DiffRowMatch[]>;
    rows: DiffRow[];
    usedIndices: Set<number>;
  };

  const asDiffRecord = createAsDiffRecord({

  });

  const isDiffSheet = createIsDiffSheet({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
  });

  const normalizeDiffText = createNormalizeDiffText({

  });

  const getDiffSheetIdentity = (sheet: unknown): { uid: string; name: string } => {
    const record = asDiffRecord(sheet);
    return {
      uid: normalizeDiffText(record?.uid),
      name: normalizeDiffText(record?.name),
    };
  };

  const findDiffSnapshotEntry = createFindDiffSnapshotEntry({

    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
    getDiffSheetIdentity: (...a: any[]) => getDiffSheetIdentity(...a),
  });

  const normalizeDiffRow = createNormalizeDiffRow({

  });

  const getDiffSheetByKey = createGetDiffSheetByKey({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
  });

  const getDiffDataRow = createGetDiffDataRow({

  });

  const setDiffDataRow = createSetDiffDataRow({

  });

  const setDiffDataCell = createSetDiffDataCell({
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
  });

  const removeDiffDataRow = createRemoveDiffDataRow({

  });

  const getDiffSheetContent = createGetDiffSheetContent({
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
    normalizeDiffRow: (...a: any[]) => normalizeDiffRow(...a),
  });

  const getDiffHeaders = createGetDiffHeaders({
    getDiffSheetContent: (...a: any[]) => getDiffSheetContent(...a),
  });
  const getDiffRows = createGetDiffRows({
    getDiffSheetContent: (...a: any[]) => getDiffSheetContent(...a),
  });


  const DIFF_ID_HEADER_KEYWORDS = createDiffIdHeaderKeywords({

  });

  const getDiffPreferredColumns = createGetDiffPreferredColumns({
    normalizeDiffHeader: (...a: any[]) => normalizeDiffHeader(...a),
    getDIFF_ID_HEADER_KEYWORDS: () => DIFF_ID_HEADER_KEYWORDS,
  });

  const getDiffRowIdentityKeys = createGetDiffRowIdentityKeys({
    getDiffPreferredColumns: (...a: any[]) => getDiffPreferredColumns(...a),
    normalizeDiffHeader: (...a: any[]) => normalizeDiffHeader(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const getDiffRowDisplayTitle = createGetDiffRowDisplayTitle({
    getDiffPreferredColumns: (...a: any[]) => getDiffPreferredColumns(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const createDiffRowMatcher = createCreateDiffRowMatcher({
    getDiffRowIdentityKeys: (...a: any[]) => getDiffRowIdentityKeys(...a),
  });

  const takeDiffRowMatch = createTakeDiffRowMatch({
    getDiffRowIdentityKeys: (...a: any[]) => getDiffRowIdentityKeys(...a),
  });

  const countRuntimeDataChanges = createCountRuntimeDataChanges({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    createDiffRowMatcher: (...a: any[]) => createDiffRowMatcher(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getDiffHeaders: (...a: any[]) => getDiffHeaders(...a),
    getDiffRows: (...a: any[]) => getDiffRows(...a),
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
    takeDiffRowMatch: (...a: any[]) => takeDiffRowMatch(...a),
  });

  const generateDiffMap = createGenerateDiffMap({
    createDiffRowMatcher: (...a: any[]) => createDiffRowMatcher(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getDiffHeaders: (...a: any[]) => getDiffHeaders(...a),
    getDiffRows: (...a: any[]) => getDiffRows(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    takeDiffRowMatch: (...a: any[]) => takeDiffRowMatch(...a),
  });

  const applyConfigStyles = createApplyConfigStyles({
    collectHostAndLocalNodes: (...a: any[]) => collectHostAndLocalNodes(...a),
    getNavigationFontMetrics: (...a: any[]) => getNavigationFontMetrics(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    FONTS: FONTS,
  });

  /**
   * 注入骰子系统样式到页面
   *
   * CSS 样式定义已拆分到 ./styles.ts 文件中。
   * 如需修改样式，请编辑 styles.ts 中的 MAIN_STYLES 常量。
   *
   * @see ./styles.ts - MAIN_STYLES 常量
   */
  const addStyles = createAddStyles({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });

  const cloneRuntimeDataValue = createCloneRuntimeDataValue({

  });

  const restoreMutableRuntimeValue = createRestoreMutableRuntimeValue({

  });

  const getRuntimeErrorMessage = createGetRuntimeErrorMessage({

  });

  const getRuntimeErrorLogPayload = createGetRuntimeErrorLogPayload({
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
  });

  type RuntimeTableReadOptions = {
    silent?: boolean;
  };

  const readRuntimeTableData = createReadRuntimeTableData({

  });

  const readRuntimeTableDataReference = createReadRuntimeTableDataReference({
    readRuntimeTableData: (...a: any[]) => readRuntimeTableData(...a),
  });

  const hasRuntimeTableReadApi = createHasRuntimeTableReadApi({

  });

  const getTableData = createGetTableData({
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    getCore: (...a: any[]) => getCore(...a),
    hasRuntimeTableReadApi: (...a: any[]) => hasRuntimeTableReadApi(...a),
    readRuntimeTableData: (...a: any[]) => readRuntimeTableData(...a),
  });

  type DbChatMessage = {
    id?: string | number;
    mesid?: string | number;
    message_id?: string | number;
    swipes_id?: string | number;
    mes?: string;
    message?: string;
    text?: string;
    content?: string;
    is_user?: boolean;
    TavernDB_ACU_IsolatedData?: unknown;
    TavernDB_ACU_Identity?: unknown;
    TavernDB_ACU_IndependentData?: unknown;
    TavernDB_ACU_ModifiedKeys?: unknown;
    TavernDB_ACU_UpdateGroupKeys?: unknown;
    TavernDB_ACU_Data?: unknown;
    TavernDB_ACU_SummaryData?: unknown;
  };

  // [x4-c] CRUD/表格读写装配已迁出：见 ./wiring/crud-wiring.ts
  const { CRUD_SQL_IDENTIFIER_PATTERN, addCrudColumnAlias, assertCrudEnumConstraints, assertCrudJsonFallbackAllowed, assertCrudLengthConstraints, assertCrudRequiredCellValues, assertCrudRequiredColumnsRepresented, assertRuntimeCrudApi, buildCrudEnumConstraintMap, buildCrudRequiredHeaderSet, buildRowDataForCrud, decodeCrudSqlIdentifier, getCrudCellValueForWrite, getCrudChangedColumns, getCrudColumnNameForHeader, getCrudSheetDdl, getCrudSqlCommentAliases, getCrudSqlTableName, getCrudTableIdentifier, getDbChatMessages, getSheetHeaders, getSheetRows, getStableRowKeyForCrud, hasSheetKeys, inferCrudRowIdForUpdateCell, isCrudRowIdMissing, normalizeSheetKeys, parseCrudColumnDefinitionLine, parseIsolatedData, resolveIsolationKey, sameHeaders, sameRow, shouldInferCrudRowIdFromVisibleIndex, stripCrudSqlComments, stripCrudSqlNonStructuralComments } = createCrudWiring({ asDiffRecord, buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a), countUnicodeCharacters, getCore, hasRuntimeTableReadApi, normalizeDiffText });

  type CrudRowIdPatch = {
    row: DiffRow;
    originalValue: unknown;
  };

  type CrudRowIdPreparation = {
    patchedRows: CrudRowIdPatch[];
    rowId: unknown;
    source: string;
  } | null;

  const patchCrudSheetCellInRecord = createPatchCrudSheetCellInRecord({
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
  });

  const patchCrudSheetInRecord = createPatchCrudSheetInRecord({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
  });

  const patchCrudSheetCellInMessage = createPatchCrudSheetCellInMessage({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    parseIsolatedData: (...a: any[]) => parseIsolatedData(...a),
    patchCrudSheetCellInRecord: (...a: any[]) => patchCrudSheetCellInRecord(...a),
    resolveIsolationKey: (...a: any[]) => resolveIsolationKey(...a),
  });

  const patchCrudSheetInMessage = createPatchCrudSheetInMessage({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    parseIsolatedData: (...a: any[]) => parseIsolatedData(...a),
    patchCrudSheetInRecord: (...a: any[]) => patchCrudSheetInRecord(...a),
    resolveIsolationKey: (...a: any[]) => resolveIsolationKey(...a),
  });

  const patchLatestChatSheetCellWithoutTracking = createPatchLatestChatSheetCellWithoutTracking({

    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    patchCrudSheetCellInMessage: (...a: any[]) => patchCrudSheetCellInMessage(...a),
  });

  const patchLatestChatSheetWithoutTracking = createPatchLatestChatSheetWithoutTracking({
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    patchCrudSheetInMessage: (...a: any[]) => patchCrudSheetInMessage(...a),
  });

  const saveSheetsViaJsonFloorWithoutTracking = createSaveSheetsViaJsonFloorWithoutTracking({
    assertRuntimeCrudApi: (...a: any[]) => assertRuntimeCrudApi(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
    patchCrudSheetInRecord: (...a: any[]) => patchCrudSheetInRecord(...a),
    patchLatestChatSheetWithoutTracking: (...a: any[]) => patchLatestChatSheetWithoutTracking(...a),
    readRuntimeTableDataReference: (...a: any[]) => readRuntimeTableDataReference(...a),
    sanitizeRuntimeTableData: (...a: any[]) => sanitizeRuntimeTableData(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    setCachedRawData: (v: any) => { cachedRawData_ACC.v = v; },
  });

  const applyJsonCellFallbackForCrud = createApplyJsonCellFallbackForCrud({
    assertCrudRequiredCellValues: (...a: any[]) => assertCrudRequiredCellValues(...a),
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getCrudCellValueForWrite: (...a: any[]) => getCrudCellValueForWrite(...a),
    patchCrudSheetCellInRecord: (...a: any[]) => patchCrudSheetCellInRecord(...a),
    patchLatestChatSheetCellWithoutTracking: (...a: any[]) => patchLatestChatSheetCellWithoutTracking(...a),
    readRuntimeTableDataReference: (...a: any[]) => readRuntimeTableDataReference(...a),
  });

  const patchCrudRowIdIfMissing = createPatchCrudRowIdIfMissing({
    isCrudRowIdMissing: (...a: any[]) => isCrudRowIdMissing(...a),
  });

  const prepareCrudRowIdForUpdateCell = createPrepareCrudRowIdForUpdateCell({
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    inferCrudRowIdForUpdateCell: (...a: any[]) => inferCrudRowIdForUpdateCell(...a),
    isCrudRowIdMissing: (...a: any[]) => isCrudRowIdMissing(...a),
    patchCrudRowIdIfMissing: (...a: any[]) => patchCrudRowIdIfMissing(...a),
    readRuntimeTableDataReference: (...a: any[]) => readRuntimeTableDataReference(...a),
  });

  const restoreCrudRowIdPreparation = createRestoreCrudRowIdPreparation({

  });

  const assertCrudInsertRequiredCells = createAssertCrudInsertRequiredCells({
    assertCrudRequiredCellValues: (...a: any[]) => assertCrudRequiredCellValues(...a),
  });
  type CrudWriteBatchContext = {
    remainingOperations: number;
  };

  const consumeCrudWriteOptions = createConsumeCrudWriteOptions({

  });

  type CrudExistingRowPatchInput = {
    api: RuntimeCrudWriteApi;
    sheetKey?: string;
    tableName: string;
    crudTableName: string;
    headers: unknown[];
    currentRow: unknown[];
    nextRow: unknown[];
    sheet: unknown;
    rowIndex: number;
    changedColumns?: Set<number>;
    columnAliasMap?: Record<string, string>;
    batchContext?: CrudWriteBatchContext;
  };


  const applyExistingRowCellPatchesViaCrud = createApplyExistingRowCellPatchesViaCrud({
    applyJsonCellFallbackForCrud: (...a: any[]) => applyJsonCellFallbackForCrud(...a),
    assertCrudEnumConstraints: (...a: any[]) => assertCrudEnumConstraints(...a),
    assertCrudJsonFallbackAllowed: (...a: any[]) => assertCrudJsonFallbackAllowed(...a),
    assertCrudLengthConstraints: (...a: any[]) => assertCrudLengthConstraints(...a),
    assertCrudRequiredCellValues: (...a: any[]) => assertCrudRequiredCellValues(...a),
    assertCrudRequiredColumnsRepresented: (...a: any[]) => assertCrudRequiredColumnsRepresented(...a),
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildRowDataForCrud: (...a: any[]) => buildRowDataForCrud(...a),
    consumeCrudWriteOptions: (...a: any[]) => consumeCrudWriteOptions(...a),
    getCrudCellValueForWrite: (...a: any[]) => getCrudCellValueForWrite(...a),
    getCrudChangedColumns: (...a: any[]) => getCrudChangedColumns(...a),
    prepareCrudRowIdForUpdateCell: (...a: any[]) => prepareCrudRowIdForUpdateCell(...a),
    restoreCrudRowIdPreparation: (...a: any[]) => restoreCrudRowIdPreparation(...a),
  });

  const findDeletionIndicesForCrud = createFindDeletionIndicesForCrud({
    getStableRowKeyForCrud: (...a: any[]) => getStableRowKeyForCrud(...a),
  });

  const assertAppendOnlyRows = createAssertAppendOnlyRows({
    getStableRowKeyForCrud: (...a: any[]) => getStableRowKeyForCrud(...a),
  });

  const findRuntimeSheetEntryForCrud = createFindRuntimeSheetEntryForCrud({

    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
  });

  const applySheetDataViaCrud = createApplySheetDataViaCrud({
    applyExistingRowCellPatchesViaCrud: (...a: any[]) => applyExistingRowCellPatchesViaCrud(...a),
    assertAppendOnlyRows: (...a: any[]) => assertAppendOnlyRows(...a),
    assertCrudEnumConstraints: (...a: any[]) => assertCrudEnumConstraints(...a),
    assertCrudInsertRequiredCells: (...a: any[]) => assertCrudInsertRequiredCells(...a),
    assertCrudLengthConstraints: (...a: any[]) => assertCrudLengthConstraints(...a),
    assertCrudRequiredColumnsRepresented: (...a: any[]) => assertCrudRequiredColumnsRepresented(...a),
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildRowDataForCrud: (...a: any[]) => buildRowDataForCrud(...a),
    findDeletionIndicesForCrud: (...a: any[]) => findDeletionIndicesForCrud(...a),
    getCrudChangedColumns: (...a: any[]) => getCrudChangedColumns(...a),
    getCrudTableIdentifier: (...a: any[]) => getCrudTableIdentifier(...a),
    getSheetHeaders: (...a: any[]) => getSheetHeaders(...a),
    getSheetRows: (...a: any[]) => getSheetRows(...a),
    sameHeaders: (...a: any[]) => sameHeaders(...a),
    sameRow: (...a: any[]) => sameRow(...a),
  });

  const sanitizeRuntimeTableData = createSanitizeRuntimeTableData({
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    getPendingDeletions: (...a: any[]) => getPendingDeletions(...a),
    normalizeSheetKeys: (...a: any[]) => normalizeSheetKeys(...a),
    syncInventoryMetadataForRawData: (...a: any[]) => syncInventoryMetadataForRawData(...a),
  });

  const applyRuntimeDataViaCrud = createApplyRuntimeDataViaCrud({
    applySheetDataViaCrud: (...a: any[]) => applySheetDataViaCrud(...a),
    assertRuntimeCrudApi: (...a: any[]) => assertRuntimeCrudApi(...a),
    findRuntimeSheetEntryForCrud: (...a: any[]) => findRuntimeSheetEntryForCrud(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    sanitizeRuntimeTableData: (...a: any[]) => sanitizeRuntimeTableData(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    setCachedRawData: (v: any) => { cachedRawData_ACC.v = v; },
  });

  const saveDataToDatabase = createSaveDataToDatabase({
    applyRuntimeDataViaCrud: (...a: any[]) => applyRuntimeDataViaCrud(...a),
    getCore: (...a: any[]) => getCore(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
    getHasUnsavedChanges: () => hasUnsavedChanges_ACC.v,
    setHasUnsavedChanges: (v: any) => { hasUnsavedChanges_ACC.v = v; },
      getIsSaving: () => isSaving_ACC.v,
    setIsSaving: (v: any) => { isSaving_ACC.v = v; },
});

  const performSaveDataOnly = createPerformSaveDataOnly({
    applyRuntimeDataViaCrud: (...a: any[]) => applyRuntimeDataViaCrud(...a),
    getRuntimeErrorLogPayload: (...a: any[]) => getRuntimeErrorLogPayload(...a),
  });

  const runInSaveQueue = createRunInSaveQueue({
    getRuntimeErrorLogPayload: (...a: any[]) => getRuntimeErrorLogPayload(...a),
    getSaveQueue: () => saveQueue_ACC.v,
    setSaveQueue: (v: any) => { saveQueue_ACC.v = v; },
  });

  // [新增] 轻量级保存：只保存数据到数据库，不更新快照
  // 使用队列模式确保快速连续编辑时所有修改都能保存成功
  const saveDataOnly = createSaveDataOnly({
    performSaveDataOnly: (...a: any[]) => performSaveDataOnly(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
  });

  const findRuntimeSheetEntryForMutation = createFindRuntimeSheetEntryForMutation({

    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
    stripCrudSqlComments: (...a: any[]) => stripCrudSqlComments(...a),
    getCRUD_SQL_IDENTIFIER_PATTERN: () => CRUD_SQL_IDENTIFIER_PATTERN,
    decodeCrudSqlIdentifier: (...a: any[]) => decodeCrudSqlIdentifier(...a),
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
    getDiffSheetIdentity: (...a: any[]) => getDiffSheetIdentity(...a),
  });

  const resolveRuntimeMutationSource = createResolveRuntimeMutationSource({

    getTableData: (...a: any[]) => getTableData(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
  });

  const updateRuntimeDataCacheAfterCrud = createUpdateRuntimeDataCacheAfterCrud({
    getTableData: (...a: any[]) => getTableData(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    setCachedRawData: (v: any) => { cachedRawData_ACC.v = v; },
  });

  // [新增] 即时保存单行数据并只更新该行快照
  // 用途：弹窗编辑后立即保存，同时保留其他行的AI变更高亮
  // 注意：不调用 saveDataToDatabase（它会更新完整快照），只更新指定行的快照
  type RuntimeRowSaveContext = {
    tableName?: string;
    headers?: unknown[];
    currentRow?: unknown[];
    sourceData?: unknown;
    sheet?: DiffSheet;
  };

  const saveRowInstantly = createSaveRowInstantly({
    applyExistingRowCellPatchesViaCrud: (...a: any[]) => applyExistingRowCellPatchesViaCrud(...a),
    assertRuntimeCrudApi: (...a: any[]) => assertRuntimeCrudApi(...a),
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
    getCrudChangedColumns: (...a: any[]) => getCrudChangedColumns(...a),
    getCrudTableIdentifier: (...a: any[]) => getCrudTableIdentifier(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getRuntimeErrorLogPayload: (...a: any[]) => getRuntimeErrorLogPayload(...a),
    getSheetHeaders: (...a: any[]) => getSheetHeaders(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
    resolveRuntimeMutationSource: (...a: any[]) => resolveRuntimeMutationSource(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setDiffDataRow: (...a: any[]) => setDiffDataRow(...a),
    updateRuntimeDataCacheAfterCrud: (...a: any[]) => updateRuntimeDataCacheAfterCrud(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    setCachedRawData: (v: any) => { cachedRawData_ACC.v = v; },
  });

  const appendRowInstantly = createAppendRowInstantly({
    assertCrudEnumConstraints: (...a: any[]) => assertCrudEnumConstraints(...a),
    assertCrudInsertRequiredCells: (...a: any[]) => assertCrudInsertRequiredCells(...a),
    assertCrudLengthConstraints: (...a: any[]) => assertCrudLengthConstraints(...a),
    assertCrudRequiredColumnsRepresented: (...a: any[]) => assertCrudRequiredColumnsRepresented(...a),
    assertRuntimeCrudApi: (...a: any[]) => assertRuntimeCrudApi(...a),
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildRowDataForCrud: (...a: any[]) => buildRowDataForCrud(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
    getCrudTableIdentifier: (...a: any[]) => getCrudTableIdentifier(...a),
    getSheetHeaders: (...a: any[]) => getSheetHeaders(...a),
    getSheetRows: (...a: any[]) => getSheetRows(...a),
    resolveRuntimeMutationSource: (...a: any[]) => resolveRuntimeMutationSource(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    updateRuntimeDataCacheAfterCrud: (...a: any[]) => updateRuntimeDataCacheAfterCrud(...a),
  });

  const deleteRowInstantly = createDeleteRowInstantly({
    assertRuntimeCrudApi: (...a: any[]) => assertRuntimeCrudApi(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
    getCrudTableIdentifier: (...a: any[]) => getCrudTableIdentifier(...a),
    resolveRuntimeMutationSource: (...a: any[]) => resolveRuntimeMutationSource(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    updateRuntimeDataCacheAfterCrud: (...a: any[]) => updateRuntimeDataCacheAfterCrud(...a),
  });

  const processJsonData = createProcessJsonData({
    GACHA_CATALOG_RAW_ROW_INDEX_PROP: GACHA_CATALOG_RAW_ROW_INDEX_PROP,
  });

  // ========================================
  // 智能修改辅助函数
  // ========================================

  // 格式验证智能推算

  // 关联验证下拉选项提取（支持多列 OR 合并）

  // 检查值是否已存在于关联表的任何列中（用于判断是否需要反向写入）

  // 获取同列其他行的示例值（用于 required 规则）

  // 获取数值的最近有效值

  // ========================================
  // [新增] 正则规则列表局部刷新函数 - 避免全量重渲染
  // ========================================
  const refreshRegexRulesList = createRefreshRegexRulesList({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCore: (...a: any[]) => getCore(...a),
    RegexTransformationManager: RegexTransformationManager,
  });

  // ========================================
  // 新建/编辑数据验证规则弹窗
  // ========================================
  const showAddValidationRuleModal = createShowAddValidationRuleModal({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ValidationRuleManager: ValidationRuleManager,
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // ========================================
  // 智能修改弹窗
  // ========================================
  const showSmartFixModal = createShowSmartFixModal({
    appendRowInstantly: (...a: any[]) => appendRowInstantly(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    errorTableTemplateIssue: (...a: any[]) => errorTableTemplateIssue(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showTableRuleFixModal: (...a: any[]) => showTableRuleFixModal(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // ========================================
  // ========================================
  // 配对表编码修复辅助函数
  // ========================================

  // 从表中提取所有编码值

  // 构建编码映射：旧编码 → 新编码

  // 对齐和修复配对表
  // 核心逻辑：
  // 1. 编码为空的行保持原位置不动（这些是错误数据，由必填规则检测）
  // 2. 有效编码行更新编码值，修复跳号
  // 3. 缺失的编码插入空白行，保证两表有编码的行数一致

  // 表级规则智能修改弹窗
  // ========================================
  const tutorialButtonEventsBound_ACC = { get v(){ return tutorialButtonEventsBound; }, set v(x){ tutorialButtonEventsBound = x; } };
  return { addCrudColumnAlias, addStyles, appendRowInstantly, applyConfigStyles, asDiffRecord, assertCrudEnumConstraints, assertCrudInsertRequiredCells, assertCrudLengthConstraints, assertCrudRequiredColumnsRepresented, bindTutorialButtonsIn, buildCrudEnumConstraintMap, buildCrudRequiredHeaderSet, cloneRuntimeDataValue, countRuntimeDataChanges, createDiffRowMatcher, deleteRowInstantly, findDiffSnapshotEntry, findRuntimeSheetEntryForMutation, generateDiffMap, getCrudColumnNameForHeader, getCrudSheetDdl, getCrudSqlCommentAliases, getCrudSqlTableName, getDbChatMessages, getDiffDataRow, getDiffRowDisplayTitle, getDiffSheetByKey, getDiffSheetIdentity, getRuntimeErrorMessage, getSheetHeaders, getTableData, getTutorialButtonHtml, getTutorialModule, hasRuntimeTableReadApi, hasSheetKeys, normalizeDiffRow, normalizeDiffText, parseCrudColumnDefinitionLine, performSaveDataOnly, processJsonData, refreshRegexRulesList, removeDiffDataRow, restoreMutableRuntimeValue, runInSaveQueue, saveDataOnly, saveDataToDatabase, saveRowInstantly, saveSheetsViaJsonFloorWithoutTracking, setDiffDataCell, setDiffDataRow, showAddValidationRuleModal, showSmartFixModal, startTutorialFromButton, stripCrudSqlNonStructuralComments, takeDiffRowMatch, tutorialButtonEventsBound_ACC };
}
