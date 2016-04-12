import {getErrorFromResponse} from './get-error-from-response'

export function processRequestError (response, req, res) {
  const err = getErrorFromResponse(response)
  res.locals.tree.set('error', err)
  res.locals.tree.commit()
  res.status(500)
}
