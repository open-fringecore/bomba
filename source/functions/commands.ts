import {Command} from 'commander';
import express from 'express';
import {useEffect, useMemo} from 'react';
import {$action, $sendingFiles} from '../stores/baseStore.js';

export const useCommands = () => {
	// const commands = useMemo(() => process.argv?.slice(2), []);

	useEffect(() => {
		const program = new Command();

		program
			.name('bomba')
			.description('A CLI tool to do cool stuffs.')
			.version('1.0.0')
			.option('-n, --name <char>', "Change peer's name")
			.arguments('[files...]')
			.action((files, options) => {
				if (options.name) {
					console.log(`Hey, ${options.name}\n`);
				}

				if (files) {
					console.log('Files:', files, '\n');
					$action.set('SEND');
					$sendingFiles.set(files);
				} else {
					console.log('Waiting to receive.\n');
					$action.set('RECEIVE');
				}
			});

		program.parse();

		return () => {};
	}, []);

	return {};
};

// ! bomba --version
// ! bomba --name Mr. Ghost | bomba --name "Mr. Ghost"
// ! bomba
