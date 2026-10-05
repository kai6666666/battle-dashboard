// features/dnd-panels/panels-archive-b.ts
// 导入队伍 / 导出结果 / 导入对话框 / JSON 解析（b10b · 自 BasedonST `src/ui/modules/UIPanels.js` 拆分移植）
import { DND_CONFIG } from '../dnd-core';

export function createPanelsArchiveBFragment(deps: any): any {
  return {
    importPartyFromFile() {
        this.showImportDialog();
    },

    // [新增] 显示导出结果窗口（复制到剪贴板 / 下载文件）
    showExportResultDialog(data, count) {
        const { $ } = deps.utils.getCore();
        const jsonStr = JSON.stringify(data, null, 2);
        const fileName = `DND_Party_${new Date().toISOString().slice(0, 10)}.json`;
        const safeJsonHtml = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;');

        const modalContent = `
            <div style="margin-bottom:12px;">
                <p style="color:var(--dnd-text-dim);margin-bottom:8px;">已生成 ${count} 个角色的导出数据（约 ${(jsonStr.length / 1024).toFixed(1)} KB）。</p>
                <p style="color:var(--dnd-text-highlight);font-size:12px;margin-bottom:10px;">💡 若"下载文件"在当前环境无效，请改用"复制到剪贴板"，把内容粘贴保存为 <b>${fileName}</b> 即可完成备份。</p>
                <textarea id="dnd-export-result-textarea" readonly style="width:100%;height:180px;background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-inner);border-radius:4px;color:var(--dnd-text-main);font-size:11px;font-family:monospace;padding:8px;resize:vertical;box-sizing:border-box;">${safeJsonHtml}</textarea>
            </div>
            <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;">
                <button class="dnd-btn dnd-export-copy-btn" style="background:var(--dnd-bg-tertiary);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);padding:8px 16px;border-radius:4px;cursor:pointer;">📋 复制到剪贴板</button>
                <button class="dnd-btn dnd-export-download-btn" style="background:var(--dnd-bg-tertiary);border:1px solid var(--dnd-border-gold);color:var(--dnd-text-main);padding:8px 16px;border-radius:4px;cursor:pointer;">💾 下载文件</button>
                <button class="dnd-btn dnd-export-result-close-btn" style="background:var(--dnd-border-gold);border:none;color:var(--dnd-text-header);padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:bold;">关闭</button>
            </div>
        `;

        this.showModal('📤 导出结果', modalContent);

        const $overlay = $('#dnd-modal-overlay');
        const $ta = $overlay.find('#dnd-export-result-textarea');

        // 点击文本框时自动全选，便于手动复制
        $ta.on('click', function() { this.select(); });

        // 复制到剪贴板
        $overlay.find('.dnd-export-copy-btn').on('click', async function() {
            const text = $ta.val();
            let copied = false;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text);
                    copied = true;
                }
            } catch (e) { copied = false; }

            if (!copied) {
                // 回退方案：选中文本 + execCommand
                try {
                    $ta[0].focus();
                    $ta[0].select();
                    copied = document.execCommand('copy');
                } catch (e) { copied = false; }
            }

            if (copied) {
                deps.notification.success('已复制到剪贴板');
            } else {
                deps.notification.warning('复制失败：请手动长按/全选文本框内容进行复制');
            }
        });

        // 下载文件（部分环境不可用时给出提示）
        $overlay.find('.dnd-export-download-btn').on('click', function() {
            try {
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                deps.notification.success('已触发下载：' + fileName);
            } catch (e) {
                deps.logger.error('Download failed:', e);
                deps.notification.error('下载失败（当前环境可能禁止下载），请使用"复制到剪贴板"方式保存');
            }
        });

        // 关闭
        $overlay.find('.dnd-export-result-close-btn').on('click', () => {
            $overlay.removeClass('active');
        });
    },

    // [新增] 导入窗口（粘贴 / 文件两种方式入口）
    showImportDialog() {
        const { $ } = deps.utils.getCore();

        const modalContent = `
            <div style="margin-bottom:12px;">
                <p style="color:var(--dnd-text-dim);margin-bottom:8px;">选择一种方式提供队伍数据：</p>
                <textarea id="dnd-import-paste-textarea" placeholder="【方式一】在此粘贴队伍 JSON 内容（从'导出结果'中复制的文本）..." style="width:100%;height:150px;background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-inner);border-radius:4px;color:var(--dnd-text-main);font-size:11px;font-family:monospace;padding:8px;resize:vertical;box-sizing:border-box;"></textarea>
            </div>
            <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;">
                <button class="dnd-btn dnd-import-from-file-btn" style="background:var(--dnd-bg-tertiary);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);padding:8px 16px;border-radius:4px;cursor:pointer;">📂 从文件选择</button>
                <button class="dnd-btn dnd-import-next-btn" style="background:var(--dnd-border-gold);border:none;color:var(--dnd-text-header);padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:bold;">📥 下一步</button>
                <button class="dnd-btn dnd-import-dialog-cancel-btn" style="background:var(--dnd-bg-tertiary);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);padding:8px 16px;border-radius:4px;cursor:pointer;">取消</button>
            </div>
        `;

        this.showModal('📥 导入队伍', modalContent);

        const $overlay = $('#dnd-modal-overlay');
        const self = this;

        // 从文件选择（读取后进入导入选项）
        $overlay.find('.dnd-import-from-file-btn').on('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    const json = self._parsePartyImportJson(event.target.result);
                    if (json) {
                        $overlay.removeClass('active');
                        self.showImportOptionsDialog(json);
                    }
                };
                reader.onerror = () => {
                    deps.notification.error('文件读取失败');
                };
                reader.readAsText(file);
            };

            input.click();
        });

        // 下一步：解析粘贴内容
        $overlay.find('.dnd-import-next-btn').on('click', function() {
            const text = $overlay.find('#dnd-import-paste-textarea').val();
            if (!text || !text.trim()) {
                deps.notification.error('请先粘贴队伍 JSON 内容，或选择"从文件选择"');
                return;
            }
            const json = self._parsePartyImportJson(text);
            if (json) {
                $overlay.removeClass('active');
                self.showImportOptionsDialog(json);
            }
        });

        // 取消
        $overlay.find('.dnd-import-dialog-cancel-btn').on('click', () => {
            $overlay.removeClass('active');
        });
    },

    // [新增] 解析并校验队伍导入 JSON（成功返回对象，失败返回 null）
    _parsePartyImportJson(text) {
        try {
            const json = JSON.parse(text);
            if (!json || !json.party || !Array.isArray(json.party) || json.party.length === 0) {
                deps.notification.error('无效的数据格式或无角色数据');
                return null;
            }
            return json;
        } catch (err) {
            deps.logger.error('Import parse error:', err);
            deps.notification.error('JSON 解析失败，请检查粘贴内容或所选文件');
            return null;
        }
    },

    // [新增] 显示导入选项对话框 (角色选择 + 导入模式)
  };
}
