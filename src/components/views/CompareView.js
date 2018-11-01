import React from 'react'
// import i18n from '../../utils/i18n.js'
// import styled from 'styled-components'
import { restoreCache } from '../smart/Apollo'

import SmartQuery from '../smart/SmartQuery'
import View from '../basic/View'
import Bar from '../basic/Bar'
// import SwitchButtons from '../basic/SwitchButtons'
// import SwitchButton from '../basic/SwitchButton'
import Parallel from '../smart/Parallel'
import Entry from '../smart/Entry'
import SearchView from './SearchView'
import { formLoc, getPassageStr, usfmToJSON } from '../../utils/helperFunctions.js'

import verseQuery from '../../data/queries/verse'

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

  static getDerivedStateFromProps({ options }, { wordNum }) {
    let returnVal = null

    if(wordNum === null && options) {
      ;(options.versions || []).some(version => {
        if(typeof version.wordNum === 'number') {
          returnVal = {
            wordNum: version.wordNum,
          }
        }
        return returnVal
      })
    }

    return returnVal
  }

  hideSearchView = () => this.setState({ showSearchView: false })
  
  updateWordNum = ({ wordNum, force }) => {
    // Do not count it as a click if they have selected text
    if(!window.getSelection().isCollapsed && !force) return

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
    // const { showSearchView, mode, wordNum } = this.state

    const firstVersionObj = options && options.versions && options.versions[0]
    const verseMisallignmentInfo = false
    // const verseMisallignmentInfo = firstVersionObj ? {
    //   bookId: firstVersionObj.bookId,
    //   chapter: firstVersionObj.chapter,
    // } : false

    if(!options || !(options.versions || []).length) return null

    const verseId = `${formLoc(options.versions[0])}-${options.versions[0].versionId}`

    return (
      <View
        show={show}
        style={style}
      >
        <Bar
          back={back}
          title={verseMisallignmentInfo
            ?
              <div>
                {getPassageStr(verseMisallignmentInfo)}
                <span>TODO: Icon</span>
              </div>
            :
              (firstVersionObj && getPassageStr(firstVersionObj))
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
        <SmartQuery
            query={verseQuery}
            variables={{ id: verseId }}
        >
          {({ data: { verse } }) => {

            let wordNum = wordNumInState

            if(verse && wordNum) {
              const versePieces = verse && usfmToJSON(verse.usfm)
              const numWords = versePieces.filter(verseWord => verseWord.parts).length

              if(wordNum < 1 || wordNum > numWords) {
                wordNum = null
              }

            }

            const versePieces = verse && usfmToJSON(verse.usfm)

            let wordInfo = null
            if(versePieces && wordNum !== null) {
              let wNum = 1
              versePieces.some(verseWord => {
                if(verseWord.parts && wordNum === wNum++) {
                  wordInfo = verseWord
                  return true
                }
                return false
              })
            }

            const verses = versePieces ? [{ id: verse.id, pieces: versePieces }] : null

            return (
              <React.Fragment>
                <Parallel
                  verses={verses}  // TODO
                  wordNum={wordNum}
                  updateWordNum={this.updateWordNum}
                />
                {wordNum !== null &&
                  <Entry
                    wordInfo={wordInfo}
                  />
                }
              </React.Fragment>
            )
          }}
        </SmartQuery>
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