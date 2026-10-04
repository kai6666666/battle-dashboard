/**
 * tutorial / types.ts — 类型定义（从 tutorial.ts 拆出）。
 */
export type TutorialScope =
  | 'core'
  | 'settings'
  | 'settingsAppearance'
  | 'settingsLayout'
  | 'settingsPosition'
  | 'settingsOptions'
  | 'settingsTables'
  | 'settingsDicePresets'
  | 'settingsAdvanced'
  | 'templateInspection'
  | 'tableTemplateRequirementPresetManager'
  | 'tableTemplateRequirementPresetEditor'
  | 'configBackup'
  | 'dice'
  | 'contestDice'
  | 'diceHistory'
  | 'diceSettings'
  | 'advancedPresetManager'
  | 'advancedPresetEditor'
  | 'actionPresetManager'
  | 'actionPresetEditor'
  | 'globalInteractions'
  | 'dashboardPresetManager'
  | 'dashboardPresetEditor'
  | 'renderPresetManager'
  | 'renderPresetEditor'
  | 'attributePresetEditor'
  | 'attributePresetManager'
  | 'map'
  | 'relationshipGraph'
  | 'avatarManager'
  | 'customIconManager'
  | 'table'
  | 'optionTable'
  | 'checkSuggestionTable'
  | 'mvu'
  | 'changes'
  | 'favorites'
  | 'inventory'
  | 'inventoryDetail'
  | 'shardShop'
  | 'gacha'
  | 'gachaSettings'
  | 'gachaItemEditor';

export type TutorialPlacement = 'top' | 'right' | 'bottom' | 'left' | 'center';
export type TutorialAction = 'prev' | 'next' | 'close';

export interface TutorialStep {
  selector?: string | readonly string[];
  title: string;
  content: string;
  placement?: TutorialPlacement;
}

export interface TutorialState {
  version: 1;
  revision: number;
  disabled: boolean;
  completedScopes: TutorialScope[];
}

export interface TutorialModule {
  maybeStart(scope: TutorialScope, options?: { target?: HTMLElement; interrupt?: boolean }): void;
  start(scope: TutorialScope, options?: { manual?: boolean; target?: HTMLElement; interrupt?: boolean }): void;
  close(): void;
  isDisabled(): boolean;
}

export interface TutorialModuleOptions {
  getTheme: () => string;
  getStore: <T>(key: string, fallback: T) => T;
  setStore: (key: string, value: unknown) => void;
  getDocument: () => Document;
  getWindow: () => Window;
}

export interface ActiveTutorial {
  scope: TutorialScope;
  steps: TutorialStep[];
  index: number;
  manual: boolean;
  visibleIndexes: number[];
  targetCache: Map<number, HTMLElement | null>;
  initialTarget?: HTMLElement;
}

export interface StartOptions {
  manual?: boolean;
  completeWhenMissing?: boolean;
  target?: HTMLElement;
  interrupt?: boolean;
}

export interface TutorialViewport {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface TutorialRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}
