import React from 'react';
import {Box, Text} from 'ink';
import SenderList from '../Misc/SenderList.js';
import {Spinner} from '../Misc/Spinner.js';

const Sender = () => {
	return (
		<Box flexDirection="column">
			<Text>
				<Spinner /> Sending
			</Text>
			{/* <SenderList /> */}
		</Box>
	);
};

export default Sender;
