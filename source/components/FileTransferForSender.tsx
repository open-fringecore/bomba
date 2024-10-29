import React from 'react';
import SendArrowAnimation from '@/components/Misc/SendArrowAnimation.js';
import {Box, Text} from 'ink';

const FileTransferForSender = () => {
	return (
		<Box>
			<Text>
				SENDING⠀
				<SendArrowAnimation />
			</Text>
		</Box>
	);
};

export default FileTransferForSender;
