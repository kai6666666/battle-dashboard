/**
 * mark-legacy-gacha-state-migrated.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createMarkLegacyGachaStateMigrated(deps: any) {
  const markLegacyGachaStateMigrated = () => deps.getGachaStore().markMigrated();
  return markLegacyGachaStateMigrated;
}
