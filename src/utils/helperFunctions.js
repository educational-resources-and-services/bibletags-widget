import i18n from './i18n.js'
import rewritePattern  from 'regexpu-core'
import { getCorrespondingVerseLocation } from 'bibletags-versification'

const i18nBook = str => i18n(str, {}, "", "book")
const i18nGrammar = str => i18n(str, {}, "", "grammar")

export const hashParametersObject = {}
window.location.hash
  .split('#')
  .slice(1)
  .join('#')
  .split('&')
  .forEach(arg => {
    const argParts = arg.split('=');
    hashParametersObject[argParts[0]] = argParts[1];
  })

export const formLoc = ({ bookId, chapter, verse }) => (
  `${('0'+bookId).substr(-2)}${('00'+chapter).substr(-3)}${('00'+verse).substr(-3)}`
)

export const studyVersions = {
  oshb: {
    info: {
      id: 'oshb',
      partialScope: 'ot',
      versificationModel: 'original',
    },
    language: 'heb',
  },
  bhp: {
    info: {
      id: 'bhp',
      partialScope: 'nt',
      versificationModel: 'original',
    },
    language: 'grc',
  },
  lxx: {
    info: {
      id: 'lxx',
      partialScope: 'ot',
      versificationModel: 'original',
    },
    language: 'grc',
  },
}

export const studyLanguage = {
  heb: i18n("Hebrew"),
  grc: i18n("Greek"),
}

export const getVersionStr = versionId => {

  return studyVersions[versionId]
    ? `${studyLanguage[studyVersions[versionId].language]} (${versionId.toUpperCase()})`
    : versionId.toUpperCase()

}

export const getPassageStr = ({ bookId, chapter, verse }) => {
  return `${getBibleBookName(bookId)} ${chapter}` + (verse != null ? `:${verse}` : ``)
}

export const getBibleBookName = bookid => {

  return [
    "",
    i18nBook("Genesis"),
    i18nBook("Exodus"),
    i18nBook("Leviticus"),
    i18nBook("Numbers"),
    i18nBook("Deuteronomy"),
    i18nBook("Joshua"),
    i18nBook("Judges"),
    i18nBook("Ruth"),
    i18nBook("1 Samuel"),
    i18nBook("2 Samuel"),
    i18nBook("1 Kings"),
    i18nBook("2 Kings"),
    i18nBook("1 Chronicles"),
    i18nBook("2 Chronicles"),
    i18nBook("Ezra"),
    i18nBook("Nehemiah"),
    i18nBook("Esther"),
    i18nBook("Job"),
    i18nBook("Psalms"),
    i18nBook("Proverbs"),
    i18nBook("Ecclesiastes"),
    i18nBook("Song of Songs"),
    i18nBook("Isaiah"),
    i18nBook("Jeremiah"),
    i18nBook("Lamentations"),
    i18nBook("Ezekiel"),
    i18nBook("Daniel"),
    i18nBook("Hosea"),
    i18nBook("Joel"),
    i18nBook("Amos"),
    i18nBook("Obadiah"),
    i18nBook("Jonah"),
    i18nBook("Micah"),
    i18nBook("Nahum"),
    i18nBook("Habakkuk"),
    i18nBook("Zephaniah"),
    i18nBook("Haggai"),
    i18nBook("Zechariah"),
    i18nBook("Malachi"),
    i18nBook("Matthew"),
    i18nBook("Mark"),
    i18nBook("Luke"),
    i18nBook("John"),
    i18nBook("Acts"),
    i18nBook("Romans"),
    i18nBook("1 Corinthians"),
    i18nBook("2 Corinthians"),
    i18nBook("Galatians"),
    i18nBook("Ephesians"),
    i18nBook("Philippians"),
    i18nBook("Colossians"),
    i18nBook("1 Thessalonians"),
    i18nBook("2 Thessalonians"),
    i18nBook("1 Timothy"),
    i18nBook("2 Timothy"),
    i18nBook("Titus"),
    i18nBook("Philemon"),
    i18nBook("Hebrews"),
    i18nBook("James"),
    i18nBook("1 Peter"),
    i18nBook("2 Peter"),
    i18nBook("1 John"),
    i18nBook("2 John"),
    i18nBook("3 John"),
    i18nBook("Jude"),
    i18nBook("Revelation"),
  ][bookid]

}

export const posTerms = {
  A: i18nGrammar("adjective"),
  C: i18nGrammar("conjunction"),
  D: i18nGrammar("adverb"),
  N: i18nGrammar("noun"),
  P: i18nGrammar("pronoun"),
  R: i18nGrammar("preposition"),
  T: i18nGrammar("particle"),
  V: i18nGrammar("verb"),
}

const grammarTerms = {
  pos: {
    // These are the only pos's that I want to actually print
    // since others are shown in the Entry component
    C: posTerms.C,
    R: posTerms.R,
    D: posTerms.D,
  },
  person: {
    1: i18nGrammar("1st"),
    2: i18nGrammar("2nd"),
    3: i18nGrammar("3rd"),
  },
  gender: {
    m: i18nGrammar("masculine"),
    f: i18nGrammar("feminine"),
    b: i18nGrammar("gender-both"),
    c: i18nGrammar("common"),
  },
  number: {
    s: i18nGrammar("singular"),
    p: i18nGrammar("plural"),
    d: i18nGrammar("dual"),
  },
  state: {
    a: i18nGrammar("absolute"),
    c: i18nGrammar("construct"),
    d: i18nGrammar("determined"),
  },
  adjType: {
    c: i18nGrammar("cardinal-number"),
    o: i18nGrammar("ordinal-number"),
  },
  nounType: {
    g: i18nGrammar("gentilic"),
    p: i18nGrammar("proper-name"),
  },
  pronounType: {
    d: i18nGrammar("demonstrative"),
    f: i18nGrammar("indefinite"),
    i: i18nGrammar("interrogative"),
    p: i18nGrammar("personal"),
    r: i18nGrammar("relative"),
  },
  prepType: {
    d: i18nGrammar("definite-article"),
  },
  suffixType: {
    d: i18nGrammar("directional"),
    h: i18nGrammar("paragogic"),
    n: i18nGrammar("paragogic"),
  },
  particleType: {
    a: i18nGrammar("affirmation"),
    d: i18nGrammar("definite-article"),
    e: i18nGrammar("exhortation"),
    i: i18nGrammar("interrogative"),
    j: i18nGrammar("interjection"),
    m: i18nGrammar("demonstrative"),
    n: i18nGrammar("negative"),
    o: i18nGrammar("direct-object-marker"),
    r: i18nGrammar("relative"),
  },
  stemH: {
    q: i18nGrammar("qal"),
    N: i18nGrammar("niphal"),
    p: i18nGrammar("piel"),
    P: i18nGrammar("pual"),
    h: i18nGrammar("hiphil"),
    H: i18nGrammar("hophal"),
    t: i18nGrammar("hithpael"),
    o: i18nGrammar("polel"),
    O: i18nGrammar("polal"),
    r: i18nGrammar("hithpolel"),
    m: i18nGrammar("poel"),
    M: i18nGrammar("poal"),
    k: i18nGrammar("palel"),
    K: i18nGrammar("pulal"),
    Q: i18nGrammar("qal passive"),
    l: i18nGrammar("pilpel"),
    L: i18nGrammar("polpal"),
    f: i18nGrammar("hithpalpel"),
    D: i18nGrammar("nithpael"),
    j: i18nGrammar("pealal"),
    i: i18nGrammar("pilel"),
    u: i18nGrammar("hothpaal"),
    c: i18nGrammar("tiphil"),
    v: i18nGrammar("hishtaphel"),
    w: i18nGrammar("nithpalel"),
    y: i18nGrammar("nithpoel"),
    z: i18nGrammar("hithpoel"),
  },
  stemA: {
    q: i18nGrammar("peal"),
    Q: i18nGrammar("peil"),
    u: i18nGrammar("hithpeel"),
    N: i18nGrammar("niphal"),
    p: i18nGrammar("pael"),
    P: i18nGrammar("ithpaal"),
    M: i18nGrammar("hithpaal"),
    a: i18nGrammar("aphel"),
    h: i18nGrammar("haphel"),
    s: i18nGrammar("saphel"),
    e: i18nGrammar("shaphel"),
    H: i18nGrammar("hophal"),
    i: i18nGrammar("ithpeel"),
    t: i18nGrammar("hishtaphel"),
    v: i18nGrammar("ishtaphel"),
    w: i18nGrammar("hithaphel"),
    o: i18nGrammar("polel"),
    z: i18nGrammar("ithpoel"),
    r: i18nGrammar("hithpolel"),
    f: i18nGrammar("hithpalpel"),
    b: i18nGrammar("hephal"),
    c: i18nGrammar("tiphel"),
    m: i18nGrammar("poel"),
    l: i18nGrammar("palpel"),
    L: i18nGrammar("ithpalpel"),
    O: i18nGrammar("ithpolel"),
    G: i18nGrammar("ittaphal"),
  },
  aspect: {
    p: i18nGrammar("perfect"),
    q: i18nGrammar("sequential-perfect"),
    i: i18nGrammar("imperfect"),
    w: i18nGrammar("sequential-imperfect"),
    h: i18nGrammar("cohortative"),
    j: i18nGrammar("jussive"),
    v: i18nGrammar("imperative"),
    r: i18nGrammar("participle"),
    s: i18nGrammar("passive-participle"),
    a: i18nGrammar("infinitive-absolute"),
    c: i18nGrammar("infinitive-construct"),
  },
}

const grammarColors = {
  C: "#C95047",
  R: "#84A671",
  Sd: "#24ada8",
  Sh: "#77777A",
  Sn: "#77777A",
  Sp: "#BDAC59",
  Td: "#5C829A",
  Tr: "#b73ecc",
  Ti: "#D68945",
}

export const getGrammarColor = ({ isPrefixOrSuffix, morphPart="" }) => (
  (isPrefixOrSuffix && (grammarColors[morphPart.substr(0,2)] || grammarColors[morphPart.substr(0,1)])) || ""  
)

const pushTerm = ({ morphStrs, term }) => term && morphStrs.push(term)

const pushGenderNumberState = ({ morphStrs, morphPartLetters }) => {
  pushTerm({ morphStrs, term: grammarTerms.gender[morphPartLetters[0]] })
  pushTerm({ morphStrs, term: grammarTerms.number[morphPartLetters[1]] })
  pushTerm({ morphStrs, term: grammarTerms.state[morphPartLetters[2]] })
}

const pushPersonGenderNumber = ({ morphStrs, morphPartLetters }) => {
  pushTerm({ morphStrs, term: grammarTerms.person[morphPartLetters[0]] })
  pushTerm({ morphStrs, term: grammarTerms.gender[morphPartLetters[1]] })
  pushTerm({ morphStrs, term: grammarTerms.number[morphPartLetters[2]] })
}

const getHebrewMorphPartDisplayInfo = ({ lang, morphPart, isPrefixOrSuffix, wordIsMultiPart }) => {

  const morphPartLetters = morphPart.split("")
  const morphStrs = []
  const color = getGrammarColor({ isPrefixOrSuffix, morphPart })

  // prevent empty parsing before or after +
  wordIsMultiPart && pushTerm({ morphStrs, term: grammarTerms.pos[morphPartLetters[0]] })

  switch(morphPartLetters[0]) {
    case 'A':
      pushTerm({ morphStrs, term: grammarTerms.adjType[morphPartLetters[1]] })
      pushGenderNumberState({ morphStrs, morphPartLetters: morphPartLetters.slice(2) })
      break

    case 'N':
      pushTerm({ morphStrs, term: grammarTerms.nounType[morphPartLetters[1]] })
      pushGenderNumberState({ morphStrs, morphPartLetters: morphPartLetters.slice(2) })
      break

    case 'P':
      pushTerm({ morphStrs, term: grammarTerms.pronounType[morphPartLetters[1]] })
      pushGenderNumberState({ morphStrs, morphPartLetters: morphPartLetters.slice(2) })
      break

    case 'R':
      pushTerm({ morphStrs, term: grammarTerms.prepType[morphPartLetters[1]] })
      break

    case 'S':
      pushTerm({ morphStrs, term: grammarTerms.suffixType[morphPartLetters[1]] })
      if(morphPartLetters[1] === 'p') {
        pushPersonGenderNumber({ morphStrs, morphPartLetters: morphPartLetters.slice(2,5) })
        pushTerm({ morphStrs, term: i18nGrammar("suffix") })
      }
      break

    case 'T':
      pushTerm({ morphStrs, term: grammarTerms.particleType[morphPartLetters[1]] })
      break

    case 'V':
      pushTerm({ morphStrs, term: grammarTerms[`stem${lang}`][morphPartLetters[1]] })
      if(['r','s'].includes(morphPartLetters[2])) {
        pushTerm({ morphStrs, term: grammarTerms.aspect[morphPartLetters[2]] })
        pushGenderNumberState({ morphStrs, morphPartLetters: morphPartLetters.slice(3) })
      } else if(['a','c'].includes(morphPartLetters[2])) {
        pushTerm({ morphStrs, term: grammarTerms.aspect[morphPartLetters[2]] })
      } else {
        pushTerm({ morphStrs, term: grammarTerms.aspect[morphPartLetters[2]] })
        pushPersonGenderNumber({ morphStrs, morphPartLetters: morphPartLetters.slice(3) })
      }
      break
      
    default:
      break
  }

  return {
    str: morphStrs.join(' '),
    color,
  }
}

export const getGreekMorphPartDisplayInfo = ({ morphPart, isPrefixOrSuffix }) => {
  return {
    str: "",
    color: "black",
  }
}

export const getMorphPartDisplayInfo = ({ lang, morphPart, isPrefixOrSuffix, wordIsMultiPart }) => {
  return ['H','A'].includes(lang) ? getHebrewMorphPartDisplayInfo({ lang, morphPart, isPrefixOrSuffix, wordIsMultiPart }) : getGreekMorphPartDisplayInfo({ morphPart, isPrefixOrSuffix })
}

export const usfmToJSON = usfm => {

  const wordRegex = /^\\w (.*?[^\\])(?:\|(.*))?\\w\*$/

  return usfm.split(/(\\w .*?\\w\*)/g).filter(fragment => fragment !== '').map(fragment => {

    if(fragment.match(wordRegex)) {
      const attributes = {}
      fragment
        .replace(wordRegex, '$2')
        .trim()
        .match(/\S+=["']?(?:.(?!["']?\s+(?:\S+)=|[>"']))+.["']?/g)
        .forEach(attribute => {
          const attributePieces = attribute.split('=')
          attributes[attributePieces[0]] = attributePieces.splice(1).join('=').replace(/^"(.*)"$|'(.*)'^$/, '$1')
        })

      return {
        parts: fragment.replace(wordRegex, '$1').split(/\//g),
        attributes,
      }

    } else {
      return fragment
    }

  })
}

export const getMainWordPartIndex = wordParts => (wordParts ? (wordParts.length - (wordParts[wordParts.length - 1].match(/^S/) ? 2 : 1)) : null)

export const getStrongs = wordInfo => (wordInfo ? (wordInfo.attributes.strong || '').replace(/^[a-z]+:/, '') : '')

export const getIsEntirelyPrefixAndSuffix = wordInfo => (wordInfo && !getStrongs(wordInfo))

export const getCorrespondingVerseLocations = ({ baseVersion={}, lookupVersionInfos=[] }={}) => {
  
  const correspondingVerseLocations = {}

  lookupVersionInfos.forEach(lookupVersionInfo => {
    correspondingVerseLocations.push({
      id: lookupVersionInfo.id,
      refs: getCorrespondingVerseLocation({ baseVersion, lookupVersionInfo }),
    })
  })

  return correspondingVerseLocations
}

export const splitVerseIntoWords = ({ ref: { usfm }, wordDividerRegex }={}) => {

  const wordDividerRegexRewritten = new RegExp(rewritePattern(wordDividerRegex || '[\\P{L}]+', 'u', {
    unicodePropertyEscape: true,
  }), 'g')

  return usfm

    // escape apostraphes
    .replace(/(\w)’(\w)/g, "$1ESCAPEDAPOSTRAPHE$2")

    // split to words
    .split(wordDividerRegexRewritten)

    // unescape apostraphes
    .map(word => word.replace(/ESCAPEDAPOSTRAPHE/g, "’"))

    // filter out empties
    .filter(word => word !== "")
}
