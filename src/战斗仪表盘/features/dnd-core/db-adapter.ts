// features/dnd-core/db-adapter.ts
// DND 仪表盘 IndexedDB 适配器（自 BasedonST `src/core/DBAdapter.js` 移植，b1）
// 工厂 + DI：连接状态（db / openPromise）收进闭包；LocalStorage 兜底原样保留。

import type { DndLogger } from './logger';

export interface DndStorageAnalysis {
  totalBytes: number;
  totalMB: string;
  breakdown: Record<string, number>;
  topKeys: Array<{ key: string; size: number }>;
}

export interface DndDBAdapter {
  init(): Promise<any>;
  put(key: string, value: unknown): Promise<any>;
  get(key: string): Promise<any>;
  getSetting(key: string): Promise<any>;
  setSetting(key: string, value: unknown): Promise<any>;
  setSVG(key: string, value: unknown): Promise<any>;
  getSVG(key: string): Promise<any>;
  delete(key: string): Promise<any>;
  clearStore(storeName: string): Promise<any>;
  clearAvatars(): Promise<any>;
  clearMaps(): Promise<any>;
  migrateFromLocalStorage(): Promise<void>;
  analyzeStorage(): DndStorageAnalysis;
}

export interface DndDBAdapterDeps {
  logger: DndLogger;
}

export function createDndDBAdapter(deps: DndDBAdapterDeps): DndDBAdapter {
  const { logger } = deps;

  const dbName = 'DND_Immersive_DB';
  const storeName = 'avatars';
  const settingsStore = 'settings';
  const svgStore = 'svg_maps';
  const version = 7;

  let db: any = null;
  let openPromise: Promise<any> | null = null;

  const init = (): Promise<any> => {
    if (db) return Promise.resolve(db);
    if (openPromise) return openPromise;

    openPromise = new Promise((resolve, reject) => {
      const indexedDBRef =
        (window as any).indexedDB ||
        (window as any).mozIndexedDB ||
        (window as any).webkitIndexedDB ||
        (window as any).msIndexedDB;
      if (!indexedDBRef) {
        logger.error('[DND DB] Browser does not support IndexedDB');
        openPromise = null;
        return reject('IndexedDB not supported');
      }

      // [Fix] 超时保护，避免卡死阻塞 LocalStorage 兜底
      const timeoutId = setTimeout(() => {
        if (openPromise) {
          logger.warn('[DND DB] Connection timed out. Using fallback.');
          openPromise = null;
          reject('Connection timeout');
        }
      }, 2000);

      const request = indexedDBRef.open(dbName, version);

      request.onblocked = () => {
        logger.warn('[DND DB] Database blocked. Please close other tabs.');
      };

      request.onerror = (e: any) => {
        clearTimeout(timeoutId);
        logger.error('[DND DB] Open Error:', e?.target?.error);
        openPromise = null;
        reject(e?.target?.error);
      };

      request.onsuccess = (e: any) => {
        clearTimeout(timeoutId);
        const opened = e.target.result;
        db = opened;

        opened.onclose = () => {
          logger.warn('[DND DB] Database connection closed unexpectedly.');
          db = null;
          openPromise = null;
        };

        opened.onversionchange = () => {
          logger.warn('[DND DB] Database version changed. Closing connection.');
          opened.close();
          db = null;
          openPromise = null;
        };

        resolve(opened);
      };

      request.onupgradeneeded = (e: any) => {
        const upgraded = e.target.result;
        if (!upgraded.objectStoreNames.contains(storeName)) {
          upgraded.createObjectStore(storeName);
        }
        if (!upgraded.objectStoreNames.contains(settingsStore)) {
          upgraded.createObjectStore(settingsStore);
        }
        if (!upgraded.objectStoreNames.contains(svgStore)) {
          upgraded.createObjectStore(svgStore);
        }
      };
    });

    return openPromise;
  };

  // 通用操作 helper
  const op = async (
    targetStore: string,
    mode: 'readonly' | 'readwrite',
    callback: (store: any) => any,
  ): Promise<any> => {
    try {
      const opened = await init();
      return new Promise((resolve, reject) => {
        let transaction: any;
        try {
          transaction = opened.transaction([targetStore], mode);
        } catch (err) {
          // 连接失效时重试一次
          logger.warn('[DND DB] Transaction creation failed, retrying connection...', err);
          db = null;
          openPromise = null;
          init()
            .then(newDb => {
              try {
                transaction = newDb.transaction([targetStore], mode);
                const store = transaction.objectStore(targetStore);
                const request = callback(store);
                request.onsuccess = (e: any) => resolve(e.target.result);
                request.onerror = (e: any) => reject(e.target.error);
              } catch (retryErr) {
                logger.error('[DND DB] Retry failed:', retryErr);
                reject(retryErr);
              }
            })
            .catch(reinitErr => {
              logger.error('[DND DB] Re-init failed:', reinitErr);
              reject(reinitErr);
            });
          return;
        }

        const store = transaction.objectStore(targetStore);
        const request = callback(store);

        request.onsuccess = (e: any) => resolve(e.target.result);
        request.onerror = (e: any) => {
          logger.error(`[DND DB] Op Error (${targetStore}):`, e?.target?.error);
          reject(e?.target?.error);
        };
      });
    } catch (e) {
      logger.error(`[DND DB] Operation Failed (${targetStore}):`, e);
      return undefined; // 失败返回 undefined，让兜底逻辑继续工作
    }
  };

  const put = async (key: string, value: unknown) =>
    op(storeName, 'readwrite', store => store.put(value, key));

  const get = async (key: string) => op(storeName, 'readonly', store => store.get(key));

  const setSetting = async (key: string, value: unknown) =>
    op(settingsStore, 'readwrite', store => store.put(value, key));

  const setSVG = async (key: string, value: unknown) =>
    op(svgStore, 'readwrite', store => store.put(value, key));

  const getSVG = async (key: string) => op(svgStore, 'readonly', store => store.get(key));

  const getSetting = async (key: string): Promise<any> => {
    // 优先 DB
    try {
      const val = await op(settingsStore, 'readonly', store => store.get(key));
      if (val !== undefined && val !== null) return val;
    } catch (e) {
      logger.warn('[DND DB] DB Get failed', e);
    }

    // [Fallback] LocalStorage
    try {
      const lsVal = localStorage.getItem(key);
      if (lsVal) return lsVal;
    } catch {
      /* ignore */
    }

    return null;
  };

  const remove = async (key: string) => op(storeName, 'readwrite', store => store.delete(key));

  const clearStore = async (target: string) => op(target, 'readwrite', store => store.clear());

  const clearAvatars = async () => clearStore(storeName);

  const clearMaps = async () => clearStore(svgStore);

  const migrateFromLocalStorage = async (): Promise<void> => {
    let keys: string[] = [];
    try {
      keys = Object.keys(localStorage);
    } catch {
      return;
    }
    let count = 0;
    for (const k of keys) {
      if (!k.startsWith('dnd_')) continue;
      const val = localStorage.getItem(k);
      if (!val) continue;
      try {
        if (k.startsWith('dnd_avatar_')) {
          // 头像体积大：搬进 DB 并从 LS 删除
          await put(k.replace('dnd_avatar_', ''), val);
          localStorage.removeItem(k);
          count++;
        } else {
          await setSetting(k, val);
          // 设置保留 LS 作为备份
        }
      } catch {
        logger.warn('Migration failed for', k);
      }
    }
    if (count > 0) logger.info(`[DND Storage] Migrated ${count} items to DB.`);
  };

  const analyzeStorage = (): DndStorageAnalysis => {
    let total = 0;
    const usage: Record<string, number> = {};
    const details: Array<{ key: string; size: number }> = [];

    try {
      for (const k of Object.keys(localStorage)) {
        const raw = localStorage.getItem(k);
        if (raw === null) continue;
        const len = (raw.length + k.length) * 2;
        total += len;

        let prefix = 'Other';
        if (k.startsWith('dnd_')) prefix = 'DND Script';
        else if (k.startsWith('SillyTavern') || k.startsWith('settings')) prefix = 'SillyTavern System';
        else if (k.includes('chat')) prefix = 'Chats/Logs';
        else if (k.includes('character')) prefix = 'Characters';

        usage[prefix] = (usage[prefix] || 0) + len;
        details.push({ key: k, size: len });
      }
    } catch {
      /* ignore */
    }

    details.sort((a, b) => b.size - a.size);

    return {
      totalBytes: total,
      totalMB: (total / 1024 / 1024).toFixed(2),
      breakdown: usage,
      topKeys: details.slice(0, 5),
    };
  };

  return {
    init,
    put,
    get,
    getSetting,
    setSetting,
    setSVG,
    getSVG,
    delete: remove,
    clearStore,
    clearAvatars,
    clearMaps,
    migrateFromLocalStorage,
    analyzeStorage,
  };
}