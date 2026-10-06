/**
 * wiring / visualization-wiring.ts — 地图/关系图/头像/配置装配簇（从 index.ts 迁出，x4-n）。
 */
import type { AcuDiceProfilePackage, AcuDiceProfileSource } from '../features/profiles/profile-packages';
import { createShowAvatarCropModal } from '../features/avatar/avatar-crop-modal';
import { createShowAvatarManager } from '../features/avatar/show-avatar-manager';
import { createCollectCurrentChatAvatarNodes } from '../features/avatars/collect-current-chat-avatar-nodes';
import { createGetCurrentChatAvatarNodes } from '../features/avatars/get-current-chat-avatar-nodes';
import { createRefreshAutoImageColorForAvatar } from '../features/avatars/refresh-auto-image-color-for-avatar';
import { createCollectDashboardNpcEntriesFromRelationshipSources } from '../features/dashboard/collect-dashboard-npc-entries-from-relationship-sources';
import { createCollectDashboardNpcEntriesFromTableResult } from '../features/dashboard/collect-dashboard-npc-entries-from-table-result';
import { createCollectDashboardNpcEntriesFromTableResults } from '../features/dashboard/collect-dashboard-npc-entries-from-table-results';
import { DASHBOARD_TABLE_CONFIG } from '../features/dashboard/dashboard-table-config';
import { createFindDashboardNpcNameColumnIndex } from '../features/dashboard/find-dashboard-npc-name-column-index';
import { createFindRelationshipGraphSourceTables } from '../features/dashboard/find-relationship-graph-source-tables';
import { createGetDashboardNpcListData } from '../features/dashboard/get-dashboard-npc-list-data';
import { createIsDashboardRoleInSceneValue } from '../features/dashboard/is-dashboard-role-in-scene-value';
import { createPushDashboardNpcEntry } from '../features/dashboard/push-dashboard-npc-entry';
import { createClearDiceLocalCacheData } from '../features/dice/clear-dice-local-cache-data';
import { createClearDiceSystemCache } from '../features/dice/clear-dice-system-cache';
import { createParseInSceneStatus } from '../features/dice/parse-in-scene-status';
import { GachaCatalogRecord } from '../features/gacha/gacha-types';
import { createBuildMapViewModel } from '../features/map/map-view-model';
import { createShowMapVisualization } from '../features/map/map-visualization';
import { createBuildRelationshipGraphTableFromPreset } from '../features/table/build-relationship-graph-table-from-preset';
import { createFindRelationGraphColumnIndex } from '../features/table/find-relation-graph-column-index';
import { createFindRelationGraphRelationColumnMatch } from '../features/table/find-relation-graph-relation-column-match';
import { createGetConfig } from '../features/table/get-config';
import { createShowImportConfirmDialog } from '../features/table/import-confirm-dialog';
import { createSanitizeUiConfig } from '../features/table/sanitize-ui-config';
import { createSaveConfig } from '../features/table/save-config';
import { createShowCardEditModal } from '../features/table/show-card-edit-modal';
import { createShowRelationshipGraph } from '../features/table/show-relationship-graph';
import { createShowManualUpdateDialog } from '../features/ui/show-manual-update-dialog';
import { STORAGE_KEY_MAP_FOCUS } from '../shared/storage-keys';

export function createVisualizationWiring(deps: any) {
  const { AvatarManager, DashboardDataParser, DiceHistoryStatsDB, NameAliasRegistry, USER_NODE_KEY, applyConfigStyles, avatarHexToHsl, bindTutorialButtonsIn, buildAvatarBackgroundStyle, cachedRawData_ACC, characterNamesMatch, clampAvatarNumber, createGlobalInteractionCustomTableNameIconContext, escapeHtml, formatCssImageUrl, getActiveDashboardRelationshipGraphSources, getAvatarFallbackColor, getCore, getDashboardModuleConfig, getDiceConfig, getElementEmoji, getImageUrlValidationMessage, getPlayerName, getRemoteImageUrlValidationError, getTableData, getTutorialButtonHtml, hslToAvatarHex, hydrateCustomTableNameIconsIn, inferAvatarImageColor, loadSnapshot, normalizeAvatarHexColor, normalizeCollapseStyle, parseRelationshipString, processJsonData, refreshDialogueIndentRender, renderCustomTableNameIconContent, renderInterface, replaceUserPlaceholders, resolveBatchLocationEmojis, resolveUserGraphName, saveDiceConfig, saveRowInstantly, setupOverlayClose, warnTableTemplateIssue, withTableTemplateCheckHint } = deps;
  const parseInSceneStatus = createParseInSceneStatus({

  });

  const buildMapViewModel = createBuildMapViewModel({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseInSceneStatus: (...a: any[]) => parseInSceneStatus(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    resolveBatchLocationEmojis: (...a: any[]) => resolveBatchLocationEmojis(...a),
    resolveUserGraphName: (...a: any[]) => resolveUserGraphName(...a),
    AvatarManager: AvatarManager,
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
    DashboardDataParser: DashboardDataParser,
    NameAliasRegistry: NameAliasRegistry,
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // 防止地图弹窗重复打开
  let isMapOpening = false;

  const showMapVisualization = createShowMapVisualization({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildAvatarBackgroundStyle: (...a: any[]) => buildAvatarBackgroundStyle(...a),
    buildMapViewModel: (...a: any[]) => buildMapViewModel(...a),
    createGlobalInteractionCustomTableNameIconContext: (...a: any[]) => createGlobalInteractionCustomTableNameIconContext(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    STORAGE_KEY_MAP_FOCUS: STORAGE_KEY_MAP_FOCUS,
    getIsMapOpening: () => isMapOpening,
    setIsMapOpening: (v: any) => { isMapOpening = v; },
  });

  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  const RELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS = ['人际关系', 'relation_state', 'relation_text'];

  const findRelationGraphColumnIndex = createFindRelationGraphColumnIndex({

  });

  const findRelationGraphRelationColumnMatch = createFindRelationGraphRelationColumnMatch({
    findRelationGraphColumnIndex: (...a: any[]) => findRelationGraphColumnIndex(...a),
    getRELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS: () => RELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS,
  });

  const findRelationshipGraphSourceTables = createFindRelationshipGraphSourceTables({

  });

  const buildRelationshipGraphTableFromPreset = createBuildRelationshipGraphTableFromPreset({
    findRelationGraphColumnIndex: (...a: any[]) => findRelationGraphColumnIndex(...a),
    findRelationGraphRelationColumnMatch: (...a: any[]) => findRelationGraphRelationColumnMatch(...a),
    findRelationshipGraphSourceTables: (...a: any[]) => findRelationshipGraphSourceTables(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    USER_NODE_KEY: USER_NODE_KEY,
  });

  const isDashboardRoleInSceneValue = createIsDashboardRoleInSceneValue({

  });

  const pushDashboardNpcEntry = createPushDashboardNpcEntry({
    characterNamesMatch: (...a: any[]) => characterNamesMatch(...a),
  });

  const findDashboardNpcNameColumnIndex = createFindDashboardNpcNameColumnIndex({
    findRelationGraphColumnIndex: (...a: any[]) => findRelationGraphColumnIndex(...a),
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getDashboardDataParser: () => DashboardDataParser,
  });

  const collectDashboardNpcEntriesFromTableResult = createCollectDashboardNpcEntriesFromTableResult({
    findDashboardNpcNameColumnIndex: (...a: any[]) => findDashboardNpcNameColumnIndex(...a),
    findRelationGraphRelationColumnMatch: (...a: any[]) => findRelationGraphRelationColumnMatch(...a),
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    isDashboardRoleInSceneValue: (...a: any[]) => isDashboardRoleInSceneValue(...a),
    pushDashboardNpcEntry: (...a: any[]) => pushDashboardNpcEntry(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
    DashboardDataParser: DashboardDataParser,
  });

  const collectDashboardNpcEntriesFromTableResults = createCollectDashboardNpcEntriesFromTableResults({
    collectDashboardNpcEntriesFromTableResult: (...a: any[]) => collectDashboardNpcEntriesFromTableResult(...a),
  });

  const collectDashboardNpcEntriesFromRelationshipSources = createCollectDashboardNpcEntriesFromRelationshipSources({
    collectDashboardNpcEntriesFromTableResult: (...a: any[]) => collectDashboardNpcEntriesFromTableResult(...a),
    findRelationshipGraphSourceTables: (...a: any[]) => findRelationshipGraphSourceTables(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const getDashboardNpcListData = createGetDashboardNpcListData({
    collectDashboardNpcEntriesFromRelationshipSources: (...a: any[]) => collectDashboardNpcEntriesFromRelationshipSources(...a),
    collectDashboardNpcEntriesFromTableResults: (...a: any[]) => collectDashboardNpcEntriesFromTableResults(...a),
    getActiveDashboardRelationshipGraphSources: (...a: any[]) => getActiveDashboardRelationshipGraphSources(...a),
    DashboardDataParser: DashboardDataParser,
  });

  interface AvatarManagerNode {
    name: string;
    isPlayer: boolean;
    rowIndex?: number;
    tableKey?: string;
  }

  type AvatarManagerViewMode = 'chat' | 'global';

  interface AvatarManagerOptions {
    initialView?: AvatarManagerViewMode;
  }

  const collectCurrentChatAvatarNodes = createCollectCurrentChatAvatarNodes({
    getDashboardNpcListData: (...a: any[]) => getDashboardNpcListData(...a),
    DashboardDataParser: DashboardDataParser,
  });

  const getCurrentChatAvatarNodes = createGetCurrentChatAvatarNodes({
    collectCurrentChatAvatarNodes: (...a: any[]) => collectCurrentChatAvatarNodes(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  interface RelationGraphLayoutPosition {
    x: number;
    y: number;
  }

  type RelationGraphLayoutCache = Record<string, RelationGraphLayoutPosition>;
  type RelationGraphLayoutLoadResult = 'none' | 'partial' | 'full';

  // 人物关系图可视化
  const showRelationshipGraph = createShowRelationshipGraph({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildAvatarBackgroundStyle: (...a: any[]) => buildAvatarBackgroundStyle(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseRelationshipString: (...a: any[]) => parseRelationshipString(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveUserGraphName: (...a: any[]) => resolveUserGraphName(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAvatarManager: (...a: any[]) => showAvatarManager(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
    AvatarManager: AvatarManager,
    NameAliasRegistry: NameAliasRegistry,
    getCachedRawData: () => cachedRawData_ACC.v,
  });
  // ========================================
  // 头像裁剪弹窗 - 统一PC/移动端体验
  // ========================================

  const showAvatarCropModal = createShowAvatarCropModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    AvatarManager: AvatarManager,
  });

  const refreshAutoImageColorForAvatar = createRefreshAutoImageColorForAvatar({
    getAvatarFallbackColor: (...a: any[]) => getAvatarFallbackColor(...a),
    inferAvatarImageColor: (...a: any[]) => inferAvatarImageColor(...a),
    AvatarManager: AvatarManager,
  });
  // 角色头像预设弹窗（简化版 - 使用裁剪弹窗）
  const showAvatarManager = createShowAvatarManager({
    avatarHexToHsl: (...a: any[]) => avatarHexToHsl(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    clampAvatarNumber: (...a: any[]) => clampAvatarNumber(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getAvatarFallbackColor: (...a: any[]) => getAvatarFallbackColor(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getImageUrlValidationMessage: (...a: any[]) => getImageUrlValidationMessage(...a),
    getRemoteImageUrlValidationError: (...a: any[]) => getRemoteImageUrlValidationError(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    hslToAvatarHex: (...a: any[]) => hslToAvatarHex(...a),
    normalizeAvatarHexColor: (...a: any[]) => normalizeAvatarHexColor(...a),
    refreshAutoImageColorForAvatar: (...a: any[]) => refreshAutoImageColorForAvatar(...a),
    refreshDialogueIndentRender: (...a: any[]) => refreshDialogueIndentRender(...a),
    resolveUserGraphName: (...a: any[]) => resolveUserGraphName(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAvatarCropModal: (...a: any[]) => showAvatarCropModal(...a),
    showImportConfirmDialog: (...a: any[]) => showImportConfirmDialog(...a),
    AvatarManager: AvatarManager,
  });

  // 清理战斗仪表盘脚本缓存
  const clearDiceSystemCache = createClearDiceSystemCache({

  });

  const clearDiceLocalCacheData = createClearDiceLocalCacheData({
    clearDiceSystemCache: (...a: any[]) => clearDiceSystemCache(...a),
    DiceHistoryStatsDB: DiceHistoryStatsDB,
  });

  // 手动更新/确认弹窗（支持复用）
  const showManualUpdateDialog = createShowManualUpdateDialog({
    clearDiceSystemCache: (...a: any[]) => clearDiceSystemCache(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // 导入确认弹窗
  const showImportConfirmDialog = createShowImportConfirmDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    AvatarManager: AvatarManager,
  });
  // [新增] 整体编辑模态框 (已修复自动高度与样式复用)
  const showCardEditModal = createShowCardEditModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // [优化] 内存配置缓存
  let _configCache = null;
  const LEGACY_DB_THEME_SYNC_CONFIG_KEY = ['sync', 'Database', 'Theme'].join('');
  const sanitizeUiConfig = createSanitizeUiConfig({
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
    getLEGACY_DB_THEME_SYNC_CONFIG_KEY: () => LEGACY_DB_THEME_SYNC_CONFIG_KEY,
  });

  const getConfig = createGetConfig({
    sanitizeUiConfig: (...a: any[]) => sanitizeUiConfig(...a),
    getLEGACY_DB_THEME_SYNC_CONFIG_KEY: () => LEGACY_DB_THEME_SYNC_CONFIG_KEY,
    get_configCache: () => _configCache,
    set_configCache: (v: any) => { _configCache = v; },
  });
  const saveConfig = createSaveConfig({
    getConfig: (...a: any[]) => getConfig(...a),
    applyConfigStyles: (...a: any[]) => applyConfigStyles(...a),
    sanitizeUiConfig: (...a: any[]) => sanitizeUiConfig(...a),
    get_configCache: () => _configCache,
    set_configCache: (v: any) => { _configCache = v; },
  });

  const DICE_CONFIG_BACKUP_FORMAT = 'acu_dice_config_backup_v1' as const;
  const DICE_CONFIG_BACKUP_SCHEMA_VERSION = 1;

  const DICE_PROFILE_INDEX_STORAGE_KEY = 'acu_dice_profile_index_v1';
  const DICE_PROFILE_LAST_APPLIED_STORAGE_KEY = 'acu_dice_profile_last_applied_v1';
  const DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY = 'acu_dice_profile_skipped_prompts_v1';
  const DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY = 'acu_dice_profile_collapsed_sections_v2';
  const DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT = 5;

  type DiceConfigBackupModuleId =
    | 'uiLayout'
    | 'diceConfig'
    | 'advancedPresets'
    | 'attributePresets'
    | 'actionGm'
    | 'dashboardPresets'
    | 'renderPresets'
    | 'tableTemplate'
    | 'tableTemplateRequirementPresets'
    | 'validation'
    | 'regex'
    | 'avatarMap'
    | 'customIcons'
    | 'gachaSettings';

  type DiceConfigBackupKeyStrategy =
    | 'object'
    | 'map'
    | 'setArray'
    | 'presetArray'
    | 'gachaPoolSettings'
    | 'gachaItemSettings'
    | 'raw'
    | 'rawString';

  interface DiceConfigBackupModuleDefinition {
    id: DiceConfigBackupModuleId;
    name: string;
    description: string;
    storageKeys: readonly string[];
    deprecated?: boolean;
    deprecatedReason?: string;
  }

  interface DiceConfigBackupModulePayload {
    storage: Record<string, unknown>;
    resources?: Record<string, unknown>;
    warnings?: string[];
  }

  interface DiceConfigBackupDocument {
    format: typeof DICE_CONFIG_BACKUP_FORMAT;
    schemaVersion: number;
    exportedAt: string;
    scriptVersion: string;
    presetFormatVersion: string;
    modules: Partial<Record<DiceConfigBackupModuleId, DiceConfigBackupModulePayload>>;
  }

  interface DiceConfigBackupParseResult {
    backup: DiceConfigBackupDocument;
    warnings: string[];
  }

  interface DiceConfigBackupApplyStats {
    added: number;
    overwritten: number;
    skipped: number;
    restoredModules: string[];
    warnings: string[];
  }

  interface DiceConfigBackupPresetMergeResult {
    value: unknown[];
    idMap: Map<string, string>;
    added: number;
    overwritten: number;
    skipped: number;
    warnings: string[];
  }

  interface DiceConfigBackupPendingActiveWrite {
    key: string;
    value: unknown;
    moduleName: string;
  }

  interface DiceConfigBackupGachaCatalogRollbackSnapshot {
    records: readonly GachaCatalogRecord[] | null;
    warning?: string;
  }

  interface DiceConfigBackupTableTemplateRollbackSnapshot {
    template?: unknown;
    warning?: string;
  }

  type DiceProfileSourceType = 'user' | 'imported' | 'character' | 'character_card' | 'snapshot';

  interface DiceProfileSummary {
    id: string;
    name: string;
    source: AcuDiceProfileSource;
    createdAt: string;
    updatedAt: string;
    moduleIds: DiceConfigBackupModuleId[];
    fingerprint: string;
    lastAppliedAt?: string;
  }

  type DiceProfileRecord = AcuDiceProfilePackage<DiceConfigBackupDocument> & {
    source: AcuDiceProfileSource & { type: DiceProfileSourceType | string };
    moduleIds: DiceConfigBackupModuleId[];
    savedAt: string;
    lastAppliedAt?: string;
  };

  interface DiceProfileApplyOptions {
    moduleIds?: readonly string[];
    createSnapshot?: boolean;
    confirm?: boolean;
  }

  interface DiceProfileSaveCurrentOptions {
    name?: string;
    moduleIds?: readonly string[];
    source?: AcuDiceProfileSource;
  }

  interface DiceProfileImportOptions {
    name?: string;
    source?: AcuDiceProfileSource;
    saveOnly?: boolean;
    apply?: boolean;
  }

  interface DiceCharacterProfileDetection {
    profile: DiceProfileRecord;
    sourceTextKind: 'message' | 'first_mes' | 'regex';
  }
  const _configCache_ACC = { get v(){ return _configCache; }, set v(x){ _configCache = x; } };
  return { DICE_CONFIG_BACKUP_FORMAT, DICE_CONFIG_BACKUP_SCHEMA_VERSION, DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY, DICE_PROFILE_INDEX_STORAGE_KEY, DICE_PROFILE_LAST_APPLIED_STORAGE_KEY, DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT, DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY, buildRelationshipGraphTableFromPreset, clearDiceLocalCacheData, collectCurrentChatAvatarNodes, getConfig, getCurrentChatAvatarNodes, getDashboardNpcListData, saveConfig, showAvatarManager, showCardEditModal, showManualUpdateDialog, showMapVisualization, showRelationshipGraph, _configCache_ACC };
}
