/**
 * contest / perform-contest-roll.ts — 对抗投骰主流程（高级预设判定；从 show-contest-panel.ts 拆出，x8-d）。
 */
import { rollComplexDiceExpression } from '../dice-engine';
import { renderDiceResultEffect } from '../panel/render-result-effect';
import { showActionableErrorToast } from '../../../shared/actionable-error-toast';
import type { OutcomeLevel } from '../../../shared/advanced-preset-types';

export function createPerformContestRoll(ctx: any) {
  const { deps, $, getPanel, getCurrentContestAdvancedPreset, performCustomContestRoll, resolveContest } = ctx;

  let lastContestRollAt = 0;

  const performContestRoll = function () {
    const $btn = getPanel().find('#contest-roll-btn');
    const $row = getPanel().find('.acu-contest-result-row');
    const now = Date.now();
    if (now - lastContestRollAt < 100) return;
    lastContestRollAt = now;

    // 锁定按钮和结果行防止连点
    if ($btn.prop('disabled') || $row.hasClass('disabled')) return;

    const lockUI = () => {
      $btn.prop('disabled', true).addClass('disabled');
      $row.addClass('disabled').css('pointer-events', 'none');
    };
    const unlockUI = () => {
      $btn.prop('disabled', false).removeClass('disabled');
      $row.removeClass('disabled').css('pointer-events', '');
    };

    lockUI();
    setTimeout(unlockUI, 100);

    // [修复] 如果处于自定义模式,使用自定义对抗掷骰逻辑
    // 检查骰子语法行是否可见来判断是否为自定义模式
    if (getPanel().find('#contest-init-dice-syntax-row').is(':visible')) {
      performCustomContestRoll();
      return;
    }

    var formula = getPanel().find('#contest-dice-type').val() || '1d100';
    const activePreset = getCurrentContestAdvancedPreset() || deps.AdvancedDicePresetManager.getActivePreset();
    const hasAdvancedPreset =
      !!activePreset &&
      'outcomes' in activePreset &&
      Array.isArray(activePreset.outcomes) &&
      activePreset.outcomes.length > 0;

    try {
      const rawDataForAlias = deps.getCachedRawData() || deps.getTableData();
      if (rawDataForAlias) {
        deps.NameAliasRegistry.rebuild(deps.processJsonData(rawDataForAlias || {}));
      }
    } catch (error) {
      console.warn('[DICE] 对抗别名映射刷新失败:', error);
    }

    var initNameRaw = (getPanel().find('#contest-init-display').val() || '').toString().trim() || '<user>';
    var initName = deps.resolveCanonicalCharacterName(initNameRaw);
    var initAttrName = (getPanel().find('#contest-init-name').val() || '').toString().trim() || '自由检定';
    // 辅助函数：根据骰子公式计算最大值的一半
    var getHalfMax = function (formulaStr: any) {
      var m = formulaStr.match(/(\d+)d(\d+)/i);
      if (m) return Math.round((parseInt(m[1], 10) * parseInt(m[2], 10)) / 2);
      return 50;
    };
    const resolveDefaultValue = function (
      defaultValue: number | string | undefined,
      context: Record<string, number>,
    ): number {
      if (defaultValue === undefined) return 0;
      if (typeof defaultValue === 'number') return defaultValue;
      const result = deps.evaluateFormula(defaultValue, context);
      if (result === 0 && defaultValue !== '0' && String(defaultValue) !== '0') {
        if (window.toastr) {
          window.toastr.warning(`表达式 "${defaultValue}" 求值失败,使用默认值 0`);
        }
      }
      return result || 0;
    };

    // 解析修正值，支持纯数字和骰子表达式
    const parseModifier = function (modStr: string): number {
      if (!modStr || modStr.trim() === '') return 0;
      const trimmed = modStr.trim();

      // 尝试直接解析为数字
      const numValue = parseFloat(trimmed);
      if (!isNaN(numValue) && isFinite(numValue) && trimmed.match(/^-?\d+(\.\d+)?$/)) {
        return numValue;
      }

      const rollResult = rollComplexDiceExpression(trimmed);
      if (!Number.isNaN(rollResult.total)) return rollResult.total;
      return 0;
    };

    var initValueInput = (getPanel().find('#contest-init-value').val() || '').toString().trim();
    var initValue;
    if (initValueInput === '') {
      // 属性值留空：高级预设使用默认值，否则使用骰子最大值的一半
      if (hasAdvancedPreset && activePreset && 'attribute' in activePreset) {
        initValue = resolveDefaultValue(activePreset.attribute?.defaultValue, {});
      } else {
        initValue = getHalfMax(formula);
      }
    } else {
      initValue = parseInt(initValueInput, 10) || getHalfMax(formula);
    }
    var initTargetInput = (getPanel().find('#contest-init-target').val() || '').toString().trim();
    var initTarget;
    if (initTargetInput !== '') {
      initTarget = parseInt(initTargetInput, 10);
    } else {
      // 目标值留空：高级预设使用默认值，否则使用属性值（若属性值也是默认的，则两者相等）
      if (hasAdvancedPreset && activePreset && 'dc' in activePreset) {
        initTarget = resolveDefaultValue(activePreset.dc?.defaultValue, { $attr: initValue });
      } else {
        initTarget = initValue;
      }
    }

    var oppNameRaw = (getPanel().find('#contest-opponent-display').val() || '').toString().trim() || '对手';
    var oppName = deps.resolveCanonicalCharacterName(oppNameRaw);
    var oppAttrName = (getPanel().find('#contest-opp-name').val() || '').toString().trim() || initAttrName;
    var oppValueInput = (getPanel().find('#contest-opp-value').val() || '').toString().trim();
    var oppValue;
    if (oppValueInput === '') {
      // 属性值留空：高级预设使用默认值，否则使用骰子最大值的一半
      if (hasAdvancedPreset && activePreset && 'attribute' in activePreset) {
        oppValue = resolveDefaultValue(activePreset.attribute?.defaultValue, {});
      } else {
        oppValue = getHalfMax(formula);
      }
    } else {
      oppValue = parseInt(oppValueInput, 10) || getHalfMax(formula);
    }
    var oppTargetInput = (getPanel().find('#contest-opp-target').val() || '').toString().trim();
    var oppTarget;
    if (oppTargetInput !== '') {
      oppTarget = parseInt(oppTargetInput, 10);
    } else {
      // 目标值留空：高级预设使用默认值，否则使用属性值
      if (hasAdvancedPreset && activePreset && 'dc' in activePreset) {
        oppTarget = resolveDefaultValue(activePreset.dc?.defaultValue, { $attr: oppValue });
      } else {
        oppTarget = oppValue;
      }
    }

    var initModInput = (getPanel().find('#contest-init-mod').val() || '').toString().trim();
    var oppModInput = (getPanel().find('#contest-opp-mod').val() || '').toString().trim();
    var initSkillModInput = (getPanel().find('#contest-init-skill-mod').val() || '').toString().trim();
    var oppSkillModInput = (getPanel().find('#contest-opp-skill-mod').val() || '').toString().trim();
    var initMod = initModInput !== '' ? parseModifier(initModInput) : 0;
    var oppMod = oppModInput !== '' ? parseModifier(oppModInput) : 0;

    // 解析技能加值（若预设启用 skillMod）
    var initSkillMod = 0;
    var oppSkillMod = 0;

    const allPresets = deps.AdvancedDicePresetManager.getAllPresets();
    const fallbackPresetId = /d100/i.test(formula) ? 'coc7_check' : 'dnd5e_check';
    const fallbackPreset = allPresets.find((p: any) => p.id === fallbackPresetId);
    const preset =
      activePreset &&
      'outcomes' in activePreset &&
      Array.isArray(activePreset.outcomes) &&
      activePreset.outcomes.length > 0
        ? activePreset
        : fallbackPreset;

    if (!preset || !Array.isArray(preset.outcomes) || preset.outcomes.length === 0) {
      console.warn('[DICE] 对抗检定未找到可用预设或 outcomes');
      return;
    }

    if (preset.mod?.hidden) {
      initMod = 0;
      oppMod = 0;
    }

    if (preset.dc?.hidden) {
      initTarget = resolveDefaultValue(preset.dc?.defaultValue, { $attr: initValue });
      oppTarget = resolveDefaultValue(preset.dc?.defaultValue, { $attr: oppValue });
    }

    const hideSkillModInContest =
      !preset.skillMod || preset.contestRule?.hideSkillMod === true || preset.skillMod.hidden === true;
    if (!hideSkillModInContest && preset.skillMod) {
      if (initSkillModInput !== '') {
        initSkillMod = parseModifier(initSkillModInput);
      } else {
        initSkillMod = resolveDefaultValue(preset.skillMod.defaultValue, { $attr: initValue });
      }

      if (oppSkillModInput !== '') {
        oppSkillMod = parseModifier(oppSkillModInput);
      } else {
        oppSkillMod = resolveDefaultValue(preset.skillMod.defaultValue, { $attr: oppValue });
      }
    }

    // [新增] 收集双方的 customFields
    const collectContestCustomFields = (party: 'init' | 'opp'): Record<string, number | string | boolean> => {
      const customValues: Record<string, number | string | boolean> = {};
      if (!('customFields' in preset) || !Array.isArray(preset.customFields) || preset.customFields.length === 0) {
        return customValues;
      }

      const $customFields = getPanel().find(`.acu-dice-custom-field-contest[data-party="${party}"]`);
      $customFields.each(function (this: any) {
        const $el = $(this);
        const id = $el.data('id');
        const fieldConfig = preset.customFields.find((f: any) => f.id === id);
        if (!fieldConfig) return;

        let val: string | number | boolean;
        if (fieldConfig.type === 'toggle') {
          val = $el.prop('checked');
        } else if (fieldConfig.type === 'number') {
          const num = parseFloat($el.val() as string);
          val = isNaN(num) ? (fieldConfig.defaultValue as number) : num;
        } else if (fieldConfig.type === 'select') {
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
        customValues['$' + id] = val;
      });
      return customValues;
    };

    // [新增] 计算派生变量
    const computeDerivedVars = (
      customValues: Record<string, number | string | boolean>,
      attrValue: number,
      modValue: number,
      dcValue: number,
    ): Record<string, number> => {
      const derivedValues: Record<string, number> = {};
      if (!('derivedVars' in preset) || !Array.isArray(preset.derivedVars) || preset.derivedVars.length === 0) {
        return derivedValues;
      }

      const baseContext = {
        $attr: attrValue,
        $dc: dcValue,
        $mod: modValue,
        ...customValues,
      };

      preset.derivedVars.forEach((spec: any) => {
        const id = spec?.id?.trim();
        if (!id) return;
        const varName = id.startsWith('$') ? id : `$${id}`;
        const evalResult = deps.evaluateCondition(spec.expr, { ...baseContext, ...derivedValues });
        if (!evalResult.success) {
          console.warn(`[DICE] 对抗检定派生变量 ${varName} 计算失败:`, evalResult.error);
          derivedValues[varName] = 0;
          return;
        }
        const rawValue = evalResult.value;
        const numericValue = typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
        derivedValues[varName] = numericValue;
      });
      return derivedValues;
    };

    // [新增] 应用 dicePatches
    const applyDicePatches = (
      baseFormula: string,
      customValues: Record<string, number | string | boolean>,
      derivedValues: Record<string, number>,
      attrValue: number,
      modValue: number,
      dcValue: number,
    ): string => {
      if (!('dicePatches' in preset) || !Array.isArray(preset.dicePatches) || preset.dicePatches.length === 0) {
        return baseFormula;
      }

      const patchContext = {
        $attr: attrValue,
        $dc: dcValue,
        $mod: modValue,
        ...customValues,
        ...derivedValues,
      };

      const replacePatchTemplate = (template: string): string => {
        const varPattern = /\$[a-zA-Z_]\w*/g;
        return template.replace(varPattern, match => {
          const value = (patchContext as Record<string, any>)[match];
          return typeof value === 'number' && Number.isFinite(value) ? String(value) : '0';
        });
      };

      let diceExpression = baseFormula;
      preset.dicePatches.forEach((patch: any) => {
        if (!patch) return;
        if (patch.when) {
          const conditionResult = deps.evaluateCondition(patch.when, patchContext);
          if (!conditionResult.success) {
            console.warn('[DICE] 对抗检定 dicePatches 条件评估失败:', conditionResult.error);
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
      return diceExpression;
    };

    // 收集发起方 customFields 并计算公式
    const initCustomValues = collectContestCustomFields('init');
    const initDerivedValues = computeDerivedVars(initCustomValues, initValue, initMod, initTarget);
    const initFormula = applyDicePatches(
      formula,
      initCustomValues,
      initDerivedValues,
      initValue,
      initMod,
      initTarget,
    );

    // 收集对抗方 customFields 并计算公式
    const oppCustomValues = collectContestCustomFields('opp');
    const oppDerivedValues = computeDerivedVars(oppCustomValues, oppValue, oppMod, oppTarget);
    const oppFormula = applyDicePatches(formula, oppCustomValues, oppDerivedValues, oppValue, oppMod, oppTarget);

    // 投骰（使用各自的公式）
    const initResult = rollComplexDiceExpression(initFormula);
    const oppResult = rollComplexDiceExpression(oppFormula);
    if (Number.isNaN(initResult.total) || Number.isNaN(oppResult.total)) {
      const errorFormula = Number.isNaN(initResult.total) ? initFormula : oppFormula;
      console.warn('[DICE] 对抗检定骰子语法错误:', errorFormula);
      if (window.toastr)
        showActionableErrorToast(`骰子语法错误: ${errorFormula}`, {
          suggestion: '请检查对抗检定预设公式，只使用形如 1d100、2d6+3 的合法写法。',
        });
      return;
    }
    const initRollTotal = initResult.total;
    const oppRollTotal = oppResult.total;

    console.log('[DICE] 对抗检定公式 - 发起方:', initFormula, '对抗方:', oppFormula);

    // 计算 attrMod（如果预设有 computeModifier）
    let initAttrMod = 0;
    let oppAttrMod = 0;
    if ('attribute' in preset && preset.attribute?.computeModifier) {
      const modFormula = preset.attribute.computeModifier;
      initAttrMod = deps.evaluateConditionNumber(modFormula, { $attr: initValue }, 0);
      oppAttrMod = deps.evaluateConditionNumber(modFormula, { $attr: oppValue }, 0);
    }

    const initContext = {
      $roll: initResult,
      $attr: initValue,
      $attrMod: initAttrMod,
      $skillMod: initSkillMod,
      $dc: initTarget,
      $mod: initMod,
      ...initCustomValues,
      ...initDerivedValues,
    };
    const oppContext = {
      $roll: oppResult,
      $attr: oppValue,
      $attrMod: oppAttrMod,
      $skillMod: oppSkillMod,
      $dc: oppTarget,
      $mod: oppMod,
      ...oppCustomValues,
      ...oppDerivedValues,
    };

    const initOutcomeResult = deps.applyAdvancedPresetOutcomePolicy(
      preset,
      deps.evaluateOutcomes(preset.outcomes, initContext),
      initContext,
    );
    const oppOutcomeResult = deps.applyAdvancedPresetOutcomePolicy(
      preset,
      deps.evaluateOutcomes(preset.outcomes, oppContext),
      oppContext,
    );
    const initOutcome = initOutcomeResult.outcome;
    const oppOutcome = oppOutcomeResult.outcome;
    const winnerSide = resolveContest(
      preset,
      initOutcome,
      oppOutcome,
      initRollTotal + initAttrMod + initSkillMod + initMod,
      oppRollTotal + oppAttrMod + oppSkillMod + oppMod,
      initValue,
      oppValue,
    );

    let winnerText = '平局';
    let winnerResultType = 'warning';
    if (winnerSide === 'initiator') {
      winnerText = initName + ' 胜利';
      winnerResultType = 'success';
    } else if (winnerSide === 'opponent') {
      winnerText = oppName + ' 胜利';
      winnerResultType = 'failure';
    }

    var diceCfg = deps.getDiceConfig();
    var hideDiceResultFromUser =
      diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
    var displayInitValue = hideDiceResultFromUser ? '？？' : initRollTotal;
    var displayOppValue = hideDiceResultFromUser ? '？？' : oppRollTotal;
    var displayInitSuccessName = hideDiceResultFromUser ? '' : initOutcome.name;
    var displayOppSuccessName = hideDiceResultFromUser ? '' : oppOutcome.name;
    var displayWinner = hideDiceResultFromUser ? '' : winnerText;

    const getResultTypeFromOutcome = (outcome: OutcomeLevel) => {
      if (outcome.priority <= 10) return 'critSuccess';
      if (outcome.priority <= 30) return 'extremeSuccess';
      if (outcome.priority < 50) return 'success';
      if (outcome.priority === 50) return 'warning';
      if (outcome.priority < 90) return 'failure';
      return 'critFailure';
    };

    const initResultType = getResultTypeFromOutcome(initOutcome);
    const oppResultType = getResultTypeFromOutcome(oppOutcome);

    const initBadgeClass = deps.getResultBadgeClass(initResultType);
    const oppBadgeClass = deps.getResultBadgeClass(oppResultType);
    // 胜者文字颜色类名
    const winnerColorClass =
      winnerResultType === 'success'
        ? 'acu-contest-winner-success'
        : winnerResultType === 'warning'
          ? 'acu-contest-winner-warning'
          : 'acu-contest-winner-failure';

    // 显示结果展示区域
    const $resultDisplay = getPanel().find('#contest-result-display');
    const $resultInit = getPanel().find('#contest-result-init');
    const $resultOpp = getPanel().find('#contest-result-opp');

    // 显示发起方结果
    $resultInit.html(
      '<span class="acu-contest-result-name">' +
        deps.escapeHtml(initName) +
        '</span>' +
        '<span class="acu-contest-result-value">' +
        displayInitValue +
        '</span>' +
        (displayInitSuccessName ? '<span class="' + initBadgeClass + '">' + displayInitSuccessName + '</span>' : ''),
    );

    // 显示对抗方结果
    $resultOpp.html(
      (displayOppSuccessName ? '<span class="' + oppBadgeClass + '">' + displayOppSuccessName + '</span>' : '') +
        '<span class="acu-contest-result-value">' +
        displayOppValue +
        '</span>' +
        '<span class="acu-contest-result-name">' +
        deps.escapeHtml(oppName) +
        '</span>',
    );

    // 将结果显示区域改为两行布局：第一行显示双方信息，第二行显示最终结果和重roll按钮
    $resultDisplay.html(
      '<div class="acu-contest-result-container" title="点击重新投骰">' +
        // 第一行：双方名字、点数、检定结果
        '<div class="acu-contest-result-row">' +
        '<div class="acu-contest-result-inner">' +
        '<div id="contest-result-init" class="acu-contest-result-side">' +
        '<span class="acu-contest-result-name">' +
        deps.escapeHtml(initName) +
        '</span>' +
        '<span class="acu-contest-result-value">' +
        displayInitValue +
        '</span>' +
        (displayInitSuccessName ? '<span class="' + initBadgeClass + '">' + displayInitSuccessName + '</span>' : '') +
        '</div>' +
        '<span class="acu-contest-vs">VS</span>' +
        '<div id="contest-result-opp" class="acu-contest-result-side right">' +
        (displayOppSuccessName ? '<span class="' + oppBadgeClass + '">' + displayOppSuccessName + '</span>' : '') +
        '<span class="acu-contest-result-value">' +
        displayOppValue +
        '</span>' +
        '<span class="acu-contest-result-name">' +
        deps.escapeHtml(oppName) +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        // 第二行：最终结果 + 重roll箭头
        '<div class="acu-contest-result-winner-row">' +
        '<span class="acu-contest-winner-text ' +
        winnerColorClass +
        '">' +
        displayWinner +
        '</span>' +
        '<i class="fa-solid fa-rotate-right acu-contest-reroll-icon"></i>' +
        '</div>' +
        '</div>',
    );
    $resultDisplay.show();
    // [b13.6.6] 结果出现后滚动到可见（对抗检定）
    try { setTimeout(function () { try { var _pe1: any = document.getElementById('dnd-detail-popup-el'); if (!_pe1 || !_pe1.contains($resultDisplay[0])) return; var _pr1 = _pe1.getBoundingClientRect(); var _tr1 = ($resultDisplay[0] as any).getBoundingClientRect(); if (_tr1.bottom > _pr1.bottom - 12) { _pe1.scrollTop += (_tr1.bottom - (_pr1.bottom - 12)); } } catch (eS1) {} }, 150); } catch (eS1b) {}
    // [b13.6.5] 结果特效卡（对抗检定，胜者高亮显示）
    try {
      var _cw = String(displayInitValue != null ? displayInitValue : '');
      var _ow = String(displayOppValue != null ? displayOppValue : '');
      var _wl = String(displayWinner || '');
      var _isOppWin = _wl.indexOf('对手') >= 0;
      var _kind3 = 'normal';
      if (!hideDiceResultFromUser && _wl) { _kind3 = _isOppWin ? 'fail' : 'crit'; }
      renderDiceResultEffect(getPanel(), { value: (_cw || '?') + ' VS ' + (_ow || '?'), label: '对抗检定 · ' + _wl, kind: _kind3 });
    } catch (eEF4) {}

    // 绑定整行点击事件进行重投
    $resultDisplay.off('click').on('click', function (e: any) {
      e.stopPropagation();
      e.preventDefault();
      performContestRoll();
    });

    // 隐藏原按钮
    const $contestBtn = getPanel().find('#contest-roll-btn');
    $contestBtn.hide();

    // 构建对抗检定结果文本 (使用模板系统)
    const template = preset.contestOutputTemplate || deps.DEFAULT_CONTEST_OUTPUT_TEMPLATE;
    // 使用 displayExpr（如果有）或 condition 作为显示表达式
    const initDisplayOutcome = deps.getAdvancedPresetDisplayOutcome(initOutcomeResult);
    const oppDisplayOutcome = deps.getAdvancedPresetDisplayOutcome(oppOutcomeResult);
    const initDisplayExpr = initDisplayOutcome.displayExpr ?? initDisplayOutcome.condition;
    const oppDisplayExpr = oppDisplayOutcome.displayExpr ?? oppDisplayOutcome.condition;
    // 先处理 $roll.hasTag() 方法调用
    let initConditionExpr = initDisplayExpr.replace(
      /\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi,
      (_match: any, tag: any) => {
        return (initResult.tags ?? []).includes(tag) ? '成立' : '不成立';
      },
    );
    initConditionExpr = initConditionExpr
      .replace(/\$roll\.total/g, String(initRollTotal)) // 先替换 $roll.total
      .replace(/\$roll/g, String(initRollTotal))
      .replace(/\$attrMod/g, String(initAttrMod))
      .replace(/\$skillMod/g, String(initSkillMod))
      .replace(/\$attr/g, String(initValue))
      .replace(/\$dc/g, String(initTarget))
      .replace(/\$mod/g, String(initMod));
    let oppConditionExpr = oppDisplayExpr.replace(/\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi, (_match: any, tag: any) => {
      return (oppResult.tags ?? []).includes(tag) ? '成立' : '不成立';
    });
    oppConditionExpr = oppConditionExpr
      .replace(/\$roll\.total/g, String(oppRollTotal)) // 先替换 $roll.total
      .replace(/\$roll/g, String(oppRollTotal))
      .replace(/\$attrMod/g, String(oppAttrMod))
      .replace(/\$skillMod/g, String(oppSkillMod))
      .replace(/\$attr/g, String(oppValue))
      .replace(/\$dc/g, String(oppTarget))
      .replace(/\$mod/g, String(oppMod));
    // 计算 displayExpr 的布尔值来决定"成立/不成立"
    // 注意：复用前面已定义的 initContext 和 oppContext
    const initDisplayExprResult = deps.evaluateCondition(initDisplayExpr, initContext);
    const oppDisplayExprResult = deps.evaluateCondition(oppDisplayExpr, oppContext);
    const initJudgeResult =
      initDisplayExprResult.success &&
      (typeof initDisplayExprResult.value === 'number'
        ? initDisplayExprResult.value !== 0
        : Boolean(initDisplayExprResult.value))
        ? '成立'
        : '不成立';
    const oppJudgeResult =
      oppDisplayExprResult.success &&
      (typeof oppDisplayExprResult.value === 'number'
        ? oppDisplayExprResult.value !== 0
        : Boolean(oppDisplayExprResult.value))
        ? '成立'
        : '不成立';
    const initOutcomeText = initOutcome.outputText || initOutcome.name || '判定完成';
    const oppOutcomeText = oppOutcome.outputText || oppOutcome.name || '判定完成';
    // 计算总值（投骰 + 属性调整值 + 技能加值 + 额外修正）和差值
    const initTotal = initRollTotal + initAttrMod + initSkillMod + initMod;
    const oppTotal = oppRollTotal + oppAttrMod + oppSkillMod + oppMod;
    const margin = initTotal - oppTotal;

    // [新增] 条件文本变量：当值为0时隐藏整个片段（包括标签）
    // 发起方
    const initAttrModStr = initAttrMod >= 0 ? `+${initAttrMod}` : String(initAttrMod);
    const initSkillModStr = initSkillMod >= 0 ? `+${initSkillMod}` : String(initSkillMod);
    const initAttrModText = initAttrMod !== 0 ? `，调整值${initAttrModStr}` : '';
    const initSkillModText = initSkillMod !== 0 ? `+技能加值${initSkillModStr}` : '';
    const initModText = initMod !== 0 ? `+额外加值${initMod >= 0 ? '+' + initMod : initMod}` : '';
    // 对抗方
    const oppAttrModStr = oppAttrMod >= 0 ? `+${oppAttrMod}` : String(oppAttrMod);
    const oppSkillModStr = oppSkillMod >= 0 ? `+${oppSkillMod}` : String(oppSkillMod);
    const oppAttrModText = oppAttrMod !== 0 ? `，调整值${oppAttrModStr}` : '';
    const oppSkillModText = oppSkillMod !== 0 ? `+技能加值${oppSkillModStr}` : '';
    const oppModText = oppMod !== 0 ? `+额外加值${oppMod >= 0 ? '+' + oppMod : oppMod}` : '';
    const initCheckValueText = deps.buildCheckValueText({
      preset,
      characterName: initName,
      actionName: initAttrName,
      attrValue: initValue,
      attrMod: initAttrMod,
      skillMod: initSkillMod,
      mode: 'contest',
    });
    const oppCheckValueText = deps.buildCheckValueText({
      preset,
      characterName: oppName,
      actionName: oppAttrName,
      attrValue: oppValue,
      attrMod: oppAttrMod,
      skillMod: oppSkillMod,
      mode: 'contest',
    });

    const contestOutputContext = {
      initiator: initName,
      opponent: oppName,
      initAttrName: initAttrName,
      oppAttrName: oppAttrName,
      initRoll: initRollTotal,
      oppRoll: oppRollTotal,
      initDisplayValue: initTotal,
      oppDisplayValue: oppTotal,
      initTarget: initTarget,
      oppTarget: oppTarget,
      initSuccessName: initOutcome.name,
      oppSuccessName: oppOutcome.name,
      winner: winnerText, // "XXX 胜利" 或 "平局"
      outcomeText: initOutcomeText,
      outcomeName: initOutcome.name,
      conditionExpr: initConditionExpr,
      judgeResult: initJudgeResult,
      formula: initFormula,
      initFormula: initFormula,
      oppFormula: oppFormula,
      roll: initRollTotal,
      dc: initTarget,
      mod: initMod,
      attr: initValue,
      attrName: `【${initAttrName}】`,
      initOutcomeText: initOutcomeText,
      oppOutcomeText: oppOutcomeText,
      initConditionExpr: initConditionExpr,
      oppConditionExpr: oppConditionExpr,
      initJudgeResult: initJudgeResult,
      oppJudgeResult: oppJudgeResult,
      // 属性调整值（用于 DND 等系统）
      initAttrMod: initAttrMod,
      oppAttrMod: oppAttrMod,
      // 技能加值（用于 DND 等系统）
      initSkillMod: initSkillMod,
      oppSkillMod: oppSkillMod,
      initMod: initMod,
      oppMod: oppMod,
      // [新增] 条件文本变量（零值时隐藏整个片段）
      initAttrModText: initAttrModText,
      oppAttrModText: oppAttrModText,
      initSkillModText: initSkillModText,
      oppSkillModText: oppSkillModText,
      initModText: initModText,
      oppModText: oppModText,
      initCheckValueText: initCheckValueText,
      oppCheckValueText: oppCheckValueText,
      // 总值和差值（用于 DND/Fate 等系统）
      initTotal: initTotal,
      oppTotal: oppTotal,
      margin: margin,
      shifts: margin, // Fate 术语别名
      // [新增] 双方原始属性值（技能等级）
      initAttr: initValue,
      oppAttr: oppValue,
    };
    const contestResultText = deps.formatOutputTemplate(template, contestOutputContext);
    deps.smartInsertToTextarea(contestResultText, 'dice');

    // 构建对抗检定结果对象
    const getOutcomeLevel = (outcome: OutcomeLevel) => {
      if (outcome.priority <= 10) return 3;
      if (outcome.priority <= 30) return 2;
      if (outcome.priority < 50) return 1;
      if (outcome.priority === 50) return 0;
      return -1;
    };
    const contestResult: Record<string, any> = {
      left: {
        name: initName,
        attribute: initAttrName,
        roll: initRollTotal,
        target: initTarget,
        successLevel: getOutcomeLevel(initOutcome),
      },
      right: {
        name: oppName,
        attribute: oppAttrName,
        roll: oppRollTotal,
        target: oppTarget,
        successLevel: getOutcomeLevel(oppOutcome),
      },
      winner: winnerSide === 'initiator' ? 'left' : winnerSide === 'opponent' ? 'right' : 'tie',
      message: winnerText,
    };

    // 添加到历史记录
    const contestDetailId = `contest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const contestResultWithTimestamp = {
      ...contestResult,
      timestamp: Date.now(),
      detailId: contestDetailId,
      historyType: 'contest' as const,
      detailLines: [
        `发起方: ${initName} / 对抗方: ${oppName}`,
        `属性: ${initAttrName} vs ${oppAttrName}`,
        `公式: ${initFormula} vs ${oppFormula}`,
        `掷骰: ${initRollTotal} vs ${oppRollTotal}`,
        `总值: ${initTotal} vs ${oppTotal}`,
        `判定: ${initConditionExpr} | ${oppConditionExpr}`,
        `结果: ${winnerText}`,
      ],
    };
    deps.getContestHistory().push(contestResultWithTimestamp);
    if (deps.getContestHistory().length > deps.getMAX_HISTORY()) {
      deps.getContestHistory().shift();
    }

    // 触发事件
    deps.emitEvent('contest', contestResultWithTimestamp);
  };

  return { performContestRoll };
}
