// features/dnd-dice/dice-roll.ts
// 投骰（D20 检定 / 自定义表达式）— AcuDice 引擎优先（b9 骰子归一 · 自 BasedonST `src/ui/modules/UIDice.js` 拆分移植并改接 AcuDice）
import { DND_CONFIG } from '../dnd-core';

export function createDiceRollFragment(deps: any): any {
  return {
    rollDice(sides, event) {
        const { $ } = deps.utils.getCore();
        
        // [美化] 添加骰子滚动动画到点击的按钮
        if (event && event.target) {
            const $btn = $(event.target).closest('.dnd-dice-btn');
            if ($btn.length) {
                $btn.addClass('dnd-dice-rolling');
                setTimeout(() => $btn.removeClass('dnd-dice-rolling'), 500);
            }
        }
        
        let result: number;
                // [b9 骰子归一] 引擎优先：AcuDice.roll('1dN')；不可用时回退本地随机。
                const _acu: any = (window as any).AcuDice;
                let _engineUsed = false;
                if (_acu && typeof _acu.roll === 'function') {
                    try {
                        const _rr = _acu.roll('1d' + sides);
                        if (_rr && typeof _rr.total === 'number') { result = _rr.total; _engineUsed = true; }
                    } catch (_e) {}
                }
                if (!_engineUsed) { result = Math.floor(Math.random() * sides) + 1; }
        const isNat20 = sides === 20 && result === 20;
        const isNat1 = sides === 20 && result === 1;

        // 自动填入提示词到输入框 (区分大成功/大失败)
        const char = (typeof this.getControlledCharacter === 'function') ? ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( ) : null;
        const charName = char ? (char['姓名'] || '我') : '我';
        
        let diceText = '';
        if (isNat20) {
            diceText = `\n${charName}进行了 D20 检定，*掷骰结果:【大成功 (Natural 20)】！`;
        } else if (isNat1) {
            diceText = `\n${charName}进行了 D20 检定，*掷骰结果:【大失败 (Natural 1)】！`;
        } else {
            diceText = `\n${charName}进行了 D${sides} 检定，*掷骰结果:${result}。`;
        }
        
        if (typeof this.fillChatInput === 'function') {
            ((window as any).DND_Dashboard_UI || this).fillChatInput?.( diceText);
        }
        
        // [美化] 增强结果显示动画
        let resultHtml = '';
        let specialClass = '';
        if (isNat20) {
            specialClass = 'dnd-nat20-result';
            resultHtml = `<div style="text-align:center;padding:20px;">
                <div class="dnd-dice-result-number" style="font-size:56px;color:var(--dnd-accent-green);text-shadow:0 0 24px var(--dnd-accent-green), 0 0 48px var(--dnd-selected-bg);animation:dnd-nat20-glow 0.8s ease-in-out infinite alternate;">${deps.icons.SPARKLES} ${result} ${deps.icons.SPARKLES}</div>
                <div class="dnd-text-reveal" style="font-size:16px;color:var(--dnd-text-highlight);margin-top:8px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">大成功！NATURAL 20!</div>
            </div>`;
        } else if (isNat1) {
            specialClass = 'dnd-nat1-result';
            resultHtml = `<div style="text-align:center;padding:20px;">
                <div class="dnd-dice-result-number" style="font-size:56px;color:var(--dnd-accent-red);text-shadow:0 0 24px var(--dnd-accent-red), 0 0 48px var(--dnd-selected-bg);animation:dnd-shake 0.5s ease-in-out;">${deps.icons.SKULL} ${result} ${deps.icons.SKULL}</div>
                <div class="dnd-text-reveal" style="font-size:16px;color:var(--dnd-accent-red);margin-top:8px;font-weight:bold;">大失败... NATURAL 1</div>
            </div>`;
        } else {
            resultHtml = `<div style="text-align:center;padding:15px;">
                <div class="dnd-dice-result-number" style="font-size:42px;color:var(--dnd-text-highlight);text-shadow:0 0 15px var(--dnd-selected-bg);">${deps.icons.DICE} ${result}</div>
                <div style="font-size:12px;color:var(--dnd-text-dim);margin-top:5px;">D${sides} 投掷结果</div>
            </div>`;
        }
        
        // 更新弹窗内容而不是 alert
        const $popup = $('#dnd-detail-popup-el');
        // [b12.11] 弹窗不存在时自动新开，保证结果特效始终可见
        if (!$popup.length) {
            try {
                const _pos = (event && event.clientX !== undefined) ? { x: event.clientX, y: event.clientY } : { x: (window.innerWidth || 800) / 2, y: (window.innerHeight || 600) / 2 };
                ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.(`<div style="text-align:center;font-size:12px;color:var(--dnd-text-dim);padding:4px 0;">${deps.icons.DICE} 快速投掷</div>` + resultHtml, _pos.x, _pos.y);
            } catch (e) {}
            return;
        }
        if ($popup.length) {
            // 在现有内容前插入结果
            const $result = $(`<div class="dnd-roll-result ${specialClass}" style="margin-bottom:10px;background:linear-gradient(135deg, var(--dnd-bg-secondary), var(--dnd-bg-tertiary));border-radius:8px;border:1px solid var(--dnd-border-gold);box-shadow:0 4px 12px var(--dnd-border-inner), inset 0 1px 0 var(--dnd-border-gold);">${resultHtml}</div>`);
            
            // 移除之前的结果
            $popup.find('.dnd-roll-result').remove();
            
            // 在标题后插入（[b12.11] children 显式 API，兼容旧版 jQuery）
            $popup.children('div').first().after($result);
            
            // [美化] 增强入场动画效果
            $result.css({ opacity: 0, transform: 'scale(0.5) rotateX(-20deg)', transformOrigin: 'center center' });
            setTimeout(() => {
                $result.css({
                    opacity: 1,
                    transform: 'scale(1) rotateX(0deg)',
                    transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                });
            }, 10);
        }
    },

    // 自定义骰子表达式投掷
    rollCustomDice() {
        const { $ } = deps.utils.getCore();
        const expr = $('#dnd-custom-dice').val().trim();
        if (!expr) return;
        
        try {
            // 解析表达式 (支持 2d6+3, 1d20-2, 3d8 等)
            const regex = /^(\d*)d(\d+)([+-]\d+)?$/i;
            const match = expr.match(regex);
            
            if (!match) {
                deps.notification.warning('格式错误，请使用如 2d6+3 的格式');
                return;
            }
            
            const count = parseInt(match[1]) || 1;
            const sides = parseInt(match[2]);
            const modifier = parseInt(match[3]) || 0;
            
            if (count > 20 || sides > 100) {
                deps.notification.warning('骰子数量不能超过20，面数不能超过100');
                return;
            }
            
                        let rolls: number[] = [];
            let total = 0;
            let _engineBreakdown = '';
            // [b9 骰子归一] 引擎优先：AcuDice.roll(表达式)；不可用时回退本地逐骰。
            const _acu: any = (window as any).AcuDice;
            if (_acu && typeof _acu.roll === 'function') {
                try {
                    const _rr = _acu.roll(String(expr).toUpperCase());
                    if (_rr && typeof _rr.total === 'number') { total = _rr.total; _engineBreakdown = String(_rr.breakdown || ''); }
                } catch (_e) {}
            }
            if (!_engineBreakdown) {
                for (let i = 0; i < count; i++) {
                    const r = Math.floor(Math.random() * sides) + 1;
                    rolls.push(r);
                    total += r;
                }
                total += modifier;
            }
            
            const rollsStr = _engineBreakdown ? _engineBreakdown : rolls.join(' + ');
            const modStr = _engineBreakdown ? '' : (modifier > 0 ? ` + ${modifier}` : (modifier < 0 ? ` - ${Math.abs(modifier)}` : ''));

            // 自动填入自定义投掷提示词到输入框
            const char = (typeof this.getControlledCharacter === 'function') ? ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( ) : null;
            const charName = char ? (char['姓名'] || '我') : '我';
            const customText = `\n${charName}进行了 ${expr.toUpperCase()} 投掷，结果为：${total} (${rollsStr}${modStr})。`;
            if (typeof this.fillChatInput === 'function') {
                ((window as any).DND_Dashboard_UI || this).fillChatInput?.( customText);
            }
            
            const resultHtml = `<div style="text-align:center;padding:15px;">
                <div style="font-size:32px;color:var(--dnd-text-highlight);">${deps.icons.DICE} ${total}</div>
                <div style="font-size:11px;color:var(--dnd-text-dim);margin-top:5px;">${expr.toUpperCase()}: (${rollsStr})${modStr}</div>
            </div>`;
            
            const $popup = $('#dnd-detail-popup-el');
            // [b12.11] 弹窗不存在时自动新开，保证结果始终可见
            if (!$popup.length) {
                try {
                    const _pos2 = { x: (window.innerWidth || 800) / 2, y: (window.innerHeight || 600) / 2 };
                    ((window as any).DND_Dashboard_UI || this).showItemDetailPopup?.(`<div style="text-align:center;font-size:12px;color:var(--dnd-text-dim);padding:4px 0;">${deps.icons.DICE} 自定义投掷</div>` + resultHtml, _pos2.x, _pos2.y);
                } catch (e) {}
                return;
            }
            if ($popup.length) {
                $popup.find('.dnd-roll-result').remove();
                const $result = $(`<div class="dnd-roll-result" style="margin-bottom:10px;background:var(--dnd-bg-secondary);border-radius:6px;border:1px solid var(--dnd-border-gold);">${resultHtml}</div>`);
                $popup.children('div').first().after($result);
                $result.css({ opacity: 0, transform: 'scale(0.8)' });
                setTimeout(() => {
                    $result.css({ opacity: 1, transform: 'scale(1)', transition: 'all 0.3s ease-out' });
                }, 10);
            }
        } catch(e) {
            deps.notification.error('投掷失败: ' + e.message);
        }
    },

    // ==========================================
    // 快捷栏 (Quick Bar) 逻辑
    // ==========================================
  };
}
