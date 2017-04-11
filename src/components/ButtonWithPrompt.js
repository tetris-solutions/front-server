import React from 'react'
import Modal from './Modal'

const st = {cursor: 'pointer'}

class ButtonWithPrompt extends React.Component {
  static displayName = 'Button-With-Prompt'

  static propTypes = {
    children: React.PropTypes.func.isRequired,
    className: React.PropTypes.string,
    label: React.PropTypes.node.isRequired,
    size: React.PropTypes.string,
    tag: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.string
    ])
  }

  static defaultProps = {
    size: 'small',
    tag: 'button'
  }

  state = {
    isModalOpen: false
  }

  openModal = () => {
    this.setState({isModalOpen: true})
  }

  closeModal = () => {
    this.setState({isModalOpen: false})
  }

  onClick = (e) => {
    e.preventDefault()
    this.openModal()
  }

  render () {
    const {tag: Tag, className, size, label, children: fn} = this.props
    const props = {className, onClick: this.onClick, style: st}

    if (Tag === 'button') {
      props.type = 'button'
    }

    return (
      <Tag {...props}>
        {label}
        {this.state.isModalOpen && (
          <Modal size={size} onEscPress={this.closeModal}>
            {fn({dismiss: this.closeModal})}
          </Modal>)}
      </Tag>
    )
  }
}

export default ButtonWithPrompt
