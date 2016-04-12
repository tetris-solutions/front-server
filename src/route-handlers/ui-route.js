import {serverRenderRoute} from '../functions/server-render-route'

export function uiRoute (req, res) {
  return serverRenderRoute(req, res)
}
