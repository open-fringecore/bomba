#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
import tty from 'node:tty';

const cli = meow(
	`
	Usage
	  $ bomba

	Options
		--name  Your name

	Examples
	  $ bomba --name=Jane
	  Hello, Jane
`,
	{
		importMeta: import.meta,
		flags: {
			name: {
				type: 'string',
			},
		},
	},
);
render(<App name={cli.flags.name} />);
