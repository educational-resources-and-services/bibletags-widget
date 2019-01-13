import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { getVersionStr, getPassageStr, getMainWordPartIndex,
         getIsEntirelyPrefixAndSuffix, getOrigLangAndLXXVersionInfo } from '../../utils/helperFunctions.js'
import { getGrammarColor } from '../../utils/hebrewMorph.js'

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

const VersionPassageStr = styled.span`
  font-weight: bold;
  color: black;
`

const getWordText = ({ wordPiece, idx }) => {
  const { text, children, tag } = wordPiece

  if(text && !tag) return text

  return (
    <span
      key={idx}
      {...getCSSFormatting(wordPiece)}
    >
      {text || children.map((child, idx) => getWordText({ wordPiece: child, idx }))}
    </span>
  )
}

const getCSSFormatting = piece => {
  const tag = (piece.tag || "").replace(/^\+/, '')

  const tagToStyles = {
    nd: {
      fontVariant: "small-caps",
    },
    em: {
      fontStyle: "italic",
    },
    bd: {
      fontWeight: "bold",
    },
    it: {
      fontStyle: "italic",
    },
    bdit: {
      fontWeight: "bold",
      fontStyle: "italic",
    },
    no: {
      fontVariant: "normal",
      fontStyle: "normal",
      fontWeight: "normal",
      verticalAlign: "baseline",
    },
    sc: {
      fontVariant: "small-caps",
    },
    sup: {
      fontSize: ".83em",
      position: "relative",
      top: "-0.3em",
    },
  }

  return tagToStyles[tag] ? { style: tagToStyles[tag] } : {}
}

class Parallel extends React.Component {

  getOriginalhebWord = ({ word, versionId, wordLoc, isSelected, isSemiSelected }) => {
    const { updateWordLoc } = this.props

    const { text } = word
    const WordSpan = isSelected ? SelectedWord : (isSemiSelected ? SemiSelectedWord : Word)

    const isEntirelyPrefixAndSuffix = getIsEntirelyPrefixAndSuffix(word)
    const morph = word.morph
    const morphParts = (morph && morph.substr(3).split(':')) || [""]
    const mainPartIdx = getMainWordPartIndex(morphParts)

    return (
      <WordSpan
        key={wordLoc}
        onClick={updateWordLoc.bind(this, { versionId, wordLoc })}
      >
        {
          text.split('​').map((wordPart, wpIndex) => {  // There is a zero width space in the ''

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

  getOriginalgrcWord = ({ word, versionId, wordLoc, isSelected, isSemiSelected }) => {
    const { updateWordLoc } = this.props

    const { text } = word
    const WordSpan = isSelected ? SelectedWord : (isSemiSelected ? SemiSelectedWord : Word)

    return (
      <WordSpan
        key={wordLoc}
        onClick={updateWordLoc.bind(this, { versionId, wordLoc })}
      >
        {text}
      </WordSpan>
    )
  }

  getTranslationWord = ({ word, versionId, wordLoc, isSelected }) => {
    const { updateWordLoc } = this.props
    const WordSpan = isSelected ? SelectedWord : Word

    return (
      <WordSpan
        key={wordLoc}
        onClick={updateWordLoc.bind(this, { versionId, wordLoc })}
        {...getCSSFormatting(word)}
      >
        {getWordText({ wordPiece: word })}
      </WordSpan>
    )
  }

  getJSXFromPieces = params => {
    const { versionInfo } = this.props
    const { versionId, loc, pieces, wordRanges, selectedWordLocs, semiSelectedWordLocs } = params

    const thisVersionInfo = versionInfo[versionId]
    const wordRangeArrays = wordRanges && wordRanges.map(wordRange => (
      wordRange.split('-').map(wordRangeInt => (
        wordRangeInt === "1" ? 0 : parseInt(wordRangeInt || 1000, 10)
      ))
    ))

    let wordNum = 1

    return pieces.map((piece, idx) => {
      const { type, text, children } = piece

      if(children) {
        return (
          <span
            key={idx}
            {...getCSSFormatting(piece)}
          >
            {this.getJSXFromPieces({
              ...params,
              pieces: children,
            })}
          </span>
        )

      } else if(  // we are outside of wordRanges
        wordRangeArrays
        && !wordRangeArrays.some(wordRangeArray => (
          (
            wordNum > wordRangeArray[0]
            || (
              wordNum === wordRangeArray[0]
              && type === "word"
            )
          )
          && wordNum <= wordRangeArray[1]
        ))
      ) {
        if(type === "word") wordNum++
        return null

      } else if(type === "word") {
        const wordLoc = `${loc}:${wordNum++}`
        const isSelected = selectedWordLocs.includes(wordLoc)
        const isSemiSelected = semiSelectedWordLocs.includes(wordLoc)

        const componentGroup = [
          this[thisVersionInfo.isOriginal ? `getOriginal${thisVersionInfo.languageId}Word` : `getTranslationWord`]({
            word: piece,
            versionId,
            wordLoc,
            isSelected,
            isSemiSelected,
          })
        ]

        if(wordRangeArrays && wordRangeArrays.some(wordRangeArray => (
          wordNum-1 === wordRangeArray[0]
        ))) {
          componentGroup.unshift(
            <span key={idx}>{i18n("…", {}, "ellipsis")}</span>
          )
        }

        if(wordRangeArrays && wordRangeArrays.some((wordRangeArray, wordRangeArrayIndex) => (
          wordNum-1 === wordRangeArray[1]
          && wordRangeArrayIndex === wordRangeArrays.length-1
        ))) {
          componentGroup.push(
            <span key={idx}>{i18n("…", {}, "ellipsis")}</span>
          )
        }

        return componentGroup

      } else if(text) {
        return (
          <span
            key={idx}
            {...getCSSFormatting(piece)}
          >
            {text}
          </span>
        )

      } else {
        return null
      }
    })
  }

  getJSXFromRefs = ({ refs, ...otherProps }) => {
    return refs.map(({ pieces, loc, wordRanges }, idx) => {
      return (
        <React.Fragment key={idx}>
          {this.getJSXFromPieces({ pieces, loc, wordRanges, ...otherProps })}
        </React.Fragment>
      )
    })
  }

  getJSXFromVersions = () => {
    const { versions, originalLanguageWordLoc, versionInfo, hasMisalignment } = this.props 

    return versions.map(({ id: versionId, refs }) => {
      const selectedWordLocs = getOrigLangAndLXXVersionInfo()[versionId] && originalLanguageWordLoc
        ? [originalLanguageWordLoc]
        : []
      const semiSelectedWordLocs = []

      const headings = [
        <span key="primary">
          {getVersionStr(versionId)}
          {hasMisalignment &&
            <React.Fragment>
              {i18n(" ", {}, "word separator")}
              <VersionPassageStr>
                {getPassageStr({ refs, skipBookName: true })}
              </VersionPassageStr>
            </React.Fragment>
          }
        </span>
      ]
  
      return (
        <ParallelGroup key={versionId}>
          <ParallelHeader
            headings={headings}
          />
          <ParallelText
            languageId={versionInfo[versionId].languageId}
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