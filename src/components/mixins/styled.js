import PropTypes from 'prop-types'

export default {
  contextTypes: {
    insertCss: PropTypes.func
  },
  componentWillMount () {
    this.context.insertCss(this.style)
  }
}
