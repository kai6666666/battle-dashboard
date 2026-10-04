// @child-factory（由父模块 show-dice-panel 实例化，不参与 index 接线审计）
/**
 * dice-panel-effect-runs.ts
 * 从 show-dice-panel.ts 拆出：效果运行状态机（排队/重试/清理）、
 * meta 注入与历史状态写回。
 */
import { buildEffectMetaLines, buildEffectTraceLines } from '../../../shared/effect-math';

export function createDicePanelEffectRuns(deps: any, ctx: any) {
  const { $ } = deps.getCore();
  const getPanel = ctx && typeof ctx.getPanel === 'function' ? ctx.getPanel : () => null;
  const refreshAttrButtons = ctx && typeof ctx.buildAttrButtons === 'function' ? ctx.buildAttrButtons : () => {};
  const effectRunCleanerTimerKey = '__acuEffectRunCleanerTimer';
  const effectRunState: { activeConfirmEffectRun: PendingEffectContext | null } = { activeConfirmEffectRun: null };
    let pendingEffectRuns: PendingEffectContext[] = [];
    let effectRunRetryTimer: ReturnType<typeof setTimeout> | null = null;
    let effectRunEventSeq = 0;
    const EFFECT_RUN_TTL_MS = 60_000;
    const EFFECT_RUN_FALLBACK_WINDOW_MS = 2_500;
    const messageMutationQueues = new Map<number, Promise<unknown>>();
    const waitMs = (ms: number): Promise<void> => {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    };

    const enqueueMessageMutation = async <T>(messageId: number, task: () => Promise<T>): Promise<T> => {
      const prev = messageMutationQueues.get(messageId) || Promise.resolve();
      const next: Promise<T> = prev.catch(() => undefined).then(task);
      messageMutationQueues.set(messageId, next);
      try {
        return await next;
      } finally {
        if (messageMutationQueues.get(messageId) === next) {
          messageMutationQueues.delete(messageId);
        }
      }
    };

    const findMetaClosingIndex = (
      text: string,
      closingCandidates: string[],
      sourceMetaText?: string,
    ): { closingIdx: number; closingTag: string } => {
      if (sourceMetaText) {
        const anchorLine = sourceMetaText
          .split('\n')
          .map(line => line.trim())
          .find(line => line && line !== '<meta:检定结果>' && line !== '</meta:检定结果>');
        if (anchorLine) {
          const anchorIdx = text.indexOf(anchorLine);
          if (anchorIdx >= 0) {
            let bestIdx = -1;
            let bestTag = '';
            for (const candidate of closingCandidates) {
              const idx = text.indexOf(candidate, anchorIdx);
              if (idx >= 0 && (bestIdx === -1 || idx < bestIdx)) {
                bestIdx = idx;
                bestTag = candidate;
              }
            }
            if (bestIdx >= 0) return { closingIdx: bestIdx, closingTag: bestTag };
          }
        }
      }

      let closingIdx = -1;
      let closingTag = '';
      for (const candidate of closingCandidates) {
        const idx = text.lastIndexOf(candidate);
        if (idx > closingIdx) {
          closingIdx = idx;
          closingTag = candidate;
        }
      }
      return { closingIdx, closingTag };
    };

    const injectEffectLinesIntoMeta = async (
      messageId: number,
      runId: string,
      lines: string[],
      sourceMetaText?: string,
    ): Promise<boolean> => {
      if (lines.length === 0) return false;
      console.info(`[DICE][META] inject start: run=${runId}, message=${messageId}, lines=${lines.length}`);
      return enqueueMessageMutation(messageId, async () => {
        const retryDelays = [0, 120, 280, 500, 900];
        for (let attempt = 0; attempt < retryDelays.length; attempt++) {
          const delay = retryDelays[attempt];
          if (delay > 0) await waitMs(delay);

          const msgs = getChatMessages(messageId);
          if (msgs.length === 0) {
            console.info(
              `[DICE][META] inject retry=${attempt + 1}/${retryDelays.length}: message not found, run=${runId}, message=${messageId}`,
            );
            continue;
          }

          const msg = msgs[0];
          const msgRole = (msg as { role?: string }).role || 'unknown';
          const extraObj: Record<string, unknown> =
            msg.extra && typeof msg.extra === 'object' ? (msg.extra as Record<string, unknown>) : {};
          const injectedRunsRaw = extraObj.acuEffectInjectedRuns;
          const injectedRuns = Array.isArray(injectedRunsRaw)
            ? injectedRunsRaw.filter((v): v is string => typeof v === 'string')
            : [];
          if (injectedRuns.includes(runId)) {
            console.info(`[DICE][META] inject skipped duplicated run: run=${runId}, message=${messageId}`);
            return true;
          }

          const original = String(msg.message || '');
          const closingCandidates = ['</meta:检定结果>', '&lt;/meta:检定结果&gt;', '&amp;lt;/meta:检定结果&amp;gt;'];
          const { closingIdx, closingTag } = findMetaClosingIndex(original, closingCandidates, sourceMetaText);
          if (closingIdx === -1) {
            const hasRawOpen = original.includes('<meta:检定结果>');
            const hasRawClose = original.includes('</meta:检定结果>');
            const hasEscapedOpen = original.includes('&lt;meta:检定结果&gt;');
            const hasEscapedClose = original.includes('&lt;/meta:检定结果&gt;');
            console.info(
              `[DICE][META] inject retry=${attempt + 1}/${retryDelays.length}: closing tag not found, run=${runId}, message=${messageId}, role=${msgRole}, length=${original.length}, rawOpen=${hasRawOpen}, rawClose=${hasRawClose}, escapedOpen=${hasEscapedOpen}, escapedClose=${hasEscapedClose}`,
            );
            continue;
          }

          const beforeClose = original.slice(0, closingIdx);
          const needsLeadingNewline = beforeClose.length > 0 && !beforeClose.endsWith('\n');
          const effectBlock = `${needsLeadingNewline ? '\n' : ''}${lines.join('\n')}`;
          const updatedMsg = beforeClose + effectBlock + '\n' + original.slice(closingIdx);
          console.info(
            `[DICE][META] inject apply: run=${runId}, message=${messageId}, role=${msgRole}, attempt=${attempt + 1}, oldLen=${original.length}, newLen=${updatedMsg.length}, closingIdx=${closingIdx}, closingTag=${closingTag}`,
          );
          await setChatMessages(
            [
              {
                message_id: messageId,
                message: updatedMsg,
                extra: {
                  ...extraObj,
                  acuEffectInjectedRuns: [...injectedRuns, runId],
                },
              },
            ],
            { refresh: 'affected' },
          );
          const verifyMsg = getChatMessages(messageId)[0];
          const verifyText = String(verifyMsg?.message || '');
          const lineHitCount = lines.filter(line => verifyText.includes(line)).length;
          console.info(
            `[DICE][META] inject done: run=${runId}, message=${messageId}, lineHit=${lineHitCount}/${lines.length}, finalLen=${verifyText.length}`,
          );
          return true;
        }

        console.warn(
          `[DICE][META] inject failed: run=${runId}, message=${messageId}, reason=message_not_ready_or_meta_missing`,
        );
        return false;
      });
    };

    const injectEffectLinesIntoTextarea = (runId: string, lines: string[], sourceMetaText?: string): boolean => {
      if (lines.length === 0) return false;
      try {
        const { $ } = deps.getCore();
        const $ta = $('#send_textarea');
        if ($ta.length === 0) return false;
        const raw = String($ta.val() || '');
        if (!raw.includes('meta:检定结果')) return false;
        const missingLines = lines.filter(line => !raw.includes(line));
        if (missingLines.length === 0) {
          console.info(`[DICE][META] textarea inject skipped duplicated run=${runId}`);
          return true;
        }

        const closingCandidates = ['</meta:检定结果>', '&lt;/meta:检定结果&gt;', '&amp;lt;/meta:检定结果&amp;gt;'];
        const { closingIdx, closingTag } = findMetaClosingIndex(raw, closingCandidates, sourceMetaText);
        if (closingIdx === -1) {
          console.warn(`[DICE][META] textarea inject failed: closing tag missing, run=${runId}`);
          return false;
        }

        const beforeClose = raw.slice(0, closingIdx);
        const needsLeadingNewline = beforeClose.length > 0 && !beforeClose.endsWith('\n');
        const effectBlock = `${needsLeadingNewline ? '\n' : ''}${missingLines.join('\n')}`;
        const updated = beforeClose + effectBlock + '\n' + raw.slice(closingIdx);
        deps.setTextareaValueAndNotify($ta[0] as HTMLTextAreaElement, updated);
        console.info(
          `[DICE][META] textarea inject done: run=${runId}, lines=${missingLines.length}, closingTag=${closingTag}`,
        );
        return true;
      } catch (e) {
        console.warn(`[DICE][META] textarea inject error: run=${runId}`, e);
        return false;
      }
    };

    const hasMetaInTextarea = (): boolean => {
      try {
        const { $ } = deps.getCore();
        const $ta = $('#send_textarea');
        if ($ta.length === 0) return false;
        const raw = String($ta.val() || '');
        return raw.includes('meta:检定结果');
      } catch {
        return false;
      }
    };

    const normalizeMessageId = (payload: unknown): string | undefined => {
      if (payload === null || payload === undefined) return undefined;
      if (typeof payload === 'string' || typeof payload === 'number') return String(payload);
      if (typeof payload === 'object') {
        const record = payload as Record<string, unknown>;
        const candidates = [record.messageId, record.message_id, record.id, record.mid];
        const hit = candidates.find(v => v !== undefined && v !== null && String(v).trim() !== '');
        if (hit !== undefined && hit !== null) return String(hit);
      }
      return undefined;
    };

    const emitEffectRun = (payload: Omit<EffectRunEventPayload, 'seq'>): number => {
      effectRunEventSeq += 1;
      const fullPayload: EffectRunEventPayload = {
        ...payload,
        seq: effectRunEventSeq,
      };
      deps.emitEvent('effect_run', fullPayload);
      return effectRunEventSeq;
    };

    const getSecondaryTriggerMode = (preset?: AdvancedDicePreset): 'first' | 'all' => {
      return preset?.secondaryTriggerMode === 'all' ? 'all' : 'first';
    };

    const findHistoryIndexByRunId = (runId?: string): number => {
      if (!runId) return -1;
      for (let index = deps.getCheckHistory().length - 1; index >= 0; index--) {
        const item = deps.getCheckHistory()[index] as CheckHistoryEntry;
        if (item.effectRunId === runId) return index;
      }
      return -1;
    };

    const isValidEffectStatusTransition = (
      fromStatus: CheckHistoryExtension['effectStatus'],
      toStatus: CheckHistoryExtension['effectStatus'],
    ): boolean => {
      if (!fromStatus || !toStatus) return true;
      if (fromStatus === toStatus) return true;
      const transitions: Record<string, string[]> = {
        planned: ['confirmed', 'cancelled', 'failed'],
        confirmed: ['committed', 'failed', 'cancelled'],
        committed: [],
        failed: [],
        cancelled: [],
      };
      const allowed = transitions[fromStatus] || [];
      return allowed.includes(toStatus);
    };

    const setHistoryEffectState = (
      historyIndex: number,
      patch: Partial<CheckHistoryExtension>,
    ): CheckHistoryEntry | null => {
      if (historyIndex < 0 || historyIndex >= deps.getCheckHistory().length) return null;
      const historyEntry = deps.getCheckHistory()[historyIndex] as CheckHistoryEntry;
      const nextPatch = { ...patch };
      if (
        nextPatch.effectStatus &&
        historyEntry.effectStatus &&
        !isValidEffectStatusTransition(historyEntry.effectStatus, nextPatch.effectStatus)
      ) {
        console.warn(
          `[DICE] Invalid effect status transition blocked: ${historyEntry.effectStatus} -> ${nextPatch.effectStatus}`,
        );
        delete nextPatch.effectStatus;
      }
      Object.assign(historyEntry, nextPatch);
      return historyEntry;
    };

    const setHistoryEffectStateByRun = (
      run: PendingEffectContext,
      patch: Partial<CheckHistoryExtension>,
    ): CheckHistoryEntry | null => {
      const byRunId = findHistoryIndexByRunId(run.runId);
      if (byRunId >= 0) return setHistoryEffectState(byRunId, patch);
      console.warn(`[DICE] setHistoryEffectStateByRun skipped: runId not found (${run.runId})`);
      return null;
    };

    const resolveLatestMetaUserMessageId = (): number | undefined => {
      try {
        const lastId = getLastMessageId();
        if (!Number.isFinite(lastId) || lastId < 0) return undefined;
        const from = Math.max(0, lastId - 12);
        const msgs = getChatMessages(`${from}-${lastId}`, { role: 'user' }) as Array<{
          message_id: number;
          message: string;
        }>;
        for (let i = msgs.length - 1; i >= 0; i--) {
          const text = String(msgs[i].message || '');
          if (text.includes('meta:检定结果')) {
            return msgs[i].message_id;
          }
        }
      } catch {
        // ignore
      }
      return undefined;
    };

    const scheduleEffectRunRetry = (): void => {
      if (effectRunRetryTimer) return;
      effectRunRetryTimer = setTimeout(() => {
        effectRunRetryTimer = null;
        void processPendingEffectRuns();
      }, 220);
    };

    const enqueueEffectRun = (run: PendingEffectContext): void => {
      if (!run.expiresAt) {
        run.expiresAt = Date.now() + EFFECT_RUN_TTL_MS;
      }
      pendingEffectRuns.push(run);
      console.info(
        `[DICE] Effect run queued: ${run.runId}, message=${run.messageId || 'pending'}, expiresAt=${run.expiresAt}, pending=${pendingEffectRuns.length}`,
      );
    };

    const processPendingEffectRuns = async (payload?: unknown): Promise<void> => {
      const incomingMessageId = normalizeMessageId(payload);
      if (incomingMessageId) {
        console.info(`[DICE][META] MESSAGE_SENT captured id=${incomingMessageId}`);
      }

      // 即使队列为空，也将 messageId 捕获到正在等待确认的 run 上
      // （确认弹窗期间 MESSAGE_SENT 可能已触发，run 还没进队列）
      if (incomingMessageId && effectRunState.activeConfirmEffectRun && !effectRunState.activeConfirmEffectRun.messageId) {
        effectRunState.activeConfirmEffectRun.messageId = incomingMessageId;
        console.info(
          `[DICE][META] bind activeConfirm run=${effectRunState.activeConfirmEffectRun.runId} message=${incomingMessageId}`,
        );
      }

      if (pendingEffectRuns.length === 0) return;

      const now = Date.now();
      const nextPending: PendingEffectContext[] = [];
      const executableRuns: PendingEffectContext[] = [];
      const consumeAllRunsForMessage = deps.getDiceConfig().overwriteLastDiceResult === false;
      let consumedByMessage = false;
      let consumedByFallback = false;

      for (const run of pendingEffectRuns) {
        const expired = Boolean(run.expiresAt && run.expiresAt < now);
        if (expired) {
          const errMsg = '效果执行已过期，已自动取消';
          setHistoryEffectStateByRun(run, {
            effectStatus: 'cancelled',
            effectError: errMsg,
            effectTrace: ['已取消：超时未提交'],
          });
          const seq = emitEffectRun({
            runId: run.runId,
            status: 'cancelled',
            characterName: run.context.characterName,
            attributeName: run.context.attributeName,
            historyIndex: run.historyIndex,
            effectResults: [],
            effectTrace: ['已取消：超时未提交'],
            chainMode: getSecondaryTriggerMode(run.preset),
            error: errMsg,
            timestamp: now,
          });
          setHistoryEffectStateByRun(run, { effectEventSeq: seq });
          continue;
        }

        if (incomingMessageId) {
          if (run.messageId && run.messageId !== incomingMessageId) {
            nextPending.push(run);
            continue;
          }

          if (!consumedByMessage || consumeAllRunsForMessage) {
            if (!run.messageId) {
              run.messageId = incomingMessageId;
              console.info(`[DICE][META] bind queued run=${run.runId} message=${incomingMessageId}`);
            }
            executableRuns.push(run);
            if (!consumeAllRunsForMessage) {
              consumedByMessage = true;
            }
          } else {
            nextPending.push(run);
          }
          continue;
        }

        // 无 messageId 事件参数时，使用短时间窗降级执行，避免队列永久卡住
        const withinFallbackWindow = now - run.timestamp <= EFFECT_RUN_FALLBACK_WINDOW_MS;
        if (withinFallbackWindow && !consumedByFallback) {
          if (!run.messageId) {
            const guessedMsgId = resolveLatestMetaUserMessageId();
            if (guessedMsgId !== undefined) {
              run.messageId = String(guessedMsgId);
              console.warn(`[DICE][META] fallback guessed messageId: run=${run.runId}, message=${run.messageId}`);
            }
          }
          if (run.messageId) {
            console.warn(`[DICE] Effect run ${run.runId}: fallback commit with bound messageId=${run.messageId}`);
            executableRuns.push(run);
            consumedByFallback = true;
          } else if (hasMetaInTextarea()) {
            console.warn(`[DICE][META] fallback commit by textarea meta presence: run=${run.runId}`);
            executableRuns.push(run);
            consumedByFallback = true;
          } else {
            console.warn(`[DICE][META] fallback skipped: run=${run.runId} has no messageId yet`);
            nextPending.push(run);
          }
        } else if (!withinFallbackWindow && !consumedByFallback) {
          console.warn(`[DICE][META] timeout fallback commit without messageId: run=${run.runId}`);
          executableRuns.push(run);
          consumedByFallback = true;
        } else {
          nextPending.push(run);
        }
      }

      if (executableRuns.length === 0) {
        pendingEffectRuns = nextPending;
        if (pendingEffectRuns.length > 0) {
          scheduleEffectRunRetry();
        }
        return;
      }

      pendingEffectRuns = nextPending;
      for (const run of executableRuns) {
        try {
          const results = await deps.executeEffects(run);
          const hasFailure = results.some(r => !r.success);
          if (!hasFailure) {
            const succeeded = results.filter(r => r.success);
            const latestAttrResult = succeeded
              .slice()
              .reverse()
              .find(r => r.target && deps.isSameAttributeAlias(r.target, run.context.attributeName));
            if (latestAttrResult) {
              getPanel().find('#dice-attr-value').val(String(latestAttrResult.newValue));
            }
            refreshAttrButtons(run.context.characterName);
          }

          setHistoryEffectStateByRun(run, {
            effectStatus: hasFailure ? 'failed' : 'committed',
            effectResults: results,
            effectError: hasFailure ? '部分效果执行失败' : undefined,
            effectTrace: buildEffectTraceLines(results),
          });

          const seq = emitEffectRun({
            runId: run.runId,
            status: hasFailure ? 'failed' : 'committed',
            characterName: run.context.characterName,
            attributeName: run.context.attributeName,
            historyIndex: run.historyIndex,
            effectResults: results,
            effectTrace: buildEffectTraceLines(results),
            chainMode: getSecondaryTriggerMode(run.preset),
            error: hasFailure ? '部分效果执行失败' : undefined,
            timestamp: Date.now(),
          });
          setHistoryEffectStateByRun(run, { effectEventSeq: seq });

          if (hasFailure && window.toastr) {
            const firstError =
              results.find(result => !result.success && result.error)?.error ||
              deps.withTableTemplateCheckHint('请检查表格结构和字段约束');
            window.toastr.warning(`效果执行失败，已回滚本次全部效果：${firstError}`, '效果执行失败', {
              timeOut: 9000,
            });
          }

          console.info(
            `[DICE] Effect run committed: ${run.runId}, total=${results.length}, success=${results.filter(r => r.success).length}`,
          );

          // 效果结果注入：将属性变化和 outputMessage 插入到已有的 <meta:检定结果> 闭合标签前
          if (!hasFailure) {
            const metaLines = buildEffectMetaLines(results, {
              branchReasonText: run.branchReasonText,
            });
            if (metaLines.length > 0) {
              try {
                if (run.messageId) {
                  const msgId = parseInt(run.messageId, 10);
                  if (!isNaN(msgId) && msgId >= 0) {
                    const injected = await injectEffectLinesIntoMeta(msgId, run.runId, metaLines, run.sourceMetaText);
                    if (injected) {
                      console.info(
                        `[DICE] Effect results injected into meta: ${metaLines.length} line(s) in message ${msgId}`,
                      );
                    } else {
                      console.warn(
                        `[DICE][META] inject returned false: run=${run.runId}, rawMessageId=${run.messageId}, lines=${metaLines.length}`,
                      );
                    }
                  } else {
                    console.warn(
                      `[DICE][META] invalid messageId for injection: run=${run.runId}, rawMessageId=${run.messageId}`,
                    );
                  }
                } else {
                  const textareaInjected = injectEffectLinesIntoTextarea(run.runId, metaLines, run.sourceMetaText);
                  if (!textareaInjected) {
                    console.warn(`[DICE][META] no messageId and textarea inject failed: run=${run.runId}`);
                  }
                }
              } catch (injectErr) {
                console.error('[DICE] Failed to inject effect results into meta:', injectErr);
              }
            }
          }
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : String(error);
          setHistoryEffectStateByRun(run, {
            effectStatus: 'failed',
            effectError: errMsg,
            effectTrace: [`执行失败：${errMsg}`],
          });
          const seq = emitEffectRun({
            runId: run.runId,
            status: 'failed',
            characterName: run.context.characterName,
            attributeName: run.context.attributeName,
            historyIndex: run.historyIndex,
            effectResults: [],
            effectTrace: [`执行失败：${errMsg}`],
            chainMode: getSecondaryTriggerMode(run.preset),
            error: errMsg,
            timestamp: Date.now(),
          });
          setHistoryEffectStateByRun(run, { effectEventSeq: seq });
          console.error(`[DICE] Effect run failed: ${run.runId}`, error);
        }
      }
    };

    const cleanupExpiredEffectRuns = (): void => {
      if (pendingEffectRuns.length === 0) return;
      const now = Date.now();
      const nextPending: PendingEffectContext[] = [];
      for (const run of pendingEffectRuns) {
        const expired = Boolean(run.expiresAt && run.expiresAt < now);
        if (!expired) {
          nextPending.push(run);
          continue;
        }

        const errMsg = '效果执行已过期，已自动取消';
        setHistoryEffectStateByRun(run, {
          effectStatus: 'cancelled',
          effectError: errMsg,
          effectTrace: ['已取消：超时'],
        });
        const seq = emitEffectRun({
          runId: run.runId,
          status: 'cancelled',
          characterName: run.context.characterName,
          attributeName: run.context.attributeName,
          historyIndex: run.historyIndex,
          effectResults: [],
          effectTrace: ['已取消：超时'],
          chainMode: getSecondaryTriggerMode(run.preset),
          error: errMsg,
          timestamp: now,
        });
        setHistoryEffectStateByRun(run, { effectEventSeq: seq });
      }
      pendingEffectRuns = nextPending;
    };
    const existingCleaner = (window as Record<string, unknown>)[effectRunCleanerTimerKey];
    if (typeof existingCleaner === 'number') {
      window.clearInterval(existingCleaner);
    }
    (window as Record<string, unknown>)[effectRunCleanerTimerKey] = window.setInterval(() => {
      cleanupExpiredEffectRuns();
    }, 2000);


  return {
    injectEffectLinesIntoTextarea,
    emitEffectRun,
    getSecondaryTriggerMode,
    setHistoryEffectState,
    setHistoryEffectStateByRun,
    enqueueEffectRun,
    processPendingEffectRuns,
    effectRunState,
  };
}
