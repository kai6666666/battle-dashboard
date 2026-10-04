/**
 * mvu-module.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
import { MVU_STYLES } from './styles';
export function createMvuModule(deps: any) {
  const MvuModule = (function () {
    'use strict';

    // [新增] MVU 路径解析函数 - 用于投骰快捷选择（移到模块内部避免影响执行顺序）
    function parseMvuPathForDice(path: any, _value: any) {
      try {
        if (!path || typeof path !== 'string') {
          return { initiator: null, attrName: null, candidates: [] };
        }

        // 用 . 分割路径
        const parts = path.split('.').filter(p => p && p.trim());

        if (parts.length === 0) {
          return { initiator: null, attrName: null, candidates: [] };
        }

        // 仅用于从 MVU 路径里猜角色名/属性名；不控制骰子图标是否显示。
        const nonAttributePathParts = [
          '角色列表',
          '系统',
          '列表',
          '表',
          '数据',
          '信息',
          '变量',
          '属性',
          '状态',
          'stat_data',
          'delta_data',
        ];

        const filteredParts = parts.filter(p => !nonAttributePathParts.includes(p));

        // 提取可能的发起者（通常是倒数第二或第三层，排除黑名单后）
        let initiator = null;
        if (filteredParts.length >= 2) {
          // 倒数第二层通常是角色名
          initiator = filteredParts[filteredParts.length - 2];
        } else if (filteredParts.length === 1) {
          // 只有一层，可能是角色名
          initiator = filteredParts[0];
        }

        // 提取属性名（通常是最后一层）
        let attrName = null;
        if (filteredParts.length > 0) {
          attrName = filteredParts[filteredParts.length - 1];
        } else if (parts.length > 0) {
          // 如果所有部分都在黑名单中，至少取最后一部分
          attrName = parts[parts.length - 1];
        }

        // 生成候选列表（所有非黑名单的部分）
        const candidates = filteredParts.length > 0 ? filteredParts : parts.slice(-1);

        return {
          initiator: initiator || null,
          attrName: attrName || null,
          candidates: candidates,
        };
      } catch (e) {
        console.warn('[DICE]parseMvuPathForDice 解析路径时出错', e);
        return { initiator: null, attrName: null, candidates: [] };
      }
    }

    // ===== 私有变量 =====
    const MODULE_ID = '__mvu__';
    let cachedEraData: any = null; // 缓存 ERA 数据
    let cachedEraDataChatId: string | null = null;

    function getCurrentChatIdSafe(): string | null {
      const ST = window.SillyTavern || window.parent?.SillyTavern;
      try {
        return typeof ST?.getCurrentChatId === 'function' ? ST.getCurrentChatId() : null;
      } catch {
        return null;
      }
    }

    function clearMvuCacheIfChatChanged() {
      const chatId = getCurrentChatIdSafe();
      if (!cachedEraData) return;
      if (!chatId) return;
      if (cachedEraDataChatId && cachedEraDataChatId !== chatId) {
        cachedEraData = null;
        cachedEraDataChatId = null;
      }
    }

    function isLwbChatContext(): boolean {
      const lwbGuard = (globalThis as any).LWB_Guard || (window as any).LWB_Guard || (window.parent as any)?.LWB_Guard;
      if (typeof lwbGuard !== 'object' || lwbGuard === null) return false;

      const ST = window.SillyTavern || window.parent?.SillyTavern;
      const chatMetadata = ST?.chatMetadata;
      if (typeof chatMetadata !== 'object' || chatMetadata === null) return false;

      // 关键修复：如果 ERA 框架存在且有 ERA 数据，优先使用 ERA 而非 LWB
      const eventEmit = (window as any).eventEmit || (window.parent as any)?.eventEmit;
      const eventOn = (window as any).eventOn || (window.parent as any)?.eventOn;
      if (typeof eventEmit === 'function' && typeof eventOn === 'function') {
        const variablesUnknown = (chatMetadata as { variables?: unknown }).variables;
        if (typeof variablesUnknown === 'object' && variablesUnknown !== null) {
          const variables = variablesUnknown as Record<string, unknown>;
          // 如果有 ERA 保留键，明确是 ERA 卡
          if (variables.ERAMetaData !== undefined || variables.stat_data !== undefined) {
            return false;
          }
        }
      }

      // 关键修复：如果 MVU 框架存在，优先使用 MVU 而非 LWB
      // MVU 数据存储在消息楼层变量中，不在 chatMetadata.variables 中
      // 因此即使 chatMetadata 有 LWB_* 残留键，也应该优先使用 MVU
      if (typeof (window as any).Mvu !== 'undefined' && typeof (window as any).Mvu.getMvuData === 'function') {
        // MVU 框架可用，尝试检查是否有 MVU 数据
        try {
          const mvuData = (window as any).Mvu.getMvuData({ type: 'message', message_id: 'latest' });
          // 如果能成功获取 MVU 数据（即使 stat_data 为空），说明这是 MVU 卡
          if (mvuData !== null && mvuData !== undefined) {
            return false;
          }
        } catch {
          // MVU 获取失败，继续检查 LWB
        }
      }

      // LWB_Guard 是全局的，安装扩展后一直存在，不能作为单独判据。
      // 必须有明确的 LWB 标记才能判定为 LWB 卡。

      // 检查 chatMetadata 顶层是否有 LWB_* 标记
      const hasLwbMetaKey = Object.keys(chatMetadata).some(k => k.startsWith('LWB_') || k.startsWith('lwb_'));
      if (hasLwbMetaKey) return true;

      const variablesUnknown = (chatMetadata as { variables?: unknown }).variables;
      if (typeof variablesUnknown !== 'object' || variablesUnknown === null) return false;

      const variables = variablesUnknown as Record<string, unknown>;

      // 检查 variables 中是否有 LWB_* 标记
      const hasLwbVarKey = Object.keys(variables).some(k => k.startsWith('LWB_') || k.startsWith('lwb_'));
      if (hasLwbVarKey) return true;

      // 关键修复：只有当有明确的 LWB 标记时才认为是 LWB
      // 不再使用启发式检测（JSON 字符串值），因为这会误判 MVU 卡
      // MVU 卡的数据存储在消息楼层变量中，不在 chatMetadata.variables 中
      // 如果没有 LWB_* 标记，就不是 LWB 卡
      return false;
    }

    // ===== 检测当前聊天是否有 ERA 特征数据 =====
    function hasEraDataInCurrentChat(): boolean {
      const ST = window.SillyTavern || window.parent?.SillyTavern;
      const chatMetadata = ST?.chatMetadata;
      if (typeof chatMetadata !== 'object' || chatMetadata === null) return false;

      const variablesUnknown = (chatMetadata as { variables?: unknown }).variables;
      if (typeof variablesUnknown !== 'object' || variablesUnknown === null) return false;

      const variables = variablesUnknown as Record<string, unknown>;
      // ERA 特征：有 ERAMetaData 或 stat_data 键
      return variables.ERAMetaData !== undefined || variables.stat_data !== undefined;
    }

    // ===== 智能检测变量源 =====
    function detectMode() {
      clearMvuCacheIfChatChanged();

      // 如果有缓存数据，检查数据来源标记
      if (cachedEraData && cachedEraData._source) {
        return cachedEraData._source;
      }

      // [新增] 优先检测 LWB (小白X)，因为 LWB 需要特殊处理
      if (isLwbChatContext()) {
        console.log('[DICE]MvuModule 智能检测到 LWB (小白X) 框架');
        return 'lwb';
      }

      // 检测 ERA：框架存在 且 当前聊天有 ERA 特征数据
      const eventEmit = (window as any).eventEmit || (window.parent as any)?.eventEmit;
      const eventOn = (window as any).eventOn || (window.parent as any)?.eventOn;
      const eraFrameworkExists = typeof eventEmit === 'function' && typeof eventOn === 'function';

      if (eraFrameworkExists && hasEraDataInCurrentChat()) {
        console.log('[DICE]MvuModule 智能检测到 ERA 框架（当前聊天有 ERA 数据）');
        return 'era';
      }

      // 其次检测 MVU
      if (typeof (window as any).Mvu !== 'undefined' && typeof (window as any).Mvu.getMvuData === 'function') {
        console.log('[DICE]MvuModule 智能检测到 MVU 框架');
        return 'mvu';
      }

      // 如果 ERA 框架存在但当前聊天无数据，仍返回 ERA（新建聊天场景）
      if (eraFrameworkExists) {
        console.log('[DICE]MvuModule 智能检测到 ERA 框架（新聊天，无数据）');
        return 'era';
      }

      // 默认 MVU
      console.log('[DICE]MvuModule 未检测到框架，默认使用 MVU 模式');
      return 'mvu';
    }

    // ===== 增强的智能检测（带数据验证）=====
    async function detectModeWithData() {
      // [新增] 1. 优先尝试 LWB（因为需要特殊处理）
      if (isLwbChatContext()) {
        const lwbData = getLwbData();
        console.log('[DICE]检测到 LWB 框架，数据条目数:', Object.keys(lwbData.stat_data).length);
        return { mode: 'lwb', data: lwbData };
      }

      // 2. 检测 ERA：框架存在 且 当前聊天有 ERA 特征数据
      const eventEmit = (window as any).eventEmit || (window.parent as any)?.eventEmit;
      const eventOn = (window as any).eventOn || (window.parent as any)?.eventOn;
      const eraFrameworkExists = typeof eventEmit === 'function' && typeof eventOn === 'function';

      if (eraFrameworkExists && hasEraDataInCurrentChat()) {
        try {
          // 尝试实际获取 ERA 数据（带超时）
          const eraData = await Promise.race([
            getEraData(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('ERA timeout')), 2000)),
          ]);

          if (eraData && (eraData as any).stat_data) {
            console.log('[DICE]检测到 ERA 框架且数据可用');
            return { mode: 'era', data: eraData };
          }
        } catch (e) {
          console.warn('[DICE]ERA 框架存在但数据不可用:', (e as any).message);
        }
      }

      // 3. 尝试 MVU
      try {
        await waitGlobalInitialized('Mvu');

        if (typeof (window as any).Mvu !== 'undefined' && typeof (window as any).Mvu.getMvuData === 'function') {
          const mvuData = (window as any).Mvu.getMvuData({ type: 'message', message_id: 'latest' });

          if (mvuData && mvuData.stat_data) {
            console.log('[DICE]检测到 MVU 框架且数据可用');
            return {
              mode: 'mvu',
              data: {
                stat_data: mvuData.stat_data || null,
                display_data: mvuData.display_data || {},
                delta_data: mvuData.delta_data || {},
                schema: mvuData.schema || null,
                _source: 'mvu', // 标记数据来源
              },
            };
          }
        }
      } catch (e) {
        console.warn('[DICE]MVU 框架检测失败:', e);
      }

      // 3. 都不可用，返回默认 MVU 模式（向后兼容）
      console.warn('[DICE]未检测到可用的变量框架，默认使用 MVU 模式');
      return { mode: 'mvu', data: null };
    }

    // ===== LWB (小白X) 数据获取函数 =====
    // JSON解析辅助函数（基于 LWB 源码分析，只需单次解析）
    // 注意：LWB 不存在双重序列化，只做单次 JSON.parse
    function parseJsonSafe(value: unknown): unknown {
      if (typeof value !== 'string') return value;

      const trimmed = value.trim();
      if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return value;

      try {
        return JSON.parse(trimmed) as unknown;
      } catch {
        return value;
      }
    }

    // 获取小白X变量数据
    function getLwbData() {
      try {
        // iframe 兼容的 SillyTavern 访问
        const ST = window.SillyTavern || window.parent?.SillyTavern;
        const variables = ST?.chatMetadata?.variables || {};
        const stat_data: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(variables)) {
          // 跳过小白X内部键（防御性编程）
          if (key.startsWith('LWB_') || key.startsWith('lwb_')) continue;

          // 使用 parseJsonSafe 处理 JSON 字符串（单次解析）
          const parsed = parseJsonSafe(value);

          // 只保留嵌套对象（plot-log特征）
          if (typeof parsed === 'object' && parsed !== null) {
            stat_data[key] = parsed;
          }
        }

        // 关键：始终返回对象，即使 stat_data 为空
        // 确保 _source: 'lwb' 进入缓存，使 detectMode() 返回 'lwb'
        // 注意：不在此处更新 cachedEraData，由调用方负责
        return {
          stat_data,
          display_data: {},
          delta_data: {},
          _source: 'lwb',
        };
      } catch (e) {
        console.warn('[DICE]获取LWB变量失败:', e);
        // 即使出错也返回空的 LWB 数据对象，确保模式标记正确
        return {
          stat_data: {},
          display_data: {},
          delta_data: {},
          _source: 'lwb',
        };
      }
    }

    // ===== ERA 数据获取函数 =====
    // 异步获取ERA变量数据
    async function getEraData() {
      return new Promise(resolve => {
        const timeoutId = setTimeout(() => {
          console.warn('[DICE]MvuModule ERA查询超时');
          resolve(null);
        }, 5000);

        // 尝试获取 eventEmit 和 eventOn（支持 iframe 环境）
        const eventEmit = (window as any).eventEmit || (window.parent as any)?.eventEmit;
        const eventOn = (window as any).eventOn || (window.parent as any)?.eventOn;
        const eventOff = (window as any).eventOff || (window.parent as any)?.eventOff;

        const onResult = (detail: any) => {
          clearTimeout(timeoutId);
          // 移除事件监听（如果 eventOff 不可用，则忽略）
          if (typeof eventOff === 'function') {
            try {
              eventOff('era:queryResult', onResult);
            } catch (e) {
              console.warn('[DICE]MvuModule 移除事件监听失败:', e);
            }
          }

          // console.log('[DICE]MvuModule 收到ERA查询结果:', JSON.stringify(detail, null, 2));
          // console.log('[DICE]MvuModule detail.result:', JSON.stringify(detail.result, null, 2));

          if (detail.result && detail.result.error) {
            console.error('[DICE]MvuModule ERA查询失败:', detail.result.error);
            resolve(null);
            return;
          }

          const statData = detail.result?.statWithoutMeta || null;
          // console.log('[DICE]MvuModule 提取的 stat_data:', JSON.stringify(statData, null, 2));

          const result = {
            stat_data: statData,
            delta_data: {},
            schema: null,
            _source: 'era', // 标记数据来源
          };

          // 缓存数据
          cachedEraData = result;
          cachedEraDataChatId = getCurrentChatIdSafe();

          resolve(result);
        };

        try {
          console.log('[DICE]MvuModule 开始获取ERA数据...');
          console.log('[DICE]MvuModule ERA API 检查:', {
            eventEmit: typeof eventEmit === 'function',
            eventOn: typeof eventOn === 'function',
            eventOff: typeof eventOff === 'function',
          });

          if (typeof eventOn !== 'function') {
            console.error('[DICE]MvuModule eventOn 不可用');
            clearTimeout(timeoutId);
            resolve(null);
            return;
          }
          if (typeof eventEmit !== 'function') {
            console.error('[DICE]MvuModule eventEmit 不可用');
            clearTimeout(timeoutId);
            resolve(null);
            return;
          }

          eventOn('era:queryResult', onResult);
          eventEmit('era:getCurrentVars');
        } catch (e) {
          clearTimeout(timeoutId);
          console.error('[DICE]MvuModule ERA API调用失败:', e);
          resolve(null);
        }
      });
    }

    // ERA 变量设置函数
    async function setEraValue(path: any, newValue: any) {
      return new Promise(resolve => {
        const timeoutId = setTimeout(() => {
          console.warn('[DICE]MvuModule ERA写入超时');
          resolve(false);
        }, 5000);

        // 尝试获取 eventEmit 和 eventOn（支持 iframe 环境）
        const eventEmit = (window as any).eventEmit || (window.parent as any)?.eventEmit;
        const eventOn = (window as any).eventOn || (window.parent as any)?.eventOn;
        const eventOff = (window as any).eventOff || (window.parent as any)?.eventOff;

        const onWriteDone = (_detail: any) => {
          clearTimeout(timeoutId);
          if (typeof eventOff === 'function') {
            eventOff('era:writeDone', onWriteDone);
          }
          console.log('[DICE]MvuModule ERA写入成功');
          resolve(true);
        };

        try {
          console.log('[DICE]MvuModule 开始设置ERA变量:', path, newValue);

          if (typeof eventOn !== 'function') {
            console.error('[DICE]MvuModule eventOn 不可用');
            clearTimeout(timeoutId);
            resolve(false);
            return;
          }
          if (typeof eventEmit !== 'function') {
            console.error('[DICE]MvuModule eventEmit 不可用');
            clearTimeout(timeoutId);
            resolve(false);
            return;
          }

          eventOn('era:writeDone', onWriteDone);
          eventEmit('era:updateByPath', {
            path: path,
            value: newValue,
          });
        } catch (e) {
          clearTimeout(timeoutId);
          console.error('[DICE]MvuModule ERA API调用失败:', e);
          resolve(false);
        }
      });
    }

    // ===== 样式定义 =====
    const STYLES = MVU_STYLES;

    // ===== 工具函数 =====
    function escapeHtml(s: any) {
      return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function isAvailable() {
      const mode = detectMode();

      if (mode === 'era') {
        // ERA 模式：检查 eventEmit 和 eventOn 是否可用（支持 iframe 环境）
        const eventEmit = (window as any).eventEmit || (window.parent as any)?.eventEmit;
        const eventOn = (window as any).eventOn || (window.parent as any)?.eventOn;
        const emitAvailable = typeof eventEmit === 'function';
        const onAvailable = typeof eventOn === 'function';
        return emitAvailable && onAvailable;
      } else if (mode === 'lwb') {
        // [新增] LWB 模式：检查 chatMetadata.variables 是否可访问
        const ST = window.SillyTavern || window.parent?.SillyTavern;
        return ST?.chatMetadata !== undefined;
      } else {
        // MVU 模式：检查 MVU 框架是否加载
        const mvuAvailable = typeof (window as any).Mvu !== 'undefined' && typeof (window as any).Mvu.getMvuData === 'function';
        return mvuAvailable;
      }
    }

    function getData() {
      console.warn('[DICE]警告: getData() 是同步函数，可能无法正确获取 MVU 数据。建议使用 getDataWithRetry()');

      clearMvuCacheIfChatChanged();

      // 优先返回缓存（可能来自 ERA 或 MVU）
      if (cachedEraData) {
        return cachedEraData;
      }

      // [新增] 尝试同步获取 LWB
      if (isLwbChatContext()) {
        const lwbData = getLwbData();
        cachedEraData = lwbData;
        cachedEraDataChatId = getCurrentChatIdSafe();
        console.log('[DICE]LWB 数据同步获取成功');
        return lwbData;
      }

      // 尝试同步获取 MVU（可能失败）
      try {
        if (typeof (window as any).Mvu !== 'undefined' && typeof (window as any).Mvu.getMvuData === 'function') {
          const allVars = (window as any).Mvu.getMvuData({ type: 'message', message_id: 'latest' });

          if (allVars && allVars.stat_data) {
            const data = {
              stat_data: allVars.stat_data || null,
              display_data: allVars.display_data || {},
              delta_data: allVars.delta_data || {},
              schema: allVars.schema || null,
              _source: 'mvu', // 标记数据来源
            };

            cachedEraData = data; // 更新缓存
            cachedEraDataChatId = getCurrentChatIdSafe();
            return data;
          }
        }
      } catch (e) {
        console.warn('[DICE]同步获取 MVU 数据失败:', e);
      }

      return null;
    }

    // ===== MVU 专用重试函数 =====
    async function getMvuDataWithRetry(maxRetries = 3, retryDelay = 500) {
      try {
        // [修复] 首先检查 MVU API 是否已经可用，避免不必要的等待
        if (typeof (window as any).Mvu === 'undefined' || typeof (window as any).Mvu.getMvuData !== 'function') {
          // 只有在 MVU 未初始化时才等待，使用较短的超时时间
          try {
            await Promise.race([
              waitGlobalInitialized('Mvu'),
              new Promise((_, reject) => setTimeout(() => reject(new Error('等待 MVU 初始化超时')), 3000)),
            ]);
          } catch (e) {
            console.warn('[DICE]等待 MVU 初始化失败，尝试直接获取:', (e as any).message);
            // 继续尝试，可能 MVU 已经部分可用
          }
        }

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            if (typeof (window as any).Mvu === 'undefined' || typeof (window as any).Mvu.getMvuData !== 'function') {
              throw new Error('MVU API 不可用');
            }

            const allVars = (window as any).Mvu.getMvuData({ type: 'message', message_id: 'latest' });

            if (allVars && allVars.stat_data) {
              const data = {
                stat_data: allVars.stat_data || null,
                display_data: allVars.display_data || {},
                delta_data: allVars.delta_data || {},
                schema: allVars.schema || null,
                _source: 'mvu', // 标记数据来源
              };

              // 为 MVU 也添加缓存
              cachedEraData = data;
              cachedEraDataChatId = getCurrentChatIdSafe();
              console.log('[DICE]MVU 数据获取成功');
              return data;
            }
          } catch (e) {
            console.warn(`[DICE]MVU 数据获取失败 (尝试 ${attempt}/${maxRetries}):`, e);
          }

          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }

        return null;
      } catch (e) {
        console.error('[DICE]MVU 初始化失败:', e);
        return null;
      }
    }

    // 支持重试获取数据的函数
    async function getDataWithRetry(maxRetries = 3, retryDelay = 500) {
      try {
        // 使用增强的检测函数
        const detection = await detectModeWithData();

        // 如果检测时已经获取到数据，直接返回
        if (detection.data) {
          cachedEraData = detection.data; // 更新缓存
          cachedEraDataChatId = getCurrentChatIdSafe();
          return detection.data;
        }

        // 否则根据模式进行重试
        const mode = detection.mode;

        if (mode === 'era') {
          // ERA 模式：重试获取
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              const data = await getEraData();
              if (data && (data as any).stat_data) {
                cachedEraData = data;
                cachedEraDataChatId = getCurrentChatIdSafe();
                return data;
              }
            } catch (e) {
              console.warn(`[DICE]ERA 数据获取失败 (尝试 ${attempt}/${maxRetries}):`, e);
            }

            if (attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
          }

          // ERA 失败，尝试降级到 MVU
          console.warn('[DICE]ERA 数据获取失败，尝试降级到 MVU');
          return await getMvuDataWithRetry(maxRetries, retryDelay);
        } else if (mode === 'lwb') {
          // [新增] LWB 模式：重新获取
          const lwbData = getLwbData();
          cachedEraData = lwbData;
          cachedEraDataChatId = getCurrentChatIdSafe();
          return lwbData;
        } else {
          // MVU 模式
          return await getMvuDataWithRetry(maxRetries, retryDelay);
        }
      } catch (e) {
        console.error('[DICE]数据获取失败:', e);
        return null;
      }
    }

    // 判断是否是 ValueWithDescription 格式 [值, "描述"]
    function isVWD(value: any) {
      return (
        Array.isArray(value) &&
        value.length === 2 &&
        typeof value[1] === 'string' &&
        (typeof value[0] === 'number' || typeof value[0] === 'string' || typeof value[0] === 'boolean')
      );
    }

    // 判断是否是简单数组（元素都是原始值）
    function isSimpleArray(value: any) {
      if (!Array.isArray(value)) return false;
      return value.every(
        item => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean' || item === null,
      );
    }

    // 获取变化指示器
    function getChangeIndicator(path: any, deltaData: any) {
      if (!deltaData || !path) return '';

      const parts = path.split('.');
      let current = deltaData;
      for (const part of parts) {
        if (current === null || current === undefined) return '';
        current = current[part];
      }

      if (!current) return '';

      if (typeof current === 'string' && current.includes('->')) {
        const match = current.match(/^(-?[\d.]+)->(-?[\d.]+)/);
        if (match) {
          const oldVal = parseFloat(match[1]);
          const newVal = parseFloat(match[2]);
          if (!isNaN(oldVal) && !isNaN(newVal)) {
            return newVal > oldVal ? '↑' : newVal < oldVal ? '↓' : '';
          }
        }
        return '•';
      }
      return '';
    }

    // 统计对象/数组的子项数量
    function countChildren(value: any) {
      if (Array.isArray(value)) {
        if (isVWD(value)) return 0;
        return value.length;
      }
      if (value && typeof value === 'object') {
        return Object.keys(value).filter(k => !k.startsWith('$')).length;
      }
      return 0;
    }

    // ===== 渲染函数 =====

    // 智能提取数值部分的显示值
    // 处理三种情况：纯数值、数值+描述、数值+范围+描述
    function extractNumericDisplayValue(value: any, isArray = false) {
      // 处理 null/undefined
      if (value === null || value === undefined) {
        return '';
      }

      // 数组类型：保持原有逻辑
      if (isArray || Array.isArray(value)) {
        if (isVWD(value)) {
          return String(value[0]);
        } else if (isSimpleArray(value)) {
          return value.map((v: any) => String(v ?? '')).join(', ');
        } else {
          // 复杂数组，返回原始表示
          return String(value);
        }
      }

      // 转换为字符串处理
      const str = String(value).trim();

      // 1. 纯数值：匹配纯数字格式（如 "85", "-20", "100%"）
      if (/^-?\d+(\.\d+)?%?$/.test(str)) {
        return str;
      }

      // 2. 数值+范围+描述：匹配 "数值,[范围] 描述" 格式
      // 例如："0,[-20, 120] 对User的好感度。通过积极互动提升..."
      const rangeMatch = str.match(/^(-?\d+(?:\.\d+)?%?)(,\s*\[[^\]]+\])?\s+/);
      if (rangeMatch) {
        // 如果匹配到范围部分，返回数值和范围
        if (rangeMatch[2]) {
          return rangeMatch[1] + rangeMatch[2].trim();
        }
        // 如果没有范围，只返回数值部分
        return rangeMatch[1];
      }

      // 2.5. 数值/数值,描述：匹配 "数值/数值,描述" 格式
      // 例如："100/100,当前/最大生命值，格式为'当前/最大'。归零时你将陷入濒死或死亡状态。"
      const slashNumericMatch = str.match(/^(-?\d+(?:\.\d+)?%?\/-?\d+(?:\.\d+)?%?),/);
      if (slashNumericMatch) {
        return slashNumericMatch[1];
      }

      // 3. 数值,描述：匹配 "数值,描述" 格式（逗号后直接跟描述，没有空格和方括号）
      // 例如："150000,记录当前持有的资金，单位为蓝星币..."
      const commaDescMatch = str.match(/^(-?\d+(?:\.\d+)?%?),/);
      if (commaDescMatch) {
        return commaDescMatch[1];
      }

      // 4. 数值+描述：匹配 "数值 描述" 格式（数值后跟非数字字符）
      // 例如："85 对高坂月的好感度"
      const numericDescMatch = str.match(/^(-?\d+(?:\.\d+)?%?)\s+[^\d]/);
      if (numericDescMatch) {
        return numericDescMatch[1];
      }

      // 5. 其他情况：返回原始值
      return str;
    }

    // 从显示值中提取第一个数值（用于投骰）
    // 例如："85" -> 85, "85,[0,100]" -> 85, "0,[-20, 120]" -> 0
    function extractFirstNumericValue(displayValue: any) {
      if (!displayValue) return 0;
      const str = String(displayValue).trim();

      // 提取第一个数字（支持负数、小数、百分比）
      const match = str.match(/^(-?\d+(?:\.\d+)?)/);
      if (match) {
        const num = parseFloat(match[1]);
        return isNaN(num) ? 0 : num;
      }

      return 0;
    }

    // 渲染单个键值对行
    function renderRow(key: any, value: any, path: any, deltaData: any) {
      const changeIndicator = getChangeIndicator(path, deltaData);
      const changedClass = changeIndicator ? 'mvu-changed' : '';

      let displayValue;
      let valueClass = 'mvu-value';

      if (isVWD(value)) {
        displayValue = String(value[0]);
      } else if (isSimpleArray(value)) {
        displayValue = value.map((v: any) => String(v ?? '')).join(', ');
        valueClass += ' mvu-array-value';
      } else {
        // 使用智能提取函数，只显示数值部分
        displayValue = extractNumericDisplayValue(value ?? '', false);
      }

      // [新增] 判断是否为数字或包含数字，如果是则添加骰子图标
      let diceIconHtml = '';
      try {
        // 先使用 extractNumericDisplayValue 提取显示值，然后提取第一个数值
        // 这样可以正确处理 "85,[0,100]" 这样的格式，提取 85 而不是 100
        if (typeof deps.isNumericCell === 'function' && deps.isNumericCell(displayValue)) {
          // 从显示值中提取第一个数值（用于投骰）
          const numericValue = extractFirstNumericValue(displayValue);
          if (numericValue > 0) {
            // 提取属性名：优先使用 key，如果 key 包含路径信息则提取最后一部分
            let attrName = key;
            if (key.includes('.')) {
              const parts = key.split('.');
              attrName = parts[parts.length - 1];
            }
            // 如果路径也包含信息，尝试从路径提取属性名
            if (path && path.includes('.')) {
              const pathParts = path.split('.');
              const lastPart = pathParts[pathParts.length - 1];
              // 如果路径最后一部分看起来像属性名（不是纯数字），使用它
              if (lastPart && !/^\d+$/.test(lastPart) && lastPart !== key) {
                attrName = lastPart;
              }
            }
            if (deps.RenderPresetManager.shouldShowQuickCheck(attrName)) {
              diceIconHtml = `<i class="fa-solid fa-dice-d20 mvu-dice-icon acu-mvu-dice-icon" data-path="${escapeHtml(path)}" data-attr-name="${escapeHtml(attrName)}" data-attr-value="${numericValue}" title="快捷投骰"></i>`;
            }
          }
        }
      } catch (e) {
        console.warn('[DICE]MvuModule renderRow: 判断数字时出错', e);
      }

      return `
                <div class="mvu-row ${changedClass}">
                    <div class="mvu-key">${escapeHtml(key)}</div>
                    <div class="mvu-value-wrap">
                        <span class="${valueClass}" data-path="${escapeHtml(path)}">${escapeHtml(displayValue)}</span>
                        ${diceIconHtml}
                        ${changeIndicator ? `<span class="mvu-change-indicator">${changeIndicator}</span>` : ''}
                    </div>
                </div>
            `;
    }

    // 渲染卡片（递归）
    function renderCard(key: any, value: any, path: any, deltaData: any, depth: any, defaultExpanded: any, isHorizontal: any) {
      const childCount = countChildren(value);
      const collapsedClass = defaultExpanded ? '' : 'collapsed';

      let bodyHtml = '';
      let hasNestedCards = false; // 标记是否有嵌套卡片
      let nestedCardCount = 0; // 统计嵌套卡片数量（用于计算宽度）
      let rowCount = 0; // 统计键值对数量

      if (Array.isArray(value) && !isVWD(value) && !isSimpleArray(value)) {
        // 复杂数组：每个元素作为子卡片或行
        value.forEach((item, index) => {
          const itemPath = `${path}[${index}]`;

          if (item && typeof item === 'object' && !isVWD(item) && !isSimpleArray(item)) {
            hasNestedCards = true;
            nestedCardCount++;
            bodyHtml += renderCard(`[${index}]`, item, itemPath, deltaData, depth + 1, false, isHorizontal);
          } else {
            rowCount++;
            bodyHtml += renderRow(`[${index}]`, item, itemPath, deltaData);
          }
        });
      } else if (value && typeof value === 'object' && !isVWD(value)) {
        // 对象：遍历键值
        const entries = Object.entries(value).filter(([k]) => !k.startsWith('$'));

        for (const [childKey, childValue] of entries) {
          const childPath = path ? `${path}.${childKey}` : childKey;

          if (childValue && typeof childValue === 'object' && !isVWD(childValue) && !isSimpleArray(childValue)) {
            // 嵌套对象/数组 → 子卡片
            hasNestedCards = true;
            nestedCardCount++;
            bodyHtml += renderCard(childKey, childValue, childPath, deltaData, depth + 1, false, isHorizontal);
          } else {
            // 原始值或简单数组 → 行
            rowCount++;
            bodyHtml += renderRow(childKey, childValue, childPath, deltaData);
          }
        }
      }

      const countText = Array.isArray(value) ? `[${childCount}]` : `(${childCount})`;

      // 如果是横向模式且有嵌套卡片，为 card-body 添加 horizontal-nested 类
      const bodyClass = isHorizontal && hasNestedCards ? 'mvu-card-body horizontal-nested' : 'mvu-card-body';

      // 检查嵌套卡片是否需要更大的宽度（递归检查）
      let nestedCardsNeedWidth = false;
      if (isHorizontal && hasNestedCards && depth === 0) {
        // 对于顶层卡片，检查嵌套卡片内部是否有多个子卡片（需要横向排列）
        if (Array.isArray(value) && !isVWD(value) && !isSimpleArray(value)) {
          // 数组：检查每个嵌套项
          value.forEach(item => {
            if (item && typeof item === 'object' && !isVWD(item) && !isSimpleArray(item)) {
              const itemChildCount = countChildren(item);
              if (itemChildCount >= 2) nestedCardsNeedWidth = true;
            }
          });
        } else if (value && typeof value === 'object' && !isVWD(value)) {
          // 对象：检查每个嵌套键值
          const entries = Object.entries(value).filter(([k]) => !k.startsWith('$'));
          for (const [_childKey, childValue] of entries) {
            if (childValue && typeof childValue === 'object' && !isVWD(childValue) && !isSimpleArray(childValue)) {
              const childChildCount = countChildren(childValue);
              if (childChildCount >= 2) nestedCardsNeedWidth = true;
            }
          }
        }
      }

      // 在横向模式下，只有当卡片内部主要是嵌套卡片（键值对很少或没有）时，才添加 has-nested-cards 类
      // 这样可以避免键值对占用过多横向空间
      // 对于顶层卡片（depth === 0）：
      //   - 如果嵌套卡片数量 >= 2 且键值对数量 <= 1，添加 has-nested-cards
      //   - 或者，如果嵌套卡片本身需要更大的宽度（内部有多个子卡片），也添加 has-nested-cards
      // 对于嵌套卡片（depth > 0），只有当只有嵌套卡片（rowCount === 0）且嵌套卡片数量 >= 2 时，才添加 has-nested-cards
      const shouldAddHasNestedClass =
        isHorizontal &&
        hasNestedCards &&
        ((depth === 0 && ((nestedCardCount >= 2 && rowCount <= 1) || nestedCardsNeedWidth)) || // 顶层卡片：嵌套卡片数量 >= 2 且键值对 <= 1，或者嵌套卡片需要更大宽度
          (depth > 0 && rowCount === 0 && nestedCardCount >= 2)); // 嵌套卡片：没有键值对且嵌套卡片数量 >= 2
      const hasNestedClass = shouldAddHasNestedClass ? ' has-nested-cards' : '';

      return `
                <div class="mvu-card${hasNestedClass} ${collapsedClass}" data-path="${escapeHtml(path)}" data-depth="${depth}">
                    <div class="mvu-card-header">
                        <div class="mvu-card-title">
                            <span>${escapeHtml(key)}</span>
                            <span class="mvu-card-count">${countText}</span>
                        </div>
                        <span class="mvu-card-toggle">▼</span>
                    </div>
                    <div class="${bodyClass}">
                        ${bodyHtml}
                    </div>
                </div>
            `;
    }

    // [新增] 渲染数值过滤模式
    function renderNumericMode(mvuData: any) {
      if (!mvuData || !mvuData.stat_data) {
        return '<div class="mvu-empty"><i class="fa-solid fa-inbox"></i><p>当前没有变量数据</p></div>';
      }

      // [新增] 读取层级显示偏好
      let visibleLevels = {};
      try {
        const saved = localStorage.getItem('acu_mvu_numeric_mode_visible_levels');
        if (saved) {
          visibleLevels = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('[DICE]MvuModule 读取层级显示偏好失败', e);
      }

      // 收集所有数值项
      const numericItems: any[] = [];

      // 递归遍历收集数值项
      function collectNumericItems(obj: any, path: any, levelNames: any) {
        if (!obj || typeof obj !== 'object') return;

        if (Array.isArray(obj)) {
          if (isVWD(obj) || isSimpleArray(obj)) {
            // 简单数组，检查每个元素
            obj.forEach((item, index) => {
              const itemPath = path ? `${path}[${index}]` : `[${index}]`;
              const itemValue = String(item ?? '').trim();
              if (typeof deps.isNumericCell === 'function' && deps.isNumericCell(itemValue)) {
                // 先提取显示值，然后提取第一个数值（用于投骰）
                const displayValue = extractNumericDisplayValue(itemValue, false);
                const numValue = extractFirstNumericValue(displayValue);
                if (numValue > 0) {
                  numericItems.push({
                    path: itemPath,
                    key: `[${index}]`,
                    value: itemValue,
                    numericValue: numValue,
                    levelNames: [...levelNames],
                  });
                }
              }
            });
          } else {
            // 复杂数组，递归处理
            obj.forEach((item, index) => {
              const itemPath = path ? `${path}[${index}]` : `[${index}]`;
              const newLevelNames = [...levelNames, `[${index}]`];
              collectNumericItems(item, itemPath, newLevelNames);
            });
          }
        } else {
          // 对象，遍历键值
          const entries = Object.entries(obj).filter(([k]) => !k.startsWith('$'));
          for (const [key, value] of entries) {
            const childPath = path ? `${path}.${key}` : key;
            const newLevelNames = [...levelNames, key];

            if (value && typeof value === 'object' && !isVWD(value) && !isSimpleArray(value)) {
              // 嵌套对象，递归处理
              collectNumericItems(value, childPath, newLevelNames);
            } else {
              // 原始值，检查是否为数字
              const itemValue = String(value ?? '').trim();
              if (typeof deps.isNumericCell === 'function' && deps.isNumericCell(itemValue)) {
                // 先提取显示值，然后提取第一个数值（用于投骰）
                const displayValue = extractNumericDisplayValue(itemValue, false);
                const numValue = extractFirstNumericValue(displayValue);
                if (numValue > 0) {
                  numericItems.push({
                    path: childPath,
                    key: key,
                    value: itemValue,
                    numericValue: numValue,
                    levelNames: newLevelNames,
                  });
                }
              }
            }
          }
        }
      }

      // 收集所有数值项
      const topKeys = Object.keys(mvuData.stat_data).filter(k => !k.startsWith('$'));
      for (const key of topKeys) {
        const value = mvuData.stat_data[key];
        collectNumericItems(value, key, [key]);
      }

      // [新增] 黑名单过滤：检查路径中的所有层级
      const filteredNumericItems = numericItems.filter(item => {
        // 获取所有非数组索引的层级名称
        const nonArrayLevels = item.levelNames.filter((level: any) => level && !level.startsWith('['));
        // 检查路径中的任意层级是否在黑名单中
        // 只要有一个层级匹配黑名单，就过滤掉整个项
        for (const levelKey of nonArrayLevels) {
          if (!deps.RenderPresetManager.shouldShowQuickCheck(levelKey)) {
            return false;
          }
        }
        return true;
      });

      if (filteredNumericItems.length === 0) {
        return '<div class="mvu-empty"><i class="fa-solid fa-filter"></i><p>当前没有数值项</p></div>';
      }

      // 收集所有唯一的层级名称（使用过滤后的列表）
      // 【修复 2】排除最下层的属性名，只收集层级名
      const allLevelNames = new Set();
      filteredNumericItems.forEach(item => {
        // 排除最下层的属性名，只收集层级名
        const hierarchyLevels =
          item.levelNames.length > 1
            ? item.levelNames.slice(0, -1) // 排除最后一个
            : [];

        hierarchyLevels.forEach((level: any) => {
          if (level && !level.startsWith('[')) {
            // 排除数组索引
            allLevelNames.add(level);
          }
        });
      });

      const levelNamesArray = Array.from(allLevelNames).sort();

      // 生成层级 toggle 控制区域（可折叠）
      let levelTogglesHtml = '';
      if (levelNamesArray.length > 0) {
        // 生成层级按钮内容
        let levelButtonsHtml = '';
        levelNamesArray.forEach(levelName => {
          const isVisible = (visibleLevels as any)[levelName as string] !== false; // 默认显示
          const activeClass = isVisible ? 'active' : '';
          levelButtonsHtml += `<button type="button" class="mvu-level-toggle acu-mvu-level-toggle ${activeClass}" data-level="${escapeHtml(levelName)}" data-visible="${isVisible}" aria-pressed="${isVisible ? 'true' : 'false'}" aria-label="${isVisible ? '隐藏' : '显示'}层级: ${escapeHtml(levelName)}" title="${isVisible ? '隐藏' : '显示'}层级: ${escapeHtml(levelName)}"><span>${escapeHtml(levelName)}</span></button>`;
        });

        // 包装为可折叠结构，默认折叠
        levelTogglesHtml = `
          <div class="mvu-level-controls-collapsible collapsed">
            <div class="mvu-level-controls-header acu-mvu-header">
              <span class="acu-mvu-header-text">显示层级</span>
              <i class="fa-solid fa-chevron-down mvu-level-controls-toggle-icon acu-mvu-toggle-icon"></i>
            </div>
            <div class="mvu-level-controls-body acu-mvu-body">
              ${levelButtonsHtml}
            </div>
          </div>
        `;
      }

      // 生成数值项列表（使用过滤后的列表）
      let itemsHtml = '';
      filteredNumericItems.forEach(item => {
        // 计算非数组层级（用于 data-levels 属性）
        const nonArrayLevels = item.levelNames.filter((level: any) => !level.startsWith('['));

        // 根据层级显示偏好过滤显示的层级名称
        const visibleLevels = item.levelNames.filter((level: any) => {
          if (level.startsWith('[')) return false; // 排除数组索引
          try {
            const saved = localStorage.getItem('acu_mvu_numeric_mode_visible_levels');
            if (saved) {
              const prefs = JSON.parse(saved);
              return prefs[level] !== false; // 默认显示
            }
          } catch (e) {
            // 忽略错误，默认显示
          }
          return true;
        });

        // 【修复 1】排除最下层名称，避免与属性名重复
        // 如果 visibleLevels 有多个元素，移除最后一个
        const pathLevels = visibleLevels.length > 1 ? visibleLevels.slice(0, -1) : [];

        // 检查该项的所有层级是否都可见（用于初始显示状态）
        // 注意：这里使用 nonArrayLevels 的前 N-1 个层级（排除最下层）
        const hierarchyLevels = nonArrayLevels.length > 1 ? nonArrayLevels.slice(0, -1) : [];

        const allLevelsVisible = hierarchyLevels.every((level: any) => {
          try {
            const saved = localStorage.getItem('acu_mvu_numeric_mode_visible_levels');
            if (saved) {
              const prefs = JSON.parse(saved);
              return prefs[level] !== false; // 默认显示
            }
          } catch (e) {
            // 忽略错误，默认显示
          }
          return true;
        });

        // 生成路径显示（使用排除最下层后的层级）
        const pathDisplay = pathLevels.length > 0 ? pathLevels.join(' > ') : '';
        const attrName = item.key;

        // 提取属性名（从路径最后一部分）
        let finalAttrName = attrName;
        if (item.path && item.path.includes('.')) {
          const parts = item.path.split('.');
          finalAttrName = parts[parts.length - 1];
        }

        // 生成骰子图标
        const diceIconHtml = deps.RenderPresetManager.shouldShowQuickCheck(finalAttrName)
          ? `<i class="fa-solid fa-dice-d20 mvu-dice-icon acu-mvu-dice-icon" data-path="${escapeHtml(item.path)}" data-attr-name="${escapeHtml(finalAttrName)}" data-attr-value="${item.numericValue}" title="快捷投骰"></i>`
          : '';

        // 使用智能提取函数，只显示数值部分
        let displayValue = extractNumericDisplayValue(item.value, false);
        // 在数值模式下，去掉范围部分（如去掉 ",[0, 100]"）
        displayValue = displayValue.replace(/,\s*\[[^\]]+\]/g, '');

        // 生成初始显示状态和 data-levels 属性
        // 注意：data-levels 存储的是层级名（排除最下层属性名）
        const displayStyle = allLevelsVisible ? '' : 'display:none;';
        const levelsJson = JSON.stringify(hierarchyLevels);

        itemsHtml += `
          <div class="mvu-numeric-item acu-mvu-item" data-levels='${escapeHtml(levelsJson)}' style="${displayStyle}">
            <div class="acu-mvu-item-content">
              <div class="mvu-path-display acu-mvu-path">${escapeHtml(pathDisplay)}</div>
              <div class="acu-mvu-item-row">
                <span class="acu-mvu-attr-name">${escapeHtml(finalAttrName)}</span>
                <span class="mvu-value acu-mvu-val" data-path="${escapeHtml(item.path)}" title="点击编辑">${escapeHtml(displayValue)}</span>
                ${diceIconHtml}
              </div>
            </div>
          </div>
        `;
      });

      return levelTogglesHtml + '<div class="mvu-numeric-items acu-mvu-list">' + itemsHtml + '</div>';
    }

    // ===== 公开 API =====
    return {
      MODULE_ID: MODULE_ID,

      isAvailable: isAvailable,
      getData: getData,
      getDataWithRetry: getDataWithRetry,

      // 诊断工具：检查变量框架状态
      diagnoseVariableFramework: async function () {
        const result = {
          timestamp: new Date().toISOString(),
          era: {
            available: false,
            eventEmit: typeof ((window as any).eventEmit || (window.parent as any)?.eventEmit) === 'function',
            eventOn: typeof ((window as any).eventOn || (window.parent as any)?.eventOn) === 'function',
            dataAvailable: false,
            error: null,
          },
          mvu: {
            available: false,
            apiExists: typeof (window as any).Mvu !== 'undefined',
            getDataExists: typeof (window as any).Mvu?.getMvuData === 'function',
            dataAvailable: false,
            error: null,
          },
          cache: {
            hasCache: !!cachedEraData,
            cacheKeys: cachedEraData ? Object.keys(cachedEraData) : [],
          },
          recommendation: '',
        };

        // 测试 ERA
        if (result.era.eventEmit && result.era.eventOn) {
          try {
            const eraData = await Promise.race([
              getEraData(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000)),
            ]);
            result.era.available = true;
            result.era.dataAvailable = !!(eraData && (eraData as any).stat_data);
          } catch (e) {
            result.era.error = (e as any).message;
          }
        }

        // 测试 MVU
        if (result.mvu.apiExists && result.mvu.getDataExists) {
          try {
            // [修复] 使用较短的超时，避免阻塞诊断
            await Promise.race([
              waitGlobalInitialized('Mvu'),
              new Promise((_, reject) => setTimeout(() => reject(new Error('等待超时')), 2000)),
            ]);
            const mvuData = (window as any).Mvu.getMvuData({ type: 'message', message_id: 'latest' });
            result.mvu.available = true;
            result.mvu.dataAvailable = !!(mvuData && mvuData.stat_data);
          } catch (e) {
            result.mvu.error = (e as any).message;
          }
        }

        // 生成建议
        if (result.era.dataAvailable) {
          result.recommendation = 'ERA 框架可用且数据正常';
        } else if (result.mvu.dataAvailable) {
          result.recommendation = 'MVU 框架可用且数据正常';
        } else if (result.era.available || result.mvu.available) {
          result.recommendation = '框架已安装但数据不可用，请检查角色卡是否正确初始化变量';
        } else {
          result.recommendation = '未检测到任何变量框架，请确认已安装 MVU 或 ERA 插件';
        }

        return result;
      },

      injectStyles: function () {
        // 获取主页面的 document（兼容 iframe 环境）
        const targetDoc = window.parent?.document || document;
        if (targetDoc.getElementById('mvu-module-styles')) return;
        const styleEl = targetDoc.createElement('style');
        styleEl.id = 'mvu-module-styles';
        styleEl.textContent = STYLES;
        targetDoc.head.appendChild(styleEl);
      },

      renderNavButton: function (isActive: any) {
        // 总是显示按钮，不检查 isAvailable()，让用户可以随时尝试查看变量
        const activeClass = isActive ? 'active' : '';
        return `<button class="acu-nav-btn acu-mvu-btn $${activeClass}" id="acu-btn-mvu" data-table="$${MODULE_ID}" style="order:-1;">
                    <i class="fa-solid fa-code-branch"></i><span>变量</span>
                </button>`;
      },

      renderPanel: function () {
        // 简化逻辑：总是显示面板，不依赖复杂的加载状态判断
        // 直接尝试获取数据，如果失败或为空，显示相应的提示信息，但始终显示刷新按钮

        const mvuData = getData();

        // 智能检测当前模式（ERA、MVU 或 LWB）
        const varMode = (mvuData && mvuData._source) || detectMode();

        // [新增] 读取数值模式状态
        let isNumericMode = false;
        try {
          const saved = localStorage.getItem('acu_mvu_numeric_mode');
          isNumericMode = saved === 'true';
        } catch (e) {
          console.warn('[DICE]MvuModule 读取数值模式状态失败', e);
        }

        // MVU面板始终使用竖向滚动模式，不受全局布局配置影响
        const layoutMode = 'vertical-layout';

        // 生成面板标题
        const panelTitle = varMode === 'lwb' ? 'LWB 变量' : varMode === 'era' ? 'ERA 变量' : 'MVU 变量';

        // 如果无法获取数据（MVU 框架未加载或数据为 null）
        if (!mvuData) {
          return `
                        <div class="acu-panel-header">
                            <div class="acu-panel-title">
                                <div class="acu-title-main"><i class="fa-solid fa-code-branch"></i> <span class="acu-title-text">${panelTitle}</span></div>
                                <div class="acu-title-sub">(0项)</div>
                            </div>
                            <div class="acu-header-actions">
                                ${deps.getTutorialButtonHtml('mvu', '查看变量面板教程')}
                                <button type="button" class="mvu-header-btn mvu-btn-refresh" aria-label="刷新变量" title="刷新（自动重试获取变量）">
                                    <i class="fa-solid fa-sync-alt"></i>
                                </button>
                                <div class="acu-height-control">
                                    <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${MvuModule.MODULE_ID}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                                </div>
                                <button type="button" class="acu-close-btn" aria-label="关闭变量面板" title="关闭">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mvu-content ${layoutMode}">
                            <div class="mvu-empty">
                                <i class="fa-solid fa-exclamation-circle"></i>
                                <p>找不到变量框架数据</p>
                                <p class="mvu-empty-hint">会优先读取 ERA、MVU、LWB 变量框架；请点击右上角刷新，或关闭变量面板后重新打开。</p>
                            </div>
                        </div>
                    `;
        }

        // 如果 stat_data 为空或 null，显示空状态（但数据对象存在）
        if (
          !mvuData.stat_data ||
          (typeof mvuData.stat_data === 'object' && Object.keys(mvuData.stat_data).length === 0)
        ) {
          return `
                        <div class="acu-panel-header">
                            <div class="acu-panel-title">
                                <div class="acu-title-main"><i class="fa-solid fa-code-branch"></i> <span class="acu-title-text">${panelTitle}</span></div>
                                <div class="acu-title-sub">(0项)</div>
                            </div>
                            <div class="acu-header-actions">
                                ${deps.getTutorialButtonHtml('mvu', '查看变量面板教程')}
                                <button type="button" class="mvu-header-btn mvu-btn-refresh" aria-label="刷新变量" title="刷新（自动重试获取变量）">
                                    <i class="fa-solid fa-sync-alt"></i>
                                </button>
                                <div class="acu-height-control">
                                    <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${MvuModule.MODULE_ID}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                                </div>
                                <button type="button" class="acu-close-btn" aria-label="关闭变量面板" title="关闭">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mvu-content ${layoutMode}">
                            <div class="mvu-empty">
                                <i class="fa-solid fa-inbox"></i>
                                <p>当前没有变量数据</p>
                                <p class="mvu-empty-hint">${varMode === 'lwb' ? '当前没有变量数据，变量将在 AI 通过 plot-log 输出后显示' : '变量数据将在 AI 回复后自动初始化，或点击刷新按钮自动重试获取变量'}</p>
                            </div>
                        </div>
                    `;
        }

        // [新增] 如果启用数值模式，使用专门的渲染函数
        if (isNumericMode) {
          const numericHtml = renderNumericMode(mvuData);
          return `
                    <div class="acu-panel-header">
                        <div class="acu-panel-title">
                            <div class="acu-title-main"><i class="fa-solid fa-code-branch"></i> <span class="acu-title-text">${panelTitle}</span> <span style="font-size:calc(var(--acu-font-size,13px) * 0.85);color:var(--acu-text-sub);margin-left:6px;">(数值模式)</span></div>
                            <div class="acu-title-sub">(数值过滤)</div>
                        </div>
                        <div class="acu-header-actions">
                            ${deps.getTutorialButtonHtml('mvu', '查看变量面板教程')}
                            <button type="button" class="mvu-header-btn mvu-btn-numeric-mode active" aria-label="切换到普通模式" aria-pressed="true" title="切换到普通模式">
                                <i class="fa-solid fa-list"></i>
                            </button>
                            <button type="button" class="mvu-header-btn mvu-btn-refresh" aria-label="刷新变量" title="刷新（自动重试获取变量）">
                                <i class="fa-solid fa-sync-alt"></i>
                            </button>
                            <div class="acu-height-control">
                                <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${MvuModule.MODULE_ID}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                            </div>
                            <button type="button" class="acu-close-btn" aria-label="关闭变量面板" title="关闭">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mvu-content ${layoutMode} mvu-numeric-mode">
                        ${numericHtml}
                    </div>
                `;
        }

        // 有数据，正常显示
        const topKeys = Object.keys(mvuData.stat_data).filter(k => !k.startsWith('$'));

        let cardsHtml = '';
        for (const key of topKeys) {
          const value = mvuData.stat_data[key];
          const childCount = countChildren(value); void childCount;

          if (value && typeof value === 'object' && !isVWD(value) && !isSimpleArray(value)) {
            // 对象/复杂数组 → 卡片（顶层默认展开）
            // MVU面板始终使用竖向滚动，所以 isHorizontal 始终为 false
            cardsHtml += renderCard(key, value, key, mvuData.delta_data, 0, true, false);
          } else {
            // 原始值或简单数组 → 单独一个迷你卡片
            cardsHtml += `
                            <div class="mvu-card" data-path="${escapeHtml(key)}" data-depth="0">
                                <div class="mvu-card-body">
                                    ${renderRow(key, value, key, mvuData.delta_data)}
                                </div>
                            </div>
                        `;
          }
        }

        return `
                    <div class="acu-panel-header">
                        <div class="acu-panel-title">
                            <div class="acu-title-main"><i class="fa-solid fa-code-branch"></i> <span class="acu-title-text">${panelTitle}</span></div>
                            <div class="acu-title-sub">(${topKeys.length}项)</div>
                        </div>
                        <div class="acu-header-actions">
                            ${deps.getTutorialButtonHtml('mvu', '查看变量面板教程')}
                            <button type="button" class="mvu-header-btn mvu-btn-numeric-mode" aria-label="切换到数值模式" aria-pressed="false" title="切换到数值模式（仅显示数值项）">
                                <i class="fa-solid fa-filter"></i>
                            </button>
                            <button type="button" class="mvu-header-btn mvu-btn-refresh" aria-label="刷新变量" title="刷新（自动重试获取变量）">
                                <i class="fa-solid fa-sync-alt"></i>
                            </button>
                            <div class="acu-height-control">
                                <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${MvuModule.MODULE_ID}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                            </div>
                            <button type="button" class="acu-close-btn" aria-label="关闭变量面板" title="关闭">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mvu-content ${layoutMode}">
                        ${cardsHtml}
                    </div>
                `;
      },

      bindEvents: function ($container: any) {
        // 使用主页面的 jQuery
        const $ = window.parent?.jQuery || window.jQuery;
        if (!$ || !$container || !$container.length) {
          console.warn('[DICE]MvuModule bindEvents: jQuery or container not available');
          return;
        }

        // 优先使用调用者传入的当前面板，避免多根渲染时绑定到旧面板。
        const $panel = $container && $container.length ? $container : $('#acu-data-area');
        if (!$panel.length) {
          console.warn('[DICE]MvuModule bindEvents: #acu-data-area not found');
          return;
        }

        // 解绑旧事件
        $panel.off('.mvu');

        // 卡片折叠/展开（改进版，添加平滑动画）
        $panel.on('click.mvu', '.mvu-card-header', function (this: any, e: any) {
          e.stopPropagation();
          const $card = $(this).closest('.mvu-card');
          const $body = $card.find('> .mvu-card-body').first();

          // 防止动画过程中重复点击
          if ($body.is(':animated') || $body.hasClass('animating')) return;

          if ($card.hasClass('collapsed')) {
            // 展开：先用 hide() 确保元素隐藏，移除 collapsed 类后再播放动画
            $body.hide();
            $card.removeClass('collapsed');
            $body.addClass('animating').slideDown(180, function (this: any) {
              $(this).removeClass('animating');
            });
          } else {
            // 收起
            $body.addClass('animating').slideUp(180, function (this: any) {
              $card.addClass('collapsed');
              $(this).removeClass('animating');
            });
          }
        });

        // 刷新按钮
        $panel.on('click.mvu', '.mvu-btn-refresh', function (e: any) {
          e.stopPropagation();
          MvuModule.refresh($panel);
        });

        // [新增] 数值模式切换按钮
        $panel.on('click.mvu', '.mvu-btn-numeric-mode', function (this: any, e: any) {
          e.stopPropagation();
          try {
            const isCurrentlyNumeric = $(this).hasClass('active');
            const newMode = !isCurrentlyNumeric;
            localStorage.setItem('acu_mvu_numeric_mode', String(newMode));
            // 刷新面板
            if (typeof deps.saveActiveTabState === 'function') {
              const currentTab = deps.getActiveTabState();
              deps.saveActiveTabState(currentTab);
            }
            if (typeof deps.renderInterface === 'function') {
              deps.renderInterface();
            }
          } catch (e) {
            console.warn('[DICE]MvuModule 切换数值模式失败', e);
            if (window.toastr)
              showActionableErrorToast('切换 MVU 数值模式失败，偏好可能没有写入 localStorage。', {
                developerHint: true,
              });
          }
        });

        // [新增] 层级控制折叠/展开
        $panel.on('click.mvu', '.mvu-level-controls-header', function (this: any, e: any) {
          e.stopPropagation();
          const $header = $(this);
          const $collapsible = $header.closest('.mvu-level-controls-collapsible');

          // 切换 collapsed 类，CSS 会自动处理动画
          $collapsible.toggleClass('collapsed');
        });

        // [新增] 层级显示 toggle
        $panel.on('click.mvu', '.mvu-level-toggle', function (this: any, e: any) {
          e.stopPropagation();
          const $button = $(this);
          const levelName = $button.data('level');
          const currentVisible = $button.data('visible') === 'true' || $button.data('visible') === true;
          const isVisible = !currentVisible;

          try {
            const saved = localStorage.getItem('acu_mvu_numeric_mode_visible_levels');
            const visibleLevels = saved ? JSON.parse(saved) : {};
            (visibleLevels as any)[levelName] = isVisible;
            localStorage.setItem('acu_mvu_numeric_mode_visible_levels', JSON.stringify(visibleLevels));

            // 更新按钮样式和状态
            $button.data('visible', isVisible);
            $button.attr('data-visible', String(isVisible));
            if (isVisible) {
              $button.addClass('active');
              $button.css({
                background: 'var(--acu-accent)',
                color: 'var(--acu-btn-active-text)',
                borderColor: 'var(--acu-accent)',
                opacity: '1',
              });
              $button.attr('title', `隐藏层级: ${levelName}`);
              $button.attr('aria-pressed', 'true');
              $button.attr('aria-label', `隐藏层级: ${levelName}`);
            } else {
              $button.removeClass('active');
              $button.css({
                background: 'transparent',
                color: 'var(--acu-text-sub)',
                borderColor: 'var(--acu-border)',
                opacity: '0.5',
              });
              $button.attr('title', `显示层级: ${levelName}`);
              $button.attr('aria-pressed', 'false');
              $button.attr('aria-label', `显示层级: ${levelName}`);
            }

            // 【修复 3】局部更新路径显示，而不是全量重渲染
            $('.mvu-numeric-item').each(function (this: any) {
              const $item = $(this);
              try {
                const levels = JSON.parse($item.attr('data-levels') || '[]');
                if (levels.includes(levelName)) {
                  // 重新计算路径显示
                  const visibleLevels = levels.filter((level: any) => {
                    const saved = localStorage.getItem('acu_mvu_numeric_mode_visible_levels');
                    const prefs = saved ? JSON.parse(saved) : {};
                    return prefs[level] !== false;
                  });

                  // 排除最下层，避免重复（这里 levels 已经是排除了最下层的）
                  const pathLevels = visibleLevels;

                  const newPathDisplay = pathLevels.length > 0 ? pathLevels.join(' > ') : '';

                  // 更新路径显示文本
                  $item.find('.mvu-path-display').text(newPathDisplay);
                }
              } catch (e) {
                console.warn('[DICE]MvuModule 更新路径显示失败', e);
              }
            });
          } catch (e) {
            console.warn('[DICE]MvuModule 更新层级显示偏好失败', e);
          }
        });

        // 点击值编辑
        $panel.on('click.mvu', '.mvu-value', function (this: any, e: any) {
          e.stopPropagation();
          const $value = $(this);
          const path = $value.data('path');
          if (!path) {
            console.warn('[DICE]MvuModule No path on value element');
            return;
          }
          const currentValue = $value
            .text()
            .replace(/\s*\$\s*$/, '')
            .trim(); // 移除末尾的 $

          MvuModule.showEditDialog(path, currentValue, async function (newValue: any) {
            if (newValue !== null && newValue !== currentValue) {
              const success = await MvuModule.setValue(path, newValue);
              const toastr = window.parent?.toastr || window.toastr;
              if (success) {
                $value.text(newValue);
                $value.css('background', 'var(--acu-success-bg)');
                setTimeout(() => $value.css('background', ''), 1500);
              } else {
                if (toastr)
                  showActionableErrorToast(`保存变量「${path}」失败。`, {
                    suggestion: '请刷新变量面板确认当前角色数据仍可写入；如果仍失败，请打开 Debug 控制台查看 MVU 写入日志。',
                  });
              }
            }
          });
        });

        // [新增] 点击骰子图标快捷投骰
        $panel.on('click.mvu', '.mvu-dice-icon', function (this: any, e: any) {
          e.stopPropagation();
          e.preventDefault();
          const $icon = $(this);
          const path = $icon.data('path');
          const attrName = $icon.data('attr-name') || '属性';
          const attrValue = parseInt($icon.data('attr-value'), 10) || 50;

          // 验证路径有效性
          if (!path) {
            console.warn('[DICE]MvuModule 骰子图标缺少路径信息');
            return;
          }

          // 检查 MVU 框架是否可用
          if (typeof (window as any).Mvu === 'undefined' || typeof (window as any).Mvu.getMvuData !== 'function') {
            console.warn('[DICE]MvuModule MVU 框架未加载，降级为普通投骰');
            // 降级为普通投骰，不解析路径
            if (typeof deps.showDicePanel === 'function') {
              deps.showDicePanel({
                attrValue: attrValue,
                targetValue: null, // 让showDicePanel根据模式自动计算
                targetName: attrName,
                initiatorName: '<user>',
                fromMvu: false,
              });
            }
            return;
          }

          // 尝试从路径解析发起者和属性名
          let parsedInfo = null;
          try {
            parsedInfo = parseMvuPathForDice(path, attrValue);
          } catch (e) {
            console.warn('[DICE]MvuModule 解析路径时出错', e);
          }

          // 调用投骰面板
          if (typeof deps.showDicePanel === 'function') {
            deps.showDicePanel({
              attrValue: attrValue,
              targetValue: null, // 让showDicePanel根据模式自动计算
              targetName: attrName,
              initiatorName: parsedInfo?.initiator || '<user>',
              fromMvu: true,
              mvuPath: path,
              mvuParsedInfo: parsedInfo,
            });
          }
        });

        // 阻止水平滑动冒泡，防止触发 ST 的 swipe regenerate
        (function () {
          // 使用主页面的 document（iframe 环境）
          const targetDoc = window.parent?.document || document;
          const $doc = $(targetDoc);

          // 先解绑旧事件，避免重复绑定
          $doc.off('touchstart.mvuSwipeFix touchmove.mvuSwipeFix touchend.mvuSwipeFix', '#acu-data-area');

          let touchStartX = 0;
          let touchStartY = 0;
          let isHorizontalSwipe = false;

          // 在 #acu-data-area 上处理，但检查是否是 MVU 面板
          $doc.on('touchstart.mvuSwipeFix', '#acu-data-area', function (e: any) {
            const $target = $(e.target);
            const isInMvuPanel = $target.closest('.acu-mvu-panel').length > 0;

            // 检查是否在 MVU 面板内
            if (!isInMvuPanel) return;

            if (e.originalEvent.touches.length === 1) {
              touchStartX = e.originalEvent.touches[0].clientX;
              touchStartY = e.originalEvent.touches[0].clientY;
              isHorizontalSwipe = false;
            }
          });

          $doc.on('touchmove.mvuSwipeFix', '#acu-data-area', function (e: any) {
            const $target = $(e.target);
            const isInMvuPanel = $target.closest('.acu-mvu-panel').length > 0;

            // 检查是否在 MVU 面板内
            if (!isInMvuPanel) {
              return;
            }

            if (e.originalEvent.touches.length !== 1) return;

            const touch = e.originalEvent.touches[0];
            const deltaX = Math.abs(touch.clientX - touchStartX);
            const deltaY = Math.abs(touch.clientY - touchStartY);

            // 如果是水平滑动为主（X位移 > Y位移 * 1.5），阻止冒泡和默认行为
            // 修改判断逻辑：当deltaY很小时，降低deltaX阈值；否则使用原来的判断
            const isHorizontal =
              deltaY < 5
                ? deltaX > 5 && deltaX > deltaY * 2 // deltaY很小时，只要deltaX > 5且明显大于deltaY就认为是水平滑动
                : deltaX > deltaY * 1.5 && deltaX > 10; // 正常情况使用原判断

            if (isHorizontal) {
              isHorizontalSwipe = true;
              e.stopImmediatePropagation();
              e.stopPropagation();
            }
          });

          $doc.on('touchend.mvuSwipeFix', '#acu-data-area', function (e: any) {
            const $target = $(e.target);
            const isInMvuPanel = $target.closest('.acu-mvu-panel').length > 0;

            // 检查是否在 MVU 面板内
            if (!isInMvuPanel) {
              isHorizontalSwipe = false;
              touchStartX = 0;
              touchStartY = 0;
              return;
            }

            // 如果是水平滑动，阻止冒泡和默认行为
            if (isHorizontalSwipe) {
              e.stopImmediatePropagation();
              e.stopPropagation();
              isHorizontalSwipe = false;
            }
            touchStartX = 0;
            touchStartY = 0;
          });

          // 尝试在捕获阶段也监听
          const captureHandlerTouchStart = function (e: any) {
            const $target = $(e.target);
            const isInMvuPanel = $target.closest('.acu-mvu-panel').length > 0;
            if (isInMvuPanel && e.touches && e.touches.length === 1) {
              touchStartX = e.touches[0].clientX;
              touchStartY = e.touches[0].clientY;
            }
          };
          const captureHandlerTouchMove = function (e: any) {
            const $target = $(e.target);
            const isInMvuPanel = $target.closest('.acu-mvu-panel').length > 0;
            if (isInMvuPanel && e.touches && e.touches.length === 1 && touchStartX && touchStartY) {
              const touch = e.touches[0];
              const deltaX = Math.abs(touch.clientX - touchStartX);
              const deltaY = Math.abs(touch.clientY - touchStartY);
              // 使用与冒泡阶段相同的判断逻辑
              const isHorizontal =
                deltaY < 5 ? deltaX > 5 && deltaX > deltaY * 2 : deltaX > deltaY * 1.5 && deltaX > 10;
              if (isHorizontal) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
              }
            }
          };
          const captureHandlerTouchEnd = function (e: any) {
            const $target = $(e.target);
            const isInMvuPanel = $target.closest('.acu-mvu-panel').length > 0;
            if (isInMvuPanel && isHorizontalSwipe) {
              e.stopImmediatePropagation();
              e.stopPropagation();
              e.preventDefault();
            }
          };
          // 在捕获阶段也监听
          targetDoc.addEventListener('touchstart', captureHandlerTouchStart, true);
          targetDoc.addEventListener('touchmove', captureHandlerTouchMove, true);
          targetDoc.addEventListener('touchend', captureHandlerTouchEnd, true);
        })();

        // 关闭按钮
        $panel.on('click.mvu', '.acu-close-btn', function (e: any) {
          e.stopPropagation();
          const $input = $panel.find('.acu-search-input');

          // 如果搜索框有内容，清空搜索框
          if ($input.length && $input.val()) {
            $input.val('').trigger('input').focus();
            return;
          }

          // 变量面板状态：关闭变量面板，重新渲染到默认状态
          if (typeof deps.saveActiveTabState === 'function') {
            deps.saveActiveTabState(null);
          }
          if (typeof deps.renderInterface === 'function') {
            deps.renderInterface();
          }
        });

        // 高度拖拽
        $panel.on('pointerdown.mvu', '.acu-height-drag-handle', function (this: any, e: any) {
          if (e.button !== 0) return;
          e.preventDefault();
          e.stopPropagation();
          const handle = this;
          handle.setPointerCapture(e.pointerId);
          $(handle).add($(handle).closest('.acu-height-control')).addClass('active');
          const startHeight = deps.getPanelDragStartHeight($panel);
          let requestedHeight = startHeight;
          const startY = e.clientY;
          const tableName = $(handle).data('table');

          handle.onpointermove = function (moveE: any) {
            const dy = moveE.clientY - startY;
            requestedHeight = deps.setPanelRequestedHeight($panel, startHeight - dy) || requestedHeight;
          };
          handle.onpointerup = function (upE: any) {
            $(handle).add($(handle).closest('.acu-height-control')).removeClass('active');
            handle.releasePointerCapture(upE.pointerId);
            handle.onpointermove = null;
            handle.onpointerup = null;
            if (tableName && typeof deps.getTableHeights === 'function' && typeof deps.saveTableHeights === 'function') {
              deps.savePanelRequestedHeight(tableName, requestedHeight);
            }
          };
        });

        // 双击重置高度
        $panel.on('dblclick.mvu', '.acu-height-drag-handle', function (this: any, e: any) {
          e.preventDefault();
          e.stopPropagation();
          const tableName = $(this).data('table');
          if (tableName && typeof deps.getTableHeights === 'function' && typeof deps.saveTableHeights === 'function') {
            deps.resetPanelRequestedHeight($panel, tableName);
          }
        });

        // 双击头部任意位置也可重置高度
        $panel.on('dblclick.mvu', '.acu-panel-header', function (e: any) {
          if ($(e.target).closest('.acu-search-input, .acu-close-btn, .mvu-header-btn').length) return;
          e.preventDefault();
          e.stopPropagation();
          const tableName = MvuModule.MODULE_ID;
          if (tableName && typeof deps.getTableHeights === 'function' && typeof deps.saveTableHeights === 'function') {
            deps.resetPanelRequestedHeight($panel, tableName);
          }
        });
      },

      showEditDialog: function (path: any, currentValue: any, onSave: any) {
        // 使用主页面的 jQuery 和 document
        const $ = window.parent?.jQuery || window.jQuery;
        const targetDoc = window.parent?.document || document;
        if (!$) return;

        // 移除已有弹窗
        $(targetDoc).find('.mvu-edit-overlay').remove();

        const currentTheme = (typeof deps.getConfig === 'function' ? deps.getConfig().theme : null) || 'retro';

        const html = `
                    <div class="mvu-edit-overlay acu-edit-overlay acu-theme-${currentTheme}">
                        <div class="mvu-edit-dialog acu-edit-dialog">
                            <div class="acu-edit-title">
                                <i class="fa-solid fa-edit acu-edit-icon-muted"></i>
                                <span>编辑变量</span>
                            </div>
                            <div class="mvu-edit-path">${escapeHtml(path)}</div>
                            <textarea class="mvu-edit-textarea acu-edit-textarea">${escapeHtml(currentValue)}</textarea>
                            <div class="mvu-edit-hint">Ctrl+Enter 保存 | Esc 取消</div>
                            <div class="acu-dialog-btns">
                                <button type="button" class="acu-dialog-btn mvu-btn-cancel">
                                    <i class="fa-solid fa-times"></i> 取消
                                </button>
                                <button type="button" class="acu-dialog-btn acu-btn-confirm mvu-btn-save">
                                    <i class="fa-solid fa-check"></i> 保存
                                </button>
                            </div>
                        </div>
                    </div>
                `;

        $(targetDoc.body).append(html);
        const $overlay = $(targetDoc).find('.mvu-edit-overlay');
        const $input = $overlay.find('.mvu-edit-textarea');

        setTimeout(() => $input.focus().select(), 50);

        // 取消按钮
        $overlay.on('click', '.mvu-btn-cancel', function (e: any) {
          e.preventDefault();
          e.stopPropagation();
          $overlay.remove();
          onSave(null);
        });

        // 保存按钮
        $overlay.on('click', '.mvu-btn-save', function (e: any) {
          e.preventDefault();
          e.stopPropagation();
          const newValue = $input.val();
          $overlay.remove();
          onSave(newValue);
        });

        // 点击遮罩关闭
        deps.setupOverlayClose($overlay, 'mvu-edit-overlay', () => {
          $overlay.remove();
          onSave(null);
        });

        // 键盘快捷键
        $input.on('keydown', function (e: any) {
          if (e.key === 'Escape') {
            e.preventDefault();
            $overlay.remove();
            onSave(null);
          } else if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            const newValue = $input.val();
            $overlay.remove();
            onSave(newValue);
          }
        });
      },

      // ===== LWB 路径解析和写入函数 =====
      // 解析路径，支持 "根变量.子路径" 和 "根变量[0].子路径" 格式
      parsePath: function (path: string): { rootName: string; subPath: string } {
        const match = path.match(/^([^.\[]+)/);
        const rootName = match ? match[1] : path;

        let subPath = path.slice(rootName.length);
        if (subPath.startsWith('.')) subPath = subPath.slice(1);

        return { rootName, subPath };
      },

      // LWB 变量写入函数
      setLwbValue: function (path: string, value: unknown) {
        try {
          const ST = window.SillyTavern || window.parent?.SillyTavern;
          if (!ST?.chatMetadata) {
            console.error('[DICE]无法访问 chatMetadata');
            return;
          }

          if (!ST.chatMetadata.variables) {
            ST.chatMetadata.variables = {};
          }

          const { rootName, subPath } = this.parsePath(path);

          if (!subPath) {
            // 直接设置根变量
            ST.chatMetadata.variables[rootName] =
              typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '');
          } else {
            // 设置嵌套路径
            const currentRaw = ST.chatMetadata.variables[rootName];
            let current = parseJsonSafe(currentRaw);

            if (typeof current !== 'object' || current === null) {
              current = {};
            }

            // lodash _.set 原生支持 "a[0].b" 格式
            _.set(current as object, subPath, value);

            ST.chatMetadata.variables[rootName] = JSON.stringify(current);
          }

          // 保存元数据
          ST.saveMetadata?.();

          // 刷新缓存
          cachedEraData = null;
          cachedEraDataChatId = null;

          console.log('[DICE]LWB 变量已更新:', path, '=', value);
        } catch (e) {
          console.error('[DICE]LWB 变量写入失败:', e);
        }
      },

      setValue: async function (path: any, newValue: any) {
        if (!isAvailable()) return false;

        const mode = detectMode();

        try {
          let parsedValue = newValue;
          if (newValue === 'true') parsedValue = true;
          else if (newValue === 'false') parsedValue = false;
          else if (!isNaN(Number(newValue)) && String(newValue).trim() !== '') {
            parsedValue = Number(newValue);
          }

          if (mode === 'era') {
            return await setEraValue(path, parsedValue);
          } else if (mode === 'lwb') {
            // [新增] LWB 模式：写入到 chatMetadata.variables
            this.setLwbValue(path, parsedValue);
            return true;
          } else {
            const mvuData = (window as any).Mvu.getMvuData({ type: 'message', message_id: 'latest' });
            if (!mvuData) {
              console.error('[DICE]MvuModule 无法获取 MVU 数据');
              return false;
            }

            const success = await (window as any).Mvu.setMvuVariable(mvuData, path, parsedValue, {
              reason: '手动编辑',
              is_recursive: false,
            });

            if (success) {
              await (window as any).Mvu.replaceMvuData(mvuData, { type: 'message', message_id: 'latest' });
            } else {
              console.warn('[DICE]MvuModule setMvuVariable 返回 false');
            }

            return success;
          }
        } catch (e) {
          console.error('[DICE]MvuModule setValue error:', e);
          return false;
        }
      },

      isModuleTab: function (tableName: any) {
        return tableName === MODULE_ID;
      },

      // 清除 ERA 缓存（当 ERA 变量更新时调用）
      clearCache: function () {
        cachedEraData = null;
        cachedEraDataChatId = null;
        console.log('[DICE]MvuModule 已清除 ERA 缓存');
      },

      // 检测当前使用的变量框架模式
      detectMode: function () {
        return detectMode();
      },

      refresh: function ($container: any) {
        // 清除缓存，强制重新获取数据
        this.clearCache();

        if (!$container || !$container.length) {
          const $panel = $('#acu-data-area');
          if (!$panel.length) return;
          $container = $panel;
        }
        // 显示加载状态（带刷新动画）
        const $refreshBtn = $container.find('.mvu-btn-refresh');
        if ($refreshBtn.length) {
          $refreshBtn.find('i').addClass('fa-spin');
        }

        // 使用重试机制获取最新变量数据（增加重试次数和延迟，让用户可以反复尝试）
        // 最多重试 10 次，每次延迟 1 秒，总共最多等待 10 秒
        this.getDataWithRetry(10, 1000)
          .then(_mvuData => {
            // 移除加载动画
            if ($refreshBtn.length) {
              $refreshBtn.find('i').removeClass('fa-spin');
            }

            // [修复] 如果用户已切走到其它面板，不要用异步回调覆盖当前内容
            if (!deps.canWriteMvuPanel()) return;

            // 无论成功失败，都重新渲染面板（简化后的 renderPanel 会处理所有状态）
            $container.html('<div class="acu-mvu-panel">' + this.renderPanel() + '</div>');
            this.bindEvents($container);

            // [修复] 使用 toastr 提示结果：检查 renderPanel 实际使用的数据（缓存）
            // 而不是仅依赖 getDataWithRetry 的返回值
            const toastr = window.parent?.toastr || window.toastr;
            const actualData = this.getData();
            if (toastr && !actualData) {
              toastr.warning('找不到变量框架数据，请点击右上角刷新，或关闭变量面板后重新打开');
            }
          })
          .catch(err => {
            console.error('[DICE]MvuModule Error refreshing data:', err);

            // 移除加载动画
            if ($refreshBtn.length) {
              $refreshBtn.find('i').removeClass('fa-spin');
            }

            // [修复] 如果用户已切走到其它面板，不要用异步回调覆盖当前内容
            if (!deps.canWriteMvuPanel()) return;

            // 显示错误状态（简化后的 renderPanel 会处理）
            $container.html('<div class="acu-mvu-panel">' + this.renderPanel() + '</div>');
            this.bindEvents($container);

            // [修复] 只有当实际没有数据时才显示错误
            const toastr = window.parent?.toastr || window.toastr;
            const actualData = this.getData();
            if (toastr && !actualData) {
              showActionableErrorToast('获取变量数据时出错，变量面板无法读取当前 MVU 数据。', {
                suggestion: '请点击右上角刷新，或关闭变量面板后重新打开；如果仍为空，请检查角色卡变量框架是否已加载。',
              });
            }
          });
      },
    };
  })();
  return MvuModule;
}
