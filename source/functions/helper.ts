import {fileTypeMapping, peoplesNames} from '@/functions/data.js';
import {log, logError} from '@/functions/log.js';
import {SEND_PATH} from '@/functions/variables.js';
import {FileTypes} from '@/types/storeTypes.js';
import fs, {statfs} from 'fs';
import path from 'path';

export function getRandomBanglaName() {
	const randomIndex = Math.floor(Math.random() * peoplesNames.length);
	return peoplesNames[randomIndex];
}

export const hasNullValue = (obj: {[key: string]: any}): boolean => {
	return Object.values(obj).some(value => value === null);
};

export const cleanFileName = (name: string) => {
	return name.replace(/\/$/, ''); // ! Removes "/" at the end of the name
	// return name;
	// return name.replace(/[\\/]/g, '').replace(/^\./, '');
};

export const isDirectory = (_path: string) => {
	const fullPath = `${SEND_PATH}/${_path}`;
	if (!fs.existsSync(fullPath)) return false;
	return fs.statSync(fullPath)?.isDirectory();
};

export const getAllFiles = (
	dirPath: string,
	arrayOfFiles: string[] = [],
): string[] => {
	const files = fs.readdirSync(dirPath);

	files.forEach(file => {
		const fullPath = path.join(dirPath, file);
		if (fs.statSync(fullPath).isDirectory()) {
			arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
		} else {
			const cwd = path.resolve(SEND_PATH);
			const relativePath = path.relative(cwd, fullPath);
			arrayOfFiles.push(relativePath);
		}
	});

	return arrayOfFiles;
};

export const getFileType = (_path: string): FileTypes => {
	const stats = fs.statSync(_path);
	if (stats.isDirectory()) return 'folder';
	const extension = path.extname(_path);
	if (!extension) return 'folder';
	return fileTypeMapping[extension] || 'others';
};

export const getFileSize = (_path: string) => {
	if (!fs.existsSync(_path)) return 0;
	const stats = fs.statSync(_path);
	return stats.size;
};

export const getFolderSize = (_path: string) => {
	let totalSize = 0;

	const calculateSize = (filePath: string) => {
		const stats = fs.statSync(filePath);

		if (stats.isDirectory()) {
			const files = fs.readdirSync(filePath);
			files.forEach(file => calculateSize(path.join(filePath, file)));
		} else {
			totalSize += stats.size;
		}
	};

	calculateSize(_path);
	return totalSize;
};

export const fileExists = (filePath: string) => {
	try {
		return fs.existsSync(filePath);
	} catch (err) {
		logError(err);
		return false;
	}
};

export const getDiskSpace = async (): Promise<number> => {
	const drive = path.parse(process.cwd()).root;

	return new Promise((resolve, reject) => {
		statfs(drive, (err, stats) => {
			// log('Total free space', stats.bsize * stats.bfree);
			// log('Available for user', stats.bsize * stats.bavail);
			if (err) {
				reject(err);
			} else {
				resolve(stats.bsize * stats.bavail);
			}
		});
	});
};

export const formatBytes = (bytes: number) => {
	if (bytes === 0) return '0 Byte';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const findLongestString = (strings: string[]): string | null => {
	return strings.reduce(
		(longest, current) => (current.length > longest.length ? current : longest),
		'',
	);
};

export const adjustStringLength = (str: string, length: number): string => {
	if (str.length < length) {
		return str.padEnd(length, ' ');
	} else if (str.length > length) {
		return str.slice(-length);
	} else {
		return str;
	}
};

export const isObjectEmpty = (obj: {[key: string]: any}) => {
	return Object.keys(obj).length === 0;
};
