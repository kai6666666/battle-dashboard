// features/dnd-hud/hud-header-tidy.ts
// [b13.2.50] DND 视图头部规整（从 hud-render.ts 拆分，纯重构无行为变更）
// 功能：标题保底 / 搜索框搬入 header 内独立行 / 按钮 24px 归一 / HDRFIX 诊断
export function applyDndHeaderTidy($: any, $view: any): void {
                            try {
                                try { $view.find('.dnd-search-break').remove(); } catch (e0) {}
                                try {
                                    $view.find('.acu-panel-title').each(function(this: any) {
                                        try { this.style.setProperty('min-width', '72px', 'important'); } catch (ePT) {}
                                    });
                                    $view.find('.acu-title-sub').each(function(this: any) {
                                        try { this.style.setProperty('white-space', 'nowrap', 'important'); this.style.setProperty('overflow', 'hidden', 'important'); this.style.setProperty('text-overflow', 'ellipsis', 'important'); this.style.setProperty('max-width', '96px', 'important'); } catch (eTS) {}
                                    });
                                } catch (eTS0) {}
                                try {
                                    $view.find('.acu-search-wrapper').each(function(this: any) {
                                        var $s = $(this);
                                        try {
                                            var $ph = $s.closest('.acu-panel-header');
                                            if (!$ph.length) { $ph = $view.find('.acu-panel-header').first(); }
                                            if ($ph.length) {
                                                try { $ph[0].style.setProperty('flex-wrap', 'nowrap', 'important'); } catch (eHW) {}
                                                var $existRow = $ph.children('.dnd-search-row').first();
                                                if ($existRow.length) {
                                                    try { $existRow.find('.acu-search-wrapper').first().insertBefore($existRow); $existRow.remove(); } catch (eMV2) {}
                                                }
                                            }
                                            try {
                                                var _sw: any = $s[0];
                                                _sw.style.removeProperty('width');
                                                _sw.style.removeProperty('max-width');
                                                _sw.style.removeProperty('flex');
                                                _sw.style.removeProperty('margin-left');
                                                _sw.style.setProperty('min-width', '0', 'important');
                                                _sw.style.setProperty('border-radius', '999px', 'important');
                                                _sw.style.setProperty('overflow', 'hidden', 'important');
                                                _sw.style.setProperty('border', '1px solid var(--acu-border, rgba(150,150,150,.35))', 'important');
                                            } catch (eSW) {}
                                            $s.find('input').each(function(this: any) {
                                                try { this.style.setProperty('border-radius', '999px', 'important'); } catch (eIN) {}
                                            });
                                            try {
                                                var $ptb = $s.parent();
                                                if ($ptb.length && String($ptb.attr('class') || '').indexOf('interaction-toolbar') >= 0) {
                                                    $ptb[0].style.setProperty('display', 'flex', 'important');
                                                    $ptb[0].style.setProperty('justify-content', 'flex-end', 'important');
                                                    $ptb[0].style.setProperty('width', '100%', 'important');
                                                    $ptb[0].style.setProperty('box-sizing', 'border-box', 'important');
                                                }
                                            } catch (eTB2) {}
                                            try { $view.find('.dnd-search-row').filter(function(this: any) { return !$(this).closest('.acu-panel-header').length; }).remove(); } catch (eRM) {}
                                            try { $view.find('.acu-global-interaction-toolbar').each(function(this: any) { if (!$(this).children().length) { this.style.setProperty('display', 'none', 'important'); } }); } catch (eHTB) {}
                                        } catch (eS1) {}
                                    });
                                } catch (eS2) {}
                                try {
                                    $view.find('.acu-header-actions').each(function(this: any) {
                                        try { this.style.setProperty('flex-wrap', 'nowrap', 'important'); this.style.setProperty('gap', '1px', 'important'); this.style.setProperty('row-gap', '1px', 'important'); } catch (eA1) {}
                                    });
                                    $view.find('.acu-header-actions button, .acu-header-actions .acu-height-control, .acu-panel-control-set button, .acu-panel-control-set .acu-height-control').each(function(this: any) {
                                        try {
                                            this.style.setProperty('flex', '0 0 auto', 'important');
                                            this.style.setProperty('min-width', '20px', 'important');
                                            this.style.setProperty('width', '22px', 'important');
                                            this.style.setProperty('min-height', '20px', 'important');
                                            this.style.setProperty('height', '22px', 'important');
                                            this.style.setProperty('padding', '0', 'important');
                                            this.style.setProperty('margin', '0', 'important');
                                        } catch (eB1) {}
                                    });
                                } catch (eA2) {}
                                try {
                                    var _hD8 = $view.find('.acu-header-actions').first();
                                    if (_hD8.length) {
                                        var _w8: any = ($view[0].ownerDocument && $view[0].ownerDocument.defaultView) || window;
                                        var _csH = _w8.getComputedStyle(_hD8[0]);
                                        var _segs: string[] = [];
                                        _hD8.children().each(function(i: number) {
                                            var _r8 = this.getBoundingClientRect();
                                            var _c8 = _w8.getComputedStyle(this);
                                            _segs.push('(' + (i + 1) + ')' + String(this.className || '?').split(' ')[0].slice(0, 22) + ' x' + Math.round(_r8.left) + ' y' + Math.round(_r8.top) + ' w' + Math.round(_r8.width) + ' o' + _c8.order);
                                        });
                                        console.info('[DND]HDRFIX actW=' + Math.round(_hD8[0].getBoundingClientRect().width) + ' wrap=' + _csH.flexWrap + ' n=' + _hD8.children().length + ' || ' + _segs.join(' '));
                                    }
                                    try {
                                        var _rwD = $view.find('.dnd-search-row').first();
                                        if (_rwD.length) {
                                            var _rrD = _rwD[0].getBoundingClientRect();
                                            var _swDc = _rwD.find('.acu-search-wrapper').first();
                                            var _srD = _swDc.length ? _swDc[0].getBoundingClientRect() : null;
                                            console.info('[DND]HDRFIX searchRow rowW=' + Math.round(_rrD.width) + ' rowX=' + Math.round(_rrD.left) + ',' + Math.round(_rrD.top) + ' searchW=' + (_srD ? Math.round(_srD.width) : '?') + ' searchX=' + (_srD ? Math.round(_srD.left) : '?') + ' searchR=' + (_srD ? Math.round(_srD.right) : '?'));
                                        }
                                        var _anySw = $view.find('.acu-search-wrapper').first();
                                        if (_anySw.length) {
                                            var _ad = _anySw[0].getBoundingClientRect();
                                            var _pcls = '?';
                                            try { _pcls = String(_anySw.parent().attr('class') || '?').slice(0, 36); } catch (ePC) {}
                                            console.info('[DND]HDRFIX search w=' + Math.round(_ad.width) + ' x=' + Math.round(_ad.left) + ',' + Math.round(_ad.top) + ' r=' + Math.round(_ad.right) + ' par=' + _pcls);
                                        }
                                    } catch (eSR) {}
                                } catch (eD8) {}
                            } catch (eFX) {}
                        
}
