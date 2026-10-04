/**
 * normalize-dice-profile-module-ids.ts
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

export function createNormalizeDiceProfileModuleIds(deps: any) {
  const normalizeDiceProfileModuleIds = (
    moduleIds: readonly string[] | undefined,
    backup?: DiceConfigBackupDocument,
  ): DiceConfigBackupModuleId[] => {
    const normalized = deps.normalizeDiceConfigBackupSelectedModuleIds(moduleIds || []);
    const available = backup ? deps.getDiceConfigBackupAvailableModuleIds(backup) : deps.getAllDiceConfigBackupModuleIds();
    const availableSet = new Set(available);
    const filtered = normalized.filter((moduleId: any) => availableSet.has(moduleId));
    return filtered.length > 0 ? filtered : available;
  };
  return normalizeDiceProfileModuleIds;
}
