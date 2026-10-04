// features/dnd-core/utils.ts
// DND 仪表盘核心访问器（自 BasedonST `src/core/Utils.js` 移植，b1）
// 工厂 + DI：getCore 兼容 iframe / 父窗口；safeSave 走设置同步接口（延迟注入）。

import type { DndLogger } from './logger';

export interface DndCoreHandles {
  window: any;
  $: any;
  getDB: () => any;
}

export interface DndSettingsSink {
  setSetting(key: string, value: unknown): Promise<unknown>;
}

export interface DndUtilsDeps {
  logger: DndLogger;
  getSettingsSync?: () => DndSettingsSink | null;
}

export interface DndUtils {
  getCore(): DndCoreHandles;
  safeSave(key: string, val: unknown): Promise<void>;
}

export function createDndUtils(deps: DndUtilsDeps): DndUtils {
  const { logger } = deps;

  const getCore = (): DndCoreHandles => {
    try {
      let topWin: any = null;
      try {
        topWin = window.top && window.top !== window ? window.top : null;
      } catch {
        topWin = null;
      }

      const w: any = topWin || window.parent || window;
      const localJQuery = (window as any).jQuery;
      const parentJQuery = (window as any).parent?.jQuery;
      const topJQuery = topWin?.jQuery;
      const coreJQuery = w.jQuery;
      const $ = coreJQuery || topJQuery || parentJQuery || localJQuery;

      const getDB = (): any => {
        try {
          return (
            (window as any).AutoCardUpdaterAPI ||
            w.AutoCardUpdaterAPI ||
            (window.top && (window.top as any).AutoCardUpdaterAPI) ||
            null
          );
        } catch {
          return (window as any).AutoCardUpdaterAPI || w.AutoCardUpdaterAPI || null;
        }
      };

      return { window: w, $, getDB };
    } catch (e) {
      logger.error('getCore Error:', e);
      return { window, $: (window as any).jQuery, getDB: () => (window as any).AutoCardUpdaterAPI };
    }
  };

  const safeSave = async (key: string, val: unknown): Promise<void> => {
    // 优先使用同步模块（由 index 接线：getSettingsSync）
    const sync = deps.getSettingsSync ? deps.getSettingsSync() : null;
    if (sync) {
      await sync.setSetting(key, val);
    } else {
      logger.warn('[dnd-core/utils] safeSave: settingsSync 未接线，跳过保存:', key);
    }
  };

  return { getCore, safeSave };
}