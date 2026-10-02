/**
 * get-dice-config-backup-module-count-text.ts
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

export function createGetDiceConfigBackupModuleCountText(_deps: any) {
  const getDiceConfigBackupModuleCountText = (
    moduleId: DiceConfigBackupModuleId,
    storageCount: number,
    resourceCount: number,
    hasBackupPayload: boolean,
  ): string => {
    if (moduleId === 'tableTemplate' && !hasBackupPayload) return '模板';
    if (storageCount > 0 && resourceCount > 0) return `${storageCount}+${resourceCount} 项`;
    return `${storageCount + resourceCount} 项`;
  };
  return getDiceConfigBackupModuleCountText;
}
