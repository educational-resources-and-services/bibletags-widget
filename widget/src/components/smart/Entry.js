import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import Morph from '../basic/Morph'
import EntrySection from '../basic/EntrySection'
import EntryWord from '../basic/EntryWord'
import EntryDetails from '../basic/EntryDetails'
import EntryHits from '../basic/EntryHits'
import EntrySimilar from '../basic/EntrySimilar'

// import createCourse from '../../data/mutations/createCourse'

const Parsing = styled.div`
  padding: 15px 15px 10px;
`

const EntrySections = styled.div`
  display: flex;
  flex-direction: row;
`

const LeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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
    const { something1 } = this.props 
    const { something2 } = this.state 

    return (
      <div>
        <Parsing>qal perfect 3rd masculine singular</Parsing>
        <EntrySections>
          <LeftSide>
            <EntrySection bg="#BBB">
              <EntryWord />
              <EntryDetails />
            </EntrySection>
            <EntrySection bg="#EEE" style={{ flex: 1 }}>
              <EntrySimilar />
            </EntrySection>
          </LeftSide>
          <EntrySection  bg="#DDD">
            <EntryHits />
          </EntrySection>
        </EntrySections>
      </div>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(Entry)