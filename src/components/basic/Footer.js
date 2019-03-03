import React from 'react'
import styled from 'styled-components'
import i18n from '../../utils/i18n'

import InstructionsView from '../views/InstructionsView'
import LoginView from '../views/LoginView'

const LogoLink = styled.a`
  position: absolute;
  left: 0;
  bottom: 0;
  font-size: 12px;
  color: rgba(0,0,0,.4);
  margin: 7px 10px;
  line-height: 16px;
  &:hover {
    color: black;
    cursor: pointer;
  }
`

const Links = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 12px;
  color: rgba(0,0,0,.4);
  margin: 7px 10px;
  line-height: 16px;
`

const FooterAction = styled.span`
  text-decoration: underline;
  ${({ disabled }) =>
    disabled
      ? `
        color: rgba(0,0,0,0.2);
      `
      : `
        &:hover {
          color: black;
          cursor: pointer;
        }
      `
  }
`

class Footer extends React.Component {

  state = {
    showingView: false,
  }

  hideView = () => this.setState({ showingView: false })

  showInstructionsView = () => this.setState({ showingView: 'instructions' })
  
  showLoginView = () => this.setState({ showingView: 'login' })

  render() {
    const { showLinks, disableInstructionsLink } = this.props
    const { showingView } = this.state

    return (
      <React.Fragment>
        <LogoLink href="https://bibletags.org" target="_blank">BibleTags.org</LogoLink>
        {!!showLinks &&
          <Links>
            <FooterAction
              onClick={disableInstructionsLink ? null : this.showInstructionsView}
              disabled={disableInstructionsLink}
            >
              {i18n("Instructions")}
            </FooterAction>
            <span> · </span>
            <FooterAction
              onClick={this.showLoginView}
            >
              {i18n("Login")}
            </FooterAction>
          </Links>
        }
        <InstructionsView
          show={showingView === 'instructions'}
          back={this.hideView}
        />
        <LoginView
          show={showingView === 'login'}
          back={this.hideView}
        />
      </React.Fragment>
    )
  }
}

export default Footer