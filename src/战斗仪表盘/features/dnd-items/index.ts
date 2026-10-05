// features/dnd-items/index.ts
// dnd-items 域装配（b6 · 里程碑 M3）：物品卡 / 详情弹窗 / 操作 / 面板。
// 约定：工厂 + DI；3 个 fragment 经此处合并为同一对象，并注册进全局 UI。
import { createItemsCardsFragment } from './items-cards';
import { createItemsActionsFragment } from './items-actions';
import { createItemsPanelsFragment } from './items-panels';

export interface DndItemsDeps { core: any; ui?: any; theme?: any; hud?: any; }
export interface DndItems { items: any; init(): void; }

export function createDndItems(deps0: DndItemsDeps): DndItems {
  const core = deps0.core;
  // [b11d] 图标接真：运行时查全局 ICONS（dnd-ui 注册；未注册时安全降级为空）
  const iconProxy: any = new Proxy({}, { get: (_t: any, k: any) => {
    try { const g: any = (window as any).DND_Dashboard_UI; return (g && g.ICONS && g.ICONS[k]) || ''; }
    catch (e) { return ''; }
  } });
  const emptyNotify = {
    notify: () => Promise.resolve(),
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {},
    confirm: () => Promise.resolve(false),
    prompt: () => Promise.resolve(null),
  };
  const deps: any = {
    logger: core.logger,
    dbAdapter: core.dbAdapter,
    utils: core.utils,
    dataManager: core.dataManager,
    itemManager: core.itemManager,
    notification: deps0.ui?.notification ?? emptyNotify,
    icons: iconProxy,
  };

  const items: any = Object.assign(
    {},
    createItemsCardsFragment(deps),
    createItemsActionsFragment(deps),
    createItemsPanelsFragment(deps)
  );

  const init = (): void => {
    try {
      const w: any = window as any;
      const g: any = (w.DND_Dashboard_UI = w.DND_Dashboard_UI || {});
      if (typeof g.registerModules === 'function') {
        g.registerModules(items);
      } else {
        Object.assign(g, items);
      }
      core.logger.info('[dnd-items] 物品就绪（M3）：列表 / 详情 / 装备交互');
    } catch (e) {
      core.logger.warn('[dnd-items] init 失败（忽略不影响主流程）：', e);
    }
  };

  return { items, init };
}

export { createItemsCardsFragment } from './items-cards';