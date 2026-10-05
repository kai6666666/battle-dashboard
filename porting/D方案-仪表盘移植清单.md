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
- [ ] **b10c**：UITableManager(44.1K → 拆块；划清与 `database-ui-override` 边界)
- [ ] **b10d**：收口（外观统一②③ / 悬浮球二合一（D20）/ 骰子功能入口汇总）
- 验收：设置全通、表格增删改正常

### b11 视觉完整（4-6 天）
- [ ] StylePresets(258.7K → 懒加载+校验)
- [ ] StyleEffects(47.2K)、StyleValidator(28.5K)
- [ ] DynamicBackground(49.1K)、SVGIcons(6.1K)、icons(3.5K)
- 验收：全主题/特效/背景与 v2.0.4 一致

### b12 发布整合（2-3 天）
- [ ] index.js(6.5K) 装配重写
- [ ] header.js(0.3K)
- [ ] 清 feature flag、更新文档
- 验收：单产物发布

## 增补事项
- [ ] **悬浮球二合一**（骰子折叠触发器 × D20 球 → 唯一 D20 球：长按/双击开骰子面板 + S1 桥 + 触发器隐藏）
  → 时机：**后期做**（b10/b12 窗口，2026-10-05 拍板）

## 估算与里程碑
- 总量：约 **45~65 人日**（兼职约 2.5~3 个月；投入式 1~1.5 个月）
- 里程碑：M1(HUD) → M2(角色) → M5(地图) → M6(骰子归一)，每个里程碑均可对外发版

---
相关文档：`DND仪表盘与骰子系统-功能重叠地图.md`、`骰子系统-分期拆解方案.md`
