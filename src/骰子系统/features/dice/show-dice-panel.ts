// @ts-nocheck
/**
 * show-dice-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { buildEffectMetaLines, buildEffectTraceLines, computePendingEffectVariables, parseEffectValueInput } from '../../shared/effect-math';
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
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowDicePanel(deps: any) {
  const showDicePanel = (options = {}) => {
    const { $ } = deps.getCore();
    const dicePanelHistory = createDicePanelHistory(deps);
    const dicePanelExpr = createDicePanelExpr(deps);
    const dicePanelEffectInputs = createDicePanelEffectInputs(deps);
    const dicePanelAttrButtons = createDicePanelAttrButtons(deps, { getPanel: () => panel, getDiceCharacterList: () => diceCharacterList, getDiceAttrList: () => diceAttrList, getFromMvu: () => fromMvu, getMvuParsedInfo: () => mvuParsedInfo, getTargetValue: () => targetValue, getCurrentAdvancedPreset: () => currentAdvancedPreset });
    const dicePanelEffectRuns = createDicePanelEffectRuns(deps, { getPanel: () => panel, buildAttrButtons: (n: any) => dicePanelAttrButtons.buildAttrButtons(n) });
    const dicePanelQuickActions = createDicePanelQuickActions(deps, { getPanel: () => panel, getCurrentAdvancedPreset: () => currentAdvancedPreset, applyAdvancedPreset: (id: any) => dicePanelApplyPreset.applyAdvancedPreset(id) });
    const dicePanelResourceBurner = createDicePanelResourceBurner(deps, { getPanel: () => panel, buildAttrButtons: (n: any) => dicePanelAttrButtons.buildAttrButtons(n), matchesCheckSelector: (a: any, s: any) => dicePanelEffectInputs.matchesCheckSelector(a, s), parseModifier: (m: any) => dicePanelExpr.parseModifier(m), performAdvancedCheck: (...a: any[]) => dicePanelAdvancedCheck.performAdvancedCheck(...a) });
    const dicePanelEffectConfirm = createDicePanelEffectConfirm(deps, { getPanel: () => panel, getEffectRuns: () => dicePanelEffectRuns });
    const dicePanelApplyPreset = createDicePanelApplyPreset(deps, { getPanel: () => panel, getCurrentAdvancedPreset: () => currentAdvancedPreset, setCurrentAdvancedPreset: (v: any) => { currentAdvancedPreset = v; }, getLastVisiblePresetId: () => lastVisiblePresetId, setLastVisiblePresetId: (v: any) => { lastVisiblePresetId = v; }, effectInputs: dicePanelEffectInputs, attrButtons: dicePanelAttrButtons, quickActions: dicePanelQuickActions });
    const dicePanelAdvancedCheck = createDicePanelAdvancedCheck(deps, { getPanel: () => panel, getCurrentAdvancedPreset: () => currentAdvancedPreset, getOnResult: () => onResult, effectRuns: dicePanelEffectRuns, effectConfirm: dicePanelEffectConfirm, expr: dicePanelExpr, attrButtons: dicePanelAttrButtons, resourceBurner: dicePanelResourceBurner, effectInputs: dicePanelEffectInputs });
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
    let diceAttrList = [];

    if (rawDataForList) {
      for (const key in rawDataForList) {
        const sheet = rawDataForList[key];
        if (!sheet || !sheet.name || !sheet.content) continue;
        const headers = sheet.content[0] || [];

        if (sheet.name?.includes('主角') && sheet.content[1]) {
          const row = sheet.content[1];
          headers.forEach((h, idx) => {
            if (h && h.includes('属性')) {
              const parsed = deps.parseAttributeString(row[idx] || '');
              parsed.forEach(attr => {
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
      mvuPath = null, // [新增] MVU变量路径
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
        .filter(p => p.visible !== false) // 默认显示
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      let html = `<div class="acu-dice-quick-section" id="dice-normal-presets-section" style="margin-bottom: 8px;">`;
      html += `<div class="acu-dice-section-title"><span><i class="fa-solid fa-sliders"></i> 检定规则<div id="dice-preset-quick-actions" class="acu-dice-preset-quick-actions"></div></span></div>`;

      // 1. 常规预设选择器容器
      html += `<div class="acu-dice-quick-presets" id="dice-normal-presets">`;
      // 自定义按钮（固定在最左）
      html += `<button type="button" class="acu-dice-quick-preset-btn" data-id="__custom__">自定义</button>`;

      presets.forEach(p => {
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

    overlay.append(panel);
    $('body').append(overlay);
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
    panel.find('#custom-dice-expr').on('input change', function () {
      if (!panel.find('#acu-dice-custom-mode-fields').is(':visible')) return;
      const customExpr = ($(this).val() || '').toString().trim();
      deps.saveDiceConfig({ customDiceExpr: customExpr });
    });

    // 绑定快捷预设按钮点击事件：预设管理器会动态刷新按钮，必须用委托绑定新按钮
    panel.on('click', '#dice-normal-presets .acu-dice-quick-preset-btn', function () {
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
    panel.on('click', '#dice-return-normal-btn', function (e) {
      e.preventDefault();
      // 返回到最近一次可见预设；若无则回退到第一个可见预设
      let targetPresetId: string | null = lastVisiblePresetId;

      // 验证 targetPresetId 是否有效且可见
      const allPresets = deps.AdvancedDicePresetManager.getAllPresets();
      const targetPreset = allPresets.find(p => p.id === targetPresetId);
      if (!targetPreset || targetPreset.visible === false) {
        // 如果上次预设无效或不可见，则回退到第一个可见预设
        const firstVisible = allPresets.find(p => p.visible !== false);
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

    panel.on('click', '.acu-dice-preset-action-btn', async function (e) {
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
    const performCustomRoll = function () {
      const $btn = panel.find('#dice-roll-btn');

      // 读取自定义模式字段
      const diceExpr = panel.find('#custom-dice-expr').val().trim() || '1d100';
      const judgeMode = panel.find('#custom-judge-mode').val() as string;
      const targetValueStr = panel.find('#custom-target-value').val().trim();
      const initiatorName = deps.resolveCanonicalCharacterName(panel.find('#dice-initiator-name').val().trim() || '<user>');
      const attrName = panel.find('#dice-attr-name').val().trim() || '自由检定';

      // 解析目标值
      const expectedValue = calculateDiceExpectedValue(diceExpr);
      const autoTargetValue = Number.isFinite(expectedValue) ? Math.floor(expectedValue) : null;
      const targetValue = targetValueStr !== '' ? parseInt(targetValueStr, 10) : autoTargetValue;
      const hasJudgement = judgeMode !== 'none' && targetValue !== null && !isNaN(targetValue);

      // 执行掷骰 - 使用 rollComplexDiceExpression 支持复合表达式如 2d6+33
      const rollResult = rollComplexDiceExpression(diceExpr);
      if (isNaN(rollResult.total)) {
        if (window.toastr)
          showActionableErrorToast(`骰子语法错误: ${diceExpr}`, {
            suggestion: '请检查骰子输入框或当前预设公式，只使用形如 1d100、2d6+3 的合法写法。',
          });
        return;
      }

      const rollTotal = rollResult.total;

      // 判定结果
      let isSuccess = false;
      let judgeResultText = '';

      if (hasJudgement) {
        switch (judgeMode) {
          case '>=':
            isSuccess = rollTotal >= targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          case '<=':
            isSuccess = rollTotal <= targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          case '>':
            isSuccess = rollTotal > targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          case '<':
            isSuccess = rollTotal < targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          default:
            judgeResultText = '';
        }
      }

      // 生成输出文本 - 使用与内置预设一致的 meta 标签格式
      const displayInitiator = deps.replaceUserPlaceholders(initiatorName);
      const displayAttrName = attrName || '自由检定';
      let outputText: string;

      if (hasJudgement) {
        const conditionExpr = `${rollTotal} ${judgeMode} ${targetValue}`;
        const judgeResultCN = isSuccess ? '成立' : '不成立';
        outputText = `<meta:检定结果>\n元叙事：${displayInitiator} 发起了 【${displayAttrName}】 检定，${diceExpr}=${rollTotal}，判定 ${conditionExpr}？${judgeResultCN}，判定为【${judgeResultText}】\n</meta:检定结果>`;
      } else {
        // 无判定模式
        outputText = `<meta:检定结果>\n元叙事：${displayInitiator} 发起了 【${displayAttrName}】 检定，${diceExpr}=${rollTotal}\n</meta:检定结果>`;
      }

      // 插入到输入框
      deps.smartInsertToTextarea(outputText, 'dice');

      // 生成结果显示
      const badgeClass = hasJudgement
        ? isSuccess
          ? 'acu-dice-result-badge success'
          : 'acu-dice-result-badge failure'
        : '';
      const diceCfg = deps.getDiceConfig();
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const displayValue = hideDiceResultFromUser ? '？？' : rollTotal;
      const displayOutcome = hideDiceResultFromUser ? '' : judgeResultText;

      // 更新按钮显示结果
      $btn.html(`
        <div class="acu-dice-result-display">
          <span class="acu-dice-result-value">${displayValue}</span>
          ${hasJudgement && displayOutcome ? `<span class="${badgeClass}">${displayOutcome}</span>` : ''}
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮
      $btn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        performCustomRoll();
      });

      // 构建检定结果对象
      const checkResult: AcuDice.CheckResult = {
        success: isSuccess,
        total: rollTotal,
        target: targetValue ?? 0,
        outcomeText: judgeResultText,
        attrName,
        criteria: 'custom',
        isAutoTarget: false,
        formula: diceExpr,
      };

      // 添加到历史记录
      const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkResultWithTimestamp = {
        ...checkResult,
        timestamp: Date.now(),
        detailId,
        initiatorName,
        historyType: 'check' as const,
        detailLines: [
          `发起者: ${initiatorName}`,
          `属性: ${attrName}`,
          `公式: ${diceExpr}`,
          `掷骰: ${rollTotal}`,
          hasJudgement ? `判定: ${rollTotal} ${judgeMode} ${targetValue}` : '判定: 无',
          hasJudgement ? `结果: ${judgeResultText}` : '结果: 仅掷骰',
        ],
      };
      deps.getCheckHistory().push(checkResultWithTimestamp);
      if (deps.getCheckHistory().length > deps.getMAX_HISTORY()) {
        deps.getCheckHistory().shift();
      }

      // 触发事件
      deps.emitEvent('check', checkResultWithTimestamp);

      if (onResult) {
        onResult(checkResult);
      }
    };

    let lastDiceRollAt = 0;
    // 投骰逻辑函数（可被按钮点击和重投按钮调用）
    const performDiceRoll = function () {
      const $btn = panel.find('#dice-roll-btn');
      const now = Date.now();
      if (now - lastDiceRollAt < 100) return;
      lastDiceRollAt = now;
      if ($btn.prop('disabled')) return;

      // 锁定按钮防止连点
      $btn.prop('disabled', true).addClass('disabled');
      setTimeout(() => {
        $btn.prop('disabled', false).removeClass('disabled');
      }, 100);

      // [新增] 如果使用高级预设,调用专用检定函数
      if (currentAdvancedPreset) {
        dicePanelAdvancedCheck.performAdvancedCheck();
        return;
      }

      // [新增] 如果处于自定义模式,使用自定义掷骰逻辑
      if (panel.find('#acu-dice-custom-mode-fields').is(':visible')) {
        performCustomRoll();
        return;
      }

      const formula = panel.find('#dice-formula').val().trim() || '1d100';
      const modStr = panel.find('#dice-modifier').val().trim() || '0';
      const mod = dicePanelExpr.parseModifier(modStr);
      const attrName = panel.find('#dice-attr-name').val().trim() || '自由检定';
      const criteria = panel.find('#dice-success-criteria').val() || 'lte';
      const difficulty = panel.find('#dice-difficulty').val() || 'normal';

      // 判断规则类型
      const isDND = criteria === 'gte';

      // 获取骰子配置（根据规则类型读取不同配置）
      const diceCfg = deps.getDiceConfig();
      const hardDiv = diceCfg.difficultSuccessDiv || 2;
      const extremeDiv = diceCfg.hardSuccessDiv || 5;
      // COC: 大成功 ≤ critSuccessMax, 大失败 ≥ critFailMin
      // DND: 大成功 ≥ dndCritSuccess, 大失败 ≤ dndCritFail
      const critSuccessMax = isDND ? diceCfg.dndCritFail || 1 : diceCfg.critSuccessMax || 5;
      const critFailMin = isDND ? diceCfg.dndCritSuccess || 20 : diceCfg.critFailMin || 96;

      // 目标值计算（COC 和 DND 不同）
      let targetInputVal = panel.find('#dice-target').val().trim();
      let attrInputVal = panel.find('#dice-attr-value').val().trim();
      let attrValue = attrInputVal !== '' ? parseInt(attrInputVal, 10) : 0;
      let target;
      let isAutoTarget = false;

      // 辅助函数：根据骰子公式计算最大值的一半
      const getDefaultTarget = formulaStr => {
        const match = formulaStr.match(/(\d+)d(\d+)/i);
        if (match) {
          const maxRoll = parseInt(match[1], 10) * parseInt(match[2], 10);
          return Math.round(maxRoll / 2);
        }
        return 50;
      };

      if (targetInputVal !== '') {
        // 用户手动输入了目标值/DC
        const parsedTarget = parseInt(targetInputVal, 10);
        target = !Number.isNaN(parsedTarget) ? parsedTarget : getDefaultTarget(formula);
      } else if (isDND) {
        // DND 模式：留空时 DC = 10（中等难度）
        target = 10;
        isAutoTarget = true;
      } else {
        // COC 模式：留空时目标值 = 属性值，若属性值也空则取骰子最大值的一半
        if (attrValue > 0) {
          target = attrValue;
          isAutoTarget = true;
        } else {
          target = getDefaultTarget(formula);
          isAutoTarget = true;
        }
      }

      const result = dicePanelExpr.rollDice(formula);
      const finalValue = result.total + mod;

      // 根据规则和难度等级计算
      let requiredTarget = target;
      let difficultyLabel = '';
      let difficultyDiv = 1;

      // DND 模式忽略难度等级
      if (!isDND) {
        switch (difficulty) {
          case 'hard':
            requiredTarget = Math.floor(target / hardDiv);
            difficultyLabel = '困难';
            difficultyDiv = hardDiv;
            break;
          case 'extreme':
            requiredTarget = Math.floor(target / extremeDiv);
            difficultyLabel = '极难';
            difficultyDiv = extremeDiv;
            break;
          case 'critical':
            requiredTarget = critSuccessMax;
            difficultyLabel = '大成功';
            break;
          default:
            difficultyLabel = '';
            break;
        }
      }

      // 判定结果
      let isCritSuccess = false;
      let isCritFailure = false;
      let isSuccess = false;
      let outcomeText = '';
      let outcomeClass = '';

      // 大成功/大失败判定（最高优先级）
      if (isDND) {
        // DND: 大成功 ≥ 20，大失败 ≤ 1
        isCritSuccess = finalValue >= critFailMin; // 复用 critFailMin 作为 DND 大成功阈值
        isCritFailure = finalValue <= critSuccessMax; // 复用 critSuccessMax 作为 DND 大失败阈值
      } else {
        // COC: 大成功 ≤ 5，大失败 ≥ 96
        isCritSuccess = finalValue <= critSuccessMax;
        isCritFailure = finalValue >= critFailMin;
      }

      // 根据规则判断成功/失败
      if (isDND) {
        isSuccess = finalValue >= requiredTarget;
      } else {
        isSuccess = finalValue <= requiredTarget;
      }

      // 确定最终结果文本
      if (isCritSuccess) {
        outcomeText = '大成功！';
        outcomeClass = 'success';
        isSuccess = true;
      } else if (isCritFailure) {
        outcomeText = '大失败！';
        outcomeClass = 'failure';
        isSuccess = false;
      } else if (isSuccess) {
        if (isDND) {
          outcomeText = '成功';
        } else if (difficulty === 'hard') {
          outcomeText = '困难成功';
        } else if (difficulty === 'extreme') {
          outcomeText = '极难成功';
        } else {
          // 普通难度下，检查是否达成更高成就
          const extremeTarget = Math.floor(target / extremeDiv);
          const hardTarget = Math.floor(target / hardDiv);
          if (finalValue <= extremeTarget) {
            outcomeText = '极难成功';
          } else if (finalValue <= hardTarget) {
            outcomeText = '困难成功';
          } else {
            outcomeText = '成功';
          }
        }
        outcomeClass = 'success';
      } else {
        outcomeText = '失败';
        outcomeClass = 'failure';
      }

      const criteriaSymbol = isDND ? '≥' : '≤';
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const displayValue = hideDiceResultFromUser ? '？？' : finalValue;
      const displayOutcomeText = hideDiceResultFromUser ? '' : outcomeText;

      // 确定结果类型和样式
      let resultType;
      if (isCritSuccess) {
        resultType = 'critSuccess';
      } else if (isCritFailure) {
        resultType = 'critFailure';
      } else if (isSuccess) {
        if (difficulty === 'extreme' || (difficulty === 'normal' && finalValue <= Math.floor(target / extremeDiv))) {
          resultType = 'extremeSuccess';
        } else if (difficulty === 'hard' || (difficulty === 'normal' && finalValue <= Math.floor(target / hardDiv))) {
          resultType = 'success';
        } else {
          resultType = 'warning';
        }
      } else {
        resultType = 'failure';
      }

      const badgeClass = deps.getResultBadgeClass(resultType);

      // 构建显示用的条件表达式（隐藏时为空）
      const displayConditionExpr = hideDiceResultFromUser ? '' : conditionExpr;

      // 将按钮内容替换为结果显示（居中布局，旋转箭头在结果后面）
      const $rollBtn = panel.find('#dice-roll-btn');
      $rollBtn.html(`
        <div class="acu-dice-result-display">
          <span class="acu-dice-result-value">${displayValue}</span>
          ${displayConditionExpr ? `<span class="acu-dice-result-target">${displayConditionExpr}</span>` : ''}
          ${displayOutcomeText ? `<span class="${badgeClass}">${displayOutcomeText}</span>` : ''}
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮点击事件（使用事件委托，因为按钮内容会动态更新）
      $rollBtn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        // 直接调用投骰逻辑函数
        performDiceRoll();
      });

      // 生成 Prompt 文本
      const initiatorName = deps.resolveCanonicalCharacterName(panel.find('#dice-initiator-name').val().trim() || '<user>');

      // 构建简单条件表达式（用于界面显示）
      let conditionExpr = '';
      if (isCritSuccess) {
        if (isDND) {
          conditionExpr = `${finalValue}≥${critFailMin}`;
        } else {
          conditionExpr = `${finalValue}≤${critSuccessMax}`;
        }
      } else if (isCritFailure) {
        if (isDND) {
          conditionExpr = `${finalValue}≤${critSuccessMax}`;
        } else {
          conditionExpr = `${finalValue}≥${critFailMin}`;
        }
      } else if (isDND) {
        conditionExpr = `${finalValue}≥${requiredTarget}`;
      } else {
        conditionExpr = `${finalValue}≤${requiredTarget}`;
      }

      // 构建详细判定表达式（用于输出文本）
      let judgeExpr = '';
      if (isCritSuccess) {
        if (isDND) {
          judgeExpr = `${finalValue}≥${critFailMin}`;
        } else {
          judgeExpr = `${finalValue}≤${critSuccessMax}`;
        }
      } else if (isCritFailure) {
        if (isDND) {
          judgeExpr = `${finalValue}≤${critSuccessMax}`;
        } else {
          judgeExpr = `${finalValue}≥${critFailMin}`;
        }
      } else if (isDND) {
        // DND 模式
        if (isSuccess) {
          judgeExpr = `需${criteriaSymbol}${requiredTarget}，${finalValue}≥${requiredTarget}`;
        } else {
          judgeExpr = `需${criteriaSymbol}${requiredTarget}，${finalValue}<${requiredTarget}`;
        }
      } else if (difficulty === 'critical') {
        // COC 难度设为大成功但没达成
        judgeExpr = `需≤${critSuccessMax}，${finalValue}>${critSuccessMax}`;
      } else if (difficulty !== 'normal') {
        // COC 困难或极难
        if (isSuccess) {
          judgeExpr = `需≤${target}/${difficultyDiv}，${finalValue}≤${requiredTarget}`;
        } else {
          judgeExpr = `需≤${target}/${difficultyDiv}，${finalValue}>${requiredTarget}`;
        }
      } else {
        // COC 普通难度
        if (isSuccess) {
          const extremeTarget = Math.floor(target / extremeDiv);
          const hardTarget = Math.floor(target / hardDiv);
          if (finalValue <= extremeTarget) {
            judgeExpr = `需≤${target}，${finalValue}≤${target}/${extremeDiv}`;
          } else if (finalValue <= hardTarget) {
            judgeExpr = `需≤${target}，${finalValue}≤${target}/${hardDiv}`;
          } else {
            judgeExpr = `需≤${target}，${finalValue}≤${target}`;
          }
        } else {
          judgeExpr = `需≤${target}，${finalValue}>${target}`;
        }
      }

      // 构建统一格式的检定结果文本
      const metaContent = `元叙事：${initiatorName}发起了【${attrName}】检定，掷出${finalValue}，${judgeExpr}，【${outcomeText}】`;
      const diceResultText = `<meta:检定结果>\n${metaContent}\n</meta:检定结果>`;
      deps.smartInsertToTextarea(diceResultText, 'dice');

      // 构建检定结果对象
      const checkResult: AcuDice.CheckResult = {
        success: isSuccess,
        total: finalValue,
        target,
        outcomeText,
        attrName,
        criteria,
        isAutoTarget,
        formula,
      };

      // 添加到历史记录
      const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkResultWithTimestamp = {
        ...checkResult,
        timestamp: Date.now(),
        detailId,
        initiatorName,
        historyType: 'check' as const,
        detailLines: [
          `发起者: ${initiatorName}`,
          `属性: ${attrName}`,
          `公式: ${formula}`,
          `掷骰+修正: ${result.total} ${mod >= 0 ? '+' : ''}${mod} = ${finalValue}`,
          `目标: ${requiredTarget} (${isAutoTarget ? '自动计算' : '手动输入'})`,
          `成功标准: ${criteria === 'gte' ? '>=' : '<='}${requiredTarget}`,
          difficultyLabel ? `难度: ${difficultyLabel}` : '难度: 普通',
          `判定详情: ${judgeExpr}`,
          `结果: ${outcomeText}`,
        ],
      };
      deps.getCheckHistory().push(checkResultWithTimestamp);
      if (deps.getCheckHistory().length > deps.getMAX_HISTORY()) {
        deps.getCheckHistory().shift();
      }

      // 触发事件
      deps.emitEvent('check', checkResultWithTimestamp);

      if (onResult) {
        onResult(checkResult);
      }
    };

    // 绑定按钮点击事件
    panel.find('#dice-roll-btn').click(function () {
      performDiceRoll();
    });

    // 切换到对抗检定（标题栏图标）
    panel.find('#dice-switch-contest-top').click(function () {
      const targetInput = panel.find('#dice-target').val().trim();
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
    panel.find('#dice-history-btn').click(function (e) {
      e.stopPropagation();
      deps.showGlobalDiceHistoryDialog();
    });
    // 关闭
    const closePanel = () => {
      overlay.remove();
      panel.remove();
    };
    panel.on('click', e => {
      e.stopPropagation();
    });
    overlay.click(closePanel);
    panel.find('.acu-dice-close').click(closePanel);
    // 齿轮设置按钮点击 - 调用高级检定管理
    panel.find('.acu-dice-config-btn').click(function (e) {
      e.stopPropagation();
      deps.showAdvancedPresetManager({ fromDicePanel: true });
    });
  };
  return showDicePanel;
}
