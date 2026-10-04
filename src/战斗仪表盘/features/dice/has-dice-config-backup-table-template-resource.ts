/**
 * has-dice-config-backup-table-template-resource.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
interface DiceConfigBackupModulePayload {
  storage: Record<string, unknown>;
  resources?: Record<string, unknown>;
  warnings?: string[];
}

export function createHasDiceConfigBackupTableTemplateResource(deps: any) {
  const hasDiceConfigBackupTableTemplateResource = (payload?: DiceConfigBackupModulePayload): boolean =>
    deps.isDiceConfigBackupRecord(payload?.resources?.[deps.getDICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY()]);
  return hasDiceConfigBackupTableTemplateResource;
}
