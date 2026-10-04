// features/dnd-core/settings-manager.ts
// DND 仪表盘设置管理器（自 BasedonST `src/core/SettingsManager.js` 移植，b1）
// 职责：API 配置读写（含 legacy 键兼容、双重序列化防御）。

import type { DndLogger } from './logger';
import type { DndSettingsSync, DndSyncStatus } from './settings-sync';

export interface DndAPIConfig {
  url: string;
  key: string;
  model: string;
  provider: string;
}

export interface DndAISettings {
  provider: string;
  apiConfig: DndAPIConfig;
}

export interface DndSettingsManager {
  init(): Promise<void>;
  getAPIConfig(): Promise<DndAPIConfig>;
  setAPIConfig(config: Partial<DndAPIConfig>): Promise<void>;
  getAISettings(): Promise<DndAISettings>;
  getSyncStatus(): Promise<DndSyncStatus>;
  forceSync(): Promise<boolean>;
}

export interface DndSettingsManagerDeps {
  logger: DndLogger;
  settingsSync: DndSettingsSync;
}

export function createDndSettingsManager(deps: DndSettingsManagerDeps): DndSettingsManager {
  const { logger, settingsSync } = deps;

  const init = async (): Promise<void> => {
    await settingsSync.init();
  };

  const getAPIConfig = async (): Promise<DndAPIConfig> => {
    // 使用新的混合存储；TavernSettingsSync 不自动添加前缀，需传完整 Key
    let saved: any = await settingsSync.getSetting('dnd_global_api_config', null);

    // [兼容性] 新存储为空时尝试读取旧 Key (Legacy)
    if (!saved) {
      try {
        const legacy = localStorage.getItem('dnd_creator_api_config');
        if (legacy) saved = legacy;
      } catch {
        /* ignore */
      }
    }

    let parsed: any = saved;

    if (typeof saved === 'string') {
      try {
        parsed = JSON.parse(saved);
      } catch {
        logger.warn('[SettingsManager] JSON parse failed, using raw value');
      }
    }

    // 防御性检查：防止双重序列化
    if (typeof parsed === 'string') {
      try {
        const doubleParsed = JSON.parse(parsed);
        if (doubleParsed && typeof doubleParsed === 'object') {
          parsed = doubleParsed;
        }
      } catch {
        /* ignore */
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      parsed = {};
    }

    return {
      url: parsed.url || '',
      key: parsed.key || '',
      model: parsed.model || '',
      provider: parsed.provider || 'plugin',
    };
  };

  const setAPIConfig = async (config: Partial<DndAPIConfig>): Promise<void> => {
    logger.info('[SettingsManager] Saving API Config:', config);
    await settingsSync.setSetting('dnd_global_api_config', config);
  };

  const getAISettings = async (): Promise<DndAISettings> => {
    const apiConfig = await getAPIConfig();
    return {
      provider: apiConfig.provider || 'plugin',
      apiConfig,
    };
  };

  const getSyncStatus = async (): Promise<DndSyncStatus> => {
    return await settingsSync.getStatus();
  };

  const forceSync = async (): Promise<boolean> => {
    return await settingsSync.forceSync();
  };

  return {
    init,
    getAPIConfig,
    setAPIConfig,
    getAISettings,
    getSyncStatus,
    forceSync,
  };
}