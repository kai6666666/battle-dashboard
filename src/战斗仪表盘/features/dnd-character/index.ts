// features/dnd-character/index.ts
// dnd-character 域装配（b5 · 里程碑 M2）：角色卡 / 头像 / 创建向导 / 升级向导 / 法术。
// 约定：工厂 + DI；7 个 fragment 经此处合并为同一对象（this 跨块可用），并注册进全局 UI。
import { createCharacterAvatarFragment } from './character-avatar';
import { createCharacterCardFragment } from './character-card';
import { createCharacterCreatorFragment } from './character-creator';
import { createCharacterCreatorPreviewFragment } from './character-creator-preview';
import { createCharacterCreatorFlowFragment } from './character-creator-flow';
import { createCharacterLevelupFragment } from './character-levelup';
import { createCharacterSpellsFragment } from './character-spells';

export interface DndCharacterDeps { core: any; ui?: any; theme?: any; hud?: any; }
export interface DndCharacter { character: any; init(): void; }

export function createDndCharacter(deps0: DndCharacterDeps): DndCharacter {
  const core = deps0.core;
  // [b11d] 图标接真：运行时查全局 ICONS（dnd-ui 注册；未注册时安全降级为空）
  const iconProxy: any = new Proxy({}, { get: (_t: any, k: any) => {
    try { const g: any = (window as any).DND_Dashboard_UI; return (g && g.ICONS && g.ICONS[k]) || ''; }
    catch (e) { return ''; }
  } });
  const emptyNotify = {
    notify: () => Promise.resolve(),
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {},
    confirm: () => Promise.resolve(false),
    prompt: () => Promise.resolve(null),
  };
  const deps: any = {
    logger: core.logger,
    dbAdapter: core.dbAdapter,
    utils: core.utils,
    dataManager: core.dataManager,
    tavernApi: core.tavernApi,
    settingsManager: core.settingsManager,
    settingsSync: core.settingsSync,
    templateSync: core.templateSync,
    notification: deps0.ui?.notification ?? emptyNotify,
    // D2 决策：骰子池移除——保存走 save-bridge（b2）
    saveData: core.saveBridge && typeof core.saveBridge.saveData === 'function'
      ? core.saveBridge.saveData
      : async () => {},
    icons: iconProxy,
    diceManager: null,
  };

  const character: any = Object.assign(
    {},
    createCharacterAvatarFragment(deps),
    createCharacterCardFragment(deps),
    createCharacterCreatorFragment(deps),
    createCharacterCreatorPreviewFragment(deps),
    createCharacterCreatorFlowFragment(deps),
    createCharacterLevelupFragment(deps),
    createCharacterSpellsFragment(deps)
  );

  const init = (): void => {
    try {
      // 注册进全局 UI（渐进合并；跨域 this 转发依赖它）
      const w: any = window as any;
      const g: any = (w.DND_Dashboard_UI = w.DND_Dashboard_UI || {});
      if (typeof g.registerModules === 'function') {
        g.registerModules(character);
      } else {
        Object.assign(g, character);
      }
      core.logger.info('[dnd-character] 角色/法术就绪（M2）：角色卡 / 创建向导 / 升级向导 / 法术位');
    } catch (e) {
      core.logger.warn('[dnd-character] init 失败（忽略不影响主流程）：', e);
    }
  };

  return { character, init };
}

export { createCharacterSpellsFragment } from './character-spells';
