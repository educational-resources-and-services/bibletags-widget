# Bible Tags

## About

*Original language Bible study for everyone, in every language.*

Vision: That every Christian might have free access to the Bible tagged to the original Hebrew, Aramaic and Greek with parsing and lexical information—all in their own language.

For more information on this project, see the [Bible Tags website](https://bibletags.org).


## Roadmap

* versifications with all mappings, tests and passing tests (Sarah), then...
  * Check KJV by Alan's data
  * put ESV and NASB's extraVerseMappings in
    * figure out process for making extraVerseMappings correct for each version with regards to verses with the split verse issue
    * since this is something that likely needs to be done by hand, have it flag someone when users start tagging a new translation so we know it is time to do so for that version
  * test skipsUnlikelyOriginals (ESV vs KJV)
  * import as much versionInfo data as possible from bible.com, find.bible, biblegateway
    * figure out litmus test verses to figure out versificationModel, partialScope, skipsUnlikelyOriginals

  * {/* https://github.com/translationCoreApps/usfm-js/tree/master/__tests__/resources */}
  * Show a, b or c after verse number when it is not complete by referencing the wordRange value returned from getCorrespondingVerseLocation (Eg. 12:3b)

* Jesse
  * Ask how USFM handles languages which do not divide words by spaces + hyphens/maqephs/etc + whether we need a PR to usfm-js to distinguish this. (Relates to the two-lemma words issue.) (Also, relates to space following ending marker bug mentioned below. That is, non-space-separating languages could just have all words on a single line, as would maqeph connected words OR newlines don't count and a space needs to come at the end of all /w lines which do have a space after them)
  * Ask Jesse if he wants a PR to support nested elements in usfm-js (http://ubsicap.github.io/usfm/characters/nesting.html)
  * Ask Jesse about usfm-js and footnotes, which are not presently parsed. Should they be?
  * Ask Jesse about usfm-js bug where a space following an ending marker is not counted as text, but just listed as nextChar. (Eg. "In the beginning G\\sc od\\sc* created.")
  * Jesse: \f vs \fe - what is the difference?
  * Decide on live orig version names (talk to Jesse) and ids
  * Decide on a lemma/strongs/etc system after talking with Jesse and Alan (and Andy and DeRouchie?)
    * a, b, c, +
    * extra digit
    * james tauber's greek-lemma-mappings
  * Explain uid idea for Greek (and Hebrew?)
    * Indicate testament? Book?
    * How would this look in Hebrew? Do we have manuscripts available? Will we?

* If we go with the uid concept, then include uids in original version (and LXX) usfm (___Verses tables).
  * Also, change ___Words table structure completely and put all info beyond the word and prefix in different add-on tables
  * How would this change my tagSets?? (no longer wordnum-based in the orig?)
* Get rid of extra spaces I put in Gen 1:1 of oshb, or put them everywhere
* Get rich text working
* make verses partial verses where need be (using boundingVersion)
* have word selection work for original only without tags
* decide what to do when they click on a translation work and there are no tags
* Entire chapter preload (chapter and tagSets queries)
* utilize definitionsByPosition query for when wordnum supplied (so only a single back-and-forth is needed)
* Get Greek NT working
* Get LXX working
* Deal with two word lemmas: Eg. באר שבע
* infoCallback
* Authentication
* After I have graphql queries which receive arrays in return, see if my cache -> localstorage strategy works still
* Get basic tagging functionality working
  * It needs to throw an error of some sort when a text if fed to the API with a different number of words from what was tagged
* Set up ParallelComposite (texts weaved together, and not just one above the other)
* Get working for other languages (uiWords query)
  * Should lang codes only be 3-digit? (i.e. no eng-gb?) Think about Chinese as another example
  * Think about different ways besides chap:verse that translations represent ref's
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
* Have API parameters checked and errors properly thrown when they are invalid (TypeScript?)
* Get working on Biblearc
* Check for unnecessary renders (I found one related to the Measure component)
* Get marketing site working (with ways to stay in contact/contribute/etc)
* Make API docs an HTML file at bibletags.org
* Explain somewhere that the KJV book ordering is used with an example mapping function (with an actual translation that has different ordering) https://github.com/openscriptures/BibleOrgSys/tree/master/DataFiles/BookOrders
* Change test.html
  * allow user to decide whether he wants to test the placement or not
  * show loading until it can successfully get the widget loaded
* Make public
* Email announcement

Post-launch:

* Seek permission to get data sets for translations tagged to strongs and the like. Reference:
  * [STEP Bible](https://stepweb.atlassian.net/wiki/spaces/SUG/pages/12484619/Copyrights+Licences)
  * Blue Letter Bible
  * [Lumina](https://netbible.org/bible)
  * CrossWay
  * NASB, etc
* Add in the ability to edit and verify parsings
* Write an original language reference tagger using Biblearc
* Make an npm module for using in a React app
* Consider prefetching definitions before they are clicked on when a verse is shown (not for preload in utility instance)
* Offline
* Create the React Native template apps
* containerElTargetScroll


## Report a bug / request a feature

* Use the appropriate repository's `Issues`. Please first check if your bug report / feature request already exists before submitting a new issue.
* For bug reports, please provide a clear description of the problem and step-by-step explanation of how to reproduce it.
* For feature requests, please first get to the know the project via the [Design](#design) section below and review the [Roadmap](#roadmap) above to make sure the desired feature is inline with the direction this project is heading.


## Open source alignment data

If you are aware of any open source word alignment data (what we call Bible tags) for a particular Bible translation, please [bring it to our attention](https://bibletags.org/contact) and we will gladly make use of it. Both full alignment data, as well as data which simply includes the Strongs number or lemma for each word in the translation, are useful.


## Contributing

* Get to know the project via the [Design](#design) section below and the [Roadmap](#roadmap) above.
* Submit pull requests to fix bugs from `Issues` and implement features that fall within the Roadmap. You would be wise to examine the active branches so as to avoid taking on a feature that someone else is already actively working on.
* Please take note of the present coding style and do your best to write new code that accords with it.


## Development

This project has been set up in such a way as to allow you to work one of the repositories without the need of cloning and running the others locally.

But, of course, you can run more than one locally at a time when need be. To do so, simply change the `widget` and `data` query parameters appropriately. Valid values are `local`, `staging` and `production` (default).

Note: A lot of data is cached in the browser so as to make this widget fast and offline. Thus, in testing, you may need to delete application storage (i.e. localStorage, etc) from your browser from time to time.

### bibletags-data (backend)

#### Installation

```bash
git clone https://github.com/educational-resources-and-services/bibletags-data
cd bibletags-data
npm install
npm run setup
```

#### Running

* `npm run open` (to open test.html in your browser)
* `npm start` (to start the local server)

Note: You will need to kill and rerun the server with each change.

### bibletags-widget

#### Installation

```bash
git clone https://github.com/educational-resources-and-services/bibletags-widget
cd bibletags-widget
npm install
```

#### Running

* `npm run dev` (to start the widget and open test.html in your browser)

Note: The widget will automatically hot-reload with each change you make.

### bibletags-widget-script

#### Installation

```bash
git clone https://github.com/educational-resources-and-services/bibletags-widget-script
cd bibletags-widget-script
npm install
```

#### Running

* `npm run open` (to open test.html in your browser)

Note: You will need to refresh the browser page with each change.

To test a deployed build, add the appropriate value to either the `widgetScriptBuild` or `widgetScriptTestBuild` query parameter.

### bibletags-versification

#### Installation

```bash
git clone https://github.com/educational-resources-and-services/bibletags-versification
cd bibletags-versification
npm install
```

#### Testing

* `npm run test`


## Design

### Project components

* [bibletags-widget-script](https://github.com/educational-resources-and-services/bibletags-widget-script) (widget-script.js)
  * launches the widget in iframes using postMessage for communication
  * contains no dependencies
  * uglified upon deployment
  * lives on a cdn
  * holds as little logic as possible so as to rarely change, since each change requires an embed tag update
* [biblearc-widget](https://github.com/educational-resources-and-services/bibletags-widget)
  * build with `create-react-app`
  * deploys to static files
  * lives on a cdn
  * makes graphql queries and mutations to `bibletags-data`
  * will work offline
* [bibletags-data](https://github.com/educational-resources-and-services/bibletags-data)
  * receives graphql requests
  * built with express
  * uses a mysql db that lives on aws rds
* [bibletags-versification](https://github.com/educational-resources-and-services/bibletags-versification)
  * included by both `bibletags-data` and `bibletags-widget`
  * exposes three functions for aligning verses between versions
    * `isValidVerse()`
    * `isValidVerseInOriginal()`
    * `getCorrespondingVerseLocations()`
  * rarely changes as its consistency is foundational to the integrety of crowd-sourced tagging data
* [BibleTags.org](https://bibletags.org)
  * presents the vision and how-to of the Bible Tags project
  * makes api calls to `bibletags-data`
  * contains a data hub with files in cdn (or aws s3)
* [bibletags-react-native-app](https://github.com/educational-resources-and-services/bibletags-react-native-app)
  * an open source app template
  * built in react native
  * built with [expo](https://expo.io/)
  * super simple to deploy a Bible app with original language study components:
    * retrieve permission + data for one or more translations
    * set config settings (language, versions, colors, app name, logo, etc)
    * it is ready to deploy to app stores


### Original language texts

* Hebrew Bible
  * [UHB](https://git.door43.org/unfoldingWord/uhb)
  * License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
  * Description: WLC text with lemmas and parsings from Unfolding Word
* Greek New Testament
  * [UGNT](https://git.door43.org/unfoldingWord/UGNT)
  * License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
  * Compiled by Alan Bunning via the [Center for New Testament Restoration](https://greekcntr.org)
    * Alan is currently adding parsing and lemma data to all variants
    * Alan aims to create a non-prototype computer generated version (early 2019?)
    * Alan's manuscript types: (1) full books (2) snippets (3) quoted by church fathers (4) foreign languages
      * #1 and #2 currently considered in the `BHP`.
    * Alan is looking to land on an ID system for words that would allow for new variants to be added without complicating existing data.
      * Andy suggested using a 4-digit random unigue identifier for each unique word, explained in an email sent to Alan on Oct 25, 2018.
    * Alan notes that punctuation and accents are somewhat up-in-the-air in the `BHP`, but hopes to refine and standardize them after the release of the computer generated version.
* Septuagint
  * [LXX](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxmorph/)
  * License: [Commercial use requires prior written consent](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxvar/0-readme.txt)
  * This [BHS-LXX parallel](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/parallel/) is perfect for deriving both verse alignment and LXX tags.
  * Open Scripture's [GreekResources](https://github.com/openscriptures/GreekResources) will likely also be helpful.


### Versification ( [bibletags-versification](https://github.com/educational-resources-and-services/bibletags-versification) )

To line up verses between versions correctly, we will need to have versification mapping. However, we also want versification mapping primarily to be in the widget so as to reduce the amount of data that needs to be retrieved from the server with the use of each new translation. Thus, we use the concept of "versification models," since versification for most versions falls into one of a few traditions. Thus, a versification model id will live in the `versions` table in the database, along with any exceptional versification details. For each retrieved version, this information will be recorded in `localStorage` to avoid the need to retrieve it repeatedly.

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
