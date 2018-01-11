import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import ParallelText from './ParallelText'
import ParallelComposite from './ParallelComposite'
import ParallelHeader from '../basic/ParallelHeader'

// import createCourse from '../../data/mutations/createCourse'

const ParallelContainer = styled.div`
  padding: 15px;
`

class Parallel extends React.Component {

  render() {
    const { verse, wordIndex, updateWordIndex } = this.props 

    let wIndex = 0

    return (
      <ParallelContainer>
        {verse.usfm.split(/(\\w .*?\\w\*)/g).filter(piece => piece!='').map((piece, idx) => {
          if(piece.match(/^\\w .*?\\w\*$/)) {
            return (
              <span
                key={idx}
                onClick={updateWordIndex.bind(this, ++wIndex)}
              >
                {
                  piece
                    .replace(/^\\w ([^\|]*?)(?:\|.*?)?\\w\*$/, '$1')
                    .split(/\//g)
                    .map((wordPart, wpIndex) => (
                      <span key={wpIndex}>{wordPart}</span>
                    ))
                }
              </span>
            )
          } else {
            return piece
          }
        })}
      </ParallelContainer>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(Parallel)