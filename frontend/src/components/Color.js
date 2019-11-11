import React, { Component } from 'react'
import '../App.css'

class Color extends Component {
  /**
   * React.Component Initialization Method
   * @param {Array} props Passed from parent component
   */
  constructor(props) {
    super(props)
    this.state = {
      ...props
    }
  }
  
  /**
   * React Method. Called when component state / DOM changes
   * @return { HTML / JSX }
   */
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
