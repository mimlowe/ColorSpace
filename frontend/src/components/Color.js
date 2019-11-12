import React, { Component } from 'react'
import {default as ColorObj} from 'color'
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
      backgroundColor: "#"+this.props.hex,
      width: '100px',
      height: '100px',
      padding: '10px',
      borderRadius: '10px',
      marginLeft: '5px',
      display: 'inline-block',
    }
    let hexString = "#"+this.props.hex
    let c = ColorObj(hexString)
    let lum = c.luminosity()
    let textColor = (lum > 0.5) ? "#000000" : "#ffffff"

    const colorLabel = {
      color: textColor
    }

    return (
      <div className="Color" style={style}>
        <span className="colorLabel" style={colorLabel}>{"#"+this.props.hex}</span>
      </div>
    )
  }
}

export default Color
