import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import Word from '../basic/Word'
import CompareView from '../views/CompareView'

// import createCourse from '../../data/mutations/createCourse'

const Verse = styled.div`
  font-size: 20px;
  line-height: 1.4;
  padding: 15px 15px 0;
`

class ParallelText extends React.Component {

  state = {
  }
  
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //   }
  // }

  render() {
    const { children, lang, style } = this.props 
    const { something2 } = this.state 

    return (
      <Verse
        style={{
          ...(lang === 'he' ? { direction: 'rtl' } : {}),
          ...style,
        }}
      >
        {children}
      </Verse>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(ParallelText)