import React from 'react'
import {Router} from 'react-router'
import {requireAuth} from './functions/require-auth'
import {performLoadActions} from './functions/perform-load-actions'

const isServer = typeof window === 'undefined'

export function setupRoutes (getRoutes, history, tree) {
  const protectRoute = isServer ? undefined : requireAuth(tree)
  let firstRender = true

  if (!isServer) {
    setTimeout(() => {
      firstRender = false
    }, 0)
  }

  function preload (...actions) {
    if (isServer) return

    const hook = performLoadActions(tree, actions)

    function onEnter (nextState, replace, callback) {
      // if this is the very first render, we can rely on the data injected by the server
      if (firstRender) return callback()

      hook(nextState, replace, callback)
    }

    return onEnter
  }

  // @todo `protectedRoute` should receive a second argument `permission` or maybe create a new function `checkPermission`

  return (
    <Router history={history}>
      {getRoutes(tree, protectRoute, preload)}
    </Router>
  )
}
