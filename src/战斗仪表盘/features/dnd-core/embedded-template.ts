// features/dnd-core/embedded-template.ts
// 内置模板（DND5E_SQL_9.20 增强版，v2.0.5 内置格式）
// 说明：原工程从 ../../dist/DND5E_SQL_9.20.json 导入；
// 移植版将模板随包内置（assets/），随构建打进 bundle。

// @ts-ignore —— 构建期由 webpack resolveJsonModule 处理
import embeddedTemplate from './assets/DND5E_SQL_9.20.json';

export const EMBEDDED_TEMPLATE: any = embeddedTemplate;