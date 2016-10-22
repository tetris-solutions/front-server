var required = ['tree', 'messages', 'locales', 'insertCss', 'params', 'moment']

function extend () {
  for (var i = 0; i < arguments.length; i++) {
    required.push(arguments[i])
  }
}

exports.required = required
exports.extend = extend
