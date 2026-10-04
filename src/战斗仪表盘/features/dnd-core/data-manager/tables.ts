// features/dnd-core/data-manager/tables.ts
// DataManager · 表解析块（自 BasedonST `src/data/DataManager.js` 移植，b2）
// 职责：aliasMap 查表 / 数据解析（parseValue）/ 表格读取 / 系统通知。

import type { DndLogger } from '../logger';
import type { DndUtils } from '../utils';

export interface DndDataTablesDeps {
  logger: DndLogger;
  utils: DndUtils;
  saveData: (data: any) => Promise<unknown>;
}

export interface DndDataTables {
  findTableKey(rawData: any, nameFragment: string): string | null;
  applySystemNotification(rawData: any, text: string): void;
  setSystemNotification(text: string): Promise<void>;
  getAPI(): any;
  getCore(): ReturnType<DndUtils['getCore']>;
  parseValue(val: any, type?: string): any;
  getAllData(): any;
  parseSheet(sheet: any): any[];
  getTable(tableNameFragment: string): any[] | null;
}

export function createDndDataTables(deps: DndDataTablesDeps): DndDataTables {
  const { logger, utils } = deps;

  const getCore = (): ReturnType<DndUtils['getCore']> => utils.getCore();
  const getAPI = (): any => getCore().getDB();

  // 查找表键名（模糊匹配 + 19 张核心业务表的三语别名字典）
  const findTableKey = (rawData: any, nameFragment: string): string | null => {
    if (!rawData) return null;

    const aliasMap: Record<string, string> = {
      // 1. 系统与全局
      'SYS_GlobalState': '全局状态', 'SYS_GlobalStatus': '全局状态', 'quanjuzhuangtai': '全局状态',
      // 2. NPC 管理
      'NPC_Registry': 'NPC', 'npczhuce': 'NPC',
      // 3. 物品与背包
      'ITEM_Inventory': '背包', 'beibao': '背包',
      // 4. 任务系统
      'QUEST_Active': '任务', 'QUESTTracker': '任务', 'renwu': '任务',
      // 5. 阵营势力
      'FACTION_Standing': '势力', 'shilishengwang': '势力',
      // 6. 战斗遭遇
      'COMBAT_Encounter': '战斗遭遇', 'zhandouzaoyu': '战斗遭遇',
      // 7. 战术地图
      'COMBAT_BattleMap': '战斗地图', 'zhandouditu': '战斗地图',
      // 8. 轮次纪要
      'LOG_Summary': '纪要', 'jiyaobiao': '纪要',
      // 9. 行动选项
      'UI_ActionOptions': '行动选项', 'xingdongxuanxiang': '行动选项',
      // 10. 随机数骰子池
      'DICE_Pool': '骰子池', 'touzichi': '骰子池',
      // 11. 技能法术库
      'SKILL_Library': '技能/法术库', 'jinengfashuku': '技能/法术库', 'jinengku': '技能', 'fashuku': '法术',
      // 12. 角色技能关联
      'CHARACTER_Skills': '角色技能关联', 'juesejinengguanlian': '角色技能关联', 'jinengguanlian': '技能关联',
      // 13. 专长特性库
      'FEAT_Library': '专长库', 'zhuanchangku': '专长库', 'texingku': '专长库',
      // 14. 角色专长关联
      'CHARACTER_Feats': '角色专长关联', 'juesezhuanchangguanlian': '角色专长关联', 'zhuanchangguanlian': '专长关联',
      // 15. 角色档案
      'CHARACTER_Registry': '角色表', 'juesebiao': '角色表', 'juesezhuce': '角色表',
      // 16. 角色战斗属性
      'CHARACTER_Attributes': '角色属性', 'jueseshuxing': '角色属性',
      // 17. 角色资源池
      'CHARACTER_Resources': '角色资源', 'jueseziyuan': '角色资源',
      // 18. 探索地图数据
      'EXPLORATION_MapData': '探索地图数据', 'tansuoditushuju': '探索地图数据',
      // 19. 战斗地图绘制
      'COMBAT_Map_Visuals': '战斗地图绘制', 'zhandoudituhuizhi': '战斗地图绘制',
    };

    const target = aliasMap[nameFragment] || nameFragment;

    return (
      Object.keys(rawData).find(
        k =>
          k.toLowerCase().includes(nameFragment.toLowerCase()) ||
          (rawData[k].uid && rawData[k].uid.toLowerCase().includes(nameFragment.toLowerCase())) ||
          (rawData[k].name && rawData[k].name.includes(target)),
      ) || null
    );
  };

  // 在数据对象中应用系统通知（不立即保存）
  const applySystemNotification = (rawData: any, text: string): void => {
    if (!rawData) return;
    const sheetKey = Object.keys(rawData).find(
      k => k.includes('SYS_GlobalState') || (rawData[k].name && rawData[k].name.includes('全局状态')),
    );
    if (!sheetKey) return;

    const sheet = rawData[sheetKey];
    if (!sheet.content || sheet.content.length < 2) return;

    let colIndex = sheet.content[0].indexOf('系统通知');
    if (colIndex === -1) {
      sheet.content[0].push('系统通知');
      colIndex = sheet.content[0].length - 1;
      if (sheet.content[1].length <= colIndex) {
        sheet.content[1][colIndex] = null;
      }
    }

    sheet.content[1][colIndex] = text;
  };

  // 独立的设置通知函数（立即保存）
  const setSystemNotification = async (text: string): Promise<void> => {
    const rawData = getAllData();
    applySystemNotification(rawData, text);
    await deps.saveData(rawData);
  };

  // 通用解析器：支持 JSON 和自定义字符串格式
  const parseValue = (val: any, type = 'json'): any => {
    if (!val) return null;
    if (typeof val === 'object') return val;

    if (typeof val === 'string') {
      if (val.trim().startsWith('{') || val.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(val);
          if (parsed && typeof parsed === 'object') return parsed;
        } catch {
          /* ignore */
        }
      }

      if (type === 'stats') {
        const stats: Record<string, any> = {};
        if (val.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(val);
            if (parsed) return parsed;
          } catch {
            /* ignore */
          }
        }
        val.split('|').forEach(part => {
          const [k, v] = part.split(':');
          if (k && v) stats[k.trim()] = isNaN(v as any) ? v : parseInt(v);
        });
        return Object.keys(stats).length > 0 ? stats : null;
      }
      if (type === 'coord') {
        if (val.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(val);
            if (parsed) return parsed;
          } catch {
            /* ignore */
          }
        }
        if (val.includes(':') && !val.includes('{')) {
          const pos: Record<string, number> = {};
          val.split(',').forEach(p => {
            const [k, v] = p.split(':');
            if (k && v) pos[k.trim()] = parseFloat(v);
          });
          return pos;
        }
        const parts = val.split(',');
        if (parts.length >= 2) return { x: parseFloat(parts[0]), y: parseFloat(parts[1]) };
      }
      if (type === 'size') {
        if (val.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(val);
            if (parsed) return parsed;
          } catch {
            /* ignore */
          }
        }
        const parts = val.split(',');
        if (parts.length >= 2) return { w: parseFloat(parts[0]), h: parseFloat(parts[1]) };
      }
      if (type === 'resources') {
        if (val.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(val);
            if (parsed) return parsed;
          } catch {
            /* ignore */
          }
        }
        const res: Record<string, string> = {};
        val.split('|').forEach(part => {
          const [k, v] = part.split(':');
          if (k && v) res[k.trim()] = v.trim();
        });
        return Object.keys(res).length > 0 ? res : null;
      }
    }
    return null;
  };

  const getAllData = (): any => {
    try {
      const api = getAPI();
      if (!api || !api.exportTableAsJson) return null;
      const raw = api.exportTableAsJson();
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (e) {
      logger.warn('[data-manager] getAllData 失败:', e);
      return null;
    }
  };

  const parseSheet = (sheet: any): any[] => {
    if (!sheet || !sheet.content || sheet.content.length < 2) return [];
    const headers = sheet.content[0];
    const rows = sheet.content.slice(1);

    return rows.map((row: any[]) => {
      const obj: Record<string, any> = {};
      headers.forEach((h: any, i: number) => {
        if (h) {
          obj[h] = row[i];
          obj[String(h).trim().toLowerCase()] = row[i]; // 自动注入小写键
          obj[String(h).trim().toUpperCase()] = row[i]; // 自动注入大写键
        }
      });
      return obj;
    });
  };

  const getTable = (tableNameFragment: string): any[] | null => {
    const data = getAllData();
    if (!data) return null;
    const key = findTableKey(data, tableNameFragment);
    return key ? parseSheet(data[key]) : null;
  };

  return {
    findTableKey,
    applySystemNotification,
    setSystemNotification,
    getAPI,
    getCore,
    parseValue,
    getAllData,
    parseSheet,
    getTable,
  };
}