// import {Command} from 'commander';
import fs from 'fs';
import path from 'path';
import yargs, {Arguments, Argv} from 'yargs';
import {hideBin} from 'yargs/helpers';
import express from 'express';
import {useEffect, useMemo} from 'react';
import {$action, $baseInfo, $isDev, $sendingFiles} from '@/stores/baseStore.js';
import {
	cleanFileName,
	fileExists,
	getAllFiles,
	getFileSize,
	getFileType,
	getFolderSize,
} from '@/functions/helper.js';
import {v4 as uuidv4} from 'uuid';
import {log, logError} from '@/functions/log.js';
import {SEND_PATH} from '@/functions/variables.js';
import {SendingFiles} from '@/types/storeTypes.js';

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

							// NOTE: // ! [-KEEP COMMENT-]
							// ! Get all files from the command line
							// const files: any = argv.files?.flatMap(item => {
							// 	if (isDirectory(item)) {
							// 		return getAllFiles(`${SEND_PATH}/${item}`);
							// 	} else {
							// 		return [item];
							// 	}
							// });
							const files = argv.files;

							// TODO:: Pre Check File Exists
							// NOTE: // ! [-KEEP COMMENT-]
							// ! Check if file exists | only for debugging
							// files.forEach((file: string) => {
							// 	log(
							// 		`${
							// 			fileExists(`${SEND_PATH}/${file}`) ? 'Exists' : 'Not Exists'
							// 		}: ${file}`,
							// 	);
							// });

							// ! Create peer transfer info
							const peerTransferInfo = files?.reduce(
								(acc: SendingFiles, uncleanFileName: string, index: number) => {
									const fileName = cleanFileName(uncleanFileName);
									const filePath = path.join(SEND_PATH, fileName);
									const fileType = getFileType(filePath);
									const fileSize =
										fileType == 'folder'
											? getFolderSize(filePath)
											: getFileSize(filePath);
									acc[uuidv4()] = {fileName, fileSize, fileType};
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
			.option('debug', {
				alias: '-d',
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
