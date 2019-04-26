import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

import Bar from '../basic/Bar'
import View from '../basic/View'
import Footer from '../basic/Footer'

const Content = styled.div`
  padding: 15px;
`

class ErrorView extends React.PureComponent {

  render() {
    const { show, back, errorMessage } = this.props 

    return (
      <View show={show}>
        <Bar
          back={back}
          title={i18n("Oops!")}
        />
        <Content>{errorMessage}</Content>
        <Footer />
      </View>
    )
  }

}

export default ErrorView