/**
 * Inline SVG icon markup from assets/icons.svg, the JavaScript twin of
 * _includes/icon.html. `name` is a <symbol> id in the sprite.
 *
 *   wsIcon('copy')                          -> <svg class="icon icon-copy" ...>
 *   wsIcon('spinner', 'icon-spin icon-fw')  -> extra classes
 *   wsIcon('bitcoin', '', 'font-size: 23px') -> inline style
 */
let spriteUrl = null;

function getSpriteUrl() {
  if (spriteUrl === null) {
    spriteUrl = (typeof document !== 'undefined'
      && document.querySelector('meta[name="icons-sprite"]')?.content) || '/assets/icons.svg';
  }
  return spriteUrl;
}

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export function wsIcon(name, className = '', style = '') {
  const classes = `icon icon-${name}${className ? ` ${className}` : ''}`;
  const styleAttr = style ? ` style="${escapeAttr(style)}"` : '';
  return `<svg class="${escapeAttr(classes)}" aria-hidden="true"${styleAttr}><use href="${getSpriteUrl()}#${encodeURIComponent(name)}"></use></svg>`;
}
