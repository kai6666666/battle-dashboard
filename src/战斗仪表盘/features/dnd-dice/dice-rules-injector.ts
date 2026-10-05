// features/dnd-dice/dice-rules-injector.ts
// 骰子规则注入器（b9 · 自 BasedonST `src/features/DiceRulesInjector.js` 移植；保留原能力）
import { diceRulesWorldbook } from './dice-rules-data';
import { DND_CONFIG } from '../dnd-core';

const PROMPT_ID = 'dnd_dice_rules';
const INJECTION_DEPTH = 2;
const RETRY_DELAY = 1000;
const RETRY_LIMIT = 10;

export function createDiceRulesInjector(deps: any): any {
  const DiceRulesInjector: any = {
    _initialized: false,
    _settingsBound: false,
    _runtimeEventsBound: false,
    _runtimePromptSynced: false,
    _chatChangedHandler: null,
    _generationHandler: null,

    getPromptText() {
        const entries = diceRulesWorldbook?.entries || {};
        const primaryEntry = entries['0'] || Object.values(entries)[0];
        return typeof primaryEntry?.content === 'string' ? primaryEntry.content.trim() : '';
    },

    async isEnabled() {
        const saved = await deps.tavernSettingsSync.getSetting(DND_CONFIG.STORAGE_KEYS.INJECT_DICE_RULES, false);
        return saved === true || saved === 'true';
    },

    _getRuntime() {
        const { SillyTavern, TavernHelper } = deps.tavernApi.deps.utils.getCore();
        return { SillyTavern, TavernHelper };
    },

    async init() {
        if (this._initialized) return;

        this._initialized = true;
        this._bindSettingsChanged();
        void this._syncWhenPromptApiReady('init');
        this._scheduleRuntimeBinding(0);
    },

    _hasPromptApi() {
        const { TavernHelper, SillyTavern } = this._getRuntime();
        return !!(
            (TavernHelper?.injectPrompts && TavernHelper?.uninjectPrompts)
            || typeof SillyTavern?.setExtensionPrompt === 'function'
        );
    },

    async _syncWhenPromptApiReady(reason = 'runtime-ready') {
        if (!this._hasPromptApi()) {
            this._runtimePromptSynced = false;
            return false;
        }

        if (this._runtimePromptSynced) {
            return true;
        }

        this._runtimePromptSynced = true;
        await this.syncPrompt(reason);
        return true;
    },

    _bindSettingsChanged() {
        if (this._settingsBound) return;

        const { $ } = deps.utils.getCore();
        if (!$) return;

        $(document)
            .off('dnd:settings-changed.diceRules')
            .on('dnd:settings-changed.diceRules', () => {
                void this.syncPrompt('settings-changed');
            });

        this._settingsBound = true;
    },

    _scheduleRuntimeBinding(attempt) {
        void this._syncWhenPromptApiReady(`runtime-ready-${attempt}`);

        if (this._bindRuntimeEvents()) {
            return;
        }

        if (attempt >= RETRY_LIMIT) {
            deps.logger.warn('[DiceRulesInjector] 运行时事件未就绪，将仅响应本地设置变更');
            return;
        }

        window.setTimeout(() => this._scheduleRuntimeBinding(attempt + 1), RETRY_DELAY);
    },

    _bindRuntimeEvents() {
        if (this._runtimeEventsBound) return true;

        const { SillyTavern } = this._getRuntime();
        const eventSource = SillyTavern?.eventSource;
        const eventTypes = SillyTavern?.eventTypes;

        if (!eventSource?.on || !eventTypes) {
            return false;
        }

        this._chatChangedHandler = () => {
            void this.syncPrompt('chat-changed');
        };
        this._generationHandler = () => {
            void this.syncPrompt('generation-after-commands');
        };

        eventSource.on(eventTypes.CHAT_CHANGED, this._chatChangedHandler);
        eventSource.on(eventTypes.GENERATION_AFTER_COMMANDS, this._generationHandler);

        this._runtimeEventsBound = true;
        deps.logger.info('[DiceRulesInjector] 已绑定 CHAT_CHANGED / GENERATION_AFTER_COMMANDS 事件');
        return true;
    },

    async syncPrompt(reason = 'manual') {
        const enabled = await this.isEnabled();
        if (!enabled) {
            return this.uninject(reason);
        }

        const promptText = this.getPromptText();
        if (!promptText) {
            deps.logger.warn('[DiceRulesInjector] 规则文本为空，跳过注入');
            return false;
        }

        const { TavernHelper, SillyTavern } = this._getRuntime();

        try {
            if (TavernHelper?.injectPrompts && TavernHelper?.uninjectPrompts) {
                TavernHelper.uninjectPrompts([PROMPT_ID]);

                if (typeof SillyTavern?.setExtensionPrompt === 'function') {
                    await SillyTavern.setExtensionPrompt(PROMPT_ID, '', -1, INJECTION_DEPTH, false, 0, () => false);
                }

                TavernHelper.injectPrompts([
                    {
                        id: PROMPT_ID,
                        position: 'in_chat',
                        depth: INJECTION_DEPTH,
                        role: 'system',
                        content: promptText,
                        should_scan: false
                    }
                ]);
                deps.logger.info(`[DiceRulesInjector] 已通过 TavernHelper 注入规则 (${reason})`);
                return true;
            }

            if (typeof SillyTavern?.setExtensionPrompt === 'function') {
                await SillyTavern.setExtensionPrompt(PROMPT_ID, promptText, 1, INJECTION_DEPTH, false, 0, () => true);
                deps.logger.info(`[DiceRulesInjector] 已通过 SillyTavern 注入规则 (${reason})`);
                return true;
            }

            deps.logger.warn('[DiceRulesInjector] 未找到可用的提示词注入 API');
            return false;
        } catch (error) {
            deps.logger.error('[DiceRulesInjector] 注入失败:', error);
            return false;
        }
    },

    async inject(reason = 'manual') {
        return this.syncPrompt(reason);
    },

    async setEnabled(enabled) {
        await deps.tavernSettingsSync.setSetting(DND_CONFIG.STORAGE_KEYS.INJECT_DICE_RULES, !!enabled);
        return this.syncPrompt('toggle');
    },

    async uninject(reason = 'manual') {
        const { TavernHelper, SillyTavern } = this._getRuntime();
        let removed = false;

        try {
            if (TavernHelper?.uninjectPrompts) {
                TavernHelper.uninjectPrompts([PROMPT_ID]);
                removed = true;
            }
        } catch (error) {
            deps.logger.warn('[DiceRulesInjector] TavernHelper 取消注入失败:', error);
        }

        try {
            if (typeof SillyTavern?.setExtensionPrompt === 'function') {
                await SillyTavern.setExtensionPrompt(PROMPT_ID, '', -1, INJECTION_DEPTH, false, 0, () => false);
                removed = true;
            }
        } catch (error) {
            deps.logger.warn('[DiceRulesInjector] SillyTavern 取消注入失败:', error);
        }

        if (removed) {
            deps.logger.info(`[DiceRulesInjector] 已移除规则注入 (${reason})`);
        }

        return removed;
    }
  };
  return DiceRulesInjector;
}
