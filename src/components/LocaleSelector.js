import React from 'react'
import {changeLocaleAction} from '../actions/change-locale-action'
import {branch} from 'baobab-react/higher-order'
import window from 'global/window'

const {PropTypes} = React

export const LocaleSelector = React.createClass({
  displayName: 'Locale-Selector',
  propTypes: {
    className: PropTypes.string,
    userLocale: PropTypes.string,
    locale: PropTypes.string,
    dispatch: PropTypes.func
  },
  getDefaultProps () {
    return {
      className: 'form-control'
    }
  },
  onChangeLocale ({target: {value}}) {
    this.props.dispatch(changeLocaleAction, value)
    window.tetrisLoadLocale(value)
  },
  render () {
    return (
      <select
        ref='select'
        className={this.props.className}
        value={this.props.locale || this.props.userLocale}
        onChange={this.onChangeLocale}>

        <option value='en'>English</option>
        <option value='pt-BR'>Português</option>

      </select>
    )
  }
})

export default branch({
  userLocale: ['user', 'locale'],
  locale: ['locale']
}, LocaleSelector)
