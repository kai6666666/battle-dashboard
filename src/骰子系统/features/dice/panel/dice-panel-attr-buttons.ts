// @child-factory（由父模块 show-dice-panel 实例化，不参与 index 接线审计）
/**
 * dice-panel-attr-buttons.ts
 * 从 show-dice-panel.ts 拆出：角色快捷按钮 / 属性快捷按钮 /
 * 目标值随骰型自动转换 / 规则模式（普通-工作流）切换。
 */
import { showActionableErrorToast } from '../../../shared/actionable-error-toast';

export function createDicePanelAttrButtons(deps: any, ctx: any) {
  const { $ } = deps.getCore();
  const getPanel = ctx && typeof ctx.getPanel === 'function' ? ctx.getPanel : () => null;
    // [新增] 构建角色快捷按钮
    const buildCharButtons = () => {
      const $container = getPanel().find('#dice-char-buttons');
      let html = '';

      // [新增] 如果从MVU面板调用，添加从路径解析的发起者备选
      if (ctx.getFromMvu() && ctx.getMvuParsedInfo() && ctx.getMvuParsedInfo().initiator) {
        const initiator = ctx.getMvuParsedInfo().initiator;
        const shortName = initiator.length > 4 ? initiator.substring(0, 4) + '..' : initiator;
        html += `<button type="button" class="acu-dice-char-btn acu-dice-char-btn-mvu" data-char="${deps.escapeHtml(initiator)}" title="从变量路径提取: ${deps.escapeHtml(initiator)}">${deps.escapeHtml(shortName)}</button>`;
      }

      // 添加常规角色列表（所有名字统一处理，不再区分 <user>）
      ctx.getDiceCharacterList().forEach(name => {
        const resolvedName = deps.resolveCanonicalCharacterName(String(name));
        const displayName = deps.replaceUserPlaceholders(String(resolvedName));
        const shortName = displayName.length > 4 ? displayName.substring(0, 4) + '..' : displayName;
        html += `<button type="button" class="acu-dice-char-btn" data-char="${deps.escapeHtml(String(resolvedName))}" title="${deps.escapeHtml(displayName)}">${deps.escapeHtml(shortName)}</button>`;
      });

      // [新增] 如果从MVU面板调用，添加其他候选（如果有）
      if (ctx.getFromMvu() && ctx.getMvuParsedInfo() && ctx.getMvuParsedInfo().candidates && ctx.getMvuParsedInfo().candidates.length > 0) {
        ctx.getMvuParsedInfo().candidates.forEach(candidate => {
          // 跳过已经添加的发起者
          if (ctx.getMvuParsedInfo().initiator && candidate === ctx.getMvuParsedInfo().initiator) return;
          const shortName = candidate.length > 4 ? candidate.substring(0, 4) + '..' : candidate;
          html += `<button type="button" class="acu-dice-char-btn acu-dice-char-btn-mvu-candidate" data-char="${deps.escapeHtml(candidate)}" title="从变量路径提取: ${deps.escapeHtml(candidate)}">${deps.escapeHtml(shortName)}</button>`;
        });
      }

      $container.html(html || `<div class="acu-dice-empty-hint">无角色数据</div>`);
      // 绑定点击事件
      $container.find('.acu-dice-char-btn').click(function () {
        const charName = $(this).data('char');
        getPanel().find('#dice-initiator-name').val(charName).trigger('change');
      });
    };

    // [新增] 构建属性快捷按钮
    const buildAttrButtons = charName => {
      const $container = getPanel().find('#dice-attr-buttons');
      const $parentSection = $container.parent(); // 获取包含标题的父容器
      const attrs = deps.getFullAttributesForCharacter(charName);

      // 始终显示区域（即使没有属性数据，也要显示生成按钮）
      $parentSection.show();

      let html = '';

      // [新增] 如果从MVU面板调用，添加从路径解析的属性名备选
      if (ctx.getFromMvu() && ctx.getMvuParsedInfo() && ctx.getMvuParsedInfo().attrName) {
        const attrName = ctx.getMvuParsedInfo().attrName;
        // 尝试从当前角色获取该属性的值
        const attrValue = deps.getAttributeValue(charName, attrName) || ctx.getTargetValue() || '';
        if (attrValue) {
          html += `<button type="button" class="acu-dice-attr-btn acu-dice-attr-btn-mvu" data-name="${deps.escapeHtml(attrName)}" data-value="${attrValue}" data-source="generic" title="从变量路径提取: ${deps.escapeHtml(attrName)}">${deps.escapeHtml(attrName)}:${attrValue}</button>`;
        } else {
          // 即使没有值也显示，用户可以手动填入
          html += `<button type="button" class="acu-dice-attr-btn acu-dice-attr-btn-mvu" data-name="${deps.escapeHtml(attrName)}" data-value="" data-source="generic" title="从变量路径提取: ${deps.escapeHtml(attrName)}">${deps.escapeHtml(attrName)}</button>`;
        }
      }

      // 现有属性按钮
      attrs.forEach(attr => {
        html += `<button type="button" class="acu-dice-attr-btn" data-name="${deps.escapeHtml(attr.name)}" data-value="${attr.value}" data-source="${deps.escapeHtml(attr.source || 'generic')}">${deps.escapeHtml(attr.name)}:${attr.value}</button>`;
      });

      // 生成属性按钮（始终显示）
      html += `<button type="button" class="acu-dice-gen-attr-btn" aria-label="为当前角色生成属性" title="为当前角色生成属性"><i class="fa-solid fa-dice"></i></button>`;

      // 清空属性按钮
      html += `<button type="button" class="acu-dice-clear-attr-btn" aria-label="清空当前规则的属性" title="清空当前规则的属性（保留自定义属性）"><i class="fa-solid fa-trash-alt"></i></button>`;

      $container.html(html);

      // 绑定属性按钮点击事件
      $container.find('.acu-dice-attr-btn').click(function () {
        const attrName = $(this).data('name');
        const attrValue = $(this).data('value');
        const attrSource = String($(this).attr('data-source') || 'generic') as CharacterAttributeSource;

        // 填入属性名
        // 使用 change 触发提交态刷新，避免输入中每字符重绘导致焦点丢失
        const $attrNameInput = getPanel().find('#dice-attr-name');
        $attrNameInput.val(attrName).trigger('change');

        const target = deps.resolveQuickSelectTarget(attrName, attrSource, ctx.getCurrentAdvancedPreset(), 'normal');
        const targetField = deps.getNormalQuickSelectInputSelector(target);

        getPanel().find(targetField).val(attrValue);

        // [新增] 如果处于自定义模式,同时填入目标值
        if (getPanel().find('#acu-dice-custom-mode-fields').is(':visible')) {
          getPanel().find('#custom-target-value').val(attrValue);
        }

        // [修复] 只填入对应字段，不自动填写DC
        // DC留空时会在检定时根据预设的defaultValue处理
        // - COC模式：DC = 属性值
        // - DND模式：DC = 10（或预设的默认值）

        // 触发change事件以更新相关UI
        getPanel().find(targetField).trigger('change');
      });

      // 绑定生成属性按钮点击事件
      $container.find('.acu-dice-gen-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        // 禁用按钮防止重复点击
        $btn.prop('disabled', true).css('opacity', '0.5');
        const originalHtml = $btn.html();
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

        // [修复] 临时禁用更新处理器，防止闪烁
        const originalHandler = deps.UpdateController.handleUpdate;
        deps.UpdateController.handleUpdate = () => {
          console.log('[DICE]ACU 属性生成中，跳过自动刷新');
        };

        try {
          const charName = getPanel().find('#dice-initiator-name').val().trim() || '<user>';

          console.log('[DICE]ACU 生成属性 for:', charName);

          // 生成属性（使用激活的预设）
          const generated = deps.generateRPGAttributes();

          // 兼容旧格式和新格式
          const baseAttrs = generated.base || generated;
          const specialAttrs = generated.special || {};

          // [修复] 分别写入基础属性和特有属性到对应的列
          const result = await deps.writeAttributesToCharacter(charName, baseAttrs, false, specialAttrs);

          if (result.success) {
            // 刷新属性按钮
            buildAttrButtons(charName);
          }
        } catch (err) {
          console.error('[DICE]ACU 生成属性失败:', err);
          if (window.toastr)
            showActionableErrorToast('生成属性失败，未能把随机属性写回角色表。', {
              suggestion: '请确认当前角色存在、属性列可写，并刷新表格数据后重试。',
            });
        } finally {
          // [修复] 恢复更新处理器
          deps.UpdateController.handleUpdate = originalHandler;
          $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
        }
      });

      // 绑定清空属性按钮点击事件
      $container.find('.acu-dice-clear-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        const charName = getPanel().find('#dice-initiator-name').val().trim() || '<user>';

        // 禁用按钮防止重复点击
        $btn.prop('disabled', true).css('opacity', '0.5');
        const originalHtml = $btn.html();
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

        // 临时禁用更新处理器
        const originalHandler = deps.UpdateController.handleUpdate;
        deps.UpdateController.handleUpdate = () => {
          console.log('[DICE]ACU 清空属性中，跳过自动刷新');
        };

        try {
          console.log('[DICE]ACU 清空属性 for:', charName);

          const result = await deps.clearPresetAttributesForCharacter(charName);

          if (result.success) {
            // 刷新属性按钮
            buildAttrButtons(charName);
          }
        } catch (err) {
          console.error('[DICE]ACU 清空属性失败:', err);
          if (window.toastr)
            showActionableErrorToast('清空属性失败，未能把角色属性列清空。', {
              suggestion: '请确认当前角色存在、属性列可写，并刷新表格数据后重试。',
            });
        } finally {
          // 恢复更新处理器
          deps.UpdateController.handleUpdate = originalHandler;
          $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
        }
      });
    };

    // 初始化角色按钮
    buildCharButtons();
    // 初始化属性按钮（默认主角）
    buildAttrButtons(ctx.getDiceCharacterList()[0] || '<user>');
    // [新增] 随机技能按钮点击事件
    getPanel().find('#dice-random-skill').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      const skillPool = deps.getRandomSkillPool();
      const randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      getPanel().find('#dice-attr-name').val(randomSkill).trigger('change');
    });

    // 初始化自定义下拉菜单
    deps.initCustomDropdown(getPanel().find('#dice-initiator-name'), ctx.getDiceCharacterList());
    deps.initCustomDropdown(getPanel().find('#dice-attr-name'), ctx.getDiceAttrList());
    // [新增] 添加清除按钮
    deps.addClearButton(
      getPanel(),
      '#dice-initiator-name, #dice-attr-name, #dice-attr-value, #dice-skill-mod, #dice-target, #dice-modifier, #custom-dice-expr, #custom-target-value',
    );

    // [修复] 角色变化时更新属性列表和快捷按钮
    getPanel().find('#dice-initiator-name').on('change.acuattr input.acuattr', function () {
      const charName = $(this).val().trim() || '<user>';
      const newAttrList = deps.getAttributesForCharacter(charName);
      deps.initCustomDropdown(getPanel().find('#dice-attr-name'), newAttrList.length > 0 ? newAttrList : ctx.getDiceAttrList());

      // [新增] 更新属性快捷按钮
      buildAttrButtons(charName);
    });

    // [新增] 属性名变化时自动填入属性值
    getPanel().find('#dice-attr-name').on('change.acuval', function () {
      const charName = getPanel().find('#dice-initiator-name').val().trim() || '<user>';
      const attrName = $(this).val().trim();
      const attrEntry = deps.getAttributeEntryForCharacter(charName, attrName);
      if (attrEntry) {
        const target = deps.resolveQuickSelectTarget(attrEntry.name, attrEntry.source, ctx.getCurrentAdvancedPreset(), 'normal');
        const targetField = deps.getNormalQuickSelectInputSelector(target);
        getPanel().find(targetField).val(attrEntry.value).trigger('change');
        // [修复] 不自动填写DC，让检定时根据预设的defaultValue处理
      }
    });

    // [修复] 根据骰子类型自动转换目标值
    const convertTargetForDice = (currentTarget, fromDice, toDice) => {
      if (!currentTarget || currentTarget === '') return '';
      const val = parseInt(currentTarget, 10);
      if (isNaN(val)) return currentTarget;

      // 获取骰子最大值
      const getMaxRoll = dice => {
        const match = dice.match(/(\d+)d(\d+)/i);
        if (!match) return 100;
        return parseInt(match[1], 10) * parseInt(match[2], 10);
      };

      const fromMax = getMaxRoll(fromDice);
      const toMax = getMaxRoll(toDice);

      // 按比例转换
      const ratio = val / fromMax;
      const newVal = Math.round(ratio * toMax);
      return Math.max(0, Math.min(newVal, toMax));
    };

    // [重写] 成功标准切换时更新 UI（COC/DND 模式切换）
    const updateRuleMode = () => {
      const criteria = getPanel().find('#dice-success-criteria').val();
      const isDND = criteria === 'gte';
      const $targetInput = getPanel().find('#dice-target');
      const $difficultyWrapper = getPanel().find('#dice-difficulty-wrapper');
      const $row3 = getPanel().find('#dice-row-3');

      if (isDND) {
        // DND 模式
        $targetInput.attr('placeholder', '留空=10');
        getPanel().find('#dice-target-label').text('DC');
        $difficultyWrapper.hide();
        $row3.css('grid-template-columns', '1fr 1fr');
      } else {
        // COC 模式
        $targetInput.attr('placeholder', '留空=属性值');
        getPanel().find('#dice-target-label').text('目标值');
        $difficultyWrapper.show();
        $row3.css('grid-template-columns', '1fr 1fr 1fr');
      }
    };

    getPanel().find('#dice-success-criteria').on('change', updateRuleMode);


  return {
    buildAttrButtons,
    updateRuleMode,
    buildCharButtons,
  };
}
