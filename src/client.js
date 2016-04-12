import React from 'react'
import ReactDom from 'react-dom'
import tree from './client-tree'
import getRoutes from './routes/ui'
import {GET} from '@tetris/http'
import {browserHistory} from 'react-router'
import loadScript from './functions/load-script'
import window from 'global/window'
import moment from 'moment'

require('whatwg-fetch')

window.React = React
window.moment = moment

const loadedLocales = {
  [tree.get('locale')]: tree.get('intl')
}

loadScript('/js/react-intl.min.js')
  .then(() => {
    let hasRendered = false

    const render = () => {
      ReactDom.render(getRoutes(browserHistory, tree), window.document.getElementById('app'))
      hasRendered = true
    }

    function loadIntl (locale) {
      if (loadedLocales[locale]) {
        return Promise.resolve(loadedLocales[locale])
      }

      return GET(`/intl/${locale}`).then(({data}) => data)
    }

    /**
     * loads a given locale and save it in application the state tree
     * @global
     * @param {string} locale the locale to laod
     * @returns {Promise} return a promise that will be resolved once all resources are loaded
     */
    function tetrisLoadLocale (locale) {
      const src = '/js/' + locale.split('-')[0] + '.js'

      return Promise.all([loadScript(src), loadIntl(locale)])
        .then(args => {
          const intl = args.pop()

          loadedLocales[locale] = intl
          tree.set('intl', intl)
          tree.commit()

          if (!hasRendered) render()
        })
    }

    window.tetrisLoadLocale = tetrisLoadLocale

    tetrisLoadLocale(tree.get('locale'))
  })
