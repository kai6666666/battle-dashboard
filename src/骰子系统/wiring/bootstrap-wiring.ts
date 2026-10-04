/**
 * wiring / bootstrap-wiring.ts — 初始化引导与诊断工具装配簇（从 index.ts 迁出，x4-u）。
 */
import { createInit } from '../app/init';
import { createDetectVisualizerConflict } from '../features/ui/detect-visualizer-conflict';
import { createShowEditDialog } from '../features/ui/show-edit-dialog';
import { STORAGE_KEY_SCROLL } from '../shared/storage-keys';
import { alignAndFixPairedTables, buildCodeMapping, extractCodesFromTable } from '../shared/table-utils';
import { createShowConflictDialog } from '../shared/ui/conflict-dialog';

export function createBootstrapWiring(deps: any) {
  const { ErrorHandler, MvuModule, UpdateController, _boundRenderHandler_ACC, _boundReviewBaselineHandler_ACC, addStyles, bindAcuDiceGachaRegexActions, bindHumanInputTracking, cachedRawData_ACC, capturePendingHumanInputSnapshot, currentDiffMap_ACC, ensureGachaHeartbeat, escapeHtml, flushGachaHeartbeatProgress, gachaHeartbeatTimer_ACC, gachaShopUiRefreshTimer_ACC, generateCrazyRoll, getActiveTabState, getConfig, getCore, getDiceConfig, getTutorialModule, hasRuntimeTableReadApi, hasUnsavedChanges_ACC, hideDiceResultsInUserMessages, interceptTextareaValue, isEditingOrder_ACC, isFloatingCollapseActive, isInitialized_ACC, maybeRefreshReviewBaselineAtFillStart, observer_ACC, optionPanelVisible_ACC, renderInterface, restoreDiceResultBeforeSend, saveCurrentDatabaseSnapshotAsReviewBaseline, scheduleCharacterDiceProfileDetection, scheduleDialogueIndentRender, setTextareaValueAndNotify, settleGachaFortuneForMessage, setupOverlayClose, shouldTriggerCrazyMode, smartInsertToTextarea, tablePageStates_ACC, tableScrollStates_ACC, tableSearchStates_ACC } = deps;
  const showEditDialog = createShowEditDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  // ==========================================
  // [优化后] 新的初始化入口 (Observer 只创建一次)
  // ==========================================
  // 检测可视化前端冲突
  const detectVisualizerConflict = createDetectVisualizerConflict({
    getCore: (...a: any[]) => getCore(...a),
  });

  // 显示冲突错误对话框
  const showConflictDialog = createShowConflictDialog({
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  const init = createInit({
    addStyles: (...a: any[]) => addStyles(...a),
    bindAcuDiceGachaRegexActions: (...a: any[]) => bindAcuDiceGachaRegexActions(...a),
    bindHumanInputTracking: (...a: any[]) => bindHumanInputTracking(...a),
    capturePendingHumanInputSnapshot: (...a: any[]) => capturePendingHumanInputSnapshot(...a),
    detectVisualizerConflict: (...a: any[]) => detectVisualizerConflict(...a),
    ensureGachaHeartbeat: (...a: any[]) => ensureGachaHeartbeat(...a),
    flushGachaHeartbeatProgress: (...a: any[]) => flushGachaHeartbeatProgress(...a),
    generateCrazyRoll: (...a: any[]) => generateCrazyRoll(...a),
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getTutorialModule: (...a: any[]) => getTutorialModule(...a),
    hasRuntimeTableReadApi: (...a: any[]) => hasRuntimeTableReadApi(...a),
    hideDiceResultsInUserMessages: (...a: any[]) => hideDiceResultsInUserMessages(...a),
    interceptTextareaValue: (...a: any[]) => interceptTextareaValue(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    restoreDiceResultBeforeSend: (...a: any[]) => restoreDiceResultBeforeSend(...a),
        maybeRefreshReviewBaselineAtFillStart: (...a: any[]) => maybeRefreshReviewBaselineAtFillStart(...a),
saveCurrentDatabaseSnapshotAsReviewBaseline: (...a: any[]) => saveCurrentDatabaseSnapshotAsReviewBaseline(...a),
    scheduleCharacterDiceProfileDetection: (...a: any[]) => scheduleCharacterDiceProfileDetection(...a),
    scheduleDialogueIndentRender: (...a: any[]) => scheduleDialogueIndentRender(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    settleGachaFortuneForMessage: (...a: any[]) => settleGachaFortuneForMessage(...a),
    shouldTriggerCrazyMode: (...a: any[]) => shouldTriggerCrazyMode(...a),
    showConflictDialog: (...a: any[]) => showConflictDialog(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    ErrorHandler: ErrorHandler,
    MvuModule: MvuModule,
    STORAGE_KEY_SCROLL: STORAGE_KEY_SCROLL,
    UpdateController: UpdateController,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    getIsEditingOrder: () => isEditingOrder_ACC.v,
    getIsInitialized: () => isInitialized_ACC.v,
    setIsInitialized: (v: any) => { isInitialized_ACC.v = v; },
    getCachedRawData: () => cachedRawData_ACC.v,
    setCachedRawData: (v: any) => { cachedRawData_ACC.v = v; },
    getTablePageStates: () => tablePageStates_ACC.v,
    setTablePageStates: (v: any) => { tablePageStates_ACC.v = v; },
    getTableSearchStates: () => tableSearchStates_ACC.v,
    setTableSearchStates: (v: any) => { tableSearchStates_ACC.v = v; },
    getTableScrollStates: () => tableScrollStates_ACC.v,
    setTableScrollStates: (v: any) => { tableScrollStates_ACC.v = v; },
    getHasUnsavedChanges: () => hasUnsavedChanges_ACC.v,
    setHasUnsavedChanges: (v: any) => { hasUnsavedChanges_ACC.v = v; },
    getOptionPanelVisible: () => optionPanelVisible_ACC.v,
    setOptionPanelVisible: (v: any) => { optionPanelVisible_ACC.v = v; },
    get_boundRenderHandler: () => _boundRenderHandler_ACC.v,
    set_boundRenderHandler: (v: any) => { _boundRenderHandler_ACC.v = v; },
    get_boundReviewBaselineHandler: () => _boundReviewBaselineHandler_ACC.v,
    set_boundReviewBaselineHandler: (v: any) => { _boundReviewBaselineHandler_ACC.v = v; },
    getObserver: () => observer_ACC.v,
    setObserver: (v: any) => { observer_ACC.v = v; },
    getGachaHeartbeatTimer: () => gachaHeartbeatTimer_ACC.v,
    setGachaHeartbeatTimer: (v: any) => { gachaHeartbeatTimer_ACC.v = v; },
    getGachaShopUiRefreshTimer: () => gachaShopUiRefreshTimer_ACC.v,
    setGachaShopUiRefreshTimer: (v: any) => { gachaShopUiRefreshTimer_ACC.v = v; },
  });

  // ========================================
  // 测试函数：验证配对表修复逻辑
  // ========================================
  // 在浏览器控制台运行：window.testPairedTableFix()
  window.testPairedTableFix = function () {
    // 构造测试数据：包含空白行、共同编码、各自独有编码、跳号
    const prefix = 'AM';
    const startFrom = 1;
    const columnName = '编码索引';

    // 总结表（表1）：AM0001, AM0002, 空白(错误行), AM0030, 空白(错误行)
    // 有效编码：AM0001, AM0002, AM0030
    const table1Sheet = {
      name: '总结表',
      content: [
        ['编码索引', '时间跨度', '纪要'],
        ['AM0001', '时间1', '纪要1'],
        ['AM0002', '时间2', '纪要2'],
        [null, '时间3-错误行', '纪要3-错误行'], // 空白编码（错误行，应保持不动）
        ['AM0030', '时间4', '纪要4'],
        [null, '时间5-错误行', '纪要5-错误行'], // 空白编码（错误行，应保持不动）
      ],
    };

    // 总结大纲表（表2）：空白(错误行), AM0002, AM0030, AM0040, AM0050
    // 有效编码：AM0002, AM0030, AM0040, AM0050
    const table2Sheet = {
      name: '总体大纲',
      content: [
        ['编码索引', '时间跨度', '大纲'],
        [null, '时间A-错误行', '大纲A-错误行'], // 空白编码（错误行，应保持不动）
        ['AM0002', '时间B', '大纲B'],
        ['AM0030', '时间C', '大纲C'],
        ['AM0040', '时间D', '大纲D'],
        ['AM0050', '时间E', '大纲E'],
      ],
    };

    // 提取编码
    const extract1 = extractCodesFromTable(table1Sheet, columnName, prefix);
    const extract2 = extractCodesFromTable(table2Sheet, columnName, prefix);

    // 构建映射
    const mapping = buildCodeMapping(extract1.allCodes, extract2.allCodes, prefix, startFrom);

    // 执行修复
    const rawData = {};
    const result = alignAndFixPairedTables(
      table1Sheet,
      'sheet1',
      table2Sheet,
      'sheet2',
      columnName,
      mapping,
      prefix,
      startFrom,
      rawData,
    );

    // 验证结果
    const getValidCodes = sheet =>
      sheet.content
        .slice(1)
        .map(r => r[0])
        .filter(c => c && String(c).match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+$`)));

    const codes1 = getValidCodes(table1Sheet);
    const codes2 = getValidCodes(table2Sheet);

    // 检查空白行是否保持原数据
    const emptyRows1 = table1Sheet.content
      .slice(1)
      .filter(r => !r[0] || !String(r[0]).match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+$`)));
    const emptyRows2 = table2Sheet.content
      .slice(1)
      .filter(r => !r[0] || !String(r[0]).match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+$`)));

    // 验证编码是否严格递增
    const validateSequence = (codes, prefix, startFrom) => {
      const numbers = codes
        .map(c => {
          if (!c) return null;
          const match = c.match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)$`));
          return match ? parseInt(match[1], 10) : null;
        })
        .filter(n => n !== null);

      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] !== startFrom + i) {
          return false;
        }
      }
      return true;
    };

    const isValid1 = validateSequence(codes1, prefix, startFrom);
    const isValid2 = validateSequence(codes2, prefix, startFrom);

    // 验证两个表的有效编码集合是否一致
    const set1 = new Set(codes1);
    const set2 = new Set(codes2);
    const setsEqual = set1.size === set2.size && [...set1].every(c => set2.has(c));

    // 验证空白行数据是否保留
    const emptyRowsPreserved1 = emptyRows1.some(r => r[1] && r[1].includes('错误行'));
    const emptyRowsPreserved2 = emptyRows2.some(r => r[1] && r[1].includes('错误行'));

    return {
      table1Sheet,
      table2Sheet,
      result,
      codes1,
      codes2,
      emptyRows1,
      emptyRows2,
      isValid1,
      isValid2,
      setsEqual,
      emptyRowsPreserved1,
      emptyRowsPreserved2,
      // 综合验证：有效编码严格递增 + 两表有效编码一致 + 空白行数据保留
      isValid: isValid1 && isValid2 && setsEqual && emptyRowsPreserved1 && emptyRowsPreserved2,
    };
  };

  // 暴露诊断工具到全局（方便控制台调用）
  window.diagnoseDiceVariables = async function () {
    if (typeof MvuModule !== 'undefined' && typeof MvuModule.diagnoseVariableFramework === 'function') {
      return await MvuModule.diagnoseVariableFramework();
    } else {
      console.error('[DICE]MvuModule 未初始化或诊断工具不可用');
      return null;
    }
  };
  return { init, showEditDialog };
}
