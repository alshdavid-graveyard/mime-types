# JavaScript `mime-types` - TypeScript Edition

The ultimate javascript content-type utility.

Similar to [the `mime@1.x` module](https://www.npmjs.com/package/mime), except:

- __No fallbacks.__ Instead of naively returning the first available type,
  `mime-types` simply returns `false`, so do
  `var type = mime.lookup('unrecognized') || 'application/octet-stream'`.
- No `new Mime()` business, so you could do `var lookup = require('mime-types').lookup`.
- No `.define()` functionality
- Bug fixes for `.lookup(path)`

Otherwise, the API is compatible with `mime` 1.x.

## Install

This package has no dependencies and uses no node.js specific APIs. This works in any JavaScript runtime, including Node.js and the Browser.

You can install this via NPM:

```sh
$ npm install @alshdavid/mime-types
```

## Adding Types

All mime types are based on [an object](./src/mime-db.ts) containing all the mime types (known as the mime-db), feel free to open a PR to expand the list of mime types.

## API

This package offers imports for CommonJS, ES Modules. Node will automatically select the import type relevant for it. Bundlers like Parcel, Webpack, Rollup will likewise consume the package via ES Modules.

```js
var mime = require('mime-types')
import * as mime from 'mime-types'
```

### mime.contentType(type)

Create a full content-type header given a content-type or extension.
When given an extension, `mime.lookup` is used to get the matching
content-type, otherwise the given content-type is used. Then if the
content-type does not already have a `charset` parameter, `mime.charset`
is used to get the default charset and add to the returned content-type.

```js
mime.contentType('markdown') // 'text/x-markdown; charset=utf-8'
mime.contentType('file.json') // 'application/json; charset=utf-8'
mime.contentType('text/html') // 'text/html; charset=utf-8'
mime.contentType('text/html; charset=iso-8859-1') // 'text/html; charset=iso-8859-1'

// from a full path
mime.contentType(path.extname('/path/to/file.json')) // 'application/json; charset=utf-8'
```

## License

[MIT](LICENSE)
