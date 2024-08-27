import * as fs from 'fs';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import chalk from 'chalk';

export const logError = (...args: any) => {
	console.log(chalk.bgRed('ERROR:'));
	console.log(...args);
};

export const log = (...args: any) => {
	console.log(...args);
};

export const logToFile = (...data: any[]): void => {
	const filePath = `${process.cwd()}/log.txt`;

	fs.appendFile(
		filePath,
		'〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄\n',
		err => {
			if (err) {
				logError('Failed to write to file:', err);
			}
		},
	);

	const output = data
		.map(item =>
			typeof item === 'object' ? JSON.stringify(item, null, 2) : item,
		)
		.join(' ');

	const logEntry = `${output}\n`;

	fs.appendFile(filePath, logEntry, err => {
		if (err) {
			// logError('Failed to write to file:', err);
		}
	});
};
