import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import View from '../basic/View'
import Bar from '../basic/Bar'
import Parallel from '../smart/Parallel'
import Entry from '../smart/Entry'
import Button from 'material-ui/Button'

// import createCourse from '../../data/mutations/createCourse'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class TagView extends React.PureComponent {

  state = {
  }

  render() {
    const { show, back } = this.props 
    const { something } = this.state 

    return (
      <View show={show}>
        <Bar
          back={back}
          title={i18n("Tagging {{passage}}", { passage: "John 3:16" })}
        />
        <Parallel />
        <Entry />
        <div>
          <Button raised
            onTouchTap={() => {}}
          >Submit tags</Button>
        </div>
      </View>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(TagView)