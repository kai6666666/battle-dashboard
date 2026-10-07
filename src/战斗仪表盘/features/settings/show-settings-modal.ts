/**
 * show-settings-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR, PRESET_FORMAT_VERSION, SCRIPT_VERSION } from '../../shared/constants';
import { buildSettingsDialogHtml } from './build-settings-dialog-html';
import { RULE_TYPE_INFO } from '../../shared/defaults-config';
import { Store } from '../../shared/storage/store';
import { normalizeDialogueIndentStrategy } from '../../features/dialogue-indent-renderer';
type AvatarManagerNode = Record<string, any>;
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowSettingsModal(deps: any) {
  const showSettingsModal = (options?: any) => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').not(':has(.acu-settings-dialog)').remove();
    deps.clearModalStack();
    deps.pushModal('showSettingsModal', showSettingsModal);

    deps.setIsSettingsOpen(true);
    const config = deps.getConfig();
    const currentThemeClass = `acu-theme-${config.theme}`;
    const settingsRawData = deps.getCachedRawData() || deps.getTableData();
    const settingsTables = deps.processJsonData(settingsRawData || {});
    const allTableNames = Object.keys(settingsTables);

    // 分组折叠状态（从存储读取，默认第一组展开）
    const expandedGroups = Store.get('acu_settings_expanded', ['appearance']);

    const isGroupExpanded = (groupId: any) => expandedGroups.includes(groupId);
    // 生成导航盘管理列表HTML（包含特殊按钮：仪表盘、投骰、审核、MVU变量）
    const SPECIAL_BUTTONS_CONFIG = [
      { key: '__dashboard__', name: '仪表盘', icon: 'fa-chart-line' },
      { key: '__dice__', name: '投骰', icon: 'fa-dice-d20' },
      { key: '__changes__', name: '变更审核', icon: 'fa-code-compare' },
      { key: '__mvu__', name: 'MVU变量', icon: 'fa-code-branch' },
      { key: '__favorites__', name: '收藏夹', icon: 'fa-star' },
      { key: '__global_interactions__', name: '交互总览', icon: 'fa-hand-pointer' },
    ];

    type TableManagerItem = {
      key: string;
      name: string;
      icon: string;
      isSpecial: boolean;
    };

    type SettingsSegmentOption = {
      value: string;
      label: string;
      title?: string;
    };

    const ENABLE_DISABLE_OPTIONS: readonly SettingsSegmentOption[] = [
      { value: 'enabled', label: '启用' },
      { value: 'disabled', label: '禁用' },
    ];
    const DIALOGUE_INDENT_STRATEGY_OPTIONS: readonly SettingsSegmentOption[] = [
      { value: 'conservative', label: '保守' },
      { value: 'balanced', label: '适中' },
      { value: 'aggressive', label: '激进' },
    ];

    const tableManagerHtml = (() => {
      const savedOrder = deps.getSavedTableOrder() || []; void savedOrder;
      const hiddenList = deps.getHiddenTables();

      // 构建所有可管理项：特殊按钮 + 真实表格
      const allItems: TableManagerItem[] = [];

      // 添加特殊按钮
      SPECIAL_BUTTONS_CONFIG.forEach(btn => {
        // MVU 按钮始终参与管理，让用户可以设置顺序和可见性
        allItems.push({ key: btn.key, name: btn.name, icon: btn.icon, isSpecial: true });
      });

      // 添加真实表格
      allTableNames.forEach(name => {
        allItems.push({ key: name, name: name, icon: deps.getIconForTableName(name), isSpecial: false });
      });

      // 应用保存的排序（与导航条/审核面板共用同一稳定排序工具）
      const sortedKeys = deps.getStableTableSort(allItems.map(item => item.key));
      const stableOrderMap = new Map(sortedKeys.map((k: any, i: any) => [k, i]));
      const orderedItems = [...allItems].sort(
        (a, b) => ((stableOrderMap.get(a.key) as any) ?? 9999) - ((stableOrderMap.get(b.key) as any) ?? 9999),
      );
      deps.ensureCanonicalTableOrder(orderedItems.map(item => item.key));
      return orderedItems
        .map(item => {
          const isHidden = hiddenList.includes(item.key);
          const specialClass = item.isSpecial ? ' acu-special-item' : '';
          const displayName = item.name;
          return (
            '<div class="acu-table-manager-item' +
            specialClass +
            (isHidden ? ' hidden-table' : '') +
            '" data-table-name="' +
            deps.escapeHtml(item.key) +
            '" draggable="false">' +
            '<div class="acu-table-item-check" title="点击切换显示/隐藏">' +
            '<i class="fa-solid ' +
            (isHidden ? 'fa-eye-slash' : 'fa-eye') +
            '"></i>' +
            '</div>' +
            '<div class="acu-table-item-icon"><i class="fa-solid ' +
            item.icon +
            '"></i></div>' +
            '<div class="acu-table-item-name">' +
            deps.escapeHtml(displayName) +
            '</div>' +
            '<div class="acu-table-item-handle" title="拖拽排序">' +
            '<i class="fa-solid fa-grip-vertical"></i>' +
            '</div>' +
            '</div>'
          );
        })
        .join('');
    })();
    const chevron = (groupId: any) => (isGroupExpanded(groupId) ? 'fa-chevron-down' : 'fa-chevron-right');
    const renderSettingSegmented = (
      id: string,
      label: string,
      options: readonly SettingsSegmentOption[],
      selectedValue: string,
    ): string => `
                                <div class="acu-setting-segmented" id="${id}" role="radiogroup" aria-label="${deps.escapeHtml(label)}">
                                    ${options
                                      .map(option => {
                                        const active = option.value === selectedValue;
                                        const title = option.title || option.label;
                                        return `<button type="button" class="acu-setting-segmented-option ${active ? 'active' : ''}" data-value="${deps.escapeHtml(option.value)}" role="radio" aria-checked="${active ? 'true' : 'false'}" title="${deps.escapeHtml(title)}">${deps.escapeHtml(option.label)}</button>`;
                                      })
                                      .join('')}
                                </div>`;

    const dialog = $(buildSettingsDialogHtml({ deps, config, currentThemeClass, allTableNames, chevron, isGroupExpanded, renderSettingSegmented, tableManagerHtml, ENABLE_DISABLE_OPTIONS, DIALOGUE_INDENT_STRATEGY_OPTIONS, RULE_TYPE_INFO, PRESET_FORMAT_VERSION, SCRIPT_VERSION, normalizeDialogueIndentStrategy }));
    $('body').append(dialog);
    // 二级管理弹窗不能留在设置面板的滚动内容里，否则部分移动端浏览器会把 fixed 定位裁进父弹窗。
    dialog.find('.acu-settings-manager-overlay').appendTo(dialog);

    // === 分组折叠交互（带动画） ===
    dialog.find('.acu-settings-group-title').on('click', function (this: any) {
      const $group = $(this).closest('.acu-settings-group');
      const $body = $group.find('.acu-settings-group-body');

      // 防止动画过程中重复点击
      if ($body.hasClass('acu-animating')) return;

      const groupId = $group.data('group');
      const $chevron = $(this).find('.acu-group-chevron');
      let expanded = Store.get('acu_settings_expanded', ['appearance']);

      if ($group.hasClass('collapsed')) {
        // 展开
        $group.removeClass('collapsed');
        $chevron.removeClass('fa-chevron-right').addClass('fa-chevron-down');
        if (!expanded.includes(groupId)) expanded.push(groupId);

        $body.addClass('acu-animating').show();
        const targetHeight = $body.prop('scrollHeight');
        $body.css('height', 0).animate({ height: targetHeight }, 180, function (this: any) {
          $(this).css('height', '').removeClass('acu-animating');
        });
      } else {
        // 收起
        $group.addClass('collapsed');
        $chevron.removeClass('fa-chevron-down').addClass('fa-chevron-right');
        expanded = expanded.filter((id: any) => id !== groupId);

        const currentHeight = $body.outerHeight();
        $body
          .addClass('acu-animating')
          .css('height', currentHeight)
          .animate({ height: 0 }, 180, function (this: any) {
            $(this).hide().css('height', '').removeClass('acu-animating');
          });
      }

      Store.set('acu_settings_expanded', expanded);
    });

    // === 设置项事件绑定 ===
    // 主题
    dialog.find('#cfg-theme').on('change', function (this: any) {
      const newTheme = $(this).val();
      deps.saveConfig({ theme: newTheme });
      dialog.removeClass(deps.THEMES.map((t: any) => `acu-theme-${t.id}`).join(' ')).addClass(`acu-theme-${newTheme}`);
      dialog
        .find('.acu-edit-dialog')
        .removeClass(deps.THEMES.map((t: any) => `acu-theme-${t.id}`).join(' '))
        .addClass(`acu-theme-${newTheme}`);
      deps.scheduleDialogueIndentRender();
    });

    // 字体
    dialog.find('#cfg-font-family').on('change', function (this: any) {
      deps.saveConfig({ fontFamily: $(this).val() });
    });

    // 管理检定预设按钮
    dialog.find('#cfg-advanced-preset-manage').on('click', function (e: any) {
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showPresetListDialog();
    });

    // 管理属性预设按钮
    dialog.find('#cfg-attribute-preset-manage').on('click', function (e: any) {
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showAttributePresetManager();
    });

    // 管理交互规则预设按钮
    dialog.find('#cfg-action-preset-manage').on('click', function (e: any) {
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showActionPresetManager();
    });

    // 管理仪表盘预设按钮
    dialog.find('#cfg-dashboard-preset-manage').on('click', function (e: any) {
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showDashboardPresetManager();
    });

    // 检验当前聊天表格模板
    dialog.find('#cfg-template-inspection').on('click', function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      deps.showTemplateInspectionModal();
    });

    dialog.find('#cfg-custom-table-name-icon-manage').on('click', function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      deps.showCustomTableNameIconManager();
    });

    // 管理渲染预设按钮
    dialog.find('#cfg-render-preset-manage').on('click', function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showRenderPresetManager();
    });

    // 管理模板检验预设按钮
    dialog.find('#cfg-table-template-requirement-preset-manage').on('click', function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showTableTemplateRequirementPresetManager();
    });

    // 管理角色头像预设按钮
    dialog.find('#cfg-avatar-preset-manage').on('click', function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      let nodeArr: AvatarManagerNode[] = [];
      try {
        nodeArr = deps.getCurrentChatAvatarNodes();
      } catch (error) {
        console.warn('[DICE]角色头像预设入口读取当前聊天角色失败，改为打开全局头像库:', error);
      }
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showAvatarManager(nodeArr, undefined, { initialView: 'global' });
    });

    const openSettingsManagerDialog = (selector: string) => {
      const $manager = dialog.find(selector);
      if (!$manager.length) return;
      $manager.prop('hidden', false).attr('aria-hidden', 'false');
      setTimeout(() => {
        $manager.find('.acu-settings-manager-close').trigger('focus');
      }, 0);
    };

    const closeSettingsManagerDialog = ($manager: JQuery<HTMLElement>) => {
      $manager.prop('hidden', true).attr('aria-hidden', 'true');
    };

    dialog.find('#cfg-validation-preset-manage').on('click', function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      openSettingsManagerDialog('#validation-preset-manager-dialog');
    });

    dialog.find('#cfg-regex-preset-manage').on('click', function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      openSettingsManagerDialog('#regex-preset-manager-dialog');
    });

    dialog.find('#cfg-navigation-manage').on('click', function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      openSettingsManagerDialog('#navigation-manager-dialog');
    });

    dialog.on('click', '.acu-settings-manager-close, .acu-settings-manager-backdrop', function (this: any, e: any) {
      e.preventDefault();
      e.stopPropagation();
      closeSettingsManagerDialog($(this).closest('.acu-settings-manager-overlay') as JQuery<HTMLElement>);
    });

    dialog.on('click', '.acu-settings-manager-dialog', function (e: any) {
      e.stopPropagation();
    });

    dialog.on('keydown', function (e: any) {
      if (e.key !== 'Escape') return;
      const $visibleManager = dialog.find('.acu-settings-manager-overlay:not([hidden])').last();
      if (!$visibleManager.length) return;
      e.preventDefault();
      e.stopPropagation();
      closeSettingsManagerDialog($visibleManager as JQuery<HTMLElement>);
    });

    dialog.on('click', '.acu-setting-segmented-option', function (this: any, e: any) {
      e.preventDefault();
      e.stopPropagation();

      const $button = $(this);
      if ($button.prop('disabled')) return;
      const value = String($button.data('value') ?? '');
      const controlId = String($button.closest('.acu-setting-segmented').attr('id') ?? '');
      if (!controlId || !value) return;

      const $group = $button.closest('.acu-setting-segmented');
      $group.find('.acu-setting-segmented-option').removeClass('active').attr('aria-checked', 'false');
      $button.addClass('active').attr('aria-checked', 'true');

      if (controlId === 'cfg-layout') {
        deps.saveConfig({ layout: value });
        dialog.find('#settings-row-horizontal-scrollbar').prop('hidden', value === 'vertical');
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-highlight-updates') {
        deps.saveConfig({ highlightNew: value === 'enabled' });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-dialogue-indent-strategy') {
        deps.saveConfig({ dialogueIndentStrategy: normalizeDialogueIndentStrategy(value) });
        deps.refreshDialogueIndentRender();
        return;
      }
      if (controlId === 'cfg-dialogue-indent-enabled') {
        const enabled = value === 'enabled';
        deps.saveConfig({ dialogueIndentEnabled: enabled });
        dialog.find('#settings-row-dialogue-indent-strategy').prop('hidden', !enabled);
        deps.refreshDialogueIndentRender();
        return;
      }
      if (controlId === 'cfg-horizontal-scrollbar') {
        deps.saveConfig({ showHorizontalScrollbar: value === 'enabled' });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-grid-cols') {
        deps.saveConfig({ gridColumns: value });
        return;
      }
      if (controlId === 'cfg-display-order') {
        deps.setAllTablesReverse(allTableNames, value === 'reverse');
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-desktop-nav-layout') {
        deps.saveConfig({ desktopNavAligned: value === 'aligned' });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-position') {
        deps.saveConfig({ positionMode: value });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-action-pos') {
        deps.saveConfig({ actionsPosition: value });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-col-style') {
        const collapseStyle = deps.normalizeCollapseStyle(value);
        deps.saveConfig({ collapseStyle });
        const $alignRow = dialog.find('#cfg-col-align-row');
        if (collapseStyle === 'pill') $alignRow.removeAttr('style');
        else $alignRow.attr('style', 'display:none;');
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-col-align') {
        deps.saveConfig({ collapseAlign: value });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-option-panel') {
        deps.saveConfig({ showOptionPanel: value === 'enabled' });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-option-click') {
        deps.saveConfig({ clickOptionToAutoSend: value === 'send' });
        return;
      }
      if (controlId === 'cfg-db-toast') {
        deps.saveConfig({ muteDatabaseToasts: value === 'disabled' });
      }
    });
    // === 导航盘管理：点击切换显示/隐藏 ===
    dialog.find('.acu-table-item-check').on('click', function (this: any, e: any) {
      e.stopPropagation();
      const $item = $(this).closest('.acu-table-manager-item');
      const tableName = $item.data('table-name');
      let hiddenList = deps.getHiddenTables();
      const $icon = $(this).find('i');

      if (hiddenList.includes(tableName)) {
        // 显示
        hiddenList = hiddenList.filter((n: any) => n !== tableName);
        $item.removeClass('hidden-table');
        $icon.removeClass('fa-eye-slash').addClass('fa-eye');
      } else {
        // 隐藏
        hiddenList.push(tableName);
        $item.addClass('hidden-table');
        $icon.removeClass('fa-eye').addClass('fa-eye-slash');
      }

      deps.saveHiddenTables(hiddenList);
      deps.renderInterface();
    });

    // === 导航盘管理：拖拽排序 ===
    const $list = dialog.find('#table-manager-list');
    deps.createSortableList({
      container: $list,
      itemSelector: '.acu-table-manager-item',
      handleSelector: '.acu-table-item-handle',
      cancelSelector: '.acu-table-item-check',
      getItemId: (item: any) => {
        const tableName = $(item).data('table-name');
        if (typeof tableName === 'string') return tableName;
        if (tableName !== undefined && tableName !== null) return String(tableName);
        return null;
      },
      onOrderChange: (newOrder: any) => {
        deps.saveTableOrder(newOrder);
      },
    });

    // === Stepper 步进器事件 ===
    dialog.find('.acu-stepper').each(function (this: any) {
      const $stepper = $(this);
      const id = $stepper.data('id');
      const min = parseInt($stepper.data('min'));
      const max = parseInt($stepper.data('max'));
      const step = parseInt($stepper.data('step'));
      const $value = $stepper.find('.acu-stepper-value');

      const updateValue = (newVal: any) => {
        newVal = Math.max(min, Math.min(max, newVal));
        const unit = id === 'cfg-per-page' ? '' : 'px';
        $value.text(newVal + unit);

        // 实时预览
        if (id === 'cfg-width') {
          $(DICE_ROOT_SELECTOR).css('--acu-card-width', newVal + 'px');
          deps.saveConfig({ cardWidth: newVal });
        } else if (id === 'cfg-font-main') {
          $(DICE_ROOT_SELECTOR).css('--acu-font-size', newVal + 'px');
          deps.saveConfig({ fontSize: newVal });
        } else if (id === 'cfg-font-opt') {
          $(`${DICE_ROOT_SELECTOR}, .acu-embedded-options-container`).css('--acu-opt-font-size', newVal + 'px');
          deps.saveConfig({ optionFontSize: newVal });
        } else if (id === 'cfg-font-nav') {
          const navMetrics = deps.getNavigationFontMetrics(newVal);
          $(DICE_ROOT_SELECTOR)
            .css('--acu-nav-button-size', navMetrics.buttonSize + 'px')
            .css('--acu-nav-font-size', navMetrics.fontSize + 'px')
            .css('--acu-nav-icon-size', navMetrics.iconSize + 'px')
            .css('--acu-nav-button-padding-x', navMetrics.paddingX + 'px');
          deps.saveConfig({ navFontSize: navMetrics.fontSize });
        } else if (id === 'cfg-per-page') {
          deps.saveConfig({ itemsPerPage: newVal });
        }
      };

      const getCurrentValue = () => {
        const text = $value.text().replace(/[^\d]/g, '');
        return parseInt(text) || min;
      };

      $stepper.find('.acu-stepper-dec').on('click', function () {
        updateValue(getCurrentValue() - step);
      });

      $stepper.find('.acu-stepper-inc').on('click', function () {
        updateValue(getCurrentValue() + step);
      });
    });

    // === 验证规则：切换启用/禁用（使用事件委托支持动态元素）===
    dialog.on('click', '.acu-rule-toggle', function (this: any, e: any) {
      e.stopPropagation();
      const $toggle = $(this);
      const $item = $toggle.closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const $icon = $toggle.find('i');
      const isCurrentlyActive = $toggle.hasClass('active');

      // 切换状态
      deps.ValidationRuleManager.toggleRuleEnabled(ruleId, !isCurrentlyActive);

      // 更新 UI
      if (isCurrentlyActive) {
        $toggle.removeClass('active');
        $icon.removeClass('fa-toggle-on').addClass('fa-toggle-off');
        $item.addClass('disabled');
      } else {
        $toggle.addClass('active');
        $icon.removeClass('fa-toggle-off').addClass('fa-toggle-on');
        $item.removeClass('disabled');
      }
    });

    // === 验证规则：编辑规则 ===
    dialog.on('click', '#validation-rules-list .acu-rule-edit', function (this: any, e: any) {
      e.stopPropagation();
      const ruleId = $(this).data('rule-id');
      const rule = deps.ValidationRuleManager.getRule(ruleId);
      if (!rule) return;

      // 打开编辑弹窗（保留设置弹窗用于更新列表）
      deps.showAddValidationRuleModal(dialog, ruleId);
    });

    // === 验证规则：删除规则（使用事件委托）===
    dialog.on('click', '#validation-rules-list .acu-rule-delete', async function (this: any, e: any) {
      e.stopPropagation();
      const ruleId = $(this).data('rule-id');
      const $item = $(this).closest('.acu-validation-rule-item');
      const rule = deps.ValidationRuleManager.getRule(ruleId);

      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除验证规则',
        message: `确定要删除规则「${rule?.name || '自定义规则'}」吗？`,
        detail: '删除后需要重新创建或导入规则才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除规则',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        if (deps.ValidationRuleManager.removeCustomRule(ruleId)) {
          $item.fadeOut(200, function (this: any) {
            $(this).remove();
          });
        }
      }
    });

    // === 验证规则：切换拦截状态（使用事件委托）===
    dialog.on('click', '.acu-rule-intercept', function (this: any, e: any) {
      e.stopPropagation();
      const $btn = $(this);
      const ruleId = $btn.data('rule-id');
      const isCurrentlyActive = $btn.hasClass('active');

      if (deps.ValidationRuleManager.toggleRuleIntercept(ruleId, !isCurrentlyActive)) {
        if (isCurrentlyActive) {
          $btn.removeClass('active').attr('title', '点击启用拦截提示（违反时标注）');
        } else {
          $btn.addClass('active').attr('title', '点击关闭拦截提示');
        }
      }
    });

    // === 预设管理事件 ===
    const refreshPresetUI = () => {
      deps.ValidationRuleManager.clearCache();
      const rules = deps.ValidationRuleManager.getAllRules();
      let html = '';
      rules.forEach((rule: any) => {
        const typeInfo = (RULE_TYPE_INFO as Record<string, any>)[rule.ruleType] || { name: rule.ruleType, icon: 'fa-question' };
        const isTableRule = typeInfo.scope === 'table';
        const hasIntercept = rule.intercept;
        html += `
          <div class="acu-validation-rule-item ${rule.enabled ? '' : 'disabled'}" data-rule-id="${deps.escapeHtml(rule.id)}">
            <div class="acu-rule-type-icon" title="${deps.escapeHtml(typeInfo.name)}${isTableRule ? ' (表级)' : ''}">
              <i class="fa-solid ${typeInfo.icon}"></i>
            </div>
            <div class="acu-rule-info">
              <div class="acu-rule-name">${deps.escapeHtml(rule.name)}</div>
              <div class="acu-rule-target">${deps.escapeHtml(rule.targetTable)}${rule.targetColumn ? '.' + deps.escapeHtml(rule.targetColumn) : isTableRule ? ' (整表)' : ''}</div>
            </div>
            <div class="acu-rule-intercept ${hasIntercept ? 'active' : ''}" data-rule-id="${deps.escapeHtml(rule.id)}" title="${hasIntercept ? '点击关闭拦截提示' : '点击启用拦截提示（违反时标注）'}"><i class="fa-solid fa-shield-halved"></i></div>
            <button type="button" class="acu-rule-action acu-rule-edit" data-rule-id="${deps.escapeHtml(rule.id)}" title="编辑此规则" aria-label="编辑此规则"><i class="fa-solid fa-pen"></i></button>
            <div class="acu-rule-toggle ${rule.enabled ? 'active' : ''}" title="点击切换启用/禁用">
              <i class="fa-solid ${rule.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
            </div>
            <button type="button" class="acu-rule-action acu-rule-delete" data-rule-id="${deps.escapeHtml(rule.id)}" title="删除此规则" aria-label="删除此规则"><i class="fa-solid fa-trash"></i></button>
          </div>`;
      });
      dialog.find('#validation-rules-list').html(html);
    };

    // 切换预设
    dialog.find('#preset-select').on('change', function (this: any) {
      if (deps.PresetManager.setActivePreset($(this).val())) {
        refreshPresetUI();
      }
    });

    // 复制预设
    dialog.find('#btn-preset-dup').on('click', function () {
      const preset = deps.PresetManager.getActivePreset();
      if (!preset) return;
      const newPreset = deps.PresetManager.duplicatePreset(preset.id);
      if (newPreset) {
        dialog
          .find('#preset-select')
          .append(`<option value="${deps.escapeHtml(newPreset.id)}">${deps.escapeHtml(newPreset.name)}</option>`);
        dialog.find('#preset-select').val(newPreset.id).trigger('change');
      }
    });

    // 新建预设
    dialog.find('#btn-preset-new').on('click', async function () {
      const name = await deps.showDiceSystemInputDialog({
        title: '新建数据验证预设',
        message: '请输入新预设名称',
        iconClass: 'fa-plus',
        initialValue: '我的预设',
        confirmText: '新建预设',
      });
      if (!name?.trim()) return;
      const newPreset = deps.PresetManager.createPreset(name.trim());
      if (newPreset) {
        dialog
          .find('#preset-select')
          .append(`<option value="${deps.escapeHtml(newPreset.id)}">${deps.escapeHtml(newPreset.name)}</option>`);
        dialog.find('#preset-select').val(newPreset.id).trigger('change');
      }
    });

    // 删除预设
    dialog.find('#btn-preset-del').on('click', async function () {
      const preset = deps.PresetManager.getActivePreset();
      if (!preset) return;
      if (preset.id === 'default') {
        if (window.toastr) window.toastr.warning('默认预设不能删除');
        return;
      }
      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除数据验证预设',
        message: `确定要删除预设「${preset.name}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (!confirmed) return;
      if (deps.PresetManager.deletePreset(preset.id)) {
        dialog.find(`#preset-select option[value="${preset.id}"]`).remove();
        dialog.find('#preset-select').val('default').trigger('change');
      }
    });

    // 导出预设
    dialog.find('#btn-preset-export').on('click', function () {
      const preset = deps.PresetManager.getActivePreset();
      if (!preset) return;
      const json = deps.PresetManager.exportPreset(preset.id);
      if (json) {
        // 同属性预设导出方式一致：优先导出为文件，避免聊天窗口等环境的粘贴长度限制
        try {
          const filename = `acu_validation_preset_${preset.name || preset.id}_${Date.now()}.json`;
          deps.downloadJsonFile(json, filename);
        } catch (e) {
          // 如果浏览器不支持 Blob 下载，则回退到剪贴板/弹窗复制
          navigator.clipboard
            .writeText(json)
            .then(() => {})
            .catch(() => {
              void deps.showDiceSystemInputDialog({
                title: '复制预设 JSON',
                message: '自动复制失败，请手动复制以下内容',
                iconClass: 'fa-copy',
                initialValue: json,
                confirmText: '关闭',
                multiline: true,
                readonly: true,
                hideCancel: true,
              });
            });
        }
      }
    });

    // 导入预设（使用文件选择器）
    dialog.find('#btn-preset-import').on('click', function () {
      void (async () => {
        const selected = await deps.pickTextFile();
        if (!selected) return;
        try {
          const json = selected.text;
          if (!json?.trim()) return;

          // 先解析 JSONC 获取预设名称，检查是否有同名预设
          let parsedData: Record<string, unknown>;
          try {
            parsedData = deps.parseJsoncRecord(json.trim(), '数据验证预设');
          } catch (error) {
            console.error('[DICE]PresetManager JSONC 解析失败:', error);
            if (window.toastr) showActionableErrorToast('JSONC 格式无效', { suggestion: 'importExport' });
            return;
          }

          const parsedPreset = (deps.isRecordValue(parsedData.preset) ? parsedData.preset : null) as Record<string, any> | null;
          const importingName =
            typeof parsedPreset?.name === 'string' && parsedPreset.name.trim()
              ? parsedPreset.name.trim()
              : '导入的预设';
          const existingPresets = deps.PresetManager.getAllPresets();
          const existingNames = existingPresets.map((p: any) => p.name);
          const hasConflict = existingNames.includes(importingName);

          // 执行导入的函数
          const doImport = async (overwrite: boolean, newName?: string) => {
            // 如果需要重命名，修改JSON中的名称
            let finalJson = json.trim();
            if (newName && parsedPreset) {
              parsedPreset.name = newName;
              // 同时生成新的ID避免ID冲突
              parsedPreset.id = `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              finalJson = JSON.stringify(parsedData);
            }

            // 如果是覆盖模式且存在同名预设，先删除旧预设
            if (overwrite && hasConflict) {
              const existingPreset = existingPresets.find((p: any) => p.name === importingName);
              if (existingPreset && existingPreset.id !== 'default') {
                deps.PresetManager.deletePreset(existingPreset.id);
                dialog.find(`#preset-select option[value="${existingPreset.id}"]`).remove();
              }
            }

            const result = deps.PresetManager.importPreset(finalJson, false);
            if (result && result.preset) {
              const newPreset = result.preset;
              dialog
                .find('#preset-select')
                .append(`<option value="${deps.escapeHtml(newPreset.id)}">${deps.escapeHtml(newPreset.name)}</option>`);
              dialog.find('#preset-select').val(newPreset.id).trigger('change');

              // 如果版本较旧，提示用户是否合并
              if (result.needsMerge) {
                const confirmed = await deps.showDiceSystemConfirmDialog({
                  title: '合并默认值',
                  message: '检测到预设版本较旧，是否要合并新版本的默认值？',
                  detail: '这将保留您的自定义规则，并添加新版本中的新规则。',
                  iconClass: 'fa-code-merge',
                  confirmText: '合并默认值',
                  cancelText: '暂不合并',
                  tone: 'warning',
                });
                if (confirmed) {
                  if (deps.PresetManager.mergePresetWithDefaults(newPreset.id)) {
                    refreshPresetUI();
                  } else {
                    if (window.toastr) showActionableErrorToast('合并失败', { title: '预设合并失败', suggestion: 'importExport' });
                  }
                }
              }
            } else {
              if (window.toastr) showActionableErrorToast('导入失败，请检查格式', { suggestion: 'importExport' });
            }
          };

          // 如果有冲突，显示冲突处理弹窗
          if (hasConflict) {
            deps.showPresetConflictDialog({
              presetName: importingName,
              presetType: '数据验证',
              existingNames,
              onOverwrite: () => {
                void doImport(true);
              },
              onRename: (newName: any) => {
                void doImport(false, newName);
              },
              onCancel: () => {},
            });
          } else {
            // 无冲突，直接导入
            await doImport(false);
          }
        } catch (err) {
          console.error('[DICE]PresetManager 导入失败:', err);
          if (window.toastr) showActionableErrorToast('导入失败: ' + deps.getJsonLikeErrorMessage(err), { suggestion: 'importExport' });
        }
      })();
    });

    // 恢复默认预设规则
    dialog.find('#btn-preset-reset').on('click', async function () {
      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '恢复默认预设',
        message: '确定要将默认预设恢复为初始状态吗？',
        detail: '这将删除所有对默认预设的修改。',
        iconClass: 'fa-rotate-left',
        confirmText: '恢复默认',
        cancelText: '取消',
        tone: 'warning',
      });
      if (!confirmed) return;
      if (deps.PresetManager.resetDefaultPreset()) {
        // 如果当前是默认预设，刷新规则列表
        if (deps.PresetManager.getActivePreset()?.id === 'default') {
          refreshPresetUI();
        }
      } else {
        if (window.toastr) showActionableErrorToast('恢复失败', { suggestion: 'save' });
      }
    });

    // === 表格正则规则:切换启用/禁用 ===
    dialog.on('click', '#regex-rules-list .acu-rule-toggle', function (this: any) {
      const $item = $(this).closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const currentState = deps.RegexTransformationManager.getAllRules().find((r: any) => r.id === ruleId)?.enabled;
      const newState = !currentState;
      const rule = deps.RegexTransformationManager.getRule(ruleId); void rule;

      deps.RegexTransformationManager.toggleRuleEnabled(ruleId, newState);

      if (newState) {
      } else {
        toastr.info('规则已禁用');
      }

      deps.refreshRegexRulesList(); // [修复] 局部刷新规则列表,而不是全量重渲染
    });

    // === 表格正则规则：编辑规则 ===
    dialog.on('click', '#regex-rules-list .acu-rule-edit', function (this: any) {
      const $item = $(this).closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const rule = deps.RegexTransformationManager.getRule(ruleId); void rule;
      if (!rule) return;

      // 打开编辑弹窗
      deps.showAddRegexRuleModal(ruleId);
    });

    // === 表格正则规则:删除规则 ===
    dialog.on('click', '#regex-rules-list .acu-rule-delete', async function (this: any) {
      const $item = $(this).closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const rule = deps.RegexTransformationManager.getRule(ruleId); void rule;
      if (!rule) return;

      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除表格正则规则',
        message: `确定要删除规则「${rule.name}」吗？`,
        detail: '删除后需要重新创建或导入规则才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除规则',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        deps.RegexTransformationManager.removeRule(ruleId);
        deps.refreshRegexRulesList(); // [修复] 局部刷新规则列表,而不是全量重渲染
      }
    });

    // === 表格正则预设:切换预设 ===
    dialog.find('#regex-preset-select').on('change', function (this: any) {
      const presetId = $(this).val();
      deps.RegexPresetManager.setActivePreset(String(presetId));

      deps.refreshRegexRulesList(); // [修复] 局部刷新规则列表,而不是全量重渲染
    });

    // === 表格正则预设:复制预设 ===
    dialog.find('#btn-regex-preset-dup').on('click', async function () {
      const currentPreset = deps.RegexPresetManager.getActivePreset();
      if (!currentPreset) return;

      const name = await deps.showDiceSystemInputDialog({
        title: '复制表格正则预设',
        message: '请输入新预设名称',
        iconClass: 'fa-copy',
        initialValue: `${currentPreset.name} (副本)`,
        confirmText: '创建副本',
      });
      if (!name) return;

      const newPreset = deps.RegexPresetManager.createPreset(name, currentPreset.id);
      if (newPreset) {
        // [修复] 刷新预设下拉列表
        const $presetSelect = dialog.find('#regex-preset-select');
        $presetSelect.append(`<option value="${deps.escapeHtml(newPreset.id)}">${deps.escapeHtml(newPreset.name)}</option>`);
        $presetSelect.val(newPreset.id);

        deps.refreshRegexRulesList(); // 刷新规则列表
      } else {
        showActionableErrorToast('预设名称已存在', { suggestion: 'input' });
      }
    });

    // === 表格正则预设:新建预设 ===
    dialog.find('#btn-regex-preset-new').on('click', async function () {
      const name = await deps.showDiceSystemInputDialog({
        title: '新建表格正则预设',
        message: '请输入预设名称',
        iconClass: 'fa-plus',
        placeholder: '预设名称',
        confirmText: '新建预设',
      });
      if (!name) return;

      const newPreset = deps.RegexPresetManager.createPreset(name, null);
      if (newPreset) {
        deps.RegexPresetManager.setActivePreset(newPreset.id);

        // [修复] 刷新预设下拉列表
        const $presetSelect = dialog.find('#regex-preset-select');
        $presetSelect.append(`<option value="${deps.escapeHtml(newPreset.id)}">${deps.escapeHtml(newPreset.name)}</option>`);
        $presetSelect.val(newPreset.id);

        deps.refreshRegexRulesList(); // 刷新规则列表
      } else {
        showActionableErrorToast('预设名称已存在', { suggestion: 'input' });
      }
    });

    // === 表格正则预设:删除预设 ===
    dialog.find('#btn-regex-preset-del').on('click', async function () {
      const currentPreset = deps.RegexPresetManager.getActivePreset();
      if (!currentPreset) return;

      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除表格正则预设',
        message: `确定要删除预设「${currentPreset.name}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        const success = deps.RegexPresetManager.deletePreset(currentPreset.id);
        if (success) {
          // [修复] 刷新预设下拉列表
          const $presetSelect = dialog.find('#regex-preset-select');
          $presetSelect.find(`option[value="${currentPreset.id}"]`).remove();

          // 切换到默认预设
          const defaultPresetId = deps.RegexPresetManager.getActivePreset()?.id;
          if (defaultPresetId) {
            $presetSelect.val(defaultPresetId);
          }

          deps.refreshRegexRulesList(); // 刷新规则列表
        } else {
          showActionableErrorToast('不能删除最后一个预设', { suggestion: 'input' });
        }
      }
    });

    // === 表格正则预设：导出预设 ===
    dialog.find('#btn-regex-preset-export').on('click', function () {
      const currentPreset = deps.RegexPresetManager.getActivePreset();
      if (!currentPreset) return;

      const json = deps.RegexPresetManager.exportPreset(currentPreset.id);
      if (json) {
        deps.downloadJsonFile(json, `regex-preset-${currentPreset.name}-${Date.now()}.json`);
      }
    });

    // === 表格正则预设：导入预设 ===
    dialog.find('#btn-regex-preset-import').on('click', function () {
      void (async () => {
        const selected = await deps.pickTextFile();
        if (!selected) return;
        try {
          const text = selected.text;
          if (!text?.trim()) return;

          // 先解析 JSONC 获取预设名称，检查是否有同名预设
          let parsedData: Record<string, unknown>;
          try {
            parsedData = deps.parseJsoncRecord(text.trim(), '正则预设');
          } catch (error) {
            console.error('[DICE]RegexPresetManager JSONC 解析失败:', error);
            showActionableErrorToast('JSONC 格式无效', { suggestion: 'importExport' });
            return;
          }

          const importingName =
            typeof parsedData.name === 'string' && parsedData.name.trim() ? parsedData.name.trim() : '导入的预设';
          const existingPresets = deps.RegexPresetManager.getAllPresets();
          const existingNames = existingPresets.map((p: any) => p.name);
          const hasConflict = existingNames.includes(importingName);

          // 执行导入的函数
          const doImport = (overwrite: boolean, newName?: string) => {
            // 如果需要重命名，修改JSON中的名称
            let finalJson = text.trim();
            if (newName) {
              parsedData.name = newName;
              // 同时生成新的ID避免ID冲突
              parsedData.id = `regex_preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              finalJson = JSON.stringify(parsedData);
            }

            // 如果是覆盖模式且存在同名预设，先删除旧预设
            if (overwrite && hasConflict) {
              const existingPreset = existingPresets.find((p: any) => p.name === importingName);
              if (existingPreset) {
                // 检查是否不是最后一个预设
                if (existingPresets.length > 1) {
                  deps.RegexPresetManager.deletePreset(existingPreset.id);
                  dialog.find(`#regex-preset-select option[value="${existingPreset.id}"]`).remove();
                }
              }
            }

            const preset = deps.RegexPresetManager.importPreset(finalJson);
            if (preset) {
              // [修复] 刷新预设下拉列表
              const $presetSelect = dialog.find('#regex-preset-select');
              $presetSelect.append(`<option value="${deps.escapeHtml(preset.id)}">${deps.escapeHtml(preset.name)}</option>`);
              $presetSelect.val(preset.id);

              // [修复] 切换到导入的预设并同步规则到实际存储
              deps.RegexPresetManager.setActivePreset(preset.id);
              Store.set(deps.STORAGE_KEY_REGEX_RULES, preset.rules || []);
              deps.RegexTransformationManager.clearCache();

              deps.refreshRegexRulesList(); // 刷新规则列表
            } else {
              showActionableErrorToast('预设格式无效', { suggestion: 'importExport' });
            }
          };

          // 如果有冲突，显示冲突处理弹窗
          if (hasConflict) {
            deps.showPresetConflictDialog({
              presetName: importingName,
              presetType: '表格正则',
              existingNames,
              onOverwrite: () => doImport(true),
              onRename: (newName: any) => doImport(false, newName),
              onCancel: () => {},
            });
          } else {
            // 无冲突，直接导入
            doImport(false);
          }
        } catch (err) {
          showActionableErrorToast('导入失败: ' + deps.getJsonLikeErrorMessage(err), { suggestion: 'importExport' });
        }
      })();
    });

    // === 表格正则预设：恢复默认预设 ===
    dialog.find('#btn-regex-preset-reset').on('click', async function () {
      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '恢复表格正则默认预设',
        message: '确定要恢复默认预设吗？',
        detail: '此操作将清除当前所有正则规则，并恢复为系统内置的默认规则。',
        iconClass: 'fa-rotate-left',
        confirmText: '恢复默认',
        cancelText: '取消',
        tone: 'warning',
      });
      if (!confirmed) return;

      // 重置默认预设的规则为内置规则
      const presets = deps.RegexPresetManager.getAllPresets();
      let defaultPreset = presets.find((p: any) => p.id === 'regex_default');

      if (defaultPreset) {
        // 用内置规则覆盖默认预设
        defaultPreset.rules = JSON.parse(JSON.stringify(deps.BUILTIN_REGEX_RULES.map((r: any) => ({ ...r, builtin: true }))));
        defaultPreset.version = PRESET_FORMAT_VERSION;
        defaultPreset.updatedAt = Date.now();
      } else {
        // 默认预设不存在，创建它
        defaultPreset = {
          id: 'regex_default',
          name: '默认预设',
          description: '系统默认的表格正则预设',
          version: PRESET_FORMAT_VERSION,
          rules: JSON.parse(JSON.stringify(deps.BUILTIN_REGEX_RULES.map((r: any) => ({ ...r, builtin: true })))),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        presets.unshift(defaultPreset);
      }
      deps.RegexPresetManager._save(presets);

      // 切换到默认预设并同步规则
      Store.set(deps.STORAGE_KEY_REGEX_ACTIVE_PRESET, 'regex_default');

      // 强制用内置规则覆盖规则存储
      Store.set(
        deps.STORAGE_KEY_REGEX_RULES,
        JSON.parse(JSON.stringify(deps.BUILTIN_REGEX_RULES.map((r: any) => ({ ...r, builtin: true })))),
      );
      deps.RegexTransformationManager.clearCache();

      // 刷新UI - 重新渲染下拉框选项
      const $presetSelect = dialog.find('#regex-preset-select');
      $presetSelect.empty();
      deps.RegexPresetManager.getAllPresets().forEach((p: any) => {
        const versionSuffix = p.id === 'regex_default' ? ` v${PRESET_FORMAT_VERSION}` : '';
        $presetSelect.append(`<option value="${deps.escapeHtml(p.id)}">${deps.escapeHtml(p.name)}${versionSuffix}</option>`);
      });
      $presetSelect.val('regex_default');
      deps.refreshRegexRulesList();

      toastr.success(`已恢复默认预设，包含 ${deps.BUILTIN_REGEX_RULES.length} 条内置规则`);
    });

    // === 表格正则规则:添加规则 ===
    dialog.find('#btn-add-regex-rule').on('click', function () {
      deps.showAddRegexRuleModal();
    });

    // === 表格正则规则:导入酒馆正则 ===
    dialog.find('#btn-import-tavern-regex').on('click', function () {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.onchange = async e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const text = await file.text();
          if (!text?.trim()) return;

          let parsed;
          try {
            parsed = JSON.parse(text.trim());
          } catch {
            showActionableErrorToast('JSON格式无效', { suggestion: 'importExport' });
            return;
          }

          // 支持单个对象或数组
          const tavernRegexList: TavernRegex[] = Array.isArray(parsed) ? parsed : [parsed];

          // 验证格式：必须有 scriptName 和 findRegex
          if (!tavernRegexList.every(r => (r as any).scriptName && (r as any).findRegex)) {
            showActionableErrorToast('不是有效的酒馆正则格式（需要 scriptName 和 findRegex 字段）', {
              suggestion: '请确认导入文件是 SillyTavern 正则导出 JSON，并包含 scriptName 与 findRegex 字段。',
            });
            return;
          }

          const existingRules = deps.RegexTransformationManager.getAllRules();
          const existingNames = existingRules.map((r: any) => r.name);

          let importedCount = 0;
          let skippedCount = 0;

          // 逐条处理导入
          const processNext = (index: number): void => {
            if (index >= tavernRegexList.length) {
              // 全部处理完成
              deps.refreshRegexRulesList();
              if (skippedCount > 0) {
                toastr.info(`导入完成: ${importedCount} 条成功, ${skippedCount} 条跳过`);
              } else if (importedCount > 0) {
                toastr.success(`成功导入 ${importedCount} 条酒馆正则规则`);
              }
              return;
            }

            const tavernRegex = tavernRegexList[index];
            const convertedRule = deps.convertTavernRegexToRule(tavernRegex);
            const hasConflict = existingNames.includes(convertedRule.name);

            if (hasConflict) {
              // 有冲突，弹窗询问
              deps.showPresetConflictDialog({
                presetName: convertedRule.name,
                presetType: '酒馆正则规则',
                existingNames,
                onOverwrite: () => {
                  // 删除旧规则
                  const oldRule = deps.RegexTransformationManager.getAllRules().find((r: any) => r.name === convertedRule.name);
                  if (oldRule) deps.RegexTransformationManager.removeRule(oldRule.id);
                  deps.RegexTransformationManager.addCustomRule(convertedRule);
                  existingNames.push(convertedRule.name);
                  importedCount++;
                  processNext(index + 1);
                },
                onRename: (newName: any) => {
                  convertedRule.name = newName;
                  convertedRule.id = `tavern_import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                  deps.RegexTransformationManager.addCustomRule(convertedRule);
                  existingNames.push(newName);
                  importedCount++;
                  processNext(index + 1);
                },
                onCancel: () => {
                  skippedCount++;
                  processNext(index + 1);
                },
              });
            } else {
              // 无冲突，直接添加
              deps.RegexTransformationManager.addCustomRule(convertedRule);
              existingNames.push(convertedRule.name);
              importedCount++;
              processNext(index + 1);
            }
          };

          // 开始处理
          processNext(0);
        } catch (err) {
          showActionableErrorToast('导入失败: ' + (err as Error).message, { suggestion: 'importExport' });
        }
      };
      input.click();
    });

    // === 验证规则:添加自定义规则 ===
    dialog.find('#btn-add-validation-rule').on('click', function () {
      deps.showAddValidationRuleModal(dialog);
    });

    // === Debug控制台 ===
    dialog.find('#btn-open-debug-console').on('click', function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showDebugConsoleModal();
    });

    // === 配置方案与备份 ===
    dialog.find('#cfg-config-backup-restore').on('click', function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      deps.showDiceConfigBackupDialog();
    });

    // === 清空本地缓存 ===
    dialog.find('#cfg-clear-local-cache').on('click', function (e: any) {
      e.preventDefault();
      e.stopPropagation();

      deps.showManualUpdateDialog({
        title: '清空本地缓存',
        iconClass: 'fa-trash-can',
        description: '您确定要清空本地缓存数据吗？此操作主要用于解决缓存冲突或空间不足问题。',
        safeTitle: '高风险操作',
        safeDescription: '注意：此操作将永久删除本地保存的所有配置（包括主题色、布局、规则设置等）。',
        confirmText: '确认清空',
        loadingText: '正在清理...',
        isDanger: true,
        safeIconClass: 'fa-triangle-exclamation',
        onConfirm: async () => {
          const removedLocalStorageKeys = await deps.clearDiceLocalCacheData();
          if (window.toastr) {
            window.toastr.success(
              `本地缓存已清理（localStorage ${removedLocalStorageKeys} 项，含 IndexedDB/脚本缓存）。建议刷新页面以重新初始化设置。`,
            );
          }
        },
      });
    });

    // === 关闭 ===
    const closeDialog = () => {
      deps.setIsSettingsOpen(false);
      dialog.remove();
      deps.renderInterface();
    };
    dialog.on('click', '#dlg-close-x, .acu-settings-header .acu-close-btn', closeDialog);

    // 手动更新按钮点击事件
    dialog.on('click', '#acu-manual-update-btn', function (e: any) {
      e.stopPropagation();
      deps.showManualUpdateDialog();
    });
    deps.setupOverlayClose(dialog, 'acu-edit-overlay', closeDialog);

    // [b14③] 可选：直接打开指定二级管理弹窗（供 DND 主面板「预设管理」入口复用；不改原流程）
    try {
      const target = options && options.openManager;
      if (target) {
        const $group = dialog.find('.acu-settings-group[data-group="dicePresets"]');
        if ($group.length && $group.hasClass('collapsed')) {
          try { $group.find('.acu-settings-group-title').trigger('click'); } catch (e) {}
        }
        setTimeout(() => {
          try { openSettingsManagerDialog(String(target)); } catch (e) {}
        }, 60);
      }
    } catch (e) {}
  };
  return showSettingsModal;
}
