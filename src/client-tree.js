import Tree from 'baobab'
import merge from 'lodash/merge'
import window from 'global/window'
import Cookies from 'js-cookie'

export function createClientTree (defaultState) {
  const tree = new Tree(merge(defaultState, window.backendPayload))

  tree.select('locale').on('update', ({data: {currentData}}) => {
    Cookies.set(process.env.LOCALE_COOKIE_NAME, currentData, {
      domain: process.env.TOKEN_COOKIE_DOMAIN,
      expires: 1
    })
  })

  return tree
}
