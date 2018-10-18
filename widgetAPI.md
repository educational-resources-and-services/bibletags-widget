# Widget API

General note:

- Parameters followed by ! are required.
- The `bookId` parameters must contain an integer between 1-66 (kjv ordering)
- The `chapter` parameters must contain an integer between 1-150
- The `verse` parameters must contain an integer between 0-176 (where 0 is used for psalm headings)
- The `usfm` parameters must contain USFM 3 format to allow for some inline styles, footnotes and cross references.
- [USFM specification](https://ubsicap.github.io/usfm/)
- `wordNum`-like parameters must be >= 1, representing the word number in the verse as split by `splitPlainTextVerseIntoWords`.
- Verse content (i.e. `plaintext` or `usfm`) sent to [show](#show) and `fetchVerseCallback`'s `contentCallback` will have its word count checked against the word count of current tagging to this verse. If there is inconsistency, original language tagging will not be available while the inconsistency awaits review.


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
- This value will be displayed to the end user in login management.

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

Useful for having original language data prefetched from the server.

#### Parameters

```javascript
versions!: [{
	versionCode!: String,
	bookId!: Number,
	chapter!: Number,
	verse: Number,
}]
```

- To preload an entire chapter, leave `verse` undefined.

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
			verse: 1,
		},
	],
})
```
```javascript
window.bibleTagsWidget.preload({
	versions: [
		{
			versionCode: "esv",
			bookId: 1,
			chapter: 1,
		},
		{
			versionCode: "esv",
			bookId: 1,
			chapter: 2,
		},
	],
	includeLXX: true,
})
```

### <a id="show" name="show"></a>`show`

#### Parameters

```javascript
versions!: [{
	versionCode!: String,
	plaintext: String,
	usfm: String,
	bookId!: Number,
	chapter!: Number,
	verse!: Number,
	wordNum: Number,
}]
```

- **Not yet implemented**
- Will retrieve verse(s) corresponding to the first version as versification can change between versions. If subsequent versions do not properly correspond, they will get ignored. Hence, it is highly recommended that the [getCorrespondingVerseLocations](#getCorrespondingVerseLocations) function is used before calling this function on multiple versions.
- The first version may only contain a single verse. However, there are times when subsequent versions require multiple verses to cover the same content present in this single verse of the first version (due to versification descrepencies). In such cases, the additional verses (in full) should simply be added on to the `versions` array. See the final example in the examples section below.
- `wordNum` will only be taken into account in the first version which it is found within.
- To only display the original language version, `versions` should contain a single object with the `versionCode` set to one of the original language versions (`uhb` or `bhp`), and `plaintext` and `usfm` left out.
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
	label!: String,
	callback!: Function(),
}]
```

- **Not yet implemented**
- For each additional option provided here, the `label` is listed in the main options menu. If selected by the user, the callback function is executed.

```javascript
fetchVerseCallback: Function({
	versionCode: String,
	bookId: Number,
	chapter: Number,
	verse: Number,
	contentCallback: Function({
		plaintext: String,
		usfm: String,
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
	callback!: Function({
		versionCode: String,
		bookId: Number,
		chapter: Number,
		verse: Number,
	}),
}
```

- **Not yet implemented**
- `includeOptionForBasePassage` default: true
- If present, a `Jump to location` option will be presented to user when viewing verses in inline search results or through USFM verse references.
- If `includeOptionForBasePassage` is true, then this option will likewise be available in the main options menu.

```javascript
searchData: {
	maxResults: Number,
	callback!: Function({
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
- If provided, `maxResults` must be an integer between 1-500. Default: 100
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
```javascript
window.bibleTagsWidget.show({
	versions: [
		{
			versionCode: "esv",
			plaintext: "For he chose us in him before the creation of the world to be holy and blameless in his sight. In love",
			bookId: 49,
			chapter: 1,
			verse: 4,
		},
		{
			versionCode: "exb",
			plaintext: "That is, in Christ, he chose us before the world was made so that we would be his holy people—people without blame before him.",
			bookId: 49,
			chapter: 1,
			verse: 4,
		},
		{
			versionCode: "exb",
			plaintext: "Because of his love, God had already decided to make us his own children through Jesus Christ. That was what he wanted and what pleased him,",
			bookId: 49,
			chapter: 1,
			verse: 5,
		},
	],
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
	bookId: Number,
	chapter: Number,
	verse: Number,
}
```

```javascript
lookupVersions: [String]
```

#### Return value

```javascript
{
	[lookupversionCode1]: [{
		bookId: Number,
		chapter: Number,
		verse: Number,
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
// Returns:
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


### <a id="splitPlainTextVerseIntoWords" name="splitPlainTextVerseIntoWords"></a>`splitPlainTextVerseIntoWords`

This function allows the embedding site/app to split verses into words in a manner consistent with Bible Tags.

#### Parameters

```javascript
plaintext!: String
```

```javascript
usfm!: String
```

#### Return value

```javascript
[String]  // An array of words from the verse, with punctuation stripped out.
```

#### Examples

```javascript
window.bibleTagsWidget.splitPlainTextVerseIntoWords({
	plaintext: "In the beginning, God created the heavens and the earth.",
})
// Returns:
// [
// 	"In",
// 	"the",
// 	"beginning",
// 	"God",
// 	"created",
// 	"the",
// 	"heavens",
// 	"and",
// 	"the",
// 	"earth",
// ]
```
```javascript
USFM example needed
```