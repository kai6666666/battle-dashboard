/**
 * evaluate-check-suggestion-outcome.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { RollResult } from '../../shared/types';
type AdvancedDicePreset = Record<string, any>;
interface AdvancedPresetOutcomePolicyResult {
  outcome: any;
  requiredOutcome?: any;
  isUnmet: boolean;
}

export function createEvaluateCheckSuggestionOutcome(deps: any) {
  const evaluateCheckSuggestionOutcome = (
    preset: AdvancedDicePreset,
    context: Record<string, string | number | boolean | RollResult>,
  ): AdvancedPresetOutcomePolicyResult => {
    const matchedOutcome = deps.evaluateOutcomes(preset.outcomes, context as Record<string, number>);
    return deps.applyAdvancedPresetOutcomePolicy(preset, matchedOutcome, context);
  };
  return evaluateCheckSuggestionOutcome;
}
