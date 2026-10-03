/** 用例 13（x9g）：样式字符串控制字符与尾部规则完整性冒烟（防 bad-string 截断回归）。 */
const assert = require('assert');
module.exports = function (test, ctx) {
  test('13 styles: no control chars & tail rules present', async () => {
    const { win } = ctx.getBundle();
    const doc = win.document;
    let all = '';
    doc.querySelectorAll('style').forEach(s => { all += s.textContent; });
    const bad = [];
    for (let i = 0; i < all.length; i += 1) {
      const c = all.charCodeAt(i);
      if (c < 32 && c !== 9 && c !== 10 && c !== 13) bad.push([i, c]);
    }
    assert.strictEqual(bad.length, 0, '样式含控制字符: ' + JSON.stringify(bad.slice(0, 5)));
    for (const key of [
      '.acu-gacha-pickup-card{',
      '.acu-gacha-recent-detail-btn{',
      '.acu-inventory-filter-btn{',
      '.acu-changes-batch-actions',
      '.acu-config-backup-overlay{',
    ]) {
      assert(all.includes(key), '缺少尾部规则: ' + key);
    }
  });
};
