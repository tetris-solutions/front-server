import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {setupRoutes} from './setup-routes'
import {createMemoryHistory} from 'react-router'
import beautify from 'js-beautify'

global.React = React
global.ReactIntl = require('react-intl/lib/react-intl')
require('react-intl/lib/locales')

export function createServerRenderer (HTML, getRoutes, messages) {
  /**
   * reads from `res.locals` and `req` to generate the React component tree which is then sent to the client as HTML
   * @param {Object} req express request
   * @param {Object} res express response
   * @returns {undefined}
   */
  function serverRenderRoute (req, res) {
    const location = req.url

    const useBeautify = process.env.BEAUTIFY_HTML === 'true'
    const {tree} = res.locals

    tree.set('locale', req.locale)
    tree.set('intl', {
      locales: req.locale,
      messages: messages[req.locale]
    })
    tree.commit()

    const history = createMemoryHistory(location)
    const app = setupRoutes(getRoutes, history, tree)
    const appMarkup = useBeautify
      ? ReactDOMServer.renderToStaticMarkup(app)
      : ReactDOMServer.renderToString(app)

    const markup = ReactDOMServer.renderToStaticMarkup(
      <HTML payload={tree.get()}>
      {appMarkup}
      </HTML>
    )

    tree.release()

    res.send('<!DOCTYPE html>\n' + (
        useBeautify ? beautify.html(markup) : markup
      ))
  }

  return serverRenderRoute
}