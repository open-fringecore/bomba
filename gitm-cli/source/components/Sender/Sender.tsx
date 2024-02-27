import React from 'react';
import {Box, Text} from 'ink';
import SenderList from '../Misc/SenderList.js';
import {Spinner} from '../Misc/Spinner.js';

const Sender = () => {
	const path = '/home/rifat/Works/gitm/gitm-cli/send_files' || process.cwd(); // FIXME: FIX Static
	const fileName = process.argv[3];
	const filePath = `${path}/${fileName}`;

	return (
		<Box flexDirection="column">
			<Text>
				<Spinner /> Sending
			</Text>
		</Box>
	);
};

export default Sender;
