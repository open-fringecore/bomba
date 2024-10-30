import * as fs from 'fs';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import chalk from 'chalk';

export const logError = (...args: any) => {
	console.log(chalk.bgRed(' MY ERROR:'));

	// ! ------------------------ Error Tracing -----------------------
	const error = new Error();
	const stackLines = error.stack?.split('\n');

	if (stackLines) {
		// The third line in the stack trace usually has the caller info
		const callerLine = stackLines[2] || stackLines[1];

		// Regular expression to match file name and line number
		const match = callerLine?.match(/at (.+):(\d+):\d+/);

		if (match) {
			console.log(chalk.bgGreen(' FILE:'), match[1]);
			console.log(chalk.bgYellow(' LINE:'), parseInt(match[2]!, 10));
		}
	} else {
		console.log('No stackLines');
	}
	// ! ------------------------ Error Tracing -----------------------

	console.log(...args);
};

export const log = (...args: any) => {
	// console.log(...args);
};

export const logToFile = (...data: any[]): void => {
	const filePath = `${process.cwd()}/log.txt`;

	// fs.appendFile(
	// 	filePath,
	// 	'〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄〄\n',
	// 	err => {
	// 		if (err) {
	// 			logError('Failed to write to file:', err);
	// 		}
	// 	},
	// );

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
