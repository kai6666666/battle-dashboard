/**
 * download-dice-config-backup-json.ts
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

export function createDownloadDiceConfigBackupJson(deps: any) {
  const downloadDiceConfigBackupJson = (backup: DiceConfigBackupDocument): void => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    deps.downloadJsonFile(JSON.stringify(backup, null, 2), `acu_dice_config_backup_${timestamp}.json`);
  };
  return downloadDiceConfigBackupJson;
}
