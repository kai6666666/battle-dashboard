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

### b3 渲染工具（3-4 天）
- [ ] UIRenderer(1.9K)、UIUtils(30.7K)
- [ ] styles.js(134.7K → 拆为 `part-08-dnd-*` 并入库)
- [ ] ThemeManager(8.6K)、StyleManager(37.7K，先接最小默认主题)
- 验收：主题应用正常、切换无污染

### b4 HUD（里程碑 M1，5-7 天）
- [ ] UICore(46K → 拆：开关/悬浮球/防抖/助手按钮)
- [ ] UIHUD(65K → 拆：Mini HUD/状态胶囊/NPC 列表)
- [ ] UpdateController(1.6K) → 与仓库 update-controller 合并
- 验收：**Mini HUD 完整可用**（HP/AC/状态/悬浮球/按钮呼出/防回弹）

### b5 角色/法术（里程碑 M2，6-8 天）
- [ ] UICharacter(123.3K → **必须拆**：属性/技能专长/资源/创建向导/升级向导)
- [ ] UISpells(11.9K)
- 验收：全 Tab 渲染 + 升级向导流程

### b6 物品（里程碑 M3，3-4 天）
- [ ] UIItems(37.7K)
- 验收：列表/详情/装备交互

### b7 战斗（里程碑 M4，4-6 天）
- [ ] UICombat(29.8K) + 相关逻辑
- 验收：回合/先攻/动作经济/法术位扣减

### b8 地图（里程碑 M5，5-7 天）
- [ ] ExplorationMapManager(22.2K)
- [ ] UIMap(43.9K)
- 验收：地图/迷雾/Token/瞄准/自动绘制

### b9 骰子归一（里程碑 M6，4-6 天）
- [ ] UIDice(30.8K → 改接 `AcuDice.roll/check`)
- [ ] DiceRulesInjector(7K) 保留
- [ ] DiceManager(8K → **退役**；🟡 2026-10-04 决策：骰子池移除、投骰统一走 AcuDice。原"预生成池保留为提示词层兜底"表述作废)
- 验收：投骰=AcuDice 结果、结果渲染统一、无双重骰子渲染

### b10 管理面板（5-7 天）
- [ ] UISettings(69.4K)、UIPanels(63.3K)
- [ ] UITableManager(44.1K)（划清与 `database-ui-override` 边界）
- [ ] PresetSwitcher(5K)
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

## 估算与里程碑
- 总量：约 **45~65 人日**（兼职约 2.5~3 个月；投入式 1~1.5 个月）
- 里程碑：M1(HUD) → M2(角色) → M5(地图) → M6(骰子归一)，每个里程碑均可对外发版

---
相关文档：`DND仪表盘与骰子系统-功能重叠地图.md`、`骰子系统-分期拆解方案.md`
