import React from 'react'
import {Router, IndexRoute, Route} from 'react-router'
import Login from './../components/Login'
import Activation from './../components/Activation'
import Home from './../components/Home'
import Root from './../components/Root'
import ErrorScreen from '../components/ErrorScreen'
import Signup from './../components/Signup'
import WaitingConfirmation from './../components/WaitingConfirmation'
import {root} from 'baobab-react/higher-order'
import {requireAuth} from './../functions/require-auth'
import {performLoadAction} from './../functions/perform-load-action'
import {dashboardRoutes} from './ui-dashboard'

const isServer = typeof window === 'undefined'

export default (history, tree) => {
  const protectRoute = isServer ? undefined : requireAuth(tree)
  let firstRender = true

  if (!isServer) {
    setTimeout(() => {
      firstRender = false
    }, 0)
  }

  function preload (action) {
    if (isServer) return

    const hook = performLoadAction(tree, action)

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
      <Route path='/' component={root(Root, tree)}>
        <IndexRoute component={Home}/>
        <Route path='login' component={Login}/>
        <Route path='signup' component={Signup}/>
        <Route path='waiting-confirmation' component={WaitingConfirmation}/>
        <Route path='activate/:activationCode' component={Activation}/>
        <Route path='error' component={ErrorScreen}/>
        <Route onEnter={protectRoute}>
          {dashboardRoutes(preload)}
        </Route>
      </Route>
    </Router>
  )
}
