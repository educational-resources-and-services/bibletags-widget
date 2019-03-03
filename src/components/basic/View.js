import React from 'react'
import styled from 'styled-components'

// import Logo from './Logo'
import Transition from 'react-transition-group/Transition'

const duration = 200

const hideOverflowStyles = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  overflow: 'hidden',
}

const transitionStylesViewCont = {
  entering: hideOverflowStyles,
  entered: null,
  exiting: hideOverflowStyles,
  exited: null,
}

const transitionStylesViewComponent = {
  entering: { bottom: 0, opacity: 1, transform: 'none' },
  entered:  { bottom: 0, opacity: 1, transform: 'none' },
  exiting:  { bottom: 0, opacity: 0, transform: 'translateX(50px)' },
  exited:  { bottom: 'auto', opacity: 0, transform: 'translateX(50px)' },
}

const ViewCont = styled.div`
`

const ViewComponent = styled.div`
  transition: opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out;
  opacity: 0;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  background: white;
`

class View extends React.Component {

  render() {
    const { show, children, style } = this.props 

    return (
      <Transition
        in={show}
        timeout={duration}
      >
        {transitionState => (
          <ViewCont style={transitionStylesViewCont[transitionState]}>
            <ViewComponent style={{
              ...style,
              ...transitionStylesViewComponent[transitionState],
            }}>
              {transitionState !== 'exited' && children}
            </ViewComponent>
          </ViewCont>
        )}
      </Transition>
    )
  }

}

export default View