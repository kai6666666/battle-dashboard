/**
 * contest / resolve-contest.ts — 对抗裁决（从 show-contest-panel.ts 拆出，x8-a）。
 */
import type { AdvancedDicePreset, OutcomeLevel } from '../../../shared/advanced-preset-types';

export function createResolveContest(deps: any) {
  return function resolveContest(
    preset: AdvancedDicePreset,
    initOutcome: OutcomeLevel,
    oppOutcome: OutcomeLevel,
    initValue: number,
    oppValue: number,
    initAttr: number,
    oppAttr: number,
  ): 'initiator' | 'opponent' | 'tie' {
    const contestRule = preset.contestRule;

    if (!contestRule) {
      if (initValue > oppValue) return 'initiator';
      if (oppValue > initValue) return 'opponent';
      return 'tie';
    }

    let winner: 'initiator' | 'opponent' | 'tie' = 'tie';
    const contestMode = contestRule.mode ?? 'custom'; // 默认自定义模式，保持旧行为

    switch (contestMode) {
      case 'rank': {
        const initRank = initOutcome.contestRank ?? 50;
        const oppRank = oppOutcome.contestRank ?? 50;
        if (initRank > oppRank) winner = 'initiator';
        else if (oppRank > initRank) winner = 'opponent';
        break;
      }
      case 'value':
      case 'margin': {
        // 余量模式裁决与 value 相同
        if (initValue > oppValue) winner = 'initiator';
        else if (oppValue > initValue) winner = 'opponent';
        break;
      }
      case 'custom': {
        if (contestRule.customExpr) {
          const context = {
            $initValue: initValue,
            $oppValue: oppValue,
            $initRank: initOutcome.contestRank ?? 50,
            $oppRank: oppOutcome.contestRank ?? 50,
          };
          const conditionResult: { success: boolean; value?: number | boolean; error?: string } = deps.evaluateCondition(
            contestRule.customExpr,
            context,
          );
          if (conditionResult.success) {
            const isMatch =
              typeof conditionResult.value === 'number'
                ? conditionResult.value !== 0
                : Boolean(conditionResult.value);
            winner = isMatch ? 'initiator' : 'opponent';
          } else {
            console.warn('[DICE] 对抗判定自定义表达式失败:', conditionResult.error);
          }
        }
        break;
      }
    }

    const tieBreakers =
      Array.isArray(contestRule.tieBreakers) && contestRule.tieBreakers.length > 0
        ? contestRule.tieBreakers
        : contestRule.tieBreaker
          ? [contestRule.tieBreaker]
          : [];

    if (winner === 'tie' && tieBreakers.length > 0) {
      // 链式平局处理：按顺序尝试直到分出胜负
      for (const tieBreaker of tieBreakers) {
        if (winner !== 'tie') break;
        switch (tieBreaker) {
          case 'higher_attr':
            if (initAttr > oppAttr) winner = 'initiator';
            else if (oppAttr > initAttr) winner = 'opponent';
            break;
          case 'initiator_wins':
            winner = 'initiator';
            break;
          case 'reroll':
            // 重投由外层触发，此处保持平局继续后续规则
            break;
        }
      }
    }

    return winner;
  };
}
