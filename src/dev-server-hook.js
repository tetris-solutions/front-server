import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHot from 'webpack-hot-middleware'

export function devServerHook (webpackConfig, app) {
  const compiler = webpack(webpackConfig)

  app.use(webpackMiddleware(compiler, {
    publicPath: '/js/',
    headers: {'X-Webpack-Wizardry': 'true'}
  }))

  app.use(webpackHot(compiler))
}
