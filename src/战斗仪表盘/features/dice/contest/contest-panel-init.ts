/**
 * contest / contest-panel-init.ts — 对抗面板：初始化与交互绑定簇（快捷按钮/随机技能/下拉菜单/预设高亮/角色与属性联动/预设切换；从 show-contest-panel.ts 拆出，x9-d）。
 */

export function createContestPanelInit(ctx: any) {
  const { deps, $, getPanel, buildCharBtns, rebuildAttrBtns, characterList, contestAttrList, passedInitiatorName, opponentName, getContestAttrTargetInput, applyContestAdvancedPreset, contestAvailablePresets } = ctx;

  // [新增] 构建角色快捷按钮 - 复用普通检定的样式规格

  // [新增] 重建属性快捷按钮

  // 初始化角色快捷按钮
  buildCharBtns('init');
  buildCharBtns('opp');
  // [新增] 发起方随机技能按钮
  getPanel().find('#contest-init-random-skill').click(function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    const skillPool = deps.getRandomSkillPool();
    var randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
    getPanel().find('#contest-init-name').val(randomSkill).trigger('change');
  });

  // [新增] 对抗方随机技能按钮
  getPanel().find('#contest-opp-random-skill').click(function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    const skillPool = deps.getRandomSkillPool();
    var randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
    getPanel().find('#contest-opp-name').val(randomSkill).trigger('change');
  });
  // 始终调用 rebuildAttrBtns 来绑定事件（即使属性为空也需要生成/清空按钮可用）
  const initAttrs = deps.getFullAttributesForCharacter(passedInitiatorName || characterList[0] || '<user>');
  rebuildAttrBtns(initAttrs, 'init');
  const oppAttrs = deps.getFullAttributesForCharacter(opponentName || '');
  rebuildAttrBtns(oppAttrs, 'opp');

  // 初始化下拉菜单
  deps.initCustomDropdown(getPanel().find('#contest-init-display'), characterList);
  deps.initCustomDropdown(getPanel().find('#contest-opponent-display'), characterList);
  deps.initCustomDropdown(getPanel().find('#contest-init-name'), contestAttrList);
  deps.initCustomDropdown(getPanel().find('#contest-opp-name'), contestAttrList);
  deps.addClearButton(
    getPanel(),
    '#contest-init-display, #contest-init-name, #contest-init-value, #contest-init-skill-mod, #contest-init-mod, #contest-init-target, #contest-opponent-display, #contest-opp-name, #contest-opp-value, #contest-opp-skill-mod, #contest-opp-mod, #contest-opp-target, #contest-custom-dice-init, #contest-custom-dice-opp',
  );

  // [统一UI] 初始化时根据活跃预设高亮对应按钮并应用配置
  const savedContestPreset = deps.AdvancedDicePresetManager.getActivePreset();
  const savedSupportedContestPreset =
    savedContestPreset && deps.AdvancedDicePresetManager.supportsContest(savedContestPreset) ? savedContestPreset : null;
  const defaultContestPresetId = contestAvailablePresets.length > 0 ? contestAvailablePresets[0].id : null;
  const savedPresetId = localStorage.getItem(deps.STORAGE_KEY_LAST_PRESET);

  if (savedPresetId === '__custom__') {
    // [修复] 如果保存的是自定义模式，激活自定义按钮并显示自定义UI
    getPanel().find('.acu-dice-quick-preset-btn').removeClass('active');
    getPanel().find('.acu-dice-quick-preset-btn[data-dice="custom"]').addClass('active');
    getPanel().find('#contest-init-dice-syntax-row').show();
    getPanel().find('#contest-opp-dice-syntax-row').show();
    getPanel().find('#contest-custom-judge-row').show();
    getPanel().find('#contest-init-values-row, #contest-opp-values-row').hide();
    getPanel().find('#contest-init-custom-fields, #contest-opp-custom-fields').hide();
    // [修复] 进入自定义模式时也重置对抗预设状态，避免后续切换字段丢失
    applyContestAdvancedPreset(null);
  } else if (savedSupportedContestPreset) {
    // 高亮对应的预设按钮
    getPanel().find('.acu-dice-quick-preset-btn').removeClass('active');
    const $matchedBtn = getPanel().find(`.acu-dice-quick-preset-btn[data-preset-id="${savedSupportedContestPreset.id}"]`);
    if ($matchedBtn.length) {
      $matchedBtn.addClass('active');
    }
    applyContestAdvancedPreset(savedSupportedContestPreset.id);
  } else if (defaultContestPresetId) {
    // 当前活跃预设不支持对抗时，自动回退到首个可用对抗预设
    getPanel().find('.acu-dice-quick-preset-btn').removeClass('active');
    const $defaultBtn = getPanel().find(`.acu-dice-quick-preset-btn[data-preset-id="${defaultContestPresetId}"]`);
    if ($defaultBtn.length) {
      $defaultBtn.addClass('active');
      getPanel().find('#contest-dice-type').val(($defaultBtn.data('dice') as string) || '1d100');
    }
    applyContestAdvancedPreset(defaultContestPresetId);
  }

  // 发起方角色变化时更新属性
  getPanel().find('#contest-init-display').on('change.acuattr input.acuattr', function (this: any) {
    const charName = $(this).val().trim() || '<user>';
    const newAttrList = deps.getAttributesForCharacter(charName);
    deps.initCustomDropdown(getPanel().find('#contest-init-name'), newAttrList.length > 0 ? newAttrList : contestAttrList);
    const fullAttrs = deps.getFullAttributesForCharacter(charName);
    rebuildAttrBtns(fullAttrs, 'init');
  });

  // 对抗方角色变化时更新属性
  getPanel().find('#contest-opponent-display').on('change.acuattr input.acuattr', function (this: any) {
    const charName = $(this).val().trim();
    const newAttrList = deps.getAttributesForCharacter(charName);
    deps.initCustomDropdown(getPanel().find('#contest-opp-name'), newAttrList.length > 0 ? newAttrList : contestAttrList);
    const fullAttrs = deps.getFullAttributesForCharacter(charName);
    rebuildAttrBtns(fullAttrs, 'opp');
  });

  // 发起方属性名变化时自动填入属性值
  getPanel().find('#contest-init-name').on('change.acuval', function (this: any) {
    const charName = getPanel().find('#contest-init-display').val().trim() || '<user>';
    const attrName = $(this).val().trim();
    const attrEntry = deps.getAttributeEntryForCharacter(charName, attrName);
    if (attrEntry) {
      const targetInput = getContestAttrTargetInput('init', attrEntry.name, attrEntry.source);
      getPanel().find(targetInput).val(attrEntry.value).trigger('change');
    }
  });

  // 对抗方属性名变化时自动填入属性值
  getPanel().find('#contest-opp-name').on('change.acuval', function (this: any) {
    const charName = getPanel().find('#contest-opponent-display').val().trim();
    const attrName = $(this).val().trim();
    const attrEntry = deps.getAttributeEntryForCharacter(charName, attrName);
    if (attrEntry) {
      const targetInput = getContestAttrTargetInput('opp', attrEntry.name, attrEntry.source);
      getPanel().find(targetInput).val(attrEntry.value).trigger('change');
    }
  });

  // 骰子预设切换
  getPanel().find('.acu-dice-quick-preset-btn').click(function (this: any) {
    const newDice = $(this).data('dice');
    // 自定义按钮有单独处理，这里跳过
    if (newDice === 'custom') return;

    // [新增] 检查预设是否支持对抗检定
    const presetId = $(this).data('preset-id') as string | undefined;
    if (presetId && !deps.AdvancedDicePresetManager.supportsContest(presetId)) {
      const preset = deps.AdvancedDicePresetManager.getAllPresets().find((p: any) => p.id === presetId);
      toastr.warning(`${preset?.name || presetId} 规则不支持对抗检定`);
      return; // 不切换预设，保持当前状态
    }

    getPanel().find('.acu-dice-quick-preset-btn').removeClass('active');
    $(this).addClass('active');
    getPanel().find('#contest-dice-type').val(newDice);

    // [修复] 隐藏自定义模式字段区（使用新的元素ID）
    getPanel().find('#contest-init-dice-syntax-row').hide();
    getPanel().find('#contest-opp-dice-syntax-row').hide();
    getPanel().find('#contest-custom-judge-row').hide();
    getPanel().find('#contest-init-values-row, #contest-opp-values-row').show();
    getPanel().find('#contest-init-custom-fields, #contest-opp-custom-fields').show();

    // [统一UI] 如果按钮有 data-preset-id，直接应用高级预设配置
    if (presetId) {
      deps.AdvancedDicePresetManager.setActivePreset(presetId);
      applyContestAdvancedPreset(presetId);
    } else {
      // 没有预设ID时清除高级预设
      deps.AdvancedDicePresetManager.setActivePreset(null);
      applyContestAdvancedPreset(null);
    }

    // 保存骰子类型
    deps.saveDiceConfig({ lastDiceType: newDice });
  });

  // 自定义骰子按钮点击事件
  getPanel().find('.acu-dice-quick-preset-btn[data-dice="custom"]').click(function (this: any) {
    // 立即高亮自定义按钮，取消其他按钮高亮
    getPanel().find('.acu-dice-quick-preset-btn').removeClass('active');
    $(this).addClass('active');

    // [修复] 保存自定义模式状态（与普通检定面板保持一致）
    deps.AdvancedDicePresetManager.setActivePreset(null);
    localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, '__custom__');

    // [修复] 重置对抗检定预设布局（自定义模式会隐藏区域，但不应留下上一次整合布局残留）
    applyContestAdvancedPreset(null);

    // [修复] 显示自定义模式字段区（使用新的元素ID）
    getPanel().find('#contest-init-dice-syntax-row').show();
    getPanel().find('#contest-opp-dice-syntax-row').show();
    getPanel().find('#contest-custom-judge-row').show();
    getPanel().find('#contest-init-values-row, #contest-opp-values-row').hide();
    getPanel().find('#contest-init-custom-fields, #contest-opp-custom-fields').hide();
  });
}
