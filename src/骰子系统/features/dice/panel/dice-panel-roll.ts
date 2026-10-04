// @child-factory（由父模块 show-dice-panel 实例化，不参与 index 接线审计）
/**
 * dice-panel-roll.ts
 * 从 show-dice-panel.ts 拆出：自定义模式掷骰 performCustomRoll + 常规掷骰 performDiceRoll。
 */
import { calculateDiceExpectedValue, rollComplexDiceExpression } from '../../../features/dice/dice-engine';
import { showActionableErrorToast } from '../../../shared/actionable-error-toast';

export function createDicePanelRoll(deps: any, ctx: any) {
  const dicePanelExpr = ctx.expr;
  const dicePanelAdvancedCheck = ctx.advancedCheck;
  let lastDiceRollAt = 0;
    const performCustomRoll = function () {
      const panel = ctx.getPanel();
      const onResult = typeof ctx.getOnResult === 'function' ? ctx.getOnResult() : null;
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
      const checkResult: AcuDice.CheckResultDraft = {
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

    // 投骰逻辑函数（可被按钮点击和重投按钮调用）
    const performDiceRoll = function () {
      const panel = ctx.getPanel();
      const onResult = typeof ctx.getOnResult === 'function' ? ctx.getOnResult() : null;
      const currentAdvancedPreset = ctx.getCurrentAdvancedPreset();
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
        dicePanelAdvancedCheck.performAdvancedCheck();
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
      const checkResult: AcuDice.CheckResultDraft = {
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


  return {
    performCustomRoll,
    performDiceRoll,
  };
}
