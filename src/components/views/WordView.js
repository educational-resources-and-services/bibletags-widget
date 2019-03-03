import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

import View from '../basic/View'
import Entry from '../smart/Entry'
import Footer from '../basic/Footer'
import SearchView from './SearchView'

// import createCourse from '../../data/mutations/createCourse'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class WordView extends React.PureComponent {

  state = {
    shoView: false,
  }

  hideView = () => this.setState({ showingView: false })

  render() {
    const { something } = this.state 

    return (
      <View show={show}>
        <SearchView
          show={showingView === 'search'}
          back={this.hideView}
        />
        <Footer />
      </View>
    )
  }

}

export default WordView