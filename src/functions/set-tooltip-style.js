const PADDING = 5
/**
 *
 * @param {Number} n a number
 * @return {String} pixel string
 */
const px = n => `${n}px`

/**
 *
 * @param {String} position raw position string
 * @return {Array.<String>} array of position parts
 */
const pos = position => position.split(' ')

/**
 *
 * @param {CSSStyleDeclaration} style style of wrapper
 * @param {String} position raw position string
 * @param {Number} top wrapper top
 * @param {Number} right wrapper right
 * @param {Number} bottom wrapper bottom
 * @param {Number} left wrapper left
 * @return {undefined}
 */
export function setTooltipStyle (style, position, top, right, bottom, left) {
  const [y, x, xAttachment = 'inside', yAttachment = 'outside'] = pos(position)

  if (x === 'right') {
    if (xAttachment === 'outside') {
      style.left = px(right + PADDING)
      style.right = ''
    } else {
      style.right = px(window.innerWidth - right)
      style.left = ''
    }
  } else if (x === 'left') {
    if (xAttachment === 'outside') {
      style.right = px(left - PADDING)
      style.left = ''
    } else {
      style.left = px(left)
      style.right = ''
    }
  }

  if (y === 'bottom') {
    if (yAttachment === 'outside') {
      style.top = px(bottom + PADDING)
      style.bottom = ''
    } else {
      style.bottom = px(bottom)
      style.top = ''
    }
  } else if (y === 'top') {
    if (yAttachment === 'outside') {
      style.bottom = px(top + PADDING)
      style.top = ''
    } else {
      style.top = px(top)
      style.right = ''
    }
  }
}
