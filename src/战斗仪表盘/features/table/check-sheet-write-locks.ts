/**
 * check-sheet-write-locks.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 *
 * CRUD 写前锁预检（x9h②）：与数据库本体 S2-2 身份锁判定保持同语义
 *（行锁挂 row_id / 列锁挂表头显示名 / 单元格锁挂 [row_id, 列名] 元组），
 * 在产生任何写入前把被锁拒绝的原因整理为可读提示；锁定相关 API 不可用时静默跳过。
 *
 * 内容与下标约定（与数据库对外开放的锁视图保持一致）：
 * - content[0] 为表头（下标 0 为 row_id 列），content[1..] 为数据行；
 * - 锁视图 rows / cols / cells 使用「数据行 0 基下标」与「不含 row_id 列的列 0 基下标」
 *   （cells 为 "r:c" 字符串）；
 * - operations.colIndexes 使用「完整表头」下标（含 row_id 列，即 headers[colIndex] 为列显示名）。
 */
type SheetWriteLockOperation = {
  kind: 'update' | 'delete';
  rowIndex: number;
  rowId?: unknown;
  colIndexes?: number[];
};

type SheetWriteLockCheckInput = {
  api: any;
  sheetKey: string;
  tableName?: string;
  content: any;
  operations: SheetWriteLockOperation[];
};

export function createCheckSheetWriteLocks(_deps: any) {
  const parseCellKey = (raw: unknown): [number, number] | null => {
    const match = /^(\d+):(\d+)$/.exec(String(raw ?? ''));
    if (!match) return null;
    return [Number(match[1]), Number(match[2])];
  };
  const checkSheetWriteLocks = (input: SheetWriteLockCheckInput): string | null => {
    try {
      const api = input?.api;
      if (!api || typeof api.getTableLockState !== 'function') return null;
      if (!input.sheetKey) return null;
      const content = Array.isArray(input.content) ? input.content : null;
      if (!content || !Array.isArray(content[0])) return null;
      const lockState = api.getTableLockState(input.sheetKey);
      if (!lockState) return null;
      const rows = Array.isArray(lockState.rows) ? lockState.rows : [];
      const cols = Array.isArray(lockState.cols) ? lockState.cols : [];
      const cells = Array.isArray(lockState.cells) ? lockState.cells : [];
      if (rows.length === 0 && cols.length === 0 && cells.length === 0) return null;
      const headers = content[0];
      const rowIdAtLockIndex = (lockRowIndex: number): string => {
        const row = content[lockRowIndex + 1];
        if (!Array.isArray(row)) return '';
        return String(row[0] ?? '').trim();
      };
      const colNameAtLockIndex = (lockColIndex: number): string => {
        const header = headers[lockColIndex + 1];
        if (header === undefined || header === null) return '';
        return String(header);
      };
      const lockedRowIds = new Set<string>();
      for (const raw of rows) {
        const lockRowIndex = Number(raw);
        if (!Number.isInteger(lockRowIndex)) continue;
        const rowId = rowIdAtLockIndex(lockRowIndex);
        if (rowId) lockedRowIds.add(rowId);
      }
      const lockedColNames = new Set<string>();
      for (const raw of cols) {
        const lockColIndex = Number(raw);
        if (!Number.isInteger(lockColIndex)) continue;
        const colName = colNameAtLockIndex(lockColIndex);
        if (colName) lockedColNames.add(colName);
      }
      const lockedCellKeys = new Set<string>();
      const lockedCellPairs: Array<[string, string]> = [];
      for (const raw of cells) {
        const pair = parseCellKey(raw);
        if (!pair) continue;
        const rowId = rowIdAtLockIndex(pair[0]);
        const colName = colNameAtLockIndex(pair[1]);
        if (!rowId || !colName) continue;
        const key = `${rowId}\u0000${colName}`;
        if (lockedCellKeys.has(key)) continue;
        lockedCellKeys.add(key);
        lockedCellPairs.push([rowId, colName]);
      }
      const tableLabel = input.tableName ? `表「${input.tableName}」` : '该表';
      for (const operation of input.operations || []) {
        if (!operation || !Number.isInteger(operation.rowIndex)) continue;
        const explicitRowId =
          operation.rowId === undefined || operation.rowId === null ? '' : String(operation.rowId).trim();
        const rowId = explicitRowId || rowIdAtLockIndex(operation.rowIndex);
        // 目标行不存在（行尚未创建）时数据库同样无锁可判，跳过。
        if (!rowId) continue;
        const rowLabel = `第 ${operation.rowIndex + 1} 行`;
        if (lockedRowIds.has(rowId)) {
          return `${tableLabel}${rowLabel}已被行锁锁定（row_id=${rowId}），写入被拒绝。`;
        }
        if (operation.kind === 'delete') {
          const lockedCell = lockedCellPairs.find(pair => pair[0] === rowId);
          if (lockedCell) {
            return `${tableLabel}${rowLabel}含锁定单元格「${lockedCell[1]}」（row_id=${rowId}），不可删除。`;
          }
          continue;
        }
        for (const colIndex of operation.colIndexes || []) {
          if (!Number.isInteger(colIndex) || colIndex <= 0) continue;
          const header = headers[colIndex];
          if (header === undefined || header === null) continue;
          const colName = String(header);
          if (!colName) continue;
          if (lockedColNames.has(colName)) {
            return `${tableLabel}列「${colName}」已被列锁锁定（涉及${rowLabel}·row_id=${rowId}），写入被拒绝。`;
          }
          if (lockedCellKeys.has(`${rowId}\u0000${colName}`)) {
            return `${tableLabel}单元格（${rowLabel}·列「${colName}」·row_id=${rowId}）已被锁定，写入被拒绝。`;
          }
        }
      }
      return null;
    } catch (e) {
      // 预检为增强体验的尽力而为步骤：任何异常都不应阻断保存。
      return null;
    }
  };
  return checkSheetWriteLocks;
}
