import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import View from '../basic/View'
import Bar from '../basic/Bar'
import SwitchButtons from '../basic/SwitchButtons'
import SwitchButton from '../basic/SwitchButton'
import ResultBook from '../basic/ResultBook'
import ResultItem from '../basic/ResultItem'
import CompareView from './CompareView'

// import createCourse from '../../data/mutations/createCourse'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class ResultsView extends React.Component {

  state = {
    mode: 'translation',  // options: translation | orig | both
    showCompareView: false,
  }

  render() {
    const { show, back } = this.props 
    const { mode, showCompareView } = this.state 

    return (
      <View show={show}>
        <Bar
          back={back}
          title={"υἱός"}
          subtitle={
            <div>
              <div>John’s writings</div>
              <div>86x</div>
            </div>
          }
        >
          <SwitchButtons
            selectedId={mode}
            setSelectedId={mode => this.setState({ mode })}
          >
            <SwitchButton id="translation">{"ESV"}</SwitchButton>
            <SwitchButton id="orig">{true ? i18n("Greek") : i18n("Hebrew")}</SwitchButton>
            <SwitchButton id="both">{i18n("Both")}</SwitchButton>
          </SwitchButtons>
        </Bar>
        <ResultBook />
        <ResultItem />
        <CompareView
          show={showCompareView}
          back={() => this.setState({ showCompareView: false })}
        />
      </View>
    )
  }

}

export default compose(
  // graphql(createCourseAdmin, { name: 'createCourseAdmin' }),
)(ResultsView)