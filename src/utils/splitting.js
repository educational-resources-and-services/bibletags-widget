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
  const { tag, text, type, children } = tagObj

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

  // make consistent with marker objects to be created
  if(type === 'text') {
    delete tagObj.type
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

const filterOutEmptyObjects = tagObjs => (
  tagObjs.filter(tagObj => {
    const { text, children, content } = tagObj

    if(!text && (!children || !children.length) && !content) {
      return false
    }

    if(children) {
      tagObj.children = filterOutEmptyObjects(children)
    }

    return true
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

  const includesEmptyWordDividers = regexes.wordDividerStartToEnd.test("")
  const splitWordFixesInfo = []

  const getGroupedVerseObjectsRecursive = ({ tagObjs, ancestorLine: passedInAncestorLine, splitWordInfo }) => {

    tagObjs.forEach((tagObj, tagObjIndex) => {
      const { text, children } = tagObj
      const ancestorLine = [ ...(passedInAncestorLine || []), tagObjs, tagObj ]

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
              commonAncestorArray,
              indexOfChildOfCommonAncestor,
            } = splitWordInfo

            const word1Obj = arrayWhichEndsWithWord[arrayWhichEndsWithWord.length-1]
            const word1PartInfo = {
              obj: word1Obj,
              arrayContainingObj: arrayWhichEndsWithWord,
              childOfCommonAncestor: commonAncestorArray[indexOfChildOfCommonAncestor],
            }
            const word2PartInfo = {
              obj: firstChild,
              arrayContainingObj: tagObj.children,
              childOfCommonAncestor: ancestorLine[ancestorLine.indexOf(commonAncestorArray) + 1],
            }
            const word2AncestorList = [
              ...ancestorLine,
              firstChild,
            ]

            if(!splitWordFixesInfo.some(splitWordFixInfo => {
              if(splitWordFixInfo.wordPartsInfo.map(({ obj }) => obj).includes(word1Obj)) {
                // add in word2 info only
                splitWordFixInfo.wordPartsInfo.push(word2PartInfo)
                splitWordFixInfo.ancestorList = [
                  ...splitWordFixInfo.ancestorList,
                  ...word2AncestorList,
                ]

                if(splitWordFixInfo.commonAncestorArray !== commonAncestorArray) {
                  throw "USFM with nested markers not presently supported."
                }

                return true
              }
            })) {
              // add new entry with word1 and word2 info
              splitWordFixesInfo.push({
                wordPartsInfo: [
                  word1PartInfo,
                  word2PartInfo,
                ],
                ancestorList: [
                  ...ancestorLineWhichEndsWithWord,
                  ...word2AncestorList,
                ],
                commonAncestorArray,
              })
            }
          }
          
          splitWordInfo = null
        }
        
        const lastChild = tagObj.children[tagObj.children.length - 1]
        splitWordInfo = lastChild.type === "word" && !includesEmptyWordDividers
          ? {
            arrayWhichEndsWithWord: tagObj.children,
            ancestorLineWhichEndsWithWord: [ tagObj.children, lastChild ],
            commonAncestorArray: tagObjs,
            indexOfChildOfCommonAncestor: tagObjIndex,
          }
          : null

      } else if(children) {
        const childrenInfo = getGroupedVerseObjectsRecursive({
          tagObjs: children,
          ancestorLine,
          splitWordInfo,
        })
        tagObj.children = childrenInfo.groupedVerseObjects
        splitWordInfo = childrenInfo.splitWordInfo && !includesEmptyWordDividers
          ? {
            ...childrenInfo.splitWordInfo,
            ancestorLineWhichEndsWithWord: [
              ...childrenInfo.splitWordInfo.ancestorLineWhichEndsWithWord,
              childrenInfo.splitWordInfo.commonAncestorArray,
              childrenInfo.splitWordInfo.commonAncestorArray[childrenInfo.splitWordInfo.indexOfChildOfCommonAncestor],
            ],
            commonAncestorArray: tagObjs,
            indexOfChildOfCommonAncestor: tagObjIndex,
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

  splitWordFixesInfo.forEach(splitWordFixInfo => {
    const { wordPartsInfo, ancestorList, commonAncestorArray } = splitWordFixInfo

    wordPartsInfo.forEach(wordPartInfo => delete wordPartInfo.obj.type)

    const commonAncestorArrayIndexesToSplice = []

    const newWordObj = {
      children: wordPartsInfo.map(({ obj, arrayContainingObj, childOfCommonAncestor }) => {

        const objIndex = arrayContainingObj.indexOf(obj)
        
        const newChild = getNewTagObjWithUnlistedChildrenFilterOut({
          tagObj: childOfCommonAncestor,
          list: ancestorList,
        })

        arrayContainingObj.splice(objIndex, 1)

        return newChild
      }),
      type: "word",
    }

    const insertIndex = commonAncestorArray.indexOf(wordPartsInfo[0].childOfCommonAncestor) + 1
    
    commonAncestorArray.splice(insertIndex, 0, newWordObj)
  })

  groupedVerseObjects = reduceLevels(groupedVerseObjects)
  groupedVerseObjects = filterOutEmptyObjects(groupedVerseObjects)

  return groupedVerseObjects
}

export const getPiecesFromUSFM = ({ usfm='', wordDividerRegex, isOrigLangOrLXXVersion }) => {

  const usfmWithoutChapterAndVerse = usfm.replace(/^(?:.|\r\n|\r|\n)*\\c [0-9]+(?:.|\r\n|\r|\n)*\\v [0-9]+ */g, '')
  const { verseObjects } = usfmJS.toJSON(`\\c 1 \\v 1 ${usfmWithoutChapterAndVerse}`).chapters["1"]["1"]

  if(isOrigLangOrLXXVersion) return verseObjects

  const regexes = {
    wordDividerInGroupGlobal: new RegExp(rewritePattern(`(${wordDividerRegex || '[\\P{L}]+'})`, 'u', {
      unicodePropertyEscape: true,
    }), 'g'),
    wordDividerStartToEnd: new RegExp(rewritePattern(`^${wordDividerRegex || '[\\P{L}]+'}$`, 'u', {
      unicodePropertyEscape: true,
    })),
  }

  const filteredVerseObjects = getFilteredVerseObjects(verseObjects)

  const groupedVerseObjects = getGroupedVerseObjects({
    filteredVerseObjects,
    regexes,
  })

  return groupedVerseObjects
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
