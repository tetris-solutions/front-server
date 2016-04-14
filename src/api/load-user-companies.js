import {GET} from '@tetris/http'

/**
 * loads list of companies users is associated to
 * @param {Object} config fetch config
 * @param {String} [app] filter permissions from this app
 * @returns {Promise.<Array>} promise that resolves to a list of companies
 */
export function loadUserCompanies (config, app = null) {
  let url = `${process.env.USER_API_URL}/user/companies`

  if (app) url += `/${app}`

  return GET(url, config)
}

export default loadUserCompanies
