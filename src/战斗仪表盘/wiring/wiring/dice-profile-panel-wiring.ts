/**
 * wiring / dice-profile-panel-wiring.ts — 骰子档案面板装配簇（从 index.ts 迁出，x4-aa）。
 */
import { DICE_CONFIG_BACKUP_MODULES } from '../features/dice/dice-config-backup-modules';
import { createGetDiceProfileCollapsedSections } from '../features/dice/get-dice-profile-collapsed-sections';
import { createGetDiceProfileSourceLabel } from '../features/dice/get-dice-profile-source-label';
import { createIsDiceProfileCharacterSource } from '../features/dice/is-dice-profile-character-source';
import { createRenderDiceProfileManagerBody } from '../features/dice/render-dice-profile-manager-body';
import { createRenderDiceProfileSummaryRow } from '../features/dice/render-dice-profile-summary-row';
import { createRenderDiceProfileTabPanel } from '../features/dice/render-dice-profile-tab-panel';
import { createSaveDiceProfileCollapsedSections } from '../features/dice/save-dice-profile-collapsed-sections';
import { createShowDiceConfigBackupDialog } from '../features/dice/show-dice-config-backup-dialog';

export function createDiceProfilePanelWiring(deps: any) {
  const { DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY, DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT, applyDiceProfile, bindTutorialButtonsIn, buildDiceConfigBackup, createDiceProfileRuntimeId, deleteDiceProfileRecord, detectCharacterDiceProfile, downloadDiceConfigBackupJson, downloadDiceProfileJson, downloadDiceProfileTavernRegex, escapeHtml, exportDiceProfile, getAllDiceConfigBackupModuleIds, getConfig, getCore, getDiceConfigBackupSelectedModuleIdsFromDialog, getDiceConfigBackupWarningCount, getTutorialButtonHtml, importDiceProfile, normalizeDiceProfileRecord, pickTextFile, refreshDiceProfileIndex, renderDiceConfigBackupModuleRows, saveCurrentDiceProfile, saveDiceProfileRecord, setupOverlayClose, showDiceConfigBackupPrivacyConfirm, showDiceSystemConfirmDialog, showDiceSystemInputDialog, toDiceProfileSummary } = deps;
  const getDiceProfileCollapsedSections = createGetDiceProfileCollapsedSections({
    getDICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY: () => DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY,
  });

  const saveDiceProfileCollapsedSections = createSaveDiceProfileCollapsedSections({
    getDICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY: () => DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY,
  });

  const getDiceProfileSourceLabel = createGetDiceProfileSourceLabel({

  });

  const isDiceProfileCharacterSource = createIsDiceProfileCharacterSource({

  });

  const renderDiceProfileSummaryRow = createRenderDiceProfileSummaryRow({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getDiceProfileSourceLabel: (...a: any[]) => getDiceProfileSourceLabel(...a),
    isDiceProfileCharacterSource: (...a: any[]) => isDiceProfileCharacterSource(...a),
  });

  const renderDiceProfileTabPanel = createRenderDiceProfileTabPanel({
    renderDiceProfileSummaryRow: (...a: any[]) => renderDiceProfileSummaryRow(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const renderDiceProfileManagerBody = createRenderDiceProfileManagerBody({
    detectCharacterDiceProfile: (...a: any[]) => detectCharacterDiceProfile(...a),
    getDiceProfileCollapsedSections: (...a: any[]) => getDiceProfileCollapsedSections(...a),
    isDiceProfileCharacterSource: (...a: any[]) => isDiceProfileCharacterSource(...a),
    refreshDiceProfileIndex: (...a: any[]) => refreshDiceProfileIndex(...a),
    renderDiceConfigBackupModuleRows: (...a: any[]) => renderDiceConfigBackupModuleRows(...a),
    renderDiceProfileTabPanel: (...a: any[]) => renderDiceProfileTabPanel(...a),
    toDiceProfileSummary: (...a: any[]) => toDiceProfileSummary(...a),
    DICE_CONFIG_BACKUP_MODULES: DICE_CONFIG_BACKUP_MODULES,
    DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT: DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT,
  });

  const showDiceConfigBackupDialog = createShowDiceConfigBackupDialog({
    applyDiceProfile: (...a: any[]) => applyDiceProfile(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildDiceConfigBackup: (...a: any[]) => buildDiceConfigBackup(...a),
    createDiceProfileRuntimeId: (...a: any[]) => createDiceProfileRuntimeId(...a),
    deleteDiceProfileRecord: (...a: any[]) => deleteDiceProfileRecord(...a),
    downloadDiceConfigBackupJson: (...a: any[]) => downloadDiceConfigBackupJson(...a),
    downloadDiceProfileJson: (...a: any[]) => downloadDiceProfileJson(...a),
    downloadDiceProfileTavernRegex: (...a: any[]) => downloadDiceProfileTavernRegex(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    exportDiceProfile: (...a: any[]) => exportDiceProfile(...a),
    getAllDiceConfigBackupModuleIds: (...a: any[]) => getAllDiceConfigBackupModuleIds(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfigBackupSelectedModuleIdsFromDialog: (...a: any[]) => getDiceConfigBackupSelectedModuleIdsFromDialog(...a),
    getDiceConfigBackupWarningCount: (...a: any[]) => getDiceConfigBackupWarningCount(...a),
    getDiceProfileCollapsedSections: (...a: any[]) => getDiceProfileCollapsedSections(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    importDiceProfile: (...a: any[]) => importDiceProfile(...a),
    isDiceProfileCharacterSource: (...a: any[]) => isDiceProfileCharacterSource(...a),
    normalizeDiceProfileRecord: (...a: any[]) => normalizeDiceProfileRecord(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    renderDiceProfileManagerBody: (...a: any[]) => renderDiceProfileManagerBody(...a),
    saveCurrentDiceProfile: (...a: any[]) => saveCurrentDiceProfile(...a),
    saveDiceProfileCollapsedSections: (...a: any[]) => saveDiceProfileCollapsedSections(...a),
    saveDiceProfileRecord: (...a: any[]) => saveDiceProfileRecord(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceConfigBackupPrivacyConfirm: (...a: any[]) => showDiceConfigBackupPrivacyConfirm(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showDiceSystemInputDialog: (...a: any[]) => showDiceSystemInputDialog(...a),
  });
  return { showDiceConfigBackupDialog };
}
