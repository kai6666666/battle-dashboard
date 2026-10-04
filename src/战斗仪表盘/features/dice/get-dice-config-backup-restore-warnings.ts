/**
 * get-dice-config-backup-restore-warnings.ts
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

type DiceConfigBackupModuleId =
  | 'uiLayout'
  | 'diceConfig'
  | 'advancedPresets'
  | 'attributePresets'
  | 'actionGm'
  | 'dashboardPresets'
  | 'renderPresets'
  | 'tableTemplate'
  | 'tableTemplateRequirementPresets'
  | 'validation'
  | 'regex'
  | 'avatarMap'
  | 'customIcons'
  | 'gachaSettings';

export function createGetDiceConfigBackupRestoreWarnings(_deps: any) {
  const getDiceConfigBackupRestoreWarnings = (
    backup: DiceConfigBackupDocument,
    warnings: readonly string[],
    moduleIds: readonly DiceConfigBackupModuleId[],
  ): string[] =>
    Array.from(
      new Set([
        ...warnings,
        ...moduleIds.flatMap(moduleId => backup.modules[moduleId]?.warnings || []),
      ]),
    );
  return getDiceConfigBackupRestoreWarnings;
}
