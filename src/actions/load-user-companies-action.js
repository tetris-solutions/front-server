import {loadUserCompanies} from '../api/load-user-companies'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

/**
 * loads a list of user companies and saving it into the passed tree as `tree.user.companies`
 * @param {Baobab} tree state tree
 * @param {String} [token] auth token
 * @returns {Promise} promise that resolves once action is complete
 */
export function loadUserCompaniesAction (tree, token) {
  return loadUserCompanies(getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      tree.set(['user', 'companies'], response.data)
      tree.commit()
    })
    .catch(pushResponseErrorToState(tree))
}

/**
 * adaptor to call `loadUserCompaniesAction` on the server side
 * @param {Object} req express request
 * @param {Object} res express response
 * @returns {Promise} action promise
 */
export function loadUserCompaniesActionServerAdaptor (req, res) {
  return loadUserCompaniesAction(res.locals.tree, req.authToken)
}

/**
 * adaptor to call `loadUserCompaniesAction` as an `onEnter` hook
 * @param {Object} state history state
 * @param {Baobab} tree state tree
 * @returns {Promise} promise action
 */
export function loadUserCompaniesActionRouterAdaptor (state, tree) {
  return loadUserCompaniesAction(tree)
}

export default loadUserCompaniesAction
