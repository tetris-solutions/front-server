import express from 'express'
import fetch from 'node-fetch'
import cookieParser from 'cookie-parser'
import globalMessages from './messages'
import {initializeTreeMiddleware} from './middlewares/initialize-tree'
import createLocaleMiddleware from '@tetris/locale-middleware'
import {authMiddleware} from './middlewares/auth'
import debugMiddleware from '@tetris/debug-middleware'
import morgan from 'morgan'
import assign from 'lodash/assign'
import {createServerRenderer} from './create-server-renderer'
import {syncMessages} from './functions/sync-messages'
import merge from 'lodash/merge'

global.fetch = fetch

const app = express()

export function createServer ({
  httpLogStream,
  getRoutes,
  HTML,
  defaultState,
  publicPath,
  getWebpackConfig,
  messages,
  messagesFile,
  setAppRoutes,
  port
}) {
  app.use(express.static(publicPath))

  const morganMode = process.env.NODE_ENV === 'production'
    ? 'combined'
    : 'short'

  app.use(morgan(morganMode, {stream: httpLogStream}))

  if (process.env.DEV_SERVER) {
    const {devServerHook} = require('./dev-server-hook')

    devServerHook(getWebpackConfig(), app)
  }

  app.use(cookieParser())
  app.use(debugMiddleware)

  if (messagesFile) {
    messages = process.env.DEV_SERVER
      ? syncMessages(messagesFile, globalMessages)
      : merge({}, globalMessages, require(messagesFile))
  }

  app.use(createLocaleMiddleware(messages))
  app.use(initializeTreeMiddleware(defaultState))
  app.use(authMiddleware)

  app.get('/intl/:locale', ({params: {locale}}, res) => {
    if (!messages[locale] || !globalMessages[locale]) {
      return res.status(404)
        .send({message: 'Locale not avaible'})
    }

    res.json({
      locales: locale,
      messages: assign({}, globalMessages[locale], messages[locale])
    })
  })

  setAppRoutes(app, createServerRenderer(HTML, getRoutes, messages))

  app.use(function errorHandler (_err, req, res, next) {
    // @todo logging
    let body = `<h1>${_err.message}</h1>`
    if (req.debugMode) {
      body += `<pre><code>${_err.stack}</code></pre>`
    }
    res.status(500).send(body)
  })

  app.listen(port)

  return app
}
