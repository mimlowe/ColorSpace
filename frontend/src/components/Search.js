import React, { Component } from 'react';
import {BrowserRouter} from 'react-router-dom';
import {default as ColorObj} from 'color'
import axios from 'axios'
import API from '../API'
import Result from './Result'
import '../App.css';

class Search extends Component {
  /**
   * React.Component Initialization Method
   * @param {Array} props Passed from parent component
   */
  constructor(props) {
    super(props);
    this.isWebsite = this.isWebsite.bind(this)
    this.state = {value: '', searchMode: '/group/', data: [], clearResults: false};
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
    let mode  = this.state.searchMode
    let query = this.state.query
    let url = API.baseURL
    let params = "?"
    if(e.keyCode == 13){
      switch(mode) {
        case 'add':
          url +=  API.routes.colors
          let colorObj = ColorObj("#"+query)
          axios.post(url+"/", {
            "hexval": query,
            "rgb": colorObj.rgb().array()
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
          break;
        case 'hex':
          url += API.routes.colors
          params += "hexval__iexact=" + query
          axios.get(url+params)
          .then((response) => {
            let docid = response.data.data[0].id
            let url2 = API.baseURL + API.routes.sites + "/?colors__contains="
            console.log(url2+docid)
            // Secondary Query
            // ==========================================
                  axios.get(url2+docid)
                  .then((response) => {
                    let data = response.data.data
                    this.setState({
                      data: data
                    })
                    //console.log(response);
                  }, (error) => {
                    console.log(error);
                  });
            // ==========================================
          }, (error) => {
            console.log(error);
          });
          break;
        case 'site':
          url += API.routes.sites
          params += "domain__icontains=" + query
          axios.get(url+params)
          .then((response) => {
            let data = response.data.data
            if (data == null || data == [] || data === undefined) {
              // ======================================
              //         SELENIUM POLLER
              // ======================================
              /*

                     Logic to trigger Poller goes

                              H E R E

              */
              // ======================================
            }
            this.setState({
              data: data
            })
          }, (error) => {
            console.log(error);
          });
          break
        case 'group':
      //  console.log(this.state.searchMode)
        url += API.routes.colorgroups
        params += "primary__icontains=" + query
        // ColorGroup ID Query
        axios.get(url+params)
        .then((response) => {
          let docs = response.data.data
          let groupIds = this.getFields(docs, "id");
          let url2 = API.baseURL + API.routes.colors + "/?colorgroup__in="

          console.log("GROUP IDs: ", groupIds)
          console.log(url2)
          // Color ID Query
          // ==========================================
                axios.get(url2+groupIds)
                .then((response) => {
                  let data = response.data.data
                  let colorIds = this.getFields(data, "id")
                  console.log("COLOR IDs: ", colorIds)
                  let url3 = API.baseURL + API.routes.sites + "/?colors__in="
                  console.log("URL: ", url3)
                  // Site query
                  axios.get(url3+colorIds)
                  .then((response) => {
                    let data = response.data.data
                    console.log(data)
                    this.setState({
                      data: data
                    })
                  }, (error) => {
                    console.log(error);
                  });
                }, (error) => {
                  console.log(error);
                });
          // ==========================================
        }, (error) => {
          console.log(error);
        });
        break;
        default:
          break;
      }
     }
  }

  getFields(input, field) {
      let output = "";
      for (let i=0; i < input.length ; ++i)
          output += `${input[i][field]},`;
      output = output.substring(0, output.length - 1)
      return output;
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
    let clearResults = false
    if (searchTerm === "") {
      clearResults = true
      this.setState({
        data: []
      });
    }
    let charArray = searchTerm.split("")
    let query = ""
    let mode = ""
    switch(charArray[0]) {
      case "+":
        mode = "add"
        query = searchTerm.substr(1)
        break;
      case "#":
        mode = "hex"
        query = searchTerm.substr(1)
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
        if (this.isWebsite(searchTerm))
          mode = "site"
        else mode = "group"
        query = searchTerm
        break;
    }
    this.setState({
      value: e.target.value,
      searchMode: mode,
      clearResults: clearResults,
      query: query
    });
  }


  isWebsite(searchTerm) {
    let a = searchTerm.includes(".")
    let b = searchTerm.includes("://")
    if (a || b) return true
    else return false
  }
  /**
   * React Method. Called when component state / DOM changes
   * @return { HTML / JSX }
   */
  render() {

     //let sites = [{domain:"", colors:[]}]
    let sites = this.state.data.map((data, key) => {
      let c = data.colors.map((val, key) => {
        return val.hexval
      })
      return {domain: data.domain, colors: c}
    })
    console.log(sites)
    return (
      <div className="App">

          <h1>_ColorSpace</h1>
          <input
            type="text"
            className="search-bar"
            onKeyDown={this.keyPress}
            onChange={this.handleChange}
            placeholder="#fafafa, amazon.com"
          />
          <div id="grad1"></div>

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
