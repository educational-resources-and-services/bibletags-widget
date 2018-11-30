import React from 'react'
// import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

// import Word from '../basic/Word'
// import CompareView from '../views/CompareView'

// import createCourse from '../../data/mutations/createCourse'

const Verse = styled.div`
  font-size: 20px;
  line-height: 1.5;
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
    const { children, languageId, style } = this.props 
    // const { something2 } = this.state 

    return (
      <Verse
        className={`${languageId}Font`}
        style={{
          ...(languageId === 'heb' ? { direction: 'rtl' } : {}),
          ...style,
        }}
      >
        {children}
      </Verse>
    )
  }

}

export default ParallelText