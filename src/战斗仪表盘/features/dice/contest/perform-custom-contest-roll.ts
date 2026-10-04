/**
 * contest / perform-custom-contest-roll.ts — 对抗面板：自定义掷骰（规则/结果/历史簇；从 show-contest-panel.ts 拆出，x8-c）。
 */
import { rollComplexDiceExpression } from '../dice-engine';
import { showActionableErrorToast } from '../../../shared/actionable-error-toast';

export function createPerformCustomContestRoll(ctx: any) {
  const { deps, getPanel } = ctx;

  const performCustomContestRoll = function () {
    const $btn = getPanel().find('#contest-roll-btn');

    // 读取自定义模式字段
    const initDiceExpr = getPanel().find('#contest-custom-dice-init').val().trim() || '1d100';
    const oppDiceExpr = getPanel().find('#contest-custom-dice-opp').val().trim() || initDiceExpr;
    const judgeRule = getPanel().find('#contest-custom-judge-rule').val() as string;
    const tieRule = (getPanel().find('#contest-custom-tie-rule').val() as string) ?? 'tie';

    // 读取双方信息
    try {
      const rawDataForAlias = deps.getCachedRawData() || deps.getTableData();
      if (rawDataForAlias) {
        deps.NameAliasRegistry.rebuild(deps.processJsonData(rawDataForAlias || {}));
      }
    } catch (error) {
      console.warn('[DICE] 对抗别名映射刷新失败:', error);
    }
    const initNameRaw = getPanel().find('#contest-init-display').val().trim() || '<user>';
    const initName = deps.resolveCanonicalCharacterName(initNameRaw);
    const initAttrName = getPanel().find('#contest-init-name').val().trim() || '自由检定';
    const oppNameRaw = getPanel().find('#contest-opponent-display').val().trim() || '对手';
    const oppName = deps.resolveCanonicalCharacterName(oppNameRaw);
    const oppAttrName = getPanel().find('#contest-opp-name').val().trim() || initAttrName;

    // 掷骰
    const initRoll = rollComplexDiceExpression(initDiceExpr);
    const oppRoll = rollComplexDiceExpression(oppDiceExpr);

    if (isNaN(initRoll.total) || isNaN(oppRoll.total)) {
      if (window.toastr) {
        const errorExpr = isNaN(initRoll.total) ? initDiceExpr : oppDiceExpr;
        showActionableErrorToast(`骰子语法错误: ${errorExpr}`, {
          suggestion: '请检查对抗检定双方的骰子表达式，只使用形如 1d100、2d6+3 的合法写法。',
        });
      }
      return;
    }

    const initTotal = initRoll.total;
    const oppTotal = oppRoll.total;

    // 判定胜负
    let winner: 'initiator' | 'opponent' | 'tie' = 'tie';
    switch (judgeRule) {
      case 'higher':
        if (initTotal > oppTotal) winner = 'initiator';
        else if (oppTotal > initTotal) winner = 'opponent';
        else {
          // 平手情况，使用 tieRule
          if (tieRule === 'initiator_win') winner = 'initiator';
          else if (tieRule === 'initiator_lose') winner = 'opponent';
          // tieRule === 'tie' 时保持 winner = 'tie'
        }
        break;
      case 'lower':
        if (initTotal < oppTotal) winner = 'initiator';
        else if (oppTotal < initTotal) winner = 'opponent';
        else {
          if (tieRule === 'initiator_win') winner = 'initiator';
          else if (tieRule === 'initiator_lose') winner = 'opponent';
        }
        break;
      case 'rank':
        if (initTotal > oppTotal) winner = 'initiator';
        else if (oppTotal > initTotal) winner = 'opponent';
        else {
          if (tieRule === 'initiator_win') winner = 'initiator';
          else if (tieRule === 'initiator_lose') winner = 'opponent';
        }
        break;
      case 'none':
        break;
    }

    const winnerText =
      winner === 'initiator'
        ? `${deps.replaceUserPlaceholders(initName)} 获胜`
        : winner === 'opponent'
          ? `${deps.replaceUserPlaceholders(oppName)} 获胜`
          : judgeRule === 'none'
            ? '无判定'
            : '平局';

    const contestTitle = initAttrName === oppAttrName ? initAttrName : `${initAttrName} vs ${oppAttrName}`;
    const compareSymbol = judgeRule === 'lower' ? '<' : '>';
    let compareExpr = `${initTotal} ${compareSymbol} ${oppTotal}`;
    if (winner === 'tie' || judgeRule === 'none') {
      compareExpr = `${initTotal} = ${oppTotal}`;
    }

    // 生成输出文本（单行，避免冗余换行）
    const outputText = `<meta:检定结果>【${contestTitle}】对抗检定：${deps.replaceUserPlaceholders(initName)}(${initDiceExpr})=${initTotal}，${deps.replaceUserPlaceholders(oppName)}(${oppDiceExpr})=${oppTotal}，判定 ${compareExpr}，${winnerText}</meta:检定结果>`;

    // 插入到输入框
    deps.smartInsertToTextarea(outputText, 'dice');

    // 更新结果显示
    const diceCfg = deps.getDiceConfig();
    const hideDiceResultFromUser =
      diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;

    const initDisplayRoll = hideDiceResultFromUser ? '？？' : initTotal;
    const oppDisplayRoll = hideDiceResultFromUser ? '？？' : oppTotal;
    const showOutcome = judgeRule !== 'none' && !hideDiceResultFromUser;
    const initOutcomeText = showOutcome ? (winner === 'tie' ? '平局' : winner === 'initiator' ? '胜' : '负') : '';
    const oppOutcomeText = showOutcome ? (winner === 'tie' ? '平局' : winner === 'opponent' ? '胜' : '负') : '';

    getPanel().find('#contest-result-init').html(`
      <div class="acu-contest-result-name">${deps.escapeHtml(deps.replaceUserPlaceholders(initName))}</div>
      <div class="acu-contest-result-roll">${initDisplayRoll}</div>
      ${showOutcome ? `<div class="acu-contest-result-outcome">${initOutcomeText}</div>` : ''}
    `);

    getPanel().find('#contest-result-opp').html(`
      <div class="acu-contest-result-name">${deps.escapeHtml(deps.replaceUserPlaceholders(oppName))}</div>
      <div class="acu-contest-result-roll">${oppDisplayRoll}</div>
      ${showOutcome ? `<div class="acu-contest-result-outcome">${oppOutcomeText}</div>` : ''}
    `);

    // 高亮胜者
    getPanel().find('#contest-result-init').removeClass('winner loser');
    getPanel().find('#contest-result-opp').removeClass('winner loser');
    if (!hideDiceResultFromUser && judgeRule !== 'none') {
      if (winner === 'initiator') {
        getPanel().find('#contest-result-init').addClass('winner');
        getPanel().find('#contest-result-opp').addClass('loser');
      } else if (winner === 'opponent') {
        getPanel().find('#contest-result-init').addClass('loser');
        getPanel().find('#contest-result-opp').addClass('winner');
      }
    }

    // 显示结果区
    getPanel().find('#contest-result-display').show();

    // 更新按钮显示重投
    $btn.html(`
      <div class="acu-dice-result-display">
        <span>${hideDiceResultFromUser ? '？？' : winnerText}</span>
        <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
          <i class="fa-solid fa-rotate-right"></i>
        </button>
      </div>
    `);

    // 绑定重投按钮
    $btn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e: any) {
      e.stopPropagation();
      e.preventDefault();
      performCustomContestRoll();
    });

    const winnerSide: 'left' | 'right' | 'tie' =
      winner === 'initiator' ? 'left' : winner === 'opponent' ? 'right' : 'tie';
    const customContestResult: Record<string, any> = {
      left: {
        name: initName,
        attribute: initAttrName,
        roll: initTotal,
        target: 0,
        successLevel: winner === 'initiator' ? 1 : winner === 'tie' ? 0 : -1,
      },
      right: {
        name: oppName,
        attribute: oppAttrName,
        roll: oppTotal,
        target: 0,
        successLevel: winner === 'opponent' ? 1 : winner === 'tie' ? 0 : -1,
      },
      winner: winnerSide,
      message: winnerText,
    };

    const customContestWithTimestamp = {
      ...customContestResult,
      timestamp: Date.now(),
      detailId: `contest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      detailLines: [
        `发起方: ${initName} / 对抗方: ${oppName}`,
        `属性: ${initAttrName} vs ${oppAttrName}`,
        `公式: ${initDiceExpr} vs ${oppDiceExpr}`,
        `掷骰: ${initTotal} vs ${oppTotal}`,
        `判定规则: ${judgeRule}`,
        `平手规则: ${tieRule}`,
        `判定表达式: ${compareExpr}`,
        `结果: ${winnerText}`,
      ],
    };
    deps.getContestHistory().push(customContestWithTimestamp);
    if (deps.getContestHistory().length > deps.getMAX_HISTORY()) {
      deps.getContestHistory().shift();
    }
    deps.emitEvent('contest', customContestWithTimestamp);
  };

  return { performCustomContestRoll };
}
