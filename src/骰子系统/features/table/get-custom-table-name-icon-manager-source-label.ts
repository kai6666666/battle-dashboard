/**
 * get-custom-table-name-icon-manager-source-label.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type CustomTableNameIconManagerCandidateSource = string;

export function createGetCustomTableNameIconManagerSourceLabel(_deps: any) {
  const getCustomTableNameIconManagerSourceLabel = (source: CustomTableNameIconManagerCandidateSource): string => {
    if (source === 'direct') return '表格条目';
    if (source === 'interaction') return '交互条目';
    return '已保存映射';
  };
  return getCustomTableNameIconManagerSourceLabel;
}
