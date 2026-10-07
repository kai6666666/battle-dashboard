/**
 * show-dice-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
// [x5ah] unused import removed (effect-math)
import { rollComplexDiceExpression } from '../../features/dice/dice-engine';
import { createDicePanelHistory } from './panel/dice-panel-history';
import { createDicePanelExpr } from './panel/dice-panel-expr';
import { createDicePanelEffectInputs } from './panel/dice-panel-effect-inputs';
import { createDicePanelAttrButtons } from './panel/dice-panel-attr-buttons';
import { createDicePanelEffectRuns } from './panel/dice-panel-effect-runs';
import { createDicePanelQuickActions } from './panel/dice-panel-quick-actions';
import { createDicePanelResourceBurner } from './panel/dice-panel-resource-burner';
import { createDicePanelEffectConfirm } from './panel/dice-panel-effect-confirm';
import { createDicePanelApplyPreset } from './panel/dice-panel-apply-preset';
import { createDicePanelAdvancedCheck } from './panel/dice-panel-advanced-check';
import { createDicePanelRoll } from './panel/dice-panel-roll';
type LegacyAdvancedDicePreset = Record<string, any>;
type AdvancedDicePreset = Record<string, any>;
type DiceRawData = Record<string, any>;
// [x5ah] unused import removed (showActionableErrorToast)
export function createShowDicePanel(deps: any) {
  const showDicePanel = (options: Record<string, any> = {}) => {
    const { $ } = deps.getCore();
    const dicePanelHistory = createDicePanelHistory(deps); void dicePanelHistory;
    const dicePanelExpr = createDicePanelExpr(deps);
    const dicePanelEffectInputs = createDicePanelEffectInputs(deps);
    const dicePanelAttrButtons = createDicePanelAttrButtons(deps, { getPanel: () => panel, getDiceCharacterList: () => diceCharacterList, getDiceAttrList: () => diceAttrList, getFromMvu: () => fromMvu, getMvuParsedInfo: () => mvuParsedInfo, getTargetValue: () => targetValue, getCurrentAdvancedPreset: () => currentAdvancedPreset });
    const dicePanelEffectRuns = createDicePanelEffectRuns(deps, { getPanel: () => panel, buildAttrButtons: (n: any) => dicePanelAttrButtons.buildAttrButtons(n) });
    const dicePanelQuickActions = createDicePanelQuickActions(deps, { getPanel: () => panel, getCurrentAdvancedPreset: () => currentAdvancedPreset, applyAdvancedPreset: (id: any) => dicePanelApplyPreset.applyAdvancedPreset(id) });
    const dicePanelResourceBurner = createDicePanelResourceBurner(deps, { getPanel: () => panel, buildAttrButtons: (n: any) => dicePanelAttrButtons.buildAttrButtons(n), matchesCheckSelector: (a: any, s: any) => dicePanelEffectInputs.matchesCheckSelector(a, s), parseModifier: (m: any) => dicePanelExpr.parseModifier(m), performAdvancedCheck: (...a: any[]) => dicePanelAdvancedCheck.performAdvancedCheck(...a) });
    const dicePanelEffectConfirm = createDicePanelEffectConfirm(deps, { getPanel: () => panel, getEffectRuns: () => dicePanelEffectRuns });
    const dicePanelApplyPreset = createDicePanelApplyPreset(deps, { getPanel: () => panel, getCurrentAdvancedPreset: () => currentAdvancedPreset, setCurrentAdvancedPreset: (v: any) => { currentAdvancedPreset = v; }, getLastVisiblePresetId: () => lastVisiblePresetId, setLastVisiblePresetId: (v: any) => { lastVisiblePresetId = v; }, effectInputs: dicePanelEffectInputs, attrButtons: dicePanelAttrButtons, quickActions: dicePanelQuickActions });
    const dicePanelAdvancedCheck = createDicePanelAdvancedCheck(deps, { getPanel: () => panel, getCurrentAdvancedPreset: () => currentAdvancedPreset, getOnResult: () => onResult, effectRuns: dicePanelEffectRuns, effectConfirm: dicePanelEffectConfirm, expr: dicePanelExpr, attrButtons: dicePanelAttrButtons, resourceBurner: dicePanelResourceBurner, effectInputs: dicePanelEffectInputs });
    const dicePanelRoll = createDicePanelRoll(deps, { getPanel: () => panel, getOnResult: () => onResult, getCurrentAdvancedPreset: () => currentAdvancedPreset, expr: dicePanelExpr, advancedCheck: dicePanelAdvancedCheck });
    $('.acu-dice-panel, .acu-dice-overlay').remove();

    const config = deps.getConfig();
    const diceCfg = deps.getDiceConfig();
    // 读取上次保存的骰子类型，必须是有效公式，否则默认1d100
    let savedDiceType = diceCfg.lastDiceType || '1d100';
    // 验证是否是有效公式，无效则回退到1d100
    if (Number.isNaN(rollComplexDiceExpression(savedDiceType).total)) {
      savedDiceType = '1d100';
    }
    // [新增] 构建角色和属性下拉列表
    const rawDataForList = deps.getCachedRawData() || deps.getTableData();
    const diceCharacterList = deps.getDiceQuickSelectCharacterList(rawDataForList as DiceRawData | null | undefined);
    let diceAttrList: any[] = [];

    if (rawDataForList) {
      for (const key in rawDataForList) {
        const sheet = rawDataForList[key];
        if (!sheet || !sheet.name || !sheet.content) continue;
        const headers = sheet.content[0] || [];

        if (sheet.name?.includes('主角') && sheet.content[1]) {
          const row = sheet.content[1];
          headers.forEach((h: any, idx: any) => {
            if (h && h.includes('属性')) {
              const parsed = deps.parseAttributeString(row[idx] || '');
              parsed.forEach((attr: any) => {
                if (!diceAttrList.includes(attr.name)) diceAttrList.push(attr.name);
              });
            }
          });
        }
      }
    }
    const {
      targetValue = null, // [修复] 默认为 null，支持留空自动计算
      targetName = '', // 留空让 placeholder 显示，执行时若仍为空则使用 '自由检定'
      attrValue = null, // [新增] 属性值参数
      diceType = savedDiceType, // 使用上次保存的骰子类型
      successCriteria = 'lte', // [新增] 默认成功标准：小于等于（COC规则）
      onResult = null,
      initiatorName = '', // [修复] 接收发起者名字
      fromMvu = false, // [新增] 是否从MVU面板调用
      // mvuPath = null, // [x5ah] unused // [新增] MVU变量路径
      mvuParsedInfo = null, // [新增] 解析后的路径信息
    } = options;

    // [新增] 计算初始属性值和目标值/DC
    const isDND = diceType === '1d20' || successCriteria === 'gte';
    let initialAttrValue = attrValue;
    let initialTargetValue = targetValue;

    // 如果传入了attrValue但没有targetValue，根据模式自动计算
    if (attrValue !== null && targetValue === null) {
      if (isDND) {
        initialTargetValue = Math.max(0, 20 - attrValue);
      } else {
        initialTargetValue = attrValue;
      }
    }

    // [b13.6] 方案4：宿主容器模式（小弹窗承载完整面板）
    const _hostEl: any = options.hostEl || null;
    const _onCloseCb: any = options.onClose || null;
    const overlay = $(`<div class="acu-dice-overlay"></div>`);

    // [精简] 成功标准选项：只保留 COC 和 DND
    const successCriteriaOptions = [
      { id: 'lte', name: '≤ (COC)' },
      { id: 'gte', name: '≥ (DND)' },
    ];

    // [新增] 根据骰子类型智能选择默认成功标准
    let defaultCriteria = successCriteria;
    if (diceType === '1d100') defaultCriteria = 'lte';
    else if (diceType === '1d20') defaultCriteria = 'gte';

    // [新增] 预设快捷按钮区逻辑
    const quickPresetsHtml = (() => {
      const presets = deps.AdvancedDicePresetManager.getAllPresets()
        .filter((p: any) => p.visible !== false) // 默认显示
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      let html = `<div class="acu-dice-quick-section" id="dice-normal-presets-section" style="margin-bottom: 8px;">`;
      html += `<div class="acu-dice-section-title"><span><i class="fa-solid fa-sliders"></i> 检定规则<div id="dice-preset-quick-actions" class="acu-dice-preset-quick-actions"></div></span></div>`;

      // 1. 常规预设选择器容器
      html += `<div class="acu-dice-quick-presets" id="dice-normal-presets">`;
      // 自定义按钮（固定在最左）
      html += `<button type="button" class="acu-dice-quick-preset-btn" data-id="__custom__">自定义</button>`;

      presets.forEach((p: any) => {
        html += `<button type="button" class="acu-dice-quick-preset-btn" data-id="${deps.escapeHtml(p.id)}">${deps.escapeHtml(p.name)}</button>`;
      });
      html += `</div>`;

      // 2. 工作流模式下的“返回”按钮容器（默认隐藏）
      html += `<div id="dice-workflow-return-container" style="display: none;">
        <button type="button" class="acu-dice-return-btn" id="dice-return-normal-btn">
            <i class="fa-solid fa-arrow-left"></i> 返回常规检定
        </button>
      </div>`;

      html += `</div>`;
      return html;
    })();

    const panel = $(`
            <div class="acu-dice-panel acu-theme-${config.theme}">
                <div class="acu-dice-panel-header">
                    <div class="acu-dice-panel-title">
                        <i class="fa-solid fa-dice-d20"></i> 普通检定
                    </div>
                    <div class="acu-dice-panel-actions">
                        ${deps.getTutorialButtonHtml('dice', '查看检定面板教程')}
                        <button type="button" id="dice-switch-contest-top" class="acu-dice-panel-action-btn" aria-label="切换到对抗检定" title="切换到对抗检定"><i class="fa-solid fa-people-arrows"></i></button>
                        <button type="button" id="dice-history-btn" class="acu-dice-panel-action-btn" aria-label="检定历史" title="检定历史"><i class="fa-solid fa-history"></i></button>
                        <button type="button" class="acu-dice-config-btn acu-dice-panel-action-btn" aria-label="检定设置" title="检定设置">
                            <i class="fa-solid fa-cog"></i>
                        </button>
                        <button type="button" class="acu-dice-close acu-dice-panel-action-btn" aria-label="关闭检定面板" title="关闭">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="acu-dice-panel-body">
                    ${quickPresetsHtml}

                    <!-- 快捷选择角色 -->
                    <div class="acu-dice-quick-section">
                        <div class="acu-dice-section-title" id="dice-char-buttons-section"><span><i class="fa-solid fa-user"></i> 快捷选择</span><div id="dice-char-buttons" class="acu-dice-quick-inline"></div></div>
                    </div>

                    <div id="dice-normal-params-section">
                        <!-- 第1行：名字 + 属性名 -->
                        <div class="acu-dice-form-row cols-2" id="dice-row-1">
                            <div id="dice-name-wrapper">
                                <div class="acu-dice-form-label">名字</div>
                                <input type="text" id="dice-initiator-name" class="acu-dice-input" value="${deps.escapeHtml(initiatorName)}" placeholder="<user>">
                            </div>
                            <div id="dice-attr-name-wrapper">
                                <div class="acu-dice-form-label" id="dice-attr-name-label">
                                    <span class="dice-attr-name-text">属性名</span>
                                    <button type="button" class="acu-random-skill-btn" id="dice-random-skill" title="随机技能">
                                        <i class="fa-solid fa-dice"></i>
                                    </button>
                                </div>
                                <input type="text" id="dice-attr-name" class="acu-dice-input" value="${deps.escapeHtml(targetName || '')}" placeholder="自由检定">
                            </div>
                        </div>

                        <!-- 第2行：属性值 + 技能加值 + 目标值 -->
                        <div class="acu-dice-form-row cols-2" id="dice-row-2">
                            <div id="dice-attr-wrapper">
                                <div class="acu-dice-form-label" id="dice-attr-label">属性值</div>
                                <input type="text" id="dice-attr-value" class="acu-dice-input" value="${initialAttrValue !== null ? initialAttrValue : ''}" placeholder="留空=50%最大值">
                            </div>
                            <div id="dice-skill-mod-wrapper" style="display: none;">
                                <div class="acu-dice-form-label" id="dice-skill-mod-label">技能加值</div>
                                <input type="text" id="dice-skill-mod" class="acu-dice-input" placeholder="留空=0">
                            </div>
                            <div id="dice-target-wrapper">
                                <div class="acu-dice-form-label" id="dice-target-label">目标值</div>
                                <input type="text" id="dice-target" class="acu-dice-input" value="${initialTargetValue !== null ? initialTargetValue : ''}" placeholder="留空=属性值">
                            </div>
                        </div>
                    </div>

                    <!-- 第3行：成功标准 + 难度等级 + 修正值 (基础模式) -->
                    <div class="acu-dice-form-row cols-3" id="dice-row-3">
                        <div>
                            <div class="acu-dice-form-label centered">成功标准</div>
                            <select id="dice-success-criteria" class="acu-dice-select">
                                ${successCriteriaOptions
                                  .map(
                                    opt =>
                                      `<option value="${opt.id}" ${opt.id === defaultCriteria ? 'selected' : ''}>${opt.name}</option>`,
                                  )
                                  .join('')}
                            </select>
                        </div>
                        <div id="dice-difficulty-wrapper">
                            <div class="acu-dice-form-label centered">难度等级</div>
                            <select id="dice-difficulty" class="acu-dice-select">
                                <option value="normal" selected>普通</option>
                                <option value="hard">困难</option>
                                <option value="extreme">极难</option>
                                <option value="critical">大成功</option>
                            </select>
                        </div>
                        <div id="dice-mod-wrapper">
                            <div class="acu-dice-form-label" id="dice-mod-label">修正值</div>
                            <input type="text" id="dice-modifier" class="acu-dice-input" placeholder="留空=0">
                        </div>
                    </div>

                    <!-- [新增] 高级预设自定义字段区域 (在快捷属性上方) -->
                    <div id="dice-custom-fields-area"></div>

                    <!-- [新增] 自定义掷骰模式字段区 -->
                    <div id="acu-dice-custom-mode-fields" style="display: none; margin-top: 8px;">
                        <div class="acu-dice-form-row cols-3">
                            <div>
                                <div class="acu-dice-form-label">骰子语法</div>
                                <input type="text" id="custom-dice-expr" class="acu-dice-input" value="${deps.escapeHtml(diceCfg.customDiceExpr || '')}" placeholder="1d100,2d6+3...">
                            </div>
                            <div>
                                <div class="acu-dice-form-label">成功条件</div>
                                <select id="custom-judge-mode" class="acu-dice-select">
                                    <option value=">=">>=</option>
                                    <option value="<=" selected><=</option>
                                    <option value=">">&gt;</option>
                                    <option value="<">&lt;</option>
                                    <option value="none">无判定</option>
                                </select>
                            </div>
                            <div>
                                <div class="acu-dice-form-label">目标值</div>
                                <input type="text" id="custom-target-value" class="acu-dice-input" placeholder="留空=50%概率">
                            </div>
                        </div>
                    </div>

                    <!-- 快捷选择属性（紧凑型） -->
                    <div id="dice-attr-buttons" class="acu-dice-quick-compact"></div>

                    <!-- 隐藏的骰子公式 -->
                    <input type="hidden" id="dice-formula" value="${diceType}">

                    <button type="button" id="dice-roll-btn" class="acu-dice-roll-btn">
                        <i class="fa-solid fa-dice"></i> 掷骰！
                    </button>
                </div>
            </div>
        `);

    if (_hostEl) {
      // [b13.6] 宿主模式：面板直接嵌入宿主容器（小弹窗）
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

    dicePanelAttrButtons.init();
    // 初始化时执行一次
    dicePanelAttrButtons.updateRuleMode();

    // [新增] 高级预设选择器变更事件 (已重构为快捷按钮点击事件)
    let currentAdvancedPreset: AdvancedDicePreset | LegacyAdvancedDicePreset | null = null;
    let lastVisiblePresetId: string | null = null;

    // [新增] 动态监听属性名变化，更新效果输入区域
    panel.find('#dice-attr-name').on('change', function () {
      if (!currentAdvancedPreset) return;
      // 重新渲染整个面板内容可能太重，这里只更新效果区域
      // 但由于效果区域是作为 gridItems 动态插入的，直接重新调用 applyAdvancedPreset 最简单
      // 必须防止死循环
      if (panel.data('updating-preset')) return;
      panel.data('updating-preset', true);
      dicePanelApplyPreset.applyAdvancedPreset(currentAdvancedPreset.id);
      panel.data('updating-preset', false);
    });

    // 自定义模式下持久化骰子语法（仅自定义模式使用）
    panel.find('#custom-dice-expr').on('input change', function (this: any) {
      if (!panel.find('#acu-dice-custom-mode-fields').is(':visible')) return;
      const customExpr = ($(this).val() || '').toString().trim();
      deps.saveDiceConfig({ customDiceExpr: customExpr });
    });

    // 绑定快捷预设按钮点击事件：预设管理器会动态刷新按钮，必须用委托绑定新按钮
    panel.on('click', '#dice-normal-presets .acu-dice-quick-preset-btn', function (this: any) {
      const presetId = $(this).data('id') as string;

      // 保存到 last preset
      if (presetId === '__custom__') {
        deps.AdvancedDicePresetManager.setActivePreset(null);
        localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, '__custom__');
      } else {
        deps.AdvancedDicePresetManager.setActivePreset(presetId);
        localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, presetId);
      }

      dicePanelApplyPreset.applyAdvancedPreset(presetId);
    });

    // [新增] 绑定“返回常规检定”按钮点击事件
    panel.on('click', '#dice-return-normal-btn', function (e: any) {
      e.preventDefault();
      // 返回到最近一次可见预设；若无则回退到第一个可见预设
      let targetPresetId: string | null = lastVisiblePresetId;

      // 验证 targetPresetId 是否有效且可见
      const allPresets = deps.AdvancedDicePresetManager.getAllPresets();
      const targetPreset = allPresets.find((p: any) => p.id === targetPresetId);
      if (!targetPreset || targetPreset.visible === false) {
        // 如果上次预设无效或不可见，则回退到第一个可见预设
        const firstVisible = allPresets.find((p: any) => p.visible !== false);
        targetPresetId = firstVisible ? firstVisible.id : '__custom__';
      }

      // 执行切换
      if (targetPresetId === '__custom__') {
        deps.AdvancedDicePresetManager.setActivePreset(null);
      } else {
        deps.AdvancedDicePresetManager.setActivePreset(targetPresetId);
      }
      // 更新 localStorage
      localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, targetPresetId || '__custom__');

      dicePanelApplyPreset.applyAdvancedPreset(targetPresetId);
    });

    panel.on('click', '.acu-dice-preset-action-btn', async function (this: any, e: any) {
      e.preventDefault();
      e.stopPropagation();
      const actionId = String($(this).data('action-id') || '').trim();
      if (!actionId) return;
      const $btn = $(this);
      if ($btn.prop('disabled')) return;
      $btn.prop('disabled', true).addClass('disabled');
      try {
        await dicePanelQuickActions.executePresetQuickAction(actionId);
      } finally {
        $btn.prop('disabled', false).removeClass('disabled');
        dicePanelQuickActions.renderPresetQuickActions(currentAdvancedPreset);
      }
    });

    panel.find('#dice-attr-value, #dice-modifier, #dice-target').on('input change', function () {
      dicePanelQuickActions.renderPresetQuickActions(currentAdvancedPreset);
    });

    // 初始化时应用已保存的预设

    const savedPresetId = localStorage.getItem(deps.STORAGE_KEY_LAST_PRESET);
    // 兼容旧逻辑：如果 ActivePresetManager 里有值，优先使用
    const activePreset = deps.AdvancedDicePresetManager.getActivePreset();

    if (activePreset) {
      dicePanelApplyPreset.applyAdvancedPreset(activePreset.id);
    } else if (savedPresetId && savedPresetId !== '__custom__') {
      dicePanelApplyPreset.applyAdvancedPreset(savedPresetId);
    } else {
      dicePanelApplyPreset.applyAdvancedPreset('__custom__');
    }

    // 掷骰逻辑 - 使用 rollComplexDiceExpression 支持复合表达式
    // [新增] 自定义模式掷骰逻辑
    // 绑定按钮点击事件
    panel.find('#dice-roll-btn').click(function () {
      dicePanelRoll.performDiceRoll();
    });

    // 切换到对抗检定（标题栏图标）
    panel.find('#dice-switch-contest-top').click(function () {
      const targetInput = panel.find('#dice-target').val().trim(); void targetInput;
      const attrValueInput = panel.find('#dice-attr-value').val().trim();
      const currentDice = panel.find('#dice-formula').val() || '1d100';
      const initiatorNameVal = panel.find('#dice-initiator-name').val().trim();
      closePanel();
      deps.showContestPanel({
        // 只有用户实际输入了非默认值才传递，否则留空让 placeholder 生效
        initiatorName: initiatorNameVal && initiatorNameVal !== '<user>' ? initiatorNameVal : '',
        initiatorValue: attrValueInput !== '' ? parseInt(attrValueInput, 10) : undefined,
        diceType: currentDice,
      });
    });
    panel.find('#dice-history-btn').click(function (e: any) {
      e.stopPropagation();
      deps.showGlobalDiceHistoryDialog();
    });
    // 关闭
    const closePanel = () => {
      try {
        if (_hostEl) {
          if (typeof _onCloseCb === 'function') _onCloseCb();
          panel.remove();
          return;
        }
      } catch (eC) {}
      overlay.remove();
      panel.remove();
    };
    if (!_hostEl) {
      panel.on('click', (e: any) => {
        e.stopPropagation();
      });
      overlay.click(closePanel);
    }
    panel.find('.acu-dice-close').click(closePanel);
    // 齿轮设置按钮点击 - 调用高级检定管理
    panel.find('.acu-dice-config-btn').click(function (e: any) {
      e.stopPropagation();
      deps.showAdvancedPresetManager({ fromDicePanel: true });
    });
  };
  return showDicePanel;
}
