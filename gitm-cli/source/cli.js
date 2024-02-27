#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';
const cli = meow(`
	Usage
	  $ gitm-cli

	Options
		--name  Your name

	Examples
	  $ gitm-cli --name=Jane
	  Hello, Jane
`, {
    importMeta: import.meta,
    flags: {
        name: {
            type: 'string',
        },
    },
});
render(React.createElement(App, { name: cli.flags.name }));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiLi4vc291cmNlL2NsaS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sS0FBSyxDQUFDO0FBQzNCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLEdBQUcsTUFBTSxVQUFVLENBQUM7QUFHM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUNmOzs7Ozs7Ozs7O0NBVUEsRUFDQTtJQUNDLFVBQVUsRUFBRSxNQUFNLENBQUMsSUFBSTtJQUN2QixLQUFLLEVBQUU7UUFDTixJQUFJLEVBQUU7WUFDTCxJQUFJLEVBQUUsUUFBUTtTQUNkO0tBQ0Q7Q0FDRCxDQUNELENBQUM7QUFDRixNQUFNLENBQUMsb0JBQUMsR0FBRyxJQUFDLElBQUksRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBSSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtyZW5kZXJ9IGZyb20gJ2luayc7XG5pbXBvcnQgbWVvdyBmcm9tICdtZW93JztcbmltcG9ydCBBcHAgZnJvbSAnLi9hcHAuanMnO1xuaW1wb3J0IHR0eSBmcm9tICdub2RlOnR0eSc7XG5cbmNvbnN0IGNsaSA9IG1lb3coXG5cdGBcblx0VXNhZ2Vcblx0ICAkIGdpdG0tY2xpXG5cblx0T3B0aW9uc1xuXHRcdC0tbmFtZSAgWW91ciBuYW1lXG5cblx0RXhhbXBsZXNcblx0ICAkIGdpdG0tY2xpIC0tbmFtZT1KYW5lXG5cdCAgSGVsbG8sIEphbmVcbmAsXG5cdHtcblx0XHRpbXBvcnRNZXRhOiBpbXBvcnQubWV0YSxcblx0XHRmbGFnczoge1xuXHRcdFx0bmFtZToge1xuXHRcdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdH0sXG5cdFx0fSxcblx0fSxcbik7XG5yZW5kZXIoPEFwcCBuYW1lPXtjbGkuZmxhZ3MubmFtZX0gLz4pO1xuIl19