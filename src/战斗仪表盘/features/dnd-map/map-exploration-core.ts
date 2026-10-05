// features/dnd-map/map-exploration-core.ts
// 探索地图核心（结构检查/生成/保存 + SVG + 取图）（b8 · 自 BasedonST `src/features/ExplorationMapManager.js` 拆分移植）
// 注意：本域方法为箭头函数属性，内部以 `ExplorationMapManager.` 自引用（已保留）。
export function createMapExplorationCoreFragment(deps: any): any {
  const ExplorationMapManager: any = {

    checkStructure: (locationName) => {
        const table = deps.dataManager.getTable('EXPLORATION_Map_Data');
        if (!table) return null;
        const row = table.find(r => r['LocationName'] === locationName);
        return row ? row['MapStructureJSON'] : null;
    },

    // 2. Generate Structure (Step 1)
    generateStructure: async (locationName, description) => {
        const theme = `${locationName}。${description || ''}`;
        const prompt = ExplorationMapManager.prompts.structure(theme);
        const requestOptions = await ExplorationMapManager.getAIRequestOptions(4000);
        
        deps.logger.info('[ExplorationMap] Generating structure for:', locationName);
        
        const response = await deps.tavernApi.generate([{ role: 'user', content: prompt }], requestOptions);

        // Parse JSON
        let jsonStr = response;
        const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/) || jsonStr.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) jsonStr = jsonMatch[1];
        jsonStr = jsonStr.trim();
        
        // Basic cleanup
        if (!jsonStr.startsWith('{')) jsonStr = jsonStr.substring(jsonStr.indexOf('{'));
        if (!jsonStr.endsWith('}')) jsonStr = jsonStr.substring(0, jsonStr.lastIndexOf('}') + 1);

        // Validation
        JSON.parse(jsonStr); // Will throw if invalid

        // Save to Table
        await ExplorationMapManager.saveStructure(locationName, jsonStr);
        return jsonStr;
    },

    // Save structure to table
    saveStructure: async (locationName, jsonStr) => {
        const rawData = deps.dataManager.getAllData();
        const tableKey = Object.keys(rawData).find(k => k.includes('EXPLORATION_Map_Data') || (rawData[k].name && rawData[k].name.includes('探索地图数据')));
        
        if (!tableKey) {
            deps.logger.error('Table EXPLORATION_Map_Data not found!');
            return;
        }

        const sheet = rawData[tableKey];
        if (!sheet.content) sheet.content = [];
        
        const headers = sheet.content[0];
        const locIdx = headers.indexOf('LocationName');
        const jsonIdx = headers.indexOf('MapStructureJSON');
        const timeIdx = headers.indexOf('LastUpdated');

        // Find or Insert
        let row = sheet.content.slice(1).find(r => r[locIdx] === locationName);
        if (row) {
            row[jsonIdx] = jsonStr;
            row[timeIdx] = new Date().toISOString();
        } else {
            const newRow = new Array(headers.length).fill(null);
            newRow[locIdx] = locationName;
            newRow[jsonIdx] = jsonStr;
            newRow[timeIdx] = new Date().toISOString();
            sheet.content.push(newRow);
        }

        await deps.diceManager.saveData(rawData);
    },

    // 3. Generate SVG (Step 2)
    generateSVG: async (locationName, structureJSON) => {
        const prompt = ExplorationMapManager.prompts.svg(structureJSON);
        const requestOptions = await ExplorationMapManager.getAIRequestOptions(8192);
        
        deps.logger.info('[ExplorationMap] Generating SVG for:', locationName);
        
        const response = await deps.tavernApi.generate([{ role: 'user', content: prompt }], requestOptions);

        // Extract SVG
        let svgContent = response;
        const codeBlockMatch = svgContent.match(/```(?:xml|svg|html)?\s*([\s\S]*?)\s*```/i);
        if (codeBlockMatch) svgContent = codeBlockMatch[1];

        const svgStartIndex = svgContent.indexOf('<svg');
        const svgEndIndex = svgContent.lastIndexOf('</svg>');
        
        if (svgStartIndex !== -1 && svgEndIndex !== -1) {
            svgContent = svgContent.substring(svgStartIndex, svgEndIndex + 6);
        } else {
            throw new Error("未能提取有效的 SVG 代码");
        }

        // Add namespace if missing
        if(!svgContent.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            svgContent = svgContent.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        // Save to Cache
        await deps.dbAdapter.setSVG(locationName, svgContent);
        // Save to Chat Metadata (Priority)
        await deps.tavernSettingsSync.saveToChat(`map_${locationName}`, svgContent);
        
        return svgContent;
    },

    // Main Flow: Get or Generate Map
    getMap: async (locationName, description, forceRegen = false) => {
        const mapKey = `map_${locationName}`;

        // 1. Check Chat Metadata (Priority 1)
        if (!forceRegen) {
            const chatSVG = deps.tavernSettingsSync.getFromChat(mapKey);
            if (chatSVG) return { type: 'svg', content: chatSVG };
        }

        // 2. Check SVG Cache (Priority 2)
        if (!forceRegen) {
            const cachedSVG = await deps.dbAdapter.getSVG(locationName);
            if (cachedSVG) return { type: 'svg', content: cachedSVG };
        }

        // 3. Check Structure
        let structure = ExplorationMapManager.checkStructure(locationName);
        
        // If no structure, fail (User requested to remove structure generation)
        if (!structure) {
            // [Modified] If no structure found, try to generate it automatically for better UX
             try {
                deps.logger.info('Structure not found, generating new structure for:', locationName);
                structure = await ExplorationMapManager.generateStructure(locationName, description);
            } catch (e) {
                return { type: 'error', message: '结构生成失败: ' + e.message };
            }
        }

        // 3. Generate SVG from Structure (Step 2)
        try {
            const svg = await ExplorationMapManager.generateSVG(locationName, structure);
            return { type: 'svg', content: svg };
        } catch (e) {
            return { type: 'error', message: '绘图失败: ' + e.message };
        }
    },

    // [New] Check Battle Map Structure from Table
  };
  return ExplorationMapManager;
}
