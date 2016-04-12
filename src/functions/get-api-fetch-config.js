import Cookies from 'js-cookie'

/**
 * loads auth token and user locale into fetch request configuration
 * @param {Baobab} tree the application state tree
 * @param {String} [token] express request
 * @todo make default locale dynamic
 * @returns {Object} fetch request configuration
 */
export function getApiFetchConfig (tree, token) {
  const config = {headers: {}}

  if (!token) {
    try {
      token = Cookies.get(process.env.TOKEN_COOKIE_NAME)
    } catch (e) {
      // ~
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const user = tree.get('user')
  const locale = tree.get('locale')
  const userLocale = user ? user.locale : null

  config.headers['Accept-Language'] = locale || userLocale || 'en'

  return config
}

export default getApiFetchConfig
