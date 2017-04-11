import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import trim from 'lodash/trim'

export default class extends React.Component {
  static displayName = 'Message'

  static contextTypes = {
    locales: PropTypes.string,
    messages: PropTypes.object
  }

  static propTypes = {
    tag: React.PropTypes.string,
    children: PropTypes.string.isRequired,
    html: PropTypes.bool
  }

  static defaultProps = {
    tag: 'span'
  }

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
}
