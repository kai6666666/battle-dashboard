/**
 * to-dice-profile-summary.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiceProfileRecord = { id: string; [key: string]: any };
type DiceProfileSummary = Record<string, any>;

export function createToDiceProfileSummary(_deps: any) {
  const toDiceProfileSummary = (record: DiceProfileRecord): DiceProfileSummary => ({
    id: record.id,
    name: record.name,
    source: record.source,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    moduleIds: record.moduleIds,
    fingerprint: record.fingerprint,
    ...(record.lastAppliedAt ? { lastAppliedAt: record.lastAppliedAt } : {}),
  });
  return toDiceProfileSummary;
}
