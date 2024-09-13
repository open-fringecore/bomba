#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
import tty from 'node:tty';

const cli = meow(
	`
	Usage
	  $ khamba

	Options
		--name  Your name
		-v, --version  Show version number

	Examples
	  $ khamba --name=Jane
	  Hello, Jane
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
