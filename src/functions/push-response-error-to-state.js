import {getErrorFromResponse} from './get-error-from-response'
import pick from 'lodash/pick'

/**
 * creates a `Promise.catch` handler that pushes the response error to the state
 * @param {Baobab} tree state tree
 * @returns {Function} catch handler
 */
export function pushResponseErrorToState (tree) {
  /**
   * pushes the error contained in the response to the state tree
   * @throws {Response}
   * @param {Response} response fetch Response
   * @returns {undefined}
   */
  function catchError (response) {
    const err = getErrorFromResponse(response)

    tree.push('alerts', pick(err, 'message', 'stack'))

    throw response || err
  }

  return catchError
}

export default pushResponseErrorToState
