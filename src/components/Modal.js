import assign from 'lodash/assign'
import csjs from 'csjs'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import pick from 'lodash/pick'
import upperCase from 'lodash/toUpper'
import React from 'react'
import PropTypes from 'prop-types'
import createReactClass from 'create-react-class'
import {render, unmountComponentAtNode} from 'react-dom'
import concat from 'lodash/concat'
import StyledMixin from './mixins/styled'
import {required as baseContext} from '../../base-context'

const notInput = el => !el || (upperCase(el.tagName) !== 'INPUT' && upperCase(el.tagName) !== 'TEXTAREA')

export const style = csjs`
.full {
  width: 100%;
  height: 100%;
}
.modal extends .full {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 6;
  background: rgba(0, 0, 0, 0.5);
}
.relativeLayer extends .full {
  position: relative;
  display: flex;
  vertical-align: middle
}
.content {
  position: relative;
  background: white;
  padding: .5em;

  height: auto;
  max-height: 98%;

  margin: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
.small {
  width: 420px
}
.medium {
  width: 750px
}
.large {
  width: 1024px
}
.huge {
  width: 94%;
}`

const sizeType = PropTypes.oneOf(['small', 'medium', 'large', 'huge'])
const escPressCallbackRegister = {}

function unmountNext (event, callback) {
  const id = String(event.timeStamp)

  clearTimeout(escPressCallbackRegister[id])
  escPressCallbackRegister[id] = setTimeout(callback, 100)
}

function createPortal (contextAttributes) {
  if (typeof window === 'undefined') return () => null

  let modalClassCfg, contextTypes

  if (!isEmpty(contextAttributes)) {
    contextTypes = {}

    forEach(contextAttributes, function addToContext (key) {
      contextTypes[key] = PropTypes.any
    })

    modalClassCfg = {
      displayName: 'Modal',
      childContextTypes: contextTypes,
      getChildContext () {
        return pick(this.props, contextAttributes)
      }
    }
  }

  const Modal = createReactClass(assign({
    displayName: 'Modal',
    getDefaultProps () {
      return {
        size: 'medium'
      }
    },
    propTypes: {
      size: sizeType,
      minHeight: PropTypes.number.isRequired,
      children: PropTypes.node.isRequired,
      onBackgroundClick: PropTypes.func
    },
    onClick (e) {
      const isBackgroundClick = e.target === e.currentTarget

      if (isBackgroundClick && this.props.onBackgroundClick) {
        this.props.onBackgroundClick()
      }
    },
    render () {
      const {children, size, minHeight} = this.props

      return (
        <div className={`${style.relativeLayer}`} onClick={this.onClick}>
          <div className={`${style.content} ${style[size]}`} style={{minHeight}}>
            {children}
          </div>
        </div>
      )
    }
  }, modalClassCfg))

  const previousOverflow = document.body.style.overflow
  const wrapper = document.createElement('div')

  document.body.style.overflow = 'hidden'

  // @todo remove dependency from animated
  wrapper.className = `${style.modal} animated fadeIn`

  document.body.appendChild(wrapper)

  return class extends React.Component {
    static displayName = 'Portal'
    static contextTypes = contextTypes

    static propTypes = {
      size: sizeType,
      minHeight: PropTypes.number.isRequired,
      onEscPress: PropTypes.func,
      children: PropTypes.node.isRequired
    }

    componentDidMount () {
      this.renderModal()

      if (this.props.onEscPress) {
        document.addEventListener('keyup', this.grepEsc)
      }
    }

    componentDidUpdate () {
      this.renderModal()
    }

    componentWillUnmount () {
      document.body.style.overflow = previousOverflow
      unmountComponentAtNode(wrapper)
      document.body.removeChild(wrapper)
      document.removeEventListener('keyup', this.grepEsc)
    }

    grepEsc = (event) => {
      if (notInput(event.target) && event.which === 27) {
        unmountNext(event, this.props.onEscPress)
      }
    }

    renderModal = () => {
      const {children, size, onEscPress, minHeight} = this.props

      render((
        <Modal {...this.context} size={size} onBackgroundClick={onEscPress} minHeight={minHeight}>
          {children}
        </Modal>
      ), wrapper)
    }

    render () {
      return null
    }
  }
}

const ModalSpawner = createReactClass({
  displayName: 'Modal-Spawner',
  mixins: [StyledMixin],
  style,
  propTypes: {
    size: sizeType,
    minHeight: PropTypes.number,
    onEscPress: PropTypes.func,
    children: PropTypes.node.isRequired,
    provide: PropTypes.array
  },
  getDefaultProps () {
    return {
      provide: [],
      minHeight: 300
    }
  },
  componentWillMount () {
    this.Portal = createPortal(concat(baseContext, this.props.provide))
  },
  render () {
    const {Portal} = this
    const {onEscPress, children, size, minHeight} = this.props

    return (
      <Portal size={size} onEscPress={onEscPress} minHeight={minHeight}>
        {children}
      </Portal>
    )
  }
})

export default ModalSpawner
