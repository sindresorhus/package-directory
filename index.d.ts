export type Options = {
	/**
	The directory to start searching from.

	@default process.cwd()
	*/
	readonly cwd?: string;
};

/**
Find the root directory of a Node.js project or npm package.

@returns The project root path or `undefined` if it could not be found.

@example
```
// /
// └── Users
//     └── sindresorhus
//         └── foo
//             ├── package.json
//             └── bar
//                 ├── baz
//                 └── example.js

// example.js
import {packageDirectory} from 'package-directory';

console.log(await packageDirectory());
//=> '/Users/sindresorhus/foo'
```
*/
export function packageDirectory(options?: Options): Promise<string | undefined>;

/**
Synchronously find the root directory of a Node.js project or npm package.

@returns The project root path or `undefined` if it could not be found.

@example
```
// /
// └── Users
//     └── sindresorhus
//         └── foo
//             ├── package.json
//             └── bar
//                 ├── baz
//                 └── example.js

// example.js
import {packageDirectorySync} from 'package-directory';

console.log(packageDirectorySync());
//=> '/Users/sindresorhus/foo'
```
*/
export function packageDirectorySync(options?: Options): string | undefined;
