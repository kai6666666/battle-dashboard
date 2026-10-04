/**
 * normalize-dice-config-backup-selected-module-ids.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
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

export function createNormalizeDiceConfigBackupSelectedModuleIds(deps: any) {
  const normalizeDiceConfigBackupSelectedModuleIds = (moduleIds: readonly string[]): DiceConfigBackupModuleId[] => {
    const result: DiceConfigBackupModuleId[] = [];
    moduleIds.forEach(moduleId => {
      if (!deps.isDiceConfigBackupModuleId(moduleId)) return;
      if (!result.includes(moduleId as DiceConfigBackupModuleId)) result.push(moduleId as DiceConfigBackupModuleId);
    });
    return result;
  };
  return normalizeDiceConfigBackupSelectedModuleIds;
}
