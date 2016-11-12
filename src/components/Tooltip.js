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
import {style as modalStyle} from './Modal'

const modalClass = modalStyle.modal.toString().split(' ')[0]
const px = n => `${n}px`
const {render, unmountComponentAtNode, findDOMNode} = ReactDOM
const style = csjs`
.hidden {
  display: none;
}
.tooltip {
  display: block;
  position: absolute;
  z-index: 6;
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
      childContextTypes: contextTypes,
      getChildContext () {
        return pick(this.props, contextAttributes)
      }
    }
  }

  const DetachedTooltip = React.createClass(assign({
    displayName: 'Tooltip',
    propTypes: {
      children: PropTypes.node.isRequired,
      hide: PropTypes.func.isRequired
    },
    render () {
      const {children, hide} = this.props

      if (isString(children)) {
        return <span>{children}</span>
      }

      if (isFunction(children)) {
        return children({hide})
      }

      if (React.Children.count(children) > 1) {
        return <div>{children}</div>
      }

      return children
    }
  }, contextInjectorComponentConfig))

  return React.createClass({
    displayName: 'Portal',
    contextTypes,
    id: 'tooltip-' + Math.random().toString(36).substr(2),
    propTypes: {
      hover: PropTypes.bool,
      hide: PropTypes.func.isRequired,
      onMouseEnter: PropTypes.func.isRequired,
      onMouseLeave: PropTypes.func.isRequired,
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

      wrapper.id = this.id
      wrapper.className = String(style.tooltip)
      this.wrapper = wrapper

      if (this.props.hover) {
        wrapper.addEventListener('mouseenter', this.props.onMouseEnter)
        wrapper.addEventListener('mouseleave', this.props.onMouseLeave)
      }

      if (this.props.className) {
        wrapper.className += ' ' + this.props.className
      }

      setTimeout(() => {
        document.addEventListener('click', this.onClickOutside)
        document.addEventListener('scroll', this.props.hide, true)
      }, 10)

      document.body.appendChild(wrapper)

      this.renderTooltip()
    },
    componentDidUpdate () {
      this.renderTooltip()
    },
    componentWillUnmount () {
      unmountComponentAtNode(this.wrapper)
      document.removeEventListener('click', this.onClickOutside)
      document.removeEventListener('scroll', this.props.hide, true)
      document.body.removeChild(this.wrapper)
    },
    /**
     *
     * @param {Event} e click event
     * @return {undefined}
     */
    onClickOutside (e) {
      if (
        e.target.closest('#' + this.id) ||
        e.target.closest('.' + modalClass)
      ) {
        return
      }

      this.props.hide()
    },
    renderTooltip () {
      this.wrapper.style.right = px(window.innerWidth - this.props.right)
      this.wrapper.style.top = px(this.props.bottom + 5)

      render((
        <DetachedTooltip {...this.context} hide={this.props.hide}>
          {this.props.children}
        </DetachedTooltip>
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
    this.updateRect()
    this.setState({visible: true}, this.updateParentClass)
  },
  hide () {
    this.updateRect()
    this.setState({visible: false}, this.updateParentClass)
  },
  toggle () {
    if (this.state.visible) {
      this.hide()
    } else {
      this.show()
    }
  },
  updateParentClass () {
    if (this.state.visible) {
      this.parent.dataset.active = ''
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
