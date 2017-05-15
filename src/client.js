import React from 'react'
import ReactDom from 'react-dom'
import {createClientTree} from './client-tree'
import {setupRoutes} from './setup-routes'
import {GET} from '@tetris/http'
import {match, browserHistory} from 'react-router'
import {loadScript} from './functions/load-script'
import window from 'global/window'
import moment from 'moment'
import getCss from 'csjs/get-css'
import includes from 'lodash/includes'
import {updateUserLocaleAction} from './actions/update-user-locale-action'

require('whatwg-fetch')

window.React = React
window.moment = moment

if (process.env.NODE_ENV !== 'production') {
  window.whyTho = () => require('why-did-you-update').whyDidYouUpdate(React)
}

const styles = []
let $style

function insertCss (style) {
  if (!includes(styles, style)) {
    styles.push(style)

    if (!$style) {
      $style = window.document.getElementById('style-injection')
      $style.innerHTML = ''
    }

    $style.innerHTML += '\n' + getCss(style)
  }
}

export function createClient (getRoutes, defaultState) {
  const tree = window.$tate = createClientTree(defaultState)
  const loadedLocales = {
    [tree.get('locale')]: tree.get('intl')
  }

  function render () {
    const {pathname, search} = window.location
    const location = `${pathname}${search}`
    const router = setupRoutes(getRoutes, browserHistory, tree, insertCss)
    const {routes} = router.props

    match({routes, location}, () =>
      ReactDom.render(router,
        window.document.getElementById('app')))
  }

  function loadIntl (locale) {
    if (loadedLocales[locale]) {
      return Promise.resolve(loadedLocales[locale])
    }

    return GET(`/intl/${locale}`)
      .then(({data}) => data)
  }

  /**
   * loads a given locale and save it in application the state tree
   * @param {string} locale the locale to laod
   * @returns {Promise} return a promise that will be resolved once all resources are loaded
   */
  const loadLocale = locale =>
    Promise.all([loadScript(`/js/intl/${locale}.js`), loadIntl(locale)])
      .then(([_, intl]) => {
        loadedLocales[locale] = intl
        tree.set('intl', intl)
        tree.commit()
      })

  function changeLocale (locale) {
    loadLocale(locale)

    if (tree.get('user')) {
      tree.set(['user', 'locale'], locale)
      tree.commit()

      updateUserLocaleAction(tree, locale)
    }
  }

  const localeCursor = tree.select('locale')

  localeCursor.on('update', ({data: {currentData}}) => {
    if (currentData) {
      changeLocale(currentData)
    }
  })

  render()

  return tree
}
