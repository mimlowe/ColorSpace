import React, { Component } from 'react'
import {Route} from 'react-router-dom';
import Search from './components/Search'
import Result from './components/Result'
import './App.css';

class Main extends Component {
  render() {
    return (
      <div>
        <Route exact path = "/" component = {Search} />
        <Route path = "/search" component = {Search} />
      </div>
    );
  }
}



export default Main;
