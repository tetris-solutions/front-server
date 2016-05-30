import {PUT} from '@tetris/http'
import assign from 'lodash/assign'

export function updateUserLocale (locale, config) {
  return PUT(`${process.env.USER_API_URL}/user/locale`,
    assign({}, config, {body: {locale}}))
}
