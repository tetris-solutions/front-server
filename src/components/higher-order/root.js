import React from 'react'
import PropTypes from 'prop-types'
import {branch} from 'baobab-react/higher-order'
import _moment from 'moment'
import window from 'global/window'
import get from 'lodash/get'
import omit from 'lodash/omit'
import assign from 'lodash/assign'
import {IntlProvider} from 'react-intl'
import Alert from 'react-s-alert'

const isServer = typeof window === 'undefined'

function pushErrorMessage (tree, message) {
  return Promise.resolve().then(() => tree.push('alerts', {message}))
}

const momentFor = {}

function createScopedMoment (locale) {
  function moment (...args) {
    const m = _moment(...args)
    m.locale(locale)
    return m
  }

  moment.utc = (...args) => {
    const m = _moment.utc(...args)
    m.locale(locale)
    return m
  }

  momentFor[locale] = moment
}

function buildMoment (locale) {
  if (!momentFor[locale]) {
    createScopedMoment(locale)
  }

  return momentFor[locale]
}

const DefaultErrorScreen = ({error}) => (
  <section>
    <h3>{error.message}</h3>
    <hr/>
    <pre>{JSON.stringify(assign({
      message: error.message,
      stack: error.stack,
      code: error.code
    }, error), null, 2)}</pre>
  </section>
)
DefaultErrorScreen.propTypes = {
  error: PropTypes.object.isRequired
}

/**
 *
 * @param {Function} insertCss function for inserting a new stylesheet
 * @return {Function} createRoot createRoot hook
 */
export function root (insertCss) {
  return function createRoot (Header = null, ErrorScreen = DefaultErrorScreen) {
    class Root extends React.Component {
      static displayName = 'Root'

      static propTypes = {
        children: PropTypes.node,
        alerts: PropTypes.array,
        error: PropTypes.object,
        intl: PropTypes.shape({
          locales: PropTypes.string,
          messages: PropTypes.object
        }),
        dispatch: PropTypes.func,
        location: PropTypes.object,
        params: PropTypes.object,
        routes: PropTypes.array
      }

      static contextTypes = {
        router: PropTypes.object
      }

      static childContextTypes = {
        insertCss: PropTypes.func,
        locales: PropTypes.string,
        messages: PropTypes.object,
        location: PropTypes.object,
        params: PropTypes.object,
        moment: PropTypes.func,
        routes: PropTypes.array
      }

      getChildContext () {
        const {routes, location, params, intl: {locales, messages}} = this.props

        return {
          insertCss,
          locales,
          messages,
          location,
          params,
          routes,
          moment: buildMoment(locales)
        }
      }

      addAlerts = () => {
        if (isServer) return
        let i
        const {alerts} = this.props
        for (i = this.alertTailIndex; i < alerts.length; i++) {
          const {message, level = 'error'} = alerts[i]
          const createAlert = Alert[level] || Alert.info

          createAlert(message, {
            position: 'top-right',
            effect: level === 'error' || level === 'warning'
              ? 'slide'
              : 'flip',
            timeOut: 5 * 1000
          })
        }
        this.alertTailIndex = i
      }

      componentDidMount () {
        this.alertTailIndex = 0
        this.addAlerts()
        const redirectError = get(this, 'props.location.query.error')

        if (!redirectError) return

        const {query, pathname} = this.props.location

        const location = {
          query: omit(query, 'error'),
          pathname: pathname
        }

        this.props.dispatch(pushErrorMessage, window.atob(redirectError))
          .then(() => this.context.router.push(location))
      }

      componentDidUpdate () {
        this.addAlerts()
      }

      render () {
        const {children, error, intl} = this.props

        return (
          <IntlProvider locale={intl.locales} messages={intl.messages}>
            <div>

              {Header ? <Header /> : null}
              {error ? <ErrorScreen error={error}/> : children}

              {!isServer && <Alert stack={{limit: 5}}/>}
            </div>
          </IntlProvider>
        )
      }
    }

    return branch({
      intl: ['intl'],
      alerts: ['alerts'],
      error: ['error']
    }, Root)
  }
}
