/** 用例 03（x6-a）：bundle 内嵌版本字符串与 src 侧 constants.ts 的 SCRIPT_VERSION 一致。 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

module.exports = function (test, ctx) {
  test('03 version: bundle embeds SCRIPT_VERSION from constants.ts', () => {
    const constantsPath = path.join(__dirname, '..', '..', 'src', '骰子系统', 'shared', 'constants.ts');
    const src = fs.readFileSync(constantsPath, 'utf8');
    const m = src.match(/SCRIPT_VERSION\s*=\s*'([^']+)'/);
    assert(m, 'SCRIPT_VERSION not found in constants.ts');
    const code = fs.readFileSync(ctx.bundlePath, 'utf8');
    assert(code.indexOf(m[1]) !== -1, 'bundle does not contain version ' + m[1]);
  });
};
