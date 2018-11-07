import React from 'react'
// import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { getVersionStr, getMainWordPartIndex, getGrammarColor,
         getIsEntirelyPrefixAndSuffix } from '../../utils/helperFunctions.js'

import ParallelText from './ParallelText'
// import ParallelComposite from './ParallelComposite'
import ParallelHeader from '../basic/ParallelHeader'
import Progress from '../basic/Progress'

// import createCourse from '../../data/mutations/createCourse'

const ParallelContainer = styled.div`
  padding-bottom: 15px;
`

const ParallelGroup = styled.div`
`

const Word = styled.span`
  cursor: pointer;
`

const SelectedWord = styled.span`
  cursor: pointer;
  color: black;
`

const SemiSelectedWord = styled.span`
  cursor: pointer;
  color: #777;
`

const getWordText = word => {
  const { text, children } = word
  return text || children.map(child => getWordText(child)).join("")
}



class Parallel extends React.Component {

  getOriginalhebWord = ({ word, versionId, loc, wordNum, isSelected, isSemiSelected }) => {
    const { updateWordNum } = this.props

    const { text } = word
    const WordSpan = isSelected ? SelectedWord : (isSemiSelected ? SemiSelectedWord : Word)

    const isEntirelyPrefixAndSuffix = getIsEntirelyPrefixAndSuffix(word)
    const morph = word.morph
    const morphParts = (morph && morph.substr(1).split('/')) || [""]
    const mainPartIdx = getMainWordPartIndex(morphParts)

    return (
      <WordSpan
        key={`${loc}:${wordNum}`}
        onClick={updateWordNum.bind(this, { versionId, loc, wordNum })}
      >
        {
          text.split('/').map((wordPart, wpIndex) => {

            const isPrefixOrSuffix = isEntirelyPrefixAndSuffix || wpIndex !== mainPartIdx
            const color = isSelected && getGrammarColor({ isPrefixOrSuffix, morphPart: morphParts[wpIndex] })

            return (
              <span
                key={wpIndex}
                style={{ color }}
              >
                {wordPart}
              </span>
            )
          })
        }
      </WordSpan>
    )
  }

  // getOriginalgrcWord = word => {
  //   const { updateWordNum } = this.props
  //   const WordSpan = wordNum === thisWordNum ? SelectedWord : Word

  //   return (
  //     <WordSpan
  //       key={idx}
  //       onClick={updateWordNum.bind(this, { versionId, loc, wordNum })}
  //     >
  //       {word}
  //     </WordSpan>
  //   )
  // }

  getTranslationWord = ({ word, versionId, loc, wordNum, isSelected }) => {
    const { updateWordNum } = this.props
    const WordSpan = isSelected ? SelectedWord : Word

    return (
      <WordSpan
        key={`${loc}:${wordNum}`}
        onClick={updateWordNum.bind(this, { versionId, loc, wordNum })}
      >
        {getWordText(word)}
      </WordSpan>
    )
  }

  getJSXFromPieces = params => {
    const { versionInfo } = this.props
    const { versionId, loc, pieces, selectedWordLocs, semiSelectedWordLocs } = params

    const thisVersionInfo = versionInfo[versionId]
    let wordNum = 1

    return pieces.map((piece, idx) => {
      const { type, text, children } = piece

      if(type === "word") {
        wordNum++
        const isSelected = selectedWordLocs.includes(wordNum)
        const isSemiSelected = semiSelectedWordLocs.includes(wordNum)

        return this[thisVersionInfo.isOriginal ? `getOriginal${thisVersionInfo.language}Word` : `getTranslationWord`]({
          word: piece,
          versionId,
          loc,
          wordNum,
          isSelected,
          isSemiSelected,
        })

      } else if(text) {
        return (
          <span key={idx}>{text}</span>
        )

      } else if(children) {
        return (
          <span key={idx}>
            {this.getJSXFromPieces({
              ...params,
              pieces: children,
            })}
          </span>
        )

      } else {
        return <span key={idx} />
      }
    })
  }

  getJSXFromRefs = ({ refs, ...otherProps }) => {
    return refs.map(({ pieces, loc }, idx) => {
      return (
        <React.Fragment key={idx}>
          {this.getJSXFromPieces({ pieces, loc, ...otherProps })}
        </React.Fragment>
      )
    })
  }

  getJSXFromVersions = () => {
    const { versions, versionInfo, wordNum } = this.props 

    return versions.map(({ id: versionId, refs }) => {
      const selectedWordLocs = []
      const semiSelectedWordLocs = []
  
      return (
        <ParallelGroup key={versionId}>
          <ParallelHeader
            primary={getVersionStr(versionId)}
          />
          <ParallelText
            language={versionInfo[versionId].language}
            style={ selectedWordLocs.length > 0 ? { color: '#CCC' } : null }
          >
            {this.getJSXFromRefs({ refs, versionId, selectedWordLocs, semiSelectedWordLocs })}
          </ParallelText>
        </ParallelGroup>
      )
    })

  }

  render() {
    const { versions } = this.props 


    return (
      <ParallelContainer>
        {versions
          ? this.getJSXFromVersions()
          : (
            <Progress
              containerStyle={{
                paddingBottom: 10,
              }}
            />
          )
        }
      </ParallelContainer>
    )
  }

}

export default Parallel