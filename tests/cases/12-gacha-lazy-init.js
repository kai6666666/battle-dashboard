/** 用例 12（x9-b）：gacha 懒初始化——空白实例在无任何抽卡交互时，不自动创建/持久化抽卡状态；API 按需创建仍可用。 */
const assert = require('assert');

module.exports = function (test, ctx) {
  test('12 gacha lazy-init: no auto state before first use, API still creates', async () => {
    const harness = require('../harness.js');
    // 独立实例：避免与共享 bundle 的状态（其它用例开过商店）交叉
    const fresh = harness.loadBundle(ctx.bundlePath);
    const win = fresh.win;
    assert(!fresh.bootError, 'fresh boot error: ' + fresh.bootError);

    // 覆盖心跳启动（+0.5s）与首次 flush（+1s）窗口
    await new Promise(resolve => setTimeout(resolve, 2000));

    const ls = win.localStorage;
    const keys = [];
    for (let i = 0; i < ls.length; i++) keys.push(String(ls.key(i)));
    const gachaKeys = keys.filter(k => k.indexOf('acu_gacha_state_v1') === 0);
    assert.deepStrictEqual(gachaKeys, [], 'unexpected auto-created gacha state: ' + gachaKeys.join(','));

    // 正向对照：API 查询仍会按需创建（不依赖持久化，仅结构校验）
    const st = win.AcuDice.gacha.getState();
    assert(st && typeof st === 'object', 'getState should return snapshot');
    assert(st.wallet && typeof st.wallet.fortune === 'number', 'snapshot.wallet.fortune missing');
  });
};