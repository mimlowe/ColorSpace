import React, { Component } from 'react'
import Color from './Color'
import '../App.css'


class Result extends Component {
  /**
   * React.Component Initialization Method
   * @param {Array} props Passed from parent component
   */
  constructor(props) {
    super(props)
    this.state = {...props}
  }

  /**
   * React.Component Lifecycle Method
   * Called before component mounts
   * @return {}
   */
  componentWillMount = () => {
    console.log("Results Will Mount")
    // This is where we query more info about the site
    // this.setState({
    //   colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff", "#ffffff", "#000000"]
    // })
  }
  /**
   * React.Component Lifecycle Method
   * Called after component mounts
   * @return {}
   */
  componentDidMount = () => {
    console.log("Results Mounted")
  }
  
  /**
   * React Method. Called when component state / DOM changes
   * @return { HTML / JSX }
   */
  render() {
    return (
      <div className="Result">
        <span className="domain">{this.state.site.domain}</span>
        {
          this.state.site.colors.map((color, index) => {
            return <Color key={index} hex={color} />
          })
        }
      </div>
    )
  }
}

export default Result
