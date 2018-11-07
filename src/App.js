import React from 'react'
// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { determineUILanguageCode, setUpI18n } from './utils/i18n.js'
// import styled from 'styled-components'
import { setUp, ready, updateHeight, report } from './utils/postMessage.js'
import { origLangAndLXXVersionInfo, hashParametersObject } from './utils/helperFunctions.js'
import { splitVerseIntoWords } from './utils/splitting.js'
import Measure from 'react-measure'
import Apollo, { restoreCache, client, getStaleState, setStaleTime, getQueryVars } from './components/smart/Apollo'
import { getCorrespondingVerseLocation } from 'bibletags-versification'

import CompareView from './components/views/CompareView'
import Bar from './components/basic/Bar'
import Progress from './components/basic/Progress'

import versionInfoQuery from './data/queries/versionInfo'

// const dev = !!window.location.href.match(/localhost/)

const getVersionInfo = async id => {
  if(origLangAndLXXVersionInfo[id]) {
    return origLangAndLXXVersionInfo[id]
  }

  return await (
    async () => {
      // Since this information can change (improved extraVerseMappings, for example), set and
      // check a stale time. When it is stale, still use the cache (for instant results), but
      // make a second query as well that forces a new fetch via the network.

      const cacheKey = `VersionInfo:${id}`
      const staleState = getStaleState(cacheKey)

      const getResult = fetchPolicy => (
        client.query({
          query: versionInfoQuery,
          variables: {
            id,
          },
          fetchPolicy,
        })
      )

      const queryInfo = await getResult("cache-first")
      const oneDayInTheFuture = Date.now() + (1000 * 60 * 60 * 24)

      if(staleState <= 0) {
        if(staleState === 0) {
          getResult("network-only")
        }
        setStaleTime({ cacheKey, staleTime: oneDayInTheFuture })
      }

      return getQueryVars({ queryInfo }).data.versionInfo || { id }
    }
  )()
}

class App extends React.Component {

  state = {
    uiLanguageCode: "eng",
    options: {},
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
        this.setUpLanguage({ settings, options })

        this.setState({ options })

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

        let { baseVersion, lookupVersionIds } = options
        const lookupVersionInfos = []
        const verseLocations = []

        await Promise.all([
          (async () => {
            baseVersion.info = await getVersionInfo(baseVersion.id)
          })(),
          ...lookupVersionIds.map(async (versionId, index) => {
            lookupVersionInfos[index] = await getVersionInfo(versionId)
          }),
        ])

        lookupVersionInfos.forEach(lookupVersionInfo => {
          verseLocations.push({
            id: lookupVersionInfo.id,
            refs: getCorrespondingVerseLocation({ baseVersion, lookupVersionInfo }),
          })
        })

        report({
          action: 'reportCorrespondingVerseLocations',
          payload: {
            actionIndex,
            verseLocations,
          },
        })

        break

      case 'splitVerseIntoWords':

        const { version={} } = options
        const { id } = version
        let words = null

        if(id) {
          const { name, wordDividerRegex } = await getVersionInfo(id)

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
                <div
                  ref={measureRef}
                  style={hashParametersObject.utility ? { visibility: "hidden" } : null}
                >
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
                        <Progress
                          containerStyle={{
                            paddingBottom: 25,
                          }}
                        />
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
