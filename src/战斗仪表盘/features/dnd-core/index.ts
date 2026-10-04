// features/dnd-core/index.ts
// dnd-core 域装配（b1）：聚合 Logger / Utils / DBAdapter / SettingsSync / SettingsManager / TavernAPI
// 约定：工厂 + DI；外部只从这里取实例，不 import 内部单文件（便于后续修订）。

import { createDndLogger, type DndLogger, type DndLoggerDeps } from './logger';
import { createDndUtils, type DndUtils } from './utils';
import { createDndDBAdapter, type DndDBAdapter } from './db-adapter';
import { createDndSettingsSync, type DndSettingsSync } from './settings-sync';
import { createDndSettingsManager, type DndSettingsManager } from './settings-manager';
import { createDndTavernApi, type DndTavernApi } from './tavern-api';
import { createDndNotify, type DndNotify } from './notify';
import { createDndSaveBridge, type DndSaveBridge } from './save-bridge';
import { createDndDataManager, type DndDataManager } from './data-manager';
import { createDndItemManager, type DndItemManager } from './item-manager';
import { createDndTemplateSync, type DndTemplateSync } from './template-sync';

export { DND_CONFIG } from './config';
export type { DndLogger, DndLoggerDeps } from './logger';
export type { DndUtils, DndCoreHandles } from './utils';
export type { DndDBAdapter, DndStorageAnalysis } from './db-adapter';
export type { DndSettingsSync, DndSyncStatus, DndSyncNotifyCallback } from './settings-sync';
export type { DndSettingsManager, DndAPIConfig, DndAISettings } from './settings-manager';
export type { DndTavernApi, DndGenerateOptions, DndDatabaseAIStatus } from './tavern-api';
export type { DndNotify } from './notify';
export type { DndSaveBridge } from './save-bridge';
export type { DndDataManager } from './data-manager';
export type { DndItemManager } from './item-manager';
export type { DndTemplateSync } from './template-sync';

export interface DndCore {
  logger: DndLogger;
  utils: DndUtils;
  dbAdapter: DndDBAdapter;
  settingsSync: DndSettingsSync;
  settingsManager: DndSettingsManager;
  tavernApi: DndTavernApi;
  notify: DndNotify;
  saveBridge: DndSaveBridge;
  dataManager: DndDataManager;
  itemManager: DndItemManager;
  templateSync: DndTemplateSync;
  /** b1/b2 验收：初始化并读取一条数据库设置 / 一张数据表 */
  init(): Promise<void>;
}

export interface DndCoreDeps {
  /** 预留：外部（基座）注入项；当前模块自足，无需外部依赖 */
  loggerOptions?: DndLoggerDeps;
}

export function createDndCore(deps: DndCoreDeps = {}): DndCore {
  const logger = createDndLogger(deps.loggerOptions);

  // getSettingsSync 为延迟接线（闭包在调用时取，避免初始化顺序问题）
  const utils = createDndUtils({ logger, getSettingsSync: () => settingsSync });

  const dbAdapter = createDndDBAdapter({ logger });
  const settingsSync = createDndSettingsSync({ logger, dbAdapter });
  const settingsManager = createDndSettingsManager({ logger, settingsSync });
  const tavernApi = createDndTavernApi({ logger, utils });

  // b2 数据与模板
  const notify = createDndNotify({ logger });
  const saveBridge = createDndSaveBridge({ logger, utils });
  const dataManager = createDndDataManager({ logger, utils, saveData: saveBridge.saveData });
  const itemManager = createDndItemManager({ logger, dataManager, saveData: saveBridge.saveData });
  const templateSync = createDndTemplateSync({ logger, dbAdapter, utils, notify });

  const init = async (): Promise<void> => {
    logger.info('[dnd-core] 初始化开始（b1）…');

    // 1) 设置同步初始化（含离线队列处理）
    await settingsManager.init();

    // 2) LocalStorage → IndexedDB 迁移（静默）
    try {
      await dbAdapter.migrateFromLocalStorage();
    } catch (e) {
      logger.warn('[dnd-core] migrateFromLocalStorage 失败（忽略）:', e);
    }

    // 3) b1 验收钩子：能读一条数据库设置
    try {
      const apiConfig = await settingsManager.getAPIConfig();
      logger.info('[dnd-core] 读设置验收：dnd_global_api_config =', apiConfig);
    } catch (e) {
      logger.warn('[dnd-core] 读设置验收失败（忽略）：', e);
    }

    // 4) b2 验收钩子：能读一张数据表（角色表）
    try {
      const chars = dataManager.getTable('CHARACTER_Registry');
      logger.info('[dnd-core] 读表验收：CHARACTER_Registry 行数 =', chars ? chars.length : 'null（无数据库）');
    } catch (e) {
      logger.warn('[dnd-core] 读表验收失败（忽略）：', e);
    }

    logger.info('[dnd-core] 就绪 ✅（模块：b1 六件 + b2 数据与模板：data-manager×4 / item-manager / template-sync / notify / save-bridge）');
  };

  return { logger, utils, dbAdapter, settingsSync, settingsManager, tavernApi, notify, saveBridge, dataManager, itemManager, templateSync, init };
}