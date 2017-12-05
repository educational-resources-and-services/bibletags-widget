# bibletags-widget

### ToDo's

* design api from widget to backend
* explore using localstorage with apollo (for preloading and caching scripture data)
* basic formatting of widget container
* positioning of widget container
* flexibly widget height
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