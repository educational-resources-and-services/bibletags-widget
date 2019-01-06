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

const getFilteredVerseObjects = unitObjs => unitObjs.filter(unitObj => {
  const { tag, text, type, children } = unitObj

  // get rid of all unsupported markers which do NOT have content to keep
  // if(usfmMarkersWithContentToDiscard.includes(tag)) return false
  // It seems that usfmMarkersWithContentToDiscard is not needed, since usfm-js distinguishes between content and text,
  // and so if something is not in usfmMarkersToKeep and has no text, we just get rid of it.
  
  // convert all unsupported markers which DO have content to keep into type=text
  if(!usfmMarkersToKeep.includes(tag)) {
    if(!text && !children) return false
    // unitObj.type = "text"
  }

  // change all .text to .children
  if(text && children) {
    children.unshift({
      // type: "text",
      text,
    })
    delete unitObj.text

  // swap out special spacing strings
  } else if(text) {
    unitObj.text = text
      .replace(/~/g, "\u00A0")
      .replace(/ \/\/ /g, " ")
      .replace(/\/\//g, "")
  }

  // make consistent with marker objects to be created
  if(type === 'text') {
    delete unitObj.type
  }

  if(children) {
    unitObj.children = getFilteredVerseObjects(children)
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

const reduceLevels = unitObjs => (
  unitObjs.map(unitObj => {
    if(unitObj.children) {
      unitObj.children = reduceLevels(unitObj.children)
      if(unitObj.children.length === 1) {
        const onlyChild = unitObj.children[0]
        if(Object.keys(unitObj).every(key => onlyChild[key] === unitObj[key] || typeof onlyChild[key] === 'undefined')) {
          delete unitObj.children
          return {
            ...unitObj,
            ...onlyChild,
          }
        }
      }
    }
    return unitObj
  })
)

const filterOutEmptyObjects = unitObjs => (
  unitObjs.filter(unitObj => {
    const { text, children, content } = unitObj

    if(!text && (!children || !children.length) && !content) {
      return false
    }

    if(children) {
      unitObj.children = filterOutEmptyObjects(children)
    }

    return true
  })
)

const getNewTagObjWithUnlistedChildrenFilterOut = ({ unitObj, list }) => ({
  ...unitObj,
  ...(unitObj.children
    ? {
      children: (
        unitObj.children
          .filter(child => list.includes(child))
          .map(child => getNewTagObjWithUnlistedChildrenFilterOut({ unitObj: child, list }))
      ),
    }
    : {}
  )
})

const getGroupedVerseObjects = ({ filteredVerseObjects, regexes }) => {

  const includesEmptyWordDividers = regexes.wordDividerStartToEnd.test("")
  const splitWordFixesInfo = []

  const getGroupedVerseObjectsRecursive = ({ unitObjs, ancestorLine: passedInAncestorLine, splitWordInfo }) => {

    unitObjs.forEach((unitObj, unitObjIndex) => {
      const { text, children } = unitObj
      const ancestorLine = [ ...(passedInAncestorLine || []), unitObjs, unitObj ]

      if(text) {
        const textSplitOnWords = splitOnWords({ text, regexes })

        unitObj.children = textSplitOnWords.map(wordOrWordDivider => {
          const doesNotHaveWord = regexes.wordDividerStartToEnd.test(wordOrWordDivider)
          return {
            text: wordOrWordDivider,
            ...(doesNotHaveWord ? {} : { type: "word" }),
          }
        })

        delete unitObj.text

        if(splitWordInfo) {

          const firstChild = unitObj.children[0]

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
              arrayContainingObj: unitObj.children,
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
                  throw new Error("USFM with nested markers not presently supported.")
                }

                return true
              }
              return false
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
        
        const lastChild = unitObj.children[unitObj.children.length - 1]
        splitWordInfo = lastChild.type === "word" && !includesEmptyWordDividers
          ? {
            arrayWhichEndsWithWord: unitObj.children,
            ancestorLineWhichEndsWithWord: [ unitObj.children, lastChild ],
            commonAncestorArray: unitObjs,
            indexOfChildOfCommonAncestor: unitObjIndex,
          }
          : null

      } else if(children) {
        const childrenInfo = getGroupedVerseObjectsRecursive({
          unitObjs: children,
          ancestorLine,
          splitWordInfo,
        })
        unitObj.children = childrenInfo.groupedVerseObjects
        splitWordInfo = childrenInfo.splitWordInfo && !includesEmptyWordDividers
          ? {
            ...childrenInfo.splitWordInfo,
            ancestorLineWhichEndsWithWord: [
              ...childrenInfo.splitWordInfo.ancestorLineWhichEndsWithWord,
              childrenInfo.splitWordInfo.commonAncestorArray,
              childrenInfo.splitWordInfo.commonAncestorArray[childrenInfo.splitWordInfo.indexOfChildOfCommonAncestor],
            ],
            commonAncestorArray: unitObjs,
            indexOfChildOfCommonAncestor: unitObjIndex,
          }
          : null
      }
    })

    return {
      groupedVerseObjects: unitObjs,
      splitWordInfo,
    }
  }

  let { groupedVerseObjects } = getGroupedVerseObjectsRecursive({ unitObjs: filteredVerseObjects })

  splitWordFixesInfo.forEach(splitWordFixInfo => {
    const { wordPartsInfo, ancestorList, commonAncestorArray } = splitWordFixInfo

    wordPartsInfo.forEach(wordPartInfo => delete wordPartInfo.obj.type)

    const newWordObj = {
      children: wordPartsInfo.map(({ obj, arrayContainingObj, childOfCommonAncestor }) => {

        const objIndex = arrayContainingObj.indexOf(obj)
        
        const newChild = getNewTagObjWithUnlistedChildrenFilterOut({
          unitObj: childOfCommonAncestor,
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
  const { verseObjects=[] } = usfmJS.toJSON(`\\c 1 \\v 1 ${usfmWithoutChapterAndVerse || '-'}`).chapters["1"]["1"]

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

export const splitVerseIntoWords = ({ usfm, wordDividerRegex }={}) => {

  const getWords = unitObjs => {
    let words = []

    const getWordText = unitObj => {
      const { text, children } = unitObj
      return text || (children && children.map(child => getWordText(child)).join("")) || ""
    }

    unitObjs.forEach(unitObj => {
      const { type, children } = unitObj

      if(type === "word") {
        words.push(getWordText(unitObj))
      } else if(children) {
        words = [
          ...words,
          ...getWords(children),
        ]
      }
    })

    return words
  }

  return getWords( getPiecesFromUSFM({ usfm, wordDividerRegex }) )
}
