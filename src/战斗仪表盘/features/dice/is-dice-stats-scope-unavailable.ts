/**
 * is-dice-stats-scope-unavailable.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { DiceStatsScope } from '../../shared/index-local-types';

interface DiceStatsContext {
  chatId: string;
  characterId: string;
  [key: string]: any;
}

export function createIsDiceStatsScopeUnavailable(_deps: any) {
  const isDiceStatsScopeUnavailable = (scope: DiceStatsScope, context: DiceStatsContext): boolean =>
    (scope === 'chat' && context.chatId === 'unknown_chat') ||
    (scope === 'character' && context.characterId === 'unknown_character');
  return isDiceStatsScopeUnavailable;
}
