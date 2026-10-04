// @child-factory（由父模块 show-dice-panel 实例化，不参与 index 接线审计）
/**
 * dice-panel-apply-preset.ts
 * 从 show-dice-panel.ts 拆出：高级预设应用中枢 applyAdvancedPreset（含行布局恢复辅助函数）。
 */
export function createDicePanelApplyPreset(deps: any, ctx: any) {
  const dicePanelEffectInputs = ctx.effectInputs;
  const dicePanelAttrButtons = ctx.attrButtons;
  const dicePanelQuickActions = ctx.quickActions;
    const applyAdvancedPreset = (presetId: string | null) => {
      const panel = ctx.getPanel();
      // 获取关键DOM元素
      const $modWrapper = panel.find('#dice-mod-wrapper');
      const $row1 = panel.find('#dice-row-1');
      const $row2 = panel.find('#dice-row-2');
      const $row3 = panel.find('#dice-row-3');
      const $customArea = panel.find('#dice-custom-fields-area');
      const $attrWrapper = panel.find('#dice-attr-wrapper');
      const $targetWrapper = panel.find('#dice-target-wrapper');
      const $skillModWrapper = panel.find('#dice-skill-mod-wrapper');
      const $nameWrapper = panel.find('#dice-name-wrapper');
      const $attrNameWrapper = panel.find('#dice-attr-name-wrapper');

      // 辅助函数: 恢复 Row 1 的名字和属性名
      const restoreRow1 = () => {
        if ($nameWrapper.parent().attr('id') !== 'dice-row-1') {
          $nameWrapper.detach().prependTo($row1);
        }
        if ($attrNameWrapper.parent().attr('id') !== 'dice-row-1') {
          $attrNameWrapper.detach().appendTo($row1);
        }
        $nameWrapper.show();
        $attrNameWrapper.show();
        $row1.show();
        // 恢复为2列布局
        $row1.removeClass('cols-2 cols-3').addClass('cols-2');
      };

      // 辅助函数: 确保修正值输入框回到原来的位置
      const restoreModifier = () => {
        if ($modWrapper.parent().attr('id') !== 'dice-row-3') {
          $modWrapper.detach().appendTo($row3);
        }
        $modWrapper.show();
        panel.find('#dice-mod-label').text('修正值'); // 恢复默认标签
        panel.find('#dice-modifier').attr('placeholder', '留空=0');
      };

      // 辅助函数: 恢复 Row 2 的属性值、技能加值和目标值
      const restoreRow2 = () => {
        if ($attrWrapper.parent().attr('id') !== 'dice-row-2') {
          $attrWrapper.detach().prependTo($row2);
        }
        if ($skillModWrapper.parent().attr('id') !== 'dice-row-2') {
          $skillModWrapper.detach().insertAfter($attrWrapper);
        }
        if ($targetWrapper.parent().attr('id') !== 'dice-row-2') {
          $targetWrapper.detach().appendTo($row2);
        }
        $attrWrapper.show();
        $skillModWrapper.hide(); // 默认隐藏，由预设控制显示
        $targetWrapper.show();
        $row2.show();
      };

      if (!presetId || presetId === '__custom__') {
        // 恢复默认模式 (自定义或无预设)
        ctx.setCurrentAdvancedPreset(null);
        ctx.setLastVisiblePresetId(null);

        // [新增] 显示自定义模式字段区,隐藏预设相关字段
        panel.find('#acu-dice-custom-mode-fields').show();

        // 恢复 Row 1、Row 2 和 Row 3 但隐藏 Row 2/3 (自定义模式使用专属字段)
        restoreRow1();
        restoreRow2();
        restoreModifier();
        $row2.hide();
        $row3.hide();
        panel.find('#dice-difficulty-wrapper').hide();
        panel.find('#dice-success-criteria').closest('div').hide();

        // 清空自定义区域
        $customArea.empty();

        // 恢复"属性名"标签
        panel.find('.dice-attr-name-text').text('属性名');

        // 恢复属性值和目标值输入框
        dicePanelEffectInputs.applyFieldConfig(panel.find('#dice-attr-value'), panel.find('#dice-attr-label'), undefined, {
          label: '属性值',
          placeholder: '留空=50%最大值',
        });

        dicePanelEffectInputs.applyFieldConfig(panel.find('#dice-target'), panel.find('#dice-target-label'), undefined, {
          label: '目标值',
          placeholder: '留空=属性值',
        });

        // 更新按钮高亮
        panel.find('.acu-dice-quick-preset-btn').removeClass('active');
        panel.find('.acu-dice-quick-preset-btn[data-id="__custom__"]').addClass('active');

        panel.find('#dice-normal-presets').show();
        panel.find('#dice-workflow-return-container').hide();

        dicePanelAttrButtons.updateRuleMode();
        dicePanelQuickActions.renderPresetQuickActions(null);
        return;
      }

      const preset = deps.AdvancedDicePresetManager.getAllPresets().find(p => p.id === presetId);
      if (!preset) {
        console.warn('[DICE] 未找到预设:', presetId);
        // 回退到自定义模式
        applyAdvancedPreset('__custom__');
        return;
      }

      ctx.setCurrentAdvancedPreset(preset);
      if (preset.visible !== false) {
        ctx.setLastVisiblePresetId(preset.id);
      }

      // 更新按钮高亮
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      panel.find(`.acu-dice-quick-preset-btn[data-id="${deps.escapeHtml(preset.id)}"]`).addClass('active');

      // 隐藏自定义输入框
      // [新增] 隐藏自定义模式字段区
      panel.find('#acu-dice-custom-mode-fields').hide();

      // 更新骰子表达式
      panel.find('#dice-formula').val(preset.diceExpression);

      // 更新"属性名"标签（如Fate使用"技能/风格"）
      panel.find('.dice-attr-name-text').text(preset.attributeName?.label || '属性名');

      // 隐藏原始 Row 1、Row 2 和 Row 3 (所有字段将整合到 customArea 中)
      restoreRow1();
      restoreRow2();
      restoreModifier();
      $row1.hide();
      $row2.hide();
      $row3.hide();

      // 清空自定义区域
      $customArea.empty();

      // [重构] 收集所有可见字段，统一使用智能布局
      const gridItems: (JQuery | string)[] = [];

      // 0. 名字 (始终显示)
      gridItems.push($nameWrapper);

      // 0.5 属性名 (始终显示)
      gridItems.push($attrNameWrapper);

      // 1. 属性值 (如果未隐藏)
      if (!preset.attribute?.hidden) {
        dicePanelEffectInputs.applyFieldConfig(panel.find('#dice-attr-value'), panel.find('#dice-attr-label'), preset.attribute, {
          label: '属性值',
          placeholder: '留空=50%最大值',
        });
        gridItems.push($attrWrapper);
      }

      // 1.5 技能加值 (如果预设定义了 skillMod 且未隐藏)
      if (preset.skillMod && !preset.skillMod.hidden) {
        dicePanelEffectInputs.applyFieldConfig(panel.find('#dice-skill-mod'), panel.find('#dice-skill-mod-label'), preset.skillMod, {
          label: '技能加值',
          placeholder: '留空=0',
        });
        gridItems.push($skillModWrapper);
      }

      // [新增] 效果输入区域
      const attrName = panel.find('#dice-attr-name').val().trim();
      const effectInputItems = dicePanelEffectInputs.renderEffectInputs(preset, attrName);
      if (effectInputItems.length > 0) {
        gridItems.push(...effectInputItems);
      }

      // 2. 目标值/DC (如果未隐藏)
      if (!preset.dc?.hidden) {
        dicePanelEffectInputs.applyFieldConfig(panel.find('#dice-target'), panel.find('#dice-target-label'), preset.dc, {
          label: '目标值',
          placeholder: '留空=属性值',
        });
        gridItems.push($targetWrapper);
      }

      // 3. 修正值 (如果未隐藏)
      if (!preset.mod?.hidden) {
        if (preset.mod?.label) {
          panel.find('#dice-mod-label').text(preset.mod.label);
        }
        // 使用 placeholder 显示默认值
        const modDefault = preset.mod?.defaultValue;
        if (modDefault !== undefined && modDefault !== 0) {
          panel.find('#dice-modifier').attr('placeholder', `留空=${modDefault}`);
        } else {
          panel.find('#dice-modifier').attr('placeholder', '留空=0');
        }
        gridItems.push($modWrapper);
      }

      // 4. 收集自定义字段
      if ('customFields' in preset && Array.isArray(preset.customFields) && preset.customFields.length > 0) {
        const visibleFields = preset.customFields.filter(f => !f.hidden);

        visibleFields.forEach(field => {
          let html = '<div>';

          // 标签
          if (field.type !== 'toggle') {
            html += `<div class="acu-dice-form-label">${deps.escapeHtml(field.label || field.id)}</div>`;
          } else {
            html += '<div class="acu-dice-form-label">&nbsp;</div>'; // 占位
          }

          // 控件
          if (field.type === 'select' && field.options) {
            html += `<select class="acu-dice-select acu-dice-custom-field" data-id="${deps.escapeHtml(field.id)}">`;
            field.options.forEach(opt => {
              const isSelected = opt.value === field.defaultValue ? 'selected' : '';
              html += `<option value="${deps.escapeHtml(String(opt.value))}" ${isSelected}>${deps.escapeHtml(opt.label)}</option>`;
            });
            html += '</select>';
          } else if (field.type === 'toggle') {
            const isChecked = field.defaultValue ? 'checked' : '';
            html += `<label style="display: flex; align-items: center; cursor: pointer; height: 32px;">
              <input type="checkbox" class="acu-dice-custom-field" data-id="${deps.escapeHtml(field.id)}" ${isChecked} style="margin-right: 8px;">
              ${deps.escapeHtml(field.label || field.id)}
            </label>`;
          } else {
            const type = field.type === 'number' ? 'number' : 'text';
            // [修复] 使用 placeholder 而不是 value 显示默认值
            const defaultVal = field.defaultValue;
            const placeholderText =
              field.placeholder || (defaultVal !== undefined && defaultVal !== '' ? `留空=${defaultVal}` : '');
            html += `<input type="${type}" class="acu-dice-input acu-dice-custom-field" data-id="${deps.escapeHtml(field.id)}"
              placeholder="${deps.escapeHtml(placeholderText)}">`;
          }

          html += '</div>';
          gridItems.push(html);
        });
      }

      // 5. 智能排版渲染网格
      // 布局规律：最后一行优先放3个字段，前面的行放2个字段
      // - 4个字段：2+2
      // - 5个字段：2+3
      // - 6个字段：3+3
      // - 7个字段：2+2+3
      // - 8个字段：2+3+3
      // - 9个字段：3+3+3
      const appendItem = ($row: JQuery, item: JQuery | string) => {
        if (typeof item === 'string') {
          $row.append(item);
        } else {
          item.detach().appendTo($row);
          item.show();
        }
      };

      // 计算行分配：从后往前，优先用3列填充
      const computeRowLayout = (total: number): number[] => {
        if (total <= 0) return [];
        if (total <= 2) return [2]; // 最少2列，避免 cols-1
        if (total === 3) return [3];
        if (total === 4) return [2, 2];
        if (total === 5) return [2, 3];
        if (total === 6) return [3, 3];
        // 7+ 字段：递归计算，最后一行放3个，剩余的递归处理
        return [...computeRowLayout(total - 3), 3];
      };

      // 直接计算 gridItems 的行分配
      const gridRowLayout = computeRowLayout(gridItems.length);

      let itemIndex = 0;
      for (const colCount of gridRowLayout) {
        const $row = $(`<div class="acu-dice-form-row cols-${colCount}"></div>`);
        for (let j = 0; j < colCount; j++) {
          if (itemIndex < gridItems.length) {
            appendItem($row, gridItems[itemIndex]);
            itemIndex++;
          } else {
            $row.append('<div></div>');
          }
        }
        $customArea.append($row);
      }

      // [新增] 为动态生成的 customFields 输入框添加清除按钮
      deps.addClearButton($customArea, '.acu-dice-custom-field[type="text"], .acu-dice-custom-field[type="number"]');

      dicePanelQuickActions.renderPresetQuickActions(preset);

      // [核心修复] 检测是否为“工作流模式”并切换 UI 状态
      // 这里的判定逻辑：如果预设是“非默认可见”的（visible: false），则视为特殊工作流（如技能成长）
      // 此时隐藏常规预设切换按钮，显示“返回常规检定”按钮
      const isWorkMode = preset.visible === false;
      const $normalPresets = panel.find('#dice-normal-presets');
      const $workflowReturn = panel.find('#dice-workflow-return-container');

      if (isWorkMode) {
        $normalPresets.hide();
        $workflowReturn.show();
        $workflowReturn
          .find('button')
          .html(`<i class="fa-solid fa-arrow-left"></i> 返回常规检定（退出${deps.escapeHtml(preset.name)}）`);
      } else {
        $normalPresets.show();
        $workflowReturn.hide();
      }

      console.log('[DICE] 应用高级预设:', preset.name, isWorkMode ? '(工作流模式)' : '');
    };

  return {
    applyAdvancedPreset,
  };
}
