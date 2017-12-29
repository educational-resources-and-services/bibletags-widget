import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import Bar from '../basic/Bar'
import View from '../basic/View'
import SwitchButtons from '../basic/SwitchButtons'
import SwitchButton from '../basic/SwitchButton'
import SearchGroup from '../basic/SearchGroup'
import ResultsView from './ResultsView'

// import createCourse from '../../data/mutations/createCourse'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class SearchView extends React.Component {

  state = {
    mode: 'nt',  // options: nt | ot | both (from NT), hebrew | greek (from OT)
    showResultsView: false,
  }

  render() {
    const { show, back } = this.props 
    const { mode, showResultsView } = this.state 

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
                  <SwitchButton id="nt">{i18n("NT ({{nt_greek_version}})", { nt_greek_version: 'BHP' })}</SwitchButton>,
                  <SwitchButton id="ot">{i18n("OT ({{ot_greek_version}})", { ot_greek_version: 'WLC' })}</SwitchButton>,
                  <SwitchButton id="both">{i18n("Both")}</SwitchButton>,
                ]
                : [
                  <SwitchButton id="hebrew">Heb word</SwitchButton>,
                  <SwitchButton id="greek">Grk word</SwitchButton>,
                ]
            }
          </SwitchButtons>
        </Bar>
        <SearchGroup />
        <ResultsView
          show={showResultsView}
          back={() => this.setState({ showResultsView: false })}
        />
      </View>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(SearchView)