# Widget API

## Functions

### <a id="setUp" name="setUp"></a>`setUp`

- Typically called once. However, this function may be called multiple times to update options, or not at all if there are no options to set.

#### Parameters

```javascript
appId: String
```

- **Not yet implemented**
- Default: [domain of website utilizing the widget]
- A unique identifier for the app.
- Used with `userId` to uniquely identify a user.

```javascript
userId: String
```

- **Not yet implemented**
- any identifier unique to the `appId`

```javascript
theme: String
```

- **Not yet implemented**

```javascript
offlineEnabled: Boolean
```

- **Not yet implemented**
- Default: false

```javascript
containerEls: [HTMLElement]
```

- **Recommended** since the first time the [show](#show) function is called with a `containerEl` not included here, rendering of the widget will be slow.
- An array of up to 10 HTMLElements.
- Container elements with the css value of `position: static` will be changed to `position: relative`.

```javascript
uiLanguageCode: String
```

- Default: eng (English)
- Can be overridden in the [show](#show) function.
- [Language codes](https://www.loc.gov/standards/iso639-2/php/code_list.php)

#### Return value

```javascript
null
```

#### Examples

```javascript
window.bibleTagsWidget.setUp({
	userId: "3766",
	containerEls: [
		document.getElementById('div1'),
		document.getElementById('div2'),
	],
})
```
```javascript
window.bibleTagsWidget.setUp({
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
versions: [{
	versionCode: String,
	bookId: Number,  // must be an integer between 1-66
	chapter: Number,  // must be an integer between 1-150
	verse: Number,  // must be an integer between 0-176; if absent, the entire chapter will be retrieved
}]
```

```javascript
includeLXX: Boolean
```

- **Not yet implemented**
- Default: false
- only works with OT passages

#### Return value

```javascript
null
```

#### Examples

```javascript
window.bibleTagsWidget.preload({
	versions: [
		{
			versionCode: "esv",
			bookId: 1,
			chapter: 1,
		},
		{
			versionCode: "nasb",
			bookId: 1,
			chapter: 1,
		},
	],
	includeLXX: true,
})
```

### <a id="show" name="show"></a>`show`

#### Parameters

```javascript
versions: [{
	versionCode: String,
	plaintext: String,
	usfm: String,  // USFM 3 format; allows for inline styles and notes
	bookId: Number,  // must be an integer between 1-66 (kjv ordering)
	chapter: Number,  // must be an integer between 1-150
	verse: Number,  // must be an integer between 0-176; use 0 for psalm headings
	wordNum: Number,  // only first version with this key set will be taken into account
}]
```

- **Not yet implemented**
- Will retrieve verse(s) corresponding to the first version as versification can change between versions. If subsequent versions do not properly correspond, they will get ignored. Hence, it is highly recommended that the [getCorrespondingVerseLocations](#getCorrespondingVerseLocations) function is used before calling this function on multiple versions.
- [USFM specification](https://ubsicap.github.io/usfm/)
- Valid inline styles within USFM: small-caps, italics and bold.
- For each version (except for one of the original language versions), either `plaintext` or `usfm` must be provided.

```javascript
anchorEl: HTMLElement
```

- typically a descendant of `containerEl`

```javascript
containerEl: HTMLElement
```

- Default: the body tag
- If the container element has the css value of `position: static`, it will be changed to `position: relative`.

```javascript
containerElTargetScroll: {
	x: int,
	y: int,
}
```

- **Not yet implemented**
- The target scroll position, if animating.

```javascript
margin: Number
```

- **Not yet implemented**
- Default: 10

```javascript
zIndex: Number
```

- **Not yet implemented**
- Default: 100

```javascript
hideVerse: Boolean
```

- **Not yet implemented**
- Default: false
- Only works with a single version.

```javascript
hideOriginal: Boolean
```

- **Not yet implemented**
- Default: false

```javascript
includeLXX: Boolean
```

- **Not yet implemented**
- Default: false
- Only works with OT passages.

```javascript
uiLanguageCode: String
```

- **Not yet implemented**
- Default: language set in [setUp](#setUp) function or else the language of the first version

```javascript
addlOptions: [{
	label: String,
	callback: Function(),
}]
```

- **Not yet implemented**
- For each additional option provided here, the `label` is listed in the main options menu. If selected by the user, the callback function is executed.

```javascript
fetchVerseCallback: Function({
	versionCode: String,
	bookId: Number,  // will be an integer between 1-66 (kjv ordering)
	chapter: Number,  // will be an integer between 1-150
	verse: Number,  // will be an integer between 0-176; will use 0 for psalm headings
	contentCallback: Function({
		plaintext: String,
		usfm: String,  // USFM 3 format; allows for inline styles and notes
	}),
}),
```

What about passages listed in USFM (and not just single verses) ???

- **Not yet implemented**
- Required for search (unless `searchData` is provided) and for USFM verse content containing other verse references to work properly. The provided `fetchVerseCallback` function must call `contentCallback` with either the `plaintext` or `usfm` verse content.
- [USFM specification](https://ubsicap.github.io/usfm/)

```javascript
jumpToLocation: {
	includeOptionForBasePassage: Boolean,  // Default: true
	callback: Function({
		versionCode: String,
		bookId: Number,  // will be an integer between 1-66 (kjv ordering)
		chapter: Number,  // will be an integer between 1-150
		verse: Number,  // will be an integer between 0-176; will use 0 for psalm headings
	}),
}
```

- **Not yet implemented**
- If present, a `Jump to location` option will be presented to user when viewing verses in inline search results or through USFM verse references.
- If `includeOptionForBasePassage` is true, then this option will likewise be available in the main options menu.

```javascript
searchData: {
	maxResults: Number,  // must be an integer between 1-500; default: 100
	callback: Function({
		searchString: String,
		totalNumResults: Number,
		results: {
			[versionCode]: [{
				bookId: Number,
				chapter: Number,
				verse: Number,
				wordNums: [[Number]],
			}],
		},
	}),
}
```

- **Not yet implemented**
- When provided, the `callback` is called instead of an inline search being presented.
- `wordNums` is an array of word number sets, each of which corresponds to an original language hit.

```javascript
infoCallback: function({
	connectedWordNums: [Number],
})
```

- **Not yet implemented**
- Only relevant if `wordNum` was provided.
- `connectedWordNums` will contain an array of all the word numbers in the translation associated the relevant original language word. This is important since the `wordNum` provided might only be part of the translation of this original language word, while the website/app using this widget might want to highlight all relevant translation words.
- Eg. Genesis 1:1 ESV is sent to the [show](#show) function with `wordNum` set to 3. This is the word "beginning" which is one of two words translated from בְּרֵאשִׁית - the other being "In." Hence, `{ connectedWordNums: [1,3] }` is sent to the `infoCallback` function so that the embedding site/app can highlight both "In" and "beginning."

#### Return value

```javascript
Number  // the widgetInstanceId which can be used with the `hide` function
```

#### Examples

```javascript
window.bibleTagsWidget.show({
	versions: [{
		versionCode: "esv",
		plaintext: "In the beginning, God created the heavens and the earth.",
		bookId: 1,
		chapter: 1,
		verse: 1,
	}],
	anchorEl: theHTMLElementWhichTheWidgetShouldBeAdjacentTo,
})
```
```javascript
window.bibleTagsWidget.show({
	versions: [{
		versionCode: "esv",
		plaintext: "In the beginning, God created the heavens and the earth.",
		bookId: 1,
		chapter: 1,
		verse: 1,
		wordNum: 3,
	}],
	anchorEl: theHTMLElementWhichTheWidgetShouldBeAdjacentTo,
	containerEl: theHTMLElementInWhichTheWidgetShouldScroll,
	containerElTargetScroll: {
		x: 0,
		y: 320,
	}
	margin: 20,
	zIndex: 50,
	hideVerse: true,
	hideOriginal: true,
	addlOptions: [{
		label: "Change default text",
		callback: () => {
			// Open settings dialog.
		},
	}],
	fetchVerseCallback: ({
		versionCode,
		bookId,
		chapter,
		verse,
		contentCallback,
	}) => {
		// Get the content for the requested verse and put it in a variabled named `plaintext`.
		contentCallback({ plaintext });
	},
	jumpToLocation: {
		includeOptionForBasePassage: false,
		callback: ({
			versionCode,
			bookId,
			chapter,
			verse,
		}) => {
			// Jump to the requested location.
		},
	}
	searchData: {
		maxResults: 50,
		callback: ({
			searchString,
			totalNumResults,
			results,
		}) => {
			// Display the search results however I like.
		},
	}
	infoCallback: ({
		connectedWordNums,
	}) => {
		// Highlight all words in the `connectedWordNums` array.
	}
})
```

### <a id="hide" name="hide"></a>`hide`

#### Parameters

```javascript
widgetInstanceId: Number
```

- The `widgetInstanceId` for each widget is the return value of the [show](#show) function.
- If this parameter is not provided, all widgets are hidden.

#### Return value

```javascript
null
```

#### Examples

```javascript
window.bibleTagsWidget.hide({
	widgetInstanceId: 12,
})
```
```javascript
window.bibleTagsWidget.hide()
```


### <a id="getCorrespondingVerseLocations" name="getCorrespondingVerseLocations"></a>`getCorrespondingVerseLocations `

#### Parameters

```javascript
baseVersion: {
	versionCode: String,
	bookId: Number,  // must be an integer between 1-66 (kjv ordering)
	chapter: Number,  // must be an integer between 1-150
	verse: Number,  // must be an integer between 0-176; use 0 for psalm headings
}
```

```javascript
lookupVersions: [String]
```

#### Return value

```javascript
{
	[lookupversionCode1]: [{
		bookId: Number,  // must be an integer between 1-66 (kjv ordering)
		chapter: Number,  // must be an integer between 1-150
		verse: Number,  // must be an integer between 0-176; use 0 for psalm headings
	}],
	...
}
```

#### Examples

```javascript
window.bibleTagsWidget.getCorrespondingVerseLocations({
	baseVersion: {
		versionCode: "esv",
		bookId: 1,
		chapter: 1,
		verse: 1,
	},
	lookupVersions: ["nasb", "niv"],
})
// Returns
// {
// 	nasb: [{
// 		bookId: 1,
// 		chapter: 1,
// 		verse: 1,
// 	}],
// 	niv: [{
// 		bookId: 1,
// 		chapter: 1,
// 		verse: 1,
// 	}],
// }
```
```javascript
```

Go through and italicize optional parameters (and add a note about this)

collect following comments to single place

	bookId: Number,  // will be an integer between 1-66 (kjv ordering)
	chapter: Number,  // will be an integer between 1-150
	verse: Number,  // will be an integer between 0-176; will use 0 for psalm headings
	contentCallback: Function({
		plaintext: String,
		usfm: String,  // USFM 3 format; allows for inline styles and notes

I need a function that splits text into words for them (so it is consistent with how we do it)

All Number's are integers

All parameters are passing via object

appId will be shown to user

Sending multiple verses for the secondary+ versions