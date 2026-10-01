/** 用例 04（x6-b）：骰子表达式引擎 AcuDice.roll —— 确定性、值域与返回形状。 */
const assert = require('assert');

module.exports = function (test, ctx) {
  test('04 roll: deterministic cases (N d1 expressions)', () => {
    const A = ctx.getBundle().win.AcuDice;
    const fixed = [['3d1+2', 5], ['1d1', 1], ['10d1', 10], ['5d1+3', 8], ['100d1', 100], ['2d1+1', 3]];
    for (const [f, want] of fixed) {
      for (let i = 0; i < 3; i += 1) {
        const r = A.roll(f);
        assert.strictEqual(r.total, want, f + ' => ' + r.total + ' want ' + want);
      }
    }
  });
  test('04 roll: range checks on random dice', () => {
    const A = ctx.getBundle().win.AcuDice;
    const ranged = [['1d6', 1, 6], ['2d6', 2, 12], ['1d100', 1, 100], ['1d20+5', 6, 25]];
    for (const [f, lo, hi] of ranged) {
      for (let i = 0; i < 25; i += 1) {
        const r = A.roll(f);
        assert(Number.isInteger(r.total), f + ' total not integer: ' + r.total);
        assert(r.total >= lo && r.total <= hi, f + ' out of range: ' + r.total);
      }
    }
  });
  test('04 roll: return shape { total, formula, breakdown }', () => {
    const A = ctx.getBundle().win.AcuDice;
    const r = A.roll('2d6');
    assert.strictEqual(typeof r, 'object', 'roll must return object');
    assert.strictEqual(r.formula, '2d6', 'formula echo');
    assert.strictEqual(typeof r.total, 'number', 'total must be number');
    assert.strictEqual(typeof r.breakdown, 'string', 'breakdown must be string');
    assert(r.breakdown.indexOf('2d6') !== -1, 'breakdown lacks formula: ' + r.breakdown);
    assert(r.breakdown.indexOf(String(r.total)) !== -1, 'breakdown lacks total: ' + r.breakdown);
  });
};
