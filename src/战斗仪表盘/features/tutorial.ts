/**
 * tutorial.ts — 主模块（types→types.ts，步骤数据→steps.ts）。
 */
export * from './tutorial/types';
import { STEPS } from './tutorial/steps';
import type { TutorialScope, TutorialPlacement, TutorialAction, TutorialStep, TutorialState, TutorialModule, TutorialModuleOptions, ActiveTutorial, StartOptions, TutorialViewport, TutorialRect } from './tutorial/types';

const STORAGE_KEY = 'acu_tutorial_state_v1';
const STYLE_ID = 'acu-tutorial-style';
const OVERLAY_CLASS = 'acu-tutorial-overlay';
const TUTORIAL_OVERLAY_Z_INDEX = 2147483646; // [b13.6.6] 提升至 Mini HUD 之上（原 31600）
const AUTO_START_MAX_ATTEMPTS = 30;
const AUTO_START_INTERVAL_MS = 160;
const BLOCKING_LAYER_MIN_VIEWPORT_AREA_RATIO = 0.2;
const DEFAULT_STATE: TutorialState = {
  version: 1,
  revision: 8,
  disabled: false,
  completedScopes: [],
};
const STATE_REVISION = DEFAULT_STATE.revision;

export const TUTORIAL_SCOPE_LIST = Object.keys(STEPS) as TutorialScope[];

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const normalizeState = (rawState: unknown): TutorialState => {
  if (!rawState || typeof rawState !== 'object') return { ...DEFAULT_STATE };
  const data = rawState as Partial<TutorialState>;
  const completedScopes = Array.isArray(data.completedScopes)
    ? data.completedScopes.filter((scope): scope is TutorialScope => TUTORIAL_SCOPE_LIST.includes(String(scope) as TutorialScope))
    : [];
  return {
    version: 1,
    revision: typeof data.revision === 'number' && data.revision >= STATE_REVISION ? data.revision : STATE_REVISION,
    disabled: data.disabled === true,
    completedScopes: typeof data.revision === 'number' && data.revision >= STATE_REVISION ? completedScopes : [],
  };
};

const hasCompleted = (state: TutorialState, scope: TutorialScope): boolean => state.completedScopes.includes(scope);

const markCompleted = (state: TutorialState, scope: TutorialScope): TutorialState => {
  if (hasCompleted(state, scope)) return state;
  return { ...state, completedScopes: [...state.completedScopes, scope] };
};

const isTutorialAction = (action: string | undefined): action is TutorialAction =>
  action === 'prev' || action === 'next' || action === 'close';

const getSelectors = (step: TutorialStep): readonly string[] => {
  if (!step.selector) return [];
  return Array.isArray(step.selector) ? step.selector : [step.selector];
};

export const createTutorialModule = (options: TutorialModuleOptions): TutorialModule => {
  let activeTutorial: ActiveTutorial | null = null;
  let overlay: HTMLElement | null = null;
  let blocker: HTMLElement | null = null;
  let highlight: HTMLElement | null = null;
  let popover: HTMLElement | null = null;
  let maskSvg: SVGSVGElement | null = null;
  let maskPath: SVGPathElement | null = null;
  let currentTarget: HTMLElement | null = null;
  let repositionRaf: number | null = null;
  let scrollRaf: number | null = null;
  let lastActionHandledAt = 0;

  const getState = (): TutorialState => normalizeState(options.getStore<TutorialState>(STORAGE_KEY, DEFAULT_STATE));

  const saveState = (state: TutorialState): void => {
    options.setStore(STORAGE_KEY, state);
  };

  const getDoc = (): Document => options.getDocument();
  const getWin = (): Window => options.getWindow();

  const injectStyles = (): void => {
    const doc = getDoc();
    if (doc.getElementById(STYLE_ID)) return;

    const style = doc.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${OVERLAY_CLASS} {
        position: fixed;
        inset: 0;
        z-index: ${TUTORIAL_OVERLAY_Z_INDEX};
        pointer-events: auto;
        isolation: isolate;
        font-family: "Microsoft YaHei", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .acu-tutorial-blocker {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        background: rgba(0, 0, 0, 0.001);
        pointer-events: auto;
        touch-action: none;
        -webkit-tap-highlight-color: transparent;
      }
      .acu-tutorial-mask {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1;
        pointer-events: none;
        contain: layout paint style;
      }
      .acu-tutorial-mask path {
        fill: rgba(0, 0, 0, 0.66);
      }
      .acu-tutorial-highlight {
        position: fixed;
        left: 0;
        top: 0;
        border: 2px solid var(--acu-accent, #3b82f6);
        border-radius: 10px;
        box-shadow: 0 0 0 6px color-mix(in srgb, var(--acu-accent, #3b82f6) 24%, transparent);
        transition: transform 0.18s ease, opacity 0.12s ease;
        will-change: transform, opacity;
        z-index: 2;
        pointer-events: none;
        contain: layout paint style;
      }
      .acu-tutorial-popover {
        position: fixed;
        width: min(320px, calc(100vw - 28px));
        box-sizing: border-box;
        background: var(--acu-bg-panel, #fff);
        color: var(--acu-text-main, #222);
        border: 1px solid var(--acu-border, rgba(0, 0, 0, 0.18));
        border-radius: 10px;
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.35);
        overflow: hidden;
        z-index: 3;
      }
      .acu-tutorial-head {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 14px;
        background: var(--acu-table-head, rgba(0, 0, 0, 0.04));
        border-bottom: 1px solid var(--acu-border, rgba(0, 0, 0, 0.14));
        font-weight: 700;
        font-size: 14px;
        line-height: 1.35;
        min-width: 0;
      }
      .acu-tutorial-head i {
        color: var(--acu-accent, #3b82f6);
        flex: 0 0 auto;
      }
      .acu-tutorial-title {
        flex: 1 1 auto;
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .acu-tutorial-close {
        width: 28px;
        height: 28px;
        border: 1px solid transparent;
        border-radius: 6px;
        background: transparent;
        color: var(--acu-text-sub, #666);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        padding: 0;
        touch-action: manipulation;
        transition:
          background-color 0.16s ease-out,
          color 0.16s ease-out,
          border-color 0.16s ease-out,
          box-shadow 0.16s ease-out;
      }
      .acu-tutorial-close i {
        color: inherit;
      }
      .acu-tutorial-close:hover,
      .acu-tutorial-close:focus-visible {
        background: var(--acu-btn-bg, rgba(0, 0, 0, 0.06));
        border-color: var(--acu-border, rgba(0, 0, 0, 0.16));
        color: var(--acu-text-main, #222);
        outline: none;
        box-shadow: var(--acu-focus-ring, 0 0 0 2px rgba(59, 130, 246, 0.22));
      }
      .acu-tutorial-body {
        padding: 13px 14px 12px;
        color: var(--acu-text-main, #222);
        font-size: 13px;
        line-height: 1.65;
      }
      .acu-tutorial-progress {
        color: var(--acu-text-sub, #666);
        font-size: 11px;
        margin-top: 8px;
      }
      .acu-tutorial-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        align-items: center;
        padding: 10px 12px;
        background: var(--acu-table-head, rgba(0, 0, 0, 0.04));
        border-top: 1px solid var(--acu-border, rgba(0, 0, 0, 0.14));
      }
      .acu-tutorial-btn {
        min-height: 30px;
        padding: 6px 10px;
        border-radius: 6px;
        border: 1px solid var(--acu-border, rgba(0, 0, 0, 0.16));
        background: var(--acu-btn-bg, rgba(0, 0, 0, 0.06));
        color: var(--acu-text-main, #222);
        cursor: pointer;
        font-size: 12px;
        line-height: 1.25;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        min-width: 0;
        white-space: nowrap;
        touch-action: manipulation;
        transition:
          background-color 0.16s ease-out,
          color 0.16s ease-out,
          border-color 0.16s ease-out,
          box-shadow 0.16s ease-out;
      }
      .acu-tutorial-btn:hover,
      .acu-tutorial-btn:focus-visible {
        background: var(--acu-btn-hover, rgba(0, 0, 0, 0.1));
        border-color: var(--acu-border, rgba(0, 0, 0, 0.22));
        outline: none;
        box-shadow: var(--acu-focus-ring, 0 0 0 2px rgba(59, 130, 246, 0.22));
      }
      .acu-tutorial-btn.primary {
        background: var(--acu-accent, #3b82f6);
        border-color: var(--acu-accent, #3b82f6);
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
        font-weight: 700;
      }
      .acu-tutorial-btn.primary:hover,
      .acu-tutorial-btn.primary:focus-visible {
        background: var(--acu-accent, #3b82f6);
        border-color: var(--acu-accent, #3b82f6);
        opacity: 0.92;
      }
      .acu-tutorial-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
        box-shadow: none;
      }
      .acu-tutorial-btn:disabled:hover {
        background: var(--acu-btn-bg, rgba(0, 0, 0, 0.06));
        border-color: var(--acu-border, rgba(0, 0, 0, 0.16));
        color: var(--acu-text-main, #222);
      }
      @media (max-width: 640px) {
        .acu-tutorial-popover {
          width: calc(100vw - 20px);
          max-height: var(--acu-tutorial-mobile-max-height, min(42dvh, 360px));
          display: flex;
          flex-direction: column;
          border-radius: 10px;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.42);
        }
        .acu-tutorial-highlight {
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--acu-accent, #3b82f6) 24%, transparent);
        }
        .acu-tutorial-head,
        .acu-tutorial-actions {
          flex: 0 0 auto;
        }
        .acu-tutorial-body {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          font-size: 13px;
        }
        .acu-tutorial-actions {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .acu-tutorial-btn {
          min-height: 38px;
          font-size: 13px;
        }
        .acu-tutorial-btn.primary {
          min-height: 42px;
        }
      }
    `;
    doc.head.appendChild(style);
  };

  const isVisibleElement = (element: HTMLElement): boolean => {
    if (!element.isConnected) return false;
    const rect = element.getBoundingClientRect();
    const style = getWin().getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  };

  const queryVisibleElement = (selector: string): HTMLElement | null => {
    const doc = getDoc();
    const first = doc.querySelector<HTMLElement>(selector);
    if (!first) return null;
    if (isVisibleElement(first)) return first;

    const candidates = doc.querySelectorAll<HTMLElement>(selector);
    for (const element of candidates) {
      if (isVisibleElement(element)) return element;
    }
    return null;
  };

  const findTarget = (tutorial: ActiveTutorial, index: number): HTMLElement | null => {
    const step = tutorial.steps[index];
    if (index === 0 && tutorial.initialTarget && isVisibleElement(tutorial.initialTarget)) {
      return tutorial.initialTarget;
    }

    const cached = tutorial.targetCache.get(index);
    if (cached && isVisibleElement(cached)) return cached;
    if (tutorial.targetCache.has(index)) tutorial.targetCache.delete(index);

    for (const selector of getSelectors(step)) {
      const target = queryVisibleElement(selector);
      if (target) {
        tutorial.targetCache.set(index, target);
        return target;
      }
    }
    tutorial.targetCache.set(index, null);
    return null;
  };

  const isPopoverEventTarget = (target: EventTarget | null): boolean => {
    if (!target || !popover) return false;
    return target instanceof getWin().Node && popover.contains(target);
  };

  const isOverlayEventTarget = (target: EventTarget | null): boolean => {
    if (!target || !overlay) return false;
    return target instanceof getWin().Node && overlay.contains(target);
  };

  const blockOutsideTutorialEvent = (event: Event): void => {
    if (!activeTutorial || !overlay || isPopoverEventTarget(event.target)) return;
    if (!isOverlayEventTarget(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const blockedEventNames = [
    'pointerdown',
    'pointerup',
    'pointercancel',
    'mousedown',
    'mouseup',
    'click',
    'dblclick',
    'touchstart',
    'touchmove',
    'touchend',
    'wheel',
    'contextmenu',
  ] as const;

  const removeListeners = (): void => {
    const win = getWin();
    const doc = getDoc();
    win.removeEventListener('resize', requestReposition);
    win.removeEventListener('scroll', requestReposition);
    win.visualViewport?.removeEventListener('resize', requestReposition);
    win.visualViewport?.removeEventListener('scroll', requestReposition);
    blockedEventNames.forEach(eventName => {
      doc.removeEventListener(eventName, blockOutsideTutorialEvent, true);
    });
  };

  function requestReposition(): void {
    if (repositionRaf !== null) return;
    repositionRaf = getWin().requestAnimationFrame(() => {
      repositionRaf = null;
      positionElements();
    });
  }

  const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

  const intersectRects = (a: TutorialRect, b: TutorialRect): TutorialRect | null => {
    const left = Math.max(a.left, b.left);
    const top = Math.max(a.top, b.top);
    const right = Math.min(a.right, b.right);
    const bottom = Math.min(a.bottom, b.bottom);
    const width = right - left;
    const height = bottom - top;
    if (width <= 0 || height <= 0) return null;
    return { left, top, right, bottom, width, height };
  };

  const getViewportRect = (): TutorialViewport => {
    const win = getWin();
    const doc = getDoc();
    const visualViewport = win.visualViewport;
    const left = visualViewport?.offsetLeft ?? 0;
    const top = visualViewport?.offsetTop ?? 0;
    const width = visualViewport?.width ?? win.innerWidth ?? doc.documentElement.clientWidth ?? 0;
    const height = visualViewport?.height ?? win.innerHeight ?? doc.documentElement.clientHeight ?? 0;
    return {
      left,
      top,
      right: left + width,
      bottom: top + height,
      width,
      height,
    };
  };

  const isMobileTutorialViewport = (): boolean => {
    const viewport = getViewportRect();
    const win = getWin();
    const coarsePointer = win.matchMedia?.('(pointer: coarse)').matches === true;
    return viewport.width <= 640 || (coarsePointer && viewport.width <= 820);
  };

  const getNumericZIndex = (element: HTMLElement): number | null => {
    const zIndex = getWin().getComputedStyle(element).zIndex;
    if (zIndex === 'auto') return null;
    const numericZIndex = Number.parseInt(zIndex, 10);
    return Number.isFinite(numericZIndex) ? numericZIndex : null;
  };

  const getViewportAreaRatio = (element: HTMLElement): number => {
    const viewport = getViewportRect();
    const viewportArea = viewport.width * viewport.height;
    if (viewportArea <= 0) return 0;

    const rect = rectToTutorialViewport(element.getBoundingClientRect());
    const visibleRect = intersectRects(rect, viewport);
    if (!visibleRect) return 0;
    return (visibleRect.width * visibleRect.height) / viewportArea;
  };

  const isVisiblePointerLayer = (element: HTMLElement): boolean => {
    if (!element.isConnected) return false;

    const style = getWin().getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.pointerEvents === 'none') return false;
    if (Number.parseFloat(style.opacity || '1') <= 0.01) return false;

    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  const hasExternalBlockingLayer = (): boolean => {
    const doc = getDoc();
    const win = getWin();

    return Array.from(doc.body.children).some(child => {
      if (!(child instanceof win.HTMLElement)) return false;
      if (child.id === STYLE_ID || child.closest(`.${OVERLAY_CLASS}`)) return false;
      if (!isVisiblePointerLayer(child)) return false;

      const zIndex = getNumericZIndex(child);
      if (zIndex === null || zIndex < TUTORIAL_OVERLAY_Z_INDEX) return false;

      return getViewportAreaRatio(child) >= BLOCKING_LAYER_MIN_VIEWPORT_AREA_RATIO;
    });
  };

  const getPopoverPosition = (
    targetRect: TutorialRect,
    popoverRect: TutorialRect,
    placement: TutorialPlacement,
  ): { left: number; top: number } => {
    const gap = 14;
    const margin = 12;
    const viewport = getViewportRect();
    const minLeft = viewport.left + margin;
    const minTop = viewport.top + margin;
    const maxLeft = Math.max(minLeft, viewport.right - popoverRect.width - margin);
    const maxTop = Math.max(minTop, viewport.bottom - popoverRect.height - margin);

    if (placement === 'center') {
      return {
        left: clamp(viewport.left + (viewport.width - popoverRect.width) / 2, minLeft, maxLeft),
        top: clamp(viewport.top + (viewport.height - popoverRect.height) / 2, minTop, maxTop),
      };
    }

    const centeredLeft = targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
    const centeredTop = targetRect.top + targetRect.height / 2 - popoverRect.height / 2;
    const candidates: Record<TutorialPlacement, { left: number; top: number }> = {
      top: { left: centeredLeft, top: targetRect.top - popoverRect.height - gap },
      right: { left: targetRect.right + gap, top: centeredTop },
      bottom: { left: centeredLeft, top: targetRect.bottom + gap },
      left: { left: targetRect.left - popoverRect.width - gap, top: centeredTop },
      center: { left: centeredLeft, top: centeredTop },
    };

    let next = candidates[placement];
    const overflows =
      next.left < minLeft ||
      next.top < minTop ||
      next.left + popoverRect.width > viewport.right - margin ||
      next.top + popoverRect.height > viewport.bottom - margin;

    if (overflows) {
      const fallbackOrder: TutorialPlacement[] = ['bottom', 'top', 'right', 'left'];
      const fallback = fallbackOrder
        .map(item => candidates[item])
        .find(
          item =>
            item.left >= minLeft &&
            item.top >= minTop &&
            item.left + popoverRect.width <= viewport.right - margin &&
            item.top + popoverRect.height <= viewport.bottom - margin,
        );
      if (fallback) next = fallback;
    }

    return {
      left: clamp(next.left, minLeft, maxLeft),
      top: clamp(next.top, minTop, maxTop),
    };
  };

  const getMobilePopoverPosition = (targetRect: TutorialRect, popoverRect: TutorialRect): { left: number; top: number } => {
    const gap = 12;
    const margin = 10;
    const viewport = getViewportRect();
    const minLeft = viewport.left + margin;
    const minTop = viewport.top + margin;
    const maxLeft = Math.max(minLeft, viewport.right - popoverRect.width - margin);
    const maxTop = Math.max(minTop, viewport.bottom - popoverRect.height - margin);
    const left = clamp(viewport.left + (viewport.width - popoverRect.width) / 2, minLeft, maxLeft);

    const targetCenterY = targetRect.top + targetRect.height / 2;
    const targetInUpperHalf = targetCenterY < viewport.top + viewport.height / 2;
    const topEdgeCandidate = minTop;
    const bottomEdgeCandidate = maxTop;
    const preferredTop = targetInUpperHalf ? bottomEdgeCandidate : topEdgeCandidate;
    const fallbackTop = targetInUpperHalf ? topEdgeCandidate : bottomEdgeCandidate;
    const hasVerticalGap = (top: number): boolean =>
      top + popoverRect.height <= targetRect.top - gap || top >= targetRect.bottom + gap;

    if (hasVerticalGap(preferredTop)) return { left, top: preferredTop };
    if (hasVerticalGap(fallbackTop)) return { left, top: fallbackTop };

    const spaceAbove = Math.max(0, targetRect.top - viewport.top);
    const spaceBelow = Math.max(0, viewport.bottom - targetRect.bottom);
    const top = spaceBelow >= spaceAbove ? targetRect.bottom + gap : targetRect.top - popoverRect.height - gap;
    return { left, top: clamp(top, minTop, maxTop) };
  };

  const rectToTutorialViewport = (rect: DOMRect): TutorialRect => {
    const viewport = getViewportRect();
    return {
      left: rect.left + viewport.left,
      top: rect.top + viewport.top,
      right: rect.right + viewport.left,
      bottom: rect.bottom + viewport.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const getRectFromElement = (element: HTMLElement): TutorialRect | null => {
    if (!isVisibleElement(element)) return null;
    return rectToTutorialViewport(element.getBoundingClientRect());
  };

  const getElementClipRect = (element: HTMLElement): TutorialRect => {
    const doc = getDoc();
    const win = getWin();
    const viewport = getViewportRect();
    let clipRect: TutorialRect = { ...viewport };
    let current = element.parentElement;

    while (current && current !== doc.body && current !== doc.documentElement) {
      const style = win.getComputedStyle(current);
      const clipsX = /(auto|scroll|hidden|clip|overlay)/.test(style.overflowX);
      const clipsY = /(auto|scroll|hidden|clip|overlay)/.test(style.overflowY);
      if (clipsX || clipsY) {
        const ancestorRect = rectToTutorialViewport(current.getBoundingClientRect());
        const nextClip = intersectRects(clipRect, ancestorRect);
        if (!nextClip) return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
        clipRect = nextClip;
      }
      current = current.parentElement;
    }

    return clipRect;
  };

  const getVisibleRectFromElement = (element: HTMLElement): TutorialRect | null => {
    const rect = getRectFromElement(element);
    if (!rect) return null;
    return intersectRects(rect, getElementClipRect(element));
  };

  const isRectPresentInSafeRect = (rect: TutorialRect, safeRect: TutorialRect): boolean => {
    const hasHorizontalPresence =
      rect.width > safeRect.width
        ? rect.right >= safeRect.left && rect.left <= safeRect.right
        : rect.left >= safeRect.left && rect.right <= safeRect.right;
    const hasVerticalPresence =
      rect.height > safeRect.height
        ? rect.bottom >= safeRect.top && rect.top <= safeRect.bottom
        : rect.top >= safeRect.top && rect.bottom <= safeRect.bottom;
    return hasHorizontalPresence && hasVerticalPresence;
  };

  const isRelatedToTarget = (element: HTMLElement, target?: HTMLElement | null): boolean => {
    if (!target) return false;
    return element === target || element.contains(target) || target.contains(element);
  };

  const getTargetOverlayRoot = (target?: HTMLElement | null): HTMLElement | null => {
    if (!target) return null;
    const root = target.closest(
      '.acu-edit-overlay, .acu-avatar-manager-overlay, .acu-inventory-detail-overlay, .acu-import-confirm-overlay, .acu-config-backup-overlay, .mvu-edit-overlay',
    );
    return root instanceof getWin().HTMLElement ? root : null;
  };

  const getBottomObstacleTop = (viewport: TutorialViewport, target?: HTMLElement | null): number => {
    const doc = getDoc();
    const targetOverlayRoot = getTargetOverlayRoot(target);
    const dialogObstacleSelectors = [
      '.acu-edit-dialog > .acu-dialog-footer',
      '.acu-gacha-settings-dialog > .acu-gacha-settings-footer',
      '.acu-gacha-item-editor > .acu-gacha-settings-footer',
      '.acu-edit-dialog > .acu-gacha-settings-footer',
      '.acu-config-backup-dialog > .acu-config-backup-footer',
    ];
    const globalObstacleSelectors = [
      '.acu-wrapper.acu-mode-viewport #acu-nav-bar',
      '.acu-wrapper.acu-mode-viewport .acu-nav-container',
      '#acu-nav-bar',
      '#acu-active-actions',
      '#send_form',
      '#form_sheld',
      '.send_form',
      '#send_textarea',
    ];
    const selectors = targetOverlayRoot
      ? dialogObstacleSelectors
      : [...dialogObstacleSelectors, ...globalObstacleSelectors];
    return selectors.reduce((currentTop, selector) => {
      const elements = doc.querySelectorAll<HTMLElement>(selector);
      let nextTop = currentTop;
      elements.forEach(element => {
        if (targetOverlayRoot && !targetOverlayRoot.contains(element)) return;
        // 目标本身可能就是底部栏或导航盘；这种情况下不能把它当成遮挡物避让。
        if (isRelatedToTarget(element, target)) return;
        const rect = getRectFromElement(element);
        if (!rect) return;
        const overlapsViewport = rect.bottom > viewport.top && rect.top < viewport.bottom;
        const startsInLowerHalf = rect.top > viewport.top + viewport.height * 0.4;
        if (!overlapsViewport || !startsInLowerHalf) return;
        nextTop = Math.min(nextTop, rect.top);
      });
      return nextTop;
    }, viewport.bottom);
  };

  const getTargetSafeRect = (popoverRect?: TutorialRect | null, target?: HTMLElement | null): TutorialRect => {
    const viewport = getViewportRect();
    const margin = 10;
    const gap = 12;
    let top = viewport.top + margin;
    let bottom = Math.min(viewport.bottom - margin, getBottomObstacleTop(viewport, target) - gap);
    const left = viewport.left + margin;
    const right = viewport.right - margin;

    if (popoverRect) {
      const popoverOverlapsViewport = popoverRect.bottom > viewport.top && popoverRect.top < viewport.bottom;
      if (popoverOverlapsViewport) {
        const popoverCenterY = popoverRect.top + popoverRect.height / 2;
        if (popoverCenterY < viewport.top + viewport.height / 2) {
          top = Math.max(top, popoverRect.bottom + gap);
        } else {
          bottom = Math.min(bottom, popoverRect.top - gap);
        }
      }
    }

    if (bottom - top < 120) {
      top = viewport.top + margin;
      bottom = Math.min(viewport.bottom - margin, getBottomObstacleTop(viewport, target) - gap);
    }

    const safeRect: TutorialRect = {
      left,
      top,
      right,
      bottom,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
    };
    if (!target) return safeRect;

    const clippedSafeRect = intersectRects(safeRect, getElementClipRect(target));
    if (clippedSafeRect && clippedSafeRect.width >= 32 && clippedSafeRect.height >= 32) return clippedSafeRect;
    return safeRect;
  };

  const getCurrentPopoverRect = (): TutorialRect | null => {
    if (!popover || popover.style.visibility === 'hidden') return null;
    const rect = rectToTutorialViewport(popover.getBoundingClientRect());
    if (rect.width <= 0 || rect.height <= 0) return null;
    return rect;
  };

  const isTargetComfortablyVisible = (target: HTMLElement): boolean => {
    const safeRect = getTargetSafeRect(getCurrentPopoverRect(), target);
    const rect = getVisibleRectFromElement(target);
    if (!rect) return false;
    const horizontalMargin = 4;
    const hasHorizontalPresence =
      rect.right >= safeRect.left + horizontalMargin && rect.left <= safeRect.right - horizontalMargin;
    return hasHorizontalPresence && isRectPresentInSafeRect(rect, safeRect);
  };

  const isTargetInsideViewport = (target: HTMLElement): boolean => {
    const safeRect = getTargetSafeRect(null, target);
    const rect = getVisibleRectFromElement(target);
    if (!rect) return false;
    return isRectPresentInSafeRect(rect, safeRect);
  };

  const getScrollParent = (element: HTMLElement): HTMLElement | null => {
    const doc = getDoc();
    let current = element.parentElement;
    while (current && current !== doc.body) {
      const style = getWin().getComputedStyle(current);
      const overflowY = style.overflowY;
      const canScroll = /(auto|scroll|overlay)/.test(overflowY) && current.scrollHeight > current.clientHeight + 1;
      if (canScroll) return current;
      current = current.parentElement;
    }
    return (doc.scrollingElement as HTMLElement | null) || doc.documentElement;
  };

  const scrollElementBy = (element: HTMLElement, deltaY: number): boolean => {
    const maxScrollTop = Math.max(0, element.scrollHeight - element.clientHeight);
    const nextScrollTop = clamp(element.scrollTop + deltaY, 0, maxScrollTop);
    if (Math.abs(nextScrollTop - element.scrollTop) < 1) return false;
    element.scrollTop = nextScrollTop;
    return true;
  };

  const scrollTargetIntoSafeRect = (target: HTMLElement, avoidPopover: boolean): boolean => {
    const safeRect = getTargetSafeRect(avoidPopover ? getCurrentPopoverRect() : null, target);
    const rect = getRectFromElement(target);
    if (!rect) return false;
    let deltaY = 0;

    if (rect.height > safeRect.height) {
      if (rect.top > safeRect.top) {
        deltaY = rect.top - safeRect.top;
      } else if (rect.bottom < safeRect.bottom) {
        deltaY = rect.bottom - safeRect.bottom;
      }
    } else if (rect.bottom < safeRect.top || rect.top > safeRect.bottom) {
      deltaY = rect.top + rect.height / 2 - (safeRect.top + safeRect.height / 2);
    } else if (rect.top < safeRect.top) {
      deltaY = rect.top - safeRect.top;
    } else if (rect.bottom > safeRect.bottom) {
      deltaY = rect.bottom - safeRect.bottom;
    }

    if (Math.abs(deltaY) < 1) return false;
    const scrollParent = getScrollParent(target);
    if (scrollParent && scrollElementBy(scrollParent, deltaY)) return true;
    target.scrollIntoView({ block: 'center', inline: 'nearest' });
    return true;
  };

  const scheduleTargetIntoView = (): void => {
    if (!activeTutorial) return;
    const win = getWin();
    if (scrollRaf !== null) {
      win.cancelAnimationFrame(scrollRaf);
      scrollRaf = null;
    }

    const tutorial = activeTutorial;
    const index = tutorial.index;
    const target = findTarget(tutorial, index);
    if (!target) {
      requestReposition();
      return;
    }

    const mobile = isMobileTutorialViewport();
    const targetAlreadyVisible = mobile ? isTargetComfortablyVisible(target) : isTargetInsideViewport(target);
    if (targetAlreadyVisible) {
      requestReposition();
      return;
    }

    scrollTargetIntoSafeRect(target, mobile);
    scrollRaf = win.requestAnimationFrame(() => {
      scrollRaf = win.requestAnimationFrame(() => {
        scrollRaf = null;
        if (activeTutorial === tutorial && activeTutorial.index === index) requestReposition();
      });
    });
  };

  function positionElements(): void {
    if (!activeTutorial || !highlight || !popover) return;
    const step = activeTutorial.steps[activeTutorial.index];
    currentTarget = step ? findTarget(activeTutorial, activeTutorial.index) : null;
    const viewport = getViewportRect();
    const mobile = isMobileTutorialViewport();
    if (mobile) {
      const mobileMaxHeight = Math.max(160, Math.min(360, viewport.height * 0.42));
      popover.style.setProperty('--acu-tutorial-mobile-max-height', `${Math.round(mobileMaxHeight)}px`);
    } else {
      popover.style.removeProperty('--acu-tutorial-mobile-max-height');
    }

    const visibleTargetRect = currentTarget ? getVisibleRectFromElement(currentTarget) : null;
    const targetRect = visibleTargetRect || {
      left: viewport.left + viewport.width / 2 - 1,
      top: viewport.top + viewport.height / 2 - 1,
      right: viewport.left + viewport.width / 2 + 1,
      bottom: viewport.top + viewport.height / 2 + 1,
      width: 2,
      height: 2,
    };
    const padding = currentTarget ? (mobile ? 4 : 6) : 0;
    let highlightLeft = currentTarget ? Math.max(viewport.left + 8, targetRect.left - padding) : 0;
    let highlightTop = currentTarget ? Math.max(viewport.top + 8, targetRect.top - padding) : 0;
    let highlightRight = currentTarget ? targetRect.right + padding : 0;
    let highlightBottom = currentTarget ? targetRect.bottom + padding : 0;

    const popoverRect = rectToTutorialViewport(popover.getBoundingClientRect());
    const position = mobile
      ? currentTarget
        ? getMobilePopoverPosition(targetRect, popoverRect)
        : getPopoverPosition(targetRect, popoverRect, 'center')
      : getPopoverPosition(targetRect, popoverRect, step?.placement || 'bottom');
    if (currentTarget) {
      const futurePopoverRect: TutorialRect = {
        left: position.left,
        top: position.top,
        right: position.left + popoverRect.width,
        bottom: position.top + popoverRect.height,
        width: popoverRect.width,
        height: popoverRect.height,
      };
      const safeRect = getTargetSafeRect(mobile ? futurePopoverRect : null, currentTarget);
      highlightLeft = clamp(highlightLeft, safeRect.left, safeRect.right);
      highlightTop = clamp(highlightTop, safeRect.top, safeRect.bottom);
      highlightRight = clamp(highlightRight, safeRect.left, safeRect.right);
      highlightBottom = clamp(highlightBottom, safeRect.top, safeRect.bottom);
    }

    const highlightWidth = Math.max(0, highlightRight - highlightLeft);
    const highlightHeight = Math.max(0, highlightBottom - highlightTop);
    const showHighlight = Boolean(visibleTargetRect) && highlightWidth >= 2 && highlightHeight >= 2;

    highlight.style.transform = `translate3d(${Math.round(highlightLeft)}px, ${Math.round(highlightTop)}px, 0)`;
    highlight.style.width = `${Math.round(highlightWidth)}px`;
    highlight.style.height = `${Math.round(highlightHeight)}px`;
    highlight.style.opacity = showHighlight ? '1' : '0';
    positionMask({
      left: highlightLeft,
      top: highlightTop,
      width: highlightWidth,
      height: highlightHeight,
      visible: showHighlight,
      viewport,
    });
    popover.style.left = `${Math.round(position.left)}px`;
    popover.style.top = `${Math.round(position.top)}px`;
    popover.style.visibility = 'visible';
  }

  const positionMask = (rect: {
    left: number;
    top: number;
    width: number;
    height: number;
    visible: boolean;
    viewport: TutorialViewport;
  }): void => {
    if (!maskSvg || !maskPath) return;
    const viewportWidth = Math.max(0, Math.round(rect.viewport.width));
    const viewportHeight = Math.max(0, Math.round(rect.viewport.height));
    maskSvg.setAttribute('viewBox', `0 0 ${viewportWidth} ${viewportHeight}`);
    maskSvg.setAttribute('width', `${viewportWidth}`);
    maskSvg.setAttribute('height', `${viewportHeight}`);

    const outerPath = `M0 0H${viewportWidth}V${viewportHeight}H0Z`;
    if (!rect.visible) {
      maskPath.setAttribute('d', outerPath);
      return;
    }

    const relativeLeft = rect.left - rect.viewport.left;
    const relativeTop = rect.top - rect.viewport.top;
    const left = Math.round(clamp(relativeLeft, 0, viewportWidth));
    const top = Math.round(clamp(relativeTop, 0, viewportHeight));
    const right = Math.round(clamp(relativeLeft + rect.width, 0, viewportWidth));
    const bottom = Math.round(clamp(relativeTop + rect.height, 0, viewportHeight));
    maskPath.setAttribute('d', `${outerPath}M${left} ${top}H${right}V${bottom}H${left}Z`);
  };

  const getVisibleStep = (tutorial: ActiveTutorial, direction: 1 | -1): number => {
    if (tutorial.visibleIndexes.length > 0) {
      if (direction === 1) {
        return tutorial.visibleIndexes.find(index => index >= tutorial.index) ?? -1;
      }
      for (let i = tutorial.visibleIndexes.length - 1; i >= 0; i -= 1) {
        const index = tutorial.visibleIndexes[i];
        if (index <= tutorial.index) return index;
      }
      return -1;
    }

    let index = tutorial.index;
    while (index >= 0 && index < tutorial.steps.length) {
      const step = tutorial.steps[index];
      if (!step.selector || findTarget(tutorial, index)) return index;
      index += direction;
    }
    return -1;
  };

  const hasVisibleStep = (tutorial: ActiveTutorial, direction: 1 | -1): boolean => {
    if (tutorial.visibleIndexes.length > 0) {
      return tutorial.visibleIndexes.some(index => (direction === 1 ? index > tutorial.index : index < tutorial.index));
    }

    let index = tutorial.index + direction;
    while (index >= 0 && index < tutorial.steps.length) {
      const step = tutorial.steps[index];
      if (!step.selector || findTarget(tutorial, index)) return true;
      index += direction;
    }
    return false;
  };

  const collectVisibleIndexes = (tutorial: ActiveTutorial): number[] =>
    tutorial.steps.reduce<number[]>((indexes, step, index) => {
      if (!step.selector || findTarget(tutorial, index)) indexes.push(index);
      return indexes;
    }, []);

  const completeActiveScope = (): void => {
    if (!activeTutorial) return;
    saveState(markCompleted(getState(), activeTutorial.scope));
  };

  const closeInternal = (complete: boolean): void => {
    if (complete) completeActiveScope();
    removeListeners();
    if (repositionRaf !== null) {
      getWin().cancelAnimationFrame(repositionRaf);
      repositionRaf = null;
    }
    if (scrollRaf !== null) {
      getWin().cancelAnimationFrame(scrollRaf);
      scrollRaf = null;
    }
    overlay?.remove();
    overlay = null;
    blocker = null;
    highlight = null;
    popover = null;
    maskSvg = null;
    maskPath = null;
    currentTarget = null;
    activeTutorial = null;
  };

  const render = (): void => {
    if (!activeTutorial || !popover) return;
    const step = activeTutorial.steps[activeTutorial.index];
    const isFirst = activeTutorial.index <= 0;
    const isLast = !hasVisibleStep(activeTutorial, 1);
    const nextText = isLast ? '完成' : '下一步';

    popover.innerHTML = `
      <div class="acu-tutorial-head">
        <i class="fa-solid fa-circle-question"></i>
        <span id="acu-tutorial-title" class="acu-tutorial-title">${escapeHtml(step.title)}</span>
        <button type="button" class="acu-tutorial-close" data-action="close" title="关闭教程" aria-label="关闭教程">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div id="acu-tutorial-body" class="acu-tutorial-body">
        <div>${escapeHtml(step.content)}</div>
        <div class="acu-tutorial-progress">${activeTutorial.index + 1} / ${activeTutorial.steps.length}</div>
      </div>
      <div class="acu-tutorial-actions">
        <button type="button" class="acu-tutorial-btn" data-action="prev" ${isFirst ? 'disabled' : ''}>
          <i class="fa-solid fa-arrow-left"></i><span>上一步</span>
        </button>
        <button type="button" class="acu-tutorial-btn primary" data-action="next">
          <span>${nextText}</span><i class="fa-solid ${isLast ? 'fa-check' : 'fa-arrow-right'}"></i>
        </button>
      </div>
    `;
    scheduleTargetIntoView();
  };

  const goTo = (direction: 1 | -1): void => {
    if (!activeTutorial) return;
    if (direction === -1) {
      if (activeTutorial.index <= 0) return;
      activeTutorial.index -= 1;
      render();
      return;
    }

    activeTutorial.index += direction;
    const nextIndex = getVisibleStep(activeTutorial, direction);
    if (nextIndex === -1) {
      closeInternal(true);
      return;
    }
    activeTutorial.index = nextIndex;
    render();
  };

  const getActionTarget = (target: EventTarget | null): HTMLElement | null => {
    if (!target) return null;
    const win = getWin();
    const element = target instanceof win.Element ? target : target instanceof win.Node ? target.parentElement : null;
    const actionTarget = element?.closest('[data-action]');
    return actionTarget instanceof win.HTMLElement ? actionTarget : null;
  };

  const runAction = (action: TutorialAction): void => {
    if (action === 'prev') {
      goTo(-1);
    } else if (action === 'next') {
      goTo(1);
    } else if (action === 'close') {
      closeInternal(true);
    }
  };

  const handleOverlayAction = (event: Event): void => {
    const actionTarget = getActionTarget(event.target);
    if (!actionTarget) return;
    if (actionTarget instanceof getWin().HTMLButtonElement && actionTarget.disabled) return;

    const action = actionTarget.dataset.action;
    if (!isTutorialAction(action)) return;

    event.preventDefault();
    event.stopPropagation();

    const now = Date.now();
    if (now - lastActionHandledAt < 350) return;
    lastActionHandledAt = now;
    runAction(action);
  };

  const bindOverlayEvents = (): void => {
    if (!overlay) return;
    overlay.addEventListener('touchend', handleOverlayAction, { passive: false });
    overlay.addEventListener('click', handleOverlayAction);
  };

  const createOverlay = (): void => {
    const doc = getDoc();
    const svgNamespace = 'http://www.w3.org/2000/svg';
    overlay = doc.createElement('div');
    overlay.className = `${OVERLAY_CLASS} acu-theme-${options.getTheme()}`;
    blocker = doc.createElement('div');
    blocker.className = 'acu-tutorial-blocker';
    maskSvg = doc.createElementNS(svgNamespace, 'svg');
    maskSvg.classList.add('acu-tutorial-mask');
    maskSvg.setAttribute('aria-hidden', 'true');
    maskPath = doc.createElementNS(svgNamespace, 'path');
    maskPath.setAttribute('fill-rule', 'evenodd');
    maskSvg.appendChild(maskPath);
    highlight = doc.createElement('div');
    highlight.className = 'acu-tutorial-highlight';
    popover = doc.createElement('div');
    popover.className = 'acu-tutorial-popover';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-modal', 'true');
    popover.setAttribute('aria-labelledby', 'acu-tutorial-title');
    popover.setAttribute('aria-describedby', 'acu-tutorial-body');
    popover.style.visibility = 'hidden';
    overlay.append(blocker, maskSvg, highlight, popover);
    doc.body.appendChild(overlay);
    bindOverlayEvents();
  };

  const addListeners = (): void => {
    const win = getWin();
    const doc = getDoc();
    win.addEventListener('resize', requestReposition, { passive: true });
    win.addEventListener('scroll', requestReposition, { passive: true });
    win.visualViewport?.addEventListener('resize', requestReposition, { passive: true });
    win.visualViewport?.addEventListener('scroll', requestReposition, { passive: true });
    blockedEventNames.forEach(eventName => {
      doc.addEventListener(eventName, blockOutsideTutorialEvent, { capture: true, passive: false });
    });
  };

  const start = (scope: TutorialScope, optionsOverride: StartOptions = {}): void => {
    const manual = optionsOverride.manual === true;
    const completeWhenMissing = optionsOverride.completeWhenMissing === true;
    const interrupt = optionsOverride.interrupt === true || manual;
    const steps = STEPS[scope] || [];
    if (steps.length === 0) return;

    if (activeTutorial && !interrupt) return;

    if (!manual) {
      const state = getState();
      if (state.disabled || hasCompleted(state, scope)) return;
    }

    closeInternal(false);
    injectStyles();
    activeTutorial = {
      scope,
      steps,
      index: 0,
      manual,
      visibleIndexes: [],
      targetCache: new Map<number, HTMLElement | null>(),
      initialTarget: optionsOverride.target,
    };
    activeTutorial.visibleIndexes = collectVisibleIndexes(activeTutorial);
    const firstIndex = activeTutorial.visibleIndexes[0] ?? -1;
    if (firstIndex === -1) {
      if (!manual && completeWhenMissing) saveState(markCompleted(getState(), scope));
      activeTutorial = null;
      return;
    }

    activeTutorial.index = firstIndex;
    createOverlay();
    addListeners();
    render();
  };

  const maybeStart = (
    scope: TutorialScope,
    optionsOverride: { target?: HTMLElement; interrupt?: boolean } = {},
  ): void => {
    let attempts = 0;
    const attemptStart = (): void => {
      if (activeTutorial && optionsOverride.interrupt !== true) return;
      const state = getState();
      if (state.disabled || hasCompleted(state, scope)) return;

      attempts += 1;
      if (hasExternalBlockingLayer()) {
        if (attempts < AUTO_START_MAX_ATTEMPTS) {
          getWin().setTimeout(attemptStart, AUTO_START_INTERVAL_MS);
        }
        return;
      }

      const tutorial: ActiveTutorial = {
        scope,
        steps: STEPS[scope] || [],
        index: 0,
        manual: false,
        visibleIndexes: [],
        targetCache: new Map<number, HTMLElement | null>(),
        initialTarget: optionsOverride.target,
      };
      tutorial.visibleIndexes = collectVisibleIndexes(tutorial);
      if (tutorial.visibleIndexes.length > 0) {
        start(scope, optionsOverride);
        return;
      }
      if (attempts < AUTO_START_MAX_ATTEMPTS) {
        getWin().setTimeout(attemptStart, AUTO_START_INTERVAL_MS);
      }
    };
    getWin().setTimeout(attemptStart, AUTO_START_INTERVAL_MS);
  };

  return {
    maybeStart,
    start,
    close: () => closeInternal(false),
    isDisabled: () => getState().disabled,
  };
};
