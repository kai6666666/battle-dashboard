/**
 * get-dice-config-backup-module-definition.ts
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

export function createGetDiceConfigBackupModuleDefinition(deps: any) {
  const getDiceConfigBackupModuleDefinition = (moduleId: DiceConfigBackupModuleId) =>
    deps.getDICE_CONFIG_BACKUP_MODULES().find((module: any) => module.id === moduleId) || null;
  return getDiceConfigBackupModuleDefinition;
}
