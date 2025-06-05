import {expectType} from 'tsd';
import {packageDirectory, packageDirectorySync} from './index.js';

expectType<Promise<string | undefined>>(packageDirectory({cwd: '/Users/project/package-directory'}));
expectType<string | undefined>(packageDirectorySync({cwd: '/Users/project/package-directory'}));
