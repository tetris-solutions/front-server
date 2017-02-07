import window from 'global/window'

/**
 * creates a react-router onEnter hook that checks if user is logged in before permitting access to a given route
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
    if (tree.get('user') || tree.get('error')) return

    if (window.location.hostname === process.env.FRONT_HOST) {
      replace({
        pathname: '/login',
        query: {
          next: nextState.location.pathname
        }
      })
    } else {
      window.location.href = `${process.env.FRONT_URL}/login?next=${encodeURIComponent(window.location.href)}`
    }
  }

  return onEnter
}
