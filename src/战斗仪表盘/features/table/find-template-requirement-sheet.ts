/**
 * find-template-requirement-sheet.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type TemplateInspectionSheet = Record<string, any>;
type TemplateTableRequirement = Record<string, any>;

export function createFindTemplateRequirementSheet(deps: any) {
  const findTemplateRequirementSheet = (
    sheets: TemplateInspectionSheet[],
    requirement: TemplateTableRequirement,
  ): TemplateInspectionSheet | null =>
    sheets.find(sheet => deps.templateTextIncludesAny(sheet.name, requirement.tableMatches)) || null;
  return findTemplateRequirementSheet;
}
