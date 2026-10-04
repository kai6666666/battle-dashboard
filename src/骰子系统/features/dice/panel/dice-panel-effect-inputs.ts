// @child-factory（由父模块 show-dice-panel 实例化，不参与 index 接线审计）
/**
 * dice-panel-effect-inputs.ts
 * 从 show-dice-panel.ts 拆出：字段配置 / 选择器匹配 / 效果输入区渲染。
 */
export function createDicePanelEffectInputs(deps: any) {
    const applyFieldConfig = function (
      $input: JQuery,
      $label: JQuery,
      config: FieldConfig | undefined,
      defaults: { label: string; placeholder: string },
    ) {
      // 获取包含label和input的wrapper div
      // 实际DOM结构: <div> <label/> <div.acu-input-wrapper> <input/> </div> </div>
      // 所以需要找到label的父元素（同时也是input-wrapper的父元素）
      const $wrapper = $label.parent();

      if (config?.hidden) {
        $wrapper.hide();
        return;
      }

      $wrapper.show();
      $input.attr('placeholder', config?.placeholder || defaults.placeholder).prop('readonly', false);
      $label.text(config?.label || defaults.label);
    };

    /**
     * [新增] 检查属性名是否匹配 CheckSelector
     * @param attrName - 当前检定的属性名
     * @param selector - 选择器配置
     * @returns 是否匹配（true=可用，false=不可用）
     */
    const matchesCheckSelector = (attrName: string, selector?: CheckSelector): boolean => {
      // 如果没有定义 selector，默认匹配所有
      if (!selector) return true;

      const normalizedName = attrName.trim().toLowerCase();

      // 辅助函数：将通配符模式转换为正则表达式
      const wildcardToRegex = (pattern: string): RegExp => {
        const escaped = pattern
          .replace(/[.+^${}()|[\]\\]/g, '\\$&') // 转义特殊字符
          .replace(/\*/g, '.*') // * -> .*
          .replace(/\?/g, '.'); // ? -> .
        return new RegExp(`^${escaped}$`, 'i');
      };

      // 辅助函数：检查名称是否匹配任一模式
      const matchesAnyPattern = (name: string, patterns: string[]): boolean => {
        return patterns.some(pattern => {
          const regex = wildcardToRegex(pattern);
          return regex.test(name);
        });
      };

      // 1. 检查 namePatterns.exclude（优先于 include）
      if (selector.namePatterns?.exclude && selector.namePatterns.exclude.length > 0) {
        if (matchesAnyPattern(normalizedName, selector.namePatterns.exclude)) {
          return false; // 被排除
        }
      }

      // 2. 检查 namePatterns.include
      if (selector.namePatterns?.include && selector.namePatterns.include.length > 0) {
        // 如果定义了 include 且不为 ['*']，需要匹配
        const isWildcardOnly = selector.namePatterns.include.length === 1 && selector.namePatterns.include[0] === '*';
        if (!isWildcardOnly && !matchesAnyPattern(normalizedName, selector.namePatterns.include)) {
          return false; // 未被包含
        }
      }

      // 3. 检查 tags（暂时跳过，因为当前掷骰上下文可能没有 tags 元数据）
      // 未来可以扩展支持 tags.include/exclude

      return true;
    };

    // [新增] 渲染效果输入区域
    const renderEffectInputs = (preset: AdvancedDicePreset, attrName: string): string[] => {
      if (!preset.effectsConfig) return [];

      // 检查触发模式
      const isMatched = matchesCheckSelector(attrName, {
        namePatterns: { include: preset.effectsConfig.triggerPatterns },
      });

      if (!isMatched) return [];

      const items: string[] = [];

      // 从 preset.outcomes 中查找有效果的结果等级，生成输入框
      // 注意：效果定义在 preset.outcomes[].effects 中，不是 effectsConfig.outcomes
      if (preset.outcomes && Array.isArray(preset.outcomes)) {
        const outcomesWithEffects = preset.outcomes.filter(outcome => outcome.effects && outcome.effects.length > 0);

        outcomesWithEffects.forEach(outcome => {
          // 获取该结果等级的默认值（从 effectsConfig.defaultValues 或 effects[0].value）
          const defaultVal =
            preset.effectsConfig?.defaultValues?.[outcome.name] || (outcome.effects && outcome.effects[0]?.value) || '';
          const label = outcome.name; // 使用结果名作为标签

          items.push(`
            <div class="acu-effect-input-group">
              <div class="acu-effect-input-label">
                <span>${deps.escapeHtml(label)}效果</span>
                <span class="acu-effect-preview-text" id="effect-preview-${deps.escapeHtml(outcome.name)}"></span>
              </div>
              <input type="text"
                     class="acu-dice-input acu-effect-value-input"
                     data-outcome="${deps.escapeHtml(outcome.name)}"
                     value=""
                     placeholder="${deps.escapeHtml(String(defaultVal || '输入效果值 (如 1d6)'))}">
            </div>
          `);
        });
      }

      return items;
    };


  return {
    applyFieldConfig,
    matchesCheckSelector,
    renderEffectInputs,
  };
}
