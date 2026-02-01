import path from 'node:path';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import process from 'node:process';
import {findUp, findUpSync} from 'find-up-simple';

const isTypeOnlyPackageJsonData = packageData => {
	if (!packageData || typeof packageData !== 'object' || Array.isArray(packageData)) {
		return false;
	}

	const keys = Object.keys(packageData);
	return keys.length === 1 && keys[0] === 'type' && typeof packageData.type === 'string';
};

const isTypeOnlyPackageJson = async filePath => {
	let fileContents;

	try {
		fileContents = await fsPromises.readFile(filePath, 'utf8');
	} catch {
		return false;
	}

	try {
		return isTypeOnlyPackageJsonData(JSON.parse(fileContents));
	} catch {
		return false;
	}
};

const isTypeOnlyPackageJsonSync = filePath => {
	let fileContents;

	try {
		fileContents = fs.readFileSync(filePath, 'utf8');
	} catch {
		return false;
	}

	try {
		return isTypeOnlyPackageJsonData(JSON.parse(fileContents));
	} catch {
		return false;
	}
};

const getNextSearchDirectory = filePath => {
	const packageDirectoryPath = path.dirname(filePath);
	const parentDirectoryPath = path.dirname(packageDirectoryPath);
	return parentDirectoryPath === packageDirectoryPath ? undefined : parentDirectoryPath;
};

const findPackageDirectory = async (directory, ignoreTypeOnlyPackageJson) => {
	const filePath = await findUp('package.json', {cwd: directory});
	if (!filePath) {
		return undefined;
	}

	const packageDirectoryPath = path.dirname(filePath);
	if (!ignoreTypeOnlyPackageJson) {
		return packageDirectoryPath;
	}

	if (!await isTypeOnlyPackageJson(filePath)) {
		return packageDirectoryPath;
	}

	const nextDirectory = getNextSearchDirectory(filePath);
	if (!nextDirectory) {
		return undefined;
	}

	return findPackageDirectory(nextDirectory, ignoreTypeOnlyPackageJson);
};

const findPackageDirectorySync = (directory, ignoreTypeOnlyPackageJson) => {
	const filePath = findUpSync('package.json', {cwd: directory});
	if (!filePath) {
		return undefined;
	}

	const packageDirectoryPath = path.dirname(filePath);
	if (!ignoreTypeOnlyPackageJson) {
		return packageDirectoryPath;
	}

	if (!isTypeOnlyPackageJsonSync(filePath)) {
		return packageDirectoryPath;
	}

	const nextDirectory = getNextSearchDirectory(filePath);
	if (!nextDirectory) {
		return undefined;
	}

	return findPackageDirectorySync(nextDirectory, ignoreTypeOnlyPackageJson);
};

export async function packageDirectory({cwd, ignoreTypeOnlyPackageJson} = {}) {
	return findPackageDirectory(cwd ?? process.cwd(), ignoreTypeOnlyPackageJson);
}

export function packageDirectorySync({cwd, ignoreTypeOnlyPackageJson} = {}) {
	return findPackageDirectorySync(cwd ?? process.cwd(), ignoreTypeOnlyPackageJson);
}
