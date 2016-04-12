import {processRequestError} from '../functions/process-request-error'

/**
 * creates a middleware that resolves a number of actions before going on
 * @param {...Function} actions actions to be performed before next is called
 * @returns {resolveActions} action performer middleware
 */
export function performActionsMiddleware (...actions) {
  /**
   * resolves all passed actions
   * @param {Object} req express request
   * @param {Object} res express response
   * @param {Function} next next handler
   * @returns {Promise.<T>} promise that resolves once all actions have been performed
   */
  function resolveActions (req, res, next) {
    let promise = Promise.resolve()

    actions.forEach(action => {
      promise = promise.then(() => action(req, res))
    })

    return promise.then(() => next(), err => {
      processRequestError(err, req, res)
      next()
    })
  }

  return resolveActions
}

export default performActionsMiddleware
