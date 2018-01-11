import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import View from '../basic/View'
import Entry from '../smart/Entry'
import SearchView from './SearchView'

// import createCourse from '../../data/mutations/createCourse'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class WordView extends React.Component {

  state = {
    showSearchView: false,
  }

  hideSearchView = () => this.setState({ showSearchView: false })

  render() {
    const { something } = this.state 

    return (
      <View show={show}>
        <SearchView
          show={showSearchView}
          back={this.hideSearchView}
        />
      </View>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(WordView)