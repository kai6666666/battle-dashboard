import { ELEMENT_EMOJI_MAP, LOCATION_EMOJI_MAP, RELATION_ICON_MAP } from './shared/emoji-maps';
import { createGachaRegexActionsWiring } from './wiring/gacha-regex-actions-wiring';
import { createDiceConfigBackupApplyWiring } from './wiring/dice-config-backup-apply-wiring';
import { createContestPanelWiring } from './wiring/contest-panel-wiring';
import { createBindChangesEventsWiring } from './wiring/bind-changes-events-wiring';
import { createTableOrderCellMenuWiring } from './wiring/table-order-cellmenu-wiring';
import { createGachaEditorDialogWiring } from './wiring/gacha-editor-dialog-wiring';
import { createDiceProfilePanelWiring } from './wiring/dice-profile-panel-wiring';
import { createAttrPresetPanelWiring } from './wiring/attr-preset-panel-wiring';
import { createDiceConfigBackupRestoreWiring } from './wiring/dice-config-backup-restore-wiring';
import { createGachaApiWiring } from './wiring/gacha-api-wiring';
import { createGlobalInteractionWiring } from './wiring/global-interaction-wiring';
import { createReviewPanelWiring } from './wiring/review-panel-wiring';
import { createBootstrapWiring } from './wiring/bootstrap-wiring';
import { createActionEngineWiring } from './wiring/action-engine-wiring';
import { createTableIconToolsWiring } from './wiring/table-icon-tools-wiring';
import { createAvatarIdentityWiring } from './wiring/avatar-identity-wiring';
import { createComposerInputWiring } from './wiring/composer-input-wiring';
import { createRenderInterfaceWiring } from './wiring/render-interface-wiring';
import { createPresetApiWiring } from './wiring/preset-api-wiring';
import { createVisualizationWiring } from './wiring/visualization-wiring';
import { createTableStateWiring } from './wiring/table-state-wiring';
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
import { createNormalizeDiffText, normalizeDiffHeaderImpl as normalizeDiffHeader } from './features/table/normalize-diff-text';
import { createNormalizeDatabaseUiText, isDatabaseManualUpdateButtonTextImpl as isDatabaseManualUpdateButtonText } from './features/table/normalize-database-ui-text';
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
import { createSerializeGachaPoolDefinitionForExport, buildGachaExportNamePartImpl as buildGachaExportNamePart } from './features/gacha/serialize-gacha-pool-definition-for-export';
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
import { createNormalizeTrackedText, escapeRegExpLiteralImpl as escapeRegExpLiteral } from './shared/normalize-tracked-text';
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
import { createBuildCustomTableNameIconPack, getCustomTableNameIconPackDownloadFileName as getCustomTableNameIconPackDownloadFileName } from './features/table/build-custom-table-name-icon-pack';
import { createBuildAttributeRulesContent } from './features/dice/build-attribute-rules-content';
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
import { createCheckSheetWriteLocks } from './features/table/check-sheet-write-locks';
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
import { NameAliasRegistryCore, parseCharacterName, getDisplayName, findNameColumnIndex, findExplicitAttributeTableNameColumnIndex, getRowDisplayName, isCharacterTable, CHARACTER_NAME_COLUMN_KEYS, ATTRIBUTE_TABLE_NAME_COLUMN_KEYS } from './entities/name-alias';
import { SCRIPT_ID, DICE_ROOT_CLASS, DICE_ROOT_SELECTOR, HOST_REGENERATE_HIDDEN_CLASS, HOST_REGENERATE_BUTTON_SELECTOR, PRIMARY_KEYS, PRESET_FORMAT_VERSION, SCRIPT_VERSION, isNpcTableName } from './shared/constants';
import advancedPresetAgentPromptTemplate from './docs/advanced-preset-agent-prompt.md?raw';
import dashboardPresetAgentPromptTemplate from './docs/dashboard-preset-agent-prompt.md?raw';
import attributePresetAgentPromptTemplate from './docs/attribute-preset-agent-prompt.md?raw';
import actionPresetAgentPromptTemplate from './docs/action-preset-agent-prompt.md?raw';
import renderPresetAgentPromptTemplate from './docs/render-preset-agent-prompt.md?raw';
import gachaCatalogAgentPromptTemplate from './docs/gacha-catalog-agent-prompt.md?raw';
import tableTemplateRequirementPresetAgentPromptTemplate from './docs/table-template-requirement-preset-agent-prompt.md?raw';
import defaultTableTemplateRequirementRaw from './骰子表格SQL_v4.3.json?raw';
import { DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID, TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT, buildTableTemplateAppendRepairPlan, cloneTemplateValue, createBuiltinTableTemplateRequirementPreset, exportTableTemplateRequirementPreset, getTemplateInspectionSheets as getRequirementInspectionSheets, inspectTableTemplateWithPreset, normalizeTableTemplateRequirementPreset } from './features/table/table-template-requirements';
import { BUILTIN_GACHA_POOL_DEFINITIONS, GACHA_CATALOG_EXPORT_KIND, GACHA_CATALOG_VERSION, FORTUNE_CURRENCY_NAME, GACHA_ACTIVE_HEARTBEAT_MS, GACHA_ACTIVE_SECONDS_PER_FORTUNE, GACHA_CHECK_REWARD, GACHA_CHARS_PER_FORTUNE, GACHA_DRAW_COST_SINGLE, GACHA_DRAW_COST_TEN, GACHA_ITEM_DEFINITIONS, GACHA_LEGEND_PITY_THRESHOLD, GACHA_MESSAGE_REWARD, GACHA_POOL_TAGS, GACHA_RARE_PITY_THRESHOLD, GACHA_RARITY_ORDER, GACHA_RARITY_WEIGHTS, GACHA_RECENT_REWARD_LIMIT, GACHA_REWARD_TARGETS, GACHA_SHARD_VALUES, GACHA_UNIQUE_RARITY, type GachaPoolDefinition, type GachaCustomFields, type GachaItemDefinition, type GachaPoolTag, type GachaRarity, type GachaRewardTarget, type GachaRewardTargetColumnKey, type GachaRewardTargetColumns } from './entities/gacha-items';
import { ACU_DICE_PROFILE_FORMAT, computeAcuDiceProfileFingerprint, createAcuDiceProfileMarker, decodeAcuDiceProfileMarkerPayload, extractAcuDiceProfileMarkerPayloads, getAcuDiceProfilePromptKey, getAcuDiceProfileSourceKey, normalizeAcuDiceProfilePackage, normalizeAcuDiceProfileSource, type AcuDiceProfilePackage, type AcuDiceProfileSource, type NormalizeAcuDiceProfileOptions } from './features/profiles/profile-packages';
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
  // [x4-q] 输入区/发送链/文本缓存与工具装配已迁出：见 ./wiring/composer-input-wiring.ts
  const { BookmarkManager, CUSTOM_ROLL_MODE, DICE_RESULT_PLACEHOLDER, ErrorHandler, GACHA_CATALOG_GLOBAL_SCOPE_KEY, GACHA_CATALOG_RAW_ROW_INDEX_PROP, GACHA_SHARD_EXCHANGE_COST, GACHA_SHOP_UI_REFRESH_MS, GACHA_TEST_DEFAULT_FORTUNE, MAX_ACTION_BUTTONS, MAX_PANEL_HEIGHT, MIN_PANEL_HEIGHT, PANEL_VIEWPORT_TOP_GUTTER, bindHumanInputTracking, buildAvatarBackgroundStyle, capturePendingHumanInputSnapshot, clearComposerIfCurrentText, clearTextareaDiceCache, compareVersion, consumePendingHumanInputSnapshot, countUnicodeCharacters, createMetaCheckResultRegex, errorTableTemplateIssue, escapeHtml, executeEffects, executeSecondaryEffectsChain, findRowIndexByPrimaryKey, formatCssImageUrl, getImageUrlValidationMessage, getRemoteImageUrlValidationError, getResolvedComposerText, getSheetKeyByTableName, interceptTextareaValue, isRenderableImageUrlValid, normalizeStorableImageUrl, readTextareaVisibleValue, renderDeprecatedBadge, restoreDiceResultBeforeSend, safeDecodeURIComponent, safeEncodeURIComponent, sendChatTextAndTrigger, setTextareaValueAndNotify, setupOverlayClose, showPresetConflictDialog, smartInsertToTextarea, storeTextareaDiceCache, stripSystemInjectedContent, syncTextareaDiceCacheFromVisibleText, warnTableTemplateIssue, withTableTemplateCheckHint, gachaHeartbeatTimer_ACC, gachaShopRootElement_ACC, gachaShopUiRefreshTimer_ACC, lastHumanInputActivityAt_ACC } = createComposerInputWiring({ cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, evaluateCondition: (...a: any[]) => (evaluateCondition as any)(...a), evaluateFormula: (...a: any[]) => (evaluateFormula as any)(...a), getAttributeValue: (...a: any[]) => (getAttributeValue as any)(...a), getConfig: (...a: any[]) => (getConfig as any)(...a), getCore: (...a: any[]) => (getCore as any)(...a), getCurrentContextFingerprint: (...a: any[]) => (getCurrentContextFingerprint as any)(...a), getDiceConfig: (...a: any[]) => (getDiceConfig as any)(...a), getFullAttributesForCharacter: (...a: any[]) => (getFullAttributesForCharacter as any)(...a), getTableData: (...a: any[]) => (getTableData as any)(...a), getTavernHostDocument: (...a: any[]) => (getTavernHostDocument as any)(...a), getTavernHostWindow: (...a: any[]) => (getTavernHostWindow as any)(...a), init: (...a: any[]) => (init as any)(...a), isSameAttributeAlias: (...a: any[]) => (isSameAttributeAlias as any)(...a), performSaveDataOnly: (...a: any[]) => (performSaveDataOnly as any)(...a), runInSaveQueue: (...a: any[]) => (runInSaveQueue as any)(...a), scheduleViewportBoundsRefresh: (...a: any[]) => (scheduleViewportBoundsRefresh as any)(...a), updateSingleAttribute: (...a: any[]) => (updateSingleAttribute as any)(...a) });
  // [x4-s-pre] 与既有接线存在前向依赖的定义（保留在 index，不随 x4-s 迁出）
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
  // 默认骰子配置（COC规则）
  const getDiceConfig = createGetDiceConfig({
  });
  // [x4-s] 表格图标与工具装配已迁出：见 ./wiring/table-icon-tools-wiring.ts
  // [x4-r] 渲染预设/头像身份/对话缩进装配已迁出：见 ./wiring/avatar-identity-wiring.ts
  const { AvatarManager, DiceHistoryStatsDB, NameAliasRegistry, PresetManager, RegexPresetManager, RegexTransformationEngine, RegexTransformationManager, RenderPresetManager, USER_NODE_KEY, USER_PLACEHOLDER_KEYS, ValidationEngine, ValidationRuleManager, avatarHexToHsl, characterNamesMatch, clampAvatarNumber, cloneRenderPresetRules, createRenderPresetEditorTemplate, dialogueIndentRenderer, getAvatarFallbackColor, getDiceStatsContext, getDisplayPlayerName, getPersonaName, getPlayerName, hslToAvatarHex, inferAvatarImageColor, isUserCharacterName, isUserPlaceholderKey, normalizeAvatarHexColor, parseRenderPresetJson, renderDiceHistoryStatsHtml, replaceUserPlaceholders, resolveCanonicalCharacterName, h_ACC: _h_ACC } = createAvatarIdentityWiring({ DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS, LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS, RENDER_DEFAULT_PRESET_ID, RENDER_LEGACY_BLACKLIST_PRESET_ID, RENDER_PRESET_FORMAT, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, compareVersion, escapeHtml, filterDeprecatedBuiltinRegexRules, getConfig: (...a: any[]) => (getConfig as any)(...a), getDiceConfig: (...a: any[]) => (getDiceConfig as any)(...a), getJsonLikeErrorMessage: (...a: any[]) => (getJsonLikeErrorMessage as any)(...a), getTableData: (...a: any[]) => (getTableData as any)(...a), getTavernHostDocument: (...a: any[]) => (getTavernHostDocument as any)(...a), isRecordValue: (...a: any[]) => (isRecordValue as any)(...a), isSameKeywordSet, normalizeStorableImageUrl, parseJsoncRecord: (...a: any[]) => (parseJsoncRecord as any)(...a), processJsonData: (...a: any[]) => (processJsonData as any)(...a) });
  const { ADVANCED_PRESET_AGENT_FORMAT, ADVANCED_PRESET_EXPORT_FORMAT, AttributePresetManager, MvuModule, convertTavernRegexToRule, createCustomTableNameIconContext, createGlobalInteractionCustomTableNameIconContext, findAttributeColumnIndices, findCharacterAttributeRow, findPrimaryAttributeColumns, getElementEmoji, getGachaItemCustomTableNameIconContext, getLocationEmoji, hideDiceResultsInUserMessages, hydrateCustomTableNameIconsIn, isAttributeQuickSelectTarget, isNpcLikeTableName, isPlayerTableName, normalizeAttributeQuickSelectConfig, pickFallbackAttributeColumn, refreshDialogueIndentRender, renderCustomTableNameIconContent, renderGachaItemIconContent, renderIcon, renderThemeIconContent, resolveBatchLocationEmojis, resolveUserGraphName, saveDiceConfig, scheduleDialogueIndentRender } = createTableIconToolsWiring({ AvatarManager, DICE_RESULT_PLACEHOLDER, NameAliasRegistry, RenderPresetManager, USER_NODE_KEY, USER_PLACEHOLDER_KEYS, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, canWriteMvuPanel: (...a: any[]) => (canWriteMvuPanel as any)(...a), characterNamesMatch, clearTextareaDiceCache, compareVersion, createMetaCheckResultRegex, dialogueIndentRenderer, escapeHtml, getActiveTabState: (...a: any[]) => (getActiveTabState as any)(...a), getConfig: (...a: any[]) => (getConfig as any)(...a), getDiceConfig: (...a: any[]) => (getDiceConfig as any)(...a), getGachaRewardParseResult: (...a: any[]) => (getGachaRewardParseResult as any)(...a), getGachaRewardTargetOptions: (...a: any[]) => (getGachaRewardTargetOptions as any)(...a), getGachaRewardTargetTableLabel: (...a: any[]) => (getGachaRewardTargetTableLabel as any)(...a), getPanelDragStartHeight: (...a: any[]) => (getPanelDragStartHeight as any)(...a), getPersonaName, getPlayerName, getTableData: (...a: any[]) => (getTableData as any)(...a), getTableHeights: (...a: any[]) => (getTableHeights as any)(...a), getTutorialButtonHtml: (...a: any[]) => (getTutorialButtonHtml as any)(...a), isCustomTableNameIconImageUrlValid: (...a: any[]) => (isCustomTableNameIconImageUrlValid as any)(...a), isNumericCell: (...a: any[]) => (isNumericCell as any)(...a), isRenderableImageUrlValid, isUserCharacterName, isUserPlaceholderKey, normalizeGachaTargetTable: (...a: any[]) => (normalizeGachaTargetTable as any)(...a), parseJsoncRecord: (...a: any[]) => (parseJsoncRecord as any)(...a), readTextareaVisibleValue, renderInterface: (...a: any[]) => (renderInterface as any)(...a), resetPanelRequestedHeight: (...a: any[]) => (resetPanelRequestedHeight as any)(...a), resolveCustomTableNameIcon: (...a: any[]) => (resolveCustomTableNameIcon as any)(...a), resolveDashboardCustomTableNameIconContextInfo: (...a: any[]) => (resolveDashboardCustomTableNameIconContextInfo as any)(...a), resolveGlobalInteractionSectionMeta: (...a: any[]) => (resolveGlobalInteractionSectionMeta as any)(...a), saveActiveTabState: (...a: any[]) => (saveActiveTabState as any)(...a), savePanelRequestedHeight: (...a: any[]) => (savePanelRequestedHeight as any)(...a), saveTableHeights: (...a: any[]) => (saveTableHeights as any)(...a), setPanelRequestedHeight: (...a: any[]) => (setPanelRequestedHeight as any)(...a), setTextareaValueAndNotify, setupOverlayClose, showDicePanel: (...a: any[]) => (showDicePanel as any)(...a), storeTextareaDiceCache, syncTextareaDiceCacheFromVisibleText, updateTemplateForActivePreset: (...a: any[]) => (updateTemplateForActivePreset as any)(...a) });
  // [x4-d] 高级预设/属性预设装配已迁出：见 ./wiring/advanced-preset-wiring.ts
  const { AdvancedDicePresetManager, BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS, TableTemplateRequirementPresetManager, applyAdvancedPresetOutcomePolicy, buildActionPresetAgentPrompt, buildDashboardPresetAgentPrompt, buildGachaCatalogAgentPrompt, buildNewTableTemplateRequirementPresetJsoncTemplate, buildRenderPresetAgentPrompt, buildTableTemplateRequirementPresetAgentPrompt, getAdvancedPresetDisplayOutcome, getAdvancedPresetErrorMessage, getCheckSuggestionPresetById, getTableTemplateRequirementPresetStats, parseAdvancedPresetText, parseTableTemplateRequirementPresetJson, updateTemplateForActivePreset } = createAdvancedPresetWiring({ ADVANCED_PRESET_AGENT_FORMAT, ADVANCED_PRESET_EXPORT_FORMAT, AttributePresetManager, compareVersion, evaluateCondition: (...a: any[]) => (evaluateCondition as any)(...a), evaluateOutcomes: (...a: any[]) => (evaluateOutcomes as any)(...a), generateRPGAttributes: (...a: any[]) => (generateRPGAttributes as any)(...a), getCore: (...a: any[]) => (getCore as any)(...a), getDiceConfigBackupPresetRecordId: (...a: any[]) => (getDiceConfigBackupPresetRecordId as any)(...a), isDiceConfigBackupRecord: (...a: any[]) => (isDiceConfigBackupRecord as any)(...a), parseJsoncRecord: (...a: any[]) => (parseJsoncRecord as any)(...a), parseJsoncValue: (...a: any[]) => (parseJsoncValue as any)(...a) });
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
  // [x4-t] 动作预设与运算引擎装配已迁出：见 ./wiring/action-engine-wiring.ts
  const { ActionPresetManager, DASHBOARD_DEFAULT_PRESET_ID, DASHBOARD_PRESET_ADDITIONAL_COLUMNS, DASHBOARD_PRESET_FILTER_KEYS, DASHBOARD_PRESET_FORMAT, DASHBOARD_PRESET_MODULE_KEYS, DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY, DEFAULT_CONTEST_OUTPUT_TEMPLATE, DEFAULT_OUTPUT_TEMPLATE, JSONC_FILE_ACCEPT, JSONC_FILE_MIME, JSON_FILE_MIME, MARKDOWN_FILE_MIME, cloneDashboardConfig, cloneDashboardPresetModules, createBuiltinDashboardPreset, evaluateCondition, evaluateConditionNumber, evaluateFormula, evaluateOutcomes, formatOutputTemplate, generateAttributeValue, generateCrazyRoll, getCrazyModeConfig, isComplexCondition, isRecordValue, normalizeDashboardKeywordArray, normalizeDashboardPresetFilters, normalizeDashboardRelationshipGraphConfig, saveCrazyModeConfig, shouldTriggerCrazyMode, stripJsonComments, dashboardRuntimeConfigCache_ACC } = createActionEngineWiring({ AdvancedDicePresetManager, AttributePresetManager, DashboardDataParser: { get v(){ return DashboardDataParser; } }, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, getDisplayPlayerName, getFullAttributesForCharacter: (...a: any[]) => (getFullAttributesForCharacter as any)(...a), getRandomSkillPool: (...a: any[]) => (getRandomSkillPool as any)(...a), getTableData: (...a: any[]) => (getTableData as any)(...a), parseJsoncRecord: (...a: any[]) => (parseJsoncRecord as any)(...a), processJsonData: (...a: any[]) => (processJsonData as any)(...a) });
  // [x4-k] 核心运行时/工具装配已迁出：见 ./wiring/core-runtime-wiring.ts
  const { ACTION_BUTTONS, DashboardDataParser, DashboardPresetManager, FONTS, THEMES, UpdateController, buildGlobalInteractionGroups, clearModalStack, collectHostAndLocalNodes, createAutoRegexTransformKey, createDashboardPresetEditorTemplate, createElementFromHtml, createGlobalInteractionSections, debugGlobalInteraction, dedupeInteractionActions, downloadAiPromptFile, downloadJsonFile, downloadJsoncFile, executeTableInteractionAction, extractNumericValue, getActiveDashboardRelationshipGraphSources, getCore, getCurrentContextFingerprint, getDashboardModuleConfig, getDatabaseManualUpdateErrorMessage, getIconForTableName, getInteractOptionsForRow, getJsonLikeErrorMessage, getNavigationFontMetrics, getPendingDeletions, getResultBadgeClass, getTavernHostDocument, getTavernHostWindow, isCustomTableNameIconImageUrlValid, isNumericCell, isRecord, isTwoDimensionalArray, normalizeCollapseStyle, normalizeInteractionLabel, openDatabaseInterface, openDatabaseVisualizerInterface, parseAttributeString, parseDashboardPresetJson, parseJsoncDocument, parseJsoncRecord, parseJsoncValue, parseRelationshipString, pickTextFile, popModal, pushModal, readTextFile, rememberAutoRegexTransform, resolveCustomTableNameIcon, resolveDashboardCustomTableNameIconContextInfo, resolveGlobalInteractionSectionMeta, runDatabaseManualUpdate, shouldSkipAutoRegexTransform, showCustomTableNameIconManager, showDatabaseManualUpdateFailure, showDiceSystemConfirmDialog, showDiceSystemInputDialog, updateSaveButtonState, validateJsoncEditorConfig, _boundRenderHandler_ACC, _boundReviewBaselineHandler_ACC, cachedRawData_ACC, currentDiffMap_ACC, hasUnsavedChanges_ACC, isAutoTransforming_ACC, isEditingOrder_ACC, isInitialized_ACC, isSaving_ACC, isSettingsOpen_ACC, lastOptionHash_ACC, observer_ACC, optionPanelVisible_ACC, saveQueue_ACC, tablePageStates_ACC, tableScrollStates_ACC, tableSearchStates_ACC } = createCoreRuntimeWiring({ ActionPresetManager, DASHBOARD_DEFAULT_PRESET_ID, DASHBOARD_PRESET_ADDITIONAL_COLUMNS, DASHBOARD_PRESET_FILTER_KEYS, DASHBOARD_PRESET_FORMAT, DASHBOARD_PRESET_MODULE_KEYS, DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY, JSONC_FILE_ACCEPT, JSONC_FILE_MIME, JSON_FILE_MIME, MARKDOWN_FILE_MIME, ValidationEngine, ValidationRuleManager, bindEvents: (...a: any[]) => (bindEvents as any)(...a), bindGlobalInteractionEvents: (...a: any[]) => (bindGlobalInteractionEvents as any)(...a), bindTutorialButtonsIn: (...a: any[]) => (bindTutorialButtonsIn as any)(...a), cloneDashboardConfig, cloneDashboardPresetModules, createBuiltinDashboardPreset, escapeHtml, formatCssImageUrl, getConfig: (...a: any[]) => (getConfig as any)(...a), getRemoteImageUrlValidationError, getTableData: (...a: any[]) => (getTableData as any)(...a), getTutorialButtonHtml: (...a: any[]) => (getTutorialButtonHtml as any)(...a), hydrateCustomTableNameIconsIn, isNpcLikeTableName, isPlayerTableName, isRecordValue, loadDashboardNpcAvatars: (...a: any[]) => (loadDashboardNpcAvatars as any)(...a), loadSnapshot: (...a: any[]) => (loadSnapshot as any)(...a), normalizeDashboardKeywordArray, normalizeDashboardPresetFilters, normalizeDashboardRelationshipGraphConfig, processJsonData: (...a: any[]) => (processJsonData as any)(...a), refreshChangesPanel: (...a: any[]) => (refreshChangesPanel as any)(...a), renderDashboard: (...a: any[]) => (renderDashboard as any)(...a), renderGlobalInteractionsPanel: (...a: any[]) => (renderGlobalInteractionsPanel as any)(...a), renderInterface: (...a: any[]) => (renderInterface as any)(...a), setupOverlayClose, showDicePanel: (...a: any[]) => (showDicePanel as any)(...a), smartInsertToTextarea, stripJsonComments, dashboardRuntimeConfigCache_ACC: { get v(){ return dashboardRuntimeConfigCache_ACC.v; }, set v(x){ dashboardRuntimeConfigCache_ACC.v = x; } } });
  // [x4-m] 表格状态/渲染工具装配已迁出：见 ./wiring/table-state-wiring.ts
  const { addClearButton, applyStoredPanelHeight, areAllTablesReversed, buildCheckValueText, canWriteMvuPanel, cleanupGlobalInteractionFloatingMenus, clearAllPanelStates, clearGlobalInteractionOutsideCapture, clearPresetAttributesForCharacter, ensureCanonicalTableOrder, generateRPGAttributes, getActivePanelHeightKey, getActiveTabState, getAttributeEntryForCharacter, getAttributeValue, getAttributesForCharacter, getBadgeStyle, getCheckSuggestionItemsFromTable, getCollapsedState, getDiceQuickSelectCharacterList, getFullAttributesForCharacter, getHiddenTables, getNamedCheckParamText, getOptionItemsFromTable, getOptionsCollapsedState, getPanelDragStartHeight, getRandomSkillPool, getSavedTableOrder, getStableTableSort, getStoredPanelHeight, getTableHeights, getTableStyles, initCustomDropdown, isCheckSuggestionTableName, isOptionTableName, isSameAttributeAlias, isTableReversed, loadSnapshot, maybeRefreshReviewBaselineAtFillStart, renderCheckSuggestionOptionButtonHtml, renderDataCardCellContent, renderOptionButtonHtml, resetPanelRequestedHeight, resolveQuickSelectTarget, saveActiveTabState, saveCollapsedState, saveCurrentDatabaseSnapshotAsReviewBaseline, saveHiddenTables, saveOptionsCollapsedState, savePanelRequestedHeight, saveSnapshot, saveTableHeights, saveTableOrder, saveTableStyles, setAllTablesReverse, setPanelRequestedHeight, shouldShowReverseButton, showDicePanel, toggleTableReverse, updateSingleAttribute, writeAttributesToCharacter, cleanupGlobalInteractionOutsideCapture_ACC } = createTableStateWiring({ AdvancedDicePresetManager, AttributePresetManager, DEFAULT_OUTPUT_TEMPLATE, DashboardDataParser, DiceHistoryStatsDB, MAX_HISTORY: (...a: any[]) => (MAX_HISTORY as any)(...a), MAX_PANEL_HEIGHT, MIN_PANEL_HEIGHT, MvuModule, PANEL_VIEWPORT_TOP_GUTTER, RenderPresetManager, UpdateController, applyAdvancedPresetOutcomePolicy, bindTutorialButtonsIn: (...a: any[]) => (bindTutorialButtonsIn as any)(...a), cachedRawData_ACC, characterNamesMatch, checkHistory: (...a: any[]) => (checkHistory as any)(...a), contestHistory: (...a: any[]) => (contestHistory as any)(...a), countRuntimeDataChanges: (...a: any[]) => (countRuntimeDataChanges as any)(...a), emitEvent: (...a: any[]) => (emitEvent as any)(...a), errorTableTemplateIssue, escapeHtml, evaluateCondition, evaluateConditionNumber, evaluateFormula, evaluateOutcomes, executeEffects, executeSecondaryEffectsChain, extractNumericValue, findAttributeColumnIndices, findCharacterAttributeRow, findPrimaryAttributeColumns, formatOutputTemplate, generateAttributeValue, getAdvancedPresetDisplayOutcome, getConfig: (...a: any[]) => (getConfig as any)(...a), getCore, getCurrentContextFingerprint, getDashboardModuleConfig, getDashboardNpcListData: (...a: any[]) => (getDashboardNpcListData as any)(...a), getDiceConfig, getResultBadgeClass, getTableData: (...a: any[]) => (getTableData as any)(...a), getTavernHostDocument, getTavernHostWindow, getTutorialButtonHtml: (...a: any[]) => (getTutorialButtonHtml as any)(...a), hasSheetKeys: (...a: any[]) => (hasSheetKeys as any)(...a), hideDiceResultsInUserMessages, isAttributeQuickSelectTarget, isComplexCondition, isNumericCell, normalizeAttributeQuickSelectConfig, parseAttributeString, parseRelationshipString, pickFallbackAttributeColumn, processJsonData: (...a: any[]) => (processJsonData as any)(...a), renderDiceHistoryStatsHtml, replaceUserPlaceholders, resolveCanonicalCharacterName, safeEncodeURIComponent, saveDiceConfig, saveRowInstantly: (...a: any[]) => (saveRowInstantly as any)(...a), setTextareaValueAndNotify, setupOverlayClose, showAdvancedPresetManager: (...a: any[]) => (showAdvancedPresetManager as any)(...a), showContestPanel: (...a: any[]) => (showContestPanel as any)(...a), showDiceSystemConfirmDialog, showGlobalDiceHistoryDialog: (...a: any[]) => (showGlobalDiceHistoryDialog as any)(...a), smartInsertToTextarea, withTableTemplateCheckHint });
  // [x4-ae] 对抗检定面板与成功等级装配已迁出：见 ./wiring/contest-panel-wiring.ts
  const { getSuccessLevel, showContestPanel } = createContestPanelWiring({ AdvancedDicePresetManager, DEFAULT_CONTEST_OUTPUT_TEMPLATE, MAX_HISTORY: { get v(){ return MAX_HISTORY; } }, NameAliasRegistry, UpdateController, addClearButton, applyAdvancedPresetOutcomePolicy, bindTutorialButtonsIn: (...a: any[]) => (bindTutorialButtonsIn as any)(...a), buildCheckValueText, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, clearPresetAttributesForCharacter, contestHistory: { get v(){ return contestHistory; } }, emitEvent: (...a: any[]) => (emitEvent as any)(...a), escapeHtml, evaluateCondition, evaluateConditionNumber, evaluateFormula, evaluateOutcomes, formatOutputTemplate, generateRPGAttributes, getAdvancedPresetDisplayOutcome, getAttributeEntryForCharacter, getAttributesForCharacter, getConfig: (...a: any[]) => (getConfig as any)(...a), getCore, getDiceConfig, getDiceQuickSelectCharacterList, getFullAttributesForCharacter, getRandomSkillPool, getResultBadgeClass, getTableData: (...a: any[]) => (getTableData as any)(...a), getTutorialButtonHtml: (...a: any[]) => (getTutorialButtonHtml as any)(...a), initCustomDropdown, processJsonData: (...a: any[]) => (processJsonData as any)(...a), replaceUserPlaceholders, resolveCanonicalCharacterName, resolveQuickSelectTarget, saveDiceConfig, showAdvancedPresetManager: (...a: any[]) => (showAdvancedPresetManager as any)(...a), showDicePanel, showGlobalDiceHistoryDialog: (...a: any[]) => (showGlobalDiceHistoryDialog as any)(...a), smartInsertToTextarea, writeAttributesToCharacter });
  // [x4-n] 地图/关系图/头像/配置装配已迁出：见 ./wiring/visualization-wiring.ts
  const { DICE_CONFIG_BACKUP_FORMAT, DICE_CONFIG_BACKUP_SCHEMA_VERSION, DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY, DICE_PROFILE_INDEX_STORAGE_KEY, DICE_PROFILE_LAST_APPLIED_STORAGE_KEY, DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT, DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY, buildRelationshipGraphTableFromPreset, clearDiceLocalCacheData, collectCurrentChatAvatarNodes, getConfig, getCurrentChatAvatarNodes, getDashboardNpcListData, saveConfig, showAvatarManager, showCardEditModal, showManualUpdateDialog, showMapVisualization, showRelationshipGraph, _configCache_ACC } = createVisualizationWiring({ AvatarManager, DashboardDataParser, DiceHistoryStatsDB, NameAliasRegistry, USER_NODE_KEY, applyConfigStyles: (...a: any[]) => (applyConfigStyles as any)(...a), avatarHexToHsl, bindTutorialButtonsIn: (...a: any[]) => (bindTutorialButtonsIn as any)(...a), buildAvatarBackgroundStyle, cachedRawData_ACC, characterNamesMatch, clampAvatarNumber, createGlobalInteractionCustomTableNameIconContext, escapeHtml, formatCssImageUrl, getActiveDashboardRelationshipGraphSources, getAvatarFallbackColor, getCore, getDashboardModuleConfig, getDiceConfig, getElementEmoji, getImageUrlValidationMessage, getPlayerName, getRemoteImageUrlValidationError, getTableData: (...a: any[]) => (getTableData as any)(...a), getTutorialButtonHtml: (...a: any[]) => (getTutorialButtonHtml as any)(...a), hslToAvatarHex, hydrateCustomTableNameIconsIn, inferAvatarImageColor, loadSnapshot, normalizeAvatarHexColor, normalizeCollapseStyle, parseRelationshipString, processJsonData: (...a: any[]) => (processJsonData as any)(...a), refreshDialogueIndentRender, renderCustomTableNameIconContent, renderInterface: (...a: any[]) => (renderInterface as any)(...a), replaceUserPlaceholders, resolveBatchLocationEmojis, resolveUserGraphName, saveDiceConfig, saveRowInstantly: (...a: any[]) => (saveRowInstantly as any)(...a), setupOverlayClose, warnTableTemplateIssue, withTableTemplateCheckHint });
  // [x4-f] 配置备份核心装配已迁出：见 ./wiring/dice-config-backup-core-wiring.ts
  const { DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY, DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY, DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY, applyDiceConfigBackupActiveValue, applyDiceConfigBackupValue, buildDiceConfigBackup, buildDiceConfigBackupTableOrder, cloneDiceConfigBackupValue, collectDiceConfigBackupGachaCatalogRollbackSnapshot, getDiceConfigBackupModuleDefinition, getDiceConfigBackupModuleResourceCount, getDiceConfigBackupPresetRecordId, getDiceConfigBackupRecordString, getDiceConfigBackupTableTemplateApi, getDiceConfigBackupWarningCount, hasDiceConfigBackupRecoverableStorage, hasDiceConfigBackupTableTemplateResource, isDiceConfigBackupRecord, normalizeDiceConfigBackupGachaItemSettings, normalizeDiceConfigBackupSelectedModuleIds, parseDiceConfigBackup, remapDiceConfigBackupGachaItemSettings, showDiceConfigBackupPrivacyConfirm } = createDiceConfigBackupCoreWiring({ CUSTOM_ROLL_MODE, DASHBOARD_DEFAULT_PRESET_ID, DEPRECATED_BUILTIN_REGEX_RULE_IDS, DICE_CONFIG_BACKUP_FORMAT, DICE_CONFIG_BACKUP_SCHEMA_VERSION, PresetManager, RENDER_DEFAULT_PRESET_ID, RegexPresetManager, buildDefaultGachaPoolDefinition: (...a: any[]) => (buildDefaultGachaPoolDefinition as any)(...a), cloneGachaCatalogItems: (...a: any[]) => (cloneGachaCatalogItems as any)(...a), getConfig, getCore, getCrazyModeConfig, getDiceConfig, getRuntimeGachaRawData: (...a: any[]) => (getRuntimeGachaRawData as any)(...a), isBuiltinGachaPoolId: (...a: any[]) => (isBuiltinGachaPoolId as any)(...a), migrateGachaCatalogRecordsToGlobalScope: (...a: any[]) => (migrateGachaCatalogRecordsToGlobalScope as any)(...a), normalizeDiceConfigBackupGachaCatalogResourceRecord: (...a: any[]) => (normalizeDiceConfigBackupGachaCatalogResourceRecord as any)(...a), normalizeGachaCatalogRecord: (...a: any[]) => (normalizeGachaCatalogRecord as any)(...a), normalizeGachaItemEnabled: (...a: any[]) => (normalizeGachaItemEnabled as any)(...a), normalizeGachaItemOrder: (...a: any[]) => (normalizeGachaItemOrder as any)(...a), normalizeGachaPoolDefinition: (...a: any[]) => (normalizeGachaPoolDefinition as any)(...a), parseJsoncDocument, showDiceSystemConfirmDialog, TableTemplateRequirementPresetManager, BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS });
  // [x4-y] 配置备份恢复链装配已迁出：见 ./wiring/dice-config-backup-restore-wiring.ts
  const { getDiceConfigBackupTableTemplateRollbackSnapshot, normalizeDiceConfigBackupGachaCatalogResourceRecord, restoreDiceConfigBackupGachaCatalogSnapshot, restoreDiceConfigBackupModuleResources, restoreDiceConfigBackupTableTemplateRollbackSnapshot, syncDiceConfigBackupRuntimeAfterRestore } = createDiceConfigBackupRestoreWiring({ ActionPresetManager, AdvancedDicePresetManager, AttributePresetManager, AvatarManager, DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY, DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY, DashboardPresetManager, GACHA_CATALOG_GLOBAL_SCOPE_KEY, PresetManager, RegexPresetManager, RegexTransformationManager, RenderPresetManager, TableTemplateRequirementPresetManager, ValidationRuleManager, _configCache_ACC: { get v(){ return _configCache_ACC.v; }, set v(x){ _configCache_ACC.v = x; } }, applyConfigStyles: (...a: any[]) => (applyConfigStyles as any)(...a), cloneDiceConfigBackupValue, cloneGachaCatalogItems: (...a: any[]) => (cloneGachaCatalogItems as any)(...a), createEmptyGachaCatalog: (...a: any[]) => (createEmptyGachaCatalog as any)(...a), dashboardRuntimeConfigCache_ACC: { get v(){ return dashboardRuntimeConfigCache_ACC.v; }, set v(x){ dashboardRuntimeConfigCache_ACC.v = x; } }, ensureGachaPoolsForTags: (...a: any[]) => (ensureGachaPoolsForTags as any)(...a), gachaCatalogCache_ACC: { get v(){ return gachaCatalogCache_ACC.v; }, set v(x){ gachaCatalogCache_ACC.v = x; } }, gachaCatalogLoadTask_ACC: { get v(){ return gachaCatalogLoadTask_ACC.v; }, set v(x){ gachaCatalogLoadTask_ACC.v = x; } }, getConfig, getCore, getDiceConfigBackupTableTemplateApi, getRuntimeGachaRawData: (...a: any[]) => (getRuntimeGachaRawData as any)(...a), isDiceConfigBackupRecord, isGachaItemEnabled: (...a: any[]) => (isGachaItemEnabled as any)(...a), isSettingsOpen_ACC: { get v(){ return isSettingsOpen_ACC.v; }, set v(x){ isSettingsOpen_ACC.v = x; } }, mergeGachaCatalogRecordsToGlobalScope: (...a: any[]) => (mergeGachaCatalogRecordsToGlobalScope as any)(...a), migrateGachaCatalogRecordsToGlobalScope: (...a: any[]) => (migrateGachaCatalogRecordsToGlobalScope as any)(...a), normalizeGachaCatalogRecord: (...a: any[]) => (normalizeGachaCatalogRecord as any)(...a), normalizeImportedGachaItem: (...a: any[]) => (normalizeImportedGachaItem as any)(...a), refreshDicePanelPresets: (...a: any[]) => (refreshDicePanelPresets as any)(...a), refreshGachaShardShop: (...a: any[]) => (refreshGachaShardShop as any)(...a), refreshGachaVisualization: (...a: any[]) => (refreshGachaVisualization as any)(...a), renderInterface: (...a: any[]) => (renderInterface as any)(...a), showGachaSettingsDialog: (...a: any[]) => (showGachaSettingsDialog as any)(...a), validateGachaCatalogImportItemTarget: (...a: any[]) => (validateGachaCatalogImportItemTarget as any)(...a) });
  // [x4-af] 配置备份应用装配已迁出：见 ./wiring/dice-config-backup-apply-wiring.ts
  const { applyDiceConfigBackup } = createDiceConfigBackupApplyWiring({ DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY, DICE_CONFIG_BACKUP_FORMAT, DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY, DICE_CONFIG_BACKUP_SCHEMA_VERSION, applyDiceConfigBackupActiveValue, applyDiceConfigBackupValue, buildDiceConfigBackupTableOrder, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, collectDiceConfigBackupGachaCatalogRollbackSnapshot, getDiceConfigBackupModuleDefinition, getDiceConfigBackupTableTemplateRollbackSnapshot, getRuntimeGachaRawData: (...a: any[]) => (getRuntimeGachaRawData as any)(...a), getTableData: (...a: any[]) => (getTableData as any)(...a), hasDiceConfigBackupTableTemplateResource, normalizeDiceConfigBackupGachaItemSettings, normalizeDiceConfigBackupSelectedModuleIds, remapDiceConfigBackupGachaItemSettings, restoreDiceConfigBackupGachaCatalogSnapshot, restoreDiceConfigBackupModuleResources, restoreDiceConfigBackupTableTemplateRollbackSnapshot, saveTableOrder, syncDiceConfigBackupRuntimeAfterRestore });
  // [x4-e] 骰子配置备份/角色档案装配已迁出：见 ./wiring/dice-profile-backup-wiring.ts
  const { applyDiceProfile, createDiceProfileRuntimeId, deleteDiceProfileRecord, detectCharacterDiceProfile, downloadDiceConfigBackupJson, downloadDiceProfileJson, downloadDiceProfileTavernRegex, exportDiceProfile, getAllDiceConfigBackupModuleIds, getDiceConfigBackupSelectedModuleIdsFromDialog, getDiceProfileCharacterContext, getDiceProfilePromptState, importDiceProfile, normalizeDiceProfileRecord, refreshDiceProfileIndex, renderDiceConfigBackupModuleRows, saveCurrentDiceProfile, saveDiceProfileRecord, scheduleCharacterDiceProfileDetection, toDiceProfileSummary } = createDiceProfileBackupWiring({ DICE_PROFILE_INDEX_STORAGE_KEY, DICE_PROFILE_LAST_APPLIED_STORAGE_KEY, DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT, DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY, applyDiceConfigBackup, buildDiceConfigBackup, cloneDiceConfigBackupValue, downloadJsonFile, getConfig, getCore, getDiceConfigBackupModuleDefinition, getDiceConfigBackupModuleResourceCount, getDiceConfigBackupRecordString, getDiceStatsContext, hasDiceConfigBackupRecoverableStorage, hasDiceConfigBackupTableTemplateResource, isDiceConfigBackupRecord, normalizeDiceConfigBackupSelectedModuleIds, parseDiceConfigBackup, parseJsoncDocument, renderDeprecatedBadge, setupOverlayClose, showDiceSystemConfirmDialog, escapeHtml });
  // [x4-aa] 骰子档案面板装配已迁出：见 ./wiring/dice-profile-panel-wiring.ts
  const { showDiceConfigBackupDialog } = createDiceProfilePanelWiring({ DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY, DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT, applyDiceProfile, bindTutorialButtonsIn: (...a: any[]) => (bindTutorialButtonsIn as any)(...a), buildDiceConfigBackup, createDiceProfileRuntimeId, deleteDiceProfileRecord, detectCharacterDiceProfile, downloadDiceConfigBackupJson, downloadDiceProfileJson, downloadDiceProfileTavernRegex, escapeHtml, exportDiceProfile, getAllDiceConfigBackupModuleIds, getConfig, getCore, getDiceConfigBackupSelectedModuleIdsFromDialog, getDiceConfigBackupWarningCount, getTutorialButtonHtml: (...a: any[]) => (getTutorialButtonHtml as any)(...a), importDiceProfile, normalizeDiceProfileRecord, pickTextFile, refreshDiceProfileIndex, renderDiceConfigBackupModuleRows, saveCurrentDiceProfile, saveDiceProfileRecord, setupOverlayClose, showDiceConfigBackupPrivacyConfirm, showDiceSystemConfirmDialog, showDiceSystemInputDialog, toDiceProfileSummary });
  // [x4-l] 运行时数据读写/保存装配已迁出：见 ./wiring/runtime-save-wiring.ts
  const { addCrudColumnAlias, addStyles, appendRowInstantly, applyConfigStyles, asDiffRecord, assertCrudEnumConstraints, assertCrudInsertRequiredCells, assertCrudLengthConstraints, assertCrudRequiredColumnsRepresented, bindTutorialButtonsIn, buildCrudEnumConstraintMap, buildCrudRequiredHeaderSet, cloneRuntimeDataValue, countRuntimeDataChanges, createDiffRowMatcher, deleteRowInstantly, findDiffSnapshotEntry, findRuntimeSheetEntryForMutation, generateDiffMap, getCrudColumnNameForHeader, getCrudSheetDdl, getCrudSqlCommentAliases, getCrudSqlTableName, getDbChatMessages, getDiffDataRow, getDiffRowDisplayTitle, getDiffSheetByKey, getDiffSheetIdentity, getRuntimeErrorMessage, getSheetHeaders, getTableData, getTutorialButtonHtml, getTutorialModule, hasRuntimeTableReadApi, hasSheetKeys, normalizeDiffRow, normalizeDiffText, parseCrudColumnDefinitionLine, performSaveDataOnly, processJsonData, refreshRegexRulesList, removeDiffDataRow, restoreMutableRuntimeValue, runInSaveQueue, saveDataOnly, saveDataToDatabase, saveRowInstantly, saveSheetsViaJsonFloorWithoutTracking, setDiffDataCell, setDiffDataRow, showAddValidationRuleModal, showSmartFixModal, startTutorialFromButton, stripCrudSqlNonStructuralComments, takeDiffRowMatch, tutorialButtonEventsBound_ACC } = createRuntimeSaveWiring({ FONTS, GACHA_CATALOG_RAW_ROW_INDEX_PROP, RegexTransformationManager, ValidationRuleManager, buildCrudColumnAliasMap: (...a: any[]) => (buildCrudColumnAliasMap as any)(...a), cachedRawData_ACC, collectHostAndLocalNodes, countUnicodeCharacters, currentDiffMap_ACC, errorTableTemplateIssue, escapeHtml, getConfig, getCore, getNavigationFontMetrics, getPendingDeletions, getTavernHostDocument, getTavernHostWindow, hasUnsavedChanges_ACC, isSaving_ACC, loadSnapshot, renderInterface: (...a: any[]) => (renderInterface as any)(...a), saveQueue_ACC, saveSnapshot, setupOverlayClose, showDiceSystemConfirmDialog, showTableRuleFixModal: (...a: any[]) => (showTableRuleFixModal as any)(...a), syncInventoryMetadataForRawData: (...a: any[]) => (syncInventoryMetadataForRawData as any)(...a) });
  // [x4-z] 属性预设面板与表格规则修复装配已迁出：见 ./wiring/attr-preset-panel-wiring.ts
  const { showAttributePresetManager, showTableRuleFixModal } = createAttrPresetPanelWiring({ AttributePresetManager, JSONC_FILE_ACCEPT, ValidationEngine, bindTutorialButtonsIn, deleteRowInstantly, downloadAiPromptFile, downloadJsonFile, escapeHtml, getConfig, getCore, getJsonLikeErrorMessage, getTutorialButtonHtml, normalizeAttributeQuickSelectConfig, parseJsoncRecord, popModal, pushModal, readTextFile, renderInterface: (...a: any[]) => (renderInterface as any)(...a), saveDataOnly, setupOverlayClose, showDiceSystemConfirmDialog, showPresetConflictDialog, validateJsoncEditorConfig, warnTableTemplateIssue });
  // [x4-o] 预设管理/AcuDice API装配已迁出：见 ./wiring/preset-api-wiring.ts
  const { MAX_HISTORY, acuDiceCharacters, acuDiceCheck, acuDiceContest, acuDiceEvents, acuDiceHistory, acuDicePresets, acuDiceProfiles, acuDiceReady, acuDiceRoll, buildGachaCatalogAgentPromptFilename, buildTableTemplateRequirementPresetAgentPromptFilename, checkHistory, contestHistory, createSortableList, defineAcuDiceOnWindow, dispatchReadyEvent, emitEvent, notifyReady, refreshDicePanelPresets, rootWindow, showActionPresetManager, showAddRegexRuleModal, showAdvancedPresetManager, showDashboardPresetManager, showDebugConsoleModal, showGlobalDiceHistoryDialog, showPresetListDialog, showRenderPresetManager } = createPresetApiWiring({ ActionPresetManager, AcuDiceAPI: { get v(){ return AcuDiceAPI; } }, AdvancedDicePresetManager, DASHBOARD_DEFAULT_PRESET_ID, DASHBOARD_PRESET_MODULE_KEYS, DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY, DashboardDataParser, DashboardPresetManager, DiceHistoryStatsDB, NameAliasRegistry, RENDER_DEFAULT_PRESET_ID, RegexTransformationEngine, RegexTransformationManager, RenderPresetManager, applyDiceProfile, bindTutorialButtonsIn, buildActionPresetAgentPrompt, buildAdvancedPresetAgentPrompt: (...a: any[]) => (buildAdvancedPresetAgentPrompt as any)(...a), buildDashboardPresetAgentPrompt, buildRenderPresetAgentPrompt, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, clearModalStack, cloneDashboardPresetModules, cloneRenderPresetRules, createDashboardPresetEditorTemplate, createRenderPresetEditorTemplate, detectCharacterDiceProfile, downloadAiPromptFile, downloadJsonFile, escapeHtml, evaluateFormula, exportDiceProfile, getAdvancedPresetErrorMessage, getAttributeValue, getConfig, getCore, getCrazyModeConfig, getDiceConfig, getDiceProfileCharacterContext, getDiceProfilePromptState, getFullAttributesForCharacter, getJsonLikeErrorMessage, getSuccessLevel, getTableData, getTutorialButtonHtml, hideDiceResultsInUserMessages, importDiceProfile, isRecordValue, normalizeCheckSuggestionDiceFormula: (...a: any[]) => (normalizeCheckSuggestionDiceFormula as any)(...a), parseAdvancedPresetText, parseDashboardPresetJson, parseJsoncRecord, parseJsoncValue, parseRenderPresetJson, pickTextFile, popModal, processJsonData, pushModal, readTextFile, refreshDialogueIndentRender, refreshDiceProfileIndex, refreshRegexRulesList, renderDiceHistoryStatsHtml, renderInterface: (...a: any[]) => (renderInterface as any)(...a), resolveCanonicalCharacterName, saveCrazyModeConfig, saveCurrentDiceProfile, saveDiceConfig, settleGachaFortuneForDiceEvent: (...a: any[]) => (settleGachaFortuneForDiceEvent as any)(...a), setupOverlayClose, showAttributePresetManager, showDiceSystemConfirmDialog, toDiceProfileSummary, validateJsoncEditorConfig });
  // [x4-g] 检查建议/设置弹窗装配已迁出：见 ./wiring/check-suggestion-wiring.ts
  const { AcuDiceAPI, executeCheckSuggestionCommand, getTemplateInspectionSheets: _getTemplateInspectionSheets, normalizeCheckSuggestionDiceFormula, showFavoriteEditModal, showSendToTableModal, showSettingsModal, showTagInputModal } = createCheckSuggestionWiring({ AdvancedDicePresetManager, DEFAULT_CONTEST_OUTPUT_TEMPLATE, DEFAULT_OUTPUT_TEMPLATE, FONTS, MAX_HISTORY, NameAliasRegistry, PresetManager, RegexPresetManager, RegexTransformationManager, THEMES, TableTemplateRequirementPresetManager, ValidationRuleManager, acuDiceCharacters, acuDiceCheck, acuDiceContest, acuDiceEvents, acuDiceHistory, acuDicePresets, acuDiceProfiles, acuDiceReady, acuDiceRoll, appendRowInstantly, applyAdvancedPresetOutcomePolicy, areAllTablesReversed, bindFavoritesEvents: (...a: any[]) => (bindFavoritesEvents as any)(...a), bindTutorialButtonsIn, buildCheckValueText, buildNewTableTemplateRequirementPresetJsoncTemplate, buildTableTemplateRequirementPresetAgentPrompt, buildTableTemplateRequirementPresetAgentPromptFilename, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, checkHistory, clearDiceLocalCacheData, clearModalStack, contestHistory, convertTavernRegexToRule, createSortableList, downloadAiPromptFile, downloadJsonFile, emitEvent, ensureCanonicalTableOrder, escapeHtml, evaluateCondition, evaluateConditionNumber, evaluateFormula, evaluateOutcomes, formatOutputTemplate, getAdvancedPresetDisplayOutcome, getAttributeEntryForCharacter, getAttributeValue, getCheckSuggestionPresetById, getConfig, getCore, getCurrentChatAvatarNodes, getHiddenTables, getIconForTableName, getJsonLikeErrorMessage, getNamedCheckParamText, getNavigationFontMetrics, getSavedTableOrder, getStableTableSort, getSuccessLevel, getTableData, getTableTemplateRequirementPresetStats, getTutorialButtonHtml, isRecordValue, isSettingsOpen_ACC: { get v(){ return isSettingsOpen_ACC.v; }, set v(x){ isSettingsOpen_ACC.v = x; } }, normalizeCollapseStyle, parseJsoncRecord, parseTableTemplateRequirementPresetJson, pickTextFile, popModal, processJsonData, pushModal, refreshDialogueIndentRender, refreshRegexRulesList, renderDeprecatedBadge, renderFavoritesPanel: (...a: any[]) => (renderFavoritesPanel as any)(...a), renderInterface: (...a: any[]) => (renderInterface as any)(...a), replaceUserPlaceholders, resolveCanonicalCharacterName, resolveQuickSelectTarget, saveConfig, saveHiddenTables, saveTableOrder, scheduleDialogueIndentRender, setAllTablesReverse, setupOverlayClose, showActionPresetManager, showAddRegexRuleModal, showAddValidationRuleModal, showAttributePresetManager, showAvatarManager, showCustomTableNameIconManager, showDashboardPresetManager, showDebugConsoleModal, showDiceConfigBackupDialog, showDiceSystemConfirmDialog, showDiceSystemInputDialog, showManualUpdateDialog, showPresetConflictDialog, showPresetListDialog, showRenderPresetManager, smartInsertToTextarea, validateJsoncEditorConfig });
  // [优化] 渲染防抖：避免短时间内多次渲染导致重复日志
  // [x4-p] 渲染防抖/视口监听/浮动折叠装配已迁出：见 ./wiring/render-interface-wiring.ts
  const { FLOATING_COLLAPSE_DRAG_THRESHOLD, clampFloatingCollapsePosition, isFloatingCollapseActive, renderInterface, scheduleFixedWrapperBoundsRefresh, scheduleViewportBoundsRefresh, suppressNextFloatingCollapseClick_ACC } = createRenderInterfaceWiring({ ACTION_BUTTONS, MvuModule, RegexTransformationEngine, RegexTransformationManager, ValidationEngine, applyStoredPanelHeight, bindChangesEvents: (...a: any[]) => (bindChangesEvents as any)(...a), bindEvents: (...a: any[]) => (bindEvents as any)(...a), bindGlobalInteractionEvents: (...a: any[]) => (bindGlobalInteractionEvents as any)(...a), bindOptionEvents: (...a: any[]) => (bindOptionEvents as any)(...a), cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, canWriteMvuPanel, collectHostAndLocalNodes, countRuntimeDataChanges, createAutoRegexTransformKey, createElementFromHtml, currentDiffMap_ACC: { get v(){ return currentDiffMap_ACC.v; }, set v(x){ currentDiffMap_ACC.v = x; } }, ensureCanonicalTableOrder, ensurePanelNavigationVisible: (...a: any[]) => (ensurePanelNavigationVisible as any)(...a), escapeHtml, generateDiffMap, getActivePanelHeightKey, getActiveTabState, getCheckSuggestionItemsFromTable, getCollapsedState, getConfig, getCore, getCurrentContextFingerprint, getDataAreaForRoot: (...a: any[]) => (getDataAreaForRoot as any)(...a), getDiceConfig, getHiddenTables, getIconForTableName, getNavigationFontMetrics, getOptionItemsFromTable, getOptionsCollapsedState, getSavedTableOrder, getStableTableSort, getStoredPanelHeight, getTableData, getTavernHostDocument, getTavernHostWindow, hasUnsavedChanges_ACC: { get v(){ return hasUnsavedChanges_ACC.v; }, set v(x){ hasUnsavedChanges_ACC.v = x; } }, hideDiceResultsInUserMessages, hydrateCustomTableNameIconsIn, injectIndependentOptions: (...a: any[]) => (injectIndependentOptions as any)(...a), insertHtmlToPage: (...a: any[]) => (insertHtmlToPage as any)(...a), isAutoTransforming_ACC: { get v(){ return isAutoTransforming_ACC.v; }, set v(x){ isAutoTransforming_ACC.v = x; } }, isCheckSuggestionTableName, isOptionTableName, isSaving_ACC: { get v(){ return isSaving_ACC.v; }, set v(x){ isSaving_ACC.v = x; } }, isSettingsOpen_ACC: { get v(){ return isSettingsOpen_ACC.v; }, set v(x){ isSettingsOpen_ACC.v = x; } }, lastOptionHash_ACC: { get v(){ return lastOptionHash_ACC.v; }, set v(x){ lastOptionHash_ACC.v = x; } }, loadDashboardNpcAvatars: (...a: any[]) => (loadDashboardNpcAvatars as any)(...a), loadSnapshot, normalizeCollapseStyle, observer_ACC: { get v(){ return observer_ACC.v; }, set v(x){ observer_ACC.v = x; } }, optionPanelVisible_ACC: { get v(){ return optionPanelVisible_ACC.v; }, set v(x){ optionPanelVisible_ACC.v = x; } }, processJsonData, rememberAutoRegexTransform, renderChangesPanel: (...a: any[]) => (renderChangesPanel as any)(...a), renderCheckSuggestionOptionButtonHtml, renderDashboard: (...a: any[]) => (renderDashboard as any)(...a), renderGlobalInteractionsPanel: (...a: any[]) => (renderGlobalInteractionsPanel as any)(...a), renderOptionButtonHtml, renderTableContent: (...a: any[]) => (renderTableContent as any)(...a), saveConfig, saveCurrentTabState: (...a: any[]) => (saveCurrentTabState as any)(...a), saveSheetsViaJsonFloorWithoutTracking, saveSnapshot, shouldSkipAutoRegexTransform, syncHostRegenerateButtonVisibility: (...a: any[]) => (syncHostRegenerateButtonVisibility as any)(...a), tableScrollStates_ACC: { get v(){ return tableScrollStates_ACC.v; }, set v(x){ tableScrollStates_ACC.v = x; } }, updateSaveButtonState });
  // [x4-w] 全局交互面板装配已迁出：见 ./wiring/global-interaction-wiring.ts
  const { bindGlobalInteractionEvents, bindOptionEvents, injectIndependentOptions, insertHtmlToPage, renderChangesPanel, renderGlobalInteractionsPanel } = createGlobalInteractionWiring({ AvatarManager, ValidationEngine, asDiffRecord, bindCompositionSafeSearchInput: (...a: any[]) => (bindCompositionSafeSearchInput as any)(...a), bindTutorialButtonsIn, buildAvatarBackgroundStyle, buildGlobalInteractionGroups, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, cleanupGlobalInteractionOutsideCapture_ACC: { get v(){ return cleanupGlobalInteractionOutsideCapture_ACC.v; }, set v(x){ cleanupGlobalInteractionOutsideCapture_ACC.v = x; } }, clearComposerIfCurrentText, clearGlobalInteractionOutsideCapture, closePanel: (...a: any[]) => (closePanel as any)(...a), createDiffRowMatcher, createElementFromHtml, createGlobalInteractionCustomTableNameIconContext, createGlobalInteractionSections, debugGlobalInteraction, dedupeInteractionActions, escapeHtml, executeCheckSuggestionCommand, executeTableInteractionAction, findDiffSnapshotEntry, formatCssImageUrl, getConfig, getCore, getDiffRowDisplayTitle, getDiffSheetIdentity, getElementEmoji, getIconForTableName, getInteractOptionsForRow, getLocationEmoji, getPanelDragStartHeight, getResolvedComposerText, getStableTableSort, getTableData, getTavernHostDocument, getTutorialButtonHtml, isRecord, isTwoDimensionalArray, loadSnapshot, normalizeDiffRow, normalizeInteractionLabel, renderCustomTableNameIconContent, renderDeprecatedBadge, renderIcon, renderThemeIconContent, replaceUserPlaceholders, resetPanelRequestedHeight, safeDecodeURIComponent, safeEncodeURIComponent, savePanelRequestedHeight, sendChatTextAndTrigger, setPanelRequestedHeight, showActionPresetManager, smartInsertToTextarea, startTutorialFromButton, takeDiffRowMatch });
  // [x4-ad] 变更面板事件绑定装配已迁出：见 ./wiring/bind-changes-events-wiring.ts
  const { bindChangesEvents } = createBindChangesEventsWiring({ appendRowInstantly, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, closePanel: (...a: any[]) => (closePanel as any)(...a), currentDiffMap_ACC: { get v(){ return currentDiffMap_ACC.v; }, set v(x){ currentDiffMap_ACC.v = x; } }, deleteRowInstantly, findDiffSnapshotEntry, getCore, getDiffDataRow, getDiffSheetByKey, getPanelDragStartHeight, getTableData, loadSnapshot, refreshChangesPanel: (...a: any[]) => (refreshChangesPanel as any)(...a), removeDiffDataRow, renderChangesPanel, renderInterface, resetPanelRequestedHeight, resolveExistingTableName: (...a: any[]) => (resolveExistingTableName as any)(...a), safeDecodeURIComponent, saveActiveTabState, saveDataToDatabase, savePanelRequestedHeight, saveRowInstantly, saveSnapshot, setActiveTableNavButton: (...a: any[]) => (setActiveTableNavButton as any)(...a), setDiffDataCell, setDiffDataRow, setPanelRequestedHeight, showChangeEditModal: (...a: any[]) => (showChangeEditModal as any)(...a), showChangeSingleFieldModal: (...a: any[]) => (showChangeSingleFieldModal as any)(...a), showRowCompareEditModal: (...a: any[]) => (showRowCompareEditModal as any)(...a), showSmartFixModal, updateChangesCount: (...a: any[]) => (updateChangesCount as any)(...a), warnMissingTableTarget: (...a: any[]) => (warnMissingTableTarget as any)(...a) });
  // [x4-v] 变更审核面板与库存过滤元数据装配已迁出：见 ./wiring/review-panel-wiring.ts
  const { INVENTORY_QUALITY_OPTIONS, INVENTORY_SORT_OPTIONS, INVENTORY_TYPE_OPTIONS, refreshChangesPanel, renderDashboard, showChangeEditModal, showChangeSingleFieldModal, showRowCompareEditModal, updateChangesCount } = createReviewPanelWiring({ AvatarManager, DashboardDataParser, NameAliasRegistry, ValidationEngine, bindChangesEvents, buildAvatarBackgroundStyle, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, countRuntimeDataChanges, createCustomTableNameIconContext, currentDiffMap_ACC: { get v(){ return currentDiffMap_ACC.v; }, set v(x){ currentDiffMap_ACC.v = x; } }, escapeHtml, findDiffSnapshotEntry, generateDiffMap, getConfig, getCore, getDashboardNpcListData, getDiffDataRow, getDiffSheetByKey, getElementEmoji, getTableData, getTutorialButtonHtml, isSettingsOpen_ACC: { get v(){ return isSettingsOpen_ACC.v; }, set v(x){ isSettingsOpen_ACC.v = x; } }, loadSnapshot, normalizeDiffRow, parseAttributeString, renderChangesPanel, renderCustomTableNameIconContent, replaceUserPlaceholders, saveRowInstantly, saveSnapshot, setDiffDataCell, setDiffDataRow, setupOverlayClose, showDiceSystemConfirmDialog });
  // [x4-i] 抽卡设置/配置装配已迁出：见 ./wiring/gacha-settings-wiring.ts
  const { DEFAULT_GACHA_SETTINGS_ITEM_FILTERS, GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS, GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH, GACHA_CUSTOM_FIELD_MAX_COUNT, GACHA_CUSTOM_FIELD_RESERVED_KEYS, GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH, GACHA_EFFECT_FIELD_ALIASES, GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS, GACHA_SETTINGS_SORT_OPTIONS, GACHA_SETTINGS_SOURCE_FILTER_OPTIONS, GACHA_SETTINGS_STATUS_FILTER_OPTIONS, GACHA_TAG_FIELD_ALIASES, GACHA_TARGET_COLUMN_KEYS, GACHA_TARGET_COLUMN_LABELS, GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH, GACHA_TARGET_TABLE_MAX_LENGTH, INVENTORY_QUALITY_FILTER_META, INVENTORY_TYPE_FILTER_META, addGachaShards, analyzeGachaCatalogImport, applyGachaCatalogImport, assertSaveStoredGachaStateSnapshot, bindCompositionSafeSearchInput, buildAdvancedPresetAgentPrompt, buildCrudColumnAliasMap, buildDefaultGachaPoolDefinition, buildGachaInventoryMetaRecord, buildStableGachaCustomItemId, canDeleteGachaPoolDefinition, cloneGachaCatalogItems, collectGachaLocalStorageSnapshot, compareGachaItemDefinitionsForDisplay, createDefaultGachaState, createEmptyGachaCatalog, createUniqueGachaItemId, deleteGachaItemSetting, downloadGachaCatalogJson, ensureGachaCatalogLoaded, ensureGachaPoolsForTags, exportGachaCatalogJson, formatGachaCatalogImportStatsText, formatGachaItemCardMeta, formatGachaPoolTags, formatGachaRewardDestinationLabel, getActiveGachaPoolTags, getAllGachaItemDefinitions, getAllGachaPoolConfigDefinitions, getAvailableGachaRewardTargets, getConfiguredGachaPoolDefinitions, getCustomGachaItemDefinitions, getGachaActivePoolTag, getGachaCatalogImportFailureMessage, getGachaCatalogItemsForExport, getGachaCustomFieldEntries, getGachaCustomFieldsSearchText, getGachaItemDefinitionFingerprint, getGachaItemDescriptionText, getGachaItemEffectText, getGachaItemTagsText, getGachaMinimumRarity, getGachaNamedCustomField, getGachaPickupItems, getGachaPoolDefinitions, getGachaPoolDisplayName, getGachaRarityIconClass, getGachaRarityRank, getGachaRewardFieldLimits, getGachaRewardParseResult, getGachaRewardParseResultForItem, getGachaRewardTargetOptions, getGachaRewardTargetTableLabel, getGachaShardLabel, getGachaState, getGachaTargetColumnEntries, getInventoryFilters, getInventoryFiltersCollapsedState, getInventoryPanelTarget, getRuntimeGachaRawData, getStoredGachaActivePoolTag, getStoredGachaItemSettings, getVisibleGachaPoolConfigDefinitions, hasGachaCustomFields, hasGachaRewardTableForItem, importGachaCatalogJsonFromFile, inferEquipmentTableTypeForGachaItem, isBuiltinGachaPoolId, isGachaFieldAlias, isGachaItemEnabled, isGachaRarity, mergeGachaCatalogRecordsToGlobalScope, migrateGachaCatalogRecordsToGlobalScope, normalizeGachaCatalogRecord, normalizeGachaCustomFields, normalizeGachaItemEnabled, normalizeGachaItemOrder, normalizeGachaPoolDefinition, normalizeGachaRewardTarget, normalizeGachaTargetColumns, normalizeGachaTargetTable, normalizeGachaTimestamp, normalizeImportedGachaItem, persistRawDataWithGacha, pickGachaItemDefinition, pickGachaRarity, recordGachaFortuneGain, renderGachaCustomFieldsDetailsHtml, renderGachaCustomFieldsPreviewHtml, restoreGachaLocalStorageSnapshot, saveGachaPoolSettings, saveInventoryFilters, saveInventoryFiltersCollapsedState, saveInventoryPanelTarget, saveStoredGachaActivePoolTag, saveStoredGachaCatalog, saveStoredGachaStateSnapshot, serializeGachaCatalogItemForExport, setEquipmentRowBasicFields, setGachaItemOrder, setGachaPoolOrder, setInventoryRowBasicFields, settleGachaFortuneForDiceEvent, showGachaCatalogClearDialog, showGachaSaveError, touchGachaActivity, truncateGachaText, updateGachaItemSetting, updateGachaPoolConfig, validateGachaCatalogImportItemTarget, gachaCatalogCache_ACC, gachaCatalogLoadTask_ACC } = createGachaSettingsWiring({ GACHA_CATALOG_GLOBAL_SCOPE_KEY, GACHA_TEST_DEFAULT_FORTUNE, INVENTORY_QUALITY_OPTIONS, INVENTORY_SORT_OPTIONS, INVENTORY_TYPE_OPTIONS, addCrudColumnAlias, applyGachaCustomFieldsToRow: (...a: any[]) => (applyGachaCustomFieldsToRow as any)(...a), assertCrudEnumConstraints, assertCrudInsertRequiredCells, assertCrudLengthConstraints, assertCrudRequiredColumnsRepresented, buildCrudEnumConstraintMap, cloneDiceConfigBackupValue, downloadJsonFile, downloadJsoncFile, escapeHtml, getConfig, getCore, getCrudColumnNameForHeader, getCrudSheetDdl, getCrudSqlCommentAliases, getCurrentContextFingerprint, getDbChatMessages, getInventoryGlobalContext: (...a: any[]) => (getInventoryGlobalContext as any)(...a), getInventoryMetadataForItem: (...a: any[]) => (getInventoryMetadataForItem as any)(...a), getJsonLikeErrorMessage, getRuntimeErrorMessage, getTableData, hasSheetKeys, parseCrudColumnDefinitionLine, parseEquipmentItems: (...a: any[]) => (parseEquipmentItems as any)(...a), parseInventoryItems: (...a: any[]) => (parseInventoryItems as any)(...a), parseJsoncValue, performSaveDataOnly, pickTextFile, refreshGachaShardShop: (...a: any[]) => (refreshGachaShardShop as any)(...a), refreshGachaVisualization: (...a: any[]) => (refreshGachaVisualization as any)(...a), runInSaveQueue, setupOverlayClose, showGachaSettingsDialog: (...a: any[]) => (showGachaSettingsDialog as any)(...a), stripCrudSqlNonStructuralComments, validateGachaCustomFieldsForTargetTable: (...a: any[]) => (validateGachaCustomFieldsForTargetTable as any)(...a), cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, lastHumanInputActivityAt_ACC: { get v(){ return lastHumanInputActivityAt_ACC.v; }, set v(x){ lastHumanInputActivityAt_ACC.v = x; } } });
  // [x4-j] 抽卡主流程/面板装配已迁出：见 ./wiring/gacha-draw-wiring.ts
  const { applyGachaCustomFieldsToRow, buildGachaCustomFieldHeaderMap, clearGachaFortune, deleteGachaPoolConfig, findGachaDefinitionByInventoryItem, getGachaFortuneProgressView, getGachaItemGrantQuantity, getGachaReservedCustomFieldHeaders, getGachaShopProgressContainers, grantGachaReward, performGachaDraw, renderGachaPanelHtml, showGachaPickupItemDetail, showGachaPoolNameDialog, showGachaRecentRewardDetail, showGachaSettingsDialog, updateGachaFortuneProgressDom, updateGachaPoolTag, updateGachaShopProgressUi, validateGachaCustomFieldsForTargetTable } = createGachaDrawWiring({ DEFAULT_GACHA_SETTINGS_ITEM_FILTERS, GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS, GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS, GACHA_SETTINGS_SORT_OPTIONS, GACHA_SETTINGS_SOURCE_FILTER_OPTIONS, GACHA_SETTINGS_STATUS_FILTER_OPTIONS, addGachaShards, assertCrudEnumConstraints, assertCrudInsertRequiredCells, assertCrudLengthConstraints, assertCrudRequiredColumnsRepresented, assertSaveStoredGachaStateSnapshot, bindTutorialButtonsIn, buildCrudRequiredHeaderSet, buildDefaultGachaPoolDefinition, buildGachaCatalogAgentPrompt, buildGachaCatalogAgentPromptFilename, buildGachaInventoryMetaRecord, canDeleteGachaPoolDefinition, cloneGachaCatalogItems, cloneRuntimeDataValue, collectGachaLocalStorageSnapshot, collectHostAndLocalNodes, compareGachaItemDefinitionsForDisplay, createDefaultGachaState, createSortableList, deleteGachaItemSetting, downloadAiPromptFile, downloadGachaCatalogJson, ensureGachaCatalogLoaded, ensureGachaPoolsForTags, escapeHtml, formatGachaItemCardMeta, formatGachaPoolTags, formatGachaRewardDestinationLabel, gachaCatalogCache_ACC, gachaCatalogLoadTask_ACC, getAllGachaItemDefinitions, getAllGachaPoolConfigDefinitions, getAvailableGachaRewardTargets, getConfig, getConfiguredGachaPoolDefinitions, getCore, getCustomGachaItemDefinitions, getGachaActivePoolTag, getGachaCatalogItemsForExport, getGachaCustomFieldEntries, getGachaCustomFieldsSearchText, getGachaItemCustomTableNameIconContext, getGachaItemDescriptionText, getGachaItemEffectText, getGachaItemTagsText, getGachaMinimumRarity, getGachaPickupItems, getGachaPoolDefinitions, getGachaPoolDisplayName, getGachaRarityRank, getGachaRewardParseResultForItem, getGachaRewardTargetTableLabel, getGachaShardLabel, getGachaState, getGachaTargetColumnEntries, getJsonLikeErrorMessage, getRuntimeErrorMessage, getRuntimeGachaRawData, getStoredGachaActivePoolTag, getStoredGachaItemSettings, getTableData, getTutorialButtonHtml, getVisibleGachaPoolConfigDefinitions, hasGachaCustomFields, hydrateCustomTableNameIconsIn, importGachaCatalogJsonFromFile, isGachaItemEnabled, normalizeGachaTimestamp, parseInventoryItems: (...a: any[]) => (parseInventoryItems as any)(...a), persistRawDataWithGacha, pickGachaItemDefinition, pickGachaRarity, refreshGachaShardShop: (...a: any[]) => (refreshGachaShardShop as any)(...a), refreshGachaVisualization: (...a: any[]) => (refreshGachaVisualization as any)(...a), refreshInventoryVisualization: (...a: any[]) => (refreshInventoryVisualization as any)(...a), renderGachaCustomFieldsDetailsHtml, renderGachaCustomFieldsPreviewHtml, renderGachaItemIconContent, restoreGachaLocalStorageSnapshot, restoreMutableRuntimeValue, runInSaveQueue, saveGachaPoolSettings, saveStoredGachaActivePoolTag, saveStoredGachaCatalog, saveStoredGachaStateSnapshot, setEquipmentRowBasicFields, setGachaItemOrder, setGachaPoolOrder, setInventoryMetadataForItem: (...a: any[]) => (setInventoryMetadataForItem as any)(...a), setInventoryRowBasicFields, setupOverlayClose, showDiceSystemConfirmDialog, showGachaCatalogClearDialog, showGachaItemEditorDialog: (...a: any[]) => (showGachaItemEditorDialog as any)(...a), showGachaSaveError, touchGachaActivity, updateGachaItemSetting, updateGachaPoolConfig, warnTableTemplateIssue, withTableTemplateCheckHint, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, gachaShopRootElement_ACC: { get v(){ return gachaShopRootElement_ACC.v; }, set v(x){ gachaShopRootElement_ACC.v = x; } } });
  // [x4-ab] 抽卡物品编辑弹窗装配已迁出：见 ./wiring/gacha-editor-dialog-wiring.ts
  const { showGachaItemEditorDialog } = createGachaEditorDialogWiring({ GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH, GACHA_CUSTOM_FIELD_MAX_COUNT, GACHA_CUSTOM_FIELD_RESERVED_KEYS, GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH, GACHA_EFFECT_FIELD_ALIASES, GACHA_TAG_FIELD_ALIASES, GACHA_TARGET_COLUMN_KEYS, GACHA_TARGET_COLUMN_LABELS, GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH, GACHA_TARGET_TABLE_MAX_LENGTH, bindTutorialButtonsIn, buildDefaultGachaPoolDefinition, buildGachaCustomFieldHeaderMap, buildStableGachaCustomItemId, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, collectGachaLocalStorageSnapshot, countUnicodeCharacters, createUniqueGachaItemId, ensureGachaCatalogLoaded, ensureGachaPoolsForTags, escapeHtml, gachaCatalogCache_ACC: { get v(){ return gachaCatalogCache_ACC.v; }, set v(x){ gachaCatalogCache_ACC.v = x; } }, gachaCatalogLoadTask_ACC: { get v(){ return gachaCatalogLoadTask_ACC.v; }, set v(x){ gachaCatalogLoadTask_ACC.v = x; } }, gachaShopUiRefreshTimer_ACC: { get v(){ return gachaShopUiRefreshTimer_ACC.v; }, set v(x){ gachaShopUiRefreshTimer_ACC.v = x; } }, getAllGachaItemDefinitions, getAllGachaPoolConfigDefinitions, getConfig, getCore, getCustomGachaItemDefinitions, getGachaCustomFieldEntries, getGachaItemCustomTableNameIconContext, getGachaItemDefinitionFingerprint, getGachaNamedCustomField, getGachaReservedCustomFieldHeaders, getGachaRewardFieldLimits, getGachaShopProgressContainers, getJsonLikeErrorMessage, getRuntimeErrorMessage, getTableData, getTutorialButtonHtml, hydrateCustomTableNameIconsIn, inferEquipmentTableTypeForGachaItem, isGachaFieldAlias, isGachaItemEnabled, normalizeGachaCustomFields, normalizeGachaRewardTarget, normalizeGachaTargetColumns, normalizeGachaTargetTable, parseEquipmentItems: (...a: any[]) => (parseEquipmentItems as any)(...a), parseInventoryItems: (...a: any[]) => (parseInventoryItems as any)(...a), refreshGachaShardShop: (...a: any[]) => (refreshGachaShardShop as any)(...a), refreshGachaVisualization: (...a: any[]) => (refreshGachaVisualization as any)(...a), renderGachaItemIconContent, restoreGachaLocalStorageSnapshot, runInSaveQueue, saveStoredGachaCatalog, setupOverlayClose, showGachaPoolNameDialog, showGachaSettingsDialog, startGachaShopUiRefresh: (...a: any[]) => (startGachaShopUiRefresh as any)(...a), truncateGachaText, validateGachaCatalogImportItemTarget, validateGachaCustomFieldsForTargetTable });
  // [x4-h_ACC.v] 抽卡/库存/商店装配已迁出：见 ./wiring/gacha-inventory-wiring.ts
  const { showInventoryVisualization, bindEvents, bindFavoritesEvents, closeGachaVisualization, closePanel, ensureGachaHeartbeat, ensurePanelNavigationVisible, flushGachaHeartbeatProgress, getDataAreaForRoot, getInventoryGlobalContext, getInventoryMetadataForItem, loadDashboardNpcAvatars, parseEquipmentItems, parseInventoryItems, refreshGachaShardShop, refreshGachaVisualization, refreshInventoryVisualization, renderFavoritesPanel, renderTableContent, resolveExistingTableName, saveCurrentTabState, setActiveTableNavButton, setInventoryMetadataForItem, settleGachaFortuneForMessage, showGachaShardShop, showGachaVisualization, startGachaShopUiRefresh, syncHostRegenerateButtonVisibility, syncInventoryMetadataForRawData, warnMissingTableTarget } = createGachaInventoryWiring({ AvatarManager, BookmarkManager, DashboardDataParser, FLOATING_COLLAPSE_DRAG_THRESHOLD, GACHA_CATALOG_RAW_ROW_INDEX_PROP, GACHA_SHARD_EXCHANGE_COST, GACHA_SHOP_UI_REFRESH_MS, INVENTORY_QUALITY_FILTER_META, INVENTORY_SORT_OPTIONS, INVENTORY_TYPE_FILTER_META, INVENTORY_TYPE_OPTIONS, MvuModule, NameAliasRegistry, ValidationRuleManager, addGachaShards, applyStoredPanelHeight, bindChangesEvents, bindCompositionSafeSearchInput, bindGlobalInteractionEvents, buildCrudColumnAliasMap, buildRelationshipGraphTableFromPreset, canWriteMvuPanel, clampFloatingCollapsePosition, cleanupGlobalInteractionFloatingMenus, clearAllPanelStates, clearGachaFortune, cloneRuntimeDataValue, collectCurrentChatAvatarNodes, compareGachaItemDefinitionsForDisplay, consumePendingHumanInputSnapshot, countUnicodeCharacters, createCustomTableNameIconContext, createDefaultGachaState, ensureGachaCatalogLoaded, escapeHtml, executeTableInteractionAction, extractNumericValue, findGachaDefinitionByInventoryItem, findRowIndexByPrimaryKey, formatCssImageUrl, formatGachaItemCardMeta, formatGachaRewardDestinationLabel, getActiveDashboardRelationshipGraphSources, getActiveTabState, getAllGachaItemDefinitions, getAttributeValue, getCheckSuggestionItemsFromTable, getCollapsedState, getConfig, getConfiguredGachaPoolDefinitions, getCore, getCrudColumnNameForHeader, getCrudSqlTableName, getCurrentContextFingerprint, getDashboardModuleConfig, getDatabaseManualUpdateErrorMessage, getDbChatMessages, getElementEmoji, getFullAttributesForCharacter, getGachaActivePoolTag, getGachaItemCustomTableNameIconContext, getGachaItemDescriptionText, getGachaItemEffectText, getGachaItemGrantQuantity, getGachaPoolDefinitions, getGachaPoolDisplayName, getGachaRarityIconClass, getGachaRewardParseResultForItem, getGachaShardLabel, getGachaShopProgressContainers, getGachaState, getGachaTargetColumnEntries, getIconForTableName, getInteractOptionsForRow, getInventoryFilters, getInventoryFiltersCollapsedState, getInventoryPanelTarget, getOptionItemsFromTable, getOptionsCollapsedState, getPanelDragStartHeight, getSheetKeyByTableName, getTableData, getTableStyles, getTavernHostDocument, getTavernHostWindow, getTutorialButtonHtml, getVisibleGachaPoolConfigDefinitions, grantGachaReward, hasGachaCustomFields, hasGachaRewardTableForItem, hydrateCustomTableNameIconsIn, isCheckSuggestionTableName, isFloatingCollapseActive, isGachaItemEnabled, isGachaRarity, isOptionTableName, isTableReversed, normalizeDiffText, normalizeGachaTargetTable, openDatabaseInterface, openDatabaseVisualizerInterface, performGachaDraw, persistRawDataWithGacha, processJsonData, recordGachaFortuneGain, renderChangesPanel, renderCustomTableNameIconContent, renderDashboard, renderDataCardCellContent, renderGachaCustomFieldsDetailsHtml, renderGachaCustomFieldsPreviewHtml, renderGachaItemIconContent, renderGachaPanelHtml, renderGlobalInteractionsPanel, renderInterface, renderThemeIconContent, replaceUserPlaceholders, resetPanelRequestedHeight, runDatabaseManualUpdate, runInSaveQueue, safeDecodeURIComponent, safeEncodeURIComponent, saveActiveTabState, saveCollapsedState, saveConfig, saveDataToDatabase, saveInventoryFilters, saveInventoryFiltersCollapsedState, saveInventoryPanelTarget, saveOptionsCollapsedState, savePanelRequestedHeight, saveRowInstantly, saveStoredGachaStateSnapshot, saveTableStyles, scheduleFixedWrapperBoundsRefresh, scheduleViewportBoundsRefresh, setPanelRequestedHeight, setupOverlayClose, shouldShowReverseButton, showAvatarManager, showCardEditModal, showCellMenu: (...a: any[]) => (showCellMenu as any)(...a), showContestPanel, showDashboardPresetManager, showDatabaseManualUpdateFailure, showDicePanel, showDiceSystemInputDialog, showEditDialog: (...a: any[]) => (showEditDialog as any)(...a), showFavoriteEditModal, showGachaPickupItemDetail, showGachaRecentRewardDetail, showGachaSaveError, showGachaSettingsDialog, showMapVisualization, showRelationshipGraph, showSendToTableModal, showSettingsModal, smartInsertToTextarea, startTutorialFromButton, stripSystemInjectedContent, toggleTableReverse, touchGachaActivity, updateGachaFortuneProgressDom, updateGachaPoolTag, updateGachaShopProgressUi, warnTableTemplateIssue, withTableTemplateCheckHint, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, currentDiffMap_ACC: { get v(){ return currentDiffMap_ACC.v; }, set v(x){ currentDiffMap_ACC.v = x; } }, gachaHeartbeatTimer_ACC: { get v(){ return gachaHeartbeatTimer_ACC.v; }, set v(x){ gachaHeartbeatTimer_ACC.v = x; } }, gachaShopRootElement_ACC: { get v(){ return gachaShopRootElement_ACC.v; }, set v(x){ gachaShopRootElement_ACC.v = x; } }, gachaShopUiRefreshTimer_ACC: { get v(){ return gachaShopUiRefreshTimer_ACC.v; }, set v(x){ gachaShopUiRefreshTimer_ACC.v = x; } }, hasUnsavedChanges_ACC: { get v(){ return hasUnsavedChanges_ACC.v; }, set v(x){ hasUnsavedChanges_ACC.v = x; } }, isEditingOrder_ACC: { get v(){ return isEditingOrder_ACC.v; }, set v(x){ isEditingOrder_ACC.v = x; } }, lastHumanInputActivityAt_ACC: { get v(){ return lastHumanInputActivityAt_ACC.v; }, set v(x){ lastHumanInputActivityAt_ACC.v = x; } }, suppressNextFloatingCollapseClick_ACC: { get v(){ return suppressNextFloatingCollapseClick_ACC.v; }, set v(x){ suppressNextFloatingCollapseClick_ACC.v = x; } }, tablePageStates_ACC: { get v(){ return tablePageStates_ACC.v; }, set v(x){ tablePageStates_ACC.v = x; } }, tableScrollStates_ACC: { get v(){ return tableScrollStates_ACC.v; }, set v(x){ tableScrollStates_ACC.v = x; } }, tableSearchStates_ACC: { get v(){ return tableSearchStates_ACC.v; }, set v(x){ tableSearchStates_ACC.v = x; } }, tutorialButtonEventsBound_ACC: { get v(){ return tutorialButtonEventsBound_ACC.v; }, set v(x){ tutorialButtonEventsBound_ACC.v = x; } } });
  // [x4-ac] 表格排序编辑与单元格菜单装配已迁出：见 ./wiring/table-order-cellmenu-wiring.ts
  const { showCellMenu } = createTableOrderCellMenuWiring({ MAX_ACTION_BUTTONS, appendRowInstantly, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, currentDiffMap_ACC: { get v(){ return currentDiffMap_ACC.v; }, set v(x){ currentDiffMap_ACC.v = x; } }, deleteRowInstantly, escapeHtml, findDiffSnapshotEntry, findRowIndexByPrimaryKey, findRuntimeSheetEntryForMutation, generateDiffMap, getBadgeStyle, getConfig, getCore, getDiffDataRow, getDiffSheetByKey, getSheetHeaders, getSheetKeyByTableName, getTableData, hasUnsavedChanges_ACC: { get v(){ return hasUnsavedChanges_ACC.v; }, set v(x){ hasUnsavedChanges_ACC.v = x; } }, isEditingOrder_ACC: { get v(){ return isEditingOrder_ACC.v; }, set v(x){ isEditingOrder_ACC.v = x; } }, loadSnapshot, renderInterface, safeDecodeURIComponent, safeEncodeURIComponent, saveRowInstantly, saveTableOrder, showCardEditModal, showDiceSystemConfirmDialog, showDiceSystemInputDialog, showEditDialog: (...a: any[]) => (showEditDialog as any)(...a), showTagInputModal, syncHostRegenerateButtonVisibility, updateSaveButtonState });
  // [x4-u] 初始化引导与诊断工具装配已迁出：见 ./wiring/bootstrap-wiring.ts
  const { init, showEditDialog } = createBootstrapWiring({ ErrorHandler, MvuModule, UpdateController, _boundRenderHandler_ACC: { get v(){ return _boundRenderHandler_ACC.v; }, set v(x){ _boundRenderHandler_ACC.v = x; } }, _boundReviewBaselineHandler_ACC: { get v(){ return _boundReviewBaselineHandler_ACC.v; }, set v(x){ _boundReviewBaselineHandler_ACC.v = x; } }, addStyles, bindAcuDiceGachaRegexActions: (...a: any[]) => (bindAcuDiceGachaRegexActions as any)(...a), bindHumanInputTracking, cachedRawData_ACC: { get v(){ return cachedRawData_ACC.v; }, set v(x){ cachedRawData_ACC.v = x; } }, capturePendingHumanInputSnapshot, currentDiffMap_ACC: { get v(){ return currentDiffMap_ACC.v; }, set v(x){ currentDiffMap_ACC.v = x; } }, ensureGachaHeartbeat, escapeHtml, flushGachaHeartbeatProgress, gachaHeartbeatTimer_ACC: { get v(){ return gachaHeartbeatTimer_ACC.v; }, set v(x){ gachaHeartbeatTimer_ACC.v = x; } }, gachaShopUiRefreshTimer_ACC: { get v(){ return gachaShopUiRefreshTimer_ACC.v; }, set v(x){ gachaShopUiRefreshTimer_ACC.v = x; } }, generateCrazyRoll, getActiveTabState, getConfig, getCore, getDiceConfig, getTutorialModule, hasRuntimeTableReadApi, hasUnsavedChanges_ACC: { get v(){ return hasUnsavedChanges_ACC.v; }, set v(x){ hasUnsavedChanges_ACC.v = x; } }, hideDiceResultsInUserMessages, interceptTextareaValue, isEditingOrder_ACC: { get v(){ return isEditingOrder_ACC.v; }, set v(x){ isEditingOrder_ACC.v = x; } }, isFloatingCollapseActive, isInitialized_ACC: { get v(){ return isInitialized_ACC.v; }, set v(x){ isInitialized_ACC.v = x; } }, maybeRefreshReviewBaselineAtFillStart, observer_ACC: { get v(){ return observer_ACC.v; }, set v(x){ observer_ACC.v = x; } }, optionPanelVisible_ACC: { get v(){ return optionPanelVisible_ACC.v; }, set v(x){ optionPanelVisible_ACC.v = x; } }, renderInterface, restoreDiceResultBeforeSend, saveCurrentDatabaseSnapshotAsReviewBaseline, scheduleCharacterDiceProfileDetection, scheduleDialogueIndentRender, setTextareaValueAndNotify, settleGachaFortuneForMessage, setupOverlayClose, shouldTriggerCrazyMode, smartInsertToTextarea, tablePageStates_ACC: { get v(){ return tablePageStates_ACC.v; }, set v(x){ tablePageStates_ACC.v = x; } }, tableScrollStates_ACC: { get v(){ return tableScrollStates_ACC.v; }, set v(x){ tableScrollStates_ACC.v = x; } }, tableSearchStates_ACC: { get v(){ return tableSearchStates_ACC.v; }, set v(x){ tableSearchStates_ACC.v = x; } } });
  // [x4-x] 抽卡API装配已迁出：见 ./wiring/gacha-api-wiring.ts
  const { acuDiceGachaApi } = createGachaApiWiring({ analyzeGachaCatalogImport, applyGachaCatalogImport, assertSaveStoredGachaStateSnapshot, buildDefaultGachaPoolDefinition, canDeleteGachaPoolDefinition, closeGachaVisualization, compareGachaItemDefinitionsForDisplay, createDefaultGachaState, deleteGachaItemSetting, deleteGachaPoolConfig, emitEvent, ensureGachaCatalogLoaded, exportGachaCatalogJson, formatGachaCatalogImportStatsText, getActiveGachaPoolTags, getAllGachaItemDefinitions, getAllGachaPoolConfigDefinitions, getConfiguredGachaPoolDefinitions, getCustomGachaItemDefinitions, getGachaActivePoolTag, getGachaCatalogImportFailureMessage, getGachaFortuneProgressView, getGachaState, getRuntimeGachaRawData, getVisibleGachaPoolConfigDefinitions, isBuiltinGachaPoolId, isGachaItemEnabled, normalizeGachaPoolDefinition, performGachaDraw, recordGachaFortuneGain, refreshGachaShardShop, refreshGachaVisualization, runInSaveQueue, saveGachaPoolSettings, saveStoredGachaCatalog, serializeGachaCatalogItemForExport, showDiceSystemConfirmDialog, showGachaSettingsDialog, showGachaShardShop, showGachaVisualization, touchGachaActivity, updateGachaPoolTag });
  // [x4-ag] 抽卡正则动作装配已迁出：见 ./wiring/gacha-regex-actions-wiring.ts
  const { bindAcuDiceGachaRegexActions } = createGachaRegexActionsWiring({ acuDiceGachaApi, getCore, getRuntimeErrorMessage, rootWindow });
  Object.assign(AcuDiceAPI, { gacha: acuDiceGachaApi });

  // [b12.7] 骰子UI桥：向 DND 融合侧暴露骰子面板核心 UI 能力（设置/商店/库存/关系图/头像/手动更新/数据库）
  try {
    const _acuToast = (m: string) => { try { (window as any).toastr?.warning?.(m); } catch (e) {} };
    const _acuUIBridge: any = {
      showSettingsModal: (...a: any[]) => (showSettingsModal as any)(...a),
      runDatabaseManualUpdate: (...a: any[]) => (runDatabaseManualUpdate as any)(...a),
      showGachaVisualization: (...a: any[]) => (showGachaVisualization as any)(...a),
      showInventoryVisualization: (...a: any[]) => (showInventoryVisualization as any)(...a),
      openDatabaseInterface: (...a: any[]) => (openDatabaseInterface as any)(...a),
      openDatabaseVisualizerInterface: (...a: any[]) => (openDatabaseVisualizerInterface as any)(...a),
      // DND 适配版：关系图（'与主角关系' -> '人际关系' 列名适配）
      showRelationshipGraphForDnd: () => {
        try {
          const rawData = getTableData();
          const allTables: any = processJsonData(rawData || {});
          const npcResult: any = DashboardDataParser.findTable(allTables, 'npc');
          const data: any = npcResult && npcResult.data;
          if (!data) { _acuToast('未找到人物数据'); return; }
          const headers = (data.headers || []).slice();
          const ri = headers.findIndex((h: any) => String(h).includes('与主角关系') || String(h).includes('人际关系'));
          if (ri >= 0) headers[ri] = '人际关系';
          (showRelationshipGraph as any)({ headers, rows: data.rows, key: npcResult.key || '' });
        } catch (e) { console.warn('[AcuDice] showRelationshipGraphForDnd 失败', e); }
      },
      // DND 适配版：头像预设
      showAvatarManagerForDnd: () => {
        try {
          const rawData = getTableData();
          const allTables: any = processJsonData(rawData || {});
          const nodeArr: any = collectCurrentChatAvatarNodes(allTables);
          if (!nodeArr || nodeArr.length === 0) { _acuToast('未找到角色数据，请先添加主角或 NPC'); return; }
          (showAvatarManager as any)(nodeArr);
        } catch (e) { console.warn('[AcuDice] showAvatarManagerForDnd 失败', e); }
      },
      // [b12.15] 选项深化：其他选项表（转置扫描）+ 检定建议 + 字号
      getExtraOptionItems: () => {
        try {
          const rawData = getTableData();
          const allTables: any = processJsonData(rawData || {});
          const out: any[] = [];
          Object.keys(allTables).forEach((k) => {
            const t: any = allTables[k];
            const name = (t && t.name) || k;
            try { if (!isOptionTableName(name)) return; } catch (e) { return; }
            if (String(name).indexOf('行动选项') >= 0) return; // DND 自有表已单独渲染（去重）
            try { (getOptionItemsFromTable(t) || []).forEach((it: any) => { if (it && it.text) out.push({ text: String(it.text) }); }); } catch (e) {}
          });
          return out;
        } catch (e) { return []; }
      },
      getCheckSuggestionItems: () => {
        try {
          const rawData = getTableData();
          const allTables: any = processJsonData(rawData || {});
          const out: any[] = [];
          Object.keys(allTables).forEach((k) => {
            const t: any = allTables[k];
            const name = (t && t.name) || k;
            try { if (!isCheckSuggestionTableName(name)) return; } catch (e) { return; }
            try { (getCheckSuggestionItemsFromTable(t) || []).forEach((it: any) => { if (it && it.displayText) out.push({ displayText: String(it.displayText || ''), commandText: String(it.commandText || '') }); }); } catch (e) {}
          });
          return out;
        } catch (e) { return []; }
      },
      executeCheckSuggestion: (displayText: string, commandText: string) => {
        try { return executeCheckSuggestionCommand(displayText, commandText); } catch (e) { console.warn('[AcuDice] executeCheckSuggestion 失败', e); return false; }
      },
      getOptionFontSize: () => {
        try { return (getConfig && getConfig().optionFontSize) || null; } catch (e) { return null; }
      },
      // [b12.14] 选项面板能力桥：骰子同款（自动发送 / 读取自动发送设置）
      smartSendText: (text: string) => {
        try { return sendChatTextAndTrigger(text); } catch (e) { console.warn('[AcuDice] smartSendText 失败', e); return null; }
      },
      getClickOptionToAutoSend: () => {
        try { return !!(getConfig && getConfig().clickOptionToAutoSend); } catch (e) { return false; }
      },
      // [b12.11] 打开骰子系统的完整投骰面板（规则 / 预设 / 成功标准切换）
      showDicePanelForDnd: (opts?: any) => {
        try { (showDicePanel as any)(opts || {}); } catch (e) { console.warn('[AcuDice] showDicePanelForDnd 失败', e); }
      },
      // [b12.18] 内容弹窗：表详情 HTML + 骰子视图 HTML（changes/favorites/global-interactions）
      renderTableDetailHtml: (tableKey: string) => {
        try {
          const rawData: any = getTableData();
          if (!rawData) return '';
          const allTables: any = processJsonData(rawData);
          const sheet: any = allTables[String(tableKey)];
          if (!sheet) return '';
          const headers = sheet.headers || [];
          const rows = sheet.rows || [];
          let html = '<div style="max-height:55vh;overflow-y:auto;">';
          html += '<div style="font-weight:bold;color:var(--dnd-text-highlight);border-bottom:1px solid var(--dnd-border-gold);padding-bottom:5px;margin-bottom:8px;">' + escapeHtml(String(sheet.name || tableKey)) + '（' + rows.length + ' 行）</div>';
          html += '<table class="dnd-table" style="width:100%;border-collapse:collapse;font-size:11px;"><thead><tr>';
          headers.forEach((h: any) => { html += '<th style="text-align:left;padding:4px 6px;border-bottom:1px solid var(--dnd-border-inner);color:var(--dnd-text-dim);white-space:nowrap;">' + escapeHtml(String(h ?? '')) + '</th>'; });
          html += '</tr></thead><tbody>';
          rows.forEach((row: any) => {
            html += '<tr>';
            (row || []).forEach((cell: any) => { html += '<td style="padding:4px 6px;border-bottom:1px dashed var(--dnd-border-subtle);color:var(--dnd-text-main);word-break:break-all;">' + escapeHtml(String(cell ?? '')) + '</td>'; });
            html += '</tr>';
          });
          html += '</tbody></table></div>';
          return html;
        } catch (e) { return ''; }
      },
      renderAcuViewHtml: (view: string) => {
        try {
          const rawData = getTableData();
          if (view === 'changes') return renderChangesPanel(rawData);
          if (view === 'global-interactions') return renderGlobalInteractionsPanel(rawData);
          if (view === 'favorites') { try { return renderFavoritesPanel(); } catch (e) { return null; } }
          return null;
        } catch (e) { console.warn('[AcuDice] renderAcuViewHtml 失败', e); return null; }
      },
      // [b13.1] DND 表格宿主：渲染完整表格视图 + 基础操作（搜索/分页/倒序）
      renderTableHostForDnd: (tableName: string) => {
        try {
          const rawData = getTableData();
          if (!rawData) return '';
          const allTables: any = processJsonData(rawData);
          const t: any = allTables[String(tableName)];
          if (!t) return '';
          return renderTableContent(t, tableName);
        } catch (e) { console.warn('[AcuDice] renderTableHostForDnd 失败', e); return ''; }
      },
      dndTableOp: (op: string, tableName: string, payload?: any) => {
        try {
          if (op === 'search') {
            const st: any = tableSearchStates_ACC.v || {};
            st[tableName] = String(payload || '');
            tableSearchStates_ACC.v = st;
            const ps: any = tablePageStates_ACC.v || {};
            ps[tableName] = 1;
            tablePageStates_ACC.v = ps;
            return true;
          }
          if (op === 'page') {
            const ps: any = tablePageStates_ACC.v || {};
            ps[tableName] = Number(payload) || 1;
            tablePageStates_ACC.v = ps;
            return true;
          }
          if (op === 'reverse') { try { toggleTableReverse(tableName); } catch (e) {} return true; }
          return false;
        } catch (e) { console.warn('[AcuDice] dndTableOp 失败', e); return false; }
      },
      getAcuThemeClass: () => {
        try { return 'acu-theme-' + (getConfig().theme || 'dark'); } catch (e) { return 'acu-theme-dark'; }
      },
      // [b13.2a] DND 事件层：单元格菜单 / 书签 / 动作按钮
      showCellMenuForDnd: (clientX: number, clientY: number, cellEl: any) => {
        try {
          if (!cellEl) return false;
          const evt: any = { clientX: clientX, clientY: clientY, preventDefault: function () {}, stopPropagation: function () {} };
          showCellMenu(evt, cellEl);
          return true;
        } catch (e) { console.warn('[AcuDice] showCellMenuForDnd 失败', e); return false; }
      },
      toggleBookmarkForDnd: (tableName: string, rowKey: string) => {
        try { BookmarkManager.toggleBookmark(tableName, rowKey); return true; } catch (e) { return false; }
      },
      runCardActionForDnd: (btnEl: any) => {
        try {
          if (!btnEl) return false;
          const jq: any = (window as any).jQuery || (window as any).$;
          if (!jq) return false;
          const $btn = jq(btnEl);
          const rowIdx = parseInt($btn.data('row'), 10);
          const actionIdx = parseInt($btn.data('action-idx'), 10);
          const $card = $btn.closest('.acu-data-card');
          const $title = $card.find('.acu-editable-title');
          const tableKey = $title.data('key');
          const tableName = $title.data('tname') || '';
          const rawData: any = getTableData();
          if (!rawData || !rawData[tableKey]) return false;
          const headers = rawData[tableKey].content[0] || [];
          const rowData = rawData[tableKey].content[rowIdx + 1] || [];
          const actions = getInteractOptionsForRow(tableName, headers, rowData);
          const action = actions[actionIdx];
          executeTableInteractionAction(action, headers, rowData);
          return true;
        } catch (e) { console.warn('[AcuDice] runCardActionForDnd 失败', e); return false; }
      },
      // [b12.17] 表格管理镜像：骰子导航盘的表项 + 特殊入口
      getTableNavItems: () => {
        try {
          const rawData = getTableData();
          const allTables: any = processJsonData(rawData || {});
          const items: any[] = [];
          Object.keys(allTables).forEach((k) => {
            const t: any = allTables[k];
            const name = (t && t.name) || k;
            let icon = ''; try { icon = getIconForTableName(name) || ''; } catch (e) {}
            let hidden = false; try { hidden = (getHiddenTables() || []).indexOf(k) >= 0; } catch (e) {}
            if (hidden) return;
            items.push({ key: k, name: String(name), icon: String(icon || '') });
          });
          return items;
        } catch (e) { return []; }
      },
      openDicePanelTable: (tableKey: string) => {
        try {
          const _toggle = (window as any).__acuToggleDicePanel;
          if (typeof _toggle === 'function') { try { _toggle(); } catch (e) {} }
          const _try = (attempt: number) => {
            try {
              const jq: any = (window as any).jQuery || (window as any).$;
              if (!jq) return;
              const key = String(tableKey || '').replace(/"/g, '');
              const $b = jq('.acu-nav-table-btn[data-table="' + key + '"]');
              if ($b && $b.length) { $b.trigger('click'); return; }
            } catch (e) {}
            if (attempt < 5) setTimeout(() => _try(attempt + 1), 300);
          };
          setTimeout(() => _try(0), 200);
        } catch (e) { console.warn('[AcuDice] openDicePanelTable 失败', e); }
      },
      // [b12.9] 打开骰子面板并切换到指定 tab（供 DND 主面板导航 / Mini HUD 更多菜单调用）
      openDicePanelTab: (tab?: string) => {
        try {
          const _toggle = (window as any).__acuToggleDicePanel;
          if (typeof _toggle === 'function') { try { _toggle(); } catch (e) {} }
          const _doc: any = (() => { try { return (core?.utils?.getCore?.()?.window || (window as any)).document || document; } catch (e) { return document; } })();
          const _raise = () => {
            try {
              const el: any = _doc.querySelector('.acu-wrapper.acu-dice-ui-root') || _doc.querySelector('#acu-dice-ui-root') || _doc.querySelector('.acu-wrapper');
              if (el) el.style.setProperty('z-index', '2147483646', 'important');
            } catch (e) {}
          };
          const _tabMap: any = { changes: '#acu-btn-changes', mvu: '#acu-btn-mvu', favorites: '#acu-btn-favorites', 'global-interactions': '#acu-btn-global-interactions', dashboard: '#acu-btn-dashboard', dice: '#acu-btn-dice-nav' };
          const _sel = tab ? _tabMap[tab] : null;
          const _tryClick = (attempt: number) => {
            try {
              _raise();
              if (!_sel) return;
              const jq: any = (window as any).jQuery || (window as any).$;
              if (!jq) return;
              const $b = jq(_sel);
              if ($b && $b.length) { $b.trigger('click'); return; }
            } catch (e) {}
            if (attempt < 5) setTimeout(() => _tryClick(attempt + 1), 300);
          };
          setTimeout(() => _tryClick(0), 200);
        } catch (e) { console.warn('[AcuDice] openDicePanelTab 失败', e); }
      },
    };
    const _w: any = window as any;
    _w.__acuUI = Object.assign(_w.__acuUI || {}, _acuUIBridge);
    if (rootWindow && rootWindow !== window) {
      try { (rootWindow as any).__acuUI = Object.assign((rootWindow as any).__acuUI || {}, _acuUIBridge); } catch (e) {}
    }
    console.info('[AcuDice] UI桥已挂载（window.__acuUI）');
  } catch (e) { console.warn('[AcuDice] UI桥挂载失败（忽略）', e); }
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

// [x5ai] retained-import type-only sinks (erased at emit; no runtime/bundle impact)
export type __ACU_TYPE_REFS = [
  TutorialModule, TutorialScope, GachaPoolDefinition, GachaCustomFields, GachaItemDefinition, GachaPoolTag, GachaRarity, GachaRewardTarget, GachaRewardTargetColumnKey, GachaRewardTargetColumns, AcuDiceProfilePackage, AcuDiceProfileSource, NormalizeAcuDiceProfileOptions, RollResult,
  CustomFieldConfig, DerivedVarSpec, DiceExprPatch, GachaShardWallet, GachaCatalog, GachaCatalogRecord, GachaCatalogCache, GachaCatalogLoadTask, GachaCatalogImportMode, NormalizedGachaCatalogItem, GachaCatalogImportAnalysis, GachaCatalogImportStats, GachaSettingsItemSourceFilter, GachaSettingsItemStatusFilter,
  GachaSettingsItemSortMode, GachaSettingsItemFilterState, GachaSettingsFilterField, GachaSettingsFilterOption<string>, NormalizedImportedGachaPools, GachaPoolSettingsRecord, GachaItemSettingsEntry, GachaItemSettingsRecord, GachaPityState, GachaRecentRewardRecord, GachaInputStats, GachaState, GachaFortuneProgressView, GachaDrawOutcome,
];
export type __ACU_VALUE_REFS = [
  typeof createCrudWiring, typeof MAIN_STYLES, typeof setDatabaseToastMute, typeof showActionableErrorToast, typeof AcuDiceEvents, typeof AcuDiceHistory, typeof AcuDiceReadyState, typeof AcuDicePresets, typeof AcuDiceCharacters, typeof AcuDiceRoll,
  typeof AcuDiceProfiles, typeof AcuDiceCheck, typeof AcuDiceContest, typeof createAcuDiceGachaApi, typeof GachaRegexActions, typeof createAvatarManager, typeof LocalAvatarDB, typeof FavoritesDB, typeof CustomTableNameIconImageDB, typeof DiceProfileDB,
  typeof FavoritesManager, typeof createDashboardDataParser, typeof createDiceHistoryStatsDB, typeof createBookmarkManager, typeof createUpdateController, typeof createValidationRuleManager, typeof createValidationEngine, typeof createPresetManager, typeof createRegexPresetManager, typeof createRegexTransformationManager,
  typeof createRegexTransformationEngine, typeof createErrorHandler, typeof createAdvancedDicePresetManager, typeof createRenderPresetManager, typeof createAttributePresetManager, typeof createTableTemplateRequirementPresetManager, typeof createActionPresetManager, typeof createDashboardPresetManager, typeof createCustomTableNameIconStoreManager, typeof createMvuModule,
  typeof createEvaluateCondition, typeof createExecuteEffects, typeof createSmartInsertToTextarea, typeof createHideDiceResultsInUserMessages, typeof createSortableListFactory, typeof createLoadDashboardNpcAvatars, typeof createShowConflictDialog, typeof createShowPresetListDialog, typeof createShowAttributePresetManager, typeof createShowAttributePresetEditor,
  typeof createShowAdvancedPresetManager, typeof createShowAdvancedPresetEditor, typeof createShowActionPresetManager, typeof createShowActionPresetEditor, typeof createShowDashboardPresetManager, typeof createShowDashboardPresetEditor, typeof createShowRenderPresetManager, typeof createShowRenderPresetEditor, typeof createShowDebugConsoleModal, typeof createShowGlobalDiceHistoryDialog,
  typeof createShowAddValidationRuleModal, typeof createShowSmartFixModal, typeof createShowTableRuleFixModal, typeof createShowFavoritesPanel, typeof createBindFavoritesEvents, typeof createBuildMapViewModel, typeof createShowMapVisualization, typeof createShowGachaCatalogClearDialog, typeof createShowGachaPickupItemDetail, typeof createShowGachaPoolNameDialog,
  typeof createShowGachaConfirmDialog, typeof createShowGachaSettingsDialog, typeof createShowGachaItemEditorDialog, typeof createShowGachaCatalogImportConfirm, typeof createShowGachaSaveError, typeof createShowGachaRecentRewardDetail, typeof createShowGachaShardShop, typeof createShowGachaShardExchangeConfirm, typeof createShowGachaVisualization, typeof createShowCustomTableNameIconManager,
  typeof createInitSortable, typeof createCreateDefaultGachaState, typeof createNormalizeShardWallet, typeof createNormalizeRecentGachaRewards, typeof createGetGachaStateStorageKey, typeof createGetGachaStateMigrationKey, typeof createHasMigratedLegacyGachaState, typeof createMarkLegacyGachaStateMigrated, typeof createGetStoredGachaStateSnapshot, typeof createAssertSaveStoredGachaStateSnapshot,
  typeof createNormalizeGachaStateRecord, typeof createGetGachaShardLabel, typeof createNormalizeImageUrlInput, typeof createIsRemoteImageUrlValid, typeof createCreateMetaCheckResultRegex, typeof createCreateDiceResultPlaceholderRegex, typeof createCountUnicodeCharacters, typeof createRefreshDialogueIndentRender, typeof createParseAdvancedPresetJsonCandidate, typeof createBuildDashboardPresetAgentPrompt,
  typeof createBuildActionPresetAgentPrompt, typeof createBuildRenderPresetAgentPrompt, typeof createBuildTableTemplateRequirementPresetAgentPrompt, typeof createBuildGachaCatalogAgentPrompt, typeof createParseJsoncValue, typeof createNormalizeInteractionLabel, typeof createGetPendingDeletions, typeof createGetTavernHostDocument, typeof createNormalizeCustomTableNameIconKeyPart, typeof createGetActiveTabState,
  typeof createGetSavedTableOrder, typeof createGetStableTableSort, typeof createEnsureCanonicalTableOrder, typeof createGetCollapsedState, typeof createGetOptionsCollapsedState, typeof createGetTableHeights, typeof createGetTableStyles, typeof createGetHiddenTables, typeof createGetReverseTables, typeof createGetNormalizedReverseTables,
  typeof createFormatSignedModifier, typeof createGetDiceProfileSillyTavern, typeof createIsTutorialScope, typeof createNormalizeDiffRow, typeof createGetDiffHeaders, typeof createGetDiffRows, typeof createBuildCheckSuggestionMetaBlock, typeof createGetInventoryFiltersCollapsedState, typeof createGetRuntimeGachaRawData, typeof createGetGachaCatalogScopeKey,
  typeof createBuildAdvancedPresetAgentPrompt, typeof createNormalizeGachaItemEnabled, typeof createNormalizeGachaFieldAlias, typeof createHasDatabaseNewUiRuntime, typeof createCrudSqlIdentifierPattern, typeof createNormalizeCrudHeaderLookupKey, typeof createFindDatabaseNewUiManualUpdateButton, typeof createGetCustomTableNameIconLocalFileValidationError, typeof createSanitizeDiceConfigBackupPresetRules, typeof createResolveQuickSelectTarget,
  typeof createResolveIsolationKey, typeof createRenderIcon, typeof createRenderGlobalInteractionsTableGroup, typeof createRenderGlobalInteractionActionButton, typeof createPrepareInventoryTutorial, typeof createPickWeightedValue, typeof createPerformSaveDataOnly, typeof createParseTableTemplateRequirementPresetJson, typeof createParseJsoncRecord, typeof createOpenDatabaseNewUiViaMenuEntry,
  typeof createNormalizeScopedGachaCatalogRecord, typeof createNormalizeRenderPresetStringList, typeof createNormalizeGachaTargetColumns, typeof createNormalizeGachaCatalogRecord, typeof createHasDbPayload, typeof createGetTutorialModule, typeof createGetStoredGachaPoolSettings, typeof createGetResultBadgeClass, typeof createGetInventoryFieldLabel, typeof createGetGachaPickupRotationKey,
  typeof createGetElementEmoji, typeof createGetDiceConfigBackupBuiltinPresetIds, typeof createGetDashboardModuleKeysForTableName, typeof createGetCrudChangedColumns, typeof createGetAvatarFallbackColor, typeof createFormatGachaRewardDestinationLabel, typeof createDownloadCustomTableNameIconPack, typeof createCreateSheetDataFingerprint, typeof createCopyDiceConfigBackupExistingFields, typeof createClearTextareaDiceCache,
  typeof createBuildGachaCustomFieldHeaderMap, typeof createBuildDiceConfigBackupRuleOverrideMap, typeof createAcuDiceProfilesInstance, typeof createAcuDiceCheckInstance, typeof createGachaCustomFieldReservedKeys, typeof createFontsList, typeof createCustomTableNameIconDeniedTableNames, typeof createEnsurePanelNavigationVisible, typeof createUpdateGachaItemSetting, typeof createSyncAttributeRuleTagsInTemplate,
  typeof createStripSystemInjectedContent, typeof createSanitizeDiceConfigBackupStoredValue, typeof createSanitizeDiceConfigBackupRegexRule, typeof createRunInSaveQueue, typeof createRunDatabaseManualUpdateViaLegacyButton, typeof createRestoreMutableRuntimeValue, typeof createResolveDashboardCustomTableNameIconRowName, typeof createRefreshGachaShardShop, typeof createRefreshChangesPanel, typeof createReadAdvancedPresetPolicyNumber,
  typeof createPatchCrudSheetCellInRecord, typeof createParseIsolatedData, typeof createNormalizeGachaCustomFields, typeof createMergeDiceConfigBackupSetArray, typeof createGetViewportBottomAnchorElements, typeof createGetPlayerName, typeof createGetLatestAssistantMessageElement, typeof createGetGachaState, typeof createGetGachaShopProgressContainers, typeof createGetDataAreaForRoot,
  typeof createGachaRegexActionsInstance, typeof createFindRelationGraphRelationColumnMatch, typeof createFindGachaDefinitionByNameQuality, typeof createExtractNumericValue, typeof createDownloadTextFile, typeof createCreateRegexRuleSignature, typeof createClampPanelHeightToDisplay, typeof createBuildDefaultGachaPoolDefinition, typeof createBuildCrudColumnAliasMap, typeof createBuildAcuDiceGachaStateSnapshot,
  typeof createApplyDiceConfigBackupRuleOverrides, typeof createDiffIdHeaderKeywords, typeof createUpdateValidationIndicator, typeof createTriggerGenerationAfterDirectSend, typeof createStringifyAcuDiceGachaCatalogInput, typeof createStartGachaShopUiRefresh, typeof createRunMaybeAsyncDatabaseUiOpener, typeof createRenderAsyncImageIconSlotContent, typeof createParseInSceneStatus, typeof createOpenDatabaseVisualizerInterface,
  typeof createIsRelationshipCell, typeof createGetUserCharacterNameCandidates, typeof createGetInventoryGlobalContext, typeof createGetInventoryFieldColumnIndex, typeof createGetCustomTableNameIconPackImportSummaryText, typeof createGetCustomTableNameIconManagerRawSheets, typeof createFindRuntimeFunction, typeof createDedupeInteractionActions, typeof createCollectDiceConfigBackupGachaCatalogRollbackSnapshot, typeof createCloneQuickSelectNameMapping,
  typeof createClickDatabaseNewUiFormFillNavigation, typeof createClearViewportInputMutationObserver, typeof createClearFixedAnchorMutationObserver, typeof createClearComposerIfCurrentText, typeof createCleanupGlobalInteractionFloatingMenus, typeof createBuildAvatarBackgroundStyle, typeof createAssertCrudInsertRequiredCells, typeof createGlobalInteractionNameHeaderKeywords, typeof createSetPanelRequestedHeight, typeof createRenderDiceConfigBackupPrivacyNotice,
  typeof createPushRecentGachaReward, typeof createOpenDatabaseNewUiViaApi, typeof createNormalizeAvatarHexColor, typeof createGetInventoryMetadataForItem, typeof createGetInventoryFilters, typeof createGetGlobalInteractionActionRuleGroups, typeof createGetCrudCellValueForWrite, typeof createGetConfig, typeof createGetAttributePresetMappedTarget, typeof createFindGachaColumnByKeywords,
  typeof createCreateDiceProfileTavernRegex, typeof createBuildCheckSuggestionGuide, typeof createParseJsoncDocument, typeof createOpenDatabaseVisualizerNewUiViaApi, typeof createNormalizeGachaMessageId, typeof createNormalizeDiceConfigBackupGachaCatalogSnapshotRecords, typeof createNormalizeCustomTableNameIconContext, typeof createMergeDiceConfigBackupRegexRules, typeof createIsQuickSelectTargetAvailable, typeof createHasDatabaseManualUpdateSurface,
  typeof createGetSuccessLevel, typeof createGetPanelDisplayMaxHeight, typeof createGetGachaReservedCustomFieldHeaders, typeof createGetGachaPoolDefinitions, typeof createGetDiffPreferredColumns, typeof createCreateUniqueGachaItemId, typeof createCollectGachaPoolTagsFromItems, typeof createCharacterNamesMatch, typeof createDiceConfigBackupPrivacyRiskText, typeof createShowDiceProfileApplyConfirm,
  typeof createShowDiceConfigBackupPrivacyConfirm, typeof createCustomTableNameIconSections, typeof createCustomTableNameIconModuleIds, typeof createCustomTableNameIconManagerSectionLabels, typeof createCustomTableNameIconManagerModuleLabels, typeof createNormalizeAdvancedPresetData, typeof createAcuDatabaseManualUpdateActionSelector, typeof createAcuDatabaseLegacyManualUpdateButtonSelector, typeof createAcuDatabaseManualUpdateButtonWaitMs, typeof createAcuDatabaseManualUpdateButtonPollMs,
  typeof createIsRecord, typeof createGetFloatingCollapsePosition, typeof createGetDiceConfigBackupWarningCount, typeof createGetDiceConfigBackupRegexRuleKey, typeof createGetDiceConfigBackupModuleDefinition, typeof createGetDiceConfigBackupKeyStrategy, typeof createGetDiceConfigBackupGachaItemNameKey, typeof createGetDiceConfigBackupGachaCatalogItemCount, typeof createGetDashboardModuleConfig, typeof createGetCustomTableNameIconManagerSectionLabel,
  typeof createGetCustomTableNameIconManagerModuleLabel, typeof createGetCustomTableNameIconManagerLocalKey, typeof createGetCustomGachaItemDefinitions, typeof createGetCrudTableIdentifier, typeof createGetAvailableGachaRewardTargets, typeof createGetAllDiceConfigBackupModuleIds, typeof createGetAdvancedPresetErrorMessage, typeof createWaitForDatabaseUiTick, typeof createSharedHistoryStore, typeof createScheduleDialogueIndentRender,
  typeof createSaveTableStyles, typeof createSaveTableOrder, typeof createSaveTableHeights, typeof createSaveStoredGachaStateSnapshot, typeof createSaveReverseTables, typeof createSaveOptionsCollapsedState, typeof createSaveHiddenTables, typeof createSaveCollapsedState, typeof createSaveActiveTabState, typeof createSameRow,
  typeof createGetAdvancedPresetDisplayOutcome, typeof createFormatGachaPoolTags, typeof createFormatGachaCatalogImportStatsText, typeof createCreateDiceProfileRuntimeId, typeof createCloneGachaPoolDefinitions, typeof createCloneGachaCatalogItems, typeof createCloseInventoryVisualization, typeof createClearPendingDeletions, typeof createClearModalStack, typeof createAcuDiceRollInstance,
  typeof createDashboardPresetFilterKeys, typeof createDashboardPresetAdditionalColumns, typeof createBuiltinTableTemplateRequirementPresets, typeof createSetGachaPoolOrder, typeof createSetGachaItemOrder, typeof createSaveInventoryFiltersCollapsedState, typeof createSaveDataOnly, typeof createSameHeaders, typeof createRenderOptionButtonHtml, typeof createRenderDiceConfigBackupWarningSlot,
  typeof createRenderDeprecatedBadge, typeof createRenderCheckSuggestionOptionButtonHtml, typeof createNormalizeGachaRewardTarget, typeof createIsUserPlaceholderKey, typeof createIsTwoDimensionalArray, typeof createIsRecordValue, typeof createIsGachaRarity, typeof createIsGachaPoolEnabled, typeof createIsGachaPickupItem, typeof createIsGachaItemEnabled,
  typeof createIsFloatingCollapseActive, typeof createIsDiceProfileCharacterSource, typeof createIsDiceConfigBackupRecord, typeof createIsDiceConfigBackupModuleId, typeof createIsDatabaseButtonDisabled, typeof createIsCustomTableNameIconSection, typeof createIsCustomTableNameIconModuleId, typeof createIsCrudRowIdMissing, typeof createIsCrudNullableEnumEmptyValue, typeof createIsBuiltinGachaPoolId,
  typeof createIsAttributeQuickSelectTarget, typeof createIsAdvancedPresetRecord, typeof createHasGachaCustomFields, typeof createHasDiceConfigBackupTableTemplateResource, typeof createHasAdvancedPresetFieldConfig, typeof createGetVisibleGachaPoolConfigDefinitions, typeof createGetTutorialButtonHtml, typeof createGetObjectRecord, typeof createGetGachaSettingsPoolItems, typeof createGetGachaRewardTargetTableLabel,
  typeof createGetGachaRewardTargetModuleName, typeof createGetGachaRewardTargetModuleKey, typeof createGetGachaRarityIconClass, typeof createGetGachaPoolDisplayName, typeof createGetGachaItemGrantQuantity, typeof createGetGachaItemDescriptionText, typeof createGetGachaCustomFieldEntries, typeof createGetGachaCatalogItemMergeTimestamp, typeof createFindRuntimeSheetEntryForMutation, typeof createFindGachaDefinitionByInventoryItem,
  typeof createExtractMetaCheckResultBlocks, typeof createExecuteFixedCheckSuggestion, typeof createDownloadDiceConfigBackupJson, typeof createCompareGachaItemDefinitionsForDisplay, typeof createCloneAcuDiceApiValue, typeof createClearGlobalInteractionOutsideCapture, typeof createCanDeleteGachaPoolDefinition, typeof createBuildStableGachaCustomItemId, typeof createAsDiffRecord, typeof createApplyPanelDisplayMaxHeight,
  typeof createAcuDiceHistoryInstance, typeof createNameAliasRegistryInstance, typeof createGachaEquipmentWrittenTargetColumnKeys, typeof createDefaultOutputTemplate, typeof createDashboardRelationshipGraphSourceModes, typeof createCustomRollMode, typeof createIsCustomTableNameIconImageUrlValid, typeof createGetCustomTableNameIconImageUrlValidationError, typeof createBindAcuDiceGachaRegexActions, typeof createWarnTableTemplateIssue,
  typeof createShouldShowReverseButton, typeof createSaveStoredGachaShardShopRarity, typeof createSaveStoredGachaActivePoolTag, typeof createSaveInventoryMetadataStore, typeof createSaveInventoryFilters, typeof createGetInventoryPanelTarget, typeof createSaveInventoryPanelTarget, typeof createSaveDiceProfileCollapsedSections, typeof createSaveCrazyModeConfig, typeof createResolveRuntimeMutationSource,
  typeof createRenderDiceConfigBackupExportBody, typeof createPushAdvancedPresetIssue, typeof createParseDashboardPresetJson, typeof createParseCrudColumnDefinitionLine, typeof createNotifyReady, typeof createMarkHumanInputActivity, typeof createIsTableReversed, typeof createIsLikelyAvatarSkinTone, typeof createIsDiceStatsScopeUnavailable, typeof createIsComplexCondition,
  typeof createHandleCustomTableNameIconImageDBPagehide, typeof createGetTemplateInspectionSeverityMeta, typeof createGetInventoryMetadataScopeKey, typeof createGetDisplayPlayerName, typeof createGetCustomTableNameIconManagerEntryAsset, typeof createGetAttributesForCharacter, typeof createGetAllGachaPoolConfigDefinitions, typeof createExtractCheckSuggestionTieRule, typeof createExtractCheckSuggestionTarget, typeof createExtractCheckSuggestionDiceFormula,
  typeof createErrorTableTemplateIssue, typeof createEmitEvent, typeof createDownloadJsoncFile, typeof createDownloadJsonFile, typeof createDownloadAiPromptFile, typeof createWarnMissingTableTarget, typeof createTruncateGachaText, typeof createTemplateTextIncludesAny, typeof createSetTextareaValueAndNotify, typeof createSerializeAcuDiceGachaItem,
  typeof createResolveCheckSuggestionCharacterName, typeof createReopenInventoryItemDetail, typeof createReadAdvancedPresetContextTags, typeof createQuoteSlashArgument, typeof createPatchLatestChatSheetWithoutTracking, typeof createNormalizeTemplateInspectText, typeof createNormalizeTableNameList, typeof createNormalizeStorableImageUrl, typeof createNormalizeSheetKeys, typeof createNormalizeGachaItemOrder,
  typeof createNormalizeCrudSqlComment, typeof createNormalizeAcuDiceGachaImportMode, typeof createIsPlayerTableName, typeof createIsGachaFieldAlias, typeof createIsDiffSheet, typeof createIsCustomTableNameIconSvgMimeType, typeof createHasSheetKeys, typeof createHasRuntimeTableReadApi, typeof createHasGachaRewardTable, typeof createGetStoredGachaShardShopRarity,
  typeof createGetStoredGachaActivePoolTag, typeof createGetInventoryMetadataStore, typeof createGetInventoryMetadataContextKey, typeof createGetGlobalInteractionRuleKeywords, typeof createGetGlobalInteractionCollapsedSections, typeof createGetGachaTargetColumnEntries, typeof createGetGachaRarityRank, typeof createGetGachaItemTagsText, typeof createGetGachaItemEffectText, typeof createGetGachaCustomFieldsSearchText,
  typeof createGetDiffSheetContent, typeof createGetDiffDataRow, typeof createGetDiceProfilePromptStates, typeof createGetDiceProfileModuleNames, typeof createGetDiceProfileIndex, typeof createGetDiceProfileCollapsedSections, typeof createGetDiceConfigBackupTableTemplateApi, typeof createGetDiceConfigBackupRecordString, typeof createGetDiceConfigBackupPresetRecordName, typeof createGetDiceConfigBackupPresetRecordId,
  typeof createGetCustomTableNameIconContextKey, typeof createGetAttributeValue, typeof createGetActiveGachaPoolTags, typeof createGetActiveDashboardRelationshipGraphSources, typeof createFormatGachaItemCardMeta, typeof createStripKnownSystemActionText, typeof createStripCrudSqlNonStructuralComments, typeof createShouldInferCrudRowIdFromVisibleIndex, typeof createSetDiffDataRow, typeof createScheduleCharacterDiceProfileDetection,
  typeof createSaveStoredGachaSettingsPoolTag, typeof createSaveInventoryMetadataRoot, typeof createRestoreCrudRowIdPreparation, typeof createResolveTextareaTextWithHiddenDice, typeof createResolveCanonicalCharacterName, typeof createResolveAttributeAliasName, typeof createReplaceTag, typeof createRemoveDiffDataRow, typeof createRememberAutoRegexTransform, typeof createReadTextareaVisibleValue,
  typeof createPushUniqueNameCandidate, typeof createNotifyTextareaValueChanged, typeof createNormalizePanelHeightValue, typeof createNormalizeGlobalInteractionHeader, typeof createNormalizeGlobalInteractionCategoryText, typeof createNormalizeGachaTargetTable, typeof createNormalizeCollapseStyle, typeof createNormalizeCheckSuggestionActionText, typeof createNormalizeAdvancedPresetNotes, typeof createIsSameSheetData,
  typeof createIsSameAttributeAlias, typeof createIsAdvancedPresetNumericLike, typeof createGetTotalGachaShards, typeof createGetStoredPanelHeight, typeof createGetStoredGachaSettingsPoolTag, typeof createGetStoredGachaCatalog, typeof createGetRuleTagSnippet, typeof createGetNormalQuickSelectInputSelector, typeof createGetJsonLikeErrorMessage, typeof createGetInventoryActionLabel,
  typeof createGetGachaRewardParseResultForItem, typeof createGetGachaRewardParseResult, typeof createGetGachaMinimumRarity, typeof createGetGachaItemCreatedAtMs, typeof createGetGachaCatalogRecordMergeTimestamp, typeof createGetGachaAllExpandablePoolTags, typeof createGetGachaActivePoolTag, typeof createGetDiceConfigBackupSafeCurrentPresets, typeof createGetDbChatMessages, typeof createGetDatabaseManualUpdateErrorMessage,
  typeof createGetCustomTableNameIconManagerSourceLabel, typeof createGetCrudSheetDdl, typeof createGetCrazyModeConfig, typeof createGetComposerTextarea, typeof createGachaStoreInstance, typeof createGachaStateCoreInstance, typeof createFormatGachaItemCreatedAt, typeof createFormatGachaCatalogImportErrors, typeof createFormatDiceConfigBackupSelectedModuleRiskLines, typeof createFindRuntimeSheetEntryForCrud,
  typeof createFindInventoryItemByRow, typeof createFindDiffSnapshotEntry, typeof createExportDiceProfile, typeof createEscapeCssString, typeof createDownloadDiceProfileJson, typeof createDeleteDiceProfileRecord, typeof createDebugGlobalInteraction, typeof createCreateEmptyGachaCatalog, typeof createCreateElementFromHtml, typeof createCreateDiceProfileTavernRegexReplaceString,
  typeof createCreateAutoRegexTransformKey, typeof createCollectGachaLocalStorageSnapshot, typeof createCollectDashboardNpcEntriesFromTableResults, typeof createClearPanelRequestedHeight, typeof createClampAvatarNumber, typeof createBuildCheckSuggestionInvalidCommandMessage, typeof createApplyGachaPityAfterDraw, typeof createApplyAttributeQuickSelectDefaults, typeof createAcuDicePresetsInstance, typeof createHumanInputTagBlockPatterns,
  typeof createGachaSettingsStatusFilterOptions, typeof createGachaSettingsSourceFilterOptions, typeof createDiceStatsScopeLabels, typeof createUpdateGachaShopProgressUi, typeof createSortGachaPoolDefinitions, typeof createShouldSkipAutoRegexTransform, typeof createSaveDiceProfileRecord, typeof createSaveConfig, typeof createPushDashboardNpcEntry, typeof createNormalizeInferredAvatarColor,
  typeof createNormalizeDashboardOptionalStringArray, typeof createNormalizeCheckSuggestionSideShorthand, typeof createNormalizeCharacterNameForCompare, typeof createJudgeCrazyRollResult, typeof createIsRenderableImageUrlValid, typeof createIsGachaTargetTableAliasMatch, typeof createGetStringLikeCellText, typeof createGetStableRowKeyForCrud, typeof createGetResolvedComposerText, typeof createGetLegacyGachaStateFromRawData,
  typeof createGetInventoryResult, typeof createGetInventoryActionPrompt, typeof createGetImageUrlValidationMessage, typeof createGetGachaRewardTargetOptions, typeof createGetGachaLocalDateKey, typeof createGetFixedWrapperParentMetrics, typeof createGetEquipmentResult, typeof createGetDiffSheetByKey, typeof createGetDiceProfileCharacterContext, typeof createGetCurrentChatAvatarNodes,
  typeof createGetCheckSuggestionPresetById, typeof createGetCheckSuggestionDiceSides, typeof createFormatGachaRecentRewardText, typeof createFormatGachaDuration, typeof createExtractExplicitHumanInputText, typeof createEvaluateConditionNumber, typeof createEnsureGachaPoolsForTags, typeof createEnsureGachaHeartbeat, typeof createDrawSingleGachaOutcome, typeof createCreateDiceProfileRegexId,
  typeof createConsumePendingHumanInputSnapshot, typeof createClearFixedAnchorResizeObserver, typeof createBuildGachaSettlementKey, typeof createAreAllTablesReversed, typeof createAddGachaShards, typeof createDefaultGachaSettingsItemFilters, typeof createDefaultContestOutputTemplate, typeof createCustomTableNameIconDeniedSections, typeof createCustomTableNameIconAllowedLocalMimeTypes, typeof createAcuDatabaseManualUpdateApiMethods,
  typeof createWithTableTemplateCheckHint, typeof createShouldTriggerCrazyMode, typeof createSetDiceConfigBackupValue, typeof createSerializeAcuDiceGachaDrawOutcome, typeof createSaveDiceProfileIndex, typeof createSaveCurrentDatabaseSnapshotAsReviewBaseline, typeof createSanitizeUiConfig, typeof createSanitizeDiceConfigBackupRuleList, typeof createResolveRootWindow, typeof createResolveDashboardGlobalInteractionSectionKind,
  typeof createRenderGlobalInteractionItemMark, typeof createRenderGachaItemIconContent, typeof createRenderDiceProfileTabPanel, typeof createRenderDiceConfigBackupWarningList, typeof createRecordGachaFortuneGain, typeof createReadTextFile, typeof createReadRuntimeTableDataReference, typeof createPatchLatestChatSheetCellWithoutTracking, typeof createParseCheckSuggestionPrimitiveValue, typeof createNormalizeGachaTimestamp,
  typeof createNormalizeCheckSuggestionDiceFormula, typeof createNormalizeAcuDiceGachaInteger, typeof createIsRuleTemplateSheetWithNote, typeof createIsElementVisibleInLayout, typeof createIsDiceConfigBackupSameValue, typeof createIsCustomTableNameIconTableDenied, typeof createIsCheckSuggestionOutcomeSuccess, typeof createGrantInventoryGachaReward, typeof createGrantEquipmentGachaReward, typeof createGrantGachaReward,
  typeof createGetStandardAttrs, typeof createGetRemoteImageUrlValidationError, typeof createGetInventoryActiveFilterCount, typeof createGetDiceProfileSourceLabel, typeof createGetDiceProfilePromptState, typeof createGetDiceConfigBackupValidationRuleKey, typeof createGetDiceConfigBackupSelectedModuleIdsFromDialog, typeof createGetDiceConfigBackupRuleRecords, typeof createGetCrudSqlTableName, typeof createGetCheckSuggestionMappedTarget,
  typeof createGetAvatarManualAliases, typeof createGetAllGachaItemDefinitions, typeof createEvaluateCheckSuggestionOutcome, typeof createDispatchReadyEvent, typeof createConsumeCrudWriteOptions, typeof createCloneRuntimeDataValue, typeof createBuildGlobalInteractionSearchText, typeof createBuildAttributeRulesContent, typeof createAssertCrudJsonFallbackAllowed, typeof createAddCrudColumnAlias,
  typeof createViewportBottomAnchorSelectors, typeof createInventoryTypeFilterMeta, typeof createInventorySortOptions, typeof createGlobalInteractionDefaultSectionMeta, typeof createFixedModeAnchorPriority, typeof createCustomTableNameIconDashboardModuleContexts, typeof createSafeUpdateAttribute, typeof createCanWriteMvuPanel, typeof createUpdateRuntimeDataCacheAfterCrud, typeof createUnwrapAdvancedPresetDocument,
  typeof createSelectCrazyRollType, typeof createSaveSnapshot, typeof createSaveGachaItemSettingsRecord, typeof createSafeEncodeURIComponent, typeof createSafeDecodeURIComponent, typeof createRgbToAvatarHex, typeof createResolveExistingTableName, typeof createResolveCustomTableNameIconManagerDirectSection, typeof createReplaceUserPlaceholders, typeof createRenderGlobalInteractionMapMark,
  typeof createRenderGlobalInteractionGenericMark, typeof createPushModal, typeof createPatchCrudSheetInRecord, typeof createOpenLegacyDatabaseSettings, typeof createNormalizeLeadingCheckSuggestionSideShorthand, typeof createNormalizeFloatingCollapsePosition, typeof createNormalizeDiceConfigBackupSelectedModuleIds, typeof createNormalizeAttributeQuickSelectConfig, typeof createNormalizeAttributeName, typeof createIsLikelyGlobalInteractionNameHeader,
  typeof createIsGachaItemOwned, typeof createIsDatabaseManualUpdateActionButton, typeof createHashGachaSeed, typeof createHashGachaCatalogSeed, typeof createHasDiceConfigBackupLocalImageReference, typeof createGetPanelDragStartHeight, typeof createGetNamedCheckParamText, typeof createGetLocationEmoji, typeof createGetLegacyInventoryMetadataRoot, typeof createGetInventoryDefaultMetaRecord,
  typeof createGetGlobalInteractionAvatarLookupNames, typeof createGetGachaCatalogImportFailureMessage, typeof createGetDiffRowDisplayTitle, typeof createGetCrudSqlCommentAliases, typeof createGetCrudColumnNameForHeader, typeof createGetCheckSuggestionOutcomeResultType, typeof createGetBadgeStyle, typeof createGetAttributeRangeBounds, typeof createGetActivePanelHeightKey, typeof createGetAccessibleDocument,
  typeof createFormatCssImageUrl, typeof createFindGachaDefinitionByItemId, typeof createDownloadDiceProfileTavernRegex, typeof createDefineAcuDiceOnWindow, typeof createDecodeCrudSqlIdentifier, typeof createCreateAdvancedPresetRollResult, typeof createCollectHostAndLocalNodes, typeof createClearAllPanelStates, typeof createAssertGachaRewardNameColumn, typeof createAssertAppendOnlyRows,
  typeof createApplyStoredPanelHeight, typeof createAcuDiceEventsInstance, typeof createAcuDiceCharactersInstance, typeof createCustomTableNameIconManagerDirectModuleBySection, typeof createCustomTableNameIconDeniedModules, typeof createActionButtons, typeof createCollectDiceConfigBackupGachaCatalogRecords, typeof createCloneAdvancedPresetFieldWithDefaults, typeof createCapturePendingHumanInputSnapshot, typeof createBindTutorialButtonsIn,
  typeof createInventoryQualityFilterMeta, typeof createCustomTableNameIconAllowedPanelSections, typeof createAcuDatabaseNewUiApiMethods, typeof createTouchGachaActivity, typeof createThrowAdvancedPresetValidationIssues, typeof createSetInventoryRowBasicFields, typeof createSetDiceProfilePromptState, typeof createSetActiveTableNavButton, typeof createSerializeAcuDiceGachaPool, typeof createSerializeAcuDiceGachaDrawResult,
  typeof createScheduleFloatingCollapseBoundsRefresh, typeof createSavePanelRequestedHeight, typeof createSaveInventoryMetadataRecord, typeof createResolveDashboardCustomTableNameIconContextInfo, typeof createResetPanelRequestedHeight, typeof createPushDiceQuickSelectCharacter, typeof createPopModal, typeof createParseSqlQuotedValues, typeof createParseImageUrl, typeof createParseCheckSuggestionModifierValue,
  typeof createOpenDatabaseInterface, typeof createGetViewportAnchorRect, typeof createGetGachaSettingsFilterLabel, typeof createGetCustomTableNameIconManagerInvalidSourceText, typeof createGetAttributeRulePresetById, typeof createGenerateAttributeValue, typeof createFindSillyTavernSlashRunner, typeof createFindRelationGraphColumnIndex, typeof createCreateBuiltinRenderPreset, typeof createCreateBuiltinDashboardPreset,
  typeof createCoerceAdvancedPresetContextNumber, typeof createAssignAdvancedPresetContextNumber, typeof createSettingsGroupTutorialMap, typeof createGachaSettingsSortOptions, typeof createGachaCommonWrittenTargetColumnKeys, typeof createDashboardModuleSectionKind, typeof createAssertRuntimeCrudApi, typeof createViewportBottomRefreshEvents, typeof createGachaTargetColumnLabels, typeof createGachaTargetColumnKeys,
  typeof createDiceConfigBackupActiveKeyToPresetKey, typeof createWeightedRandomSelect, typeof createUpdateGachaPoolTag, typeof createToDiceProfileSummary, typeof createScheduleViewportBoundsRefresh, typeof createScheduleFixedWrapperBoundsRefresh, typeof createSaveDiceConfig, typeof createResolveCheckSuggestionDefaultValue, typeof createRenderThemeIconContent, typeof createRefreshNameAliasesForCheckSuggestion,
  typeof createReadStoredTextareaDiceText, typeof createReadStoredLatestDiceText, typeof createParseRenderPresetAttributes, typeof createParseCheckSuggestionTieRule, typeof createNormalizeRenderPresetAliasMap, typeof createNormalizeDiceProfileModuleIds, typeof createNormalizeDashboardKeywordArray, typeof createIsUserCharacterName, typeof createIsPureIndexCell, typeof createHasDiceConfigBackupRecoverableStorage,
  typeof createGetRuntimeErrorMessage, typeof createGetRuntimeErrorLogPayload, typeof createGetRenderPresetBadgeStyle, typeof createGetMatchedGlobalInteractionRuleKeywords, typeof createGetGachaNamedCustomField, typeof createGetDiceProfileRecords, typeof createGetDiceConfigBackupModuleCountText, typeof createGetDiceConfigBackupAvailableModuleIds, typeof createGetAttributeEntryForCharacter, typeof createGenerateUniqueName,
  typeof createFormatGachaRelativeTime, typeof createFindLatestDbMessageIndex, typeof createFindGachaTargetColumnIndex, typeof createFindDashboardNpcNameColumnIndex, typeof createFindAttributeColumnIndices, typeof createDeleteGachaItemSetting, typeof createWithGachaItemSettings, typeof createWaitForDatabaseManualUpdateSurface, typeof createToggleTableReverse, typeof createSetDiffDataCell,
  typeof createSetAllTablesReverse, typeof createScheduleViewportInputTargetRefresh, typeof createScheduleFixedAnchorTargetRefresh, typeof createRefreshDiceProfileIndex, typeof createReadRuntimeTableData, typeof createPickFallbackAttributeColumn, typeof createPatchCrudRowIdIfMissing, typeof createParseAdvancedPresetSourceText, typeof createNormalizeDiceConfigBackupGachaPoolSettings, typeof createLoadSnapshot,
  typeof createLoadAvatarImageForColor, typeof createIsNumericCell, typeof createIsNpcLikeTableName, typeof createImportDiceProfile, typeof createHasGachaRewardTableForItem, typeof createGetPanelHostMessage, typeof createGetNavigationFontMetrics, typeof createGetGachaChatIdSeed, typeof createGetGachaCatalogItemsForExport, typeof createGetEmojiCandidates,
  typeof createGetDiceConfigBackupValueIdentity, typeof createGetDiceConfigBackupRestoreWarnings, typeof createGetAdvancedPresetMappedTarget, typeof createCreateDiffRowMatcher, typeof createCloseGachaVisualization, typeof createBuildTableTemplateRequirementPresetAgentPromptFilename, typeof createBuildRenderPresetAgentPromptFilename, typeof createBuildGachaInventoryMetaRecord, typeof createBuildGachaCatalogAgentPromptFilename, typeof createBuildDashboardPresetAgentPromptFilename,
  typeof createBuildAdvancedPresetAgentPromptFilename, typeof createBuildActionPresetAgentPromptFilename, typeof createStoreTextareaDiceCache, typeof createShowDatabaseManualUpdateFailure, typeof createSetupFloatingCollapseBoundsListeners, typeof createSetEquipmentRowBasicFields, typeof createRestoreDiceResultBeforeSend, typeof createResolveGlobalInteractionSectionMeta, typeof createResolveCustomTableNameIconAssetUrl, typeof createRefreshGachaPoolSelectionUi,
  typeof createMergeImportedGachaPools, typeof createGetInventoryMetadataRoot, typeof createGetInventoryDetailContext, typeof createGetFloatingViewportBounds, typeof createGetCurrentContextFingerprint, typeof createGetAvatarLookupNames, typeof createExportGachaCatalogJson, typeof createDownloadGachaCatalogJson, typeof createCompareVersion, typeof createClearFixedWrapperBoundsListeners,
  typeof createGlobalInteractionNonNameHeaderKeywords, typeof createSetupViewportInputMutationObserver, typeof createSetupFixedAnchorMutationObserver, typeof createRestoreDiceConfigBackupGachaCatalogSnapshot, typeof createResolveCheckSuggestionNumberParam, typeof createProcessTemplate, typeof createNormalizeImportedGachaPoolTags, typeof createNormalizeDiceConfigBackupGachaItemSettings, typeof createNormalizeCustomTableNameIconPackEntryMetadata, typeof createGetTableData,
  typeof createGetSheetKeyByTableName, typeof createGetDiceConfigBackupStoredValue, typeof createEnsureGachaCatalogLoaded, typeof createCreateDiceProfilePreApplySnapshot, typeof createCreateCustomTableNameIconContext, typeof createAcuDiceContest, typeof createDefaultDialogueIndentTagBlacklist, typeof createValidateGachaCustomFieldsForExistingRow, typeof createSyncCheckRuleTagsInTemplate, typeof createSaveStoredGachaCatalog,
  typeof createRenderGlobalInteractionAvatar, typeof createRenderCustomTableNameIconContent, typeof createRefreshGachaVisualization, typeof createRefreshFixedAnchorResizeObserver, typeof createOpenLegacyDatabaseVisualizer, typeof createNormalizeCustomTableNameIconPackEntry, typeof createGetTemplateInspectionSheets, typeof createGetGachaDiceEventDetail, typeof createGetDiceConfigBackupTableTemplateRollbackSnapshot, typeof createGetDashboardNpcListData,
  typeof createGetCustomTableNameIconManagerContextLabel, typeof createFindRelationshipGraphSourceTables, typeof createClosePanel, typeof createClearViewportInputTargetListeners, typeof createClearDiceLocalCacheData, typeof createBuildCrudRequiredHeaderSet, typeof createWaitForDatabaseNewUiManualUpdateButton, typeof createSettleGachaFortuneForDiceEvent, typeof createSetInventoryMetadataForItem, typeof createSaveGachaPoolSettings,
  typeof createRunMaybeAsyncDatabaseManualUpdate, typeof createRestoreGachaLocalStorageSnapshot, typeof createRenderInventoryMetadataHtml, typeof createRefreshInventoryVisualization, typeof createPersistRawDataWithGacha, typeof createDeleteRowInstantly, typeof createCheckSheetWriteLocks, typeof createBuildCheckSuggestionSideParams, typeof createApplyGachaTargetColumnOverrides, typeof createApplyGachaCustomFieldsToRow, typeof createSyncTextareaDiceCacheFromVisibleText,
  typeof createStripLoneSurrogates, typeof createRunDatabaseManualUpdateViaNewUiButton, typeof createResolveGachaTargetTableOverride, typeof createResolveEquipmentTableTypeForGachaItem, typeof createRenderInventoryFilterButtons, typeof createPickGachaItemDefinition, typeof createParseDiceProfileInput, typeof createIsDashboardRoleInSceneValue, typeof createGetOptionItemsFromTable, typeof createGetEquipmentColumnMap,
  typeof createGetDiffRowIdentityKeys, typeof createGetDiceConfigBackupModuleResourceCount, typeof createGetDiceConfigBackupKnownPresetIds, typeof createFindDeletionIndicesForCrud, typeof createFindComposerSendButton, typeof createCreateGlobalInteractionCustomTableNameIconContext, typeof createCollectCurrentChatAvatarNodes, typeof createBuildCrudLengthConstraintMap, typeof createBindGachaShardShopInteractions, typeof createAddClearButton,
  typeof createThemes, typeof createUpdateSingleAttribute, typeof createUpdateGachaPoolConfig, typeof createSaveCurrentDiceProfile, typeof createResolveCheckSuggestionFieldValue, typeof createRefreshViewportInputTargetListeners, typeof createPatchCrudSheetInMessage, typeof createNormalizeGachaPoolDefinition, typeof createNormalizeDiceProfileRecord, typeof createExtractAdvancedPresetJsonCandidates,
  typeof createClampFloatingCollapsePosition, typeof createAssertCrudRequiredCellValues, typeof createGlobalInteractionNameHeaders, typeof createValidateJsoncEditorConfig, typeof createShowTemplateInspectionModal, typeof createSanitizeDiceConfigBackupValidationRule, typeof createSanitizeDiceConfigBackupCustomOnlyPresetArrayForExport, typeof createReplaceCheckSuggestionConditionVars, typeof createParseAdvancedPresetText, typeof createOpenDatabaseFormFillPage,
  typeof createMergeDiceConfigBackupGachaItemSettings, typeof createImportGachaCatalogJsonFromFile, typeof createGetInventoryEnumOptions, typeof createGetInventoryColumnMap, typeof createGetGachaPickupItems, typeof createGetCrudRequiredColumnsByHeaderIndex, typeof createGetConfiguredGachaPoolDefinitions, typeof createCreateGlobalInteractionSections, typeof createCloneDashboardConfig, typeof createClearViewportBoundsListeners,
  typeof createBuildRowDataForCrud, typeof createMergeDiceConfigBackupValidationRules, typeof createMaybePromptCharacterDiceProfile, typeof createGetRuntimeWindowCandidates, typeof createAssertCrudRequiredColumnsRepresented, typeof createApplyDiceProfile, typeof createTakeDiffRowMatch, typeof createShowInventoryVisualization, typeof createSendTextViaComposer, typeof createRenderInterface,
  typeof createRenderGlobalInteractionsSection, typeof createRenderGachaSettingsPoolTabsHtml, typeof createRemapDiceConfigBackupGachaItemSettings, typeof createGetPersonaName, typeof createGetInventoryCharacters, typeof createGetIconForTableName, typeof createGetGachaItemDefinitionFingerprint, typeof createGetActionsForTable, typeof createFormatDiceConfigBackupPrivacyDetail, typeof createClearFloatingCollapseBoundsListeners,
  typeof createSyncHostRegenerateButtonVisibility, typeof createRenderDiceHistoryStatsHtml, typeof createGetGachaPoolDefinitionsWithVirtualTags, typeof createGetCheckSuggestionItemsFromTable, typeof createDetectCharacterDiceProfile, typeof createCreateCustomTableNameIconManagerCandidate, typeof createComposeTextareaTextWithHiddenDice, typeof createBuildCrudEnumConstraintMap, typeof createUpsertDiceProfileRecord, typeof createUpdateSaveButtonState,
  typeof createRunDatabaseManualUpdate, typeof createResolveGlobalInteractionRowTitle, typeof createRenderInlineQuickCheckButton, typeof createRemoveAcuDiceGachaCustomPool, typeof createRefreshDicePanelPresets, typeof createPrepareMvuTutorial, typeof createNormalizeRenderPresetTagFilterList, typeof createGetStoredGachaItemSettings, typeof createGetGachaItemCustomTableNameIconContext, typeof createGetFullAttributesForCharacter,
  typeof createGetCrudUnsupportedFallbackConstraintText, typeof createRefreshAutoImageColorForAvatar, typeof createProcessJsonData, typeof createNormalizeDiceConfigBackupGachaCatalogResourceRecord, typeof createImportAcuDiceGachaCatalog, typeof createGetUserAvatarUrl, typeof createGetCore, typeof createUpdateChangesCount, typeof createSerializeGachaCatalogItemForExport, typeof createRenderGachaSettingsPoolViewerHtml,
  typeof createIsCustomTableNameIconContextAllowed, typeof createHslToAvatarHex, typeof createClearGlobalGachaCatalog, typeof createBuildGachaDiceEventSettlementKey, typeof createSetupViewportBoundsListeners, typeof createSettleGachaFortuneForMessage, typeof createRestoreDiceConfigBackupTableTemplateRollbackSnapshot, typeof createPrepareSettingsGroupTutorial, typeof createClearDiceSystemCache, typeof createBindHumanInputTracking,
  typeof createValidateAdvancedPresetAgentTests, typeof createSetupFixedWrapperBoundsListeners, typeof createPickGachaRarity, typeof createNormalizeCustomTableNameIconEntry, typeof createMergeDiceConfigBackupCustomRules, typeof createHydrateGlobalInteractionAvatars, typeof createCollectDiceProfileRegexScriptsFromRecord, typeof createBuildGachaTableResultFromSheet, typeof createAddStyles, typeof createSetupOverlayClose,
  typeof createRestoreDiceConfigBackupModuleResources, typeof createRenderGachaPickupHtml, typeof createPrepareAvatarManagerTutorial, typeof createNormalizeCheckSuggestionCommandInput, typeof createGetViewportBottomOffset, typeof createFormatOutputTemplate, typeof createSaveSheetsViaJsonFloorWithoutTracking, typeof createRenderGlobalInteractionRowCard, typeof createParseAttributeString, typeof createMergeDiceConfigBackupGachaPoolSettings,
  typeof createAssertCrudLengthConstraints, typeof createAssertCrudEnumConstraints, typeof createSaveCurrentTabState, typeof createRemoveAcuDiceGachaCustomItem, typeof createFlushGachaHeartbeatProgress, typeof createEvaluateOutcomes, typeof createCloneDashboardPresetModules, typeof createBuildCheckValueText, typeof createApplyAdvancedPresetOutcomePolicy, typeof createValidateAdvancedPresetTemplates,
  typeof createSelectCrazyAttribute, typeof createRestoreDiceConfigBackupTableTemplate, typeof createResolveBatchLocationEmojis, typeof createRenderGachaCustomFieldsDetailsHtml, typeof createNormalizeCheckSuggestionParams, typeof createGetDiceConfigBackupModuleWarnings, typeof createCreateDashboardPresetModulesFromConfig, typeof createConvertTavernRegexToRule, typeof createUpsertAcuDiceGachaPool, typeof createRunDatabaseManualUpdateViaApi,
  typeof createRenderGachaCustomFieldsPreviewHtml, typeof createDefaultRenderPresetRules, typeof createValidateAdvancedPresetFieldConfig, typeof createRenderGachaFortuneProgressHtml, typeof createRenderDiceConfigBackupRestoreBody, typeof createPickTextFile, typeof createNormalizeAdvancedPresetAgentTests, typeof createMigrateGachaCatalogRecordsToGlobalScope, typeof createHydrateCustomTableNameIconsIn, typeof createGetGachaChatMessageText,
  typeof createClearGachaFortune, typeof createBuildAutoCheckSuggestionGuide, typeof createValidateAdvancedPresetDicePatches, typeof createValidateAdvancedPreset, typeof createShowEditDialog, typeof createPatchCrudSheetCellInMessage, typeof createParseRelationshipString, typeof createGetFixedModeAnchorRect, typeof createCollectDashboardNpcEntriesFromRelationshipSources, typeof createBuildGlobalInteractionGroups,
  typeof createGetGMConfig, typeof createBuildCustomTableNameIconPackEntry, typeof createAnalyzeGachaCatalogImport, typeof createSyncInventoryMetadataForRawData, typeof createSanitizeRuntimeTableData, typeof createRenderDiceProfileSummaryRow, typeof createApplyJsonCellFallbackForCrud, typeof createStripJsoncSyntax, typeof createResolveUserGraphName, typeof createGetCustomTableNameIconFallbackContexts,
  typeof createCopyTextWithTavernApi, typeof createBuildNewActionPresetRulesJsoncTemplate, typeof createValidateAdvancedPresetCustomFields, typeof createReplaceRuleTagInTemplate, typeof createGenerateAttributeScale, typeof createSwitchPanel, typeof createRenderDiceConfigBackupModuleRows, typeof createGetDiceQuickSelectCharacterList, typeof createValidateGachaCustomFieldsForTargetTable, typeof createUpdateGachaFortuneProgressDom,
  typeof createStartTutorialFromButton, typeof createShowDiceCharacterProfilePrompt, typeof createValidateGachaCatalogImportItemTarget, typeof createRenderGachaSettingsFilterMenuHtml, typeof createGetCharacterNameCandidates, typeof createApplyRuntimeDataViaCrud, typeof createApplyDiceConfigBackupActiveValue, typeof createInferAvatarImageColor, typeof createShowPresetConflictDialog, typeof createBuildNewAttributePresetJsoncTemplate,
  typeof createRenderDiceProfileApplyConfirmDetailHtml, typeof createRenderGlobalInteractionsPanel, typeof createApplyAsyncImageUrlToElement, typeof createFindRowIndexByPrimaryKey, typeof createNormalizeImportedGachaPools, typeof createNormalizeDiceConfigBackupGachaCatalogItems, typeof createRenderGachaPoolSettingsListHtml, typeof createBuildRelationshipGraphTableFromPreset, typeof createResolveCustomTableNameIcon, typeof createCollectAccessibleRuntimeWindows,
  typeof createMergeDiceConfigBackupGachaCatalogItems, typeof createBuildDiceConfigBackup, typeof createNormalizeDashboardRelationshipGraphConfig, typeof createGetDiceStatsContext, typeof createAppendRowInstantly, typeof createGetGachaFortuneProgressView, typeof createCollectDashboardNpcEntriesFromTableResult, typeof createStripJsonComments, typeof createFindCharacterAttributeRow, typeof createPrepareCrudRowIdForUpdateCell,
  typeof createSyncDiceConfigBackupRuntimeAfterRestore, typeof createUpdateFloatingCollapseBounds, typeof createChangeAcuDiceGachaFortune, typeof createCreateRenderPresetEditorTemplate, typeof createCreateDashboardPresetEditorTemplate, typeof createBuildNewAdvancedPresetJsoncTemplate, typeof createMergeDiceConfigBackupPresetArray, typeof createValidateAdvancedPresetContestRule, typeof createValidateAdvancedPresetOutcomePolicy, typeof createValidateAdvancedPresetOutcomes,
  typeof createBuildAdvancedPresetEvaluationContext, typeof createNormalizeDashboardPresetFilters, typeof createGetDashboardRuntimeConfig, typeof createRestoreDiceConfigBackupGachaCatalogRecords, typeof createGetDiceConfigBackupModuleResourceShapeWarnings, typeof createCountRuntimeDataChanges, typeof createParseCheckSuggestionCommand, typeof createExecuteCheckSuggestionCommand, typeof createBuildCheckSuggestionPresetSide, typeof createResolveCheckSuggestionContestWinner,
  typeof createExecuteAdvancedContestCheckSuggestion, typeof createShowDiceSystemInputDialog, typeof createShowCardEditModal, typeof createShowFavoriteEditModal, typeof createShowDiceSystemConfirmDialog, typeof createShowManualUpdateDialog, typeof createExecuteTableInteractionAction, typeof createNormalizeImportedGachaItem, typeof createShowAvatarManager, typeof createExecuteSecondaryEffectsChain,
  typeof createRenderGachaSettingsPoolItemsHtml, typeof createBuildGachaCatalogTemplateJsonc, typeof createApplyGachaCatalogImport, typeof createInferEquipmentTableTypeForGachaItem, typeof createBindFloatingCollapseDrag, typeof createFindTemplateRequirementSheet, typeof createInspectTableTemplate, typeof createRepairCurrentTableTemplateFromPreset, typeof createNormalizeDashboardPresetModules, typeof createRelocateDbPayloadToAnchor,
  typeof createBuildNewTableTemplateRequirementPresetJsoncTemplate, typeof createGetCustomTableNameIconManagerCandidates, typeof createAnalyzeCustomTableNameIconPackImport, typeof createResolveCustomTableNameIconRowName, typeof createShowTableTemplateRequirementPresetManager, typeof createShowTableTemplateRequirementPresetEditor, typeof createRenderDataCardCellContent, typeof createApplyExistingRowCellPatchesViaCrud, typeof createMergeDiceConfigBackupCustomOnlyPresetArray, typeof createNormalizeRenderPresetRules,
  typeof createMergeDiceConfigBackupPresetArraySafely, typeof createDeleteGachaPoolConfig, typeof createAcuDiceAPI, typeof createUpdateTemplateForActivePreset, typeof createShowTemplateInspectionResultModal, typeof createUpdateTemplateForActiveCheckPreset, typeof createApplyDiceConfigBackup, typeof TABLE_NAV_SPECIAL_KEYS, typeof createBuildDiceConfigBackupTableOrder, typeof createMaybeRefreshReviewBaselineAtFillStart,
  typeof createApplyDiceConfigBackupValue, typeof createWriteAttributesToCharacter, typeof createParseDiceConfigBackup, typeof createBindGlobalInteractionEvents, typeof createShowDiceConfigBackupDialog, typeof createShowInventoryDetailMenu, typeof createRenderFavoritesPanel, typeof createShowSendToTableModal, typeof createMergeGachaCatalogRecordsToGlobalScope, typeof createGetTavernHostWindow,
  typeof createSendChatTextAndTrigger, typeof createSaveRowInstantly, typeof createRenderDiceProfileManagerBody, typeof createShowTagInputModal, typeof createShowNewFavoriteModal, typeof createGetDiceProfileCurrentCharacterRecords, typeof createStripCrudSqlComments, typeof createStripCrudSqlBlockComments, typeof createCloneRenderPresetRules, typeof createBindCompositionSafeSearchInput,
  typeof createRenderInterfaceImpl, typeof createInit, typeof createBindEvents, typeof createShowDicePanel, typeof createShowSettingsModal, typeof createShowContestPanel, typeof createShowRelationshipGraph, typeof createBindChangesEvents, typeof createShowCellMenu, typeof createRenderChangesPanel,
  typeof createRenderTableContent, typeof createRenderDashboard, typeof createInitCustomDropdown, typeof createApplyConfigStyles, typeof createGetRandomSkillPool, typeof createDetectVisualizerConflict, typeof createGenerateRPGAttributes, typeof createSaveDataToDatabase, typeof createBindOptionEvents, typeof createInterceptTextareaValue,
  typeof createGenerateDiffMap, typeof createClearPresetAttributesForCharacter, typeof createSelectCrazyParticipant, typeof createInjectIndependentOptions, typeof createEvaluateFormula, typeof createDismantleInventoryItem, typeof createDismantleEquipmentItem, typeof createParseEquipmentItems, typeof createParseInventoryItems, typeof createHandleInventoryAction,
  typeof createSaveInventoryFieldValue, typeof createGetInteractOptionsForRow, typeof createExchangeGachaShardItem, typeof createShowInventoryMetaEditDialog, typeof createExecuteNormalCheckSuggestion, typeof createRefreshRegexRulesList, typeof createRenderGachaShardShopHtml, typeof createRenderGachaPanelHtml, typeof createPerformGachaDraw, typeof createGenerateCrazyRoll,
  typeof createCrazyRollWithPreset, typeof createRenderOptionTableContent, typeof createRenderCheckSuggestionTableContent, typeof createApplySheetDataViaCrud, typeof createInsertHtmlToPage, typeof createShowDiceSettingsPanel, typeof createShowAddRegexRuleModal, typeof createShowAvatarCropModal, typeof createShowImportConfirmDialog, typeof createUpdateViewportWrapperBounds,
  typeof createUpdateFixedWrapperBounds, typeof createExecuteAdvancedCheckSuggestion, typeof createExecuteContestCheckSuggestion, typeof createShowInventoryGiftDialog, typeof createRenderInventoryVisualization, typeof createShowInventoryItemDetail, typeof createShowInventoryFieldEditDialog, typeof createShowChangeEditModal, typeof createShowRowCompareEditModal, typeof createShowChangeSingleFieldModal,
  typeof createToggleOrderEditMode, typeof ConsoleCaptureManager, typeof advancedPresetAgentPromptTemplate, typeof dashboardPresetAgentPromptTemplate, typeof attributePresetAgentPromptTemplate, typeof actionPresetAgentPromptTemplate, typeof renderPresetAgentPromptTemplate, typeof gachaCatalogAgentPromptTemplate, typeof tableTemplateRequirementPresetAgentPromptTemplate, typeof defaultTableTemplateRequirementRaw,
  typeof GachaCatalogDB, typeof GachaStore, typeof GachaStateCore, typeof ATTRIBUTE_QUICK_SELECT_DEFAULT, typeof BUILTIN_ADVANCED_PRESETS, typeof BUILTIN_VALIDATION_RULES, typeof RANDOM_SKILL_POOL, typeof DASHBOARD_TABLE_CONFIG, typeof TEMPLATE_TABLE_REQUIREMENTS, typeof BUILTIN_ATTRIBUTE_PRESETS,
  typeof BUILTIN_ACTION_PRESETS, typeof GLOBAL_INTERACTION_SECTION_METAS, typeof BUILTIN_REGEX_RULES, typeof ACTION_ICON_MAP, typeof DICE_CONFIG_BACKUP_MODULES, typeof DICE_CONFIG_BACKUP_KEY_STRATEGIES, typeof DATA_VALIDATION_DEPRECATED_META, typeof ELEMENT_EMOJI_MAP, typeof LOCATION_EMOJI_MAP, typeof RELATION_ICON_MAP,
  typeof TUTORIAL_SCOPE_LIST, typeof createTutorialModule, typeof createDialogueIndentRenderer, typeof normalizeDialogueIndentStrategy, typeof rollDiceExpression, typeof rollComplexDiceExpression, typeof Store, typeof STORAGE_KEY_LAST_SNAPSHOT, typeof createNormalizeDiffText, typeof normalizeDiffHeader,
  typeof createNormalizeDatabaseUiText, typeof isDatabaseManualUpdateButtonText, typeof createSerializeGachaPoolDefinitionForExport, typeof buildGachaExportNamePart, typeof createNormalizeTrackedText, typeof escapeRegExpLiteral, typeof createBuildCustomTableNameIconPack, typeof getCustomTableNameIconPackDownloadFileName, typeof DEFAULT_GM_CONFIG, typeof DEFAULT_CONFIG,
  typeof DEFAULT_DICE_CONFIG, typeof DEFAULT_VIRTUAL_PRESET, typeof DEFAULT_CRAZY_MODE_CONFIG, typeof DEFAULT_SPECIAL_ATTR_TEMPLATE, typeof RULE_TYPE_INFO, typeof INVENTORY_QUALITY_ORDER, typeof computeEffectVariables, typeof computePendingEffectVariables, typeof parseEffectValueInput, typeof buildEffectMetaLines,
  typeof buildEffectTraceLines, typeof alignAndFixPairedTables, typeof isValueInRelationTable, typeof getRelationOptions, typeof getColumnExamples, typeof getRowKey, typeof getNearestValidNumber, typeof extractCodesFromTable, typeof buildCodeMapping, typeof suggestFormatValue,
  typeof parseTavernFindRegex, typeof getDbLockAPI, typeof NameAliasRegistryCore, typeof parseCharacterName, typeof getDisplayName, typeof findNameColumnIndex, typeof findExplicitAttributeTableNameColumnIndex, typeof getRowDisplayName, typeof isCharacterTable, typeof CHARACTER_NAME_COLUMN_KEYS,
  typeof ATTRIBUTE_TABLE_NAME_COLUMN_KEYS, typeof SCRIPT_ID, typeof DICE_ROOT_CLASS, typeof DICE_ROOT_SELECTOR, typeof HOST_REGENERATE_HIDDEN_CLASS, typeof HOST_REGENERATE_BUTTON_SELECTOR, typeof PRIMARY_KEYS, typeof PRESET_FORMAT_VERSION, typeof SCRIPT_VERSION, typeof isNpcTableName,
  typeof DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID, typeof TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT, typeof buildTableTemplateAppendRepairPlan, typeof cloneTemplateValue, typeof createBuiltinTableTemplateRequirementPreset, typeof exportTableTemplateRequirementPreset, typeof getRequirementInspectionSheets, typeof inspectTableTemplateWithPreset, typeof normalizeTableTemplateRequirementPreset, typeof BUILTIN_GACHA_POOL_DEFINITIONS,
  typeof GACHA_CATALOG_EXPORT_KIND, typeof GACHA_CATALOG_VERSION, typeof FORTUNE_CURRENCY_NAME, typeof GACHA_ACTIVE_HEARTBEAT_MS, typeof GACHA_ACTIVE_SECONDS_PER_FORTUNE, typeof GACHA_CHECK_REWARD, typeof GACHA_CHARS_PER_FORTUNE, typeof GACHA_DRAW_COST_SINGLE, typeof GACHA_DRAW_COST_TEN, typeof GACHA_ITEM_DEFINITIONS,
  typeof GACHA_LEGEND_PITY_THRESHOLD, typeof GACHA_MESSAGE_REWARD, typeof GACHA_POOL_TAGS, typeof GACHA_RARE_PITY_THRESHOLD, typeof GACHA_RARITY_ORDER, typeof GACHA_RARITY_WEIGHTS, typeof GACHA_RECENT_REWARD_LIMIT, typeof GACHA_REWARD_TARGETS, typeof GACHA_SHARD_VALUES, typeof GACHA_UNIQUE_RARITY,
  typeof ACU_DICE_PROFILE_FORMAT, typeof computeAcuDiceProfileFingerprint, typeof createAcuDiceProfileMarker, typeof decodeAcuDiceProfileMarkerPayload, typeof extractAcuDiceProfileMarkerPayloads, typeof getAcuDiceProfilePromptKey, typeof getAcuDiceProfileSourceKey, typeof normalizeAcuDiceProfilePackage, typeof normalizeAcuDiceProfileSource, typeof createEmptyShardWallet,
  typeof GACHA_DUPLICATE_REROLL_LIMIT, typeof GACHA_PICKUP_WEIGHT_MULTIPLIER, typeof GACHA_PICKUP_CHAT_DEPTH_BUCKET, typeof GACHA_PICKUP_RARITIES, typeof GACHA_PICKUP_FALLBACK_LIMIT, typeof GACHA_ALL_POOL_TAG, typeof GACHA_CUSTOM_ONLY_POOL_TAG, typeof GACHA_REWARD_FIELD_LIMITS, typeof normalizeGachaPoolId, typeof normalizeGachaPoolName,
  typeof cloneGachaState, typeof getGachaStateBalanceScore, typeof mergeLegacyGachaStateForLocalStorage, typeof STORAGE_KEY_ACTION_ORDER, typeof STORAGE_KEY_ACTION_PRESETS, typeof STORAGE_KEY_ACTIVE_ACTION_PRESET, typeof STORAGE_KEY_ACTIVE_ADVANCED_PRESET, typeof STORAGE_KEY_ACTIVE_ATTR_PRESET, typeof STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, typeof STORAGE_KEY_ACTIVE_PRESET,
  typeof STORAGE_KEY_ACTIVE_RENDER_PRESET, typeof STORAGE_KEY_ACTIVE_TAB, typeof STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET, typeof STORAGE_KEY_ADVANCED_PRESETS, typeof STORAGE_KEY_ATTRIBUTE_PRESETS, typeof STORAGE_KEY_AVATAR_MAP, typeof STORAGE_KEY_BLACKLIST, typeof STORAGE_KEY_BUILTIN_PRESET_ORDER, typeof STORAGE_KEY_BUILTIN_PRESET_VISIBILITY, typeof STORAGE_KEY_CRAZY_MODE,
  typeof STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, typeof STORAGE_KEY_DASHBOARD_ACTIVE, typeof STORAGE_KEY_DASHBOARD_PRESETS, typeof STORAGE_KEY_DICE_CONFIG, typeof STORAGE_KEY_GACHA_ACTIVE_POOL_TAG, typeof STORAGE_KEY_GACHA_ITEM_SETTINGS, typeof STORAGE_KEY_GACHA_POOL_SETTINGS, typeof STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, typeof STORAGE_KEY_GACHA_SHARD_SHOP_RARITY, typeof STORAGE_KEY_GACHA_STATE,
  typeof STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, typeof STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS, typeof STORAGE_KEY_GM_CONFIG, typeof STORAGE_KEY_HIDDEN_TABLES, typeof STORAGE_KEY_INVENTORY_FILTERS, typeof STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED, typeof STORAGE_KEY_INVENTORY_METADATA, typeof STORAGE_KEY_IS_COLLAPSED, typeof STORAGE_KEY_LAST_PRESET, typeof STORAGE_KEY_MAP_FOCUS,
  typeof STORAGE_KEY_OPTIONS_COLLAPSED, typeof STORAGE_KEY_PRESETS, typeof STORAGE_KEY_REGEX_ACTIVE_PRESET, typeof STORAGE_KEY_REGEX_ENABLED, typeof STORAGE_KEY_REGEX_PRESETS, typeof STORAGE_KEY_REGEX_RULES, typeof STORAGE_KEY_RENDER_PRESETS, typeof STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED, typeof STORAGE_KEY_REVERSE_TABLES, typeof STORAGE_KEY_SCROLL,
  typeof STORAGE_KEY_TABLE_HEIGHTS, typeof STORAGE_KEY_TABLE_ORDER, typeof STORAGE_KEY_TABLE_STYLES, typeof STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS, typeof STORAGE_KEY_UI_CONFIG, typeof STORAGE_KEY_VALIDATION_ENABLED, typeof STORAGE_KEY_VALIDATION_MODE, typeof STORAGE_KEY_VALIDATION_RULES,
];
