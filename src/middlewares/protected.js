/**
 * redirects to login in if no user is logged in
 * @param {Object} req express request
 * @param {Object} res express response
 * @param {Function} next next handler
 * @returns {undefined}
 */
export function protectedRouteMiddleware (req, res, next) {
  if (!req.user && !res.locals.tree.get('error')) {
    const next = req.hostname === process.env.FRONT_HOST
      ? req.url
      : `${req.protocol}://${req.hostname}${req.url}`

    res.redirect(`${process.env.FRONT_URL}/login?next=${next}`)
  } else {
    next()
  }
}

export default protectedRouteMiddleware
