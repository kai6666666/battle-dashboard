#!/usr/bin/env node
/**
 * 骰子系统 test harness runner（x6-a）
 * 用法: node tests/run.js [bundle路径]
 * 默认 bundle: <repo>/dist/骰子系统/stable.js
 */
const fs = require('fs');
const path = require('path');

const bundlePath = path.resolve(process.argv[2] || path.join(__dirname, '..', 'dist', '骰子系统', 'stable.js'));
if (!fs.existsSync(bundlePath)) {
  console.error('[run] bundle not found: ' + bundlePath);
  process.exit(2);
}

const harness = require('./harness.js');
const cases = [];
const test = (name, fn) => cases.push({ name, fn });
const caseDir = path.join(__dirname, 'cases');
for (const f of fs.readdirSync(caseDir).filter(x => x.endsWith('.js')).sort()) {
  require(path.join(caseDir, f))(test, { bundlePath, loadBundle: harness.loadBundle });
}

(async () => {
  let pass = 0;
  let fail = 0;
  console.log('[run] bundle: ' + bundlePath);
  for (const c of cases) {
    try {
      await c.fn();
      pass += 1;
      console.log('  PASS ' + c.name);
    } catch (e) {
      fail += 1;
      console.log('  FAIL ' + c.name);
      console.log('       ' + String(e && e.message ? e.message : e));
    }
  }
  console.log('[run] total ' + cases.length + ' | PASS ' + pass + ' | FAIL ' + fail);
  process.exit(fail ? 1 : 0);
})();
