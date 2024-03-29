import React from 'react'
import i18n from '../../utils/i18n.js'
// import styled from 'styled-components'

import Bar from '../basic/Bar'
import View from '../basic/View'
import SwitchButtons from '../basic/SwitchButtons'
import SwitchButton from '../basic/SwitchButton'
import SearchGroup from '../basic/SearchGroup'
import Footer from '../basic/Footer'
import ResultsView from './ResultsView'

// import createCourse from '../../data/mutations/createCourse'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class SearchView extends React.PureComponent {

  state = {
    mode: 'nt',  // options: nt | ot | both (from NT), hebrew | greek (from OT)
    showingView: false,
  }

  hideView = () => this.setState({ showingView: false })

  render() {
    const { options, show, back } = this.props 
    const { mode, showingView } = this.state 

    return (
      <View show={show}>
        <Bar
          back={back}
          title={i18n("Search")}
        >
          <SwitchButtons
            selectedId={mode}
            setSelectedId={mode => this.setState({ mode })}
          >
            {
              true  // check if the search originates from the NT (or OT)
                ? [
                  <SwitchButton id="nt" key="nt">{i18n("NT ({{nt_greek_version}})", { nt_greek_version: 'UGNT' })}</SwitchButton>,
                  <SwitchButton id="ot" key="ot">{i18n("OT ({{ot_greek_version}})", { ot_greek_version: 'UHB' })}</SwitchButton>,
                  <SwitchButton id="both" key="both">{i18n("Both")}</SwitchButton>,
                ]
                : [
                  <SwitchButton id="hebrew" key="hebrew">Heb word</SwitchButton>,
                  <SwitchButton id="greek" key="greek">Grk word</SwitchButton>,
                ]
            }
          </SwitchButtons>
        </Bar>
        <SearchGroup />
        <Footer />
        <ResultsView
          options={options}
          show={showingView === 'results'}
          back={this.hideView}
        />
      </View>
    )
  }

}

export default SearchView