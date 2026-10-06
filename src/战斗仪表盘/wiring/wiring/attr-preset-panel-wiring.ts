/**
 * wiring / attr-preset-panel-wiring.ts — 属性预设面板与表格规则修复装配簇（从 index.ts 迁出，x4-z）。
 */
import { createShowAttributePresetEditor } from '../features/presets/attribute-preset-editor-dialog';
import { createShowAttributePresetManager } from '../features/presets/attribute-preset-manager-dialog';
import { ATTRIBUTE_QUICK_SELECT_DEFAULT } from '../features/presets/attribute-quick-select-defaults';
import { createBuildNewAttributePresetJsoncTemplate } from '../features/presets/build-new-attribute-preset-jsonc-template';
import { createShowTableRuleFixModal } from '../features/validation/table-rule-fix-dialog';
import { STORAGE_KEY_ACTIVE_ATTR_PRESET } from '../shared/storage-keys';
import attributePresetAgentPromptTemplate from '../docs/attribute-preset-agent-prompt.md?raw';

export function createAttrPresetPanelWiring(deps: any) {
  const { AttributePresetManager, JSONC_FILE_ACCEPT, ValidationEngine, bindTutorialButtonsIn, deleteRowInstantly, downloadAiPromptFile, downloadJsonFile, escapeHtml, getConfig, getCore, getJsonLikeErrorMessage, getTutorialButtonHtml, normalizeAttributeQuickSelectConfig, parseJsoncRecord, popModal, pushModal, readTextFile, renderInterface, saveDataOnly, setupOverlayClose, showDiceSystemConfirmDialog, showPresetConflictDialog, validateJsoncEditorConfig, warnTableTemplateIssue } = deps;
  const showTableRuleFixModal = createShowTableRuleFixModal({
    deleteRowInstantly: (...a: any[]) => deleteRowInstantly(...a),
    getCore: (...a: any[]) => getCore(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveDataOnly: (...a: any[]) => saveDataOnly(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ValidationEngine: ValidationEngine,
  });

  // ========================================
  // 属性预设管理面板
  // ========================================

  const showAttributePresetManager = createShowAttributePresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    readTextFile: (...a: any[]) => readTextFile(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAttributePresetEditor: (...a: any[]) => showAttributePresetEditor(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showPresetConflictDialog: (...a: any[]) => showPresetConflictDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ATTRIBUTE_QUICK_SELECT_DEFAULT: ATTRIBUTE_QUICK_SELECT_DEFAULT,
    AttributePresetManager: AttributePresetManager,
    JSONC_FILE_ACCEPT: JSONC_FILE_ACCEPT,
    STORAGE_KEY_ACTIVE_ATTR_PRESET: STORAGE_KEY_ACTIVE_ATTR_PRESET,
  });

  // 规则预设编辑器
  const buildNewAttributePresetJsoncTemplate = createBuildNewAttributePresetJsoncTemplate({

  });

  const showAttributePresetEditor = createShowAttributePresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildNewAttributePresetJsoncTemplate: (...a: any[]) => buildNewAttributePresetJsoncTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    normalizeAttributeQuickSelectConfig: (...a: any[]) => normalizeAttributeQuickSelectConfig(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    AttributePresetManager: AttributePresetManager,
    attributePresetAgentPromptTemplate: attributePresetAgentPromptTemplate,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  // 高级骰子预设UI
  // ========================================
  type SortableListOptions = {
    container: JQuery | HTMLElement;
    itemSelector: string;
    handleSelector?: string;
    cancelSelector?: string;
    onOrderChange: (newOrder: string[]) => void;
    getItemId: (item: HTMLElement) => string | null;
    canStartDrag?: () => boolean;
    ghostClass?: string;
    dragClass?: string;
    placeholderClass?: string;
    indicatorClass?: string;
    longPressDelay?: number;
  };
  return { showAttributePresetManager, showTableRuleFixModal };
}
