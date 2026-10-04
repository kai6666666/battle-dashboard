/**
 * get-dice-profile-module-names.ts
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

export function createGetDiceProfileModuleNames(deps: any) {
  const getDiceProfileModuleNames = (moduleIds: readonly DiceConfigBackupModuleId[]): string =>
    moduleIds
      .map(moduleId => deps.getDiceConfigBackupModuleDefinition(moduleId)?.name || moduleId)
      .join('、');
  return getDiceProfileModuleNames;
}
