# bibletags-widget

### ToDo's

* Jesse:
    ask Jesse about all markup options - osis (xml), usx (xml counterpart to usfm)
     - usfm 3 milestones, named-attributes allows for overlapping
    common Bible search language exists?  json-ld, named attributes, url-query
  ask Jesse about best way to identify a lemma (extended strongs?)
    is extended strongs clearly defined?
    - https://www.academia.edu/35220175/Linking_Lexical_Resources_for_Biblical_Greek
    - https://git.door43.org/Door43/UGNT/src/tw_occurrences/57-TIT.usfm#L19
    - BHP => UGNT fits James - talk to Alan Bunning
      Alan Bunning hopes to have the computer generated BHP successor by the summer.
      His manuscript types: (1) full books (2) snippets (3) quoted by church fathers (4) foreign languages
* explore using localstorage with apollo (for preloading and caching scripture data) - this likely better than redux-persist since otherwise an already loaded widget will not updated info when a different widget gets more data
  - I want:
    * sharing of data between iframe instances
    * cache
    * ability to have offline source
  - options
    * use apollo link middleware to first check in localstorge before going to the network; sometimes go to the network anyway, depending on the request (eg. tagSet, hits, etc - things that can change with user data input), or else have stuff expire?
      // https://www.apollographql.com/docs/react/basics/network-layer.html
      // https://www.apollographql.com/docs/link/composition.html
      // https://github.com/apollographql/apollo-link/issues/158
* set up graphql backend
* design and set up db (considering search and everything else)
* get fetching of data working
* set up thayers and bdb
* set up search
* set up cfs and notes
* use BHP? (compare lemmas and forms between NA28 and BHP)
* add ability to ondeck different containerEls, and have the script choose the appropriate ondeck instance
* basic formatting of widget container
* positioning of widget container

### Project components

* `widget-script`
  - launches the widget in iframes (postMessage communication)
  - no dependencies
  - uglified
  - lives on cdn
  - rarely changes
* the widget
  - build with `create-react-app`
  - stand-alone
  - makes api calls to graphql backend
  - caches ui language data (for non-English) in localStorage
  - caches scripture data in localStorage (mutations as well in the future when made completed offline-enabled)
  - offline-enabled, however offline text storage yet-to-be-determined
* graphql backend
  - build with express
* db
  - aws rds
* BibleTags.org
  - makes api calls to graphql backend
* data hub
  - aws s3
* app templates
  - build in react native
  - super simple to deploy an app:
    - retrieve permission + data for one or more translations
    - set config settings (language, versions, colors, app name, logo, etc)
    - ready to deploy to app stores