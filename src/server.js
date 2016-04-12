import express from 'express'
import fetch from 'node-fetch'
import cookieParser from 'cookie-parser'

import {initializeTreeMiddleware} from './middlewares/initialize-tree'
import localeMiddleware from './middlewares/locale'
import authMiddleware from './middlewares/auth'
import {debugMiddleware} from '@tetris/debug-middleware'
import morgan from 'morgan'

global.fetch = fetch

const flags = {
  developmentMode: !process.env.BUILD_PROD,
  productionMode: process.env.NODE_ENV === 'production'
}

const app = express()

export function server ({
  httpLogStream,
  defaultState,
  publicPath,
  webpackConfig,
  messages,
  setAppRoutes,
  port
}) {
  app.use(express.static(publicPath))

  const morganMode = flags.productionMode === 'production'
    ? 'combined'
    : 'short'

  app.use(morgan(morganMode, {stream: httpLogStream}))

  if (flags.developmentMode) {
    const {devServerHook} = require('./dev-server-hook')

    devServerHook(webpackConfig, app)
  }

  app.use(cookieParser())
  app.use(debugMiddleware)
  app.use(localeMiddleware)
  app.use(initializeTreeMiddleware(defaultState))
  app.use(authMiddleware)

  app.get('/intl/:locale', ({params: {locale}}, res) => {
    if (!messages[locale]) return res.status(404).send({message: 'Locale not avaible'})

    res.json({
      locales: locale,
      messages: messages[locale]
    })
  })

  setAppRoutes(app)

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
