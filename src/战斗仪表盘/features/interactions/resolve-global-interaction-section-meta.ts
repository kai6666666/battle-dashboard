/**
 * resolve-global-interaction-section-meta.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GLOBAL_INTERACTION_SECTION_METAS } from './global-interaction-section-metas';
import type { GlobalInteractionSectionMeta } from '../../shared/index-local-types';
export function createResolveGlobalInteractionSectionMeta(deps: any) {
  const resolveGlobalInteractionSectionMeta = (tableName: string): GlobalInteractionSectionMeta => {
    const dashboardSectionKind = deps.resolveDashboardGlobalInteractionSectionKind(tableName);
    if (dashboardSectionKind) {
      const dashboardMeta = GLOBAL_INTERACTION_SECTION_METAS.find(meta => meta.kind === dashboardSectionKind);
      if (dashboardMeta) return dashboardMeta;
    }

    const candidateTexts = [tableName, ...deps.getMatchedGlobalInteractionRuleKeywords(tableName)].map(
      deps.normalizeGlobalInteractionCategoryText,
    );
    return (
      GLOBAL_INTERACTION_SECTION_METAS.find(meta =>
        meta.keywords.some((keyword: any) => {
          const normalizedKeyword = deps.normalizeGlobalInteractionCategoryText(keyword);
          return candidateTexts.some((text: any) => text.includes(normalizedKeyword));
        }),
      ) || deps.GLOBAL_INTERACTION_DEFAULT_SECTION_META
    );
  };
  return resolveGlobalInteractionSectionMeta;
}
