// @child-factory（由父模块 show-dice-panel 实例化，不参与 index 接线审计）
import { parseEffectValueInput } from '../../../shared/effect-math';
/**
 * dice-panel-effect-confirm.ts
 * 从 show-dice-panel.ts 拆出：效果确认弹窗、条件预览、输入计算与确认流程。
 */
export function createDicePanelEffectConfirm(deps: any, ctx: any) {
  const { $ } = deps.getCore();
  const getPanel = ctx && typeof ctx.getPanel === 'function' ? ctx.getPanel : () => null;
  const er = () => ctx.getEffectRuns();
    const showEffectConfirmDialog = (options: {
      preset: AdvancedDicePreset;
      outcomeLabel: string;
      branchReasonText?: string;
      effects: ComputedEffect[];
      onConfirm: () => void;
      onCancel: () => void;
    }) => {
      const { preset, outcomeLabel, branchReasonText, effects, onConfirm, onCancel } = options;
      const currentThemeClass = `acu-theme-${deps.getConfig().theme}`;
      const uiCfg = preset.effectConfirmUi || {};
      const dialogTitle = uiCfg.title || '确认效果执行';
      const effectListTitle = uiCfg.effectListTitle || '即将应用以下效果:';
      const branchReasonLabel = uiCfg.branchReasonLabel || '分支依据';

      // 移除已存在的对话框
      $('.acu-confirm-overlay').remove();

      const dialog = $(`
        <div class="acu-edit-overlay acu-confirm-overlay">
          <div class="acu-edit-dialog ${currentThemeClass}" style="max-width:350px;">
            <div class="acu-edit-title">
              <i class="fa-solid fa-clipboard-check" style="color:var(--acu-accent)"></i>
              ${deps.escapeHtml(dialogTitle)}
            </div>
            <div class="acu-settings-content" style="padding:15px;">
              <div style="margin-bottom:12px;font-weight:bold;font-size:14px;text-align:center;color:var(--acu-text-main);">
                ${deps.escapeHtml(outcomeLabel)}
              </div>
              ${
                branchReasonText
                  ? `<div style="margin-bottom:12px;padding:8px 10px;background:var(--acu-card-bg);border-radius:6px;font-size:12px;line-height:1.45;color:var(--acu-text-sub);"><span style="color:var(--acu-text-main);font-weight:bold;">${deps.escapeHtml(branchReasonLabel)}:</span> ${deps.escapeHtml(branchReasonText)}</div>`
                  : ''
              }

              <div style="background:var(--acu-card-bg);border-radius:6px;padding:10px;margin-bottom:15px;max-height:200px;overflow-y:auto;">
                <div style="font-size:12px;color:var(--acu-text-sub);margin-bottom:8px;">${deps.escapeHtml(effectListTitle)}</div>
                ${effects
                  .map(
                    e => `
                  <div style="padding:8px 0;border-bottom:1px solid var(--acu-border);font-size:13px;display:grid;grid-template-columns:1fr auto;gap:6px 10px;align-items:start;">
                    <div style="font-weight:bold;color:var(--acu-text-main);min-width:0;">${deps.escapeHtml(e.resolvedTarget || e.target)}</div>
                    <div style="color:${e.computedValue >= 0 ? 'var(--acu-success-text)' : 'var(--acu-error-text)'};font-weight:bold;text-align:right;white-space:nowrap;">
                      ${e.computedValue > 0 ? '+' : ''}${e.computedValue}
                    </div>
                    <div style="grid-column:1 / -1;font-size:11px;color:var(--acu-text-sub);line-height:1.45;">
                      算式: ${deps.escapeHtml(e.formula)} ｜ 掷值: ${deps.escapeHtml(String(e.rolledValue))}<br>
                      数值: ${e.beforeValue === null || e.beforeValue === undefined ? '未知' : deps.escapeHtml(String(e.beforeValue))}
                      →
                      ${e.afterValue === null || e.afterValue === undefined ? '未知' : deps.escapeHtml(String(e.afterValue))}
                      ${e.conditionSummary ? `<br>条件: ${deps.escapeHtml(e.conditionSummary)}` : ''}
                    </div>
                  </div>
                `,
                  )
                  .join('')}
              </div>
            </div>
            <div class="acu-dialog-btns">
              <button class="acu-dialog-btn" id="confirm-cancel"><i class="fa-solid fa-times"></i> 取消</button>
              <button class="acu-dialog-btn acu-btn-confirm" id="confirm-ok"><i class="fa-solid fa-check"></i> 确认执行</button>
            </div>
          </div>
        </div>
      `);

      $('body').append(dialog);

      // 取消按钮
      dialog.on('click', '#confirm-cancel', () => {
        dialog.remove();
        onCancel();
      });

      // 点击遮罩关闭 (视为取消)
      dialog.on('click', '.acu-confirm-overlay', e => {
        if ($(e.target).hasClass('acu-confirm-overlay')) {
          dialog.remove();
          onCancel();
        }
      });

      // 确认按钮
      dialog.on('click', '#confirm-ok', () => {
        dialog.remove();
        onConfirm();
      });

      // 自动聚焦确认按钮,方便键盘操作
      dialog.find('#confirm-ok').focus();
    };

    /**
     * [新增] 从效果输入框读取并计算效果值
     * @param outcomeName 结果等级名称 (用于匹配输入框)
     * @param defaultFormula 默认公式
     * @returns ComputedEffect 数组
     */
    const resolveEffectConditionPreview = (
      effect: Effect,
      effectContext: PendingEffectContext['context'],
      outcomeName: string,
    ): Pick<ComputedEffect, 'conditionExpr' | 'resolvedConditionExpr' | 'conditionPassed' | 'conditionSummary'> => {
      if (!effect.condition || effect.condition.trim() === '') {
        return {
          conditionExpr: '',
          resolvedConditionExpr: '',
          conditionPassed: true,
          conditionSummary: `命中【${outcomeName}】分支后直接生效`,
        };
      }

      const rawExpr = effect.condition.trim();
      const condContext: Record<string, number> = {
        $roll: effectContext.roll,
        '$roll.total': effectContext.roll,
        $attr: effectContext.attributeValue,
        $mod: effectContext.modifier,
        $dc: effectContext.dc,
      };
      const condResult = deps.evaluateCondition(rawExpr, condContext);
      const passed =
        condResult.success &&
        (typeof condResult.value === 'number' ? condResult.value !== 0 : Boolean(condResult.value));

      const resolvedExpr = rawExpr
        .replace(/\$roll\.total/g, String(effectContext.roll))
        .replace(/\$roll/g, String(effectContext.roll))
        .replace(/\$attr/g, String(effectContext.attributeValue))
        .replace(/\$mod/g, String(effectContext.modifier))
        .replace(/\$dc/g, String(effectContext.dc));

      const summary = `命中【${outcomeName}】分支，条件 ${resolvedExpr}（原式:${rawExpr}）${passed ? '成立' : '不成立'}`;
      return {
        conditionExpr: rawExpr,
        resolvedConditionExpr: resolvedExpr,
        conditionPassed: passed,
        conditionSummary: summary,
      };
    };

    const computeEffectsFromInputs = (
      outcomeName: string,
      effects: Effect[],
      effectContext: PendingEffectContext['context'],
    ): ComputedEffect[] => {
      const results: ComputedEffect[] = [];

      // 查找对应结果等级的效果输入框
      const $inputGroup = getPanel().find(`.acu-effect-value-input[data-outcome="${outcomeName}"]`);
      const inputValue = $inputGroup.val()?.toString().trim() || '';

      for (const effect of effects) {
        // 如果用户输入了值,使用用户输入;否则使用效果定义的默认值
        const formula = inputValue || String(effect.value || '0');
        const parsedValue = parseEffectValueInput(formula, `Confirm ${outcomeName}/${effect.id}`);
        let computedValue = parsedValue.finalValue;
        const rolledValue = parsedValue.rolledValue;
        const displayText = parsedValue.valid
          ? `${parsedValue.formulaText} → ${rolledValue}`
          : `${parsedValue.formulaText} → 解析失败(按0处理)`;

        // 根据操作类型调整符号
        if (effect.operation === 'subtract') {
          computedValue = -Math.abs(computedValue);
        }

        const conditionPreview = resolveEffectConditionPreview(effect, effectContext, outcomeName);

        results.push({
          effectId: effect.id,
          target: effect.target,
          computedValue,
          rolledValue,
          formula: parsedValue.formulaText,
          displayText,
          ...conditionPreview,
        });
      }

      return results;
    };

    /**
     * [新增] 处理效果确认流程
     * 检查是否有需要确认的效果,显示弹窗并在确认后执行
     */
    const handleEffectConfirmation = async (pendingCtx: PendingEffectContext): Promise<void> => {
      const { preset, matchedOutcome, context: effectContext } = pendingCtx;
      if (!matchedOutcome.effects || matchedOutcome.effects.length === 0) {
        return;
      }

      if (er().effectRunState.activeConfirmEffectRun && er().effectRunState.activeConfirmEffectRun.runId !== pendingCtx.runId) {
        const staleRun = er().effectRunState.activeConfirmEffectRun;
        er().setHistoryEffectStateByRun(staleRun, {
          effectStatus: 'cancelled',
          effectError: '确认弹窗被新的检定覆盖，自动取消',
          effectTrace: ['已取消：被新操作覆盖'],
        });
        const seq = er().emitEffectRun({
          runId: staleRun.runId,
          status: 'cancelled',
          characterName: staleRun.context.characterName,
          attributeName: staleRun.context.attributeName,
          historyIndex: staleRun.historyIndex,
          effectResults: [],
          effectTrace: ['已取消：被新操作覆盖'],
          chainMode: er().getSecondaryTriggerMode(staleRun.preset),
          error: '确认弹窗被新的检定覆盖，自动取消',
          timestamp: Date.now(),
        });
        er().setHistoryEffectStateByRun(staleRun, { effectEventSeq: seq });
      }
      er().effectRunState.activeConfirmEffectRun = pendingCtx;

      // 检查是否有需要确认的效果 (默认 needsConfirm=true)
      const needsConfirmEffects = matchedOutcome.effects.filter(e => e.needsConfirm !== false);
      if (needsConfirmEffects.length === 0) {
        // 所有效果都不需要确认,直接暂存等待 MESSAGE_SENT 执行
        return;
      }

      // 计算效果值
      const aliasCandidates = [...(preset.effectsConfig?.allowedTargets || []), effectContext.attributeName].filter(
        (name, idx, arr) => Boolean(name) && arr.indexOf(name) === idx,
      );
      const computedEffects = computeEffectsFromInputs(matchedOutcome.name, needsConfirmEffects, effectContext).map(
        eff => {
          const resolvedTarget = deps.resolveAttributeAliasName(
            effectContext.characterName,
            eff.target,
            aliasCandidates,
          ).name;
          const beforeValue = deps.getAttributeValue(effectContext.characterName, eff.target, aliasCandidates);
          const afterValue = beforeValue === null || beforeValue === undefined ? null : beforeValue + eff.computedValue;
          return {
            ...eff,
            resolvedTarget: resolvedTarget || undefined,
            beforeValue,
            afterValue,
          };
        },
      );
      if (computedEffects.length === 0) {
        return;
      }

      // 显示确认弹窗
      showEffectConfirmDialog({
        preset,
        outcomeLabel: `${effectContext.attributeName} 检定: ${matchedOutcome.name}`,
        branchReasonText: pendingCtx.branchReasonText,
        effects: computedEffects,
        onConfirm: async () => {
          const confirmedRun: PendingEffectContext = {
            ...pendingCtx,
            effectOverrides: computedEffects,
            timestamp: Date.now(),
          };

          er().enqueueEffectRun(confirmedRun);
          er().setHistoryEffectStateByRun(pendingCtx, {
            effectStatus: 'confirmed',
          });
          const seq = er().emitEffectRun({
            runId: pendingCtx.runId,
            status: 'confirmed',
            characterName: effectContext.characterName,
            attributeName: effectContext.attributeName,
            historyIndex: pendingCtx.historyIndex,
            effectResults: [],
            effectTrace: ['已确认，等待提交'],
            chainMode: er().getSecondaryTriggerMode(pendingCtx.preset),
            timestamp: Date.now(),
          });
          er().setHistoryEffectStateByRun(pendingCtx, { effectEventSeq: seq });
          if (er().effectRunState.activeConfirmEffectRun?.runId === pendingCtx.runId) {
            er().effectRunState.activeConfirmEffectRun = null;
          }
          console.info(`[DICE] Effect run confirmed: ${pendingCtx.runId}`);

          // 确认后立即尝试执行（MESSAGE_SENT 可能已在弹窗显示前触发过，不会再次触发）
          if (confirmedRun.messageId) {
            await er().processPendingEffectRuns(confirmedRun.messageId);
          } else {
            console.info(`[DICE][META] confirm waiting MESSAGE_SENT for run=${confirmedRun.runId}`);
            await er().processPendingEffectRuns();
          }
        },
        onCancel: () => {
          er().setHistoryEffectStateByRun(pendingCtx, { effectStatus: 'cancelled' });
          const seq = er().emitEffectRun({
            runId: pendingCtx.runId,
            status: 'cancelled',
            characterName: effectContext.characterName,
            attributeName: effectContext.attributeName,
            historyIndex: pendingCtx.historyIndex,
            effectResults: [],
            effectTrace: ['已取消'],
            chainMode: er().getSecondaryTriggerMode(pendingCtx.preset),
            timestamp: Date.now(),
          });
          er().setHistoryEffectStateByRun(pendingCtx, { effectEventSeq: seq });
          if (er().effectRunState.activeConfirmEffectRun?.runId === pendingCtx.runId) {
            er().effectRunState.activeConfirmEffectRun = null;
          }
          console.info('[DICE] Effect execution cancelled by user');
        },
      });
    };

    /**
     * [新增] 二级效果触发点检测
     * 在效果执行完成后检查是否触发二级效果
     */

  return {
    showEffectConfirmDialog,
    handleEffectConfirmation,
  };
}
