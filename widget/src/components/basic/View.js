import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import Transition from 'react-transition-group/Transition'

const duration = 200

const transitionStyles = {
  entering: { bottom: 0, opacity: 1, transform: 'none' },
  entered:  { bottom: 0, opacity: 1, transform: 'none' },
  exiting:  { bottom: 0, opacity: 0, transform: 'translateX(50px)' },
  exited:  { bottom: 'auto', opacity: 0, transform: 'translateX(50px)' },
}

const ViewCont = styled.div`
  transition: opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: white;
`

class View extends React.Component {

  render() {
    const { show, children } = this.props 

    return (
      <Transition
        in={show}
        timeout={duration}
      >
        {transitionState => (
          <ViewCont style={{
            ...transitionStyles[transitionState]
          }}>
            {transitionState!='exited' && children}
          </ViewCont>
        )}
      </Transition>
    )
  }

}

export default View