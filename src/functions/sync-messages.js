import {execFileSync} from 'child_process'
import path from 'path'
import keys from 'lodash/keys'
import assign from 'lodash/assign'

const reader = path.resolve(__dirname, '..', 'print-messages-file.js')

export function syncMessages (messageFile, globalMessages) {
  function getMessages () {
    return JSON.parse(execFileSync(reader, [messageFile], {
      encoding: 'utf8'
    }))
  }

  const dynamicMessagesObject = {}
  const langs = keys(require(messageFile))

  langs.forEach(lang => {
    Object.defineProperty(dynamicMessagesObject, lang, {
      get () {
        return assign({}, getMessages()[lang], globalMessages[lang])
      }
    })
  })

  return dynamicMessagesObject
}
