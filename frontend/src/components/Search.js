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

  keyPress(e){
     if(e.keyCode == 13){
        console.log('value', e.target.value);
        let searchTerm = this.state.value
        let searchMode = this.state.searchMode
        fetch("http://localhost:3000" + searchMode + searchTerm)
          .then(
            (result) => {
            console.log(result)
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
     }
  }

  handleChange(e) {
    let searchTerm = e.target.value
    let charArray = searchTerm.split("")
    let mode = ""
    switch(charArray[0]) {
      case "#":
        mode = "/color/hex/"
        break;
      case "rgb":
        mode = "/rgb/"
        break;
      default:
        mode = "/group/"
        break;
    }
    this.setState({
      value: e.target.value,
      searchMode: mode
    });
  }
  render() {
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
          <Result hex='#ff00ff' />
          <Result />
          <Result />
          <Result />
          <Result />
          <Result />
        </div>
      </div>
    );
  }
}

export default Search;
