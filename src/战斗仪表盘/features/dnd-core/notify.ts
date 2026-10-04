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

  // 最小确认实现：优先 toastr（若宿主可用），否则 window.confirm
  const confirm = async (message: string, options: DndNotifyConfirmOptions = {}): Promise<boolean> => {
    try {
      const w = window as any;
      if (w.toastr) {
        const t = options.title || '确认';
        return await new Promise<boolean>(resolve => {
          w.toastr.info(`<div style="margin-bottom:6px;">${message.replace(/\n/g, '<br>')}</div>` +
            `<div style="display:flex;gap:8px;justify-content:flex-end;">` +
            `<button class="menu_button" data-dnd-confirm="1">${options.confirmText || '确定'}</button>` +
            `<button class="menu_button" data-dnd-confirm="0">${options.cancelText || '取消'}</button></div>`,
            t, { timeOut: 0, extendedTimeOut: 0, tapToDismiss: false, onShown: () => {
              const $box = (window as any).$ ? (window as any).$('[data-dnd-confirm]') : null;
              if ($box && $box.length) {
                $box.off('click.dndConfirm').on('click.dndConfirm', function (this: any) {
                  resolve(String((window as any).$(this).attr('data-dnd-confirm')) === '1');
                  (window as any).toastr.clear();
                });
              }
            } });
        });
      }
    } catch (e) {
      logger.warn('[notify] toastr confirm 失败，降级原生 confirm:', e);
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