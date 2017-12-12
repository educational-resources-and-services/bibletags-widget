import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import logo from './logo.svg'
import './App.css'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

require('dotenv').config()

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://bibletags.org/graphql' }),
  cache: new InMemoryCache(),
})

class App extends Component {

  componentDidMount() {
    window.addEventListener('message', this.postMessageListener)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.postMessageListener)
  }

  postMessageListener = event => {
    const { data, source, origin } = event

    // record origin in ga
    
    if(source !== window.parent) return

    switch(data.action) {
      case 'preload':
        setTimeout(() => {
          source.postMessage({
            action: 'close',
          }, process.env.NODE_ENV === 'development' ? '*' : origin)
        }, 2000)
        break;

      case 'show':
        setTimeout(() => {
          source.postMessage({
            action: 'close',
          }, process.env.NODE_ENV === 'development' ? '*' : origin)
        }, 5000)
        break;

      default:
        console.log('unknown postMessage', data)
        break;
    }
  }

  render() {
    console.log('process.env', process.env)  // keys must start with REACT_APP_
    return (
      <ApolloProvider client={client}>
        <MuiThemeProvider>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
            </p>
          </div>
        </MuiThemeProvider>
      </ApolloProvider>
    )
  }
}

export default App;


/*

** Versification mapping for versions will be in the widget. If I make this smart, then we are talking 1k-2k.

// talk to unfolding word about how they do versification
https://crosswire.org/wiki/Survey_of_versification_schemes_in_French_Bibles#Canons_proposals_for_The_Sword_Project
https://crosswire.org/wiki/Alternate_Versification
https://github.com/openscriptures/BibleOrgSys/tree/master/DataFiles/VersificationSystems
[
  {
    versions: ['esv','nasb','kjv',...],
    notVersions: ['udi',...],
    mappings: {
      "0211030":"0212001",
      "0212001-":-1,
      "0512001-512002":"512001",
      "0522005":"0522005-0522006",
      ...
    }
  },
  ...
]

*/