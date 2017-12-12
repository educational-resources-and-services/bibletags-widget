# bibletags-widget

### ToDo's

* Jesse:
  confirm that USFM is free to use (unrestricted)
    ask Jesse about all markup options
    common Bible search language exists?
  ask Jesse about best way to identify a lemma (extended strongs?)
    is extended strongs clearly defined?
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
* basic formatting of widget container
* positioning of widget container
* flexible widget height
* set up basic widget ui structure (make spot for BibleTags.org logo)
* set up widget to to expand on word selection
* set up widget to page to new screen (using CSSTransitionGroup)
* would it speed things up to always have an iframe loaded and ready?
* set up graphql backend
* design and set up db (considering search and everything else)
* get fetching of data working
* set up thayers and bdb
* set up search
* set up cfs and notes
* use BHP? (compare lemmas and forms between NA28 and BHP)

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
  - caches scripture data in localStorage (mutations as well in the future when made completed offline-enabled)
  - offline-enabled, however offline text storage yet-to-be-determined
* graphql backend
  - build with express
* db
  - aws rds
* BibleTags.org
  - build with next.js; same basic build as scf
  - makes api calls to graphql backend
* data hub
  - aws s3
* app templates
  - build in react native
  - super simple to deploy an app:
    - retrieve permission + data for one or more translations
    - set config settings (language, versions, colors, app name, logo, etc)
    - ready to deploy to app stores