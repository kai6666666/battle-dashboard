/**
 * wiring / gacha-api-wiring.ts — 抽卡API装配簇（从 index.ts 迁出，x4-x）。
 */
import { FORTUNE_CURRENCY_NAME, GACHA_DRAW_COST_SINGLE, GACHA_DRAW_COST_TEN, GACHA_RARITY_ORDER, GACHA_REWARD_TARGETS } from '../entities/gacha-items';
import { createCloneAcuDiceApiValue } from '../features/api/clone-acu-dice-api-value';
import { createAcuDiceGachaApi } from '../features/api/gacha';
import { createNormalizeAcuDiceGachaImportMode } from '../features/api/normalize-acu-dice-gacha-import-mode';
import { createNormalizeAcuDiceGachaInteger } from '../features/api/normalize-acu-dice-gacha-integer';
import { createSerializeAcuDiceGachaDrawOutcome } from '../features/api/serialize-acu-dice-gacha-draw-outcome';
import { createSerializeAcuDiceGachaDrawResult } from '../features/api/serialize-acu-dice-gacha-draw-result';
import { createSerializeAcuDiceGachaItem } from '../features/api/serialize-acu-dice-gacha-item';
import { createSerializeAcuDiceGachaPool } from '../features/api/serialize-acu-dice-gacha-pool';
import { createBuildAcuDiceGachaStateSnapshot } from '../features/gacha/build-acu-dice-gacha-state-snapshot';
import { createChangeAcuDiceGachaFortune } from '../features/gacha/change-acu-dice-gacha-fortune';
import { normalizeGachaPoolId } from '../features/gacha/gacha-helpers';
import { createImportAcuDiceGachaCatalog } from '../features/gacha/import-acu-dice-gacha-catalog';
import { createRemoveAcuDiceGachaCustomItem } from '../features/gacha/remove-acu-dice-gacha-custom-item';
import { createRemoveAcuDiceGachaCustomPool } from '../features/gacha/remove-acu-dice-gacha-custom-pool';
import { createStringifyAcuDiceGachaCatalogInput } from '../features/gacha/stringify-acu-dice-gacha-catalog-input';
import { createUpsertAcuDiceGachaPool } from '../features/gacha/upsert-acu-dice-gacha-pool';

export function createGachaApiWiring(deps: any) {
  const { analyzeGachaCatalogImport, applyGachaCatalogImport, assertSaveStoredGachaStateSnapshot, buildDefaultGachaPoolDefinition, canDeleteGachaPoolDefinition, closeGachaVisualization, compareGachaItemDefinitionsForDisplay, createDefaultGachaState, deleteGachaItemSetting, deleteGachaPoolConfig, emitEvent, ensureGachaCatalogLoaded, exportGachaCatalogJson, formatGachaCatalogImportStatsText, getActiveGachaPoolTags, getAllGachaItemDefinitions, getAllGachaPoolConfigDefinitions, getConfiguredGachaPoolDefinitions, getCustomGachaItemDefinitions, getGachaActivePoolTag, getGachaCatalogImportFailureMessage, getGachaFortuneProgressView, getGachaState, getRuntimeGachaRawData, getVisibleGachaPoolConfigDefinitions, isBuiltinGachaPoolId, isGachaItemEnabled, normalizeGachaPoolDefinition, performGachaDraw, recordGachaFortuneGain, refreshGachaShardShop, refreshGachaVisualization, runInSaveQueue, saveGachaPoolSettings, saveStoredGachaCatalog, serializeGachaCatalogItemForExport, showDiceSystemConfirmDialog, showGachaSettingsDialog, showGachaShardShop, showGachaVisualization, touchGachaActivity, updateGachaPoolTag } = deps;
  const cloneAcuDiceApiValue = createCloneAcuDiceApiValue({

  });

  const normalizeAcuDiceGachaInteger = createNormalizeAcuDiceGachaInteger({

  });

  const buildAcuDiceGachaStateSnapshot = createBuildAcuDiceGachaStateSnapshot({
    cloneAcuDiceApiValue: (...a: any[]) => cloneAcuDiceApiValue(...a),
    createDefaultGachaState: (...a: any[]) => createDefaultGachaState(...a),
    getGachaActivePoolTag: (...a: any[]) => getGachaActivePoolTag(...a),
    getGachaFortuneProgressView: (...a: any[]) => getGachaFortuneProgressView(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
  });

  const serializeAcuDiceGachaPool = createSerializeAcuDiceGachaPool({
    canDeleteGachaPoolDefinition: (...a: any[]) => canDeleteGachaPoolDefinition(...a),
  });

  const serializeAcuDiceGachaItem = createSerializeAcuDiceGachaItem({
    serializeGachaCatalogItemForExport: (...a: any[]) => serializeGachaCatalogItemForExport(...a),
  });

  const serializeAcuDiceGachaDrawOutcome = createSerializeAcuDiceGachaDrawOutcome({
    serializeAcuDiceGachaItem: (...a: any[]) => serializeAcuDiceGachaItem(...a),
  });

  const serializeAcuDiceGachaDrawResult = createSerializeAcuDiceGachaDrawResult({
    buildAcuDiceGachaStateSnapshot: (...a: any[]) => buildAcuDiceGachaStateSnapshot(...a),
    performGachaDraw: (...a: any[]) => performGachaDraw(...a),
    serializeAcuDiceGachaDrawOutcome: (...a: any[]) => serializeAcuDiceGachaDrawOutcome(...a),
  });

  const changeAcuDiceGachaFortune = createChangeAcuDiceGachaFortune({
    assertSaveStoredGachaStateSnapshot: (...a: any[]) => assertSaveStoredGachaStateSnapshot(...a),
    buildAcuDiceGachaStateSnapshot: (...a: any[]) => buildAcuDiceGachaStateSnapshot(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    normalizeAcuDiceGachaInteger: (...a: any[]) => normalizeAcuDiceGachaInteger(...a),
    recordGachaFortuneGain: (...a: any[]) => recordGachaFortuneGain(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
  });

  const stringifyAcuDiceGachaCatalogInput = createStringifyAcuDiceGachaCatalogInput({

  });

  const normalizeAcuDiceGachaImportMode = createNormalizeAcuDiceGachaImportMode({

  });

  const importAcuDiceGachaCatalog = createImportAcuDiceGachaCatalog({
    analyzeGachaCatalogImport: (...a: any[]) => analyzeGachaCatalogImport(...a),
    applyGachaCatalogImport: (...a: any[]) => applyGachaCatalogImport(...a),
    cloneAcuDiceApiValue: (...a: any[]) => cloneAcuDiceApiValue(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    formatGachaCatalogImportStatsText: (...a: any[]) => formatGachaCatalogImportStatsText(...a),
    getGachaCatalogImportFailureMessage: (...a: any[]) => getGachaCatalogImportFailureMessage(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    normalizeAcuDiceGachaImportMode: (...a: any[]) => normalizeAcuDiceGachaImportMode(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
    stringifyAcuDiceGachaCatalogInput: (...a: any[]) => stringifyAcuDiceGachaCatalogInput(...a),
  });

  const upsertAcuDiceGachaPool = createUpsertAcuDiceGachaPool({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    isBuiltinGachaPoolId: (...a: any[]) => isBuiltinGachaPoolId(...a),
    normalizeGachaPoolDefinition: (...a: any[]) => normalizeGachaPoolDefinition(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    saveGachaPoolSettings: (...a: any[]) => saveGachaPoolSettings(...a),
    serializeAcuDiceGachaPool: (...a: any[]) => serializeAcuDiceGachaPool(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
  });

  const removeAcuDiceGachaCustomItem = createRemoveAcuDiceGachaCustomItem({
    deleteGachaItemSetting: (...a: any[]) => deleteGachaItemSetting(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    saveStoredGachaCatalog: (...a: any[]) => saveStoredGachaCatalog(...a),
    serializeAcuDiceGachaItem: (...a: any[]) => serializeAcuDiceGachaItem(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
  });

  const removeAcuDiceGachaCustomPool = createRemoveAcuDiceGachaCustomPool({
    canDeleteGachaPoolDefinition: (...a: any[]) => canDeleteGachaPoolDefinition(...a),
    deleteGachaPoolConfig: (...a: any[]) => deleteGachaPoolConfig(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
  });

  const acuDiceGachaApi = createAcuDiceGachaApi({
    costs: { singleDraw: GACHA_DRAW_COST_SINGLE, tenDraw: GACHA_DRAW_COST_TEN },
    currencyName: FORTUNE_CURRENCY_NAME,
    rarityOrder: GACHA_RARITY_ORDER,
    rewardTargets: GACHA_REWARD_TARGETS,
    buildStateSnapshot: (...a: any[]) => buildAcuDiceGachaStateSnapshot(...a),
    changeFortune: (...a: any[]) => changeAcuDiceGachaFortune(...a),
    confirmDialog: (opts: any) => showDiceSystemConfirmDialog(opts),
    serializeDrawResult: (...a: any[]) => serializeAcuDiceGachaDrawResult(...a),
    performDraw: (...a: any[]) => performGachaDraw(...a),
    emitEvent: (event: string, payload: any) => emitEvent(event, payload),
    normalizePoolId: (...a: any[]) => normalizeGachaPoolId(...a),
    getVisiblePools: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
    updatePoolTag: (...a: any[]) => updateGachaPoolTag(...a),
    getRuntimeRaw: (...a: any[]) => getRuntimeGachaRawData(...a),
    ensureCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getAllPools: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    serializePool: (...a: any[]) => serializeAcuDiceGachaPool(...a),
    getCustomItems: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getAllItems: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getActivePoolTags: (...a: any[]) => getActiveGachaPoolTags(...a),
    isItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    compareItems: (...a: any[]) => compareGachaItemDefinitionsForDisplay(...a),
    serializeItem: (...a: any[]) => serializeAcuDiceGachaItem(...a),
    exportCatalogJson: (...a: any[]) => exportGachaCatalogJson(...a),
    importCatalog: (...a: any[]) => importAcuDiceGachaCatalog(...a),
    upsertPoolApi: (...a: any[]) => upsertAcuDiceGachaPool(...a),
    removeCustomItemApi: (...a: any[]) => removeAcuDiceGachaCustomItem(...a),
    removeCustomPoolApi: (...a: any[]) => removeAcuDiceGachaCustomPool(...a),
    showShop: (...a: any[]) => showGachaVisualization(...a),
    closeShopApi: (...a: any[]) => closeGachaVisualization(...a),
    showShardShop: (...a: any[]) => showGachaShardShop(...a),
    showSettings: (...a: any[]) => showGachaSettingsDialog(...a),
  });
  return { acuDiceGachaApi };
}
