# `mime-types`

The ultimate javascript content-type utility, written entirely in TypeScript

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

### Importing

```js
var mime = require('@alshdavid/mime-types')
import * as mime from '@alshdavid/mime-types'
```

### Results

All functions return a tuple (JavaScript array)  
```typescript
type Result = [result: string, found: boolean]
```

e.g.

```javascript
const [ result, found ] = mime.lookup('json')
```

### Functions

#### `mime.lookup(path)`

Lookup the content-type associated with a file.

```js
mime.lookup('json') // ['application/json', true]
mime.lookup('.md') // ['text/markdown', true]
mime.lookup('file.html') // ['text/html', true]
mime.lookup('folder/file.js') // ['application/javascript', true]
mime.lookup('folder/.htaccess') // ['', false]

mime.lookup('cats') // ['', false]
```

#### `mime.contentType(type)`

Create a full content-type header given a content-type or extension.
When given an extension, `mime.lookup` is used to get the matching
content-type, otherwise the given content-type is used. Then if the
content-type does not already have a `charset` parameter, `mime.charset`
is used to get the default charset and add to the returned content-type.

```js
mime.contentType('markdown') // ['text/x-markdown; charset=utf-8', true]
mime.contentType('file.json') // ['application/json; charset=utf-8', true]
mime.contentType('text/html') // ['text/html; charset=utf-8', true]
mime.contentType('text/html; charset=iso-8859-1') // ['text/html; charset=iso-8859-1', true]

// from a full path
mime.contentType(path.extname('/path/to/file.json')) // ['application/json; charset=utf-8', true]
```

#### `mime.extension(type)`

Get the default extension for a content-type.

```js
mime.extension('application/octet-stream') // ['bin', true]
```

#### `mime.charset(type)`

Lookup the implied default charset of a content-type.

```js
mime.charset('text/markdown') // ['UTF-8', true]
```

### `MimeTypesParser` Class

If you wish to manually instantiate the mime-type parser, you can do so like this:

```typescript
import { MimeTypesParser } from '@alshdavid/mime-types'

const mimeTypesParser = new MimeTypesParser()

// Methods are all identical to available functions
mimeTypesParser.lookup('file.html')
mimeTypesParser.contentType('text/html')
mimeTypesParser.extension('application/octet-stream')
mimeTypesParser.charset('text/markdown')
```

#### Expanding the database

```typescript
import { MimeTypesParser, mimeDatabase, MimeDatabase } from '@alshdavid/mime-types'

const customMimeDatabase: MimeDatabase = {
    "application/my-custom-type": {}
}

const mimeTypesParser = new MimeTypesParser({
    database: { ...mimeDatabase, ...customMimeDatabase }
})
```

## License

[MIT](LICENSE)
