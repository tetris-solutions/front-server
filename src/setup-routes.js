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

export function setupRoutes (getRoutes, history, tree, insertCss) {
  const protectRoute = isServer ? undefined : requireAuth(tree)
  const originalUrl = isServer ? null : window.location.href

  function preload (...actions) {
    if (isServer) return

    const onEnterHook = performLoadActions(tree, actions)

    function onEnter (nextState, replace, callback) {
      const currentUrl = window.location.origin +
        nextState.location.pathname +
        nextState.location.search

      // if this is the very first render,
      // we can rely on the data injected by the server
      if (originalUrl === currentUrl) {
        return callback()
      }

      onEnterHook(nextState, replace, callback)
    }

    return onEnter
  }

  // @todo `protectedRoute` should receive a second argument `permission` or maybe create a new function `checkPermission`

  const createRoot = require('./components/higher-order/root').root(insertCss)
  const routes = getRoutes(tree, protectRoute, preload, createRoot)

  return <Router routes={routes} history={history} onError={onError}/>
}
