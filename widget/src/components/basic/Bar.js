import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

// import TextField from 'material-ui/TextField'
// import Waiting from '../basic/Waiting'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class Bar extends React.Component {

  render() {
    const { children } = this.props 

    return (
      <div>
        {children}
      </div>
    )
  }

}

export default Bar