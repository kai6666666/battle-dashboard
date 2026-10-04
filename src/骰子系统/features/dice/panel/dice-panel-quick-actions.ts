// @child-factory（由父模块 show-dice-panel 实例化，不参与 index 接线审计）
/**
 * dice-panel-quick-actions.ts
 * 从 show-dice-panel.ts 拆出：预设快捷动作（渲染/条件可见性）与三种执行器
 * （激活预设 / 属性快捷 / 按动作ID执行）。
 */
export function createDicePanelQuickActions(deps: any, ctx: any) {
  const getPanel = ctx && typeof ctx.getPanel === 'function' ? ctx.getPanel : () => null;
    const getPresetQuickActions = (
      preset: AdvancedDicePreset | LegacyAdvancedDicePreset | null,
    ): PresetQuickAction[] => {
      if (!preset || !('quickActions' in preset) || !Array.isArray(preset.quickActions)) return [];
      return preset.quickActions.filter((action): action is PresetQuickAction =>
        Boolean(action && typeof action.id === 'string' && typeof action.kind === 'string'),
      );
    };

    const buildQuickActionContext = (): Record<string, number> => {
      const attrRaw = String(getPanel().find('#dice-attr-value').val() || '').trim();
      const modRaw = String(getPanel().find('#dice-modifier').val() || '').trim();
      const targetRaw = String(getPanel().find('#dice-target').val() || '').trim();
      const attr = attrRaw === '' ? 0 : parseFloat(attrRaw) || 0;
      const mod = modRaw === '' ? 0 : parseFloat(modRaw) || 0;
      const dc = targetRaw === '' ? 0 : parseFloat(targetRaw) || 0;
      return {
        $attr: attr,
        $mod: mod,
        $dc: dc,
      };
    };

    const isQuickActionVisible = (action: PresetQuickAction): boolean => {
      if (!action.condition) return true;
      const evalResult = deps.evaluateCondition(action.condition, buildQuickActionContext());
      if (!evalResult.success) return false;
      return typeof evalResult.value === 'number' ? evalResult.value !== 0 : Boolean(evalResult.value);
    };

    const renderPresetQuickActions = (preset: AdvancedDicePreset | LegacyAdvancedDicePreset | null): void => {
      const $container = getPanel().find('#dice-preset-quick-actions');
      if (!$container.length) return;
      const actions = getPresetQuickActions(preset).filter(isQuickActionVisible);
      if (actions.length === 0) {
        $container.empty().hide();
        return;
      }
      let html = '';
      actions.forEach(action => {
        const icon = action.icon || 'fa-bolt';
        const tooltip = action.tooltip || action.id;
        html += `<button type="button" class="acu-dice-preset-action-btn" data-action-id="${deps.escapeHtml(action.id)}" title="${deps.escapeHtml(tooltip)}"><i class="fa-solid ${deps.escapeHtml(icon)}"></i></button>`;
      });
      $container.html(html).show();
    };

    // 辅助函数: 应用字段配置
    const activatePresetQuickAction = (action: WorkflowQuickAction): void => {
      const presetId = String(action.config.presetId || '').trim();
      if (!presetId) {
        if (window.toastr) window.toastr.warning('快捷操作缺少目标预设');
        return;
      }
      const targetPreset = deps.AdvancedDicePresetManager.getAllPresets().find(item => item.id === presetId);
      if (!targetPreset) {
        if (window.toastr) window.toastr.warning(`未找到预设: ${presetId}`);
        return;
      }

      const carryInitiator = action.config.carryInitiator !== false;
      const carryAttrName = action.config.carryAttrName !== false;
      const carryAttrValue = action.config.carryAttrValue !== false;
      const carryTarget = action.config.carryTarget === true;
      const carryModifier = action.config.carryModifier === true;
      const carrySkillMod = action.config.carrySkillMod === true;

      const previousState = {
        initiatorName: String(getPanel().find('#dice-initiator-name').val() || '').trim(),
        attrName: String(getPanel().find('#dice-attr-name').val() || '').trim(),
        attrValue: String(getPanel().find('#dice-attr-value').val() || '').trim(),
        target: String(getPanel().find('#dice-target').val() || '').trim(),
        modifier: String(getPanel().find('#dice-modifier').val() || '').trim(),
        skillMod: String(getPanel().find('#dice-skill-mod').val() || '').trim(),
      };

      deps.AdvancedDicePresetManager.setActivePreset(presetId);
      localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, presetId);
      ctx.applyAdvancedPreset(presetId);

      if (carryInitiator) {
        getPanel().find('#dice-initiator-name').val(previousState.initiatorName);
      }
      if (carryAttrName) {
        getPanel().find('#dice-attr-name').val(previousState.attrName);
      } else if (action.config.attrName !== undefined) {
        getPanel().find('#dice-attr-name').val(action.config.attrName);
      }
      if (carryAttrValue) {
        getPanel().find('#dice-attr-value').val(previousState.attrValue);
      }
      if (carryTarget) {
        getPanel().find('#dice-target').val(previousState.target);
      }
      if (carryModifier) {
        getPanel().find('#dice-modifier').val(previousState.modifier);
      }
      if (carrySkillMod) {
        getPanel().find('#dice-skill-mod').val(previousState.skillMod);
      }

      if (action.config.customFieldValues) {
        Object.entries(action.config.customFieldValues).forEach(([fieldId, rawValue]) => {
          const $field = getPanel()
            .find('.acu-dice-custom-field')
            .filter((_index, element) => String($(element).data('id') || '') === fieldId);
          if (!$field.length) return;
          if ($field.is(':checkbox')) {
            $field.prop('checked', Boolean(rawValue));
            return;
          }
          $field.val(String(rawValue));
        });
      }

      getPanel().find('#dice-attr-name').trigger('change');
      getPanel().find('#dice-attr-value, #dice-target, #dice-modifier, #dice-skill-mod').trigger('change');
    };

    const executeAttrShortcutQuickAction = (action: AttrShortcutQuickAction): void => {
      const presetId = String(action.config.presetId || '').trim();
      if (!presetId) {
        if (window.toastr) window.toastr.warning('属性快捷缺少目标预设');
        return;
      }

      const allPresets = deps.AdvancedDicePresetManager.getAllPresets();
      const configuredTargetPreset = allPresets.find(item => item.id === presetId);
      if (!configuredTargetPreset) {
        if (window.toastr) window.toastr.warning(`属性快捷目标预设不存在: ${presetId}`);
        return;
      }

      // 架构约束：属性快捷只能指向“常规可见预设”，若指向工作流预设则直接中止
      if (configuredTargetPreset.visible === false) {
        if (window.toastr) {
          window.toastr.warning(`属性快捷目标预设不可用（工作流）: ${configuredTargetPreset.name}，已中止执行`);
        }
        return;
      }

      const presetAllowedTargets = Array.isArray(configuredTargetPreset.effectsConfig?.allowedTargets)
        ? configuredTargetPreset.effectsConfig?.allowedTargets
        : [];
      const mergedCandidates = Array.from(
        new Set(
          [...(action.config.attrAliasCandidates || []), ...presetAllowedTargets]
            .map(name => String(name || '').trim())
            .filter(Boolean),
        ),
      );

      const workflowAction: WorkflowQuickAction = {
        id: action.id,
        kind: 'workflow_shortcut',
        icon: action.icon,
        tooltip: action.tooltip,
        condition: action.condition,
        config: {
          presetId,
          carryInitiator: action.config.carryInitiator,
          carryAttrName: false,
          carryAttrValue: action.config.carryAttrValue,
          carryTarget: action.config.carryTarget,
          carryModifier: action.config.carryModifier,
          carrySkillMod: action.config.carrySkillMod,
        },
      };
      activatePresetQuickAction(workflowAction);

      const charName = String(getPanel().find('#dice-initiator-name').val() || '').trim() || '<user>';
      const candidates = mergedCandidates;
      const fallbackName = String(action.config.fallbackAttrName || '').trim() || candidates[0] || '';
      if (!fallbackName) return;

      const resolved = deps.resolveAttributeAliasName(charName, fallbackName, candidates);
      const resolvedAttrName = resolved.name || fallbackName;
      getPanel().find('#dice-attr-name').val(resolvedAttrName).trigger('change');
    };

    const executePresetQuickAction = async (actionId: string): Promise<void> => {
      const preset = ctx.getCurrentAdvancedPreset();
      if (!preset) {
        if (window.toastr) window.toastr.warning('请先选择一个检定预设');
        return;
      }
      const action = getPresetQuickActions(preset).find(item => item.id === actionId);
      if (!action) {
        if (window.toastr) window.toastr.warning('未找到快捷操作配置');
        return;
      }
      if (action.kind === 'workflow_shortcut') {
        activatePresetQuickAction(action);
        return;
      }
      if (action.kind === 'attr_shortcut') {
        executeAttrShortcutQuickAction(action);
        return;
      }
      if (window.toastr) window.toastr.warning('暂不支持的快捷操作类型');
    };

    // [新增] 资源消耗器按钮渲染辅助函数

  return {
    renderPresetQuickActions,
    executePresetQuickAction,
    getPresetQuickActions,
  };
}
