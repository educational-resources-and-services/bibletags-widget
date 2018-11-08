import React from 'react'
import styled from 'styled-components'
import i18n from '../../utils/i18n.js'
import { origLanguages } from '../../utils/helperFunctions.js'

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

const InviteAction = styled.span`
  text-decoration: underline;
  cursor: pointer;
`

class Word extends React.Component {
  render() {
    const { language } = this.props 

    return (
      <BoxContainer>
        <Box>
          <InfoLine>{i18n("Verse not yet tagged.")}</InfoLine>
          <InviteLine>
            {i18n("Know {{language}}? ", { language: origLanguages[language] })}
            <InviteAction
              onClick={() => alert('go tag')}
            >
              {i18n("Tag this verse")}
            </InviteAction>
          </InviteLine>
        </Box>
      </BoxContainer>
    )
  }

}

export default Word