import keys from 'lodash/keys'

export function syncMessages (messageFile) {
  function getMessages () {
    delete require.cache[messageFile]
    return require(messageFile)
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
