/**
 * contest / contest-panel-bindings.ts — 对抗面板：尾部事件绑定（投骰/切换普通检定/历史/设置/关闭；从 show-contest-panel.ts 拆出，x8-e）。
 */

export function createContestPanelBindings(ctx: any) {
  const { deps, getPanel, getOverlay, performContestRoll } = ctx;

  // 绑定对抗检定按钮点击事件
  getPanel().find('#contest-roll-btn').click(function () {
    performContestRoll();
  });

  // [新增] 切换到普通检定
  getPanel().find('#contest-switch-normal').click(function () {
    var initValueInput = getPanel().find('#contest-init-value').val().trim();
    var currentInitName = getPanel().find('#contest-init-name').val() || '';
    var currentDice = getPanel().find('#contest-dice-type').val() || '1d100';
    var initiatorNameVal = getPanel().find('#contest-init-display').val().trim();
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
  getPanel().find('#contest-history-btn').click(function (e: any) {
    e.stopPropagation();
    deps.showGlobalDiceHistoryDialog();
  });
  // 齿轮设置按钮点击 - 调用统一设置面板
  // 对抗检定根据当前骰子类型判断规则：1d20 -> DND, 其他 -> COC
  getPanel().find('.acu-contest-config-btn').click(function (e: any) {
    e.stopPropagation();
    // [废弃] 旧的规则设置弹窗调用已替换为高级检定管理
    // const currentDice = getPanel().find('#contest-dice-type').val() || '1d100';
    // const isDND = currentDice === '1d20';
    // showDiceSettingsPanel(isDND);
    deps.showAdvancedPresetManager({ fromDicePanel: true });
  });
  var closePanel = function () {
    getOverlay().remove();
    getPanel().remove();
  };
  getPanel().on('click', function (e: any) {
    e.stopPropagation();
  });
  getOverlay().click(closePanel);
  getPanel().find('.acu-contest-close').click(closePanel);
}
