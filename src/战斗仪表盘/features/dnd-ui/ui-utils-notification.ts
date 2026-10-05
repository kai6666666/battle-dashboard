// features/dnd-ui/ui-utils-notification.ts
// 通知/对话框系统（自 BasedonST `src/ui/modules/UIUtils.js` 移植，b3）
// 工厂 + DI 风格：替代浏览器原生 alert/confirm/prompt（toast + 双路径对话框）。
export interface DndNotificationDeps { getCore: () => any; }

export function createDndNotificationSystem(deps: DndNotificationDeps): any {
const NotificationSystem: any = {
    _container: null,
    _dialogContainer: null,

    // 初始化容器
    _ensureContainer() {
        const { $, window: coreWin } = deps.getCore();
        const $root = coreWin?.jQuery || $;
        const $body = $root('body').first();
        const bodyEl = $body?.[0] || document.body;
        const doc = bodyEl?.ownerDocument || document;
        const $dialogHost = $root('#dnd-dashboard-root.visible');
        const $dialogMount = $dialogHost.length ? $dialogHost : $body;
        const dialogMountEl = $dialogMount?.[0] || bodyEl;

        if (!this._container || !this._container[0] || !bodyEl.contains(this._container[0])) {
            this._container = $root('<div id="dnd-notification-container"></div>');
            $body.append(this._container);
        } else if (this._container[0].parentNode !== bodyEl) {
            $body.append(this._container);
        }

        if (!this._dialogContainer || !this._dialogContainer[0] || !doc.body.contains(this._dialogContainer[0])) {
            this._dialogContainer = $root('<div id="dnd-dialog-container"></div>');
            $dialogMount.append(this._dialogContainer);
        } else if (this._dialogContainer[0].parentNode !== dialogMountEl) {
            $dialogMount.append(this._dialogContainer);
        }
    },

    /**
     * 检测是否应该使用 modal overlay 路径
     * 条件：full dashboard 可见 + modal overlay 存在
     * @returns {boolean}
     */
    _shouldUseModalOverlay() {
        const { $, window: coreWin } = deps.getCore();
        const $root = coreWin?.jQuery || $;
        const $dashboard = $root('#dnd-dashboard-root.visible');
        const $overlay = $root('#dnd-modal-overlay');
        const $modal = $root('#dnd-modal-content');
        // full dashboard 可见 且 overlay/content 都存在
        return $dashboard.length > 0 && $overlay.length > 0 && $modal.length > 0;
    },

    /**
     * 显示通知消息 (替代 alert)
     * @param {string} message - 消息内容
     * @param {Object} options - 配置选项
     * @param {string} options.type - 类型: 'info' | 'success' | 'warning' | 'error'
     * @param {number} options.duration - 显示时长(ms), 0 表示不自动关闭
     * @param {string} options.title - 可选标题
     * @returns {Promise<void>}
     */
    notify(message, options = {}) {
        const { $ } = deps.getCore();
        this._ensureContainer();
        
        const {
            type = 'info',
            duration = 3000,
            title = ''
        } = options;

        const icons = {
            info: '<i class="fa-solid fa-info-circle"></i>',
            success: '<i class="fa-solid fa-check-circle"></i>',
            warning: '<i class="fa-solid fa-exclamation"></i>',
            error: '<i class="fa-solid fa-times-circle"></i>'
        };

        const $toast = $(`
            <div class="dnd-toast dnd-toast-${type}">
                <div class="dnd-toast-icon">${icons[type] || icons.info}</div>
                <div class="dnd-toast-content">
                    ${title ? `<div class="dnd-toast-title">${title}</div>` : ''}
                    <div class="dnd-toast-message">${message}</div>
                </div>
                <button class="dnd-toast-close">×</button>
            </div>
        `);

        // 关闭按钮事件
        $toast.find('.dnd-toast-close').on('click', () => {
            this._dismissToast($toast);
        });

        this._container.append($toast);

        // 触发入场动画
        requestAnimationFrame(() => {
            $toast.addClass('dnd-toast-visible');
        });

        // 自动关闭
        if (duration > 0) {
            setTimeout(() => {
                this._dismissToast($toast);
            }, duration);
        }

        return Promise.resolve();
    },

    _dismissToast($toast) {
        $toast.removeClass('dnd-toast-visible');
        $toast.addClass('dnd-toast-exit');
        setTimeout(() => {
            $toast.remove();
        }, 300);
    },

    /**
     * 显示确认对话框 (替代 confirm)
     * @param {string} message - 消息内容
     * @param {Object} options - 配置选项
     * @param {string} options.title - 标题
     * @param {string} options.confirmText - 确认按钮文字
     * @param {string} options.cancelText - 取消按钮文字
     * @param {string} options.type - 类型: 'info' | 'warning' | 'danger'
     * @returns {Promise<boolean>}
     */
    confirm(message, options = {}) {
        // 检测是否应该使用 modal overlay 路径
        if (this._shouldUseModalOverlay()) {
            return this._confirmViaModalOverlay(message, options);
        }
        // Fallback: 使用自建 dialog
        return this._confirmViaDialog(message, options);
    },

    /**
     * 通过 modal overlay 显示确认对话框
     * @private
     */
    _confirmViaModalOverlay(message, options = {}) {
        const { $, window: coreWin } = deps.getCore();
        const $root = coreWin?.jQuery || $;

        const {
            title = '确认',
            confirmText = '确定',
            cancelText = '取消',
            type = 'info'
        } = options;

        return new Promise((resolve) => {
            const $overlay = $root('#dnd-modal-overlay');
            const $modal = $root('#dnd-modal-content');
            const doc = $overlay[0]?.ownerDocument || coreWin?.document || document;
            
            // 构建对话框内容（复用现有 .dnd-dialog 视觉风格）
            const $content = $root(`
                <div class="dnd-dialog dnd-dialog-${type}" style="position:relative;max-width:min(90vw,450px);max-height:80vh;">
                    <div class="dnd-dialog-header">
                        <span class="dnd-dialog-title">${title}</span>
                        <button class="dnd-dialog-close">×</button>
                    </div>
                    <div class="dnd-dialog-body">
                        <p class="dnd-dialog-message">${message}</p>
                    </div>
                    <div class="dnd-dialog-footer">
                        <button class="dnd-dialog-btn dnd-dialog-btn-cancel">${cancelText}</button>
                        <button class="dnd-dialog-btn dnd-dialog-btn-confirm">${confirmText}</button>
                    </div>
                </div>
            `);

            let closed = false;
            const handlers = {
                confirm: null,
                cancel: null,
                close: null,
                overlayClick: null,
                esc: null
            };

            const cleanup = () => {
                if (closed) return;
                closed = true;
                // 解绑所有事件
                $content.find('.dnd-dialog-btn-confirm').off('click', handlers.confirm);
                $content.find('.dnd-dialog-btn-cancel').off('click', handlers.cancel);
                $content.find('.dnd-dialog-close').off('click', handlers.close);
                $overlay.off('click.dnd-confirm', handlers.overlayClick);
                doc.removeEventListener('keydown', handlers.esc);
                // 清空 modal 内容并关闭 overlay
                $modal.empty();
                $overlay.removeClass('active');
            };

            // 绑定事件
            handlers.confirm = () => { cleanup(); resolve(true); };
            handlers.cancel = () => { cleanup(); resolve(false); };
            handlers.close = () => { cleanup(); resolve(false); };
            handlers.overlayClick = (e) => {
                if (e.target === $overlay[0]) { cleanup(); resolve(false); }
            };
            handlers.esc = (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    cleanup();
                    resolve(false);
                }
            };

            $content.find('.dnd-dialog-btn-confirm').on('click', handlers.confirm);
            $content.find('.dnd-dialog-btn-cancel').on('click', handlers.cancel);
            $content.find('.dnd-dialog-close').on('click', handlers.close);
            $overlay.on('click.dnd-confirm', handlers.overlayClick);
            doc.addEventListener('keydown', handlers.esc);

            // 渲染到 modal content
            $modal.empty().append($content);
            $overlay.addClass('active');
            requestAnimationFrame(() => {
                $content.addClass('dnd-dialog-visible');
            });
        });
    },

    /**
     * 通过自建 dialog 显示确认对话框 (fallback)
     * @private
     */
    _confirmViaDialog(message, options = {}) {
        const { $, window: coreWin } = deps.getCore();
        const $root = coreWin?.jQuery || $;
        this._ensureContainer();
        const doc = this._dialogContainer?.[0]?.ownerDocument || coreWin?.document || document;

        const {
            title = '确认',
            confirmText = '确定',
            cancelText = '取消',
            type = 'info'
        } = options;

        return new Promise((resolve) => {
            const $backdrop = $root('<div class="dnd-dialog-backdrop"></div>');
            const $dialog = $root(`
                <div class="dnd-dialog dnd-dialog-${type}">
                    <div class="dnd-dialog-header">
                        <span class="dnd-dialog-title">${title}</span>
                        <button class="dnd-dialog-close">×</button>
                    </div>
                    <div class="dnd-dialog-body">
                        <p class="dnd-dialog-message">${message}</p>
                    </div>
                    <div class="dnd-dialog-footer">
                        <button class="dnd-dialog-btn dnd-dialog-btn-cancel">${cancelText}</button>
                        <button class="dnd-dialog-btn dnd-dialog-btn-confirm">${confirmText}</button>
                    </div>
                </div>
            `);

            let closed = false;
            const closeDialog = (result) => {
                if (closed) return;
                closed = true;
                doc.removeEventListener('keydown', escHandler);
                $dialog.removeClass('dnd-dialog-visible');
                $backdrop.removeClass('dnd-dialog-backdrop-visible');
                setTimeout(() => {
                    $backdrop.remove();
                }, 200);
                resolve(result);
            };

            $dialog.find('.dnd-dialog-btn-confirm').on('click', () => closeDialog(true));
            $dialog.find('.dnd-dialog-btn-cancel').on('click', () => closeDialog(false));
            $dialog.find('.dnd-dialog-close').on('click', () => closeDialog(false));
            $backdrop.on('click', (e) => {
                // 只有点击 backdrop 本身（不是 dialog）才关闭
                if (e.target === $backdrop[0]) {
                    closeDialog(false);
                }
            });

            // ESC 键关闭
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeDialog(false);
                }
            };
            doc.addEventListener('keydown', escHandler);

            // dialog append 到 backdrop 内部
            $backdrop.append($dialog);
            this._dialogContainer.append($backdrop);

            requestAnimationFrame(() => {
                $backdrop.addClass('dnd-dialog-backdrop-visible');
                $dialog.addClass('dnd-dialog-visible');
            });
        });
    },

    /**
     * 显示输入对话框 (替代 prompt)
     * @param {string} message - 提示消息
     * @param {Object} options - 配置选项
     * @param {string} options.title - 标题
     * @param {string} options.defaultValue - 默认值
     * @param {string} options.placeholder - 占位符
     * @param {string} options.confirmText - 确认按钮文字
     * @param {string} options.cancelText - 取消按钮文字
     * @returns {Promise<string|null>}
     */
    prompt(message, options = {}) {
        // 检测是否应该使用 modal overlay 路径
        if (this._shouldUseModalOverlay()) {
            return this._promptViaModalOverlay(message, options);
        }
        // Fallback: 使用自建 dialog
        return this._promptViaDialog(message, options);
    },

    /**
     * 通过 modal overlay 显示输入对话框
     * @private
     */
    _promptViaModalOverlay(message, options = {}) {
        const { $, window: coreWin } = deps.getCore();
        const $root = coreWin?.jQuery || $;

        const {
            title = '请输入',
            defaultValue = '',
            placeholder = '',
            confirmText = '确定',
            cancelText = '取消'
        } = options;

        //原作者: disocrd类脑 Niccole @niccole0414

        return new Promise((resolve) => {
            const $overlay = $root('#dnd-modal-overlay');
            const $modal = $root('#dnd-modal-content');
            const doc = $overlay[0]?.ownerDocument || coreWin?.document || document;
            
            // 构建对话框内容
            const $content = $root(`
                <div class="dnd-dialog dnd-dialog-prompt" style="position:relative;max-width:min(90vw,450px);max-height:80vh;">
                    <div class="dnd-dialog-header">
                        <span class="dnd-dialog-title">${title}</span>
                        <button class="dnd-dialog-close">×</button>
                    </div>
                    <div class="dnd-dialog-body">
                        <p class="dnd-dialog-message">${message}</p>
                        <input type="text" class="dnd-dialog-input" value="${defaultValue}" placeholder="${placeholder}" />
                    </div>
                    <div class="dnd-dialog-footer">
                        <button class="dnd-dialog-btn dnd-dialog-btn-cancel">${cancelText}</button>
                        <button class="dnd-dialog-btn dnd-dialog-btn-confirm">${confirmText}</button>
                    </div>
                </div>
            `);

            const $input = $content.find('.dnd-dialog-input');

            let closed = false;
            const handlers = {
                confirm: null,
                cancel: null,
                close: null,
                overlayClick: null,
                esc: null,
                inputKeydown: null
            };

            const cleanup = (confirmed) => {
                if (closed) return;
                closed = true;
                const value = confirmed ? $input.val() : null;
                // 解绑所有事件
                $content.find('.dnd-dialog-btn-confirm').off('click', handlers.confirm);
                $content.find('.dnd-dialog-btn-cancel').off('click', handlers.cancel);
                $content.find('.dnd-dialog-close').off('click', handlers.close);
                $overlay.off('click.dnd-prompt', handlers.overlayClick);
                doc.removeEventListener('keydown', handlers.esc);
                $input.off('keydown', handlers.inputKeydown);
                // 清空 modal 内容并关闭 overlay
                $modal.empty();
                $overlay.removeClass('active');
                resolve(value);
            };

            // 绑定事件
            handlers.confirm = () => cleanup(true);
            handlers.cancel = () => cleanup(false);
            handlers.close = () => cleanup(false);
            handlers.overlayClick = (e) => {
                if (e.target === $overlay[0]) { cleanup(false); }
            };
            handlers.esc = (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    cleanup(false);
                }
            };
            handlers.inputKeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    cleanup(true);
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    cleanup(false);
                }
            };

            $content.find('.dnd-dialog-btn-confirm').on('click', handlers.confirm);
            $content.find('.dnd-dialog-btn-cancel').on('click', handlers.cancel);
            $content.find('.dnd-dialog-close').on('click', handlers.close);
            $overlay.on('click.dnd-prompt', handlers.overlayClick);
            doc.addEventListener('keydown', handlers.esc);
            $input.on('keydown', handlers.inputKeydown);

            // 渲染到 modal content
            $modal.empty().append($content);
            $overlay.addClass('active');

            // 聚焦输入框
            requestAnimationFrame(() => {
                $content.addClass('dnd-dialog-visible');
                $input.focus().select();
            });
        });
    },

    /**
     * 通过自建 dialog 显示输入对话框 (fallback)
     * @private
     */
    _promptViaDialog(message, options = {}) {
        const { $, window: coreWin } = deps.getCore();
        const $root = coreWin?.jQuery || $;
        this._ensureContainer();
        const doc = this._dialogContainer?.[0]?.ownerDocument || coreWin?.document || document;

        const {
            title = '请输入',
            defaultValue = '',
            placeholder = '',
            confirmText = '确定',
            cancelText = '取消'
        } = options;

        return new Promise((resolve) => {
            const $backdrop = $root('<div class="dnd-dialog-backdrop"></div>');
            const $dialog = $root(`
                <div class="dnd-dialog dnd-dialog-prompt">
                    <div class="dnd-dialog-header">
                        <span class="dnd-dialog-title">${title}</span>
                        <button class="dnd-dialog-close">×</button>
                    </div>
                    <div class="dnd-dialog-body">
                        <p class="dnd-dialog-message">${message}</p>
                        <input type="text" class="dnd-dialog-input" value="${defaultValue}" placeholder="${placeholder}" />
                    </div>
                    <div class="dnd-dialog-footer">
                        <button class="dnd-dialog-btn dnd-dialog-btn-cancel">${cancelText}</button>
                        <button class="dnd-dialog-btn dnd-dialog-btn-confirm">${confirmText}</button>
                    </div>
                </div>
            `);

            const $input = $dialog.find('.dnd-dialog-input');

            let closed = false;
            const closeDialog = (confirmed) => {
                if (closed) return;
                closed = true;
                const value = confirmed ? $input.val() : null;
                doc.removeEventListener('keydown', escHandler);
                $dialog.removeClass('dnd-dialog-visible');
                $backdrop.removeClass('dnd-dialog-backdrop-visible');
                setTimeout(() => {
                    $backdrop.remove();
                }, 200);
                resolve(value);
            };

            $dialog.find('.dnd-dialog-btn-confirm').on('click', () => closeDialog(true));
            $dialog.find('.dnd-dialog-btn-cancel').on('click', () => closeDialog(false));
            $dialog.find('.dnd-dialog-close').on('click', () => closeDialog(false));
            $backdrop.on('click', (e) => {
                // 只有点击 backdrop 本身（不是 dialog）才关闭
                if (e.target === $backdrop[0]) {
                    closeDialog(false);
                }
            });

            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeDialog(false);
                }
            };
            doc.addEventListener('keydown', escHandler);

            // Enter 确认, ESC 取消
            $input.on('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    closeDialog(true);
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    closeDialog(false);
                }
            });

            // dialog append 到 backdrop 内部
            $backdrop.append($dialog);
            this._dialogContainer.append($backdrop);

            requestAnimationFrame(() => {
                $backdrop.addClass('dnd-dialog-backdrop-visible');
                $dialog.addClass('dnd-dialog-visible');
                $input.focus().select();
            });
        });
    },

    // 快捷方法
    success(message, title = '') {
        return this.notify(message, { type: 'success', title });
    },

    error(message, title = '') {
        return this.notify(message, { type: 'error', title, duration: 5000 });
    },

    warning(message, title = '') {
        return this.notify(message, { type: 'warning', title, duration: 4000 });
    },

    info(message, title = '') {
        return this.notify(message, { type: 'info', title });
    }
};

// 导出通知系统
  return NotificationSystem;
}
