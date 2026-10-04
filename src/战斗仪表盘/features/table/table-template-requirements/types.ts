/**
 * table-template-requirements / types.ts
 * 公共类型与常量定义。
 */
export const TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT = 'acu_table_template_requirement_preset_v1';
export const TABLE_TEMPLATE_REQUIREMENT_PRESET_VERSION = 1;
export const DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID = '__builtin_table_template_dice_v42__';

export type TemplateInspectionSeverity = 'error' | 'warning' | 'info';
export type TemplateSourceTextField = 'note' | 'initNode' | 'insertNode' | 'updateNode' | 'deleteNode';

export type TableTemplateRequirementLevelConfig = {
  defaults?: {
    sheet?: TemplateInspectionSeverity;
    header?: TemplateInspectionSeverity;
    ddl?: TemplateInspectionSeverity;
    sourceData?: Partial<Record<TemplateSourceTextField, TemplateInspectionSeverity>>;
    config?: TemplateInspectionSeverity;
    mate?: TemplateInspectionSeverity;
  };
  sheets?: Record<
    string,
    {
      sheet?: TemplateInspectionSeverity;
      header?: TemplateInspectionSeverity;
      headers?: Record<string, TemplateInspectionSeverity>;
      ddl?: TemplateInspectionSeverity;
      sourceData?: Partial<Record<TemplateSourceTextField, TemplateInspectionSeverity>>;
      config?: TemplateInspectionSeverity;
    }
  >;
};

export type TemplateRecord = Record<string, unknown>;

export type TableTemplateRequirementPreset = {
  id: string;
  name: string;
  description?: string;
  format?: string;
  version?: number;
  builtin?: boolean;
  order?: number;
  requirementLevels?: TableTemplateRequirementLevelConfig;
  template: TemplateRecord;
};

export type TemplateInspectionSheet = {
  key: string;
  name: string;
  headers: string[];
  sqlTableName: string;
  sourceData: Record<string, unknown>;
  raw: Record<string, unknown>;
};

export type TemplateInspectionIssue = {
  severity: TemplateInspectionSeverity;
  groupName: string;
  title: string;
  missing: string[];
  impact: string;
  suggestion: string;
  fixable: boolean;
  fixActions: string[];
};

export type TemplateInspectionIssueGroup = {
  name: string;
  severity: TemplateInspectionSeverity;
  issues: TemplateInspectionIssue[];
};

export type TemplateInspectionResult = {
  presetId: string;
  presetName: string;
  sheets: TemplateInspectionSheet[];
  issues: TemplateInspectionIssue[];
  fixableCount: number;
  manualCount: number;
  checkedAt: string;
};

export type TableTemplateRepairPlan = {
  changed: boolean;
  repairedTemplate: TemplateRecord | null;
  actions: string[];
  manualIssues: string[];
};

type TemplateSheetEntry = {
  key: string;
  sheet: Record<string, unknown>;
};

type SheetMatchResult = {
  entry: TemplateSheetEntry | null;
  ambiguous: boolean;
  reasons: string[];
};

type DdlColumnInfo = {
  sqlName: string;
  comment: string;
  definition: string;
};

type SheetRowShape = {
  expectedWidth: number;
  shortRows: number;
  longRows: number;
  nonArrayRows: number;
};
