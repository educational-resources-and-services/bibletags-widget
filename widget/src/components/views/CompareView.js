import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

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
        hi there
        <Button raised
          onTouchTap={() => this.setState({ showChildView: true })}
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