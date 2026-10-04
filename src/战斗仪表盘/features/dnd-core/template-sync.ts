// features/dnd-core/template-sync.ts
// DND 仪表盘模板同步（自 BasedonST `src/features/TemplateSync.js` 移植，b2）
// 职责：内置模板随包导入（版本比对 → 弹窗确认 → importTemplateFromData）。
// 依赖替换：UIUtils.NotificationSystem → notify 适配器（b3 后桥接 UI 版）。

import type { DndLogger } from './logger';
import type { DndDBAdapter } from './db-adapter';
import type { DndUtils } from './utils';
import type { DndNotify } from './notify';
import { EMBEDDED_TEMPLATE } from './embedded-template';
import { DND_CONFIG } from './config';

export interface DndTemplateSync {
  manualImport(options?: { skipConfirm?: boolean; confirmMessage?: string | null; confirmTitle?: string | null }): Promise<boolean>;
  init(): Promise<void>;
}

export interface DndTemplateSyncDeps {
  logger: DndLogger;
  dbAdapter: DndDBAdapter;
  utils: DndUtils;
  notify: DndNotify;
}

export function createDndTemplateSync(deps: DndTemplateSyncDeps): DndTemplateSync {
  const { logger, dbAdapter, utils, notify } = deps;

  // 读取内置模板并导入
  const importEmbeddedTemplate = async (version: string): Promise<boolean> => {
    try {
      notify.info('正在准备内置模板...', '模板同步');

      const templateData = JSON.parse(JSON.stringify(EMBEDDED_TEMPLATE));
      const importOptions = {
        scope: 'global',
        presetName: `DND仪表盘 ${version}`,
      };

      // 基本校验
      if (!templateData || !templateData.mate || templateData.mate.type !== 'chatSheets') {
        throw new Error('模板数据格式无效：缺少 mate.type=chatSheets');
      }

      const sheetCount = Object.keys(templateData).filter(k => k.startsWith('sheet_')).length;
      if (sheetCount === 0) {
        throw new Error('模板数据格式无效：没有找到任何 sheet');
      }

      const invalidSheet = Object.entries(templateData).find(
        ([key, value]: [string, any]) =>
          key.startsWith('sheet_') &&
          (!value || typeof value !== 'object' || !('name' in value) || !('content' in value) || !('sourceData' in value)),
      );
      if (invalidSheet) {
        throw new Error(`模板数据格式无效：${invalidSheet[0]} 缺少 name/content/sourceData 字段`);
      }

      logger.info(`[TemplateSync] 内置模板准备完成，包含 ${sheetCount} 个表格`);

      // 调用数据库 API 导入模板
      const api = utils.getCore().getDB();
      if (!api || !api.importTemplateFromData) {
        throw new Error('当前数据库 API 不支持模板导入，请先确认数据库插件已启用。');
      }
      let result = await api.importTemplateFromData(templateData, importOptions);

      if (!result || !result.success) {
        logger.warn('[TemplateSync] 对象导入失败，尝试以 JSON 字符串重试:', result?.message || '未知错误');
        const retryPayload = JSON.stringify(templateData);
        const retryResult = await api.importTemplateFromData(retryPayload, importOptions);
        if (retryResult && retryResult.success) {
          result = retryResult;
        } else {
          const primaryMsg = result?.message || '未知错误';
          const retryMsg = retryResult?.message || '未知错误';
          throw new Error(
            `API 导入失败: ${primaryMsg}${retryMsg && retryMsg !== primaryMsg ? `；字符串重试失败: ${retryMsg}` : ''}`,
          );
        }
      }

      if (result && result.success) {
        await dbAdapter.setSetting(DND_CONFIG.STORAGE_KEYS.TEMPLATE_SYNCED_VERSION, version);
        notify.success(`模板导入成功 (${sheetCount} 个表格)`, '模板同步');
        logger.info(`[TemplateSync] 模板 v${version} 导入成功`);
        return true;
      }

      return false;
    } catch (err: any) {
      logger.error('[TemplateSync] 导入内置模板失败:', err);
      notify.error(`模板同步失败: ${err.message}\n\n你可以稍后重新打开页面后重试。`, '模板同步');
      return false;
    }
  };

  // 手动触发模板导入
  const manualImport = async (
    options: { skipConfirm?: boolean; confirmMessage?: string | null; confirmTitle?: string | null } = {},
  ): Promise<boolean> => {
    try {
      const currentVersion = DND_CONFIG.TEMPLATE_SYNC.CURRENT_VERSION;
      const api = utils.getCore().getDB();

      const { skipConfirm = false, confirmMessage = null, confirmTitle = null } = options || {};

      if (!api || !api.importTemplateFromData) {
        notify.error('当前数据库 API 不支持模板导入，请先确认数据库插件已启用。', '模板同步');
        return false;
      }

      const message =
        confirmMessage ||
        `确定要手动导入 DND 仪表盘 v${currentVersion} 的内置模板吗？\n\n这会将当前数据库模板替换为插件内置模板结构。`;

      const confirmed = skipConfirm
        ? true
        : await notify.confirm(message, {
            title: confirmTitle || '手动导入模板',
            confirmText: '立即导入',
            cancelText: '取消',
            type: 'warning',
          });

      if (!confirmed) {
        logger.info('[TemplateSync] 用户取消手动模板导入');
        return false;
      }

      return await importEmbeddedTemplate(currentVersion);
    } catch (err: any) {
      logger.error('[TemplateSync] 手动导入失败:', err);
      notify.error(`手动导入模板失败: ${err.message}`, '模板同步');
      return false;
    }
  };

  // 初始化：检查是否需要同步模板（需在 API 可用之后调用）
  const init = async (): Promise<void> => {
    try {
      const currentVersion = DND_CONFIG.TEMPLATE_SYNC.CURRENT_VERSION;
      const syncedVersion = await dbAdapter.getSetting(DND_CONFIG.STORAGE_KEYS.TEMPLATE_SYNCED_VERSION);

      logger.debug('[TemplateSync] 当前版本:', currentVersion, '已同步版本:', syncedVersion);

      if (syncedVersion === currentVersion) {
        logger.debug('[TemplateSync] 模板已是最新版本，跳过同步');
        return;
      }

      const api = utils.getCore().getDB();
      if (!api || !api.importTemplateFromData) {
        logger.warn('[TemplateSync] 数据库 API 不可用或不支持 importTemplateFromData，跳过模板同步');
        return;
      }

      const isFirstTime = !syncedVersion;
      const message = isFirstTime
        ? `检测到首次使用 DND 仪表盘 v${currentVersion}，是否导入配套模板？\n\n导入模板后，数据库将使用最新的表格结构，确保仪表盘功能正常运行。`
        : `DND 仪表盘已从 v${syncedVersion} 更新到 v${currentVersion}，是否导入最新配套模板？\n\n新版本可能包含表格结构调整，建议导入以确保兼容性。`;

      const confirmed = await notify.confirm(message, {
        title: isFirstTime ? '导入配套模板' : '模板更新可用',
        confirmText: '导入模板',
        cancelText: '跳过',
        type: 'info',
      });

      if (!confirmed) {
        logger.info('[TemplateSync] 用户跳过模板导入');
        return;
      }

      await importEmbeddedTemplate(currentVersion);
    } catch (err) {
      logger.error('[TemplateSync] 初始化失败:', err);
    }
  };

  return { manualImport, init };
}