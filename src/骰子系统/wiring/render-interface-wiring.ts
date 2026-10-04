/**
 * wiring / render-interface-wiring.ts — 渲染防抖/视口监听/浮动折叠装配簇（从 index.ts 迁出，x4-p）。
 */
import { createUpdateFixedWrapperBounds } from '../features/layout/fixed-wrapper-bounds';
import { createUpdateFloatingCollapseBounds } from '../features/layout/update-floating-collapse-bounds';
import { createUpdateViewportWrapperBounds } from '../features/layout/viewport-wrapper-bounds';
import { createRenderInterfaceImpl } from '../features/render/render-interface-impl';
import { createClampFloatingCollapsePosition } from '../features/ui/clamp-floating-collapse-position';
import { createClearFixedAnchorMutationObserver } from '../features/ui/clear-fixed-anchor-mutation-observer';
import { createClearFixedAnchorResizeObserver } from '../features/ui/clear-fixed-anchor-resize-observer';
import { createClearFixedWrapperBoundsListeners } from '../features/ui/clear-fixed-wrapper-bounds-listeners';
import { createClearFloatingCollapseBoundsListeners } from '../features/ui/clear-floating-collapse-bounds-listeners';
import { createClearViewportBoundsListeners } from '../features/ui/clear-viewport-bounds-listeners';
import { createClearViewportInputMutationObserver } from '../features/ui/clear-viewport-input-mutation-observer';
import { createClearViewportInputTargetListeners } from '../features/ui/clear-viewport-input-target-listeners';
import { createFixedModeAnchorPriority } from '../features/ui/fixed-mode-anchor-priority';
import { createGetFixedModeAnchorRect } from '../features/ui/get-fixed-mode-anchor-rect';
import { createGetFixedWrapperParentMetrics } from '../features/ui/get-fixed-wrapper-parent-metrics';
import { createGetFloatingCollapsePosition } from '../features/ui/get-floating-collapse-position';
import { createGetFloatingViewportBounds } from '../features/ui/get-floating-viewport-bounds';
import { createGetViewportAnchorRect } from '../features/ui/get-viewport-anchor-rect';
import { createGetViewportBottomAnchorElements } from '../features/ui/get-viewport-bottom-anchor-elements';
import { createGetViewportBottomOffset } from '../features/ui/get-viewport-bottom-offset';
import { createIsFloatingCollapseActive } from '../features/ui/is-floating-collapse-active';
import { createNormalizeFloatingCollapsePosition } from '../features/ui/normalize-floating-collapse-position';
import { createRefreshFixedAnchorResizeObserver } from '../features/ui/refresh-fixed-anchor-resize-observer';
import { createRefreshViewportInputTargetListeners } from '../features/ui/refresh-viewport-input-target-listeners';
import { createRenderInterface } from '../features/ui/render-interface';
import { createScheduleFixedAnchorTargetRefresh } from '../features/ui/schedule-fixed-anchor-target-refresh';
import { createScheduleFixedWrapperBoundsRefresh } from '../features/ui/schedule-fixed-wrapper-bounds-refresh';
import { createScheduleFloatingCollapseBoundsRefresh } from '../features/ui/schedule-floating-collapse-bounds-refresh';
import { createScheduleViewportBoundsRefresh } from '../features/ui/schedule-viewport-bounds-refresh';
import { createScheduleViewportInputTargetRefresh } from '../features/ui/schedule-viewport-input-target-refresh';
import { createSetupFixedAnchorMutationObserver } from '../features/ui/setup-fixed-anchor-mutation-observer';
import { createSetupFixedWrapperBoundsListeners } from '../features/ui/setup-fixed-wrapper-bounds-listeners';
import { createSetupFloatingCollapseBoundsListeners } from '../features/ui/setup-floating-collapse-bounds-listeners';
import { createSetupViewportBoundsListeners } from '../features/ui/setup-viewport-bounds-listeners';
import { createSetupViewportInputMutationObserver } from '../features/ui/setup-viewport-input-mutation-observer';
import { createViewportBottomAnchorSelectors } from '../features/ui/viewport-bottom-anchor-selectors';
import { createViewportBottomRefreshEvents } from '../features/ui/viewport-bottom-refresh-events';
import { STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, STORAGE_KEY_VALIDATION_MODE } from '../shared/storage-keys';


export function createRenderInterfaceWiring(deps: any) {
  const { ACTION_BUTTONS, MvuModule, RegexTransformationEngine, RegexTransformationManager, ValidationEngine, applyStoredPanelHeight, bindChangesEvents, bindEvents, bindGlobalInteractionEvents, bindOptionEvents, cachedRawData_ACC, canWriteMvuPanel, collectHostAndLocalNodes, countRuntimeDataChanges, createAutoRegexTransformKey, createElementFromHtml, currentDiffMap_ACC, ensureCanonicalTableOrder, ensurePanelNavigationVisible, escapeHtml, generateDiffMap, getActivePanelHeightKey, getActiveTabState, getCheckSuggestionItemsFromTable, getCollapsedState, getConfig, getCore, getCurrentContextFingerprint, getDataAreaForRoot, getDiceConfig, getHiddenTables, getIconForTableName, getNavigationFontMetrics, getOptionItemsFromTable, getOptionsCollapsedState, getSavedTableOrder, getStableTableSort, getStoredPanelHeight, getTableData, getTavernHostDocument, getTavernHostWindow, hasUnsavedChanges_ACC, hideDiceResultsInUserMessages, hydrateCustomTableNameIconsIn, injectIndependentOptions, insertHtmlToPage, isAutoTransforming_ACC, isCheckSuggestionTableName, isOptionTableName, isSaving_ACC, isSettingsOpen_ACC, lastOptionHash_ACC, loadDashboardNpcAvatars, loadSnapshot, normalizeCollapseStyle, observer_ACC, optionPanelVisible_ACC, processJsonData, rememberAutoRegexTransform, renderChangesPanel, renderCheckSuggestionOptionButtonHtml, renderDashboard, renderGlobalInteractionsPanel, renderOptionButtonHtml, renderTableContent, saveConfig, saveCurrentTabState, saveSheetsViaJsonFloorWithoutTracking, saveSnapshot, shouldSkipAutoRegexTransform, syncHostRegenerateButtonVisibility, tableScrollStates_ACC, updateSaveButtonState } = deps;
  let renderInterfaceTimer = null;
  let renderInterfacePending = false;
  let viewportBoundsListenerAttached = false;
  let viewportBoundsListenerWindow: Window | null = null;
  let viewportBoundsRefreshHandler: (() => void) | null = null;
  let viewportBoundsRaf: number | null = null;
  let viewportInputResizeObserver: ResizeObserver | null = null;
  let viewportInputMutationObserver: MutationObserver | null = null;
  let viewportInputObservedElements: HTMLElement[] = [];
  let viewportInputMutationWindow: Window | null = null;
  let viewportInputMutationDocument: Document | null = null;
  let viewportInputTargetsRaf: number | null = null;
  let fixedWrapperBoundsListenerWindow: Window | null = null;
  let fixedWrapperBoundsRefreshHandler: (() => void) | null = null;
  let fixedWrapperBoundsRaf: number | null = null;
  let fixedAnchorResizeObserver: ResizeObserver | null = null;
  let fixedAnchorMutationObserver: MutationObserver | null = null;
  let fixedAnchorMutationWindow: Window | null = null;
  let fixedAnchorMutationDocument: Document | null = null;
  let fixedAnchorTargetsRaf: number | null = null;
  let floatingCollapseBoundsListenerWindow: Window | null = null;
  let floatingCollapseBoundsRefreshHandler: (() => void) | null = null;
  let floatingCollapseBoundsRaf: number | null = null;
  let suppressNextFloatingCollapseClick = false;

  const VIEWPORT_BOTTOM_ANCHOR_SELECTORS = createViewportBottomAnchorSelectors({

  });
  const VIEWPORT_BOTTOM_REFRESH_EVENTS = createViewportBottomRefreshEvents({

  });
  const VIEWPORT_COMPOSER_ELEMENT_IDS = new Set(['send_form', 'form_sheld', 'send_textarea', 'chat_input']);
  // iPad 横屏可到 1366px；固定底部导航在这类视口下应跟随聊天容器，而不是输入框内部宽度。
  const TABLET_FIXED_NAV_FULL_WIDTH_MAX = 1366;
  const FIXED_MODE_ANCHOR_PRIORITY = createFixedModeAnchorPriority({

  });
  interface FloatingCollapsePosition {
    left: number;
    top: number;
  }

  const FLOATING_COLLAPSE_SIZE = 48;
  const FLOATING_COLLAPSE_MARGIN = 12;
  const FLOATING_COLLAPSE_DRAG_THRESHOLD = 5;

  const isFloatingCollapseActive = createIsFloatingCollapseActive({
    getCollapsedState: (...a: any[]) => getCollapsedState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
  });

  const normalizeFloatingCollapsePosition = createNormalizeFloatingCollapsePosition({

  });

  const getFloatingViewportBounds = createGetFloatingViewportBounds({
    FLOATING_COLLAPSE_SIZE: FLOATING_COLLAPSE_SIZE,
  });

  const clampFloatingCollapsePosition = createClampFloatingCollapsePosition({
    getFloatingViewportBounds: (...a: any[]) => getFloatingViewportBounds(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getViewportBottomOffset: (...a: any[]) => getViewportBottomOffset(...a),
    FLOATING_COLLAPSE_MARGIN: FLOATING_COLLAPSE_MARGIN,
    FLOATING_COLLAPSE_SIZE: FLOATING_COLLAPSE_SIZE,
  });

  const getFloatingCollapsePosition = createGetFloatingCollapsePosition({
    getConfig: (...a: any[]) => getConfig(...a),
    normalizeFloatingCollapsePosition: (...a: any[]) => normalizeFloatingCollapsePosition(...a),
  });

  const updateFloatingCollapseBounds = createUpdateFloatingCollapseBounds({
    clampFloatingCollapsePosition: (...a: any[]) => clampFloatingCollapsePosition(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getFloatingCollapsePosition: (...a: any[]) => getFloatingCollapsePosition(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    saveConfig: (...a: any[]) => saveConfig(...a),
    FLOATING_COLLAPSE_SIZE: FLOATING_COLLAPSE_SIZE,
  });

  const getViewportBottomAnchorElements = createGetViewportBottomAnchorElements({
    getVIEWPORT_BOTTOM_ANCHOR_SELECTORS: () => VIEWPORT_BOTTOM_ANCHOR_SELECTORS,
  });

  const getViewportAnchorRect = createGetViewportAnchorRect({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });

  const getFixedWrapperParentMetrics = createGetFixedWrapperParentMetrics({

  });

  const getFixedModeAnchorRect = createGetFixedModeAnchorRect({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getViewportAnchorRect: (...a: any[]) => getViewportAnchorRect(...a),
    getViewportBottomAnchorElements: (...a: any[]) => getViewportBottomAnchorElements(...a),
    FIXED_MODE_ANCHOR_PRIORITY: FIXED_MODE_ANCHOR_PRIORITY,
  });

  const getViewportBottomOffset = createGetViewportBottomOffset({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getViewportBottomAnchorElements: (...a: any[]) => getViewportBottomAnchorElements(...a),
    VIEWPORT_COMPOSER_ELEMENT_IDS: VIEWPORT_COMPOSER_ELEMENT_IDS,
  });

  const updateViewportWrapperBounds = createUpdateViewportWrapperBounds({
    getCollapsedState: (...a: any[]) => getCollapsedState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getViewportAnchorRect: (...a: any[]) => getViewportAnchorRect(...a),
    getViewportBottomOffset: (...a: any[]) => getViewportBottomOffset(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
    updateFloatingCollapseBounds: (...a: any[]) => updateFloatingCollapseBounds(...a),
  });

  const updateFixedWrapperBounds = createUpdateFixedWrapperBounds({
    getConfig: (...a: any[]) => getConfig(...a),
    getFixedModeAnchorRect: (...a: any[]) => getFixedModeAnchorRect(...a),
    getFixedWrapperParentMetrics: (...a: any[]) => getFixedWrapperParentMetrics(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    updateFloatingCollapseBounds: (...a: any[]) => updateFloatingCollapseBounds(...a),
    TABLET_FIXED_NAV_FULL_WIDTH_MAX: TABLET_FIXED_NAV_FULL_WIDTH_MAX,
  });

  const scheduleFixedWrapperBoundsRefresh = createScheduleFixedWrapperBoundsRefresh({
    getConfig: (...a: any[]) => getConfig(...a),
    updateFixedWrapperBounds: (...a: any[]) => updateFixedWrapperBounds(...a),
    getFixedWrapperBoundsRaf: () => fixedWrapperBoundsRaf,
    setFixedWrapperBoundsRaf: (v: any) => { fixedWrapperBoundsRaf = v; },
  });

  const clearFixedAnchorResizeObserver = createClearFixedAnchorResizeObserver({
    getFixedAnchorResizeObserver: () => fixedAnchorResizeObserver,
    setFixedAnchorResizeObserver: (v: any) => { fixedAnchorResizeObserver = v; },
  });

  const refreshFixedAnchorResizeObserver = createRefreshFixedAnchorResizeObserver({
    clearFixedAnchorResizeObserver: (...a: any[]) => clearFixedAnchorResizeObserver(...a),
    getViewportBottomAnchorElements: (...a: any[]) => getViewportBottomAnchorElements(...a),
    getFixedWrapperBoundsRefreshHandler: () => fixedWrapperBoundsRefreshHandler,
    getFixedAnchorResizeObserver: () => fixedAnchorResizeObserver,
    setFixedAnchorResizeObserver: (v: any) => { fixedAnchorResizeObserver = v; },
  });

  const scheduleFixedAnchorTargetRefresh = createScheduleFixedAnchorTargetRefresh({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    refreshFixedAnchorResizeObserver: (...a: any[]) => refreshFixedAnchorResizeObserver(...a),
    scheduleFixedWrapperBoundsRefresh: (...a: any[]) => scheduleFixedWrapperBoundsRefresh(...a),
    getFixedAnchorTargetsRaf: () => fixedAnchorTargetsRaf,
    setFixedAnchorTargetsRaf: (v: any) => { fixedAnchorTargetsRaf = v; },
  });

  const clearFixedAnchorMutationObserver = createClearFixedAnchorMutationObserver({
    getFixedAnchorMutationDocument: () => fixedAnchorMutationDocument,
    setFixedAnchorMutationDocument: (v: any) => { fixedAnchorMutationDocument = v; },
    getFixedAnchorMutationObserver: () => fixedAnchorMutationObserver,
    setFixedAnchorMutationObserver: (v: any) => { fixedAnchorMutationObserver = v; },
    getFixedAnchorMutationWindow: () => fixedAnchorMutationWindow,
    setFixedAnchorMutationWindow: (v: any) => { fixedAnchorMutationWindow = v; },
    getFixedAnchorTargetsRaf: () => fixedAnchorTargetsRaf,
    setFixedAnchorTargetsRaf: (v: any) => { fixedAnchorTargetsRaf = v; },
  });

  const setupFixedAnchorMutationObserver = createSetupFixedAnchorMutationObserver({
    clearFixedAnchorMutationObserver: (...a: any[]) => clearFixedAnchorMutationObserver(...a),
    scheduleFixedAnchorTargetRefresh: (...a: any[]) => scheduleFixedAnchorTargetRefresh(...a),
    getFixedAnchorMutationDocument: () => fixedAnchorMutationDocument,
    setFixedAnchorMutationDocument: (v: any) => { fixedAnchorMutationDocument = v; },
    getFixedAnchorMutationObserver: () => fixedAnchorMutationObserver,
    setFixedAnchorMutationObserver: (v: any) => { fixedAnchorMutationObserver = v; },
    getFixedAnchorMutationWindow: () => fixedAnchorMutationWindow,
    setFixedAnchorMutationWindow: (v: any) => { fixedAnchorMutationWindow = v; },
  });

  const clearFixedWrapperBoundsListeners = createClearFixedWrapperBoundsListeners({
    clearFixedAnchorMutationObserver: (...a: any[]) => clearFixedAnchorMutationObserver(...a),
    clearFixedAnchorResizeObserver: (...a: any[]) => clearFixedAnchorResizeObserver(...a),
    getFixedWrapperBoundsListenerWindow: () => fixedWrapperBoundsListenerWindow,
    setFixedWrapperBoundsListenerWindow: (v: any) => { fixedWrapperBoundsListenerWindow = v; },
    getFixedWrapperBoundsRaf: () => fixedWrapperBoundsRaf,
    setFixedWrapperBoundsRaf: (v: any) => { fixedWrapperBoundsRaf = v; },
    getFixedWrapperBoundsRefreshHandler: () => fixedWrapperBoundsRefreshHandler,
    setFixedWrapperBoundsRefreshHandler: (v: any) => { fixedWrapperBoundsRefreshHandler = v; },
  });

  const setupFixedWrapperBoundsListeners = createSetupFixedWrapperBoundsListeners({
    clearFixedWrapperBoundsListeners: (...a: any[]) => clearFixedWrapperBoundsListeners(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    refreshFixedAnchorResizeObserver: (...a: any[]) => refreshFixedAnchorResizeObserver(...a),
    scheduleFixedWrapperBoundsRefresh: (...a: any[]) => scheduleFixedWrapperBoundsRefresh(...a),
    setupFixedAnchorMutationObserver: (...a: any[]) => setupFixedAnchorMutationObserver(...a),
    getFixedWrapperBoundsListenerWindow: () => fixedWrapperBoundsListenerWindow,
    setFixedWrapperBoundsListenerWindow: (v: any) => { fixedWrapperBoundsListenerWindow = v; },
    getFixedWrapperBoundsRefreshHandler: () => fixedWrapperBoundsRefreshHandler,
    setFixedWrapperBoundsRefreshHandler: (v: any) => { fixedWrapperBoundsRefreshHandler = v; },
  });

  const scheduleFloatingCollapseBoundsRefresh = createScheduleFloatingCollapseBoundsRefresh({
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    updateFloatingCollapseBounds: (...a: any[]) => updateFloatingCollapseBounds(...a),
    getFloatingCollapseBoundsRaf: () => floatingCollapseBoundsRaf,
    setFloatingCollapseBoundsRaf: (v: any) => { floatingCollapseBoundsRaf = v; },
  });

  const clearFloatingCollapseBoundsListeners = createClearFloatingCollapseBoundsListeners({
    getFloatingCollapseBoundsListenerWindow: () => floatingCollapseBoundsListenerWindow,
    setFloatingCollapseBoundsListenerWindow: (v: any) => { floatingCollapseBoundsListenerWindow = v; },
    getFloatingCollapseBoundsRefreshHandler: () => floatingCollapseBoundsRefreshHandler,
    setFloatingCollapseBoundsRefreshHandler: (v: any) => { floatingCollapseBoundsRefreshHandler = v; },
    getFloatingCollapseBoundsRaf: () => floatingCollapseBoundsRaf,
    setFloatingCollapseBoundsRaf: (v: any) => { floatingCollapseBoundsRaf = v; },
  });

  const setupFloatingCollapseBoundsListeners = createSetupFloatingCollapseBoundsListeners({
    clearFloatingCollapseBoundsListeners: (...a: any[]) => clearFloatingCollapseBoundsListeners(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    scheduleFloatingCollapseBoundsRefresh: (...a: any[]) => scheduleFloatingCollapseBoundsRefresh(...a),
    getFloatingCollapseBoundsListenerWindow: () => floatingCollapseBoundsListenerWindow,
    setFloatingCollapseBoundsListenerWindow: (v: any) => { floatingCollapseBoundsListenerWindow = v; },
    getFloatingCollapseBoundsRefreshHandler: () => floatingCollapseBoundsRefreshHandler,
    setFloatingCollapseBoundsRefreshHandler: (v: any) => { floatingCollapseBoundsRefreshHandler = v; },
  });

  const scheduleViewportBoundsRefresh = createScheduleViewportBoundsRefresh({
    getConfig: (...a: any[]) => getConfig(...a),
    updateViewportWrapperBounds: (...a: any[]) => updateViewportWrapperBounds(...a),
    getViewportBoundsRaf: () => viewportBoundsRaf,
    setViewportBoundsRaf: (v: any) => { viewportBoundsRaf = v; },
  });

  const clearViewportInputTargetListeners = createClearViewportInputTargetListeners({
    VIEWPORT_BOTTOM_REFRESH_EVENTS: VIEWPORT_BOTTOM_REFRESH_EVENTS,
    getViewportBoundsRefreshHandler: () => viewportBoundsRefreshHandler,
    getViewportInputObservedElements: () => viewportInputObservedElements,
    setViewportInputObservedElements: (v: any) => { viewportInputObservedElements = v; },
    getViewportInputResizeObserver: () => viewportInputResizeObserver,
    setViewportInputResizeObserver: (v: any) => { viewportInputResizeObserver = v; },
  });

  const refreshViewportInputTargetListeners = createRefreshViewportInputTargetListeners({
    clearViewportInputTargetListeners: (...a: any[]) => clearViewportInputTargetListeners(...a),
    getViewportBottomAnchorElements: (...a: any[]) => getViewportBottomAnchorElements(...a),
    VIEWPORT_BOTTOM_REFRESH_EVENTS: VIEWPORT_BOTTOM_REFRESH_EVENTS,
    getViewportBoundsRefreshHandler: () => viewportBoundsRefreshHandler,
    getViewportInputObservedElements: () => viewportInputObservedElements,
    setViewportInputObservedElements: (v: any) => { viewportInputObservedElements = v; },
    getViewportInputResizeObserver: () => viewportInputResizeObserver,
    setViewportInputResizeObserver: (v: any) => { viewportInputResizeObserver = v; },
  });

  const scheduleViewportInputTargetRefresh = createScheduleViewportInputTargetRefresh({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    refreshViewportInputTargetListeners: (...a: any[]) => refreshViewportInputTargetListeners(...a),
    scheduleViewportBoundsRefresh: (...a: any[]) => scheduleViewportBoundsRefresh(...a),
    getViewportInputTargetsRaf: () => viewportInputTargetsRaf,
    setViewportInputTargetsRaf: (v: any) => { viewportInputTargetsRaf = v; },
  });

  const clearViewportInputMutationObserver = createClearViewportInputMutationObserver({
    getViewportInputMutationDocument: () => viewportInputMutationDocument,
    setViewportInputMutationDocument: (v: any) => { viewportInputMutationDocument = v; },
    getViewportInputMutationObserver: () => viewportInputMutationObserver,
    setViewportInputMutationObserver: (v: any) => { viewportInputMutationObserver = v; },
    getViewportInputMutationWindow: () => viewportInputMutationWindow,
    setViewportInputMutationWindow: (v: any) => { viewportInputMutationWindow = v; },
    getViewportInputTargetsRaf: () => viewportInputTargetsRaf,
    setViewportInputTargetsRaf: (v: any) => { viewportInputTargetsRaf = v; },
  });

  const setupViewportInputMutationObserver = createSetupViewportInputMutationObserver({
    clearViewportInputMutationObserver: (...a: any[]) => clearViewportInputMutationObserver(...a),
    scheduleViewportInputTargetRefresh: (...a: any[]) => scheduleViewportInputTargetRefresh(...a),
    getViewportInputMutationDocument: () => viewportInputMutationDocument,
    setViewportInputMutationDocument: (v: any) => { viewportInputMutationDocument = v; },
    getViewportInputMutationObserver: () => viewportInputMutationObserver,
    setViewportInputMutationObserver: (v: any) => { viewportInputMutationObserver = v; },
    getViewportInputMutationWindow: () => viewportInputMutationWindow,
    setViewportInputMutationWindow: (v: any) => { viewportInputMutationWindow = v; },
  });

  const clearViewportBoundsListeners = createClearViewportBoundsListeners({
    clearViewportInputMutationObserver: (...a: any[]) => clearViewportInputMutationObserver(...a),
    clearViewportInputTargetListeners: (...a: any[]) => clearViewportInputTargetListeners(...a),
    getViewportBoundsListenerAttached: () => viewportBoundsListenerAttached,
    setViewportBoundsListenerAttached: (v: any) => { viewportBoundsListenerAttached = v; },
    getViewportBoundsListenerWindow: () => viewportBoundsListenerWindow,
    setViewportBoundsListenerWindow: (v: any) => { viewportBoundsListenerWindow = v; },
    getViewportBoundsRaf: () => viewportBoundsRaf,
    setViewportBoundsRaf: (v: any) => { viewportBoundsRaf = v; },
    getViewportBoundsRefreshHandler: () => viewportBoundsRefreshHandler,
    setViewportBoundsRefreshHandler: (v: any) => { viewportBoundsRefreshHandler = v; },
  });

  const setupViewportBoundsListeners = createSetupViewportBoundsListeners({
    clearViewportBoundsListeners: (...a: any[]) => clearViewportBoundsListeners(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    refreshViewportInputTargetListeners: (...a: any[]) => refreshViewportInputTargetListeners(...a),
    scheduleViewportBoundsRefresh: (...a: any[]) => scheduleViewportBoundsRefresh(...a),
    setupViewportInputMutationObserver: (...a: any[]) => setupViewportInputMutationObserver(...a),
    getViewportBoundsListenerWindow: () => viewportBoundsListenerWindow,
    setViewportBoundsListenerWindow: (v: any) => { viewportBoundsListenerWindow = v; },
    getViewportBoundsRefreshHandler: () => viewportBoundsRefreshHandler,
    setViewportBoundsRefreshHandler: (v: any) => { viewportBoundsRefreshHandler = v; },
    getViewportBoundsListenerAttached: () => viewportBoundsListenerAttached,
    setViewportBoundsListenerAttached: (v: any) => { viewportBoundsListenerAttached = v; },
  });

  const renderInterface = createRenderInterface({
    _renderInterfaceImpl: (...a: any[]) => _renderInterfaceImpl(...a),
    saveCurrentTabState: (...a: any[]) => saveCurrentTabState(...a),
    getIsSettingsOpen: () => isSettingsOpen_ACC.v,
    getRenderInterfacePending: () => renderInterfacePending,
    setRenderInterfacePending: (v: any) => { renderInterfacePending = v; },
    getRenderInterfaceTimer: () => renderInterfaceTimer,
    setRenderInterfaceTimer: (v: any) => { renderInterfaceTimer = v; },
  });

  // 实际的渲染实现函数
  const _renderInterfaceImpl = createRenderInterfaceImpl({
    applyStoredPanelHeight: (...a: any[]) => applyStoredPanelHeight(...a),
    bindChangesEvents: (...a: any[]) => bindChangesEvents(...a),
    bindEvents: (...a: any[]) => bindEvents(...a),
    bindGlobalInteractionEvents: (...a: any[]) => bindGlobalInteractionEvents(...a),
    bindOptionEvents: (...a: any[]) => bindOptionEvents(...a),
    canWriteMvuPanel: (...a: any[]) => canWriteMvuPanel(...a),
    clampFloatingCollapsePosition: (...a: any[]) => clampFloatingCollapsePosition(...a),
    collectHostAndLocalNodes: (...a: any[]) => collectHostAndLocalNodes(...a),
    countRuntimeDataChanges: (...a: any[]) => countRuntimeDataChanges(...a),
    createAutoRegexTransformKey: (...a: any[]) => createAutoRegexTransformKey(...a),
    createElementFromHtml: (...a: any[]) => createElementFromHtml(...a),
    ensurePanelNavigationVisible: (...a: any[]) => ensurePanelNavigationVisible(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getActivePanelHeightKey: (...a: any[]) => getActivePanelHeightKey(...a),
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getCheckSuggestionItemsFromTable: (...a: any[]) => getCheckSuggestionItemsFromTable(...a),
    getCollapsedState: (...a: any[]) => getCollapsedState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getFloatingCollapsePosition: (...a: any[]) => getFloatingCollapsePosition(...a),
    getHiddenTables: (...a: any[]) => getHiddenTables(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getNavigationFontMetrics: (...a: any[]) => getNavigationFontMetrics(...a),
    getOptionItemsFromTable: (...a: any[]) => getOptionItemsFromTable(...a),
    getOptionsCollapsedState: (...a: any[]) => getOptionsCollapsedState(...a),
    getSavedTableOrder: (...a: any[]) => getSavedTableOrder(...a),
    getStoredPanelHeight: (...a: any[]) => getStoredPanelHeight(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    hideDiceResultsInUserMessages: (...a: any[]) => hideDiceResultsInUserMessages(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    injectIndependentOptions: (...a: any[]) => injectIndependentOptions(...a),
    insertHtmlToPage: (...a: any[]) => insertHtmlToPage(...a),
    isCheckSuggestionTableName: (...a: any[]) => isCheckSuggestionTableName(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    isOptionTableName: (...a: any[]) => isOptionTableName(...a),
    loadDashboardNpcAvatars: (...a: any[]) => loadDashboardNpcAvatars(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    rememberAutoRegexTransform: (...a: any[]) => rememberAutoRegexTransform(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    renderCheckSuggestionOptionButtonHtml: (...a: any[]) => renderCheckSuggestionOptionButtonHtml(...a),
    renderDashboard: (...a: any[]) => renderDashboard(...a),
    renderGlobalInteractionsPanel: (...a: any[]) => renderGlobalInteractionsPanel(...a),
    renderOptionButtonHtml: (...a: any[]) => renderOptionButtonHtml(...a),
    renderTableContent: (...a: any[]) => renderTableContent(...a),
    saveSheetsViaJsonFloorWithoutTracking: (...a: any[]) => saveSheetsViaJsonFloorWithoutTracking(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setupFixedWrapperBoundsListeners: (...a: any[]) => setupFixedWrapperBoundsListeners(...a),
    setupFloatingCollapseBoundsListeners: (...a: any[]) => setupFloatingCollapseBoundsListeners(...a),
    setupViewportBoundsListeners: (...a: any[]) => setupViewportBoundsListeners(...a),
    shouldSkipAutoRegexTransform: (...a: any[]) => shouldSkipAutoRegexTransform(...a),
    syncHostRegenerateButtonVisibility: (...a: any[]) => syncHostRegenerateButtonVisibility(...a),
    updateFixedWrapperBounds: (...a: any[]) => updateFixedWrapperBounds(...a),
    updateFloatingCollapseBounds: (...a: any[]) => updateFloatingCollapseBounds(...a),
    updateSaveButtonState: (...a: any[]) => updateSaveButtonState(...a),
    updateViewportWrapperBounds: (...a: any[]) => updateViewportWrapperBounds(...a),
    ACTION_BUTTONS: ACTION_BUTTONS,
    FLOATING_COLLAPSE_SIZE: FLOATING_COLLAPSE_SIZE,
    MvuModule: MvuModule,
    RegexTransformationEngine: RegexTransformationEngine,
    RegexTransformationManager: RegexTransformationManager,
    ValidationEngine: ValidationEngine,
    STORAGE_KEY_DASHBOARD_ACTIVE: STORAGE_KEY_DASHBOARD_ACTIVE,
    STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE: STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
    STORAGE_KEY_VALIDATION_MODE: STORAGE_KEY_VALIDATION_MODE,
    getHasUnsavedChanges: () => hasUnsavedChanges_ACC.v,
    getIsSaving: () => isSaving_ACC.v,
    getTableScrollStates: () => tableScrollStates_ACC.v,
    getObserver: () => observer_ACC.v,
    setObserver: (v: any) => { observer_ACC.v = v; },
    getIsAutoTransforming: () => isAutoTransforming_ACC.v,
    setIsAutoTransforming: (v: any) => { isAutoTransforming_ACC.v = v; },
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
    getOptionPanelVisible: () => optionPanelVisible_ACC.v,
    setOptionPanelVisible: (v: any) => { optionPanelVisible_ACC.v = v; },
    getLastOptionHash: () => lastOptionHash_ACC.v,
    setLastOptionHash: (v: any) => { lastOptionHash_ACC.v = v; },
    getCachedRawData: () => cachedRawData_ACC.v,
    setCachedRawData: (v: any) => { cachedRawData_ACC.v = v; },
    getStableTableSort: (...a: any[]) => getStableTableSort(...a),
    ensureCanonicalTableOrder: (...a: any[]) => ensureCanonicalTableOrder(...a),
  });
  const suppressNextFloatingCollapseClick_ACC = { get v(){ return suppressNextFloatingCollapseClick; }, set v(x){ suppressNextFloatingCollapseClick = x; } };
  return { FLOATING_COLLAPSE_DRAG_THRESHOLD, clampFloatingCollapsePosition, isFloatingCollapseActive, renderInterface, scheduleFixedWrapperBoundsRefresh, scheduleViewportBoundsRefresh, suppressNextFloatingCollapseClick_ACC };
}
