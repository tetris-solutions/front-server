import {GET} from '@tetris/http'

/**
 * load user from api
 * @param {string} token auth token
 * @returns {Promise} promise that resolves to a fetch response
 */
export function getUserByToken (token) {
  return GET(`${process.env.USER_API_URL}`, {
    headers: {Authorization: `Bearer ${token}`}
  })
}

export default getUserByToken
