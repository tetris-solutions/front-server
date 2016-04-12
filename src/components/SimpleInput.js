import React from 'react'
import pick from 'lodash/pick'
import cx from 'classnames'
import Message from './intl/Message'

const {PropTypes} = React
const inputFields = [
  'name',
  'type',
  'onChange',
  'required',
  'defaultValue',
  'placeholder',
  'value'
]

export const SimpleInput = React.createClass({
  displayName: 'SimpleInput',
  getDefaultProps () {
    return {
      type: 'text'
    }
  },
  propTypes: {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func
  },
  render () {
    const {error, label} = this.props
    return (
      <div className={cx('form-group', error && 'has-error')}>
        {label && (
          <label className='control-label'>
            <Message>{label + 'Label'}</Message>
          </label>
        )}
        <input className='form-control' {...pick(this.props, inputFields)}/>
        {error && (<p className='help-block'>{error}</p>)}
      </div>
    )
  }
})

export default SimpleInput
