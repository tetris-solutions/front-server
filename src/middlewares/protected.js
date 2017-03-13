/**
 * redirects to login in if no user is logged in
 * @param {Object} req express request
 * @param {Object} res express response
 * @param {Function} next next handler
 * @param {String} [redirectTo=null] url for redirection in case of non authenticated user
 * @returns {undefined}
 */
export function protectedRouteMiddleware (req, res, next, redirectTo = null) {
  if (req.user || res.locals.tree.get('error')) {
    return next()
  }

  if (!redirectTo) {
    const afterLoginUrl = req.hostname === process.env.FRONT_HOST
      ? req.url
      : `${req.protocol}://${req.hostname}${req.url}`

    redirectTo = `${process.env.FRONT_URL}/login?next=${encodeURIComponent(afterLoginUrl)}`
  }

  res.redirect(redirectTo)
}
