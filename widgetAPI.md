# Widget API

## Functions

### <a id="setup" name="setup"></a>`setup`

- Typically called once. However, this function may be called multiple times to update options, or not at all if there are no options to set.

#### Parameters

```javascript
appId: String
```

- **Not yet implemented**
- *default: [domain of website utilizing the widget]*
- a unique identifier for the app
- used with `userId` to uniquely identify a user

```javascript
userId: String
```

- **Not yet implemented**
- any identifier unique to hosting app/domain
- used with `appId` to uniquely identify a user

```javascript
theme: String
```

- **Not yet implemented**

```javascript
offlineEnabled: Boolean
```

- **Not yet implemented**
- *default: false*

```javascript
containerEls: HTMLElement
```

- the first time the [show](#show) function is called with a `containerEl` not included here, rendering of the widget will be slow.
- up to 10
- container elements with the css value of `position: static` will be changed to `position: relative`

```javascript
uiLanguageCode: String
```

- *default: eng (English)*
- Can be overridden in the [show](#show) function.
- [Language codes](https://www.loc.gov/standards/iso639-2/php/code_list.php)

#### Return value

```javascript
Null
```

#### Examples

```javascript
window.bibleTagsWidget.setup({
	userId: "3766",
	containerEls: [
		document.getElementById('div1'),
		document.getElementById('div2'),
	],
})
```
```javascript
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

### <a id="preload" name="preload"></a>`preload`

#### Parameters

```javascript
`versions`: [{
	versionCode: String,
	bookId: Number,  // must be an integer between 1-66
	chapter: Number,  // must be an integer between 1-150
	verse: Number,  // must be an integer between 0-176; if absent, the entire chapter will be retrieved
}]
```

- **Required**

```javascript
includeLXX: Boolean
```

- **Not yet implemented**
- *default: false*
- only works with OT passages

#### Return value

```javascript
Number  // the widgetInstanceId which can be used to hide this specific instance of the widget
```

#### Examples

```javascript
window.bibleTagsWidget.preload({
	versions: [{
		versionCode: "esv",
		bookId: 1,
		chapter: 1,
	}],
	uiLanguageCode: "spa",  // Spanish
})
```

### <a id="show" name="show"></a>`show`

#### Parameters

`xxx`: String

- **Not yet implemented**

#### Return value

```javascript
Null
```

#### Examples

```javascript
```
```javascript
```


	// Will retrieve verse(s) corresponding to the first version
	// since versification can change between versions. If 
	// subsequent versions do not properly correspond, they 
	// will get ignored.
	versions: [{
		versionCode: String,
		content: String,
		usfm: String,  // allows for inline styles and notes
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
	uiLanguageCode: String,  // defaults to first version language
	addlOptions: [{
		label: String,
		callback: function(),
	}],
	fetchVerseCallback: function({
		// required for searchInline and usfm with vs refs to work
		versionCode: String,
		bookId: int,
		chapter: int,
		verse: int,
		contentCallback: function({
			content: String,
			notes: [{
				content: String,
			}],
		}),
	}),
	jumpToLocationCallback: function({
		// if present, jump-to-location option presented to user
		// for search results, cross-references, etc
		versionCode: String,
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


### <a id="hide" name="hide"></a>`hide`

#### Parameters

`xxx`: String

- **Not yet implemented**

#### Return value

```javascript
Null
```

#### Examples

```javascript
```
```javascript
```


// Hides widget instance matching the id, or all widget instances
// if this parameter is not provided.
hide(widgetInstanceId)