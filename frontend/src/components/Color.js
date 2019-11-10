import React, { Component } from 'react'
import '../App.css'

class Color extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props
    }
  }

  render() {
    const style = {
      backgroundColor: this.props.hex,
      width: '50px',
      height: '30px',
      display: 'inline-block',
      
    }
    return (
      <div className="Color" style={style}></div>
    )
  }
}

export default Color
