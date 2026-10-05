// features/dnd-map/index.ts
// dnd-map 域装配（b8 · 里程碑 M5）：探索地图 / 战斗地图 / 迷你渲染 / 缩放拖拽 / 交互。
// 约定：工厂 + DI；ExplorationMapManager 为域内独立对象（UI 部分经 deps 引用它），
//      运行时经全局注册后与其余域共享 this（= window.DND_Dashboard_UI）。
import { createMapExplorationAiFragment } from './map-exploration-ai';
import { createMapExplorationCoreFragment } from './map-exploration-core';
import { createMapBattleFragment } from './map-battle';
import { createMapUiZoomFragment } from './map-ui-zoom';
import { createMapUiMinimapFragment } from './map-ui-minimap';
import { createMapUiRegenFragment } from './map-ui-regen';
import { createMapUiInteractionFragment } from './map-ui-interaction';

export interface DndMapDeps { core: any; ui?: any; }
export interface DndMap { map: any; explorationMapManager: any; init(): void; }

export function createDndMap(deps0: DndMapDeps): DndMap {
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
    tavernApi: core.tavernApi,
    tavernSettingsSync: core.settingsSync,
    // b9 接真（DiceManager 退役批次）
    saveData: (core.saveBridge && typeof core.saveBridge.saveData === 'function') ? core.saveBridge.saveData : async () => {},
    icons: iconProxy,
    // 域内：先占位，创建后回填
    explorationMapManager: null,
  };

  const emm = createMapExplorationAiFragment(deps);
  Object.assign(emm, createMapExplorationCoreFragment(deps), createMapBattleFragment(deps));
  deps.explorationMapManager = emm;

  const map: any = Object.assign(
    {},
    emm,
    createMapUiZoomFragment(deps),
    createMapUiMinimapFragment(deps),
    createMapUiRegenFragment(deps),
    createMapUiInteractionFragment(deps)
  );

  const init = (): void => {
    try {
      const w: any = window as any;
      const g: any = (w.DND_Dashboard_UI = w.DND_Dashboard_UI || {});
      if (typeof g.registerModules === 'function') {
        g.registerModules(map);
      } else {
        Object.assign(g, map);
      }
      core.logger.info('[dnd-map] 地图就绪（M5）：探索/战斗地图 / 迷雾 / Token / 瞄准 / 自动绘制');
    } catch (e) {
      core.logger.warn('[dnd-map] init 失败（忽略不影响主流程）：', e);
    }
  };

  return { map, explorationMapManager: emm, init };
}

export { createMapExplorationAiFragment } from './map-exploration-ai';