// features/dnd-hud/index.ts
// dnd-hud 域装配（b4 · 里程碑 M1）：HUD 核心（开关/悬浮球/助手按钮/动态背景桥）
// + HUD 渲染（Mini HUD / 战斗 / 探索 / NPC）+ 防回弹控制器。
// 约定：工厂 + DI；10 个 fragment 经此处合并为同一对象（this 跨块可用）。
import { createHudCoreStateFragment } from './hud-core-state';
import { createHudCoreFloatingBallFragment } from './hud-core-floating-ball';
import { createHudCoreHelperButtonFragment } from './hud-core-helper-button';
import { createHudCoreDynamicBgFragment } from './hud-core-dynamic-bg';
import { createHudCoreInitFragment } from './hud-core-init';
import { createHudRenderFragment } from './hud-render';
import { createHudCombatFragment } from './hud-combat';
import { createHudExploreFragment } from './hud-explore';
import { createHudPanelsFragment } from './hud-panels';
import { createHudNpcFragment } from './hud-npc';
import { createUpdateController } from './update-controller';

export interface DndHudDeps { core: any; ui?: any; theme?: any; }
export interface DndHud { hud: any; updateController: any; init(): void; }

const noopFn = () => {};
const emptyNotify = {
  notify: () => Promise.resolve(),
  success: noopFn,
  error: noopFn,
  warning: noopFn,
  info: noopFn,
  confirm: () => Promise.resolve(false),
  prompt: () => Promise.resolve(null),
};

export function createDndHud(deps0: DndHudDeps): DndHud {
  const core = deps0.core;
  const iconProxy: any = new Proxy({}, { get: () => '' });
  const deps: any = {
    logger: core.logger,
    dbAdapter: core.dbAdapter,
    utils: core.utils,
    dataManager: core.dataManager,
    notification: deps0.ui?.notification ?? emptyNotify,
    themeManager: deps0.theme?.themeManager ?? { getCurrentVars: () => ({}), apply: noopFn, COLOR_VARS: {} },
    styleManager: deps0.theme?.styleManager ?? { apply: async () => false, currentStyleId: 'classic-dnd' },
    // —— 后续批次接入（缺省降级；b10/b11 接真）——
    presetSwitcher: { switch: noopFn },
    dynamicBackground: { init: noopFn, destroyAll: noopFn },
    tableManager: { hide: noopFn },
    icons: iconProxy,
    getWeatherIcon: () => '',
    // —— 回填 / 联动 ——
    hudCore: null,
    uiRenderer: deps0.ui?.uiRenderer ?? null,
    diceManager: null,
  };

  // 1) HUD 核心 fragment → 合并为 hud 对象
  const hud: any = Object.assign(
    {},
    createHudCoreStateFragment(deps),
    createHudCoreFloatingBallFragment(deps),
    createHudCoreHelperButtonFragment(deps),
    createHudCoreDynamicBgFragment(deps),
    createHudCoreInitFragment(deps)
  );
  // 2) 回填 hudCore（UIHUD fragment 内 deps.hudCore.* 转发到同一对象）
  deps.hudCore = hud;
  // 3) UIHUD fragment → 合并进同一对象（this 跨块可用）
  Object.assign(
    hud,
    createHudRenderFragment(deps),
    createHudCombatFragment(deps),
    createHudExploreFragment(deps),
    createHudPanelsFragment(deps),
    createHudNpcFragment(deps)
  );

  // 4) 防回弹控制器（挂到 hud 与实例）
  const updateController = createUpdateController({
    utils: core.utils,
    logger: core.logger,
    uiRenderer: deps0.ui?.uiRenderer ?? null,
    diceManager: null,
  });
  hud.updateController = updateController;

  const init = (): void => {
    try {
      hud.init();
      // 5) 渐进合并进全局（window.DND_Dashboard_UI）——与原版 UIRenderer 全合并语义对齐
      try {
        const w: any = window as any;
        const g: any = (w.DND_Dashboard_UI = w.DND_Dashboard_UI || {});
        if (typeof g.registerModules === 'function') {
          g.registerModules(hud);
        } else {
          Object.assign(g, hud);
        }
      } catch (e) {
        core.logger.warn('[dnd-hud] 全局合并失败（忽略）：', e);
      }
      core.logger.info('[dnd-hud] HUD 就绪（M1）：悬浮球 / Mini HUD / 状态胶囊 / 防回弹控制器');
    } catch (e) {
      core.logger.warn('[dnd-hud] init 失败（忽略不影响主流程）：', e);
    }
  };

  return { hud, updateController, init };
}

export { createUpdateController } from './update-controller';