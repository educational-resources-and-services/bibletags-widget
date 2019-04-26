import React from 'react'
import styled from 'styled-components'
import i18n from '../../utils/i18n.js'
import { getOrigLanguageText } from '../../utils/helperFunctions.js'

import LinkLikeSpan from './LinkLikeSpan'

const BoxContainer = styled.div`
  text-align: center;
  padding: 0 15px 15px;
  margin-bottom: -10px;
`

const Box = styled.div`
  display: inline-block;
  background: #EEE;
  font-size: 12px;
  padding: 10px 15px;
`

const InfoLine = styled.div`
  margin-bottom: 3px;
`

const InviteLine = styled.div`
  color: rgba(0, 0, 0, 0.5);
`

class Word extends React.Component {
  render() {
    const { languageId, showTagView } = this.props 

    return (
      <BoxContainer>
        <Box>
          <InfoLine>{i18n("Verse not yet tagged.")}</InfoLine>
          <InviteLine>
            {i18n("Know {{language}}? ", { language: getOrigLanguageText(languageId) })}
            <LinkLikeSpan
              onClick={showTagView}
            >
              {i18n("Tag this verse")}
            </LinkLikeSpan>
          </InviteLine>
        </Box>
      </BoxContainer>
    )
  }

}

export default Word