import assign from 'lodash/assign'
import csjs from 'csjs'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import pick from 'lodash/pick'
import upperCase from 'lodash/toUpper'
import React from 'react'
import createReactClass from 'create-react-class'
import {render, unmountComponentAtNode} from 'react-dom'
import concat from 'lodash/concat'
import StyledMixin from './mixins/styled'
import {required as baseContext} from '../../base-context'
const notInput = el => !el || (upperCase(el.tagName) !== 'INPUT' && upperCase(el.tagName) !== 'TEXTAREA')

const {PropTypes} = React
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
  min-height: 300px;
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
      return (
        <div className={`${style.relativeLayer}`} onClick={this.onClick}>
          <div className={`${style.content} ${style[this.props.size]}`}>
            {this.props.children}
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
        this.props.onEscPress()
      }
    }

    renderModal = () => {
      render((
        <Modal {...this.context} size={this.props.size} onBackgroundClick={this.props.onEscPress}>
          {this.props.children}
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
    onEscPress: PropTypes.func,
    children: PropTypes.node.isRequired,
    provide: PropTypes.array
  },
  getDefaultProps () {
    return {
      provide: []
    }
  },
  componentWillMount () {
    this.Portal = createPortal(concat(baseContext, this.props.provide))
  },
  render () {
    const {Portal} = this
    const {onEscPress, children, size} = this.props

    return (
      <Portal size={size} onEscPress={onEscPress}>
        {children}
      </Portal>
    )
  }
})

export default ModalSpawner
