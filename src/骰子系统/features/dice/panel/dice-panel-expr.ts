// @child-factory（由父模块 show-dice-panel 实例化，不参与 index 接线审计）
/**
 * dice-panel-expr.ts
 * 从 show-dice-panel.ts 拆出：投骰 / 修正值解析 / 变量表达式替换助手。
 */
export function createDicePanelExpr(deps: any) {
    const rollDice = formula => {
      const rollResult = rollComplexDiceExpression(formula);
      const total = rollResult.total;
      if (Number.isNaN(total)) {
        return { total: 0, rolls: [], formula };
      }
      // 尝试从公式中提取基本信息用于显示
      const basicMatch = formula.match(/^(\d*)d(\d+|F)/i);
      const count = basicMatch && basicMatch[1] ? parseInt(basicMatch[1], 10) : 1;
      const sidesStr = basicMatch ? basicMatch[2] : '100';
      const sides = sidesStr.toUpperCase() === 'F' ? 3 : parseInt(sidesStr, 10);
      // 对于复杂语法，不提供单独的 rolls 数组
      return { total, rolls: [], sides, count, modifier: 0, formula };
    };

    // 解析修正值，支持纯数字和骰子表达式（如1d6, 1d6+2等）
    const parseModifier = function (modStr) {
      if (!modStr || modStr.trim() === '') return 0;
      const trimmed = modStr.trim();

      // 尝试直接解析为数字
      const numValue = parseFloat(trimmed);
      if (!isNaN(numValue) && isFinite(numValue) && trimmed.match(/^-?\d+(\.\d+)?$/)) {
        return numValue;
      }

      // 复合表达式统一走完整解析
      const rollResult = rollComplexDiceExpression(trimmed);
      if (!Number.isNaN(rollResult.total)) return rollResult.total;
      return 0;
    };

    const resolveExpressionWithContext = (expr: string, context: Record<string, string | number | boolean>): string => {
      let resolved = String(expr || '0');
      Object.entries(context).forEach(([key, value]) => {
        const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        resolved = resolved.replace(new RegExp(safeKey, 'g'), String(value));
      });
      return resolved;
    };


  return {
    rollDice,
    parseModifier,
    resolveExpressionWithContext,
  };
}
