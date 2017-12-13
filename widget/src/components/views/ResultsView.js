import React from 'react'
import i18n from '../../utils/i18n.js'
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

class SearchView extends React.Component {

  state = {
    showResultsView: false,
  }
  
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //   }
  // }

  render() {
    const { show, back } = this.props 
    const { showResultsView } = this.state 

    return (
      <View show={show}>
        <Bar
          back={back}
          title={"Results"}
        >
          <BarSwitch>
            <BarSwitchButton />
            <BarSwitchButton />
          </BarSwitch>
        </Bar>
        search results
      </View>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(SearchView)