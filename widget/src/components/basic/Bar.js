import React from 'react'
import i18n from '../../utils/i18n.js'
import { close } from '../../utils/postMessage.js'
import styled from 'styled-components'

import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'
import ArrowBackIcon from 'material-ui-icons/ArrowBack'
import CloseIcon from 'material-ui-icons/Close'

const BarCont = styled.div`
  width: 100%;
  background: #DDD;
  display: flex;
`

const LeftSpace = styled.div`
  width: 20px;
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
    const { back, title, subtitle, children } = this.props 

    return (
      <BarCont>
        {back 
          ? (
            <IconButton
              aria-label="Back"
              onTouchTap={back}
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
          aria-label="Back"
          onTouchTap={close}
        >
          <CloseIcon />
        </IconButton>
      </BarCont>
    )
  }

}

export default Bar