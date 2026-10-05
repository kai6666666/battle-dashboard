// features/dnd-settings/index.ts
// dnd-settings 域装配（b10a · 管理面板一）：
//   - settings-panel：仪表盘设置面板（DND 原版视觉；含外观/API/表格/背景/骰子规则注入等设置项）；
//   - preset-switcher：预设切换器（战斗/探索自动切换；通知走 UIRenderer 链路），同时注册全局供 combat 等域动态调用。
import { createSettingsPanelFragment } from './settings-panel';
import { createPresetSwitcher } from './preset-switcher';

export interface DndSettingsDeps { core: any; ui?: any; theme?: any; hud?: any; dice?: any; }
export interface DndSettings { settingsPanel: any; presetSwitcher: any; init(): void; }

export function createDndSettings(deps0: DndSettingsDeps): DndSettings {
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
    settingsManager: core.settingsManager,
    templateSync: core.templateSync,
    tavernApi: core.tavernApi,
    themeManager: deps0.theme?.themeManager,
    styleManager: deps0.theme?.styleManager,
    uiRenderer: deps0.ui?.uiRenderer,
    // b4 HUD 的 UICore 对象（含 applyUIScale / applyFloatingBallVisibility）
    uiCore: deps0.hud?.hud,
    // b9 规则注入器实例（设置面板的"骰子规则注入"开关）
    diceRulesInjector: deps0.dice?.injector,
    // b11 接真（DynamicBackground）
    dynamicBackground: deps0.theme?.dynamicBackground ?? { getAvailableEffects: () => [] as any[] },
    presetSwitcher: null,
    icons: iconProxy,
  };

  const presetSwitcher = createPresetSwitcher(deps);
  deps.presetSwitcher = presetSwitcher;

  const settingsPanel = createSettingsPanelFragment(deps);

  const init = (): void => {
    try {
      const w: any = window as any;
      const g: any = (w.DND_Dashboard_UI = w.DND_Dashboard_UI || {});
      if (typeof g.registerModules === 'function') {
        g.registerModules(settingsPanel);
        g.registerModules(presetSwitcher);
      } else {
        Object.assign(g, settingsPanel, presetSwitcher);
      }
      core.logger.info('[dnd-settings] 管理面板就绪（b10a）：仪表盘设置 / 预设切换器');
    } catch (e) {
      core.logger.warn('[dnd-settings] init 失败（忽略不影响主流程）：', e);
    }
  };

  return { settingsPanel, presetSwitcher, init };
}

export { createPresetSwitcher } from './preset-switcher';