// @ts-nocheck
/**
 * show-dice-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { buildEffectMetaLines, buildEffectTraceLines, computePendingEffectVariables, parseEffectValueInput } from '../../shared/effect-math';
import { rollComplexDiceExpression } from '../../features/dice/dice-engine';
import { createDicePanelHistory } from './panel/dice-panel-history';
import { createDicePanelExpr } from './panel/dice-panel-expr';
import { createDicePanelAttrButtons } from './panel/dice-panel-attr-buttons';
import { createDicePanelEffectRuns } from './panel/dice-panel-effect-runs';
import { createDicePanelQuickActions } from './panel/dice-panel-quick-actions';
import { createDicePanelResourceBurner } from './panel/dice-panel-resource-burner';
import { createDicePanelEffectConfirm } from './panel/dice-panel-effect-confirm';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowDicePanel(deps: any) {
  const showDicePanel = (options = {}) => {
    const { $ } = deps.getCore();
    const dicePanelHistory = createDicePanelHistory(deps);
    const dicePanelExpr = createDicePanelExpr(deps);
    const dicePanelAttrButtons = createDicePanelAttrButtons(deps, { getPanel: () => panel, getDiceCharacterList: () => diceCharacterList, getDiceAttrList: () => diceAttrList, getFromMvu: () => fromMvu, getMvuParsedInfo: () => mvuParsedInfo, getTargetValue: () => targetValue, getCurrentAdvancedPreset: () => currentAdvancedPreset });
    const dicePanelEffectRuns = createDicePanelEffectRuns(deps, { getPanel: () => panel, buildAttrButtons: (n: any) => dicePanelAttrButtons.buildAttrButtons(n) });
    const dicePanelQuickActions = createDicePanelQuickActions(deps, { getPanel: () => panel, getCurrentAdvancedPreset: () => currentAdvancedPreset, applyAdvancedPreset: (id: any) => applyAdvancedPreset(id) });
    const dicePanelResourceBurner = createDicePanelResourceBurner(deps, { getPanel: () => panel, buildAttrButtons: (n: any) => dicePanelAttrButtons.buildAttrButtons(n), matchesCheckSelector: (a: any, s: any) => matchesCheckSelector(a, s), parseModifier: (m: any) => dicePanelExpr.parseModifier(m), performAdvancedCheck: (...a: any[]) => performAdvancedCheck(...a) });
    const dicePanelEffectConfirm = createDicePanelEffectConfirm(deps, { getPanel: () => panel, getEffectRuns: () => dicePanelEffectRuns });
    $('.acu-dice-panel, .acu-dice-overlay').remove();

    const config = deps.getConfig();
    const diceCfg = deps.getDiceConfig();
    // 读取上次保存的骰子类型，必须是有效公式，否则默认1d100
    let savedDiceType = diceCfg.lastDiceType || '1d100';
    // 验证是否是有效公式，无效则回退到1d100
    if (Number.isNaN(rollComplexDiceExpression(savedDiceType).total)) {
      savedDiceType = '1d100';
    }
    // [新增] 构建角色和属性下拉列表
    const rawDataForList = deps.getCachedRawData() || deps.getTableData();
    const diceCharacterList = deps.getDiceQuickSelectCharacterList(rawDataForList as DiceRawData | null | undefined);
    let diceAttrList = [];

    if (rawDataForList) {
      for (const key in rawDataForList) {
        const sheet = rawDataForList[key];
        if (!sheet || !sheet.name || !sheet.content) continue;
        const headers = sheet.content[0] || [];

        if (sheet.name?.includes('主角') && sheet.content[1]) {
          const row = sheet.content[1];
          headers.forEach((h, idx) => {
            if (h && h.includes('属性')) {
              const parsed = deps.parseAttributeString(row[idx] || '');
              parsed.forEach(attr => {
                if (!diceAttrList.includes(attr.name)) diceAttrList.push(attr.name);
              });
            }
          });
        }
      }
    }
    const {
      targetValue = null, // [修复] 默认为 null，支持留空自动计算
      targetName = '', // 留空让 placeholder 显示，执行时若仍为空则使用 '自由检定'
      attrValue = null, // [新增] 属性值参数
      diceType = savedDiceType, // 使用上次保存的骰子类型
      successCriteria = 'lte', // [新增] 默认成功标准：小于等于（COC规则）
      onResult = null,
      initiatorName = '', // [修复] 接收发起者名字
      fromMvu = false, // [新增] 是否从MVU面板调用
      mvuPath = null, // [新增] MVU变量路径
      mvuParsedInfo = null, // [新增] 解析后的路径信息
    } = options;

    // [新增] 计算初始属性值和目标值/DC
    const isDND = diceType === '1d20' || successCriteria === 'gte';
    let initialAttrValue = attrValue;
    let initialTargetValue = targetValue;

    // 如果传入了attrValue但没有targetValue，根据模式自动计算
    if (attrValue !== null && targetValue === null) {
      if (isDND) {
        initialTargetValue = Math.max(0, 20 - attrValue);
      } else {
        initialTargetValue = attrValue;
      }
    }

    const overlay = $(`<div class="acu-dice-overlay"></div>`);

    // [精简] 成功标准选项：只保留 COC 和 DND
    const successCriteriaOptions = [
      { id: 'lte', name: '≤ (COC)' },
      { id: 'gte', name: '≥ (DND)' },
    ];

    // [新增] 根据骰子类型智能选择默认成功标准
    let defaultCriteria = successCriteria;
    if (diceType === '1d100') defaultCriteria = 'lte';
    else if (diceType === '1d20') defaultCriteria = 'gte';

    // [新增] 预设快捷按钮区逻辑
    const quickPresetsHtml = (() => {
      const presets = deps.AdvancedDicePresetManager.getAllPresets()
        .filter(p => p.visible !== false) // 默认显示
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      let html = `<div class="acu-dice-quick-section" id="dice-normal-presets-section" style="margin-bottom: 8px;">`;
      html += `<div class="acu-dice-section-title"><span><i class="fa-solid fa-sliders"></i> 检定规则<div id="dice-preset-quick-actions" class="acu-dice-preset-quick-actions"></div></span></div>`;

      // 1. 常规预设选择器容器
      html += `<div class="acu-dice-quick-presets" id="dice-normal-presets">`;
      // 自定义按钮（固定在最左）
      html += `<button type="button" class="acu-dice-quick-preset-btn" data-id="__custom__">自定义</button>`;

      presets.forEach(p => {
        html += `<button type="button" class="acu-dice-quick-preset-btn" data-id="${deps.escapeHtml(p.id)}">${deps.escapeHtml(p.name)}</button>`;
      });
      html += `</div>`;

      // 2. 工作流模式下的“返回”按钮容器（默认隐藏）
      html += `<div id="dice-workflow-return-container" style="display: none;">
        <button type="button" class="acu-dice-return-btn" id="dice-return-normal-btn">
            <i class="fa-solid fa-arrow-left"></i> 返回常规检定
        </button>
      </div>`;

      html += `</div>`;
      return html;
    })();

    const panel = $(`
            <div class="acu-dice-panel acu-theme-${config.theme}">
                <div class="acu-dice-panel-header">
                    <div class="acu-dice-panel-title">
                        <i class="fa-solid fa-dice-d20"></i> 普通检定
                    </div>
                    <div class="acu-dice-panel-actions">
                        ${deps.getTutorialButtonHtml('dice', '查看检定面板教程')}
                        <button type="button" id="dice-switch-contest-top" class="acu-dice-panel-action-btn" aria-label="切换到对抗检定" title="切换到对抗检定"><i class="fa-solid fa-people-arrows"></i></button>
                        <button type="button" id="dice-history-btn" class="acu-dice-panel-action-btn" aria-label="检定历史" title="检定历史"><i class="fa-solid fa-history"></i></button>
                        <button type="button" class="acu-dice-config-btn acu-dice-panel-action-btn" aria-label="检定设置" title="检定设置">
                            <i class="fa-solid fa-cog"></i>
                        </button>
                        <button type="button" class="acu-dice-close acu-dice-panel-action-btn" aria-label="关闭检定面板" title="关闭">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="acu-dice-panel-body">
                    ${quickPresetsHtml}

                    <!-- 快捷选择角色 -->
                    <div class="acu-dice-quick-section">
                        <div class="acu-dice-section-title" id="dice-char-buttons-section"><span><i class="fa-solid fa-user"></i> 快捷选择</span><div id="dice-char-buttons" class="acu-dice-quick-inline"></div></div>
                    </div>

                    <div id="dice-normal-params-section">
                        <!-- 第1行：名字 + 属性名 -->
                        <div class="acu-dice-form-row cols-2" id="dice-row-1">
                            <div id="dice-name-wrapper">
                                <div class="acu-dice-form-label">名字</div>
                                <input type="text" id="dice-initiator-name" class="acu-dice-input" value="${deps.escapeHtml(initiatorName)}" placeholder="<user>">
                            </div>
                            <div id="dice-attr-name-wrapper">
                                <div class="acu-dice-form-label" id="dice-attr-name-label">
                                    <span class="dice-attr-name-text">属性名</span>
                                    <button type="button" class="acu-random-skill-btn" id="dice-random-skill" title="随机技能">
                                        <i class="fa-solid fa-dice"></i>
                                    </button>
                                </div>
                                <input type="text" id="dice-attr-name" class="acu-dice-input" value="${deps.escapeHtml(targetName || '')}" placeholder="自由检定">
                            </div>
                        </div>

                        <!-- 第2行：属性值 + 技能加值 + 目标值 -->
                        <div class="acu-dice-form-row cols-2" id="dice-row-2">
                            <div id="dice-attr-wrapper">
                                <div class="acu-dice-form-label" id="dice-attr-label">属性值</div>
                                <input type="text" id="dice-attr-value" class="acu-dice-input" value="${initialAttrValue !== null ? initialAttrValue : ''}" placeholder="留空=50%最大值">
                            </div>
                            <div id="dice-skill-mod-wrapper" style="display: none;">
                                <div class="acu-dice-form-label" id="dice-skill-mod-label">技能加值</div>
                                <input type="text" id="dice-skill-mod" class="acu-dice-input" placeholder="留空=0">
                            </div>
                            <div id="dice-target-wrapper">
                                <div class="acu-dice-form-label" id="dice-target-label">目标值</div>
                                <input type="text" id="dice-target" class="acu-dice-input" value="${initialTargetValue !== null ? initialTargetValue : ''}" placeholder="留空=属性值">
                            </div>
                        </div>
                    </div>

                    <!-- 第3行：成功标准 + 难度等级 + 修正值 (基础模式) -->
                    <div class="acu-dice-form-row cols-3" id="dice-row-3">
                        <div>
                            <div class="acu-dice-form-label centered">成功标准</div>
                            <select id="dice-success-criteria" class="acu-dice-select">
                                ${successCriteriaOptions
                                  .map(
                                    opt =>
                                      `<option value="${opt.id}" ${opt.id === defaultCriteria ? 'selected' : ''}>${opt.name}</option>`,
                                  )
                                  .join('')}
                            </select>
                        </div>
                        <div id="dice-difficulty-wrapper">
                            <div class="acu-dice-form-label centered">难度等级</div>
                            <select id="dice-difficulty" class="acu-dice-select">
                                <option value="normal" selected>普通</option>
                                <option value="hard">困难</option>
                                <option value="extreme">极难</option>
                                <option value="critical">大成功</option>
                            </select>
                        </div>
                        <div id="dice-mod-wrapper">
                            <div class="acu-dice-form-label" id="dice-mod-label">修正值</div>
                            <input type="text" id="dice-modifier" class="acu-dice-input" placeholder="留空=0">
                        </div>
                    </div>

                    <!-- [新增] 高级预设自定义字段区域 (在快捷属性上方) -->
                    <div id="dice-custom-fields-area"></div>

                    <!-- [新增] 自定义掷骰模式字段区 -->
                    <div id="acu-dice-custom-mode-fields" style="display: none; margin-top: 8px;">
                        <div class="acu-dice-form-row cols-3">
                            <div>
                                <div class="acu-dice-form-label">骰子语法</div>
                                <input type="text" id="custom-dice-expr" class="acu-dice-input" value="${deps.escapeHtml(diceCfg.customDiceExpr || '')}" placeholder="1d100,2d6+3...">
                            </div>
                            <div>
                                <div class="acu-dice-form-label">成功条件</div>
                                <select id="custom-judge-mode" class="acu-dice-select">
                                    <option value=">=">>=</option>
                                    <option value="<=" selected><=</option>
                                    <option value=">">&gt;</option>
                                    <option value="<">&lt;</option>
                                    <option value="none">无判定</option>
                                </select>
                            </div>
                            <div>
                                <div class="acu-dice-form-label">目标值</div>
                                <input type="text" id="custom-target-value" class="acu-dice-input" placeholder="留空=50%概率">
                            </div>
                        </div>
                    </div>

                    <!-- 快捷选择属性（紧凑型） -->
                    <div id="dice-attr-buttons" class="acu-dice-quick-compact"></div>

                    <!-- 隐藏的骰子公式 -->
                    <input type="hidden" id="dice-formula" value="${diceType}">

                    <button type="button" id="dice-roll-btn" class="acu-dice-roll-btn">
                        <i class="fa-solid fa-dice"></i> 掷骰！
                    </button>
                </div>
            </div>
        `);

    overlay.append(panel);
    $('body').append(overlay);
    deps.bindTutorialButtonsIn(panel);

    dicePanelAttrButtons.init();
    // 初始化时执行一次
    dicePanelAttrButtons.updateRuleMode();

    // [新增] 高级预设选择器变更事件 (已重构为快捷按钮点击事件)
    let currentAdvancedPreset: AdvancedDicePreset | LegacyAdvancedDicePreset | null = null;
    let lastVisiblePresetId: string | null = null;

    const applyFieldConfig = function (
      $input: JQuery,
      $label: JQuery,
      config: FieldConfig | undefined,
      defaults: { label: string; placeholder: string },
    ) {
      // 获取包含label和input的wrapper div
      // 实际DOM结构: <div> <label/> <div.acu-input-wrapper> <input/> </div> </div>
      // 所以需要找到label的父元素（同时也是input-wrapper的父元素）
      const $wrapper = $label.parent();

      if (config?.hidden) {
        $wrapper.hide();
        return;
      }

      $wrapper.show();
      $input.attr('placeholder', config?.placeholder || defaults.placeholder).prop('readonly', false);
      $label.text(config?.label || defaults.label);
    };

    /**
     * [新增] 检查属性名是否匹配 CheckSelector
     * @param attrName - 当前检定的属性名
     * @param selector - 选择器配置
     * @returns 是否匹配（true=可用，false=不可用）
     */
    const matchesCheckSelector = (attrName: string, selector?: CheckSelector): boolean => {
      // 如果没有定义 selector，默认匹配所有
      if (!selector) return true;

      const normalizedName = attrName.trim().toLowerCase();

      // 辅助函数：将通配符模式转换为正则表达式
      const wildcardToRegex = (pattern: string): RegExp => {
        const escaped = pattern
          .replace(/[.+^${}()|[\]\\]/g, '\\$&') // 转义特殊字符
          .replace(/\*/g, '.*') // * -> .*
          .replace(/\?/g, '.'); // ? -> .
        return new RegExp(`^${escaped}$`, 'i');
      };

      // 辅助函数：检查名称是否匹配任一模式
      const matchesAnyPattern = (name: string, patterns: string[]): boolean => {
        return patterns.some(pattern => {
          const regex = wildcardToRegex(pattern);
          return regex.test(name);
        });
      };

      // 1. 检查 namePatterns.exclude（优先于 include）
      if (selector.namePatterns?.exclude && selector.namePatterns.exclude.length > 0) {
        if (matchesAnyPattern(normalizedName, selector.namePatterns.exclude)) {
          return false; // 被排除
        }
      }

      // 2. 检查 namePatterns.include
      if (selector.namePatterns?.include && selector.namePatterns.include.length > 0) {
        // 如果定义了 include 且不为 ['*']，需要匹配
        const isWildcardOnly = selector.namePatterns.include.length === 1 && selector.namePatterns.include[0] === '*';
        if (!isWildcardOnly && !matchesAnyPattern(normalizedName, selector.namePatterns.include)) {
          return false; // 未被包含
        }
      }

      // 3. 检查 tags（暂时跳过，因为当前掷骰上下文可能没有 tags 元数据）
      // 未来可以扩展支持 tags.include/exclude

      return true;
    };

    // [新增] 渲染效果输入区域
    const renderEffectInputs = (preset: AdvancedDicePreset, attrName: string): string[] => {
      if (!preset.effectsConfig) return [];

      // 检查触发模式
      const isMatched = matchesCheckSelector(attrName, {
        namePatterns: { include: preset.effectsConfig.triggerPatterns },
      });

      if (!isMatched) return [];

      const items: string[] = [];

      // 从 preset.outcomes 中查找有效果的结果等级，生成输入框
      // 注意：效果定义在 preset.outcomes[].effects 中，不是 effectsConfig.outcomes
      if (preset.outcomes && Array.isArray(preset.outcomes)) {
        const outcomesWithEffects = preset.outcomes.filter(outcome => outcome.effects && outcome.effects.length > 0);

        outcomesWithEffects.forEach(outcome => {
          // 获取该结果等级的默认值（从 effectsConfig.defaultValues 或 effects[0].value）
          const defaultVal =
            preset.effectsConfig?.defaultValues?.[outcome.name] || (outcome.effects && outcome.effects[0]?.value) || '';
          const label = outcome.name; // 使用结果名作为标签

          items.push(`
            <div class="acu-effect-input-group">
              <div class="acu-effect-input-label">
                <span>${deps.escapeHtml(label)}效果</span>
                <span class="acu-effect-preview-text" id="effect-preview-${deps.escapeHtml(outcome.name)}"></span>
              </div>
              <input type="text"
                     class="acu-dice-input acu-effect-value-input"
                     data-outcome="${deps.escapeHtml(outcome.name)}"
                     value=""
                     placeholder="${deps.escapeHtml(String(defaultVal || '输入效果值 (如 1d6)'))}">
            </div>
          `);
        });
      }

      return items;
    };

    const applyAdvancedPreset = (presetId: string | null) => {
      // 获取关键DOM元素
      const $modWrapper = panel.find('#dice-mod-wrapper');
      const $row1 = panel.find('#dice-row-1');
      const $row2 = panel.find('#dice-row-2');
      const $row3 = panel.find('#dice-row-3');
      const $customArea = panel.find('#dice-custom-fields-area');
      const $attrWrapper = panel.find('#dice-attr-wrapper');
      const $targetWrapper = panel.find('#dice-target-wrapper');
      const $skillModWrapper = panel.find('#dice-skill-mod-wrapper');
      const $nameWrapper = panel.find('#dice-name-wrapper');
      const $attrNameWrapper = panel.find('#dice-attr-name-wrapper');

      // 辅助函数: 恢复 Row 1 的名字和属性名
      const restoreRow1 = () => {
        if ($nameWrapper.parent().attr('id') !== 'dice-row-1') {
          $nameWrapper.detach().prependTo($row1);
        }
        if ($attrNameWrapper.parent().attr('id') !== 'dice-row-1') {
          $attrNameWrapper.detach().appendTo($row1);
        }
        $nameWrapper.show();
        $attrNameWrapper.show();
        $row1.show();
        // 恢复为2列布局
        $row1.removeClass('cols-2 cols-3').addClass('cols-2');
      };

      // 辅助函数: 确保修正值输入框回到原来的位置
      const restoreModifier = () => {
        if ($modWrapper.parent().attr('id') !== 'dice-row-3') {
          $modWrapper.detach().appendTo($row3);
        }
        $modWrapper.show();
        panel.find('#dice-mod-label').text('修正值'); // 恢复默认标签
        panel.find('#dice-modifier').attr('placeholder', '留空=0');
      };

      // 辅助函数: 恢复 Row 2 的属性值、技能加值和目标值
      const restoreRow2 = () => {
        if ($attrWrapper.parent().attr('id') !== 'dice-row-2') {
          $attrWrapper.detach().prependTo($row2);
        }
        if ($skillModWrapper.parent().attr('id') !== 'dice-row-2') {
          $skillModWrapper.detach().insertAfter($attrWrapper);
        }
        if ($targetWrapper.parent().attr('id') !== 'dice-row-2') {
          $targetWrapper.detach().appendTo($row2);
        }
        $attrWrapper.show();
        $skillModWrapper.hide(); // 默认隐藏，由预设控制显示
        $targetWrapper.show();
        $row2.show();
      };

      if (!presetId || presetId === '__custom__') {
        // 恢复默认模式 (自定义或无预设)
        currentAdvancedPreset = null;
        lastVisiblePresetId = null;

        // [新增] 显示自定义模式字段区,隐藏预设相关字段
        panel.find('#acu-dice-custom-mode-fields').show();

        // 恢复 Row 1、Row 2 和 Row 3 但隐藏 Row 2/3 (自定义模式使用专属字段)
        restoreRow1();
        restoreRow2();
        restoreModifier();
        $row2.hide();
        $row3.hide();
        panel.find('#dice-difficulty-wrapper').hide();
        panel.find('#dice-success-criteria').closest('div').hide();

        // 清空自定义区域
        $customArea.empty();

        // 恢复"属性名"标签
        panel.find('.dice-attr-name-text').text('属性名');

        // 恢复属性值和目标值输入框
        applyFieldConfig(panel.find('#dice-attr-value'), panel.find('#dice-attr-label'), undefined, {
          label: '属性值',
          placeholder: '留空=50%最大值',
        });

        applyFieldConfig(panel.find('#dice-target'), panel.find('#dice-target-label'), undefined, {
          label: '目标值',
          placeholder: '留空=属性值',
        });

        // 更新按钮高亮
        panel.find('.acu-dice-quick-preset-btn').removeClass('active');
        panel.find('.acu-dice-quick-preset-btn[data-id="__custom__"]').addClass('active');

        panel.find('#dice-normal-presets').show();
        panel.find('#dice-workflow-return-container').hide();

        dicePanelAttrButtons.updateRuleMode();
        dicePanelQuickActions.renderPresetQuickActions(null);
        return;
      }

      const preset = deps.AdvancedDicePresetManager.getAllPresets().find(p => p.id === presetId);
      if (!preset) {
        console.warn('[DICE] 未找到预设:', presetId);
        // 回退到自定义模式
        applyAdvancedPreset('__custom__');
        return;
      }

      currentAdvancedPreset = preset;
      if (preset.visible !== false) {
        lastVisiblePresetId = preset.id;
      }

      // 更新按钮高亮
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      panel.find(`.acu-dice-quick-preset-btn[data-id="${deps.escapeHtml(preset.id)}"]`).addClass('active');

      // 隐藏自定义输入框
      // [新增] 隐藏自定义模式字段区
      panel.find('#acu-dice-custom-mode-fields').hide();

      // 更新骰子表达式
      panel.find('#dice-formula').val(preset.diceExpression);

      // 更新"属性名"标签（如Fate使用"技能/风格"）
      panel.find('.dice-attr-name-text').text(preset.attributeName?.label || '属性名');

      // 隐藏原始 Row 1、Row 2 和 Row 3 (所有字段将整合到 customArea 中)
      restoreRow1();
      restoreRow2();
      restoreModifier();
      $row1.hide();
      $row2.hide();
      $row3.hide();

      // 清空自定义区域
      $customArea.empty();

      // [重构] 收集所有可见字段，统一使用智能布局
      const gridItems: (JQuery | string)[] = [];

      // 0. 名字 (始终显示)
      gridItems.push($nameWrapper);

      // 0.5 属性名 (始终显示)
      gridItems.push($attrNameWrapper);

      // 1. 属性值 (如果未隐藏)
      if (!preset.attribute?.hidden) {
        applyFieldConfig(panel.find('#dice-attr-value'), panel.find('#dice-attr-label'), preset.attribute, {
          label: '属性值',
          placeholder: '留空=50%最大值',
        });
        gridItems.push($attrWrapper);
      }

      // 1.5 技能加值 (如果预设定义了 skillMod 且未隐藏)
      if (preset.skillMod && !preset.skillMod.hidden) {
        applyFieldConfig(panel.find('#dice-skill-mod'), panel.find('#dice-skill-mod-label'), preset.skillMod, {
          label: '技能加值',
          placeholder: '留空=0',
        });
        gridItems.push($skillModWrapper);
      }

      // [新增] 效果输入区域
      const attrName = panel.find('#dice-attr-name').val().trim();
      const effectInputItems = renderEffectInputs(preset, attrName);
      if (effectInputItems.length > 0) {
        gridItems.push(...effectInputItems);
      }

      // 2. 目标值/DC (如果未隐藏)
      if (!preset.dc?.hidden) {
        applyFieldConfig(panel.find('#dice-target'), panel.find('#dice-target-label'), preset.dc, {
          label: '目标值',
          placeholder: '留空=属性值',
        });
        gridItems.push($targetWrapper);
      }

      // 3. 修正值 (如果未隐藏)
      if (!preset.mod?.hidden) {
        if (preset.mod?.label) {
          panel.find('#dice-mod-label').text(preset.mod.label);
        }
        // 使用 placeholder 显示默认值
        const modDefault = preset.mod?.defaultValue;
        if (modDefault !== undefined && modDefault !== 0) {
          panel.find('#dice-modifier').attr('placeholder', `留空=${modDefault}`);
        } else {
          panel.find('#dice-modifier').attr('placeholder', '留空=0');
        }
        gridItems.push($modWrapper);
      }

      // 4. 收集自定义字段
      if ('customFields' in preset && Array.isArray(preset.customFields) && preset.customFields.length > 0) {
        const visibleFields = preset.customFields.filter(f => !f.hidden);

        visibleFields.forEach(field => {
          let html = '<div>';

          // 标签
          if (field.type !== 'toggle') {
            html += `<div class="acu-dice-form-label">${deps.escapeHtml(field.label || field.id)}</div>`;
          } else {
            html += '<div class="acu-dice-form-label">&nbsp;</div>'; // 占位
          }

          // 控件
          if (field.type === 'select' && field.options) {
            html += `<select class="acu-dice-select acu-dice-custom-field" data-id="${deps.escapeHtml(field.id)}">`;
            field.options.forEach(opt => {
              const isSelected = opt.value === field.defaultValue ? 'selected' : '';
              html += `<option value="${deps.escapeHtml(String(opt.value))}" ${isSelected}>${deps.escapeHtml(opt.label)}</option>`;
            });
            html += '</select>';
          } else if (field.type === 'toggle') {
            const isChecked = field.defaultValue ? 'checked' : '';
            html += `<label style="display: flex; align-items: center; cursor: pointer; height: 32px;">
              <input type="checkbox" class="acu-dice-custom-field" data-id="${deps.escapeHtml(field.id)}" ${isChecked} style="margin-right: 8px;">
              ${deps.escapeHtml(field.label || field.id)}
            </label>`;
          } else {
            const type = field.type === 'number' ? 'number' : 'text';
            // [修复] 使用 placeholder 而不是 value 显示默认值
            const defaultVal = field.defaultValue;
            const placeholderText =
              field.placeholder || (defaultVal !== undefined && defaultVal !== '' ? `留空=${defaultVal}` : '');
            html += `<input type="${type}" class="acu-dice-input acu-dice-custom-field" data-id="${deps.escapeHtml(field.id)}"
              placeholder="${deps.escapeHtml(placeholderText)}">`;
          }

          html += '</div>';
          gridItems.push(html);
        });
      }

      // 5. 智能排版渲染网格
      // 布局规律：最后一行优先放3个字段，前面的行放2个字段
      // - 4个字段：2+2
      // - 5个字段：2+3
      // - 6个字段：3+3
      // - 7个字段：2+2+3
      // - 8个字段：2+3+3
      // - 9个字段：3+3+3
      const appendItem = ($row: JQuery, item: JQuery | string) => {
        if (typeof item === 'string') {
          $row.append(item);
        } else {
          item.detach().appendTo($row);
          item.show();
        }
      };

      // 计算行分配：从后往前，优先用3列填充
      const computeRowLayout = (total: number): number[] => {
        if (total <= 0) return [];
        if (total <= 2) return [2]; // 最少2列，避免 cols-1
        if (total === 3) return [3];
        if (total === 4) return [2, 2];
        if (total === 5) return [2, 3];
        if (total === 6) return [3, 3];
        // 7+ 字段：递归计算，最后一行放3个，剩余的递归处理
        return [...computeRowLayout(total - 3), 3];
      };

      // 直接计算 gridItems 的行分配
      const gridRowLayout = computeRowLayout(gridItems.length);

      let itemIndex = 0;
      for (const colCount of gridRowLayout) {
        const $row = $(`<div class="acu-dice-form-row cols-${colCount}"></div>`);
        for (let j = 0; j < colCount; j++) {
          if (itemIndex < gridItems.length) {
            appendItem($row, gridItems[itemIndex]);
            itemIndex++;
          } else {
            $row.append('<div></div>');
          }
        }
        $customArea.append($row);
      }

      // [新增] 为动态生成的 customFields 输入框添加清除按钮
      deps.addClearButton($customArea, '.acu-dice-custom-field[type="text"], .acu-dice-custom-field[type="number"]');

      dicePanelQuickActions.renderPresetQuickActions(preset);

      // [核心修复] 检测是否为“工作流模式”并切换 UI 状态
      // 这里的判定逻辑：如果预设是“非默认可见”的（visible: false），则视为特殊工作流（如技能成长）
      // 此时隐藏常规预设切换按钮，显示“返回常规检定”按钮
      const isWorkMode = preset.visible === false;
      const $normalPresets = panel.find('#dice-normal-presets');
      const $workflowReturn = panel.find('#dice-workflow-return-container');

      if (isWorkMode) {
        $normalPresets.hide();
        $workflowReturn.show();
        $workflowReturn
          .find('button')
          .html(`<i class="fa-solid fa-arrow-left"></i> 返回常规检定（退出${deps.escapeHtml(preset.name)}）`);
      } else {
        $normalPresets.show();
        $workflowReturn.hide();
      }

      console.log('[DICE] 应用高级预设:', preset.name, isWorkMode ? '(工作流模式)' : '');
    };

    // [新增] 动态监听属性名变化，更新效果输入区域
    panel.find('#dice-attr-name').on('change', function () {
      if (!currentAdvancedPreset) return;
      // 重新渲染整个面板内容可能太重，这里只更新效果区域
      // 但由于效果区域是作为 gridItems 动态插入的，直接重新调用 applyAdvancedPreset 最简单
      // 必须防止死循环
      if (panel.data('updating-preset')) return;
      panel.data('updating-preset', true);
      applyAdvancedPreset(currentAdvancedPreset.id);
      panel.data('updating-preset', false);
    });

    // 自定义模式下持久化骰子语法（仅自定义模式使用）
    panel.find('#custom-dice-expr').on('input change', function () {
      if (!panel.find('#acu-dice-custom-mode-fields').is(':visible')) return;
      const customExpr = ($(this).val() || '').toString().trim();
      deps.saveDiceConfig({ customDiceExpr: customExpr });
    });

    // 绑定快捷预设按钮点击事件：预设管理器会动态刷新按钮，必须用委托绑定新按钮
    panel.on('click', '#dice-normal-presets .acu-dice-quick-preset-btn', function () {
      const presetId = $(this).data('id') as string;

      // 保存到 last preset
      if (presetId === '__custom__') {
        deps.AdvancedDicePresetManager.setActivePreset(null);
        localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, '__custom__');
      } else {
        deps.AdvancedDicePresetManager.setActivePreset(presetId);
        localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, presetId);
      }

      applyAdvancedPreset(presetId);
    });

    // [新增] 绑定“返回常规检定”按钮点击事件
    panel.on('click', '#dice-return-normal-btn', function (e) {
      e.preventDefault();
      // 返回到最近一次可见预设；若无则回退到第一个可见预设
      let targetPresetId: string | null = lastVisiblePresetId;

      // 验证 targetPresetId 是否有效且可见
      const allPresets = deps.AdvancedDicePresetManager.getAllPresets();
      const targetPreset = allPresets.find(p => p.id === targetPresetId);
      if (!targetPreset || targetPreset.visible === false) {
        // 如果上次预设无效或不可见，则回退到第一个可见预设
        const firstVisible = allPresets.find(p => p.visible !== false);
        targetPresetId = firstVisible ? firstVisible.id : '__custom__';
      }

      // 执行切换
      if (targetPresetId === '__custom__') {
        deps.AdvancedDicePresetManager.setActivePreset(null);
      } else {
        deps.AdvancedDicePresetManager.setActivePreset(targetPresetId);
      }
      // 更新 localStorage
      localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, targetPresetId || '__custom__');

      applyAdvancedPreset(targetPresetId);
    });

    panel.on('click', '.acu-dice-preset-action-btn', async function (e) {
      e.preventDefault();
      e.stopPropagation();
      const actionId = String($(this).data('action-id') || '').trim();
      if (!actionId) return;
      const $btn = $(this);
      if ($btn.prop('disabled')) return;
      $btn.prop('disabled', true).addClass('disabled');
      try {
        await dicePanelQuickActions.executePresetQuickAction(actionId);
      } finally {
        $btn.prop('disabled', false).removeClass('disabled');
        dicePanelQuickActions.renderPresetQuickActions(currentAdvancedPreset);
      }
    });

    panel.find('#dice-attr-value, #dice-modifier, #dice-target').on('input change', function () {
      dicePanelQuickActions.renderPresetQuickActions(currentAdvancedPreset);
    });

    // 初始化时应用已保存的预设
    const savedPresetId = localStorage.getItem(deps.STORAGE_KEY_LAST_PRESET);
    // 兼容旧逻辑：如果 ActivePresetManager 里有值，优先使用
    const activePreset = deps.AdvancedDicePresetManager.getActivePreset();

    if (activePreset) {
      applyAdvancedPreset(activePreset.id);
    } else if (savedPresetId && savedPresetId !== '__custom__') {
      applyAdvancedPreset(savedPresetId);
    } else {
      applyAdvancedPreset('__custom__');
    }

    // 掷骰逻辑 - 使用 rollComplexDiceExpression 支持复合表达式
    const performAdvancedCheck = async function (options?: { isPushed?: boolean }) {
      if (!currentAdvancedPreset) return;

      const preset = currentAdvancedPreset;
      const initiatorName = deps.resolveCanonicalCharacterName(panel.find('#dice-initiator-name').val().trim() || '<user>');
      const attrName = panel.find('#dice-attr-name').val().trim() || '自由检定';

      // [辅助函数] 解析 defaultValue (支持表达式)
      const resolveDefaultValue = function (
        defaultValue: number | string | undefined,
        context: Record<string, number>,
      ): number {
        if (defaultValue === undefined) return 0;
        if (typeof defaultValue === 'number') return defaultValue;
        // 字符串表达式,使用 evaluateFormula 解析
        const result = deps.evaluateFormula(defaultValue, context);
        if (result === 0 && defaultValue !== '0' && String(defaultValue) !== '0') {
          if (window.toastr) {
            window.toastr.warning(`表达式 "${defaultValue}" 求值失败,使用默认值 0`);
          }
        }
        return result || 0;
      };

      // 1. 解析属性值 (用户输入优先,留空用 defaultValue)
      let attrValue = 0;
      const attrInputVal = panel.find('#dice-attr-value').val().trim();
      if (attrInputVal !== '') {
        attrValue = parseInt(attrInputVal, 10) || 0;
      } else if (preset.attribute?.mode === 'fixed' && preset.attribute?.key) {
        // 从表格读取
        attrValue = deps.getAttributeValue(initiatorName, preset.attribute.key) || 0;
      } else {
        attrValue = resolveDefaultValue(preset.attribute?.defaultValue, {});
      }

      // 2. 解析DC：显示字段用户输入优先；隐藏字段仍可用 defaultValue 作为固定常量
      let dc =
        preset.dc?.mode === 'fixed' && preset.dc?.value !== undefined
          ? preset.dc.value
          : resolveDefaultValue(preset.dc?.defaultValue, { $attr: attrValue });
      if (!preset.dc?.hidden) {
        const dcInputVal = panel.find('#dice-target').val().trim();
        if (dcInputVal !== '') {
          dc = parseInt(dcInputVal, 10) || 0;
        } else if (preset.dc?.mode === 'fixed' && preset.dc?.value !== undefined) {
          dc = preset.dc.value;
        } else {
          dc = resolveDefaultValue(preset.dc?.defaultValue, { $attr: attrValue });
        }
      }

      // 3. 解析修正值：显示字段用户输入优先；隐藏字段仍可用 defaultValue 作为固定常量
      let mod = resolveDefaultValue(preset.mod?.defaultValue, { $attr: attrValue });
      if (!preset.mod?.hidden) {
        const modStr = panel.find('#dice-modifier').val().trim();
        if (modStr !== '') {
          mod = dicePanelExpr.parseModifier(modStr);
        } else {
          mod = resolveDefaultValue(preset.mod?.defaultValue, { $attr: attrValue });
        }
      }

      // 3.3 解析技能加值：显示字段用户输入优先；隐藏字段仍可用 defaultValue 作为固定常量
      let skillMod = preset.skillMod ? resolveDefaultValue(preset.skillMod?.defaultValue, { $attr: attrValue }) : 0;
      if (preset.skillMod && !preset.skillMod.hidden) {
        const skillModStr = panel.find('#dice-skill-mod').val().trim();
        if (skillModStr !== '') {
          skillMod = dicePanelExpr.parseModifier(skillModStr);
        } else {
          skillMod = resolveDefaultValue(preset.skillMod?.defaultValue, { $attr: attrValue });
        }
      }

      // 3.5 计算属性调整值 (DND5e等规则使用)
      let attrMod = 0;
      if ('attribute' in preset && preset.attribute?.computeModifier) {
        attrMod = deps.evaluateConditionNumber(preset.attribute.computeModifier, { $attr: attrValue }, 0);
      }

      // [新增] 收集自定义字段值
      const customValues: Record<string, number | string | boolean> = {};
      if ('customFields' in preset && Array.isArray(preset.customFields) && preset.customFields.length > 0) {
        const $customFields = panel.find('.acu-dice-custom-field');
        $customFields.each(function () {
          const $el = $(this);
          const id = $el.data('id');
          // 找到配置
          const fieldConfig = preset.customFields.find(f => f.id === id);
          if (!fieldConfig) return;

          let val: string | number | boolean;
          if (fieldConfig.type === 'toggle') {
            val = $el.prop('checked');
          } else if (fieldConfig.type === 'number') {
            const num = parseFloat($el.val() as string);
            val = isNaN(num) ? (fieldConfig.defaultValue as number) : num;
          } else if (fieldConfig.type === 'select') {
            // [修复] select 类型的值需要转换为数字（如果是数字字符串）
            const rawVal = $el.val() as string;
            const num = parseFloat(rawVal);
            val = isNaN(num) ? rawVal : num;
          } else {
            const rawVal = String($el.val() ?? '').trim();
            if (rawVal === '' && fieldConfig.defaultValue !== undefined && fieldConfig.defaultValue !== '') {
              val = fieldConfig.defaultValue as string | number | boolean;
            } else {
              val = rawVal;
            }
          }
          customValues['$' + id] = val; // 添加 $ 前缀以便在表达式中使用
        });
      }

      // [新增] 计算派生变量 (投骰前)
      const baseContext = {
        $attr: attrValue,
        $attrMod: attrMod,
        $skillMod: skillMod,
        $dc: dc,
        $mod: mod,
        ...customValues,
      };
      const derivedValues: Record<string, number> = {};
      if ('derivedVars' in preset && Array.isArray(preset.derivedVars) && preset.derivedVars.length > 0) {
        preset.derivedVars.forEach(spec => {
          const id = spec?.id?.trim();
          if (!id) return;
          const varName = id.startsWith('$') ? id : `$${id}`;
          const evalResult = deps.evaluateCondition(spec.expr, { ...baseContext, ...derivedValues });
          if (!evalResult.success) {
            console.warn(`[DICE] 派生变量 ${varName} 计算失败:`, evalResult.error);
            derivedValues[varName] = 0;
            return;
          }
          const rawValue = evalResult.value;
          const numericValue = typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
          derivedValues[varName] = numericValue;
        });
      }
      const extraValues = { ...customValues, ...derivedValues };

      let diceExpression = preset.diceExpression;
      if ('dicePatches' in preset && Array.isArray(preset.dicePatches) && preset.dicePatches.length > 0) {
        const patchContext = { ...baseContext, ...derivedValues };
        const replacePatchTemplate = (template: string): string => {
          const varPattern = /\$[a-zA-Z_]\w*/g;
          return template.replace(varPattern, match => {
            const value = patchContext[match];
            return typeof value === 'number' && Number.isFinite(value) ? String(value) : '0';
          });
        };

        preset.dicePatches.forEach(patch => {
          if (!patch) return;
          if (patch.when) {
            const conditionResult = deps.evaluateCondition(patch.when, patchContext);
            if (!conditionResult.success) {
              console.warn('[DICE] dicePatches 条件评估失败:', conditionResult.error);
              return;
            }
            const shouldApply =
              typeof conditionResult.value === 'number' ? conditionResult.value !== 0 : Boolean(conditionResult.value);
            if (!shouldApply) return;
          }

          const resolvedTemplate = replacePatchTemplate(patch.template ?? '');
          switch (patch.op) {
            case 'append':
              diceExpression = `${diceExpression}${resolvedTemplate}`;
              break;
            case 'prepend':
              diceExpression = `${resolvedTemplate}${diceExpression}`;
              break;
            case 'replace':
              diceExpression = resolvedTemplate;
              break;
          }
        });
      }

      // 4. 投骰
      const rollResult = rollComplexDiceExpression(diceExpression);
      const rollTotal = rollResult.total;
      if (Number.isNaN(rollTotal)) {
        console.warn('[DICE] 高级预设骰子语法错误:', diceExpression);
        if (window.toastr)
          showActionableErrorToast(`骰子语法错误: ${diceExpression}`, {
            suggestion: '请检查高级预设中的骰子表达式，只使用形如 1d100、2d6+3 的合法写法。',
          });
        return;
      }

      // [新增] 投骰后重新计算派生变量（支持依赖 $roll.total 的派生变量，如 chaos = 6 - $roll.total）
      const postRollDerivedValues: Record<string, number> = {};
      if ('derivedVars' in preset && Array.isArray(preset.derivedVars) && preset.derivedVars.length > 0) {
        const postRollContext = {
          $roll: rollResult,
          '$roll.total': rollTotal, // 显式添加 $roll.total 作为独立变量
          ...baseContext,
          ...customValues,
        };
        preset.derivedVars.forEach(spec => {
          const id = spec?.id?.trim();
          if (!id) return;
          const varName = id.startsWith('$') ? id : `$${id}`;
          const evalResult = deps.evaluateCondition(spec.expr, { ...postRollContext, ...postRollDerivedValues });
          if (!evalResult.success) {
            console.warn(`[DICE] 派生变量 ${varName} (投骰后) 计算失败:`, evalResult.error);
            postRollDerivedValues[varName] = 0;
            return;
          }
          const rawValue = evalResult.value;
          const numericValue = typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
          postRollDerivedValues[varName] = numericValue;
        });
      }

      // 5. 判定成功
      const isPushed = options?.isPushed ?? false;
      const context = {
        $roll: rollResult, // 传递整个对象
        '$roll.total': rollTotal, // 显式添加 $roll.total
        $isPushed: isPushed ? 1 : 0, // 孤注一掷标记 (1=是,0=否)
        ...baseContext,
        ...postRollDerivedValues, // 使用投骰后计算的派生变量
      };

      // 判定结果: 使用 outcomes 系统
      let outcomeText: string;
      let resultType: string;
      let isSuccess = false;
      let matchedOutcome: OutcomeLevel | undefined;
      let conditionExpr = '';
      let displayExprResult = true; // displayExpr 的计算结果，用于判断"成立/不成立"
      let displayExprValue: string | number = '';
      let branchReasonText = '';

      if ('outcomes' in preset && Array.isArray(preset.outcomes) && preset.outcomes.length > 0) {
        // 新系统: 使用 evaluateOutcomes
        matchedOutcome = deps.evaluateOutcomes(preset.outcomes, context);
        const policyResult = deps.applyAdvancedPresetOutcomePolicy(preset, matchedOutcome, context);
        matchedOutcome = policyResult.outcome;

        outcomeText = matchedOutcome.name || '判定完成';
        // 使用 displayExpr（如果有）或 condition 作为显示表达式
        // [修复] 当触发 unmet 时，显示用户要求的等级的条件（如"极难成功"的条件）
        // 这样用户能看到"你需要达到这个条件才算成功"
        const displaySourceOutcome = deps.getAdvancedPresetDisplayOutcome(policyResult);
        const displayExpr = displaySourceOutcome.displayExpr ?? displaySourceOutcome.condition;

        // [修改] 替换所有上下文变量 (包括自定义变量)
        conditionExpr = displayExpr;
        // 先替换 $roll.hasTag() 方法调用 (必须在 $roll 之前)
        if (context.$roll && typeof context.$roll === 'object') {
          const roll = context.$roll as RollResult;
          conditionExpr = conditionExpr.replace(/\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi, (_match, tag) => {
            return (roll.tags ?? []).includes(tag) ? '成立' : '不成立';
          });
        }
        // 再替换标准变量 (注意: $roll.total 必须在 $roll 之前替换)
        conditionExpr = conditionExpr
          .replace(/\$roll\.total/g, String(rollTotal))
          .replace(/\$roll/g, String(rollTotal))
          .replace(/\$attrMod/g, String(attrMod))
          .replace(/\$skillMod/g, String(skillMod))
          .replace(/\$attr/g, String(attrValue))
          .replace(/\$dc/g, String(dc))
          .replace(/\$mod/g, String(mod));

        // 再替换自定义变量
        Object.keys(extraValues).forEach(key => {
          // 使用正则替换所有出现的变量 (注意转义 $ 符号)
          const safeKey = key.replace('$', '\\$');
          const regex = new RegExp(safeKey, 'g');
          conditionExpr = conditionExpr.replace(regex, String(extraValues[key]));
        });

        // [新增] 清理零值显示：隐藏 "+ 0" 模式，使公式更简洁
        // 例如 "3 + 2 + 13 + 0 >= 10" -> "3 + 2 + 13 >= 10"
        conditionExpr = conditionExpr
          .replace(/\s*\+\s*0(?=\s*[+\->=<]|\s*$)/g, '') // 移除 "+ 0" (后面跟运算符或结尾)
          .replace(/^\s*0\s*\+\s*/g, ''); // 移除开头的 "0 +"

        // 计算 displayExpr 的布尔值（用于判断"成立/不成立"）
        const displayExprEvalResult = deps.evaluateCondition(displayExpr, context);
        const rawDisplayExprValue = displayExprEvalResult.value;
        displayExprValue =
          typeof rawDisplayExprValue === 'number' && Number.isFinite(rawDisplayExprValue)
            ? rawDisplayExprValue
            : conditionExpr;
        displayExprResult =
          displayExprEvalResult.success &&
          (typeof displayExprEvalResult.value === 'number'
            ? displayExprEvalResult.value !== 0
            : Boolean(displayExprEvalResult.value));
        branchReasonText = `命中【${matchedOutcome.name}】分支，分支判定式 ${conditionExpr || displayExpr}，结果${displayExprResult ? '成立' : '不成立'}`;
        // 根据 priority 推断 resultType 和 isSuccess (用于 CSS 类名兼容)
        if (matchedOutcome.priority <= 10) {
          resultType = 'critSuccess';
          isSuccess = true;
        } else if (matchedOutcome.priority <= 30) {
          resultType = 'extremeSuccess';
          isSuccess = true;
        } else if (matchedOutcome.priority < 50) {
          resultType = 'success';
          isSuccess = true;
        } else if (matchedOutcome.priority === 50) {
          resultType = 'warning';
          isSuccess = false;
        } else if (matchedOutcome.priority < 90) {
          resultType = 'failure';
          isSuccess = false;
        } else {
          resultType = 'critFailure';
          isSuccess = false;
        }
      } else {
        // 兜底: 无法判定
        outcomeText = '未知';
        resultType = 'warning';
        branchReasonText = '未命中可识别分支，按默认路径处理';
        console.warn('[DICE] 预设缺少 outcomes');
      }

      // 5. 格式化输出
      const finalValue = rollTotal + attrValue + skillMod + mod;

      // 生成徽章样式 (优先使用 outcome.style.color,否则使用 CSS 类名)
      const badgeClass = deps.getResultBadgeClass(resultType);
      const diceCfg = deps.getDiceConfig();
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const displayValue = hideDiceResultFromUser ? '？？' : rollTotal;
      const displayOutcomeText = hideDiceResultFromUser ? '' : outcomeText;

      // 构建显示表达式
      // 简单条件: 显示 conditionExpr (如 21 <= 64)
      // 复杂条件: 显示空字符串
      // 隐藏检定结果时: 显示空字符串
      const exprDisplay = deps.isComplexCondition(conditionExpr) ? '' : conditionExpr;
      const displayExpr = hideDiceResultFromUser ? '' : exprDisplay;

      // 将按钮内容替换为结果显示
      const $rollBtn = panel.find('#dice-roll-btn');
      $rollBtn.html(`
        <div class="acu-dice-result-display">
          <span class="acu-dice-result-value">${displayValue}</span>
          <span class="acu-dice-result-target" style="font-size: 11px;">${deps.escapeHtml(displayExpr)}</span>
          ${displayOutcomeText ? `<span class="${badgeClass}">${displayOutcomeText}</span>` : ''}
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮点击事件
      $rollBtn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        performAdvancedCheck();
      });

      // [新增] 渲染资源消耗器按钮 (燃运等)
      if (preset.resourceBurners && preset.resourceBurners.length > 0) {
        // 构建上下文：包含基础属性、派生变量、投骰结果
        const burnerContext = {
          ...context, // 复用已构建的 context (包含 $roll, $roll.total, $attr 等)
        };

        const burnersHtml = dicePanelResourceBurner.renderResourceBurnerButtons(preset, burnerContext, matchedOutcome, attrName);
        if (burnersHtml) {
          // 插入到结果显示区域
          const $burners = $(burnersHtml);
          $rollBtn.find('.acu-dice-result-display').append($burners);

          // 绑定资源消耗按钮点击事件
          $burners.find('.acu-dice-burner-btn').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            const burnerId = $(this).data('id');
            const burner = preset.resourceBurners?.find(b => b.id === burnerId);
            if (burner) {
              dicePanelResourceBurner.handleResourceBurnerClick(burner, burnerContext);
            }
          });
        }
      }

      // [新增] 渲染孤注一掷按钮 (Pushed Roll) — 基于 outcome ID 而非 isSuccess 二元值
      if (
        preset.pushedRoll?.enabled &&
        !isPushed && // 已经是孤注一掷则不可再push
        matchedOutcome &&
        !matchesCheckSelector(attrName, {
          namePatterns: { include: preset.pushedRoll.excludePatterns ?? [] },
        }) // 排除特定属性名
      ) {
        const outcomeId = matchedOutcome.id;
        // 判定优先级: blockedOutcomes > pushableOutcomes > legacy fallback (!isSuccess)
        const blockedOutcomes =
          preset.pushedRoll.blockedOutcomes ?? (preset.pushedRoll.blockOnCritFailure !== false ? ['crit_failure'] : []);
        const isBlocked = blockedOutcomes.includes(outcomeId);
        const isPushable = preset.pushedRoll.pushableOutcomes
          ? preset.pushedRoll.pushableOutcomes.includes(outcomeId)
          : !isSuccess; // legacy fallback
        if (isPushable && !isBlocked) {
          const $pushBtn = $(`
           <button type="button" class="acu-dice-burner-btn" aria-label="孤注一掷" title="孤注一掷：重掷一次，失败后果更严重">
             <i class="fa-solid fa-skull"></i>
           </button>
         `);
          // 优先插入到 burners 容器中（与燃运按钮并排），否则创建一个
          let $burnersContainer = $rollBtn.find('.acu-dice-burners');
          if (!$burnersContainer.length) {
            $burnersContainer = $('<span class="acu-dice-burners"></span>');
            $rollBtn.find('.acu-dice-result-display').append($burnersContainer);
          }
          $burnersContainer.append($pushBtn);
          $pushBtn.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            performAdvancedCheck({ isPushed: true });
          });
        }
      }

      // 生成输出文本 (使用模板系统)
      // judgeResultText 基于 displayExpr 的计算结果，表示显示的算式是否在数学上成立
      const judgeResultText = displayExprResult ? '成立' : '不成立';
      const template =
        'outputTemplate' in preset && preset.outputTemplate ? preset.outputTemplate : deps.DEFAULT_OUTPUT_TEMPLATE;
      // 计算pushed标注: 按 outcome ID 查找 outcomeLabels，fallback 到 '*' 默认值
      const pushedLabel =
        isPushed && matchedOutcome
          ? (preset.pushedRoll?.outcomeLabels?.[matchedOutcome.id] ?? preset.pushedRoll?.outcomeLabels?.['*'] ?? '')
          : '';
      const outcomeTextRaw = (pushedLabel ? pushedLabel + '\n' : '') + (matchedOutcome?.outputText ?? '');
      // 格式化attrMod为带符号字符串 (如 +3 或 -1)
      const attrModStr = attrMod >= 0 ? `+${attrMod}` : String(attrMod);
      // 格式化skillMod为带符号字符串
      const skillModStr = skillMod >= 0 ? `+${skillMod}` : String(skillMod);

      // [新增] 条件文本变量：当值为0时隐藏整个片段（包括标签）
      // skillModText: 当skillMod非0时显示 "+技能加值+N"，否则为空
      const skillModText = skillMod !== 0 ? `+技能加值${skillModStr}` : '';
      // modText: 当mod非0时显示 "+额外加值+N"，否则为空
      const modText = mod !== 0 ? `+额外加值${mod >= 0 ? '+' + mod : mod}` : '';
      // attrModText: 当attrMod非0时显示 "(调整值+N)"，否则为空
      const attrModText = attrMod !== 0 ? `(调整值${attrModStr})` : '';
      const checkValueText = deps.buildCheckValueText({
        preset,
        characterName: initiatorName,
        actionName: attrName,
        attrValue,
        attrMod,
        skillMod,
        mode: 'normal',
      });

      // [新增] 将派生变量转换为 outputContext 格式（去掉 $ 前缀）
      const derivedOutputVars: Record<string, number> = {};
      Object.entries(postRollDerivedValues).forEach(([key, value]) => {
        const cleanKey = key.startsWith('$') ? key.slice(1) : key;
        derivedOutputVars[cleanKey] = value;
      });
      const customOutputVars: Record<string, string | number | boolean> = {};
      Object.entries(customValues).forEach(([key, value]) => {
        const cleanKey = key.startsWith('$') ? key.slice(1) : key;
        customOutputVars[cleanKey] = value;
      });

      // [新增] 计算后果效果变量
      const effectVars = computePendingEffectVariables(matchedOutcome?.effects);

      const outputContext = {
        initiator: initiatorName,
        attrName: `【${attrName}】`,
        attrValue: attrValue,
        attrMod: attrModStr,
        displayValue: displayExprValue,
        skillMod: skillModStr,
        // [新增] 条件文本变量（零值时隐藏整个片段）
        skillModText: skillModText,
        modText: modText,
        attrModText: attrModText,
        checkValueText,
        formula: diceExpression,
        roll: rollTotal,
        'roll.total': rollTotal, // [新增] 支持 $roll.total 语法
        dc: dc,
        mod: mod,
        attr: attrValue,
        conditionExpr: conditionExpr,
        judgeResult: judgeResultText,
        outcomeName: outcomeText,
        outcomeText: outcomeTextRaw,
        ...customOutputVars,
        ...derivedOutputVars, // [新增] 添加派生变量（如 chaos）
        ...effectVars, // [新增] 添加后果效果变量
      };
      // [修复] 先独立渲染 outcomeText，避免其中变量（如 $growthGain）残留
      outputContext.outcomeText = deps.formatOutputTemplate(String(outputContext.outcomeText || ''), outputContext);
      const diceResultText = deps.formatOutputTemplate(template, outputContext);
      deps.smartInsertToTextarea(diceResultText, 'dice');

      // 构建检定结果对象
      const checkResult: AcuDice.CheckResult = {
        success: isSuccess,
        total: rollTotal,
        target: dc,
        outcomeText,
        attrName,
        criteria: 'advanced',
        isAutoTarget: false,
        formula: diceExpression,
      };

      // 添加到历史记录
      const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkResultWithTimestamp = {
        ...checkResult,
        timestamp: Date.now(),
        detailId,
        initiatorName,
        historyType: 'check' as const,
        detailLines: [
          `发起者: ${initiatorName}`,
          `属性: ${attrName} (值=${attrValue})`,
          `公式: ${diceExpression}`,
          `掷骰: ${rollTotal}`,
          `目标: ${dc}`,
          `修正: attrMod=${attrModStr}, skillMod=${skillModStr}, mod=${mod >= 0 ? '+' + mod : mod}`,
          `判定: ${judgeResultText || outcomeText}`,
          `结果: ${outcomeText}`,
        ],
        ...(isPushed ? { isPushed: true } : {}),
      };
      deps.getCheckHistory().push(checkResultWithTimestamp);
      if (deps.getCheckHistory().length > deps.getMAX_HISTORY()) {
        deps.getCheckHistory().shift();
      }

      // 触发事件
      deps.emitEvent('check', checkResultWithTimestamp);

      // 暂存后果
      // [修复] 检查属性名是否匹配 effectsConfig.triggerPatterns
      const shouldTriggerEffects =
        preset.effectsConfig &&
        matchedOutcome &&
        matchedOutcome.effects &&
        matchedOutcome.effects.length > 0 &&
        matchesCheckSelector(attrName, {
          namePatterns: { include: preset.effectsConfig.triggerPatterns },
        });

      if (shouldTriggerEffects) {
        const historyIndex = deps.getCheckHistory().length - 1;
        const runId = `effect_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const effectContext = {
          characterName: initiatorName,
          attributeName: attrName,
          attributeValue: attrValue,
          roll: rollResult.total,
          modifier: mod,
          dc,
        };

        const pendingCtx: PendingEffectContext = {
          runId,
          historyIndex,
          preset,
          matchedOutcome,
          context: effectContext,
          branchReasonText,
          sourceMetaText: diceResultText,
          timestamp: Date.now(),
        };

        dicePanelEffectRuns.setHistoryEffectState(historyIndex, {
          effectStatus: 'planned',
          effectRunId: runId,
          effectResults: [],
          effectError: undefined,
          effectTrace: undefined,
        });
        const plannedSeq = dicePanelEffectRuns.emitEffectRun({
          runId,
          status: 'planned',
          characterName: initiatorName,
          attributeName: attrName,
          historyIndex,
          effectResults: [],
          effectTrace: ['等待确认'],
          chainMode: dicePanelEffectRuns.getSecondaryTriggerMode(preset),
          timestamp: Date.now(),
        });
        dicePanelEffectRuns.setHistoryEffectState(historyIndex, { effectEventSeq: plannedSeq });

        // [新增] 检查是否有需要确认的效果
        const hasConfirmableEffects = matchedOutcome.effects.some(e => e.needsConfirm !== false);

        if (hasConfirmableEffects) {
          // 有需要确认的效果,显示确认弹窗 (异步处理)
          dicePanelEffectConfirm.handleEffectConfirmation(pendingCtx);
          console.info(
            `[DICE] ${matchedOutcome.effects.length} effects pending user confirmation for ${initiatorName}`,
          );
        } else {
          // 所有效果都不需要确认,直接进入待执行队列
          dicePanelEffectRuns.enqueueEffectRun(pendingCtx);
          dicePanelEffectRuns.setHistoryEffectState(historyIndex, {
            effectStatus: 'confirmed',
          });
          const confirmedSeq = dicePanelEffectRuns.emitEffectRun({
            runId,
            status: 'confirmed',
            characterName: initiatorName,
            attributeName: attrName,
            historyIndex,
            effectResults: [],
            effectTrace: ['自动确认，等待提交'],
            chainMode: dicePanelEffectRuns.getSecondaryTriggerMode(preset),
            timestamp: Date.now(),
          });
          dicePanelEffectRuns.setHistoryEffectState(historyIndex, { effectEventSeq: confirmedSeq });
          console.info(`[DICE] Queued ${matchedOutcome.effects.length} auto-execute effects for ${initiatorName}`);
        }
      }

      if (preset.currentAttrAutoUpdate && preset.currentAttrAutoUpdate.enabled !== false) {
        const autoUpdate = preset.currentAttrAutoUpdate;
        const when = autoUpdate.when || 'always';
        const shouldApply =
          when === 'always' || (when === 'success' && isSuccess) || (when === 'failure' && !isSuccess);
        if (shouldApply) {
          const autoContext: Record<string, string | number | boolean> = {
            $roll: rollTotal,
            '$roll.total': rollTotal,
            $attr: attrValue,
            $dc: dc,
            $mod: mod,
            $success: isSuccess ? 1 : 0,
            ...customValues,
          };
          const resolvedExpr = dicePanelExpr.resolveExpressionWithContext(autoUpdate.valueExpr, autoContext);
          const changeValue = dicePanelExpr.parseModifier(resolvedExpr);
          const aliasCandidates = autoUpdate.aliasCandidates || [];
          const resolvedAlias = deps.resolveAttributeAliasName(initiatorName, attrName, aliasCandidates).name;
          const targetAttr = resolvedAlias || attrName;
          const beforeValueRaw = deps.getAttributeValue(initiatorName, attrName, aliasCandidates);
          const beforeValue =
            beforeValueRaw === null || beforeValueRaw === undefined ? (autoUpdate.initValue ?? 0) : beforeValueRaw;

          let previewAfterValue = beforeValue;
          if (autoUpdate.operation === 'add') {
            previewAfterValue = beforeValue + changeValue;
          } else if (autoUpdate.operation === 'subtract') {
            previewAfterValue = beforeValue - changeValue;
          } else {
            previewAfterValue = changeValue;
          }
          const minValue = autoUpdate.min ?? 0;
          const maxValue = autoUpdate.max ?? Infinity;
          previewAfterValue = Math.max(minValue, Math.min(maxValue, previewAfterValue));
          const previewDelta = previewAfterValue - beforeValue;

          const computedAutoEffect: ComputedEffect = {
            effectId: `auto_${autoUpdate.operation}`,
            target: attrName,
            resolvedTarget: targetAttr,
            computedValue: previewDelta,
            rolledValue: changeValue,
            formula: resolvedExpr || '0',
            displayText: `${resolvedExpr || '0'} → ${changeValue}`,
            beforeValue,
            afterValue: previewAfterValue,
            conditionSummary: `命中【${matchedOutcome?.name || outcomeText}】分支后触发自动填表`,
          };

          const confirmed = await new Promise<boolean>(resolve => {
            dicePanelEffectConfirm.showEffectConfirmDialog({
              preset,
              outcomeLabel: `${attrName} 检定: ${matchedOutcome?.name || outcomeText}`,
              branchReasonText,
              effects: [computedAutoEffect],
              onConfirm: () => resolve(true),
              onCancel: () => resolve(false),
            });
          });

          if (confirmed) {
            const updateResult = await deps.updateSingleAttribute(
              initiatorName,
              attrName,
              autoUpdate.operation,
              changeValue,
              {
                initValue: autoUpdate.initValue,
                min: autoUpdate.min,
                max: autoUpdate.max,
                aliasCandidates,
              },
            );
            if (updateResult.success) {
              const finalAttr = updateResult.resolvedAttrName || attrName;
              const delta = updateResult.newValue - updateResult.oldValue;
              const changeLabel =
                String(autoUpdate.changeLabel || '').trim() ||
                (autoUpdate.operation === 'add' ? '增加' : autoUpdate.operation === 'subtract' ? '减少' : '设为');
              const exprRaw = String(resolvedExpr || '').trim();
              const rolledText = String(changeValue);
              const exprNormalized = exprRaw.replace(/\s+/g, '');
              const exprWithRoll =
                exprRaw && exprNormalized !== rolledText ? `${exprRaw}=${rolledText}` : exprRaw || rolledText;

              const settledContext: Record<string, string | number | undefined> = {
                attr: `【${finalAttr}】`,
                attrPlain: finalAttr,
                old: updateResult.oldValue,
                new: updateResult.newValue,
                delta,
                expr: exprRaw || rolledText,
                rolled: changeValue,
                operation: autoUpdate.operation,
                changeLabel,
              };

              const settledTemplate = String(autoUpdate.outputTextTemplate || '').trim();
              const settledLine =
                settledTemplate !== ''
                  ? deps.formatOutputTemplate(settledTemplate, settledContext).trim()
                  : `已填表：${finalAttr}从${updateResult.oldValue}变为${updateResult.newValue}，变化${changeLabel}${exprWithRoll}`;

              const autoRunId = `autoupdate_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
              const injected = dicePanelEffectRuns.injectEffectLinesIntoTextarea(autoRunId, [settledLine]);
              if (!injected) {
                deps.smartInsertToTextarea(settledLine, 'dice');
              }

              // 同步更新当前面板显示（属性输入框 + 快捷属性按钮）
              const currentAttrName = String(panel.find('#dice-attr-name').val() || '').trim();
              if (currentAttrName === attrName || currentAttrName === finalAttr) {
                panel.find('#dice-attr-value').val(String(updateResult.newValue)).trigger('change');
              }
              dicePanelAttrButtons.buildAttrButtons(initiatorName);

              if (window.toastr) {
                window.toastr.success(
                  `已完成填表更新 ${finalAttr}: ${updateResult.oldValue} -> ${updateResult.newValue}`,
                );
              }
            } else if (window.toastr) {
              window.toastr.warning(`自动更新属性失败: ${updateResult.error || '未知错误'}`);
            }
          } else if (window.toastr) {
            window.toastr.info('已取消本次自动填表');
          }
        }
      }

      if (onResult) {
        onResult(checkResult);
      }
    };

    // [新增] 自定义模式掷骰逻辑
    const performCustomRoll = function () {
      const $btn = panel.find('#dice-roll-btn');

      // 读取自定义模式字段
      const diceExpr = panel.find('#custom-dice-expr').val().trim() || '1d100';
      const judgeMode = panel.find('#custom-judge-mode').val() as string;
      const targetValueStr = panel.find('#custom-target-value').val().trim();
      const initiatorName = deps.resolveCanonicalCharacterName(panel.find('#dice-initiator-name').val().trim() || '<user>');
      const attrName = panel.find('#dice-attr-name').val().trim() || '自由检定';

      // 解析目标值
      const expectedValue = calculateDiceExpectedValue(diceExpr);
      const autoTargetValue = Number.isFinite(expectedValue) ? Math.floor(expectedValue) : null;
      const targetValue = targetValueStr !== '' ? parseInt(targetValueStr, 10) : autoTargetValue;
      const hasJudgement = judgeMode !== 'none' && targetValue !== null && !isNaN(targetValue);

      // 执行掷骰 - 使用 rollComplexDiceExpression 支持复合表达式如 2d6+33
      const rollResult = rollComplexDiceExpression(diceExpr);
      if (isNaN(rollResult.total)) {
        if (window.toastr)
          showActionableErrorToast(`骰子语法错误: ${diceExpr}`, {
            suggestion: '请检查骰子输入框或当前预设公式，只使用形如 1d100、2d6+3 的合法写法。',
          });
        return;
      }

      const rollTotal = rollResult.total;

      // 判定结果
      let isSuccess = false;
      let judgeResultText = '';

      if (hasJudgement) {
        switch (judgeMode) {
          case '>=':
            isSuccess = rollTotal >= targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          case '<=':
            isSuccess = rollTotal <= targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          case '>':
            isSuccess = rollTotal > targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          case '<':
            isSuccess = rollTotal < targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          default:
            judgeResultText = '';
        }
      }

      // 生成输出文本 - 使用与内置预设一致的 meta 标签格式
      const displayInitiator = deps.replaceUserPlaceholders(initiatorName);
      const displayAttrName = attrName || '自由检定';
      let outputText: string;

      if (hasJudgement) {
        const conditionExpr = `${rollTotal} ${judgeMode} ${targetValue}`;
        const judgeResultCN = isSuccess ? '成立' : '不成立';
        outputText = `<meta:检定结果>\n元叙事：${displayInitiator} 发起了 【${displayAttrName}】 检定，${diceExpr}=${rollTotal}，判定 ${conditionExpr}？${judgeResultCN}，判定为【${judgeResultText}】\n</meta:检定结果>`;
      } else {
        // 无判定模式
        outputText = `<meta:检定结果>\n元叙事：${displayInitiator} 发起了 【${displayAttrName}】 检定，${diceExpr}=${rollTotal}\n</meta:检定结果>`;
      }

      // 插入到输入框
      deps.smartInsertToTextarea(outputText, 'dice');

      // 生成结果显示
      const badgeClass = hasJudgement
        ? isSuccess
          ? 'acu-dice-result-badge success'
          : 'acu-dice-result-badge failure'
        : '';
      const diceCfg = deps.getDiceConfig();
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const displayValue = hideDiceResultFromUser ? '？？' : rollTotal;
      const displayOutcome = hideDiceResultFromUser ? '' : judgeResultText;

      // 更新按钮显示结果
      $btn.html(`
        <div class="acu-dice-result-display">
          <span class="acu-dice-result-value">${displayValue}</span>
          ${hasJudgement && displayOutcome ? `<span class="${badgeClass}">${displayOutcome}</span>` : ''}
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮
      $btn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        performCustomRoll();
      });

      // 构建检定结果对象
      const checkResult: AcuDice.CheckResult = {
        success: isSuccess,
        total: rollTotal,
        target: targetValue ?? 0,
        outcomeText: judgeResultText,
        attrName,
        criteria: 'custom',
        isAutoTarget: false,
        formula: diceExpr,
      };

      // 添加到历史记录
      const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkResultWithTimestamp = {
        ...checkResult,
        timestamp: Date.now(),
        detailId,
        initiatorName,
        historyType: 'check' as const,
        detailLines: [
          `发起者: ${initiatorName}`,
          `属性: ${attrName}`,
          `公式: ${diceExpr}`,
          `掷骰: ${rollTotal}`,
          hasJudgement ? `判定: ${rollTotal} ${judgeMode} ${targetValue}` : '判定: 无',
          hasJudgement ? `结果: ${judgeResultText}` : '结果: 仅掷骰',
        ],
      };
      deps.getCheckHistory().push(checkResultWithTimestamp);
      if (deps.getCheckHistory().length > deps.getMAX_HISTORY()) {
        deps.getCheckHistory().shift();
      }

      // 触发事件
      deps.emitEvent('check', checkResultWithTimestamp);

      if (onResult) {
        onResult(checkResult);
      }
    };

    let lastDiceRollAt = 0;
    // 投骰逻辑函数（可被按钮点击和重投按钮调用）
    const performDiceRoll = function () {
      const $btn = panel.find('#dice-roll-btn');
      const now = Date.now();
      if (now - lastDiceRollAt < 100) return;
      lastDiceRollAt = now;
      if ($btn.prop('disabled')) return;

      // 锁定按钮防止连点
      $btn.prop('disabled', true).addClass('disabled');
      setTimeout(() => {
        $btn.prop('disabled', false).removeClass('disabled');
      }, 100);

      // [新增] 如果使用高级预设,调用专用检定函数
      if (currentAdvancedPreset) {
        performAdvancedCheck();
        return;
      }

      // [新增] 如果处于自定义模式,使用自定义掷骰逻辑
      if (panel.find('#acu-dice-custom-mode-fields').is(':visible')) {
        performCustomRoll();
        return;
      }

      const formula = panel.find('#dice-formula').val().trim() || '1d100';
      const modStr = panel.find('#dice-modifier').val().trim() || '0';
      const mod = dicePanelExpr.parseModifier(modStr);
      const attrName = panel.find('#dice-attr-name').val().trim() || '自由检定';
      const criteria = panel.find('#dice-success-criteria').val() || 'lte';
      const difficulty = panel.find('#dice-difficulty').val() || 'normal';

      // 判断规则类型
      const isDND = criteria === 'gte';

      // 获取骰子配置（根据规则类型读取不同配置）
      const diceCfg = deps.getDiceConfig();
      const hardDiv = diceCfg.difficultSuccessDiv || 2;
      const extremeDiv = diceCfg.hardSuccessDiv || 5;
      // COC: 大成功 ≤ critSuccessMax, 大失败 ≥ critFailMin
      // DND: 大成功 ≥ dndCritSuccess, 大失败 ≤ dndCritFail
      const critSuccessMax = isDND ? diceCfg.dndCritFail || 1 : diceCfg.critSuccessMax || 5;
      const critFailMin = isDND ? diceCfg.dndCritSuccess || 20 : diceCfg.critFailMin || 96;

      // 目标值计算（COC 和 DND 不同）
      let targetInputVal = panel.find('#dice-target').val().trim();
      let attrInputVal = panel.find('#dice-attr-value').val().trim();
      let attrValue = attrInputVal !== '' ? parseInt(attrInputVal, 10) : 0;
      let target;
      let isAutoTarget = false;

      // 辅助函数：根据骰子公式计算最大值的一半
      const getDefaultTarget = formulaStr => {
        const match = formulaStr.match(/(\d+)d(\d+)/i);
        if (match) {
          const maxRoll = parseInt(match[1], 10) * parseInt(match[2], 10);
          return Math.round(maxRoll / 2);
        }
        return 50;
      };

      if (targetInputVal !== '') {
        // 用户手动输入了目标值/DC
        const parsedTarget = parseInt(targetInputVal, 10);
        target = !Number.isNaN(parsedTarget) ? parsedTarget : getDefaultTarget(formula);
      } else if (isDND) {
        // DND 模式：留空时 DC = 10（中等难度）
        target = 10;
        isAutoTarget = true;
      } else {
        // COC 模式：留空时目标值 = 属性值，若属性值也空则取骰子最大值的一半
        if (attrValue > 0) {
          target = attrValue;
          isAutoTarget = true;
        } else {
          target = getDefaultTarget(formula);
          isAutoTarget = true;
        }
      }

      const result = dicePanelExpr.rollDice(formula);
      const finalValue = result.total + mod;

      // 根据规则和难度等级计算
      let requiredTarget = target;
      let difficultyLabel = '';
      let difficultyDiv = 1;

      // DND 模式忽略难度等级
      if (!isDND) {
        switch (difficulty) {
          case 'hard':
            requiredTarget = Math.floor(target / hardDiv);
            difficultyLabel = '困难';
            difficultyDiv = hardDiv;
            break;
          case 'extreme':
            requiredTarget = Math.floor(target / extremeDiv);
            difficultyLabel = '极难';
            difficultyDiv = extremeDiv;
            break;
          case 'critical':
            requiredTarget = critSuccessMax;
            difficultyLabel = '大成功';
            break;
          default:
            difficultyLabel = '';
            break;
        }
      }

      // 判定结果
      let isCritSuccess = false;
      let isCritFailure = false;
      let isSuccess = false;
      let outcomeText = '';
      let outcomeClass = '';

      // 大成功/大失败判定（最高优先级）
      if (isDND) {
        // DND: 大成功 ≥ 20，大失败 ≤ 1
        isCritSuccess = finalValue >= critFailMin; // 复用 critFailMin 作为 DND 大成功阈值
        isCritFailure = finalValue <= critSuccessMax; // 复用 critSuccessMax 作为 DND 大失败阈值
      } else {
        // COC: 大成功 ≤ 5，大失败 ≥ 96
        isCritSuccess = finalValue <= critSuccessMax;
        isCritFailure = finalValue >= critFailMin;
      }

      // 根据规则判断成功/失败
      if (isDND) {
        isSuccess = finalValue >= requiredTarget;
      } else {
        isSuccess = finalValue <= requiredTarget;
      }

      // 确定最终结果文本
      if (isCritSuccess) {
        outcomeText = '大成功！';
        outcomeClass = 'success';
        isSuccess = true;
      } else if (isCritFailure) {
        outcomeText = '大失败！';
        outcomeClass = 'failure';
        isSuccess = false;
      } else if (isSuccess) {
        if (isDND) {
          outcomeText = '成功';
        } else if (difficulty === 'hard') {
          outcomeText = '困难成功';
        } else if (difficulty === 'extreme') {
          outcomeText = '极难成功';
        } else {
          // 普通难度下，检查是否达成更高成就
          const extremeTarget = Math.floor(target / extremeDiv);
          const hardTarget = Math.floor(target / hardDiv);
          if (finalValue <= extremeTarget) {
            outcomeText = '极难成功';
          } else if (finalValue <= hardTarget) {
            outcomeText = '困难成功';
          } else {
            outcomeText = '成功';
          }
        }
        outcomeClass = 'success';
      } else {
        outcomeText = '失败';
        outcomeClass = 'failure';
      }

      const criteriaSymbol = isDND ? '≥' : '≤';
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const displayValue = hideDiceResultFromUser ? '？？' : finalValue;
      const displayOutcomeText = hideDiceResultFromUser ? '' : outcomeText;

      // 确定结果类型和样式
      let resultType;
      if (isCritSuccess) {
        resultType = 'critSuccess';
      } else if (isCritFailure) {
        resultType = 'critFailure';
      } else if (isSuccess) {
        if (difficulty === 'extreme' || (difficulty === 'normal' && finalValue <= Math.floor(target / extremeDiv))) {
          resultType = 'extremeSuccess';
        } else if (difficulty === 'hard' || (difficulty === 'normal' && finalValue <= Math.floor(target / hardDiv))) {
          resultType = 'success';
        } else {
          resultType = 'warning';
        }
      } else {
        resultType = 'failure';
      }

      const badgeClass = deps.getResultBadgeClass(resultType);

      // 构建显示用的条件表达式（隐藏时为空）
      const displayConditionExpr = hideDiceResultFromUser ? '' : conditionExpr;

      // 将按钮内容替换为结果显示（居中布局，旋转箭头在结果后面）
      const $rollBtn = panel.find('#dice-roll-btn');
      $rollBtn.html(`
        <div class="acu-dice-result-display">
          <span class="acu-dice-result-value">${displayValue}</span>
          ${displayConditionExpr ? `<span class="acu-dice-result-target">${displayConditionExpr}</span>` : ''}
          ${displayOutcomeText ? `<span class="${badgeClass}">${displayOutcomeText}</span>` : ''}
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮点击事件（使用事件委托，因为按钮内容会动态更新）
      $rollBtn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        // 直接调用投骰逻辑函数
        performDiceRoll();
      });

      // 生成 Prompt 文本
      const initiatorName = deps.resolveCanonicalCharacterName(panel.find('#dice-initiator-name').val().trim() || '<user>');

      // 构建简单条件表达式（用于界面显示）
      let conditionExpr = '';
      if (isCritSuccess) {
        if (isDND) {
          conditionExpr = `${finalValue}≥${critFailMin}`;
        } else {
          conditionExpr = `${finalValue}≤${critSuccessMax}`;
        }
      } else if (isCritFailure) {
        if (isDND) {
          conditionExpr = `${finalValue}≤${critSuccessMax}`;
        } else {
          conditionExpr = `${finalValue}≥${critFailMin}`;
        }
      } else if (isDND) {
        conditionExpr = `${finalValue}≥${requiredTarget}`;
      } else {
        conditionExpr = `${finalValue}≤${requiredTarget}`;
      }

      // 构建详细判定表达式（用于输出文本）
      let judgeExpr = '';
      if (isCritSuccess) {
        if (isDND) {
          judgeExpr = `${finalValue}≥${critFailMin}`;
        } else {
          judgeExpr = `${finalValue}≤${critSuccessMax}`;
        }
      } else if (isCritFailure) {
        if (isDND) {
          judgeExpr = `${finalValue}≤${critSuccessMax}`;
        } else {
          judgeExpr = `${finalValue}≥${critFailMin}`;
        }
      } else if (isDND) {
        // DND 模式
        if (isSuccess) {
          judgeExpr = `需${criteriaSymbol}${requiredTarget}，${finalValue}≥${requiredTarget}`;
        } else {
          judgeExpr = `需${criteriaSymbol}${requiredTarget}，${finalValue}<${requiredTarget}`;
        }
      } else if (difficulty === 'critical') {
        // COC 难度设为大成功但没达成
        judgeExpr = `需≤${critSuccessMax}，${finalValue}>${critSuccessMax}`;
      } else if (difficulty !== 'normal') {
        // COC 困难或极难
        if (isSuccess) {
          judgeExpr = `需≤${target}/${difficultyDiv}，${finalValue}≤${requiredTarget}`;
        } else {
          judgeExpr = `需≤${target}/${difficultyDiv}，${finalValue}>${requiredTarget}`;
        }
      } else {
        // COC 普通难度
        if (isSuccess) {
          const extremeTarget = Math.floor(target / extremeDiv);
          const hardTarget = Math.floor(target / hardDiv);
          if (finalValue <= extremeTarget) {
            judgeExpr = `需≤${target}，${finalValue}≤${target}/${extremeDiv}`;
          } else if (finalValue <= hardTarget) {
            judgeExpr = `需≤${target}，${finalValue}≤${target}/${hardDiv}`;
          } else {
            judgeExpr = `需≤${target}，${finalValue}≤${target}`;
          }
        } else {
          judgeExpr = `需≤${target}，${finalValue}>${target}`;
        }
      }

      // 构建统一格式的检定结果文本
      const metaContent = `元叙事：${initiatorName}发起了【${attrName}】检定，掷出${finalValue}，${judgeExpr}，【${outcomeText}】`;
      const diceResultText = `<meta:检定结果>\n${metaContent}\n</meta:检定结果>`;
      deps.smartInsertToTextarea(diceResultText, 'dice');

      // 构建检定结果对象
      const checkResult: AcuDice.CheckResult = {
        success: isSuccess,
        total: finalValue,
        target,
        outcomeText,
        attrName,
        criteria,
        isAutoTarget,
        formula,
      };

      // 添加到历史记录
      const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkResultWithTimestamp = {
        ...checkResult,
        timestamp: Date.now(),
        detailId,
        initiatorName,
        historyType: 'check' as const,
        detailLines: [
          `发起者: ${initiatorName}`,
          `属性: ${attrName}`,
          `公式: ${formula}`,
          `掷骰+修正: ${result.total} ${mod >= 0 ? '+' : ''}${mod} = ${finalValue}`,
          `目标: ${requiredTarget} (${isAutoTarget ? '自动计算' : '手动输入'})`,
          `成功标准: ${criteria === 'gte' ? '>=' : '<='}${requiredTarget}`,
          difficultyLabel ? `难度: ${difficultyLabel}` : '难度: 普通',
          `判定详情: ${judgeExpr}`,
          `结果: ${outcomeText}`,
        ],
      };
      deps.getCheckHistory().push(checkResultWithTimestamp);
      if (deps.getCheckHistory().length > deps.getMAX_HISTORY()) {
        deps.getCheckHistory().shift();
      }

      // 触发事件
      deps.emitEvent('check', checkResultWithTimestamp);

      if (onResult) {
        onResult(checkResult);
      }
    };

    // 绑定按钮点击事件
    panel.find('#dice-roll-btn').click(function () {
      performDiceRoll();
    });

    // 切换到对抗检定（标题栏图标）
    panel.find('#dice-switch-contest-top').click(function () {
      const targetInput = panel.find('#dice-target').val().trim();
      const attrValueInput = panel.find('#dice-attr-value').val().trim();
      const currentDice = panel.find('#dice-formula').val() || '1d100';
      const initiatorNameVal = panel.find('#dice-initiator-name').val().trim();
      closePanel();
      deps.showContestPanel({
        // 只有用户实际输入了非默认值才传递，否则留空让 placeholder 生效
        initiatorName: initiatorNameVal && initiatorNameVal !== '<user>' ? initiatorNameVal : '',
        initiatorValue: attrValueInput !== '' ? parseInt(attrValueInput, 10) : undefined,
        diceType: currentDice,
      });
    });
    panel.find('#dice-history-btn').click(function (e) {
      e.stopPropagation();
      deps.showGlobalDiceHistoryDialog();
    });
    // 关闭
    const closePanel = () => {
      overlay.remove();
      panel.remove();
    };
    panel.on('click', e => {
      e.stopPropagation();
    });
    overlay.click(closePanel);
    panel.find('.acu-dice-close').click(closePanel);
    // 齿轮设置按钮点击 - 调用高级检定管理
    panel.find('.acu-dice-config-btn').click(function (e) {
      e.stopPropagation();
      deps.showAdvancedPresetManager({ fromDicePanel: true });
    });
  };
  return showDicePanel;
}
