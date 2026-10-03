// @child-factory（由父模块 show-dice-panel 实例化，不参与 index 接线审计）
/**
 * dice-panel-advanced-check.ts
 * 从 show-dice-panel.ts 拆出：高级检定主流程 performAdvancedCheck
 * （DC解析 / 派生变量 / dicePatches / outcomes / 孤注一掷 / 效果入队）。
 */
import { computePendingEffectVariables } from '../../../shared/effect-math';
import { rollComplexDiceExpression } from '../../../features/dice/dice-engine';
import { showActionableErrorToast } from '../../../shared/actionable-error-toast';

export function createDicePanelAdvancedCheck(deps: any, ctx: any) {
  const dicePanelEffectRuns = ctx.effectRuns;
  const dicePanelEffectConfirm = ctx.effectConfirm;
  const dicePanelExpr = ctx.expr;
  const dicePanelAttrButtons = ctx.attrButtons;
  const dicePanelResourceBurner = ctx.resourceBurner;
  const dicePanelEffectInputs = ctx.effectInputs;
    const performAdvancedCheck = async function (options?: { isPushed?: boolean }) {
      const currentAdvancedPreset = ctx.getCurrentAdvancedPreset();
      const panel = ctx.getPanel();
      const onResult = typeof ctx.getOnResult === 'function' ? ctx.getOnResult() : null;
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
        !dicePanelEffectInputs.matchesCheckSelector(attrName, {
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
      const checkResult: AcuDice.CheckResultDraft = {
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
        dicePanelEffectInputs.matchesCheckSelector(attrName, {
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


  return {
    performAdvancedCheck,
  };
}
