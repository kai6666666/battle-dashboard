// features/dnd-map/map-ui-minimap.ts
// 迷你地图渲染（探索/战斗双模渲染主体）（b8 · 自 BasedonST `src/ui/modules/UIMap.js` 拆分移植）
import { DND_CONFIG } from '../dnd-core';

export function createMapUiMinimapFragment(deps: any): any {
  return {
    async renderMiniMap($el) {
        const { $ } = deps.utils.getCore();
        const global = deps.dataManager.getTable('SYS_GlobalState');
        const gInfo = (global && global[0]) ? global[0] : {};
        const isCombat = gInfo['战斗模式'] === '战斗中';
        let locationName = gInfo['当前场景'] || '未知区域';

        // Check for override in EXPLORATION_Map_Data
        const mapDataExploration = deps.dataManager.getTable('EXPLORATION_Map_Data');
        if (mapDataExploration) {
            const forcedMap = mapDataExploration.find(m => {
                const val = m['当前显示地图'];
                return val === '是' || val === true || val === 'True' || val === 'true' || val === 1 || val === '1';
            });
            if (forcedMap && forcedMap['LocationName']) {
                locationName = forcedMap['LocationName'];
            }
        }

        // ==========================================
        // 模式 A: 探索地图 (SVG)
        // ==========================================
        if (!isCombat) {
            // 检查是否需要初始化容器
            let $innerMap = $el.find('.dnd-exploration-inner');
            
            // [修复] 检测 locationName 是否改变，如果改变则强制重新加载
            const cachedLocationName = $el.data('current-location-name');
            const locationChanged = cachedLocationName && cachedLocationName !== locationName;
            
            if ($innerMap.length === 0) {
                $el.empty();
                $el.css({
                    position: 'relative',
                    background: 'var(--dnd-bg-main)',
                    overflow: 'hidden'
                });
                
                // 创建内部容器用于缩放/平移
                $innerMap = $('<div class="dnd-exploration-inner" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;transform-origin:center center;"></div>');
                $el.append($innerMap);
                
                // 绑定缩放
                this.bindMapZoom($el, $innerMap);
            }
            
            // [修复] 如果 locationName 改变，清空容器以强制重新加载
            if (locationChanged) {
                $innerMap.empty();
                // 同时更新控制按钮
                $el.find('.dnd-map-controls').remove();
            }
            
            // 保存当前 locationName
            $el.data('current-location-name', locationName);

            // 尝试获取地图
            const containerId = 'dnd-exploration-map-loader';
            // 如果内容为空，显示加载中
            if ($innerMap.is(':empty')) {
                    $innerMap.html(`<div id="${containerId}" style="display:flex;align-items:center;justify-content:center;color:var(--dnd-text-dim);flex-direction:column;gap:5px;">
                    <div class="dnd-spinner" style="width:20px;height:20px;border:2px solid var(--dnd-border-subtle);border-top:2px solid var(--dnd-border-gold);border-radius:50%;animation:dnd-spin 1s infinite linear;"></div>
                    <div style="font-size:10px;">加载地图...</div>
                </div>`);
            }

            try {
                const mapResult = await deps.explorationMapManager.getMap(locationName, gInfo['场景描述']);
                
                if (mapResult.type === 'svg') {
                    const svgContent = mapResult.content;
                    // 注入 SVG
                    $innerMap.html(svgContent);
                    const $svg = $innerMap.find('svg');
                    $svg.css({ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' });

                    // [新增] 自动计算填满容器的缩放比例 (Cover Mode)
                    setTimeout(() => {
                        try {
                            // 尝试从 viewBox 获取宽高比
                            const viewBox = $svg[0].getAttribute('viewBox');
                            if (viewBox) {
                                const [vx, vy, vw, vh] = viewBox.split(/[\s,]+/).map(parseFloat);
                                const svgRatio = vw / vh;
                                
                                const cw = $el.width();
                                const ch = $el.height();
                                const containerRatio = cw / ch;
                                
                                // 默认 fit 是 scale=1 (contain).
                                // 如果 Container 比 SVG 更宽 (cw/ch > vw/vh)，则 SVG 高度匹配，宽度有黑边。需放大 cw/renderW = cw / (ch * svgRatio) = containerRatio / svgRatio
                                // 如果 Container 比 SVG 更窄 (cw/ch < vw/vh)，则 SVG 宽度匹配，高度有黑边。需放大 ch/renderH = ch / (cw / svgRatio) = svgRatio / containerRatio
                                
                                let coverScale = 1.0;
                                if (containerRatio > svgRatio) {
                                    coverScale = containerRatio / svgRatio;
                                } else {
                                    coverScale = svgRatio / containerRatio;
                                }
                                
                                // 稍微放大一点点以消除边缘缝隙
                                coverScale = coverScale * 1.02;
                                
                                console.log('[MapZoom] Auto-Fit Scale:', coverScale, { containerRatio, svgRatio });
                                
                                // 应用缩放
                                if (coverScale > 1.0) {
                                    this._mapZoom.scale = coverScale;
                                    // Reset pan
                                    this._mapZoom.panX = 0;
                                    this._mapZoom.panY = 0;
                                    
                                    // 调用 applyTransform (通过 data 暴露)
                                    if ($el.data('applyTransform')) {
                                        $el.data('applyTransform')();
                                    }
                                }
                            }
                        } catch(e) { console.warn('Auto-zoom failed', e); }
                    }, 50);

                    const safeLocationArg = JSON.stringify(locationName);

                    // 添加控制层 (悬浮显示) - 添加到外层 $el
                    if ($el.find('.dnd-map-controls').length === 0) {
                        const overlayHtml = `
                            <div class="dnd-map-controls" style="position:absolute;top:5px;right:5px;display:flex;gap:5px;opacity:0;transition:opacity 0.2s;z-index:10;">
                                <button type="button" onclick='window.DND_Dashboard_UI.regenerateMap(${safeLocationArg}, "svg")' title="保持结构重绘图片" style="background:var(--dnd-bg-tertiary);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);border-radius:4px;padding:2px 6px;cursor:pointer;font-size:10px;"><i class="fa-solid fa-palette"></i> 重绘</button>
                            </div>
                        `;
                        $el.append(overlayHtml);
                        
                        $el.hover(
                            () => $el.find('.dnd-map-controls').css('opacity', 1),
                            () => $el.find('.dnd-map-controls').css('opacity', 0)
                        );
                    }

                } else if (mapResult.type === 'error' && mapResult.message.includes('结构')) {
                    // 尚未生成
                        $innerMap.html(`
                        <div style="text-align:center;color:var(--dnd-text-dim);">
                            <div style="font-size:24px;margin-bottom:5px;">${deps.icons.MAP}</div>
                            <div style="font-size:10px;margin-bottom:10px;">${mapResult.message}</div>
                        </div>
                    `);
                } else {
                        // 其他错误
                        $innerMap.html(`<div style="color:var(--dnd-accent-red);font-size:10px;padding:10px;text-align:center;">${mapResult.message}</div>`);
                }
            } catch (e) {
                $innerMap.html(`<div style="color:var(--dnd-accent-red);font-size:10px;">加载错误: ${e.message}</div>`);
            }
            
            return;
        }

        // ==========================================
        // 模式 B: 战斗地图 (Tactical Grid)
        // ==========================================
        const mapData = deps.dataManager.getTable('COMBAT_BattleMap');
        const encounters = deps.dataManager.getTable('COMBAT_Encounter');
        
        if (!mapData) {
            $el.html('<div style="color:var(--dnd-text-dim);display:flex;align-items:center;justify-content:center;height:100%;">无战斗数据</div>');
            return;
        }

        const round = gInfo['当前回合'] || 0;

        // 1. 获取并计算地图尺寸配置
        const config = mapData.find(m => m['类型'] === 'Config');
        let cols = 20, rows = 20;
        if (config && config['坐标']) {
            const size = deps.dataManager.parseValue(config['坐标'], 'size');
            if (size) {
                cols = size.w || 20;
                rows = size.h || 20;
            }
        }

        const containerSize = 180;
        const cellSize = Math.min(12, Math.max(6, Math.floor(containerSize / Math.max(cols, rows))));
        const mapWidth = cols * cellSize;
        const mapHeight = rows * cellSize;
        const offsetX = (containerSize - mapWidth) / 2;
        const offsetY = (containerSize - mapHeight) / 2;
        const cachedCombatLocationName = $el.data('combat-location-name');
        const combatLocationChanged = cachedCombatLocationName && cachedCombatLocationName !== locationName;

        // 2. 检查或初始化内部容器 (Static Layer)
        let $innerMap = $el.find('.dnd-minimap-inner');
        let needsFullRedraw = false;

        // 如果尺寸或场景变了，或者容器不存在，则全量重绘
        if ($innerMap.length === 0 ||
            parseFloat($innerMap.data('cols')) !== cols ||
            parseFloat($innerMap.data('rows')) !== rows ||
            combatLocationChanged) {
            
            $el.empty(); // 彻底清空
            needsFullRedraw = true;
            
            $innerMap = $(`<div class="dnd-minimap-inner"
                style="position:absolute;left:${offsetX}px;top:${offsetY}px;width:${mapWidth}px;height:${mapHeight}px;background:var(--dnd-bg-secondary);"
                data-cell-size="${cellSize}" data-cols="${cols}" data-rows="${rows}"></div>`);
            $el.append($innerMap);

            // [新增] 战斗底图层 (Background Layer)
            // [修复] 安全转义场景名称中的 CSS 选择器特殊字符，防止查询失败
            const sanitizeId = (name) => {
                // 移除或替换所有非安全字符，生成合法的 CSS ID
                return 'bg-' + name.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '-').replace(/^-+|-+$/g, '');
            };
            const bgId = sanitizeId(locationName);
            // 移除 opacity 限制，移除滤镜，确保亮度正常
            $innerMap.append(`<div id="${bgId}" class="dnd-battle-bg-container" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;"></div>`);
            
            // 异步加载战斗底图
            deps.explorationMapManager.getBattleMap(locationName, gInfo['场景描述'], cols, rows, false).then(res => {
                if (res.type === 'svg') {
                    const $bg = $innerMap.find(`#${bgId}`);
                    $bg.html(res.content);
                    // 强制 SVG 拉伸适应 Grid
                    const $svg = $bg.find('svg');
                    $svg.attr('preserveAspectRatio', 'none');
                    $svg.css({
                        width: '100%',
                        height: '100%'
                        // 移除滤镜，防止过暗
                    });
                }
            });

            // 绘制 Grid (SVG)
            // [修复] 移除内联 opacity，使用 CSS 类控制；使用更明亮的边框颜色呈现透明线条效果
            const gridSvg = `
                <svg class="dnd-minimap-grid" width="${mapWidth}" height="${mapHeight}" style="position:absolute;top:0;left:0;pointer-events:none;z-index:5;">
                    <defs>
                        <pattern id="miniGrid" width="${cellSize}" height="${cellSize}" patternUnits="userSpaceOnUse">
                            <path d="M ${cellSize} 0 L 0 0 0 ${cellSize}" fill="none" stroke="var(--dnd-border-inner)" stroke-width="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#miniGrid)"/>
                </svg>
            `;
            $innerMap.append(gridSvg);

            // 绘制静态地形 (Walls, Terrain, Zones)
            mapData.forEach(item => {
                if (['Token', 'Config'].includes(item['类型'])) return;

                const pos = deps.dataManager.parseValue(item['坐标'], 'coord');
                if (!pos) return;

                const px = (pos.x !== undefined ? pos.x : 1) - 1;
                const py = (pos.y !== undefined ? pos.y : 1) - 1;
                const size = deps.dataManager.parseValue(item['大小'], 'size') || { w: 1, h: 1 };

                const left = px * cellSize;
                const top = py * cellSize;
                const width = size.w * cellSize;
                const height = size.h * cellSize;

                let el = '';
                if (item['类型'] === 'Wall') {
                    el = `<div style="position:absolute;left:${left}px;top:${top}px;width:${width}px;height:${height}px;background:var(--dnd-bg-secondary);border:1px solid var(--dnd-border-subtle);z-index:1;"></div>`;
                } else if (item['类型'] === 'Terrain') {
                    el = `<div style="position:absolute;left:${left}px;top:${top}px;width:${width}px;height:${height}px;background:var(--dnd-bg-tertiary);border:1px dashed var(--dnd-accent-green);z-index:0;"></div>`;
                } else if (item['类型'] === 'Zone') {
                    // [修复] 移除灰色填充，仅保留高亮边框作为透明区域指示
                    el = `<div style="position:absolute;left:${left}px;top:${top}px;width:${width}px;height:${height}px;background:transparent;border:2px solid var(--dnd-text-highlight);border-radius:50%;z-index:2;"></div>`;
                }
                if (el) $innerMap.append(el);
            });

            // 绑定事件 (仅在创建时绑定一次)
            const self = this;
            $innerMap.on('click', (e) => {
                e.stopPropagation();
                // 添加点击波纹反馈
                const rect = $innerMap[0].getBoundingClientRect();
                const rx = e.clientX - rect.left;
                const ry = e.clientY - rect.top;
                
                const $ripple = $('<div class="dnd-map-ripple"></div>');
                $ripple.css({
                    left: rx + 'px',
                    top: ry + 'px',
                    width: cellSize*2 + 'px',
                    height: cellSize*2 + 'px',
                    marginLeft: -cellSize + 'px',
                    marginTop: -cellSize + 'px'
                });
                $innerMap.append($ripple);
                setTimeout(() => $ripple.remove(), 600);

                const grid = ((window as any).DND_Dashboard_UI || self).getGridFromEvent?.( e, $el, $innerMap);
                self.handleMapInteraction(grid.x, grid.y);
            });

            // 绑定缩放 (仅在创建时绑定一次)
            this.bindMapZoom($el, $innerMap);
            $el.data('combat-location-name', locationName);
            
            // UI Overlay (Round Info + Controls)
            const safeLocationArg = JSON.stringify(locationName);
            $el.append(`
                <div class="dnd-hud-overlay" style="pointer-events:none;z-index:30;">
                    <div style="position:absolute;top:2px;left:4px;font-size:9px;color:var(--dnd-text-dim);text-shadow:1px 1px 2px var(--dnd-bg-main);">${String.fromCharCode(64 + 1)}1</div>
                    <div style="position:absolute;bottom:2px;right:4px;font-size:9px;color:var(--dnd-text-dim);text-shadow:1px 1px 2px var(--dnd-bg-main);">${String.fromCharCode(64 + Math.min(cols, 26))}${rows}</div>
                    <div id="dnd-map-round-info" style="position:absolute;bottom:2px;left:4px;font-size:9px;color:var(--dnd-text-highlight);background:var(--dnd-bg-secondary);padding:0 4px;border-radius:2px;">第 ${round} 回合</div>
                    
                    <!-- Battle Map Controls -->
                    <div class="dnd-map-controls" style="position:absolute;top:2px;right:2px;display:flex;gap:2px;pointer-events:auto;opacity:0.8;">
                        <button type="button" onclick='window.DND_Dashboard_UI.regenerateMap(${safeLocationArg}, "svg")' title="生成/刷新 战斗底图" style="background:var(--dnd-bg-tertiary);border:1px solid var(--dnd-border-subtle);color:var(--dnd-text-main);border-radius:3px;padding:1px 4px;cursor:pointer;font-size:9px;"><i class="fa-solid fa-palette"></i> AI底图</button>
                    </div>
                </div>
            `);
        } else {
            // 仅更新回合数
            $el.find('#dnd-map-round-info').text(`第 ${round} 回合`);
            $el.data('combat-location-name', locationName);
        }

        // 3. 增量更新 Token (Dynamic Layer)
        const currentTokens = mapData.filter(m => m['类型'] === 'Token');
        const activeTokenIds = new Set();
        
        // [新增] 获取队伍数据以匹配真实ID
        const partyData = deps.dataManager.getPartyData();

        currentTokens.forEach(item => {
            const pos = deps.dataManager.parseValue(item['坐标'], 'coord');
            if (!pos) return;

            const px = (pos.x !== undefined ? pos.x : 1) - 1;
            const py = (pos.y !== undefined ? pos.y : 1) - 1;
            const size = deps.dataManager.parseValue(item['大小'], 'size') || { w: 1, h: 1 };

            const enc = encounters ? encounters.find(e => e['单位名称'] === item['单位名称']) : null;
            const isEnemy = enc ? enc['阵营'] === '敌方' : false;
            const isActive = enc ? enc['是否为当前行动者'] === '是' : false;

            const tokenSize = Math.max(cellSize * size.w - 2, 4);
            const bgColor = isEnemy ? 'var(--dnd-accent-red)' : 'var(--dnd-accent-green)';
            const borderColor = isActive ? 'var(--dnd-border-gold)' : 'transparent';
            
            // 生成唯一且合法的 DOM ID
            const safeId = 'dnd-token-' + item['单位名称'].replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_');
            activeTokenIds.add(safeId);

            let $token = $innerMap.find(`#${safeId}`);
            
            // 计算目标 CSS
            const targetCss = {
                left: (px * cellSize + 1) + 'px',
                top: (py * cellSize + 1) + 'px',
                width: tokenSize + 'px',
                height: tokenSize + 'px',
                background: bgColor,
                borderColor: borderColor
            };

            if ($token.length > 0) {
                // 更新现有 Token (利用 CSS transition 实现平滑移动)
                $token.css(targetCss);
                
                // 更新 Active 状态
                if (isActive && !$token.hasClass('active')) $token.addClass('active');
                else if (!isActive && $token.hasClass('active')) $token.removeClass('active');
                
            } else {
                // 创建新 Token
                // [新增] 优先携带完整身份上下文，以便头像按聊天 + CHAR_ID 绑定
                let avatarIdentity = { '单位名称': item['单位名称'] };
                if (partyData) {
                    const match = partyData.find(p => p['姓名'] === item['单位名称']);
                    if (match) {
                        avatarIdentity = match;
                    }
                }
                const avatarInfo = ((window as any).DND_Dashboard_UI || this).resolveAvatarStorageKeys?.( avatarIdentity, item['单位名称']);
                
                const initialToken = ((window as any).DND_Dashboard_UI || this).getNameInitial?.( item['单位名称']);
                const uid = `token-content-${safeId}`;
                
                $token = $(`<div id="${safeId}" class="dnd-minimap-token ${isActive ? 'active' : ''}" title="${item['单位名称']}">
                    <div id="${uid}" data-avatar-key="${avatarInfo.domKey}" title="${item['单位名称']}" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:var(--dnd-btn-text);font-size:${Math.floor(tokenSize*0.6)}px;text-shadow:0 0 2px var(--dnd-bg-main);pointer-events:none;">
                        ${initialToken}
                    </div>
                </div>`);
                $token.css(targetCss);
                
                // [新增] 异步加载头像
                setTimeout(() => ((window as any).DND_Dashboard_UI || this).loadAvatarAsync?.( avatarIdentity, uid, item['单位名称']), 0);
                
                // 绑定点击事件
                const self = this;
                $token.on('click', (e) => {
                    e.stopPropagation();
                    if (self._targetingMode.active) {
                        const p = deps.dataManager.parseValue(item['坐标'], 'coord');
                        if (p) self.handleMapInteraction(p.x||1, p.y||1);
                    } else {
                        if (enc) ((window as any).DND_Dashboard_UI || self).showCombatUnitDetail?.( enc, e);
                    }
                });
                
                $innerMap.append($token);
            }
        });

        // 清理已移除的 Token
        $innerMap.find('.dnd-minimap-token').each(function() {
            const id = $(this).attr('id');
            if (id && !activeTokenIds.has(id)) {
                $(this).fadeOut(300, function() { $(this).remove(); });
            }
        });

        // 4. 更新辅助元素 (虚拟位置 & 范围圈)
        // 先清除旧的辅助元素
        $innerMap.find('.dnd-map-overlay').remove();
        
        const activeChar = ((window as any).DND_Dashboard_UI || this).getControlledCharacter?.( );
        const activeId = activeChar ? (activeChar['CHAR_ID'] || activeChar['PC_ID'] || activeChar['姓名']) : 'default';
        let sourcePos = { x: 0, y: 0 };
        let sourceFound = false;

        
        let realPos = null;

        if (encounters && activeChar) {
            let activeUnit = encounters.find(u => u['单位名称'] === activeChar['姓名']);
            if (!activeUnit && activeChar['姓名']) {
                activeUnit = encounters.find(u => activeChar['姓名'].includes(u['单位名称']) || u['单位名称'].includes(activeChar['姓名']));
            }
            if (activeUnit) {
                const token = mapData.find(m => m['类型'] === 'Token' && m['单位名称'] === activeUnit['单位名称']);
                if (token) {


                    const p = deps.dataManager.parseValue(token['坐标'], 'coord');
                    if (p) realPos = { x: p.x || 1, y: p.y || 1 };
                }
            }
        }

        if (activeId !== 'default' && this._virtualPosPool && this._virtualPosPool[activeId]) {
            sourcePos = { ...this._virtualPosPool[activeId] };
            sourceFound = true; // [修复] 必须标记已找到源头位置，否则下方不会渲染测距圈
            // 渲染虚拟位置 (Ghost)
            const vPxX = (sourcePos.x - 1) * cellSize;
            const vPxY = (sourcePos.y - 1) * cellSize;
            
            // [修复] 移除灰色填充，仅保留虚线边框作为透明覆盖层
            const ghostHtml = `<div class="dnd-map-overlay" style="position:absolute;left:${vPxX}px;top:${vPxY}px;width:${cellSize}px;height:${cellSize}px;border:2px dashed var(--dnd-text-highlight);border-radius:50%;background:transparent;pointer-events:none;z-index:20;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--dnd-btn-text);">👻</div>`;
            $innerMap.append(ghostHtml);

            if (realPos) {
                const rPxX = (realPos.x - 1) * cellSize + cellSize / 2;
                const rPxY = (realPos.y - 1) * cellSize + cellSize / 2;
                const vCenterX = vPxX + cellSize / 2;
                const vCenterY = vPxY + cellSize / 2;
                
                const lineSvg = `
                    <svg class="dnd-map-overlay" width="${mapWidth}" height="${mapHeight}" style="position:absolute;top:0;left:0;pointer-events:none;z-index:15;">
                        <line x1="${rPxX}" y1="${rPxY}" x2="${vCenterX}" y2="${vCenterY}" stroke="var(--dnd-text-highlight)" stroke-width="1" stroke-dasharray="4"/>
                    </svg>
                `;
                $innerMap.append(lineSvg);
            }
        } else if (realPos) {
            sourcePos = realPos;
            sourceFound = true;
        }

        if (this._targetingMode.active && sourceFound) {
            const range = this._targetingMode.range || 1;
            const rangePx = range * cellSize;
            const srcPxX = (sourcePos.x - 1) * cellSize + cellSize / 2;
            const srcPxY = (sourcePos.y - 1) * cellSize + cellSize / 2;
            
            // [修复] 使用正确的 box-shadow 语法，使用绿色光晕匹配边框颜色
            const rangeHtml = `<div class="dnd-map-overlay" style="position:absolute;left:${srcPxX - rangePx}px;top:${srcPxY - rangePx}px;width:${rangePx * 2}px;height:${rangePx * 2}px;border:2px solid var(--dnd-accent-green);background:transparent;border-radius:50%;pointer-events:none;z-index:25;box-shadow: 0 0 10px rgba(58, 107, 74, 0.4);"></div>`;
            $innerMap.append(rangeHtml);
        }
    },

    // [新增] 重新生成地图 (Wrapper for onclick)
  };
}
