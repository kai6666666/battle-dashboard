/**
 * acu-dice.d.ts — AcuDice 公共 API 类型声明（API v1.3.0 ｜ 脚本 v7.1.0-x9a）。
 *
 * 用法：
 * - 将本文件加入你的 TS 工程（如 tsconfig include），即可获得 `window.AcuDice` 的完整类型提示；
 * - 常用类型可通过命名空间访问，如 `AcuDice.CheckResult`、`AcuDice.GachaAPI`、`AcuDice.ContestResult`；
 * - 文档与示例见 `src/骰子系统/docs/API.md`。
 *
 * 生成策略：与 `features/api/public-api.ts`、`gacha.ts`、`profiles.ts` 实现逐项对齐；
 * 运行时键面由 `scripts` 侧 parity 脚本与测试用例锁定（x9-a）。
 */

declare namespace AcuDice {
  interface RollResult {
    total: number;
    formula: string;
    breakdown: string;
  }

  interface CheckOptions {
    attribute?: string;
    skill?: string;
    targetValue?: number;
    diceType?: string;
    successCriteria?: 'lte' | 'gte';
    modifier?: number;
  }

  /** 公共 API `check()` / `checkByCharacter()` 的返回值。 */
  interface CheckResult {
    success: boolean;
    roll: number;
    target: number;
    margin: number;
    criticalSuccess: boolean;
    criticalFailure: boolean;
    message: string;
    diceType: string;
    rule: 'coc' | 'dnd';
  }

  /** 面板内部构造的检定结果草稿（历史元数据由历史链路补充）。 */
  interface CheckResultDraft {
    success: boolean;
    total: number;
    target: number;
    outcomeText: string;
    attrName: string;
    formula: string;
    criteria: string;
    isAutoTarget: boolean;
  }

  /** 检定历史记录（`getHistory()` 返回值 / `on('check')` 事件负载 的条目形态）。 */
  interface CheckHistoryItem {
    success: boolean;
    total: number;
    target: number;
    outcomeText: string;
    attrName: string;
    formula: string;
    criteria: string;
    isAutoTarget: boolean;
    /** v1.2.0 结果分级 */
    outcomeId?: string;
    outcomeName?: string;
    presetId?: string;
    timestamp: number;
    detailId: string;
    initiatorName: string;
    historyType: 'check';
    detailLines: string[];
    /** 孤注一掷标记（v1.2.0） */
    isPushed?: boolean;
  }

  interface HistoryOptions {
    limit?: number;
    type?: 'check' | 'contest';
  }

  interface ContestParticipant {
    name: string;
    attribute: string;
    roll: number;
    target: number;
    successLevel: number;
  }

  interface ContestResult {
    left: ContestParticipant;
    right: ContestParticipant;
    winner: 'left' | 'right' | 'tie';
    message: string;
  }

  interface ContestHistoryItem extends ContestResult {
    timestamp: number;
    detailId: string;
    detailLines: string[];
  }

  interface ContestOptions {
    left?: { name: string; attribute: string; targetValue?: number };
    right?: { name: string; attribute: string; targetValue?: number };
    rule?: 'initiator_win' | 'initiator_lose' | 'tie';
    diceType?: string;
    /** @deprecated 使用 left 替代 */
    attacker?: { name: string; attribute: string; targetValue?: number };
    /** @deprecated 使用 right 替代 */
    defender?: { name: string; attribute: string; targetValue?: number };
  }

  interface PresetSummary {
    id: string;
    name: string;
    description?: string;
    builtin: boolean;
  }

  interface EffectExecutionResult {
    effectId: string;
    success: boolean;
    oldValue: number;
    newValue: number;
    error?: string;
    target?: string;
    level?: number;
    triggerSourceId?: string;
    triggerThreshold?: number;
    triggerType?: 'threshold' | 'delta' | 'primary';
    triggerMatchIndex?: number;
    triggerMatchCount?: number;
  }

  interface EffectRunEvent {
    seq: number;
    runId: string;
    status: 'planned' | 'confirmed' | 'committed' | 'failed' | 'cancelled';
    characterName: string;
    attributeName: string;
    historyIndex: number;
    effectResults: EffectExecutionResult[];
    effectTrace: string[];
    chainMode?: 'first' | 'all';
    error?: string;
    timestamp: number;
  }

  interface GachaStateSnapshot {
    fortune: number;
    wallet: {
      fortune: number;
      shards: Record<'普通' | '优秀' | '稀有' | '史诗' | '传说' | '神话' | '唯一', number>;
    };
    activePoolTag: string;
    pity: { rare: number; legend: number };
    recentRewards: Array<Record<string, unknown>>;
    totalDraws: number;
    inputStats: Record<string, unknown>;
    progress: Record<string, unknown>;
  }

  /** 骰子商店子接口（`AcuDice.gacha`）。 */
  interface GachaAPI {
    costs: { singleDraw: number; tenDraw: number };
    currencyName: string;
    rarities: string[];
    rewardTargets: Array<'inventory' | 'equipment'>;
    getState(): GachaStateSnapshot;
    setFortune(amount: number, options?: { silent?: boolean; reason?: string; detail?: string }): Promise<unknown>;
    addFortune(delta: number, options?: { silent?: boolean; reason?: string; detail?: string }): Promise<unknown>;
    clearFortune(options?: { silent?: boolean; confirm?: boolean; reason?: string; detail?: string }): Promise<unknown>;
    draw(count?: number): Promise<unknown>;
    singleDraw(): Promise<unknown>;
    tenDraw(): Promise<unknown>;
    setActivePool(poolTag: string): GachaStateSnapshot;
    setPool(poolTag: string): GachaStateSnapshot;
    listPools(options?: { includeHidden?: boolean }): Promise<unknown[]>;
    listItems(options?: { poolTag?: string; includeDisabled?: boolean; customOnly?: boolean; source?: 'all' | 'custom' | 'builtin' }): Promise<unknown[]>;
    exportCatalog(options?: { poolTag?: string }): Promise<string>;
    importCatalog(input: string | object, options?: { mode?: 'overwrite' | 'skip' | 'rename'; silent?: boolean }): Promise<unknown>;
    upsertItems(input: string | object, options?: { mode?: 'overwrite' | 'skip' | 'rename'; silent?: boolean }): Promise<unknown>;
    upsertPool(input: string | object, options?: { silent?: boolean }): Promise<unknown>;
    removeCustomItem(itemId: string, options?: { silent?: boolean }): Promise<unknown>;
    removeCustomPool(poolId: string, options?: { silent?: boolean }): Promise<unknown>;
    openShop(): Promise<GachaStateSnapshot>;
    closeShop(): void;
    openShardShop(): Promise<GachaStateSnapshot>;
    openSettings(): Promise<void>;
  }

  interface ConfigPlanSummary {
    id: string;
    name: string;
    source: {
      type: string;
      characterName?: string;
      characterId?: string;
      chatId?: string;
      label?: string;
      profileId?: string;
    };
    createdAt: string;
    updatedAt: string;
    moduleIds: string[];
    fingerprint: string;
  }

  interface ConfigPlanDetection {
    profile: ConfigPlanSummary;
    promptKey: string;
    skipped: boolean;
    sourceTextKind: string;
  }

  interface ConfigPlanPackage {
    format: 'acu_dice_profile_v1';
    id: string;
    name: string;
    source: {
      type: string;
      characterName?: string;
      characterId?: string;
      chatId?: string;
      label?: string;
      profileId?: string;
    };
    createdAt: string;
    updatedAt: string;
    moduleIds: string[];
    /** 骰子配置备份文档（结构随备份模块演进，保持宽松）。 */
    backup: Record<string, any>;
    fingerprint: string;
  }

  /** 配置方案与备份子接口（`AcuDice.profiles`）。 */
  interface Profiles {
    list(): Promise<ConfigPlanSummary[]>;
    saveCurrent(options?: { name?: string; moduleIds?: string[] }): Promise<ConfigPlanSummary>;
    import(input: string | object, options?: { name?: string; moduleIds?: string[] }): Promise<ConfigPlanSummary>;
    apply(profileId: string, options?: { moduleIds?: string[]; confirm?: boolean; createSnapshot?: boolean }): Promise<unknown>;
    export(profileId: string): Promise<string>;
    detectCharacterProfile(options?: { includeSkipped?: boolean }): Promise<ConfigPlanDetection | null>;
  }

  /** 公共 API 面（对应 `window.AcuDice`）。 */
  interface API {
    version: string;
    roll(formula: string): RollResult;
    check(options?: CheckOptions): Promise<CheckResult>;
    onReady(callback: () => void): void;

    on(event: 'check', handler: (result: CheckHistoryItem) => void): void;
    on(event: 'contest', handler: (result: ContestHistoryItem) => void): void;
    on(event: 'effect_run', handler: (result: EffectRunEvent) => void): void;
    /** 其它事件名（如 gacha:*）保持宽松签名。 */
    on(event: string, handler: (...args: any[]) => void): void;

    off(event: 'check', handler: (result: CheckHistoryItem) => void): void;
    off(event: 'contest', handler: (result: ContestHistoryItem) => void): void;
    off(event: 'effect_run', handler: (result: EffectRunEvent) => void): void;
    off(event: string, handler: (...args: any[]) => void): void;

    getLatestCheck(): CheckHistoryItem | null;
    getLatestContest(): ContestHistoryItem | null;
    getHistory(options?: HistoryOptions): Array<CheckHistoryItem | ContestHistoryItem>;

    listCharacters(): string[];
    getCharacterAttributes(name: string): Array<{ name: string; value: number }>;
    getAttributeValue(name: string, attribute: string): number | null;
    checkByCharacter(options: {
      name: string;
      attribute: string;
      modifier?: number;
      diceType?: string;
      successCriteria?: 'lte' | 'gte';
    }): Promise<CheckResult>;
    contest(options: ContestOptions): Promise<ContestResult>;

    // v1.2.0
    listPresets(): PresetSummary[];
    getPresetSummary(id: string): PresetSummary | null;
    getActivePresetId(): string | null;

    // 配置方案与备份
    profiles: Profiles;

    // v1.3.0
    gacha: GachaAPI;
  }
}

interface Window {
  AcuDice: AcuDice.API;
}
