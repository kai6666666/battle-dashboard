/**
 * contest / apply-advanced-preset.ts — 对抗面板「应用进阶预设」逻辑（从 show-contest-panel.ts 拆出）。
 */
export const createApplyContestAdvancedPreset = (ctx) => {
  const { deps, $, panel, setCurrentContestAdvancedPreset } = ctx;
  const applyContestAdvancedPreset = (presetId: string | null) => {
      // 获取关键DOM元素 - 使用新的wrapper ID
      const $initValuesRow = panel.find('#contest-init-values-row');
      const $oppValuesRow = panel.find('#contest-opp-values-row');
      const $initPrimaryRow = panel.find('#contest-init-primary-row');
      const $oppPrimaryRow = panel.find('#contest-opp-primary-row');
      const $initCustomFields = panel.find('#contest-init-custom-fields');
      const $oppCustomFields = panel.find('#contest-opp-custom-fields');

      const $initAttrWrapper = panel.find('#contest-init-attr-wrapper');
      const $initSkillModWrapper = panel.find('#contest-init-skill-mod-wrapper');
      const $initModWrapper = panel.find('#contest-init-mod-wrapper');
      const $initTargetWrapper = panel.find('#contest-init-target-wrapper');
      const $oppAttrWrapper = panel.find('#contest-opp-attr-wrapper');
      const $oppSkillModWrapper = panel.find('#contest-opp-skill-mod-wrapper');
      const $oppModWrapper = panel.find('#contest-opp-mod-wrapper');
      const $oppTargetWrapper = panel.find('#contest-opp-target-wrapper');

      const $initAttrLabel = panel.find('#contest-init-attr-label');
      const $initSkillModLabel = panel.find('#contest-init-skill-mod-label');
      const $oppAttrLabel = panel.find('#contest-opp-attr-label');
      const $oppSkillModLabel = panel.find('#contest-opp-skill-mod-label');
      const $initTargetLabel = panel.find('#contest-init-target-label');
      const $oppTargetLabel = panel.find('#contest-opp-target-label');
      const $initModLabel = panel.find('#contest-init-mod-label');
      const $oppModLabel = panel.find('#contest-opp-mod-label');

      const $initAttrInput = panel.find('#contest-init-value');
      const $oppAttrInput = panel.find('#contest-opp-value');
      const $initSkillModInput = panel.find('#contest-init-skill-mod');
      const $oppSkillModInput = panel.find('#contest-opp-skill-mod');
      const $initModInput = panel.find('#contest-init-mod');
      const $oppModInput = panel.find('#contest-opp-mod');

      // 辅助函数：更新值行的列数
      const updateRowColumns = ($row: JQuery, visibleCount: number) => {
        $row.removeClass('cols-2 cols-3');
        if (visibleCount <= 2) {
          $row.addClass('cols-2');
        } else {
          $row.addClass('cols-3');
        }
      };

      const buildContestCustomFieldCell = (
        field: Record<string, unknown>,
        party: 'init' | 'opp',
        extraClass = '',
      ): JQuery => {
        const fieldId = String(field.id || '');
        const fieldLabel = String(field.label || fieldId);
        const fieldType = String(field.type || 'text');
        let html = `<div class="${extraClass}">`;

        if (fieldType !== 'toggle') {
          html += `<div class="acu-dice-form-label">${deps.escapeHtml(fieldLabel)}</div>`;
        } else {
          html += '<div class="acu-dice-form-label">&nbsp;</div>';
        }

        if (fieldType === 'select' && Array.isArray(field.options)) {
          html += `<select class="acu-dice-select acu-dice-custom-field-contest" data-id="${deps.escapeHtml(fieldId)}" data-party="${party}">`;
          field.options.forEach(option => {
            const opt = option as Record<string, unknown>;
            const optValue = opt.value;
            const isSelected = optValue === field.defaultValue ? 'selected' : '';
            html += `<option value="${deps.escapeHtml(String(optValue ?? ''))}" ${isSelected}>${deps.escapeHtml(String(opt.label ?? optValue ?? ''))}</option>`;
          });
          html += '</select>';
        } else if (fieldType === 'toggle') {
          const isChecked = field.defaultValue ? 'checked' : '';
          html += `<label style="display: flex; align-items: center; cursor: pointer; height: 32px;">
            <input type="checkbox" class="acu-dice-custom-field-contest" data-id="${deps.escapeHtml(fieldId)}" data-party="${party}" ${isChecked} style="margin-right: 8px;">
            ${deps.escapeHtml(fieldLabel)}
          </label>`;
        } else {
          const inputType = fieldType === 'number' ? 'number' : 'text';
          const defaultVal = field.defaultValue;
          const placeholderText =
            String(field.placeholder || '') ||
            (defaultVal !== undefined && defaultVal !== '' ? `留空=${defaultVal}` : '');
          html += `<input type="${inputType}" class="acu-dice-input acu-dice-custom-field-contest" data-id="${deps.escapeHtml(fieldId)}" data-party="${party}" placeholder="${deps.escapeHtml(placeholderText)}">`;
        }

        html += '</div>';
        return $(html);
      };

      // 辅助函数：渲染customFields
      const renderCustomFields = (
        $container: JQuery,
        party: 'init' | 'opp',
        preset: AdvancedDicePreset | LegacyAdvancedDicePreset,
      ) => {
        $container.empty();

        if (!('customFields' in preset) || !Array.isArray(preset.customFields) || preset.customFields.length === 0) {
          return;
        }

        // 应用 contestOverride 配置，过滤隐藏字段
        const visibleFields = preset.customFields.map(f => ({ ...f, ...f.contestOverride })).filter(f => !f.hidden);
        if (visibleFields.length === 0) return;

        const gridItems: string[] = visibleFields.map(field =>
          buildContestCustomFieldCell(field, party).prop('outerHTML'),
        );

        // 智能排版渲染网格
        // 布局规律：最后一行优先放3个字段，前面的行放2个字段
        // - 4个字段：2+2
        // - 5个字段：2+3
        // - 6个字段：3+3
        // - 7个字段：2+2+3
        // - 8个字段：2+3+3
        // - 9个字段：3+3+3
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

        const rowLayout = computeRowLayout(gridItems.length);
        let itemIndex = 0;
        for (const colCount of rowLayout) {
          const $row = $(`<div class="acu-dice-form-row cols-${colCount}"></div>`);
          for (let j = 0; j < colCount; j++) {
            if (itemIndex < gridItems.length) {
              $row.append(gridItems[itemIndex]);
              itemIndex++;
            } else {
              $row.append('<div></div>');
            }
          }
          $container.append($row);
        }
      };

      const restoreDefaults = () => {
        // 恢复标签
        $initAttrLabel.text('属性值');
        $oppAttrLabel.text('属性值');
        $initSkillModLabel.text('技能加值');
        $oppSkillModLabel.text('技能加值');
        $initTargetLabel.text('目标值');
        $oppTargetLabel.text('目标值');
        $initModLabel.text('修正值');
        $oppModLabel.text('修正值');

        // 恢复"属性名"标签
        panel.find('.contest-attr-name-text').text('属性名');

        // 恢复所有字段显示
        $initAttrWrapper.show();
        $oppAttrWrapper.show();
        $initSkillModWrapper.hide();
        $oppSkillModWrapper.hide();
        $initTargetWrapper.show();
        $oppTargetWrapper.show();
        $initModWrapper.show();
        $oppModWrapper.show();

        // 恢复默认placeholder
        $initAttrInput.attr('placeholder', '留空=50%最大值');
        $oppAttrInput.attr('placeholder', '留空=50%最大值');
        $initSkillModInput.attr('placeholder', '留空=0');
        $oppSkillModInput.attr('placeholder', '留空=0');
        $initModInput.attr('placeholder', '留空=0');
        $oppModInput.attr('placeholder', '留空=0');

        // 重建值行结构（移除可能嵌入的customFields）
        const rebuildDefaultRow = (
          $row: JQuery,
          $attrWrapper: JQuery,
          $skillWrapper: JQuery,
          $modWrapper: JQuery,
          $targetWrapper: JQuery,
        ) => {
          // 移除所有非原始wrapper的元素
          $row.children().not($attrWrapper).not($skillWrapper).not($modWrapper).not($targetWrapper).remove();
          // 确保原始wrapper在行中且顺序正确
          if ($attrWrapper.parent()[0] !== $row[0]) $attrWrapper.detach().appendTo($row);
          if ($skillWrapper.parent()[0] !== $row[0]) $skillWrapper.detach().appendTo($row);
          if ($modWrapper.parent()[0] !== $row[0]) $modWrapper.detach().appendTo($row);
          if ($targetWrapper.parent()[0] !== $row[0]) $targetWrapper.detach().appendTo($row);
          // 恢复正确顺序
          $row.append($attrWrapper.detach());
          $row.append($skillWrapper.detach());
          $row.append($modWrapper.detach());
          $row.append($targetWrapper.detach());
        };

        rebuildDefaultRow($initValuesRow, $initAttrWrapper, $initSkillModWrapper, $initModWrapper, $initTargetWrapper);
        rebuildDefaultRow($oppValuesRow, $oppAttrWrapper, $oppSkillModWrapper, $oppModWrapper, $oppTargetWrapper);

        // 恢复3列布局
        updateRowColumns($initValuesRow, 3);
        updateRowColumns($oppValuesRow, 3);

        // 清空customFields
        $initPrimaryRow.find('.acu-contest-inline-custom').remove();
        $oppPrimaryRow.find('.acu-contest-inline-custom').remove();
        updateRowColumns($initPrimaryRow, 2);
        updateRowColumns($oppPrimaryRow, 2);
        $initCustomFields.empty();
        $oppCustomFields.empty();
      };

      if (!presetId) {
        ctx.setCurrentContestAdvancedPreset(null);
        restoreDefaults();
        return;
      }

      const preset = deps.AdvancedDicePresetManager.getAllPresets().find(p => p.id === presetId);
      if (!preset) {
        console.warn('[DICE] 对抗检定未找到预设:', presetId);
        restoreDefaults();
        return;
      }

      ctx.setCurrentContestAdvancedPreset(preset);

      // [修复] 先恢复默认结构，确保从整合布局切换时字段不会丢失
      restoreDefaults();

      // 获取标签和placeholder配置
      const attrLabel = preset.attribute?.label || '属性值';
      const skillModLabel = preset.skillMod?.label || '技能加值';
      const dcLabel = preset.dc?.label || '目标值';
      const modLabel = preset.mod?.label || '修正值';
      const attrPlaceholder = preset.attribute?.placeholder || '留空=50%最大值';
      const skillModPlaceholder = preset.skillMod?.placeholder || '留空=0';
      const modPlaceholder = preset.mod?.placeholder || '留空=0';

      // 更新标签
      $initAttrLabel.text(attrLabel);
      $oppAttrLabel.text(attrLabel);
      $initSkillModLabel.text(skillModLabel);
      $oppSkillModLabel.text(skillModLabel);
      $initTargetLabel.text(dcLabel);
      $oppTargetLabel.text(dcLabel);
      $initModLabel.text(modLabel);
      $oppModLabel.text(modLabel);

      // 更新"属性名"标签（如Fate使用"技能/风格"）
      panel.find('.contest-attr-name-text').text(preset.attributeName?.label || '属性名');

      // 更新placeholder
      $initAttrInput.attr('placeholder', attrPlaceholder);
      $oppAttrInput.attr('placeholder', attrPlaceholder);
      $initSkillModInput.attr('placeholder', skillModPlaceholder);
      $oppSkillModInput.attr('placeholder', skillModPlaceholder);
      $initModInput.attr('placeholder', modPlaceholder);
      $oppModInput.attr('placeholder', modPlaceholder);

      // 计算可见字段数量
      const hideDcInContest = preset.contestRule?.hideDc === true || preset.dc?.hidden === true;
      const hideModInContest = preset.contestRule?.hideMod === true || preset.mod?.hidden === true;
      const hideSkillModInContest =
        !preset.skillMod || preset.contestRule?.hideSkillMod === true || preset.skillMod.hidden === true;

      // 属性值始终显示
      $initAttrWrapper.show();
      $oppAttrWrapper.show();

      // 控制技能加值显隐
      if (hideSkillModInContest) {
        $initSkillModWrapper.hide();
        $oppSkillModWrapper.hide();
      } else {
        $initSkillModWrapper.show();
        $oppSkillModWrapper.show();
      }

      // 控制目标值显隐
      if (hideDcInContest) {
        $initTargetWrapper.hide();
        $oppTargetWrapper.hide();
      } else {
        $initTargetWrapper.show();
        $oppTargetWrapper.show();
      }

      // 控制修正值显隐
      if (hideModInContest) {
        $initModWrapper.hide();
        $oppModWrapper.hide();
      } else {
        $initModWrapper.show();
        $oppModWrapper.show();
      }

      // [优化] 智能布局：将基础字段和customFields整合计算
      // 收集可见的customFields数量（应用 contestOverride）
      const visibleContestFields =
        'customFields' in preset && Array.isArray(preset.customFields)
          ? preset.customFields.map(f => ({ ...f, ...f.contestOverride })).filter(f => !f.hidden)
          : [];
      const customFieldCount = visibleContestFields.length;

      // 计算基础可见字段数
      let baseVisibleCount = 1; // 属性值始终可见
      if (!hideSkillModInContest) baseVisibleCount++;
      if (!hideModInContest) baseVisibleCount++;
      if (!hideDcInContest) baseVisibleCount++;

      // 决定布局策略
      const totalFields = baseVisibleCount + customFieldCount;

      const useThreeByThreeWithPrimaryRow = customFieldCount === 1 && baseVisibleCount === 3;

      if (useThreeByThreeWithPrimaryRow) {
        const customField = visibleContestFields[0];
        const renderPrimaryInlineField = ($row: JQuery, party: 'init' | 'opp') => {
          $row.find('.acu-contest-inline-custom').remove();
          updateRowColumns($row, 3);
          $row.append(buildContestCustomFieldCell(customField, party, 'acu-contest-inline-custom'));
        };

        renderPrimaryInlineField($initPrimaryRow, 'init');
        renderPrimaryInlineField($oppPrimaryRow, 'opp');
        updateRowColumns($initValuesRow, 3);
        updateRowColumns($oppValuesRow, 3);
        $initCustomFields.empty();
        $oppCustomFields.empty();
      } else {
        $initPrimaryRow.find('.acu-contest-inline-custom').remove();
        $oppPrimaryRow.find('.acu-contest-inline-custom').remove();
        updateRowColumns($initPrimaryRow, 2);
        updateRowColumns($oppPrimaryRow, 2);

        // 如果总字段数 <= 4，尝试将所有内容整合布局
        // 对于 COC7: 1 (技能值) + 3 (奖励骰/惩罚骰/最低成功等级) = 4，使用整合布局
        // 对于 FATE: 2 (技能等级/修正值) + 0 = 2，使用整合布局
        // 对于 DND5e: 3 (属性值/修正值/DC) + 1 (优势/劣势) = 4，使用整合布局
        if (totalFields <= 4 && customFieldCount > 0 && baseVisibleCount < 3) {
          // 将 customFields 嵌入到值行中
          // 首先清空单独的 customFields 容器
          $initCustomFields.empty();
          $oppCustomFields.empty();

          // 重建值行内容，包含 customFields
          const buildIntegratedRow = ($row: JQuery, party: 'init' | 'opp') => {
            // 保留属性值 wrapper
            const $attrWrapper = party === 'init' ? $initAttrWrapper : $oppAttrWrapper;
            const $modWrapper = party === 'init' ? $initModWrapper : $oppModWrapper;
            const $targetWrapper = party === 'init' ? $initTargetWrapper : $oppTargetWrapper;

            // 收集当前可见的元素
            const visibleItems: JQuery[] = [];

            // 先从任意父容器中分离基础 wrapper，避免被后续 empty() 误删
            const $skillWrapper = party === 'init' ? $initSkillModWrapper : $oppSkillModWrapper;

            [$attrWrapper, $skillWrapper, $modWrapper, $targetWrapper].forEach($base => {
              if ($base.length > 0 && $base.parent().length > 0) {
                $base.detach();
              }
            });

            // 属性值始终可见
            visibleItems.push($attrWrapper);

            // 技能加值（如果可见）
            if (!hideSkillModInContest) {
              visibleItems.push($skillWrapper);
            }

            // 修正值（如果可见）
            if (!hideModInContest) {
              visibleItems.push($modWrapper);
            }

            // 目标值（如果可见）
            if (!hideDcInContest) {
              visibleItems.push($targetWrapper);
            }

            // 添加 customFields（应用 contestOverride）
            if ('customFields' in preset && Array.isArray(preset.customFields)) {
              const visibleFields = preset.customFields
                .map(f => ({ ...f, ...f.contestOverride }))
                .filter(f => !f.hidden);
              visibleFields.forEach(field => {
                let html = '<div>';

                // 标签
                if (field.type !== 'toggle') {
                  html += `<div class="acu-dice-form-label">${deps.escapeHtml(field.label || field.id)}</div>`;
                } else {
                  html += '<div class="acu-dice-form-label">&nbsp;</div>';
                }

                // 控件
                if (field.type === 'select' && field.options) {
                  html += `<select class="acu-dice-select acu-dice-custom-field-contest" data-id="${deps.escapeHtml(field.id)}" data-party="${party}">`;
                  field.options.forEach(opt => {
                    const isSelected = opt.value === field.defaultValue ? 'selected' : '';
                    html += `<option value="${deps.escapeHtml(String(opt.value))}" ${isSelected}>${deps.escapeHtml(opt.label)}</option>`;
                  });
                  html += '</select>';
                } else if (field.type === 'toggle') {
                  const isChecked = field.defaultValue ? 'checked' : '';
                  html += `<label style="display: flex; align-items: center; cursor: pointer; height: 32px;">
                  <input type="checkbox" class="acu-dice-custom-field-contest" data-id="${deps.escapeHtml(field.id)}" data-party="${party}" ${isChecked} style="margin-right: 8px;">
                  ${deps.escapeHtml(field.label || field.id)}
                </label>`;
                } else {
                  const type = field.type === 'number' ? 'number' : 'text';
                  // [修复] 使用 placeholder 而不是 value 显示默认值
                  const defaultVal = field.defaultValue;
                  const placeholderText =
                    field.placeholder || (defaultVal !== undefined && defaultVal !== '' ? `留空=${defaultVal}` : '');
                  html += `<input type="${type}" class="acu-dice-input acu-dice-custom-field-contest" data-id="${deps.escapeHtml(field.id)}" data-party="${party}"
                  placeholder="${deps.escapeHtml(placeholderText)}">`;
                }

                html += '</div>';
                visibleItems.push($(html) as JQuery);
              });
            }

            // 清空行和 customFields 容器
            $row.empty();
            const $customContainer = party === 'init' ? $initCustomFields : $oppCustomFields;
            $customContainer.empty();

            // 智能排版：根据字段数量决定布局方式
            // 布局规律：最后一行优先放3个字段，前面的行放2个字段
            // - 4个字段：2+2
            // - 5个字段：2+3
            // - 6个字段：3+3
            // - 7个字段：2+2+3
            // - 8个字段：2+3+3
            // - 9个字段：3+3+3
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

            const appendItemTo = ($target: JQuery, $item: JQuery) => {
              if ($item.parent().length > 0) {
                $item.detach().appendTo($target);
              } else {
                $target.append($item);
              }
            };

            const rowLayout = computeRowLayout(visibleItems.length);
            let itemIndex = 0;

            // 第一行放在 $row 中
            if (rowLayout.length > 0) {
              const firstRowCols = rowLayout[0];
              for (let j = 0; j < firstRowCols; j++) {
                if (itemIndex < visibleItems.length) {
                  appendItemTo($row, visibleItems[itemIndex]);
                  itemIndex++;
                } else {
                  $row.append('<div></div>');
                }
              }
              updateRowColumns($row, firstRowCols);

              // 剩余行放在 $customContainer 中
              for (let rowIdx = 1; rowIdx < rowLayout.length; rowIdx++) {
                const colCount = rowLayout[rowIdx];
                const $gridRow = $(`<div class="acu-dice-form-row cols-${colCount}"></div>`);
                for (let j = 0; j < colCount; j++) {
                  if (itemIndex < visibleItems.length) {
                    appendItemTo($gridRow, visibleItems[itemIndex]);
                    itemIndex++;
                  } else {
                    $gridRow.append('<div></div>');
                  }
                }
                $customContainer.append($gridRow);
              }
            }

            // 不可见基础字段也保留在值行中（隐藏），防止后续切换时 DOM 丢失
            if (hideSkillModInContest) {
              if ($skillWrapper.parent().length === 0 || $skillWrapper.parent()[0] !== $row[0]) {
                $skillWrapper.detach().appendTo($row);
              }
              $skillWrapper.hide();
            }
            if (hideModInContest) {
              if ($modWrapper.parent().length === 0 || $modWrapper.parent()[0] !== $row[0]) {
                $modWrapper.detach().appendTo($row);
              }
              $modWrapper.hide();
            }
            if (hideDcInContest) {
              if ($targetWrapper.parent().length === 0 || $targetWrapper.parent()[0] !== $row[0]) {
                $targetWrapper.detach().appendTo($row);
              }
              $targetWrapper.hide();
            }
          };

          buildIntegratedRow($initValuesRow, 'init');
          buildIntegratedRow($oppValuesRow, 'opp');
        } else {
          // 使用分离布局：基础字段在值行，customFields 在单独区域
          updateRowColumns($initValuesRow, baseVisibleCount);
          updateRowColumns($oppValuesRow, baseVisibleCount);

          // 渲染 customFields 到单独区域
          renderCustomFields($initCustomFields, 'init', preset);
          renderCustomFields($oppCustomFields, 'opp', preset);
        }
      }

      // 防御性兜底：切换预设后确保“修正值”输入框在应显示时不会丢失
      if (!hideSkillModInContest) {
        if ($initSkillModWrapper.parent().length === 0) {
          $initSkillModWrapper.appendTo($initValuesRow);
        }
        if ($oppSkillModWrapper.parent().length === 0) {
          $oppSkillModWrapper.appendTo($oppValuesRow);
        }
        $initSkillModWrapper.show();
        $oppSkillModWrapper.show();
      }

      if (!hideModInContest) {
        if ($initModWrapper.parent().length === 0) {
          $initModWrapper.appendTo($initValuesRow);
        }
        if ($oppModWrapper.parent().length === 0) {
          $oppModWrapper.appendTo($oppValuesRow);
        }
        $initModWrapper.show();
        $oppModWrapper.show();
      }

      // 更新骰子表达式
      panel.find('#contest-dice-type').val(preset.diceExpression);
      panel.find('#contest-custom-dice-init').val(preset.diceExpression);
      panel.find('#contest-custom-dice-opp').val('');
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      // [修复] 根据 presetId 激活正确的按钮，而不是总是激活 custom 按钮
      if (presetId) {
        panel.find(`.acu-dice-quick-preset-btn[data-preset-id="${presetId}"]`).addClass('active');
      }

      // [新增] 为动态生成的 customFields 输入框添加清除按钮
      deps.addClearButton(
        $initCustomFields,
        '.acu-dice-custom-field-contest[type="text"], .acu-dice-custom-field-contest[type="number"]',
      );
      deps.addClearButton(
        $oppCustomFields,
        '.acu-dice-custom-field-contest[type="text"], .acu-dice-custom-field-contest[type="number"]',
      );
      deps.addClearButton(
        $initValuesRow,
        '.acu-dice-custom-field-contest[type="text"], .acu-dice-custom-field-contest[type="number"]',
      );
      deps.addClearButton(
        $oppValuesRow,
        '.acu-dice-custom-field-contest[type="text"], .acu-dice-custom-field-contest[type="number"]',
      );
      deps.addClearButton(
        $initPrimaryRow,
        '.acu-dice-custom-field-contest[type="text"], .acu-dice-custom-field-contest[type="number"]',
      );
      deps.addClearButton(
        $oppPrimaryRow,
        '.acu-dice-custom-field-contest[type="text"], .acu-dice-custom-field-contest[type="number"]',
      );

      console.log(
        '[DICE] 对抗检定应用高级预设:',
        preset.name,
        '总字段数:',
        totalFields,
        '基础字段:',
        baseVisibleCount,
        'customFields:',
        customFieldCount,
      );
  };
  return applyContestAdvancedPreset;
};
