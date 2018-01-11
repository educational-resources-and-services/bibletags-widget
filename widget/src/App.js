import React, { Component } from 'react'
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import logo from './logo.svg'
import './App.css'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import Measure from 'react-measure'
import { setup, ready, updateHeight } from './utils/postMessage.js'

import CompareView from './components/views/CompareView'

require('dotenv').config()

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://bibletags.org/graphql' }),
  cache: new InMemoryCache(),
})

class App extends Component {

  state = {
    options: null,
  }

  componentDidMount() {
    this.readyStatus = 0
    window.addEventListener('message', this.postMessageListener)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.postMessageListener)
  }

  postMessageListener = event => {
    const { data, source, origin } = event
    const { settings, options } = data.payload || {}

    // record origin in ga
    
    if(source !== window.parent) return

    switch(data.action) {
      case 'preload':
        console.log('preload', data)
        break

      case 'show':
        if(this.readyStatus >= 1) break   // only single show call allowed

        const { maxHeight } = options

        setup({
          origin: process.env.NODE_ENV === 'development' ? '*' : origin,
          source,
          maxHeight,
        })

        this.setState({ options })

        this.readyStatus = 1
        
        break

      default:
        console.log('unknown postMessage', data)
        break
    }
  }

  onResize = contentRect => {
    updateHeight(contentRect.bounds.height)

    if(this.readyStatus === 1) {
      ready()
      this.indicatedReady = 2
    }
  }

  render() {
    const { options } = this.state

    return (
      <ApolloProvider client={client}>
        {/* <MuiThemeProvider> */}
          <Measure
            bounds
            onResize={this.onResize}
          >
            {({ measureRef }) =>
              <div
                // TODO: for some reason, FF not firing the first onResize
                ref={measureRef}
              >
                <CompareView
                  options={options}
                  style={{ position: 'relative' }}
                  show={true}
                />
              </div>
            }
          </Measure>        
        {/* </MuiThemeProvider> */}
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