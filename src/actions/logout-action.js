import Cookie from 'js-cookie'
import window from 'global/window'

/**
 * logout the user by removing the user object from the state tree and removing the token from cookies
 * @param {Baobab} tree state tree
 * @returns {undefined}
 */
export function logoutAction (tree) {
  try {
    Cookie.remove(process.env.TOKEN_COOKIE_NAME, {
      domain: process.env.TOKEN_COOKIE_DOMAIN
    })
    window.localStorage.clear()
  } catch (e) {
    // ~~
  }
  tree.set('user', null)
  tree.commit()
}

export default logoutAction
