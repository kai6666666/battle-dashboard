// features/dnd-character/character-creator-flow.ts
// 创建向导（事件/对话/落库）（b5 · 自 BasedonST `src/ui/modules/UICharacter.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createCharacterCreatorFlowFragment(deps: any): any {
  return {
    bindCharacterCreatorEvents($container) {
        const { $ } = deps.utils.getCore();
        const self = this; // 【关键修复】捕获 this
        const state = this._charCreatorState;
        
        // 世界书选择切换
        $container.find('#dnd-creator-worldinfo-select').on('change', async function() {
            const selected = $(this).val();
            state.selectedWorldbook = selected; // [修复] 记住选择，供重渲染与持久化使用
            state.useWorldInfo = !!selected;

            // [修复] 统一通过辅助函数解析世界书内容（'__auto__'=当前启用的全部，具体名称=指定世界书，空=不使用）
            state.worldInfo = await self.resolveCreatorWorldInfo(selected);

            // 【修复】使用 self.saveCreatorState() 防止全局对象未挂载报错
            if (typeof self.saveCreatorState === 'function') {
                self.saveCreatorState();
            }
        });

        // 角色类型切换按钮
        $container.find('#dnd-creator-type-pc').on('click', () => {
            if (state.currentStep !== 'init') return;
            state.characterType = 'pc';
            this.saveCreatorState();
            this.renderCharacterCreationPanel($container); // re-render panel
        });
        $container.find('#dnd-creator-type-party').on('click', () => {
            if (state.currentStep !== 'init') return;
            state.characterType = 'party';
            this.saveCreatorState();
            this.renderCharacterCreationPanel($container);
        });

        // 属性生成器按钮
        $container.find('#dnd-creator-stats-btn').on('click', (e) => {
            if ($(e.target).prop('disabled')) return;
            this.showStatsGenerator(e);
        });

        // 开始创建按钮
        $container.find('#dnd-creator-start-btn').on('click', async () => {
            // 检查配置 (从 SettingsManager 获取最新)
            const currentConfig = await deps.settingsManager.getAPIConfig();
            // 更新本地状态以确保同步
            state.apiConfig = currentConfig;

            if (state.apiConfig.provider === 'database') {
                if (!deps.tavernApi.getDatabaseAIStatus().available) {
                    deps.notification.warning('当前数据库插件未提供 AI 调用接口，请先更新数据库插件或切回自定义 API', '配置缺失');
                    ((window as any).DND_Dashboard_UI || this).renderPanel?.( 'settings');
                    return;
                }
            } else if (!state.apiConfig.url || !state.apiConfig.model) {
                deps.notification.warning('请先在设置中配置 API 地址和模型', '配置缺失');
                // Use global reference for cross-module call if needed, but this is mixin
                // UIRenderer is 'this' when called
                ((window as any).DND_Dashboard_UI || this).renderPanel?.( 'settings');
                return;
            }

            state.currentStep = 'chatting';
            state.conversationHistory = [];
            state.characterData = {};
            this.saveCreatorState(); // 保存状态变更
            
            // 发送初始系统消息给 AI
            await this.sendCreatorMessage(null, true);
        });
        
        // 重置按钮
        $container.find('#dnd-creator-reset-btn').on('click', async () => {
            const confirmed = await deps.notification.confirm('确定要重新开始吗？当前对话和角色数据将被清除。', {
                title: '重新开始',
                confirmText: '确定',
                type: 'warning'
            });
            if (confirmed) {
                const allWorldbooks = await deps.tavernApi.getAllWorldbookNames();
                // [修复] 不再硬编码世界书名：保留当前选择，老会话无该字段时回退到默认
                const selectedWorldbook = (state.selectedWorldbook !== undefined)
                    ? state.selectedWorldbook
                    : ((allWorldbooks && allWorldbooks.length > 0) ? '__auto__' : '');
                const worldInfo = await self.resolveCreatorWorldInfo(selectedWorldbook);

                this._charCreatorState = {
                    selectedPresetId: state.selectedPresetId,
                    apiConfig: state.apiConfig,
                    modelList: state.modelList,
                    characterType: state.characterType,
                    selectedWorldbook: selectedWorldbook, // [新增] 保留参考世界书选择
                    availableWorldbooks: allWorldbooks, // [新增] 可选世界书列表
                    conversationHistory: [],
                    characterData: {},
                    isGenerating: false,
                    currentStep: 'init',
                    worldInfo: worldInfo,
                    useWorldInfo: !!selectedWorldbook
                };
                self.saveCreatorState();
                self.renderCharacterCreationPanel($container);
            }
        });
        
        // 发送按钮
        $container.find('#dnd-creator-send-btn').on('click', () => {
            const $input = $container.find('#dnd-creator-user-input');
            const text = $input.val().trim();
            if (text) {
                this.sendCreatorMessage(text);
                $input.val('');
            }
        });
        
        // 回车发送
        $container.find('#dnd-creator-user-input').on('keypress', (e) => {
            if (e.which === 13 && !e.shiftKey) {
                e.preventDefault();
                $container.find('#dnd-creator-send-btn').click();
            }
        });
        
        // 确认创建/升级
        $container.find('#dnd-creator-confirm-btn').html(state.mode === 'levelup' ? '<i class="fa-solid fa-check-circle"></i> 确认升级' : '<i class="fa-solid fa-check-circle"></i> 确认创建');
        $container.find('#dnd-creator-confirm-btn').on('click', async () => {
            await this.finalizeCharacterCreation();
        });
        
        // 继续修改
        $container.find('#dnd-creator-modify-btn').on('click', () => {
            state.currentStep = 'chatting';
            this.saveCreatorState();
            this.renderCharacterCreationPanel($container);
        });
        
        // 滚动到底部
        const $chatHistory = $container.find('#dnd-creator-chat-history');
        if ($chatHistory.length) {
            $chatHistory.scrollTop($chatHistory[0].scrollHeight);
        }
    },

    // [新增] 渲染聊天选项
    renderChatOptions(config) {
        const { $ } = deps.utils.getCore();
        const $chatHistory = $('#dnd-creator-chat-history');
        const { question, options, type } = config;
        const isMulti = type === 'multiple';
        
        const buttonsHtml = options.map(opt => {
            const isString = typeof opt === 'string';
            const optName = isString ? opt : (opt.text || opt.label || opt.name || '选项');
            const optDesc = isString ? '' : (opt.desc || opt.description || '');
            // 优先使用 ID 作为返回值，其次是 value，最后是显示名称
            // 如果是对象且没有 id/value，则尝试将其 stringify 作为值 (虽然不推荐，但作为 fallback)
            let optValue = isString ? opt : (opt.id || opt.value || opt.name || optName);
            
            // 如果 value 是对象，转化为字符串，避免 [object Object]
            if (typeof optValue === 'object') {
                optValue = JSON.stringify(optValue);
            }

            return `
            <button class="dnd-creator-option-btn" style="
                background:rgba(255,255,255,0.05);
                border:1px solid var(--dnd-border-gold);
                color:var(--dnd-text-main);
                padding:8px 12px;
                border-radius:4px;
                cursor:pointer;
                text-align:left;
                transition:all 0.2s;
                font-size:13px;
            " onclick="window.DND_Dashboard_UI.handleCreatorOption('${String(optValue).replace(/'/g, "\\'")}', '${isMulti}')">
                <div style="font-weight:bold;">${optName}</div>
                ${optDesc ? `<div style="font-size:11px;color:#aaa;margin-top:2px;">${optDesc}</div>` : ''}
            </button>
        `}).join('');

        const html = `
            <div class="dnd-chat-msg dnd-anim-entry" style="background:rgba(157, 139, 108, 0.1); border-left:3px solid var(--dnd-border-gold); padding:10px 12px; margin-bottom:8px; border-radius:4px;">
                ${question ? `<div style="font-size:12px;color:var(--dnd-text-highlight);margin-bottom:8px;font-weight:bold;"><i class="fa-solid fa-question-circle"></i> ${question}</div>` : ''}
                <div style="display:flex;flex-direction:column;gap:5px;">
                    ${buttonsHtml}
                </div>
            </div>
        `;
        
        $chatHistory.append(html);
        $chatHistory.scrollTop($chatHistory[0].scrollHeight);
    },

    // [新增] 处理选项点击
    handleCreatorOption(value, isMulti) {
        // 暂时只支持单选，多选后续扩展
        // 模拟用户输入
        this.sendCreatorMessage(value);
    },

    // 发送消息给 AI
    async sendCreatorMessage(userMessage, isInitial = false) {
        const { $ } = deps.utils.getCore();
        const state = this._charCreatorState;
        const $chatHistory = $('#dnd-creator-chat-history');
        const $input = $('#dnd-creator-user-input');
        const $sendBtn = $('#dnd-creator-send-btn');
        
        if (state.isGenerating) return;
        state.isGenerating = true;
        
        // 优化：不直接重绘整个面板，而是通过 DOM 操作更新
        $input.prop('disabled', true);
        $sendBtn.text('⏳ 生成中...').prop('disabled', true);
        
        try {
            // 如果有用户消息，立即追加到聊天记录 DOM
            if (userMessage) {
                const idx = state.conversationHistory.length;
                const userMsgHtml = `
                    <div class="dnd-chat-msg dnd-anim-entry" style="background:rgba(52, 152, 219, 0.1); border-left:3px solid #3498db; padding:10px 12px; margin-bottom:8px; border-radius:4px;">
                        <div style="font-size:11px;color:#888;margin-bottom:4px;"><i class="fa-solid fa-user"></i> 你</div>
                        <div style="color:var(--dnd-text-main);line-height:1.5;white-space:pre-wrap;">${this.formatChatMessage(userMessage)}</div>
                    </div>`;
                $chatHistory.append(userMsgHtml);
                $chatHistory.scrollTop($chatHistory[0].scrollHeight);
                
                state.conversationHistory.push({ role: 'user', content: userMessage });
                this.saveCreatorState(); // 保存
            } else if (isInitial) {
                const isLevelUp = state.mode === 'levelup';
                const nextLvl = (state.characterData.level || 1) + 1;
                const initMsg = isLevelUp
                    ? `你好，我是 ${state.characterData.name}，我想从 Lv.${state.characterData.level} 升级到 Lv.${nextLvl}。请引导我完成升级。`
                    : '你好，我想创建一个 DND 5E 角色。请引导我开始。';
                
                state.conversationHistory.push({ role: 'user', content: initMsg });
                this.saveCreatorState(); // 保存
            }

            // 构建发送给 API 的消息数组
            const messages = [];
            const isLevelUp = state.mode === 'levelup';
            
            let systemPrompt = '';
            
            if (isLevelUp) {
                // [新增] 注入世界书内容
                const useWI = state.useWorldInfo !== false;
                const worldInfoStr = (useWI && state.worldInfo) ? `\n\n${state.worldInfo}\n\n注意：上述【当前世界观/规则参考】不仅是背景故事，更是**扩展的游戏规则**。如果世界书中描述了特殊的魔法体系、武术流派或生理特征，请将其转化为具体的**自定义职业、专长、技能或特性**。不要局限于 DND 5E 的标准选项。如果世界书内容与 DND 规则冲突，或提供了全新的机制，**请优先使用世界书内容创造新的游戏规则**。你可以设计全新的职业特性来反映世界书的设定，而不仅仅是重命名现有的 DND 特性。` : '';

                // 升级模式 Prompt
                systemPrompt = `你是一个 DND 5E (及自定义世界观) 角色升级向导。当前用户正在将角色 "${state.characterData.name}" 从等级 ${state.characterData.level} 提升到 ${(state.characterData.level || 1) + 1}。${worldInfoStr}

**当前角色数据:**
\`\`\`json
${JSON.stringify(state.characterData, null, 2)}
\`\`\`

请遵循以下流程引导用户升级：
1. **生命值提升**: 根据职业生命骰（取平均或投掷），计算新的最大HP。
2. **职业特性**: 告知用户新等级获得的职业特性。如果角色是自定义职业或处于自定义世界观下，请**根据世界书推断、设计或询问用户其特性**。不要害怕创造 DND 规则书中没有的能力。
3. **法术/已知法术**: 如果是施法者，引导选择新法术或替换旧法术。
4. **属性提升/专长**: 如果是 4/8/12/16/19 级，引导用户选择属性值提升 (ASI) 或专长。
5. **熟练项加值**: 检查熟练加值是否因等级提升而增加（如 1-4级+2, 5-8级+3）。

在对话中：
- 每次专注于一个升级步骤，不要问多个问题
- 当有多个选择时（如选择新法术、专长），**必须**使用 \`CHARACTER_OPTIONS\` 块输出选项，格式如下：
\`\`\`CHARACTER_OPTIONS
{
"question": "请选择...",
"type": "single",
"options": ["选项A", "选项B"]
}
\`\`\`
- 解释规则依据 (DND 5E 规则或世界书自定义规则)。如果使用了自定义规则，请明确指出这是根据世界书设定的。
- 【绝对禁止修改固定设定】：角色的【name】、【race_gender_age】、【appearance】、【personality】、【backstory】为固有角色设定。在升级向导中**绝对禁止询问、修改、扩写或重写这些内容**！最后输出 JSON 时必须**原封不动照抄当前角色数据中的原有内容**！


最后，当升级的所有选择都确定后，输出更新后的 \`CHARACTER_DATA\` 块。**必须包含角色的所有数据（旧数据+新变化），而不仅仅是变化部分。** 格式与创建角色时相同。

\`\`\`CHARACTER_DATA
{
  ... (完整的角色JSON数据，更新了等级、HP、特性、法术等)
}
\`\`\`
`;
            } else {
                // 创建模式 Prompt
                const charTypeLabel = state.characterType === 'pc' ? '主角' : '队友';
                
                // [新增] 注入世界书内容
                const useWI = state.useWorldInfo !== false;
                const worldInfoStr = (useWI && state.worldInfo) ? `\n\n${state.worldInfo}\n\n注意：上述【当前世界观/规则参考】不仅是背景故事，更是**扩展的游戏规则**。请积极从世界书中提取并**创造**新的种族、职业、背景和专长。不要局限于 DND 5E 的标准选项。例如，如果世界书提到了一种特殊的“星能使用者”，你可以为此创建一个全新的职业，并设计其特有的核心能力，而不是强行让用户使用“术士”卡。如果世界书内容提供了全新的机制，**请优先使用世界书内容创造新的游戏规则**。` : '';

                systemPrompt = `你是一个 DND 5E (及自定义世界观) 角色创建向导。你的任务是通过对话引导用户创建一个完整的${charTypeLabel}角色。${worldInfoStr}

请遵循以下流程：
1. 首先询问用户想要创建什么类型的角色（战士、法师、盗贼等），或者让他们描述一个角色概念
2. 根据用户的回答，建议合适的种族和职业组合 (优先参考世界书设定，其次参考 DND 规则)
3. 帮助用户确定属性值分配（使用标准点数购买或让用户自选）
4. 询问角色的背景、性格特点（理想、牵绊、缺陷）
5. 询问角色的外貌特征（毛发、鳞片、眼睛、身高、特征等等）
6. 帮助用户构思一个简短的背景故事（不超过300字）

在对话过程中，请：
- 每次只问1个问题，不要一次问多个问题
- 提供具体的选项供用户选择（**必须**通过 CHARACTER_OPTIONS 输出）
- 解释你的建议理由
- 保持友好和鼓励的语气

当需要用户做选择时（如选择种族、职业、属性分配方式），请务必输出一个选项块：
\`\`\`CHARACTER_OPTIONS
{
"question": "请选择你的种族...",
"type": "single",
"options": ["黎博利", "龙", "阿戈尔", "其他"]
}
\`\`\`

当收集到足够信息后，输出一个特殊格式的角色数据块（严格遵守此JSON格式）：
\`\`\`CHARACTER_DATA
{
  "name": "角色全名",
  "race_gender_age": "种族/性别/年龄(如: 菲林-猫裔/雌/22)",
  "class": "职业名称(如: 游侠)",
  "level": 1,
  "appearance": "外貌体征与着装描写",
  "personality": "性格特质、理想、牵绊与缺陷",
  "backstory": "角色背景故事(≤300字)",
  "stats": {"STR": 14, "DEX": 16, "CON": 14, "INT": 10, "WIS": 12, "CHA": 8},
  "hp": "12/12",
  "ac": 14,
  "initiative": "+3",
  "speed": "30尺(6格)",
  "saving_throws": ["力量", "敏捷"],
  "skill_proficiencies": ["运动", "隐匿", "求生"],
  "passive_perception": 13,
  "resources": {
    "spell_slots": "无",
    "class_resources": "无",
    "special_abilities": "无",
    "hit_dice": "1/1"
  },
  "features": [
    {"name": "宿敌", "desc": "对特定类型生物追踪与知识检定具有优势", "stat_increase": "无"}
  ],
  "spells": [
    {"name": "猎人印记", "level": "1环", "time": "1附赠", "range": "90尺", "cost": "1环法术位x1", "duration": "专注,1小时", "desc": "命中额外造成1d6武器伤害", "upcast": "提升持续时间"}
  ]${state.characterType === 'party' ? `,
  "member_type": "同伴",
  "join_reason": "初次相遇并受雇加入队伍"` : ''}
}
\`\`\`

现在开始与用户对话。`;
            }

            messages.push({ role: 'system', content: systemPrompt });
            state.conversationHistory.forEach(msg => {
                messages.push({ role: msg.role, content: msg.content });
            });
            
            // 每次发送前都同步一次最新的全局 API 配置，确保设置页切换立即生效
            const latestApiConfig = await deps.settingsManager.getAPIConfig();
            if (latestApiConfig) {
                state.apiConfig = {
                    provider: 'plugin',
                    url: '',
                    key: '',
                    model: '',
                    ...(state.apiConfig || {}),
                    ...latestApiConfig
                };
            }

            // 调用 API
            const requestOptions = {
                maxTokens: 4096 // 增加最大 Token 数以防止截断
            };

            if (state.apiConfig?.provider === 'database') {
                requestOptions.useDatabaseAPI = true;
            } else {
                requestOptions.customConfig = state.apiConfig;
            }



            // [调试] 打印发往独立 API 的完整提示词消息
            console.groupCollapsed('%c[DND Creator] 发送给独立 API 的完整提示词 (点击展开)', 'color: #3498db; font-weight: bold; font-size: 13px;');
            console.log('【1. 原始 Messages 数组结构】:', messages);
            console.log('【2. 完整合并文本内容】:\n\n' + messages.map(m => `--- [${m.role.toUpperCase()}] ---\n${m.content}`).join('\n\n'));
            console.groupEnd();

            const response = await deps.tavernApi.generate(messages, requestOptions);

            
            
            // 处理响应
            if (response) {
                state.conversationHistory.push({ role: 'assistant', content: response });
                
                // 追加到 DOM
                const aiMsgHtml = `
                    <div class="dnd-chat-msg dnd-anim-entry" style="background:rgba(155, 89, 182, 0.1); border-left:3px solid #9b59b6; padding:10px 12px; margin-bottom:8px; border-radius:4px;">
                        <div style="font-size:11px;color:#888;margin-bottom:4px;"><i class="fa-solid fa-robot"></i> AI 向导</div>
                        <div style="color:var(--dnd-text-main);line-height:1.5;white-space:pre-wrap;">${this.formatChatMessage(response)}</div>
                    </div>`;
                $chatHistory.append(aiMsgHtml);
                
                // [新增] 解析选项
                const optMatch = response.match(/```CHARACTER_OPTIONS\s*([\s\S]*?)```/);
                if (optMatch) {
                    try {
                        const optData = JSON.parse(optMatch[1]);
                        this.renderChatOptions(optData);
                    } catch(e) { console.error('Options parse error', e); }
                }

                $chatHistory.scrollTop($chatHistory[0].scrollHeight);
                
                // 尝试解析角色数据
                const dataMatch = response.match(/```CHARACTER_DATA\s*([\s\S]*?)```/);
                if (dataMatch) {
                    try {
                        const charData = JSON.parse(dataMatch[1]);
                        state.characterData = charData;
                        state.currentStep = 'reviewing';
                        // 更新预览区域
                        $('#dnd-creator-preview').html(this.renderCharacterPreview(state.characterData));
                        console.log('[CharCreator] 角色数据已解析:', charData);
                    } catch(e) {
                        console.error('[CharCreator] 解析角色数据失败:', e);
                    }
                }
                
                // 保存更新后的状态
                this.saveCreatorState();
            }
        } catch (error) {
            console.error('[CharCreator] API 调用失败:', error);
            const errMsgHtml = `
                <div class="dnd-chat-msg dnd-anim-entry" style="background:rgba(192, 57, 43, 0.1); border-left:3px solid #e74c3c; padding:10px 12px; margin-bottom:8px; border-radius:4px;">
                    <div style="font-size:11px;color:#888;margin-bottom:4px;"><i class="fa-solid fa-robot"></i> 系统消息</div>
                    <div style="color:var(--dnd-text-main);line-height:1.5;"><i class="fa-solid fa-times-circle"></i> 抱歉，生成失败：${error.message}</div>
                </div>`;
            $chatHistory.append(errMsgHtml);
            $chatHistory.scrollTop($chatHistory[0].scrollHeight);
            
            state.conversationHistory.push({
                role: 'assistant',
                content: `抱歉，生成失败：${error.message}\n\n请检查 API 连接或重试。`
            });
        } finally {
            state.isGenerating = false;
            
            // 恢复 UI 状态
            $input.prop('disabled', false).val('').focus();
            $sendBtn.text('📤 发送').prop('disabled', false);
            
            // 如果状态变为 reviewing 且确认按钮未显示（即刚完成解析），则需要完整重绘以显示确认按钮
            // 或者我们可以只追加按钮到 DOM
            if (state.currentStep === 'reviewing' && $('#dnd-creator-confirm-btn').length === 0) {
                // Re-render to show buttons
                this.renderCharacterCreationPanel($('#dnd-creator-chat-history').closest('#dnd-content'));
            }
        }
    },

    // 完成角色创建，保存数据
    // 完成角色创建/升级，保存数据（自愈与强容错强化版）
    async finalizeCharacterCreation(options = {}) {
        const { $ } = deps.utils.getCore();
        const state = this._charCreatorState;
        const data = state.characterData;
        const { _retrying = false } = options || {};
        
        if (!data || !data.name) {
            deps.notification.warning('角色数据不完整，无法保存');
            return;
        }
        
        try {
            const rawData = deps.dataManager.getAllData();
            if (!rawData) throw new Error('无法获取数据库对象');
            
            const isPC = state.characterType === 'pc';
            const targetId = state.mode === 'levelup' ? state.targetCharId : null;

            // 1. 高级多重模糊查找表对象 (UID / sheet_UID / 中文名 全覆盖)
            const findTable = (keywords) => {
                const kwList = Array.isArray(keywords) ? keywords : [keywords];
                return Object.values(rawData).find(s => {
                    if (!s || typeof s !== 'object') return false;
                    const uid = String(s.uid || '').toLowerCase();
                    const name = String(s.name || '').toLowerCase();
                    return kwList.some(kw => {
                        const k = String(kw).toLowerCase();
                        return uid === k || uid === `sheet_${k}` || uid.includes(k) || name.includes(k);
                    });
                });
            };
            
            const mainTable = findTable(['CHARACTER_Registry', '角色表', 'Registry']);
            const attrTable = findTable(['CHARACTER_Attributes', '角色属性', 'Attributes']);
            const resTable = findTable(['CHARACTER_Resources', '角色资源', 'Resources']);
            const skillLibTable = findTable(['SKILL_Library', '技能/法术库', '技能库', '法术库']);
            const skillLinkTable = findTable(['CHARACTER_Skills', '角色技能关联', '技能关联']);
            const featLibTable = findTable(['FEAT_Library', '专长库', '特性库']);
            const featLinkTable = findTable(['CHARACTER_Feats', '角色专长关联', '专长关联']);

            // 2. 智能提取表头（优先从 content[0]、其次 columns、最后从 DDL 自动解析）
            const getTableHeaders = (table) => {
                if (!table) return [];
                if (Array.isArray(table.content) && table.content.length > 0 && Array.isArray(table.content[0]) && table.content[0].length > 0) {
                    return table.content[0];
                }
                if (Array.isArray(table.columns) && table.columns.length > 0) return table.columns;
                if (Array.isArray(table.headers) && table.headers.length > 0) return table.headers;
                
                // 从 DDL 中动态提取物理列名
                const ddl = table.sourceData?.ddl || table.sourceData?.note || '';
                if (ddl) {
                    const lines = ddl.split('\n');
                    const cols = [];
                    for (const line of lines) {
                        const clean = line.trim().replace(/^CREATE\s+TABLE[^(]+\(/i, '').replace(/\);?$/, '');
                        const match = clean.match(/^([a-zA-Z0-9_]+)\s+/);
                        if (match && !['create', 'table', 'primary', 'foreign', 'check', 'unique', 'constraint'].includes(match[1].toLowerCase())) {
                            cols.push(match[1]);
                        }
                    }
                    if (cols.length > 0) return cols;
                }
                return [];
            };

            // 3. 辅助：不区分大小写与支持多别名查找列索引
            const getColIdx = (headers, aliases) => {
                if (!Array.isArray(headers)) return -1;
                const aliasList = Array.isArray(aliases) ? aliases : [aliases];
                return headers.findIndex(h => {
                    if (!h) return false;
                    const cleanH = String(h).trim().toLowerCase();
                    return aliasList.some(a => String(a).trim().toLowerCase() === cleanH);
                });
            };

            // 4. 表格结构有效性校验与自动自愈初始化
            const ensureTableValid = (table, requiredMap, tableNameLabel) => {
                if (!table) return `未找到【${tableNameLabel}】表格`;
                let headers = getTableHeaders(table);
                if (!headers || headers.length === 0) return `【${tableNameLabel}】缺少表头结构与DDL定义`;
                
                // 自愈修复：如果 content 为空（0行表），自动将表头写入 content[0]
                if (!Array.isArray(table.content) || table.content.length === 0) {
                    table.content = [headers];
                }

                for (const [colKey, aliases] of Object.entries(requiredMap)) {
                    if (getColIdx(headers, aliases) === -1) {
                        return `【${tableNameLabel}】缺少字段 [${aliases.join(' / ')}]`;
                    }
                }
                return null;
            };

            const templateIssues = [];
            const mainErr = ensureTableValid(mainTable, { id: ['char_id', 'CHAR_ID', '角色ID'] }, '角色表');
            if (mainErr) templateIssues.push(mainErr);

            const attrErr = ensureTableValid(attrTable, { id: ['char_id', 'CHAR_ID', '角色ID'] }, '角色属性表');
            if (attrErr) templateIssues.push(attrErr);

            const resErr = ensureTableValid(resTable, { id: ['char_id', 'CHAR_ID', '角色ID'] }, '角色资源表');
            if (resErr) templateIssues.push(resErr);

            const spells = data.spells || [];
            if (spells.length > 0) {
                const skLibErr = ensureTableValid(skillLibTable, { id: ['skill_id', 'SKILL_ID'], name: ['技能名称', 'ji_neng_ming_cheng'] }, '技能库');
                if (skLibErr) templateIssues.push(skLibErr);
                const skLinkErr = ensureTableValid(skillLinkTable, { charId: ['char_id', 'CHAR_ID'], skillId: ['skill_id', 'SKILL_ID'] }, '角色技能关联表');
                if (skLinkErr) templateIssues.push(skLinkErr);
            }

            const features = data.features || [];
            if (features.length > 0) {
                const ftLibErr = ensureTableValid(featLibTable, { id: ['feat_id', 'FEAT_ID'], name: ['专长名称', 'zhuan_chang_ming_cheng'] }, '专长库');
                if (ftLibErr) templateIssues.push(ftLibErr);
                const ftLinkErr = ensureTableValid(featLinkTable, { charId: ['char_id', 'CHAR_ID'], featId: ['feat_id', 'FEAT_ID'] }, '角色专长关联表');
                if (ftLinkErr) templateIssues.push(ftLinkErr);
            }

            if (templateIssues.length > 0) {
                throw new Error(`数据表结构校验未通过：\n${templateIssues.join('\n')}`);
            }

            // 5. 确定角色 ID
            let charId;
            if (targetId) {
                charId = targetId;
            } else if (isPC) {
                charId = 'PC_MAIN';
            } else {
                const mainHeaders = getTableHeaders(mainTable);
                const charIdIdx = getColIdx(mainHeaders, ['char_id', 'CHAR_ID']);
                const existingAllies = (mainTable.content || []).slice(1)
                    .map(r => r[charIdIdx])
                    .filter(id => id && String(id).startsWith('ALLY_'));
                charId = `ALLY_${String(existingAllies.length + 1).padStart(2, '0')}`;
            }

            // 6. 统一更新或插入行（全字段自适应映射）
            const updateOrInsert = (table, idVal) => {
                const headers = getTableHeaders(table);
                if (!headers || headers.length === 0) return;
                
                if (!Array.isArray(table.content) || table.content.length === 0) {
                    table.content = [headers];
                }

                const idIdx = getColIdx(headers, ['char_id', 'CHAR_ID', '角色ID']);
                if (idIdx === -1) return;

                let rowIndex = -1;
                for (let i = 1; i < table.content.length; i++) {
                    if (table.content[i][idIdx] === idVal) {
                        rowIndex = i;
                        break;
                    }
                }

                const newRow = headers.map((h, i) => {
                    const colKey = String(h).trim().toLowerCase();
                    const oldVal = (rowIndex !== -1 && table.content[rowIndex]) ? table.content[rowIndex][i] : undefined;
                    const val = (v) => (v !== undefined && v !== null && v !== '') ? v : oldVal;

                    // 主档案表 sheet_CHARACTER_Registry
                    if (['char_id', 'charid', '角色id'].includes(colKey)) return idVal;
                    if (['成员类型', 'cheng_yuan_lei_xing'].includes(colKey)) return isPC ? '主角' : (data.member_type || oldVal || '同伴');
                    if (['姓名', 'xing_ming', 'name'].includes(colKey)) return state.mode === 'levelup' ? (oldVal || data.name) : val(data.name);
                    if (['种族/性别/年龄', 'zhong_zu_xing_bie_nian_ling'].includes(colKey)) return state.mode === 'levelup' ? (oldVal || data.race_gender_age) : val(data.race_gender_age);
                    if (['职业', 'zhi_ye', 'class'].includes(colKey)) return val(data.class);
                    if (['外貌描述', 'wai_mao_miao_shu'].includes(colKey)) return state.mode === 'levelup' ? (oldVal || data.appearance) : val(data.appearance);
                    if (['性格特点', 'xing_ge_te_dian'].includes(colKey)) return state.mode === 'levelup' ? (oldVal || data.personality) : val(data.personality);
                    if (['背景故事', 'bei_jing_gu_shi'].includes(colKey)) return state.mode === 'levelup' ? (oldVal || data.backstory) : val(data.backstory);
                    if (['加入节点', 'jia_ru_jie_dian', '加入时间'].includes(colKey)) return isPC ? '无' : (data.join_reason || oldVal || '剧情同行');

                    // 属性表 sheet_CHARACTER_Attributes
                    if (['等级', 'deng_ji', 'level'].includes(colKey)) return parseInt(val(data.level)) || 1;
                    if (['hp', '生命值'].includes(colKey)) return val(data.hp) || '10/10';
                    if (['ac', '护甲等级'].includes(colKey)) return parseInt(val(data.ac)) || 10;
                    if (['先攻加值', 'xian_gong_jia_zhi'].includes(colKey)) return String(data.initiative !== undefined ? data.initiative : (oldVal || '+0'));
                    if (['速度', 'su_du'].includes(colKey)) return val(data.speed) || '30尺(6格)';
                    if (['属性值', 'shu_xing_zhi'].includes(colKey)) return data.stats ? (typeof data.stats === 'object' ? JSON.stringify(data.stats) : data.stats) : (oldVal || '{}');
                    if (['豁免熟练', 'huo_mian_shu_lian'].includes(colKey)) return data.saving_throws ? (Array.isArray(data.saving_throws) ? JSON.stringify(data.saving_throws) : data.saving_throws) : (oldVal || '[]');
                    if (['技能熟练', 'ji_neng_shu_lian'].includes(colKey)) return data.skill_proficiencies ? (Array.isArray(data.skill_proficiencies) ? JSON.stringify(data.skill_proficiencies) : data.skill_proficiencies) : (oldVal || '[]');
                    if (['被动感知', 'bei_dong_gan_zhi'].includes(colKey)) return parseInt(data.passive_perception) || (parseInt(oldVal) || 10);
                    if (['经验值', 'jing_yan_zhi'].includes(colKey)) {
                        if (state.mode === 'levelup' && rowIndex !== -1) {
                            const currExp = parseInt(String(oldVal || '0/300').split('/')[0]) || 0;
                            const xpTable = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];
                            const nextLvl = parseInt(data.level) || 1;
                            return `${currExp}/${xpTable[nextLvl] || 355000}`;
                        }
                        return '0/300';
                    }

                    // 资源表 sheet_CHARACTER_Resources
                    if (['法术位', 'fa_shu_wei'].includes(colKey)) {
                        if (data.resources?.spell_slots && data.resources.spell_slots !== '无') {
                            return typeof data.resources.spell_slots === 'object' ? JSON.stringify(data.resources.spell_slots) : data.resources.spell_slots;
                        }
                        return oldVal || '无';
                    }
                    if (['职业资源', 'zhi_ye_zi_yuan'].includes(colKey)) {
                        if (data.resources?.class_resources && data.resources.class_resources !== '无') {
                            return typeof data.resources.class_resources === 'object' ? JSON.stringify(data.resources.class_resources) : data.resources.class_resources;
                        }
                        return oldVal || '无';
                    }
                    if (['生命骰', 'sheng_ming_tou'].includes(colKey)) return val(data.resources?.hit_dice) || oldVal || '1/1';
                    if (['特殊能力', 'te_shu_neng_li'].includes(colKey)) {
                        if (data.resources?.special_abilities && data.resources.special_abilities !== '无') {
                            return typeof data.resources.special_abilities === 'object' ? JSON.stringify(data.resources.special_abilities) : data.resources.special_abilities;
                        }
                        return oldVal || '无';
                    }
                    if (['金币', 'jin_bi'].includes(colKey)) return (oldVal !== undefined && oldVal !== null && oldVal !== '') ? parseInt(oldVal) : (isPC ? 15 : 5);

                    return oldVal !== undefined ? oldVal : null;
                });

                if (rowIndex !== -1) {
                    table.content[rowIndex] = newRow;
                } else {
                    table.content.push(newRow);
                }
            };

            updateOrInsert(mainTable, charId);
            if (attrTable) updateOrInsert(attrTable, charId);
            if (resTable) updateOrInsert(resTable, charId);

            // 7. 处理技能与法术库绑定
            if (spells.length > 0 && skillLibTable && skillLinkTable) {
                const libHeaders = getTableHeaders(skillLibTable);
                const linkHeaders = getTableHeaders(skillLinkTable);

                if (!Array.isArray(skillLibTable.content) || skillLibTable.content.length === 0) skillLibTable.content = [libHeaders];
                if (!Array.isArray(skillLinkTable.content) || skillLinkTable.content.length === 0) skillLinkTable.content = [linkHeaders];

                const libIdIdx = getColIdx(libHeaders, ['skill_id', 'SKILL_ID']);
                const libNameIdx = getColIdx(libHeaders, ['技能名称', 'ji_neng_ming_cheng']);
                const linkCharIdx = getColIdx(linkHeaders, ['char_id', 'CHAR_ID']);
                const linkSkillIdx = getColIdx(linkHeaders, ['skill_id', 'SKILL_ID']);

                spells.forEach(spell => {
                    const spellName = (spell.name || '').trim();
                    if (!spellName) return;

                    const existingLibRow = skillLibTable.content.find((r, i) => i > 0 && String(r[libNameIdx] || '').trim() === spellName);
                    let skillId = existingLibRow ? existingLibRow[libIdIdx] : null;

                    if (existingLibRow) {
                        const descIdx = getColIdx(libHeaders, ['效果描述', 'xiao_guo_miao_shu']);
                        if (descIdx !== -1 && spell.desc) existingLibRow[descIdx] = spell.desc;
                    } else {
                        const count = skillLibTable.content.length;
                        skillId = `SKILL_${String(count).padStart(2, '0')}`;
                        const newLibRow = libHeaders.map(h => {
                            const k = String(h).trim().toLowerCase();
                            if (['skill_id', 'skillid'].includes(k)) return skillId;
                            if (['技能名称', 'ji_neng_ming_cheng'].includes(k)) return spellName;
                            if (['技能类型', 'ji_neng_lei_xing'].includes(k)) return spell.type || '法术';
                            if (['环阶', 'huan_jie'].includes(k)) return spell.level !== undefined ? (String(spell.level).includes('环') ? String(spell.level) : `${spell.level}环`) : '-';
                            if (['施法时间', 'shi_fa_shi_jian'].includes(k)) return spell.time || '1动作';
                            if (['射程', 'she_cheng'].includes(k)) return spell.range || '自身';
                            if (['消耗资源', 'xiao_hao_zi_yuan'].includes(k)) return spell.cost || (spell.level ? `${spell.level}环法术位x1` : '无');
                            if (['持续时间', 'chi_xu_shi_jian'].includes(k)) return spell.duration || '立即';
                            if (['效果描述', 'xiao_guo_miao_shu'].includes(k)) return spell.desc || '';
                            if (['升阶效果', 'sheng_jie_xiao_guo'].includes(k)) return spell.upcast || '-';
                            return null;
                        });
                        skillLibTable.content.push(newLibRow);
                    }

                    const isAlreadyLinked = skillLinkTable.content.some((r, i) => i > 0 && r[linkCharIdx] === charId && r[linkSkillIdx] === skillId);
                    if (!isAlreadyLinked && skillId) {
                        const linkCount = skillLinkTable.content.length;
                        const newLinkRow = linkHeaders.map(h => {
                            const k = String(h).trim().toLowerCase();
                            if (['skill_link_id', 'link_id', 'linkid'].includes(k)) return `SLINK_${String(linkCount).padStart(2, '0')}`;
                            if (['char_id', 'charid'].includes(k)) return charId;
                            if (['skill_id', 'skillid'].includes(k)) return skillId;
                            if (['已准备', 'yi_zhun_bei'].includes(k)) return '是';
                            if (['备注', 'bei_zhu'].includes(k)) return spell.source || '创建/升级掌握';
                            return null;
                        });
                        skillLinkTable.content.push(newLinkRow);
                    }
                });
            }

            // 8. 处理专长与特性库绑定
            if (features.length > 0 && featLibTable && featLinkTable) {
                const libHeaders = getTableHeaders(featLibTable);
                const linkHeaders = getTableHeaders(featLinkTable);

                if (!Array.isArray(featLibTable.content) || featLibTable.content.length === 0) featLibTable.content = [libHeaders];
                if (!Array.isArray(featLinkTable.content) || featLinkTable.content.length === 0) featLinkTable.content = [linkHeaders];

                const libIdIdx = getColIdx(libHeaders, ['feat_id', 'FEAT_ID']);
                const libNameIdx = getColIdx(libHeaders, ['专长名称', 'zhuan_chang_ming_cheng']);
                const linkCharIdx = getColIdx(linkHeaders, ['char_id', 'CHAR_ID']);
                const linkFeatIdx = getColIdx(linkHeaders, ['feat_id', 'FEAT_ID']);

                features.forEach(feat => {
                    const featName = (feat.name || '').trim();
                    if (!featName) return;

                    const existingLibRow = featLibTable.content.find((r, i) => i > 0 && String(r[libNameIdx] || '').trim() === featName);
                    let featId = existingLibRow ? existingLibRow[libIdIdx] : null;

                    if (existingLibRow) {
                        const descIdx = getColIdx(libHeaders, ['效果描述', 'xiao_guo_miao_shu']);
                        if (descIdx !== -1 && feat.desc) existingLibRow[descIdx] = feat.desc;
                    } else {
                        const count = featLibTable.content.length;
                        featId = `FEAT_${String(count).padStart(2, '0')}`;
                        const newLibRow = libHeaders.map(h => {
                            const k = String(h).trim().toLowerCase();
                            if (['feat_id', 'featid'].includes(k)) return featId;
                            if (['专长名称', 'zhuan_chang_ming_cheng'].includes(k)) return featName;
                            if (['效果描述', 'xiao_guo_miao_shu'].includes(k)) return feat.desc || '';
                            if (['属性提升', 'shu_xing_ti_sheng'].includes(k)) return feat.stat_increase || '无';
                            return null;
                        });
                        featLibTable.content.push(newLibRow);
                    }

                    const isAlreadyLinked = featLinkTable.content.some((r, i) => i > 0 && r[linkCharIdx] === charId && r[linkFeatIdx] === featId);
                    if (!isAlreadyLinked && featId) {
                        const linkCount = featLinkTable.content.length;
                        const newLinkRow = linkHeaders.map(h => {
                            const k = String(h).trim().toLowerCase();
                            if (['feat_link_id', 'link_id', 'linkid'].includes(k)) return `FLINK_${String(linkCount).padStart(2, '0')}`;
                            if (['char_id', 'charid'].includes(k)) return charId;
                            if (['feat_id', 'featid'].includes(k)) return featId;
                            if (['获取等级', 'huo_qu_deng_ji'].includes(k)) return `${data.level || 1}级`;
                            if (['已选择项', 'yi_xuan_ze_xiang'].includes(k)) return feat.choice || '无';
                            if (['备注', 'bei_zhu'].includes(k)) return feat.note || '创建/升级获得';
                            return null;
                        });
                        featLinkTable.content.push(newLinkRow);
                    }
                });
            }
            
            // 9. 持久化保存并刷新视图
            await deps.saveData(rawData);
            state.currentStep = 'complete';
            this.saveCreatorState();
            this.renderCharacterCreationPanel($('#dnd-creator-chat-history').closest('#dnd-content'));
            
            const successMsg = state.mode === 'levelup'
                ? `🎉 角色 "${data.name}" 升级成功 (Lv.${data.level})！`
                : `🎉 ${isPC ? '主角' : '队友'} "${data.name}" 创建成功！`;
                
            deps.notification.success(successMsg, state.mode === 'levelup' ? '角色升级' : '角色创建');
            
        } catch (error) {
            console.error('[CharCreator] 保存失败:', error);
            deps.notification.error('保存失败：' + error.message);
        }
    }
  };
}
