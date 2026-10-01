/** 用例 01（x6-b）：bundle 在 JSDOM 沙盒中启动，无致命异常。 */
module.exports = function (test, ctx) {
  test('01 load: bundle boots without fatal error', () => {
    const { bootError } = ctx.getBundle();
    if (bootError) throw new Error('boot error: ' + bootError);
  });
};
