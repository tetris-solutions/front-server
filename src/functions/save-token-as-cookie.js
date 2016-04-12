import Cookies from 'js-cookie'

/**
 * persist token as a cookie
 * @param {string} token auth token
 * @returns {undefined}
 */
export function saveTokenAsCookie (token) {
  try {
    Cookies.set(process.env.TOKEN_COOKIE_NAME, token, {
      domain: process.env.TOKEN_COOKIE_DOMAIN,
      expires: 1
    })
  } catch (e) {
    // ~ error handling ~
  }
}

/**
 * reads token from fetch Response and stores it as a cookie
 * @param {Response} response fetch Response for a api call
 * @todo error handling
 * @returns {Response} the same response
 */
export function saveResponseTokenAsCookie (response) {
  if (response.token) {
    saveTokenAsCookie(response.token)
  }
  return response
}

