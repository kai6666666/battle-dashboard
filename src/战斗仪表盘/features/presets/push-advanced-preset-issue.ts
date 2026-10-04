/**
 * push-advanced-preset-issue.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type AdvancedPresetValidationIssue = {
  path: string;
  message: string;
};

export function createPushAdvancedPresetIssue(_deps: any) {
  const pushAdvancedPresetIssue = (issues: AdvancedPresetValidationIssue[], path: string, message: string): void => {
    issues.push({ path, message });
  };
  return pushAdvancedPresetIssue;
}
