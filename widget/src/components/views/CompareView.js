import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import SearchView from './SearchView'
import Bar from '../basic/Bar'
import SwitchButtons from '../basic/SwitchButtons'
import SwitchButton from '../basic/SwitchButton'
import View from '../basic/View'
import Button from 'material-ui/Button'

// import createCourse from '../../data/mutations/createCourse'

const StyledSwitchButtons = styled(SwitchButtons)`
  margin: auto 0;
`

const DoubleLine = styled.div`
  width: 20px;
  height: 4px;
  border: 1px solid black;
  border-width: 1px 0;
  .depressed & {
    border-color: white;
  }
`

const SwitchButtonText = styled.div`
  display: block;
  font-size: 9px;
  line-height: 1;
  margin-bottom: 3px;
`

const DashedLine = styled.div`
  display: block;
  width: 100%;
  height: 1px;
  border-top: 1px dashed black;
  .depressed & {
    border-color: white;
  }
`

class CompareView extends React.Component {

  state = {
    showSearchView: false,
    mode: 'separate',
  }
  
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //   }
  // }

  render() {
    const { show, back } = this.props 
    const { showSearchView, mode } = this.state 

    return (
      <View show={show}>
        <Bar
          back={back}
          title={"John 3:16"}
        >
          <StyledSwitchButtons
            selectedId={mode}
            setSelectedId={mode => this.setState({ mode })}
          >
            <SwitchButton id="separate">
              <DoubleLine />
            </SwitchButton>
            <SwitchButton id="greekBased">
              <div>
                <SwitchButtonText
                  style={{
                    textTransform: 'none',
                  }}
                >{i18n("Greek")}</SwitchButtonText>
                <DashedLine />
              </div>
            </SwitchButton>
            <SwitchButton id="translationBased">
              <div>
                <SwitchButtonText>ESV</SwitchButtonText>
                <DashedLine />
              </div>
            </SwitchButton>
          </StyledSwitchButtons>
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