import Tree from 'baobab'

/**
 * 
 * @param {Object} defaultState
 */
export function initializeTreeMiddleware (defaultState) {
  /**
   * writes a `Baobab` tree with the default state in `res.locals.tree`
   * @param {Object} req express request
   * @param {Object} res express response
   * @param {Function} next next handler
   * @returns {undefined}
   */
  function actualMiddleware (req, res, next) {
    const tree = res.locals.tree = new Tree(defaultState)
    if (req.debugMode) {
      tree.set('debugMode', true)
    }
    if (req.locale) {
      tree.set('locale', req.locale)
    }
    tree.commit()
    next()
  }
  
  return actualMiddleware
}
