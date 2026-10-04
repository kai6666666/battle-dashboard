/**
 * wiring / table-order-cellmenu-wiring.ts — 表格排序编辑/拖拽与单元格菜单装配簇（从 index.ts 迁出，x4-ac）。
 */
import { createShowCellMenu } from '../features/table/show-cell-menu';
import { createToggleOrderEditMode } from '../features/ui/toggle-order-edit-mode';
import { STORAGE_KEY_ACTION_ORDER } from '../shared/storage-keys';
import { createInitSortable } from '../shared/ui/init-sortable';

export function createTableOrderCellMenuWiring(deps: any) {
  const { MAX_ACTION_BUTTONS, appendRowInstantly, cachedRawData_ACC, currentDiffMap_ACC, deleteRowInstantly, escapeHtml, findDiffSnapshotEntry, findRowIndexByPrimaryKey, findRuntimeSheetEntryForMutation, generateDiffMap, getBadgeStyle, getConfig, getCore, getDiffDataRow, getDiffSheetByKey, getSheetHeaders, getSheetKeyByTableName, getTableData, hasUnsavedChanges_ACC, isEditingOrder_ACC, loadSnapshot, renderInterface, safeDecodeURIComponent, safeEncodeURIComponent, saveRowInstantly, saveTableOrder, showCardEditModal, showDiceSystemConfirmDialog, showDiceSystemInputDialog, showEditDialog, showTagInputModal, syncHostRegenerateButtonVisibility, updateSaveButtonState } = deps;
  let selectedSwapSource = null;
  const toggleOrderEditMode = createToggleOrderEditMode({
    getCore: (...a: any[]) => getCore(...a),
    initSortable: (...a: any[]) => initSortable(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveTableOrder: (...a: any[]) => saveTableOrder(...a),
    syncHostRegenerateButtonVisibility: (...a: any[]) => syncHostRegenerateButtonVisibility(...a),
    STORAGE_KEY_ACTION_ORDER: STORAGE_KEY_ACTION_ORDER,
    getSelectedSwapSource: () => selectedSwapSource,
    setSelectedSwapSource: (v: any) => { selectedSwapSource = v; },
      getIsEditingOrder: () => isEditingOrder_ACC.v,
    setIsEditingOrder: (v: any) => { isEditingOrder_ACC.v = v; },
});

  const initSortable = createInitSortable({
    getCore: (...a: any[]) => getCore(...a),
    MAX_ACTION_BUTTONS: MAX_ACTION_BUTTONS,
    getSelectedSwapSource: () => selectedSwapSource,
    setSelectedSwapSource: (v: any) => { selectedSwapSource = v; },
  });

  const showCellMenu = createShowCellMenu({
    appendRowInstantly: (...a: any[]) => appendRowInstantly(...a),
    deleteRowInstantly: (...a: any[]) => deleteRowInstantly(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    findRowIndexByPrimaryKey: (...a: any[]) => findRowIndexByPrimaryKey(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getBadgeStyle: (...a: any[]) => getBadgeStyle(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    getSheetHeaders: (...a: any[]) => getSheetHeaders(...a),
    getSheetKeyByTableName: (...a: any[]) => getSheetKeyByTableName(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    showCardEditModal: (...a: any[]) => showCardEditModal(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showDiceSystemInputDialog: (...a: any[]) => showDiceSystemInputDialog(...a),
    showEditDialog: (...a: any[]) => showEditDialog(...a),
    showTagInputModal: (...a: any[]) => showTagInputModal(...a),
    updateSaveButtonState: (...a: any[]) => updateSaveButtonState(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
    getHasUnsavedChanges: () => hasUnsavedChanges_ACC.v,
    setHasUnsavedChanges: (v: any) => { hasUnsavedChanges_ACC.v = v; },
  });
  return { showCellMenu };
}
