/**
 * read-runtime-table-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReadRuntimeTableData(_deps: any) {
  const readRuntimeTableData = (api: unknown): unknown => {
    const record = api as Record<string, unknown> | null | undefined;
    // x9h①：优先走文档化只读入口 exportTableAsJson（返回运行时活引用，可安全用于就地补丁）；
    // getCurrentData 为旧版数据库兼容入口，仅作兜底。
    if (typeof record?.exportTableAsJson === 'function') {
      return (record.exportTableAsJson as () => unknown).call(api);
    }
    if (typeof record?.getCurrentData === 'function') {
      return (record.getCurrentData as () => unknown).call(api);
    }
    return null;
  };
  return readRuntimeTableData;
}
