// features/dnd-core/item-manager.ts
// DND 仪表盘物品管理（自 BasedonST `src/data/ItemManager.js` 移植，b2）
// 职责：背包物品字段更新 / 数量归零删除 / 系统通知写入。

import type { DndLogger } from './logger';
import type { DndDataManager } from './data-manager';

export interface DndItemManager {
  update(itemId: string, changes: Record<string, any>, notificationText?: string | null): Promise<void>;
}

export interface DndItemManagerDeps {
  logger: DndLogger;
  dataManager: DndDataManager;
  saveData: (data: any) => Promise<unknown>;
}

export function createDndItemManager(deps: DndItemManagerDeps): DndItemManager {
  const { logger, dataManager } = deps;

  const update = async (itemId: string, changes: Record<string, any>, notificationText: string | null = null): Promise<void> => {
    const items = dataManager.getTable('ITEM_Inventory');
    if (!items) return;

    // 查找索引（物品ID / 物品名称 皆可匹配）
    let itemIndex = -1;
    items.find((item: any, index: number) => {
      if (item['物品ID'] === itemId || item['物品名称'] === itemId) {
        itemIndex = index;
        return true;
      }
      return false;
    });

    if (itemIndex === -1) {
      logger.error('[item-manager] Item not found:', itemId);
      return;
    }

    const rawData = dataManager.getAllData();
    if (!rawData) return;

    const sheetKey = Object.keys(rawData).find(
      k => k.includes('ITEM_Inventory') || (rawData[k].name && rawData[k].name.includes('背包')),
    );
    if (!sheetKey) return;

    const sheet = rawData[sheetKey];
    const headers = sheet.content[0];

    // items 数组索引 → sheet.content 行索引（+1 跳表头）
    const rowIndex = itemIndex + 1;

    Object.keys(changes).forEach(key => {
      const colIndex = headers.indexOf(key);
      if (colIndex !== -1) {
        sheet.content[rowIndex][colIndex] = changes[key];
      }
    });

    // 数量 <= 0 → 删除该行
    if (changes['数量'] !== undefined && changes['数量'] <= 0) {
      sheet.content.splice(rowIndex, 1);
    }

    // 通知文本写入全局状态表
    if (notificationText) {
      dataManager.applySystemNotification(rawData, notificationText);
    }

    await deps.saveData(rawData);
  };

  return { update };
}