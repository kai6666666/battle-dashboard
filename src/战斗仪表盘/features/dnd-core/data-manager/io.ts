// features/dnd-core/data-manager/io.ts
// DataManager · 导入导出块（自 BasedonST `src/data/DataManager.js` 移植，b2）
// 职责：队伍导出/导入（append/replace）、FVTT 角色导入、主角切换、ST Persona 同步。

import type { DndLogger } from '../logger';
import type { DndDataTables } from './tables';
import type { DndDataParty } from './party';
import type { DndDataSkills } from './skills';

export interface DndDataIO {
  exportPartyData(selectedCharIds?: string[] | null): any | null;
  importPartyData(jsonData: any, options?: { mode?: 'append' | 'replace'; selectedCharIds?: string[] | null }): Promise<any>;
  importFVTTData(json: any): Promise<any>;
  updateMainCharacterInDB(targetCharId: string): Promise<any>;
  syncSTUserPersona(name: string): Promise<void>;
}

export interface DndDataIODeps {
  logger: DndLogger;
  tables: DndDataTables;
  party: DndDataParty;
  skills: DndDataSkills;
  saveData: (data: any) => Promise<unknown>;
}

export function createDndDataIO(deps: DndDataIODeps): DndDataIO {
  const { logger, tables, party, skills } = deps;

  // 导出队伍数据为 JSON（支持选择性导出）
  const exportPartyData = (selectedCharIds: string[] | null = null): any | null => {
    const partyData = party.getPartyData();
    if (!partyData || partyData.length === 0) {
      logger.warn('[data-manager] 无队伍数据可导出');
      return null;
    }
    
    return exportPartyDataWith(partyData, selectedCharIds);
  };

  const exportPartyDataWith = (partyData: any[], selectedCharIds: string[] | null): any | null => {
    let exportParty = partyData;
    if (selectedCharIds && Array.isArray(selectedCharIds) && selectedCharIds.length > 0) {
      exportParty = partyData.filter((char: any) => {
        const charId = char['CHAR_ID'] || char['PC_ID'] || char['姓名'];
        return selectedCharIds.includes(charId);
      });
    }

    if (exportParty.length === 0) {
      logger.warn('[data-manager] 没有选中任何角色');
      return null;
    }

    const exportData: any = {
      version: '1.1',
      exportDate: new Date().toISOString(),
      exportSource: 'DND_Dashboard_Immersive',
      party: [],
      skills: {},
      feats: {},
      spells: {},
    };

    exportParty.forEach((char: any) => {
      const charId = char['CHAR_ID'] || char['PC_ID'] || char['姓名'];

      exportData.party.push({ ...char });

      const charSkills = skills.getCharacterSkills(charId);
      if (charSkills && charSkills.length > 0) {
        exportData.skills[charId] = charSkills;
      }

      const feats = skills.getCharacterFeats(charId);
      if (feats && feats.length > 0) {
        exportData.feats[charId] = feats;
      }

      const spells = skills.getKnownSpells(charId);
      if (spells && spells.length > 0) {
        exportData.spells[charId] = spells;
      }
    });

    return exportData;
  };

  // 导入队伍数据（mode: append 追加 | replace 替换）
  const importPartyData = async (
    jsonData: any,
    options: { mode?: 'append' | 'replace'; selectedCharIds?: string[] | null } = {},
  ): Promise<any> => {
    try {
      const { mode = 'append', selectedCharIds = null } = options;

      if (!jsonData || !jsonData.party || !Array.isArray(jsonData.party)) {
        return { success: false, message: '无效的数据格式' };
      }

      let partyToImport = jsonData.party;
      if (selectedCharIds && Array.isArray(selectedCharIds) && selectedCharIds.length > 0) {
        partyToImport = jsonData.party.filter((char: any) => {
          const charId = char['CHAR_ID'] || char['PC_ID'] || char['姓名'];
          return selectedCharIds.includes(charId);
        });
      }

      if (partyToImport.length === 0) {
        return { success: false, message: '没有选中任何角色' };
      }

      const filteredSkills: Record<string, any> = {};
      const filteredFeats: Record<string, any> = {};
      const filteredSpells: Record<string, any> = {};

      if (selectedCharIds && selectedCharIds.length > 0) {
        selectedCharIds.forEach(charId => {
          if (jsonData.skills && jsonData.skills[charId]) {
            filteredSkills[charId] = jsonData.skills[charId];
          }
          if (jsonData.feats && jsonData.feats[charId]) {
            filteredFeats[charId] = jsonData.feats[charId];
          }
          if (jsonData.spells && jsonData.spells[charId]) {
            filteredSpells[charId] = jsonData.spells[charId];
          }
        });
      } else {
        Object.assign(filteredSkills, jsonData.skills || {});
        Object.assign(filteredFeats, jsonData.feats || {});
        Object.assign(filteredSpells, jsonData.spells || {});
      }

      const rawData = tables.getAllData();
      if (!rawData) return { success: false, message: '无法读取数据库' };

      // 替换模式：先清空现有队伍数据
      if (mode === 'replace') {
        const clearTable = (tableNameFragment: string) => {
          const tableKey = tables.findTableKey(rawData, tableNameFragment);
          if (!tableKey) return;
          const sheet = rawData[tableKey];
          if (!sheet || !sheet.content || sheet.content.length < 1) return;
          sheet.content = [sheet.content[0]]; // 保留表头
        };

        clearTable('CHARACTER_Registry');
        clearTable('CHARACTER_Attributes');
        clearTable('CHARACTER_Resources');
        clearTable('CHARACTER_Skills');
        clearTable('CHARACTER_Feats');
      }

      // 处理单个表的更新/插入（兼容 CHAR_ID/char_id/PC_ID/pc_id/姓名）
      const processTable = (tableNameFragment: string, dataList: any[]) => {
        const tableKey = tables.findTableKey(rawData, tableNameFragment);
        if (!tableKey) return;

        const sheet = rawData[tableKey];
        if (!sheet || !sheet.content || sheet.content.length < 1) return;

        const headers = sheet.content[0];
        let idColName: string | null = null;
        for (const cand of ['CHAR_ID', 'char_id', 'PC_ID', 'pc_id']) {
          if (headers.includes(cand)) {
            idColName = cand;
            break;
          }
        }
        if (!idColName && headers.includes('姓名')) idColName = '姓名';
        if (!idColName) return;

        const idIdx = headers.indexOf(idColName);
        if (idIdx === -1) return;

        dataList.forEach((item: any) => {
          const itemId =
            item[idColName!] !== undefined
              ? item[idColName!]
              : item['CHAR_ID'] !== undefined
                ? item['CHAR_ID']
                : item['char_id'] !== undefined
                  ? item['char_id']
                  : item['PC_ID'] !== undefined
                    ? item['PC_ID']
                    : item['pc_id'] !== undefined
                      ? item['pc_id']
                      : item['姓名'];
          if (!itemId) return;

          let rowIdx = -1;
          for (let i = 1; i < sheet.content.length; i++) {
            const rowVal = sheet.content[i][idIdx];
            if (rowVal === itemId) {
              rowIdx = i;
              break;
            }
          }

          if (rowIdx !== -1) {
            headers.forEach((h: string, colIdx: number) => {
              let v = item[h];
              if (v === undefined && typeof h === 'string') {
                v = item[h.toLowerCase()];
                if (v === undefined) v = item[h.toUpperCase()];
              }
              if (v !== undefined) {
                sheet.content[rowIdx][colIdx] = v;
              }
            });
          } else {
            const newRow = headers.map((h: string) => {
              let v = item[h];
              if (v === undefined && typeof h === 'string') {
                v = item[h.toLowerCase()];
                if (v === undefined) v = item[h.toUpperCase()];
              }
              return v !== undefined ? v : null;
            });
            const idVal =
              item[idColName!] !== undefined
                ? item[idColName!]
                : item['CHAR_ID'] !== undefined
                  ? item['CHAR_ID']
                  : item['char_id'] !== undefined
                    ? item['char_id']
                    : item['姓名'];
            if (idVal !== undefined) {
              newRow[idIdx] = idVal;
            }
            sheet.content.push(newRow);
          }
        });
      };

      processTable('CHARACTER_Registry', partyToImport);
      processTable('CHARACTER_Attributes', partyToImport);
      processTable('CHARACTER_Resources', partyToImport);

      // 处理关联数据（技能/专长/法术）
      const processAuxData = (
        dataMap: Record<string, any>,
        libTableName: string,
        linkTableName: string,
        idField: string,
        nameField: string,
        typeField: string | null = null,
        fixedType: string | null = null,
      ) => {
        if (!dataMap) return;

        const libKey = tables.findTableKey(rawData, libTableName);
        const linkKey = tables.findTableKey(rawData, linkTableName);
        if (!libKey || !linkKey) return;

        const libSheet = rawData[libKey];
        const linkSheet = rawData[linkKey];
        const libHeaders = libSheet.content[0];
        const linkHeaders = linkSheet.content[0];

        Object.keys(dataMap).forEach(charId => {
          const items = dataMap[charId];
          if (!Array.isArray(items)) return;

          items.forEach((item: any) => {
            // 1. 库表（Library）
            let itemId = item[idField];
            const itemName = item[nameField];

            let libRowIdx = -1;
            const libIdColIdx = libHeaders.indexOf(idField);
            const libNameColIdx = libHeaders.indexOf(nameField);

            if (itemId && libIdColIdx !== -1) {
              libRowIdx = libSheet.content.findIndex((r: any[], i: number) => i > 0 && r[libIdColIdx] === itemId);
            }

            if (libRowIdx === -1 && itemName && libNameColIdx !== -1) {
              libRowIdx = libSheet.content.findIndex((r: any[], i: number) => i > 0 && r[libNameColIdx] === itemName);
              if (libRowIdx !== -1) {
                itemId = libSheet.content[libRowIdx][libIdColIdx];
              }
            }

            if (libRowIdx === -1) {
              if (!itemId)
                itemId = (idField.startsWith('SKILL') ? 'SKL_' : 'FEAT_') + Math.random().toString(36).substr(2, 8);

              const newRow = libHeaders.map((h: string) => {
                if (h === idField) return itemId;
                if (fixedType && h === typeField) return fixedType;
                return item[h] !== undefined ? item[h] : null;
              });
              libSheet.content.push(newRow);
            }

            // 2. 关联表（Link）
            const linkCharColIdx = linkHeaders.findIndex((h: string) => ['char_id', 'CHAR_ID'].includes(String(h).trim()));
            const linkItemColIdx = linkHeaders.findIndex((h: string) =>
              [idField.toLowerCase(), idField.toUpperCase(), idField].includes(String(h).trim()),
            );

            if (linkCharColIdx !== -1 && linkItemColIdx !== -1) {
              const linkExists = linkSheet.content.some(
                (r: any[], i: number) => i > 0 && r[linkCharColIdx] === charId && r[linkItemColIdx] === itemId,
              );

              if (!linkExists) {
                const newLinkRow = linkHeaders.map((h: string) => {
                  const col = String(h).trim().toLowerCase();
                  if (['skill_link_id', 'feat_link_id', 'link_id'].includes(col)) {
                    return (
                      (idField.toLowerCase().includes('skill') ? 'SLINK_' : 'FLINK_') + Math.random().toString(36).substr(2, 6)
                    );
                  }
                  if (col === 'char_id') return charId;
                  if (col === idField.toLowerCase() || col === idField.toUpperCase()) return itemId;
                  if (col === '已准备' || col === 'yi_zhun_bei') return '是';
                  return item[h] !== undefined ? item[h] : null;
                });
                linkSheet.content.push(newLinkRow);
              }
            }
          });
        });
      };

      processAuxData(filteredSkills, 'SKILL_Library', 'CHARACTER_Skills', 'SKILL_ID', '技能名称');
      processAuxData(filteredSpells, 'SKILL_Library', 'CHARACTER_Skills', 'SKILL_ID', '技能名称', '技能类型', '法术');
      processAuxData(filteredFeats, 'FEAT_Library', 'CHARACTER_Feats', 'FEAT_ID', '专长名称');

      await deps.saveData(rawData);

      const modeText = mode === 'replace' ? '替换' : '追加';
      return {
        success: true,
        message: `成功${modeText}导入 ${partyToImport.length} 个角色`,
        count: partyToImport.length,
      };
    } catch (err: any) {
      logger.error('[data-manager] 导入队伍数据失败:', err);
      return { success: false, message: '导入失败: ' + err.message };
    }
  };

  // 导入 FVTT 角色数据
  const importFVTTData = async (json: any): Promise<any> => {
    try {
      const api = tables.getAPI();
      if (!api) return { success: false, message: 'API 不可用' };

      if (!json.name || !json.system) {
        return { success: false, message: '无效的 FVTT 角色文件' };
      }

      const name = json.name;
      const sys = json.system;
      const details = sys.details || {};
      const abilities = sys.abilities || {};
      const attributes = sys.attributes || {};

      const classItems = (json.items || []).filter((i: any) => i.type === 'class');
      const classStr =
        classItems.map((c: any) => `${c.name} ${c.system?.levels || 1}`).join(' / ') || '平民 1';
      const level = details.level || classItems.reduce((acc: number, c: any) => acc + (c.system?.levels || 0), 0) || 1;

      const raceItem = (json.items || []).find((i: any) => i.type === 'race');
      const raceStr = raceItem ? raceItem.name : details.race || '未知种族';

      const stats: Record<string, any> = {};
      const abbrMap: Record<string, string> = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
      Object.keys(abilities).forEach(k => {
        if (abbrMap[k]) stats[abbrMap[k]] = abilities[k].value || 10;
      });

      const skillMap: Record<string, string> = {
        acr: '杂技', ani: '驯兽', arc: '奥秘', ath: '运动', dec: '欺瞒', his: '历史', ins: '洞悉', itm: '威吓',
        inv: '调查', med: '医药', nat: '自然', prc: '察觉', prf: '表演', per: '说服', rel: '宗教', slt: '手法',
        ste: '隐匿', sur: '生存',
      };
      const profSkills: string[] = [];
      if (sys.skills) {
        Object.keys(sys.skills).forEach(k => {
          if (sys.skills[k].value >= 1) {
            profSkills.push(skillMap[k] || k);
          }
        });
      }

      const saves: string[] = [];
      Object.keys(abilities).forEach(k => {
        if (abilities[k].proficient >= 1) saves.push(skillMap[k] || k.toUpperCase());
      });

      const charData: any = {
        'CHAR_ID': 'FVTT_' + Date.now(),
        '成员类型': '同伴',
        '姓名': name,
        '种族/性别/年龄': `${raceStr} / - / -`,
        '职业': classStr,
        '外貌描述': details.appearance || '',
        '性格特点': (details.trait || '') + ' ' + (details.ideal || '') + ' ' + (details.bond || '') + ' ' + (details.flaw || ''),
        '背景故事': details.biography?.value?.replace(/<[^>]+>/g, '') || '',
        '加入时间': new Date().toISOString().slice(0, 10),
        '等级': level,
        'HP': `${attributes.hp?.value || 0}/${attributes.hp?.max || 1}`,
        'AC': attributes.ac?.value || 10,
        '先攻加值': attributes.init?.total || 0,
        '速度': attributes.movement?.walk ? `${attributes.movement.walk}尺` : '30尺',
        '属性值': JSON.stringify(stats),
        '豁免熟练': JSON.stringify(saves),
        '技能熟练': JSON.stringify(profSkills),
        '被动感知': sys.skills?.prc?.passive || 10,
        '法术位': '',
        '金币': sys.currency ? (sys.currency.gp || 0) : 0,
        '生命骰': `${attributes.hd || 0}/${attributes.hd || 0}`,
      };

      const inventory: any[] = [];
      (json.items || []).forEach((item: any) => {
        if (['weapon', 'equipment', 'consumable', 'loot', 'backpack'].includes(item.type)) {
          inventory.push({
            '物品ID': item.name,
            '物品名称': item.name,
            '类别': item.type === 'weapon' ? '武器' : (item.type === 'equipment' ? '护甲' : '杂物'),
            '数量': item.system?.quantity || 1,
            '已装备': item.system?.equipped ? '是' : '否',
            '所属人': name,
            '稀有度': item.system?.rarity || '普通',
            '描述': item.system?.description?.value?.replace(/<[^>]+>/g, '') || '',
            '重量': item.system?.weight || 0,
            '价值': item.system?.price?.value ? `${item.system.price.value}gp` : '-',
          });
        }
      });

      const spells: any[] = [];
      (json.items || []).forEach((item: any) => {
        if (item.type === 'spell') {
          spells.push({
            'SKILL_ID': item.name,
            '技能名称': item.name,
            '技能类型': '法术',
            '环阶': item.system?.level || 0,
            '学派': item.system?.school || '-',
            '施法时间': item.system?.activation?.type || '-',
            '射程': item.system?.range?.value ? `${item.system.range.value} ${item.system.range.units}` : '-',
            '成分': item.system?.components
              ? Object.keys(item.system.components).filter(k => item.system.components[k]).join(',').toUpperCase()
              : '-',
            '持续时间': item.system?.duration?.value ? `${item.system.duration.value} ${item.system.duration.units}` : '-',
            '效果描述': item.system?.description?.value?.replace(/<[^>]+>/g, '') || '',
          });
        }
      });

      const rawData = api.exportTableAsJson();
      const tableData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

      const regKey = tables.findTableKey(tableData, 'CHARACTER_Registry');
      const regSheet = regKey ? tableData[regKey] : null;
      if (regSheet && regSheet.content) {
        const headers = regSheet.content[0];
        const newRow = headers.map((h: string) => (charData[h] !== undefined ? charData[h] : null));
        regSheet.content.push(newRow);
      }

      const attrKey = tables.findTableKey(tableData, 'CHARACTER_Attributes');
      const attrSheet = attrKey ? tableData[attrKey] : null;
      if (attrSheet && attrSheet.content) {
        const headers = attrSheet.content[0];
        const newRow = headers.map((h: string) => (charData[h] !== undefined ? charData[h] : null));
        attrSheet.content.push(newRow);
      }

      const resKey = tables.findTableKey(tableData, 'CHARACTER_Resources');
      const resSheet = resKey ? tableData[resKey] : null;
      if (resSheet && resSheet.content) {
        const headers = resSheet.content[0];
        const newRow = headers.map((h: string) => (charData[h] !== undefined ? charData[h] : null));
        resSheet.content.push(newRow);
      }

      const invKey = tables.findTableKey(tableData, 'ITEM_Inventory');
      const invSheet = invKey ? tableData[invKey] : null;
      if (invSheet && invSheet.content) {
        const headers = invSheet.content[0];
        inventory.forEach(item => {
          const newRow = headers.map((h: string) => (item[h] !== undefined ? item[h] : null));
          invSheet.content.push(newRow);
        });
      }

      const libKey = tables.findTableKey(tableData, 'SKILL_Library');
      const libSheet = libKey ? tableData[libKey] : null;

      const linkKey = tables.findTableKey(tableData, 'CHARACTER_Skills');
      const linkSheet = linkKey ? tableData[linkKey] : null;

      if (libSheet && libSheet.content && linkSheet && linkSheet.content) {
        const libHeaders = libSheet.content[0];
        const linkHeaders = linkSheet.content[0];

        spells.forEach(spell => {
          const exists = libSheet.content.some((r: any[]) => r[1] === spell['技能名称']);
          let skillId = 'SKL_' + Math.random().toString(36).substr(2, 6);

          if (!exists) {
            const libRow = libHeaders.map((h: string) => {
              if (h === 'SKILL_ID') return skillId;
              return spell[h] !== undefined ? spell[h] : null;
            });
            libSheet.content.push(libRow);
          } else {
            const row = libSheet.content.find((r: any[]) => r[1] === spell['技能名称']);
            if (row) skillId = row[libHeaders.indexOf('SKILL_ID')];
          }

          const linkRow = linkHeaders.map((h: string) => {
            if (h === 'LINK_ID') return 'LNK_' + Math.random().toString(36).substr(2, 6);
            if (h === 'CHAR_ID') return charData['CHAR_ID'];
            if (h === 'SKILL_ID') return skillId;
            if (h === '已准备') return '是';
            return null;
          });
          linkSheet.content.push(linkRow);
        });
      }

      await api.importTableAsJson(JSON.stringify(tableData));

      return { success: true, message: `成功导入 FVTT 角色: ${name}` };
    } catch (err: any) {
      logger.error('[data-manager] FVTT 导入失败:', err);
      return { success: false, message: '解析或保存失败: ' + err.message };
    }
  };

  // 在数据库中动态切换主角身份
  const updateMainCharacterInDB = async (targetCharId: string): Promise<any> => {
    try {
      const api = tables.getAPI();
      if (!api) return { success: false, message: 'API 不可用' };

      const rawData = tables.getAllData();
      const tableKey = tables.findTableKey(rawData, 'CHARACTER_Registry');
      if (!tableKey) return { success: false, message: '未找到角色注册表' };

      const sheet = rawData[tableKey];
      const headers = sheet.content[0];
      const idIdx = headers.indexOf('CHAR_ID');
      const typeIdx = headers.indexOf('成员类型');

      if (idIdx === -1 || typeIdx === -1) return { success: false, message: '表结构异常' };

      let updatedCount = 0;
      for (let i = 1; i < sheet.content.length; i++) {
        const charId = sheet.content[i][idIdx];
        if (charId === targetCharId) {
          sheet.content[i][typeIdx] = '主角';
          updatedCount++;
        } else {
          if (sheet.content[i][typeIdx] === '主角') {
            sheet.content[i][typeIdx] = '同伴';
          }
        }
      }
      void updatedCount;

      await api.importTableAsJson(JSON.stringify(rawData));
      logger.info(`[data-manager] 数据库同步成功：已将 ${targetCharId} 设为主角`);
      return { success: true };
    } catch (err: any) {
      logger.error('[data-manager] 同步主角状态失败:', err);
      return { success: false, message: err.message };
    }
  };

  // 同步/创建酒馆用户角色（ST Persona）
  const syncSTUserPersona = async (name: string): Promise<void> => {
    if (!name) return;
    try {
      const core: any = tables.getCore();
      const stContext =
        (window as any).SillyTavern?.getContext?.() ||
        core?.getContext?.() ||
        (typeof (window as any).SillyTavern !== 'undefined' ? (window as any).SillyTavern.getContext?.() : null);

      if (stContext && typeof stContext.executeSlashCommands === 'function') {
        logger.info(`[data-manager] 触发酒馆官方斜杠命令切换用户角色: ${name}`);
        await stContext.executeSlashCommands(`/persona ${JSON.stringify(name)}`);
        return;
      }

      const { $ } = core;
      if ($) {
        const $targetCard = $(`#persona_list .persona_item[title="${name}"], #persona_list .persona_item:contains("${name}")`);
        if ($targetCard.length) {
          $targetCard.first().trigger('click');
          logger.info(`[data-manager] 通过 DOM 模拟点击切换用户角色: ${name}`);
          return;
        }
      }

      logger.warn('[data-manager] 未找到可用的酒馆 Persona 切换接口');
    } catch (err) {
      logger.error('[data-manager] 酒馆 Persona 切换失败:', err);
    }
  };

  return { exportPartyData, importPartyData, importFVTTData, updateMainCharacterInDB, syncSTUserPersona };
}