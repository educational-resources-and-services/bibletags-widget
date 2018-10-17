import React from 'react'
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { determineUILanguageCode, setUpI18n } from './utils/i18n.js'
import styled from 'styled-components'
import { setUp, ready, updateHeight } from './utils/postMessage.js'

import Measure from 'react-measure'
import { CircularProgress } from 'material-ui/Progress';

import Apollo, { restoreCache } from './components/smart/Apollo'
import CompareView from './components/views/CompareView'
import Bar from './components/basic/Bar'

// const dev = !!window.location.href.match(/localhost/)

const CircularProgressCont = styled.div`
  text-align: center;
  padding: 20px 0 25px;
`

class App extends React.Component {

  state = {
    uiLanguageCode: "eng",
    options: null,
  }

  componentDidMount() {
    this.readyStatus = 0
    window.addEventListener('message', this.postMessageListener)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.postMessageListener)
  }

  setUpLanguage = async ({ settings, options }) => {
    const uiLanguageCode = determineUILanguageCode({ settings, options })

    if(uiLanguageCode === this.state.uiLanguageCode) return 

    this.setState({ uiLanguageCode: null })
    await setUpI18n(uiLanguageCode)
    this.setState({ uiLanguageCode })
  }

  postMessageListener = event => {
    const { data, source } = event
    // const { data, source, origin } = event
    const { settings, options } = data.payload || {}

    if(source !== window.parent) return

    // TODO: record origin in ga
    
    const { maxHeight } = options

    switch(data.action) {
      case 'setUp':
        this.setUpLanguage({ settings, options })
        break

      case 'preload':
        console.log('preload', data)
        this.setUpLanguage({ settings, options })
        restoreCache()
        break

      case 'show':
        if(this.readyStatus >= 1) break   // only single show call allowed

        this.setUpLanguage({ settings, options })

        setUp({ maxHeight })

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
    const { options, uiLanguageCode } = this.state

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
                  {uiLanguageCode !== null
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
