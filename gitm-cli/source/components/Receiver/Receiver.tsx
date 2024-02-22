import React from 'react';
import {Box, Text} from 'ink';
import {Spinner} from '../Misc/Spinner.js';

const Receiver = () => {
	return (
		<Box flexDirection="column">
			<Text>
				<Spinner /> Receiving
			</Text>
			{/* <SenderList /> */}
		</Box>
	);
};

export default Receiver;
