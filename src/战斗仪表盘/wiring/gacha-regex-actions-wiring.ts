/**
 * wiring / gacha-regex-actions-wiring.ts — 抽卡正则动作装配簇（从 index.ts 迁出，x4-ag）。
 */
import { createBindAcuDiceGachaRegexActions } from '../features/api/bind-acu-dice-gacha-regex-actions';
import { createGachaRegexActionsInstance } from '../features/gacha/gacha-regex-actions-instance';

export function createGachaRegexActionsWiring(deps: any) {
  const { acuDiceGachaApi, getCore, getRuntimeErrorMessage, rootWindow } = deps;
  const gachaRegexActions = createGachaRegexActionsInstance({
    getCore: (...a: any[]) => getCore(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getAcuDiceGachaApi: () => acuDiceGachaApi,
    getRootWindow: () => rootWindow,
  });

  const bindAcuDiceGachaRegexActions = createBindAcuDiceGachaRegexActions({
    gachaRegexActions: gachaRegexActions,
  });
  return { bindAcuDiceGachaRegexActions };
}
