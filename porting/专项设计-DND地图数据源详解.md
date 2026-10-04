# 专项设计 · DND 地图数据源详解（探索地图 × 战斗地图）

> 生成时间：2026-10-05
> 用途：勘察 DND 仪表盘（BasedonST v2.0.5 / port-baseline）地图系统的**全部数据来源**，为融合版 b4/b5 地图模块提供对接依据。
> 证据：`src/features/ExplorationMapManager.js`（464 行）、`src/ui/modules/UIMap.js`（874 行）、`src/core/DBAdapter.js`。

## 一、总观

- **模式开关**：全局数据表 `战斗模式 === '战斗中'` → 战斗地图；否则 → 探索地图（UIMap.js L229-231）。
- **两种地图、两条数据线**；共用一个 SVG 存储层（IndexedDB + Chat Metadata）。

## 二、探索地图

### 2.1 显示地点判定（三级链，UIMap.js L229-245）

1. `SYS_GlobalState.当前场景`（主源）
2. `EXPLORATION_Map_Data.当前显示地图` = 是/true/1 的行 → `LocationName` 覆盖
3. fallback：'未知区域'

### 2.2 地图内容读取（四级优先级，ExplorationMapManager.getMap L293-355）

1. **Chat Metadata** `map_{地点名}`（最高优先）
2. **IndexedDB** `svg_maps`，key = {地点名}
3. **结构表** `EXPLORATION_Map_Data`（LocationName → MapStructureJSON）
4. **AI 两阶段生成**：structure（地牢结构 JSON）→ svg（手绘风 SVG）→ 回写（表 + IndexedDB + Chat Metadata）

### 2.3 渲染

- `.dnd-exploration-inner` 注入 SVG；等比适配缩放；“重绘”按钮（forceRegen 保持结构重绘图片）。

## 三、战斗地图

### 3.1 网格尺寸

- `COMBAT_BattleMap` 中 `类型 === 'Config'` 行的 `坐标` 列（size 型解析）= cols × rows；默认 20×20（UIMap.js L393-402）。

### 3.2 四层渲染数据

| 层 | 数据源 | 说明 |
|---|---|---|
| 底图 | `COMBAT_Map_Visuals`（SceneName / VisualJSON / GridSize / LastUpdated） | AI 生成俯视战斗底图；缓存键 `BATTLE_MAP_{场景}_{W}x{H}` |
| 网格 | 前端动态绘制（SVG pattern） | 非表数据 |
| Token | `COMBAT_BattleMap`（单位名称/类型/坐标/大小/Token） | 每行一个单位；坐标 coord 型；DOM token + 头像（聊天绑定）+ active 高亮 |
| 行动者/回合 | `COMBAT_Encounter` + `当前回合` | 先攻 / 当前行动者 |

### 3.3 底图生成管线（getBattleMap L381-464）

- 读取优先级同探索（Chat → IndexedDB → 表 → AI）；结构存 `COMBAT_Map_Visuals`；SVG 存 IndexedDB + Chat。

## 四、存储层速查

| 层 | 位置 | 键 |
|---|---|---|
| 表 | `EXPLORATION_Map_Data` / `COMBAT_Map_Visuals` / `COMBAT_BattleMap`(+`COMBAT_Encounter`) | — |
| IndexedDB | `DND_Immersive_DB` / `svg_maps` store | `{地点名}`、`BATTLE_MAP_{地点}_{W}x{H}` |
| Chat Metadata | TavernSettingsSync | `map_{地点名}`、`map_BATTLE_MAP_{...}` |

## 五、融合基座对照（现状）

| 表 | 基座键 | 状态 |
|---|---|---|
| 🗺️ 战斗地图 | sheet_zhandouditu | ✅ 已并入（v3） |
| 🖌️ 战斗地图绘制 | sheet_zhandoudituhuizhi | ✅ 已并入（v3） |
| ⚔️ 战斗遭遇表 | sheet_zhandouzaoyubiao | ✅ 已并入（v3） |
| 🗺️ 探索地图数据 | sheet_tansuoditushuju | ⚠️ 未入基座——**表级处置待拍板**（建议：补为第 21 表） |
| 世界地图点 / 地图元素表 | sheet_world_map / sheet_map_elements | ✅ 在（叙事层，≠渲染层） |

> 引用：《功能重叠地图》§6.2-6（叙事唯一源=世界地图点+地图元素表；渲染层=探索地图数据，待拍板；主视图=A）；
> 《扩列草案》注记（地图渲染 3 列不补，DND 侧表自持 → 表级处置待拍板）；《方案A详解》（预留“双地图切换”）。

## 六、融合施工注意点（本次勘察新发现）

### 6.1 全局数据表字段差异（读表适配层核心映射）

DND 地图代码读取的字段 vs 基座现状：

| DND 字段 | 用途 | 基座现状 |
|---|---|---|
| `当前场景` | 探索地图 locationName（主源） | ❌ 无（仙侧 = 当前详细地点 / 主要地区 / 次要地区） |
| `场景描述` | 战斗底图生成参数 | ❌ 无 |
| `战斗模式` | 模式开关（战斗/探索） | ❌ 无（仙侧“本轮故事模式” ≈ 模式开关锚点候选） |
| `当前回合` | 战斗回合 | ✅ 有 |

处理选项：① 适配层映射（b5 读表适配层）；② 扩列补 3 列（建议与“模式开关”一并拍板）。

### 6.2 探索地图表缺口

- 若不补表：`saveStructure` 将报 “Table not found”（L227-230），结构 JSON 无处持久化（仅剩缓存）；“当前显示地图”强制显示能力丢失。
- 建议：补为**第 21 表**（原样 5 列：row_id / LocationName / MapStructureJSON / LastUpdated / 当前显示地图）。

## 七、一句话总结

- 探索地图 = `EXPLORATION_Map_Data`（结构）+ `svg_maps` / Chat（图）+ `当前显示地图`（覆盖锚）；
- 战斗地图 = `COMBAT_BattleMap`（单位/网格）+ `COMBAT_Map_Visuals`（底图）+ `COMBAT_Encounter`（行动者）；
- 渲染中枢 = `UIMap.js`；SVG 双存储 = IndexedDB + Chat Metadata。
