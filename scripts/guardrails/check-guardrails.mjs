#!/usr/bin/env node
/**
 * 骰子系统拆解护栏（x1）
 *- 文件体积门：src/骰子系统 内 >100KB 的文件必须在 baseline-large-files.json 中，且不得再增长
 * - @ts-nocheck 冻结：只允许 baseline-ts-nocheck.json 中的存量文件，禁止新增
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src/骰子系统');
const LARGE_LIMIT = 100 * 1024;

const readJson = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const largeBaseline = readJson('scripts/guardrails/baseline-large-files.json');
const nocheckBaseline = new Set(readJson('scripts/guardrails/baseline-ts-nocheck.json'));

const walk = dir => {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
};

if (!fs.existsSync(SRC_DIR)) {
  console.error('[guardrails] 未找到 src/骰子系统');
  process.exit(1);
}

const files = walk(SRC_DIR).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
const rel = f => path.relative(ROOT, f).split(path.sep).join('/');

let failed = false;
const errors = [];

// ① 体积门
for (const f of files) {
  const size = fs.statSync(f).size;
  const r = rel(f);
  if (size > LARGE_LIMIT) {
    const baseline = largeBaseline[r];
    if (!baseline) errors.push(`[体积门] 新增超大文件（>100KB）：${r}（${size} B）`);
    else if (size > baseline) errors.push(`[体积门] 冻结文件增长：${r}（${baseline} → ${size} B）`);
  }
}

// ②-2 子工厂顶层语句扫描（@child-factory 文件在工厂体一级不得直接执行语句）
const CHILD_STMT = /^    (deps\.|ctx\.|panel\.|localStorage\.|window\.|console\.|initCustomDropdown\(|addClearButton\(|getPanel\(|\$\(|build[A-Za-z_$]*\(|update[A-Za-z_$]*\()/;
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  if (!content.includes('@child-factory')) continue;
  const ls = content.split('\n');
  for (let i = 0; i < ls.length; i += 1) {
    if (CHILD_STMT.test(ls[i])) errors.push(`[子工厂顶层语句] ${rel(f)}:${i + 1} —— ${ls[i].trim().slice(0, 60)}`);
  }
}

// ② @ts-nocheck 冻结
const nocheckNow = [];
for (const f of files) {
  const head = fs.readFileSync(f, 'utf8').slice(0, 400);
  if (head.includes('@ts-nocheck')) nocheckNow.push(rel(f));
}
for (const r of nocheckNow) {
  if (!nocheckBaseline.has(r)) errors.push(`[@ts-nocheck] 新增目录禁用标记：${r}`);
}

//3) bundle volume gate (x7-a)
const bundleBaseline = readJson('scripts/guardrails/baseline-bundle-size.json');
const bundleReport = [];
for (const [bp, cfg] of Object.entries(bundleBaseline.files || {})) {
  const abs = path.join(ROOT, bp);
  if (!fs.existsSync(abs)) { errors.push('[bundle体积] 缺失文件：' + bp + '（请先构建）'); continue; }
  const size = fs.statSync(abs).size;
  const limit = (cfg.size || 0) + (cfg.tolerance || 0);
  if (size > limit) errors.push('[bundle体积] 超预算：' + bp + '（' + size + ' B > ' + cfg.size + ' + ' + cfg.tolerance + '）');
  bundleReport.push(bp + ': ' + size + ' B / 预算 ' + limit + ' B');
}
console.log(`[guardrails] 扫描 TS 文件：${files.length}`);
console.log(`[guardrails] >100KB 文件：${files.filter(f => fs.statSync(f).size > LARGE_LIMIT).length} / 冻结名单 ${Object.keys(largeBaseline).length}`);
console.log(`[guardrails] @ts-nocheck 文件：${nocheckNow.length} / 冻结名单 ${nocheckBaseline.size}`);
console.log('[guardrails] bundle体积：' + bundleReport.join(' | '));

if (errors.length) {
  console.error('[guardrails] ❌ 护栏失败：');
  for (const e of errors) console.error('  - ' + e);
  failed = true;
}

if (failed) process.exit(1);
console.log('[guardrails] ✅ 全部通过');
