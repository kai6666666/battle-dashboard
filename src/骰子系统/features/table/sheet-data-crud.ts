/**
 * sheet-data-crud.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createApplySheetDataViaCrud(deps: any) {
  const applySheetDataViaCrud = async (api: any, sheetKey: string, desiredSheet: any, latestSheet: any) => {
    if (!desiredSheet?.name || !Array.isArray(desiredSheet?.content)) {
      throw new Error(`修改表不存在或格式非法：${sheetKey}`);
    }
    if (!latestSheet?.name || !Array.isArray(latestSheet?.content)) {
      throw new Error(`表 "${desiredSheet.name || sheetKey}" 不存在，整表新增/恢复不支持快捷保存。`);
    }
    if (!deps.sameHeaders(desiredSheet, latestSheet)) {
      throw new Error(`表 "${desiredSheet.name || sheetKey}" 的结构已变化，结构级变更只标注，不支持快捷保存。`);
    }

    const tableName = desiredSheet.name;
    const crudTableName = deps.getCrudTableIdentifier(desiredSheet, tableName);
    const headers = deps.getSheetHeaders(desiredSheet);
    const desiredRows = deps.getSheetRows(desiredSheet);
    const oldRows = deps.getSheetRows(latestSheet);
    const columnAliasMap = deps.buildCrudColumnAliasMap(desiredSheet);
    deps.assertCrudRequiredColumnsRepresented(tableName, headers, desiredSheet);

    if (desiredRows.length > oldRows.length) {
      deps.assertAppendOnlyRows(oldRows, desiredRows);
    }

    let pendingDeleteIndices: number[] = [];
    if (desiredRows.length < oldRows.length) {
      const deleteIndices = deps.findDeletionIndicesForCrud(oldRows, desiredRows);
      if (!deleteIndices) {
        throw new Error(`表 "${tableName}" 的行删除无法安全定位，已取消快捷保存。`);
      }
      pendingDeleteIndices = deleteIndices;
    }
    // x9h②：保存前锁预检——先行模拟本次将产生的行删除与单元格更新，与数据库 S2-2 身份锁
    // 判定（行锁挂 row_id / 列锁挂表头显示名 / 单元格锁挂 [row_id, 列名]）保持一致，
    // 在产生任何写入前给出明确原因；锁定相关 API 不可用时静默跳过（由数据库端兜底拒绝）。
    if (typeof deps.checkSheetWriteLocks === 'function') {
      const simulatedRows = oldRows.map((row: any) => [...row]);
      for (const rowIndex of [...pendingDeleteIndices].sort((left: any, right: any) => right - left)) {
        simulatedRows.splice(rowIndex, 1);
      }
      const lockOperations: any[] = [];
      for (const rowIndex of pendingDeleteIndices) {
        lockOperations.push({ kind: 'delete', rowIndex, rowId: String(oldRows[rowIndex]?.[0] ?? '') });
      }
      for (let lockRowIndex = 0; lockRowIndex < desiredRows.length; lockRowIndex++) {
        if (lockRowIndex >= simulatedRows.length) continue; // 追加行由 insertRow 处理，新行无锁可判
        const changedColumns = deps.getCrudChangedColumns(
          headers,
          simulatedRows[lockRowIndex],
          desiredRows[lockRowIndex],
        );
        if (!changedColumns || changedColumns.size === 0) continue;
        lockOperations.push({
          kind: 'update',
          rowIndex: lockRowIndex,
          rowId: String(simulatedRows[lockRowIndex]?.[0] ?? ''),
          colIndexes: Array.from(changedColumns),
        });
      }
      const lockViolation = deps.checkSheetWriteLocks({
        api,
        sheetKey,
        tableName,
        content: Array.isArray(latestSheet?.content) ? latestSheet.content : [],
        operations: lockOperations,
      });
      if (lockViolation) {
        throw new Error(`保存已取消：${lockViolation}请先在数据库界面解锁后重试。`);
      }
    }
    let workingRows = oldRows.map((row: any) => [...row]);
    if (pendingDeleteIndices.length > 0) {
      for (const rowIndex of [...pendingDeleteIndices].sort((left: any, right: any) => right - left)) {
        const result = await api.deleteRow({ tableName: crudTableName, rowIndex: rowIndex + 1, skipNotify: true });
        if (result === false) throw new Error(`删除 "${tableName}" 第 ${rowIndex + 1} 行失败`);
        workingRows.splice(rowIndex, 1);
      }
    }

    if (desiredRows.length > workingRows.length) {
      for (let index = workingRows.length; index < desiredRows.length; index++) {
        deps.assertCrudInsertRequiredCells(tableName, headers, desiredRows[index], desiredSheet, index);
        deps.assertCrudEnumConstraints(
          tableName,
          headers,
          desiredRows[index],
          desiredSheet,
          index,
          undefined,
          columnAliasMap,
        );
        deps.assertCrudLengthConstraints(
          tableName,
          headers,
          desiredRows[index],
          desiredSheet,
          index,
          undefined,
          columnAliasMap,
        );
        const rowData = deps.buildRowDataForCrud(headers, desiredRows[index], undefined, desiredSheet, columnAliasMap);
        const result = await api.insertRow({ tableName: crudTableName, data: rowData, skipNotify: true });
        if (result === false || result === -1) {
          throw new Error(`向 "${tableName}" 追加新行失败：数据库拒绝写入，请检查表结构、必填列和枚举约束。`);
        }
        workingRows.push([...desiredRows[index]]);
      }
    }

    for (let rowIndex = 0; rowIndex < desiredRows.length; rowIndex++) {
      const desiredRow = desiredRows[rowIndex] || [];
      const currentRow = workingRows[rowIndex] || [];
      if (deps.sameRow(currentRow, desiredRow)) continue;

      const changedColumns = deps.getCrudChangedColumns(headers, currentRow, desiredRow);
      await deps.applyExistingRowCellPatchesViaCrud({
        api,
        sheetKey,
        tableName,
        crudTableName,
        headers,
        currentRow,
        nextRow: desiredRow,
        sheet: desiredSheet,
        rowIndex,
        changedColumns,
        columnAliasMap,
      });
      workingRows[rowIndex] = [...desiredRow];
    }
  };
  return applySheetDataViaCrud;
}
