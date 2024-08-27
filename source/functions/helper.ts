import {logError} from '@/functions/log.js';
import {SEND_PATH} from '@/functions/variables.js';
import fs, {statfs} from 'fs';
import path from 'path';

export function getRandomBanglaName() {
	const names = [
		'অনিক',
		'বৃষ্টি',
		'চৈতি',
		'দীপন',
		'এলিনা',
		'ফাহিম',
		'গার্গী',
		'হৃদয়',
		'ইমরান',
		'জাহিদ',
	];

	const randomIndex = Math.floor(Math.random() * names.length);

	return names[randomIndex];
}

export const hasNullValue = (obj: {[key: string]: any}): boolean => {
	return Object.values(obj).some(value => value === null);
};

export const cleanFileName = (name: string) => {
	return name;
	// return name.replace(/[\\/]/g, '').replace(/^\./, '');
};

export const isDirectory = (_path: string) => {
	const fullPath = `${SEND_PATH}/${_path}`;
	return fs.statSync(fullPath).isDirectory();
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
			arrayOfFiles.push(fullPath);
		}
	});

	return arrayOfFiles;
};

// TODO:: Fix
export const getFileSize = (fileName: string) => {
	return 99999;
};

export const fileExists = (filePath: string) => {
	try {
		return fs.existsSync(filePath);
	} catch (err) {
		logError('Error checking file existence:', err);
		return false;
	}
};

export const getDiskSpace = async (): Promise<number> => {
	const drive = path.parse(process.cwd()).root;

	return new Promise((resolve, reject) => {
		statfs(drive, (err, stats) => {
			// console.log('Total free space', stats.bsize * stats.bfree);
			// console.log('Available for user', stats.bsize * stats.bavail);
			if (err) {
				reject(err);
			} else {
				resolve(stats.bsize * stats.bavail);
			}
		});
	});
};
