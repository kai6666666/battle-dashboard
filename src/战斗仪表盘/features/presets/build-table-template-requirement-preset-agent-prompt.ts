/**
 * build-table-template-requirement-preset-agent-prompt.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import tableTemplateRequirementPresetAgentPromptTemplate from '../../docs/table-template-requirement-preset-agent-prompt.md?raw';
export function createBuildTableTemplateRequirementPresetAgentPrompt(_deps: any) {
  const buildTableTemplateRequirementPresetAgentPrompt = (): string => tableTemplateRequirementPresetAgentPromptTemplate;

  return buildTableTemplateRequirementPresetAgentPrompt;
}
