import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

import Bar from '../basic/Bar'
import View from '../basic/View'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class InstructionsView extends React.Component {

  render() {
    const { show, back } = this.props 

    return (
      <View show={show}>
        <Bar
          back={back}
          title={i18n("Instructions")}
        />
      </View>
    )
  }

}

export default InstructionsView