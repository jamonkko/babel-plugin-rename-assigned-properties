[![Build Status](https://travis-ci.org/jamonkko/babel-plugin-rename-assigned-properties.svg?branch=master)](https://travis-ci.org/jamonkko/babel-plugin-rename-assigned-properties)
[![Coverage Status](https://coveralls.io/repos/github/jamonkko/babel-plugin-rename-assigned-properties/badge.svg?branch=master)](https://coveralls.io/github/jamonkko/babel-plugin-rename-assigned-properties?branch=master)
[![npm version](https://img.shields.io/npm/v/babel-plugin-rename-assigned-properties.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-rename-assigned-properties)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-rename-assigned-properties.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-rename-assigned-properties)
[![Dependency Status](https://david-dm.org/jamonkko/babel-plugin-rename-assigned-properties.svg)](https://david-dm.org/jamonkko/babel-plugin-rename-assigned-properties)
[![devDependency Status](https://david-dm.org/jamonkko/babel-plugin-rename-assigned-properties/dev-status.svg)](https://david-dm.org/jamonkko/babel-plugin-rename-assigned-properties#info=devDependencies)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Sponsored by Leonidas](https://img.shields.io/badge/sponsored%20by-leonidas-389fc1.svg)](https://leonidasoy.fi/opensource)

# babel-plugin-rename-assigned-properties
Rename and add aliases for object properties that are being assigned a value

## Installation

```sh
$ npm install babel-plugin-rename-assigned-properties --save-dev
```

## Usage

### Options
-  __renames__: objects and their properties with new names. See below examples.
-  __process__: _inline_ | _post_ (default is inline).
    _inline_: The transformation processing is going to be done during the babel's one-time traversal.
    _post_: Transformation is done as an extra post traversal phase.
    Babel [traverses program only once](https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-traversal) and the default _inline_ option will do the transformation during that cycle just like any normal plugin would do. However, you might use other plugins that inject new code that does not get traversed, so for those situations you can define _post_ to get that new code also processed by this plugin.
    You can also specify both values to get both behaviours.

### Example via `.babelrc`

Transform `objectName.propertyName = value` to `objectName.newName = value`

```json
{
  "plugins": [
    ["rename-assigned-properties", {
      "renames": {
        "objectName": {
          "propertyName": "newName"
        }
      }
    }]
  ]
}
```

### More examples via `.babelrc`

You can also add aliases for properties by providing array of new names. Those will be transformed to chained assignments.
It is also possible to specify transformation to be done as a separate post step (see [options](#options) above).

Transform `rapper.coolio = gfunc` to `rapper.ArtisLeonIveyJr = rapper.C = rapper.Coolio = gfunc`

```json
{
  "plugins": [
    ["rename-assigned-properties", {
      "renames": {
        "rapper": {
          "coolio": ["Coolio", "C", "ArtisLeonIveyJr"]
        }
      },
      "process": "post"
    }]
  ]
}
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: [
    ["rename-assigned-properties", {
      "renames": {
        "objectName": {
          "propertyName": "newName"
        }
      }
    }]
  ]
});
```

### Sponsors

[Leonidas](https://leonidasoy.fi/)

