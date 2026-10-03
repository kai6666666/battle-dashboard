/**
 * show-contest-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { rollComplexDiceExpression } from '../../features/dice/dice-engine';
type DiceRawData = Record<string, any>;
type CharacterAttributeSource = string;
type LegacyAdvancedDicePreset = Record<string, any>;
import type { AdvancedDicePreset } from '../../shared/advanced-preset-types';
import { createApplyContestAdvancedPreset } from './contest/apply-advanced-preset';
import { buildContestPanelHtml } from './contest/build-contest-panel-html';
import { createResolveContest } from './contest/resolve-contest';
import { createContestPanelButtons } from './contest/contest-panel-buttons';
import { createPerformCustomContestRoll } from './contest/perform-custom-contest-roll';
import { createPerformContestRoll } from './contest/perform-contest-roll';
import { createContestPanelBindings } from './contest/contest-panel-bindings';
export function createShowContestPanel(deps: any) {
  const showContestPanel = (options: Record<string, any> = {}) => {
    const { $ } = deps.getCore();
    $('.acu-dice-panel, .acu-dice-overlay, .acu-contest-panel, .acu-contest-overlay').remove();

    const config = deps.getConfig();
    const diceCfg = deps.getDiceConfig();

    // 读取保存的骰子类型，必须是有效公式
    let savedDiceType = diceCfg.lastDiceType || '1d100';
    if (Number.isNaN(rollComplexDiceExpression(savedDiceType).total)) {
      savedDiceType = '1d100';
    }

    // 修复：正确接收所有传入参数
    const opponentName = options.opponentName || '';
    const diceType = options.diceType || savedDiceType;
    const passedInitiatorName = options.initiatorName || '';
    const passedInitiatorValue = options.initiatorValue;
    const passedOpponentValue = options.opponentValue;

    const rawData = deps.getCachedRawData() || deps.getTableData();
    let playerAttrs = [];
    let opponentAttrs = [];

    // [新增] 构建角色下拉列表（主角真名 + 重要角色表）
    const characterList = deps.getDiceQuickSelectCharacterList(rawData as DiceRawData | null | undefined);
    // [新增] 构建属性下拉列表
    let contestAttrList: any[] = [];
    playerAttrs = deps.getFullAttributesForCharacter(passedInitiatorName || '<user>');
    playerAttrs.forEach((attr: any) => {
      if (!contestAttrList.includes(attr.name)) contestAttrList.push(attr.name);
    });
    opponentAttrs = opponentName ? deps.getFullAttributesForCharacter(opponentName) : [];
    opponentAttrs.forEach((attr: any) => {
      if (!contestAttrList.includes(attr.name)) contestAttrList.push(attr.name);
    });

    const { buildAttrButtons, buildCharBtns, rebuildAttrBtns } = createContestPanelButtons({
      deps,
      $,
      getPanel: () => panel,
      getContestAttrTargetInput: (...args: any[]) => (getContestAttrTargetInput as any)(...args),
      characterList,
    });

    // [修复] 获取当前活跃预设，用于正确同步按钮状态
    const contestAvailablePresets = deps.AdvancedDicePresetManager.getAllPresets()
      .filter((p: any) => p.visible !== false)
      .filter((p: any) => deps.AdvancedDicePresetManager.supportsContest(p))
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    const currentActivePreset = deps.AdvancedDicePresetManager.getActivePreset();
    const activePresetId =
      currentActivePreset && deps.AdvancedDicePresetManager.supportsContest(currentActivePreset)
        ? currentActivePreset.id
        : null;

    const overlay = $('<div class="acu-contest-overlay"></div>');
    const panelHtml = buildContestPanelHtml({
      config,
      escapeHtml: (text: any) => deps.escapeHtml(text),
      tutorialButtonHtml: deps.getTutorialButtonHtml('contestDice', '查看对抗检定教程'),
      presets: contestAvailablePresets,
      activePresetId,
      diceType,
      initiatorName: passedInitiatorName,
      initiatorValue: passedInitiatorValue,
      opponentName,
      opponentValue: passedOpponentValue,
      buildAttrButtons,
      playerAttrs,
      opponentAttrs,
    });

    const panel = $(panelHtml);
    overlay.append(panel);
    $('body').append(overlay);
    deps.bindTutorialButtonsIn(panel);

    // [新增] 构建角色快捷按钮 - 复用普通检定的样式规格

    // [新增] 重建属性快捷按钮

    // 初始化角色快捷按钮
    buildCharBtns('init');
    buildCharBtns('opp');
    // [新增] 发起方随机技能按钮
    panel.find('#contest-init-random-skill').click(function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      const skillPool = deps.getRandomSkillPool();
      var randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      panel.find('#contest-init-name').val(randomSkill).trigger('change');
    });

    // [新增] 对抗方随机技能按钮
    panel.find('#contest-opp-random-skill').click(function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      const skillPool = deps.getRandomSkillPool();
      var randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      panel.find('#contest-opp-name').val(randomSkill).trigger('change');
    });
    // 始终调用 rebuildAttrBtns 来绑定事件（即使属性为空也需要生成/清空按钮可用）
    const initAttrs = deps.getFullAttributesForCharacter(passedInitiatorName || characterList[0] || '<user>');
    rebuildAttrBtns(initAttrs, 'init');
    const oppAttrs = deps.getFullAttributesForCharacter(opponentName || '');
    rebuildAttrBtns(oppAttrs, 'opp');

    // 初始化下拉菜单
    deps.initCustomDropdown(panel.find('#contest-init-display'), characterList);
    deps.initCustomDropdown(panel.find('#contest-opponent-display'), characterList);
    deps.initCustomDropdown(panel.find('#contest-init-name'), contestAttrList);
    deps.initCustomDropdown(panel.find('#contest-opp-name'), contestAttrList);
    deps.addClearButton(
      panel,
      '#contest-init-display, #contest-init-name, #contest-init-value, #contest-init-skill-mod, #contest-init-mod, #contest-init-target, #contest-opponent-display, #contest-opp-name, #contest-opp-value, #contest-opp-skill-mod, #contest-opp-mod, #contest-opp-target, #contest-custom-dice-init, #contest-custom-dice-opp',
    );

    // [新增] 高级预设选择器（对抗检定）
    let currentContestAdvancedPreset: AdvancedDicePreset | LegacyAdvancedDicePreset | null = null;

    const getContestAttrTargetInput = (
      party: 'init' | 'opp',
      attrName: string,
      attrSource?: CharacterAttributeSource,
    ): string => {
      const target = deps.resolveQuickSelectTarget(attrName, attrSource, currentContestAdvancedPreset, 'contest');
      if (target === 'skillMod') {
        return party === 'init' ? '#contest-init-skill-mod' : '#contest-opp-skill-mod';
      }
      if (target === 'mod') {
        return party === 'init' ? '#contest-init-mod' : '#contest-opp-mod';
      }
      return party === 'init' ? '#contest-init-value' : '#contest-opp-value';
    };

    const applyContestAdvancedPreset = createApplyContestAdvancedPreset({
      deps, $, panel,
      setCurrentContestAdvancedPreset: (value: any) => { currentContestAdvancedPreset = value; },
    });

    // [统一UI] 初始化时根据活跃预设高亮对应按钮并应用配置
    const savedContestPreset = deps.AdvancedDicePresetManager.getActivePreset();
    const savedSupportedContestPreset =
      savedContestPreset && deps.AdvancedDicePresetManager.supportsContest(savedContestPreset) ? savedContestPreset : null;
    const defaultContestPresetId = contestAvailablePresets.length > 0 ? contestAvailablePresets[0].id : null;
    const savedPresetId = localStorage.getItem(deps.STORAGE_KEY_LAST_PRESET);

    if (savedPresetId === '__custom__') {
      // [修复] 如果保存的是自定义模式，激活自定义按钮并显示自定义UI
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      panel.find('.acu-dice-quick-preset-btn[data-dice="custom"]').addClass('active');
      panel.find('#contest-init-dice-syntax-row').show();
      panel.find('#contest-opp-dice-syntax-row').show();
      panel.find('#contest-custom-judge-row').show();
      panel.find('#contest-init-values-row, #contest-opp-values-row').hide();
      panel.find('#contest-init-custom-fields, #contest-opp-custom-fields').hide();
      // [修复] 进入自定义模式时也重置对抗预设状态，避免后续切换字段丢失
      applyContestAdvancedPreset(null);
    } else if (savedSupportedContestPreset) {
      // 高亮对应的预设按钮
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      const $matchedBtn = panel.find(`.acu-dice-quick-preset-btn[data-preset-id="${savedSupportedContestPreset.id}"]`);
      if ($matchedBtn.length) {
        $matchedBtn.addClass('active');
      }
      applyContestAdvancedPreset(savedSupportedContestPreset.id);
    } else if (defaultContestPresetId) {
      // 当前活跃预设不支持对抗时，自动回退到首个可用对抗预设
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      const $defaultBtn = panel.find(`.acu-dice-quick-preset-btn[data-preset-id="${defaultContestPresetId}"]`);
      if ($defaultBtn.length) {
        $defaultBtn.addClass('active');
        panel.find('#contest-dice-type').val(($defaultBtn.data('dice') as string) || '1d100');
      }
      applyContestAdvancedPreset(defaultContestPresetId);
    }

    // 发起方角色变化时更新属性
    panel.find('#contest-init-display').on('change.acuattr input.acuattr', function (this: any) {
      const charName = $(this).val().trim() || '<user>';
      const newAttrList = deps.getAttributesForCharacter(charName);
      deps.initCustomDropdown(panel.find('#contest-init-name'), newAttrList.length > 0 ? newAttrList : contestAttrList);
      const fullAttrs = deps.getFullAttributesForCharacter(charName);
      rebuildAttrBtns(fullAttrs, 'init');
    });

    // 对抗方角色变化时更新属性
    panel.find('#contest-opponent-display').on('change.acuattr input.acuattr', function (this: any) {
      const charName = $(this).val().trim();
      const newAttrList = deps.getAttributesForCharacter(charName);
      deps.initCustomDropdown(panel.find('#contest-opp-name'), newAttrList.length > 0 ? newAttrList : contestAttrList);
      const fullAttrs = deps.getFullAttributesForCharacter(charName);
      rebuildAttrBtns(fullAttrs, 'opp');
    });

    // 发起方属性名变化时自动填入属性值
    panel.find('#contest-init-name').on('change.acuval', function (this: any) {
      const charName = panel.find('#contest-init-display').val().trim() || '<user>';
      const attrName = $(this).val().trim();
      const attrEntry = deps.getAttributeEntryForCharacter(charName, attrName);
      if (attrEntry) {
        const targetInput = getContestAttrTargetInput('init', attrEntry.name, attrEntry.source);
        panel.find(targetInput).val(attrEntry.value).trigger('change');
      }
    });

    // 对抗方属性名变化时自动填入属性值
    panel.find('#contest-opp-name').on('change.acuval', function (this: any) {
      const charName = panel.find('#contest-opponent-display').val().trim();
      const attrName = $(this).val().trim();
      const attrEntry = deps.getAttributeEntryForCharacter(charName, attrName);
      if (attrEntry) {
        const targetInput = getContestAttrTargetInput('opp', attrEntry.name, attrEntry.source);
        panel.find(targetInput).val(attrEntry.value).trigger('change');
      }
    });

    // 骰子预设切换
    panel.find('.acu-dice-quick-preset-btn').click(function (this: any) {
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

      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      $(this).addClass('active');
      panel.find('#contest-dice-type').val(newDice);

      // [修复] 隐藏自定义模式字段区（使用新的元素ID）
      panel.find('#contest-init-dice-syntax-row').hide();
      panel.find('#contest-opp-dice-syntax-row').hide();
      panel.find('#contest-custom-judge-row').hide();
      panel.find('#contest-init-values-row, #contest-opp-values-row').show();
      panel.find('#contest-init-custom-fields, #contest-opp-custom-fields').show();

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
    panel.find('.acu-dice-quick-preset-btn[data-dice="custom"]').click(function (this: any) {
      // 立即高亮自定义按钮，取消其他按钮高亮
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      $(this).addClass('active');

      // [修复] 保存自定义模式状态（与普通检定面板保持一致）
      deps.AdvancedDicePresetManager.setActivePreset(null);
      localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, '__custom__');

      // [修复] 重置对抗检定预设布局（自定义模式会隐藏区域，但不应留下上一次整合布局残留）
      applyContestAdvancedPreset(null);

      // [修复] 显示自定义模式字段区（使用新的元素ID）
      panel.find('#contest-init-dice-syntax-row').show();
      panel.find('#contest-opp-dice-syntax-row').show();
      panel.find('#contest-custom-judge-row').show();
      panel.find('#contest-init-values-row, #contest-opp-values-row').hide();
      panel.find('#contest-init-custom-fields, #contest-opp-custom-fields').hide();
    });


    const resolveContest = createResolveContest(deps);

    // [新增] 自定义模式对抗掷骰逻辑
    const { performCustomContestRoll } = createPerformCustomContestRoll({
      deps,
      getPanel: () => panel,
    });

    // 对抗检定投骰逻辑函数（可被按钮点击和重投按钮调用）
    const { performContestRoll } = createPerformContestRoll({
      deps,
      $,
      getPanel: () => panel,
      getCurrentContestAdvancedPreset: () => currentContestAdvancedPreset,
      performCustomContestRoll,
      resolveContest,
    });

    createContestPanelBindings({
      deps,
      getPanel: () => panel,
      getOverlay: () => overlay,
      performContestRoll,
    });
  };
  return showContestPanel;
}
