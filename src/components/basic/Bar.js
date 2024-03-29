import React from 'react'
import { close } from '../../utils/postMessage.js'
import styled from 'styled-components'

import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import CloseIcon from '@material-ui/icons/Close'

const BarCont = styled.div`
  width: 100%;
  background: #DDD;
  display: flex;
`

const LeftSpace = styled.div`
  width: 15px;
`

const Title = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 48px;
`

class Bar extends React.Component {

  render() {
    const { back, title, children } = this.props 
    // const { back, title, subtitle, children } = this.props 

    return (
      <BarCont>
        {back 
          ? (
            <IconButton
              aria-label="Back"
              onClick={back}
            >
              <ArrowBackIcon />
            </IconButton>
          )
          : (
            <LeftSpace />
          )
        }
        <Title>{title}</Title>
        {children}
        <IconButton
          aria-label="Close"
          onClick={close}
        >
          <CloseIcon />
        </IconButton>
      </BarCont>
    )
  }

}

export default Bar