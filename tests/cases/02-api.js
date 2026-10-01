/** 用例 02（x6-a）：window.AcuDice 公共 API 面存在且关键方法为函数。 */
const assert = require('assert');

module.exports = function (test, ctx) {
  test('02 api: AcuDice surface + gacha methods', () => {
    const { win } = ctx.loadBundle(ctx.bundlePath);
    const A = win.AcuDice;
    assert(A && typeof A === 'object', 'window.AcuDice missing');
    for (const k of ['version', 'roll', 'check', 'onReady', 'on', 'off', 'getHistory', 'getLatestCheck', 'getLatestContest', 'listPresets', 'getActivePresetId', 'profiles', 'contest', 'gacha']) {
      assert(typeof A[k] !== 'undefined', 'AcuDice.' + k + ' missing');
    }
    const g = A.gacha;
    assert(g && typeof g === 'object', 'AcuDice.gacha missing');
    for (const k of ['draw', 'singleDraw', 'tenDraw', 'exportCatalog', 'importCatalog', 'upsertItems', 'upsertPool', 'openShop', 'openShardShop', 'openSettings']) {
      assert(typeof g[k] === 'function', 'gacha.' + k + ' not a function');
    }
  });
};
