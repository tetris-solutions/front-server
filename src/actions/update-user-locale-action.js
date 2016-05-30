import {updateUserLocale} from '../api/update-user-locale'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

/**
 * persists the change to the user locale
 * @param {Baobab} tree state tree
 * @param {String} locale new locale
 * @returns {Promise} promise that is resolved once action is complete
 */
export function updateUserLocaleAction (tree, locale) {
  return updateUserLocale(locale, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default updateUserLocaleAction
