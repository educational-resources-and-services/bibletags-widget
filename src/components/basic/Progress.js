import React from 'react'
import { stripProps } from '../../utils/helperFunctions.js'
import styled from 'styled-components'

import CircularProgress from '@material-ui/core/CircularProgress'

const CircularProgressCont = styled(stripProps('div', ['cover']))`
  text-align: center;
  padding: 20px 0;

  ${({ cover }) => !cover ? `` : `
    position: absolute;
    top: 48px;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255,255,255,.7);
    line-height: calc(100vh - 68px);
  `}
`

class Progress extends React.Component {

  render() {
    const { style, containterStyle, cover } = this.props

    return (
      <CircularProgressCont style={containterStyle} cover={cover}>
        <CircularProgress style={style} />
      </CircularProgressCont>
    )
  }

}

export default Progress