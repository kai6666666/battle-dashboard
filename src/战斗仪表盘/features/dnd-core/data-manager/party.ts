// features/dnd-core/data-manager/party.ts
// DataManager · 队伍块（自 BasedonST `src/data/DataManager.js` 移植，b2）
// 职责：getPartyData（三表合并）、parseCharacterStatus（状态解析）。

import type { DndDataTables } from './tables';

export interface DndDataParty {
  getPartyData(): any[];
  parseCharacterStatus(char: any): any[];
}

export interface DndDataPartyDeps {
  tables: DndDataTables;
}

export function createDndDataParty(deps: DndDataPartyDeps): DndDataParty {
  const { tables } = deps;

  const getPartyData = (): any[] => {
    const charReg = tables.getTable('CHARACTER_Registry');
    const charAttr = tables.getTable('CHARACTER_Attributes');
    const charRes = tables.getTable('CHARACTER_Resources');

    if (!charReg) return [];

    const party: any[] = [];

    charReg.forEach((char: any) => {
      const charId = char['CHAR_ID'];
      const attr = charAttr ? charAttr.find((a: any) => a['CHAR_ID'] === charId) : {};
      const res = charRes ? charRes.find((r: any) => r['CHAR_ID'] === charId) : {};

      const type = char['成员类型'] === '主角' ? 'PC' : 'NPC';
      const isPC = type === 'PC';

      const merged = { ...char, ...attr, ...res, type, isPC };
      party.push(merged);
    });

    return party;
  };

  // 解析角色状态数据（用于状态栏显示）：concentration / exhaustion 等
  const parseCharacterStatus = (char: any): any[] => {
    if (!char) return [];

    const statuses: any[] = [];

    const statusConfig: Record<string, any> = {
      '专注': { key: 'concentration', icon: 'fa-eye', color: 'var(--dnd-accent-blue)', label: '专注' },
      '力竭': { key: 'exhaustion', icon: 'fa-battery-quarter', color: 'var(--dnd-accent-red)', label: '力竭' },
      '专注中': { key: 'concentration', icon: 'fa-eye', color: 'var(--dnd-accent-blue)', label: '专注' },
      'concentration': { key: 'concentration', icon: 'fa-eye', color: 'var(--dnd-accent-blue)', label: '专注' },
      'exhaustion': { key: 'exhaustion', icon: 'fa-battery-quarter', color: 'var(--dnd-accent-red)', label: '力竭' },
    };

    const parseExhaustionLevel = (val: any): number | null => {
      if (!val) return null;
      const match = val.toString().match(/力竭[：:\s]*(\d)/);
      if (match) return parseInt(match[1]);
      return null;
    };

    // 1. 检查「附着状态」字段
    if (char['附着状态']) {
      const statusStr = char['附着状态'].toString();
      if (statusStr.includes('专注')) {
        statuses.push({ ...statusConfig['专注'], type: 'buff' });
      }
      if (statusStr.includes('力竭')) {
        const level = parseExhaustionLevel(statusStr);
        statuses.push({
          ...statusConfig['力竭'],
          type: 'debuff',
          level,
          label: level ? `力竭${level}` : '力竭',
        });
      }
    }

    // 2. 检查「状态」字段
    if (char['状态']) {
      const statusStr = char['状态'].toString();
      Object.keys(statusConfig).forEach(key => {
        if (statusStr.includes(key) && !statuses.find(s => s.key === statusConfig[key].key)) {
          const level = key === '力竭' || key === 'exhaustion' ? parseExhaustionLevel(statusStr) : null;
          statuses.push({
            ...statusConfig[key],
            type: key === '力竭' || key === 'exhaustion' ? 'debuff' : 'buff',
            level,
            label: level ? `${statusConfig[key].label}${level}` : statusConfig[key].label,
          });
        }
      });
    }

    // 3. 检查「当前状态」字段
    if (char['当前状态']) {
      const statusStr = char['当前状态'].toString();
      Object.keys(statusConfig).forEach(key => {
        if (statusStr.includes(key) && !statuses.find(s => s.key === statusConfig[key].key)) {
          const level = key === '力竭' || key === 'exhaustion' ? parseExhaustionLevel(statusStr) : null;
          statuses.push({
            ...statusConfig[key],
            type: key === '力竭' || key === 'exhaustion' ? 'debuff' : 'buff',
            level,
            label: level ? `${statusConfig[key].label}${level}` : statusConfig[key].label,
          });
        }
      });
    }

    // 4. 单独的力竭等级字段
    if (char['力竭等级'] || char['exhaustion_level']) {
      const level = parseInt(char['力竭等级'] || char['exhaustion_level']);
      if (level > 0 && !statuses.find(s => s.key === 'exhaustion')) {
        statuses.push({
          ...statusConfig['力竭'],
          type: 'debuff',
          level,
          label: `力竭${level}`,
        });
      }
    }

    // 5. 专注状态字段
    if (
      char['专注中'] === '是' ||
      char['专注中'] === true ||
      char['专注中'] === 'true' ||
      char['专注中'] === 1 ||
      char['专注中'] === '1'
    ) {
      if (!statuses.find(s => s.key === 'concentration')) {
        statuses.push({ ...statusConfig['专注'], type: 'buff' });
      }
    }

    return statuses;
  };

  return { getPartyData, parseCharacterStatus };
}