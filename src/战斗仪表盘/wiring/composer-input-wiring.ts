/**
 * wiring / composer-input-wiring.ts — 输入区/发送链/文本缓存与工具装配簇（从 index.ts 迁出，x4-q）。
 */
import { createBuildAvatarBackgroundStyle } from '../features/avatars/build-avatar-background-style';
import { createNormalizeStorableImageUrl } from '../features/avatars/normalize-storable-image-url';
import { createBookmarkManager } from '../features/bookmarks/bookmark-manager';
import { createBindHumanInputTracking } from '../features/chat/bind-human-input-tracking';
import { createComposeTextareaTextWithHiddenDice } from '../features/chat/compose-textarea-text-with-hidden-dice';
import { createFindComposerSendButton } from '../features/chat/find-composer-send-button';
import { createRestoreDiceResultBeforeSend } from '../features/chat/restore-dice-result-before-send';
import { createSendChatTextAndTrigger } from '../features/chat/send-chat-text';
import { createSendTextViaComposer } from '../features/chat/send-text-via-composer';
import { createStoreTextareaDiceCache } from '../features/chat/store-textarea-dice-cache';
import { createSyncTextareaDiceCacheFromVisibleText } from '../features/chat/sync-textarea-dice-cache-from-visible-text';
import { ConsoleCaptureManager } from '../features/console/console-capture-manager';
import { createErrorHandler } from '../features/console/error-handler';
import { createCustomRollMode } from '../features/dice/custom-roll-mode';
import { createReadStoredLatestDiceText } from '../features/dice/read-stored-latest-dice-text';
import { createReadStoredTextareaDiceText } from '../features/dice/read-stored-textarea-dice-text';
import { createRenderDeprecatedBadge } from '../features/dice/render-deprecated-badge';
import { createExecuteEffects } from '../features/effects/execute-effects';
import { createExecuteSecondaryEffectsChain } from '../features/effects/execute-secondary-effects-chain';
import { createCapturePendingHumanInputSnapshot } from '../features/human-input/capture-pending-human-input-snapshot';
import { createConsumePendingHumanInputSnapshot } from '../features/human-input/consume-pending-human-input-snapshot';
import { createExtractExplicitHumanInputText } from '../features/human-input/extract-explicit-human-input-text';
import { createExtractMetaCheckResultBlocks } from '../features/human-input/extract-meta-check-result-blocks';
import { createHumanInputTagBlockPatterns } from '../features/human-input/human-input-tag-block-patterns';
import { createMarkHumanInputActivity } from '../features/human-input/mark-human-input-activity';
import { createStripKnownSystemActionText } from '../features/human-input/strip-known-system-action-text';
import { createStripSystemInjectedContent } from '../features/human-input/strip-system-injected-content';
import { createShowPresetConflictDialog } from '../features/presets/show-preset-conflict-dialog';
import { createCreateDiceResultPlaceholderRegex } from '../features/regex/create-dice-result-placeholder-regex';
import { createCreateMetaCheckResultRegex } from '../features/regex/create-meta-check-result-regex';
import { createErrorTableTemplateIssue } from '../features/table/error-table-template-issue';
import { createFindRowIndexByPrimaryKey } from '../features/table/find-row-index-by-primary-key';
import { createFindSillyTavernSlashRunner } from '../features/table/find-silly-tavern-slash-runner';
import { createGetSheetKeyByTableName } from '../features/table/get-sheet-key-by-table-name';
import { createWarnTableTemplateIssue } from '../features/table/warn-table-template-issue';
import { createWithTableTemplateCheckHint } from '../features/table/with-table-template-check-hint';
import { createClearComposerIfCurrentText } from '../features/textarea/clear-composer-if-current-text';
import { createClearTextareaDiceCache } from '../features/textarea/clear-textarea-dice-cache';
import { createGetComposerTextarea } from '../features/textarea/get-composer-textarea';
import { createGetResolvedComposerText } from '../features/textarea/get-resolved-composer-text';
import { createInterceptTextareaValue } from '../features/textarea/intercept-textarea-value';
import { createNotifyTextareaValueChanged } from '../features/textarea/notify-textarea-value-changed';
import { createQuoteSlashArgument } from '../features/textarea/quote-slash-argument';
import { createReadTextareaVisibleValue } from '../features/textarea/read-textarea-visible-value';
import { createResolveTextareaTextWithHiddenDice } from '../features/textarea/resolve-textarea-text-with-hidden-dice';
import { createSetTextareaValueAndNotify } from '../features/textarea/set-textarea-value-and-notify';
import { createSmartInsertToTextarea } from '../features/textarea/smart-insert';
import { createTriggerGenerationAfterDirectSend } from '../features/textarea/trigger-generation-after-direct-send';
import { createGetRuntimeWindowCandidates } from '../features/ui/get-runtime-window-candidates';
import { createIsRemoteImageUrlValid } from '../features/ui/is-remote-image-url-valid';
import { createNormalizeImageUrlInput } from '../features/ui/normalize-image-url-input';
import { createSafeUpdateAttribute } from '../features/ui/safe-update-attribute';
import { createCompareVersion } from '../shared/compare-version';
import { createCountUnicodeCharacters } from '../shared/count-unicode-characters';
import { createEscapeCssString } from '../shared/escape-css-string';
import { createFindRuntimeFunction } from '../shared/find-runtime-function';
import { createFormatCssImageUrl } from '../shared/format-css-image-url';
import { createGenerateUniqueName } from '../shared/generate-unique-name';
import { createGetImageUrlValidationMessage } from '../shared/get-image-url-validation-message';
import { createGetRemoteImageUrlValidationError } from '../shared/get-remote-image-url-validation-error';
import { createIsRenderableImageUrlValid } from '../shared/is-renderable-image-url-valid';
import { getDbLockAPI } from '../shared/misc-utils';
import { createNormalizeTrackedText, escapeRegExpLiteralImpl as escapeRegExpLiteral } from '../shared/normalize-tracked-text';
import { createParseImageUrl } from '../shared/parse-image-url';
import { createSafeDecodeURIComponent } from '../shared/safe-decode-uri-component';
import { createSafeEncodeURIComponent } from '../shared/safe-encode-uri-component';
import { createSetupOverlayClose } from '../shared/setup-overlay-close';
import { createStripLoneSurrogates } from '../shared/strip-lone-surrogates';


export function createComposerInputWiring(deps: any) {
  const { cachedRawData_ACC, evaluateCondition, evaluateFormula, getAttributeValue, getConfig, getCore, getCurrentContextFingerprint, getDiceConfig, getFullAttributesForCharacter, getTableData, getTavernHostDocument, getTavernHostWindow, init, isSameAttributeAlias, performSaveDataOnly, runInSaveQueue, scheduleViewportBoundsRefresh, updateSingleAttribute } = deps;
  const TABLE_TEMPLATE_CHECK_HINT = '请在高级设置中使用“检验表格模板”检查当前表格模板。';

  const withTableTemplateCheckHint = createWithTableTemplateCheckHint({
    getTABLE_TEMPLATE_CHECK_HINT: () => TABLE_TEMPLATE_CHECK_HINT,
  });

  const warnTableTemplateIssue = createWarnTableTemplateIssue({
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const errorTableTemplateIssue = createErrorTableTemplateIssue({

  });

  /**
   * 获取行的主键值
   * @param tableName 表名
   * @param row 行数据
   * @param headers 表头
   */

  // ========================================
  // 数据库适配层 (LockManager -> GodDB API)
  // ========================================

  /**
   * 获取数据库锁定API
   * @returns API对象，如果不可用返回null
   */

  /**
   * 根据表名获取sheetKey
   * @param tableName - 表名（如"主角信息"）
   * @returns sheetKey（如"sheet_0"），找不到返回null
   */
  const getSheetKeyByTableName = createGetSheetKeyByTableName({
    getTableData: (...a: any[]) => getTableData(...a),
  });

  /**
   * 通过主键值查找行索引
   * @param sheetKey - 表格标识
   * @param tableName - 表名
   * @param primaryKeyValue - 主键值（格式可能是 "字段名=值" 或纯值）
   * @returns 行索引（从0开始），找不到返回null
   */
  const findRowIndexByPrimaryKey = createFindRowIndexByPrimaryKey({
    getTableData: (...a: any[]) => getTableData(...a),
  });

  /**
   * 安全地修改角色卡属性值
   * @param characterName - 角色名称
   * @param attrName - 属性名称
   * @param operation - 操作类型: 'add' | 'subtract' | 'set'
   * @param value - 操作数值
   * @param options - 可选配置 { initValue?: number, min?: number, max?: number }
   * @returns Promise<{ success: boolean, oldValue: number, newValue: number, error?: string }>
   */
  const safeUpdateAttribute = createSafeUpdateAttribute({
    getDbLockAPI: (...a: any[]) => getDbLockAPI(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    setCachedRawData: (v: any) => { cachedRawData_ACC.v = v; },
  });

  /**
   * 执行检定后果效果
   * 在 MESSAGE_SENT 事件中调用，异步执行不阻塞消息发送
   * @param pendingCtx 待执行的后果上下文
   * @returns 执行结果数组
   */
  const executeEffects = createExecuteEffects({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    executeSecondaryEffectsChain: (...a: any[]) => executeSecondaryEffectsChain(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    performSaveDataOnly: (...a: any[]) => performSaveDataOnly(...a),
    updateSingleAttribute: (...a: any[]) => updateSingleAttribute(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });


  const executeSecondaryEffectsChain = createExecuteSecondaryEffectsChain({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    isSameAttributeAlias: (...a: any[]) => isSameAttributeAlias(...a),
    updateSingleAttribute: (...a: any[]) => updateSingleAttribute(...a),
  });

  /**
   * 根据后果执行结果计算输出模板变量
   * @param results 后果执行结果数组
   * @returns 可用于 outputContext 的变量对象
   */



  /**
   * 根据待执行的效果定义预计算输出模板变量
   * 用于在输出模板中显示预期的效果信息（实际执行在消息发送后）
   * @param effects 效果定义数组
   * @returns 可用于 outputContext 的变量对象
   */

  // ========================================
  // BookmarkManager - 书签管理器（按聊天隔离）
  // ========================================
  const BookmarkManager = createBookmarkManager({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });  const escapeHtml = s =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  type ImageUrlValidationReason = 'invalid_url' | 'invalid_protocol' | 'svg_url';

  const REMOTE_IMAGE_ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
  const INTERNAL_IMAGE_ALLOWED_PROTOCOLS = new Set(['blob:']);

  const normalizeImageUrlInput = createNormalizeImageUrlInput({

  });

  const parseImageUrl = createParseImageUrl({
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

  const getRemoteImageUrlValidationError = createGetRemoteImageUrlValidationError({
    parseImageUrl: (...a: any[]) => parseImageUrl(...a),
    getREMOTE_IMAGE_ALLOWED_PROTOCOLS: () => REMOTE_IMAGE_ALLOWED_PROTOCOLS,
  });

  const isRemoteImageUrlValid = createIsRemoteImageUrlValid({
    getRemoteImageUrlValidationError: (...a: any[]) => getRemoteImageUrlValidationError(...a),
  });

  const isRenderableImageUrlValid = createIsRenderableImageUrlValid({
    getRemoteImageUrlValidationError: (...a: any[]) => getRemoteImageUrlValidationError(...a),
    parseImageUrl: (...a: any[]) => parseImageUrl(...a),
    getINTERNAL_IMAGE_ALLOWED_PROTOCOLS: () => INTERNAL_IMAGE_ALLOWED_PROTOCOLS,
  });

  const normalizeStorableImageUrl = createNormalizeStorableImageUrl({
    isRemoteImageUrlValid: (...a: any[]) => isRemoteImageUrlValid(...a),
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

  const getImageUrlValidationMessage = createGetImageUrlValidationMessage({

  });

  const escapeCssString = createEscapeCssString({
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

  const formatCssImageUrl = createFormatCssImageUrl({
    escapeCssString: (...a: any[]) => escapeCssString(...a),
    isRemoteImageUrlValid: (...a: any[]) => isRemoteImageUrlValid(...a),
    isRenderableImageUrlValid: (...a: any[]) => isRenderableImageUrlValid(...a),
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

  const buildAvatarBackgroundStyle = createBuildAvatarBackgroundStyle({
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
  });


  const renderDeprecatedBadge = createRenderDeprecatedBadge({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const stripLoneSurrogates = createStripLoneSurrogates({

  });

  const safeEncodeURIComponent = createSafeEncodeURIComponent({
    stripLoneSurrogates: (...a: any[]) => stripLoneSurrogates(...a),
  });

  const safeDecodeURIComponent = createSafeDecodeURIComponent({
    stripLoneSurrogates: (...a: any[]) => stripLoneSurrogates(...a),
  });

  /**
   * 设置弹窗点击遮罩关闭的事件监听
   * - PC端：需要 mousedown 和 mouseup 都在遮罩上才关闭（防止选择文本时误关闭）
   * - Mobile端：保持原有行为，触摸点击遮罩即关闭
   * @param $overlay jQuery对象，弹窗遮罩层
   * @param overlayClass 遮罩层的类名（用于判断点击目标）
   * @param onClose 关闭时的回调函数
   */
  const setupOverlayClose = createSetupOverlayClose({

  });

  // [新增] 生成唯一名称（用于预设导入时处理重名）
  const generateUniqueName = createGenerateUniqueName({

  });

  // [新增] 通用预设导入冲突弹窗（复用头像导入弹窗样式）
  const showPresetConflictDialog = createShowPresetConflictDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    generateUniqueName: (...a: any[]) => generateUniqueName(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });
  type AcuDiceTextareaElement = HTMLTextAreaElement & {
    _acuOriginalDiceText?: string | null;
    _acuOriginalTextareaText?: string | null;
    _acuOriginalActionText?: string | null;
    _acuHasDiceData?: boolean;
    _acuValueIntercepted?: boolean;
    _acuHumanInputTrackingBound?: boolean;
  };

  const DICE_RESULT_PLACEHOLDER = '[投骰结果已隐藏]';
  const createMetaCheckResultRegex = createCreateMetaCheckResultRegex({

  });
  const createDiceResultPlaceholderRegex = createCreateDiceResultPlaceholderRegex({});


  const notifyTextareaValueChanged = createNotifyTextareaValueChanged({

  });

  const setTextareaValueAndNotify = createSetTextareaValueAndNotify({
    notifyTextareaValueChanged: (...a: any[]) => notifyTextareaValueChanged(...a),
  });

  const readTextareaVisibleValue = createReadTextareaVisibleValue({

  });

  const extractMetaCheckResultBlocks = createExtractMetaCheckResultBlocks({
    createMetaCheckResultRegex: (...a: any[]) => createMetaCheckResultRegex(...a),
  });

  const readStoredTextareaDiceText = createReadStoredTextareaDiceText({
    getCore: (...a: any[]) => getCore(...a),
  });

  const readStoredLatestDiceText = createReadStoredLatestDiceText({
    getCore: (...a: any[]) => getCore(...a),
  });

  const composeTextareaTextWithHiddenDice = createComposeTextareaTextWithHiddenDice({
    createDiceResultPlaceholderRegex: (...a: any[]) => createDiceResultPlaceholderRegex(...a),
    extractMetaCheckResultBlocks: (...a: any[]) => extractMetaCheckResultBlocks(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });

  const resolveTextareaTextWithHiddenDice = createResolveTextareaTextWithHiddenDice({
    composeTextareaTextWithHiddenDice: (...a: any[]) => composeTextareaTextWithHiddenDice(...a),
    readStoredLatestDiceText: (...a: any[]) => readStoredLatestDiceText(...a),
    readStoredTextareaDiceText: (...a: any[]) => readStoredTextareaDiceText(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
  });
  const clearTextareaDiceCache = createClearTextareaDiceCache({
    getCore: (...a: any[]) => getCore(...a),
  });

  const storeTextareaDiceCache = createStoreTextareaDiceCache({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    extractMetaCheckResultBlocks: (...a: any[]) => extractMetaCheckResultBlocks(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  const syncTextareaDiceCacheFromVisibleText = createSyncTextareaDiceCacheFromVisibleText({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    extractMetaCheckResultBlocks: (...a: any[]) => extractMetaCheckResultBlocks(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    resolveTextareaTextWithHiddenDice: (...a: any[]) => resolveTextareaTextWithHiddenDice(...a),
    storeTextareaDiceCache: (...a: any[]) => storeTextareaDiceCache(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });

  const HUMAN_INPUT_TAG_BLOCK_PATTERNS = createHumanInputTagBlockPatterns({

  });
  const HUMAN_INPUT_ACTION_PATTERN = /<user>(?:(?!<user>).)*?[。！？]/g;
  const humanInputSendQueue: string[] = [];
  let lastHumanInputSnapshot = '';
  let lastHumanInputActivityAt = 0;
  let lastCapturedHumanInputSnapshot = '';
  let lastHumanInputCaptureAt = 0;
  let gachaHeartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let gachaShopUiRefreshTimer: ReturnType<typeof setInterval> | null = null;
  let gachaShopRootElement: HTMLElement | null = null;
  const GACHA_TEST_DEFAULT_FORTUNE = 0;
  const GACHA_SHARD_EXCHANGE_COST = 10;





  const GACHA_CATALOG_GLOBAL_SCOPE_KEY = 'global';
  const GACHA_SHOP_UI_REFRESH_MS = 250;
  const GACHA_CATALOG_RAW_ROW_INDEX_PROP = '__acuRawRowIndex';

  const normalizeTrackedText = createNormalizeTrackedText({

  });

  const stripKnownSystemActionText = createStripKnownSystemActionText({
    normalizeTrackedText: (...a: any[]) => normalizeTrackedText(...a),
  });

  const extractExplicitHumanInputText = createExtractExplicitHumanInputText({
    normalizeTrackedText: (...a: any[]) => normalizeTrackedText(...a),
  });

  const stripSystemInjectedContent = createStripSystemInjectedContent({
    extractExplicitHumanInputText: (...a: any[]) => extractExplicitHumanInputText(...a),
    normalizeTrackedText: (...a: any[]) => normalizeTrackedText(...a),
    stripKnownSystemActionText: (...a: any[]) => stripKnownSystemActionText(...a),
    getHUMAN_INPUT_ACTION_PATTERN: () => HUMAN_INPUT_ACTION_PATTERN,
    getHUMAN_INPUT_TAG_BLOCK_PATTERNS: () => HUMAN_INPUT_TAG_BLOCK_PATTERNS,
  });

  const countUnicodeCharacters = createCountUnicodeCharacters({

  });

  const markHumanInputActivity = createMarkHumanInputActivity({
    getLastHumanInputActivityAt: () => lastHumanInputActivityAt,
    setLastHumanInputActivityAt: (v: any) => { lastHumanInputActivityAt = v; },
  });

  const capturePendingHumanInputSnapshot = createCapturePendingHumanInputSnapshot({
    markHumanInputActivity: (...a: any[]) => markHumanInputActivity(...a),
    stripSystemInjectedContent: (...a: any[]) => stripSystemInjectedContent(...a),
    getHumanInputSendQueue: () => humanInputSendQueue,
    getLastHumanInputSnapshot: () => lastHumanInputSnapshot,
    setLastHumanInputSnapshot: (v: any) => { lastHumanInputSnapshot = v; },
    getLastCapturedHumanInputSnapshot: () => lastCapturedHumanInputSnapshot,
    setLastCapturedHumanInputSnapshot: (v: any) => { lastCapturedHumanInputSnapshot = v; },
    getLastHumanInputCaptureAt: () => lastHumanInputCaptureAt,
    setLastHumanInputCaptureAt: (v: any) => { lastHumanInputCaptureAt = v; },
  });

  const consumePendingHumanInputSnapshot = createConsumePendingHumanInputSnapshot({
    getHumanInputSendQueue: () => humanInputSendQueue,
    getLastHumanInputSnapshot: () => lastHumanInputSnapshot,
  });

  const bindHumanInputTracking = createBindHumanInputTracking({
    getCore: (...a: any[]) => getCore(...a),
    markHumanInputActivity: (...a: any[]) => markHumanInputActivity(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    stripSystemInjectedContent: (...a: any[]) => stripSystemInjectedContent(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
    getLastHumanInputSnapshot: () => lastHumanInputSnapshot,
    setLastHumanInputSnapshot: (v: any) => { lastHumanInputSnapshot = v; },
  });

  // [新增] 智能填充输入栏函数
  const smartInsertToTextarea = createSmartInsertToTextarea({
    createDiceResultPlaceholderRegex: (...a: any[]) => createDiceResultPlaceholderRegex(...a),
    createMetaCheckResultRegex: (...a: any[]) => createMetaCheckResultRegex(...a),
    escapeRegExpLiteral: (...a: any[]) => escapeRegExpLiteral(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    readStoredLatestDiceText: (...a: any[]) => readStoredLatestDiceText(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    storeTextareaDiceCache: (...a: any[]) => storeTextareaDiceCache(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
  });

  const getRuntimeWindowCandidates = createGetRuntimeWindowCandidates({
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
  });

  const findRuntimeFunction = createFindRuntimeFunction({
    getRuntimeWindowCandidates: (...a: any[]) => getRuntimeWindowCandidates(...a),
  });

  const findSillyTavernSlashRunner = createFindSillyTavernSlashRunner({
    getRuntimeWindowCandidates: (...a: any[]) => getRuntimeWindowCandidates(...a),
  });

  const quoteSlashArgument = createQuoteSlashArgument({

  });

  const getComposerTextarea = createGetComposerTextarea({
    getCore: (...a: any[]) => getCore(...a),
  });

  const getResolvedComposerText = createGetResolvedComposerText({
    getComposerTextarea: (...a: any[]) => getComposerTextarea(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
  });

  const clearComposerIfCurrentText = createClearComposerIfCurrentText({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    getComposerTextarea: (...a: any[]) => getComposerTextarea(...a),
    getCore: (...a: any[]) => getCore(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
  });

  const findComposerSendButton = createFindComposerSendButton({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });

  const sendTextViaComposer = createSendTextViaComposer({
    findComposerSendButton: (...a: any[]) => findComposerSendButton(...a),
    getComposerTextarea: (...a: any[]) => getComposerTextarea(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
  });

  const sendChatTextAndTrigger = createSendChatTextAndTrigger({
    findRuntimeFunction: (...a: any[]) => findRuntimeFunction(...a),
    findSillyTavernSlashRunner: (...a: any[]) => findSillyTavernSlashRunner(...a),
    quoteSlashArgument: (...a: any[]) => quoteSlashArgument(...a),
    sendTextViaComposer: (...a: any[]) => sendTextViaComposer(...a),
    triggerGenerationAfterDirectSend: (...a: any[]) => triggerGenerationAfterDirectSend(...a),
  });
  const triggerGenerationAfterDirectSend = createTriggerGenerationAfterDirectSend({
    findRuntimeFunction: (...a: any[]) => findRuntimeFunction(...a),
    findSillyTavernSlashRunner: (...a: any[]) => findSillyTavernSlashRunner(...a),
  });

  // [新增] 在发送消息前恢复真实结果
  const restoreDiceResultBeforeSend = createRestoreDiceResultBeforeSend({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    resolveTextareaTextWithHiddenDice: (...a: any[]) => resolveTextareaTextWithHiddenDice(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });

  // [新增] 拦截输入框的 value 属性，确保读取时自动替换占位符
  const interceptTextareaValue = createInterceptTextareaValue({
    getCore: (...a: any[]) => getCore(...a),
    resolveTextareaTextWithHiddenDice: (...a: any[]) => resolveTextareaTextWithHiddenDice(...a),
    scheduleViewportBoundsRefresh: (...a: any[]) => scheduleViewportBoundsRefresh(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });






 // [新增] 选项面板独立折叠状态







  // [新增] 移植功能所需的存储键





  const MAX_ACTION_BUTTONS = 6; // 活动栏最大按钮数
  const MIN_PANEL_HEIGHT = 200; // 面板最小高度
  const MAX_PANEL_HEIGHT = 1200; // 面板最大高度
  const PANEL_VIEWPORT_TOP_GUTTER = 32; // 手动拉高面板时保留顶部工具栏安全距

















  // 自定义掷骰模式常量
  const CUSTOM_ROLL_MODE = createCustomRollMode({

  });
  // 比较版本号（简单比较，假设版本号格式为 "x.y.z"）
  const compareVersion = createCompareVersion({

  });




  // ========================================
  // ConsoleCaptureManager - Console日志抓取管理器
  // ========================================

  // 不自动初始化拦截，需要手动开启或错误时自动开启
  // ConsoleCaptureManager.intercept();

  // ========================================
  // 全局错误处理机制（高阈值，仅致命错误）
  // ========================================
  const ErrorHandler = createErrorHandler({
    getConsoleCaptureManager: () => ConsoleCaptureManager,
  });
  // 注册全局错误处理器
  window.onerror = function (message, source, lineno, colno, error) {
    ErrorHandler.handleError(error || message, source, lineno, colno, error?.stack);
    return false; // 不阻止默认错误处理
  };

  // 注册 Promise 拒绝处理器
  window.addEventListener('unhandledrejection', function (event) {
    ErrorHandler.handleError(event.reason, null, null, null, event.reason?.stack);
  });

  // 在脚本初始化时检查错误状态
  // 这个会在 init 函数中调用

  // ========================================
  // 正则转换系统 - 类型定义 (Phase 1.1)
  // ========================================

  /**
   * 正则转换操作类型
   * - replace: 替换匹配的内容
   * - extract: 提取匹配的内容(暂未实现)
   * - delete: 删除匹配的内容
   * - validate: 验证格式(与ValidationEngine不同,这是转换验证)
   */
  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  /**
   * 解析酒馆正则的 findRegex 字段
   * 格式: /pattern/flags
   */

  /**
   * 将酒馆正则格式转换为本系统的 RegexTransformationRule
   */
  const gachaHeartbeatTimer_ACC = { get v(){ return gachaHeartbeatTimer; }, set v(x){ gachaHeartbeatTimer = x; } };
  const gachaShopRootElement_ACC = { get v(){ return gachaShopRootElement; }, set v(x){ gachaShopRootElement = x; } };
  const gachaShopUiRefreshTimer_ACC = { get v(){ return gachaShopUiRefreshTimer; }, set v(x){ gachaShopUiRefreshTimer = x; } };
  const lastHumanInputActivityAt_ACC = { get v(){ return lastHumanInputActivityAt; }, set v(x){ lastHumanInputActivityAt = x; } };
  return { BookmarkManager, CUSTOM_ROLL_MODE, DICE_RESULT_PLACEHOLDER, ErrorHandler, GACHA_CATALOG_GLOBAL_SCOPE_KEY, GACHA_CATALOG_RAW_ROW_INDEX_PROP, GACHA_SHARD_EXCHANGE_COST, GACHA_SHOP_UI_REFRESH_MS, GACHA_TEST_DEFAULT_FORTUNE, MAX_ACTION_BUTTONS, MAX_PANEL_HEIGHT, MIN_PANEL_HEIGHT, PANEL_VIEWPORT_TOP_GUTTER, bindHumanInputTracking, buildAvatarBackgroundStyle, capturePendingHumanInputSnapshot, clearComposerIfCurrentText, clearTextareaDiceCache, compareVersion, consumePendingHumanInputSnapshot, countUnicodeCharacters, createMetaCheckResultRegex, errorTableTemplateIssue, escapeHtml, executeEffects, executeSecondaryEffectsChain, findRowIndexByPrimaryKey, formatCssImageUrl, getImageUrlValidationMessage, getRemoteImageUrlValidationError, getResolvedComposerText, getSheetKeyByTableName, interceptTextareaValue, isRenderableImageUrlValid, normalizeStorableImageUrl, readTextareaVisibleValue, renderDeprecatedBadge, restoreDiceResultBeforeSend, safeDecodeURIComponent, safeEncodeURIComponent, sendChatTextAndTrigger, setTextareaValueAndNotify, setupOverlayClose, showPresetConflictDialog, smartInsertToTextarea, storeTextareaDiceCache, stripSystemInjectedContent, syncTextareaDiceCacheFromVisibleText, warnTableTemplateIssue, withTableTemplateCheckHint, gachaHeartbeatTimer_ACC, gachaShopRootElement_ACC, gachaShopUiRefreshTimer_ACC, lastHumanInputActivityAt_ACC };
}
