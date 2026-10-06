/**
 * features/console/console-capture-manager.ts
 * Feature-Sliced: batch extract (FSD batch A1).
 */


export const ConsoleCaptureManager = {
    logs: [] as any[],
    maxLogs: 1000,
    filters: { log: true, info: true, warn: true, error: true },
    originalMethods: {} as Record<string, any>,
    isIntercepted: false,
    enabled: false, // 默认关闭，需要手动开启或错误时自动开启

    restore() {
      // [b13.2.12] 不再自动恢复抓取（修复“切换版本/重开后自动打开”问题）
      // 清理历史遗留标记，避免旧的开启状态被反复恢复
      try { localStorage.removeItem('acu_console_capture_enabled'); } catch (e) {}
      try { localStorage.removeItem('acu_script_error_detected'); } catch (e) {}
      this.enabled = false;
    },

    enable() {
      if (this.enabled) return;
      this.enabled = true;
      localStorage.setItem('acu_console_capture_enabled', 'true');
      this.intercept();
    },

    disable() {
      if (!this.enabled) return;
      this.enabled = false;
      localStorage.setItem('acu_console_capture_enabled', 'false');
      // 清除错误标志（尊重用户选择）
      localStorage.removeItem('acu_script_error_detected');
      // 隐藏紧急入口按钮
      const emergencyBtn = document.getElementById('acu-emergency-debug-btn');
      if (emergencyBtn) {
        emergencyBtn.style.display = 'none';
      }
    },

    intercept() {
      if (this.isIntercepted) return;
      this.isIntercepted = true;

      ['log', 'info', 'warn', 'error'].forEach(type => {
        this.originalMethods[type] = (console as unknown as Record<string, any>)[type];
        const self = this;
        (console as unknown as Record<string, any>)[type] = function (...args: any[]) {
          // 调用原方法
          self.originalMethods[type].apply(console, args);
          // 记录日志（仅在启用时）
          if (self.enabled) {
            self.capture(type, args);
          }
        };
      });
    },

    capture(type: any, args: any) {
      if (!this.enabled) return; // 仅在启用时捕获
      try {
        const timestamp = new Date();
        const timeStr = timestamp.toLocaleTimeString('zh-CN', { hour12: false });

        // 将参数转换为字符串
        const content = args
          .map((arg: any) => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          })
          .join(' ');

        // 获取堆栈信息（仅error）
        let stack = null;
        if (type === 'error' && args[0] instanceof Error) {
          stack = args[0].stack || null;
        }

        const logEntry = {
          id: Date.now() + Math.random(),
          timestamp,
          timeStr,
          type,
          content,
          stack,
          rawArgs: args,
        };

        this.logs.push(logEntry);

        // 限制日志数量
        if (this.logs.length > this.maxLogs) {
          this.logs.shift();
        }
      } catch (e) {
        // 捕获失败不影响原console功能
      }
    },

    clear() {
      this.logs = [];
    },

    getFilteredLogs() {
      return this.logs.filter((log: any) => (this.filters as Record<string, boolean>)[log.type]);
    },

    setFilters(filters: any) {
      this.filters = { ...this.filters, ...filters };
    },
  };
