// import {Command} from 'commander';
import yargs from 'yargs';
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
		// const argv = yargs(hideBin(process.argv)).argv;
		// console.log(argv);

		const argv = yargs(hideBin(process.argv))
			.command(
				'serve [port]',
				'start the server',
				yargs => {
					return yargs.positional('port', {
						describe: 'port to bind on',
						default: 5000,
					});
				},
				argv => {
					if (argv['verbose']) console.info(`start server on :${argv.port}`);
				},
			)
			.option('verbose', {
				alias: 'v',
				type: 'boolean',
				description: 'Run with verbose logging',
			})
			.parse();

		// console.log(argv['_']);

		return () => {};
	}, []);

	return {};
};

// ! bomba
// ! bomba --version
// ! bomba --name Mr. Ghost | bomba --name "Mr. Ghost"
