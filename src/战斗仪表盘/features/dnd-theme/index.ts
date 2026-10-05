// features/dnd-theme/index.ts
// dnd-theme 域装配（b3）：ThemeManager + StyleManager（最小默认） + 缺省降级实现。
// 约定：工厂 + DI；外部（app/init.ts）只从这里取实例。
import { createDndThemeManager } from './theme-manager';
import { createDndStyleManager } from './style-manager';

export interface DndThemeDeps { core: any; }
export interface DndTheme {
  themeManager: any;
  styleManager: any;
  init(): Promise<void>;
}

/** b3 缺省降级实现（b11 接入完整 StylePresets / StyleValidator / StyleEffects 后替换） */
const defaultStylePresets = {
  getStyleList: () => [
    {
      id: 'classic-dnd',
      name: '经典 DND（最小默认）',
      icon: '<i class="fa-solid fa-dice-d20"></i>',
      description: '最小默认风格；完整风格包将在 b11 接入',
    },
  ],
  isBuiltinStyle: (id: string) => id === 'classic-dnd',
  getStylePreset: (id: string) =>
    id === 'classic-dnd'
      ? {
          meta: { id: 'classic-dnd', name: '经典 DND' },
          colors: {},
          dimensions: {},
          typography: {},
          animations: {},
          morphology: {},
          interactiveStates: {},
        }
      : null,
};

const defaultStyleValidator = {
  validate: (pack: any) => ({ valid: true, sanitized: pack, warnings: [], errors: [] }),
};

const defaultStyleEffects = {
  apply: (_pack: any) => {
    /* b11 接入 StyleEffects 后生效 */
  },
};

export function createDndTheme(deps: DndThemeDeps): DndTheme {
  const { core } = deps;

  const themeManager = createDndThemeManager({
    logger: core.logger,
    dbAdapter: core.dbAdapter,
    utils: core.utils,
  });

  const styleManager = createDndStyleManager({
    logger: core.logger,
    dbAdapter: core.dbAdapter,
    utils: core.utils,
    themeManager,
    stylePresets: defaultStylePresets,
    styleValidator: defaultStyleValidator,
    styleEffects: defaultStyleEffects,
  });

  const init = async (): Promise<void> => {
    // 1) 主题：加载自定义配色 + 应用保存的主题
    try {
      await themeManager.init();
      const ids = themeManager.getList().map((t: any) => t.id).join('/');
      core.logger.info('[dnd-theme] 主题就绪：', themeManager.currentTheme, '｜主题列表：', ids);
    } catch (e) {
      core.logger.warn('[dnd-theme] 主题初始化失败（忽略）：', e);
    }
    // 2) 样式：最小默认（classic-dnd）应用机制
    try {
      await styleManager.init();
      core.logger.info('[dnd-theme] 样式就绪（最小默认）：', styleManager.currentStyleId);
    } catch (e) {
      core.logger.warn('[dnd-theme] 样式初始化失败（忽略）：', e);
    }
    // 3) b3 验收钩子：读到当前风格设置（样式 part-08 已随包注入，无需重复注入）
    try {
      core.logger.info('[dnd-theme] 读设置验收：dnd_current_style =', await core.dbAdapter.getSetting('dnd_current_style'));
    } catch (e) {
      core.logger.warn('[dnd-theme] b3 验收读取失败（忽略）：', e);
    }
    core.logger.info('[dnd-theme] 就绪 ✅（ThemeManager + StyleManager 最小默认；part-08 样式随包）');
  };

  return { themeManager, styleManager, init };
}

export { createDndThemeManager } from './theme-manager';
export { createDndStyleManager } from './style-manager';