/**
 * creates a react-router onEnter hook that checks if user is logged in before permitting access to a give route
 * @param {Baobab} tree state tree
 * @returns {onEnter} onEnter hook
 */
export function requireAuth (tree) {
  /**
   * auth onEnter hook
   * @param {Object} nextState next location state
   * @param {Function} replace replace location
   * @returns {undefined}
   */
  function onEnter (nextState, replace) {
    if (!tree.get('user') && !tree.get('error')) {
      replace({
        pathname: '/login',
        query: {
          next: nextState.location.pathname
        }
      })
    }
  }
  return onEnter
}
