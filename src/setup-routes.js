import React from 'react'
import {Router} from 'react-router'
import {requireAuth} from './functions/require-auth'
import {performLoadActions} from './functions/perform-load-actions'

const isServer = typeof window === 'undefined'

function onError (err) {
  /* eslint-disable no-console */
  console.error(err)
  /* eslint-enable no-console */
}

const currentUrl = () => isServer ? null : window.location.href

export function setupRoutes (getRoutes, history, tree, insertCss) {
  const protectRoute = isServer ? undefined : requireAuth(tree)
  const originalUrl = currentUrl()

  function preload (...actions) {
    if (isServer) return

    const hook = performLoadActions(tree, actions)

    function onEnter (nextState, replace, callback) {
      // if this is the very first render, we can rely on the data injected by the server
      if (originalUrl === currentUrl()) {
        return callback()
      }

      hook(nextState, replace, callback)
    }

    return onEnter
  }

  // @todo `protectedRoute` should receive a second argument `permission` or maybe create a new function `checkPermission`

  const createRoot = require('./components/higher-order/root').root(insertCss)
  const routes = getRoutes(tree, protectRoute, preload, createRoot)

  return <Router routes={routes} history={history} onError={onError}/>
}
