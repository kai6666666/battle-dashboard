#!/usr/bin/env node
/**
 * 战斗仪表盘拆解护栏（x1）
 *- 文件体积门：src/战斗仪表盘 内 >100KB 的文件必须在 baseline-large-files.json 中，且不得再增长
 * - @ts-nocheck 冻结：只允许 baseline-ts-nocheck.json 中的存量文件，禁止新增
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src/战斗仪表盘');
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
  console.error('[guardrails] 未找到 src/战斗仪表盘');
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
// ④-1 JS 转义损坏扫描（x9g）：模板字符串中的单反斜杠 + 4 位十六进制（CSS 转义形态）
// 会被 JS 求值为控制字符（如 \f -> U+000C），在压缩为单行后触发 CSS bad-string 并吞掉后续全部规则。
const CSS_ESCAPE = /\\+[0-9a-fA-F]{4}/g;
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = CSS_ESCAPE.exec(content))) {
    const seq = m[0];
    let run = 0;
    for (let k = 0; k < seq.length; k += 1) {
      if (seq[k] === '\\') run += 1;
      else break;
    }
    if (run % 2 === 1) {
      const line = content.slice(0, m.index).split('\n').length;
      errors.push(
        `[转义损坏] ${rel(f)}:${line} —— 单反斜杠转义 ${JSON.stringify(seq.slice(0, 24))}（应写成双反斜杠）`,
      );
    }
  }
}

// ④-2 构建产物控制字符扫描（x9g）：stable.js 不得含 \t\n\r 之外的 C0 控制字符
for (const [bp] of Object.entries(bundleBaseline.files || {})) {
  const abs = path.join(ROOT, bp);
  if (!fs.existsSync(abs)) continue;
  const text = fs.readFileSync(abs, 'latin1');
  const bad = [];
  for (let i = 0; i < text.length; i += 1) {
    const c = text.charCodeAt(i);
    // 仅针对 CSS bad-string 致命字符：NUL 与 FF（其余 C0 如应用层有意使用的 U+0001 分隔符不视为问题）
    if (c === 0 || c === 12) bad.push(i);
  }
  if (bad.length) errors.push(`[产物控制字符] ${bp} 含 ${bad.length} 个 CSS 致命控制字符（首个 @${bad[0]}）`);
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
