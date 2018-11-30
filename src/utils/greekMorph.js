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
  PI: i18n("improper preposition", {}, "", "grammar"),
  DO: i18n("correlative", {}, "", "grammar"),
  CC: i18n("coordinating", {}, "", "grammar"),
  CS: i18n("subordinating", {}, "", "grammar"),
  CO: i18n("correlative", {}, "", "grammar"),
}

export const getGreekPOSTerm = posCode => (posTerms[posCode] || posTerms[posCode.substr(0,1)] || "")

export const getGreekPOSTypeTerm = posCode => (posTypeTerms[posCode] || "")

export const getGreekMorphPartDisplayInfo = ({ morphPart, isPrefixOrSuffix }) => {
  return {
    str: "",
    color: "black",
  }
}
