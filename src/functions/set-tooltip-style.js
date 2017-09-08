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
  const [y, x, yAttachment = 'outside', xAttachment = 'inside'] = pos(position)

  const transform = []

  if (x === 'right') {
    if (xAttachment === 'outside') {
      style.left = px(right + PADDING)
    } else {
      style.left = px(right)
      transform.push('translateX(-100%)')
    }
  } else if (x === 'left') {
    if (xAttachment === 'outside') {
      style.left = px(left - PADDING)
      transform.push('translateX(-100%)')
    } else {
      style.left = px(left)
    }
  }

  if (y === 'bottom') {
    if (yAttachment === 'outside') {
      style.top = px(bottom + PADDING)
    } else {
      style.top = px(bottom)
      transform.push('translateY(-100%)')
    }
  } else if (y === 'top') {
    if (yAttachment === 'outside') {
      style.top = px(top - PADDING)
      transform.push('translateY(-100%)')
    } else {
      style.top = px(top)
    }
  }

  style.transform = transform.join(' ')
}
