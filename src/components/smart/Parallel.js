import React from 'react'
// import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { getVersionStr, getMainWordPartIndex,
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
  const { tag } = piece

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
    const morphParts = (morph && morph.substr(1).split('/')) || [""]
    const mainPartIdx = getMainWordPartIndex(morphParts)

    return (
      <WordSpan
        key={wordLoc}
        onClick={updateWordLoc.bind(this, { versionId, wordLoc })}
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
  //   const { updateWordLoc } = this.props
  //   const WordSpan = isSelected ? SelectedWord : (isSemiSelected ? SemiSelectedWord : Word)

  //   return (
  //     <WordSpan
  //       key={idx}
  //       onClick={updateWordLoc.bind(this, { versionId, wordLoc })}
  //     >
  //       {word}
  //     </WordSpan>
  //   )
  // }

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
    const { versionId, loc, pieces, selectedWordLocs, semiSelectedWordLocs } = params

    const thisVersionInfo = versionInfo[versionId]
    let wordNum = 1

    return pieces.map((piece, idx) => {
      const { type, text, children } = piece

      if(type === "word") {
        const wordLoc = `${loc}:${wordNum++}`
        const isSelected = selectedWordLocs.includes(wordLoc)
        const isSemiSelected = semiSelectedWordLocs.includes(wordLoc)

        return this[thisVersionInfo.isOriginal ? `getOriginal${thisVersionInfo.language}Word` : `getTranslationWord`]({
          word: piece,
          versionId,
          wordLoc,
          isSelected,
          isSemiSelected,
        })

      } else if(text) {
        return (
          <span
            key={idx}
            {...getCSSFormatting(piece)}
          >
            {text}
          </span>
        )

      } else if(children) {
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
    const { versions, originalLanguageWordLoc, versionInfo } = this.props 

    return versions.map(({ id: versionId, refs }) => {
      const selectedWordLocs = getOrigLangAndLXXVersionInfo()[versionId] && originalLanguageWordLoc
        ? [originalLanguageWordLoc]
        : []
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