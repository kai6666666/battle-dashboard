// features/dnd-theme/style-presets/index.ts
// 内置风格预设聚合（b11a）：12 个风格包 + 查询函数。
// 注：bundle 为单产物发布，风格数据静态打包；校验/应用为运行时懒执行（b11b 接入 Validator/Effects）。
import { classicDnd } from './classic-dnd';
import { cyberNeon } from './cyber-neon';
import { gothicHorror } from './gothic-horror';
import { elvenForest } from './elven-forest';
import { dwarvenForge } from './dwarven-forge';
import { starTrek } from './star-trek';
import { lovecraftian } from './lovecraftian';
import { steampunk } from './steampunk';
import { roseGarden } from './rose-garden';
import { kawaiiDreams } from './kawaii-dreams';
import { strawberryFelt } from './strawberry-felt';
import { peachCraft } from './peach-craft';

export const STYLE_PRESETS: any = {
  'classic-dnd': classicDnd,
  'cyber-neon': cyberNeon,
  'gothic-horror': gothicHorror,
  'elven-forest': elvenForest,
  'dwarven-forge': dwarvenForge,
  'star-trek': starTrek,
  'lovecraftian': lovecraftian,
  'steampunk': steampunk,
  'rose-garden': roseGarden,
  'kawaii-dreams': kawaiiDreams,
  'strawberry-felt': strawberryFelt,
  'peach-craft': peachCraft,
};

export const getStyleList = () => {
    return Object.values(STYLE_PRESETS).map(style => ({
        id: style.meta.id,
        name: style.meta.name,
        icon: style.meta.icon,
        description: style.meta.description,
        author: style.meta.author
    }));
};

/**
 * 获取指定风格的完整配置
 */
export const getStylePreset = (styleId) => {
    return STYLE_PRESETS[styleId] || null;
};

/**
 * 检查是否为内置风格
 */
export const isBuiltinStyle = (styleId) => {
    return styleId in STYLE_PRESETS;
};
