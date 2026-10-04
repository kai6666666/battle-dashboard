/**
 * build-relation-graph-model.ts
 * 从 show-relationship-graph.ts 拆出：关系图谱「数据模型构建」（节点/边/主角/在场解析）。
 */
import { getRowDisplayName } from '../../../entities/name-alias';

type RelationGraphNode = any;
type RelationGraphEdge = any;
type RelationGraphCell = any;
type ParsedRelationshipItem = any;

export interface RelationGraphModelParams {
  deps: any;
  headers: string[];
  rows: any[];
  nameIdx: number;
  relationIdx: number;
  options: any;
  npcTableKey: string;
}

export interface RelationGraphModelResult {
  nodes: Map<string, RelationGraphNode>;
  edges: RelationGraphEdge[];
  rawData: any;
  resolvedPlayerName: string;
}

export function buildRelationGraphModel(params: RelationGraphModelParams): RelationGraphModelResult {
  const { deps, headers, rows, nameIdx, relationIdx, options, npcTableKey } = params;
    const nodes = new Map<string, RelationGraphNode>();
    const edges: RelationGraphEdge[] = [];

    const resolveName = (name: RelationGraphCell): string => deps.resolveUserGraphName(String(name || ''));

    const rawData = deps.getCachedRawData() || deps.getTableData();
    // 重建别名注册表
    deps.NameAliasRegistry.rebuild(deps.processJsonData(rawData || {}));
    let playerName = '主角';
    if (rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet?.name?.includes('主角') && sheet.content?.[1]) {
          const headers = sheet.content[0] || [];
          playerName = getRowDisplayName(sheet.content[1], headers) || '主角';
          break;
        }
      }
    }
    const resolvedPlayerName = resolveName(playerName);
    const playerTableKey = (() => {
      for (const k in rawData) {
        if (rawData[k]?.name?.includes('主角')) return k;
      }
      return '';
    })();
    nodes.set(resolvedPlayerName, {
      name: resolvedPlayerName,
      isPlayer: true,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 0,
      tableKey: playerTableKey,
      rowIndex: 0,
    });

    // 查找"在场状态"列索引（模糊匹配）
    const inSceneColIdx = headers.findIndex(h => h && h.includes('在场'));

    rows.forEach((row, idx) => {
      const rawNpcName = row[nameIdx];
      if (!rawNpcName) return;

      const npcName = resolveName(rawNpcName);

      // 判断是否在场：支持多种格式
      let isInScene = false;
      if (inSceneColIdx > 0) {
        const inSceneVal = String(row[inSceneColIdx] || '')
          .trim()
          .toLowerCase();
        const header = String(headers[inSceneColIdx] || '').toLowerCase();

        if (header.includes('离场')) {
          isInScene = inSceneVal === '否' || inSceneVal === 'false' || inSceneVal === 'no';
        } else {
          isInScene =
            inSceneVal.startsWith('在场') || inSceneVal === 'true' || inSceneVal === '是' || inSceneVal === 'yes';
        }
      }

      if (!nodes.has(npcName)) {
        nodes.set(npcName, {
          name: npcName,
          isPlayer: false,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          radius: 0,
          tableKey: npcTableKey,
          rowIndex: idx,
          isInScene: isInScene,
        });
      }

      const relationStr = row[relationIdx] || '';
      const relations = deps.parseRelationshipString(String(relationStr || '')) as ParsedRelationshipItem[];

      relations.forEach(rel => {
        if (!rel.name) return;
        const resolvedRelName = resolveName(rel.name);

        if (resolvedRelName === npcName) return;

        if (!nodes.has(resolvedRelName)) {
          // 查找该人物在NPC表中的行索引
          let relRowIndex = -1;
          let relIsInScene = false;
          for (let ri = 0; ri < rows.length; ri++) {
            if (resolveName(rows[ri][nameIdx]) === resolvedRelName) {
              relRowIndex = ri;
              // 同时读取该角色的在场状态
              if (inSceneColIdx > 0) {
                const inSceneVal = String(rows[ri][inSceneColIdx] || '')
                  .trim()
                  .toLowerCase();
                const header = String(headers[inSceneColIdx] || '').toLowerCase();

                if (header.includes('离场')) {
                  relIsInScene = inSceneVal === '否' || inSceneVal === 'false' || inSceneVal === 'no';
                } else {
                  relIsInScene =
                    inSceneVal.startsWith('在场') ||
                    inSceneVal === 'true' ||
                    inSceneVal === '是' ||
                    inSceneVal === 'yes';
                }
              }
              break;
            }
          }
          nodes.set(resolvedRelName, {
            name: resolvedRelName,
            isPlayer: resolvedRelName === resolvedPlayerName,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 0,
            tableKey: relRowIndex >= 0 ? npcTableKey : '',
            rowIndex: relRowIndex >= 0 ? relRowIndex : undefined,
            isInScene: relIsInScene,
          });
        }

        // 清洗关系词：移除冗余前缀/后缀，分割多关系词
        const cleanRelation = (rawRel: RelationGraphCell): string[] => {
          if (!rawRel) return [];
          const parts = String(rawRel)
            .split(/[,，、;；\/\|]+|\s*[和与&]\s*|\s{2,}|\n/)
            .map(s => s.trim())
            .filter(s => s && s.length < 30); // 放宽初筛限制，后续智能提取

          // 常见关系词库（用于从长文本中智能提取）
          const commonRelations = [
            '恋人',
            '情侣',
            '夫妻',
            '伴侣',
            '爱人',
            '男友',
            '女友',
            '前男友',
            '前女友',
            '朋友',
            '好友',
            '挚友',
            '密友',
            '闺蜜',
            '死党',
            '知己',
            '损友',
            '同学',
            '校友',
            '同窗',
            '学长',
            '学姐',
            '学弟',
            '学妹',
            '前辈',
            '后辈',
            '同事',
            '上司',
            '下属',
            '老板',
            '员工',
            '搭档',
            '队友',
            '战友',
            '伙伴',
            '师父',
            '师傅',
            '徒弟',
            '弟子',
            '老师',
            '学生',
            '导师',
            '门生',
            '父亲',
            '母亲',
            '儿子',
            '女儿',
            '兄弟',
            '姐妹',
            '哥哥',
            '姐姐',
            '弟弟',
            '妹妹',
            '爷爷',
            '奶奶',
            '外公',
            '外婆',
            '叔叔',
            '阿姨',
            '舅舅',
            '姑姑',
            '表哥',
            '表姐',
            '表弟',
            '表妹',
            '堂兄',
            '堂弟',
            '堂姐',
            '堂妹',
            '家人',
            '亲人',
            '亲戚',
            '血亲',
            '义父',
            '义母',
            '义兄',
            '义妹',
            '敌人',
            '仇人',
            '对手',
            '劲敌',
            '宿敌',
            '情敌',
            '死敌',
            '冤家',
            '邻居',
            '室友',
            '房东',
            '租客',
            '客户',
            '商人',
            '雇主',
            '雇员',
            '信徒',
            '教徒',
            '追随者',
            '崇拜者',
            '粉丝',
            '陌生人',
            '熟人',
            '路人',
            '过客',
          ];

          return parts
            .map(p => {
              // [新增] 移除所有中英文括号及其内容
              p = p.replace(/[（(][^）)]*[）)]/g, '').trim();
              // === 特殊前缀处理：XX的目标/对象 → 保留XX ===
              const specialSuffixMatch = p.match(/^(.+)的(目标|对象)$/);
              if (specialSuffixMatch) {
                p = specialSuffixMatch[1]; // "执念的目标" → "执念"
              } else {
                // === 普通情况：XX的YY → 保留YY ===
                p = p.replace(/^[\u4e00-\u9fa5]{2,4}的(?=[\u4e00-\u9fa5]{1,4}$)/, '');
              }

              // === 移除冗余前缀 ===
              p = p.replace(/^(?:属于|作为|身为|是其?|为其?|乃)/, '');
              p = p.replace(/^(?:曾经是?|以前是?|原本是?|前)/, '前');
              p = p.replace(/^(?:互为|彼此是?|相互是?)/, '');

              // === 移除冗余后缀 ===
              p = p.replace(/关系$/, '');
              p = p.replace(/对象$/, '');
              p = p.replace(/目标$/, '');

              // === 特殊短语替换 ===
              p = p.replace(/^关系复杂$/, '复杂');
              p = p.replace(/^关系不明$/, '不明');
              p = p.replace(/^关系微妙$/, '微妙');
              p = p.replace(/^关系紧张$/, '紧张');
              p = p.replace(/^关系亲密$/, '亲密');
              p = p.replace(/^关系疏远$/, '疏远');
              p = p.replace(/^(?:不认识|不熟悉|陌生人?)$/, '陌生');
              p = p.replace(/^(?:认识|熟人)$/, '熟人');
              p = p.replace(/^(?:好朋友|挚友|密友|至交)$/, '挚友');
              p = p.replace(/^(?:男朋友|男友)$/, '男友');
              p = p.replace(/^(?:女朋友|女友)$/, '女友');
              p = p.replace(/^(?:前男友|前男朋友)$/, '前男友');
              p = p.replace(/^(?:前女友|前女朋友)$/, '前女友');
              p = p.replace(/^(?:暗恋对象|暗恋)$/, '暗恋');
              p = p.replace(/^(?:单相思|单恋)$/, '单恋');
              p = p.replace(/^(?:青梅竹马|儿时玩伴|发小)$/, '青梅竹马');
              p = p.replace(/^(?:同班同学|同级同学)$/, '同学');
              p = p.replace(/^(?:工作伙伴|合作伙伴|搭档)$/, '搭档');

              p = p.trim();

              // === [新增] 智能提取：如果处理后仍然过长，尝试从末尾提取常见关系词 ===
              if (p.length > 8) {
                // 尝试匹配末尾的常见关系词
                for (const rel of commonRelations) {
                  if (p.endsWith(rel)) {
                    return rel;
                  }
                }
                // 如果没匹配到，尝试提取最后2-4个字
                const lastChars = p.slice(-4);
                for (const rel of commonRelations) {
                  if (lastChars.includes(rel)) {
                    return rel;
                  }
                }
                // 兜底：取最后3个字
                return p.slice(-3);
              }

              return p;
            })
            .filter(s => s && s.length > 0 && s.length <= 8);
        };

        const cleanedLabels = cleanRelation(rel.relation);
        if (cleanedLabels.length === 0) cleanedLabels.push('');

        // 查找已存在的边（无论方向）
        const existingEdge = edges.find(
          e =>
            (e.source === npcName && e.target === resolvedRelName) ||
            (e.source === resolvedRelName && e.target === npcName),
        );

        if (!existingEdge) {
          // 创建新边，使用新的数据结构
          edges.push({
            source: npcName,
            target: resolvedRelName,
            // 新结构：分别存储两个方向的标签
            labelsFromSource: cleanedLabels.slice(0, 2), // source→target 方向，最多2个
            labelsFromTarget: [], // target→source 方向
          });
        } else {
          // 边已存在，追加标签到正确的方向
          if (existingEdge.source === npcName) {
            // 当前npc是source，追加到 labelsFromSource
            const combined = [...(existingEdge.labelsFromSource || []), ...cleanedLabels];
            // 去重并限制最多2个
            existingEdge.labelsFromSource = [...new Set(combined)].slice(0, 2);
          } else {
            // 当前npc是target，追加到 labelsFromTarget
            const combined = [...(existingEdge.labelsFromTarget || []), ...cleanedLabels];
            existingEdge.labelsFromTarget = [...new Set(combined)].slice(0, 2);
          }
        }
      });
    });

    // [新增] 同时抓取主角信息表的人际关系数据
    if (options.includePlayerRelations !== false && rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet?.name === '主角信息' && sheet.content?.[1]) {
          const playerHeaders = sheet.content[0] || [];
          const playerRow = sheet.content[1];
          const playerRelIdx = playerHeaders.findIndex(h => h && h.includes('人际关系'));
          if (playerRelIdx > 0 && playerRow[playerRelIdx]) {
            const playerRelations = deps.parseRelationshipString(
              String(playerRow[playerRelIdx] || ''),
            ) as ParsedRelationshipItem[];
            console.info(`[DICE]主角信息表人际关系: 发现${playerRelations.length}条关系`);

            playerRelations.forEach(rel => {
              if (!rel.name) return;
              const resolvedRelName = resolveName(rel.name);
              if (resolvedRelName === resolvedPlayerName) return;

              if (!nodes.has(resolvedRelName)) {
                // 尝试在NPC表中查找该人物的额外信息
                let relRowIndex = -1;
                let relIsInScene = false;
                for (let ri = 0; ri < rows.length; ri++) {
                  if (resolveName(rows[ri][nameIdx]) === resolvedRelName) {
                    relRowIndex = ri;
                    if (inSceneColIdx > 0) {
                      const inSceneVal = String(rows[ri][inSceneColIdx] || '')
                        .trim()
                        .toLowerCase();
                      const header = String(headers[inSceneColIdx] || '').toLowerCase();
                      if (header.includes('离场')) {
                        relIsInScene = inSceneVal === '否' || inSceneVal === 'false' || inSceneVal === 'no';
                      } else {
                        relIsInScene =
                          inSceneVal.startsWith('在场') ||
                          inSceneVal === 'true' ||
                          inSceneVal === '是' ||
                          inSceneVal === 'yes';
                      }
                    }
                    break;
                  }
                }
                nodes.set(resolvedRelName, {
                  name: resolvedRelName,
                  isPlayer: false,
                  x: 0,
                  y: 0,
                  vx: 0,
                  vy: 0,
                  radius: 0,
                  tableKey: relRowIndex >= 0 ? npcTableKey : '',
                  rowIndex: relRowIndex >= 0 ? relRowIndex : undefined,
                  isInScene: relIsInScene,
                });
              }

              // 清洗关系标签（主角信息表格式通常已规范）
              const rawLabel = String(rel.relation || '').trim();
              const cleanedLabels = rawLabel
                ? rawLabel
                    .split(/[,，、\/\|]+/)
                    .map(s => s.trim())
                    .filter(s => s && s.length > 0 && s.length <= 8)
                    .slice(0, 2)
                : [''];
              if (cleanedLabels.length === 0) cleanedLabels.push('');

              // 查找已存在的边（与NPC表处理逻辑一致）
              const existingEdge = edges.find(
                e =>
                  (e.source === resolvedPlayerName && e.target === resolvedRelName) ||
                  (e.source === resolvedRelName && e.target === resolvedPlayerName),
              );

              if (!existingEdge) {
                edges.push({
                  source: resolvedPlayerName,
                  target: resolvedRelName,
                  labelsFromSource: cleanedLabels.slice(0, 2),
                  labelsFromTarget: [],
                });
              } else {
                // 边已存在（可能NPC表已创建该边），追加主角视角的标签
                if (existingEdge.source === resolvedPlayerName) {
                  const combined = [...(existingEdge.labelsFromSource || []), ...cleanedLabels];
                  existingEdge.labelsFromSource = [...new Set(combined)].slice(0, 2);
                } else {
                  const combined = [...(existingEdge.labelsFromTarget || []), ...cleanedLabels];
                  existingEdge.labelsFromTarget = [...new Set(combined)].slice(0, 2);
                }
              }
            });
          }
          break;
        }
      }
    }

  return { nodes, edges, rawData, resolvedPlayerName };
}
