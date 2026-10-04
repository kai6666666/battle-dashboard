/**
 * wiring / review-panel-wiring.ts — 变更审核面板与库存过滤元数据装配簇（从 index.ts 迁出，x4-v）。
 */
import { createShowChangeEditModal } from '../features/changes/change-edit-modal';
import { createShowChangeSingleFieldModal } from '../features/changes/change-single-field-modal';
import { createRefreshChangesPanel } from '../features/changes/refresh-changes-panel';
import { createShowRowCompareEditModal } from '../features/changes/row-compare-edit-modal';
import { createRenderDashboard } from '../features/dashboard/render-dashboard';
import { createInventorySortOptions } from '../features/gacha/inventory-sort-options';
import { createUpdateChangesCount } from '../features/validation/update-changes-count';
import type { GachaRewardTargetColumns } from '../entities/gacha-items';

export function createReviewPanelWiring(deps: any) {
  const { AvatarManager, DashboardDataParser, NameAliasRegistry, ValidationEngine, bindChangesEvents, buildAvatarBackgroundStyle, cachedRawData_ACC, countRuntimeDataChanges, createCustomTableNameIconContext, currentDiffMap_ACC, escapeHtml, findDiffSnapshotEntry, generateDiffMap, getConfig, getCore, getDashboardNpcListData, getDiffDataRow, getDiffSheetByKey, getElementEmoji, getTableData, getTutorialButtonHtml, isSettingsOpen_ACC, loadSnapshot, normalizeDiffRow, parseAttributeString, renderChangesPanel, renderCustomTableNameIconContent, replaceUserPlaceholders, saveRowInstantly, saveSnapshot, setDiffDataCell, setDiffDataRow, setupOverlayClose, showDiceSystemConfirmDialog } = deps;
  // [新增] 刷新变更面板（辅助函数）
  const refreshChangesPanel = createRefreshChangesPanel({
    bindChangesEvents: (...a: any[]) => bindChangesEvents(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    updateChangesCount: (...a: any[]) => updateChangesCount(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
  });

  // [新增] 更新审核按钮计数（包含变更数 + 验证错误数）
  const updateChangesCount = createUpdateChangesCount({
    countRuntimeDataChanges: (...a: any[]) => countRuntimeDataChanges(...a),
    getCore: (...a: any[]) => getCore(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    ValidationEngine: ValidationEngine,
  });
  // [新增] 变更面板专用编辑弹窗（保存后只更新单行快照）
  const showChangeEditModal = createShowChangeEditModal({
    bindChangesEvents: (...a: any[]) => bindChangesEvents(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeDiffRow: (...a: any[]) => normalizeDiffRow(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setDiffDataRow: (...a: any[]) => setDiffDataRow(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
    getIsSettingsOpen: () => isSettingsOpen_ACC.v,
    setIsSettingsOpen: (v: any) => { isSettingsOpen_ACC.v = v; },
  });
  // [新增] 变更面板专用单字段编辑弹窗
  const showChangeSingleFieldModal = createShowChangeSingleFieldModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    refreshChangesPanel: (...a: any[]) => refreshChangesPanel(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setDiffDataCell: (...a: any[]) => setDiffDataCell(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
  });

  // [新增] 多字段变更整体对比编辑弹窗
  const showRowCompareEditModal = createShowRowCompareEditModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeDiffRow: (...a: any[]) => normalizeDiffRow(...a),
    refreshChangesPanel: (...a: any[]) => refreshChangesPanel(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setDiffDataRow: (...a: any[]) => setDiffDataRow(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
  });
  const renderDashboard = createRenderDashboard({
    buildAvatarBackgroundStyle: (...a: any[]) => buildAvatarBackgroundStyle(...a),
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getDashboardNpcListData: (...a: any[]) => getDashboardNpcListData(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    AvatarManager: AvatarManager,
    DashboardDataParser: DashboardDataParser,
    NameAliasRegistry: NameAliasRegistry,
  });

  const INVENTORY_TYPE_OPTIONS = ['全部', '消耗品', '材料', '任务物品', '道具'] as const;
  const INVENTORY_QUALITY_OPTIONS = ['全部', '普通', '优秀', '稀有', '史诗', '传说', '神话', '唯一'] as const;
  const INVENTORY_SORT_OPTIONS = createInventorySortOptions({

  });
  type InventoryTypeFilter = (typeof INVENTORY_TYPE_OPTIONS)[number];
  type InventoryQualityFilter = (typeof INVENTORY_QUALITY_OPTIONS)[number];
  type InventorySortFilter = (typeof INVENTORY_SORT_OPTIONS)[number]['value'];
  type InventoryFilterState = {
    search: string;
    type: InventoryTypeFilter;
    quality: InventoryQualityFilter;
    sort: InventorySortFilter;
  };
  type CompositionSafeSearchPayload = {
    input: HTMLInputElement;
    value: string;
    selectionStart: number;
    selectionEnd: number;
  };
  type CompositionSafeSearchBinding = {
    root: JQuery;
    selector?: string;
    namespace?: string;
  };
  type CompositionSafeSearchOptions = {
    delay: number;
    onCommit: (payload: CompositionSafeSearchPayload) => void;
  };
  type InventoryFilterButtonMeta<T extends string> = {
    value: T;
    icon: string;
    label: string;
  };
  type InventoryParsedItem = {
    name: string;
    type: string;
    quantityText: string;
    quantity: number;
    quality: string;
    tags: string;
    effect: string;
    description: string;
    rowIndex: number;
    tableName: string;
    tableKey: string;
    isNew: boolean;
    quantityChanged: boolean;
    isChanged: boolean;
  };
  type GachaRewardColumnMap = {
    name: number;
    type: number;
    quantity: number;
    quality: number;
    tags?: number;
    effect?: number;
    description: number;
    part?: number;
    status?: number;
  };
  type GachaRewardParseResult = {
    tableName: string;
    tableKey: string;
    headers: unknown[];
    items: InventoryParsedItem[];
    colMap: GachaRewardColumnMap;
  };
  type GachaRewardParseOptions = {
    targetTable?: string;
    targetColumns?: GachaRewardTargetColumns;
    requireNameColumn?: boolean;
  };
  type InventoryMetadataRecord = {
    acquiredAt: string;
    acquiredAtLocation: string;
  };
  type InventoryEditableField =
    | 'name'
    | 'type'
    | 'quantity'
    | 'quality'
    | 'description'
    | 'acquiredAtLocation'
    | 'acquiredAt';
  type InventoryMenuScope = 'card' | 'summary' | 'meta' | 'field';
  type InventoryMetadataScope = Record<string, InventoryMetadataRecord>;
  type InventoryMetadataRoot = Record<string, InventoryMetadataScope>;
  type InventoryMetadataStore = Record<string, InventoryMetadataRoot>;
  return { INVENTORY_QUALITY_OPTIONS, INVENTORY_SORT_OPTIONS, INVENTORY_TYPE_OPTIONS, refreshChangesPanel, renderDashboard, showChangeEditModal, showChangeSingleFieldModal, showRowCompareEditModal, updateChangesCount };
}
