// features/dnd-core/notify.ts
// DND 仪表盘通知适配器（b2）
// 说明：原 TemplateSync 依赖 UIUtils 的 NotificationSystem（b3 才移植）。
// 此处提供同构接口的最小实现（console + window.confirm），b3 后由 index 接线替换为 UI 版。

import type { DndLogger } from './logger';

export interface DndNotifyConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export interface DndNotify {
  info(message: string, title?: string): void;
  success(message: string, title?: string): void;
  error(message: string, title?: string): void;
  warn(message: string, title?: string): void;
  confirm(message: string, options?: DndNotifyConfirmOptions): Promise<boolean>;
}

export interface DndNotifyDeps {
  logger: DndLogger;
}

export function createDndNotify(deps: DndNotifyDeps): DndNotify {
  const { logger } = deps;

  const info = (message: string, title = ''): void => logger.info(`[notify]${title ? ' [' + title + ']' : ''} ${message}`);
  const success = (message: string, title = ''): void => logger.info(`[notify✓]${title ? ' [' + title + ']' : ''} ${message}`);
  const warn = (message: string, title = ''): void => logger.warn(`[notify]${title ? ' [' + title + ']' : ''} ${message}`);
  const error = (message: string, title = ''): void => logger.error(`[notify✗]${title ? ' [' + title + ']' : ''} ${message}`);

  // [b12.1] 自建 DOM 对话框确认（去 toastr 依赖；宿主持久弹窗在某些环境会把 HTML 转义为纯文本）
  const confirm = async (message: string, options: DndNotifyConfirmOptions = {}): Promise<boolean> => {
    try {
      const title = options.title || '确认';
      const overlay = document.createElement('div');
      overlay.setAttribute('data-dnd-confirm-overlay', '1');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:2147483000;display:flex;align-items:center;justify-content:center;';
      const msgHtml = String(message).replace(/\n/g, '<br>');
      overlay.innerHTML =
        '<div style="max-width:440px;width:calc(100% - 40px);background:#23262d;color:#e8e3d5;border:1px solid rgba(200,180,120,.45);border-radius:10px;padding:16px;box-shadow:0 12px 40px rgba(0,0,0,.5);font-size:13px;line-height:1.6;">'
        + '<div style="font-weight:700;margin-bottom:10px;color:#ffdb85;">' + title + '</div>'
        + '<div style="margin-bottom:14px;">' + msgHtml + '</div>'
        + '<div style="display:flex;gap:8px;justify-content:flex-end;">'
        + '<button type="button" data-dnd-cf-1="1" style="cursor:pointer;padding:6px 14px;border-radius:6px;border:1px solid rgba(200,180,120,.6);background:#3a3f4b;color:#ffe9b0;font-size:12px;">' + (options.confirmText || '确定') + '</button>'
        + '<button type="button" data-dnd-cf-0="1" style="cursor:pointer;padding:6px 14px;border-radius:6px;border:1px solid rgba(120,120,120,.4);background:transparent;color:#cfc9ba;font-size:12px;">' + (options.cancelText || '取消') + '</button>'
        + '</div></div>';
      const cleanup = () => { try { overlay.remove(); } catch (e) {} };
      const result = await new Promise<boolean>(resolve => {
        overlay.addEventListener('click', (ev: any) => {
          const el = ev.target;
          if (el && el.getAttribute && el.getAttribute('data-dnd-cf-1')) { cleanup(); resolve(true); return; }
          if (el && el.getAttribute && el.getAttribute('data-dnd-cf-0')) { cleanup(); resolve(false); return; }
          if (ev.target === overlay) { cleanup(); resolve(false); }
        });
        document.body.appendChild(overlay);
      });
      return result;
    } catch (e) {
      logger.warn('[notify] 自建 confirm 失败，降级原生 confirm:', e);
    }
    try {
      const text = `${options.title ? options.title + '\n\n' : ''}${message}`;
      return window.confirm(text);
    } catch {
      return false;
    }
  };
  return { info, success, error, warn, confirm };
}