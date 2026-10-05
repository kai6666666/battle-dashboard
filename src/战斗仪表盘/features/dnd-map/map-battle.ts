// features/dnd-map/map-battle.ts
// 战斗地图（战斗结构/保存/取图）（b8 · 自 BasedonST `src/features/ExplorationMapManager.js` 拆分移植）
// 注意：本域方法为箭头函数属性，内部以 `ExplorationMapManager.` 自引用（已保留）。
export function createMapBattleFragment(deps: any): any {
  const ExplorationMapManager: any = {

    checkBattleStructure: (sceneName) => {
        const table = deps.dataManager.getTable('COMBAT_Map_Visuals');
        if (!table) return null;
        // Try exact match or fuzzy match if needed. Using exact match for now.
        const row = table.find(r => r['SceneName'] === sceneName);
        return row ? row['VisualJSON'] : null;
    },

    // [New] Save Battle Map Structure to Table
    saveBattleStructure: async (sceneName, jsonStr, width, height) => {
        const rawData = deps.dataManager.getAllData();
        const tableKey = Object.keys(rawData).find(k => k.includes('COMBAT_Map_Visuals') || (rawData[k].name && rawData[k].name.includes('战斗地图绘制')));
        
        if (!tableKey) {
            deps.logger.warn('Table COMBAT_Map_Visuals not found, skipping save.');
            return;
        }

        const sheet = rawData[tableKey];
        if (!sheet.content) sheet.content = [];
        
        const headers = sheet.content[0];
        const nameIdx = headers.indexOf('SceneName');
        const jsonIdx = headers.indexOf('VisualJSON');
        const sizeIdx = headers.indexOf('GridSize');
        const timeIdx = headers.indexOf('LastUpdated');

        // Find or Insert
        let row = sheet.content.slice(1).find(r => r[nameIdx] === sceneName);
        const now = new Date().toISOString();
        const sizeStr = `${width}x${height}`;

        if (row) {
            row[jsonIdx] = jsonStr;
            row[sizeIdx] = sizeStr;
            row[timeIdx] = now;
        } else {
            const newRow = new Array(headers.length).fill(null);
            newRow[nameIdx] = sceneName;
            newRow[jsonIdx] = jsonStr;
            newRow[sizeIdx] = sizeStr;
            newRow[timeIdx] = now;
            sheet.content.push(newRow);
        }

        await deps.diceManager.saveData(rawData);
    },

    // [New] Generate Battle Map
    getBattleMap: async (locationName, description, width, height, forceRegen = false) => {
        const cacheKey = `BATTLE_MAP_${locationName}_${width}x${height}`;
        const mapKey = `map_${cacheKey}`;
        
        // 1. Check Chat Metadata (Priority 1)
        if (!forceRegen) {
            const chatSVG = deps.tavernSettingsSync.getFromChat(mapKey);
            if (chatSVG) return { type: 'svg', content: chatSVG };
        }

        // 2. Check Cache (SVG) (Priority 2)
        if (!forceRegen) {
            const cachedSVG = await deps.dbAdapter.getSVG(cacheKey);
            if (cachedSVG) return { type: 'svg', content: cachedSVG };
        }

        try {
            const structureRequestOptions = await ExplorationMapManager.getAIRequestOptions(2000);
            const svgRequestOptions = await ExplorationMapManager.getAIRequestOptions(8192);

            // Step 1: Get Structure (From Table or Generate)
            let jsonStr = null;
            
            // Try to load from table first (if not forced)
            if (!forceRegen) {
                jsonStr = ExplorationMapManager.checkBattleStructure(locationName);
                if (jsonStr) deps.logger.info('[BattleMap] Loaded structure from table:', locationName);
            }

            // If not found or forced, generate new
            if (!jsonStr) {
                deps.logger.info('[BattleMap] Generating new structure for:', locationName);
                const structurePrompt = ExplorationMapManager.prompts.battleStructure(locationName + " " + description, width, height);
                const structureRes = await deps.tavernApi.generate([{ role: 'user', content: structurePrompt }], structureRequestOptions);
                
                jsonStr = structureRes;
                const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/) || jsonStr.match(/```\s*([\s\S]*?)\s*```/);
                if (jsonMatch) jsonStr = jsonMatch[1];
                
                // Cleanup
                jsonStr = jsonStr.trim();
                if (!jsonStr.startsWith('{')) jsonStr = jsonStr.substring(jsonStr.indexOf('{'));
                if (!jsonStr.endsWith('}')) jsonStr = jsonStr.substring(0, jsonStr.lastIndexOf('}') + 1);

                // Save to Table
                await ExplorationMapManager.saveBattleStructure(locationName, jsonStr, width, height);
            }

            // Step 2: Generate SVG
            deps.logger.info('[BattleMap] Generating SVG...');
            const svgPrompt = ExplorationMapManager.prompts.battleSVG(jsonStr);
            const svgRes = await deps.tavernApi.generate([{ role: 'user', content: svgPrompt }], svgRequestOptions);

            let svgContent = svgRes;
            const codeBlockMatch = svgContent.match(/```(?:xml|svg|html)?\s*([\s\S]*?)\s*```/i);
            if (codeBlockMatch) svgContent = codeBlockMatch[1];
            
            const svgStartIndex = svgContent.indexOf('<svg');
            const svgEndIndex = svgContent.lastIndexOf('</svg>');
            
            if (svgStartIndex !== -1 && svgEndIndex !== -1) {
                svgContent = svgContent.substring(svgStartIndex, svgEndIndex + 6);
            }

            // Namespace fix
            if(!svgContent.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                svgContent = svgContent.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }

            // Cache it
            await deps.dbAdapter.setSVG(cacheKey, svgContent);
            // Save to Chat Metadata (Priority)
            await deps.tavernSettingsSync.saveToChat(`map_${cacheKey}`, svgContent);
            
            return { type: 'svg', content: svgContent };

        } catch (e) {
            deps.logger.error('[BattleMap] Generation failed', e);
            return { type: 'error', message: e.message };
        }
    }
  };
  return ExplorationMapManager;
}
