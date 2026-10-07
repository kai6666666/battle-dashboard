// features/dnd-settings/dice-sections.ts
// [b14] 骰子设置迁入区块（设置融合系列）。
// 设计：
//   - 骰子设置项以 DND 主面板样式渲染；读写统一走 __acuUI 桥（getConfig / saveConfig）；
//   - 修改按骰子侧语义即时保存，并按需触发刷新链路（renderInterface / refreshDialogueIndentRender）；
//   - 本文件按批次持续承载迁入的骰子区块：
//     批次①：主题与外观-字体与渲染；批次②：布局与浏览 / 表格管理 / 面板与交互。
import { normalizeDialogueIndentStrategy } from '../dialogue-indent-renderer';

const FALLBACK_CONFIG: any = {
  fontFamily: 'default',
  fontSize: 13,
  optionFontSize: 12,
  navFontSize: 13,
  highlightNew: true,
  dialogueIndentEnabled: false,
  dialogueIndentStrategy: 'conservative',
  layout: 'horizontal',
  showHorizontalScrollbar: true,
  desktopNavAligned: false,
  cardWidth: 260,
  itemsPerPage: 50,
  gridColumns: 'auto',
  positionMode: 'fixed',
  actionsPosition: 'bottom',
  collapseStyle: 'bar',
  collapseAlign: 'right',
  showOptionPanel: true,
  clickOptionToAutoSend: true,
};

const ENABLED_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'enabled', label: '启用' },
  { value: 'disabled', label: '禁用' },
];

const esc = (s: any): string =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&' + 'quot;');

const clampNum = (v: any, min: number, max: number, dft: number): number => {
  const n = parseInt(v, 10);
  if (!Number.isFinite(n)) return dft;
  return Math.max(min, Math.min(max, n));
};

export function createDiceSections(deps: any) {
  const getBridge = (): any => {
    try {
      return (window as any).__acuUI || {};
    } catch (e) {
      return {};
    }
  };

  const readConfig = (): any => {
    try {
      const b = getBridge();
      if (b && typeof b.getConfig === 'function') return b.getConfig() || {};
    } catch (e) {}
    return {};
  };

  const readFonts = (): any[] => {
    try {
      const b = getBridge();
      if (b && typeof b.getFontsList === 'function') {
        const list = b.getFontsList();
        if (Array.isArray(list) && list.length) return list;
      }
    } catch (e) {}
    return [{ id: 'default', name: '系统默认 (Modern)' }];
  };

  const saveConfig = (patch: any): void => {
    try {
      const b = getBridge();
      if (b && typeof b.saveConfig === 'function') b.saveConfig(patch);
    } catch (e) {
      try {
        deps.logger?.warn?.('[b14] 骰子配置保存失败', e);
      } catch (e2) {}
    }
  };

  const callBridge = (name: string, ...args: any[]): any => {
    try {
      const b = getBridge();
      if (b && typeof b[name] === 'function') return b[name](...args);
    } catch (e) {
      try {
        deps.logger?.warn?.('[b14] 桥调用失败: ' + name, e);
      } catch (e2) {}
    }
    return null;
  };

  // ===== 通用控件（segmented / stepper） =====
  const seg = (id: string, options: Array<{ value: string; label: string }>, active: string, label: string): string => `
                    <div class="dnd-set-seg" id="${id}" role="radiogroup" aria-label="${esc(label)}">
                        ${options
                          .map(
                            o =>
                              `<button type="button" class="dnd-set-seg-btn ${o.value === active ? 'active' : ''}" data-value="${esc(o.value)}" role="radio" aria-checked="${o.value === active ? 'true' : 'false'}">${esc(o.label)}</button>`,
                          )
                          .join('')}
                    </div>`;

  const stepper = (id: string, dataId: string, min: number, max: number, step: number, value: number, unit: string): string => `
                    <div class="dnd-set-stepper" id="${id}" data-id="${dataId}" data-min="${min}" data-max="${max}" data-step="${step}">
                        <button type="button" class="dnd-set-stepper-btn dnd-set-stepper-dec" aria-label="减小">&minus;</button>
                        <span class="dnd-set-stepper-value">${value}${unit}</span>
                        <button type="button" class="dnd-set-stepper-btn dnd-set-stepper-inc" aria-label="增大">+</button>
                    </div>`;

  const setSegActive = ($: any, $seg: any, value: string): void => {
    $seg.find('.dnd-set-seg-btn').each(function (this: any) {
      const $btn = $(this);
      const active = String($btn.data('value')) === String(value);
      $btn.toggleClass('active', active).attr('aria-checked', active ? 'true' : 'false');
    });
  };

  // 通用步进器绑定（按 data-id 分派）
  const bindStepperGroup = ($c: any, selector: string, handlers: Record<string, (v: number) => void>): void => {
    const { $ } = deps.utils.getCore();
    if (!$ || !$c) return;
    $c.find(selector).each(function (this: any) {
      const $stepper = $(this);
      const id = String($stepper.data('id') || '');
      const min = parseInt($stepper.data('min'), 10);
      const max = parseInt($stepper.data('max'), 10);
      const step = parseInt($stepper.data('step'), 10);
      const $value = $stepper.find('.dnd-set-stepper-value');
      const updateValue = (newVal: number) => {
        const clamped = Math.max(min, Math.min(max, newVal));
        const handler = handlers[id];
        if (handler) handler(clamped);
        else $value.text(String(clamped));
      };
      const getCurrentValue = () => {
        const text = String($value.text() || '').replace(/[^\d]/g, '');
        return parseInt(text, 10) || min;
      };
      $stepper.find('.dnd-set-stepper-dec').on('click', function () {
        updateValue(getCurrentValue() - step);
      });
      $stepper.find('.dnd-set-stepper-inc').on('click', function () {
        updateValue(getCurrentValue() + step);
      });
    });
  };

  // ===== 区块2：主题与外观 - 字体与渲染（批次①迁入） =====
  const buildAppearanceHtml = (): string => {
    const cfg = { ...FALLBACK_CONFIG, ...readConfig() };
    const fonts = readFonts();

    const mainSize = clampNum(cfg.fontSize, 10, 24, 13);
    const optSize = clampNum(cfg.optionFontSize, 10, 24, 12);
    let navSize = 13;
    try {
      const m = callBridge('getNavigationFontMetrics', cfg.navFontSize);
      if (m && Number.isFinite(parseInt(m.fontSize, 10))) navSize = clampNum(m.fontSize, 10, 20, 13);
      else navSize = clampNum(cfg.navFontSize, 10, 20, 13);
    } catch (e) {
      navSize = clampNum(cfg.navFontSize, 10, 20, 13);
    }

    return `
                    <div class="dnd-set-sub-title"><i class="fa-solid fa-font"></i> 字体与渲染</div>
                    <p style="color:var(--dnd-text-dim);font-size:12px;margin:0 0 12px;">
                        以下为骰子相关界面的字体与渲染设置（修改即时生效）。
                    </p>

                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">字体风格</span>
                        <select id="dnd-dice-font-family" style="width:170px;background:var(--dnd-bg-input);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);padding:6px 8px;border-radius:4px;font-size:12px;">
                            ${fonts.map(f => `<option value="${esc(f.id)}" ${f.id === cfg.fontFamily ? 'selected' : ''}>${esc(f.name)}</option>`).join('')}
                        </select>
                    </div>

                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">字体大小（界面）</span>
                        ${stepper('dnd-dice-font-main', 'font-main', 10, 24, 1, mainSize, 'px')}
                    </div>

                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">字体大小（选项）</span>
                        ${stepper('dnd-dice-font-option', 'font-option', 10, 24, 1, optSize, 'px')}
                    </div>

                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">字体大小（导航栏）</span>
                        ${stepper('dnd-dice-font-nav', 'font-nav', 10, 20, 1, navSize, 'px')}
                    </div>

                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">高亮表格更新</span>
                        ${seg('dnd-dice-highlight-new', ENABLED_OPTIONS, cfg.highlightNew ? 'enabled' : 'disabled', '高亮表格更新')}
                    </div>

                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">正文头像渲染</span>
                        ${seg('dnd-dice-dialogue-indent', ENABLED_OPTIONS, cfg.dialogueIndentEnabled === true ? 'enabled' : 'disabled', '正文头像渲染')}
                    </div>

                    <div class="dnd-set-row" id="dnd-dice-dialogue-strategy-row" style="display:${cfg.dialogueIndentEnabled === true ? 'flex' : 'none'};">
                        <span class="dnd-set-row-label dnd-dim" style="padding-left:14px;">识别强度</span>
                        ${seg('dnd-dice-dialogue-strategy', [{ value: 'conservative', label: '保守' }, { value: 'balanced', label: '适中' }, { value: 'aggressive', label: '激进' }], normalizeDialogueIndentStrategy(cfg.dialogueIndentStrategy), '识别强度')}
                    </div>
                `;
  };

  // ===== 区块4：布局与浏览（批次②迁入） =====
  const buildLayoutHtml = (): string => {
    const cfg = { ...FALLBACK_CONFIG, ...readConfig() };
    const isVertical = cfg.layout === 'vertical';
    let orderReversed = false;
    try {
      orderReversed = callBridge('areAllTablesReversed') === true;
    } catch (e) {}
    const cardWidth = clampNum(cfg.cardWidth, 200, 500, 260);
    const perPage = clampNum(cfg.itemsPerPage, 10, 200, 50);

    return `
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">布局模式</span>
                        ${seg('dnd-dice-layout', [{ value: 'horizontal', label: '横向滚动' }, { value: 'vertical', label: '竖向滚动' }], isVertical ? 'vertical' : 'horizontal', '布局模式')}
                    </div>
                    <div class="dnd-set-row" id="dnd-dice-hscroll-row" style="display:${isVertical ? 'none' : 'flex'};">
                        <span class="dnd-set-row-label dnd-dim" style="padding-left:14px;">横向滚动条</span>
                        ${seg('dnd-dice-hscroll', ENABLED_OPTIONS, cfg.showHorizontalScrollbar === true ? 'enabled' : 'disabled', '横向滚动条')}
                    </div>
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">卡片顺序</span>
                        ${seg('dnd-dice-order', [{ value: 'normal', label: '正序' }, { value: 'reverse', label: '倒序' }], orderReversed ? 'reverse' : 'normal', '卡片顺序')}
                    </div>
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">PC导航布局</span>
                        ${seg('dnd-dice-nav-layout', [{ value: 'compact', label: '紧凑' }, { value: 'aligned', label: '对齐' }], cfg.desktopNavAligned === true ? 'aligned' : 'compact', 'PC导航布局')}
                    </div>
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">卡片宽度</span>
                        ${stepper('dnd-dice-card-width', 'card-width', 200, 500, 10, cardWidth, 'px')}
                    </div>
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">每页卡片数</span>
                        ${stepper('dnd-dice-per-page', 'per-page', 10, 200, 10, perPage, '')}
                    </div>
                `;
  };

  // ===== 区块5：表格管理（批次②迁入：导航盘管理 + 表格列数 + 检验表格模板） =====
  const buildTableHtml = (): string => {
    const cfg = { ...FALLBACK_CONFIG, ...readConfig() };
    const gridCols = String(cfg.gridColumns || 'auto');

    return `
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">导航盘管理</span>
                        <button type="button" id="dnd-dice-nav-manager-open" class="dnd-set-action-btn"><i class="fa-solid fa-cog"></i> 管理</button>
                    </div>
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">表格列数</span>
                        ${seg('dnd-dice-grid-cols', [{ value: '2', label: '2列' }, { value: '3', label: '3列' }, { value: '4', label: '4列' }, { value: 'auto', label: '自动' }], gridCols, '表格列数')}
                    </div>
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">检验表格模板</span>
                        <button type="button" id="dnd-dice-template-inspection" class="dnd-set-action-btn"><i class="fa-solid fa-magnifying-glass-chart"></i> 检验</button>
                    </div>
                    <p style="color:var(--dnd-text-dim);font-size:12px;margin:0;">
                        导航盘管理：显隐 / 排序 / 特殊入口；表格列数作用于骰子导航区。
                    </p>
                `;
  };

  // ===== 区块6：面板与交互（批次②迁入） =====
  const buildInteractionHtml = (): string => {
    const cfg = { ...FALLBACK_CONFIG, ...readConfig() };
    let collapseStyle = 'bar';
    try {
      const n = callBridge('normalizeCollapseStyle', cfg.collapseStyle);
      if (typeof n === 'string' && n) collapseStyle = n;
      else if (typeof cfg.collapseStyle === 'string' && cfg.collapseStyle) collapseStyle = cfg.collapseStyle;
    } catch (e) {}
    const posRaw = String(cfg.positionMode || 'fixed');
    const pos = ['fixed', 'embedded', 'viewport'].includes(posRaw) ? posRaw : 'fixed';

    return `
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">导航盘位置</span>
                        ${seg('dnd-dice-position', [{ value: 'fixed', label: '悬浮底部' }, { value: 'embedded', label: '跟随消息' }, { value: 'viewport', label: '固定底部' }], pos, '导航盘位置')}
                    </div>
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">功能按钮位置</span>
                        ${seg('dnd-dice-action-pos', [{ value: 'bottom', label: '底部' }, { value: 'top', label: '顶部' }], cfg.actionsPosition === 'top' ? 'top' : 'bottom', '功能按钮位置')}
                    </div>
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">收起样式</span>
                        ${seg('dnd-dice-collapse', [{ value: 'bar', label: '长条' }, { value: 'pill', label: '胶囊' }, { value: 'floating', label: '浮球' }], collapseStyle, '收起样式')}
                    </div>
                    <div class="dnd-set-row" id="dnd-dice-collapse-align-row" style="display:${collapseStyle === 'pill' ? 'flex' : 'none'};">
                        <span class="dnd-set-row-label dnd-dim" style="padding-left:14px;">收起位置</span>
                        ${seg('dnd-dice-collapse-align', [{ value: 'right', label: '靠右' }, { value: 'left', label: '靠左' }, { value: 'center', label: '居中' }], String(cfg.collapseAlign || 'right'), '收起位置')}
                    </div>
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">选项面板</span>
                        ${seg('dnd-dice-option-panel', ENABLED_OPTIONS, cfg.showOptionPanel !== false ? 'enabled' : 'disabled', '选项面板')}
                    </div>
                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">点击选项后</span>
                        ${seg('dnd-dice-option-click', [{ value: 'send', label: '直接发送' }, { value: 'input', label: '填入输入框' }], cfg.clickOptionToAutoSend !== false ? 'send' : 'input', '点击选项后')}
                    </div>
                    <p style="color:var(--dnd-text-dim);font-size:12px;margin:0;">
                        以上设置作用于骰子面板与选项区（修改即时生效）。
                    </p>
                `;
  };

  // ===== 绑定：区块2 字体与渲染 =====
  const bindAppearance = ($c: any): void => {
    const { $ } = deps.utils.getCore();
    if (!$ || !$c) return;

    // 字体风格
    try {
      $c.find('#dnd-dice-font-family').on('change', function (this: any) {
        saveConfig({ fontFamily: $(this).val() });
      });
    } catch (e) {}

    // 字体大小：三组步进器（界面 / 选项 / 导航栏）
    try {
      bindStepperGroup($c, '#dnd-dice-font-main, #dnd-dice-font-option, #dnd-dice-font-nav', {
        'font-main': (v: number) => {
          $c.find('#dnd-dice-font-main .dnd-set-stepper-value').text(v + 'px');
          saveConfig({ fontSize: v });
        },
        'font-option': (v: number) => {
          $c.find('#dnd-dice-font-option .dnd-set-stepper-value').text(v + 'px');
          saveConfig({ optionFontSize: v });
        },
        'font-nav': (v: number) => {
          let metrics: any = null;
          try {
            metrics = callBridge('getNavigationFontMetrics', v);
          } catch (e) {}
          const finalSize = metrics && Number.isFinite(parseInt(metrics.fontSize, 10)) ? parseInt(metrics.fontSize, 10) : v;
          $c.find('#dnd-dice-font-nav .dnd-set-stepper-value').text(finalSize + 'px');
          saveConfig({ navFontSize: finalSize });
        },
      });
    } catch (e) {}

    // 高亮表格更新（即时生效：saveConfig + renderInterface）
    try {
      $c.find('#dnd-dice-highlight-new .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-highlight-new'), value);
        saveConfig({ highlightNew: value === 'enabled' });
        callBridge('renderInterface');
      });
    } catch (e) {}

    // 正文头像渲染（开关；联动识别强度显示）
    try {
      $c.find('#dnd-dice-dialogue-indent .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        const enabled = value === 'enabled';
        setSegActive($, $c.find('#dnd-dice-dialogue-indent'), value);
        saveConfig({ dialogueIndentEnabled: enabled });
        $c.find('#dnd-dice-dialogue-strategy-row').css('display', enabled ? 'flex' : 'none');
        callBridge('refreshDialogueIndentRender');
      });
    } catch (e) {}

    // 识别强度
    try {
      $c.find('#dnd-dice-dialogue-strategy .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-dialogue-strategy'), value);
        saveConfig({ dialogueIndentStrategy: normalizeDialogueIndentStrategy(value) });
        callBridge('refreshDialogueIndentRender');
      });
    } catch (e) {}
  };

  // ===== 绑定：区块4 布局与浏览 =====
  const bindLayout = ($c: any): void => {
    const { $ } = deps.utils.getCore();
    if (!$ || !$c) return;

    // 布局模式（竖向时隐藏横向滚动条行）
    try {
      $c.find('#dnd-dice-layout .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-layout'), value);
        saveConfig({ layout: value });
        $c.find('#dnd-dice-hscroll-row').css('display', value === 'vertical' ? 'none' : 'flex');
        callBridge('renderInterface');
      });
    } catch (e) {}

    // 横向滚动条
    try {
      $c.find('#dnd-dice-hscroll .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-hscroll'), value);
        saveConfig({ showHorizontalScrollbar: value === 'enabled' });
        callBridge('renderInterface');
      });
    } catch (e) {}

    // 卡片顺序（联动全表倒序设置）
    try {
      $c.find('#dnd-dice-order .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-order'), value);
        callBridge('setAllTablesReverse', value === 'reverse');
        callBridge('renderInterface');
      });
    } catch (e) {}

    // PC导航布局
    try {
      $c.find('#dnd-dice-nav-layout .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-nav-layout'), value);
        saveConfig({ desktopNavAligned: value === 'aligned' });
        callBridge('renderInterface');
      });
    } catch (e) {}

    // 卡片宽度 / 每页卡片数
    try {
      bindStepperGroup($c, '#dnd-dice-card-width, #dnd-dice-per-page', {
        'card-width': (v: number) => {
          $c.find('#dnd-dice-card-width .dnd-set-stepper-value').text(v + 'px');
          saveConfig({ cardWidth: v });
        },
        'per-page': (v: number) => {
          $c.find('#dnd-dice-per-page .dnd-set-stepper-value').text(String(v));
          saveConfig({ itemsPerPage: v });
        },
      });
    } catch (e) {}
  };

  // ===== 导航盘管理弹窗（DND 化包装；数据/逻辑经桥复用骰子侧，不改功能语义） =====
  const openNavManager = ($c: any): void => {
    const { $ } = deps.utils.getCore();
    if (!$) return;
    const doc: any = (() => {
      try {
        return $c && $c[0] ? $c[0].ownerDocument || document : document;
      } catch (e) {
        return document;
      }
    })();
    const bridge = getBridge();
    let items: any[] = [];
    try {
      const r = typeof bridge.getNavigationManagerItems === 'function' ? bridge.getNavigationManagerItems() : null;
      if (Array.isArray(r)) items = r;
    } catch (e) {}

    const rowsHtml = items
      .map(
        it => `
                    <div class="dnd-navmgr-item ${it.hidden ? 'is-hidden' : ''} ${it.isSpecial ? 'is-special' : ''}" data-key="${esc(it.key)}">
                        <span class="dnd-navmgr-eye" title="点击切换显示/隐藏"><i class="fa-solid ${it.hidden ? 'fa-eye-slash' : 'fa-eye'}"></i></span>
                        <span class="dnd-navmgr-icon"><i class="fa-solid ${esc(it.icon || 'fa-table')}"></i></span>
                        <span class="dnd-navmgr-name">${esc(it.name)}</span>
                        <span class="dnd-navmgr-handle" title="拖拽排序"><i class="fa-solid fa-grip-vertical"></i></span>
                    </div>`,
      )
      .join('');

    const $overlay = $(`
                <div class="dnd-navmgr-overlay" role="dialog" aria-modal="true" aria-labelledby="dnd-navmgr-title">
                    <div class="dnd-navmgr-backdrop" data-dnd-navmgr-close="true"></div>
                    <div class="dnd-navmgr-dialog">
                        <div class="dnd-navmgr-header">
                            <span class="dnd-navmgr-title" id="dnd-navmgr-title"><i class="fa-solid fa-table"></i> 导航盘管理</span>
                            <button type="button" class="dnd-navmgr-close" title="关闭" aria-label="关闭导航盘管理"><i class="fa-solid fa-times"></i></button>
                        </div>
                        <div class="dnd-navmgr-body">
                            <div class="dnd-navmgr-hint"><i class="fa-solid fa-info-circle"></i> 点击眼睛切换显示，拖拽右侧把手调整顺序</div>
                            <div class="dnd-navmgr-list">${rowsHtml || '<div class="dnd-navmgr-empty">暂无可管理项</div>'}</div>
                        </div>
                    </div>
                </div>`);

    try {
      if (doc && doc.body) doc.body.appendChild($overlay[0]);
      else $('body').append($overlay);
    } catch (e) {
      $('body').append($overlay);
    }

    const close = () => {
      try {
        $overlay.remove();
      } catch (e) {}
      try {
        $(doc).off('keydown.dndNavmgr');
      } catch (e) {}
    };
    $overlay.find('.dnd-navmgr-close, .dnd-navmgr-backdrop').on('click', close);
    try {
      $(doc).on('keydown.dndNavmgr', function (ev: any) {
        if (ev && ev.key === 'Escape') close();
      });
    } catch (e) {}

    // 显隐切换
    $overlay.find('.dnd-navmgr-eye').on('click', function (this: any, e: any) {
      e.preventDefault();
      e.stopPropagation();
      const $item = $(this).closest('.dnd-navmgr-item');
      const key = String($item.data('key') || '');
      if (!key) return;
      const it = items.find(x => String(x.key) === key);
      if (!it) return;
      it.hidden = !it.hidden;
      $item.toggleClass('is-hidden', it.hidden);
      $(this).find('i').toggleClass('fa-eye', !it.hidden).toggleClass('fa-eye-slash', it.hidden);
      try {
        if (typeof bridge.saveHiddenTables === 'function') bridge.saveHiddenTables(items.filter(x => x.hidden).map(x => String(x.key)));
      } catch (e2) {}
      callBridge('renderInterface');
    });

    // 拖拽排序（复用骰子侧 sortable 实现）
    try {
      const listEl: any = $overlay.find('.dnd-navmgr-list')[0];
      if (listEl && typeof bridge.createSortableList === 'function') {
        bridge.createSortableList({
          container: listEl,
          itemSelector: '.dnd-navmgr-item',
          handleSelector: '.dnd-navmgr-handle',
          cancelSelector: '.dnd-navmgr-eye',
          getItemId: (item: any) => (item && item.getAttribute ? item.getAttribute('data-key') : null),
          onOrderChange: (newOrder: any) => {
            try {
              if (typeof bridge.saveTableOrder === 'function') bridge.saveTableOrder(newOrder);
            } catch (e3) {}
          },
        });
      }
    } catch (e) {}
  };

  // ===== 绑定：区块5 表格管理 =====
  const bindTable = ($c: any): void => {
    const { $ } = deps.utils.getCore();
    if (!$ || !$c) return;

    // 表格列数（作用于骰子导航区；保存后补触发渲染链路）
    try {
      $c.find('#dnd-dice-grid-cols .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-grid-cols'), value);
        saveConfig({ gridColumns: value });
        callBridge('renderInterface');
      });
    } catch (e) {}

    // 检验表格模板
    try {
      $c.find('#dnd-dice-template-inspection').on('click', function (this: any, e: any) {
        e.preventDefault();
        callBridge('showTemplateInspectionModal');
      });
    } catch (e) {}

    // 导航盘管理
    try {
      $c.find('#dnd-dice-nav-manager-open').on('click', function (this: any, e: any) {
        e.preventDefault();
        openNavManager($c);
      });
    } catch (e) {}
  };

  // ===== 绑定：区块6 面板与交互 =====
  const bindInteraction = ($c: any): void => {
    const { $ } = deps.utils.getCore();
    if (!$ || !$c) return;

    // 导航盘位置
    try {
      $c.find('#dnd-dice-position .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-position'), value);
        saveConfig({ positionMode: value });
        callBridge('renderInterface');
      });
    } catch (e) {}

    // 功能按钮位置
    try {
      $c.find('#dnd-dice-action-pos .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-action-pos'), value);
        saveConfig({ actionsPosition: value });
        callBridge('renderInterface');
      });
    } catch (e) {}

    // 收起样式（pill 时显示收起位置）
    try {
      $c.find('#dnd-dice-collapse .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-collapse'), value);
        let cs = value;
        try {
          const n = callBridge('normalizeCollapseStyle', value);
          if (typeof n === 'string' && n) cs = n;
        } catch (e) {}
        saveConfig({ collapseStyle: cs });
        $c.find('#dnd-dice-collapse-align-row').css('display', cs === 'pill' ? 'flex' : 'none');
        callBridge('renderInterface');
      });
    } catch (e) {}

    // 收起位置
    try {
      $c.find('#dnd-dice-collapse-align .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-collapse-align'), value);
        saveConfig({ collapseAlign: value });
        callBridge('renderInterface');
      });
    } catch (e) {}

    // 选项面板
    try {
      $c.find('#dnd-dice-option-panel .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-option-panel'), value);
        saveConfig({ showOptionPanel: value === 'enabled' });
        callBridge('renderInterface');
      });
    } catch (e) {}

    // 点击选项后
    try {
      $c.find('#dnd-dice-option-click .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($, $c.find('#dnd-dice-option-click'), value);
        saveConfig({ clickOptionToAutoSend: value === 'send' });
      });
    } catch (e) {}
  };

  // ===== 总绑定（设置面板每次渲染后调用） =====
  const bindAll = ($c: any): void => {
    bindAppearance($c);
    bindLayout($c);
    bindTable($c);
    bindInteraction($c);
  };

  return {
    buildAppearanceHtml,
    buildLayoutHtml,
    buildTableHtml,
    buildInteractionHtml,
    bindAppearance,
    bindAll,
  };
}