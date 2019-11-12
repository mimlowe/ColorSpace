import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import Main from './Main'
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  /**
   * React.Component Initialization Method
   * @param {Array} props Passed from parent component
   */
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Main/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
