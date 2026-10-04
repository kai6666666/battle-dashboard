/**
 * build-dashboard-preset-agent-prompt.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import dashboardPresetAgentPromptTemplate from '../../docs/dashboard-preset-agent-prompt.md?raw';
export function createBuildDashboardPresetAgentPrompt(_deps: any) {
  const buildDashboardPresetAgentPrompt = (): string => dashboardPresetAgentPromptTemplate;

  return buildDashboardPresetAgentPrompt;
}
