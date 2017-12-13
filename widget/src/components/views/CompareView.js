import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import SearchView from './SearchView'
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
    showSearchView: false,
  }
  
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //   }
  // }

  render() {
    const { show, back } = this.props 
    const { showSearchView } = this.state 

    return (
      <View show={show}>
        <Bar
          back={back}
          title={"John 3:16"}
        >
          <BarSwitch>
            <BarSwitchButton />
            <BarSwitchButton />
          </BarSwitch>
        </Bar>
        hi there
        <Button raised
          onTouchTap={() => this.setState({ showSearchView: true })}
        >Search</Button>
        <SearchView
          show={showSearchView}
          back={() => this.setState({ showSearchView: false })}
        />
      </View>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(CompareView)