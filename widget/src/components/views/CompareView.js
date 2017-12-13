import React from 'react'
import i18n from '../../utils/i18n.js'
import { close } from '../../utils/postMessage.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import Bar from '../basic/Bar'
import BarSwitch from '../basic/BarSwitch'
import BarSwitchButton from '../basic/BarSwitchButton'
import View from '../basic/View'
import Button from 'material-ui/Button'

// import createCourse from '../../data/mutations/createCourse'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class CompareView extends React.Component {

  state = {
    showChildView: false,
  }
  
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //   }
  // }

  render() {
    const { show, back } = this.props 
    const { showChildView } = this.state 

    return (
      <View show={show}>
        <Bar
          back={back}
        >
          <BarSwitch>
            <BarSwitchButton />
            <BarSwitchButton />
          </BarSwitch>
        </Bar>
        hi there
        <Button raised
          // onTouchTap={() => this.setState({ showChildView: true })}
          onTouchTap={() => close()}
        >Add</Button>
        <Button raised
          onTouchTap={back}
        >Back</Button>
        <CompareView
          show={showChildView}
          back={() => this.setState({ showChildView: false })}
        />
      </View>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(CompareView)