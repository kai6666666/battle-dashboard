/**
 * contest / contest-panel-buttons.ts — 对抗面板：角色/属性按钮簇（从 show-contest-panel.ts 拆出，x8-b）。
 */
import { showActionableErrorToast } from '../../../shared/actionable-error-toast';

type CharacterAttributeSource = string;

export function createContestPanelButtons(ctx: any) {
  const { deps, $, getPanel, getContestAttrTargetInput, characterList } = ctx;

  const buildAttrButtons = (attrs: any, targetType: any) => {
    let html = '';
    // 现有属性按钮
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      html +=
        '<button type="button" class="acu-contest-attr-btn" data-val="' +
        attr.value +
        '" data-aname="' +
        deps.escapeHtml(attr.name) +
        '" data-type="' +
        targetType +
        '">' +
        deps.escapeHtml(attr.name) +
        ': ' +
        attr.value +
        '</button>';
    }
    // 生成属性按钮（始终显示）
    html +=
      '<button type="button" class="acu-contest-gen-attr-btn" data-type="' +
      targetType +
      '" aria-label="生成属性" title="生成属性"><i class="fa-solid fa-dice"></i></button>';
    // 清空属性按钮
    html +=
      '<button type="button" class="acu-contest-clear-attr-btn" data-type="' +
      targetType +
      '" aria-label="清空规则属性" title="清空规则属性"><i class="fa-solid fa-trash-alt"></i></button>';
    return html;
  };

  const buildCharBtns = (targetType: any) => {
    const containerId = targetType === 'init' ? '#contest-init-char-buttons' : '#contest-opp-char-buttons';
    const $container = getPanel().find(containerId);
    let html = '';
    characterList.forEach((name: any) => {
      const resolvedName = deps.resolveCanonicalCharacterName(String(name));
      const displayName = deps.replaceUserPlaceholders(String(resolvedName));
      const shortName = displayName.length > 4 ? displayName.substring(0, 4) + '..' : displayName;
      html +=
        '<button type="button" class="acu-dice-char-btn" data-char="' +
        deps.escapeHtml(String(resolvedName)) +
        '" data-type="' +
        targetType +
        '" title="' +
        deps.escapeHtml(displayName) +
        '">' +
        deps.escapeHtml(shortName) +
        '</button>';
    });
    $container.html(html);
    $container.find('.acu-dice-char-btn').click(function (this: any, e: any) {
      e.preventDefault();
      e.stopPropagation();
      const charName = $(this).data('char');
      const type = $(this).data('type');
      if (type === 'init') {
        getPanel().find('#contest-init-display').val(charName).trigger('change');
      } else {
        getPanel().find('#contest-opponent-display').val(charName).trigger('change');
      }
    });
  };

  const rebuildAttrBtns = (attrs: any, targetType: any) => {
    const containerId = targetType === 'init' ? '#init-attr-buttons' : '#opp-attr-buttons';
    const $container = getPanel().find(containerId);

    // 始终显示容器（即使没有属性数据，也要显示生成按钮）
    $container.show();

    let html = '';

    // 现有属性按钮
    if (attrs.length > 0) {
      attrs.forEach((attr: any) => {
        html +=
          '<button type="button" class="acu-contest-attr-btn" data-val="' +
          attr.value +
          '" data-aname="' +
          deps.escapeHtml(attr.name) +
          '" data-source="' +
          deps.escapeHtml(attr.source || 'generic') +
          '" data-type="' +
          targetType +
          '">' +
          deps.escapeHtml(attr.name) +
          ':' +
          attr.value +
          '</button>';
      });
    }

    // 生成属性按钮
    html +=
      '<button type="button" class="acu-contest-gen-attr-btn" data-type="' +
      targetType +
      '" aria-label="生成属性" title="生成属性"><i class="fa-solid fa-dice"></i></button>';

    // 清空属性按钮
    html +=
      '<button type="button" class="acu-contest-clear-attr-btn" data-type="' +
      targetType +
      '" aria-label="清空规则属性" title="清空规则属性"><i class="fa-solid fa-trash-alt"></i></button>';

    $container.html(html);

    // 绑定属性按钮点击事件
    $container.find('.acu-contest-attr-btn').click(function (this: any) {
      const val = $(this).attr('data-val');
      const aname = $(this).attr('data-aname');
      const source = String($(this).attr('data-source') || 'generic') as CharacterAttributeSource;
      const type = $(this).attr('data-type');

      if (type === 'init') {
        const targetInput = getContestAttrTargetInput('init', aname || '', source);
        getPanel().find(targetInput).val(val);
        getPanel().find('#contest-init-name').val(aname);
        getPanel().find(targetInput).trigger('change');
      } else {
        const targetInput = getContestAttrTargetInput('opp', aname || '', source);
        getPanel().find(targetInput).val(val);
        getPanel().find('#contest-opp-name').val(aname);
        getPanel().find(targetInput).trigger('change');
      }
    });

    // 绑定生成属性按钮点击事件
    $container.find('.acu-contest-gen-attr-btn').click(async function (this: any, e: any) {
      e.preventDefault();
      e.stopPropagation();

      const $btn = $(this);
      if ($btn.prop('disabled')) return;

      const type = $btn.attr('data-type');

      // 禁用按钮防止重复点击
      $btn.prop('disabled', true).css('opacity', '0.5');
      const originalHtml = $btn.html();
      $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

      // [修复] 临时禁用更新处理器，防止闪烁
      const originalHandler = deps.UpdateController.handleUpdate;
      deps.UpdateController.handleUpdate = () => {
        console.log('[DICE]ACU 对抗属性生成中，跳过自动刷新');
      };

      try {
        // 获取角色名
        let charName;
        if (type === 'init') {
          charName = getPanel().find('#contest-init-display').val().trim() || '<user>';
        } else {
          charName = getPanel().find('#contest-opponent-display').val().trim();
        }

        if (!charName) {
          if (window.toastr) window.toastr.warning('请先选择角色');
          return;
        }

        console.log('[DICE]ACU 对抗面板生成属性 for:', charName, 'type:', type);

        // 生成属性（使用激活的预设）
        const generated = deps.generateRPGAttributes();

        // 兼容旧格式和新格式
        const baseAttrs = generated.base || generated;
        const specialAttrs = generated.special || {};

        // [修复] 分别写入基础属性和特有属性到对应的列
        const result = await deps.writeAttributesToCharacter(charName, baseAttrs, false, specialAttrs);

        if (result.success) {
          // 刷新该方属性按钮
          const refreshedAttrs = deps.getFullAttributesForCharacter(charName);
          rebuildAttrBtns(refreshedAttrs, type);
        }
      } catch (err) {
        console.error('[DICE]ACU 对抗面板生成属性失败:', err);
        if (window.toastr)
          showActionableErrorToast('生成属性失败，未能把随机属性写回对抗角色表。', {
            suggestion: '请确认对应角色存在、属性列可写，并刷新表格数据后重试。',
          });
      } finally {
        // [修复] 恢复更新处理器
        deps.UpdateController.handleUpdate = originalHandler;
        $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
      }
    });

    // 绑定清空属性按钮点击事件
    $container.find('.acu-contest-clear-attr-btn').click(async function (this: any, e: any) {
      e.preventDefault();
      e.stopPropagation();

      const $btn = $(this);
      if ($btn.prop('disabled')) return;

      const type = $btn.attr('data-type');

      // 获取角色名
      let charName;
      if (type === 'init') {
        charName = getPanel().find('#contest-init-display').val().trim() || '<user>';
      } else {
        charName = getPanel().find('#contest-opponent-display').val().trim();
      }

      if (!charName) {
        if (window.toastr) window.toastr.warning('请先选择角色');
        return;
      }

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
        console.log('[DICE]ACU 对抗面板清空属性 for:', charName, 'type:', type);

        const result = await deps.clearPresetAttributesForCharacter(charName);

        if (result.success) {
          // 刷新该方属性按钮
          const refreshedAttrs = deps.getFullAttributesForCharacter(charName);
          rebuildAttrBtns(refreshedAttrs, type);
        }
      } catch (err) {
        console.error('[DICE]ACU 对抗面板清空属性失败:', err);
        if (window.toastr)
          showActionableErrorToast('清空属性失败，未能清空对抗角色的属性列。', {
            suggestion: '请确认对应角色存在、属性列可写，并刷新表格数据后重试。',
          });
      } finally {
        // 恢复更新处理器
        deps.UpdateController.handleUpdate = originalHandler;
        $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
      }
    });
  };

  return { buildAttrButtons, buildCharBtns, rebuildAttrBtns };
}
