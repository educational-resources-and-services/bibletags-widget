import React from 'react'
import styled from 'styled-components'

import CircularProgress from '@material-ui/core/CircularProgress'

const CircularProgressCont = styled.div`
  text-align: center;
  padding: 20px 0;
`

class Progress extends React.Component {

  render() {
    const { style, containterStyle } = this.props

    return (
      <CircularProgressCont style={containterStyle}>
        <CircularProgress style={style} />
      </CircularProgressCont>
    )
  }

}

export default Progress