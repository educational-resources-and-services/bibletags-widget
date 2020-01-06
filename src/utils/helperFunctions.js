import React from 'react'
import md5 from 'md5'
import i18n from './i18n.js'
import { getHebrewPOSTerm, getHebrewMorphPartDisplayInfo } from './hebrewMorph.js'
import { getGreekPOSTerm, getGreekMorphPartDisplayInfo } from './greekMorph.js'
import { getRefFromLoc } from 'bibletags-versification/src/versification'
import { splitVerseIntoWords } from './splitting.js'

const hashParametersObject = {}
window.location.hash
  .split('#')
  .slice(1)
  .join('#')
  .split('&')
  .forEach(arg => {
    const argParts = arg.split('=');
    hashParametersObject[argParts[0]] = argParts[1];
  })

export const getHashParameter = param => hashParametersObject[param]

export const getOrigLangVersionIdFromRef = ref => ref.bookId <= 39 ? 'uhb' : 'ugnt'

export const getOrigLangAndLXXVersionInfo = () => ({
  uhb: {
    id: 'uhb',
    name: 'unfoldingWord Hebrew Bible',
    languageId: 'heb',
    partialScope: 'ot',
    versificationModel: 'original',
    isOriginal: true,
  },
  ugnt: {
    id: 'ugnt',
    name: 'unfoldingWord Greek New Testament',
    languageId: 'grc',
    partialScope: 'nt',
    versificationModel: 'original',
    isOriginal: true,
  },
  lxx: {
    id: 'lxx',
    name: 'Rahlfs Septuagint',
    languageId: 'grc',
    partialScope: 'ot',
    versificationModel: 'lxx',
  },
})

export const getOrigLanguageText = languageId => {
  return {
    heb: i18n("Hebrew"),
    grc: i18n("Greek"),
  }[languageId]
}

export const getVersionStr = versionId => {
  const origLangAndLXXVersionInfo = getOrigLangAndLXXVersionInfo()

  return origLangAndLXXVersionInfo[versionId]
    ? `${getOrigLanguageText(origLangAndLXXVersionInfo[versionId].languageId)} (${versionId.toUpperCase()})`
    : versionId.toUpperCase()
}

export const getPassageStr = ({ refs, skipBookName }) => {
  let info = {}

  refs.forEach(ref => {
    const { wordRanges } = ref
    const { bookId, chapter, verse } = ref.loc ? getRefFromLoc(ref.loc) : ref

    if(info.book === undefined) {
      info.book = skipBookName ? "" : getBibleBookName(bookId)
    }
      
    if(chapter != null) {
      if(!info.chapter && !info.start_chapter) {
        info.chapter = chapter
      } else if((info.chapter || info.start_chapter) !== chapter) {
        info.start_chapter = info.start_chapter || info.chapter
        info.end_chapter = chapter
        delete info.chapter
      }
    }

    if(verse != null) {
      let verseText
      if(wordRanges) {
        verseText = wordRanges[0].substr(0,1) === '1'
          ? i18n("{{verse}}a", { verse })
          : i18n("{{verse}}b", { verse })
      } else {
        verseText = verse
      }
      if(!info.verse && !info.start_verse) {
        info.verse = verseText
      } else {
        info.start_verse = info.start_verse || info.verse
        info.end_verse = verseText
        delete info.verse
      }
    }
  })

  if(info.start_chapter && info.start_verse) {
    return i18n("{{book}} {{start_chapter}}:{{start_verse}}–{{end_chapter}}:{{end_verse}}", info).trim()
  }

  if(info.chapter && info.start_verse) {
    return i18n("{{book}} {{chapter}}:{{start_verse}}–{{end_verse}}", info).trim()
  }

  if(info.start_chapter) {
    return i18n("{{book}} {{start_chapter}}–{{end_chapter}}", info).trim()
  }

  if(info.verse) {
    return i18n("{{book}} {{chapter}}:{{verse}}", info).trim()
  }

  if(info.chapter) {
    return i18n("{{book}} {{chapter}}", info).trim()
  }

  return info.book || ""
}

export const getBibleBookName = bookid => {

  return [
    "",
    i18n("Genesis", "", "book"),
    i18n("Exodus", "", "book"),
    i18n("Leviticus", "", "book"),
    i18n("Numbers", "", "book"),
    i18n("Deuteronomy", "", "book"),
    i18n("Joshua", "", "book"),
    i18n("Judges", "", "book"),
    i18n("Ruth", "", "book"),
    i18n("1 Samuel", "", "book"),
    i18n("2 Samuel", "", "book"),
    i18n("1 Kings", "", "book"),
    i18n("2 Kings", "", "book"),
    i18n("1 Chronicles", "", "book"),
    i18n("2 Chronicles", "", "book"),
    i18n("Ezra", "", "book"),
    i18n("Nehemiah", "", "book"),
    i18n("Esther", "", "book"),
    i18n("Job", "", "book"),
    i18n("Psalms", "", "book"),
    i18n("Proverbs", "", "book"),
    i18n("Ecclesiastes", "", "book"),
    i18n("Song of Songs", "", "book"),
    i18n("Isaiah", "", "book"),
    i18n("Jeremiah", "", "book"),
    i18n("Lamentations", "", "book"),
    i18n("Ezekiel", "", "book"),
    i18n("Daniel", "", "book"),
    i18n("Hosea", "", "book"),
    i18n("Joel", "", "book"),
    i18n("Amos", "", "book"),
    i18n("Obadiah", "", "book"),
    i18n("Jonah", "", "book"),
    i18n("Micah", "", "book"),
    i18n("Nahum", "", "book"),
    i18n("Habakkuk", "", "book"),
    i18n("Zephaniah", "", "book"),
    i18n("Haggai", "", "book"),
    i18n("Zechariah", "", "book"),
    i18n("Malachi", "", "book"),
    i18n("Matthew", "", "book"),
    i18n("Mark", "", "book"),
    i18n("Luke", "", "book"),
    i18n("John", "", "book"),
    i18n("Acts", "", "book"),
    i18n("Romans", "", "book"),
    i18n("1 Corinthians", "", "book"),
    i18n("2 Corinthians", "", "book"),
    i18n("Galatians", "", "book"),
    i18n("Ephesians", "", "book"),
    i18n("Philippians", "", "book"),
    i18n("Colossians", "", "book"),
    i18n("1 Thessalonians", "", "book"),
    i18n("2 Thessalonians", "", "book"),
    i18n("1 Timothy", "", "book"),
    i18n("2 Timothy", "", "book"),
    i18n("Titus", "", "book"),
    i18n("Philemon", "", "book"),
    i18n("Hebrews", "", "book"),
    i18n("James", "", "book"),
    i18n("1 Peter", "", "book"),
    i18n("2 Peter", "", "book"),
    i18n("1 John", "", "book"),
    i18n("2 John", "", "book"),
    i18n("3 John", "", "book"),
    i18n("Jude", "", "book"),
    i18n("Revelation", "", "book"),
  ][bookid]

}

export const getPOSTerm = ({ languageId, posCode }) => (
  languageId === 'heb' ? getHebrewPOSTerm(posCode) : getGreekPOSTerm(posCode)
)

export const getMorphPartDisplayInfo = ({ morphLang, morphPart, isPrefixOrSuffix, wordIsMultiPart }) => {
  return ['He','Ar'].includes(morphLang) ? getHebrewMorphPartDisplayInfo({ morphLang, morphPart, isPrefixOrSuffix, wordIsMultiPart }) : getGreekMorphPartDisplayInfo({ morphPart })
}

// same as in bibletags-data/scripts/importUHBFromOsis.js
export const getMainWordPartIndex = wordParts => {
  if(!wordParts) return null

  for(let idx = wordParts.length - 1; idx >= 0; idx--) {
    if(!wordParts[idx].match(/^S/)) {
      return idx
    }
  }
}
export const getStrongs = wordInfo => (wordInfo ? (wordInfo.strong || '').replace(/^[a-z]+:|\+$/, '') : '')

export const getIsEntirelyPrefixAndSuffix = wordInfo => (wordInfo && !getStrongs(wordInfo))

const hexToBase64 = hex => btoa(hex.match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join(""))

// FYI: maximum length of 32-digit base16 (hex) is 22-digits, though it is buffered to 24 digits with ='s
export const hash64 = str => hexToBase64(md5(str))

export const getWordsHash = ({ usfm, wordDividerRegex }) => {

  const words = splitVerseIntoWords({
    usfm,
    wordDividerRegex,
  })

  // The following line gets me a base64 2-digit hash for each word. This
  // leaves 4096 possible values for each word which makes the likelihood
  // of two different word sets with the same hash values very, very low.
  // Two different editions of a single text would need to have all the same
  // words except one, and that one word switch would only have a 1/4096
  // chance of getting an equivelant hash.
  return words.map(word => hash64(word).substr(0,2)).join('')
}

export const getWordHashes = ({ usfm, wordDividerRegex }) => {

  const words = splitVerseIntoWords({
    usfm,
    wordDividerRegex,
  })

  return words.map((word, index) => ({
    wordNumberInVerse: index + 1,
    hash: hash64(word),
    withBeforeHash: hash64(JSON.stringify(words.slice(index === 0 ? 0 : index-1, index+1))),
    withAfterHash: hash64(JSON.stringify(words.slice(index, index+2))),
    withBeforeAndAfterHash: hash64(JSON.stringify(words.slice(index === 0 ? 0 : index-1, index+2))),
  }))
}

export const isValidEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export const isValidToken = token => {
  const re = /^[A-Z0-9]{3}-?[A-Z0-9]{3}$/
  return re.test(token.trim())
}

export const omit = ({ props, omitKeys = [] }) => {
  const returnObj = Object.assign({}, props)
  omitKeys.forEach(omitKey => {
    delete returnObj[omitKey]
  })
  return returnObj
}

export const stripProps = (Component, omitKeys) => (props => <Component {...omit({props, omitKeys})} />)
