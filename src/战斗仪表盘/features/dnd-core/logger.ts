// features/dnd-core/logger.ts
// DND 仪表盘日志器（自 BasedonST `src/core/Logger.js` 移植，b1）
// 工厂 + DI 风格：级别为可变状态（accessor），前缀可注入。

export interface DndLoggerDeps {
  level?: number;
  prefix?: string;
}

export interface DndLogger {
  getLevel(): number;
  setLevel(value: number): void;
  readonly prefix: string;
  error(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  info(...args: unknown[]): void;
  debug(...args: unknown[]): void;
  diagnose(): void;
}

export function createDndLogger(deps: DndLoggerDeps = {}): DndLogger {
  let level = deps.level ?? 4; // 0=关闭, 1=错误, 2=警告, 3=信息, 4=调试
  const prefix = deps.prefix ?? '[DND Dashboard]';

  const logger: DndLogger = {
    getLevel: () => level,
    setLevel: (value: number) => {
      level = value;
    },
    prefix,
    error: (...args: unknown[]) => {
      if (level >= 1) console.error(prefix, '❌ ERROR:', ...args);
    },
    warn: (...args: unknown[]) => {
      if (level >= 2) console.warn(prefix, '⚠️ WARN:', ...args);
    },
    info: (...args: unknown[]) => {
      if (level >= 3) console.info(prefix, '📋 INFO:', ...args);
    },
    debug: (...args: unknown[]) => {
      if (level >= 4) console.log(prefix, '🔍 DEBUG:', ...args);
    },
    // 诊断函数：输出当前环境状态
    diagnose: () => {
      try {
        const w = window as any;
        console.group(prefix + ' 🔬 环境诊断');
        console.log('window.jQuery:', typeof w.jQuery, w.jQuery ? w.jQuery.fn?.jquery : 'N/A');
        try {
          const parentJQ = w.parent?.jQuery;
          console.log('window.parent.jQuery:', typeof parentJQ, parentJQ ? parentJQ.fn?.jquery : 'N/A');
        } catch (e: any) {
          console.log('window.parent.jQuery: 访问被阻止 (跨域)', e?.message);
        }
        console.log('document.body:', !!document.body);
        console.log('#dnd-toggle-btn 存在:', !!document.getElementById('dnd-toggle-btn'));
        console.log('#dnd-dashboard-root 存在:', !!document.getElementById('dnd-dashboard-root'));
        console.log('#dnd-mini-hud 存在:', !!document.getElementById('dnd-mini-hud'));
        console.log('window.AutoCardUpdaterAPI:', typeof w.AutoCardUpdaterAPI);
        try {
          console.log('parent.AutoCardUpdaterAPI:', typeof w.parent?.AutoCardUpdaterAPI);
        } catch {
          console.log('parent.AutoCardUpdaterAPI: 访问被阻止');
        }
        console.log('在 iframe 中:', window !== window.top);
        console.log('window.location:', window.location.href.substring(0, 100));
        console.groupEnd();
      } catch (e) {
        console.warn(prefix, 'diagnose failed:', e);
      }
    },
  };

  // 全局暴露 Logger 以便在控制台调用（与原实现保持一致）
  try {
    (window as any).DND_Dashboard_Logger = logger;
  } catch {
    /* 非浏览器环境忽略 */
  }

  return logger;
}