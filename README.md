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

* Jesse
  * UGNT fixed? (36 adjectives without a type)
    - https://git.door43.org/unfoldingWord/UGNT/issues/117
  * Confirmed non-standard usage of strong attribute in usfm?

  * Ask how USFM handles languages which do not divide words by spaces + hyphens/maqephs/etc + whether we need a PR to usfm-js to distinguish this. (Relates to the two-lemma words issue.) (Also, relates to space following ending marker bug mentioned below. That is, non-space-separating languages could just have all words on a single line, as would maqeph connected words OR newlines don't count and a space needs to come at the end of all /w lines which do have a space after them)
    - christopher clap - prof translation world - spent a lot of time looking at word divisions. (run my stuff by him!)
    - bruce mcclain - working on usfm-js @bruce.mc I WROTE HIM ON SLACK after creating two issues
      - tell him needed fixes
        * https://github.com/translationCoreApps/usfm-js/issues/50
        * support nested elements in usfm-js (http://ubsicap.github.io/usfm/characters/nesting.html) https://github.com/translationCoreApps/usfm-js/issues/51
        * footnotes are not presently parsed. Should they be?
        * bug: a space following an ending marker is not counted as text, but just listed as nextChar. (Eg. "In the beginning G\\sc od\\sc* created.")
    - zero-width joiner between prefixes
    - all on a single line if no spaces between words
  * ISO 639 1/2/3, or IETF ??
    - use IETF https://unfoldingword.bible/ietf/
  - Greek
    - Open to me adding to the UGNT with this stuff
    - Todd price (Greek textual critic) - but really busy right now
    - Jonathan Robby (seeking open source critical text)
  * Decide on a lemma/strongs/etc system for both Hebrew and Greek
    * a, b, c, +
      - is `a` originally the naked strongs? Not necessarily!
    * extra digit
      - Have the current a,b,c system in Hebrew be auto-translated into the Enhanced style.
    * decimal - WINNER

  * Unasked
    * How would we best handle באר שבע?
    * What does the parsing widget replacement need?
      - search
      - suggest change
      - automatic change ?
      - mass change

* tagging
  - "Verse not yet tagged." / "Verse not fully tagged." / "Verse not confirmed."
  - End data needs to be completely determinable by re-evaluating all data
    - So if we discover a bad user, all his data can be thrown out and everything re-processed
    - watch out for multiple submissions from different accounts but the same IP
    - watch out for tons of submissions all at once
  - tags for verse get submitted...
    - STEP 0: 
      - if same user previously submitted this verse,
        - discount their previous submission
    - STEP 1: 
      - check consistency with existing non auto-tags
        - if match
          - confirm tagging
          - increase the rating of both this tagger and the previous
        - if conflict, decrease the rating of both
      - if high user reputation,
        - auto-confirm all non-conflicts
      - else
        - mark non-confirmed
    - STEP 2: 
      - if any tags changed,
        - update affected tables/rows
          - lxx tagged
            - Definition - lxx
          - gloss change
            - DefinitionByLanguage - syn, rel
          - DefinitionByLanguage - lexEntry ?
          - uhbTagSet - tags
          - ugntTagSet - tags
          - WordTranslation - translation, hits
    - STEP 3: 
      - attempt to auto-tag untagged words
  - derived data
    - immediate
    - only necessary tables/rows updates

* Decide on code division
  - what is Bible Tags and what is Biblearc? 
    - Reading, for example
      - in the Bible Tags app? if so, should Biblearc's reading also be open source and/or a widget
  - potential divisions
    - widget-script
    - widget
    - data (includes search api)
    - versification
    - app

* Alan
  * Are two word lexemes an issue in Greek?
  * After we have solid ground and/or data...
    * Greek
      * include uids in original version usfm (___Verses tables).
      * Import greek definitions
      * Get LXX working (uid's?? or different versions?)
    * Hebrew
      * include uids in original version usfm (___Verses tables).
      * Deal with two word lexemes: Eg. באר שבע
      * If I use UHB (instead of OSHB osis, then make sure to change ילך lexeme to הלך)


* USFM of UHB needs to keep words separated by makeph and half-words (words with two lemmas) on the same line
* Get rid of extra spaces I put in Gen 1:1 of uhb, or put them everywhere (usfm-js fixes)

  - THEN: set user id to [uuid]@bibletags.org (with uuid stored in their localStorage)
  * Need some sanity with the fact verseId means two different things!! 01001001 and 01001001-esv

ATTENTION!! There have been changes made to bibletags-widget-script and thus a new version needs to be created/used.

  - change getCorrespondingVerseLocations and show API (original is base version when 2+ translations) and use newer versification code

* Entire chapter preload (chapter and tagSets queries)

* Check in with Bruce McClean - will they make the fix?

* Hebrew
  * I will be adding in the slot ids to Hebrew with a book prefix (01, 02, etc) and three more digits, to the edition of the Hebrew we will be publishing as a part of the Hebrew parsing project.
* Greek
  * Add in temporary ids for now. `x-id="u8Et"` in usfm
* utilize definitionsByPosition query for when wordnum supplied (so only a single back-and-forth is needed)
* After I have graphql queries which receive arrays in return, see if my cache -> localstorage strategy works still
* Authentication
* Get basic tagging functionality working
  * decide how to flag tags as unconfirmed
  * It needs to throw an error of some sort when a text if fed to the API with a different number of words from what was tagged
* When inserting unknown length items (words, etc), make sure the string is not too long for the column.
* Flag where there are too many verses with seemingly different editions
* infoCallback
* Create a dummy User for each import (thus, each source can have a unique rating)
* Set up ParallelComposite (texts weaved together, and not just one above the other)
* Get working for other languages (uiWords query)
  * Should lang codes only be 3-digit? (i.e. no eng-gb?) Think about Chinese as another example
  * Think about different ways besides chap:verse that translations represent ref's
* Test that uiLanguageId works correctly
* hideVerse
* hideOriginal
* addlOptions
* add usfm examples to the API docs
  * fetchVerseCallback
* jumpToLocation
* Search
  * Inline + searchData
    * Use same search language that Biblearc 3.0 will employ
  * Canonical identification of lexemes
    * https://www.academia.edu/35220175/Linking_Lexical_Resources_for_Biblical_Greek
* Themes
* Google analytics??
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

* Implement synonyms and related words
  * Create DB tables with many-to-many relationships to hold this information
  * Utilize open source data already existing on this *OR* develop an algorithm to get a rough listing and have volunteer scholars edit it.
* Develop color-highlighting system for Greek verbs (with Nate, others?)
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

If you are aware of any open source word alignment data (what we call Bible tags) for a particular Bible translation, please [bring it to our attention](https://bibletags.org/contact) and we will gladly make use of it. Both full alignment data, as well as data which simply includes the Strongs number, lexeme or lemma for each word in the translation, are useful.


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
  * Description: UHB text (based on the WLC)
* Greek New Testament
  * [UGNT](https://git.door43.org/unfoldingWord/UGNT)
  * License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
  * Compiled by Alan Bunning via the [Center for New Testament Restoration](https://greekcntr.org)
    * Alan is currently adding parsing and lexical data to all variants
    * Alan aims to create a non-prototype computer generated version (early 2019?)
    * Alan's manuscript types: (1) full books (2) snippets (3) quoted by church fathers (4) foreign languages
      * #1 and #2 currently considered in the `UGNT`.
    * Alan is looking to land on an ID system for words that would allow for new variants to be added without complicating existing data.
      * Andy suggested using a 4-digit random unigue identifier for each unique word, explained in an email sent to Alan on Oct 25, 2018.
    * Alan notes that punctuation and accents are somewhat up-in-the-air in the `UGNT`, but hopes to refine and standardize them after the release of the computer generated version.


### Septuagint

* Text
  * [LXX](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxmorph/)
  * License: [Commercial use requires prior written consent](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxvar/0-readme.txt)
  * This [BHS-LXX parallel](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/parallel/) is perfect for deriving both verse alignment and LXX tags.
  * Open Scripture's [GreekResources](https://github.com/openscriptures/GreekResources) will likely also be helpful.
* Deuterocanonical books not included in LXX search results
  * While such results can certainly be useful to the study of the canonical books and their vocabulary, they nonetheless go beyond the scope of this project and will not be included in search results or translation statistics.



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
