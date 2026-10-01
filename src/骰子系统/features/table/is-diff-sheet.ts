/**
 * is-diff-sheet.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiffSheet = { content?: unknown[]; [key: string]: any };

export function createIsDiffSheet(deps: any) {
  const isDiffSheet = (value: unknown): value is DiffSheet => {
    const record = deps.asDiffRecord(value);
    return Boolean(record && Array.isArray(record.content));
  };
  return isDiffSheet;
}
