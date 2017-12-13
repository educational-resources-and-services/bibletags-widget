import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

// import TextField from 'material-ui/TextField'
// import Waiting from '../basic/Waiting';

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
      <div />
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(Entry)