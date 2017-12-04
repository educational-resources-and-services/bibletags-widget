/*

When `npm run buildAll` is executed, the following happens:
  * All code is combed for i18n functions so as to build out english ui language data to the db
  * If db was updated (i.e. if any english ui text is new or has changed):
    - flag completed translations of need to filler
    - email translators
  * This file is temporarily renamed
  * For each language with ui language data (except for English)
    - a file is created with the ui language data (per the example below) at this file's original URI
    - `npm run build` is executed
    - the contents of the build directory is renamed to buildAll/widget/${languageCode}
  * This file is restored
  * `npm run build` is executed
  * For each language without ui language data (including English)
    - the build directory is copied to buildAll/widget/${languageCode}
  * the buildAll/widget directory is uploaded to the aws s3

Example:

export default {
  "Library here!": "ספריה",
  "Library {{here}}!": "ספריה {{here}}",
  "Back": {
    "i.e. go back": "חזור",
    "i.e. the back of the book": "גב",
  },
}

*/

export default {}
  