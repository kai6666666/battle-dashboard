/** 用例 10（x6-d）：gacha 设置对话框开关 DOM 冒烟（openSettings / 关闭按钮点击）。 */
const assert = require('assert');
const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = function (test, ctx) {
  test('10 settings: open renders dialog, close-btn click removes it', async () => {
    const { win } = ctx.getBundle();
    const doc = win.document;
    const baseline = doc.body.querySelectorAll('*').length;
    await win.AcuDice.gacha.openSettings();
    assert(doc.querySelector('.acu-gacha-settings-overlay'), 'settings overlay not rendered');
    const opened = doc.body.querySelectorAll('*').length;
    assert(opened > baseline, 'settings DOM did not grow: ' + baseline + ' -> ' + opened);
    const btn = doc.querySelector('.acu-gacha-settings-close');
    assert(btn, 'settings close button missing');
    btn.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
    await sleep(500);
    assert(!doc.querySelector('.acu-gacha-settings-overlay'), 'settings overlay not removed after close');
    const closed = doc.body.querySelectorAll('*').length;
    assert(closed <= baseline, 'DOM not restored after settings close: ' + closed + ' vs ' + baseline);
  });
};
