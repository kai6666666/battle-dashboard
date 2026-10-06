// features/dnd-hud/hud-core-state.ts
// 核心状态机（开关/缩放/受控角色）（b4 · 自 BasedonST `src/ui/modules/UICore.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createHudCoreStateFragment(deps: any): any {
  return {
    state: 'collapsed', // 'collapsed', 'mini', 'full'
    _lastToggleTime: 0, // 用于防止重复触发
    _controlledCharId: null, // [新增] 当前操控的角色ID，null表示默认PC
    _dynamicBgIds: {}, // [新增] 动态背景效果实例ID存储
    _hideFloatingBall: false, // [新增] 隐藏浮动球模式开关
    _helperButtonRegistered: false, // [新增] Helper 按钮事件是否已注册
    _helperButtonStop: null,
    _helperButtonRetryTimer: null,
    _helperButtonRetryCount: 0,
    _miniHudPos: null,

    setControlledCharacter(charId) {
        const oldCharId = this._controlledCharId;


        //获取操纵角色的名字
        const party = deps.dataManager.getPartyData();
        const char = party.find(p => p['CHAR_ID'] === charId || p['PC_ID'] === charId || p['姓名'] === charId);

        this._controlledCharId = charId;
        
        // [修复] 切换角色时，通知战斗模块保存旧资源并加载/重置新角色资源
        if (typeof this.switchTurnContext === 'function') {
            ((window as any).DND_Dashboard_UI || this).switchTurnContext?.(oldCharId, charId);
        } else if (typeof this.resetActionEconomy === 'function') {
            // 如果没有编写复杂的切换逻辑，至少要重置一次动作经济以刷新速度
            ((window as any).DND_Dashboard_UI || this).resetActionEconomy?.();
        }
        
        if (this.initResourceTracker) ((window as any).DND_Dashboard_UI || this).initResourceTracker?.();

        //在数据库内切换主角
        if (charId && deps.dataManager.updateMainCharacterInDB) {
            deps.dataManager.updateMainCharacterInDB(charId);
        }


        //在酒馆原生用户角色中切换主角
        if (char && char['姓名'] && deps.dataManager.syncSTUserPersona) {
            deps.dataManager.syncSTUserPersona(char['姓名']);
        }

        // 刷新战斗HUD
        this.renderHUD();
        // 显示切换通知
        deps.presetSwitcher.showNotification(true, `已切换操控: ${charId || '默认'}`);
    },


    getControlledCharacter() {
        if (this._controlledCharId) {
            const party = deps.dataManager.getPartyData();
            return party.find(p =>
                p['CHAR_ID'] === this._controlledCharId ||
                p['PC_ID'] === this._controlledCharId ||
                p['姓名'] === this._controlledCharId
            );
        }
        return this.getCurrentActiveCharacter();
    },

    // [新增] 获取当前活跃角色 (PC 或 回合轮到的队友)
    getCurrentActiveCharacter() {
        const party = deps.dataManager.getPartyData();
        const encounters = deps.dataManager.getTable('COMBAT_Encounter');
        
        // 1. 尝试从战斗数据中找 "是否为当前行动者"
        if (encounters) {
            const active = encounters.find(e => e['是否为当前行动者'] === '是');
            if (active) {
                // 匹配回 Party 数据以获取详情
                const match = party.find(p => p['姓名'] === active['单位名称']);
                if (match) return match;
            }
        }
        
        // 2. 默认返回 PC
        return party.find(p => p.type === 'PC' || p.isPC) || party[0];
    },

    // [新增] 应用 UI 缩放
    applyUIScale(scale) {
        const { $ } = deps.utils.getCore();
        const s = parseFloat(scale) || 1.0;
        
        // 设置 CSS 变量 (供 CSS 引用)
        document.documentElement.style.setProperty('--dnd-ui-scale', s);

        // 使用样式注入确保覆盖所有相关元素 (包括动态生成的)
        if ($('#dnd-scale-style').length === 0) {
            $('head').append(`<style id="dnd-scale-style"></style>`);
        }
        
        // A. 悬浮元素：直接缩放
        const floatingSelectors = [
            '#dnd-mini-hud',
            '#dnd-toggle-btn',
            '#dnd-tooltip',
            '#dnd-position-dialog',
            '.dnd-generic-popup'
        ];

        // B. 全屏容器：缩放并补偿尺寸，确保始终填满屏幕
        const fullscreenSelectors = [
            '#dnd-dashboard-root'
        ];

        // 计算反向比例 (例如放大1.2倍，宽度需要设为 100/1.2 = 83.333% 才能在放大后刚好填满)
        const reverseScale = (100 / s).toFixed(4);

        $('#dnd-scale-style').html(`
            ${floatingSelectors.join(', ')} {
                zoom: ${s};
            }
            ${fullscreenSelectors.join(', ')} {
                zoom: ${s};
                width: ${reverseScale}vw !important;
                height: ${reverseScale}vh !important;
                top: 0 !important;
                left: 0 !important;
            }
        `);
        
        // 记录当前缩放比例供其他模块使用
        this.currentScale = s;
        deps.logger.info('[UICore] Applied UI scale:', s, 'Compensated size:', reverseScale + '%');
        
        // 强制更新 HUD 位置，因为尺寸可能变了
        if (window.DND_Dashboard_UI && window.DND_Dashboard_UI.updateHUDPosition) {
            setTimeout(() => window.DND_Dashboard_UI.updateHUDPosition(), 100);
        }
    },

    // [新增] 切换仪表盘状态的辅助方法
    toggleDashboard(trigger = 'manual') {
        const now = Date.now();
        const debounceDelay = DND_CONFIG.ANIMATION?.DEBOUNCE_DELAY || 150;

        if (now - this._lastToggleTime < debounceDelay) {
            deps.logger.debug(`[UICore] 忽略过快的重复切换 (${trigger})`);
            return false;
        }

        this._lastToggleTime = now;
        deps.logger.info(`[UICore] toggleDashboard 被调用 (${trigger})，当前状态:`, this.state);
        
        // [b12.5] 点悬浮球：纯 Mini HUD 开关（collapsed ↔ mini；主面板入口在小窗「D20」上）
        if (this.state === 'collapsed') {
            this.setState('mini');
        } else {
            this.setState('collapsed');
        }

        return true;
    },

    setState(newState) {
        const { $ } = deps.utils.getCore();
        this.state = newState;
        
        const $full = $('#dnd-dashboard-root');
        const $mini = $('#dnd-mini-hud');
        const $btn = $('#dnd-toggle-btn');

        $full.removeClass('visible');
        $mini.removeClass('visible');
        
        // 确保按钮显示状态 (使用 class 控制动画)
        $btn.show(); // 确保不是 display:none
        
        switch (newState) {
            case 'collapsed':
                $btn.removeClass('dnd-hidden');
                // 销毁动态背景以节省性能
                this._destroyDynamicBackgrounds();
                // [修复] 隐藏表格管理器容器，防止隐藏后仍然可以点击
                this._hideTableManager();
                break;
            case 'mini':
                $btn.removeClass('dnd-hidden');
                // 稍微延迟添加 visible 类以触发 transition (如果刚从 display:none 切换)
                requestAnimationFrame(() => $mini.addClass('visible'));
                this.renderHUD();
                // [新增] 初始化 Mini HUD 动态背景
                this._initDynamicBackground('mini');
                break;
            case 'full':
                $btn.addClass('dnd-hidden');
                $full.addClass('visible');
                const $active = $('.dnd-nav-item.active');
                if ($active.length) {
                    ((window as any).DND_Dashboard_UI || this).renderPanel?.($active.data('target'));
                } else {
                    ((window as any).DND_Dashboard_UI || this).renderPanel?.('party');
                }
                // [新增] 初始化全屏界面动态背景
                this._initDynamicBackground('full');
                break;
        }
    },

    // [新增] 初始化动态背景
    _hideTableManager() {
        // [b12.15] 表格编辑收口：编辑器 A 已移除，仅清理历史残留容器
        const { $ } = deps.utils.getCore();
        try {
            const $tmContainer = $('#dnd-table-manager-container');
            if ($tmContainer.length && $tmContainer.is(':visible')) {
                $tmContainer.hide();
                const $toggleBar = $('#dnd-hud-toggle-bar');
                if ($toggleBar.length) {
                    $toggleBar.text('▼').attr('title', '打开表格管理（骰子面板）');
                }
                deps.logger.debug('[UICore] 表格残留容器已清理');
            }
        } catch (e) {}
    },

    // [新增] 切换动态背景效果 (保留用于独立切换效果)
  };
}
