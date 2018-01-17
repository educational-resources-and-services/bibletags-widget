import React from 'react'
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { setUpI18n } from './utils/i18n.js'
import styled from 'styled-components'
import { setup, ready, updateHeight } from './utils/postMessage.js'

import Measure from 'react-measure'
import { CircularProgress } from 'material-ui/Progress';

import Apollo, { restoreCache } from './components/smart/Apollo'
import CompareView from './components/views/CompareView'
import Bar from './components/basic/Bar'

const dev = !!location.href.match(/localhost/)

const CircularProgressCont = styled.div`
  text-align: center;
  padding: 20px 0 25px;
`

class App extends React.Component {

  state = {
    languageReady: false,
    options: null,
  }

  componentDidMount() {
    this.readyStatus = 0
    window.addEventListener('message', this.postMessageListener)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.postMessageListener)
  }

  getLanguageSetup = async () => {
    await setUpI18n()
    this.setState({ languageReady: true })
  }

  postMessageListener = event => {
    const { data, source, origin } = event
    const { settings, options } = data.payload || {}

    // TODO: record origin in ga
    
    if(source !== window.parent) return

    const { uiLanguageCode, maxHeight } = options

    switch(data.action) {
      case 'setup':
        this.getLanguageSetup({ uiLanguageCode })
        break

      case 'preload':
        console.log('preload', data)
        this.getLanguageSetup({ uiLanguageCode })
        restoreCache()
        break

      case 'show':
        if(this.readyStatus >= 1) break   // only single show call allowed

        this.getLanguageSetup({ uiLanguageCode })

        setup({
          origin: dev ? '*' : origin,
          source,
          maxHeight,
        })

        restoreCache()

        this.setState({ options }, () => {
          updateHeight(this.refEl.offsetHeight)
          ready()
        })

        this.readyStatus = 1
        
        break

      default:
        console.log('unknown postMessage', data)
        break
    }
  }

  setRefEl = ref => this.refEl = ref

  onResize = contentRect => updateHeight(contentRect.bounds.height)

  render() {
    const { options, languageReady } = this.state

    return (
      <Apollo>
        {/* <MuiThemeProvider> */}
          <Measure
            bounds
            onResize={this.onResize}
          >
            {({ measureRef }) =>
              <div ref={this.setRefEl}>
                <div ref={measureRef}>
                  {languageReady
                    ?
                      <CompareView
                        options={options}
                        style={{ position: 'relative' }}
                        show={true}
                      />
                    :
                      <div>
                        <Bar />
                        <CircularProgressCont>
                          <CircularProgress />
                        </CircularProgressCont>
                      </div>
                  }
                </div>
              </div>
            }
          </Measure>        
        {/* </MuiThemeProvider> */}
      </Apollo>
    )
  }
}

export default App


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