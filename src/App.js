import React from 'react'
// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { determineUILanguageId, setUpI18n } from './utils/i18n.js'
// import styled from 'styled-components'
import { setUp, ready, updateHeight, report } from './utils/postMessage.js'
import { getOrigLangAndLXXVersionInfo, getHashParameter, getOrigLangVersionIdFromRef } from './utils/helperFunctions.js'
import { setEmbeddingAppId } from './utils/auth.js'
import { splitVerseIntoWords } from './utils/splitting.js'
import Measure from 'react-measure'
import Apollo, { restoreCache, client, getStaleState, setStaleTime, getQueryVars } from './components/smart/Apollo'
import { getCorrespondingRefs } from 'bibletags-versification/src/versification'

import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'

import CompareView from './components/views/CompareView'
import Bar from './components/basic/Bar'
import Progress from './components/basic/Progress'

import versionInfoQuery from './data/queries/versionInfo'

// const dev = !!window.location.href.match(/localhost/)

const compareViewStyle = { position: 'relative' }

const generateClassName = createGenerateClassName()
const jss = create({
  ...jssPreset(),
  // We define a custom insertion point that JSS will look for injecting the styles in the DOM.
  insertionPoint: document.getElementById('jss-insertion-point'),
})

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

      case '-': {  // used to fetch and set the embeddingAppId only
        break
      }

      case 'setUp': {
        this.setUpLanguage({ settings })

        const { versionIdsToUse } = settings

        ;(versionIdsToUse || []).forEach(versionId => getVersionInfo(versionId))

        break
      }

      case 'preload': {
        const { version, originalLanguageRef } = options

        if(!version === !originalLanguageRef) break  // invalid parameters

        const preloadOptions = version
          ? options
          : {
            multipleVersions: {
              originalLanguageRef,
            }
          }
        
        this.setUpLanguage({
          settings,
          options: preloadOptions,
        })

        this.setState({ options: preloadOptions })

        break
      }

      case 'show': {
        if(this.readyStatus >= 1) break  // only single show call allowed
        
        const { version, multipleVersions, maxHeight } = options

        if(!version === !multipleVersions) break  // invalid parameters

        this.setUpLanguage({ settings, options })

        setUp({ maxHeight })

        this.setState({ options }, () => {
          updateHeight(this.refEl.offsetHeight)
          ready()
        })

        this.readyStatus = 1
        
        break
      }
        
      case 'getCorrespondingLocations': {

        const { originalLanguageRef, lookupVersionIds } = options
        const lookupVersionInfos = []
        const versions = []

        const baseVersion = {
          ref: originalLanguageRef,
          info: getOrigLangAndLXXVersionInfo()[getOrigLangVersionIdFromRef(originalLanguageRef)],
        }

        await Promise.all(
          lookupVersionIds.map(async (versionId, index) => {
            lookupVersionInfos[index] = await getVersionInfo(versionId)
          })
        )

        lookupVersionInfos.forEach(lookupVersionInfo => {
          versions.push({
            id: lookupVersionInfo.id,
            refs: getCorrespondingRefs({ baseVersion, lookupVersionInfo }),
          })
        })

        report({
          action: 'reportCorrespondingLocations',
          payload: {
            actionIndex,
            versions,
          },
        })

        break
      }

      case 'getOriginalLanguageRef': {

        const { version } = options

        const baseVersion = {
          ref: version.ref,
          info: await getVersionInfo(version.id),
        }

        const lookupVersionInfo = getOrigLangAndLXXVersionInfo()[getOrigLangVersionIdFromRef(version.ref)]

        const ref = getCorrespondingRefs({ baseVersion, lookupVersionInfo })

        report({
          action: 'reportOriginalLanguageRef',
          payload: {
            actionIndex,
            ref,
          },
        })

        break
      }

      case 'splitVerseIntoWords': {

        const { version={} } = options
        const { id, ref={} } = version
        const { usfm } = ref
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
      }

      default: {
        console.log('unknown postMessage', data)
        break
      }
    }
  }

  setRefEl = ref => this.refEl = ref

  onResize = contentRect => updateHeight(contentRect.bounds.height)

  render() {
    const { options, uiLanguageId } = this.state

    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
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
      </JssProvider>
    )
  }
}

export default App
