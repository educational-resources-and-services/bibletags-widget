/*

  Assumptions:
    * Most of the time, the exact same English text should be translated the same. 

  Concept: As this code will be reused often to spin off new apps, make it easy to "flip a switch" and choose the language.

  ** English is written inline with i18n wrapper around it.

  Usage examples:
    i18n("Library")
    i18n("{{num_results}} results!", { num_results: this.props.numResults })
    i18n("Back", {}, "i.e. go back")
    i18n("Back", {}, "i.e. the back of the book")  // Differing descriptions create separate variables to translate
    i18n("John", {}, "", "book")  // Optionally include category as fourth parameter ("book" or "grammar")

  When `npm run build` is executed, the following needs to happen:
    * `react-scripts build` is executed, creating /build
    * All code is combed for i18n functions so as to build out JSON file with this information
      - place this file (language.json) also in the /build dir
    * /build uploaded to aws s3 (or do this manually)
    
*/

let translations = {}
let language = 'eng'

export const setUpI18n = async uiLanguageCode => {
  language = uiLanguageCode

  /*
    To get proper ui language (if not english):
      - change language = uiLanguageCode
      - fetch the language.json file + graphql:uiWords
        - once/day: on initial load, check the localstorage variable named lastLanguageFetch (or the like)
        - App component needs to render a spinner until this JSON is fetched
          - otherwise, english language will get stuck in the ui
        - will need to convert [UIWord] into object like the example below
        - If there are str/desc combos in language.json that do not exist in [UIWord]...
          - flag users who have contributed (now or in the past) of the need for translation

    Example resulting translations variable:
      const translations = {
        "Library here!": "ספריה",
        "Library {{here}}!": "ספריה {{here}}",
        "Back": {
          "i.e. go back": "חזור",
          "i.e. the back of the book": "גב",
        },
      }
  */
}

export const getLanguage = () => language

const i18n = (str, swaps={}, desc="") => 
  (
    translations[str]!==undefined
      ? (
        translations[str][desc]!==undefined
          ? translations[str][desc]
          : translations[str]
      )
      : str
  ).replace(/{{([^}]+)}}/g, (x, swapSpot) => swaps[swapSpot]!==undefined ? swaps[swapSpot] : "")

export default i18n