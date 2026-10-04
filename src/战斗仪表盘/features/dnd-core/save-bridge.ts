// features/dnd-core/save-bridge.ts
// DND 仪表盘数据保存桥接（b2）
// 背景：原 DiceManager.saveData（b9 批次）负责"ST.chat 注入 + api.importTableAsJson"。
// b2 阶段先提供精简版：ensureProperFormat + api.importTableAsJson 主通道；
// b9 骰子归一时可将本桥接替换为完整实现（ST 注入 + UpdateController 包裹）。

import type { DndLogger } from './logger';
import type { DndUtils } from './utils';

export interface DndSaveBridge {
  ensureProperFormat(data: any): any;
  saveData(data: any): Promise<boolean>;
}

export interface DndSaveBridgeDeps {
  logger: DndLogger;
  utils: DndUtils;
}

export function createDndSaveBridge(deps: DndSaveBridgeDeps): DndSaveBridge {
  const { logger, utils } = deps;

  // 确保数据格式符合标准（参考自兼容性可视化表格 v9.0）
  const ensureProperFormat = (data: any): any => {
    if (!data) return data;

    if (data.mate && data.mate.type === 'chatSheets') {
      return data;
    }

    const result = JSON.parse(JSON.stringify(data));
    const hasSheets = Object.keys(result).some(key => key.startsWith('sheet_'));

    if (hasSheets && !result.mate) {
      result.mate = {
        type: 'chatSheets',
        version: 2,
        schema: 'DND5E_TextRPG',
        created: Date.now(),
      };
    }

    return result;
  };

  const saveData = async (data: any): Promise<boolean> => {
    try {
      const api = utils.getCore().getDB();
      if (!api || !api.importTableAsJson) {
        logger.error('[save-bridge] 无法保存数据：importTableAsJson 不可用');
        return false;
      }
      const formatted = ensureProperFormat(data);
      await api.importTableAsJson(JSON.stringify(formatted));
      logger.debug('[save-bridge] 已调用 api.importTableAsJson');
      return true;
    } catch (e) {
      logger.error('[save-bridge] 保存过程异常:', e);
      return false;
    }
  };

  return { ensureProperFormat, saveData };
}