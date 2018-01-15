import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'
import ArrowDropUpIcon from 'material-ui-icons/ArrowDropUp'

import Morph from '../basic/Morph'
import Parsing from '../basic/Parsing'
import EntrySection from '../basic/EntrySection'
import EntryWord from '../basic/EntryWord'
import EntryDetails from '../basic/EntryDetails'
import EntryHits from '../basic/EntryHits'
import EntrySimilar from '../basic/EntrySimilar'

// import createCourse from '../../data/mutations/createCourse'

const EntrySections = styled.div`
  display: flex;
  flex-direction: row;
`

const LeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const IconContainer = styled.div`
  position: absolute;
  width: 100%;
  z-index: 1;
  text-align: center;
`

const IconButtonStyled = styled(IconButton)`
  position: absolute !important;
  width: 24px !important;
  height: 24px !important;
  top: -10px !important;
  margin-left: -12px !important;
  background-color: #333 !important;
  color: white !important;
`

class Entry extends React.Component {

  state = {
  }
  
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //   }
  // }

  render() {
    const { wordInfo, closeWord } = this.props 
    const { something2 } = this.state 

    return (
      <div>
        <Parsing
          morph={wordInfo.attributes['x-morph']}
        />
        <EntrySections>
          <IconContainer>
            <IconButtonStyled
              aria-label="Minimize"
              onTouchTap={closeWord}
            >
              <ArrowDropUpIcon />
            </IconButtonStyled>
          </IconContainer>
          <LeftSide>
            <EntrySection bg="#BBB">
              <EntryWord />
              <EntryDetails />
            </EntrySection>
            {/* <EntrySection bg="#EEE" style={{ flex: 1, paddingBottom: 45 }}>
              <EntrySimilar />
            </EntrySection> */}
          </LeftSide>
          {/* <EntrySection  bg="#DDD">
            <EntryHits />
          </EntrySection> */}
        </EntrySections>
      </div>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(Entry)