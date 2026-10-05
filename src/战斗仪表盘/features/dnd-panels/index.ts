// features/dnd-panels/index.ts
// dnd-panels 域装配（b10b · 管理面板二）：队伍 / 任务 / 战斗 / 背包 / 世界 / 日志 / NPC / 档案（导入导出）。
// 跨域调用（renderSettingsPanel / renderAvatar / renderItemCard）经全局化自动命中已上线域。
import { createPanelsMainFragment } from './panels-main';
import { createPanelsPartyFragment } from './panels-party';
import { createPanelsInventoryFragment } from './panels-inventory';
import { createPanelsNpcFragment } from './panels-npc';
import { createPanelsArchiveAFragment } from './panels-archive-a';
import { createPanelsArchiveBFragment } from './panels-archive-b';
import { createPanelsArchiveCFragment } from './panels-archive-c';

export interface DndPanelsDeps { core: any; ui?: any; }
export interface DndPanels { panels: any; init(): void; }

export function createDndPanels(deps0: DndPanelsDeps): DndPanels {
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
  // UICharacter 动态代理（转发到全局实例；配合 `UICharacter.xxx.call(this, ...)` 用法）
  const uiCharacterProxy: any = new Proxy({}, {
    get: (_t: any, k: any) => {
      try {
        const g: any = (window as any).DND_Dashboard_UI;
        if (g && g[k] !== undefined) {
          return typeof g[k] === 'function' ? (g[k] as any).bind(g) : g[k];
        }
      } catch (e) {}
      return undefined;
    },
  });
  const deps: any = {
    logger: core.logger,
    dbAdapter: core.dbAdapter,
    utils: core.utils,
    dataManager: core.dataManager,
    itemManager: core.itemManager,
    notification: deps0.ui?.notification ?? emptyNotify,
    icons: iconProxy,
    uiCharacter: uiCharacterProxy,
  };

  const panels: any = Object.assign(
    {},
    createPanelsMainFragment(deps),
    createPanelsPartyFragment(deps),
    createPanelsInventoryFragment(deps),
    createPanelsNpcFragment(deps),
    createPanelsArchiveAFragment(deps),
    createPanelsArchiveBFragment(deps),
    createPanelsArchiveCFragment(deps)
  );

  const init = (): void => {
    try {
      const w: any = window as any;
      const g: any = (w.DND_Dashboard_UI = w.DND_Dashboard_UI || {});
      if (typeof g.registerModules === 'function') {
        g.registerModules(panels);
      } else {
        Object.assign(g, panels);
      }
      core.logger.info('[dnd-panels] 面板就绪（b10b）：队伍 / 任务 / 战斗 / 背包 / 世界 / 日志 / NPC / 档案导入导出');
    } catch (e) {
      core.logger.warn('[dnd-panels] init 失败（忽略不影响主流程）：', e);
    }
  };

  return { panels, init };
}

export { createPanelsMainFragment } from './panels-main';