/**
 * has-dice-config-backup-recoverable-storage.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
interface DiceConfigBackupModulePayload {
  storage: Record<string, unknown>;
  resources?: Record<string, unknown>;
  warnings?: string[];
}
interface DiceConfigBackupModuleDefinition {
  id: any;
  name: string;
  description: string;
  storageKeys: readonly string[];
  deprecated?: boolean;
  deprecatedReason?: string;
}

export function createHasDiceConfigBackupRecoverableStorage(deps: any) {
  const hasDiceConfigBackupRecoverableStorage = (
    payload: DiceConfigBackupModulePayload,
    definition: DiceConfigBackupModuleDefinition,
  ): boolean =>
    Object.entries(payload.storage || {}).some(([key, value]: [string, any]) => {
      if (!definition.storageKeys.includes(key) || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (deps.isDiceConfigBackupRecord(value)) return Object.keys(value).length > 0;
      return value !== null && value !== '';
    });
  return hasDiceConfigBackupRecoverableStorage;
}
