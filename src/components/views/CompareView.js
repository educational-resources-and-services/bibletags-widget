import React from 'react'
// import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { restoreCache } from '../smart/Apollo'
import { getPassageStr, getOrigLangAndLXXVersionInfo, getOrigLanguageText } from '../../utils/helperFunctions.js'

import CompareData from '../smart/CompareData'
import View from '../basic/View'
import Bar from '../basic/Bar'
import SwitchButtons from '../basic/SwitchButtons'
import SwitchButton from '../basic/SwitchButton'
import Parallel from '../smart/Parallel'
import Entry from '../smart/Entry'
import SearchView from './SearchView'
import NotTagged from '../basic/NotTagged'

const DoubleLine = styled.div`
  width: 20px;
  height: 4px;
  border: 1px solid black;
  border-width: 1px 0;
  .depressed & {
    border-color: white;
  }
`

const SwitchButtonText = styled.div`
  display: block;
  font-size: 9px;
  line-height: 1;
  margin-bottom: 3px;
`

const DashedLine = styled.div`
  display: block;
  width: 100%;
  height: 1px;
  border-top: 1px dashed black;
  .depressed & {
    border-color: white;
  }
`

class CompareView extends React.PureComponent {

  state = {
    showSearchView: false,
    mode: 'separate',
    originalLanguageWordLoc: null,  // in the original
    translationWordLocAndVersionId: null
  }

  static getDerivedStateFromProps({ options }, state) {
    let returnVal = null

// TODO: Needs work to be valid with translations
    // if(state.wordLoc === null && options) {
    //   ;(options.versions || []).some(version => {
    //     const { wordNum } = version.ref || []
    //     if(typeof wordNum === 'number') {
    //       returnVal = {
    //         wordLoc: wordNum ???? ,
    //       }
    //     }
    //     return returnVal
    //   })
    // }

    return returnVal
  }

  hideSearchView = () => this.setState({ showSearchView: false })
  
  calculateOriginalLanguageWordLocFromTranslation = translationWordLocAndVersionId => {
    return null
  }
  
  updateWordLoc = ({ versionId, wordLoc, force }) => {
    // Do not count it as a click if they have selected text
    if(!window.getSelection().isCollapsed && !force) return

    if(!(getOrigLangAndLXXVersionInfo()[versionId] || {}).isOriginal) {
      // They clicked on a translation word and we need to map it to the original
      // language wordLoc.

      wordLoc = this.calculateOriginalLanguageWordLocFromTranslation({
        versionId,
        wordLoc,
      })
    }

    if(wordLoc === this.state.originalLanguageWordLoc) {
      this.setState({
        originalLanguageWordLoc: null,
        translationWordLocAndVersionId: null,
      })
      
    } else {
      restoreCache()
      this.setState({
        originalLanguageWordLoc: wordLoc,
        translationWordLocAndVersionId: null,
      })
    }
  }

  render() {
    const { options, show, back, style } = this.props 
    const { showSearchView, originalLanguageWordLoc, translationWordLocAndVersionId, mode } = this.state
    const { version, multipleVersions } = options

    if(!version && !multipleVersions) return null

    return (
      <View
        show={show}
        style={style}
      >
        <CompareData
          options={options}
          back={back}
        >
          {({
            commonRef,
            hasMisalignment,
            originalLanguageId,
            preppedVersions,
            versionInfo,
            hasIncompleteTags,
          }) => {


            /* let wordNum = wordNumInState

            if(verse && wordNum) {
              const versePieces = verse && usfmToJSON(verse.usfm)
              const numWords = versePieces.filter(verseWord => verseWord.parts).length

              if(wordNum < 1 || wordNum > numWords) {
                wordNum = null
              }

            }

            const versePieces = verse && usfmToJSON(verse.usfm) */

            // selectedWordInOriginal={selectedWordInOriginal}  // { bookId, chapter, verse, wordNum }
            // semiSelectedWordsInOriginal={semiSelectedWordsInOriginal}  // { bookId, chapter, verse, wordNums }

            let calculatedOriginalLanguageWordLoc = originalLanguageWordLoc
            if(!originalLanguageWordLoc && translationWordLocAndVersionId) {
              calculatedOriginalLanguageWordLoc =
                this.calculateOriginalLanguageWordLocFromTranslation(translationWordLocAndVersionId)
            }

            let selectedWordInfo = null
            if(calculatedOriginalLanguageWordLoc) {
              const { loc } = preppedVersions[0].refs[0]
              let wordNum = 1
              preppedVersions[0].refs[0].pieces.some(piece => {
                if(piece.type === "word" && calculatedOriginalLanguageWordLoc === `${loc}:${wordNum++}`) {
                  selectedWordInfo = piece
                  return true
                }
                return false
              })

            }

            /* let selectedWordInfo = null
            if(versePieces && wordNum !== null) {
              let wNum = 1
              versePieces.some(verseWord => {
                if(verseWord.parts && wordNum === wNum++) {
                  selectedWordInfo = verseWord
                  return true
                }
                return false
              })
            } */

            // ;((options && options.versions) || []).forEach(version => {
            //   if(!origLangAndLXXVersionInfo[version.versionId]) {
            //     verses.push({
            //       id: `${getLocFromRef(version.ref)}-${version.versionId}`,
            //       pieces: [ version.plaintext ],
            //     })
            //   }
            // })

            return (
              <React.Fragment>
                <Bar
                  back={back}
                  title={
                    <div>
                      {getPassageStr({ refs: [commonRef] })}
                      {hasMisalignment &&
                        <span>TODO: Icon</span>
                      }
                    </div>
                  }
                >
                  {false &&
                    <SwitchButtons
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
                          >{getOrigLanguageText(originalLanguageId)}</SwitchButtonText>
                          <DashedLine />
                        </div>
                      </SwitchButton>
                      <SwitchButton id="translationBased">
                        <div>
                          <SwitchButtonText>ESV</SwitchButtonText>
                          <DashedLine />
                        </div>
                      </SwitchButton>
                    </SwitchButtons>
                  }
                </Bar>
                <Parallel
                  versions={preppedVersions}
                  versionInfo={versionInfo}
                  originalLanguageWordLoc={calculatedOriginalLanguageWordLoc}
                  updateWordLoc={this.updateWordLoc}
                  hasMisalignment={hasMisalignment}
                />
                {!!(hasIncompleteTags && preppedVersions.length >= 2) &&
                  <NotTagged
                    languageId={originalLanguageId}
                  />
                }
                {!!selectedWordInfo &&
                  <Entry
                    wordInfo={selectedWordInfo}
                    languageId={originalLanguageId}
                  />
                }
              </React.Fragment>
            )
          }}
        </CompareData>
        <SearchView
          options={options}
          show={showSearchView}
          back={this.hideSearchView}
        />
      </View>
    )
  }

}

export default CompareView