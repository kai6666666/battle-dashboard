/** 用例 09（x6-d）：gacha 商店面板开关 DOM 冒烟（openShop / closeShop）。 */
const assert = require('assert');

module.exports = function (test, ctx) {
  test('09 shop: open renders overlay, closeShop removes it', async () => {
    const { win } = ctx.getBundle();
    const doc = win.document;
    const baseline = doc.body.querySelectorAll('*').length;
    const st = await win.AcuDice.gacha.openShop();
    assert(doc.querySelector('.acu-gacha-shell'), 'gacha shell not rendered');
    const opened = doc.body.querySelectorAll('*').length;
    assert(opened > baseline, 'DOM did not grow: ' + baseline + ' -> ' + opened);
    assert(st && typeof st === 'object', 'openShop must return state snapshot');
    assert(st.wallet && typeof st.wallet === 'object', 'snapshot.wallet missing');
    win.AcuDice.gacha.closeShop();
    assert(!doc.querySelector('.acu-gacha-shell'), 'gacha shell still present after closeShop');
    const closed = doc.body.querySelectorAll('*').length;
    assert(closed <= baseline, 'DOM not restored: ' + closed + ' vs baseline ' + baseline);
  });
};
