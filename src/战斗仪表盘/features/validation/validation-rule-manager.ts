/**
 * validation-rule-manager.ts
 * Feature-Sliced: features 层模块（工厂版，DI 注入依赖）。
 */

import { Store } from '../../shared/storage/store';

export function createValidationRuleManager(deps: any) {
  const ValidationRuleManager = {
    _cache: null,
    _enabledCache: null as any,

    // 获取所有规则（从当前激活预设）
    getAllRules() {
      if (this._cache) return this._cache;

      const preset = deps.getPresetManager().getActivePreset();
      const enabledStates = this.getEnabledStates() as Record<string, any>;

      // 应用启用状态
      const allRules = (preset?.rules || []).map((rule: any) => ({
        ...rule,
        enabled: enabledStates[rule.id] !== undefined ? enabledStates[rule.id] : rule.enabled,
      }));

      this._cache = allRules;
      return allRules;
    },

    // 获取启用状态映射
    getEnabledStates() {
      if (this._enabledCache) return this._enabledCache;
      this._enabledCache = Store.get(deps.STORAGE_KEY_VALIDATION_ENABLED, {});
      return this._enabledCache;
    },

    // 切换规则启用状态
    toggleRuleEnabled(ruleId: any, enabled: any) {
      const states = this.getEnabledStates() as Record<string, any>;
      states[ruleId] = enabled;
      Store.set(deps.STORAGE_KEY_VALIDATION_ENABLED, states);
      this._enabledCache = states;
      this._cache = null; // 清除缓存以便下次重新计算
    },

    // 切换规则拦截状态
    toggleRuleIntercept(ruleId: any, intercept: any) {
      const preset = deps.getPresetManager().getActivePreset();
      if (!preset) return false;

      const rule = preset.rules.find((r: any) => r.id === ruleId);
      if (!rule) return false;

      rule.intercept = intercept;
      deps.getPresetManager().updatePresetRules(preset.id, preset.rules);
      return true;
    },

    // 获取启用的规则
    getEnabledRules() {
      return this.getAllRules().filter((rule: any) => rule.enabled);
    },

    // 添加自定义规则（到当前激活预设）
    addCustomRule(rule: any) {
      if (!rule.id || !rule.name || !rule.targetTable) {
        console.error('[DICE]ValidationRuleManager 规则缺少必要字段');
        return false;
      }

      const preset = deps.getPresetManager().getActivePreset();
      if (!preset) return false;

      // 检查 ID 是否重复
      if (preset.rules.some((r: any) => r.id === rule.id)) {
        console.error('[DICE]ValidationRuleManager 规则 ID 已存在:', rule.id);
        return false;
      }

      const newRule = { ...rule, builtin: false, enabled: true };
      preset.rules.push(newRule);
      deps.getPresetManager().updatePresetRules(preset.id, preset.rules);
      console.log('[DICE]ValidationRuleManager 添加规则:', newRule.name);
      return true;
    },

    // 删除规则
    removeCustomRule(ruleId: any) {
      const preset = deps.getPresetManager().getActivePreset();
      if (!preset) return false;

      const index = preset.rules.findIndex((r: any) => r.id === ruleId);
      if (index === -1) return false;

      preset.rules.splice(index, 1);
      deps.getPresetManager().updatePresetRules(preset.id, preset.rules);

      // 清理启用状态
      const states = this.getEnabledStates() as Record<string, any>;
      delete states[ruleId];
      Store.set(deps.STORAGE_KEY_VALIDATION_ENABLED, states);
      this._enabledCache = states;

      console.log('[DICE]ValidationRuleManager 删除规则:', ruleId);
      return true;
    },

    // 更新规则
    updateCustomRule(ruleId: any, updates: any) {
      const preset = deps.getPresetManager().getActivePreset();
      if (!preset) return false;

      const index = preset.rules.findIndex((r: any) => r.id === ruleId);
      if (index === -1) return false;

      preset.rules[index] = { ...preset.rules[index], ...updates, id: ruleId };
      deps.getPresetManager().updatePresetRules(preset.id, preset.rules);
      return true;
    },

    // 获取单个规则
    getRule(ruleId: any) {
      return this.getAllRules().find((r: any) => r.id === ruleId);
    },

    // 清除缓存
    clearCache() {
      this._cache = null;
      this._enabledCache = null;
    },

    // 获取按表名分组的规则
    getRulesByTable(tableName: any) {
      return this.getEnabledRules().filter(
        (rule: any) => rule.targetTable === tableName || (deps.isNpcTableName(rule.targetTable) && deps.isNpcTableName(tableName)),
      );
    },
  };


  return ValidationRuleManager;
}
