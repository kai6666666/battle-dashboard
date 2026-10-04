/** 用例 11（x6-d）：gacha 碎片商店开关 DOM 冒烟（openShardShop / closeShop）。
 *  备注：shard 关闭按钮点击未接入自动化（事件绑定差异），统一用 closeShop 关闭。 */
const assert = require('assert');
const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = function (test, ctx) {
  test('11 shard: open renders shard shop, closeShop removes it', async () => {
    const { win } = ctx.getBundle();
    const doc = win.document;
    const baseline = doc.body.querySelectorAll('*').length;
    await win.AcuDice.gacha.openShardShop();
    await sleep(200);
    assert(doc.querySelector('.acu-gacha-shard-shop-close'), 'shard shop close button missing');
    const opened = doc.body.querySelectorAll('*').length;
    assert(opened > baseline, 'shard DOM did not grow: ' + baseline + ' -> ' + opened);
    win.AcuDice.gacha.closeShop();
    await sleep(400);
    const closed = doc.body.querySelectorAll('*').length;
    assert(closed <= baseline, 'DOM not restored after shard close: ' + closed + ' vs ' + baseline);
  });
};
