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
