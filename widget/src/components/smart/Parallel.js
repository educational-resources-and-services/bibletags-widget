import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import ParallelText from './ParallelText'
import ParallelComposite from './ParallelComposite'
import ParallelHeader from '../basic/ParallelHeader'

// import createCourse from '../../data/mutations/createCourse'

const Word = styled.div`
  display: inline-block;
  cursor: pointer;
`

const SelectedWord = styled.div`
  display: inline-block;
  color: black;
`

class Parallel extends React.Component {

  render() {
    const { verse, wordIndex, updateWordIndex } = this.props 

    let wIndex = 0

    return (
      <div>
        <ParallelHeader
          primary="Hebrew (OSHB)"
          secondary="ESV"
        />
        <ParallelText
          lang="he"
          style={ wordIndex !== null ? { color: '#CCC' } : null }
        >
          {verse.usfm.split(/(\\w .*?\\w\*)/g).filter(piece => piece!='').map((piece, idx) => {
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
                      .replace(/^\\w ([^\|]*?)(?:\|.*?)?\\w\*$/, '$1')
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
      </div>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(Parallel)