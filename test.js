import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import {temporaryDirectory} from 'tempy';
import {packageDirectory, packageDirectorySync} from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const writePackageJson = (directory, packageData) => {
	fs.mkdirSync(directory, {recursive: true});
	fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify(packageData));
};

// Create a disjoint directory, used for the not-found tests
test.beforeEach(t => {
	t.context.disjoint = temporaryDirectory();
});

test.afterEach(t => {
	fs.rmdirSync(t.context.disjoint);
});

test('async', async t => {
	t.is(await packageDirectory({cwd: path.join(__dirname, 'fixture')}), __dirname);
	t.is(await packageDirectory({cwd: t.context.disjoint}), undefined);
});

test('sync', t => {
	t.is(packageDirectorySync({cwd: path.join(__dirname, 'fixture')}), __dirname);
	t.is(packageDirectorySync({cwd: t.context.disjoint}), undefined);
});

test('ignore type-only package.json', async t => {
	const rootDirectory = temporaryDirectory();
	const projectDirectory = path.join(rootDirectory, 'project');
	const sourceDirectory = path.join(projectDirectory, 'source');
	const deepDirectory = path.join(sourceDirectory, 'deep');

	t.teardown(() => {
		fs.rmSync(rootDirectory, {recursive: true, force: true});
	});

	writePackageJson(projectDirectory, {name: 'project'});
	writePackageJson(sourceDirectory, {type: 'module'});
	fs.mkdirSync(deepDirectory, {recursive: true});

	t.is(await packageDirectory({cwd: deepDirectory}), sourceDirectory);
	t.is(await packageDirectory({cwd: deepDirectory, ignoreTypeOnlyPackageJson: true}), projectDirectory);
});

test('ignore type-only package.json (sync)', t => {
	const rootDirectory = temporaryDirectory();
	const sourceDirectory = path.join(rootDirectory, 'source');

	t.teardown(() => {
		fs.rmSync(rootDirectory, {recursive: true, force: true});
	});

	writePackageJson(rootDirectory, {type: 'module'});
	fs.mkdirSync(sourceDirectory, {recursive: true});

	t.is(packageDirectorySync({cwd: sourceDirectory}), rootDirectory);
	t.is(packageDirectorySync({cwd: sourceDirectory, ignoreTypeOnlyPackageJson: true}), undefined);
});
