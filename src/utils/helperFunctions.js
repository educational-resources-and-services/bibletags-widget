import i18n from './i18n.js'
import { getHebrewPOSTerm, getHebrewMorphPartDisplayInfo } from './hebrewMorph.js'
import { getGreekPOSTerm, getGreekMorphPartDisplayInfo } from './greekMorph.js'

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

export const getPassageStr = ({ bookId, chapter, verse }) => (
  getBibleBookName(bookId) + (chapter == null ? `` : (` ${chapter}` + (verse == null ? `` : `:${verse}`)))
)

export const getBibleBookName = bookid => {

  return [
    "",
    i18n("Genesis", {}, "", "book"),
    i18n("Exodus", {}, "", "book"),
    i18n("Leviticus", {}, "", "book"),
    i18n("Numbers", {}, "", "book"),
    i18n("Deuteronomy", {}, "", "book"),
    i18n("Joshua", {}, "", "book"),
    i18n("Judges", {}, "", "book"),
    i18n("Ruth", {}, "", "book"),
    i18n("1 Samuel", {}, "", "book"),
    i18n("2 Samuel", {}, "", "book"),
    i18n("1 Kings", {}, "", "book"),
    i18n("2 Kings", {}, "", "book"),
    i18n("1 Chronicles", {}, "", "book"),
    i18n("2 Chronicles", {}, "", "book"),
    i18n("Ezra", {}, "", "book"),
    i18n("Nehemiah", {}, "", "book"),
    i18n("Esther", {}, "", "book"),
    i18n("Job", {}, "", "book"),
    i18n("Psalms", {}, "", "book"),
    i18n("Proverbs", {}, "", "book"),
    i18n("Ecclesiastes", {}, "", "book"),
    i18n("Song of Songs", {}, "", "book"),
    i18n("Isaiah", {}, "", "book"),
    i18n("Jeremiah", {}, "", "book"),
    i18n("Lamentations", {}, "", "book"),
    i18n("Ezekiel", {}, "", "book"),
    i18n("Daniel", {}, "", "book"),
    i18n("Hosea", {}, "", "book"),
    i18n("Joel", {}, "", "book"),
    i18n("Amos", {}, "", "book"),
    i18n("Obadiah", {}, "", "book"),
    i18n("Jonah", {}, "", "book"),
    i18n("Micah", {}, "", "book"),
    i18n("Nahum", {}, "", "book"),
    i18n("Habakkuk", {}, "", "book"),
    i18n("Zephaniah", {}, "", "book"),
    i18n("Haggai", {}, "", "book"),
    i18n("Zechariah", {}, "", "book"),
    i18n("Malachi", {}, "", "book"),
    i18n("Matthew", {}, "", "book"),
    i18n("Mark", {}, "", "book"),
    i18n("Luke", {}, "", "book"),
    i18n("John", {}, "", "book"),
    i18n("Acts", {}, "", "book"),
    i18n("Romans", {}, "", "book"),
    i18n("1 Corinthians", {}, "", "book"),
    i18n("2 Corinthians", {}, "", "book"),
    i18n("Galatians", {}, "", "book"),
    i18n("Ephesians", {}, "", "book"),
    i18n("Philippians", {}, "", "book"),
    i18n("Colossians", {}, "", "book"),
    i18n("1 Thessalonians", {}, "", "book"),
    i18n("2 Thessalonians", {}, "", "book"),
    i18n("1 Timothy", {}, "", "book"),
    i18n("2 Timothy", {}, "", "book"),
    i18n("Titus", {}, "", "book"),
    i18n("Philemon", {}, "", "book"),
    i18n("Hebrews", {}, "", "book"),
    i18n("James", {}, "", "book"),
    i18n("1 Peter", {}, "", "book"),
    i18n("2 Peter", {}, "", "book"),
    i18n("1 John", {}, "", "book"),
    i18n("2 John", {}, "", "book"),
    i18n("3 John", {}, "", "book"),
    i18n("Jude", {}, "", "book"),
    i18n("Revelation", {}, "", "book"),
  ][bookid]

}

export const getPOSTerm = ({ languageId, posCode }) => (
  languageId === 'heb' ? getHebrewPOSTerm(posCode) : getGreekPOSTerm(posCode)
)

export const getMorphPartDisplayInfo = ({ lang, morphPart, isPrefixOrSuffix, wordIsMultiPart }) => {
  return ['H','A'].includes(lang) ? getHebrewMorphPartDisplayInfo({ lang, morphPart, isPrefixOrSuffix, wordIsMultiPart }) : getGreekMorphPartDisplayInfo({ morphPart })
}

export const getMainWordPartIndex = wordParts => (wordParts ? (wordParts.length - (wordParts[wordParts.length - 1].match(/^S/) ? 2 : 1)) : null)

export const getStrongs = wordInfo => (wordInfo ? (wordInfo.strong || '').replace(/^[a-z]+:/, '') : '')

export const getIsEntirelyPrefixAndSuffix = wordInfo => (wordInfo && !getStrongs(wordInfo))
