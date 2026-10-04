// features/dnd-core/data-manager/skills.ts
// DataManager · 技能专长块（自 BasedonST `src/data/DataManager.js` 移植，b2）
// 职责：getCharacterSkills / getCharacterFeats / getKnownSpells / getMaxSpellSlotLevel。
// 兼容策略：ID 直查 → 姓名回退（与 DND 模块读取行为一致）。

import type { DndDataTables } from './tables';
import type { DndDataParty } from './party';

export interface DndDataSkills {
  getCharacterSkills(charId: string): any[];
  getCharacterFeats(charId: string): any[];
  getKnownSpells(charId?: string | null): any[];
  getMaxSpellSlotLevel(char: any): number;
}

export interface DndDataSkillsDeps {
  tables: DndDataTables;
  party: DndDataParty;
}

export function createDndDataSkills(deps: DndDataSkillsDeps): DndDataSkills {
  const { tables, party } = deps;

  const getCharacterSkills = (charId: string): any[] => {
    const links = tables.getTable('CHARACTER_Skills');
    const library = tables.getTable('SKILL_Library');

    if (!links || !library) return [];

    // 兼容：ID 直查 → 姓名回退
    let charLinks = links.filter((l: any) => l['char_id'] === charId);

    if (charLinks.length === 0) {
      const partyData = party.getPartyData();
      const char = partyData.find((p: any) => p['姓名'] === charId);
      if (char) {
        const realId = char['CHAR_ID'];
        charLinks = links.filter((l: any) => l['char_id'] === realId);
      }
    }

    return charLinks.map((link: any) => {
      const skill = library.find((s: any) => s['skill_id'] === link['skill_id']);
      return { ...link, ...skill };
    });
  };

  const getCharacterFeats = (charId: string): any[] => {
    const links = tables.getTable('CHARACTER_Feats');
    const library = tables.getTable('FEAT_Library');

    if (!links || !library) return [];

    let charLinks = links.filter((l: any) => l['char_id'] === charId);

    if (charLinks.length === 0) {
      const partyData = party.getPartyData();
      const char = partyData.find((p: any) => p['姓名'] === charId);
      if (char) {
        const realId = char['CHAR_ID'];
        charLinks = links.filter((l: any) => l['char_id'] === realId);
      }
    }

    return charLinks.map((link: any) => {
      const feat = library.find((f: any) => f['feat_id'] === link['feat_id']);
      return { ...link, ...feat };
    });
  };

  // 获取已知法术（从技能库合成）
  const getKnownSpells = (charId?: string | null): any[] => {
    let cid = charId || null;
    if (!cid) {
      const partyData = party.getPartyData();
      const pc = partyData.find((p: any) => p.isPC);
      if (pc) cid = pc['CHAR_ID'];
    }

    if (!cid) return [];

    const links = tables.getTable('CHARACTER_Skills');
    const library = tables.getTable('SKILL_Library');

    if (!links || !library) return [];

    let charLinks = links.filter((l: any) => l['char_id'] === cid);

    if (charLinks.length === 0) {
      const partyData = party.getPartyData();
      const char = partyData.find((p: any) => p['姓名'] === cid);
      if (char) {
        const realId = char['CHAR_ID'];
        charLinks = links.filter((l: any) => l['char_id'] === realId);
      }
    }

    const spells: any[] = [];
    charLinks.forEach((link: any) => {
      const skill = library.find((s: any) => s['skill_id'] === link['skill_id']);
      // 仅当技能类型明确为「法术」时（防止武技被误判）
      if (skill && skill['技能类型'] === '法术') {
        spells.push({
          ...skill,
          ...link,
          '法术名称': skill['技能名称'], // 兼容旧字段名
          '已准备': link['已准备'],
        });
      }
    });

    return spells;
  };

  const getMaxSpellSlotLevel = (char: any): number => {
    if (!char || !char['法术位']) return 9; // 默认 9 以防万一
    const slots: any = tables.parseValue(char['法术位'], 'resources');
    if (!slots) return 0;

    let maxLevel = 0;
    Object.keys(slots).forEach(k => {
      let lvl = parseInt(k);
      if (isNaN(lvl)) {
        const m = k.match(/(\d+)/);
        if (m) lvl = parseInt(m[1]);
      }

      if (!isNaN(lvl) && lvl > maxLevel) {
        const valStr = slots[k].toString();
        const parts = valStr.split('/');
        if (parts.length >= 2) {
          const maxSlots = parseInt(parts[1]);
          if (!isNaN(maxSlots) && maxSlots > 0) {
            maxLevel = lvl;
          }
        } else {
          maxLevel = lvl;
        }
      }
    });
    return maxLevel;
  };

  return { getCharacterSkills, getCharacterFeats, getKnownSpells, getMaxSpellSlotLevel };
}