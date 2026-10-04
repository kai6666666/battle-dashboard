/**
 * dashboard-module-section-kind.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type GlobalInteractionSectionKind = string;

export function createDashboardModuleSectionKind(_deps: any) {
  const DASHBOARD_MODULE_SECTION_KIND: Record<string, GlobalInteractionSectionKind> = {
    player: 'character',
    npc: 'character',
    location: 'map',
    bag: 'item',
    equip: 'equipment',
    quest: 'task',
    skill: 'skill',
  };
  return DASHBOARD_MODULE_SECTION_KIND;
}
