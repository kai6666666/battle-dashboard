/**
 * create-dice-profile-tavern-regex.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiceProfileRecord = { id: string; [key: string]: any };

export function createCreateDiceProfileTavernRegex(deps: any) {
  const createDiceProfileTavernRegex = (profile: DiceProfileRecord): Record<string, unknown> => ({
    id: deps.createDiceProfileRegexId(),
    scriptName: `战斗仪表盘配置注入 - ${profile.name || '角色卡内置方案'}`,
    findRegex: '/$^/',
    replaceString: deps.createDiceProfileTavernRegexReplaceString(profile),
    trimStrings: [],
    placement: [2],
    disabled: true,
    markdownOnly: true,
    promptOnly: false,
    runOnEdit: false,
    substituteRegex: 0,
    minDepth: null,
    maxDepth: 0,
  });
  return createDiceProfileTavernRegex;
}
