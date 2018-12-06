import i18n from './i18n.js'

const posTerms = {
  N: i18n("noun", {}, "", "grammar"),
  A: i18n("adjective", {}, "", "grammar"),
  NS: i18n("adjective", {}, "", "grammar"),  // better categorized as an adjective
  NP: i18n("adjective", {}, "", "grammar"),  // better categorized as an adjective
  E: i18n("determiner", {}, "", "grammar"),
  R: i18n("pronoun", {}, "", "grammar"),
  V: i18n("verb", {}, "", "grammar"),
  I: i18n("interjection", {}, "", "grammar"),
  P: i18n("preposition", {}, "", "grammar"),
  D: i18n("adverb", {}, "", "grammar"),
  PI: i18n("adverb", {}, "", "grammar"),  // better categorized as an adverb
  C: i18n("conjunction", {}, "", "grammar"),
  T: i18n("particle", {}, "", "grammar"),
  TF: i18n("foreign", {}, "", "grammar"),  // better in its own category
}

const posTypeTerms = {
  NS: i18n("substantive", {}, "", "grammar"),
  NP: i18n("predicate", {}, "", "grammar"),
  AA: i18n("ascriptive", {}, "", "grammar"),
  AR: i18n("restrictive", {}, "", "grammar"),
  EA: i18n("article", {}, "", "grammar"),
  ED: i18n("demonstrative", {}, "", "grammar"),
  EF: i18n("differential", {}, "", "grammar"),
  EP: i18n("possessive", {}, "", "grammar"),
  EQ: i18n("quantifier", {}, "", "grammar"),
  EN: i18n("number", {}, "", "grammar"),
  EO: i18n("ordinal", {}, "", "grammar"),
  ER: i18n("relative", {}, "", "grammar"),
  ET: i18n("interrogative", {}, "", "grammar"),
  RD: i18n("demonstrative", {}, "", "grammar"),
  RP: i18n("personal", {}, "", "grammar"),
  RE: i18n("reflexive", {}, "", "grammar"),
  RC: i18n("reciprocal", {}, "", "grammar"),
  RI: i18n("indefinite", {}, "", "grammar"),
  RR: i18n("relative", {}, "", "grammar"),
  RT: i18n("interrogative", {}, "", "grammar"),
  VT: i18n("transitive", {}, "", "grammar"),
  VI: i18n("intransitive", {}, "", "grammar"),
  VL: i18n("linking", {}, "", "grammar"),
  VM: i18n("modal", {}, "", "grammar"),
  VP: i18n("periphrastic", {}, "", "grammar"),
  IE: i18n("exclamation", {}, "", "grammar"),
  ID: i18n("directive", {}, "", "grammar"),
  IR: i18n("response", {}, "", "grammar"),
  PI: i18n("improper-preposition", {}, "", "grammar"),
  DO: i18n("correlative", {}, "", "grammar"),
  CC: i18n("coordinating", {}, "", "grammar"),
  CS: i18n("subordinating", {}, "", "grammar"),
  CO: i18n("correlative", {}, "", "grammar"),
}

const morphTerms = [
  { // mood
    I: i18n("indicative", {}, "", "grammar"),
    M: i18n("imperative", {}, "", "grammar"),
    S: i18n("subjunctive", {}, "", "grammar"),
    O: i18n("optative", {}, "", "grammar"),
    N: i18n("infinitive", {}, "", "grammar"),
    P: i18n("participle", {}, "", "grammar"),
  },
  { // tense
    P: i18n("present", {}, "", "grammar"),
    I: i18n("imperfect", {}, "", "grammar"),
    F: i18n("future", {}, "", "grammar"),
    A: i18n("aorist", {}, "", "grammar"),
    E: i18n("perfect", {}, "", "grammar"),
    L: i18n("pluperfect", {}, "", "grammar"),
  },
  { // voice
    A: i18n("active", {}, "", "grammar"),
    M: i18n("middle", {}, "", "grammar"),
    P: i18n("passive", {}, "", "grammar"),
  },
  { // person
    1: i18n("1st", {}, "", "grammar"),
    2: i18n("2nd", {}, "", "grammar"),
    3: i18n("3rd", {}, "", "grammar"),
  },
  { // case
    N: i18n("nominative", {}, "", "grammar"),
    G: i18n("genitive", {}, "", "grammar"),
    D: i18n("dative", {}, "", "grammar"),
    A: i18n("accusative", {}, "", "grammar"),
    V: i18n("vocative", {}, "", "grammar"),
  },
  { // gender
    M: i18n("masculine", {}, "", "grammar"),
    F: i18n("feminine", {}, "", "grammar"),
    N: i18n("neuter", {}, "", "grammar"),
  },
  { // number
    S: i18n("singular", {}, "", "grammar"),
    P: i18n("plural", {}, "", "grammar"),
  },
  { // other
    C: i18n("comparative", {}, "", "grammar"),
    S: i18n("superlatives", {}, "", "grammar"),
    D: i18n("diminutive", {}, "", "grammar"),
    I: i18n("indeclinable", {}, "", "grammar"),
  },
]


export const getNormalizedGreekPOSCode = posCode => (posTerms[posCode] !== undefined ? posCode : posCode.substr(0,1))

export const getGreekPOSTerm = posCode => (posTerms[getNormalizedGreekPOSCode(posCode)] || "")

export const getGreekPOSTypeTerm = posCode => (posTypeTerms[posCode] || "")

export const getGreekMorphPartDisplayInfo = ({ morphPart }) => {
  const posCode = morphPart.substr(0,2)
  const morphCodes = morphPart.substr(2).split('')

  const parsingDisplayPieces = [
    // getGreekPOSTerm(posCode),  // Shown in the POS list; TODO: make present POS stand out in list
    getGreekPOSTypeTerm(posCode),
    ...morphTerms.map((category, index) => (category[morphCodes[index]] || "")),
  ]

  return {
    str: parsingDisplayPieces.filter(piece => !!piece).join(i18n(" ", {}, "word separator")),
    color: "black",
  }
}
