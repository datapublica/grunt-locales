
This is a fork of [grunt-locales](https://github.com/blueimp/grunt-locales).  It adds the following features
- generation of translated html from json catalogs and original source
- comparison of catalog differences to detect possibly untranslated resources
- ability to translate attributes such as placeholder, title, tooltip, etc...
- an option to not strip non-standard html attributes during sanitation (in progress)
- (minor) an option to preserve the original content in the generated catalog when an explicit localization string is used.

# grunt locales

> Update, build, import and export locales using grunt.

## Table of contents

- [Getting Started](#getting-started)
- [The locales task](#the-locales-task)
    - [Overview](#overview)
    - [Usage Examples](#usage-examples)
        - [Setup](#setup)
        - [Locales update](#locales-update)
        - [Locales build](#locales-build)
        - [Locales export](#locales-export)
        - [Locales import](#locales-import)
        - [Watch tasks](#watch-tasks)
    - [Options](#options)
        - [options.locales](#optionslocales)
        - [options.localizeAttributes](#optionslocalizeattributes)
        - [options.localizeMethodIdentifiers](#optionslocalizemethodidentifiers)
        - [options.htmlFileRegExp](#optionshtmlfileregexp)
        - [options.jsFileRegExp](#optionsjsfileregexp)
        - [options.localeRegExp](#optionslocaleregexp)
        - [options.localePlaceholder](#optionslocaleplaceholder)
        - [options.localeName](#optionslocalename)
        - [options.wrapStaticTranslations](#optionswrapstatictranslations)
        - [options.purgeLocales](#optionspurgelocales)
        - [options.defaultMessagesSource](#optionsdefaultmessagessource)
        - [options.messageFormatLocaleFile](#optionsmessageformatlocalefile)
        - [options.messageFormatSharedFile](#optionsmessageformatsharedfile)
        - [options.localeTemplate](#optionslocaletemplate)
        - [options.urlRegExp](#optionsurlregexp)
        - [options.htmlmin](#optionshtmlmin)
        - [options.htmlminKeys](#optionshtmlminkeys)
        - [options.jsonSpace](#optionsjsonspace)
        - [options.jsonReplacer](#optionsjsonreplacer)
        - [options.csvEncapsulator](#optionscsvencapsulator)
        - [options.csvDelimiter](#optionscsvdelimiter)
        - [options.csvLineEnd](#optionscsvlineend)
        - [options.csvEscape](#optionscsvescape)
        - [options.csvKeyLabel](#optionscsvkeylabel)
        - [options.csvExtraFields](#optionscsvextrafields)
        - [options.preserveInnerHTMLForKey(#optionspreserveInnerHTMLForKey)
- [HTML templates format](#html-templates-format)
    - [HTML template examples](#html-template-examples)
- [JavaScript source files format](#javascript-source-files-format)
    - [JavaScript source file examples](#javascript-source-file-examples)
- [Translation mappings](#translation-mappings)
    - [DOM replacement](#dom-replacement)
    - [AngularJS directive](#angularjs-directive)
- [Contributing](#contributing)
- [Release History](#release-history)

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-locales --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-locales');
```

## The locales task

### Overview
The goal of this grunt task is to automate the localization of HTML templates and JavaScript source files.

grunt-locales parses `localize` attributes in HTML files as well as `localize` method calls in JS files and collects the parsed locale strings in JSON files for translation.  
The translated JSON locale files are then compiled into JavaScript files containing an object with translation mappings.

The JSON locale files can also be exported and imported to and from CSV locale files to ease the translation process.

To support translation features like pluralization and gender selection, this project relies on Alex Sexton's [MessageFormat](https://github.com/SlexAxton/messageformat.js) library to parse the locale strings and compile the dynamic translation functions.

### Usage Examples

#### Setup
In your project's Gruntfile, add a section named `locales` to the data object passed into `grunt.initConfig()`:

```js
grunt.initConfig({
    locales: {
        options: {
            locales: ['en_US', 'de_DE']
        },
        update: {
            src: [
                'templates/**/*.html',
                'js/app/**/*.js'
            ],
            dest: 'js/locales/{locale}/i18n.json'
        },
        build: {
            src: 'js/locales/**/i18n.json',
            dest: 'js/locales/{locale}/i18n.js'
        },
        'export': {
            src: 'js/locales/**/i18n.json',
            dest: 'js/locales/{locale}/i18n.csv'
        },
        'import': {
            src: 'js/locales/**/i18n.csv',
            dest: 'js/locales/{locale}/i18n.json'
        },
        localize: {
            translations: "test/fixtures/{locale}/i18n.js",
            src: ['test/fixtures/templates/*.html'],
            dest: 'tmp/{locale}/'
        },
        compare: {
            reference: 'test/fixtures/en_US/i18n.json',
            src: 'test/fixtures/**/i18n-translated.json'
        }
    }
});
```

Edit the `src` and `dest` paths according to the paths in your application.

#### Locales update
Parse the HTML template files and JS source files and update the JSON locale files:

```sh
grunt locales:update
```

#### Locales build
Parse the JSON locale files and build the JS locale files:

```sh
grunt locales:build
```

#### Locales export
Export the JSON locale files into CSV export files:

```sh
grunt locales:export
```

#### Locales import
Create (and overwrite) the JSON locale files from the CSV locale files:

```sh
grunt locales:import
```

#### Locales localize
Generate (static) translated html from translations and source.  localization markers used
during the process are stripped so they do not affect runtime.

```sh
grunt locales:localize
```

#### Locales compare
compare json catalogs and expose suspicious similarities.  This is useful to func any untranslated resource.

```sh
grunt locales:localize
```


#### Watch tasks
Install [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) to automatically update and build locales on file changes.

In your project's Gruntfile, add the following to your watch task configuration:

```js
grunt.initConfig({
    // ...
    watch: {
        templates: {
            files: [
                'templates/**/*.html',
                'js/app/**/*.js'
            ],
            tasks: ['locales:update'],
            options: {
                spawn: false
            }
        },
        locales: {
            files: 'js/locales/**/i18n.json',
            tasks: ['locales:build']
        }
    }
});
```

Add the following section to only parse updated HTML templates and JS source files:

```js
grunt.event.on('watch', function (action, file) {
    grunt.config('locales.update.options.purgeLocales', false);
    grunt.config('locales.update.src', file);
});
```

### Options

#### options.locales
Type: `Array`  
Default value: `['en_US']`

The list of locales you are using for your translation framework.

#### options.localizeAttributes
Type: `Array`  
Default value: `['localize']`

A list of attributes that are parsed for locale strings in the HTML templates.  
All attributes in this list will also match with attributes of the same name with `data-` prefix.

If the attribute value is empty and the attribute key matches the default localize attribute (which is the **first** item in the list of `localizeAttributes`) or the equivalent with `data-` prefix, the parser takes the element HTML content as locale string:

```html
<p localize><strong>Bananas</strong></p>
```

The above example will match `<strong>Bananas</strong>` as locale string.

#### options.localizeMethodIdentifiers
Type: `Array`  
Default value: `['localize']`

A list of method identifiers to identify the locale strings of localization calls in the JS source files. The default setting will match `Bananas` as locale string in the following code snippet:

```js
var localizedText = localize('Bananas');
```

#### options.htmlFileRegExp
Type `RegExp`  
Default value: `/\.html$/`

Source files matching this expression will be parsed as HTML files for `localize` attributes.

#### options.jsFileRegExp
Type `RegExp`  
Default value: `/\.js$/`

Source files matching this expression will be parsed as JS files for `localize` method calls.

#### options.localeRegExp
Type `RegExp`  
Default value: `/\w+(?=\/[^\/]+$)/`

Matches the locale name in a file path, e.g. `en_US` in `js/locale/en_US/i18n.json`.  
This is used to automatically extract the locale name for the build and export tasks.

#### options.localePlaceholder
Type: `String`  
Default value: `'{locale}'`

The placeholder for the locale name used to create the destination file paths.

#### options.localeName
Type: `String`  
Default value: `'i18n'`

The name of the variable added to the `window` object in the created locale scripts.  
This variable holds the object of translation mappings.

#### options.wrapStaticTranslations
Type: `Boolean`  
Default value: `false`

If enabled, wraps static translation strings with a function.  
By default, the translation keys are mapped to static strings, unless the translation changes depending on user data, in which case the key maps to a dynamic translation function.  
This option ensures that the translation mappings all use functions as values.

#### options.purgeLocales
Type: `Boolean`  
Default value: `true`

If enabled, removes obsolete locale strings from the JSON files.  
This excludes strings parsed from the HTML templates, JS source files and the default messages.

#### options.defaultMessagesSource
Type: `String|Array`  
Default value: `undefined`

The source filepath(s) to the JSON file(s) with default locale strings not found in the HTML templates or JS source files.  
Supports filename expansion via [globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns).

#### options.messageFormatLocaleFile
Type: `String`  
Default value: `__dirname + '/../node_modules/messageformat/locale/{locale}.js'`

The location of the [MessageFormat](https://github.com/SlexAxton/messageformat.js) locale file.  
This locale specific file will be included in the build output.

#### options.messageFormatSharedFile
Type: `String`  
Default value: `__dirname + '/../node_modules/messageformat/lib/messageformat.include.js'`

The location of the [MessageFormat](https://github.com/SlexAxton/messageformat.js) shared file.  
This file will be included in the build output.

#### options.localeTemplate
Type: `String`  
Default value: `__dirname + '/../i18n.js.tmpl'`

The location of the template file used to render the JS locale files.

#### options.urlRegExp
Type `RegExp`  
Default value: `/^((ftp|https?):\/\/|mailto:|#|\{\w+\})/`

The allowed URL formats for sanitized HTML output.

#### options.htmlmin
Type: `Object`  
Default value: `{removeComments: true, collapseWhitespace: true}`

Minifies locale strings containing HTML with [html-minifier](https://github.com/kangax/html-minifier), using the given options object.  
Set to `false` to disable HTML minification.

#### options.htmlminKeys
Type: `Boolean`  
Default value: `false`

If enabled, also minifies the parsed keys containing HTML markup.  
This option can be useful if the locales are parsed from the unminified templates, but the templates are later minified e.g. using [grunt-contrib-htmlmin](https://github.com/gruntjs/grunt-contrib-htmlmin).

#### options.jsonSpace
Type: `Integer`  
Default value: `2`

The `space` parameter to [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) used to render the JSON locale files.

#### options.jsonReplacer
Type: `function|Array`  
Default value: `undefined`

The `replacer` parameter to [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) used to render the JSON locale files.

#### options.csvEncapsulator
Type: `String`  
Default value: `'"'`

The string encapsulator character(s) used for the CSV export.

#### options.csvDelimiter
Type: `String`  
Default value: `','`

The table cell delimiter character(s) used for the CSV export.

#### options.csvLineEnd
Type: `String`  
Default value: `'\r\n'`

The line end character(s) used for the CSV export.

#### options.csvEscape
Type: `Function`  
Default value:

```js
function (str) {
  return str.replace(/"/g, '""');
}
```

The string escape function used for the CSV export.

#### options.csvKeyLabel
Type: `String`  
Default value: `'ID'`

The label for the header cell for the locale keys created in the CSV export.

#### options.csvExtraFields
Type: `Array`  
Default value: `['files']`

Extra fields from the JSON translation objects which are added to each CSV export row as additional information.

#### options.preserveInnerHTMLForKey
Type: `Boolean`
Default value: `false`

If true, the value of generated catalog entries with an explicit localization string (`localize` attribute value) is set to the source element content, as opposed to the key.

## HTML templates format
The templates should contain HTML content which can be parsed by [node-htmlparser](https://github.com/tautologistics/node-htmlparser).

By default, the `locales:update` task parses all elements with `localize` attributes, as well as the same attributes with `data-` prefix. So elements with `data-localize` attribute will also be parsed, which allows strict HTML conformity.

The localization string is taken from the attribute value. For the attributes `localize` and `data-localize`, the string will be taken from the content of the element if the attribute value is empty.

Localized html attribute values such as input placeholders and tooltips are identified by the `localize-attributes` and `data-localize-attributes` attribute.  The value is a comma-separated list of attributes of the marked elements that need to be localized.  The value of each localized attribute is used as the localization string.

### HTML template examples

```html
<div data-name="Grunt" data-localize>Hello {name}!</div>
```

```html
<div data-num="{{results.length}}" localize>There {num, plural, one{is <strong>one</strong> result} other{are <strong>#</strong> results}}.</div>
```

```html
<div>
   	<input type="text" title="text input" placeholder="Say something!" localize-attributes="placeholder,title">
   	<button tooltip="Click to accept invitation" localize-attributes="tooltip" localize>I'm in</button>
</div>
```

## JavaScript source files format
The JavaScript source files should contain JavaScript code which can be parsed by [Esprima](http://esprima.org/).

The parser will match all `localize` function calls with a String as first argument.  
The String must be static and cannot be passed as a variable or concatenation expression.  
The `localize` function can be invoked as an object method, but has to be written in dot notation and cannot be accessed as a String literal.

### JavaScript source file examples
By default, the parser will match the following example method calls:

```js
var result = localize(
    'Hello {name}!',
    {name: user.name}
);
```

```js
var result = obj.localize('Save the Orangutans!');
```

It will __not__ match the following:

```js
var result = localize(
    'Hello ' + '{name}!', // Concatenation expression
    {name: user.name}
);
```

```js
var result = obj.localize(str); // String passed as variable
```

```js
var result = obj['localize']('Save the Orangutans!'); // not written in dot notation.
```

## Translation mappings
The compiled translation mappings can be used the following way:

```js
function localize(key, data) {
    var translation = window.i18n[key];
    if (translation) {
        if (!translation.call) {
            // Translation is not a function, assume a static string:
            return translation;
        }
        return translation(data);
    }
    // No mapping found, the translation value is the translation key:
    return key;
}
var result = localize('Hello {name}!', {name: 'Grunt'});
```

### DOM replacement
An example replacing the content of all HTML nodes of the current document with `data-localize` attribute with their translation result:

```js
[].forEach.call(document.querySelectorAll('[data-localize]'), function (node) {
    var dataset = node.dataset,
        data = {},
        attr = dataset.localize,
        translation = window.i18n[attr || node.innerHTML],
        key;
    if (translation) {
        if (attr) {
            node.textContent = (translation.call && translation(dataset)) || translation;
        } else {
            if (translation.call) {
                for (key in dataset) {
                    if (dataset.hasOwnProperty(key) && key !== 'localize') {
                        data[key] = escapeHTML(dataset[key]);
                    }
                }
                node.innerHTML = translation(data);
            } else {
                node.innerHTML = translation;
            }
        }
    } else if (attr) {
        node.textContent = attr;
    }
});
```
Please note that when you are dynamically updating HTML content, you have to safeguard against [Cross-site scripting](http://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

A safe way is to filter all arguments passed to the translation functions, based on the context where the translation result will be inserted.

Arguments for translation functions which will be inserted as HTML element content can be safely escaped by replacing unsafe characters with their HTML entity equivalents, e.g. with the following function:

```js
function escapeHTML(str) {
    return str.replace(/[<>&"]/g, function (c) {
        return {
            '<' : '&lt;',
            '>' : '&gt;',
            '&' : '&amp;',
            '"' : '&quot;'
        }[c];
    });
}
```

### AngularJS directive
[angular-localize](https://github.com/blueimp/angular-localize) is a `localize` module for [AngularJS](http://angularjs.org/), which uses the translation mappings generated by grunt-locales.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2015-02-05   v7.0.0   Use static string mappings for non-dynamic translations by default.
 * 2014-12-02   v6.2.0   Log warning if locale string cannot be parsed from a matching method call.
 * 2014-11-27   v6.1.1   Fixed handling of additional localize attributes.
 * 2014-09-08   v6.1.0   Replaced [Apricot](https://github.com/silentrob/Apricot) with [cheerio](https://github.com/cheeriojs/cheerio) as HTML parsing engine.
 * 2014-04-01   v6.0.1   Fixed `purgeLocales` option.
 * 2014-03-29   v6.0.0   Added support to parse locale Strings from localization method calls in JavaScript source files.
 * 2014-03-27   v5.0.1   Don't sanitize values for which the security context is not known yet; e.g. attributes instead of HTML element content.
 * 2014-03-26   v5.0.0   Store collected locale strings as value properties of localization objects to allow adding additional information to the localization data, e.g. the parsed template files.
 * 2014-02-26   v4.0.0   Updated to work with MessageFormat version 0.1.8; renamed option `messageFormatFile` to `messageFormatLocaleFile` and added option `messageFormatSharedFile`.
 * 2013-11-20   v3.0.0   Accept [globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns) with the new `defaultMessagesSource` option, replacing `defaultMessagesFile`.
 * 2013-10-30   v2.0.0   Sanitize both keys and content, minify HTML output.
 * 2013-10-30   v1.1.0   Catch, format and log errors when parsing JSON locale files.
 * 2013-10-29   v1.0.0   Initial release.
