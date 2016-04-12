import React from 'react'
import Message from './intl/Message'
import window from 'global/window'

const {PropTypes} = React

export default React.createClass({
  contextTypes: {
    submitInProgress: PropTypes.bool.isRequired
  },
  propTypes: {
    labelMessage: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string,
    style: PropTypes.string,
    onClick: PropTypes.func
  },
  getDefaultProps () {
    return {
      style: 'expand-right',
      color: 'mint',
      size: 's',
      labelMessage: 'callToActionSubmit'
    }
  },
  componentDidMount () {
    if ('Ladda' in window) {
      this.ladda = window.Ladda.create(this.refs.btn)
    }
  },
  componentWillReceiveProps (nextProps, {submitInProgress}) {
    if (submitInProgress === this.context.submitInProgress) return

    if (this.ladda) {
      if (submitInProgress) {
        this.ladda.start()
      } else {
        this.ladda.stop()
      }
    }
  },
  render () {
    const {
      color,
      size,
      style,
      labelMessage,
      onClick
    } = this.props
    const type = onClick ? undefined : 'submit'

    return (
      <button
        type={type}
        name='submitButton'
        ref='btn'
        onClick={onClick}
        className='ladda-button'
        data-style={style}
        data-color={color}
        data-size={size}>

        <span className='ladda-label'>
          <Message>{labelMessage}</Message>
        </span>

      </button>
    )
  }
})
