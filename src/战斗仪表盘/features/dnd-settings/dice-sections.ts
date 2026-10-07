// features/dnd-settings/dice-sections.ts
// [b14] 骰子设置迁入区块（设置融合系列）。
// 设计：
//   - 骰子设置项以 DND 主面板样式渲染；读写统一走 __acuUI 桥（getConfig / saveConfig）；
//   - 修改按骰子侧语义即时保存，并按需触发刷新链路（renderInterface / refreshDialogueIndentRender）；
//   - 本文件按批次持续承载迁入的骰子区块（批次①：主题与外观-字体与渲染），避免 settings-panel.ts 过度膨胀。
import { normalizeDialogueIndentStrategy } from '../dialogue-indent-renderer';

const FALLBACK_CONFIG: any = {
  fontFamily: 'default',
  fontSize: 13,
  optionFontSize: 12,
  navFontSize: 13,
  highlightNew: true,
  dialogueIndentEnabled: false,
  dialogueIndentStrategy: 'conservative',
};

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
                        ${seg('dnd-dice-highlight-new', [{ value: 'enabled', label: '启用' }, { value: 'disabled', label: '禁用' }], cfg.highlightNew ? 'enabled' : 'disabled', '高亮表格更新')}
                    </div>

                    <div class="dnd-set-row">
                        <span class="dnd-set-row-label">正文头像渲染</span>
                        ${seg('dnd-dice-dialogue-indent', [{ value: 'enabled', label: '启用' }, { value: 'disabled', label: '禁用' }], cfg.dialogueIndentEnabled === true ? 'enabled' : 'disabled', '正文头像渲染')}
                    </div>

                    <div class="dnd-set-row" id="dnd-dice-dialogue-strategy-row" style="display:${cfg.dialogueIndentEnabled === true ? 'flex' : 'none'};">
                        <span class="dnd-set-row-label dnd-dim" style="padding-left:14px;">识别强度</span>
                        ${seg('dnd-dice-dialogue-strategy', [{ value: 'conservative', label: '保守' }, { value: 'balanced', label: '适中' }, { value: 'aggressive', label: '激进' }], normalizeDialogueIndentStrategy(cfg.dialogueIndentStrategy), '识别强度')}
                    </div>
                `;
  };

  // ===== 区块2 绑定：字体与渲染 =====
  const bindAppearance = ($c: any): void => {
    const { $ } = deps.utils.getCore();
    if (!$ || !$c) return;

    const setSegActive = ($seg: any, value: string): void => {
      $seg.find('.dnd-set-seg-btn').each(function (this: any) {
        const $btn = $(this);
        const active = String($btn.data('value')) === String(value);
        $btn.toggleClass('active', active).attr('aria-checked', active ? 'true' : 'false');
      });
    };

    // 字体风格
    try {
      $c.find('#dnd-dice-font-family').on('change', function (this: any) {
        saveConfig({ fontFamily: $(this).val() });
      });
    } catch (e) {}

    // 字体大小：三组步进器（界面 / 选项 / 导航栏）
    try {
      $c.find('.dnd-set-stepper').each(function (this: any) {
        const $stepper = $(this);
        const id = String($stepper.data('id') || '');
        const min = parseInt($stepper.data('min'), 10);
        const max = parseInt($stepper.data('max'), 10);
        const step = parseInt($stepper.data('step'), 10);
        const $value = $stepper.find('.dnd-set-stepper-value');

        const updateValue = (newVal: number) => {
          const clamped = Math.max(min, Math.min(max, newVal));
          if (id === 'font-main') {
            $value.text(clamped + 'px');
            saveConfig({ fontSize: clamped });
          } else if (id === 'font-option') {
            $value.text(clamped + 'px');
            saveConfig({ optionFontSize: clamped });
          } else if (id === 'font-nav') {
            let metrics: any = null;
            try {
              metrics = callBridge('getNavigationFontMetrics', clamped);
            } catch (e) {}
            const finalSize = metrics && Number.isFinite(parseInt(metrics.fontSize, 10)) ? parseInt(metrics.fontSize, 10) : clamped;
            $value.text(finalSize + 'px');
            saveConfig({ navFontSize: finalSize });
          }
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
    } catch (e) {}

    // 高亮表格更新（即时生效：saveConfig + renderInterface）
    try {
      $c.find('#dnd-dice-highlight-new .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($c.find('#dnd-dice-highlight-new'), value);
        saveConfig({ highlightNew: value === 'enabled' });
        callBridge('renderInterface');
      });
    } catch (e) {}

    // 正文头像渲染（开关；联动识别强度显示）
    try {
      $c.find('#dnd-dice-dialogue-indent .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        const enabled = value === 'enabled';
        setSegActive($c.find('#dnd-dice-dialogue-indent'), value);
        saveConfig({ dialogueIndentEnabled: enabled });
        $c.find('#dnd-dice-dialogue-strategy-row').css('display', enabled ? 'flex' : 'none');
        callBridge('refreshDialogueIndentRender');
      });
    } catch (e) {}

    // 识别强度
    try {
      $c.find('#dnd-dice-dialogue-strategy .dnd-set-seg-btn').on('click', function (this: any) {
        const value = String($(this).data('value') || '');
        setSegActive($c.find('#dnd-dice-dialogue-strategy'), value);
        saveConfig({ dialogueIndentStrategy: normalizeDialogueIndentStrategy(value) });
        callBridge('refreshDialogueIndentRender');
      });
    } catch (e) {}
  };

  return {
    buildAppearanceHtml,
    bindAppearance,
  };
}
