import React from 'react'
// import i18n from '../../utils/i18n.js'
import { Mutation } from "react-apollo"
import { getDataObjFromQueryVarSets } from './Apollo'
import { getPassageStr, getOrigLangAndLXXVersionInfo, getOrigLangVersionIdFromRef,
         getWordsHash, getWordHashes } from '../../utils/helperFunctions.js'
import { getEmbeddingAppId } from '../../utils/auth.js'
import { getPiecesFromUSFM } from '../../utils/splitting.js'
import { getCorrespondingRefs, isValidRefInOriginal, getLocFromRef } from 'bibletags-versification/src/versification'

import SmartQueries from './SmartQueries'
import Bar from '../basic/Bar'
import Progress from '../basic/Progress'

import versionInfoQuery from '../../data/queries/versionInfo'
import verseQuery from '../../data/queries/verse'
import tagSetQuery from '../../data/queries/tagSet'
import submitWordHashesSet from '../../data/mutations/submitWordHashesSet'

class CompareData extends React.PureComponent {

  getVersionInfoQuerySets = () => {
    const { options } = this.props 
    const { version, multipleVersions } = options
    const versions = version ? [ version ] : multipleVersions.versions || []

    return versions
      .filter(version => !getOrigLangAndLXXVersionInfo()[version.id])
      .map(version => ({
        variables: { id: version.id },
        cacheKey: `VersionInfo:${version.id}`
      }))
  }

  getVerseAndTagSetQueryVars = versionInfo => {
    const { options } = this.props 
    const { version, multipleVersions, includeLXX } = options
    const { originalLanguageRef } = multipleVersions || {}
    const versions = version ? [ version ] : multipleVersions.versions || []

    let baseVersion, origLangAndLXXVerseIds, tagSetIds, origLangVersionId, origLangRefs
    const origLangAndLXXVersionInfo = getOrigLangAndLXXVersionInfo()
    const infoByVerseId = {}

    const getOrMakeInfo = verseId => {
      infoByVerseId[verseId] = infoByVerseId[verseId] || {}
      return infoByVerseId[verseId]
    }

    const addWordRangesToInfoByVerseId = ({ refs, versionId }) => {
      refs.forEach(ref => {
        getOrMakeInfo(`${getLocFromRef(ref).split(':')[0]}-${versionId}`).wordRanges = ref.wordRanges
      })
    }

    if(multipleVersions) {
      const id = getOrigLangVersionIdFromRef(originalLanguageRef)

      baseVersion = {
        ref: originalLanguageRef,
        info: origLangAndLXXVersionInfo[id],
        id,
      }

    } else {
      baseVersion = {
         ...version,
         ref: version.ref,
         info: versionInfo[version.id],
       }
    }

    const commonRef = { ...baseVersion.ref }
  
    const updateCommonRef = refs => {
      refs.forEach(ref => {
        if(commonRef.chapter !== ref.chapter) {
          delete commonRef.chapter
          delete commonRef.verse
        } else if(commonRef.verse !== ref.verse || ref.wordRanges) {
          delete commonRef.verse
        }
      })
    }

    if(multipleVersions) {
      if(isValidRefInOriginal(baseVersion.ref)) {
        versionInfo[baseVersion.id] = origLangAndLXXVersionInfo[baseVersion.id]
        origLangAndLXXVerseIds = [`${getLocFromRef(baseVersion.ref)}-${baseVersion.id}`]
      }

    } else {
      origLangVersionId = getOrigLangVersionIdFromRef(baseVersion.ref)
      const lookupVersionInfo = origLangAndLXXVersionInfo[origLangVersionId]
      origLangRefs = getCorrespondingRefs({
        baseVersion,
        lookupVersionInfo,
      })

      if(origLangRefs) {
        versionInfo[origLangVersionId] = lookupVersionInfo
        updateCommonRef(origLangRefs)
        origLangAndLXXVerseIds = origLangRefs.map(ref => `${getLocFromRef(ref).split(':')[0]}-${origLangVersionId}`)
        addWordRangesToInfoByVerseId({
          refs: origLangRefs,
          versionId: origLangVersionId,
        })
      }
    }

    tagSetIds = []
    versions.forEach(version => {
      const versionRefs = version.refs || [ version.ref ]
      const neededRefs = getCorrespondingRefs({
        baseVersion,
        lookupVersionInfo: versionInfo[version.id],
      })

      if(neededRefs) {
        updateCommonRef(neededRefs)

        const neededLocs = neededRefs.map(ref => getLocFromRef(ref).split(':')[0])
        addWordRangesToInfoByVerseId({
          refs: neededRefs,
          versionId: version.id,
        })
        const passedInLocs = versionRefs.map(ref => getLocFromRef(ref))

        if(neededLocs.every(loc => passedInLocs.includes(loc))) {

          versionRefs.forEach(ref => {
            const loc = getLocFromRef(ref)
            if(neededLocs.includes(loc)) {
              const verseId = `${loc}-${version.id}`
              const info = getOrMakeInfo(verseId)
              info.wordsHash = info.wordsHash || getWordsHash({
                usfm: ref.usfm,
                wordDividerRegex: versionInfo[version.id].wordDividerRegex,
              })
            }
          })

          tagSetIds = [
            ...tagSetIds,
            ...neededLocs.map(loc => {
              const verseId = `${loc}-${version.id}`
              return `${verseId}-${getOrMakeInfo(verseId).wordsHash}`
            }),
          ]
        }
      }
    })

    if(!origLangAndLXXVerseIds || !tagSetIds) {
      // TODO: indicate bad params
      return null
    }
  
    if(includeLXX) {
      const lookupVersionInfo = origLangAndLXXVersionInfo.lxx
      let neededRefs = []

      if(multipleVersions) {
        neededRefs = getCorrespondingRefs({
          baseVersion,
          lookupVersionInfo,
        })

      } else {
        origLangRefs.forEach(ref => {
          neededRefs = [
            neededRefs,
            ...(getCorrespondingRefs({
              baseVersion: {
                ref,
                info: origLangAndLXXVersionInfo[origLangVersionId],
                id: origLangVersionId,
              },
              lookupVersionInfo,
            }) || []),
          ]
        })
      }

      if(neededRefs && neededRefs.length > 0) {
        versionInfo.lxx = lookupVersionInfo
        updateCommonRef(neededRefs)
        const neededIds = neededRefs.map(ref => `${getLocFromRef(ref).split(':')[0]}-lxx-xx`)
        addWordRangesToInfoByVerseId({
          refs: neededRefs,
          versionId: 'lxx',
        })

        origLangAndLXXVerseIds = [
          ...origLangAndLXXVerseIds,
          ...neededIds,
        ]
  
        tagSetIds = [
          ...tagSetIds,
          ...neededIds,
        ]
      }
    }
  
    const hasMisalignment = commonRef.verse == null
  
    return {
      commonRef,
      origLangAndLXXVerseIds,
      tagSetIds,
      hasMisalignment,
      infoByVerseId,
    }
  } 
  
  render() {
    const { options, back, children } = this.props 
    const { version, multipleVersions } = options
    const versions = version ? [ version ] : multipleVersions.versions || []

    if(this.data) return children(this.data)

    let submitWordHashesCalled = false

    const oneDayInTheFuture = Date.now() + (1000 * 60 * 60 * 24)
    const oneWeekInTheFuture = Date.now() + (1000 * 60 * 60 * 24 * 7)

    return (
      <SmartQueries
        query={versionInfoQuery}
        querySets={this.getVersionInfoQuerySets()}
        staleTime={oneDayInTheFuture}
      >
        {versionInfoData => {

          if(!versionInfoData.isAllLoaded()) return <Progress />

          const { versionInfo={} } = getDataObjFromQueryVarSets(versionInfoData.queryVarSets)
          const {
            commonRef,
            origLangAndLXXVerseIds,
            tagSetIds,
            hasMisalignment,
            infoByVerseId,
          } = this.getVerseAndTagSetQueryVars(versionInfo)

          return (
            <SmartQueries
              query={verseQuery}
              querySets={origLangAndLXXVerseIds.map(id => ({
                variables: { id },
                cacheKey: `Verse:${id}`,
              }))}
              staleTime={oneWeekInTheFuture}
            >
              {verseData => (

                <SmartQueries
                  query={tagSetQuery}
                  querySets={tagSetIds.map(id => ({
                    variables: { id },
                    cacheKey: `TagSet:${id}`,
                  }))}
                  staleTime={oneDayInTheFuture}
                >
                  {tagSetData => {

                    const getInfo = verseId => (infoByVerseId[verseId] || {})

                    const loading = () => (
                      <React.Fragment>
                        <Bar
                          back={back}
                          title={
                            <div>
                              {getPassageStr({ refs: [commonRef] })}
                              {hasMisalignment &&
                                <span>TODO: Icon</span>
                              }
                            </div>
                          }
                        />
                        <Progress />
                      </React.Fragment>
                    )

                    if(!verseData.isAllLoaded() || !tagSetData.isAllLoaded()) {
                      return loading()
                    }

                    return (
                      <Mutation mutation={submitWordHashesSet}>
                        {submitWordHashesSet => {

                          const { verse: versesById } = getDataObjFromQueryVarSets(verseData.queryVarSets)
                          const { tagSet: tagSetsById } = getDataObjFromQueryVarSets(tagSetData.queryVarSets)

                          if(
                            !submitWordHashesCalled
                            && tagSetsById
                            && Object.values(tagSetsById).some(tagSet => tagSet.status === 'none')
                          ) {

                            const verionsUsfmByVerseId = {}
                            versions.forEach(version => (version.refs || [version.ref]).forEach(ref => {
                              verionsUsfmByVerseId[`${getLocFromRef(ref).split(':')[0]}-${version.id}`] = ref.usfm
                            }))

                            Object.values(tagSetsById).forEach(tagSet => {
                              if(tagSet.status === 'none') {
                                const [ loc, versionId, wordsHash ] = tagSet.id.split('-')
                                const verseId = `${loc}-${versionId}`
                                const embeddingAppId = getEmbeddingAppId() || 0
                                const wordHashes = getWordHashes({
                                  usfm: verionsUsfmByVerseId[verseId] || '',
                                  wordDividerRegex: versionInfo[versionId].wordDividerRegex,
                                })
                                // setTimeout needed so that there is not a rerender while in the render function.
                                setTimeout(() =>
                                  submitWordHashesSet({
                                    variables: {
                                      input: {
                                        loc,
                                        versionId,
                                        wordsHash,
                                        embeddingAppId,
                                        wordHashes,
                                      },
                                    },
                                  })
                                )
                              }
                            })

                            submitWordHashesCalled = true
                            return loading()
                          }

                          const hasIncompleteTags = !tagSetsById || Object.values(tagSetsById).some(tagSet => tagSet.status === 'incomplete')
                          // const hasUnconfirmedTags = tagSetsById && Object.values(tagSetsById).some(tagSet => tagSet.status === 'unconfirmed')

                          const preppedVersions = []

                          // Add orig languages and LXX to preppedVersions
                          origLangAndLXXVerseIds.forEach(id => {
                            const [ loc, versionId ] = id.split('-')
                            const { usfm } = versesById[id] || {}
                            const pieces = getPiecesFromUSFM({ usfm, isOrigLangOrLXXVersion: true })

                            const idx = versionId === 'lxx' ? 1 : 0

                            if(!preppedVersions[idx]) {
                              preppedVersions[idx] = {
                                id: versionId,
                                refs: [],
                              }
                            }
                            preppedVersions[idx].refs.push({
                              loc,
                              pieces,
                              wordRanges: getInfo(id).wordRanges,
                            })
                          })

                          const originalLanguageId = versionInfo[preppedVersions[0].id].languageId

                          // Add translations to preppedVersions
                          versions.forEach(({ id, ref, refs }) => {
                            if(id === 'lxx') return

                            const { wordDividerRegex } = versionInfo[id]

                            ;(refs || [ref]).forEach(ref => {

                              const loc = getLocFromRef(ref)
                              const verseId = `${loc}-${id}`
                              const tagSetId = `${verseId}-${getInfo(verseId).wordsHash}`

                              if(tagSetIds.includes(tagSetId)) {

                                const { usfm } = ref

                                let version
                                if(!preppedVersions.some(preppedVersion => {
                                  if(preppedVersion.id === id) {
                                    version = preppedVersion
                                    return true
                                  }
                                  return false
                                })) {
                                  version = {
                                    id,
                                    refs: [],
                                  }
                                  preppedVersions.push(version)
                                }

                                version.refs.push({
                                  loc,
                                  pieces: getPiecesFromUSFM({ usfm, wordDividerRegex }),
                                  wordRanges: getInfo(verseId).wordRanges,
                                })
                              }
                            })
                          })

                          this.data = {
                            commonRef,
                            hasMisalignment,
                            originalLanguageId,
                            preppedVersions,
                            versionInfo,
                            hasIncompleteTags,
                          }

                          return children(this.data)

                        }}
                      </Mutation>
                    )
                  }}
                </SmartQueries>
              )}
            </SmartQueries>
          )
        }}
      </SmartQueries>
    )
  }

}

export default CompareData