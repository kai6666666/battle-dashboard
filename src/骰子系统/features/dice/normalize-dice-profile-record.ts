/**
 * normalize-dice-profile-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { ACU_DICE_PROFILE_FORMAT, computeAcuDiceProfileFingerprint, normalizeAcuDiceProfilePackage, normalizeAcuDiceProfileSource } from '../../features/profiles/profile-packages';
import type { NormalizeAcuDiceProfileOptions } from '../../features/profiles/profile-packages';
type DiceProfileRecord = { id: string; [key: string]: any };

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

export function createNormalizeDiceProfileRecord(deps: any) {
  const normalizeDiceProfileRecord = (
    value: unknown,
    options: NormalizeAcuDiceProfileOptions = {},
  ): DiceProfileRecord => {
    const profilePackage = normalizeAcuDiceProfilePackage<DiceConfigBackupDocument>(value, options);
    const backup = deps.parseDiceConfigBackup(JSON.stringify(profilePackage.backup)).backup;
    const moduleIds = deps.normalizeDiceProfileModuleIds(profilePackage.moduleIds, backup);
    const fingerprint = computeAcuDiceProfileFingerprint(backup, moduleIds);
    const now = options.now || new Date().toISOString();
    return {
      ...profilePackage,
      format: ACU_DICE_PROFILE_FORMAT,
      id: profilePackage.id || `acu_profile_${fingerprint.slice(0, 12)}`,
      source: normalizeAcuDiceProfileSource(profilePackage.source),
      backup,
      moduleIds,
      fingerprint,
      updatedAt: now,
      savedAt: now,
    };
  };
  return normalizeDiceProfileRecord;
}
