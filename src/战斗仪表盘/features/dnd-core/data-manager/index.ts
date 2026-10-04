// features/dnd-core/data-manager/index.ts
// DataManager 域装配（b2）：4 块拼装 —— 表解析 / 队伍 / 技能专长 / 导入导出。
// 兼容说明：原 DataManager 单体对象对外 API 形状保持不变（展开合并）。

import type { DndLogger } from '../logger';
import type { DndUtils } from '../utils';
import { createDndDataTables, type DndDataTables } from './tables';
import { createDndDataParty, type DndDataParty } from './party';
import { createDndDataSkills, type DndDataSkills } from './skills';
import { createDndDataIO, type DndDataIO } from './io';

export type DndDataManager = DndDataTables & DndDataParty & DndDataSkills & DndDataIO;

export interface DndDataManagerDeps {
  logger: DndLogger;
  utils: DndUtils;
  saveData: (data: any) => Promise<unknown>;
}

export function createDndDataManager(deps: DndDataManagerDeps): DndDataManager {
  const tables = createDndDataTables({ logger: deps.logger, utils: deps.utils, saveData: deps.saveData });
  const party = createDndDataParty({ tables });
  const skills = createDndDataSkills({ tables, party });
  const io = createDndDataIO({ logger: deps.logger, tables, party, skills, saveData: deps.saveData });

  return {
    ...tables,
    ...party,
    ...skills,
    ...io,
  };
}

export type { DndDataTables } from './tables';
export type { DndDataParty } from './party';
export type { DndDataSkills } from './skills';
export type { DndDataIO } from './io';