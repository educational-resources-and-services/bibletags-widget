import React from 'react'
import { Mutation } from "react-apollo"
import i18n from '../../utils/i18n'
import styled from 'styled-components'

import InstructionsView from '../views/InstructionsView'
import LoginView from '../views/LoginView'
import ErrorView from '../views/ErrorView'
import LinkLikeSpan from './LinkLikeSpan'
import Progress from '../basic/Progress'

import logOut from '../../data/mutations/logOut'

const LogoLink = styled.a`
  position: absolute;
  left: 0;
  bottom: 0;
  font-size: 12px;
  margin: 7px 10px;
  line-height: 16px;
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

class Footer extends React.Component {

  state = {
    showingView: false,
    submitting: false,
  }

  hideView = () => this.setState({ showingView: false })

  showInstructionsView = () => this.setState({ showingView: 'instructions' })
  
  showLoginView = () => this.setState({ showingView: 'login' })

  logOut = logOut => () => {
    this.setState({ submitting: true })

    logOut()
      .then(() => {
        this.setState({
          submitting: false,
        })
      })
      .catch(err => {
        this.setState({
          showingView: 'error',
          errorMessage: (err.message || 'Unknown error').replace(/^GraphQL error: /, ''),
          submitting: false,
        })
      })

  }

  render() {
    const { showLinks, disableInstructionsLink } = this.props
    const { showingView, submitting, errorMessage } = this.state

    const loggedIn = false

    return (
      <React.Fragment>
        <LogoLink href="https://bibletags.org" target="_blank">BibleTags.org</LogoLink>
        {!!showLinks &&
          <Links>
            <LinkLikeSpan
              onClick={disableInstructionsLink ? null : this.showInstructionsView}
              disabled={disableInstructionsLink || submitting}
            >
              {i18n("Instructions")}
            </LinkLikeSpan>
            <span> · </span>
            <Mutation mutation={logOut}>
              {logOut => (
                <LinkLikeSpan
                  onClick={loggedIn ? this.logOut(logOut) : this.showLoginView}
                  disabled={submitting}
                >
                  {loggedIn ? i18n("Log out") : i18n("Login")}
                </LinkLikeSpan>
              )}
            </Mutation>
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
        <ErrorView
          errorMessage={errorMessage}
          show={showingView === 'error'}
          back={this.hideView}
        />
        {submitting && <Progress cover={true} />}
      </React.Fragment>
    )
  }
}

export default Footer