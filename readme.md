# package-directory

> Find the root directory of a Node.js project or npm package

## Install

```sh
npm install package-directory
```

## Usage

```
/
└── Users
    └── sindresorhus
        └── foo
            ├── package.json
            └── bar
                ├── baz
                └── example.js
```

```js
// example.js
import {packageDirectory} from 'package-directory';

console.log(await packageDirectory());
//=> '/Users/sindresorhus/foo'
```

## API

### packageDirectory(option?)

Returns a `Promise` for either the project root path or `undefined` if it could not be found.

### packageDirectorySync(options?)

Returns the project root path or `undefined` if it could not be found.

#### options

Type: `object`

##### cwd

Type: `string`\
Default: `process.cwd()`

The directory to start searching from.

##### ignoreTypeOnlyPackageJson

Type: `boolean`\
Default: `false`

Ignore `package.json` files that only contain the `type` field.

This treats `{"type":"module"}` files as ESM scope markers instead of package roots.

## Related

- [package-directory-cli](https://github.com/sindresorhus/package-directory-cli) - CLI for this package
- [package-up](https://github.com/sindresorhus/package-up) - Find the closest package.json file
- [find-up](https://github.com/sindresorhus/find-up) - Find a file by walking up parent directories
