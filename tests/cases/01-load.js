/** 用例 01（x6-a）：bundle 在 JSDOM 沙盒中启动，无致命异常。 */
module.exports = function (test, ctx) {
  test('01 load: bundle boots without fatal error', () => {
    const { bootError } = ctx.loadBundle(ctx.bundlePath);
    if (bootError) throw new Error('boot error: ' + bootError);
  });
};
