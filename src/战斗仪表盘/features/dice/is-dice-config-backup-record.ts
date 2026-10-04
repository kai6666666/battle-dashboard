/**
 * is-dice-config-backup-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsDiceConfigBackupRecord(_deps: any) {
  const isDiceConfigBackupRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  return isDiceConfigBackupRecord;
}
