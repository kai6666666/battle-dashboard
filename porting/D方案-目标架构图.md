# D方案 · 目标架构图（移植后）

> 生成时间：2026-10-04
> 来源：`DND5E_Dashboard_BasedonST-main` v2.0.4（40 个 JS 文件 / 约 1.5MB）
> 基座：`my-tavern-scripts`（骰子系统 FSD/TS 基座）
> 形态：单脚本产物 · 双模组 = AcuDice 引擎 + DND 仪表盘界面
> 配套：`D方案-仪表盘移植清单.md`、`骰子系统-分期拆解方案.md`、`DND仪表盘与骰子系统-功能重叠地图.md`

---

## 0. 一图速览

左"新"右"旧"、上层表现下层数据。
新模块全部收进 `features/dnd-*`（10 个域，物理隔离）；
与既有 AcuDice 系统的交互只通过 **3 条接缝 + 4 个共享触点**。

---

## 1. 总架构图

```
┌──────────────────────────────────────────────────────────────┐
│ ⓪ 宿主运行时    SillyTavern + 酒馆助手（JS-Slash-Runner）       │
│    浏览器环境 · 脚本加载 · 变量表 · jQuery · 事件系统            │
└──────────────────────────────────────────────────────────────┘
                             │ import 单一产物
                             ▼
┌──────────────────────────────────────────────────────────────┐
│ ① 装配入口（既有 · 仅 4 处共享触点从此进出）                     │
│    index.ts 装配 │ wiring/ DI 接线 │ app/init.ts 启动          │
└──────────────────────────────────────────────────────────────┘
               │                                  │
               ▼                                  ▼
┌──────────────────────────────┐   ┌──────────────────────────────┐
│ ② 表现层【新】dnd-* 10 域       │   │ ③ 引擎层【复】features/ 35 域   │
│──────────────────────────────│   │──────────────────────────────│
│ dnd-core       地基·数据适配    │   │ checks/      检定引擎          │
│ dnd-ui         渲染工具         │   │ dice/        骰子核心          │
│ dnd-theme      主题·特效·背景   │   │ table/       表格 CRUD        │
│ dnd-hud        HUD·悬浮胶囊    │   │ presets/     预设体系          │
│ dnd-character  角色卡·法术      │   │ dashboard/   GM 面板          │
│ dnd-items      物品            │   │ map/         文字地图          │
│ dnd-combat     战斗·动作经济    │   │ interactions/ 互动面板         │
│ dnd-map        探索地图        │   │ ui/ layout/  面板工具          │
│ dnd-dice       骰子界面+桥      │   │ tutorial/    教程             │
│ dnd-panels     设置·面板·表格    │   │ ...（既有 35 个域）            │
└──────────────────────────────┘   └──────────────────────────────┘
        └────── 新↔旧 仅经 3 条接缝（A/B/C，见第 2 节）──────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ ④ 数据层（真后端）  龙血玄黄·数据库 naiv1.1                       │
│    window.AutoCardUpdaterAPI · SQLite · 事务 · 锁 · 125 API   │
└──────────────────────────────────────────────────────────────┘
```

**图例**

| 标记 | 含义 |
|---|---|
| 【新】dnd-* | 从 BasedonST v2.0.4 移植的模块（38 个文件，全部新增） |
| 【复】acu | 骰子系统既有模块（不搬家、直接复用） |
| 接缝 A/B/C | 新 ↔ 旧之间仅有的交互定义点 |
| S1~S4 | 全工程仅 4 处需要编辑既有文件的位置 |

---

## 2. 共享触点与接缝

```
── S1~S4 · 共享触点（全工程仅这 4 处需要编辑既有文件）───────────

 S1 index.ts           S2 shared/styles         S3 app/init.ts       S4 docs/
    注册 dnd 接线          样式入库 part-08-dnd-*     启动 dnd 模块         移植记录·
    （唯一装配改动）        （dnd- 前缀隔离）         （唯一启动改动）      CHANGELOG

── 接缝 A~C · 交互定义（除此之外，新↔旧一律禁止互通）───────────

 A · 骰子归一（b9）
     dnd-dice ──▶ AcuDice.roll() / check 引擎
     规则：投骰、检定只走 AcuDice；DND 旧逻辑降级为 bridge / 提示词兜底

 B · 数据通道（b1·b10）
     dnd-core/DBAdapter · UITableManager ──▶ 同一 AutoCardUpdaterAPI
     规则：对齐 V2/legacy 双通道；与 database-ui-override 划清 UI 边界

 C · 预设/互动（b10）
     dnd-panels/PresetSwitcher ──▶ acu presets/（若共用）
     规则：只走共享 DI 接口，不互相 import
```

---

## 3. 模块落点表（40 文件 → 10 域，全量）

| # | 目标域（features/dnd-*） | 源文件（v2.0.4） | 批次 | 说明 |
|---|---|---|---|---|
| 1 | `dnd-core` | Logger·Utils·SettingsManager·DBAdapter·TavernAPI·Config·DataManager·ItemManager·TemplateSync·EmbeddedTemplate·TavernSettingsSync（11） | b1-b2 | 地基与数据适配；DataManager 拆 4 块；DBAdapter 对齐 V2/legacy |
| 2 | `dnd-ui` | UIRenderer·UIUtils（2） | b3 | 渲染工具 |
| 3 | `dnd-theme` | styles·ThemeManager·StyleManager·StylePresets·StyleEffects·StyleValidator·DynamicBackground·SVGIcons·icons（9） | b3+b11 | styles 拆 `part-08-dnd-*`；StylePresets 懒加载+校验 |
| 4 | `dnd-hud` | UICore·UIHUD·UpdateController（3） | b4 | 里程碑 M1 ★ |
| 5 | `dnd-character` | UICharacter·UISpells（2） | b5 | M2 ★；UICharacter 必须拆 |
| 6 | `dnd-items` | UIItems（1） | b6 | M3 |
| 7 | `dnd-combat` | UICombat（1） | b7 | M4 |
| 8 | `dnd-map` | ExplorationMapManager·UIMap（2） | b8 | M5 ★ |
| 9 | `dnd-dice` | UIDice·DiceRulesInjector·DiceManager（3） | b9 | M6 ★；改接 AcuDice |
| 10 | `dnd-panels` | UISettings·UIPanels·UITableManager·PresetSwitcher（4） | b10 | 与 database-ui-override 划界 |
| — | 装配层 | index.js·header.js（2） | b12 | index.ts 装配重写 |

合计：38 + 2 = 40 个文件 ✅

---

## 4. 典型数据流

```
① 行动选项（UI → 数据）
   玩家点 [选项A] ─▶ dnd-hud 读表 ─▶ AutoCardUpdaterAPI ─▶ SQLite
        ◀── 生成提示词 ◀── 写入 #send_textarea（玩家确认后发送）

② 检定 / 投骰（UI → 引擎 → 数据）
   dnd-dice ─[接缝A]─▶ AcuDice.roll() / check 引擎
        ◀── 结果 ◀── dnd-hud 结果胶囊 ◀── 结果写回表格（API）
```

---

## 5. 里程碑叠层

```
b0 基线 ─▶ b1-b3 地基·数据·主题 ─▶ M1(b4) HUD ─▶ M2(b5) 角色
       ─▶ M3(b6) 物品 ─▶ M4(b7) 战斗 ─▶ M5(b8) 地图 ─▶ M6(b9) 骰子归一
       ─▶ b10 面板 ─▶ b11 视觉 ─▶ b12 发布整合
```

---

## 6. 隔离约束（引用移植清单，全程适用）

- 新代码走「工厂 + DI、三条铁律」；每批过「七道闸门」+ 对照验收
- CSS 前缀 `dnd-` / 变量 `--dnd-`，与 `acu-*` 隔离
- `dnd-*` 不 import acu 内部实现，只经 S1~S4 / 接缝 A~C（DI 接口）交互
- 双轨验证：旧版独立加载 vs 新模块，同房间对比

---

## 7. 开放项（施工时拍板）

- [ ] dnd-* 命名风格（前缀 `dnd-hud` vs 后缀 `hud-dnd`）
- [ ] `dnd-ui` 与 `dnd-theme` 是否合并为一个域
- [ ] PresetSwitcher：维持独立 or 并入 acu presets
- [ ] UIDice 旧自研路径：bridge 保留 or 全退役

---

相关文档：`D方案-仪表盘移植清单.md`、`骰子系统-分期拆解方案.md`、`DND仪表盘与骰子系统-功能重叠地图.md`
