// features/dnd-ui/ui-renderer.ts
// UIRenderer 聚合器（自 BasedonST `src/ui/UIRenderer.js` 移植，b3）
// 原版聚合全部 UI 模块（Object.assign）；融合版按批次渐进注册：
//   b3 = UIUtils（本批）；b4~b10 各域通过 extraModules / register 挂入。
export interface DndUiRendererDeps {
  uiUtils: any;
  dynamicBackground?: any;
  notification?: any;
  uiEffects?: any;
  extraModules?: Record<string, any>;
}

export function createDndUiRenderer(deps: DndUiRendererDeps): any {
  const renderer: any = Object.assign(
    {},
    {
      /**
       * 更新动态背景（b11 接入 DynamicBackground）。
       * b3 占位：保留接口与调用链（StyleManager.apply 会调用）。
       */
      updateDynamicBackground: (config: any) => {
        if (!config) return;
        // [b11c] 环境门：无 2D canvas 能力（如测试 vm）时跳过，避免残留 DOM
        let _has2d = false;
        try { const _c = document.createElement('canvas'); _has2d = !!(_c.getContext && _c.getContext('2d')); } catch (_e) { _has2d = false; }
        if (!_has2d) return;
        const bg = (deps as any).dynamicBackground;
        if (bg && typeof bg.destroyAll === 'function') { try { bg.destroyAll(); } catch (e) {} }
        if (bg && typeof bg.init === 'function') { try { bg.init(document.body, config.type, config); } catch (e) { try { if (typeof bg.destroyAll === 'function') bg.destroyAll(); } catch (e2) {} } }
      },
    },
    deps.uiUtils,
    deps.extraModules || {}
  );

  // 附属能力（无侵入暴露，供后续批次使用）
  renderer.NotificationSystem = deps.notification;
  renderer.UIEffects = deps.uiEffects;

  // 渐进注册口：后续批次（b4+）用此把新模块并入聚合器
  renderer.registerModules = (modules: Record<string, any>) => {
    Object.assign(renderer, modules || {});
    return renderer;
  };

  return renderer;
}