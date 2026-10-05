// features/dnd-combat/index.ts
// dnd-combat 域装配（b7 · 里程碑 M4）：行动经济 / 施法瞄准 / 动作队列 / 战斗面板。
// 约定：工厂 + DI；4 个 fragment 经此处合并为同一对象，并注册进全局 UI。
import { createCombatStateFragment } from './combat-state';
import { createCombatCastFragment } from './combat-cast';
import { createCombatActionsFragment } from './combat-actions';
import { createCombatUiFragment } from './combat-ui';

export interface DndCombatDeps { core: any; ui?: any; theme?: any; hud?: any; }
export interface DndCombat { combat: any; init(): void; }

export function createDndCombat(deps0: DndCombatDeps): DndCombat {
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
    notification: deps0.ui?.notification ?? emptyNotify,
    // b10a：PresetSwitcher 已上线（dnd-settings）；动态转发到全局实例（b7 原 stub 替换）
    presetSwitcher: new Proxy({}, {
      get: (_t: any, k: any) => {
        try {
          const g: any = (window as any).DND_Dashboard_UI;
          if (g && typeof g[k] === 'function') return (g[k] as any).bind(g);
        } catch (e) {}
        return () => {};
      },
    }),
    icons: iconProxy,
  };

  const combat: any = Object.assign(
    {},
    createCombatStateFragment(deps),
    createCombatCastFragment(deps),
    createCombatActionsFragment(deps),
    createCombatUiFragment(deps)
  );

  const init = (): void => {
    try {
      const w: any = window as any;
      const g: any = (w.DND_Dashboard_UI = w.DND_Dashboard_UI || {});
      if (typeof g.registerModules === 'function') {
        g.registerModules(combat);
      } else {
        Object.assign(g, combat);
      }
      core.logger.info('[dnd-combat] 战斗就绪（M4）：回合 / 先攻 / 动作经济 / 法术位扣减');
    } catch (e) {
      core.logger.warn('[dnd-combat] init 失败（忽略不影响主流程）：', e);
    }
  };

  return { combat, init };
}

export { createCombatStateFragment } from './combat-state';