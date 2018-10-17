# Widget API

## Functions

### <a id="setup" name="setup"></a>`setup`

- Typically called once. However, this function may be called multiple times to update options, or not at all if there are no options to set.

#### Parameters

`appId`: string

- **Not yet implemented**
- *default: [domain of website utilizing the widget]*
- a unique identifier for the app
- used with `userId` to uniquely identify a user

`userId`: String

- **Not yet implemented**
- any identifier unique to hosting app/domain
- used with `appId` to uniquely identify a user

`theme`: String

- **Not yet implemented**

`offlineEnabled`: Boolean

- **Not yet implemented**
- *default: false*

`containerEls`: HTMLElement

- the first time the [show](#show) function is called with a `containerEl` not included here, rendering of the widget will be slow.
- up to 10
- container elements with the css value of `position: static` will be changed to `position: relative`

`uiLanguageCode`: String

- *default: eng (English)*
- Can be overridden in the [show](#show) function.

#### Examples
```
window.bibleTagsWidget.setup({
	userId: "3766",
	containerEls: [
		document.getElementById('div1'),
		document.getElementById('div2'),
	],
})
```
```
window.bibleTagsWidget.setup({
	apiId: "https://biblearc.com",
	userId: "3766",
	theme: "dark",
	offlineEnabled: true,
	containerEls: [
		document.getElementById('div1'),
		document.getElementById('div2'),
	],
	uiLanguageCode: "spa",
})
```

* preload: function({
	versions: [{
		versionCode: string,
		bookId: int,  // 1-66
		chapter: int,  // 1-150
		verse: int,  // 0-176; if absent, entire chapter will be retrieved
	}],
	includeLXX: boolean,  // only works with OT passages
})
// Function returns an id for the 
// purpose of hiding this specific instance of the widget.

### <a id="show" name="show"></a>`show`

	// Will retrieve verse(s) corresponding to the first version
	// since versification can change between versions. If 
	// subsequent versions do not properly correspond, they 
	// will get ignored.
	versions: [{
		versionCode: string,
		content: string,
		usfm: string,  // allows for inline styles and notes
		bookId: int,  // 1-66 (kjv ordering)
		chapter: int,  // 1-150
		verse: int,  // 0-176; 0 for psalm headings
		wordNum: int,  // only first version with this set taken into acct
	}],
	anchorEl: HTMLElement,  // typically a descendant of containerEl
	containerEl: HTMLElement,
		// default: body tag; will be given relative position if static
	containerElTargetScroll: {
		// provide target scroll position if animating
		x: int,
		y: int,
	},
	margin: int,  // default: 10
	zIndex: int,  // default: 100
	hideVerse: boolean,  // only works when showing a single text
	hideOriginal: boolean,  // default: false
	includeLXX: boolean,  // only works with OT passages
	uiLanguageCode: string,  // defaults to first version language
	addlOptions: [{
		label: string,
		callback: function(),
	}],
	fetchVerseCallback: function({
		// required for searchInline and usfm with vs refs to work
		versionCode: string,
		bookId: int,
		chapter: int,
		verse: int,
		contentCallback: function({
			content: string,
			notes: [{
				content: string,
			}],
		}),
	}),
	jumpToLocationCallback: function({
		// if present, jump-to-location option presented to user
		// for search results, cross-references, etc
		versionCode: string,
		bookId: int,
		chapter: int,
		verse: int,
	}),
	searchInline: {
		resultsPerPage: int,
	},
	searchData: {
		maxResults: int,
		callback: function({
			totalNumResults: int,
			results: {
				[versionCode]: [{
					bookId: int,
					chapter: int,
					verse: int,
					wordNums: [[int]],
				}],
			},
		}),
	},
	infoCallback: function({
		connectedWords: [int],
		// If wordNum was provided, this will contain an 
		// array of all the wordNums associated with the original
		// language word connected to the requested wordNum.
	}),
}): int
// *basic inline style = small-caps, italics, bold
// (i, b, em, strong tags also allowed)
// Hides widget instance matching the id, or all widget instances
// if this parameter is not provided.
hide(id)