/** 用例 08（x6-c）：预设与只读面 —— listPresets / getActivePresetId / listCharacters。 */
const assert = require('assert');

module.exports = function (test, ctx) {
  test('08 presets: builtin preset + read-only misc', () => {
    const A = ctx.getBundle().win.AcuDice;
    const presets = A.listPresets();
    assert(Array.isArray(presets), 'listPresets must return array');
    assert(presets.length >= 1, 'at least builtin preset');
    const b = presets.filter(p => p && p.id === '__builtin_default__');
    assert.strictEqual(b.length, 1, 'builtin default preset missing');
    assert(typeof b[0].name === 'string' && b[0].name.length > 0, 'preset name');
    assert.strictEqual(b[0].builtin, true, 'preset builtin flag');
    const active = A.getActivePresetId();
    assert(typeof active === 'string' && active.length > 0, 'active preset id non-empty');
    const chars = A.listCharacters();
    assert(Array.isArray(chars), 'listCharacters must return array');
  });
};
