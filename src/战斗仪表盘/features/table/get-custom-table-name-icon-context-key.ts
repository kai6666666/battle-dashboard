/**
 * get-custom-table-name-icon-context-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { CustomTableNameIconContext } from '../../shared/index-local-types';

export function createGetCustomTableNameIconContextKey(deps: any) {
  const getCustomTableNameIconContextKey = (context: CustomTableNameIconContext): string =>
    [context.moduleId, context.tableName, context.section, context.name]
      .map(deps.normalizeCustomTableNameIconKeyPart)
      .join('||');
  return getCustomTableNameIconContextKey;
}
