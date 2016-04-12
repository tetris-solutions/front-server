import React from 'react'
import omit from 'lodash/omit'
import trim from 'lodash/trim'
const {PropTypes} = React

export default React.createClass({
  displayName: 'Message',
  contextTypes: {
    locales: PropTypes.string,
    messages: PropTypes.object
  },
  propTypes: {
    children: PropTypes.string.isRequired,
    html: PropTypes.bool
  },
  render () {
    const messageName = trim(this.props.children)

    if (!messageName) return '[ ___ ]'

    const {FormattedMessage, FormattedHTMLMessage} = ReactIntl
    const Component = this.props.html
      ? FormattedHTMLMessage
      : FormattedMessage
    const props = omit(this.props, 'children', 'html')
    const intl = this.context

    return (
      <Component {...props}
        message={intl.messages[messageName] || `[ ${messageName} ]`}
        locales={intl.locales}
        messages={intl.messages}/>
    )
  }
})
