import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import logo from './logo.svg'
import './App.css'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://bibletags.org/graphql' }),
  cache: new InMemoryCache(),
})

class App extends Component {
  render() {
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
