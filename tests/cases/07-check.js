/** 用例 07（x6-c）：检定 check —— 显式 target 的不变量 + 缺目标报错契约。 */
const assert = require('assert');

module.exports = function (test, ctx) {
  test('07 check: invariants with explicit target (coc)', async () => {
    const A = ctx.getBundle().win.AcuDice;
    for (let i = 0; i < 10; i += 1) {
      const r = await A.check({ attribute: '力量', targetValue: 50, diceType: '1d100' });
      assert(r && typeof r === 'object', 'check must return object');
      assert(Number.isInteger(r.roll) && r.roll >= 1 && r.roll <= 100, 'roll range: ' + r.roll);
      assert.strictEqual(r.target, 50, 'target echo');
      assert.strictEqual(r.margin, r.target - r.roll, 'margin = target - roll');
      assert.strictEqual(r.success, r.roll <= r.target, 'success = roll <= target');
      assert.strictEqual(r.diceType, '1d100', 'diceType echo');
      assert.strictEqual(r.rule, 'coc', 'rule echo');
      assert(typeof r.message === 'string' && r.message.length > 0, 'message non-empty');
    }
  });
  test('07 check: missing target throws descriptive error', async () => {
    const A = ctx.getBundle().win.AcuDice;
    let threw = false;
    try { await A.check({ attribute: '力量' }); }
    catch (e) {
      threw = true;
      assert(String(e && e.message).indexOf('未找到属性或技能') !== -1, 'unexpected error: ' + (e && e.message));
    }
    assert(threw, 'expected throw when no targetValue/attribute data');
  });
};
