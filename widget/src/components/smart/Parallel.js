import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import { CircularProgress } from 'material-ui/Progress';

import ParallelText from './ParallelText'
import ParallelComposite from './ParallelComposite'
import ParallelHeader from '../basic/ParallelHeader'
import { getVersionStr, getMainWordPartIndex, getGrammarColor } from '../../utils/helperFunctions.js'

// import createCourse from '../../data/mutations/createCourse'

const ParallelContainer = styled.div`
  padding-bottom: 15px;
`

const ParallelGroup = styled.div`
`

const Word = styled.div`
  display: inline-block;
  cursor: pointer;
`

const SelectedWord = styled.div`
  display: inline-block;
  color: black;
`

const CircularProgressCont = styled.div`
  text-align: center;
  padding: 20px 0 10px;
`

class Parallel extends React.Component {

  render() {
    const { verses, wordNum, updateWordNum } = this.props 

    let wNum = 1

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

                      const mainPartIdx = getMainWordPartIndex(piece.parts)
                      const morphParts = (piece.attributes['x-morph'] || "").substr(1).split('/')

                      return (
                        <WordSpan
                          key={idx}
                          onClick={updateWordNum.bind(this, thisWNum)}
                        >
                          {
                            piece.parts.map((wordPart, wpIndex) => {

                              const isPrefixOrSuffix = wpIndex !== mainPartIdx
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
            <CircularProgressCont>
              <CircularProgress />
            </CircularProgressCont>
          )
        }
      </ParallelContainer>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(Parallel)