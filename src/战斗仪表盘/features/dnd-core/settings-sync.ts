// features/dnd-core/settings-sync.ts
// DND 仪表盘设置同步（自 BasedonST `src/core/TavernSettingsSync.js` 移植，b1）
// 职责：Tavern extension_settings ↔ IndexedDB 双向同步、离线队列、聊天元数据。
// 工厂 + DI：全部可变状态收进闭包。

import type { DndLogger } from './logger';
import type { DndDBAdapter } from './db-adapter';

export interface DndSyncStatus {
  connected: boolean;
  pendingSync: number;
  statusText: string;
  statusClass: string;
}

export type DndSyncNotifyCallback = (type: string, message: string, title?: string) => void;

export interface DndSettingsSyncDeps {
  logger: DndLogger;
  dbAdapter: DndDBAdapter;
}

export interface DndSettingsSync {
  setNotifyCallback(callback: DndSyncNotifyCallback | null): void;
  init(): Promise<boolean>;
  getCurrentChatId(): string | null;
  saveToChat(key: string, value: unknown): Promise<boolean>;
  getFromChat(key: string): unknown;
  deleteFromChat(key: string): Promise<boolean>;
  syncToTavern(key: string, value: unknown): Promise<boolean>;
  getSetting(key: string, defaultValue?: unknown): Promise<unknown>;
  setSetting(key: string, value: unknown): Promise<boolean>;
  forceSync(): Promise<boolean>;
  getStatus(): Promise<DndSyncStatus>;
}

export function createDndSettingsSync(deps: DndSettingsSyncDeps): DndSettingsSync {
  const { logger, dbAdapter } = deps;

  const EXTENSION_NAME = 'dnd_dashboard';
  const SYNC_QUEUE_KEY = 'dnd_sync_queue';

  let tavernAvailable: boolean | null = null;
  let previousState: boolean | null = null;
  let syncInterval: any = null;
  let notifyCallback: DndSyncNotifyCallback | null = null;

  const setNotifyCallback = (callback: DndSyncNotifyCallback | null): void => {
    notifyCallback = callback;
  };

  const notify = (type: string, message: string, title = ''): void => {
    // 抑制频繁的连接通知，仅错误和重要状态变更时通知
    if (type === 'info' && (title.includes('云同步') || title.includes('同步中'))) {
      logger.info(`[TavernSettingsSync] (Silent) ${type}: ${title} - ${message}`);
      return;
    }
    if (notifyCallback) {
      notifyCallback(type, message, title);
    }
    logger.info(`[TavernSettingsSync] ${type}: ${title} - ${message}`);
  };

  // ---------- 环境检测 ----------

  const checkTavernAvailable = (): boolean => {
    try {
      const win: any = window.parent || window;
      if (win.SillyTavern && typeof win.SillyTavern.getContext === 'function') {
        const ctx = win.SillyTavern.getContext();
        return !!(ctx && ctx.extensionSettings);
      }
      return false;
    } catch {
      return false;
    }
  };

  const getTavernContext = (): any => {
    try {
      const win: any = window.parent || window;
      if (!win.SillyTavern?.getContext) return null;
      return win.SillyTavern.getContext();
    } catch {
      return null;
    }
  };

  const getCurrentChatId = (): string | null => {
    try {
      const win: any = window.parent || window;
      const ctx = getTavernContext();
      const directChatId = win.SillyTavern?.chatId;
      const fallbackChatId =
        typeof win.SillyTavern?.getCurrentChatId === 'function' ? win.SillyTavern.getCurrentChatId() : null;
      const candidates = [
        ctx?.chatId,
        ctx?.chat_id,
        ctx?.chat?.chat_id,
        ctx?.chat?.id,
        directChatId,
        fallbackChatId,
        win.chat?.chat_id,
        win.chat?.id,
        ctx?.groupId ? `group:${ctx.groupId}` : null,
        ctx?.group_id ? `group:${ctx.group_id}` : null,
      ];
      const match = candidates.find(value => value !== undefined && value !== null && String(value).trim());
      return match ? String(match) : null;
    } catch {
      return null;
    }
  };

  const getExtensionSettings = (): any => {
    try {
      const win: any = window.parent || window;
      if (!win.SillyTavern?.getContext) return null;
      const ctx = win.SillyTavern.getContext();
      if (!ctx?.extensionSettings) return null;
      if (!ctx.extensionSettings[EXTENSION_NAME]) {
        ctx.extensionSettings[EXTENSION_NAME] = {};
      }
      return ctx.extensionSettings[EXTENSION_NAME];
    } catch (e) {
      logger.warn('[TavernSettingsSync] Failed to get extension settings:', e);
      return null;
    }
  };

  const getChatMetadata = (): any => {
    try {
      const win: any = window.parent || window;
      if (win.chat_metadata) return win.chat_metadata;
      if (win.SillyTavern?.getContext) {
        const ctx = win.SillyTavern.getContext();
        if (ctx.chatMetadata) return ctx.chatMetadata;
      }
      return null;
    } catch {
      return null;
    }
  };

  const saveChatMetadata = async (): Promise<boolean> => {
    try {
      const win: any = window.parent || window;
      if (typeof win.saveChatDebounced === 'function') {
        win.saveChatDebounced();
        return true;
      }
      if (win.SillyTavern?.getContext) {
        const ctx = win.SillyTavern.getContext();
        if (typeof ctx.saveChatDebounced === 'function') {
          ctx.saveChatDebounced();
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  // ---------- 聊天元数据读写 ----------

  const saveToChat = async (key: string, value: unknown): Promise<boolean> => {
    try {
      const meta = getChatMetadata();
      if (meta) {
        if (!meta.extensions) meta.extensions = {};
        if (!meta.extensions[EXTENSION_NAME]) meta.extensions[EXTENSION_NAME] = {};
        meta.extensions[EXTENSION_NAME][key] = value;
        return await saveChatMetadata();
      }
    } catch (e) {
      logger.warn('[TavernSettingsSync] Save to chat failed:', e);
    }
    return false;
  };

  const getFromChat = (key: string): unknown => {
    try {
      const meta = getChatMetadata();
      if (meta?.extensions?.[EXTENSION_NAME]) {
        return meta.extensions[EXTENSION_NAME][key];
      }
    } catch {
      /* ignore */
    }
    return undefined;
  };

  const deleteFromChat = async (key: string): Promise<boolean> => {
    try {
      const meta = getChatMetadata();
      if (meta?.extensions?.[EXTENSION_NAME]) {
        delete meta.extensions[EXTENSION_NAME][key];
        return await saveChatMetadata();
      }
    } catch {
      /* ignore */
    }
    return false;
  };

  // ---------- 同步队列 ----------

  const getSyncQueue = async (): Promise<Record<string, { value: unknown; timestamp: number }>> => {
    try {
      const raw = await dbAdapter.getSetting(SYNC_QUEUE_KEY);
      if (!raw) return {};
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return {};
    }
  };

  const addToSyncQueue = async (key: string, value: unknown): Promise<void> => {
    try {
      const queue = await getSyncQueue();
      queue[key] = { value, timestamp: Date.now() };
      await dbAdapter.setSetting(SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      logger.error('[TavernSettingsSync] Failed to add to sync queue:', e);
    }
  };

  const removeFromSyncQueue = async (key: string): Promise<void> => {
    try {
      const queue = await getSyncQueue();
      if (queue[key]) {
        delete queue[key];
        await dbAdapter.setSetting(SYNC_QUEUE_KEY, JSON.stringify(queue));
      }
    } catch (e) {
      logger.error('[TavernSettingsSync] Failed to remove from sync queue:', e);
    }
  };

  const saveTavernSettings = async (): Promise<boolean> => {
    try {
      const win: any = window.parent || window;
      if (!win.SillyTavern?.getContext) return false;
      const ctx = win.SillyTavern.getContext();
      const saveDebounced = ctx.saveSettingsDebounced;
      if (typeof saveDebounced === 'function') {
        saveDebounced();
        return true;
      }
      return false;
    } catch (e) {
      logger.warn('[TavernSettingsSync] Failed to save Tavern settings:', e);
      return false;
    }
  };

  const processSyncQueue = async (): Promise<void> => {
    if (!tavernAvailable) return;
    const queue = await getSyncQueue();
    const keys = Object.keys(queue);
    if (keys.length === 0) return;

    logger.info(`[TavernSettingsSync] Processing ${keys.length} pending items...`);
    let successCount = 0;

    try {
      const settings = getExtensionSettings();
      if (!settings) throw new Error('Extension settings not accessible');

      for (const key of keys) {
        const { value } = queue[key];
        settings[key] = value;
        successCount++;
      }

      const saved = await saveTavernSettings();
      if (saved) {
        await dbAdapter.setSetting(SYNC_QUEUE_KEY, '{}');
        notify('success', `${successCount} 项设置已同步到酒馆`, '<i class="fa-solid fa-check-circle"></i> 同步完成');
      } else {
        logger.warn('[TavernSettingsSync] Save triggered but returned false');
      }
    } catch (e) {
      logger.error('[TavernSettingsSync] Sync processing failed:', e);
      notify('error', '请检查网络连接', '<i class="fa-solid fa-times-circle"></i> 同步失败');
    }
  };

  // ---------- 生命周期 ----------

  const backgroundCheck = async (): Promise<void> => {
    const currentState = checkTavernAvailable();

    if (currentState !== previousState) {
      if (currentState && !previousState) {
        notify('success', '正在同步本地更改...', '🔗 已重新连接酒馆');
        await processSyncQueue();
      } else if (!currentState && previousState) {
        notify('warning', '数据将暂存本地，恢复连接后自动同步', '<i class="fa-solid fa-ban"></i> 酒馆连接已断开');
      }
      previousState = currentState;
    }

    tavernAvailable = currentState;

    if (currentState) {
      await processSyncQueue();
    }
  };

  const init = async (): Promise<boolean> => {
    if (syncInterval) clearInterval(syncInterval);

    tavernAvailable = checkTavernAvailable();
    previousState = tavernAvailable;

    if (tavernAvailable) {
      logger.info('[TavernSettingsSync] ☁️ 云同步已启用');
      try {
        const queue = await getSyncQueue();
        const pendingCount = Object.keys(queue).length;
        if (pendingCount > 0) {
          notify('info', `正在同步 ${pendingCount} 项本地更改...`, '<i class="fa-solid fa-sync fa-spin"></i> 同步中');
          await processSyncQueue();
        }
      } catch (e) {
        logger.error('[TavernSettingsSync] Initial sync failed:', e);
      }
    } else {
      notify('warning', '数据仅保存在本地，连接酒馆后将自动同步', '<i class="fa-solid fa-ban"></i> 离线模式');
    }

    syncInterval = setInterval(() => backgroundCheck(), 30000);
    return !!tavernAvailable;
  };

  // ---------- 核心 API ----------

  const syncToTavern = async (key: string, value: unknown): Promise<boolean> => {
    if (!tavernAvailable) {
      await addToSyncQueue(key, value);
      return false;
    }

    try {
      const settings = getExtensionSettings();
      if (settings) {
        settings[key] = value;
        const saved = await saveTavernSettings();
        if (saved) {
          await removeFromSyncQueue(key);
          return true;
        }
      }
    } catch (e) {
      logger.warn('[TavernSettingsSync] Sync to tavern failed:', e);
    }

    await addToSyncQueue(key, value);
    return false;
  };

  const getSetting = async (key: string, defaultValue: unknown = null): Promise<unknown> => {
    // 1) 优先酒馆
    if (tavernAvailable) {
      const settings = getExtensionSettings();
      if (settings && settings[key] !== undefined) {
        // 回写 IndexedDB 作为备份
        try {
          const localVal = await dbAdapter.getSetting(key);
          if (JSON.stringify(localVal) !== JSON.stringify(settings[key])) {
            await dbAdapter.setSetting(key, settings[key]);
          }
        } catch {
          await dbAdapter.setSetting(key, settings[key]);
        }
        return settings[key];
      }
    }

    // 2) IndexedDB
    const localValue = await dbAdapter.getSetting(key);
    if (localValue !== null && localValue !== undefined) {
      return localValue;
    }

    return defaultValue;
  };

  const setSetting = async (key: string, value: unknown): Promise<boolean> => {
    // 1) 立即写入 IndexedDB（防丢）
    await dbAdapter.setSetting(key, value);

    // 2) 尝试写酒馆
    if (tavernAvailable) {
      try {
        const settings = getExtensionSettings();
        if (settings) {
          settings[key] = value;
          const saved = await saveTavernSettings();
          if (saved) {
            await removeFromSyncQueue(key);
            return true;
          }
        }
      } catch (e) {
        logger.warn('[TavernSettingsSync] Tavern save failed:', e);
      }
      await addToSyncQueue(key, value);
    } else {
      await addToSyncQueue(key, value);
    }

    return false; // false = 仅本地保存或已排队
  };

  const forceSync = async (): Promise<boolean> => {
    tavernAvailable = checkTavernAvailable();
    if (tavernAvailable) {
      await processSyncQueue();
      return true;
    }
    return false;
  };

  const getStatus = async (): Promise<DndSyncStatus> => {
    const queue = await getSyncQueue();
    const pendingCount = Object.keys(queue).length;

    return {
      connected: !!tavernAvailable,
      pendingSync: pendingCount,
      statusText: tavernAvailable
        ? pendingCount > 0
          ? `<i class="fa-solid fa-cloud"></i> 在线 (${pendingCount} 待同步)`
          : '<i class="fa-solid fa-cloud"></i> 在线同步'
        : '<i class="fa-solid fa-ban"></i> 离线模式',
      statusClass: tavernAvailable ? (pendingCount > 0 ? 'warning' : 'success') : 'warning',
    };
  };

  return {
    setNotifyCallback,
    init,
    getCurrentChatId,
    saveToChat,
    getFromChat,
    deleteFromChat,
    syncToTavern,
    getSetting,
    setSetting,
    forceSync,
    getStatus,
  };
}