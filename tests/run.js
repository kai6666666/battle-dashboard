#!/usr/bin/env node
/**
 * 战斗仪表盘 test harness runner（x6-b）
 * 用法: node tests/run.js [bundle路径]
 * 默认 bundle: <repo>/dist/战斗仪表盘/stable.js
 * 说明: bundle 通过 getBundle() 惰性单例共享 —— 全部用例只加载一次。
 */
const fs = require('fs');
const path = require('path');

const bundlePath = path.resolve(process.argv[2] || path.join(__dirname, '..', 'dist', '战斗仪表盘', 'stable.js'));
if (!fs.existsSync(bundlePath)) {
  console.error('[run] bundle not found: ' + bundlePath);
  process.exit(2);
}

const harness = require('./harness.js');
let bundleCache = null;
const getBundle = () => bundleCache || (bundleCache = harness.loadBundle(bundlePath));

const cases = [];
const test = (name, fn) => cases.push({ name, fn });
const caseDir = path.join(__dirname, 'cases');
for (const f of fs.readdirSync(caseDir).filter(x => x.endsWith('.js')).sort()) {
  require(path.join(caseDir, f))(test, { bundlePath, getBundle });
}

(async () => {
  let pass = 0;
  let fail = 0;
  const t0 = Date.now();
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
  console.log('[run] total ' + cases.length + ' | PASS ' + pass + ' | FAIL ' + fail + ' | ' + (Date.now() - t0) + 'ms');
  process.exit(fail ? 1 : 0);
})();
