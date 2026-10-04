/**
 * has-runtime-table-read-api.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHasRuntimeTableReadApi(_deps: any) {
  const hasRuntimeTableReadApi = (api: unknown): boolean => {
    const record = api as Record<string, unknown> | null | undefined;
    // x9h①：文档化只读入口 exportTableAsJson 优先探测；getCurrentData 为旧版数据库兼容入口。
    return typeof record?.exportTableAsJson === 'function' || typeof record?.getCurrentData === 'function';
  };
  return hasRuntimeTableReadApi;
}
