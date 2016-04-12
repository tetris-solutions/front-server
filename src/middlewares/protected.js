/**
 * redirects to login in if no user is logged in
 * @param {Object} req express request
 * @param {Object} res express response
 * @param {Function} next next handler
 * @returns {undefined}
 */
export function protectedRouteMiddleware (req, res, next) {
  if (!req.user && !res.locals.tree.get('error')) {
    res.redirect(`/login?next=${req.path}`)
  } else {
    next()
  }
}

export default protectedRouteMiddleware
