# 战斗仪表盘 FSD 架构与维护指南

> 版本：v7.0.0-fsd-s81（实验分支 feat/fsd-core）
> 本文件随重构批次更新。

## 1. 目标与成果

- 将原 `src/战斗仪表盘/index.ts` 巨型单体（约 72,000 行 IIFE）重构为 **Feature-Sliced 分层模块**；
- 当前 `index.ts`：**13,948 行**（约 -80.6%），剩余为：装配/接线、状态变量、少量待处理块；
- 全量模块文件：**1,110 个 .ts**（features 1,040 / shared 62 / entities 5 / app 1）。

## 2. 目录结构

```
src/战斗仪表盘/
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

- 构建：`pnpm build`（产物 `dist/战斗仪表盘/stable.js`）；
- 发布：实验分支 `feat/fsd-core`；每批唯一 tag（`fsd-sN`）与迭代版本号（`v7.0.0-fsd-sN`）；
- 加载：`https://gcore.jsdelivr.net/gh/kai6666666/my-tavern-scripts@<tag>/dist/战斗仪表盘/stable.js`；
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
- 正式引用：`https://gcore.jsdelivr.net/gh/kai6666666/my-tavern-scripts@v7.0.0/dist/战斗仪表盘/stable.js`
- 回退点：`fsd-s100` / `fsd-s99`（或 v6.68 `5cb1851`）。

## x1 护栏与基线（v7.1.0-x1）

- 体积门：src/战斗仪表盘 内 >100KB 文件冻结清单 `scripts/guardrails/baseline-large-files.json`（只许拆小，不得新增/增长）；
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
    
## x3-n（v7.1.0-x3n）

- `features/settings/show-settings-modal.ts`（1,963 行）拆出 `build-settings-dialog-html.ts`：设置弹窗 652 行巨型模板串外置（逐字节等价），ctx 注入 14 个依赖；
  - 主文件 1,963 → 1,313 行；新文件不带 @ts-nocheck（TS 受检）；
  - 新增「代理 ctx 缺名冒烟」（任何遗漏外部引用直接 ReferenceError）。

## x3-o（v7.1.0-x3o）

- `features/dice/show-contest-panel.ts`（2,302 行）拆出 `features/dice/contest/apply-advanced-preset.ts`（604 行）：「应用进阶预设」整段（~600 行，含嵌套 helpers）经 ctx 注入提取；
  - `currentContestAdvancedPreset` 写回改为 `ctx.setCurrentContestAdvancedPreset`（2 处）；主文件 2,302 → 1,711 行；
  - 首版边界事故：span 末行为注释而非 `};` → 用「尾部回扫收尾行」修正；参数名 `presetId` 需原样保留；
  - 新文件无 @ts-nocheck 且构建通过（TS 全检）。

## x3-p（v7.1.0-x3p）

- `features/dice/show-contest-panel.ts` 二阶段：`performContestRoll`（731 行对抗投骰主流程）拆出 `contest/perform-contest-roll.ts`；
  - ctx 注入 + 3 处最小改写（跨帧节流时间戳 get/set、预设 get）；主文件 1,711 → 986 行；
  - 事故：漏 import `showActionableErrorToast`（no-undef 扫描抓出）→ 已修复；
  - 分析经验：`var` 声明与解构声明会被声明扫描漏掉造成自由变量误报；属性键（`attrName:`）也会造成误报。

## x3-p2（v7.1.0-x3p2）回退

- 用户实测：x3-p 后对抗投骰无效（单人投骰正常）。多环境对照（源码等价 diff / 单函数 harness 新旧一致 / 真实产物 jsdom 加载正常）均未复现差异；
- 为确保业务可用，先回退 `performContestRoll` 提取（恢复 x3-o 状态），保留 apply-advanced-preset 提取；后续复现手段齐备时再重试。

## x4-a（v7.1.0-x4a）

- x4（index.ts 收口）首刀：高级骰子预设系统类型区块 31 个类型（约 670 行）迁出 → `shared/advanced-preset-types.ts`；
  - index 13,018 → 12,346 行（类型仅编译期，运行时零变化）；
  - 依赖：仅4个类型从 `./types` 导入（CustomFieldConfig / DerivedVarSpec / DiceExprPatch / OutcomePolicy）。

## x4-b（v7.1.0-x4b）

- 第二批类型迁移：10 个区块（Regex / Favorites&History / AttributeRule / Dashboard / GlobalInteraction / CustomTableNameIcon / RelationGraph / RuntimeCrud / TemplateInspection）共约 560 行 → `shared/index-local-types.ts`；
  - index 12,344 → 11,790 行；
  - 排除：依赖 index 运行时常量的 3 块（RENDER_PRESET_FORMAT / DICE_CONFIG_BACKUP_FORMAT / INVENTORY_*_OPTIONS）；
  - 发现经验：多行 `import type {` 续行会被类型扫描误判为本地类型声明（x4-b 侦察时识别并规避）。

## x4-c（v7.1.0-x4c）

- x4 首个 **wiring 域拆分**：CRUD/表格读写装配簇（238 行，35 个装配实例）→ `wiring/crud-wiring.ts`（工厂 `createCrudWiring(ctx)`，返回 35 项）；
  - index 11,790 → 11,552 行；
  - 事件：① import 映射需全量解析（首次只扫前300行导致30+工厂漏 import，smoke 抓到）；② 前向引用（`buildCrudColumnAliasMap` 定义在后面）在快照式 ctx 下会 TDZ → 改为惰性转发 `(...a)=>name(...a)`；
  - 该模式沉淀为 wiring 拆分规范：ctx 快照 + 前向/可变引用惰性转发。

## x4-d（v7.1.0-x4d）

- wiring 第二簇：高级骰子预设/属性预设装配（343 行；aft 17 / import 70 / ctx 12，含 8 个前向引用惰性转发）→ `wiring/advanced-preset-wiring.ts`；
  - index 11,552 → 11,212 行；
  - 事故1：前向「上游使用」（`updateTemplateForActivePreset` 在其定义之前已被引用）漏出返回值 → 重算「模块外全量使用」补齐；
  - 事故2：`.json?raw` 默认导入被生成器写成具名导入 → 运行时 raw 为空（JSON.parse undefined），smoke 抓出并修复；生成器已补默认导入映射。

## x4-e（v7.1.0-x4e）

- wiring 第三簇：骰子配置备份/角色档案装配（285 行；defs 49 / aft 20 / ext 23）→ `wiring/dice-profile-backup-wiring.ts`；
  - index 11,212 → 10,930 行；
  - 事故与改进：① 脚本被重复执行造成错位拼接（含语法错误）→ 改为单次执行并在生成前 `git checkout` 复位；② 簇边界必须用「构造闭合」算法而非 def 间隔（否则切在 `createX({` 中间）；③ `escapeHtml` 定义接在 `});` 同行，属于扫描盲区 → 全库扫描「行中定义」并补入 ctx。

## x4-f（v7.1.0-x4f）

- wiring 第四簇：配置备份核心装配（392 行；defs 54 / aft 22 / ext 65）→ `wiring/dice-config-backup-core-wiring.ts`；
  - index 10,930 → 10,541 行；
  - 事故与改进：① 提取器加入「已应用守卫」防双跑；② `TableTemplateRequirementPresetManager` / `BUILTIN_..._PRESETS`（x4-d 已迁出）属跨模块依赖，外扫需以「全量定义（含已迁出符号）」，本次以手工补 ctx 解决；后续在生成器中维护「已迁名字映射」。

## x4-g（v7.1.0-x4g）

- wiring 第五簇：检查建议/设置弹窗装配（495 行；defs 56 / after 6）→ `wiring/check-suggestion-wiring.ts`；
  - index 10,541 → 10,046 行；
  - 生成器新增「**已迁名字登记表**」：自动识别历史 wiring destructure，跨模块依赖全自动补 ctx（本批一次过闸）。

## x4-g2（v7.1.0-x4g2）热修

- 事故：主设置弹窗无法打开——`isSettingsOpen`/`cachedRawData`（index 侧 `let` 可变状态）被按快照传值，模块内 setter 对 const 赋值 → 打开设置即抛错；
- 修复：可变外部状态改用**访问器对象** `NAME_ACC = { get v(){...}, set v(x){...} }`，模块内统一 `NAME_ACC.v` 读写（双向实时）；
- 规范升级：生成器将自动检测「ctx ∩ index-let」并生成访问器（本批手工完成，后续自动化）。
## x4-h（v7.1.0-x4h）
- wiring 第六簇：抽卡/库存/商店装配（876 行；defs 91 / after 9 / ext 167）→ `wiring/gacha-inventory-wiring.ts`；
  - index 10,046 → 9,173 行；
- 生成器升级：**`ctx ∩ index-let` 自动存取器化**——13 个可变状态（cachedRawData / gachaHeartbeatTimer / gachaShopRootElement / tablePageStates 等）共 51 处引用自动改写为 `NAME_ACC.v` 双向读写；
- 事故沉淀：`NAME: NAME` 简写形态的**对象 key 侧**被误替换（`NAME_ACC.v:` 成为非法 key）→ webpack/ts 双报错；修复：键位还原 `NAME:`、值位用 `NAME_ACC.v`；后续生成器键位替换须加「冒号位置」防护；
- 闸门：tsc 全项目扫描（TS2304=0；TS2556×134 为主力类型债，与历届模块同款）；smoke OK。
## x4-i（v7.1.0-x4i）
- wiring 第七簇：抽卡设置/配置装配（926 行；defs 181 / aft 130 / ext 42）→ `wiring/gacha-settings-wiring.ts`；
  - index 9,173 → 8,250 行；
- 生成器升级：**「段内 let」暴露**——块内定义但被块外引用的可变状态（gachaCatalogCache / gachaCatalogLoadTask）自动「模块内建存取器 + 返回 `_ACC` + 段外引用改写 `_ACC.v`」；
- 事故1：`export { XxxImpl as Xxx }` 别名导入被拍扁为直接名 → 模块 import「不存在的导出」（warning + 运行时 undefined）→ 修复：保留 `Impl as` 映射；新增「import ↔ 源导出」一致性扫描；
- 事故2：`import { type X, type Y }` inline type 前缀未剥离 → 4 个 type 名漏出 impmap → 模块漏导入（TS2304×8）→ 修复：补 `import type`；生成器后续需剥离 `type ` 前缀；
- 闸门：smoke OK / TDZ=0 / spread=0 / tsc 本模块 TS2304=0（214 条为历届同款类型债）。
## x4-j（v7.1.0-x4j）
- wiring 第八簇：抽卡主流程/面板装配（413 行；defs 47 / aft 20 / ext 107）→ `wiring/gacha-draw-wiring.ts`；
  - index 8,250 → 7,841 行；
- 事故：生成器补丁只改函数名、未同步 import 路径串（`createGachaDrawWiring` 指向 gacha-settings）→ webpack「not found」+ 运行时 undefined（构建 warning 抓出）→ 修复：import 路径同步；反思：生成器改造须全量替换「名字 + 路径 + 注释」三元组；
- 闸门：smoke OK / warnings 12（基线）/ tsc 本模块 TS2304=0；
- 「段内 let / outer-let 暴露」两机制本批零触发（块内零 let 定义、仅 2 个 outer 引用），运行平稳。
## x4-k（v7.1.0-x4k）
- wiring 第九簇：核心运行时/工具装配（1,034 行；defs 202 / aft 80 / ext 43）→ `wiring/core-runtime-wiring.ts`；
  - index 7,841 → 6,809 行；
- 机制：**17 个段内 let 自动暴露**（含 cachedRawData 49 处外引）——模块内建存取器 + 返回 `_ACC` + 段外引用改写 `_ACC.v` 全自动；
- 事故1：段外替换误伤字符串（-observer_ACC.v 路径串污染）→构建 6 错；护栏：替换需加字符串/引号上下文防护；
- 事故2：insert 路径串未同步（createCoreRuntimeWiring 误指向 gacha-settings）→名字+路径+注释三元组替换规范再次加强；
- 事故3：Impl as 别名第 3 例与 hasUnsavedChanges 值 boolean 却当函数转发（TS2349 历史误用）——已修；
- 闸门：smoke OK / warnings 12（基线）/ 本模块 TS2304=0（全项目总数回 108 基线）。
## x4-l（v7.1.0-x4l）
- wiring 第十簇：教程/Diff/数据读写装配（647行；defs113 / aft56 / ext27）→「wiring/runtime-save-wiring.ts」；
  - index 6,809 → 6,165行；
- 机制升级：提取器识别「局部解构行」（const {A,B} = createXxx）——其名字纳入内部符号集，不再误入 ctx（修复双重声明）；
- 事故沉淀：①解构行名字误判（核心修复）；②insert路径未同步（第4次）；③归一化Im器第四例（normalizeDiffHeader）；④补 import type（TutorialModule/RuntimeCrudWriteApi）；⑤heredoc行合并（改用 python -c）；
- 闸门：smoke OK / warnings12（基线）/ 本模块 TS2304=0（总数回108基线）。
## x4-m（v7.1.0-x4m）
- wiring 第十一簇：表格状态/渲染工具装配（519行；defs86 / aft62 / ext70）→「wiring/table-state-wiring.ts」；
  - index 6,165 → 5,649行；
- 机制：段内let暴露照常；新增前置侦察（构造闭合+解构行扫描）使本批一次过闸；
- 事故沉淀：生成器派生时断言/路径两处需手工修补（reps-0-match检测法定位）；
- 闸门：smoke OK / warnings12（基线）/ 本模块 TS2304=0（总数108基线）。
## x4-n（v7.1.0-x4n）
- wiring 第十二簇：地图/关系图/头像/配置装配（406行；defs39 / aft20 / ext45）→「wiring/visualization-wiring.ts」；
  - index 5,649 → 5,246行；
- 机制：段内let暴露（_configCache/isMapOpening）；构造闭合+解构行前置侦察；
- 事故沉淀：type漏网补齐（AcuDiceProfilePackage/Source）；断言与insert路径的reps顺序问题（函数名先换→路径行模式失配）；
- 闸门：smoke OK / warnings12（基线）/ 本模块 TS2304=0（总数108基线）。
## x4-o（v7.1.0-x4o）
- wiring 第十三簇：预设管理/AcuDice API装配（426行；defs48 / aft29 / ext74 / late5）→「wiring/preset-api-wiring.ts」；
  - index 5,246 → 4,823行；
- 机制：reg两空格版正式化（可收集接线解构名465个）→ ext纳入接线名（AcuDiceAPI/cachedRawData_ACC等）；新增「_ACC透传wrapper」与「late对象getter+文本替换」（AcuDiceAPI）；
- 类型处理：CheckHistoryExtension → import type（shared/advanced-preset-types）；DiceStatsScope → 迁至 shared/index-local-types.ts；AcuDice namespace → 模块内declare占位（悬空等价，待x5统一）；
- 闸门：smoke OK / warnings12（基线）/ 本模块 TS2304=0（总数108基线）；
- 事故沉淀：①防重复断言误判（migrate注释含x4-o字样 → 改用preset-api-wiring标记）；②heredoc回显乱但内容完好（ast校验为准）。
## x4-p（v7.1.0-x4p）
- wiring 第十四簇：渲染防抖/视口监听/浮动折叠装配（428行；defs66 / aft7 / ext73 / late15）→「wiring/render-interface-wiring.ts」；
  - index 4,823 → 4,398行；
- 机制：24个段内let（23个自动存取器+1个暴露 suppressNextFloatingCollapseClick_ACC）；late含 bindEvents/renderChangesPanel 等（惰性箭头）；
- 类型：FloatingCollapsePosition 随段；无新增特殊 import（AcuDice 相关零命中）；
- 闸门：smoke OK / warnings12（基线）/ 本模块 TS2304=0（总数108基线）；TS7034×1（renderInterfaceTimer）与 core-runtime/visualization 历史同款；
- 事故沉淀：reps顺序问题再现（函数名先换→insert路径失配）→ 路径单独替换规范二次确认。
## x4-q（v7.1.0-x4q）
- wiring 第十五簇：输入区/发送链/文本缓存与工具装配（553行；defs89 / aft54 / ext18 / late18）→「wiring/composer-input-wiring.ts」；
  - index 4,398 → 3,848行；
- 机制：7个段内let（3自动存取器+4暴露：gachaHeartbeatTimer/gachaShopRootElement/gachaShopUiRefreshTimer/lastHumanInputActivityAt）；
- 类型盲点热修：escapeHtml（粘连线隐藏定义）纳入defs；别名导入修复：escapeRegExpLiteralImpl as escapeRegExpLiteral（Impl as第5例，warning消除回基线12）；
- 闸门：smoke OK / warnings12（基线，与x4p diff IDENTICAL）/ 本模块 TS2304=0（总数108基线）。
## x4-r（v7.1.0-x4r）
- wiring 第十六簇：渲染预设/头像身份/对话缩进装配（548行；defs55 / aft33 / ext19 / late9）→「wiring/avatar-identity-wiring.ts」；
  - index 3,848 → 3,303行；
- 机制：1个段内let暴露（h_ACC）；RenderPreset体系类型块整体随段（1472-1533）；
- 沉淀：注释词误配——`// [x4-o] DiceStatsScope...` 注释内词被 Used 收集误算 → 多余 import type → TS6133（已移除）；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线）。
## x4-s（v7.1.0-x4s）
- wiring 第十七簇：表格图标与工具装配（273行；defs34 / aft29 / ext50 / late27）→「wiring/table-icon-tools-wiring.ts」；
  - index 3,303 → 3,034行；
- 机制（首次）：前置保留组（x4-s-pre）——与既有接线存在前向依赖的10项定义（正则规则/排除词/RENDER_* 常量/getDiceConfig）保留在 index、置于 x4-r 接线之前；模块经 ctx 注入（修复 x4-r ctx 直传引用因后置接线造成的 TDZ）；
- 事故沉淀：①后置接线使 x4-r ctx 的直传前向引用 TDZ（smoke FAIL: Cannot access st）——bundle 快照列号定位 + x4-s-pre 保留组修复；②注释词误配第2例（模块内历史注释含 ValidationRuleManager → used 误算 → TS6133，已移除 ctx 项）；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133 44回基线）。
## x4-t（v7.1.0-x4t）
- wiring 第十八簇：动作预设与运算引擎装配（251行；defs42 / aft33 / ext10 / late7）→「wiring/action-engine-wiring.ts」；
  - index 3,034 → 2,786行；
- 机制：1个段内let暴露（dashboardRuntimeConfigCache_ACC）；特例：DashboardDataParser（late对象 getter + `.v` 替换）、cachedRawData_ACC（_ACC透传）；x4-q/x4-r/x4-d 对段内defs的引用均为惰性箭头（无前向TDZ风险，无需 x4-s-pre 式保留组）；
- 类型：DashboardConfigMap → import type（shared/index-local-types）；4个 JSONC工具 interface 随段（外部使用方为 @ts-nocheck 裸名，符合惯例）；
- 沉淀：①judgeCrazyRollResult 模块内未用（TS6133 +1）——历史死代码（注释标明保留），按惯例不清理；②x4-t 接线 ctx 含 DashboardDataParser getter 特例（消费方为 `() => DashboardDataParser` 惰性形态，getter+`.v` 替换精确命中）；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133 45（+1已注明的历史死代码））。
## x4-u（v7.1.0-x4u）
- wiring 第十九簇：初始化引导与诊断工具装配（215行；defs4 / aft2 / ext45 / late1）→「wiring/bootstrap-wiring.ts」；
  - index 2,786 → 2,573行；
- 机制：无段内let；1个late（bindAcuDiceGachaRegexActions，惰性箭头）；window.testPairedTableFix / window.diagnoseDiceVariables 诊断工具随段；段前接线对 init/showEditDialog 的引用均为惰性箭头；
- 流程升级（首次）：SCRIPT_VERSION 随批次更新纳入 apply 脚本（v7.1.0-x4t → v7.1.0-x4u），杜绝版本号滞留；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133=45保持；新增软错误 TS2339×2 / TS7006×8——window挂载与测试函数隐式any，历史同款）。
## x4-v（v7.1.0-x4v）
- wiring 第二十簇：变更审核面板与库存过滤元数据装配（190行；defs9 / aft9 / ext34 / late0）→「wiring/review-panel-wiring.ts」；
  - index 2,573 → 2,386行；
- 机制：无段内let、无late、无特例（全部直传）；18个库存/抽卡元数据类型随段（供 features 使用，裸名 @ts-nocheck）；
- 事故沉淀：inline type import（`type GachaRewardTargetColumns` 语法）未被 impmap 解析 → 模块 TS2304+1 → 已补 import type 修复（生成器待沉淀支持 inline type imports）；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数回108基线；TS6133=45保持；TS6196 +9（迁移类型"模块内未用"，历史同款））。
## x4-w（v7.1.0-x4w）
- wiring 第二十一簇：全局交互面板装配（160行；defs17 / aft6 / ext57 / late2）→「wiring/global-interaction-wiring.ts」；
  - index 2,386 → 2,229行；
- 机制：无段内let；2个late（bindCompositionSafeSearchInput @x4-v接线 / closePanel @x4-i接线，均惰性箭头）；ext57 直传为主；11个渲染子组件（RowCard/Section/TableGroup/Mark等）模块内互用；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133=45保持）。
## x4-x（v7.1.0-x4x）
- wiring 第二十二簇：抽卡API装配（145行；defs15 / aft1 / ext42 / late0）→「wiring/gacha-api-wiring.ts」；
  - index 2,229 → 2,087行；
- 机制：无段内let、无late、全直传；14个序列化/管理子件内部互用，仅 acuDiceGachaApi 暴露（被 gachaRegexActions 引用）；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133=45保持）。
## x4-y（v7.1.0-x4y）—— x4 收口：index ≤2,000 达成
- wiring 第二十三簇：配置备份恢复链装配（102行；defs11 / aft6 / ext40 / late18）→「wiring/dice-config-backup-restore-wiring.ts」；
  - index 2,087 → 1,988行；
- 机制：无段内let；18个late（x4-i/j/l等接线产物，惰性箭头 + _ACC透传×2）；x4-f接线对段内 normalize...ResourceRecord 的引用为惰性箭头；
- 里程碑：x4系列 13,018行 → 1,988行（-84.7%），「≤2,000行纯装配」目标达成；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133=45保持）。
## x4-z（v7.1.0-x4z）
- wiring 第二十四簇：属性预设面板与表格规则修复装配（78行；defs4 / aft2 / ext24 / late1 / defImp1(?raw)）→「wiring/attr-preset-panel-wiring.ts」；
  - index 1,988 → 1,913行；
- 机制：无段内let；1个late（renderInterface，惰性箭头）；?raw 默认导入（attributePresetAgentPromptTemplate）；SortableListOptions（x4-o 段残余 type）随段；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133=45保持）。
## x4-aa（v7.1.0-x4aa）
- wiring 第二十五簇：骰子档案面板装配（70行；defs8 / aft1 / ext31 / late2）→「wiring/dice-profile-panel-wiring.ts」；
  - index 1,913 → 1,846行；
- 机制：无段内let；2个late（bindTutorialButtonsIn / getTutorialButtonHtml @x4-l接线，惰性箭头）；8件内部互用仅 showDiceConfigBackupDialog 暴露；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133=45保持）。
## x4-ab（v7.1.0-x4ab）
- wiring 第二十六簇：抽卡物品编辑弹窗装配（69行；defs1 / aft1 / ext63 / late5）→「wiring/gacha-editor-dialog-wiring.ts」；
  - index 1,846 → 1,780行；
- 机制：无段内let；5个late（parseInventoryItems / parseEquipmentItems / refreshGacha* / startGachaShopUiRefresh，均惰性箭头）；本模块 tsc 零错误（首例）；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133=45保持）。
## x4-ac（v7.1.0-x4ac）
- wiring 第二十七簇：表格排序编辑/拖拽与单元格菜单装配（54行；defs4 / aft1 / ext33 / late1；inner let 1）→「wiring/table-order-cellmenu-wiring.ts」；
  - index 1,780 → 1,729行；
- 机制：1个段内let（selectedSwapSource，纯内部不暴露）；late 1个（showEditDialog @x4-u接线，惰性箭头）；仅 showCellMenu 暴露；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133=46（+1：toggleOrderEditMode 历史死代码）；TS7034/7005（selectedSwapSource 隐式any，历史同款））。
## x4-ad（v7.1.0-x4ad）
- wiring 第二十八簇：变更面板事件绑定装配（41行；defs1 / aft1 / ext34 / late9）→「wiring/bind-changes-events-wiring.ts」；
  - index 1,729 → 1,691行；
- 机制：无段内let；9个late（closePanel / refreshChangesPanel / showChangeEditModal 等，均惰性箭头）；本模块 tsc 零错误（第2例）；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133=46保持）。
## x4-ae（v7.1.0-x4ae）
- wiring 第二十九簇：对抗检定面板与成功等级装配（52行；defs2 / aft2 / ext43 / late10）→「wiring/contest-panel-wiring.ts」；
  - index 1,691 → 1,642行；
- 机制：2个getter特例（MAX_HISTORY / contestHistory：`()=>X` 形态 → ctx getter + 模块内 `.v` 替换——AcuDiceAPI 同款）；本模块 tsc 零错误（第3例）；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133=46保持）。
## x4-af（v7.1.0-x4af）
- wiring 第三十簇：配置备份应用装配（29行；defs1 / aft1 / ext22 / late2）→「wiring/dice-config-backup-apply-wiring.ts」；
  - index 1,642 → 1,616行；
- 机制：无段内let；2个late（getRuntimeGachaRawData / getTableData，惰性箭头）；本模块 tsc 零错误（第4例）；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133=46保持）。
## x4-ag（v7.1.0-x4ag）—— x4 残余清理完毕
- wiring 第三十一簇：抽卡正则动作装配（10行；defs2 / aft1 / ext4 / late0）→「wiring/gacha-regex-actions-wiring.ts」；
  - index 1,616 → 1,609行；
- 机制：无段内let、无late、全直传；本模块 tsc 零错误（第5例）；
- 收官：index 13,018 → 1,609行（-87.6%）；残余=装配接线群+启动序列+x4-s-pre 保留组（40行，机制性保留）；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ 本模块 TS2304=0（总数108基线；TS6133=46保持）。
## x4-ah（v7.1.0-x4ah）—— import 区深挖：多行块压缩与重复导入合并
- 残余深挖第一弹（纯格式重写，零语义）：5 个多行 import 块压缩为单行 + 5 组重复模块导入合并；
  - index 1,609 → 1,531行（-78；1,610 → 1,532 元素）；
- 机制：AST 不变（符号多重集守恒 symdiff=0）；构建产物与 x4-ag 逐字节对比仅差 1 字节（版本号 g→h）；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ TS2304=108（tsc 日志与 x4-ag diff=0；TS6133=46保持）。
## x4-ai（v7.1.0-x4ai）—— 空行清理收尾，x4 系列封板
- 残余深挖第二弹（纯格式重写）：删除 index 全部 45 个空行（文件零反引号，无多行字符串风险）；
  - index 1,531 → 1,486行（-45）；
- 守恒证据：非空行序列逐行一致（1,486行）；构建产物与 x4-ah 逐字节对比仅差 1 字节（版本号 h→i）；tsc 日志与 x4-ah diff=0；
- 机制：x4 系列正式封板 —— index 13,018 → 1,486行（-88.6%），结构 = 装配接线群 + 启动序列 + x4-s-pre 保留组；
- 闸门：smoke OK / warnings12（基线，diff IDENTICAL）/ TS2304=108（TS6133=46保持）。
## x6-a（v7.1.0-x6a）—— 验证体系启动：test harness 骨架
- node 桩冒烟（load_x4j_check.js）升级为可扩展 test harness：
  - tests/harness.js（JSDOM 沙盒加载器，jsdom/jquery 多级回退解析）；
  - tests/run.js（runner，自动发现 cases/*，非 0 退出码聚合）；
  - tests/cases/01-load.js（启动无致命异常）/ 02-api.js（AcuDice API 面）/ 03-version.js（bundle ↔ constants.ts 版本一致性）；
- 入口：pnpm test / node tests/run.js [bundle路径]；
- 运行结果：PASS 3/3；产物与 x4-ai 对比仅差版本字符串（字节 -1）；tsc diff=0；warnings12 IDENTICAL；guardrails 全过；
- 注：tests/ 位于 repo 根，不参与构建与体积门；x6 系列后续批：纯逻辑单测 / jsdom 面板冒烟 / CI nightly。
## x6-b（v7.1.0-x6b）—— 纯逻辑单测首批：roll 引擎 + gacha 结构契约
- test harness 升级：bundle 通过 getBundle() 惰性单例共享（全部用例单次加载，总耗时 ~4s）；
- 新增用例：
  - 04-roll.js：骰子表达式引擎（N d1 确定性 ×6 / 随机值域 ×4×25 / 返回形状 {total, formula, breakdown}）；
  - 05-gacha-state.js：gacha getState 只读结构契约（fortune / wallet.shards×7档 / pity / activePoolTag / recentRewards）；
- 用例总数 3 → 7（PASS 7/7）；产物与 x6-a 仅差版本字符串；tsc diff=0；warnings12 IDENTICAL；guardrails 全过；
- 事实沉淀：jsdom + pretendToBeVisual 使 node 不自动退出 —— 一次性脚本须显式 process.exit(0)（runner 已含）。
## x6-c（v7.1.0-x6c）—— 单测扩展第二批：roll 语法形态 + check 检定 + 预设只读面
- 新增用例：
  - 06-roll-syntax.js：乘法 / 减法 / 括号 / 多骰组 / 空白容忍（全确定性）；
  - 07-check.js：coc 检定不变量（roll∈[1,100] / margin=target-roll / success=roll≤target / rule=coc）+ 缺目标报错契约；
    - 测试价值实证：margin 契约初判 roll-target → 实测修正为 target-roll；
  - 08-presets.js：listPresets 内置预设 / active preset id / listCharacters 只读面；
- 用例总数 7 → 11（PASS 11/11，~4.5s）；产物与 x6-b 仅差版本字符串；tsc diff=0；guardrails 全过；
- 已知事实（记录，未修复）：沙盒环境 getHistory() 抛 "map is not a function"（依赖环境存储差异，非本次范围）。
## x6-d（v7.1.0-x6d）—— jsdom 面板开合冒烟：gacha 三面板开关闭环
- harness 升级（环境仿真深化）：
  - 注入 fake-indexeddb（面板渲染链路依赖 IndexedDB）；
  - 注入常用 DOM 类 + 自动补齐 win 全部大写构造器（HTMLElement / Document 等）；
- 新增用例（3 个，全开关闭环、无残留）：
  - 09-shop-toggle.js：openShop → .acu-gacha-shell 渲染 + 状态快照 → closeShop → DOM 归零；
  - 10-settings-toggle.js：openSettings → 对话框渲染 → 点击 .acu-gacha-settings-close → 500ms → DOM 归零；
  - 11-shard-toggle.js：openShardShop → 渲染 + 关闭按钮 → closeShop → DOM 归零（备注：shard 关闭按钮点击未接入自动化，统一用 closeShop）；
- 用例总数 11 → 14（PASS 14/14）；产物与 x6-c 仅差版本字符串；tsc diff=0；guardrails 全过。
## x6-e（v7.1.0-x6e）—— CI 挂 nightly（x6 系列收官）
- 新增 .github/workflows/tests-nightly.yml：
  - 触发：schedule（每日 UTC 18:00 / cron 0 18 * * *）+ workflow_dispatch + push（feat/refactor-x，paths-ignore dist）；
  - 流水线：checkout → node 24 → pnpm 10 → pnpm install --frozen-lockfile → pnpm build → node tests/run.js dist/战斗仪表盘/stable.js → guardrails；
- devDependencies 新增 jsdom ^22.1.0、fake-indexeddb ^6.2.5（harness 回退链在 CI 经 jsdom / fake-indexeddb 直接命中）；
- pnpm-lock.yaml 同步更新（v9.0；frozen 一致性已验证）；
- 本地等效验证：14/14 PASS、guardrails 过、YAML 解析通过；推送即触发首次 run（feat/refactor-x push）。
## x7-a（v7.1.0-x7a）—— 性能与产物启动：bundle 体积门 + 模块构成侦察
- 新增 bundle 体积门（scripts/guardrails/）：
  - baseline-bundle-size.json：stable.js 基线 2,946,361 B（容差 16KB）、stable.js.map 基线 6,808,513 B（容差 64KB）；
  - check-guardrails.mjs 新增第③节：超预算即失败（CI/nightly/本地通用）；已做超预算模拟验证（退出码 1）；
- 侦察（webpack stats）：
  - 项目 7 个编译目标；stable.js = 1406 模块 / 10.7MB 源码；
  - stable 中 vue/react/pixi = 0（纯 DOM/jQuery 确认）；
  - TOP 模块：mvu-module 104K / tutorial-steps 92K / contest-panel 85K / bind-events 79K / relationship-graph 73K / SQL-json?raw 58.9K / styles 约 1MB 级；
- 后续批（x7-b+）候选：重模块初始化推迟、样式/字符串减重、依赖审计结论落地。
## x7-b（v7.1.0-x7b）—— styles 群 CSS 减重：bundle -220KB
- 范围与方法：18 个完整分片 CSS（01a-01d / 02a-c / 03a-c / 04a-c / 05a-d / 07）经 csso 保守压缩（restructure:false）+ AST 守恒验证（声明数 / 规则数全等）；
- 跳过：6 个聚合器（无模板串）+ 4 个 06 系列分片（x3-j 按空行四等分切割，单文件花括号不平衡——留给 x7-c「整体拼接 minify」方案）；
- 幂等自检：二次 / 三次运行 delta=0（稳定态）；
- 收益：源码 -211,305B；bundle 2,946,361 → 2,721,437（-224,924B，-7.6%）；map -16,122B；
- baseline-bundle-size.json 同步下调（2,721,437 / 6,792,391）；
- 闸门：harness 14/14 / warnings 12 IDENTICAL / TS2304=108 / guardrails（含体积门）全过。
## x7-c（v7.1.0-x7c）—— 06 系列整体拼接 minify + mvu/styles 减重：bundle 再 -58KB
- 06 系列（a-d 四片）：整体拼接（116,798 字符）→ csso 压缩 → 验证（D 2422 / R 553 全等、无危险字符）→ 规则边界重切 4 段（rejoin 逐字节验证）；-35.5KB；
- mvu/styles.ts：单文件压缩（38,061 → 21,028，-45%）+ AST 守恒；-17.6KB；
- 幂等自检全通过（06 重跑 rejoin-ok、mvu delta=0）；
- 收益：bundle 2,721,437 → 2,663,165（-58,272B）；map -18,846B；
- baseline 同步下调（2,663,165 / 6,773,355）；
- x7 系列累计：2,946,361 → 2,663,165（-283,196B，-9.6%）；
- 闸门：harness 14/14 / warnings 12 IDENTICAL / TS2304=108 / guardrails 全过。
## x7-d（v7.1.0-x7d）—— 依赖审计（-7 运行时依赖）+ 构建环境对齐
- 依赖清理：移除 7 个零引用运行时依赖（@pixi/react、@vueuse/components、@vueuse/integrations、@vueuse/shared、react-dom、vue3-pixi、gsap）；dependencies 24 → 17；经全项目扫描（1438 文件 + 构建配置 + AutoImport/ProvidePlugin 上下文）判定；
- 构建环境对齐：tsbuild 与 repo manifest/lock 对齐（webpack 5.109.2 → 5.111.1 等）；产物差异定性为「webpack runtime 官方输出变化」（warnings 12 完全一致、harness 14/14）；
- 类型修复：@types/toastr ≥2.1.44 不再全局暴露 ToastrOptions → actionable-error-toast.ts 本地宽松化（TS2304 回到 108 基线；类型擦除零产物影响——重建 md5 与修复前逐字节一致）；
- 闸门：harness 14/14 / warnings 12 IDENTICAL / TS2304=108 / guardrails 全过；baseline 更新（2,662,942 / 6,772,714）。
## x7-e（v7.1.0-x7e）—— 全系列总检（x1 → x7 全景复核）
### 一、bundle 体积全演进（git 历史回溯，77 tags 全量）
| 阶段 | 关键点 | 字节 |
|---|---|---|
| 基线（x1） | 重构开始 | 2,723,178 |
| x2-x3 | 巨文件拆分 + DB CSS 重接线（x3b +93KB） | 2,826,280 |
| x4 系列 | index 拆解 31 批（wiring 化开销 +119KB） | 峰值 2,946,362 |
| x6 | 验证体系（bundle 零影响） | 2,946,361 |
| x7 | 三连减重（b/c/d） | **x7d 2,662,942** |
- 峰值较基线 +223,183（+8.2%）；x7 减重较峰值 -283,419（-9.6%）；最终较基线 **-60,236（-2.2%）**。
### 二、核验清单
- index.ts 13,018 → 1,486 行（-88.6%）；TS 文件 1,399；@ts-nocheck 冻结 1,300/1,306；>100KB 仅 index。
- 测试体系：14 用例（11 文件）+ harness；tests-nightly（3 触发）+ guardrails CI 全绿（推送即验）。
- 体积门：baseline-bundle-size.json（2,662,942 / 6,772,714）；依赖面：dependencies 24 → 17；构建环境对齐（webpack 5.111.1）。
- 远程一致性：77 tags 本地=远程；加载器 @v7.1.0-x7d；CDN 双节点验证流程全覆盖。
### 三、遗留清单（未来候选）
1. x5 类型债治理（长期，当前 TS2304=108 / TS6133=46）；
2. 重模块懒初始化（需深度侦察，风险高）；
3. 沙盒 getHistory() 抛错（x6-c 记录，非产品逻辑）；
4. tutorial / build-settings-html 等大字符串（暂缓：HTML minify 风险）。
### 四、结论
x1→x7 全链条（护栏→拆分→收口→深挖→验证→产物）完成；产物净值较重构前 -60KB，index 体积 -88.6%，自动化验证与体积门持续护航。
## x5-a（v7.1.0-x5a）—— 类型债治理首批：shared/ 30 文件去 @ts-nocheck
- 范围：30 个最小 shared/ 文件（9-22 行工具 + 1 聚合器）移除 @ts-nocheck；
- 修复暴露错误：17×deps→_deps、weighted-random-select 参数类型、2 处死代码清理、2×ImageUrlValidationReason 本地化（原定义 wiring/composer-input-wiring）、actionable-error-toast 补 Window.toastr 全局声明（顺手修复既有 TS2339）；
- KPI：@ts-nocheck 1300 → 1270（-30）；冻结名单 1306 → 1276；
- 质量守恒：TS2304=108 / TS6133=46 回归基线（30 文件零残留错误）；产物字节级验证（除版本 2 字节）；
- 闸门：harness 14/14 / warnings 12 IDENTICAL / guardrails 全过。
## x5-b（v7.1.0-x5b）—— 类型债治理第二弹：shared/ 剩余 33 文件收官
- shared/ 去 @ts-nocheck 33 文件（19-257行），114 处暴露错误全部零收敛；
- 修复模式：悬空类型本地化 ×15（RegexTransformationRule / EffectResult / TextFileSelection / DiceProfileRecord / FavoriteItem / CustomTableNameIcon* 等）、declare global ×6（Window 扩展：_acuStylesInjected / _acuQuotaAlerted / jQuery / SillyTavern 等）、参数类型化 ×28（deps→_deps / 隐式 any→unknown|string|事件类型）、tavern-host 跨窗口断言、store 配额防御、convert 的 TavernRegex 运行时形态本地化（camelCase vs snake）；
- 冻结点：1276 → 1243（−33；KPI −20~30 达标）；
- 缺口标记：table-utils（60错）/ init-sortable（46错）本批回退 → x5-c 专攻；
- 闸门：harness 14/14 / warnings 12 IDENTICAL / TS2304=108 / TS6133=46（基线保持）；产物 +4 字节（findRegex 防 undefined 的 || 空串）。
