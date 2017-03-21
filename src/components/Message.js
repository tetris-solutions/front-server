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
    tag: React.PropTypes.string,
    children: PropTypes.string.isRequired,
    html: PropTypes.bool
  },
  getDefaultProps () {
    return {
      tag: 'span'
    }
  },
  render () {
    const messageName = trim(this.props.children)

    if (!messageName) return '[ ___ ]'

    const {FormattedMessage, FormattedHTMLMessage} = ReactIntl
    const Component = this.props.html
      ? FormattedHTMLMessage
      : FormattedMessage
    const props = omit(this.props, 'children', 'html', 'tag')
    const intl = this.context

    props.tagName = this.props.tag

    return (
      <Component
        {...props}
        message={intl.messages[messageName] || `[ ${messageName} ]`}
        locales={intl.locales}
        messages={intl.messages}/>
    )
  }
})
