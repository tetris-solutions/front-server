import React from 'react'
import ReactDOM from 'react-dom'
import csjs from 'csjs'
import StyledMixin from './mixins/styled'
import isEmpty from 'lodash/isEmpty'
import forEach from 'lodash/forEach'
import pick from 'lodash/pick'
import assign from 'lodash/assign'
import concat from 'lodash/concat'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import {required as baseContext} from '../../base-context'

const px = n => `${n}px`
const {render, unmountComponentAtNode, findDOMNode} = ReactDOM
const style = csjs`
.hidden {
  display: none;
}
.tooltip {
  display: block;
  position: absolute;
  z-index: 9999;
  background: white;
  margin: 0;
  padding: 0;
  height: auto;
  width: auto;
  min-height: 30px;
  min-width: 30px;
  box-shadow:
    0 2px 2px 0 rgba(0,0,0,.14),
    0 3px 1px -2px rgba(0,0,0,.2),
    0 1px 5px 0 rgba(0,0,0,.12);
}`

const {PropTypes} = React

function createPortal (contextAttributes) {
  if (typeof window === 'undefined') return () => null

  let contextInjectorComponentConfig, contextTypes

  if (!isEmpty(contextAttributes)) {
    contextTypes = {}

    forEach(contextAttributes, function addToContext (key) {
      contextTypes[key] = PropTypes.any
    })

    contextInjectorComponentConfig = {
      displayName: 'Tooltip',
      childContextTypes: contextTypes,
      getChildContext () {
        return pick(this.props, contextAttributes)
      }
    }
  }

  const Dialog = React.createClass(assign({
    displayName: 'Modal',
    propTypes: {
      children: PropTypes.node.isRequired
    },
    render () {
      const {children, hide} = this.props

      if (isString(children)) {
        return <span>{children}</span>
      }

      if (isFunction(children)) {
        return children({hide})
      }

      return children
    }
  }, contextInjectorComponentConfig))

  return React.createClass({
    displayName: 'Portal',
    contextTypes,
    propTypes: {
      hover: PropTypes.bool,
      onMouseEnter: PropTypes.func,
      onMouseLeave: PropTypes.func,
      className: PropTypes.string,
      right: PropTypes.number,
      left: PropTypes.number,
      top: PropTypes.number,
      bottom: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
      children: PropTypes.node.isRequired
    },
    componentDidMount () {
      const wrapper = document.createElement('div')
      wrapper.className = String(style.tooltip)
      this.wrapper = wrapper

      if (this.props.hover) {
        wrapper.addEventListener('mouseenter', this.props.onMouseEnter)
        wrapper.addEventListener('mouseleave', this.props.onMouseLeave)
      }

      if (this.props.className) {
        wrapper.className += ' ' + this.props.className
      }

      document.body.appendChild(wrapper)

      this.renderTooltip()
    },
    componentDidUpdate () {
      this.renderTooltip()
    },
    componentWillUnmount () {
      unmountComponentAtNode(this.wrapper)
      document.body.removeChild(this.wrapper)
    },
    renderTooltip () {
      this.wrapper.style.right = px(window.innerWidth - this.props.right)
      this.wrapper.style.top = px(this.props.bottom + 5)

      render((
        <Dialog {...this.context}>
          {this.props.children}
        </Dialog>
      ), this.wrapper)
    },
    render () {
      return <span className={String(style.hidden)}/>
    }
  })
}

const Tooltip = React.createClass({
  displayName: 'Tooltip',
  mixins: [StyledMixin],
  style,
  propTypes: {
    hover: PropTypes.bool,
    className: PropTypes.string,
    provide: PropTypes.array,
    children: PropTypes.node.isRequired
  },
  getDefaultProps () {
    return {
      hover: false,
      provide: []
    }
  },
  getInitialState () {
    return {
      visible: false
    }
  },
  show () {
    this.setState({visible: true}, this.updateParentClass)
  },
  hide () {
    this.setState({visible: false}, this.updateParentClass)
  },
  toggle () {
    this.setState({visible: !this.state.visible}, this.updateParentClass)
  },
  updateParentClass () {
    if (this.state.visible) {
      this.parent.dataset.active = true
    } else {
      delete this.parent.dataset.active
    }
  },
  onMouseEnter ({target}) {
    clearTimeout(this.willHide)

    if (!this.state.visible) {
      this.show()
    }
  },
  onMouseLeave ({target}) {
    clearTimeout(this.willHide)

    this.willHide = setTimeout(this.hide, 400)
  },
  componentWillMount () {
    this.Portal = createPortal(concat(baseContext, this.props.provide))
  },
  componentDidMount () {
    /**
     * @type {HTMLElement}
     */
    const parent = findDOMNode(this).parentElement
    this.parent = parent

    if (this.props.hover) {
      parent.addEventListener('mouseenter', this.onMouseEnter)
      parent.addEventListener('mouseleave', this.onMouseLeave)
    }

    parent.addEventListener('click', this.toggle)

    this.updateRect()
  },
  componentWillReceiveProps () {
    this.updateRect()
  },
  componentWillUnmount () {
    if (this.props.hover) {
      this.parent.removeEventListener('mouseenter', this.onMouseEnter)
      this.parent.removeEventListener('mouseleave', this.onMouseLeave)
    } else {
      this.parent.removeEventListener('click', this.toggle)
    }
  },
  updateRect () {
    this.setState(pick(
      this.parent.getBoundingClientRect(),
      'bottom',
      'height',
      'left',
      'right',
      'top',
      'width'
    ))
  },
  render () {
    if (!this.state.visible) {
      return <span className={String(style.hidden)}/>
    }

    const {children, className, hover} = this.props
    const {Portal, onMouseLeave, onMouseEnter} = this
    const props = assign({
      hide: this.hide,
      className,
      hover,
      onMouseLeave,
      onMouseEnter
    }, this.state)

    return (
      <Portal {...props}>
        {children}
      </Portal>
    )
  }
})

export default Tooltip
