/** 用例 05（x6-b）：gacha getState 只读结构契约（环境中立，不依赖数据库 API）。 */
const assert = require('assert');

module.exports = function (test, ctx) {
  test('05 gacha: getState read-only shape', () => {
    const g = ctx.getBundle().win.AcuDice.gacha;
    const st = g.getState();
    assert(st && typeof st === 'object', 'getState() must return object');
    assert.strictEqual(typeof st.fortune, 'number', 'fortune must be number');
    assert(st.wallet && typeof st.wallet === 'object', 'wallet missing');
    assert(st.wallet.shards && typeof st.wallet.shards === 'object', 'wallet.shards missing');
    for (const k of ['普通', '优秀', '稀有', '史诗', '传说', '神话', '唯一']) {
      assert(typeof st.wallet.shards[k] === 'number', 'shard tier missing/non-number: ' + k);
    }
    assert(st.pity && typeof st.pity === 'object', 'pity missing');
    assert.strictEqual(typeof st.pity.rare, 'number', 'pity.rare must be number');
    assert.strictEqual(typeof st.pity.legend, 'number', 'pity.legend must be number');
    assert.strictEqual(typeof st.activePoolTag, 'string', 'activePoolTag must be string');
    assert(Array.isArray(st.recentRewards), 'recentRewards must be array');
  });
};
