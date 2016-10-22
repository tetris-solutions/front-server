import React from 'react'

export default {
  contextTypes: {
    insertCss: React.PropTypes.func
  },
  componentWillMount () {
    this.context.insertCss(this.style)
  }
}
