import {getErrorFromResponse} from './get-error-from-response'
/**
 * creates an onEnter hook that performs a load action before rendering the route
 * @param {Baobab} tree state tree
 * @param {Array.<Function>} actions load action that will be called
 * @returns {onEnter} onEnter hook
 */
export function performLoadActions (tree, actions) {
  /**
   * call action before entering
   * @param {Object} nextState next location state
   * @param {Function} replace replace location
   * @param {Function} callback onEnter callback
   * @returns {undefined}
   */
  function onEnter (nextState, replace, callback) {
    let promise = Promise.resolve()

    actions.forEach(action => {
      promise = promise.then(() => action(nextState, tree))
    })

    promise.then(() => callback(), err => {
      if (err.status === 401) {
        const nextUrl = window.location.origin +
          nextState.location.pathname

        window.location.href = `${process.env.FRONT_URL}/login?next=${encodeURIComponent(nextUrl)}`
      } else {
        tree.set('error', getErrorFromResponse(err))
        tree.commit()

        callback()
      }
    })
  }

  return onEnter
}
