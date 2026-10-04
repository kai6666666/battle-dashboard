/**
 * is-dice-config-backup-module-id.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_CONFIG_BACKUP_MODULES } from './dice-config-backup-modules';
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

export function createIsDiceConfigBackupModuleId(_deps: any) {
  const isDiceConfigBackupModuleId = (value: string): value is DiceConfigBackupModuleId =>
    DICE_CONFIG_BACKUP_MODULES.some(module => module.id === value);
  return isDiceConfigBackupModuleId;
}
