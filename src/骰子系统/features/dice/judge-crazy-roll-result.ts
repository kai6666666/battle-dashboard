/**
 * judge-crazy-roll-result.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createJudgeCrazyRollResult(_deps: any) {
  const judgeCrazyRollResult = (roll: any, target: any) => {
    if (roll <= 5) return '大成功';
    if (roll >= 96) return '大失败';
    if (roll <= target) return '成功';
    return '失败';
  };
  return judgeCrazyRollResult;
}
