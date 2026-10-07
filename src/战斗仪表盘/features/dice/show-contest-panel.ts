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
import { createContestPanelInit } from './contest/contest-panel-init';
export function createShowContestPanel(deps: any) {
  const showContestPanel = (options: Record<string, any> = {}) => {
    const { $ } = deps.getCore();
    $('.acu-dice-panel, .acu-dice-overlay, .acu-contest-panel, .acu-contest-overlay').remove();
    // [b13.6.3] 宿主模式支持（小弹窗内嵌）
    const _hostEl: any = options.hostEl || null;
    const _onCloseCb: any = options.onClose || null;

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
    if (_hostEl) {
      // [b13.6.3] 宿主模式：面板直接嵌入宿主（小弹窗）
      try {
        _hostEl.innerHTML = '';
        var _pElH: any = panel[0];
        try {
          _pElH.style.setProperty('position', 'static', 'important');
          _pElH.style.setProperty('width', '100%', 'important');
          _pElH.style.setProperty('max-width', '100%', 'important');
          _pElH.style.setProperty('max-height', 'none', 'important');
          _pElH.style.setProperty('margin', '0', 'important');
        } catch (eSH) {}
        _hostEl.appendChild(_pElH);
      } catch (eH) {}
    } else {
      overlay.append(panel);
      $('body').append(overlay);
    }
    deps.bindTutorialButtonsIn(panel);


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

    createContestPanelInit({
      deps,
      $,
      getPanel: () => panel,
      buildCharBtns,
      rebuildAttrBtns,
      characterList,
      contestAttrList,
      passedInitiatorName,
      opponentName,
      getContestAttrTargetInput,
      applyContestAdvancedPreset,
      contestAvailablePresets,
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
      getHostCtx: () => ({ hostEl: _hostEl, onClose: _onCloseCb }),
    });
  };
  return showContestPanel;
}
