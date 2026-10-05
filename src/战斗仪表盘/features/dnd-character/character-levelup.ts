// features/dnd-character/character-levelup.ts
// 升级向导（b5 · 自 BasedonST `src/ui/modules/UICharacter.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createCharacterLevelupFragment(deps: any): any {
  return {
    async startLevelUp(charId) {
        const { $ } = deps.utils.getCore();
        
        // 1. 获取角色数据
        const party = deps.dataManager.getPartyData();
        const char = party.find(p => p.PC_ID === charId || p.CHAR_ID === charId || p.姓名 === charId);
        
        if (!char) {
            deps.notification.error('未找到角色数据');
            return;
        }

        // 2. 构建结构化数据供 AI 参考
        const skills = deps.dataManager.getCharacterSkills(charId);
        const feats = deps.dataManager.getCharacterFeats(charId);
        const stats = deps.dataManager.parseValue(char['属性值'], 'stats') || {};
        
        //change 简化的数据重构
        const currentData = {
            name: char['姓名'],
            race_gender_age: char['种族/性别/年龄'],
            class: char['职业'],
            level: parseInt(char['等级']) || 1,
            appearance: char['外貌描述'] || '',
            personality: char['性格特点'] || '',
            backstory: char['背景故事'] || '',
            stats: stats,
            hp: char['HP'],
            xp: char['经验值'],
            spells: skills.filter(s => s['技能类型'] === '法术').map(s => ({
                name: s['技能名称'],
                level: s['环阶'] || 0,
                desc: s['效果描述']
            })),
            features: feats.map(f => ({
                name: f['专长名称'],
                desc: f['效果描述']
            })),
            background: char['背景故事'],
            resources: {
                spell_slots: deps.dataManager.parseValue(char['法术位'], 'resources') || {},
                class_resources: deps.dataManager.parseValue(char['职业资源'], 'resources') || {},
                hit_dice: char['生命骰'] || `${parseInt(char['等级']) || 1}d8`
            }
        };
        
        // 3. 初始化状态
        // [新增] 获取世界书内容，用于自定义世界观支持（选择可配置：默认全部 / 指定世界书 / 不使用）
        const availableWorldbooks = await deps.tavernApi.getAllWorldbookNames();
        // [修复] 不再硬编码世界书名：优先沿用上次的选择，否则默认"当前启用的全部世界书"
        const selectedWorldbook = (this._charCreatorState && this._charCreatorState.selectedWorldbook !== undefined)
            ? this._charCreatorState.selectedWorldbook
            : ((availableWorldbooks && availableWorldbooks.length > 0) ? '__auto__' : '');
        const worldInfo = await this.resolveCreatorWorldInfo(selectedWorldbook);

        this._charCreatorState = {
            mode: 'levelup', // 标记为升级模式
            targetCharId: charId,
            apiConfig: await deps.settingsManager.getAPIConfig(),
            modelList: [],
            conversationHistory: [],
            characterData: currentData, // 初始数据为当前状态
            isGenerating: false,
            currentStep: 'chatting', // 直接进入对话
            characterType: 'pc', // 默认为 PC，实际上会更新现有角色
            selectedWorldbook: selectedWorldbook, // [新增] 参考世界书选择
            availableWorldbooks: availableWorldbooks, // [新增] 可选世界书列表
            worldInfo: worldInfo, // 保存世界书内容
            useWorldInfo: !!selectedWorldbook // 世界书参考开关（跟随选择）
        };
        
        // 4. 切换面板并确保显示
        const mainUI = (typeof this.renderPanel === 'function') ? this : window.DND_Dashboard_UI;
        if (mainUI) {
            // [Fix] 先更新侧边栏选中状态，防止 setState('full') 自动渲染回 party tab
            const { $ } = deps.utils.getCore();
            $('.dnd-nav-item').removeClass('active');
            $('.dnd-nav-item[data-target="create"]').addClass('active');

            // 确保切换到完整面板模式
            if (typeof mainUI.setState === 'function') {
                mainUI.setState('full');
            }
            // 再次强制渲染 create 面板 (双重保险)
            if (typeof mainUI.renderPanel === 'function') {
                mainUI.renderPanel('create');
            }
        }
        
        // 5. 发送初始系统消息
        this.sendCreatorMessage(null, true);
    },

  };
}
