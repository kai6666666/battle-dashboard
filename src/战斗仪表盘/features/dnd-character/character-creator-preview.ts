// features/dnd-character/character-creator-preview.ts
// 创建向导（属性/预览）（b5 · 自 BasedonST `src/ui/modules/UICharacter.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createCharacterCreatorPreviewFragment(deps: any): any {
  return {
    showStatsGenerator(e) {
        const html = `
            <div style="padding-bottom:10px; border-bottom:1px solid #444; margin-bottom:10px; font-weight:bold; color:var(--dnd-text-highlight);">
                ${deps.icons.DICE} 属性分配生成器
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <!-- 标准数列 -->
                <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:4px;">
                    <div style="font-size:13px; font-weight:bold; margin-bottom:5px;">1. 标准数列 (Standard Array)</div>
                    <div style="font-family:monospace; color:#ccc; margin-bottom:5px;">[15, 14, 13, 12, 10, 8]</div>
                    <button onclick="window.DND_Dashboard_UI.applyStatsOption('standard')" style="width:100%; padding:5px; background:#333; border:1px solid #555; color:#fff; border-radius:3px; cursor:pointer;">使用此数列</button>
                </div>

                <!-- 购点法 -->
                <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:4px;">
                    <div style="font-size:13px; font-weight:bold; margin-bottom:5px;">2. 购点法 (Point Buy)</div>
                    <div style="display:flex; gap:5px;">
                        <button onclick="window.DND_Dashboard_UI.applyStatsOption('pointbuy_27')" style="flex:1; padding:5px; background:#333; border:1px solid #555; color:#fff; border-radius:3px; cursor:pointer;">标准 (27点)</button>
                        <button onclick="window.DND_Dashboard_UI.applyStatsOption('pointbuy_32')" style="flex:1; padding:5px; background:#333; border:1px solid #555; color:#fff; border-radius:3px; cursor:pointer;">宽裕 (32点)</button>
                    </div>
                </div>

                <!-- 骰子决定 -->
                <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:4px;">
                    <div style="font-size:13px; font-weight:bold; margin-bottom:5px;">3. 骰子决定 (4d6 drop lowest)</div>
                    <div id="dnd-stats-roll-result" style="font-family:monospace; color:var(--dnd-text-highlight); margin-bottom:5px; min-height:20px; font-size:14px; text-align:center;">???</div>
                    <div style="display:flex; gap:5px;">
                        <button onclick="window.DND_Dashboard_UI.performStatsRoll()" style="flex:1; padding:5px; background:var(--dnd-border-gold); color:#000; border:none; border-radius:3px; cursor:pointer; font-weight:bold;">${deps.icons.DICE} 投掷 (x6)</button>
                        <button id="dnd-btn-use-roll" onclick="window.DND_Dashboard_UI.confirmStatsRoll()" style="flex:1; padding:5px; background:#333; border:1px solid #555; color:#fff; border-radius:3px; cursor:pointer;" disabled>使用结果</button>
                    </div>
                </div>
            </div>
        `;
        
        ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.( html, e.clientX, e.clientY);
    },

    applyStatsOption(type) {
        let text = '';
        if (type === 'standard') text = "我选择使用【标准数列】进行属性分配：15, 14, 13, 12, 10, 8。请帮我分配到合适的属性上。";
        if (type === 'pointbuy_27') text = "我选择使用【标准购点法 (27点)】。请帮我规划属性分配。";
        if (type === 'pointbuy_32') text = "我选择使用【宽裕购点法 (32点)】。请帮我规划属性分配。";
        
        if (text) {
            this.fillCreatorInput(text);
            ((window as any).DND_Dashboard_UI || this).hideDetailPopup?.( );
        }
    },

    performStatsRoll() {
        const roll4d6k3 = () => {
            const rolls = [
                Math.floor(Math.random()*6)+1,
                Math.floor(Math.random()*6)+1,
                Math.floor(Math.random()*6)+1,
                Math.floor(Math.random()*6)+1
            ];
            rolls.sort((a,b) => b-a);
            return rolls[0] + rolls[1] + rolls[2];
        };
        
        const results = [];
        for(let i=0; i<6; i++) results.push(roll4d6k3());
        
        const resultStr = results.join(', ');
        const { $ } = deps.utils.getCore();
        $('#dnd-stats-roll-result').text(`[${resultStr}]`);
        $('#dnd-btn-use-roll').prop('disabled', false).attr('data-results', resultStr);
    },

    confirmStatsRoll() {
        const { $ } = deps.utils.getCore();
        const res = $('#dnd-btn-use-roll').attr('data-results');
        if (res) {
            this.fillCreatorInput(`我选择使用【骰子投掷结果】：[${res}]。请帮我分配到合适的属性上。`);
            ((window as any).DND_Dashboard_UI || this).hideDetailPopup?.( );
        }
    },

    fillCreatorInput(text) {
        const { $ } = deps.utils.getCore();
        const $input = $('#dnd-creator-user-input');
        const current = $input.val();
        $input.val(current ? current + ' ' + text : text).focus();
    },

    // 渲染角色预览
    renderCharacterPreview(data) {
        if (!data || Object.keys(data).length === 0) {
            return `
                <div style="color:#666;text-align:center;padding:30px 15px;">
                    <div style="font-size:48px;margin-bottom:15px;opacity:0.3;"><i class="fa-solid fa-hat-wizard"></i></div>
                    <div>角色信息将随对话逐步生成...</div>
                </div>
            `;
        }
        
        // 解析属性值
        const stats = data.stats || {};
        const getMod = (val) => {
            const v = parseInt(val) || 10;
            const mod = Math.floor((v - 10) / 2);
            return mod >= 0 ? `+${mod}` : mod;
        };

        // 辅助函数: 渲染列表
        const renderList = (title, list, renderer) => {
            if (!list || list.length === 0) return '';
            return `
                <div style="margin-top:10px;">
                    <div style="font-weight:bold;color:var(--dnd-text-highlight);border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:5px;font-size:12px;">${title}</div>
                    <div>${list.map(renderer).join('')}</div>
                </div>
            `;
        };

        // 资源显示
        let resHtml = '';
        if (data.resources) {
            const r = data.resources;
            let items = [];
            if (r.spell_slots) Object.keys(r.spell_slots).forEach(k => items.push(`${k}: ${r.spell_slots[k]}`));
            if (r.class_resources) Object.keys(r.class_resources).forEach(k => items.push(`${k}: ${r.class_resources[k]}`));
            if (r.hit_dice) items.push(`生命骰: ${r.hit_dice}`);
            
            if (items.length > 0) {
                resHtml = `
                    <div style="margin-bottom:10px;font-size:11px;background:rgba(255,255,255,0.05);padding:6px;border-radius:4px;">
                        <div style="color:#888;margin-bottom:2px;">资源</div>
                        <div style="display:flex;flex-wrap:wrap;gap:8px;color:#ccc;">
                            ${items.map(i => `<span>${i}</span>`).join('<span style="color:#444">|</span>')}
                        </div>
                    </div>
                `;
            }
        }

        // 熟练项
        let profHtml = '';
        const skills = data.skill_proficiencies || [];
        const saves = data.saving_throws || [];
        if (skills.length > 0 || saves.length > 0) {
            profHtml = `
                <div style="font-size:11px;margin-bottom:10px;color:#aaa;">
                    ${saves.length ? `<div><span style="color:#888">豁免:</span> ${saves.join(', ')}</div>` : ''}
                    ${skills.length ? `<div><span style="color:#888">技能:</span> ${skills.join(', ')}</div>` : ''}
                </div>
            `;
        }
        
        return `
            <div class="dnd-preview-content">
                <!-- 基本信息 -->
                <div style="text-align:center;margin-bottom:15px;">
                    <div style="font-size:20px;font-weight:bold;color:var(--dnd-text-highlight);">${data.name || '未命名'}</div>
                    <div style="font-size:12px;color:#888;margin-top:3px;">${data.race_gender_age || (data.race || '?')} · ${data.class || '?'} · Lv.${data.level || 1}</div>
                </div>
                
                <!-- 属性值 -->
                ${Object.keys(stats).length > 0 ? `
                <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:5px;margin-bottom:15px;background:rgba(0,0,0,0.3);padding:8px;border-radius:4px;">
                    ${['STR','DEX','CON','INT','WIS','CHA'].map(attr => `
                        <div style="text-align:center;">
                            <div style="font-size:12px;font-weight:bold;color:var(--dnd-text-header);">${stats[attr] || 10}</div>
                            <div style="font-size:9px;color:#666;">${getMod(stats[attr])} ${attr}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${resHtml}
                ${profHtml}

                <!-- 特性 & 专长 -->
                ${renderList('<i class="fa-solid fa-bolt"></i> 特性 & 专长', data.features, f => `
                    <div style="margin-bottom:4px;font-size:12px;">
                        <span style="color:#ccc;font-weight:bold;">${f.name}</span>
                        <div style="color:#888;font-size:10px;line-height:1.3;">${f.desc || ''}</div>
                    </div>
                `)}

                <!-- 法术 -->
                ${renderList('<i class="fa-solid fa-bolt"></i> 法术', data.spells, s => `
                    <div style="margin-bottom:4px;font-size:12px;">
                        <span style="color:#b585ff;font-weight:bold;">${s.name}</span>
                        <span style="color:#666;font-size:10px;">(${s.level===0?'戏法':s.level+'环'})</span>
                        <div style="color:#888;font-size:10px;line-height:1.3;">${s.desc || ''}</div>
                    </div>
                `)}
                
                <!-- 其他信息 -->
                ${data.background ? `<div style="font-size:12px;margin-top:10px;"><span style="color:#888;">背景:</span> ${data.background}</div>` : ''}
                ${data.alignment ? `<div style="font-size:12px;"><span style="color:#888;">阵营:</span> ${data.alignment}</div>` : ''}
                ${data.personality ? `<div style="font-size:12px;"><span style="color:#888;">性格:</span> ${data.personality}</div>` : ''}
                ${data.backstory ? `<div style="font-size:11px;color:#aaa;margin-top:10px;padding-top:10px;border-top:1px dashed #444;line-height:1.5;">${data.backstory.substring(0, 200)}${data.backstory.length > 200 ? '...' : ''}</div>` : ''}
            </div>
        `;
    },

    // 绑定角色创建器事件
  };
}
