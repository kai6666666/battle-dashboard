/**
 * 骰子系统 test harness — JSDOM 沙盒加载器（x6-a）
 * 用法: const { loadBundle } = require('./harness.js');
 *      const { win, bootError } = loadBundle('/path/to/stable.js');
 * 环境: 需要可解析到 jsdom 与 jquery；可用 JSDOM_PATH / TSBUILD 环境变量指定回退位置。
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

function tryRequire(cands) {
  let lastErr = null;
  for (const c of cands) {
    try { return require(c); } catch (e) { lastErr = e; }
  }
  throw new Error('module not resolvable: ' + cands.join(', ') + ' || ' + (lastErr && lastErr.message));
}

function resolveJsdom() {
  const cands = [process.env.JSDOM_PATH, 'jsdom', '/tmp/node_modules/jsdom', path.join(process.env.TSBUILD || '/tmp/tsbuild', 'node_modules', 'jsdom')].filter(Boolean);
  return tryRequire(cands);
}

function resolveJquery() {
  const cands = ['jquery', path.join(process.env.TSBUILD || '/tmp/tsbuild', 'node_modules', 'jquery'), '/tmp/node_modules/jquery'];
  return tryRequire(cands);
}

function mkProxy(name) {
  return new Proxy(function () {}, {
    get(t, p) {
      if (p === Symbol.toPrimitive) return () => name;
      if (p === 'then') return undefined;
      return mkProxy(name + '.' + String(p));
    },
    apply() { return mkProxy(name + '()'); },
    construct() { return mkProxy('new ' + name); },
    set() { return true; },
    has() { return true; },
  });
}

function loadBundle(bundlePath) {
  const { JSDOM } = resolveJsdom();
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'https://example.com/', pretendToBeVisual: true });
  const win = dom.window;
  const jq = resolveJquery();
  const $ = (jq && jq.fn) ? jq : jq(win);
  win.$ = $;
  win.jQuery = $;
  win.tavern = mkProxy('tavern');
  win.SillyTavern = mkProxy('SillyTavern');
  win.TavernHelper = mkProxy('TavernHelper');
  win.parent = win; win.top = win; win.frameElement = null;
  win.toastr = { info() {}, success() {}, warning() {}, error() {} };
  win.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 0);
  win.cancelAnimationFrame = clearTimeout;
  const sandbox = {
    console, setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, Promise, Date, Math, JSON, RegExp, Error, TypeError, Symbol, Map, Set, WeakMap, WeakSet, Array, Object, String, Number, Boolean, parseInt, parseFloat, isNaN, Infinity, NaN,
    window: win, self: win, globalThis: win, document: win.document, navigator: win.navigator, location: win.location,
    localStorage: win.localStorage, sessionStorage: win.sessionStorage,
    fetch: async () => ({ ok: false, status: 404, text: async () => '' }),
    XMLHttpRequest: win.XMLHttpRequest || mkProxy('XHR'),
    MutationObserver: win.MutationObserver,
    ResizeObserver: win.ResizeObserver || class {},
    IntersectionObserver: win.IntersectionObserver || class {},
    getComputedStyle: win.getComputedStyle.bind(win),
    matchMedia: win.matchMedia ? win.matchMedia.bind(win) : () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    Vue: mkProxy('Vue'), $: $, jQuery: $, toastr: win.toastr,
    SillyTavern: win.SillyTavern, TavernHelper: win.TavernHelper, tavern: win.tavern,
    crypto: require('crypto').webcrypto,
  };
  vm.createContext(sandbox);
  const code = fs.readFileSync(bundlePath, 'utf8');
  let bootError = null;
  try {
    vm.runInContext(code, sandbox, { timeout: 20000 });
  } catch (e) {
    bootError = (e && e.name) + ': ' + String(e && e.message).slice(0, 300);
  }
  return { win, bootError };
}

module.exports = { loadBundle };
