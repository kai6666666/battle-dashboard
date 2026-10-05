// features/dnd-character/character-avatar.ts
// 头像系统（身份解析/上传/刷新）（b5 · 自 BasedonST `src/ui/modules/UICharacter.js` 拆分移植）
// 工厂 + DI；与同域其它 fragment 经 index.ts 合并为同一对象（this 跨块可用）。
import { DND_CONFIG } from '../dnd-core';

export function createCharacterAvatarFragment(deps: any): any {
const getAvatarValue = (value) => {
    if (value === undefined || value === null) return null;
    const normalized = String(value).trim();
    return normalized || null;
};

const uniqueAvatarValues = (values) => {
    const result = [];
    const seen = new Set();

    values.forEach(value => {
        const normalized = getAvatarValue(value);
        if (!normalized || seen.has(normalized)) return;
        seen.add(normalized);
        result.push(normalized);
    });

    return result;
};

const normalizeAvatarIdentity = (avatarIdentity, fallbackName = '') => {
    if (avatarIdentity && typeof avatarIdentity === 'object' && !Array.isArray(avatarIdentity)) {
        return {
            CHAR_ID: getAvatarValue(avatarIdentity['CHAR_ID'] ?? avatarIdentity.CHAR_ID ?? avatarIdentity.charId),
            PC_ID: getAvatarValue(avatarIdentity['PC_ID'] ?? avatarIdentity.PC_ID ?? avatarIdentity.pcId),
            姓名: getAvatarValue(avatarIdentity['姓名'] ?? avatarIdentity.name ?? fallbackName),
            单位名称: getAvatarValue(avatarIdentity['单位名称'] ?? avatarIdentity.unitName),
            legacyKey: getAvatarValue(avatarIdentity.legacyKey ?? avatarIdentity.rawKey)
        };
    }

    return {
        CHAR_ID: null,
        PC_ID: null,
        姓名: getAvatarValue(fallbackName),
        单位名称: null,
        legacyKey: getAvatarValue(avatarIdentity)
    };
};

const buildAvatarScopedKey = (chatId, identityType, identityValue) => {
    const scope = encodeURIComponent(getAvatarValue(chatId) || 'global');
    const type = encodeURIComponent(getAvatarValue(identityType) || 'legacy');
    const value = encodeURIComponent(getAvatarValue(identityValue) || 'unknown');
    return `chat_avatar__${scope}__${type}__${value}`;
};

const resolveAvatarStorageInfo = (avatarIdentity, fallbackName = '') => {
    const identity = normalizeAvatarIdentity(avatarIdentity, fallbackName);
    const displayName = identity.姓名 || identity.单位名称 || identity.legacyKey || getAvatarValue(fallbackName) || '角色';
    const canonicalType = identity.CHAR_ID
        ? 'char'
        : identity.PC_ID
            ? 'pc'
            : identity.姓名
                ? 'name'
                : identity.单位名称
                    ? 'unit'
                    : identity.legacyKey
                        ? 'legacy'
                        : null;
    const canonicalValue = identity.CHAR_ID || identity.PC_ID || identity.姓名 || identity.单位名称 || identity.legacyKey;
    const chatId = deps.settingsSync.getCurrentChatId() || 'global';
    const canonicalKey = canonicalValue ? buildAvatarScopedKey(chatId, canonicalType, canonicalValue) : null;
    const legacyRawKeys = uniqueAvatarValues([
        identity.CHAR_ID,
        identity.PC_ID,
        identity.姓名,
        identity.单位名称,
        identity.legacyKey
    ]);

    return {
        identity,
        displayName,
        chatId,
        canonicalKey,
        canonicalChatKey: canonicalKey ? `avatar_${canonicalKey}` : null,
        canonicalLocalStorageKey: canonicalKey ? `dnd_avatar_${canonicalKey}` : null,
        legacyRawKeys,
        legacyChatKeys: legacyRawKeys.map(key => `avatar_${key}`),
        legacyLocalStorageKeys: legacyRawKeys.map(key => `dnd_avatar_${key}`),
        domKey: canonicalKey || buildAvatarScopedKey(chatId, 'legacy', displayName)
    };
};

const persistCanonicalAvatar = async (avatarInfo, base64Data) => {
    if (!avatarInfo?.canonicalKey || !base64Data) return false;
    await deps.settingsSync.saveToChat(avatarInfo.canonicalChatKey, base64Data);
    return await deps.dbAdapter.put(avatarInfo.canonicalKey, base64Data);
};

const removeLocalAvatarKey = (key) => {
    try {
        if (key) localStorage.removeItem(key);
    } catch (e) {}
};

  return {
    resolveAvatarIdentity(avatarIdentity, fallbackName = '') {
        return normalizeAvatarIdentity(avatarIdentity, fallbackName);
    },

    resolveAvatarStorageKeys(avatarIdentity, fallbackName = '') {
        return resolveAvatarStorageInfo(avatarIdentity, fallbackName);
    },

    // 头像存储管理 (使用 IndexedDB + Chat Metadata)
    avatarStorage: {
        get: async (avatarIdentity, fallbackName = '') => {
            const avatarInfo = resolveAvatarStorageInfo(avatarIdentity, fallbackName);
            if (!avatarInfo.canonicalKey) return null;

            // 1. 优先尝试新的聊天作用域主键
            const canonicalChatVal = deps.settingsSync.getFromChat(avatarInfo.canonicalChatKey);
            if (canonicalChatVal) {
                await deps.dbAdapter.put(avatarInfo.canonicalKey, canonicalChatVal);
                return canonicalChatVal;
            }

            const canonicalDbVal = await deps.dbAdapter.get(avatarInfo.canonicalKey);
            if (canonicalDbVal) {
                await deps.settingsSync.saveToChat(avatarInfo.canonicalChatKey, canonicalDbVal);
                return canonicalDbVal;
            }

            // 2. 回退到旧版 Chat Metadata Key
            for (const legacyChatKey of avatarInfo.legacyChatKeys) {
                const legacyChatVal = deps.settingsSync.getFromChat(legacyChatKey);
                if (!legacyChatVal) continue;

                await persistCanonicalAvatar(avatarInfo, legacyChatVal);
                return legacyChatVal;
            }

            // 3. 回退到旧版 IndexedDB Key
            for (const legacyKey of avatarInfo.legacyRawKeys) {
                const legacyDbVal = await deps.dbAdapter.get(legacyKey);
                if (!legacyDbVal) continue;

                await persistCanonicalAvatar(avatarInfo, legacyDbVal);
                return legacyDbVal;
            }

            // 4. 回退到旧版 localStorage Key，并迁移到新主键
            for (const legacyStorageKey of avatarInfo.legacyLocalStorageKeys) {
                const legacyLocalVal = localStorage.getItem(legacyStorageKey);
                if (!legacyLocalVal) continue;

                await persistCanonicalAvatar(avatarInfo, legacyLocalVal);
                removeLocalAvatarKey(legacyStorageKey);
                return legacyLocalVal;
            }

            return null;
        },
        set: async (avatarIdentity, base64Data, fallbackName = '') => {
            const avatarInfo = resolveAvatarStorageInfo(avatarIdentity, fallbackName);
            return await persistCanonicalAvatar(avatarInfo, base64Data);
        },
        remove: async (avatarIdentity, fallbackName = '') => {
            const avatarInfo = resolveAvatarStorageInfo(avatarIdentity, fallbackName);

            if (avatarInfo.canonicalChatKey) {
                await deps.settingsSync.deleteFromChat(avatarInfo.canonicalChatKey);
            }
            if (avatarInfo.canonicalKey) {
                await deps.dbAdapter.delete(avatarInfo.canonicalKey);
            }
            removeLocalAvatarKey(avatarInfo.canonicalLocalStorageKey);

            for (const legacyChatKey of avatarInfo.legacyChatKeys) {
                await deps.settingsSync.deleteFromChat(legacyChatKey);
            }
            for (const legacyKey of avatarInfo.legacyRawKeys) {
                await deps.dbAdapter.delete(legacyKey);
            }
            for (const legacyStorageKey of avatarInfo.legacyLocalStorageKeys) {
                removeLocalAvatarKey(legacyStorageKey);
            }

            return true;
        }
    },

    // 异步加载头像
    async loadAvatarAsync(avatarIdentity, elemId, fallbackName = '') {
        const { $ } = deps.utils.getCore();
        const base64 = await this.avatarStorage.get(avatarIdentity, fallbackName);
        if (base64) {
            const $el = $(`#${elemId}`);
            if ($el.length) {
                $el.html(`<img src="${base64}" style="width:100%;height:100%;object-fit:cover;">`);
                // 如果加载失败，显示回退的字母 (虽然 img onerror 应该处理了，但这里是直接替换 HTML)
                const self = this;
                $el.find('img').on('error', function() {
                    $(this).hide();
                    // 重新插入字母
                    const initial = self.getNameInitial($el.attr('title'));
                    const fontSize = Math.floor($el.width() * 0.5);
                    $el.html(`<div class="dnd-avatar-initial" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--dnd-text-highlight);font-weight:bold;font-size:${fontSize}px;">${initial}</div>`);
                });
            }
        }
    },

    // 生成头像HTML (异步模式)
    renderAvatar(name, avatarIdentity, size = 40) {
        const avatarInfo = this.resolveAvatarStorageKeys(avatarIdentity, name);
        const initial = ((window as any).DND_Dashboard_UI || this).getNameInitial?.( name);
        const fontSize = Math.floor(size * 0.5);
        const rawIdentityKey = avatarInfo.identity.CHAR_ID || avatarInfo.identity.PC_ID || avatarInfo.identity.legacyKey || avatarInfo.displayName;
        // 生成唯一ID以便异步填充
        const uid = `avatar-${avatarInfo.domKey.replace(/[^a-zA-Z0-9_-]/g, '_')}-${Math.random().toString(36).substr(2, 9)}`;
        
        // 触发异步加载
        setTimeout(() => this.loadAvatarAsync(avatarIdentity, uid, name), 0);

        // 返回占位符 (显示首字母)
        return `
            <div id="${uid}" class="dnd-avatar-container" data-char-id="${rawIdentityKey || ''}" data-avatar-key="${avatarInfo.domKey}" style="width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;border:1px solid var(--dnd-border-gold);flex-shrink:0;background:linear-gradient(135deg, #2a2a2e 0%, #1a1a1c 100%);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;" title="${name}">
                <span style="color:var(--dnd-text-highlight);font-weight:bold;font-size:${fontSize}px;">${initial}</span>
            </div>
        `;
    },

    // 显示头像上传对话框
    showAvatarUploadDialog(avatarIdentity, charName) {
        const { $, window: coreWin } = deps.utils.getCore();
        const avatarInfo = this.resolveAvatarStorageKeys(avatarIdentity, charName);
        const displayName = charName || avatarInfo.displayName;
        
        // 移除已存在的对话框
        $('#dnd-avatar-upload-dialog').remove();
        
        // Note: avatarStorage.get is async, but here we need synchronous display for dialog init?
        // Actually we can await or just load it. The original code used synchronous localstorage get?
        // Original code: const storedAvatar = UIRenderer.avatarStorage.get(charId); -> Returns Promise!
        // The original code treated it as sync?
        // "let val = await deps.dbAdapter.get(charId);" inside get.
        // So avatarStorage.get returns a Promise.
        // Original code:
        /*
        const storedAvatar = UIRenderer.avatarStorage.get(charId);
        // ...
        ${storedAvatar ? ... }
        */
        // If storedAvatar is a Promise, it is truthy. This might have been a bug in original code or I misread.
        // UIRenderer.avatarStorage.get is async.
        // Let's fix this properly by using .then or await.
        // But showAvatarUploadDialog is called from onclick attribute string in some places?
        // "onclick="window.DND_Dashboard_UI.showAvatarUploadDialog..."
        // So it can be async.
        
        this.avatarStorage.get(avatarIdentity, displayName).then(storedAvatar => {
            const initial = ((window as any).DND_Dashboard_UI || this).getNameInitial?.( displayName);
            
            // 检测是否为移动端
            const isMobileDialog = (coreWin.innerWidth || $(coreWin).width()) < 768;
            
            const dialogHtml = `
                <div id="dnd-avatar-upload-dialog" style="
                    position: fixed;
                    ${isMobileDialog ? `
                        top: 20px;
                        left: 10px;
                        right: 10px;
                        transform: none;
                        width: auto;
                    ` : `
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        min-width: 300px;
                        max-width: 90vw;
                    `}
                    background: var(--dnd-bg-panel, #161618);
                    border: 1px solid var(--dnd-border-gold, #9d8b6c);
                    border-radius: 8px;
                    padding: 20px;
                    z-index: 2147483650;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                ">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border-bottom:1px solid var(--dnd-border-inner);padding-bottom:10px;">
                        <span style="color:var(--dnd-text-highlight);font-weight:bold;font-size:16px;">设置头像 - ${displayName}</span>
                        <span id="dnd-avatar-dialog-close" style="cursor:pointer;color:#888;font-size:18px;" title="关闭"><i class="fa-solid fa-times"></i></span>
                    </div>
                    
                    <div style="display:flex;flex-direction:column;align-items:center;gap:15px;">
                        <div id="dnd-avatar-preview" style="width:80px;height:80px;border-radius:50%;overflow:hidden;border:2px solid var(--dnd-border-gold);background:linear-gradient(135deg, #2a2a2e 0%, #1a1a1c 100%);display:flex;align-items:center;justify-content:center;">
                            ${storedAvatar 
                                ? `<img src="${storedAvatar}" style="width:100%;height:100%;object-fit:cover;">` 
                                : `<span style="color:var(--dnd-text-highlight);font-weight:bold;font-size:36px;">${initial}</span>`
                            }
                        </div>
                        
                        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
                            <label style="
                                background: rgba(157, 139, 108, 0.2);
                                border: 1px solid var(--dnd-border-gold);
                                color: var(--dnd-text-highlight);
                                padding: 8px 16px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 13px;
                                transition: all 0.2s;
                            " onmouseover="this.style.background='rgba(157, 139, 108, 0.4)'" onmouseout="this.style.background='rgba(157, 139, 108, 0.2)'">
                                <i class="fa-solid fa-camera"></i> 选择图片
                                <input type="file" id="dnd-avatar-file-input" accept="image/*" style="display:none;">
                            </label>
                            
                            ${storedAvatar ? `
                                <button id="dnd-avatar-remove-btn" style="
                                    background: rgba(138, 44, 44, 0.3);
                                    border: 1px solid #8a2c2c;
                                    color: #ff6b6b;
                                    padding: 8px 16px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 13px;
                                    transition: all 0.2s;
                                " onmouseover="this.style.background='rgba(138, 44, 44, 0.5)'" onmouseout="this.style.background='rgba(138, 44, 44, 0.3)'">
                                    <i class="fa-solid fa-trash"></i> 移除头像
                                </button>
                            ` : ''}
                        </div>
                        
                        <div style="font-size:11px;color:#888;text-align:center;">
                            支持 JPG、PNG、GIF 格式<br>
                            图片将存储在浏览器本地
                        </div>
                    </div>
                </div>
                <div id="dnd-avatar-dialog-backdrop" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0,0,0,0.6);
                    z-index: 2147483646;
                "></div>
            `;
            
            $('body').append(dialogHtml);
            
            // 绑定事件
            $('#dnd-avatar-dialog-close, #dnd-avatar-dialog-backdrop').on('click', () => {
                $('#dnd-avatar-upload-dialog, #dnd-avatar-dialog-backdrop').remove();
            });
            
            const self = this;
            $('#dnd-avatar-file-input').on('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                // 检查文件大小 (限制 5MB - IndexedDB 可存储大量数据)
                if (file.size > 5 * 1024 * 1024) {
                    deps.notification.warning('图片文件过大，请选择小于 5MB 的图片');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const base64 = evt.target.result;
                    
                    // 压缩图片
                    self.compressImage(base64, 150, (compressedBase64) => {
                        // 保存头像
                        self.avatarStorage.set(avatarIdentity, compressedBase64, displayName).then(success => {
                            if (success) {
                                // 更新预览
                                $('#dnd-avatar-preview').html(`<img src="${compressedBase64}" style="width:100%;height:100%;object-fit:cover;">`);
                                
                                // 更新页面上所有该角色的头像
                                self.refreshAvatars(avatarIdentity, displayName);
                                
                                // 关闭对话框
                                setTimeout(() => {
                                    $('#dnd-avatar-upload-dialog, #dnd-avatar-dialog-backdrop').remove();
                                }, 500);
                            } else {
                                deps.notification.error('保存失败，可能是浏览器存储空间不足');
                            }
                        });
                    });
                };
                reader.readAsDataURL(file);
            });
            
            $('#dnd-avatar-remove-btn').on('click', async () => {
                const confirmed = await deps.notification.confirm('确定要移除头像吗？', {
                    title: '移除头像',
                    confirmText: '移除',
                    type: 'danger'
                });
                if (confirmed) {
                    await this.avatarStorage.remove(avatarIdentity, displayName);
                    this.refreshAvatars(avatarIdentity, displayName);
                    $('#dnd-avatar-upload-dialog, #dnd-avatar-dialog-backdrop').remove();
                }
            });
        });
    },
    
    // 刷新页面上指定角色的所有头像
    refreshAvatars(avatarIdentity, fallbackName = '') {
        const { $ } = deps.utils.getCore();
        const avatarInfo = this.resolveAvatarStorageKeys(avatarIdentity, fallbackName);

        this.avatarStorage.get(avatarIdentity, fallbackName).then(storedAvatar => {
            $(`[data-avatar-key="${avatarInfo.domKey}"]`).each(function() {
                const $container = $(this);
                const size = $container.width();
                const fontSize = Math.floor(size * 0.5);
                
                // 获取角色名（从 title 属性或子元素）
                const initial = $container.find('.dnd-avatar-initial').text() || $container.find('span').text() || '?';
                
                if (storedAvatar) {
                    $container.html(`
                        <img src="${storedAvatar}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                        <div class="dnd-avatar-initial" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;color:var(--dnd-text-highlight);font-weight:bold;font-size:${fontSize}px;background:linear-gradient(135deg, #2a2a2e 0%, #1a1a1c 100%);">${initial}</div>
                    `);
                } else {
                    $container.html(`<span style="color:var(--dnd-text-highlight);font-weight:bold;font-size:${fontSize}px;">${initial}</span>`);
                    $container.css({
                        'display': 'flex',
                        'align-items': 'center',
                        'justify-content': 'center',
                        'background': 'linear-gradient(135deg, #2a2a2e 0%, #1a1a1c 100%)'
                    });
                }
            });
            
            // 同时刷新 HUD
            if (((window as any).DND_Dashboard_UI || this).state === 'mini') {
                ((window as any).DND_Dashboard_UI || this).renderHUD?.( );
            }
        });
    },

    // 保存最后一次点击位置，用于定位卡片
  };
}
