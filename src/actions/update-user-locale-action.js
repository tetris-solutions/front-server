import {saveResponseTokenAsCookie} from '../functions/save-token-as-cookie'
import {getApiFetchConfig} from '../functions/get-api-fetch-config'
import {pushResponseErrorToState} from '../functions/push-response-error-to-state'
import {PUT} from '@tetris/http'
import assign from 'lodash/assign'

function updateUserLocale (locale, config) {
  return PUT(`${process.env.USER_API_URL}/user/locale`,
    assign({}, config, {body: {locale}}))
}

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
