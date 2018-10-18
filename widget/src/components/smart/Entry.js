import React from 'react'
// import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'

import IconButton from '@material-ui/core/IconButton'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import CircularProgress from '@material-ui/core/CircularProgress'

import Parsing from '../basic/Parsing'
import EntrySection from '../basic/EntrySection'
import EntryWord from '../basic/EntryWord'
import EntryDetails from '../basic/EntryDetails'
// import EntryHits from '../basic/EntryHits'
// import EntrySimilar from '../basic/EntrySimilar'
import { getDataVar, getStrongs, getIsEntirelyPrefixAndSuffix } from '../../utils/helperFunctions.js'
import { getUILanguageCode } from '../../utils/i18n.js'

import definitionQuery from '../../data/queries/definition'

const EntrySections = styled.div`
  display: flex;
  flex-direction: row;
`

const LeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const CircularProgressCont = styled.div`
  text-align: center;
  background: #BBB;
  padding: 17px 0 15px;
`

class Entry extends React.Component {

  state = {
  }

  render() {
    const { wordInfo } = this.props 
    const { definition } = getDataVar(this.props)

    const isEntirelyPrefixAndSuffix = getIsEntirelyPrefixAndSuffix(wordInfo)

    return (
      <div>
        {wordInfo && 
          <Parsing
            isEntirelyPrefixAndSuffix={isEntirelyPrefixAndSuffix}
            morph={wordInfo.attributes['x-morph']}
          />
        }
        {!isEntirelyPrefixAndSuffix &&
          (
            definition && definition.id.split('-')[0] === getStrongs(wordInfo)
              ?
                <EntrySections>
                  <LeftSide>
                    <EntrySection bg="#BBB">
                      <EntryWord
                        id={definition.id}
                        lemma={definition.lemma}
                        vocal={definition.vocal}
                        hits={definition.hits}
                      />
                      <EntryDetails
                        gloss={definition.gloss}
                        pos={definition.pos}
                      />
                    </EntrySection>
                    {/* <EntrySection bg="#EEE" style={{ flex: 1, paddingBottom: 45 }}>
                      <EntrySimilar />
                    </EntrySection> */}
                  </LeftSide>
                  {/* <EntrySection  bg="#DDD">
                    <EntryHits />
                  </EntrySection> */}
                </EntrySections>
              :
                <div>
                  <CircularProgressCont>
                    <CircularProgress />
                  </CircularProgressCont>
                </div>
          )
        }
      </div>
    )
  }

}

const definitionQueryOptions = {
  name: 'definition',
  skip: ({ wordInfo }) => !getStrongs(wordInfo),
  options: ({ wordInfo }) => ({
    variables: {
      id: `${getStrongs(wordInfo)}-${getUILanguageCode()}`,
    },
  }),
}

export default compose(
  graphql(definitionQuery, definitionQueryOptions),
)(Entry)