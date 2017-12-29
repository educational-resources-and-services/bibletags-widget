import React from 'react'
// import i18n from '../../utils/i18n.js'  --This component purposely not in i18n because it is the translation setup
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import View from '../basic/View'
import Bar from '../basic/Bar'
import SwitchButtons from '../basic/SwitchButtons'
import SwitchButton from '../basic/SwitchButton'
import Button from 'material-ui/Button'

// import createCourse from '../../data/mutations/createCourse'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class SetupView extends React.Component {

  state = {
    mode: 'books',
  }

  render() {
    const { show, back } = this.props 
    const { mode } = this.state 

    return (
      <View show={show}>
        <Bar
          back={back}
          title="Setup"
        >
          <SwitchButtons
            selectedId={mode}
            setSelectedId={mode => this.setState({ mode })}
          >
            <SwitchButton id="books">Books</SwitchButton>
            <SwitchButton id="ui">UI</SwitchButton>
            <SwitchButton id="grammar">Grammar</SwitchButton>
          </SwitchButtons>
        </Bar>
        <div>
          <Button raised
            onTouchTap={() => {}}
          >Submit translations</Button>
        </div>
      </View>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(SetupView)