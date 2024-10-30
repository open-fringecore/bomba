import React, {useEffect} from 'react';
import SendArrowAnimation from '@/components/Misc/SendArrowAnimation.js';
import {Box, Text} from 'ink';
import {useStore} from '@nanostores/react';
import {$currTransfer} from '@/stores/fileHandlerStore.js';

const FileTransferForSender = () => {
	const currTransfer = useStore($currTransfer);

	useEffect(() => {
		console.log('currTransfer', currTransfer);
	}, [currTransfer]);

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
