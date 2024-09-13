#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
import tty from 'node:tty';

const cli = meow(
	`
	khamba - A tool for sending and receiving files via local network.

	Usage:
		TO SEND:
			$ khamba file1.jpg folder01/file2.mp4 ../folder02/file3.mp4

		TO RECEIVE:
			$ khamba

	Options:
		-n, --name      Your preferred name
		-v, --version   Show version number

	Examples:
		$ khamba --name=Jane
		⢎⡑ Receiving...

		$ khamba -n I_AM_GROOT file1.jpg folder01/file2.mp4 ../folder02/file3.mp4
		⢎⡑ Sending...
`,
	{
		importMeta: import.meta,
		flags: {
			name: {
				type: 'string',
			},
			version: {
				type: 'boolean',
				alias: 'v',
			},
		},
	},
);

if (cli.flags.version) {
	console.log(`version: ${cli.pkg?.version || 'unknown'}`);
	process.exit(0);
}

render(<App name={cli.flags.name} />);
