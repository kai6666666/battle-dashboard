/**
 * build-global-interaction-search-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type GlobalInteractionAction = Record<string, any>;

export function createBuildGlobalInteractionSearchText(_deps: any) {
  const buildGlobalInteractionSearchText = (
    tableName: string,
    rowTitle: string,
    actions: GlobalInteractionAction[],
  ): string => {
    return [tableName, rowTitle, ...actions.map(action => action.label)].join(' ').toLowerCase();
  };
  return buildGlobalInteractionSearchText;
}
