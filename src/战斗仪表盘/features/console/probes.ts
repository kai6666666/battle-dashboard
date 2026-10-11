/**
 * probes.ts — Debug 控制台自检探针集（b15）
 */
interface ProbeApi {
  exportTableAsJson?: () => any;
  updateCell?: (arg: any) => Promise<any>;
}
function getProbeApi(): ProbeApi | null {
  try {
    const w: any = window as any;
    return w.AutoCardUpdaterAPI || (w.parent && w.parent.AutoCardUpdaterAPI) || (w.top && w.top.AutoCardUpdaterAPI) || null;
  } catch (e) { return null; }
}
function findSheet(t: any, name: string): { key: string; sheet: any } | null {
  try {
    const keys = Object.keys(t || {}).filter(k => String(k).startsWith('sheet_'));
    const k = keys.find(kk => t[kk] && t[kk].name === name) || keys.find(kk => t[kk] && t[kk].name && String(t[kk].name).includes(name));
    return k ? { key: k, sheet: t[k] } : null;
  } catch (e) { return null; }
}
/** 隐藏列读写自检（世界地图点） */
export async function runHiddenColumnsProbe(): Promise<void> {
  const log = (...a: any[]) => console.log('[PROBE]', ...a);
  const api = getProbeApi();
  if (!api || typeof api.exportTableAsJson !== 'function') { log('✗ API 不可用'); return; }
  const t = api.exportTableAsJson();
  const wm = findSheet(t, '世界地图点');
  if (!wm) { log('✗ 未找到「世界地图点」表'); return; }
  log('世界地图点 key =', wm.key, '| 行数 =', wm.sheet.content.length - 1);
  log('表头 =', JSON.stringify(wm.sheet.content[0]));
  const hdr = wm.sheet.content[0];
  const colIdx = hdr.indexOf('MapStructureJSON');
  log('MapStructureJSON 列位置 =', colIdx);
  const hasRow = wm.sheet.content.length > 1;
  if (hasRow) {
    log('第1行该列现值 =', String(wm.sheet.content[1][colIdx] ?? '').slice(0, 60) || '(空)');
  } else {
    log('（表无数据行，跳过写探针）');
  }
  if (hasRow && colIdx >= 0 && typeof api.updateCell === 'function') {
    const origVal = wm.sheet.content[1][colIdx];
    const probe = 'PROBE_' + Date.now();
    let wr: any = null;
    try {
      wr = await api.updateCell({ tableName: '世界地图点', rowIndex: 1, colIdentifier: 'MapStructureJSON', value: probe, skipNotify: true });
    } catch (e: any) { wr = 'THROW: ' + (e && e.message); }
    log('updateCell(写隐藏列) 返回 =', wr);
    try {
      const t2 = api.exportTableAsJson();
      const wm2 = findSheet(t2, '世界地图点');
      const got = wm2 ? wm2.sheet.content[1][colIdx] : null;
      log('读回值 =', String(got ?? '').slice(0, 40), '| 写入成功 =', String(got) === probe);
    } catch (e2) {}
    try {
      await api.updateCell({ tableName: '世界地图点', rowIndex: 1, colIdentifier: 'MapStructureJSON', value: (origVal === null || origVal === undefined) ? '' : origVal, skipNotify: true });
      log('已恢复原值');
    } catch (e3: any) { log('恢复失败(可忽略，原值为空): ' + (e3 && e3.message)); }
  }
  log('=== DONE ===');
}
/** 地图四表列位速查（轻量、只读） */
export async function runMapTablesProbe(): Promise<void> {
  const log = (...a: any[]) => console.log('[PROBE]', ...a);
  const api = getProbeApi();
  if (!api || typeof api.exportTableAsJson !== 'function') { log('✗ API 不可用'); return; }
  const t = api.exportTableAsJson();
  const checks: Array<[string, string[]]> = [
    ['世界地图点', ['MapStructureJSON', 'LastUpdated', '当前显示地图', 'VisualJSON']],
    ['战斗遭遇', ['坐标', '大小', 'Token', '网格']],
    ['地图元素表', ['坐标', '图标']],
    ['全局数据表', ['场景描述']],
  ];
  for (const pair of checks) {
    const name = pair[0];
    const cols = pair[1];
    const f = findSheet(t, name);
    if (!f) { log('✗ 未找到表:', name); continue; }
    const hdr = f.sheet.content[0];
    const pos = cols.map(c => c + '=' + hdr.indexOf(c)).join('  ');
    log(name, '| 行数 =', f.sheet.content.length - 1, '|', pos);
  }
  log('=== DONE ===');
}
