import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import Result from './Result'
import '../App.css';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', searchMode: '/group/'};
    this.handleChange = this.handleChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }
  /**
   * Method called on keypress.
   * Currently used to check for return key to begin search query
   * @param  {Event} e event
   * @return {void }
   */
  keyPress(e){
     if(e.keyCode == 13){
        console.log('value', e.target.value);
        let searchTerm = this.state.value
        let searchMode = this.state.searchMode
        console.log(searchMode)
        // ========= HTTP REQUEST HERE ========== //
     }
  }
  /**
   * Method called every time the search bar updates.
   * It sets the search mode so that the search
   * function can use the proper endpoint.
   * @param  {Event} e event
   * @return {void }
   */
  handleChange(e) {
    let searchTerm = e.target.value
    let charArray = searchTerm.split("")

    let mode = ""
    switch(charArray[0]) {
      case "#":
        mode = "hex"
        break;
      case "r":
        // Need to further classify this case by checking
        // for g & b characters in the array.
        // Do not break, unless the full condition is met
        if (charArray[1] === "g" && charArray[2] === "b") {
          mode = "rgb"
          break
        }
      default:
        mode = "group"
        break;
    }
    this.setState({
      value: e.target.value,
      searchMode: mode
    });
  }
  /**
   * React Method. Called when component state / DOM changes
   * @return { HTML / JSX }
   */
  render() {
    const sites = [
      {
        domain: 'amazon.com',
        colors: ["#ff9900", "#232f3e"]
      },
      {
        domain: 'google.com',
        colors: ["#FFFFFF", "#4285F4", "#DB4437", "#F4B400", "#0F9D58"]
      },
      {
        domain: 'facebook.com',
        colors: ["#4267B2", "#ffffff"]
      }
    ]

    return (
      <div className="App">
        <header className="App-header">
          <h1>_ColorSpace</h1>
          <input
            type="text"
            className="search-bar"
            onKeyDown={this.keyPress}
            onChange={this.handleChange}
            placeholder="#fafafa, rgb(250, 250, 250), light"
          />
          <div id="grad1"></div>
        </header>
        <div className="ResultWrapper">
        {
          sites.map((site, index) => {
            return  <Result key={index} site={site} />
          })
        }
        </div>
      </div>
    );
  }
}

export default Search;
