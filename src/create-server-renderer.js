import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {setupRoutes} from './setup-routes'
import {createMemoryHistory} from 'react-router'
import includes from 'lodash/includes'
import getCss from 'csjs/get-css'
import Helmet from 'react-helmet'

global.React = React
// global.ReactIntl = require('react-intl/lib/react-intl')
// require('react-intl/lib/locales')

export function createServerRenderer (HTML, getRoutes, messages) {
  /**
   * reads from `res.locals` and `req` to generate the React component tree which is then sent to the client as HTML
   * @param {Object} req express request
   * @param {Object} res express response
   * @returns {undefined}
   */
  function serverRenderRoute (req, res) {
    const location = req.url
    const {tree} = res.locals

    tree.set('locale', req.locale)
    tree.set('intl', {
      locales: req.locale,
      messages: messages[req.locale] || messages.en
    })
    tree.commit()

    const styles = []

    function insertCss (style) {
      if (!includes(styles, style)) {
        styles.push(style)
      }
    }

    const history = createMemoryHistory(location)
    const app = setupRoutes(getRoutes, history, tree, insertCss)
    const appMarkup = process.env.DEV_SERVER
      ? ReactDOMServer.renderToStaticMarkup(app)
      : ReactDOMServer.renderToString(app)

    const css = styles.map(style => getCss(style)).join('\n')
    const helmet = Helmet.renderStatic()

    const markup = ReactDOMServer.renderToStaticMarkup(
      <HTML state={tree.get()} css={css} helmet={helmet}>
        {appMarkup}
      </HTML>
    )

    tree.release()

    res.send('<!DOCTYPE html>\n' + (
      process.env.DEV_SERVER
        ? require('js-beautify').html(markup)
        : markup
    ))
  }

  return serverRenderRoute
}
