# Bible Tags

## About

*Original language Bible study for everyone, in every language.*

Vision: That every Christian might have free access to the Bible tagged to the original Hebrew, Aramaic and Greek with parsing and lexical information—all in their own language.

For more information on this project, see the [Bible Tags website](https://bibletags.org).

## Repos

* [bibletags-data](https://github.com/educational-resources-and-services/bibletags-data)
* [bibletags-react-native-app](https://github.com/educational-resources-and-services/bibletags-react-native-app)
* [bibletags-ui-helper](https://github.com/educational-resources-and-services/bibletags-ui-helper)
* [bibletags-versification](https://github.com/educational-resources-and-services/bibletags-versification)
* [bibletags-usfm](https://github.com/educational-resources-and-services/bibletags-usfm)
* [bibletags-widget](https://github.com/educational-resources-and-services/bibletags-widget)
* [bibletags-widget-script](https://github.com/educational-resources-and-services/bibletags-widget-script)

## Bugs

* Report [here](https://github.com/educational-resources-and-services/bibletags-data/issues).

# Bible Tags Widget

**IMPORTANT NOTE: This aspect of the Bible Tags project has been placed on hold while focus is given to the React Native app. [More on project phases](https://bibletags.org/phases).**

## Basic information

* Built with `create-react-app`
* Deploys to static files
* Lives on a cdn
* Sends graphql queries and mutations to `bibletags-data`

## Development

This project has been set up in such a way as to allow you to work one of the repositories without the need of cloning and running the others locally.

But, of course, you can run more than one locally at a time when need be. To do so, simply change the `widget` and `data` query parameters appropriately. Valid values are `local`, `staging` and `production` (default).

Note: A lot of data is cached in the browser so as to make this widget fast and offline. Thus, in testing, you may need to delete application storage (i.e. localStorage, etc) from your browser from time to time.

### bibletags-data (backend)

#### Installation

Follow the instructions found [here](https://github.com/educational-resources-and-services/bibletags-data).

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


## Updates To Embed

* Rarely, when `widget-script.js` requires updating, embedding sites/apps must make this update manually. On this occasion there will likely also be breaking changes in the API. Such changes will be annotated here.
