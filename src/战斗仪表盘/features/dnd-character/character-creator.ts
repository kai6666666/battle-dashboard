// features/dnd-character/character-creator.ts
// 创建向导（面板渲染）（b5 · 自 BasedonST `src/ui/modules/UICharacter.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createCharacterCreatorFragment(deps: any): any {
  return {
    _charCreatorState: null,
    _charCreatorLoading: false,

    

    // [新增] 根据所选世界书解析应注入的世界书内容
    // - '__auto__'（默认）: 当前酒馆启用的全部世界书
    // - 具体名称: 仅读取指定的世界书
    // - '' / null: 不使用世界书
    async resolveCreatorWorldInfo(selectedWorldbook) {
        const sel = (selectedWorldbook === undefined || selectedWorldbook === null) ? '__auto__' : selectedWorldbook;
        if (sel === '__auto__') return await deps.tavernApi.getEnabledWorldInfo();
        if (sel) return await deps.tavernApi.getEnabledWorldInfo(sel);
        return '';
    },

    // [新增] 启动升级流程
    saveCreatorState() {
        if (this._charCreatorState) {
            deps.utils.safeSave('dnd_creator_state', JSON.stringify(this._charCreatorState));
        }
    },

    // [新增] 格式化聊天消息 (Markdown + 清理数据块)
    formatChatMessage(content) {
        if (!content) return '';
        
        // 1. 移除 CHARACTER_OPTIONS 和 CHARACTER_DATA 块
        let text = content
            .replace(/```CHARACTER_OPTIONS\s*[\s\S]*?```/g, '')
            .replace(/```CHARACTER_DATA\s*[\s\S]*?```/g, '')
            .trim();
        
        // 2. HTML 转义 (基本)
        text = text
            .replace(/&/g, "&")
            .replace(/</g, "<")
            .replace(/>/g, ">");

        // 3. Markdown 渲染
        // Code blocks
        text = text.replace(/```([\s\S]*?)```/g, '<pre class="dnd-md-pre"><code>$1</code></pre>');
        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code class="dnd-md-code">$1</code>');
        // Headers
        text = text.replace(/^### (.*$)/gm, '<h3 class="dnd-md-h3">$1</h3>');
        text = text.replace(/^## (.*$)/gm, '<h2 class="dnd-md-h2">$1</h2>');
        text = text.replace(/^# (.*$)/gm, '<h1 class="dnd-md-h1">$1</h1>');
        // Bold & Italic
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Lists
        text = text.replace(/^\s*-\s+(.*$)/gm, '<li class="dnd-md-li">$1</li>');
        
        return text;
    },

    renderCharacterCreationPanel($container) {
        const { $ } = deps.utils.getCore();
        
        // 获取 API 预设列表
        const presets = deps.tavernApi.getPresets();
        
        // 初始化角色创建状态 (支持持久化恢复)
        if (!this._charCreatorState) {
            // 防止重复加载
            if (this._charCreatorLoading) {
                $container.html('<div style="padding:50px;text-align:center;color:#888;">⏳ 正在恢复会话...</div>');
                return;
            }

            this._charCreatorLoading = true;
            $container.html('<div style="padding:50px;text-align:center;color:#888;">⏳ 正在初始化...</div>');

            // 尝试从存储加载状态
            deps.dbAdapter.getSetting('dnd_creator_state').then(async savedState => {
                this._charCreatorLoading = false;
                
                if (savedState) {
                    try {
                        this._charCreatorState = typeof savedState === 'string' ? JSON.parse(savedState) : savedState;
                        console.log('[DND Creator] 已恢复上次未完成的创建会话');
                    } catch(e) { console.error('[DND Creator] 状态解析失败', e); }
                }

                // 【修复】获取最新的全部世界书列表
                const allWorldbooks = await deps.tavernApi.getAllWorldbookNames();
                const defaultWb = (allWorldbooks && allWorldbooks.length > 0) ? '__auto__' : '';

                if (!this._charCreatorState) {
                    let apiConfig = { provider: 'plugin', url: '', key: '', model: '' };
                    // [修复] 不再硬编码世界书名：默认"当前启用的全部世界书"（无世界书时回退为不使用）
                    const selectedWorldbook = defaultWb;
                    const worldInfo = await this.resolveCreatorWorldInfo(selectedWorldbook);

                    this._charCreatorState = {
                        selectedPresetId: null,
                        apiConfig: apiConfig,
                        modelList: [],
                        conversationHistory: [],
                        characterData: {},
                        isGenerating: false,
                        currentStep: 'init',
                        characterType: 'pc',
                        selectedWorldbook: selectedWorldbook, // [新增] 参考世界书选择
                        availableWorldbooks: allWorldbooks, // [新增] 可选世界书列表
                        worldInfo: worldInfo,
                        useWorldInfo: !!selectedWorldbook
                    };
                } else {
                    // [修复] 恢复会话时同步世界书列表与选择，并按当前选择刷新世界书内容
                    this._charCreatorState.availableWorldbooks = allWorldbooks;
                    if (this._charCreatorState.selectedWorldbook === undefined) {
                        this._charCreatorState.selectedWorldbook = defaultWb;
                    }
                    this._charCreatorState.worldInfo = await this.resolveCreatorWorldInfo(this._charCreatorState.selectedWorldbook);
                    this._charCreatorState.useWorldInfo = !!this._charCreatorState.selectedWorldbook;
                }

                // 无论是恢复会话还是全新开始，都强制同步一次最新的全局 API 配置
                const latestApiConfig = await deps.settingsManager.getAPIConfig();
                if (this._charCreatorState && latestApiConfig) {
                    this._charCreatorState.apiConfig = {
                        provider: 'plugin',
                        url: '',
                        key: '',
                        model: '',
                        ...(this._charCreatorState.apiConfig || {}),
                        ...latestApiConfig
                    };
                    this.saveCreatorState();
                }
                
                // 状态已就绪，刷新显示
                this.renderCharacterCreationPanel($container);
            });
            return; // 等待异步加载
        }
        
        const state = this._charCreatorState;
        
        // 构建模型选择器 HTML
        let modelOptionsHtml = '<option value="">-- 请先获取模型 --</option>';
        if (state.modelList && state.modelList.length > 0) {
            modelOptionsHtml = '<option value="">-- 选择模型 --</option>';
            state.modelList.forEach(m => {
                const selected = state.apiConfig.model === m ? 'selected' : '';
                modelOptionsHtml += `<option value="${m}" ${selected}>${m}</option>`;
            });
        } else if (state.apiConfig.model) {
            // 如果有保存的模型但没列表，先显示当前保存的
            modelOptionsHtml = `<option value="${state.apiConfig.model}" selected>${state.apiConfig.model}</option>`;
        }
        
        // 对话历史 HTML
        let chatHistoryHtml = '';
        if (state.conversationHistory.length > 0) {
            state.conversationHistory.forEach((msg, idx) => {
                const isUser = msg.role === 'user';
                const bgColor = isUser ? 'rgba(52, 152, 219, 0.1)' : 'rgba(155, 89, 182, 0.1)';
                const borderColor = isUser ? '#3498db' : '#9b59b6';
                const icon = isUser ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
                chatHistoryHtml += `
                    <div class="dnd-chat-msg dnd-anim-entry" style="animation-delay:${idx * 0.05}s; background:${bgColor}; border-left:3px solid ${borderColor}; padding:10px 12px; margin-bottom:8px; border-radius:4px;">
                        <div style="font-size:11px;color:#888;margin-bottom:4px;">${icon} ${isUser ? '你' : 'AI 向导'}</div>
                        <div style="color:var(--dnd-text-main);line-height:1.5;white-space:pre-wrap;">${this.formatChatMessage(msg.content)}</div>
                    </div>
                `;
            });
        }
        
        // 当前步骤提示
        let stepHint = '';
        switch(state.currentStep) {
            case 'init':
                stepHint = '选择 API 预设后，点击"开始创建"与 AI 向导对话，逐步构建你的角色。';
                break;
            case 'chatting':
                stepHint = '与 AI 向导对话中...回答问题或提出你的想法，AI 会帮助你完善角色设定。';
                break;
            case 'reviewing':
                stepHint = '角色信息已生成！请检查下方预览，确认无误后点击"确认创建"。';
                break;
            case 'complete':
                stepHint = '🎉 角色创建完成！数据已保存到角色卡。';
                break;
        }
        
        const isLevelUp = state.mode === 'levelup';
        const title = isLevelUp ? `${deps.icons.LEVEL_UP} 角色升级向导` : `${deps.icons.SWORD} AI 角色创建向导`;
        
        const html = `
            <div class="dnd-char-creator-panel" style="max-width:800px;margin:0 auto;">
                <!-- 标题区 -->
                <div style="text-align:center;margin-bottom:20px;">
                    <h2 style="color:var(--dnd-text-highlight);font-family:var(--dnd-font-serif);margin:0 0 10px 0;">
                        ${title}
                    </h2>
                    <p style="color:#888;font-size:13px;margin:0;">${stepHint}</p>
                </div>
                
                <!-- 设置区域 -->
                <div style="background:rgba(0,0,0,0.3);padding:15px;border-radius:6px;margin-bottom:15px;border:1px solid var(--dnd-border-inner);">
                    <div style="display:flex;align-items:center;gap:15px;flex-wrap:wrap;">
                        <!-- 角色类型选择 (升级模式下隐藏) -->
                        <div style="min-width:150px; ${isLevelUp ? 'display:none;' : ''}">
                            <label style="font-size:12px;color:#888;display:block;margin-bottom:5px;">角色类型</label>
                            <div style="display:flex;gap:5px;">
                                <button id="dnd-creator-type-pc" class="dnd-clickable" style="
                                    flex:1;
                                    padding:8px 12px;
                                    background:${state.characterType === 'pc' ? 'var(--dnd-border-gold)' : '#1a1a1c'};
                                    border:1px solid ${state.characterType === 'pc' ? 'var(--dnd-border-gold)' : 'var(--dnd-border-inner)'};
                                    color:${state.characterType === 'pc' ? '#000' : 'var(--dnd-text-main)'};
                                    border-radius:4px;
                                    font-size:12px;
                                    cursor:pointer;
                                " ${state.currentStep !== 'init' ? 'disabled' : ''}><i class="fa-solid fa-user"></i> 主角</button>
                                <button id="dnd-creator-type-party" class="dnd-clickable" style="
                                    flex:1;
                                    padding:8px 12px;
                                    background:${state.characterType === 'party' ? 'var(--dnd-border-gold)' : '#1a1a1c'};
                                    border:1px solid ${state.characterType === 'party' ? 'var(--dnd-border-gold)' : 'var(--dnd-border-inner)'};
                                    color:${state.characterType === 'party' ? '#000' : 'var(--dnd-text-main)'};
                                    border-radius:4px;
                                    font-size:12px;
                                    cursor:pointer;
                                " ${state.currentStep !== 'init' ? 'disabled' : ''}><i class="fa-solid fa-users"></i> 队友</button>
                            </div>
                        </div>
                        
                        <!-- API 状态显示 -->
                        <div style="flex:1;min-width:300px;background:rgba(0,0,0,0.2);padding:10px;border-radius:4px;border:1px solid var(--dnd-border-inner);">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                <label style="font-size:12px;color:#888;">API 状态</label>
                                <div style="font-size:11px;color:${state.apiConfig.key ? '#2ecc71' : '#e74c3c'}">
                                    ${state.apiConfig.key ? '<i class="fa-solid fa-check-circle"></i> 已配置' : '<i class="fa-solid fa-times-circle"></i> 未配置'}
                                </div>
                            </div>
                            <div style="font-size:11px;color:#aaa;margin-bottom:8px;">
                                URL: ${state.apiConfig.url || '未设置'}<br>
                                Model: ${state.apiConfig.model || '未设置'}
                            </div>
                            
                            <!-- 世界书选择下拉列表 -->
                            <div style="margin-bottom:8px; display:flex; flex-direction:column; gap:4px;">
                                <label style="font-size:12px; color:#888; display:flex; align-items:center; gap:5px;"><i class="fa-solid fa-book"></i> 参考世界书</label>
                                <select id="dnd-creator-worldinfo-select" style="width:100%; padding:6px 8px; background:#1a1a1c; border:1px solid var(--dnd-border-inner); color:#ccc; border-radius:4px; font-size:12px;">
                                    <option value="" ${!state.selectedWorldbook ? 'selected' : ''}>-- 不使用世界书 --</option>
                                    <option value="__auto__" ${state.selectedWorldbook === '__auto__' ? 'selected' : ''}>📚 [默认] 当前启用的全部世界书</option>
                                    ${(state.availableWorldbooks || []).map(b => `<option value="${b}" ${state.selectedWorldbook === b ? 'selected' : ''}>📖 ${b}</option>`).join('')}
                                </select>
                            </div>

                            <button type="button" onclick="window.DND_Dashboard_UI.renderPanel('settings')" class="dnd-clickable" style="width:100%;padding:6px;background:#2a2a2c;border:1px solid #555;color:#ccc;border-radius:4px;cursor:pointer;font-size:12px;">
                                <i class="fa-solid fa-cog"></i> 前往设置配置 API
                            </button>
                        </div>
                        <div style="display:flex;gap:10px;">
                            ${state.currentStep === 'init' ? `
                                <button id="dnd-creator-start-btn" class="dnd-clickable" style="
                                    background:linear-gradient(135deg, var(--dnd-accent-green), #27ae60);
                                    border:none;
                                    color:#fff;
                                    padding:10px 20px;
                                    border-radius:4px;
                                    cursor:pointer;
                                    font-weight:bold;
                                    font-size:13px;
                                "><i class="fa-solid fa-bolt"></i> 开始创建</button>
                            ` : ''}
                            ${state.currentStep !== 'init' ? `
                                <button id="dnd-creator-reset-btn" class="dnd-clickable" style="
                                    background:rgba(192, 57, 43, 0.2);
                                    border:1px solid #c0392b;
                                    color:#e74c3c;
                                    padding:8px 15px;
                                    border-radius:4px;
                                    cursor:pointer;
                                    font-size:12px;
                                "><i class="fa-solid fa-sync"></i> 重新开始</button>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- 对话区域 -->
                <div style="display:flex;gap:15px;flex-wrap:wrap;">
                    <!-- 左侧：对话历史 -->
                    <div style="flex:2;min-width:300px;">
                        <div style="background:rgba(0,0,0,0.2);border:1px solid var(--dnd-border-inner);border-radius:6px;overflow:hidden;">
                            <div style="background:rgba(255,255,255,0.05);padding:10px 15px;border-bottom:1px solid var(--dnd-border-inner);">
                                <span style="color:var(--dnd-text-header);font-weight:bold;"><i class="fa-solid fa-comments"></i> 对话记录</span>
                                <span style="float:right;font-size:11px;color:#666;">${state.conversationHistory.length} 条消息</span>
                            </div>
                            <div id="dnd-creator-chat-history" style="height:350px;overflow-y:auto;padding:15px;">
                                ${chatHistoryHtml || '<div style="color:#666;text-align:center;padding:50px 20px;">对话将在这里显示...<br><br>点击"开始创建"与 AI 向导对话</div>'}
                            </div>
                        </div>
                        
                        <!-- 输入区 -->
                        <div style="margin-top:10px;display:flex;gap:10px;">
                            <button id="dnd-creator-stats-btn" class="dnd-clickable" style="
                                background:rgba(255,255,255,0.1);
                                border:1px solid #555;
                                color:#ccc;
                                padding:0 12px;
                                border-radius:4px;
                                cursor:pointer;
                                font-size:16px;
                            " title="属性生成器"><i class="fa-solid fa-sort-numeric-down"></i></button>
                            <input type="text" id="dnd-creator-user-input" placeholder="输入你的回答或想法..." style="
                                flex:1;
                                padding:10px 15px;
                                background:#1a1a1c;
                                border:1px solid var(--dnd-border-inner);
                                color:var(--dnd-text-main);
                                border-radius:4px;
                                font-size:13px;
                            " ${state.currentStep === 'init' || state.isGenerating ? 'disabled' : ''}>
                            <button id="dnd-creator-send-btn" class="dnd-clickable" style="
                                background:var(--dnd-border-gold);
                                border:none;
                                color:#000;
                                padding:10px 20px;
                                border-radius:4px;
                                cursor:pointer;
                                font-weight:bold;
                            " ${state.currentStep === 'init' || state.isGenerating ? 'disabled' : ''}>
                                ${state.isGenerating ? '<i class="fa-solid fa-hourglass-half"></i> 生成中...' : '<i class="fa-solid fa-paper-plane"></i> 发送'}
                            </button>
                        </div>
                        
                        <!-- 快捷回复按钮 -->
                        <div id="dnd-creator-quick-replies" style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
                            <!-- 动态生成 -->
                        </div>
                    </div>
                    
                    <!-- 右侧：角色预览 -->
                    <div style="flex:1;min-width:250px;">
                        <div style="background:rgba(0,0,0,0.2);border:1px solid var(--dnd-border-gold);border-radius:6px;overflow:hidden;">
                            <div style="background:linear-gradient(135deg, rgba(157, 139, 108, 0.2), rgba(157, 139, 108, 0.1));padding:10px 15px;border-bottom:1px solid var(--dnd-border-gold);">
                                <span style="color:var(--dnd-text-highlight);font-weight:bold;"><i class="fa-solid fa-clipboard-list"></i> 角色预览</span>
                            </div>
                            <div id="dnd-creator-preview" style="padding:15px;min-height:300px;">
                                ${this.renderCharacterPreview(state.characterData)}
                            </div>
                        </div>
                        
                        ${state.currentStep === 'reviewing' ? `
                            <div style="margin-top:15px;display:flex;gap:10px;">
                                <button id="dnd-creator-confirm-btn" class="dnd-clickable" style="
                                    flex:1;
                                    background:linear-gradient(135deg, var(--dnd-accent-green), #27ae60);
                                    border:none;
                                    color:#fff;
                                    padding:12px;
                                    border-radius:4px;
                                    cursor:pointer;
                                    font-weight:bold;
                                "><i class="fa-solid fa-check-circle"></i> 确认创建</button>
                                <button id="dnd-creator-modify-btn" class="dnd-clickable" style="
                                    background:rgba(241, 196, 15, 0.2);
                                    border:1px solid #f1c40f;
                                    color:#f1c40f;
                                    padding:12px 20px;
                                    border-radius:4px;
                                    cursor:pointer;
                                "><i class="fa-solid fa-pen"></i> 继续修改</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        $container.html(html);
        
        // 绑定事件
        this.bindCharacterCreatorEvents($container);
    },

    // [新增] 显示属性生成器
  };
}
