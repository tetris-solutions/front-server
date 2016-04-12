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
    actions: PropTypes.shape({
      changeLocale: PropTypes.func
    })
  },
  getDefaultProps () {
    return {
      className: 'form-control'
    }
  },
  onChangeLocale ({target: {value}}) {
    this.props.actions.changeLocale(value)
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

export default branch(LocaleSelector, {
  cursors: {
    userLocale: ['user', 'locale'],
    locale: ['locale']
  },
  actions: {
    changeLocale: changeLocaleAction
  }
})
