/**
 * contest / build-contest-panel-html.ts — 对抗面板壳 HTML 构建（从 show-contest-panel.ts 拆出，x8-a）。
 */
export function buildContestPanelHtml(ctx: any): string {
  const { config, escapeHtml, tutorialButtonHtml, presets, activePresetId, diceType, initiatorName, initiatorValue, opponentName, opponentValue, buildAttrButtons, playerAttrs, opponentAttrs } = ctx;
  return (
    '<div class="acu-contest-panel acu-theme-' +
    config.theme +
    '">' +
    '<div class="acu-dice-panel-header">' +
    '<div class="acu-dice-panel-title"><i class="fa-solid fa-people-arrows"></i> 对抗检定</div>' +
    '<div class="acu-dice-panel-actions">' +
    tutorialButtonHtml +
    '<button type="button" id="contest-switch-normal" class="acu-dice-panel-action-btn" aria-label="切换到普通检定" title="切换到普通检定"><i class="fa-solid fa-dice-d20"></i></button>' +
    '<button type="button" id="contest-history-btn" class="acu-dice-panel-action-btn" aria-label="检定历史" title="检定历史"><i class="fa-solid fa-history"></i></button>' +
    '<button type="button" class="acu-contest-config-btn acu-dice-panel-action-btn" aria-label="掷骰规则设置" title="掷骰规则设置"><i class="fa-solid fa-cog"></i></button>' +
    '<button type="button" class="acu-contest-close acu-dice-panel-action-btn" aria-label="关闭对抗检定面板" title="关闭"><i class="fa-solid fa-times"></i></button>' +
    '</div>' +
    '</div>' +
    '<div class="acu-dice-panel-body">' +
    '<div id="contest-dice-presets-section">' +
    // [修复] 添加"检定规则"标题，与普通检定一致
    '<div class="acu-dice-section-title"><span><i class="fa-solid fa-sliders"></i> 检定规则</span></div>' +
    '<div class="acu-dice-presets">' +
    '<button type="button" class="acu-dice-quick-preset-btn" data-dice="custom" style="order: -999;">自定义</button>' +
    presets
      .map(
        (p: any) =>
          '<button type="button" class="acu-dice-quick-preset-btn' +
          // [修复] 使用activePresetId而不是diceExpression来判断active状态
          (p.id === activePresetId ? ' active' : '') +
          '" data-dice="' +
          escapeHtml(p.diceExpression || '1d100') +
          '" data-criteria="' +
          escapeHtml(p.successCriteria || 'lte') +
          '" data-preset-id="' +
          escapeHtml(p.id) +
          '">' +
          escapeHtml(p.name) +
          '</button>',
      )
      .join('') +
    '</div>' +
    '</div>' +
    '<input type="hidden" id="contest-dice-type" value="' +
    diceType +
    '">' +
    '<div class="acu-dice-section-title" id="contest-init-char-buttons-section"><span><i class="fa-solid fa-user"></i> 发起方</span><div id="contest-init-char-buttons" class="acu-dice-quick-inline"></div></div>' +
    '<div id="contest-init-params-section">' +
    '<div id="contest-init-primary-row" class="acu-dice-form-row cols-2">' +
    '<div><div class="acu-dice-form-label">名字</div><input type="text" class="acu-dice-input" id="contest-init-display" value="' +
    escapeHtml(initiatorName) +
    '" placeholder="<user>"></div>' +
    '<div><div class="acu-dice-form-label"><span class="contest-attr-name-text">属性名</span><button type="button" class="acu-random-skill-btn" id="contest-init-random-skill" title="随机技能"><i class="fa-solid fa-dice"></i></button></div><input type="text" class="acu-dice-input" id="contest-init-name" value="" placeholder="自由检定"></div>' +
    '</div>' +
    // [调整] 发起方骰子语法 (自定义模式时显示，半宽)
    '<div id="contest-init-dice-syntax-row" class="acu-dice-form-row cols-2" style="display: none;">' +
    '<div><div class="acu-dice-form-label">骰子语法</div><input type="text" id="contest-custom-dice-init" class="acu-dice-input" value="" placeholder="留空=1d100, 1d20+5..."></div>' +
    '<div></div>' +
    '</div>' +
    '<div id="contest-init-values-row" class="acu-dice-form-row cols-3">' +
    '<div id="contest-init-attr-wrapper"><div class="acu-dice-form-label" id="contest-init-attr-label">属性值</div><input type="text" class="acu-dice-input" id="contest-init-value" value="' +
    (initiatorValue !== undefined ? initiatorValue : '') +
    '" placeholder="留空=50%最大值"></div>' +
    '<div id="contest-init-skill-mod-wrapper" style="display:none;"><div class="acu-dice-form-label" id="contest-init-skill-mod-label">技能加值</div><input type="text" class="acu-dice-input" id="contest-init-skill-mod" placeholder="留空=0"></div>' +
    '<div id="contest-init-mod-wrapper"><div class="acu-dice-form-label" id="contest-init-mod-label">修正值</div><input type="text" class="acu-dice-input" id="contest-init-mod" placeholder="留空=0"></div>' +
    '<div id="contest-init-target-wrapper"><div class="acu-dice-form-label" id="contest-init-target-label">目标值</div><input type="text" class="acu-dice-input" id="contest-init-target" value="" placeholder="自动"></div>' +
    '</div>' +
    '</div>' +
    '<div id="contest-init-custom-fields"></div>' +
    '<div id="init-attr-buttons" class="acu-dice-quick-compact">' +
    buildAttrButtons(playerAttrs, 'init') +
    '</div>' +
    '<div class="acu-dice-section-title" id="contest-opp-char-buttons-section"><span><i class="fa-solid fa-user"></i> 对抗方</span><div id="contest-opp-char-buttons" class="acu-dice-quick-inline"></div></div>' +
    '<div id="contest-opp-params-section">' +
    '<div id="contest-opp-primary-row" class="acu-dice-form-row cols-2">' +
    '<div><div class="acu-dice-form-label">名字</div><input type="text" class="acu-dice-input" id="contest-opponent-display" value="' +
    escapeHtml(opponentName) +
    '" placeholder="对手"></div>' +
    '<div><div class="acu-dice-form-label"><span class="contest-attr-name-text">属性名</span><button type="button" class="acu-random-skill-btn" id="contest-opp-random-skill" title="随机技能"><i class="fa-solid fa-dice"></i></button></div><input type="text" class="acu-dice-input" id="contest-opp-name" value="" placeholder="同发起方"></div>' +
    '</div>' +
    // [调整] 对抗方骰子语法 (自定义模式时显示，半宽)
    '<div id="contest-opp-dice-syntax-row" class="acu-dice-form-row cols-2" style="display: none;">' +
    '<div><div class="acu-dice-form-label">骰子语法</div><input type="text" id="contest-custom-dice-opp" class="acu-dice-input" value="" placeholder="留空=同发起方"></div>' +
    '<div></div>' +
    '</div>' +
    '<div id="contest-opp-values-row" class="acu-dice-form-row cols-3">' +
    '<div id="contest-opp-attr-wrapper"><div class="acu-dice-form-label" id="contest-opp-attr-label">属性值</div><input type="text" class="acu-dice-input" id="contest-opp-value" value="' +
    (opponentValue !== undefined ? opponentValue : '') +
    '" placeholder="留空=50%最大值"></div>' +
    '<div id="contest-opp-skill-mod-wrapper" style="display:none;"><div class="acu-dice-form-label" id="contest-opp-skill-mod-label">技能加值</div><input type="text" class="acu-dice-input" id="contest-opp-skill-mod" placeholder="留空=0"></div>' +
    '<div id="contest-opp-mod-wrapper"><div class="acu-dice-form-label" id="contest-opp-mod-label">修正值</div><input type="text" class="acu-dice-input" id="contest-opp-mod" placeholder="留空=0"></div>' +
    '<div id="contest-opp-target-wrapper"><div class="acu-dice-form-label" id="contest-opp-target-label">目标值</div><input type="text" class="acu-dice-input" id="contest-opp-target" value="" placeholder="自动"></div>' +
    '</div>' +
    '</div>' +
    '<div id="contest-opp-custom-fields"></div>' +
    '<div id="opp-attr-buttons" class="acu-dice-quick-compact">' +
    buildAttrButtons(opponentAttrs, 'opp') +
    '</div>' +
    // [新增] 判定规则 (自定义模式时显示，只占一半宽度)
    '<div id="contest-custom-judge-row" class="acu-dice-form-row cols-2" style="display: none; margin-top: 8px;">' +
    '<div><div class="acu-dice-form-label">判定规则</div><select id="contest-custom-judge-rule" class="acu-dice-select">' +
    '<option value="higher">值大者胜</option>' +
    '<option value="lower">值小者胜</option>' +
    '<option value="rank">成功等级比较</option>' +
    '<option value="none">仅显示结果</option>' +
    '</select></div>' +
    '<div><div class="acu-dice-form-label">平手规则</div><select id="contest-custom-tie-rule" class="acu-dice-select">' +
    '<option value="initiator_lose">发起者失败</option>' +
    '<option value="tie" selected>平手</option>' +
    '<option value="initiator_win">发起者胜利</option>' +
    '</select></div>' +
    '</div>' +
    '<div id="contest-result-display" class="acu-contest-result-display">' +
    '<div class="acu-contest-result-inner">' +
    '<div id="contest-result-init" class="acu-contest-result-side"></div>' +
    '<span class="acu-contest-vs">VS</span>' +
    '<div id="contest-result-opp" class="acu-contest-result-side right"></div>' +
    '</div>' +
    '</div>' +
    '<button type="button" id="contest-roll-btn" class="acu-dice-roll-btn"><i class="fa-solid fa-dice"></i> 开始对抗！</button>' +
    '</div>' +
    '</div>'
  );
}
