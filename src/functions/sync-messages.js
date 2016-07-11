import {execFileSync} from 'child_process'
import path from 'path'
import keys from 'lodash/keys'

const reader = path.resolve(__dirname, '..', 'print-messages-file.js')

export function syncMessages (messageFile) {
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
        return getMessages()[lang]
      }
    })
  })

  return dynamicMessagesObject
}
