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

// const StyledSomething = styled.div`
//   height: 3px;
// `

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
        Entry!
      </div>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(Entry)