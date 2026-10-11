// features/dnd-map/map-data-source.ts
// 地图统一数据源适配层（b15.1）：新表优先 + 旧表兜底。
// 新源：世界地图点（MapStructureJSON/LastUpdated/当前显示地图/VisualJSON 隐藏列）、
//       战斗遭遇表（坐标/大小/Token/网格）、全局数据表（本轮故事模式/场景描述/当前详细地点）。
// 旧源（兜底）：EXPLORATION_Map_Data / COMBAT_Map_Visuals / COMBAT_BattleMap / SYS_GlobalState。
// 探针已证实：隐藏列可读可写（v0.0.99-b15.0）。

export function createMapDataSource(deps: any) {
  const getTable = (fragment: string): any[] | null => {
    try { return deps.dataManager.getTable(fragment); } catch (e) { return null; }
  };
  const getAllData = (): any => { try { return deps.dataManager.getAllData(); } catch (e) { return null; } };

  const findSheetByPred = (rawData: any, pred: (name: string, sheet: any) => boolean): any => {
    if (!rawData) return null;
    const key = Object.keys(rawData).find(k => {
      const s = rawData[k];
      if (!s || typeof s !== 'object') return false;
      return pred(String(s.name || ''), s);
    });
    return key ? rawData[key] : null;
  };

  // ---- 全局信息（新：全局数据表 | 旧：SYS_GlobalState）----
  const getGlobalRow = (): any => {
    const g = getTable('全局数据表') || getTable('SYS_GlobalState');
    return (g && g[0]) ? g[0] : {};
  };

  const getStoryMode = (): string => {
    const row = getGlobalRow();
    // 新：本轮故事模式（=「战斗模式」时为战斗态）
    const v1 = String(row['本轮故事模式'] || '').trim();
    if (v1) return v1;
    // 旧：战斗模式（'战斗中' 语义）
    const v2 = String(row['战斗模式'] || '').trim();
    return v2;
  };

  const isCombatMode = (): boolean => {
    const row = getGlobalRow();
    const mode = String(row['本轮故事模式'] || '').trim();
    if (mode) return mode === '战斗模式';
    return String(row['战斗模式'] || '').trim() === '战斗中';
  };

  const getCurrentScene = (): string => {
    const row = getGlobalRow();
    return String(row['当前详细地点'] || row['当前场景'] || '').trim() || '未知区域';
  };

  const getSceneDesc = (): string => {
    const row = getGlobalRow();
    return String(row['场景描述'] || '').trim();
  };

  const getCurrentRound = (): number => {
    const row = getGlobalRow();
    const v = row['当前回合'];
    return (v === 0 || v) ? Number(v) || 0 : 0;
  };

  // ---- 探索结构（新：世界地图点.MapStructureJSON | 旧：EXPLORATION_Map_Data）----
  const getExploreStructure = (locationName: string): string | null => {
    const wm = getTable('世界地图点');
    if (wm) {
      const row = wm.find((r: any) => r['详细地点'] === locationName);
      if (row && row['MapStructureJSON']) return String(row['MapStructureJSON']);
    }
    const ex = getTable('EXPLORATION_Map_Data');
    if (ex) {
      const row = ex.find((r: any) => r['LocationName'] === locationName);
      if (row && row['MapStructureJSON']) return String(row['MapStructureJSON']);
    }
    return null;
  };

  const saveExploreStructure = async (locationName: string, jsonStr: string): Promise<boolean> => {
    const rawData = getAllData();
    if (!rawData) return false;
    // 新优先：世界地图点（隐藏列 MapStructureJSON / LastUpdated）
    const wmSheet = findSheetByPred(rawData, n => n === '世界地图点') || findSheetByPred(rawData, n => n.includes('世界地图点'));
    if (wmSheet && wmSheet.content && wmSheet.content[0]) {
      const headers = wmSheet.content[0];
      const nameIdx = headers.indexOf('详细地点');
      const jsonIdx = headers.indexOf('MapStructureJSON');
      const timeIdx = headers.indexOf('LastUpdated');
      if (nameIdx >= 0 && jsonIdx >= 0) {
        const now = new Date().toISOString();
        let row = wmSheet.content.slice(1).find((r: any) => r[nameIdx] === locationName);
        if (row) {
          row[jsonIdx] = jsonStr;
          if (timeIdx >= 0) row[timeIdx] = now;
        } else {
          const newRow = new Array(headers.length).fill(null);
          newRow[nameIdx] = locationName;
          newRow[jsonIdx] = jsonStr;
          if (timeIdx >= 0) newRow[timeIdx] = now;
          wmSheet.content.push(newRow);
        }
        try { await deps.saveData(rawData); return true; } catch (e) { deps.logger.warn('[map-data-source] saveExploreStructure(new) failed:', e); }
      }
    }
    // 旧兜底：EXPLORATION_Map_Data
    const exSheet = findSheetByPred(rawData, n => n.includes('探索地图数据'));
    if (exSheet && exSheet.content && exSheet.content[0]) {
      const headers = exSheet.content[0];
      const locIdx = headers.indexOf('LocationName');
      const jsonIdx2 = headers.indexOf('MapStructureJSON');
      const timeIdx2 = headers.indexOf('LastUpdated');
      if (locIdx >= 0 && jsonIdx2 >= 0) {
        const now = new Date().toISOString();
        let row = exSheet.content.slice(1).find((r: any) => r[locIdx] === locationName);
        if (row) {
          row[jsonIdx2] = jsonStr;
          if (timeIdx2 >= 0) row[timeIdx2] = now;
        } else {
          const newRow = new Array(headers.length).fill(null);
          newRow[locIdx] = locationName;
          newRow[jsonIdx2] = jsonStr;
          if (timeIdx2 >= 0) newRow[timeIdx2] = now;
          exSheet.content.push(newRow);
        }
        try { await deps.saveData(rawData); return true; } catch (e2) { deps.logger.warn('[map-data-source] saveExploreStructure(old) failed:', e2); }
      }
    }
    deps.logger.warn('[map-data-source] saveExploreStructure: no writable sheet found');
    return false;
  };

  // ---- 当前显示地图锚（新：世界地图点.当前显示地图 | 旧：EXPLORATION_Map_Data）----
  const getCurrentDisplayLocation = (): string | null => {
    const isTruthyFlag = (val: any): boolean =>
      val === '是' || val === true || val === 'True' || val === 'true' || val === 1 || val === '1';
    const wm = getTable('世界地图点');
    if (wm) {
      const row = wm.find((m: any) => isTruthyFlag(m['当前显示地图']));
      if (row && row['详细地点']) return String(row['详细地点']);
    }
    const ex = getTable('EXPLORATION_Map_Data');
    if (ex) {
      const row = ex.find((m: any) => isTruthyFlag(m['当前显示地图']));
      if (row && row['LocationName']) return String(row['LocationName']);
    }
    return null;
  };

  // ---- 战斗底图（新：世界地图点.VisualJSON | 旧：COMBAT_Map_Visuals）----
  const getBattleVisual = (sceneName: string): string | null => {
    const wm = getTable('世界地图点');
    if (wm) {
      const row = wm.find((r: any) => r['详细地点'] === sceneName);
      if (row && row['VisualJSON']) return String(row['VisualJSON']);
    }
    const cv = getTable('COMBAT_Map_Visuals');
    if (cv) {
      const row = cv.find((r: any) => r['SceneName'] === sceneName);
      if (row && row['VisualJSON']) return String(row['VisualJSON']);
    }
    return null;
  };

  const saveBattleVisual = async (sceneName: string, jsonStr: string, width?: number, height?: number): Promise<boolean> => {
    const rawData = getAllData();
    if (!rawData) return false;
    // 新优先：世界地图点.VisualJSON（隐藏列）；网格尺寸由战斗遭遇表.网格承载
    const wmSheet = findSheetByPred(rawData, n => n === '世界地图点') || findSheetByPred(rawData, n => n.includes('世界地图点'));
    if (wmSheet && wmSheet.content && wmSheet.content[0]) {
      const headers = wmSheet.content[0];
      const nameIdx = headers.indexOf('详细地点');
      const jsonIdx = headers.indexOf('VisualJSON');
      const timeIdx = headers.indexOf('LastUpdated');
      if (nameIdx >= 0 && jsonIdx >= 0) {
        const now = new Date().toISOString();
        let row = wmSheet.content.slice(1).find((r: any) => r[nameIdx] === sceneName);
        if (row) {
          row[jsonIdx] = jsonStr;
          if (timeIdx >= 0) row[timeIdx] = now;
        } else {
          const newRow = new Array(headers.length).fill(null);
          newRow[nameIdx] = sceneName;
          newRow[jsonIdx] = jsonStr;
          if (timeIdx >= 0) newRow[timeIdx] = now;
          wmSheet.content.push(newRow);
        }
        try { await deps.saveData(rawData); return true; } catch (e) { deps.logger.warn('[map-data-source] saveBattleVisual(new) failed:', e); }
      }
    }
    // 旧兜底：COMBAT_Map_Visuals
    const cvSheet = findSheetByPred(rawData, n => n.includes('战斗地图绘制'));
    if (cvSheet && cvSheet.content && cvSheet.content[0]) {
      const headers = cvSheet.content[0];
      const nameIdx2 = headers.indexOf('SceneName');
      const jsonIdx2 = headers.indexOf('VisualJSON');
      const sizeIdx = headers.indexOf('GridSize');
      const timeIdx2 = headers.indexOf('LastUpdated');
      if (nameIdx2 >= 0 && jsonIdx2 >= 0) {
        const now = new Date().toISOString();
        const sizeStr = (width && height) ? `${width}x${height}` : null;
        let row = cvSheet.content.slice(1).find((r: any) => r[nameIdx2] === sceneName);
        if (row) {
          row[jsonIdx2] = jsonStr;
          if (sizeIdx >= 0 && sizeStr) row[sizeIdx] = sizeStr;
          if (timeIdx2 >= 0) row[timeIdx2] = now;
        } else {
          const newRow = new Array(headers.length).fill(null);
          newRow[nameIdx2] = sceneName;
          newRow[jsonIdx2] = jsonStr;
          if (sizeIdx >= 0 && sizeStr) newRow[sizeIdx] = sizeStr;
          if (timeIdx2 >= 0) newRow[timeIdx2] = now;
          cvSheet.content.push(newRow);
        }
        try { await deps.saveData(rawData); return true; } catch (e2) { deps.logger.warn('[map-data-source] saveBattleVisual(old) failed:', e2); }
      }
    }
    return false;
  };

  // ---- 战斗单位/地图行（新：战斗遭遇表组装 | 旧：COMBAT_BattleMap 原样）----
  const getBattleUnits = (): any[] | null => {
    const encounters = getTable('COMBAT_Encounter');
    if (encounters && encounters.length > 0) {
      const gridRaw = String(encounters.find((r: any) => r['网格']) ? encounters.find((r: any) => r['网格'])['网格'] : '').trim();
      let gw = 20, gh = 20;
      const m = gridRaw.match(/^(\d+)\s*[xX×]\s*(\d+)$/);
      if (m) { gw = parseInt(m[1], 10) || 20; gh = parseInt(m[2], 10) || 20; }
      const units: any[] = [];
      units.push({ '单位名称': 'Map_Config', '类型': 'Config', '坐标': `{"w":${gw},"h":${gh}}`, '大小': `{"w":1,"h":1}` });
      encounters.forEach((r: any) => {
        if (!r['单位名称']) return;
        units.push({
          '单位名称': r['单位名称'],
          '类型': 'Token',
          '坐标': r['坐标'] || '',
          '大小': r['大小'] || '1,1',
          'Token': r['Token'] || '',
        });
      });
      return units;
    }
    const oldMap = getTable('COMBAT_BattleMap');
    return oldMap || null;
  };

  // ---- 战斗网格（新：遭遇表.网格 | 旧：BattleMap Config 行）----
  const getBattleGrid = (): { cols: number; rows: number } => {
    const encounters = getTable('COMBAT_Encounter');
    if (encounters) {
      const row = encounters.find((r: any) => r['网格']);
      const raw = row ? String(row['网格']).trim() : '';
      const m = raw.match(/^(\d+)\s*[xX\u00d7]\s*(\d+)$/);
      if (m) return { cols: parseInt(m[1], 10) || 20, rows: parseInt(m[2], 10) || 20 };
    }
    const oldMap = getTable('COMBAT_BattleMap');
    if (oldMap) {
      const config = oldMap.find((m2: any) => m2['类型'] === 'Config');
      if (config && config['坐标']) {
        const size = deps.dataManager.parseValue(config['坐标'], 'size');
        if (size) return { cols: size.w || 20, rows: size.h || 20 };
      }
    }
    return { cols: 20, rows: 20 };
  };

  return {
    getStoryMode,
    isCombatMode,
    getCurrentScene,
    getSceneDesc,
    getCurrentRound,
    getExploreStructure,
    saveExploreStructure,
    getCurrentDisplayLocation,
    getBattleVisual,
    saveBattleVisual,
    getBattleUnits,
    getBattleGrid,
  };
}
