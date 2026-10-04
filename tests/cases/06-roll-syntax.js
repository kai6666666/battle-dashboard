/** 用例 06（x6-c）：roll 扩展语法 —— 乘法/减法/括号/多骰组/空白容忍。 */
const assert = require('assert');

module.exports = function (test, ctx) {
  test('06 roll: extended syntax (mul/sub/paren/multi-group/whitespace)', () => {
    const A = ctx.getBundle().win.AcuDice;
    const fixed = [['3d1*2', 6], ['6d1-1', 5], ['(2d1+1)*2', 6], ['1d1+1d1', 2], ['2d1', 2]];
    for (const [f, want] of fixed) {
      for (let i = 0; i < 3; i += 1) {
        const r = A.roll(f);
        assert.strictEqual(r.total, want, f + ' => ' + r.total + ' want ' + want);
      }
    }
    const r = A.roll(' 3d1 + 2 ');
    assert.strictEqual(r.total, 5, 'whitespace total');
    assert.strictEqual(r.formula, ' 3d1 + 2 ', 'formula echo with whitespace');
  });
};
