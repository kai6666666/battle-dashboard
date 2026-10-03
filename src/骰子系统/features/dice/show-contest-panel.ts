/**
 * show-contest-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { rollComplexDiceExpression } from '../../features/dice/dice-engine';
type DiceRawData = Record<string, any>;
type CharacterAttributeSource = string;
type LegacyAdvancedDicePreset = Record<string, any>;
import type { AdvancedDicePreset, OutcomeLevel } from '../../shared/advanced-preset-types';
import { createApplyContestAdvancedPreset } from './contest/apply-advanced-preset';
import { buildContestPanelHtml } from './contest/build-contest-panel-html';
import { createResolveContest } from './contest/resolve-contest';
import { createContestPanelButtons } from './contest/contest-panel-buttons';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
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
    const performCustomContestRoll = function () {
      const $btn = panel.find('#contest-roll-btn');

      // 读取自定义模式字段
      const initDiceExpr = panel.find('#contest-custom-dice-init').val().trim() || '1d100';
      const oppDiceExpr = panel.find('#contest-custom-dice-opp').val().trim() || initDiceExpr;
      const judgeRule = panel.find('#contest-custom-judge-rule').val() as string;
      const tieRule = (panel.find('#contest-custom-tie-rule').val() as string) ?? 'tie';

      // 读取双方信息
      try {
        const rawDataForAlias = deps.getCachedRawData() || deps.getTableData();
        if (rawDataForAlias) {
          deps.NameAliasRegistry.rebuild(deps.processJsonData(rawDataForAlias || {}));
        }
      } catch (error) {
        console.warn('[DICE] 对抗别名映射刷新失败:', error);
      }
      const initNameRaw = panel.find('#contest-init-display').val().trim() || '<user>';
      const initName = deps.resolveCanonicalCharacterName(initNameRaw);
      const initAttrName = panel.find('#contest-init-name').val().trim() || '自由检定';
      const oppNameRaw = panel.find('#contest-opponent-display').val().trim() || '对手';
      const oppName = deps.resolveCanonicalCharacterName(oppNameRaw);
      const oppAttrName = panel.find('#contest-opp-name').val().trim() || initAttrName;

      // 掷骰
      const initRoll = rollComplexDiceExpression(initDiceExpr);
      const oppRoll = rollComplexDiceExpression(oppDiceExpr);

      if (isNaN(initRoll.total) || isNaN(oppRoll.total)) {
        if (window.toastr) {
          const errorExpr = isNaN(initRoll.total) ? initDiceExpr : oppDiceExpr;
          showActionableErrorToast(`骰子语法错误: ${errorExpr}`, {
            suggestion: '请检查对抗检定双方的骰子表达式，只使用形如 1d100、2d6+3 的合法写法。',
          });
        }
        return;
      }

      const initTotal = initRoll.total;
      const oppTotal = oppRoll.total;

      // 判定胜负
      let winner: 'initiator' | 'opponent' | 'tie' = 'tie';
      switch (judgeRule) {
        case 'higher':
          if (initTotal > oppTotal) winner = 'initiator';
          else if (oppTotal > initTotal) winner = 'opponent';
          else {
            // 平手情况，使用 tieRule
            if (tieRule === 'initiator_win') winner = 'initiator';
            else if (tieRule === 'initiator_lose') winner = 'opponent';
            // tieRule === 'tie' 时保持 winner = 'tie'
          }
          break;
        case 'lower':
          if (initTotal < oppTotal) winner = 'initiator';
          else if (oppTotal < initTotal) winner = 'opponent';
          else {
            if (tieRule === 'initiator_win') winner = 'initiator';
            else if (tieRule === 'initiator_lose') winner = 'opponent';
          }
          break;
        case 'rank':
          if (initTotal > oppTotal) winner = 'initiator';
          else if (oppTotal > initTotal) winner = 'opponent';
          else {
            if (tieRule === 'initiator_win') winner = 'initiator';
            else if (tieRule === 'initiator_lose') winner = 'opponent';
          }
          break;
        case 'none':
          break;
      }

      const winnerText =
        winner === 'initiator'
          ? `${deps.replaceUserPlaceholders(initName)} 获胜`
          : winner === 'opponent'
            ? `${deps.replaceUserPlaceholders(oppName)} 获胜`
            : judgeRule === 'none'
              ? '无判定'
              : '平局';

      const contestTitle = initAttrName === oppAttrName ? initAttrName : `${initAttrName} vs ${oppAttrName}`;
      const compareSymbol = judgeRule === 'lower' ? '<' : '>';
      let compareExpr = `${initTotal} ${compareSymbol} ${oppTotal}`;
      if (winner === 'tie' || judgeRule === 'none') {
        compareExpr = `${initTotal} = ${oppTotal}`;
      }

      // 生成输出文本（单行，避免冗余换行）
      const outputText = `<meta:检定结果>【${contestTitle}】对抗检定：${deps.replaceUserPlaceholders(initName)}(${initDiceExpr})=${initTotal}，${deps.replaceUserPlaceholders(oppName)}(${oppDiceExpr})=${oppTotal}，判定 ${compareExpr}，${winnerText}</meta:检定结果>`;

      // 插入到输入框
      deps.smartInsertToTextarea(outputText, 'dice');

      // 更新结果显示
      const diceCfg = deps.getDiceConfig();
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;

      const initDisplayRoll = hideDiceResultFromUser ? '？？' : initTotal;
      const oppDisplayRoll = hideDiceResultFromUser ? '？？' : oppTotal;
      const showOutcome = judgeRule !== 'none' && !hideDiceResultFromUser;
      const initOutcomeText = showOutcome ? (winner === 'tie' ? '平局' : winner === 'initiator' ? '胜' : '负') : '';
      const oppOutcomeText = showOutcome ? (winner === 'tie' ? '平局' : winner === 'opponent' ? '胜' : '负') : '';

      panel.find('#contest-result-init').html(`
        <div class="acu-contest-result-name">${deps.escapeHtml(deps.replaceUserPlaceholders(initName))}</div>
        <div class="acu-contest-result-roll">${initDisplayRoll}</div>
        ${showOutcome ? `<div class="acu-contest-result-outcome">${initOutcomeText}</div>` : ''}
      `);

      panel.find('#contest-result-opp').html(`
        <div class="acu-contest-result-name">${deps.escapeHtml(deps.replaceUserPlaceholders(oppName))}</div>
        <div class="acu-contest-result-roll">${oppDisplayRoll}</div>
        ${showOutcome ? `<div class="acu-contest-result-outcome">${oppOutcomeText}</div>` : ''}
      `);

      // 高亮胜者
      panel.find('#contest-result-init').removeClass('winner loser');
      panel.find('#contest-result-opp').removeClass('winner loser');
      if (!hideDiceResultFromUser && judgeRule !== 'none') {
        if (winner === 'initiator') {
          panel.find('#contest-result-init').addClass('winner');
          panel.find('#contest-result-opp').addClass('loser');
        } else if (winner === 'opponent') {
          panel.find('#contest-result-init').addClass('loser');
          panel.find('#contest-result-opp').addClass('winner');
        }
      }

      // 显示结果区
      panel.find('#contest-result-display').show();

      // 更新按钮显示重投
      $btn.html(`
        <div class="acu-dice-result-display">
          <span>${hideDiceResultFromUser ? '？？' : winnerText}</span>
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮
      $btn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e: any) {
        e.stopPropagation();
        e.preventDefault();
        performCustomContestRoll();
      });

      const winnerSide: 'left' | 'right' | 'tie' =
        winner === 'initiator' ? 'left' : winner === 'opponent' ? 'right' : 'tie';
      const customContestResult: Record<string, any> = {
        left: {
          name: initName,
          attribute: initAttrName,
          roll: initTotal,
          target: 0,
          successLevel: winner === 'initiator' ? 1 : winner === 'tie' ? 0 : -1,
        },
        right: {
          name: oppName,
          attribute: oppAttrName,
          roll: oppTotal,
          target: 0,
          successLevel: winner === 'opponent' ? 1 : winner === 'tie' ? 0 : -1,
        },
        winner: winnerSide,
        message: winnerText,
      };

      const customContestWithTimestamp = {
        ...customContestResult,
        timestamp: Date.now(),
        detailId: `contest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        detailLines: [
          `发起方: ${initName} / 对抗方: ${oppName}`,
          `属性: ${initAttrName} vs ${oppAttrName}`,
          `公式: ${initDiceExpr} vs ${oppDiceExpr}`,
          `掷骰: ${initTotal} vs ${oppTotal}`,
          `判定规则: ${judgeRule}`,
          `平手规则: ${tieRule}`,
          `判定表达式: ${compareExpr}`,
          `结果: ${winnerText}`,
        ],
      };
      deps.getContestHistory().push(customContestWithTimestamp);
      if (deps.getContestHistory().length > deps.getMAX_HISTORY()) {
        deps.getContestHistory().shift();
      }
      deps.emitEvent('contest', customContestWithTimestamp);
    };

    let lastContestRollAt = 0;
    // 对抗检定投骰逻辑函数（可被按钮点击和重投按钮调用）
    const performContestRoll = function () {
      const $btn = panel.find('#contest-roll-btn');
      const $row = panel.find('.acu-contest-result-row');
      const now = Date.now();
      if (now - lastContestRollAt < 100) return;
      lastContestRollAt = now;

      // 锁定按钮和结果行防止连点
      if ($btn.prop('disabled') || $row.hasClass('disabled')) return;

      const lockUI = () => {
        $btn.prop('disabled', true).addClass('disabled');
        $row.addClass('disabled').css('pointer-events', 'none');
      };
      const unlockUI = () => {
        $btn.prop('disabled', false).removeClass('disabled');
        $row.removeClass('disabled').css('pointer-events', '');
      };

      lockUI();
      setTimeout(unlockUI, 100);

      // [修复] 如果处于自定义模式,使用自定义对抗掷骰逻辑
      // 检查骰子语法行是否可见来判断是否为自定义模式
      if (panel.find('#contest-init-dice-syntax-row').is(':visible')) {
        performCustomContestRoll();
        return;
      }

      var formula = panel.find('#contest-dice-type').val() || '1d100';
      const activePreset = currentContestAdvancedPreset || deps.AdvancedDicePresetManager.getActivePreset();
      const hasAdvancedPreset =
        !!activePreset &&
        'outcomes' in activePreset &&
        Array.isArray(activePreset.outcomes) &&
        activePreset.outcomes.length > 0;

      try {
        const rawDataForAlias = deps.getCachedRawData() || deps.getTableData();
        if (rawDataForAlias) {
          deps.NameAliasRegistry.rebuild(deps.processJsonData(rawDataForAlias || {}));
        }
      } catch (error) {
        console.warn('[DICE] 对抗别名映射刷新失败:', error);
      }

      var initNameRaw = (panel.find('#contest-init-display').val() || '').toString().trim() || '<user>';
      var initName = deps.resolveCanonicalCharacterName(initNameRaw);
      var initAttrName = (panel.find('#contest-init-name').val() || '').toString().trim() || '自由检定';
      // 辅助函数：根据骰子公式计算最大值的一半
      var getHalfMax = function (formulaStr: any) {
        var m = formulaStr.match(/(\d+)d(\d+)/i);
        if (m) return Math.round((parseInt(m[1], 10) * parseInt(m[2], 10)) / 2);
        return 50;
      };
      const resolveDefaultValue = function (
        defaultValue: number | string | undefined,
        context: Record<string, number>,
      ): number {
        if (defaultValue === undefined) return 0;
        if (typeof defaultValue === 'number') return defaultValue;
        const result = deps.evaluateFormula(defaultValue, context);
        if (result === 0 && defaultValue !== '0' && String(defaultValue) !== '0') {
          if (window.toastr) {
            window.toastr.warning(`表达式 "${defaultValue}" 求值失败,使用默认值 0`);
          }
        }
        return result || 0;
      };

      // 解析修正值，支持纯数字和骰子表达式
      const parseModifier = function (modStr: string): number {
        if (!modStr || modStr.trim() === '') return 0;
        const trimmed = modStr.trim();

        // 尝试直接解析为数字
        const numValue = parseFloat(trimmed);
        if (!isNaN(numValue) && isFinite(numValue) && trimmed.match(/^-?\d+(\.\d+)?$/)) {
          return numValue;
        }

        const rollResult = rollComplexDiceExpression(trimmed);
        if (!Number.isNaN(rollResult.total)) return rollResult.total;
        return 0;
      };

      var initValueInput = (panel.find('#contest-init-value').val() || '').toString().trim();
      var initValue;
      if (initValueInput === '') {
        // 属性值留空：高级预设使用默认值，否则使用骰子最大值的一半
        if (hasAdvancedPreset && activePreset && 'attribute' in activePreset) {
          initValue = resolveDefaultValue(activePreset.attribute?.defaultValue, {});
        } else {
          initValue = getHalfMax(formula);
        }
      } else {
        initValue = parseInt(initValueInput, 10) || getHalfMax(formula);
      }
      var initTargetInput = (panel.find('#contest-init-target').val() || '').toString().trim();
      var initTarget;
      if (initTargetInput !== '') {
        initTarget = parseInt(initTargetInput, 10);
      } else {
        // 目标值留空：高级预设使用默认值，否则使用属性值（若属性值也是默认的，则两者相等）
        if (hasAdvancedPreset && activePreset && 'dc' in activePreset) {
          initTarget = resolveDefaultValue(activePreset.dc?.defaultValue, { $attr: initValue });
        } else {
          initTarget = initValue;
        }
      }

      var oppNameRaw = (panel.find('#contest-opponent-display').val() || '').toString().trim() || '对手';
      var oppName = deps.resolveCanonicalCharacterName(oppNameRaw);
      var oppAttrName = (panel.find('#contest-opp-name').val() || '').toString().trim() || initAttrName;
      var oppValueInput = (panel.find('#contest-opp-value').val() || '').toString().trim();
      var oppValue;
      if (oppValueInput === '') {
        // 属性值留空：高级预设使用默认值，否则使用骰子最大值的一半
        if (hasAdvancedPreset && activePreset && 'attribute' in activePreset) {
          oppValue = resolveDefaultValue(activePreset.attribute?.defaultValue, {});
        } else {
          oppValue = getHalfMax(formula);
        }
      } else {
        oppValue = parseInt(oppValueInput, 10) || getHalfMax(formula);
      }
      var oppTargetInput = (panel.find('#contest-opp-target').val() || '').toString().trim();
      var oppTarget;
      if (oppTargetInput !== '') {
        oppTarget = parseInt(oppTargetInput, 10);
      } else {
        // 目标值留空：高级预设使用默认值，否则使用属性值
        if (hasAdvancedPreset && activePreset && 'dc' in activePreset) {
          oppTarget = resolveDefaultValue(activePreset.dc?.defaultValue, { $attr: oppValue });
        } else {
          oppTarget = oppValue;
        }
      }

      var initModInput = (panel.find('#contest-init-mod').val() || '').toString().trim();
      var oppModInput = (panel.find('#contest-opp-mod').val() || '').toString().trim();
      var initSkillModInput = (panel.find('#contest-init-skill-mod').val() || '').toString().trim();
      var oppSkillModInput = (panel.find('#contest-opp-skill-mod').val() || '').toString().trim();
      var initMod = initModInput !== '' ? parseModifier(initModInput) : 0;
      var oppMod = oppModInput !== '' ? parseModifier(oppModInput) : 0;

      // 解析技能加值（若预设启用 skillMod）
      var initSkillMod = 0;
      var oppSkillMod = 0;

      const allPresets = deps.AdvancedDicePresetManager.getAllPresets();
      const fallbackPresetId = /d100/i.test(formula) ? 'coc7_check' : 'dnd5e_check';
      const fallbackPreset = allPresets.find((p: any) => p.id === fallbackPresetId);
      const preset =
        activePreset &&
        'outcomes' in activePreset &&
        Array.isArray(activePreset.outcomes) &&
        activePreset.outcomes.length > 0
          ? activePreset
          : fallbackPreset;

      if (!preset || !Array.isArray(preset.outcomes) || preset.outcomes.length === 0) {
        console.warn('[DICE] 对抗检定未找到可用预设或 outcomes');
        return;
      }

      if (preset.mod?.hidden) {
        initMod = 0;
        oppMod = 0;
      }

      if (preset.dc?.hidden) {
        initTarget = resolveDefaultValue(preset.dc?.defaultValue, { $attr: initValue });
        oppTarget = resolveDefaultValue(preset.dc?.defaultValue, { $attr: oppValue });
      }

      const hideSkillModInContest =
        !preset.skillMod || preset.contestRule?.hideSkillMod === true || preset.skillMod.hidden === true;
      if (!hideSkillModInContest && preset.skillMod) {
        if (initSkillModInput !== '') {
          initSkillMod = parseModifier(initSkillModInput);
        } else {
          initSkillMod = resolveDefaultValue(preset.skillMod.defaultValue, { $attr: initValue });
        }

        if (oppSkillModInput !== '') {
          oppSkillMod = parseModifier(oppSkillModInput);
        } else {
          oppSkillMod = resolveDefaultValue(preset.skillMod.defaultValue, { $attr: oppValue });
        }
      }

      // [新增] 收集双方的 customFields
      const collectContestCustomFields = (party: 'init' | 'opp'): Record<string, number | string | boolean> => {
        const customValues: Record<string, number | string | boolean> = {};
        if (!('customFields' in preset) || !Array.isArray(preset.customFields) || preset.customFields.length === 0) {
          return customValues;
        }

        const $customFields = panel.find(`.acu-dice-custom-field-contest[data-party="${party}"]`);
        $customFields.each(function (this: any) {
          const $el = $(this);
          const id = $el.data('id');
          const fieldConfig = preset.customFields.find((f: any) => f.id === id);
          if (!fieldConfig) return;

          let val: string | number | boolean;
          if (fieldConfig.type === 'toggle') {
            val = $el.prop('checked');
          } else if (fieldConfig.type === 'number') {
            const num = parseFloat($el.val() as string);
            val = isNaN(num) ? (fieldConfig.defaultValue as number) : num;
          } else if (fieldConfig.type === 'select') {
            const rawVal = $el.val() as string;
            const num = parseFloat(rawVal);
            val = isNaN(num) ? rawVal : num;
          } else {
            const rawVal = String($el.val() ?? '').trim();
            if (rawVal === '' && fieldConfig.defaultValue !== undefined && fieldConfig.defaultValue !== '') {
              val = fieldConfig.defaultValue as string | number | boolean;
            } else {
              val = rawVal;
            }
          }
          customValues['$' + id] = val;
        });
        return customValues;
      };

      // [新增] 计算派生变量
      const computeDerivedVars = (
        customValues: Record<string, number | string | boolean>,
        attrValue: number,
        modValue: number,
        dcValue: number,
      ): Record<string, number> => {
        const derivedValues: Record<string, number> = {};
        if (!('derivedVars' in preset) || !Array.isArray(preset.derivedVars) || preset.derivedVars.length === 0) {
          return derivedValues;
        }

        const baseContext = {
          $attr: attrValue,
          $dc: dcValue,
          $mod: modValue,
          ...customValues,
        };

        preset.derivedVars.forEach((spec: any) => {
          const id = spec?.id?.trim();
          if (!id) return;
          const varName = id.startsWith('$') ? id : `$${id}`;
          const evalResult = deps.evaluateCondition(spec.expr, { ...baseContext, ...derivedValues });
          if (!evalResult.success) {
            console.warn(`[DICE] 对抗检定派生变量 ${varName} 计算失败:`, evalResult.error);
            derivedValues[varName] = 0;
            return;
          }
          const rawValue = evalResult.value;
          const numericValue = typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
          derivedValues[varName] = numericValue;
        });
        return derivedValues;
      };

      // [新增] 应用 dicePatches
      const applyDicePatches = (
        baseFormula: string,
        customValues: Record<string, number | string | boolean>,
        derivedValues: Record<string, number>,
        attrValue: number,
        modValue: number,
        dcValue: number,
      ): string => {
        if (!('dicePatches' in preset) || !Array.isArray(preset.dicePatches) || preset.dicePatches.length === 0) {
          return baseFormula;
        }

        const patchContext = {
          $attr: attrValue,
          $dc: dcValue,
          $mod: modValue,
          ...customValues,
          ...derivedValues,
        };

        const replacePatchTemplate = (template: string): string => {
          const varPattern = /\$[a-zA-Z_]\w*/g;
          return template.replace(varPattern, match => {
            const value = (patchContext as Record<string, any>)[match];
            return typeof value === 'number' && Number.isFinite(value) ? String(value) : '0';
          });
        };

        let diceExpression = baseFormula;
        preset.dicePatches.forEach((patch: any) => {
          if (!patch) return;
          if (patch.when) {
            const conditionResult = deps.evaluateCondition(patch.when, patchContext);
            if (!conditionResult.success) {
              console.warn('[DICE] 对抗检定 dicePatches 条件评估失败:', conditionResult.error);
              return;
            }
            const shouldApply =
              typeof conditionResult.value === 'number' ? conditionResult.value !== 0 : Boolean(conditionResult.value);
            if (!shouldApply) return;
          }

          const resolvedTemplate = replacePatchTemplate(patch.template ?? '');
          switch (patch.op) {
            case 'append':
              diceExpression = `${diceExpression}${resolvedTemplate}`;
              break;
            case 'prepend':
              diceExpression = `${resolvedTemplate}${diceExpression}`;
              break;
            case 'replace':
              diceExpression = resolvedTemplate;
              break;
          }
        });
        return diceExpression;
      };

      // 收集发起方 customFields 并计算公式
      const initCustomValues = collectContestCustomFields('init');
      const initDerivedValues = computeDerivedVars(initCustomValues, initValue, initMod, initTarget);
      const initFormula = applyDicePatches(
        formula,
        initCustomValues,
        initDerivedValues,
        initValue,
        initMod,
        initTarget,
      );

      // 收集对抗方 customFields 并计算公式
      const oppCustomValues = collectContestCustomFields('opp');
      const oppDerivedValues = computeDerivedVars(oppCustomValues, oppValue, oppMod, oppTarget);
      const oppFormula = applyDicePatches(formula, oppCustomValues, oppDerivedValues, oppValue, oppMod, oppTarget);

      // 投骰（使用各自的公式）
      const initResult = rollComplexDiceExpression(initFormula);
      const oppResult = rollComplexDiceExpression(oppFormula);
      if (Number.isNaN(initResult.total) || Number.isNaN(oppResult.total)) {
        const errorFormula = Number.isNaN(initResult.total) ? initFormula : oppFormula;
        console.warn('[DICE] 对抗检定骰子语法错误:', errorFormula);
        if (window.toastr)
          showActionableErrorToast(`骰子语法错误: ${errorFormula}`, {
            suggestion: '请检查对抗检定预设公式，只使用形如 1d100、2d6+3 的合法写法。',
          });
        return;
      }
      const initRollTotal = initResult.total;
      const oppRollTotal = oppResult.total;

      console.log('[DICE] 对抗检定公式 - 发起方:', initFormula, '对抗方:', oppFormula);

      // 计算 attrMod（如果预设有 computeModifier）
      let initAttrMod = 0;
      let oppAttrMod = 0;
      if ('attribute' in preset && preset.attribute?.computeModifier) {
        const modFormula = preset.attribute.computeModifier;
        initAttrMod = deps.evaluateConditionNumber(modFormula, { $attr: initValue }, 0);
        oppAttrMod = deps.evaluateConditionNumber(modFormula, { $attr: oppValue }, 0);
      }

      const initContext = {
        $roll: initResult,
        $attr: initValue,
        $attrMod: initAttrMod,
        $skillMod: initSkillMod,
        $dc: initTarget,
        $mod: initMod,
        ...initCustomValues,
        ...initDerivedValues,
      };
      const oppContext = {
        $roll: oppResult,
        $attr: oppValue,
        $attrMod: oppAttrMod,
        $skillMod: oppSkillMod,
        $dc: oppTarget,
        $mod: oppMod,
        ...oppCustomValues,
        ...oppDerivedValues,
      };

      const initOutcomeResult = deps.applyAdvancedPresetOutcomePolicy(
        preset,
        deps.evaluateOutcomes(preset.outcomes, initContext),
        initContext,
      );
      const oppOutcomeResult = deps.applyAdvancedPresetOutcomePolicy(
        preset,
        deps.evaluateOutcomes(preset.outcomes, oppContext),
        oppContext,
      );
      const initOutcome = initOutcomeResult.outcome;
      const oppOutcome = oppOutcomeResult.outcome;
      const winnerSide = resolveContest(
        preset,
        initOutcome,
        oppOutcome,
        initRollTotal + initAttrMod + initSkillMod + initMod,
        oppRollTotal + oppAttrMod + oppSkillMod + oppMod,
        initValue,
        oppValue,
      );

      let winnerText = '平局';
      let winnerResultType = 'warning';
      if (winnerSide === 'initiator') {
        winnerText = initName + ' 胜利';
        winnerResultType = 'success';
      } else if (winnerSide === 'opponent') {
        winnerText = oppName + ' 胜利';
        winnerResultType = 'failure';
      }

      var diceCfg = deps.getDiceConfig();
      var hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      var displayInitValue = hideDiceResultFromUser ? '？？' : initRollTotal;
      var displayOppValue = hideDiceResultFromUser ? '？？' : oppRollTotal;
      var displayInitSuccessName = hideDiceResultFromUser ? '' : initOutcome.name;
      var displayOppSuccessName = hideDiceResultFromUser ? '' : oppOutcome.name;
      var displayWinner = hideDiceResultFromUser ? '' : winnerText;

      const getResultTypeFromOutcome = (outcome: OutcomeLevel) => {
        if (outcome.priority <= 10) return 'critSuccess';
        if (outcome.priority <= 30) return 'extremeSuccess';
        if (outcome.priority < 50) return 'success';
        if (outcome.priority === 50) return 'warning';
        if (outcome.priority < 90) return 'failure';
        return 'critFailure';
      };

      const initResultType = getResultTypeFromOutcome(initOutcome);
      const oppResultType = getResultTypeFromOutcome(oppOutcome);

      const initBadgeClass = deps.getResultBadgeClass(initResultType);
      const oppBadgeClass = deps.getResultBadgeClass(oppResultType);
      // 胜者文字颜色类名
      const winnerColorClass =
        winnerResultType === 'success'
          ? 'acu-contest-winner-success'
          : winnerResultType === 'warning'
            ? 'acu-contest-winner-warning'
            : 'acu-contest-winner-failure';

      // 显示结果展示区域
      const $resultDisplay = panel.find('#contest-result-display');
      const $resultInit = panel.find('#contest-result-init');
      const $resultOpp = panel.find('#contest-result-opp');

      // 显示发起方结果
      $resultInit.html(
        '<span class="acu-contest-result-name">' +
          deps.escapeHtml(initName) +
          '</span>' +
          '<span class="acu-contest-result-value">' +
          displayInitValue +
          '</span>' +
          (displayInitSuccessName ? '<span class="' + initBadgeClass + '">' + displayInitSuccessName + '</span>' : ''),
      );

      // 显示对抗方结果
      $resultOpp.html(
        (displayOppSuccessName ? '<span class="' + oppBadgeClass + '">' + displayOppSuccessName + '</span>' : '') +
          '<span class="acu-contest-result-value">' +
          displayOppValue +
          '</span>' +
          '<span class="acu-contest-result-name">' +
          deps.escapeHtml(oppName) +
          '</span>',
      );

      // 将结果显示区域改为两行布局：第一行显示双方信息，第二行显示最终结果和重roll按钮
      $resultDisplay.html(
        '<div class="acu-contest-result-container" title="点击重新投骰">' +
          // 第一行：双方名字、点数、检定结果
          '<div class="acu-contest-result-row">' +
          '<div class="acu-contest-result-inner">' +
          '<div id="contest-result-init" class="acu-contest-result-side">' +
          '<span class="acu-contest-result-name">' +
          deps.escapeHtml(initName) +
          '</span>' +
          '<span class="acu-contest-result-value">' +
          displayInitValue +
          '</span>' +
          (displayInitSuccessName ? '<span class="' + initBadgeClass + '">' + displayInitSuccessName + '</span>' : '') +
          '</div>' +
          '<span class="acu-contest-vs">VS</span>' +
          '<div id="contest-result-opp" class="acu-contest-result-side right">' +
          (displayOppSuccessName ? '<span class="' + oppBadgeClass + '">' + displayOppSuccessName + '</span>' : '') +
          '<span class="acu-contest-result-value">' +
          displayOppValue +
          '</span>' +
          '<span class="acu-contest-result-name">' +
          deps.escapeHtml(oppName) +
          '</span>' +
          '</div>' +
          '</div>' +
          '</div>' +
          // 第二行：最终结果 + 重roll箭头
          '<div class="acu-contest-result-winner-row">' +
          '<span class="acu-contest-winner-text ' +
          winnerColorClass +
          '">' +
          displayWinner +
          '</span>' +
          '<i class="fa-solid fa-rotate-right acu-contest-reroll-icon"></i>' +
          '</div>' +
          '</div>',
      );
      $resultDisplay.show();

      // 绑定整行点击事件进行重投
      $resultDisplay.off('click').on('click', function (e: any) {
        e.stopPropagation();
        e.preventDefault();
        performContestRoll();
      });

      // 隐藏原按钮
      const $contestBtn = panel.find('#contest-roll-btn');
      $contestBtn.hide();

      // 构建对抗检定结果文本 (使用模板系统)
      const template = preset.contestOutputTemplate || deps.DEFAULT_CONTEST_OUTPUT_TEMPLATE;
      // 使用 displayExpr（如果有）或 condition 作为显示表达式
      const initDisplayOutcome = deps.getAdvancedPresetDisplayOutcome(initOutcomeResult);
      const oppDisplayOutcome = deps.getAdvancedPresetDisplayOutcome(oppOutcomeResult);
      const initDisplayExpr = initDisplayOutcome.displayExpr ?? initDisplayOutcome.condition;
      const oppDisplayExpr = oppDisplayOutcome.displayExpr ?? oppDisplayOutcome.condition;
      // 先处理 $roll.hasTag() 方法调用
      let initConditionExpr = initDisplayExpr.replace(
        /\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi,
        (_match: any, tag: any) => {
          return (initResult.tags ?? []).includes(tag) ? '成立' : '不成立';
        },
      );
      initConditionExpr = initConditionExpr
        .replace(/\$roll\.total/g, String(initRollTotal)) // 先替换 $roll.total
        .replace(/\$roll/g, String(initRollTotal))
        .replace(/\$attrMod/g, String(initAttrMod))
        .replace(/\$skillMod/g, String(initSkillMod))
        .replace(/\$attr/g, String(initValue))
        .replace(/\$dc/g, String(initTarget))
        .replace(/\$mod/g, String(initMod));
      let oppConditionExpr = oppDisplayExpr.replace(/\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi, (_match: any, tag: any) => {
        return (oppResult.tags ?? []).includes(tag) ? '成立' : '不成立';
      });
      oppConditionExpr = oppConditionExpr
        .replace(/\$roll\.total/g, String(oppRollTotal)) // 先替换 $roll.total
        .replace(/\$roll/g, String(oppRollTotal))
        .replace(/\$attrMod/g, String(oppAttrMod))
        .replace(/\$skillMod/g, String(oppSkillMod))
        .replace(/\$attr/g, String(oppValue))
        .replace(/\$dc/g, String(oppTarget))
        .replace(/\$mod/g, String(oppMod));
      // 计算 displayExpr 的布尔值来决定"成立/不成立"
      // 注意：复用前面已定义的 initContext 和 oppContext
      const initDisplayExprResult = deps.evaluateCondition(initDisplayExpr, initContext);
      const oppDisplayExprResult = deps.evaluateCondition(oppDisplayExpr, oppContext);
      const initJudgeResult =
        initDisplayExprResult.success &&
        (typeof initDisplayExprResult.value === 'number'
          ? initDisplayExprResult.value !== 0
          : Boolean(initDisplayExprResult.value))
          ? '成立'
          : '不成立';
      const oppJudgeResult =
        oppDisplayExprResult.success &&
        (typeof oppDisplayExprResult.value === 'number'
          ? oppDisplayExprResult.value !== 0
          : Boolean(oppDisplayExprResult.value))
          ? '成立'
          : '不成立';
      const initOutcomeText = initOutcome.outputText || initOutcome.name || '判定完成';
      const oppOutcomeText = oppOutcome.outputText || oppOutcome.name || '判定完成';
      // 计算总值（投骰 + 属性调整值 + 技能加值 + 额外修正）和差值
      const initTotal = initRollTotal + initAttrMod + initSkillMod + initMod;
      const oppTotal = oppRollTotal + oppAttrMod + oppSkillMod + oppMod;
      const margin = initTotal - oppTotal;

      // [新增] 条件文本变量：当值为0时隐藏整个片段（包括标签）
      // 发起方
      const initAttrModStr = initAttrMod >= 0 ? `+${initAttrMod}` : String(initAttrMod);
      const initSkillModStr = initSkillMod >= 0 ? `+${initSkillMod}` : String(initSkillMod);
      const initAttrModText = initAttrMod !== 0 ? `，调整值${initAttrModStr}` : '';
      const initSkillModText = initSkillMod !== 0 ? `+技能加值${initSkillModStr}` : '';
      const initModText = initMod !== 0 ? `+额外加值${initMod >= 0 ? '+' + initMod : initMod}` : '';
      // 对抗方
      const oppAttrModStr = oppAttrMod >= 0 ? `+${oppAttrMod}` : String(oppAttrMod);
      const oppSkillModStr = oppSkillMod >= 0 ? `+${oppSkillMod}` : String(oppSkillMod);
      const oppAttrModText = oppAttrMod !== 0 ? `，调整值${oppAttrModStr}` : '';
      const oppSkillModText = oppSkillMod !== 0 ? `+技能加值${oppSkillModStr}` : '';
      const oppModText = oppMod !== 0 ? `+额外加值${oppMod >= 0 ? '+' + oppMod : oppMod}` : '';
      const initCheckValueText = deps.buildCheckValueText({
        preset,
        characterName: initName,
        actionName: initAttrName,
        attrValue: initValue,
        attrMod: initAttrMod,
        skillMod: initSkillMod,
        mode: 'contest',
      });
      const oppCheckValueText = deps.buildCheckValueText({
        preset,
        characterName: oppName,
        actionName: oppAttrName,
        attrValue: oppValue,
        attrMod: oppAttrMod,
        skillMod: oppSkillMod,
        mode: 'contest',
      });

      const contestOutputContext = {
        initiator: initName,
        opponent: oppName,
        initAttrName: initAttrName,
        oppAttrName: oppAttrName,
        initRoll: initRollTotal,
        oppRoll: oppRollTotal,
        initDisplayValue: initTotal,
        oppDisplayValue: oppTotal,
        initTarget: initTarget,
        oppTarget: oppTarget,
        initSuccessName: initOutcome.name,
        oppSuccessName: oppOutcome.name,
        winner: winnerText, // "XXX 胜利" 或 "平局"
        outcomeText: initOutcomeText,
        outcomeName: initOutcome.name,
        conditionExpr: initConditionExpr,
        judgeResult: initJudgeResult,
        formula: initFormula,
        initFormula: initFormula,
        oppFormula: oppFormula,
        roll: initRollTotal,
        dc: initTarget,
        mod: initMod,
        attr: initValue,
        attrName: `【${initAttrName}】`,
        initOutcomeText: initOutcomeText,
        oppOutcomeText: oppOutcomeText,
        initConditionExpr: initConditionExpr,
        oppConditionExpr: oppConditionExpr,
        initJudgeResult: initJudgeResult,
        oppJudgeResult: oppJudgeResult,
        // 属性调整值（用于 DND 等系统）
        initAttrMod: initAttrMod,
        oppAttrMod: oppAttrMod,
        // 技能加值（用于 DND 等系统）
        initSkillMod: initSkillMod,
        oppSkillMod: oppSkillMod,
        initMod: initMod,
        oppMod: oppMod,
        // [新增] 条件文本变量（零值时隐藏整个片段）
        initAttrModText: initAttrModText,
        oppAttrModText: oppAttrModText,
        initSkillModText: initSkillModText,
        oppSkillModText: oppSkillModText,
        initModText: initModText,
        oppModText: oppModText,
        initCheckValueText: initCheckValueText,
        oppCheckValueText: oppCheckValueText,
        // 总值和差值（用于 DND/Fate 等系统）
        initTotal: initTotal,
        oppTotal: oppTotal,
        margin: margin,
        shifts: margin, // Fate 术语别名
        // [新增] 双方原始属性值（技能等级）
        initAttr: initValue,
        oppAttr: oppValue,
      };
      const contestResultText = deps.formatOutputTemplate(template, contestOutputContext);
      deps.smartInsertToTextarea(contestResultText, 'dice');

      // 构建对抗检定结果对象
      const getOutcomeLevel = (outcome: OutcomeLevel) => {
        if (outcome.priority <= 10) return 3;
        if (outcome.priority <= 30) return 2;
        if (outcome.priority < 50) return 1;
        if (outcome.priority === 50) return 0;
        return -1;
      };
      const contestResult: Record<string, any> = {
        left: {
          name: initName,
          attribute: initAttrName,
          roll: initRollTotal,
          target: initTarget,
          successLevel: getOutcomeLevel(initOutcome),
        },
        right: {
          name: oppName,
          attribute: oppAttrName,
          roll: oppRollTotal,
          target: oppTarget,
          successLevel: getOutcomeLevel(oppOutcome),
        },
        winner: winnerSide === 'initiator' ? 'left' : winnerSide === 'opponent' ? 'right' : 'tie',
        message: winnerText,
      };

      // 添加到历史记录
      const contestDetailId = `contest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const contestResultWithTimestamp = {
        ...contestResult,
        timestamp: Date.now(),
        detailId: contestDetailId,
        historyType: 'contest' as const,
        detailLines: [
          `发起方: ${initName} / 对抗方: ${oppName}`,
          `属性: ${initAttrName} vs ${oppAttrName}`,
          `公式: ${initFormula} vs ${oppFormula}`,
          `掷骰: ${initRollTotal} vs ${oppRollTotal}`,
          `总值: ${initTotal} vs ${oppTotal}`,
          `判定: ${initConditionExpr} | ${oppConditionExpr}`,
          `结果: ${winnerText}`,
        ],
      };
      deps.getContestHistory().push(contestResultWithTimestamp);
      if (deps.getContestHistory().length > deps.getMAX_HISTORY()) {
        deps.getContestHistory().shift();
      }

      // 触发事件
      deps.emitEvent('contest', contestResultWithTimestamp);
    };

    // 绑定对抗检定按钮点击事件
    panel.find('#contest-roll-btn').click(function () {
      performContestRoll();
    });

    // [新增] 切换到普通检定
    panel.find('#contest-switch-normal').click(function () {
      var initValueInput = panel.find('#contest-init-value').val().trim();
      var currentInitName = panel.find('#contest-init-name').val() || '';
      var currentDice = panel.find('#contest-dice-type').val() || '1d100';
      var initiatorNameVal = panel.find('#contest-init-display').val().trim();
      closePanel();
      deps.showDicePanel({
        // 只有用户实际输入了值才传递，否则传 null 让普通检定面板显示 placeholder
        attrValue: initValueInput !== '' ? parseInt(initValueInput, 10) : null,
        targetValue: null,
        targetName: currentInitName,
        diceType: currentDice,
        initiatorName: initiatorNameVal,
      });
    });
    panel.find('#contest-history-btn').click(function (e: any) {
      e.stopPropagation();
      deps.showGlobalDiceHistoryDialog();
    });
    // 齿轮设置按钮点击 - 调用统一设置面板
    // 对抗检定根据当前骰子类型判断规则：1d20 -> DND, 其他 -> COC
    panel.find('.acu-contest-config-btn').click(function (e: any) {
      e.stopPropagation();
      // [废弃] 旧的规则设置弹窗调用已替换为高级检定管理
      // const currentDice = panel.find('#contest-dice-type').val() || '1d100';
      // const isDND = currentDice === '1d20';
      // showDiceSettingsPanel(isDND);
      deps.showAdvancedPresetManager({ fromDicePanel: true });
    });
    var closePanel = function () {
      overlay.remove();
      panel.remove();
    };
    panel.on('click', function (e: any) {
      e.stopPropagation();
    });
    overlay.click(closePanel);
    panel.find('.acu-contest-close').click(closePanel);
  };
  return showContestPanel;
}
