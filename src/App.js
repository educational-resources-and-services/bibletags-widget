import React from 'react'
// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { determineUILanguageId, setUpI18n } from './utils/i18n.js'
// import styled from 'styled-components'
import { setUp, ready, updateHeight, report } from './utils/postMessage.js'
import { getOrigLangAndLXXVersionInfo, getHashParameter, getAuthInfo, setAuthInfo } from './utils/helperFunctions.js'
import { splitVerseIntoWords } from './utils/splitting.js'
import Measure from 'react-measure'
import Apollo, { restoreCache, client, getStaleState, setStaleTime, getQueryVars } from './components/smart/Apollo'
import { getCorrespondingVerseLocation } from 'bibletags-versification'

import CompareView from './components/views/CompareView'
import Bar from './components/basic/Bar'
import Progress from './components/basic/Progress'

import versionInfoQuery from './data/queries/versionInfo'
import embeddingAppQuery from './data/queries/embeddingApp'

// const dev = !!window.location.href.match(/localhost/)

const compareViewStyle = { position: 'relative' }

const setEmbeddingAppId = ({ uri }) => {

  const { embeddingAppId, fetchingEmbeddingApp } = getAuthInfo()

  if(!embeddingAppId && !fetchingEmbeddingApp) {

    setAuthInfo({ fetchingEmbeddingApp: true })

    return client.query({
      query: embeddingAppQuery,
      variables: {
        uri,
      },
      fetchPolicy: "cache-first",
    })
      .then(queryInfo => {
        const { embeddingApp } = getQueryVars({ queryInfo }).data

        setAuthInfo({
          fetchingEmbeddingApp: false,
          ...(
            embeddingApp
              ? {
                embeddingAppId: parseInt(embeddingApp.id, 10),
              }
              : {}
          )
        })
      })
      .catch(err => {
        setAuthInfo({ fetchingEmbeddingApp: false })
        throw err
      })

  }
}

const getVersionInfo = async id => {
  const versionInfo = getOrigLangAndLXXVersionInfo()[id]
  if(versionInfo) {
    return versionInfo
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
    uiLanguageId: "eng",
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
    const uiLanguageId = determineUILanguageId({ settings, options })

    if(uiLanguageId === this.state.uiLanguageId) return 

    this.setState({ uiLanguageId: null })
    await setUpI18n(uiLanguageId)
    this.setState({ uiLanguageId })
  }

  postMessageListener = async event => {
    const { data, source, origin } = event
    const { settings, options={}, actionIndex } = data.payload || {}

    if(source !== window.parent) return

    // TODO: record origin in ga

    restoreCache()

    await setEmbeddingAppId({ uri: origin.replace(/:[0-9]*$/, '') })
    
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
        const { id, usfm } = version
        let words = null

        if(id) {
          const { name, wordDividerRegex } = await getVersionInfo(id)

          if(name !== undefined) {
            words = splitVerseIntoWords({
              usfm,
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
    const { options, uiLanguageId } = this.state

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
                  style={getHashParameter('utility') ? { visibility: "hidden" } : null}
                >
                  {uiLanguageId !== null
                    ?
                      <CompareView
                        options={options}
                        style={compareViewStyle}
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
