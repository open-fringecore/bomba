import React, {useEffect} from 'react';
import SendArrowAnimation from '@/components/Misc/SendArrowAnimation.js';
import {Box, Text} from 'ink';
import {useStore} from '@nanostores/react';
import {$currTotalDownload, $currTransfer} from '@/stores/fileHandlerStore.js';
import {formatBytes} from '@/functions/helper.js';

const FileTransferForSender = () => {
	const currTransfer = useStore($currTransfer);
	const currTotalDownload = useStore($currTotalDownload);

	// useEffect(() => {
	// 	console.log('currTransfer', currTransfer);
	// }, [currTransfer]);

	return (
		<Box flexDirection="column">
			<Box flexDirection="row">
				<Text>
					SENDING⠀
					<SendArrowAnimation />
				</Text>
			</Box>

			<Box
				borderColor="green"
				borderStyle="bold"
				paddingX={1}
				flexDirection="column"
				marginTop={1}
			>
				<Box flexDirection="column">
					<Text backgroundColor="green" color="white" bold>
						{' '}
						{currTransfer.peerInfo.peerName}{' '}
					</Text>
				</Box>

				<Text dimColor={true}>
					⠀({formatBytes(currTotalDownload)}⠀/⠀
					{formatBytes(currTransfer.totalFileSize)})
				</Text>
			</Box>
		</Box>
	);
};

export default FileTransferForSender;
