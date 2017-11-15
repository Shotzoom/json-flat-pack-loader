JSON Flat Pack Loader
=====================
[![npm version](https://badge.fury.io/js/json-float-pack-loader.svg)](https://badge.fury.io/js/json-float-pack-loader)

This webpack loader flattens out JSON into '.' delimited key value pairs before it is written to a file. This is useful for when you would like to store structured data but
a library requires flattend key value pairs such as [react-intl](https://github.com/yahoo/react-intl).

**Before**
```json
{
  "buttons": {
    "sign-in": "Sign In",
    "go-back": "Go Back"
  },
  "errors": {
    "account-not-found": "no account was not found matching the email and password provided"
  }
}
```

**After**
```json
{
  "buttons.sign-in": "Sign In",
  "buttons.go-back": "Go Back",
  "errors.account-not-found": "no account was not found matching the email and password provided" 
}
```

# Install
```bash
npm install --save-dev json-flat-pack-loader
```

# Usage
Use the loader either via your webpack config, CLI or inline.

## Webpack config
**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      { test: /\.json$/, use: 'json-flat-pack-loader' }
    ]
  }
};
```

**In your application**
```js
import json from './file.json'
```

## CLI
```bash
webpack --module-bind 'json=json-flat-pack-loader'
```

**In your application**
```js
import json from 'file.json';
```

## Inline
**In your application**
```js
import json from 'json-flat-pack-loader!./file.json';
