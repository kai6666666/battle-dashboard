/**
 * wiring / bind-changes-events-wiring.ts — 变更面板事件绑定装配簇（从 index.ts 迁出，x4-ad）。
 */
import { createBindChangesEvents } from '../features/changes/bind-changes-events';
import { STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, STORAGE_KEY_VALIDATION_MODE } from '../shared/storage-keys';

export function createBindChangesEventsWiring(deps: any) {
  const { appendRowInstantly, cachedRawData_ACC, closePanel, currentDiffMap_ACC, deleteRowInstantly, findDiffSnapshotEntry, getCore, getDiffDataRow, getDiffSheetByKey, getPanelDragStartHeight, getTableData, loadSnapshot, refreshChangesPanel, removeDiffDataRow, renderChangesPanel, renderInterface, resetPanelRequestedHeight, resolveExistingTableName, safeDecodeURIComponent, saveActiveTabState, saveDataToDatabase, savePanelRequestedHeight, saveRowInstantly, saveSnapshot, setActiveTableNavButton, setDiffDataCell, setDiffDataRow, setPanelRequestedHeight, showChangeEditModal, showChangeSingleFieldModal, showRowCompareEditModal, showSmartFixModal, updateChangesCount, warnMissingTableTarget } = deps;
  // [新增] 绑定变更面板事件
  const bindChangesEvents = createBindChangesEvents({
    appendRowInstantly: (...a: any[]) => appendRowInstantly(...a),
    closePanel: (...a: any[]) => closePanel(...a),
    deleteRowInstantly: (...a: any[]) => deleteRowInstantly(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    refreshChangesPanel: (...a: any[]) => refreshChangesPanel(...a),
    removeDiffDataRow: (...a: any[]) => removeDiffDataRow(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    resolveExistingTableName: (...a: any[]) => resolveExistingTableName(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
    saveDataToDatabase: (...a: any[]) => saveDataToDatabase(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setActiveTableNavButton: (...a: any[]) => setActiveTableNavButton(...a),
    setDiffDataCell: (...a: any[]) => setDiffDataCell(...a),
    setDiffDataRow: (...a: any[]) => setDiffDataRow(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    showChangeEditModal: (...a: any[]) => showChangeEditModal(...a),
    showChangeSingleFieldModal: (...a: any[]) => showChangeSingleFieldModal(...a),
    showRowCompareEditModal: (...a: any[]) => showRowCompareEditModal(...a),
    showSmartFixModal: (...a: any[]) => showSmartFixModal(...a),
    updateChangesCount: (...a: any[]) => updateChangesCount(...a),
    warnMissingTableTarget: (...a: any[]) => warnMissingTableTarget(...a),
    STORAGE_KEY_DASHBOARD_ACTIVE: STORAGE_KEY_DASHBOARD_ACTIVE,
    STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE: STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
    STORAGE_KEY_VALIDATION_MODE: STORAGE_KEY_VALIDATION_MODE,
    getCachedRawData: () => cachedRawData_ACC.v,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
  });
  return { bindChangesEvents };
}
