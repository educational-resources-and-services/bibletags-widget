import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

import Bar from '../basic/Bar'
import Footer from '../basic/Footer'
import View from '../basic/View'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class LoginView extends React.PureComponent {

  render() {
    const { show, back } = this.props 

    return (
      <View show={show}>
        <Bar
          back={back}
          title={i18n("Login")}
        />
        <Footer />
      </View>
    )
  }

}

export default LoginView