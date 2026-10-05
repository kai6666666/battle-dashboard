// features/dnd-hud/hud-core-helper-button.ts
// 助手按钮（注册/重试/注销）（b4 · 自 BasedonST `src/ui/modules/UICore.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createHudCoreHelperButtonFragment(deps: any): any {
  return {
    _getHelperButtonAPI() {
        const { window: coreWin } = deps.utils.getCore();
        const candidates = [];
        const addCandidate = (candidate) => {
            if (candidate && !candidates.includes(candidate)) candidates.push(candidate);
        };

        addCandidate(window);
        try { addCandidate(window.parent); } catch (e) {}
        try { addCandidate(window.top); } catch (e) {}
        addCandidate(coreWin);

        for (const candidate of candidates) {
            const getButtonEvent = candidate.getButtonEvent;
            const eventOn = candidate.eventOn;
            if (typeof getButtonEvent === 'function' && typeof eventOn === 'function') {
                return {
                    getButtonEvent,
                    eventOn,
                    appendInexistentScriptButtons: candidate.appendInexistentScriptButtons,
                    sourceWindow: candidate
                };
            }
        }

        return null;
    },

    _scheduleHelperButtonRetry() {
        if (!this._hideFloatingBall || this._helperButtonRegistered || this._helperButtonRetryTimer) return;
        if (this._helperButtonRetryCount >= 30) {
            deps.logger.warn('[UICore] Helper 按钮事件注册重试已达到上限');
            return;
        }

        this._helperButtonRetryCount += 1;
        this._helperButtonRetryTimer = setTimeout(() => {
            this._helperButtonRetryTimer = null;
            this.registerHelperButtonEvent({ scheduleRetry: true });
        }, 1000);
    },

    unregisterHelperButtonEvent() {
        if (this._helperButtonStop && typeof this._helperButtonStop.stop === 'function') {
            try {
                this._helperButtonStop.stop();
            } catch (e) {
                deps.logger.warn('[UICore] Helper 按钮监听清理失败:', e);
            }
        }

        this._helperButtonStop = null;
        this._helperButtonRegistered = false;

        if (this._helperButtonRetryTimer) {
            clearTimeout(this._helperButtonRetryTimer);
            this._helperButtonRetryTimer = null;
        }

        this._helperButtonRetryCount = 0;
    },

    // [新增] 注册 Tavern Helper 按钮事件
    registerHelperButtonEvent(options = {}) {
        if (!this._hideFloatingBall) {
            deps.logger.debug('[UICore] 隐藏浮动球未启用，跳过 Helper 按钮注册');
            return;
        }

        if (this._helperButtonRegistered) return;
        const { scheduleRetry = false } = options;

        if (this._helperButtonStop) {
            this.unregisterHelperButtonEvent();
        }
        
        try {
            // 安全检查 Helper API 是否存在
            const helperAPI = this._getHelperButtonAPI();
            
            if (!helperAPI) {
                deps.logger.debug('[UICore] Tavern Helper API 不可用，等待重试');
                if (scheduleRetry) this._scheduleHelperButtonRetry();
                return;
            }

            const { getButtonEvent, eventOn, appendInexistentScriptButtons } = helperAPI;
            
            // 尝试创建按钮（如果不存在）
            if (appendInexistentScriptButtons) {
                try {
                    appendInexistentScriptButtons([{ name: 'DND仪表盘', visible: true }]);
                } catch (e) {
                    deps.logger.debug('[UICore] Helper 按钮已存在或创建失败:', e.message);
                }
            }
            
            // 注册按钮点击事件
            const buttonEvent = getButtonEvent('DND仪表盘');
            if (buttonEvent) {
                this._helperButtonStop = eventOn(buttonEvent, () => {
                    if (!this._hideFloatingBall) {
                        deps.logger.debug('[UICore] Helper 按钮点击已忽略：隐藏浮动球模式未启用');
                        return;
                    }

                    deps.logger.info('[UICore] Helper 按钮被点击');

                    // 隐藏浮动球模式下，助手按钮承担主开关职责：
                    // collapsed -> mini，mini/full -> collapsed
                    this.toggleDashboard('helper-button');
                });
                
                this._helperButtonRegistered = true;
                this._helperButtonRetryCount = 0;
                if (this._helperButtonRetryTimer) {
                    clearTimeout(this._helperButtonRetryTimer);
                    this._helperButtonRetryTimer = null;
                }
                deps.logger.info('[UICore] Helper 按钮事件已注册');
            } else if (scheduleRetry) {
                deps.logger.debug('[UICore] Helper 按钮事件名暂不可用，等待重试');
                this._scheduleHelperButtonRetry();
            }
        } catch (e) {
            deps.logger.warn('[UICore] 注册 Helper 按钮事件失败:', e.message);
            if (scheduleRetry) this._scheduleHelperButtonRetry();
        }
    },
    
  };
}
