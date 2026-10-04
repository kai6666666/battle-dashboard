// @child-factory（由父模块 show-dice-panel 实例化，不参与 index 接线审计）
/**
 * dice-panel-resource-burner.ts
 * 从 show-dice-panel.ts 拆出：资源燃烧簇（燃运等）
 * —— 结果区按钮渲染 / 点击入口 / 输入弹窗 / 生效与二次效果。
 */
import { showActionableErrorToast } from '../../../shared/actionable-error-toast';

export function createDicePanelResourceBurner(deps: any, ctx: any) {
  const getPanel = ctx && typeof ctx.getPanel === 'function' ? ctx.getPanel : () => null;
  const refreshAttrButtons = ctx && typeof ctx.buildAttrButtons === 'function' ? ctx.buildAttrButtons : () => {};
    const renderResourceBurnerButtons = (
      preset: AdvancedDicePreset,
      context: Record<string, number>,
      matchedOutcome?: OutcomeLevel,
      attrName?: string,
    ): string => {
      if (!preset.resourceBurners || !Array.isArray(preset.resourceBurners) || preset.resourceBurners.length === 0) {
        return '';
      }

      let html = '';
      preset.resourceBurners.forEach(burner => {
        // 1. 首先检查 selector 过滤（结构性范围控制）
        if (attrName && burner.selector) {
          const selectorMatch = ctx.matchesCheckSelector(attrName, burner.selector);
          if (!selectorMatch) {
            return; // 属性名被 selector 排除
          }
        }

        // 2. 然后检查 condition（动态状态控制）
        if (burner.condition) {
          const evalResult = deps.evaluateCondition(burner.condition, context);
          if (
            !evalResult.success ||
            (typeof evalResult.value === 'number' ? evalResult.value === 0 : !evalResult.value)
          ) {
            return;
          }
        }
        const icon = burner.ui?.icon || 'fa-fire';
        const tooltip = burner.ui?.tooltip || `消耗 ${burner.resourceName}`;

        html += `<button type="button" class="acu-dice-burner-btn" data-id="${deps.escapeHtml(burner.id)}" title="${deps.escapeHtml(tooltip)}">
          <i class="fa-solid ${deps.escapeHtml(icon)}"></i>
        </button>`;
      });

      return html ? `<div class="acu-dice-burners">${html}</div>` : '';
    };

    // [新增] 资源消耗器点击处理函数
    const handleResourceBurnerClick = (burner: ResourceBurner, context: Record<string, number>) => {
      // 获取角色名：保留原始值用于数据操作，解析后的值用于显示
      const rawInitiatorName = getPanel().find('#dice-initiator-name').val().trim() || '<user>';
      const displayName = deps.replaceUserPlaceholders(rawInitiatorName);

      // 获取当前资源值（使用原始值，让 getAttributeValue 内部判断是否是主角）
      let currentResource = deps.getAttributeValue(rawInitiatorName, burner.resourceName);

      // 如果资源不存在，尝试初始化（仅限幸运值）
      if (currentResource === undefined || currentResource === null) {
        if (burner.resourceName === '幸运' || burner.resourceName.toLowerCase() === 'luck') {
          // CoC7 幸运值初始化：3D6 × 5
          const d1 = Math.floor(Math.random() * 6) + 1;
          const d2 = Math.floor(Math.random() * 6) + 1;
          const d3 = Math.floor(Math.random() * 6) + 1;
          const initialLuck = (d1 + d2 + d3) * 5;

          if (window.toastr) {
            window.toastr.info(`幸运值未设置，已随机生成: ${d1}+${d2}+${d3}=${d1 + d2 + d3} × 5 = ${initialLuck}`);
          }

          // 尝试写入初始值（使用原始值，让函数内部判断是否是主角）
          deps.updateSingleAttribute(rawInitiatorName, burner.resourceName, 'set', initialLuck, {
            initValue: initialLuck,
          }).then(result => {
            if (result.success) {
              // 递归调用自己，现在资源已存在
              handleResourceBurnerClick(burner, context);
            } else {
              if (window.toastr)
                showActionableErrorToast(`初始化幸运值失败: ${result.error}`, {
                  suggestion: '请确认角色表存在可写的幸运值/资源属性；如果表格结构正确仍失败，请查看控制台中的属性写入日志。',
                });
            }
          });
          return;
        } else {
          if (window.toastr)
            showActionableErrorToast(`找不到属性「${burner.resourceName}」，无法执行资源消耗。`, {
              suggestion: '请确认属性预设或角色表中存在这个资源属性；如果这是新资源，请先在属性表里创建或启用初始化。',
            });
          return;
        }
      }

      currentResource = currentResource || 0;

      // 创建自定义对话框（传递原始名字用于数据操作）
      showBurnerInputDialog(burner, rawInitiatorName, currentResource, context);
    };

    // [新增] 显示燃运输入对话框
    const showBurnerInputDialog = (
      burner: ResourceBurner,
      rawCharName: string, // 原始角色名（如 <user>），用于数据操作
      currentResource: number,
      context: Record<string, number>,
    ) => {
      const currentThemeClass = `acu-theme-${deps.getConfig().theme}`;

      // 移除已存在的对话框
      $('.acu-burner-overlay').remove();

      // 计算建议消耗量（如果预设定义了 suggestedAmount 表达式）
      let suggestedValue = 1; // 默认为1
      let suggestedHint = '';
      if (burner.suggestedAmount) {
        const evalResult = deps.evaluateCondition(burner.suggestedAmount, context);
        if (evalResult.success && typeof evalResult.value === 'number' && evalResult.value > 0) {
          // 向上取整（需要至少这么多资源才刚好通过），再除以ratio
          const rawNeeded = Math.ceil(evalResult.value / burner.ratio);
          if (burner.resourceOperation === 'add') {
            suggestedValue = Math.max(1, rawNeeded);
            suggestedHint = `建议: ${suggestedValue} (刚好通过)`;
          } else {
            const capped = Math.min(Math.max(1, rawNeeded), currentResource);
            suggestedValue = capped;
            if (rawNeeded > currentResource) {
              suggestedHint = `建议: ${suggestedValue} (已达上限，仍无法通过)`;
            } else {
              suggestedHint = `建议: ${suggestedValue} (刚好通过)`;
            }
          }
        }
      }

      const isAddMode = burner.resourceOperation === 'add';
      const actionVerb = isAddMode ? '增加' : '消耗';
      const maxAttr = isAddMode ? '' : `max="${currentResource}"`;

      // 从 context 提取骰子结果和目标值，用于效果预览
      const rollTotal = (context['$roll.total'] ?? context['$roll'] ?? 0) as number;
      const attrValue = (context['$attr'] ?? 0) as number;

      const dialog = $(`
        <div class="acu-edit-overlay acu-burner-overlay">
          <div class="acu-edit-dialog ${currentThemeClass}" style="max-width:350px;">
            <div class="acu-edit-title">
              <i class="fa-solid ${deps.escapeHtml(burner.ui?.icon || 'fa-fire')}" style="color:${deps.escapeHtml(burner.ui?.color || 'var(--acu-accent)')}"></i>
              ${deps.escapeHtml(actionVerb)} ${deps.escapeHtml(burner.resourceName)}
            </div>
            <div class="acu-settings-content" style="padding:15px;">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                <div style="flex:1;">
                  <label style="display:block;font-size:11px;color:var(--acu-text-sub);margin-bottom:4px;">${deps.escapeHtml(actionVerb)}数量</label>
                  <input type="number" id="burner-amount" class="acu-input" value="${suggestedValue}" min="1" ${maxAttr} style="width:100%;">
                  ${suggestedHint ? `<div style="font-size:10px;color:var(--acu-accent);margin-top:2px;">${deps.escapeHtml(suggestedHint)}</div>` : ''}
                </div>
                <div style="flex:1;">
                  <label style="display:block;font-size:11px;color:var(--acu-text-sub);margin-bottom:4px;">当前${isAddMode ? '数值' : '可用'}</label>
                  <div style="font-size:18px;font-weight:bold;color:var(--acu-success-text);">${currentResource}</div>
                </div>
              </div>
              <div id="burner-preview" style="padding:10px;background:var(--acu-card-bg);border-radius:6px;font-size:12px;">
                <div id="burner-before" style="color:var(--acu-text-sub);margin-bottom:6px;"></div>
                <div id="burner-after" style="font-weight:bold;"></div>
              </div>
            </div>
            <div class="acu-dialog-btns">
              <button class="acu-dialog-btn" id="burner-cancel"><i class="fa-solid fa-times"></i> 取消</button>
              <button class="acu-dialog-btn acu-btn-confirm" id="burner-confirm"><i class="fa-solid fa-check"></i> 确认${deps.escapeHtml(actionVerb)}</button>
            </div>
          </div>
        </div>
      `);

      $('body').append(dialog);

      // 更新效果预览：显示燃运前后的骰子结果对比
      const updatePreview = () => {
        const amount = parseInt(dialog.find('#burner-amount').val() as string, 10) || 0;
        const effectValue = amount * burner.ratio;
        // 计算燃运后的目标值变化
        let newRoll = rollTotal;
        let newAttr = attrValue;
        if (burner.target === 'roll') {
          newRoll = burner.direction === 'decrease' ? rollTotal - effectValue : rollTotal + effectValue;
        } else if (burner.target === 'attribute') {
          newAttr = burner.direction === 'increase' ? attrValue + effectValue : attrValue - effectValue;
        }
        const beforePass = rollTotal <= attrValue;
        const afterPass = newRoll <= newAttr;
        const beforeColor = beforePass ? 'var(--acu-success-text)' : 'var(--acu-error-text)';
        const afterColor = afterPass ? 'var(--acu-success-text)' : 'var(--acu-error-text)';
        dialog
          .find('#burner-before')
          .html(
            `当前: <span style="color:${beforeColor};font-weight:bold;">${rollTotal} &lt;= ${attrValue} → ${beforePass ? '成功' : '失败'}</span>`,
          );
        dialog
          .find('#burner-after')
          .html(
            `燃运后: <span style="color:${afterColor}">${newRoll} &lt;= ${newAttr} → ${afterPass ? '成功' : '失败'}</span>` +
              `<span style="color:var(--acu-text-sub);font-weight:normal;margin-left:8px;">(${actionVerb} ${amount} 点${burner.resourceName})</span>`,
          );
      };
      updatePreview();

      dialog.find('#burner-amount').on('input', updatePreview);

      // 取消按钮
      dialog.on('click', '#burner-cancel', () => {
        dialog.remove();
      });

      // 点击遮罩关闭
      dialog.on('click', '.acu-burner-overlay', e => {
        if ($(e.target).hasClass('acu-burner-overlay')) {
          dialog.remove();
        }
      });

      // 确认按钮
      dialog.on('click', '#burner-confirm', () => {
        const amount = parseInt(dialog.find('#burner-amount').val() as string, 10);

        if (isNaN(amount) || amount <= 0) {
          if (window.toastr) window.toastr.warning('请输入有效的正整数');
          return;
        }

        // subtract 模式检查资源上限，add 模式不限
        if (!isAddMode && amount > currentResource) {
          if (window.toastr)
            showActionableErrorToast(`资源不足: 需要 ${amount}，当前只有 ${currentResource}。`, {
              suggestion: 'resource',
            });
          return;
        }

        dialog.remove();

        const op: 'add' | 'subtract' = isAddMode ? 'add' : 'subtract';
        // 执行资源变更（使用原始角色名，让函数内部判断是否是主角）
        deps.updateSingleAttribute(rawCharName, burner.resourceName, op, amount).then(result => {
          if (!result.success) {
            if (window.toastr)
              showActionableErrorToast(`${actionVerb}资源失败: ${result.error}`, {
                suggestion: '请确认角色表中的资源属性可写，并刷新属性数据后重试；如果仍失败，请查看控制台中的属性写入日志。',
              });
            return;
          }

          if (window.toastr) window.toastr.success(`已${actionVerb} ${amount} 点 ${burner.resourceName}`);

          // 刷新属性显示（使用原始角色名）
          refreshAttrButtons(rawCharName);

          // 应用效果并重新计算结果
          applyBurnerEffect(burner, amount);
        });
      });

      // 聚焦输入框
      dialog.find('#burner-amount').trigger('focus').trigger('select');
    };

    // [新增] 显示效果确认对话框
    const checkSecondaryEffects = async (
      preset: AdvancedDicePreset,
      effectResults: EffectResult[],
      context: { characterName: string; attributeName: string; attributeValue: number },
    ): Promise<EffectResult[]> => {
      return deps.executeSecondaryEffectsChain(preset, effectResults, context);
    };

    // [新增] 应用消耗效果并更新 UI
    const applyBurnerEffect = (burner: ResourceBurner, amount: number) => {
      const effectValue = amount * burner.ratio;
      const sign = burner.direction === 'increase' ? 1 : -1;
      const totalChange = effectValue * sign;

      // 修改相应的输入框值或预设值
      // 注意: 这会改变下一次投骰的基础值，或者如果是 roll 修正则需要特殊处理
      // 这里我们选择直接修改输入框的值，并触发重新计算
      // 对于 target (roll), 我们无法直接修改已投出的结果，除非重新 evaluateOutcomes
      // 但 evaluateOutcomes 接受的是 outcomes 数组，不直接接受 rollTotal
      // 简单的做法是：修改 modifier 输入框 (对于 mod 修正) 或 target 输入框 (对于 dc 修正)
      // 对于 roll 修正，我们可以添加一个临时的 modifier

      // 为了简单可靠，我们先支持 mod 和 dc 的修改，因为它们对应输入框
      if (burner.target === 'mod') {
        const $modInput = getPanel().find('#dice-modifier');
        const currentMod = ctx.parseModifier($modInput.val().trim());
        const newMod = currentMod + totalChange;
        $modInput.val(newMod >= 0 ? `+${newMod}` : String(newMod));
        // 重新执行高级检定 (会重新投骰吗? 是的，performAdvancedCheck 会重新投骰)
        // 如果不想重新投骰，我们需要拆分 performAdvancedCheck
        // 但目前的架构是整体执行的。
        // 为了"改变结果"而不"重投"，我们需要一种机制来只更新结果判定逻辑
        // 这是一个架构限制。
        // 妥协方案: 消耗资源后，自动触发一次带修正的"重投" (即改变了修正值后的投骰)
        // 这符合"燃运"通常的逻辑：付出代价来获得更有利的结果
        ctx.performAdvancedCheck();
      } else if (burner.target === 'dc') {
        const $dcInput = getPanel().find('#dice-target');
        const currentDc = parseInt($dcInput.val().trim() || '0', 10);
        const newDc = currentDc + totalChange;
        $dcInput.val(newDc);
        ctx.performAdvancedCheck();
      } else if (burner.target === 'attribute') {
        // 修改属性值输入框
        const $attrInput = getPanel().find('#dice-attr-value');
        const currentAttr = parseInt($attrInput.val().trim() || '0', 10);
        const newAttr = currentAttr + totalChange;
        $attrInput.val(newAttr);
        ctx.performAdvancedCheck();
      } else if (burner.target === 'roll') {
        // 修改 roll 值通常意味着作为 modifier 加在最终结果上
        // 因为我们不能修改骰子本身的随机结果
        const $modInput = getPanel().find('#dice-modifier');
        const currentMod = ctx.parseModifier($modInput.val().trim());
        const newMod = currentMod + totalChange;
        $modInput.val(newMod >= 0 ? `+${newMod}` : String(newMod));
        ctx.performAdvancedCheck();
      }
    };

    // [新增] 高级检定执行函数

  return {
    renderResourceBurnerButtons,
    handleResourceBurnerClick,
  };
}
