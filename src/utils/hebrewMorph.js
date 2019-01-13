import i18n from './i18n.js'

const posTerms = {
  A: i18n("adjective", {}, "", "grammar"),
  C: i18n("conjunction", {}, "", "grammar"),
  D: i18n("adverb", {}, "", "grammar"),
  N: i18n("noun", {}, "", "grammar"),
  P: i18n("pronoun", {}, "", "grammar"),
  R: i18n("preposition", {}, "", "grammar"),
  T: i18n("particle", {}, "", "grammar"),
  V: i18n("verb", {}, "", "grammar"),
}

export const getHebrewPOSTerm = posCode => (posTerms[posCode] || "")

const grammarTerms = {
  pos: {
    // These are the only pos's that I want to actually print
    // since others are shown in the Entry component
    C: posTerms.C,
    R: posTerms.R,
    D: posTerms.D,
  },
  person: {
    1: i18n("1st", {}, "", "grammar"),
    2: i18n("2nd", {}, "", "grammar"),
    3: i18n("3rd", {}, "", "grammar"),
  },
  gender: {
    m: i18n("masculine", {}, "", "grammar"),
    f: i18n("feminine", {}, "", "grammar"),
    b: i18n("gender-both", {}, "", "grammar"),
    c: i18n("common", {}, "", "grammar"),
  },
  number: {
    s: i18n("singular", {}, "", "grammar"),
    p: i18n("plural", {}, "", "grammar"),
    d: i18n("dual", {}, "", "grammar"),
  },
  state: {
    a: i18n("absolute", {}, "", "grammar"),
    c: i18n("construct", {}, "", "grammar"),
    d: i18n("determined", {}, "", "grammar"),
  },
  adjType: {
    c: i18n("cardinal-number", {}, "", "grammar"),
    o: i18n("ordinal-number", {}, "", "grammar"),
  },
  nounType: {
    g: i18n("gentilic", {}, "", "grammar"),
    p: i18n("proper-name", {}, "", "grammar"),
  },
  pronounType: {
    d: i18n("demonstrative", {}, "", "grammar"),
    f: i18n("indefinite", {}, "", "grammar"),
    i: i18n("interrogative", {}, "", "grammar"),
    p: i18n("personal", {}, "", "grammar"),
    r: i18n("relative", {}, "", "grammar"),
  },
  prepType: {
    d: i18n("definite-article", {}, "", "grammar"),
  },
  suffixType: {
    d: i18n("directional", {}, "", "grammar"),
    h: i18n("paragogic", {}, "", "grammar"),
    n: i18n("paragogic", {}, "", "grammar"),
  },
  particleType: {
    a: i18n("affirmation", {}, "", "grammar"),
    d: i18n("definite-article", {}, "", "grammar"),
    e: i18n("exhortation", {}, "", "grammar"),
    i: i18n("interrogative", {}, "", "grammar"),
    j: i18n("interjection", {}, "", "grammar"),
    m: i18n("demonstrative", {}, "", "grammar"),
    n: i18n("negative", {}, "", "grammar"),
    o: i18n("direct-object-marker", {}, "", "grammar"),
    r: i18n("relative", {}, "", "grammar"),
  },
  stemHe: {
    q: i18n("qal", {}, "", "grammar"),
    N: i18n("niphal", {}, "", "grammar"),
    p: i18n("piel", {}, "", "grammar"),
    P: i18n("pual", {}, "", "grammar"),
    h: i18n("hiphil", {}, "", "grammar"),
    H: i18n("hophal", {}, "", "grammar"),
    t: i18n("hithpael", {}, "", "grammar"),
    o: i18n("polel", {}, "", "grammar"),
    O: i18n("polal", {}, "", "grammar"),
    r: i18n("hithpolel", {}, "", "grammar"),
    m: i18n("poel", {}, "", "grammar"),
    M: i18n("poal", {}, "", "grammar"),
    k: i18n("palel", {}, "", "grammar"),
    K: i18n("pulal", {}, "", "grammar"),
    Q: i18n("qal passive", {}, "", "grammar"),
    l: i18n("pilpel", {}, "", "grammar"),
    L: i18n("polpal", {}, "", "grammar"),
    f: i18n("hithpalpel", {}, "", "grammar"),
    D: i18n("nithpael", {}, "", "grammar"),
    j: i18n("pealal", {}, "", "grammar"),
    i: i18n("pilel", {}, "", "grammar"),
    u: i18n("hothpaal", {}, "", "grammar"),
    c: i18n("tiphil", {}, "", "grammar"),
    v: i18n("hishtaphel", {}, "", "grammar"),
    w: i18n("nithpalel", {}, "", "grammar"),
    y: i18n("nithpoel", {}, "", "grammar"),
    z: i18n("hithpoel", {}, "", "grammar"),
  },
  stemAr: {
    q: i18n("peal", {}, "", "grammar"),
    Q: i18n("peil", {}, "", "grammar"),
    u: i18n("hithpeel", {}, "", "grammar"),
    N: i18n("niphal", {}, "", "grammar"),
    p: i18n("pael", {}, "", "grammar"),
    P: i18n("ithpaal", {}, "", "grammar"),
    M: i18n("hithpaal", {}, "", "grammar"),
    a: i18n("aphel", {}, "", "grammar"),
    h: i18n("haphel", {}, "", "grammar"),
    s: i18n("saphel", {}, "", "grammar"),
    e: i18n("shaphel", {}, "", "grammar"),
    H: i18n("hophal", {}, "", "grammar"),
    i: i18n("ithpeel", {}, "", "grammar"),
    t: i18n("hishtaphel", {}, "", "grammar"),
    v: i18n("ishtaphel", {}, "", "grammar"),
    w: i18n("hithaphel", {}, "", "grammar"),
    o: i18n("polel", {}, "", "grammar"),
    z: i18n("ithpoel", {}, "", "grammar"),
    r: i18n("hithpolel", {}, "", "grammar"),
    f: i18n("hithpalpel", {}, "", "grammar"),
    b: i18n("hephal", {}, "", "grammar"),
    c: i18n("tiphel", {}, "", "grammar"),
    m: i18n("poel", {}, "", "grammar"),
    l: i18n("palpel", {}, "", "grammar"),
    L: i18n("ithpalpel", {}, "", "grammar"),
    O: i18n("ithpolel", {}, "", "grammar"),
    G: i18n("ittaphal", {}, "", "grammar"),
  },
  aspect: {
    p: i18n("perfect", {}, "", "grammar"),
    q: i18n("sequential-perfect", {}, "", "grammar"),
    i: i18n("imperfect", {}, "", "grammar"),
    w: i18n("sequential-imperfect", {}, "", "grammar"),
    h: i18n("cohortative", {}, "", "grammar"),
    j: i18n("jussive", {}, "", "grammar"),
    v: i18n("imperative", {}, "", "grammar"),
    r: i18n("participle", {}, "", "grammar"),
    s: i18n("passive-participle", {}, "", "grammar"),
    a: i18n("infinitive-absolute", {}, "", "grammar"),
    c: i18n("infinitive-construct", {}, "", "grammar"),
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

export const getHebrewMorphPartDisplayInfo = ({ morphLang, morphPart, isPrefixOrSuffix, wordIsMultiPart }) => {

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
        pushTerm({ morphStrs, term: i18n("suffix", {}, "", "grammar") })
      }
      break

    case 'T':
      pushTerm({ morphStrs, term: grammarTerms.particleType[morphPartLetters[1]] })
      break

    case 'V':
      pushTerm({ morphStrs, term: grammarTerms[`stem${morphLang}`][morphPartLetters[1]] })
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
    str: morphStrs.join(i18n(" ", {}, "word separator")),
    color,
  }
}
