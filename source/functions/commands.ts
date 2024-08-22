// import {Command} from 'commander';
import yargs, {Arguments, Argv} from 'yargs';
import {hideBin} from 'yargs/helpers';
import express from 'express';
import {useEffect, useMemo} from 'react';
import {
	$action,
	$baseInfo,
	$sendingFiles,
	SendingFiles,
} from '../stores/baseStore.js';
import {cleanFileName, getFileSize} from './helper.js';
import {v4 as uuidv4} from 'uuid';

type DefaultArgvType = {
	files?: string[];
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
					if (argv.name && argv.name != '') {
						$baseInfo.setKey('MY_NAME', argv.name);
					}

					if (argv.files && argv.files?.length > 0) {
						$action.set('SEND');

						// $sendingFiles.set(argv.files?.map(file => cleanFileName(file)));
						const peerTransferInfo = argv.files?.reduce(
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
					} else {
						$action.set('RECEIVE');
					}
				},
			)
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
