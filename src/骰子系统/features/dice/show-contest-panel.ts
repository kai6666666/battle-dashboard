// @ts-nocheck
/**
 * show-contest-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { rollComplexDiceExpression } from '../../features/dice/dice-engine';
import { createPerformContestRoll } from './contest/perform-contest-roll';
import { createApplyContestAdvancedPreset } from './contest/apply-advanced-preset';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowContestPanel(deps: any) {
  const showContestPanel = (options = {}) => {
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
    let contestAttrList = [];
    playerAttrs = deps.getFullAttributesForCharacter(passedInitiatorName || '<user>');
    playerAttrs.forEach(attr => {
      if (!contestAttrList.includes(attr.name)) contestAttrList.push(attr.name);
    });
    opponentAttrs = opponentName ? deps.getFullAttributesForCharacter(opponentName) : [];
    opponentAttrs.forEach(attr => {
      if (!contestAttrList.includes(attr.name)) contestAttrList.push(attr.name);
    });

    const buildAttrButtons = (attrs, targetType) => {
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

    // [修复] 获取当前活跃预设，用于正确同步按钮状态
    const contestAvailablePresets = deps.AdvancedDicePresetManager.getAllPresets()
      .filter(p => p.visible !== false)
      .filter(p => deps.AdvancedDicePresetManager.supportsContest(p))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentActivePreset = deps.AdvancedDicePresetManager.getActivePreset();
    const activePresetId =
      currentActivePreset && deps.AdvancedDicePresetManager.supportsContest(currentActivePreset)
        ? currentActivePreset.id
        : null;

    const overlay = $('<div class="acu-contest-overlay"></div>');
    const panelHtml =
      '<div class="acu-contest-panel acu-theme-' +
      config.theme +
      '">' +
      '<div class="acu-dice-panel-header">' +
      '<div class="acu-dice-panel-title"><i class="fa-solid fa-people-arrows"></i> 对抗检定</div>' +
      '<div class="acu-dice-panel-actions">' +
      deps.getTutorialButtonHtml('contestDice', '查看对抗检定教程') +
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
      contestAvailablePresets
        .map(
          p =>
            '<button type="button" class="acu-dice-quick-preset-btn' +
            // [修复] 使用activePresetId而不是diceExpression来判断active状态
            (p.id === activePresetId ? ' active' : '') +
            '" data-dice="' +
            deps.escapeHtml(p.diceExpression || '1d100') +
            '" data-criteria="' +
            deps.escapeHtml(p.successCriteria || 'lte') +
            '" data-preset-id="' +
            deps.escapeHtml(p.id) +
            '">' +
            deps.escapeHtml(p.name) +
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
      deps.escapeHtml(passedInitiatorName) +
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
      (passedInitiatorValue !== undefined ? passedInitiatorValue : '') +
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
      deps.escapeHtml(opponentName) +
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
      (passedOpponentValue !== undefined ? passedOpponentValue : '') +
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
      '</div>';

    const panel = $(panelHtml);
    overlay.append(panel);
    $('body').append(overlay);
    deps.bindTutorialButtonsIn(panel);

    // [新增] 构建角色快捷按钮 - 复用普通检定的样式规格
    const buildCharBtns = targetType => {
      const containerId = targetType === 'init' ? '#contest-init-char-buttons' : '#contest-opp-char-buttons';
      const $container = panel.find(containerId);
      let html = '';
      characterList.forEach(name => {
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
      $container.find('.acu-dice-char-btn').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        const charName = $(this).data('char');
        const type = $(this).data('type');
        if (type === 'init') {
          panel.find('#contest-init-display').val(charName).trigger('change');
        } else {
          panel.find('#contest-opponent-display').val(charName).trigger('change');
        }
      });
    };

    // [新增] 重建属性快捷按钮
    const rebuildAttrBtns = (attrs, targetType) => {
      const containerId = targetType === 'init' ? '#init-attr-buttons' : '#opp-attr-buttons';
      const $container = panel.find(containerId);

      // 始终显示容器（即使没有属性数据，也要显示生成按钮）
      $container.show();

      let html = '';

      // 现有属性按钮
      if (attrs.length > 0) {
        attrs.forEach(attr => {
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
      $container.find('.acu-contest-attr-btn').click(function () {
        const val = $(this).attr('data-val');
        const aname = $(this).attr('data-aname');
        const source = String($(this).attr('data-source') || 'generic') as CharacterAttributeSource;
        const type = $(this).attr('data-type');

        if (type === 'init') {
          const targetInput = getContestAttrTargetInput('init', aname || '', source);
          panel.find(targetInput).val(val);
          panel.find('#contest-init-name').val(aname);
          panel.find(targetInput).trigger('change');
        } else {
          const targetInput = getContestAttrTargetInput('opp', aname || '', source);
          panel.find(targetInput).val(val);
          panel.find('#contest-opp-name').val(aname);
          panel.find(targetInput).trigger('change');
        }
      });

      // 绑定生成属性按钮点击事件
      $container.find('.acu-contest-gen-attr-btn').click(async function (e) {
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
            charName = panel.find('#contest-init-display').val().trim() || '<user>';
          } else {
            charName = panel.find('#contest-opponent-display').val().trim();
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
      $container.find('.acu-contest-clear-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        const type = $btn.attr('data-type');

        // 获取角色名
        let charName;
        if (type === 'init') {
          charName = panel.find('#contest-init-display').val().trim() || '<user>';
        } else {
          charName = panel.find('#contest-opponent-display').val().trim();
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

    // 初始化角色快捷按钮
    buildCharBtns('init');
    buildCharBtns('opp');
    // [新增] 发起方随机技能按钮
    panel.find('#contest-init-random-skill').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      const skillPool = deps.getRandomSkillPool();
      var randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      panel.find('#contest-init-name').val(randomSkill).trigger('change');
    });

    // [新增] 对抗方随机技能按钮
    panel.find('#contest-opp-random-skill').click(function (e) {
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
      setCurrentContestAdvancedPreset: (value) => { currentContestAdvancedPreset = value; },
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
    panel.find('#contest-init-display').on('change.acuattr input.acuattr', function () {
      const charName = $(this).val().trim() || '<user>';
      const newAttrList = deps.getAttributesForCharacter(charName);
      deps.initCustomDropdown(panel.find('#contest-init-name'), newAttrList.length > 0 ? newAttrList : contestAttrList);
      const fullAttrs = deps.getFullAttributesForCharacter(charName);
      rebuildAttrBtns(fullAttrs, 'init');
    });

    // 对抗方角色变化时更新属性
    panel.find('#contest-opponent-display').on('change.acuattr input.acuattr', function () {
      const charName = $(this).val().trim();
      const newAttrList = deps.getAttributesForCharacter(charName);
      deps.initCustomDropdown(panel.find('#contest-opp-name'), newAttrList.length > 0 ? newAttrList : contestAttrList);
      const fullAttrs = deps.getFullAttributesForCharacter(charName);
      rebuildAttrBtns(fullAttrs, 'opp');
    });

    // 发起方属性名变化时自动填入属性值
    panel.find('#contest-init-name').on('change.acuval', function () {
      const charName = panel.find('#contest-init-display').val().trim() || '<user>';
      const attrName = $(this).val().trim();
      const attrEntry = deps.getAttributeEntryForCharacter(charName, attrName);
      if (attrEntry) {
        const targetInput = getContestAttrTargetInput('init', attrEntry.name, attrEntry.source);
        panel.find(targetInput).val(attrEntry.value).trigger('change');
      }
    });

    // 对抗方属性名变化时自动填入属性值
    panel.find('#contest-opp-name').on('change.acuval', function () {
      const charName = panel.find('#contest-opponent-display').val().trim();
      const attrName = $(this).val().trim();
      const attrEntry = deps.getAttributeEntryForCharacter(charName, attrName);
      if (attrEntry) {
        const targetInput = getContestAttrTargetInput('opp', attrEntry.name, attrEntry.source);
        panel.find(targetInput).val(attrEntry.value).trigger('change');
      }
    });

    // 骰子预设切换
    panel.find('.acu-dice-quick-preset-btn').click(function () {
      const newDice = $(this).data('dice');
      // 自定义按钮有单独处理，这里跳过
      if (newDice === 'custom') return;

      // [新增] 检查预设是否支持对抗检定
      const presetId = $(this).data('preset-id') as string | undefined;
      if (presetId && !deps.AdvancedDicePresetManager.supportsContest(presetId)) {
        const preset = deps.AdvancedDicePresetManager.getAllPresets().find(p => p.id === presetId);
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
    panel.find('.acu-dice-quick-preset-btn[data-dice="custom"]').click(function () {
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

    // 掷骰函数 - 使用 rollComplexDiceExpression 支持复合表达式
    const rollDice = function (formula) {
      const rollResult = rollComplexDiceExpression(formula);
      const total = rollResult.total;
      if (Number.isNaN(total)) return { total: 0, rolls: [], sides: 100 };
      // 尝试从公式中提取基本信息用于显示
      const basicMatch = formula.match(/^(\d*)d(\d+|F)/i);
      const sidesStr = basicMatch ? basicMatch[2] : '100';
      const sides = sidesStr.toUpperCase() === 'F' ? 3 : parseInt(sidesStr, 10);
      return { total, rolls: [], sides };
    };

    const resolveContest = function (
      preset: AdvancedDicePreset,
      initOutcome: OutcomeLevel,
      oppOutcome: OutcomeLevel,
      initValue: number,
      oppValue: number,
      initAttr: number,
      oppAttr: number,
    ): 'initiator' | 'opponent' | 'tie' {
      const contestRule = preset.contestRule;

      if (!contestRule) {
        if (initValue > oppValue) return 'initiator';
        if (oppValue > initValue) return 'opponent';
        return 'tie';
      }

      let winner: 'initiator' | 'opponent' | 'tie' = 'tie';
      const contestMode = contestRule.mode ?? 'custom'; // 默认自定义模式，保持旧行为

      switch (contestMode) {
        case 'rank': {
          const initRank = initOutcome.contestRank ?? 50;
          const oppRank = oppOutcome.contestRank ?? 50;
          if (initRank > oppRank) winner = 'initiator';
          else if (oppRank > initRank) winner = 'opponent';
          break;
        }
        case 'value':
        case 'margin': {
          // 余量模式裁决与 value 相同
          if (initValue > oppValue) winner = 'initiator';
          else if (oppValue > initValue) winner = 'opponent';
          break;
        }
        case 'custom': {
          if (contestRule.customExpr) {
            const context = {
              $initValue: initValue,
              $oppValue: oppValue,
              $initRank: initOutcome.contestRank ?? 50,
              $oppRank: oppOutcome.contestRank ?? 50,
            };
            const conditionResult: { success: boolean; value?: number | boolean; error?: string } = deps.evaluateCondition(
              contestRule.customExpr,
              context,
            );
            if (conditionResult.success) {
              const isMatch =
                typeof conditionResult.value === 'number'
                  ? conditionResult.value !== 0
                  : Boolean(conditionResult.value);
              winner = isMatch ? 'initiator' : 'opponent';
            } else {
              console.warn('[DICE] 对抗判定自定义表达式失败:', conditionResult.error);
            }
          }
          break;
        }
      }

      const tieBreakers =
        Array.isArray(contestRule.tieBreakers) && contestRule.tieBreakers.length > 0
          ? contestRule.tieBreakers
          : contestRule.tieBreaker
            ? [contestRule.tieBreaker]
            : [];

      if (winner === 'tie' && tieBreakers.length > 0) {
        // 链式平局处理：按顺序尝试直到分出胜负
        for (const tieBreaker of tieBreakers) {
          if (winner !== 'tie') break;
          switch (tieBreaker) {
            case 'higher_attr':
              if (initAttr > oppAttr) winner = 'initiator';
              else if (oppAttr > initAttr) winner = 'opponent';
              break;
            case 'initiator_wins':
              winner = 'initiator';
              break;
            case 'reroll':
              // 重投由外层触发，此处保持平局继续后续规则
              break;
          }
        }
      }

      return winner;
    };

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
      $btn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        performCustomContestRoll();
      });

      const winnerSide: 'left' | 'right' | 'tie' =
        winner === 'initiator' ? 'left' : winner === 'opponent' ? 'right' : 'tie';
      const customContestResult: AcuDice.ContestResult = {
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
    const performContestRoll = createPerformContestRoll({
      deps, $, panel, performCustomContestRoll, resolveContest,
      getCurrentContestAdvancedPreset: () => currentContestAdvancedPreset,
      getLastContestRollAt: () => lastContestRollAt,
      setLastContestRollAt: (value) => { lastContestRollAt = value; },
    });

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
    panel.find('#contest-history-btn').click(function (e) {
      e.stopPropagation();
      deps.showGlobalDiceHistoryDialog();
    });
    // 齿轮设置按钮点击 - 调用统一设置面板
    // 对抗检定根据当前骰子类型判断规则：1d20 -> DND, 其他 -> COC
    panel.find('.acu-contest-config-btn').click(function (e) {
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
    panel.on('click', function (e) {
      e.stopPropagation();
    });
    overlay.click(closePanel);
    panel.find('.acu-contest-close').click(closePanel);
  };
  return showContestPanel;
}
