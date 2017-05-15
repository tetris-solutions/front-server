import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import trim from 'lodash/trim'
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl'

export default class extends React.Component {
  static displayName = 'Message'

  static contextTypes = {
    locales: PropTypes.string,
    messages: PropTypes.object
  }

  static propTypes = {
    tag: PropTypes.string,
    children: PropTypes.string.isRequired,
    html: PropTypes.bool
  }

  static defaultProps = {
    tag: 'span'
  }

  render () {
    const messageName = trim(this.props.children)

    if (!messageName) return '[ ___ ]'

    const Component = this.props.html
      ? FormattedHTMLMessage
      : FormattedMessage

    return (
      <Component
        id={messageName}
        values={omit(this.props, 'children', 'html', 'tag')}
        tagName={this.props.tag}
        {...pick(this.props, 'className', 'style')}/>
    )
  }
}
