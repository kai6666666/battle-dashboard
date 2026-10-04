/**
 * create-default-gacha-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaState } from './gacha-types';
export function createCreateDefaultGachaState(deps: any) {
  const createDefaultGachaState = (): GachaState => deps.getGachaStateCore().createDefault();
  return createDefaultGachaState;
}
