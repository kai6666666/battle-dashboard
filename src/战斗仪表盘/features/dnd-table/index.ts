// features/dnd-table/index.ts
// dnd-table 域装配（b10c · 管理面板三）：表格管理器（表格按钮 / 卡片渲染 / 搜索 / 增删改 / 字段布局）。
// 边界：与骰子侧表格编辑器（B）的关系待 b12 按决策 §6.2-7 收口（本模块届时降级为只读/跳转）。
import { createTableCoreFragment } from './table-core';
import { createTableRenderFragment } from './table-render';
import { createTableRecordsFragment } from './table-records';
import { createTableDialogFragment } from './table-dialog';

export interface DndTableDeps { core: any; }
export interface DndTable { table: any; init(): void; }

export function createDndTable(deps0: DndTableDeps): DndTable {
  const core = deps0.core;
  const deps: any = {
    logger: core.logger,
    dbAdapter: core.dbAdapter,
    utils: core.utils,
    dataManager: core.dataManager,
    saveData: (core.saveBridge && typeof core.saveBridge.saveData === 'function')
      ? core.saveBridge.saveData
      : async () => {},
  };

  const table: any = Object.assign(
    {},
    createTableCoreFragment(deps),
    createTableRenderFragment(deps),
    createTableRecordsFragment(deps),
    createTableDialogFragment(deps)
  );

  const init = (): void => {
    try {
      const w: any = window as any;
      const g: any = (w.DND_Dashboard_UI = w.DND_Dashboard_UI || {});
      if (typeof g.registerModules === 'function') {
        g.registerModules(table);
      } else {
        Object.assign(g, table);
      }
      core.logger.info('[dnd-table] 表格管理器就绪（b10c）：面板 / 按钮布局 / 搜索 / 增删改');
    } catch (e) {
      core.logger.warn('[dnd-table] init 失败（忽略不影响主流程）：', e);
    }
  };

  return { table, init };
}

export { createTableCoreFragment } from './table-core';