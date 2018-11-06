import usfmJS from 'usfm-js'
import rewritePattern  from 'regexpu-core'

// const usfmMarkersWithContentToDiscard = [
//   // see http://ubsicap.github.io/usfm/index.html

//   // Identification
//   "id",
//   "usfm",
//   "ide",
//   "sts",
//   "rem",
//   "h",
//   "toc#",
//   "toca#",

//   // Introductions
//   "imt#",
//   "is#",
//   "ip",
//   "ipi",
//   "im",
//   "imi",
//   "ipq",
//   "imq",
//   "ipr",
//   "iq#",
//   "ib",
//   "ili#",
//   "iot",
//   "io#",
//   "ior",
//   "iqt",
//   "iex",
//   "imte#",
//   "ie",

//   // Titles, Headings, and Labels
//   "mt#",
//   "mte#",
//   "ms#",
//   "mr",
//   "s#",
//   "sr",
//   "r",
//   "rq",
//   "d",
//   "sp",
//   "sd#",

//   // Special Features
//   "fig",
//   "rb",
//   "pro",
//   "wg",
//   "wh",
//   "wa",

// ]

const usfmMarkersToKeep = [
  // see http://ubsicap.github.io/usfm/index.html

  // Footnotes
  "f",
  "fe",

  // Cross References
  "x",

  // Special Text
  "nd",

  // Character Styling
  "em",
  "bd",
  "it",
  "bdit",
  "no",
  "sc",
  "sup",

]

const getFilteredVerseObjects = tagObjs => tagObjs.filter(tagObj => {
  const { tag, text, children } = tagObj

  // get rid of all unsupported tags which do NOT have content to keep
  // if(usfmMarkersWithContentToDiscard.includes(tag)) return false
  // It seems that usfmMarkersWithContentToDiscard is not needed, since usfm-js distinguishes between content and text,
  // and so if something is not in usfmMarkersToKeep and has no text, we just get rid of it.
  
  // convert all unsupported tags which DO have content to keep into type=text
  if(!usfmMarkersToKeep.includes(tag)) {
    if(!text && !children) return false
    // tagObj.type = "text"
  }

  // change all .text to .children
  if(text && children) {
    children.unshift({
      // type: "text",
      text,
    })
    delete tagObj.text
  }

  if(children) {
    tagObj.children = getFilteredVerseObjects(children)
  }

  return true
})

const splitOnWords = ({ text, regexes }) => {

  return text

    // escape apostraphes
    .replace(/(\w)’(\w)/g, "$1ESCAPEDAPOSTRAPHE$2")

    // split to words
    .split(regexes.wordDividerInGroupGlobal)

    // unescape apostraphes
    .map(word => word.replace(/ESCAPEDAPOSTRAPHE/g, "’"))

    // filter out empties
    .filter(word => word !== "")
}

const reduceLevels = tagObjs => (
  tagObjs.map(tagObj => {
    if(tagObj.children) {
      tagObj.children = reduceLevels(tagObj.children)
      if(tagObj.children.length === 1) {
        const onlyChild = tagObj.children[0]
        if(Object.keys(tagObj).every(key => onlyChild[key] === tagObj[key] || typeof onlyChild[key] === 'undefined')) {
          delete tagObj.children
          return {
            ...tagObj,
            ...onlyChild,
          }
        }
      }
    }
    return tagObj
  })
)

const getNewTagObjWithUnlistedChildrenFilterOut = ({ tagObj, list }) => ({
  ...tagObj,
  ...(tagObj.children
    ? {
      children: (
        tagObj.children
          .filter(child => list.includes(child))
          .map(child => getNewTagObjWithUnlistedChildrenFilterOut({ tagObj: child, list }))
      ),
    }
    : {}
  )
})

const getGroupedVerseObjects = ({ filteredVerseObjects, regexes }) => {

  const splitWordFixes = []

  const getGroupedVerseObjectsRecursive = ({ tagObjs, ancestorArray=[], splitWordInfo }) => {

    tagObjs.forEach((tagObj, tagObjIndex) => {
      const { text, children } = tagObj

      if(text) {
        const textSplitOnWords = splitOnWords({ text, regexes })

        tagObj.children = textSplitOnWords.map(wordOrWordDivider => {
          const doesNotHaveWord = regexes.wordDividerStartToEnd.test(wordOrWordDivider)
          return {
            text: wordOrWordDivider,
            ...(doesNotHaveWord ? {} : { type: "word" }),
          }
        })

        delete tagObj.text

        if(splitWordInfo) {

          const firstChild = tagObj.children[0]

          if(firstChild.type === "word") {
            const {
              arrayWhichEndsWithWord,
              ancestorLineWhichEndsWithWord,
              commonParentArray,
              indexOfChildOfCommonParent,
            } = splitWordInfo

            splitWordFixes.unshift(() => {
              delete arrayWhichEndsWithWord[arrayWhichEndsWithWord.length-1].type
              delete firstChild.type

              const newWordObj = {
                children: [
                  getNewTagObjWithUnlistedChildrenFilterOut({
                    tagObj: commonParentArray[indexOfChildOfCommonParent],
                    list: ancestorLineWhichEndsWithWord,
                  }),
                  getNewTagObjWithUnlistedChildrenFilterOut({
                    tagObj: commonParentArray[indexOfChildOfCommonParent+1],
                    list: [
                      ...ancestorArray,
                      tagObj,
                      firstChild,
                    ],
                  })
                ],
                type: "word",
              }

              commonParentArray.splice(indexOfChildOfCommonParent+1, 0, newWordObj)
              
              arrayWhichEndsWithWord.pop()
              tagObj.children.shift()
            })
          }
          
          splitWordInfo = null
        }
        
        const lastChild = tagObj.children[tagObj.children.length - 1]
        splitWordInfo = lastChild.type === "word"
          ? {
            arrayWhichEndsWithWord: tagObj.children,
            ancestorLineWhichEndsWithWord: [lastChild],
            commonParentArray: tagObjs,
            indexOfChildOfCommonParent: tagObjIndex,
          }
          : null

      } else if(children) {
        const childrenInfo = getGroupedVerseObjectsRecursive({
          tagObjs: children,
          ancestorArray: [ ...ancestorArray, tagObj ],
          splitWordInfo,
        })
        tagObj.children = childrenInfo.groupedVerseObjects
        splitWordInfo = childrenInfo.splitWordInfo
          ? {
            ...childrenInfo.splitWordInfo,
            ancestorLineWhichEndsWithWord: [
              ...childrenInfo.splitWordInfo.ancestorLineWhichEndsWithWord,
              childrenInfo.splitWordInfo.commonParentArray[childrenInfo.splitWordInfo.indexOfChildOfCommonParent],
            ],
            commonParentArray: tagObjs,
            indexOfChildOfCommonParent: tagObjIndex,
          }
          : null
      }
    })

    return {
      groupedVerseObjects: tagObjs,
      splitWordInfo,
    }
  }

  let { groupedVerseObjects } = getGroupedVerseObjectsRecursive({ tagObjs: filteredVerseObjects })

  splitWordFixes.forEach(splitWordFix => splitWordFix())

  groupedVerseObjects = reduceLevels(groupedVerseObjects)

  return groupedVerseObjects
}

export const getPiecesFromUSFM = ({ usfm='', wordDividerRegex, isOrigLangOrLXXVersion }) => {

  const usfmWithoutChapterAndVerse = usfm.replace(/^(?:.|\r\n|\r|\n)*\\c [0-9]+(?:.|\r\n|\r|\n)*\\v [0-9]+ */g, '')
  const { verseObjects } = usfmJS.toJSON(`\\c 1 \\v 1 ${usfmWithoutChapterAndVerse}`).chapters["1"]["1"]

// wordDividerRegex = '(?:[\\P{L}]+|)'
  const regexes = {
    wordDividerInGroupGlobal: new RegExp(rewritePattern(`(${wordDividerRegex || '[\\P{L}]+'})`, 'u', {
      unicodePropertyEscape: true,
    }), 'g'),
    wordDividerStartToEnd: new RegExp(rewritePattern(`^${wordDividerRegex || '[\\P{L}]+'}$`, 'u', {
      unicodePropertyEscape: true,
    })),
  }

  if(isOrigLangOrLXXVersion) return verseObjects

  const filteredVerseObjects = getFilteredVerseObjects(verseObjects)

  const groupedVerseObjects = getGroupedVerseObjects({
    filteredVerseObjects,
    regexes,
  })

    // error if there is a single tag that is both multi-word but only part of one of the words

  return groupedVerseObjects

{/* https://github.com/translationCoreApps/usfm-js/tree/master/__tests__/resources */}
}

export const splitVerseIntoWords = ({ ref: { usfm }, wordDividerRegex }={}) => {

  const getWords = pieces => {
    let words = []
// note when there are new words via the type=word

    pieces.forEach(piece => {
      const { text, children } = piece
      if(text) {

      } else {
        words = [
          ...words,
          ...getWords(children)
        ]
      }
    })
  }

  return getWords( getPiecesFromUSFM({ usfm, wordDividerRegex }) )
}
