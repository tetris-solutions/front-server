import React from 'react'
import Message from './intl/Message'

export const Forbidden = React.createClass({
  displayName: 'Forbidden',
  render () {
    return (
      <div className='container'>
        <div className='alert alert-warning'>
          <h1 className='page-header'>
            <Message>accessForbiddenTitle</Message>
          </h1>
          <p>
            <Message>accessForbiddenDescription</Message>
          </p>
        </div>
      </div>
    )
  }
})

export default Forbidden
