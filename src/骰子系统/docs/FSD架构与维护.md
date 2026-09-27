# 骰子系统 FSD 架构与维护指南

> 版本：v7.0.0-fsd-s81（实验分支 feat/fsd-core）
> 本文件随重构批次更新。

## 1. 目标与成果

- 将原 `src/骰子系统/index.ts` 巨型单体（约 72,000 行 IIFE）重构为 **Feature-Sliced 分层模块**；
- 当前 `index.ts`：**13,948 行**（约 -80.6%），剩余为：装配/接线、状态变量、少量待处理块；
- 全量模块文件：**1,110 个 .ts**（features 1,040 / shared 62 / entities 5 / app 1）。

## 2. 目录结构

```
src/骰子系统/
├── index.ts                # 入口：装配、接线、状态变量、初始化流程
├── entities/               # 领域实体（gacha-items、name-alias 等）
├── features/               # 功能切面（dice / gacha / presets / table / ui / tutorial / api / textarea / human-input / avatars / dashboard …）
├── shared/                 # 无业务依赖工具（storage、types、常量、通用解析器）
├── app/ 、pages/ 、widgets/# 预留分层
├── docs/                   # 文档（API、提示词、评审基线、本指南）
└── 骰子表格SQL_v4.3.json     # 内置表模板
```

## 3. 模块规范（工厂 + DI）

每个模块导出一个工厂函数：

```ts
// @ts-nocheck
export function createXxx(deps: any) {
  const xxx = (...) => { /* 原始逻辑，外部依赖改走 deps.* */ };
  return xxx;
}
```

- 外部依赖一律通过 `deps.xxx` 访问，**不直接引用 index 作用域变量**；
- 对象/实例依赖使用 **getter 风格**：`deps.getX()`，避免把对象误包成函数；
- 可变状态变量使用 **accessor 风格**：`deps.getX()` / `deps.setX(v)`；
- index 中接线为惰性对象：`getX: () => x`、`setX: v => { x = v; }`、`fn: (...a)=>fn(...a)`。

### 三条铁律

1. **对象/实例绝不用函数包装**（否则 `.method` 丢失，引发初始化崩溃）；
2. **对象键保护**：替换标识符时跳过 `{ key: ... }` 中的键名；
3. **单行/极小片段使用确定性手工接线**，不走 span 机器，避免吞邻块。

## 4. 质量闸门（每批必过）

| # | 闸门 | 说明 |
|---|---|---|
| 1 | no-undef 扫描 | 构建产物与上一稳定基线对比，零新增未定义 |
| 2 | TDZ 扫描 | 急切引用后定义/惰性包装检查 |
| 3 | spread 扫描 | `...IDENT` 未接线检测 |
| 4 | 对象包装审计 | `new/{}/[]` 值与函数包装冲突检测 |
| 5 | 常量消失审计 | 批次前后全集差集，非目标消失必须解释/还原 |
| 6 | 启动冒烟 | Node 桩环境加载 stable.js，顶层零异常 |

## 5. 构建与发布

- 构建：`pnpm build`（产物 `dist/骰子系统/stable.js`）；
- 发布：实验分支 `feat/fsd-core`；每批唯一 tag（`fsd-sN`）与迭代版本号（`v7.0.0-fsd-sN`）；
- 加载：`https://gcore.jsdelivr.net/gh/kai6666666/my-tavern-scripts@<tag>/dist/骰子系统/stable.js`；
- 注意：**jsdelivr 对同一 tag 首次拉取即缓存，禁止复用 tag**；需要修正时出新 tag（如 fsd-s77c）。

## 6. 批次历史（概要）

- s1–s22：手工单块迁移（数据层、表达式引擎、API 层、关键管理器）；
- s23–s53：批量 codemod 流水线（九大保留区、超大块 4098 行纪录）；
- s54–s66：大件收尾 + 教程按钮回归修复（捕获阶段委托 / MVU 快速开教程）；
- s67–s81：长尾清扫（≥20 → 2 行档）、工具链升级（span 适体 / 跳过保护 / 五道闸门 / 手工接线）；
- 当前：`feat/fsd-core` = 最新 fsd-s81（详见 git log）。

## 7. 已知遗留

- 1 行档中的**状态变量**按设计保留在 `index.ts`；
- `normalizeCrudHeaderLookupKey`（正则字面量导致 span 误判）与部分高级预设历史块曾以“跳过/还原”策略处理，未来可用“手工接线”安全迁出；
- `docs/API.md` 为公共 API 文档；模块内部契约以本指南为准。


## 批次历史（续：s84–s100）

- **s84–s87 收尾提取期**：14/13→12→10→≤2 行档全部清零；长尾提取池在 s87 彻底清空（残余单行档 = 抽卡状态委托器）。
- **s88–s99 功能与稳定性期**：
  - 装备拆解 / 统一物品栏面板（物品+装备 Tab）/ PICK UP 修复 / 数据库回调单例分发器（s93–s94）/ 排序稳定性（s95–s98：预冻结 + 回写导航盘顺序，全链路单一排序源）；
  - s99：导入配置方案时按模板 `orderNo` 覆盖导航盘管理顺序；「填表开始」改为保护式基线（存在待审核变更时不覆盖），并新增 `maybe-refresh-review-baseline-at-fill-start`。
  - s100：`shared/styles.ts`（17.3k 行）拆分为 `shared/styles/part-01..07`（按章节保持原顺序拼接，逐字节校验一致）；调用回调透传数据库 `meta.persisted`（S2-1）。
- **质量闸门（七道）**：no-undef 扫描 / TDZ 扫描 / spread 扫描 / 对象包装审计 / 常量消失审计 / 启动冒烟 / 依赖完整性审计。

## Release v7.0.0

- 2026-09-14：`feat/fsd-core` 全量合并至 `main`，`SCRIPT_VERSION = v7.0.0`；
- 正式引用：`https://gcore.jsdelivr.net/gh/kai6666666/my-tavern-scripts@v7.0.0/dist/骰子系统/stable.js`
- 回退点：`fsd-s100` / `fsd-s99`（或 v6.68 `5cb1851`）。

## x1 护栏与基线（v7.1.0-x1）

- 体积门：src/骰子系统 内 >100KB 文件冻结清单 `scripts/guardrails/baseline-large-files.json`（只许拆小，不得新增/增长）；
- @ts-nocheck 冻结：1306 个存量文件清单 `scripts/guardrails/baseline-ts-nocheck.json`（禁止新增）；
- CI：`.github/workflows/guardrails.yml`；本地校验：`pnpm guardrails`；
- 基线 tag：`v7.1.0-x1`。

## x2-a（v7.1.0-x2a）

- `show-dice-panel.ts`：拆出「历史簇」→ `features/dice/panel/dice-panel-history.ts`；
  - 包含：历史过滤状态 ×3、`renderDiceHistoryItems`、`showDiceHistoryDialog`（全仓无调用，保留待定）；
  - 面板 4,109 → 3,832 行（-277）；采用子工厂 `createDicePanelHistory(deps)` 就地实例化。
- 约定：子工厂文件带 `// @child-factory` 标记，不参与 index 接线审计。

## x2-b（v7.1.0-x2b）

- `show-dice-panel.ts`：拆出「效果运行簇」→ `features/dice/panel/dice-panel-effect-runs.ts`（约 604 行）；
  - 包含：效果运行状态机（pendingEffectRuns / activeConfirmEffectRun / 重试定时器）、meta 注入、历史状态写回、清理定时器；
  - 桥接：`effectRunState`（对象属性替代 let 变量）+ `getPanel()`/`buildAttrButtons()` ctx + 共享 effect-math 导入；
  - 面板 3,833 → 3,252 行（-581）；导出 7 个方法 + 状态对象。

## x2-c（v7.1.0-x2c）

- `show-dice-panel.ts`：拆出「快捷动作簇」→ `features/dice/panel/dice-panel-quick-actions.ts`（218 行）；
  - 包含：快照过滤/可见性/渲染（`getPresetQuickActions` / `buildQuickActionContext` / `isQuickActionVisible` / `renderPresetQuickActions`）+ 三种执行器（`activatePresetQuickAction` / `executeAttrShortcutQuickAction` / `executePresetQuickAction`）；
  - 桥接：`getPanel()` / `getCurrentAdvancedPreset()` / `applyAdvancedPreset()` ctx；
  - 面板 3,251 → 3,051 行（-200）。

## x2-d（v7.1.0-x2d）

- `show-dice-panel.ts`：拆出「资源燃烧簇」→ `features/dice/panel/dice-panel-resource-burner.ts`（336 行）；
  - 包含：结果区燃烧按钮渲染 / 点击入口 / 输入弹窗 / 生效与二次效果（`renderResourceBurnerButtons` / `handleResourceBurnerClick` / `showBurnerInputDialog` / `applyBurnerEffect` / `checkSecondaryEffects`）；
  - 桥接：`getPanel()` / `buildAttrButtons` / `matchesCheckSelector` / `parseModifier` / `performAdvancedCheck` 共 5 个 ctx 注入；
  - 面板 3,050 → 2,732 行（-318）。

## x2-e（v7.1.0-x2e）

- `show-dice-panel.ts`：拆出「角色与属性按钮簇」→ `features/dice/panel/dice-panel-attr-buttons.ts`（约 310 行）；
  - 包含：角色快捷按钮 / 属性快捷按钮 / 目标值随骰型转换 / 规则模式切换（`buildCharButtons` / `buildAttrButtons` / `convertTargetForDice` / `updateRuleMode`）；
  - 桥接：`getPanel` / `getDiceCharacterList` / `getDiceAttrList` / `getFromMvu` / `getMvuParsedInfo` / `getTargetValue` / `getCurrentAdvancedPreset` 共 7 个 ctx；
  - 面板 2,731 → 2,442 行（-289）。

## x2-e2 热修（v7.1.0-x2e2）

- 事故：x2-e 把「面板打开时执行的初始化块」一并搬进了子工厂，导致面板打开瞬间在 `panel` 赋值前调用 `buildCharButtons()` → TDZ 崩溃（面板无法打开）。
- 修复：初始化块收进子工厂 `init()` 方法；面板在对应时机显式调用 `dicePanelAttrButtons.init()`。
- 新护栏：`@child-factory` 模块禁止在工厂体一级直接写可执行语句（guardrails 新增「子工厂顶层语句扫描」）。

## x2-f（v7.1.0-x2f）

- `show-dice-panel.ts`：拆出「效果确认簇」→ `features/dice/panel/dice-panel-effect-confirm.ts`（约 330 行）；
  - 包含：确认弹窗 / 条件预览 / 输入计算 / 确认流程（`showEffectConfirmDialog` / `resolveEffectConditionPreview` / `computeEffectsFromInputs` / `handleEffectConfirmation`）；
  - 桥接：`getPanel` + `getEffectRuns`（延迟取 effect-runs 子工厂实例）；
  - 面板 2,442 → 2,129 行（-313）。

## x2-g（v7.1.0-x2g）

- `show-dice-panel.ts`：拆出「表达式助手簇」→ `features/dice/panel/dice-panel-expr.ts`（54 行）；
  - 包含：投骰 / 修正值解析 / 变量表达式替换（`rollDice` / `parseModifier` / `resolveExpressionWithContext`）；无 deps 依赖；
  - 面板 2,128 → 2,090 行（-38）。

## x2-h（v7.1.0-x2h）

- `show-dice-panel.ts`：拆出「效果输入/字段配置簇」→ `features/dice/panel/dice-panel-effect-inputs.ts`（128 行）；
  - 包含：`applyFieldConfig` / `matchesCheckSelector` / `renderEffectInputs`；
  - 面板 2,090 → 1,977 行（-113）。

## x2-i（v7.1.0-x2i）

- `show-dice-panel.ts`：拆出「预设应用中枢」`applyAdvancedPreset` → `features/dice/panel/dice-panel-apply-preset.ts`（含行布局恢复辅助函数，约 330 行）；
  - 桥接：`getPanel` / `getCurrentAdvancedPreset` / `setCurrentAdvancedPreset` / `getLastVisiblePresetId` / `setLastVisiblePresetId` + 3 个子工厂实例（effectInputs / attrButtons / quickActions）。
- **事故与护栏升级**：提取时误把「尾随事件绑定块」（attr-name/快捷预设/返回常规/动作按钮等监听）一并纳入子工厂，导致工厂创建即执行、面板打开抛 `panel is not defined`；
  - 面板打开冒烟（调试注入）精确定位；修正：尾块回迁主文件（3 处调用改走实例）；
  - 护栏 ⑧ 正则扩展：新增 `panel\. / localStorage\. / window\. / console\.` 顶层语句前缀检测（历史漏网：裸 `panel.xxx` 语句）。

## x2-j（v7.1.0-x2j）

- `show-dice-panel.ts`：拆出「高级检定主流程」`performAdvancedCheck`（768 行）→ `features/dice/panel/dice-panel-advanced-check.ts`（约 790 行）；
  - 覆盖：DC 解析 / 派生变量 / dicePatches / outcomes / 孤注一掷 / 效果入队；
  - 桥接：`getPanel` / `getCurrentAdvancedPreset` + 6 个子工厂实例（effectRuns / effectConfirm / expr / attrButtons / resourceBurner / effectInputs）；
  - 面板 1,667 → 903 行（x2 累计 -3,206，≈-78%）。

## x2-k（v7.1.0-x2k）· x2 收口

- `show-dice-panel.ts`：拆出「投骰双流程」`performCustomRoll` + `performDiceRoll` → `features/dice/panel/dice-panel-roll.ts`（约 510 行，含面板打开级节流状态 `lastDiceRollAt`）；
  - 修复既有隐患：`calculateDiceExpectedValue` 在 `dice-engine.ts` 未导出却被跨模块引用（基线 no-undef 清单项）→ 补 `export` 并由 roll 模块导入；
  - 排除误桥接：`isDND` 为 `performDiceRoll` 内部局部量（与外层同名遮蔽），不做 ctx 注入。
- 面板 903 → **417 行**（x2 累计 4,109 → 417，**-3,692 ≈ -90%**）；剩余为：状态定义 / 面板 HTML / 事件接线 / `closePanel` 骨架。

## x3-a（v7.1.0-x3a）

- `database-ui-override.ts`（2,534 行）拆解：
  - `features/database-ui/types.ts`（公共类型，含 `DatabaseCssParams`）；
  - `features/database-ui/themes.ts`（`DATABASE_THEME_MAP` 15 主题 + 样式 ID）；
  - `features/database-ui/css/part-01..05`（核心/布局/表格/面板/可视化，共约 2,100 行，逐字节等价校验通过）；
  - 主文件 2,534 → **174 行**（装配 + toast mute）。
- **重要发现**：`database-ui-override.ts` 已无任何入口引用（孤儿文件、不进产物；index.ts 曾在 v3.61/v5.32 引用，后移除）。本次拆解为零风险结构整理；其去留（重新接线 / x7 清理）待定。
  - 校验：tsc 直编模块+片段零错误（esbuild 不可用，改用 tsc noEmit）。

## x3-b（v7.1.0-x3b）· database-ui 重新接线

- 恢复「数据库 UI 主题同步」（孤儿文件重新接入）：
  - `app/init.ts`：启动时 `injectDatabaseStyles(theme, fontVal)`（用 `createFontsList({})` 计算字体栈，不触碰冻结的 index.ts）；
  - `features/ui/apply-config-styles.ts`：保存配置/备份恢复统一入口注入（设置面板主题/字体变更即生效）；
  - `database-ui-override.ts` 增加守卫：`native`/未知主题 → `clearDatabaseStyles()` 且不接管（避免错误套用 aurora）。
- 产物：stable.js 增大 ~92KB（2,733,070 → 2,825,249 B），DB CSS 首次进入发布包；index.ts 保持 658,998 B 不增长（护栏通过）。

## x3-c（v7.1.0-x3c）

- `show-relationship-graph.ts`（2,063 行）拆出「数据模型构建」→ `features/table/relationship-graph/build-relation-graph-model.ts`（478 行）；
  - 输入：deps/headers/rows/nameIdx/relationIdx/options/npcTableKey；输出：nodes/edges/rawData/resolvedPlayerName；
  - 主文件 2,063 → 1,623 行；纯构建函数（无 @child-factory 标记）。

## x3-d（v7.1.0-x3d）

- `table-template-requirements.ts`（1,728 行）拆层：
  - `types.ts`（113 行）：公共类型 + 格式常量；
  - `utils.ts`（278 行）：基础工具 + DDL 工具（48 个常量/函数，全部 export）；
  - 主文件 1,728 → **1,362 行**（保留导出面 & 逻辑，无 @ts-nocheck）。
- 过程修复：`export *` 不产生本地绑定 → 主文件补常量 import；`...spread` 调用被首个扫描漏掉 → 补 `getDdlSeparatorProblems`。

## x3-e（v7.1.0-x3e）

- `shared/styles/part-02-avatar.ts`（2,734 行 / 98.4KB）拆为 3 个子分片 + 聚合器：
  - `part-02a-dice-ui.ts`（935 行）/ `part-02b-relation-map.ts`（917 行）/ `part-02c-avatar.ts`（888 行）；
  - 聚合器 8 行，按序拼接；**逐字节等价校验通过**（recon == orig: True）；
  - @ts-nocheck 总数 1306 → 1305（新分片无需豁免）。
- 说明：`bind-events.ts` 为单函数 1,700 行、仅尾 28 行 IIFE 可安全切出，切分收益低；本批改拆 styles 大分片，bind-events 留待 x4 与 index 收尾时统一评估。

## x3-f（v7.1.0-x3f）

- `shared/styles/part-04-validation.ts`（2,366 行 / 94KB）拆为 3 个子分片 + 聚合器：
  - `part-04a-settings.ts`（661 行）/ `part-04b-attr-preset.ts`（602 行）/ `part-04c-audit-errors.ts`（1,109 行）；
  - 聚合器 8 行；**逐字节等价校验通过**；@ts-nocheck 1305 → 1304。

## x3-g（v7.1.0-x3g）

- `shared/styles/part-03-icons.ts`（2,430 行 / 87KB）拆为 3 个子分片 + 聚合器：
  - `part-03a-avatar-manager.ts`（435 行）/ `part-03b-icon-preset.ts`（1,181 行）/ `part-03c-dialogs-settings.ts`（820 行）；
  - 逐字节等价；@ts-nocheck 1304 → 1303。

## x3-h（v7.1.0-x3h）

- `shared/styles/part-05-validation.ts`（2,537 行 / 86KB）拆为 4 个子分片 + 聚合器：
  - a 表格管理(218) / b 验证+头像裁剪(684) / c 收藏夹系列(988) / d 导入确认+尾部(657)；逐字节等价；@ts-nocheck 1303 → 1302。

## x3-i（v7.1.0-x3i）

- `shared/styles/part-01-theme.ts`（2,362 行 / 145KB）拆为 4 个子分片 + 聚合器：
  - a 基础+头像(500) / b 骰子面板(624) / c 主题变量上(560) / d 主题变量下(688)；逐字节等价；
  - 拆分后 part-01 退出 >100KB 名单（5 → 4）；@ts-nocheck 1302 → 1301。

## x3-j（v7.1.0-x3j）

- `shared/styles/part-06-inventory.ts`（3,694 行 / 114KB）拆为 4 个均衡子分片 + 聚合器：
  - part-06a(效果输入) / b / c / d，各 ~29.3KB；逐字节等价；
  - 拆分后 >100KB 文件 4 → 3（仅剩 index / tutorial / mvu-module）；@ts-nocheck 1301 → 1300。

## x3-k（v7.1.0-x3k）

- `features/tutorial.ts`（3,296 行 / 129KB）拆为：
  - `features/tutorial/types.ts`（115 行）/ `features/tutorial/steps.ts`（1,983 行，STEPS 数据外置）；
  - 主文件 3,296 → 1,211 行；>100KB 文件 3 → 2（仅剩 index / mvu-module）。

## x3-l（v7.1.0-x3l）

- `features/mvu/mvu-module.ts`（3,118 行 / 129KB）拆出 `features/mvu/styles.ts`（959 行，MVU_STYLES 外置，逐字节等价）；
  - 主文件 129KB → 89.9KB；>100KB 文件 2 → 1（仅剩 index.ts，留给 x4）。

## x3-m（v7.1.0-x3m）

- `features/table/table-template-requirements.ts` 二阶段拆层：内部 helpers 簇（34 个函数/常量）→ `table-template-requirements/helpers.ts`（559 行，全量 export）；
  - 主文件 1,367 → 819 行；
  - 事故：两处 spread 调用（`...getDdlSeparatorProblems(...)` / `...getTemplateStructureIssues(...)`）被标识符扫描漏掉 → 导入修复；扫描脚本已改进（先 `replace('...', ' ')` 再扫描）。
    
## x3-m2（v7.1.0-x3m2）修复

- 事故：模板检验误报「缺少 XX 表」×7 —— 根因：`findMatchingSheetMatch` 在“聊天侧表被重排内部键 / 缺 ddl（SQL 表名解析为空）”时，仍用 SQL 表名从严过滤显示名命中，导致已存在的表被判缺失；
- 修复：显示名唯一命中直接接受；仅同名多候选时才用 SQL 表名优选；空模板仍正确报缺失（行为保留）；
- 仿真：重排键 / 无 ddl / SQL 名不同 / 组合变体 全部 HIT；
    