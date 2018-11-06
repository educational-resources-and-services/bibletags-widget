import React from 'react'
// import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { getVersionStr, getMainWordPartIndex, getGrammarColor, getIsEntirelyPrefixAndSuffix } from '../../utils/helperFunctions.js'

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
  color: black;
`

class Parallel extends React.Component {

  render() {
    const { verses, wordNum, updateWordNum } = this.props 

    let wNum = 1
// ~ is a non-breaking space!
// // can be removed
    return (
      <ParallelContainer>
        {verses
          ? (
            verses.map((verse, idx) => (
              <ParallelGroup key={verse.id}>
                <ParallelHeader
                  primary={getVersionStr(verse.id.split('-')[1])}
                />
                <ParallelText
                  lang="he"
                  style={ wordNum !== null ? { color: '#CCC' } : null }
                >
                  {verse.pieces.map((piece, idx) => {

                    if(piece.parts) {
                      const thisWNum = wNum++
                      const WordSpan = wordNum === thisWNum ? SelectedWord : Word

                      const isEntirelyPrefixAndSuffix = getIsEntirelyPrefixAndSuffix(piece)
                      const morph = piece.attributes['x-morph']
                      const morphParts = (morph && morph.substr(1).split('/')) || [""]
                      const mainPartIdx = getMainWordPartIndex(morphParts)

                      return (
                        <WordSpan
                          key={idx}
                          onClick={updateWordNum.bind(this, { wordNum: thisWNum })}
                        >
                          {
                            piece.parts.map((wordPart, wpIndex) => {

                              const isPrefixOrSuffix = isEntirelyPrefixAndSuffix || wpIndex !== mainPartIdx
                              const color = wordNum === thisWNum && getGrammarColor({ isPrefixOrSuffix, morphPart: morphParts[wpIndex] })

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

                    } else {
                      return piece
                    }

                  })}
                </ParallelText>
              </ParallelGroup>
            ))
          )
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