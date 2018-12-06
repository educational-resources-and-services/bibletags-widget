import React from 'react'
// import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { getStrongs, getIsEntirelyPrefixAndSuffix, getMainWordPartIndex } from '../../utils/helperFunctions.js'
import { getNormalizedGreekPOSCode } from '../../utils/greekMorph.js'
import { getUILanguageId } from '../../utils/i18n.js'

import SmartQuery from './SmartQuery'
import Parsing from '../basic/Parsing'
import EntrySection from '../basic/EntrySection'
import EntryWord from '../basic/EntryWord'
import EntryDetails from '../basic/EntryDetails'
// import EntryHits from '../basic/EntryHits'
// import EntrySimilar from '../basic/EntrySimilar'
import Progress from '../basic/Progress.js'

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

class Entry extends React.Component {

  state = {
  }

  render() {
    const { wordInfo, languageId } = this.props 

    const isEntirelyPrefixAndSuffix = getIsEntirelyPrefixAndSuffix(wordInfo)
    const strongs = getStrongs(wordInfo)
    const id = `${strongs}-${getUILanguageId()}`
    const oneDayInTheFuture = Date.now() + (1000 * 60 * 60 * 24)
    const { morph } = wordInfo || {}

    let morphLang
    let morphParts
    let mainPartIdx
    let morphPos

    if(morph) {

      if(languageId === 'heb') {
        morphLang = morph.substr(0,1)
        morphParts = morph.substr(1).split('/')
        mainPartIdx = getMainWordPartIndex(morphParts)
        morphPos = morphParts[mainPartIdx].substr(0,1)

      } else {
        morphLang = morph.substr(0,2)
        morphParts = [ morph.substr(3) ]
        mainPartIdx = 0
        morphPos = getNormalizedGreekPOSCode(morph.substr(3,2))
      }
      
    }

    return (
      <div>
        {wordInfo && 
          <Parsing
            isEntirelyPrefixAndSuffix={isEntirelyPrefixAndSuffix}
            morphLang={morphLang}
            morphParts={morphParts}
            mainPartIdx={mainPartIdx}
            languageId={languageId}
          />
        }
        {!isEntirelyPrefixAndSuffix && strongs &&
          <SmartQuery
            query={definitionQuery}
            variables={{ id }}
            staleTime={oneDayInTheFuture}
            cacheKey={`Definition:${id}`}
          >
            {({ loading, data: { definition } }) => {

              if(loading) {
                return (
                  <Progress
                    containterStyle={{
                      background: "#BBB",
                      paddingTop: 17,
                      paddingBottom: 15,
                    }}
                  />
                )
              }

              const { id, lex, vocal, hits, gloss, pos } = definition

              return (
                <EntrySections>
                  <LeftSide>
                    <EntrySection bg="#BBB">
                      <EntryWord
                        id={id}
                        lex={lex}
                        vocal={vocal}
                        hits={hits}
                        languageId={languageId}
                      />
                      <EntryDetails
                        gloss={gloss}
                        pos={pos}
                        morphPos={morphPos}
                        languageId={languageId}
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
              )
            }}
          </SmartQuery>
        }
      </div>
    )
  }

}

export default Entry