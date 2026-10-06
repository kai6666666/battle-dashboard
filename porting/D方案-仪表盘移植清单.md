# D方案 · 仪表盘移植清单（BasedonST-main → 骰子系统基座）

> 生成时间：2026-09-26
> 源：`DND5E_Dashboard_BasedonST-main` **v2.0.4**（40 个 JS 文件，约 1.5MB 源码；已发布 commit `ba8aae4` / tag `v2.0.4`）
> 目标：骰子系统仓库（`my-tavern-scripts`，FSD/TS 基座）；`AcuDice` 当引擎、仪表盘当界面
> 相对旧版清单的差异：模板=`DND5E_SQL_9.20.json`；保留 TavernAPI 关键词过滤；DataManager 无下划线别名表；UICharacter 资源查询兼容版

## 通用规则（全程适用）
- 新代码走「工厂 + DI、三条铁律」；每批过「七道闸门」+ 对照验收
- CSS 前缀 `dnd-` / 变量 `--dnd-`（与 `acu-*` 隔离）
- 双轨验证：旧版独立加载 vs 新模块，同房间对比
- 共享触点仅 4 处，与「骰子系统分期拆解」批次错开：`index.ts 接线`、`shared/styles`、`app/init.ts`、`docs`

## 批次清单（勾选进度）

### b0 基线（1-2 天）— ✅ 已启动（2026-10-04）
- [x] 给 BasedonST-main 打 tag（`port-baseline`）→ `bac92b25`（v2.0.5）｜DND_immersive_dashboard
- [x] 建立新旧对照测试环境（旧版独立加载）→ 材料已备（自动更新版加载器）；酒馆侧配置待做

### b1 地基适配（2-3 天）— ✅ 已完成（2026-10-04）
- [x] Logger(2.3K)、Utils(1.4K)、SettingsManager(2.4K) → 适配层（工厂+DI）
- [x] DBAdapter(9.6K) → 对齐 AutoCardUpdater V2/legacy（IndexedDB + LocalStorage 兜底）
- [x] TavernAPI(21.4K) → 保留关键词过滤（世界书四重保障）
- [x] Config(8.4K)
- [x] 附加：TavernSettingsSync(17K) 随 b1 附带移植（SettingsManager 依赖）
- [x] S3 接线：`app/init.ts` 启动 dnd-core（幂等）
- 验收：初始化成功（`[dnd-core] 就绪 ✅`）+ 读设置验收（`dnd_global_api_config`）

### b2 数据与模板（3-5 天）— ✅ 已完成（2026-10-04）
- [x] DataManager(49.9K → 拆 4 块：表解析 tables / 队伍 party / 技能专长 skills / 导入导出 io)
- [x] ItemManager(2.1K)
- [x] TemplateSync(7.7K) + EmbeddedTemplate(0.1K)（`DND5E_SQL_9.20` 随包内置 assets/，已进 bundle）
- [x] ~~TavernSettingsSync(17K)~~（b1 已附带完成）
- [x] 附加：notify 适配器 / save-bridge（api.importTableAsJson 主通道，b9 可升级为完整版）
- 验收：读表验收钩子（`CHARACTER_Registry 行数`）+ 模板随包（sheet_quanjuzhuangtai ×7）+ guardrails✅ / tests 16/16✅

### b3 渲染工具（3-4 天）— ✅ 已完成（2026-10-05）
- [x] UIRenderer(1.9K)、UIUtils(30.7K) → features/dnd-ui/（4 文件）
- [x] styles.js(134.7K → 拆为 `part-08-dnd-*` 5 块并入库 shared/styles)
- [x] ThemeManager(8.6K)、StyleManager(37.7K → 先接最小默认主题 classic-dnd)
- [x] S3 接线：app/init.ts（core → theme → ui 幂等；window.DND_Dashboard_UI）
- 验收：✅ 主题 4 套就绪（dark/forest/crimson/arcane）/ 切换无污染 / tests 16/16 / guardrails✅

### b4 HUD（里程碑 M1，5-7 天）— ✅ 已完成（2026-10-05）
- [x] UICore(46K → 拆 5 块：状态机/悬浮球/助手按钮/动态背景桥/init)
- [x] UIHUD(65K → 拆 5 块：渲染/战斗/探索/底栏/NPC)
- [x] UpdateController(1.6K) → 防回弹控制器（runSilently/handleUpdate；D2 决策：骰子池调用可选化）
- [x] S3 接线：app/init.ts（DOM 能力环境门：浏览器/酒馆执行，测试 vm 跳过）
- 验收：✅ 构建 / tests 16/16 / guardrails；酒馆侧待实测（悬浮球 / Mini HUD / 防回弹）

### b5 角色/法术（里程碑 M2，6-8 天）— ✅ 已完成（2026-10-05）
- [x] UICharacter(123.3K → 拆 7 块：头像/角色卡/创建向导×3/升级向导 + prelude)
- [x] UISpells(11.9K → character-spells：法术详情/法术位/法术书)
- [x] 跨域 this 全局化（含 b4 HUD 17 处缺口补丁；未上线批次安全降级）
- [x] S3 接线：app/init.ts（core → theme → ui → hud → character 链）
- 验收：✅ 构建 / tests 16/16 / guardrails；酒馆侧待实测（角色卡/创建向导/升级向导）

### b6 物品（里程碑 M3，3-4 天）— ✅ 已完成（2026-10-05）
- [x] UIItems(37.7K → 拆 3 块：卡片 / 操作 / 面板)
- [x] 跨域全局化（showItemDetailPopup / showQuestTooltip 转正；hud 调用自动命中）
- [x] S3 接线：app/init.ts（… → items 链）
- 验收：✅ 构建 / tests 16/16 / guardrails；酒馆侧待实测（列表 / 详情 / 装备交互）

### b7 战斗（里程碑 M4，4-6 天）— ✅ 已完成（2026-10-05）
- [x] UICombat(29.8K → 拆 4 块：状态·行动经济 / 施法·瞄准 / 动作队列 / 战斗面板)
- [x] 跨域全局化（resetActionEconomy / initResourceTracker / renderResourceConsumption 等 4 处转正）
- [x] S3 接线：app/init.ts（… → combat 链）
- 验收：✅ 构建 / tests 16/16 / guardrails；酒馆侧待实测（回合 / 先攻 / 动作经济 / 法术位扣减）

### b8 地图（里程碑 M5，5-7 天）— ✅ 已完成（2026-10-05）
- [x] ExplorationMapManager(22.2K → 拆 3 块：AI层/探索核心/战斗地图；自引用形态保留)
- [x] UIMap(43.9K → 拆 4 块：缩放·拖拽 / 迷你渲染 / 重绘 / 交互)
- [x] S3 接线：app/init.ts（… → map 链）
- 验收：✅ 构建 / tests 16/16 / guardrails；酒馆侧待实测（地图 / 迷雾 / Token / 瞄准 / 自动绘制）

### b9 骰子归一（里程碑 M6，4-6 天）— ✅ 已完成（2026-10-05）
- [x] UIDice(30.8K → 拆 4 块：面板 / 投骰 / 快捷栏×2；**引擎优先改接 `window.AcuDice.roll`**（不可用时本地回退）)
- [x] DiceRulesInjector(7K → 移植保留；世界书 JSON 内联，延迟初始化)
- [x] DiceManager(8K → **退役**：saveData 调用链路统一走 SaveBridge（dnd-core）; 骰子池可视化 → 引擎状态展示)
- [x] 附带修复：dnd-map 两处 saveData 接线（b8 遗漏项）
- 验收：✅ 构建 / tests 16/16 / guardrails；酒馆侧待实测（投骰=AcuDice 结果、结果渲染统一、无双重骰子渲染）

### b10 管理面板（5-7 天）— 🚧 进行中（拆分四子批）
- [x] **b10a**（2026-10-05）：UISettings(69.4K 整文件搬运) + PresetSwitcher(5K) → tag `v0.0.12-b10a`（combat presetSwitcher 动态代理接真）
- [x] **b10b**（2026-10-05）：UIPanels(63.3K → 拆 7 块：主入口/队伍/背包/NPC/档案×3；UICharacter 动态代理) → tag `v0.0.13-b10b`
- [x] **b10c**（2026-10-05）：UITableManager(44.1K → 拆 4 块 + 样式独立 559 行；与骰子侧编辑器边界注释、b12 收口) → tag `v0.0.14-b10c`
- [x] **b10d**（2026-10-05）：收口完成 — S1桥 `__acuToggleDicePanel` / D20球长按·双击开骰子面板 / 设置面板入口按钮 / 骰子折叠触发器融合隐藏 → tag `v0.0.15-b10d`
- ✅ **b10 管理面板 全部完成**（b10a~b10d）
- 验收：设置全通、表格增删改正常

### b11 视觉完整（4-6 天）— 🚧 进行中（拆分四子批）
- [x] **b11a**（2026-10-05）：StylePresets(258.7K → 12 风格拆 13 文件 + dnd-theme 接入) → tag `v0.0.16-b11a`（单产物约束下"懒加载"= 静态打包 + 运行时懒校验）
- [x] **b11b**（2026-10-05）：StyleEffects(47.2K) + StyleValidator(28.5K) 整文件工厂包裹接入（morphology→真实CSS规则 / 导入安全校验）→ tag `v0.0.17-b11b`
- [x] **b11c**（2026-10-05）：DynamicBackground(49.1K) 入 dnd-theme + 六处接线（theme/ui/hud/settings/渲染器）；2D canvas 环境门（测试 vm 安全）→ tag `v0.0.18-b11c`
- [x] **b11d**（2026-10-05）：SVGIcons(6.1K → ICONS 50+ 键 + getWeatherIcon) 全局注册 + 8 域 iconProxy 运行时接真；icons.js 不打包（依赖宿主 FA 渲染 `<i>`，与骰子系统一致）→ tag `v0.0.19-b11d`
- ✅ **b11 视觉完整 全部完成**（b11a~b11d）
- 验收：全主题/特效/背景/图标就位（酒馆实测）

### b12 发布整合（2-3 天）— ✅ 已完成（2026-10-05）
- [x] index.js(6.5K) 装配重写 → 由 b1~b11 逐批 S3 接线完成；b12 补 4 项初始化对齐（点击动效 / 预设配置启动加载 / 通知回调 / 模板同步）
- [x] header.js(0.3K) → 职责由 loader json（酒馆助手脚本-[加载·自动更新版]）承担，不再单文件
- [x] feature flag：融合版未引入独立 flag（DND 源 index.js 亦无）；无需清理
- [x] 单产物发布：dist/战斗仪表盘/stable.js（3,731,031 B）✅
- ✅ **b0~b12 全链完成 —— 融合版 v0.0.20**
- 🔧 **b12.1 实测修复（2026-10-05）**：① 模板确认弹窗改自建 DOM 对话框（去 toastr 依赖；不再显示原始 HTML，可正常关闭）② 主面板导航点击即时渲染（`self.renderPanel` 全局化）→ tag `v0.0.21-b12.1`
- 🔧 **b12.2 实测修复（2026-10-05）**：Mini HUD 渲染链修复 — hud 的 presetSwitcher/tableManager 改跨域桥代理（renderHUD 不再因 stub 缺方法中断）+ 防御包裹 → tag `v0.0.22-b12.2`
- 🔧 **b12.3 实测修复（2026-10-05）**：Mini HUD 开关行为（logo 热区收窄 + 收起按钮）／数据库 AI 选项放宽 → tag `v0.0.23-b12.3`
- 🔧 **b12.4 实测修复（2026-10-05）**：球点击逐级切换（collapsed→mini→full→mini）+ 连锁点击抑制 / 移除「−」按钮 → tag `v0.0.24-b12.4`
- 🔧 **b12.5 实测修复（2026-10-05）**：悬浮球纯开关（点=开 Mini HUD / 再点=关 Mini HUD；主面板入口在小窗「D20」）→ tag `v0.0.25-b12.5`
- 🔧 **b12.6 实测修复（2026-10-05）**：Mini HUD 点击链全修 —— ① 跨域方法缺失补齐（选项 fillChatInput / 队伍 showCharacterCard / 底栏 5 项 / 战斗单位）② 弹窗 × 按钮 inline onclick → 脚本绑定（detail-popup / quick-trigger / 队列 / NPC 卡 / 队伍按钮）③ 全局对象同步宿主顶层窗口兜底 → tag `v0.0.26-b12.6`
- 🚀 **b12.7 骰子面板四项迁移（2026-10-06）**：① 骰子完整设置 → DND 设置页「骰子面板设置」区块（打开骰子设置弹窗）② 骰子底栏按钮 → Mini HUD 底栏（打开数据库 / 可视化编辑；手动更新替换为骰子 runDatabaseManualUpdate 双通道）③ 骰子商店 / 物品栏 / 装备栏 → Mini HUD 背包弹窗顶部入口 ④ 人物关系图 + 角色头像预设 → 角色卡弹窗头部按钮；新增 `window.__acuUI` UI桥（含 DND 适配版关系图/头像）→ tag `v0.0.27-b12.7`
- 🔧 **b12.8 实测调整（2026-10-06）**：① 底栏按钮顺序（打开数据库 / 可视化编辑 移至骰子后、手动更新前）② 骰子弹窗层级守护——MutationObserver 将 `.acu-*-overlay` 弹窗实时提升至 z-index 2147483647，盖过 Mini HUD（2147483640）/ 角色卡 / 详情弹窗 → tag `v0.0.28-b12.8`
- 🚀 **b12.9 骰子功能入口二（2026-10-06）**：① A方案——主面板导航栏新增 4 项（数据审核 / 变量管理 / 收藏夹 / 交互总览，位于「数据归档」与「设置」之间）② B方案——Mini HUD 底栏新增「⋯ 更多」菜单（数据审核 / 变量管理 / 收藏夹）③ 新增 `openDicePanelTab` 桥（打开骰子面板 + 切换对应 tab + 层级提升至 DND 之上）④ 骰子按钮（快速投掷）诊断增强（双路调用 + 错误日志）→ tag `v0.0.29-b12.9`
- 🔧 **b12.10 骰子按钮修复（2026-10-06）**：真凶 = `dice-panel.ts` 模板中裸引用 `ICONS.SYNC`（未定义标识符 → ReferenceError，弹窗永不出现）；修复为 `deps.icons.SYNC`；错误日志改进为输出 `err.message`（更易诊断）→ tag `v0.0.30-b12.10`
- 🔧 **b12.11 投骰融合深化（2026-10-06）**：① 快投面板新增「完整投骰面板」入口（`showDicePanelForDnd` 桥 → 骰子系统完整检定面板：COC/DND 规则切换 / 预设 / 成功标准 / 难度等级）② 投骰结果展示加固——`find('> div')` → `children('div')`（兼容旧 jQuery）+ 结果弹窗 fallback（弹窗不存在时自动新开，保证特效可见）→ tag `v0.0.31-b12.11`
- 🔧 **b12.12 投骰结果卡空白修复（2026-10-06）**：真凶 = 结果卡的 JS 两段式透明动画（`opacity:0` 起始 + 10ms setTimeout 恢复）在宿主环境被节流卡死 → 显示为空白块；重写为 **CSS 动画类 `dnd-roll-pop`**（无 JS 透明初始态，动画失败也直接可见）+ 插入位置改为内容容器 `prepend` + 全段 try-catch → tag `v0.0.32-b12.12`
- 🔧 **b12.13 投骰结果原生渲染（2026-10-06）**：升级为**原生 DOM**（`createElement` + `insertBefore`）+ inline 强制 `opacity:1;visibility:visible`（彻底杜绝透明卡死）+ **诊断日志**（`[DND] 投骰结果已插入: <outerHTML>` / 找不到容器警告）→ tag `v0.0.33-b12.13`
- 🚀 **b12.14 Mini HUD 选项升级（2026-10-06）**：骰子同款能力 + DND 原能力融合——点击选项：若骰子设置 `clickOptionToAutoSend` 开启 → **自动发送**（`smartSendText` 桥，多通道兼容）；否则/失败 → 回退 **填入输入框**（DND 原行为）；不加标题栏保持简洁 → tag `v0.0.34-b12.14`
- 🚀 **b12.15 选项深化 + 表格收口（2026-10-06）**：① 选项深化——接入骰子其他选项表（`isOptionTableName` 转置扫描，去重 DND 表，无前缀 • 标记）+ **检定建议按钮**（`executeCheckSuggestion`）+ **字号同步**（`optionFontSize`）；保留 A-D 原渲染 ② 表格编辑收口（按决策 §6.2-7）——**移除编辑器 A（dnd-table 域全删）**，Mini HUD「▼」栏改为**跳转骰子侧表格编辑器**（`openDatabaseVisualizerInterface`，B 唯一编辑权）→ tag `v0.0.35-b12.15`
- 🔧 **b12.16 ▼行为修正（2026-10-06）**：根据实测截图澄清——「表格管理界面」= **骰子面板的导航盘**（表格总览），非数据库可视化编辑器；▼ 点击改为 **`__acuToggleDicePanel()` 打开骰子面板**（显示全部表格入口导航盘）→ tag `v0.0.36-b12.16`
- 🚀 **b12.17 表格管理镜像内嵌（2026-10-06）**：▼ 展开行为恢复——在**原编辑器 A 的区域**（`#dnd-table-manager-container`）**内嵌骰子导航盘镜像**：特殊入口 4 枚（审核/变量/收藏夹/交互总览）+ 全部表格入口（`getTableNavItems` 含隐藏过滤/图标）；点击经 `openDicePanelTab` / `openDicePanelTable` 由骰子面板中转（编辑在骰子侧）→ tag `v0.0.37-b12.17`
- 🚀 **b12.18 内容弹窗化（2026-10-06）**：点击镜像项**不再打开骰子面板**——① 表格项 → **表详情弹窗**（DND 渲染：表名/行数 + 全字段表格，只读，`renderTableDetailHtml`）② 特殊项 → **视图弹窗**（自建遮罩弹窗，`renderAcuViewHtml` 渲染骰子视图 HTML：审核/交互总览=同步字符串、收藏夹=异步；变量=提示+跳转按钮）→ tag `v0.0.38-b12.18`
- 🚀 **b13.1 表格宿主嵌入（2026-10-06）**：融合方案 §4.1/§5 首批——① 桥新增 `renderTableHostForDnd`（渲染直调 `renderTableContent`）+ `dndTableOp`（search/page/reverse）+ `getAcuThemeClass` ② Mini HUD「▼」点击表 → **内嵌完整表格视图**（不再弹窗/不打开骰子面板）：返回条 + `.dnd-acu-table-host`（骰子主题类）+ 搜索（防抖300ms+焦点恢复）/ 分页 / 倒序 / 关闭→返回列表 ③ 骰子样式为裸类选择器（全局生效），嵌入后样式原样可用 → tag `v0.0.40-b13.1`
- 🚀 **b13.2 事件多宿主（2026-10-06）**：DND 事件层——① 单元格点击 → **全功能菜单**（编辑内容/整体编辑/表尾新增行/复制/收藏此行/撤销修改/删除整行/锁定，`showCellMenuForDnd` 伪事件直调 `showCellMenu`，菜单内部自带全部 handler）② 书签（`toggleBookmarkForDnd` + 拦截防双触）③ 交互动作按钮（`runCardActionForDnd` 复刻 DOM→getInteractOptionsForRow→executeTableInteractionAction）→ tag `v0.0.41-b13.2`
- 🔧 **b13.2.1/b13.2.2 菜单层级修复（2026-10-06）**：单元格菜单被 Mini HUD 浮层遮盖——**真因**：菜单 CSS 为 `z-index:31111 !important`（部分为 31266），inline 非 important 提升无效；**修复**：`setProperty('z-index','2147483647','important')`（inline important 击败样式表 important）+ backdrop 同步提升 + 50ms 双保险 → tag `v0.0.42-b13.2.1` / `v0.0.43-b13.2.2`；另确认 b12.8 overlay 守护（`features/dnd-ui/index.ts`，规则 `acu-*-overlay` 提升至 2147483647）覆盖编辑弹窗等所有骰子 overlay
- 🔧 **b13.2.3 三项实测修复（2026-10-06）**：① 编辑/整体编辑/收藏弹层防盖——DND 侧新增**强力层级守护**（MutationObserver：任何新增含 `acu-`/`toast` 节点 → sweep 提升所有 overlay/菜单/toast 至 2147483647）② **backdrop 逃逸清理**（backdrop 存在但菜单不存在 → 自动移除，治锁定后 UI 无响应）③ `ensureAcuCachedData` 桥（打开表时保障 cachedRawData 就绪，修编辑/锁定/收藏依赖）④ 移除「← 返回表格列表」条，关闭统一走表格右上角 × → tag `v0.0.44-b13.2.3`
- 🔧 **b13.2.4（2026-10-06）**：① `show-cell-menu` 缓存回退（cachedRawData 为空改用实时 getTableData，锁定/收藏不再静默失败）② 菜单激活后 **2.5s 弹层跟踪轮询**（每 120ms 提升所有子弹窗，双窗口覆盖）→ tag `v0.0.45-b13.2.4`
- 🚀 **b13.2.5 锁定真因修复 + 视图可编辑化（2026-10-06）**：① **锁定真因**（日志铁证：「找不到表格的 rowIndex」）= `PRIMARY_KEYS` 仅含 14 张旧模板表，DND 融合表（中文名前缀）不在映射 → `findRowIndexByPrimaryKey` 返回 null → 锁定条件短路（骰子面板+Mini HUD 同步失效）；修复 = **fallback**（表不在映射时从 `字段名=值` 解析字段自行定位行）② **变量面板**：DND 弹窗直接 `MvuModule.renderPanel()+bindEvents`（可编辑，不再跳骰子面板）③ **收藏夹**：DND 弹窗绑定 `bindFavoritesEvents`（编辑菜单可用）④ **审核**：DND 弹窗调用 `bindChangesEvents`（应用/回滚/编辑按钮可用）→ tag `v0.0.46-b13.2.5`
- 🔧 **b13.2.6 视图弹窗定位修复（2026-10-06）**：收藏夹/审核/变量弹窗显示在 Mini HUD 下方——真因：弹窗容器用 `inset:0`（旧内核兼容性问题，定位失效落在页面流中）+ z-index 未拉满；修复：**JS 强制定位**（top/left/right/bottom + 100vw/100vh + flex 居中 + z-index 2147483647 全量 JS 设置，不依赖 CSS 解析）→ tag `v0.0.47-b13.2.6`
- 🔧 **b13.2.7~b13.2.12 弹窗层级诊断链（2026-10-06）**：视图弹窗（收藏夹/审核/变量）被盖——逐轮实测诊断：① b13.2.7 版本指纹 + HUD 启动即装守护 + 弹窗诊断日志；② b13.2.8 凶手探测器（elementFromPoint 命中测试）；③ b13.2.9 跨文档对齐；④ b13.2.10 跨窗口逐层搜索 HUD 并迁移（最多 6 层）；⑤ b13.2.11 收藏夹菜单源头提层（创建处 setProperty z-index 2147483647 important，不依赖守护时机）；⑥ b13.2.12 Console 抓取取消自动恢复（restore 不再自动开启 + 错误路径只显紧急按钮）→ tags v0.0.48-b13.2.7 → v0.0.53-b13.2.12
- 🚀 **b13.2.13 真·顶层迁移（2026-10-06）**：弹窗打开时逐层向上找到可达的最高文档（优先真·top）→ 迁移 + 全量固定定位重设（fixed/全屏/居中/z 2147483647 均 !important）→ 切换版本场景滚动不再影响 → tag v0.0.54-b13.2.13
- 🚀 **b13.2.14 弹窗降级保顶（2026-10-06）**：① 弹窗打开期间降级**所有可达文档**中 DND 浮层（Mini HUD/通知/快栏）至 3640（`dnd-z-lowered` 标记，z 守护自动 skip 不再提层）② 弹窗移至所在 body 末尾（DOM 顺序最后=同层最上）③ 诊断 v4（popupAt 文档索引/hudCounts 各文档 HUD 计数/lowered 降级数）④ 弹窗关闭时自动恢复原 z → tag v0.0.55-b13.2.14

## 增补事项
- [x] **悬浮球二合一**（✅ 2026-10-05 完成，v0.0.15-b10d）：唯一 D20 球（长按/双击开骰子面板）+ S1 桥 `__acuToggleDicePanel` + 触发器融合隐藏
  → 时机：**后期做**（b10/b12 窗口，2026-10-05 拍板）

## 估算与里程碑
- 总量：约 **45~65 人日**（兼职约 2.5~3 个月；投入式 1~1.5 个月）
- 里程碑：M1(HUD) → M2(角色) → M5(地图) → M6(骰子归一)，每个里程碑均可对外发版

---
相关文档：`DND仪表盘与骰子系统-功能重叠地图.md`、`骰子系统-分期拆解方案.md`
