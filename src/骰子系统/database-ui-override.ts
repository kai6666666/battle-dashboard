/**
 * 神-数据库UI主题同步
 *
 * 此文件从 index.ts 拆分出来，专门用于同步数据库界面的主题颜色与样式。
 *
 * ## 为什么拆分？
 * - index.ts 过于庞大，拆分后降低维护成本
 * - 样式同步逻辑相对独立，适合单独管理
 *
 * ## 如何使用？
 * - 在 index.ts 中通过 `import { injectDatabaseStyles } from './database-ui-override'` 导入
 * - 在主题切换或初始化时调用该函数
 *
 * ## 如何修改样式？
 * - 直接在本文件中编辑 DATABASE_THEME_MAP 或 injectDatabaseStyles 逻辑
 * - 运行 `pnpm build` 验证构建成功
 *
 * @see index.ts - injectDatabaseStyles() 函数（约第 9491 行）
 */

import type { DatabaseStyleOptions } from './features/database-ui/types';
import { DATABASE_THEME_MAP, DATABASE_THEME_STYLE_ID } from './features/database-ui/themes';
import { buildPart01Core } from './features/database-ui/css/part-01-core';
import { buildPart02Layout } from './features/database-ui/css/part-02-layout';
import { buildPart03Tables } from './features/database-ui/css/part-03-tables';
import { buildPart04Panels } from './features/database-ui/css/part-04-panels';
import { buildPart05Visualizer } from './features/database-ui/css/part-05-visualizer';
const collectDatabaseDocuments = (): Document[] => {
  const docs: Document[] = [];
  const tryAddDoc = (w: Window | null | undefined) => {
    try {
      const doc = w?.document;
      if (doc && !docs.includes(doc)) docs.push(doc);
    } catch {
      return;
    }
  };

  tryAddDoc(window);
  tryAddDoc(window.parent);
  tryAddDoc(window.top);
  return docs;
};

export function clearDatabaseStyles() {
  try {
    for (const doc of collectDatabaseDocuments()) {
      doc.getElementById(DATABASE_THEME_STYLE_ID)?.remove();
    }
  } catch {
    return;
  }
}

export function injectDatabaseStyles(themeId: string, fontFamily?: string, options: DatabaseStyleOptions = {}) {
  try {
    if (options.enabled === false) {
      clearDatabaseStyles();
      return;
    }

    const getJQuery = (w: Window | null | undefined) => {
      try {
        return (w as any)?.jQuery as any;
      } catch {
        return null;
      }
    };

    // 同时尝试当前窗口/父窗口/顶层窗口，避免样式注入到错误 document
    const targets = [getJQuery(window), getJQuery(window.parent), getJQuery(window.top)].filter(
      (v, idx, arr) => !!v && arr.indexOf(v) === idx,
    );
    if (!targets.length) return;

    const t = DATABASE_THEME_MAP[themeId];
    if (!t) {
      // 'native' 或未知主题：不接管数据库 UI，保持原生外观
      clearDatabaseStyles();
      return;
    }
    const darkThemeIds = new Set(['cyber', 'terminal', 'aurora', 'chouten', 'classicpackaging']);
    const isDarkTheme = darkThemeIds.has(themeId);
    const stepperSpinFilter = isDarkTheme ? 'invert(1) brightness(1.05)' : 'none';
    const stepperSpinOpacity = isDarkTheme ? '0.85' : '0.55';
    const stepperColorScheme = isDarkTheme ? 'dark' : 'light';

    // ========== 选择器常量 (代码结构优化) ==========
    // 使用 :is() 合并重复选择器，减少代码冗余
    // 弹窗容器选择器
    const S_POPUP = `#shujuku_v104-popup.auto-card-updater-popup, [id^="shujuku"][id$="-popup"].auto-card-updater-popup`;
    // 主窗口选择器
    const S_MAIN = `#shujuku_v104-main-window, [id^="shujuku"][id$="-main-window"]`;
    // 可视化窗口选择器
    const S_VIS = `#shujuku_v104-visualizer-window, [id^="shujuku"][id$="-visualizer-window"]`;
    // 所有窗口选择器
    const S_ALL_WINDOWS = `${S_POPUP}, ${S_MAIN}, ${S_VIS}`;
    // 弹窗+主窗口选择器
    const S_POPUP_MAIN = `${S_POPUP}, ${S_MAIN}`;

    const fontCss = fontFamily
      ? `
        /* 字体同步：覆盖数据库文本字体（避免影响图标字体 / pseudo-element 图标） */
        html body .auto-card-updater-popup,
        html body #shujuku_v104-main-window,
        html body [id^="shujuku"][id$="-main-window"],
        html body #shujuku_v104-popup.auto-card-updater-popup,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup {
          --acu-font-family: ${fontFamily};
          font-family: var(--acu-font-family) !important;
        }

        html body .auto-card-updater-popup :is(div, p, span, label, a, button:not(.acu-window-btn), input, select, textarea, th, td, li, ul, ol, h1, h2, h3, h4, h5, h6, small, strong, em),
        html body #shujuku_v104-main-window :is(div, p, span, label, a, button:not(.acu-window-btn), input, select, textarea, th, td, li, ul, ol, h1, h2, h3, h4, h5, h6, small, strong, em),
        html body [id^="shujuku"][id$="-main-window"] :is(div, p, span, label, a, button:not(.acu-window-btn), input, select, textarea, th, td, li, ul, ol, h1, h2, h3, h4, h5, h6, small, strong, em),
        html body #shujuku_v104-popup.auto-card-updater-popup :is(div, p, span, label, a, button:not(.acu-window-btn), input, select, textarea, th, td, li, ul, ol, h1, h2, h3, h4, h5, h6, small, strong, em),
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup :is(div, p, span, label, a, button:not(.acu-window-btn), input, select, textarea, th, td, li, ul, ol, h1, h2, h3, h4, h5, h6, small, strong, em) {
          font-family: var(--acu-font-family) !important;
        }
      `
      : '';

    const cssParams = { S_POPUP, S_MAIN, S_VIS, S_ALL_WINDOWS, S_POPUP_MAIN, t, stepperSpinFilter, stepperSpinOpacity, stepperColorScheme };
    const css =
      `
      <style id="${DATABASE_THEME_STYLE_ID}">
        ${fontCss}
` +
      buildPart01Core(cssParams) +
      buildPart02Layout(cssParams) +
      buildPart03Tables(cssParams) +
      buildPart04Panels(cssParams) +
      buildPart05Visualizer(cssParams) +
      `      </style>
    `;

    for (const $ of targets) {
      $(`#${DATABASE_THEME_STYLE_ID}`).remove();
      $('head').append(css);
    }
  } catch (e) {
    // 完全静默
  }
}

const DB_TOAST_MUTE_STYLE_ID = 'dice-db-toast-mute';

const collectDatabaseToastDocuments = (): Document[] => {
  return collectDatabaseDocuments();
};

export function setDatabaseToastMute(enabled: boolean) {
  try {
    const css = `
#toast-container .acu-toast,
.toast.acu-toast,
.acu-toast.toast {
  display: none !important;
}
`;
    const docs = collectDatabaseToastDocuments();
    for (const doc of docs) {
      const existing = doc.getElementById(DB_TOAST_MUTE_STYLE_ID);
      if (enabled) {
        if (!existing) {
          const style = doc.createElement('style');
          style.id = DB_TOAST_MUTE_STYLE_ID;
          style.textContent = css;
          (doc.head || doc.documentElement).appendChild(style);
        }
        doc.querySelectorAll('.acu-toast').forEach(node => node.remove());
      } else if (existing) {
        existing.remove();
      }
    }
  } catch {
    return;
  }
}
