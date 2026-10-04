/**
 * wiring / dice-profile-backup-wiring.ts — 骰子配置备份/角色档案装配簇（从 index.ts 迁出，x4-e）。
 */
import { createApplyDiceProfile } from '../features/dice/apply-dice-profile';
import { createCollectDiceProfileRegexScriptsFromRecord } from '../features/dice/collect-dice-profile-regex-scripts-from-record';
import { createCreateDiceProfilePreApplySnapshot } from '../features/dice/create-dice-profile-pre-apply-snapshot';
import { createCreateDiceProfileRegexId } from '../features/dice/create-dice-profile-regex-id';
import { createCreateDiceProfileRuntimeId } from '../features/dice/create-dice-profile-runtime-id';
import { createCreateDiceProfileTavernRegex } from '../features/dice/create-dice-profile-tavern-regex';
import { createCreateDiceProfileTavernRegexReplaceString } from '../features/dice/create-dice-profile-tavern-regex-replace-string';
import { createDeleteDiceProfileRecord } from '../features/dice/delete-dice-profile-record';
import { createDetectCharacterDiceProfile } from '../features/dice/detect-character-dice-profile';
import { DICE_CONFIG_BACKUP_MODULES } from '../features/dice/dice-config-backup-modules';
import { createDownloadDiceConfigBackupJson } from '../features/dice/download-dice-config-backup-json';
import { createDownloadDiceProfileJson } from '../features/dice/download-dice-profile-json';
import { createDownloadDiceProfileTavernRegex } from '../features/dice/download-dice-profile-tavern-regex';
import { createExportDiceProfile } from '../features/dice/export-dice-profile';
import { createGetAllDiceConfigBackupModuleIds } from '../features/dice/get-all-dice-config-backup-module-ids';
import { createGetDiceConfigBackupAvailableModuleIds } from '../features/dice/get-dice-config-backup-available-module-ids';
import { createGetDiceConfigBackupModuleCountText } from '../features/dice/get-dice-config-backup-module-count-text';
import { createGetDiceConfigBackupRestoreWarnings } from '../features/dice/get-dice-config-backup-restore-warnings';
import { createGetDiceConfigBackupSelectedModuleIdsFromDialog } from '../features/dice/get-dice-config-backup-selected-module-ids-from-dialog';
import { createGetDiceProfileCharacterContext } from '../features/dice/get-dice-profile-character-context';
import { createGetDiceProfileCurrentCharacterRecords } from '../features/dice/get-dice-profile-current-character-records';
import { createGetDiceProfileIndex } from '../features/dice/get-dice-profile-index';
import { createGetDiceProfileModuleNames } from '../features/dice/get-dice-profile-module-names';
import { createGetDiceProfilePromptState } from '../features/dice/get-dice-profile-prompt-state';
import { createGetDiceProfilePromptStates } from '../features/dice/get-dice-profile-prompt-states';
import { createGetDiceProfileRecords } from '../features/dice/get-dice-profile-records';
import { createImportDiceProfile } from '../features/dice/import-dice-profile';
import { createMaybePromptCharacterDiceProfile } from '../features/dice/maybe-prompt-character-dice-profile';
import { createNormalizeDiceProfileModuleIds } from '../features/dice/normalize-dice-profile-module-ids';
import { createNormalizeDiceProfileRecord } from '../features/dice/normalize-dice-profile-record';
import { createParseDiceProfileInput } from '../features/dice/parse-dice-profile-input';
import { createRefreshDiceProfileIndex } from '../features/dice/refresh-dice-profile-index';
import { createRenderDiceConfigBackupExportBody } from '../features/dice/render-dice-config-backup-export-body';
import { createRenderDiceConfigBackupModuleRows } from '../features/dice/render-dice-config-backup-module-rows';
import { createRenderDiceConfigBackupPrivacyNotice } from '../features/dice/render-dice-config-backup-privacy-notice';
import { createRenderDiceConfigBackupRestoreBody } from '../features/dice/render-dice-config-backup-restore-body';
import { createRenderDiceConfigBackupWarningList } from '../features/dice/render-dice-config-backup-warning-list';
import { createRenderDiceConfigBackupWarningSlot } from '../features/dice/render-dice-config-backup-warning-slot';
import { createRenderDiceProfileApplyConfirmDetailHtml } from '../features/dice/render-dice-profile-apply-confirm-detail-html';
import { createSaveCurrentDiceProfile } from '../features/dice/save-current-dice-profile';
import { createSaveDiceProfileIndex } from '../features/dice/save-dice-profile-index';
import { createSaveDiceProfileRecord } from '../features/dice/save-dice-profile-record';
import { createScheduleCharacterDiceProfileDetection } from '../features/dice/schedule-character-dice-profile-detection';
import { createSetDiceProfilePromptState } from '../features/dice/set-dice-profile-prompt-state';
import { createShowDiceCharacterProfilePrompt } from '../features/dice/show-dice-character-profile-prompt';
import { createShowDiceProfileApplyConfirm } from '../features/dice/show-dice-profile-apply-confirm';
import { createToDiceProfileSummary } from '../features/dice/to-dice-profile-summary';
import { createUpsertDiceProfileRecord } from '../features/dice/upsert-dice-profile-record';
import { createGetDiceProfileSillyTavern } from '../features/profiles/get-dice-profile-silly-tavern';

export function createDiceProfileBackupWiring(deps: any) {
  const { DICE_PROFILE_INDEX_STORAGE_KEY, DICE_PROFILE_LAST_APPLIED_STORAGE_KEY, DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT, DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY, applyDiceConfigBackup, buildDiceConfigBackup, cloneDiceConfigBackupValue, downloadJsonFile, getConfig, getCore, getDiceConfigBackupModuleDefinition, getDiceConfigBackupModuleResourceCount, getDiceConfigBackupRecordString, getDiceStatsContext, hasDiceConfigBackupRecoverableStorage, hasDiceConfigBackupTableTemplateResource, isDiceConfigBackupRecord, normalizeDiceConfigBackupSelectedModuleIds, parseDiceConfigBackup, parseJsoncDocument, renderDeprecatedBadge, setupOverlayClose, showDiceSystemConfirmDialog, escapeHtml } = deps;
  const getAllDiceConfigBackupModuleIds = createGetAllDiceConfigBackupModuleIds({

  });

  const normalizeDiceProfileModuleIds = createNormalizeDiceProfileModuleIds({
    getAllDiceConfigBackupModuleIds: (...a: any[]) => getAllDiceConfigBackupModuleIds(...a),
    getDiceConfigBackupAvailableModuleIds: (...a: any[]) => getDiceConfigBackupAvailableModuleIds(...a),
    normalizeDiceConfigBackupSelectedModuleIds: (...a: any[]) => normalizeDiceConfigBackupSelectedModuleIds(...a),
  });

  const getDiceProfileModuleNames = createGetDiceProfileModuleNames({
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
  });

  const toDiceProfileSummary = createToDiceProfileSummary({

  });

  const createDiceProfileRuntimeId = createCreateDiceProfileRuntimeId({

  });

  const getDiceProfileIndex = createGetDiceProfileIndex({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    getDICE_PROFILE_INDEX_STORAGE_KEY: () => DICE_PROFILE_INDEX_STORAGE_KEY,
  });

  const saveDiceProfileIndex = createSaveDiceProfileIndex({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDICE_PROFILE_INDEX_STORAGE_KEY: () => DICE_PROFILE_INDEX_STORAGE_KEY,
  });


  const refreshDiceProfileIndex = createRefreshDiceProfileIndex({
    getDiceProfileIndex: (...a: any[]) => getDiceProfileIndex(...a),
    saveDiceProfileIndex: (...a: any[]) => saveDiceProfileIndex(...a),
    toDiceProfileSummary: (...a: any[]) => toDiceProfileSummary(...a),
  });

  const getDiceProfileRecords = createGetDiceProfileRecords({
    saveDiceProfileIndex: (...a: any[]) => saveDiceProfileIndex(...a),
    toDiceProfileSummary: (...a: any[]) => toDiceProfileSummary(...a),
  });

  const normalizeDiceProfileRecord = createNormalizeDiceProfileRecord({
    normalizeDiceProfileModuleIds: (...a: any[]) => normalizeDiceProfileModuleIds(...a),
    parseDiceConfigBackup: (...a: any[]) => parseDiceConfigBackup(...a),
  });

  const parseDiceProfileInput = createParseDiceProfileInput({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeDiceProfileRecord: (...a: any[]) => normalizeDiceProfileRecord(...a),
    parseJsoncDocument: (...a: any[]) => parseJsoncDocument(...a),
  });

  const saveDiceProfileRecord = createSaveDiceProfileRecord({
    refreshDiceProfileIndex: (...a: any[]) => refreshDiceProfileIndex(...a),
  });

  const upsertDiceProfileRecord = createUpsertDiceProfileRecord({
    getDiceProfileRecords: (...a: any[]) => getDiceProfileRecords(...a),
    saveDiceProfileRecord: (...a: any[]) => saveDiceProfileRecord(...a),
  });

  const deleteDiceProfileRecord = createDeleteDiceProfileRecord({
    refreshDiceProfileIndex: (...a: any[]) => refreshDiceProfileIndex(...a),
  });

  const importDiceProfile = createImportDiceProfile({
    applyDiceProfile: (...a: any[]) => applyDiceProfile(...a),
    parseDiceProfileInput: (...a: any[]) => parseDiceProfileInput(...a),
    upsertDiceProfileRecord: (...a: any[]) => upsertDiceProfileRecord(...a),
  });

  const saveCurrentDiceProfile = createSaveCurrentDiceProfile({
    buildDiceConfigBackup: (...a: any[]) => buildDiceConfigBackup(...a),
    createDiceProfileRuntimeId: (...a: any[]) => createDiceProfileRuntimeId(...a),
    normalizeDiceProfileModuleIds: (...a: any[]) => normalizeDiceProfileModuleIds(...a),
    normalizeDiceProfileRecord: (...a: any[]) => normalizeDiceProfileRecord(...a),
    upsertDiceProfileRecord: (...a: any[]) => upsertDiceProfileRecord(...a),
  });

  const createDiceProfilePreApplySnapshot = createCreateDiceProfilePreApplySnapshot({
    deleteDiceProfileRecord: (...a: any[]) => deleteDiceProfileRecord(...a),
    getAllDiceConfigBackupModuleIds: (...a: any[]) => getAllDiceConfigBackupModuleIds(...a),
    getDiceProfileRecords: (...a: any[]) => getDiceProfileRecords(...a),
    saveCurrentDiceProfile: (...a: any[]) => saveCurrentDiceProfile(...a),
    DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT: DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT,
  });

  const renderDiceProfileApplyConfirmDetailHtml = createRenderDiceProfileApplyConfirmDetailHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
  });

  const showDiceProfileApplyConfirm = createShowDiceProfileApplyConfirm({
    getDiceConfigBackupRestoreWarnings: (...a: any[]) => getDiceConfigBackupRestoreWarnings(...a),
    renderDiceProfileApplyConfirmDetailHtml: (...a: any[]) => renderDiceProfileApplyConfirmDetailHtml(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
  });

  const applyDiceProfile = createApplyDiceProfile({
    applyDiceConfigBackup: (...a: any[]) => applyDiceConfigBackup(...a),
    createDiceProfilePreApplySnapshot: (...a: any[]) => createDiceProfilePreApplySnapshot(...a),
    normalizeDiceProfileModuleIds: (...a: any[]) => normalizeDiceProfileModuleIds(...a),
    saveDiceProfileRecord: (...a: any[]) => saveDiceProfileRecord(...a),
    showDiceProfileApplyConfirm: (...a: any[]) => showDiceProfileApplyConfirm(...a),
    DICE_PROFILE_LAST_APPLIED_STORAGE_KEY: DICE_PROFILE_LAST_APPLIED_STORAGE_KEY,
  });

  const exportDiceProfile = createExportDiceProfile({

  });

  const downloadDiceProfileJson = createDownloadDiceProfileJson({
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
  });

  const createDiceProfileRegexId = createCreateDiceProfileRegexId({
    createDiceProfileRuntimeId: (...a: any[]) => createDiceProfileRuntimeId(...a),
  });

  const createDiceProfileTavernRegexReplaceString = createCreateDiceProfileTavernRegexReplaceString({

  });

  const createDiceProfileTavernRegex = createCreateDiceProfileTavernRegex({
    createDiceProfileRegexId: (...a: any[]) => createDiceProfileRegexId(...a),
    createDiceProfileTavernRegexReplaceString: (...a: any[]) => createDiceProfileTavernRegexReplaceString(...a),
  });

  const downloadDiceProfileTavernRegex = createDownloadDiceProfileTavernRegex({
    createDiceProfileTavernRegex: (...a: any[]) => createDiceProfileTavernRegex(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
  });

  const getDiceProfilePromptStates = createGetDiceProfilePromptStates({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    getDICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY: () => DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY,
  });

  const setDiceProfilePromptState = createSetDiceProfilePromptState({
    getDiceProfilePromptStates: (...a: any[]) => getDiceProfilePromptStates(...a),
    getDICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY: () => DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY,
  });

  const getDiceProfilePromptState = createGetDiceProfilePromptState({
    getDiceProfilePromptStates: (...a: any[]) => getDiceProfilePromptStates(...a),
  });

  const getDiceProfileSillyTavern = createGetDiceProfileSillyTavern({

  });

  const getDiceProfileCharacterContext = createGetDiceProfileCharacterContext({
    getDiceStatsContext: (...a: any[]) => getDiceStatsContext(...a),
    getDiceProfileSillyTavern: (...a: any[]) => getDiceProfileSillyTavern(...a),
    getDiceConfigBackupRecordString: (...a: any[]) => getDiceConfigBackupRecordString(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const getDiceProfileCurrentCharacterRecords = createGetDiceProfileCurrentCharacterRecords({
    getDiceConfigBackupRecordString: (...a: any[]) => getDiceConfigBackupRecordString(...a),
    getDiceProfileSillyTavern: (...a: any[]) => getDiceProfileSillyTavern(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const collectDiceProfileRegexScriptsFromRecord = createCollectDiceProfileRegexScriptsFromRecord({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const collectDiceCharacterProfileTexts = (): Array<{ kind: DiceCharacterProfileDetection['sourceTextKind']; text: string }> => {
    const ST = getDiceProfileSillyTavern();
    const context = getDiceProfileCharacterContext();
    const result: Array<{ kind: DiceCharacterProfileDetection['sourceTextKind']; text: string }> = [];
    const seenTexts = new Set<string>();
    const pushText = (kind: DiceCharacterProfileDetection['sourceTextKind'], text: unknown): void => {
      const cleanText = typeof text === 'string' || typeof text === 'number' ? String(text).trim() : '';
      if (!cleanText || seenTexts.has(cleanText)) return;
      seenTexts.add(cleanText);
      result.push({ kind, text: cleanText });
    };

    const chat = ST?.chat || window.parent?.SillyTavern?.chat;
    const firstMessage = Array.isArray(chat) ? chat.find(message => message && !message.is_user) : null;
    pushText('message', firstMessage?.mes);

    getDiceProfileCurrentCharacterRecords().forEach(record => {
      const data = isDiceConfigBackupRecord(record.data) ? record.data : {};
      pushText('first_mes', getDiceConfigBackupRecordString(record, 'first_mes'));
      pushText('first_mes', getDiceConfigBackupRecordString(data, 'first_mes'));
      collectDiceProfileRegexScriptsFromRecord(record).forEach(script => {
        if (!isDiceConfigBackupRecord(script)) return;
        pushText('regex', getDiceConfigBackupRecordString(script, 'replaceString'));
      });
    });
    return result;
  };

  const detectCharacterDiceProfile = createDetectCharacterDiceProfile({
    collectDiceCharacterProfileTexts: (...a: any[]) => collectDiceCharacterProfileTexts(...a),
    getDiceProfileCharacterContext: (...a: any[]) => getDiceProfileCharacterContext(...a),
    getDiceProfilePromptState: (...a: any[]) => getDiceProfilePromptState(...a),
    normalizeDiceProfileRecord: (...a: any[]) => normalizeDiceProfileRecord(...a),
    upsertDiceProfileRecord: (...a: any[]) => upsertDiceProfileRecord(...a),
  });

  const showDiceCharacterProfilePrompt = createShowDiceCharacterProfilePrompt({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceProfileModuleNames: (...a: any[]) => getDiceProfileModuleNames(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  const maybePromptCharacterDiceProfile = createMaybePromptCharacterDiceProfile({
    applyDiceProfile: (...a: any[]) => applyDiceProfile(...a),
    detectCharacterDiceProfile: (...a: any[]) => detectCharacterDiceProfile(...a),
    getDiceProfileCharacterContext: (...a: any[]) => getDiceProfileCharacterContext(...a),
    setDiceProfilePromptState: (...a: any[]) => setDiceProfilePromptState(...a),
    showDiceCharacterProfilePrompt: (...a: any[]) => showDiceCharacterProfilePrompt(...a),
  });

  const scheduleCharacterDiceProfileDetection = createScheduleCharacterDiceProfileDetection({
    maybePromptCharacterDiceProfile: (...a: any[]) => maybePromptCharacterDiceProfile(...a),
  });

  const getDiceConfigBackupAvailableModuleIds = createGetDiceConfigBackupAvailableModuleIds({
    getDiceConfigBackupModuleResourceCount: (...a: any[]) => getDiceConfigBackupModuleResourceCount(...a),
    hasDiceConfigBackupRecoverableStorage: (...a: any[]) => hasDiceConfigBackupRecoverableStorage(...a),
    hasDiceConfigBackupTableTemplateResource: (...a: any[]) => hasDiceConfigBackupTableTemplateResource(...a),
  });

  const getDiceConfigBackupSelectedModuleIdsFromDialog = createGetDiceConfigBackupSelectedModuleIdsFromDialog({
    normalizeDiceConfigBackupSelectedModuleIds: (...a: any[]) => normalizeDiceConfigBackupSelectedModuleIds(...a),
  });

  const getDiceConfigBackupRestoreWarnings = createGetDiceConfigBackupRestoreWarnings({

  });

  const getDiceConfigBackupModuleCountText = createGetDiceConfigBackupModuleCountText({

  });

  const renderDiceConfigBackupModuleRows = createRenderDiceConfigBackupModuleRows({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getDiceConfigBackupModuleCountText: (...a: any[]) => getDiceConfigBackupModuleCountText(...a),
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
    getDiceConfigBackupModuleResourceCount: (...a: any[]) => getDiceConfigBackupModuleResourceCount(...a),
    renderDeprecatedBadge: (...a: any[]) => renderDeprecatedBadge(...a),
  });

  const renderDiceConfigBackupWarningList = createRenderDiceConfigBackupWarningList({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const renderDiceConfigBackupWarningSlot = createRenderDiceConfigBackupWarningSlot({
    renderDiceConfigBackupWarningList: (...a: any[]) => renderDiceConfigBackupWarningList(...a),
  });

  const renderDiceConfigBackupPrivacyNotice = createRenderDiceConfigBackupPrivacyNotice({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const renderDiceConfigBackupExportBody = createRenderDiceConfigBackupExportBody({
    renderDiceConfigBackupPrivacyNotice: (...a: any[]) => renderDiceConfigBackupPrivacyNotice(...a),
    renderDiceConfigBackupModuleRows: (...a: any[]) => renderDiceConfigBackupModuleRows(...a),
    getDICE_CONFIG_BACKUP_MODULES: () => DICE_CONFIG_BACKUP_MODULES,
  });

  const renderDiceConfigBackupRestoreBody = createRenderDiceConfigBackupRestoreBody({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getDiceConfigBackupAvailableModuleIds: (...a: any[]) => getDiceConfigBackupAvailableModuleIds(...a),
    getDiceConfigBackupModuleResourceCount: (...a: any[]) => getDiceConfigBackupModuleResourceCount(...a),
    getDiceConfigBackupRestoreWarnings: (...a: any[]) => getDiceConfigBackupRestoreWarnings(...a),
    renderDiceConfigBackupModuleRows: (...a: any[]) => renderDiceConfigBackupModuleRows(...a),
    renderDiceConfigBackupPrivacyNotice: (...a: any[]) => renderDiceConfigBackupPrivacyNotice(...a),
    renderDiceConfigBackupWarningSlot: (...a: any[]) => renderDiceConfigBackupWarningSlot(...a),
  });

  const downloadDiceConfigBackupJson = createDownloadDiceConfigBackupJson({
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
  });

  return { applyDiceProfile, createDiceProfileRuntimeId, deleteDiceProfileRecord, detectCharacterDiceProfile, downloadDiceConfigBackupJson, downloadDiceProfileJson, downloadDiceProfileTavernRegex, exportDiceProfile, getAllDiceConfigBackupModuleIds, getDiceConfigBackupSelectedModuleIdsFromDialog, getDiceProfileCharacterContext, getDiceProfilePromptState, importDiceProfile, normalizeDiceProfileRecord, refreshDiceProfileIndex, renderDiceConfigBackupModuleRows, saveCurrentDiceProfile, saveDiceProfileRecord, scheduleCharacterDiceProfileDetection, toDiceProfileSummary };
}
