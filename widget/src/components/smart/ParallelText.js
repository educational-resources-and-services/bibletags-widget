import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import Word from '../basic/Word'
import CompareView from '../views/CompareView'

// import createCourse from '../../data/mutations/createCourse'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class ParallelText extends React.Component {

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
)(ParallelText)