import React from 'react'
// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { determineUILanguageCode, setUpI18n } from './utils/i18n.js'
import styled from 'styled-components'
import { setUp, ready, updateHeight, report } from './utils/postMessage.js'
import { studyVersions, getCorrespondingVerseLocations, splitVerseIntoWords, getDataVar } from './utils/helperFunctions.js'

import Measure from 'react-measure'
import CircularProgress from '@material-ui/core/CircularProgress'

import Apollo, { restoreCache, client } from './components/smart/Apollo'
import CompareView from './components/views/CompareView'
import Bar from './components/basic/Bar'

import versionInfoQuery from './data/queries/versionInfo'

// const dev = !!window.location.href.match(/localhost/)

const CircularProgressCont = styled.div`
  text-align: center;
  padding: 20px 0 25px;
`

const getVersionInfo = async versionId => {
  if(studyVersions[versionId]) {
    return studyVersions[versionId].versionInfo
  }

  return await (
    async () => {
      const result = await client.query({
        query: versionInfoQuery,
        variables: {
          id: versionId,
        },
        fetchPolicy: "cache-first",
      })
      return getDataVar(result).versionInfo || { id: versionId }
    }
  )()
}

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

  postMessageListener = async event => {
    const { data, source } = event
    // const { data, source, origin } = event
    const { settings, options={}, actionIndex } = data.payload || {}

    if(source !== window.parent) return

    // TODO: record origin in ga

    restoreCache()
    
    switch(data.action) {

      case 'setUp':
        this.setUpLanguage({ settings })

        const { versionIdsToUse } = settings

        ;(versionIdsToUse || []).forEach(versionId => getVersionInfo(versionId))

        break

      case 'preload':
        console.log('preload', data)
        this.setUpLanguage({ settings, options })
        break

      case 'show':
        if(this.readyStatus >= 1) break   // only single show call allowed

        const { maxHeight } = options

        this.setUpLanguage({ settings, options })

        setUp({ maxHeight })

        this.setState({ options }, () => {
          updateHeight(this.refEl.offsetHeight)
          ready()
        })

        this.readyStatus = 1
        
        break
        
      case 'getCorrespondingVerseLocations':

        let { baseVersion, lookupVersions } = options
        const lookupVersionInfos = []
      
        await Promise.all([
          (async () => {
            baseVersion.versionInfo = await getVersionInfo(baseVersion.versionId)
          })(),
          ...lookupVersions.map(async (versionId, index) => {
            lookupVersionInfos[index] = await getVersionInfo(versionId)
          }),
        ])
        
        report({
          action: 'reportCorrespondingVerseLocations',
          payload: {
            actionIndex,
            verseLocations: getCorrespondingVerseLocations({ baseVersion, lookupVersionInfos }),
          },
        })

        break

      case 'splitVerseIntoWords':

        const { version={} } = options
        const { versionId } = version
        let words = null

        if(versionId) {
          const { name, wordDividerRegex } = await getVersionInfo(versionId)

          if(name !== undefined) {
            words = splitVerseIntoWords({
              ...version,
              wordDividerRegex,
            })
          }
        }

        report({
          action: 'reportWordsArray',
          payload: {
            actionIndex,
            words,
          },
        })

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
