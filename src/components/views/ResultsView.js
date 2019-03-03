import React from 'react'
import i18n from '../../utils/i18n.js'
// import styled from 'styled-components'

import View from '../basic/View'
import Bar from '../basic/Bar'
import SwitchButtons from '../basic/SwitchButtons'
import SwitchButton from '../basic/SwitchButton'
import ResultBook from '../basic/ResultBook'
import ResultItem from '../basic/ResultItem'
import Footer from '../basic/Footer'
import CompareView from './CompareView'

// import createCourse from '../../data/mutations/createCourse'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class ResultsView extends React.PureComponent {

  state = {
    mode: 'translation',  // options: translation | orig | both
    showView: false,
  }

  // I will set up a new window.addEventListener('message', this.postMessageListener) here,
  // checking for the specific verse I'm asking the embedding site for

  
  hideView = () => this.setState({ showView: false })

  render() {
    const { options, show, back } = this.props 
    const { mode, showView } = this.state 

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
        <Footer />
        <CompareView
          options={options}
          show={showView === 'compare'}
          back={this.hideView}
        />
      </View>
    )
  }

}

export default ResultsView