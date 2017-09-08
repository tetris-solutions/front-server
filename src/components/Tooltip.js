import React from 'react'
import PropTypes from 'prop-types'
import createReactClass from 'create-react-class'
import ReactDOM from 'react-dom'
import csjs from 'csjs'
import omit from 'lodash/omit'
import StyledMixin from './mixins/styled'
import forEach from 'lodash/forEach'
import pick from 'lodash/pick'
import assign from 'lodash/assign'
import concat from 'lodash/concat'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import {required as baseContext} from '../../base-context'
import {setTooltipStyle} from '../functions/set-tooltip-style'

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

const positionType = PropTypes.oneOf([
  'bottom right', // outside inside
  'bottom left',
  'top right',
  'top left',

  'bottom right outside outside',
  'bottom left outside outside',
  'top right outside outside',
  'top left outside outside',

  'bottom right inside inside',
  'bottom left inside inside',
  'top right inside inside',
  'top left inside inside',

  'bottom right inside outside',
  'bottom left inside outside',
  'top right inside outside',
  'top left inside outside'
])

function createPortal (contextAttributes) {
  if (typeof window === 'undefined') return () => null

  const contextTypes = {
    hideTooltip: PropTypes.func,
    tooltipId: PropTypes.string
  }

  forEach(contextAttributes, function addToContext (key) {
    contextTypes[key] = PropTypes.any
  })

  class DetachedTooltip extends React.Component {
    static displayName = 'Tooltip'
    static propTypes = {
      children: PropTypes.node.isRequired,
      hide: PropTypes.func.isRequired,
      id: PropTypes.string.isRequired
    }
    static childContextTypes = contextTypes

    getChildContext () {
      const ctx = pick(this.props, contextAttributes)

      ctx.hideTooltip = this.props.hide
      ctx.tooltipId = this.props.id

      return ctx
    }

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
  }

  class Portal extends React.Component {
    static displayName = 'Portal'

    static propTypes = {
      position: positionType,
      parent: PropTypes.object,
      hover: PropTypes.bool,
      persist: PropTypes.bool,
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
    }
    static contextTypes = omit(contextTypes, 'hideTooltip', 'tooltipId')

    id = 'tooltip-' + Math.random().toString(36).substr(2)

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
        document.addEventListener('scroll', this.onScroll, true)
      }, 10)

      document.body.appendChild(wrapper)

      this.renderTooltip()
    }

    componentDidUpdate () {
      this.renderTooltip()
    }

    componentWillUnmount () {
      unmountComponentAtNode(this.wrapper)
      document.removeEventListener('click', this.onClickOutside)
      document.removeEventListener('scroll', this.onScroll, true)
      document.body.removeChild(this.wrapper)
    }

    onScroll = e => {
      const {parent: tooltipTarget, top} = this.props

      window.requestAnimationFrame(() => {
        if (tooltipTarget.getBoundingClientRect().top !== top) {
          this.props.hide()
        }
      })
    }

    /**
     *
     * @param {Event} e click event
     * @return {undefined}
     */
    onClickOutside = e => {
      if (
        e.target.closest('#' + this.id) ||
        e.target.closest(`[data-tooltip-id=${this.id}]`)
      ) {
        return
      }

      if (!this.props.persist) {
        this.props.hide()
      }
    }

    updateWrapperStyle () {
      setTooltipStyle(
        this.wrapper.style,
        this.props.position,
        this.props.top,
        this.props.right,
        this.props.bottom,
        this.props.left
      )
    }

    renderTooltip () {
      const {hide, children} = this.props

      this.updateWrapperStyle()

      render((
        <DetachedTooltip {...this.context} hide={hide} id={this.id}>
          {children}
        </DetachedTooltip>
      ), this.wrapper)
    }

    render () {
      return <span className={style.hidden}/>
    }
  }

  return Portal
}

const Tooltip = createReactClass({
  displayName: 'Tooltip',
  mixins: [StyledMixin],
  style,
  propTypes: {
    position: positionType,
    persist: PropTypes.bool,
    hover: PropTypes.bool,
    className: PropTypes.string,
    provide: PropTypes.array,
    children: PropTypes.node.isRequired
  },
  getDefaultProps () {
    return {
      position: 'bottom right',
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
  getRect () {
    return pick(
      this.parent.getBoundingClientRect(),
      'bottom',
      'height',
      'left',
      'right',
      'top',
      'width'
    )
  },
  updateRect () {
    this.setState(this.getRect())
  },
  render () {
    if (!this.state.visible) {
      return <span className={style.hidden}/>
    }

    const {children, className, hover, persist, position} = this.props
    const {Portal, onMouseLeave, onMouseEnter} = this
    const props = assign({
      parent: this.parent,
      hide: this.hide,
      className,
      hover,
      persist,
      position,
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
