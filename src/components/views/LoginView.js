import React from 'react'
import { Mutation } from "react-apollo"
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { isValidEmail, isValidToken } from '../../utils/helperFunctions.js'
import { CAPTCHA_SITE_KEY, OAUTH_STRATEGIES } from '../../utils/constants.js'

import Bar from '../basic/Bar'
import Footer from '../basic/Footer'
import View from '../basic/View'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ReCAPTCHA from 'react-google-recaptcha'
import ErrorView from './ErrorView'
import Progress from '../basic/Progress'
import LinkLikeSpan from '../basic/LinkLikeSpan'

import requestLoginToken from '../../data/mutations/requestLoginToken'
import logIn from '../../data/mutations/logIn'

const LoginContent = styled.div`
  padding: 15px;
`

const StyledTextField = styled(TextField)`
  width: 100%;
`

const ButtonCont = styled.div`
  margin: 10px 0;
`

const Message = styled.div`
  margin-bottom: 15px;
  color: #777;
  font-size: 15px;
`

const SendNewCodeCont = styled.div`
  margin: 25px 0 10px;
  font-size: 14px;
`

const OAuthHeading = styled.div`
  margin: 20px 0 0;
`

const StyledButton = styled(Button)`
  color: #ffffff;
  background-color: #666666;
  :hover {
    opacity: .7;
  }
`

class LoginView extends React.PureComponent {

  state = {
    email: '',
    token: '',
    showingView: false,
    errorMessage: '',
    formErrors: {},
    submitting: false,
    enterCode: false,
  }

  handleInputChange = ({ target }) => {
    const field = target.id.split('.').pop()

    const formErrors = Object.assign({}, this.state.formErrors)
    delete formErrors[field]

    this.setState({
      [field]: target.value.trim(),
      formErrors,
    })
  }

  logIn = logIn => () => {
    const { token } = this.state

    const formErrors = {}

    // form validation
    if(!isValidToken(token)) {
      formErrors.token = i18n("Invalid code.") + i18n(" ", {}, "word separator") + i18n("Eg. AU3-GHN")
    }

    this.setState({ formErrors })

    if(Object.keys(formErrors).length === 0) {
      this.doLogIn(logIn)
    }
  }

  doLogIn = logIn => {
    const { token } = this.state

    this.setState({ submitting: true })

    logIn({
      variables: {
        input: {
          token: token.replace(/-/g, ''),
        },
      },
    })
      .then(() => {
        this.setState({
          submitting: false,
        })
      })
      .catch(err => {

        if(err.message === 'GraphQL error: Invalid token.') {

          const formErrors = {}
          formErrors.token = i18n("Invalid code.")

          this.setState({
            formErrors,
            submitting: false,
          })

          return
        }

        this.showErrorView(err.message)
      })

  }

  hideView = () => this.setState({ showingView: false })

  showErrorView = (errorMessage='Unknown error') => {
    this.setState({
      showingView: 'error',
      errorMessage: errorMessage.replace(/^GraphQL error: /, ''),
      submitting: false,
    })
  }
  
  handleSubmit = ({ event, handleLoginTokenRequest }) => {
    event.preventDefault()

    const { email } = this.state
    const formErrors = {}

    // form validation
    if(!isValidEmail(email)) {
      formErrors.email = i18n("Please enter a valid email.")
    }

    this.setState({ formErrors })

    if(Object.keys(formErrors).length === 0) {
      if(process.env.NODE_ENV === 'development') {
        handleLoginTokenRequest()
      } else {
        this.captcha.execute()
      }
    }
  }

  handleLoginTokenRequest = ({ captchaValue='', requestLoginToken }) => {
    const { email } = this.state

    this.setState({ submitting: true })

    requestLoginToken({
      variables: {
        input: {
          email,
          captchaValue,
        },
      },
    })
      .then(() => {
        this.setState({
          submitting: false,
          enterCode: true,
        })
      })
      .catch(err => {
        this.showErrorView(err.message)
      })
  }

  handleSendNewCode = () => {
    this.setState({
      enterCode: false,
      email: '',
      token: '',
    })
  }

  setCaptchaRef = el => this.captcha = el

  render() {
    const { show, back } = this.props 
    const { email, token, formErrors, submitting, enterCode, showingView, errorMessage } = this.state

    return (
      <View show={show}>
        <Bar
          back={back}
          title={i18n("Login")}
        />
        <LoginContent>
          {!enterCode &&
            <Mutation mutation={requestLoginToken}>
              {requestLoginToken => {
                const handleLoginTokenRequest = captchaValue => this.handleLoginTokenRequest({ captchaValue, requestLoginToken })
                const handleSubmit = event => this.handleSubmit({ event, handleLoginTokenRequest })

                return (
                  <form onSubmit={handleSubmit}>
                    <StyledTextField
                      label={i18n("Email")}
                      id="login.email"
                      value={email}
                      disabled={submitting}
                      onChange={this.handleInputChange}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      autoFocus
                    />
                    <ReCAPTCHA
                      ref={this.setCaptchaRef}
                      sitekey={CAPTCHA_SITE_KEY}
                      size="invisible"
                      onChange={handleLoginTokenRequest}
                    />
                    <ButtonCont>
                      <Button
                        variant="contained"
                        disabled={submitting}
                        onClick={handleSubmit}
                      >
                        {i18n("Send me a login code")}
                      </Button>
                    </ButtonCont>
                    {Object.keys(OAUTH_STRATEGIES).length > 0 &&
                      <OAuthHeading>{i18n("Alternatively...")}</OAuthHeading>
                    }
                    {Object.keys(OAUTH_STRATEGIES).map(loginStrategy => (
                      <ButtonCont key={loginStrategy}>
                        <StyledButton
                          variant="contained"
                          style={{
                            backgroundColor: OAUTH_STRATEGIES[loginStrategy].color,
                          }}
                          disabled={submitting}
                          onClick={() => window.location = `/auth/oauth/${loginStrategy}`}
                        >
                          {OAUTH_STRATEGIES[loginStrategy].text}
                        </StyledButton>
                      </ButtonCont>
                    ))}
                  </form>
                )
              }}
            </Mutation>
          }
          {enterCode &&
            <Mutation mutation={logIn}>
              {logIn => {
                return (
                  <React.Fragment>
                    <Message>
                      {i18n("Code sent. Check your email.")}
                    </Message>
                    <StyledTextField
                      label={i18n("Code")}
                      placeholder={i18n("Eg. AU3-GHN")}
                      id="login.token"
                      value={token}
                      onChange={this.handleInputChange}
                      error={!!formErrors.token}
                      helperText={formErrors.token}
                      disabled={submitting}
                      autoFocus
                    />
                    <ButtonCont>
                      <Button
                        variant="contained"
                        disabled={submitting}
                        onClick={this.logIn(logIn)}
                      >
                        {i18n("Log in")}
                      </Button>
                    </ButtonCont>
                    <SendNewCodeCont>
                      <LinkLikeSpan
                        onClick={this.handleSendNewCode}
                      >
                        {i18n("Send new code")}
                      </LinkLikeSpan>
                    </SendNewCodeCont>
                  </React.Fragment>
                )
              }}
            </Mutation>
          }
          {submitting && <Progress />}
        </LoginContent>
        <Footer />
        <ErrorView
          errorMessage={errorMessage}
          show={showingView === 'error'}
          back={this.hideView}
        />
      </View>
    )
  }

}

export default LoginView