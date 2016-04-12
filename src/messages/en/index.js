import assign from 'lodash/assign'
import nav from './nav'
import exceptions from './exceptions'
import callToAction from './callToAction'
import successMessages from './success'
import labels from './labels'
import headers from './headers'

export default assign({
  greetingMessage: 'Hello world!'
}, nav, exceptions, callToAction, successMessages, labels, headers)
