/**
 * get-attributes-for-character.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetAttributesForCharacter(deps: any) {
  const getAttributesForCharacter = (characterName: string) => {
    return deps.getFullAttributesForCharacter(characterName).map((attr: any) => attr.name);
  };
  return getAttributesForCharacter;
}
