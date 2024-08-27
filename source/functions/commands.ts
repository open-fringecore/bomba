// import {Command} from 'commander';
import fs from 'fs';
import path from 'path';
import yargs, {Arguments, Argv} from 'yargs';
import {hideBin} from 'yargs/helpers';
import express from 'express';
import {useEffect, useMemo} from 'react';
import {
	$action,
	$baseInfo,
	$isDev,
	$sendingFiles,
	SendingFiles,
} from '@/stores/baseStore.js';
import {
	cleanFileName,
	getAllFiles,
	getFileSize,
	isDirectory,
} from '@/functions/helper.js';
import {v4 as uuidv4} from 'uuid';
import {logError, logToFile} from '@/functions/log.js';
import {SEND_PATH} from '@/functions/variables.js';

type DefaultArgvType = {
	files?: string[];
	version?: boolean;
	dev_mode?: boolean;
	name?: string;
	[x: string]: any;
};
export const useCommands = () => {
	useEffect(() => {
		yargs(hideBin(process.argv))
			.command(
				'chat',
				'start chat',
				yargs => {
					return yargs.positional('name', {
						describe: 'a future chat feature',
						type: 'string',
					});
				},
				argv => {
					console.info('Chat command:', argv);
				},
			)
			.command(
				'* [files...]',
				'Handles file operations',
				(yargs: any) => {
					return yargs.positional('files', {
						describe: 'Optional list of files',
						type: 'string',
					});
				},
				(argv: DefaultArgvType) => {
					if (argv.dev_mode) {
						$isDev.set(true);
					}
					if (argv.name && argv.name != '') {
						$baseInfo.setKey('MY_NAME', argv.name);
					}

					if (argv.files && argv.files?.length > 0) {
						try {
							$action.set('SEND');

							const files: any = argv.files?.flatMap(item => {
								if (isDirectory(item)) {
									return getAllFiles(`${SEND_PATH}/${item}`);
								} else {
									return [item];
								}
							});

							const peerTransferInfo = files?.reduce(
								(acc: SendingFiles, uncleanFileName: string, index: number) => {
									const fileName = cleanFileName(uncleanFileName);
									acc[uuidv4()] = {
										fileName: fileName,
										fileSize: getFileSize(fileName),
									};
									return acc;
								},
								{},
							);
							$sendingFiles.set(peerTransferInfo);
						} catch (error) {
							logError(error);
						}
					} else {
						$action.set('RECEIVE');
					}
				},
			)
			// .option('version', {
			// 	alias: 'v',
			// 	type: 'boolean',
			// 	description: 'Get the current installed version.',
			// })
			.option('dev_mode', {
				alias: 'dev',
				type: 'boolean',
				description: 'Start with debug mode.',
			})
			.option('name', {
				alias: 'n',
				type: 'string',
				description: 'Enter name for this instance.',
			})
			.parse();

		return () => {};
	}, []);

	return {};
};

// ! khamba
// ! khamba --version
// ! khamba --name Mr. Ghost | khamba --name "Mr. Ghost"
// ! khamba .\Brain.png .\brainfuck_code.png
