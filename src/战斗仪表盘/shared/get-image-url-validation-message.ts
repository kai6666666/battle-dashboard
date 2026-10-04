/**
 * get-image-url-validation-message.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */

/** x5-a：拆分后本地化类型（原定义：wiring/composer-input-wiring.ts） */
type ImageUrlValidationReason = 'invalid_url' | 'invalid_protocol' | 'svg_url';
export function createGetImageUrlValidationMessage(_deps: any) {
  const getImageUrlValidationMessage = (label: string, reason: ImageUrlValidationReason | null): string => {
    if (reason === 'svg_url') return `${label}不支持 SVG 图片，请使用 PNG、JPEG、WebP 或 GIF。`;
    if (reason === 'invalid_protocol')
      return `${label}仅支持 http/https 或当前站点相对路径，不支持 data:、file:、javascript: 等协议。`;
    return `${label}格式不正确，请填写完整图片链接。`;
  };
  return getImageUrlValidationMessage;
}
