import {
  createServer, 
  createServerRenderer,
  protectedRouteMiddleware
} from '@tetris/front-server'

import messages from '../messages'

createServer({
  messages,
  setAppRoutes (app) {
    const serverRenderer = createServerRenderer(
      require('./components/HTML'),
      function (protectRoute, preload) {
        return (
          
        )
      },
      messages
    )

    app.get('/dashboard/etc', protectedRouteMiddleware, serverRenderer)
  }
})

