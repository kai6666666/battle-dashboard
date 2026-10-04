/**
 * get-dice-profile-records.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DiceProfileDB } from '../../shared/storage/dice-profile-db';
type DiceProfileRecord = { id: string; [key: string]: any };

export function createGetDiceProfileRecords(deps: any) {
  const getDiceProfileRecords = async (): Promise<DiceProfileRecord[]> => {
    try {
      const records = await DiceProfileDB.getAll();
      deps.saveDiceProfileIndex(records.map(deps.toDiceProfileSummary));
      return records as any;
    } catch (error) {
      console.warn('[DICE][PROFILE]读取配置方案库失败:', error);
      return [];
    }
  };
  return getDiceProfileRecords;
}
