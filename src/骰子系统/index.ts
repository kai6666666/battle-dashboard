// @ts-nocheck
import { ELEMENT_EMOJI_MAP, LOCATION_EMOJI_MAP, RELATION_ICON_MAP } from './shared/emoji-maps';
import { createRuntimeSaveWiring } from './wiring/runtime-save-wiring';
import { createCoreRuntimeWiring } from './wiring/core-runtime-wiring';
import { createGachaDrawWiring } from './wiring/gacha-draw-wiring';
import { createGachaSettingsWiring } from './wiring/gacha-settings-wiring';
import { createGachaInventoryWiring } from './wiring/gacha-inventory-wiring';
import { createCheckSuggestionWiring } from './wiring/check-suggestion-wiring';
import { createDiceConfigBackupCoreWiring } from './wiring/dice-config-backup-core-wiring';
import { createDiceProfileBackupWiring } from './wiring/dice-profile-backup-wiring';
import { createAdvancedPresetWiring } from './wiring/advanced-preset-wiring';
import { createCrudWiring } from './wiring/crud-wiring';
import { MAIN_STYLES } from './shared/styles';
import { setDatabaseToastMute } from './shared/database-toast-mute';
import { showActionableErrorToast } from './shared/actionable-error-toast';
import { TUTORIAL_SCOPE_LIST, createTutorialModule, type TutorialModule, type TutorialScope } from './features/tutorial';
import { createDialogueIndentRenderer, normalizeDialogueIndentStrategy } from './features/dialogue-indent-renderer';
import { RollResult, CustomFieldConfig, DerivedVarSpec, DiceExprPatch } from './shared/types';
import { rollDiceExpression, rollComplexDiceExpression } from './features/dice/dice-engine';
import { AcuDiceEvents } from './features/api/events';
import { AcuDiceHistory } from './features/api/history';
import { AcuDiceReadyState } from './features/api/ready';
import { AcuDicePresets } from './features/api/presets';
import { AcuDiceCharacters } from './features/api/characters';
import { AcuDiceRoll } from './features/api/roll';
import { AcuDiceProfiles } from './features/api/profiles';
import { AcuDiceCheck } from './features/api/check';
import { AcuDiceContest } from './features/api/contest';
import { createAcuDiceGachaApi } from './features/api/gacha';
import { GachaRegexActions } from './features/gacha/gacha-regex-actions';
import { createAvatarManager } from './entities/avatar-manager';
import { LocalAvatarDB } from './entities/local-avatar-db';
import { FavoritesDB } from './shared/storage/favorites-db';
import { CustomTableNameIconImageDB } from './shared/storage/custom-table-name-icon-image-db';
import { DiceProfileDB } from './shared/storage/dice-profile-db';
import { Store, STORAGE_KEY_LAST_SNAPSHOT } from './shared/storage/store';
import { FavoritesManager } from './features/favorites/favorites-manager';
import { createDashboardDataParser } from './features/dashboard/dashboard-data-parser';
import { createDiceHistoryStatsDB } from './features/history/dice-history-stats-db';
import { createBookmarkManager } from './features/bookmarks/bookmark-manager';
import { createUpdateController } from './features/validation/update-controller';
import { createValidationRuleManager } from './features/validation/validation-rule-manager';
import { createValidationEngine } from './features/validation/validation-engine';
import { createPresetManager } from './features/presets/preset-manager';
import { createRegexPresetManager } from './features/presets/regex-preset-manager';
import { createRegexTransformationManager } from './features/regex/regex-transformation-manager';
import { createRegexTransformationEngine } from './features/regex/regex-transformation-engine';
import { createErrorHandler } from './features/console/error-handler';
import { createAdvancedDicePresetManager } from './features/presets/advanced-dice-preset-manager';
import { createRenderPresetManager } from './features/presets/render-preset-manager';
import { createAttributePresetManager } from './features/presets/attribute-preset-manager';
import { createTableTemplateRequirementPresetManager } from './features/presets/table-template-requirement-preset-manager';
import { createActionPresetManager } from './features/presets/action-preset-manager';
import { createDashboardPresetManager } from './features/presets/dashboard-preset-manager';
import { createCustomTableNameIconStoreManager } from './shared/storage/custom-table-name-icon-store-manager';
import { createMvuModule } from './features/mvu/mvu-module';
import { createEvaluateCondition } from './features/dice/evaluate-condition';
import { createExecuteEffects } from './features/effects/execute-effects';
import { createSmartInsertToTextarea } from './features/textarea/smart-insert';
import { createHideDiceResultsInUserMessages } from './features/textarea/hide-dice-results';
import { createSortableListFactory } from './shared/ui/sortable-list';
import { createLoadDashboardNpcAvatars } from './features/dashboard/load-npc-avatars';
import { createShowConflictDialog } from './shared/ui/conflict-dialog';
import { createShowPresetListDialog } from './features/presets/preset-list-dialog';
import { createShowAttributePresetManager } from './features/presets/attribute-preset-manager-dialog';
import { createShowAttributePresetEditor } from './features/presets/attribute-preset-editor-dialog';
import { createShowAdvancedPresetManager } from './features/presets/advanced-preset-manager-dialog';
import { createShowAdvancedPresetEditor } from './features/presets/advanced-preset-editor-dialog';
import { createShowActionPresetManager } from './features/presets/action-preset-manager-dialog';
import { createShowActionPresetEditor } from './features/presets/action-preset-editor-dialog';
import { createShowDashboardPresetManager } from './features/presets/dashboard-preset-manager-dialog';
import { createShowDashboardPresetEditor } from './features/presets/dashboard-preset-editor-dialog';
import { createShowRenderPresetManager } from './features/presets/render-preset-manager-dialog';
import { createShowRenderPresetEditor } from './features/presets/render-preset-editor-dialog';
import { createShowDebugConsoleModal } from './features/console/debug-console-dialog';
import { createShowGlobalDiceHistoryDialog } from './features/history/dice-history-dialog';
import { createShowAddValidationRuleModal } from './features/validation/add-validation-rule-dialog';
import { createShowSmartFixModal } from './features/validation/smart-fix-dialog';
import { createShowTableRuleFixModal } from './features/validation/table-rule-fix-dialog';
import { createShowFavoritesPanel } from './features/favorites/favorites-panel';
import { createBindFavoritesEvents } from './features/favorites/favorites-events';
import { createBuildMapViewModel } from './features/map/map-view-model';
import { createShowMapVisualization } from './features/map/map-visualization';
import { createShowGachaCatalogClearDialog } from './features/gacha/gacha-catalog-clear-dialog';
import { createShowGachaPickupItemDetail } from './features/gacha/gacha-pickup-item-detail';
import { createShowGachaPoolNameDialog } from './features/gacha/gacha-pool-name-dialog';
import { createShowGachaConfirmDialog } from './features/gacha/gacha-confirm-dialog';
import { createShowGachaSettingsDialog } from './features/gacha/gacha-settings-dialog';
import { createShowGachaItemEditorDialog } from './features/gacha/gacha-item-editor-dialog';
import { createShowGachaCatalogImportConfirm } from './features/gacha/gacha-catalog-import-confirm';
import { createShowGachaSaveError } from './features/gacha/gacha-save-error';
import { createShowGachaRecentRewardDetail } from './features/gacha/gacha-recent-reward-detail';
import { createShowGachaShardShop } from './features/gacha/gacha-shard-shop';
import { createShowGachaShardExchangeConfirm } from './features/gacha/gacha-shard-exchange-confirm';
import { createShowGachaVisualization } from './features/gacha/gacha-visualization';
import { createShowCustomTableNameIconManager } from './features/table/custom-icon-manager-dialog';
import { createInitSortable } from './shared/ui/init-sortable';
import { createCreateDefaultGachaState } from './features/gacha/create-default-gacha-state';
import { createNormalizeShardWallet } from './features/gacha/normalize-shard-wallet';
import { createNormalizeRecentGachaRewards } from './features/gacha/normalize-recent-gacha-rewards';
import { createGetGachaStateStorageKey } from './features/gacha/get-gacha-state-storage-key';
import { createGetGachaStateMigrationKey } from './features/gacha/get-gacha-state-migration-key';
import { createHasMigratedLegacyGachaState } from './features/gacha/has-migrated-legacy-gacha-state';
import { createMarkLegacyGachaStateMigrated } from './features/gacha/mark-legacy-gacha-state-migrated';
import { createGetStoredGachaStateSnapshot } from './features/gacha/get-stored-gacha-state-snapshot';
import { createAssertSaveStoredGachaStateSnapshot } from './features/gacha/assert-save-stored-gacha-state-snapshot';
import { createNormalizeGachaStateRecord } from './features/gacha/normalize-gacha-state-record';
import { createGetGachaShardLabel } from './features/gacha/get-gacha-shard-label';
import { createNormalizeImageUrlInput } from './features/ui/normalize-image-url-input';
import { createIsRemoteImageUrlValid } from './features/ui/is-remote-image-url-valid';
import { createCreateMetaCheckResultRegex } from './features/regex/create-meta-check-result-regex';
import { createCreateDiceResultPlaceholderRegex } from './features/regex/create-dice-result-placeholder-regex';
import { createCountUnicodeCharacters } from './shared/count-unicode-characters';
import { createRefreshDialogueIndentRender } from './features/ui/refresh-dialogue-indent-render';
import { createGetDiceConfig } from './features/dice/get-dice-config';
import { createParseAdvancedPresetJsonCandidate } from './features/presets/parse-advanced-preset-json-candidate';
import { createBuildDashboardPresetAgentPrompt } from './features/presets/build-dashboard-preset-agent-prompt';
import { createBuildActionPresetAgentPrompt } from './features/presets/build-action-preset-agent-prompt';
import { createBuildRenderPresetAgentPrompt } from './features/presets/build-render-preset-agent-prompt';
import { createBuildTableTemplateRequirementPresetAgentPrompt } from './features/presets/build-table-template-requirement-preset-agent-prompt';
import { createBuildGachaCatalogAgentPrompt } from './features/presets/build-gacha-catalog-agent-prompt';
import { createParseJsoncValue } from './shared/parse-jsonc-value';
import { createNormalizeInteractionLabel } from './features/table/normalize-interaction-label';
import { createGetPendingDeletions } from './features/table/get-pending-deletions';
import { createGetTavernHostDocument } from './features/ui/get-tavern-host-document';
import { createNormalizeCustomTableNameIconKeyPart } from './features/table/normalize-custom-table-name-icon-key-part';
import { createGetActiveTabState } from './features/table/get-active-tab-state';
import { createGetSavedTableOrder } from './features/table/get-saved-table-order';
import { createGetStableTableSort } from './features/table/get-stable-table-sort';
import { createEnsureCanonicalTableOrder } from './features/table/ensure-canonical-table-order';
import { createGetCollapsedState } from './features/table/get-collapsed-state';
import { createGetOptionsCollapsedState } from './features/table/get-options-collapsed-state';
import { createGetTableHeights } from './features/table/get-table-heights';
import { createGetTableStyles } from './features/table/get-table-styles';
import { createGetHiddenTables } from './features/table/get-hidden-tables';
import { createGetReverseTables } from './features/table/get-reverse-tables';
import { createGetNormalizedReverseTables } from './features/table/get-normalized-reverse-tables';
import { createFormatSignedModifier } from './features/dice/format-signed-modifier';
import { createGetDiceProfileSillyTavern } from './features/profiles/get-dice-profile-silly-tavern';
import { createIsTutorialScope } from './features/tutorial/is-tutorial-scope';
import { createNormalizeDiffRow } from './features/table/normalize-diff-row';
import { createGetDiffHeaders } from './features/table/get-diff-headers';
import { createGetDiffRows } from './features/table/get-diff-rows';
import { createBuildCheckSuggestionMetaBlock } from './features/dice/build-check-suggestion-meta-block';
import { createGetInventoryFiltersCollapsedState } from './features/gacha/get-inventory-filters-collapsed-state';
import { createGetRuntimeGachaRawData } from './features/gacha/get-runtime-gacha-raw-data';
import { createGetGachaCatalogScopeKey } from './features/gacha/get-gacha-catalog-scope-key';
import { createBuildAdvancedPresetAgentPrompt } from './features/presets/build-advanced-preset-agent-prompt';
import { createNormalizeGachaItemEnabled } from './features/gacha/normalize-gacha-item-enabled';
import { createNormalizeGachaFieldAlias } from './features/gacha/normalize-gacha-field-alias';
import { createHasDatabaseNewUiRuntime } from './features/table/has-database-new-ui-runtime';
import { createCrudSqlIdentifierPattern } from './features/table/crud-sql-identifier-pattern';
import { createNormalizeCrudHeaderLookupKey } from './features/table/normalize-crud-header-lookup-key';
import { createFindDatabaseNewUiManualUpdateButton } from './features/table/find-database-new-ui-manual-update-button';
import { createGetCustomTableNameIconLocalFileValidationError } from './features/table/get-custom-table-name-icon-local-file-validation-error';
import { createSanitizeDiceConfigBackupPresetRules } from './features/dice/sanitize-dice-config-backup-preset-rules';
import { createResolveQuickSelectTarget } from './features/dice/resolve-quick-select-target';
import { createResolveIsolationKey } from './features/table/resolve-isolation-key';
import { createRenderIcon } from './features/ui/render-icon';
import { createRenderGlobalInteractionsTableGroup } from './features/table/render-global-interactions-table-group';
import { createRenderGlobalInteractionActionButton } from './features/table/render-global-interaction-action-button';
import { createPrepareInventoryTutorial } from './features/gacha/prepare-inventory-tutorial';
import { createPickWeightedValue } from './features/gacha/pick-weighted-value';
import { createPerformSaveDataOnly } from './features/table/perform-save-data-only';
import { createParseTableTemplateRequirementPresetJson } from './features/presets/parse-table-template-requirement-preset-json';
import { createParseJsoncRecord } from './shared/parse-jsonc-record';
import { createOpenDatabaseNewUiViaMenuEntry } from './features/table/open-database-new-ui-via-menu-entry';
import { createNormalizeScopedGachaCatalogRecord } from './features/gacha/normalize-scoped-gacha-catalog-record';
import { createNormalizeRenderPresetStringList } from './features/presets/normalize-render-preset-string-list';
import { createNormalizeGachaTargetColumns } from './features/gacha/normalize-gacha-target-columns';
import { createNormalizeGachaCatalogRecord } from './features/gacha/normalize-gacha-catalog-record';
import { createHasDbPayload } from './features/table/has-db-payload';
import { createGetTutorialModule } from './features/tutorial/get-tutorial-module';
import { createGetStoredGachaPoolSettings } from './features/gacha/get-stored-gacha-pool-settings';
import { createGetResultBadgeClass } from './features/dice/get-result-badge-class';
import { createGetInventoryFieldLabel } from './features/gacha/get-inventory-field-label';
import { createGetGachaPickupRotationKey } from './features/gacha/get-gacha-pickup-rotation-key';
import { createGetElementEmoji } from './features/dice/get-element-emoji';
import { createGetDiceConfigBackupBuiltinPresetIds } from './features/dice/get-dice-config-backup-builtin-preset-ids';
import { createGetDashboardModuleKeysForTableName } from './features/dashboard/get-dashboard-module-keys-for-table-name';
import { createGetCrudChangedColumns } from './features/table/get-crud-changed-columns';
import { createGetAvatarFallbackColor } from './features/avatars/get-avatar-fallback-color';
import { createFormatGachaRewardDestinationLabel } from './features/gacha/format-gacha-reward-destination-label';
import { createDownloadCustomTableNameIconPack } from './features/table/download-custom-table-name-icon-pack';
import { createCreateSheetDataFingerprint } from './features/table/create-sheet-data-fingerprint';
import { createCopyDiceConfigBackupExistingFields } from './features/dice/copy-dice-config-backup-existing-fields';
import { createClearTextareaDiceCache } from './features/textarea/clear-textarea-dice-cache';
import { createBuildGachaCustomFieldHeaderMap } from './features/gacha/build-gacha-custom-field-header-map';
import { createBuildDiceConfigBackupRuleOverrideMap } from './features/dice/build-dice-config-backup-rule-override-map';
import { createAcuDiceProfilesInstance } from './features/api/acu-dice-profiles-instance';
import { createAcuDiceCheckInstance } from './features/api/acu-dice-check-instance';
import { createGachaCustomFieldReservedKeys } from './features/gacha/gacha-custom-field-reserved-keys';
import { createFontsList } from './features/ui/fonts-list';
import { createCustomTableNameIconDeniedTableNames } from './features/table/custom-table-name-icon-denied-table-names';
import { createEnsurePanelNavigationVisible } from './features/ui/ensure-panel-navigation-visible';
import { createUpdateGachaItemSetting } from './features/gacha/update-gacha-item-setting';
import { createSyncAttributeRuleTagsInTemplate } from './features/dice/sync-attribute-rule-tags-in-template';
import { createStripSystemInjectedContent } from './features/human-input/strip-system-injected-content';
import { createSanitizeDiceConfigBackupStoredValue } from './features/dice/sanitize-dice-config-backup-stored-value';
import { createSanitizeDiceConfigBackupRegexRule } from './features/dice/sanitize-dice-config-backup-regex-rule';
import { createRunInSaveQueue } from './features/table/run-in-save-queue';
import { createRunDatabaseManualUpdateViaLegacyButton } from './features/table/run-database-manual-update-via-legacy-button';
import { createRestoreMutableRuntimeValue } from './features/table/restore-mutable-runtime-value';
import { createResolveDashboardCustomTableNameIconRowName } from './features/dashboard/resolve-dashboard-custom-table-name-icon-row-name';
import { createRefreshGachaShardShop } from './features/gacha/refresh-gacha-shard-shop';
import { createRefreshChangesPanel } from './features/changes/refresh-changes-panel';
import { createReadAdvancedPresetPolicyNumber } from './features/presets/read-advanced-preset-policy-number';
import { createPatchCrudSheetCellInRecord } from './features/table/patch-crud-sheet-cell-in-record';
import { createParseIsolatedData } from './features/table/parse-isolated-data';
import { createNormalizeGachaCustomFields } from './features/gacha/normalize-gacha-custom-fields';
import { createMergeDiceConfigBackupSetArray } from './features/dice/merge-dice-config-backup-set-array';
import { createGetViewportBottomAnchorElements } from './features/ui/get-viewport-bottom-anchor-elements';
import { createGetPlayerName } from './features/dice/get-player-name';
import { createGetLatestAssistantMessageElement } from './features/table/get-latest-assistant-message-element';
import { createGetGachaState } from './features/gacha/get-gacha-state';
import { createGetGachaShopProgressContainers } from './features/gacha/get-gacha-shop-progress-containers';
import { createGetDataAreaForRoot } from './features/ui/get-data-area-for-root';
import { createGachaRegexActionsInstance } from './features/gacha/gacha-regex-actions-instance';
import { createFindRelationGraphRelationColumnMatch } from './features/table/find-relation-graph-relation-column-match';
import { createFindGachaDefinitionByNameQuality } from './features/gacha/find-gacha-definition-by-name-quality';
import { createExtractNumericValue } from './shared/extract-numeric-value';
import { createDownloadTextFile } from './shared/download-text-file';
import { createCreateRegexRuleSignature } from './features/regex/create-regex-rule-signature';
import { createClampPanelHeightToDisplay } from './features/ui/clamp-panel-height-to-display';
import { createBuildDefaultGachaPoolDefinition } from './features/gacha/build-default-gacha-pool-definition';
import { createBuildCrudColumnAliasMap } from './features/table/build-crud-column-alias-map';
import { createBuildAcuDiceGachaStateSnapshot } from './features/gacha/build-acu-dice-gacha-state-snapshot';
import { createApplyDiceConfigBackupRuleOverrides } from './features/dice/apply-dice-config-backup-rule-overrides';
import { createDiffIdHeaderKeywords } from './features/table/diff-id-header-keywords';
import { createUpdateValidationIndicator } from './features/ui/update-validation-indicator';
import { createTriggerGenerationAfterDirectSend } from './features/textarea/trigger-generation-after-direct-send';
import { createStringifyAcuDiceGachaCatalogInput } from './features/gacha/stringify-acu-dice-gacha-catalog-input';
import { createStartGachaShopUiRefresh } from './features/gacha/start-gacha-shop-ui-refresh';
import { createRunMaybeAsyncDatabaseUiOpener } from './features/table/run-maybe-async-database-ui-opener';
import { createRenderAsyncImageIconSlotContent } from './features/ui/render-async-image-icon-slot-content';
import { createParseInSceneStatus } from './features/dice/parse-in-scene-status';
import { createOpenDatabaseVisualizerInterface } from './features/table/open-database-visualizer-interface';
import { createIsRelationshipCell } from './features/table/is-relationship-cell';
import { createGetUserCharacterNameCandidates } from './features/dice/get-user-character-name-candidates';
import { createGetInventoryGlobalContext } from './features/gacha/get-inventory-global-context';
import { createGetInventoryFieldColumnIndex } from './features/gacha/get-inventory-field-column-index';
import { createGetCustomTableNameIconPackImportSummaryText } from './features/table/get-custom-table-name-icon-pack-import-summary-text';
import { createGetCustomTableNameIconManagerRawSheets } from './features/table/get-custom-table-name-icon-manager-raw-sheets';
import { createFindRuntimeFunction } from './shared/find-runtime-function';
import { createDedupeInteractionActions } from './features/table/dedupe-interaction-actions';
import { createCollectDiceConfigBackupGachaCatalogRollbackSnapshot } from './features/dice/collect-dice-config-backup-gacha-catalog-rollback-snapshot';
import { createCloneQuickSelectNameMapping } from './features/dice/clone-quick-select-name-mapping';
import { createClickDatabaseNewUiFormFillNavigation } from './features/table/click-database-new-ui-form-fill-navigation';
import { createClearViewportInputMutationObserver } from './features/ui/clear-viewport-input-mutation-observer';
import { createClearFixedAnchorMutationObserver } from './features/ui/clear-fixed-anchor-mutation-observer';
import { createClearComposerIfCurrentText } from './features/textarea/clear-composer-if-current-text';
import { createCleanupGlobalInteractionFloatingMenus } from './features/table/cleanup-global-interaction-floating-menus';
import { createBuildAvatarBackgroundStyle } from './features/avatars/build-avatar-background-style';
import { createAssertCrudInsertRequiredCells } from './features/table/assert-crud-insert-required-cells';
import { createGlobalInteractionNameHeaderKeywords } from './features/table/global-interaction-name-header-keywords';
import { createSetPanelRequestedHeight } from './features/ui/set-panel-requested-height';
import { createRenderDiceConfigBackupPrivacyNotice } from './features/dice/render-dice-config-backup-privacy-notice';
import { createPushRecentGachaReward } from './features/gacha/push-recent-gacha-reward';
import { createOpenDatabaseNewUiViaApi } from './features/table/open-database-new-ui-via-api';
import { createNormalizeAvatarHexColor } from './features/avatars/normalize-avatar-hex-color';
import { createGetInventoryMetadataForItem } from './features/gacha/get-inventory-metadata-for-item';
import { createGetInventoryFilters } from './features/gacha/get-inventory-filters';
import { createGetGlobalInteractionActionRuleGroups } from './features/table/get-global-interaction-action-rule-groups';
import { createGetCrudCellValueForWrite } from './features/table/get-crud-cell-value-for-write';
import { createGetConfig } from './features/table/get-config';
import { createGetAttributePresetMappedTarget } from './features/dice/get-attribute-preset-mapped-target';
import { createFindGachaColumnByKeywords } from './features/gacha/find-gacha-column-by-keywords';
import { createCreateDiceProfileTavernRegex } from './features/dice/create-dice-profile-tavern-regex';
import { createBuildCheckSuggestionGuide } from './features/dice/build-check-suggestion-guide';
import { createParseJsoncDocument } from './features/presets/parse-jsonc-document';
import { createOpenDatabaseVisualizerNewUiViaApi } from './features/table/open-database-visualizer-new-ui-via-api';
import { createNormalizeGachaMessageId } from './features/gacha/normalize-gacha-message-id';
import { createNormalizeDiceConfigBackupGachaCatalogSnapshotRecords } from './features/dice/normalize-dice-config-backup-gacha-catalog-snapshot-records';
import { createNormalizeCustomTableNameIconContext } from './features/table/normalize-custom-table-name-icon-context';
import { createMergeDiceConfigBackupRegexRules } from './features/dice/merge-dice-config-backup-regex-rules';
import { createIsQuickSelectTargetAvailable } from './features/dice/is-quick-select-target-available';
import { createHasDatabaseManualUpdateSurface } from './features/table/has-database-manual-update-surface';
import { createGetSuccessLevel } from './features/dice/get-success-level';
import { createGetPanelDisplayMaxHeight } from './features/ui/get-panel-display-max-height';
import { createGetGachaReservedCustomFieldHeaders } from './features/gacha/get-gacha-reserved-custom-field-headers';
import { createGetGachaPoolDefinitions } from './features/gacha/get-gacha-pool-definitions';
import { createGetDiffPreferredColumns } from './features/table/get-diff-preferred-columns';
import { createCreateUniqueGachaItemId } from './features/gacha/create-unique-gacha-item-id';
import { createCollectGachaPoolTagsFromItems } from './features/gacha/collect-gacha-pool-tags-from-items';
import { createCharacterNamesMatch } from './features/dice/character-names-match';
import { createDiceConfigBackupPrivacyRiskText } from './features/dice/dice-config-backup-privacy-risk-text';
import { createShowDiceProfileApplyConfirm } from './features/dice/show-dice-profile-apply-confirm';
import { createShowDiceConfigBackupPrivacyConfirm } from './features/dice/show-dice-config-backup-privacy-confirm';
import { createCustomTableNameIconSections } from './features/table/custom-table-name-icon-sections';
import { createCustomTableNameIconModuleIds } from './features/table/custom-table-name-icon-module-ids';
import { createCustomTableNameIconManagerSectionLabels } from './features/table/custom-table-name-icon-manager-section-labels';
import { createCustomTableNameIconManagerModuleLabels } from './features/table/custom-table-name-icon-manager-module-labels';
import { createNormalizeAdvancedPresetData } from './features/presets/normalize-advanced-preset-data';
import { createAcuDatabaseManualUpdateActionSelector } from './features/table/acu-database-manual-update-action-selector';
import { createAcuDatabaseLegacyManualUpdateButtonSelector } from './features/table/acu-database-legacy-manual-update-button-selector';
import { createAcuDatabaseManualUpdateButtonWaitMs } from './features/table/acu-database-manual-update-button-wait-ms';
import { createAcuDatabaseManualUpdateButtonPollMs } from './features/table/acu-database-manual-update-button-poll-ms';
import { createIsRecord } from './shared/is-record';
import { createGetFloatingCollapsePosition } from './features/ui/get-floating-collapse-position';
import { createGetDiceConfigBackupWarningCount } from './features/dice/get-dice-config-backup-warning-count';
import { createGetDiceConfigBackupRegexRuleKey } from './features/dice/get-dice-config-backup-regex-rule-key';
import { createGetDiceConfigBackupModuleDefinition } from './features/dice/get-dice-config-backup-module-definition';
import { createGetDiceConfigBackupKeyStrategy } from './features/dice/get-dice-config-backup-key-strategy';
import { createGetDiceConfigBackupGachaItemNameKey } from './features/dice/get-dice-config-backup-gacha-item-name-key';
import { createGetDiceConfigBackupGachaCatalogItemCount } from './features/dice/get-dice-config-backup-gacha-catalog-item-count';
import { createGetDashboardModuleConfig } from './features/dashboard/get-dashboard-module-config';
import { createGetCustomTableNameIconManagerSectionLabel } from './features/table/get-custom-table-name-icon-manager-section-label';
import { createGetCustomTableNameIconManagerModuleLabel } from './features/table/get-custom-table-name-icon-manager-module-label';
import { createGetCustomTableNameIconManagerLocalKey } from './features/table/get-custom-table-name-icon-manager-local-key';
import { createGetCustomGachaItemDefinitions } from './features/gacha/get-custom-gacha-item-definitions';
import { createGetCrudTableIdentifier } from './features/table/get-crud-table-identifier';
import { createGetAvailableGachaRewardTargets } from './features/gacha/get-available-gacha-reward-targets';
import { createGetAllDiceConfigBackupModuleIds } from './features/dice/get-all-dice-config-backup-module-ids';
import { createGetAdvancedPresetErrorMessage } from './features/presets/get-advanced-preset-error-message';
import { createWaitForDatabaseUiTick } from './features/table/wait-for-database-ui-tick';
import { createSharedHistoryStore } from './features/dice/shared-history-store';
import { createScheduleDialogueIndentRender } from './features/ui/schedule-dialogue-indent-render';
import { createSaveTableStyles } from './features/table/save-table-styles';
import { createSaveTableOrder } from './features/table/save-table-order';
import { createSaveTableHeights } from './features/table/save-table-heights';
import { createSaveStoredGachaStateSnapshot } from './features/gacha/save-stored-gacha-state-snapshot';
import { createSaveReverseTables } from './features/table/save-reverse-tables';
import { createSaveOptionsCollapsedState } from './features/table/save-options-collapsed-state';
import { createSaveHiddenTables } from './features/table/save-hidden-tables';
import { createSaveCollapsedState } from './features/table/save-collapsed-state';
import { createSaveActiveTabState } from './features/table/save-active-tab-state';
import { createSameRow } from './features/table/same-row';
import { createGetAdvancedPresetDisplayOutcome } from './features/presets/get-advanced-preset-display-outcome';
import { createFormatGachaPoolTags } from './features/gacha/format-gacha-pool-tags';
import { createFormatGachaCatalogImportStatsText } from './features/gacha/format-gacha-catalog-import-stats-text';
import { createCreateDiceProfileRuntimeId } from './features/dice/create-dice-profile-runtime-id';
import { createCloneGachaPoolDefinitions } from './features/gacha/clone-gacha-pool-definitions';
import { createCloneGachaCatalogItems } from './features/gacha/clone-gacha-catalog-items';
import { createCloseInventoryVisualization } from './features/gacha/close-inventory-visualization';
import { createClearPendingDeletions } from './features/table/clear-pending-deletions';
import { createClearModalStack } from './features/ui/clear-modal-stack';
import { createAcuDiceRollInstance } from './features/api/acu-dice-roll-instance';
import { createLegacyDefaultQuickCheckExcludeKeywords } from './features/dice/legacy-default-quick-check-exclude-keywords';
import { createDashboardPresetFilterKeys } from './features/dashboard/dashboard-preset-filter-keys';
import { createDashboardPresetAdditionalColumns } from './features/dashboard/dashboard-preset-additional-columns';
import { createBuiltinTableTemplateRequirementPresets } from './features/presets/builtin-table-template-requirement-presets';
import { createSetGachaPoolOrder } from './features/gacha/set-gacha-pool-order';
import { createSetGachaItemOrder } from './features/gacha/set-gacha-item-order';
import { createSaveInventoryFiltersCollapsedState } from './features/gacha/save-inventory-filters-collapsed-state';
import { createSaveDataOnly } from './features/table/save-data-only';
import { createSameHeaders } from './features/table/same-headers';
import { createRenderOptionButtonHtml } from './features/dice/render-option-button-html';
import { createRenderDiceConfigBackupWarningSlot } from './features/dice/render-dice-config-backup-warning-slot';
import { createRenderDeprecatedBadge } from './features/dice/render-deprecated-badge';
import { createRenderCheckSuggestionOptionButtonHtml } from './features/dice/render-check-suggestion-option-button-html';
import { createNormalizeGachaRewardTarget } from './features/gacha/normalize-gacha-reward-target';
import { createIsUserPlaceholderKey } from './features/dice/is-user-placeholder-key';
import { createIsTwoDimensionalArray } from './shared/is-two-dimensional-array';
import { createIsRecordValue } from './shared/is-record-value';
import { createIsGachaRarity } from './features/gacha/is-gacha-rarity';
import { createIsGachaPoolEnabled } from './features/gacha/is-gacha-pool-enabled';
import { createIsGachaPickupItem } from './features/gacha/is-gacha-pickup-item';
import { createIsGachaItemEnabled } from './features/gacha/is-gacha-item-enabled';
import { createIsFloatingCollapseActive } from './features/ui/is-floating-collapse-active';
import { createIsDiceProfileCharacterSource } from './features/dice/is-dice-profile-character-source';
import { createIsDiceConfigBackupRecord } from './features/dice/is-dice-config-backup-record';
import { createIsDiceConfigBackupModuleId } from './features/dice/is-dice-config-backup-module-id';
import { createIsDeprecatedBuiltinRegexRule } from './features/dice/is-deprecated-builtin-regex-rule';
import { createIsDatabaseButtonDisabled } from './features/table/is-database-button-disabled';
import { createIsCustomTableNameIconSection } from './features/table/is-custom-table-name-icon-section';
import { createIsCustomTableNameIconModuleId } from './features/table/is-custom-table-name-icon-module-id';
import { createIsCrudRowIdMissing } from './features/table/is-crud-row-id-missing';
import { createIsCrudNullableEnumEmptyValue } from './features/table/is-crud-nullable-enum-empty-value';
import { createIsBuiltinGachaPoolId } from './features/gacha/is-builtin-gacha-pool-id';
import { createIsAttributeQuickSelectTarget } from './features/dice/is-attribute-quick-select-target';
import { createIsAdvancedPresetRecord } from './features/presets/is-advanced-preset-record';
import { createHasGachaCustomFields } from './features/gacha/has-gacha-custom-fields';
import { createHasDiceConfigBackupTableTemplateResource } from './features/dice/has-dice-config-backup-table-template-resource';
import { createHasAdvancedPresetFieldConfig } from './features/presets/has-advanced-preset-field-config';
import { createGetVisibleGachaPoolConfigDefinitions } from './features/gacha/get-visible-gacha-pool-config-definitions';
import { createGetTutorialButtonHtml } from './features/tutorial/get-tutorial-button-html';
import { createGetObjectRecord } from './shared/get-object-record';
import { createGetGachaSettingsPoolItems } from './features/gacha/get-gacha-settings-pool-items';
import { createGetGachaRewardTargetTableLabel } from './features/gacha/get-gacha-reward-target-table-label';
import { createGetGachaRewardTargetModuleName } from './features/gacha/get-gacha-reward-target-module-name';
import { createGetGachaRewardTargetModuleKey } from './features/gacha/get-gacha-reward-target-module-key';
import { createGetGachaRarityIconClass } from './features/gacha/get-gacha-rarity-icon-class';
import { createGetGachaPoolDisplayName } from './features/gacha/get-gacha-pool-display-name';
import { createGetGachaItemGrantQuantity } from './features/gacha/get-gacha-item-grant-quantity';
import { createGetGachaItemDescriptionText } from './features/gacha/get-gacha-item-description-text';
import { createGetGachaCustomFieldEntries } from './features/gacha/get-gacha-custom-field-entries';
import { createGetGachaCatalogItemMergeTimestamp } from './features/gacha/get-gacha-catalog-item-merge-timestamp';
import { createFindRuntimeSheetEntryForMutation } from './features/table/find-runtime-sheet-entry-for-mutation';
import { createFindGachaDefinitionByInventoryItem } from './features/gacha/find-gacha-definition-by-inventory-item';
import { createExtractMetaCheckResultBlocks } from './features/human-input/extract-meta-check-result-blocks';
import { createExecuteFixedCheckSuggestion } from './features/dice/execute-fixed-check-suggestion';
import { createDownloadDiceConfigBackupJson } from './features/dice/download-dice-config-backup-json';
import { createCompareGachaItemDefinitionsForDisplay } from './features/gacha/compare-gacha-item-definitions-for-display';
import { createCloneAcuDiceApiValue } from './features/api/clone-acu-dice-api-value';
import { createClearGlobalInteractionOutsideCapture } from './features/table/clear-global-interaction-outside-capture';
import { createCanDeleteGachaPoolDefinition } from './features/gacha/can-delete-gacha-pool-definition';
import { createBuildStableGachaCustomItemId } from './features/gacha/build-stable-gacha-custom-item-id';
import { createAsDiffRecord } from './features/table/as-diff-record';
import { createApplyPanelDisplayMaxHeight } from './features/ui/apply-panel-display-max-height';
import { createAcuDiceHistoryInstance } from './features/api/acu-dice-history-instance';
import { createNameAliasRegistryInstance } from './features/dice/name-alias-registry-instance';
import { createGachaEquipmentWrittenTargetColumnKeys } from './features/gacha/gacha-equipment-written-target-column-keys';
import { createDefaultOutputTemplate } from './features/dice/default-output-template';
import { createDashboardRelationshipGraphSourceModes } from './features/dashboard/dashboard-relationship-graph-source-modes';
import { createCustomRollMode } from './features/dice/custom-roll-mode';
import { createIsCustomTableNameIconImageUrlValid } from './features/table/is-custom-table-name-icon-image-url-valid';
import { createGetCustomTableNameIconImageUrlValidationError } from './features/table/get-custom-table-name-icon-image-url-validation-error';
import { createBindAcuDiceGachaRegexActions } from './features/api/bind-acu-dice-gacha-regex-actions';
import { createWarnTableTemplateIssue } from './features/table/warn-table-template-issue';
import { createShouldShowReverseButton } from './features/table/should-show-reverse-button';
import { createSaveStoredGachaShardShopRarity } from './features/gacha/save-stored-gacha-shard-shop-rarity';
import { createSaveStoredGachaActivePoolTag } from './features/gacha/save-stored-gacha-active-pool-tag';
import { createSaveInventoryMetadataStore } from './features/gacha/save-inventory-metadata-store';
import { createSaveInventoryFilters } from './features/gacha/save-inventory-filters';
import { createGetInventoryPanelTarget } from './features/table/get-inventory-panel-target';
import { createSaveInventoryPanelTarget } from './features/table/save-inventory-panel-target';
import { createSaveDiceProfileCollapsedSections } from './features/dice/save-dice-profile-collapsed-sections';
import { createSaveCrazyModeConfig } from './features/dice/save-crazy-mode-config';
import { createResolveRuntimeMutationSource } from './features/table/resolve-runtime-mutation-source';
import { createRenderDiceConfigBackupExportBody } from './features/dice/render-dice-config-backup-export-body';
import { createPushAdvancedPresetIssue } from './features/presets/push-advanced-preset-issue';
import { createParseDashboardPresetJson } from './features/dashboard/parse-dashboard-preset-json';
import { createParseCrudColumnDefinitionLine } from './features/table/parse-crud-column-definition-line';
import { createNotifyReady } from './features/api/notify-ready';
import { createMarkHumanInputActivity } from './features/human-input/mark-human-input-activity';
import { createIsTableReversed } from './features/table/is-table-reversed';
import { createIsLikelyAvatarSkinTone } from './features/avatars/is-likely-avatar-skin-tone';
import { createIsDiceStatsScopeUnavailable } from './features/dice/is-dice-stats-scope-unavailable';
import { createIsComplexCondition } from './features/dice/is-complex-condition';
import { createHandleCustomTableNameIconImageDBPagehide } from './features/table/handle-custom-table-name-icon-image-db-pagehide';
import { createGetTemplateInspectionSeverityMeta } from './features/presets/get-template-inspection-severity-meta';
import { createGetInventoryMetadataScopeKey } from './features/gacha/get-inventory-metadata-scope-key';
import { createGetDisplayPlayerName } from './features/dice/get-display-player-name';
import { createGetCustomTableNameIconManagerEntryAsset } from './features/table/get-custom-table-name-icon-manager-entry-asset';
import { createGetAttributesForCharacter } from './features/dice/get-attributes-for-character';
import { createGetAllGachaPoolConfigDefinitions } from './features/gacha/get-all-gacha-pool-config-definitions';
import { createExtractCheckSuggestionTieRule } from './features/dice/extract-check-suggestion-tie-rule';
import { createExtractCheckSuggestionTarget } from './features/dice/extract-check-suggestion-target';
import { createExtractCheckSuggestionDiceFormula } from './features/dice/extract-check-suggestion-dice-formula';
import { createErrorTableTemplateIssue } from './features/table/error-table-template-issue';
import { createEmitEvent } from './features/api/emit-event';
import { createDownloadJsoncFile } from './shared/download-jsonc-file';
import { createDownloadJsonFile } from './shared/download-json-file';
import { createDownloadAiPromptFile } from './shared/download-ai-prompt-file';
import { createWarnMissingTableTarget } from './features/table/warn-missing-table-target';
import { createTruncateGachaText } from './features/gacha/truncate-gacha-text';
import { createTemplateTextIncludesAny } from './features/presets/template-text-includes-any';
import { createSetTextareaValueAndNotify } from './features/textarea/set-textarea-value-and-notify';
import { createSerializeAcuDiceGachaItem } from './features/api/serialize-acu-dice-gacha-item';
import { createResolveCheckSuggestionCharacterName } from './features/dice/resolve-check-suggestion-character-name';
import { createReopenInventoryItemDetail } from './features/gacha/reopen-inventory-item-detail';
import { createReadAdvancedPresetContextTags } from './features/presets/read-advanced-preset-context-tags';
import { createQuoteSlashArgument } from './features/textarea/quote-slash-argument';
import { createPatchLatestChatSheetWithoutTracking } from './features/table/patch-latest-chat-sheet-without-tracking';
import { createNormalizeTemplateInspectText } from './features/presets/normalize-template-inspect-text';
import { createNormalizeTableNameList } from './features/table/normalize-table-name-list';
import { createNormalizeStorableImageUrl } from './features/avatars/normalize-storable-image-url';
import { createNormalizeSheetKeys } from './features/table/normalize-sheet-keys';
import { createNormalizeGachaItemOrder } from './features/gacha/normalize-gacha-item-order';
import { createNormalizeDiffText } from './features/table/normalize-diff-text';
import { createNormalizeDatabaseUiText } from './features/table/normalize-database-ui-text';
import { createNormalizeCrudSqlComment } from './features/table/normalize-crud-sql-comment';
import { createNormalizeAcuDiceGachaImportMode } from './features/api/normalize-acu-dice-gacha-import-mode';
import { createIsSameKeywordSet } from './shared/is-same-keyword-set';
import { createIsPlayerTableName } from './features/table/is-player-table-name';
import { createIsGachaFieldAlias } from './features/gacha/is-gacha-field-alias';
import { createIsDiffSheet } from './features/table/is-diff-sheet';
import { createIsCustomTableNameIconSvgMimeType } from './features/table/is-custom-table-name-icon-svg-mime-type';
import { createHasSheetKeys } from './features/table/has-sheet-keys';
import { createHasRuntimeTableReadApi } from './features/table/has-runtime-table-read-api';
import { createHasGachaRewardTable } from './features/gacha/has-gacha-reward-table';
import { createGetStoredGachaShardShopRarity } from './features/gacha/get-stored-gacha-shard-shop-rarity';
import { createGetStoredGachaActivePoolTag } from './features/gacha/get-stored-gacha-active-pool-tag';
import { createGetInventoryMetadataStore } from './features/gacha/get-inventory-metadata-store';
import { createGetInventoryMetadataContextKey } from './features/gacha/get-inventory-metadata-context-key';
import { createGetGlobalInteractionRuleKeywords } from './features/table/get-global-interaction-rule-keywords';
import { createGetGlobalInteractionCollapsedSections } from './features/table/get-global-interaction-collapsed-sections';
import { createGetGachaTargetColumnEntries } from './features/gacha/get-gacha-target-column-entries';
import { createGetGachaRarityRank } from './features/gacha/get-gacha-rarity-rank';
import { createGetGachaItemTagsText } from './features/gacha/get-gacha-item-tags-text';
import { createGetGachaItemEffectText } from './features/gacha/get-gacha-item-effect-text';
import { createGetGachaCustomFieldsSearchText } from './features/gacha/get-gacha-custom-fields-search-text';
import { createGetDiffSheetContent } from './features/table/get-diff-sheet-content';
import { createGetDiffDataRow } from './features/table/get-diff-data-row';
import { createGetDiceProfilePromptStates } from './features/dice/get-dice-profile-prompt-states';
import { createGetDiceProfileModuleNames } from './features/dice/get-dice-profile-module-names';
import { createGetDiceProfileIndex } from './features/dice/get-dice-profile-index';
import { createGetDiceProfileCollapsedSections } from './features/dice/get-dice-profile-collapsed-sections';
import { createGetDiceConfigBackupTableTemplateApi } from './features/dice/get-dice-config-backup-table-template-api';
import { createGetDiceConfigBackupRecordString } from './features/dice/get-dice-config-backup-record-string';
import { createGetDiceConfigBackupPresetRecordName } from './features/dice/get-dice-config-backup-preset-record-name';
import { createGetDiceConfigBackupPresetRecordId } from './features/dice/get-dice-config-backup-preset-record-id';
import { createGetCustomTableNameIconContextKey } from './features/table/get-custom-table-name-icon-context-key';
import { createGetAttributeValue } from './features/dice/get-attribute-value';
import { createGetActiveGachaPoolTags } from './features/gacha/get-active-gacha-pool-tags';
import { createGetActiveDashboardRelationshipGraphSources } from './features/dashboard/get-active-dashboard-relationship-graph-sources';
import { createFormatGachaItemCardMeta } from './features/gacha/format-gacha-item-card-meta';
import { createStripKnownSystemActionText } from './features/human-input/strip-known-system-action-text';
import { createStripCrudSqlNonStructuralComments } from './features/table/strip-crud-sql-non-structural-comments';
import { createShouldInferCrudRowIdFromVisibleIndex } from './features/table/should-infer-crud-row-id-from-visible-index';
import { createSetDiffDataRow } from './features/table/set-diff-data-row';
import { createScheduleCharacterDiceProfileDetection } from './features/dice/schedule-character-dice-profile-detection';
import { createSaveStoredGachaSettingsPoolTag } from './features/gacha/save-stored-gacha-settings-pool-tag';
import { createSaveInventoryMetadataRoot } from './features/gacha/save-inventory-metadata-root';
import { createRestoreCrudRowIdPreparation } from './features/table/restore-crud-row-id-preparation';
import { createResolveTextareaTextWithHiddenDice } from './features/textarea/resolve-textarea-text-with-hidden-dice';
import { createResolveCanonicalCharacterName } from './features/dice/resolve-canonical-character-name';
import { createResolveAttributeAliasName } from './features/dice/resolve-attribute-alias-name';
import { createReplaceTag } from './features/table/replace-tag';
import { createRemoveDiffDataRow } from './features/table/remove-diff-data-row';
import { createRememberAutoRegexTransform } from './features/textarea/remember-auto-regex-transform';
import { createReadTextareaVisibleValue } from './features/textarea/read-textarea-visible-value';
import { createPushUniqueNameCandidate } from './shared/push-unique-name-candidate';
import { createNotifyTextareaValueChanged } from './features/textarea/notify-textarea-value-changed';
import { createNormalizePanelHeightValue } from './features/ui/normalize-panel-height-value';
import { createNormalizeGlobalInteractionHeader } from './features/table/normalize-global-interaction-header';
import { createNormalizeGlobalInteractionCategoryText } from './features/table/normalize-global-interaction-category-text';
import { createNormalizeGachaTargetTable } from './features/gacha/normalize-gacha-target-table';
import { createNormalizeCollapseStyle } from './features/table/normalize-collapse-style';
import { createNormalizeCheckSuggestionActionText } from './features/dice/normalize-check-suggestion-action-text';
import { createNormalizeAdvancedPresetNotes } from './features/presets/normalize-advanced-preset-notes';
import { createIsSameSheetData } from './features/table/is-same-sheet-data';
import { createIsSameAttributeAlias } from './features/dice/is-same-attribute-alias';
import { createIsAdvancedPresetNumericLike } from './features/presets/is-advanced-preset-numeric-like';
import { createGetTotalGachaShards } from './features/gacha/get-total-gacha-shards';
import { createGetStoredPanelHeight } from './features/ui/get-stored-panel-height';
import { createGetStoredGachaSettingsPoolTag } from './features/gacha/get-stored-gacha-settings-pool-tag';
import { createGetStoredGachaCatalog } from './features/gacha/get-stored-gacha-catalog';
import { createGetRuleTagSnippet } from './features/presets/get-rule-tag-snippet';
import { createGetNormalQuickSelectInputSelector } from './features/dice/get-normal-quick-select-input-selector';
import { createGetJsonLikeErrorMessage } from './shared/get-json-like-error-message';
import { createGetInventoryActionLabel } from './features/gacha/get-inventory-action-label';
import { createGetGachaRewardParseResultForItem } from './features/gacha/get-gacha-reward-parse-result-for-item';
import { createGetGachaRewardParseResult } from './features/gacha/get-gacha-reward-parse-result';
import { createGetGachaMinimumRarity } from './features/gacha/get-gacha-minimum-rarity';
import { createGetGachaItemCreatedAtMs } from './features/gacha/get-gacha-item-created-at-ms';
import { createGetGachaCatalogRecordMergeTimestamp } from './features/gacha/get-gacha-catalog-record-merge-timestamp';
import { createGetGachaAllExpandablePoolTags } from './features/gacha/get-gacha-all-expandable-pool-tags';
import { createGetGachaActivePoolTag } from './features/gacha/get-gacha-active-pool-tag';
import { createGetDiceConfigBackupSafeCurrentPresets } from './features/dice/get-dice-config-backup-safe-current-presets';
import { createGetDbChatMessages } from './features/table/get-db-chat-messages';
import { createGetDatabaseManualUpdateErrorMessage } from './features/table/get-database-manual-update-error-message';
import { createGetCustomTableNameIconManagerSourceLabel } from './features/table/get-custom-table-name-icon-manager-source-label';
import { createGetCrudSheetDdl } from './features/table/get-crud-sheet-ddl';
import { createGetCrazyModeConfig } from './features/dice/get-crazy-mode-config';
import { createGetComposerTextarea } from './features/textarea/get-composer-textarea';
import { createGachaStoreInstance } from './features/gacha/gacha-store-instance';
import { createGachaStateCoreInstance } from './features/gacha/gacha-state-core-instance';
import { createFormatGachaItemCreatedAt } from './features/gacha/format-gacha-item-created-at';
import { createFormatGachaCatalogImportErrors } from './features/gacha/format-gacha-catalog-import-errors';
import { createFormatDiceConfigBackupSelectedModuleRiskLines } from './features/dice/format-dice-config-backup-selected-module-risk-lines';
import { createFindRuntimeSheetEntryForCrud } from './features/table/find-runtime-sheet-entry-for-crud';
import { createFindInventoryItemByRow } from './features/gacha/find-inventory-item-by-row';
import { createFindDiffSnapshotEntry } from './features/table/find-diff-snapshot-entry';
import { createExportDiceProfile } from './features/dice/export-dice-profile';
import { createEscapeCssString } from './shared/escape-css-string';
import { createDownloadDiceProfileJson } from './features/dice/download-dice-profile-json';
import { createDeleteDiceProfileRecord } from './features/dice/delete-dice-profile-record';
import { createDebugGlobalInteraction } from './features/table/debug-global-interaction';
import { createCreateEmptyGachaCatalog } from './features/gacha/create-empty-gacha-catalog';
import { createCreateElementFromHtml } from './features/ui/create-element-from-html';
import { createCreateDiceProfileTavernRegexReplaceString } from './features/dice/create-dice-profile-tavern-regex-replace-string';
import { createCreateAutoRegexTransformKey } from './features/textarea/create-auto-regex-transform-key';
import { createCollectGachaLocalStorageSnapshot } from './features/gacha/collect-gacha-local-storage-snapshot';
import { createCollectDashboardNpcEntriesFromTableResults } from './features/dashboard/collect-dashboard-npc-entries-from-table-results';
import { createClearPanelRequestedHeight } from './features/ui/clear-panel-requested-height';
import { createClampAvatarNumber } from './features/avatars/clamp-avatar-number';
import { createBuildCheckSuggestionInvalidCommandMessage } from './features/dice/build-check-suggestion-invalid-command-message';
import { createApplyGachaPityAfterDraw } from './features/gacha/apply-gacha-pity-after-draw';
import { createApplyAttributeQuickSelectDefaults } from './features/dice/apply-attribute-quick-select-defaults';
import { createAcuDicePresetsInstance } from './features/api/acu-dice-presets-instance';
import { createHumanInputTagBlockPatterns } from './features/human-input/human-input-tag-block-patterns';
import { createGachaSettingsStatusFilterOptions } from './features/gacha/gacha-settings-status-filter-options';
import { createGachaSettingsSourceFilterOptions } from './features/gacha/gacha-settings-source-filter-options';
import { createDiceStatsScopeLabels } from './features/dice/dice-stats-scope-labels';
import { createUpdateGachaShopProgressUi } from './features/gacha/update-gacha-shop-progress-ui';
import { createSortGachaPoolDefinitions } from './features/gacha/sort-gacha-pool-definitions';
import { createShouldSkipAutoRegexTransform } from './features/textarea/should-skip-auto-regex-transform';
import { createSaveDiceProfileRecord } from './features/dice/save-dice-profile-record';
import { createSaveConfig } from './features/table/save-config';
import { createPushDashboardNpcEntry } from './features/dashboard/push-dashboard-npc-entry';
import { createNormalizeInferredAvatarColor } from './features/avatars/normalize-inferred-avatar-color';
import { createNormalizeDashboardOptionalStringArray } from './features/dashboard/normalize-dashboard-optional-string-array';
import { createNormalizeCheckSuggestionSideShorthand } from './features/dice/normalize-check-suggestion-side-shorthand';
import { createNormalizeCharacterNameForCompare } from './shared/normalize-character-name-for-compare';
import { createJudgeCrazyRollResult } from './features/dice/judge-crazy-roll-result';
import { createIsRenderableImageUrlValid } from './shared/is-renderable-image-url-valid';
import { createIsGachaTargetTableAliasMatch } from './features/gacha/is-gacha-target-table-alias-match';
import { createGetStringLikeCellText } from './shared/get-string-like-cell-text';
import { createGetStableRowKeyForCrud } from './features/table/get-stable-row-key-for-crud';
import { createGetResolvedComposerText } from './features/textarea/get-resolved-composer-text';
import { createGetLegacyGachaStateFromRawData } from './features/gacha/get-legacy-gacha-state-from-raw-data';
import { createGetInventoryResult } from './features/gacha/get-inventory-result';
import { createGetInventoryActionPrompt } from './features/gacha/get-inventory-action-prompt';
import { createGetImageUrlValidationMessage } from './shared/get-image-url-validation-message';
import { createGetGachaRewardTargetOptions } from './features/gacha/get-gacha-reward-target-options';
import { createGetGachaLocalDateKey } from './features/gacha/get-gacha-local-date-key';
import { createGetFixedWrapperParentMetrics } from './features/ui/get-fixed-wrapper-parent-metrics';
import { createGetEquipmentResult } from './features/gacha/get-equipment-result';
import { createGetDiffSheetByKey } from './features/table/get-diff-sheet-by-key';
import { createGetDiceProfileCharacterContext } from './features/dice/get-dice-profile-character-context';
import { createGetCurrentChatAvatarNodes } from './features/avatars/get-current-chat-avatar-nodes';
import { createGetCheckSuggestionPresetById } from './features/dice/get-check-suggestion-preset-by-id';
import { createGetCheckSuggestionDiceSides } from './features/dice/get-check-suggestion-dice-sides';
import { createFormatGachaRecentRewardText } from './features/gacha/format-gacha-recent-reward-text';
import { createFormatGachaDuration } from './features/gacha/format-gacha-duration';
import { createExtractExplicitHumanInputText } from './features/human-input/extract-explicit-human-input-text';
import { createEvaluateConditionNumber } from './features/dice/evaluate-condition-number';
import { createEnsureGachaPoolsForTags } from './features/gacha/ensure-gacha-pools-for-tags';
import { createEnsureGachaHeartbeat } from './features/gacha/ensure-gacha-heartbeat';
import { createDrawSingleGachaOutcome } from './features/gacha/draw-single-gacha-outcome';
import { createCreateDiceProfileRegexId } from './features/dice/create-dice-profile-regex-id';
import { createConsumePendingHumanInputSnapshot } from './features/human-input/consume-pending-human-input-snapshot';
import { createClearFixedAnchorResizeObserver } from './features/ui/clear-fixed-anchor-resize-observer';
import { createBuildGachaSettlementKey } from './features/gacha/build-gacha-settlement-key';
import { createAreAllTablesReversed } from './features/table/are-all-tables-reversed';
import { createAddGachaShards } from './features/gacha/add-gacha-shards';
import { createDefaultGachaSettingsItemFilters } from './features/gacha/default-gacha-settings-item-filters';
import { createDefaultContestOutputTemplate } from './features/dice/default-contest-output-template';
import { createCustomTableNameIconDeniedSections } from './features/table/custom-table-name-icon-denied-sections';
import { createCustomTableNameIconAllowedLocalMimeTypes } from './features/table/custom-table-name-icon-allowed-local-mime-types';
import { createAcuDatabaseManualUpdateApiMethods } from './features/table/acu-database-manual-update-api-methods';
import { createWithTableTemplateCheckHint } from './features/table/with-table-template-check-hint';
import { createShouldTriggerCrazyMode } from './features/dice/should-trigger-crazy-mode';
import { createSetDiceConfigBackupValue } from './features/dice/set-dice-config-backup-value';
import { createSerializeGachaPoolDefinitionForExport } from './features/gacha/serialize-gacha-pool-definition-for-export';
import { createSerializeAcuDiceGachaDrawOutcome } from './features/api/serialize-acu-dice-gacha-draw-outcome';
import { createSaveDiceProfileIndex } from './features/dice/save-dice-profile-index';
import { createSaveCurrentDatabaseSnapshotAsReviewBaseline } from './features/table/save-current-database-snapshot-as-review-baseline';
import { createSanitizeUiConfig } from './features/table/sanitize-ui-config';
import { createSanitizeDiceConfigBackupRuleList } from './features/dice/sanitize-dice-config-backup-rule-list';
import { createResolveRootWindow } from './features/ui/resolve-root-window';
import { createResolveDashboardGlobalInteractionSectionKind } from './features/dashboard/resolve-dashboard-global-interaction-section-kind';
import { createRenderGlobalInteractionItemMark } from './features/table/render-global-interaction-item-mark';
import { createRenderGachaItemIconContent } from './features/gacha/render-gacha-item-icon-content';
import { createRenderDiceProfileTabPanel } from './features/dice/render-dice-profile-tab-panel';
import { createRenderDiceConfigBackupWarningList } from './features/dice/render-dice-config-backup-warning-list';
import { createRecordGachaFortuneGain } from './features/gacha/record-gacha-fortune-gain';
import { createReadTextFile } from './features/table/read-text-file';
import { createReadRuntimeTableDataReference } from './features/table/read-runtime-table-data-reference';
import { createPatchLatestChatSheetCellWithoutTracking } from './features/table/patch-latest-chat-sheet-cell-without-tracking';
import { createParseCheckSuggestionPrimitiveValue } from './features/dice/parse-check-suggestion-primitive-value';
import { createNormalizeTrackedText } from './shared/normalize-tracked-text';
import { createNormalizeGachaTimestamp } from './features/gacha/normalize-gacha-timestamp';
import { createNormalizeCheckSuggestionDiceFormula } from './features/dice/normalize-check-suggestion-dice-formula';
import { createNormalizeAcuDiceGachaInteger } from './features/api/normalize-acu-dice-gacha-integer';
import { createIsRuleTemplateSheetWithNote } from './features/table/is-rule-template-sheet-with-note';
import { createIsElementVisibleInLayout } from './features/ui/is-element-visible-in-layout';
import { createIsDiceConfigBackupSameValue } from './features/dice/is-dice-config-backup-same-value';
import { createIsCustomTableNameIconTableDenied } from './features/table/is-custom-table-name-icon-table-denied';
import { createIsCheckSuggestionOutcomeSuccess } from './features/dice/is-check-suggestion-outcome-success';
import { createGrantInventoryGachaReward } from './features/gacha/grant-inventory-gacha-reward';
import { createGrantEquipmentGachaReward } from './features/gacha/grant-equipment-gacha-reward';
import { createGrantGachaReward } from './features/gacha/grant-gacha-reward';
import { createGetStandardAttrs } from './features/dice/get-standard-attrs';
import { createGetRemoteImageUrlValidationError } from './shared/get-remote-image-url-validation-error';
import { createGetInventoryActiveFilterCount } from './features/gacha/get-inventory-active-filter-count';
import { createGetDiceProfileSourceLabel } from './features/dice/get-dice-profile-source-label';
import { createGetDiceProfilePromptState } from './features/dice/get-dice-profile-prompt-state';
import { createGetDiceConfigBackupValidationRuleKey } from './features/dice/get-dice-config-backup-validation-rule-key';
import { createGetDiceConfigBackupSelectedModuleIdsFromDialog } from './features/dice/get-dice-config-backup-selected-module-ids-from-dialog';
import { createGetDiceConfigBackupRuleRecords } from './features/dice/get-dice-config-backup-rule-records';
import { createGetCrudSqlTableName } from './features/table/get-crud-sql-table-name';
import { createGetCheckSuggestionMappedTarget } from './features/dice/get-check-suggestion-mapped-target';
import { createGetAvatarManualAliases } from './features/avatars/get-avatar-manual-aliases';
import { createGetAllGachaItemDefinitions } from './features/gacha/get-all-gacha-item-definitions';
import { createEvaluateCheckSuggestionOutcome } from './features/dice/evaluate-check-suggestion-outcome';
import { createDispatchReadyEvent } from './features/api/dispatch-ready-event';
import { createConsumeCrudWriteOptions } from './features/table/consume-crud-write-options';
import { createCloneRuntimeDataValue } from './shared/clone-runtime-data-value';
import { createBuildGlobalInteractionSearchText } from './features/table/build-global-interaction-search-text';
import { createBuildCustomTableNameIconPack } from './features/table/build-custom-table-name-icon-pack';
import { createBuildAttributeRulesContent } from './features/dice/build-attribute-rules-content';
import { isDatabaseManualUpdateButtonTextImpl as isDatabaseManualUpdateButtonText } from './features/table/normalize-database-ui-text';
import { normalizeDiffHeaderImpl as normalizeDiffHeader } from './features/table/normalize-diff-text';
import { escapeRegExpLiteralImpl as escapeRegExpLiteral } from './shared/normalize-tracked-text';
import { buildGachaExportNamePartImpl as buildGachaExportNamePart } from './features/gacha/serialize-gacha-pool-definition-for-export';
import { getCustomTableNameIconPackDownloadFileNameImpl as getCustomTableNameIconPackDownloadFileName } from './features/table/build-custom-table-name-icon-pack';
import { createAssertCrudJsonFallbackAllowed } from './features/table/assert-crud-json-fallback-allowed';
import { createAddCrudColumnAlias } from './features/table/add-crud-column-alias';
import { createViewportBottomAnchorSelectors } from './features/ui/viewport-bottom-anchor-selectors';
import { createInventoryTypeFilterMeta } from './features/gacha/inventory-type-filter-meta';
import { createInventorySortOptions } from './features/gacha/inventory-sort-options';
import { createGlobalInteractionDefaultSectionMeta } from './features/table/global-interaction-default-section-meta';
import { createFixedModeAnchorPriority } from './features/ui/fixed-mode-anchor-priority';
import { createCustomTableNameIconDashboardModuleContexts } from './features/table/custom-table-name-icon-dashboard-module-contexts';
import { createSafeUpdateAttribute } from './features/ui/safe-update-attribute';
import { createCanWriteMvuPanel } from './features/mvu/can-write-mvu-panel';
import { createUpdateRuntimeDataCacheAfterCrud } from './features/table/update-runtime-data-cache-after-crud';
import { createUnwrapAdvancedPresetDocument } from './features/presets/unwrap-advanced-preset-document';
import { createSelectCrazyRollType } from './features/dice/select-crazy-roll-type';
import { createSaveSnapshot } from './features/table/save-snapshot';
import { createSaveGachaItemSettingsRecord } from './features/gacha/save-gacha-item-settings-record';
import { createSafeEncodeURIComponent } from './shared/safe-encode-uri-component';
import { createSafeDecodeURIComponent } from './shared/safe-decode-uri-component';
import { createRgbToAvatarHex } from './features/avatars/rgb-to-avatar-hex';
import { createResolveExistingTableName } from './features/table/resolve-existing-table-name';
import { createResolveCustomTableNameIconManagerDirectSection } from './features/table/resolve-custom-table-name-icon-manager-direct-section';
import { createReplaceUserPlaceholders } from './features/dice/replace-user-placeholders';
import { createRenderGlobalInteractionMapMark } from './features/table/render-global-interaction-map-mark';
import { createRenderGlobalInteractionGenericMark } from './features/table/render-global-interaction-generic-mark';
import { createPushModal } from './features/ui/push-modal';
import { createPatchCrudSheetInRecord } from './features/table/patch-crud-sheet-in-record';
import { createOpenLegacyDatabaseSettings } from './features/table/open-legacy-database-settings';
import { createNormalizeLeadingCheckSuggestionSideShorthand } from './features/dice/normalize-leading-check-suggestion-side-shorthand';
import { createNormalizeFloatingCollapsePosition } from './features/ui/normalize-floating-collapse-position';
import { createNormalizeDiceConfigBackupSelectedModuleIds } from './features/dice/normalize-dice-config-backup-selected-module-ids';
import { createNormalizeAttributeQuickSelectConfig } from './features/dice/normalize-attribute-quick-select-config';
import { createNormalizeAttributeName } from './shared/normalize-attribute-name';
import { createIsLikelyGlobalInteractionNameHeader } from './features/table/is-likely-global-interaction-name-header';
import { createIsGachaItemOwned } from './features/gacha/is-gacha-item-owned';
import { createIsDatabaseManualUpdateActionButton } from './features/table/is-database-manual-update-action-button';
import { createHashGachaSeed } from './features/gacha/hash-gacha-seed';
import { createHashGachaCatalogSeed } from './features/gacha/hash-gacha-catalog-seed';
import { createHasDiceConfigBackupLocalImageReference } from './features/dice/has-dice-config-backup-local-image-reference';
import { createGetPanelDragStartHeight } from './features/ui/get-panel-drag-start-height';
import { createGetNamedCheckParamText } from './features/dice/get-named-check-param-text';
import { createGetLocationEmoji } from './features/table/get-location-emoji';
import { createGetLegacyInventoryMetadataRoot } from './features/gacha/get-legacy-inventory-metadata-root';
import { createGetInventoryDefaultMetaRecord } from './features/gacha/get-inventory-default-meta-record';
import { createGetGlobalInteractionAvatarLookupNames } from './features/table/get-global-interaction-avatar-lookup-names';
import { createGetGachaCatalogImportFailureMessage } from './features/gacha/get-gacha-catalog-import-failure-message';
import { createGetDiffRowDisplayTitle } from './features/table/get-diff-row-display-title';
import { createGetCrudSqlCommentAliases } from './features/table/get-crud-sql-comment-aliases';
import { createGetCrudColumnNameForHeader } from './features/table/get-crud-column-name-for-header';
import { createGetCheckSuggestionOutcomeResultType } from './features/dice/get-check-suggestion-outcome-result-type';
import { createGetBadgeStyle } from './features/table/get-badge-style';
import { createGetAttributeRangeBounds } from './features/dice/get-attribute-range-bounds';
import { createGetActivePanelHeightKey } from './features/ui/get-active-panel-height-key';
import { createGetAccessibleDocument } from './features/ui/get-accessible-document';
import { createFormatCssImageUrl } from './shared/format-css-image-url';
import { createFindGachaDefinitionByItemId } from './features/gacha/find-gacha-definition-by-item-id';
import { createDownloadDiceProfileTavernRegex } from './features/dice/download-dice-profile-tavern-regex';
import { createDefineAcuDiceOnWindow } from './features/api/define-acu-dice-on-window';
import { createDecodeCrudSqlIdentifier } from './features/table/decode-crud-sql-identifier';
import { createCreateAdvancedPresetRollResult } from './features/presets/create-advanced-preset-roll-result';
import { createCollectHostAndLocalNodes } from './features/ui/collect-host-and-local-nodes';
import { createClearAllPanelStates } from './features/ui/clear-all-panel-states';
import { createAssertGachaRewardNameColumn } from './features/gacha/assert-gacha-reward-name-column';
import { createAssertAppendOnlyRows } from './features/table/assert-append-only-rows';
import { createApplyStoredPanelHeight } from './features/ui/apply-stored-panel-height';
import { createAcuDiceEventsInstance } from './features/api/acu-dice-events-instance';
import { createAcuDiceCharactersInstance } from './features/api/acu-dice-characters-instance';
import { createCustomTableNameIconManagerDirectModuleBySection } from './features/table/custom-table-name-icon-manager-direct-module-by-section';
import { createCustomTableNameIconDeniedModules } from './features/table/custom-table-name-icon-denied-modules';
import { createActionButtons } from './features/table/action-buttons';
import { createCollectDiceConfigBackupGachaCatalogRecords } from './features/dice/collect-dice-config-backup-gacha-catalog-records';
import { createCloneAdvancedPresetFieldWithDefaults } from './features/presets/clone-advanced-preset-field-with-defaults';
import { createCapturePendingHumanInputSnapshot } from './features/human-input/capture-pending-human-input-snapshot';
import { createBindTutorialButtonsIn } from './features/tutorial/bind-tutorial-buttons-in';
import { createInventoryQualityFilterMeta } from './features/gacha/inventory-quality-filter-meta';
import { createCustomTableNameIconAllowedPanelSections } from './features/table/custom-table-name-icon-allowed-panel-sections';
import { createAcuDatabaseNewUiApiMethods } from './features/table/acu-database-new-ui-api-methods';
import { createTouchGachaActivity } from './features/gacha/touch-gacha-activity';
import { createThrowAdvancedPresetValidationIssues } from './features/presets/throw-advanced-preset-validation-issues';
import { createSetInventoryRowBasicFields } from './features/gacha/set-inventory-row-basic-fields';
import { createSetDiceProfilePromptState } from './features/dice/set-dice-profile-prompt-state';
import { createSetActiveTableNavButton } from './features/table/set-active-table-nav-button';
import { createSerializeAcuDiceGachaPool } from './features/api/serialize-acu-dice-gacha-pool';
import { createSerializeAcuDiceGachaDrawResult } from './features/api/serialize-acu-dice-gacha-draw-result';
import { createScheduleFloatingCollapseBoundsRefresh } from './features/ui/schedule-floating-collapse-bounds-refresh';
import { createSavePanelRequestedHeight } from './features/ui/save-panel-requested-height';
import { createSaveInventoryMetadataRecord } from './features/gacha/save-inventory-metadata-record';
import { createResolveDashboardCustomTableNameIconContextInfo } from './features/dashboard/resolve-dashboard-custom-table-name-icon-context-info';
import { createResetPanelRequestedHeight } from './features/ui/reset-panel-requested-height';
import { createPushDiceQuickSelectCharacter } from './features/dice/push-dice-quick-select-character';
import { createPopModal } from './features/ui/pop-modal';
import { createParseSqlQuotedValues } from './shared/parse-sql-quoted-values';
import { createParseImageUrl } from './shared/parse-image-url';
import { createParseCheckSuggestionModifierValue } from './features/dice/parse-check-suggestion-modifier-value';
import { createOpenDatabaseInterface } from './features/table/open-database-interface';
import { createGetViewportAnchorRect } from './features/ui/get-viewport-anchor-rect';
import { createGetGachaSettingsFilterLabel } from './features/gacha/get-gacha-settings-filter-label';
import { createGetCustomTableNameIconManagerInvalidSourceText } from './features/table/get-custom-table-name-icon-manager-invalid-source-text';
import { createGetAttributeRulePresetById } from './features/dice/get-attribute-rule-preset-by-id';
import { createGenerateAttributeValue } from './features/dice/generate-attribute-value';
import { createFindSillyTavernSlashRunner } from './features/table/find-silly-tavern-slash-runner';
import { createFindRelationGraphColumnIndex } from './features/table/find-relation-graph-column-index';
import { createCreateBuiltinRenderPreset } from './features/presets/create-builtin-render-preset';
import { createCreateBuiltinDashboardPreset } from './features/presets/create-builtin-dashboard-preset';
import { createCoerceAdvancedPresetContextNumber } from './features/presets/coerce-advanced-preset-context-number';
import { createAssignAdvancedPresetContextNumber } from './features/presets/assign-advanced-preset-context-number';
import { createSettingsGroupTutorialMap } from './features/tutorial/settings-group-tutorial-map';
import { createGachaSettingsSortOptions } from './features/gacha/gacha-settings-sort-options';
import { createGachaCommonWrittenTargetColumnKeys } from './features/gacha/gacha-common-written-target-column-keys';
import { createDashboardModuleSectionKind } from './features/dashboard/dashboard-module-section-kind';
import { createAssertRuntimeCrudApi } from './features/table/assert-runtime-crud-api';
import { createViewportBottomRefreshEvents } from './features/ui/viewport-bottom-refresh-events';
import { createGachaTargetColumnLabels } from './features/gacha/gacha-target-column-labels';
import { createGachaTargetColumnKeys } from './features/gacha/gacha-target-column-keys';
import { createDiceConfigBackupActiveKeyToPresetKey } from './features/dice/dice-config-backup-active-key-to-preset-key';
import { createWeightedRandomSelect } from './shared/weighted-random-select';
import { createUpdateGachaPoolTag } from './features/gacha/update-gacha-pool-tag';
import { createToDiceProfileSummary } from './features/dice/to-dice-profile-summary';
import { createScheduleViewportBoundsRefresh } from './features/ui/schedule-viewport-bounds-refresh';
import { createScheduleFixedWrapperBoundsRefresh } from './features/ui/schedule-fixed-wrapper-bounds-refresh';
import { createSaveDiceConfig } from './features/dice/save-dice-config';
import { createResolveCheckSuggestionDefaultValue } from './features/dice/resolve-check-suggestion-default-value';
import { createRenderThemeIconContent } from './features/ui/render-theme-icon-content';
import { createRefreshNameAliasesForCheckSuggestion } from './features/dice/refresh-name-aliases-for-check-suggestion';
import { createReadStoredTextareaDiceText } from './features/dice/read-stored-textarea-dice-text';
import { createReadStoredLatestDiceText } from './features/dice/read-stored-latest-dice-text';
import { createParseRenderPresetAttributes } from './features/presets/parse-render-preset-attributes';
import { createParseCheckSuggestionTieRule } from './features/dice/parse-check-suggestion-tie-rule';
import { createNormalizeRenderPresetAliasMap } from './features/presets/normalize-render-preset-alias-map';
import { createNormalizeDiceProfileModuleIds } from './features/dice/normalize-dice-profile-module-ids';
import { createNormalizeDashboardKeywordArray } from './features/dashboard/normalize-dashboard-keyword-array';
import { createIsUserCharacterName } from './features/characters/is-user-character-name';
import { createIsPureIndexCell } from './features/table/is-pure-index-cell';
import { createHasDiceConfigBackupRecoverableStorage } from './features/dice/has-dice-config-backup-recoverable-storage';
import { createGetRuntimeErrorMessage } from './features/table/get-runtime-error-message';
import { createGetRuntimeErrorLogPayload } from './features/table/get-runtime-error-log-payload';
import { createGetRenderPresetBadgeStyle } from './features/presets/get-render-preset-badge-style';
import { createGetMatchedGlobalInteractionRuleKeywords } from './features/table/get-matched-global-interaction-rule-keywords';
import { createGetGachaNamedCustomField } from './features/gacha/get-gacha-named-custom-field';
import { createGetDiceProfileRecords } from './features/dice/get-dice-profile-records';
import { createGetDiceConfigBackupModuleCountText } from './features/dice/get-dice-config-backup-module-count-text';
import { createGetDiceConfigBackupAvailableModuleIds } from './features/dice/get-dice-config-backup-available-module-ids';
import { createGetAttributeEntryForCharacter } from './features/dice/get-attribute-entry-for-character';
import { createGenerateUniqueName } from './shared/generate-unique-name';
import { createFormatGachaRelativeTime } from './features/gacha/format-gacha-relative-time';
import { createFindLatestDbMessageIndex } from './features/table/find-latest-db-message-index';
import { createFindGachaTargetColumnIndex } from './features/gacha/find-gacha-target-column-index';
import { createFindDashboardNpcNameColumnIndex } from './features/dashboard/find-dashboard-npc-name-column-index';
import { createFindAttributeColumnIndices } from './features/dice/find-attribute-column-indices';
import { createDeleteGachaItemSetting } from './features/gacha/delete-gacha-item-setting';
import { createWithGachaItemSettings } from './features/gacha/with-gacha-item-settings';
import { createWaitForDatabaseManualUpdateSurface } from './features/table/wait-for-database-manual-update-surface';
import { createToggleTableReverse } from './features/table/toggle-table-reverse';
import { createSetDiffDataCell } from './features/table/set-diff-data-cell';
import { createSetAllTablesReverse } from './features/table/set-all-tables-reverse';
import { createScheduleViewportInputTargetRefresh } from './features/ui/schedule-viewport-input-target-refresh';
import { createScheduleFixedAnchorTargetRefresh } from './features/ui/schedule-fixed-anchor-target-refresh';
import { createRefreshDiceProfileIndex } from './features/dice/refresh-dice-profile-index';
import { createReadRuntimeTableData } from './features/table/read-runtime-table-data';
import { createPickFallbackAttributeColumn } from './features/dice/pick-fallback-attribute-column';
import { createPatchCrudRowIdIfMissing } from './features/table/patch-crud-row-id-if-missing';
import { createParseAdvancedPresetSourceText } from './features/presets/parse-advanced-preset-source-text';
import { createNormalizeDiceConfigBackupGachaPoolSettings } from './features/dice/normalize-dice-config-backup-gacha-pool-settings';
import { createLoadSnapshot } from './features/table/load-snapshot';
import { createLoadAvatarImageForColor } from './features/avatars/load-avatar-image-for-color';
import { createIsNumericCell } from './shared/is-numeric-cell';
import { createIsNpcLikeTableName } from './features/table/is-npc-like-table-name';
import { createImportDiceProfile } from './features/dice/import-dice-profile';
import { createHasGachaRewardTableForItem } from './features/gacha/has-gacha-reward-table-for-item';
import { createGetPanelHostMessage } from './features/ui/get-panel-host-message';
import { createGetNavigationFontMetrics } from './features/ui/get-navigation-font-metrics';
import { createGetGachaChatIdSeed } from './features/gacha/get-gacha-chat-id-seed';
import { createGetGachaCatalogItemsForExport } from './features/gacha/get-gacha-catalog-items-for-export';
import { createGetEmojiCandidates } from './features/table/get-emoji-candidates';
import { createGetDiceConfigBackupValueIdentity } from './features/dice/get-dice-config-backup-value-identity';
import { createGetDiceConfigBackupRestoreWarnings } from './features/dice/get-dice-config-backup-restore-warnings';
import { createGetAdvancedPresetMappedTarget } from './features/presets/get-advanced-preset-mapped-target';
import { createCreateDiffRowMatcher } from './features/table/create-diff-row-matcher';
import { createCloseGachaVisualization } from './features/gacha/close-gacha-visualization';
import { createBuildTableTemplateRequirementPresetAgentPromptFilename } from './features/presets/build-table-template-requirement-preset-agent-prompt-filename';
import { createBuildRenderPresetAgentPromptFilename } from './features/presets/build-render-preset-agent-prompt-filename';
import { createBuildGachaInventoryMetaRecord } from './features/gacha/build-gacha-inventory-meta-record';
import { createBuildGachaCatalogAgentPromptFilename } from './features/presets/build-gacha-catalog-agent-prompt-filename';
import { createBuildDashboardPresetAgentPromptFilename } from './features/presets/build-dashboard-preset-agent-prompt-filename';
import { createBuildAdvancedPresetAgentPromptFilename } from './features/presets/build-advanced-preset-agent-prompt-filename';
import { createBuildActionPresetAgentPromptFilename } from './features/presets/build-action-preset-agent-prompt-filename';
import { createStoreTextareaDiceCache } from './features/chat/store-textarea-dice-cache';
import { createShowDatabaseManualUpdateFailure } from './features/table/show-database-manual-update-failure';
import { createSetupFloatingCollapseBoundsListeners } from './features/ui/setup-floating-collapse-bounds-listeners';
import { createSetEquipmentRowBasicFields } from './features/gacha/set-equipment-row-basic-fields';
import { createRestoreDiceResultBeforeSend } from './features/chat/restore-dice-result-before-send';
import { createResolveGlobalInteractionSectionMeta } from './features/interactions/resolve-global-interaction-section-meta';
import { createResolveCustomTableNameIconAssetUrl } from './features/table/resolve-custom-table-name-icon-asset-url';
import { createRefreshGachaPoolSelectionUi } from './features/gacha/refresh-gacha-pool-selection-ui';
import { createMergeImportedGachaPools } from './features/gacha/merge-imported-gacha-pools';
import { createGetInventoryMetadataRoot } from './features/dice/get-inventory-metadata-root';
import { createGetInventoryDetailContext } from './features/dice/get-inventory-detail-context';
import { createGetFloatingViewportBounds } from './features/ui/get-floating-viewport-bounds';
import { createGetCurrentContextFingerprint } from './features/chat/get-current-context-fingerprint';
import { createGetAvatarLookupNames } from './features/avatars/get-avatar-lookup-names';
import { createExportGachaCatalogJson } from './features/gacha/export-gacha-catalog-json';
import { createDownloadGachaCatalogJson } from './features/gacha/download-gacha-catalog-json';
import { createCompareVersion } from './shared/compare-version';
import { createClearFixedWrapperBoundsListeners } from './features/ui/clear-fixed-wrapper-bounds-listeners';
import { createGlobalInteractionNonNameHeaderKeywords } from './features/interactions/global-interaction-non-name-header-keywords';
import { createSetupViewportInputMutationObserver } from './features/ui/setup-viewport-input-mutation-observer';
import { createSetupFixedAnchorMutationObserver } from './features/ui/setup-fixed-anchor-mutation-observer';
import { createRestoreDiceConfigBackupGachaCatalogSnapshot } from './features/dice/restore-dice-config-backup-gacha-catalog-snapshot';
import { createResolveCheckSuggestionNumberParam } from './features/checks/resolve-check-suggestion-number-param';
import { createProcessTemplate } from './shared/process-template';
import { createNormalizeImportedGachaPoolTags } from './features/gacha/normalize-imported-gacha-pool-tags';
import { createNormalizeDiceConfigBackupGachaItemSettings } from './features/dice/normalize-dice-config-backup-gacha-item-settings';
import { createNormalizeCustomTableNameIconPackEntryMetadata } from './features/table/normalize-custom-table-name-icon-pack-entry-metadata';
import { createGetTableData } from './features/table/get-table-data';
import { createGetSheetKeyByTableName } from './features/table/get-sheet-key-by-table-name';
import { createGetDiceConfigBackupStoredValue } from './features/dice/get-dice-config-backup-stored-value';
import { createEnsureGachaCatalogLoaded } from './features/gacha/ensure-gacha-catalog-loaded';
import { createCreateDiceProfilePreApplySnapshot } from './features/dice/create-dice-profile-pre-apply-snapshot';
import { createCreateCustomTableNameIconContext } from './features/table/create-custom-table-name-icon-context';
import { createAcuDiceContest } from './features/api/acu-dice-contest';
import { createDefaultDialogueIndentTagBlacklist } from './shared/default-dialogue-indent-tag-blacklist';
import { createValidateGachaCustomFieldsForExistingRow } from './features/gacha/validate-gacha-custom-fields-for-existing-row';
import { createSyncCheckRuleTagsInTemplate } from './features/presets/sync-check-rule-tags-in-template';
import { createSaveStoredGachaCatalog } from './features/gacha/save-stored-gacha-catalog';
import { createRenderGlobalInteractionAvatar } from './features/interactions/render-global-interaction-avatar';
import { createRenderCustomTableNameIconContent } from './features/table/render-custom-table-name-icon-content';
import { createRefreshGachaVisualization } from './features/gacha/refresh-gacha-visualization';
import { createRefreshFixedAnchorResizeObserver } from './features/ui/refresh-fixed-anchor-resize-observer';
import { createOpenLegacyDatabaseVisualizer } from './features/table/open-legacy-database-visualizer';
import { createNormalizeCustomTableNameIconPackEntry } from './features/table/normalize-custom-table-name-icon-pack-entry';
import { createGetTemplateInspectionSheets } from './features/table/get-template-inspection-sheets';
import { createGetGachaDiceEventDetail } from './features/gacha/get-gacha-dice-event-detail';
import { createGetDiceConfigBackupTableTemplateRollbackSnapshot } from './features/dice/get-dice-config-backup-table-template-rollback-snapshot';
import { createGetDashboardNpcListData } from './features/dashboard/get-dashboard-npc-list-data';
import { createGetCustomTableNameIconManagerContextLabel } from './features/table/get-custom-table-name-icon-manager-context-label';
import { createFindRelationshipGraphSourceTables } from './features/dashboard/find-relationship-graph-source-tables';
import { createClosePanel } from './features/ui/close-panel';
import { createClearViewportInputTargetListeners } from './features/ui/clear-viewport-input-target-listeners';
import { createClearDiceLocalCacheData } from './features/dice/clear-dice-local-cache-data';
import { createBuildCrudRequiredHeaderSet } from './features/table/build-crud-required-header-set';
import { createWaitForDatabaseNewUiManualUpdateButton } from './features/table/wait-for-database-new-ui-manual-update-button';
import { createSettleGachaFortuneForDiceEvent } from './features/gacha/settle-gacha-fortune-for-dice-event';
import { createSetInventoryMetadataForItem } from './features/dice/set-inventory-metadata-for-item';
import { createSaveGachaPoolSettings } from './features/gacha/save-gacha-pool-settings';
import { createRunMaybeAsyncDatabaseManualUpdate } from './features/table/run-maybe-async-database-manual-update';
import { createRestoreGachaLocalStorageSnapshot } from './features/gacha/restore-gacha-local-storage-snapshot';
import { createRenderInventoryMetadataHtml } from './features/dice/render-inventory-metadata-html';
import { createRefreshInventoryVisualization } from './features/dice/refresh-inventory-visualization';
import { createPersistRawDataWithGacha } from './features/gacha/persist-raw-data-with-gacha';
import { createDeleteRowInstantly } from './features/table/delete-row-instantly';
import { createBuildCheckSuggestionSideParams } from './features/checks/build-check-suggestion-side-params';
import { createApplyGachaTargetColumnOverrides } from './features/gacha/apply-gacha-target-column-overrides';
import { createApplyGachaCustomFieldsToRow } from './features/gacha/apply-gacha-custom-fields-to-row';
import { createSyncTextareaDiceCacheFromVisibleText } from './features/chat/sync-textarea-dice-cache-from-visible-text';
import { createStripLoneSurrogates } from './shared/strip-lone-surrogates';
import { createRunDatabaseManualUpdateViaNewUiButton } from './features/table/run-database-manual-update-via-new-ui-button';
import { createResolveGachaTargetTableOverride } from './features/gacha/resolve-gacha-target-table-override';
import { createResolveEquipmentTableTypeForGachaItem } from './features/gacha/resolve-equipment-table-type-for-gacha-item';
import { createRenderInventoryFilterButtons } from './features/dice/render-inventory-filter-buttons';
import { createPickGachaItemDefinition } from './features/gacha/pick-gacha-item-definition';
import { createParseDiceProfileInput } from './features/dice/parse-dice-profile-input';
import { createIsDashboardRoleInSceneValue } from './features/dashboard/is-dashboard-role-in-scene-value';
import { createGetOptionItemsFromTable } from './features/table/get-option-items-from-table';
import { createGetEquipmentColumnMap } from './features/gacha/get-equipment-column-map';
import { createGetDiffRowIdentityKeys } from './features/table/get-diff-row-identity-keys';
import { createGetDiceConfigBackupModuleResourceCount } from './features/dice/get-dice-config-backup-module-resource-count';
import { createGetDiceConfigBackupKnownPresetIds } from './features/dice/get-dice-config-backup-known-preset-ids';
import { createFindDeletionIndicesForCrud } from './features/table/find-deletion-indices-for-crud';
import { createFindComposerSendButton } from './features/chat/find-composer-send-button';
import { createCreateGlobalInteractionCustomTableNameIconContext } from './features/interactions/create-global-interaction-custom-table-name-icon-context';
import { createCollectCurrentChatAvatarNodes } from './features/avatars/collect-current-chat-avatar-nodes';
import { createBuildCrudLengthConstraintMap } from './features/table/build-crud-length-constraint-map';
import { createBindGachaShardShopInteractions } from './features/gacha/bind-gacha-shard-shop-interactions';
import { createAddClearButton } from './features/ui/add-clear-button';
import { createThemes } from './features/ui/themes';
import { createUpdateSingleAttribute } from './features/table/update-single-attribute';
import { createUpdateGachaPoolConfig } from './features/gacha/update-gacha-pool-config';
import { createSaveCurrentDiceProfile } from './features/dice/save-current-dice-profile';
import { createResolveCheckSuggestionFieldValue } from './features/checks/resolve-check-suggestion-field-value';
import { createRefreshViewportInputTargetListeners } from './features/ui/refresh-viewport-input-target-listeners';
import { createPatchCrudSheetInMessage } from './features/table/patch-crud-sheet-in-message';
import { createNormalizeGachaPoolDefinition } from './features/gacha/normalize-gacha-pool-definition';
import { createNormalizeDiceProfileRecord } from './features/dice/normalize-dice-profile-record';
import { createExtractAdvancedPresetJsonCandidates } from './features/presets/extract-advanced-preset-json-candidates';
import { createClampFloatingCollapsePosition } from './features/ui/clamp-floating-collapse-position';
import { createAssertCrudRequiredCellValues } from './features/table/assert-crud-required-cell-values';
import { createGlobalInteractionNameHeaders } from './features/interactions/global-interaction-name-headers';
import { createValidateJsoncEditorConfig } from './features/presets/validate-jsonc-editor-config';
import { createShowTemplateInspectionModal } from './features/table/show-template-inspection-modal';
import { createSanitizeDiceConfigBackupValidationRule } from './features/dice/sanitize-dice-config-backup-validation-rule';
import { createSanitizeDiceConfigBackupCustomOnlyPresetArrayForExport } from './features/dice/sanitize-dice-config-backup-custom-only-preset-array-for-export';
import { createReplaceCheckSuggestionConditionVars } from './features/checks/replace-check-suggestion-condition-vars';
import { createParseAdvancedPresetText } from './features/presets/parse-advanced-preset-text';
import { createOpenDatabaseFormFillPage } from './features/table/open-database-form-fill-page';
import { createMergeDiceConfigBackupGachaItemSettings } from './features/dice/merge-dice-config-backup-gacha-item-settings';
import { createImportGachaCatalogJsonFromFile } from './features/gacha/import-gacha-catalog-json-from-file';
import { createGetInventoryEnumOptions } from './features/dice/get-inventory-enum-options';
import { createGetInventoryColumnMap } from './features/gacha/get-inventory-column-map';
import { createGetGachaPickupItems } from './features/gacha/get-gacha-pickup-items';
import { createGetCrudRequiredColumnsByHeaderIndex } from './features/table/get-crud-required-columns-by-header-index';
import { createGetConfiguredGachaPoolDefinitions } from './features/gacha/get-configured-gacha-pool-definitions';
import { createCreateGlobalInteractionSections } from './features/interactions/create-global-interaction-sections';
import { createCloneDashboardConfig } from './features/dashboard/clone-dashboard-config';
import { createClearViewportBoundsListeners } from './features/ui/clear-viewport-bounds-listeners';
import { createBuildRowDataForCrud } from './features/table/build-row-data-for-crud';
import { createMergeDiceConfigBackupValidationRules } from './features/dice/merge-dice-config-backup-validation-rules';
import { createMaybePromptCharacterDiceProfile } from './features/dice/maybe-prompt-character-dice-profile';
import { createGetRuntimeWindowCandidates } from './features/ui/get-runtime-window-candidates';
import { createAssertCrudRequiredColumnsRepresented } from './features/table/assert-crud-required-columns-represented';
import { createApplyDiceProfile } from './features/dice/apply-dice-profile';
import { createTakeDiffRowMatch } from './features/table/take-diff-row-match';
import { createShowInventoryVisualization } from './features/dice/show-inventory-visualization';
import { createSendTextViaComposer } from './features/chat/send-text-via-composer';
import { createRenderInterface } from './features/ui/render-interface';
import { createRenderGlobalInteractionsSection } from './features/interactions/render-global-interactions-section';
import { createRenderGachaSettingsPoolTabsHtml } from './features/gacha/render-gacha-settings-pool-tabs-html';
import { createRemapDiceConfigBackupGachaItemSettings } from './features/dice/remap-dice-config-backup-gacha-item-settings';
import { createGetPersonaName } from './features/avatars/get-persona-name';
import { createGetInventoryCharacters } from './features/dice/get-inventory-characters';
import { createGetIconForTableName } from './features/table/get-icon-for-table-name';
import { createGetGachaItemDefinitionFingerprint } from './features/gacha/get-gacha-item-definition-fingerprint';
import { createGetActionsForTable } from './features/actions/get-actions-for-table';
import { createFormatDiceConfigBackupPrivacyDetail } from './features/dice/format-dice-config-backup-privacy-detail';
import { createClearFloatingCollapseBoundsListeners } from './features/ui/clear-floating-collapse-bounds-listeners';
import { createSyncHostRegenerateButtonVisibility } from './features/ui/sync-host-regenerate-button-visibility';
import { createRenderDiceHistoryStatsHtml } from './features/dice/render-dice-history-stats-html';
import { createGetGachaPoolDefinitionsWithVirtualTags } from './features/gacha/get-gacha-pool-definitions-with-virtual-tags';
import { createGetCheckSuggestionItemsFromTable } from './features/checks/get-check-suggestion-items-from-table';
import { createDetectCharacterDiceProfile } from './features/dice/detect-character-dice-profile';
import { createCreateCustomTableNameIconManagerCandidate } from './features/table/create-custom-table-name-icon-manager-candidate';
import { createComposeTextareaTextWithHiddenDice } from './features/chat/compose-textarea-text-with-hidden-dice';
import { createBuildCrudEnumConstraintMap } from './features/table/build-crud-enum-constraint-map';
import { createUpsertDiceProfileRecord } from './features/dice/upsert-dice-profile-record';
import { createUpdateSaveButtonState } from './features/table/update-save-button-state';
import { createRunDatabaseManualUpdate } from './features/table/run-database-manual-update';
import { createResolveGlobalInteractionRowTitle } from './features/interactions/resolve-global-interaction-row-title';
import { createRenderInlineQuickCheckButton } from './features/checks/render-inline-quick-check-button';
import { createRemoveAcuDiceGachaCustomPool } from './features/gacha/remove-acu-dice-gacha-custom-pool';
import { createRefreshDicePanelPresets } from './features/dice/refresh-dice-panel-presets';
import { createPrepareMvuTutorial } from './features/tutorial/prepare-mvu-tutorial';
import { createNormalizeRenderPresetTagFilterList } from './features/presets/normalize-render-preset-tag-filter-list';
import { createGetStoredGachaItemSettings } from './features/gacha/get-stored-gacha-item-settings';
import { createGetGachaItemCustomTableNameIconContext } from './features/gacha/get-gacha-item-custom-table-name-icon-context';
import { createGetFullAttributesForCharacter } from './features/table/get-full-attributes-for-character';
import { createGetCrudUnsupportedFallbackConstraintText } from './features/table/get-crud-unsupported-fallback-constraint-text';
import { createRefreshAutoImageColorForAvatar } from './features/avatars/refresh-auto-image-color-for-avatar';
import { createProcessJsonData } from './features/dice/process-json-data';
import { createNormalizeDiceConfigBackupGachaCatalogResourceRecord } from './features/dice/normalize-dice-config-backup-gacha-catalog-resource-record';
import { createImportAcuDiceGachaCatalog } from './features/gacha/import-acu-dice-gacha-catalog';
import { createGetUserAvatarUrl } from './features/avatars/get-user-avatar-url';
import { createGetCore } from './shared/get-core';
import { createUpdateChangesCount } from './features/validation/update-changes-count';
import { createSerializeGachaCatalogItemForExport } from './features/gacha/serialize-gacha-catalog-item-for-export';
import { createRenderGachaSettingsPoolViewerHtml } from './features/gacha/render-gacha-settings-pool-viewer-html';
import { createIsCustomTableNameIconContextAllowed } from './features/table/is-custom-table-name-icon-context-allowed';
import { createHslToAvatarHex } from './features/avatars/hsl-to-avatar-hex';
import { createClearGlobalGachaCatalog } from './features/gacha/clear-global-gacha-catalog';
import { createBuildGachaDiceEventSettlementKey } from './features/gacha/build-gacha-dice-event-settlement-key';
import { createSetupViewportBoundsListeners } from './features/ui/setup-viewport-bounds-listeners';
import { createSettleGachaFortuneForMessage } from './features/gacha/settle-gacha-fortune-for-message';
import { createRestoreDiceConfigBackupTableTemplateRollbackSnapshot } from './features/dice/restore-dice-config-backup-table-template-rollback-snapshot';
import { createPrepareSettingsGroupTutorial } from './features/tutorial/prepare-settings-group-tutorial';
import { createClearDiceSystemCache } from './features/dice/clear-dice-system-cache';
import { createBindHumanInputTracking } from './features/chat/bind-human-input-tracking';
import { createValidateAdvancedPresetAgentTests } from './features/presets/validate-advanced-preset-agent-tests';
import { createSetupFixedWrapperBoundsListeners } from './features/ui/setup-fixed-wrapper-bounds-listeners';
import { createPickGachaRarity } from './features/gacha/pick-gacha-rarity';
import { createNormalizeCustomTableNameIconEntry } from './features/table/normalize-custom-table-name-icon-entry';
import { createMergeDiceConfigBackupCustomRules } from './features/dice/merge-dice-config-backup-custom-rules';
import { createHydrateGlobalInteractionAvatars } from './features/interactions/hydrate-global-interaction-avatars';
import { createCollectDiceProfileRegexScriptsFromRecord } from './features/dice/collect-dice-profile-regex-scripts-from-record';
import { createBuildGachaTableResultFromSheet } from './features/gacha/build-gacha-table-result-from-sheet';
import { createAddStyles } from './shared/add-styles';
import { createSetupOverlayClose } from './shared/setup-overlay-close';
import { createRestoreDiceConfigBackupModuleResources } from './features/dice/restore-dice-config-backup-module-resources';
import { createRenderGachaPickupHtml } from './features/gacha/render-gacha-pickup-html';
import { createPrepareAvatarManagerTutorial } from './features/tutorial/prepare-avatar-manager-tutorial';
import { createNormalizeCheckSuggestionCommandInput } from './features/checks/normalize-check-suggestion-command-input';
import { createGetViewportBottomOffset } from './features/ui/get-viewport-bottom-offset';
import { createFormatOutputTemplate } from './features/dice/format-output-template';
import { createSaveSheetsViaJsonFloorWithoutTracking } from './features/table/save-sheets-via-json-floor-without-tracking';
import { createRenderGlobalInteractionRowCard } from './features/interactions/render-global-interaction-row-card';
import { createParseAttributeString } from './features/dice/parse-attribute-string';
import { createMergeDiceConfigBackupGachaPoolSettings } from './features/dice/merge-dice-config-backup-gacha-pool-settings';
import { createAssertCrudLengthConstraints } from './features/table/assert-crud-length-constraints';
import { createAssertCrudEnumConstraints } from './features/table/assert-crud-enum-constraints';
import { createSaveCurrentTabState } from './features/ui/save-current-tab-state';
import { createRemoveAcuDiceGachaCustomItem } from './features/gacha/remove-acu-dice-gacha-custom-item';
import { createFlushGachaHeartbeatProgress } from './features/gacha/flush-gacha-heartbeat-progress';
import { createEvaluateOutcomes } from './features/presets/evaluate-outcomes';
import { createCloneDashboardPresetModules } from './features/dashboard/clone-dashboard-preset-modules';
import { createBuildCheckValueText } from './features/checks/build-check-value-text';
import { createApplyAdvancedPresetOutcomePolicy } from './features/presets/apply-advanced-preset-outcome-policy';
import { createValidateAdvancedPresetTemplates } from './features/presets/validate-advanced-preset-templates';
import { createSelectCrazyAttribute } from './features/presets/select-crazy-attribute';
import { createRestoreDiceConfigBackupTableTemplate } from './features/dice/restore-dice-config-backup-table-template';
import { createResolveBatchLocationEmojis } from './features/table/resolve-batch-location-emojis';
import { createRenderGachaCustomFieldsDetailsHtml } from './features/gacha/render-gacha-custom-fields-details-html';
import { createNormalizeCheckSuggestionParams } from './features/checks/normalize-check-suggestion-params';
import { createGetDiceConfigBackupModuleWarnings } from './features/dice/get-dice-config-backup-module-warnings';
import { createCreateDashboardPresetModulesFromConfig } from './features/dashboard/create-dashboard-preset-modules-from-config';
import { createConvertTavernRegexToRule } from './shared/convert-tavern-regex-to-rule';
import { createUpsertAcuDiceGachaPool } from './features/gacha/upsert-acu-dice-gacha-pool';
import { createRunDatabaseManualUpdateViaApi } from './features/table/run-database-manual-update-via-api';
import { createRenderGachaCustomFieldsPreviewHtml } from './features/gacha/render-gacha-custom-fields-preview-html';
import { createDefaultRenderPresetRules } from './features/presets/default-render-preset-rules';
import { createValidateAdvancedPresetFieldConfig } from './features/presets/validate-advanced-preset-field-config';
import { createRenderGachaFortuneProgressHtml } from './features/gacha/render-gacha-fortune-progress-html';
import { createRenderDiceConfigBackupRestoreBody } from './features/dice/render-dice-config-backup-restore-body';
import { createPickTextFile } from './shared/pick-text-file';
import { createNormalizeAdvancedPresetAgentTests } from './features/presets/normalize-advanced-preset-agent-tests';
import { createMigrateGachaCatalogRecordsToGlobalScope } from './features/gacha/migrate-gacha-catalog-records-to-global-scope';
import { createHydrateCustomTableNameIconsIn } from './features/table/hydrate-custom-table-name-icons-in';
import { createGetGachaChatMessageText } from './features/gacha/get-gacha-chat-message-text';
import { createClearGachaFortune } from './features/gacha/clear-gacha-fortune';
import { createBuildAutoCheckSuggestionGuide } from './features/presets/build-auto-check-suggestion-guide';
import { createDefaultQuickCheckExcludeKeywords } from './features/checks/default-quick-check-exclude-keywords';
import { createValidateAdvancedPresetDicePatches } from './features/presets/validate-advanced-preset-dice-patches';
import { createValidateAdvancedPreset } from './features/presets/validate-advanced-preset';
import { createShowEditDialog } from './features/ui/show-edit-dialog';
import { createPatchCrudSheetCellInMessage } from './features/table/patch-crud-sheet-cell-in-message';
import { createParseRelationshipString } from './features/table/parse-relationship-string';
import { createGetFixedModeAnchorRect } from './features/ui/get-fixed-mode-anchor-rect';
import { createCollectDashboardNpcEntriesFromRelationshipSources } from './features/dashboard/collect-dashboard-npc-entries-from-relationship-sources';
import { createBuildGlobalInteractionGroups } from './features/interactions/build-global-interaction-groups';
import { createGetGMConfig } from './features/actions/get-gm-config';
import { createBuildCustomTableNameIconPackEntry } from './features/table/build-custom-table-name-icon-pack-entry';
import { createAnalyzeGachaCatalogImport } from './features/gacha/analyze-gacha-catalog-import';
import { createSyncInventoryMetadataForRawData } from './features/table/sync-inventory-metadata-for-raw-data';
import { createSanitizeRuntimeTableData } from './features/table/sanitize-runtime-table-data';
import { createRenderDiceProfileSummaryRow } from './features/dice/render-dice-profile-summary-row';
import { createApplyJsonCellFallbackForCrud } from './features/table/apply-json-cell-fallback-for-crud';
import { createStripJsoncSyntax } from './shared/strip-jsonc-syntax';
import { createResolveUserGraphName } from './features/avatars/resolve-user-graph-name';
import { createGetCustomTableNameIconFallbackContexts } from './features/table/get-custom-table-name-icon-fallback-contexts';
import { createCopyTextWithTavernApi } from './shared/copy-text-with-tavern-api';
import { createBuildNewActionPresetRulesJsoncTemplate } from './features/presets/build-new-action-preset-rules-jsonc-template';
import { createValidateAdvancedPresetCustomFields } from './features/presets/validate-advanced-preset-custom-fields';
import { createReplaceRuleTagInTemplate } from './features/presets/replace-rule-tag-in-template';
import { createGenerateAttributeScale } from './features/presets/generate-attribute-scale';
import { createSwitchPanel } from './features/ui/switch-panel';
import { createRenderDiceConfigBackupModuleRows } from './features/dice/render-dice-config-backup-module-rows';
import { createGetDiceQuickSelectCharacterList } from './features/dice/get-dice-quick-select-character-list';
import { createValidateGachaCustomFieldsForTargetTable } from './features/gacha/validate-gacha-custom-fields-for-target-table';
import { createUpdateGachaFortuneProgressDom } from './features/gacha/update-gacha-fortune-progress-dom';
import { createStartTutorialFromButton } from './features/tutorial/start-tutorial-from-button';
import { createShowDiceCharacterProfilePrompt } from './features/dice/show-dice-character-profile-prompt';
import { createValidateGachaCatalogImportItemTarget } from './features/gacha/validate-gacha-catalog-import-item-target';
import { createRenderGachaSettingsFilterMenuHtml } from './features/gacha/render-gacha-settings-filter-menu-html';
import { createGetCharacterNameCandidates } from './features/avatars/get-character-name-candidates';
import { createApplyRuntimeDataViaCrud } from './features/table/apply-runtime-data-via-crud';
import { createApplyDiceConfigBackupActiveValue } from './features/dice/apply-dice-config-backup-active-value';
import { createInferAvatarImageColor } from './features/avatar/infer-avatar-image-color';
import { createShowPresetConflictDialog } from './features/presets/show-preset-conflict-dialog';
import { createBuildNewAttributePresetJsoncTemplate } from './features/presets/build-new-attribute-preset-jsonc-template';
import { createRenderDiceProfileApplyConfirmDetailHtml } from './features/dice/render-dice-profile-apply-confirm-detail-html';
import { createRenderGlobalInteractionsPanel } from './features/interactions/render-global-interactions-panel';
import { createApplyAsyncImageUrlToElement } from './features/avatar/apply-async-image-url-to-element';
import { createFindRowIndexByPrimaryKey } from './features/table/find-row-index-by-primary-key';
import { createNormalizeImportedGachaPools } from './features/gacha/normalize-imported-gacha-pools';
import { createNormalizeDiceConfigBackupGachaCatalogItems } from './features/dice/normalize-dice-config-backup-gacha-catalog-items';
import { createRenderGachaPoolSettingsListHtml } from './features/gacha/render-gacha-pool-settings-list-html';
import { createBuildRelationshipGraphTableFromPreset } from './features/table/build-relationship-graph-table-from-preset';
import { createResolveCustomTableNameIcon } from './features/table/resolve-custom-table-name-icon';
import { createCollectAccessibleRuntimeWindows } from './features/ui/collect-accessible-runtime-windows';
import { createMergeDiceConfigBackupGachaCatalogItems } from './features/dice/merge-dice-config-backup-gacha-catalog-items';
import { createBuildDiceConfigBackup } from './features/dice/build-dice-config-backup';
import { createNormalizeDashboardRelationshipGraphConfig } from './features/dashboard/normalize-dashboard-relationship-graph-config';
import { createGetDiceStatsContext } from './features/dice/get-dice-stats-context';
import { createAppendRowInstantly } from './features/table/append-row-instantly';
import { createGetGachaFortuneProgressView } from './features/gacha/get-gacha-fortune-progress-view';
import { createCollectDashboardNpcEntriesFromTableResult } from './features/dashboard/collect-dashboard-npc-entries-from-table-result';
import { createStripJsonComments } from './shared/strip-json-comments';
import { createFindCharacterAttributeRow } from './features/dice/find-character-attribute-row';
import { createPrepareCrudRowIdForUpdateCell } from './features/table/prepare-crud-row-id-for-update-cell';
import { createSyncDiceConfigBackupRuntimeAfterRestore } from './features/dice/sync-dice-config-backup-runtime-after-restore';
import { createUpdateFloatingCollapseBounds } from './features/layout/update-floating-collapse-bounds';
import { createChangeAcuDiceGachaFortune } from './features/gacha/change-acu-dice-gacha-fortune';
import { createCreateRenderPresetEditorTemplate } from './features/presets/create-render-preset-editor-template';
import { createCreateDashboardPresetEditorTemplate } from './features/dashboard/create-dashboard-preset-editor-template';
import { createBuildNewAdvancedPresetJsoncTemplate } from './features/presets/build-new-advanced-preset-jsonc-template';
import { createMergeDiceConfigBackupPresetArray } from './features/dice/merge-dice-config-backup-preset-array';
import { createValidateAdvancedPresetContestRule } from './features/presets/validate-advanced-preset-contest-rule';
import { createValidateAdvancedPresetOutcomePolicy } from './features/presets/validate-advanced-preset-outcome-policy';
import { createValidateAdvancedPresetOutcomes } from './features/presets/validate-advanced-preset-outcomes';
import { createBuildAdvancedPresetEvaluationContext } from './features/presets/build-advanced-preset-evaluation-context';
import { createNormalizeDashboardPresetFilters } from './features/dashboard/normalize-dashboard-preset-filters';
import { createGetDashboardRuntimeConfig } from './features/dashboard/get-dashboard-runtime-config';
import { createRestoreDiceConfigBackupGachaCatalogRecords } from './features/dice/restore-dice-config-backup-gacha-catalog-records';
import { createGetDiceConfigBackupModuleResourceShapeWarnings } from './features/dice/get-dice-config-backup-module-resource-shape-warnings';
import { createCountRuntimeDataChanges } from './features/table/count-runtime-data-changes';
import { createParseCheckSuggestionCommand } from './features/checks/parse-check-suggestion-command';
import { createExecuteCheckSuggestionCommand } from './features/checks/execute-check-suggestion-command';
import { createBuildCheckSuggestionPresetSide } from './features/checks/build-check-suggestion-preset-side';
import { createResolveCheckSuggestionContestWinner } from './features/checks/resolve-check-suggestion-contest-winner';
import { createExecuteAdvancedContestCheckSuggestion } from './features/checks/execute-advanced-contest-check-suggestion';
import { createShowDiceSystemInputDialog } from './features/ui/show-dice-system-input-dialog';
import { createShowCardEditModal } from './features/table/show-card-edit-modal';
import { createShowFavoriteEditModal } from './features/favorites/show-favorite-edit-modal';
import { createShowDiceSystemConfirmDialog } from './features/ui/show-dice-system-confirm-dialog';
import { createShowManualUpdateDialog } from './features/ui/show-manual-update-dialog';
import { createExecuteTableInteractionAction } from './features/table/execute-table-interaction-action';
import { createNormalizeImportedGachaItem } from './features/gacha/normalize-imported-gacha-item';
import { createShowAvatarManager } from './features/avatar/show-avatar-manager';
import { createExecuteSecondaryEffectsChain } from './features/effects/execute-secondary-effects-chain';
import { createRenderGachaSettingsPoolItemsHtml } from './features/gacha/render-gacha-settings-pool-items-html';
import { createBuildGachaCatalogTemplateJsonc } from './features/gacha/build-gacha-catalog-template-jsonc';
import { createApplyGachaCatalogImport } from './features/gacha/apply-gacha-catalog-import';
import { createInferEquipmentTableTypeForGachaItem } from './features/gacha/infer-equipment-table-type';
import { createBindFloatingCollapseDrag } from './features/layout/bind-floating-collapse-drag';
import { createFindTemplateRequirementSheet } from './features/table/find-template-requirement-sheet';
import { createInspectTableTemplate } from './features/table/inspect-table-template';
import { createRepairCurrentTableTemplateFromPreset } from './features/table/repair-current-table-template-from-preset';
import { createNormalizeDashboardPresetModules } from './features/dashboard/normalize-dashboard-preset-modules';
import { createRelocateDbPayloadToAnchor } from './features/console/relocate-db-payload-to-anchor';
import { createBuildNewTableTemplateRequirementPresetJsoncTemplate } from './features/table/build-new-table-template-requirement-preset-jsonc-template';
import { createGetCustomTableNameIconManagerCandidates } from './features/table/get-custom-table-name-icon-manager-candidates';
import { createAnalyzeCustomTableNameIconPackImport } from './features/table/analyze-custom-table-name-icon-pack-import';
import { createResolveCustomTableNameIconRowName } from './features/table/resolve-custom-table-name-icon-row-name';
import { createShowTableTemplateRequirementPresetManager } from './features/table/show-table-template-requirement-preset-manager';
import { createShowTableTemplateRequirementPresetEditor } from './features/table/show-table-template-requirement-preset-editor';
import { createRenderDataCardCellContent } from './features/table/render-data-card-cell-content';
import { createApplyExistingRowCellPatchesViaCrud } from './features/table/apply-existing-row-cell-patches-via-crud';
import { createMergeDiceConfigBackupCustomOnlyPresetArray } from './features/dice/merge-dice-config-backup-custom-only-preset-array';
import { createNormalizeRenderPresetRules } from './features/presets/normalize-render-preset-rules';
import { createMergeDiceConfigBackupPresetArraySafely } from './features/dice/merge-dice-config-backup-preset-array-safely';
import { createDeleteGachaPoolConfig } from './features/gacha/delete-gacha-pool-config';
import { createAcuDiceAPI } from './features/api/public-api';
import { createUpdateTemplateForActivePreset } from './features/presets/update-template-for-active-preset';
import { createShowTemplateInspectionResultModal } from './features/table/show-template-inspection-result-modal';
import { createUpdateTemplateForActiveCheckPreset } from './features/presets/update-template-for-active-check-preset';
import { createApplyDiceConfigBackup } from './features/dice/apply-dice-config-backup';
import { TABLE_NAV_SPECIAL_KEYS } from './shared/table-nav-special-keys';
import { createBuildDiceConfigBackupTableOrder } from './features/dice/build-dice-config-backup-table-order';
import { createMaybeRefreshReviewBaselineAtFillStart } from './features/table/maybe-refresh-review-baseline-at-fill-start';
import { createApplyDiceConfigBackupValue } from './features/dice/apply-dice-config-backup-value';
import { createWriteAttributesToCharacter } from './features/dice/write-attributes-to-character';
import { createParseDiceConfigBackup } from './features/dice/parse-dice-config-backup';
import { createBindGlobalInteractionEvents } from './features/interactions/bind-global-interaction-events';
import { createShowDiceConfigBackupDialog } from './features/dice/show-dice-config-backup-dialog';
import { createShowInventoryDetailMenu } from './features/table/show-inventory-detail-menu';
import { createRenderFavoritesPanel } from './features/favorites/render-favorites-panel';
import { createShowSendToTableModal } from './features/favorites/show-send-to-table-modal';
import { createMergeGachaCatalogRecordsToGlobalScope } from './features/gacha/merge-gacha-catalog-records';
import { createGetTavernHostWindow } from './shared/tavern-host';
import { createSendChatTextAndTrigger } from './features/chat/send-chat-text';
import { createSaveRowInstantly } from './features/table/save-row-instantly';
import { createRenderDiceProfileManagerBody } from './features/dice/render-dice-profile-manager-body';
import { createShowTagInputModal } from './features/favorites/show-tag-input-modal';
import { createShowNewFavoriteModal } from './features/favorites/show-new-favorite-modal';
import { createGetDiceProfileCurrentCharacterRecords } from './features/dice/get-dice-profile-current-character-records';
import { createStripCrudSqlComments } from './shared/strip-crud-sql-comments';
import { createStripCrudSqlBlockComments } from './shared/strip-crud-sql-block-comments';
import { createCloneRenderPresetRules } from './features/presets/clone-render-preset-rules';
import { createBindCompositionSafeSearchInput } from './shared/ui/bind-composition-safe-search-input';
import { createRenderInterfaceImpl } from './features/render/render-interface-impl';
import { createInit } from './app/init';
import { createBindEvents } from './features/events/bind-events';
import { createShowDicePanel } from './features/dice/show-dice-panel';
import { createShowSettingsModal } from './features/settings/show-settings-modal';
import { createShowContestPanel } from './features/dice/show-contest-panel';
import { createShowRelationshipGraph } from './features/table/show-relationship-graph';
import { createBindChangesEvents } from './features/changes/bind-changes-events';
import { createShowCellMenu } from './features/table/show-cell-menu';
import { createRenderChangesPanel } from './features/changes/render-changes-panel';
import { createRenderTableContent } from './features/table/render-table-content';
import { createRenderDashboard } from './features/dashboard/render-dashboard';
import { createInitCustomDropdown } from './features/ui/init-custom-dropdown';
import { createApplyConfigStyles } from './features/ui/apply-config-styles';
import { createGetRandomSkillPool } from './features/dice/get-random-skill-pool';
import { createDetectVisualizerConflict } from './features/ui/detect-visualizer-conflict';
import { createGenerateRPGAttributes } from './features/dice/generate-rpg-attributes';
import { createSaveDataToDatabase } from './features/table/save-data-to-database';
import { createBindOptionEvents } from './features/ui/bind-option-events';
import { createInterceptTextareaValue } from './features/textarea/intercept-textarea-value';
import { createGenerateDiffMap } from './features/changes/generate-diff-map';
import { createClearPresetAttributesForCharacter } from './features/dice/clear-preset-attributes';
import { createSelectCrazyParticipant } from './features/dice/select-crazy-participant';
import { createInjectIndependentOptions } from './features/ui/inject-independent-options';
import { createEvaluateFormula } from './features/dice/evaluate-formula';
import { createDismantleInventoryItem } from './features/table/dismantle-inventory-item';
import { createDismantleEquipmentItem } from './features/gacha/dismantle-equipment-item';
import { createParseEquipmentItems } from './features/table/parse-equipment-items';
import { createParseInventoryItems } from './features/table/parse-inventory-items';
import { createHandleInventoryAction } from './features/table/handle-inventory-action';
import { createSaveInventoryFieldValue } from './features/table/save-inventory-field-value';
import { createGetInteractOptionsForRow } from './features/table/get-interact-options-for-row';
import { createExchangeGachaShardItem } from './features/gacha/exchange-gacha-shard-item';
import { createShowInventoryMetaEditDialog } from './features/table/inventory-meta-edit-dialog';
import { createExecuteNormalCheckSuggestion } from './features/checks/execute-normal-check-suggestion';
import { createRefreshRegexRulesList } from './features/regex/refresh-regex-rules-list';
import { createRenderGachaShardShopHtml } from './features/gacha/render-shard-shop-html';
import { createRenderGachaPanelHtml } from './features/gacha/render-gacha-panel-html';
import { createPerformGachaDraw } from './features/gacha/perform-gacha-draw';
import { createGenerateCrazyRoll } from './features/dice/generate-crazy-roll';
import { createCrazyRollWithPreset } from './features/dice/crazy-roll-with-preset';
import { createRenderOptionTableContent } from './features/table/render-option-table-content';
import { createRenderCheckSuggestionTableContent } from './features/table/render-check-suggestion-table-content';
import { createApplySheetDataViaCrud } from './features/table/sheet-data-crud';
import { createInsertHtmlToPage } from './features/ui/insert-html-to-page';
import { createShowDiceSettingsPanel } from './features/dice/dice-settings-panel';
import { createShowAddRegexRuleModal } from './features/regex/add-regex-rule-dialog';
import { createShowAvatarCropModal } from './features/avatar/avatar-crop-modal';
import { createShowImportConfirmDialog } from './features/table/import-confirm-dialog';
import { createUpdateViewportWrapperBounds } from './features/layout/viewport-wrapper-bounds';
import { createUpdateFixedWrapperBounds } from './features/layout/fixed-wrapper-bounds';
import { createExecuteAdvancedCheckSuggestion } from './features/checks/execute-advanced-check-suggestion';
import { createExecuteContestCheckSuggestion } from './features/checks/execute-contest-check-suggestion';
import { createShowInventoryGiftDialog } from './features/table/inventory-gift-dialog';
import { createRenderInventoryVisualization } from './features/table/inventory-visualization';
import { createShowInventoryItemDetail } from './features/table/inventory-item-detail';
import { createShowInventoryFieldEditDialog } from './features/table/inventory-field-edit-dialog';
import { createShowChangeEditModal } from './features/changes/change-edit-modal';
import { createShowRowCompareEditModal } from './features/changes/row-compare-edit-modal';
import { createShowChangeSingleFieldModal } from './features/changes/change-single-field-modal';
import { createToggleOrderEditMode } from './features/ui/toggle-order-edit-mode';
import { DEFAULT_GM_CONFIG, DEFAULT_CONFIG, DEFAULT_DICE_CONFIG, DEFAULT_VIRTUAL_PRESET, DEFAULT_CRAZY_MODE_CONFIG, DEFAULT_SPECIAL_ATTR_TEMPLATE, RULE_TYPE_INFO, INVENTORY_QUALITY_ORDER } from './shared/defaults-config';
import { computeEffectVariables, computePendingEffectVariables, parseEffectValueInput, buildEffectMetaLines, buildEffectTraceLines } from './shared/effect-math';
import { alignAndFixPairedTables, isValueInRelationTable, getRelationOptions, getColumnExamples, getRowKey, getNearestValidNumber, extractCodesFromTable, buildCodeMapping } from './shared/table-utils';
import { ConsoleCaptureManager } from './features/console/console-capture-manager';
import { suggestFormatValue, parseTavernFindRegex, getDbLockAPI } from './shared/misc-utils';
import {
  NameAliasRegistryCore,
  parseCharacterName,
  getDisplayName,
  findNameColumnIndex,
  findExplicitAttributeTableNameColumnIndex,
  getRowDisplayName,
  isCharacterTable,
  CHARACTER_NAME_COLUMN_KEYS,
  ATTRIBUTE_TABLE_NAME_COLUMN_KEYS,
} from './entities/name-alias';
import {
  SCRIPT_ID,
  DICE_ROOT_CLASS,
  DICE_ROOT_SELECTOR,
  HOST_REGENERATE_HIDDEN_CLASS,
  HOST_REGENERATE_BUTTON_SELECTOR,
  PRIMARY_KEYS,
  PRESET_FORMAT_VERSION,
  SCRIPT_VERSION,
  isNpcTableName,
} from './shared/constants';
import advancedPresetAgentPromptTemplate from './docs/advanced-preset-agent-prompt.md?raw';
import dashboardPresetAgentPromptTemplate from './docs/dashboard-preset-agent-prompt.md?raw';
import attributePresetAgentPromptTemplate from './docs/attribute-preset-agent-prompt.md?raw';
import actionPresetAgentPromptTemplate from './docs/action-preset-agent-prompt.md?raw';
import renderPresetAgentPromptTemplate from './docs/render-preset-agent-prompt.md?raw';
import gachaCatalogAgentPromptTemplate from './docs/gacha-catalog-agent-prompt.md?raw';
import tableTemplateRequirementPresetAgentPromptTemplate from './docs/table-template-requirement-preset-agent-prompt.md?raw';
import defaultTableTemplateRequirementRaw from './骰子表格SQL_v4.3.json?raw';
import {
  DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID,
  TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT,
  buildTableTemplateAppendRepairPlan,
  cloneTemplateValue,
  createBuiltinTableTemplateRequirementPreset,
  exportTableTemplateRequirementPreset,
  getTemplateInspectionSheets as getRequirementInspectionSheets,
  inspectTableTemplateWithPreset,
  normalizeTableTemplateRequirementPreset,
} from './features/table/table-template-requirements';
import {
  BUILTIN_GACHA_POOL_DEFINITIONS,
  GACHA_CATALOG_EXPORT_KIND,
  GACHA_CATALOG_VERSION,
  FORTUNE_CURRENCY_NAME,
  GACHA_ACTIVE_HEARTBEAT_MS,
  GACHA_ACTIVE_SECONDS_PER_FORTUNE,
  GACHA_CHECK_REWARD,
  GACHA_CHARS_PER_FORTUNE,
  GACHA_DRAW_COST_SINGLE,
  GACHA_DRAW_COST_TEN,
  GACHA_ITEM_DEFINITIONS,
  GACHA_LEGEND_PITY_THRESHOLD,
  GACHA_MESSAGE_REWARD,
  GACHA_POOL_TAGS,
  GACHA_RARE_PITY_THRESHOLD,
  GACHA_RARITY_ORDER,
  GACHA_RARITY_WEIGHTS,
  GACHA_RECENT_REWARD_LIMIT,
  GACHA_REWARD_TARGETS,
  GACHA_SHARD_VALUES,
  GACHA_UNIQUE_RARITY,
  type GachaPoolDefinition,
  type GachaCustomFields,
  type GachaItemDefinition,
  type GachaPoolTag,
  type GachaRarity,
  type GachaRewardTarget,
  type GachaRewardTargetColumnKey,
  type GachaRewardTargetColumns,
} from './entities/gacha-items';
import {
  ACU_DICE_PROFILE_FORMAT,
  computeAcuDiceProfileFingerprint,
  createAcuDiceProfileMarker,
  decodeAcuDiceProfileMarkerPayload,
  extractAcuDiceProfileMarkerPayloads,
  getAcuDiceProfilePromptKey,
  getAcuDiceProfileSourceKey,
  normalizeAcuDiceProfilePackage,
  normalizeAcuDiceProfileSource,
  type AcuDiceProfilePackage,
  type AcuDiceProfileSource,
  type NormalizeAcuDiceProfileOptions,
} from './features/profiles/profile-packages';
import { GachaCatalogDB } from './features/gacha/gacha-catalog-db';
import { GachaShardWallet, GachaCatalog, GachaCatalogRecord, GachaCatalogCache, GachaCatalogLoadTask, GachaCatalogImportMode, NormalizedGachaCatalogItem, GachaCatalogImportAnalysis, GachaCatalogImportStats, GachaSettingsItemSourceFilter, GachaSettingsItemStatusFilter, GachaSettingsItemSortMode, GachaSettingsItemFilterState, GachaSettingsFilterField, GachaSettingsFilterOption, NormalizedImportedGachaPools, GachaPoolSettingsRecord, GachaItemSettingsEntry, GachaItemSettingsRecord, GachaPityState, GachaRecentRewardRecord, GachaInputStats, GachaState, GachaFortuneProgressView, GachaDrawOutcome } from './features/gacha/gacha-types';
import { createEmptyShardWallet, GACHA_DUPLICATE_REROLL_LIMIT, GACHA_PICKUP_WEIGHT_MULTIPLIER, GACHA_PICKUP_CHAT_DEPTH_BUCKET, GACHA_PICKUP_RARITIES, GACHA_PICKUP_FALLBACK_LIMIT, GACHA_ALL_POOL_TAG, GACHA_CUSTOM_ONLY_POOL_TAG, GACHA_REWARD_FIELD_LIMITS, normalizeGachaPoolId, normalizeGachaPoolName, cloneGachaState, getGachaStateBalanceScore, mergeLegacyGachaStateForLocalStorage } from './features/gacha/gacha-helpers';
import { GachaStore } from './features/gacha/gacha-store';
import { GachaStateCore } from './features/gacha/gacha-state';
import { ATTRIBUTE_QUICK_SELECT_DEFAULT } from './features/presets/attribute-quick-select-defaults';
import { BUILTIN_ADVANCED_PRESETS } from './features/presets/builtin-advanced-presets';
import { BUILTIN_VALIDATION_RULES } from './features/validation/builtin-validation-rules';
import { RANDOM_SKILL_POOL } from './features/dice/random-skill-pool';
import { DASHBOARD_TABLE_CONFIG } from './features/dashboard/dashboard-table-config';
import { TEMPLATE_TABLE_REQUIREMENTS } from './features/table/template-table-requirements';
import { BUILTIN_ATTRIBUTE_PRESETS } from './features/presets/builtin-attribute-presets';
import { BUILTIN_ACTION_PRESETS } from './features/presets/builtin-action-presets';
import { GLOBAL_INTERACTION_SECTION_METAS } from './features/interactions/global-interaction-section-metas';
import { BUILTIN_REGEX_RULES } from './features/regex/builtin-regex-rules';
import { ACTION_ICON_MAP } from './features/actions/action-icon-map';
import { DICE_CONFIG_BACKUP_MODULES } from './features/dice/dice-config-backup-modules';
import { DICE_CONFIG_BACKUP_KEY_STRATEGIES } from './features/dice/dice-config-backup-key-strategies';
import { STORAGE_KEY_ACTION_ORDER, STORAGE_KEY_ACTION_PRESETS, STORAGE_KEY_ACTIVE_ACTION_PRESET, STORAGE_KEY_ACTIVE_ADVANCED_PRESET, STORAGE_KEY_ACTIVE_ATTR_PRESET, STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, STORAGE_KEY_ACTIVE_PRESET, STORAGE_KEY_ACTIVE_RENDER_PRESET, STORAGE_KEY_ACTIVE_TAB, STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET, STORAGE_KEY_ADVANCED_PRESETS, STORAGE_KEY_ATTRIBUTE_PRESETS, STORAGE_KEY_AVATAR_MAP, STORAGE_KEY_BLACKLIST, STORAGE_KEY_BUILTIN_PRESET_ORDER, STORAGE_KEY_BUILTIN_PRESET_VISIBILITY, STORAGE_KEY_CRAZY_MODE, STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_DASHBOARD_PRESETS, STORAGE_KEY_DICE_CONFIG, STORAGE_KEY_GACHA_ACTIVE_POOL_TAG, STORAGE_KEY_GACHA_ITEM_SETTINGS, STORAGE_KEY_GACHA_POOL_SETTINGS, STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, STORAGE_KEY_GACHA_SHARD_SHOP_RARITY, STORAGE_KEY_GACHA_STATE, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS, STORAGE_KEY_GM_CONFIG, STORAGE_KEY_HIDDEN_TABLES, STORAGE_KEY_INVENTORY_FILTERS, STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED, STORAGE_KEY_INVENTORY_METADATA, STORAGE_KEY_IS_COLLAPSED, STORAGE_KEY_LAST_PRESET, STORAGE_KEY_MAP_FOCUS, STORAGE_KEY_OPTIONS_COLLAPSED, STORAGE_KEY_PRESETS, STORAGE_KEY_REGEX_ACTIVE_PRESET, STORAGE_KEY_REGEX_ENABLED, STORAGE_KEY_REGEX_PRESETS, STORAGE_KEY_REGEX_RULES, STORAGE_KEY_RENDER_PRESETS, STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED, STORAGE_KEY_REVERSE_TABLES, STORAGE_KEY_SCROLL, STORAGE_KEY_TABLE_HEIGHTS, STORAGE_KEY_TABLE_ORDER, STORAGE_KEY_TABLE_STYLES, STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS, STORAGE_KEY_UI_CONFIG, STORAGE_KEY_VALIDATION_ENABLED, STORAGE_KEY_VALIDATION_MODE, STORAGE_KEY_VALIDATION_RULES } from './shared/storage-keys';
import { DATA_VALIDATION_DEPRECATED_META } from './features/validation/data-validation-deprecated-meta';

(function () {
  'use strict';

  const TABLE_TEMPLATE_CHECK_HINT = '请在高级设置中使用“检验表格模板”检查当前表格模板。';

  const withTableTemplateCheckHint = createWithTableTemplateCheckHint({
    getTABLE_TEMPLATE_CHECK_HINT: () => TABLE_TEMPLATE_CHECK_HINT,
  });

  const warnTableTemplateIssue = createWarnTableTemplateIssue({
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const errorTableTemplateIssue = createErrorTableTemplateIssue({

  });

  /**
   * 获取行的主键值
   * @param tableName 表名
   * @param row 行数据
   * @param headers 表头
   */

  // ========================================
  // 数据库适配层 (LockManager -> GodDB API)
  // ========================================

  /**
   * 获取数据库锁定API
   * @returns API对象，如果不可用返回null
   */

  /**
   * 根据表名获取sheetKey
   * @param tableName - 表名（如"主角信息"）
   * @returns sheetKey（如"sheet_0"），找不到返回null
   */
  const getSheetKeyByTableName = createGetSheetKeyByTableName({
    getTableData: (...a: any[]) => getTableData(...a),
  });

  /**
   * 通过主键值查找行索引
   * @param sheetKey - 表格标识
   * @param tableName - 表名
   * @param primaryKeyValue - 主键值（格式可能是 "字段名=值" 或纯值）
   * @returns 行索引（从0开始），找不到返回null
   */
  const findRowIndexByPrimaryKey = createFindRowIndexByPrimaryKey({
    getTableData: (...a: any[]) => getTableData(...a),
  });

  /**
   * 安全地修改角色卡属性值
   * @param characterName - 角色名称
   * @param attrName - 属性名称
   * @param operation - 操作类型: 'add' | 'subtract' | 'set'
   * @param value - 操作数值
   * @param options - 可选配置 { initValue?: number, min?: number, max?: number }
   * @returns Promise<{ success: boolean, oldValue: number, newValue: number, error?: string }>
   */
  const safeUpdateAttribute = createSafeUpdateAttribute({
    getDbLockAPI: (...a: any[]) => getDbLockAPI(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    setCachedRawData: (v: any) => { cachedRawData_ACC.v = v; },
  });

  /**
   * 执行检定后果效果
   * 在 MESSAGE_SENT 事件中调用，异步执行不阻塞消息发送
   * @param pendingCtx 待执行的后果上下文
   * @returns 执行结果数组
   */
  const executeEffects = createExecuteEffects({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    executeSecondaryEffectsChain: (...a: any[]) => executeSecondaryEffectsChain(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    performSaveDataOnly: (...a: any[]) => performSaveDataOnly(...a),
    updateSingleAttribute: (...a: any[]) => updateSingleAttribute(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });


  const executeSecondaryEffectsChain = createExecuteSecondaryEffectsChain({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    isSameAttributeAlias: (...a: any[]) => isSameAttributeAlias(...a),
    updateSingleAttribute: (...a: any[]) => updateSingleAttribute(...a),
  });

  /**
   * 根据后果执行结果计算输出模板变量
   * @param results 后果执行结果数组
   * @returns 可用于 outputContext 的变量对象
   */



  /**
   * 根据待执行的效果定义预计算输出模板变量
   * 用于在输出模板中显示预期的效果信息（实际执行在消息发送后）
   * @param effects 效果定义数组
   * @returns 可用于 outputContext 的变量对象
   */

  // ========================================
  // BookmarkManager - 书签管理器（按聊天隔离）
  // ========================================
  const BookmarkManager = createBookmarkManager({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });  const escapeHtml = s =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  type ImageUrlValidationReason = 'invalid_url' | 'invalid_protocol' | 'svg_url';

  const REMOTE_IMAGE_ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
  const INTERNAL_IMAGE_ALLOWED_PROTOCOLS = new Set(['blob:']);

  const normalizeImageUrlInput = createNormalizeImageUrlInput({

  });

  const parseImageUrl = createParseImageUrl({
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

  const getRemoteImageUrlValidationError = createGetRemoteImageUrlValidationError({
    parseImageUrl: (...a: any[]) => parseImageUrl(...a),
    getREMOTE_IMAGE_ALLOWED_PROTOCOLS: () => REMOTE_IMAGE_ALLOWED_PROTOCOLS,
  });

  const isRemoteImageUrlValid = createIsRemoteImageUrlValid({
    getRemoteImageUrlValidationError: (...a: any[]) => getRemoteImageUrlValidationError(...a),
  });

  const isRenderableImageUrlValid = createIsRenderableImageUrlValid({
    getRemoteImageUrlValidationError: (...a: any[]) => getRemoteImageUrlValidationError(...a),
    parseImageUrl: (...a: any[]) => parseImageUrl(...a),
    getINTERNAL_IMAGE_ALLOWED_PROTOCOLS: () => INTERNAL_IMAGE_ALLOWED_PROTOCOLS,
  });

  const normalizeStorableImageUrl = createNormalizeStorableImageUrl({
    isRemoteImageUrlValid: (...a: any[]) => isRemoteImageUrlValid(...a),
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

  const getImageUrlValidationMessage = createGetImageUrlValidationMessage({

  });

  const escapeCssString = createEscapeCssString({
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

  const formatCssImageUrl = createFormatCssImageUrl({
    escapeCssString: (...a: any[]) => escapeCssString(...a),
    isRemoteImageUrlValid: (...a: any[]) => isRemoteImageUrlValid(...a),
    isRenderableImageUrlValid: (...a: any[]) => isRenderableImageUrlValid(...a),
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

  const buildAvatarBackgroundStyle = createBuildAvatarBackgroundStyle({
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
  });


  const renderDeprecatedBadge = createRenderDeprecatedBadge({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const stripLoneSurrogates = createStripLoneSurrogates({

  });

  const safeEncodeURIComponent = createSafeEncodeURIComponent({
    stripLoneSurrogates: (...a: any[]) => stripLoneSurrogates(...a),
  });

  const safeDecodeURIComponent = createSafeDecodeURIComponent({
    stripLoneSurrogates: (...a: any[]) => stripLoneSurrogates(...a),
  });

  /**
   * 设置弹窗点击遮罩关闭的事件监听
   * - PC端：需要 mousedown 和 mouseup 都在遮罩上才关闭（防止选择文本时误关闭）
   * - Mobile端：保持原有行为，触摸点击遮罩即关闭
   * @param $overlay jQuery对象，弹窗遮罩层
   * @param overlayClass 遮罩层的类名（用于判断点击目标）
   * @param onClose 关闭时的回调函数
   */
  const setupOverlayClose = createSetupOverlayClose({

  });

  // [新增] 生成唯一名称（用于预设导入时处理重名）
  const generateUniqueName = createGenerateUniqueName({

  });

  // [新增] 通用预设导入冲突弹窗（复用头像导入弹窗样式）
  const showPresetConflictDialog = createShowPresetConflictDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    generateUniqueName: (...a: any[]) => generateUniqueName(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });
  type AcuDiceTextareaElement = HTMLTextAreaElement & {
    _acuOriginalDiceText?: string | null;
    _acuOriginalTextareaText?: string | null;
    _acuOriginalActionText?: string | null;
    _acuHasDiceData?: boolean;
    _acuValueIntercepted?: boolean;
    _acuHumanInputTrackingBound?: boolean;
  };

  const DICE_RESULT_PLACEHOLDER = '[投骰结果已隐藏]';
  const createMetaCheckResultRegex = createCreateMetaCheckResultRegex({

  });
  const createDiceResultPlaceholderRegex = createCreateDiceResultPlaceholderRegex({});


  const notifyTextareaValueChanged = createNotifyTextareaValueChanged({

  });

  const setTextareaValueAndNotify = createSetTextareaValueAndNotify({
    notifyTextareaValueChanged: (...a: any[]) => notifyTextareaValueChanged(...a),
  });

  const readTextareaVisibleValue = createReadTextareaVisibleValue({

  });

  const extractMetaCheckResultBlocks = createExtractMetaCheckResultBlocks({
    createMetaCheckResultRegex: (...a: any[]) => createMetaCheckResultRegex(...a),
  });

  const readStoredTextareaDiceText = createReadStoredTextareaDiceText({
    getCore: (...a: any[]) => getCore(...a),
  });

  const readStoredLatestDiceText = createReadStoredLatestDiceText({
    getCore: (...a: any[]) => getCore(...a),
  });

  const composeTextareaTextWithHiddenDice = createComposeTextareaTextWithHiddenDice({
    createDiceResultPlaceholderRegex: (...a: any[]) => createDiceResultPlaceholderRegex(...a),
    extractMetaCheckResultBlocks: (...a: any[]) => extractMetaCheckResultBlocks(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });

  const resolveTextareaTextWithHiddenDice = createResolveTextareaTextWithHiddenDice({
    composeTextareaTextWithHiddenDice: (...a: any[]) => composeTextareaTextWithHiddenDice(...a),
    readStoredLatestDiceText: (...a: any[]) => readStoredLatestDiceText(...a),
    readStoredTextareaDiceText: (...a: any[]) => readStoredTextareaDiceText(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
  });
  const clearTextareaDiceCache = createClearTextareaDiceCache({
    getCore: (...a: any[]) => getCore(...a),
  });

  const storeTextareaDiceCache = createStoreTextareaDiceCache({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    extractMetaCheckResultBlocks: (...a: any[]) => extractMetaCheckResultBlocks(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  const syncTextareaDiceCacheFromVisibleText = createSyncTextareaDiceCacheFromVisibleText({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    extractMetaCheckResultBlocks: (...a: any[]) => extractMetaCheckResultBlocks(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    resolveTextareaTextWithHiddenDice: (...a: any[]) => resolveTextareaTextWithHiddenDice(...a),
    storeTextareaDiceCache: (...a: any[]) => storeTextareaDiceCache(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });

  const HUMAN_INPUT_TAG_BLOCK_PATTERNS = createHumanInputTagBlockPatterns({

  });
  const HUMAN_INPUT_ACTION_PATTERN = /<user>(?:(?!<user>).)*?[。！？]/g;
  const humanInputSendQueue: string[] = [];
  let lastHumanInputSnapshot = '';
  let lastHumanInputActivityAt = 0;
  let lastCapturedHumanInputSnapshot = '';
  let lastHumanInputCaptureAt = 0;
  let gachaHeartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let gachaShopUiRefreshTimer: ReturnType<typeof setInterval> | null = null;
  let gachaShopRootElement: HTMLElement | null = null;
  const GACHA_TEST_DEFAULT_FORTUNE = 0;
  const GACHA_SHARD_EXCHANGE_COST = 10;





  const GACHA_CATALOG_GLOBAL_SCOPE_KEY = 'global';
  const GACHA_SHOP_UI_REFRESH_MS = 250;
  const GACHA_CATALOG_RAW_ROW_INDEX_PROP = '__acuRawRowIndex';

  const normalizeTrackedText = createNormalizeTrackedText({

  });

  const stripKnownSystemActionText = createStripKnownSystemActionText({
    normalizeTrackedText: (...a: any[]) => normalizeTrackedText(...a),
  });

  const extractExplicitHumanInputText = createExtractExplicitHumanInputText({
    normalizeTrackedText: (...a: any[]) => normalizeTrackedText(...a),
  });

  const stripSystemInjectedContent = createStripSystemInjectedContent({
    extractExplicitHumanInputText: (...a: any[]) => extractExplicitHumanInputText(...a),
    normalizeTrackedText: (...a: any[]) => normalizeTrackedText(...a),
    stripKnownSystemActionText: (...a: any[]) => stripKnownSystemActionText(...a),
    getHUMAN_INPUT_ACTION_PATTERN: () => HUMAN_INPUT_ACTION_PATTERN,
    getHUMAN_INPUT_TAG_BLOCK_PATTERNS: () => HUMAN_INPUT_TAG_BLOCK_PATTERNS,
  });

  const countUnicodeCharacters = createCountUnicodeCharacters({

  });

  const markHumanInputActivity = createMarkHumanInputActivity({
    getLastHumanInputActivityAt: () => lastHumanInputActivityAt,
    setLastHumanInputActivityAt: (v: any) => { lastHumanInputActivityAt = v; },
  });

  const capturePendingHumanInputSnapshot = createCapturePendingHumanInputSnapshot({
    markHumanInputActivity: (...a: any[]) => markHumanInputActivity(...a),
    stripSystemInjectedContent: (...a: any[]) => stripSystemInjectedContent(...a),
    getHumanInputSendQueue: () => humanInputSendQueue,
    getLastHumanInputSnapshot: () => lastHumanInputSnapshot,
    setLastHumanInputSnapshot: (v: any) => { lastHumanInputSnapshot = v; },
    getLastCapturedHumanInputSnapshot: () => lastCapturedHumanInputSnapshot,
    setLastCapturedHumanInputSnapshot: (v: any) => { lastCapturedHumanInputSnapshot = v; },
    getLastHumanInputCaptureAt: () => lastHumanInputCaptureAt,
    setLastHumanInputCaptureAt: (v: any) => { lastHumanInputCaptureAt = v; },
  });

  const consumePendingHumanInputSnapshot = createConsumePendingHumanInputSnapshot({
    getHumanInputSendQueue: () => humanInputSendQueue,
    getLastHumanInputSnapshot: () => lastHumanInputSnapshot,
  });

  const bindHumanInputTracking = createBindHumanInputTracking({
    getCore: (...a: any[]) => getCore(...a),
    markHumanInputActivity: (...a: any[]) => markHumanInputActivity(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    stripSystemInjectedContent: (...a: any[]) => stripSystemInjectedContent(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
    getLastHumanInputSnapshot: () => lastHumanInputSnapshot,
    setLastHumanInputSnapshot: (v: any) => { lastHumanInputSnapshot = v; },
  });

  // [新增] 智能填充输入栏函数
  const smartInsertToTextarea = createSmartInsertToTextarea({
    createDiceResultPlaceholderRegex: (...a: any[]) => createDiceResultPlaceholderRegex(...a),
    createMetaCheckResultRegex: (...a: any[]) => createMetaCheckResultRegex(...a),
    escapeRegExpLiteral: (...a: any[]) => escapeRegExpLiteral(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    readStoredLatestDiceText: (...a: any[]) => readStoredLatestDiceText(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    storeTextareaDiceCache: (...a: any[]) => storeTextareaDiceCache(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
  });

  const getRuntimeWindowCandidates = createGetRuntimeWindowCandidates({
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
  });

  const findRuntimeFunction = createFindRuntimeFunction({
    getRuntimeWindowCandidates: (...a: any[]) => getRuntimeWindowCandidates(...a),
  });

  const findSillyTavernSlashRunner = createFindSillyTavernSlashRunner({
    getRuntimeWindowCandidates: (...a: any[]) => getRuntimeWindowCandidates(...a),
  });

  const quoteSlashArgument = createQuoteSlashArgument({

  });

  const getComposerTextarea = createGetComposerTextarea({
    getCore: (...a: any[]) => getCore(...a),
  });

  const getResolvedComposerText = createGetResolvedComposerText({
    getComposerTextarea: (...a: any[]) => getComposerTextarea(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
  });

  const clearComposerIfCurrentText = createClearComposerIfCurrentText({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    getComposerTextarea: (...a: any[]) => getComposerTextarea(...a),
    getCore: (...a: any[]) => getCore(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
  });

  const findComposerSendButton = createFindComposerSendButton({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });

  const sendTextViaComposer = createSendTextViaComposer({
    findComposerSendButton: (...a: any[]) => findComposerSendButton(...a),
    getComposerTextarea: (...a: any[]) => getComposerTextarea(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
  });

  const sendChatTextAndTrigger = createSendChatTextAndTrigger({
    findRuntimeFunction: (...a: any[]) => findRuntimeFunction(...a),
    findSillyTavernSlashRunner: (...a: any[]) => findSillyTavernSlashRunner(...a),
    quoteSlashArgument: (...a: any[]) => quoteSlashArgument(...a),
    sendTextViaComposer: (...a: any[]) => sendTextViaComposer(...a),
    triggerGenerationAfterDirectSend: (...a: any[]) => triggerGenerationAfterDirectSend(...a),
  });
  const triggerGenerationAfterDirectSend = createTriggerGenerationAfterDirectSend({
    findRuntimeFunction: (...a: any[]) => findRuntimeFunction(...a),
    findSillyTavernSlashRunner: (...a: any[]) => findSillyTavernSlashRunner(...a),
  });

  // [新增] 在发送消息前恢复真实结果
  const restoreDiceResultBeforeSend = createRestoreDiceResultBeforeSend({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    resolveTextareaTextWithHiddenDice: (...a: any[]) => resolveTextareaTextWithHiddenDice(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });

  // [新增] 拦截输入框的 value 属性，确保读取时自动替换占位符
  const interceptTextareaValue = createInterceptTextareaValue({
    getCore: (...a: any[]) => getCore(...a),
    resolveTextareaTextWithHiddenDice: (...a: any[]) => resolveTextareaTextWithHiddenDice(...a),
    scheduleViewportBoundsRefresh: (...a: any[]) => scheduleViewportBoundsRefresh(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });






 // [新增] 选项面板独立折叠状态







  // [新增] 移植功能所需的存储键





  const MAX_ACTION_BUTTONS = 6; // 活动栏最大按钮数
  const MIN_PANEL_HEIGHT = 200; // 面板最小高度
  const MAX_PANEL_HEIGHT = 1200; // 面板最大高度
  const PANEL_VIEWPORT_TOP_GUTTER = 32; // 手动拉高面板时保留顶部工具栏安全距

















  // 自定义掷骰模式常量
  const CUSTOM_ROLL_MODE = createCustomRollMode({

  });
  // 比较版本号（简单比较，假设版本号格式为 "x.y.z"）
  const compareVersion = createCompareVersion({

  });




  // ========================================
  // ConsoleCaptureManager - Console日志抓取管理器
  // ========================================

  // 不自动初始化拦截，需要手动开启或错误时自动开启
  // ConsoleCaptureManager.intercept();

  // ========================================
  // 全局错误处理机制（高阈值，仅致命错误）
  // ========================================
  const ErrorHandler = createErrorHandler({
    getConsoleCaptureManager: () => ConsoleCaptureManager,
  });
  // 注册全局错误处理器
  window.onerror = function (message, source, lineno, colno, error) {
    ErrorHandler.handleError(error || message, source, lineno, colno, error?.stack);
    return false; // 不阻止默认错误处理
  };

  // 注册 Promise 拒绝处理器
  window.addEventListener('unhandledrejection', function (event) {
    ErrorHandler.handleError(event.reason, null, null, null, event.reason?.stack);
  });

  // 在脚本初始化时检查错误状态
  // 这个会在 init 函数中调用

  // ========================================
  // 正则转换系统 - 类型定义 (Phase 1.1)
  // ========================================

  /**
   * 正则转换操作类型
   * - replace: 替换匹配的内容
   * - extract: 提取匹配的内容(暂未实现)
   * - delete: 删除匹配的内容
   * - validate: 验证格式(与ValidationEngine不同,这是转换验证)
   */
  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  /**
   * 解析酒馆正则的 findRegex 字段
   * 格式: /pattern/flags
   */

  /**
   * 将酒馆正则格式转换为本系统的 RegexTransformationRule
   */
  const convertTavernRegexToRule = createConvertTavernRegexToRule({

  });

  // ========================================
  // 内置表格正则规则 (Phase 2.2)
  // ========================================

  const DEPRECATED_BUILTIN_REGEX_RULE_IDS = new Set(['builtin_replace_user']);
  const isDeprecatedBuiltinRegexRule = createIsDeprecatedBuiltinRegexRule({
    getDEPRECATED_BUILTIN_REGEX_RULE_IDS: () => DEPRECATED_BUILTIN_REGEX_RULE_IDS,
  });
  const filterDeprecatedBuiltinRegexRules = <T extends { id?: string; builtin?: boolean }>(
    rules: readonly T[] | null | undefined,
  ): T[] => {
    if (!Array.isArray(rules)) return [];
    return rules.filter(rule => !isDeprecatedBuiltinRegexRule(rule));
  };

  // ========================================
  // ValidationRuleManager - 数据验证规则系统
  // ========================================


 // 数据验证模式（只显示验证错误）

  // 规则类型信息（用于 UI 显示和分组）

  // 内置验证规则定义


  // ========================================
  // 快捷检定显示排除词
  // ========================================
  // 旧版变量过滤黑名单的存储键只用于迁移；是否显示骰子图标统一走 RenderPresetManager.shouldShowQuickCheck()。

  const DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS = createDefaultQuickCheckExcludeKeywords({

  });
  const LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS = createLegacyDefaultQuickCheckExcludeKeywords({
    getDEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: () => DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
  });

  const isSameKeywordSet = createIsSameKeywordSet({

  });

  // ========================================
  // RenderPresetManager - 表格和变量渲染预设管理
  // ========================================
  const RENDER_PRESET_FORMAT = 'acu_render_preset_v1' as const;
  const RENDER_DEFAULT_PRESET_ID = '__builtin_render_default__';
  const RENDER_LEGACY_BLACKLIST_PRESET_ID = 'render_legacy_blacklist_migration';




  interface RenderPresetColumnDisplayRules {
    stripBracketContent: boolean;
    aliases: Record<string, string>;
  }

  interface RenderPresetRelationshipRules {
    enabled: boolean;
    headerKeywords: string[];
    autoDetectMultipleParen: boolean;
  }

  interface RenderPresetAttributeRules {
    enabled: boolean;
    parseJsonObject: boolean;
    parseKeyValuePairs: boolean;
  }

  interface RenderPresetShortTagRules {
    enabled: boolean;
    maxLength: number;
  }

  interface RenderPresetBadgeRules {
    enabled: boolean;
    shortTextMaxLength: number;
    numericPattern: boolean;
    statusValues: string[];
  }

  interface RenderPresetQuickCheckRules {
    enabled: boolean;
    excludeKeywords: string[];
  }

  interface RenderPresetDialogueIndentRules {
    whitelist: string[];
    blacklist: string[];
  }

  interface RenderPresetRules {
    columnDisplay: RenderPresetColumnDisplayRules;
    invalidValues: string[];
    identityHeaderKeywords: string[];
    relationship: RenderPresetRelationshipRules;
    attributes: RenderPresetAttributeRules;
    shortTags: RenderPresetShortTagRules;
    badges: RenderPresetBadgeRules;
    quickCheck: RenderPresetQuickCheckRules;
    dialogueIndent: RenderPresetDialogueIndentRules;
  }

  interface RenderPreset {
    format: typeof RENDER_PRESET_FORMAT;
    version: string;
    id: string;
    name: string;
    builtin?: boolean;
    description?: string;
    rules: RenderPresetRules;
    createdAt?: string;
    updatedAt?: string;
  }

  const normalizeRenderPresetStringList = createNormalizeRenderPresetStringList({

  });

  const normalizeRenderPresetTagFilterList = createNormalizeRenderPresetTagFilterList({

  });

  const normalizeRenderPresetAliasMap = createNormalizeRenderPresetAliasMap({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
  });

  const cloneRenderPresetRules = createCloneRenderPresetRules({

  });

  const DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST = createDefaultDialogueIndentTagBlacklist({

  });

  const DEFAULT_RENDER_PRESET_RULES = createDefaultRenderPresetRules({
    DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST: DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST,
    DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
  });

  const normalizeRenderPresetRules = createNormalizeRenderPresetRules({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeRenderPresetAliasMap: (...a: any[]) => normalizeRenderPresetAliasMap(...a),
    normalizeRenderPresetStringList: (...a: any[]) => normalizeRenderPresetStringList(...a),
    normalizeRenderPresetTagFilterList: (...a: any[]) => normalizeRenderPresetTagFilterList(...a),
    DEFAULT_RENDER_PRESET_RULES: DEFAULT_RENDER_PRESET_RULES,
  });

  const createBuiltinRenderPreset = createCreateBuiltinRenderPreset({
    cloneRenderPresetRules: (...a: any[]) => cloneRenderPresetRules(...a),
    getDEFAULT_RENDER_PRESET_RULES: () => DEFAULT_RENDER_PRESET_RULES,
    getRENDER_DEFAULT_PRESET_ID: () => RENDER_DEFAULT_PRESET_ID,
    getRENDER_PRESET_FORMAT: () => RENDER_PRESET_FORMAT,
  });

  const parseRenderPresetJson = (jsonText: string): { name: string; description: string; rules: RenderPresetRules } => {
    const parsed = parseJsoncRecord(jsonText, '渲染预设');

    const format = typeof parsed.format === 'string' ? parsed.format : '';
    if (format && format !== RENDER_PRESET_FORMAT) {
      throw new Error(`不支持的预设格式: ${format}`);
    }

    const rawRules = 'rules' in parsed ? parsed.rules : parsed;
    const rules = normalizeRenderPresetRules(rawRules);
    const name = typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : '导入的渲染预设';
    const description = typeof parsed.description === 'string' ? parsed.description.trim() : '';
    return { name, description, rules };
  };

  const createRenderPresetEditorTemplate = createCreateRenderPresetEditorTemplate({
    DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST: DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST,
    DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
  });

  const RenderPresetManager = createRenderPresetManager({
    cloneRenderPresetRules: (...a: any[]) => cloneRenderPresetRules(...a),
    createBuiltinRenderPreset: (...a: any[]) => createBuiltinRenderPreset(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    isSameKeywordSet: (...a: any[]) => isSameKeywordSet(...a),
    normalizeRenderPresetRules: (...a: any[]) => normalizeRenderPresetRules(...a),
    normalizeRenderPresetStringList: (...a: any[]) => normalizeRenderPresetStringList(...a),
    parseRenderPresetJson: (...a: any[]) => parseRenderPresetJson(...a),
    DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
    DEFAULT_RENDER_PRESET_RULES: DEFAULT_RENDER_PRESET_RULES,
    LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
    RENDER_DEFAULT_PRESET_ID: RENDER_DEFAULT_PRESET_ID,
    RENDER_LEGACY_BLACKLIST_PRESET_ID: RENDER_LEGACY_BLACKLIST_PRESET_ID,
    RENDER_PRESET_FORMAT: RENDER_PRESET_FORMAT,
    STORAGE_KEY_ACTIVE_RENDER_PRESET: STORAGE_KEY_ACTIVE_RENDER_PRESET,
    STORAGE_KEY_BLACKLIST: STORAGE_KEY_BLACKLIST,
    STORAGE_KEY_RENDER_PRESETS: STORAGE_KEY_RENDER_PRESETS,
    STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED: STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED,
  });

  // ========================================
  // PresetManager - 验证规则预设管理
  // ========================================



  const PresetManager = createPresetManager({
    compareVersion: (...a: any[]) => compareVersion(...a),
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    getValidationRuleManager: () => ValidationRuleManager,
    BUILTIN_VALIDATION_RULES: BUILTIN_VALIDATION_RULES,
    STORAGE_KEY_ACTIVE_PRESET: STORAGE_KEY_ACTIVE_PRESET,
    STORAGE_KEY_PRESETS: STORAGE_KEY_PRESETS,
    STORAGE_KEY_VALIDATION_RULES: STORAGE_KEY_VALIDATION_RULES,
  });
  // 验证规则管理器（从 PresetManager 获取规则）
  const ValidationRuleManager = createValidationRuleManager({
    isNpcTableName: (...a: any[]) => isNpcTableName(...a),
    getPresetManager: () => PresetManager,
    STORAGE_KEY_VALIDATION_ENABLED: STORAGE_KEY_VALIDATION_ENABLED,
  });
  // ========================================
  // RegexTransformationManager - 表格正则规则管理器 (Phase 1.2)
  // ========================================
  const RegexTransformationManager = createRegexTransformationManager({
    filterDeprecatedBuiltinRegexRules: (...a: any[]) => filterDeprecatedBuiltinRegexRules(...a),
    getRegexPresetManager: () => RegexPresetManager,
    STORAGE_KEY_REGEX_ENABLED: STORAGE_KEY_REGEX_ENABLED,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
  });
  // ========================================
  // RegexPresetManager - 表格正则预设管理器 (Phase 1.3)
  // ========================================
  const RegexPresetManager = createRegexPresetManager({
    compareVersion: (...a: any[]) => compareVersion(...a),
    filterDeprecatedBuiltinRegexRules: (...a: any[]) => filterDeprecatedBuiltinRegexRules(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    getRegexTransformationManager: () => RegexTransformationManager,
    BUILTIN_REGEX_RULES: BUILTIN_REGEX_RULES,
    STORAGE_KEY_REGEX_ACTIVE_PRESET: STORAGE_KEY_REGEX_ACTIVE_PRESET,
    STORAGE_KEY_REGEX_PRESETS: STORAGE_KEY_REGEX_PRESETS,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
  });
  // ========================================
  // RegexTransformationEngine - 正则转换引擎 (Phase 2.1)
  // ========================================
  const RegexTransformationEngine = createRegexTransformationEngine({
    getRegexTransformationManager: () => RegexTransformationManager,
  });
  // ========================================
  // ValidationEngine - 数据验证引擎
  // ========================================
  const ValidationEngine = createValidationEngine({
    isNpcTableName: (...a: any[]) => isNpcTableName(...a),
    getValidationRuleManager: () => ValidationRuleManager,
  });
  // ========================================
  // LocalAvatarDB - 本地头像 IndexedDB 存储
  // ========================================
  // ========================================
  // FavoritesDB - 收藏夹 IndexedDB 存储
  // ========================================
  /**
   * @typedef {Object} FavoriteItem
   * @property {string} id - UUID
   * @property {string[]} header - 列名数组 (不含首列null)
   * @property {(string|number)[]} rowData - 值数组 (与header对应)
   * @property {string[]} tags - 用户标签
   * @property {number} createdAt - 创建时间戳
   * @property {number} updatedAt - 最后修改时间戳
   * @property {{tableUid: string, tableName: string, chatId: string}} [sourceInfo] - 来源信息
   */
  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  const DiceHistoryStatsDB = createDiceHistoryStatsDB({
    getDiceStatsContext: (...a: any[]) => getDiceStatsContext(...a),
  });
  // ========================================
  // FavoritesManager - 收藏夹业务逻辑层
  // ========================================

  interface TableCompatibility {
    tableUid: string;
    tableName: string;
    mode: 'strict' | 'loose' | 'incompatible';
    matchedCols: string[];
    unmatchedCols: string[];
    matchRatio: number;
  }


  // [新增] 获取 SillyTavern 用户头像 URL
  const getUserAvatarUrl = createGetUserAvatarUrl({

  });

  // [新增] 获取主角名字（用于判断是否是主角）
  const getPlayerName = createGetPlayerName({
    getTableData: (...a: any[]) => getTableData(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // [新增] 获取 SillyTavern Persona 名称（用于显示）
  const getPersonaName = createGetPersonaName({

  });

  // [新增] 获取用于显示的玩家名称（优先 Persona，其次主角表，最后默认值）
  const getDisplayPlayerName = createGetDisplayPlayerName({
    getPersonaName: (...a: any[]) => getPersonaName(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
  });

  // [新增] 替换文本中的用户占位符为 Persona 名称（仅用于显示）
  const replaceUserPlaceholders = createReplaceUserPlaceholders({
    getDisplayPlayerName: (...a: any[]) => getDisplayPlayerName(...a),
  });

  const USER_AVATAR_LOOKUP_KEYS = ['{{user}}', '<user>'] as const;

  const getAvatarLookupNames = createGetAvatarLookupNames({
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getPersonaName: (...a: any[]) => getPersonaName(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
    USER_AVATAR_LOOKUP_KEYS: USER_AVATAR_LOOKUP_KEYS,
  });

  type DiceStatsScope = 'chat' | 'character' | 'global';

  interface DiceStatsContext {
    chatId: string;
    characterId: string;
  }

  const getDiceStatsContext = createGetDiceStatsContext({

  });

  const DICE_STATS_SCOPE_LABELS = createDiceStatsScopeLabels({

  });

  const isDiceStatsScopeUnavailable = createIsDiceStatsScopeUnavailable({

  });

  const renderDiceHistoryStatsHtml = createRenderDiceHistoryStatsHtml({
    getDiceStatsContext: (...a: any[]) => getDiceStatsContext(...a),
    isDiceStatsScopeUnavailable: (...a: any[]) => isDiceStatsScopeUnavailable(...a),
    DICE_STATS_SCOPE_LABELS: DICE_STATS_SCOPE_LABELS,
  });

  type AvatarImageColorSource = 'manual' | 'auto';

  const normalizeAvatarHexColor = createNormalizeAvatarHexColor({

  });

  const clampAvatarNumber = createClampAvatarNumber({

  });

  const rgbToAvatarHex = createRgbToAvatarHex({

  });

  const avatarHexToRgb = (value: unknown): { r: number; g: number; b: number } | null => {
    const color = normalizeAvatarHexColor(value);
    if (!color) return null;
    return {
      r: Number.parseInt(color.slice(1, 3), 16),
      g: Number.parseInt(color.slice(3, 5), 16),
      b: Number.parseInt(color.slice(5, 7), 16),
    };
  };

  const rgbToAvatarHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;
    const l = (max + min) / 2;
    if (delta === 0) return { h: 0, s: 0, l };
    const s = delta / (1 - Math.abs(2 * l - 1));
    let h = 0;
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
    return { h: (h * 60 + 360) % 360, s, l };
  };

  const avatarHexToHsl = (value: unknown): { h: number; s: number; l: number } | null => {
    const rgb = avatarHexToRgb(value);
    if (!rgb) return null;
    return rgbToAvatarHsl(rgb.r, rgb.g, rgb.b);
  };

  const hslToAvatarHex = createHslToAvatarHex({
    rgbToAvatarHex: (...a: any[]) => rgbToAvatarHex(...a),
  });

  const getAvatarFallbackColor = createGetAvatarFallbackColor({
    hslToAvatarHex: (...a: any[]) => hslToAvatarHex(...a),
  });

  const isLikelyAvatarSkinTone = createIsLikelyAvatarSkinTone({

  });

  const normalizeInferredAvatarColor = createNormalizeInferredAvatarColor({
    hslToAvatarHex: (...a: any[]) => hslToAvatarHex(...a),
    rgbToAvatarHsl: (...a: any[]) => rgbToAvatarHsl(...a),
  });

  const loadAvatarImageForColor = createLoadAvatarImageForColor({

  });

  const inferAvatarImageColor = createInferAvatarImageColor({
    clampAvatarNumber: (...a: any[]) => clampAvatarNumber(...a),
    isLikelyAvatarSkinTone: (...a: any[]) => isLikelyAvatarSkinTone(...a),
    loadAvatarImageForColor: (...a: any[]) => loadAvatarImageForColor(...a),
    normalizeInferredAvatarColor: (...a: any[]) => normalizeInferredAvatarColor(...a),
    rgbToAvatarHsl: (...a: any[]) => rgbToAvatarHsl(...a),
  });

  // 头像管理工具（支持裁剪偏移）
  const AvatarManager = createAvatarManager({
    storeGet: (key: string, fallback: any) => Store.get(key, fallback),
    storeSet: (key: string, value: any) => Store.set(key, value),
    storageKey: STORAGE_KEY_AVATAR_MAP,
    normalizeStorableImageUrl: (url: unknown) => normalizeStorableImageUrl(url),
    normalizeAvatarHexColor: (value: unknown) => normalizeAvatarHexColor(value),
    getAvatarFallbackColor: (name: unknown) => getAvatarFallbackColor(name),
    getAvatarLookupNames: (name: unknown) => getAvatarLookupNames(name),
    localAvatarGet: (name: any) => LocalAvatarDB.get(name),
    localAvatarHas: (name: any) => LocalAvatarDB.has(name),
    localAvatarSave: (name: any, blob: any) => LocalAvatarDB.save(name, blob),
    localAvatarDelete: (name: any) => LocalAvatarDB.delete(name),
  });

  // ========================================
  // 角色名称解析与别名系统
  // ========================================

  /**
   * 解析逗号分隔的角色名称，提取主名称（display name）和别名
   * 规则：最长的名称为主key，长度相同时靠前的优先
   * 例如："千早爱音,千早,爱音" → { displayName: "千早爱音", aliases: ["千早", "爱音"] }
   * 例如："奥兹艾萨克，奥兹，艾萨克" → { displayName: "奥兹艾萨克", aliases: ["奥兹", "艾萨克"] }
   */
  const NameAliasRegistry = createNameAliasRegistryInstance({
    getAvatarManager: () => AvatarManager,
  });

  const USER_NODE_KEY = '{{user}}';
  const USER_PLACEHOLDER_KEYS = [USER_NODE_KEY, '<user>'];

  const isUserPlaceholderKey = createIsUserPlaceholderKey({
    getUSER_PLACEHOLDER_KEYS: () => USER_PLACEHOLDER_KEYS,
  });

  type DiceTableCell = string | number | null;
  type DiceRawSheet = { name?: string; content?: DiceTableCell[][] };
  type DiceRawData = Record<string, DiceRawSheet>;

  interface CharacterAttributeRowLookup {
    sheetKey: string;
    sheet: { name?: string; content: DiceTableCell[][] };
    rowIndex: number;
    headers: DiceTableCell[];
    isUser: boolean;
  }

  const normalizeCharacterNameForCompare = createNormalizeCharacterNameForCompare({

  });

  const pushUniqueNameCandidate = createPushUniqueNameCandidate({

  });

  const getAvatarManualAliases = createGetAvatarManualAliases({
    getAvatarManager: () => AvatarManager,
  });

  const getCharacterNameCandidates = createGetCharacterNameCandidates({
    getAvatarManualAliases: (...a: any[]) => getAvatarManualAliases(...a),
    pushUniqueNameCandidate: (...a: any[]) => pushUniqueNameCandidate(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    NameAliasRegistry: NameAliasRegistry,
  });

  const getUserCharacterNameCandidates = createGetUserCharacterNameCandidates({
    getAvatarManualAliases: (...a: any[]) => getAvatarManualAliases(...a),
    getCharacterNameCandidates: (...a: any[]) => getCharacterNameCandidates(...a),
    getDisplayPlayerName: (...a: any[]) => getDisplayPlayerName(...a),
    getPersonaName: (...a: any[]) => getPersonaName(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
    pushUniqueNameCandidate: (...a: any[]) => pushUniqueNameCandidate(...a),
    getUSER_PLACEHOLDER_KEYS: () => USER_PLACEHOLDER_KEYS,
  });

  const isUserCharacterName = createIsUserCharacterName({
    getCharacterNameCandidates: (...a: any[]) => getCharacterNameCandidates(...a),
    getUserCharacterNameCandidates: (...a: any[]) => getUserCharacterNameCandidates(...a),
    normalizeCharacterNameForCompare: (...a: any[]) => normalizeCharacterNameForCompare(...a),
  });

  const resolveCanonicalCharacterName = createResolveCanonicalCharacterName({
    isUserCharacterName: (...a: any[]) => isUserCharacterName(...a),
    getNameAliasRegistry: () => NameAliasRegistry,
  });

  const characterNamesMatch = createCharacterNamesMatch({
    getCharacterNameCandidates: (...a: any[]) => getCharacterNameCandidates(...a),
    isUserCharacterName: (...a: any[]) => isUserCharacterName(...a),
    normalizeCharacterNameForCompare: (...a: any[]) => normalizeCharacterNameForCompare(...a),
  });

  const dialogueIndentRenderer = createDialogueIndentRenderer({
    getConfig: () => getConfig(),
    getDefaultTheme: () => String(DEFAULT_CONFIG.theme),
    getCachedRawData: () => cachedRawData_ACC.v,
    getTableData: () => getTableData({ silent: true }),
    processJsonData: json => processJsonData(json),
    rebuildNameAliases: tables => NameAliasRegistry.rebuild(tables),
    getNameAliases: name => NameAliasRegistry.getAliases(name),
    resolveNameAlias: name => NameAliasRegistry.resolve(name),
    getAvatarLookupNames: name => getAvatarLookupNames(name),
    getAvatarAll: () => AvatarManager.getAll() as Record<string, { aliases?: unknown[] } | undefined>,
    getAvatarPrimaryName: name => AvatarManager.getPrimaryName(name),
    getAvatarAsync: name => AvatarManager.getAsync(name),
    getAvatarOffsetX: name => AvatarManager.getOffsetX(name),
    getAvatarOffsetY: name => AvatarManager.getOffsetY(name),
    getAvatarScale: name => AvatarManager.getScale(name),
    getAvatarImageColor: name => AvatarManager.getImageColor(name),
    getLocalAvatarNames: () => LocalAvatarDB.getAllNames() as Promise<string[]>,
    getTagFilter: () => RenderPresetManager.getDialogueIndentTagFilter(),
    isCharacterTable,
    findNameColumnIndex,
    getCharacterNameCandidates,
    getDisplayName,
    replaceUserPlaceholders: text => replaceUserPlaceholders(text),
    escapeHtml,
    formatMessageBeforeDialogueIndent: text => {
      let processedText = text;
      if (typeof substitudeMacros === 'function') {
        processedText = substitudeMacros(processedText);
      }
      if (typeof formatAsTavernRegexedString === 'function') {
        return String(formatAsTavernRegexedString(processedText, 'ai_output', 'display', { depth: 0 }));
      }
      return processedText;
    },
    formatRegexedMessageFragment: text => {
      if (typeof builtin !== 'undefined' && typeof builtin.renderMarkdown === 'function') {
        return builtin.renderMarkdown(text);
      }
      return escapeHtml(text).replace(/\n/g, '<br>');
    },
    getHostDocument: () => getTavernHostDocument(),
    getJQuery: () => $,
    retrieveDisplayedMessage: messageId => {
      if (typeof retrieveDisplayedMessage !== 'function') return null;
      try {
        return retrieveDisplayedMessage(messageId);
      } catch (error) {
        console.warn('[DICE]正文头像渲染获取显示楼层失败，改用选择器:', error);
        return null;
      }
    },
    emitMessageRendered: messageId => {
      try {
        const source = window.SillyTavern?.eventSource;
        const events = window.SillyTavern?.eventTypes || window.tavern_events;
        const eventName = events?.CHARACTER_MESSAGE_RENDERED;
        if (source && eventName) {
          void source.emit(eventName, Number(messageId));
        }
      } catch (error) {
        console.warn('[DICE]正文头像渲染通知前端块重新渲染失败:', error);
      }
    },
    getLatestAssistantMessage: () => {
      try {
        const messages = getChatMessages(-1);
        const latest = Array.isArray(messages) ? messages[0] : null;
        if (!latest || latest.role !== 'assistant' || latest.is_system || latest.is_hidden) return null;
        return latest;
      } catch (error) {
        console.warn('[DICE]正文头像渲染读取最新楼层失败:', error);
        return null;
      }
    },
    warn: (message, error) => console.warn(`[DICE]${message}:`, error),
  });

  const scheduleDialogueIndentRender = createScheduleDialogueIndentRender({
    getDialogueIndentRenderer: () => dialogueIndentRenderer,
  });
  const refreshDialogueIndentRender = createRefreshDialogueIndentRender({
    getDialogueIndentRenderer: () => dialogueIndentRenderer,
  });

  const isPlayerTableName = createIsPlayerTableName({

  });

  const isNpcLikeTableName = createIsNpcLikeTableName({

  });

  const findAttributeColumnIndices = createFindAttributeColumnIndices({

  });

  const pickFallbackAttributeColumn = createPickFallbackAttributeColumn({

  });

  const findPrimaryAttributeColumns = (headers: unknown[]): { baseColIndex: number; specialColIndex: number } => {
    let baseColIndex = -1;
    let specialColIndex = -1;

    headers.forEach((header, idx) => {
      const text = String(header || '');
      if (text.includes('基础属性')) {
        baseColIndex = idx;
      } else if (text.includes('特有属性') || text.includes('特别属性')) {
        specialColIndex = idx;
      }
    });

    if (baseColIndex < 0) {
      const genericCol = findAttributeColumnIndices(headers).find(col => {
        const text = String(headers[col] || '');
        return !text.includes('特有') && !text.includes('特别');
      });
      baseColIndex = genericCol ?? -1;
    }

    return { baseColIndex, specialColIndex };
  };

  const findCharacterAttributeRow = createFindCharacterAttributeRow({
    characterNamesMatch: (...a: any[]) => characterNamesMatch(...a),
    findAttributeColumnIndices: (...a: any[]) => findAttributeColumnIndices(...a),
    isNpcLikeTableName: (...a: any[]) => isNpcLikeTableName(...a),
    isPlayerTableName: (...a: any[]) => isPlayerTableName(...a),
    isUserCharacterName: (...a: any[]) => isUserCharacterName(...a),
  });

  const resolveUserGraphName = createResolveUserGraphName({
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getPersonaName: (...a: any[]) => getPersonaName(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
    isUserCharacterName: (...a: any[]) => isUserCharacterName(...a),
    isUserPlaceholderKey: (...a: any[]) => isUserPlaceholderKey(...a),
    AvatarManager: AvatarManager,
    NameAliasRegistry: NameAliasRegistry,
    USER_NODE_KEY: USER_NODE_KEY,
    USER_PLACEHOLDER_KEYS: USER_PLACEHOLDER_KEYS,
  });

  // 渲染图标：支持 fa:xxx 简写格式和原生emoji
  const renderIcon = createRenderIcon({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const getLocationEmoji = createGetLocationEmoji({

  });

  // 获取地点名的所有候选emoji（用于去重分配）
  const getEmojiCandidates = createGetEmojiCandidates({

  });

  // 批量分配emoji，实现去重（最短名称优先）
  const resolveBatchLocationEmojis = createResolveBatchLocationEmojis({
    getEmojiCandidates: (...a: any[]) => getEmojiCandidates(...a),
  });

  const getElementEmoji = createGetElementEmoji({

  });

  const renderThemeIconContent = createRenderThemeIconContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const createCustomTableNameIconContext = createCreateCustomTableNameIconContext({

  });

  const createGlobalInteractionCustomTableNameIconContext = createCreateGlobalInteractionCustomTableNameIconContext({
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    resolveDashboardCustomTableNameIconContextInfo: (...a: any[]) => resolveDashboardCustomTableNameIconContextInfo(...a),
    resolveGlobalInteractionSectionMeta: (...a: any[]) => resolveGlobalInteractionSectionMeta(...a),
  });

  const renderAsyncImageIconSlotContent = createRenderAsyncImageIconSlotContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const renderCustomTableNameIconContent = createRenderCustomTableNameIconContent({
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
    renderAsyncImageIconSlotContent: (...a: any[]) => renderAsyncImageIconSlotContent(...a),
    resolveCustomTableNameIcon: (...a: any[]) => resolveCustomTableNameIcon(...a),
  });

  const getGachaItemCustomTableNameIconContext = createGetGachaItemCustomTableNameIconContext({
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    getGachaRewardParseResult: (...a: any[]) => getGachaRewardParseResult(...a),
    getGachaRewardTargetOptions: (...a: any[]) => getGachaRewardTargetOptions(...a),
    getGachaRewardTargetTableLabel: (...a: any[]) => getGachaRewardTargetTableLabel(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  const renderGachaItemIconContent = createRenderGachaItemIconContent({
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderThemeIconContent: (...a: any[]) => renderThemeIconContent(...a),
  });

  const applyAsyncImageUrlToElement = createApplyAsyncImageUrlToElement({
    isRenderableImageUrlValid: (...a: any[]) => isRenderableImageUrlValid(...a),
  });

  const hydrateCustomTableNameIconsIn = createHydrateCustomTableNameIconsIn({
    applyAsyncImageUrlToElement: (...a: any[]) => applyAsyncImageUrlToElement(...a),
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
  });

  // ========================================
  // MVU 变量可视化模块 v2.0
  // 独立模块 - 卡片分组式 UI
  // ========================================
  const MvuModule = createMvuModule({
    canWriteMvuPanel: (...a: any[]) => canWriteMvuPanel(...a),
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getTableHeights: (...a: any[]) => getTableHeights(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    isNumericCell: (...a: any[]) => isNumericCell(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    saveTableHeights: (...a: any[]) => saveTableHeights(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDicePanel: (...a: any[]) => showDicePanel(...a),
    RenderPresetManager: RenderPresetManager,
  });
  // MVU 变量可视化模块结束
  // 默认骰子配置（COC规则）

  const getDiceConfig = createGetDiceConfig({

  });
  const saveDiceConfig = createSaveDiceConfig({
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
  });

  // [新增] 隐藏用户消息中的投骰结果（也处理输入栏）
  const hideDiceResultsInUserMessages = createHideDiceResultsInUserMessages({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    createMetaCheckResultRegex: (...a: any[]) => createMetaCheckResultRegex(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    storeTextareaDiceCache: (...a: any[]) => storeTextareaDiceCache(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });

  // ========================================
  // 高级骰子预设系统
  // ========================================

  // [x4-a] 高级骰子预设系统类型已迁出：见 ./shared/advanced-preset-types.ts
  const isAttributeQuickSelectTarget = createIsAttributeQuickSelectTarget({

  });

  const cloneQuickSelectNameMapping = createCloneQuickSelectNameMapping({

  });

  const normalizeAttributeQuickSelectConfig = createNormalizeAttributeQuickSelectConfig({
    cloneQuickSelectNameMapping: (...a: any[]) => cloneQuickSelectNameMapping(...a),
    isAttributeQuickSelectTarget: (...a: any[]) => isAttributeQuickSelectTarget(...a),
  });

  const applyAttributeQuickSelectDefaults = createApplyAttributeQuickSelectDefaults({
    normalizeAttributeQuickSelectConfig: (...a: any[]) => normalizeAttributeQuickSelectConfig(...a),
  });

  // 内置属性规则预设


  // 属性预设管理器
  const AttributePresetManager = createAttributePresetManager({
    applyAttributeQuickSelectDefaults: (...a: any[]) => applyAttributeQuickSelectDefaults(...a),
    compareVersion: (...a: any[]) => compareVersion(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    updateTemplateForActivePreset: (...a: any[]) => updateTemplateForActivePreset(...a),
    BUILTIN_ATTRIBUTE_PRESETS: BUILTIN_ATTRIBUTE_PRESETS,
    STORAGE_KEY_ACTIVE_ATTR_PRESET: STORAGE_KEY_ACTIVE_ATTR_PRESET,
    STORAGE_KEY_ATTRIBUTE_PRESETS: STORAGE_KEY_ATTRIBUTE_PRESETS,
  });

  // ========================================
  // 高级骰子预设管理器
  // ========================================


  const ADVANCED_PRESET_EXPORT_FORMAT = 'acu_advanced_preset_v1';
  const ADVANCED_PRESET_AGENT_FORMAT = 'acu_advanced_preset_agent_v1';

  interface AdvancedPresetAgentTestCase {
    name?: string;
    context?: Record<string, unknown>;
    expectedOutcomeId?: string;
    expectedOutcomeName?: string;
  }

  interface AdvancedPresetAgentDocument {
    format: typeof ADVANCED_PRESET_AGENT_FORMAT;
    preset: Record<string, unknown>;
    tests?: AdvancedPresetAgentTestCase[];
    notes?: string | string[];
  }

  interface AdvancedPresetValidationIssue {
    path: string;
    message: string;
  }

  interface AdvancedPresetParseResult {
    preset: AdvancedDicePreset;
    tests: AdvancedPresetAgentTestCase[];
    notes: string[];
    sourceFormat: string;
    importedVersion: string;
    needsUpdate: boolean;
    warnings: AdvancedPresetValidationIssue[];
  }

  // [x4-d] 高级预设/属性预设装配已迁出：见 ./wiring/advanced-preset-wiring.ts
  const { AdvancedDicePresetManager, BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS, TableTemplateRequirementPresetManager, applyAdvancedPresetOutcomePolicy, buildActionPresetAgentPrompt, buildDashboardPresetAgentPrompt, buildGachaCatalogAgentPrompt, buildNewTableTemplateRequirementPresetJsoncTemplate, buildRenderPresetAgentPrompt, buildTableTemplateRequirementPresetAgentPrompt, getAdvancedPresetDisplayOutcome, getAdvancedPresetErrorMessage, getCheckSuggestionPresetById, getTableTemplateRequirementPresetStats, parseAdvancedPresetText, parseTableTemplateRequirementPresetJson, updateTemplateForActivePreset } = createAdvancedPresetWiring({ ADVANCED_PRESET_AGENT_FORMAT, ADVANCED_PRESET_EXPORT_FORMAT, AttributePresetManager, compareVersion, evaluateCondition: (...a: any[]) => evaluateCondition(...a), evaluateOutcomes: (...a: any[]) => evaluateOutcomes(...a), generateRPGAttributes: (...a: any[]) => generateRPGAttributes(...a), getCore: (...a: any[]) => getCore(...a), getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a), isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a), parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a), parseJsoncValue: (...a: any[]) => parseJsoncValue(...a) });

  // ========================================
  // 交互规则预设系统
  // ========================================

  // ActionPresetManager 类型定义（仅用于文档，实际是 JS 对象）
  // interface ActionGroupPreset {
  //   format: 'acu_action_preset_v1';
  //   version: string;
  //   id: string;
  //   name: string;
  //   builtin: boolean;
  //   description?: string;
  //   rules: ActionRule[];
  // }
  // interface ActionRule {
  //   table_keywords: string[];
  //   actions: ActionItem[];
  // }
  // interface ActionItem {
  //   label: string;
  //   icon?: string;
  //   template?: string;
  // }

  // 内置默认交互规则预设


  const ActionPresetManager = createActionPresetManager({
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    BUILTIN_ACTION_PRESETS: BUILTIN_ACTION_PRESETS,
    STORAGE_KEY_ACTION_PRESETS: STORAGE_KEY_ACTION_PRESETS,
    STORAGE_KEY_ACTIVE_ACTION_PRESET: STORAGE_KEY_ACTIVE_ACTION_PRESET,
  });

  // ========================================
  // 疯狂模式系统
  // ========================================

  // 获取疯狂模式配置
  const getCrazyModeConfig = createGetCrazyModeConfig({

  });

  // 保存疯狂模式配置
  const saveCrazyModeConfig = createSaveCrazyModeConfig({

  });

  // 判断是否触发疯狂模式
  const shouldTriggerCrazyMode = createShouldTriggerCrazyMode({
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
  });

  // 选择投骰类型
  const selectCrazyRollType = createSelectCrazyRollType({

  });

  // 根据权重随机选择
  const weightedRandomSelect = createWeightedRandomSelect({

  });

  // 选择参与者
  const selectCrazyParticipant = createSelectCrazyParticipant({
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
    getDisplayPlayerName: (...a: any[]) => getDisplayPlayerName(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    weightedRandomSelect: (...a: any[]) => weightedRandomSelect(...a),
    getDashboardDataParser: () => DashboardDataParser,
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // 选择检定属性
  const selectCrazyAttribute = createSelectCrazyAttribute({
    getRandomSkillPool: (...a: any[]) => getRandomSkillPool(...a),
    AttributePresetManager: AttributePresetManager,
  });

  // 根据预设执行疯狂模式投骰
  const crazyRollWithPreset = createCrazyRollWithPreset({

  });

  // 判断检定结果 (保留用于无预设时的兼容)
  const judgeCrazyRollResult = createJudgeCrazyRollResult({

  });

  // 生成疯狂骰子结果
  const generateCrazyRoll = createGenerateCrazyRoll({
    crazyRollWithPreset: (...a: any[]) => crazyRollWithPreset(...a),
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
    selectCrazyAttribute: (...a: any[]) => selectCrazyAttribute(...a),
    selectCrazyParticipant: (...a: any[]) => selectCrazyParticipant(...a),
    selectCrazyRollType: (...a: any[]) => selectCrazyRollType(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
  });


  /**
   * 解析并计算公式（支持变量引用）
   * @param formula 公式字符串，如 "力量/2+1d10" 或 "3d6*5"
   * @param context 变量上下文，如 { 力量: 50, 敏捷: 40 }
   * @returns 计算结果（整数）
   */
  const evaluateFormula = createEvaluateFormula({

  });

  /**
   * 评估条件表达式（支持比较运算和逻辑运算）
   * @param {string} formula 表达式字符串
   * @param {Record<string, number>} context 变量上下文
   * @returns {{success: boolean, value?: number | boolean, error?: string}}
   */
  const evaluateCondition = createEvaluateCondition({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });

  const evaluateConditionNumber = createEvaluateConditionNumber({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
  });

  /**
   * 判断条件表达式是否为复杂条件 (包含 && 或 ||)
   * @param expr - 条件表达式字符串
   * @returns 如果包含 && 或 || 返回 true, 否则返回 false
   */
  const isComplexCondition = createIsComplexCondition({

  });

  /**
   * 评估多级结果
   * @param outcomes - outcomes 数组 (会被排序)
   * @param context - 上下文对象 {$roll, $attr, $dc, $mod, ...}
   * @returns 匹配的 outcome (如果所有条件都不满足,返回最低优先级的兜底 outcome)
   */
  const evaluateOutcomes = createEvaluateOutcomes({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
  });

  // 默认输出模板
  const DEFAULT_OUTPUT_TEMPLATE = createDefaultOutputTemplate({

  });

  // 默认对抗检定输出模板
  const DEFAULT_CONTEST_OUTPUT_TEMPLATE = createDefaultContestOutputTemplate({

  });

  /**
   * 格式化输出模板
   * @param template - 模板字符串
   * @param context - 变量上下文
   * @returns 格式化后的文本
   */
  const formatOutputTemplate = createFormatOutputTemplate({

  });

  /**
   * 生成单个属性值，应用范围限制
   * @param formula 公式字符串
   * @param range 可选范围 [min, max]
   * @param context 变量上下文
   * @returns 属性值
   */
  const generateAttributeValue = createGenerateAttributeValue({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });

  // ========================================
  // 仪表盘统一配置中心
  // ========================================
  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  const DASHBOARD_PRESET_FORMAT = 'acu_dashboard_preset_v1';
  const DASHBOARD_DEFAULT_PRESET_ID = '__builtin_dashboard_default__';
  const DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY = 'relationshipGraph';
  const DASHBOARD_PRESET_MODULE_KEYS = ['global', 'player', 'location', 'npc', 'quest', 'bag', 'equip'] as const;
  const DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES = createDashboardRelationshipGraphSourceModes({

  });
  const DASHBOARD_PRESET_FILTER_KEYS = createDashboardPresetFilterKeys({

  });
  const DASHBOARD_PRESET_ADDITIONAL_COLUMNS = createDashboardPresetAdditionalColumns({

  });



  let dashboardRuntimeConfigCache: DashboardConfigMap | null = null;

  const cloneDashboardConfig = createCloneDashboardConfig({

  });

  const createDashboardPresetModulesFromConfig = createCreateDashboardPresetModulesFromConfig({
    DASHBOARD_PRESET_FILTER_KEYS: DASHBOARD_PRESET_FILTER_KEYS,
    DASHBOARD_PRESET_MODULE_KEYS: DASHBOARD_PRESET_MODULE_KEYS,
  });

  const cloneDashboardPresetModules = createCloneDashboardPresetModules({

  });

  const createBuiltinDashboardPreset = createCreateBuiltinDashboardPreset({
    createDashboardPresetModulesFromConfig: (...a: any[]) => createDashboardPresetModulesFromConfig(...a),
    getDASHBOARD_DEFAULT_PRESET_ID: () => DASHBOARD_DEFAULT_PRESET_ID,
    getDASHBOARD_PRESET_FORMAT: () => DASHBOARD_PRESET_FORMAT,
  });

  const isRecordValue = createIsRecordValue({

  });

  const normalizeDashboardKeywordArray = createNormalizeDashboardKeywordArray({

  });

  const normalizeDashboardOptionalStringArray = createNormalizeDashboardOptionalStringArray({

  });

  const normalizeDashboardPresetFilters = createNormalizeDashboardPresetFilters({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeDashboardOptionalStringArray: (...a: any[]) => normalizeDashboardOptionalStringArray(...a),
    DASHBOARD_PRESET_FILTER_KEYS: DASHBOARD_PRESET_FILTER_KEYS,
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
  });

  const normalizeDashboardRelationshipGraphConfig = createNormalizeDashboardRelationshipGraphConfig({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeDashboardKeywordArray: (...a: any[]) => normalizeDashboardKeywordArray(...a),
    DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES: DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES,
  });

  const stripJsonComments = createStripJsonComments({

  });

  const JSONC_FILE_ACCEPT = '.json,.jsonc,application/json,application/jsonc';
  const JSON_FILE_MIME = 'application/json;charset=utf-8';
  const JSONC_FILE_MIME = 'application/jsonc;charset=utf-8';
  const MARKDOWN_FILE_MIME = 'text/markdown;charset=utf-8';

  interface TextFileSelection {
    file: File;
    text: string;
  }

  interface DownloadTextFileOptions {
    content: string;
    filename: string;
    mimeType: string;
  }

  interface JsoncEditorValidationOptions<T> {
    text: string;
    emptyMessage?: string;
    parse: (text: string) => T;
    successMessage: (parsed: T) => string;
    errorMessage?: (error: unknown) => string;
    logLabel: string;
  }

  interface JsoncDocumentParseOptions<T> {
    text: string;
    emptyMessage?: string;
    invalidJsonMessage?: string;
    validate: (value: unknown) => T;
  }

  // [x4-k] 核心运行时/工具装配已迁出：见 ./wiring/core-runtime-wiring.ts
  const { ACTION_BUTTONS, DashboardDataParser, DashboardPresetManager, FONTS, THEMES, UpdateController, buildGlobalInteractionGroups, clearModalStack, collectHostAndLocalNodes, createAutoRegexTransformKey, createDashboardPresetEditorTemplate, createElementFromHtml, createGlobalInteractionSections, debugGlobalInteraction, dedupeInteractionActions, downloadAiPromptFile, downloadJsonFile, downloadJsoncFile, executeTableInteractionAction, extractNumericValue, getActiveDashboardRelationshipGraphSources, getCore, getCurrentContextFingerprint, getDashboardModuleConfig, getDatabaseManualUpdateErrorMessage, getIconForTableName, getInteractOptionsForRow, getJsonLikeErrorMessage, getNavigationFontMetrics, getPendingDeletions, getResultBadgeClass, getTavernHostDocument, getTavernHostWindow, isCustomTableNameIconImageUrlValid, isNumericCell, isRecord, isTwoDimensionalArray, normalizeCollapseStyle, normalizeInteractionLabel, openDatabaseInterface, openDatabaseVisualizerInterface, parseAttributeString, parseDashboardPresetJson, parseJsoncDocument, parseJsoncRecord, parseJsoncValue, parseRelationshipString, pickTextFile, popModal, pushModal, readTextFile, rememberAutoRegexTransform, resolveCustomTableNameIcon, resolveDashboardCustomTableNameIconContextInfo, resolveGlobalInteractionSectionMeta, runDatabaseManualUpdate, shouldSkipAutoRegexTransform, showCustomTableNameIconManager, showDatabaseManualUpdateFailure, showDiceSystemConfirmDialog, showDiceSystemInputDialog, updateSaveButtonState, validateJsoncEditorConfig, _boundRenderHandler_ACC, _boundReviewBaselineHandler_ACC, cachedRawData_ACC, currentDiffMap_ACC, hasUnsavedChanges_ACC, isAutoTransforming_ACC, isEditingOrder_ACC, isInitialized_ACC, isSaving_ACC, isSettingsOpen_ACC, lastOptionHash_ACC, observer_ACC, optionPanelVisible_ACC, saveQueue_ACC, tablePageStates_ACC, tableScrollStates_ACC, tableSearchStates_ACC } = createCoreRuntimeWiring({ ActionPresetManager, DASHBOARD_DEFAULT_PRESET_ID, DASHBOARD_PRESET_ADDITIONAL_COLUMNS, DASHBOARD_PRESET_FILTER_KEYS, DASHBOARD_PRESET_FORMAT, DASHBOARD_PRESET_MODULE_KEYS, DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY, JSONC_FILE_ACCEPT, JSONC_FILE_MIME, JSON_FILE_MIME, MARKDOWN_FILE_MIME, ValidationEngine, ValidationRuleManager, bindEvents: (...a: any[]) => bindEvents(...a), bindGlobalInteractionEvents: (...a: any[]) => bindGlobalInteractionEvents(...a), bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a), cloneDashboardConfig, cloneDashboardPresetModules, createBuiltinDashboardPreset, escapeHtml, formatCssImageUrl, getConfig: (...a: any[]) => getConfig(...a), getRemoteImageUrlValidationError, getTableData: (...a: any[]) => getTableData(...a), getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a), hydrateCustomTableNameIconsIn, isNpcLikeTableName, isPlayerTableName, isRecordValue, loadDashboardNpcAvatars: (...a: any[]) => loadDashboardNpcAvatars(...a), loadSnapshot: (...a: any[]) => loadSnapshot(...a), normalizeDashboardKeywordArray, normalizeDashboardPresetFilters, normalizeDashboardRelationshipGraphConfig, processJsonData: (...a: any[]) => processJsonData(...a), refreshChangesPanel: (...a: any[]) => refreshChangesPanel(...a), renderDashboard: (...a: any[]) => renderDashboard(...a), renderGlobalInteractionsPanel: (...a: any[]) => renderGlobalInteractionsPanel(...a), renderInterface: (...a: any[]) => renderInterface(...a), setupOverlayClose, showDicePanel: (...a: any[]) => showDicePanel(...a), smartInsertToTextarea, stripJsonComments, dashboardRuntimeConfigCache_ACC: { get v(){ return dashboardRuntimeConfigCache; }, set v(x){ dashboardRuntimeConfigCache = x; } } });

  const handleCustomTableNameIconImageDBPagehide = createHandleCustomTableNameIconImageDBPagehide({

  });

  window.addEventListener('pagehide', handleCustomTableNameIconImageDBPagehide, { once: true });

  const isOptionTableName = tableName => String(tableName || '').includes('选项');
  const isCheckSuggestionTableName = tableName => String(tableName || '').includes('检定建议');

  const getOptionItemsFromTable = createGetOptionItemsFromTable({

  });

  const renderOptionButtonHtml = createRenderOptionButtonHtml({
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const renderCheckSuggestionOptionButtonHtml = createRenderCheckSuggestionOptionButtonHtml({
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const getCheckSuggestionItemsFromTable = createGetCheckSuggestionItemsFromTable({

  });

  const getBadgeStyle = createGetBadgeStyle({

  });

  interface RenderDataCardCellOptions {
    rawHeaderName: string;
    cell: unknown;
    isFieldLocked?: boolean;
    diceIconFontSize?: string;
    numericDiceMarginLeft?: boolean;
  }

  interface RenderDataCardCellResult {
    headerName: string;
    contentHtml: string;
    hideLabel: boolean;
    shouldRender: boolean;
  }

  type RenderRelationshipItem = {
    name: string;
    relation: string;
  };

  const getRenderPresetBadgeStyle = createGetRenderPresetBadgeStyle({

  });

  const parseRenderPresetAttributes = createParseRenderPresetAttributes({
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
  });

  const renderInlineQuickCheckButton = createRenderInlineQuickCheckButton({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    RenderPresetManager: RenderPresetManager,
  });

  const renderDataCardCellContent = createRenderDataCardCellContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    extractNumericValue: (...a: any[]) => extractNumericValue(...a),
    getRenderPresetBadgeStyle: (...a: any[]) => getRenderPresetBadgeStyle(...a),
    isNumericCell: (...a: any[]) => isNumericCell(...a),
    parseRelationshipString: (...a: any[]) => parseRelationshipString(...a),
    parseRenderPresetAttributes: (...a: any[]) => parseRenderPresetAttributes(...a),
    renderInlineQuickCheckButton: (...a: any[]) => renderInlineQuickCheckButton(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    RenderPresetManager: RenderPresetManager,
  });

  // [优化] 统一存储封装 (带静默自动清理)

  const getActiveTabState = createGetActiveTabState({

  });
  const saveActiveTabState = createSaveActiveTabState({
  });

  let cleanupGlobalInteractionOutsideCapture: (() => void) | null = null;

  const clearGlobalInteractionOutsideCapture = createClearGlobalInteractionOutsideCapture({
    getCleanupGlobalInteractionOutsideCapture: () => cleanupGlobalInteractionOutsideCapture,
    setCleanupGlobalInteractionOutsideCapture: (v: any) => { cleanupGlobalInteractionOutsideCapture = v; },
  });

  const cleanupGlobalInteractionFloatingMenus = createCleanupGlobalInteractionFloatingMenus({
    clearGlobalInteractionOutsideCapture: (...a: any[]) => clearGlobalInteractionOutsideCapture(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // [修复] 统一清理所有面板状态，避免状态残留导致内容错乱
  const clearAllPanelStates = createClearAllPanelStates({
    cleanupGlobalInteractionFloatingMenus: (...a: any[]) => cleanupGlobalInteractionFloatingMenus(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
  });

  // [修复] MVU 面板异步回调防竞态：只有当前仍处于 MVU 标签且无更高优先级面板激活时才允许写入
  const canWriteMvuPanel = createCanWriteMvuPanel({
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getMvuModule: () => MvuModule,
  });

  const getSavedTableOrder = createGetSavedTableOrder({

  });
  const saveTableOrder = createSaveTableOrder({
  });
  const getStableTableSort = createGetStableTableSort({
    getSavedTableOrder: (...a: any[]) => getSavedTableOrder(...a),
  });
  const ensureCanonicalTableOrder = createEnsureCanonicalTableOrder({
    getStableTableSort: (...a: any[]) => getStableTableSort(...a),
    getSavedTableOrder: (...a: any[]) => getSavedTableOrder(...a),
    saveTableOrder: (...a: any[]) => saveTableOrder(...a),
  });

  const getCollapsedState = createGetCollapsedState({

  });
  const saveCollapsedState = createSaveCollapsedState({
  });
  // [新增] 选项面板独立折叠状态管理
  const getOptionsCollapsedState = createGetOptionsCollapsedState({

  });
  const saveOptionsCollapsedState = createSaveOptionsCollapsedState({
  });
  // [修改] 读取快照时，严格核对身份证 (Chat ID)
  const loadSnapshot = createLoadSnapshot({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });

  // [修改] 保存快照时，自动注入当前的身份证
  const saveSnapshot = createSaveSnapshot({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });
  const maybeRefreshReviewBaselineAtFillStart = createMaybeRefreshReviewBaselineAtFillStart({
    getTableData: (...a: any[]) => getTableData(...a),
    hasSheetKeys: (...a: any[]) => hasSheetKeys(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    countRuntimeDataChanges: (...a: any[]) => countRuntimeDataChanges(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
  });


  const saveCurrentDatabaseSnapshotAsReviewBaseline = createSaveCurrentDatabaseSnapshotAsReviewBaseline({
    getTableData: (...a: any[]) => getTableData(...a),
    hasSheetKeys: (...a: any[]) => hasSheetKeys(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
  });

  // --- [新增] 移植的辅助函数 ---
  const getTableHeights = createGetTableHeights({

  });
  const saveTableHeights = createSaveTableHeights({
  });
  const normalizePanelHeightValue = createNormalizePanelHeightValue({
    getMAX_PANEL_HEIGHT: () => MAX_PANEL_HEIGHT,
    getMIN_PANEL_HEIGHT: () => MIN_PANEL_HEIGHT,
  });

  const getPanelDisplayMaxHeight = createGetPanelDisplayMaxHeight({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getMAX_PANEL_HEIGHT: () => MAX_PANEL_HEIGHT,
    getPANEL_VIEWPORT_TOP_GUTTER: () => PANEL_VIEWPORT_TOP_GUTTER,
  });

  const applyPanelDisplayMaxHeight = createApplyPanelDisplayMaxHeight({
    getPanelDisplayMaxHeight: (...a: any[]) => getPanelDisplayMaxHeight(...a),
  });

  const clampPanelHeightToDisplay = createClampPanelHeightToDisplay({
    getPanelDisplayMaxHeight: (...a: any[]) => getPanelDisplayMaxHeight(...a),
    getMAX_PANEL_HEIGHT: () => MAX_PANEL_HEIGHT,
    getMIN_PANEL_HEIGHT: () => MIN_PANEL_HEIGHT,
  });

  const getStoredPanelHeight = createGetStoredPanelHeight({
    getTableHeights: (...a: any[]) => getTableHeights(...a),
    normalizePanelHeightValue: (...a: any[]) => normalizePanelHeightValue(...a),
  });

  const clearPanelRequestedHeight = createClearPanelRequestedHeight({
    applyPanelDisplayMaxHeight: (...a: any[]) => applyPanelDisplayMaxHeight(...a),
  });

  const setPanelRequestedHeight = createSetPanelRequestedHeight({
    getPanelDisplayMaxHeight: (...a: any[]) => getPanelDisplayMaxHeight(...a),
    clampPanelHeightToDisplay: (...a: any[]) => clampPanelHeightToDisplay(...a),
    clearPanelRequestedHeight: (...a: any[]) => clearPanelRequestedHeight(...a),
  });

  const applyStoredPanelHeight = createApplyStoredPanelHeight({
    clearPanelRequestedHeight: (...a: any[]) => clearPanelRequestedHeight(...a),
    getStoredPanelHeight: (...a: any[]) => getStoredPanelHeight(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
  });

  const getPanelDragStartHeight = createGetPanelDragStartHeight({
    clampPanelHeightToDisplay: (...a: any[]) => clampPanelHeightToDisplay(...a),
    getMIN_PANEL_HEIGHT: () => MIN_PANEL_HEIGHT,
  });

  const savePanelRequestedHeight = createSavePanelRequestedHeight({
    getTableHeights: (...a: any[]) => getTableHeights(...a),
    normalizePanelHeightValue: (...a: any[]) => normalizePanelHeightValue(...a),
    saveTableHeights: (...a: any[]) => saveTableHeights(...a),
  });

  const resetPanelRequestedHeight = createResetPanelRequestedHeight({
    clearPanelRequestedHeight: (...a: any[]) => clearPanelRequestedHeight(...a),
    getTableHeights: (...a: any[]) => getTableHeights(...a),
    saveTableHeights: (...a: any[]) => saveTableHeights(...a),
  });

  const getActivePanelHeightKey = createGetActivePanelHeightKey({
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
  });

  const getTableStyles = createGetTableStyles({

  });
  const saveTableStyles = createSaveTableStyles({
  });
  const getHiddenTables = createGetHiddenTables({

  });
  const saveHiddenTables = createSaveHiddenTables({
  });
  const getReverseTables = createGetReverseTables({

  });
  const saveReverseTables = createSaveReverseTables({
  });

  const normalizeTableNameList = createNormalizeTableNameList({

  });

  const getNormalizedReverseTables = createGetNormalizedReverseTables({
    getReverseTables: (...a: any[]) => getReverseTables(...a),
    normalizeTableNameList: (...a: any[]) => normalizeTableNameList(...a),
  });

  // 判断表格是否需要显示倒序按钮
  const shouldShowReverseButton = createShouldShowReverseButton({

  });

  // 判断表格当前是否为倒序
  const isTableReversed = createIsTableReversed({
    getNormalizedReverseTables: (...a: any[]) => getNormalizedReverseTables(...a),
  });

  const areAllTablesReversed = createAreAllTablesReversed({
    getNormalizedReverseTables: (...a: any[]) => getNormalizedReverseTables(...a),
    normalizeTableNameList: (...a: any[]) => normalizeTableNameList(...a),
  });

  const setAllTablesReverse = createSetAllTablesReverse({
    getNormalizedReverseTables: (...a: any[]) => getNormalizedReverseTables(...a),
    normalizeTableNameList: (...a: any[]) => normalizeTableNameList(...a),
    saveReverseTables: (...a: any[]) => saveReverseTables(...a),
  });

  // 切换表格倒序状态
  const toggleTableReverse = createToggleTableReverse({
    getNormalizedReverseTables: (...a: any[]) => getNormalizedReverseTables(...a),
    saveReverseTables: (...a: any[]) => saveReverseTables(...a),
  });
  // [新增] 根据角色名获取属性列表
  const getAttributesForCharacter = createGetAttributesForCharacter({
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
  });
  const normalizeAttributeName = createNormalizeAttributeName({

  });

  const resolveAttributeAliasName = createResolveAttributeAliasName({

    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    normalizeAttributeName: (...a: any[]) => normalizeAttributeName(...a),
  });

  const isSameAttributeAlias = createIsSameAttributeAlias({
    normalizeAttributeName: (...a: any[]) => normalizeAttributeName(...a),
  });

  const getAttributeEntryForCharacter = createGetAttributeEntryForCharacter({
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    resolveAttributeAliasName: (...a: any[]) => resolveAttributeAliasName(...a),
  });

  // [新增] 根据角色名和属性名获取属性值
  const getAttributeValue = createGetAttributeValue({
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
  });

  const pushDiceQuickSelectCharacter = createPushDiceQuickSelectCharacter({
    characterNamesMatch: (...a: any[]) => characterNamesMatch(...a),
  });

  const getDiceQuickSelectCharacterList = createGetDiceQuickSelectCharacterList({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getDashboardNpcListData: (...a: any[]) => getDashboardNpcListData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    pushDiceQuickSelectCharacter: (...a: any[]) => pushDiceQuickSelectCharacter(...a),
    DashboardDataParser: DashboardDataParser,
  });

  const getAdvancedPresetMappedTarget = createGetAdvancedPresetMappedTarget({
    isAttributeQuickSelectTarget: (...a: any[]) => isAttributeQuickSelectTarget(...a),
  });

  const getAttributePresetMappedTarget = createGetAttributePresetMappedTarget({
    normalizeAttributeQuickSelectConfig: (...a: any[]) => normalizeAttributeQuickSelectConfig(...a),
    isAttributeQuickSelectTarget: (...a: any[]) => isAttributeQuickSelectTarget(...a),
  });

  const isQuickSelectTargetAvailable = createIsQuickSelectTargetAvailable({

  });

  const resolveQuickSelectTarget = createResolveQuickSelectTarget({
    getAdvancedPresetMappedTarget: (...a: any[]) => getAdvancedPresetMappedTarget(...a),
    getAttributePresetMappedTarget: (...a: any[]) => getAttributePresetMappedTarget(...a),
    isQuickSelectTargetAvailable: (...a: any[]) => isQuickSelectTargetAvailable(...a),
    getAttributePresetManager: () => AttributePresetManager,
  });

  const formatSignedModifier = createFormatSignedModifier({

  });

  const getNamedCheckParamText = createGetNamedCheckParamText({

  });

  const buildCheckValueText = createBuildCheckValueText({
    formatSignedModifier: (...a: any[]) => formatSignedModifier(...a),
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
    resolveQuickSelectTarget: (...a: any[]) => resolveQuickSelectTarget(...a),
  });

  const getNormalQuickSelectInputSelector = createGetNormalQuickSelectInputSelector({

  });
  // [新增] 标准6维属性名
  const STANDARD_ATTRS = ['力量', '敏捷', '体质', '智力', '感知', '魅力'];

  /**
   * 获取当前规则的标准属性名列表
   */
  const getStandardAttrs = createGetStandardAttrs({
    getAttributePresetManager: () => AttributePresetManager,
    getSTANDARD_ATTRS: () => STANDARD_ATTRS,
  });

  /**
   * 获取当前规则的随机属性池（包含基本属性和特殊属性）
   * 默认状态：返回所有规则预设的属性合并（超级大杂烩）
   * 选中特定规则时：返回该规则的基本属性 + 特殊属性
   */
  const getRandomSkillPool = createGetRandomSkillPool({
    AttributePresetManager: AttributePresetManager,
    getRANDOM_SKILL_POOL: () => RANDOM_SKILL_POOL,
  });

  // [新增] 随机技能池（用于属性名随机生成，可自由增减）


  // [新增] 生成 COC/DND 风格的6维属性（支持预设）
  /**
   * 生成角色属性
   * @param isDNDOrPreset 布尔值(旧版兼容) 或 预设对象 或 null(自动获取激活预设)
   * @returns { base: {...}, special: {...} } 或旧格式 {...}（向后兼容）
   */
  const generateRPGAttributes = createGenerateRPGAttributes({
    generateAttributeValue: (...a: any[]) => generateAttributeValue(...a),
    AttributePresetManager: AttributePresetManager,
    STANDARD_ATTRS: STANDARD_ATTRS,
  });

  // [简化] 清空角色的属性（直接清空基础属性列和特有属性列）
  const clearPresetAttributesForCharacter = createClearPresetAttributesForCharacter({
    errorTableTemplateIssue: (...a: any[]) => errorTableTemplateIssue(...a),
    findCharacterAttributeRow: (...a: any[]) => findCharacterAttributeRow(...a),
    findPrimaryAttributeColumns: (...a: any[]) => findPrimaryAttributeColumns(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // [新增] 将属性写入角色表格
  // [修复] 支持分别写入基础属性列和特有属性列
  const writeAttributesToCharacter = createWriteAttributesToCharacter({
    errorTableTemplateIssue: (...a: any[]) => errorTableTemplateIssue(...a),
    findCharacterAttributeRow: (...a: any[]) => findCharacterAttributeRow(...a),
    findPrimaryAttributeColumns: (...a: any[]) => findPrimaryAttributeColumns(...a),
    getStandardAttrs: (...a: any[]) => getStandardAttrs(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    AttributePresetManager: AttributePresetManager,
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // [新增] 更新属性字符串中的单个属性值（用于燃运等功能）
  const updateSingleAttribute = createUpdateSingleAttribute({
    findAttributeColumnIndices: (...a: any[]) => findAttributeColumnIndices(...a),
    findCharacterAttributeRow: (...a: any[]) => findCharacterAttributeRow(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    pickFallbackAttributeColumn: (...a: any[]) => pickFallbackAttributeColumn(...a),
    resolveAttributeAliasName: (...a: any[]) => resolveAttributeAliasName(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // [修复] 获取角色的完整属性列表（包括基础属性和特有属性等所有包含"属性"的列）
  const getFullAttributesForCharacter = createGetFullAttributesForCharacter({
    findAttributeColumnIndices: (...a: any[]) => findAttributeColumnIndices(...a),
    findCharacterAttributeRow: (...a: any[]) => findCharacterAttributeRow(...a),
    findPrimaryAttributeColumns: (...a: any[]) => findPrimaryAttributeColumns(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });
  // [新增] 自定义下拉菜单初始化函数
  const initCustomDropdown = createInitCustomDropdown({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCore: (...a: any[]) => getCore(...a),
  });
  // [新增] 给输入框添加清除按钮
  const addClearButton = createAddClearButton({
    getCore: (...a: any[]) => getCore(...a),
  });
  // [新增] 统一的骰子规则设置面板
  /**
   * @deprecated 请使用 showAdvancedPresetManager() 替代。此函数仅保留函数体以供回退。
   */
  const showDiceSettingsPanel = createShowDiceSettingsPanel({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    hideDiceResultsInUserMessages: hideDiceResultsInUserMessages,
  });
  // [新增] 显示掷骰面板
  const showDicePanel = createShowDicePanel({
    addClearButton: (...a: any[]) => addClearButton(...a),
    applyAdvancedPresetOutcomePolicy: (...a: any[]) => applyAdvancedPresetOutcomePolicy(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildCheckValueText: (...a: any[]) => buildCheckValueText(...a),
    clearPresetAttributesForCharacter: (...a: any[]) => clearPresetAttributesForCharacter(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    evaluateConditionNumber: (...a: any[]) => evaluateConditionNumber(...a),
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
    evaluateOutcomes: (...a: any[]) => evaluateOutcomes(...a),
    executeEffects: (...a: any[]) => executeEffects(...a),
    executeSecondaryEffectsChain: (...a: any[]) => executeSecondaryEffectsChain(...a),
    formatOutputTemplate: (...a: any[]) => formatOutputTemplate(...a),
    generateRPGAttributes: (...a: any[]) => generateRPGAttributes(...a),
    getAdvancedPresetDisplayOutcome: (...a: any[]) => getAdvancedPresetDisplayOutcome(...a),
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getAttributesForCharacter: (...a: any[]) => getAttributesForCharacter(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getDiceQuickSelectCharacterList: (...a: any[]) => getDiceQuickSelectCharacterList(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getNormalQuickSelectInputSelector: (...a: any[]) => getNormalQuickSelectInputSelector(...a),
    getRandomSkillPool: (...a: any[]) => getRandomSkillPool(...a),
    getResultBadgeClass: (...a: any[]) => getResultBadgeClass(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    initCustomDropdown: (...a: any[]) => initCustomDropdown(...a),
    isComplexCondition: (...a: any[]) => isComplexCondition(...a),
    isSameAttributeAlias: (...a: any[]) => isSameAttributeAlias(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    renderDiceHistoryStatsHtml: (...a: any[]) => renderDiceHistoryStatsHtml(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveAttributeAliasName: (...a: any[]) => resolveAttributeAliasName(...a),
    resolveCanonicalCharacterName: (...a: any[]) => resolveCanonicalCharacterName(...a),
    resolveQuickSelectTarget: (...a: any[]) => resolveQuickSelectTarget(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAdvancedPresetManager: (...a: any[]) => showAdvancedPresetManager(...a),
    showContestPanel: (...a: any[]) => showContestPanel(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showGlobalDiceHistoryDialog: (...a: any[]) => showGlobalDiceHistoryDialog(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    updateSingleAttribute: (...a: any[]) => updateSingleAttribute(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    writeAttributesToCharacter: (...a: any[]) => writeAttributesToCharacter(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    DEFAULT_OUTPUT_TEMPLATE: DEFAULT_OUTPUT_TEMPLATE,
    DiceHistoryStatsDB: DiceHistoryStatsDB,
    STORAGE_KEY_LAST_PRESET: STORAGE_KEY_LAST_PRESET,
    UpdateController: UpdateController,
    getCachedRawData: () => cachedRawData_ACC.v,
    getMAX_HISTORY: () => MAX_HISTORY,
    getCheckHistory: () => checkHistory,
    getContestHistory: () => contestHistory,
  });

  // 判定成功等级（供对抗检定面板和 API contest() 共用）
  const getSuccessLevel = createGetSuccessLevel({

  });

  // [新增] 显示对抗检定面板
  const showContestPanel = createShowContestPanel({
    addClearButton: (...a: any[]) => addClearButton(...a),
    applyAdvancedPresetOutcomePolicy: (...a: any[]) => applyAdvancedPresetOutcomePolicy(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildCheckValueText: (...a: any[]) => buildCheckValueText(...a),
    clearPresetAttributesForCharacter: (...a: any[]) => clearPresetAttributesForCharacter(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    evaluateConditionNumber: (...a: any[]) => evaluateConditionNumber(...a),
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
    evaluateOutcomes: (...a: any[]) => evaluateOutcomes(...a),
    formatOutputTemplate: (...a: any[]) => formatOutputTemplate(...a),
    generateRPGAttributes: (...a: any[]) => generateRPGAttributes(...a),
    getAdvancedPresetDisplayOutcome: (...a: any[]) => getAdvancedPresetDisplayOutcome(...a),
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
    getAttributesForCharacter: (...a: any[]) => getAttributesForCharacter(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getDiceQuickSelectCharacterList: (...a: any[]) => getDiceQuickSelectCharacterList(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getRandomSkillPool: (...a: any[]) => getRandomSkillPool(...a),
    getResultBadgeClass: (...a: any[]) => getResultBadgeClass(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    initCustomDropdown: (...a: any[]) => initCustomDropdown(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveCanonicalCharacterName: (...a: any[]) => resolveCanonicalCharacterName(...a),
    resolveQuickSelectTarget: (...a: any[]) => resolveQuickSelectTarget(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    showAdvancedPresetManager: (...a: any[]) => showAdvancedPresetManager(...a),
    showDicePanel: (...a: any[]) => showDicePanel(...a),
    showGlobalDiceHistoryDialog: (...a: any[]) => showGlobalDiceHistoryDialog(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    writeAttributesToCharacter: (...a: any[]) => writeAttributesToCharacter(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    DEFAULT_CONTEST_OUTPUT_TEMPLATE: DEFAULT_CONTEST_OUTPUT_TEMPLATE,
    NameAliasRegistry: NameAliasRegistry,
    STORAGE_KEY_LAST_PRESET: STORAGE_KEY_LAST_PRESET,
    UpdateController: UpdateController,
    getCachedRawData: () => cachedRawData_ACC.v,
    getMAX_HISTORY: () => MAX_HISTORY,
    getContestHistory: () => contestHistory,
  });

  const parseInSceneStatus = createParseInSceneStatus({

  });

  const buildMapViewModel = createBuildMapViewModel({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseInSceneStatus: (...a: any[]) => parseInSceneStatus(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    resolveBatchLocationEmojis: (...a: any[]) => resolveBatchLocationEmojis(...a),
    resolveUserGraphName: (...a: any[]) => resolveUserGraphName(...a),
    AvatarManager: AvatarManager,
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
    DashboardDataParser: DashboardDataParser,
    NameAliasRegistry: NameAliasRegistry,
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // 防止地图弹窗重复打开
  let isMapOpening = false;

  const showMapVisualization = createShowMapVisualization({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildAvatarBackgroundStyle: (...a: any[]) => buildAvatarBackgroundStyle(...a),
    buildMapViewModel: (...a: any[]) => buildMapViewModel(...a),
    createGlobalInteractionCustomTableNameIconContext: (...a: any[]) => createGlobalInteractionCustomTableNameIconContext(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    STORAGE_KEY_MAP_FOCUS: STORAGE_KEY_MAP_FOCUS,
    getIsMapOpening: () => isMapOpening,
    setIsMapOpening: (v: any) => { isMapOpening = v; },
  });

  // [x4-b] 类型已迁出：见 ./shared/index-local-types.ts

  const RELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS = ['人际关系', 'relation_state', 'relation_text'];

  const findRelationGraphColumnIndex = createFindRelationGraphColumnIndex({

  });

  const findRelationGraphRelationColumnMatch = createFindRelationGraphRelationColumnMatch({
    findRelationGraphColumnIndex: (...a: any[]) => findRelationGraphColumnIndex(...a),
    getRELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS: () => RELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS,
  });

  const findRelationshipGraphSourceTables = createFindRelationshipGraphSourceTables({

  });

  const buildRelationshipGraphTableFromPreset = createBuildRelationshipGraphTableFromPreset({
    findRelationGraphColumnIndex: (...a: any[]) => findRelationGraphColumnIndex(...a),
    findRelationGraphRelationColumnMatch: (...a: any[]) => findRelationGraphRelationColumnMatch(...a),
    findRelationshipGraphSourceTables: (...a: any[]) => findRelationshipGraphSourceTables(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    USER_NODE_KEY: USER_NODE_KEY,
  });

  const isDashboardRoleInSceneValue = createIsDashboardRoleInSceneValue({

  });

  const pushDashboardNpcEntry = createPushDashboardNpcEntry({
    characterNamesMatch: (...a: any[]) => characterNamesMatch(...a),
  });

  const findDashboardNpcNameColumnIndex = createFindDashboardNpcNameColumnIndex({
    findRelationGraphColumnIndex: (...a: any[]) => findRelationGraphColumnIndex(...a),
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getDashboardDataParser: () => DashboardDataParser,
  });

  const collectDashboardNpcEntriesFromTableResult = createCollectDashboardNpcEntriesFromTableResult({
    findDashboardNpcNameColumnIndex: (...a: any[]) => findDashboardNpcNameColumnIndex(...a),
    findRelationGraphRelationColumnMatch: (...a: any[]) => findRelationGraphRelationColumnMatch(...a),
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    isDashboardRoleInSceneValue: (...a: any[]) => isDashboardRoleInSceneValue(...a),
    pushDashboardNpcEntry: (...a: any[]) => pushDashboardNpcEntry(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
    DashboardDataParser: DashboardDataParser,
  });

  const collectDashboardNpcEntriesFromTableResults = createCollectDashboardNpcEntriesFromTableResults({
    collectDashboardNpcEntriesFromTableResult: (...a: any[]) => collectDashboardNpcEntriesFromTableResult(...a),
  });

  const collectDashboardNpcEntriesFromRelationshipSources = createCollectDashboardNpcEntriesFromRelationshipSources({
    collectDashboardNpcEntriesFromTableResult: (...a: any[]) => collectDashboardNpcEntriesFromTableResult(...a),
    findRelationshipGraphSourceTables: (...a: any[]) => findRelationshipGraphSourceTables(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const getDashboardNpcListData = createGetDashboardNpcListData({
    collectDashboardNpcEntriesFromRelationshipSources: (...a: any[]) => collectDashboardNpcEntriesFromRelationshipSources(...a),
    collectDashboardNpcEntriesFromTableResults: (...a: any[]) => collectDashboardNpcEntriesFromTableResults(...a),
    getActiveDashboardRelationshipGraphSources: (...a: any[]) => getActiveDashboardRelationshipGraphSources(...a),
    DashboardDataParser: DashboardDataParser,
  });

  interface AvatarManagerNode {
    name: string;
    isPlayer: boolean;
    rowIndex?: number;
    tableKey?: string;
  }

  type AvatarManagerViewMode = 'chat' | 'global';

  interface AvatarManagerOptions {
    initialView?: AvatarManagerViewMode;
  }

  const collectCurrentChatAvatarNodes = createCollectCurrentChatAvatarNodes({
    getDashboardNpcListData: (...a: any[]) => getDashboardNpcListData(...a),
    DashboardDataParser: DashboardDataParser,
  });

  const getCurrentChatAvatarNodes = createGetCurrentChatAvatarNodes({
    collectCurrentChatAvatarNodes: (...a: any[]) => collectCurrentChatAvatarNodes(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  interface RelationGraphLayoutPosition {
    x: number;
    y: number;
  }

  type RelationGraphLayoutCache = Record<string, RelationGraphLayoutPosition>;
  type RelationGraphLayoutLoadResult = 'none' | 'partial' | 'full';

  // 人物关系图可视化
  const showRelationshipGraph = createShowRelationshipGraph({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildAvatarBackgroundStyle: (...a: any[]) => buildAvatarBackgroundStyle(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseRelationshipString: (...a: any[]) => parseRelationshipString(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveUserGraphName: (...a: any[]) => resolveUserGraphName(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAvatarManager: (...a: any[]) => showAvatarManager(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
    AvatarManager: AvatarManager,
    NameAliasRegistry: NameAliasRegistry,
    getCachedRawData: () => cachedRawData_ACC.v,
  });
  // ========================================
  // 头像裁剪弹窗 - 统一PC/移动端体验
  // ========================================

  const showAvatarCropModal = createShowAvatarCropModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    AvatarManager: AvatarManager,
  });

  const refreshAutoImageColorForAvatar = createRefreshAutoImageColorForAvatar({
    getAvatarFallbackColor: (...a: any[]) => getAvatarFallbackColor(...a),
    inferAvatarImageColor: (...a: any[]) => inferAvatarImageColor(...a),
    AvatarManager: AvatarManager,
  });
  // 角色头像预设弹窗（简化版 - 使用裁剪弹窗）
  const showAvatarManager = createShowAvatarManager({
    avatarHexToHsl: (...a: any[]) => avatarHexToHsl(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    clampAvatarNumber: (...a: any[]) => clampAvatarNumber(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getAvatarFallbackColor: (...a: any[]) => getAvatarFallbackColor(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getImageUrlValidationMessage: (...a: any[]) => getImageUrlValidationMessage(...a),
    getRemoteImageUrlValidationError: (...a: any[]) => getRemoteImageUrlValidationError(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    hslToAvatarHex: (...a: any[]) => hslToAvatarHex(...a),
    normalizeAvatarHexColor: (...a: any[]) => normalizeAvatarHexColor(...a),
    refreshAutoImageColorForAvatar: (...a: any[]) => refreshAutoImageColorForAvatar(...a),
    refreshDialogueIndentRender: (...a: any[]) => refreshDialogueIndentRender(...a),
    resolveUserGraphName: (...a: any[]) => resolveUserGraphName(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAvatarCropModal: (...a: any[]) => showAvatarCropModal(...a),
    showImportConfirmDialog: (...a: any[]) => showImportConfirmDialog(...a),
    AvatarManager: AvatarManager,
  });

  // 清理骰子系统脚本缓存
  const clearDiceSystemCache = createClearDiceSystemCache({

  });

  const clearDiceLocalCacheData = createClearDiceLocalCacheData({
    clearDiceSystemCache: (...a: any[]) => clearDiceSystemCache(...a),
    DiceHistoryStatsDB: DiceHistoryStatsDB,
  });

  // 手动更新/确认弹窗（支持复用）
  const showManualUpdateDialog = createShowManualUpdateDialog({
    clearDiceSystemCache: (...a: any[]) => clearDiceSystemCache(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // 导入确认弹窗
  const showImportConfirmDialog = createShowImportConfirmDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    AvatarManager: AvatarManager,
  });
  // [新增] 整体编辑模态框 (已修复自动高度与样式复用)
  const showCardEditModal = createShowCardEditModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
  });

  // [优化] 内存配置缓存
  let _configCache = null;
  const LEGACY_DB_THEME_SYNC_CONFIG_KEY = ['sync', 'Database', 'Theme'].join('');
  const sanitizeUiConfig = createSanitizeUiConfig({
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
    getLEGACY_DB_THEME_SYNC_CONFIG_KEY: () => LEGACY_DB_THEME_SYNC_CONFIG_KEY,
  });

  const getConfig = createGetConfig({
    sanitizeUiConfig: (...a: any[]) => sanitizeUiConfig(...a),
    getLEGACY_DB_THEME_SYNC_CONFIG_KEY: () => LEGACY_DB_THEME_SYNC_CONFIG_KEY,
    get_configCache: () => _configCache,
    set_configCache: (v: any) => { _configCache = v; },
  });
  const saveConfig = createSaveConfig({
    getConfig: (...a: any[]) => getConfig(...a),
    applyConfigStyles: (...a: any[]) => applyConfigStyles(...a),
    sanitizeUiConfig: (...a: any[]) => sanitizeUiConfig(...a),
    get_configCache: () => _configCache,
    set_configCache: (v: any) => { _configCache = v; },
  });

  const DICE_CONFIG_BACKUP_FORMAT = 'acu_dice_config_backup_v1' as const;
  const DICE_CONFIG_BACKUP_SCHEMA_VERSION = 1;

  const DICE_PROFILE_INDEX_STORAGE_KEY = 'acu_dice_profile_index_v1';
  const DICE_PROFILE_LAST_APPLIED_STORAGE_KEY = 'acu_dice_profile_last_applied_v1';
  const DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY = 'acu_dice_profile_skipped_prompts_v1';
  const DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY = 'acu_dice_profile_collapsed_sections_v2';
  const DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT = 5;

  type DiceConfigBackupModuleId =
    | 'uiLayout'
    | 'diceConfig'
    | 'advancedPresets'
    | 'attributePresets'
    | 'actionGm'
    | 'dashboardPresets'
    | 'renderPresets'
    | 'tableTemplate'
    | 'tableTemplateRequirementPresets'
    | 'validation'
    | 'regex'
    | 'avatarMap'
    | 'customIcons'
    | 'gachaSettings';

  type DiceConfigBackupKeyStrategy =
    | 'object'
    | 'map'
    | 'setArray'
    | 'presetArray'
    | 'gachaPoolSettings'
    | 'gachaItemSettings'
    | 'raw'
    | 'rawString';

  interface DiceConfigBackupModuleDefinition {
    id: DiceConfigBackupModuleId;
    name: string;
    description: string;
    storageKeys: readonly string[];
    deprecated?: boolean;
    deprecatedReason?: string;
  }

  interface DiceConfigBackupModulePayload {
    storage: Record<string, unknown>;
    resources?: Record<string, unknown>;
    warnings?: string[];
  }

  interface DiceConfigBackupDocument {
    format: typeof DICE_CONFIG_BACKUP_FORMAT;
    schemaVersion: number;
    exportedAt: string;
    scriptVersion: string;
    presetFormatVersion: string;
    modules: Partial<Record<DiceConfigBackupModuleId, DiceConfigBackupModulePayload>>;
  }

  interface DiceConfigBackupParseResult {
    backup: DiceConfigBackupDocument;
    warnings: string[];
  }

  interface DiceConfigBackupApplyStats {
    added: number;
    overwritten: number;
    skipped: number;
    restoredModules: string[];
    warnings: string[];
  }

  interface DiceConfigBackupPresetMergeResult {
    value: unknown[];
    idMap: Map<string, string>;
    added: number;
    overwritten: number;
    skipped: number;
    warnings: string[];
  }

  interface DiceConfigBackupPendingActiveWrite {
    key: string;
    value: unknown;
    moduleName: string;
  }

  interface DiceConfigBackupGachaCatalogRollbackSnapshot {
    records: readonly GachaCatalogRecord[] | null;
    warning?: string;
  }

  interface DiceConfigBackupTableTemplateRollbackSnapshot {
    template?: unknown;
    warning?: string;
  }

  type DiceProfileSourceType = 'user' | 'imported' | 'character' | 'character_card' | 'snapshot';

  interface DiceProfileSummary {
    id: string;
    name: string;
    source: AcuDiceProfileSource;
    createdAt: string;
    updatedAt: string;
    moduleIds: DiceConfigBackupModuleId[];
    fingerprint: string;
    lastAppliedAt?: string;
  }

  type DiceProfileRecord = AcuDiceProfilePackage<DiceConfigBackupDocument> & {
    source: AcuDiceProfileSource & { type: DiceProfileSourceType | string };
    moduleIds: DiceConfigBackupModuleId[];
    savedAt: string;
    lastAppliedAt?: string;
  };

  interface DiceProfileApplyOptions {
    moduleIds?: readonly string[];
    createSnapshot?: boolean;
    confirm?: boolean;
  }

  interface DiceProfileSaveCurrentOptions {
    name?: string;
    moduleIds?: readonly string[];
    source?: AcuDiceProfileSource;
  }

  interface DiceProfileImportOptions {
    name?: string;
    source?: AcuDiceProfileSource;
    saveOnly?: boolean;
    apply?: boolean;
  }

  interface DiceCharacterProfileDetection {
    profile: DiceProfileRecord;
    sourceTextKind: 'message' | 'first_mes' | 'regex';
  }



  // [x4-f] 配置备份核心装配已迁出：见 ./wiring/dice-config-backup-core-wiring.ts
  const { DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY, DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY, DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY, applyDiceConfigBackupActiveValue, applyDiceConfigBackupValue, buildDiceConfigBackup, buildDiceConfigBackupTableOrder, cloneDiceConfigBackupValue, collectDiceConfigBackupGachaCatalogRollbackSnapshot, getDiceConfigBackupModuleDefinition, getDiceConfigBackupModuleResourceCount, getDiceConfigBackupPresetRecordId, getDiceConfigBackupRecordString, getDiceConfigBackupTableTemplateApi, getDiceConfigBackupWarningCount, hasDiceConfigBackupRecoverableStorage, hasDiceConfigBackupTableTemplateResource, isDiceConfigBackupRecord, normalizeDiceConfigBackupGachaItemSettings, normalizeDiceConfigBackupSelectedModuleIds, parseDiceConfigBackup, remapDiceConfigBackupGachaItemSettings, showDiceConfigBackupPrivacyConfirm } = createDiceConfigBackupCoreWiring({ CUSTOM_ROLL_MODE, DASHBOARD_DEFAULT_PRESET_ID, DEPRECATED_BUILTIN_REGEX_RULE_IDS, DICE_CONFIG_BACKUP_FORMAT, DICE_CONFIG_BACKUP_SCHEMA_VERSION, PresetManager, RENDER_DEFAULT_PRESET_ID, RegexPresetManager, buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a), cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a), getConfig, getCore, getCrazyModeConfig, getDiceConfig, getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a), isBuiltinGachaPoolId: (...a: any[]) => isBuiltinGachaPoolId(...a), migrateGachaCatalogRecordsToGlobalScope: (...a: any[]) => migrateGachaCatalogRecordsToGlobalScope(...a), normalizeDiceConfigBackupGachaCatalogResourceRecord: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogResourceRecord(...a), normalizeGachaCatalogRecord: (...a: any[]) => normalizeGachaCatalogRecord(...a), normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a), normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a), normalizeGachaPoolDefinition: (...a: any[]) => normalizeGachaPoolDefinition(...a), parseJsoncDocument, showDiceSystemConfirmDialog, TableTemplateRequirementPresetManager, BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS });

  const normalizeDiceConfigBackupGachaCatalogItems = createNormalizeDiceConfigBackupGachaCatalogItems({
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    normalizeImportedGachaItem: (...a: any[]) => normalizeImportedGachaItem(...a),
    validateGachaCatalogImportItemTarget: (...a: any[]) => validateGachaCatalogImportItemTarget(...a),
  });

  const normalizeDiceConfigBackupGachaCatalogResourceRecord = createNormalizeDiceConfigBackupGachaCatalogResourceRecord({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeDiceConfigBackupGachaCatalogItems: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogItems(...a),
  });

  const getDiceConfigBackupGachaItemNameKey = createGetDiceConfigBackupGachaItemNameKey({

  });

  const mergeDiceConfigBackupGachaCatalogItems = createMergeDiceConfigBackupGachaCatalogItems({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    getDiceConfigBackupGachaItemNameKey: (...a: any[]) => getDiceConfigBackupGachaItemNameKey(...a),
  });

  const getDiceConfigBackupTableTemplateRollbackSnapshot = createGetDiceConfigBackupTableTemplateRollbackSnapshot({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupTableTemplateApi: (...a: any[]) => getDiceConfigBackupTableTemplateApi(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const restoreDiceConfigBackupTableTemplateRollbackSnapshot = createRestoreDiceConfigBackupTableTemplateRollbackSnapshot({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupTableTemplateApi: (...a: any[]) => getDiceConfigBackupTableTemplateApi(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const restoreDiceConfigBackupGachaCatalogRecords = createRestoreDiceConfigBackupGachaCatalogRecords({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    createEmptyGachaCatalog: (...a: any[]) => createEmptyGachaCatalog(...a),
    ensureGachaPoolsForTags: (...a: any[]) => ensureGachaPoolsForTags(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    mergeDiceConfigBackupGachaCatalogItems: (...a: any[]) => mergeDiceConfigBackupGachaCatalogItems(...a),
    mergeGachaCatalogRecordsToGlobalScope: (...a: any[]) => mergeGachaCatalogRecordsToGlobalScope(...a),
    migrateGachaCatalogRecordsToGlobalScope: (...a: any[]) => migrateGachaCatalogRecordsToGlobalScope(...a),
    normalizeDiceConfigBackupGachaCatalogResourceRecord: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogResourceRecord(...a),
    normalizeGachaCatalogRecord: (...a: any[]) => normalizeGachaCatalogRecord(...a),
    GACHA_CATALOG_GLOBAL_SCOPE_KEY: GACHA_CATALOG_GLOBAL_SCOPE_KEY,
    getGachaCatalogCache: () => gachaCatalogCache_ACC.v,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache_ACC.v = v; },
  });

  const restoreDiceConfigBackupTableTemplate = createRestoreDiceConfigBackupTableTemplate({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupTableTemplateApi: (...a: any[]) => getDiceConfigBackupTableTemplateApi(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const restoreDiceConfigBackupModuleResources = createRestoreDiceConfigBackupModuleResources({
    restoreDiceConfigBackupGachaCatalogRecords: (...a: any[]) => restoreDiceConfigBackupGachaCatalogRecords(...a),
    restoreDiceConfigBackupTableTemplate: (...a: any[]) => restoreDiceConfigBackupTableTemplate(...a),
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const restoreDiceConfigBackupGachaCatalogSnapshot = createRestoreDiceConfigBackupGachaCatalogSnapshot({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getGachaCatalogCache: () => gachaCatalogCache_ACC.v,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache_ACC.v = v; },
    getGachaCatalogLoadTask: () => gachaCatalogLoadTask_ACC.v,
    setGachaCatalogLoadTask: (v: any) => { gachaCatalogLoadTask_ACC.v = v; },
  });

  const syncDiceConfigBackupRuntimeAfterRestore = createSyncDiceConfigBackupRuntimeAfterRestore({
    applyConfigStyles: (...a: any[]) => applyConfigStyles(...a),
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    refreshDicePanelPresets: (...a: any[]) => refreshDicePanelPresets(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
    ActionPresetManager: ActionPresetManager,
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    AttributePresetManager: AttributePresetManager,
    AvatarManager: AvatarManager,
    DashboardPresetManager: DashboardPresetManager,
    PresetManager: PresetManager,
    RegexPresetManager: RegexPresetManager,
    RegexTransformationManager: RegexTransformationManager,
    RenderPresetManager: RenderPresetManager,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
    ValidationRuleManager: ValidationRuleManager,
    get_configCache: () => _configCache,
    set_configCache: (v: any) => { _configCache = v; },
    getDashboardRuntimeConfigCache: () => dashboardRuntimeConfigCache,
    setDashboardRuntimeConfigCache: (v: any) => { dashboardRuntimeConfigCache = v; },
    getGachaCatalogCache: () => gachaCatalogCache_ACC.v,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache_ACC.v = v; },
    getGachaCatalogLoadTask: () => gachaCatalogLoadTask_ACC.v,
    setGachaCatalogLoadTask: (v: any) => { gachaCatalogLoadTask_ACC.v = v; },
    getIsSettingsOpen: () => isSettingsOpen_ACC.v,
    setIsSettingsOpen: (v: any) => { isSettingsOpen_ACC.v = v; },
  });

  const applyDiceConfigBackup = createApplyDiceConfigBackup({
    applyDiceConfigBackupActiveValue: (...a: any[]) => applyDiceConfigBackupActiveValue(...a),
    applyDiceConfigBackupValue: (...a: any[]) => applyDiceConfigBackupValue(...a),
    collectDiceConfigBackupGachaCatalogRollbackSnapshot: (...a: any[]) => collectDiceConfigBackupGachaCatalogRollbackSnapshot(...a),
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
    getDiceConfigBackupTableTemplateRollbackSnapshot: (...a: any[]) => getDiceConfigBackupTableTemplateRollbackSnapshot(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hasDiceConfigBackupTableTemplateResource: (...a: any[]) => hasDiceConfigBackupTableTemplateResource(...a),
    normalizeDiceConfigBackupGachaItemSettings: (...a: any[]) => normalizeDiceConfigBackupGachaItemSettings(...a),
    normalizeDiceConfigBackupSelectedModuleIds: (...a: any[]) => normalizeDiceConfigBackupSelectedModuleIds(...a),
    remapDiceConfigBackupGachaItemSettings: (...a: any[]) => remapDiceConfigBackupGachaItemSettings(...a),
    restoreDiceConfigBackupGachaCatalogSnapshot: (...a: any[]) => restoreDiceConfigBackupGachaCatalogSnapshot(...a),
    restoreDiceConfigBackupModuleResources: (...a: any[]) => restoreDiceConfigBackupModuleResources(...a),
    restoreDiceConfigBackupTableTemplateRollbackSnapshot: (...a: any[]) => restoreDiceConfigBackupTableTemplateRollbackSnapshot(...a),
    syncDiceConfigBackupRuntimeAfterRestore: (...a: any[]) => syncDiceConfigBackupRuntimeAfterRestore(...a),
    DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY: DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY,
    DICE_CONFIG_BACKUP_FORMAT: DICE_CONFIG_BACKUP_FORMAT,
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_SCHEMA_VERSION: DICE_CONFIG_BACKUP_SCHEMA_VERSION,
    STORAGE_KEY_GACHA_ITEM_SETTINGS: STORAGE_KEY_GACHA_ITEM_SETTINGS,
    STORAGE_KEY_GACHA_POOL_SETTINGS: STORAGE_KEY_GACHA_POOL_SETTINGS,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
    getCachedRawData: () => cachedRawData_ACC.v,
    setCachedRawData: (v: any) => { cachedRawData_ACC.v = v; },
    buildDiceConfigBackupTableOrder: (...a: any[]) => buildDiceConfigBackupTableOrder(...a),
    saveTableOrder: (...a: any[]) => saveTableOrder(...a),
    STORAGE_KEY_TABLE_ORDER: STORAGE_KEY_TABLE_ORDER,
  });

  // [x4-e] 骰子配置备份/角色档案装配已迁出：见 ./wiring/dice-profile-backup-wiring.ts
  const { applyDiceProfile, createDiceProfileRuntimeId, deleteDiceProfileRecord, detectCharacterDiceProfile, downloadDiceConfigBackupJson, downloadDiceProfileJson, downloadDiceProfileTavernRegex, exportDiceProfile, getAllDiceConfigBackupModuleIds, getDiceConfigBackupSelectedModuleIdsFromDialog, getDiceProfileCharacterContext, getDiceProfilePromptState, importDiceProfile, normalizeDiceProfileRecord, refreshDiceProfileIndex, renderDiceConfigBackupModuleRows, saveCurrentDiceProfile, saveDiceProfileRecord, scheduleCharacterDiceProfileDetection, toDiceProfileSummary } = createDiceProfileBackupWiring({ DICE_PROFILE_INDEX_STORAGE_KEY, DICE_PROFILE_LAST_APPLIED_STORAGE_KEY, DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT, DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY, applyDiceConfigBackup, buildDiceConfigBackup, cloneDiceConfigBackupValue, downloadJsonFile, getConfig, getCore, getDiceConfigBackupModuleDefinition, getDiceConfigBackupModuleResourceCount, getDiceConfigBackupRecordString, getDiceStatsContext, hasDiceConfigBackupRecoverableStorage, hasDiceConfigBackupTableTemplateResource, isDiceConfigBackupRecord, normalizeDiceConfigBackupSelectedModuleIds, parseDiceConfigBackup, parseJsoncDocument, renderDeprecatedBadge, setupOverlayClose, showDiceSystemConfirmDialog, escapeHtml });
  const getDiceProfileCollapsedSections = createGetDiceProfileCollapsedSections({
    getDICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY: () => DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY,
  });

  const saveDiceProfileCollapsedSections = createSaveDiceProfileCollapsedSections({
    getDICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY: () => DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY,
  });

  const getDiceProfileSourceLabel = createGetDiceProfileSourceLabel({

  });

  const isDiceProfileCharacterSource = createIsDiceProfileCharacterSource({

  });

  const renderDiceProfileSummaryRow = createRenderDiceProfileSummaryRow({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getDiceProfileSourceLabel: (...a: any[]) => getDiceProfileSourceLabel(...a),
    isDiceProfileCharacterSource: (...a: any[]) => isDiceProfileCharacterSource(...a),
  });

  const renderDiceProfileTabPanel = createRenderDiceProfileTabPanel({
    renderDiceProfileSummaryRow: (...a: any[]) => renderDiceProfileSummaryRow(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const renderDiceProfileManagerBody = createRenderDiceProfileManagerBody({
    detectCharacterDiceProfile: (...a: any[]) => detectCharacterDiceProfile(...a),
    getDiceProfileCollapsedSections: (...a: any[]) => getDiceProfileCollapsedSections(...a),
    isDiceProfileCharacterSource: (...a: any[]) => isDiceProfileCharacterSource(...a),
    refreshDiceProfileIndex: (...a: any[]) => refreshDiceProfileIndex(...a),
    renderDiceConfigBackupModuleRows: (...a: any[]) => renderDiceConfigBackupModuleRows(...a),
    renderDiceProfileTabPanel: (...a: any[]) => renderDiceProfileTabPanel(...a),
    toDiceProfileSummary: (...a: any[]) => toDiceProfileSummary(...a),
    DICE_CONFIG_BACKUP_MODULES: DICE_CONFIG_BACKUP_MODULES,
    DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT: DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT,
  });

  const showDiceConfigBackupDialog = createShowDiceConfigBackupDialog({
    applyDiceProfile: (...a: any[]) => applyDiceProfile(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildDiceConfigBackup: (...a: any[]) => buildDiceConfigBackup(...a),
    createDiceProfileRuntimeId: (...a: any[]) => createDiceProfileRuntimeId(...a),
    deleteDiceProfileRecord: (...a: any[]) => deleteDiceProfileRecord(...a),
    downloadDiceConfigBackupJson: (...a: any[]) => downloadDiceConfigBackupJson(...a),
    downloadDiceProfileJson: (...a: any[]) => downloadDiceProfileJson(...a),
    downloadDiceProfileTavernRegex: (...a: any[]) => downloadDiceProfileTavernRegex(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    exportDiceProfile: (...a: any[]) => exportDiceProfile(...a),
    getAllDiceConfigBackupModuleIds: (...a: any[]) => getAllDiceConfigBackupModuleIds(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfigBackupSelectedModuleIdsFromDialog: (...a: any[]) => getDiceConfigBackupSelectedModuleIdsFromDialog(...a),
    getDiceConfigBackupWarningCount: (...a: any[]) => getDiceConfigBackupWarningCount(...a),
    getDiceProfileCollapsedSections: (...a: any[]) => getDiceProfileCollapsedSections(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    importDiceProfile: (...a: any[]) => importDiceProfile(...a),
    isDiceProfileCharacterSource: (...a: any[]) => isDiceProfileCharacterSource(...a),
    normalizeDiceProfileRecord: (...a: any[]) => normalizeDiceProfileRecord(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    renderDiceProfileManagerBody: (...a: any[]) => renderDiceProfileManagerBody(...a),
    saveCurrentDiceProfile: (...a: any[]) => saveCurrentDiceProfile(...a),
    saveDiceProfileCollapsedSections: (...a: any[]) => saveDiceProfileCollapsedSections(...a),
    saveDiceProfileRecord: (...a: any[]) => saveDiceProfileRecord(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceConfigBackupPrivacyConfirm: (...a: any[]) => showDiceConfigBackupPrivacyConfirm(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showDiceSystemInputDialog: (...a: any[]) => showDiceSystemInputDialog(...a),
  });

  // [x4-l] 运行时数据读写/保存装配已迁出：见 ./wiring/runtime-save-wiring.ts
  const { addCrudColumnAlias, addStyles, appendRowInstantly, applyConfigStyles, asDiffRecord, assertCrudEnumConstraints, assertCrudInsertRequiredCells, assertCrudLengthConstraints, assertCrudRequiredColumnsRepresented, bindTutorialButtonsIn, buildCrudEnumConstraintMap, buildCrudRequiredHeaderSet, cloneRuntimeDataValue, countRuntimeDataChanges, createDiffRowMatcher, deleteRowInstantly, findDiffSnapshotEntry, findRuntimeSheetEntryForMutation, generateDiffMap, getCrudColumnNameForHeader, getCrudSheetDdl, getCrudSqlCommentAliases, getCrudSqlTableName, getDbChatMessages, getDiffDataRow, getDiffRowDisplayTitle, getDiffSheetByKey, getDiffSheetIdentity, getRuntimeErrorMessage, getSheetHeaders, getTableData, getTutorialButtonHtml, getTutorialModule, hasRuntimeTableReadApi, hasSheetKeys, normalizeDiffRow, normalizeDiffText, parseCrudColumnDefinitionLine, performSaveDataOnly, processJsonData, refreshRegexRulesList, removeDiffDataRow, restoreMutableRuntimeValue, runInSaveQueue, saveDataOnly, saveDataToDatabase, saveRowInstantly, saveSheetsViaJsonFloorWithoutTracking, setDiffDataCell, setDiffDataRow, showAddValidationRuleModal, showSmartFixModal, startTutorialFromButton, stripCrudSqlNonStructuralComments, takeDiffRowMatch, tutorialButtonEventsBound_ACC } = createRuntimeSaveWiring({ FONTS, GACHA_CATALOG_RAW_ROW_INDEX_PROP, RegexTransformationManager, ValidationRuleManager, buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a), cachedRawData_ACC, collectHostAndLocalNodes, countUnicodeCharacters, currentDiffMap_ACC, errorTableTemplateIssue, escapeHtml, getConfig, getCore, getNavigationFontMetrics, getPendingDeletions, getTavernHostDocument, getTavernHostWindow, hasUnsavedChanges_ACC, isSaving_ACC, loadSnapshot, renderInterface: (...a: any[]) => renderInterface(...a), saveQueue_ACC, saveSnapshot, setupOverlayClose, showDiceSystemConfirmDialog, showTableRuleFixModal: (...a: any[]) => showTableRuleFixModal(...a), syncInventoryMetadataForRawData: (...a: any[]) => syncInventoryMetadataForRawData(...a) });
  const showTableRuleFixModal = createShowTableRuleFixModal({
    deleteRowInstantly: (...a: any[]) => deleteRowInstantly(...a),
    getCore: (...a: any[]) => getCore(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveDataOnly: (...a: any[]) => saveDataOnly(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ValidationEngine: ValidationEngine,
  });

  // ========================================
  // 属性预设管理面板
  // ========================================

  const showAttributePresetManager = createShowAttributePresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    readTextFile: (...a: any[]) => readTextFile(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAttributePresetEditor: (...a: any[]) => showAttributePresetEditor(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showPresetConflictDialog: (...a: any[]) => showPresetConflictDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ATTRIBUTE_QUICK_SELECT_DEFAULT: ATTRIBUTE_QUICK_SELECT_DEFAULT,
    AttributePresetManager: AttributePresetManager,
    JSONC_FILE_ACCEPT: JSONC_FILE_ACCEPT,
    STORAGE_KEY_ACTIVE_ATTR_PRESET: STORAGE_KEY_ACTIVE_ATTR_PRESET,
  });

  // 规则预设编辑器
  const buildNewAttributePresetJsoncTemplate = createBuildNewAttributePresetJsoncTemplate({

  });

  const showAttributePresetEditor = createShowAttributePresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildNewAttributePresetJsoncTemplate: (...a: any[]) => buildNewAttributePresetJsoncTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    normalizeAttributeQuickSelectConfig: (...a: any[]) => normalizeAttributeQuickSelectConfig(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    AttributePresetManager: AttributePresetManager,
    attributePresetAgentPromptTemplate: attributePresetAgentPromptTemplate,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  // 高级骰子预设UI
  // ========================================
  type SortableListOptions = {
    container: JQuery | HTMLElement;
    itemSelector: string;
    handleSelector?: string;
    cancelSelector?: string;
    onOrderChange: (newOrder: string[]) => void;
    getItemId: (item: HTMLElement) => string | null;
    canStartDrag?: () => boolean;
    ghostClass?: string;
    dragClass?: string;
    placeholderClass?: string;
    indicatorClass?: string;
    longPressDelay?: number;
  };

  const createSortableList = createSortableListFactory({

  });

  // 刷新已打开的检定面板的预设按钮
  const refreshDicePanelPresets = createRefreshDicePanelPresets({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCore: (...a: any[]) => getCore(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
  });

  const showPresetListDialog = createShowPresetListDialog({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getAdvancedPresetErrorMessage: (...a: any[]) => getAdvancedPresetErrorMessage(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    readTextFile: (...a: any[]) => readTextFile(...a),
    refreshDicePanelPresets: (...a: any[]) => refreshDicePanelPresets(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAdvancedPresetEditor: (...a: any[]) => showAdvancedPresetEditor(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    createSortableList: createSortableList,
  });

  const showAdvancedPresetManager = createShowAdvancedPresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    clearModalStack: (...a: any[]) => clearModalStack(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    saveCrazyModeConfig: (...a: any[]) => saveCrazyModeConfig(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAttributePresetManager: (...a: any[]) => showAttributePresetManager(...a),
    showPresetListDialog: (...a: any[]) => showPresetListDialog(...a),
    hideDiceResultsInUserMessages: hideDiceResultsInUserMessages,
  });

  const buildNewAdvancedPresetJsoncTemplate = createBuildNewAdvancedPresetJsoncTemplate({

  });

  const buildAdvancedPresetAgentPromptFilename = createBuildAdvancedPresetAgentPromptFilename({

  });

  const buildDashboardPresetAgentPromptFilename = createBuildDashboardPresetAgentPromptFilename({

  });

  const buildActionPresetAgentPromptFilename = createBuildActionPresetAgentPromptFilename({

  });

  const buildRenderPresetAgentPromptFilename = createBuildRenderPresetAgentPromptFilename({

  });

  const buildTableTemplateRequirementPresetAgentPromptFilename = createBuildTableTemplateRequirementPresetAgentPromptFilename({

  });

  const buildGachaCatalogAgentPromptFilename = createBuildGachaCatalogAgentPromptFilename({

  });

  const showAdvancedPresetEditor = createShowAdvancedPresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildAdvancedPresetAgentPrompt: (...a: any[]) => buildAdvancedPresetAgentPrompt(...a),
    buildAdvancedPresetAgentPromptFilename: (...a: any[]) => buildAdvancedPresetAgentPromptFilename(...a),
    buildNewAdvancedPresetJsoncTemplate: (...a: any[]) => buildNewAdvancedPresetJsoncTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getAdvancedPresetErrorMessage: (...a: any[]) => getAdvancedPresetErrorMessage(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseAdvancedPresetText: (...a: any[]) => parseAdvancedPresetText(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    refreshDicePanelPresets: (...a: any[]) => refreshDicePanelPresets(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  // 交互规则预设管理
  // ========================================
  const showActionPresetManager = createShowActionPresetManager({
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showActionPresetEditor: (...a: any[]) => showActionPresetEditor(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ActionPresetManager: ActionPresetManager,
  });

  const buildNewActionPresetRulesJsoncTemplate = createBuildNewActionPresetRulesJsoncTemplate({

  });

  // 交互规则编辑器（JSON配置风格）
  const showActionPresetEditor = createShowActionPresetEditor({
    buildActionPresetAgentPrompt: (...a: any[]) => buildActionPresetAgentPrompt(...a),
    buildActionPresetAgentPromptFilename: (...a: any[]) => buildActionPresetAgentPromptFilename(...a),
    buildNewActionPresetRulesJsoncTemplate: (...a: any[]) => buildNewActionPresetRulesJsoncTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    parseJsoncValue: (...a: any[]) => parseJsoncValue(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ActionPresetManager: ActionPresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  // 仪表盘预设管理
  // ========================================
  const showDashboardPresetManager = createShowDashboardPresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDashboardPresetEditor: (...a: any[]) => showDashboardPresetEditor(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    DASHBOARD_DEFAULT_PRESET_ID: DASHBOARD_DEFAULT_PRESET_ID,
    DASHBOARD_PRESET_MODULE_KEYS: DASHBOARD_PRESET_MODULE_KEYS,
    DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY: DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY,
    DashboardPresetManager: DashboardPresetManager,
  });

  const showDashboardPresetEditor = createShowDashboardPresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildDashboardPresetAgentPrompt: (...a: any[]) => buildDashboardPresetAgentPrompt(...a),
    buildDashboardPresetAgentPromptFilename: (...a: any[]) => buildDashboardPresetAgentPromptFilename(...a),
    cloneDashboardPresetModules: (...a: any[]) => cloneDashboardPresetModules(...a),
    createDashboardPresetEditorTemplate: (...a: any[]) => createDashboardPresetEditorTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseDashboardPresetJson: (...a: any[]) => parseDashboardPresetJson(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    DashboardPresetManager: DashboardPresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  // 渲染预设管理
  // ========================================
  const showRenderPresetManager = createShowRenderPresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    refreshDialogueIndentRender: (...a: any[]) => refreshDialogueIndentRender(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showRenderPresetEditor: (...a: any[]) => showRenderPresetEditor(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    RENDER_DEFAULT_PRESET_ID: RENDER_DEFAULT_PRESET_ID,
    RenderPresetManager: RenderPresetManager,
  });

  const showRenderPresetEditor = createShowRenderPresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildRenderPresetAgentPrompt: (...a: any[]) => buildRenderPresetAgentPrompt(...a),
    buildRenderPresetAgentPromptFilename: (...a: any[]) => buildRenderPresetAgentPromptFilename(...a),
    cloneRenderPresetRules: (...a: any[]) => cloneRenderPresetRules(...a),
    createRenderPresetEditorTemplate: (...a: any[]) => createRenderPresetEditorTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseRenderPresetJson: (...a: any[]) => parseRenderPresetJson(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    refreshDialogueIndentRender: (...a: any[]) => refreshDialogueIndentRender(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    RenderPresetManager: RenderPresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  const showDebugConsoleModal = createShowDebugConsoleModal({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  // ========================================
  // showAddRegexRuleModal - 新建/编辑表格正则规则弹窗 (Phase 4.2)
  // ========================================
  const showAddRegexRuleModal = createShowAddRegexRuleModal({
    getTableData: (...a: any[]) => getTableData(...a),
    refreshRegexRulesList: (...a: any[]) => refreshRegexRulesList(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    RegexTransformationEngine: RegexTransformationEngine,
    RegexTransformationManager: RegexTransformationManager,
    getCachedRawData: () => cachedRawData_ACC.v,
      getCore: (...a: any[]) => getCore(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
});

  // 暴露到全局
  window.showAddRegexRuleModal = showAddRegexRuleModal;

  // 暴露到全局，供紧急入口按钮调用
  window.showDebugConsoleModal = showDebugConsoleModal;

  // ========================================
  // AcuDice 公共 API - 供其他插件和角色卡调用
  // ========================================

  const ACUDICE_READY_EVENT = 'acudice:ready';

  const resolveRootWindow = createResolveRootWindow({

  });

  const rootWindow = resolveRootWindow();
  const acuDiceReady = new AcuDiceReadyState();
  const acuDicePresets = createAcuDicePresetsInstance({
    getActionPresetManager: () => ActionPresetManager,
  });
  const acuDiceCharacters = createAcuDiceCharactersInstance({
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getDashboardDataParser: () => DashboardDataParser,
  });
  const acuDiceRoll = createAcuDiceRollInstance({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });
  const acuDiceProfiles = createAcuDiceProfilesInstance({
    refreshDiceProfileIndex: (...a: any[]) => refreshDiceProfileIndex(...a),
    saveCurrentDiceProfile: (...a: any[]) => saveCurrentDiceProfile(...a),
    toDiceProfileSummary: (...a: any[]) => toDiceProfileSummary(...a),
    importDiceProfile: (...a: any[]) => importDiceProfile(...a),
    applyDiceProfile: (...a: any[]) => applyDiceProfile(...a),
    exportDiceProfile: (...a: any[]) => exportDiceProfile(...a),
    detectCharacterDiceProfile: (...a: any[]) => detectCharacterDiceProfile(...a),
    getDiceProfileCharacterContext: (...a: any[]) => getDiceProfileCharacterContext(...a),
    getDiceProfilePromptState: (...a: any[]) => getDiceProfilePromptState(...a),
    getAcuDiceProfilePromptKey: (...a: any[]) => getAcuDiceProfilePromptKey(...a),
  });
  const acuDiceCheck = createAcuDiceCheckInstance({
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    getCheckHistory: () => checkHistory,
    getMAX_HISTORY: () => MAX_HISTORY,
  });
  const acuDiceContest = createAcuDiceContest({
    emitEvent: (...a: any[]) => emitEvent(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getSuccessLevel: (...a: any[]) => getSuccessLevel(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    normalizeCheckSuggestionDiceFormula: (...a: any[]) => normalizeCheckSuggestionDiceFormula(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    resolveCanonicalCharacterName: (...a: any[]) => resolveCanonicalCharacterName(...a),
    NameAliasRegistry: NameAliasRegistry,
    getCachedRawData: () => cachedRawData_ACC.v,
    getMAX_HISTORY: () => MAX_HISTORY,
    getContestHistory: () => contestHistory,
  });
  const notifyReady = createNotifyReady({
    acuDiceReady: acuDiceReady,
  });

  const defineAcuDiceOnWindow = createDefineAcuDiceOnWindow({
    getAcuDiceAPI: () => AcuDiceAPI,
  });

  const dispatchReadyEvent = createDispatchReadyEvent({
    getACUDICE_READY_EVENT: () => ACUDICE_READY_EVENT,
  });

  // 事件系统
  const acuDiceEvents = createAcuDiceEventsInstance({
    settleGachaFortuneForDiceEvent: (...a: any[]) => settleGachaFortuneForDiceEvent(...a),
    getDiceHistoryStatsDB: () => DiceHistoryStatsDB,
  });
  type CheckHistoryEntry = AcuDice.CheckResult & CheckHistoryExtension & { timestamp: number };
  type ContestHistoryEntry = AcuDice.ContestResult & { timestamp: number; detailId?: string; detailLines?: string[] };
  type AcuDiceSharedHistoryStore = {
    checkHistory: CheckHistoryEntry[];
    contestHistory: ContestHistoryEntry[];
    maxHistory: number;
  };
  type RootWindowWithAcuDiceHistory = Window & {
    __AcuDiceHistoryStore__?: AcuDiceSharedHistoryStore;
  };
  const rootWindowWithHistory = rootWindow as RootWindowWithAcuDiceHistory;
  if (!rootWindowWithHistory.__AcuDiceHistoryStore__) {
    rootWindowWithHistory.__AcuDiceHistoryStore__ = {
      checkHistory: [],
      contestHistory: [],
      maxHistory: 100,
    };
  }
  const sharedHistoryStore = createSharedHistoryStore({
    getRootWindowWithHistory: () => rootWindowWithHistory,
  });
  const checkHistory: CheckHistoryEntry[] = sharedHistoryStore.checkHistory;
  const contestHistory: ContestHistoryEntry[] = sharedHistoryStore.contestHistory;
  const acuDiceHistory = createAcuDiceHistoryInstance({
    checkHistory: (...a: any[]) => checkHistory(...a),
    contestHistory: (...a: any[]) => contestHistory(...a),
  });
  const MAX_HISTORY = sharedHistoryStore.maxHistory;

  const globalExpandedHistoryIds = new Set<string>();
  let globalHistoryFilterStatus = 'all';
  let globalHistoryKeyword = '';
  let globalHistoryStatsScope: DiceStatsScope = 'chat';

  const copyTextWithTavernApi = createCopyTextWithTavernApi({

  });

  const showGlobalDiceHistoryDialog = createShowGlobalDiceHistoryDialog({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    copyTextWithTavernApi: (...a: any[]) => copyTextWithTavernApi(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    renderDiceHistoryStatsHtml: (...a: any[]) => renderDiceHistoryStatsHtml(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    DiceHistoryStatsDB: DiceHistoryStatsDB,
    checkHistory: checkHistory,
    contestHistory: contestHistory,
    globalExpandedHistoryIds: globalExpandedHistoryIds,
    getGlobalHistoryKeyword: () => globalHistoryKeyword,
    setGlobalHistoryKeyword: (v: any) => { globalHistoryKeyword = v; },
    getGlobalHistoryFilterStatus: () => globalHistoryFilterStatus,
    setGlobalHistoryFilterStatus: (v: any) => { globalHistoryFilterStatus = v; },
    getGlobalHistoryStatsScope: () => globalHistoryStatsScope,
    setGlobalHistoryStatsScope: (v: any) => { globalHistoryStatsScope = v; },
  });

  const emitEvent = createEmitEvent({
    acuDiceEvents: acuDiceEvents,
  });

  type CheckSuggestionTieRule = 'initiator_win' | 'initiator_lose' | 'tie';
  type CheckSuggestionCriteria = 'lte' | 'gte';
  type CheckSuggestionRawParams = Record<string, string>;
  type CheckSuggestionParamValue = string | number | boolean;
  type CheckSuggestionParams = Record<string, CheckSuggestionParamValue>;
  type CheckSuggestionParsedCommand =
    | {
        kind: 'check';
        characterName: string;
        attributeName: string;
        diceType: string;
        hasExplicitDice: boolean;
        targetValue: number | null;
        criteria: CheckSuggestionCriteria;
        rawParams: CheckSuggestionRawParams;
      }
    | {
        kind: 'contest';
        leftName: string;
        leftAttribute: string;
        rightName: string;
        rightAttribute: string;
        diceType: string;
        hasExplicitDice: boolean;
        tieRule: CheckSuggestionTieRule;
        hasExplicitTieRule: boolean;
        rawParams: CheckSuggestionRawParams;
      }
    | { kind: 'fixed'; success: boolean }
    | { kind: 'none' }
    | { kind: 'invalid'; reason: string };

  // [x4-g] 检查建议/设置弹窗装配已迁出：见 ./wiring/check-suggestion-wiring.ts
  const { AcuDiceAPI, executeCheckSuggestionCommand, getTemplateInspectionSheets, normalizeCheckSuggestionDiceFormula, showFavoriteEditModal, showSendToTableModal, showSettingsModal, showTagInputModal } = createCheckSuggestionWiring({ AdvancedDicePresetManager, DEFAULT_CONTEST_OUTPUT_TEMPLATE, DEFAULT_OUTPUT_TEMPLATE, FONTS, MAX_HISTORY, NameAliasRegistry, PresetManager, RegexPresetManager, RegexTransformationManager, THEMES, TableTemplateRequirementPresetManager, ValidationRuleManager, acuDiceCharacters, acuDiceCheck, acuDiceContest, acuDiceEvents, acuDiceHistory, acuDicePresets, acuDiceProfiles, acuDiceReady, acuDiceRoll, appendRowInstantly, applyAdvancedPresetOutcomePolicy, areAllTablesReversed, bindFavoritesEvents: (...a: any[]) => bindFavoritesEvents(...a), bindTutorialButtonsIn, buildCheckValueText, buildNewTableTemplateRequirementPresetJsoncTemplate, buildTableTemplateRequirementPresetAgentPrompt, buildTableTemplateRequirementPresetAgentPromptFilename, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, checkHistory, clearDiceLocalCacheData, clearModalStack, contestHistory, convertTavernRegexToRule, createSortableList, downloadAiPromptFile, downloadJsonFile, emitEvent, ensureCanonicalTableOrder, escapeHtml, evaluateCondition, evaluateConditionNumber, evaluateFormula, evaluateOutcomes, formatOutputTemplate, getAdvancedPresetDisplayOutcome, getAttributeEntryForCharacter, getAttributeValue, getCheckSuggestionPresetById, getConfig, getCore, getCurrentChatAvatarNodes, getHiddenTables, getIconForTableName, getJsonLikeErrorMessage, getNamedCheckParamText, getNavigationFontMetrics, getSavedTableOrder, getStableTableSort, getSuccessLevel, getTableData, getTableTemplateRequirementPresetStats, getTutorialButtonHtml, isRecordValue, isSettingsOpen_ACC: { get v(){ return isSettingsOpen_ACC.v; }, set v(x){ isSettingsOpen_ACC.v = x; } }, normalizeCollapseStyle, parseJsoncRecord, parseTableTemplateRequirementPresetJson, pickTextFile, popModal, processJsonData, pushModal, refreshDialogueIndentRender, refreshRegexRulesList, renderDeprecatedBadge, renderFavoritesPanel: (...a: any[]) => renderFavoritesPanel(...a), renderInterface: (...a: any[]) => renderInterface(...a), replaceUserPlaceholders, resolveCanonicalCharacterName, resolveQuickSelectTarget, saveConfig, saveHiddenTables, saveTableOrder, scheduleDialogueIndentRender, setAllTablesReverse, setupOverlayClose, showActionPresetManager, showAddRegexRuleModal, showAddValidationRuleModal, showAttributePresetManager, showAvatarManager, showCustomTableNameIconManager, showDashboardPresetManager, showDebugConsoleModal, showDiceConfigBackupDialog, showDiceSystemConfirmDialog, showDiceSystemInputDialog, showManualUpdateDialog, showPresetConflictDialog, showPresetListDialog, showRenderPresetManager, smartInsertToTextarea, validateJsoncEditorConfig });

  // [优化] 渲染防抖：避免短时间内多次渲染导致重复日志
  let renderInterfaceTimer = null;
  let renderInterfacePending = false;
  let viewportBoundsListenerAttached = false;
  let viewportBoundsListenerWindow: Window | null = null;
  let viewportBoundsRefreshHandler: (() => void) | null = null;
  let viewportBoundsRaf: number | null = null;
  let viewportInputResizeObserver: ResizeObserver | null = null;
  let viewportInputMutationObserver: MutationObserver | null = null;
  let viewportInputObservedElements: HTMLElement[] = [];
  let viewportInputMutationWindow: Window | null = null;
  let viewportInputMutationDocument: Document | null = null;
  let viewportInputTargetsRaf: number | null = null;
  let fixedWrapperBoundsListenerWindow: Window | null = null;
  let fixedWrapperBoundsRefreshHandler: (() => void) | null = null;
  let fixedWrapperBoundsRaf: number | null = null;
  let fixedAnchorResizeObserver: ResizeObserver | null = null;
  let fixedAnchorMutationObserver: MutationObserver | null = null;
  let fixedAnchorMutationWindow: Window | null = null;
  let fixedAnchorMutationDocument: Document | null = null;
  let fixedAnchorTargetsRaf: number | null = null;
  let floatingCollapseBoundsListenerWindow: Window | null = null;
  let floatingCollapseBoundsRefreshHandler: (() => void) | null = null;
  let floatingCollapseBoundsRaf: number | null = null;
  let suppressNextFloatingCollapseClick = false;

  const VIEWPORT_BOTTOM_ANCHOR_SELECTORS = createViewportBottomAnchorSelectors({

  });
  const VIEWPORT_BOTTOM_REFRESH_EVENTS = createViewportBottomRefreshEvents({

  });
  const VIEWPORT_COMPOSER_ELEMENT_IDS = new Set(['send_form', 'form_sheld', 'send_textarea', 'chat_input']);
  // iPad 横屏可到 1366px；固定底部导航在这类视口下应跟随聊天容器，而不是输入框内部宽度。
  const TABLET_FIXED_NAV_FULL_WIDTH_MAX = 1366;
  const FIXED_MODE_ANCHOR_PRIORITY = createFixedModeAnchorPriority({

  });
  interface FloatingCollapsePosition {
    left: number;
    top: number;
  }

  const FLOATING_COLLAPSE_SIZE = 48;
  const FLOATING_COLLAPSE_MARGIN = 12;
  const FLOATING_COLLAPSE_DRAG_THRESHOLD = 5;

  const isFloatingCollapseActive = createIsFloatingCollapseActive({
    getCollapsedState: (...a: any[]) => getCollapsedState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
  });

  const normalizeFloatingCollapsePosition = createNormalizeFloatingCollapsePosition({

  });

  const getFloatingViewportBounds = createGetFloatingViewportBounds({
    FLOATING_COLLAPSE_SIZE: FLOATING_COLLAPSE_SIZE,
  });

  const clampFloatingCollapsePosition = createClampFloatingCollapsePosition({
    getFloatingViewportBounds: (...a: any[]) => getFloatingViewportBounds(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getViewportBottomOffset: (...a: any[]) => getViewportBottomOffset(...a),
    FLOATING_COLLAPSE_MARGIN: FLOATING_COLLAPSE_MARGIN,
    FLOATING_COLLAPSE_SIZE: FLOATING_COLLAPSE_SIZE,
  });

  const getFloatingCollapsePosition = createGetFloatingCollapsePosition({
    getConfig: (...a: any[]) => getConfig(...a),
    normalizeFloatingCollapsePosition: (...a: any[]) => normalizeFloatingCollapsePosition(...a),
  });

  const updateFloatingCollapseBounds = createUpdateFloatingCollapseBounds({
    clampFloatingCollapsePosition: (...a: any[]) => clampFloatingCollapsePosition(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getFloatingCollapsePosition: (...a: any[]) => getFloatingCollapsePosition(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    saveConfig: (...a: any[]) => saveConfig(...a),
    FLOATING_COLLAPSE_SIZE: FLOATING_COLLAPSE_SIZE,
  });

  const getViewportBottomAnchorElements = createGetViewportBottomAnchorElements({
    getVIEWPORT_BOTTOM_ANCHOR_SELECTORS: () => VIEWPORT_BOTTOM_ANCHOR_SELECTORS,
  });

  const getViewportAnchorRect = createGetViewportAnchorRect({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });

  const getFixedWrapperParentMetrics = createGetFixedWrapperParentMetrics({

  });

  const getFixedModeAnchorRect = createGetFixedModeAnchorRect({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getViewportAnchorRect: (...a: any[]) => getViewportAnchorRect(...a),
    getViewportBottomAnchorElements: (...a: any[]) => getViewportBottomAnchorElements(...a),
    FIXED_MODE_ANCHOR_PRIORITY: FIXED_MODE_ANCHOR_PRIORITY,
  });

  const getViewportBottomOffset = createGetViewportBottomOffset({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getViewportBottomAnchorElements: (...a: any[]) => getViewportBottomAnchorElements(...a),
    VIEWPORT_COMPOSER_ELEMENT_IDS: VIEWPORT_COMPOSER_ELEMENT_IDS,
  });

  const updateViewportWrapperBounds = createUpdateViewportWrapperBounds({
    getCollapsedState: (...a: any[]) => getCollapsedState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getViewportAnchorRect: (...a: any[]) => getViewportAnchorRect(...a),
    getViewportBottomOffset: (...a: any[]) => getViewportBottomOffset(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
    updateFloatingCollapseBounds: (...a: any[]) => updateFloatingCollapseBounds(...a),
  });

  const updateFixedWrapperBounds = createUpdateFixedWrapperBounds({
    getConfig: (...a: any[]) => getConfig(...a),
    getFixedModeAnchorRect: (...a: any[]) => getFixedModeAnchorRect(...a),
    getFixedWrapperParentMetrics: (...a: any[]) => getFixedWrapperParentMetrics(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    updateFloatingCollapseBounds: (...a: any[]) => updateFloatingCollapseBounds(...a),
    TABLET_FIXED_NAV_FULL_WIDTH_MAX: TABLET_FIXED_NAV_FULL_WIDTH_MAX,
  });

  const scheduleFixedWrapperBoundsRefresh = createScheduleFixedWrapperBoundsRefresh({
    getConfig: (...a: any[]) => getConfig(...a),
    updateFixedWrapperBounds: (...a: any[]) => updateFixedWrapperBounds(...a),
    getFixedWrapperBoundsRaf: () => fixedWrapperBoundsRaf,
    setFixedWrapperBoundsRaf: (v: any) => { fixedWrapperBoundsRaf = v; },
  });

  const clearFixedAnchorResizeObserver = createClearFixedAnchorResizeObserver({
    getFixedAnchorResizeObserver: () => fixedAnchorResizeObserver,
    setFixedAnchorResizeObserver: (v: any) => { fixedAnchorResizeObserver = v; },
  });

  const refreshFixedAnchorResizeObserver = createRefreshFixedAnchorResizeObserver({
    clearFixedAnchorResizeObserver: (...a: any[]) => clearFixedAnchorResizeObserver(...a),
    getViewportBottomAnchorElements: (...a: any[]) => getViewportBottomAnchorElements(...a),
    getFixedWrapperBoundsRefreshHandler: () => fixedWrapperBoundsRefreshHandler,
    getFixedAnchorResizeObserver: () => fixedAnchorResizeObserver,
    setFixedAnchorResizeObserver: (v: any) => { fixedAnchorResizeObserver = v; },
  });

  const scheduleFixedAnchorTargetRefresh = createScheduleFixedAnchorTargetRefresh({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    refreshFixedAnchorResizeObserver: (...a: any[]) => refreshFixedAnchorResizeObserver(...a),
    scheduleFixedWrapperBoundsRefresh: (...a: any[]) => scheduleFixedWrapperBoundsRefresh(...a),
    getFixedAnchorTargetsRaf: () => fixedAnchorTargetsRaf,
    setFixedAnchorTargetsRaf: (v: any) => { fixedAnchorTargetsRaf = v; },
  });

  const clearFixedAnchorMutationObserver = createClearFixedAnchorMutationObserver({
    getFixedAnchorMutationDocument: () => fixedAnchorMutationDocument,
    setFixedAnchorMutationDocument: (v: any) => { fixedAnchorMutationDocument = v; },
    getFixedAnchorMutationObserver: () => fixedAnchorMutationObserver,
    setFixedAnchorMutationObserver: (v: any) => { fixedAnchorMutationObserver = v; },
    getFixedAnchorMutationWindow: () => fixedAnchorMutationWindow,
    setFixedAnchorMutationWindow: (v: any) => { fixedAnchorMutationWindow = v; },
    getFixedAnchorTargetsRaf: () => fixedAnchorTargetsRaf,
    setFixedAnchorTargetsRaf: (v: any) => { fixedAnchorTargetsRaf = v; },
  });

  const setupFixedAnchorMutationObserver = createSetupFixedAnchorMutationObserver({
    clearFixedAnchorMutationObserver: (...a: any[]) => clearFixedAnchorMutationObserver(...a),
    scheduleFixedAnchorTargetRefresh: (...a: any[]) => scheduleFixedAnchorTargetRefresh(...a),
    getFixedAnchorMutationDocument: () => fixedAnchorMutationDocument,
    setFixedAnchorMutationDocument: (v: any) => { fixedAnchorMutationDocument = v; },
    getFixedAnchorMutationObserver: () => fixedAnchorMutationObserver,
    setFixedAnchorMutationObserver: (v: any) => { fixedAnchorMutationObserver = v; },
    getFixedAnchorMutationWindow: () => fixedAnchorMutationWindow,
    setFixedAnchorMutationWindow: (v: any) => { fixedAnchorMutationWindow = v; },
  });

  const clearFixedWrapperBoundsListeners = createClearFixedWrapperBoundsListeners({
    clearFixedAnchorMutationObserver: (...a: any[]) => clearFixedAnchorMutationObserver(...a),
    clearFixedAnchorResizeObserver: (...a: any[]) => clearFixedAnchorResizeObserver(...a),
    getFixedWrapperBoundsListenerWindow: () => fixedWrapperBoundsListenerWindow,
    setFixedWrapperBoundsListenerWindow: (v: any) => { fixedWrapperBoundsListenerWindow = v; },
    getFixedWrapperBoundsRaf: () => fixedWrapperBoundsRaf,
    setFixedWrapperBoundsRaf: (v: any) => { fixedWrapperBoundsRaf = v; },
    getFixedWrapperBoundsRefreshHandler: () => fixedWrapperBoundsRefreshHandler,
    setFixedWrapperBoundsRefreshHandler: (v: any) => { fixedWrapperBoundsRefreshHandler = v; },
  });

  const setupFixedWrapperBoundsListeners = createSetupFixedWrapperBoundsListeners({
    clearFixedWrapperBoundsListeners: (...a: any[]) => clearFixedWrapperBoundsListeners(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    refreshFixedAnchorResizeObserver: (...a: any[]) => refreshFixedAnchorResizeObserver(...a),
    scheduleFixedWrapperBoundsRefresh: (...a: any[]) => scheduleFixedWrapperBoundsRefresh(...a),
    setupFixedAnchorMutationObserver: (...a: any[]) => setupFixedAnchorMutationObserver(...a),
    getFixedWrapperBoundsListenerWindow: () => fixedWrapperBoundsListenerWindow,
    setFixedWrapperBoundsListenerWindow: (v: any) => { fixedWrapperBoundsListenerWindow = v; },
    getFixedWrapperBoundsRefreshHandler: () => fixedWrapperBoundsRefreshHandler,
    setFixedWrapperBoundsRefreshHandler: (v: any) => { fixedWrapperBoundsRefreshHandler = v; },
  });

  const scheduleFloatingCollapseBoundsRefresh = createScheduleFloatingCollapseBoundsRefresh({
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    updateFloatingCollapseBounds: (...a: any[]) => updateFloatingCollapseBounds(...a),
    getFloatingCollapseBoundsRaf: () => floatingCollapseBoundsRaf,
    setFloatingCollapseBoundsRaf: (v: any) => { floatingCollapseBoundsRaf = v; },
  });

  const clearFloatingCollapseBoundsListeners = createClearFloatingCollapseBoundsListeners({
    getFloatingCollapseBoundsListenerWindow: () => floatingCollapseBoundsListenerWindow,
    setFloatingCollapseBoundsListenerWindow: (v: any) => { floatingCollapseBoundsListenerWindow = v; },
    getFloatingCollapseBoundsRefreshHandler: () => floatingCollapseBoundsRefreshHandler,
    setFloatingCollapseBoundsRefreshHandler: (v: any) => { floatingCollapseBoundsRefreshHandler = v; },
    getFloatingCollapseBoundsRaf: () => floatingCollapseBoundsRaf,
    setFloatingCollapseBoundsRaf: (v: any) => { floatingCollapseBoundsRaf = v; },
  });

  const setupFloatingCollapseBoundsListeners = createSetupFloatingCollapseBoundsListeners({
    clearFloatingCollapseBoundsListeners: (...a: any[]) => clearFloatingCollapseBoundsListeners(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    scheduleFloatingCollapseBoundsRefresh: (...a: any[]) => scheduleFloatingCollapseBoundsRefresh(...a),
    getFloatingCollapseBoundsListenerWindow: () => floatingCollapseBoundsListenerWindow,
    setFloatingCollapseBoundsListenerWindow: (v: any) => { floatingCollapseBoundsListenerWindow = v; },
    getFloatingCollapseBoundsRefreshHandler: () => floatingCollapseBoundsRefreshHandler,
    setFloatingCollapseBoundsRefreshHandler: (v: any) => { floatingCollapseBoundsRefreshHandler = v; },
  });

  const scheduleViewportBoundsRefresh = createScheduleViewportBoundsRefresh({
    getConfig: (...a: any[]) => getConfig(...a),
    updateViewportWrapperBounds: (...a: any[]) => updateViewportWrapperBounds(...a),
    getViewportBoundsRaf: () => viewportBoundsRaf,
    setViewportBoundsRaf: (v: any) => { viewportBoundsRaf = v; },
  });

  const clearViewportInputTargetListeners = createClearViewportInputTargetListeners({
    VIEWPORT_BOTTOM_REFRESH_EVENTS: VIEWPORT_BOTTOM_REFRESH_EVENTS,
    getViewportBoundsRefreshHandler: () => viewportBoundsRefreshHandler,
    getViewportInputObservedElements: () => viewportInputObservedElements,
    setViewportInputObservedElements: (v: any) => { viewportInputObservedElements = v; },
    getViewportInputResizeObserver: () => viewportInputResizeObserver,
    setViewportInputResizeObserver: (v: any) => { viewportInputResizeObserver = v; },
  });

  const refreshViewportInputTargetListeners = createRefreshViewportInputTargetListeners({
    clearViewportInputTargetListeners: (...a: any[]) => clearViewportInputTargetListeners(...a),
    getViewportBottomAnchorElements: (...a: any[]) => getViewportBottomAnchorElements(...a),
    VIEWPORT_BOTTOM_REFRESH_EVENTS: VIEWPORT_BOTTOM_REFRESH_EVENTS,
    getViewportBoundsRefreshHandler: () => viewportBoundsRefreshHandler,
    getViewportInputObservedElements: () => viewportInputObservedElements,
    setViewportInputObservedElements: (v: any) => { viewportInputObservedElements = v; },
    getViewportInputResizeObserver: () => viewportInputResizeObserver,
    setViewportInputResizeObserver: (v: any) => { viewportInputResizeObserver = v; },
  });

  const scheduleViewportInputTargetRefresh = createScheduleViewportInputTargetRefresh({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    refreshViewportInputTargetListeners: (...a: any[]) => refreshViewportInputTargetListeners(...a),
    scheduleViewportBoundsRefresh: (...a: any[]) => scheduleViewportBoundsRefresh(...a),
    getViewportInputTargetsRaf: () => viewportInputTargetsRaf,
    setViewportInputTargetsRaf: (v: any) => { viewportInputTargetsRaf = v; },
  });

  const clearViewportInputMutationObserver = createClearViewportInputMutationObserver({
    getViewportInputMutationDocument: () => viewportInputMutationDocument,
    setViewportInputMutationDocument: (v: any) => { viewportInputMutationDocument = v; },
    getViewportInputMutationObserver: () => viewportInputMutationObserver,
    setViewportInputMutationObserver: (v: any) => { viewportInputMutationObserver = v; },
    getViewportInputMutationWindow: () => viewportInputMutationWindow,
    setViewportInputMutationWindow: (v: any) => { viewportInputMutationWindow = v; },
    getViewportInputTargetsRaf: () => viewportInputTargetsRaf,
    setViewportInputTargetsRaf: (v: any) => { viewportInputTargetsRaf = v; },
  });

  const setupViewportInputMutationObserver = createSetupViewportInputMutationObserver({
    clearViewportInputMutationObserver: (...a: any[]) => clearViewportInputMutationObserver(...a),
    scheduleViewportInputTargetRefresh: (...a: any[]) => scheduleViewportInputTargetRefresh(...a),
    getViewportInputMutationDocument: () => viewportInputMutationDocument,
    setViewportInputMutationDocument: (v: any) => { viewportInputMutationDocument = v; },
    getViewportInputMutationObserver: () => viewportInputMutationObserver,
    setViewportInputMutationObserver: (v: any) => { viewportInputMutationObserver = v; },
    getViewportInputMutationWindow: () => viewportInputMutationWindow,
    setViewportInputMutationWindow: (v: any) => { viewportInputMutationWindow = v; },
  });

  const clearViewportBoundsListeners = createClearViewportBoundsListeners({
    clearViewportInputMutationObserver: (...a: any[]) => clearViewportInputMutationObserver(...a),
    clearViewportInputTargetListeners: (...a: any[]) => clearViewportInputTargetListeners(...a),
    getViewportBoundsListenerAttached: () => viewportBoundsListenerAttached,
    setViewportBoundsListenerAttached: (v: any) => { viewportBoundsListenerAttached = v; },
    getViewportBoundsListenerWindow: () => viewportBoundsListenerWindow,
    setViewportBoundsListenerWindow: (v: any) => { viewportBoundsListenerWindow = v; },
    getViewportBoundsRaf: () => viewportBoundsRaf,
    setViewportBoundsRaf: (v: any) => { viewportBoundsRaf = v; },
    getViewportBoundsRefreshHandler: () => viewportBoundsRefreshHandler,
    setViewportBoundsRefreshHandler: (v: any) => { viewportBoundsRefreshHandler = v; },
  });

  const setupViewportBoundsListeners = createSetupViewportBoundsListeners({
    clearViewportBoundsListeners: (...a: any[]) => clearViewportBoundsListeners(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    refreshViewportInputTargetListeners: (...a: any[]) => refreshViewportInputTargetListeners(...a),
    scheduleViewportBoundsRefresh: (...a: any[]) => scheduleViewportBoundsRefresh(...a),
    setupViewportInputMutationObserver: (...a: any[]) => setupViewportInputMutationObserver(...a),
    getViewportBoundsListenerWindow: () => viewportBoundsListenerWindow,
    setViewportBoundsListenerWindow: (v: any) => { viewportBoundsListenerWindow = v; },
    getViewportBoundsRefreshHandler: () => viewportBoundsRefreshHandler,
    setViewportBoundsRefreshHandler: (v: any) => { viewportBoundsRefreshHandler = v; },
    getViewportBoundsListenerAttached: () => viewportBoundsListenerAttached,
    setViewportBoundsListenerAttached: (v: any) => { viewportBoundsListenerAttached = v; },
  });

  const renderInterface = createRenderInterface({
    _renderInterfaceImpl: (...a: any[]) => _renderInterfaceImpl(...a),
    saveCurrentTabState: (...a: any[]) => saveCurrentTabState(...a),
    getIsSettingsOpen: () => isSettingsOpen_ACC.v,
    getRenderInterfacePending: () => renderInterfacePending,
    setRenderInterfacePending: (v: any) => { renderInterfacePending = v; },
    getRenderInterfaceTimer: () => renderInterfaceTimer,
    setRenderInterfaceTimer: (v: any) => { renderInterfaceTimer = v; },
  });

  // 实际的渲染实现函数
  const _renderInterfaceImpl = createRenderInterfaceImpl({
    applyStoredPanelHeight: (...a: any[]) => applyStoredPanelHeight(...a),
    bindChangesEvents: (...a: any[]) => bindChangesEvents(...a),
    bindEvents: (...a: any[]) => bindEvents(...a),
    bindGlobalInteractionEvents: (...a: any[]) => bindGlobalInteractionEvents(...a),
    bindOptionEvents: (...a: any[]) => bindOptionEvents(...a),
    canWriteMvuPanel: (...a: any[]) => canWriteMvuPanel(...a),
    clampFloatingCollapsePosition: (...a: any[]) => clampFloatingCollapsePosition(...a),
    collectHostAndLocalNodes: (...a: any[]) => collectHostAndLocalNodes(...a),
    countRuntimeDataChanges: (...a: any[]) => countRuntimeDataChanges(...a),
    createAutoRegexTransformKey: (...a: any[]) => createAutoRegexTransformKey(...a),
    createElementFromHtml: (...a: any[]) => createElementFromHtml(...a),
    ensurePanelNavigationVisible: (...a: any[]) => ensurePanelNavigationVisible(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getActivePanelHeightKey: (...a: any[]) => getActivePanelHeightKey(...a),
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getCheckSuggestionItemsFromTable: (...a: any[]) => getCheckSuggestionItemsFromTable(...a),
    getCollapsedState: (...a: any[]) => getCollapsedState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getFloatingCollapsePosition: (...a: any[]) => getFloatingCollapsePosition(...a),
    getHiddenTables: (...a: any[]) => getHiddenTables(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getNavigationFontMetrics: (...a: any[]) => getNavigationFontMetrics(...a),
    getOptionItemsFromTable: (...a: any[]) => getOptionItemsFromTable(...a),
    getOptionsCollapsedState: (...a: any[]) => getOptionsCollapsedState(...a),
    getSavedTableOrder: (...a: any[]) => getSavedTableOrder(...a),
    getStoredPanelHeight: (...a: any[]) => getStoredPanelHeight(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    hideDiceResultsInUserMessages: (...a: any[]) => hideDiceResultsInUserMessages(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    injectIndependentOptions: (...a: any[]) => injectIndependentOptions(...a),
    insertHtmlToPage: (...a: any[]) => insertHtmlToPage(...a),
    isCheckSuggestionTableName: (...a: any[]) => isCheckSuggestionTableName(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    isOptionTableName: (...a: any[]) => isOptionTableName(...a),
    loadDashboardNpcAvatars: (...a: any[]) => loadDashboardNpcAvatars(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    rememberAutoRegexTransform: (...a: any[]) => rememberAutoRegexTransform(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    renderCheckSuggestionOptionButtonHtml: (...a: any[]) => renderCheckSuggestionOptionButtonHtml(...a),
    renderDashboard: (...a: any[]) => renderDashboard(...a),
    renderGlobalInteractionsPanel: (...a: any[]) => renderGlobalInteractionsPanel(...a),
    renderOptionButtonHtml: (...a: any[]) => renderOptionButtonHtml(...a),
    renderTableContent: (...a: any[]) => renderTableContent(...a),
    saveSheetsViaJsonFloorWithoutTracking: (...a: any[]) => saveSheetsViaJsonFloorWithoutTracking(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setupFixedWrapperBoundsListeners: (...a: any[]) => setupFixedWrapperBoundsListeners(...a),
    setupFloatingCollapseBoundsListeners: (...a: any[]) => setupFloatingCollapseBoundsListeners(...a),
    setupViewportBoundsListeners: (...a: any[]) => setupViewportBoundsListeners(...a),
    shouldSkipAutoRegexTransform: (...a: any[]) => shouldSkipAutoRegexTransform(...a),
    syncHostRegenerateButtonVisibility: (...a: any[]) => syncHostRegenerateButtonVisibility(...a),
    updateFixedWrapperBounds: (...a: any[]) => updateFixedWrapperBounds(...a),
    updateFloatingCollapseBounds: (...a: any[]) => updateFloatingCollapseBounds(...a),
    updateSaveButtonState: (...a: any[]) => updateSaveButtonState(...a),
    updateViewportWrapperBounds: (...a: any[]) => updateViewportWrapperBounds(...a),
    ACTION_BUTTONS: ACTION_BUTTONS,
    FLOATING_COLLAPSE_SIZE: FLOATING_COLLAPSE_SIZE,
    MvuModule: MvuModule,
    RegexTransformationEngine: RegexTransformationEngine,
    RegexTransformationManager: RegexTransformationManager,
    ValidationEngine: ValidationEngine,
    STORAGE_KEY_DASHBOARD_ACTIVE: STORAGE_KEY_DASHBOARD_ACTIVE,
    STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE: STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
    STORAGE_KEY_VALIDATION_MODE: STORAGE_KEY_VALIDATION_MODE,
    getHasUnsavedChanges: () => hasUnsavedChanges_ACC.v,
    getIsSaving: () => isSaving_ACC.v,
    getTableScrollStates: () => tableScrollStates_ACC.v,
    getObserver: () => observer_ACC.v,
    setObserver: (v: any) => { observer_ACC.v = v; },
    getIsAutoTransforming: () => isAutoTransforming_ACC.v,
    setIsAutoTransforming: (v: any) => { isAutoTransforming_ACC.v = v; },
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
    getOptionPanelVisible: () => optionPanelVisible_ACC.v,
    setOptionPanelVisible: (v: any) => { optionPanelVisible_ACC.v = v; },
    getLastOptionHash: () => lastOptionHash_ACC.v,
    setLastOptionHash: (v: any) => { lastOptionHash_ACC.v = v; },
    getCachedRawData: () => cachedRawData_ACC.v,
    setCachedRawData: (v: any) => { cachedRawData_ACC.v = v; },
    getStableTableSort: (...a: any[]) => getStableTableSort(...a),
    ensureCanonicalTableOrder: (...a: any[]) => ensureCanonicalTableOrder(...a),
  });

  // [新增] 独立插入选项到最新气泡
  const injectIndependentOptions = createInjectIndependentOptions({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // [修复版] 绑定选项点击事件 (优化：事件委托 + 增强发送逻辑)
  const bindOptionEvents = createBindOptionEvents({
    clearComposerIfCurrentText: (...a: any[]) => clearComposerIfCurrentText(...a),
    executeCheckSuggestionCommand: (...a: any[]) => executeCheckSuggestionCommand(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getResolvedComposerText: (...a: any[]) => getResolvedComposerText(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    sendChatTextAndTrigger: (...a: any[]) => sendChatTextAndTrigger(...a),
    smartInsertToTextarea: smartInsertToTextarea,
  });

  const insertHtmlToPage = createInsertHtmlToPage({
    createElementFromHtml: (...a: any[]) => createElementFromHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });
  // [新增] 渲染变更审核面板
  const renderChangesPanel = createRenderChangesPanel({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    createDiffRowMatcher: (...a: any[]) => createDiffRowMatcher(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getDiffRowDisplayTitle: (...a: any[]) => getDiffRowDisplayTitle(...a),
    getDiffSheetIdentity: (...a: any[]) => getDiffSheetIdentity(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeDiffRow: (...a: any[]) => normalizeDiffRow(...a),
    renderDeprecatedBadge: (...a: any[]) => renderDeprecatedBadge(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    takeDiffRowMatch: (...a: any[]) => takeDiffRowMatch(...a),
    DATA_VALIDATION_DEPRECATED_META: DATA_VALIDATION_DEPRECATED_META,
    STORAGE_KEY_VALIDATION_MODE: STORAGE_KEY_VALIDATION_MODE,
    ValidationEngine: ValidationEngine,
    getStableTableSort: (...a: any[]) => getStableTableSort(...a),
  });

  const renderGlobalInteractionActionButton = createRenderGlobalInteractionActionButton({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
  });

  const getGlobalInteractionAvatarLookupNames = createGetGlobalInteractionAvatarLookupNames({
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
  });

  const renderGlobalInteractionAvatar = createRenderGlobalInteractionAvatar({
    buildAvatarBackgroundStyle: (...a: any[]) => buildAvatarBackgroundStyle(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGlobalInteractionAvatarLookupNames: (...a: any[]) => getGlobalInteractionAvatarLookupNames(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    AvatarManager: AvatarManager,
  });

  const renderGlobalInteractionMapMark = createRenderGlobalInteractionMapMark({
    createGlobalInteractionCustomTableNameIconContext: (...a: any[]) => createGlobalInteractionCustomTableNameIconContext(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getLocationEmoji: (...a: any[]) => getLocationEmoji(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderIcon: (...a: any[]) => renderIcon(...a),
  });

  const renderGlobalInteractionGenericMark = createRenderGlobalInteractionGenericMark({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
  });

  const renderGlobalInteractionItemMark = createRenderGlobalInteractionItemMark({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderThemeIconContent: (...a: any[]) => renderThemeIconContent(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
  });

  const renderGlobalInteractionRowCard = createRenderGlobalInteractionRowCard({
    createGlobalInteractionCustomTableNameIconContext: (...a: any[]) => createGlobalInteractionCustomTableNameIconContext(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    renderGlobalInteractionActionButton: (...a: any[]) => renderGlobalInteractionActionButton(...a),
    renderGlobalInteractionAvatar: (...a: any[]) => renderGlobalInteractionAvatar(...a),
    renderGlobalInteractionGenericMark: (...a: any[]) => renderGlobalInteractionGenericMark(...a),
    renderGlobalInteractionItemMark: (...a: any[]) => renderGlobalInteractionItemMark(...a),
    renderGlobalInteractionMapMark: (...a: any[]) => renderGlobalInteractionMapMark(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
  });

  const getGlobalInteractionCollapsedSections = createGetGlobalInteractionCollapsedSections({

  });

  const renderGlobalInteractionsTableGroup = createRenderGlobalInteractionsTableGroup({
    renderGlobalInteractionRowCard: (...a: any[]) => renderGlobalInteractionRowCard(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
  });

  const renderGlobalInteractionsSection = createRenderGlobalInteractionsSection({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGlobalInteractionCollapsedSections: (...a: any[]) => getGlobalInteractionCollapsedSections(...a),
    renderGlobalInteractionsTableGroup: (...a: any[]) => renderGlobalInteractionsTableGroup(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
  });

  const renderGlobalInteractionsPanel = createRenderGlobalInteractionsPanel({
    buildGlobalInteractionGroups: (...a: any[]) => buildGlobalInteractionGroups(...a),
    createGlobalInteractionSections: (...a: any[]) => createGlobalInteractionSections(...a),
    debugGlobalInteraction: (...a: any[]) => debugGlobalInteraction(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    renderGlobalInteractionsSection: (...a: any[]) => renderGlobalInteractionsSection(...a),
  });

  const hydrateGlobalInteractionAvatars = createHydrateGlobalInteractionAvatars({
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getCore: (...a: any[]) => getCore(...a),
    getGlobalInteractionAvatarLookupNames: (...a: any[]) => getGlobalInteractionAvatarLookupNames(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    AvatarManager: AvatarManager,
  });

  const bindGlobalInteractionEvents = createBindGlobalInteractionEvents({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    clearGlobalInteractionOutsideCapture: (...a: any[]) => clearGlobalInteractionOutsideCapture(...a),
    closePanel: (...a: any[]) => closePanel(...a),
    debugGlobalInteraction: (...a: any[]) => debugGlobalInteraction(...a),
    dedupeInteractionActions: (...a: any[]) => dedupeInteractionActions(...a),
    executeTableInteractionAction: (...a: any[]) => executeTableInteractionAction(...a),
    getCore: (...a: any[]) => getCore(...a),
    getGlobalInteractionCollapsedSections: (...a: any[]) => getGlobalInteractionCollapsedSections(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateGlobalInteractionAvatars: (...a: any[]) => hydrateGlobalInteractionAvatars(...a),
    isRecord: (...a: any[]) => isRecord(...a),
    isTwoDimensionalArray: (...a: any[]) => isTwoDimensionalArray(...a),
    normalizeInteractionLabel: (...a: any[]) => normalizeInteractionLabel(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    startTutorialFromButton: (...a: any[]) => startTutorialFromButton(...a),
    bindCompositionSafeSearchInput: (...a: any[]) => bindCompositionSafeSearchInput(...a),
    getInteractOptionsForRow: (...a: any[]) => getInteractOptionsForRow(...a),
    showActionPresetManager: (...a: any[]) => showActionPresetManager(...a),
    STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS: STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS,
    getCachedRawData: () => cachedRawData_ACC.v,
    getCleanupGlobalInteractionOutsideCapture: () => cleanupGlobalInteractionOutsideCapture,
    setCleanupGlobalInteractionOutsideCapture: (v: any) => { cleanupGlobalInteractionOutsideCapture = v; },
  });

  // [新增] 绑定变更面板事件
  const bindChangesEvents = createBindChangesEvents({
    appendRowInstantly: (...a: any[]) => appendRowInstantly(...a),
    closePanel: (...a: any[]) => closePanel(...a),
    deleteRowInstantly: (...a: any[]) => deleteRowInstantly(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    refreshChangesPanel: (...a: any[]) => refreshChangesPanel(...a),
    removeDiffDataRow: (...a: any[]) => removeDiffDataRow(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    resolveExistingTableName: (...a: any[]) => resolveExistingTableName(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
    saveDataToDatabase: (...a: any[]) => saveDataToDatabase(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setActiveTableNavButton: (...a: any[]) => setActiveTableNavButton(...a),
    setDiffDataCell: (...a: any[]) => setDiffDataCell(...a),
    setDiffDataRow: (...a: any[]) => setDiffDataRow(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    showChangeEditModal: (...a: any[]) => showChangeEditModal(...a),
    showChangeSingleFieldModal: (...a: any[]) => showChangeSingleFieldModal(...a),
    showRowCompareEditModal: (...a: any[]) => showRowCompareEditModal(...a),
    showSmartFixModal: (...a: any[]) => showSmartFixModal(...a),
    updateChangesCount: (...a: any[]) => updateChangesCount(...a),
    warnMissingTableTarget: (...a: any[]) => warnMissingTableTarget(...a),
    STORAGE_KEY_DASHBOARD_ACTIVE: STORAGE_KEY_DASHBOARD_ACTIVE,
    STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE: STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
    STORAGE_KEY_VALIDATION_MODE: STORAGE_KEY_VALIDATION_MODE,
    getCachedRawData: () => cachedRawData_ACC.v,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
  });

  // [新增] 刷新变更面板（辅助函数）
  const refreshChangesPanel = createRefreshChangesPanel({
    bindChangesEvents: (...a: any[]) => bindChangesEvents(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    updateChangesCount: (...a: any[]) => updateChangesCount(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
  });

  // [新增] 更新审核按钮计数（包含变更数 + 验证错误数）
  const updateChangesCount = createUpdateChangesCount({
    countRuntimeDataChanges: (...a: any[]) => countRuntimeDataChanges(...a),
    getCore: (...a: any[]) => getCore(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    ValidationEngine: ValidationEngine,
  });
  // [新增] 变更面板专用编辑弹窗（保存后只更新单行快照）
  const showChangeEditModal = createShowChangeEditModal({
    bindChangesEvents: (...a: any[]) => bindChangesEvents(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeDiffRow: (...a: any[]) => normalizeDiffRow(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setDiffDataRow: (...a: any[]) => setDiffDataRow(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
    getIsSettingsOpen: () => isSettingsOpen_ACC.v,
    setIsSettingsOpen: (v: any) => { isSettingsOpen_ACC.v = v; },
  });
  // [新增] 变更面板专用单字段编辑弹窗
  const showChangeSingleFieldModal = createShowChangeSingleFieldModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    refreshChangesPanel: (...a: any[]) => refreshChangesPanel(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setDiffDataCell: (...a: any[]) => setDiffDataCell(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
  });

  // [新增] 多字段变更整体对比编辑弹窗
  const showRowCompareEditModal = createShowRowCompareEditModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeDiffRow: (...a: any[]) => normalizeDiffRow(...a),
    refreshChangesPanel: (...a: any[]) => refreshChangesPanel(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setDiffDataRow: (...a: any[]) => setDiffDataRow(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
  });
  const renderDashboard = createRenderDashboard({
    buildAvatarBackgroundStyle: (...a: any[]) => buildAvatarBackgroundStyle(...a),
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getDashboardNpcListData: (...a: any[]) => getDashboardNpcListData(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    AvatarManager: AvatarManager,
    DashboardDataParser: DashboardDataParser,
    NameAliasRegistry: NameAliasRegistry,
  });

  const INVENTORY_TYPE_OPTIONS = ['全部', '消耗品', '材料', '任务物品', '道具'] as const;
  const INVENTORY_QUALITY_OPTIONS = ['全部', '普通', '优秀', '稀有', '史诗', '传说', '神话', '唯一'] as const;
  const INVENTORY_SORT_OPTIONS = createInventorySortOptions({

  });
  type InventoryTypeFilter = (typeof INVENTORY_TYPE_OPTIONS)[number];
  type InventoryQualityFilter = (typeof INVENTORY_QUALITY_OPTIONS)[number];
  type InventorySortFilter = (typeof INVENTORY_SORT_OPTIONS)[number]['value'];
  type InventoryFilterState = {
    search: string;
    type: InventoryTypeFilter;
    quality: InventoryQualityFilter;
    sort: InventorySortFilter;
  };
  type CompositionSafeSearchPayload = {
    input: HTMLInputElement;
    value: string;
    selectionStart: number;
    selectionEnd: number;
  };
  type CompositionSafeSearchBinding = {
    root: JQuery;
    selector?: string;
    namespace?: string;
  };
  type CompositionSafeSearchOptions = {
    delay: number;
    onCommit: (payload: CompositionSafeSearchPayload) => void;
  };
  type InventoryFilterButtonMeta<T extends string> = {
    value: T;
    icon: string;
    label: string;
  };
  type InventoryParsedItem = {
    name: string;
    type: string;
    quantityText: string;
    quantity: number;
    quality: string;
    tags: string;
    effect: string;
    description: string;
    rowIndex: number;
    tableName: string;
    tableKey: string;
    isNew: boolean;
    quantityChanged: boolean;
    isChanged: boolean;
  };
  type GachaRewardColumnMap = {
    name: number;
    type: number;
    quantity: number;
    quality: number;
    tags?: number;
    effect?: number;
    description: number;
    part?: number;
    status?: number;
  };
  type GachaRewardParseResult = {
    tableName: string;
    tableKey: string;
    headers: unknown[];
    items: InventoryParsedItem[];
    colMap: GachaRewardColumnMap;
  };
  type GachaRewardParseOptions = {
    targetTable?: string;
    targetColumns?: GachaRewardTargetColumns;
    requireNameColumn?: boolean;
  };
  type InventoryMetadataRecord = {
    acquiredAt: string;
    acquiredAtLocation: string;
  };
  type InventoryEditableField =
    | 'name'
    | 'type'
    | 'quantity'
    | 'quality'
    | 'description'
    | 'acquiredAtLocation'
    | 'acquiredAt';
  type InventoryMenuScope = 'card' | 'summary' | 'meta' | 'field';
  type InventoryMetadataScope = Record<string, InventoryMetadataRecord>;
  type InventoryMetadataRoot = Record<string, InventoryMetadataScope>;
  type InventoryMetadataStore = Record<string, InventoryMetadataRoot>;
  // [x4-i] 抽卡设置/配置装配已迁出：见 ./wiring/gacha-settings-wiring.ts
  const { DEFAULT_GACHA_SETTINGS_ITEM_FILTERS, GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS, GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH, GACHA_CUSTOM_FIELD_MAX_COUNT, GACHA_CUSTOM_FIELD_RESERVED_KEYS, GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH, GACHA_EFFECT_FIELD_ALIASES, GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS, GACHA_SETTINGS_SORT_OPTIONS, GACHA_SETTINGS_SOURCE_FILTER_OPTIONS, GACHA_SETTINGS_STATUS_FILTER_OPTIONS, GACHA_TAG_FIELD_ALIASES, GACHA_TARGET_COLUMN_KEYS, GACHA_TARGET_COLUMN_LABELS, GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH, GACHA_TARGET_TABLE_MAX_LENGTH, INVENTORY_QUALITY_FILTER_META, INVENTORY_TYPE_FILTER_META, addGachaShards, analyzeGachaCatalogImport, applyGachaCatalogImport, assertSaveStoredGachaStateSnapshot, bindCompositionSafeSearchInput, buildAdvancedPresetAgentPrompt, buildCrudColumnAliasMap, buildDefaultGachaPoolDefinition, buildGachaInventoryMetaRecord, buildStableGachaCustomItemId, canDeleteGachaPoolDefinition, cloneGachaCatalogItems, collectGachaLocalStorageSnapshot, compareGachaItemDefinitionsForDisplay, createDefaultGachaState, createEmptyGachaCatalog, createUniqueGachaItemId, deleteGachaItemSetting, downloadGachaCatalogJson, ensureGachaCatalogLoaded, ensureGachaPoolsForTags, exportGachaCatalogJson, formatGachaCatalogImportStatsText, formatGachaItemCardMeta, formatGachaPoolTags, formatGachaRewardDestinationLabel, getActiveGachaPoolTags, getAllGachaItemDefinitions, getAllGachaPoolConfigDefinitions, getAvailableGachaRewardTargets, getConfiguredGachaPoolDefinitions, getCustomGachaItemDefinitions, getGachaActivePoolTag, getGachaCatalogImportFailureMessage, getGachaCatalogItemsForExport, getGachaCustomFieldEntries, getGachaCustomFieldsSearchText, getGachaItemDefinitionFingerprint, getGachaItemDescriptionText, getGachaItemEffectText, getGachaItemTagsText, getGachaMinimumRarity, getGachaNamedCustomField, getGachaPickupItems, getGachaPoolDefinitions, getGachaPoolDisplayName, getGachaRarityIconClass, getGachaRarityRank, getGachaRewardFieldLimits, getGachaRewardParseResult, getGachaRewardParseResultForItem, getGachaRewardTargetOptions, getGachaRewardTargetTableLabel, getGachaShardLabel, getGachaState, getGachaTargetColumnEntries, getInventoryFilters, getInventoryFiltersCollapsedState, getInventoryPanelTarget, getRuntimeGachaRawData, getStoredGachaActivePoolTag, getStoredGachaItemSettings, getVisibleGachaPoolConfigDefinitions, hasGachaCustomFields, hasGachaRewardTableForItem, importGachaCatalogJsonFromFile, inferEquipmentTableTypeForGachaItem, isBuiltinGachaPoolId, isGachaFieldAlias, isGachaItemEnabled, isGachaRarity, mergeGachaCatalogRecordsToGlobalScope, migrateGachaCatalogRecordsToGlobalScope, normalizeGachaCatalogRecord, normalizeGachaCustomFields, normalizeGachaItemEnabled, normalizeGachaItemOrder, normalizeGachaPoolDefinition, normalizeGachaRewardTarget, normalizeGachaTargetColumns, normalizeGachaTargetTable, normalizeGachaTimestamp, normalizeImportedGachaItem, persistRawDataWithGacha, pickGachaItemDefinition, pickGachaRarity, recordGachaFortuneGain, renderGachaCustomFieldsDetailsHtml, renderGachaCustomFieldsPreviewHtml, restoreGachaLocalStorageSnapshot, saveGachaPoolSettings, saveInventoryFilters, saveInventoryFiltersCollapsedState, saveInventoryPanelTarget, saveStoredGachaActivePoolTag, saveStoredGachaCatalog, saveStoredGachaStateSnapshot, serializeGachaCatalogItemForExport, setEquipmentRowBasicFields, setGachaItemOrder, setGachaPoolOrder, setInventoryRowBasicFields, settleGachaFortuneForDiceEvent, showGachaCatalogClearDialog, showGachaSaveError, touchGachaActivity, truncateGachaText, updateGachaItemSetting, updateGachaPoolConfig, validateGachaCatalogImportItemTarget, gachaCatalogCache_ACC, gachaCatalogLoadTask_ACC } = createGachaSettingsWiring({ GACHA_CATALOG_GLOBAL_SCOPE_KEY, GACHA_TEST_DEFAULT_FORTUNE, INVENTORY_QUALITY_OPTIONS, INVENTORY_SORT_OPTIONS, INVENTORY_TYPE_OPTIONS, addCrudColumnAlias, applyGachaCustomFieldsToRow: (...a: any[]) => applyGachaCustomFieldsToRow(...a), assertCrudEnumConstraints, assertCrudInsertRequiredCells, assertCrudLengthConstraints, assertCrudRequiredColumnsRepresented, buildCrudEnumConstraintMap, cloneDiceConfigBackupValue, downloadJsonFile, downloadJsoncFile, escapeHtml, getConfig, getCore, getCrudColumnNameForHeader, getCrudSheetDdl, getCrudSqlCommentAliases, getCurrentContextFingerprint, getDbChatMessages, getInventoryGlobalContext: (...a: any[]) => getInventoryGlobalContext(...a), getInventoryMetadataForItem: (...a: any[]) => getInventoryMetadataForItem(...a), getJsonLikeErrorMessage, getRuntimeErrorMessage, getTableData, hasSheetKeys, parseCrudColumnDefinitionLine, parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a), parseInventoryItems: (...a: any[]) => parseInventoryItems(...a), parseJsoncValue, performSaveDataOnly, pickTextFile, refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a), refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a), runInSaveQueue, setupOverlayClose, showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a), stripCrudSqlNonStructuralComments, validateGachaCustomFieldsForTargetTable: (...a: any[]) => validateGachaCustomFieldsForTargetTable(...a), cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, lastHumanInputActivityAt_ACC: { get v(){ return lastHumanInputActivityAt; }, set v(x){ lastHumanInputActivityAt = x; } } });

  // [x4-j] 抽卡主流程/面板装配已迁出：见 ./wiring/gacha-draw-wiring.ts
  const { applyGachaCustomFieldsToRow, buildGachaCustomFieldHeaderMap, clearGachaFortune, deleteGachaPoolConfig, findGachaDefinitionByInventoryItem, getGachaFortuneProgressView, getGachaItemGrantQuantity, getGachaReservedCustomFieldHeaders, getGachaShopProgressContainers, grantGachaReward, performGachaDraw, renderGachaPanelHtml, showGachaPickupItemDetail, showGachaPoolNameDialog, showGachaRecentRewardDetail, showGachaSettingsDialog, updateGachaFortuneProgressDom, updateGachaPoolTag, updateGachaShopProgressUi, validateGachaCustomFieldsForTargetTable } = createGachaDrawWiring({ DEFAULT_GACHA_SETTINGS_ITEM_FILTERS, GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS, GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS, GACHA_SETTINGS_SORT_OPTIONS, GACHA_SETTINGS_SOURCE_FILTER_OPTIONS, GACHA_SETTINGS_STATUS_FILTER_OPTIONS, addGachaShards, assertCrudEnumConstraints, assertCrudInsertRequiredCells, assertCrudLengthConstraints, assertCrudRequiredColumnsRepresented, assertSaveStoredGachaStateSnapshot, bindTutorialButtonsIn, buildCrudRequiredHeaderSet, buildDefaultGachaPoolDefinition, buildGachaCatalogAgentPrompt, buildGachaCatalogAgentPromptFilename, buildGachaInventoryMetaRecord, canDeleteGachaPoolDefinition, cloneGachaCatalogItems, cloneRuntimeDataValue, collectGachaLocalStorageSnapshot, collectHostAndLocalNodes, compareGachaItemDefinitionsForDisplay, createDefaultGachaState, createSortableList, deleteGachaItemSetting, downloadAiPromptFile, downloadGachaCatalogJson, ensureGachaCatalogLoaded, ensureGachaPoolsForTags, escapeHtml, formatGachaItemCardMeta, formatGachaPoolTags, formatGachaRewardDestinationLabel, gachaCatalogCache_ACC, gachaCatalogLoadTask_ACC, getAllGachaItemDefinitions, getAllGachaPoolConfigDefinitions, getAvailableGachaRewardTargets, getConfig, getConfiguredGachaPoolDefinitions, getCore, getCustomGachaItemDefinitions, getGachaActivePoolTag, getGachaCatalogItemsForExport, getGachaCustomFieldEntries, getGachaCustomFieldsSearchText, getGachaItemCustomTableNameIconContext, getGachaItemDescriptionText, getGachaItemEffectText, getGachaItemTagsText, getGachaMinimumRarity, getGachaPickupItems, getGachaPoolDefinitions, getGachaPoolDisplayName, getGachaRarityRank, getGachaRewardParseResultForItem, getGachaRewardTargetTableLabel, getGachaShardLabel, getGachaState, getGachaTargetColumnEntries, getJsonLikeErrorMessage, getRuntimeErrorMessage, getRuntimeGachaRawData, getStoredGachaActivePoolTag, getStoredGachaItemSettings, getTableData, getTutorialButtonHtml, getVisibleGachaPoolConfigDefinitions, hasGachaCustomFields, hydrateCustomTableNameIconsIn, importGachaCatalogJsonFromFile, isGachaItemEnabled, normalizeGachaTimestamp, parseInventoryItems: (...a: any[]) => parseInventoryItems(...a), persistRawDataWithGacha, pickGachaItemDefinition, pickGachaRarity, refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a), refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a), refreshInventoryVisualization: (...a: any[]) => refreshInventoryVisualization(...a), renderGachaCustomFieldsDetailsHtml, renderGachaCustomFieldsPreviewHtml, renderGachaItemIconContent, restoreGachaLocalStorageSnapshot, restoreMutableRuntimeValue, runInSaveQueue, saveGachaPoolSettings, saveStoredGachaActivePoolTag, saveStoredGachaCatalog, saveStoredGachaStateSnapshot, setEquipmentRowBasicFields, setGachaItemOrder, setGachaPoolOrder, setInventoryMetadataForItem: (...a: any[]) => setInventoryMetadataForItem(...a), setInventoryRowBasicFields, setupOverlayClose, showDiceSystemConfirmDialog, showGachaCatalogClearDialog, showGachaItemEditorDialog: (...a: any[]) => showGachaItemEditorDialog(...a), showGachaSaveError, touchGachaActivity, updateGachaItemSetting, updateGachaPoolConfig, warnTableTemplateIssue, withTableTemplateCheckHint, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, gachaShopRootElement_ACC: { get v(){ return gachaShopRootElement; }, set v(x){ gachaShopRootElement = x; } } });

  const showGachaItemEditorDialog = createShowGachaItemEditorDialog({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    buildGachaCustomFieldHeaderMap: (...a: any[]) => buildGachaCustomFieldHeaderMap(...a),
    buildStableGachaCustomItemId: (...a: any[]) => buildStableGachaCustomItemId(...a),
    collectGachaLocalStorageSnapshot: (...a: any[]) => collectGachaLocalStorageSnapshot(...a),
    countUnicodeCharacters: (...a: any[]) => countUnicodeCharacters(...a),
    createUniqueGachaItemId: (...a: any[]) => createUniqueGachaItemId(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    ensureGachaPoolsForTags: (...a: any[]) => ensureGachaPoolsForTags(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
    getGachaItemCustomTableNameIconContext: (...a: any[]) => getGachaItemCustomTableNameIconContext(...a),
    getGachaItemDefinitionFingerprint: (...a: any[]) => getGachaItemDefinitionFingerprint(...a),
    getGachaNamedCustomField: (...a: any[]) => getGachaNamedCustomField(...a),
    getGachaReservedCustomFieldHeaders: (...a: any[]) => getGachaReservedCustomFieldHeaders(...a),
    getGachaRewardFieldLimits: (...a: any[]) => getGachaRewardFieldLimits(...a),
    getGachaShopProgressContainers: (...a: any[]) => getGachaShopProgressContainers(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    inferEquipmentTableTypeForGachaItem: (...a: any[]) => inferEquipmentTableTypeForGachaItem(...a),
    isGachaFieldAlias: (...a: any[]) => isGachaFieldAlias(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    normalizeGachaCustomFields: (...a: any[]) => normalizeGachaCustomFields(...a),
    normalizeGachaRewardTarget: (...a: any[]) => normalizeGachaRewardTarget(...a),
    normalizeGachaTargetColumns: (...a: any[]) => normalizeGachaTargetColumns(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
    parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    renderGachaItemIconContent: (...a: any[]) => renderGachaItemIconContent(...a),
    restoreGachaLocalStorageSnapshot: (...a: any[]) => restoreGachaLocalStorageSnapshot(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    saveStoredGachaCatalog: (...a: any[]) => saveStoredGachaCatalog(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showGachaPoolNameDialog: (...a: any[]) => showGachaPoolNameDialog(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
    startGachaShopUiRefresh: (...a: any[]) => startGachaShopUiRefresh(...a),
    truncateGachaText: (...a: any[]) => truncateGachaText(...a),
    validateGachaCatalogImportItemTarget: (...a: any[]) => validateGachaCatalogImportItemTarget(...a),
    validateGachaCustomFieldsForTargetTable: (...a: any[]) => validateGachaCustomFieldsForTargetTable(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH: GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH,
    GACHA_CUSTOM_FIELD_MAX_COUNT: GACHA_CUSTOM_FIELD_MAX_COUNT,
    GACHA_CUSTOM_FIELD_RESERVED_KEYS: GACHA_CUSTOM_FIELD_RESERVED_KEYS,
    GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH: GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH,
    GACHA_EFFECT_FIELD_ALIASES: GACHA_EFFECT_FIELD_ALIASES,
    GACHA_TAG_FIELD_ALIASES: GACHA_TAG_FIELD_ALIASES,
    GACHA_TARGET_COLUMN_KEYS: GACHA_TARGET_COLUMN_KEYS,
    GACHA_TARGET_COLUMN_LABELS: GACHA_TARGET_COLUMN_LABELS,
    GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH: GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH,
    GACHA_TARGET_TABLE_MAX_LENGTH: GACHA_TARGET_TABLE_MAX_LENGTH,
    STORAGE_KEY_GACHA_POOL_SETTINGS: STORAGE_KEY_GACHA_POOL_SETTINGS,
    getCachedRawData: () => cachedRawData_ACC.v,
    getGachaCatalogCache: () => gachaCatalogCache_ACC.v,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache_ACC.v = v; },
    getGachaCatalogLoadTask: () => gachaCatalogLoadTask_ACC.v,
    setGachaCatalogLoadTask: (v: any) => { gachaCatalogLoadTask_ACC.v = v; },
      getGachaShopUiRefreshTimer: () => gachaShopUiRefreshTimer,
    setGachaShopUiRefreshTimer: (v: any) => { gachaShopUiRefreshTimer = v; },
});

  // [x4-h] 抽卡/库存/商店装配已迁出：见 ./wiring/gacha-inventory-wiring.ts
  const { bindEvents, bindFavoritesEvents, closeGachaVisualization, closePanel, ensureGachaHeartbeat, ensurePanelNavigationVisible, flushGachaHeartbeatProgress, getDataAreaForRoot, getInventoryGlobalContext, getInventoryMetadataForItem, loadDashboardNpcAvatars, parseEquipmentItems, parseInventoryItems, refreshGachaShardShop, refreshGachaVisualization, refreshInventoryVisualization, renderFavoritesPanel, renderTableContent, resolveExistingTableName, saveCurrentTabState, setActiveTableNavButton, setInventoryMetadataForItem, settleGachaFortuneForMessage, showGachaShardShop, showGachaVisualization, startGachaShopUiRefresh, syncHostRegenerateButtonVisibility, syncInventoryMetadataForRawData, warnMissingTableTarget } = createGachaInventoryWiring({ AvatarManager, BookmarkManager, DashboardDataParser, FLOATING_COLLAPSE_DRAG_THRESHOLD, GACHA_CATALOG_RAW_ROW_INDEX_PROP, GACHA_SHARD_EXCHANGE_COST, GACHA_SHOP_UI_REFRESH_MS, INVENTORY_QUALITY_FILTER_META, INVENTORY_SORT_OPTIONS, INVENTORY_TYPE_FILTER_META, INVENTORY_TYPE_OPTIONS, MvuModule, NameAliasRegistry, ValidationRuleManager, addGachaShards, applyStoredPanelHeight, bindChangesEvents, bindCompositionSafeSearchInput, bindGlobalInteractionEvents, buildCrudColumnAliasMap, buildRelationshipGraphTableFromPreset, canWriteMvuPanel, clampFloatingCollapsePosition, cleanupGlobalInteractionFloatingMenus, clearAllPanelStates, clearGachaFortune, cloneRuntimeDataValue, collectCurrentChatAvatarNodes, compareGachaItemDefinitionsForDisplay, consumePendingHumanInputSnapshot, countUnicodeCharacters, createCustomTableNameIconContext, createDefaultGachaState, ensureGachaCatalogLoaded, escapeHtml, executeTableInteractionAction, extractNumericValue, findGachaDefinitionByInventoryItem, findRowIndexByPrimaryKey, formatCssImageUrl, formatGachaItemCardMeta, formatGachaRewardDestinationLabel, getActiveDashboardRelationshipGraphSources, getActiveTabState, getAllGachaItemDefinitions, getAttributeValue, getCheckSuggestionItemsFromTable, getCollapsedState, getConfig, getConfiguredGachaPoolDefinitions, getCore, getCrudColumnNameForHeader, getCrudSqlTableName, getCurrentContextFingerprint, getDashboardModuleConfig, getDatabaseManualUpdateErrorMessage, getDbChatMessages, getElementEmoji, getFullAttributesForCharacter, getGachaActivePoolTag, getGachaItemCustomTableNameIconContext, getGachaItemDescriptionText, getGachaItemEffectText, getGachaItemGrantQuantity, getGachaPoolDefinitions, getGachaPoolDisplayName, getGachaRarityIconClass, getGachaRewardParseResultForItem, getGachaShardLabel, getGachaShopProgressContainers, getGachaState, getGachaTargetColumnEntries, getIconForTableName, getInteractOptionsForRow, getInventoryFilters, getInventoryFiltersCollapsedState, getInventoryPanelTarget, getOptionItemsFromTable, getOptionsCollapsedState, getPanelDragStartHeight, getSheetKeyByTableName, getTableData, getTableStyles, getTavernHostDocument, getTavernHostWindow, getTutorialButtonHtml, getVisibleGachaPoolConfigDefinitions, grantGachaReward, hasGachaCustomFields, hasGachaRewardTableForItem, hydrateCustomTableNameIconsIn, isCheckSuggestionTableName, isFloatingCollapseActive, isGachaItemEnabled, isGachaRarity, isOptionTableName, isTableReversed, normalizeDiffText, normalizeGachaTargetTable, openDatabaseInterface, openDatabaseVisualizerInterface, performGachaDraw, persistRawDataWithGacha, processJsonData, recordGachaFortuneGain, renderChangesPanel, renderCustomTableNameIconContent, renderDashboard, renderDataCardCellContent, renderGachaCustomFieldsDetailsHtml, renderGachaCustomFieldsPreviewHtml, renderGachaItemIconContent, renderGachaPanelHtml, renderGlobalInteractionsPanel, renderInterface, renderThemeIconContent, replaceUserPlaceholders, resetPanelRequestedHeight, runDatabaseManualUpdate, runInSaveQueue, safeDecodeURIComponent, safeEncodeURIComponent, saveActiveTabState, saveCollapsedState, saveConfig, saveDataToDatabase, saveInventoryFilters, saveInventoryFiltersCollapsedState, saveInventoryPanelTarget, saveOptionsCollapsedState, savePanelRequestedHeight, saveRowInstantly, saveStoredGachaStateSnapshot, saveTableStyles, scheduleFixedWrapperBoundsRefresh, scheduleViewportBoundsRefresh, setPanelRequestedHeight, setupOverlayClose, shouldShowReverseButton, showAvatarManager, showCardEditModal, showCellMenu: (...a: any[]) => showCellMenu(...a), showContestPanel, showDashboardPresetManager, showDatabaseManualUpdateFailure, showDicePanel, showDiceSystemInputDialog, showEditDialog: (...a: any[]) => showEditDialog(...a), showFavoriteEditModal, showGachaPickupItemDetail, showGachaRecentRewardDetail, showGachaSaveError, showGachaSettingsDialog, showMapVisualization, showRelationshipGraph, showSendToTableModal, showSettingsModal, smartInsertToTextarea, startTutorialFromButton, stripSystemInjectedContent, toggleTableReverse, touchGachaActivity, updateGachaFortuneProgressDom, updateGachaPoolTag, updateGachaShopProgressUi, warnTableTemplateIssue, withTableTemplateCheckHint, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, currentDiffMap_ACC: { get v(){ return currentDiffMap_ACC.v; }, set v(x){ currentDiffMap_ACC.v = x; } }, gachaHeartbeatTimer_ACC: { get v(){ return gachaHeartbeatTimer; }, set v(x){ gachaHeartbeatTimer = x; } }, gachaShopRootElement_ACC: { get v(){ return gachaShopRootElement; }, set v(x){ gachaShopRootElement = x; } }, gachaShopUiRefreshTimer_ACC: { get v(){ return gachaShopUiRefreshTimer; }, set v(x){ gachaShopUiRefreshTimer = x; } }, hasUnsavedChanges_ACC: { get v(){ return hasUnsavedChanges_ACC.v; }, set v(x){ hasUnsavedChanges_ACC.v = x; } }, isEditingOrder_ACC: { get v(){ return isEditingOrder_ACC.v; }, set v(x){ isEditingOrder_ACC.v = x; } }, lastHumanInputActivityAt_ACC: { get v(){ return lastHumanInputActivityAt; }, set v(x){ lastHumanInputActivityAt = x; } }, suppressNextFloatingCollapseClick_ACC: { get v(){ return suppressNextFloatingCollapseClick; }, set v(x){ suppressNextFloatingCollapseClick = x; } }, tablePageStates_ACC: { get v(){ return tablePageStates_ACC.v; }, set v(x){ tablePageStates_ACC.v = x; } }, tableScrollStates_ACC: { get v(){ return tableScrollStates_ACC.v; }, set v(x){ tableScrollStates_ACC.v = x; } }, tableSearchStates_ACC: { get v(){ return tableSearchStates_ACC.v; }, set v(x){ tableSearchStates_ACC.v = x; } }, tutorialButtonEventsBound_ACC: { get v(){ return tutorialButtonEventsBound_ACC.v; }, set v(x){ tutorialButtonEventsBound_ACC.v = x; } } });

  let selectedSwapSource = null;
  const toggleOrderEditMode = createToggleOrderEditMode({
    getCore: (...a: any[]) => getCore(...a),
    initSortable: (...a: any[]) => initSortable(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveTableOrder: (...a: any[]) => saveTableOrder(...a),
    syncHostRegenerateButtonVisibility: (...a: any[]) => syncHostRegenerateButtonVisibility(...a),
    STORAGE_KEY_ACTION_ORDER: STORAGE_KEY_ACTION_ORDER,
    getSelectedSwapSource: () => selectedSwapSource,
    setSelectedSwapSource: (v: any) => { selectedSwapSource = v; },
      getIsEditingOrder: () => isEditingOrder_ACC.v,
    setIsEditingOrder: (v: any) => { isEditingOrder_ACC.v = v; },
});

  const initSortable = createInitSortable({
    getCore: (...a: any[]) => getCore(...a),
    MAX_ACTION_BUTTONS: MAX_ACTION_BUTTONS,
    getSelectedSwapSource: () => selectedSwapSource,
    setSelectedSwapSource: (v: any) => { selectedSwapSource = v; },
  });

  const showCellMenu = createShowCellMenu({
    appendRowInstantly: (...a: any[]) => appendRowInstantly(...a),
    deleteRowInstantly: (...a: any[]) => deleteRowInstantly(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    findRowIndexByPrimaryKey: (...a: any[]) => findRowIndexByPrimaryKey(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getBadgeStyle: (...a: any[]) => getBadgeStyle(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    getSheetHeaders: (...a: any[]) => getSheetHeaders(...a),
    getSheetKeyByTableName: (...a: any[]) => getSheetKeyByTableName(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    showCardEditModal: (...a: any[]) => showCardEditModal(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showDiceSystemInputDialog: (...a: any[]) => showDiceSystemInputDialog(...a),
    showEditDialog: (...a: any[]) => showEditDialog(...a),
    showTagInputModal: (...a: any[]) => showTagInputModal(...a),
    updateSaveButtonState: (...a: any[]) => updateSaveButtonState(...a),
    getCachedRawData: () => cachedRawData_ACC.v,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    setCurrentDiffMap: (v: any) => { currentDiffMap_ACC.v = v; },
    getHasUnsavedChanges: () => hasUnsavedChanges_ACC.v,
    setHasUnsavedChanges: (v: any) => { hasUnsavedChanges_ACC.v = v; },
  });

  const showEditDialog = createShowEditDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  // ==========================================
  // [优化后] 新的初始化入口 (Observer 只创建一次)
  // ==========================================
  // 检测可视化前端冲突
  const detectVisualizerConflict = createDetectVisualizerConflict({
    getCore: (...a: any[]) => getCore(...a),
  });

  // 显示冲突错误对话框
  const showConflictDialog = createShowConflictDialog({
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  const init = createInit({
    addStyles: (...a: any[]) => addStyles(...a),
    bindAcuDiceGachaRegexActions: (...a: any[]) => bindAcuDiceGachaRegexActions(...a),
    bindHumanInputTracking: (...a: any[]) => bindHumanInputTracking(...a),
    capturePendingHumanInputSnapshot: (...a: any[]) => capturePendingHumanInputSnapshot(...a),
    detectVisualizerConflict: (...a: any[]) => detectVisualizerConflict(...a),
    ensureGachaHeartbeat: (...a: any[]) => ensureGachaHeartbeat(...a),
    flushGachaHeartbeatProgress: (...a: any[]) => flushGachaHeartbeatProgress(...a),
    generateCrazyRoll: (...a: any[]) => generateCrazyRoll(...a),
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getTutorialModule: (...a: any[]) => getTutorialModule(...a),
    hasRuntimeTableReadApi: (...a: any[]) => hasRuntimeTableReadApi(...a),
    hideDiceResultsInUserMessages: (...a: any[]) => hideDiceResultsInUserMessages(...a),
    interceptTextareaValue: (...a: any[]) => interceptTextareaValue(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    restoreDiceResultBeforeSend: (...a: any[]) => restoreDiceResultBeforeSend(...a),
        maybeRefreshReviewBaselineAtFillStart: (...a: any[]) => maybeRefreshReviewBaselineAtFillStart(...a),
saveCurrentDatabaseSnapshotAsReviewBaseline: (...a: any[]) => saveCurrentDatabaseSnapshotAsReviewBaseline(...a),
    scheduleCharacterDiceProfileDetection: (...a: any[]) => scheduleCharacterDiceProfileDetection(...a),
    scheduleDialogueIndentRender: (...a: any[]) => scheduleDialogueIndentRender(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    settleGachaFortuneForMessage: (...a: any[]) => settleGachaFortuneForMessage(...a),
    shouldTriggerCrazyMode: (...a: any[]) => shouldTriggerCrazyMode(...a),
    showConflictDialog: (...a: any[]) => showConflictDialog(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    ErrorHandler: ErrorHandler,
    MvuModule: MvuModule,
    STORAGE_KEY_SCROLL: STORAGE_KEY_SCROLL,
    UpdateController: UpdateController,
    getCurrentDiffMap: () => currentDiffMap_ACC.v,
    getIsEditingOrder: () => isEditingOrder_ACC.v,
    getIsInitialized: () => isInitialized_ACC.v,
    setIsInitialized: (v: any) => { isInitialized_ACC.v = v; },
    getCachedRawData: () => cachedRawData_ACC.v,
    setCachedRawData: (v: any) => { cachedRawData_ACC.v = v; },
    getTablePageStates: () => tablePageStates_ACC.v,
    setTablePageStates: (v: any) => { tablePageStates_ACC.v = v; },
    getTableSearchStates: () => tableSearchStates_ACC.v,
    setTableSearchStates: (v: any) => { tableSearchStates_ACC.v = v; },
    getTableScrollStates: () => tableScrollStates_ACC.v,
    setTableScrollStates: (v: any) => { tableScrollStates_ACC.v = v; },
    getHasUnsavedChanges: () => hasUnsavedChanges_ACC.v,
    setHasUnsavedChanges: (v: any) => { hasUnsavedChanges_ACC.v = v; },
    getOptionPanelVisible: () => optionPanelVisible_ACC.v,
    setOptionPanelVisible: (v: any) => { optionPanelVisible_ACC.v = v; },
    get_boundRenderHandler: () => _boundRenderHandler_ACC.v,
    set_boundRenderHandler: (v: any) => { _boundRenderHandler_ACC.v = v; },
    get_boundReviewBaselineHandler: () => _boundReviewBaselineHandler_ACC.v,
    set_boundReviewBaselineHandler: (v: any) => { _boundReviewBaselineHandler_ACC.v = v; },
    getObserver: () => observer_ACC.v,
    setObserver: (v: any) => { observer_ACC.v = v; },
    getGachaHeartbeatTimer: () => gachaHeartbeatTimer,
    setGachaHeartbeatTimer: (v: any) => { gachaHeartbeatTimer = v; },
    getGachaShopUiRefreshTimer: () => gachaShopUiRefreshTimer,
    setGachaShopUiRefreshTimer: (v: any) => { gachaShopUiRefreshTimer = v; },
  });

  // ========================================
  // 测试函数：验证配对表修复逻辑
  // ========================================
  // 在浏览器控制台运行：window.testPairedTableFix()
  window.testPairedTableFix = function () {
    // 构造测试数据：包含空白行、共同编码、各自独有编码、跳号
    const prefix = 'AM';
    const startFrom = 1;
    const columnName = '编码索引';

    // 总结表（表1）：AM0001, AM0002, 空白(错误行), AM0030, 空白(错误行)
    // 有效编码：AM0001, AM0002, AM0030
    const table1Sheet = {
      name: '总结表',
      content: [
        ['编码索引', '时间跨度', '纪要'],
        ['AM0001', '时间1', '纪要1'],
        ['AM0002', '时间2', '纪要2'],
        [null, '时间3-错误行', '纪要3-错误行'], // 空白编码（错误行，应保持不动）
        ['AM0030', '时间4', '纪要4'],
        [null, '时间5-错误行', '纪要5-错误行'], // 空白编码（错误行，应保持不动）
      ],
    };

    // 总结大纲表（表2）：空白(错误行), AM0002, AM0030, AM0040, AM0050
    // 有效编码：AM0002, AM0030, AM0040, AM0050
    const table2Sheet = {
      name: '总体大纲',
      content: [
        ['编码索引', '时间跨度', '大纲'],
        [null, '时间A-错误行', '大纲A-错误行'], // 空白编码（错误行，应保持不动）
        ['AM0002', '时间B', '大纲B'],
        ['AM0030', '时间C', '大纲C'],
        ['AM0040', '时间D', '大纲D'],
        ['AM0050', '时间E', '大纲E'],
      ],
    };

    // 提取编码
    const extract1 = extractCodesFromTable(table1Sheet, columnName, prefix);
    const extract2 = extractCodesFromTable(table2Sheet, columnName, prefix);

    // 构建映射
    const mapping = buildCodeMapping(extract1.allCodes, extract2.allCodes, prefix, startFrom);

    // 执行修复
    const rawData = {};
    const result = alignAndFixPairedTables(
      table1Sheet,
      'sheet1',
      table2Sheet,
      'sheet2',
      columnName,
      mapping,
      prefix,
      startFrom,
      rawData,
    );

    // 验证结果
    const getValidCodes = sheet =>
      sheet.content
        .slice(1)
        .map(r => r[0])
        .filter(c => c && String(c).match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+$`)));

    const codes1 = getValidCodes(table1Sheet);
    const codes2 = getValidCodes(table2Sheet);

    // 检查空白行是否保持原数据
    const emptyRows1 = table1Sheet.content
      .slice(1)
      .filter(r => !r[0] || !String(r[0]).match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+$`)));
    const emptyRows2 = table2Sheet.content
      .slice(1)
      .filter(r => !r[0] || !String(r[0]).match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+$`)));

    // 验证编码是否严格递增
    const validateSequence = (codes, prefix, startFrom) => {
      const numbers = codes
        .map(c => {
          if (!c) return null;
          const match = c.match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)$`));
          return match ? parseInt(match[1], 10) : null;
        })
        .filter(n => n !== null);

      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] !== startFrom + i) {
          return false;
        }
      }
      return true;
    };

    const isValid1 = validateSequence(codes1, prefix, startFrom);
    const isValid2 = validateSequence(codes2, prefix, startFrom);

    // 验证两个表的有效编码集合是否一致
    const set1 = new Set(codes1);
    const set2 = new Set(codes2);
    const setsEqual = set1.size === set2.size && [...set1].every(c => set2.has(c));

    // 验证空白行数据是否保留
    const emptyRowsPreserved1 = emptyRows1.some(r => r[1] && r[1].includes('错误行'));
    const emptyRowsPreserved2 = emptyRows2.some(r => r[1] && r[1].includes('错误行'));

    return {
      table1Sheet,
      table2Sheet,
      result,
      codes1,
      codes2,
      emptyRows1,
      emptyRows2,
      isValid1,
      isValid2,
      setsEqual,
      emptyRowsPreserved1,
      emptyRowsPreserved2,
      // 综合验证：有效编码严格递增 + 两表有效编码一致 + 空白行数据保留
      isValid: isValid1 && isValid2 && setsEqual && emptyRowsPreserved1 && emptyRowsPreserved2,
    };
  };

  // 暴露诊断工具到全局（方便控制台调用）
  window.diagnoseDiceVariables = async function () {
    if (typeof MvuModule !== 'undefined' && typeof MvuModule.diagnoseVariableFramework === 'function') {
      return await MvuModule.diagnoseVariableFramework();
    } else {
      console.error('[DICE]MvuModule 未初始化或诊断工具不可用');
      return null;
    }
  };

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

  const gachaRegexActions = createGachaRegexActionsInstance({
    getCore: (...a: any[]) => getCore(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getAcuDiceGachaApi: () => acuDiceGachaApi,
    getRootWindow: () => rootWindow,
  });

  const bindAcuDiceGachaRegexActions = createBindAcuDiceGachaRegexActions({
    gachaRegexActions: gachaRegexActions,
  });

  (AcuDiceAPI as Record<string, unknown>).gacha = acuDiceGachaApi;

  // 使用 Object.defineProperty 防止意外覆盖；在 gacha 子 API 完成后再通知 ready。
  defineAcuDiceOnWindow(window);

  if (rootWindow !== window) {
    try {
      defineAcuDiceOnWindow(rootWindow);
    } catch (error) {
      console.warn('[AcuDice] 无法写入顶层窗口，可能跨域', error);
    }
  }

  notifyReady();
  dispatchReadyEvent(window);
  if (rootWindow !== window) {
    dispatchReadyEvent(rootWindow);
  }

  console.info('[AcuDice] API v1.3.0 已加载');

  const { $ } = getCore();
  if ($) $(document).ready(init);
  else window.addEventListener('load', init);
})();
