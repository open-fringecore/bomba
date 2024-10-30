import React, {useEffect, useMemo} from 'react';
import SendArrowAnimation from '@/components/Misc/SendArrowAnimation.js';
import {Box, Text} from 'ink';
import {useStore} from '@nanostores/react';
import {$currTotalDownload, $currTransfer} from '@/stores/fileHandlerStore.js';
import {formatBytes} from '@/functions/helper.js';
import ProgressBar from '@/components/Misc/ProgressBar.js';

const FileTransferForSender = () => {
	const currTransfer = useStore($currTransfer);
	const currTotalDownload = useStore($currTotalDownload);

	const totalProgress = useMemo(() => {
		return Math.min(
			(currTotalDownload / currTransfer.totalFileSize) * 100,
			100,
		);
	}, [currTotalDownload, currTransfer.totalFileSize]);

	const isTransferComplete = useMemo(
		() => totalProgress == 100,
		[totalProgress],
	);

	return (
		<Box flexDirection="column">
			<Box flexDirection="column">
				{isTransferComplete ? (
					<Text dimColor={true}>Files Transfer Complete 🎉</Text>
				) : (
					<Text>
						SENDING⠀
						<SendArrowAnimation />
					</Text>
				)}
				<Box>
					<ProgressBar left={0} percent={totalProgress ?? 0} />
					<Text dimColor={true}>
						⠀({formatBytes(currTotalDownload)}⠀/⠀
						{formatBytes(currTransfer.totalFileSize)})
					</Text>
				</Box>
			</Box>

			{/* <Box
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
			</Box> */}
		</Box>
	);
};

export default FileTransferForSender;
