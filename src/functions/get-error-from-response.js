import pick from 'lodash/pick'
import assign from 'lodash/assign'
import get from 'lodash/get'

const serialize = o => pick(o, 'message', 'stack', 'status')

export function getErrorFromResponse (response) {
  const defaultError = new Error('Sorry, we could not reach the API.')
  return assign(
    serialize(defaultError),
    serialize(response),
    serialize(get(response, 'data'))
  )
}
