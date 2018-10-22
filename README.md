# Bible Tags

## About

*Original language Bible study for everyone, in every language.*

Vision: That every Christian might have free access to the Bible tagged to the original Hebrew, Aramaic and Greek with parsing and lexical information—all in their own language.

For more information on this project, see the [Bible Tags website](https://bibletags.org).


## Roadmap

* getCorrespondingVerseLocations + splitVerseIntoWords
  * functions actually working properly
  * Get preload working with verse content.
  * no visuals in utility instance
  * Make promises an option in addition to callbacks?
* Ability to send in English verse in plaintext
* Send in multiple versions
* Get Greek NT working
* Get LXX working
* infoCallback
* Authentication
* Get basic tagging functionality working
* Get working for other languages
* Test that uiLanguageCode works correctly
* hideVerse
* hideOriginal
* addlOptions
* Get usfm working, and add examples to the API docs
  * fetchVerseCallback
* jumpToLocation
* Search
  * Inline + searchData
  * Established Bible search languages to consider: json-ld, named attributes, url-query
    * Use same search language that Biblearc 3.0 will employ
  * Canonical identification of lemmas
    * https://www.academia.edu/35220175/Linking_Lexical_Resources_for_Biblical_Greek
    * https://git.door43.org/Door43/UGNT/src/tw_occurrences/57-TIT.usfm#L19
* Themes
* set up thayers and bdb (as temp lexicon entry until I get English parsing data)
* Make sure widget-script includes all API aspects it needs to so as to not require foreseeable changes.
* Indicate in API which pieces are and are not yet implemented
  * Examine mock ups and docs to see what remain of initial design and add them to the roadmap
* Test all implemented aspects of the API
* Do first beta releases
* Get working on Biblearc
* Get marketing site working (with ways to stay in contact/contribute/etc)
* Make API docs an HTML file at bibletags.org
* Make public
* Email announcement

Post-launch:

* Add in the ability to edit and verify parsings
* Write an original language reference tagger using Biblearc
* Make an npm module for using in a React app
* Offline
* Create the React Native template apps
* containerElTargetScroll


## Report a bug / request a feature

* Use this repository's [Issues](https://github.com/educational-resources-and-services/bibletags-widget/issues). Please first check if your bug report / feature request already exists before submitting a new issue.
* For bug reports, please provide a clear description of the problem and step-by-step explanation of how to reproduce it.
* For feature requests, please first get to the know the project via the [Design](#design) section below and review the [Roadmap](#roadmap) above to make sure the desired feature is inline with the direction this project is heading.


## Open source alignment data

If you are aware of any open source word alignment data (what we call Bible tags) for a particular Bible translation, please [bring it to our attention](https://bibletags.org/contact) and we will gladly make use of it. Both full alignment data, as well as data which simply includes the Strongs number or lemma for each word in the translation, are useful.


## Contributing

* Get to know the project via the [Design](#design) section below and the [Roadmap](#roadmap) above.
* Submit pull requests to fix bugs from [Issues](https://github.com/educational-resources-and-services/bibletags-widget/issues) and implement features that fall within the Roadmap. You would be wise to examine the [active branches](https://github.com/educational-resources-and-services/bibletags-widget/branches/active) so as to avoid taking up a feature that someone else is already actively working on.
* Please take note of the present coding style and do your best to write new code that accords with it.


## Installation

* `bibletags-data` (backend)
  * Clone the [bibletags-data](https://github.com/educational-resources-and-services/bibletags-data) repository.
  * Run `npm run setup` in the base directory of this repository.
* `bibletags-widget`
  * Clone this repository.


## Development

* Run `npm start` from the base directory of the [bibletags-data](https://github.com/educational-resources-and-services/bibletags-data) repository in one terminal window.
* Run `npm start` in the `widget` directory of this repository in different terminal window.
* Open `test.html` in your browser.

Note:

* Changes to test.html or widget-script require you refresh your browser.
* Changes to the widget get automatically hot loaded.
* Changes to widget-data require you restart the server.

## Design

### Project components

* `widget-script.js`
  * launches the widget in iframes using postMessage for communication
  * contains no dependencies
  * uglified upon deployment
  * lives on a cdn
  * rarely changes
* the widget
  * build with `create-react-app`
  * deploys to static files
  * lives on a cdn
  * makes graphql queries and mutations to `bibletags-data`
  * to work offline
* [bibletags-data](https://github.com/educational-resources-and-services/bibletags-data)
  * receives graphql requests
  * build with express
* mysql db
  * live on aws rds
* [BibleTags.org](https://bibletags.org)
  * present the vision and how-to of the Bible Tags project
  * makes api calls to `bibletags-data`
  * contains a data hub with files in cdn (or aws s3)
* react native app template
  * built with [expo](https://expo.io/)
  * super simple to deploy an app:
    * retrieve permission + data for one or more translations
    * set config settings (language, versions, colors, app name, logo, etc)
    * ready to deploy to app stores


### Original language texts

* Hebrew Bible
  * [UHB](https://git.door43.org/unfoldingWord/uhb)
  * License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
  * Description: WLC text with lemmas and parsings from Unfolding Word
* Greek New Testament
  * [UGNT](https://git.door43.org/unfoldingWord/UGNT)
  * License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
  * Compiled by Alan Bunning via the [Center for New Testament Restoration](https://greekcntr.org)
    * Alan is working on the non-prototype computer generated version
    * Alan's manuscript types: (1) full books (2) snippets (3) quoted by church fathers (4) foreign languages
      * #1 and #2 currently considered in the `BHP`.
* Septuagint
  * [LXX](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxmorph/)
  * License: [Commercial use requires prior written consent](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxvar/0-readme.txt)
  * This [BHS-LXX parallel](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/parallel/) is perfect for deriving both verse alignment and LXX tags.
  * Open Scripture's [GreekResources](https://github.com/openscriptures/GreekResources) will likely also be helpful.


### Versification

To line up verses between versions correctly, we will need to have versification mapping. However, we also want versification mapping primarily to be in the widget so as to reduce the amount of data that needs to be retrieved from the server with the use of each new translation. Thus, we use the concept of "versification models," since versification for most versions falls into one of a few traditions. Thus, a versification model number will live in the `versions` table in the database, along with any exceptional versification details. For each retrieved version, this information will be recorded in `localStorage` to avoid the need to retrieve it repeatedly.

Versification model data structure:

```json
[
  {
    "models": [1, 2],
    "mappings": {
      "02011030": "02012001",
      "02012001-": -1,
      "05012001-05012002": "05012001",
      "05022005": "05022005-05022006"
    }
  },
  {
    "notModels": [2],
    "mappings": {
      "65002015": 1,
      "66001001:10-66001002": "66001002"
    }
  }
]
```

Exceptional versifictaion structure:

```json
{
  "02011030": "02012002",
  "65002015": 2
}
```

Versification is also complicated by the fact that some versions occasionally deliniate by verse range instead of individual verses. For example, John 10:22-23 are presented together in the Living Bible (TLB). In such cases, such verse ranges should be treated as the initial verse alone (i.e. John 10:22 in our example), but be mapped to the entire verse range in the original language. This approach assumes verse ranges to be exceptional. Versions containing *many* verse ranges (eg. The Message), on the other hand, are uncondussive to the Bible Tags project, being paraphrases more than translations.


### Word divisions

Most modern languages separate words with spaces or other punctuation, but there are some exceptions. See [here](https://en.wikipedia.org/wiki/Word_divider) and [here](https://linguistics.stackexchange.com/questions/6131/is-there-a-long-list-of-languages-whose-writing-systems-dont-use-spaces).

To address this, the database will need to record a `word divider regex` for any text where the default `/[\\P{L}]+/gu` is not the valid regex for the split function.

This will leave some languages without precise word dividers, resulting, at times, in smaller divisions than words (eg. syllables). While this is not ideal for these languages, it should nonetheless allow all aspects of the widget to function properly, and only require a bit more clicking when tagging these texts to the original languages.

Programmatic exceptions to this approach will be few. To date, the following exception(s) exist:

* Possession and contractions in English using an apostraphe. Eg. `Balaam’s`, `shouldn’t`. Such apostraphes will be escaped before the `word divider regex` is used to split the verse.

*Please contact us to suggest any programmatic exceptions for other languages.*

Known examples of languages without precise word dividers:

* Vietnamese and Tai Lü use spaces to divide by syllable.
* Tibetan and Dzongkha use other marks to divide by syllable.
* While most Chinese characters are a single word, some words are made up of more than one.
* Japanese characters are each a single syllable.
* Lao translation may or may not use spaces.

Note: While embedding sites/apps providing USFM for verse content could distinguish between words, this information cannot be replied upon since other embedding sites/apps may only provide plain text.


### Offline

Current functionality:

* Caches Bible version info (name, language, versification, etc) for previously used versions in localStorage.
* Caches ui language data (for non-English) in localStorage.
* Caches scripture data in localStorage.
* Being in localStorage, cached data is shared between iframe instances.

Needs implementation:

* Convert test.html to be an offline app so that proper offline testing can be done.
* Note: The widget must be run off a build to work offline. (See the [widget README](widget/README.md) for more information.)
* Mutations will need to be cached as well so as to make tagging offline-enabled.
* Check that the current setup includes apollo link middleware to first check localStorge before going to the network. However, sometimes go to the network anyways if it is a request that can change with user data input (eg. tagSet, etc).
* Reference:
  * https://www.apollographql.com/docs/react/basics/network-layer.html
  * https://www.apollographql.com/docs/link/composition.html
  * https://github.com/apollographql/apollo-link/issues/158
* Enable downloading of full original language texts for use offline
  * offline text storage yet-to-be-determined


## Updates

* We create a GitHub release for [bibletags-data](https://github.com/educational-resources-and-services/bibletags-data) everytime we update the backend, and a release for [bibletags-widget](https://github.com/educational-resources-and-services/bibletags-widget) each time we update the live widget files. In both cases, embedding sites/apps need not make any changes.
* When `widget-script.js` requires updating (rarely), embedding sites/apps must make this update manually. On this occasion there will likely also be breaking changes in the API. Such changes will be annotated here.
