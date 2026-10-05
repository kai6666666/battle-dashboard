/**
 * part-08-theme.ts — DND 仪表盘样式聚合器（b3）
 *
 * 内容按原顺序拼接（分块见 part-08a ~ part-08e），
 * 与拆分前 DND `ui/styles.js` 的 css 字符串逐字节一致。
 */
import { STYLES_PART_08A_DND_BASE_1 } from './part-08a-dnd-base-1';
import { STYLES_PART_08B_DND_BASE_2 } from './part-08b-dnd-base-2';
import { STYLES_PART_08C_DND_NOTIFY_MODAL_ICONS } from './part-08c-dnd-notify-modal-icons';
import { STYLES_PART_08D_DND_ANIMATIONS } from './part-08d-dnd-animations';
import { STYLES_PART_08E_DND_FORMS_MISC } from './part-08e-dnd-forms-misc';

export const STYLES_PART_08_DND = [
  STYLES_PART_08A_DND_BASE_1,
  STYLES_PART_08B_DND_BASE_2,
  STYLES_PART_08C_DND_NOTIFY_MODAL_ICONS,
  STYLES_PART_08D_DND_ANIMATIONS,
  STYLES_PART_08E_DND_FORMS_MISC,
].join('');
