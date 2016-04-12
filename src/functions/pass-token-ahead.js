const ONE_DAY = 1000 * 60 * 60 * 24

/**
 * reads auth token from server side fetch Response and forwards it to the client using express response api
 * @param {Object} req express request
 * @param {Object} res express response
 * @returns {Function} fetchCallback
 */
export function passTokenAhead (req, res) {
  const domain = process.env.TOKEN_COOKIE_DOMAIN
  const cookieName = process.env.TOKEN_COOKIE_NAME
  /**
   * reads token from fetch Response headers
   * @param {Response} fetchResponse fetch response object
   * @see {@link https://github.com/tetris-solutions/http/blob/master/index.js} for reference
   * @returns {Response} the same response object
   */
  return function fetchCallback (fetchResponse) {
    if (fetchResponse.token) { // token was refreshed
      res.set('Authorization', `Bearer ${fetchResponse.token}`)
      res.cookie(cookieName, fetchResponse.token, {
        domain,
        expires: new Date(Date.now() + ONE_DAY)
      })
    }
    return fetchResponse
  }
}

export default passTokenAhead
