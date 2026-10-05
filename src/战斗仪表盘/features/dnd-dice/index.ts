// features/dnd-dice/index.ts
// dnd-dice 域装配（b9 · 里程碑 M6 · 骰子归一）：
//   - 投骰 UI（快速面板 / 自定义表达式 / 快捷栏）→ 引擎优先走 window.AcuDice.roll（不可用时本地回退）；
//   - 骰子池已退役（移除自动补充 / 池可视化 → 引擎状态展示）；
//   - DiceRulesInjector 保留（规则注入器，设置开关由 b10 管理面板接真）。
import { createDicePanelFragment } from './dice-panel';
import { createDiceRollFragment } from './dice-roll';
import { createDiceQuickbarCoreFragment } from './dice-quickbar-core';
import { createDiceQuickbarSlotsFragment } from './dice-quickbar-slots';
import { createDiceRulesInjector } from './dice-rules-injector';

export interface DndDiceDeps { core: any; ui?: any; }
export interface DndDice { dice: any; injector: any; init(): void; }

export function createDndDice(deps0: DndDiceDeps): DndDice {
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
    icons: iconProxy,
  };

  const dice: any = Object.assign(
    {},
    createDicePanelFragment(deps),
    createDiceRollFragment(deps),
    createDiceQuickbarCoreFragment(deps),
    createDiceQuickbarSlotsFragment(deps)
  );

  const injector = createDiceRulesInjector({
    ...deps,
    tavernApi: core.tavernApi,
    tavernSettingsSync: core.settingsSync,
  });

  const init = (): void => {
    try {
      const w: any = window as any;
      const g: any = (w.DND_Dashboard_UI = w.DND_Dashboard_UI || {});
      if (typeof g.registerModules === 'function') {
        g.registerModules(dice);
      } else {
        Object.assign(g, dice);
      }
      // 规则注入器：延迟初始化（保真原入口逻辑 setTimeout 1500ms；内部自带可用性检查与重试上限）
      try {
        setTimeout(() => {
          try { injector.init(); } catch (e) {}
        }, 1500);
      } catch (e) {}
      // [b10d] 融合外观覆盖：隐藏骰子折叠触发器（入口统一：D20球长按/双击 + 仪表盘设置面板）
      try {
        const wAny: any = window as any;
        if (!wAny.__dndDiceFusionStyleInjected) {
          wAny.__dndDiceFusionStyleInjected = true;
          const styleEl = document.createElement('style');
          styleEl.id = 'dnd-fusion-dice-overrides';
          styleEl.textContent = '.acu-collapse-floating{display:none !important}.acu-wrapper.acu-dice-ui-root .acu-col-floating{display:none !important}';
          document.head.appendChild(styleEl);
        }
      } catch (errFusion) {}
      core.logger.info('[dnd-dice] 骰子归一就绪（M6）：投骰走 AcuDice / 规则注入器保留 / 骰子池已退役');
    } catch (e) {
      core.logger.warn('[dnd-dice] init 失败（忽略不影响主流程）：', e);
    }
  };

  return { dice, injector, init };
}

export { createDiceRulesInjector } from './dice-rules-injector';