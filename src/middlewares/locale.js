export function createLocaleMiddleware (messages, defaultLocale = 'pt-BR') {
  /**
   * reads locale headers and save it to `req.locale`
   * @todo possibly read DEFAULT_LOCALE from domain country
   * @param {Object} req express request
   * @param {Object} res express response
   * @param {Function} next next handler
   * @returns {undefined}
   */
  function localeMiddleware (req, res, next) {
    const cookieLocale = req.cookies[process.env.LOCALE_COOKIE_NAME]
    const headerLocale = req.acceptsLanguages(Object.keys(messages))
    const userLocale = req.user ? req.user.locale : null
    req.locale = cookieLocale || headerLocale || userLocale || defaultLocale
    next()
  }

  return localeMiddleware
}
