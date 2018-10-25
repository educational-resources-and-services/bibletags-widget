import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

import { getMainWordPartIndex, getMorphPartDisplayInfo } from '../../utils/helperFunctions.js'

const ParsingContainer = styled.div`
  padding: 10px 15px 15px;
  font-size: 14px;
`

const ParsingPart = styled.span`
  /* display: inline-block; */
`

const Plus = styled.span`
  display: inline-block;
  color: black;
  margin: 0 3px;
`

class Parsing extends React.Component {
  render() {
    let { morph, isEntirelyPrefixAndSuffix } = this.props 

    if(!morph) return null

    const lang = morph.substr(0,1)
    const morphParts = morph.substr(1).split('/')
    const mainPartIdx = getMainWordPartIndex(morphParts)

    return (
      <ParsingContainer>
        {morphParts.map((morphPart, idx) => {

          const isPrefixOrSuffix = isEntirelyPrefixAndSuffix || idx !== mainPartIdx
          const wordIsMultiPart = morphParts.length > 1
          const { str, color } = getMorphPartDisplayInfo({ lang, morphPart, isPrefixOrSuffix, wordIsMultiPart })

          return (
            <ParsingPart
              key={idx}
              style={{ color }}
            >
              {idx > 0 && (
                <Plus>{i18n("+", {}, "", "grammar")}</Plus>
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