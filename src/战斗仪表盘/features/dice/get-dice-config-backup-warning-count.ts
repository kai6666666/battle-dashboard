/**
 * get-dice-config-backup-warning-count.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
interface DiceConfigBackupModulePayload {
  storage: Record<string, unknown>;
  resources?: Record<string, unknown>;
  warnings?: string[];
}
interface DiceConfigBackupDocument {
  format: string;
  schemaVersion: number;
  exportedAt: string;
  scriptVersion: string;
  presetFormatVersion: string;
  modules: Partial<Record<string, DiceConfigBackupModulePayload>>;
}

export function createGetDiceConfigBackupWarningCount(_deps: any) {
  const getDiceConfigBackupWarningCount = (backup: DiceConfigBackupDocument): number =>
    Object.values(backup.modules).reduce((count, payload) => count + (payload?.warnings?.length || 0), 0);
  return getDiceConfigBackupWarningCount;
}
