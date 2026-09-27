/**
 * build-settings-dialog-html.ts — 设置弹窗 HTML 构建（从 show-settings-modal.ts 拆出）。
 */
export function buildSettingsDialogHtml(ctx: any): string {
  const { deps, config, currentThemeClass, allTableNames, chevron, isGroupExpanded, renderSettingSegmented, tableManagerHtml, ENABLE_DISABLE_OPTIONS, DIALOGUE_INDENT_STRATEGY_OPTIONS, RULE_TYPE_INFO, PRESET_FORMAT_VERSION, SCRIPT_VERSION, normalizeDialogueIndentStrategy } = ctx;
  return `
        <div class="acu-edit-overlay ${currentThemeClass}">
            <div class="acu-edit-dialog acu-settings-dialog ${currentThemeClass}">
                <div class="acu-settings-header">
                    <div class="acu-settings-title">
                        <span class="acu-settings-title-main">
                            <span class="acu-settings-title-icon"><i class="fa-solid fa-cog"></i></span>
                            <span class="acu-settings-heading">设置</span>
                        </span>
                    </div>
                    <div class="acu-header-actions">
                        <span class="acu-version-badge" title="当前版本 ${SCRIPT_VERSION}">${SCRIPT_VERSION}</span>
                        <button type="button" class="acu-manual-update-btn" id="acu-manual-update-btn" aria-label="清理缓存并刷新以获取最新版本" title="清理缓存并刷新以获取最新版本"><i class="fa-solid fa-rotate"></i></button>
                        ${deps.getTutorialButtonHtml('settings', '查看设置页面教程', 'acu-help-btn')}
                        <button type="button" class="acu-close-btn" id="dlg-close-x" aria-label="关闭设置" title="关闭"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>

                <div class="acu-settings-body">
                <!-- 外观样式 -->
                <div class="acu-settings-group ${isGroupExpanded('appearance') ? '' : 'collapsed'}" data-group="appearance">                    <div class="acu-settings-group-title">
                        <span class="acu-settings-group-title-main">
                            <i class="fa-solid ${chevron('appearance')} acu-group-chevron"></i>
                            <i class="fa-solid fa-palette"></i>
                            <span>外观样式</span>
                        </span>
                        ${deps.getTutorialButtonHtml('settingsAppearance', '查看外观样式教程', 'acu-settings-group-help')}
                    </div>
                    <div class="acu-settings-group-body">
                        <div class="acu-setting-row" id="settings-row-theme">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">背景主题</span>
                            </div>
                            <select id="cfg-theme" class="acu-setting-select">
                                ${deps.THEMES.map(t => `<option value="${t.id}" ${t.id === config.theme ? 'selected' : ''}>${t.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="acu-setting-row" id="settings-row-font-family">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体风格</span>
                            </div>
                            <select id="cfg-font-family" class="acu-setting-select">
                                ${deps.FONTS.map(f => `<option value="${f.id}" ${f.id === config.fontFamily ? 'selected' : ''}>${f.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="acu-setting-row" id="settings-row-font-main">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体大小（界面）</span>
                            </div>
                            <div class="acu-stepper" data-id="cfg-font-main" data-min="10" data-max="24" data-step="1">
                                <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                <span class="acu-stepper-value">${config.fontSize}px</span>
                                <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="acu-setting-row" id="settings-row-font-option">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体大小（选项）</span>
                            </div>
                            <div class="acu-stepper" data-id="cfg-font-opt" data-min="10" data-max="24" data-step="1">
                                <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                <span class="acu-stepper-value">${config.optionFontSize || 12}px</span>
                                <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="acu-setting-row" id="settings-row-font-nav">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体大小（导航栏）</span>
                            </div>
                            <div class="acu-stepper" data-id="cfg-font-nav" data-min="10" data-max="20" data-step="1">
                                <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                <span class="acu-stepper-value">${deps.getNavigationFontMetrics(config.navFontSize).fontSize}px</span>
                                <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="acu-setting-row" id="settings-row-highlight-new">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">高亮表格更新</span>
                            </div>
                            ${renderSettingSegmented(
                              'cfg-highlight-updates',
                              '高亮表格更新',
                              ENABLE_DISABLE_OPTIONS,
                              config.highlightNew ? 'enabled' : 'disabled',
                            )}
                        </div>
                        <div class="acu-setting-row" id="settings-row-dialogue-indent-enabled">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">正文头像渲染</span>
                            </div>
                            ${renderSettingSegmented(
                              'cfg-dialogue-indent-enabled',
                              '正文头像渲染',
                              ENABLE_DISABLE_OPTIONS,
                              config.dialogueIndentEnabled === true ? 'enabled' : 'disabled',
                            )}
                        </div>
                        <div class="acu-setting-row acu-setting-dependent-row" id="settings-row-dialogue-indent-strategy" ${config.dialogueIndentEnabled === true ? '' : 'hidden'}>
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">识别强度</span>
                            </div>
                            ${renderSettingSegmented(
                              'cfg-dialogue-indent-strategy',
                              '识别强度',
                              DIALOGUE_INDENT_STRATEGY_OPTIONS,
                              normalizeDialogueIndentStrategy(config.dialogueIndentStrategy),
                            )}
                        </div>
                    </div>
                </div>

                    <!-- 布局与浏览 -->
                    <div class="acu-settings-group ${isGroupExpanded('layout') ? '' : 'collapsed'}" data-group="layout">
                        <div class="acu-settings-group-title">
                            <span class="acu-settings-group-title-main">
                                <i class="fa-solid ${chevron('layout')} acu-group-chevron"></i>
                                <i class="fa-solid fa-th-large"></i>
                                <span>布局与浏览</span>
                            </span>
                            ${deps.getTutorialButtonHtml('settingsLayout', '查看布局与浏览教程', 'acu-settings-group-help')}
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row" id="settings-row-layout-mode">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">布局模式</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-layout',
                                  '布局模式',
                                  [
                                    { value: 'horizontal', label: '横向滚动' },
                                    { value: 'vertical', label: '竖向滚动' },
                                  ],
                                  config.layout === 'vertical' ? 'vertical' : 'horizontal',
                                )}
                            </div>
                            <div class="acu-setting-row acu-setting-dependent-row" id="settings-row-horizontal-scrollbar" ${config.layout === 'vertical' ? 'hidden' : ''}>
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">横向滚动条</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-horizontal-scrollbar',
                                  '横向滚动条',
                                  ENABLE_DISABLE_OPTIONS,
                                  config.showHorizontalScrollbar === true ? 'enabled' : 'disabled',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-reverse-all">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">卡片顺序</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-display-order',
                                  '卡片顺序',
                                  [
                                    { value: 'normal', label: '正序', title: '按原始顺序显示' },
                                    { value: 'reverse', label: '倒序', title: '最新记录优先显示' },
                                  ],
                                  deps.areAllTablesReversed(allTableNames) ? 'reverse' : 'normal',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-desktop-nav-aligned">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">PC导航布局</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-desktop-nav-layout',
                                  'PC导航布局',
                                  [
                                    { value: 'compact', label: '紧凑', title: '按内容宽度紧凑排列' },
                                    { value: 'aligned', label: '对齐', title: '使用等宽网格对齐按钮' },
                                  ],
                                  config.desktopNavAligned === true ? 'aligned' : 'compact',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-card-width">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">卡片宽度</span>
                                </div>
                                <div class="acu-stepper" data-id="cfg-width" data-min="200" data-max="500" data-step="10">
                                    <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value">${config.cardWidth}px</span>
                                    <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="acu-setting-row" id="settings-row-per-page">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">每页卡片数</span>
                                </div>
                                <div class="acu-stepper" data-id="cfg-per-page" data-min="10" data-max="200" data-step="10">
                                    <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value">${config.itemsPerPage}</span>
                                    <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="acu-setting-row" id="settings-row-grid-cols">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">移动端导航栏列数</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-grid-cols',
                                  '移动端导航栏列数',
                                  [
                                    { value: '2', label: '2列' },
                                    { value: '3', label: '3列' },
                                    { value: '4', label: '4列' },
                                    { value: 'auto', label: '自动' },
                                  ],
                                  String(config.gridColumns || 'auto'),
                                )}
                            </div>
                        </div>
                    </div>


                    <!-- 面板与交互 -->
                    <div class="acu-settings-group ${isGroupExpanded('position') ? '' : 'collapsed'}" data-group="position">
                        <div class="acu-settings-group-title">
                            <span class="acu-settings-group-title-main">
                                <i class="fa-solid ${chevron('position')} acu-group-chevron"></i>
                                <i class="fa-solid fa-arrows-alt"></i>
                                <span>面板与交互</span>
                            </span>
                            ${deps.getTutorialButtonHtml('settingsPosition', '查看面板与交互教程', 'acu-settings-group-help')}
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row" id="settings-row-panel-position">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">导航盘位置</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-position',
                                  '导航盘位置',
                                  [
                                    { value: 'fixed', label: '悬浮底部' },
                                    { value: 'embedded', label: '跟随消息' },
                                    { value: 'viewport', label: '固定底部' },
                                  ],
                                  String(config.positionMode || 'fixed'),
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-action-position">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">功能按钮位置</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-action-pos',
                                  '功能按钮位置',
                                  [
                                    { value: 'bottom', label: '底部' },
                                    { value: 'top', label: '顶部' },
                                  ],
                                  config.actionsPosition === 'top' ? 'top' : 'bottom',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-collapse-style">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">收起样式</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-col-style',
                                  '收起样式',
                                  [
                                    { value: 'bar', label: '长条' },
                                    { value: 'pill', label: '胶囊' },
                                    { value: 'floating', label: '浮球' },
                                  ],
                                  deps.normalizeCollapseStyle(config.collapseStyle),
                                )}
                            </div>
                            <div class="acu-setting-row acu-setting-dependent-row" id="cfg-col-align-row" style="${deps.normalizeCollapseStyle(config.collapseStyle) === 'pill' ? '' : 'display:none;'}">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">收起位置</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-col-align',
                                  '收起位置',
                                  [
                                    { value: 'right', label: '靠右' },
                                    { value: 'left', label: '靠左' },
                                    { value: 'center', label: '居中' },
                                  ],
                                  String(config.collapseAlign || 'right'),
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-show-options">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">选项面板</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-option-panel',
                                  '选项面板',
                                  ENABLE_DISABLE_OPTIONS,
                                  config.showOptionPanel !== false ? 'enabled' : 'disabled',
                                )}
                            </div>
                            <div class="acu-setting-row" id="row-auto-send">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">点击选项后</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-option-click',
                                  '点击选项后',
                                  [
                                    { value: 'send', label: '直接发送' },
                                    { value: 'input', label: '填入输入框' },
                                  ],
                                  config.clickOptionToAutoSend !== false ? 'send' : 'input',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-navigation-manager">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">导航盘管理</span>
                                </div>
                                <button type="button" id="cfg-navigation-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 骰子系统预设 -->
                    <div class="acu-settings-group ${isGroupExpanded('dicePresets') ? '' : 'collapsed'}" data-group="dicePresets">
                        <div class="acu-settings-group-title">
                            <span class="acu-settings-group-title-main">
                                <i class="fa-solid ${chevron('dicePresets')} acu-group-chevron"></i>
                                <i class="fa-solid fa-layer-group"></i>
                                <span>骰子系统预设</span>
                            </span>
                            ${deps.getTutorialButtonHtml('settingsDicePresets', '查看骰子系统预设教程', 'acu-settings-group-help')}
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row" id="settings-row-check-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-sliders"></i> 检定预设</span>
                                </div>
                                <button type="button" id="cfg-advanced-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-attribute-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-gem"></i> 属性预设</span>
                                </div>
                                <button type="button" id="cfg-attribute-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-action-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-wand-magic-sparkles"></i> 交互规则预设</span>
                                </div>
                                <button type="button" id="cfg-action-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-dashboard-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-chart-line"></i> 仪表盘预设</span>
                                </div>
                                <button type="button" id="cfg-dashboard-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-render-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-table-cells-large"></i> 渲染预设</span>
                                </div>
                                <button type="button" id="cfg-render-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-table-template-requirement-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-table-list"></i> 模板检验预设</span>
                                </div>
                                <button type="button" id="cfg-table-template-requirement-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-avatar-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-user-circle"></i> 角色头像预设</span>
                                </div>
                                <button type="button" id="cfg-avatar-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-custom-table-name-icon-manager">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-icons"></i> 图标预设</span>
                                </div>
                                <button type="button" id="cfg-custom-table-name-icon-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-validation-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-shield-halved"></i> 数据验证预设 ${deps.renderDeprecatedBadge(deps.DATA_VALIDATION_DEPRECATED_META.deprecatedReason)}</span>
                                </div>
                                <button type="button" id="cfg-validation-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-regex-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-table-list"></i> 表格正则预设</span>
                                </div>
                                <button type="button" id="cfg-regex-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="acu-settings-manager-overlay" id="navigation-manager-dialog" role="dialog" aria-modal="true" aria-labelledby="navigation-manager-title" hidden>
                        <div class="acu-settings-manager-backdrop" data-settings-manager-close="true"></div>
                        <div class="acu-settings-manager-dialog">
                            <div class="acu-panel-header acu-settings-manager-header">
                                <div class="acu-avatar-title acu-settings-manager-title" id="navigation-manager-title">
                                    <i class="fa-solid fa-table"></i> 导航盘管理
                                </div>
                                <button type="button" class="acu-settings-manager-close acu-btn-icon" title="关闭" aria-label="关闭导航盘管理">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                            <div class="acu-settings-manager-body">
                                <div class="acu-table-manager-hint">
                                    <i class="fa-solid fa-info-circle"></i> 点击眼睛切换显示，拖拽右侧把手调整顺序
                                </div>
                                <div class="acu-table-manager-list" id="table-manager-list">
                                    ${tableManagerHtml}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="acu-settings-manager-overlay" id="validation-preset-manager-dialog" role="dialog" aria-modal="true" aria-labelledby="validation-preset-manager-title" hidden>
                        <div class="acu-settings-manager-backdrop" data-settings-manager-close="true"></div>
                        <div class="acu-settings-manager-dialog">
                            <div class="acu-panel-header acu-settings-manager-header">
                                <div class="acu-avatar-title acu-settings-manager-title" id="validation-preset-manager-title">
                                    <i class="fa-solid fa-shield-halved"></i> 数据验证预设 ${deps.renderDeprecatedBadge(deps.DATA_VALIDATION_DEPRECATED_META.deprecatedReason)}
                                </div>
                                <button type="button" class="acu-settings-manager-close acu-btn-icon" title="关闭" aria-label="关闭数据验证预设管理">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                            <div class="acu-settings-manager-body">
                            <div class="acu-setting-row acu-settings-manager-control-row" id="settings-row-validation-preset-select" style="margin-bottom:8px;">
                                <span>选择数据验证预设</span>
                                <select class="acu-setting-select" id="preset-select" style="flex:1;max-width:160px;">
                                    ${deps.PresetManager.getAllPresets()
                                      .map(
                                        p =>
                                          `<option value="${deps.escapeHtml(p.id)}" ${p.id === deps.PresetManager.getActivePreset()?.id ? 'selected' : ''}>${deps.escapeHtml(p.name)}${p.id === 'default' ? ` v${PRESET_FORMAT_VERSION}` : p.builtin ? ' (内置)' : ''}</option>`,
                                      )
                                      .join('')}
                                </select>
                            </div>
                            <!-- 预设操作按钮 -->
                            <div id="settings-row-validation-preset-actions" style="display:flex;gap:6px;margin-bottom:10px;">
                                <button class="acu-action-btn" id="btn-preset-dup" title="复制预设" style="flex:1;height:28px;"><i class="fa-solid fa-copy"></i></button>
                                <button class="acu-action-btn" id="btn-preset-new" title="新建预设" style="flex:1;height:28px;"><i class="fa-solid fa-plus"></i></button>
                                <button class="acu-action-btn" id="btn-preset-del" title="删除预设" style="flex:1;height:28px;"><i class="fa-solid fa-trash"></i></button>
                                <button class="acu-action-btn" id="btn-preset-export" title="导出" style="flex:1;height:28px;"><i class="fa-solid fa-file-export"></i></button>
                                <button class="acu-action-btn" id="btn-preset-import" title="导入" style="flex:1;height:28px;"><i class="fa-solid fa-file-import"></i></button>
                                <button class="acu-action-btn" id="btn-preset-reset" title="恢复默认预设规则" style="flex:1;height:28px;"><i class="fa-solid fa-rotate-left"></i></button>
                            </div>
                            <div class="acu-validation-hint" style="font-size:11px;color:var(--acu-text-sub);margin-bottom:8px;padding:0 4px;">
                                <i class="fa-solid fa-info-circle"></i> 验证规则用于检测数据合法性，<i class="fa-solid fa-shield-halved"></i> 表示启用拦截
                            </div>
                            <div class="acu-validation-rules-list" id="validation-rules-list">
                                ${deps.ValidationRuleManager.getAllRules()
                                  .map(rule => {
                                    const typeInfo = RULE_TYPE_INFO[rule.ruleType] || {
                                      name: rule.ruleType,
                                      icon: 'fa-question',
                                    };
                                    const isTableRule = typeInfo.scope === 'table';
                                    const hasIntercept = rule.intercept;
                                    return `
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
                                    </div>
                                `;
                                  })
                                  .join('')}
                            </div>
                            <button class="acu-add-rule-btn" id="btn-add-validation-rule">
                                <i class="fa-solid fa-plus"></i> 新建数据验证规则
                            </button>
                            </div>
                        </div>
                    </div>

                    <div class="acu-settings-manager-overlay" id="regex-preset-manager-dialog" role="dialog" aria-modal="true" aria-labelledby="regex-preset-manager-title" hidden>
                        <div class="acu-settings-manager-backdrop" data-settings-manager-close="true"></div>
                        <div class="acu-settings-manager-dialog">
                            <div class="acu-panel-header acu-settings-manager-header">
                                <div class="acu-avatar-title acu-settings-manager-title" id="regex-preset-manager-title">
                                    <i class="fa-solid fa-table-list"></i> 表格正则预设
                                </div>
                                <button type="button" class="acu-settings-manager-close acu-btn-icon" title="关闭" aria-label="关闭表格正则预设管理">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                            <div class="acu-settings-manager-body">
                            <div class="acu-setting-row acu-settings-manager-control-row" id="settings-row-regex-preset-select" style="margin-bottom:8px;">
                                <span>选择表格正则预设</span>
                                <select class="acu-setting-select" id="regex-preset-select" style="flex:1;max-width:160px;">
                                    ${deps.RegexPresetManager.getAllPresets()
                                      .map(
                                        p =>
                                          `<option value="${deps.escapeHtml(p.id)}" ${p.id === deps.RegexPresetManager.getActivePreset()?.id ? 'selected' : ''}>${deps.escapeHtml(p.name)}${p.id === 'regex_default' ? ` v${PRESET_FORMAT_VERSION}` : ''}</option>`,
                                      )
                                      .join('')}
                                </select>
                            </div>
                            <!-- 预设操作按钮 -->
                            <div id="settings-row-regex-preset-actions" style="display:flex;gap:6px;margin-bottom:10px;">
                                <button class="acu-action-btn" id="btn-regex-preset-dup" title="复制预设" style="flex:1;height:28px;"><i class="fa-solid fa-copy"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-new" title="新建预设" style="flex:1;height:28px;"><i class="fa-solid fa-plus"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-del" title="删除预设" style="flex:1;height:28px;"><i class="fa-solid fa-trash"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-export" title="导出" style="flex:1;height:28px;"><i class="fa-solid fa-file-export"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-import" title="导入" style="flex:1;height:28px;"><i class="fa-solid fa-file-import"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-reset" title="恢复默认预设" style="flex:1;height:28px;"><i class="fa-solid fa-rotate-left"></i></button>
                            </div>
                            <div class="acu-validation-hint" style="font-size:11px;color:var(--acu-text-sub);margin-bottom:8px;padding:0 4px;">
                                <i class="fa-solid fa-info-circle"></i> 表格正则规则用于自动修改数据库表格内容
                            </div>
                            <!-- 规则列表 -->
                            <div class="acu-validation-rules-list" id="regex-rules-list">
                                ${deps.RegexTransformationManager.getAllRules()
                                  .map(rule => {
                                    const scopeIcon =
                                      rule.scope.type === 'global'
                                        ? 'fa-globe'
                                        : rule.scope.type === 'table'
                                          ? 'fa-table'
                                          : 'fa-columns';
                                    const scopeText =
                                      rule.scope.type === 'global'
                                        ? '全局'
                                        : rule.scope.type === 'table'
                                          ? rule.scope.tableNames?.join(',')
                                          : `${rule.scope.tableNames?.join(',')}.${rule.scope.columnNames?.join(',')}`;
                                    return `
                                    <div class="acu-validation-rule-item ${rule.enabled ? '' : 'disabled'}" data-rule-id="${deps.escapeHtml(rule.id)}">
                                        <div class="acu-rule-type-icon" title="作用域: ${deps.escapeHtml(rule.scope.type)}">
                                            <i class="fa-solid ${scopeIcon}"></i>
                                        </div>
                                        <div class="acu-rule-info">
                                            <div class="acu-rule-name">${deps.escapeHtml(rule.name)}</div>
                                            <div class="acu-rule-target" style="font-size:10px;">${deps.escapeHtml(scopeText)} | ${deps.escapeHtml(rule.operation)}</div>
                                        </div>
                                        <button type="button" class="acu-rule-action acu-rule-edit" data-rule-id="${deps.escapeHtml(rule.id)}" title="编辑此规则" aria-label="编辑此规则"><i class="fa-solid fa-pen"></i></button>
                                        <div class="acu-rule-toggle ${rule.enabled ? 'active' : ''}" title="点击切换启用/禁用">
                                            <i class="fa-solid ${rule.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
                                        </div>
                                        <button type="button" class="acu-rule-action acu-rule-delete" data-rule-id="${deps.escapeHtml(rule.id)}" title="删除此规则" aria-label="删除此规则"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                `;
                                  })
                                  .join('')}
                            </div>
                            <div style="display:flex;gap:8px;margin-top:8px;">
                                <button class="acu-add-rule-btn" id="btn-add-regex-rule" style="flex:1;">
                                    <i class="fa-solid fa-plus"></i> 新建验证规则
                                </button>
                                <button class="acu-add-rule-btn" id="btn-import-tavern-regex" style="flex:1;">
                                    <i class="fa-solid fa-file-import"></i> 导入酒馆正则
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>

                    <!-- 高级设置 -->
                    <div class="acu-settings-group ${isGroupExpanded('advanced') ? '' : 'collapsed'}" data-group="advanced">
                        <div class="acu-settings-group-title">
                            <span class="acu-settings-group-title-main">
                                <i class="fa-solid ${chevron('advanced')} acu-group-chevron"></i>
                                <i class="fa-solid fa-sliders-h"></i>
                                <span>高级设置</span>
                            </span>
                            ${deps.getTutorialButtonHtml('settingsAdvanced', '查看高级设置教程', 'acu-settings-group-help')}
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row" id="settings-row-template-inspection">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-stethoscope"></i> 检验表格模板</span>
                                </div>
                                <button type="button" id="cfg-template-inspection" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-magnifying-glass-chart"></i> 检验
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-debug-console">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-bug"></i> Debug控制台</span>
                                </div>
                                <button type="button" id="btn-open-debug-console" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-terminal"></i> 打开
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-config-backup">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-layer-group"></i> 配置方案与备份</span>
                                </div>
                                <button type="button" id="cfg-config-backup-restore" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-arrows-rotate"></i> 打开
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-clear-cache">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-trash-can"></i> 清空本地缓存</span>
                                </div>
                                <button type="button" id="cfg-clear-local-cache" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-eraser"></i> 清空
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-db-toast-mute">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-bell"></i> 数据库弹窗</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-db-toast',
                                  '数据库弹窗',
                                  ENABLE_DISABLE_OPTIONS,
                                  config.muteDatabaseToasts ? 'disabled' : 'enabled',
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                </div><!-- 关闭 .acu-settings-body -->
            </div>
        </div>
    `;
}
