import React from 'react'
// import i18n from '../../utils/i18n.js'
// import styled from 'styled-components'
import { restoreCache } from '../smart/Apollo'
import { formLoc, getPassageStr, usfmToJSON, origLangAndLXXVersions, getOrigLangVersionIdFromRef } from '../../utils/helperFunctions.js'
import { getCorrespondingVerseLocation, isValidRefInOriginal } from 'bibletags-versification'

import SmartQuery from '../smart/SmartQuery'
import SmartQueries from '../smart/SmartQueries'
import View from '../basic/View'
import Bar from '../basic/Bar'
// import SwitchButtons from '../basic/SwitchButtons'
// import SwitchButton from '../basic/SwitchButton'
import Parallel from '../smart/Parallel'
import Entry from '../smart/Entry'
import SearchView from './SearchView'
import Progress from '../basic/Progress'

import versionInfoQuery from '../../data/queries/versionInfo'
import verseQuery from '../../data/queries/verse'
import tagSetQuery from '../../data/queries/tagSet'

// const verse = {
//   id: '0010101-wlc',
//   usfm: `
//     \\w ב/רשית|strongs="H234" morph="HR/Ncfsa"\\w*
//     \\w ברא|lemma="hi!"\\w*
//     \\w אלוהים\\w*,
//     \\w את\\w*
//     \\w ה/שמים\\w*
//     \\w ו/את\\w*
//     \\w ה/ארץ\\w*
//   `.replace(/\s+/g, ' ')
// }

// const tagSet = {
//   id: '01001001-esv',
//   tags: [
//     {
//       o: ["|1|1"],
//       t: [1]
//     },
//     {
//       o: ["|1|2"],
//       t: [3]
//     },
//     {
//       o: ["|2"],
//       t: [5]
//     },
//     {
//       o: ["|3"],
//       t: [4]
//     },
//     {
//       o: ["|5|1"],
//       t: [6]
//     },
//     {
//       o: ["|5|2"],
//       t: [6]
//     },
//     {
//       o: ["|6|1"],
//       t: [8]
//     },
//     {
//       o: ["|7|1"],
//       t: [9]
//     },
//     {
//       o: ["|7|2"],
//       t: [10]
//     },
//   ]
// }

// const word = {
//   id: 'H234-eng',
//   lemma: 'אַזְכָּרָה',
//   lemmaUnique: true,
//   vocal: 'ʼazkârâh',
//   hits: 7,
//   gloss: 'reminder',
//   pos: ['N'],
//   syn: [],
//   rel: [{"lemma":"זָכַר","strongs":"G2142","hits":232,"gloss":"remember"}],
//   lxx: [{"w":"ἀρχῇ","lemma":"ἀρχή","strongs":"G746","hits":236,"bhpHits":55}],
//   lxxHits: [],
// }

// const translations = {
//   id: 'H234-esv',
//   tr: [{"son":299,"sons":56}],
// }

// const lexEntry = {
//   id: 'H234-eng',
//   usfm: 'About the word...',
// }


// const DoubleLine = styled.div`
//   width: 20px;
//   height: 4px;
//   border: 1px solid black;
//   border-width: 1px 0;
//   .depressed & {
//     border-color: white;
//   }
// `

// const SwitchButtonText = styled.div`
//   display: block;
//   font-size: 9px;
//   line-height: 1;
//   margin-bottom: 3px;
// `

// const DashedLine = styled.div`
//   display: block;
//   width: 100%;
//   height: 1px;
//   border-top: 1px dashed black;
//   .depressed & {
//     border-color: white;
//   }
// `

class CompareView extends React.PureComponent {

  state = {
    showSearchView: false,
    mode: 'separate',
    wordNum: null,
  }

  static getDerivedStateFromProps({ options }, state) {
    let returnVal = null

// Needs work to be valid with translations
    if(state.wordNum === null && options) {
      ;(options.versions || []).some(version => {
        const { wordNum } = version.ref || []
        if(typeof wordNum === 'number') {
          returnVal = {
            wordNum,
          }
        }
        return returnVal
      })
    }

    return returnVal
  }

  getVersionInfoQuerySets = () => {
    const { options } = this.props 
    const { versions } = options

    return versions
      .filter(version => !origLangAndLXXVersions[version.id])
      .map(version => ({
        variables: { id: version.id },
        cacheKey: `VersionInfo:${version.id}`
      }))
  }

  getVerseAndTagSetQueryVars = versionInfoQueryVarSets => {
    const { options } = this.props 
    const { versions, includeLXX } = options

    const baseVersion = {
      ...versions[0],
      ref: versions[0].refs[0],
      info: versionInfoQueryVarSets[versions[0].id].data.versionInfo,
    }
    delete baseVersion.refs

    let origLangAndLXXVerseIds, tagSetIds
    const commonRef = { ...baseVersion.ref }
  
    const updateCommonRef = refs => {
      refs.forEach(ref => {
        if(commonRef.chapter !== ref.chapter) {
          delete commonRef.chapter
          delete commonRef.verse
        } else if(commonRef.verse !== ref.verse) {
          delete commonRef.verse
        }
      })
    }
  
    if(origLangAndLXXVersions[baseVersion.id]) {
      if(isValidRefInOriginal(baseVersion.ref)) {
        origLangAndLXXVerseIds = [`${formLoc(baseVersion.ref)}-${baseVersion.id}`]
        tagSetIds = []
      }
  
    } else {
      const origLangVersionId = getOrigLangVersionIdFromRef(baseVersion.ref)
      const origLangRefs = getCorrespondingVerseLocation({
        baseVersion,
        lookupVersionInfo: origLangAndLXXVersions[origLangVersionId].info,
      })

      if(origLangRefs) {
        updateCommonRef(origLangRefs)
        origLangAndLXXVerseIds = origLangRefs.map(ref => `${formLoc(ref)}-${origLangVersionId}`)
        tagSetIds = []
  
        versions.forEach(version => {
          if(!origLangAndLXXVersions[version.id]) {
  
            const neededRefs = getCorrespondingVerseLocation({
              baseVersion,
              lookupVersionInfo: versionInfoQueryVarSets[version.id].data.versionInfo,
            })
  
            if(neededRefs) {
              updateCommonRef(neededRefs)
  
              const neededLocs = neededRefs.map(ref => formLoc(ref))
              const passedInLocs = version.refs.map(ref => formLoc(ref))
  
              if(neededLocs.every(loc => passedInLocs.includes(loc))) {
                tagSetIds = [
                  ...tagSetIds,
                  ...neededLocs.map(loc => `${loc}-${version.id}`),
                ]
              }
            }
          }
        })
      }
    }

    if(!origLangAndLXXVerseIds || !tagSetIds) {
      // TODO: indicate bad params
      return null
    }
  
    if(includeLXX) {
      const neededRefs = getCorrespondingVerseLocation({
        baseVersion,
        lookupVersionInfo: origLangAndLXXVersions['lxx'].info,
      })
  
      if(neededRefs) {
        updateCommonRef(neededRefs)
        const neededIds = neededRefs.map(ref => `${formLoc(ref)}-lxx`)
  
        origLangAndLXXVerseIds = [
          ...origLangAndLXXVerseIds,
          ...neededIds,
        ]
  
        tagSetIds = [
          ...tagSetIds,
          ...neededIds,
        ]
      }
    }
  
    const hasMisallignment = commonRef.verse == null  // TODO: this needs to take wordRange into account also
  
    return {
      commonRef,
      origLangAndLXXVerseIds,
      tagSetIds,
      hasMisallignment,
    }
  } 
  
  hideSearchView = () => this.setState({ showSearchView: false })
  
  updateWordNum = ({ wordNum, force }) => {
    // Do not count it as a click if they have selected text
    if(!window.getSelection().isCollapsed && !force) return

// Needs work to be valid with translations
    if(wordNum === this.state.wordNum) {
      this.setState({ wordNum: null })
      
    } else {
      restoreCache()
      this.setState({ wordNum })
    }
  }

  render() {
    const { options, show, back, style } = this.props 
    const { showSearchView, wordNum: wordNumInState } = this.state
    const { versions } = options

    if(!versions) return null

    const oneDayInTheFuture = Date.now() + (1000 * 60 * 60 * 24)
    const oneWeekInTheFuture = Date.now() + (1000 * 60 * 60 * 24 * 7)

    return (
      <View
        show={show}
        style={style}
      >
        <SmartQueries
          query={versionInfoQuery}
          querySets={this.getVersionInfoQuerySets()}
          staleTime={oneDayInTheFuture}
        >
          {({ queryVarSets, isAllLoaded }) => {

            if(!isAllLoaded()) return <Progress />

            const { commonRef, origLangAndLXXVerseIds, tagSetIds, hasMisallignment } = this.getVerseAndTagSetQueryVars(queryVarSets)

            return (
              <React.Fragment>
                <Bar
                  back={back}
                  title={
                    <div>
                      {getPassageStr(commonRef)}
                      {hasMisallignment &&
                        <span>TODO: Icon</span>
                      }
                    </div>
                  }
                >
                  {/* <SwitchButtons
                    selectedId={mode}
                    setSelectedId={mode => this.setState({ mode })}
                  >
                    <SwitchButton id="separate">
                      <DoubleLine />
                    </SwitchButton>
                    <SwitchButton id="greekBased">
                      <div>
                        <SwitchButtonText
                          style={{
                            textTransform: 'none',
                          }}
                        >{i18n("Greek")}</SwitchButtonText>
                        <DashedLine />
                      </div>
                    </SwitchButton>
                    <SwitchButton id="translationBased">
                      <div>
                        <SwitchButtonText>ESV</SwitchButtonText>
                        <DashedLine />
                      </div>
                    </SwitchButton>
                  </SwitchButtons> */}
                </Bar>
                <SmartQueries
                  query={verseQuery}
                  querySets={origLangAndLXXVerseIds.map(id => ({
                    variables: { id },
                    cacheKey: `Verse:${id}`,
                  }))}
                  staleTime={oneWeekInTheFuture}
                >
                  {verseData => (
                    
                    <SmartQueries
                      query={tagSetQuery}
                      querySets={tagSetIds.map(id => ({
                        variables: { id },
                        cacheKey: `TagSet:${id}`,
                      }))}
                      staleTime={oneDayInTheFuture}
                    >
                      {tagSetData => {

                        if(!verseData.isAllLoaded() || !tagSetData.isAllLoaded()) return <Progress />

                        console.log('verseData.queryVarSets', verseData.queryVarSets)
                        console.log('tagSetData.queryVarSets', tagSetData.queryVarSets)

                        return null

                          {/* // prep translations
                          // strip usfm out to make plain text
                          // splits translations
                          // convert translations to usfm

                        // verses
                        //     id
                        //       0010101-wlc
                        //     pieces
                        //       parts
                        //         ["in", "the", "beginning"]
                        //       attributes
                        //         ["x-morph", "strong"]


                        let wordNum = wordNumInState

                        if(verse && wordNum) {
                          const versePieces = verse && usfmToJSON(verse.usfm)
                          const numWords = versePieces.filter(verseWord => verseWord.parts).length

                          if(wordNum < 1 || wordNum > numWords) {
                            wordNum = null
                          }

                        }

                        const versePieces = verse && usfmToJSON(verse.usfm)

            // selectedWordInOriginal={selectedWordInOriginal}  // { bookId, chapter, verse, wordNum }
            // semiSelectedWordsInOriginal={semiSelectedWordsInOriginal}  // { bookId, chapter, verse, wordNums }

            // make verses partial verses where need be

                        let selectedWordInfo = null
                        if(versePieces && wordNum !== null) {
                          let wNum = 1
                          versePieces.some(verseWord => {
                            if(verseWord.parts && wordNum === wNum++) {
                              selectedWordInfo = verseWord
                              return true
                            }
                            return false
                          })
                        }

                        // const verses = versePieces ? [{ id: verse.id, pieces: versePieces }] : []
                        const verses = versePieces ? [{ id: verse.id, pieces: versePieces }] : null

                        // ;((options && options.versions) || []).forEach(version => {
                        //   if(!origLangAndLXXVersions[version.versionId]) {
                        //     verses.push({
                        //       id: `${formLoc(version.ref)}-${version.versionId}`,
                        //       pieces: [ version.plaintext ],
                        //     })
                        //   }
                        // })

                        return (
                          <React.Fragment>
                            <Parallel
                              verses={verses}  // TODO
                              wordNum={wordNum}
                              //boundsVersionId={versions[0].id}  // will base the bounds of the text off the full verse in this version
                              //verses={verses}  // already made partial verses where need be
                              //selectedWordInOriginal={selectedWordInOriginal}  // { bookId, chapter, verse, wordNum }
                              //semiSelectedWordsInOriginal={semiSelectedWordsInOriginal}  // { bookId, chapter, verse, wordNums }
                              updateWordNum={this.updateWordNum}
                            />
                            {wordNum !== null &&
                              <Entry
                                selectedWordInfo={selectedWordInfo}
                              />
                            }
                          </React.Fragment>
                        ) */}
                      }}
                    </SmartQueries>
                  )}
                </SmartQueries>
                <SearchView
                  options={options}
                  show={showSearchView}
                  back={this.hideSearchView}
                />
              </React.Fragment>
            )
          }}
        </SmartQueries>
      </View>
    )
  }

}

export default CompareView