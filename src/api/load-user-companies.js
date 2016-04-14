import {GET} from '@tetris/http'

/**
 * loads list of companies users is associated to
 * @param {Object} config fetch config
 * @returns {Promise.<Array>} promise that resolves to a list of companies
 */
export function loadUserCompanies (config) {
  return GET(`${process.env.USER_API_URL}/user/companies`, config)
}

export default loadUserCompanies
