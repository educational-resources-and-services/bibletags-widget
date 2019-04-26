import React from 'react'
import i18n from '../../utils/i18n.js'
// import styled from 'styled-components'

import View from '../basic/View'
import Bar from '../basic/Bar'
import Parallel from '../smart/Parallel'
import Entry from '../smart/Entry'
import Button from '@material-ui/core/Button'
import Footer from '../basic/Footer'

// import createCourse from '../../data/mutations/createCourse'

// const StyledSomething = styled.div`
//   height: 3px;
// `

class TagView extends React.PureComponent {

  updateWordLoc = () => {}

  render() {
    const { show, back, versions, versionInfo, originalLanguageWordLoc, hasMisalignment } = this.props 

    return (
      <View show={show}>
        <Bar
          back={back}
          title={i18n("Tagging {{passage}}", { passage: "John 3:16" })}
        />
        <Parallel
          versions={versions}
          versionInfo={versionInfo}
          originalLanguageWordLoc={originalLanguageWordLoc}
          updateWordLoc={this.updateWordLoc}
          hasMisalignment={hasMisalignment}
        />
        <Entry />
        <div>
          <Button
            variant="contained"
            onClick={() => {}}
          >Submit tags</Button>
        </div>
        <Footer showLinks={true} />
      </View>
    )
  }

}

export default TagView