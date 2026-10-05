// features/dnd-hud/hud-core-floating-ball.ts
// 悬浮球（位置解析/可见性）（b4 · 自 BasedonST `src/ui/modules/UICore.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createHudCoreFloatingBallFragment(deps: any): any {
  return {
    _parseSavedPosition(raw) {
        if (!raw) return null;
        let pos = raw;

        if (typeof pos === 'string') {
            try {
                pos = JSON.parse(pos);
            } catch (e) {
                return null;
            }
        }

        if (!pos || typeof pos.left !== 'string' || typeof pos.top !== 'string') {
            return null;
        }

        return {
            left: pos.left,
            top: pos.top
        };
    },

    // [新增] 应用浮动球可见性设置
    async applyFloatingBallVisibility() {
        const { $ } = deps.utils.getCore();
        const savedHide = await deps.dbAdapter.getSetting(DND_CONFIG.STORAGE_KEYS.HIDE_FLOATING_BALL);
        this._hideFloatingBall = savedHide === true || savedHide === 'true';
        this._miniHudPos = this._parseSavedPosition(await deps.dbAdapter.getSetting(DND_CONFIG.STORAGE_KEYS.MINI_HUD_POS));
        
        const $btn = $('#dnd-toggle-btn');
        if (this._hideFloatingBall) {
            $btn.addClass('dnd-force-hidden');
            deps.logger.info('[UICore] 浮动球已隐藏');

            if (!this._helperButtonRegistered) {
                this.registerHelperButtonEvent({ scheduleRetry: true });
            }
        } else {
            this.unregisterHelperButtonEvent();
            $btn.removeClass('dnd-force-hidden');
            deps.logger.info('[UICore] 浮动球已显示');
        }
        
        // 触发 HUD 位置更新
        if (window.DND_Dashboard_UI && window.DND_Dashboard_UI.updateHUDPosition) {
            window.DND_Dashboard_UI.updateHUDPosition();
        }
    },

  };
}
