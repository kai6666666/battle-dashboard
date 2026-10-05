// features/dnd-hud/hud-core-dynamic-bg.ts
// 动态背景桥（b11 接 DynamicBackground）（b4 · 自 BasedonST `src/ui/modules/UICore.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createHudCoreDynamicBgFragment(deps: any): any {
  return {
    _initDynamicBackground(mode) {
        const { $ } = deps.utils.getCore();
        
        // 从设置中获取背景效果类型 (默认 particles)
        const effectType = DND_CONFIG.DYNAMIC_BG?.type || 'particles';
        const enabled = DND_CONFIG.DYNAMIC_BG?.enabled !== false; // 默认启用
        
        if (!enabled) {
            deps.logger.debug('[DynamicBackground] Disabled by config');
            return;
        }
        
        try {
            if (mode === 'mini') {
                const $mini = $('#dnd-mini-hud');
                if ($mini.length && !this._dynamicBgIds.mini) {
                    this._dynamicBgIds.mini = deps.dynamicBackground.init($mini[0], effectType, {
                        particleCount: 20, // Mini HUD 使用较少的粒子
                        gearCount: 3
                    });
                    deps.logger.debug('[DynamicBackground] Initialized for Mini HUD');
                }
            } else if (mode === 'full') {
                const $full = $('#dnd-dashboard-root');
                if ($full.length && !this._dynamicBgIds.full) {
                    this._dynamicBgIds.full = deps.dynamicBackground.init($full[0], effectType, {
                        particleCount: 40, // 全屏使用更多粒子
                        gearCount: 6
                    });
                    deps.logger.debug('[DynamicBackground] Initialized for Full Dashboard');
                }
            }
        } catch (e) {
            deps.logger.warn('[DynamicBackground] Init error:', e);
        }
    },

    // [新增] 销毁动态背景
    _destroyDynamicBackgrounds() {
        try {
            if (this._dynamicBgIds.mini) {
                deps.dynamicBackground.destroy(this._dynamicBgIds.mini);
                this._dynamicBgIds.mini = null;
            }
            if (this._dynamicBgIds.full) {
                deps.dynamicBackground.destroy(this._dynamicBgIds.full);
                this._dynamicBgIds.full = null;
            }
        } catch (e) {
            deps.logger.warn('[DynamicBackground] Destroy error:', e);
        }
    },

    // [新增] 隐藏表格管理器面板，在 HUD 隐藏时调用
    switchDynamicBgEffect(effectType) {
        this.updateDynamicBackground({ type: effectType });
    },

    // [新增] 更新动态背景配置 (从 StyleManager 调用)
    updateDynamicBackground(config) {
        if (!config || !config.type) return;
        
        try {
            // 更新当前配置缓存
            if (!DND_CONFIG.DYNAMIC_BG) DND_CONFIG.DYNAMIC_BG = {};
            // 合并配置，保留 enabled 状态
            const enabled = DND_CONFIG.DYNAMIC_BG.enabled !== false;
            DND_CONFIG.DYNAMIC_BG = { ...DND_CONFIG.DYNAMIC_BG, ...config, enabled };
            
            // 如果已禁用，则不更新视觉
            if (!enabled) return;

            // 构建完整配置对象 (DynamicBackground 需要 type, colors 等在顶层或 customConfig 中)
            // 这里我们传递 type 和 剩余属性作为 customConfig
            const { type, ...customConfig } = config;

            if (this._dynamicBgIds.mini) {
                deps.dynamicBackground.switchEffect(this._dynamicBgIds.mini, type, customConfig);
            }
            if (this._dynamicBgIds.full) {
                deps.dynamicBackground.switchEffect(this._dynamicBgIds.full, type, customConfig);
            }
            
            deps.logger.info('[DynamicBackground] Updated configuration:', config.type);
        } catch (e) {
            deps.logger.warn('[DynamicBackground] Update error:', e);
        }
    },

    // [新增] 获取可用的背景效果列表
    getAvailableBgEffects() {
        return deps.dynamicBackground.getAvailableEffects();
    },

  };
}
