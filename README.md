# Bible Tags

## About

*Original language Bible study for everyone, in every language.*

Vision: That every Christian might have free access to the Bible tagged to the original Hebrew, Aramaic and Greek with parsing and lexical information—all in their own language.

For more information on this project, see the [Bible Tags website](https://bibletags.org).


## Roadmap

* getCorrespondingVerseLocations
  * Look in graphql regarding this - I remember thinking through verse reference between the translation and original text quite a bit in setting this up.
* splitPlainTextVerseIntoWords
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

* `widget-script`
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
  * License: 
  * Description: WLC text with lemmas and parsings from Unfolding Word
* Greek New Testament
  * [UGNT](https://git.door43.org/unfoldingWord/UGNT)
  * License: 
  * Compiled by Alan Bunning via the [Center for New Testament Restoration](https://greekcntr.org)
    * Alan is working on the non-prototype computer generated version
    * Alan's manuscript types: (1) full books (2) snippets (3) quoted by church fathers (4) foreign languages
      * #1 and #2 currently considered in the `BHP`.
* Septuagint
  * [LXX]()
  * License: Public Domain


### Versification

To line up verses between versions correctly, we will need to have exhaustive versification mapping. However, we also want versification mapping to be in the widget so that the graphql caching can work properly without an additional back-and-forth to the server. And if the exhaustive versification mapping is in the widget, it will need to be small. So this must be done smart, so as to keep it between 1k-2k in size.

How others do it:

* unfolding word?
* https://crosswire.org/wiki/Survey_of_versification_schemes_in_French_Bibles#Canons_proposals_for_The_Sword_Project
* https://crosswire.org/wiki/Alternate_Versification
* https://github.com/openscriptures/BibleOrgSys/tree/master/DataFiles/VersificationSystems

How we propose to do it (mapping the translation to the original):

```json
[
  {
    "versions": ["esv", "nasb", "kjv"],
    "mappings": {
      "2011030": "2012001",
      "2012001-": -1,
      "5012001-5012002": "5012001",
      "5022005": "5022005-5022006"
    }
  },
  {
    "notVersions": ["udi"],
    "mappings": {
      "65002015": 1,
      "66001001:10-66001002": "66001002"
    }
  }
]
```


### Word divisions

Most modern languages separate words with spaces, but there are some exceptions. See [here](https://en.wikipedia.org/wiki/Word_divider) and [here](https://linguistics.stackexchange.com/questions/6131/is-there-a-long-list-of-languages-whose-writing-systems-dont-use-spaces).

To address this, the database will need to record a `word divider regex` and `word regex` for any text where `/[\s-]+/` and `/\w+/` are not the proper respective values.

This will leave some languages without precise word dividers, resulting, at times, in smaller divisions than words (eg. syllables). While this is not ideal for these languages, it should nonetheless allow all aspects of the widget to function properly, and only require a bit more clicking when tagging these texts to the original languages.

Known examples of languages without precise word dividers:

* Vietnamese and Tai Lü use spaces to divide by syllable.
* Tibetan and Dzongkha use other marks to divide by syllable.
* While most Chinese characters are a single word, some words are made up of more than one.
* Japanese characters are each a single syllable.
* Lao translation may or may not use spaces.

Note: While embedding sites/apps providing USFM for verse content can distinguish between words, this information cannot be replied upon since other embedding sites/apps may only provide plain text.


### Offline

Current functionality:

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


### Updates

* We create a GitHub release for [bibletags-data](https://github.com/educational-resources-and-services/bibletags-data) everytime we update the backend, and a release for [bibletags-widget](https://github.com/educational-resources-and-services/bibletags-widget) each time we update the live widget files. In both cases, embedding sites/apps need not make any changes.
* When `widget-script` requires updating (rarely), embedding sites/apps must make this update manually. On this occasion there will likely also be breaking changes in the API. Such changes will be annotated here.


## LICENSE

