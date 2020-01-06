import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { getMorphPartDisplayInfo } from '../../utils/helperFunctions.js'

const ParsingContainer = styled.div`
  padding: 10px 15px 15px;
  font-size: 14px;
`

const ParsingPart = styled.span`
  /* display: inline-block; */
`

const Plus = styled.span`
  color: black;
`

class Parsing extends React.Component {
  render() {
    let { morphLang, morphParts, mainPartIdx, isEntirelyPrefixAndSuffix } = this.props 

    if(!morphParts) return null

    return (
      <ParsingContainer>
        {morphParts.map((morphPart, idx) => {

          const isPrefixOrSuffix = isEntirelyPrefixAndSuffix || idx !== mainPartIdx
          const wordIsMultiPart = morphParts.length > 1
          const { str, color } = getMorphPartDisplayInfo({ morphLang, morphPart, isPrefixOrSuffix, wordIsMultiPart })

          return (
            <ParsingPart
              key={idx}
              style={{ color }}
            >
              {idx > 0 && (
                <Plus>{i18n(" + ", "combination character")}</Plus>
              )}
              {str}
            </ParsingPart>
          )

        })}
      </ParsingContainer>
    )
  }

}

export default Parsing