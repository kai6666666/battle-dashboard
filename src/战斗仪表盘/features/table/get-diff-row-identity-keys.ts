/**
 * get-diff-row-identity-keys.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiffRow = unknown[];

export function createGetDiffRowIdentityKeys(deps: any) {
  const getDiffRowIdentityKeys = (headers: DiffRow, row: DiffRow): string[] => {
    const keys: string[] = [];
    const addKey = (key: string): void => {
      if (key && !keys.includes(key)) keys.push(key);
    };

    deps.getDiffPreferredColumns(headers).forEach((colIndex: any) => {
      const value = deps.normalizeDiffText(row[colIndex]);
      if (!value) return;
      const headerKey = deps.normalizeDiffHeader(headers[colIndex]);
      if (headerKey) addKey(`h:${headerKey}:${value}`);
      addKey(`c:${colIndex}:${value}`);
    });

    const fullRowKey = row
      .slice(1)
      .map((cell: any) => deps.normalizeDiffText(cell))
      .join('\u0001');
    if (fullRowKey.replace(/\u0001/g, '')) addKey(`full:${fullRowKey}`);

    return keys;
  };
  return getDiffRowIdentityKeys;
}
