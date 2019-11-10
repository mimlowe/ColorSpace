import React, { Component } from 'react'
import Color from './Color'
import '../App.css'


class Result extends Component {
  constructor(props) {
    super(props)
    this.state = {...props}
  }

  componentWillMount = () => {
    console.log("Results Will Mount")
    // This is where we query more info about the site
    this.setState({
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff", "#ffffff", "#000000"]
    })
  }

  componentDidMount = () => {
    console.log("Results Mounted")
  }

  render() {
    return (
      <div className="Result">
        <span className="domain">Domain Name</span>
        {
          this.state.colors.map((color, index) => {
            return <Color key={index} hex={color} />
          })
        }
      </div>
    )
  }
}

export default Result
