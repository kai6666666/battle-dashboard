/**
 * get-advanced-preset-display-outcome.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { OutcomeLevel } from '../../shared/advanced-preset-types';

interface AdvancedPresetOutcomePolicyResult {
  outcome: OutcomeLevel;
  requiredOutcome?: OutcomeLevel;
  isUnmet: boolean;
}

export function createGetAdvancedPresetDisplayOutcome(_deps: any) {
  const getAdvancedPresetDisplayOutcome = (policyResult: AdvancedPresetOutcomePolicyResult): OutcomeLevel =>
    policyResult.isUnmet && policyResult.requiredOutcome ? policyResult.requiredOutcome : policyResult.outcome;
  return getAdvancedPresetDisplayOutcome;
}
