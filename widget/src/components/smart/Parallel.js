import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import { CircularProgress } from 'material-ui/Progress';

import ParallelText from './ParallelText'
import ParallelComposite from './ParallelComposite'
import ParallelHeader from '../basic/ParallelHeader'
import { getVersionStr } from '../../utils/helperFunctions.js'

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
    const { verses, wordIndex, updateWordIndex } = this.props 

    let wIndex = 0

    return (
      <ParallelContainer>
        {verses
          ? (
            verses.map(verse => (
              <ParallelGroup key={verse.id}>
                <ParallelHeader
                  primary={getVersionStr(verse.id.split('-')[1])}
                />
                <ParallelText
                  lang="he"
                  style={ wordIndex !== null ? { color: '#CCC' } : null }
                >
                  {verse.usfm.split(/(\\w .*?\\w\*)/g).filter(piece => piece !== '').map((piece, idx) => {
                    if(piece.match(/^\\w .*?\\w\*$/)) {
                      const thisWIndex = ++wIndex
                      const WordSpan = wordIndex === thisWIndex ? SelectedWord : Word
                      return (
                        <WordSpan
                          key={idx}
                          onClick={updateWordIndex.bind(this, thisWIndex)}
                        >
                          {
                            piece
                              .replace(/^\\w ([^|]*?)(?:\|.*?)?\\w\*$/, '$1')
                              .split(/\//g)
                              .map((wordPart, wpIndex) => (
                                <span key={wpIndex}>{wordPart}</span>
                              ))
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