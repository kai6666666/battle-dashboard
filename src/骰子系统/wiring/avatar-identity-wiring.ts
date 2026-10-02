/**
 * wiring / avatar-identity-wiring.ts — 渲染预设/头像身份/对话缩进装配簇（从 index.ts 迁出，x4-r）。
 */
import { createAvatarManager } from '../entities/avatar-manager';
import { LocalAvatarDB } from '../entities/local-avatar-db';
import { findNameColumnIndex, getDisplayName, isCharacterTable } from '../entities/name-alias';
import { createInferAvatarImageColor } from '../features/avatar/infer-avatar-image-color';
import { createClampAvatarNumber } from '../features/avatars/clamp-avatar-number';
import { createGetAvatarFallbackColor } from '../features/avatars/get-avatar-fallback-color';
import { createGetAvatarLookupNames } from '../features/avatars/get-avatar-lookup-names';
import { createGetAvatarManualAliases } from '../features/avatars/get-avatar-manual-aliases';
import { createGetCharacterNameCandidates } from '../features/avatars/get-character-name-candidates';
import { createGetPersonaName } from '../features/avatars/get-persona-name';
import { createGetUserAvatarUrl } from '../features/avatars/get-user-avatar-url';
import { createHslToAvatarHex } from '../features/avatars/hsl-to-avatar-hex';
import { createIsLikelyAvatarSkinTone } from '../features/avatars/is-likely-avatar-skin-tone';
import { createLoadAvatarImageForColor } from '../features/avatars/load-avatar-image-for-color';
import { createNormalizeAvatarHexColor } from '../features/avatars/normalize-avatar-hex-color';
import { createNormalizeInferredAvatarColor } from '../features/avatars/normalize-inferred-avatar-color';
import { createRgbToAvatarHex } from '../features/avatars/rgb-to-avatar-hex';
import { createIsUserCharacterName } from '../features/characters/is-user-character-name';
import { createDialogueIndentRenderer } from '../features/dialogue-indent-renderer';
import { createCharacterNamesMatch } from '../features/dice/character-names-match';
import { createDiceStatsScopeLabels } from '../features/dice/dice-stats-scope-labels';
import { createGetDiceStatsContext } from '../features/dice/get-dice-stats-context';
import { createGetDisplayPlayerName } from '../features/dice/get-display-player-name';
import { createGetPlayerName } from '../features/dice/get-player-name';
import { createGetUserCharacterNameCandidates } from '../features/dice/get-user-character-name-candidates';
import { createIsDiceStatsScopeUnavailable } from '../features/dice/is-dice-stats-scope-unavailable';
import { createIsUserPlaceholderKey } from '../features/dice/is-user-placeholder-key';
import { createNameAliasRegistryInstance } from '../features/dice/name-alias-registry-instance';
import { createRenderDiceHistoryStatsHtml } from '../features/dice/render-dice-history-stats-html';
import { createReplaceUserPlaceholders } from '../features/dice/replace-user-placeholders';
import { createResolveCanonicalCharacterName } from '../features/dice/resolve-canonical-character-name';
import { FavoritesManager } from '../features/favorites/favorites-manager';
import { createDiceHistoryStatsDB } from '../features/history/dice-history-stats-db';
import { createCloneRenderPresetRules } from '../features/presets/clone-render-preset-rules';
import { createCreateBuiltinRenderPreset } from '../features/presets/create-builtin-render-preset';
import { createCreateRenderPresetEditorTemplate } from '../features/presets/create-render-preset-editor-template';
import { createDefaultRenderPresetRules } from '../features/presets/default-render-preset-rules';
import { createNormalizeRenderPresetAliasMap } from '../features/presets/normalize-render-preset-alias-map';
import { createNormalizeRenderPresetRules } from '../features/presets/normalize-render-preset-rules';
import { createNormalizeRenderPresetStringList } from '../features/presets/normalize-render-preset-string-list';
import { createNormalizeRenderPresetTagFilterList } from '../features/presets/normalize-render-preset-tag-filter-list';
import { createPresetManager } from '../features/presets/preset-manager';
import { createRegexPresetManager } from '../features/presets/regex-preset-manager';
import { createRenderPresetManager } from '../features/presets/render-preset-manager';
import { BUILTIN_REGEX_RULES } from '../features/regex/builtin-regex-rules';
import { createRegexTransformationEngine } from '../features/regex/regex-transformation-engine';
import { createRegexTransformationManager } from '../features/regex/regex-transformation-manager';
import { BUILTIN_VALIDATION_RULES } from '../features/validation/builtin-validation-rules';
import { createValidationEngine } from '../features/validation/validation-engine';
import { createValidationRuleManager } from '../features/validation/validation-rule-manager';
import { isNpcTableName } from '../shared/constants';
import { createDefaultDialogueIndentTagBlacklist } from '../shared/default-dialogue-indent-tag-blacklist';
import { DEFAULT_CONFIG } from '../shared/defaults-config';
import { createNormalizeCharacterNameForCompare } from '../shared/normalize-character-name-for-compare';
import { createPushUniqueNameCandidate } from '../shared/push-unique-name-candidate';
import { STORAGE_KEY_ACTIVE_PRESET, STORAGE_KEY_ACTIVE_RENDER_PRESET, STORAGE_KEY_AVATAR_MAP, STORAGE_KEY_BLACKLIST, STORAGE_KEY_PRESETS, STORAGE_KEY_REGEX_ACTIVE_PRESET, STORAGE_KEY_REGEX_ENABLED, STORAGE_KEY_REGEX_PRESETS, STORAGE_KEY_REGEX_RULES, STORAGE_KEY_RENDER_PRESETS, STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED, STORAGE_KEY_VALIDATION_ENABLED, STORAGE_KEY_VALIDATION_RULES } from '../shared/storage-keys';
import { FavoritesDB } from '../shared/storage/favorites-db';
import { Store } from '../shared/storage/store';


export function createAvatarIdentityWiring(deps: any) {
  const { DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS, LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS, RENDER_DEFAULT_PRESET_ID, RENDER_LEGACY_BLACKLIST_PRESET_ID, RENDER_PRESET_FORMAT, cachedRawData_ACC, compareVersion, escapeHtml, filterDeprecatedBuiltinRegexRules, getConfig, getDiceConfig, getJsonLikeErrorMessage, getTableData, getTavernHostDocument, isRecordValue, isSameKeywordSet, normalizeStorableImageUrl, parseJsoncRecord, processJsonData } = deps;
  interface RenderPresetColumnDisplayRules {
    stripBracketContent: boolean;
    aliases: Record<string, string>;
  }

  interface RenderPresetRelationshipRules {
    enabled: boolean;
    headerKeywords: string[];
    autoDetectMultipleParen: boolean;
  }

  interface RenderPresetAttributeRules {
    enabled: boolean;
    parseJsonObject: boolean;
    parseKeyValuePairs: boolean;
  }

  interface RenderPresetShortTagRules {
    enabled: boolean;
    maxLength: number;
  }

  interface RenderPresetBadgeRules {
    enabled: boolean;
    shortTextMaxLength: number;
    numericPattern: boolean;
    statusValues: string[];
  }

  interface RenderPresetQuickCheckRules {
    enabled: boolean;
    excludeKeywords: string[];
  }

  interface RenderPresetDialogueIndentRules {
    whitelist: string[];
    blacklist: string[];
  }

  interface RenderPresetRules {
    columnDisplay: RenderPresetColumnDisplayRules;
    invalidValues: string[];
    identityHeaderKeywords: string[];
    relationship: RenderPresetRelationshipRules;
    attributes: RenderPresetAttributeRules;
    shortTags: RenderPresetShortTagRules;
    badges: RenderPresetBadgeRules;
    quickCheck: RenderPresetQuickCheckRules;
    dialogueIndent: RenderPresetDialogueIndentRules;
  }

  interface RenderPreset {
    format: typeof RENDER_PRESET_FORMAT;
    version: string;
    id: string;
    name: string;
    builtin?: boolean;
    description?: string;
    rules: RenderPresetRules;
    createdAt?: string;
    updatedAt?: string;
  }

  const normalizeRenderPresetStringList = createNormalizeRenderPresetStringList({

  });

  const normalizeRenderPresetTagFilterList = createNormalizeRenderPresetTagFilterList({

  });

  const normalizeRenderPresetAliasMap = createNormalizeRenderPresetAliasMap({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
  });

  const cloneRenderPresetRules = createCloneRenderPresetRules({

  });

  const DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST = createDefaultDialogueIndentTagBlacklist({

  });

  const DEFAULT_RENDER_PRESET_RULES = createDefaultRenderPresetRules({
    DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST: DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST,
    DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
  });

  const normalizeRenderPresetRules = createNormalizeRenderPresetRules({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeRenderPresetAliasMap: (...a: any[]) => normalizeRenderPresetAliasMap(...a),
    normalizeRenderPresetStringList: (...a: any[]) => normalizeRenderPresetStringList(...a),
    normalizeRenderPresetTagFilterList: (...a: any[]) => normalizeRenderPresetTagFilterList(...a),
    DEFAULT_RENDER_PRESET_RULES: DEFAULT_RENDER_PRESET_RULES,
  });

  const createBuiltinRenderPreset = createCreateBuiltinRenderPreset({
    cloneRenderPresetRules: (...a: any[]) => cloneRenderPresetRules(...a),
    getDEFAULT_RENDER_PRESET_RULES: () => DEFAULT_RENDER_PRESET_RULES,
    getRENDER_DEFAULT_PRESET_ID: () => RENDER_DEFAULT_PRESET_ID,
    getRENDER_PRESET_FORMAT: () => RENDER_PRESET_FORMAT,
  });

  const parseRenderPresetJson = (jsonText: string): { name: string; description: string; rules: RenderPresetRules } => {
    const parsed = parseJsoncRecord(jsonText, '渲染预设');

    const format = typeof parsed.format === 'string' ? parsed.format : '';
    if (format && format !== RENDER_PRESET_FORMAT) {
      throw new Error(`不支持的预设格式: ${format}`);
    }

    const rawRules = 'rules' in parsed ? parsed.rules : parsed;
    const rules = normalizeRenderPresetRules(rawRules) as unknown as RenderPresetRules;
    const name = typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : '导入的渲染预设';
    const description = typeof parsed.description === 'string' ? parsed.description.trim() : '';
    return { name, description, rules };
  };

  const createRenderPresetEditorTemplate = createCreateRenderPresetEditorTemplate({
    DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST: DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST,
    DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
  });

  const RenderPresetManager = createRenderPresetManager({
    cloneRenderPresetRules: (...a: any[]) => cloneRenderPresetRules(...a),
    createBuiltinRenderPreset: (...a: any[]) => createBuiltinRenderPreset(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    isSameKeywordSet: (...a: any[]) => isSameKeywordSet(...a),
    normalizeRenderPresetRules: (...a: any[]) => normalizeRenderPresetRules(...a),
    normalizeRenderPresetStringList: (...a: any[]) => normalizeRenderPresetStringList(...a),
    parseRenderPresetJson: (...a: any[]) => parseRenderPresetJson(...a),
    DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
    DEFAULT_RENDER_PRESET_RULES: DEFAULT_RENDER_PRESET_RULES,
    LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
    RENDER_DEFAULT_PRESET_ID: RENDER_DEFAULT_PRESET_ID,
    RENDER_LEGACY_BLACKLIST_PRESET_ID: RENDER_LEGACY_BLACKLIST_PRESET_ID,
    RENDER_PRESET_FORMAT: RENDER_PRESET_FORMAT,
    STORAGE_KEY_ACTIVE_RENDER_PRESET: STORAGE_KEY_ACTIVE_RENDER_PRESET,
    STORAGE_KEY_BLACKLIST: STORAGE_KEY_BLACKLIST,
    STORAGE_KEY_RENDER_PRESETS: STORAGE_KEY_RENDER_PRESETS,
    STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED: STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED,
  });

  // ========================================
  // PresetManager - 验证规则预设管理
  // ========================================



  const PresetManager = createPresetManager({
    compareVersion: (...a: any[]) => compareVersion(...a),
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    getValidationRuleManager: () => ValidationRuleManager,
    BUILTIN_VALIDATION_RULES: BUILTIN_VALIDATION_RULES,
    STORAGE_KEY_ACTIVE_PRESET: STORAGE_KEY_ACTIVE_PRESET,
    STORAGE_KEY_PRESETS: STORAGE_KEY_PRESETS,
    STORAGE_KEY_VALIDATION_RULES: STORAGE_KEY_VALIDATION_RULES,
  });
  // 验证规则管理器（从 PresetManager 获取规则）
  const ValidationRuleManager = createValidationRuleManager({
    isNpcTableName: (...a: any[]) => isNpcTableName(...a),
    getPresetManager: () => PresetManager,
    STORAGE_KEY_VALIDATION_ENABLED: STORAGE_KEY_VALIDATION_ENABLED,
  });
  // ========================================
  // RegexTransformationManager - 表格正则规则管理器 (Phase 1.2)
  // ========================================
  const RegexTransformationManager = createRegexTransformationManager({
    filterDeprecatedBuiltinRegexRules: (...a: any[]) => filterDeprecatedBuiltinRegexRules(...a),
    getRegexPresetManager: () => RegexPresetManager,
    STORAGE_KEY_REGEX_ENABLED: STORAGE_KEY_REGEX_ENABLED,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
  });
  // ========================================
  // RegexPresetManager - 表格正则预设管理器 (Phase 1.3)
  // ========================================
  const RegexPresetManager = createRegexPresetManager({
    compareVersion: (...a: any[]) => compareVersion(...a),
    filterDeprecatedBuiltinRegexRules: (...a: any[]) => filterDeprecatedBuiltinRegexRules(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    getRegexTransformationManager: () => RegexTransformationManager,
    BUILTIN_REGEX_RULES: BUILTIN_REGEX_RULES,
    STORAGE_KEY_REGEX_ACTIVE_PRESET: STORAGE_KEY_REGEX_ACTIVE_PRESET,
    STORAGE_KEY_REGEX_PRESETS: STORAGE_KEY_REGEX_PRESETS,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
  });
  // ========================================
  // RegexTransformationEngine - 正则转换引擎 (Phase 2.1)
  // ========================================
  const RegexTransformationEngine = createRegexTransformationEngine({
    getRegexTransformationManager: () => RegexTransformationManager,
  });
  // ========================================
  // ValidationEngine - 数据验证引擎
  // ========================================
  const ValidationEngine = createValidationEngine({
    isNpcTableName: (...a: any[]) => isNpcTableName(...a),
    getValidationRuleManager: () => ValidationRuleManager,
  });
  // ========================================
  // LocalAvatarDB - 本地头像 IndexedDB 存储
  // ========================================
  // ========================================
  // FavoritesDB - 收藏夹 IndexedDB 存储
  // ========================================
  /**
   * @typedef {Object} FavoriteItem
   * @property {string} id - UUID
   * @property {string[]} header - 列名数组 (不含首列null)
   * @property {(string|number)[]} rowData - 值数组 (与header对应)
   * @property {string[]} tags - 用户标签
   * @property {number} createdAt - 创建时间戳
   * @property {number} updatedAt - 最后修改时间戳
   * @property {{tableUid: string, tableName: string, chatId: string}} [sourceInfo] - 来源信息
   */
  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  const DiceHistoryStatsDB = createDiceHistoryStatsDB({
    getDiceStatsContext: (...a: any[]) => getDiceStatsContext(...a),
  });
  // ========================================
  // FavoritesManager - 收藏夹业务逻辑层
  // ========================================

  interface TableCompatibility {
    tableUid: string;
    tableName: string;
    mode: 'strict' | 'loose' | 'incompatible';
    matchedCols: string[];
    unmatchedCols: string[];
    matchRatio: number;
  }


  // [新增] 获取 SillyTavern 用户头像 URL
  const getUserAvatarUrl = createGetUserAvatarUrl({

  });

  // [新增] 获取主角名字（用于判断是否是主角）
  const getPlayerName = createGetPlayerName({
    getTableData: (...a: any[]) => getTableData(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // [新增] 获取 SillyTavern Persona 名称（用于显示）
  const getPersonaName = createGetPersonaName({

  });

  // [新增] 获取用于显示的玩家名称（优先 Persona，其次主角表，最后默认值）
  const getDisplayPlayerName = createGetDisplayPlayerName({
    getPersonaName: (...a: any[]) => getPersonaName(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
  });

  // [新增] 替换文本中的用户占位符为 Persona 名称（仅用于显示）
  const replaceUserPlaceholders = createReplaceUserPlaceholders({
    getDisplayPlayerName: (...a: any[]) => getDisplayPlayerName(...a),
  });

  const USER_AVATAR_LOOKUP_KEYS = ['{{user}}', '<user>'] as const;

  const getAvatarLookupNames = createGetAvatarLookupNames({
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getPersonaName: (...a: any[]) => getPersonaName(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
    USER_AVATAR_LOOKUP_KEYS: USER_AVATAR_LOOKUP_KEYS,
  });

  // [x4-o] DiceStatsScope 已迁至 ./shared/index-local-types.ts

  interface DiceStatsContext {
    chatId: string;
    characterId: string;
  }

  const getDiceStatsContext = createGetDiceStatsContext({

  });

  const DICE_STATS_SCOPE_LABELS = createDiceStatsScopeLabels({

  });

  const isDiceStatsScopeUnavailable = createIsDiceStatsScopeUnavailable({

  });

  const renderDiceHistoryStatsHtml = createRenderDiceHistoryStatsHtml({
    getDiceStatsContext: (...a: any[]) => getDiceStatsContext(...a),
    isDiceStatsScopeUnavailable: (...a: any[]) => isDiceStatsScopeUnavailable(...a),
    DICE_STATS_SCOPE_LABELS: DICE_STATS_SCOPE_LABELS,
  });

  type AvatarImageColorSource = 'manual' | 'auto';

  const normalizeAvatarHexColor = createNormalizeAvatarHexColor({

  });

  const clampAvatarNumber = createClampAvatarNumber({

  });

  const rgbToAvatarHex = createRgbToAvatarHex({

  });

  const avatarHexToRgb = (value: unknown): { r: number; g: number; b: number } | null => {
    const color = normalizeAvatarHexColor(value);
    if (!color) return null;
    return {
      r: Number.parseInt(color.slice(1, 3), 16),
      g: Number.parseInt(color.slice(3, 5), 16),
      b: Number.parseInt(color.slice(5, 7), 16),
    };
  };

  const rgbToAvatarHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;
    const l = (max + min) / 2;
    if (delta === 0) return { h: 0, s: 0, l };
    const s = delta / (1 - Math.abs(2 * l - 1));
    let h = 0;
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
    return { h: (h * 60 + 360) % 360, s, l };
  };

  const avatarHexToHsl = (value: unknown): { h: number; s: number; l: number } | null => {
    const rgb = avatarHexToRgb(value);
    if (!rgb) return null;
    return rgbToAvatarHsl(rgb.r, rgb.g, rgb.b);
  };

  const hslToAvatarHex = createHslToAvatarHex({
    rgbToAvatarHex: (...a: any[]) => rgbToAvatarHex(...a),
  });

  const getAvatarFallbackColor = createGetAvatarFallbackColor({
    hslToAvatarHex: (...a: any[]) => hslToAvatarHex(...a),
  });

  const isLikelyAvatarSkinTone = createIsLikelyAvatarSkinTone({

  });

  const normalizeInferredAvatarColor = createNormalizeInferredAvatarColor({
    hslToAvatarHex: (...a: any[]) => hslToAvatarHex(...a),
    rgbToAvatarHsl: (...a: any[]) => rgbToAvatarHsl(...a),
  });

  const loadAvatarImageForColor = createLoadAvatarImageForColor({

  });

  const inferAvatarImageColor = createInferAvatarImageColor({
    clampAvatarNumber: (...a: any[]) => clampAvatarNumber(...a),
    isLikelyAvatarSkinTone: (...a: any[]) => isLikelyAvatarSkinTone(...a),
    loadAvatarImageForColor: (...a: any[]) => loadAvatarImageForColor(...a),
    normalizeInferredAvatarColor: (...a: any[]) => normalizeInferredAvatarColor(...a),
    rgbToAvatarHsl: (...a: any[]) => rgbToAvatarHsl(...a),
  });

  // 头像管理工具（支持裁剪偏移）
  const AvatarManager = createAvatarManager({
    storeGet: (key: string, fallback: any) => Store.get(key, fallback),
    storeSet: (key: string, value: any) => Store.set(key, value),
    storageKey: STORAGE_KEY_AVATAR_MAP,
    normalizeStorableImageUrl: (url: unknown) => normalizeStorableImageUrl(url),
    normalizeAvatarHexColor: (value: unknown) => normalizeAvatarHexColor(value),
    getAvatarFallbackColor: (name: unknown) => getAvatarFallbackColor(name),
    getAvatarLookupNames: (name: unknown) => getAvatarLookupNames(name),
    localAvatarGet: (name: any) => LocalAvatarDB.get(name),
    localAvatarHas: (name: any) => LocalAvatarDB.has(name),
    localAvatarSave: (name: any, blob: any) => LocalAvatarDB.save(name, blob),
    localAvatarDelete: (name: any) => LocalAvatarDB.delete(name),
  });

  // ========================================
  // 角色名称解析与别名系统
  // ========================================

  /**
   * 解析逗号分隔的角色名称，提取主名称（display name）和别名
   * 规则：最长的名称为主key，长度相同时靠前的优先
   * 例如："千早爱音,千早,爱音" → { displayName: "千早爱音", aliases: ["千早", "爱音"] }
   * 例如："奥兹艾萨克，奥兹，艾萨克" → { displayName: "奥兹艾萨克", aliases: ["奥兹", "艾萨克"] }
   */
  const NameAliasRegistry = createNameAliasRegistryInstance({
    getAvatarManager: () => AvatarManager,
  });

  const USER_NODE_KEY = '{{user}}';
  const USER_PLACEHOLDER_KEYS = [USER_NODE_KEY, '<user>'];

  const isUserPlaceholderKey = createIsUserPlaceholderKey({
    getUSER_PLACEHOLDER_KEYS: () => USER_PLACEHOLDER_KEYS,
  });

  type DiceTableCell = string | number | null;
  type DiceRawSheet = { name?: string; content?: DiceTableCell[][] };
  type DiceRawData = Record<string, DiceRawSheet>;

  interface CharacterAttributeRowLookup {
    sheetKey: string;
    sheet: { name?: string; content: DiceTableCell[][] };
    rowIndex: number;
    headers: DiceTableCell[];
    isUser: boolean;
  }

  const normalizeCharacterNameForCompare = createNormalizeCharacterNameForCompare({

  });

  const pushUniqueNameCandidate = createPushUniqueNameCandidate({

  });

  const getAvatarManualAliases = createGetAvatarManualAliases({
    getAvatarManager: () => AvatarManager,
  });

  const getCharacterNameCandidates = createGetCharacterNameCandidates({
    getAvatarManualAliases: (...a: any[]) => getAvatarManualAliases(...a),
    pushUniqueNameCandidate: (...a: any[]) => pushUniqueNameCandidate(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    NameAliasRegistry: NameAliasRegistry,
  });

  const getUserCharacterNameCandidates = createGetUserCharacterNameCandidates({
    getAvatarManualAliases: (...a: any[]) => getAvatarManualAliases(...a),
    getCharacterNameCandidates: (...a: any[]) => getCharacterNameCandidates(...a),
    getDisplayPlayerName: (...a: any[]) => getDisplayPlayerName(...a),
    getPersonaName: (...a: any[]) => getPersonaName(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
    pushUniqueNameCandidate: (...a: any[]) => pushUniqueNameCandidate(...a),
    getUSER_PLACEHOLDER_KEYS: () => USER_PLACEHOLDER_KEYS,
  });

  const isUserCharacterName = createIsUserCharacterName({
    getCharacterNameCandidates: (...a: any[]) => getCharacterNameCandidates(...a),
    getUserCharacterNameCandidates: (...a: any[]) => getUserCharacterNameCandidates(...a),
    normalizeCharacterNameForCompare: (...a: any[]) => normalizeCharacterNameForCompare(...a),
  });

  const resolveCanonicalCharacterName = createResolveCanonicalCharacterName({
    isUserCharacterName: (...a: any[]) => isUserCharacterName(...a),
    getNameAliasRegistry: () => NameAliasRegistry,
  });

  const characterNamesMatch = createCharacterNamesMatch({
    getCharacterNameCandidates: (...a: any[]) => getCharacterNameCandidates(...a),
    isUserCharacterName: (...a: any[]) => isUserCharacterName(...a),
    normalizeCharacterNameForCompare: (...a: any[]) => normalizeCharacterNameForCompare(...a),
  });

  const dialogueIndentRenderer = createDialogueIndentRenderer({
    getConfig: () => getConfig(),
    getDefaultTheme: () => String(DEFAULT_CONFIG.theme),
    getCachedRawData: () => cachedRawData_ACC.v,
    getTableData: () => getTableData({ silent: true }),
    processJsonData: json => processJsonData(json),
    rebuildNameAliases: tables => NameAliasRegistry.rebuild(tables),
    getNameAliases: name => NameAliasRegistry.getAliases(name),
    resolveNameAlias: name => NameAliasRegistry.resolve(name),
    getAvatarLookupNames: name => getAvatarLookupNames(name),
    getAvatarAll: () => AvatarManager.getAll() as Record<string, { aliases?: unknown[] } | undefined>,
    getAvatarPrimaryName: name => AvatarManager.getPrimaryName(name),
    getAvatarAsync: name => AvatarManager.getAsync(name),
    getAvatarOffsetX: name => AvatarManager.getOffsetX(name),
    getAvatarOffsetY: name => AvatarManager.getOffsetY(name),
    getAvatarScale: name => AvatarManager.getScale(name),
    getAvatarImageColor: name => AvatarManager.getImageColor(name),
    getLocalAvatarNames: () => LocalAvatarDB.getAllNames() as Promise<string[]>,
getTagFilter: () => RenderPresetManager.getDialogueIndentTagFilter() as any,
    isCharacterTable,
    findNameColumnIndex,
    getCharacterNameCandidates,
    getDisplayName,
    replaceUserPlaceholders: text => replaceUserPlaceholders(text),
    escapeHtml,
    formatMessageBeforeDialogueIndent: text => {
      let processedText = text;
      if (typeof substitudeMacros === 'function') {
        processedText = substitudeMacros(processedText);
      }
      if (typeof formatAsTavernRegexedString === 'function') {
        return String(formatAsTavernRegexedString(processedText, 'ai_output', 'display', { depth: 0 }));
      }
      return processedText;
    },
    formatRegexedMessageFragment: text => {
      if (typeof builtin !== 'undefined' && typeof builtin.renderMarkdown === 'function') {
        return builtin.renderMarkdown(text);
      }
      return escapeHtml(text).replace(/\n/g, '<br>');
    },
    getHostDocument: () => getTavernHostDocument(),
    getJQuery: () => $,
    retrieveDisplayedMessage: messageId => {
      if (typeof retrieveDisplayedMessage !== 'function') return null;
      try {
        return retrieveDisplayedMessage(messageId);
      } catch (error) {
        console.warn('[DICE]正文头像渲染获取显示楼层失败，改用选择器:', error);
        return null;
      }
    },
    emitMessageRendered: messageId => {
      try {
        const source = window.SillyTavern?.eventSource;
        const events = window.SillyTavern?.eventTypes || window.tavern_events;
        const eventName = events?.CHARACTER_MESSAGE_RENDERED;
        if (source && eventName) {
          void source.emit(eventName, Number(messageId));
        }
      } catch (error) {
        console.warn('[DICE]正文头像渲染通知前端块重新渲染失败:', error);
      }
    },
    getLatestAssistantMessage: () => {
      try {
        const messages = getChatMessages(-1);
        const latest = Array.isArray(messages) ? messages[0] : null;
        if (!latest || latest.role !== 'assistant' || latest.is_system || latest.is_hidden) return null;
        return latest;
      } catch (error) {
        console.warn('[DICE]正文头像渲染读取最新楼层失败:', error);
        return null;
      }
    },
    warn: (message, error) => console.warn(`[DICE]${message}:`, error),
  });
  const h_ACC = { get v(){ return h; }, set v(x){ h = x; } };
  return { AvatarManager, DiceHistoryStatsDB, NameAliasRegistry, PresetManager, RegexPresetManager, RegexTransformationEngine, RegexTransformationManager, RenderPresetManager, USER_NODE_KEY, USER_PLACEHOLDER_KEYS, ValidationEngine, ValidationRuleManager, avatarHexToHsl, characterNamesMatch, clampAvatarNumber, cloneRenderPresetRules, createRenderPresetEditorTemplate, dialogueIndentRenderer, getAvatarFallbackColor, getDiceStatsContext, getDisplayPlayerName, getPersonaName, getPlayerName, hslToAvatarHex, inferAvatarImageColor, isUserCharacterName, isUserPlaceholderKey, normalizeAvatarHexColor, parseRenderPresetJson, renderDiceHistoryStatsHtml, replaceUserPlaceholders, resolveCanonicalCharacterName, h_ACC };
}
