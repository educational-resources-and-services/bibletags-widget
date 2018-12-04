# Bible Tags Widget API

### Installation

Include `<script src="https://cdn.bibletags.org/widget/widget-script-v0.js" id="bibletags-widget-script"></script>` within the `head` tag of your HTML.

- Note that being in your `head` tag will require this file to be downloaded prior to page load. However, this file is very small (~5k) and will be delivered fast from AWS's worldwide cdn. In addition, its cache policy will require it to be downloaded only once. The effect is virtually no slow down to your website. The big upside to this approach is that you never need to check if the script has been loaded before using this API.


### Usage

- All API function contained in the `window.bibleTagsWidget` object.
- Call the [window.bibleTagsWidget.show()](#show) function (with proper parameters) to display a text.


### Functions

General notes:

- Parameters followed by ! are required.
- The `bookId` parameters must contain an integer between 1-66 (KJV ordering)
- The `chapter` parameters must contain an integer between 1-150
- The `verse` parameters must contain an integer between 0-176 (where 0 is used for psalm headings)
- The `usfm` parameters may contain [USFM 3](https://ubsicap.github.io/usfm/) format markers for some inline styles, footnotes and cross references. Plain text is also acceptable USFM, so long as it does not contain unescaped backslashes. Non-inline styles like chapter markers (\c), verse markers (\v) and paragraph markers (\p) will be ignored. 
- `wordNum`-like parameters must be >= 1, representing the word number in the verse as split by `splitVerseIntoWords`.
- Verse content (i.e. the `usfm` parameter) sent to the [show()](#show) function or `fetchVerseCallback`'s `contentCallback` will have its word count checked against the word count of the current tagging of this verse. If there is inconsistency, original language tagging will not be available while the inconsistency awaits review.

## setUp()

- Typically called once. However, this function may be called multiple times to update options, or not at all if there are no options to set.

#### Parameters

```javascript
theme: String
```

- **Not yet implemented**

```javascript
offlineEnabled: Boolean
```

- **Not yet implemented**
- *Default: false*

```javascript
containerEls: [HTMLElement]
```

- **Recommended** since the first time the [show()](#show) function is called with a `containerEl` not included here, rendering of the widget will be slow.
- An array of up to 10 HTMLElements.
- Container elements with the css value of `position: static` will be changed to `position: relative`.

```javascript
uiLanguageId: String
```

- **Not yet implemented**
- **Recommended** since the first time the [show()](#show) function is called with a non-English language not included here, rendering of the widget will be slow.
- *Default: eng (English)*
- Can be overridden in the [show()](#show) function.
- [Language codes](https://www.loc.gov/standards/iso639-2/php/code_list.php)

```javascript
versionIdsToUse: [versionId]
```

- **Recommended** since the first time the [show()](#show) function is called with a version not included here, rendering of the widget will be slow.

#### Return value

```javascript
null
```

#### Examples

```javascript
window.bibleTagsWidget.setUp({
	containerEls: [
		document.getElementById('div1'),
		document.getElementById('div2'),
	],
})
```
```javascript
window.bibleTagsWidget.setUp({
	theme: "dark",
	offlineEnabled: true,
	containerEls: [
		document.getElementById('div1'),
		document.getElementById('div2'),
	],
	uiLanguageId: "spa",
})
```

## preload()

Useful for having original language data prefetched from the server.

#### Parameters

```javascript
versions!: [{
	id!: String,
	refs!: [{
		bookId!: Number,
		chapter!: Number,
		verse: Number,
	}],
}]
```

- To preload an entire chapter, leave `verse` undefined.

```javascript
includeLXX: Boolean
```

- **Not yet implemented**
- *Default: false*
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
			id: "esv",
			refs: [{
				bookId: 1,
				chapter: 1,
				verse: 1,
			}],
		},
	],
})
```
```javascript
window.bibleTagsWidget.preload({
	versions: [
		{
			id: "esv",
			refs: [
				{
					bookId: 1,
					chapter: 1,
				},
				{
					bookId: 1,
					chapter: 2,
				},
			],
		},
		{
			id: "nasb",
			refs: [
				{
					bookId: 1,
					chapter: 1,
				},
				{
					bookId: 1,
					chapter: 2,
				},
			],
		},
	],
	includeLXX: true,
})
```

## show()

#### Parameters

```javascript
versions: [{
	id!: String,
	refs!: [{
		usfm!: String,
		bookId!: Number,
		chapter!: Number,
		verse!: Number,
		wordNum: Number,
	}],
}]
```

- The appropriate original language text will be displayed before these `versions` in the widget. To *only* display the original language version, see the `originalLanguageRef` parameter below.
- Will retrieve original language verse(s) corresponding to the first version as versification can change between versions. If subsequent versions do not properly correspond, they will get ignored. Hence, it is highly recommended that the [getCorrespondingVerseLocations()](#getCorrespondingVerseLocations) function is used before calling this function on multiple versions.
- The first version may only contain a single verse (i.e. `ref`). However, there are times when subsequent versions require multiple verses to cover the same content present in this single verse of the first version (due to versification descrepencies). In such cases, the additional verses (in full) should simply be added on to the `versions` array. See the final example in the examples section below.
- `wordNum` will only be taken into account in the first ref within which it is found.
- `usfm` may contain plain text. (See "General notes" above.)
- You are required to supply either the `versions` or the `originalLanguageRef` parameter, and may not supply both.

```javascript
originalLanguageRef: {
	bookId!: Number,
	chapter!: Number,
	verse!: Number,
	wordNum: Number,
}
```

- Only use this parameter when desiring to display the original language version *alone*. To display translations in addition to the original language version, see the `versions` parameter above.
- You are required to supply either the `versions` or the `originalLanguageRef` parameter, and may not supply both.

```javascript
anchorEl: HTMLElement
```

- typically a descendant of `containerEl`

```javascript
containerEl: HTMLElement
```

- *Default: [the body tag]*
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

- *Default: 10*

```javascript
zIndex: Number
```

- *Default: 100*

```javascript
hideVerse: Boolean
```

- **Not yet implemented**
- *Default: false*
- Only works with a single version.

```javascript
hideOriginal: Boolean
```

- **Not yet implemented**
- *Default: false*

```javascript
includeLXX: Boolean
```

- **Not yet implemented**
- *Default: false*
- Only works with OT passages.

```javascript
uiLanguageId: String
```

- **Not yet implemented**
- *Default: [language set in [setUp()](#setUp) function, or else the language of the first version]*

```javascript
addlOptions: [{
	label!: String,
	callback!: Function(),
}]
```

- **Not yet implemented**
- For each additional option provided, the `label` is listed in the main options menu. If selected by the user, the callback function is executed.

```javascript
fetchVerseCallback: Function({
	id: String,
	ref: {
		bookId: Number,
		chapter: Number,
		verse: Number,
	},
	contentCallback: Function({
		usfm!: String,
	}),
}),
```

- **Not yet implemented**
- Required for search (unless `searchCallback` is provided) and for USFM cross reference content.
- The provided `fetchVerseCallback()` function must cause `contentCallback()` to be called in response.

```javascript
jumpToLocation: {
	includeOptionForBasePassage: Boolean,
	callback!: Function({
		id: String,
		ref: {
			bookId: Number,
			chapter: Number,
			verse: Number,
		},
	}),
}
```

- **Not yet implemented**
- If present, a `Jump to location` option will be available to users when viewing search results or USFM cross references.
- If `includeOptionForBasePassage` (*Default: true*) is true, then this option will likewise be available in the main options menu.

```javascript
searchCallback: Function({
	searchString: String,
})
```

- **Not yet implemented**
- When provided, this function is called instead of inline search results being presented.

```javascript
infoCallback: Function({
	connectedWordNums: [Number],
})
```

- **Not yet implemented**
- Only relevant if `wordNum` was provided in `versions`.
- `connectedWordNums` will contain an array of all the word numbers in the translation associated the relevant original language word. This is important since the `wordNum` provided might only be part of the translation of this original language word, while the embedding website/app might want to highlight all relevant translation words.
- Eg. Genesis 1:1 ESV is sent to the [show()](#show) function with `wordNum` set to 3. This is the word "beginning" which is one of two words translated from בְּרֵאשִׁית—the other being "In." Hence, `{ connectedWordNums: [1,3] }` is sent to the `infoCallback()` function so that the embedding site/app can highlight both "In" and "beginning."

#### Return value

```javascript
Number
```

- The widgetInstanceId which can be used with the `hide` function.

#### Examples

```javascript
window.bibleTagsWidget.show({
	versions: [{
		id: "esv",
		refs: [{
			usfm: "In the beginning, God created the heavens and the earth.",
			bookId: 1,
			chapter: 1,
			verse: 1,
		}],
	}],
	anchorEl: theHTMLElementWhichTheWidgetShouldBeAdjacentTo,
})
// Returns: 1
```
```javascript
window.bibleTagsWidget.show({
	versions: [{
		id: "esv",
		refs: [{
			usfm: "In the beginning, God created the heavens and the earth.",
			bookId: 1,
			chapter: 1,
			verse: 1,
			wordNum: 3,
		}],
	}],
	anchorEl: theHTMLElementWhichTheWidgetShouldBeAdjacentTo,
	containerEl: theHTMLElementInWhichTheWidgetShouldScroll,
	containerElTargetScroll: {
		x: 0,
		y: 320,
	},
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
		id,
		ref: {
			bookId,
			chapter,
			verse,
		},
		contentCallback,
	}) => {
		// Get the content for the requested verse and put it in a variabled named `usfm`.
		contentCallback({ usfm });
	},
	jumpToLocation: {
		includeOptionForBasePassage: false,
		callback: ({
			id,
			ref: {
				bookId,
				chapter,
				verse,
			},
		}) => {
			// Jump to the requested location.
		},
	},
	searchCallback: ({
		searchString,
	}) => {
		// Run the search however I like.
	},
	infoCallback: ({
		connectedWordNums,
	}) => {
		// Highlight all words in the `connectedWordNums` array.
	},
})
// Returns: 2
```
```javascript
window.bibleTagsWidget.show({
	versions: [
		{
			id: "esv",
			refs: [{
				usfm: "For he chose us in him before the creation of the world to be holy and blameless in his sight. In love",
				bookId: 49,
				chapter: 1,
				verse: 4,
			}],
		},
		{
			id: "exb",
			[
				{
					usfm: "That is, in Christ, he chose us before the world was made so that we would be his holy people—people without blame before him.",
					bookId: 49,
					chapter: 1,
					verse: 4,
				},
				{
					usfm: "Because of his love, God had already decided to make us his own children through Jesus Christ. That was what he wanted and what pleased him,",
					bookId: 49,
					chapter: 1,
					verse: 5,
				},
			],
		},
	],
})
// Returns: 3
```


## hide()

#### Parameters

```javascript
widgetInstanceId: Number
```

- The `widgetInstanceId` for each widget is the return value of the [show()](#show) function.
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


## getCorrespondingVerseLocations()

This function is useful when calling [show()](#show) with multiple versions. (See explanation in the `versions` parameter details.)

#### Parameters

```javascript
baseVersion!: {
	id!: String,
	ref: {
		bookId!: Number,
		chapter!: Number,
		verse!: Number,
	},
}
```

```javascript
lookupVersionIds!: [String]
```

```javascript
callback: [{
	id: String,
	refs: [{
		bookId: Number,
		chapter: Number,
		verse: Number,
		wordRange: [Number, Number | null],
	}],
}]
```

- The `wordRange` parameter is an array with two elements: one integer indicating the start word number (>= 1) and a second integer indicating the end word number. The second element in the array may contain the value `null`, indicating that the word range extends to the end of the given verse.
- If [getCorrespondingVerseLocations()](#getCorrespondingVerseLocations) is being called in preparation for calling [show()](#show), the `wordRange` parameter is irrelevant and can be ignored.

#### Return value

```javascript
Promise  // resolves to the same value as the callback
```

#### Example

```javascript
const correspondingVerseLocations = await window.bibleTagsWidget.getCorrespondingVerseLocations({
	baseVersion: {
		id: "esv",
		ref: {
			bookId: 1,
			chapter: 1,
			verse: 1,
		},
	},
	lookupVersionIds: ["nasb", "niv"],
})
// [
// 	{
// 		id: "nasb",
// 		refs: [{
// 			bookId: 1,
// 			chapter: 1,
// 			verse: 1,
// 		}],
// 	},
// 	{
// 		id: "niv",
// 		refs: [{
// 			bookId: 1,
// 			chapter: 1,
// 			verse: 1,
// 		}],
// 	}
// ]
```

```javascript
const correspondingVerseLocations = await window.bibleTagsWidget.getCorrespondingVerseLocations({
	baseVersion: {
		id: "esv",
		ref: {
			bookId: 3,
			chapter: 14,
			verse: 55,
		},
	},
	lookupVersionIds: ["syn"],
})
// [
// 	{
// 		id: "syn",
// 		refs: [{
// 			bookId: 3,
// 			chapter: 14,
// 			verse: 55,
//			wordRange: [1, 8],
// 		}],
// 	},
// ]
```

```javascript
const correspondingVerseLocations = await window.bibleTagsWidget.getCorrespondingVerseLocations({
	baseVersion: {
		id: "esv",
		ref: {
			bookId: 3,
			chapter: 14,
			verse: 56,
		},
	},
	lookupVersionIds: ["syn"],
})
// [
// 	{
// 		id: "syn",
// 		refs: [{
// 			bookId: 3,
// 			chapter: 14,
// 			verse: 55,
//			wordRange: [9, null],
// 		}],
// 	},
// ]
```

```javascript
const correspondingVerseLocations = await window.bibleTagsWidget.getCorrespondingVerseLocations({
	baseVersion: {
		id: "syn",
		ref: {
			bookId: 3,
			chapter: 14,
			verse: 55,
		},
	},
	lookupVersionIds: ["esv"],
})
// [
// 	{
// 		id: "esv",
// 		refs: [
//			{
// 				bookId: 3,
// 				chapter: 14,
// 				verse: 55,
// 			},
//			{
//				bookId: 3,
//				chapter: 14,
//				verse: 56,
//			},
//		],
// 	},
// ]
```

## splitVerseIntoWords()

This function allows the embedding site/app to split verses into words in a manner consistent with Bible Tags.

- **Not yet implemented**

#### Parameters

```javascript
version!: {
	id!: String,
	ref: {
		usfm: String,
	},
}
```

```javascript
callback: [String] | null  // null, if the version id is invalid
```

- An array of words from the verse, with punctuation stripped out.

#### Return value

```javascript
Promise  // resolves to the same value as the callback
```

#### Examples

```javascript
const wordsArray = await window.bibleTagsWidget.splitVerseIntoWords({
	version: {
		id: "esv",
		ref: {
			usfm: "In the beginning, God created the heavens and the earth.",
		},
	},
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
})
```
