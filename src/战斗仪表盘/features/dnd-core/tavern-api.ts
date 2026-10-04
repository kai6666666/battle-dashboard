// features/dnd-core/tavern-api.ts
// DND 仪表盘 · 酒馆 API 门面（自 BasedonST `src/core/TavernAPI.js` 移植，b1）
// 职责：数据库 API 探测、API 预设/模型、AI 生成三通道、世界书获取。
// 工厂 + DI：内部 getCore 走 dnd-core/utils。

import type { DndLogger } from './logger';
import type { DndUtils } from './utils';

export interface TavernCoreHandles {
  SillyTavern: any;
  TavernHelper: any;
}

export interface DndDatabaseAIStatus {
  available: boolean;
  presetCount: number;
  tablePreset: string;
  plotPreset: string;
}

export interface DndGenerateOptions {
  presetId?: string;
  customConfig?: { url?: string; key?: string; model?: string };
  maxTokens?: number;
  useDatabaseAPI?: boolean;
}

export interface DndTavernApi {
  getDatabaseAPI(): any;
  getCore(): TavernCoreHandles;
  getDatabaseAIStatus(): DndDatabaseAIStatus;
  getPresets(): any[];
  fetchModels(rawApiUrl: string, apiKey: string): Promise<string[]>;
  generate(messages: Array<{ role: string; content: string }>, options?: DndGenerateOptions): Promise<string>;
  getAllWorldbookNames(): Promise<string[]>;
  getEnabledWorldInfo(customWorldbooks?: string | string[] | null): Promise<string>;
}

export interface DndTavernApiDeps {
  logger: DndLogger;
  utils: DndUtils;
}

export function createDndTavernApi(deps: DndTavernApiDeps): DndTavernApi {
  const { logger, utils } = deps;

  const getDatabaseAPI = (): any => {
    try {
      const w = window as any;
      return w.AutoCardUpdaterAPI || (w.parent && w.parent.AutoCardUpdaterAPI) || (w.top && w.top.AutoCardUpdaterAPI) || null;
    } catch (e) {
      logger.error('[TavernAPI] 获取数据库 API 失败:', e);
      return (window as any).AutoCardUpdaterAPI || null;
    }
  };

  // 获取全局核心对象（兼容 iframe 和 父窗口）
  const getCore = (): TavernCoreHandles => {
    let st: any = null;
    let helper: any = null;

    try {
      const w = window as any;
      if (w.SillyTavern) st = w.SillyTavern;
      else if (w.parent && w.parent.SillyTavern) st = w.parent.SillyTavern;
      else if (w.top && w.top.SillyTavern) st = w.top.SillyTavern;

      if (w.TavernHelper) helper = w.TavernHelper;
      else if (w.parent && w.parent.TavernHelper) helper = w.parent.TavernHelper;
      else if (w.top && w.top.TavernHelper) helper = w.top.TavernHelper;
    } catch (e) {
      logger.error('[TavernAPI] 获取核心对象失败:', e);
    }

    return { SillyTavern: st, TavernHelper: helper };
  };

  const getDatabaseAIStatus = (): DndDatabaseAIStatus => {
    const api = getDatabaseAPI();
    let presets: any[] = [];
    let tablePreset = '';
    let plotPreset = '';

    try {
      if (api?.getApiPresets) presets = api.getApiPresets() || [];
      if (api?.getTableApiPreset) tablePreset = api.getTableApiPreset() || '';
      if (api?.getPlotApiPreset) plotPreset = api.getPlotApiPreset() || '';
    } catch (e) {
      logger.warn('[TavernAPI] 读取数据库 AI 状态失败:', e);
    }

    return {
      available: !!(api && typeof api.callAI === 'function'),
      presetCount: Array.isArray(presets) ? presets.length : 0,
      tablePreset,
      plotPreset,
    };
  };

  // 规范化 API URL（去尾部斜杠，去 /chat/completions）
  const normalizeUrl = (url: string): string => {
    if (!url) return '';
    let cleanUrl = url.trim();
    while (cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    if (cleanUrl.endsWith('/chat/completions')) {
      cleanUrl = cleanUrl.replace(/\/chat\/completions$/, '');
    }
    return cleanUrl;
  };

  // 获取所有可用的 API 连接预设
  const getPresets = (): any[] => {
    const { SillyTavern } = getCore();

    logger.debug('[TavernAPI] 正在尝试获取 API 预设...');
    if (!SillyTavern) {
      logger.error('[TavernAPI] 未找到 SillyTavern 对象');
      return [];
    }

    if (SillyTavern.extensionSettings?.connectionManager?.profiles) {
      return SillyTavern.extensionSettings.connectionManager.profiles;
    }
    if (SillyTavern.extensionSettings?.connection?.profiles) {
      return SillyTavern.extensionSettings.connection.profiles;
    }
    if (SillyTavern.contexts?.connection?.profiles) {
      return SillyTavern.contexts.connection.profiles;
    }

    logger.warn('[TavernAPI] 未能找到 connectionManager.profiles，请检查酒馆版本');
    return [];
  };

  // 获取自定义 API 的模型列表（通过酒馆后端检查连接）
  const fetchModels = async (rawApiUrl: string, apiKey: string): Promise<string[]> => {
    if (!rawApiUrl) throw new Error('API URL 不能为空');

    const apiUrl = normalizeUrl(rawApiUrl);

    const statusUrl = '/api/backends/chat-completions/status';
    const { SillyTavern } = getCore();

    const body = {
      reverse_proxy: apiUrl,
      proxy_password: '',
      chat_completion_source: 'custom',
      custom_url: apiUrl,
      custom_include_headers: apiKey ? `Authorization: Bearer ${apiKey}` : '',
    };

    const response = await fetch(statusUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(SillyTavern?.getRequestHeaders ? SillyTavern.getRequestHeaders() : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`连接失败: ${response.status} - ${errText}`);
    }

    const data: any = await response.json();
    let models: any[] = [];
    if (data.models && Array.isArray(data.models)) models = data.models;
    else if (Array.isArray(data)) models = data;
    else if (data.data && Array.isArray(data.data)) models = data.data;

    return models.map((m: any) => (typeof m === 'string' ? m : m.id));
  };

  // 发送请求给 AI（三通道：数据库 API / 自定义配置 / 预设 / 主 API）
  const generate = async (
    messages: Array<{ role: string; content: string }>,
    options: DndGenerateOptions = {},
  ): Promise<string> => {
    const { SillyTavern, TavernHelper } = getCore();
    const { presetId, customConfig, maxTokens = 4096, useDatabaseAPI = false } = options;

    if (useDatabaseAPI) {
      const dbApi = getDatabaseAPI();
      if (!dbApi || typeof dbApi.callAI !== 'function') {
        throw new Error('当前数据库 API 未提供 callAI()');
      }
      const response = await dbApi.callAI(messages, { max_tokens: maxTokens });
      if (!response) {
        throw new Error('数据库 AI 调用失败，请检查数据库中的 AI 配置');
      }
      return typeof response === 'string' ? response.trim() : String(response).trim();
    }

    if (!SillyTavern && !TavernHelper) {
      throw new Error('SillyTavern 核心 API 未就绪');
    }

    // --- 方式 C：自定义配置（酒馆后端代理） ---
    if (customConfig && customConfig.url && customConfig.model) {
      logger.debug(`[TavernAPI] 使用自定义配置发送请求: ${customConfig.url}`);

      const { url: rawApiUrl, key: apiKey, model } = customConfig;
      const apiUrl = normalizeUrl(rawApiUrl);

      const requestBody = {
        messages,
        model,
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 0.9,
        stream: false,
        chat_completion_source: 'custom',
        reverse_proxy: apiUrl,
        proxy_password: '',
        custom_url: apiUrl,
        custom_include_headers: apiKey ? `Authorization: Bearer ${apiKey}` : '',
        enable_web_search: false,
        request_images: false,
      };

      const response = await fetch('/api/backends/chat-completions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(SillyTavern?.getRequestHeaders ? SillyTavern.getRequestHeaders() : {}),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API 请求失败: ${response.status} - ${errText}`);
      }

      const data: any = await response.json();
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      } else if (data && data.content) {
        return data.content.trim();
      } else {
        throw new Error('API 返回了意外的数据结构');
      }
    }

    // --- 方式 A：指定 API 预设（酒馆后端代理） ---
    if (presetId) {
      logger.debug(`[TavernAPI] 使用预设 ID: ${presetId} 发送请求`);

      const profile = getPresets().find((p: any) => p.id === presetId);
      if (!profile) throw new Error(`找不到 ID 为 "${presetId}" 的 API 预设`);

      let apiKey = profile.api_key || profile.key || '';
      let apiUrl = profile.api_url || profile.url || '';
      let model = profile.openai_model || profile.model || 'gpt-3.5-turbo';

      if (profile.settings) {
        apiKey = apiKey || profile.settings.api_key || profile.settings.key;
        apiUrl = apiUrl || profile.settings.api_url || profile.settings.url;
        model = model || profile.settings.openai_model || profile.settings.model;
      }

      if (!apiUrl) {
        throw new Error(`无法从预设 "${presetId}" 中解析出 API URL。`);
      }

      apiUrl = normalizeUrl(apiUrl);
      logger.debug(`[TavernAPI] Proxy via Backend: ${apiUrl}, Model: ${model}`);

      const requestBody = {
        messages,
        model,
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 0.9,
        stream: false,
        chat_completion_source: 'custom',
        reverse_proxy: apiUrl,
        proxy_password: '',
        custom_url: apiUrl,
        custom_include_headers: apiKey ? `Authorization: Bearer ${apiKey}` : '',
        enable_web_search: false,
        request_images: false,
      };

      const response = await fetch('/api/backends/chat-completions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(SillyTavern?.getRequestHeaders ? SillyTavern.getRequestHeaders() : {}),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API 请求失败: ${response.status} - ${errText}`);
      }

      const data: any = await response.json();
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      } else if (data && data.content) {
        return data.content.trim();
      } else {
        throw new Error('API 返回了意外的数据结构');
      }
    }

    // --- 方式 B：直接使用当前主 API ---
    logger.debug('[TavernAPI] 使用主 API 发送请求');
    const response = await TavernHelper.generateRaw({
      ordered_prompts: messages,
      should_stream: false,
    });
    return response.trim();
  };

  // 获取酒馆中所有可用的世界书名称列表（四重保障提取）
  const getAllWorldbookNames = async (): Promise<string[]> => {
    const { TavernHelper, SillyTavern } = getCore();
    const names = new Set<string>();

    // 1. 酒馆后端官方接口
    try {
      const headers = SillyTavern?.getRequestHeaders ? SillyTavern.getRequestHeaders() : {};
      const res = await fetch('/api/worldinfo', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...headers },
      });
      if (res.ok) {
        const data: any = await res.json();
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          Object.keys(data).forEach(k => names.add(String(k).trim()));
        }
      }
    } catch (e) {
      logger.warn('[TavernAPI] 通过 GET /api/worldinfo 获取失败:', e);
    }

    // 2. 酒馆原生前端全局变量
    try {
      const win: any = window.parent || window;
      if (win.world_names && Array.isArray(win.world_names)) {
        win.world_names.forEach((n: any) => names.add(String(n).trim()));
      }
      if (win.world_info_data) {
        Object.keys(win.world_info_data).forEach(n => names.add(String(n).trim()));
      }
    } catch {
      /* ignore */
    }

    // 3. DOM 抓取
    try {
      const { $ } = utils.getCore();
      if ($) {
        const doc = (window as any).parent?.document || window.document;
        $(doc)
          .find('#world_editor_select option, #character_world_info option, .world_info_select option')
          .each(function (this: any) {
            const val = $(this).attr('value') || $(this).text();
            if (val && !['', 'none', 'null', '0'].includes(String(val).toLowerCase()) && !val.startsWith('--')) {
              names.add(String(val).trim());
            }
          });
      }
    } catch {
      /* ignore */
    }

    // 4. 酒馆助手已绑定世界书
    try {
      if (TavernHelper) {
        if (typeof TavernHelper.getGlobalWorldbookNames === 'function') {
          (TavernHelper.getGlobalWorldbookNames() || []).forEach((n: any) => names.add(String(n).trim()));
        }
        if (typeof TavernHelper.getChatWorldbookName === 'function') {
          const cb = TavernHelper.getChatWorldbookName('current');
          if (cb) names.add(String(cb).trim());
        }
        if (typeof TavernHelper.getCharWorldbookNames === 'function') {
          const cbs = TavernHelper.getCharWorldbookNames('current') || {};
          if (cbs.primary) names.add(String(cbs.primary).trim());
          if (Array.isArray(cbs.additional)) cbs.additional.forEach((n: any) => names.add(String(n).trim()));
        }
      }
    } catch {
      /* ignore */
    }

    const result = Array.from(names).filter(
      n => n && n !== 'No World Info' && n !== 'Select World Info' && n !== 'No specific world',
    );

    logger.debug('[TavernAPI] 已成功获取酒馆世界书列表:', result);
    return result;
  };

  // 获取当前启用的世界书内容（含排除词与关键词过滤）
  const getEnabledWorldInfo = async (customWorldbooks: string | string[] | null = null): Promise<string> => {
    const { TavernHelper } = getCore();
    if (!TavernHelper) return '';

    try {
      const worldbooks = new Set<string>();

      if (customWorldbooks) {
        const list = Array.isArray(customWorldbooks) ? customWorldbooks : [customWorldbooks];
        list.filter(Boolean).forEach(n => worldbooks.add(String(n).trim()));
      } else {
        if (TavernHelper.getGlobalWorldbookNames) {
          const globals = TavernHelper.getGlobalWorldbookNames();
          if (Array.isArray(globals)) globals.forEach((n: any) => worldbooks.add(n));
        }
        if (TavernHelper.getChatWorldbookName) {
          const chatBook = TavernHelper.getChatWorldbookName('current');
          if (chatBook) worldbooks.add(chatBook);
        }
        if (TavernHelper.getCharWorldbookNames) {
          const charBooks = TavernHelper.getCharWorldbookNames('current');
          if (charBooks) {
            if (charBooks.primary) worldbooks.add(charBooks.primary);
            if (Array.isArray(charBooks.additional)) charBooks.additional.forEach((n: any) => worldbooks.add(n));
          }
        }
      }

      if (worldbooks.size === 0) return '';

      let context = '【当前世界观/规则参考 (World Info)】\n';

      for (const bookName of worldbooks) {
        if (TavernHelper.getWorldbook) {
          const entries = await TavernHelper.getWorldbook(bookName);
          if (entries && entries.length > 0) {
            context += `\n--- 世界书: ${bookName} ---\n`;

            // 排除关键词（可自由增减）
            const excludeWords = ['命定系统', '纪要-', 'TavernDB-', '角色信息-', '角色属性'];

            const activeEntries = entries.filter((e: any) => {
              if (!e.enabled) return false;
              const text = ((Array.isArray(e.keys) ? e.keys : []).join(',') + (e.content || '')).toLowerCase();
              return !excludeWords.some(w => text.includes(w.toLowerCase()));
            });

            const relevantEntries = activeEntries.filter((e: any) => {
              const keys = (Array.isArray(e.keys) ? e.keys : []).join(',').toLowerCase();
              const content = (e.content || '').toLowerCase();
              return (
                keys.includes('数值') ||
                keys.includes('世界') ||
                keys.includes('规则') ||
                keys.includes('设定') ||
                keys.includes('技能') ||
                keys.includes('魔法') ||
                keys.includes('法术') ||
                keys.includes('战技') ||
                keys.includes('种族') ||
                keys.includes('等级') ||
                content.includes('数值') ||
                content.includes('世界') ||
                content.includes('规则') ||
                content.includes('设定') ||
                content.includes('技能') ||
                content.includes('魔法') ||
                content.includes('法术') ||
                content.includes('战技') ||
                content.includes('种族') ||
                content.includes('等级')
              );
            });

            relevantEntries.forEach((e: any) => {
              const keysStr = Array.isArray(e.keys) ? e.keys.join(', ') : '无关键字';
              context += `[${keysStr}]: ${e.content}\n`;
            });
          }
        }
      }

      return context;
    } catch (e) {
      logger.error('[TavernAPI] 获取世界书失败:', e);
      return '';
    }
  };

  return {
    getDatabaseAPI,
    getCore,
    getDatabaseAIStatus,
    getPresets,
    fetchModels,
    generate,
    getAllWorldbookNames,
    getEnabledWorldInfo,
  };
}