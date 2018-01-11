import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import View from '../basic/View'
import Bar from '../basic/Bar'
import SwitchButtons from '../basic/SwitchButtons'
import SwitchButton from '../basic/SwitchButton'
import Parallel from '../smart/Parallel'
import Entry from '../smart/Entry'
import SearchView from './SearchView'

// import createCourse from '../../data/mutations/createCourse'

const verse = {
  id: '0010101-wlc',
  usfm: `
    \\w ב/רשית|strongs="H234"\\w*
    \\w ברא|lemma="hi!"\\w*
    \\w אלוהים\\w*,
    \\w את\\w*
    \\w ה/שמים\\w*
    \\w ו/את\\w*
    \\w ה/ארץ\\w*
  `.replace(/\s+/g, ' ')
}

const tagSet = {
  id: '0010101-esv',
  tags: [
    {
      o: ["|1|1"],
      t: [1]
    },
    {
      o: ["|1|2"],
      t: [3]
    },
    {
      o: ["|2"],
      t: [5]
    },
    {
      o: ["|3"],
      t: [4]
    },
    {
      o: ["|5|1"],
      t: [6]
    },
    {
      o: ["|5|2"],
      t: [6]
    },
    {
      o: ["|6|1"],
      t: [8]
    },
    {
      o: ["|7|1"],
      t: [9]
    },
    {
      o: ["|7|2"],
      t: [10]
    },
  ]
}

const word = {
  id: 'H234-eng',
  lemma: 'אַזְכָּרָה',
  lemmaUnique: true,
  vocal: 'ʼazkârâh',
  hits: 7,
  gloss: 'reminder',
  pos: ['N'],
  syn: [],
  rel: [{"lemma":"זָכַר","strongs":"G2142","hits":232,"gloss":"remember"}],
  lxx: [{"w":"ἀρχῇ","lemma":"ἀρχή","strongs":"G746","hits":236,"bhpHits":55}],
  lxxHits: [],
}

const translations = {
  id: 'H234-esv',
  tr: [{"son":299,"sons":56}],
}

const lexEntry = {
  id: 'H234-eng',
  usfm: 'About the word...',
}


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
    wordIndex: null,
  }

  closeWord = () => this.setState({ wordIndex: null })

  hideSearchView = () => this.setState({ showSearchView: false })

  render() {
    const { show, back, style } = this.props 
    const { showSearchView, mode, wordIndex } = this.state 

    return (
      <View
        show={show}
        style={style}
      >
        <Bar
          back={back}
          title={"John 3:16"}
        >
          <SwitchButtons
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
          </SwitchButtons>
        </Bar>
        <Parallel
          verse={verse}
          wordIndex={wordIndex}
          updateWordIndex={wordIndex => this.setState({ wordIndex })}
        />
        {wordIndex !== null &&
          <Entry
            closeWord={this.closeWord}
          />
        }
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
)(CompareView)