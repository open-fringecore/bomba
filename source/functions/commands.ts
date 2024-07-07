// import {Command} from 'commander';
import yargs, {Arguments} from 'yargs';
import {hideBin} from 'yargs/helpers';
import express from 'express';
import {useEffect, useMemo} from 'react';
import {$action, $sendingFiles} from '../stores/baseStore.js';

export const useCommands = () => {
	// const commands = useMemo(() => process.argv?.slice(2), []);

	// useEffect(() => {
	// 	const program = new Command();

	// 	program
	// 		.name('bomba')
	// 		.description('A CLI tool to do cool stuffs.')
	// 		.version('1.0.0')
	// 		.option('-n, --name <char>', "Change peer's name")
	// 		.arguments('[files...]')
	// 		.action((files, options) => {
	// 			if (options.name) {
	// 				console.log(`Hey, ${options.name}\n`);
	// 			}

	// 			if (files && files.length > 0) {
	// 				console.log('Files:', files, '\n');
	// 				$action.set('SEND');
	// 				$sendingFiles.set(files);
	// 			} else {
	// 				console.log('Waiting to receive.\n');
	// 				$action.set('RECEIVE');
	// 			}
	// 		});

	// 	program.parse();

	// 	return () => {};
	// }, []);

	useEffect(() => {
		// ! TEST: pnpm start .\Brain.png .\brainfuck_code.png
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
				yargs => {
					return yargs.positional('files', {
						describe: 'Optional list of files',
						type: 'string',
					});
				},
				argv => {
					console.info('Command:', argv);

					if (argv.files && argv.files?.length > 0) {
						console.log('Sending');
						$action.set('SEND');
					} else {
						console.log('Receiving');
					}
				},
			)
			.parse();

		return () => {};
	}, []);

	return {};
};

// ! bomba
// ! bomba --version
// ! bomba --name Mr. Ghost | bomba --name "Mr. Ghost"
