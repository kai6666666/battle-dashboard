/**
 * get-current-chat-avatar-nodes.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type AvatarManagerNode = Record<string, any>;
type RelationGraphTableInput = Record<string, any>;

export function createGetCurrentChatAvatarNodes(deps: any) {
  const getCurrentChatAvatarNodes = (): AvatarManagerNode[] => {
    const rawData = deps.getCachedRawData() || deps.getTableData();
    const allTables = deps.processJsonData(rawData);
    if (!allTables || allTables.length === 0) return [];
    return deps.collectCurrentChatAvatarNodes(allTables as Record<string, RelationGraphTableInput>);
  };
  return getCurrentChatAvatarNodes;
}
